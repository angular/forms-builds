/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validators } from '../validators';
export const REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RequiredValidator),
    multi: true
};
export const CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CheckboxRequiredValidator),
    multi: true
};
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
let RequiredValidator = class RequiredValidator {
    get required() { return this._required; }
    set required(value) {
        this._required = value != null && value !== false && `${value}` !== 'false';
        if (this._onChange)
            this._onChange();
    }
    validate(control) {
        return this.required ? Validators.required(control) : null;
    }
    registerOnValidatorChange(fn) { this._onChange = fn; }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], RequiredValidator.prototype, "required", null);
RequiredValidator = tslib_1.__decorate([
    Directive({
        selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
        providers: [REQUIRED_VALIDATOR],
        host: { '[attr.required]': 'required ? "" : null' }
    })
], RequiredValidator);
export { RequiredValidator };
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
let CheckboxRequiredValidator = class CheckboxRequiredValidator extends RequiredValidator {
    validate(control) {
        return this.required ? Validators.requiredTrue(control) : null;
    }
};
CheckboxRequiredValidator = tslib_1.__decorate([
    Directive({
        selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
        providers: [CHECKBOX_REQUIRED_VALIDATOR],
        host: { '[attr.required]': 'required ? "" : null' }
    })
], CheckboxRequiredValidator);
export { CheckboxRequiredValidator };
/**
 * Provider which adds `EmailValidator` to `NG_VALIDATORS`.
 */
