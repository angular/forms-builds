/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { ReactiveFormsModule } from './form_providers';
import { AbstractControl } from './model/abstract_model';
import { FormArray } from './model/form_array';
import { FormControl } from './model/form_control';
import { FormGroup } from './model/form_group';
import * as i0 from "@angular/core";
function isAbstractControlOptions(options) {
    return !!options &&
        (options.asyncValidators !== undefined ||
            options.validators !== undefined ||
            options.updateOn !== undefined);
}
function isFormControlOptions(options) {
    return !!options &&
        (isAbstractControlOptions(options) ||
            options.initialValueIsDefault !== undefined);
}
// clang-format on
/**
 * @description
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * The `FormBuilder` provides syntactic sugar that shortens creating instances of a
 * `FormControl`, `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to
 * build complex forms.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @publicApi
 */
export class FormBuilder {
    group(controls, options = null) {
        const reducedControls = this._reduceControls(controls);
        let validators = null;
        let asyncValidators = null;
        let updateOn = undefined;
        if (options !== null) {
            if (isAbstractControlOptions(options)) {
                // `options` are `AbstractControlOptions`
                validators = options.validators != null ? options.validators : null;
                asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
                updateOn = options.updateOn != null ? options.updateOn : undefined;
            }
            else {
                // `options` are legacy form group options
                validators = options['validator'] != null ? options['validator'] : null;
                asyncValidators =
                    options['asyncValidator'] != null ? options['asyncValidator'] : null;
            }
        }
        // Cast to `any` because the inferred types are not as specific as Element.
        return new FormGroup(reducedControls, { asyncValidators, updateOn, validators });
    }
    /**
     * @description
     * Construct a new `FormControl` with the given state, validators and options. Set
     * `{initialValueIsDefault: true}` in the options to get a non-nullable control. Otherwise, the
     * control will be nullable. Accepts a single generic argument, which is the type  of the
     * control's value.
     *
     * @param formState Initializes the control with an initial state value, or
     * with an object that contains both a value and a disabled status.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or a `FormControlOptions` object that contains
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
     * validators and options. Accepts a single generic argument, which is the type of each control
     * inside the array.
     *
     * @param controls An array of child controls or control configs. Each child control is given an
     *     index when it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
     *     `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions.
     */
    array(controls, validatorOrOpts, asyncValidator) {
        const createdControls = controls.map(c => this._createControl(c));
        // Cast to `any` because the inferred types are not as specific as Element.
        return new FormArray(createdControls, validatorOrOpts, asyncValidator);
    }
    /** @internal */
    _reduceControls(controls) {
        const createdControls = {};
        Object.keys(controls).forEach(controlName => {
            createdControls[controlName] = this._createControl(controls[controlName]);
        });
        return createdControls;
    }
    /** @internal */
    _createControl(controls) {
        if (controls instanceof FormControl) {
            return controls;
        }
        else if (controls instanceof AbstractControl) { // A control; just return it
            return controls;
        }
        else if (Array.isArray(controls)) { // ControlConfig Tuple
            const value = controls[0];
            const validator = controls.length > 1 ? controls[1] : null;
            const asyncValidator = controls.length > 2 ? controls[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else { // T or FormControlState<T>
            return this.control(controls);
        }
    }
}
FormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-next.15+sha-401dec4", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.0-next.15+sha-401dec4", ngImport: i0, type: FormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-next.15+sha-401dec4", ngImport: i0, type: FormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
/**
 * UntypedFormBuilder is the same as @see FormBuilder, but it provides untyped controls.
 */
export class UntypedFormBuilder extends FormBuilder {
    group(controlsConfig, options = null) {
        return super.group(controlsConfig, options);
    }
    /**
     * @see FormBuilder#control
     */
    control(formState, validatorOrOpts, asyncValidator) {
        return super.control(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * @see FormBuilder#array
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        return super.array(controlsConfig, validatorOrOpts, asyncValidator);
    }
}
UntypedFormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-next.15+sha-401dec4", ngImport: i0, type: UntypedFormBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
UntypedFormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.0-next.15+sha-401dec4", ngImport: i0, type: UntypedFormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-next.15+sha-401dec4", ngImport: i0, type: UntypedFormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxlQUFlLEVBQW9DLE1BQU0sd0JBQXdCLENBQUM7QUFDMUYsT0FBTyxFQUFDLFNBQVMsRUFBbUIsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsV0FBVyxFQUEyRCxNQUFNLHNCQUFzQixDQUFDO0FBQzNHLE9BQU8sRUFBQyxTQUFTLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7O0FBRS9ELFNBQVMsd0JBQXdCLENBQUMsT0FDUztJQUN6QyxPQUFPLENBQUMsQ0FBQyxPQUFPO1FBQ1osQ0FBRSxPQUFrQyxDQUFDLGVBQWUsS0FBSyxTQUFTO1lBQ2hFLE9BQWtDLENBQUMsVUFBVSxLQUFLLFNBQVM7WUFDM0QsT0FBa0MsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsT0FDUztJQUNyQyxPQUFPLENBQUMsQ0FBQyxPQUFPO1FBQ1osQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUM7WUFDaEMsT0FBOEIsQ0FBQyxxQkFBcUIsS0FBSyxTQUFTLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBK0JELGtCQUFrQjtBQUVsQjs7Ozs7Ozs7Ozs7R0FXRztBQUVILE1BQU0sT0FBTyxXQUFXO0lBaUR0QixLQUFLLENBQUMsUUFBOEIsRUFBRSxVQUNpRCxJQUFJO1FBRXpGLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFdkQsSUFBSSxVQUFV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QyxVQUFVLEVBQUUsbUJBQW1CLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtSZWFjdGl2ZUZvcm1zTW9kdWxlfSBmcm9tICcuL2Zvcm1fcHJvdmlkZXJzJztcbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBBYnN0cmFjdENvbnRyb2xPcHRpb25zLCBGb3JtSG9va3N9IGZyb20gJy4vbW9kZWwvYWJzdHJhY3RfbW9kZWwnO1xuaW1wb3J0IHtGb3JtQXJyYXksIFVudHlwZWRGb3JtQXJyYXl9IGZyb20gJy4vbW9kZWwvZm9ybV9hcnJheSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtQ29udHJvbE9wdGlvbnMsIEZvcm1Db250cm9sU3RhdGUsIFVudHlwZWRGb3JtQ29udHJvbH0gZnJvbSAnLi9tb2RlbC9mb3JtX2NvbnRyb2wnO1xuaW1wb3J0IHtGb3JtR3JvdXAsIFVudHlwZWRGb3JtR3JvdXB9IGZyb20gJy4vbW9kZWwvZm9ybV9ncm91cCc7XG5cbmZ1bmN0aW9uIGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogb3B0aW9ucyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuICEhb3B0aW9ucyAmJlxuICAgICAgKChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLmFzeW5jVmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudXBkYXRlT24gIT09IHVuZGVmaW5lZCk7XG59XG5cbmZ1bmN0aW9uIGlzRm9ybUNvbnRyb2xPcHRpb25zKG9wdGlvbnM6IEZvcm1Db250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogb3B0aW9ucyBpcyBGb3JtQ29udHJvbE9wdGlvbnMge1xuICByZXR1cm4gISFvcHRpb25zICYmXG4gICAgICAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgRm9ybUNvbnRyb2xPcHRpb25zKS5pbml0aWFsVmFsdWVJc0RlZmF1bHQgIT09IHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQ29udHJvbENvbmZpZzxUPiBpcyBhIHR1cGxlIGNvbnRhaW5pbmcgYSB2YWx1ZSBvZiB0eXBlIFQsIHBsdXMgb3B0aW9uYWwgdmFsaWRhdG9ycyBhbmQgYXN5bmNcbiAqIHZhbGlkYXRvcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBDb250cm9sQ29uZmlnPFQ+ID0gW1R8Rm9ybUNvbnRyb2xTdGF0ZTxUPiwgKFZhbGlkYXRvckZufChWYWxpZGF0b3JGbltdKSk/LCAoQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW10pP107XG5cbi8vIERpc2FibGUgY2xhbmctZm9ybWF0IHRvIHByb2R1Y2UgY2xlYXJlciBmb3JtYXR0aW5nIGZvciB0aGVzZSBtdWx0aWxpbmUgdHlwZXMuXG4vLyBjbGFuZy1mb3JtYXQgb2ZmXG5cbi8qKlxuICogRm9ybUJ1aWxkZXIgYWNjZXB0cyB2YWx1ZXMgaW4gdmFyaW91cyBjb250YWluZXIgc2hhcGVzLCBhcyB3ZWxsIGFzIHJhdyB2YWx1ZXMuXG4gKiBFbGVtZW50IHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIGNvcnJlc3BvbmRpbmcgbW9kZWwgY2xhc3MuXG4gKi9cbmV4cG9ydCB0eXBlIMm1RWxlbWVudDxUPiA9XG4gIFQgZXh0ZW5kcyBGb3JtQ29udHJvbDxpbmZlciBVPiA/IEZvcm1Db250cm9sPFU+IDpcbiAgVCBleHRlbmRzIEZvcm1Hcm91cDxpbmZlciBVPiA/IEZvcm1Hcm91cDxVPiA6XG4gIFQgZXh0ZW5kcyBGb3JtQXJyYXk8aW5mZXIgVT4gPyBGb3JtQXJyYXk8VT4gOlxuICBUIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sPGluZmVyIFU+ID8gQWJzdHJhY3RDb250cm9sPFU+IDpcbiAgVCBleHRlbmRzIEZvcm1Db250cm9sU3RhdGU8aW5mZXIgVT4gPyBGb3JtQ29udHJvbDxVfG51bGw+IDpcbiAgVCBleHRlbmRzIENvbnRyb2xDb25maWc8aW5mZXIgVT4gPyBGb3JtQ29udHJvbDxVfG51bGw+IDpcbiAgLy8gQ29udHJvbENvbmZpZyBjYW4gYmUgdG9vIG11Y2ggZm9yIHRoZSBjb21waWxlciB0byBpbmZlciBpbiB0aGUgd3JhcHBlZCBjYXNlLiBUaGlzIGlzXG4gIC8vIG5vdCBzdXJwcmlzaW5nLCBzaW5jZSBpdCdzIHByYWN0aWNhbGx5IGRlYXRoLWJ5LXBvbHltb3JwaGlzbSAoZS5nLiB0aGUgb3B0aW9uYWwgdmFsaWRhdG9yc1xuICAvLyBtZW1iZXJzIHRoYXQgbWlnaHQgYmUgYXJyYXlzKS4gV2F0Y2ggZm9yIENvbnRyb2xDb25maWdzIHRoYXQgbWlnaHQgZmFsbCB0aHJvdWdoLlxuICBUIGV4dGVuZHMgQXJyYXk8aW5mZXIgVXxWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdPiA/IEZvcm1Db250cm9sPFV8bnVsbD4gOlxuICAvLyBGYWxsdGhvdWdoIGNhc2U6IFQgaXMgbm90IGEgY29udGFpbmVyIHR5cGU7IHVzZSBpcyBkaXJlY3RseSBhcyBhIHZhbHVlLlxuICBGb3JtQ29udHJvbDxUfG51bGw+O1xuXG4vLyBjbGFuZy1mb3JtYXQgb25cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW4gYEFic3RyYWN0Q29udHJvbGAgZnJvbSBhIHVzZXItc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIGBGb3JtQnVpbGRlcmAgcHJvdmlkZXMgc3ludGFjdGljIHN1Z2FyIHRoYXQgc2hvcnRlbnMgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIGFcbiAqIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBvciBgRm9ybUFycmF5YC4gSXQgcmVkdWNlcyB0aGUgYW1vdW50IG9mIGJvaWxlcnBsYXRlIG5lZWRlZCB0b1xuICogYnVpbGQgY29tcGxleCBmb3Jtcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogUmVhY3RpdmVGb3Jtc01vZHVsZX0pXG5leHBvcnQgY2xhc3MgRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdCBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyBhbGwgdGhlIGtleXMgYW5kIGNvcnJlc3BvbmRpbmcgaW5uZXIgY29udHJvbCB0eXBlcy5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1Hcm91cGAuIFRoZSBvYmplY3Qgc2hvdWxkIGhhdmUgdGhlXG4gICAqIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCB0eXBlIGFuZCBtaWdodCBjb250YWluIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgKiAqIGB2YWxpZGF0b3JzYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYGFzeW5jVmFsaWRhdG9yc2A6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKiAqIGB1cGRhdGVPbmA6IFRoZSBldmVudCB1cG9uIHdoaWNoIHRoZSBjb250cm9sIHNob3VsZCBiZSB1cGRhdGVkIChvcHRpb25zOiAnY2hhbmdlJyB8ICdibHVyJ1xuICAgKiB8IHN1Ym1pdCcpLlxuICAgKi9cbiAgZ3JvdXA8VCBleHRlbmRzIHt9PihcbiAgICAgIGNvbnRyb2xzOiBULFxuICAgICAgb3B0aW9ucz86IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgICk6IEZvcm1Hcm91cDx7W0sgaW4ga2V5b2YgVF06IMm1RWxlbWVudDxUW0tdPn0+O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBpcyBub3QgdHlwZXNhZmUgYW5kIGNhbiByZXN1bHQgaW4gaXNzdWVzIHdpdGggQ2xvc3VyZSBDb21waWxlciByZW5hbWluZy5cbiAgICogVXNlIHRoZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgIG92ZXJsb2FkIHdpdGggYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGluc3RlYWQuXG4gICAqIE5vdGUgdGhhdCBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgZXhwZWN0cyBgdmFsaWRhdG9yc2AgYW5kIGBhc3luY1ZhbGlkYXRvcnNgIHRvIGJlIHZhbGlkXG4gICAqIHZhbGlkYXRvcnMuIElmIHlvdSBoYXZlIGN1c3RvbSB2YWxpZGF0b3JzLCBtYWtlIHN1cmUgdGhlaXIgdmFsaWRhdGlvbiBmdW5jdGlvbiBwYXJhbWV0ZXIgaXNcbiAgICogYEFic3RyYWN0Q29udHJvbGAgYW5kIG5vdCBhIHN1Yi1jbGFzcywgc3VjaCBhcyBgRm9ybUdyb3VwYC4gVGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkXG4gICAqIHdpdGggYW4gb2JqZWN0IG9mIHR5cGUgYEFic3RyYWN0Q29udHJvbGAgYW5kIHRoYXQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgZG93bmNhc3QgdG8gYVxuICAgKiBzdWJjbGFzcywgc28gVHlwZVNjcmlwdCBzZWVzIHRoaXMgYXMgYW4gZXJyb3IuIEZvciBleGFtcGxlLCBjaGFuZ2UgdGhlIGAoZ3JvdXA6IEZvcm1Hcm91cCkgPT5cbiAgICogVmFsaWRhdGlvbkVycm9yc3xudWxsYCBzaWduYXR1cmUgdG8gYmUgYChncm91cDogQWJzdHJhY3RDb250cm9sKSA9PiBWYWxpZGF0aW9uRXJyb3JzfG51bGxgLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSByZWNvcmQgb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggdGhlIGNvbnRyb2wgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIG9iamVjdCBmb3IgdGhlIGBGb3JtR3JvdXBgLiBUaGUgbGVnYWN5IGNvbmZpZ3VyYXRpb25cbiAgICogb2JqZWN0IGNvbnNpc3RzIG9mOlxuICAgKiAqIGB2YWxpZGF0b3JgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgYXN5bmNWYWxpZGF0b3JgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiBOb3RlOiB0aGUgbGVnYWN5IGZvcm1hdCBpcyBkZXByZWNhdGVkIGFuZCBtaWdodCBiZSByZW1vdmVkIGluIG9uZSBvZiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uc1xuICAgKiBvZiBBbmd1bGFyLlxuICAgKi9cbiAgZ3JvdXAoXG4gICAgICBjb250cm9sczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgICk6IEZvcm1Hcm91cDtcblxuICBncm91cChjb250cm9sczoge1trZXk6IHN0cmluZ106IGFueX0sIG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8e1trZXk6IHN0cmluZ106XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFueX18bnVsbCA9IG51bGwpOlxuICAgICAgRm9ybUdyb3VwIHtcbiAgICBjb25zdCByZWR1Y2VkQ29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9scyk7XG5cbiAgICBsZXQgdmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsID0gbnVsbDtcbiAgICBsZXQgdXBkYXRlT246IEZvcm1Ib29rc3x1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAob3B0aW9ucyAhPT0gbnVsbCkge1xuICAgICAgaWYgKGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zKSkge1xuICAgICAgICAvLyBgb3B0aW9uc2AgYXJlIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYFxuICAgICAgICB2YWxpZGF0b3JzID0gb3B0aW9ucy52YWxpZGF0b3JzICE9IG51bGwgPyBvcHRpb25zLnZhbGlkYXRvcnMgOiBudWxsO1xuICAgICAgICBhc3luY1ZhbGlkYXRvcnMgPSBvcHRpb25zLmFzeW5jVmFsaWRhdG9ycyAhPSBudWxsID8gb3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgOiBudWxsO1xuICAgICAgICB1cGRhdGVPbiA9IG9wdGlvbnMudXBkYXRlT24gIT0gbnVsbCA/IG9wdGlvbnMudXBkYXRlT24gOiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBgb3B0aW9uc2AgYXJlIGxlZ2FjeSBmb3JtIGdyb3VwIG9wdGlvbnNcbiAgICAgICAgdmFsaWRhdG9ycyA9IChvcHRpb25zIGFzIGFueSlbJ3ZhbGlkYXRvciddICE9IG51bGwgPyAob3B0aW9ucyBhcyBhbnkpWyd2YWxpZGF0b3InXSA6IG51bGw7XG4gICAgICAgIGFzeW5jVmFsaWRhdG9ycyA9XG4gICAgICAgICAgICAob3B0aW9ucyBhcyBhbnkpWydhc3luY1ZhbGlkYXRvciddICE9IG51bGwgPyAob3B0aW9ucyBhcyBhbnkpWydhc3luY1ZhbGlkYXRvciddIDogbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDYXN0IHRvIGBhbnlgIGJlY2F1c2UgdGhlIGluZmVycmVkIHR5cGVzIGFyZSBub3QgYXMgc3BlY2lmaWMgYXMgRWxlbWVudC5cbiAgICByZXR1cm4gbmV3IEZvcm1Hcm91cChyZWR1Y2VkQ29udHJvbHMsIHthc3luY1ZhbGlkYXRvcnMsIHVwZGF0ZU9uLCB2YWxpZGF0b3JzfSkgYXMgYW55O1xuICB9XG5cbiAgY29udHJvbDxUPihmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPiwgb3B0czogRm9ybUNvbnRyb2xPcHRpb25zJntcbiAgICBpbml0aWFsVmFsdWVJc0RlZmF1bHQ6IHRydWVcbiAgfSk6IEZvcm1Db250cm9sPFQ+O1xuXG4gIGNvbnRyb2w8VD4oXG4gICAgICBmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118Rm9ybUNvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQ29udHJvbDxUfG51bGw+O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtQ29udHJvbGAgd2l0aCB0aGUgZ2l2ZW4gc3RhdGUsIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuIFNldFxuICAgKiBge2luaXRpYWxWYWx1ZUlzRGVmYXVsdDogdHJ1ZX1gIGluIHRoZSBvcHRpb25zIHRvIGdldCBhIG5vbi1udWxsYWJsZSBjb250cm9sLiBPdGhlcndpc2UsIHRoZVxuICAgKiBjb250cm9sIHdpbGwgYmUgbnVsbGFibGUuIEFjY2VwdHMgYSBzaW5nbGUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggaXMgdGhlIHR5cGUgIG9mIHRoZVxuICAgKiBjb250cm9sJ3MgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgSW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHN0YXRlIHZhbHVlLCBvclxuICAgKiB3aXRoIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhIGBGb3JtQ29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgSW5pdGlhbGl6ZSBhIGNvbnRyb2wgYXMgZGlzYWJsZWRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJldHVybnMgYSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSBpbiBhIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJmb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50c1wiIHJlZ2lvbj1cImRpc2FibGVkLWNvbnRyb2xcIj5cbiAgICogPC9jb2RlLWV4YW1wbGU+XG4gICAqL1xuICBjb250cm9sPFQ+KFxuICAgICAgZm9ybVN0YXRlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEZvcm1Db250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQXJyYXlgIGZyb20gdGhlIGdpdmVuIGFycmF5IG9mIGNvbmZpZ3VyYXRpb25zLFxuICAgKiB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIHRoZSB0eXBlIG9mIGVhY2ggY29udHJvbFxuICAgKiBpbnNpZGUgdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMgb3IgY29udHJvbCBjb25maWdzLiBFYWNoIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW5cbiAgICogICAgIGluZGV4IHdoZW4gaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2Ygc3VjaCBmdW5jdGlvbnMsIG9yIGFuXG4gICAqICAgICBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqL1xuICBhcnJheTxUPihcbiAgICAgIGNvbnRyb2xzOiBBcnJheTxUPiwgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQXJyYXk8ybVFbGVtZW50PFQ+PiB7XG4gICAgY29uc3QgY3JlYXRlZENvbnRyb2xzID0gY29udHJvbHMubWFwKGMgPT4gdGhpcy5fY3JlYXRlQ29udHJvbChjKSk7XG4gICAgLy8gQ2FzdCB0byBgYW55YCBiZWNhdXNlIHRoZSBpbmZlcnJlZCB0eXBlcyBhcmUgbm90IGFzIHNwZWNpZmljIGFzIEVsZW1lbnQuXG4gICAgcmV0dXJuIG5ldyBGb3JtQXJyYXkoY3JlYXRlZENvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKSBhcyBhbnk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDb250cm9sczxUPihjb250cm9sczpcbiAgICAgICAgICAgICAgICAgICAgICAgICB7W2s6IHN0cmluZ106IFR8Q29udHJvbENvbmZpZzxUPnxGb3JtQ29udHJvbFN0YXRlPFQ+fEFic3RyYWN0Q29udHJvbDxUPn0pOlxuICAgICAge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0ge1xuICAgIGNvbnN0IGNyZWF0ZWRDb250cm9sczoge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0gPSB7fTtcbiAgICBPYmplY3Qua2V5cyhjb250cm9scykuZm9yRWFjaChjb250cm9sTmFtZSA9PiB7XG4gICAgICBjcmVhdGVkQ29udHJvbHNbY29udHJvbE5hbWVdID0gdGhpcy5fY3JlYXRlQ29udHJvbChjb250cm9sc1tjb250cm9sTmFtZV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjcmVhdGVkQ29udHJvbHM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jcmVhdGVDb250cm9sPFQ+KGNvbnRyb2xzOiBUfEZvcm1Db250cm9sU3RhdGU8VD58Q29udHJvbENvbmZpZzxUPnxGb3JtQ29udHJvbDxUPnxcbiAgICAgICAgICAgICAgICAgICAgQWJzdHJhY3RDb250cm9sPFQ+KTogRm9ybUNvbnRyb2w8VD58Rm9ybUNvbnRyb2w8VHxudWxsPnxBYnN0cmFjdENvbnRyb2w8VD4ge1xuICAgIGlmIChjb250cm9scyBpbnN0YW5jZW9mIEZvcm1Db250cm9sKSB7XG4gICAgICByZXR1cm4gY29udHJvbHMgYXMgRm9ybUNvbnRyb2w8VD47XG4gICAgfSBlbHNlIGlmIChjb250cm9scyBpbnN0YW5jZW9mIEFic3RyYWN0Q29udHJvbCkgeyAgLy8gQSBjb250cm9sOyBqdXN0IHJldHVybiBpdFxuICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjb250cm9scykpIHsgIC8vIENvbnRyb2xDb25maWcgVHVwbGVcbiAgICAgIGNvbnN0IHZhbHVlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4gPSBjb250cm9sc1swXTtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcjogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsID0gY29udHJvbHMubGVuZ3RoID4gMSA/IGNvbnRyb2xzWzFdISA6IG51bGw7XG4gICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCA9XG4gICAgICAgICAgY29udHJvbHMubGVuZ3RoID4gMiA/IGNvbnRyb2xzWzJdISA6IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sPFQ+KHZhbHVlLCB2YWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yKTtcbiAgICB9IGVsc2UgeyAgLy8gVCBvciBGb3JtQ29udHJvbFN0YXRlPFQ+XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sPFQ+KGNvbnRyb2xzKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBVbnR5cGVkRm9ybUJ1aWxkZXIgaXMgdGhlIHNhbWUgYXMgQHNlZSBGb3JtQnVpbGRlciwgYnV0IGl0IHByb3ZpZGVzIHVudHlwZWQgY29udHJvbHMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBSZWFjdGl2ZUZvcm1zTW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBVbnR5cGVkRm9ybUJ1aWxkZXIgZXh0ZW5kcyBGb3JtQnVpbGRlciB7XG4gIC8qKlxuICAgKiBAc2VlIEZvcm1CdWlsZGVyI2dyb3VwXG4gICAqL1xuICBvdmVycmlkZSBncm91cChcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM/OiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICApOiBVbnR5cGVkRm9ybUdyb3VwO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBpcyBub3QgdHlwZXNhZmUgYW5kIGNhbiByZXN1bHQgaW4gaXNzdWVzIHdpdGggQ2xvc3VyZSBDb21waWxlciByZW5hbWluZy5cbiAgICogVXNlIHRoZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgIG92ZXJsb2FkIHdpdGggYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGluc3RlYWQuXG4gICAqL1xuICBvdmVycmlkZSBncm91cChcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgKTogVW50eXBlZEZvcm1Hcm91cDtcblxuICBvdmVycmlkZSBncm91cChcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8e1trZXk6IHN0cmluZ106IGFueX18bnVsbCA9IG51bGwpOiBVbnR5cGVkRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gc3VwZXIuZ3JvdXAoY29udHJvbHNDb25maWcsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgRm9ybUJ1aWxkZXIjY29udHJvbFxuICAgKi9cbiAgb3ZlcnJpZGUgY29udHJvbChcbiAgICAgIGZvcm1TdGF0ZTogYW55LCB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEZvcm1Db250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogVW50eXBlZEZvcm1Db250cm9sIHtcbiAgICByZXR1cm4gc3VwZXIuY29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBzZWUgRm9ybUJ1aWxkZXIjYXJyYXlcbiAgICovXG4gIG92ZXJyaWRlIGFycmF5KFxuICAgICAgY29udHJvbHNDb25maWc6IGFueVtdLFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBVbnR5cGVkRm9ybUFycmF5IHtcbiAgICByZXR1cm4gc3VwZXIuYXJyYXkoY29udHJvbHNDb25maWcsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG59XG4iXX0=