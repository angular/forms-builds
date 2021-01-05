/**
 * @license
 * Copyright Google LLC All Rights Reserved.
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
import { _ngModelWarning, cleanUpControl, isPropertyUpdated, selectValueAccessor, setUpControl } from '../shared';
import * as i0 from "@angular/core";
/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
export const NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken('NgModelWithFormControlWarning');
export const formControlBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => FormControlDirective)
};
/**
 * @description
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
 * @usageNotes
 *
 * The following example shows how to register a standalone control and set its value.
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormControlDirective extends NgControl {
    constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        /** @deprecated as of v6 */
        this.update = new EventEmitter();
        /**
         * @description
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular `FormControlDirective` instance. Used to support warning config of "always".
         *
         * @internal
         */
        this._ngModelWarningSent = false;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            ReactiveErrors.disabledAttrWarning();
        }
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
            const previousForm = changes['form'].previousValue;
            if (previousForm) {
                cleanUpControl(previousForm, this, /* validateControlPresenceOnChange */ false);
            }
            setUpControl(this.form, this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
            }
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                _ngModelWarning('formControl', FormControlDirective, this, this._ngModelWarningConfig);
            }
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.form) {
            cleanUpControl(this.form, this, /* validateControlPresenceOnChange */ false);
        }
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * The `FormControl` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _isControlChanged(changes) {
        return changes.hasOwnProperty('form');
    }
}
/**
 * @description
 * Static property used to track whether any ngModel warnings have been sent across
 * all instances of FormControlDirective. Used to support warning config of "once".
 *
 * @internal
 */
