/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from './form_providers';
import { FormArray, FormControl, FormGroup } from './model';
import * as i0 from "@angular/core";
function isAbstractControlOptions(options) {
    return options.asyncValidators !== undefined ||
        options.validators !== undefined ||
        options.updateOn !== undefined;
}
/**
 * @description
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * The `FormBuilder` provides syntactic sugar that shortens creating instances of a `FormControl`,
 * `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to build complex
 * forms.
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 * @publicApi
 */
export class FormBuilder {
    group(controlsConfig, options = null) {
        const controls = this._reduceControls(controlsConfig);
        let validators = null;
        let asyncValidators = null;
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
     * @description
     * Construct a new `FormControl` with the given state, validators and options.
     *
     * @param formState Initializes the control with an initial state value, or
     * with an object that contains both a value and a disabled status.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator
     * functions.
     *
     * @usageNotes
     *
     * ### Initialize a control as disabled
     *
     * The following example returns a control with an initial value in a disabled state.
     *
     * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
     * </code-example>
     */
    control(formState, validatorOrOpts, asyncValidator) {
        return new FormControl(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Constructs a new `FormArray` from the given array of configurations,
     * validators and options.
     *
     * @param controlsConfig An array of child controls or control configs. Each
     * child control is given an index when it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator
     * functions.
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        const controls = controlsConfig.map(c => this._createControl(c));
        return new FormArray(controls, validatorOrOpts, asyncValidator);
    }
    /** @internal */
    _reduceControls(controlsConfig) {
        const controls = {};
        Object.keys(controlsConfig).forEach(controlName => {
            controls[controlName] = this._createControl(controlsConfig[controlName]);
        });
        return controls;
    }
    /** @internal */
    _createControl(controlConfig) {
        if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
            controlConfig instanceof FormArray) {
            return controlConfig;
        }
        else if (Array.isArray(controlConfig)) {
            const value = controlConfig[0];
            const validator = controlConfig.length > 1 ? controlConfig[1] : null;
            const asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else {
            return this.control(controlConfig);
        }
    }
}
FormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.0+18.sha-7441747.with-local-changes", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.0-next.0+18.sha-7441747.with-local-changes", ngImport: i0, type: FormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.0+18.sha-7441747.with-local-changes", ngImport: i0, type: FormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFBMEMsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQVksTUFBTSxTQUFTLENBQUM7O0FBRTlHLFNBQVMsd0JBQXdCLENBQUMsT0FDb0I7SUFDcEQsT0FBZ0MsT0FBUSxDQUFDLGVBQWUsS0FBSyxTQUFTO1FBQ3pDLE9BQVEsQ0FBQyxVQUFVLEtBQUssU0FBUztRQUNqQyxPQUFRLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQztBQUMvRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFFSCxNQUFNLE9BQU8sV0FBVztJQThDdEIsS0FBSyxDQUNELGNBQW9DLEVBQ3BDLFVBQTRELElBQUk7UUFDbEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV0RCxJQUFJLFVBQVUsR0FBbUMsSUFBSSxDQUFDO1FBQ3RELElBQUksZUFBZSxHQUE2QyxJQUFJLENBQUM7UUFDckUsSUFBSSxRQUFRLEdBQXdCLFNBQVMsQ0FBQztRQUU5QyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDbkIsSUFBSSx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDckMseUNBQXlDO2dCQUN6QyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDcEUsZUFBZSxHQUFHLE9BQU8sQ0FBQyxlQUFlLElBQUks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LFVBQVUsRUFBRSxtQkFBbUIsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge1JlYWN0aXZlRm9ybXNNb2R1bGV9IGZyb20gJy4vZm9ybV9wcm92aWRlcnMnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIEFic3RyYWN0Q29udHJvbE9wdGlvbnMsIEZvcm1BcnJheSwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgRm9ybUhvb2tzfSBmcm9tICcuL21vZGVsJztcblxuZnVuY3Rpb24gaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1trZXk6IHN0cmluZ106IGFueX0pOiBvcHRpb25zIGlzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMge1xuICByZXR1cm4gKDxBYnN0cmFjdENvbnRyb2xPcHRpb25zPm9wdGlvbnMpLmFzeW5jVmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAoPEFic3RyYWN0Q29udHJvbE9wdGlvbnM+b3B0aW9ucykudmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAoPEFic3RyYWN0Q29udHJvbE9wdGlvbnM+b3B0aW9ucykudXBkYXRlT24gIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW4gYEFic3RyYWN0Q29udHJvbGAgZnJvbSBhIHVzZXItc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIGBGb3JtQnVpbGRlcmAgcHJvdmlkZXMgc3ludGFjdGljIHN1Z2FyIHRoYXQgc2hvcnRlbnMgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIGEgYEZvcm1Db250cm9sYCxcbiAqIGBGb3JtR3JvdXBgLCBvciBgRm9ybUFycmF5YC4gSXQgcmVkdWNlcyB0aGUgYW1vdW50IG9mIGJvaWxlcnBsYXRlIG5lZWRlZCB0byBidWlsZCBjb21wbGV4XG4gKiBmb3Jtcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oL2d1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IFJlYWN0aXZlRm9ybXNNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIEZvcm1CdWlsZGVyIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sc0NvbmZpZyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIG9iamVjdCBmb3IgdGhlIGBGb3JtR3JvdXBgLiBUaGUgb2JqZWN0IHNob3VsZCBoYXZlIHRoZVxuICAgKiB0aGUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIHR5cGUgYW5kIG1pZ2h0IGNvbnRhaW4gdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAqICogYHZhbGlkYXRvcnNgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiAqIGBhc3luY1ZhbGlkYXRvcnNgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiAqIGB1cGRhdGVPbmA6IFRoZSBldmVudCB1cG9uIHdoaWNoIHRoZSBjb250cm9sIHNob3VsZCBiZSB1cGRhdGVkIChvcHRpb25zOiAnY2hhbmdlJyB8ICdibHVyJyB8XG4gICAqIHN1Ym1pdCcpXG4gICAqL1xuICBncm91cChcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM/OiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICApOiBGb3JtR3JvdXA7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBpcyBub3QgdHlwZXNhZmUgYW5kIGNhbiByZXN1bHQgaW4gaXNzdWVzIHdpdGggQ2xvc3VyZSBDb21waWxlciByZW5hbWluZy5cbiAgICogVXNlIHRoZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgIG92ZXJsb2FkIHdpdGggYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGluc3RlYWQuXG4gICAqIE5vdGUgdGhhdCBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgZXhwZWN0cyBgdmFsaWRhdG9yc2AgYW5kIGBhc3luY1ZhbGlkYXRvcnNgIHRvIGJlIHZhbGlkXG4gICAqIHZhbGlkYXRvcnMuIElmIHlvdSBoYXZlIGN1c3RvbSB2YWxpZGF0b3JzLCBtYWtlIHN1cmUgdGhlaXIgdmFsaWRhdGlvbiBmdW5jdGlvbiBwYXJhbWV0ZXIgaXNcbiAgICogYEFic3RyYWN0Q29udHJvbGAgYW5kIG5vdCBhIHN1Yi1jbGFzcywgc3VjaCBhcyBgRm9ybUdyb3VwYC4gVGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkIHdpdGhcbiAgICogYW4gb2JqZWN0IG9mIHR5cGUgYEFic3RyYWN0Q29udHJvbGAgYW5kIHRoYXQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgZG93bmNhc3QgdG8gYSBzdWJjbGFzcywgc29cbiAgICogVHlwZVNjcmlwdCBzZWVzIHRoaXMgYXMgYW4gZXJyb3IuIEZvciBleGFtcGxlLCBjaGFuZ2UgdGhlIGAoZ3JvdXA6IEZvcm1Hcm91cCkgPT5cbiAgICogVmFsaWRhdGlvbkVycm9yc3xudWxsYCBzaWduYXR1cmUgdG8gYmUgYChncm91cDogQWJzdHJhY3RDb250cm9sKSA9PiBWYWxpZGF0aW9uRXJyb3JzfG51bGxgLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHNDb25maWcgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIGxlZ2FjeSBjb25maWd1cmF0aW9uXG4gICAqIG9iamVjdCBjb25zaXN0cyBvZjpcbiAgICogKiBgdmFsaWRhdG9yYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogKiBgYXN5bmNWYWxpZGF0b3JgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiBOb3RlOiB0aGUgbGVnYWN5IGZvcm1hdCBpcyBkZXByZWNhdGVkIGFuZCBtaWdodCBiZSByZW1vdmVkIGluIG9uZSBvZiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uc1xuICAgKiBvZiBBbmd1bGFyLlxuICAgKi9cbiAgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgICk6IEZvcm1Hcm91cDtcbiAgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGwgPSBudWxsKTogRm9ybUdyb3VwIHtcbiAgICBjb25zdCBjb250cm9scyA9IHRoaXMuX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzQ29uZmlnKTtcblxuICAgIGxldCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwgPSBudWxsO1xuICAgIGxldCBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwgPSBudWxsO1xuICAgIGxldCB1cGRhdGVPbjogRm9ybUhvb2tzfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChvcHRpb25zICE9IG51bGwpIHtcbiAgICAgIGlmIChpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgICAgLy8gYG9wdGlvbnNgIGFyZSBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2BcbiAgICAgICAgdmFsaWRhdG9ycyA9IG9wdGlvbnMudmFsaWRhdG9ycyAhPSBudWxsID8gb3B0aW9ucy52YWxpZGF0b3JzIDogbnVsbDtcbiAgICAgICAgYXN5bmNWYWxpZGF0b3JzID0gb3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgIT0gbnVsbCA/IG9wdGlvbnMuYXN5bmNWYWxpZGF0b3JzIDogbnVsbDtcbiAgICAgICAgdXBkYXRlT24gPSBvcHRpb25zLnVwZGF0ZU9uICE9IG51bGwgPyBvcHRpb25zLnVwZGF0ZU9uIDogdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYG9wdGlvbnNgIGFyZSBsZWdhY3kgZm9ybSBncm91cCBvcHRpb25zXG4gICAgICAgIHZhbGlkYXRvcnMgPSBvcHRpb25zWyd2YWxpZGF0b3InXSAhPSBudWxsID8gb3B0aW9uc1sndmFsaWRhdG9yJ10gOiBudWxsO1xuICAgICAgICBhc3luY1ZhbGlkYXRvcnMgPSBvcHRpb25zWydhc3luY1ZhbGlkYXRvciddICE9IG51bGwgPyBvcHRpb25zWydhc3luY1ZhbGlkYXRvciddIDogbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEZvcm1Hcm91cChjb250cm9scywge2FzeW5jVmFsaWRhdG9ycywgdXBkYXRlT24sIHZhbGlkYXRvcnN9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtQ29udHJvbGAgd2l0aCB0aGUgZ2l2ZW4gc3RhdGUsIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgSW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHN0YXRlIHZhbHVlLCBvclxuICAgKiB3aXRoIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBJbml0aWFsaXplIGEgY29udHJvbCBhcyBkaXNhYmxlZFxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmV0dXJucyBhIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlIGluIGEgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cImZvcm1zL3RzL2Zvcm1CdWlsZGVyL2Zvcm1fYnVpbGRlcl9leGFtcGxlLnRzXCIgcmVnaW9uPVwiZGlzYWJsZWQtY29udHJvbFwiPlxuICAgKiA8L2NvZGUtZXhhbXBsZT5cbiAgICovXG4gIGNvbnRyb2woXG4gICAgICBmb3JtU3RhdGU6IGFueSwgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1BcnJheWAgZnJvbSB0aGUgZ2l2ZW4gYXJyYXkgb2YgY29uZmlndXJhdGlvbnMsXG4gICAqIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sc0NvbmZpZyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scyBvciBjb250cm9sIGNvbmZpZ3MuIEVhY2hcbiAgICogY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhbiBpbmRleCB3aGVuIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqL1xuICBhcnJheShcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiBhbnlbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUFycmF5IHtcbiAgICBjb25zdCBjb250cm9scyA9IGNvbnRyb2xzQ29uZmlnLm1hcChjID0+IHRoaXMuX2NyZWF0ZUNvbnRyb2woYykpO1xuICAgIHJldHVybiBuZXcgRm9ybUFycmF5KGNvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzQ29uZmlnOiB7W2s6IHN0cmluZ106IGFueX0pOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7XG4gICAgY29uc3QgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9ID0ge307XG4gICAgT2JqZWN0LmtleXMoY29udHJvbHNDb25maWcpLmZvckVhY2goY29udHJvbE5hbWUgPT4ge1xuICAgICAgY29udHJvbHNbY29udHJvbE5hbWVdID0gdGhpcy5fY3JlYXRlQ29udHJvbChjb250cm9sc0NvbmZpZ1tjb250cm9sTmFtZV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjb250cm9scztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZUNvbnRyb2woY29udHJvbENvbmZpZzogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAoY29udHJvbENvbmZpZyBpbnN0YW5jZW9mIEZvcm1Db250cm9sIHx8IGNvbnRyb2xDb25maWcgaW5zdGFuY2VvZiBGb3JtR3JvdXAgfHxcbiAgICAgICAgY29udHJvbENvbmZpZyBpbnN0YW5jZW9mIEZvcm1BcnJheSkge1xuICAgICAgcmV0dXJuIGNvbnRyb2xDb25maWc7XG5cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbENvbmZpZykpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udHJvbENvbmZpZ1swXTtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSBjb250cm9sQ29uZmlnLmxlbmd0aCA+IDEgPyBjb250cm9sQ29uZmlnWzFdIDogbnVsbDtcbiAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZuID0gY29udHJvbENvbmZpZy5sZW5ndGggPiAyID8gY29udHJvbENvbmZpZ1syXSA6IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sKHZhbHVlLCB2YWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sKGNvbnRyb2xDb25maWcpO1xuICAgIH1cbiAgfVxufVxuIl19