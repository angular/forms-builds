/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, ɵisObservable as isObservable, ɵisPromise as isPromise } from '@angular/core';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
/**
 * @param {?} value
 * @return {?}
 */
function isEmptyInputValue(value) {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}
/**
 * Providers for validators to be used for `FormControl`s in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * ### Example
 *
 * ```typescript
 * \@Directive({
 *   selector: '[custom-validator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors | null {
 *     return {"custom": true};
 *   }
 * }
 * ```
 *
 *
 */
export const /** @type {?} */ NG_VALIDATORS = new InjectionToken('NgValidators');
/**
 * Providers for asynchronous validators to be used for `FormControl`s
 * in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * See `NG_VALIDATORS` for more details.
 *
 *
 */
export const /** @type {?} */ NG_ASYNC_VALIDATORS = new InjectionToken('NgAsyncValidators');
const /** @type {?} */ EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
/**
 * Provides a set of validators used by form controls.
 *
 * A validator is a function that processes a `FormControl` or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new FormControl("", Validators.required)
 * ```
 *
 *
 */
export class Validators {
    /**
     * Validator that requires controls to have a value greater than a number.
     * `min()` exists only as a function, not as a directive. For example,
     * `control = new FormControl('', Validators.min(3));`.
     * @param {?} min
     * @return {?}
     */
    static min(min) {
        return (control) => {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
                return null; // don't validate empty values to allow optional controls
            }
            const /** @type {?} */ value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
        };
    }
    /**
     * Validator that requires controls to have a value less than a number.
     * `max()` exists only as a function, not as a directive. For example,
     * `control = new FormControl('', Validators.max(15));`.
     * @param {?} max
     * @return {?}
     */
    static max(max) {
        return (control) => {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
                return null; // don't validate empty values to allow optional controls
            }
            const /** @type {?} */ value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
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
        if (isEmptyInputValue(control.value)) {
            return null; // don't validate empty values to allow optional controls
        }
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
     * @param {?} validators
     * @return {?}
     */
    static compose(validators) {
        if (!validators)
            return null;
        const /** @type {?} */ presentValidators = /** @type {?} */ (validators.filter(isPresent));
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
        const /** @type {?} */ presentValidators = /** @type {?} */ (validators.filter(isPresent));
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            const /** @type {?} */ observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return forkJoin(observables).pipe(map(_mergeErrors));
        };
    }
}
/**
 * @param {?} o
 * @return {?}
 */
function isPresent(o) {
    return o != null;
}
/**
 * @param {?} r
 * @return {?}
 */
