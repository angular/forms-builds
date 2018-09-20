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
import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validators } from '../validators';
/** @typedef {?} */
var ValidationErrors;
export { ValidationErrors };
/**
 * \@description
 * An interface implemented by classes that perform synchronous validation.
 *
 * \@usageNotes
 *
 * ### Provide a custom validator
 *
 * The following example implements the `Validator` interface to create a
 * validator directive with a custom error key.
 *
 * ```typescript
 * \@Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(c: AbstractControl): ValidationErrors|null {
 *     return {'custom': true};
 *   }
 * }
 * ```
 * @record
 */
export function Validator() { }
/**
 * \@description
 * Method that performs synchronous validation against the provided control.
 *
 * \@param c The control to validate against.
 *
 * \@return A map of validation errors if validation fails,
 * otherwise null.
 * @type {?}
 */
Validator.prototype.validate;
/**
 * \@description
 * Registers a callback function to call when the validator inputs change.
 *
 * \@param fn The callback function
 * @type {?|undefined}
 */
Validator.prototype.registerOnValidatorChange;
/**
 * \@description
 * An interface implemented by classes that perform asynchronous validation.
 *
 * \@usageNotes
 *
 * ### Provide a custom async validator directive
 *
 * The following example implements the `AsyncValidator` interface to create an
 * async validator directive with a custom error key.
 *
 * ```typescript
 * import { of as observableOf } from 'rxjs';
 *
 * \@Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(c: AbstractControl): Observable<ValidationErrors|null> {
 *     return observableOf({'custom': true});
 *   }
 * }
 * ```
 *
 * \@experimental
 * @record
 */
export function AsyncValidator() { }
/**
 * \@description
 * Method that performs async validation against the provided control.
 *
 * \@param c The control to validate against.
 *
 * \@return A promise or observable that resolves a map of validation errors
 * if validation fails, otherwise null.
 * @type {?}
 */
AsyncValidator.prototype.validate;
/** @type {?} */
export const REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RequiredValidator),
    multi: true
};
/** @type {?} */
export const CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CheckboxRequiredValidator),
    multi: true
};
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 *
 */
export class RequiredValidator {
    /**
     * @return {?}
     */
    get required() { return this._required; }
    /**
     * @param {?} value
     * @return {?}
     */
    set required(value) {
        this._required = value != null && value !== false && `${value}` !== 'false';
        if (this._onChange)
            this._onChange();
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return this.required ? Validators.required(c) : null;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._onChange = fn; }
}
RequiredValidator.decorators = [
    { type: Directive, args: [{
                selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                providers: [REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required ? "" : null' }
            },] }
];
RequiredValidator.propDecorators = {
    required: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    RequiredValidator.prototype._required;
    /** @type {?} */
    RequiredValidator.prototype._onChange;
}
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * ### Example
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * \@experimental
 */
export class CheckboxRequiredValidator extends RequiredValidator {
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return this.required ? Validators.requiredTrue(c) : null;
    }
}
CheckboxRequiredValidator.decorators = [
    { type: Directive, args: [{
                selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                providers: [CHECKBOX_REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required ? "" : null' }
            },] }
];
/** *
 * Provider which adds `EmailValidator` to `NG_VALIDATORS`.
  @type {?} */
export const EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailValidator),
    multi: true
};
/**
 * A Directive that adds the `email` validator to controls marked with the
 * `email` attribute, via the `NG_VALIDATORS` binding.
 *
 * ### Example
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * \@experimental
 */
export class EmailValidator {
    /**
     * @param {?} value
     * @return {?}
     */
    set email(value) {
        this._enabled = value === '' || value === true || value === 'true';
        if (this._onChange)
            this._onChange();
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return this._enabled ? Validators.email(c) : null;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._onChange = fn; }
}
EmailValidator.decorators = [
    { type: Directive, args: [{
                selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                providers: [EMAIL_VALIDATOR]
            },] }
];
EmailValidator.propDecorators = {
    email: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    EmailValidator.prototype._enabled;
    /** @type {?} */
    EmailValidator.prototype._onChange;
}
/**
 * @record
 */
