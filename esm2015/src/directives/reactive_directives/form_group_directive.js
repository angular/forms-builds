/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Output, Self } from '@angular/core';
import { FormGroup } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { ControlContainer } from '../control_container';
import { ReactiveErrors } from '../reactive_errors';
import { cleanUpControl, cleanUpValidators, removeDir, setUpControl, setUpFormContainer, setUpValidators, syncPendingControls } from '../shared';
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupDirective)
};
/**
 * @description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormGroupDirective extends ControlContainer {
    constructor(validators, asyncValidators) {
        super();
        this.validators = validators;
        this.asyncValidators = asyncValidators;
        /**
         * @description
         * Reports whether the form submission has been triggered.
         */
        this.submitted = false;
        /**
         * @description
         * Tracks the list of added `FormControlName` instances
         */
        this.directives = [];
        /**
         * @description
         * Tracks the `FormGroup` bound to this directive.
         */
        this.form = null;
        /**
         * @description
         * Emits an event when the form submission has been triggered.
         */
        this.ngSubmit = new EventEmitter();
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
            this._oldForm = this.form;
        }
    }
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir) {
        removeDir(this.directives, dir);
    }
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    /**
     * No-op method to remove the form group.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir) { }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Adds a new `FormArrayName` directive instance to the form.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    /**
     * No-op method to remove the form array.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir) { }
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    }
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset() {
        this.resetForm();
    }
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            const newCtrl = this.form.get(dir.path);
            if (dir.control !== newCtrl) {
                // Note: the value of the `dir.control` may not be defined, for example when it's a first
                // `FormControl` that is added to a `FormGroup` instance (via `addControl` call).
                cleanUpControl(dir.control || null, dir);
                if (newCtrl)
                    setUpControl(newCtrl, dir);
                dir.control = newCtrl;
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    _updateRegistrations() {
        this.form._registerOnCollectionChange(() => this._updateDomValue());
        if (this._oldForm) {
            this._oldForm._registerOnCollectionChange(() => { });
        }
    }
    _updateValidators() {
        setUpValidators(this.form, this, /* handleOnValidatorChange */ false);
        if (this._oldForm) {
            cleanUpValidators(this._oldForm, this, /* handleOnValidatorChange */ false);
        }
    }
    _checkFormPresent() {
        if (!this.form && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            ReactiveErrors.missingFormException();
        }
    }
}
FormGroupDirective.decorators = [
    { type: Directive, args: [{
                selector: '[formGroup]',
                providers: [formDirectiveProvider],
                host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                exportAs: 'ngForm'
            },] }
];
FormGroupDirective.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] }
];
FormGroupDirective.propDecorators = {
    form: [{ type: Input, args: ['formGroup',] }],
    ngSubmit: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFhLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQztBQUVuSSxPQUFPLEVBQXlCLFNBQVMsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM5RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDcEUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFdEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxlQUFlLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFNL0ksTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDeEMsT0FBTyxFQUFFLGdCQUFnQjtJQUN6QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0NBQ2xELENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRztBQU9ILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQkFBZ0I7SUErQnRELFlBQ3VELFVBQXFDLEVBQy9CLGVBQ2xCO1FBQ3pDLEtBQUssRUFBRSxDQUFDO1FBSDZDLGVBQVUsR0FBVixVQUFVLENBQTJCO1FBQy9CLG9CQUFlLEdBQWYsZUFB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QyxvQkFBb0IsRUFBRSxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQzs7O1lBNVBGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsYUFBYTtnQkFDdkIsU0FBUyxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxFQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFDO2dCQUM5RCxRQUFRLEVBQUUsUUFBUTthQUNuQjs7O3dDQWlDTSxRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyxhQUFhO3dDQUN4QyxRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyxtQkFBbUI7OzttQkFWbEQsS0FBSyxTQUFDLFdBQVc7dUJBTWpCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPcHRpb25hbCwgT3V0cHV0LCBTZWxmLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtQXJyYXksIEZvcm1Db250cm9sLCBGb3JtR3JvdXB9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4uL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Rm9ybX0gZnJvbSAnLi4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHtSZWFjdGl2ZUVycm9yc30gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7Y2xlYW5VcENvbnRyb2wsIGNsZWFuVXBWYWxpZGF0b3JzLCByZW1vdmVEaXIsIHNldFVwQ29udHJvbCwgc2V0VXBGb3JtQ29udGFpbmVyLCBzZXRVcFZhbGlkYXRvcnMsIHN5bmNQZW5kaW5nQ29udHJvbHN9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtGb3JtQ29udHJvbE5hbWV9IGZyb20gJy4vZm9ybV9jb250cm9sX25hbWUnO1xuaW1wb3J0IHtGb3JtQXJyYXlOYW1lLCBGb3JtR3JvdXBOYW1lfSBmcm9tICcuL2Zvcm1fZ3JvdXBfbmFtZSc7XG5cbmV4cG9ydCBjb25zdCBmb3JtRGlyZWN0aXZlUHJvdmlkZXI6IGFueSA9IHtcbiAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUdyb3VwRGlyZWN0aXZlKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBCaW5kcyBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGFjY2VwdHMgYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuIEl0IHdpbGwgdGhlbiB1c2UgdGhpc1xuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgdG8gbWF0Y2ggYW55IGNoaWxkIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLFxuICogYW5kIGBGb3JtQXJyYXlgIGluc3RhbmNlcyB0byBjaGlsZCBgRm9ybUNvbnRyb2xOYW1lYCwgYEZvcm1Hcm91cE5hbWVgLFxuICogYW5kIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgYEFic3RyYWN0Q29udHJvbGBcbiAqXG4gKiAjIyMgUmVnaXN0ZXIgRm9ybSBHcm91cFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSByZWdpc3RlcnMgYSBgRm9ybUdyb3VwYCB3aXRoIGZpcnN0IG5hbWUgYW5kIGxhc3QgbmFtZSBjb250cm9scyxcbiAqIGFuZCBsaXN0ZW5zIGZvciB0aGUgKm5nU3VibWl0KiBldmVudCB3aGVuIHRoZSBidXR0b24gaXMgY2xpY2tlZC5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybUdyb3VwL3NpbXBsZV9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tmb3JtR3JvdXBdJyxcbiAgcHJvdmlkZXJzOiBbZm9ybURpcmVjdGl2ZVByb3ZpZGVyXSxcbiAgaG9zdDogeycoc3VibWl0KSc6ICdvblN1Ym1pdCgkZXZlbnQpJywgJyhyZXNldCknOiAnb25SZXNldCgpJ30sXG4gIGV4cG9ydEFzOiAnbmdGb3JtJ1xufSlcbmV4cG9ydCBjbGFzcyBGb3JtR3JvdXBEaXJlY3RpdmUgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgRm9ybSwgT25DaGFuZ2VzIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0dGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byBhbiBvbGQgZm9ybSBncm91cCBpbnB1dCB2YWx1ZSwgd2hpY2ggaXMgbmVlZGVkIHRvIGNsZWFudXAgb2xkIGluc3RhbmNlIGluIGNhc2UgaXRcbiAgICogd2FzIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLlxuICAgKi9cbiAgcHJpdmF0ZSBfb2xkRm9ybTogRm9ybUdyb3VwfHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgbGlzdCBvZiBhZGRlZCBgRm9ybUNvbnRyb2xOYW1lYCBpbnN0YW5jZXNcbiAgICovXG4gIGRpcmVjdGl2ZXM6IEZvcm1Db250cm9sTmFtZVtdID0gW107XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIGBGb3JtR3JvdXBgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KCdmb3JtR3JvdXAnKSBmb3JtOiBGb3JtR3JvdXAgPSBudWxsITtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEVtaXRzIGFuIGV2ZW50IHdoZW4gdGhlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAqL1xuICBAT3V0cHV0KCkgbmdTdWJtaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgcHJpdmF0ZSB2YWxpZGF0b3JzOiAoVmFsaWRhdG9yfFZhbGlkYXRvckZuKVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIHByaXZhdGUgYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgIChBc3luY1ZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvckZuKVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX3NldEFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tGb3JtUHJlc2VudCgpO1xuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdmb3JtJykpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZVZhbGlkYXRvcnMoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZURvbVZhbHVlKCk7XG4gICAgICB0aGlzLl91cGRhdGVSZWdpc3RyYXRpb25zKCk7XG4gICAgICB0aGlzLl9vbGRGb3JtID0gdGhpcy5mb3JtO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyB0aGlzIGRpcmVjdGl2ZSdzIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0IGZvcm1EaXJlY3RpdmUoKTogRm9ybSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgdGhlIGBGb3JtR3JvdXBgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IGNvbnRyb2woKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGlzIGdyb3VwLiBCZWNhdXNlIHRoaXMgZGlyZWN0aXZlXG4gICAqIGFsd2F5cyBsaXZlcyBhdCB0aGUgdG9wIGxldmVsIG9mIGEgZm9ybSwgaXQgYWx3YXlzIGFuIGVtcHR5IGFycmF5LlxuICAgKi9cbiAgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgc2V0cyB1cCB0aGUgY29udHJvbCBkaXJlY3RpdmUgaW4gdGhpcyBncm91cCwgcmUtY2FsY3VsYXRlcyBpdHMgdmFsdWVcbiAgICogYW5kIHZhbGlkaXR5LCBhbmQgYWRkcyB0aGUgaW5zdGFuY2UgdG8gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlcy5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkQ29udHJvbChkaXI6IEZvcm1Db250cm9sTmFtZSk6IEZvcm1Db250cm9sIHtcbiAgICBjb25zdCBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBzZXRVcENvbnRyb2woY3RybCwgZGlyKTtcbiAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgICB0aGlzLmRpcmVjdGl2ZXMucHVzaChkaXIpO1xuICAgIHJldHVybiBjdHJsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgZnJvbSB0aGUgcHJvdmlkZWQgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGdldENvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIDxGb3JtQ29udHJvbD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVtb3ZlcyB0aGUgYEZvcm1Db250cm9sTmFtZWAgaW5zdGFuY2UgZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiB2b2lkIHtcbiAgICByZW1vdmVEaXI8Rm9ybUNvbnRyb2xOYW1lPih0aGlzLmRpcmVjdGl2ZXMsIGRpcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkRm9ybUdyb3VwKGRpcjogRm9ybUdyb3VwTmFtZSk6IHZvaWQge1xuICAgIGNvbnN0IGN0cmw6IGFueSA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIHNldFVwRm9ybUNvbnRhaW5lcihjdHJsLCBkaXIpO1xuICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE5vLW9wIG1ldGhvZCB0byByZW1vdmUgdGhlIGZvcm0gZ3JvdXAuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogdm9pZCB7fVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUdyb3VwYCBmb3IgYSBwcm92aWRlZCBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gPEZvcm1Hcm91cD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbmV3IGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UgdG8gdGhlIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRGb3JtQXJyYXkoZGlyOiBGb3JtQXJyYXlOYW1lKTogdm9pZCB7XG4gICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgc2V0VXBGb3JtQ29udGFpbmVyKGN0cmwsIGRpcik7XG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogTm8tb3AgbWV0aG9kIHRvIHJlbW92ZSB0aGUgZm9ybSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIHJlbW92ZUZvcm1BcnJheShkaXI6IEZvcm1BcnJheU5hbWUpOiB2b2lkIHt9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtQXJyYXlgIGZvciBhIHByb3ZpZGVkIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRGb3JtQXJyYXkoZGlyOiBGb3JtQXJyYXlOYW1lKTogRm9ybUFycmF5IHtcbiAgICByZXR1cm4gPEZvcm1BcnJheT50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBkaXJlY3RpdmUncyBjb250cm9sLlxuICAgKi9cbiAgdXBkYXRlTW9kZWwoZGlyOiBGb3JtQ29udHJvbE5hbWUsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBjdHJswqAgPSA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgY3RybC5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCBjYWxsZWQgd2l0aCB0aGUgXCJzdWJtaXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAqIFRyaWdnZXJzIHRoZSBgbmdTdWJtaXRgIGVtaXR0ZXIgdG8gZW1pdCB0aGUgXCJzdWJtaXRcIiBldmVudCBhcyBpdHMgcGF5bG9hZC5cbiAgICpcbiAgICogQHBhcmFtICRldmVudCBUaGUgXCJzdWJtaXRcIiBldmVudCBvYmplY3RcbiAgICovXG4gIG9uU3VibWl0KCRldmVudDogRXZlbnQpOiBib29sZWFuIHtcbiAgICAodGhpcyBhcyB7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICBzeW5jUGVuZGluZ0NvbnRyb2xzKHRoaXMuZm9ybSwgdGhpcy5kaXJlY3RpdmVzKTtcbiAgICB0aGlzLm5nU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgXCJyZXNldFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICovXG4gIG9uUmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldEZvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVzZXRzIHRoZSBmb3JtIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIHJlc2V0cyBpdHMgc3VibWl0dGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBmb3JtLlxuICAgKi9cbiAgcmVzZXRGb3JtKHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm0ucmVzZXQodmFsdWUpO1xuICAgICh0aGlzIGFzIHtzdWJtaXR0ZWQ6IGJvb2xlYW59KS5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgfVxuXG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlRG9tVmFsdWUoKSB7XG4gICAgdGhpcy5kaXJlY3RpdmVzLmZvckVhY2goZGlyID0+IHtcbiAgICAgIGNvbnN0IG5ld0N0cmw6IGFueSA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgICAgaWYgKGRpci5jb250cm9sICE9PSBuZXdDdHJsKSB7XG4gICAgICAgIC8vIE5vdGU6IHRoZSB2YWx1ZSBvZiB0aGUgYGRpci5jb250cm9sYCBtYXkgbm90IGJlIGRlZmluZWQsIGZvciBleGFtcGxlIHdoZW4gaXQncyBhIGZpcnN0XG4gICAgICAgIC8vIGBGb3JtQ29udHJvbGAgdGhhdCBpcyBhZGRlZCB0byBhIGBGb3JtR3JvdXBgIGluc3RhbmNlICh2aWEgYGFkZENvbnRyb2xgIGNhbGwpLlxuICAgICAgICBjbGVhblVwQ29udHJvbChkaXIuY29udHJvbCB8fCBudWxsLCBkaXIpO1xuICAgICAgICBpZiAobmV3Q3RybCkgc2V0VXBDb250cm9sKG5ld0N0cmwsIGRpcik7XG4gICAgICAgIChkaXIgYXMge2NvbnRyb2w6IEZvcm1Db250cm9sfSkuY29udHJvbCA9IG5ld0N0cmw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmZvcm0uX3VwZGF0ZVRyZWVWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUmVnaXN0cmF0aW9ucygpIHtcbiAgICB0aGlzLmZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHRoaXMuX3VwZGF0ZURvbVZhbHVlKCkpO1xuICAgIGlmICh0aGlzLl9vbGRGb3JtKSB7XG4gICAgICB0aGlzLl9vbGRGb3JtLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVmFsaWRhdG9ycygpIHtcbiAgICBzZXRVcFZhbGlkYXRvcnModGhpcy5mb3JtLCB0aGlzLCAvKiBoYW5kbGVPblZhbGlkYXRvckNoYW5nZSAqLyBmYWxzZSk7XG4gICAgaWYgKHRoaXMuX29sZEZvcm0pIHtcbiAgICAgIGNsZWFuVXBWYWxpZGF0b3JzKHRoaXMuX29sZEZvcm0sIHRoaXMsIC8qIGhhbmRsZU9uVmFsaWRhdG9yQ2hhbmdlICovIGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jaGVja0Zvcm1QcmVzZW50KCkge1xuICAgIGlmICghdGhpcy5mb3JtICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5taXNzaW5nRm9ybUV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufVxuIl19