/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/directives/reactive_directives/form_control_directive.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, InjectionToken, Input, Optional, Output, Self } from '@angular/core';
import { FormControl } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { NG_VALUE_ACCESSOR } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { ReactiveErrors } from '../reactive_errors';
import { _ngModelWarning, composeAsyncValidators, composeValidators, isPropertyUpdated, selectValueAccessor, setUpControl } from '../shared';
/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 * @type {?}
 */
export const NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken('NgModelWithFormControlWarning');
/** @type {?} */
export const formControlBinding = {
    provide: NgControl,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => FormControlDirective))
};
/**
 * \@description
 * Synchronizes a standalone `FormControl` instance to a form control element.
 *
 * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives was deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * \@usageNotes
 *
 * The following example shows how to register a standalone control and set its value.
 *
 * {\@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * \@ngModule ReactiveFormsModule
 * \@publicApi
 */
let FormControlDirective = /** @class */ (() => {
    /**
     * \@description
     * Synchronizes a standalone `FormControl` instance to a form control element.
     *
     * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
     * form directives was deprecated in Angular v6 and is scheduled for removal in
     * a future version of Angular.
     * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
     *
     * @see [Reactive Forms Guide](guide/reactive-forms)
     * @see `FormControl`
     * @see `AbstractControl`
     *
     * \@usageNotes
     *
     * The following example shows how to register a standalone control and set its value.
     *
     * {\@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
     *
     * \@ngModule ReactiveFormsModule
     * \@publicApi
     */
    class FormControlDirective extends NgControl {
        /**
         * @param {?} validators
         * @param {?} asyncValidators
         * @param {?} valueAccessors
         * @param {?} _ngModelWarningConfig
         */
        constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
            super();
            this._ngModelWarningConfig = _ngModelWarningConfig;
            /**
             * @deprecated as of v6
             */
            this.update = new EventEmitter();
            /**
             * \@description
             * Instance property used to track whether an ngModel warning has been sent out for this
             * particular `FormControlDirective` instance. Used to support warning config of "always".
             *
             * \@internal
             */
            this._ngModelWarningSent = false;
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
        set isDisabled(isDisabled) {
            ReactiveErrors.disabledAttrWarning();
        }
        /**
         * \@description
         * A lifecycle method called when the directive's inputs change. For internal use
         * only.
         *
         * @param {?} changes A object of key/value pairs for the set of changed inputs.
         * @return {?}
         */
        ngOnChanges(changes) {
            if (this._isControlChanged(changes)) {
                setUpControl(this.form, this);
                if (this.control.disabled && (/** @type {?} */ (this.valueAccessor)).setDisabledState) {
                    (/** @type {?} */ ((/** @type {?} */ (this.valueAccessor)).setDisabledState))(true);
                }
                this.form.updateValueAndValidity({ emitEvent: false });
            }
            if (isPropertyUpdated(changes, this.viewModel)) {
                _ngModelWarning('formControl', FormControlDirective, this, this._ngModelWarningConfig);
                this.form.setValue(this.model);
                this.viewModel = this.model;
            }
        }
        /**
         * \@description
         * Returns an array that represents the path from the top-level form to this control.
         * Each index is the string name of the control on that level.
         * @return {?}
         */
        get path() {
            return [];
        }
        /**
         * \@description
         * Synchronous validator function composed of all the synchronous validators
         * registered with this directive.
         * @return {?}
         */
        get validator() {
            return composeValidators(this._rawValidators);
        }
        /**
         * \@description
         * Async validator function composed of all the async validators registered with this
         * directive.
         * @return {?}
         */
        get asyncValidator() {
            return composeAsyncValidators(this._rawAsyncValidators);
        }
        /**
         * \@description
         * The `FormControl` bound to this directive.
         * @return {?}
         */
        get control() {
            return this.form;
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
         * @private
         * @param {?} changes
         * @return {?}
         */
        _isControlChanged(changes) {
            return changes.hasOwnProperty('form');
        }
    }
    /**
     * \@description
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlDirective. Used to support warning config of "once".
     *
     * \@internal
     */
    FormControlDirective._ngModelWarningSentOnce = false;
    FormControlDirective.decorators = [
        { type: Directive, args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' },] }
    ];
    /** @nocollapse */
    FormControlDirective.ctorParameters = () => [
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] },
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALUE_ACCESSOR,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [NG_MODEL_WITH_FORM_CONTROL_WARNING,] }] }
    ];
    FormControlDirective.propDecorators = {
        form: [{ type: Input, args: ['formControl',] }],
        isDisabled: [{ type: Input, args: ['disabled',] }],
        model: [{ type: Input, args: ['ngModel',] }],
        update: [{ type: Output, args: ['ngModelChange',] }]
    };
    return FormControlDirective;
})();
export { FormControlDirective };
if (false) {
    /**
     * \@description
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlDirective. Used to support warning config of "once".
     *
     * \@internal
     * @type {?}
     */
    FormControlDirective._ngModelWarningSentOnce;
    /**
     * \@description
     * Internal reference to the view model value.
     * @type {?}
     */
    FormControlDirective.prototype.viewModel;
    /**
     * \@description
     * Tracks the `FormControl` instance bound to the directive.
     * @type {?}
     */
    FormControlDirective.prototype.form;
    /**
     * @deprecated as of v6
     * @type {?}
     */
    FormControlDirective.prototype.model;
    /**
     * @deprecated as of v6
     * @type {?}
     */
    FormControlDirective.prototype.update;
    /**
     * \@description
     * Instance property used to track whether an ngModel warning has been sent out for this
     * particular `FormControlDirective` instance. Used to support warning config of "always".
     *
     * \@internal
     * @type {?}
     */
    FormControlDirective.prototype._ngModelWarningSent;
    /**
     * @type {?}
     * @private
     */
    FormControlDirective.prototype._ngModelWarningConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX2RpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQWEsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBRW5KLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBQyxNQUFNLFdBQVcsQ0FBQzs7Ozs7QUFPM0ksTUFBTSxPQUFPLGtDQUFrQyxHQUMzQyxJQUFJLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQzs7QUFFdkQsTUFBTSxPQUFPLGtCQUFrQixHQUFRO0lBQ3JDLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFdBQVcsRUFBRSxVQUFVOzs7SUFBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsRUFBQztDQUNwRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBQUEsTUFFYSxvQkFBcUIsU0FB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QUFtQjs0Q0FFOUMsUUFBUSxZQUFJLElBQUksWUFBSSxNQUFNLFNBQUMsaUJBQWlCO2dEQUM1QyxRQUFRLFlBQUksTUFBTSxTQUFDLGtDQUFrQzs7O3VCQTFDekQsS0FBSyxTQUFDLGFBQWE7NkJBTW5CLEtBQUssU0FBQyxVQUFVO3dCQVFoQixLQUFLLFNBQUMsU0FBUzt5QkFHZixNQUFNLFNBQUMsZUFBZTs7SUF3R3pCLDJCQUFDO0tBQUE7U0FySVksb0JBQW9COzs7Ozs7Ozs7O0lBc0MvQiw2Q0FBdUM7Ozs7OztJQWpDdkMseUNBQWU7Ozs7OztJQU9mLG9DQUF5Qzs7Ozs7SUFjekMscUNBQTZCOzs7OztJQUc3QixzQ0FBcUQ7Ozs7Ozs7OztJQWtCckQsbURBQTRCOzs7OztJQU94QixxREFDSSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgSW5wdXQsIE9uQ2hhbmdlcywgT3B0aW9uYWwsIE91dHB1dCwgU2VsZiwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUNvbnRyb2x9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi4vbmdfY29udHJvbCc7XG5pbXBvcnQge1JlYWN0aXZlRXJyb3JzfSBmcm9tICcuLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtfbmdNb2RlbFdhcm5pbmcsIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzLCBpc1Byb3BlcnR5VXBkYXRlZCwgc2VsZWN0VmFsdWVBY2Nlc3Nvciwgc2V0VXBDb250cm9sfSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cblxuLyoqXG4gKiBUb2tlbiB0byBwcm92aWRlIHRvIHR1cm4gb2ZmIHRoZSBuZ01vZGVsIHdhcm5pbmcgb24gZm9ybUNvbnRyb2wgYW5kIGZvcm1Db250cm9sTmFtZS5cbiAqL1xuZXhwb3J0IGNvbnN0IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbignTmdNb2RlbFdpdGhGb3JtQ29udHJvbFdhcm5pbmcnKTtcblxuZXhwb3J0IGNvbnN0IGZvcm1Db250cm9sQmluZGluZzogYW55ID0ge1xuICBwcm92aWRlOiBOZ0NvbnRyb2wsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Db250cm9sRGlyZWN0aXZlKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN5bmNocm9uaXplcyBhIHN0YW5kYWxvbmUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSB0byBhIGZvcm0gY29udHJvbCBlbGVtZW50LlxuICpcbiAqIE5vdGUgdGhhdCBzdXBwb3J0IGZvciB1c2luZyB0aGUgYG5nTW9kZWxgIGlucHV0IHByb3BlcnR5IGFuZCBgbmdNb2RlbENoYW5nZWAgZXZlbnQgd2l0aCByZWFjdGl2ZVxuICogZm9ybSBkaXJlY3RpdmVzIHdhcyBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIGlzIHNjaGVkdWxlZCBmb3IgcmVtb3ZhbCBpblxuICogYSBmdXR1cmUgdmVyc2lvbiBvZiBBbmd1bGFyLlxuICogRm9yIGRldGFpbHMsIHNlZSBbRGVwcmVjYXRlZCBmZWF0dXJlc10oZ3VpZGUvZGVwcmVjYXRpb25zI25nbW9kZWwtd2l0aC1yZWFjdGl2ZS1mb3JtcykuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBgRm9ybUNvbnRyb2xgXG4gKiBAc2VlIGBBYnN0cmFjdENvbnRyb2xgXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHJlZ2lzdGVyIGEgc3RhbmRhbG9uZSBjb250cm9sIGFuZCBzZXQgaXRzIHZhbHVlLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtQ29udHJvbC9zaW1wbGVfZm9ybV9jb250cm9sX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Db250cm9sXScsIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZ10sIGV4cG9ydEFzOiAnbmdGb3JtJ30pXG5cbmV4cG9ydCBjbGFzcyBGb3JtQ29udHJvbERpcmVjdGl2ZSBleHRlbmRzIE5nQ29udHJvbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogSW50ZXJuYWwgcmVmZXJlbmNlIHRvIHRoZSB2aWV3IG1vZGVsIHZhbHVlLlxuICAgKi9cbiAgdmlld01vZGVsOiBhbnk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ2Zvcm1Db250cm9sJykgZm9ybSE6IEZvcm1Db250cm9sO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJpZ2dlcnMgYSB3YXJuaW5nIHRoYXQgdGhpcyBpbnB1dCBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3Jtcy5cbiAgICovXG4gIEBJbnB1dCgnZGlzYWJsZWQnKVxuICBzZXQgaXNEaXNhYmxlZChpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgUmVhY3RpdmVFcnJvcnMuZGlzYWJsZWRBdHRyV2FybmluZygpO1xuICB9XG5cbiAgLy8gVE9ETyhrYXJhKTogcmVtb3ZlIG5leHQgNCBwcm9wZXJ0aWVzIG9uY2UgZGVwcmVjYXRpb24gcGVyaW9kIGlzIG92ZXJcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQElucHV0KCduZ01vZGVsJykgbW9kZWw6IGFueTtcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQE91dHB1dCgnbmdNb2RlbENoYW5nZScpIHVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW55IG5nTW9kZWwgd2FybmluZ3MgaGF2ZSBiZWVuIHNlbnQgYWNyb3NzXG4gICAqIGFsbCBpbnN0YW5jZXMgb2YgRm9ybUNvbnRyb2xEaXJlY3RpdmUuIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBzdGF0aWMgX25nTW9kZWxXYXJuaW5nU2VudE9uY2UgPSBmYWxzZTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEluc3RhbmNlIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciBhbiBuZ01vZGVsIHdhcm5pbmcgaGFzIGJlZW4gc2VudCBvdXQgZm9yIHRoaXNcbiAgICogcGFydGljdWxhciBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgIGluc3RhbmNlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJhbHdheXNcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfbmdNb2RlbFdhcm5pbmdTZW50ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgdmFsaWRhdG9yczogQXJyYXk8VmFsaWRhdG9yfFZhbGlkYXRvckZuPixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBhc3luY1ZhbGlkYXRvcnM6XG4gICAgICAgICAgQXJyYXk8QXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbj4sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMVUVfQUNDRVNTT1IpIHZhbHVlQWNjZXNzb3JzOiBDb250cm9sVmFsdWVBY2Nlc3NvcltdLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HKSBwcml2YXRlIF9uZ01vZGVsV2FybmluZ0NvbmZpZzogc3RyaW5nfFxuICAgICAgbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMgfHwgW107XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3JzIHx8IFtdO1xuICAgIHRoaXMudmFsdWVBY2Nlc3NvciA9IHNlbGVjdFZhbHVlQWNjZXNzb3IodGhpcywgdmFsdWVBY2Nlc3NvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGRpcmVjdGl2ZSdzIGlucHV0cyBjaGFuZ2UuIEZvciBpbnRlcm5hbCB1c2VcbiAgICogb25seS5cbiAgICpcbiAgICogQHBhcmFtIGNoYW5nZXMgQSBvYmplY3Qgb2Yga2V5L3ZhbHVlIHBhaXJzIGZvciB0aGUgc2V0IG9mIGNoYW5nZWQgaW5wdXRzLlxuICAgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9pc0NvbnRyb2xDaGFuZ2VkKGNoYW5nZXMpKSB7XG4gICAgICBzZXRVcENvbnRyb2wodGhpcy5mb3JtLCB0aGlzKTtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2wuZGlzYWJsZWQgJiYgdGhpcy52YWx1ZUFjY2Vzc29yIS5zZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgICAgIHRoaXMudmFsdWVBY2Nlc3NvciEuc2V0RGlzYWJsZWRTdGF0ZSEodHJ1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmZvcm0udXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIH1cbiAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICBfbmdNb2RlbFdhcm5pbmcoJ2Zvcm1Db250cm9sJywgRm9ybUNvbnRyb2xEaXJlY3RpdmUsIHRoaXMsIHRoaXMuX25nTW9kZWxXYXJuaW5nQ29uZmlnKTtcbiAgICAgIHRoaXMuZm9ybS5zZXRWYWx1ZSh0aGlzLm1vZGVsKTtcbiAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICogRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb24gdGhhdCBsZXZlbC5cbiAgICovXG4gIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBjb21wb3NlZCBvZiBhbGwgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnNcbiAgICogcmVnaXN0ZXJlZCB3aXRoIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IHZhbGlkYXRvcigpOiBWYWxpZGF0b3JGbnxudWxsIHtcbiAgICByZXR1cm4gY29tcG9zZVZhbGlkYXRvcnModGhpcy5fcmF3VmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbiBjb21wb3NlZCBvZiBhbGwgdGhlIGFzeW5jIHZhbGlkYXRvcnMgcmVnaXN0ZXJlZCB3aXRoIHRoaXNcbiAgICogZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IGFzeW5jVmFsaWRhdG9yKCk6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgcmV0dXJuIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGBGb3JtQ29udHJvbGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBnZXQgY29udHJvbCgpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbCBhbmQgZW1pdHMgYW4gYG5nTW9kZWxDaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwuXG4gICAqL1xuICB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52aWV3TW9kZWwgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzQ29udHJvbENoYW5nZWQoY2hhbmdlczoge1trZXk6IHN0cmluZ106IGFueX0pOiBib29sZWFuIHtcbiAgICByZXR1cm4gY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9ybScpO1xuICB9XG59XG4iXX0=