/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Input, ɵcoerceToBoolean as coerceToBoolean } from '@angular/core';
import { emailValidator, maxLengthValidator, maxValidator, minLengthValidator, minValidator, NG_VALIDATORS, nullValidator, patternValidator, requiredTrueValidator, requiredValidator } from '../validators';
import * as i0 from "@angular/core";
/**
 * Method that updates string to integer if not already a number
 *
 * @param value The value to convert to integer.
 * @returns value of parameter converted to number or integer.
 */
function toInteger(value) {
    return typeof value === 'number' ? value : parseInt(value, 10);
}
/**
 * Method that ensures that provided value is a float (and converts it to float if needed).
 *
 * @param value The value to convert to float.
 * @returns value of parameter converted to number or float.
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
    /** @nodoc */
    ngOnChanges(changes) {
        if (this.inputName in changes) {
            const input = this.normalizeInput(changes[this.inputName].currentValue);
            this._enabled = this.enabled(input);
            this._validator = this._enabled ? this.createValidator(input) : nullValidator;
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
     * Determines whether this validator should be active or not based on an input.
     * Base class implementation checks whether an input is defined (if the value is different from
     * `null` and `undefined`). Validator classes that extend this base class can override this
     * function with the logic specific to a particular validator directive.
     */
    enabled(input) {
        return input != null /* both `null` and `undefined` */;
    }
}
AbstractValidatorDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: AbstractValidatorDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive });
AbstractValidatorDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: AbstractValidatorDirective, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: AbstractValidatorDirective, decorators: [{
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
}
MaxValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MaxValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MaxValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: { max: "max" }, host: { properties: { "attr.max": "_enabled ? max : null" } }, providers: [MAX_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MaxValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]',
                    providers: [MAX_VALIDATOR],
                    host: { '[attr.max]': '_enabled ? max : null' }
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
}
MinValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MinValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MinValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: { min: "min" }, host: { properties: { "attr.min": "_enabled ? min : null" } }, providers: [MIN_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MinValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]',
                    providers: [MIN_VALIDATOR],
                    host: { '[attr.min]': '_enabled ? min : null' }
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
export class RequiredValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'required';
        /** @internal */
        this.normalizeInput = coerceToBoolean;
        /** @internal */
        this.createValidator = (input) => requiredValidator;
    }
    /** @nodoc */
    enabled(input) {
        return input;
    }
}
RequiredValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: RequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
RequiredValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: { required: "required" }, host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: RequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                    providers: [REQUIRED_VALIDATOR],
                    host: { '[attr.required]': '_enabled ? "" : null' }
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
    constructor() {
        super(...arguments);
        /** @internal */
        this.createValidator = (input) => requiredTrueValidator;
    }
}
CheckboxRequiredValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: CheckboxRequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
CheckboxRequiredValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: CheckboxRequiredValidator, selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: CheckboxRequiredValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                    providers: [CHECKBOX_REQUIRED_VALIDATOR],
                    host: { '[attr.required]': '_enabled ? "" : null' }
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
 * The email validation is based on the WHATWG HTML specification with some enhancements to
 * incorporate more RFC rules. More information can be found on the [Validators.email
 * page](api/forms/Validators#email).
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
export class EmailValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'email';
        /** @internal */
        this.normalizeInput = coerceToBoolean;
        /** @internal */
        this.createValidator = (input) => emailValidator;
    }
    /** @nodoc */
    enabled(input) {
        return input;
    }
}
EmailValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: EmailValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
EmailValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: EmailValidator, selector: "[email][formControlName],[email][formControl],[email][ngModel]", inputs: { email: "email" }, providers: [EMAIL_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: EmailValidator, decorators: [{
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
}
MinLengthValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MinLengthValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MinLengthValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: MinLengthValidator, selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", inputs: { minlength: "minlength" }, host: { properties: { "attr.minlength": "_enabled ? minlength : null" } }, providers: [MIN_LENGTH_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MinLengthValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                    providers: [MIN_LENGTH_VALIDATOR],
                    host: { '[attr.minlength]': '_enabled ? minlength : null' }
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
}
MaxLengthValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MaxLengthValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MaxLengthValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: { maxlength: "maxlength" }, host: { properties: { "attr.maxlength": "_enabled ? maxlength : null" } }, providers: [MAX_LENGTH_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: MaxLengthValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                    providers: [MAX_LENGTH_VALIDATOR],
                    host: { '[attr.maxlength]': '_enabled ? maxlength : null' }
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
export class PatternValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'pattern';
        /** @internal */
        this.normalizeInput = (input) => input;
        /** @internal */
        this.createValidator = (input) => patternValidator(input);
    }
}
PatternValidator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: PatternValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive });
PatternValidator.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0-next.0+sha-0bc4405", type: PatternValidator, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: { pattern: "pattern" }, host: { properties: { "attr.pattern": "_enabled ? pattern : null" } }, providers: [PATTERN_VALIDATOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-0bc4405", ngImport: i0, type: PatternValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': '_enabled ? pattern : null' }
                }]
        }], propDecorators: { pattern: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUE0QyxnQkFBZ0IsSUFBSSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJMUksT0FBTyxFQUFDLGNBQWMsRUFBRSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLEVBQUUscUJBQXFCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRTNNOzs7OztHQUtHO0FBQ0gsU0FBUyxTQUFTLENBQUMsS0FBb0I7SUFDckMsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFTLE9BQU8sQ0FBQyxLQUFvQjtJQUNuQyxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQTBERDs7Ozs7R0FLRztBQUNILE1BQ2UsMEJBQTBCO0lBRHpDO1FBRVUsZUFBVSxHQUFnQixhQUFhLENBQUM7S0F1RWpEO0lBaENDLGFBQWE7SUFDYixXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sRUFBRTtZQUM3QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxD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OUIsSUFBSSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsMkJBQTJCLEVBQUM7aUJBQ3REOzhCQU9DLE9BQU87c0JBRE4sS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgU3RhdGljUHJvdmlkZXIsIMm1Y29lcmNlVG9Cb29sZWFuIGFzIGNvZXJjZVRvQm9vbGVhbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbH0gZnJvbSAnLi4vbW9kZWwvYWJzdHJhY3RfbW9kZWwnO1xuaW1wb3J0IHtlbWFpbFZhbGlkYXRvciwgbWF4TGVuZ3RoVmFsaWRhdG9yLCBtYXhWYWxpZGF0b3IsIG1pbkxlbmd0aFZhbGlkYXRvciwgbWluVmFsaWRhdG9yLCBOR19WQUxJREFUT1JTLCBudWxsVmFsaWRhdG9yLCBwYXR0ZXJuVmFsaWRhdG9yLCByZXF1aXJlZFRydWVWYWxpZGF0b3IsIHJlcXVpcmVkVmFsaWRhdG9yfSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuLyoqXG4gKiBNZXRob2QgdGhhdCB1cGRhdGVzIHN0cmluZyB0byBpbnRlZ2VyIGlmIG5vdCBhbHJlYWR5IGEgbnVtYmVyXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGludGVnZXIuXG4gKiBAcmV0dXJucyB2YWx1ZSBvZiBwYXJhbWV0ZXIgY29udmVydGVkIHRvIG51bWJlciBvciBpbnRlZ2VyLlxuICovXG5mdW5jdGlvbiB0b0ludGVnZXIodmFsdWU6IHN0cmluZ3xudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogcGFyc2VJbnQodmFsdWUsIDEwKTtcbn1cblxuLyoqXG4gKiBNZXRob2QgdGhhdCBlbnN1cmVzIHRoYXQgcHJvdmlkZWQgdmFsdWUgaXMgYSBmbG9hdCAoYW5kIGNvbnZlcnRzIGl0IHRvIGZsb2F0IGlmIG5lZWRlZCkuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0IHRvIGZsb2F0LlxuICogQHJldHVybnMgdmFsdWUgb2YgcGFyYW1ldGVyIGNvbnZlcnRlZCB0byBudW1iZXIgb3IgZmxvYXQuXG4gKi9cbmZ1bmN0aW9uIHRvRmxvYXQodmFsdWU6IHN0cmluZ3xudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyA/IHZhbHVlIDogcGFyc2VGbG9hdCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEZWZpbmVzIHRoZSBtYXAgb2YgZXJyb3JzIHJldHVybmVkIGZyb20gZmFpbGVkIHZhbGlkYXRpb24gY2hlY2tzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgVmFsaWRhdGlvbkVycm9ycyA9IHtcbiAgW2tleTogc3RyaW5nXTogYW55XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQW4gaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IGNsYXNzZXMgdGhhdCBwZXJmb3JtIHN5bmNocm9ub3VzIHZhbGlkYXRpb24uXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW1wbGVtZW50cyB0aGUgYFZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhXG4gKiB2YWxpZGF0b3IgZGlyZWN0aXZlIHdpdGggYSBjdXN0b20gZXJyb3Iga2V5LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21WYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICogICAgIHJldHVybiB7J2N1c3RvbSc6IHRydWV9O1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBwZXJmb3JtcyBzeW5jaHJvbm91cyB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIFRoZSBjb250cm9sIHRvIHZhbGlkYXRlIGFnYWluc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbWFwIG9mIHZhbGlkYXRpb24gZXJyb3JzIGlmIHZhbGlkYXRpb24gZmFpbHMsXG4gICAqIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSB2YWxpZGF0b3IgaW5wdXRzIGNoYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZT8oZm46ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIEEgYmFzZSBjbGFzcyBmb3IgVmFsaWRhdG9yLWJhc2VkIERpcmVjdGl2ZXMuIFRoZSBjbGFzcyBjb250YWlucyBjb21tb24gbG9naWMgc2hhcmVkIGFjcm9zcyBzdWNoXG4gKiBEaXJlY3RpdmVzLlxuICpcbiAqIEZvciBpbnRlcm5hbCB1c2Ugb25seSwgdGhpcyBjbGFzcyBpcyBub3QgaW50ZW5kZWQgZm9yIHVzZSBvdXRzaWRlIG9mIHRoZSBGb3JtcyBwYWNrYWdlLlxuICovXG5ARGlyZWN0aXZlKClcbmFic3RyYWN0IGNsYXNzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yLCBPbkNoYW5nZXMge1xuICBwcml2YXRlIF92YWxpZGF0b3I6IFZhbGlkYXRvckZuID0gbnVsbFZhbGlkYXRvcjtcbiAgcHJpdmF0ZSBfb25DaGFuZ2UhOiAoKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdGhhdCB0cmFja3Mgd2hldGhlciB0aGlzIHZhbGlkYXRvciBpcyBlbmFibGVkLlxuICAgKlxuICAgKiBNYXJraW5nIGl0IGBpbnRlcm5hbGAgKHZzIGBwcm90ZWN0ZWRgKSwgc28gdGhhdCB0aGlzIGZsYWcgY2FuIGJlIHVzZWQgaW4gaG9zdCBiaW5kaW5ncyBvZlxuICAgKiBkaXJlY3RpdmUgY2xhc3NlcyB0aGF0IGV4dGVuZCB0aGlzIGJhc2UgY2xhc3MuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2VuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIGFuIGlucHV0IHRoYXQgbWF0Y2hlcyBkaXJlY3RpdmUgc2VsZWN0b3IgYXR0cmlidXRlIChlLmcuIGBtaW5sZW5ndGhgIGZvclxuICAgKiBgTWluTGVuZ3RoRGlyZWN0aXZlYCkuIEFuIGlucHV0IHdpdGggYSBnaXZlbiBuYW1lIG1pZ2h0IGNvbnRhaW4gY29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbiAobGlrZVxuICAgKiBgbWlubGVuZ3RoPScxMCdgKSBvciBhIGZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciB2YWxpZGF0b3Igc2hvdWxkIGJlIGVuYWJsZWQgKGxpa2VcbiAgICogYFtyZXF1aXJlZF09J2ZhbHNlJ2ApLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGFic3RyYWN0IGlucHV0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIGEgdmFsaWRhdG9yIChzcGVjaWZpYyB0byBhIGRpcmVjdGl2ZSB0aGF0IGV4dGVuZHMgdGhpcyBiYXNlIGNsYXNzKS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBhYnN0cmFjdCBjcmVhdGVWYWxpZGF0b3IoaW5wdXQ6IHVua25vd24pOiBWYWxpZGF0b3JGbjtcblxuICAvKipcbiAgICogUGVyZm9ybXMgdGhlIG5lY2Vzc2FyeSBpbnB1dCBub3JtYWxpemF0aW9uIGJhc2VkIG9uIGEgc3BlY2lmaWMgbG9naWMgb2YgYSBEaXJlY3RpdmUuXG4gICAqIEZvciBleGFtcGxlLCB0aGUgZnVuY3Rpb24gbWlnaHQgYmUgdXNlZCB0byBjb252ZXJ0IHN0cmluZy1iYXNlZCByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAgICogYG1pbmxlbmd0aGAgaW5wdXQgdG8gYW4gaW50ZWdlciB2YWx1ZSB0aGF0IGNhbiBsYXRlciBiZSB1c2VkIGluIHRoZSBgVmFsaWRhdG9ycy5taW5MZW5ndGhgXG4gICAqIHZhbGlkYXRvci5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBhYnN0cmFjdCBub3JtYWxpemVJbnB1dChpbnB1dDogdW5rbm93bik6IHVua25vd247XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5wdXROYW1lIGluIGNoYW5nZXMpIHtcbiAgICAgIGNvbnN0IGlucHV0ID0gdGhpcy5ub3JtYWxpemVJbnB1dChjaGFuZ2VzW3RoaXMuaW5wdXROYW1lXS5jdXJyZW50VmFsdWUpO1xuICAgICAgdGhpcy5fZW5hYmxlZCA9IHRoaXMuZW5hYmxlZChpbnB1dCk7XG4gICAgICB0aGlzLl92YWxpZGF0b3IgPSB0aGlzLl9lbmFibGVkID8gdGhpcy5jcmVhdGVWYWxpZGF0b3IoaW5wdXQpIDogbnVsbFZhbGlkYXRvcjtcbiAgICAgIGlmICh0aGlzLl9vbkNoYW5nZSkge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yKGNvbnRyb2wpO1xuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoaXMgdmFsaWRhdG9yIHNob3VsZCBiZSBhY3RpdmUgb3Igbm90IGJhc2VkIG9uIGFuIGlucHV0LlxuICAgKiBCYXNlIGNsYXNzIGltcGxlbWVudGF0aW9uIGNoZWNrcyB3aGV0aGVyIGFuIGlucHV0IGlzIGRlZmluZWQgKGlmIHRoZSB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbVxuICAgKiBgbnVsbGAgYW5kIGB1bmRlZmluZWRgKS4gVmFsaWRhdG9yIGNsYXNzZXMgdGhhdCBleHRlbmQgdGhpcyBiYXNlIGNsYXNzIGNhbiBvdmVycmlkZSB0aGlzXG4gICAqIGZ1bmN0aW9uIHdpdGggdGhlIGxvZ2ljIHNwZWNpZmljIHRvIGEgcGFydGljdWxhciB2YWxpZGF0b3IgZGlyZWN0aXZlLlxuICAgKi9cbiAgZW5hYmxlZChpbnB1dDogdW5rbm93bik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbnB1dCAhPSBudWxsIC8qIGJvdGggYG51bGxgIGFuZCBgdW5kZWZpbmVkYCAqLztcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWF4VmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfVkFMSURBVE9SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4VmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIHtAbGluayBNYXhWYWxpZGF0b3J9IGZvciBhbnkgYGZvcm1Db250cm9sTmFtZWAsXG4gKiBgZm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWF4YCBhdHRyaWJ1dGUuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWF4IHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgbWF4IHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbmdNb2RlbCBtYXg9XCI0XCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVttYXhdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01BWF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLm1heF0nOiAnX2VuYWJsZWQgPyBtYXggOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF4VmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBtYXggYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKSBtYXghOiBzdHJpbmd8bnVtYmVyfG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgaW5wdXROYW1lID0gJ21heCc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgbm9ybWFsaXplSW5wdXQgPSAoaW5wdXQ6IHN0cmluZ3xudW1iZXIpOiBudW1iZXIgPT4gdG9GbG9hdChpbnB1dCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlVmFsaWRhdG9yID0gKG1heDogbnVtYmVyKTogVmFsaWRhdG9yRm4gPT4gbWF4VmFsaWRhdG9yKG1heCk7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNaW5WYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9WQUxJREFUT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNaW5WYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB3aGljaCBpbnN0YWxscyB0aGUge0BsaW5rIE1pblZhbGlkYXRvcn0gZm9yIGFueSBgZm9ybUNvbnRyb2xOYW1lYCxcbiAqIGBmb3JtQ29udHJvbGAsIG9yIGNvbnRyb2wgd2l0aCBgbmdNb2RlbGAgdGhhdCBhbHNvIGhhcyBhIGBtaW5gIGF0dHJpYnV0ZS5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtaW4gdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBtaW4gdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IHR5cGU9XCJudW1iZXJcIiBuZ01vZGVsIG1pbj1cIjRcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ2lucHV0W3R5cGU9bnVtYmVyXVttaW5dW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1udW1iZXJdW21pbl1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9bnVtYmVyXVttaW5dW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbTUlOX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIubWluXSc6ICdfZW5hYmxlZCA/IG1pbiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBNaW5WYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIGNoYW5nZXMgdG8gdGhlIG1pbiBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpIG1pbiE6IHN0cmluZ3xudW1iZXJ8bnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnbWluJztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBub3JtYWxpemVJbnB1dCA9IChpbnB1dDogc3RyaW5nfG51bWJlcik6IG51bWJlciA9PiB0b0Zsb2F0KGlucHV0KTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAobWluOiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBtaW5WYWxpZGF0b3IobWluKTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGludGVyZmFjZSBpbXBsZW1lbnRlZCBieSBjbGFzc2VzIHRoYXQgcGVyZm9ybSBhc3luY2hyb25vdXMgdmFsaWRhdGlvbi5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBQcm92aWRlIGEgY3VzdG9tIGFzeW5jIHZhbGlkYXRvciBkaXJlY3RpdmVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW1wbGVtZW50cyB0aGUgYEFzeW5jVmFsaWRhdG9yYCBpbnRlcmZhY2UgdG8gY3JlYXRlIGFuXG4gKiBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlIHdpdGggYSBjdXN0b20gZXJyb3Iga2V5LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnW2N1c3RvbUFzeW5jVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19BU1lOQ19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tQXN5bmNWYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOlxuICogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tQXN5bmNWYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBBc3luY1ZhbGlkYXRvciB7XG4gKiAgIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPiB7XG4gKiAgICAgcmV0dXJuIG9mKHsnY3VzdG9tJzogdHJ1ZX0pO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNWYWxpZGF0b3IgZXh0ZW5kcyBWYWxpZGF0b3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHBlcmZvcm1zIGFzeW5jIHZhbGlkYXRpb24gYWdhaW5zdCB0aGUgcHJvdmlkZWQgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdmFsaWRhdGUgYWdhaW5zdC5cbiAgICpcbiAgICogQHJldHVybnMgQSBwcm9taXNlIG9yIG9ic2VydmFibGUgdGhhdCByZXNvbHZlcyBhIG1hcCBvZiB2YWxpZGF0aW9uIGVycm9yc1xuICAgKiBpZiB2YWxpZGF0aW9uIGZhaWxzLCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6XG4gICAgICBQcm9taXNlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD58T2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+O1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgUmVxdWlyZWRWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IFJFUVVJUkVEX1ZBTElEQVRPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBDSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHJlcXVpcmVkYCB2YWxpZGF0b3IgdG8gYW55IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcmVxdWlyZWQgdmFsaWRhdG9yIHVzaW5nIHRlbXBsYXRlLWRyaXZlbiBmb3Jtc1xuICpcbiAqIGBgYFxuICogPGlucHV0IG5hbWU9XCJmdWxsTmFtZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICc6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0sOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbF0sOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucmVxdWlyZWRdJzogJ19lbmFibGVkID8gXCJcIiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBSZXF1aXJlZFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgcmVxdWlyZWQgYXR0cmlidXRlIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KCkgcmVxdWlyZWQhOiBib29sZWFufHN0cmluZztcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGlucHV0TmFtZSA9ICdyZXF1aXJlZCc7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBub3JtYWxpemVJbnB1dCA9IGNvZXJjZVRvQm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGNyZWF0ZVZhbGlkYXRvciA9IChpbnB1dDogYm9vbGVhbik6IFZhbGlkYXRvckZuID0+IHJlcXVpcmVkVmFsaWRhdG9yO1xuXG4gIC8qKiBAbm9kb2MgKi9cbiAgb3ZlcnJpZGUgZW5hYmxlZChpbnB1dDogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxufVxuXG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBjaGVja2JveCBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIHJlcXVpcmVkIGNoZWNrYm94IHZhbGlkYXRvciB1c2luZyB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIGNoZWNrYm94IHJlcXVpcmVkIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJhY3RpdmVcIiBuZ01vZGVsIHJlcXVpcmVkPlxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtDSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnJlcXVpcmVkXSc6ICdfZW5hYmxlZCA/IFwiXCIgOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciBleHRlbmRzIFJlcXVpcmVkVmFsaWRhdG9yIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAoaW5wdXQ6IHVua25vd24pOiBWYWxpZGF0b3JGbiA9PiByZXF1aXJlZFRydWVWYWxpZGF0b3I7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBFbWFpbFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgRU1BSUxfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEVtYWlsVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgZW1haWxgIHZhbGlkYXRvciB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBlbWFpbGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIFRoZSBlbWFpbCB2YWxpZGF0aW9uIGlzIGJhc2VkIG9uIHRoZSBXSEFUV0cgSFRNTCBzcGVjaWZpY2F0aW9uIHdpdGggc29tZSBlbmhhbmNlbWVudHMgdG9cbiAqIGluY29ycG9yYXRlIG1vcmUgUkZDIHJ1bGVzLiBNb3JlIGluZm9ybWF0aW9uIGNhbiBiZSBmb3VuZCBvbiB0aGUgW1ZhbGlkYXRvcnMuZW1haWxcbiAqIHBhZ2VdKGFwaS9mb3Jtcy9WYWxpZGF0b3JzI2VtYWlsKS5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYW4gZW1haWwgdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYW4gZW1haWwgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuIG5nTW9kZWxcbiAqIGJpbmRpbmcuXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBlbWFpbD5cbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPVwidHJ1ZVwiPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgW2VtYWlsXT1cInRydWVcIj5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VtYWlsXVtmb3JtQ29udHJvbE5hbWVdLFtlbWFpbF1bZm9ybUNvbnRyb2xdLFtlbWFpbF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtFTUFJTF9WQUxJREFUT1JdXG59KVxuZXhwb3J0IGNsYXNzIEVtYWlsVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBlbWFpbCBhdHRyaWJ1dGUgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKSBlbWFpbCE6IGJvb2xlYW58c3RyaW5nO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgaW5wdXROYW1lID0gJ2VtYWlsJztcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gY29lcmNlVG9Cb29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0OiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBlbWFpbFZhbGlkYXRvcjtcblxuICAvKiogQG5vZG9jICovXG4gIG92ZXJyaWRlIGVuYWJsZWQoaW5wdXQ6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIGNvbnRyb2wgYW5kIHN5bmNocm9ub3VzbHkgcmV0dXJucyBhIG1hcCBvZlxuICogdmFsaWRhdGlvbiBlcnJvcnMgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvckZuIHtcbiAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIGNvbnRyb2wgYW5kIHJldHVybnMgYSBQcm9taXNlIG9yIG9ic2VydmFibGVcbiAqIHRoYXQgZW1pdHMgdmFsaWRhdGlvbiBlcnJvcnMgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yRm4ge1xuICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+fE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPjtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1pbkxlbmd0aFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgTUlOX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWluTGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIG1pbmltdW0gbGVuZ3RoIHZhbGlkYXRpb24gdG8gY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgbWlubGVuZ3RoYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWluaW11bSBsZW5ndGggdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBtaW5pbXVtIGxlbmd0aCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgbmFtZT1cImZpcnN0TmFtZVwiIG5nTW9kZWwgbWlubGVuZ3RoPVwiNFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWlubGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttaW5sZW5ndGhdW2Zvcm1Db250cm9sXSxbbWlubGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01JTl9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5taW5sZW5ndGhdJzogJ19lbmFibGVkID8gbWlubGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1pbkxlbmd0aFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgbWluaW11bSBsZW5ndGggYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKSBtaW5sZW5ndGghOiBzdHJpbmd8bnVtYmVyfG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnbWlubGVuZ3RoJztcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gKGlucHV0OiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyID0+IHRvSW50ZWdlcihpbnB1dCk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAobWlubGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBtaW5MZW5ndGhWYWxpZGF0b3IobWlubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1heExlbmd0aFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgTUFYX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4TGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIG1heCBsZW5ndGggdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtYXhpbXVtIGxlbmd0aCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1heGltdW0gbGVuZ3RoIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBuYW1lPVwiZmlyc3ROYW1lXCIgbmdNb2RlbCBtYXhsZW5ndGg9XCIyNVwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttYXhsZW5ndGhdW2Zvcm1Db250cm9sXSxbbWF4bGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01BWF9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5tYXhsZW5ndGhdJzogJ19lbmFibGVkID8gbWF4bGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1heExlbmd0aFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgbWluaW11bSBsZW5ndGggYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKSBtYXhsZW5ndGghOiBzdHJpbmd8bnVtYmVyfG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnbWF4bGVuZ3RoJztcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gKGlucHV0OiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyID0+IHRvSW50ZWdlcihpbnB1dCk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAobWF4bGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBtYXhMZW5ndGhWYWxpZGF0b3IobWF4bGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFBhdHRlcm5WYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IFBBVFRFUk5fVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBhdHRlcm5WYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHJlZ2V4IHBhdHRlcm4gdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBwYXR0ZXJuYCBhdHRyaWJ1dGUuIFRoZSByZWdleCBtdXN0IG1hdGNoIHRoZSBlbnRpcmUgY29udHJvbCB2YWx1ZS5cbiAqIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcGF0dGVybiB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIHBhdHRlcm4gdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IG5hbWU9XCJmaXJzdE5hbWVcIiBuZ01vZGVsIHBhdHRlcm49XCJbYS16QS1aIF0qXCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twYXR0ZXJuXVtmb3JtQ29udHJvbE5hbWVdLFtwYXR0ZXJuXVtmb3JtQ29udHJvbF0sW3BhdHRlcm5dW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUEFUVEVSTl9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnBhdHRlcm5dJzogJ19lbmFibGVkID8gcGF0dGVybiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBQYXR0ZXJuVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBwYXR0ZXJuIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KClcbiAgcGF0dGVybiE6IHN0cmluZ3xSZWdFeHA7ICAvLyBUaGlzIGlucHV0IGlzIGFsd2F5cyBkZWZpbmVkLCBzaW5jZSB0aGUgbmFtZSBtYXRjaGVzIHNlbGVjdG9yLlxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgaW5wdXROYW1lID0gJ3BhdHRlcm4nO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgbm9ybWFsaXplSW5wdXQgPSAoaW5wdXQ6IHN0cmluZ3xSZWdFeHApOiBzdHJpbmd8UmVnRXhwID0+IGlucHV0O1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0OiBzdHJpbmd8UmVnRXhwKTogVmFsaWRhdG9yRm4gPT4gcGF0dGVyblZhbGlkYXRvcihpbnB1dCk7XG59XG4iXX0=