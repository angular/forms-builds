/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, EventEmitter, Host, Inject, Input, Optional, Output, Self, SkipSelf, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { AbstractFormGroupDirective } from '../abstract_form_group_directive';
import { ControlContainer } from '../control_container';
import { NG_VALUE_ACCESSOR } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { ReactiveErrors } from '../reactive_errors';
import { _ngModelWarning, composeAsyncValidators, composeValidators, controlPath, isPropertyUpdated, selectValueAccessor } from '../shared';
import { NG_MODEL_WITH_FORM_CONTROL_WARNING } from './form_control_directive';
import { FormGroupDirective } from './form_group_directive';
import { FormArrayName, FormGroupName } from './form_group_name';
import * as i0 from "@angular/core";
import * as i1 from "../control_container";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
export const controlNameBinding = {
    provide: NgControl,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => FormControlName))
};
/**
 * \@description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * \@usageNotes
 *
 * ### Register `FormControl` within a group
 *
 * The following example shows how to register multiple form controls within a form group
 * and set their value.
 *
 * {\@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and will be removed in Angular v7.
 *
 * Now deprecated:
 *
 * ```html
 * <form [formGroup]="form">
 *   <input formControlName="first" [(ngModel)]="value">
 * </form>
 * ```
 *
 * ```ts
 * this.value = 'some value';
 * ```
 *
 * This has been deprecated for a few reasons. First, developers have found this pattern
 * confusing. It seems like the actual `ngModel` directive is being used, but in fact it's
 * an input/output property named `ngModel` on the reactive form directive that simply
 * approximates (some of) its behavior. Specifically, it allows getting/setting the value
 * and intercepting value events. However, some of `ngModel`'s other features - like
 * delaying updates with`ngModelOptions` or exporting the directive - simply don't work,
 * which has understandably caused some confusion.
 *
 * In addition, this pattern mixes template-driven and reactive forms strategies, which
 * we generally don't recommend because it doesn't take advantage of the full benefits of
 * either strategy. Setting the value in the template violates the template-agnostic
 * principles behind reactive forms, whereas adding a `FormControl`/`FormGroup` layer in
 * the class removes the convenience of defining forms in the template.
 *
 * To update your code before v7, you'll want to decide whether to stick with reactive form
 * directives (and get/set values using reactive forms patterns) or switch over to
 * template-driven directives.
 *
 * After (choice 1 - use reactive forms):
 *
 * ```html
 * <form [formGroup]="form">
 *   <input formControlName="first">
 * </form>
 * ```
 *
 * ```ts
 * this.form.get('first').setValue('some value');
 * ```
 *
 * After (choice 2 - use template-driven forms):
 *
 * ```html
 * <input [(ngModel)]="value">
 * ```
 *
 * ```ts
 * this.value = 'some value';
 * ```
 *
 * By default, when you use this pattern, you will see a deprecation warning once in dev
 * mode. You can choose to silence this warning by providing a config for
 * `ReactiveFormsModule` at import time:
 *
 * ```ts
 * imports: [
 *   ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
 * ]
 * ```
 *
 * Alternatively, you can choose to surface a separate warning for each instance of this
 * pattern with a config value of `"always"`. This may help to track down where in the code
 * the pattern is being used as the code is being updated.
 *
 * \@ngModule ReactiveFormsModule
 * \@publicApi
 */
