import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from './model';
import * as i0 from "@angular/core";
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
    { type: Injectable },
];
FormBuilder.ngInjectableDef = i0.defineInjectable({ token: FormBuilder, factory: function FormBuilder_Factory(t) { return new (t || FormBuilder)(); }, providedIn: null });
/*@__PURE__*/ i0.ɵsetClassMetadata(FormBuilder, [{
        type: Injectable
    }], null, null);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE9BQU8sRUFBMEMsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQVksTUFBTSxTQUFTLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlOUcsTUFBTSxPQUFPLFdBQVc7Ozs7Ozs7Ozs7O0lBYXRCLEtBQUssQ0FBQyxjQUFvQyxFQUFFLGVBQTBDLElBQUk7O1FBRXhGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7O1FBRXRELElBQUksVUFBVSxHQUFtQyxJQUFJLENBQUM7O1FBQ3RELElBQUksZUFBZSxHQUE2QyxJQUFJLENBQUM7O1FBQ3JFLElBQUksUUFBUSxHQUF3QixTQUFTLENBQUM7UUFFOUMsSUFBSSxZQUFZLElBQUksSUFBSTtZQUNwQixDQUFDLFlBQVksdUJBQW9CLFNBQVMsSUFBSSxZQUFZLGtCQUFlLFNBQVMsQ0FBQyxFQUFFOztZQUV2RixVQUFVLEdBQUcsWUFBWSxpQkFBYyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksY0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzVFLGVBQWUsR0FBRyxZQUFZLHNCQUFtQixJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksbUJBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FDNUY7YUFBTSxJQUFJLFlBQVksSUFBSSxJQUFJLEVBQUU7O1lBRS9CLFVBQVUsR0FBRyxZQUFZLGtCQUFlLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxlQUFZLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUUsZUFBZSxHQUFHLFlBQVksdUJBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxvQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUM3RixRQUFRLEdBQUcsWUFBWSxnQkFBYSxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksYUFBVSxDQUFDLENBQUMsU0FBUyxDQUFDO1NBQzlFO1FBRUQsT0FBTyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQyxDQUFDLENBQUM7S0FDekU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMEJELE9BQU8sQ0FDSCxTQUFjLEVBQUUsZUFBdUUsRUFDdkYsY0FBeUQ7UUFDM0QsT0FBTyxJQUFJLFdBQVcsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ3BFOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JELEtBQUssQ0FDRCxjQUFxQixFQUNyQixlQUF1RSxFQUN2RSxjQUF5RDs7UUFDM0QsTUFBTSxRQUFRLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRSxPQUFPLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDakU7Ozs7OztJQUdELGVBQWUsQ0FBQyxjQUFrQzs7UUFDaEQsTUFBTSxRQUFRLEdBQXFDLEVBQUUsQ0FBQztRQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUNoRCxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUMxRSxDQUFDLENBQUM7UUFDSCxPQUFPLFFBQVEsQ0FBQztLQUNqQjs7Ozs7O0lBR0QsY0FBYyxDQUFDLGFBQWtCO1FBQy9CLElBQUksYUFBYSxZQUFZLFdBQVcsSUFBSSxhQUFhLFlBQVksU0FBUztZQUMxRSxhQUFhLFlBQVksU0FBUyxFQUFFO1lBQ3RDLE9BQU8sYUFBYSxDQUFDO1NBRXRCO2FBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFOztZQUN2QyxNQUFNLEtBQUssR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBQy9CLE1BQU0sU0FBUyxHQUFnQixhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7O1lBQ2xGLE1BQU0sY0FBYyxHQUFxQixhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDNUYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FFdkQ7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNwQztLQUNGOzs7WUFqSEYsVUFBVTs7MkRBQ0UsV0FBVyw4REFBWCxXQUFXO21DQUFYLFdBQVc7Y0FEdkIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIEFic3RyYWN0Q29udHJvbE9wdGlvbnMsIEZvcm1BcnJheSwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgRm9ybUhvb2tzfSBmcm9tICcuL21vZGVsJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW4gYEFic3RyYWN0Q29udHJvbGAgZnJvbSBhIHVzZXItc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIGBGb3JtQnVpbGRlcmAgcHJvdmlkZXMgc3ludGFjdGljIHN1Z2FyIHRoYXQgc2hvcnRlbnMgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIGEgYEZvcm1Db250cm9sYCxcbiAqIGBGb3JtR3JvdXBgLCBvciBgRm9ybUFycmF5YC4gSXQgcmVkdWNlcyB0aGUgYW1vdW50IG9mIGJvaWxlcnBsYXRlIG5lZWRlZCB0byBidWlsZCBjb21wbGV4XG4gKiBmb3Jtcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oL2d1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEZvcm1CdWlsZGVyIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sc0NvbmZpZyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIGV4dHJhIEFuIG9iamVjdCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnMgZm9yIHRoZSBgRm9ybUdyb3VwYC5cbiAgICogKiBgdmFsaWRhdG9yYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogKiBgYXN5bmNWYWxpZGF0b3JgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKlxuICAgKi9cbiAgZ3JvdXAoY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBsZWdhY3lPck9wdHM6IHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGwgPSBudWxsKTpcbiAgICAgIEZvcm1Hcm91cCB7XG4gICAgY29uc3QgY29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9sc0NvbmZpZyk7XG5cbiAgICBsZXQgdmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgdXBkYXRlT246IEZvcm1Ib29rc3x1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAobGVnYWN5T3JPcHRzICE9IG51bGwgJiZcbiAgICAgICAgKGxlZ2FjeU9yT3B0cy5hc3luY1ZhbGlkYXRvciAhPT0gdW5kZWZpbmVkIHx8IGxlZ2FjeU9yT3B0cy52YWxpZGF0b3IgIT09IHVuZGVmaW5lZCkpIHtcbiAgICAgIC8vIGBsZWdhY3lPck9wdHNgIGFyZSBsZWdhY3kgZm9ybSBncm91cCBvcHRpb25zXG4gICAgICB2YWxpZGF0b3JzID0gbGVnYWN5T3JPcHRzLnZhbGlkYXRvciAhPSBudWxsID8gbGVnYWN5T3JPcHRzLnZhbGlkYXRvciA6IG51bGw7XG4gICAgICBhc3luY1ZhbGlkYXRvcnMgPSBsZWdhY3lPck9wdHMuYXN5bmNWYWxpZGF0b3IgIT0gbnVsbCA/IGxlZ2FjeU9yT3B0cy5hc3luY1ZhbGlkYXRvciA6IG51bGw7XG4gICAgfSBlbHNlIGlmIChsZWdhY3lPck9wdHMgIT0gbnVsbCkge1xuICAgICAgLy8gYGxlZ2FjeU9yT3B0c2AgYXJlIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYFxuICAgICAgdmFsaWRhdG9ycyA9IGxlZ2FjeU9yT3B0cy52YWxpZGF0b3JzICE9IG51bGwgPyBsZWdhY3lPck9wdHMudmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICBhc3luY1ZhbGlkYXRvcnMgPSBsZWdhY3lPck9wdHMuYXN5bmNWYWxpZGF0b3JzICE9IG51bGwgPyBsZWdhY3lPck9wdHMuYXN5bmNWYWxpZGF0b3JzIDogbnVsbDtcbiAgICAgIHVwZGF0ZU9uID0gbGVnYWN5T3JPcHRzLnVwZGF0ZU9uICE9IG51bGwgPyBsZWdhY3lPck9wdHMudXBkYXRlT24gOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGb3JtR3JvdXAoY29udHJvbHMsIHthc3luY1ZhbGlkYXRvcnMsIHVwZGF0ZU9uLCB2YWxpZGF0b3JzfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUNvbnRyb2xgIHdpdGggdGhlIGdpdmVuIHN0YXRlLCB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCBzdGF0ZSB2YWx1ZSwgb3JcbiAgICogd2l0aCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgSW5pdGlhbGl6ZSBhIGNvbnRyb2wgYXMgZGlzYWJsZWRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJldHVybnMgYSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSBpbiBhIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJmb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50c1wiXG4gICAqICAgbGluZW51bXM9XCJmYWxzZVwiIHJlZ2lvbj1cImRpc2FibGVkLWNvbnRyb2xcIj5cbiAgICogPC9jb2RlLWV4YW1wbGU+XG4gICAqL1xuICBjb250cm9sKFxuICAgICAgZm9ybVN0YXRlOiBhbnksIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQXJyYXlgIGZyb20gdGhlIGdpdmVuIGFycmF5IG9mIGNvbmZpZ3VyYXRpb25zLFxuICAgKiB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHNDb25maWcgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMgb3IgY29udHJvbCBjb25maWdzLiBFYWNoXG4gICAqIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW4gaW5kZXggd2hlbiBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKi9cbiAgYXJyYXkoXG4gICAgICBjb250cm9sc0NvbmZpZzogYW55W10sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1BcnJheSB7XG4gICAgY29uc3QgY29udHJvbHMgPSBjb250cm9sc0NvbmZpZy5tYXAoYyA9PiB0aGlzLl9jcmVhdGVDb250cm9sKGMpKTtcbiAgICByZXR1cm4gbmV3IEZvcm1BcnJheShjb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDb250cm9scyhjb250cm9sc0NvbmZpZzoge1trOiBzdHJpbmddOiBhbnl9KToge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0ge1xuICAgIGNvbnN0IGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGNvbnRyb2xzQ29uZmlnKS5mb3JFYWNoKGNvbnRyb2xOYW1lID0+IHtcbiAgICAgIGNvbnRyb2xzW2NvbnRyb2xOYW1lXSA9IHRoaXMuX2NyZWF0ZUNvbnRyb2woY29udHJvbHNDb25maWdbY29udHJvbE5hbWVdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29udHJvbHM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jcmVhdGVDb250cm9sKGNvbnRyb2xDb25maWc6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKGNvbnRyb2xDb25maWcgaW5zdGFuY2VvZiBGb3JtQ29udHJvbCB8fCBjb250cm9sQ29uZmlnIGluc3RhbmNlb2YgRm9ybUdyb3VwIHx8XG4gICAgICAgIGNvbnRyb2xDb25maWcgaW5zdGFuY2VvZiBGb3JtQXJyYXkpIHtcbiAgICAgIHJldHVybiBjb250cm9sQ29uZmlnO1xuXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xDb25maWcpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnRyb2xDb25maWdbMF07XG4gICAgICBjb25zdCB2YWxpZGF0b3I6IFZhbGlkYXRvckZuID0gY29udHJvbENvbmZpZy5sZW5ndGggPiAxID8gY29udHJvbENvbmZpZ1sxXSA6IG51bGw7XG4gICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbiA9IGNvbnRyb2xDb25maWcubGVuZ3RoID4gMiA/IGNvbnRyb2xDb25maWdbMl0gOiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCh2YWx1ZSwgdmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcik7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbChjb250cm9sQ29uZmlnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==