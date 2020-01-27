import { __extends } from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, forwardRef } from '@angular/core';
import { NG_VALIDATORS, Validators } from '../validators';
import * as i0 from "@angular/core";
/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export var REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return RequiredValidator; }),
    multi: true
};
/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export var CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return CheckboxRequiredValidator; }),
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
var RequiredValidator = /** @class */ (function () {
    function RequiredValidator() {
    }
    Object.defineProperty(RequiredValidator.prototype, "required", {
        /**
         * @description
         * Tracks changes to the required attribute bound to this directive.
         */
        get: function () { return this._required; },
        set: function (value) {
            this._required = value != null && value !== false && "" + value !== 'false';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description
     * Method that validates whether the control is empty.
     * Returns the validation result if enabled, otherwise null.
     */
    RequiredValidator.prototype.validate = function (control) {
        return this.required ? Validators.required(control) : null;
    };
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    RequiredValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    RequiredValidator.ɵfac = function RequiredValidator_Factory(t) { return new (t || RequiredValidator)(); };
    RequiredValidator.ɵdir = i0.ɵɵdefineDirective({ type: RequiredValidator, selectors: [["", "required", "", "formControlName", "", 3, "type", "checkbox"], ["", "required", "", "formControl", "", 3, "type", "checkbox"], ["", "required", "", "ngModel", "", 3, "type", "checkbox"]], hostVars: 1, hostBindings: function RequiredValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("required", ctx.required ? "" : null);
        } }, inputs: { required: "required" }, features: [i0.ɵɵProvidersFeature([REQUIRED_VALIDATOR])] });
    return RequiredValidator;
}());
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
 * The following example shows how to add a checkbox required validator to an input attached to an ngModel binding.
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var CheckboxRequiredValidator = /** @class */ (function (_super) {
    __extends(CheckboxRequiredValidator, _super);
    function CheckboxRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @description
     * Method that validates whether or not the checkbox has been checked.
     * Returns the validation result if enabled, otherwise null.
     */
    CheckboxRequiredValidator.prototype.validate = function (control) {
        return this.required ? Validators.requiredTrue(control) : null;
    };
    CheckboxRequiredValidator.ɵfac = function CheckboxRequiredValidator_Factory(t) { return ɵCheckboxRequiredValidator_BaseFactory(t || CheckboxRequiredValidator); };
    CheckboxRequiredValidator.ɵdir = i0.ɵɵdefineDirective({ type: CheckboxRequiredValidator, selectors: [["input", "type", "checkbox", "required", "", "formControlName", ""], ["input", "type", "checkbox", "required", "", "formControl", ""], ["input", "type", "checkbox", "required", "", "ngModel", ""]], hostVars: 1, hostBindings: function CheckboxRequiredValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("required", ctx.required ? "" : null);
        } }, features: [i0.ɵɵProvidersFeature([CHECKBOX_REQUIRED_VALIDATOR]), i0.ɵɵInheritDefinitionFeature] });
    return CheckboxRequiredValidator;
}(RequiredValidator));
export { CheckboxRequiredValidator };
var ɵCheckboxRequiredValidator_BaseFactory = i0.ɵɵgetInheritedFactory(CheckboxRequiredValidator);
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
export var EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return EmailValidator; }),
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
 * The following example shows how to add an email validator to an input attached to an ngModel binding.
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
var EmailValidator = /** @class */ (function () {
    function EmailValidator() {
    }
    Object.defineProperty(EmailValidator.prototype, "email", {
        /**
         * @description
         * Tracks changes to the email attribute bound to this directive.
         */
        set: function (value) {
            this._enabled = value === '' || value === true || value === 'true';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description
     * Method that validates whether an email address is valid.
     * Returns the validation result if enabled, otherwise null.
     */
    EmailValidator.prototype.validate = function (control) {
        return this._enabled ? Validators.email(control) : null;
    };
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    EmailValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    EmailValidator.ɵfac = function EmailValidator_Factory(t) { return new (t || EmailValidator)(); };
    EmailValidator.ɵdir = i0.ɵɵdefineDirective({ type: EmailValidator, selectors: [["", "email", "", "formControlName", ""], ["", "email", "", "formControl", ""], ["", "email", "", "ngModel", ""]], inputs: { email: "email" }, features: [i0.ɵɵProvidersFeature([EMAIL_VALIDATOR])] });
    return EmailValidator;
}());
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
export var MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MinLengthValidator; }),
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
var MinLengthValidator = /** @class */ (function () {
    function MinLengthValidator() {
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    MinLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    /**
     * @description
     * Method that validates whether the value meets a minimum length
     * requirement. Returns the validation result if enabled, otherwise null.
     */
    MinLengthValidator.prototype.validate = function (control) {
        return this.minlength == null ? null : this._validator(control);
    };
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    MinLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MinLengthValidator.prototype._createValidator = function () {
        this._validator = Validators.minLength(typeof this.minlength === 'number' ? this.minlength : parseInt(this.minlength, 10));
    };
    MinLengthValidator.ɵfac = function MinLengthValidator_Factory(t) { return new (t || MinLengthValidator)(); };
    MinLengthValidator.ɵdir = i0.ɵɵdefineDirective({ type: MinLengthValidator, selectors: [["", "minlength", "", "formControlName", ""], ["", "minlength", "", "formControl", ""], ["", "minlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function MinLengthValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("minlength", ctx.minlength ? ctx.minlength : null);
        } }, inputs: { minlength: "minlength" }, features: [i0.ɵɵProvidersFeature([MIN_LENGTH_VALIDATOR]), i0.ɵɵNgOnChangesFeature()] });
    return MinLengthValidator;
}());
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
export var MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MaxLengthValidator; }),
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
var MaxLengthValidator = /** @class */ (function () {
    function MaxLengthValidator() {
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    MaxLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    /**
     * @description
     * Method that validates whether the value exceeds
     * the maximum length requirement.
     */
    MaxLengthValidator.prototype.validate = function (control) {
        return this.maxlength != null ? this._validator(control) : null;
    };
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    MaxLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MaxLengthValidator.prototype._createValidator = function () {
        this._validator = Validators.maxLength(typeof this.maxlength === 'number' ? this.maxlength : parseInt(this.maxlength, 10));
    };
    MaxLengthValidator.ɵfac = function MaxLengthValidator_Factory(t) { return new (t || MaxLengthValidator)(); };
    MaxLengthValidator.ɵdir = i0.ɵɵdefineDirective({ type: MaxLengthValidator, selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function MaxLengthValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("maxlength", ctx.maxlength ? ctx.maxlength : null);
        } }, inputs: { maxlength: "maxlength" }, features: [i0.ɵɵProvidersFeature([MAX_LENGTH_VALIDATOR]), i0.ɵɵNgOnChangesFeature()] });
    return MaxLengthValidator;
}());
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
export var PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return PatternValidator; }),
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
var PatternValidator = /** @class */ (function () {
    function PatternValidator() {
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    PatternValidator.prototype.ngOnChanges = function (changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    /**
     * @description
     * Method that validates whether the value matches the
     * the pattern requirement.
     */
    PatternValidator.prototype.validate = function (control) { return this._validator(control); };
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    PatternValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    PatternValidator.prototype._createValidator = function () { this._validator = Validators.pattern(this.pattern); };
    PatternValidator.ɵfac = function PatternValidator_Factory(t) { return new (t || PatternValidator)(); };
    PatternValidator.ɵdir = i0.ɵɵdefineDirective({ type: PatternValidator, selectors: [["", "pattern", "", "formControlName", ""], ["", "pattern", "", "formControl", ""], ["", "pattern", "", "ngModel", ""]], hostVars: 1, hostBindings: function PatternValidator_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("pattern", ctx.pattern ? ctx.pattern : null);
        } }, inputs: { pattern: "pattern" }, features: [i0.ɵɵProvidersFeature([PATTERN_VALIDATOR]), i0.ɵɵNgOnChangesFeature()] });
    return PatternValidator;
}());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUE0QyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJckcsT0FBTyxFQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBcUd4RDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsSUFBTSxrQkFBa0IsR0FBbUI7SUFDaEQsT0FBTyxFQUFFLGFBQWE7SUFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsaUJBQWlCLEVBQWpCLENBQWlCLENBQUM7SUFDaEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLElBQU0sMkJBQTJCLEdBQW1CO0lBQ3pELE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLHlCQUF5QixFQUF6QixDQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUdGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSDtJQUFBO0tBd0NDO0lBeEJDLHNCQUNJLHVDQUFRO1FBTFo7OztXQUdHO2FBQ0gsY0FDaUMsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzthQUV6RCxVQUFhLEtBQXFCO1lBQ2hDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLElBQUksSUFBSSxLQUFLLEtBQUssS0FBSyxJQUFJLEtBQUcsS0FBTyxLQUFLLE9BQU8sQ0FBQztZQUM1RSxJQUFJLElBQUksQ0FBQyxTQUFTO2dCQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QyxD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MkNBQWdCLEdBQXhCLGNBQW1DLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29GQTNDN0UsZ0JBQWdCO3lEQUFoQixnQkFBZ0I7OzhFQUhoQixDQUFDLGlCQUFpQixDQUFDOzJCQXJoQmhDO0NBb2tCQyxBQWpERCxJQWlEQztTQTVDWSxnQkFBZ0I7a0RBQWhCLGdCQUFnQjtjQUw1QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNFQUFzRTtnQkFDaEYsU0FBUyxFQUFFLENBQUMsaUJBQWlCLENBQUM7Z0JBQzlCLElBQUksRUFBRSxFQUFDLGdCQUFnQixFQUFFLDBCQUEwQixFQUFDO2FBQ3JEOztrQkFhRSxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgU3RhdGljUHJvdmlkZXIsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7TkdfVkFMSURBVE9SUywgVmFsaWRhdG9yc30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERlZmluZXMgdGhlIG1hcCBvZiBlcnJvcnMgcmV0dXJuZWQgZnJvbSBmYWlsZWQgdmFsaWRhdGlvbiBjaGVja3MuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBWYWxpZGF0aW9uRXJyb3JzID0ge1xuICBba2V5OiBzdHJpbmddOiBhbnlcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBbiBpbnRlcmZhY2UgaW1wbGVtZW50ZWQgYnkgY2xhc3NlcyB0aGF0IHBlcmZvcm0gc3luY2hyb25vdXMgdmFsaWRhdGlvbi5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBQcm92aWRlIGEgY3VzdG9tIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbXBsZW1lbnRzIHRoZSBgVmFsaWRhdG9yYCBpbnRlcmZhY2UgdG8gY3JlYXRlIGFcbiAqIHZhbGlkYXRvciBkaXJlY3RpdmUgd2l0aCBhIGN1c3RvbSBlcnJvciBrZXkuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnW2N1c3RvbVZhbGlkYXRvcl0nLFxuICogICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTkdfVkFMSURBVE9SUywgdXNlRXhpc3Rpbmc6IEN1c3RvbVZhbGlkYXRvckRpcmVjdGl2ZSwgbXVsdGk6IHRydWV9XVxuICogfSlcbiAqIGNsYXNzIEN1c3RvbVZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIFZhbGlkYXRvciB7XG4gKiAgIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gKiAgICAgcmV0dXJuIHsnY3VzdG9tJzogdHJ1ZX07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWYWxpZGF0b3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHBlcmZvcm1zIHN5bmNocm9ub3VzIHZhbGlkYXRpb24gYWdhaW5zdCB0aGUgcHJvdmlkZWQgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdmFsaWRhdGUgYWdhaW5zdC5cbiAgICpcbiAgICogQHJldHVybnMgQSBtYXAgb2YgdmFsaWRhdGlvbiBlcnJvcnMgaWYgdmFsaWRhdGlvbiBmYWlscyxcbiAgICogb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGw7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlPyhmbjogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBbiBpbnRlcmZhY2UgaW1wbGVtZW50ZWQgYnkgY2xhc3NlcyB0aGF0IHBlcmZvcm0gYXN5bmNocm9ub3VzIHZhbGlkYXRpb24uXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBBc3luY1ZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhblxuICogYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiBhcyBvYnNlcnZhYmxlT2YgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tQXN5bmNWYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX0FTWU5DX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSwgbXVsdGk6XG4gKiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFzeW5jVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogT2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+IHtcbiAqICAgICByZXR1cm4gb2JzZXJ2YWJsZU9mKHsnY3VzdG9tJzogdHJ1ZX0pO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNWYWxpZGF0b3IgZXh0ZW5kcyBWYWxpZGF0b3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHBlcmZvcm1zIGFzeW5jIHZhbGlkYXRpb24gYWdhaW5zdCB0aGUgcHJvdmlkZWQgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGNvbnRyb2wgdG8gdmFsaWRhdGUgYWdhaW5zdC5cbiAgICpcbiAgICogQHJldHVybnMgQSBwcm9taXNlIG9yIG9ic2VydmFibGUgdGhhdCByZXNvbHZlcyBhIG1hcCBvZiB2YWxpZGF0aW9uIGVycm9yc1xuICAgKiBpZiB2YWxpZGF0aW9uIGZhaWxzLCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6XG4gICAgICBQcm9taXNlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD58T2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+O1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgUmVxdWlyZWRWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IFJFUVVJUkVEX1ZBTElEQVRPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBDSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHJlcXVpcmVkYCB2YWxpZGF0b3IgdG8gYW55IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHJlcXVpcmVkYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKiBcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBcbiAqICMjIyBBZGRpbmcgYSByZXF1aXJlZCB2YWxpZGF0b3IgdXNpbmcgdGVtcGxhdGUtZHJpdmVuIGZvcm1zXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgbmFtZT1cImZ1bGxOYW1lXCIgbmdNb2RlbCByZXF1aXJlZD5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJzpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW2Zvcm1Db250cm9sXSw6bm90KFt0eXBlPWNoZWNrYm94XSlbcmVxdWlyZWRdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbUkVRVUlSRURfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5yZXF1aXJlZF0nOiAncmVxdWlyZWQgPyBcIlwiIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIFJlcXVpcmVkVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3JlcXVpcmVkICE6IGJvb2xlYW47XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF9vbkNoYW5nZSAhOiAoKSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIGNoYW5nZXMgdG8gdGhlIHJlcXVpcmVkIGF0dHJpYnV0ZSBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlZCgpOiBib29sZWFufHN0cmluZyB7IHJldHVybiB0aGlzLl9yZXF1aXJlZDsgfVxuXG4gIHNldCByZXF1aXJlZCh2YWx1ZTogYm9vbGVhbnxzdHJpbmcpIHtcbiAgICB0aGlzLl9yZXF1aXJlZCA9IHZhbHVlICE9IG51bGwgJiYgdmFsdWUgIT09IGZhbHNlICYmIGAke3ZhbHVlfWAgIT09ICdmYWxzZSc7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCB2YWxpZGF0ZXMgd2hldGhlciB0aGUgY29udHJvbCBpcyBlbXB0eS5cbiAgICogUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaWYgZW5hYmxlZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgdmFsaWRhdG9yIGlucHV0cyBjaGFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxufVxuXG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBjaGVja2JveCBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGByZXF1aXJlZGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICogXG4gKiBAc2VlIFtGb3JtIFZhbGlkYXRpb25dKGd1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogXG4gKiAjIyMgQWRkaW5nIGEgcmVxdWlyZWQgY2hlY2tib3ggdmFsaWRhdG9yIHVzaW5nIHRlbXBsYXRlLWRyaXZlbiBmb3Jtc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgY2hlY2tib3ggcmVxdWlyZWQgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuIG5nTW9kZWwgYmluZGluZy5cbiAqIFxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImFjdGl2ZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9Y2hlY2tib3hdW3JlcXVpcmVkXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0NIRUNLQk9YX1JFUVVJUkVEX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucmVxdWlyZWRdJzogJ3JlcXVpcmVkID8gXCJcIiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yIGV4dGVuZHMgUmVxdWlyZWRWYWxpZGF0b3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyB3aGV0aGVyIG9yIG5vdCB0aGUgY2hlY2tib3ggaGFzIGJlZW4gY2hlY2tlZC5cbiAgICogUmV0dXJucyB0aGUgdmFsaWRhdGlvbiByZXN1bHQgaWYgZW5hYmxlZCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gVmFsaWRhdG9ycy5yZXF1aXJlZFRydWUoY29udHJvbCkgOiBudWxsO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBFbWFpbFZhbGlkYXRvcmAgdG8gdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICovXG5leHBvcnQgY29uc3QgRU1BSUxfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEVtYWlsVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgZW1haWxgIHZhbGlkYXRvciB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBlbWFpbGAgYXR0cmlidXRlLiBUaGUgZGlyZWN0aXZlIGlzIHByb3ZpZGVkIHdpdGggdGhlIGBOR19WQUxJREFUT1JTYCBtdWx0aS1wcm92aWRlciBsaXN0LlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBcbiAqICMjIyBBZGRpbmcgYW4gZW1haWwgdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYW4gZW1haWwgdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuIG5nTW9kZWwgYmluZGluZy5cbiAqIFxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBlbWFpbD5cbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPVwidHJ1ZVwiPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgW2VtYWlsXT1cInRydWVcIj5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW2VtYWlsXVtmb3JtQ29udHJvbE5hbWVdLFtlbWFpbF1bZm9ybUNvbnRyb2xdLFtlbWFpbF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtFTUFJTF9WQUxJREFUT1JdXG59KVxuZXhwb3J0IGNsYXNzIEVtYWlsVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX2VuYWJsZWQgITogYm9vbGVhbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlICE6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgZW1haWwgYXR0cmlidXRlIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGVtYWlsKHZhbHVlOiBib29sZWFufHN0cmluZykge1xuICAgIHRoaXMuX2VuYWJsZWQgPSB2YWx1ZSA9PT0gJycgfHwgdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09ICd0cnVlJztcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyB3aGV0aGVyIGFuIGVtYWlsIGFkZHJlc3MgaXMgdmFsaWQuXG4gICAqIFJldHVybnMgdGhlIHZhbGlkYXRpb24gcmVzdWx0IGlmIGVuYWJsZWQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fZW5hYmxlZCA/IFZhbGlkYXRvcnMuZW1haWwoY29udHJvbCkgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyBhIGNvbnRyb2wgYW5kIHN5bmNocm9ub3VzbHkgcmV0dXJucyBhIG1hcCBvZlxuICogdmFsaWRhdGlvbiBlcnJvcnMgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvckZuIHsgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDsgfVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIGEgY29udHJvbCBhbmQgcmV0dXJucyBhIFByb21pc2Ugb3Igb2JzZXJ2YWJsZVxuICogdGhhdCBlbWl0cyB2YWxpZGF0aW9uIGVycm9ycyBpZiBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXN5bmNWYWxpZGF0b3JGbiB7XG4gIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBQcm9taXNlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD58T2JzZXJ2YWJsZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+O1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWluTGVuZ3RoVmFsaWRhdG9yYCB0byB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKi9cbmV4cG9ydCBjb25zdCBNSU5fTEVOR1RIX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNaW5MZW5ndGhWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGFkZHMgbWluaW11bSBsZW5ndGggdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBtaW5sZW5ndGhgIGF0dHJpYnV0ZS4gVGhlIGRpcmVjdGl2ZSBpcyBwcm92aWRlZCB3aXRoIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqIFxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXShndWlkZS9mb3JtLXZhbGlkYXRpb24pXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWRkaW5nIGEgbWluaW11bSBsZW5ndGggdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBtaW5pbXVtIGxlbmd0aCB2YWxpZGF0b3IgdG8gYW4gaW5wdXQgYXR0YWNoZWQgdG8gYW5cbiAqIG5nTW9kZWwgYmluZGluZy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgbmFtZT1cImZpcnN0TmFtZVwiIG5nTW9kZWwgbWlubGVuZ3RoPVwiNFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWlubGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttaW5sZW5ndGhdW2Zvcm1Db250cm9sXSxbbWlubGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01JTl9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5taW5sZW5ndGhdJzogJ21pbmxlbmd0aCA/IG1pbmxlbmd0aCA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBNaW5MZW5ndGhWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3IsXG4gICAgT25DaGFuZ2VzIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3ZhbGlkYXRvciAhOiBWYWxpZGF0b3JGbjtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX29uQ2hhbmdlICE6ICgpID0+IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgY2hhbmdlcyB0byB0aGUgdGhlIG1pbmltdW0gbGVuZ3RoIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG1pbmxlbmd0aCAhOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGRpcmVjdGl2ZSdzIGlucHV0cyBjaGFuZ2UuIEZvciBpbnRlcm5hbCB1c2VcbiAgICogb25seS5cbiAgICpcbiAgICogQHBhcmFtIGNoYW5nZXMgQSBvYmplY3Qgb2Yga2V5L3ZhbHVlIHBhaXJzIGZvciB0aGUgc2V0IG9mIGNoYW5nZWQgaW5wdXRzLlxuICAgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgnbWlubGVuZ3RoJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jcmVhdGVWYWxpZGF0b3IoKTtcbiAgICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHZhbGlkYXRlcyB3aGV0aGVyIHRoZSB2YWx1ZSBtZWV0cyBhIG1pbmltdW0gbGVuZ3RoXG4gICAqIHJlcXVpcmVtZW50LiBSZXR1cm5zIHRoZSB2YWxpZGF0aW9uIHJlc3VsdCBpZiBlbmFibGVkLCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubWlubGVuZ3RoID09IG51bGwgPyBudWxsIDogdGhpcy5fdmFsaWRhdG9yKGNvbnRyb2wpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIHZhbGlkYXRvciBpbnB1dHMgY2hhbmdlLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICBwcml2YXRlIF9jcmVhdGVWYWxpZGF0b3IoKTogdm9pZCB7XG4gICAgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW5MZW5ndGgoXG4gICAgICAgIHR5cGVvZiB0aGlzLm1pbmxlbmd0aCA9PT0gJ251bWJlcicgPyB0aGlzLm1pbmxlbmd0aCA6IHBhcnNlSW50KHRoaXMubWlubGVuZ3RoLCAxMCkpO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNYXhMZW5ndGhWYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BWF9MRU5HVEhfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1heExlbmd0aFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgYWRkcyBtYXggbGVuZ3RoIHZhbGlkYXRpb24gdG8gY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgbWF4bGVuZ3RoYCBhdHRyaWJ1dGUuIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKiBcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIG1heGltdW0gbGVuZ3RoIHZhbGlkYXRvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gYWRkIGEgbWF4aW11bSBsZW5ndGggdmFsaWRhdG9yIHRvIGFuIGlucHV0IGF0dGFjaGVkIHRvIGFuXG4gKiBuZ01vZGVsIGJpbmRpbmcuXG4gKlxuICogYGBgaHRtbFxuICogPGlucHV0IG5hbWU9XCJmaXJzdE5hbWVcIiBuZ01vZGVsIG1heGxlbmd0aD1cIjI1XCI+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXhsZW5ndGhdW2Zvcm1Db250cm9sTmFtZV0sW21heGxlbmd0aF1bZm9ybUNvbnRyb2xdLFttYXhsZW5ndGhdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbTUFYX0xFTkdUSF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLm1heGxlbmd0aF0nOiAnbWF4bGVuZ3RoID8gbWF4bGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1heExlbmd0aFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvcixcbiAgICBPbkNoYW5nZXMge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yICE6IFZhbGlkYXRvckZuO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgITogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSB0aGUgbWF4aW11bSBsZW5ndGggYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgbWF4bGVuZ3RoICE6IHN0cmluZyB8IG51bWJlcjtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEEgbGlmZWN5Y2xlIG1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXRzIGNoYW5nZS4gRm9yIGludGVybmFsIHVzZVxuICAgKiBvbmx5LlxuICAgKlxuICAgKiBAcGFyYW0gY2hhbmdlcyBBIG9iamVjdCBvZiBrZXkvdmFsdWUgcGFpcnMgZm9yIHRoZSBzZXQgb2YgY2hhbmdlZCBpbnB1dHMuXG4gICAqL1xuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCdtYXhsZW5ndGgnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVZhbGlkYXRvcigpO1xuICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHdoZXRoZXIgdGhlIHZhbHVlIGV4Y2VlZHNcbiAgICogdGhlIG1heGltdW0gbGVuZ3RoIHJlcXVpcmVtZW50LlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5tYXhsZW5ndGggIT0gbnVsbCA/IHRoaXMuX3ZhbGlkYXRvcihjb250cm9sKSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGNhbGwgd2hlbiB0aGUgdmFsaWRhdG9yIGlucHV0cyBjaGFuZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1heExlbmd0aChcbiAgICAgICAgdHlwZW9mIHRoaXMubWF4bGVuZ3RoID09PSAnbnVtYmVyJyA/IHRoaXMubWF4bGVuZ3RoIDogcGFyc2VJbnQodGhpcy5tYXhsZW5ndGgsIDEwKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYFBhdHRlcm5WYWxpZGF0b3JgIHRvIHRoZSBgTkdfVkFMSURBVE9SU2AgbXVsdGktcHJvdmlkZXIgbGlzdC5cbiAqL1xuZXhwb3J0IGNvbnN0IFBBVFRFUk5fVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFBhdHRlcm5WYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBhZGRzIHJlZ2V4IHBhdHRlcm4gdmFsaWRhdGlvbiB0byBjb250cm9scyBtYXJrZWQgd2l0aCB0aGVcbiAqIGBwYXR0ZXJuYCBhdHRyaWJ1dGUuIFRoZSByZWdleCBtdXN0IG1hdGNoIHRoZSBlbnRpcmUgY29udHJvbCB2YWx1ZS5cbiAqIFRoZSBkaXJlY3RpdmUgaXMgcHJvdmlkZWQgd2l0aCB0aGUgYE5HX1ZBTElEQVRPUlNgIG11bHRpLXByb3ZpZGVyIGxpc3QuXG4gKiBcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFkZGluZyBhIHBhdHRlcm4gdmFsaWRhdG9yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBhZGQgYSBwYXR0ZXJuIHZhbGlkYXRvciB0byBhbiBpbnB1dCBhdHRhY2hlZCB0byBhblxuICogbmdNb2RlbCBiaW5kaW5nLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxpbnB1dCBuYW1lPVwiZmlyc3ROYW1lXCIgbmdNb2RlbCBwYXR0ZXJuPVwiW2EtekEtWiBdKlwiPlxuICogYGBgXG4gKiBcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3BhdHRlcm5dW2Zvcm1Db250cm9sTmFtZV0sW3BhdHRlcm5dW2Zvcm1Db250cm9sXSxbcGF0dGVybl1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtQQVRURVJOX1ZBTElEQVRPUl0sXG4gIGhvc3Q6IHsnW2F0dHIucGF0dGVybl0nOiAncGF0dGVybiA/IHBhdHRlcm4gOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUGF0dGVyblZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvcixcbiAgICBPbkNoYW5nZXMge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfdmFsaWRhdG9yICE6IFZhbGlkYXRvckZuO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgITogKCkgPT4gdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyBjaGFuZ2VzIHRvIHRoZSBwYXR0ZXJuIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIHBhdHRlcm4gITogc3RyaW5nIHwgUmVnRXhwO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMgY2hhbmdlLiBGb3IgaW50ZXJuYWwgdXNlXG4gICAqIG9ubHkuXG4gICAqXG4gICAqIEBwYXJhbSBjaGFuZ2VzIEEgb2JqZWN0IG9mIGtleS92YWx1ZSBwYWlycyBmb3IgdGhlIHNldCBvZiBjaGFuZ2VkIGlucHV0cy5cbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoJ3BhdHRlcm4nIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVZhbGlkYXRvcigpO1xuICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgdmFsaWRhdGVzIHdoZXRoZXIgdGhlIHZhbHVlIG1hdGNoZXMgdGhlXG4gICAqIHRoZSBwYXR0ZXJuIHJlcXVpcmVtZW50LlxuICAgKi9cbiAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHsgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjb250cm9sKTsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2FsbCB3aGVuIHRoZSB2YWxpZGF0b3IgaW5wdXRzIGNoYW5nZS5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlVmFsaWRhdG9yKCk6IHZvaWQgeyB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLnBhdHRlcm4odGhpcy5wYXR0ZXJuKTsgfVxufVxuIl19