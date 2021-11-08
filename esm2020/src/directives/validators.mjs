/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Input } from '@angular/core';
import { emailValidator, maxLengthValidator, maxValidator, minLengthValidator, minValidator, NG_VALIDATORS, nullValidator, patternValidator, requiredTrueValidator, requiredValidator } from '../validators';
import * as i0 from "@angular/core";
/**
 * Method that updates string to integer if not already a number
 *
 * @param value The value to convert to integer
 * @returns value of parameter in number or integer.
 */
function toInteger(value) {
    return typeof value === 'number' ? value : parseInt(value, 10);
}
/**
 * Method that ensures that provided value is a float (and converts it to float if needed).
 *
 * @param value The value to convert to float
 * @returns value of parameter in number or float.
 */
function toFloat(value) {
    return typeof value === 'number' ? value : parseFloat(value);
}
/**
 * A base class for Validator-based Directives. The class contains common logic shared across such
 * Directives.
 *
 * For internal use only, this class is not intended for use outside of the Forms package.
 */
class AbstractValidatorDirective {
    constructor() {
        this._validator = nullValidator;
    }
    /**
     * Helper function invoked from child classes to process changes (from `ngOnChanges` hook).
     * @nodoc
     */
    handleChanges(changes) {
        if (this.inputName in changes) {
            const input = this.normalizeInput(changes[this.inputName].currentValue);
            this._validator = this.enabled() ? this.createValidator(input) : nullValidator;
            if (this._onChange) {
                this._onChange();
            }
        }
    }
    /** @nodoc */
    validate(control) {
        return this._validator(control);
    }
    /** @nodoc */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
    /**
     * @description
     * Determines whether this validator is active or not. Base class implementation
     * checks whether an input is defined (if the value is different from `null` and `undefined`).
     * Validator classes that extend this base class can override this function with the logic
     * specific to a particular validator directive.
     */
    enabled() {
        const inputValue = this[this.inputName];
        return inputValue != null /* both `null` and `undefined` */;
    }
}
AbstractValidatorDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: AbstractValidatorDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
AbstractValidatorDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: AbstractValidatorDirective, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: AbstractValidatorDirective, decorators: [{
            type: Directive
        }] });
/**
 * @description
 * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const MAX_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxValidator),
    multi: true
};
/**
 * A directive which installs the {@link MaxValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `max` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a max validator
 *
 * The following example shows how to add a max validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel max="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class MaxValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'max';
        /** @internal */
        this.normalizeInput = (input) => toFloat(input);
        /** @internal */
        this.createValidator = (max) => maxValidator(max);
    }
    /**
     * Declare `ngOnChanges` lifecycle hook at the main directive level (vs keeping it in base class)
     * to avoid differences in handling inheritance of lifecycle hooks between Ivy and ViewEngine in
     * AOT mode. This could be refactored once ViewEngine is removed.
     * @nodoc
     */
    ngOnChanges(changes) {
        this.handleChanges(changes);
    }
}
MaxValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MaxValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MaxValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: { max: "max" }, host: { properties: { "attr.max": "enabled() ? max : null" } }, providers: [MAX_VALIDATOR], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MaxValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]',
                    providers: [MAX_VALIDATOR],
                    host: { '[attr.max]': 'enabled() ? max : null' }
                }]
        }], propDecorators: { max: [{
                type: Input
            }] } });
/**
 * @description
 * Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const MIN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinValidator),
    multi: true
};
/**
 * A directive which installs the {@link MinValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `min` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a min validator
 *
 * The following example shows how to add a min validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel min="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class MinValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'min';
        /** @internal */
        this.normalizeInput = (input) => toFloat(input);
        /** @internal */
        this.createValidator = (min) => minValidator(min);
    }
    /**
     * Declare `ngOnChanges` lifecycle hook at the main directive level (vs keeping it in base class)
     * to avoid differences in handling inheritance of lifecycle hooks between Ivy and ViewEngine in
     * AOT mode. This could be refactored once ViewEngine is removed.
     * @nodoc
     */
    ngOnChanges(changes) {
        this.handleChanges(changes);
    }
}
MinValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MinValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MinValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: { min: "min" }, host: { properties: { "attr.min": "enabled() ? min : null" } }, providers: [MIN_VALIDATOR], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MinValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]',
                    providers: [MIN_VALIDATOR],
                    host: { '[attr.min]': 'enabled() ? min : null' }
                }]
        }], propDecorators: { min: [{
                type: Input
            }] } });
