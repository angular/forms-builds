/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, Inject, Input, Optional, Output, Self, forwardRef } from '@angular/core';
import { FormGroup } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS, Validators } from '../../validators';
import { ControlContainer } from '../control_container';
import { ReactiveErrors } from '../reactive_errors';
import { cleanUpControl, composeAsyncValidators, composeValidators, removeDir, setUpControl, setUpFormContainer, syncPendingControls } from '../shared';
/** @type {?} */
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupDirective)
};
/**
 * \@description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * \@usageNotes
 * **Set value**: You can set the form's initial value when instantiating the
 * `FormGroup`, or you can set it programmatically later using the `FormGroup`'s
 * {\@link AbstractControl#setValue setValue} or {\@link AbstractControl#patchValue patchValue}
 * methods.
 *
 * **Listen to value**: If you want to listen to changes in the value of the form, you can subscribe
 * to the `FormGroup`'s {\@link AbstractControl#valueChanges valueChanges} event.  You can also
 * listen to its {\@link AbstractControl#statusChanges statusChanges} event to be notified when the
 * validation status is re-calculated.
 *
 * Furthermore, you can listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event will be emitted with the original form
 * submission event.
 *
 * ### Example
 *
 * In this example, we create form controls for first name and last name.
 *
 * {\@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * \@ngModule ReactiveFormsModule
 * \@publicApi
 */