export function toObservable(r) {
    const /** @type {?} */ obs = isPromise(r) ? from(r) : r;
    if (!(isObservable(obs))) {
        throw new Error(`Expected validator to return Promise or Observable.`);
    }
    return obs;
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
        return errors != null ? Object.assign({}, /** @type {?} */ ((res)), errors) : /** @type {?} */ ((res));
    }, {});
    return Object.keys(res).length === 0 ? null : res;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGNBQWMsRUFBRSxhQUFhLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckcsT0FBTyxFQUFhLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7OztBQUluQywyQkFBMkIsS0FBVTs7SUFFbkMsT0FBTyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0NBQzVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJELE1BQU0sQ0FBQyx1QkFBTSxhQUFhLEdBQUcsSUFBSSxjQUFjLENBQTRCLGNBQWMsQ0FBQyxDQUFDOzs7Ozs7Ozs7OztBQVkzRixNQUFNLENBQUMsdUJBQU0sbUJBQW1CLEdBQzVCLElBQUksY0FBYyxDQUE0QixtQkFBbUIsQ0FBQyxDQUFDO0FBRXZFLHVCQUFNLFlBQVksR0FDZCw0TEFBNEwsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JqTSxNQUFNOzs7Ozs7OztJQU1KLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBVztRQUNwQixPQUFPLENBQUMsT0FBd0IsRUFBMkIsRUFBRTtZQUMzRCxJQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDOUQsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUNELHVCQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7WUFHeEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENB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QyxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3hCLE1BQU0sSUFBSSxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztLQUN4RTtJQUNELE9BQU8sR0FBRyxDQUFDO0NBQ1o7Ozs7OztBQUVELDRCQUE0QixPQUF3QixFQUFFLFVBQXlCO0lBQzdFLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0NBQ3hDOzs7Ozs7QUFFRCxpQ0FBaUMsT0FBd0IsRUFBRSxVQUE4QjtJQUN2RixPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUN4Qzs7Ozs7QUFFRCxzQkFBc0IsYUFBaUM7SUFDckQsdUJBQU0sR0FBRyxHQUNMLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUE0QixFQUFFLE1BQStCLEVBQUUsRUFBRTtRQUNyRixPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxzQ0FBSyxHQUFHLElBQU8sTUFBTSxFQUFFLENBQUMsb0JBQUMsR0FBRyxFQUFFLENBQUM7S0FDdkQsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztDQUNuRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3Rpb25Ub2tlbiwgybVpc09ic2VydmFibGUgYXMgaXNPYnNlcnZhYmxlLCDJtWlzUHJvbWlzZSBhcyBpc1Byb21pc2V9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBmb3JrSm9pbiwgZnJvbX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgRm9ybUNvbnRyb2x9IGZyb20gJy4vbW9kZWwnO1xuXG5mdW5jdGlvbiBpc0VtcHR5SW5wdXRWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gIC8vIHdlIGRvbid0IGNoZWNrIGZvciBzdHJpbmcgaGVyZSBzbyBpdCBhbHNvIHdvcmtzIHdpdGggYXJyYXlzXG4gIHJldHVybiB2YWx1ZSA9PSBudWxsIHx8IHZhbHVlLmxlbmd0aCA9PT0gMDtcbn1cblxuLyoqXG4gKiBQcm92aWRlcnMgZm9yIHZhbGlkYXRvcnMgdG8gYmUgdXNlZCBmb3IgYEZvcm1Db250cm9sYHMgaW4gYSBmb3JtLlxuICpcbiAqIFByb3ZpZGUgdGhpcyB1c2luZyBgbXVsdGk6IHRydWVgIHRvIGFkZCB2YWxpZGF0b3JzLlxuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICogYGBgdHlwZXNjcmlwdFxuICogQERpcmVjdGl2ZSh7XG4gKiAgIHNlbGVjdG9yOiAnW2N1c3RvbS12YWxpZGF0b3JdJyxcbiAqICAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5HX1ZBTElEQVRPUlMsIHVzZUV4aXN0aW5nOiBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUsIG11bHRpOiB0cnVlfV1cbiAqIH0pXG4gKiBjbGFzcyBDdXN0b21WYWxpZGF0b3JEaXJlY3RpdmUgaW1wbGVtZW50cyBWYWxpZGF0b3Ige1xuICogICB2YWxpZGF0ZShjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCB7XG4gKiAgICAgcmV0dXJuIHtcImN1c3RvbVwiOiB0cnVlfTtcbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IE5HX1ZBTElEQVRPUlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48QXJyYXk8VmFsaWRhdG9yfEZ1bmN0aW9uPj4oJ05nVmFsaWRhdG9ycycpO1xuXG4vKipcbiAqIFByb3ZpZGVycyBmb3IgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdG8gYmUgdXNlZCBmb3IgYEZvcm1Db250cm9sYHNcbiAqIGluIGEgZm9ybS5cbiAqXG4gKiBQcm92aWRlIHRoaXMgdXNpbmcgYG11bHRpOiB0cnVlYCB0byBhZGQgdmFsaWRhdG9ycy5cbiAqXG4gKiBTZWUgYE5HX1ZBTElEQVRPUlNgIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IE5HX0FTWU5DX1ZBTElEQVRPUlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxBcnJheTxWYWxpZGF0b3J8RnVuY3Rpb24+PignTmdBc3luY1ZhbGlkYXRvcnMnKTtcblxuY29uc3QgRU1BSUxfUkVHRVhQID1cbiAgICAvXig/PS57MSwyNTR9JCkoPz0uezEsNjR9QClbLSEjJCUmJyorLzAtOT0/QS1aXl9gYS16e3x9fl0rKFxcLlstISMkJSYnKisvMC05PT9BLVpeX2BhLXp7fH1+XSspKkBbQS1aYS16MC05XShbQS1aYS16MC05LV17MCw2MX1bQS1aYS16MC05XSk/KFxcLltBLVphLXowLTldKFtBLVphLXowLTktXXswLDYxfVtBLVphLXowLTldKT8pKiQvO1xuXG4vKipcbiAqIFByb3ZpZGVzIGEgc2V0IG9mIHZhbGlkYXRvcnMgdXNlZCBieSBmb3JtIGNvbnRyb2xzLlxuICpcbiAqIEEgdmFsaWRhdG9yIGlzIGEgZnVuY3Rpb24gdGhhdCBwcm9jZXNzZXMgYSBgRm9ybUNvbnRyb2xgIG9yIGNvbGxlY3Rpb24gb2ZcbiAqIGNvbnRyb2xzIGFuZCByZXR1cm5zIGEgbWFwIG9mIGVycm9ycy4gQSBudWxsIG1hcCBtZWFucyB0aGF0IHZhbGlkYXRpb24gaGFzIHBhc3NlZC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIHZhciBsb2dpbkNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woXCJcIiwgVmFsaWRhdG9ycy5yZXF1aXJlZClcbiAqIGBgYFxuICpcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0b3JzIHtcbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSB2YWx1ZSBncmVhdGVyIHRoYW4gYSBudW1iZXIuXG4gICAqYG1pbigpYCBleGlzdHMgb25seSBhcyBhIGZ1bmN0aW9uLCBub3QgYXMgYSBkaXJlY3RpdmUuIEZvciBleGFtcGxlLFxuICAgKiBgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5taW4oMykpO2AuXG4gICAqL1xuICBzdGF0aWMgbWluKG1pbjogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpIHx8IGlzRW1wdHlJbnB1dFZhbHVlKG1pbikpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZhbHVlID0gcGFyc2VGbG9hdChjb250cm9sLnZhbHVlKTtcbiAgICAgIC8vIENvbnRyb2xzIHdpdGggTmFOIHZhbHVlcyBhZnRlciBwYXJzaW5nIHNob3VsZCBiZSB0cmVhdGVkIGFzIG5vdCBoYXZpbmcgYVxuICAgICAgLy8gbWluaW11bSwgcGVyIHRoZSBIVE1MIGZvcm1zIHNwZWM6IGh0dHBzOi8vd3d3LnczLm9yZy9UUi9odG1sNS9mb3Jtcy5odG1sI2F0dHItaW5wdXQtbWluXG4gICAgICByZXR1cm4gIWlzTmFOKHZhbHVlKSAmJiB2YWx1ZSA8IG1pbiA/IHsnbWluJzogeydtaW4nOiBtaW4sICdhY3R1YWwnOiBjb250cm9sLnZhbHVlfX0gOiBudWxsO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgY29udHJvbHMgdG8gaGF2ZSBhIHZhbHVlIGxlc3MgdGhhbiBhIG51bWJlci5cbiAgICogYG1heCgpYCBleGlzdHMgb25seSBhcyBhIGZ1bmN0aW9uLCBub3QgYXMgYSBkaXJlY3RpdmUuIEZvciBleGFtcGxlLFxuICAgKiBgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5tYXgoMTUpKTtgLlxuICAgKi9cbiAgc3RhdGljIG1heChtYXg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSB8fCBpc0VtcHR5SW5wdXRWYWx1ZShtYXgpKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgICB9XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlRmxvYXQoY29udHJvbC52YWx1ZSk7XG4gICAgICAvLyBDb250cm9scyB3aXRoIE5hTiB2YWx1ZXMgYWZ0ZXIgcGFyc2luZyBzaG91bGQgYmUgdHJlYXRlZCBhcyBub3QgaGF2aW5nIGFcbiAgICAgIC8vIG1heGltdW0sIHBlciB0aGUgSFRNTCBmb3JtcyBzcGVjOiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1heFxuICAgICAgcmV0dXJuICFpc05hTih2YWx1ZSkgJiYgdmFsdWUgPiBtYXggPyB7J21heCc6IHsnbWF4JzogbWF4LCAnYWN0dWFsJzogY29udHJvbC52YWx1ZX19IDogbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSBub24tZW1wdHkgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgcmVxdWlyZWQoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgPyB7J3JlcXVpcmVkJzogdHJ1ZX0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2wgdmFsdWUgdG8gYmUgdHJ1ZS5cbiAgICovXG4gIHN0YXRpYyByZXF1aXJlZFRydWUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICByZXR1cm4gY29udHJvbC52YWx1ZSA9PT0gdHJ1ZSA/IG51bGwgOiB7J3JlcXVpcmVkJzogdHJ1ZX07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcGVyZm9ybXMgZW1haWwgdmFsaWRhdGlvbi5cbiAgICovXG4gIHN0YXRpYyBlbWFpbChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSkge1xuICAgICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICB9XG4gICAgcmV0dXJuIEVNQUlMX1JFR0VYUC50ZXN0KGNvbnRyb2wudmFsdWUpID8gbnVsbCA6IHsnZW1haWwnOiB0cnVlfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9scyB0byBoYXZlIGEgdmFsdWUgb2YgYSBtaW5pbXVtIGxlbmd0aC5cbiAgICovXG4gIHN0YXRpYyBtaW5MZW5ndGgobWluTGVuZ3RoOiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgIH1cbiAgICAgIGNvbnN0IGxlbmd0aDogbnVtYmVyID0gY29udHJvbC52YWx1ZSA/IGNvbnRyb2wudmFsdWUubGVuZ3RoIDogMDtcbiAgICAgIHJldHVybiBsZW5ndGggPCBtaW5MZW5ndGggP1xuICAgICAgICAgIHsnbWlubGVuZ3RoJzogeydyZXF1aXJlZExlbmd0aCc6IG1pbkxlbmd0aCwgJ2FjdHVhbExlbmd0aCc6IGxlbmd0aH19IDpcbiAgICAgICAgICBudWxsO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgY29udHJvbHMgdG8gaGF2ZSBhIHZhbHVlIG9mIGEgbWF4aW11bSBsZW5ndGguXG4gICAqL1xuICBzdGF0aWMgbWF4TGVuZ3RoKG1heExlbmd0aDogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgICAgY29uc3QgbGVuZ3RoOiBudW1iZXIgPSBjb250cm9sLnZhbHVlID8gY29udHJvbC52YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgcmV0dXJuIGxlbmd0aCA+IG1heExlbmd0aCA/XG4gICAgICAgICAgeydtYXhsZW5ndGgnOiB7J3JlcXVpcmVkTGVuZ3RoJzogbWF4TGVuZ3RoLCAnYWN0dWFsTGVuZ3RoJzogbGVuZ3RofX0gOlxuICAgICAgICAgIG51bGw7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBhIGNvbnRyb2wgdG8gbWF0Y2ggYSByZWdleCB0byBpdHMgdmFsdWUuXG4gICAqL1xuICBzdGF0aWMgcGF0dGVybihwYXR0ZXJuOiBzdHJpbmd8UmVnRXhwKTogVmFsaWRhdG9yRm4ge1xuICAgIGlmICghcGF0dGVybikgcmV0dXJuIFZhbGlkYXRvcnMubnVsbFZhbGlkYXRvcjtcbiAgICBsZXQgcmVnZXg6IFJlZ0V4cDtcbiAgICBsZXQgcmVnZXhTdHI6IHN0cmluZztcbiAgICBpZiAodHlwZW9mIHBhdHRlcm4gPT09ICdzdHJpbmcnKSB7XG4gICAgICByZWdleFN0ciA9ICcnO1xuXG4gICAgICBpZiAocGF0dGVybi5jaGFyQXQoMCkgIT09ICdeJykgcmVnZXhTdHIgKz0gJ14nO1xuXG4gICAgICByZWdleFN0ciArPSBwYXR0ZXJuO1xuXG4gICAgICBpZiAocGF0dGVybi5jaGFyQXQocGF0dGVybi5sZW5ndGggLSAxKSAhPT0gJyQnKSByZWdleFN0ciArPSAnJCc7XG5cbiAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlZ2V4U3RyID0gcGF0dGVybi50b1N0cmluZygpO1xuICAgICAgcmVnZXggPSBwYXR0ZXJuO1xuICAgIH1cbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSkge1xuICAgICAgICByZXR1cm4gbnVsbDsgIC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgICAgfVxuICAgICAgY29uc3QgdmFsdWU6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgICByZXR1cm4gcmVnZXgudGVzdCh2YWx1ZSkgPyBudWxsIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsncGF0dGVybic6IHsncmVxdWlyZWRQYXR0ZXJuJzogcmVnZXhTdHIsICdhY3R1YWxWYWx1ZSc6IHZhbHVlfX07XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOby1vcCB2YWxpZGF0b3IuXG4gICAqL1xuICBzdGF0aWMgbnVsbFZhbGlkYXRvcihjOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgeyByZXR1cm4gbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBDb21wb3NlIG11bHRpcGxlIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHVuaW9uXG4gICAqIG9mIHRoZSBpbmRpdmlkdWFsIGVycm9yIG1hcHMuXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZSh2YWxpZGF0b3JzOiBudWxsKTogbnVsbDtcbiAgc3RhdGljIGNvbXBvc2UodmFsaWRhdG9yczogKFZhbGlkYXRvckZufG51bGx8dW5kZWZpbmVkKVtdKTogVmFsaWRhdG9yRm58bnVsbDtcbiAgc3RhdGljIGNvbXBvc2UodmFsaWRhdG9yczogKFZhbGlkYXRvckZufG51bGx8dW5kZWZpbmVkKVtdfG51bGwpOiBWYWxpZGF0b3JGbnxudWxsIHtcbiAgICBpZiAoIXZhbGlkYXRvcnMpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IHByZXNlbnRWYWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdID0gdmFsaWRhdG9ycy5maWx0ZXIoaXNQcmVzZW50KSBhcyBhbnk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICAgIHJldHVybiBfbWVyZ2VFcnJvcnMoX2V4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKSk7XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBjb21wb3NlQXN5bmModmFsaWRhdG9yczogKEFzeW5jVmFsaWRhdG9yRm58bnVsbClbXSk6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBwcmVzZW50VmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdID0gdmFsaWRhdG9ycy5maWx0ZXIoaXNQcmVzZW50KSBhcyBhbnk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGVzID0gX2V4ZWN1dGVBc3luY1ZhbGlkYXRvcnMoY29udHJvbCwgcHJlc2VudFZhbGlkYXRvcnMpLm1hcCh0b09ic2VydmFibGUpO1xuICAgICAgcmV0dXJuIGZvcmtKb2luKG9ic2VydmFibGVzKS5waXBlKG1hcChfbWVyZ2VFcnJvcnMpKTtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzUHJlc2VudChvOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIG8gIT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvT2JzZXJ2YWJsZShyOiBhbnkpOiBPYnNlcnZhYmxlPGFueT4ge1xuICBjb25zdCBvYnMgPSBpc1Byb21pc2UocikgPyBmcm9tKHIpIDogcjtcbiAgaWYgKCEoaXNPYnNlcnZhYmxlKG9icykpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB2YWxpZGF0b3IgdG8gcmV0dXJuIFByb21pc2Ugb3IgT2JzZXJ2YWJsZS5gKTtcbiAgfVxuICByZXR1cm4gb2JzO1xufVxuXG5mdW5jdGlvbiBfZXhlY3V0ZVZhbGlkYXRvcnMoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbltdKTogYW55W10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodiA9PiB2KGNvbnRyb2wpKTtcbn1cblxuZnVuY3Rpb24gX2V4ZWN1dGVBc3luY1ZhbGlkYXRvcnMoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCB2YWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuW10pOiBhbnlbXSB7XG4gIHJldHVybiB2YWxpZGF0b3JzLm1hcCh2ID0+IHYoY29udHJvbCkpO1xufVxuXG5mdW5jdGlvbiBfbWVyZ2VFcnJvcnMoYXJyYXlPZkVycm9yczogVmFsaWRhdGlvbkVycm9yc1tdKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgY29uc3QgcmVzOiB7W2tleTogc3RyaW5nXTogYW55fSA9XG4gICAgICBhcnJheU9mRXJyb3JzLnJlZHVjZSgocmVzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCwgZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCkgPT4ge1xuICAgICAgICByZXR1cm4gZXJyb3JzICE9IG51bGwgPyB7Li4ucmVzICEsIC4uLmVycm9yc30gOiByZXMgITtcbiAgICAgIH0sIHt9KTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHJlcykubGVuZ3RoID09PSAwID8gbnVsbCA6IHJlcztcbn1cbiJdfQ==