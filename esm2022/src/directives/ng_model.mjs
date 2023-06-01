/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { booleanAttribute, ChangeDetectorRef, Directive, EventEmitter, forwardRef, Host, Inject, Input, Optional, Output, Self } from '@angular/core';
import { FormControl } from '../model/form_control';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { AbstractFormGroupDirective } from './abstract_form_group_directive';
import { ControlContainer } from './control_container';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import { NgForm } from './ng_form';
import { NgModelGroup } from './ng_model_group';
import { CALL_SET_DISABLED_STATE, controlPath, isPropertyUpdated, selectValueAccessor, setUpControl } from './shared';
import { formGroupNameException, missingNameException, modelParentException } from './template_driven_errors';
import * as i0 from "@angular/core";
import * as i1 from "./control_container";
const formControlBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => NgModel)
};
/**
 * `ngModel` forces an additional change detection run when its inputs change:
 * E.g.:
 * ```
 * <div>{{myModel.valid}}</div>
 * <input [(ngModel)]="myValue" #myModel="ngModel">
 * ```
 * I.e. `ngModel` can export itself on the element and then be used in the template.
 * Normally, this would result in expressions before the `input` that use the exported directive
 * to have an old value as they have been
 * dirty checked before. As this is a very common case for `ngModel`, we added this second change
 * detection run.
 *
 * Notes:
 * - this is just one extra run no matter how many `ngModel`s have been changed.
 * - this is a general problem when using `exportAs` for directives!
 */
