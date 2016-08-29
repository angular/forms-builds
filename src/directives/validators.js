/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var core_1 = require('@angular/core');
var lang_1 = require('../facade/lang');
var validators_1 = require('../validators');
exports.REQUIRED_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return RequiredValidator; }),
    multi: true
};
var RequiredValidator = (function () {
    function RequiredValidator() {
    }
    Object.defineProperty(RequiredValidator.prototype, "required", {
        get: function () { return this._required; },
        set: function (value) {
            this._required = lang_1.isPresent(value) && "" + value !== 'false';
            if (this._onChange)
                this._onChange();
        },
        enumerable: true,
        configurable: true
    });
    RequiredValidator.prototype.validate = function (c) {
        return this.required ? validators_1.Validators.required(c) : null;
    };
    RequiredValidator.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    /** @nocollapse */
    RequiredValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[required][formControlName],[required][formControl],[required][ngModel]',
                    providers: [exports.REQUIRED_VALIDATOR],
                    host: { '[attr.required]': 'required? "" : null' }
                },] },
    ];
    /** @nocollapse */
    RequiredValidator.propDecorators = {
        'required': [{ type: core_1.Input },],
    };
    return RequiredValidator;
}());
exports.RequiredValidator = RequiredValidator;
/**
 * Provider which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
exports.MIN_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MinLengthValidator; }),
    multi: true
};
var MinLengthValidator = (function () {
    function MinLengthValidator() {
    }
    MinLengthValidator.prototype._createValidator = function () {
        this._validator = validators_1.Validators.minLength(parseInt(this.minlength, 10));
    };
    MinLengthValidator.prototype.ngOnChanges = function (changes) {
        if (changes['minlength']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MinLengthValidator.prototype.validate = function (c) {
        return lang_1.isPresent(this.minlength) ? this._validator(c) : null;
    };
    MinLengthValidator.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    /** @nocollapse */
    MinLengthValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                    providers: [exports.MIN_LENGTH_VALIDATOR],
                    host: { '[attr.minlength]': 'minlength? minlength : null' }
                },] },
    ];
    /** @nocollapse */
    MinLengthValidator.propDecorators = {
        'minlength': [{ type: core_1.Input },],
    };
    return MinLengthValidator;
}());
exports.MinLengthValidator = MinLengthValidator;
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
exports.MAX_LENGTH_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return MaxLengthValidator; }),
    multi: true
};
var MaxLengthValidator = (function () {
    function MaxLengthValidator() {
    }
    MaxLengthValidator.prototype._createValidator = function () {
        this._validator = validators_1.Validators.maxLength(parseInt(this.maxlength, 10));
    };
    MaxLengthValidator.prototype.ngOnChanges = function (changes) {
        if (changes['maxlength']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    MaxLengthValidator.prototype.validate = function (c) {
        return lang_1.isPresent(this.maxlength) ? this._validator(c) : null;
    };
    MaxLengthValidator.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    /** @nocollapse */
    MaxLengthValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                    providers: [exports.MAX_LENGTH_VALIDATOR],
                    host: { '[attr.maxlength]': 'maxlength? maxlength : null' }
                },] },
    ];
    /** @nocollapse */
    MaxLengthValidator.propDecorators = {
        'maxlength': [{ type: core_1.Input },],
    };
    return MaxLengthValidator;
}());
exports.MaxLengthValidator = MaxLengthValidator;
exports.PATTERN_VALIDATOR = {
    provide: validators_1.NG_VALIDATORS,
    useExisting: core_1.forwardRef(function () { return PatternValidator; }),
    multi: true
};
var PatternValidator = (function () {
    function PatternValidator() {
    }
    PatternValidator.prototype._createValidator = function () { this._validator = validators_1.Validators.pattern(this.pattern); };
    PatternValidator.prototype.ngOnChanges = function (changes) {
        if (changes['pattern']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    };
    PatternValidator.prototype.validate = function (c) {
        return lang_1.isPresent(this.pattern) ? this._validator(c) : null;
    };
    PatternValidator.prototype.registerOnChange = function (fn) { this._onChange = fn; };
    /** @nocollapse */
    PatternValidator.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                    providers: [exports.PATTERN_VALIDATOR],
                    host: { '[attr.pattern]': 'pattern? pattern : null' }
                },] },
    ];
    /** @nocollapse */
    PatternValidator.propDecorators = {
        'pattern': [{ type: core_1.Input },],
    };
    return PatternValidator;
}());
exports.PatternValidator = PatternValidator;
//# sourceMappingURL=validators.js.map