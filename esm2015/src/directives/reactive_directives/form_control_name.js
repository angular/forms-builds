/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Host, Inject, Input, Optional, Output, Self, SkipSelf } from '@angular/core';
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
export const controlNameBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => FormControlName)
};
/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * ### Register `FormControl` within a group
 *
 * The following example shows how to register multiple form controls within a form group
 * and set their value.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel is deprecated
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 *
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
let FormControlName = /** @class */ (() => {
    class FormControlName extends NgControl {
        constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
            super();
            this._ngModelWarningConfig = _ngModelWarningConfig;
            this._added = false;
            /** @deprecated as of v6 */
            this.update = new EventEmitter();
            /**
             * @description
             * Instance property used to track whether an ngModel warning has been sent out for this
             * particular FormControlName instance. Used to support warning config of "always".
             *
             * @internal
             */
            this._ngModelWarningSent = false;
            this._parent = parent;
            this._rawValidators = validators || [];
            this._rawAsyncValidators = asyncValidators || [];
            this.valueAccessor = selectValueAccessor(this, valueAccessors);
        }
        /**
         * @description
         * Triggers a warning that this input should not be used with reactive forms.
         */
        set isDisabled(isDisabled) {
            ReactiveErrors.disabledAttrWarning();
        }
        /**
         * @description
         * A lifecycle method called when the directive's inputs change. For internal use only.
         *
         * @param changes A object of key/value pairs for the set of changed inputs.
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
         * @description
         * Lifecycle method called before the directive's instance is destroyed. For internal use only.
         */
        ngOnDestroy() {
            if (this.formDirective) {
                this.formDirective.removeControl(this);
            }
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
        /**
         * @description
         * Returns an array that represents the path from the top-level form to this control.
         * Each index is the string name of the control on that level.
         */
        get path() {
            return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
        }
        /**
         * @description
         * The top-level directive for this group if present, otherwise null.
         */
        get formDirective() {
            return this._parent ? this._parent.formDirective : null;
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
        _setUpControl() {
            this._checkParentType();
            this.control = this.formDirective.addControl(this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
            }
            this._added = true;
        }
    }
    /**
     * @description
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlName. Used to support warning config of "once".
     *
     * @internal
     */
    FormControlName._ngModelWarningSentOnce = false;
    FormControlName.decorators = [
        { type: Directive, args: [{ selector: '[formControlName]', providers: [controlNameBinding] },] }
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
    return FormControlName;
})();
export { FormControlName };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUc5SixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDcEUsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDNUUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxlQUFlLEVBQUUsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRzFJLE9BQU8sRUFBQyxrQ0FBa0MsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzVFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFL0QsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQVE7SUFDckMsT0FBTyxF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QUU5QyxRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyxpQkFBaUI7Z0RBQzVDLFFBQVEsWUFBSSxNQUFNLFNBQUMsa0NBQWtDOzs7dUJBM0N6RCxLQUFLLFNBQUMsaUJBQWlCOzZCQU12QixLQUFLLFNBQUMsVUFBVTt3QkFRaEIsS0FBSyxTQUFDLFNBQVM7eUJBR2YsTUFBTSxTQUFDLGVBQWU7O0lBNkh6QixzQkFBQztLQUFBO1NBeEtZLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBPdXRwdXQsIFNlbGYsIFNpbXBsZUNoYW5nZXMsIFNraXBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtQ29udHJvbH0gZnJvbSAnLi4vLi4vbW9kZWwnO1xuaW1wb3J0IHtOR19BU1lOQ19WQUxJREFUT1JTLCBOR19WQUxJREFUT1JTfSBmcm9tICcuLi8uLi92YWxpZGF0b3JzJztcbmltcG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4uL2Fic3RyYWN0X2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4uL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4uL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtSZWFjdGl2ZUVycm9yc30gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7X25nTW9kZWxXYXJuaW5nLCBjb21wb3NlQXN5bmNWYWxpZGF0b3JzLCBjb21wb3NlVmFsaWRhdG9ycywgY29udHJvbFBhdGgsIGlzUHJvcGVydHlVcGRhdGVkLCBzZWxlY3RWYWx1ZUFjY2Vzc29yfSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7TkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklOR30gZnJvbSAnLi9mb3JtX2NvbnRyb2xfZGlyZWN0aXZlJztcbmltcG9ydCB7Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9mb3JtX2dyb3VwX25hbWUnO1xuXG5leHBvcnQgY29uc3QgY29udHJvbE5hbWVCaW5kaW5nOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5nQ29udHJvbCxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUNvbnRyb2xOYW1lKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN5bmNzIGEgYEZvcm1Db250cm9sYCBpbiBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCB0byBhIGZvcm0gY29udHJvbFxuICogZWxlbWVudCBieSBuYW1lLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgYEZvcm1Db250cm9sYFxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFJlZ2lzdGVyIGBGb3JtQ29udHJvbGAgd2l0aGluIGEgZ3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHJlZ2lzdGVyIG11bHRpcGxlIGZvcm0gY29udHJvbHMgd2l0aGluIGEgZm9ybSBncm91cFxuICogYW5kIHNldCB0aGVpciB2YWx1ZS5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybUdyb3VwL3NpbXBsZV9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIFRvIHNlZSBgZm9ybUNvbnRyb2xOYW1lYCBleGFtcGxlcyB3aXRoIGRpZmZlcmVudCBmb3JtIGNvbnRyb2wgdHlwZXMsIHNlZTpcbiAqXG4gKiAqIFJhZGlvIGJ1dHRvbnM6IGBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yYFxuICogKiBTZWxlY3RzOiBgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JgXG4gKlxuICogIyMjIFVzZSB3aXRoIG5nTW9kZWwgaXMgZGVwcmVjYXRlZFxuICpcbiAqIFN1cHBvcnQgZm9yIHVzaW5nIHRoZSBgbmdNb2RlbGAgaW5wdXQgcHJvcGVydHkgYW5kIGBuZ01vZGVsQ2hhbmdlYCBldmVudCB3aXRoIHJlYWN0aXZlXG4gKiBmb3JtIGRpcmVjdGl2ZXMgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBBbmd1bGFyIHY2IGFuZCBpcyBzY2hlZHVsZWQgZm9yIHJlbW92YWwgaW5cbiAqIGEgZnV0dXJlIHZlcnNpb24gb2YgQW5ndWxhci5cbiAqXG4gKiBGb3IgZGV0YWlscywgc2VlIFtEZXByZWNhdGVkIGZlYXR1cmVzXShndWlkZS9kZXByZWNhdGlvbnMjbmdtb2RlbC13aXRoLXJlYWN0aXZlLWZvcm1zKS5cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdJywgcHJvdmlkZXJzOiBbY29udHJvbE5hbWVCaW5kaW5nXX0pXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xOYW1lIGV4dGVuZHMgTmdDb250cm9sIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9hZGRlZCA9IGZhbHNlO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEludGVybmFsIHJlZmVyZW5jZSB0byB0aGUgdmlldyBtb2RlbCB2YWx1ZS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICB2aWV3TW9kZWw6IGFueTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBib3VuZCB0byB0aGUgZGlyZWN0aXZlLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHJlYWRvbmx5IGNvbnRyb2whOiBGb3JtQ29udHJvbDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYEZvcm1Db250cm9sYCBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBUaGUgbmFtZSBjb3JyZXNwb25kc1xuICAgKiB0byBhIGtleSBpbiB0aGUgcGFyZW50IGBGb3JtR3JvdXBgIG9yIGBGb3JtQXJyYXlgLlxuICAgKiBBY2NlcHRzIGEgbmFtZSBhcyBhIHN0cmluZyBvciBhIG51bWJlci5cbiAgICogVGhlIG5hbWUgaW4gdGhlIGZvcm0gb2YgYSBzdHJpbmcgaXMgdXNlZnVsIGZvciBpbmRpdmlkdWFsIGZvcm1zLFxuICAgKiB3aGlsZSB0aGUgbnVtZXJpY2FsIGZvcm0gYWxsb3dzIGZvciBmb3JtIGNvbnRyb2xzIHRvIGJlIGJvdW5kXG4gICAqIHRvIGluZGljZXMgd2hlbiBpdGVyYXRpbmcgb3ZlciBjb250cm9scyBpbiBhIGBGb3JtQXJyYXlgLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnZm9ybUNvbnRyb2xOYW1lJykgbmFtZSE6IHN0cmluZ3xudW1iZXJ8bnVsbDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyaWdnZXJzIGEgd2FybmluZyB0aGF0IHRoaXMgaW5wdXQgc2hvdWxkIG5vdCBiZSB1c2VkIHdpdGggcmVhY3RpdmUgZm9ybXMuXG4gICAqL1xuICBASW5wdXQoJ2Rpc2FibGVkJylcbiAgc2V0IGlzRGlzYWJsZWQoaXNEaXNhYmxlZDogYm9vbGVhbikge1xuICAgIFJlYWN0aXZlRXJyb3JzLmRpc2FibGVkQXR0cldhcm5pbmcoKTtcbiAgfVxuXG4gIC8vIFRPRE8oa2FyYSk6IHJlbW92ZSBuZXh0IDQgcHJvcGVydGllcyBvbmNlIGRlcHJlY2F0aW9uIHBlcmlvZCBpcyBvdmVyXG5cbiAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gIEBJbnB1dCgnbmdNb2RlbCcpIG1vZGVsOiBhbnk7XG5cbiAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovXG4gIEBPdXRwdXQoJ25nTW9kZWxDaGFuZ2UnKSB1cGRhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFueSBuZ01vZGVsIHdhcm5pbmdzIGhhdmUgYmVlbiBzZW50IGFjcm9zc1xuICAgKiBhbGwgaW5zdGFuY2VzIG9mIEZvcm1Db250cm9sTmFtZS4gVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwib25jZVwiLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHN0YXRpYyBfbmdNb2RlbFdhcm5pbmdTZW50T25jZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogSW5zdGFuY2UgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFuIG5nTW9kZWwgd2FybmluZyBoYXMgYmVlbiBzZW50IG91dCBmb3IgdGhpc1xuICAgKiBwYXJ0aWN1bGFyIEZvcm1Db250cm9sTmFtZSBpbnN0YW5jZS4gVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwiYWx3YXlzXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX25nTW9kZWxXYXJuaW5nU2VudCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQEhvc3QoKSBAU2tpcFNlbGYoKSBwYXJlbnQ6IENvbnRyb2xDb250YWluZXIsXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgdmFsaWRhdG9yczogQXJyYXk8VmFsaWRhdG9yfFZhbGlkYXRvckZuPixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBhc3luY1ZhbGlkYXRvcnM6XG4gICAgICAgICAgQXJyYXk8QXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbj4sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMVUVfQUNDRVNTT1IpIHZhbHVlQWNjZXNzb3JzOiBDb250cm9sVmFsdWVBY2Nlc3NvcltdLFxuICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HKSBwcml2YXRlIF9uZ01vZGVsV2FybmluZ0NvbmZpZzogc3RyaW5nfFxuICAgICAgbnVsbCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX3Jhd1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzIHx8IFtdO1xuICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IGFzeW5jVmFsaWRhdG9ycyB8fCBbXTtcbiAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHRoaXMsIHZhbHVlQWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMgY2hhbmdlLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSBjaGFuZ2VzIEEgb2JqZWN0IG9mIGtleS92YWx1ZSBwYWlycyBmb3IgdGhlIHNldCBvZiBjaGFuZ2VkIGlucHV0cy5cbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoIXRoaXMuX2FkZGVkKSB0aGlzLl9zZXRVcENvbnRyb2woKTtcbiAgICBpZiAoaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlcywgdGhpcy52aWV3TW9kZWwpKSB7XG4gICAgICBfbmdNb2RlbFdhcm5pbmcoJ2Zvcm1Db250cm9sTmFtZScsIEZvcm1Db250cm9sTmFtZSwgdGhpcywgdGhpcy5fbmdNb2RlbFdhcm5pbmdDb25maWcpO1xuICAgICAgdGhpcy52aWV3TW9kZWwgPSB0aGlzLm1vZGVsO1xuICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLnVwZGF0ZU1vZGVsKHRoaXMsIHRoaXMubW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTGlmZWN5Y2xlIG1ldGhvZCBjYWxsZWQgYmVmb3JlIHRoZSBkaXJlY3RpdmUncyBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5yZW1vdmVDb250cm9sKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbCBhbmQgZW1pdHMgYW4gYG5nTW9kZWxDaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwuXG4gICAqL1xuICB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52aWV3TW9kZWwgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgKi9cbiAgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBjb250cm9sUGF0aCh0aGlzLm5hbWUgPT0gbnVsbCA/IHRoaXMubmFtZSA6IHRoaXMubmFtZS50b1N0cmluZygpLCB0aGlzLl9wYXJlbnQhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgZ3JvdXAgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBjb21wb3NlZCBvZiBhbGwgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnNcbiAgICogcmVnaXN0ZXJlZCB3aXRoIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IHZhbGlkYXRvcigpOiBWYWxpZGF0b3JGbnxudWxsIHtcbiAgICByZXR1cm4gY29tcG9zZVZhbGlkYXRvcnModGhpcy5fcmF3VmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbiBjb21wb3NlZCBvZiBhbGwgdGhlIGFzeW5jIHZhbGlkYXRvcnMgcmVnaXN0ZXJlZCB3aXRoIHRoaXNcbiAgICogZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IGFzeW5jVmFsaWRhdG9yKCk6IEFzeW5jVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykhO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmXG4gICAgICAgIHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5uZ01vZGVsR3JvdXBFeGNlcHRpb24oKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwRGlyZWN0aXZlKSAmJlxuICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1BcnJheU5hbWUpKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5jb250cm9sUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBDb250cm9sKCkge1xuICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgICh0aGlzIGFzIHtjb250cm9sOiBGb3JtQ29udHJvbH0pLmNvbnRyb2wgPSB0aGlzLmZvcm1EaXJlY3RpdmUuYWRkQ29udHJvbCh0aGlzKTtcbiAgICBpZiAodGhpcy5jb250cm9sLmRpc2FibGVkICYmIHRoaXMudmFsdWVBY2Nlc3NvciEuc2V0RGlzYWJsZWRTdGF0ZSkge1xuICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yIS5zZXREaXNhYmxlZFN0YXRlISh0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5fYWRkZWQgPSB0cnVlO1xuICB9XG59XG4iXX0=