FormControlDirective._ngModelWarningSentOnce = false;
FormControlDirective.ɵfac = function FormControlDirective_Factory(t) { return new (t || FormControlDirective)(i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10), i0.ɵɵdirectiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8)); };
FormControlDirective.ɵdir = i0.ɵɵdefineDirective({ type: FormControlDirective, selectors: [["", "formControl", ""]], inputs: { form: ["formControl", "form"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, exportAs: ["ngForm"], features: [i0.ɵɵProvidersFeature([formControlBinding]), i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FormControlDirective, [{
        type: Directive,
        args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' }]
    }], function () { return [{ type: undefined, decorators: [{
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
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
            }] }]; }, { form: [{
            type: Input,
            args: ['formControl']
        }], isDisabled: [{
            type: Input,
            args: ['disabled']
        }], model: [{
            type: Input,
            args: ['ngModel']
        }], update: [{
            type: Output,
            args: ['ngModelChange']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX2RpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQXdCLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUU5SixPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFDbEYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFDLE1BQU0sV0FBVyxDQUFDOztBQUloSDs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLGtDQUFrQyxHQUMzQyxJQUFJLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBRXhELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFRO0lBQ3JDLE9BQU8sRUFBRSxTQUFTO0lBQ2xCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7Q0FDcEQsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFFSCxNQUFNLE9BQU8sb0JBQXFCLFNB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QUFHLEtBQUssQ0FBQzt3RkF4QzVCLG9CQUFvQix1QkFvREMsYUFBYSw0QkFDYixtQkFBbUIsNEJBRW5CLGlCQUFpQiw0QkFDekIsa0NBQWtDO3lEQXhEL0Msb0JBQW9CLHFQQURpQixDQUFDLGtCQUFrQixDQUFDO3VGQUN6RCxvQkFBb0I7Y0FEaEMsU0FBUztlQUFDLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUM7O3NCQXFEcEYsUUFBUTs7c0JBQUksSUFBSTs7c0JBQUksTUFBTTt1QkFBQyxhQUFhOztzQkFDeEMsUUFBUTs7c0JBQUksSUFBSTs7c0JBQUksTUFBTTt1QkFBQyxtQkFBbUI7O3NCQUU5QyxRQUFROztzQkFBSSxJQUFJOztzQkFBSSxNQUFNO3VCQUFDLGlCQUFpQjs7c0JBQzVDLFFBQVE7O3NCQUFJLE1BQU07dUJBQUMsa0NBQWtDO3dCQTVDcEMsSUFBSTtrQkFBekIsS0FBSzttQkFBQyxhQUFhO1lBT2hCLFVBQVU7a0JBRGIsS0FBSzttQkFBQyxVQUFVO1lBVUMsS0FBSztrQkFBdEIsS0FBSzttQkFBQyxTQUFTO1lBR1MsTUFBTTtrQkFBOUIsTUFBTTttQkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3B0aW9uYWwsIE91dHB1dCwgU2VsZiwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUNvbnRyb2x9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi4vbmdfY29udHJvbCc7XG5pbXBvcnQge1JlYWN0aXZlRXJyb3JzfSBmcm9tICcuLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtfbmdNb2RlbFdhcm5pbmcsIGNsZWFuVXBDb250cm9sLCBpc1Byb3BlcnR5VXBkYXRlZCwgc2VsZWN0VmFsdWVBY2Nlc3Nvciwgc2V0VXBDb250cm9sfSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cblxuLyoqXG4gKiBUb2tlbiB0byBwcm92aWRlIHRvIHR1cm4gb2ZmIHRoZSBuZ01vZGVsIHdhcm5pbmcgb24gZm9ybUNvbnRyb2wgYW5kIGZvcm1Db250cm9sTmFtZS5cbiAqL1xuZXhwb3J0IGNvbnN0IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbignTmdNb2RlbFdpdGhGb3JtQ29udHJvbFdhcm5pbmcnKTtcblxuZXhwb3J0IGNvbnN0IGZvcm1Db250cm9sQmluZGluZzogYW55ID0ge1xuICBwcm92aWRlOiBOZ0NvbnRyb2wsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Db250cm9sRGlyZWN0aXZlKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN5bmNocm9uaXplcyBhIHN0YW5kYWxvbmUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSB0byBhIGZvcm0gY29udHJvbCBlbGVtZW50LlxuICpcbiAqIE5vdGUgdGhhdCBzdXBwb3J0IGZvciB1c2luZyB0aGUgYG5nTW9kZWxgIGlucHV0IHByb3BlcnR5IGFuZCBgbmdNb2RlbENoYW5nZWAgZXZlbnQgd2l0aCByZWFjdGl2ZVxuICogZm9ybSBkaXJlY3RpdmVzIHdhcyBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIGlzIHNjaGVkdWxlZCBmb3IgcmVtb3ZhbCBpblxuICogYSBmdXR1cmUgdmVyc2lvbiBvZiBBbmd1bGFyLlxuICogRm9yIGRldGFpbHMsIHNlZSBbRGVwcmVjYXRlZCBmZWF0dXJlc10oZ3VpZGUvZGVwcmVjYXRpb25zI25nbW9kZWwtd2l0aC1yZWFjdGl2ZS1mb3JtcykuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBgRm9ybUNvbnRyb2xgXG4gKiBAc2VlIGBBYnN0cmFjdENvbnRyb2xgXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHJlZ2lzdGVyIGEgc3RhbmRhbG9uZSBjb250cm9sIGFuZCBzZXQgaXRzIHZhbHVlLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtQ29udHJvbC9zaW1wbGVfZm9ybV9jb250cm9sX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Db250cm9sXScsIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZ10sIGV4cG9ydEFzOiAnbmdGb3JtJ30pXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xEaXJlY3RpdmUgZXh0ZW5kcyBOZ0NvbnRyb2wgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBJbnRlcm5hbCByZWZlcmVuY2UgdG8gdGhlIHZpZXcgbW9kZWwgdmFsdWUuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgdmlld01vZGVsOiBhbnk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ2Zvcm1Db250cm9sJykgZm9ybSE6IEZvcm1Db250cm9sO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJpZ2dlcnMgYSB3YXJuaW5nIGluIGRldiBtb2RlIHRoYXQgdGhpcyBpbnB1dCBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3Jtcy5cbiAgICovXG4gIEBJbnB1dCgnZGlzYWJsZWQnKVxuICBzZXQgaXNEaXNhYmxlZChpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgUmVhY3RpdmVFcnJvcnMuZGlzYWJsZWRBdHRyV2FybmluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8oa2FyYSk6IHJlbW92ZSBuZXh0IDQgcHJvcGVydGllcyBvbmNlIGRlcHJlY2F0aW9uIHBlcmlvZCBpcyBvdmVyXG5cbiAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gIEBJbnB1dCgnbmdNb2RlbCcpIG1vZGVsOiBhbnk7XG5cbiAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gIEBPdXRwdXQoJ25nTW9kZWxDaGFuZ2UnKSB1cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFueSBuZ01vZGVsIHdhcm5pbmdzIGhhdmUgYmVlbiBzZW50IGFjcm9zc1xuICAgKiBhbGwgaW5zdGFuY2VzIG9mIEZvcm1Db250cm9sRGlyZWN0aXZlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJvbmNlXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc3RhdGljIF9uZ01vZGVsV2FybmluZ1NlbnRPbmNlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBJbnN0YW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW4gbmdNb2RlbCB3YXJuaW5nIGhhcyBiZWVuIHNlbnQgb3V0IGZvciB0aGlzXG4gICAqIHBhcnRpY3VsYXIgYEZvcm1Db250cm9sRGlyZWN0aXZlYCBpbnN0YW5jZS4gVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwiYWx3YXlzXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX25nTW9kZWxXYXJuaW5nU2VudCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IChWYWxpZGF0b3J8VmFsaWRhdG9yRm4pW10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgIChBc3luY1ZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvckZuKVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTFVFX0FDQ0VTU09SKSB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORykgcHJpdmF0ZSBfbmdNb2RlbFdhcm5pbmdDb25maWc6IHN0cmluZ3xcbiAgICAgIG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gICAgdGhpcy52YWx1ZUFjY2Vzc29yID0gc2VsZWN0VmFsdWVBY2Nlc3Nvcih0aGlzLCB2YWx1ZUFjY2Vzc29ycyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNDb250cm9sQ2hhbmdlZChjaGFuZ2VzKSkge1xuICAgICAgY29uc3QgcHJldmlvdXNGb3JtID0gY2hhbmdlc1snZm9ybSddLnByZXZpb3VzVmFsdWU7XG4gICAgICBpZiAocHJldmlvdXNGb3JtKSB7XG4gICAgICAgIGNsZWFuVXBDb250cm9sKHByZXZpb3VzRm9ybSwgdGhpcywgLyogdmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSAqLyBmYWxzZSk7XG4gICAgICB9XG4gICAgICBzZXRVcENvbnRyb2wodGhpcy5mb3JtLCB0aGlzKTtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2wuZGlzYWJsZWQgJiYgdGhpcy52YWx1ZUFjY2Vzc29yIS5zZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgICAgIHRoaXMudmFsdWVBY2Nlc3NvciEuc2V0RGlzYWJsZWRTdGF0ZSEodHJ1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmZvcm0udXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIH1cbiAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICAgIF9uZ01vZGVsV2FybmluZygnZm9ybUNvbnRyb2wnLCBGb3JtQ29udHJvbERpcmVjdGl2ZSwgdGhpcywgdGhpcy5fbmdNb2RlbFdhcm5pbmdDb25maWcpO1xuICAgICAgfVxuICAgICAgdGhpcy5mb3JtLnNldFZhbHVlKHRoaXMubW9kZWwpO1xuICAgICAgdGhpcy52aWV3TW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuZm9ybSkge1xuICAgICAgY2xlYW5VcENvbnRyb2wodGhpcy5mb3JtLCB0aGlzLCAvKiB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICovIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICogRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb24gdGhhdCBsZXZlbC5cbiAgICovXG4gIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBgRm9ybUNvbnRyb2xgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IGNvbnRyb2woKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiB0aGlzLmZvcm07XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwgYW5kIGVtaXRzIGFuIGBuZ01vZGVsQ2hhbmdlYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIG5ld1ZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSB2aWV3IG1vZGVsLlxuICAgKi9cbiAgdmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmlld01vZGVsID0gbmV3VmFsdWU7XG4gICAgdGhpcy51cGRhdGUuZW1pdChuZXdWYWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9pc0NvbnRyb2xDaGFuZ2VkKGNoYW5nZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Zvcm0nKTtcbiAgfVxufVxuIl19