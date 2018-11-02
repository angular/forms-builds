/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from './model';
/**
 * \@description
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * The `FormBuilder` provides syntactic sugar that shortens creating instances of a `FormControl`,
 * `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to build complex
 * forms.
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 * \@publicApi
 */
export class FormBuilder {
    /**
     * \@description
     * Construct a new `FormGroup` instance.
     *
     * @param {?} controlsConfig A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param {?=} legacyOrOpts
     * @return {?}
     */
    group(controlsConfig, legacyOrOpts = null) {
        /** @type {?} */
        const controls = this._reduceControls(controlsConfig);
        /** @type {?} */
        let validators = null;
        /** @type {?} */
        let asyncValidators = null;
        /** @type {?} */
        let updateOn = undefined;
        if (legacyOrOpts != null &&
            (legacyOrOpts["asyncValidator"] !== undefined || legacyOrOpts["validator"] !== undefined)) {
            // `legacyOrOpts` are legacy form group options
            validators = legacyOrOpts["validator"] != null ? legacyOrOpts["validator"] : null;
            asyncValidators = legacyOrOpts["asyncValidator"] != null ? legacyOrOpts["asyncValidator"] : null;
        }
        else if (legacyOrOpts != null) {
            // `legacyOrOpts` are `AbstractControlOptions`
            validators = legacyOrOpts["validators"] != null ? legacyOrOpts["validators"] : null;
            asyncValidators = legacyOrOpts["asyncValidators"] != null ? legacyOrOpts["asyncValidators"] : null;
            updateOn = legacyOrOpts["updateOn"] != null ? legacyOrOpts["updateOn"] : undefined;
        }
        return new FormGroup(controls, { asyncValidators, updateOn, validators });
    }
    /**
     * \@description
     * Construct a new `FormControl` with the given state, validators and options.
     *
     * \@usageNotes
     *
     * ### Initialize a control as disabled
     *
     * The following example returns a control with an initial value in a disabled state.
     *
     * <code-example path="forms/ts/formBuilder/form_builder_example.ts"
     *   linenums="false" region="disabled-control">
     * </code-example>
     * @param {?} formState Initializes the control with an initial state value, or
     * with an object that contains both a value and a disabled status.
     *
     * @param {?=} validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param {?=} asyncValidator A single async validator or array of async validator
     * functions.
     *
     * @return {?}
     */
    control(formState, validatorOrOpts, asyncValidator) {
        return new FormControl(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Constructs a new `FormArray` from the given array of configurations,
     * validators and options.
     *
     * @param {?} controlsConfig An array of child controls or control configs. Each
     * child control is given an index when it is registered.
     *
     * @param {?=} validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param {?=} asyncValidator A single async validator or array of async validator
     * functions.
     * @return {?}
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        /** @type {?} */
        const controls = controlsConfig.map(c => this._createControl(c));
        return new FormArray(controls, validatorOrOpts, asyncValidator);
    }
    /**
     * \@internal
     * @param {?} controlsConfig
     * @return {?}
     */
    _reduceControls(controlsConfig) {
        /** @type {?} */
        const controls = {};
        Object.keys(controlsConfig).forEach(controlName => {
            controls[controlName] = this._createControl(controlsConfig[controlName]);
        });
        return controls;
    }
    /**
     * \@internal
     * @param {?} controlConfig
     * @return {?}
     */
    _createControl(controlConfig) {
        if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
            controlConfig instanceof FormArray) {
            return controlConfig;
        }
        else if (Array.isArray(controlConfig)) {
            /** @type {?} */
            const value = controlConfig[0];
            /** @type {?} */
            const validator = controlConfig.length > 1 ? controlConfig[1] : null;
            /** @type {?} */
            const asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else {
            return this.control(controlConfig);
        }
    }
}
FormBuilder.decorators = [
    { type: Injectable }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUEwQyxTQUFTLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBWSxNQUFNLFNBQVMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWU5RyxNQUFNLE9BQU8sV0FBVzs7Ozs7Ozs7Ozs7SUFhdEIsS0FBSyxDQUFDLGNBQW9DLEVBQUUsZUFBMEMsSUFBSTs7UUFFeEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7UUFFdEQsSUFBSSxVQUFVLEdBQW1DLElBQUksQ0FBQzs7UUFDdEQsSUFBSSxlQUFlLEdBQTZDLElBQUksQ0FBQzs7UUFDckUsSUFBSSxRQUFRLEdBQXdCLFNBQVMsQ0FBQztRQUU5QyxJQUFJLFlBQVksSUFBSSxJQUFJO1lBQ3BCLENBQUMsWUFBWSx1QkFBb0IsU0FBUyxJQUFJLFlBQVksa0JBQWUsU0FBUyxDQUFDLEVBQUU7O1lBRXZGLFVBQVUsR0FBRyxZQUFZLGlCQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxjQUFXLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDNUUsZUFBZSxHQUFHLFlBQVksc0JBQW1CLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxtQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQztTQUM1RjthQUFNLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTs7WUFFL0IsVUFBVSxHQUFHLFlBQVksa0JBQWUsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLGVBQVksQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM5RSxlQUFlLEdBQUcsWUFBWSx1QkFBb0IsSUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLG9CQUFpQixDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzdGLFFBQVEsR0FBRyxZQUFZLGdCQUFhLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxhQUFVLENBQUMsQ0FBQyxTQUFTLENBQUM7U0FDOUU7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztLQUN6RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEwQkQsT0FBTyxDQUNILFNBQWMsRUFBRSxlQUF1RSxFQUN2RixjQUF5RDtRQUMzRCxPQUFPLElBQUksV0FBVyxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDcEU7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQkQsS0FBSyxDQUNELGNBQXFCLEVBQ3JCLGVBQXVFLEVBQ3ZFLGNBQXlEOztRQUMzRCxNQUFNLFFBQVEsR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLE9BQU8sSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztLQUNqRTs7Ozs7O0lBR0QsZUFBZSxDQUFDLGNBQWtDOztRQUNoRCxNQUFNLFFBQVEsR0FBcUMsRUFBRSxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ2hELFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1NBQzFFLENBQUMsQ0FBQztRQUNILE9BQU8sUUFBUSxDQUFDO0tBQ2pCOzs7Ozs7SUFHRCxjQUFjLENBQUMsYUFBa0I7UUFDL0IsSUFBSSxhQUFhLFlBQVksV0FBVyxJQUFJLGFBQWEsWUFBWSxTQUFTO1lBQzFFLGFBQWEsWUFBWSxTQUFTLEVBQUU7WUFDdEMsT0FBTyxhQUFhLENBQUM7U0FFdEI7YUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7O1lBQ3ZDLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDL0IsTUFBTSxTQUFTLEdBQWdCLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzs7WUFDbEYsTUFBTSxjQUFjLEdBQXFCLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM1RixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUV2RDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3BDO0tBQ0Y7OztZQWpIRixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQWJzdHJhY3RDb250cm9sT3B0aW9ucywgRm9ybUFycmF5LCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBGb3JtSG9va3N9IGZyb20gJy4vbW9kZWwnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhbiBgQWJzdHJhY3RDb250cm9sYCBmcm9tIGEgdXNlci1zcGVjaWZpZWQgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBUaGUgYEZvcm1CdWlsZGVyYCBwcm92aWRlcyBzeW50YWN0aWMgc3VnYXIgdGhhdCBzaG9ydGVucyBjcmVhdGluZyBpbnN0YW5jZXMgb2YgYSBgRm9ybUNvbnRyb2xgLFxuICogYEZvcm1Hcm91cGAsIG9yIGBGb3JtQXJyYXlgLiBJdCByZWR1Y2VzIHRoZSBhbW91bnQgb2YgYm9pbGVycGxhdGUgbmVlZGVkIHRvIGJ1aWxkIGNvbXBsZXhcbiAqIGZvcm1zLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXSgvZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzQ29uZmlnIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXh0cmEgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgdGhlIGBGb3JtR3JvdXBgLlxuICAgKiAqIGB2YWxpZGF0b3JgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiAqIGBhc3luY1ZhbGlkYXRvcmA6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqXG4gICAqL1xuICBncm91cChjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sIGxlZ2FjeU9yT3B0czoge1trZXk6IHN0cmluZ106IGFueX18bnVsbCA9IG51bGwpOlxuICAgICAgRm9ybUdyb3VwIHtcbiAgICBjb25zdCBjb250cm9scyA9IHRoaXMuX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzQ29uZmlnKTtcblxuICAgIGxldCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwgPSBudWxsO1xuICAgIGxldCBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwgPSBudWxsO1xuICAgIGxldCB1cGRhdGVPbjogRm9ybUhvb2tzfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChsZWdhY3lPck9wdHMgIT0gbnVsbCAmJlxuICAgICAgICAobGVnYWN5T3JPcHRzLmFzeW5jVmFsaWRhdG9yICE9PSB1bmRlZmluZWQgfHwgbGVnYWN5T3JPcHRzLnZhbGlkYXRvciAhPT0gdW5kZWZpbmVkKSkge1xuICAgICAgLy8gYGxlZ2FjeU9yT3B0c2AgYXJlIGxlZ2FjeSBmb3JtIGdyb3VwIG9wdGlvbnNcbiAgICAgIHZhbGlkYXRvcnMgPSBsZWdhY3lPck9wdHMudmFsaWRhdG9yICE9IG51bGwgPyBsZWdhY3lPck9wdHMudmFsaWRhdG9yIDogbnVsbDtcbiAgICAgIGFzeW5jVmFsaWRhdG9ycyA9IGxlZ2FjeU9yT3B0cy5hc3luY1ZhbGlkYXRvciAhPSBudWxsID8gbGVnYWN5T3JPcHRzLmFzeW5jVmFsaWRhdG9yIDogbnVsbDtcbiAgICB9IGVsc2UgaWYgKGxlZ2FjeU9yT3B0cyAhPSBudWxsKSB7XG4gICAgICAvLyBgbGVnYWN5T3JPcHRzYCBhcmUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgXG4gICAgICB2YWxpZGF0b3JzID0gbGVnYWN5T3JPcHRzLnZhbGlkYXRvcnMgIT0gbnVsbCA/IGxlZ2FjeU9yT3B0cy52YWxpZGF0b3JzIDogbnVsbDtcbiAgICAgIGFzeW5jVmFsaWRhdG9ycyA9IGxlZ2FjeU9yT3B0cy5hc3luY1ZhbGlkYXRvcnMgIT0gbnVsbCA/IGxlZ2FjeU9yT3B0cy5hc3luY1ZhbGlkYXRvcnMgOiBudWxsO1xuICAgICAgdXBkYXRlT24gPSBsZWdhY3lPck9wdHMudXBkYXRlT24gIT0gbnVsbCA/IGxlZ2FjeU9yT3B0cy51cGRhdGVPbiA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEZvcm1Hcm91cChjb250cm9scywge2FzeW5jVmFsaWRhdG9ycywgdXBkYXRlT24sIHZhbGlkYXRvcnN9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtQ29udHJvbGAgd2l0aCB0aGUgZ2l2ZW4gc3RhdGUsIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgSW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHN0YXRlIHZhbHVlLCBvclxuICAgKiB3aXRoIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBJbml0aWFsaXplIGEgY29udHJvbCBhcyBkaXNhYmxlZFxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmV0dXJucyBhIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlIGluIGEgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cImZvcm1zL3RzL2Zvcm1CdWlsZGVyL2Zvcm1fYnVpbGRlcl9leGFtcGxlLnRzXCJcbiAgICogICBsaW5lbnVtcz1cImZhbHNlXCIgcmVnaW9uPVwiZGlzYWJsZWQtY29udHJvbFwiPlxuICAgKiA8L2NvZGUtZXhhbXBsZT5cbiAgICovXG4gIGNvbnRyb2woXG4gICAgICBmb3JtU3RhdGU6IGFueSwgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1BcnJheWAgZnJvbSB0aGUgZ2l2ZW4gYXJyYXkgb2YgY29uZmlndXJhdGlvbnMsXG4gICAqIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sc0NvbmZpZyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scyBvciBjb250cm9sIGNvbmZpZ3MuIEVhY2hcbiAgICogY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhbiBpbmRleCB3aGVuIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqL1xuICBhcnJheShcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiBhbnlbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUFycmF5IHtcbiAgICBjb25zdCBjb250cm9scyA9IGNvbnRyb2xzQ29uZmlnLm1hcChjID0+IHRoaXMuX2NyZWF0ZUNvbnRyb2woYykpO1xuICAgIHJldHVybiBuZXcgRm9ybUFycmF5KGNvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzQ29uZmlnOiB7W2s6IHN0cmluZ106IGFueX0pOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7XG4gICAgY29uc3QgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9ID0ge307XG4gICAgT2JqZWN0LmtleXMoY29udHJvbHNDb25maWcpLmZvckVhY2goY29udHJvbE5hbWUgPT4ge1xuICAgICAgY29udHJvbHNbY29udHJvbE5hbWVdID0gdGhpcy5fY3JlYXRlQ29udHJvbChjb250cm9sc0NvbmZpZ1tjb250cm9sTmFtZV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjb250cm9scztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZUNvbnRyb2woY29udHJvbENvbmZpZzogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAoY29udHJvbENvbmZpZyBpbnN0YW5jZW9mIEZvcm1Db250cm9sIHx8IGNvbnRyb2xDb25maWcgaW5zdGFuY2VvZiBGb3JtR3JvdXAgfHxcbiAgICAgICAgY29udHJvbENvbmZpZyBpbnN0YW5jZW9mIEZvcm1BcnJheSkge1xuICAgICAgcmV0dXJuIGNvbnRyb2xDb25maWc7XG5cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbENvbmZpZykpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udHJvbENvbmZpZ1swXTtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSBjb250cm9sQ29uZmlnLmxlbmd0aCA+IDEgPyBjb250cm9sQ29uZmlnWzFdIDogbnVsbDtcbiAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZuID0gY29udHJvbENvbmZpZy5sZW5ndGggPiAyID8gY29udHJvbENvbmZpZ1syXSA6IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sKHZhbHVlLCB2YWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sKGNvbnRyb2xDb25maWcpO1xuICAgIH1cbiAgfVxufVxuIl19