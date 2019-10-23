/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
 * form directives has been deprecated in Angular v6 and will be removed in a future
 * version of Angular.
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
 * To update your code before support is removed, you'll want to decide whether to stick with
 * reactive form directives (and get/set values using reactive forms patterns) or switch over to
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
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), (/** @type {?} */ (this._parent)));
    }
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
/** @nocollapse */ FormControlName.ɵfac = function FormControlName_Factory(t) { return new (t || FormControlName)(i0.ɵɵdirectiveInject(i1.ControlContainer, 13), i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10), i0.ɵɵdirectiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8)); };
/** @nocollapse */ FormControlName.ɵdir = i0.ɵɵdefineDirective({ type: FormControlName, selectors: [["", "formControlName", ""]], inputs: { name: ["formControlName", "name"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, features: [i0.ɵɵProvidersFeature([controlNameBinding]), i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature()] });
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
     * Accepts a name as a string or a number.
     * The name in the form of a string is useful for individual forms,
     * while the numerical form allows for form controls to be bound
     * to indices when iterating over controls in a `FormArray`.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLFFBQVEsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHOUosT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUcxSSxPQUFPLEVBQUMsa0NBQWtDLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDOzs7Ozs7Ozs7OztBQUUvRCxNQUFNLE9BQU8sa0JBQWtCLEdBQVE7SUFDckMsT0FBTyxFQUFFLFNB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Ozs7SUFReEIsZ0RBQ0kiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIEhvc3QsIEluamVjdCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPcHRpb25hbCwgT3V0cHV0LCBTZWxmLCBTaW1wbGVDaGFuZ2VzLCBTa2lwU2VsZiwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUNvbnRyb2x9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuLi9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4uL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuLi9uZ19jb250cm9sJztcbmltcG9ydCB7UmVhY3RpdmVFcnJvcnN9IGZyb20gJy4uL3JlYWN0aXZlX2Vycm9ycyc7XG5pbXBvcnQge19uZ01vZGVsV2FybmluZywgY29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIGNvbnRyb2xQYXRoLCBpc1Byb3BlcnR5VXBkYXRlZCwgc2VsZWN0VmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi4vc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge05HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkd9IGZyb20gJy4vZm9ybV9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0Zvcm1BcnJheU5hbWUsIEZvcm1Hcm91cE5hbWV9IGZyb20gJy4vZm9ybV9ncm91cF9uYW1lJztcblxuZXhwb3J0IGNvbnN0IGNvbnRyb2xOYW1lQmluZGluZzogYW55ID0ge1xuICBwcm92aWRlOiBOZ0NvbnRyb2wsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Db250cm9sTmFtZSlcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBTeW5jcyBhIGBGb3JtQ29udHJvbGAgaW4gYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgdG8gYSBmb3JtIGNvbnRyb2xcbiAqIGVsZW1lbnQgYnkgbmFtZS5cbiAqIFxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBgRm9ybUNvbnRyb2xgXG4gKiBAc2VlIGBBYnN0cmFjdENvbnRyb2xgXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFxuICogIyMjIFJlZ2lzdGVyIGBGb3JtQ29udHJvbGAgd2l0aGluIGEgZ3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHJlZ2lzdGVyIG11bHRpcGxlIGZvcm0gY29udHJvbHMgd2l0aGluIGEgZm9ybSBncm91cFxuICogYW5kIHNldCB0aGVpciB2YWx1ZS5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybUdyb3VwL3NpbXBsZV9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIFRvIHNlZSBgZm9ybUNvbnRyb2xOYW1lYCBleGFtcGxlcyB3aXRoIGRpZmZlcmVudCBmb3JtIGNvbnRyb2wgdHlwZXMsIHNlZTpcbiAqXG4gKiAqIFJhZGlvIGJ1dHRvbnM6IGBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yYFxuICogKiBTZWxlY3RzOiBgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JgXG4gKlxuICogIyMjIFVzZSB3aXRoIG5nTW9kZWxcbiAqXG4gKiBTdXBwb3J0IGZvciB1c2luZyB0aGUgYG5nTW9kZWxgIGlucHV0IHByb3BlcnR5IGFuZCBgbmdNb2RlbENoYW5nZWAgZXZlbnQgd2l0aCByZWFjdGl2ZVxuICogZm9ybSBkaXJlY3RpdmVzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlXG4gKiB2ZXJzaW9uIG9mIEFuZ3VsYXIuXG4gKlxuICogTm93IGRlcHJlY2F0ZWQ6XG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0gW2Zvcm1Hcm91cF09XCJmb3JtXCI+XG4gKiAgIDxpbnB1dCBmb3JtQ29udHJvbE5hbWU9XCJmaXJzdFwiIFsobmdNb2RlbCldPVwidmFsdWVcIj5cbiAqIDwvZm9ybT5cbiAqIGBgYFxuICpcbiAqIGBgYHRzXG4gKiB0aGlzLnZhbHVlID0gJ3NvbWUgdmFsdWUnO1xuICogYGBgXG4gKlxuICogVGhpcyBoYXMgYmVlbiBkZXByZWNhdGVkIGZvciBhIGZldyByZWFzb25zLiBGaXJzdCwgZGV2ZWxvcGVycyBoYXZlIGZvdW5kIHRoaXMgcGF0dGVyblxuICogY29uZnVzaW5nLiBJdCBzZWVtcyBsaWtlIHRoZSBhY3R1YWwgYG5nTW9kZWxgIGRpcmVjdGl2ZSBpcyBiZWluZyB1c2VkLCBidXQgaW4gZmFjdCBpdCdzXG4gKiBhbiBpbnB1dC9vdXRwdXQgcHJvcGVydHkgbmFtZWQgYG5nTW9kZWxgIG9uIHRoZSByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZSB0aGF0IHNpbXBseVxuICogYXBwcm94aW1hdGVzIChzb21lIG9mKSBpdHMgYmVoYXZpb3IuIFNwZWNpZmljYWxseSwgaXQgYWxsb3dzIGdldHRpbmcvc2V0dGluZyB0aGUgdmFsdWVcbiAqIGFuZCBpbnRlcmNlcHRpbmcgdmFsdWUgZXZlbnRzLiBIb3dldmVyLCBzb21lIG9mIGBuZ01vZGVsYCdzIG90aGVyIGZlYXR1cmVzIC0gbGlrZVxuICogZGVsYXlpbmcgdXBkYXRlcyB3aXRoYG5nTW9kZWxPcHRpb25zYCBvciBleHBvcnRpbmcgdGhlIGRpcmVjdGl2ZSAtIHNpbXBseSBkb24ndCB3b3JrLFxuICogd2hpY2ggaGFzIHVuZGVyc3RhbmRhYmx5IGNhdXNlZCBzb21lIGNvbmZ1c2lvbi5cbiAqXG4gKiBJbiBhZGRpdGlvbiwgdGhpcyBwYXR0ZXJuIG1peGVzIHRlbXBsYXRlLWRyaXZlbiBhbmQgcmVhY3RpdmUgZm9ybXMgc3RyYXRlZ2llcywgd2hpY2hcbiAqIHdlIGdlbmVyYWxseSBkb24ndCByZWNvbW1lbmQgYmVjYXVzZSBpdCBkb2Vzbid0IHRha2UgYWR2YW50YWdlIG9mIHRoZSBmdWxsIGJlbmVmaXRzIG9mXG4gKiBlaXRoZXIgc3RyYXRlZ3kuIFNldHRpbmcgdGhlIHZhbHVlIGluIHRoZSB0ZW1wbGF0ZSB2aW9sYXRlcyB0aGUgdGVtcGxhdGUtYWdub3N0aWNcbiAqIHByaW5jaXBsZXMgYmVoaW5kIHJlYWN0aXZlIGZvcm1zLCB3aGVyZWFzIGFkZGluZyBhIGBGb3JtQ29udHJvbGAvYEZvcm1Hcm91cGAgbGF5ZXIgaW5cbiAqIHRoZSBjbGFzcyByZW1vdmVzIHRoZSBjb252ZW5pZW5jZSBvZiBkZWZpbmluZyBmb3JtcyBpbiB0aGUgdGVtcGxhdGUuXG4gKlxuICogVG8gdXBkYXRlIHlvdXIgY29kZSBiZWZvcmUgc3VwcG9ydCBpcyByZW1vdmVkLCB5b3UnbGwgd2FudCB0byBkZWNpZGUgd2hldGhlciB0byBzdGljayB3aXRoXG4gKiByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXMgKGFuZCBnZXQvc2V0IHZhbHVlcyB1c2luZyByZWFjdGl2ZSBmb3JtcyBwYXR0ZXJucykgb3Igc3dpdGNoIG92ZXIgdG9cbiAqIHRlbXBsYXRlLWRyaXZlbiBkaXJlY3RpdmVzLlxuICpcbiAqIEFmdGVyIChjaG9pY2UgMSAtIHVzZSByZWFjdGl2ZSBmb3Jtcyk6XG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0gW2Zvcm1Hcm91cF09XCJmb3JtXCI+XG4gKiAgIDxpbnB1dCBmb3JtQ29udHJvbE5hbWU9XCJmaXJzdFwiPlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogYGBgdHNcbiAqIHRoaXMuZm9ybS5nZXQoJ2ZpcnN0Jykuc2V0VmFsdWUoJ3NvbWUgdmFsdWUnKTtcbiAqIGBgYFxuICpcbiAqIEFmdGVyIChjaG9pY2UgMiAtIHVzZSB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXMpOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBbKG5nTW9kZWwpXT1cInZhbHVlXCI+XG4gKiBgYGBcbiAqXG4gKiBgYGB0c1xuICogdGhpcy52YWx1ZSA9ICdzb21lIHZhbHVlJztcbiAqIGBgYFxuICpcbiAqIEJ5IGRlZmF1bHQsIHdoZW4geW91IHVzZSB0aGlzIHBhdHRlcm4sIHlvdSB3aWxsIHNlZSBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgb25jZSBpbiBkZXZcbiAqIG1vZGUuIFlvdSBjYW4gY2hvb3NlIHRvIHNpbGVuY2UgdGhpcyB3YXJuaW5nIGJ5IHByb3ZpZGluZyBhIGNvbmZpZyBmb3JcbiAqIGBSZWFjdGl2ZUZvcm1zTW9kdWxlYCBhdCBpbXBvcnQgdGltZTpcbiAqXG4gKiBgYGB0c1xuICogaW1wb3J0czogW1xuICogICBSZWFjdGl2ZUZvcm1zTW9kdWxlLndpdGhDb25maWcoe3dhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2w6ICduZXZlcid9KVxuICogXVxuICogYGBgXG4gKlxuICogQWx0ZXJuYXRpdmVseSwgeW91IGNhbiBjaG9vc2UgdG8gc3VyZmFjZSBhIHNlcGFyYXRlIHdhcm5pbmcgZm9yIGVhY2ggaW5zdGFuY2Ugb2YgdGhpc1xuICogcGF0dGVybiB3aXRoIGEgY29uZmlnIHZhbHVlIG9mIGBcImFsd2F5c1wiYC4gVGhpcyBtYXkgaGVscCB0byB0cmFjayBkb3duIHdoZXJlIGluIHRoZSBjb2RlXG4gKiB0aGUgcGF0dGVybiBpcyBiZWluZyB1c2VkIGFzIHRoZSBjb2RlIGlzIGJlaW5nIHVwZGF0ZWQuXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xOYW1lXScsIHByb3ZpZGVyczogW2NvbnRyb2xOYW1lQmluZGluZ119KVxuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sTmFtZSBleHRlbmRzIE5nQ29udHJvbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfYWRkZWQgPSBmYWxzZTtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBJbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIHZpZXcgbW9kZWwgdmFsdWUuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgdmlld01vZGVsOiBhbnk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICByZWFkb25seSBjb250cm9sICE6IEZvcm1Db250cm9sO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgRm9ybUNvbnRyb2xgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAqIEFjY2VwdHMgYSBuYW1lIGFzIGEgc3RyaW5nIG9yIGEgbnVtYmVyLlxuICAgKiBUaGUgbmFtZSBpbiB0aGUgZm9ybSBvZiBhIHN0cmluZyBpcyB1c2VmdWwgZm9yIGluZGl2aWR1YWwgZm9ybXMsXG4gICAqIHdoaWxlIHRoZSBudW1lcmljYWwgZm9ybSBhbGxvd3MgZm9yIGZvcm0gY29udHJvbHMgdG8gYmUgYm91bmRcbiAgICogdG8gaW5kaWNlcyB3aGVuIGl0ZXJhdGluZyBvdmVyIGNvbnRyb2xzIGluIGEgYEZvcm1BcnJheWAuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCdmb3JtQ29udHJvbE5hbWUnKSBuYW1lICE6IHN0cmluZyB8IG51bWJlciB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmlnZ2VycyBhIHdhcm5pbmcgdGhhdCB0aGlzIGlucHV0IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm1zLlxuICAgKi9cbiAgQElucHV0KCdkaXNhYmxlZCcpXG4gIHNldCBpc0Rpc2FibGVkKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHsgUmVhY3RpdmVFcnJvcnMuZGlzYWJsZWRBdHRyV2FybmluZygpOyB9XG5cbiAgLy8gVE9ETyhrYXJhKTogcmVtb3ZlIG5leHQgNCBwcm9wZXJ0aWVzIG9uY2UgZGVwcmVjYXRpb24gcGVyaW9kIGlzIG92ZXJcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQElucHV0KCduZ01vZGVsJykgbW9kZWw6IGFueTtcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQE91dHB1dCgnbmdNb2RlbENoYW5nZScpIHVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW55IG5nTW9kZWwgd2FybmluZ3MgaGF2ZSBiZWVuIHNlbnQgYWNyb3NzXG4gICAqIGFsbCBpbnN0YW5jZXMgb2YgRm9ybUNvbnRyb2xOYW1lLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJvbmNlXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc3RhdGljIF9uZ01vZGVsV2FybmluZ1NlbnRPbmNlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBJbnN0YW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW4gbmdNb2RlbCB3YXJuaW5nIGhhcyBiZWVuIHNlbnQgb3V0IGZvciB0aGlzXG4gICAqIHBhcnRpY3VsYXIgRm9ybUNvbnRyb2xOYW1lIGluc3RhbmNlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJhbHdheXNcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfbmdNb2RlbFdhcm5pbmdTZW50ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIEBTa2lwU2VsZigpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiBBcnJheTxWYWxpZGF0b3J8VmFsaWRhdG9yRm4+LFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczpcbiAgICAgICAgICBBcnJheTxBc3luY1ZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvckZuPixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxVRV9BQ0NFU1NPUikgdmFsdWVBY2Nlc3NvcnM6IENvbnRyb2xWYWx1ZUFjY2Vzc29yW10sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcpIHByaXZhdGUgX25nTW9kZWxXYXJuaW5nQ29uZmlnOiBzdHJpbmd8XG4gICAgICBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMgfHwgW107XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3JzIHx8IFtdO1xuICAgIHRoaXMudmFsdWVBY2Nlc3NvciA9IHNlbGVjdFZhbHVlQWNjZXNzb3IodGhpcywgdmFsdWVBY2Nlc3NvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGRpcmVjdGl2ZSdzIGlucHV0cyBjaGFuZ2UuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICpcbiAgICogQHBhcmFtIGNoYW5nZXMgQSBvYmplY3Qgb2Yga2V5L3ZhbHVlIHBhaXJzIGZvciB0aGUgc2V0IG9mIGNoYW5nZWQgaW5wdXRzLlxuICAgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICghdGhpcy5fYWRkZWQpIHRoaXMuX3NldFVwQ29udHJvbCgpO1xuICAgIGlmIChpc1Byb3BlcnR5VXBkYXRlZChjaGFuZ2VzLCB0aGlzLnZpZXdNb2RlbCkpIHtcbiAgICAgIF9uZ01vZGVsV2FybmluZygnZm9ybUNvbnRyb2xOYW1lJywgRm9ybUNvbnRyb2xOYW1lLCB0aGlzLCB0aGlzLl9uZ01vZGVsV2FybmluZ0NvbmZpZyk7XG4gICAgICB0aGlzLnZpZXdNb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgICB0aGlzLmZvcm1EaXJlY3RpdmUudXBkYXRlTW9kZWwodGhpcywgdGhpcy5tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBMaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCBiZWZvcmUgdGhlIGRpcmVjdGl2ZSdzIGluc3RhbmNlIGlzIGRlc3Ryb3llZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9ybURpcmVjdGl2ZSkge1xuICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUNvbnRyb2wodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSB2aWV3IG1vZGVsIGFuZCBlbWl0cyBhbiBgbmdNb2RlbENoYW5nZWAgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSBuZXdWYWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbC5cbiAgICovXG4gIHZpZXdUb01vZGVsVXBkYXRlKG5ld1ZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZpZXdNb2RlbCA9IG5ld1ZhbHVlO1xuICAgIHRoaXMudXBkYXRlLmVtaXQobmV3VmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIGFuIGFycmF5IHRoYXQgcmVwcmVzZW50cyB0aGUgcGF0aCBmcm9tIHRoZSB0b3AtbGV2ZWwgZm9ybSB0byB0aGlzIGNvbnRyb2wuXG4gICAqIEVhY2ggaW5kZXggaXMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBjb250cm9sIG9uIHRoYXQgbGV2ZWwuXG4gICAqL1xuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSA9PSBudWxsID8gdGhpcy5uYW1lIDogdGhpcy5uYW1lLnRvU3RyaW5nKCksIHRoaXMuX3BhcmVudCAhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgZ3JvdXAgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmZvcm1EaXJlY3RpdmUgOiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gY29tcG9zZWQgb2YgYWxsIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzXG4gICAqIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCB2YWxpZGF0b3IoKTogVmFsaWRhdG9yRm58bnVsbCB7IHJldHVybiBjb21wb3NlVmFsaWRhdG9ycyh0aGlzLl9yYXdWYWxpZGF0b3JzKTsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uIGNvbXBvc2VkIG9mIGFsbCB0aGUgYXN5bmMgdmFsaWRhdG9ycyByZWdpc3RlcmVkIHdpdGggdGhpc1xuICAgKiBkaXJlY3RpdmUuXG4gICAqL1xuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKSAhO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmXG4gICAgICAgIHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5uZ01vZGVsR3JvdXBFeGNlcHRpb24oKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwRGlyZWN0aXZlKSAmJlxuICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1BcnJheU5hbWUpKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5jb250cm9sUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBDb250cm9sKCkge1xuICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgICh0aGlzIGFze2NvbnRyb2w6IEZvcm1Db250cm9sfSkuY29udHJvbCA9IHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sKHRoaXMpO1xuICAgIGlmICh0aGlzLmNvbnRyb2wuZGlzYWJsZWQgJiYgdGhpcy52YWx1ZUFjY2Vzc29yICEuc2V0RGlzYWJsZWRTdGF0ZSkge1xuICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yICEuc2V0RGlzYWJsZWRTdGF0ZSAhKHRydWUpO1xuICAgIH1cbiAgICB0aGlzLl9hZGRlZCA9IHRydWU7XG4gIH1cbn1cbiJdfQ==