export const EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailValidator),
    multi: true
};
/**
 * A Directive that adds the `email` validator to controls marked with the
 * `email` attribute, via the `NG_VALIDATORS` binding.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
let EmailValidator = class EmailValidator {
    set email(value) {
        this._enabled = value === '' || value === true || value === 'true';
        if (this._onChange)
            this._onChange();
    }
    validate(control) {
        return this._enabled ? Validators.email(control) : null;
    }
    registerOnValidatorChange(fn) { this._onChange = fn; }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], EmailValidator.prototype, "email", null);
EmailValidator = tslib_1.__decorate([
    Directive({
        selector: '[email][formControlName],[email][formControl],[email][ngModel]',
        providers: [EMAIL_VALIDATOR]
    })
], EmailValidator);
export { EmailValidator };
/**
 * Provider which adds `MinLengthValidator` to `NG_VALIDATORS`.
 *
 * @usageNotes
 * ### Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
export const MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthValidator),
    multi: true
};
/**
 * A directive which installs the `MinLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
let MinLengthValidator = class MinLengthValidator {
    ngOnChanges(changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    validate(control) {
        return this.minlength == null ? null : this._validator(control);
    }
    registerOnValidatorChange(fn) { this._onChange = fn; }
    _createValidator() {
        this._validator = Validators.minLength(parseInt(this.minlength, 10));
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], MinLengthValidator.prototype, "minlength", void 0);
MinLengthValidator = tslib_1.__decorate([
    Directive({
        selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
        providers: [MIN_LENGTH_VALIDATOR],
        host: { '[attr.minlength]': 'minlength ? minlength : null' }
    })
], MinLengthValidator);
export { MinLengthValidator };
/**
 * Provider which adds `MaxLengthValidator` to `NG_VALIDATORS`.
 *
 * @usageNotes
 * ### Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
export const MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthValidator),
    multi: true
};
/**
 * A directive which installs the `MaxLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `maxlength` attribute.
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
let MaxLengthValidator = class MaxLengthValidator {
    ngOnChanges(changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    validate(control) {
        return this.maxlength != null ? this._validator(control) : null;
    }
    registerOnValidatorChange(fn) { this._onChange = fn; }
    _createValidator() {
        this._validator = Validators.maxLength(parseInt(this.maxlength, 10));
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", String)
], MaxLengthValidator.prototype, "maxlength", void 0);
MaxLengthValidator = tslib_1.__decorate([
    Directive({
        selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
        providers: [MAX_LENGTH_VALIDATOR],
        host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
    })
], MaxLengthValidator);
export { MaxLengthValidator };
export const PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PatternValidator),
    multi: true
};
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the `NG_VALIDATORS` binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * @usageNotes
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
let PatternValidator = class PatternValidator {
    ngOnChanges(changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    validate(control) { return this._validator(control); }
    registerOnValidatorChange(fn) { this._onChange = fn; }
    _createValidator() { this._validator = Validators.pattern(this.pattern); }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Object)
], PatternValidator.prototype, "pattern", void 0);
PatternValidator = tslib_1.__decorate([
    Directive({
        selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
        providers: [PATTERN_VALIDATOR],
        host: { '[attr.pattern]': 'pattern ? pattern : null' }
    })
], PatternValidator);
export { PatternValidator };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUE0QyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJckcsT0FBTyxFQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFxR3hELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFtQjtJQUNoRCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFtQjtJQUN6RCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUdGOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBT0gsSUFBYSxpQkFBaUIsR0FBOUIsTUFBYSxpQkFBaUI7SUFPNUIsSUFBSSxRQUFRLEtBQXFCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFFekQsSUFBSSxRQUFRLENBQUMsS0FBcUI7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBSyxPQUFPLENBQUM7UUFDNUUsSUFBSSxJQUFJLENBQUMsU0FBUztZQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsUUFBUSxDQUFDLE9BQXdCO1FBQy9CLE9BQU8sSUFB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Z0JBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUVELFFBQVEsQ0FBQyxPQUF3QixJQUEyQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTlGLHlCQUF5QixDQUFDLEVBQWMsSUFBVSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFaEUsZ0JBQWdCLEtBQVcsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDekYsQ0FBQTtBQWRVO0lBQVIsS0FBSyxFQUFFOztpREFBNEI7QUFSekIsZ0JBQWdCO0lBTDVCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxzRUFBc0U7UUFDaEYsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7UUFDOUIsSUFBSSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsMEJBQTBCLEVBQUM7S0FDckQsQ0FBQztHQUNXLGdCQUFnQixDQXNCNUI7U0F0QlksZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgU3RhdGljUHJvdmlkZXIsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7TkdfVkFMSURBVE9SUywgVmFsaWRhdG9yc30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERlZmluZXMgdGhlIG1hcCBvZiBlcnJvcnMgcmV0dXJuZWQgZnJvbSBmYWlsZWQgdmFsaWRhdGlvbiBjaGVja3NcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIFZhbGlkYXRpb25FcnJvcnMgPSB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGludGVyZmFjZSBpbXBsZW1lbnRlZCBieSBjbGFzc2VzIHRoYXQgcGVyZm9ybSBzeW5jaHJvbm91cyB2YWxpZGF0aW9uLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGUgYSBjdXN0b20gdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBWYWxpZGF0b3JgIGludGVyZmFjZSB0byBjcmVhdGUgYVxuICogdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAqICAgICByZXR1cm4geydjdXN0b20nOiB0cnVlfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgcGVyZm9ybXMgc3luY2hyb25vdXMgdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBwcm92aWRlZCBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gYyBUaGUgY29udHJvbCB0byB2YWxpZGF0ZSBhZ2FpbnN0LlxuICAgKlxuICAgKiBAcmV0dXJucyBBIG1hcCBvZiB2YWxpZGF0aW9uIGVycm9ycyBpZiB2YWxpZGF0aW9uIGZhaWxzLFxuICAgKiBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgdmFsaWRhdG9yIGlucHV0cyBjaGFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U/KGZuOiAoKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGludGVyZmFjZSBpbXBsZW1lbnRlZCBieSBjbGFzc2VzIHRoYXQgcGVyZm9ybSBhc3luY2hyb25vdXMgdmFsaWRhdGlvbi5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBQcm92aWRlIGEgY3VzdG9tIGFzeW5jIHZhbGlkYXRvciBkaXJlY3RpdmVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW1wbGVtZW50cyB0aGUgYEFzeW5jVmFsaWRhdG9yYCBpbnRlcmZhY2UgdG8gY3JlYXRlIGFuXG4gKiBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlIHdpdGggYSBjdXN0b20gZXJyb3Iga2V5LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IG9mIGFzIG9ic2VydmFibGVPZiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21Bc3luY1ZhbGlkYXRvcl0nLFxuICogICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTkdfQVNZTkNfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTpcbiAqIHRydWV9XVxuICogfSlcbiAqIGNsYXNzIEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgQXN5bmNWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD4ge1xuICogICAgIHJldHVybiBvYnNlcnZhYmxlT2YoeydjdXN0b20nOiB0cnVlfSk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3luY1ZhbGlkYXRvciBleHRlbmRzIFZhbGlkYXRvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgcGVyZm9ybXMgYXN5bmMgdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBwcm92aWRlZCBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gYyBUaGUgY29udHJvbCB0byB2YWxpZGF0ZSBhZ2FpbnN0LlxuICAgKlxuICAgKiBAcmV0dXJucyBBIHByb21pc2Ugb3Igb2JzZXJ2YWJsZSB0aGF0IHJlc29sdmVzIGEgbWFwIG9mIHZhbGlkYXRpb24gZXJyb3JzXG4gICAqIGlmIHZhbGlkYXRpb24gZmFpbHMsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTpcbiAgICAgIFByb21pc2U8VmFsaWRhdGlvbkVycm9yc3xudWxsPnxPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD47XG59XG5cbmV4cG9ydCBjb25zdCBSRVFVSVJFRF9WQUxJREFUT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBhbnkgY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZSwgdmlhIHRoZSBgTkdfVkFMSURBVE9SU2AgYmluZGluZy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCBuYW1lPVwiZnVsbE5hbWVcIiBuZ01vZGVsIHJlcXVpcmVkPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtSRVFVSVJFRF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnJlcXVpcmVkXSc6ICdyZXF1aXJlZCA/IFwiXCIgOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUmVxdWlyZWRWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfcmVxdWlyZWQgITogYm9vbGVhbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlICE6ICgpID0+IHZvaWQ7XG5cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW58c3RyaW5nIHsgcmV0dXJuIHRoaXMuX3JlcXVpcmVkOyB9XG5cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFufHN0cmluZykge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gdmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgYCR7dmFsdWV9YCAhPT0gJ2ZhbHNlJztcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gIH1cblxuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKSA6IG51bGw7XG4gIH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cbn1cblxuXG4vKipcbiAqIEEgRGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHJlcXVpcmVkYCB2YWxpZGF0b3IgdG8gY2hlY2tib3ggY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZSwgdmlhIHRoZSBgTkdfVkFMSURBVE9SU2AgYmluZGluZy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiYWN0aXZlXCIgbmdNb2RlbCByZXF1aXJlZD5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ2lucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5yZXF1aXJlZF0nOiAncmVxdWlyZWQgPyBcIlwiIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IgZXh0ZW5kcyBSZXF1aXJlZFZhbGlkYXRvciB7XG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWlyZWQgPyBWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZShjb250cm9sKSA6IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBFbWFpbFZhbGlkYXRvcmAgdG8gYE5HX1ZBTElEQVRPUlNgLlxuICovXG5leHBvcnQgY29uc3QgRU1BSUxfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEVtYWlsVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgZW1haWxgIHZhbGlkYXRvciB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBlbWFpbGAgYXR0cmlidXRlLCB2aWEgdGhlIGBOR19WQUxJREFUT1JTYCBiaW5kaW5nLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgZW1haWw+XG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBlbWFpbD1cInRydWVcIj5cbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIFtlbWFpbF09XCJ0cnVlXCI+XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tlbWFpbF1bZm9ybUNvbnRyb2xOYW1lXSxbZW1haWxdW2Zvcm1Db250cm9sXSxbZW1haWxdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbRU1BSUxfVkFMSURBVE9SXVxufSlcbmV4cG9ydCBjbGFzcyBFbWFpbFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9lbmFibGVkICE6IGJvb2xlYW47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSAhOiAoKSA9PiB2b2lkO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBlbWFpbCh2YWx1ZTogYm9vbGVhbnxzdHJpbmcpIHtcbiAgICB0aGlzLl9lbmFibGVkID0gdmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSAndHJ1ZSc7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICB9XG5cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZCA/IFZhbGlkYXRvcnMuZW1haWwoY29udHJvbCkgOiBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvckZuIHsgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDsgfVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3luY1ZhbGlkYXRvckZuIHtcbiAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFByb21pc2U8VmFsaWRhdGlvbkVycm9yc3xudWxsPnxPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD47XG59XG5cbi8qKlxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWluTGVuZ3RoVmFsaWRhdG9yYCB0byBgTkdfVkFMSURBVE9SU2AuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqICMjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vZm9ybXMvdHMvdmFsaWRhdG9ycy92YWxpZGF0b3JzLnRzIHJlZ2lvbj0nbWluJ31cbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9MRU5HVEhfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1pbkxlbmd0aFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSBgTWluTGVuZ3RoVmFsaWRhdG9yYCBmb3IgYW55IGBmb3JtQ29udHJvbE5hbWVgLFxuICogYGZvcm1Db250cm9sYCwgb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1pbmxlbmd0aGAgYXR0cmlidXRlLlxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWlubGVuZ3RoXVtmb3JtQ29udHJvbF0sW21pbmxlbmd0aF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNSU5fTEVOR1RIX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIubWlubGVuZ3RoXSc6ICdtaW5sZW5ndGggPyBtaW5sZW5ndGggOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgTWluTGVuZ3RoVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yLFxuICAgIE9uQ2hhbmdlcyB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF92YWxpZGF0b3IgITogVmFsaWRhdG9yRm47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSAhOiAoKSA9PiB2b2lkO1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBtaW5sZW5ndGggITogc3RyaW5nO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ21pbmxlbmd0aCcgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5taW5sZW5ndGggPT0gbnVsbCA/IG51bGwgOiB0aGlzLl92YWxpZGF0b3IoY29udHJvbCk7XG4gIH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICBwcml2YXRlIF9jcmVhdGVWYWxpZGF0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW5MZW5ndGgocGFyc2VJbnQodGhpcy5taW5sZW5ndGgsIDEwKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNYXhMZW5ndGhWYWxpZGF0b3JgIHRvIGBOR19WQUxJREFUT1JTYC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9mb3Jtcy90cy92YWxpZGF0b3JzL3ZhbGlkYXRvcnMudHMgcmVnaW9uPSdtYXgnfVxuICovXG5leHBvcnQgY29uc3QgTUFYX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4TGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIGBNYXhMZW5ndGhWYWxpZGF0b3JgIGZvciBhbnkgYGZvcm1Db250cm9sTmFtZWAsXG4gKiBgZm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWF4bGVuZ3RoYCBhdHRyaWJ1dGUuXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttYXhsZW5ndGhdW2Zvcm1Db250cm9sXSxbbWF4bGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01BWF9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5tYXhsZW5ndGhdJzogJ21heGxlbmd0aCA/IG1heGxlbmd0aCA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXhMZW5ndGhWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3IsXG4gICAgT25DaGFuZ2VzIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3ZhbGlkYXRvciAhOiBWYWxpZGF0b3JGbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlICE6ICgpID0+IHZvaWQ7XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG1heGxlbmd0aCAhOiBzdHJpbmc7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgnbWF4bGVuZ3RoJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jcmVhdGVWYWxpZGF0b3IoKTtcbiAgICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLm1heGxlbmd0aCAhPSBudWxsID8gdGhpcy5fdmFsaWRhdG9yKGNvbnRyb2wpIDogbnVsbDtcbiAgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1heExlbmd0aChwYXJzZUludCh0aGlzLm1heGxlbmd0aCwgMTApKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBQQVRURVJOX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBQYXR0ZXJuVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGBwYXR0ZXJuYCB2YWxpZGF0b3IgdG8gYW55IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHBhdHRlcm5gIGF0dHJpYnV0ZSwgdmlhIHRoZSBgTkdfVkFMSURBVE9SU2AgYmluZGluZy4gVXNlcyBhdHRyaWJ1dGUgdmFsdWVcbiAqIGFzIHRoZSByZWdleCB0byB2YWxpZGF0ZSBDb250cm9sIHZhbHVlIGFnYWluc3QuICBGb2xsb3dzIHBhdHRlcm4gYXR0cmlidXRlXG4gKiBzZW1hbnRpY3M7IGkuZS4gcmVnZXggbXVzdCBtYXRjaCBlbnRpcmUgQ29udHJvbCB2YWx1ZS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCBbbmFtZV09XCJmdWxsTmFtZVwiIHBhdHRlcm49XCJbYS16QS1aIF0qXCIgbmdNb2RlbD5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BhdHRlcm5dW2Zvcm1Db250cm9sTmFtZV0sW3BhdHRlcm5dW2Zvcm1Db250cm9sXSxbcGF0dGVybl1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtQQVRURVJOX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucGF0dGVybl0nOiAncGF0dGVybiA/IHBhdHRlcm4gOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUGF0dGVyblZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvcixcbiAgICBPbkNoYW5nZXMge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yICE6IFZhbGlkYXRvckZuO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgITogKCkgPT4gdm9pZDtcblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgcGF0dGVybiAhOiBzdHJpbmcgfCBSZWdFeHA7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgncGF0dGVybicgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHsgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjb250cm9sKTsgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHsgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMucGF0dGVybik7IH1cbn1cbiJdfQ==