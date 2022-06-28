/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, ɵisObservable as isObservable, ɵisPromise as isPromise, ɵRuntimeError as RuntimeError } from '@angular/core';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
function isEmptyInputValue(value) {
    /**
     * Check if the object is a string or array before evaluating the length attribute.
     * This avoids falsely rejecting objects that contain a custom length attribute.
     * For example, the object {id: 1, length: 0, width: 0} should not be returned as empty.
     */
    return value == null ||
        ((typeof value === 'string' || Array.isArray(value)) && value.length === 0);
}
function hasValidLength(value) {
    // non-strict comparison is intentional, to check for both `null` and `undefined` values
    return value != null && typeof value.length === 'number';
}
/**
 * @description
 * An `InjectionToken` for registering additional synchronous validators used with
 * `AbstractControl`s.
 *
 * @see `NG_ASYNC_VALIDATORS`
 *
 * @usageNotes
 *
 * ### Providing a custom validator
 *
 * The following example registers a custom validator directive. Adding the validator to the
 * existing collection of validators requires the `multi: true` option.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors | null {
 *     return { 'custom': true };
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export const NG_VALIDATORS = new InjectionToken('NgValidators');
/**
 * @description
 * An `InjectionToken` for registering additional asynchronous validators used with
 * `AbstractControl`s.
 *
 * @see `NG_VALIDATORS`
 *
 * @usageNotes
 *
 * ### Provide a custom async validator directive
 *
 * The following example implements the `AsyncValidator` interface to create an
 * async validator directive with a custom error key.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(control: AbstractControl): Promise<ValidationErrors|null> {
 *     return Promise.resolve({'custom': true});
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export const NG_ASYNC_VALIDATORS = new InjectionToken('NgAsyncValidators');
/**
 * A regular expression that matches valid e-mail addresses.
 *
 * At a high level, this regexp matches e-mail addresses of the format `local-part@tld`, where:
 * - `local-part` consists of one or more of the allowed characters (alphanumeric and some
 *   punctuation symbols).
 * - `local-part` cannot begin or end with a period (`.`).
 * - `local-part` cannot be longer than 64 characters.
 * - `tld` consists of one or more `labels` separated by periods (`.`). For example `localhost` or
 *   `foo.com`.
 * - A `label` consists of one or more of the allowed characters (alphanumeric, dashes (`-`) and
 *   periods (`.`)).
 * - A `label` cannot begin or end with a dash (`-`) or a period (`.`).
 * - A `label` cannot be longer than 63 characters.
 * - The whole address cannot be longer than 254 characters.
 *
 * ## Implementation background
 *
 * This regexp was ported over from AngularJS (see there for git history):
 * https://github.com/angular/angular.js/blob/c133ef836/src/ng/directive/input.js#L27
 * It is based on the
 * [WHATWG version](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
 * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
 * lengths of different parts of the address). The main differences from the WHATWG version are:
 *   - Disallow `local-part` to begin or end with a period (`.`).
 *   - Disallow `local-part` length to exceed 64 characters.
 *   - Disallow total address length to exceed 254 characters.
 *
 * See [this commit](https://github.com/angular/angular.js/commit/f3f5cf72e) for more details.
 */
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
 * @description
 * Provides a set of built-in validators that can be used by form controls.
 *
 * A validator is a function that processes a `FormControl` or collection of
 * controls and returns an error map or null. A null map means that validation has passed.
 *
 * @see [Form Validation](/guide/form-validation)
 *
 * @publicApi
 */
export class Validators {
    /**
     * @description
     * Validator that requires the control's value to be greater than or equal to the provided number.
     *
     * @usageNotes
     *
     * ### Validate against a minimum of 3
     *
     * ```typescript
     * const control = new FormControl(2, Validators.min(3));
     *
     * console.log(control.errors); // {min: {min: 3, actual: 2}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `min` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static min(min) {
        return minValidator(min);
    }
    /**
     * @description
     * Validator that requires the control's value to be less than or equal to the provided number.
     *
     * @usageNotes
     *
     * ### Validate against a maximum of 15
     *
     * ```typescript
     * const control = new FormControl(16, Validators.max(15));
     *
     * console.log(control.errors); // {max: {max: 15, actual: 16}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `max` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static max(max) {
        return maxValidator(max);
    }
    /**
     * @description
     * Validator that requires the control have a non-empty value.
     *
     * @usageNotes
     *
     * ### Validate that the field is non-empty
     *
     * ```typescript
     * const control = new FormControl('', Validators.required);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map with the `required` property
     * if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static required(control) {
        return requiredValidator(control);
    }
    /**
     * @description
     * Validator that requires the control's value be true. This validator is commonly
     * used for required checkboxes.
     *
     * @usageNotes
     *
     * ### Validate that the field value is true
     *
     * ```typescript
     * const control = new FormControl('some value', Validators.requiredTrue);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map that contains the `required` property
     * set to `true` if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static requiredTrue(control) {
        return requiredTrueValidator(control);
    }
    /**
     * @description
     * Validator that requires the control's value pass an email validation test.
     *
     * Tests the value using a [regular
     * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
     * pattern suitable for common usecases. The pattern is based on the definition of a valid email
     * address in the [WHATWG HTML
     * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
     * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
     * lengths of different parts of the address).
     *
     * The differences from the WHATWG version include:
     * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
     * - Disallow `local-part` to be longer than 64 characters.
     * - Disallow the whole address to be longer than 254 characters.
     *
     * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
     * validate the value against a different pattern.
     *
     * @usageNotes
     *
     * ### Validate that the field matches a valid email pattern
     *
     * ```typescript
     * const control = new FormControl('bad@', Validators.email);
     *
     * console.log(control.errors); // {email: true}
     * ```
     *
     * @returns An error map with the `email` property
     * if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static email(control) {
        return emailValidator(control);
    }
    /**
     * @description
     * Validator that requires the length of the control's value to be greater than or equal
     * to the provided minimum length. This validator is also provided by default if you use the
     * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays. The
     * `minLength` validator logic is also not invoked for values when their `length` property is 0
     * (for example in case of an empty string or an empty array), to support optional controls. You
     * can use the standard `required` validator if empty values should not be considered valid.
     *
     * @usageNotes
     *
     * ### Validate that the field has a minimum of 3 characters
     *
     * ```typescript
     * const control = new FormControl('ng', Validators.minLength(3));
     *
     * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
     * ```
     *
     * ```html
     * <input minlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `minlength` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static minLength(minLength) {
        return minLengthValidator(minLength);
    }
    /**
     * @description
     * Validator that requires the length of the control's value to be less than or equal
     * to the provided maximum length. This validator is also provided by default if you use the
     * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays.
     *
     * @usageNotes
     *
     * ### Validate that the field has maximum of 5 characters
     *
     * ```typescript
     * const control = new FormControl('Angular', Validators.maxLength(5));
     *
     * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
     * ```
     *
     * ```html
     * <input maxlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `maxlength` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static maxLength(maxLength) {
        return maxLengthValidator(maxLength);
    }
    /**
     * @description
     * Validator that requires the control's value to match a regex pattern. This validator is also
     * provided by default if you use the HTML5 `pattern` attribute.
     *
     * @usageNotes
     *
     * ### Validate that the field only contains letters or spaces
     *
     * ```typescript
     * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
     *
     * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
     * ```
     *
     * ```html
     * <input pattern="[a-zA-Z ]*">
     * ```
     *
     * ### Pattern matching with the global or sticky flag
     *
     * `RegExp` objects created with the `g` or `y` flags that are passed into `Validators.pattern`
     * can produce different results on the same input when validations are run consecutively. This is
     * due to how the behavior of `RegExp.prototype.test` is
     * specified in [ECMA-262](https://tc39.es/ecma262/#sec-regexpbuiltinexec)
     * (`RegExp` preserves the index of the last match when the global or sticky flag is used).
     * Due to this behavior, it is recommended that when using
     * `Validators.pattern` you **do not** pass in a `RegExp` object with either the global or sticky
     * flag enabled.
     *
     * ```typescript
     * // Not recommended (since the `g` flag is used)
     * const controlOne = new FormControl('1', Validators.pattern(/foo/g));
     *
     * // Good
     * const controlTwo = new FormControl('1', Validators.pattern(/foo/));
     * ```
     *
     * @param pattern A regular expression to be used as is to test the values, or a string.
     * If a string is passed, the `^` character is prepended and the `$` character is
     * appended to the provided string (if not already present), and the resulting regular
     * expression is used to test the values.
     *
     * @returns A validator function that returns an error map with the
     * `pattern` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static pattern(pattern) {
        return patternValidator(pattern);
    }
    /**
     * @description
     * Validator that performs no operation.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static nullValidator(control) {
        return nullValidator(control);
    }
    static compose(validators) {
        return compose(validators);
    }
    /**
     * @description
     * Compose multiple async validators into a single function that returns the union
     * of the individual error objects for the provided control.
     *
     * @returns A validator function that returns an error map with the
     * merged error objects of the async validators if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static composeAsync(validators) {
        return composeAsync(validators);
    }
}
/**
 * Validator that requires the control's value to be greater than or equal to the provided number.
 * See `Validators.min` for additional information.
 */
export function minValidator(min) {
    return (control) => {
        if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
            return null; // don't validate empty values to allow optional controls
        }
        const value = parseFloat(control.value);
        // Controls with NaN values after parsing should be treated as not having a
        // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
        return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
    };
}
/**
 * Validator that requires the control's value to be less than or equal to the provided number.
 * See `Validators.max` for additional information.
 */
