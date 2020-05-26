/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validators } from '../validators';
import * as i0 from "@angular/core";
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
let RequiredValidator = /** @class */ (() => {
    class RequiredValidator {
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
         * @description
         * Method that validates whether the control is empty.
         * Returns the validation result if enabled, otherwise null.
         */
        validate(control) {
            return this.required ? Validators.required(control) : null;
        }
        /**
         * @description
         * Registers a callback function to call when the validator inputs change.
         *
         * @param fn The callback function
         */
        registerOnValidatorChange(fn) {
            this._onChange = fn;
        }
    }
    RequiredValidator.ɵfac = function RequiredValidator_Factory(t) { return new (t || RequiredValidator)(); };
    RequiredValidator.ɵdir = i0.ɵɵdefineDirective({ type: RequiredValidator, selectors: [["", "required", "", "formControlName", "", 3, "type", "checkbox"], ["", "required", "", "formControl", "", 3, "type", "checkbox"], ["", "required", "", "ngModel", "", 3, "type", "checkbox"]], hostVars: 1, hostBindings: function RequiredValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("required", ctx.required ? "" : null);
        } }, inputs: { required: "required" }, features: [i0.ɵɵProvidersFeature([REQUIRED_VALIDATOR])] });
    return RequiredValidator;
})();
export { RequiredValidator };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RequiredValidator, [{
        type: Directive,
        args: [{
                selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                providers: [REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required ? "" : null' }
            }]
    }], null, { required: [{
            type: Input
        }] }); })();
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
let CheckboxRequiredValidator = /** @class */ (() => {
    class CheckboxRequiredValidator extends RequiredValidator {
        /**
         * @description
         * Method that validates whether or not the checkbox has been checked.
         * Returns the validation result if enabled, otherwise null.
         */
        validate(control) {
            return this.required ? Validators.requiredTrue(control) : null;
        }
    }
    CheckboxRequiredValidator.ɵfac = function CheckboxRequiredValidator_Factory(t) { return ɵCheckboxRequiredValidator_BaseFactory(t || CheckboxRequiredValidator); };
    CheckboxRequiredValidator.ɵdir = i0.ɵɵdefineDirective({ type: CheckboxRequiredValidator, selectors: [["input", "type", "checkbox", "required", "", "formControlName", ""], ["input", "type", "checkbox", "required", "", "formControl", ""], ["input", "type", "checkbox", "required", "", "ngModel", ""]], hostVars: 1, hostBindings: function CheckboxRequiredValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("required", ctx.required ? "" : null);
        } }, features: [i0.ɵɵProvidersFeature([CHECKBOX_REQUIRED_VALIDATOR]), i0.ɵɵInheritDefinitionFeature] });
    return CheckboxRequiredValidator;
})();
export { CheckboxRequiredValidator };
const ɵCheckboxRequiredValidator_BaseFactory = i0.ɵɵgetInheritedFactory(CheckboxRequiredValidator);
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CheckboxRequiredValidator, [{
        type: Directive,
        args: [{
                selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                providers: [CHECKBOX_REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required ? "" : null' }
            }]
    }], null, null); })();
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
let EmailValidator = /** @class */ (() => {
    class EmailValidator {
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
         * @description
         * Method that validates whether an email address is valid.
         * Returns the validation result if enabled, otherwise null.
         */
        validate(control) {
            return this._enabled ? Validators.email(control) : null;
        }
        /**
         * @description
         * Registers a callback function to call when the validator inputs change.
         *
         * @param fn The callback function
         */
        registerOnValidatorChange(fn) {
            this._onChange = fn;
        }
    }
    EmailValidator.ɵfac = function EmailValidator_Factory(t) { return new (t || EmailValidator)(); };
    EmailValidator.ɵdir = i0.ɵɵdefineDirective({ type: EmailValidator, selectors: [["", "email", "", "formControlName", ""], ["", "email", "", "formControl", ""], ["", "email", "", "ngModel", ""]], inputs: { email: "email" }, features: [i0.ɵɵProvidersFeature([EMAIL_VALIDATOR])] });
    return EmailValidator;
})();
export { EmailValidator };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(EmailValidator, [{
        type: Directive,
        args: [{
                selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                providers: [EMAIL_VALIDATOR]
            }]
    }], null, { email: [{
            type: Input
        }] }); })();
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
let MinLengthValidator = /** @class */ (() => {
    class MinLengthValidator {
        /**
         * @description
         * A lifecycle method called when the directive's inputs change. For internal use
         * only.
         *
         * @param changes A object of key/value pairs for the set of changed inputs.
         */
        ngOnChanges(changes) {
            if ('minlength' in changes) {
                this._createValidator();
                if (this._onChange)
                    this._onChange();
            }
        }
        /**
         * @description
         * Method that validates whether the value meets a minimum length
         * requirement. Returns the validation result if enabled, otherwise null.
         */
        validate(control) {
            return this.minlength == null ? null : this._validator(control);
        }
        /**
         * @description
         * Registers a callback function to call when the validator inputs change.
         *
         * @param fn The callback function
         */
        registerOnValidatorChange(fn) {
            this._onChange = fn;
        }
        _createValidator() {
            this._validator = Validators.minLength(typeof this.minlength === 'number' ? this.minlength : parseInt(this.minlength, 10));
        }
    }
    MinLengthValidator.ɵfac = function MinLengthValidator_Factory(t) { return new (t || MinLengthValidator)(); };
    MinLengthValidator.ɵdir = i0.ɵɵdefineDirective({ type: MinLengthValidator, selectors: [["", "minlength", "", "formControlName", ""], ["", "minlength", "", "formControl", ""], ["", "minlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function MinLengthValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("minlength", ctx.minlength ? ctx.minlength : null);
        } }, inputs: { minlength: "minlength" }, features: [i0.ɵɵProvidersFeature([MIN_LENGTH_VALIDATOR]), i0.ɵɵNgOnChangesFeature] });
    return MinLengthValidator;
})();
export { MinLengthValidator };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MinLengthValidator, [{
        type: Directive,
        args: [{
                selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                providers: [MIN_LENGTH_VALIDATOR],
                host: { '[attr.minlength]': 'minlength ? minlength : null' }
            }]
    }], null, { minlength: [{
            type: Input
        }] }); })();
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
let MaxLengthValidator = /** @class */ (() => {
    class MaxLengthValidator {
        /**
         * @description
         * A lifecycle method called when the directive's inputs change. For internal use
         * only.
         *
         * @param changes A object of key/value pairs for the set of changed inputs.
         */
        ngOnChanges(changes) {
            if ('maxlength' in changes) {
                this._createValidator();
                if (this._onChange)
                    this._onChange();
            }
        }
        /**
         * @description
         * Method that validates whether the value exceeds
         * the maximum length requirement.
         */
        validate(control) {
            return this.maxlength != null ? this._validator(control) : null;
        }
        /**
         * @description
         * Registers a callback function to call when the validator inputs change.
         *
         * @param fn The callback function
         */
        registerOnValidatorChange(fn) {
            this._onChange = fn;
        }
        _createValidator() {
            this._validator = Validators.maxLength(typeof this.maxlength === 'number' ? this.maxlength : parseInt(this.maxlength, 10));
        }
    }
    MaxLengthValidator.ɵfac = function MaxLengthValidator_Factory(t) { return new (t || MaxLengthValidator)(); };
    MaxLengthValidator.ɵdir = i0.ɵɵdefineDirective({ type: MaxLengthValidator, selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function MaxLengthValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("maxlength", ctx.maxlength ? ctx.maxlength : null);
        } }, inputs: { maxlength: "maxlength" }, features: [i0.ɵɵProvidersFeature([MAX_LENGTH_VALIDATOR]), i0.ɵɵNgOnChangesFeature] });
    return MaxLengthValidator;
})();
export { MaxLengthValidator };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MaxLengthValidator, [{
        type: Directive,
        args: [{
                selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                providers: [MAX_LENGTH_VALIDATOR],
                host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
            }]
    }], null, { maxlength: [{
            type: Input
        }] }); })();
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
let PatternValidator = /** @class */ (() => {
    class PatternValidator {
        /**
         * @description
         * A lifecycle method called when the directive's inputs change. For internal use
         * only.
         *
         * @param changes A object of key/value pairs for the set of changed inputs.
         */
        ngOnChanges(changes) {
            if ('pattern' in changes) {
                this._createValidator();
                if (this._onChange)
                    this._onChange();
            }
        }
        /**
         * @description
         * Method that validates whether the value matches the
         * the pattern requirement.
         */
        validate(control) {
            return this._validator(control);
        }
        /**
         * @description
         * Registers a callback function to call when the validator inputs change.
         *
         * @param fn The callback function
         */
        registerOnValidatorChange(fn) {
            this._onChange = fn;
        }
        _createValidator() {
            this._validator = Validators.pattern(this.pattern);
        }
    }
    PatternValidator.ɵfac = function PatternValidator_Factory(t) { return new (t || PatternValidator)(); };
    PatternValidator.ɵdir = i0.ɵɵdefineDirective({ type: PatternValidator, selectors: [["", "pattern", "", "formControlName", ""], ["", "pattern", "", "formControl", ""], ["", "pattern", "", "ngModel", ""]], hostVars: 1, hostBindings: function PatternValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("pattern", ctx.pattern ? ctx.pattern : null);
        } }, inputs: { pattern: "pattern" }, features: [i0.ɵɵProvidersFeature([PATTERN_VALIDATOR]), i0.ɵɵNgOnChangesFeature] });
    return PatternValidator;
})();
export { PatternValidator };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(PatternValidator, [{
        type: Directive,
        args: [{
                selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                providers: [PATTERN_VALIDATOR],
                host: { '[attr.pattern]': 'pattern ? pattern : null' }
            }]
    }], null, { pattern: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUEyQyxNQUFNLGVBQWUsQ0FBQztBQUlyRyxPQUFPLEVBQUMsYUFBYSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFxR3hEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFtQjtJQUNoRCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLDJCQUEyQixHQUFtQjtJQUN6RCxPQUFPLEVBQUUsYUFBYTtJQUN0QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUdGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSDtJQUFBLE1BTWEsaUJBQWlCO1FBTTVCOzs7V0FHRztRQUNILElBQ0ksUUFBUTtZQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBSSxRQUFRLENBQUMsS0FBcUI7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEVBQUUsS0FBSyxPQUFPLENBQUM7WUFDNUUsSUFBSSxJQUFJLENBQUMsU0FBUztnQkFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDdkMsQ0FBQztRQUVEOzs7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Y0FMNUIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSxzRUFBc0U7Z0JBQ2hGLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO2dCQUM5QixJQUFJLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSwwQkFBMEIsRUFBQzthQUNyRDs7a0JBWUUsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIGZvcndhcmRSZWYsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIFN0YXRpY1Byb3ZpZGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7QWJzdHJhY3RDb250cm9sfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge05HX1ZBTElEQVRPUlMsIFZhbGlkYXRvcnN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEZWZpbmVzIHRoZSBtYXAgb2YgZXJyb3JzIHJldHVybmVkIGZyb20gZmFpbGVkIHZhbGlkYXRpb24gY2hlY2tzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgVmFsaWRhdGlvbkVycm9ycyA9IHtcbiAgW2tleTogc3RyaW5nXTogYW55XG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQW4gaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IGNsYXNzZXMgdGhhdCBwZXJmb3JtIHN5bmNocm9ub3VzIHZhbGlkYXRpb24uXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW1wbGVtZW50cyB0aGUgYFZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhXG4gKiB2YWxpZGF0b3IgZGlyZWN0aXZlIHdpdGggYSBjdXN0b20gZXJyb3Iga2V5LlxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b21WYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICogICAgIHJldHVybiB7J2N1c3RvbSc6IHRydWV9O1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBwZXJmb3JtcyBzeW5jaHJvbm91cyB2YWxpZGF0aW9uIGFnYWluc3QgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIFRoZSBjb250cm9sIHRvIHZhbGlkYXRlIGFnYWluc3QuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgbWFwIG9mIHZhbGlkYXRpb24gZXJyb3JzIGlmIHZhbGlkYXRpb24gZmFpbHMsXG4gICAqIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSB2YWxpZGF0b3IgaW5wdXRzIGNoYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZT8oZm46ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQW4gaW50ZXJmYWNlIGltcGxlbWVudGVkIGJ5IGNsYXNzZXMgdGhhdCBwZXJmb3JtIGFzeW5jaHJvbm91cyB2YWxpZGF0aW9uLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGUgYSBjdXN0b20gYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbXBsZW1lbnRzIHRoZSBgQXN5bmNWYWxpZGF0b3JgIGludGVyZmFjZSB0byBjcmVhdGUgYW5cbiAqIGFzeW5jIHZhbGlkYXRvciBkaXJlY3RpdmUgd2l0aCBhIGN1c3RvbSBlcnJvciBrZXkuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tQXN5bmNWYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX0FTWU5DX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSwgbXVsdGk6XG4gKiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFzeW5jVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogT2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+IHtcbiAqICAgICByZXR1cm4gb2YoeydjdXN0b20nOiB0cnVlfSk7XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3luY1ZhbGlkYXRvciBleHRlbmRzIFZhbGlkYXRvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgcGVyZm9ybXMgYXN5bmMgdmFsaWRhdGlvbiBhZ2FpbnN0IHRoZSBwcm92aWRlZCBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbCBUaGUgY29udHJvbCB0byB2YWxpZGF0ZSBhZ2FpbnN0LlxuICAgKlxuICAgKiBAcmV0dXJucyBBIHByb21pc2Ugb3Igb2JzZXJ2YWJsZSB0aGF0IHJlc29sdmVzIGEgbWFwIG9mIHZhbGlkYXRpb24gZXJyb3JzXG4gICAqIGlmIHZhbGlkYXRpb24gZmFpbHMsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTpcbiAgICAgIFByb21pc2U8VmFsaWRhdGlvbkVycm9yc3xudWxsPnxPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD47XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBSZXF1aXJlZFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgUkVRVUlSRURfVkFMSURBVE9SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmVxdWlyZWRWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IENIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBhbnkgY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSByZXF1aXJlZCB2YWxpZGF0b3IgdXNpbmcgdGVtcGxhdGUtZHJpdmVuIGZvcm1zXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgbmFtZT1cImZ1bGxOYW1lXCIgbmdNb2RlbCByZXF1aXJlZD5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJzpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW2Zvcm1Db250cm9sXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUkVRVUlSRURfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5yZXF1aXJlZF0nOiAncmVxdWlyZWQgPyBcIlwiIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIFJlcXVpcmVkVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3JlcXVpcmVkITogYm9vbGVhbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlITogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSByZXF1aXJlZCBhdHRyaWJ1dGUgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgcmVxdWlyZWQoKTogYm9vbGVhbnxzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlZDtcbiAgfVxuXG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbnxzdHJpbmcpIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IGZhbHNlICYmIGAke3ZhbHVlfWAgIT09ICdmYWxzZSc7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgd2hldGhlciB0aGUgY29udHJvbCBpcyBlbXB0eS5cbiAgICogUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaWYgZW5hYmxlZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgdmFsaWRhdG9yIGlucHV0cyBjaGFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICB9XG59XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGByZXF1aXJlZGAgdmFsaWRhdG9yIHRvIGNoZWNrYm94IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcmVxdWlyZWQgY2hlY2tib3ggdmFsaWRhdG9yIHVzaW5nIHRlbXBsYXRlLWRyaXZlbiBmb3Jtc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgY2hlY2tib3ggcmVxdWlyZWQgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImFjdGl2ZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucmVxdWlyZWRdJzogJ3JlcXVpcmVkID8gXCJcIiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgUmVxdWlyZWRWYWxpZGF0b3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgY2hlY2tib3ggaGFzIGJlZW4gY2hlY2tlZC5cbiAgICogUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaWYgZW5hYmxlZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gVmFsaWRhdG9ycy5yZXF1aXJlZFRydWUoY29udHJvbCkgOiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBFbWFpbFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgRU1BSUxfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEVtYWlsVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgZW1haWxgIHZhbGlkYXRvciB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBlbWFpbGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhbiBlbWFpbCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhbiBlbWFpbCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW4gbmdNb2RlbFxuICogYmluZGluZy5cbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgZW1haWw9XCJ0cnVlXCI+XG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBbZW1haWxdPVwidHJ1ZVwiPlxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZW1haWxdW2Zvcm1Db250cm9sTmFtZV0sW2VtYWlsXVtmb3JtQ29udHJvbF0sW2VtYWlsXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0VNQUlMX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgRW1haWxWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfZW5hYmxlZCE6IGJvb2xlYW47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSE6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgZW1haWwgYXR0cmlidXRlIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGVtYWlsKHZhbHVlOiBib29sZWFufHN0cmluZykge1xuICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09ICd0cnVlJztcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyB3aGV0aGVyIGFuIGVtYWlsIGFkZHJlc3MgaXMgdmFsaWQuXG4gICAqIFJldHVybnMgdGhlIHZhbGlkYXRpb24gcmVzdWx0IGlmIGVuYWJsZWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZCA/IFZhbGlkYXRvcnMuZW1haWwoY29udHJvbCkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgY29udHJvbCBhbmQgc3luY2hyb25vdXNseSByZXR1cm5zIGEgbWFwIG9mXG4gKiB2YWxpZGF0aW9uIGVycm9ycyBpZiBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmFsaWRhdG9yRm4ge1xuICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgY29udHJvbCBhbmQgcmV0dXJucyBhIFByb21pc2Ugb3Igb2JzZXJ2YWJsZVxuICogdGhhdCBlbWl0cyB2YWxpZGF0aW9uIGVycm9ycyBpZiBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNWYWxpZGF0b3JGbiB7XG4gIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBQcm9taXNlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD58T2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+O1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWluTGVuZ3RoVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBNSU5fTEVOR1RIX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNaW5MZW5ndGhWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgbWluaW11bSBsZW5ndGggdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBtaW5sZW5ndGhgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBZGRpbmcgYSBtaW5pbXVtIGxlbmd0aCB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIG1pbmltdW0gbGVuZ3RoIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBuYW1lPVwiZmlyc3ROYW1lXCIgbmdNb2RlbCBtaW5sZW5ndGg9XCI0XCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttaW5sZW5ndGhdW2Zvcm1Db250cm9sTmFtZV0sW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xdLFttaW5sZW5ndGhdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbTUlOX0xFTkdUSF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLm1pbmxlbmd0aF0nOiAnbWlubGVuZ3RoID8gbWlubGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1pbkxlbmd0aFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvciwgT25DaGFuZ2VzIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3ZhbGlkYXRvciE6IFZhbGlkYXRvckZuO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UhOiAoKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIGNoYW5nZXMgdG8gdGhlIHRoZSBtaW5pbXVtIGxlbmd0aCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBtaW5sZW5ndGghOiBzdHJpbmd8bnVtYmVyO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMgY2hhbmdlLiBGb3IgaW50ZXJuYWwgdXNlXG4gICAqIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSBjaGFuZ2VzIEEgb2JqZWN0IG9mIGtleS92YWx1ZSBwYWlycyBmb3IgdGhlIHNldCBvZiBjaGFuZ2VkIGlucHV0cy5cbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ21pbmxlbmd0aCcgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgd2hldGhlciB0aGUgdmFsdWUgbWVldHMgYSBtaW5pbXVtIGxlbmd0aFxuICAgKiByZXF1aXJlbWVudC4gUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaWYgZW5hYmxlZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLm1pbmxlbmd0aCA9PSBudWxsID8gbnVsbCA6IHRoaXMuX3ZhbGlkYXRvcihjb250cm9sKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSB2YWxpZGF0b3IgaW5wdXRzIGNoYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVWYWxpZGF0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW5MZW5ndGgoXG4gICAgICAgIHR5cGVvZiB0aGlzLm1pbmxlbmd0aCA9PT0gJ251bWJlcicgPyB0aGlzLm1pbmxlbmd0aCA6IHBhcnNlSW50KHRoaXMubWlubGVuZ3RoLCAxMCkpO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNYXhMZW5ndGhWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BWF9MRU5HVEhfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1heExlbmd0aFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyBtYXggbGVuZ3RoIHZhbGlkYXRpb24gdG8gY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgbWF4bGVuZ3RoYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWF4aW11bSBsZW5ndGggdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBtYXhpbXVtIGxlbmd0aCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgbmFtZT1cImZpcnN0TmFtZVwiIG5nTW9kZWwgbWF4bGVuZ3RoPVwiMjVcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21heGxlbmd0aF1bZm9ybUNvbnRyb2xOYW1lXSxbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbF0sW21heGxlbmd0aF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtNQVhfTEVOR1RIX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIubWF4bGVuZ3RoXSc6ICdtYXhsZW5ndGggPyBtYXhsZW5ndGggOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgTWF4TGVuZ3RoVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yLCBPbkNoYW5nZXMge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yITogVmFsaWRhdG9yRm47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSE6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgdGhlIG1heGltdW0gbGVuZ3RoIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG1heGxlbmd0aCE6IHN0cmluZ3xudW1iZXI7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGRpcmVjdGl2ZSdzIGlucHV0cyBjaGFuZ2UuIEZvciBpbnRlcm5hbCB1c2VcbiAgICogb25seS5cbiAgICpcbiAgICogQHBhcmFtIGNoYW5nZXMgQSBvYmplY3Qgb2Yga2V5L3ZhbHVlIHBhaXJzIGZvciB0aGUgc2V0IG9mIGNoYW5nZWQgaW5wdXRzLlxuICAgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgnbWF4bGVuZ3RoJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jcmVhdGVWYWxpZGF0b3IoKTtcbiAgICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyB3aGV0aGVyIHRoZSB2YWx1ZSBleGNlZWRzXG4gICAqIHRoZSBtYXhpbXVtIGxlbmd0aCByZXF1aXJlbWVudC5cbiAgICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubWF4bGVuZ3RoICE9IG51bGwgPyB0aGlzLl92YWxpZGF0b3IoY29udHJvbCkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1heExlbmd0aChcbiAgICAgICAgdHlwZW9mIHRoaXMubWF4bGVuZ3RoID09PSAnbnVtYmVyJyA/IHRoaXMubWF4bGVuZ3RoIDogcGFyc2VJbnQodGhpcy5tYXhsZW5ndGgsIDEwKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFBhdHRlcm5WYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IFBBVFRFUk5fVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBhdHRlcm5WYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHJlZ2V4IHBhdHRlcm4gdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBwYXR0ZXJuYCBhdHRyaWJ1dGUuIFRoZSByZWdleCBtdXN0IG1hdGNoIHRoZSBlbnRpcmUgY29udHJvbCB2YWx1ZS5cbiAqIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgcGF0dGVybiB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGFkZCBhIHBhdHRlcm4gdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IG5hbWU9XCJmaXJzdE5hbWVcIiBuZ01vZGVsIHBhdHRlcm49XCJbYS16QS1aIF0qXCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1twYXR0ZXJuXVtmb3JtQ29udHJvbE5hbWVdLFtwYXR0ZXJuXVtmb3JtQ29udHJvbF0sW3BhdHRlcm5dW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUEFUVEVSTl9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnBhdHRlcm5dJzogJ3BhdHRlcm4gPyBwYXR0ZXJuIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIFBhdHRlcm5WYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3IsIE9uQ2hhbmdlcyB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF92YWxpZGF0b3IhOiBWYWxpZGF0b3JGbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlITogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBwYXR0ZXJuIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIHBhdHRlcm4hOiBzdHJpbmd8UmVnRXhwO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMgY2hhbmdlLiBGb3IgaW50ZXJuYWwgdXNlXG4gICAqIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSBjaGFuZ2VzIEEgb2JqZWN0IG9mIGtleS92YWx1ZSBwYWlycyBmb3IgdGhlIHNldCBvZiBjaGFuZ2VkIGlucHV0cy5cbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ3BhdHRlcm4nIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVZhbGlkYXRvcigpO1xuICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHdoZXRoZXIgdGhlIHZhbHVlIG1hdGNoZXMgdGhlXG4gICAqIHRoZSBwYXR0ZXJuIHJlcXVpcmVtZW50LlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fdmFsaWRhdG9yKGNvbnRyb2wpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5wYXR0ZXJuKTtcbiAgfVxufVxuIl19