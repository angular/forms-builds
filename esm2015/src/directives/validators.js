/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
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
 * \@stable
 * @record
 */
export function Validator() { }
function Validator_tsickle_Closure_declarations() {
    /** @type {?} */
    Validator.prototype.validate;
    /** @type {?|undefined} */
    Validator.prototype.registerOnValidatorChange;
}
/**
 * \@experimental
 * @record
 */
export function AsyncValidator() { }
function AsyncValidator_tsickle_Closure_declarations() {
    /** @type {?} */
    AsyncValidator.prototype.validate;
}
export const /** @type {?} */ REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RequiredValidator),
    multi: true
};
export const /** @type {?} */ CHECKBOX_REQUIRED_VALIDATOR = {
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
 * \@stable
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
/** @nocollapse */
RequiredValidator.ctorParameters = () => [];
RequiredValidator.propDecorators = {
    "required": [{ type: Input },],
};
function RequiredValidator_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    RequiredValidator.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    RequiredValidator.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    RequiredValidator.propDecorators;
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
/** @nocollapse */
CheckboxRequiredValidator.ctorParameters = () => [];
function CheckboxRequiredValidator_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    CheckboxRequiredValidator.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    CheckboxRequiredValidator.ctorParameters;
}
/**
 * Provider which adds `EmailValidator` to `NG_VALIDATORS`.
 */
export const /** @type {?} */ EMAIL_VALIDATOR = {
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
/** @nocollapse */
EmailValidator.ctorParameters = () => [];
EmailValidator.propDecorators = {
    "email": [{ type: Input },],
};
function EmailValidator_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    EmailValidator.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    EmailValidator.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    EmailValidator.propDecorators;
    /** @type {?} */
    EmailValidator.prototype._enabled;
    /** @type {?} */
    EmailValidator.prototype._onChange;
}
/**
 * \@stable
 * @record
 */
export function ValidatorFn() { }
function ValidatorFn_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (c: AbstractControl): ValidationErrors|null;
    */
}
/**
 * \@stable
 * @record
 */
export function AsyncValidatorFn() { }
function AsyncValidatorFn_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    (c: AbstractControl): Promise<ValidationErrors|null>|Observable<ValidationErrors|null>;
    */
}
/**
 * Provider which adds `MinLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {\@example common/forms/ts/validators/validators.ts region='min'}
 */
export const /** @type {?} */ MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthValidator),
    multi: true
};
/**
 * A directive which installs the `MinLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 * \@stable
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
/** @nocollapse */
MinLengthValidator.ctorParameters = () => [];
MinLengthValidator.propDecorators = {
    "minlength": [{ type: Input },],
};
function MinLengthValidator_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    MinLengthValidator.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    MinLengthValidator.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    MinLengthValidator.propDecorators;
    /** @type {?} */
    MinLengthValidator.prototype._validator;
    /** @type {?} */
    MinLengthValidator.prototype._onChange;
    /** @type {?} */
    MinLengthValidator.prototype.minlength;
}
/**
 * Provider which adds `MaxLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {\@example common/forms/ts/validators/validators.ts region='max'}
 */
export const /** @type {?} */ MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthValidator),
    multi: true
};
/**
 * A directive which installs the `MaxLengthValidator` for any `formControlName,
 * `formControl`,
 * or control with `ngModel` that also has a `maxlength` attribute.
 *
 * \@stable
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
/** @nocollapse */
MaxLengthValidator.ctorParameters = () => [];
MaxLengthValidator.propDecorators = {
    "maxlength": [{ type: Input },],
};
function MaxLengthValidator_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    MaxLengthValidator.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    MaxLengthValidator.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    MaxLengthValidator.propDecorators;
    /** @type {?} */
    MaxLengthValidator.prototype._validator;
    /** @type {?} */
    MaxLengthValidator.prototype._onChange;
    /** @type {?} */
    MaxLengthValidator.prototype.maxlength;
}
export const /** @type {?} */ PATTERN_VALIDATOR = {
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
 * \@stable
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
/** @nocollapse */
PatternValidator.ctorParameters = () => [];
PatternValidator.propDecorators = {
    "pattern": [{ type: Input },],
};
function PatternValidator_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    PatternValidator.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    PatternValidator.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    PatternValidator.propDecorators;
    /** @type {?} */
    PatternValidator.prototype._validator;
    /** @type {?} */
    PatternValidator.prototype._onChange;
    /** @type {?} */
    PatternValidator.prototype.pattern;
}
//# sourceMappingURL=validators.js.map