export function maxValidator(max) {
    return (control) => {
        if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
            return null; // don't validate empty values to allow optional controls
        }
        const value = parseFloat(control.value);
        // Controls with NaN values after parsing should be treated as not having a
        // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
        return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
    };
}
/**
 * Validator that requires the control have a non-empty value.
 * See `Validators.required` for additional information.
 */
export function requiredValidator(control) {
    return isEmptyInputValue(control.value) ? { 'required': true } : null;
}
/**
 * Validator that requires the control's value be true. This validator is commonly
 * used for required checkboxes.
 * See `Validators.requiredTrue` for additional information.
 */
export function requiredTrueValidator(control) {
    return control.value === true ? null : { 'required': true };
}
/**
 * Validator that requires the control's value pass an email validation test.
 * See `Validators.email` for additional information.
 */
export function emailValidator(control) {
    if (isEmptyInputValue(control.value)) {
        return null; // don't validate empty values to allow optional controls
    }
    return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
}
/**
 * Validator that requires the length of the control's value to be greater than or equal
 * to the provided minimum length. See `Validators.minLength` for additional information.
 */
export function minLengthValidator(minLength) {
    return (control) => {
        if (isEmptyInputValue(control.value) || !hasValidLength(control.value)) {
            // don't validate empty values to allow optional controls
            // don't validate values without `length` property
            return null;
        }
        return control.value.length < minLength ?
            { 'minlength': { 'requiredLength': minLength, 'actualLength': control.value.length } } :
            null;
    };
}
/**
 * Validator that requires the length of the control's value to be less than or equal
 * to the provided maximum length. See `Validators.maxLength` for additional information.
 */
export function maxLengthValidator(maxLength) {
    return (control) => {
        return hasValidLength(control.value) && control.value.length > maxLength ?
            { 'maxlength': { 'requiredLength': maxLength, 'actualLength': control.value.length } } :
            null;
    };
}
/**
 * Validator that requires the control's value to match a regex pattern.
 * See `Validators.pattern` for additional information.
 */
export function patternValidator(pattern) {
    if (!pattern)
        return nullValidator;
    let regex;
    let regexStr;
    if (typeof pattern === 'string') {
        regexStr = '';
        if (pattern.charAt(0) !== '^')
            regexStr += '^';
        regexStr += pattern;
        if (pattern.charAt(pattern.length - 1) !== '$')
            regexStr += '$';
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
        const value = control.value;
        return regex.test(value) ? null :
            { 'pattern': { 'requiredPattern': regexStr, 'actualValue': value } };
    };
}
/**
 * Function that has `ValidatorFn` shape, but performs no operation.
 */
export function nullValidator(control) {
    return null;
}
function isPresent(o) {
    return o != null;
}
export function toObservable(value) {
    const obs = isPromise(value) ? from(value) : value;
    if (NG_DEV_MODE && !(isObservable(obs))) {
        let errorMessage = `Expected async validator to return Promise or Observable.`;
        // A synchronous validator will return object or null.
        if (typeof value === 'object') {
            errorMessage +=
                ' Are you using a synchronous validator where an async validator is expected?';
        }
        throw new RuntimeError(-1101 /* RuntimeErrorCode.WRONG_VALIDATOR_RETURN_TYPE */, errorMessage);
    }
    return obs;
}
function mergeErrors(arrayOfErrors) {
    let res = {};
    // Not using Array.reduce here due to a Chrome 80 bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    arrayOfErrors.forEach((errors) => {
        res = errors != null ? { ...res, ...errors } : res;
    });
    return Object.keys(res).length === 0 ? null : res;
}
function executeValidators(control, validators) {
    return validators.map(validator => validator(control));
}
function isValidatorFn(validator) {
    return !validator.validate;
}
/**
 * Given the list of validators that may contain both functions as well as classes, return the list
 * of validator functions (convert validator classes into validator functions). This is needed to
 * have consistent structure in validators list before composing them.
 *
 * @param validators The set of validators that may contain validators both in plain function form
 *     as well as represented as a validator class.
 */
export function normalizeValidators(validators) {
    return validators.map(validator => {
        return isValidatorFn(validator) ?
            validator :
            ((c) => validator.validate(c));
    });
}
/**
 * Merges synchronous validators into a single validator function.
 * See `Validators.compose` for additional information.
 */
function compose(validators) {
    if (!validators)
        return null;
    const presentValidators = validators.filter(isPresent);
    if (presentValidators.length == 0)
        return null;
    return function (control) {
        return mergeErrors(executeValidators(control, presentValidators));
    };
}
/**
 * Accepts a list of validators of different possible shapes (`Validator` and `ValidatorFn`),
 * normalizes the list (converts everything to `ValidatorFn`) and merges them into a single
 * validator function.
 */
export function composeValidators(validators) {
    return validators != null ? compose(normalizeValidators(validators)) : null;
}
/**
 * Merges asynchronous validators into a single validator function.
 * See `Validators.composeAsync` for additional information.
 */
function composeAsync(validators) {
    if (!validators)
        return null;
    const presentValidators = validators.filter(isPresent);
    if (presentValidators.length == 0)
        return null;
    return function (control) {
        const observables = executeValidators(control, presentValidators).map(toObservable);
        return forkJoin(observables).pipe(map(mergeErrors));
    };
}
/**
 * Accepts a list of async validators of different possible shapes (`AsyncValidator` and
 * `AsyncValidatorFn`), normalizes the list (converts everything to `AsyncValidatorFn`) and merges
 * them into a single validator function.
 */
export function composeAsyncValidators(validators) {
    return validators != null ? composeAsync(normalizeValidators(validators)) :
        null;
}
/**
 * Merges raw control validators with a given directive validator and returns the combined list of
 * validators as an array.
 */
export function mergeValidators(controlValidators, dirValidator) {
    if (controlValidators === null)
        return [dirValidator];
    return Array.isArray(controlValidators) ? [...controlValidators, dirValidator] :
        [controlValidators, dirValidator];
}
/**
 * Retrieves the list of raw synchronous validators attached to a given control.
 */
export function getControlValidators(control) {
    return control._rawValidators;
}
/**
 * Retrieves the list of raw asynchronous validators attached to a given control.
 */
export function getControlAsyncValidators(control) {
    return control._rawAsyncValidators;
}
/**
 * Accepts a singleton validator, an array, or null, and returns an array type with the provided
 * validators.
 *
 * @param validators A validator, validators, or null.
 * @returns A validators array.
 */
export function makeValidatorsArray(validators) {
    if (!validators)
        return [];
    return Array.isArray(validators) ? validators : [validators];
}
/**
 * Determines whether a validator or validators array has a given validator.
 *
 * @param validators The validator or validators to compare against.
 * @param validator The validator to check.
 * @returns Whether the validator is present.
 */
export function hasValidator(validators, validator) {
    return Array.isArray(validators) ? validators.includes(validator) : validators === validator;
}
/**
 * Combines two arrays of validators into one. If duplicates are provided, only one will be added.
 *
 * @param validators The new validators.
 * @param currentValidators The base array of currrent validators.
 * @returns An array of validators.
 */