/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RequiredValidator),
    multi: true
};
/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CheckboxRequiredValidator),
    multi: true
};
/**
 * @description
 * A directive that adds the `required` validator to any controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required validator using template-driven forms
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class RequiredValidator {
    constructor() {
        this._required = false;
    }
    /**
     * @description
     * Tracks changes to the required attribute bound to this directive.
     */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = value != null && value !== false && `${value}` !== 'false';
        if (this._onChange)
            this._onChange();
    }
    /**
     * Method that validates whether the control is empty.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control) {
        return this.required ? requiredValidator(control) : null;
    }
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
}
RequiredValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: RequiredValidator, deps: [], target: i0.ɵɵFactoryTarget.Directive });
RequiredValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: { required: "required" }, host: { properties: { "attr.required": "required ? \"\" : null" } }, providers: [REQUIRED_VALIDATOR], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: RequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                    providers: [REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required ? "" : null' }
                }]
        }], propDecorators: { required: [{
                type: Input
            }] } });
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required checkbox validator using template-driven forms
 *
 * The following example shows how to add a checkbox required validator to an input attached to an
 * ngModel binding.
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
export class CheckboxRequiredValidator extends RequiredValidator {
    /**
     * Method that validates whether or not the checkbox has been checked.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control) {
        return this.required ? requiredTrueValidator(control) : null;
    }
}
CheckboxRequiredValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: CheckboxRequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
CheckboxRequiredValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: CheckboxRequiredValidator, selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", host: { properties: { "attr.required": "required ? \"\" : null" } }, providers: [CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: CheckboxRequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                    providers: [CHECKBOX_REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required ? "" : null' }
                }]
        }] });
/**
 * @description
 * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailValidator),
    multi: true
};
/**
 * A directive that adds the `email` validator to controls marked with the
 * `email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding an email validator
 *
 * The following example shows how to add an email validator to an input attached to an ngModel
 * binding.
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
export class EmailValidator {
    constructor() {
        this._enabled = false;
    }
    /**
     * @description
     * Tracks changes to the email attribute bound to this directive.
     */
    set email(value) {
        this._enabled = value === '' || value === true || value === 'true';
        if (this._onChange)
            this._onChange();
    }
    /**
     * Method that validates whether an email address is valid.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control) {
        return this._enabled ? emailValidator(control) : null;
    }
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
}
EmailValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: EmailValidator, deps: [], target: i0.ɵɵFactoryTarget.Directive });
EmailValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: EmailValidator, selector: "[email][formControlName],[email][formControl],[email][ngModel]", inputs: { email: "email" }, providers: [EMAIL_VALIDATOR], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: EmailValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                    providers: [EMAIL_VALIDATOR]
                }]
        }], propDecorators: { email: [{
                type: Input
            }] } });
/**
 * @description
 * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthValidator),
    multi: true
};
/**
 * A directive that adds minimum length validation to controls marked with the
 * `minlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a minimum length validator
 *
 * The following example shows how to add a minimum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel minlength="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class MinLengthValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'minlength';
        /** @internal */
        this.normalizeInput = (input) => toInteger(input);
        /** @internal */
        this.createValidator = (minlength) => minLengthValidator(minlength);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this.handleChanges(changes);
    }
}
MinLengthValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MinLengthValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MinLengthValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: MinLengthValidator, selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", inputs: { minlength: "minlength" }, host: { properties: { "attr.minlength": "enabled() ? minlength : null" } }, providers: [MIN_LENGTH_VALIDATOR], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MinLengthValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                    providers: [MIN_LENGTH_VALIDATOR],
                    host: { '[attr.minlength]': 'enabled() ? minlength : null' }
                }]
        }], propDecorators: { minlength: [{
                type: Input
            }] } });