export class FormControlName extends NgControl {
    /**
     * @param {?} parent
     * @param {?} validators
     * @param {?} asyncValidators
     * @param {?} valueAccessors
     * @param {?} _ngModelWarningConfig
     */
    constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        this._added = false;
        /**
         * @deprecated as of v6
         */
        this.update = new EventEmitter();
        /**
         * \@description
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular FormControlName instance. Used to support warning config of "always".
         *
         * \@internal
         */
        this._ngModelWarningSent = false;
        this._parent = parent;
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /**
     * \@description
     * Triggers a warning that this input should not be used with reactive forms.
     * @param {?} isDisabled
     * @return {?}
     */
    set isDisabled(isDisabled) { ReactiveErrors.disabledAttrWarning(); }
    /**
     * \@description
     * A lifecycle method called when the directive's inputs change. For internal use only.
     *
     * @param {?} changes A object of key/value pairs for the set of changed inputs.
     * @return {?}
     */
    ngOnChanges(changes) {
        if (!this._added)
            this._setUpControl();
        if (isPropertyUpdated(changes, this.viewModel)) {
            _ngModelWarning('formControlName', FormControlName, this, this._ngModelWarningConfig);
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    }
    /**
     * \@description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     * @return {?}
     */
    ngOnDestroy() {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
    }
    /**
     * \@description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param {?} newValue The new value for the view model.
     * @return {?}
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    /**
     * \@description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     * @return {?}
     */
    get path() { return controlPath(this.name, (/** @type {?} */ (this._parent))); }
    /**
     * \@description
     * The top-level directive for this group if present, otherwise null.
     * @return {?}
     */
    get formDirective() { return this._parent ? this._parent.formDirective : null; }
    /**
     * \@description
     * Synchronous validator function composed of all the synchronous validators
     * registered with this directive.
     * @return {?}
     */
    get validator() { return composeValidators(this._rawValidators); }
    /**
     * \@description
     * Async validator function composed of all the async validators registered with this
     * directive.
     * @return {?}
     */
    get asyncValidator() {
        return (/** @type {?} */ (composeAsyncValidators(this._rawAsyncValidators)));
    }
    /**
     * @private
     * @return {?}
     */
    _checkParentType() {
        if (!(this._parent instanceof FormGroupName) &&
            this._parent instanceof AbstractFormGroupDirective) {
            ReactiveErrors.ngModelGroupException();
        }
        else if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective) &&
            !(this._parent instanceof FormArrayName)) {
            ReactiveErrors.controlParentException();
        }
    }
    /**
     * @private
     * @return {?}
     */
    _setUpControl() {
        this._checkParentType();
        ((/** @type {?} */ (this))).control = this.formDirective.addControl(this);
        if (this.control.disabled && (/** @type {?} */ (this.valueAccessor)).setDisabledState) {
            (/** @type {?} */ ((/** @type {?} */ (this.valueAccessor)).setDisabledState))(true);
        }
        this._added = true;
    }
}
/**
 * \@description
 * Static property used to track whether any ngModel warnings have been sent across
 * all instances of FormControlName. Used to support warning config of "once".
 *
 * \@internal
 */
FormControlName._ngModelWarningSentOnce = false;
FormControlName.decorators = [
    { type: Directive, args: [{ selector: '[formControlName]', providers: [controlNameBinding] },] },
];
/** @nocollapse */
FormControlName.ctorParameters = () => [
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALUE_ACCESSOR,] }] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [NG_MODEL_WITH_FORM_CONTROL_WARNING,] }] }
];
FormControlName.propDecorators = {
    name: [{ type: Input, args: ['formControlName',] }],
    isDisabled: [{ type: Input, args: ['disabled',] }],
    model: [{ type: Input, args: ['ngModel',] }],
    update: [{ type: Output, args: ['ngModelChange',] }]
};
/** @nocollapse */ FormControlName.ngDirectiveDef = i0.ɵɵdefineDirective({ type: FormControlName, selectors: [["", "formControlName", ""]], factory: function FormControlName_Factory(t) { return new (t || FormControlName)(i0.ɵɵdirectiveInject(i1.ControlContainer, 13), i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10), i0.ɵɵdirectiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8)); }, inputs: { name: ["formControlName", "name"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, features: [i0.ɵɵProvidersFeature([controlNameBinding]), i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature()] });
/*@__PURE__*/ i0.ɵsetClassMetadata(FormControlName, [{
        type: Directive,
        args: [{ selector: '[formControlName]', providers: [controlNameBinding] }]
    }], function () { return [{ type: i1.ControlContainer, decorators: [{
                type: Optional
            }, {
                type: Host
            }, {
                type: SkipSelf
            }] }, { type: Array, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: Array, decorators: [{
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
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
            }] }]; }, { name: [{
            type: Input,
            args: ['formControlName']
        }], isDisabled: [{
            type: Input,
            args: ['disabled']
        }], model: [{
            type: Input,
            args: ['ngModel']
        }], update: [{
            type: Output,
            args: ['ngModelChange']
        }] });
