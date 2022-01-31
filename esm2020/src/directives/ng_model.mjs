/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, Directive, EventEmitter, forwardRef, Host, Inject, Input, Optional, Output, Self } from '@angular/core';
import { FormControl } from '../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { AbstractFormGroupDirective } from './abstract_form_group_directive';
import { ControlContainer } from './control_container';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import { NgForm } from './ng_form';
import { NgModelGroup } from './ng_model_group';
import { controlPath, isPropertyUpdated, selectValueAccessor, setUpControl } from './shared';
import { formGroupNameException, missingNameException, modelParentException } from './template_driven_errors';
import * as i0 from "@angular/core";
import * as i1 from "./control_container";
export const formControlBinding = {
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
const resolvedPromise = (() => Promise.resolve(null))();
/**
 * @description
 * Creates a `FormControl` instance from a domain model and binds it
 * to a form control element.
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
export class NgModel extends NgControl {
    constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this.control = new FormControl();
        /** @internal */
        this._registered = false;
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
        if (!this._registered)
            this._setUpControl();
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
        return this._parent ? controlPath(this.name, this._parent) : [this.name];
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
        setUpControl(this.control, this);
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
        const isDisabled = disabledValue === '' || (disabledValue && disabledValue !== 'false');
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
}
NgModel.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0+39.sha-f5ce6cf.with-local-changes", ngImport: i0, type: NgModel, deps: [{ token: i1.ControlContainer, host: true, optional: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: ChangeDetectorRef, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
NgModel.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.0+39.sha-f5ce6cf.with-local-changes", type: NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: { name: "name", isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"], options: ["ngModelOptions", "options"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding], exportAs: ["ngModel"], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0+39.sha-f5ce6cf.with-local-changes", ngImport: i0, type: NgModel, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19tb2RlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXdCLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUV2SyxPQUFPLEVBQUMsV0FBVyxFQUFZLE1BQU0sVUFBVSxDQUFDO0FBQ2hELE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFakUsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDM0UsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDdkMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxZQUFZLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDM0YsT0FBTyxFQUFDLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7OztBQUc1RyxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBUTtJQUNyQyxPQUFPLEVBQUUsU0FBUztJQUNsQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8s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QUM7YUFDdkI7WUFFRCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLENBQUM7UUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzsrR0FyTVUsT0FBTyw4RUFzRWMsYUFBYSx5Q0FDYixtQkFBbUIseUNBRW5CLGlCQUFpQix5Q0FDekIsaUJBQWlCO21HQTFFOUIsT0FBTywyUEFIUCxDQUFDLGtCQUFrQixDQUFDO3NHQUdwQixPQUFPO2tCQUxuQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxxREFBcUQ7b0JBQy9ELFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDO29CQUMvQixRQUFRLEVBQUUsU0FBUztpQkFDcEI7OzBCQXNFTSxRQUFROzswQkFBSSxJQUFJOzswQkFDaEIsUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksTUFBTTsyQkFBQyxhQUFhOzswQkFDeEMsUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksTUFBTTsyQkFBQyxtQkFBbUI7OzBCQUU5QyxRQUFROzswQkFBSSxJQUFJOzswQkFBSSxNQUFNOzJCQUFDLGlCQUFpQjs7MEJBQzVDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsaUJBQWlCOzRDQS9DdkIsSUFBSTtzQkFBckIsS0FBSztnQkFPYSxVQUFVO3NCQUE1QixLQUFLO3VCQUFDLFVBQVU7Z0JBTUMsS0FBSztzQkFBdEIsS0FBSzt1QkFBQyxTQUFTO2dCQW1CUyxPQUFPO3NCQUEvQixLQUFLO3VCQUFDLGdCQUFnQjtnQkFPRSxNQUFNO3NCQUE5QixNQUFNO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEhvc3QsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPcHRpb25hbCwgT3V0cHV0LCBTZWxmLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtQ29udHJvbCwgRm9ybUhvb2tzfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0Fic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuL2Fic3RyYWN0X2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtOZ0Zvcm19IGZyb20gJy4vbmdfZm9ybSc7XG5pbXBvcnQge05nTW9kZWxHcm91cH0gZnJvbSAnLi9uZ19tb2RlbF9ncm91cCc7XG5pbXBvcnQge2NvbnRyb2xQYXRoLCBpc1Byb3BlcnR5VXBkYXRlZCwgc2VsZWN0VmFsdWVBY2Nlc3Nvciwgc2V0VXBDb250cm9sfSBmcm9tICcuL3NoYXJlZCc7XG5pbXBvcnQge2Zvcm1Hcm91cE5hbWVFeGNlcHRpb24sIG1pc3NpbmdOYW1lRXhjZXB0aW9uLCBtb2RlbFBhcmVudEV4Y2VwdGlvbn0gZnJvbSAnLi90ZW1wbGF0ZV9kcml2ZW5fZXJyb3JzJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBmb3JtQ29udHJvbEJpbmRpbmc6IGFueSA9IHtcbiAgcHJvdmlkZTogTmdDb250cm9sLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ01vZGVsKVxufTtcblxuLyoqXG4gKiBgbmdNb2RlbGAgZm9yY2VzIGFuIGFkZGl0aW9uYWwgY2hhbmdlIGRldGVjdGlvbiBydW4gd2hlbiBpdHMgaW5wdXRzIGNoYW5nZTpcbiAqIEUuZy46XG4gKiBgYGBcbiAqIDxkaXY+e3tteU1vZGVsLnZhbGlkfX08L2Rpdj5cbiAqIDxpbnB1dCBbKG5nTW9kZWwpXT1cIm15VmFsdWVcIiAjbXlNb2RlbD1cIm5nTW9kZWxcIj5cbiAqIGBgYFxuICogSS5lLiBgbmdNb2RlbGAgY2FuIGV4cG9ydCBpdHNlbGYgb24gdGhlIGVsZW1lbnQgYW5kIHRoZW4gYmUgdXNlZCBpbiB0aGUgdGVtcGxhdGUuXG4gKiBOb3JtYWxseSwgdGhpcyB3b3VsZCByZXN1bHQgaW4gZXhwcmVzc2lvbnMgYmVmb3JlIHRoZSBgaW5wdXRgIHRoYXQgdXNlIHRoZSBleHBvcnRlZCBkaXJlY3RpdmVcbiAqIHRvIGhhdmUgYW4gb2xkIHZhbHVlIGFzIHRoZXkgaGF2ZSBiZWVuXG4gKiBkaXJ0eSBjaGVja2VkIGJlZm9yZS4gQXMgdGhpcyBpcyBhIHZlcnkgY29tbW9uIGNhc2UgZm9yIGBuZ01vZGVsYCwgd2UgYWRkZWQgdGhpcyBzZWNvbmQgY2hhbmdlXG4gKiBkZXRlY3Rpb24gcnVuLlxuICpcbiAqIE5vdGVzOlxuICogLSB0aGlzIGlzIGp1c3Qgb25lIGV4dHJhIHJ1biBubyBtYXR0ZXIgaG93IG1hbnkgYG5nTW9kZWxgcyBoYXZlIGJlZW4gY2hhbmdlZC5cbiAqIC0gdGhpcyBpcyBhIGdlbmVyYWwgcHJvYmxlbSB3aGVuIHVzaW5nIGBleHBvcnRBc2AgZm9yIGRpcmVjdGl2ZXMhXG4gKi9cbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9ICgoKSA9PiBQcm9taXNlLnJlc29sdmUobnVsbCkpKCk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBmcm9tIGEgZG9tYWluIG1vZGVsIGFuZCBiaW5kcyBpdFxuICogdG8gYSBmb3JtIGNvbnRyb2wgZWxlbWVudC5cbiAqXG4gKiBUaGUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSB0cmFja3MgdGhlIHZhbHVlLCB1c2VyIGludGVyYWN0aW9uLCBhbmRcbiAqIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sIGFuZCBrZWVwcyB0aGUgdmlldyBzeW5jZWQgd2l0aCB0aGUgbW9kZWwuIElmIHVzZWRcbiAqIHdpdGhpbiBhIHBhcmVudCBmb3JtLCB0aGUgZGlyZWN0aXZlIGFsc28gcmVnaXN0ZXJzIGl0c2VsZiB3aXRoIHRoZSBmb3JtIGFzIGEgY2hpbGRcbiAqIGNvbnRyb2wuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgdXNlZCBieSBpdHNlbGYgb3IgYXMgcGFydCBvZiBhIGxhcmdlciBmb3JtLiBVc2UgdGhlXG4gKiBgbmdNb2RlbGAgc2VsZWN0b3IgdG8gYWN0aXZhdGUgaXQuXG4gKlxuICogSXQgYWNjZXB0cyBhIGRvbWFpbiBtb2RlbCBhcyBhbiBvcHRpb25hbCBgSW5wdXRgLiBJZiB5b3UgaGF2ZSBhIG9uZS13YXkgYmluZGluZ1xuICogdG8gYG5nTW9kZWxgIHdpdGggYFtdYCBzeW50YXgsIGNoYW5naW5nIHRoZSBkb21haW4gbW9kZWwncyB2YWx1ZSBpbiB0aGUgY29tcG9uZW50XG4gKiBjbGFzcyBzZXRzIHRoZSB2YWx1ZSBpbiB0aGUgdmlldy4gSWYgeW91IGhhdmUgYSB0d28td2F5IGJpbmRpbmcgd2l0aCBgWygpXWAgc3ludGF4XG4gKiAoYWxzbyBrbm93biBhcyAnYmFuYW5hLWluLWEtYm94IHN5bnRheCcpLCB0aGUgdmFsdWUgaW4gdGhlIFVJIGFsd2F5cyBzeW5jcyBiYWNrIHRvXG4gKiB0aGUgZG9tYWluIG1vZGVsIGluIHlvdXIgY2xhc3MuXG4gKlxuICogVG8gaW5zcGVjdCB0aGUgcHJvcGVydGllcyBvZiB0aGUgYXNzb2NpYXRlZCBgRm9ybUNvbnRyb2xgIChsaWtlIHRoZSB2YWxpZGl0eSBzdGF0ZSksXG4gKiBleHBvcnQgdGhlIGRpcmVjdGl2ZSBpbnRvIGEgbG9jYWwgdGVtcGxhdGUgdmFyaWFibGUgdXNpbmcgYG5nTW9kZWxgIGFzIHRoZSBrZXkgKGV4OlxuICogYCNteVZhcj1cIm5nTW9kZWxcImApLiBZb3UgY2FuIHRoZW4gYWNjZXNzIHRoZSBjb250cm9sIHVzaW5nIHRoZSBkaXJlY3RpdmUncyBgY29udHJvbGAgcHJvcGVydHkuXG4gKiBIb3dldmVyLCB0aGUgbW9zdCBjb21tb25seSB1c2VkIHByb3BlcnRpZXMgKGxpa2UgYHZhbGlkYCBhbmQgYGRpcnR5YCkgYWxzbyBleGlzdCBvbiB0aGUgY29udHJvbFxuICogZm9yIGRpcmVjdCBhY2Nlc3MuIFNlZSBhIGZ1bGwgbGlzdCBvZiBwcm9wZXJ0aWVzIGRpcmVjdGx5IGF2YWlsYWJsZSBpblxuICogYEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZWAuXG4gKlxuICogQHNlZSBgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcmBcbiAqIEBzZWUgYFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIG5nTW9kZWwgb24gYSBzdGFuZGFsb25lIGNvbnRyb2xcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGVzIHNob3cgYSBzaW1wbGUgc3RhbmRhbG9uZSBjb250cm9sIHVzaW5nIGBuZ01vZGVsYDpcbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlTmdNb2RlbC9zaW1wbGVfbmdfbW9kZWxfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogV2hlbiB1c2luZyB0aGUgYG5nTW9kZWxgIHdpdGhpbiBgPGZvcm0+YCB0YWdzLCB5b3UnbGwgYWxzbyBuZWVkIHRvIHN1cHBseSBhIGBuYW1lYCBhdHRyaWJ1dGVcbiAqIHNvIHRoYXQgdGhlIGNvbnRyb2wgY2FuIGJlIHJlZ2lzdGVyZWQgd2l0aCB0aGUgcGFyZW50IGZvcm0gdW5kZXIgdGhhdCBuYW1lLlxuICpcbiAqIEluIHRoZSBjb250ZXh0IG9mIGEgcGFyZW50IGZvcm0sIGl0J3Mgb2Z0ZW4gdW5uZWNlc3NhcnkgdG8gaW5jbHVkZSBvbmUtd2F5IG9yIHR3by13YXkgYmluZGluZyxcbiAqIGFzIHRoZSBwYXJlbnQgZm9ybSBzeW5jcyB0aGUgdmFsdWUgZm9yIHlvdS4gWW91IGFjY2VzcyBpdHMgcHJvcGVydGllcyBieSBleHBvcnRpbmcgaXQgaW50byBhXG4gKiBsb2NhbCB0ZW1wbGF0ZSB2YXJpYWJsZSB1c2luZyBgbmdGb3JtYCBzdWNoIGFzIChgI2Y9XCJuZ0Zvcm1cImApLiBVc2UgdGhlIHZhcmlhYmxlIHdoZXJlXG4gKiBuZWVkZWQgb24gZm9ybSBzdWJtaXNzaW9uLlxuICpcbiAqIElmIHlvdSBkbyBuZWVkIHRvIHBvcHVsYXRlIGluaXRpYWwgdmFsdWVzIGludG8geW91ciBmb3JtLCB1c2luZyBhIG9uZS13YXkgYmluZGluZyBmb3JcbiAqIGBuZ01vZGVsYCB0ZW5kcyB0byBiZSBzdWZmaWNpZW50IGFzIGxvbmcgYXMgeW91IHVzZSB0aGUgZXhwb3J0ZWQgZm9ybSdzIHZhbHVlIHJhdGhlclxuICogdGhhbiB0aGUgZG9tYWluIG1vZGVsJ3MgdmFsdWUgb24gc3VibWl0LlxuICpcbiAqICMjIyBVc2luZyBuZ01vZGVsIHdpdGhpbiBhIGZvcm1cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgY29udHJvbHMgdXNpbmcgYG5nTW9kZWxgIHdpdGhpbiBhIGZvcm06XG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm0vc2ltcGxlX2Zvcm1fZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogIyMjIFVzaW5nIGEgc3RhbmRhbG9uZSBuZ01vZGVsIHdpdGhpbiBhIGdyb3VwXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gdXNlIGEgc3RhbmRhbG9uZSBuZ01vZGVsIGNvbnRyb2xcbiAqIHdpdGhpbiBhIGZvcm0uIFRoaXMgY29udHJvbHMgdGhlIGRpc3BsYXkgb2YgdGhlIGZvcm0sIGJ1dCBkb2Vzbid0IGNvbnRhaW4gZm9ybSBkYXRhLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtPlxuICogICA8aW5wdXQgbmFtZT1cImxvZ2luXCIgbmdNb2RlbCBwbGFjZWhvbGRlcj1cIkxvZ2luXCI+XG4gKiAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuZ01vZGVsIFtuZ01vZGVsT3B0aW9uc109XCJ7c3RhbmRhbG9uZTogdHJ1ZX1cIj4gU2hvdyBtb3JlIG9wdGlvbnM/XG4gKiA8L2Zvcm0+XG4gKiA8IS0tIGZvcm0gdmFsdWU6IHtsb2dpbjogJyd9IC0tPlxuICogYGBgXG4gKlxuICogIyMjIFNldHRpbmcgdGhlIG5nTW9kZWwgYG5hbWVgIGF0dHJpYnV0ZSB0aHJvdWdoIG9wdGlvbnNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgeW91IGFuIGFsdGVybmF0ZSB3YXkgdG8gc2V0IHRoZSBuYW1lIGF0dHJpYnV0ZS4gSGVyZSxcbiAqIGFuIGF0dHJpYnV0ZSBpZGVudGlmaWVkIGFzIG5hbWUgaXMgdXNlZCB3aXRoaW4gYSBjdXN0b20gZm9ybSBjb250cm9sIGNvbXBvbmVudC4gVG8gc3RpbGwgYmUgYWJsZVxuICogdG8gc3BlY2lmeSB0aGUgTmdNb2RlbCdzIG5hbWUsIHlvdSBtdXN0IHNwZWNpZnkgaXQgdXNpbmcgdGhlIGBuZ01vZGVsT3B0aW9uc2AgaW5wdXQgaW5zdGVhZC5cbiAqXG4gKiBgYGBodG1sXG4gKiA8Zm9ybT5cbiAqICAgPG15LWN1c3RvbS1mb3JtLWNvbnRyb2wgbmFtZT1cIk5hbmN5XCIgbmdNb2RlbCBbbmdNb2RlbE9wdGlvbnNdPVwie25hbWU6ICd1c2VyJ31cIj5cbiAqICAgPC9teS1jdXN0b20tZm9ybS1jb250cm9sPlxuICogPC9mb3JtPlxuICogPCEtLSBmb3JtIHZhbHVlOiB7dXNlcjogJyd9IC0tPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ01vZGVsXTpub3QoW2Zvcm1Db250cm9sTmFtZV0pOm5vdChbZm9ybUNvbnRyb2xdKScsXG4gIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZ10sXG4gIGV4cG9ydEFzOiAnbmdNb2RlbCdcbn0pXG5leHBvcnQgY2xhc3MgTmdNb2RlbCBleHRlbmRzIE5nQ29udHJvbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHVibGljIG92ZXJyaWRlIHJlYWRvbmx5IGNvbnRyb2w6IEZvcm1Db250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG5cbiAgLy8gQXQgcnVudGltZSB3ZSBjb2VyY2UgYXJiaXRyYXJ5IHZhbHVlcyBhc3NpZ25lZCB0byB0aGUgXCJkaXNhYmxlZFwiIGlucHV0IHRvIGEgXCJib29sZWFuXCIuXG4gIC8vIFRoaXMgaXMgbm90IHJlZmxlY3RlZCBpbiB0aGUgdHlwZSBvZiB0aGUgcHJvcGVydHkgYmVjYXVzZSBvdXRzaWRlIG9mIHRlbXBsYXRlcywgY29uc3VtZXJzXG4gIC8vIHNob3VsZCBvbmx5IGRlYWwgd2l0aCBib29sZWFucy4gSW4gdGVtcGxhdGVzLCBhIHN0cmluZyBpcyBhbGxvd2VkIGZvciBjb252ZW5pZW5jZSBhbmQgdG9cbiAgLy8gbWF0Y2ggdGhlIG5hdGl2ZSBcImRpc2FibGVkIGF0dHJpYnV0ZVwiIHNlbWFudGljcyB3aGljaCBjYW4gYmUgb2JzZXJ2ZWQgb24gaW5wdXQgZWxlbWVudHMuXG4gIC8vIFRoaXMgc3RhdGljIG1lbWJlciB0ZWxscyB0aGUgY29tcGlsZXIgdGhhdCB2YWx1ZXMgb2YgdHlwZSBcInN0cmluZ1wiIGNhbiBhbHNvIGJlIGFzc2lnbmVkXG4gIC8vIHRvIHRoZSBpbnB1dCBpbiBhIHRlbXBsYXRlLlxuICAvKiogQG5vZG9jICovXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9pc0Rpc2FibGVkOiBib29sZWFufHN0cmluZztcblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWdpc3RlcmVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgdmlldyBtb2RlbCB2YWx1ZS5cbiAgICogQG5vZG9jXG4gICAqL1xuICB2aWV3TW9kZWw6IGFueTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgbmFtZSBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBJZiBhIHBhcmVudCBmb3JtIGV4aXN0cywgaXRcbiAgICogdXNlcyB0aGlzIG5hbWUgYXMgYSBrZXkgdG8gcmV0cmlldmUgdGhpcyBjb250cm9sJ3MgdmFsdWUuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgb3ZlcnJpZGUgbmFtZSE6IHN0cmluZztcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnZGlzYWJsZWQnKSBpc0Rpc2FibGVkITogYm9vbGVhbjtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgdmFsdWUgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoJ25nTW9kZWwnKSBtb2RlbDogYW55O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoaXMgYG5nTW9kZWxgIGluc3RhbmNlLlxuICAgKlxuICAgKiAqKm5hbWUqKjogQW4gYWx0ZXJuYXRpdmUgdG8gc2V0dGluZyB0aGUgbmFtZSBhdHRyaWJ1dGUgb24gdGhlIGZvcm0gY29udHJvbCBlbGVtZW50LiBTZWVcbiAgICogdGhlIFtleGFtcGxlXShhcGkvZm9ybXMvTmdNb2RlbCN1c2luZy1uZ21vZGVsLW9uLWEtc3RhbmRhbG9uZS1jb250cm9sKSBmb3IgdXNpbmcgYE5nTW9kZWxgXG4gICAqIGFzIGEgc3RhbmRhbG9uZSBjb250cm9sLlxuICAgKlxuICAgKiAqKnN0YW5kYWxvbmUqKjogV2hlbiBzZXQgdG8gdHJ1ZSwgdGhlIGBuZ01vZGVsYCB3aWxsIG5vdCByZWdpc3RlciBpdHNlbGYgd2l0aCBpdHMgcGFyZW50IGZvcm0sXG4gICAqIGFuZCBhY3RzIGFzIGlmIGl0J3Mgbm90IGluIHRoZSBmb3JtLiBEZWZhdWx0cyB0byBmYWxzZS4gSWYgbm8gcGFyZW50IGZvcm0gZXhpc3RzLCB0aGlzIG9wdGlvblxuICAgKiBoYXMgbm8gZWZmZWN0LlxuICAgKlxuICAgKiAqKnVwZGF0ZU9uKio6IERlZmluZXMgdGhlIGV2ZW50IHVwb24gd2hpY2ggdGhlIGZvcm0gY29udHJvbCB2YWx1ZSBhbmQgdmFsaWRpdHkgdXBkYXRlLlxuICAgKiBEZWZhdWx0cyB0byAnY2hhbmdlJy4gUG9zc2libGUgdmFsdWVzOiBgJ2NoYW5nZSdgIHwgYCdibHVyJ2AgfCBgJ3N1Ym1pdCdgLlxuICAgKlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnbmdNb2RlbE9wdGlvbnMnKSBvcHRpb25zIToge25hbWU/OiBzdHJpbmcsIHN0YW5kYWxvbmU/OiBib29sZWFuLCB1cGRhdGVPbj86IEZvcm1Ib29rc307XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBFdmVudCBlbWl0dGVyIGZvciBwcm9kdWNpbmcgdGhlIGBuZ01vZGVsQ2hhbmdlYCBldmVudCBhZnRlclxuICAgKiB0aGUgdmlldyBtb2RlbCB1cGRhdGVzLlxuICAgKi9cbiAgQE91dHB1dCgnbmdNb2RlbENoYW5nZScpIHVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgcGFyZW50OiBDb250cm9sQ29udGFpbmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IChWYWxpZGF0b3J8VmFsaWRhdG9yRm4pW10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgIChBc3luY1ZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvckZuKVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTFVFX0FDQ0VTU09SKSB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQ2hhbmdlRGV0ZWN0b3JSZWYpIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmPzogQ2hhbmdlRGV0ZWN0b3JSZWZ8bnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih0aGlzLCB2YWx1ZUFjY2Vzc29ycyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICB0aGlzLl9jaGVja0ZvckVycm9ycygpO1xuICAgIGlmICghdGhpcy5fcmVnaXN0ZXJlZCkgdGhpcy5fc2V0VXBDb250cm9sKCk7XG4gICAgaWYgKCdpc0Rpc2FibGVkJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl91cGRhdGVEaXNhYmxlZChjaGFuZ2VzKTtcbiAgICB9XG5cbiAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWx1ZSh0aGlzLm1vZGVsKTtcbiAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICB9XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZm9ybURpcmVjdGl2ZSAmJiB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyBjb250cm9sUGF0aCh0aGlzLm5hbWUsIHRoaXMuX3BhcmVudCkgOiBbdGhpcy5uYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgY29udHJvbCBpZiBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIGdldCBmb3JtRGlyZWN0aXZlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudCA/IHRoaXMuX3BhcmVudC5mb3JtRGlyZWN0aXZlIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbCBhbmQgZW1pdHMgYW4gYG5nTW9kZWxDaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBlbWl0dGVkIGJ5IGBuZ01vZGVsQ2hhbmdlYC5cbiAgICovXG4gIG92ZXJyaWRlIHZpZXdUb01vZGVsVXBkYXRlKG5ld1ZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdNb2RlbCA9IG5ld1ZhbHVlO1xuICAgIHRoaXMudXBkYXRlLmVtaXQobmV3VmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBDb250cm9sKCk6IHZvaWQge1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KCk7XG4gICAgdGhpcy5faXNTdGFuZGFsb25lKCkgPyB0aGlzLl9zZXRVcFN0YW5kYWxvbmUoKSA6IHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sKHRoaXMpO1xuICAgIHRoaXMuX3JlZ2lzdGVyZWQgPSB0cnVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBkYXRlU3RyYXRlZ3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5jb250cm9sLl91cGRhdGVPbiA9IHRoaXMub3B0aW9ucy51cGRhdGVPbjtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pc1N0YW5kYWxvbmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLl9wYXJlbnQgfHwgISEodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5zdGFuZGFsb25lKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFVwU3RhbmRhbG9uZSgpOiB2b2lkIHtcbiAgICBzZXRVcENvbnRyb2wodGhpcy5jb250cm9sLCB0aGlzKTtcbiAgICB0aGlzLmNvbnRyb2wudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tGb3JFcnJvcnMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YW5kYWxvbmUoKSkge1xuICAgICAgdGhpcy5fY2hlY2tQYXJlbnRUeXBlKCk7XG4gICAgfVxuICAgIHRoaXMuX2NoZWNrTmFtZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nTW9kZWxHcm91cCkgJiZcbiAgICAgICAgICB0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSkge1xuICAgICAgICB0aHJvdyBmb3JtR3JvdXBOYW1lRXhjZXB0aW9uKCk7XG4gICAgICB9IGVsc2UgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgTmdNb2RlbEdyb3VwKSAmJiAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nRm9ybSkpIHtcbiAgICAgICAgdGhyb3cgbW9kZWxQYXJlbnRFeGNlcHRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jaGVja05hbWUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMubmFtZSkgdGhpcy5uYW1lID0gdGhpcy5vcHRpb25zLm5hbWU7XG5cbiAgICBpZiAoIXRoaXMuX2lzU3RhbmRhbG9uZSgpICYmICF0aGlzLm5hbWUgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IG1pc3NpbmdOYW1lRXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIHRoaXMuY29udHJvbC5zZXRWYWx1ZSh2YWx1ZSwge2VtaXRWaWV3VG9Nb2RlbENoYW5nZTogZmFsc2V9KTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmPy5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZURpc2FibGVkKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBkaXNhYmxlZFZhbHVlID0gY2hhbmdlc1snaXNEaXNhYmxlZCddLmN1cnJlbnRWYWx1ZTtcblxuICAgIGNvbnN0IGlzRGlzYWJsZWQgPSBkaXNhYmxlZFZhbHVlID09PSAnJyB8fCAoZGlzYWJsZWRWYWx1ZSAmJiBkaXNhYmxlZFZhbHVlICE9PSAnZmFsc2UnKTtcblxuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGlmIChpc0Rpc2FibGVkICYmICF0aGlzLmNvbnRyb2wuZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy5jb250cm9sLmRpc2FibGUoKTtcbiAgICAgIH0gZWxzZSBpZiAoIWlzRGlzYWJsZWQgJiYgdGhpcy5jb250cm9sLmRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMuY29udHJvbC5lbmFibGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWY/Lm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG59XG4iXX0=