export function ValidatorFn() { }
/**
 * @record
 */
export function AsyncValidatorFn() { }
/** *
 * Provider which adds `MinLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {\@example common/forms/ts/validators/validators.ts region='min'}
  @type {?} */
export const MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthValidator),
    multi: true
};
/**
 * A directive which installs the `MinLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 *
 */
export class MinLengthValidator {
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return this.minlength == null ? null : this._validator(c);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._onChange = fn; }
    /**
     * @return {?}
     */
    _createValidator() {
        this._validator = Validators.minLength(parseInt(this.minlength, 10));
    }
}
MinLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                providers: [MIN_LENGTH_VALIDATOR],
                host: { '[attr.minlength]': 'minlength ? minlength : null' }
            },] }
];
MinLengthValidator.propDecorators = {
    minlength: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MinLengthValidator.prototype._validator;
    /** @type {?} */
    MinLengthValidator.prototype._onChange;
    /** @type {?} */
    MinLengthValidator.prototype.minlength;
}
/** *
 * Provider which adds `MaxLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {\@example common/forms/ts/validators/validators.ts region='max'}
  @type {?} */
export const MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthValidator),
    multi: true
};
/**
 * A directive which installs the `MaxLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `maxlength` attribute.
 *
 *
 */
export class MaxLengthValidator {
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        return this.maxlength != null ? this._validator(c) : null;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._onChange = fn; }
    /**
     * @return {?}
     */
    _createValidator() {
        this._validator = Validators.maxLength(parseInt(this.maxlength, 10));
    }
}
MaxLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                providers: [MAX_LENGTH_VALIDATOR],
                host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
            },] }
];
MaxLengthValidator.propDecorators = {
    maxlength: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MaxLengthValidator.prototype._validator;
    /** @type {?} */
    MaxLengthValidator.prototype._onChange;
    /** @type {?} */
    MaxLengthValidator.prototype.maxlength;
}
/** @type {?} */
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
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 *
 */