if (false) {
    /**
     * \@description
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlName. Used to support warning config of "once".
     *
     * \@internal
     * @type {?}
     */
    FormControlName._ngModelWarningSentOnce;
    /**
     * @type {?}
     * @private
     */
    FormControlName.prototype._added;
    /**
     * \@description
     * Internal reference to the view model value.
     * \@internal
     * @type {?}
     */
    FormControlName.prototype.viewModel;
    /**
     * \@description
     * Tracks the `FormControl` instance bound to the directive.
     * @type {?}
     */
    FormControlName.prototype.control;
    /**
     * \@description
     * Tracks the name of the `FormControl` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * @type {?}
     */
    FormControlName.prototype.name;
    /**
     * @deprecated as of v6
     * @type {?}
     */
    FormControlName.prototype.model;
    /**
     * @deprecated as of v6
     * @type {?}
     */
    FormControlName.prototype.update;
    /**
     * \@description
     * Instance property used to track whether an ngModel warning has been sent out for this
     * particular FormControlName instance. Used to support warning config of "always".
     *
     * \@internal
     * @type {?}
     */
    FormControlName.prototype._ngModelWarningSent;
    /**
     * @type {?}
     * @private
     */
    FormControlName.prototype._ngModelWarningConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLFFBQVEsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHOUosT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUcxSSxPQUFPLEVBQUMsa0NBQWtDLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7Ozs7OztBQUUvRCxNQUFNLE9BQU8sa0JBQWtCLEdBQVE7SUFDckMsT0FBTyxFQUFFLFNB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Q0FDNUMsUUFBUSxZQUFJLE1BQU0sU0FBQyxrQ0FBa0M7OzttQkF6Q3pELEtBQUssU0FBQyxpQkFBaUI7eUJBTXZCLEtBQUssU0FBQyxVQUFVO29CQU1oQixLQUFLLFNBQUMsU0FBUztxQkFHZixNQUFNLFNBQUMsZUFBZTs7OERBckNaLGVBQWUsNEdBQWYsZUFBZSxzRUEyRE0sYUFBYSw0QkFDYixtQkFBbUIsNEJBRW5CLGlCQUFpQiw0QkFDekIsa0NBQWtDLHFNQWhFTixDQUFDLGtCQUFrQixDQUFDO21DQUM3RCxlQUFlO2NBRDNCLFNBQVM7ZUFBQyxFQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFDOztzQkEyRHBFLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLFFBQVE7MEJBQzBCLEtBQUs7c0JBQTNELFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsYUFBYTswQkFFckMsS0FBSztzQkFEUixRQUFROztzQkFBSSxJQUFJOztzQkFBSSxNQUFNO3VCQUFDLG1CQUFtQjs7c0JBRTlDLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsaUJBQWlCOztzQkFDNUMsUUFBUTs7c0JBQUksTUFBTTt1QkFBQyxrQ0FBa0M7O2tCQXpDekQsS0FBSzttQkFBQyxpQkFBaUI7O2tCQU12QixLQUFLO21CQUFDLFVBQVU7O2tCQU1oQixLQUFLO21CQUFDLFNBQVM7O2tCQUdmLE1BQU07bUJBQUMsZUFBZTs7Ozs7Ozs7Ozs7SUFTdkIsd0NBQXVDOzs7OztJQTdDdkMsaUNBQXVCOzs7Ozs7O0lBTXZCLG9DQUFlOzs7Ozs7SUFPZixrQ0FBZ0M7Ozs7Ozs7SUFRaEMsK0JBQXlDOzs7OztJQVl6QyxnQ0FBNkI7Ozs7O0lBRzdCLGlDQUFxRDs7Ozs7Ozs7O0lBa0JyRCw4Q0FBNEI7Ozs7O0lBUXhCLGdEQUNJIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3B0aW9uYWwsIE91dHB1dCwgU2VsZiwgU2ltcGxlQ2hhbmdlcywgU2tpcFNlbGYsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Zvcm1Db250cm9sfSBmcm9tICcuLi8uLi9tb2RlbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uLy4uL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi4vbmdfY29udHJvbCc7XG5pbXBvcnQge1JlYWN0aXZlRXJyb3JzfSBmcm9tICcuLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtfbmdNb2RlbFdhcm5pbmcsIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzLCBjb250cm9sUGF0aCwgaXNQcm9wZXJ0eVVwZGF0ZWQsIHNlbGVjdFZhbHVlQWNjZXNzb3J9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HfSBmcm9tICcuL2Zvcm1fY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtGb3JtQXJyYXlOYW1lLCBGb3JtR3JvdXBOYW1lfSBmcm9tICcuL2Zvcm1fZ3JvdXBfbmFtZSc7XG5cbmV4cG9ydCBjb25zdCBjb250cm9sTmFtZUJpbmRpbmc6IGFueSA9IHtcbiAgcHJvdmlkZTogTmdDb250cm9sLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBGb3JtQ29udHJvbE5hbWUpXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogU3luY3MgYSBgRm9ybUNvbnRyb2xgIGluIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgIHRvIGEgZm9ybSBjb250cm9sXG4gKiBlbGVtZW50IGJ5IG5hbWUuXG4gKiBcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgYEZvcm1Db250cm9sYFxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBcbiAqICMjIyBSZWdpc3RlciBgRm9ybUNvbnRyb2xgIHdpdGhpbiBhIGdyb3VwXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byByZWdpc3RlciBtdWx0aXBsZSBmb3JtIGNvbnRyb2xzIHdpdGhpbiBhIGZvcm0gZ3JvdXBcbiAqIGFuZCBzZXQgdGhlaXIgdmFsdWUuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBUbyBzZWUgYGZvcm1Db250cm9sTmFtZWAgZXhhbXBsZXMgd2l0aCBkaWZmZXJlbnQgZm9ybSBjb250cm9sIHR5cGVzLCBzZWU6XG4gKlxuICogKiBSYWRpbyBidXR0b25zOiBgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcmBcbiAqICogU2VsZWN0czogYFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yYFxuICpcbiAqICMjIyBVc2Ugd2l0aCBuZ01vZGVsXG4gKlxuICogU3VwcG9ydCBmb3IgdXNpbmcgdGhlIGBuZ01vZGVsYCBpbnB1dCBwcm9wZXJ0eSBhbmQgYG5nTW9kZWxDaGFuZ2VgIGV2ZW50IHdpdGggcmVhY3RpdmVcbiAqIGZvcm0gZGlyZWN0aXZlcyBoYXMgYmVlbiBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBBbmd1bGFyIHY3LlxuICpcbiAqIE5vdyBkZXByZWNhdGVkOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtIFtmb3JtR3JvdXBdPVwiZm9ybVwiPlxuICogICA8aW5wdXQgZm9ybUNvbnRyb2xOYW1lPVwiZmlyc3RcIiBbKG5nTW9kZWwpXT1cInZhbHVlXCI+XG4gKiA8L2Zvcm0+XG4gKiBgYGBcbiAqXG4gKiBgYGB0c1xuICogdGhpcy52YWx1ZSA9ICdzb21lIHZhbHVlJztcbiAqIGBgYFxuICpcbiAqIFRoaXMgaGFzIGJlZW4gZGVwcmVjYXRlZCBmb3IgYSBmZXcgcmVhc29ucy4gRmlyc3QsIGRldmVsb3BlcnMgaGF2ZSBmb3VuZCB0aGlzIHBhdHRlcm5cbiAqIGNvbmZ1c2luZy4gSXQgc2VlbXMgbGlrZSB0aGUgYWN0dWFsIGBuZ01vZGVsYCBkaXJlY3RpdmUgaXMgYmVpbmcgdXNlZCwgYnV0IGluIGZhY3QgaXQnc1xuICogYW4gaW5wdXQvb3V0cHV0IHByb3BlcnR5IG5hbWVkIGBuZ01vZGVsYCBvbiB0aGUgcmVhY3RpdmUgZm9ybSBkaXJlY3RpdmUgdGhhdCBzaW1wbHlcbiAqIGFwcHJveGltYXRlcyAoc29tZSBvZikgaXRzIGJlaGF2aW9yLiBTcGVjaWZpY2FsbHksIGl0IGFsbG93cyBnZXR0aW5nL3NldHRpbmcgdGhlIHZhbHVlXG4gKiBhbmQgaW50ZXJjZXB0aW5nIHZhbHVlIGV2ZW50cy4gSG93ZXZlciwgc29tZSBvZiBgbmdNb2RlbGAncyBvdGhlciBmZWF0dXJlcyAtIGxpa2VcbiAqIGRlbGF5aW5nIHVwZGF0ZXMgd2l0aGBuZ01vZGVsT3B0aW9uc2Agb3IgZXhwb3J0aW5nIHRoZSBkaXJlY3RpdmUgLSBzaW1wbHkgZG9uJ3Qgd29yayxcbiAqIHdoaWNoIGhhcyB1bmRlcnN0YW5kYWJseSBjYXVzZWQgc29tZSBjb25mdXNpb24uXG4gKlxuICogSW4gYWRkaXRpb24sIHRoaXMgcGF0dGVybiBtaXhlcyB0ZW1wbGF0ZS1kcml2ZW4gYW5kIHJlYWN0aXZlIGZvcm1zIHN0cmF0ZWdpZXMsIHdoaWNoXG4gKiB3ZSBnZW5lcmFsbHkgZG9uJ3QgcmVjb21tZW5kIGJlY2F1c2UgaXQgZG9lc24ndCB0YWtlIGFkdmFudGFnZSBvZiB0aGUgZnVsbCBiZW5lZml0cyBvZlxuICogZWl0aGVyIHN0cmF0ZWd5LiBTZXR0aW5nIHRoZSB2YWx1ZSBpbiB0aGUgdGVtcGxhdGUgdmlvbGF0ZXMgdGhlIHRlbXBsYXRlLWFnbm9zdGljXG4gKiBwcmluY2lwbGVzIGJlaGluZCByZWFjdGl2ZSBmb3Jtcywgd2hlcmVhcyBhZGRpbmcgYSBgRm9ybUNvbnRyb2xgL2BGb3JtR3JvdXBgIGxheWVyIGluXG4gKiB0aGUgY2xhc3MgcmVtb3ZlcyB0aGUgY29udmVuaWVuY2Ugb2YgZGVmaW5pbmcgZm9ybXMgaW4gdGhlIHRlbXBsYXRlLlxuICpcbiAqIFRvIHVwZGF0ZSB5b3VyIGNvZGUgYmVmb3JlIHY3LCB5b3UnbGwgd2FudCB0byBkZWNpZGUgd2hldGhlciB0byBzdGljayB3aXRoIHJlYWN0aXZlIGZvcm1cbiAqIGRpcmVjdGl2ZXMgKGFuZCBnZXQvc2V0IHZhbHVlcyB1c2luZyByZWFjdGl2ZSBmb3JtcyBwYXR0ZXJucykgb3Igc3dpdGNoIG92ZXIgdG9cbiAqIHRlbXBsYXRlLWRyaXZlbiBkaXJlY3RpdmVzLlxuICpcbiAqIEFmdGVyIChjaG9pY2UgMSAtIHVzZSByZWFjdGl2ZSBmb3Jtcyk6XG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0gW2Zvcm1Hcm91cF09XCJmb3JtXCI+XG4gKiAgIDxpbnB1dCBmb3JtQ29udHJvbE5hbWU9XCJmaXJzdFwiPlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogYGBgdHNcbiAqIHRoaXMuZm9ybS5nZXQoJ2ZpcnN0Jykuc2V0VmFsdWUoJ3NvbWUgdmFsdWUnKTtcbiAqIGBgYFxuICpcbiAqIEFmdGVyIChjaG9pY2UgMiAtIHVzZSB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXMpOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBbKG5nTW9kZWwpXT1cInZhbHVlXCI+XG4gKiBgYGBcbiAqXG4gKiBgYGB0c1xuICogdGhpcy52YWx1ZSA9ICdzb21lIHZhbHVlJztcbiAqIGBgYFxuICpcbiAqIEJ5IGRlZmF1bHQsIHdoZW4geW91IHVzZSB0aGlzIHBhdHRlcm4sIHlvdSB3aWxsIHNlZSBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgb25jZSBpbiBkZXZcbiAqIG1vZGUuIFlvdSBjYW4gY2hvb3NlIHRvIHNpbGVuY2UgdGhpcyB3YXJuaW5nIGJ5IHByb3ZpZGluZyBhIGNvbmZpZyBmb3JcbiAqIGBSZWFjdGl2ZUZvcm1zTW9kdWxlYCBhdCBpbXBvcnQgdGltZTpcbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0czogW1xuICogICBSZWFjdGl2ZUZvcm1zTW9kdWxlLndpdGhDb25maWcoe3dhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2w6ICduZXZlcid9KVxuICogXVxuICogYGBgXG4gKlxuICogQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBjaG9vc2UgdG8gc3VyZmFjZSBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIGVhY2ggaW5zdGFuY2Ugb2YgdGhpc1xuICogcGF0dGVybiB3aXRoIGEgY29uZmlnIHZhbHVlIG9mIGBcImFsd2F5c1wiYC4gVGhpcyBtYXkgaGVscCB0byB0cmFjayBkb3duIHdoZXJlIGluIHRoZSBjb2RlXG4gKiB0aGUgcGF0dGVybiBpcyBiZWluZyB1c2VkIGFzIHRoZSBjb2RlIGlzIGJlaW5nIHVwZGF0ZWQuXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xOYW1lXScsIHByb3ZpZGVyczogW2NvbnRyb2xOYW1lQmluZGluZ119KVxuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sTmFtZSBleHRlbmRzIE5nQ29udHJvbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfYWRkZWQgPSBmYWxzZTtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBJbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIHZpZXcgbW9kZWwgdmFsdWUuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdmlld01vZGVsOiBhbnk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICByZWFkb25seSBjb250cm9sICE6IEZvcm1Db250cm9sO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgRm9ybUNvbnRyb2xgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCdmb3JtQ29udHJvbE5hbWUnKSBuYW1lICE6IHN0cmluZztcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyaWdnZXJzIGEgd2FybmluZyB0aGF0IHRoaXMgaW5wdXQgc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggcmVhY3RpdmUgZm9ybXMuXG4gICAqL1xuICBASW5wdXQoJ2Rpc2FibGVkJylcbiAgc2V0IGlzRGlzYWJsZWQoaXNEaXNhYmxlZDogYm9vbGVhbikgeyBSZWFjdGl2ZUVycm9ycy5kaXNhYmxlZEF0dHJXYXJuaW5nKCk7IH1cblxuICAvLyBUT0RPKGthcmEpOiByZW1vdmUgbmV4dCA0IHByb3BlcnRpZXMgb25jZSBkZXByZWNhdGlvbiBwZXJpb2QgaXMgb3ZlclxuXG4gIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqL1xuICBASW5wdXQoJ25nTW9kZWwnKSBtb2RlbDogYW55O1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqL1xuICBAT3V0cHV0KCduZ01vZGVsQ2hhbmdlJykgdXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3RhdGljIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciBhbnkgbmdNb2RlbCB3YXJuaW5ncyBoYXZlIGJlZW4gc2VudCBhY3Jvc3NcbiAgICogYWxsIGluc3RhbmNlcyBvZiBGb3JtQ29udHJvbE5hbWUuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBzdGF0aWMgX25nTW9kZWxXYXJuaW5nU2VudE9uY2UgPSBmYWxzZTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEluc3RhbmNlIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciBhbiBuZ01vZGVsIHdhcm5pbmcgaGFzIGJlZW4gc2VudCBvdXQgZm9yIHRoaXNcbiAgICogcGFydGljdWxhciBGb3JtQ29udHJvbE5hbWUgaW5zdGFuY2UuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcImFsd2F5c1wiLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9uZ01vZGVsV2FybmluZ1NlbnQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgQFNraXBTZWxmKCkgcGFyZW50OiBDb250cm9sQ29udGFpbmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IEFycmF5PFZhbGlkYXRvcnxWYWxpZGF0b3JGbj4sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgIEFycmF5PEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4+LFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTFVFX0FDQ0VTU09SKSB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORykgcHJpdmF0ZSBfbmdNb2RlbFdhcm5pbmdDb25maWc6IHN0cmluZ3xcbiAgICAgIG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdmFsaWRhdG9ycyB8fCBbXTtcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcnMgfHwgW107XG4gICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih0aGlzLCB2YWx1ZUFjY2Vzc29ycyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEEgbGlmZWN5Y2xlIG1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXRzIGNoYW5nZS4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKlxuICAgKiBAcGFyYW0gY2hhbmdlcyBBIG9iamVjdCBvZiBrZXkvdmFsdWUgcGFpcnMgZm9yIHRoZSBzZXQgb2YgY2hhbmdlZCBpbnB1dHMuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKCF0aGlzLl9hZGRlZCkgdGhpcy5fc2V0VXBDb250cm9sKCk7XG4gICAgaWYgKGlzUHJvcGVydHlVcGRhdGVkKGNoYW5nZXMsIHRoaXMudmlld01vZGVsKSkge1xuICAgICAgX25nTW9kZWxXYXJuaW5nKCdmb3JtQ29udHJvbE5hbWUnLCBGb3JtQ29udHJvbE5hbWUsIHRoaXMsIHRoaXMuX25nTW9kZWxXYXJuaW5nQ29uZmlnKTtcbiAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS51cGRhdGVNb2RlbCh0aGlzLCB0aGlzLm1vZGVsKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIExpZmVjeWNsZSBtZXRob2QgY2FsbGVkIGJlZm9yZSB0aGUgZGlyZWN0aXZlJ3MgaW5zdGFuY2UgaXMgZGVzdHJveWVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb3JtRGlyZWN0aXZlKSB7XG4gICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlQ29udHJvbCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwgYW5kIGVtaXRzIGFuIGBuZ01vZGVsQ2hhbmdlYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIG5ld1ZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSB2aWV3IG1vZGVsLlxuICAgKi9cbiAgdmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmlld01vZGVsID0gbmV3VmFsdWU7XG4gICAgdGhpcy51cGRhdGUuZW1pdChuZXdWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICogRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb24gdGhhdCBsZXZlbC5cbiAgICovXG4gIGdldCBwYXRoKCk6IHN0cmluZ1tdIHsgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSwgdGhpcy5fcGFyZW50ICEpOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgdG9wLWxldmVsIGRpcmVjdGl2ZSBmb3IgdGhpcyBncm91cCBpZiBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIGdldCBmb3JtRGlyZWN0aXZlKCk6IGFueSB7IHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBjb21wb3NlZCBvZiBhbGwgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnNcbiAgICogcmVnaXN0ZXJlZCB3aXRoIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IHZhbGlkYXRvcigpOiBWYWxpZGF0b3JGbnxudWxsIHsgcmV0dXJuIGNvbXBvc2VWYWxpZGF0b3JzKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBc3luYyB2YWxpZGF0b3IgZnVuY3Rpb24gY29tcG9zZWQgb2YgYWxsIHRoZSBhc3luYyB2YWxpZGF0b3JzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzXG4gICAqIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCBhc3luY1ZhbGlkYXRvcigpOiBBc3luY1ZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gY29tcG9zZUFzeW5jVmFsaWRhdG9ycyh0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpICE7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja1BhcmVudFR5cGUoKTogdm9pZCB7XG4gICAgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkgJiZcbiAgICAgICAgdGhpcy5fcGFyZW50IGluc3RhbmNlb2YgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUpIHtcbiAgICAgIFJlYWN0aXZlRXJyb3JzLm5nTW9kZWxHcm91cEV4Y2VwdGlvbigpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkgJiYgISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBGb3JtR3JvdXBEaXJlY3RpdmUpICYmXG4gICAgICAgICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUFycmF5TmFtZSkpIHtcbiAgICAgIFJlYWN0aXZlRXJyb3JzLmNvbnRyb2xQYXJlbnRFeGNlcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zZXRVcENvbnRyb2woKSB7XG4gICAgdGhpcy5fY2hlY2tQYXJlbnRUeXBlKCk7XG4gICAgKHRoaXMgYXN7Y29udHJvbDogRm9ybUNvbnRyb2x9KS5jb250cm9sID0gdGhpcy5mb3JtRGlyZWN0aXZlLmFkZENvbnRyb2wodGhpcyk7XG4gICAgaWYgKHRoaXMuY29udHJvbC5kaXNhYmxlZCAmJiB0aGlzLnZhbHVlQWNjZXNzb3IgIS5zZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgICB0aGlzLnZhbHVlQWNjZXNzb3IgIS5zZXREaXNhYmxlZFN0YXRlICEodHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMuX2FkZGVkID0gdHJ1ZTtcbiAgfVxufVxuIl19