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
FormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.10+3.sha-8c9051e", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.10+3.sha-8c9051e", ngImport: i0, type: FormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.10+3.sha-8c9051e", ngImport: i0, type: FormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFBMEMsU0FBUyxFQUFFLFdBQVcsRUFBc0IsU0FBUyxFQUFhLFdBQVcsRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFDLE1BQU0sU0FBUyxDQUFDOztBQUUzSyxTQUFTLHdCQUF3QixDQUFDLE9BQ29CO0lBQ3BELE9BQWdDLE9BQVEsQ0FBQyxlQUFlLEtBQUssU0FBUztRQUN6QyxPQUFRLENBQUMsVUFBVSxLQUFLLFNBQVM7UUFDakMsT0FBUSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUM7QUFDL0QsQ0FBQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBRUgsTUFBTSxPQUFPLFdBQVc7SUE4Q3RCLEtBQUssQ0FDRCxjQUFvQyxFQUNwQyxVQUE0RCxJQUFJO1FBQ2xFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFdEQsSUFBSSxVQUFVLEdBQW1DLElBQUksQ0FBQztRQUN0RCxJQUFJLGVBQWUsR0FBNkMsSUFBSSxDQUFDO1FBQ3JFLElBQUksUUFBUSxHQUF3QixTQUFTLENBQUM7UUFFOUMsSUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO1lBQ25CLElBQUksd0JBQXdCLENBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ3JDLHlDQUF5QztnQkFDekMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ3BF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QURDLG1CQUFtQjtzR0FDL0IsV0FBVztrQkFEdkIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxtQkFBbUIsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge1JlYWN0aXZlRm9ybXNNb2R1bGV9IGZyb20gJy4vZm9ybV9wcm92aWRlcnMnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIEFic3RyYWN0Q29udHJvbE9wdGlvbnMsIEZvcm1BcnJheSwgRm9ybUNvbnRyb2wsIEZvcm1Db250cm9sT3B0aW9ucywgRm9ybUdyb3VwLCBGb3JtSG9va3MsIGlzRm9ybUFycmF5LCBpc0Zvcm1Db250cm9sLCBpc0Zvcm1Hcm91cH0gZnJvbSAnLi9tb2RlbCc7XG5cbmZ1bmN0aW9uIGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtba2V5OiBzdHJpbmddOiBhbnl9KTogb3B0aW9ucyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuICg8QWJzdHJhY3RDb250cm9sT3B0aW9ucz5vcHRpb25zKS5hc3luY1ZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgKDxBYnN0cmFjdENvbnRyb2xPcHRpb25zPm9wdGlvbnMpLnZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgKDxBYnN0cmFjdENvbnRyb2xPcHRpb25zPm9wdGlvbnMpLnVwZGF0ZU9uICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGFuIGBBYnN0cmFjdENvbnRyb2xgIGZyb20gYSB1c2VyLXNwZWNpZmllZCBjb25maWd1cmF0aW9uLlxuICpcbiAqIFRoZSBgRm9ybUJ1aWxkZXJgIHByb3ZpZGVzIHN5bnRhY3RpYyBzdWdhciB0aGF0IHNob3J0ZW5zIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBhIGBGb3JtQ29udHJvbGAsXG4gKiBgRm9ybUdyb3VwYCwgb3IgYEZvcm1BcnJheWAuIEl0IHJlZHVjZXMgdGhlIGFtb3VudCBvZiBib2lsZXJwbGF0ZSBuZWVkZWQgdG8gYnVpbGQgY29tcGxleFxuICogZm9ybXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBSZWFjdGl2ZUZvcm1zTW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBGb3JtQnVpbGRlciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHNDb25maWcgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIG9iamVjdCBzaG91bGQgaGF2ZSB0aGVcbiAgICogdGhlIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCB0eXBlIGFuZCBtaWdodCBjb250YWluIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgKiAqIGB2YWxpZGF0b3JzYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogKiBgYXN5bmNWYWxpZGF0b3JzYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogKiBgdXBkYXRlT25gOiBUaGUgZXZlbnQgdXBvbiB3aGljaCB0aGUgY29udHJvbCBzaG91bGQgYmUgdXBkYXRlZCAob3B0aW9uczogJ2NoYW5nZScgfCAnYmx1cicgfFxuICAgKiBzdWJtaXQnKVxuICAgKi9cbiAgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogRm9ybUdyb3VwO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaXMgbm90IHR5cGVzYWZlIGFuZCBjYW4gcmVzdWx0IGluIGlzc3VlcyB3aXRoIENsb3N1cmUgQ29tcGlsZXIgcmVuYW1pbmcuXG4gICAqIFVzZSB0aGUgYEZvcm1CdWlsZGVyI2dyb3VwYCBvdmVybG9hZCB3aXRoIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBpbnN0ZWFkLlxuICAgKiBOb3RlIHRoYXQgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGV4cGVjdHMgYHZhbGlkYXRvcnNgIGFuZCBgYXN5bmNWYWxpZGF0b3JzYCB0byBiZSB2YWxpZFxuICAgKiB2YWxpZGF0b3JzLiBJZiB5b3UgaGF2ZSBjdXN0b20gdmFsaWRhdG9ycywgbWFrZSBzdXJlIHRoZWlyIHZhbGlkYXRpb24gZnVuY3Rpb24gcGFyYW1ldGVyIGlzXG4gICAqIGBBYnN0cmFjdENvbnRyb2xgIGFuZCBub3QgYSBzdWItY2xhc3MsIHN1Y2ggYXMgYEZvcm1Hcm91cGAuIFRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZCB3aXRoXG4gICAqIGFuIG9iamVjdCBvZiB0eXBlIGBBYnN0cmFjdENvbnRyb2xgIGFuZCB0aGF0IGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGRvd25jYXN0IHRvIGEgc3ViY2xhc3MsIHNvXG4gICAqIFR5cGVTY3JpcHQgc2VlcyB0aGlzIGFzIGFuIGVycm9yLiBGb3IgZXhhbXBsZSwgY2hhbmdlIHRoZSBgKGdyb3VwOiBGb3JtR3JvdXApID0+XG4gICAqIFZhbGlkYXRpb25FcnJvcnN8bnVsbGAgc2lnbmF0dXJlIHRvIGJlIGAoZ3JvdXA6IEFic3RyYWN0Q29udHJvbCkgPT4gVmFsaWRhdGlvbkVycm9yc3xudWxsYC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzQ29uZmlnIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1Hcm91cGAuIFRoZSBsZWdhY3kgY29uZmlndXJhdGlvblxuICAgKiBvYmplY3QgY29uc2lzdHMgb2Y6XG4gICAqICogYHZhbGlkYXRvcmA6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqICogYGFzeW5jVmFsaWRhdG9yYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogTm90ZTogdGhlIGxlZ2FjeSBmb3JtYXQgaXMgZGVwcmVjYXRlZCBhbmQgbWlnaHQgYmUgcmVtb3ZlZCBpbiBvbmUgb2YgdGhlIG5leHQgbWFqb3IgdmVyc2lvbnNcbiAgICogb2YgQW5ndWxhci5cbiAgICovXG4gIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICApOiBGb3JtR3JvdXA7XG4gIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsID0gbnVsbCk6IEZvcm1Hcm91cCB7XG4gICAgY29uc3QgY29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9sc0NvbmZpZyk7XG5cbiAgICBsZXQgdmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgdXBkYXRlT246IEZvcm1Ib29rc3x1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAob3B0aW9ucyAhPSBudWxsKSB7XG4gICAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgXG4gICAgICAgIHZhbGlkYXRvcnMgPSBvcHRpb25zLnZhbGlkYXRvcnMgIT0gbnVsbCA/IG9wdGlvbnMudmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIGFzeW5jVmFsaWRhdG9ycyA9IG9wdGlvbnMuYXN5bmNWYWxpZGF0b3JzICE9IG51bGwgPyBvcHRpb25zLmFzeW5jVmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIHVwZGF0ZU9uID0gb3B0aW9ucy51cGRhdGVPbiAhPSBudWxsID8gb3B0aW9ucy51cGRhdGVPbiA6IHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgbGVnYWN5IGZvcm0gZ3JvdXAgb3B0aW9uc1xuICAgICAgICB2YWxpZGF0b3JzID0gb3B0aW9uc1sndmFsaWRhdG9yJ10gIT0gbnVsbCA/IG9wdGlvbnNbJ3ZhbGlkYXRvciddIDogbnVsbDtcbiAgICAgICAgYXN5bmNWYWxpZGF0b3JzID0gb3B0aW9uc1snYXN5bmNWYWxpZGF0b3InXSAhPSBudWxsID8gb3B0aW9uc1snYXN5bmNWYWxpZGF0b3InXSA6IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBGb3JtR3JvdXAoY29udHJvbHMsIHthc3luY1ZhbGlkYXRvcnMsIHVwZGF0ZU9uLCB2YWxpZGF0b3JzfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUNvbnRyb2xgIHdpdGggdGhlIGdpdmVuIHN0YXRlLCB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCBzdGF0ZSB2YWx1ZSwgb3JcbiAgICogd2l0aCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgSW5pdGlhbGl6ZSBhIGNvbnRyb2wgYXMgZGlzYWJsZWRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJldHVybnMgYSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSBpbiBhIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJmb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50c1wiIHJlZ2lvbj1cImRpc2FibGVkLWNvbnRyb2xcIj5cbiAgICogPC9jb2RlLWV4YW1wbGU+XG4gICAqL1xuICBjb250cm9sKFxuICAgICAgZm9ybVN0YXRlOiBhbnksIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118Rm9ybUNvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1BcnJheWAgZnJvbSB0aGUgZ2l2ZW4gYXJyYXkgb2YgY29uZmlndXJhdGlvbnMsXG4gICAqIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sc0NvbmZpZyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scyBvciBjb250cm9sIGNvbmZpZ3MuIEVhY2hcbiAgICogY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhbiBpbmRleCB3aGVuIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqL1xuICBhcnJheShcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiBhbnlbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUFycmF5IHtcbiAgICBjb25zdCBjb250cm9scyA9IGNvbnRyb2xzQ29uZmlnLm1hcChjID0+IHRoaXMuX2NyZWF0ZUNvbnRyb2woYykpO1xuICAgIHJldHVybiBuZXcgRm9ybUFycmF5KGNvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzQ29uZmlnOiB7W2s6IHN0cmluZ106IGFueX0pOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7XG4gICAgY29uc3QgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9ID0ge307XG4gICAgT2JqZWN0LmtleXMoY29udHJvbHNDb25maWcpLmZvckVhY2goY29udHJvbE5hbWUgPT4ge1xuICAgICAgY29udHJvbHNbY29udHJvbE5hbWVdID0gdGhpcy5fY3JlYXRlQ29udHJvbChjb250cm9sc0NvbmZpZ1tjb250cm9sTmFtZV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjb250cm9scztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZUNvbnRyb2woY29udHJvbENvbmZpZzogYW55KTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAoaXNGb3JtQ29udHJvbChjb250cm9sQ29uZmlnKSB8fCBpc0Zvcm1Hcm91cChjb250cm9sQ29uZmlnKSB8fCBpc0Zvcm1BcnJheShjb250cm9sQ29uZmlnKSkge1xuICAgICAgcmV0dXJuIGNvbnRyb2xDb25maWc7XG5cbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbENvbmZpZykpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udHJvbENvbmZpZ1swXTtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcjogVmFsaWRhdG9yRm4gPSBjb250cm9sQ29uZmlnLmxlbmd0aCA+IDEgPyBjb250cm9sQ29uZmlnWzFdIDogbnVsbDtcbiAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZuID0gY29udHJvbENvbmZpZy5sZW5ndGggPiAyID8gY29udHJvbENvbmZpZ1syXSA6IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sKHZhbHVlLCB2YWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sKGNvbnRyb2xDb25maWcpO1xuICAgIH1cbiAgfVxufVxuIl19