export class PatternValidator {
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) { return this._validator(c); }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._onChange = fn; }
    /**
     * @return {?}
     */
    _createValidator() { this._validator = Validators.pattern(this.pattern); }
}
PatternValidator.decorators = [
    { type: Directive, args: [{
                selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                providers: [PATTERN_VALIDATOR],
                host: { '[attr.pattern]': 'pattern ? pattern : null' }
            },] }
];
PatternValidator.propDecorators = {
    pattern: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    PatternValidator.prototype._validator;
    /** @type {?} */
    PatternValidator.prototype._onChange;
    /** @type {?} */
    PatternValidator.prototype.pattern;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBNEMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSXJHLE9BQU8sRUFBQyxhQUFhLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrR3hELGFBQWEsa0JBQWtCLEdBQW1CO0lBQ2hELE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUM7SUFDaEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDOztBQUVGLGFBQWEsMkJBQTJCLEdBQW1CO0lBQ3pELE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMseUJBQXlCLENBQUM7SUFDeEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDOzs7Ozs7Ozs7Ozs7O0FBcUJGLE1BQU07Ozs7SUFNSixJQUNJLFFBQVEsS0FBcUIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7Ozs7O0lBRXpELElBQUksUUFBUSxDQUFDLEtBQXFCO1FBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxFQUFFLEtBQUssT0FBTyxDQUFDO1FBQzVFLElBQUksSUFBSSxDQUFDLFNBQVM7WUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDdEM7Ozs7O0lBRUQs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QkFDdEYsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7Z0JBQ2pDLElBQUksRUFBRSxFQUFDLGtCQUFrQixFQUFFLDhCQUE4QixFQUFDO2FBQzNEOzs7d0JBU0UsS0FBSzs7Ozs7Ozs7Ozs7QUFxQlIsYUFBYSxpQkFBaUIsR0FBUTtJQUNwQyxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0lBQy9DLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFxQkYsTUFBTTs7Ozs7SUFVSixXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBQ3hCLElBQUksSUFBSSxDQUFDLFNBQVM7Z0JBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3RDO0tBQ0Y7Ozs7O0lBRUQsUUFBUSxDQUFDLENBQWtCLElBQTJCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7OztJQUVsRix5QkFBeUIsQ0FBQyxFQUFjLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRTs7OztJQUVoRSxnQkFBZ0IsS0FBVyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzs7WUExQnZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0VBQXNFO2dCQUNoRixTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztnQkFDOUIsSUFBSSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsMEJBQTBCLEVBQUM7YUFDckQ7OztzQkFTRSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgU3RhdGljUHJvdmlkZXIsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7TkdfVkFMSURBVE9SUywgVmFsaWRhdG9yc30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERlZmluZXMgdGhlIG1hcCBvZiBlcnJvcnMgcmV0dXJuZWQgZnJvbSBmYWlsZWQgdmFsaWRhdGlvbiBjaGVja3NcbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCB0eXBlIFZhbGlkYXRpb25FcnJvcnMgPSB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGludGVyZmFjZSBpbXBsZW1lbnRlZCBieSBjbGFzc2VzIHRoYXQgcGVyZm9ybSBzeW5jaHJvbm91cyB2YWxpZGF0aW9uLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGUgYSBjdXN0b20gdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBWYWxpZGF0b3JgIGludGVyZmFjZSB0byBjcmVhdGUgYVxuICogdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAqICAgICByZXR1cm4geydjdXN0b20nOiB0cnVlfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBwZXJmb3JtcyBzeW5jaHJvbm91cyB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBjIFRoZSBjb250cm9sIHRvIHZhbGlkYXRlIGFnYWluc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbWFwIG9mIHZhbGlkYXRpb24gZXJyb3JzIGlmIHZhbGlkYXRpb24gZmFpbHMsXG4gICAqIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSB2YWxpZGF0b3IgaW5wdXRzIGNoYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZT8oZm46ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQW4gaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IGNsYXNzZXMgdGhhdCBwZXJmb3JtIGFzeW5jaHJvbm91cyB2YWxpZGF0aW9uLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGUgYSBjdXN0b20gYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbXBsZW1lbnRzIHRoZSBgQXN5bmNWYWxpZGF0b3JgIGludGVyZmFjZSB0byBjcmVhdGUgYW5cbiAqIGFzeW5jIHZhbGlkYXRvciBkaXJlY3RpdmUgd2l0aCBhIGN1c3RvbSBlcnJvciBrZXkuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnW2N1c3RvbUFzeW5jVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19BU1lOQ19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tQXN5bmNWYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOlxuICogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tQXN5bmNWYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBBc3luY1ZhbGlkYXRvciB7XG4gKiAgIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPiB7XG4gKiAgICAgcmV0dXJuIG9ic2VydmFibGVPZih7J2N1c3RvbSc6IHRydWV9KTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yIGV4dGVuZHMgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBjIFRoZSBjb250cm9sIHRvIHZhbGlkYXRlIGFnYWluc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSBvciBvYnNlcnZhYmxlIHRoYXQgcmVzb2x2ZXMgYSBtYXAgb2YgdmFsaWRhdGlvbiBlcnJvcnNcbiAgICogaWYgdmFsaWRhdGlvbiBmYWlscywgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBQcm9taXNlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD58T2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+O1xufVxuXG5leHBvcnQgY29uc3QgUkVRVUlSRURfVkFMSURBVE9SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmVxdWlyZWRWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuZXhwb3J0IGNvbnN0IENIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEEgRGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHJlcXVpcmVkYCB2YWxpZGF0b3IgdG8gYW55IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUsIHZpYSB0aGUgYE5HX1ZBTElEQVRPUlNgIGJpbmRpbmcuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCBuYW1lPVwiZnVsbE5hbWVcIiBuZ01vZGVsIHJlcXVpcmVkPlxuICogYGBgXG4gKlxuICpcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJzpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW2Zvcm1Db250cm9sXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUkVRVUlSRURfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5yZXF1aXJlZF0nOiAncmVxdWlyZWQgPyBcIlwiIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIFJlcXVpcmVkVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3JlcXVpcmVkICE6IGJvb2xlYW47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSAhOiAoKSA9PiB2b2lkO1xuXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFufHN0cmluZyB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuXG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbnxzdHJpbmcpIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IGZhbHNlICYmIGAke3ZhbHVlfWAgIT09ICdmYWxzZSc7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1aXJlZCA/IFZhbGlkYXRvcnMucmVxdWlyZWQoYykgOiBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG59XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGNoZWNrYm94IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUsIHZpYSB0aGUgYE5HX1ZBTElEQVRPUlNgIGJpbmRpbmcuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBuYW1lPVwiYWN0aXZlXCIgbmdNb2RlbCByZXF1aXJlZD5cbiAqIGBgYFxuICpcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ2lucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5yZXF1aXJlZF0nOiAncmVxdWlyZWQgPyBcIlwiIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IgZXh0ZW5kcyBSZXF1aXJlZFZhbGlkYXRvciB7XG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWlyZWQgPyBWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZShjKSA6IG51bGw7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBFbWFpbFZhbGlkYXRvcmAgdG8gYE5HX1ZBTElEQVRPUlNgLlxuICovXG5leHBvcnQgY29uc3QgRU1BSUxfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEVtYWlsVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgZW1haWxgIHZhbGlkYXRvciB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBlbWFpbGAgYXR0cmlidXRlLCB2aWEgdGhlIGBOR19WQUxJREFUT1JTYCBiaW5kaW5nLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBlbWFpbD5cbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPVwidHJ1ZVwiPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgW2VtYWlsXT1cInRydWVcIj5cbiAqIGBgYFxuICpcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VtYWlsXVtmb3JtQ29udHJvbE5hbWVdLFtlbWFpbF1bZm9ybUNvbnRyb2xdLFtlbWFpbF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtFTUFJTF9WQUxJREFUT1JdXG59KVxuZXhwb3J0IGNsYXNzIEVtYWlsVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX2VuYWJsZWQgITogYm9vbGVhbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlICE6ICgpID0+IHZvaWQ7XG5cbiAgQElucHV0KClcbiAgc2V0IGVtYWlsKHZhbHVlOiBib29sZWFufHN0cmluZykge1xuICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09ICd0cnVlJztcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gIH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9lbmFibGVkID8gVmFsaWRhdG9ycy5lbWFpbChjKSA6IG51bGw7XG4gIH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0b3JGbiB7IChjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGw7IH1cblxuZXhwb3J0IGludGVyZmFjZSBBc3luY1ZhbGlkYXRvckZuIHtcbiAgKGM6IEFic3RyYWN0Q29udHJvbCk6IFByb21pc2U8VmFsaWRhdGlvbkVycm9yc3xudWxsPnxPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD47XG59XG5cbi8qKlxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWluTGVuZ3RoVmFsaWRhdG9yYCB0byBgTkdfVkFMSURBVE9SU2AuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL2Zvcm1zL3RzL3ZhbGlkYXRvcnMvdmFsaWRhdG9ycy50cyByZWdpb249J21pbid9XG4gKi9cbmV4cG9ydCBjb25zdCBNSU5fTEVOR1RIX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNaW5MZW5ndGhWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB3aGljaCBpbnN0YWxscyB0aGUgYE1pbkxlbmd0aFZhbGlkYXRvcmAgZm9yIGFueSBgZm9ybUNvbnRyb2xOYW1lYCxcbiAqIGBmb3JtQ29udHJvbGAsIG9yIGNvbnRyb2wgd2l0aCBgbmdNb2RlbGAgdGhhdCBhbHNvIGhhcyBhIGBtaW5sZW5ndGhgIGF0dHJpYnV0ZS5cbiAqXG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWlubGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttaW5sZW5ndGhdW2Zvcm1Db250cm9sXSxbbWlubGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01JTl9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5taW5sZW5ndGhdJzogJ21pbmxlbmd0aCA/IG1pbmxlbmd0aCA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBNaW5MZW5ndGhWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3IsXG4gICAgT25DaGFuZ2VzIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3ZhbGlkYXRvciAhOiBWYWxpZGF0b3JGbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlICE6ICgpID0+IHZvaWQ7XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG1pbmxlbmd0aCAhOiBzdHJpbmc7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgnbWlubGVuZ3RoJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jcmVhdGVWYWxpZGF0b3IoKTtcbiAgICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLm1pbmxlbmd0aCA9PSBudWxsID8gbnVsbCA6IHRoaXMuX3ZhbGlkYXRvcihjKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1pbkxlbmd0aChwYXJzZUludCh0aGlzLm1pbmxlbmd0aCwgMTApKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1heExlbmd0aFZhbGlkYXRvcmAgdG8gYE5HX1ZBTElEQVRPUlNgLlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9mb3Jtcy90cy92YWxpZGF0b3JzL3ZhbGlkYXRvcnMudHMgcmVnaW9uPSdtYXgnfVxuICovXG5leHBvcnQgY29uc3QgTUFYX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4TGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIGBNYXhMZW5ndGhWYWxpZGF0b3JgIGZvciBhbnkgYGZvcm1Db250cm9sTmFtZWAsXG4gKiBgZm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWF4bGVuZ3RoYCBhdHRyaWJ1dGUuXG4gKlxuICpcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21heGxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbF0sW21heGxlbmd0aF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNQVhfTEVOR1RIX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIubWF4bGVuZ3RoXSc6ICdtYXhsZW5ndGggPyBtYXhsZW5ndGggOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF4TGVuZ3RoVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yLFxuICAgIE9uQ2hhbmdlcyB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF92YWxpZGF0b3IgITogVmFsaWRhdG9yRm47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSAhOiAoKSA9PiB2b2lkO1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBtYXhsZW5ndGggITogc3RyaW5nO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ21heGxlbmd0aCcgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5tYXhsZW5ndGggIT0gbnVsbCA/IHRoaXMuX3ZhbGlkYXRvcihjKSA6IG51bGw7XG4gIH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICBwcml2YXRlIF9jcmVhdGVWYWxpZGF0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5tYXhMZW5ndGgocGFyc2VJbnQodGhpcy5tYXhsZW5ndGgsIDEwKSk7XG4gIH1cbn1cblxuXG5leHBvcnQgY29uc3QgUEFUVEVSTl9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGF0dGVyblZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcGF0dGVybmAgdmFsaWRhdG9yIHRvIGFueSBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBwYXR0ZXJuYCBhdHRyaWJ1dGUsIHZpYSB0aGUgYE5HX1ZBTElEQVRPUlNgIGJpbmRpbmcuIFVzZXMgYXR0cmlidXRlIHZhbHVlXG4gKiBhcyB0aGUgcmVnZXggdG8gdmFsaWRhdGUgQ29udHJvbCB2YWx1ZSBhZ2FpbnN0LiAgRm9sbG93cyBwYXR0ZXJuIGF0dHJpYnV0ZVxuICogc2VtYW50aWNzOyBpLmUuIHJlZ2V4IG11c3QgbWF0Y2ggZW50aXJlIENvbnRyb2wgdmFsdWUuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCBbbmFtZV09XCJmdWxsTmFtZVwiIHBhdHRlcm49XCJbYS16QS1aIF0qXCIgbmdNb2RlbD5cbiAqIGBgYFxuICpcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BhdHRlcm5dW2Zvcm1Db250cm9sTmFtZV0sW3BhdHRlcm5dW2Zvcm1Db250cm9sXSxbcGF0dGVybl1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtQQVRURVJOX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucGF0dGVybl0nOiAncGF0dGVybiA/IHBhdHRlcm4gOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUGF0dGVyblZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvcixcbiAgICBPbkNoYW5nZXMge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yICE6IFZhbGlkYXRvckZuO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgITogKCkgPT4gdm9pZDtcblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgcGF0dGVybiAhOiBzdHJpbmcgfCBSZWdFeHA7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgncGF0dGVybicgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHsgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjKTsgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHsgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMucGF0dGVybik7IH1cbn1cbiJdfQ==