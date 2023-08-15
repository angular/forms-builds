/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, ɵisPromise as isPromise, ɵisSubscribable as isSubscribable, ɵRuntimeError as RuntimeError } from '@angular/core';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
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
 * @see {@link NG_ASYNC_VALIDATORS}
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
 * @see {@link NG_VALIDATORS}
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
     * @see {@link updateValueAndValidity()}
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
     * @see {@link updateValueAndValidity()}
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
     * @see {@link updateValueAndValidity()}
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
     * @see {@link updateValueAndValidity()}
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
     * pattern suitable for common use cases. The pattern is based on the definition of a valid email
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
     * @see {@link updateValueAndValidity()}
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
     * @see {@link updateValueAndValidity()}
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
     * @see {@link updateValueAndValidity()}
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
     * @see {@link updateValueAndValidity()}
     *
     */
    static pattern(pattern) {
        return patternValidator(pattern);
    }
    /**
     * @description
     * Validator that performs no operation.
     *
     * @see {@link updateValueAndValidity()}
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
     * @see {@link updateValueAndValidity()}
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
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && !(isSubscribable(obs))) {
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
 * @param currentValidators The base array of current validators.
 * @returns An array of validators.
 */
export function addValidators(validators, currentValidators) {
    const current = makeValidatorsArray(currentValidators);
    const validatorsToAdd = makeValidatorsArray(validators);
    validatorsToAdd.forEach((v) => {
        // Note: if there are duplicate entries in the new validators array,
        // only the first one would be added to the current list of validators.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUUsVUFBVSxJQUFJLFNBQVMsRUFBRSxlQUFlLElBQUksY0FBYyxFQUFFLGFBQWEsSUFBSSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEksT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBT25DLFNBQVMsaUJBQWlCLENBQUMsS0FBVTtJQUNuQzs7OztPQUlHO0lBQ0gsT0FBTyxLQUFLLElBQUksSUFBSTtRQUNoQixDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFVO0lBQ2hDLHdGQUF3RjtJQUN4RixPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztBQUMzRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJCRztBQUNILE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBb0MsY0FBYyxDQUFDLENBQUM7QUFFbkc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxNQUFNLENBQUMsTUFBTSxtQkFBbUIsR0FDNUIsSUFBSSxjQUFjLENBQW9DLG1CQUFtQixDQUFDLENBQUM7QUFFL0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkJH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QUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGlvblRva2VuLCDJtWlzUHJvbWlzZSBhcyBpc1Byb21pc2UsIMm1aXNTdWJzY3JpYmFibGUgYXMgaXNTdWJzY3JpYmFibGUsIMm1UnVudGltZUVycm9yIGFzIFJ1bnRpbWVFcnJvcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2ZvcmtKb2luLCBmcm9tLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7UnVudGltZUVycm9yQ29kZX0gZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4vbW9kZWwvYWJzdHJhY3RfbW9kZWwnO1xuXG5cbmZ1bmN0aW9uIGlzRW1wdHlJbnB1dFZhbHVlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgLyoqXG4gICAqIENoZWNrIGlmIHRoZSBvYmplY3QgaXMgYSBzdHJpbmcgb3IgYXJyYXkgYmVmb3JlIGV2YWx1YXRpbmcgdGhlIGxlbmd0aCBhdHRyaWJ1dGUuXG4gICAqIFRoaXMgYXZvaWRzIGZhbHNlbHkgcmVqZWN0aW5nIG9iamVjdHMgdGhhdCBjb250YWluIGEgY3VzdG9tIGxlbmd0aCBhdHRyaWJ1dGUuXG4gICAqIEZvciBleGFtcGxlLCB0aGUgb2JqZWN0IHtpZDogMSwgbGVuZ3RoOiAwLCB3aWR0aDogMH0gc2hvdWxkIG5vdCBiZSByZXR1cm5lZCBhcyBlbXB0eS5cbiAgICovXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsIHx8XG4gICAgICAoKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCk7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkTGVuZ3RoKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgLy8gbm9uLXN0cmljdCBjb21wYXJpc29uIGlzIGludGVudGlvbmFsLCB0byBjaGVjayBmb3IgYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgIHZhbHVlc1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUubGVuZ3RoID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBJbmplY3Rpb25Ub2tlbmAgZm9yIHJlZ2lzdGVyaW5nIGFkZGl0aW9uYWwgc3luY2hyb25vdXMgdmFsaWRhdG9ycyB1c2VkIHdpdGhcbiAqIGBBYnN0cmFjdENvbnRyb2xgcy5cbiAqXG4gKiBAc2VlIHtAbGluayBOR19BU1lOQ19WQUxJREFUT1JTfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFByb3ZpZGluZyBhIGN1c3RvbSB2YWxpZGF0b3JcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgY3VzdG9tIHZhbGlkYXRvciBkaXJlY3RpdmUuIEFkZGluZyB0aGUgdmFsaWRhdG9yIHRvIHRoZVxuICogZXhpc3RpbmcgY29sbGVjdGlvbiBvZiB2YWxpZGF0b3JzIHJlcXVpcmVzIHRoZSBgbXVsdGk6IHRydWVgIG9wdGlvbi5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tVmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICogICAgIHJldHVybiB7ICdjdXN0b20nOiB0cnVlIH07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IE5HX1ZBTElEQVRPUlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48UmVhZG9ubHlBcnJheTxWYWxpZGF0b3J8RnVuY3Rpb24+PignTmdWYWxpZGF0b3JzJyk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBbiBgSW5qZWN0aW9uVG9rZW5gIGZvciByZWdpc3RlcmluZyBhZGRpdGlvbmFsIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHVzZWQgd2l0aFxuICogYEFic3RyYWN0Q29udHJvbGBzLlxuICpcbiAqIEBzZWUge0BsaW5rIE5HX1ZBTElEQVRPUlN9XG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgUHJvdmlkZSBhIGN1c3RvbSBhc3luYyB2YWxpZGF0b3IgZGlyZWN0aXZlXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGltcGxlbWVudHMgdGhlIGBBc3luY1ZhbGlkYXRvcmAgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhblxuICogYXN5bmMgdmFsaWRhdG9yIGRpcmVjdGl2ZSB3aXRoIGEgY3VzdG9tIGVycm9yIGtleS5cbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBARGlyZWN0aXZlKHtcbiAqICAgc2VsZWN0b3I6ICdbY3VzdG9tQXN5bmNWYWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX0FTWU5DX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSwgbXVsdGk6XG4gKiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21Bc3luY1ZhbGlkYXRvckRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFzeW5jVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogUHJvbWlzZTxWYWxpZGF0aW9uRXJyb3JzfG51bGw+IHtcbiAqICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsnY3VzdG9tJzogdHJ1ZX0pO1xuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBOR19BU1lOQ19WQUxJREFUT1JTID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48UmVhZG9ubHlBcnJheTxWYWxpZGF0b3J8RnVuY3Rpb24+PignTmdBc3luY1ZhbGlkYXRvcnMnKTtcblxuLyoqXG4gKiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IG1hdGNoZXMgdmFsaWQgZS1tYWlsIGFkZHJlc3Nlcy5cbiAqXG4gKiBBdCBhIGhpZ2ggbGV2ZWwsIHRoaXMgcmVnZXhwIG1hdGNoZXMgZS1tYWlsIGFkZHJlc3NlcyBvZiB0aGUgZm9ybWF0IGBsb2NhbC1wYXJ0QHRsZGAsIHdoZXJlOlxuICogLSBgbG9jYWwtcGFydGAgY29uc2lzdHMgb2Ygb25lIG9yIG1vcmUgb2YgdGhlIGFsbG93ZWQgY2hhcmFjdGVycyAoYWxwaGFudW1lcmljIGFuZCBzb21lXG4gKiAgIHB1bmN0dWF0aW9uIHN5bWJvbHMpLlxuICogLSBgbG9jYWwtcGFydGAgY2Fubm90IGJlZ2luIG9yIGVuZCB3aXRoIGEgcGVyaW9kIChgLmApLlxuICogLSBgbG9jYWwtcGFydGAgY2Fubm90IGJlIGxvbmdlciB0aGFuIDY0IGNoYXJhY3RlcnMuXG4gKiAtIGB0bGRgIGNvbnNpc3RzIG9mIG9uZSBvciBtb3JlIGBsYWJlbHNgIHNlcGFyYXRlZCBieSBwZXJpb2RzIChgLmApLiBGb3IgZXhhbXBsZSBgbG9jYWxob3N0YCBvclxuICogICBgZm9vLmNvbWAuXG4gKiAtIEEgYGxhYmVsYCBjb25zaXN0cyBvZiBvbmUgb3IgbW9yZSBvZiB0aGUgYWxsb3dlZCBjaGFyYWN0ZXJzIChhbHBoYW51bWVyaWMsIGRhc2hlcyAoYC1gKSBhbmRcbiAqICAgcGVyaW9kcyAoYC5gKSkuXG4gKiAtIEEgYGxhYmVsYCBjYW5ub3QgYmVnaW4gb3IgZW5kIHdpdGggYSBkYXNoIChgLWApIG9yIGEgcGVyaW9kIChgLmApLlxuICogLSBBIGBsYWJlbGAgY2Fubm90IGJlIGxvbmdlciB0aGFuIDYzIGNoYXJhY3RlcnMuXG4gKiAtIFRoZSB3aG9sZSBhZGRyZXNzIGNhbm5vdCBiZSBsb25nZXIgdGhhbiAyNTQgY2hhcmFjdGVycy5cbiAqXG4gKiAjIyBJbXBsZW1lbnRhdGlvbiBiYWNrZ3JvdW5kXG4gKlxuICogVGhpcyByZWdleHAgd2FzIHBvcnRlZCBvdmVyIGZyb20gQW5ndWxhckpTIChzZWUgdGhlcmUgZm9yIGdpdCBoaXN0b3J5KTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIuanMvYmxvYi9jMTMzZWY4MzYvc3JjL25nL2RpcmVjdGl2ZS9pbnB1dC5qcyNMMjdcbiAqIEl0IGlzIGJhc2VkIG9uIHRoZVxuICogW1dIQVRXRyB2ZXJzaW9uXShodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9pbnB1dC5odG1sI3ZhbGlkLWUtbWFpbC1hZGRyZXNzKSB3aXRoXG4gKiBzb21lIGVuaGFuY2VtZW50cyB0byBpbmNvcnBvcmF0ZSBtb3JlIFJGQyBydWxlcyAoc3VjaCBhcyBydWxlcyByZWxhdGVkIHRvIGRvbWFpbiBuYW1lcyBhbmQgdGhlXG4gKiBsZW5ndGhzIG9mIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgYWRkcmVzcykuIFRoZSBtYWluIGRpZmZlcmVuY2VzIGZyb20gdGhlIFdIQVRXRyB2ZXJzaW9uIGFyZTpcbiAqICAgLSBEaXNhbGxvdyBgbG9jYWwtcGFydGAgdG8gYmVnaW4gb3IgZW5kIHdpdGggYSBwZXJpb2QgKGAuYCkuXG4gKiAgIC0gRGlzYWxsb3cgYGxvY2FsLXBhcnRgIGxlbmd0aCB0byBleGNlZWQgNjQgY2hhcmFjdGVycy5cbiAqICAgLSBEaXNhbGxvdyB0b3RhbCBhZGRyZXNzIGxlbmd0aCB0byBleGNlZWQgMjU0IGNoYXJhY3RlcnMuXG4gKlxuICogU2VlIFt0aGlzIGNvbW1pdF0oaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci5qcy9jb21taXQvZjNmNWNmNzJlKSBmb3IgbW9yZSBkZXRhaWxzLlxuICovXG5jb25zdCBFTUFJTF9SRUdFWFAgPVxuICAgIC9eKD89LnsxLDI1NH0kKSg/PS57MSw2NH1AKVthLXpBLVowLTkhIyQlJicqKy89P15fYHt8fX4tXSsoPzpcXC5bYS16QS1aMC05ISMkJSYnKisvPT9eX2B7fH1+LV0rKSpAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVzIGEgc2V0IG9mIGJ1aWx0LWluIHZhbGlkYXRvcnMgdGhhdCBjYW4gYmUgdXNlZCBieSBmb3JtIGNvbnRyb2xzLlxuICpcbiAqIEEgdmFsaWRhdG9yIGlzIGEgZnVuY3Rpb24gdGhhdCBwcm9jZXNzZXMgYSBgRm9ybUNvbnRyb2xgIG9yIGNvbGxlY3Rpb24gb2ZcbiAqIGNvbnRyb2xzIGFuZCByZXR1cm5zIGFuIGVycm9yIG1hcCBvciBudWxsLiBBIG51bGwgbWFwIG1lYW5zIHRoYXQgdmFsaWRhdGlvbiBoYXMgcGFzc2VkLlxuICpcbiAqIEBzZWUgW0Zvcm0gVmFsaWRhdGlvbl0oL2d1aWRlL2Zvcm0tdmFsaWRhdGlvbilcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0b3JzIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbnVtYmVyLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgYWdhaW5zdCBhIG1pbmltdW0gb2YgM1xuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woMiwgVmFsaWRhdG9ycy5taW4oMykpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHttaW46IHttaW46IDMsIGFjdHVhbDogMn19XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAqIGBtaW5gIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAqXG4gICAqL1xuICBzdGF0aWMgbWluKG1pbjogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiBtaW5WYWxpZGF0b3IobWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHByb3ZpZGVkIG51bWJlci5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIGFnYWluc3QgYSBtYXhpbXVtIG9mIDE1XG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgxNiwgVmFsaWRhdG9ycy5tYXgoMTUpKTtcbiAgICpcbiAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7bWF4OiB7bWF4OiAxNSwgYWN0dWFsOiAxNn19XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAqIGBtYXhgIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAqXG4gICAqL1xuICBzdGF0aWMgbWF4KG1heDogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiBtYXhWYWxpZGF0b3IobWF4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wgaGF2ZSBhIG5vbi1lbXB0eSB2YWx1ZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIGlzIG5vbi1lbXB0eVxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtyZXF1aXJlZDogdHJ1ZX1cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGVycm9yIG1hcCB3aXRoIHRoZSBgcmVxdWlyZWRgIHByb3BlcnR5XG4gICAqIGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAqXG4gICAqL1xuICBzdGF0aWMgcmVxdWlyZWQoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gcmVxdWlyZWRWYWxpZGF0b3IoY29udHJvbCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgYmUgdHJ1ZS4gVGhpcyB2YWxpZGF0b3IgaXMgY29tbW9ubHlcbiAgICogdXNlZCBmb3IgcmVxdWlyZWQgY2hlY2tib3hlcy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIHZhbHVlIGlzIHRydWVcbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdzb21lIHZhbHVlJywgVmFsaWRhdG9ycy5yZXF1aXJlZFRydWUpO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhjb250cm9sLmVycm9ycyk7IC8vIHtyZXF1aXJlZDogdHJ1ZX1cbiAgICogYGBgXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGVycm9yIG1hcCB0aGF0IGNvbnRhaW5zIHRoZSBgcmVxdWlyZWRgIHByb3BlcnR5XG4gICAqIHNldCB0byBgdHJ1ZWAgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZFRydWUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gcmVxdWlyZWRUcnVlVmFsaWRhdG9yKGNvbnRyb2wpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHBhc3MgYW4gZW1haWwgdmFsaWRhdGlvbiB0ZXN0LlxuICAgKlxuICAgKiBUZXN0cyB0aGUgdmFsdWUgdXNpbmcgYSBbcmVndWxhclxuICAgKiBleHByZXNzaW9uXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L0d1aWRlL1JlZ3VsYXJfRXhwcmVzc2lvbnMpXG4gICAqIHBhdHRlcm4gc3VpdGFibGUgZm9yIGNvbW1vbiB1c2UgY2FzZXMuIFRoZSBwYXR0ZXJuIGlzIGJhc2VkIG9uIHRoZSBkZWZpbml0aW9uIG9mIGEgdmFsaWQgZW1haWxcbiAgICogYWRkcmVzcyBpbiB0aGUgW1dIQVRXRyBIVE1MXG4gICAqIHNwZWNpZmljYXRpb25dKGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2lucHV0Lmh0bWwjdmFsaWQtZS1tYWlsLWFkZHJlc3MpIHdpdGhcbiAgICogc29tZSBlbmhhbmNlbWVudHMgdG8gaW5jb3Jwb3JhdGUgbW9yZSBSRkMgcnVsZXMgKHN1Y2ggYXMgcnVsZXMgcmVsYXRlZCB0byBkb21haW4gbmFtZXMgYW5kIHRoZVxuICAgKiBsZW5ndGhzIG9mIGRpZmZlcmVudCBwYXJ0cyBvZiB0aGUgYWRkcmVzcykuXG4gICAqXG4gICAqIFRoZSBkaWZmZXJlbmNlcyBmcm9tIHRoZSBXSEFUV0cgdmVyc2lvbiBpbmNsdWRlOlxuICAgKiAtIERpc2FsbG93IGBsb2NhbC1wYXJ0YCAodGhlIHBhcnQgYmVmb3JlIHRoZSBgQGAgc3ltYm9sKSB0byBiZWdpbiBvciBlbmQgd2l0aCBhIHBlcmlvZCAoYC5gKS5cbiAgICogLSBEaXNhbGxvdyBgbG9jYWwtcGFydGAgdG8gYmUgbG9uZ2VyIHRoYW4gNjQgY2hhcmFjdGVycy5cbiAgICogLSBEaXNhbGxvdyB0aGUgd2hvbGUgYWRkcmVzcyB0byBiZSBsb25nZXIgdGhhbiAyNTQgY2hhcmFjdGVycy5cbiAgICpcbiAgICogSWYgdGhpcyBwYXR0ZXJuIGRvZXMgbm90IHNhdGlzZnkgeW91ciBidXNpbmVzcyBuZWVkcywgeW91IGNhbiB1c2UgYFZhbGlkYXRvcnMucGF0dGVybigpYCB0b1xuICAgKiB2YWxpZGF0ZSB0aGUgdmFsdWUgYWdhaW5zdCBhIGRpZmZlcmVudCBwYXR0ZXJuLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgbWF0Y2hlcyBhIHZhbGlkIGVtYWlsIHBhdHRlcm5cbiAgICpcbiAgICogYGBgdHlwZXNjcmlwdFxuICAgKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdiYWRAJywgVmFsaWRhdG9ycy5lbWFpbCk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge2VtYWlsOiB0cnVlfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQW4gZXJyb3IgbWFwIHdpdGggdGhlIGBlbWFpbGAgcHJvcGVydHlcbiAgICogaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyBlbWFpbChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiBlbWFpbFZhbGlkYXRvcihjb250cm9sKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGxlbmd0aCBvZiB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbFxuICAgKiB0byB0aGUgcHJvdmlkZWQgbWluaW11bSBsZW5ndGguIFRoaXMgdmFsaWRhdG9yIGlzIGFsc28gcHJvdmlkZWQgYnkgZGVmYXVsdCBpZiB5b3UgdXNlIHRoZVxuICAgKiB0aGUgSFRNTDUgYG1pbmxlbmd0aGAgYXR0cmlidXRlLiBOb3RlIHRoYXQgdGhlIGBtaW5MZW5ndGhgIHZhbGlkYXRvciBpcyBpbnRlbmRlZCB0byBiZSB1c2VkXG4gICAqIG9ubHkgZm9yIHR5cGVzIHRoYXQgaGF2ZSBhIG51bWVyaWMgYGxlbmd0aGAgcHJvcGVydHksIHN1Y2ggYXMgc3RyaW5ncyBvciBhcnJheXMuIFRoZVxuICAgKiBgbWluTGVuZ3RoYCB2YWxpZGF0b3IgbG9naWMgaXMgYWxzbyBub3QgaW52b2tlZCBmb3IgdmFsdWVzIHdoZW4gdGhlaXIgYGxlbmd0aGAgcHJvcGVydHkgaXMgMFxuICAgKiAoZm9yIGV4YW1wbGUgaW4gY2FzZSBvZiBhbiBlbXB0eSBzdHJpbmcgb3IgYW4gZW1wdHkgYXJyYXkpLCB0byBzdXBwb3J0IG9wdGlvbmFsIGNvbnRyb2xzLiBZb3VcbiAgICogY2FuIHVzZSB0aGUgc3RhbmRhcmQgYHJlcXVpcmVkYCB2YWxpZGF0b3IgaWYgZW1wdHkgdmFsdWVzIHNob3VsZCBub3QgYmUgY29uc2lkZXJlZCB2YWxpZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFZhbGlkYXRlIHRoYXQgdGhlIGZpZWxkIGhhcyBhIG1pbmltdW0gb2YgMyBjaGFyYWN0ZXJzXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnbmcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgzKSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge21pbmxlbmd0aDoge3JlcXVpcmVkTGVuZ3RoOiAzLCBhY3R1YWxMZW5ndGg6IDJ9fVxuICAgKiBgYGBcbiAgICpcbiAgICogYGBgaHRtbFxuICAgKiA8aW5wdXQgbWlubGVuZ3RoPVwiNVwiPlxuICAgKiBgYGBcbiAgICpcbiAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgKiBgbWlubGVuZ3RoYCBwcm9wZXJ0eSBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgKlxuICAgKi9cbiAgc3RhdGljIG1pbkxlbmd0aChtaW5MZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gbWluTGVuZ3RoVmFsaWRhdG9yKG1pbkxlbmd0aCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBsZW5ndGggb2YgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWxcbiAgICogdG8gdGhlIHByb3ZpZGVkIG1heGltdW0gbGVuZ3RoLiBUaGlzIHZhbGlkYXRvciBpcyBhbHNvIHByb3ZpZGVkIGJ5IGRlZmF1bHQgaWYgeW91IHVzZSB0aGVcbiAgICogdGhlIEhUTUw1IGBtYXhsZW5ndGhgIGF0dHJpYnV0ZS4gTm90ZSB0aGF0IHRoZSBgbWF4TGVuZ3RoYCB2YWxpZGF0b3IgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZFxuICAgKiBvbmx5IGZvciB0eXBlcyB0aGF0IGhhdmUgYSBudW1lcmljIGBsZW5ndGhgIHByb3BlcnR5LCBzdWNoIGFzIHN0cmluZ3Mgb3IgYXJyYXlzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgaGFzIG1heGltdW0gb2YgNSBjaGFyYWN0ZXJzXG4gICAqXG4gICAqIGBgYHR5cGVzY3JpcHRcbiAgICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnQW5ndWxhcicsIFZhbGlkYXRvcnMubWF4TGVuZ3RoKDUpKTtcbiAgICpcbiAgICogY29uc29sZS5sb2coY29udHJvbC5lcnJvcnMpOyAvLyB7bWF4bGVuZ3RoOiB7cmVxdWlyZWRMZW5ndGg6IDUsIGFjdHVhbExlbmd0aDogN319XG4gICAqIGBgYFxuICAgKlxuICAgKiBgYGBodG1sXG4gICAqIDxpbnB1dCBtYXhsZW5ndGg9XCI1XCI+XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcmV0dXJucyBBIHZhbGlkYXRvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZXJyb3IgbWFwIHdpdGggdGhlXG4gICAqIGBtYXhsZW5ndGhgIHByb3BlcnR5IGlmIHRoZSB2YWxpZGF0aW9uIGNoZWNrIGZhaWxzLCBvdGhlcndpc2UgYG51bGxgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCl9XG4gICAqXG4gICAqL1xuICBzdGF0aWMgbWF4TGVuZ3RoKG1heExlbmd0aDogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiBtYXhMZW5ndGhWYWxpZGF0b3IobWF4TGVuZ3RoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBtYXRjaCBhIHJlZ2V4IHBhdHRlcm4uIFRoaXMgdmFsaWRhdG9yIGlzIGFsc29cbiAgICogcHJvdmlkZWQgYnkgZGVmYXVsdCBpZiB5b3UgdXNlIHRoZSBIVE1MNSBgcGF0dGVybmAgYXR0cmlidXRlLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgVmFsaWRhdGUgdGhhdCB0aGUgZmllbGQgb25seSBjb250YWlucyBsZXR0ZXJzIG9yIHNwYWNlc1xuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJzEnLCBWYWxpZGF0b3JzLnBhdHRlcm4oJ1thLXpBLVogXSonKSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGNvbnRyb2wuZXJyb3JzKTsgLy8ge3BhdHRlcm46IHtyZXF1aXJlZFBhdHRlcm46ICdeW2EtekEtWiBdKiQnLCBhY3R1YWxWYWx1ZTogJzEnfX1cbiAgICogYGBgXG4gICAqXG4gICAqIGBgYGh0bWxcbiAgICogPGlucHV0IHBhdHRlcm49XCJbYS16QS1aIF0qXCI+XG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUGF0dGVybiBtYXRjaGluZyB3aXRoIHRoZSBnbG9iYWwgb3Igc3RpY2t5IGZsYWdcbiAgICpcbiAgICogYFJlZ0V4cGAgb2JqZWN0cyBjcmVhdGVkIHdpdGggdGhlIGBnYCBvciBgeWAgZmxhZ3MgdGhhdCBhcmUgcGFzc2VkIGludG8gYFZhbGlkYXRvcnMucGF0dGVybmBcbiAgICogY2FuIHByb2R1Y2UgZGlmZmVyZW50IHJlc3VsdHMgb24gdGhlIHNhbWUgaW5wdXQgd2hlbiB2YWxpZGF0aW9ucyBhcmUgcnVuIGNvbnNlY3V0aXZlbHkuIFRoaXMgaXNcbiAgICogZHVlIHRvIGhvdyB0aGUgYmVoYXZpb3Igb2YgYFJlZ0V4cC5wcm90b3R5cGUudGVzdGAgaXNcbiAgICogc3BlY2lmaWVkIGluIFtFQ01BLTI2Ml0oaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1yZWdleHBidWlsdGluZXhlYylcbiAgICogKGBSZWdFeHBgIHByZXNlcnZlcyB0aGUgaW5kZXggb2YgdGhlIGxhc3QgbWF0Y2ggd2hlbiB0aGUgZ2xvYmFsIG9yIHN0aWNreSBmbGFnIGlzIHVzZWQpLlxuICAgKiBEdWUgdG8gdGhpcyBiZWhhdmlvciwgaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB3aGVuIHVzaW5nXG4gICAqIGBWYWxpZGF0b3JzLnBhdHRlcm5gIHlvdSAqKmRvIG5vdCoqIHBhc3MgaW4gYSBgUmVnRXhwYCBvYmplY3Qgd2l0aCBlaXRoZXIgdGhlIGdsb2JhbCBvciBzdGlja3lcbiAgICogZmxhZyBlbmFibGVkLlxuICAgKlxuICAgKiBgYGB0eXBlc2NyaXB0XG4gICAqIC8vIE5vdCByZWNvbW1lbmRlZCAoc2luY2UgdGhlIGBnYCBmbGFnIGlzIHVzZWQpXG4gICAqIGNvbnN0IGNvbnRyb2xPbmUgPSBuZXcgRm9ybUNvbnRyb2woJzEnLCBWYWxpZGF0b3JzLnBhdHRlcm4oL2Zvby9nKSk7XG4gICAqXG4gICAqIC8vIEdvb2RcbiAgICogY29uc3QgY29udHJvbFR3byA9IG5ldyBGb3JtQ29udHJvbCgnMScsIFZhbGlkYXRvcnMucGF0dGVybigvZm9vLykpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHBhdHRlcm4gQSByZWd1bGFyIGV4cHJlc3Npb24gdG8gYmUgdXNlZCBhcyBpcyB0byB0ZXN0IHRoZSB2YWx1ZXMsIG9yIGEgc3RyaW5nLlxuICAgKiBJZiBhIHN0cmluZyBpcyBwYXNzZWQsIHRoZSBgXmAgY2hhcmFjdGVyIGlzIHByZXBlbmRlZCBhbmQgdGhlIGAkYCBjaGFyYWN0ZXIgaXNcbiAgICogYXBwZW5kZWQgdG8gdGhlIHByb3ZpZGVkIHN0cmluZyAoaWYgbm90IGFscmVhZHkgcHJlc2VudCksIGFuZCB0aGUgcmVzdWx0aW5nIHJlZ3VsYXJcbiAgICogZXhwcmVzc2lvbiBpcyB1c2VkIHRvIHRlc3QgdGhlIHZhbHVlcy5cbiAgICpcbiAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgKiBgcGF0dGVybmAgcHJvcGVydHkgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyBwYXR0ZXJuKHBhdHRlcm46IHN0cmluZ3xSZWdFeHApOiBWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIHBhdHRlcm5WYWxpZGF0b3IocGF0dGVybik7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFZhbGlkYXRvciB0aGF0IHBlcmZvcm1zIG5vIG9wZXJhdGlvbi5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgKlxuICAgKi9cbiAgc3RhdGljIG51bGxWYWxpZGF0b3IoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gbnVsbFZhbGlkYXRvcihjb250cm9sKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29tcG9zZSBtdWx0aXBsZSB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB1bmlvblxuICAgKiBvZiB0aGUgaW5kaXZpZHVhbCBlcnJvciBtYXBzIGZvciB0aGUgcHJvdmlkZWQgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgQSB2YWxpZGF0b3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVycm9yIG1hcCB3aXRoIHRoZVxuICAgKiBtZXJnZWQgZXJyb3IgbWFwcyBvZiB0aGUgdmFsaWRhdG9ycyBpZiB0aGUgdmFsaWRhdGlvbiBjaGVjayBmYWlscywgb3RoZXJ3aXNlIGBudWxsYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpfVxuICAgKlxuICAgKi9cbiAgc3RhdGljIGNvbXBvc2UodmFsaWRhdG9yczogbnVsbCk6IG51bGw7XG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IChWYWxpZGF0b3JGbnxudWxsfHVuZGVmaW5lZClbXSk6IFZhbGlkYXRvckZufG51bGw7XG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IChWYWxpZGF0b3JGbnxudWxsfHVuZGVmaW5lZClbXXxudWxsKTogVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgcmV0dXJuIGNvbXBvc2UodmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbXBvc2UgbXVsdGlwbGUgYXN5bmMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdW5pb25cbiAgICogb2YgdGhlIGluZGl2aWR1YWwgZXJyb3Igb2JqZWN0cyBmb3IgdGhlIHByb3ZpZGVkIGNvbnRyb2wuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgdmFsaWRhdG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBlcnJvciBtYXAgd2l0aCB0aGVcbiAgICogbWVyZ2VkIGVycm9yIG9iamVjdHMgb2YgdGhlIGFzeW5jIHZhbGlkYXRvcnMgaWYgdGhlIHZhbGlkYXRpb24gY2hlY2sgZmFpbHMsIG90aGVyd2lzZSBgbnVsbGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKX1cbiAgICpcbiAgICovXG4gIHN0YXRpYyBjb21wb3NlQXN5bmModmFsaWRhdG9yczogKEFzeW5jVmFsaWRhdG9yRm58bnVsbClbXSk6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgcmV0dXJuIGNvbXBvc2VBc3luYyh2YWxpZGF0b3JzKTtcbiAgfVxufVxuXG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgdG8gYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIHRoZSBwcm92aWRlZCBudW1iZXIuXG4gKiBTZWUgYFZhbGlkYXRvcnMubWluYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pblZhbGlkYXRvcihtaW46IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSB8fCBpc0VtcHR5SW5wdXRWYWx1ZShtaW4pKSB7XG4gICAgICByZXR1cm4gbnVsbDsgIC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgIH1cbiAgICBjb25zdCB2YWx1ZSA9IHBhcnNlRmxvYXQoY29udHJvbC52YWx1ZSk7XG4gICAgLy8gQ29udHJvbHMgd2l0aCBOYU4gdmFsdWVzIGFmdGVyIHBhcnNpbmcgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgbm90IGhhdmluZyBhXG4gICAgLy8gbWluaW11bSwgcGVyIHRoZSBIVE1MIGZvcm1zIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWluXG4gICAgcmV0dXJuICFpc05hTih2YWx1ZSkgJiYgdmFsdWUgPCBtaW4gPyB7J21pbic6IHsnbWluJzogbWluLCAnYWN0dWFsJzogY29udHJvbC52YWx1ZX19IDogbnVsbDtcbiAgfTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgcHJvdmlkZWQgbnVtYmVyLlxuICogU2VlIGBWYWxpZGF0b3JzLm1heGAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXhWYWxpZGF0b3IobWF4OiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgfHwgaXNFbXB0eUlucHV0VmFsdWUobWF4KSkge1xuICAgICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICB9XG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgIC8vIENvbnRyb2xzIHdpdGggTmFOIHZhbHVlcyBhZnRlciBwYXJzaW5nIHNob3VsZCBiZSB0cmVhdGVkIGFzIG5vdCBoYXZpbmcgYVxuICAgIC8vIG1heGltdW0sIHBlciB0aGUgSFRNTCBmb3JtcyBzcGVjOiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1heFxuICAgIHJldHVybiAhaXNOYU4odmFsdWUpICYmIHZhbHVlID4gbWF4ID8geydtYXgnOiB7J21heCc6IG1heCwgJ2FjdHVhbCc6IGNvbnRyb2wudmFsdWV9fSA6IG51bGw7XG4gIH07XG59XG5cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wgaGF2ZSBhIG5vbi1lbXB0eSB2YWx1ZS5cbiAqIFNlZSBgVmFsaWRhdG9ycy5yZXF1aXJlZGAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlZFZhbGlkYXRvcihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICByZXR1cm4gaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgPyB7J3JlcXVpcmVkJzogdHJ1ZX0gOiBudWxsO1xufVxuXG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBjb250cm9sJ3MgdmFsdWUgYmUgdHJ1ZS4gVGhpcyB2YWxpZGF0b3IgaXMgY29tbW9ubHlcbiAqIHVzZWQgZm9yIHJlcXVpcmVkIGNoZWNrYm94ZXMuXG4gKiBTZWUgYFZhbGlkYXRvcnMucmVxdWlyZWRUcnVlYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVkVHJ1ZVZhbGlkYXRvcihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICByZXR1cm4gY29udHJvbC52YWx1ZSA9PT0gdHJ1ZSA/IG51bGwgOiB7J3JlcXVpcmVkJzogdHJ1ZX07XG59XG5cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGNvbnRyb2wncyB2YWx1ZSBwYXNzIGFuIGVtYWlsIHZhbGlkYXRpb24gdGVzdC5cbiAqIFNlZSBgVmFsaWRhdG9ycy5lbWFpbGAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbWFpbFZhbGlkYXRvcihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICByZXR1cm4gbnVsbDsgIC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICB9XG4gIHJldHVybiBFTUFJTF9SRUdFWFAudGVzdChjb250cm9sLnZhbHVlKSA/IG51bGwgOiB7J2VtYWlsJzogdHJ1ZX07XG59XG5cbi8qKlxuICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgdGhlIGxlbmd0aCBvZiB0aGUgY29udHJvbCdzIHZhbHVlIHRvIGJlIGdyZWF0ZXIgdGhhbiBvciBlcXVhbFxuICogdG8gdGhlIHByb3ZpZGVkIG1pbmltdW0gbGVuZ3RoLiBTZWUgYFZhbGlkYXRvcnMubWluTGVuZ3RoYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pbkxlbmd0aFZhbGlkYXRvcihtaW5MZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSB8fCAhaGFzVmFsaWRMZW5ndGgoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgIC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgICAgLy8gZG9uJ3QgdmFsaWRhdGUgdmFsdWVzIHdpdGhvdXQgYGxlbmd0aGAgcHJvcGVydHlcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBjb250cm9sLnZhbHVlLmxlbmd0aCA8IG1pbkxlbmd0aCA/XG4gICAgICAgIHsnbWlubGVuZ3RoJzogeydyZXF1aXJlZExlbmd0aCc6IG1pbkxlbmd0aCwgJ2FjdHVhbExlbmd0aCc6IGNvbnRyb2wudmFsdWUubGVuZ3RofX0gOlxuICAgICAgICBudWxsO1xuICB9O1xufVxuXG4vKipcbiAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIHRoZSBsZW5ndGggb2YgdGhlIGNvbnRyb2wncyB2YWx1ZSB0byBiZSBsZXNzIHRoYW4gb3IgZXF1YWxcbiAqIHRvIHRoZSBwcm92aWRlZCBtYXhpbXVtIGxlbmd0aC4gU2VlIGBWYWxpZGF0b3JzLm1heExlbmd0aGAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXhMZW5ndGhWYWxpZGF0b3IobWF4TGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsID0+IHtcbiAgICByZXR1cm4gaGFzVmFsaWRMZW5ndGgoY29udHJvbC52YWx1ZSkgJiYgY29udHJvbC52YWx1ZS5sZW5ndGggPiBtYXhMZW5ndGggP1xuICAgICAgICB7J21heGxlbmd0aCc6IHsncmVxdWlyZWRMZW5ndGgnOiBtYXhMZW5ndGgsICdhY3R1YWxMZW5ndGgnOiBjb250cm9sLnZhbHVlLmxlbmd0aH19IDpcbiAgICAgICAgbnVsbDtcbiAgfTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyB0aGUgY29udHJvbCdzIHZhbHVlIHRvIG1hdGNoIGEgcmVnZXggcGF0dGVybi5cbiAqIFNlZSBgVmFsaWRhdG9ycy5wYXR0ZXJuYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhdHRlcm5WYWxpZGF0b3IocGF0dGVybjogc3RyaW5nfFJlZ0V4cCk6IFZhbGlkYXRvckZuIHtcbiAgaWYgKCFwYXR0ZXJuKSByZXR1cm4gbnVsbFZhbGlkYXRvcjtcbiAgbGV0IHJlZ2V4OiBSZWdFeHA7XG4gIGxldCByZWdleFN0cjogc3RyaW5nO1xuICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgcmVnZXhTdHIgPSAnJztcblxuICAgIGlmIChwYXR0ZXJuLmNoYXJBdCgwKSAhPT0gJ14nKSByZWdleFN0ciArPSAnXic7XG5cbiAgICByZWdleFN0ciArPSBwYXR0ZXJuO1xuXG4gICAgaWYgKHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgIT09ICckJykgcmVnZXhTdHIgKz0gJyQnO1xuXG4gICAgcmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4U3RyKTtcbiAgfSBlbHNlIHtcbiAgICByZWdleFN0ciA9IHBhdHRlcm4udG9TdHJpbmcoKTtcbiAgICByZWdleCA9IHBhdHRlcm47XG4gIH1cbiAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgPT4ge1xuICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSkge1xuICAgICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICB9XG4gICAgY29uc3QgdmFsdWU6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpID8gbnVsbCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeydwYXR0ZXJuJzogeydyZXF1aXJlZFBhdHRlcm4nOiByZWdleFN0ciwgJ2FjdHVhbFZhbHVlJzogdmFsdWV9fTtcbiAgfTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiB0aGF0IGhhcyBgVmFsaWRhdG9yRm5gIHNoYXBlLCBidXQgcGVyZm9ybXMgbm8gb3BlcmF0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbnVsbFZhbGlkYXRvcihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNQcmVzZW50KG86IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbyAhPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9PYnNlcnZhYmxlKHZhbHVlOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICBjb25zdCBvYnMgPSBpc1Byb21pc2UodmFsdWUpID8gZnJvbSh2YWx1ZSkgOiB2YWx1ZTtcbiAgaWYgKCh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmICEoaXNTdWJzY3JpYmFibGUob2JzKSkpIHtcbiAgICBsZXQgZXJyb3JNZXNzYWdlID0gYEV4cGVjdGVkIGFzeW5jIHZhbGlkYXRvciB0byByZXR1cm4gUHJvbWlzZSBvciBPYnNlcnZhYmxlLmA7XG4gICAgLy8gQSBzeW5jaHJvbm91cyB2YWxpZGF0b3Igd2lsbCByZXR1cm4gb2JqZWN0IG9yIG51bGwuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGVycm9yTWVzc2FnZSArPVxuICAgICAgICAgICcgQXJlIHlvdSB1c2luZyBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciB3aGVyZSBhbiBhc3luYyB2YWxpZGF0b3IgaXMgZXhwZWN0ZWQ/JztcbiAgICB9XG4gICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihSdW50aW1lRXJyb3JDb2RlLldST05HX1ZBTElEQVRPUl9SRVRVUk5fVFlQRSwgZXJyb3JNZXNzYWdlKTtcbiAgfVxuICByZXR1cm4gb2JzO1xufVxuXG5mdW5jdGlvbiBtZXJnZUVycm9ycyhhcnJheU9mRXJyb3JzOiAoVmFsaWRhdGlvbkVycm9yc3xudWxsKVtdKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgbGV0IHJlczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgYXJyYXlPZkVycm9ycy5mb3JFYWNoKChlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCkgPT4ge1xuICAgIHJlcyA9IGVycm9ycyAhPSBudWxsID8gey4uLnJlcyEsIC4uLmVycm9yc30gOiByZXMhO1xuICB9KTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMocmVzKS5sZW5ndGggPT09IDAgPyBudWxsIDogcmVzO1xufVxuXG50eXBlIEdlbmVyaWNWYWxpZGF0b3JGbiA9IChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGFueTtcblxuZnVuY3Rpb24gZXhlY3V0ZVZhbGlkYXRvcnM8ViBleHRlbmRzIEdlbmVyaWNWYWxpZGF0b3JGbj4oXG4gICAgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCB2YWxpZGF0b3JzOiBWW10pOiBSZXR1cm5UeXBlPFY+W10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHZhbGlkYXRvcihjb250cm9sKSk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRhdG9yRm48Vj4odmFsaWRhdG9yOiBWfFZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvcik6IHZhbGlkYXRvciBpcyBWIHtcbiAgcmV0dXJuICEodmFsaWRhdG9yIGFzIFZhbGlkYXRvcikudmFsaWRhdGU7XG59XG5cbi8qKlxuICogR2l2ZW4gdGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyB0aGF0IG1heSBjb250YWluIGJvdGggZnVuY3Rpb25zIGFzIHdlbGwgYXMgY2xhc3NlcywgcmV0dXJuIHRoZSBsaXN0XG4gKiBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zIChjb252ZXJ0IHZhbGlkYXRvciBjbGFzc2VzIGludG8gdmFsaWRhdG9yIGZ1bmN0aW9ucykuIFRoaXMgaXMgbmVlZGVkIHRvXG4gKiBoYXZlIGNvbnNpc3RlbnQgc3RydWN0dXJlIGluIHZhbGlkYXRvcnMgbGlzdCBiZWZvcmUgY29tcG9zaW5nIHRoZW0uXG4gKlxuICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIHNldCBvZiB2YWxpZGF0b3JzIHRoYXQgbWF5IGNvbnRhaW4gdmFsaWRhdG9ycyBib3RoIGluIHBsYWluIGZ1bmN0aW9uIGZvcm1cbiAqICAgICBhcyB3ZWxsIGFzIHJlcHJlc2VudGVkIGFzIGEgdmFsaWRhdG9yIGNsYXNzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplVmFsaWRhdG9yczxWPih2YWxpZGF0b3JzOiAoVnxWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3IpW10pOiBWW10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodmFsaWRhdG9yID0+IHtcbiAgICByZXR1cm4gaXNWYWxpZGF0b3JGbjxWPih2YWxpZGF0b3IpID9cbiAgICAgICAgdmFsaWRhdG9yIDpcbiAgICAgICAgKChjOiBBYnN0cmFjdENvbnRyb2wpID0+IHZhbGlkYXRvci52YWxpZGF0ZShjKSkgYXMgdW5rbm93biBhcyBWO1xuICB9KTtcbn1cblxuLyoqXG4gKiBNZXJnZXMgc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAqIFNlZSBgVmFsaWRhdG9ycy5jb21wb3NlYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAqL1xuZnVuY3Rpb24gY29tcG9zZSh2YWxpZGF0b3JzOiAoVmFsaWRhdG9yRm58bnVsbHx1bmRlZmluZWQpW118bnVsbCk6IFZhbGlkYXRvckZufG51bGwge1xuICBpZiAoIXZhbGlkYXRvcnMpIHJldHVybiBudWxsO1xuICBjb25zdCBwcmVzZW50VmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCkgYXMgYW55O1xuICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICByZXR1cm4gbWVyZ2VFcnJvcnMoZXhlY3V0ZVZhbGlkYXRvcnM8VmFsaWRhdG9yRm4+KGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKSk7XG4gIH07XG59XG5cbi8qKlxuICogQWNjZXB0cyBhIGxpc3Qgb2YgdmFsaWRhdG9ycyBvZiBkaWZmZXJlbnQgcG9zc2libGUgc2hhcGVzIChgVmFsaWRhdG9yYCBhbmQgYFZhbGlkYXRvckZuYCksXG4gKiBub3JtYWxpemVzIHRoZSBsaXN0IChjb252ZXJ0cyBldmVyeXRoaW5nIHRvIGBWYWxpZGF0b3JGbmApIGFuZCBtZXJnZXMgdGhlbSBpbnRvIGEgc2luZ2xlXG4gKiB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBcnJheTxWYWxpZGF0b3J8VmFsaWRhdG9yRm4+KTogVmFsaWRhdG9yRm58bnVsbCB7XG4gIHJldHVybiB2YWxpZGF0b3JzICE9IG51bGwgPyBjb21wb3NlKG5vcm1hbGl6ZVZhbGlkYXRvcnM8VmFsaWRhdG9yRm4+KHZhbGlkYXRvcnMpKSA6IG51bGw7XG59XG5cbi8qKlxuICogTWVyZ2VzIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uLlxuICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2VBc3luY2AgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gKi9cbmZ1bmN0aW9uIGNvbXBvc2VBc3luYyh2YWxpZGF0b3JzOiAoQXN5bmNWYWxpZGF0b3JGbnxudWxsKVtdKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgaWYgKCF2YWxpZGF0b3JzKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgcHJlc2VudFZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm5bXSA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCkgYXMgYW55O1xuICBpZiAocHJlc2VudFZhbGlkYXRvcnMubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xuXG4gIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9XG4gICAgICAgIGV4ZWN1dGVWYWxpZGF0b3JzPEFzeW5jVmFsaWRhdG9yRm4+KGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKS5tYXAodG9PYnNlcnZhYmxlKTtcbiAgICByZXR1cm4gZm9ya0pvaW4ob2JzZXJ2YWJsZXMpLnBpcGUobWFwKG1lcmdlRXJyb3JzKSk7XG4gIH07XG59XG5cbi8qKlxuICogQWNjZXB0cyBhIGxpc3Qgb2YgYXN5bmMgdmFsaWRhdG9ycyBvZiBkaWZmZXJlbnQgcG9zc2libGUgc2hhcGVzIChgQXN5bmNWYWxpZGF0b3JgIGFuZFxuICogYEFzeW5jVmFsaWRhdG9yRm5gKSwgbm9ybWFsaXplcyB0aGUgbGlzdCAoY29udmVydHMgZXZlcnl0aGluZyB0byBgQXN5bmNWYWxpZGF0b3JGbmApIGFuZCBtZXJnZXNcbiAqIHRoZW0gaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFycmF5PEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4+KTpcbiAgICBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICByZXR1cm4gdmFsaWRhdG9ycyAhPSBudWxsID8gY29tcG9zZUFzeW5jKG5vcm1hbGl6ZVZhbGlkYXRvcnM8QXN5bmNWYWxpZGF0b3JGbj4odmFsaWRhdG9ycykpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGw7XG59XG5cbi8qKlxuICogTWVyZ2VzIHJhdyBjb250cm9sIHZhbGlkYXRvcnMgd2l0aCBhIGdpdmVuIGRpcmVjdGl2ZSB2YWxpZGF0b3IgYW5kIHJldHVybnMgdGhlIGNvbWJpbmVkIGxpc3Qgb2ZcbiAqIHZhbGlkYXRvcnMgYXMgYW4gYXJyYXkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVZhbGlkYXRvcnM8Vj4oY29udHJvbFZhbGlkYXRvcnM6IFZ8VltdfG51bGwsIGRpclZhbGlkYXRvcjogVik6IFZbXSB7XG4gIGlmIChjb250cm9sVmFsaWRhdG9ycyA9PT0gbnVsbCkgcmV0dXJuIFtkaXJWYWxpZGF0b3JdO1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShjb250cm9sVmFsaWRhdG9ycykgPyBbLi4uY29udHJvbFZhbGlkYXRvcnMsIGRpclZhbGlkYXRvcl0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY29udHJvbFZhbGlkYXRvcnMsIGRpclZhbGlkYXRvcl07XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBsaXN0IG9mIHJhdyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGF0dGFjaGVkIHRvIGEgZ2l2ZW4gY29udHJvbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCB7XG4gIHJldHVybiAoY29udHJvbCBhcyBhbnkpLl9yYXdWYWxpZGF0b3JzIGFzIFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGw7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSBsaXN0IG9mIHJhdyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhdHRhY2hlZCB0byBhIGdpdmVuIGNvbnRyb2wuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250cm9sQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IEFzeW5jVmFsaWRhdG9yRm58XG4gICAgQXN5bmNWYWxpZGF0b3JGbltdfG51bGwge1xuICByZXR1cm4gKGNvbnRyb2wgYXMgYW55KS5fcmF3QXN5bmNWYWxpZGF0b3JzIGFzIEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsO1xufVxuXG4vKipcbiAqIEFjY2VwdHMgYSBzaW5nbGV0b24gdmFsaWRhdG9yLCBhbiBhcnJheSwgb3IgbnVsbCwgYW5kIHJldHVybnMgYW4gYXJyYXkgdHlwZSB3aXRoIHRoZSBwcm92aWRlZFxuICogdmFsaWRhdG9ycy5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBBIHZhbGlkYXRvciwgdmFsaWRhdG9ycywgb3IgbnVsbC5cbiAqIEByZXR1cm5zIEEgdmFsaWRhdG9ycyBhcnJheS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VWYWxpZGF0b3JzQXJyYXk8VCBleHRlbmRzIFZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm4+KHZhbGlkYXRvcnM6IFR8VFtdfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwpOiBUW10ge1xuICBpZiAoIXZhbGlkYXRvcnMpIHJldHVybiBbXTtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzIDogW3ZhbGlkYXRvcnNdO1xufVxuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIGFycmF5IGhhcyBhIGdpdmVuIHZhbGlkYXRvci5cbiAqXG4gKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gY29tcGFyZSBhZ2FpbnN0LlxuICogQHBhcmFtIHZhbGlkYXRvciBUaGUgdmFsaWRhdG9yIHRvIGNoZWNrLlxuICogQHJldHVybnMgV2hldGhlciB0aGUgdmFsaWRhdG9yIGlzIHByZXNlbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYXNWYWxpZGF0b3I8VCBleHRlbmRzIFZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm4+KFxuICAgIHZhbGlkYXRvcnM6IFR8VFtdfG51bGwsIHZhbGlkYXRvcjogVCk6IGJvb2xlYW4ge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JzKSA/IHZhbGlkYXRvcnMuaW5jbHVkZXModmFsaWRhdG9yKSA6IHZhbGlkYXRvcnMgPT09IHZhbGlkYXRvcjtcbn1cblxuLyoqXG4gKiBDb21iaW5lcyB0d28gYXJyYXlzIG9mIHZhbGlkYXRvcnMgaW50byBvbmUuIElmIGR1cGxpY2F0ZXMgYXJlIHByb3ZpZGVkLCBvbmx5IG9uZSB3aWxsIGJlIGFkZGVkLlxuICpcbiAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBuZXcgdmFsaWRhdG9ycy5cbiAqIEBwYXJhbSBjdXJyZW50VmFsaWRhdG9ycyBUaGUgYmFzZSBhcnJheSBvZiBjdXJyZW50IHZhbGlkYXRvcnMuXG4gKiBAcmV0dXJucyBBbiBhcnJheSBvZiB2YWxpZGF0b3JzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVmFsaWRhdG9yczxUIGV4dGVuZHMgVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbj4oXG4gICAgdmFsaWRhdG9yczogVHxUW10sIGN1cnJlbnRWYWxpZGF0b3JzOiBUfFRbXXxudWxsKTogVFtdIHtcbiAgY29uc3QgY3VycmVudCA9IG1ha2VWYWxpZGF0b3JzQXJyYXkoY3VycmVudFZhbGlkYXRvcnMpO1xuICBjb25zdCB2YWxpZGF0b3JzVG9BZGQgPSBtYWtlVmFsaWRhdG9yc0FycmF5KHZhbGlkYXRvcnMpO1xuICB2YWxpZGF0b3JzVG9BZGQuZm9yRWFjaCgodjogVCkgPT4ge1xuICAgIC8vIE5vdGU6IGlmIHRoZXJlIGFyZSBkdXBsaWNhdGUgZW50cmllcyBpbiB0aGUgbmV3IHZhbGlkYXRvcnMgYXJyYXksXG4gICAgLy8gb25seSB0aGUgZmlyc3Qgb25lIHdvdWxkIGJlIGFkZGVkIHRvIHRoZSBjdXJyZW50IGxpc3Qgb2YgdmFsaWRhdG9ycy5cbiAgICAvLyBEdXBsaWNhdGUgb25lcyB3b3VsZCBiZSBpZ25vcmVkIHNpbmNlIGBoYXNWYWxpZGF0b3JgIHdvdWxkIGRldGVjdFxuICAgIC8vIHRoZSBwcmVzZW5jZSBvZiBhIHZhbGlkYXRvciBmdW5jdGlvbiBhbmQgd2UgdXBkYXRlIHRoZSBjdXJyZW50IGxpc3QgaW4gcGxhY2UuXG4gICAgaWYgKCFoYXNWYWxpZGF0b3IoY3VycmVudCwgdikpIHtcbiAgICAgIGN1cnJlbnQucHVzaCh2KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY3VycmVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVZhbGlkYXRvcnM8VCBleHRlbmRzIFZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm4+KFxuICAgIHZhbGlkYXRvcnM6IFR8VFtdLCBjdXJyZW50VmFsaWRhdG9yczogVHxUW118bnVsbCk6IFRbXSB7XG4gIHJldHVybiBtYWtlVmFsaWRhdG9yc0FycmF5KGN1cnJlbnRWYWxpZGF0b3JzKS5maWx0ZXIodiA9PiAhaGFzVmFsaWRhdG9yKHZhbGlkYXRvcnMsIHYpKTtcbn1cbiJdfQ==