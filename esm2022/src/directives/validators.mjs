/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { booleanAttribute, Directive, forwardRef, Input } from '@angular/core';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: AbstractValidatorDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: AbstractValidatorDirective, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: AbstractValidatorDirective, decorators: [{
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
class MaxValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'max';
        /** @internal */
        this.normalizeInput = (input) => toFloat(input);
        /** @internal */
        this.createValidator = (max) => maxValidator(max);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MaxValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: MaxValidator, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: { max: "max" }, host: { properties: { "attr.max": "_enabled ? max : null" } }, providers: [MAX_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { MaxValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MaxValidator, decorators: [{
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
class MinValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'min';
        /** @internal */
        this.normalizeInput = (input) => toFloat(input);
        /** @internal */
        this.createValidator = (min) => minValidator(min);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MinValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: MinValidator, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: { min: "min" }, host: { properties: { "attr.min": "_enabled ? min : null" } }, providers: [MIN_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { MinValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MinValidator, decorators: [{
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
class RequiredValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'required';
        /** @internal */
        this.normalizeInput = booleanAttribute;
        /** @internal */
        this.createValidator = (input) => requiredValidator;
    }
    /** @nodoc */
    enabled(input) {
        return input;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: RequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: RequiredValidator, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: { required: "required" }, host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { RequiredValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: RequiredValidator, decorators: [{
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
class CheckboxRequiredValidator extends RequiredValidator {
    constructor() {
        super(...arguments);
        /** @internal */
        this.createValidator = (input) => requiredTrueValidator;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: CheckboxRequiredValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: CheckboxRequiredValidator, selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", host: { properties: { "attr.required": "_enabled ? \"\" : null" } }, providers: [CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { CheckboxRequiredValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: CheckboxRequiredValidator, decorators: [{
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
class EmailValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'email';
        /** @internal */
        this.normalizeInput = booleanAttribute;
        /** @internal */
        this.createValidator = (input) => emailValidator;
    }
    /** @nodoc */
    enabled(input) {
        return input;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: EmailValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: EmailValidator, selector: "[email][formControlName],[email][formControl],[email][ngModel]", inputs: { email: "email" }, providers: [EMAIL_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { EmailValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: EmailValidator, decorators: [{
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
class MinLengthValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'minlength';
        /** @internal */
        this.normalizeInput = (input) => toInteger(input);
        /** @internal */
        this.createValidator = (minlength) => minLengthValidator(minlength);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MinLengthValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: MinLengthValidator, selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", inputs: { minlength: "minlength" }, host: { properties: { "attr.minlength": "_enabled ? minlength : null" } }, providers: [MIN_LENGTH_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { MinLengthValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MinLengthValidator, decorators: [{
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
class MaxLengthValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'maxlength';
        /** @internal */
        this.normalizeInput = (input) => toInteger(input);
        /** @internal */
        this.createValidator = (maxlength) => maxLengthValidator(maxlength);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MaxLengthValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: MaxLengthValidator, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: { maxlength: "maxlength" }, host: { properties: { "attr.maxlength": "_enabled ? maxlength : null" } }, providers: [MAX_LENGTH_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { MaxLengthValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: MaxLengthValidator, decorators: [{
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
class PatternValidator extends AbstractValidatorDirective {
    constructor() {
        super(...arguments);
        /** @internal */
        this.inputName = 'pattern';
        /** @internal */
        this.normalizeInput = (input) => input;
        /** @internal */
        this.createValidator = (input) => patternValidator(input);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: PatternValidator, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.2+sha-7567348", type: PatternValidator, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: { pattern: "pattern" }, host: { properties: { "attr.pattern": "_enabled ? pattern : null" } }, providers: [PATTERN_VALIDATOR], usesInheritance: true, ngImport: i0 }); }
}
export { PatternValidator };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.2+sha-7567348", ngImport: i0, type: PatternValidator, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': '_enabled ? pattern : null' }
                }]
        }], propDecorators: { pattern: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFxQyxNQUFNLGVBQWUsQ0FBQztBQUlqSCxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFFM007Ozs7O0dBS0c7QUFDSCxTQUFTLFNBQVMsQ0FBQyxLQUFvQjtJQUNyQyxPQUFPLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsT0FBTyxDQUFDLEtBQW9CO0lBQ25DLE9BQU8sT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBMEREOzs7OztHQUtHO0FBQ0gsTUFDZSwwQkFBMEI7SUFEekM7UUFFVSxlQUFVLEdBQWdCLGFBQWEsQ0FBQztLQXVFakQ7SUFoQ0MsYUFBYTtJQUNiLFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxFQUFFO1lBQzdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxZ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c0VBQXNFO29CQUNoRixTQUFTLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDOUIsSUFBSSxFQUFFLEVBQUMsZ0JBQWdCLEVBQUUsMkJBQTJCLEVBQUM7aUJBQ3REOzhCQU9DLE9BQU87c0JBRE4sS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2Jvb2xlYW5BdHRyaWJ1dGUsIERpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgSW5wdXQsIE9uQ2hhbmdlcywgUHJvdmlkZXIsIFNpbXBsZUNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsL2Fic3RyYWN0X21vZGVsJztcbmltcG9ydCB7ZW1haWxWYWxpZGF0b3IsIG1heExlbmd0aFZhbGlkYXRvciwgbWF4VmFsaWRhdG9yLCBtaW5MZW5ndGhWYWxpZGF0b3IsIG1pblZhbGlkYXRvciwgTkdfVkFMSURBVE9SUywgbnVsbFZhbGlkYXRvciwgcGF0dGVyblZhbGlkYXRvciwgcmVxdWlyZWRUcnVlVmFsaWRhdG9yLCByZXF1aXJlZFZhbGlkYXRvcn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbi8qKlxuICogTWV0aG9kIHRoYXQgdXBkYXRlcyBzdHJpbmcgdG8gaW50ZWdlciBpZiBub3QgYWxyZWFkeSBhIG51bWJlclxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBpbnRlZ2VyLlxuICogQHJldHVybnMgdmFsdWUgb2YgcGFyYW1ldGVyIGNvbnZlcnRlZCB0byBudW1iZXIgb3IgaW50ZWdlci5cbiAqL1xuZnVuY3Rpb24gdG9JbnRlZ2VyKHZhbHVlOiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSA6IHBhcnNlSW50KHZhbHVlLCAxMCk7XG59XG5cbi8qKlxuICogTWV0aG9kIHRoYXQgZW5zdXJlcyB0aGF0IHByb3ZpZGVkIHZhbHVlIGlzIGEgZmxvYXQgKGFuZCBjb252ZXJ0cyBpdCB0byBmbG9hdCBpZiBuZWVkZWQpLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBmbG9hdC5cbiAqIEByZXR1cm5zIHZhbHVlIG9mIHBhcmFtZXRlciBjb252ZXJ0ZWQgdG8gbnVtYmVyIG9yIGZsb2F0LlxuICovXG5mdW5jdGlvbiB0b0Zsb2F0KHZhbHVlOiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgPyB2YWx1ZSA6IHBhcnNlRmxvYXQodmFsdWUpO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGVmaW5lcyB0aGUgbWFwIG9mIGVycm9ycyByZXR1cm5lZCBmcm9tIGZhaWxlZCB2YWxpZGF0aW9uIGNoZWNrcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIFZhbGlkYXRpb25FcnJvcnMgPSB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGludGVyZmFjZSBpbXBsZW1lbnRlZCBieSBjbGFzc2VzIHRoYXQgcGVyZm9ybSBzeW5jaHJvbm91cyB2YWxpZGF0aW9uLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGUgYSBjdXN0b20gdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBWYWxpZGF0b3JgIGludGVyZmFjZSB0byBjcmVhdGUgYVxuICogdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAqICAgICByZXR1cm4geydjdXN0b20nOiB0cnVlfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgcGVyZm9ybXMgc3luY2hyb25vdXMgdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBwcm92aWRlZCBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbCBUaGUgY29udHJvbCB0byB2YWxpZGF0ZSBhZ2FpbnN0LlxuICAgKlxuICAgKiBAcmV0dXJucyBBIG1hcCBvZiB2YWxpZGF0aW9uIGVycm9ycyBpZiB2YWxpZGF0aW9uIGZhaWxzLFxuICAgKiBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgdmFsaWRhdG9yIGlucHV0cyBjaGFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U/KGZuOiAoKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuLyoqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIFZhbGlkYXRvci1iYXNlZCBEaXJlY3RpdmVzLiBUaGUgY2xhc3MgY29udGFpbnMgY29tbW9uIGxvZ2ljIHNoYXJlZCBhY3Jvc3Mgc3VjaFxuICogRGlyZWN0aXZlcy5cbiAqXG4gKiBGb3IgaW50ZXJuYWwgdXNlIG9ubHksIHRoaXMgY2xhc3MgaXMgbm90IGludGVuZGVkIGZvciB1c2Ugb3V0c2lkZSBvZiB0aGUgRm9ybXMgcGFja2FnZS5cbiAqL1xuQERpcmVjdGl2ZSgpXG5hYnN0cmFjdCBjbGFzcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIFZhbGlkYXRvciwgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiA9IG51bGxWYWxpZGF0b3I7XG4gIHByaXZhdGUgX29uQ2hhbmdlITogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQSBmbGFnIHRoYXQgdHJhY2tzIHdoZXRoZXIgdGhpcyB2YWxpZGF0b3IgaXMgZW5hYmxlZC5cbiAgICpcbiAgICogTWFya2luZyBpdCBgaW50ZXJuYWxgICh2cyBgcHJvdGVjdGVkYCksIHNvIHRoYXQgdGhpcyBmbGFnIGNhbiBiZSB1c2VkIGluIGhvc3QgYmluZGluZ3Mgb2ZcbiAgICogZGlyZWN0aXZlIGNsYXNzZXMgdGhhdCBleHRlbmQgdGhpcyBiYXNlIGNsYXNzLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9lbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogTmFtZSBvZiBhbiBpbnB1dCB0aGF0IG1hdGNoZXMgZGlyZWN0aXZlIHNlbGVjdG9yIGF0dHJpYnV0ZSAoZS5nLiBgbWlubGVuZ3RoYCBmb3JcbiAgICogYE1pbkxlbmd0aERpcmVjdGl2ZWApLiBBbiBpbnB1dCB3aXRoIGEgZ2l2ZW4gbmFtZSBtaWdodCBjb250YWluIGNvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb24gKGxpa2VcbiAgICogYG1pbmxlbmd0aD0nMTAnYCkgb3IgYSBmbGFnIHRoYXQgaW5kaWNhdGVzIHdoZXRoZXIgdmFsaWRhdG9yIHNob3VsZCBiZSBlbmFibGVkIChsaWtlXG4gICAqIGBbcmVxdWlyZWRdPSdmYWxzZSdgKS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBhYnN0cmFjdCBpbnB1dE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBhIHZhbGlkYXRvciAoc3BlY2lmaWMgdG8gYSBkaXJlY3RpdmUgdGhhdCBleHRlbmRzIHRoaXMgYmFzZSBjbGFzcykuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgYWJzdHJhY3QgY3JlYXRlVmFsaWRhdG9yKGlucHV0OiB1bmtub3duKTogVmFsaWRhdG9yRm47XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgaW5wdXQgbm9ybWFsaXphdGlvbiBiYXNlZCBvbiBhIHNwZWNpZmljIGxvZ2ljIG9mIGEgRGlyZWN0aXZlLlxuICAgKiBGb3IgZXhhbXBsZSwgdGhlIGZ1bmN0aW9uIG1pZ2h0IGJlIHVzZWQgdG8gY29udmVydCBzdHJpbmctYmFzZWQgcmVwcmVzZW50YXRpb24gb2YgdGhlXG4gICAqIGBtaW5sZW5ndGhgIGlucHV0IHRvIGFuIGludGVnZXIgdmFsdWUgdGhhdCBjYW4gbGF0ZXIgYmUgdXNlZCBpbiB0aGUgYFZhbGlkYXRvcnMubWluTGVuZ3RoYFxuICAgKiB2YWxpZGF0b3IuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgYWJzdHJhY3Qgbm9ybWFsaXplSW5wdXQoaW5wdXQ6IHVua25vd24pOiB1bmtub3duO1xuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlucHV0TmFtZSBpbiBjaGFuZ2VzKSB7XG4gICAgICBjb25zdCBpbnB1dCA9IHRoaXMubm9ybWFsaXplSW5wdXQoY2hhbmdlc1t0aGlzLmlucHV0TmFtZV0uY3VycmVudFZhbHVlKTtcbiAgICAgIHRoaXMuX2VuYWJsZWQgPSB0aGlzLmVuYWJsZWQoaW5wdXQpO1xuICAgICAgdGhpcy5fdmFsaWRhdG9yID0gdGhpcy5fZW5hYmxlZCA/IHRoaXMuY3JlYXRlVmFsaWRhdG9yKGlucHV0KSA6IG51bGxWYWxpZGF0b3I7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjb250cm9sKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERldGVybWluZXMgd2hldGhlciB0aGlzIHZhbGlkYXRvciBzaG91bGQgYmUgYWN0aXZlIG9yIG5vdCBiYXNlZCBvbiBhbiBpbnB1dC5cbiAgICogQmFzZSBjbGFzcyBpbXBsZW1lbnRhdGlvbiBjaGVja3Mgd2hldGhlciBhbiBpbnB1dCBpcyBkZWZpbmVkIChpZiB0aGUgdmFsdWUgaXMgZGlmZmVyZW50IGZyb21cbiAgICogYG51bGxgIGFuZCBgdW5kZWZpbmVkYCkuIFZhbGlkYXRvciBjbGFzc2VzIHRoYXQgZXh0ZW5kIHRoaXMgYmFzZSBjbGFzcyBjYW4gb3ZlcnJpZGUgdGhpc1xuICAgKiBmdW5jdGlvbiB3aXRoIHRoZSBsb2dpYyBzcGVjaWZpYyB0byBhIHBhcnRpY3VsYXIgdmFsaWRhdG9yIGRpcmVjdGl2ZS5cbiAgICovXG4gIGVuYWJsZWQoaW5wdXQ6IHVua25vd24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5wdXQgIT0gbnVsbCAvKiBib3RoIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgKi87XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1heFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgTUFYX1ZBTElEQVRPUjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1heFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSB7QGxpbmsgTWF4VmFsaWRhdG9yfSBmb3IgYW55IGBmb3JtQ29udHJvbE5hbWVgLFxuICogYGZvcm1Db250cm9sYCwgb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1heGAgYXR0cmlidXRlLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIG1heCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1heCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgdHlwZT1cIm51bWJlclwiIG5nTW9kZWwgbWF4PVwiNFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXRbdHlwZT1udW1iZXJdW21heF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPW51bWJlcl1bbWF4XVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1udW1iZXJdW21heF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNQVhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5tYXhdJzogJ19lbmFibGVkID8gbWF4IDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1heFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgbWF4IGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KCkgbWF4ITogc3RyaW5nfG51bWJlcnxudWxsO1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGlucHV0TmFtZSA9ICdtYXgnO1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gKGlucHV0OiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyID0+IHRvRmxvYXQoaW5wdXQpO1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGNyZWF0ZVZhbGlkYXRvciA9IChtYXg6IG51bWJlcik6IFZhbGlkYXRvckZuID0+IG1heFZhbGlkYXRvcihtYXgpO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWluVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBNSU5fVkFMSURBVE9SOiBQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWluVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgd2hpY2ggaW5zdGFsbHMgdGhlIHtAbGluayBNaW5WYWxpZGF0b3J9IGZvciBhbnkgYGZvcm1Db250cm9sTmFtZWAsXG4gKiBgZm9ybUNvbnRyb2xgLCBvciBjb250cm9sIHdpdGggYG5nTW9kZWxgIHRoYXQgYWxzbyBoYXMgYSBgbWluYCBhdHRyaWJ1dGUuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWluIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgbWluIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCB0eXBlPVwibnVtYmVyXCIgbmdNb2RlbCBtaW49XCI0XCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9bnVtYmVyXVttaW5dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPW51bWJlcl1bbWluXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01JTl9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLm1pbl0nOiAnX2VuYWJsZWQgPyBtaW4gOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgTWluVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBtaW4gYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKSBtaW4hOiBzdHJpbmd8bnVtYmVyfG51bGw7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgaW5wdXROYW1lID0gJ21pbic7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgbm9ybWFsaXplSW5wdXQgPSAoaW5wdXQ6IHN0cmluZ3xudW1iZXIpOiBudW1iZXIgPT4gdG9GbG9hdChpbnB1dCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlVmFsaWRhdG9yID0gKG1pbjogbnVtYmVyKTogVmFsaWRhdG9yRm4gPT4gbWluVmFsaWRhdG9yKG1pbik7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBbiBpbnRlcmZhY2UgaW1wbGVtZW50ZWQgYnkgY2xhc3NlcyB0aGF0IHBlcmZvcm0gYXN5bmNocm9ub3VzIHZhbGlkYXRpb24uXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBBc3luY1ZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhblxuICogYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21Bc3luY1ZhbGlkYXRvcl0nLFxuICogICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTkdfQVNZTkNfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTpcbiAqIHRydWV9XVxuICogfSlcbiAqIGNsYXNzIEN1c3RvbUFzeW5jVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgQXN5bmNWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD4ge1xuICogICAgIHJldHVybiBvZih7J2N1c3RvbSc6IHRydWV9KTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yIGV4dGVuZHMgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIFRoZSBjb250cm9sIHRvIHZhbGlkYXRlIGFnYWluc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgcHJvbWlzZSBvciBvYnNlcnZhYmxlIHRoYXQgcmVzb2x2ZXMgYSBtYXAgb2YgdmFsaWRhdGlvbiBlcnJvcnNcbiAgICogaWYgdmFsaWRhdGlvbiBmYWlscywgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOlxuICAgICAgUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+fE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPjtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFJlcXVpcmVkVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBSRVFVSVJFRF9WQUxJREFUT1I6IFByb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SOiBQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGFueSBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIHJlcXVpcmVkIHZhbGlkYXRvciB1c2luZyB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXNcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCBuYW1lPVwiZnVsbE5hbWVcIiBuZ01vZGVsIHJlcXVpcmVkPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtSRVFVSVJFRF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnJlcXVpcmVkXSc6ICdfZW5hYmxlZCA/IFwiXCIgOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUmVxdWlyZWRWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIGNoYW5nZXMgdG8gdGhlIHJlcXVpcmVkIGF0dHJpYnV0ZSBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpIHJlcXVpcmVkITogYm9vbGVhbnxzdHJpbmc7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAncmVxdWlyZWQnO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgbm9ybWFsaXplSW5wdXQgPSBib29sZWFuQXR0cmlidXRlO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0OiBib29sZWFuKTogVmFsaWRhdG9yRm4gPT4gcmVxdWlyZWRWYWxpZGF0b3I7XG5cbiAgLyoqIEBub2RvYyAqL1xuICBvdmVycmlkZSBlbmFibGVkKGlucHV0OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG59XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGNoZWNrYm94IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcmVxdWlyZWQgY2hlY2tib3ggdmFsaWRhdG9yIHVzaW5nIHRlbXBsYXRlLWRyaXZlbiBmb3Jtc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgY2hlY2tib3ggcmVxdWlyZWQgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImFjdGl2ZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucmVxdWlyZWRdJzogJ19lbmFibGVkID8gXCJcIiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgUmVxdWlyZWRWYWxpZGF0b3Ige1xuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIGNyZWF0ZVZhbGlkYXRvciA9IChpbnB1dDogdW5rbm93bik6IFZhbGlkYXRvckZuID0+IHJlcXVpcmVkVHJ1ZVZhbGlkYXRvcjtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYEVtYWlsVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBFTUFJTF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRW1haWxWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGBlbWFpbGAgdmFsaWRhdG9yIHRvIGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYGVtYWlsYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogVGhlIGVtYWlsIHZhbGlkYXRpb24gaXMgYmFzZWQgb24gdGhlIFdIQVRXRyBIVE1MIHNwZWNpZmljYXRpb24gd2l0aCBzb21lIGVuaGFuY2VtZW50cyB0b1xuICogaW5jb3Jwb3JhdGUgbW9yZSBSRkMgcnVsZXMuIE1vcmUgaW5mb3JtYXRpb24gY2FuIGJlIGZvdW5kIG9uIHRoZSBbVmFsaWRhdG9ycy5lbWFpbFxuICogcGFnZV0oYXBpL2Zvcm1zL1ZhbGlkYXRvcnMjZW1haWwpLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhbiBlbWFpbCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhbiBlbWFpbCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW4gbmdNb2RlbFxuICogYmluZGluZy5cbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgZW1haWw9XCJ0cnVlXCI+XG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBbZW1haWxdPVwidHJ1ZVwiPlxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZW1haWxdW2Zvcm1Db250cm9sTmFtZV0sW2VtYWlsXVtmb3JtQ29udHJvbF0sW2VtYWlsXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0VNQUlMX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgRW1haWxWYWxpZGF0b3IgZXh0ZW5kcyBBYnN0cmFjdFZhbGlkYXRvckRpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIGNoYW5nZXMgdG8gdGhlIGVtYWlsIGF0dHJpYnV0ZSBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpIGVtYWlsITogYm9vbGVhbnxzdHJpbmc7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnZW1haWwnO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgbm9ybWFsaXplSW5wdXQgPSBib29sZWFuQXR0cmlidXRlO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0OiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBlbWFpbFZhbGlkYXRvcjtcblxuICAvKiogQG5vZG9jICovXG4gIG92ZXJyaWRlIGVuYWJsZWQoaW5wdXQ6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gaW5wdXQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIGNvbnRyb2wgYW5kIHN5bmNocm9ub3VzbHkgcmV0dXJucyBhIG1hcCBvZlxuICogdmFsaWRhdGlvbiBlcnJvcnMgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvckZuIHtcbiAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIGNvbnRyb2wgYW5kIHJldHVybnMgYSBQcm9taXNlIG9yIG9ic2VydmFibGVcbiAqIHRoYXQgZW1pdHMgdmFsaWRhdGlvbiBlcnJvcnMgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yRm4ge1xuICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+fE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPjtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1pbkxlbmd0aFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgTUlOX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWluTGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIG1pbmltdW0gbGVuZ3RoIHZhbGlkYXRpb24gdG8gY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgbWlubGVuZ3RoYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWluaW11bSBsZW5ndGggdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBtaW5pbXVtIGxlbmd0aCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgbmFtZT1cImZpcnN0TmFtZVwiIG5nTW9kZWwgbWlubGVuZ3RoPVwiNFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWlubGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttaW5sZW5ndGhdW2Zvcm1Db250cm9sXSxbbWlubGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01JTl9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5taW5sZW5ndGhdJzogJ19lbmFibGVkID8gbWlubGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1pbkxlbmd0aFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgbWluaW11bSBsZW5ndGggYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKSBtaW5sZW5ndGghOiBzdHJpbmd8bnVtYmVyfG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnbWlubGVuZ3RoJztcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gKGlucHV0OiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyID0+IHRvSW50ZWdlcihpbnB1dCk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAobWlubGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBtaW5MZW5ndGhWYWxpZGF0b3IobWlubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYE1heExlbmd0aFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgTUFYX0xFTkdUSF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTWF4TGVuZ3RoVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIG1heCBsZW5ndGggdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtYXhpbXVtIGxlbmd0aCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1heGltdW0gbGVuZ3RoIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBuYW1lPVwiZmlyc3ROYW1lXCIgbmdNb2RlbCBtYXhsZW5ndGg9XCIyNVwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttYXhsZW5ndGhdW2Zvcm1Db250cm9sXSxbbWF4bGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01BWF9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5tYXhsZW5ndGhdJzogJ19lbmFibGVkID8gbWF4bGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1heExlbmd0aFZhbGlkYXRvciBleHRlbmRzIEFic3RyYWN0VmFsaWRhdG9yRGlyZWN0aXZlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgbWluaW11bSBsZW5ndGggYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKSBtYXhsZW5ndGghOiBzdHJpbmd8bnVtYmVyfG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBpbnB1dE5hbWUgPSAnbWF4bGVuZ3RoJztcblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUlucHV0ID0gKGlucHV0OiBzdHJpbmd8bnVtYmVyKTogbnVtYmVyID0+IHRvSW50ZWdlcihpbnB1dCk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBjcmVhdGVWYWxpZGF0b3IgPSAobWF4bGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiA9PiBtYXhMZW5ndGhWYWxpZGF0b3IobWF4bGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFBhdHRlcm5WYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IFBBVFRFUk5fVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBhdHRlcm5WYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHJlZ2V4IHBhdHRlcm4gdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBwYXR0ZXJuYCBhdHRyaWJ1dGUuIFRoZSByZWdleCBtdXN0IG1hdGNoIHRoZSBlbnRpcmUgY29udHJvbCB2YWx1ZS5cbiAqIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcGF0dGVybiB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIHBhdHRlcm4gdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IG5hbWU9XCJmaXJzdE5hbWVcIiBuZ01vZGVsIHBhdHRlcm49XCJbYS16QS1aIF0qXCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twYXR0ZXJuXVtmb3JtQ29udHJvbE5hbWVdLFtwYXR0ZXJuXVtmb3JtQ29udHJvbF0sW3BhdHRlcm5dW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUEFUVEVSTl9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnBhdHRlcm5dJzogJ19lbmFibGVkID8gcGF0dGVybiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBQYXR0ZXJuVmFsaWRhdG9yIGV4dGVuZHMgQWJzdHJhY3RWYWxpZGF0b3JEaXJlY3RpdmUge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBwYXR0ZXJuIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KClcbiAgcGF0dGVybiE6IHN0cmluZ3xSZWdFeHA7ICAvLyBUaGlzIGlucHV0IGlzIGFsd2F5cyBkZWZpbmVkLCBzaW5jZSB0aGUgbmFtZSBtYXRjaGVzIHNlbGVjdG9yLlxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgaW5wdXROYW1lID0gJ3BhdHRlcm4nO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgbm9ybWFsaXplSW5wdXQgPSAoaW5wdXQ6IHN0cmluZ3xSZWdFeHApOiBzdHJpbmd8UmVnRXhwID0+IGlucHV0O1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgY3JlYXRlVmFsaWRhdG9yID0gKGlucHV0OiBzdHJpbmd8UmVnRXhwKTogVmFsaWRhdG9yRm4gPT4gcGF0dGVyblZhbGlkYXRvcihpbnB1dCk7XG59XG4iXX0=