const resolvedPromise = (() => Promise.resolve())();
/**
 * @description
 * Creates a `FormControl` instance from a [domain
 * model](https://en.wikipedia.org/wiki/Domain_model) and binds it to a form control element.
 *
 * The `FormControl` instance tracks the value, user interaction, and
 * validation status of the control and keeps the view synced with the model. If used
 * within a parent form, the directive also registers itself with the form as a child
 * control.
 *
 * This directive is used by itself or as part of a larger form. Use the
 * `ngModel` selector to activate it.
 *
 * It accepts a domain model as an optional `Input`. If you have a one-way binding
 * to `ngModel` with `[]` syntax, changing the domain model's value in the component
 * class sets the value in the view. If you have a two-way binding with `[()]` syntax
 * (also known as 'banana-in-a-box syntax'), the value in the UI always syncs back to
 * the domain model in your class.
 *
 * To inspect the properties of the associated `FormControl` (like the validity state),
 * export the directive into a local template variable using `ngModel` as the key (ex:
 * `#myVar="ngModel"`). You can then access the control using the directive's `control` property.
 * However, the most commonly used properties (like `valid` and `dirty`) also exist on the control
 * for direct access. See a full list of properties directly available in
 * `AbstractControlDirective`.
 *
 * @see `RadioControlValueAccessor`
 * @see `SelectControlValueAccessor`
 *
 * @usageNotes
 *
 * ### Using ngModel on a standalone control
 *
 * The following examples show a simple standalone control using `ngModel`:
 *
 * {@example forms/ts/simpleNgModel/simple_ng_model_example.ts region='Component'}
 *
 * When using the `ngModel` within `<form>` tags, you'll also need to supply a `name` attribute
 * so that the control can be registered with the parent form under that name.
 *
 * In the context of a parent form, it's often unnecessary to include one-way or two-way binding,
 * as the parent form syncs the value for you. You access its properties by exporting it into a
 * local template variable using `ngForm` such as (`#f="ngForm"`). Use the variable where
 * needed on form submission.
 *
 * If you do need to populate initial values into your form, using a one-way binding for
 * `ngModel` tends to be sufficient as long as you use the exported form's value rather
 * than the domain model's value on submit.
 *
 * ### Using ngModel within a form
 *
 * The following example shows controls using `ngModel` within a form:
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Using a standalone ngModel within a group
 *
 * The following example shows you how to use a standalone ngModel control
 * within a form. This controls the display of the form, but doesn't contain form data.
 *
 * ```html
 * <form>
 *   <input name="login" ngModel placeholder="Login">
 *   <input type="checkbox" ngModel [ngModelOptions]="{standalone: true}"> Show more options?
 * </form>
 * <!-- form value: {login: ''} -->
 * ```
 *
 * ### Setting the ngModel `name` attribute through options
 *
 * The following example shows you an alternate way to set the name attribute. Here,
 * an attribute identified as name is used within a custom form control component. To still be able
 * to specify the NgModel's name, you must specify it using the `ngModelOptions` input instead.
 *
 * ```html
 * <form>
 *   <my-custom-form-control name="Nancy" ngModel [ngModelOptions]="{name: 'user'}">
 *   </my-custom-form-control>
 * </form>
 * <!-- form value: {user: ''} -->
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
class NgModel extends NgControl {
    constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef, callSetDisabledState) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this.callSetDisabledState = callSetDisabledState;
        this.control = new FormControl();
        /** @internal */
        this._registered = false;
        /**
         * @description
         * Tracks the name bound to the directive. If a parent form exists, it
         * uses this name as a key to retrieve this control's value.
         */
        this.name = '';
        /**
         * @description
         * Event emitter for producing the `ngModelChange` event after
         * the view model updates.
         */
        this.update = new EventEmitter();
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._checkForErrors();
        if (!this._registered || 'name' in changes) {
            if (this._registered) {
                this._checkName();
                if (this.formDirective) {
                    // We can't call `formDirective.removeControl(this)`, because the `name` has already been
                    // changed. We also can't reset the name temporarily since the logic in `removeControl`
                    // is inside a promise and it won't run immediately. We work around it by giving it an
                    // object with the same shape instead.
                    const oldName = changes['name'].previousValue;
                    this.formDirective.removeControl({ name: oldName, path: this._getPath(oldName) });
                }
            }
            this._setUpControl();
        }
        if ('isDisabled' in changes) {
            this._updateDisabled(changes);
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            this._updateValue(this.model);
            this.viewModel = this.model;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return this._getPath(this.name);
    }
    /**
     * @description
     * The top-level directive for this control if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value emitted by `ngModelChange`.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _setUpControl() {
        this._setUpdateStrategy();
        this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
        this._registered = true;
    }
    _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
            this.control._updateOn = this.options.updateOn;
        }
    }
    _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
    }
    _setUpStandalone() {
        setUpControl(this.control, this, this.callSetDisabledState);
        this.control.updateValueAndValidity({ emitEvent: false });
    }
    _checkForErrors() {
        if (!this._isStandalone()) {
            this._checkParentType();
        }
        this._checkName();
    }
    _checkParentType() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!(this._parent instanceof NgModelGroup) &&
                this._parent instanceof AbstractFormGroupDirective) {
                throw formGroupNameException();
            }
            else if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
                throw modelParentException();
            }
        }
    }
    _checkName() {
        if (this.options && this.options.name)
            this.name = this.options.name;
        if (!this._isStandalone() && !this.name && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw missingNameException();
        }
    }
    _updateValue(value) {
        resolvedPromise.then(() => {
            this.control.setValue(value, { emitViewToModelChange: false });
            this._changeDetectorRef?.markForCheck();
        });
    }
    _updateDisabled(changes) {
        const disabledValue = changes['isDisabled'].currentValue;
        // checking for 0 to avoid breaking change
        const isDisabled = disabledValue !== 0 && booleanAttribute(disabledValue);
        resolvedPromise.then(() => {
            if (isDisabled && !this.control.disabled) {
                this.control.disable();
            }
            else if (!isDisabled && this.control.disabled) {
                this.control.enable();
            }
            this._changeDetectorRef?.markForCheck();
        });
    }
    _getPath(controlName) {
        return this._parent ? controlPath(controlName, this._parent) : [controlName];
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7f85d08", ngImport: i0, type: NgModel, deps: [{ token: i1.ControlContainer, host: true, optional: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: ChangeDetectorRef, optional: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7f85d08", type: NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: { name: "name", isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"], options: ["ngModelOptions", "options"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding], exportAs: ["ngModel"], usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
export { NgModel };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7f85d08", ngImport: i0, type: NgModel, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngModel]:not([formControlName]):not([formControl])',
                    providers: [formControlBinding],
                    exportAs: 'ngModel'
                }]
        }], ctorParameters: function () { return [{ type: i1.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Host
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_VALUE_ACCESSOR]
                }] }, { type: i0.ChangeDetectorRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ChangeDetectorRef]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CALL_SET_DISABLED_STATE]
                }] }]; }, propDecorators: { name: [{
                type: Input
            }], isDisabled: [{
                type: Input,
                args: ['disabled']
            }], model: [{
                type: Input,
                args: ['ngModel']
            }], options: [{
                type: Input,
                args: ['ngModelOptions']
            }], update: [{
                type: Output,
                args: ['ngModelChange']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXdCLFFBQVEsRUFBRSxNQUFNLEVBQVksSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUduTSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbEQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUMzRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDakYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUEwQixZQUFZLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDNUksT0FBTyxFQUFDLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7OztBQUc1RyxNQUFNLGtCQUFrQixHQUFhO0lBQ25DLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO0NBQ3ZDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNILE1BQU0sZUFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQztBQUVwRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0ZHO0FBQ0gsTUFLYSxPQUFRLFNBQVEsU0FBUztJQW1FcEMsWUFDd0IsTUFBd0IsRUFDRCxVQUFxQyxFQUMvQixlQUNWLEVBQ1EsY0FBc0MsRUFDdEMsa0JBQTJDLEVBQ3JDLG9CQUMzQjtRQUM1QixLQUFLLEVBQUUsQ0FBQztRQUh5Qyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXlCO1FBQ3JDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FDL0M7UUExRUwsWUFBTyxHQUFnQixJQUFJLFdBQVcsRUFBRSxDQUFDO1FBV2xFLGdCQUFnQjtRQUNoQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQVFwQjs7OztXQUlHO1FBQ2UsU0FBSSxHQUFXLEVBQUUsQ0FBQztRQWtDcEM7Ozs7V0FJRztRQUNzQixXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQVluRCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsYUFBYSxHQUFHLG1CQUFtQixDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsYUFBYTtJQUNiLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUMxQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUN0Qix5RkFBeUY7b0JBQ3pGLHVGQUF1RjtvQkFDdkYsc0ZBQXNGO29CQUN0RixzQ0FBc0M7b0JBQ3RDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLENBQUM7b0JBQzlDLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBQyxDQUFDLENBQUM7aUJBQ2pGO2FBQ0Y7WUFDRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7UUFDRCxJQUFJLFlBQVksSUFBSSxPQUFPLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMvQjtRQUVELElBQUksaUJBQWlCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM5QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQsYUFBYTtJQUNiLFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBYSxJQUFJO1FBQ2YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQzFELENBQUM7SUFFRDs7Ozs7T0FLRztJQUNNLGlCQUFpQixDQUFDLFFBQWE7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVPLGFBQWE7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDMUIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQztJQUVPLGFBQWE7UUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRU8sZUFBZTtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxFQUFFO1lBQ2pELElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFlBQVksWUFBWSxDQUFDO2dCQUN2QyxJQUFJLENBQUMsT0FBTyxZQUFZLDBCQUEwQixFQUFFO2dCQUN0RCxNQUFNLHNCQUFzQixFQUFFLENBQUM7YUFDaEM7aUJBQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxNQUFNLENBQUMsRUFBRTtnQkFDdkYsTUFBTSxvQkFBb0IsRUFBRSxDQUFDO2FBQzlCO1NBQ0Y7SUFDSCxDQUFDO0lBRU8sVUFBVTtRQUNoQixJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO1lBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUVyRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRTtZQUMxRixNQUFNLG9CQUFvQixFQUFFLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRU8sWUFBWSxDQUFDLEtBQVU7UUFDN0IsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sZUFBZSxDQUFDLE9BQXNCO1FBQzVDLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUM7UUFDekQsMENBQTBDO1FBQzFDLE1BQU0sVUFBVSxHQUFHLGFBQWEsS0FBSyxDQUFDLElBQUksZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFMUUsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDeEIsSUFBSSxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUN4QjtpQkFBTSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUMvQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3ZCO1lBRUQsSUFBSSxDQUFDLGtCQUFrQixFQUFFLFlBQVksRUFBRSxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFFBQVEsQ0FBQyxXQUFtQjtRQUNsQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQy9FLENBQUM7eUhBdk5VLE9BQU8sOEVBcUVjLGFBQWEseUNBQ2IsbUJBQW1CLHlDQUVuQixpQkFBaUIseUNBQ3pCLGlCQUFpQiw2QkFDakIsdUJBQXVCOzZHQTFFcEMsT0FBTywyUEFIUCxDQUFDLGtCQUFrQixDQUFDOztTQUdwQixPQUFPO3NHQUFQLE9BQU87a0JBTG5CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFEQUFxRDtvQkFDL0QsU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUM7b0JBQy9CLFFBQVEsRUFBRSxTQUFTO2lCQUNwQjs7MEJBcUVNLFFBQVE7OzBCQUFJLElBQUk7OzBCQUNoQixRQUFROzswQkFBSSxJQUFJOzswQkFBSSxNQUFNOzJCQUFDLGFBQWE7OzBCQUN4QyxRQUFROzswQkFBSSxJQUFJOzswQkFBSSxNQUFNOzJCQUFDLG1CQUFtQjs7MEJBRTlDLFFBQVE7OzBCQUFJLElBQUk7OzBCQUFJLE1BQU07MkJBQUMsaUJBQWlCOzswQkFDNUMsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxpQkFBaUI7OzBCQUNwQyxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHVCQUF1Qjs0Q0FoRDdCLElBQUk7c0JBQXJCLEtBQUs7Z0JBT2EsVUFBVTtzQkFBNUIsS0FBSzt1QkFBQyxVQUFVO2dCQU1DLEtBQUs7c0JBQXRCLEtBQUs7dUJBQUMsU0FBUztnQkFtQlMsT0FBTztzQkFBL0IsS0FBSzt1QkFBQyxnQkFBZ0I7Z0JBT0UsTUFBTTtzQkFBOUIsTUFBTTt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Ym9vbGVhbkF0dHJpYnV0ZSwgQ2hhbmdlRGV0ZWN0b3JSZWYsIERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBmb3J3YXJkUmVmLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3B0aW9uYWwsIE91dHB1dCwgUHJvdmlkZXIsIFNlbGYsIFNpbXBsZUNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Zvcm1Ib29rc30gZnJvbSAnLi4vbW9kZWwvYWJzdHJhY3RfbW9kZWwnO1xuaW1wb3J0IHtGb3JtQ29udHJvbH0gZnJvbSAnLi4vbW9kZWwvZm9ybV9jb250cm9sJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4vbmdfY29udHJvbCc7XG5pbXBvcnQge05nRm9ybX0gZnJvbSAnLi9uZ19mb3JtJztcbmltcG9ydCB7TmdNb2RlbEdyb3VwfSBmcm9tICcuL25nX21vZGVsX2dyb3VwJztcbmltcG9ydCB7Q0FMTF9TRVRfRElTQUJMRURfU1RBVEUsIGNvbnRyb2xQYXRoLCBpc1Byb3BlcnR5VXBkYXRlZCwgc2VsZWN0VmFsdWVBY2Nlc3NvciwgU2V0RGlzYWJsZWRTdGF0ZU9wdGlvbiwgc2V0VXBDb250cm9sfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQge2Zvcm1Hcm91cE5hbWVFeGNlcHRpb24sIG1pc3NpbmdOYW1lRXhjZXB0aW9uLCBtb2RlbFBhcmVudEV4Y2VwdGlvbn0gZnJvbSAnLi90ZW1wbGF0ZV9kcml2ZW5fZXJyb3JzJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cbmNvbnN0IGZvcm1Db250cm9sQmluZGluZzogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5nQ29udHJvbCxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdNb2RlbClcbn07XG5cbi8qKlxuICogYG5nTW9kZWxgIGZvcmNlcyBhbiBhZGRpdGlvbmFsIGNoYW5nZSBkZXRlY3Rpb24gcnVuIHdoZW4gaXRzIGlucHV0cyBjaGFuZ2U6XG4gKiBFLmcuOlxuICogYGBgXG4gKiA8ZGl2Pnt7bXlNb2RlbC52YWxpZH19PC9kaXY+XG4gKiA8aW5wdXQgWyhuZ01vZGVsKV09XCJteVZhbHVlXCIgI215TW9kZWw9XCJuZ01vZGVsXCI+XG4gKiBgYGBcbiAqIEkuZS4gYG5nTW9kZWxgIGNhbiBleHBvcnQgaXRzZWxmIG9uIHRoZSBlbGVtZW50IGFuZCB0aGVuIGJlIHVzZWQgaW4gdGhlIHRlbXBsYXRlLlxuICogTm9ybWFsbHksIHRoaXMgd291bGQgcmVzdWx0IGluIGV4cHJlc3Npb25zIGJlZm9yZSB0aGUgYGlucHV0YCB0aGF0IHVzZSB0aGUgZXhwb3J0ZWQgZGlyZWN0aXZlXG4gKiB0byBoYXZlIGFuIG9sZCB2YWx1ZSBhcyB0aGV5IGhhdmUgYmVlblxuICogZGlydHkgY2hlY2tlZCBiZWZvcmUuIEFzIHRoaXMgaXMgYSB2ZXJ5IGNvbW1vbiBjYXNlIGZvciBgbmdNb2RlbGAsIHdlIGFkZGVkIHRoaXMgc2Vjb25kIGNoYW5nZVxuICogZGV0ZWN0aW9uIHJ1bi5cbiAqXG4gKiBOb3RlczpcbiAqIC0gdGhpcyBpcyBqdXN0IG9uZSBleHRyYSBydW4gbm8gbWF0dGVyIGhvdyBtYW55IGBuZ01vZGVsYHMgaGF2ZSBiZWVuIGNoYW5nZWQuXG4gKiAtIHRoaXMgaXMgYSBnZW5lcmFsIHByb2JsZW0gd2hlbiB1c2luZyBgZXhwb3J0QXNgIGZvciBkaXJlY3RpdmVzIVxuICovXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSAoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKCkpKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBmcm9tIGEgW2RvbWFpblxuICogbW9kZWxdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0RvbWFpbl9tb2RlbCkgYW5kIGJpbmRzIGl0IHRvIGEgZm9ybSBjb250cm9sIGVsZW1lbnQuXG4gKlxuICogVGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgdHJhY2tzIHRoZSB2YWx1ZSwgdXNlciBpbnRlcmFjdGlvbiwgYW5kXG4gKiB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbCBhbmQga2VlcHMgdGhlIHZpZXcgc3luY2VkIHdpdGggdGhlIG1vZGVsLiBJZiB1c2VkXG4gKiB3aXRoaW4gYSBwYXJlbnQgZm9ybSwgdGhlIGRpcmVjdGl2ZSBhbHNvIHJlZ2lzdGVycyBpdHNlbGYgd2l0aCB0aGUgZm9ybSBhcyBhIGNoaWxkXG4gKiBjb250cm9sLlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHVzZWQgYnkgaXRzZWxmIG9yIGFzIHBhcnQgb2YgYSBsYXJnZXIgZm9ybS4gVXNlIHRoZVxuICogYG5nTW9kZWxgIHNlbGVjdG9yIHRvIGFjdGl2YXRlIGl0LlxuICpcbiAqIEl0IGFjY2VwdHMgYSBkb21haW4gbW9kZWwgYXMgYW4gb3B0aW9uYWwgYElucHV0YC4gSWYgeW91IGhhdmUgYSBvbmUtd2F5IGJpbmRpbmdcbiAqIHRvIGBuZ01vZGVsYCB3aXRoIGBbXWAgc3ludGF4LCBjaGFuZ2luZyB0aGUgZG9tYWluIG1vZGVsJ3MgdmFsdWUgaW4gdGhlIGNvbXBvbmVudFxuICogY2xhc3Mgc2V0cyB0aGUgdmFsdWUgaW4gdGhlIHZpZXcuIElmIHlvdSBoYXZlIGEgdHdvLXdheSBiaW5kaW5nIHdpdGggYFsoKV1gIHN5bnRheFxuICogKGFsc28ga25vd24gYXMgJ2JhbmFuYS1pbi1hLWJveCBzeW50YXgnKSwgdGhlIHZhbHVlIGluIHRoZSBVSSBhbHdheXMgc3luY3MgYmFjayB0b1xuICogdGhlIGRvbWFpbiBtb2RlbCBpbiB5b3VyIGNsYXNzLlxuICpcbiAqIFRvIGluc3BlY3QgdGhlIHByb3BlcnRpZXMgb2YgdGhlIGFzc29jaWF0ZWQgYEZvcm1Db250cm9sYCAobGlrZSB0aGUgdmFsaWRpdHkgc3RhdGUpLFxuICogZXhwb3J0IHRoZSBkaXJlY3RpdmUgaW50byBhIGxvY2FsIHRlbXBsYXRlIHZhcmlhYmxlIHVzaW5nIGBuZ01vZGVsYCBhcyB0aGUga2V5IChleDpcbiAqIGAjbXlWYXI9XCJuZ01vZGVsXCJgKS4gWW91IGNhbiB0aGVuIGFjY2VzcyB0aGUgY29udHJvbCB1c2luZyB0aGUgZGlyZWN0aXZlJ3MgYGNvbnRyb2xgIHByb3BlcnR5LlxuICogSG93ZXZlciwgdGhlIG1vc3QgY29tbW9ubHkgdXNlZCBwcm9wZXJ0aWVzIChsaWtlIGB2YWxpZGAgYW5kIGBkaXJ0eWApIGFsc28gZXhpc3Qgb24gdGhlIGNvbnRyb2xcbiAqIGZvciBkaXJlY3QgYWNjZXNzLiBTZWUgYSBmdWxsIGxpc3Qgb2YgcHJvcGVydGllcyBkaXJlY3RseSBhdmFpbGFibGUgaW5cbiAqIGBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmVgLlxuICpcbiAqIEBzZWUgYFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3JgXG4gKiBAc2VlIGBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvcmBcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBVc2luZyBuZ01vZGVsIG9uIGEgc3RhbmRhbG9uZSBjb250cm9sXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlcyBzaG93IGEgc2ltcGxlIHN0YW5kYWxvbmUgY29udHJvbCB1c2luZyBgbmdNb2RlbGA6XG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZU5nTW9kZWwvc2ltcGxlX25nX21vZGVsX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIFdoZW4gdXNpbmcgdGhlIGBuZ01vZGVsYCB3aXRoaW4gYDxmb3JtPmAgdGFncywgeW91J2xsIGFsc28gbmVlZCB0byBzdXBwbHkgYSBgbmFtZWAgYXR0cmlidXRlXG4gKiBzbyB0aGF0IHRoZSBjb250cm9sIGNhbiBiZSByZWdpc3RlcmVkIHdpdGggdGhlIHBhcmVudCBmb3JtIHVuZGVyIHRoYXQgbmFtZS5cbiAqXG4gKiBJbiB0aGUgY29udGV4dCBvZiBhIHBhcmVudCBmb3JtLCBpdCdzIG9mdGVuIHVubmVjZXNzYXJ5IHRvIGluY2x1ZGUgb25lLXdheSBvciB0d28td2F5IGJpbmRpbmcsXG4gKiBhcyB0aGUgcGFyZW50IGZvcm0gc3luY3MgdGhlIHZhbHVlIGZvciB5b3UuIFlvdSBhY2Nlc3MgaXRzIHByb3BlcnRpZXMgYnkgZXhwb3J0aW5nIGl0IGludG8gYVxuICogbG9jYWwgdGVtcGxhdGUgdmFyaWFibGUgdXNpbmcgYG5nRm9ybWAgc3VjaCBhcyAoYCNmPVwibmdGb3JtXCJgKS4gVXNlIHRoZSB2YXJpYWJsZSB3aGVyZVxuICogbmVlZGVkIG9uIGZvcm0gc3VibWlzc2lvbi5cbiAqXG4gKiBJZiB5b3UgZG8gbmVlZCB0byBwb3B1bGF0ZSBpbml0aWFsIHZhbHVlcyBpbnRvIHlvdXIgZm9ybSwgdXNpbmcgYSBvbmUtd2F5IGJpbmRpbmcgZm9yXG4gKiBgbmdNb2RlbGAgdGVuZHMgdG8gYmUgc3VmZmljaWVudCBhcyBsb25nIGFzIHlvdSB1c2UgdGhlIGV4cG9ydGVkIGZvcm0ncyB2YWx1ZSByYXRoZXJcbiAqIHRoYW4gdGhlIGRvbWFpbiBtb2RlbCdzIHZhbHVlIG9uIHN1Ym1pdC5cbiAqXG4gKiAjIyMgVXNpbmcgbmdNb2RlbCB3aXRoaW4gYSBmb3JtXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGNvbnRyb2xzIHVzaW5nIGBuZ01vZGVsYCB3aXRoaW4gYSBmb3JtOlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtL3NpbXBsZV9mb3JtX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqICMjIyBVc2luZyBhIHN0YW5kYWxvbmUgbmdNb2RlbCB3aXRoaW4gYSBncm91cFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyB5b3UgaG93IHRvIHVzZSBhIHN0YW5kYWxvbmUgbmdNb2RlbCBjb250cm9sXG4gKiB3aXRoaW4gYSBmb3JtLiBUaGlzIGNvbnRyb2xzIHRoZSBkaXNwbGF5IG9mIHRoZSBmb3JtLCBidXQgZG9lc24ndCBjb250YWluIGZvcm0gZGF0YS5cbiAqXG4gKiBgYGBodG1sXG4gKiA8Zm9ybT5cbiAqICAgPGlucHV0IG5hbWU9XCJsb2dpblwiIG5nTW9kZWwgcGxhY2Vob2xkZXI9XCJMb2dpblwiPlxuICogICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmdNb2RlbCBbbmdNb2RlbE9wdGlvbnNdPVwie3N0YW5kYWxvbmU6IHRydWV9XCI+IFNob3cgbW9yZSBvcHRpb25zP1xuICogPC9mb3JtPlxuICogPCEtLSBmb3JtIHZhbHVlOiB7bG9naW46ICcnfSAtLT5cbiAqIGBgYFxuICpcbiAqICMjIyBTZXR0aW5nIHRoZSBuZ01vZGVsIGBuYW1lYCBhdHRyaWJ1dGUgdGhyb3VnaCBvcHRpb25zXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBhbiBhbHRlcm5hdGUgd2F5IHRvIHNldCB0aGUgbmFtZSBhdHRyaWJ1dGUuIEhlcmUsXG4gKiBhbiBhdHRyaWJ1dGUgaWRlbnRpZmllZCBhcyBuYW1lIGlzIHVzZWQgd2l0aGluIGEgY3VzdG9tIGZvcm0gY29udHJvbCBjb21wb25lbnQuIFRvIHN0aWxsIGJlIGFibGVcbiAqIHRvIHNwZWNpZnkgdGhlIE5nTW9kZWwncyBuYW1lLCB5b3UgbXVzdCBzcGVjaWZ5IGl0IHVzaW5nIHRoZSBgbmdNb2RlbE9wdGlvbnNgIGlucHV0IGluc3RlYWQuXG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0+XG4gKiAgIDxteS1jdXN0b20tZm9ybS1jb250cm9sIG5hbWU9XCJOYW5jeVwiIG5nTW9kZWwgW25nTW9kZWxPcHRpb25zXT1cIntuYW1lOiAndXNlcid9XCI+XG4gKiAgIDwvbXktY3VzdG9tLWZvcm0tY29udHJvbD5cbiAqIDwvZm9ybT5cbiAqIDwhLS0gZm9ybSB2YWx1ZToge3VzZXI6ICcnfSAtLT5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdNb2RlbF06bm90KFtmb3JtQ29udHJvbE5hbWVdKTpub3QoW2Zvcm1Db250cm9sXSknLFxuICBwcm92aWRlcnM6IFtmb3JtQ29udHJvbEJpbmRpbmddLFxuICBleHBvcnRBczogJ25nTW9kZWwnXG59KVxuZXhwb3J0IGNsYXNzIE5nTW9kZWwgZXh0ZW5kcyBOZ0NvbnRyb2wgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHB1YmxpYyBvdmVycmlkZSByZWFkb25seSBjb250cm9sOiBGb3JtQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuXG4gIC8vIEF0IHJ1bnRpbWUgd2UgY29lcmNlIGFyYml0cmFyeSB2YWx1ZXMgYXNzaWduZWQgdG8gdGhlIFwiZGlzYWJsZWRcIiBpbnB1dCB0byBhIFwiYm9vbGVhblwiLlxuICAvLyBUaGlzIGlzIG5vdCByZWZsZWN0ZWQgaW4gdGhlIHR5cGUgb2YgdGhlIHByb3BlcnR5IGJlY2F1c2Ugb3V0c2lkZSBvZiB0ZW1wbGF0ZXMsIGNvbnN1bWVyc1xuICAvLyBzaG91bGQgb25seSBkZWFsIHdpdGggYm9vbGVhbnMuIEluIHRlbXBsYXRlcywgYSBzdHJpbmcgaXMgYWxsb3dlZCBmb3IgY29udmVuaWVuY2UgYW5kIHRvXG4gIC8vIG1hdGNoIHRoZSBuYXRpdmUgXCJkaXNhYmxlZCBhdHRyaWJ1dGVcIiBzZW1hbnRpY3Mgd2hpY2ggY2FuIGJlIG9ic2VydmVkIG9uIGlucHV0IGVsZW1lbnRzLlxuICAvLyBUaGlzIHN0YXRpYyBtZW1iZXIgdGVsbHMgdGhlIGNvbXBpbGVyIHRoYXQgdmFsdWVzIG9mIHR5cGUgXCJzdHJpbmdcIiBjYW4gYWxzbyBiZSBhc3NpZ25lZFxuICAvLyB0byB0aGUgaW5wdXQgaW4gYSB0ZW1wbGF0ZS5cbiAgLyoqIEBub2RvYyAqL1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaXNEaXNhYmxlZDogYm9vbGVhbnxzdHJpbmc7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVnaXN0ZXJlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIHZpZXcgbW9kZWwgdmFsdWUuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgdmlld01vZGVsOiBhbnk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIG5hbWUgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gSWYgYSBwYXJlbnQgZm9ybSBleGlzdHMsIGl0XG4gICAqIHVzZXMgdGhpcyBuYW1lIGFzIGEga2V5IHRvIHJldHJpZXZlIHRoaXMgY29udHJvbCdzIHZhbHVlLlxuICAgKi9cbiAgQElucHV0KCkgb3ZlcnJpZGUgbmFtZTogc3RyaW5nID0gJyc7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3Mgd2hldGhlciB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ2Rpc2FibGVkJykgaXNEaXNhYmxlZCE6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIHZhbHVlIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KCduZ01vZGVsJykgbW9kZWw6IGFueTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGZvciB0aGlzIGBuZ01vZGVsYCBpbnN0YW5jZS5cbiAgICpcbiAgICogKipuYW1lKio6IEFuIGFsdGVybmF0aXZlIHRvIHNldHRpbmcgdGhlIG5hbWUgYXR0cmlidXRlIG9uIHRoZSBmb3JtIGNvbnRyb2wgZWxlbWVudC4gU2VlXG4gICAqIHRoZSBbZXhhbXBsZV0oYXBpL2Zvcm1zL05nTW9kZWwjdXNpbmctbmdtb2RlbC1vbi1hLXN0YW5kYWxvbmUtY29udHJvbCkgZm9yIHVzaW5nIGBOZ01vZGVsYFxuICAgKiBhcyBhIHN0YW5kYWxvbmUgY29udHJvbC5cbiAgICpcbiAgICogKipzdGFuZGFsb25lKio6IFdoZW4gc2V0IHRvIHRydWUsIHRoZSBgbmdNb2RlbGAgd2lsbCBub3QgcmVnaXN0ZXIgaXRzZWxmIHdpdGggaXRzIHBhcmVudCBmb3JtLFxuICAgKiBhbmQgYWN0cyBhcyBpZiBpdCdzIG5vdCBpbiB0aGUgZm9ybS4gRGVmYXVsdHMgdG8gZmFsc2UuIElmIG5vIHBhcmVudCBmb3JtIGV4aXN0cywgdGhpcyBvcHRpb25cbiAgICogaGFzIG5vIGVmZmVjdC5cbiAgICpcbiAgICogKip1cGRhdGVPbioqOiBEZWZpbmVzIHRoZSBldmVudCB1cG9uIHdoaWNoIHRoZSBmb3JtIGNvbnRyb2wgdmFsdWUgYW5kIHZhbGlkaXR5IHVwZGF0ZS5cbiAgICogRGVmYXVsdHMgdG8gJ2NoYW5nZScuIFBvc3NpYmxlIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYC5cbiAgICpcbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ25nTW9kZWxPcHRpb25zJykgb3B0aW9ucyE6IHtuYW1lPzogc3RyaW5nLCBzdGFuZGFsb25lPzogYm9vbGVhbiwgdXBkYXRlT24/OiBGb3JtSG9va3N9O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRXZlbnQgZW1pdHRlciBmb3IgcHJvZHVjaW5nIHRoZSBgbmdNb2RlbENoYW5nZWAgZXZlbnQgYWZ0ZXJcbiAgICogdGhlIHZpZXcgbW9kZWwgdXBkYXRlcy5cbiAgICovXG4gIEBPdXRwdXQoJ25nTW9kZWxDaGFuZ2UnKSB1cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiAoVmFsaWRhdG9yfFZhbGlkYXRvckZuKVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczpcbiAgICAgICAgICAoQXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbilbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxVRV9BQ0NFU1NPUikgdmFsdWVBY2Nlc3NvcnM6IENvbnRyb2xWYWx1ZUFjY2Vzc29yW10sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KENoYW5nZURldGVjdG9yUmVmKSBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZj86IENoYW5nZURldGVjdG9yUmVmfG51bGwsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KENBTExfU0VUX0RJU0FCTEVEX1NUQVRFKSBwcml2YXRlIGNhbGxTZXREaXNhYmxlZFN0YXRlPzpcbiAgICAgICAgICBTZXREaXNhYmxlZFN0YXRlT3B0aW9uKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHRoaXMsIHZhbHVlQWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIHRoaXMuX2NoZWNrRm9yRXJyb3JzKCk7XG4gICAgaWYgKCF0aGlzLl9yZWdpc3RlcmVkIHx8ICduYW1lJyBpbiBjaGFuZ2VzKSB7XG4gICAgICBpZiAodGhpcy5fcmVnaXN0ZXJlZCkge1xuICAgICAgICB0aGlzLl9jaGVja05hbWUoKTtcbiAgICAgICAgaWYgKHRoaXMuZm9ybURpcmVjdGl2ZSkge1xuICAgICAgICAgIC8vIFdlIGNhbid0IGNhbGwgYGZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh0aGlzKWAsIGJlY2F1c2UgdGhlIGBuYW1lYCBoYXMgYWxyZWFkeSBiZWVuXG4gICAgICAgICAgLy8gY2hhbmdlZC4gV2UgYWxzbyBjYW4ndCByZXNldCB0aGUgbmFtZSB0ZW1wb3JhcmlseSBzaW5jZSB0aGUgbG9naWMgaW4gYHJlbW92ZUNvbnRyb2xgXG4gICAgICAgICAgLy8gaXMgaW5zaWRlIGEgcHJvbWlzZSBhbmQgaXQgd29uJ3QgcnVuIGltbWVkaWF0ZWx5LiBXZSB3b3JrIGFyb3VuZCBpdCBieSBnaXZpbmcgaXQgYW5cbiAgICAgICAgICAvLyBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzaGFwZSBpbnN0ZWFkLlxuICAgICAgICAgIGNvbnN0IG9sZE5hbWUgPSBjaGFuZ2VzWyduYW1lJ10ucHJldmlvdXNWYWx1ZTtcbiAgICAgICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh7bmFtZTogb2xkTmFtZSwgcGF0aDogdGhpcy5fZ2V0UGF0aChvbGROYW1lKX0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLl9zZXRVcENvbnRyb2woKTtcbiAgICB9XG4gICAgaWYgKCdpc0Rpc2FibGVkJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl91cGRhdGVEaXNhYmxlZChjaGFuZ2VzKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZSh0aGlzLm1vZGVsKTtcbiAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICB9XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZm9ybURpcmVjdGl2ZSAmJiB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9nZXRQYXRoKHRoaXMubmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGNvbnRyb2wgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwgYW5kIGVtaXRzIGFuIGBuZ01vZGVsQ2hhbmdlYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIG5ld1ZhbHVlIFRoZSBuZXcgdmFsdWUgZW1pdHRlZCBieSBgbmdNb2RlbENoYW5nZWAuXG4gICAqL1xuICBvdmVycmlkZSB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52aWV3TW9kZWwgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFVwQ29udHJvbCgpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSgpO1xuICAgIHRoaXMuX2lzU3RhbmRhbG9uZSgpID8gdGhpcy5fc2V0VXBTdGFuZGFsb25lKCkgOiB0aGlzLmZvcm1EaXJlY3RpdmUuYWRkQ29udHJvbCh0aGlzKTtcbiAgICB0aGlzLl9yZWdpc3RlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFVwZGF0ZVN0cmF0ZWd5KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnVwZGF0ZU9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuY29udHJvbC5fdXBkYXRlT24gPSB0aGlzLm9wdGlvbnMudXBkYXRlT247XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaXNTdGFuZGFsb25lKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5fcGFyZW50IHx8ICEhKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuc3RhbmRhbG9uZSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRVcFN0YW5kYWxvbmUoKTogdm9pZCB7XG4gICAgc2V0VXBDb250cm9sKHRoaXMuY29udHJvbCwgdGhpcywgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSk7XG4gICAgdGhpcy5jb250cm9sLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrRm9yRXJyb3JzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5faXNTdGFuZGFsb25lKCkpIHtcbiAgICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgIH1cbiAgICB0aGlzLl9jaGVja05hbWUoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrUGFyZW50VHlwZSgpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBpZiAoISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBOZ01vZGVsR3JvdXApICYmXG4gICAgICAgICAgdGhpcy5fcGFyZW50IGluc3RhbmNlb2YgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUpIHtcbiAgICAgICAgdGhyb3cgZm9ybUdyb3VwTmFtZUV4Y2VwdGlvbigpO1xuICAgICAgfSBlbHNlIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nTW9kZWxHcm91cCkgJiYgISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBOZ0Zvcm0pKSB7XG4gICAgICAgIHRocm93IG1vZGVsUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tOYW1lKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLm5hbWUpIHRoaXMubmFtZSA9IHRoaXMub3B0aW9ucy5uYW1lO1xuXG4gICAgaWYgKCF0aGlzLl9pc1N0YW5kYWxvbmUoKSAmJiAhdGhpcy5uYW1lICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBtaXNzaW5nTmFtZUV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmNvbnRyb2wuc2V0VmFsdWUodmFsdWUsIHtlbWl0Vmlld1RvTW9kZWxDaGFuZ2U6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZj8ubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVEaXNhYmxlZChjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgY29uc3QgZGlzYWJsZWRWYWx1ZSA9IGNoYW5nZXNbJ2lzRGlzYWJsZWQnXS5jdXJyZW50VmFsdWU7XG4gICAgLy8gY2hlY2tpbmcgZm9yIDAgdG8gYXZvaWQgYnJlYWtpbmcgY2hhbmdlXG4gICAgY29uc3QgaXNEaXNhYmxlZCA9IGRpc2FibGVkVmFsdWUgIT09IDAgJiYgYm9vbGVhbkF0dHJpYnV0ZShkaXNhYmxlZFZhbHVlKTtcblxuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChpc0Rpc2FibGVkICYmICF0aGlzLmNvbnRyb2wuZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5jb250cm9sLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzRGlzYWJsZWQgJiYgdGhpcy5jb250cm9sLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuY29udHJvbC5lbmFibGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWY/Lm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGF0aChjb250cm9sTmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyBjb250cm9sUGF0aChjb250cm9sTmFtZSwgdGhpcy5fcGFyZW50KSA6IFtjb250cm9sTmFtZV07XG4gIH1cbn1cbiJdfQ==