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
export var REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return RequiredValidator; }),
    multi: true
};
export var CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return CheckboxRequiredValidator; }),
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
var RequiredValidator = /** @class */ (function () {
    function RequiredValidator() {
    }
    Object.defineProperty(RequiredValidator.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) {
            this._required = value != null && value !== false && "" + value !== 'false';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    RequiredValidator.prototype.validate = function (c) {
        return this.required ? Validators.required(c) : null;
    };
    RequiredValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    RequiredValidator.decorators = [
        { type: Directive, args: [{
                    selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                    providers: [REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required ? "" : null' }
                },] }
    ];
    /** @nocollapse */
    RequiredValidator.ctorParameters = function () { return []; };
    RequiredValidator.propDecorators = {
        "required": [{ type: Input },],
    };
    return RequiredValidator;
}());
export { RequiredValidator };
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
 * @experimental
 */
var CheckboxRequiredValidator = /** @class */ (function (_super) {
    tslib_1.__extends(CheckboxRequiredValidator, _super);
    function CheckboxRequiredValidator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckboxRequiredValidator.prototype.validate = function (c) {
        return this.required ? Validators.requiredTrue(c) : null;
    };
    CheckboxRequiredValidator.decorators = [
        { type: Directive, args: [{
                    selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                    providers: [CHECKBOX_REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required ? "" : null' }
                },] }
    ];
    /** @nocollapse */
    CheckboxRequiredValidator.ctorParameters = function () { return []; };
    return CheckboxRequiredValidator;
}(RequiredValidator));
export { CheckboxRequiredValidator };
/**
 * Provider which adds `EmailValidator` to `NG_VALIDATORS`.
 */
export var EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return EmailValidator; }),
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
 * @experimental
 */
var EmailValidator = /** @class */ (function () {
    function EmailValidator() {
    }
    Object.defineProperty(EmailValidator.prototype, "email", {
        set: function (value) {
            this._enabled = value === '' || value === true || value === 'true';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    EmailValidator.prototype.validate = function (c) {
        return this._enabled ? Validators.email(c) : null;
    };
    EmailValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    EmailValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                    providers: [EMAIL_VALIDATOR]
                },] }
    ];
    /** @nocollapse */
    EmailValidator.ctorParameters = function () { return []; };
    EmailValidator.propDecorators = {
        "email": [{ type: Input },],
    };
    return EmailValidator;
}());
export { EmailValidator };
/**
 * Provider which adds `MinLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
export var MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MinLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the `MinLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 *
 */
var MinLengthValidator = /** @class */ (function () {
    function MinLengthValidator() {
    }
    MinLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MinLengthValidator.prototype.validate = function (c) {
        return this.minlength == null ? null : this._validator(c);
    };
    MinLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MinLengthValidator.prototype._createValidator = function () {
        this._validator = Validators.minLength(parseInt(this.minlength, 10));
    };
    MinLengthValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                    providers: [MIN_LENGTH_VALIDATOR],
                    host: { '[attr.minlength]': 'minlength ? minlength : null' }
                },] }
    ];
    /** @nocollapse */
    MinLengthValidator.ctorParameters = function () { return []; };
    MinLengthValidator.propDecorators = {
        "minlength": [{ type: Input },],
    };
    return MinLengthValidator;
}());
export { MinLengthValidator };
/**
 * Provider which adds `MaxLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
export var MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return MaxLengthValidator; }),
    multi: true
};
/**
 * A directive which installs the `MaxLengthValidator` for any `formControlName,
 * `formControl`,
 * or control with `ngModel` that also has a `maxlength` attribute.
 *
 *
 */
