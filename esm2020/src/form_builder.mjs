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
    constructor() {
        this.useNonNullable = false;
    }
    /**
     * @description
     * Returns a FormBuilder in which automatically constructed @see FormControl} elements
     * have `{initialValueIsDefault: true}` and are non-nullable.
     *
     * **Constructing non-nullable controls**
     *
     * When constructing a control, it will be non-nullable, and will reset to its initial value.
     *
     * ```ts
     * let nnfb = new FormBuilder().nonNullable;
     * let name = nnfb.control('Alex'); // FormControl<string>
     * name.reset();
     * console.log(name); // 'Alex'
     * ```
     *
     * **Constructing non-nullable groups or arrays**
     *
     * When constructing a group or array, all automatically created inner controls will be
     * non-nullable, and will reset to their initial values.
     *
     * ```ts
     * let nnfb = new FormBuilder().nonNullable;
     * let name = nnfb.group({who: 'Alex'}); // FormGroup<{who: FormControl<string>}>
     * name.reset();
     * console.log(name); // {who: 'Alex'}
     * ```
     * **Constructing *nullable* fields on groups or arrays**
     *
     * It is still possible to have a nullable field. In particular, any `FormControl` which is
     * *already* constructed will not be altered. For example:
     *
     * ```ts
     * let nnfb = new FormBuilder().nonNullable;
     * // FormGroup<{who: FormControl<string|null>}>
     * let name = nnfb.group({who: new FormControl('Alex')});
     * name.reset(); console.log(name); // {who: null}
     * ```
     *
     * Because the inner control is constructed explicitly by the caller, the builder has
     * no control over how it is created, and cannot exclude the `null`.
     */
    get nonNullable() {
        const nnfb = new FormBuilder();
        nnfb.useNonNullable = true;
        return nnfb;
    }
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
        let newOptions = {};
        if (!this.useNonNullable) {
            return new FormControl(formState, validatorOrOpts, asyncValidator);
        }
        if (isAbstractControlOptions(validatorOrOpts)) {
            // If the second argument is options, then they are copied.
            newOptions = validatorOrOpts;
        }
        else {
            // If the other arguments are validators, they are copied into an options object.
            newOptions.validators = validatorOrOpts;
            newOptions.asyncValidators = asyncValidator;
        }
        return new FormControl(formState, { ...newOptions, initialValueIsDefault: true });
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
FormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.0-next.0+sha-3f3812e", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.1.0-next.0+sha-3f3812e", ngImport: i0, type: FormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.0-next.0+sha-3f3812e", ngImport: i0, type: FormBuilder, decorators: [{
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
     * Like {@see FormBuilder#control}, except the resulting control is untyped.
     */
    control(formState, validatorOrOpts, asyncValidator) {
        return super.control(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Like {@see FormBuilder#array}, except the resulting array is untyped.
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        return super.array(controlsConfig, validatorOrOpts, asyncValidator);
    }
}
UntypedFormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.0-next.0+sha-3f3812e", ngImport: i0, type: UntypedFormBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
UntypedFormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.1.0-next.0+sha-3f3812e", ngImport: i0, type: UntypedFormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.0-next.0+sha-3f3812e", ngImport: i0, type: UntypedFormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3pDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxlQUFlLEVBQW9DLE1BQU0sd0JBQXdCLENBQUM7QUFDMUYsT0FBTyxFQUFDLFNBQVMsRUFBbUIsTUFBTSxvQkFBb0IsQ0FBQztBQUMvRCxPQUFPLEVBQUMsV0FBVyxFQUEyRCxNQUFNLHNCQUFzQixDQUFDO0FBQzNHLE9BQU8sRUFBQyxTQUFTLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7O0FBRS9ELFNBQVMsd0JBQXdCLENBQUMsT0FDUztJQUN6QyxPQUFPLENBQUMsQ0FBQyxPQUFPO1FBQ1osQ0FBRSxPQUFrQyxDQUFDLGVBQWUsS0FBSyxTQUFTO1lBQ2hFLE9BQWtDLENBQUMsVUFBVSxLQUFLLFNBQVM7WUFDM0QsT0FBa0MsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVELFNBQVMsb0JBQW9CLENBQUMsT0FDUztJQUNyQyxPQUFPLENBQUMsQ0FBQyxPQUFPO1FBQ1osQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUM7WUFDaEMsT0FBOEIsQ0FBQyxxQkFBcUIsS0FBSyxTQUFTLENBQUMsQ0FBQztBQUM1RSxDQUFDO0FBaUNELGtCQUFrQjtBQUVsQjs7Ozs7Ozs7Ozs7R0FXRztBQUVILE1BQU0sT0FBTyxXQUFXO0lBRHhCO1FBRVUsbUJBQWMsR0FBWSxLQUFLLENBQUM7S0FxT3pDO0lBbk9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlDRztJQUNILElBQUksV0FBVztRQUNi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QjtzR0FDL0IsV0FBVztrQkFEdkIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxtQkFBbUIsRUFBQzs7QUE4UTdDOztHQUVHO0FBRUgsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFdBQVc7SUFrQnhDLEtBQUssQ0FDVixjQUFvQyxFQUNwQyxVQUE0RCxJQUFJO1FBQ2xFLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVEOztPQUVHO0lBQ00sT0FBTyxDQUNaLFNBQWMsRUFBRSxlQUFtRSxFQUNuRixjQUF5RDtRQUMzRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQ7O09BRUc7SUFDTSxLQUFLLENBQ1YsY0FBcUIsRUFDckIsZUFBdUUsRUFDdkUsY0FBeUQ7UUFDM0QsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDdEUsQ0FBQzs7MEhBekNVLGtCQUFrQjs4SEFBbEIsa0JBQWtCLGNBRE4sbUJBQW1CO3NHQUMvQixrQkFBa0I7a0JBRDlCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsbUJBQW1CLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtSZWFjdGl2ZUZvcm1zTW9kdWxlfSBmcm9tICcuL2Zvcm1fcHJvdmlkZXJzJztcbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBBYnN0cmFjdENvbnRyb2xPcHRpb25zLCBGb3JtSG9va3N9IGZyb20gJy4vbW9kZWwvYWJzdHJhY3RfbW9kZWwnO1xuaW1wb3J0IHtGb3JtQXJyYXksIFVudHlwZWRGb3JtQXJyYXl9IGZyb20gJy4vbW9kZWwvZm9ybV9hcnJheSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtQ29udHJvbE9wdGlvbnMsIEZvcm1Db250cm9sU3RhdGUsIFVudHlwZWRGb3JtQ29udHJvbH0gZnJvbSAnLi9tb2RlbC9mb3JtX2NvbnRyb2wnO1xuaW1wb3J0IHtGb3JtR3JvdXAsIFVudHlwZWRGb3JtR3JvdXB9IGZyb20gJy4vbW9kZWwvZm9ybV9ncm91cCc7XG5cbmZ1bmN0aW9uIGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogb3B0aW9ucyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuICEhb3B0aW9ucyAmJlxuICAgICAgKChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLmFzeW5jVmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudXBkYXRlT24gIT09IHVuZGVmaW5lZCk7XG59XG5cbmZ1bmN0aW9uIGlzRm9ybUNvbnRyb2xPcHRpb25zKG9wdGlvbnM6IEZvcm1Db250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogb3B0aW9ucyBpcyBGb3JtQ29udHJvbE9wdGlvbnMge1xuICByZXR1cm4gISFvcHRpb25zICYmXG4gICAgICAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgRm9ybUNvbnRyb2xPcHRpb25zKS5pbml0aWFsVmFsdWVJc0RlZmF1bHQgIT09IHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQ29udHJvbENvbmZpZzxUPiBpcyBhIHR1cGxlIGNvbnRhaW5pbmcgYSB2YWx1ZSBvZiB0eXBlIFQsIHBsdXMgb3B0aW9uYWwgdmFsaWRhdG9ycyBhbmQgYXN5bmNcbiAqIHZhbGlkYXRvcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBDb250cm9sQ29uZmlnPFQ+ID0gW1R8Rm9ybUNvbnRyb2xTdGF0ZTxUPiwgKFZhbGlkYXRvckZufChWYWxpZGF0b3JGbltdKSk/LCAoQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW10pP107XG5cblxuLy8gRGlzYWJsZSBjbGFuZy1mb3JtYXQgdG8gcHJvZHVjZSBjbGVhcmVyIGZvcm1hdHRpbmcgZm9yIHRoaXMgbXVsdGlsaW5lIHR5cGUuXG4vLyBjbGFuZy1mb3JtYXQgb2ZmXG5cbi8qKlxuICogRm9ybUJ1aWxkZXIgYWNjZXB0cyB2YWx1ZXMgaW4gdmFyaW91cyBjb250YWluZXIgc2hhcGVzLCBhcyB3ZWxsIGFzIHJhdyB2YWx1ZXMuXG4gKiBFbGVtZW50IHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIGNvcnJlc3BvbmRpbmcgbW9kZWwgY2xhc3MsIGdpdmVuIHRoZSBjb250YWluZXIgVC5cbiAqIFRoZSBmbGFnIE4sIGlmIG5vdCBuZXZlciwgbWFrZXMgdGhlIHJlc3VsdGluZyBgRm9ybUNvbnRyb2xgIGhhdmUgTiBpbiBpdHMgdHlwZS4gXG4gKi9cbmV4cG9ydCB0eXBlIMm1RWxlbWVudDxULCBOIGV4dGVuZHMgbnVsbD4gPVxuICBUIGV4dGVuZHMgRm9ybUNvbnRyb2w8aW5mZXIgVT4gPyBGb3JtQ29udHJvbDxVPiA6XG4gIFQgZXh0ZW5kcyBGb3JtR3JvdXA8aW5mZXIgVT4gPyBGb3JtR3JvdXA8VT4gOlxuICBUIGV4dGVuZHMgRm9ybUFycmF5PGluZmVyIFU+ID8gRm9ybUFycmF5PFU+IDpcbiAgVCBleHRlbmRzIEFic3RyYWN0Q29udHJvbDxpbmZlciBVPiA/IEFic3RyYWN0Q29udHJvbDxVPiA6XG4gIFQgZXh0ZW5kcyBGb3JtQ29udHJvbFN0YXRlPGluZmVyIFU+ID8gRm9ybUNvbnRyb2w8VXxOPiA6XG4gIFQgZXh0ZW5kcyBDb250cm9sQ29uZmlnPGluZmVyIFU+ID8gRm9ybUNvbnRyb2w8VXxOPiA6XG4gIC8vIENvbnRyb2xDb25maWcgY2FuIGJlIHRvbyBtdWNoIGZvciB0aGUgY29tcGlsZXIgdG8gaW5mZXIgaW4gdGhlIHdyYXBwZWQgY2FzZS4gVGhpcyBpc1xuICAvLyBub3Qgc3VycHJpc2luZywgc2luY2UgaXQncyBwcmFjdGljYWxseSBkZWF0aC1ieS1wb2x5bW9ycGhpc20gKGUuZy4gdGhlIG9wdGlvbmFsIHZhbGlkYXRvcnNcbiAgLy8gbWVtYmVycyB0aGF0IG1pZ2h0IGJlIGFycmF5cykuIFdhdGNoIGZvciBDb250cm9sQ29uZmlncyB0aGF0IG1pZ2h0IGZhbGwgdGhyb3VnaC5cbiAgVCBleHRlbmRzIEFycmF5PGluZmVyIFV8VmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXT4gPyBGb3JtQ29udHJvbDxVfE4+IDpcbiAgLy8gRmFsbHRob3VnaCBjYXNlOiBUIGlzIG5vdCBhIGNvbnRhaW5lciB0eXBlOyB1c2UgaXQgZGlyZWN0bHkgYXMgYSB2YWx1ZS5cbiAgRm9ybUNvbnRyb2w8VHxOPjtcblxuLy8gY2xhbmctZm9ybWF0IG9uXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGFuIGBBYnN0cmFjdENvbnRyb2xgIGZyb20gYSB1c2VyLXNwZWNpZmllZCBjb25maWd1cmF0aW9uLlxuICpcbiAqIFRoZSBgRm9ybUJ1aWxkZXJgIHByb3ZpZGVzIHN5bnRhY3RpYyBzdWdhciB0aGF0IHNob3J0ZW5zIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBhXG4gKiBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgb3IgYEZvcm1BcnJheWAuIEl0IHJlZHVjZXMgdGhlIGFtb3VudCBvZiBib2lsZXJwbGF0ZSBuZWVkZWQgdG9cbiAqIGJ1aWxkIGNvbXBsZXggZm9ybXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IFJlYWN0aXZlRm9ybXNNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIEZvcm1CdWlsZGVyIHtcbiAgcHJpdmF0ZSB1c2VOb25OdWxsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhIEZvcm1CdWlsZGVyIGluIHdoaWNoIGF1dG9tYXRpY2FsbHkgY29uc3RydWN0ZWQgQHNlZSBGb3JtQ29udHJvbH0gZWxlbWVudHNcbiAgICogaGF2ZSBge2luaXRpYWxWYWx1ZUlzRGVmYXVsdDogdHJ1ZX1gIGFuZCBhcmUgbm9uLW51bGxhYmxlLlxuICAgKlxuICAgKiAqKkNvbnN0cnVjdGluZyBub24tbnVsbGFibGUgY29udHJvbHMqKlxuICAgKlxuICAgKiBXaGVuIGNvbnN0cnVjdGluZyBhIGNvbnRyb2wsIGl0IHdpbGwgYmUgbm9uLW51bGxhYmxlLCBhbmQgd2lsbCByZXNldCB0byBpdHMgaW5pdGlhbCB2YWx1ZS5cbiAgICpcbiAgICogYGBgdHNcbiAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICogbGV0IG5hbWUgPSBubmZiLmNvbnRyb2woJ0FsZXgnKTsgLy8gRm9ybUNvbnRyb2w8c3RyaW5nPlxuICAgKiBuYW1lLnJlc2V0KCk7XG4gICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyAnQWxleCdcbiAgICogYGBgXG4gICAqXG4gICAqICoqQ29uc3RydWN0aW5nIG5vbi1udWxsYWJsZSBncm91cHMgb3IgYXJyYXlzKipcbiAgICpcbiAgICogV2hlbiBjb25zdHJ1Y3RpbmcgYSBncm91cCBvciBhcnJheSwgYWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpbm5lciBjb250cm9scyB3aWxsIGJlXG4gICAqIG5vbi1udWxsYWJsZSwgYW5kIHdpbGwgcmVzZXQgdG8gdGhlaXIgaW5pdGlhbCB2YWx1ZXMuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAqIGxldCBuYW1lID0gbm5mYi5ncm91cCh7d2hvOiAnQWxleCd9KTsgLy8gRm9ybUdyb3VwPHt3aG86IEZvcm1Db250cm9sPHN0cmluZz59PlxuICAgKiBuYW1lLnJlc2V0KCk7XG4gICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyB7d2hvOiAnQWxleCd9XG4gICAqIGBgYFxuICAgKiAqKkNvbnN0cnVjdGluZyAqbnVsbGFibGUqIGZpZWxkcyBvbiBncm91cHMgb3IgYXJyYXlzKipcbiAgICpcbiAgICogSXQgaXMgc3RpbGwgcG9zc2libGUgdG8gaGF2ZSBhIG51bGxhYmxlIGZpZWxkLiBJbiBwYXJ0aWN1bGFyLCBhbnkgYEZvcm1Db250cm9sYCB3aGljaCBpc1xuICAgKiAqYWxyZWFkeSogY29uc3RydWN0ZWQgd2lsbCBub3QgYmUgYWx0ZXJlZC4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAqIC8vIEZvcm1Hcm91cDx7d2hvOiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD59PlxuICAgKiBsZXQgbmFtZSA9IG5uZmIuZ3JvdXAoe3dobzogbmV3IEZvcm1Db250cm9sKCdBbGV4Jyl9KTtcbiAgICogbmFtZS5yZXNldCgpOyBjb25zb2xlLmxvZyhuYW1lKTsgLy8ge3dobzogbnVsbH1cbiAgICogYGBgXG4gICAqXG4gICAqIEJlY2F1c2UgdGhlIGlubmVyIGNvbnRyb2wgaXMgY29uc3RydWN0ZWQgZXhwbGljaXRseSBieSB0aGUgY2FsbGVyLCB0aGUgYnVpbGRlciBoYXNcbiAgICogbm8gY29udHJvbCBvdmVyIGhvdyBpdCBpcyBjcmVhdGVkLCBhbmQgY2Fubm90IGV4Y2x1ZGUgdGhlIGBudWxsYC5cbiAgICovXG4gIGdldCBub25OdWxsYWJsZSgpOiBOb25OdWxsYWJsZUZvcm1CdWlsZGVyIHtcbiAgICBjb25zdCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCk7XG4gICAgbm5mYi51c2VOb25OdWxsYWJsZSA9IHRydWU7XG4gICAgcmV0dXJuIG5uZmIgYXMgTm9uTnVsbGFibGVGb3JtQnVpbGRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIGFuIG9iamVjdFxuICAgKiBjb250YWluaW5nIGFsbCB0aGUga2V5cyBhbmQgY29ycmVzcG9uZGluZyBpbm5lciBjb250cm9sIHR5cGVzLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIG9iamVjdCBzaG91bGQgaGF2ZSB0aGVcbiAgICogYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIHR5cGUgYW5kIG1pZ2h0IGNvbnRhaW4gdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAqICogYHZhbGlkYXRvcnNgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgYXN5bmNWYWxpZGF0b3JzYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYHVwZGF0ZU9uYDogVGhlIGV2ZW50IHVwb24gd2hpY2ggdGhlIGNvbnRyb2wgc2hvdWxkIGJlIHVwZGF0ZWQgKG9wdGlvbnM6ICdjaGFuZ2UnIHwgJ2JsdXInXG4gICAqIHwgc3VibWl0JykuXG4gICAqL1xuICBncm91cDxUIGV4dGVuZHMge30+KFxuICAgICAgY29udHJvbHM6IFQsXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogRm9ybUdyb3VwPHtbSyBpbiBrZXlvZiBUXTogybVFbGVtZW50PFRbS10sIG51bGw+fT47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFRoaXMgQVBJIGlzIG5vdCB0eXBlc2FmZSBhbmQgY2FuIHJlc3VsdCBpbiBpc3N1ZXMgd2l0aCBDbG9zdXJlIENvbXBpbGVyIHJlbmFtaW5nLlxuICAgKiBVc2UgdGhlIGBGb3JtQnVpbGRlciNncm91cGAgb3ZlcmxvYWQgd2l0aCBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgaW5zdGVhZC5cbiAgICogTm90ZSB0aGF0IGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBleHBlY3RzIGB2YWxpZGF0b3JzYCBhbmQgYGFzeW5jVmFsaWRhdG9yc2AgdG8gYmUgdmFsaWRcbiAgICogdmFsaWRhdG9ycy4gSWYgeW91IGhhdmUgY3VzdG9tIHZhbGlkYXRvcnMsIG1ha2Ugc3VyZSB0aGVpciB2YWxpZGF0aW9uIGZ1bmN0aW9uIHBhcmFtZXRlciBpc1xuICAgKiBgQWJzdHJhY3RDb250cm9sYCBhbmQgbm90IGEgc3ViLWNsYXNzLCBzdWNoIGFzIGBGb3JtR3JvdXBgLiBUaGVzZSBmdW5jdGlvbnMgd2lsbCBiZSBjYWxsZWRcbiAgICogd2l0aCBhbiBvYmplY3Qgb2YgdHlwZSBgQWJzdHJhY3RDb250cm9sYCBhbmQgdGhhdCBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBkb3duY2FzdCB0byBhXG4gICAqIHN1YmNsYXNzLCBzbyBUeXBlU2NyaXB0IHNlZXMgdGhpcyBhcyBhbiBlcnJvci4gRm9yIGV4YW1wbGUsIGNoYW5nZSB0aGUgYChncm91cDogRm9ybUdyb3VwKSA9PlxuICAgKiBWYWxpZGF0aW9uRXJyb3JzfG51bGxgIHNpZ25hdHVyZSB0byBiZSBgKGdyb3VwOiBBYnN0cmFjdENvbnRyb2wpID0+IFZhbGlkYXRpb25FcnJvcnN8bnVsbGAuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBIHJlY29yZCBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCB0aGUgY29udHJvbCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1Hcm91cGAuIFRoZSBsZWdhY3kgY29uZmlndXJhdGlvblxuICAgKiBvYmplY3QgY29uc2lzdHMgb2Y6XG4gICAqICogYHZhbGlkYXRvcmA6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKiAqIGBhc3luY1ZhbGlkYXRvcmA6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqIE5vdGU6IHRoZSBsZWdhY3kgZm9ybWF0IGlzIGRlcHJlY2F0ZWQgYW5kIG1pZ2h0IGJlIHJlbW92ZWQgaW4gb25lIG9mIHRoZSBuZXh0IG1ham9yIHZlcnNpb25zXG4gICAqIG9mIEFuZ3VsYXIuXG4gICAqL1xuICBncm91cChcbiAgICAgIGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgKTogRm9ybUdyb3VwO1xuXG4gIGdyb3VwKGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogYW55fSwgb3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW55fXxudWxsID0gbnVsbCk6XG4gICAgICBGb3JtR3JvdXAge1xuICAgIGNvbnN0IHJlZHVjZWRDb250cm9scyA9IHRoaXMuX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzKTtcblxuICAgIGxldCB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwgPSBudWxsO1xuICAgIGxldCBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwgPSBudWxsO1xuICAgIGxldCB1cGRhdGVPbjogRm9ybUhvb2tzfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgXG4gICAgICAgIHZhbGlkYXRvcnMgPSBvcHRpb25zLnZhbGlkYXRvcnMgIT0gbnVsbCA/IG9wdGlvbnMudmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIGFzeW5jVmFsaWRhdG9ycyA9IG9wdGlvbnMuYXN5bmNWYWxpZGF0b3JzICE9IG51bGwgPyBvcHRpb25zLmFzeW5jVmFsaWRhdG9ycyA6IG51bGw7XG4gICAgICAgIHVwZGF0ZU9uID0gb3B0aW9ucy51cGRhdGVPbiAhPSBudWxsID8gb3B0aW9ucy51cGRhdGVPbiA6IHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGBvcHRpb25zYCBhcmUgbGVnYWN5IGZvcm0gZ3JvdXAgb3B0aW9uc1xuICAgICAgICB2YWxpZGF0b3JzID0gKG9wdGlvbnMgYXMgYW55KVsndmFsaWRhdG9yJ10gIT0gbnVsbCA/IChvcHRpb25zIGFzIGFueSlbJ3ZhbGlkYXRvciddIDogbnVsbDtcbiAgICAgICAgYXN5bmNWYWxpZGF0b3JzID1cbiAgICAgICAgICAgIChvcHRpb25zIGFzIGFueSlbJ2FzeW5jVmFsaWRhdG9yJ10gIT0gbnVsbCA/IChvcHRpb25zIGFzIGFueSlbJ2FzeW5jVmFsaWRhdG9yJ10gOiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENhc3QgdG8gYGFueWAgYmVjYXVzZSB0aGUgaW5mZXJyZWQgdHlwZXMgYXJlIG5vdCBhcyBzcGVjaWZpYyBhcyBFbGVtZW50LlxuICAgIHJldHVybiBuZXcgRm9ybUdyb3VwKHJlZHVjZWRDb250cm9scywge2FzeW5jVmFsaWRhdG9ycywgdXBkYXRlT24sIHZhbGlkYXRvcnN9KSBhcyBhbnk7XG4gIH1cblxuICBjb250cm9sPFQ+KGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LCBvcHRzOiBGb3JtQ29udHJvbE9wdGlvbnMme1xuICAgIGluaXRpYWxWYWx1ZUlzRGVmYXVsdDogdHJ1ZVxuICB9KTogRm9ybUNvbnRyb2w8VD47XG5cbiAgY29udHJvbDxUPihcbiAgICAgIGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxGb3JtQ29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1Db250cm9sPFR8bnVsbD47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgYEZvcm1Db250cm9sYCB3aXRoIHRoZSBnaXZlbiBzdGF0ZSwgdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy4gU2V0XG4gICAqIGB7aW5pdGlhbFZhbHVlSXNEZWZhdWx0OiB0cnVlfWAgaW4gdGhlIG9wdGlvbnMgdG8gZ2V0IGEgbm9uLW51bGxhYmxlIGNvbnRyb2wuIE90aGVyd2lzZSwgdGhlXG4gICAqIGNvbnRyb2wgd2lsbCBiZSBudWxsYWJsZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyB0aGUgdHlwZSAgb2YgdGhlXG4gICAqIGNvbnRyb2wncyB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsIG9yXG4gICAqIHdpdGggYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGEgYEZvcm1Db250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBJbml0aWFsaXplIGEgY29udHJvbCBhcyBkaXNhYmxlZFxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmV0dXJucyBhIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlIGluIGEgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cImZvcm1zL3RzL2Zvcm1CdWlsZGVyL2Zvcm1fYnVpbGRlcl9leGFtcGxlLnRzXCIgcmVnaW9uPVwiZGlzYWJsZWQtY29udHJvbFwiPlxuICAgKiA8L2NvZGUtZXhhbXBsZT5cbiAgICovXG4gIGNvbnRyb2w8VD4oXG4gICAgICBmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118Rm9ybUNvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQ29udHJvbCB7XG4gICAgbGV0IG5ld09wdGlvbnM6IEZvcm1Db250cm9sT3B0aW9ucyA9IHt9O1xuICAgIGlmICghdGhpcy51c2VOb25OdWxsYWJsZSkge1xuICAgICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICAgIH1cbiAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKHZhbGlkYXRvck9yT3B0cykpIHtcbiAgICAgIC8vIElmIHRoZSBzZWNvbmQgYXJndW1lbnQgaXMgb3B0aW9ucywgdGhlbiB0aGV5IGFyZSBjb3BpZWQuXG4gICAgICBuZXdPcHRpb25zID0gdmFsaWRhdG9yT3JPcHRzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0aGUgb3RoZXIgYXJndW1lbnRzIGFyZSB2YWxpZGF0b3JzLCB0aGV5IGFyZSBjb3BpZWQgaW50byBhbiBvcHRpb25zIG9iamVjdC5cbiAgICAgIG5ld09wdGlvbnMudmFsaWRhdG9ycyA9IHZhbGlkYXRvck9yT3B0cztcbiAgICAgIG5ld09wdGlvbnMuYXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3I7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2w8VD4oZm9ybVN0YXRlLCB7Li4ubmV3T3B0aW9ucywgaW5pdGlhbFZhbHVlSXNEZWZhdWx0OiB0cnVlfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBgRm9ybUFycmF5YCBmcm9tIHRoZSBnaXZlbiBhcnJheSBvZiBjb25maWd1cmF0aW9ucyxcbiAgICogdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyB0aGUgdHlwZSBvZiBlYWNoIGNvbnRyb2xcbiAgICogaW5zaWRlIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEFuIGFycmF5IG9mIGNoaWxkIGNvbnRyb2xzIG9yIGNvbnRyb2wgY29uZmlncy4gRWFjaCBjaGlsZCBjb250cm9sIGlzIGdpdmVuIGFuXG4gICAqICAgICBpbmRleCB3aGVuIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHN1Y2ggZnVuY3Rpb25zLCBvciBhblxuICAgKiAgICAgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKi9cbiAgYXJyYXk8VD4oXG4gICAgICBjb250cm9sczogQXJyYXk8VD4sIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUFycmF5PMm1RWxlbWVudDxULCBudWxsPj4ge1xuICAgIGNvbnN0IGNyZWF0ZWRDb250cm9scyA9IGNvbnRyb2xzLm1hcChjID0+IHRoaXMuX2NyZWF0ZUNvbnRyb2woYykpO1xuICAgIC8vIENhc3QgdG8gYGFueWAgYmVjYXVzZSB0aGUgaW5mZXJyZWQgdHlwZXMgYXJlIG5vdCBhcyBzcGVjaWZpYyBhcyBFbGVtZW50LlxuICAgIHJldHVybiBuZXcgRm9ybUFycmF5KGNyZWF0ZWRDb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikgYXMgYW55O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVkdWNlQ29udHJvbHM8VD4oY29udHJvbHM6XG4gICAgICAgICAgICAgICAgICAgICAgICAge1trOiBzdHJpbmddOiBUfENvbnRyb2xDb25maWc8VD58Rm9ybUNvbnRyb2xTdGF0ZTxUPnxBYnN0cmFjdENvbnRyb2w8VD59KTpcbiAgICAgIHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9IHtcbiAgICBjb25zdCBjcmVhdGVkQ29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9ID0ge307XG4gICAgT2JqZWN0LmtleXMoY29udHJvbHMpLmZvckVhY2goY29udHJvbE5hbWUgPT4ge1xuICAgICAgY3JlYXRlZENvbnRyb2xzW2NvbnRyb2xOYW1lXSA9IHRoaXMuX2NyZWF0ZUNvbnRyb2woY29udHJvbHNbY29udHJvbE5hbWVdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY3JlYXRlZENvbnRyb2xzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY3JlYXRlQ29udHJvbDxUPihjb250cm9sczogVHxGb3JtQ29udHJvbFN0YXRlPFQ+fENvbnRyb2xDb25maWc8VD58Rm9ybUNvbnRyb2w8VD58XG4gICAgICAgICAgICAgICAgICAgIEFic3RyYWN0Q29udHJvbDxUPik6IEZvcm1Db250cm9sPFQ+fEZvcm1Db250cm9sPFR8bnVsbD58QWJzdHJhY3RDb250cm9sPFQ+IHtcbiAgICBpZiAoY29udHJvbHMgaW5zdGFuY2VvZiBGb3JtQ29udHJvbCkge1xuICAgICAgcmV0dXJuIGNvbnRyb2xzIGFzIEZvcm1Db250cm9sPFQ+O1xuICAgIH0gZWxzZSBpZiAoY29udHJvbHMgaW5zdGFuY2VvZiBBYnN0cmFjdENvbnRyb2wpIHsgIC8vIEEgY29udHJvbDsganVzdCByZXR1cm4gaXRcbiAgICAgIHJldHVybiBjb250cm9scztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbHMpKSB7ICAvLyBDb250cm9sQ29uZmlnIFR1cGxlXG4gICAgICBjb25zdCB2YWx1ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+ID0gY29udHJvbHNbMF07XG4gICAgICBjb25zdCB2YWxpZGF0b3I6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCA9IGNvbnRyb2xzLmxlbmd0aCA+IDEgPyBjb250cm9sc1sxXSEgOiBudWxsO1xuICAgICAgY29uc3QgYXN5bmNWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwgPVxuICAgICAgICAgIGNvbnRyb2xzLmxlbmd0aCA+IDIgPyBjb250cm9sc1syXSEgOiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbDxUPih2YWx1ZSwgdmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcik7XG4gICAgfSBlbHNlIHsgIC8vIFQgb3IgRm9ybUNvbnRyb2xTdGF0ZTxUPlxuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbDxUPihjb250cm9scyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgTm9uTnVsbGFibGVGb3JtQnVpbGRlcmAgaXMgc2ltaWxhciB0byB7QHNlZSBGb3JtQnVpbGRlcn0sIGJ1dCBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdGVkXG4gKiB7QHNlZSBGb3JtQ29udHJvbH0gZWxlbWVudHMgaGF2ZSBge2luaXRpYWxWYWx1ZUlzRGVmYXVsdDogdHJ1ZX1gIGFuZCBhcmUgbm9uLW51bGxhYmxlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb25OdWxsYWJsZUZvcm1CdWlsZGVyIHtcbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8ge0BzZWUgRm9ybUJ1aWxkZXIjZ3JvdXB9LCBleGNlcHQgYW55IGltcGxpY2l0bHkgY29uc3RydWN0ZWQgYEZvcm1Db250cm9sYFxuICAgKiB3aWxsIGJlIG5vbi1udWxsYWJsZSAoaS5lLiBpdCB3aWxsIGhhdmUgYGluaXRpYWxWYWx1ZUlzRGVmYXVsdGAgc2V0IHRvIHRydWUpLiBOb3RlXG4gICAqIHRoYXQgYWxyZWFkeS1jb25zdHJ1Y3RlZCBjb250cm9scyB3aWxsIG5vdCBiZSBhbHRlcmVkLlxuICAgKi9cbiAgZ3JvdXA8VCBleHRlbmRzIHt9PihcbiAgICAgIGNvbnRyb2xzOiBULFxuICAgICAgb3B0aW9ucz86IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgICk6IEZvcm1Hcm91cDx7W0sgaW4ga2V5b2YgVF06IMm1RWxlbWVudDxUW0tdLCBuZXZlcj59PjtcblxuICAvKipcbiAgICogU2ltaWxhciB0byB7QHNlZSBGb3JtQnVpbGRlciNhcnJheX0sIGV4Y2VwdCBhbnkgaW1wbGljaXRseSBjb25zdHJ1Y3RlZCBgRm9ybUNvbnRyb2xgXG4gICAqIHdpbGwgYmUgbm9uLW51bGxhYmxlIChpLmUuIGl0IHdpbGwgaGF2ZSBgaW5pdGlhbFZhbHVlSXNEZWZhdWx0YCBzZXQgdG8gdHJ1ZSkuIE5vdGVcbiAgICogdGhhdCBhbHJlYWR5LWNvbnN0cnVjdGVkIGNvbnRyb2xzIHdpbGwgbm90IGJlIGFsdGVyZWQuXG4gICAqL1xuICBhcnJheTxUPihcbiAgICAgIGNvbnRyb2xzOiBBcnJheTxUPiwgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQXJyYXk8ybVFbGVtZW50PFQsIG5ldmVyPj47XG5cbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8ge0BzZWUgRm9ybUJ1aWxkZXIjY29udHJvbH0sIGV4Y2VwdCB0aGlzIG92ZXJyaWRkZW4gdmVyc2lvbiBvZiBgY29udHJvbGAgZm9yY2VzXG4gICAqIGBpbml0aWFsVmFsdWVJc0RlZmF1bHRgIHRvIGJlIGB0cnVlYCwgcmVzdWx0aW5nIGluIHRoZSBjb250cm9sIGFsd2F5cyBiZWluZyBub24tbnVsbGFibGUuXG4gICAqL1xuICBjb250cm9sPFQ+KFxuICAgICAgZm9ybVN0YXRlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1Db250cm9sPFQ+O1xufVxuXG4vKipcbiAqIFVudHlwZWRGb3JtQnVpbGRlciBpcyB0aGUgc2FtZSBhcyBAc2VlIEZvcm1CdWlsZGVyLCBidXQgaXQgcHJvdmlkZXMgdW50eXBlZCBjb250cm9scy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IFJlYWN0aXZlRm9ybXNNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIFVudHlwZWRGb3JtQnVpbGRlciBleHRlbmRzIEZvcm1CdWlsZGVyIHtcbiAgLyoqXG4gICAqIExpa2Uge0BzZWUgRm9ybUJ1aWxkZXIjZ3JvdXB9LCBleGNlcHQgdGhlIHJlc3VsdGluZyBncm91cCBpcyB1bnR5cGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogVW50eXBlZEZvcm1Hcm91cDtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaXMgbm90IHR5cGVzYWZlIGFuZCBjYW4gcmVzdWx0IGluIGlzc3VlcyB3aXRoIENsb3N1cmUgQ29tcGlsZXIgcmVuYW1pbmcuXG4gICAqIFVzZSB0aGUgYEZvcm1CdWlsZGVyI2dyb3VwYCBvdmVybG9hZCB3aXRoIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBpbnN0ZWFkLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgICk6IFVudHlwZWRGb3JtR3JvdXA7XG5cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGwgPSBudWxsKTogVW50eXBlZEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHN1cGVyLmdyb3VwKGNvbnRyb2xzQ29uZmlnLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWtlIHtAc2VlIEZvcm1CdWlsZGVyI2NvbnRyb2x9LCBleGNlcHQgdGhlIHJlc3VsdGluZyBjb250cm9sIGlzIHVudHlwZWQuXG4gICAqL1xuICBvdmVycmlkZSBjb250cm9sKFxuICAgICAgZm9ybVN0YXRlOiBhbnksIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118Rm9ybUNvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBVbnR5cGVkRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiBzdXBlci5jb250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogTGlrZSB7QHNlZSBGb3JtQnVpbGRlciNhcnJheX0sIGV4Y2VwdCB0aGUgcmVzdWx0aW5nIGFycmF5IGlzIHVudHlwZWQuXG4gICAqL1xuICBvdmVycmlkZSBhcnJheShcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiBhbnlbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogVW50eXBlZEZvcm1BcnJheSB7XG4gICAgcmV0dXJuIHN1cGVyLmFycmF5KGNvbnRyb2xzQ29uZmlnLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxufVxuIl19