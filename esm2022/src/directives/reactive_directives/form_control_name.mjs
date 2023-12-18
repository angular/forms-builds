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
import { controlParentException, disabledAttrWarning, ngModelGroupException } from '../reactive_errors';
import { _ngModelWarning, controlPath, isPropertyUpdated, selectValueAccessor } from '../shared';
import { NG_MODEL_WITH_FORM_CONTROL_WARNING } from './form_control_directive';
import { FormGroupDirective } from './form_group_directive';
import { FormArrayName, FormGroupName } from './form_group_name';
import * as i0 from "@angular/core";
import * as i1 from "../control_container";
const controlNameBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => FormControlName)
};
/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link FormControl}
 * @see {@link AbstractControl}
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
export class FormControlName extends NgControl {
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            console.warn(disabledAttrWarning);
        }
    }
    /**
     * @description
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlName. Used to support warning config of "once".
     *
     * @internal
     */
    static { this._ngModelWarningSentOnce = false; }
    constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        this._added = false;
        /**
         * @description
         * Tracks the name of the `FormControl` bound to the directive. The name corresponds
         * to a key in the parent `FormGroup` or `FormArray`.
         * Accepts a name as a string or a number.
         * The name in the form of a string is useful for individual forms,
         * while the numerical form allows for form controls to be bound
         * to indices when iterating over controls in a `FormArray`.
         */
        this.name = null;
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
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if (!this._added)
            this._setUpControl();
        if (isPropertyUpdated(changes, this.viewModel)) {
            if (typeof ngDevMode === 'undefined' || ngDevMode) {
                _ngModelWarning('formControlName', FormControlName, this, this._ngModelWarningConfig);
            }
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    }
    /** @nodoc */
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
    _checkParentType() {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            if (!(this._parent instanceof FormGroupName) &&
                this._parent instanceof AbstractFormGroupDirective) {
                throw ngModelGroupException();
            }
            else if (!(this._parent instanceof FormGroupName) &&
                !(this._parent instanceof FormGroupDirective) &&
                !(this._parent instanceof FormArrayName)) {
                throw controlParentException();
            }
        }
    }
    _setUpControl() {
        this._checkParentType();
        this.control = this.formDirective.addControl(this);
        this._added = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.7+sha-4a892a3", ngImport: i0, type: FormControlName, deps: [{ token: i1.ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.7+sha-4a892a3", type: FormControlName, selector: "[formControlName]", inputs: { name: ["formControlName", "name"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [controlNameBinding], usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.7+sha-4a892a3", ngImport: i0, type: FormControlName, decorators: [{
            type: Directive,
            args: [{ selector: '[formControlName]', providers: [controlNameBinding] }]
        }], ctorParameters: () => [{ type: i1.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Host
                }, {
                    type: SkipSelf
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
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
                }] }], propDecorators: { name: [{
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
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLE1BQU0sRUFBWSxJQUFJLEVBQWlCLFFBQVEsRUFBd0IsTUFBTSxlQUFlLENBQUM7QUFHL0wsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxxQkFBcUIsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RHLE9BQU8sRUFBQyxlQUFlLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBRy9GLE9BQU8sRUFBQyxrQ0FBa0MsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzVFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFELE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7OztBQUUvRCxNQUFNLGtCQUFrQixHQUFhO0lBQ25DLE9BQU8sRUFBRSxT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LGlCQUFpQjs7MEJBQzVDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsa0NBQWtDO3lDQTdDdkIsSUFBSTtzQkFBdEMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBT3BCLFVBQVU7c0JBRGIsS0FBSzt1QkFBQyxVQUFVO2dCQVVDLEtBQUs7c0JBQXRCLEtBQUs7dUJBQUMsU0FBUztnQkFHUyxNQUFNO3NCQUE5QixNQUFNO3VCQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBPdXRwdXQsIFByb3ZpZGVyLCBTZWxmLCBTaW1wbGVDaGFuZ2VzLCBTa2lwU2VsZiwgybVXcml0YWJsZSBhcyBXcml0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUNvbnRyb2x9IGZyb20gJy4uLy4uL21vZGVsL2Zvcm1fY29udHJvbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uLy4uL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi4vbmdfY29udHJvbCc7XG5pbXBvcnQge2NvbnRyb2xQYXJlbnRFeGNlcHRpb24sIGRpc2FibGVkQXR0cldhcm5pbmcsIG5nTW9kZWxHcm91cEV4Y2VwdGlvbn0gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7X25nTW9kZWxXYXJuaW5nLCBjb250cm9sUGF0aCwgaXNQcm9wZXJ0eVVwZGF0ZWQsIHNlbGVjdFZhbHVlQWNjZXNzb3J9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HfSBmcm9tICcuL2Zvcm1fY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtGb3JtQXJyYXlOYW1lLCBGb3JtR3JvdXBOYW1lfSBmcm9tICcuL2Zvcm1fZ3JvdXBfbmFtZSc7XG5cbmNvbnN0IGNvbnRyb2xOYW1lQmluZGluZzogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5nQ29udHJvbCxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUNvbnRyb2xOYW1lKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN5bmNzIGEgYEZvcm1Db250cm9sYCBpbiBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCB0byBhIGZvcm0gY29udHJvbFxuICogZWxlbWVudCBieSBuYW1lLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUge0BsaW5rIEZvcm1Db250cm9sfVxuICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFJlZ2lzdGVyIGBGb3JtQ29udHJvbGAgd2l0aGluIGEgZ3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHJlZ2lzdGVyIG11bHRpcGxlIGZvcm0gY29udHJvbHMgd2l0aGluIGEgZm9ybSBncm91cFxuICogYW5kIHNldCB0aGVpciB2YWx1ZS5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybUdyb3VwL3NpbXBsZV9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIFRvIHNlZSBgZm9ybUNvbnRyb2xOYW1lYCBleGFtcGxlcyB3aXRoIGRpZmZlcmVudCBmb3JtIGNvbnRyb2wgdHlwZXMsIHNlZTpcbiAqXG4gKiAqIFJhZGlvIGJ1dHRvbnM6IGBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yYFxuICogKiBTZWxlY3RzOiBgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JgXG4gKlxuICogIyMjIFVzZSB3aXRoIG5nTW9kZWwgaXMgZGVwcmVjYXRlZFxuICpcbiAqIFN1cHBvcnQgZm9yIHVzaW5nIHRoZSBgbmdNb2RlbGAgaW5wdXQgcHJvcGVydHkgYW5kIGBuZ01vZGVsQ2hhbmdlYCBldmVudCB3aXRoIHJlYWN0aXZlXG4gKiBmb3JtIGRpcmVjdGl2ZXMgaGFzIGJlZW4gZGVwcmVjYXRlZCBpbiBBbmd1bGFyIHY2IGFuZCBpcyBzY2hlZHVsZWQgZm9yIHJlbW92YWwgaW5cbiAqIGEgZnV0dXJlIHZlcnNpb24gb2YgQW5ndWxhci5cbiAqXG4gKiBGb3IgZGV0YWlscywgc2VlIFtEZXByZWNhdGVkIGZlYXR1cmVzXShndWlkZS9kZXByZWNhdGlvbnMjbmdtb2RlbC13aXRoLXJlYWN0aXZlLWZvcm1zKS5cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdJywgcHJvdmlkZXJzOiBbY29udHJvbE5hbWVCaW5kaW5nXX0pXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xOYW1lIGV4dGVuZHMgTmdDb250cm9sIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9hZGRlZCA9IGZhbHNlO1xuICAvKipcbiAgICogSW50ZXJuYWwgcmVmZXJlbmNlIHRvIHRoZSB2aWV3IG1vZGVsIHZhbHVlLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHZpZXdNb2RlbDogYW55O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgb3ZlcnJpZGUgcmVhZG9ubHkgY29udHJvbCE6IEZvcm1Db250cm9sO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgRm9ybUNvbnRyb2xgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAqIEFjY2VwdHMgYSBuYW1lIGFzIGEgc3RyaW5nIG9yIGEgbnVtYmVyLlxuICAgKiBUaGUgbmFtZSBpbiB0aGUgZm9ybSBvZiBhIHN0cmluZyBpcyB1c2VmdWwgZm9yIGluZGl2aWR1YWwgZm9ybXMsXG4gICAqIHdoaWxlIHRoZSBudW1lcmljYWwgZm9ybSBhbGxvd3MgZm9yIGZvcm0gY29udHJvbHMgdG8gYmUgYm91bmRcbiAgICogdG8gaW5kaWNlcyB3aGVuIGl0ZXJhdGluZyBvdmVyIGNvbnRyb2xzIGluIGEgYEZvcm1BcnJheWAuXG4gICAqL1xuICBASW5wdXQoJ2Zvcm1Db250cm9sTmFtZScpIG92ZXJyaWRlIG5hbWU6IHN0cmluZ3xudW1iZXJ8bnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmlnZ2VycyBhIHdhcm5pbmcgaW4gZGV2IG1vZGUgdGhhdCB0aGlzIGlucHV0IHNob3VsZCBub3QgYmUgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm1zLlxuICAgKi9cbiAgQElucHV0KCdkaXNhYmxlZCcpXG4gIHNldCBpc0Rpc2FibGVkKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBjb25zb2xlLndhcm4oZGlzYWJsZWRBdHRyV2FybmluZyk7XG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyhrYXJhKTogcmVtb3ZlIG5leHQgNCBwcm9wZXJ0aWVzIG9uY2UgZGVwcmVjYXRpb24gcGVyaW9kIGlzIG92ZXJcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQElucHV0KCduZ01vZGVsJykgbW9kZWw6IGFueTtcblxuICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi9cbiAgQE91dHB1dCgnbmdNb2RlbENoYW5nZScpIHVwZGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW55IG5nTW9kZWwgd2FybmluZ3MgaGF2ZSBiZWVuIHNlbnQgYWNyb3NzXG4gICAqIGFsbCBpbnN0YW5jZXMgb2YgRm9ybUNvbnRyb2xOYW1lLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJvbmNlXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc3RhdGljIF9uZ01vZGVsV2FybmluZ1NlbnRPbmNlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBJbnN0YW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW4gbmdNb2RlbCB3YXJuaW5nIGhhcyBiZWVuIHNlbnQgb3V0IGZvciB0aGlzXG4gICAqIHBhcnRpY3VsYXIgRm9ybUNvbnRyb2xOYW1lIGluc3RhbmNlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJhbHdheXNcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfbmdNb2RlbFdhcm5pbmdTZW50ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIEBTa2lwU2VsZigpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiAoVmFsaWRhdG9yfFZhbGlkYXRvckZuKVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczpcbiAgICAgICAgICAoQXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbilbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxVRV9BQ0NFU1NPUikgdmFsdWVBY2Nlc3NvcnM6IENvbnRyb2xWYWx1ZUFjY2Vzc29yW10sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcpIHByaXZhdGUgX25nTW9kZWxXYXJuaW5nQ29uZmlnOiBzdHJpbmd8XG4gICAgICBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB0aGlzLnZhbHVlQWNjZXNzb3IgPSBzZWxlY3RWYWx1ZUFjY2Vzc29yKHRoaXMsIHZhbHVlQWNjZXNzb3JzKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICghdGhpcy5fYWRkZWQpIHRoaXMuX3NldFVwQ29udHJvbCgpO1xuICAgIGlmIChpc1Byb3BlcnR5VXBkYXRlZChjaGFuZ2VzLCB0aGlzLnZpZXdNb2RlbCkpIHtcbiAgICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgICAgX25nTW9kZWxXYXJuaW5nKCdmb3JtQ29udHJvbE5hbWUnLCBGb3JtQ29udHJvbE5hbWUsIHRoaXMsIHRoaXMuX25nTW9kZWxXYXJuaW5nQ29uZmlnKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudmlld01vZGVsID0gdGhpcy5tb2RlbDtcbiAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS51cGRhdGVNb2RlbCh0aGlzLCB0aGlzLm1vZGVsKTtcbiAgICB9XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5yZW1vdmVDb250cm9sKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgdmlldyBtb2RlbCBhbmQgZW1pdHMgYW4gYG5nTW9kZWxDaGFuZ2VgIGV2ZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbmV3VmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHZpZXcgbW9kZWwuXG4gICAqL1xuICBvdmVycmlkZSB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52aWV3TW9kZWwgPSBuZXdWYWx1ZTtcbiAgICB0aGlzLnVwZGF0ZS5lbWl0KG5ld1ZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBjb250cm9sUGF0aCh0aGlzLm5hbWUgPT0gbnVsbCA/IHRoaXMubmFtZSA6IHRoaXMubmFtZS50b1N0cmluZygpLCB0aGlzLl9wYXJlbnQhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgZ3JvdXAgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja1BhcmVudFR5cGUoKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkgJiZcbiAgICAgICAgICB0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSkge1xuICAgICAgICB0aHJvdyBuZ01vZGVsR3JvdXBFeGNlcHRpb24oKTtcbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBGb3JtR3JvdXBOYW1lKSAmJlxuICAgICAgICAgICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwRGlyZWN0aXZlKSAmJlxuICAgICAgICAgICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUFycmF5TmFtZSkpIHtcbiAgICAgICAgdGhyb3cgY29udHJvbFBhcmVudEV4Y2VwdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldFVwQ29udHJvbCgpIHtcbiAgICB0aGlzLl9jaGVja1BhcmVudFR5cGUoKTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuY29udHJvbCA9IHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sKHRoaXMpO1xuICAgIHRoaXMuX2FkZGVkID0gdHJ1ZTtcbiAgfVxufVxuIl19