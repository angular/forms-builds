/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/form_builder.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from './model';
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {?} options
 * @return {?}
 */
function isAbstractControlOptions(options) {
    return ((/** @type {?} */ (options))).asyncValidators !== undefined ||
        ((/** @type {?} */ (options))).validators !== undefined ||
        ((/** @type {?} */ (options))).updateOn !== undefined;
}
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
     * @param {?=} options Configuration options object for the `FormGroup`. The object can
     * have two shapes:
     *
     * 1) `AbstractControlOptions` object (preferred), which consists of:
     * * `validators`: A synchronous validator function, or an array of validator functions
     * * `asyncValidators`: A single async validator or array of async validator functions
     * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur' |
     * submit')
     *
     * 2) Legacy configuration object, which consists of:
     * * `validator`: A synchronous validator function, or an array of validator functions
     * * `asyncValidator`: A single async validator or array of async validator functions
     *
     * @return {?}
     */
    group(controlsConfig, options = null) {
        /** @type {?} */
        const controls = this._reduceControls(controlsConfig);
        /** @type {?} */
        let validators = null;
        /** @type {?} */
        let asyncValidators = null;
        /** @type {?} */
        let updateOn = undefined;
        if (options != null) {
            if (isAbstractControlOptions(options)) {
                // `options` are `AbstractControlOptions`
                validators = options.validators != null ? options.validators : null;
                asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
                updateOn = options.updateOn != null ? options.updateOn : undefined;
            }
            else {
                // `options` are legacy form group options
                validators = options['validator'] != null ? options['validator'] : null;
                asyncValidators = options['asyncValidator'] != null ? options['asyncValidator'] : null;
            }
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
     * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
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
        const controls = controlsConfig.map((/**
         * @param {?} c
         * @return {?}
         */
        c => this._createControl(c)));
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
        Object.keys(controlsConfig).forEach((/**
         * @param {?} controlName
         * @return {?}
         */
        controlName => {
            controls[controlName] = this._createControl(controlsConfig[controlName]);
        }));
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
    { type: Injectable },
];
/** @nocollapse */ FormBuilder.ɵfac = function FormBuilder_Factory(t) { return new (t || FormBuilder)(); };
/** @nocollapse */ FormBuilder.ɵprov = i0.ɵɵdefineInjectable({ token: FormBuilder, factory: FormBuilder.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FormBuilder, [{
        type: Injectable
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHekMsT0FBTyxFQUEwQyxTQUFTLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBWSxNQUFNLFNBQVMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQUU5RyxTQUFTLHdCQUF3QixDQUFDLE9BQ29CO0lBQ3BELE9BQU8sQ0FBQyxtQkFBd0IsT0FBTyxFQUFBLENBQUMsQ0FBQyxlQUFlLEtBQUssU0FBUztRQUNsRSxDQUFDLG1CQUF3QixPQUFPLEVBQUEsQ0FBQyxDQUFDLFVBQVUsS0FBSyxTQUFTO1FBQzFELENBQUMsbUJBQXdCLE9BQU8sRUFBQSxDQUFDLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQztBQUMvRCxDQUFDOzs7Ozs7Ozs7Ozs7O0FBZUQsTUFBTSxPQUFPLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0J0QixLQUFLLENBQ0QsY0FBb0MsRUFDcEMsVUFBNEQsSUFBSTs7Y0FDNUQsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDOztZQUVqRCxVQUFVLEdBQW1DLElBQUk7O1lBQ2pELGVBQWUsR0FBNkMsSUFBSTs7WUFDaEUsUUFBUSxHQUF3QixTQUFTO1FBRTdDLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixJQUFJLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNyQyx5Q0FBeUM7Z0JBQ3pDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNwRSxlQUFlLEdBQUcsT0FBTyxDQUFDLGVBQWUsSUFBSSxJ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aWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQWJzdHJhY3RDb250cm9sT3B0aW9ucywgRm9ybUFycmF5LCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBGb3JtSG9va3N9IGZyb20gJy4vbW9kZWwnO1xuXG5mdW5jdGlvbiBpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnMob3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7W2tleTogc3RyaW5nXTogYW55fSk6IG9wdGlvbnMgaXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIHJldHVybiAoPEFic3RyYWN0Q29udHJvbE9wdGlvbnM+b3B0aW9ucykuYXN5bmNWYWxpZGF0b3JzICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICg8QWJzdHJhY3RDb250cm9sT3B0aW9ucz5vcHRpb25zKS52YWxpZGF0b3JzICE9PSB1bmRlZmluZWQgfHxcbiAgICAgICg8QWJzdHJhY3RDb250cm9sT3B0aW9ucz5vcHRpb25zKS51cGRhdGVPbiAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhbiBgQWJzdHJhY3RDb250cm9sYCBmcm9tIGEgdXNlci1zcGVjaWZpZWQgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBUaGUgYEZvcm1CdWlsZGVyYCBwcm92aWRlcyBzeW50YWN0aWMgc3VnYXIgdGhhdCBzaG9ydGVucyBjcmVhdGluZyBpbnN0YW5jZXMgb2YgYSBgRm9ybUNvbnRyb2xgLFxuICogYEZvcm1Hcm91cGAsIG9yIGBGb3JtQXJyYXlgLiBJdCByZWR1Y2VzIHRoZSBhbW91bnQgb2YgYm9pbGVycGxhdGUgbmVlZGVkIHRvIGJ1aWxkIGNvbXBsZXhcbiAqIGZvcm1zLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXSgvZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzQ29uZmlnIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1Hcm91cGAuIFRoZSBvYmplY3QgY2FuXG4gICAqIGhhdmUgdHdvIHNoYXBlczpcbiAgICpcbiAgICogMSkgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCAocHJlZmVycmVkKSwgd2hpY2ggY29uc2lzdHMgb2Y6XG4gICAqICogYHZhbGlkYXRvcnNgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiAqIGBhc3luY1ZhbGlkYXRvcnNgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiAqIGB1cGRhdGVPbmA6IFRoZSBldmVudCB1cG9uIHdoaWNoIHRoZSBjb250cm9sIHNob3VsZCBiZSB1cGRhdGVkIChvcHRpb25zOiAnY2hhbmdlJyB8ICdibHVyJyB8XG4gICAqIHN1Ym1pdCcpXG4gICAqXG4gICAqIDIpIExlZ2FjeSBjb25maWd1cmF0aW9uIG9iamVjdCwgd2hpY2ggY29uc2lzdHMgb2Y6XG4gICAqICogYHZhbGlkYXRvcmA6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqICogYGFzeW5jVmFsaWRhdG9yYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsID0gbnVsbCk6IEZvcm1Hcm91cCB7XG4gICAgY29uc3QgY29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9sc0NvbmZpZyk7XG5cbiAgICBsZXQgdmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgdXBkYXRlT246IEZvcm1Ib29rc3x1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAob3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgXG4gICAgICAgIHZhbGlkYXRvcnMgPSBvcHRpb25zLnZhbGlkYXRvcnMgIT0gbnVsbCA/IG9wdGlvbnMudmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIGFzeW5jVmFsaWRhdG9ycyA9IG9wdGlvbnMuYXN5bmNWYWxpZGF0b3JzICE9IG51bGwgPyBvcHRpb25zLmFzeW5jVmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIHVwZGF0ZU9uID0gb3B0aW9ucy51cGRhdGVPbiAhPSBudWxsID8gb3B0aW9ucy51cGRhdGVPbiA6IHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgbGVnYWN5IGZvcm0gZ3JvdXAgb3B0aW9uc1xuICAgICAgICB2YWxpZGF0b3JzID0gb3B0aW9uc1sndmFsaWRhdG9yJ10gIT0gbnVsbCA/IG9wdGlvbnNbJ3ZhbGlkYXRvciddIDogbnVsbDtcbiAgICAgICAgYXN5bmNWYWxpZGF0b3JzID0gb3B0aW9uc1snYXN5bmNWYWxpZGF0b3InXSAhPSBudWxsID8gb3B0aW9uc1snYXN5bmNWYWxpZGF0b3InXSA6IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGb3JtR3JvdXAoY29udHJvbHMsIHthc3luY1ZhbGlkYXRvcnMsIHVwZGF0ZU9uLCB2YWxpZGF0b3JzfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUNvbnRyb2xgIHdpdGggdGhlIGdpdmVuIHN0YXRlLCB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCBzdGF0ZSB2YWx1ZSwgb3JcbiAgICogd2l0aCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgSW5pdGlhbGl6ZSBhIGNvbnRyb2wgYXMgZGlzYWJsZWRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJldHVybnMgYSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSBpbiBhIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJmb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50c1wiIHJlZ2lvbj1cImRpc2FibGVkLWNvbnRyb2xcIj5cbiAgICogPC9jb2RlLWV4YW1wbGU+XG4gICAqL1xuICBjb250cm9sKFxuICAgICAgZm9ybVN0YXRlOiBhbnksIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQXJyYXlgIGZyb20gdGhlIGdpdmVuIGFycmF5IG9mIGNvbmZpZ3VyYXRpb25zLFxuICAgKiB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHNDb25maWcgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMgb3IgY29udHJvbCBjb25maWdzLiBFYWNoXG4gICAqIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW4gaW5kZXggd2hlbiBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKi9cbiAgYXJyYXkoXG4gICAgICBjb250cm9sc0NvbmZpZzogYW55W10sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1BcnJheSB7XG4gICAgY29uc3QgY29udHJvbHMgPSBjb250cm9sc0NvbmZpZy5tYXAoYyA9PiB0aGlzLl9jcmVhdGVDb250cm9sKGMpKTtcbiAgICByZXR1cm4gbmV3IEZvcm1BcnJheShjb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDb250cm9scyhjb250cm9sc0NvbmZpZzoge1trOiBzdHJpbmddOiBhbnl9KToge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0ge1xuICAgIGNvbnN0IGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGNvbnRyb2xzQ29uZmlnKS5mb3JFYWNoKGNvbnRyb2xOYW1lID0+IHtcbiAgICAgIGNvbnRyb2xzW2NvbnRyb2xOYW1lXSA9IHRoaXMuX2NyZWF0ZUNvbnRyb2woY29udHJvbHNDb25maWdbY29udHJvbE5hbWVdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29udHJvbHM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jcmVhdGVDb250cm9sKGNvbnRyb2xDb25maWc6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKGNvbnRyb2xDb25maWcgaW5zdGFuY2VvZiBGb3JtQ29udHJvbCB8fCBjb250cm9sQ29uZmlnIGluc3RhbmNlb2YgRm9ybUdyb3VwIHx8XG4gICAgICAgIGNvbnRyb2xDb25maWcgaW5zdGFuY2VvZiBGb3JtQXJyYXkpIHtcbiAgICAgIHJldHVybiBjb250cm9sQ29uZmlnO1xuXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xDb25maWcpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnRyb2xDb25maWdbMF07XG4gICAgICBjb25zdCB2YWxpZGF0b3I6IFZhbGlkYXRvckZuID0gY29udHJvbENvbmZpZy5sZW5ndGggPiAxID8gY29udHJvbENvbmZpZ1sxXSA6IG51bGw7XG4gICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbiA9IGNvbnRyb2xDb25maWcubGVuZ3RoID4gMiA/IGNvbnRyb2xDb25maWdbMl0gOiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCh2YWx1ZSwgdmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcik7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbChjb250cm9sQ29uZmlnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==