export class FormGroupDirective extends ControlContainer {
    /**
     * @param {?} _validators
     * @param {?} _asyncValidators
     */
    constructor(_validators, _asyncValidators) {
        super();
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this.submitted = false;
        this.directives = [];
        this.form = /** @type {?} */ ((null));
        this.ngSubmit = new EventEmitter();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
        }
    }
    /**
     * @return {?}
     */
    get formDirective() { return this; }
    /**
     * @return {?}
     */
    get control() { return this.form; }
    /**
     * @return {?}
     */
    get path() { return []; }
    /**
     * @param {?} dir
     * @return {?}
     */
    addControl(dir) {
        /** @type {?} */
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    getControl(dir) { return /** @type {?} */ (this.form.get(dir.path)); }
    /**
     * @param {?} dir
     * @return {?}
     */
    removeControl(dir) { removeDir(this.directives, dir); }
    /**
     * @param {?} dir
     * @return {?}
     */
    addFormGroup(dir) {
        /** @type {?} */
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    removeFormGroup(dir) { }
    /**
     * @param {?} dir
     * @return {?}
     */
    getFormGroup(dir) { return /** @type {?} */ (this.form.get(dir.path)); }
    /**
     * @param {?} dir
     * @return {?}
     */
    addFormArray(dir) {
        /** @type {?} */
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    removeFormArray(dir) { }
    /**
     * @param {?} dir
     * @return {?}
     */
    getFormArray(dir) { return /** @type {?} */ (this.form.get(dir.path)); }
    /**
     * @param {?} dir
     * @param {?} value
     * @return {?}
     */
    updateModel(dir, value) {
        /** @type {?} */
        const ctrl = /** @type {?} */ (this.form.get(dir.path));
        ctrl.setValue(value);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onSubmit($event) {
        (/** @type {?} */ (this)).submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * @return {?}
     */
    onReset() { this.resetForm(); }
    /**
     * @param {?=} value
     * @return {?}
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        (/** @type {?} */ (this)).submitted = false;
    }
    /**
     * \@internal
     * @return {?}
     */
    _updateDomValue() {
        this.directives.forEach(dir => {
            /** @type {?} */
            const newCtrl = this.form.get(dir.path);
            if (dir.control !== newCtrl) {
                cleanUpControl(dir.control, dir);
                if (newCtrl)
                    setUpControl(newCtrl, dir);
                (/** @type {?} */ (dir)).control = newCtrl;
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    /**
     * @return {?}
     */
    _updateRegistrations() {
        this.form._registerOnCollectionChange(() => this._updateDomValue());
        if (this._oldForm)
            this._oldForm._registerOnCollectionChange(() => { });
        this._oldForm = this.form;
    }
    /**
     * @return {?}
     */
    _updateValidators() {
        /** @type {?} */
        const sync = composeValidators(this._validators);
        this.form.validator = Validators.compose([/** @type {?} */ ((this.form.validator)), /** @type {?} */ ((sync))]);
        /** @type {?} */
        const async = composeAsyncValidators(this._asyncValidators);
        this.form.asyncValidator = Validators.composeAsync([/** @type {?} */ ((this.form.asyncValidator)), /** @type {?} */ ((async))]);
    }
    /**
     * @return {?}
     */
    _checkFormPresent() {
        if (!this.form) {
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
/** @nocollapse */
FormGroupDirective.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] }
];
FormGroupDirective.propDecorators = {
    form: [{ type: Input, args: ['formGroup',] }],
    ngSubmit: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    FormGroupDirective.prototype.submitted;
    /** @type {?} */
    FormGroupDirective.prototype._oldForm;
    /** @type {?} */
    FormGroupDirective.prototype.directives;
    /** @type {?} */
    FormGroupDirective.prototype.form;
    /** @type {?} */
    FormGroupDirective.prototype.ngSubmit;
    /** @type {?} */
    FormGroupDirective.prototype._validators;
    /** @type {?} */
    FormGroupDirective.prototype._asyncValidators;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBYSxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBaUIsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ25JLE9BQU8sRUFBeUIsU0FBUyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzlELE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDaEYsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFdEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFdBQVcsQ0FBQzs7QUFLdEosYUFBYSxxQkFBcUIsR0FBUTtJQUN4QyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7Q0FDbEQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQ0YsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdCQUFnQjs7Ozs7SUFXdEQsWUFDdUQsV0FBa0IsRUFDWixnQkFBdUI7UUFDbEYsS0FBSyxFQUFFLENBQUM7UUFGNkMsZ0JBQVcsR0FBWCxXQUFXLENBQU87UUFDWixxQkFBZ0IsR0FB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b250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPcHRpb25hbCwgT3V0cHV0LCBTZWxmLCBTaW1wbGVDaGFuZ2VzLCBmb3J3YXJkUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybUFycmF5LCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwfSBmcm9tICcuLi8uLi9tb2RlbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlMsIFZhbGlkYXRvcnN9IGZyb20gJy4uLy4uL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0Zvcm19IGZyb20gJy4uL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7UmVhY3RpdmVFcnJvcnN9IGZyb20gJy4uL3JlYWN0aXZlX2Vycm9ycyc7XG5pbXBvcnQge2NsZWFuVXBDb250cm9sLCBjb21wb3NlQXN5bmNWYWxpZGF0b3JzLCBjb21wb3NlVmFsaWRhdG9ycywgcmVtb3ZlRGlyLCBzZXRVcENvbnRyb2wsIHNldFVwRm9ybUNvbnRhaW5lciwgc3luY1BlbmRpbmdDb250cm9sc30gZnJvbSAnLi4vc2hhcmVkJztcblxuaW1wb3J0IHtGb3JtQ29udHJvbE5hbWV9IGZyb20gJy4vZm9ybV9jb250cm9sX25hbWUnO1xuaW1wb3J0IHtGb3JtQXJyYXlOYW1lLCBGb3JtR3JvdXBOYW1lfSBmcm9tICcuL2Zvcm1fZ3JvdXBfbmFtZSc7XG5cbmV4cG9ydCBjb25zdCBmb3JtRGlyZWN0aXZlUHJvdmlkZXI6IGFueSA9IHtcbiAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUdyb3VwRGlyZWN0aXZlKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBCaW5kcyBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGFjY2VwdHMgYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuIEl0IHdpbGwgdGhlbiB1c2UgdGhpc1xuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgdG8gbWF0Y2ggYW55IGNoaWxkIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLFxuICogYW5kIGBGb3JtQXJyYXlgIGluc3RhbmNlcyB0byBjaGlsZCBgRm9ybUNvbnRyb2xOYW1lYCwgYEZvcm1Hcm91cE5hbWVgLFxuICogYW5kIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiAqKlNldCB2YWx1ZSoqOiBZb3UgY2FuIHNldCB0aGUgZm9ybSdzIGluaXRpYWwgdmFsdWUgd2hlbiBpbnN0YW50aWF0aW5nIHRoZVxuICogYEZvcm1Hcm91cGAsIG9yIHlvdSBjYW4gc2V0IGl0IHByb2dyYW1tYXRpY2FsbHkgbGF0ZXIgdXNpbmcgdGhlIGBGb3JtR3JvdXBgJ3NcbiAqIHtAbGluayBBYnN0cmFjdENvbnRyb2wjc2V0VmFsdWUgc2V0VmFsdWV9IG9yIHtAbGluayBBYnN0cmFjdENvbnRyb2wjcGF0Y2hWYWx1ZSBwYXRjaFZhbHVlfVxuICogbWV0aG9kcy5cbiAqXG4gKiAqKkxpc3RlbiB0byB2YWx1ZSoqOiBJZiB5b3Ugd2FudCB0byBsaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgdmFsdWUgb2YgdGhlIGZvcm0sIHlvdSBjYW4gc3Vic2NyaWJlXG4gKiB0byB0aGUgYEZvcm1Hcm91cGAncyB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3ZhbHVlQ2hhbmdlcyB2YWx1ZUNoYW5nZXN9IGV2ZW50LiAgWW91IGNhbiBhbHNvXG4gKiBsaXN0ZW4gdG8gaXRzIHtAbGluayBBYnN0cmFjdENvbnRyb2wjc3RhdHVzQ2hhbmdlcyBzdGF0dXNDaGFuZ2VzfSBldmVudCB0byBiZSBub3RpZmllZCB3aGVuIHRoZVxuICogdmFsaWRhdGlvbiBzdGF0dXMgaXMgcmUtY2FsY3VsYXRlZC5cbiAqXG4gKiBGdXJ0aGVybW9yZSwgeW91IGNhbiBsaXN0ZW4gdG8gdGhlIGRpcmVjdGl2ZSdzIGBuZ1N1Ym1pdGAgZXZlbnQgdG8gYmUgbm90aWZpZWQgd2hlbiB0aGUgdXNlciBoYXNcbiAqIHRyaWdnZXJlZCBhIGZvcm0gc3VibWlzc2lvbi4gVGhlIGBuZ1N1Ym1pdGAgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggdGhlIG9yaWdpbmFsIGZvcm1cbiAqIHN1Ym1pc3Npb24gZXZlbnQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBJbiB0aGlzIGV4YW1wbGUsIHdlIGNyZWF0ZSBmb3JtIGNvbnRyb2xzIGZvciBmaXJzdCBuYW1lIGFuZCBsYXN0IG5hbWUuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZm9ybUdyb3VwXScsXG4gIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gIGhvc3Q6IHsnKHN1Ym1pdCknOiAnb25TdWJtaXQoJGV2ZW50KScsICcocmVzZXQpJzogJ29uUmVzZXQoKSd9LFxuICBleHBvcnRBczogJ25nRm9ybSdcbn0pXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwRGlyZWN0aXZlIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciBpbXBsZW1lbnRzIEZvcm0sXG4gICAgT25DaGFuZ2VzIHtcbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbGRGb3JtICE6IEZvcm1Hcm91cDtcbiAgZGlyZWN0aXZlczogRm9ybUNvbnRyb2xOYW1lW10gPSBbXTtcblxuICBASW5wdXQoJ2Zvcm1Hcm91cCcpIGZvcm06IEZvcm1Hcm91cCA9IG51bGwgITtcbiAgQE91dHB1dCgpIG5nU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHByaXZhdGUgX3ZhbGlkYXRvcnM6IGFueVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIHByaXZhdGUgX2FzeW5jVmFsaWRhdG9yczogYW55W10pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrRm9ybVByZXNlbnQoKTtcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZm9ybScpKSB7XG4gICAgICB0aGlzLl91cGRhdGVWYWxpZGF0b3JzKCk7XG4gICAgICB0aGlzLl91cGRhdGVEb21WYWx1ZSgpO1xuICAgICAgdGhpcy5fdXBkYXRlUmVnaXN0cmF0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBmb3JtRGlyZWN0aXZlKCk6IEZvcm0geyByZXR1cm4gdGhpczsgfVxuXG4gIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7IHJldHVybiB0aGlzLmZvcm07IH1cblxuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7IHJldHVybiBbXTsgfVxuXG4gIGFkZENvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiBGb3JtQ29udHJvbCB7XG4gICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgc2V0VXBDb250cm9sKGN0cmwsIGRpcik7XG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgdGhpcy5kaXJlY3RpdmVzLnB1c2goZGlyKTtcbiAgICByZXR1cm4gY3RybDtcbiAgfVxuXG4gIGdldENvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiBGb3JtQ29udHJvbCB7IHJldHVybiA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7IH1cblxuICByZW1vdmVDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogdm9pZCB7IHJlbW92ZURpcjxGb3JtQ29udHJvbE5hbWU+KHRoaXMuZGlyZWN0aXZlcywgZGlyKTsgfVxuXG4gIGFkZEZvcm1Hcm91cChkaXI6IEZvcm1Hcm91cE5hbWUpOiB2b2lkIHtcbiAgICBjb25zdCBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBzZXRVcEZvcm1Db250YWluZXIoY3RybCwgZGlyKTtcbiAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIHJlbW92ZUZvcm1Hcm91cChkaXI6IEZvcm1Hcm91cE5hbWUpOiB2b2lkIHt9XG5cbiAgZ2V0Rm9ybUdyb3VwKGRpcjogRm9ybUdyb3VwTmFtZSk6IEZvcm1Hcm91cCB7IHJldHVybiA8Rm9ybUdyb3VwPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpOyB9XG5cbiAgYWRkRm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IHZvaWQge1xuICAgIGNvbnN0IGN0cmw6IGFueSA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIHNldFVwRm9ybUNvbnRhaW5lcihjdHJsLCBkaXIpO1xuICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgcmVtb3ZlRm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IHZvaWQge31cblxuICBnZXRGb3JtQXJyYXkoZGlyOiBGb3JtQXJyYXlOYW1lKTogRm9ybUFycmF5IHsgcmV0dXJuIDxGb3JtQXJyYXk+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7IH1cblxuICB1cGRhdGVNb2RlbChkaXI6IEZvcm1Db250cm9sTmFtZSwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGN0cmzCoCA9IDxGb3JtQ29udHJvbD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBjdHJsLnNldFZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIG9uU3VibWl0KCRldmVudDogRXZlbnQpOiBib29sZWFuIHtcbiAgICAodGhpcyBhc3tzdWJtaXR0ZWQ6IGJvb2xlYW59KS5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgIHN5bmNQZW5kaW5nQ29udHJvbHModGhpcy5mb3JtLCB0aGlzLmRpcmVjdGl2ZXMpO1xuICAgIHRoaXMubmdTdWJtaXQuZW1pdCgkZXZlbnQpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIG9uUmVzZXQoKTogdm9pZCB7IHRoaXMucmVzZXRGb3JtKCk7IH1cblxuICByZXNldEZvcm0odmFsdWU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHRoaXMuZm9ybS5yZXNldCh2YWx1ZSk7XG4gICAgKHRoaXMgYXN7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gZmFsc2U7XG4gIH1cblxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZURvbVZhbHVlKCkge1xuICAgIHRoaXMuZGlyZWN0aXZlcy5mb3JFYWNoKGRpciA9PiB7XG4gICAgICBjb25zdCBuZXdDdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICAgIGlmIChkaXIuY29udHJvbCAhPT0gbmV3Q3RybCkge1xuICAgICAgICBjbGVhblVwQ29udHJvbChkaXIuY29udHJvbCwgZGlyKTtcbiAgICAgICAgaWYgKG5ld0N0cmwpIHNldFVwQ29udHJvbChuZXdDdHJsLCBkaXIpO1xuICAgICAgICAoZGlyIGFze2NvbnRyb2w6IEZvcm1Db250cm9sfSkuY29udHJvbCA9IG5ld0N0cmw7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmZvcm0uX3VwZGF0ZVRyZWVWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUmVnaXN0cmF0aW9ucygpIHtcbiAgICB0aGlzLmZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHRoaXMuX3VwZGF0ZURvbVZhbHVlKCkpO1xuICAgIGlmICh0aGlzLl9vbGRGb3JtKSB0aGlzLl9vbGRGb3JtLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgdGhpcy5fb2xkRm9ybSA9IHRoaXMuZm9ybTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVZhbGlkYXRvcnMoKSB7XG4gICAgY29uc3Qgc3luYyA9IGNvbXBvc2VWYWxpZGF0b3JzKHRoaXMuX3ZhbGlkYXRvcnMpO1xuICAgIHRoaXMuZm9ybS52YWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2UoW3RoaXMuZm9ybS52YWxpZGF0b3IgISwgc3luYyAhXSk7XG5cbiAgICBjb25zdCBhc3luYyA9IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModGhpcy5fYXN5bmNWYWxpZGF0b3JzKTtcbiAgICB0aGlzLmZvcm0uYXN5bmNWYWxpZGF0b3IgPSBWYWxpZGF0b3JzLmNvbXBvc2VBc3luYyhbdGhpcy5mb3JtLmFzeW5jVmFsaWRhdG9yICEsIGFzeW5jICFdKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrRm9ybVByZXNlbnQoKSB7XG4gICAgaWYgKCF0aGlzLmZvcm0pIHtcbiAgICAgIFJlYWN0aXZlRXJyb3JzLm1pc3NpbmdGb3JtRXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=