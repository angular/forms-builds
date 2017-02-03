/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core/index';
import { toPromise } from 'rxjs/operator/toPromise';
import { StringMapWrapper } from './facade/collection';
import { isPresent } from './facade/lang';
import { isPromise } from './private_import_core';
/**
 * @param {?} value
 * @return {?}
 */
function isEmptyInputValue(value) {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}
/**
 * Providers for validators to be used for {@link FormControl}s in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * ### Example
 *
 * {@example core/forms/ts/ng_validators/ng_validators.ts region='ng_validators'}
 * @stable
 */
export const /** @type {?} */ NG_VALIDATORS = new InjectionToken('NgValidators');
/**
 * Providers for asynchronous validators to be used for {@link FormControl}s
 * in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * See {@link NG_VALIDATORS} for more details.
 *
 * @stable
 */
export const /** @type {?} */ NG_ASYNC_VALIDATORS = new InjectionToken('NgAsyncValidators');
const /** @type {?} */ EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
/**
 * Provides a set of validators used by form controls.
 *
 * A validator is a function that processes a {\@link FormControl} or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new FormControl("", Validators.required)
 * ```
 *
 * \@stable
 */
export class Validators {
    /**
     * Validator that compares the value of the given FormControls
     * @param {...?} fieldPaths
     * @return {?}
     */
    static equalsTo(...fieldPaths) {
        return function (control) {
            if (fieldPaths.length < 1) {
                throw new Error('You must compare to at least 1 other field');
            }
            for (let fieldName of fieldPaths) {
                let /** @type {?} */ field = ((control.parent)).get(fieldName);
                if (!field) {
                    throw new Error(`Field: ${fieldName} undefined, are you sure that ${fieldName} exists in the group`);
                }
                if (field.value !== control.value) {
                    return { 'equalsTo': { 'unequalField': fieldName } };
                }
            }
            return null;
        };
    }
    /**
     * Validator that requires controls to have a non-empty value.
     * @param {?} control
     * @return {?}
     */
    static required(control) {
        return isEmptyInputValue(control.value) ? { 'required': true } : null;
    }
    /**
     * Validator that requires control value to be true.
     * @param {?} control
     * @return {?}
     */
    static requiredTrue(control) {
        return control.value === true ? null : { 'required': true };
    }
    /**
     * Validator that performs email validation.
     * @param {?} control
     * @return {?}
     */
    static email(control) {
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    }
    /**
     * Validator that requires controls to have a value of a minimum length.
     * @param {?} minLength
     * @return {?}
     */
    static minLength(minLength) {
        return (control) => {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            const /** @type {?} */ length = control.value ? control.value.length : 0;
            return length < minLength ?
                { 'minlength': { 'requiredLength': minLength, 'actualLength': length } } :
                null;
        };
    }
    /**
     * Validator that requires controls to have a value of a maximum length.
     * @param {?} maxLength
     * @return {?}
     */
    static maxLength(maxLength) {
        return (control) => {
            const /** @type {?} */ length = control.value ? control.value.length : 0;
            return length > maxLength ?
                { 'maxlength': { 'requiredLength': maxLength, 'actualLength': length } } :
                null;
        };
    }
    /**
     * Validator that requires a control to match a regex to its value.
     * @param {?} pattern
     * @return {?}
     */
    static pattern(pattern) {
        if (!pattern)
            return Validators.nullValidator;
        let /** @type {?} */ regex;
        let /** @type {?} */ regexStr;
        if (typeof pattern === 'string') {
            regexStr = `^${pattern}$`;
            regex = new RegExp(regexStr);
        }
        else {
            regexStr = pattern.toString();
            regex = pattern;
        }
        return (control) => {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            const /** @type {?} */ value = control.value;
            return regex.test(value) ? null :
                { 'pattern': { 'requiredPattern': regexStr, 'actualValue': value } };
        };
    }
    /**
     * No-op validator.
     * @param {?} c
     * @return {?}
     */
    static nullValidator(c) { return null; }
    /**
     * Compose multiple validators into a single function that returns the union
     * of the individual error maps.
     * @param {?} validators
     * @return {?}
     */
    static compose(validators) {
        if (!validators)
            return null;
        const /** @type {?} */ presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            return _mergeErrors(_executeValidators(control, presentValidators));
        };
    }
    /**
     * @param {?} validators
     * @return {?}
     */
    static composeAsync(validators) {
        if (!validators)
            return null;
        const /** @type {?} */ presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            const /** @type {?} */ promises = _executeAsyncValidators(control, presentValidators).map(_convertToPromise);
            return Promise.all(promises).then(_mergeErrors);
        };
    }
}
/**
 * @param {?} obj
 * @return {?}
 */
function _convertToPromise(obj) {
    return isPromise(obj) ? obj : toPromise.call(obj);
}
/**
 * @param {?} control
 * @param {?} validators
 * @return {?}
 */
function _executeValidators(control, validators) {
    return validators.map(v => v(control));
}
/**
 * @param {?} control
 * @param {?} validators
 * @return {?}
 */
function _executeAsyncValidators(control, validators) {
    return validators.map(v => v(control));
}
/**
 * @param {?} arrayOfErrors
 * @return {?}
 */
function _mergeErrors(arrayOfErrors) {
    const /** @type {?} */ res = arrayOfErrors.reduce((res, errors) => {
        return isPresent(errors) ? StringMapWrapper.merge(res, errors) : res;
    }, {});
    return Object.keys(res).length === 0 ? null : res;
}
//# sourceMappingURL=validators.js.map