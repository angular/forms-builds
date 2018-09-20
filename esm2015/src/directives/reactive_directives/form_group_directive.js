/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directive, EventEmitter, Inject, Input, Optional, Output, Self, forwardRef } from '@angular/core';
import { FormGroup } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS, Validators } from '../../validators';
import { ControlContainer } from '../control_container';
import { ReactiveErrors } from '../reactive_errors';
import { cleanUpControl, composeAsyncValidators, composeValidators, removeDir, setUpControl, setUpFormContainer, syncPendingControls } from '../shared';
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
 * **Set value**: You can set the form's initial value when instantiating the
 * `FormGroup`, or you can set it programmatically later using the `FormGroup`'s
 * {@link AbstractControl#setValue setValue} or {@link AbstractControl#patchValue patchValue}
 * methods.
 *
 * **Listen to value**: If you want to listen to changes in the value of the form, you can subscribe
 * to the `FormGroup`'s {@link AbstractControl#valueChanges valueChanges} event.  You can also
 * listen to its {@link AbstractControl#statusChanges statusChanges} event to be notified when the
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
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 */
let FormGroupDirective = class FormGroupDirective extends ControlContainer {
    constructor(_validators, _asyncValidators) {
        super();
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        this.submitted = false;
        this.directives = [];
        this.form = null;
        this.ngSubmit = new EventEmitter();
    }
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
        }
    }
    get formDirective() { return this; }
    get control() { return this.form; }
    get path() { return []; }
    addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    getControl(dir) { return this.form.get(dir.path); }
    removeControl(dir) { removeDir(this.directives, dir); }
    addFormGroup(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    removeFormGroup(dir) { }
    getFormGroup(dir) { return this.form.get(dir.path); }
    addFormArray(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    removeFormArray(dir) { }
    getFormArray(dir) { return this.form.get(dir.path); }
    updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    }
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        return false;
    }
    onReset() { this.resetForm(); }
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            const newCtrl = this.form.get(dir.path);
            if (dir.control !== newCtrl) {
                cleanUpControl(dir.control, dir);
                if (newCtrl)
                    setUpControl(newCtrl, dir);
                dir.control = newCtrl;
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    _updateRegistrations() {
        this.form._registerOnCollectionChange(() => this._updateDomValue());
        if (this._oldForm)
            this._oldForm._registerOnCollectionChange(() => { });
        this._oldForm = this.form;
    }
    _updateValidators() {
        const sync = composeValidators(this._validators);
        this.form.validator = Validators.compose([this.form.validator, sync]);
        const async = composeAsyncValidators(this._asyncValidators);
        this.form.asyncValidator = Validators.composeAsync([this.form.asyncValidator, async]);
    }
    _checkFormPresent() {
        if (!this.form) {
            ReactiveErrors.missingFormException();
        }
    }
};
tslib_1.__decorate([
    Input('formGroup'),
    tslib_1.__metadata("design:type", FormGroup)
], FormGroupDirective.prototype, "form", void 0);
tslib_1.__decorate([
    Output(),
    tslib_1.__metadata("design:type", Object)
], FormGroupDirective.prototype, "ngSubmit", void 0);
FormGroupDirective = tslib_1.__decorate([
    Directive({
        selector: '[formGroup]',
        providers: [formDirectiveProvider],
        host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
        exportAs: 'ngForm'
    }),
    tslib_1.__param(0, Optional()), tslib_1.__param(0, Self()), tslib_1.__param(0, Inject(NG_VALIDATORS)),
    tslib_1.__param(1, Optional()), tslib_1.__param(1, Self()), tslib_1.__param(1, Inject(NG_ASYNC_VALIDATORS)),
    tslib_1.__metadata("design:paramtypes", [Array, Array])
], FormGroupDirective);
export { FormGroupDirective };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFhLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFpQixVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDbkksT0FBTyxFQUF5QixTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxVQUFVLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUV0RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sV0FBVyxDQUFDO0FBS3RKLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztDQUNsRCxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFPSCxJQUFhLGtCQUFrQixHQUEvQix3QkFBZ0MsU0FBUSxnQkFBZ0I7SUFXdEQsWUFDdUQsV0FBa0IsRUFDWixnQkFBdUI7UUFDbEYsS0FBSyxFQUFFLENBQUM7UUFGNkMsZ0JBQVcsR0FBWCxX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QztRQUM5RCxRQUFRLEVBQUUsUUFBUTtLQUNuQixDQUFDO0lBYUssbUJBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxtQkFBQSxJQUFJLEVBQUUsQ0FBQSxFQUFFLG1CQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUN6QyxtQkFBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLG1CQUFBLElBQUksRUFBRSxDQUFBLEVBQUUsbUJBQUEsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUE7O0dBYnpDLGtCQUFrQixDQXFIOUI7U0FySFksa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9wdGlvbmFsLCBPdXRwdXQsIFNlbGYsIFNpbXBsZUNoYW5nZXMsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtQXJyYXksIEZvcm1Db250cm9sLCBGb3JtR3JvdXB9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SUywgVmFsaWRhdG9yc30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4uL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Rm9ybX0gZnJvbSAnLi4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHtSZWFjdGl2ZUVycm9yc30gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7Y2xlYW5VcENvbnRyb2wsIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzLCByZW1vdmVEaXIsIHNldFVwQ29udHJvbCwgc2V0VXBGb3JtQ29udGFpbmVyLCBzeW5jUGVuZGluZ0NvbnRyb2xzfSBmcm9tICcuLi9zaGFyZWQnO1xuXG5pbXBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9mb3JtX2NvbnRyb2xfbmFtZSc7XG5pbXBvcnQge0Zvcm1BcnJheU5hbWUsIEZvcm1Hcm91cE5hbWV9IGZyb20gJy4vZm9ybV9ncm91cF9uYW1lJztcblxuZXhwb3J0IGNvbnN0IGZvcm1EaXJlY3RpdmVQcm92aWRlcjogYW55ID0ge1xuICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBGb3JtR3JvdXBEaXJlY3RpdmUpXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEJpbmRzIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgYWNjZXB0cyBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCBpbnN0YW5jZS4gSXQgd2lsbCB0aGVuIHVzZSB0aGlzXG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB0byBtYXRjaCBhbnkgY2hpbGQgYEZvcm1Db250cm9sYCwgYEZvcm1Hcm91cGAsXG4gKiBhbmQgYEZvcm1BcnJheWAgaW5zdGFuY2VzIHRvIGNoaWxkIGBGb3JtQ29udHJvbE5hbWVgLCBgRm9ybUdyb3VwTmFtZWAsXG4gKiBhbmQgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZXMuXG4gKlxuICogKipTZXQgdmFsdWUqKjogWW91IGNhbiBzZXQgdGhlIGZvcm0ncyBpbml0aWFsIHZhbHVlIHdoZW4gaW5zdGFudGlhdGluZyB0aGVcbiAqIGBGb3JtR3JvdXBgLCBvciB5b3UgY2FuIHNldCBpdCBwcm9ncmFtbWF0aWNhbGx5IGxhdGVyIHVzaW5nIHRoZSBgRm9ybUdyb3VwYCdzXG4gKiB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3NldFZhbHVlIHNldFZhbHVlfSBvciB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3BhdGNoVmFsdWUgcGF0Y2hWYWx1ZX1cbiAqIG1ldGhvZHMuXG4gKlxuICogKipMaXN0ZW4gdG8gdmFsdWUqKjogSWYgeW91IHdhbnQgdG8gbGlzdGVuIHRvIGNoYW5nZXMgaW4gdGhlIHZhbHVlIG9mIHRoZSBmb3JtLCB5b3UgY2FuIHN1YnNjcmliZVxuICogdG8gdGhlIGBGb3JtR3JvdXBgJ3Mge0BsaW5rIEFic3RyYWN0Q29udHJvbCN2YWx1ZUNoYW5nZXMgdmFsdWVDaGFuZ2VzfSBldmVudC4gIFlvdSBjYW4gYWxzb1xuICogbGlzdGVuIHRvIGl0cyB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3N0YXR1c0NoYW5nZXMgc3RhdHVzQ2hhbmdlc30gZXZlbnQgdG8gYmUgbm90aWZpZWQgd2hlbiB0aGVcbiAqIHZhbGlkYXRpb24gc3RhdHVzIGlzIHJlLWNhbGN1bGF0ZWQuXG4gKlxuICogRnVydGhlcm1vcmUsIHlvdSBjYW4gbGlzdGVuIHRvIHRoZSBkaXJlY3RpdmUncyBgbmdTdWJtaXRgIGV2ZW50IHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIHVzZXIgaGFzXG4gKiB0cmlnZ2VyZWQgYSBmb3JtIHN1Ym1pc3Npb24uIFRoZSBgbmdTdWJtaXRgIGV2ZW50IHdpbGwgYmUgZW1pdHRlZCB3aXRoIHRoZSBvcmlnaW5hbCBmb3JtXG4gKiBzdWJtaXNzaW9uIGV2ZW50LlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogSW4gdGhpcyBleGFtcGxlLCB3ZSBjcmVhdGUgZm9ybSBjb250cm9scyBmb3IgZmlyc3QgbmFtZSBhbmQgbGFzdCBuYW1lLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtR3JvdXAvc2ltcGxlX2Zvcm1fZ3JvdXBfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2Zvcm1Hcm91cF0nLFxuICBwcm92aWRlcnM6IFtmb3JtRGlyZWN0aXZlUHJvdmlkZXJdLFxuICBob3N0OiB7JyhzdWJtaXQpJzogJ29uU3VibWl0KCRldmVudCknLCAnKHJlc2V0KSc6ICdvblJlc2V0KCknfSxcbiAgZXhwb3J0QXM6ICduZ0Zvcm0nXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cERpcmVjdGl2ZSBleHRlbmRzIENvbnRyb2xDb250YWluZXIgaW1wbGVtZW50cyBGb3JtLFxuICAgIE9uQ2hhbmdlcyB7XG4gIHB1YmxpYyByZWFkb25seSBzdWJtaXR0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb2xkRm9ybSAhOiBGb3JtR3JvdXA7XG4gIGRpcmVjdGl2ZXM6IEZvcm1Db250cm9sTmFtZVtdID0gW107XG5cbiAgQElucHV0KCdmb3JtR3JvdXAnKSBmb3JtOiBGb3JtR3JvdXAgPSBudWxsICE7XG4gIEBPdXRwdXQoKSBuZ1N1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSBwcml2YXRlIF92YWxpZGF0b3JzOiBhbnlbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBwcml2YXRlIF9hc3luY1ZhbGlkYXRvcnM6IGFueVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0Zvcm1QcmVzZW50KCk7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Zvcm0nKSkge1xuICAgICAgdGhpcy5fdXBkYXRlVmFsaWRhdG9ycygpO1xuICAgICAgdGhpcy5fdXBkYXRlRG9tVmFsdWUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtIHsgcmV0dXJuIHRoaXM7IH1cblxuICBnZXQgY29udHJvbCgpOiBGb3JtR3JvdXAgeyByZXR1cm4gdGhpcy5mb3JtOyB9XG5cbiAgZ2V0IHBhdGgoKTogc3RyaW5nW10geyByZXR1cm4gW107IH1cblxuICBhZGRDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogRm9ybUNvbnRyb2wge1xuICAgIGNvbnN0IGN0cmw6IGFueSA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIHNldFVwQ29udHJvbChjdHJsLCBkaXIpO1xuICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGRpcik7XG4gICAgcmV0dXJuIGN0cmw7XG4gIH1cblxuICBnZXRDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogRm9ybUNvbnRyb2wgeyByZXR1cm4gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpOyB9XG5cbiAgcmVtb3ZlQ29udHJvbChkaXI6IEZvcm1Db250cm9sTmFtZSk6IHZvaWQgeyByZW1vdmVEaXI8Rm9ybUNvbnRyb2xOYW1lPih0aGlzLmRpcmVjdGl2ZXMsIGRpcik7IH1cblxuICBhZGRGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogdm9pZCB7XG4gICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgc2V0VXBGb3JtQ29udGFpbmVyKGN0cmwsIGRpcik7XG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogdm9pZCB7fVxuXG4gIGdldEZvcm1Hcm91cChkaXI6IEZvcm1Hcm91cE5hbWUpOiBGb3JtR3JvdXAgeyByZXR1cm4gPEZvcm1Hcm91cD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTsgfVxuXG4gIGFkZEZvcm1BcnJheShkaXI6IEZvcm1BcnJheU5hbWUpOiB2b2lkIHtcbiAgICBjb25zdCBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBzZXRVcEZvcm1Db250YWluZXIoY3RybCwgZGlyKTtcbiAgICBjdHJsLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIHJlbW92ZUZvcm1BcnJheShkaXI6IEZvcm1BcnJheU5hbWUpOiB2b2lkIHt9XG5cbiAgZ2V0Rm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IEZvcm1BcnJheSB7IHJldHVybiA8Rm9ybUFycmF5PnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpOyB9XG5cbiAgdXBkYXRlTW9kZWwoZGlyOiBGb3JtQ29udHJvbE5hbWUsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBjdHJswqAgPSA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgY3RybC5zZXRWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICBvblN1Ym1pdCgkZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgKHRoaXMgYXN7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICBzeW5jUGVuZGluZ0NvbnRyb2xzKHRoaXMuZm9ybSwgdGhpcy5kaXJlY3RpdmVzKTtcbiAgICB0aGlzLm5nU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBvblJlc2V0KCk6IHZvaWQgeyB0aGlzLnJlc2V0Rm9ybSgpOyB9XG5cbiAgcmVzZXRGb3JtKHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm0ucmVzZXQodmFsdWUpO1xuICAgICh0aGlzIGFze3N1Ym1pdHRlZDogYm9vbGVhbn0pLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICB9XG5cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVEb21WYWx1ZSgpIHtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgY29uc3QgbmV3Q3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICBpZiAoZGlyLmNvbnRyb2wgIT09IG5ld0N0cmwpIHtcbiAgICAgICAgY2xlYW5VcENvbnRyb2woZGlyLmNvbnRyb2wsIGRpcik7XG4gICAgICAgIGlmIChuZXdDdHJsKSBzZXRVcENvbnRyb2wobmV3Q3RybCwgZGlyKTtcbiAgICAgICAgKGRpciBhc3tjb250cm9sOiBGb3JtQ29udHJvbH0pLmNvbnRyb2wgPSBuZXdDdHJsO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5mb3JtLl91cGRhdGVUcmVlVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKSB7XG4gICAgdGhpcy5mb3JtLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB0aGlzLl91cGRhdGVEb21WYWx1ZSgpKTtcbiAgICBpZiAodGhpcy5fb2xkRm9ybSkgdGhpcy5fb2xkRm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIHRoaXMuX29sZEZvcm0gPSB0aGlzLmZvcm07XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVWYWxpZGF0b3JzKCkge1xuICAgIGNvbnN0IHN5bmMgPSBjb21wb3NlVmFsaWRhdG9ycyh0aGlzLl92YWxpZGF0b3JzKTtcbiAgICB0aGlzLmZvcm0udmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlKFt0aGlzLmZvcm0udmFsaWRhdG9yICEsIHN5bmMgIV0pO1xuXG4gICAgY29uc3QgYXN5bmMgPSBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHRoaXMuX2FzeW5jVmFsaWRhdG9ycyk7XG4gICAgdGhpcy5mb3JtLmFzeW5jVmFsaWRhdG9yID0gVmFsaWRhdG9ycy5jb21wb3NlQXN5bmMoW3RoaXMuZm9ybS5hc3luY1ZhbGlkYXRvciAhLCBhc3luYyAhXSk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja0Zvcm1QcmVzZW50KCkge1xuICAgIGlmICghdGhpcy5mb3JtKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5taXNzaW5nRm9ybUV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufVxuIl19