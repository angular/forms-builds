/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { InjectionToken, ɵisObservable as isObservable, ɵisPromise as isPromise } from '@angular/core';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';
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
 * @Directive({
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
export var NG_VALIDATORS = new InjectionToken('NgValidators');
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
export var NG_ASYNC_VALIDATORS = new InjectionToken('NgAsyncValidators');
var EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
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
var /**
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
Validators = /** @class */ (function () {
    function Validators() {
    }
    /**
     * Validator that requires controls to have a value greater than a number.
     *`min()` exists only as a function, not as a directive. For example,
     * `control = new FormControl('', Validators.min(3));`.
     */
    /**
       * Validator that requires controls to have a value greater than a number.
       *`min()` exists only as a function, not as a directive. For example,
       * `control = new FormControl('', Validators.min(3));`.
       */
    Validators.min = /**
       * Validator that requires controls to have a value greater than a number.
       *`min()` exists only as a function, not as a directive. For example,
       * `control = new FormControl('', Validators.min(3));`.
       */
    function (min) {
        return function (control) {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
                return null; // don't validate empty values to allow optional controls
            }
            var value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
        };
    };
    /**
     * Validator that requires controls to have a value less than a number.
     * `max()` exists only as a function, not as a directive. For example,
     * `control = new FormControl('', Validators.max(15));`.
     */
    /**
       * Validator that requires controls to have a value less than a number.
       * `max()` exists only as a function, not as a directive. For example,
       * `control = new FormControl('', Validators.max(15));`.
       */
    Validators.max = /**
       * Validator that requires controls to have a value less than a number.
       * `max()` exists only as a function, not as a directive. For example,
       * `control = new FormControl('', Validators.max(15));`.
       */
    function (max) {
        return function (control) {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
                return null; // don't validate empty values to allow optional controls
            }
            var value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
        };
    };
    /**
     * Validator that requires controls to have a non-empty value.
     */
    /**
       * Validator that requires controls to have a non-empty value.
       */
    Validators.required = /**
       * Validator that requires controls to have a non-empty value.
       */
    function (control) {
        return isEmptyInputValue(control.value) ? { 'required': true } : null;
    };
    /**
     * Validator that requires control value to be true.
     */
    /**
       * Validator that requires control value to be true.
       */
    Validators.requiredTrue = /**
       * Validator that requires control value to be true.
       */
    function (control) {
        return control.value === true ? null : { 'required': true };
    };
    /**
     * Validator that performs email validation.
     */
    /**
       * Validator that performs email validation.
       */
    Validators.email = /**
       * Validator that performs email validation.
       */
    function (control) {
        if (isEmptyInputValue(control.value)) {
            return null; // don't validate empty values to allow optional controls
        }
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    };
    /**
     * Validator that requires controls to have a value of a minimum length.
     */
    /**
       * Validator that requires controls to have a value of a minimum length.
       */
    Validators.minLength = /**
       * Validator that requires controls to have a value of a minimum length.
       */
    function (minLength) {
        return function (control) {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            var length = control.value ? control.value.length : 0;
            return length < minLength ?
                { 'minlength': { 'requiredLength': minLength, 'actualLength': length } } :
                null;
        };
    };
    /**
     * Validator that requires controls to have a value of a maximum length.
     */
    /**
       * Validator that requires controls to have a value of a maximum length.
       */
    Validators.maxLength = /**
       * Validator that requires controls to have a value of a maximum length.
       */
    function (maxLength) {
        return function (control) {
            var length = control.value ? control.value.length : 0;
            return length > maxLength ?
                { 'maxlength': { 'requiredLength': maxLength, 'actualLength': length } } :
                null;
        };
    };
    /**
     * Validator that requires a control to match a regex to its value.
     */
    /**
       * Validator that requires a control to match a regex to its value.
       */
    Validators.pattern = /**
       * Validator that requires a control to match a regex to its value.
       */
    function (pattern) {
        if (!pattern)
            return Validators.nullValidator;
        var regex;
        var regexStr;
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
        return function (control) {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            var value = control.value;
            return regex.test(value) ? null :
                { 'pattern': { 'requiredPattern': regexStr, 'actualValue': value } };
        };
    };
    /**
     * No-op validator.
     */
    /**
       * No-op validator.
       */
    Validators.nullValidator = /**
       * No-op validator.
       */
    function (c) { return null; };
    Validators.compose = function (validators) {
        if (!validators)
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            return _mergeErrors(_executeValidators(control, presentValidators));
        };
    };
    Validators.composeAsync = function (validators) {
        if (!validators)
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            var observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return forkJoin(observables).pipe(map(_mergeErrors));
        };
    };
    return Validators;
}());
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
export { Validators };
function isPresent(o) {
    return o != null;
}
export function toObservable(r) {
    var obs = isPromise(r) ? from(r) : r;
    if (!(isObservable(obs))) {
        throw new Error("Expected validator to return Promise or Observable.");
    }
    return obs;
}
function _executeValidators(control, validators) {
    return validators.map(function (v) { return v(control); });
}
function _executeAsyncValidators(control, validators) {
    return validators.map(function (v) { return v(control); });
}
function _mergeErrors(arrayOfErrors) {
    var res = arrayOfErrors.reduce(function (res, errors) {
        return errors != null ? tslib_1.__assign({}, (res), errors) : res;
    }, {});
    return Object.keys(res).length === 0 ? null : res;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy92YWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGNBQWMsRUFBRSxhQUFhLElBQUksWUFBWSxFQUFFLFVBQVUsSUFBSSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDckcsT0FBTyxFQUFhLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEQsT0FBTyxFQUFDLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBSW5DLDJCQUEyQixLQUFVOztJQUVuQyxPQUFPLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7Q0FDNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkQsTUFBTSxDQUFDLElBQU0sYUFBYSxHQUFHLElBQUksY0FBYyxDQUE0QixjQUFjLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFZM0YsTUFBTSxDQUFDLElBQU0sbUJBQW1CLEdBQzVCLElBQUksY0FBYyxDQUE0QixtQkFBbUIsQ0FBQyxDQUFDO0FBRXZFLElBQU0sWUFBWSxHQUNkLDRMQUE0TCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUFnQmpNOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7SUFDRTs7OztPQUlHOzs7Ozs7SUFDSSxjQUFHOzs7OztJQUFWLFVBQVcsR0FBVztRQUNwQixPQUFPLFVBQUMsT0FBd0I7WUFDOUIsSUFBSSxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzlELE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDOzs7WUFHeEMsT0FBTyxDQUFDLEtBQUss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QUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO0tBQ3hFO0lBQ0QsT0FBTyxHQUFHLENBQUM7Q0FDWjtBQUVELDRCQUE0QixPQUF3QixFQUFFLFVBQXlCO0lBQzdFLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBVixDQUFVLENBQUMsQ0FBQztDQUN4QztBQUVELGlDQUFpQyxPQUF3QixFQUFFLFVBQThCO0lBQ3ZGLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBVixDQUFVLENBQUMsQ0FBQztDQUN4QztBQUVELHNCQUFzQixhQUFpQztJQUNyRCxJQUFNLEdBQUcsR0FDTCxhQUFhLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBNEIsRUFBRSxNQUErQjtRQUNqRixPQUFPLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxzQkFBSyxDQUFBLEdBQUssQ0FBQSxFQUFLLE1BQU0sRUFBRSxDQUFDLENBQUMsR0FBSyxDQUFDO0tBQ3ZELEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDWCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7Q0FDbkQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0aW9uVG9rZW4sIMm1aXNPYnNlcnZhYmxlIGFzIGlzT2JzZXJ2YWJsZSwgybVpc1Byb21pc2UgYXMgaXNQcm9taXNlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgZm9ya0pvaW4sIGZyb219IGZyb20gJ3J4anMnO1xuaW1wb3J0IHttYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIEZvcm1Db250cm9sfSBmcm9tICcuL21vZGVsJztcblxuZnVuY3Rpb24gaXNFbXB0eUlucHV0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAvLyB3ZSBkb24ndCBjaGVjayBmb3Igc3RyaW5nIGhlcmUgc28gaXQgYWxzbyB3b3JrcyB3aXRoIGFycmF5c1xuICByZXR1cm4gdmFsdWUgPT0gbnVsbCB8fCB2YWx1ZS5sZW5ndGggPT09IDA7XG59XG5cbi8qKlxuICogUHJvdmlkZXJzIGZvciB2YWxpZGF0b3JzIHRvIGJlIHVzZWQgZm9yIGBGb3JtQ29udHJvbGBzIGluIGEgZm9ybS5cbiAqXG4gKiBQcm92aWRlIHRoaXMgdXNpbmcgYG11bHRpOiB0cnVlYCB0byBhZGQgdmFsaWRhdG9ycy5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIEBEaXJlY3RpdmUoe1xuICogICBzZWxlY3RvcjogJ1tjdXN0b20tdmFsaWRhdG9yXScsXG4gKiAgIHByb3ZpZGVyczogW3twcm92aWRlOiBOR19WQUxJREFUT1JTLCB1c2VFeGlzdGluZzogQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlLCBtdWx0aTogdHJ1ZX1dXG4gKiB9KVxuICogY2xhc3MgQ3VzdG9tVmFsaWRhdG9yRGlyZWN0aXZlIGltcGxlbWVudHMgVmFsaWRhdG9yIHtcbiAqICAgdmFsaWRhdGUoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICogICAgIHJldHVybiB7XCJjdXN0b21cIjogdHJ1ZX07XG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBOR19WQUxJREFUT1JTID0gbmV3IEluamVjdGlvblRva2VuPEFycmF5PFZhbGlkYXRvcnxGdW5jdGlvbj4+KCdOZ1ZhbGlkYXRvcnMnKTtcblxuLyoqXG4gKiBQcm92aWRlcnMgZm9yIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRvIGJlIHVzZWQgZm9yIGBGb3JtQ29udHJvbGBzXG4gKiBpbiBhIGZvcm0uXG4gKlxuICogUHJvdmlkZSB0aGlzIHVzaW5nIGBtdWx0aTogdHJ1ZWAgdG8gYWRkIHZhbGlkYXRvcnMuXG4gKlxuICogU2VlIGBOR19WQUxJREFUT1JTYCBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBOR19BU1lOQ19WQUxJREFUT1JTID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48QXJyYXk8VmFsaWRhdG9yfEZ1bmN0aW9uPj4oJ05nQXN5bmNWYWxpZGF0b3JzJyk7XG5cbmNvbnN0IEVNQUlMX1JFR0VYUCA9XG4gICAgL14oPz0uezEsMjU0fSQpKD89LnsxLDY0fUApWy0hIyQlJicqKy8wLTk9P0EtWl5fYGEtent8fX5dKyhcXC5bLSEjJCUmJyorLzAtOT0/QS1aXl9gYS16e3x9fl0rKSpAW0EtWmEtejAtOV0oW0EtWmEtejAtOS1dezAsNjF9W0EtWmEtejAtOV0pPyhcXC5bQS1aYS16MC05XShbQS1aYS16MC05LV17MCw2MX1bQS1aYS16MC05XSk/KSokLztcblxuLyoqXG4gKiBQcm92aWRlcyBhIHNldCBvZiB2YWxpZGF0b3JzIHVzZWQgYnkgZm9ybSBjb250cm9scy5cbiAqXG4gKiBBIHZhbGlkYXRvciBpcyBhIGZ1bmN0aW9uIHRoYXQgcHJvY2Vzc2VzIGEgYEZvcm1Db250cm9sYCBvciBjb2xsZWN0aW9uIG9mXG4gKiBjb250cm9scyBhbmQgcmV0dXJucyBhIG1hcCBvZiBlcnJvcnMuIEEgbnVsbCBtYXAgbWVhbnMgdGhhdCB2YWxpZGF0aW9uIGhhcyBwYXNzZWQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiB2YXIgbG9naW5Db250cm9sID0gbmV3IEZvcm1Db250cm9sKFwiXCIsIFZhbGlkYXRvcnMucmVxdWlyZWQpXG4gKiBgYGBcbiAqXG4gKlxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdG9ycyB7XG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9scyB0byBoYXZlIGEgdmFsdWUgZ3JlYXRlciB0aGFuIGEgbnVtYmVyLlxuICAgKmBtaW4oKWAgZXhpc3RzIG9ubHkgYXMgYSBmdW5jdGlvbiwgbm90IGFzIGEgZGlyZWN0aXZlLiBGb3IgZXhhbXBsZSxcbiAgICogYGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWluKDMpKTtgLlxuICAgKi9cbiAgc3RhdGljIG1pbihtaW46IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgIGlmIChpc0VtcHR5SW5wdXRWYWx1ZShjb250cm9sLnZhbHVlKSB8fCBpc0VtcHR5SW5wdXRWYWx1ZShtaW4pKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgICB9XG4gICAgICBjb25zdCB2YWx1ZSA9IHBhcnNlRmxvYXQoY29udHJvbC52YWx1ZSk7XG4gICAgICAvLyBDb250cm9scyB3aXRoIE5hTiB2YWx1ZXMgYWZ0ZXIgcGFyc2luZyBzaG91bGQgYmUgdHJlYXRlZCBhcyBub3QgaGF2aW5nIGFcbiAgICAgIC8vIG1pbmltdW0sIHBlciB0aGUgSFRNTCBmb3JtcyBzcGVjOiBodHRwczovL3d3dy53My5vcmcvVFIvaHRtbDUvZm9ybXMuaHRtbCNhdHRyLWlucHV0LW1pblxuICAgICAgcmV0dXJuICFpc05hTih2YWx1ZSkgJiYgdmFsdWUgPCBtaW4gPyB7J21pbic6IHsnbWluJzogbWluLCAnYWN0dWFsJzogY29udHJvbC52YWx1ZX19IDogbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSB2YWx1ZSBsZXNzIHRoYW4gYSBudW1iZXIuXG4gICAqIGBtYXgoKWAgZXhpc3RzIG9ubHkgYXMgYSBmdW5jdGlvbiwgbm90IGFzIGEgZGlyZWN0aXZlLiBGb3IgZXhhbXBsZSxcbiAgICogYGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWF4KDE1KSk7YC5cbiAgICovXG4gIHN0YXRpYyBtYXgobWF4OiBudW1iZXIpOiBWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkgfHwgaXNFbXB0eUlucHV0VmFsdWUobWF4KSkge1xuICAgICAgICByZXR1cm4gbnVsbDsgIC8vIGRvbid0IHZhbGlkYXRlIGVtcHR5IHZhbHVlcyB0byBhbGxvdyBvcHRpb25hbCBjb250cm9sc1xuICAgICAgfVxuICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUZsb2F0KGNvbnRyb2wudmFsdWUpO1xuICAgICAgLy8gQ29udHJvbHMgd2l0aCBOYU4gdmFsdWVzIGFmdGVyIHBhcnNpbmcgc2hvdWxkIGJlIHRyZWF0ZWQgYXMgbm90IGhhdmluZyBhXG4gICAgICAvLyBtYXhpbXVtLCBwZXIgdGhlIEhUTUwgZm9ybXMgc3BlYzogaHR0cHM6Ly93d3cudzMub3JnL1RSL2h0bWw1L2Zvcm1zLmh0bWwjYXR0ci1pbnB1dC1tYXhcbiAgICAgIHJldHVybiAhaXNOYU4odmFsdWUpICYmIHZhbHVlID4gbWF4ID8geydtYXgnOiB7J21heCc6IG1heCwgJ2FjdHVhbCc6IGNvbnRyb2wudmFsdWV9fSA6IG51bGw7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9scyB0byBoYXZlIGEgbm9uLWVtcHR5IHZhbHVlLlxuICAgKi9cbiAgc3RhdGljIHJlcXVpcmVkKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpID8geydyZXF1aXJlZCc6IHRydWV9IDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9sIHZhbHVlIHRvIGJlIHRydWUuXG4gICAqL1xuICBzdGF0aWMgcmVxdWlyZWRUcnVlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIGNvbnRyb2wudmFsdWUgPT09IHRydWUgPyBudWxsIDogeydyZXF1aXJlZCc6IHRydWV9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHBlcmZvcm1zIGVtYWlsIHZhbGlkYXRpb24uXG4gICAqL1xuICBzdGF0aWMgZW1haWwoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHtcbiAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgIHJldHVybiBudWxsOyAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgfVxuICAgIHJldHVybiBFTUFJTF9SRUdFWFAudGVzdChjb250cm9sLnZhbHVlKSA/IG51bGwgOiB7J2VtYWlsJzogdHJ1ZX07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgY29udHJvbHMgdG8gaGF2ZSBhIHZhbHVlIG9mIGEgbWluaW11bSBsZW5ndGguXG4gICAqL1xuICBzdGF0aWMgbWluTGVuZ3RoKG1pbkxlbmd0aDogbnVtYmVyKTogVmFsaWRhdG9yRm4ge1xuICAgIHJldHVybiAoY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwgPT4ge1xuICAgICAgaWYgKGlzRW1wdHlJbnB1dFZhbHVlKGNvbnRyb2wudmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAgLy8gZG9uJ3QgdmFsaWRhdGUgZW1wdHkgdmFsdWVzIHRvIGFsbG93IG9wdGlvbmFsIGNvbnRyb2xzXG4gICAgICB9XG4gICAgICBjb25zdCBsZW5ndGg6IG51bWJlciA9IGNvbnRyb2wudmFsdWUgPyBjb250cm9sLnZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICByZXR1cm4gbGVuZ3RoIDwgbWluTGVuZ3RoID9cbiAgICAgICAgICB7J21pbmxlbmd0aCc6IHsncmVxdWlyZWRMZW5ndGgnOiBtaW5MZW5ndGgsICdhY3R1YWxMZW5ndGgnOiBsZW5ndGh9fSA6XG4gICAgICAgICAgbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSB2YWx1ZSBvZiBhIG1heGltdW0gbGVuZ3RoLlxuICAgKi9cbiAgc3RhdGljIG1heExlbmd0aChtYXhMZW5ndGg6IG51bWJlcik6IFZhbGlkYXRvckZuIHtcbiAgICByZXR1cm4gKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsID0+IHtcbiAgICAgIGNvbnN0IGxlbmd0aDogbnVtYmVyID0gY29udHJvbC52YWx1ZSA/IGNvbnRyb2wudmFsdWUubGVuZ3RoIDogMDtcbiAgICAgIHJldHVybiBsZW5ndGggPiBtYXhMZW5ndGggP1xuICAgICAgICAgIHsnbWF4bGVuZ3RoJzogeydyZXF1aXJlZExlbmd0aCc6IG1heExlbmd0aCwgJ2FjdHVhbExlbmd0aCc6IGxlbmd0aH19IDpcbiAgICAgICAgICBudWxsO1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgYSBjb250cm9sIHRvIG1hdGNoIGEgcmVnZXggdG8gaXRzIHZhbHVlLlxuICAgKi9cbiAgc3RhdGljIHBhdHRlcm4ocGF0dGVybjogc3RyaW5nfFJlZ0V4cCk6IFZhbGlkYXRvckZuIHtcbiAgICBpZiAoIXBhdHRlcm4pIHJldHVybiBWYWxpZGF0b3JzLm51bGxWYWxpZGF0b3I7XG4gICAgbGV0IHJlZ2V4OiBSZWdFeHA7XG4gICAgbGV0IHJlZ2V4U3RyOiBzdHJpbmc7XG4gICAgaWYgKHR5cGVvZiBwYXR0ZXJuID09PSAnc3RyaW5nJykge1xuICAgICAgcmVnZXhTdHIgPSAnJztcblxuICAgICAgaWYgKHBhdHRlcm4uY2hhckF0KDApICE9PSAnXicpIHJlZ2V4U3RyICs9ICdeJztcblxuICAgICAgcmVnZXhTdHIgKz0gcGF0dGVybjtcblxuICAgICAgaWYgKHBhdHRlcm4uY2hhckF0KHBhdHRlcm4ubGVuZ3RoIC0gMSkgIT09ICckJykgcmVnZXhTdHIgKz0gJyQnO1xuXG4gICAgICByZWdleCA9IG5ldyBSZWdFeHAocmVnZXhTdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWdleFN0ciA9IHBhdHRlcm4udG9TdHJpbmcoKTtcbiAgICAgIHJlZ2V4ID0gcGF0dGVybjtcbiAgICB9XG4gICAgcmV0dXJuIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCA9PiB7XG4gICAgICBpZiAoaXNFbXB0eUlucHV0VmFsdWUoY29udHJvbC52YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7ICAvLyBkb24ndCB2YWxpZGF0ZSBlbXB0eSB2YWx1ZXMgdG8gYWxsb3cgb3B0aW9uYWwgY29udHJvbHNcbiAgICAgIH1cbiAgICAgIGNvbnN0IHZhbHVlOiBzdHJpbmcgPSBjb250cm9sLnZhbHVlO1xuICAgICAgcmV0dXJuIHJlZ2V4LnRlc3QodmFsdWUpID8gbnVsbCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7J3BhdHRlcm4nOiB7J3JlcXVpcmVkUGF0dGVybic6IHJlZ2V4U3RyLCAnYWN0dWFsVmFsdWUnOiB2YWx1ZX19O1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTm8tb3AgdmFsaWRhdG9yLlxuICAgKi9cbiAgc3RhdGljIG51bGxWYWxpZGF0b3IoYzogQWJzdHJhY3RDb250cm9sKTogVmFsaWRhdGlvbkVycm9yc3xudWxsIHsgcmV0dXJuIG51bGw7IH1cblxuICAvKipcbiAgICogQ29tcG9zZSBtdWx0aXBsZSB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB1bmlvblxuICAgKiBvZiB0aGUgaW5kaXZpZHVhbCBlcnJvciBtYXBzLlxuICAgKi9cbiAgc3RhdGljIGNvbXBvc2UodmFsaWRhdG9yczogbnVsbCk6IG51bGw7XG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IChWYWxpZGF0b3JGbnxudWxsfHVuZGVmaW5lZClbXSk6IFZhbGlkYXRvckZufG51bGw7XG4gIHN0YXRpYyBjb21wb3NlKHZhbGlkYXRvcnM6IChWYWxpZGF0b3JGbnxudWxsfHVuZGVmaW5lZClbXXxudWxsKTogVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgaWYgKCF2YWxpZGF0b3JzKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBwcmVzZW50VmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCkgYXMgYW55O1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgICByZXR1cm4gX21lcmdlRXJyb3JzKF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycykpO1xuICAgIH07XG4gIH1cblxuICBzdGF0aWMgY29tcG9zZUFzeW5jKHZhbGlkYXRvcnM6IChBc3luY1ZhbGlkYXRvckZufG51bGwpW10pOiBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICAgIGlmICghdmFsaWRhdG9ycykgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgcHJlc2VudFZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm5bXSA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCkgYXMgYW55O1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlcyA9IF9leGVjdXRlQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2wsIHByZXNlbnRWYWxpZGF0b3JzKS5tYXAodG9PYnNlcnZhYmxlKTtcbiAgICAgIHJldHVybiBmb3JrSm9pbihvYnNlcnZhYmxlcykucGlwZShtYXAoX21lcmdlRXJyb3JzKSk7XG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1ByZXNlbnQobzogYW55KTogYm9vbGVhbiB7XG4gIHJldHVybiBvICE9IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b09ic2VydmFibGUocjogYW55KTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgY29uc3Qgb2JzID0gaXNQcm9taXNlKHIpID8gZnJvbShyKSA6IHI7XG4gIGlmICghKGlzT2JzZXJ2YWJsZShvYnMpKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgdmFsaWRhdG9yIHRvIHJldHVybiBQcm9taXNlIG9yIE9ic2VydmFibGUuYCk7XG4gIH1cbiAgcmV0dXJuIG9icztcbn1cblxuZnVuY3Rpb24gX2V4ZWN1dGVWYWxpZGF0b3JzKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgdmFsaWRhdG9yczogVmFsaWRhdG9yRm5bXSk6IGFueVtdIHtcbiAgcmV0dXJuIHZhbGlkYXRvcnMubWFwKHYgPT4gdihjb250cm9sKSk7XG59XG5cbmZ1bmN0aW9uIF9leGVjdXRlQXN5bmNWYWxpZGF0b3JzKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgdmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbltdKTogYW55W10ge1xuICByZXR1cm4gdmFsaWRhdG9ycy5tYXAodiA9PiB2KGNvbnRyb2wpKTtcbn1cblxuZnVuY3Rpb24gX21lcmdlRXJyb3JzKGFycmF5T2ZFcnJvcnM6IFZhbGlkYXRpb25FcnJvcnNbXSk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gIGNvbnN0IHJlczoge1trZXk6IHN0cmluZ106IGFueX0gPVxuICAgICAgYXJyYXlPZkVycm9ycy5yZWR1Y2UoKHJlczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwsIGVycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwpID0+IHtcbiAgICAgICAgcmV0dXJuIGVycm9ycyAhPSBudWxsID8gey4uLnJlcyAhLCAuLi5lcnJvcnN9IDogcmVzICE7XG4gICAgICB9LCB7fSk7XG4gIHJldHVybiBPYmplY3Qua2V5cyhyZXMpLmxlbmd0aCA9PT0gMCA/IG51bGwgOiByZXM7XG59XG4iXX0=