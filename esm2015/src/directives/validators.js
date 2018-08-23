import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validators } from '../validators';
import * as i0 from "@angular/core";
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
/** @typedef {?} */
var ValidationErrors;
export { ValidationErrors };
/**
 * An interface that can be implemented by classes that can act as validators.
 *
 * ## Usage
 *
 * ```typescript
 * \@Directive({
 *   selector: '[custom-validator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(c: Control): {[key: string]: any} {
 *     return {"custom": true};
 *   }
 * }
 * ```
 *
 *
 * @record
 */
export function Validator() { }
/** @type {?} */
Validator.prototype.validate;
/** @type {?|undefined} */
Validator.prototype.registerOnValidatorChange;
/**
 * \@experimental
 * @record
 */
export function AsyncValidator() { }
/** @type {?} */
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
            },] },
];
RequiredValidator.propDecorators = {
    required: [{ type: Input }]
};
RequiredValidator.ngDirectiveDef = i0.ɵdefineDirective({ type: RequiredValidator, selectors: [["", "required", "", "formControlName", "", 3, "type", "checkbox"], ["", "required", "", "formControl", "", 3, "type", "checkbox"], ["", "required", "", "ngModel", "", 3, "type", "checkbox"]], factory: function RequiredValidator_Factory(t) { return new (t || RequiredValidator)(); }, hostBindings: function RequiredValidator_HostBindings(dirIndex, elIndex) { i0.ɵelementProperty(elIndex, "attr.required", i0.ɵbind((i0.ɵloadDirective(dirIndex).required ? "" : null))); }, inputs: { required: "required" }, features: [i0.ɵPublicFeature] });
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
            },] },
];
CheckboxRequiredValidator.ngDirectiveDef = i0.ɵdefineDirective({ type: CheckboxRequiredValidator, selectors: [["input", "type", "checkbox", "required", "", "formControlName", ""], ["input", "type", "checkbox", "required", "", "formControl", ""], ["input", "type", "checkbox", "required", "", "ngModel", ""]], factory: function CheckboxRequiredValidator_Factory(t) { return ɵCheckboxRequiredValidator_BaseFactory((t || CheckboxRequiredValidator)); }, hostBindings: function CheckboxRequiredValidator_HostBindings(dirIndex, elIndex) { i0.ɵelementProperty(elIndex, "attr.required", i0.ɵbind((i0.ɵloadDirective(dirIndex).required ? "" : null))); }, features: [i0.ɵPublicFeature, i0.ɵInheritDefinitionFeature] });
const ɵCheckboxRequiredValidator_BaseFactory = i0.ɵgetInheritedFactory(CheckboxRequiredValidator);
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
            },] },
];
EmailValidator.propDecorators = {
    email: [{ type: Input }]
};
EmailValidator.ngDirectiveDef = i0.ɵdefineDirective({ type: EmailValidator, selectors: [["", "email", "", "formControlName", ""], ["", "email", "", "formControl", ""], ["", "email", "", "ngModel", ""]], factory: function EmailValidator_Factory(t) { return new (t || EmailValidator)(); }, inputs: { email: "email" }, features: [i0.ɵPublicFeature] });
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
            },] },
];
MinLengthValidator.propDecorators = {
    minlength: [{ type: Input }]
};
MinLengthValidator.ngDirectiveDef = i0.ɵdefineDirective({ type: MinLengthValidator, selectors: [["", "minlength", "", "formControlName", ""], ["", "minlength", "", "formControl", ""], ["", "minlength", "", "ngModel", ""]], factory: function MinLengthValidator_Factory(t) { return new (t || MinLengthValidator)(); }, hostBindings: function MinLengthValidator_HostBindings(dirIndex, elIndex) { i0.ɵelementProperty(elIndex, "attr.minlength", i0.ɵbind((i0.ɵloadDirective(dirIndex).minlength ? i0.ɵloadDirective(dirIndex).minlength : null))); }, inputs: { minlength: "minlength" }, features: [i0.ɵPublicFeature, i0.ɵNgOnChangesFeature] });
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
            },] },
];
MaxLengthValidator.propDecorators = {
    maxlength: [{ type: Input }]
};
MaxLengthValidator.ngDirectiveDef = i0.ɵdefineDirective({ type: MaxLengthValidator, selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]], factory: function MaxLengthValidator_Factory(t) { return new (t || MaxLengthValidator)(); }, hostBindings: function MaxLengthValidator_HostBindings(dirIndex, elIndex) { i0.ɵelementProperty(elIndex, "attr.maxlength", i0.ɵbind((i0.ɵloadDirective(dirIndex).maxlength ? i0.ɵloadDirective(dirIndex).maxlength : null))); }, inputs: { maxlength: "maxlength" }, features: [i0.ɵPublicFeature, i0.ɵNgOnChangesFeature] });
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
            },] },
];
PatternValidator.propDecorators = {
    pattern: [{ type: Input }]
};
PatternValidator.ngDirectiveDef = i0.ɵdefineDirective({ type: PatternValidator, selectors: [["", "pattern", "", "formControlName", ""], ["", "pattern", "", "formControl", ""], ["", "pattern", "", "ngModel", ""]], factory: function PatternValidator_Factory(t) { return new (t || PatternValidator)(); }, hostBindings: function PatternValidator_HostBindings(dirIndex, elIndex) { i0.ɵelementProperty(elIndex, "attr.pattern", i0.ɵbind((i0.ɵloadDirective(dirIndex).pattern ? i0.ɵloadDirective(dirIndex).pattern : null))); }, inputs: { pattern: "pattern" }, features: [i0.ɵPublicFeature, i0.ɵNgOnChangesFeature] });
if (false) {
    /** @type {?} */
    PatternValidator.prototype._validator;
    /** @type {?} */
    PatternValidator.prototype._onChange;
    /** @type {?} */
    PatternValidator.prototype.pattern;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQTRDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUlyRyxPQUFPLEVBQUMsYUFBYSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDeEQsYUFBYSxrQkFBa0IsR0FBbUI7SUFDaEQsT0FBTyxFQUFFLGFBQWE7SUFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztJQUNoRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7O0FBRUYsYUFBYSwyQkFBMkIsR0FBbUI7SUFDekQsT0FBTyxFQUFFLGFBQWE7SUFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztJQUN4RCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7Ozs7Ozs7Ozs7Ozs7QUFxQkYsTUFBTTs7OztJQU1KLElBQ0ksUUFBUSxLQUFxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTs7Ozs7SUFFekQsSUFBSSxRQUFRLENBQUMsS0FBcUI7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBSyxPQUFPLENBQUM7UUFDNUUsSUFBSSxJQUFJLENBQUMsU0FBUztZQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUN0Qzs7Ozs7SUFFRCxRQUFRLENBQUMsQ0FBa0I7UUFDekIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMs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QUFoQixnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBTdGF0aWNQcm92aWRlciwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtOR19WQUxJREFUT1JTLCBWYWxpZGF0b3JzfSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuXG4vKiogQGV4cGVyaW1lbnRhbCAqL1xuZXhwb3J0IHR5cGUgVmFsaWRhdGlvbkVycm9ycyA9IHtcbiAgW2tleTogc3RyaW5nXTogYW55XG59O1xuXG4vKipcbiAqIEFuIGludGVyZmFjZSB0aGF0IGNhbiBiZSBpbXBsZW1lbnRlZCBieSBjbGFzc2VzIHRoYXQgY2FuIGFjdCBhcyB2YWxpZGF0b3JzLlxuICpcbiAqICMjIFVzYWdlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnW2N1c3RvbS12YWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjOiBDb250cm9sKToge1trZXk6IHN0cmluZ106IGFueX0ge1xuICogICAgIHJldHVybiB7XCJjdXN0b21cIjogdHJ1ZX07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yIHtcbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlPyhmbjogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbi8qKiBAZXhwZXJpbWVudGFsICovXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yIGV4dGVuZHMgVmFsaWRhdG9yIHtcbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+fE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPjtcbn1cblxuZXhwb3J0IGNvbnN0IFJFUVVJUkVEX1ZBTElEQVRPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbmV4cG9ydCBjb25zdCBDSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGFueSBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLCB2aWEgdGhlIGBOR19WQUxJREFUT1JTYCBiaW5kaW5nLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgbmFtZT1cImZ1bGxOYW1lXCIgbmdNb2RlbCByZXF1aXJlZD5cbiAqIGBgYFxuICpcbiAqXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICc6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0sOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbF0sOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucmVxdWlyZWRdJzogJ3JlcXVpcmVkID8gXCJcIiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBSZXF1aXJlZFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9yZXF1aXJlZCAhOiBib29sZWFuO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgITogKCkgPT4gdm9pZDtcblxuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbnxzdHJpbmcgeyByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7IH1cblxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW58c3RyaW5nKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSB2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSAmJiBgJHt2YWx1ZX1gICE9PSAnZmFsc2UnO1xuICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgfVxuXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWlyZWQgPyBWYWxpZGF0b3JzLnJlcXVpcmVkKGMpIDogbnVsbDtcbiAgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxufVxuXG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBjaGVja2JveCBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLCB2aWEgdGhlIGBOR19WQUxJREFUT1JTYCBiaW5kaW5nLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImFjdGl2ZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucmVxdWlyZWRdJzogJ3JlcXVpcmVkID8gXCJcIiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgUmVxdWlyZWRWYWxpZGF0b3Ige1xuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gVmFsaWRhdG9ycy5yZXF1aXJlZFRydWUoYykgOiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgRW1haWxWYWxpZGF0b3JgIHRvIGBOR19WQUxJREFUT1JTYC5cbiAqL1xuZXhwb3J0IGNvbnN0IEVNQUlMX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBFbWFpbFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgRGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYGVtYWlsYCB2YWxpZGF0b3IgdG8gY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgZW1haWxgIGF0dHJpYnV0ZSwgdmlhIHRoZSBgTkdfVkFMSURBVE9SU2AgYmluZGluZy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgZW1haWw+XG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBlbWFpbD1cInRydWVcIj5cbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIFtlbWFpbF09XCJ0cnVlXCI+XG4gKiBgYGBcbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tlbWFpbF1bZm9ybUNvbnRyb2xOYW1lXSxbZW1haWxdW2Zvcm1Db250cm9sXSxbZW1haWxdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbRU1BSUxfVkFMSURBVE9SXVxufSlcbmV4cG9ydCBjbGFzcyBFbWFpbFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9lbmFibGVkICE6IGJvb2xlYW47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSAhOiAoKSA9PiB2b2lkO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBlbWFpbCh2YWx1ZTogYm9vbGVhbnxzdHJpbmcpIHtcbiAgICB0aGlzLl9lbmFibGVkID0gdmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSAndHJ1ZSc7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZCA/IFZhbGlkYXRvcnMuZW1haWwoYykgOiBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yRm4geyAoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsOyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNWYWxpZGF0b3JGbiB7XG4gIChjOiBBYnN0cmFjdENvbnRyb2wpOiBQcm9taXNlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD58T2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+O1xufVxuXG4vKipcbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1pbkxlbmd0aFZhbGlkYXRvcmAgdG8gYE5HX1ZBTElEQVRPUlNgLlxuICpcbiAqICMjIEV4YW1wbGU6XG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9mb3Jtcy90cy92YWxpZGF0b3JzL3ZhbGlkYXRvcnMudHMgcmVnaW9uPSdtaW4nfVxuICovXG5leHBvcnQgY29uc3QgTUlOX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWluTGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIGBNaW5MZW5ndGhWYWxpZGF0b3JgIGZvciBhbnkgYGZvcm1Db250cm9sTmFtZWAsXG4gKiBgZm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWlubGVuZ3RoYCBhdHRyaWJ1dGUuXG4gKlxuICpcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWlubGVuZ3RoXVtmb3JtQ29udHJvbF0sW21pbmxlbmd0aF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNSU5fTEVOR1RIX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIubWlubGVuZ3RoXSc6ICdtaW5sZW5ndGggPyBtaW5sZW5ndGggOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgTWluTGVuZ3RoVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yLFxuICAgIE9uQ2hhbmdlcyB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF92YWxpZGF0b3IgITogVmFsaWRhdG9yRm47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSAhOiAoKSA9PiB2b2lkO1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBtaW5sZW5ndGggITogc3RyaW5nO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ21pbmxlbmd0aCcgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5taW5sZW5ndGggPT0gbnVsbCA/IG51bGwgOiB0aGlzLl92YWxpZGF0b3IoYyk7XG4gIH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICBwcml2YXRlIF9jcmVhdGVWYWxpZGF0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW5MZW5ndGgocGFyc2VJbnQodGhpcy5taW5sZW5ndGgsIDEwKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNYXhMZW5ndGhWYWxpZGF0b3JgIHRvIGBOR19WQUxJREFUT1JTYC5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vZm9ybXMvdHMvdmFsaWRhdG9ycy92YWxpZGF0b3JzLnRzIHJlZ2lvbj0nbWF4J31cbiAqL1xuZXhwb3J0IGNvbnN0IE1BWF9MRU5HVEhfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1heExlbmd0aFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSBgTWF4TGVuZ3RoVmFsaWRhdG9yYCBmb3IgYW55IGBmb3JtQ29udHJvbE5hbWVgLFxuICogYGZvcm1Db250cm9sYCwgb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1heGxlbmd0aGAgYXR0cmlidXRlLlxuICpcbiAqXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXhsZW5ndGhdW2Zvcm1Db250cm9sTmFtZV0sW21heGxlbmd0aF1bZm9ybUNvbnRyb2xdLFttYXhsZW5ndGhdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbTUFYX0xFTkdUSF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLm1heGxlbmd0aF0nOiAnbWF4bGVuZ3RoID8gbWF4bGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1heExlbmd0aFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvcixcbiAgICBPbkNoYW5nZXMge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yICE6IFZhbGlkYXRvckZuO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgITogKCkgPT4gdm9pZDtcblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgbWF4bGVuZ3RoICE6IHN0cmluZztcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCdtYXhsZW5ndGgnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVZhbGlkYXRvcigpO1xuICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubWF4bGVuZ3RoICE9IG51bGwgPyB0aGlzLl92YWxpZGF0b3IoYykgOiBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlVmFsaWRhdG9yKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMubWF4TGVuZ3RoKHBhcnNlSW50KHRoaXMubWF4bGVuZ3RoLCAxMCkpO1xuICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IFBBVFRFUk5fVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBhdHRlcm5WYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEEgRGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHBhdHRlcm5gIHZhbGlkYXRvciB0byBhbnkgY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcGF0dGVybmAgYXR0cmlidXRlLCB2aWEgdGhlIGBOR19WQUxJREFUT1JTYCBiaW5kaW5nLiBVc2VzIGF0dHJpYnV0ZSB2YWx1ZVxuICogYXMgdGhlIHJlZ2V4IHRvIHZhbGlkYXRlIENvbnRyb2wgdmFsdWUgYWdhaW5zdC4gIEZvbGxvd3MgcGF0dGVybiBhdHRyaWJ1dGVcbiAqIHNlbWFudGljczsgaS5lLiByZWdleCBtdXN0IG1hdGNoIGVudGlyZSBDb250cm9sIHZhbHVlLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgW25hbWVdPVwiZnVsbE5hbWVcIiBwYXR0ZXJuPVwiW2EtekEtWiBdKlwiIG5nTW9kZWw+XG4gKiBgYGBcbiAqXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twYXR0ZXJuXVtmb3JtQ29udHJvbE5hbWVdLFtwYXR0ZXJuXVtmb3JtQ29udHJvbF0sW3BhdHRlcm5dW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUEFUVEVSTl9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnBhdHRlcm5dJzogJ3BhdHRlcm4gPyBwYXR0ZXJuIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIFBhdHRlcm5WYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3IsXG4gICAgT25DaGFuZ2VzIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3ZhbGlkYXRvciAhOiBWYWxpZGF0b3JGbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlICE6ICgpID0+IHZvaWQ7XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIHBhdHRlcm4gITogc3RyaW5nIHwgUmVnRXhwO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ3BhdHRlcm4nIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVZhbGlkYXRvcigpO1xuICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7IHJldHVybiB0aGlzLl92YWxpZGF0b3IoYyk7IH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICBwcml2YXRlIF9jcmVhdGVWYWxpZGF0b3IoKTogdm9pZCB7IHRoaXMuX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMucGF0dGVybih0aGlzLnBhdHRlcm4pOyB9XG59XG4iXX0=