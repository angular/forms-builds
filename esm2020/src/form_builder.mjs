/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from './form_providers';
import { FormArray, FormControl, FormGroup, isFormArray, isFormControl, isFormGroup } from './model';
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
        if (isFormControl(controlConfig) || isFormGroup(controlConfig) || isFormArray(controlConfig)) {
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
FormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.2+12.sha-af0a152.with-local-changes", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.2+12.sha-af0a152.with-local-changes", ngImport: i0, type: FormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.2+12.sha-af0a152.with-local-changes", ngImport: i0, type: FormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFBMEMsU0FBUyxFQUFFLFdBQVcsRUFBRSxTQUFTLEVBQWEsV0FBVyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUMsTUFBTSxTQUFTLENBQUM7O0FBRXZKLFNBQVMsd0JBQXdCLENBQUMsT0FDb0I7SUFDcEQsT0FBZ0MsT0FBUSxDQUFDLGVBQWUsS0FBSyxTQUFTO1FBQ3pDLE9BQVEsQ0FBQyxVQUFVLEtBQUssU0FBUztRQUNqQyxPQUFRLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQztBQUMvRCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7O0dBV0c7QUFFSCxNQUFNLE9BQU8sV0FBVztJQThDdEIsS0FBSyxDQUNELGNBQW9DLEVBQ3BDLFVBQTRELElBQUk7UUFDbEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV0RCxJQUFJLFVBQVUsR0FBbUMsSUFBSSxDQUFDO1FBQ3RELElBQUksZUFBZSxHQUE2QyxJQUFJLENBQUM7UUFDckUsSUFBSSxRQUFRLEdBQXdCLFNBQVMsQ0FBQztRQUU5QyxJQUFJLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDbkIsSUFBSSx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDckMseUNBQXlDO2dCQUN6QyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDcEUs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REMsbUJBQW1CO3NHQUMvQixXQUFXO2tCQUR2QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yRm59IGZyb20gJy4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7UmVhY3RpdmVGb3Jtc01vZHVsZX0gZnJvbSAnLi9mb3JtX3Byb3ZpZGVycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQWJzdHJhY3RDb250cm9sT3B0aW9ucywgRm9ybUFycmF5LCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBGb3JtSG9va3MsIGlzRm9ybUFycmF5LCBpc0Zvcm1Db250cm9sLCBpc0Zvcm1Hcm91cH0gZnJvbSAnLi9tb2RlbCc7XG5cbmZ1bmN0aW9uIGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtba2V5OiBzdHJpbmddOiBhbnl9KTogb3B0aW9ucyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuICg8QWJzdHJhY3RDb250cm9sT3B0aW9ucz5vcHRpb25zKS5hc3luY1ZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgKDxBYnN0cmFjdENvbnRyb2xPcHRpb25zPm9wdGlvbnMpLnZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgKDxBYnN0cmFjdENvbnRyb2xPcHRpb25zPm9wdGlvbnMpLnVwZGF0ZU9uICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGFuIGBBYnN0cmFjdENvbnRyb2xgIGZyb20gYSB1c2VyLXNwZWNpZmllZCBjb25maWd1cmF0aW9uLlxuICpcbiAqIFRoZSBgRm9ybUJ1aWxkZXJgIHByb3ZpZGVzIHN5bnRhY3RpYyBzdWdhciB0aGF0IHNob3J0ZW5zIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBhIGBGb3JtQ29udHJvbGAsXG4gKiBgRm9ybUdyb3VwYCwgb3IgYEZvcm1BcnJheWAuIEl0IHJlZHVjZXMgdGhlIGFtb3VudCBvZiBib2lsZXJwbGF0ZSBuZWVkZWQgdG8gYnVpbGQgY29tcGxleFxuICogZm9ybXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBSZWFjdGl2ZUZvcm1zTW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBGb3JtQnVpbGRlciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHNDb25maWcgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIG9iamVjdCBzaG91bGQgaGF2ZSB0aGVcbiAgICogdGhlIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCB0eXBlIGFuZCBtaWdodCBjb250YWluIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgKiAqIGB2YWxpZGF0b3JzYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogKiBgYXN5bmNWYWxpZGF0b3JzYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogKiBgdXBkYXRlT25gOiBUaGUgZXZlbnQgdXBvbiB3aGljaCB0aGUgY29udHJvbCBzaG91bGQgYmUgdXBkYXRlZCAob3B0aW9uczogJ2NoYW5nZScgfCAnYmx1cicgfFxuICAgKiBzdWJtaXQnKVxuICAgKi9cbiAgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogRm9ybUdyb3VwO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaXMgbm90IHR5cGVzYWZlIGFuZCBjYW4gcmVzdWx0IGluIGlzc3VlcyB3aXRoIENsb3N1cmUgQ29tcGlsZXIgcmVuYW1pbmcuXG4gICAqIFVzZSB0aGUgYEZvcm1CdWlsZGVyI2dyb3VwYCBvdmVybG9hZCB3aXRoIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBpbnN0ZWFkLlxuICAgKiBOb3RlIHRoYXQgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGV4cGVjdHMgYHZhbGlkYXRvcnNgIGFuZCBgYXN5bmNWYWxpZGF0b3JzYCB0byBiZSB2YWxpZFxuICAgKiB2YWxpZGF0b3JzLiBJZiB5b3UgaGF2ZSBjdXN0b20gdmFsaWRhdG9ycywgbWFrZSBzdXJlIHRoZWlyIHZhbGlkYXRpb24gZnVuY3Rpb24gcGFyYW1ldGVyIGlzXG4gICAqIGBBYnN0cmFjdENvbnRyb2xgIGFuZCBub3QgYSBzdWItY2xhc3MsIHN1Y2ggYXMgYEZvcm1Hcm91cGAuIFRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZCB3aXRoXG4gICAqIGFuIG9iamVjdCBvZiB0eXBlIGBBYnN0cmFjdENvbnRyb2xgIGFuZCB0aGF0IGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGRvd25jYXN0IHRvIGEgc3ViY2xhc3MsIHNvXG4gICAqIFR5cGVTY3JpcHQgc2VlcyB0aGlzIGFzIGFuIGVycm9yLiBGb3IgZXhhbXBsZSwgY2hhbmdlIHRoZSBgKGdyb3VwOiBGb3JtR3JvdXApID0+XG4gICAqIFZhbGlkYXRpb25FcnJvcnN8bnVsbGAgc2lnbmF0dXJlIHRvIGJlIGAoZ3JvdXA6IEFic3RyYWN0Q29udHJvbCkgPT4gVmFsaWRhdGlvbkVycm9yc3xudWxsYC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzQ29uZmlnIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1Hcm91cGAuIFRoZSBsZWdhY3kgY29uZmlndXJhdGlvblxuICAgKiBvYmplY3QgY29uc2lzdHMgb2Y6XG4gICAqICogYHZhbGlkYXRvcmA6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqICogYGFzeW5jVmFsaWRhdG9yYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogTm90ZTogdGhlIGxlZ2FjeSBmb3JtYXQgaXMgZGVwcmVjYXRlZCBhbmQgbWlnaHQgYmUgcmVtb3ZlZCBpbiBvbmUgb2YgdGhlIG5leHQgbWFqb3IgdmVyc2lvbnNcbiAgICogb2YgQW5ndWxhci5cbiAgICovXG4gIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICApOiBGb3JtR3JvdXA7XG4gIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsID0gbnVsbCk6IEZvcm1Hcm91cCB7XG4gICAgY29uc3QgY29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9sc0NvbmZpZyk7XG5cbiAgICBsZXQgdmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgdXBkYXRlT246IEZvcm1Ib29rc3x1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAob3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgXG4gICAgICAgIHZhbGlkYXRvcnMgPSBvcHRpb25zLnZhbGlkYXRvcnMgIT0gbnVsbCA/IG9wdGlvbnMudmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIGFzeW5jVmFsaWRhdG9ycyA9IG9wdGlvbnMuYXN5bmNWYWxpZGF0b3JzICE9IG51bGwgPyBvcHRpb25zLmFzeW5jVmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIHVwZGF0ZU9uID0gb3B0aW9ucy51cGRhdGVPbiAhPSBudWxsID8gb3B0aW9ucy51cGRhdGVPbiA6IHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgbGVnYWN5IGZvcm0gZ3JvdXAgb3B0aW9uc1xuICAgICAgICB2YWxpZGF0b3JzID0gb3B0aW9uc1sndmFsaWRhdG9yJ10gIT0gbnVsbCA/IG9wdGlvbnNbJ3ZhbGlkYXRvciddIDogbnVsbDtcbiAgICAgICAgYXN5bmNWYWxpZGF0b3JzID0gb3B0aW9uc1snYXN5bmNWYWxpZGF0b3InXSAhPSBudWxsID8gb3B0aW9uc1snYXN5bmNWYWxpZGF0b3InXSA6IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGb3JtR3JvdXAoY29udHJvbHMsIHthc3luY1ZhbGlkYXRvcnMsIHVwZGF0ZU9uLCB2YWxpZGF0b3JzfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUNvbnRyb2xgIHdpdGggdGhlIGdpdmVuIHN0YXRlLCB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCBzdGF0ZSB2YWx1ZSwgb3JcbiAgICogd2l0aCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgSW5pdGlhbGl6ZSBhIGNvbnRyb2wgYXMgZGlzYWJsZWRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJldHVybnMgYSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSBpbiBhIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJmb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50c1wiIHJlZ2lvbj1cImRpc2FibGVkLWNvbnRyb2xcIj5cbiAgICogPC9jb2RlLWV4YW1wbGU+XG4gICAqL1xuICBjb250cm9sKFxuICAgICAgZm9ybVN0YXRlOiBhbnksIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQXJyYXlgIGZyb20gdGhlIGdpdmVuIGFycmF5IG9mIGNvbmZpZ3VyYXRpb25zLFxuICAgKiB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHNDb25maWcgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMgb3IgY29udHJvbCBjb25maWdzLiBFYWNoXG4gICAqIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW4gaW5kZXggd2hlbiBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKi9cbiAgYXJyYXkoXG4gICAgICBjb250cm9sc0NvbmZpZzogYW55W10sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1BcnJheSB7XG4gICAgY29uc3QgY29udHJvbHMgPSBjb250cm9sc0NvbmZpZy5tYXAoYyA9PiB0aGlzLl9jcmVhdGVDb250cm9sKGMpKTtcbiAgICByZXR1cm4gbmV3IEZvcm1BcnJheShjb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDb250cm9scyhjb250cm9sc0NvbmZpZzoge1trOiBzdHJpbmddOiBhbnl9KToge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0ge1xuICAgIGNvbnN0IGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGNvbnRyb2xzQ29uZmlnKS5mb3JFYWNoKGNvbnRyb2xOYW1lID0+IHtcbiAgICAgIGNvbnRyb2xzW2NvbnRyb2xOYW1lXSA9IHRoaXMuX2NyZWF0ZUNvbnRyb2woY29udHJvbHNDb25maWdbY29udHJvbE5hbWVdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY29udHJvbHM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jcmVhdGVDb250cm9sKGNvbnRyb2xDb25maWc6IGFueSk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKGlzRm9ybUNvbnRyb2woY29udHJvbENvbmZpZykgfHwgaXNGb3JtR3JvdXAoY29udHJvbENvbmZpZykgfHwgaXNGb3JtQXJyYXkoY29udHJvbENvbmZpZykpIHtcbiAgICAgIHJldHVybiBjb250cm9sQ29uZmlnO1xuXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xDb25maWcpKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGNvbnRyb2xDb25maWdbMF07XG4gICAgICBjb25zdCB2YWxpZGF0b3I6IFZhbGlkYXRvckZuID0gY29udHJvbENvbmZpZy5sZW5ndGggPiAxID8gY29udHJvbENvbmZpZ1sxXSA6IG51bGw7XG4gICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbiA9IGNvbnRyb2xDb25maWcubGVuZ3RoID4gMiA/IGNvbnRyb2xDb25maWdbMl0gOiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbCh2YWx1ZSwgdmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcik7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbChjb250cm9sQ29uZmlnKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==