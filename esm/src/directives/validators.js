/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, forwardRef } from '@angular/core';
import { isPresent } from '../facade/lang';
import { NG_VALIDATORS, Validators } from '../validators';
export const REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RequiredValidator),
    multi: true
};
export class RequiredValidator {
    get required() { return this._required; }
    set required(value) {
        this._required = isPresent(value) && `${value}` !== 'false';
        if (this._onChange)
            this._onChange();
    }
    validate(c) {
        return this.required ? Validators.required(c) : null;
    }
    registerOnChange(fn) { this._onChange = fn; }
}
/** @nocollapse */
RequiredValidator.decorators = [
    { type: Directive, args: [{
                selector: '[required][formControlName],[required][formControl],[required][ngModel]',
                providers: [REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required? "" : null' }
            },] },
];
/** @nocollapse */
RequiredValidator.propDecorators = {
    'required': [{ type: Input },],
};
/**
 * Provider which adds {@link MinLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
export const MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthValidator),
    multi: true
};
export class MinLengthValidator {
    _createValidator() {
        this._validator = Validators.minLength(parseInt(this.minlength, 10));
    }
    ngOnChanges(changes) {
        if (changes['minlength']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    validate(c) {
        return isPresent(this.minlength) ? this._validator(c) : null;
    }
    registerOnChange(fn) { this._onChange = fn; }
}
/** @nocollapse */
MinLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                providers: [MIN_LENGTH_VALIDATOR],
                host: { '[attr.minlength]': 'minlength? minlength : null' }
            },] },
];
/** @nocollapse */
MinLengthValidator.propDecorators = {
    'minlength': [{ type: Input },],
};
/**
 * Provider which adds {@link MaxLengthValidator} to {@link NG_VALIDATORS}.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
export const MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthValidator),
    multi: true
};
export class MaxLengthValidator {
    _createValidator() {
        this._validator = Validators.maxLength(parseInt(this.maxlength, 10));
    }
    ngOnChanges(changes) {
        if (changes['maxlength']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    validate(c) {
        return isPresent(this.maxlength) ? this._validator(c) : null;
    }
    registerOnChange(fn) { this._onChange = fn; }
}
/** @nocollapse */
MaxLengthValidator.decorators = [
    { type: Directive, args: [{
                selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                providers: [MAX_LENGTH_VALIDATOR],
                host: { '[attr.maxlength]': 'maxlength? maxlength : null' }
            },] },
];
/** @nocollapse */
MaxLengthValidator.propDecorators = {
    'maxlength': [{ type: Input },],
};
export const PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PatternValidator),
    multi: true
};
export class PatternValidator {
    _createValidator() { this._validator = Validators.pattern(this.pattern); }
    ngOnChanges(changes) {
        if (changes['pattern']) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    validate(c) {
        return isPresent(this.pattern) ? this._validator(c) : null;
    }
    registerOnChange(fn) { this._onChange = fn; }
}
/** @nocollapse */
PatternValidator.decorators = [
    { type: Directive, args: [{
                selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                providers: [PATTERN_VALIDATOR],
                host: { '[attr.pattern]': 'pattern? pattern : null' }
            },] },
];
/** @nocollapse */
PatternValidator.propDecorators = {
    'pattern': [{ type: Input },],
};
//# sourceMappingURL=validators.js.map