export function addValidators(validators, currentValidators) {
    const current = makeValidatorsArray(currentValidators);
    const validatorsToAdd = makeValidatorsArray(validators);
    validatorsToAdd.forEach((v) => {
        // Note: if there are duplicate entries in the new validators array,
        // only the first one would be added to the current list of validarors.
        // Duplicate ones would be ignored since `hasValidator` would detect
        // the presence of a validator function and we update the current list in place.
        if (!hasValidator(current, v)) {
            current.push(v);
        }
    });
    return current;
}
export function removeValidators(validators, currentValidators) {
    return makeValidatorsArray(currentValidators).filter(v => !hasValidator(validators, v));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUUsYUFBYSxJQUFJLFlBQVksRUFBRSxVQUFVLElBQUksU0FBUyxFQUFFLGFBQWEsSUFBSSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEksT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTW5DLE1BQU0sV0FBVyxHQUFHLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO0FBRXBFLFNBQVMsaUJBQWlCLENBQUMsS0FBVTtJQUNuQzs7OztPQUlHO0lBQ0gsT0FBTyxLQUFLLElBQUksSUFBSTtRQUNoQixDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFVO0lBQ2hDLHdGQUF3RjtJQUN4RixPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztBQUMzRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCRztBQUNILE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBNEIsY0FBYyxDQUFDLENBQUM7QUFFM0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FDNUIsSUFBSSxj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QUFFLGlCQUE2QjtJQUNsRCxPQUFPLG1CQUFtQixDQUFDLGlCQUFpQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGlvblRva2VuLCDJtWlzT2JzZXJ2YWJsZSBhcyBpc09ic2VydmFibGUsIMm1aXNQcm9taXNlIGFzIGlzUHJvbWlzZSwgybVSdW50aW1lRXJyb3IgYXMgUnVudGltZUVycm9yfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Zm9ya0pvaW4sIGZyb20sIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtSdW50aW1lRXJyb3JDb2RlfSBmcm9tICcuL2Vycm9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbH0gZnJvbSAnLi9tb2RlbC9hYnN0cmFjdF9tb2RlbCc7XG5cbmNvbnN0IE5HX0RFVl9NT0RFID0gdHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgISFuZ0Rldk1vZGU7XG5cbmZ1bmN0aW9uIGlzRW1wdHlJbnB1dFZhbHVlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBvYmplY3QgaXMgYSBzdHJpbmcgb3IgYXJyYXkgYmVmb3JlIGV2YWx1YXRpbmcgdGhlIGxlbmd0aCBhdHRyaWJ1dGUuXG4gICAqIFRoaXMgYXZvaWRzIGZhbHNlbHkgcmVqZWN0aW5nIG9iamVjdHMgdGhhdCBjb250YWluIGEgY3VzdG9tIGxlbmd0aCBhdHRyaWJ1dGUuXG4gICAqIEZvciBleGFtcGxlLCB0aGUgb2JqZWN0IHtpZDogMSwgbGVuZ3RoOiAwLCB3aWR0aDogMH0gc2hvdWxkIG5vdCBiZSByZXR1cm5lZCBhcyBlbXB0eS5cbiAgICovXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsIHx8XG4gICAgICAoKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCk7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkTGVuZ3RoKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgLy8gbm9uLXN0cmljdCBjb21wYXJpc29uIGlzIGludGVudGlvbmFsLCB0byBjaGVjayBmb3IgYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgIHZhbHVlc1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBJbmplY3Rpb25Ub2tlbmAgZm9yIHJlZ2lzdGVyaW5nIGFkZGl0aW9uYWwgc3luY2hyb25vdXMgdmFsaWRhdG9ycyB1c2VkIHdpdGhcbiAqIGBBYnN0cmFjdENvbnRyb2xgcy5cbiAqXG4gKiBAc2VlIGBOR19BU1lOQ19WQUxJREFUT1JTYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGluZyBhIGN1c3RvbSB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgY3VzdG9tIHZhbGlkYXRvciBkaXJlY3RpdmUuIEFkZGluZyB0aGUgdmFsaWRhdG9yIHRvIHRoZVxuICogZXhpc3RpbmcgY29sbGVjdGlvbiBvZiB2YWxpZGF0b3JzIHJlcXVpcmVzIHRoZSBgbXVsdGk6IHRydWVgIG9wdGlvbi5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICogICAgIHJldHVybiB7ICdjdXN0b20nOiB0cnVlIH07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IE5HX1ZBTElEQVRPUlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48QXJyYXk8VmFsaWRhdG9yfEZ1bmN0aW9uPj4oJ05nVmFsaWRhdG9ycycpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQW4gYEluamVjdGlvblRva2VuYCBmb3IgcmVnaXN0ZXJpbmcgYWRkaXRpb25hbCBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyB1c2VkIHdpdGhcbiAqIGBBYnN0cmFjdENvbnRyb2xgcy5cbiAqXG4gKiBAc2VlIGBOR19WQUxJREFUT1JTYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGUgYSBjdXN0b20gYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbXBsZW1lbnRzIHRoZSBgQXN5bmNWYWxpZGF0b3JgIGludGVyZmFjZSB0byBjcmVhdGUgYW5cbiAqIGFzeW5jIHZhbGlkYXRvciBkaXJlY3RpdmUgd2l0aCBhIGN1c3RvbSBlcnJvciBrZXkuXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnW2N1c3RvbUFzeW5jVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19BU1lOQ19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tQXN5bmNWYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOlxuICogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tQXN5bmNWYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBBc3luY1ZhbGlkYXRvciB7XG4gKiAgIHZhbGlkYXRlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFByb21pc2U8VmFsaWRhdGlvbkVycm9yc3xudWxsPiB7XG4gKiAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7J2N1c3RvbSc6IHRydWV9KTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgTkdfQVNZTkNfVkFMSURBVE9SUyA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPEFycmF5PFZhbGlkYXRvcnxGdW5jdGlvbj4+KCdOZ0FzeW5jVmFsaWRhdG9ycycpO1xuXG4vKipcbiAqIEEgcmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyB2YWxpZCBlLW1haWwgYWRkcmVzc2VzLlxuICpcbiAqIEF0IGEgaGlnaCBsZXZlbCwgdGhpcyByZWdleHAgbWF0Y2hlcyBlLW1haWwgYWRkcmVzc2VzIG9mIHRoZSBmb3JtYXQgYGxvY2FsLXBhcnRAdGxkYCwgd2hlcmU6XG4gKiAtIGBsb2NhbC1wYXJ0YCBjb25zaXN0cyBvZiBvbmUgb3IgbW9yZSBvZiB0aGUgYWxsb3dlZCBjaGFyYWN0ZXJzIChhbHBoYW51bWVyaWMgYW5kIHNvbWVcbiAqICAgcHVuY3R1YXRpb24gc3ltYm9scykuXG4gKiAtIGBsb2NhbC1wYXJ0YCBjYW5ub3QgYmVnaW4gb3IgZW5kIHdpdGggYSBwZXJpb2QgKGAuYCkuXG4gKiAtIGBsb2NhbC1wYXJ0YCBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gNjQgY2hhcmFjdGVycy5cbiAqIC0gYHRsZGAgY29uc2lzdHMgb2Ygb25lIG9yIG1vcmUgYGxhYmVsc2Agc2VwYXJhdGVkIGJ5IHBlcmlvZHMgKGAuYCkuIEZvciBleGFtcGxlIGBsb2NhbGhvc3RgIG9yXG4gKiAgIGBmb28uY29tYC5cbiAqIC0gQSBgbGFiZWxgIGNvbnNpc3RzIG9mIG9uZSBvciBtb3JlIG9mIHRoZSBhbGxvd2VkIGNoYXJhY3RlcnMgKGFscGhhbnVtZXJpYywgZGFzaGVzIChgLWApIGFuZFxuICogICBwZXJpb2RzIChgLmApKS5cbiAqIC0gQSBgbGFiZWxgIGNhbm5vdCBiZWdpbiBvciBlbmQgd2l0aCBhIGRhc2ggKGAtYCkgb3IgYSBwZXJpb2QgKGAuYCkuXG4gKiAtIEEgYGxhYmVsYCBjYW5ub3QgYmUgbG9uZ2VyIHRoYW4gNjMgY2hhcmFjdGVycy5cbiAqIC0gVGhlIHdob2xlIGFkZHJlc3MgY2Fubm90IGJlIGxvbmdlciB0aGFuIDI1NCBjaGFyYWN0ZXJzLlxuICpcbiAqICMjIEltcGxlbWVudGF0aW9uIGJhY2tncm91bmRcbiAqXG4gKiBUaGlzIHJlZ2V4cCB3YXMgcG9ydGVkIG92ZXIgZnJvbSBBbmd1bGFySlMgKHNlZSB0aGVyZSBmb3IgZ2l0IGhpc3RvcnkpOlxuICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9ibG9iL2MxMzNlZjgzNi9zcmMvbmcvZGlyZWN0aXZlL2lucHV0LmpzI0wyN1xuICogSXQgaXMgYmFzZWQgb24gdGhlXG4gKiBbV0hBVFdHIHZlcnNpb25dKGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2lucHV0Lmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3MpIHdpdGhcbiAqIHNvbWUgZW5oYW5jZW1lbnRzIHRvIGluY29ycG9yYXRlIG1vcmUgUkZDIHJ1bGVzIChzdWNoIGFzIHJ1bGVzIHJlbGF0ZWQgdG8gZG9tYWluIG5hbWVzIGFuZCB0aGVcbiAqIGxlbmd0aHMgb2YgZGlmZmVyZW50IHBhcnRzIG9mIHRoZSBhZGRyZXNzKS4gVGhlIG1haW4gZGlmZmVyZW5jZXMgZnJvbSB0aGUgV0hBVFdHIHZlcnNpb24gYXJlOlxuICogICAtIERpc2FsbG93IGBsb2NhbC1wYXJ0YCB0byBiZWdpbiBvciBlbmQgd2l0aCBhIHBlcmlvZCAoYC5gKS5cbiAqICAgLSBEaXNhbGxvdyBgbG9jYWwtcGFydGAgbGVuZ3RoIHRvIGV4Y2VlZCA2NCBjaGFyYWN0ZXJzLlxuICogICAtIERpc2FsbG93IHRvdGFsIGFkZHJlc3MgbGVuZ3RoIHRvIGV4Y2VlZCAyNTQgY2hhcmFjdGVycy5cbiAqXG4gKiBTZWUgW3RoaXMgY29tbWl0XShodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyLmpzL2NvbW1pdC9mM2Y1Y2Y3MmUpIGZvciBtb3JlIGRldGFpbHMuXG4gKi9cbmNvbnN0IEVNQUlMX1JFR0VYUCA9XG4gICAgL14oPz0uezEsMjU0fSQpKD89LnsxLDY0fUApW2EtekEtWjAtOSEjJCUmJyorLz0/Xl9ge3x9fi1dKyg/OlxcLlthLXpBLVowLTkhIyQlJicqKy89P15fYHt8fX4tXSspKkBbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKiQvO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXMgYSBzZXQgb2YgYnVpbHQtaW4gdmFsaWRhdG9ycyB0aGF0IGNhbiBiZSB1c2VkIGJ5IGZvcm0gY29udHJvbHMuXG4gKlxuICogQSB2YWxpZGF0b3IgaXMgYSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBhIGBGb3JtQ29udHJvbGAgb3IgY29sbGVjdGlvbiBvZlxuICogY29udHJvbHMgYW5kIHJldHVybnMgYW4gZXJyb3IgbWFwIG9yIG51bGwuIEEgbnVsbCBtYXAgbWVhbnMgdGhhdCB2YWxpZGF0aW9uIGhhcyBwYXNzZWQuXG4gKlxuICogQHNlZSBbRm9ybSBWYWxpZGF0aW9uXSgvZ3VpZGUvZm9ybS12YWxpZGF0aW9uKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRvcnMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCBudW1iZXIuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBWYWxpZGF0ZSBhZ2FpbnN0IGEgbWluaW11bSBvZiAzXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgyLCBWYWxpZGF0b3JzLm1pbigzKSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge21pbjoge21pbjogMywgYWN0dWFsOiAyfX1cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogYG1pbmAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUgYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWBcbiAgICpcbiAgICovXG4gIHN0YXRpYyBtaW4obWluOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIG1pblZhbGlkYXRvcihtaW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbnVtYmVyLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgYWdhaW5zdCBhIG1heGltdW0gb2YgMTVcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKDE2LCBWYWxpZGF0b3JzLm1heCgxNSkpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHttYXg6IHttYXg6IDE1LCBhY3R1YWw6IDE2fX1cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogYG1heGAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUgYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWBcbiAgICpcbiAgICovXG4gIHN0YXRpYyBtYXgobWF4OiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIG1heFZhbGlkYXRvcihtYXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCBoYXZlIGEgbm9uLWVtcHR5IHZhbHVlLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgaXMgbm9uLWVtcHR5XG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge3JlcXVpcmVkOiB0cnVlfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQW4gZXJyb3IgbWFwIHdpdGggdGhlIGByZXF1aXJlZGAgcHJvcGVydHlcbiAgICogaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUgYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWBcbiAgICpcbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiByZXF1aXJlZFZhbGlkYXRvcihjb250cm9sKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSBiZSB0cnVlLiBUaGlzIHZhbGlkYXRvciBpcyBjb21tb25seVxuICAgKiB1c2VkIGZvciByZXF1aXJlZCBjaGVja2JveGVzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgdmFsdWUgaXMgdHJ1ZVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ3NvbWUgdmFsdWUnLCBWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge3JlcXVpcmVkOiB0cnVlfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQW4gZXJyb3IgbWFwIHRoYXQgY29udGFpbnMgdGhlIGByZXF1aXJlZGAgcHJvcGVydHlcbiAgICogc2V0IHRvIGB0cnVlYCBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICpcbiAgICogQHNlZSBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYFxuICAgKlxuICAgKi9cbiAgc3RhdGljIHJlcXVpcmVkVHJ1ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiByZXF1aXJlZFRydWVWYWxpZGF0b3IoY29udHJvbCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgcGFzcyBhbiBlbWFpbCB2YWxpZGF0aW9uIHRlc3QuXG4gICAqXG4gICAqIFRlc3RzIHRoZSB2YWx1ZSB1c2luZyBhIFtyZWd1bGFyXG4gICAqIGV4cHJlc3Npb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvR3VpZGUvUmVndWxhcl9FeHByZXNzaW9ucylcbiAgICogcGF0dGVybiBzdWl0YWJsZSBmb3IgY29tbW9uIHVzZWNhc2VzLiBUaGUgcGF0dGVybiBpcyBiYXNlZCBvbiB0aGUgZGVmaW5pdGlvbiBvZiBhIHZhbGlkIGVtYWlsXG4gICAqIGFkZHJlc3MgaW4gdGhlIFtXSEFUV0cgSFRNTFxuICAgKiBzcGVjaWZpY2F0aW9uXShodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbnB1dC5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzKSB3aXRoXG4gICAqIHNvbWUgZW5oYW5jZW1lbnRzIHRvIGluY29ycG9yYXRlIG1vcmUgUkZDIHJ1bGVzIChzdWNoIGFzIHJ1bGVzIHJlbGF0ZWQgdG8gZG9tYWluIG5hbWVzIGFuZCB0aGVcbiAgICogbGVuZ3RocyBvZiBkaWZmZXJlbnQgcGFydHMgb2YgdGhlIGFkZHJlc3MpLlxuICAgKlxuICAgKiBUaGUgZGlmZmVyZW5jZXMgZnJvbSB0aGUgV0hBVFdHIHZlcnNpb24gaW5jbHVkZTpcbiAgICogLSBEaXNhbGxvdyBgbG9jYWwtcGFydGAgKHRoZSBwYXJ0IGJlZm9yZSB0aGUgYEBgIHN5bWJvbCkgdG8gYmVnaW4gb3IgZW5kIHdpdGggYSBwZXJpb2QgKGAuYCkuXG4gICAqIC0gRGlzYWxsb3cgYGxvY2FsLXBhcnRgIHRvIGJlIGxvbmdlciB0aGFuIDY0IGNoYXJhY3RlcnMuXG4gICAqIC0gRGlzYWxsb3cgdGhlIHdob2xlIGFkZHJlc3MgdG8gYmUgbG9uZ2VyIHRoYW4gMjU0IGNoYXJhY3RlcnMuXG4gICAqXG4gICAqIElmIHRoaXMgcGF0dGVybiBkb2VzIG5vdCBzYXRpc2Z5IHlvdXIgYnVzaW5lc3MgbmVlZHMsIHlvdSBjYW4gdXNlIGBWYWxpZGF0b3JzLnBhdHRlcm4oKWAgdG9cbiAgICogdmFsaWRhdGUgdGhlIHZhbHVlIGFnYWluc3QgYSBkaWZmZXJlbnQgcGF0dGVybi5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIG1hdGNoZXMgYSB2YWxpZCBlbWFpbCBwYXR0ZXJuXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnYmFkQCcsIFZhbGlkYXRvcnMuZW1haWwpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtlbWFpbDogdHJ1ZX1cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGVycm9yIG1hcCB3aXRoIHRoZSBgZW1haWxgIHByb3BlcnR5XG4gICAqIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKiBAc2VlIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgXG4gICAqXG4gICAqL1xuICBzdGF0aWMgZW1haWwoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gZW1haWxWYWxpZGF0b3IoY29udHJvbCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBsZW5ndGggb2YgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWxcbiAgICogdG8gdGhlIHByb3ZpZGVkIG1pbmltdW0gbGVuZ3RoLiBUaGlzIHZhbGlkYXRvciBpcyBhbHNvIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaWYgeW91IHVzZSB0aGVcbiAgICogdGhlIEhUTUw1IGBtaW5sZW5ndGhgIGF0dHJpYnV0ZS4gTm90ZSB0aGF0IHRoZSBgbWluTGVuZ3RoYCB2YWxpZGF0b3IgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZFxuICAgKiBvbmx5IGZvciB0eXBlcyB0aGF0IGhhdmUgYSBudW1lcmljIGBsZW5ndGhgIHByb3BlcnR5LCBzdWNoIGFzIHN0cmluZ3Mgb3IgYXJyYXlzLiBUaGVcbiAgICogYG1pbkxlbmd0aGAgdmFsaWRhdG9yIGxvZ2ljIGlzIGFsc28gbm90IGludm9rZWQgZm9yIHZhbHVlcyB3aGVuIHRoZWlyIGBsZW5ndGhgIHByb3BlcnR5IGlzIDBcbiAgICogKGZvciBleGFtcGxlIGluIGNhc2Ugb2YgYW4gZW1wdHkgc3RyaW5nIG9yIGFuIGVtcHR5IGFycmF5KSwgdG8gc3VwcG9ydCBvcHRpb25hbCBjb250cm9scy4gWW91XG4gICAqIGNhbiB1c2UgdGhlIHN0YW5kYXJkIGByZXF1aXJlZGAgdmFsaWRhdG9yIGlmIGVtcHR5IHZhbHVlcyBzaG91bGQgbm90IGJlIGNvbnNpZGVyZWQgdmFsaWQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBWYWxpZGF0ZSB0aGF0IHRoZSBmaWVsZCBoYXMgYSBtaW5pbXVtIG9mIDMgY2hhcmFjdGVyc1xuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ25nJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMykpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHttaW5sZW5ndGg6IHtyZXF1aXJlZExlbmd0aDogMywgYWN0dWFsTGVuZ3RoOiAyfX1cbiAgICogYGBgXG4gICAqXG4gICAqIGBgYGh0bWxcbiAgICogPGlucHV0IG1pbmxlbmd0aD1cIjVcIj5cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogYG1pbmxlbmd0aGAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUgYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWBcbiAgICpcbiAgICovXG4gIHN0YXRpYyBtaW5MZW5ndGgobWluTGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIG1pbkxlbmd0aFZhbGlkYXRvcihtaW5MZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgbGVuZ3RoIG9mIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsXG4gICAqIHRvIHRoZSBwcm92aWRlZCBtYXhpbXVtIGxlbmd0aC4gVGhpcyB2YWxpZGF0b3IgaXMgYWxzbyBwcm92aWRlZCBieSBkZWZhdWx0IGlmIHlvdSB1c2UgdGhlXG4gICAqIHRoZSBIVE1MNSBgbWF4bGVuZ3RoYCBhdHRyaWJ1dGUuIE5vdGUgdGhhdCB0aGUgYG1heExlbmd0aGAgdmFsaWRhdG9yIGlzIGludGVuZGVkIHRvIGJlIHVzZWRcbiAgICogb25seSBmb3IgdHlwZXMgdGhhdCBoYXZlIGEgbnVtZXJpYyBgbGVuZ3RoYCBwcm9wZXJ0eSwgc3VjaCBhcyBzdHJpbmdzIG9yIGFycmF5cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIGhhcyBtYXhpbXVtIG9mIDUgY2hhcmFjdGVyc1xuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ0FuZ3VsYXInLCBWYWxpZGF0b3JzLm1heExlbmd0aCg1KSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge21heGxlbmd0aDoge3JlcXVpcmVkTGVuZ3RoOiA1LCBhY3R1YWxMZW5ndGg6IDd9fVxuICAgKiBgYGBcbiAgICpcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgbWF4bGVuZ3RoPVwiNVwiPlxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgKiBgbWF4bGVuZ3RoYCBwcm9wZXJ0eSBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICpcbiAgICogQHNlZSBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYFxuICAgKlxuICAgKi9cbiAgc3RhdGljIG1heExlbmd0aChtYXhMZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gbWF4TGVuZ3RoVmFsaWRhdG9yKG1heExlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gbWF0Y2ggYSByZWdleCBwYXR0ZXJuLiBUaGlzIHZhbGlkYXRvciBpcyBhbHNvXG4gICAqIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaWYgeW91IHVzZSB0aGUgSFRNTDUgYHBhdHRlcm5gIGF0dHJpYnV0ZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIG9ubHkgY29udGFpbnMgbGV0dGVycyBvciBzcGFjZXNcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcxJywgVmFsaWRhdG9ycy5wYXR0ZXJuKCdbYS16QS1aIF0qJykpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtwYXR0ZXJuOiB7cmVxdWlyZWRQYXR0ZXJuOiAnXlthLXpBLVogXSokJywgYWN0dWFsVmFsdWU6ICcxJ319XG4gICAqIGBgYFxuICAgKlxuICAgKiBgYGBodG1sXG4gICAqIDxpbnB1dCBwYXR0ZXJuPVwiW2EtekEtWiBdKlwiPlxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIFBhdHRlcm4gbWF0Y2hpbmcgd2l0aCB0aGUgZ2xvYmFsIG9yIHN0aWNreSBmbGFnXG4gICAqXG4gICAqIGBSZWdFeHBgIG9iamVjdHMgY3JlYXRlZCB3aXRoIHRoZSBgZ2Agb3IgYHlgIGZsYWdzIHRoYXQgYXJlIHBhc3NlZCBpbnRvIGBWYWxpZGF0b3JzLnBhdHRlcm5gXG4gICAqIGNhbiBwcm9kdWNlIGRpZmZlcmVudCByZXN1bHRzIG9uIHRoZSBzYW1lIGlucHV0IHdoZW4gdmFsaWRhdGlvbnMgYXJlIHJ1biBjb25zZWN1dGl2ZWx5LiBUaGlzIGlzXG4gICAqIGR1ZSB0byBob3cgdGhlIGJlaGF2aW9yIG9mIGBSZWdFeHAucHJvdG90eXBlLnRlc3RgIGlzXG4gICAqIHNwZWNpZmllZCBpbiBbRUNNQS0yNjJdKGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVnZXhwYnVpbHRpbmV4ZWMpXG4gICAqIChgUmVnRXhwYCBwcmVzZXJ2ZXMgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG1hdGNoIHdoZW4gdGhlIGdsb2JhbCBvciBzdGlja3kgZmxhZyBpcyB1c2VkKS5cbiAgICogRHVlIHRvIHRoaXMgYmVoYXZpb3IsIGl0IGlzIHJlY29tbWVuZGVkIHRoYXQgd2hlbiB1c2luZ1xuICAgKiBgVmFsaWRhdG9ycy5wYXR0ZXJuYCB5b3UgKipkbyBub3QqKiBwYXNzIGluIGEgYFJlZ0V4cGAgb2JqZWN0IHdpdGggZWl0aGVyIHRoZSBnbG9iYWwgb3Igc3RpY2t5XG4gICAqIGZsYWcgZW5hYmxlZC5cbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiAvLyBOb3QgcmVjb21tZW5kZWQgKHNpbmNlIHRoZSBgZ2AgZmxhZyBpcyB1c2VkKVxuICAgKiBjb25zdCBjb250cm9sT25lID0gbmV3IEZvcm1Db250cm9sKCcxJywgVmFsaWRhdG9ycy5wYXR0ZXJuKC9mb28vZykpO1xuICAgKlxuICAgKiAvLyBHb29kXG4gICAqIGNvbnN0IGNvbnRyb2xUd28gPSBuZXcgRm9ybUNvbnRyb2woJzEnLCBWYWxpZGF0b3JzLnBhdHRlcm4oL2Zvby8pKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBwYXR0ZXJuIEEgcmVndWxhciBleHByZXNzaW9uIHRvIGJlIHVzZWQgYXMgaXMgdG8gdGVzdCB0aGUgdmFsdWVzLCBvciBhIHN0cmluZy5cbiAgICogSWYgYSBzdHJpbmcgaXMgcGFzc2VkLCB0aGUgYF5gIGNoYXJhY3RlciBpcyBwcmVwZW5kZWQgYW5kIHRoZSBgJGAgY2hhcmFjdGVyIGlzXG4gICAqIGFwcGVuZGVkIHRvIHRoZSBwcm92aWRlZCBzdHJpbmcgKGlmIG5vdCBhbHJlYWR5IHByZXNlbnQpLCBhbmQgdGhlIHJlc3VsdGluZyByZWd1bGFyXG4gICAqIGV4cHJlc3Npb24gaXMgdXNlZCB0byB0ZXN0IHRoZSB2YWx1ZXMuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogYHBhdHRlcm5gIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKiBAc2VlIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgXG4gICAqXG4gICAqL1xuICBzdGF0aWMgcGF0dGVybihwYXR0ZXJuOiBzdHJpbmd8UmVnRXhwKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiBwYXR0ZXJuVmFsaWRhdG9yKHBhdHRlcm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWYWxpZGF0b3IgdGhhdCBwZXJmb3JtcyBubyBvcGVyYXRpb24uXG4gICAqXG4gICAqIEBzZWUgYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWBcbiAgICpcbiAgICovXG4gIHN0YXRpYyBudWxsVmFsaWRhdG9yKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIG51bGxWYWxpZGF0b3IoY29udHJvbCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbXBvc2UgbXVsdGlwbGUgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdW5pb25cbiAgICogb2YgdGhlIGluZGl2aWR1YWwgZXJyb3IgbWFwcyBmb3IgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogbWVyZ2VkIGVycm9yIG1hcHMgb2YgdGhlIHZhbGlkYXRvcnMgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUgYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWBcbiAgICpcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IG51bGwpOiBudWxsO1xuICBzdGF0aWMgY29tcG9zZSh2YWxpZGF0b3JzOiAoVmFsaWRhdG9yRm58bnVsbHx1bmRlZmluZWQpW10pOiBWYWxpZGF0b3JGbnxudWxsO1xuICBzdGF0aWMgY29tcG9zZSh2YWxpZGF0b3JzOiAoVmFsaWRhdG9yRm58bnVsbHx1bmRlZmluZWQpW118bnVsbCk6IFZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiBjb21wb3NlKHZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb21wb3NlIG11bHRpcGxlIGFzeW5jIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHVuaW9uXG4gICAqIG9mIHRoZSBpbmRpdmlkdWFsIGVycm9yIG9iamVjdHMgZm9yIHRoZSBwcm92aWRlZCBjb250cm9sLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAqIG1lcmdlZCBlcnJvciBvYmplY3RzIG9mIHRoZSBhc3luYyB2YWxpZGF0b3JzIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKiBAc2VlIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgXG4gICAqXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZUFzeW5jKHZhbGlkYXRvcnM6IChBc3luY1ZhbGlkYXRvckZufG51bGwpW10pOiBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiBjb21wb3NlQXN5bmModmFsaWRhdG9ycyk7XG4gIH1cbn1cblxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbnVtYmVyLlxuICogU2VlIGBWYWxpZGF0b3JzLm1pbmAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW5WYWxpZGF0b3IobWluOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgfHwgaXNFbXB0eUlucHV0VmFsdWUobWluKSkge1xuICAgICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgIC8vIENvbnRyb2xzIHdpdGggTmFOIHZhbHVlcyBhZnRlciBwYXJzaW5nIHNob3VsZCBiZSB0cmVhdGVkIGFzIG5vdCBoYXZpbmcgYVxuICAgIC8vIG1pbmltdW0sIHBlciB0aGUgSFRNTCBmb3JtcyBzcGVjOiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1pblxuICAgIHJldHVybiAhaXNOYU4odmFsdWUpICYmIHZhbHVlIDwgbWluID8geydtaW4nOiB7J21pbic6IG1pbiwgJ2FjdHVhbCc6IGNvbnRyb2wudmFsdWV9fSA6IG51bGw7XG4gIH07XG59XG5cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIG51bWJlci5cbiAqIFNlZSBgVmFsaWRhdG9ycy5tYXhgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4VmFsaWRhdG9yKG1heDogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgaWYgKGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpIHx8IGlzRW1wdHlJbnB1dFZhbHVlKG1heCkpIHtcbiAgICAgIHJldHVybiBudWxsOyAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgfVxuICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdChjb250cm9sLnZhbHVlKTtcbiAgICAvLyBDb250cm9scyB3aXRoIE5hTiB2YWx1ZXMgYWZ0ZXIgcGFyc2luZyBzaG91bGQgYmUgdHJlYXRlZCBhcyBub3QgaGF2aW5nIGFcbiAgICAvLyBtYXhpbXVtLCBwZXIgdGhlIEhUTUwgZm9ybXMgc3BlYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1tYXhcbiAgICByZXR1cm4gIWlzTmFOKHZhbHVlKSAmJiB2YWx1ZSA+IG1heCA/IHsnbWF4JzogeydtYXgnOiBtYXgsICdhY3R1YWwnOiBjb250cm9sLnZhbHVlfX0gOiBudWxsO1xuICB9O1xufVxuXG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sIGhhdmUgYSBub24tZW1wdHkgdmFsdWUuXG4gKiBTZWUgYFZhbGlkYXRvcnMucmVxdWlyZWRgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZWRWYWxpZGF0b3IoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgcmV0dXJuIGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpID8geydyZXF1aXJlZCc6IHRydWV9IDogbnVsbDtcbn1cblxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIGJlIHRydWUuIFRoaXMgdmFsaWRhdG9yIGlzIGNvbW1vbmx5XG4gKiB1c2VkIGZvciByZXF1aXJlZCBjaGVja2JveGVzLlxuICogU2VlIGBWYWxpZGF0b3JzLnJlcXVpcmVkVHJ1ZWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlZFRydWVWYWxpZGF0b3IoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgcmV0dXJuIGNvbnRyb2wudmFsdWUgPT09IHRydWUgPyBudWxsIDogeydyZXF1aXJlZCc6IHRydWV9O1xufVxuXG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgcGFzcyBhbiBlbWFpbCB2YWxpZGF0aW9uIHRlc3QuXG4gKiBTZWUgYFZhbGlkYXRvcnMuZW1haWxgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1haWxWYWxpZGF0b3IoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgaWYgKGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgfVxuICByZXR1cm4gRU1BSUxfUkVHRVhQLnRlc3QoY29udHJvbC52YWx1ZSkgPyBudWxsIDogeydlbWFpbCc6IHRydWV9O1xufVxuXG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBsZW5ndGggb2YgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWxcbiAqIHRvIHRoZSBwcm92aWRlZCBtaW5pbXVtIGxlbmd0aC4gU2VlIGBWYWxpZGF0b3JzLm1pbkxlbmd0aGAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW5MZW5ndGhWYWxpZGF0b3IobWluTGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgfHwgIWhhc1ZhbGlkTGVuZ3RoKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgIC8vIGRvbid0IHZhbGlkYXRlIHZhbHVlcyB3aXRob3V0IGBsZW5ndGhgIHByb3BlcnR5XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udHJvbC52YWx1ZS5sZW5ndGggPCBtaW5MZW5ndGggP1xuICAgICAgICB7J21pbmxlbmd0aCc6IHsncmVxdWlyZWRMZW5ndGgnOiBtaW5MZW5ndGgsICdhY3R1YWxMZW5ndGgnOiBjb250cm9sLnZhbHVlLmxlbmd0aH19IDpcbiAgICAgICAgbnVsbDtcbiAgfTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgbGVuZ3RoIG9mIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgbGVzcyB0aGFuIG9yIGVxdWFsXG4gKiB0byB0aGUgcHJvdmlkZWQgbWF4aW11bSBsZW5ndGguIFNlZSBgVmFsaWRhdG9ycy5tYXhMZW5ndGhgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4TGVuZ3RoVmFsaWRhdG9yKG1heExlbmd0aDogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCA9PiB7XG4gICAgcmV0dXJuIGhhc1ZhbGlkTGVuZ3RoKGNvbnRyb2wudmFsdWUpICYmIGNvbnRyb2wudmFsdWUubGVuZ3RoID4gbWF4TGVuZ3RoID9cbiAgICAgICAgeydtYXhsZW5ndGgnOiB7J3JlcXVpcmVkTGVuZ3RoJzogbWF4TGVuZ3RoLCAnYWN0dWFsTGVuZ3RoJzogY29udHJvbC52YWx1ZS5sZW5ndGh9fSA6XG4gICAgICAgIG51bGw7XG4gIH07XG59XG5cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBtYXRjaCBhIHJlZ2V4IHBhdHRlcm4uXG4gKiBTZWUgYFZhbGlkYXRvcnMucGF0dGVybmAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXR0ZXJuVmFsaWRhdG9yKHBhdHRlcm46IHN0cmluZ3xSZWdFeHApOiBWYWxpZGF0b3JGbiB7XG4gIGlmICghcGF0dGVybikgcmV0dXJuIG51bGxWYWxpZGF0b3I7XG4gIGxldCByZWdleDogUmVnRXhwO1xuICBsZXQgcmVnZXhTdHI6IHN0cmluZztcbiAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgIHJlZ2V4U3RyID0gJyc7XG5cbiAgICBpZiAocGF0dGVybi5jaGFyQXQoMCkgIT09ICdeJykgcmVnZXhTdHIgKz0gJ14nO1xuXG4gICAgcmVnZXhTdHIgKz0gcGF0dGVybjtcblxuICAgIGlmIChwYXR0ZXJuLmNoYXJBdChwYXR0ZXJuLmxlbmd0aCAtIDEpICE9PSAnJCcpIHJlZ2V4U3RyICs9ICckJztcblxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XG4gIH0gZWxzZSB7XG4gICAgcmVnZXhTdHIgPSBwYXR0ZXJuLnRvU3RyaW5nKCk7XG4gICAgcmVnZXggPSBwYXR0ZXJuO1xuICB9XG4gIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgIHJldHVybiBudWxsOyAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgfVxuICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSBjb250cm9sLnZhbHVlO1xuICAgIHJldHVybiByZWdleC50ZXN0KHZhbHVlKSA/IG51bGwgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsncGF0dGVybic6IHsncmVxdWlyZWRQYXR0ZXJuJzogcmVnZXhTdHIsICdhY3R1YWxWYWx1ZSc6IHZhbHVlfX07XG4gIH07XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCBoYXMgYFZhbGlkYXRvckZuYCBzaGFwZSwgYnV0IHBlcmZvcm1zIG5vIG9wZXJhdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG51bGxWYWxpZGF0b3IoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzUHJlc2VudChvOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIG8gIT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JzZXJ2YWJsZSh2YWx1ZTogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgY29uc3Qgb2JzID0gaXNQcm9taXNlKHZhbHVlKSA/IGZyb20odmFsdWUpIDogdmFsdWU7XG4gIGlmIChOR19ERVZfTU9ERSAmJiAhKGlzT2JzZXJ2YWJsZShvYnMpKSkge1xuICAgIGxldCBlcnJvck1lc3NhZ2UgPSBgRXhwZWN0ZWQgYXN5bmMgdmFsaWRhdG9yIHRvIHJldHVybiBQcm9taXNlIG9yIE9ic2VydmFibGUuYDtcbiAgICAvLyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciB3aWxsIHJldHVybiBvYmplY3Qgb3IgbnVsbC5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgZXJyb3JNZXNzYWdlICs9XG4gICAgICAgICAgJyBBcmUgeW91IHVzaW5nIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIHdoZXJlIGFuIGFzeW5jIHZhbGlkYXRvciBpcyBleHBlY3RlZD8nO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFJ1bnRpbWVFcnJvckNvZGUuV1JPTkdfVkFMSURBVE9SX1JFVFVSTl9UWVBFLCBlcnJvck1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBvYnM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRXJyb3JzKGFycmF5T2ZFcnJvcnM6IChWYWxpZGF0aW9uRXJyb3JzfG51bGwpW10pOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICBsZXQgcmVzOiB7W2tleTogc3RyaW5nXTogYW55fSA9IHt9O1xuXG4gIC8vIE5vdCB1c2luZyBBcnJheS5yZWR1Y2UgaGVyZSBkdWUgdG8gYSBDaHJvbWUgODAgYnVnXG4gIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTEwNDk5ODJcbiAgYXJyYXlPZkVycm9ycy5mb3JFYWNoKChlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCkgPT4ge1xuICAgIHJlcyA9IGVycm9ycyAhPSBudWxsID8gey4uLnJlcyEsIC4uLmVycm9yc30gOiByZXMhO1xuICB9KTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMocmVzKS5sZW5ndGggPT09IDAgPyBudWxsIDogcmVzO1xufVxuXG50eXBlIEdlbmVyaWNWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGFueTtcblxuZnVuY3Rpb24gZXhlY3V0ZVZhbGlkYXRvcnM8ViBleHRlbmRzIEdlbmVyaWNWYWxpZGF0b3JGbj4oXG4gICAgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCB2YWxpZGF0b3JzOiBWW10pOiBSZXR1cm5UeXBlPFY+W10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHZhbGlkYXRvcihjb250cm9sKSk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRhdG9yRm48Vj4odmFsaWRhdG9yOiBWfFZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvcik6IHZhbGlkYXRvciBpcyBWIHtcbiAgcmV0dXJuICEodmFsaWRhdG9yIGFzIFZhbGlkYXRvcikudmFsaWRhdGU7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyB0aGF0IG1heSBjb250YWluIGJvdGggZnVuY3Rpb25zIGFzIHdlbGwgYXMgY2xhc3NlcywgcmV0dXJuIHRoZSBsaXN0XG4gKiBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zIChjb252ZXJ0IHZhbGlkYXRvciBjbGFzc2VzIGludG8gdmFsaWRhdG9yIGZ1bmN0aW9ucykuIFRoaXMgaXMgbmVlZGVkIHRvXG4gKiBoYXZlIGNvbnNpc3RlbnQgc3RydWN0dXJlIGluIHZhbGlkYXRvcnMgbGlzdCBiZWZvcmUgY29tcG9zaW5nIHRoZW0uXG4gKlxuICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIHNldCBvZiB2YWxpZGF0b3JzIHRoYXQgbWF5IGNvbnRhaW4gdmFsaWRhdG9ycyBib3RoIGluIHBsYWluIGZ1bmN0aW9uIGZvcm1cbiAqICAgICBhcyB3ZWxsIGFzIHJlcHJlc2VudGVkIGFzIGEgdmFsaWRhdG9yIGNsYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVmFsaWRhdG9yczxWPih2YWxpZGF0b3JzOiAoVnxWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3IpW10pOiBWW10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHtcbiAgICByZXR1cm4gaXNWYWxpZGF0b3JGbjxWPih2YWxpZGF0b3IpID9cbiAgICAgICAgdmFsaWRhdG9yIDpcbiAgICAgICAgKChjOiBBYnN0cmFjdENvbnRyb2wpID0+IHZhbGlkYXRvci52YWxpZGF0ZShjKSkgYXMgdW5rbm93biBhcyBWO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNZXJnZXMgc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAqIFNlZSBgVmFsaWRhdG9ycy5jb21wb3NlYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZSh2YWxpZGF0b3JzOiAoVmFsaWRhdG9yRm58bnVsbHx1bmRlZmluZWQpW118bnVsbCk6IFZhbGlkYXRvckZufG51bGwge1xuICBpZiAoIXZhbGlkYXRvcnMpIHJldHVybiBudWxsO1xuICBjb25zdCBwcmVzZW50VmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCkgYXMgYW55O1xuICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICByZXR1cm4gbWVyZ2VFcnJvcnMoZXhlY3V0ZVZhbGlkYXRvcnM8VmFsaWRhdG9yRm4+KGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKSk7XG4gIH07XG59XG5cbi8qKlxuICogQWNjZXB0cyBhIGxpc3Qgb2YgdmFsaWRhdG9ycyBvZiBkaWZmZXJlbnQgcG9zc2libGUgc2hhcGVzIChgVmFsaWRhdG9yYCBhbmQgYFZhbGlkYXRvckZuYCksXG4gKiBub3JtYWxpemVzIHRoZSBsaXN0IChjb252ZXJ0cyBldmVyeXRoaW5nIHRvIGBWYWxpZGF0b3JGbmApIGFuZCBtZXJnZXMgdGhlbSBpbnRvIGEgc2luZ2xlXG4gKiB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBcnJheTxWYWxpZGF0b3J8VmFsaWRhdG9yRm4+KTogVmFsaWRhdG9yRm58bnVsbCB7XG4gIHJldHVybiB2YWxpZGF0b3JzICE9IG51bGwgPyBjb21wb3NlKG5vcm1hbGl6ZVZhbGlkYXRvcnM8VmFsaWRhdG9yRm4+KHZhbGlkYXRvcnMpKSA6IG51bGw7XG59XG5cbi8qKlxuICogTWVyZ2VzIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uLlxuICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2VBc3luY2AgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VBc3luYyh2YWxpZGF0b3JzOiAoQXN5bmNWYWxpZGF0b3JGbnxudWxsKVtdKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgaWYgKCF2YWxpZGF0b3JzKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcHJlc2VudFZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm5bXSA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCkgYXMgYW55O1xuICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9XG4gICAgICAgIGV4ZWN1dGVWYWxpZGF0b3JzPEFzeW5jVmFsaWRhdG9yRm4+KGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKS5tYXAodG9PYnNlcnZhYmxlKTtcbiAgICByZXR1cm4gZm9ya0pvaW4ob2JzZXJ2YWJsZXMpLnBpcGUobWFwKG1lcmdlRXJyb3JzKSk7XG4gIH07XG59XG5cbi8qKlxuICogQWNjZXB0cyBhIGxpc3Qgb2YgYXN5bmMgdmFsaWRhdG9ycyBvZiBkaWZmZXJlbnQgcG9zc2libGUgc2hhcGVzIChgQXN5bmNWYWxpZGF0b3JgIGFuZFxuICogYEFzeW5jVmFsaWRhdG9yRm5gKSwgbm9ybWFsaXplcyB0aGUgbGlzdCAoY29udmVydHMgZXZlcnl0aGluZyB0byBgQXN5bmNWYWxpZGF0b3JGbmApIGFuZCBtZXJnZXNcbiAqIHRoZW0gaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFycmF5PEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4+KTpcbiAgICBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICByZXR1cm4gdmFsaWRhdG9ycyAhPSBudWxsID8gY29tcG9zZUFzeW5jKG5vcm1hbGl6ZVZhbGlkYXRvcnM8QXN5bmNWYWxpZGF0b3JGbj4odmFsaWRhdG9ycykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG59XG5cbi8qKlxuICogTWVyZ2VzIHJhdyBjb250cm9sIHZhbGlkYXRvcnMgd2l0aCBhIGdpdmVuIGRpcmVjdGl2ZSB2YWxpZGF0b3IgYW5kIHJldHVybnMgdGhlIGNvbWJpbmVkIGxpc3Qgb2ZcbiAqIHZhbGlkYXRvcnMgYXMgYW4gYXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVZhbGlkYXRvcnM8Vj4oY29udHJvbFZhbGlkYXRvcnM6IFZ8VltdfG51bGwsIGRpclZhbGlkYXRvcjogVik6IFZbXSB7XG4gIGlmIChjb250cm9sVmFsaWRhdG9ycyA9PT0gbnVsbCkgcmV0dXJuIFtkaXJWYWxpZGF0b3JdO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShjb250cm9sVmFsaWRhdG9ycykgPyBbLi4uY29udHJvbFZhbGlkYXRvcnMsIGRpclZhbGlkYXRvcl0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY29udHJvbFZhbGlkYXRvcnMsIGRpclZhbGlkYXRvcl07XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBsaXN0IG9mIHJhdyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGF0dGFjaGVkIHRvIGEgZ2l2ZW4gY29udHJvbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCB7XG4gIHJldHVybiAoY29udHJvbCBhcyBhbnkpLl9yYXdWYWxpZGF0b3JzIGFzIFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGw7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBsaXN0IG9mIHJhdyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhdHRhY2hlZCB0byBhIGdpdmVuIGNvbnRyb2wuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IEFzeW5jVmFsaWRhdG9yRm58XG4gICAgQXN5bmNWYWxpZGF0b3JGbltdfG51bGwge1xuICByZXR1cm4gKGNvbnRyb2wgYXMgYW55KS5fcmF3QXN5bmNWYWxpZGF0b3JzIGFzIEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsO1xufVxuXG4vKipcbiAqIEFjY2VwdHMgYSBzaW5nbGV0b24gdmFsaWRhdG9yLCBhbiBhcnJheSwgb3IgbnVsbCwgYW5kIHJldHVybnMgYW4gYXJyYXkgdHlwZSB3aXRoIHRoZSBwcm92aWRlZFxuICogdmFsaWRhdG9ycy5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBBIHZhbGlkYXRvciwgdmFsaWRhdG9ycywgb3IgbnVsbC5cbiAqIEByZXR1cm5zIEEgdmFsaWRhdG9ycyBhcnJheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VWYWxpZGF0b3JzQXJyYXk8VCBleHRlbmRzIFZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm4+KHZhbGlkYXRvcnM6IFR8VFtdfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwpOiBUW10ge1xuICBpZiAoIXZhbGlkYXRvcnMpIHJldHVybiBbXTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzIDogW3ZhbGlkYXRvcnNdO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIGFycmF5IGhhcyBhIGdpdmVuIHZhbGlkYXRvci5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gY29tcGFyZSBhZ2FpbnN0LlxuICogQHBhcmFtIHZhbGlkYXRvciBUaGUgdmFsaWRhdG9yIHRvIGNoZWNrLlxuICogQHJldHVybnMgV2hldGhlciB0aGUgdmFsaWRhdG9yIGlzIHByZXNlbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNWYWxpZGF0b3I8VCBleHRlbmRzIFZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm4+KFxuICAgIHZhbGlkYXRvcnM6IFR8VFtdfG51bGwsIHZhbGlkYXRvcjogVCk6IGJvb2xlYW4ge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JzKSA/IHZhbGlkYXRvcnMuaW5jbHVkZXModmFsaWRhdG9yKSA6IHZhbGlkYXRvcnMgPT09IHZhbGlkYXRvcjtcbn1cblxuLyoqXG4gKiBDb21iaW5lcyB0d28gYXJyYXlzIG9mIHZhbGlkYXRvcnMgaW50byBvbmUuIElmIGR1cGxpY2F0ZXMgYXJlIHByb3ZpZGVkLCBvbmx5IG9uZSB3aWxsIGJlIGFkZGVkLlxuICpcbiAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBuZXcgdmFsaWRhdG9ycy5cbiAqIEBwYXJhbSBjdXJyZW50VmFsaWRhdG9ycyBUaGUgYmFzZSBhcnJheSBvZiBjdXJycmVudCB2YWxpZGF0b3JzLlxuICogQHJldHVybnMgQW4gYXJyYXkgb2YgdmFsaWRhdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFZhbGlkYXRvcnM8VCBleHRlbmRzIFZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm4+KFxuICAgIHZhbGlkYXRvcnM6IFR8VFtdLCBjdXJyZW50VmFsaWRhdG9yczogVHxUW118bnVsbCk6IFRbXSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBtYWtlVmFsaWRhdG9yc0FycmF5KGN1cnJlbnRWYWxpZGF0b3JzKTtcbiAgY29uc3QgdmFsaWRhdG9yc1RvQWRkID0gbWFrZVZhbGlkYXRvcnNBcnJheSh2YWxpZGF0b3JzKTtcbiAgdmFsaWRhdG9yc1RvQWRkLmZvckVhY2goKHY6IFQpID0+IHtcbiAgICAvLyBOb3RlOiBpZiB0aGVyZSBhcmUgZHVwbGljYXRlIGVudHJpZXMgaW4gdGhlIG5ldyB2YWxpZGF0b3JzIGFycmF5LFxuICAgIC8vIG9ubHkgdGhlIGZpcnN0IG9uZSB3b3VsZCBiZSBhZGRlZCB0byB0aGUgY3VycmVudCBsaXN0IG9mIHZhbGlkYXJvcnMuXG4gICAgLy8gRHVwbGljYXRlIG9uZXMgd291bGQgYmUgaWdub3JlZCBzaW5jZSBgaGFzVmFsaWRhdG9yYCB3b3VsZCBkZXRlY3RcbiAgICAvLyB0aGUgcHJlc2VuY2Ugb2YgYSB2YWxpZGF0b3IgZnVuY3Rpb24gYW5kIHdlIHVwZGF0ZSB0aGUgY3VycmVudCBsaXN0IGluIHBsYWNlLlxuICAgIGlmICghaGFzVmFsaWRhdG9yKGN1cnJlbnQsIHYpKSB7XG4gICAgICBjdXJyZW50LnB1c2godik7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGN1cnJlbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVWYWxpZGF0b3JzPFQgZXh0ZW5kcyBWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuPihcbiAgICB2YWxpZGF0b3JzOiBUfFRbXSwgY3VycmVudFZhbGlkYXRvcnM6IFR8VFtdfG51bGwpOiBUW10ge1xuICByZXR1cm4gbWFrZVZhbGlkYXRvcnNBcnJheShjdXJyZW50VmFsaWRhdG9ycykuZmlsdGVyKHYgPT4gIWhhc1ZhbGlkYXRvcih2YWxpZGF0b3JzLCB2KSk7XG59XG4iXX0=