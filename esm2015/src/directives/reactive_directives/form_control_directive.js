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
import { _ngModelWarning, composeAsyncValidators, composeValidators, isPropertyUpdated, selectValueAccessor, setUpControl } from '../shared';
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
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
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
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
            setUpControl(this.form, this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
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
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators
     * registered with this directive.
     */
    get validator() {
        return composeValidators(this._rawValidators);
    }
    /**
     * @description
     * Async validator function composed of all the async validators registered with this
     * directive.
     */
    get asyncValidator() {
        return composeAsyncValidators(this._rawAsyncValidators);
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
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FormControlDirective, [{
        type: Directive,
        args: [{ selector: '[formControl]', providers: [formControlBinding], exportAs: 'ngForm' }]
    }], function () { return [{ type: Array, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX2RpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQWEsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWdCLE1BQU0sZUFBZSxDQUFDO0FBRW5KLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBQyxNQUFNLFdBQVcsQ0FBQzs7QUFJM0k7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSxrQ0FBa0MsR0FDM0MsSUFBSSxjQUFjLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUV4RCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBUTtJQUNyQyxPQUFPLEVBQUUsU0FBUztJQUNsQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0NBQ3BELENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBR0gsTUFBTSxPQUFPLG9CQUFxQixTQUFRLFNBQVM7SUFtRGpELFlBQytDLFVBQXdDLEVBQ2xDLGVBQ1AsRUFDSyxjQUFzQyxFQUNyQixxQkFDNUQ7UUFDTixLQUFLLEVBQUUsQ0FBQztRQUYwRCwwQkFBcUIsR0FBckIscUJBQXFCLENBQ2pGO1FBM0JSLDJCQUEyQjtRQUNGLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBV3JEOzs7Ozs7V0FNRztRQUNILHdCQUFtQixHQUFHLEtBQUssQ0FBQztRQVUxQixJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGVBQWUsSUFBSSxFQUFFLENBQUM7UUFDakQsSUFBSSxDQUFDLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQWhERDs7O09BR0c7SUFDSCxJQUNJLFVBQVUsQ0FBQyxVQUFtQjtRQUNoQyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUU7WUFDakQsY0FBYyxDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBeUNEOzs7Ozs7T0FNRztJQUNILFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNuQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFjLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ2pFLElBQUksQ0FBQyxhQUFjLENBQUMsZ0JBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0M7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7U0FDdEQ7UUFDRCxJQUFJLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDOUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDdkYsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxJQUFJO1FBQ04sT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksU0FBUztRQUNYLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sc0JBQXNCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxpQkFBaUIsQ0FBQyxRQUFhO1FBQzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFTyxpQkFBaUIsQ0FBQyxPQUE2QjtRQUNyRCxPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7QUFyR0Q7Ozs7OztHQU1HO0FBQ0ksNENBQXVCLEdBQUcsS0FBSyxDQUFDO3dGQXhDNUIsb0JBQW9CLHVCQW9EQyxhQUFhLDRCQUNiLG1CQUFtQiw0QkFFbkIsaUJBQWlCLDRCQUN6QixrQ0FBa0M7eURBeEQvQyxvQkFBb0IscVBBRmlCLENBQUMsa0JBQWtCLENBQUM7a0RBRXpELG9CQUFvQjtjQUZoQyxTQUFTO2VBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBQztzQ0FzRDlCLEtBQUs7c0JBQTNELFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsYUFBYTswQkFFckMsS0FBSztzQkFEUixRQUFROztzQkFBSSxJQUFJOztzQkFBSSxNQUFNO3VCQUFDLG1CQUFtQjs7c0JBRTlDLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsaUJBQWlCOztzQkFDNUMsUUFBUTs7c0JBQUksTUFBTTt1QkFBQyxrQ0FBa0M7d0JBNUNwQyxJQUFJO2tCQUF6QixLQUFLO21CQUFDLGFBQWE7WUFPaEIsVUFBVTtrQkFEYixLQUFLO21CQUFDLFVBQVU7WUFVQyxLQUFLO2tCQUF0QixLQUFLO21CQUFDLFNBQVM7WUFHUyxNQUFNO2tCQUE5QixNQUFNO21CQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgSW5wdXQsIE9uQ2hhbmdlcywgT3B0aW9uYWwsIE91dHB1dCwgU2VsZiwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUNvbnRyb2x9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi4vbmdfY29udHJvbCc7XG5pbXBvcnQge1JlYWN0aXZlRXJyb3JzfSBmcm9tICcuLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtfbmdNb2RlbFdhcm5pbmcsIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzLCBpc1Byb3BlcnR5VXBkYXRlZCwgc2VsZWN0VmFsdWVBY2Nlc3Nvciwgc2V0VXBDb250cm9sfSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cblxuLyoqXG4gKiBUb2tlbiB0byBwcm92aWRlIHRvIHR1cm4gb2ZmIHRoZSBuZ01vZGVsIHdhcm5pbmcgb24gZm9ybUNvbnRyb2wgYW5kIGZvcm1Db250cm9sTmFtZS5cbiAqL1xuZXhwb3J0IGNvbnN0IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbignTmdNb2RlbFdpdGhGb3JtQ29udHJvbFdhcm5pbmcnKTtcblxuZXhwb3J0IGNvbnN0IGZvcm1Db250cm9sQmluZGluZzogYW55ID0ge1xuICBwcm92aWRlOiBOZ0NvbnRyb2wsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Db250cm9sRGlyZWN0aXZlKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN5bmNocm9uaXplcyBhIHN0YW5kYWxvbmUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSB0byBhIGZvcm0gY29udHJvbCBlbGVtZW50LlxuICpcbiAqIE5vdGUgdGhhdCBzdXBwb3J0IGZvciB1c2luZyB0aGUgYG5nTW9kZWxgIGlucHV0IHByb3BlcnR5IGFuZCBgbmdNb2RlbENoYW5nZWAgZXZlbnQgd2l0aCByZWFjdGl2ZVxuICogZm9ybSBkaXJlY3RpdmVzIHdhcyBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIGlzIHNjaGVkdWxlZCBmb3IgcmVtb3ZhbCBpblxuICogYSBmdXR1cmUgdmVyc2lvbiBvZiBBbmd1bGFyLlxuICogRm9yIGRldGFpbHMsIHNlZSBbRGVwcmVjYXRlZCBmZWF0dXJlc10oZ3VpZGUvZGVwcmVjYXRpb25zI25nbW9kZWwtd2l0aC1yZWFjdGl2ZS1mb3JtcykuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBgRm9ybUNvbnRyb2xgXG4gKiBAc2VlIGBBYnN0cmFjdENvbnRyb2xgXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHJlZ2lzdGVyIGEgc3RhbmRhbG9uZSBjb250cm9sIGFuZCBzZXQgaXRzIHZhbHVlLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtQ29udHJvbC9zaW1wbGVfZm9ybV9jb250cm9sX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Db250cm9sXScsIHByb3ZpZGVyczogW2Zvcm1Db250cm9sQmluZGluZ10sIGV4cG9ydEFzOiAnbmdGb3JtJ30pXG5cbmV4cG9ydCBjbGFzcyBGb3JtQ29udHJvbERpcmVjdGl2ZSBleHRlbmRzIE5nQ29udHJvbCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogSW50ZXJuYWwgcmVmZXJlbmNlIHRvIHRoZSB2aWV3IG1vZGVsIHZhbHVlLlxuICAgKi9cbiAgdmlld01vZGVsOiBhbnk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ2Zvcm1Db250cm9sJykgZm9ybSE6IEZvcm1Db250cm9sO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJpZ2dlcnMgYSB3YXJuaW5nIGluIGRldiBtb2RlIHRoYXQgdGhpcyBpbnB1dCBzaG91bGQgbm90IGJlIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3Jtcy5cbiAgICovXG4gIEBJbnB1dCgnZGlzYWJsZWQnKVxuICBzZXQgaXNEaXNhYmxlZChpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgUmVhY3RpdmVFcnJvcnMuZGlzYWJsZWRBdHRyV2FybmluZygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFRPRE8oa2FyYSk6IHJlbW92ZSBuZXh0IDQgcHJvcGVydGllcyBvbmNlIGRlcHJlY2F0aW9uIHBlcmlvZCBpcyBvdmVyXG5cbiAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gIEBJbnB1dCgnbmdNb2RlbCcpIG1vZGVsOiBhbnk7XG5cbiAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gIEBPdXRwdXQoJ25nTW9kZWxDaGFuZ2UnKSB1cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFueSBuZ01vZGVsIHdhcm5pbmdzIGhhdmUgYmVlbiBzZW50IGFjcm9zc1xuICAgKiBhbGwgaW5zdGFuY2VzIG9mIEZvcm1Db250cm9sRGlyZWN0aXZlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJvbmNlXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc3RhdGljIF9uZ01vZGVsV2FybmluZ1NlbnRPbmNlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBJbnN0YW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW4gbmdNb2RlbCB3YXJuaW5nIGhhcyBiZWVuIHNlbnQgb3V0IGZvciB0aGlzXG4gICAqIHBhcnRpY3VsYXIgYEZvcm1Db250cm9sRGlyZWN0aXZlYCBpbnN0YW5jZS4gVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwiYWx3YXlzXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX25nTW9kZWxXYXJuaW5nU2VudCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IEFycmF5PFZhbGlkYXRvcnxWYWxpZGF0b3JGbj4sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgIEFycmF5PEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4+LFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTFVFX0FDQ0VTU09SKSB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORykgcHJpdmF0ZSBfbmdNb2RlbFdhcm5pbmdDb25maWc6IHN0cmluZ3xcbiAgICAgIG51bGwpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3Jhd1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzIHx8IFtdO1xuICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IGFzeW5jVmFsaWRhdG9ycyB8fCBbXTtcbiAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHRoaXMsIHZhbHVlQWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMgY2hhbmdlLiBGb3IgaW50ZXJuYWwgdXNlXG4gICAqIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSBjaGFuZ2VzIEEgb2JqZWN0IG9mIGtleS92YWx1ZSBwYWlycyBmb3IgdGhlIHNldCBvZiBjaGFuZ2VkIGlucHV0cy5cbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5faXNDb250cm9sQ2hhbmdlZChjaGFuZ2VzKSkge1xuICAgICAgc2V0VXBDb250cm9sKHRoaXMuZm9ybSwgdGhpcyk7XG4gICAgICBpZiAodGhpcy5jb250cm9sLmRpc2FibGVkICYmIHRoaXMudmFsdWVBY2Nlc3NvciEuc2V0RGlzYWJsZWRTdGF0ZSkge1xuICAgICAgICB0aGlzLnZhbHVlQWNjZXNzb3IhLnNldERpc2FibGVkU3RhdGUhKHRydWUpO1xuICAgICAgfVxuICAgICAgdGhpcy5mb3JtLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgICB9XG4gICAgaWYgKGlzUHJvcGVydHlVcGRhdGVkKGNoYW5nZXMsIHRoaXMudmlld01vZGVsKSkge1xuICAgICAgX25nTW9kZWxXYXJuaW5nKCdmb3JtQ29udHJvbCcsIEZvcm1Db250cm9sRGlyZWN0aXZlLCB0aGlzLCB0aGlzLl9uZ01vZGVsV2FybmluZ0NvbmZpZyk7XG4gICAgICB0aGlzLmZvcm0uc2V0VmFsdWUodGhpcy5tb2RlbCk7XG4gICAgICB0aGlzLnZpZXdNb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIGFuIGFycmF5IHRoYXQgcmVwcmVzZW50cyB0aGUgcGF0aCBmcm9tIHRoZSB0b3AtbGV2ZWwgZm9ybSB0byB0aGlzIGNvbnRyb2wuXG4gICAqIEVhY2ggaW5kZXggaXMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBjb250cm9sIG9uIHRoYXQgbGV2ZWwuXG4gICAqL1xuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gY29tcG9zZWQgb2YgYWxsIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzXG4gICAqIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCB2YWxpZGF0b3IoKTogVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgcmV0dXJuIGNvbXBvc2VWYWxpZGF0b3JzKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBc3luYyB2YWxpZGF0b3IgZnVuY3Rpb24gY29tcG9zZWQgb2YgYWxsIHRoZSBhc3luYyB2YWxpZGF0b3JzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzXG4gICAqIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCBhc3luY1ZhbGlkYXRvcigpOiBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBgRm9ybUNvbnRyb2xgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IGNvbnRyb2woKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiB0aGlzLmZvcm07XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwgYW5kIGVtaXRzIGFuIGBuZ01vZGVsQ2hhbmdlYCBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIG5ld1ZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSB2aWV3IG1vZGVsLlxuICAgKi9cbiAgdmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmlld01vZGVsID0gbmV3VmFsdWU7XG4gICAgdGhpcy51cGRhdGUuZW1pdChuZXdWYWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9pc0NvbnRyb2xDaGFuZ2VkKGNoYW5nZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Zvcm0nKTtcbiAgfVxufVxuIl19