var MaxLengthValidator = /** @class */ (function () {
    function MaxLengthValidator() {
    }
    MaxLengthValidator.prototype.ngOnChanges = function (changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MaxLengthValidator.prototype.validate = function (c) {
        return this.maxlength != null ? this._validator(c) : null;
    };
    MaxLengthValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    MaxLengthValidator.prototype._createValidator = function () {
        this._validator = Validators.maxLength(parseInt(this.maxlength, 10));
    };
    MaxLengthValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                    providers: [MAX_LENGTH_VALIDATOR],
                    host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
                },] }
    ];
    /** @nocollapse */
    MaxLengthValidator.ctorParameters = function () { return []; };
    MaxLengthValidator.propDecorators = {
        "maxlength": [{ type: Input },],
    };
    return MaxLengthValidator;
}());
export { MaxLengthValidator };
export var PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return PatternValidator; }),
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
var PatternValidator = /** @class */ (function () {
    function PatternValidator() {
    }
    PatternValidator.prototype.ngOnChanges = function (changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    PatternValidator.prototype.validate = function (c) { return this._validator(c); };
    PatternValidator.prototype.registerOnValidatorChange = function (fn) { this._onChange = fn; };
    PatternValidator.prototype._createValidator = function () { this._validator = Validators.pattern(this.pattern); };
    PatternValidator.decorators = [
        { type: Directive, args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': 'pattern ? pattern : null' }
                },] }
    ];
    /** @nocollapse */
    PatternValidator.ctorParameters = function () { return []; };
    PatternValidator.propDecorators = {
        "pattern": [{ type: Input },],
    };
    return PatternValidator;
}());
export { PatternValidator };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBNEMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSXJHLE9BQU8sRUFBQyxhQUFhLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBcUN4RCxNQUFNLENBQUMsSUFBTSxrQkFBa0IsR0FBbUI7SUFDaEQsT0FBTyxFQUFFLGFBQWE7SUFDdEIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsaUJBQWlCLEVBQWpCLENBQWlCLENBQUM7SUFDaEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUYsTUFBTSxDQUFDLElBQU0sMkJBQTJCLEdBQW1CO0lBQ3pELE9BQU8sRUFBRSxhQUFhO0lBQ3RCLFdBQVcsRUFBRSxVQUFVLENBQUMsY0FBTSxPQUFBLHlCQUF5QixFQUF6QixDQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OzswQkEwQkksdUNBQVE7MkJBQXFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO2FBRXZELFVBQWEsS0FBcUI7WUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxLQUFLLElBQUksS0FBRyxLQUFPLEtBQUssT0FBTyxDQUFDO1lBQzVFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3RDOzs7O0lBRUQsb0NBQVEsR0FBUixVQUFTLENBQWtCO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FB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QUFDLEVBQUU7O2dCQXZCekYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzRUFBc0U7b0JBQ2hGLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUM5QixJQUFJLEVBQUUsRUFBQyxnQkFBZ0IsRUFBRSwwQkFBMEIsRUFBQztpQkFDckQ7Ozs7OzRCQU1FLEtBQUs7OzJCQWhUUjs7U0EyU2EsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgU3RhdGljUHJvdmlkZXIsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7TkdfVkFMSURBVE9SUywgVmFsaWRhdG9yc30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cblxuLyoqIEBleHBlcmltZW50YWwgKi9cbmV4cG9ydCB0eXBlIFZhbGlkYXRpb25FcnJvcnMgPSB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufTtcblxuLyoqXG4gKiBBbiBpbnRlcmZhY2UgdGhhdCBjYW4gYmUgaW1wbGVtZW50ZWQgYnkgY2xhc3NlcyB0aGF0IGNhbiBhY3QgYXMgdmFsaWRhdG9ycy5cbiAqXG4gKiAjIyBVc2FnZVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b20tdmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoYzogQ29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAqICAgICByZXR1cm4ge1wiY3VzdG9tXCI6IHRydWV9O1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvciB7XG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZT8oZm46ICgpID0+IHZvaWQpOiB2b2lkO1xufVxuXG4vKiogQGV4cGVyaW1lbnRhbCAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3luY1ZhbGlkYXRvciBleHRlbmRzIFZhbGlkYXRvciB7XG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFByb21pc2U8VmFsaWRhdGlvbkVycm9yc3xudWxsPnxPYnNlcnZhYmxlPFZhbGlkYXRpb25FcnJvcnN8bnVsbD47XG59XG5cbmV4cG9ydCBjb25zdCBSRVFVSVJFRF9WQUxJREFUT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5leHBvcnQgY29uc3QgQ0hFQ0tCT1hfUkVRVUlSRURfVkFMSURBVE9SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5cbi8qKlxuICogQSBEaXJlY3RpdmUgdGhhdCBhZGRzIHRoZSBgcmVxdWlyZWRgIHZhbGlkYXRvciB0byBhbnkgY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZSwgdmlhIHRoZSBgTkdfVkFMSURBVE9SU2AgYmluZGluZy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IG5hbWU9XCJmdWxsTmFtZVwiIG5nTW9kZWwgcmVxdWlyZWQ+XG4gKiBgYGBcbiAqXG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnOm5vdChbdHlwZT1jaGVja2JveF0pW3JlcXVpcmVkXVtmb3JtQ29udHJvbE5hbWVdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bZm9ybUNvbnRyb2xdLDpub3QoW3R5cGU9Y2hlY2tib3hdKVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtSRVFVSVJFRF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnJlcXVpcmVkXSc6ICdyZXF1aXJlZCA/IFwiXCIgOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgUmVxdWlyZWRWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICBwcml2YXRlIF9yZXF1aXJlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfb25DaGFuZ2U6ICgpID0+IHZvaWQ7XG5cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVkKCk6IGJvb2xlYW58c3RyaW5nIHsgcmV0dXJuIHRoaXMuX3JlcXVpcmVkOyB9XG5cbiAgc2V0IHJlcXVpcmVkKHZhbHVlOiBib29sZWFufHN0cmluZykge1xuICAgIHRoaXMuX3JlcXVpcmVkID0gdmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSAhPT0gZmFsc2UgJiYgYCR7dmFsdWV9YCAhPT0gJ2ZhbHNlJztcbiAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gIH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnJlcXVpcmVkID8gVmFsaWRhdG9ycy5yZXF1aXJlZChjKSA6IG51bGw7XG4gIH1cblxuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cbn1cblxuXG4vKipcbiAqIEEgRGlyZWN0aXZlIHRoYXQgYWRkcyB0aGUgYHJlcXVpcmVkYCB2YWxpZGF0b3IgdG8gY2hlY2tib3ggY29udHJvbHMgbWFya2VkIHdpdGggdGhlXG4gKiBgcmVxdWlyZWRgIGF0dHJpYnV0ZSwgdmlhIHRoZSBgTkdfVkFMSURBVE9SU2AgYmluZGluZy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIG5hbWU9XCJhY3RpdmVcIiBuZ01vZGVsIHJlcXVpcmVkPlxuICogYGBgXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1jaGVja2JveF1bcmVxdWlyZWRdW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtyZXF1aXJlZF1bbmdNb2RlbF0nLFxuICBwcm92aWRlcnM6IFtDSEVDS0JPWF9SRVFVSVJFRF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLnJlcXVpcmVkXSc6ICdyZXF1aXJlZCA/IFwiXCIgOiBudWxsJ31cbn0pXG5leHBvcnQgY2xhc3MgQ2hlY2tib3hSZXF1aXJlZFZhbGlkYXRvciBleHRlbmRzIFJlcXVpcmVkVmFsaWRhdG9yIHtcbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1aXJlZCA/IFZhbGlkYXRvcnMucmVxdWlyZWRUcnVlKGMpIDogbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFByb3ZpZGVyIHdoaWNoIGFkZHMgYEVtYWlsVmFsaWRhdG9yYCB0byBgTkdfVkFMSURBVE9SU2AuXG4gKi9cbmV4cG9ydCBjb25zdCBFTUFJTF9WQUxJREFUT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMSURBVE9SUyxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRW1haWxWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGBlbWFpbGAgdmFsaWRhdG9yIHRvIGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYGVtYWlsYCBhdHRyaWJ1dGUsIHZpYSB0aGUgYE5HX1ZBTElEQVRPUlNgIGJpbmRpbmcuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBuZ01vZGVsIGVtYWlsPlxuICogPGlucHV0IHR5cGU9XCJlbWFpbFwiIG5hbWU9XCJlbWFpbFwiIG5nTW9kZWwgZW1haWw9XCJ0cnVlXCI+XG4gKiA8aW5wdXQgdHlwZT1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgbmdNb2RlbCBbZW1haWxdPVwidHJ1ZVwiPlxuICogYGBgXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZW1haWxdW2Zvcm1Db250cm9sTmFtZV0sW2VtYWlsXVtmb3JtQ29udHJvbF0sW2VtYWlsXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW0VNQUlMX1ZBTElEQVRPUl1cbn0pXG5leHBvcnQgY2xhc3MgRW1haWxWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICBwcml2YXRlIF9lbmFibGVkOiBib29sZWFuO1xuICBwcml2YXRlIF9vbkNoYW5nZTogKCkgPT4gdm9pZDtcblxuICBASW5wdXQoKVxuICBzZXQgZW1haWwodmFsdWU6IGJvb2xlYW58c3RyaW5nKSB7XG4gICAgdGhpcy5fZW5hYmxlZCA9IHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gdHJ1ZSB8fCB2YWx1ZSA9PT0gJ3RydWUnO1xuICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgfVxuXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2VuYWJsZWQgPyBWYWxpZGF0b3JzLmVtYWlsKGMpIDogbnVsbDtcbiAgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZhbGlkYXRvckZuIHsgKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDsgfVxuXG5leHBvcnQgaW50ZXJmYWNlIEFzeW5jVmFsaWRhdG9yRm4ge1xuICAoYzogQWJzdHJhY3RDb250cm9sKTogUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+fE9ic2VydmFibGU8VmFsaWRhdGlvbkVycm9yc3xudWxsPjtcbn1cblxuLyoqXG4gKiBQcm92aWRlciB3aGljaCBhZGRzIGBNaW5MZW5ndGhWYWxpZGF0b3JgIHRvIGBOR19WQUxJREFUT1JTYC5cbiAqXG4gKiAjIyBFeGFtcGxlOlxuICpcbiAqIHtAZXhhbXBsZSBjb21tb24vZm9ybXMvdHMvdmFsaWRhdG9ycy92YWxpZGF0b3JzLnRzIHJlZ2lvbj0nbWluJ31cbiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9MRU5HVEhfVkFMSURBVE9SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1pbkxlbmd0aFZhbGlkYXRvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHdoaWNoIGluc3RhbGxzIHRoZSBgTWluTGVuZ3RoVmFsaWRhdG9yYCBmb3IgYW55IGBmb3JtQ29udHJvbE5hbWVgLFxuICogYGZvcm1Db250cm9sYCwgb3IgY29udHJvbCB3aXRoIGBuZ01vZGVsYCB0aGF0IGFsc28gaGFzIGEgYG1pbmxlbmd0aGAgYXR0cmlidXRlLlxuICpcbiAqXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttaW5sZW5ndGhdW2Zvcm1Db250cm9sTmFtZV0sW21pbmxlbmd0aF1bZm9ybUNvbnRyb2xdLFttaW5sZW5ndGhdW25nTW9kZWxdJyxcbiAgcHJvdmlkZXJzOiBbTUlOX0xFTkdUSF9WQUxJREFUT1JdLFxuICBob3N0OiB7J1thdHRyLm1pbmxlbmd0aF0nOiAnbWlubGVuZ3RoID8gbWlubGVuZ3RoIDogbnVsbCd9XG59KVxuZXhwb3J0IGNsYXNzIE1pbkxlbmd0aFZhbGlkYXRvciBpbXBsZW1lbnRzIFZhbGlkYXRvcixcbiAgICBPbkNoYW5nZXMge1xuICBwcml2YXRlIF92YWxpZGF0b3I6IFZhbGlkYXRvckZuO1xuICBwcml2YXRlIF9vbkNoYW5nZTogKCkgPT4gdm9pZDtcblxuICBASW5wdXQoKSBtaW5sZW5ndGg6IHN0cmluZztcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKCdtaW5sZW5ndGgnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVZhbGlkYXRvcigpO1xuICAgICAgaWYgKHRoaXMuX29uQ2hhbmdlKSB0aGlzLl9vbkNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMubWlubGVuZ3RoID09IG51bGwgPyBudWxsIDogdGhpcy5fdmFsaWRhdG9yKGMpO1xuICB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlVmFsaWRhdG9yKCk6IHZvaWQge1xuICAgIHRoaXMuX3ZhbGlkYXRvciA9IFZhbGlkYXRvcnMubWluTGVuZ3RoKHBhcnNlSW50KHRoaXMubWlubGVuZ3RoLCAxMCkpO1xuICB9XG59XG5cbi8qKlxuICogUHJvdmlkZXIgd2hpY2ggYWRkcyBgTWF4TGVuZ3RoVmFsaWRhdG9yYCB0byBgTkdfVkFMSURBVE9SU2AuXG4gKlxuICogIyMgRXhhbXBsZTpcbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL2Zvcm1zL3RzL3ZhbGlkYXRvcnMvdmFsaWRhdG9ycy50cyByZWdpb249J21heCd9XG4gKi9cbmV4cG9ydCBjb25zdCBNQVhfTEVOR1RIX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBNYXhMZW5ndGhWYWxpZGF0b3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB3aGljaCBpbnN0YWxscyB0aGUgYE1heExlbmd0aFZhbGlkYXRvcmAgZm9yIGFueSBgZm9ybUNvbnRyb2xOYW1lLFxuICogYGZvcm1Db250cm9sYCxcbiAqIG9yIGNvbnRyb2wgd2l0aCBgbmdNb2RlbGAgdGhhdCBhbHNvIGhhcyBhIGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS5cbiAqXG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF4bGVuZ3RoXVtmb3JtQ29udHJvbE5hbWVdLFttYXhsZW5ndGhdW2Zvcm1Db250cm9sXSxbbWF4bGVuZ3RoXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW01BWF9MRU5HVEhfVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5tYXhsZW5ndGhdJzogJ21heGxlbmd0aCA/IG1heGxlbmd0aCA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBNYXhMZW5ndGhWYWxpZGF0b3IgaW1wbGVtZW50cyBWYWxpZGF0b3IsXG4gICAgT25DaGFuZ2VzIHtcbiAgcHJpdmF0ZSBfdmFsaWRhdG9yOiBWYWxpZGF0b3JGbjtcbiAgcHJpdmF0ZSBfb25DaGFuZ2U6ICgpID0+IHZvaWQ7XG5cbiAgQElucHV0KCkgbWF4bGVuZ3RoOiBzdHJpbmc7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgnbWF4bGVuZ3RoJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLl9jcmVhdGVWYWxpZGF0b3IoKTtcbiAgICAgIGlmICh0aGlzLl9vbkNoYW5nZSkgdGhpcy5fb25DaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLm1heGxlbmd0aCAhPSBudWxsID8gdGhpcy5fdmFsaWRhdG9yKGMpIDogbnVsbDtcbiAgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHtcbiAgICB0aGlzLl92YWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1heExlbmd0aChwYXJzZUludCh0aGlzLm1heGxlbmd0aCwgMTApKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBQQVRURVJOX1ZBTElEQVRPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBQYXR0ZXJuVmFsaWRhdG9yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cblxuLyoqXG4gKiBBIERpcmVjdGl2ZSB0aGF0IGFkZHMgdGhlIGBwYXR0ZXJuYCB2YWxpZGF0b3IgdG8gYW55IGNvbnRyb2xzIG1hcmtlZCB3aXRoIHRoZVxuICogYHBhdHRlcm5gIGF0dHJpYnV0ZSwgdmlhIHRoZSBgTkdfVkFMSURBVE9SU2AgYmluZGluZy4gVXNlcyBhdHRyaWJ1dGUgdmFsdWVcbiAqIGFzIHRoZSByZWdleCB0byB2YWxpZGF0ZSBDb250cm9sIHZhbHVlIGFnYWluc3QuICBGb2xsb3dzIHBhdHRlcm4gYXR0cmlidXRlXG4gKiBzZW1hbnRpY3M7IGkuZS4gcmVnZXggbXVzdCBtYXRjaCBlbnRpcmUgQ29udHJvbCB2YWx1ZS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IFtuYW1lXT1cImZ1bGxOYW1lXCIgcGF0dGVybj1cIlthLXpBLVogXSpcIiBuZ01vZGVsPlxuICogYGBgXG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbcGF0dGVybl1bZm9ybUNvbnRyb2xOYW1lXSxbcGF0dGVybl1bZm9ybUNvbnRyb2xdLFtwYXR0ZXJuXVtuZ01vZGVsXScsXG4gIHByb3ZpZGVyczogW1BBVFRFUk5fVkFMSURBVE9SXSxcbiAgaG9zdDogeydbYXR0ci5wYXR0ZXJuXSc6ICdwYXR0ZXJuID8gcGF0dGVybiA6IG51bGwnfVxufSlcbmV4cG9ydCBjbGFzcyBQYXR0ZXJuVmFsaWRhdG9yIGltcGxlbWVudHMgVmFsaWRhdG9yLFxuICAgIE9uQ2hhbmdlcyB7XG4gIHByaXZhdGUgX3ZhbGlkYXRvcjogVmFsaWRhdG9yRm47XG4gIHByaXZhdGUgX29uQ2hhbmdlOiAoKSA9PiB2b2lkO1xuXG4gIEBJbnB1dCgpIHBhdHRlcm46IHN0cmluZ3xSZWdFeHA7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmICgncGF0dGVybicgaW4gY2hhbmdlcykge1xuICAgICAgdGhpcy5fY3JlYXRlVmFsaWRhdG9yKCk7XG4gICAgICBpZiAodGhpcy5fb25DaGFuZ2UpIHRoaXMuX29uQ2hhbmdlKCk7XG4gICAgfVxuICB9XG5cbiAgdmFsaWRhdGUoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHsgcmV0dXJuIHRoaXMuX3ZhbGlkYXRvcihjKTsgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZVZhbGlkYXRvcigpOiB2b2lkIHsgdGhpcy5fdmFsaWRhdG9yID0gVmFsaWRhdG9ycy5wYXR0ZXJuKHRoaXMucGF0dGVybik7IH1cbn1cbiJdfQ==