/**
 * @description
 * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthValidator),
    multi: true
};
/**
 * A directive that adds max length validation to controls marked with the
 * `maxlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a maximum length validator
 *
 * The following example shows how to add a maximum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel maxlength="25">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class MaxLengthValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'maxlength';
        /** @internal */
        this.normalizeInput = (input) => toInteger(input);
        /** @internal */
        this.createValidator = (maxlength) => maxLengthValidator(maxlength);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this.handleChanges(changes);
    }
}
MaxLengthValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MaxLengthValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MaxLengthValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: { maxlength: "maxlength" }, host: { properties: { "attr.maxlength": "enabled() ? maxlength : null" } }, providers: [MAX_LENGTH_VALIDATOR], usesInheritance: true, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: MaxLengthValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                    providers: [MAX_LENGTH_VALIDATOR],
                    host: { '[attr.maxlength]': 'enabled() ? maxlength : null' }
                }]
        }], propDecorators: { maxlength: [{
                type: Input
            }] } });
/**
 * @description
 * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PatternValidator),
    multi: true
};
/**
 * @description
 * A directive that adds regex pattern validation to controls marked with the
 * `pattern` attribute. The regex must match the entire control value.
 * The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a pattern validator
 *
 * The following example shows how to add a pattern validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel pattern="[a-zA-Z ]*">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class PatternValidator {
    constructor() {
        this._validator = nullValidator;
    }
    /** @nodoc */
    ngOnChanges(changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    /**
     * Method that validates whether the value matches the pattern requirement.
     * @nodoc
     */
    validate(control) {
        return this._validator(control);
    }
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
    _createValidator() {
        this._validator = patternValidator(this.pattern);
    }
}
PatternValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: PatternValidator, deps: [], target: i0.ɵɵFactoryTarget.Directive });
PatternValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", type: PatternValidator, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: { pattern: "pattern" }, host: { properties: { "attr.pattern": "pattern ? pattern : null" } }, providers: [PATTERN_VALIDATOR], usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+47.sha-49964c8.with-local-changes", ngImport: i0, type: PatternValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': 'pattern ? pattern : null' }
                }]
        }], propDecorators: { pattern: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUEyQyxNQUFNLGVBQWUsQ0FBQztBQUlyRyxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFM007Ozs7O0dBS0c7QUFDSCxTQUFTLFNBQVMsQ0FBQyxLQUFvQjtJQUNyQyxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsT0FBTyxDQUFDLEtBQW9CO0lBQ25DLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBeUREOzs7OztHQUtHO0FBQ0gsTUFDZSwwQkFBMEI7SUFEekM7UUFFVSxlQUFVLEdBQWdCLGFBQWEsQ0FBQztLQWlFakQ7SUFuQ0M7OztPQUdHO0lBQ0gsYUFBYSxDQUFDLE9BQXNCO1FBQ2xDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLEVBQUU7WUFDN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxD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O1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUM7O3dIQXJDVSxnQkFBZ0I7NEdBQWhCLGdCQUFnQixxTUFIaEIsQ0FBQyxpQkFBaUIsQ0FBQztzR0FHbkIsZ0JBQWdCO2tCQUw1QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzRUFBc0U7b0JBQ2hGLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUM5QixJQUFJLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSwwQkFBMEIsRUFBQztpQkFDckQ7OEJBVUMsT0FBTztzQkFETixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBTdGF0aWNQcm92aWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtlbWFpbFZhbGlkYXRvciwgbWF4TGVuZ3RoVmFsaWRhdG9yLCBtYXhWYWxpZGF0b3IsIG1pbkxlbmd0aFZhbGlkYXRvciwgbWluVmFsaWRhdG9yLCBOR19WQUxJREFUT1JTLCBudWxsVmFsaWRhdG9yLCBwYXR0ZXJuVmFsaWRhdG9yLCByZXF1aXJlZFRydWVWYWxpZGF0b3IsIHJlcXVpcmVkVmFsaWRhdG9yfSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuLyoqXG4gKiBNZXRob2QgdGhhdCB1cGRhdGVzIHN0cmluZyB0byBpbnRlZ2VyIGlmIG5vdCBhbHJlYWR5IGEgbnVtYmVyXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGludGVnZXJcbiAqIEByZXR1cm5zIHZhbHVlIG9mIHBhcmFtZXRlciBpbiBudW1iZXIgb3IgaW50ZWdlci5cbiAqL1xuZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlOiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSA6IHBhcnNlSW50KHZhbHVlLCAxMCk7XG59XG5cbi8qKlxuICogTWV0aG9kIHRoYXQgZW5zdXJlcyB0aGF0IHByb3ZpZGVkIHZhbHVlIGlzIGEgZmxvYXQgKGFuZCBjb252ZXJ0cyBpdCB0byBmbG9hdCBpZiBuZWVkZWQpLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBmbG9hdFxuICogQHJldHVybnMgdmFsdWUgb2YgcGFyYW1ldGVyIGluIG51bWJlciBvciBmbG9hdC5cbiAqL1xuZnVuY3Rpb24gdG9GbG9hdCh2YWx1ZTogc3RyaW5nfG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInID8gdmFsdWUgOiBwYXJzZUZsb2F0KHZhbHVlKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEZWZpbmVzIHRoZSBtYXAgb2YgZXJyb3JzIHJldHVybmVkIGZyb20gZmFpbGVkIHZhbGlkYXRpb24gY2hlY2tzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgVmFsaWRhdGlvbkVycm9ycyA9IHtcbiAgW2tleTogc3RyaW5nXTogYW55XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQW4gaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IGNsYXNzZXMgdGhhdCBwZXJmb3JtIHN5bmNocm9ub3VzIHZhbGlkYXRpb24uXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW1wbGVtZW50cyB0aGUgYFZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhXG4gKiB2YWxpZGF0b3IgZGlyZWN0aXZlIHdpdGggYSBjdXN0b20gZXJyb3Iga2V5LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21WYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICogICAgIHJldHVybiB7J2N1c3RvbSc6IHRydWV9O1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBwZXJmb3JtcyBzeW5jaHJvbm91cyB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIFRoZSBjb250cm9sIHRvIHZhbGlkYXRlIGFnYWluc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbWFwIG9mIHZhbGlkYXRpb24gZXJyb3JzIGlmIHZhbGlkYXRpb24gZmFpbHMsXG4gICAqIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSB2YWxpZGF0b3IgaW5wdXRzIGNoYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZT8oZm46ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgYmFzZSBjbGFzcyBmb3IgVmFsaWRhdG9yLWJhc2VkIERpcmVjdGl2ZXMuIFRoZSBjbGFzcyBjb250YWlucyBjb21tb24gbG9naWMgc2hhcmVkIGFjcm9zcyBzdWNoXG4gKiBEaXJlY3RpdmVzLlxuICpcbiAqIEZvciBpbnRlcm5hbCB1c2Ugb25seSwgdGhpcyBjbGFzcyBpcyBub3QgaW50ZW5kZWQgZm9yIHVzZSBvdXRzaWRlIG9mIHRoZSBGb3JtcyBwYWNrYWdlLlxuICovXG5ARGlyZWN0aXZlKClcbmFic3RyYWN0IGNsYXNzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IG51bGxWYWxpZGF0b3I7XG4gIHByaXZhdGUgX29uQ2hhbmdlITogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogTmFtZSBvZiBhbiBpbnB1dCB0aGF0IG1hdGNoZXMgZGlyZWN0aXZlIHNlbGVjdG9yIGF0dHJpYnV0ZSAoZS5nLiBgbWlubGVuZ3RoYCBmb3JcbiAgICogYE1pbkxlbmd0aERpcmVjdGl2ZWApLiBBbiBpbnB1dCB3aXRoIGEgZ2l2ZW4gbmFtZSBtaWdodCBjb250YWluIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb24gKGxpa2VcbiAgICogYG1pbmxlbmd0aD0nMTAnYCkgb3IgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgdmFsaWRhdG9yIHNob3VsZCBiZSBlbmFibGVkIChsaWtlXG4gICAqIGBbcmVxdWlyZWRdPSdmYWxzZSdgKS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBhYnN0cmFjdCBpbnB1dE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhIHZhbGlkYXRvciAoc3BlY2lmaWMgdG8gYSBkaXJlY3RpdmUgdGhhdCBleHRlbmRzIHRoaXMgYmFzZSBjbGFzcykuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlVmFsaWRhdG9yKGlucHV0OiB1bmtub3duKTogVmFsaWRhdG9yRm47XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgaW5wdXQgbm9ybWFsaXphdGlvbiBiYXNlZCBvbiBhIHNwZWNpZmljIGxvZ2ljIG9mIGEgRGlyZWN0aXZlLlxuICAgKiBGb3IgZXhhbXBsZSwgdGhlIGZ1bmN0aW9uIG1pZ2h0IGJlIHVzZWQgdG8gY29udmVydCBzdHJpbmctYmFzZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlXG4gICAqIGBtaW5sZW5ndGhgIGlucHV0IHRvIGFuIGludGVnZXIgdmFsdWUgdGhhdCBjYW4gbGF0ZXIgYmUgdXNlZCBpbiB0aGUgYFZhbGlkYXRvcnMubWluTGVuZ3RoYFxuICAgKiB2YWxpZGF0b3IuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgYWJzdHJhY3Qgbm9ybWFsaXplSW5wdXQoaW5wdXQ6IHVua25vd24pOiB1bmtub3duO1xuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gaW52b2tlZCBmcm9tIGNoaWxkIGNsYXNzZXMgdG8gcHJvY2VzcyBjaGFuZ2VzIChmcm9tIGBuZ09uQ2hhbmdlc2AgaG9vaykuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgaGFuZGxlQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5wdXROYW1lIGluIGNoYW5nZXMpIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5ub3JtYWxpemVJbnB1dChjaGFuZ2VzW3RoaXMuaW5wdXROYW1lXS5jdXJyZW50VmFsdWUpO1xuICAgICAgdGhpcy5fdmFsaWRhdG9yID0gdGhpcy5lbmFibGVkKCkgPyB0aGlzLmNyZWF0ZVZhbGlkYXRvcihpbnB1dCkgOiBudWxsVmFsaWRhdG9yO1xuICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLl92YWxpZGF0b3IoY29udHJvbCk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhpcyB2YWxpZGF0b3IgaXMgYWN0aXZlIG9yIG5vdC4gQmFzZSBjbGFzcyBpbXBsZW1lbnRhdGlvblxuICAgKiBjaGVja3Mgd2hldGhlciBhbiBpbnB1dCBpcyBkZWZpbmVkIChpZiB0aGUgdmFsdWUgaXMgZGlmZmVyZW50IGZyb20gYG51bGxgIGFuZCBgdW5kZWZpbmVkYCkuXG4gICAqIFZhbGlkYXRvciBjbGFzc2VzIHRoYXQgZXh0ZW5kIHRoaXMgYmFzZSBjbGFzcyBjYW4gb3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiB3aXRoIHRoZSBsb2dpY1xuICAgKiBzcGVjaWZpYyB0byBhIHBhcnRpY3VsYXIgdmFsaWRhdG9yIGRpcmVjdGl2ZS5cbiAgICovXG4gIGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9ICh0aGlzIGFzIHVua25vd24gYXMge1trZXk6IHN0cmluZ106IHVua25vd259KVt0aGlzLmlucHV0TmFtZV07XG4gICAgcmV0dXJuIGlucHV0VmFsdWUgIT0gbnVsbCAvKiBib3RoIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgKi87XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1heFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgTUFYX1ZBTElEQVRPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1heFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSB7QGxpbmsgTWF4VmFsaWRhdG9yfSBmb3IgYW55IGBmb3JtQ29udHJvbE5hbWVgLFxuICogYGZvcm1Db250cm9sYCwgb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1heGAgYXR0cmlidXRlLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIG1heCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1heCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG5nTW9kZWwgbWF4PVwiNFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXRbdHlwZT1udW1iZXJdW21heF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1udW1iZXJdW21heF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNQVhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5tYXhdJzogJ2VuYWJsZWQoKSA/IG1heCA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXhWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIGNoYW5nZXMgdG8gdGhlIG1heCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpIG1heCE6IHN0cmluZ3xudW1iZXJ8bnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnbWF4JztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBub3JtYWxpemVJbnB1dCA9IChpbnB1dDogc3RyaW5nfG51bWJlcik6IG51bWJlciA9PiB0b0Zsb2F0KGlucHV0KTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAobWF4OiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBtYXhWYWxpZGF0b3IobWF4KTtcbiAgLyoqXG4gICAqIERlY2xhcmUgYG5nT25DaGFuZ2VzYCBsaWZlY3ljbGUgaG9vayBhdCB0aGUgbWFpbiBkaXJlY3RpdmUgbGV2ZWwgKHZzIGtlZXBpbmcgaXQgaW4gYmFzZSBjbGFzcylcbiAgICogdG8gYXZvaWQgZGlmZmVyZW5jZXMgaW4gaGFuZGxpbmcgaW5oZXJpdGFuY2Ugb2YgbGlmZWN5Y2xlIGhvb2tzIGJldHdlZW4gSXZ5IGFuZCBWaWV3RW5naW5lIGluXG4gICAqIEFPVCBtb2RlLiBUaGlzIGNvdWxkIGJlIHJlZmFjdG9yZWQgb25jZSBWaWV3RW5naW5lIGlzIHJlbW92ZWQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWluVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBNSU5fVkFMSURBVE9SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWluVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIHtAbGluayBNaW5WYWxpZGF0b3J9IGZvciBhbnkgYGZvcm1Db250cm9sTmFtZWAsXG4gKiBgZm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWluYCBhdHRyaWJ1dGUuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWluIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgbWluIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbmdNb2RlbCBtaW49XCI0XCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVttaW5dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01JTl9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLm1pbl0nOiAnZW5hYmxlZCgpID8gbWluIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1pblZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgbWluIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KCkgbWluITogc3RyaW5nfG51bWJlcnxudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGlucHV0TmFtZSA9ICdtaW4nO1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gKGlucHV0OiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyID0+IHRvRmxvYXQoaW5wdXQpO1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGNyZWF0ZVZhbGlkYXRvciA9IChtaW46IG51bWJlcik6IFZhbGlkYXRvckZuID0+IG1pblZhbGlkYXRvcihtaW4pO1xuICAvKipcbiAgICogRGVjbGFyZSBgbmdPbkNoYW5nZXNgIGxpZmVjeWNsZSBob29rIGF0IHRoZSBtYWluIGRpcmVjdGl2ZSBsZXZlbCAodnMga2VlcGluZyBpdCBpbiBiYXNlIGNsYXNzKVxuICAgKiB0byBhdm9pZCBkaWZmZXJlbmNlcyBpbiBoYW5kbGluZyBpbmhlcml0YW5jZSBvZiBsaWZlY3ljbGUgaG9va3MgYmV0d2VlbiBJdnkgYW5kIFZpZXdFbmdpbmUgaW5cbiAgICogQU9UIG1vZGUuIFRoaXMgY291bGQgYmUgcmVmYWN0b3JlZCBvbmNlIFZpZXdFbmdpbmUgaXMgcmVtb3ZlZC5cbiAgICogQG5vZG9jXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2VzKGNoYW5nZXMpO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBbiBpbnRlcmZhY2UgaW1wbGVtZW50ZWQgYnkgY2xhc3NlcyB0aGF0IHBlcmZvcm0gYXN5bmNocm9ub3VzIHZhbGlkYXRpb24uXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBBc3luY1ZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhblxuICogYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21Bc3luY1ZhbGlkYXRvcl0nLFxuICogICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTkdfQVNZTkNfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTpcbiAqIHRydWV9XVxuICogfSlcbiAqIGNsYXNzIEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgQXN5bmNWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD4ge1xuICogICAgIHJldHVybiBvZih7J2N1c3RvbSc6IHRydWV9KTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yIGV4dGVuZHMgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIFRoZSBjb250cm9sIHRvIHZhbGlkYXRlIGFnYWluc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSBvciBvYnNlcnZhYmxlIHRoYXQgcmVzb2x2ZXMgYSBtYXAgb2YgdmFsaWRhdGlvbiBlcnJvcnNcbiAgICogaWYgdmFsaWRhdGlvbiBmYWlscywgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOlxuICAgICAgUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+fE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPjtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFJlcXVpcmVkVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBSRVFVSVJFRF9WQUxJREFUT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGFueSBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIHJlcXVpcmVkIHZhbGlkYXRvciB1c2luZyB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXNcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCBuYW1lPVwiZnVsbE5hbWVcIiBuZ01vZGVsIHJlcXVpcmVkPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtSRVFVSVJFRF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnJlcXVpcmVkXSc6ICdyZXF1aXJlZCA/IFwiXCIgOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUmVxdWlyZWRWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICBwcml2YXRlIF9yZXF1aXJlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9vbkNoYW5nZT86ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgcmVxdWlyZWQgYXR0cmlidXRlIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW58c3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fcmVxdWlyZWQ7XG4gIH1cblxuICBzZXQgcmVxdWlyZWQodmFsdWU6IGJvb2xlYW58c3RyaW5nKSB7XG4gICAgdGhpcy5fcmVxdWlyZWQgPSB2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9PSBmYWxzZSAmJiBgJHt2YWx1ZX1gICE9PSAnZmFsc2UnO1xuICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgd2hldGhlciB0aGUgY29udHJvbCBpcyBlbXB0eS5cbiAgICogUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaWYgZW5hYmxlZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1aXJlZCA/IHJlcXVpcmVkVmFsaWRhdG9yKGNvbnRyb2wpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG59XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGNoZWNrYm94IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcmVxdWlyZWQgY2hlY2tib3ggdmFsaWRhdG9yIHVzaW5nIHRlbXBsYXRlLWRyaXZlbiBmb3Jtc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgY2hlY2tib3ggcmVxdWlyZWQgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImFjdGl2ZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucmVxdWlyZWRdJzogJ3JlcXVpcmVkID8gXCJcIiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgUmVxdWlyZWRWYWxpZGF0b3Ige1xuICAvKipcbiAgICogTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBjaGVja2JveCBoYXMgYmVlbiBjaGVja2VkLlxuICAgKiBSZXR1cm5zIHRoZSB2YWxpZGF0aW9uIHJlc3VsdCBpZiBlbmFibGVkLCBvdGhlcndpc2UgbnVsbC5cbiAgICogQG5vZG9jXG4gICAqL1xuICBvdmVycmlkZSB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gcmVxdWlyZWRUcnVlVmFsaWRhdG9yKGNvbnRyb2wpIDogbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgRW1haWxWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IEVNQUlMX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBFbWFpbFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYGVtYWlsYCB2YWxpZGF0b3IgdG8gY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgZW1haWxgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYW4gZW1haWwgdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYW4gZW1haWwgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuIG5nTW9kZWxcbiAqIGJpbmRpbmcuXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBlbWFpbD5cbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPVwidHJ1ZVwiPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgW2VtYWlsXT1cInRydWVcIj5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VtYWlsXVtmb3JtQ29udHJvbE5hbWVdLFtlbWFpbF1bZm9ybUNvbnRyb2xdLFtlbWFpbF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtFTUFJTF9WQUxJREFUT1JdXG59KVxuZXhwb3J0IGNsYXNzIEVtYWlsVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgcHJpdmF0ZSBfZW5hYmxlZCA9IGZhbHNlO1xuICBwcml2YXRlIF9vbkNoYW5nZT86ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgZW1haWwgYXR0cmlidXRlIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGVtYWlsKHZhbHVlOiBib29sZWFufHN0cmluZykge1xuICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09ICd0cnVlJztcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHdoZXRoZXIgYW4gZW1haWwgYWRkcmVzcyBpcyB2YWxpZC5cbiAgICogUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaWYgZW5hYmxlZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZCA/IGVtYWlsVmFsaWRhdG9yKGNvbnRyb2wpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSBjb250cm9sIGFuZCBzeW5jaHJvbm91c2x5IHJldHVybnMgYSBtYXAgb2ZcbiAqIHZhbGlkYXRpb24gZXJyb3JzIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0b3JGbiB7XG4gIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGw7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgYSBjb250cm9sIGFuZCByZXR1cm5zIGEgUHJvbWlzZSBvciBvYnNlcnZhYmxlXG4gKiB0aGF0IGVtaXRzIHZhbGlkYXRpb24gZXJyb3JzIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3luY1ZhbGlkYXRvckZuIHtcbiAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFByb21pc2U8VmFsaWRhdGlvbkVycm9yc3xudWxsPnxPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD47XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNaW5MZW5ndGhWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9MRU5HVEhfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1pbkxlbmd0aFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyBtaW5pbXVtIGxlbmd0aCB2YWxpZGF0aW9uIHRvIGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYG1pbmxlbmd0aGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIG1pbmltdW0gbGVuZ3RoIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgbWluaW11bSBsZW5ndGggdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IG5hbWU9XCJmaXJzdE5hbWVcIiBuZ01vZGVsIG1pbmxlbmd0aD1cIjRcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWlubGVuZ3RoXVtmb3JtQ29udHJvbF0sW21pbmxlbmd0aF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNSU5fTEVOR1RIX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIubWlubGVuZ3RoXSc6ICdlbmFibGVkKCkgPyBtaW5sZW5ndGggOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgTWluTGVuZ3RoVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBtaW5pbXVtIGxlbmd0aCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpIG1pbmxlbmd0aCE6IHN0cmluZ3xudW1iZXJ8bnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnbWlubGVuZ3RoJztcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gKGlucHV0OiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyID0+IHRvSW50ZWdlcihpbnB1dCk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAobWlubGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBtaW5MZW5ndGhWYWxpZGF0b3IobWlubGVuZ3RoKTtcblxuICAvKiogQG5vZG9jICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZXMoY2hhbmdlcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1heExlbmd0aFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgTUFYX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4TGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIG1heCBsZW5ndGggdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtYXhpbXVtIGxlbmd0aCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1heGltdW0gbGVuZ3RoIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBuYW1lPVwiZmlyc3ROYW1lXCIgbmdNb2RlbCBtYXhsZW5ndGg9XCIyNVwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttYXhsZW5ndGhdW2Zvcm1Db250cm9sXSxbbWF4bGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01BWF9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5tYXhsZW5ndGhdJzogJ2VuYWJsZWQoKSA/IG1heGxlbmd0aCA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXhMZW5ndGhWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIGNoYW5nZXMgdG8gdGhlIG1pbmltdW0gbGVuZ3RoIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KCkgbWF4bGVuZ3RoITogc3RyaW5nfG51bWJlcnxudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGlucHV0TmFtZSA9ICdtYXhsZW5ndGgnO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgbm9ybWFsaXplSW5wdXQgPSAoaW5wdXQ6IHN0cmluZ3xudW1iZXIpOiBudW1iZXIgPT4gdG9JbnRlZ2VyKGlucHV0KTtcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGNyZWF0ZVZhbGlkYXRvciA9IChtYXhsZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuID0+IG1heExlbmd0aFZhbGlkYXRvcihtYXhsZW5ndGgpO1xuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlcyhjaGFuZ2VzKTtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgUGF0dGVyblZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgUEFUVEVSTl9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUGF0dGVyblZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgcmVnZXggcGF0dGVybiB2YWxpZGF0aW9uIHRvIGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHBhdHRlcm5gIGF0dHJpYnV0ZS4gVGhlIHJlZ2V4IG11c3QgbWF0Y2ggdGhlIGVudGlyZSBjb250cm9sIHZhbHVlLlxuICogVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBwYXR0ZXJuIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgcGF0dGVybiB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgbmFtZT1cImZpcnN0TmFtZVwiIG5nTW9kZWwgcGF0dGVybj1cIlthLXpBLVogXSpcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BhdHRlcm5dW2Zvcm1Db250cm9sTmFtZV0sW3BhdHRlcm5dW2Zvcm1Db250cm9sXSxbcGF0dGVybl1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtQQVRURVJOX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucGF0dGVybl0nOiAncGF0dGVybiA/IHBhdHRlcm4gOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUGF0dGVyblZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciwgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IG51bGxWYWxpZGF0b3I7XG4gIHByaXZhdGUgX29uQ2hhbmdlPzogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBwYXR0ZXJuIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KClcbiAgcGF0dGVybiE6IHN0cmluZ3xSZWdFeHA7ICAvLyBUaGlzIGlucHV0IGlzIGFsd2F5cyBkZWZpbmVkLCBzaW5jZSB0aGUgbmFtZSBtYXRjaGVzIHNlbGVjdG9yLlxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgncGF0dGVybicgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyB3aGV0aGVyIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSBwYXR0ZXJuIHJlcXVpcmVtZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjb250cm9sKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlVmFsaWRhdG9yKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZhbGlkYXRvciA9IHBhdHRlcm5WYWxpZGF0b3IodGhpcy5wYXR0ZXJuKTtcbiAgfVxufVxuIl19