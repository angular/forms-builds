/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { inject, Injectable } from '@angular/core';
import { AbstractControl } from './model/abstract_model';
import { FormArray } from './model/form_array';
import { FormControl } from './model/form_control';
import { FormGroup, FormRecord } from './model/form_group';
import * as i0 from "@angular/core";
function isAbstractControlOptions(options) {
    return !!options &&
        (options.asyncValidators !== undefined ||
            options.validators !== undefined ||
            options.updateOn !== undefined);
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
     * Returns a FormBuilder in which automatically constructed `FormControl` elements
     * have `{nonNullable: true}` and are non-nullable.
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
        let newOptions = {};
        if (isAbstractControlOptions(options)) {
            // `options` are `AbstractControlOptions`
            newOptions = options;
        }
        else if (options !== null) {
            // `options` are legacy form group options
            newOptions.validators = options.validator;
            newOptions.asyncValidators = options.asyncValidator;
        }
        return new FormGroup(reducedControls, newOptions);
    }
    /**
     * @description
     * Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
     * containing all the keys and corresponding inner control types.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param options Configuration options object for the `FormRecord`. The object should have the
     * `AbstractControlOptions` type and might contain the following fields:
     * * `validators`: A synchronous validator function, or an array of validator functions.
     * * `asyncValidators`: A single async validator or array of async validator functions.
     * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
     * | submit').
     */
    record(controls, options = null) {
        const reducedControls = this._reduceControls(controls);
        // Cast to `any` because the inferred types are not as specific as Element.
        return new FormRecord(reducedControls, options);
    }
    /**
     * @description
     * Constructs a new `FormControl` with the given state, validators and options. Sets
     * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
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
        return new FormControl(formState, { ...newOptions, nonNullable: true });
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: FormBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: FormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
/**
 * @description
 * `NonNullableFormBuilder` is similar to {@link FormBuilder}, but automatically constructed
 * {@link FormControl} elements have `{nonNullable: true}` and are non-nullable.
 *
 * @publicApi
 */
export class NonNullableFormBuilder {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: NonNullableFormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: NonNullableFormBuilder, providedIn: 'root', useFactory: () => inject(FormBuilder).nonNullable }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: NonNullableFormBuilder, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useFactory: () => inject(FormBuilder).nonNullable,
                }]
        }] });
/**
 * UntypedFormBuilder is the same as `FormBuilder`, but it provides untyped controls.
 */
export class UntypedFormBuilder extends FormBuilder {
    group(controlsConfig, options = null) {
        return super.group(controlsConfig, options);
    }
    /**
     * Like `FormBuilder#control`, except the resulting control is untyped.
     */
    control(formState, validatorOrOpts, asyncValidator) {
        return super.control(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Like `FormBuilder#array`, except the resulting array is untyped.
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        return super.array(controlsConfig, validatorOrOpts, asyncValidator);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: UntypedFormBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: UntypedFormBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-6d14fc5", ngImport: i0, type: UntypedFormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUdqRCxPQUFPLEVBQUMsZUFBZSxFQUFvQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFGLE9BQU8sRUFBQyxTQUFTLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUFDLFdBQVcsRUFBMkQsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBbUIsTUFBTSxvQkFBb0IsQ0FBQzs7QUFFM0UsU0FBUyx3QkFBd0IsQ0FBQyxPQUNTO0lBQ3pDLE9BQU8sQ0FBQyxDQUFDLE9BQU87UUFDWixDQUFFLE9BQWtDLENBQUMsZUFBZSxLQUFLLFNBQVM7WUFDaEUsT0FBa0MsQ0FBQyxVQUFVLEtBQUssU0FBUztZQUMzRCxPQUFrQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBd0VELGtCQUFrQjtBQUVsQjs7Ozs7Ozs7Ozs7R0FXRztBQUVILE1BQU0sT0FBTyxXQUFXO0lBRHhCO1FBRVUsbUJBQWMsR0FBWSxLQUFLLENBQUM7S0EyUHpDO0lBelBDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlDRztJQUNILElBQUksV0FBVztRQUNiLE1BQU0sSUFBSSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDM0IsT0FBTyxJQUE4QixDQUFDO0lBQ3hDLENBQUM7SUFrREQsS0FBSyxDQUFDLFFBQThCLEVBQUUsVUFDaUQsSUFBSTtRQUV6RixNQUFNLGVBQWUsR0FBRyxJ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RSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRztJQUNNLE9BQU8sQ0FDWixTQUFjLEVBQUUsZUFBbUUsRUFDbkYsY0FBeUQ7UUFDM0QsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOztPQUVHO0lBQ00sS0FBSyxDQUNWLGNBQXFCLEVBQ3JCLGVBQXVFLEVBQ3ZFLGNBQXlEO1FBQzNELE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7eUhBekNVLGtCQUFrQjs2SEFBbEIsa0JBQWtCLGNBRE4sTUFBTTs7c0dBQ2xCLGtCQUFrQjtrQkFEOUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQWJzdHJhY3RDb250cm9sT3B0aW9ucywgRm9ybUhvb2tzfSBmcm9tICcuL21vZGVsL2Fic3RyYWN0X21vZGVsJztcbmltcG9ydCB7Rm9ybUFycmF5LCBVbnR5cGVkRm9ybUFycmF5fSBmcm9tICcuL21vZGVsL2Zvcm1fYXJyYXknO1xuaW1wb3J0IHtGb3JtQ29udHJvbCwgRm9ybUNvbnRyb2xPcHRpb25zLCBGb3JtQ29udHJvbFN0YXRlLCBVbnR5cGVkRm9ybUNvbnRyb2x9IGZyb20gJy4vbW9kZWwvZm9ybV9jb250cm9sJztcbmltcG9ydCB7Rm9ybUdyb3VwLCBGb3JtUmVjb3JkLCBVbnR5cGVkRm9ybUdyb3VwfSBmcm9tICcuL21vZGVsL2Zvcm1fZ3JvdXAnO1xuXG5mdW5jdGlvbiBpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnMob3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk6IG9wdGlvbnMgaXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIHJldHVybiAhIW9wdGlvbnMgJiZcbiAgICAgICgob3B0aW9ucyBhcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zKS5hc3luY1ZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgIChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgIChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnVwZGF0ZU9uICE9PSB1bmRlZmluZWQpO1xufVxuXG4vKipcbiAqIFRoZSB1bmlvbiBvZiBhbGwgdmFsaWRhdG9yIHR5cGVzIHRoYXQgY2FuIGJlIGFjY2VwdGVkIGJ5IGEgQ29udHJvbENvbmZpZy5cbiAqL1xudHlwZSBWYWxpZGF0b3JDb25maWcgPSBWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QXN5bmNWYWxpZGF0b3JGbltdO1xuXG4vKipcbiAqIFRoZSBjb21waWxlciBtYXkgbm90IGFsd2F5cyBiZSBhYmxlIHRvIHByb3ZlIHRoYXQgdGhlIGVsZW1lbnRzIG9mIHRoZSBjb250cm9sIGNvbmZpZyBhcmUgYSB0dXBsZVxuICogKGkuZS4gb2NjdXIgaW4gYSBmaXhlZCBvcmRlcikuIFRoaXMgc2xpZ2h0bHkgbG9vc2VyIHR5cGUgaXMgdXNlZCBmb3IgaW5mZXJlbmNlLCB0byBjYXRjaCBjYXNlc1xuICogd2hlcmUgdGhlIGNvbXBpbGVyIGNhbm5vdCBwcm92ZSBvcmRlciBhbmQgcG9zaXRpb24uXG4gKlxuICogRm9yIGV4YW1wbGUsIGNvbnNpZGVyIHRoZSBzaW1wbGUgY2FzZSBgZmIuZ3JvdXAoe2ZvbzogWydiYXInLCBWYWxpZGF0b3JzLnJlcXVpcmVkXX0pYC4gVGhlXG4gKiBjb21waWxlciB3aWxsIGluZmVyIHRoaXMgYXMgYW4gYXJyYXksIG5vdCBhcyBhIHR1cGxlLlxuICovXG50eXBlIFBlcm1pc3NpdmVDb250cm9sQ29uZmlnPFQ+ID0gQXJyYXk8VHxGb3JtQ29udHJvbFN0YXRlPFQ+fFZhbGlkYXRvckNvbmZpZz47XG5cbi8qKlxuICogSGVscGVyIHR5cGUgdG8gYWxsb3cgdGhlIGNvbXBpbGVyIHRvIGFjY2VwdCBbWFhYWCwgeyB1cGRhdGVPbjogc3RyaW5nIH1dIGFzIGEgdmFsaWQgc2hvcnRoYW5kXG4gKiBhcmd1bWVudCBmb3IgLmdyb3VwKClcbiAqL1xuaW50ZXJmYWNlIFBlcm1pc3NpdmVBYnN0cmFjdENvbnRyb2xPcHRpb25zIGV4dGVuZHMgT21pdDxBYnN0cmFjdENvbnRyb2xPcHRpb25zLCAndXBkYXRlT24nPiB7XG4gIHVwZGF0ZU9uPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbnRyb2xDb25maWc8VD4gaXMgYSB0dXBsZSBjb250YWluaW5nIGEgdmFsdWUgb2YgdHlwZSBULCBwbHVzIG9wdGlvbmFsIHZhbGlkYXRvcnMgYW5kIGFzeW5jXG4gKiB2YWxpZGF0b3JzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgQ29udHJvbENvbmZpZzxUPiA9IFtUfEZvcm1Db250cm9sU3RhdGU8VD4sIChWYWxpZGF0b3JGbnwoVmFsaWRhdG9yRm5bXSkpPywgKEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdKT9dO1xuXG4vLyBEaXNhYmxlIGNsYW5nLWZvcm1hdCB0byBwcm9kdWNlIGNsZWFyZXIgZm9ybWF0dGluZyBmb3IgdGhpcyBtdWx0aWxpbmUgdHlwZS5cbi8vIGNsYW5nLWZvcm1hdCBvZmZcblxuLyoqXG4gKiBGb3JtQnVpbGRlciBhY2NlcHRzIHZhbHVlcyBpbiB2YXJpb3VzIGNvbnRhaW5lciBzaGFwZXMsIGFzIHdlbGwgYXMgcmF3IHZhbHVlcy5cbiAqIEVsZW1lbnQgcmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgY29ycmVzcG9uZGluZyBtb2RlbCBjbGFzcywgZ2l2ZW4gdGhlIGNvbnRhaW5lciBULlxuICogVGhlIGZsYWcgTiwgaWYgbm90IG5ldmVyLCBtYWtlcyB0aGUgcmVzdWx0aW5nIGBGb3JtQ29udHJvbGAgaGF2ZSBOIGluIGl0cyB0eXBlLlxuICovXG5leHBvcnQgdHlwZSDJtUVsZW1lbnQ8VCwgTiBleHRlbmRzIG51bGw+ID1cbiAgLy8gVGhlIGBleHRlbmRzYCBjaGVja3MgYXJlIHdyYXBwZWQgaW4gYXJyYXlzIGluIG9yZGVyIHRvIHByZXZlbnQgVHlwZVNjcmlwdCBmcm9tIGFwcGx5aW5nIHR5cGUgdW5pb25zXG4gIC8vIHRocm91Z2ggdGhlIGRpc3RyaWJ1dGl2ZSBjb25kaXRpb25hbCB0eXBlLiBUaGlzIGlzIHRoZSBvZmZpY2lhbGx5IHJlY29tbWVuZGVkIHNvbHV0aW9uOlxuICAvLyBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay8yL2NvbmRpdGlvbmFsLXR5cGVzLmh0bWwjZGlzdHJpYnV0aXZlLWNvbmRpdGlvbmFsLXR5cGVzXG4gIC8vXG4gIC8vIElkZW50aWZ5IEZvcm1Db250cm9sIGNvbnRhaW5lciB0eXBlcy5cbiAgW1RdIGV4dGVuZHMgW0Zvcm1Db250cm9sPGluZmVyIFU+XSA/IEZvcm1Db250cm9sPFU+IDpcbiAgLy8gT3IgRm9ybUNvbnRyb2wgY29udGFpbmVycyB0aGF0IGFyZSBvcHRpb25hbCBpbiB0aGVpciBwYXJlbnQgZ3JvdXAuXG4gIFtUXSBleHRlbmRzIFtGb3JtQ29udHJvbDxpbmZlciBVPnx1bmRlZmluZWRdID8gRm9ybUNvbnRyb2w8VT4gOlxuICAvLyBGb3JtR3JvdXAgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Zvcm1Hcm91cDxpbmZlciBVPl0gPyBGb3JtR3JvdXA8VT4gOlxuICAvLyBPcHRpb25hbCBGb3JtR3JvdXAgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Zvcm1Hcm91cDxpbmZlciBVPnx1bmRlZmluZWRdID8gRm9ybUdyb3VwPFU+IDpcbiAgLy8gRm9ybVJlY29yZCBjb250YWluZXJzLlxuICBbVF0gZXh0ZW5kcyBbRm9ybVJlY29yZDxpbmZlciBVPl0gPyBGb3JtUmVjb3JkPFU+IDpcbiAgLy8gT3B0aW9uYWwgRm9ybVJlY29yZCBjb250YWluZXJzLlxuICBbVF0gZXh0ZW5kcyBbRm9ybVJlY29yZDxpbmZlciBVPnx1bmRlZmluZWRdID8gRm9ybVJlY29yZDxVPiA6XG4gIC8vIEZvcm1BcnJheSBjb250YWluZXJzLlxuICBbVF0gZXh0ZW5kcyBbRm9ybUFycmF5PGluZmVyIFU+XSA/IEZvcm1BcnJheTxVPiA6XG4gIC8vIE9wdGlvbmFsIEZvcm1BcnJheSBjb250YWluZXJzLlxuICBbVF0gZXh0ZW5kcyBbRm9ybUFycmF5PGluZmVyIFU+fHVuZGVmaW5lZF0gPyBGb3JtQXJyYXk8VT4gOlxuICAvLyBPdGhlcndpc2UgdW5rbm93biBBYnN0cmFjdENvbnRyb2wgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Fic3RyYWN0Q29udHJvbDxpbmZlciBVPl0gPyBBYnN0cmFjdENvbnRyb2w8VT4gOlxuICAvLyBPcHRpb25hbCBBYnN0cmFjdENvbnRyb2wgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Fic3RyYWN0Q29udHJvbDxpbmZlciBVPnx1bmRlZmluZWRdID8gQWJzdHJhY3RDb250cm9sPFU+IDpcbiAgLy8gRm9ybUNvbnRyb2xTdGF0ZSBvYmplY3QgY29udGFpbmVyLCB3aGljaCBwcm9kdWNlcyBhIG51bGxhYmxlIGNvbnRyb2wuXG4gIFtUXSBleHRlbmRzIFtGb3JtQ29udHJvbFN0YXRlPGluZmVyIFU+XSA/IEZvcm1Db250cm9sPFV8Tj4gOlxuICAvLyBBIENvbnRyb2xDb25maWcgdHVwbGUsIHdoaWNoIHByb2R1Y2VzIGEgbnVsbGFibGUgY29udHJvbC5cbiAgW1RdIGV4dGVuZHMgW1Blcm1pc3NpdmVDb250cm9sQ29uZmlnPGluZmVyIFU+XSA/IEZvcm1Db250cm9sPEV4Y2x1ZGU8VSwgVmFsaWRhdG9yQ29uZmlnfCBQZXJtaXNzaXZlQWJzdHJhY3RDb250cm9sT3B0aW9ucz58Tj4gOlxuICBGb3JtQ29udHJvbDxUfE4+O1xuXG4vLyBjbGFuZy1mb3JtYXQgb25cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW4gYEFic3RyYWN0Q29udHJvbGAgZnJvbSBhIHVzZXItc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIGBGb3JtQnVpbGRlcmAgcHJvdmlkZXMgc3ludGFjdGljIHN1Z2FyIHRoYXQgc2hvcnRlbnMgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIGFcbiAqIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBvciBgRm9ybUFycmF5YC4gSXQgcmVkdWNlcyB0aGUgYW1vdW50IG9mIGJvaWxlcnBsYXRlIG5lZWRlZCB0b1xuICogYnVpbGQgY29tcGxleCBmb3Jtcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBGb3JtQnVpbGRlciB7XG4gIHByaXZhdGUgdXNlTm9uTnVsbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYSBGb3JtQnVpbGRlciBpbiB3aGljaCBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdGVkIGBGb3JtQ29udHJvbGAgZWxlbWVudHNcbiAgICogaGF2ZSBge25vbk51bGxhYmxlOiB0cnVlfWAgYW5kIGFyZSBub24tbnVsbGFibGUuXG4gICAqXG4gICAqICoqQ29uc3RydWN0aW5nIG5vbi1udWxsYWJsZSBjb250cm9scyoqXG4gICAqXG4gICAqIFdoZW4gY29uc3RydWN0aW5nIGEgY29udHJvbCwgaXQgd2lsbCBiZSBub24tbnVsbGFibGUsIGFuZCB3aWxsIHJlc2V0IHRvIGl0cyBpbml0aWFsIHZhbHVlLlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBsZXQgbm5mYiA9IG5ldyBGb3JtQnVpbGRlcigpLm5vbk51bGxhYmxlO1xuICAgKiBsZXQgbmFtZSA9IG5uZmIuY29udHJvbCgnQWxleCcpOyAvLyBGb3JtQ29udHJvbDxzdHJpbmc+XG4gICAqIG5hbWUucmVzZXQoKTtcbiAgICogY29uc29sZS5sb2cobmFtZSk7IC8vICdBbGV4J1xuICAgKiBgYGBcbiAgICpcbiAgICogKipDb25zdHJ1Y3Rpbmcgbm9uLW51bGxhYmxlIGdyb3VwcyBvciBhcnJheXMqKlxuICAgKlxuICAgKiBXaGVuIGNvbnN0cnVjdGluZyBhIGdyb3VwIG9yIGFycmF5LCBhbGwgYXV0b21hdGljYWxseSBjcmVhdGVkIGlubmVyIGNvbnRyb2xzIHdpbGwgYmVcbiAgICogbm9uLW51bGxhYmxlLCBhbmQgd2lsbCByZXNldCB0byB0aGVpciBpbml0aWFsIHZhbHVlcy5cbiAgICpcbiAgICogYGBgdHNcbiAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICogbGV0IG5hbWUgPSBubmZiLmdyb3VwKHt3aG86ICdBbGV4J30pOyAvLyBGb3JtR3JvdXA8e3dobzogRm9ybUNvbnRyb2w8c3RyaW5nPn0+XG4gICAqIG5hbWUucmVzZXQoKTtcbiAgICogY29uc29sZS5sb2cobmFtZSk7IC8vIHt3aG86ICdBbGV4J31cbiAgICogYGBgXG4gICAqICoqQ29uc3RydWN0aW5nICpudWxsYWJsZSogZmllbGRzIG9uIGdyb3VwcyBvciBhcnJheXMqKlxuICAgKlxuICAgKiBJdCBpcyBzdGlsbCBwb3NzaWJsZSB0byBoYXZlIGEgbnVsbGFibGUgZmllbGQuIEluIHBhcnRpY3VsYXIsIGFueSBgRm9ybUNvbnRyb2xgIHdoaWNoIGlzXG4gICAqICphbHJlYWR5KiBjb25zdHJ1Y3RlZCB3aWxsIG5vdCBiZSBhbHRlcmVkLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICogLy8gRm9ybUdyb3VwPHt3aG86IEZvcm1Db250cm9sPHN0cmluZ3xudWxsPn0+XG4gICAqIGxldCBuYW1lID0gbm5mYi5ncm91cCh7d2hvOiBuZXcgRm9ybUNvbnRyb2woJ0FsZXgnKX0pO1xuICAgKiBuYW1lLnJlc2V0KCk7IGNvbnNvbGUubG9nKG5hbWUpOyAvLyB7d2hvOiBudWxsfVxuICAgKiBgYGBcbiAgICpcbiAgICogQmVjYXVzZSB0aGUgaW5uZXIgY29udHJvbCBpcyBjb25zdHJ1Y3RlZCBleHBsaWNpdGx5IGJ5IHRoZSBjYWxsZXIsIHRoZSBidWlsZGVyIGhhc1xuICAgKiBubyBjb250cm9sIG92ZXIgaG93IGl0IGlzIGNyZWF0ZWQsIGFuZCBjYW5ub3QgZXhjbHVkZSB0aGUgYG51bGxgLlxuICAgKi9cbiAgZ2V0IG5vbk51bGxhYmxlKCk6IE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIge1xuICAgIGNvbnN0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKTtcbiAgICBubmZiLnVzZU5vbk51bGxhYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gbm5mYiBhcyBOb25OdWxsYWJsZUZvcm1CdWlsZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIGFuIG9iamVjdFxuICAgKiBjb250YWluaW5nIGFsbCB0aGUga2V5cyBhbmQgY29ycmVzcG9uZGluZyBpbm5lciBjb250cm9sIHR5cGVzLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIG9iamVjdCBzaG91bGQgaGF2ZSB0aGVcbiAgICogYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIHR5cGUgYW5kIG1pZ2h0IGNvbnRhaW4gdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAqICogYHZhbGlkYXRvcnNgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgYXN5bmNWYWxpZGF0b3JzYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYHVwZGF0ZU9uYDogVGhlIGV2ZW50IHVwb24gd2hpY2ggdGhlIGNvbnRyb2wgc2hvdWxkIGJlIHVwZGF0ZWQgKG9wdGlvbnM6ICdjaGFuZ2UnIHwgJ2JsdXInXG4gICAqIHwgc3VibWl0JykuXG4gICAqL1xuICBncm91cDxUIGV4dGVuZHMge30+KFxuICAgICAgY29udHJvbHM6IFQsXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogRm9ybUdyb3VwPHtbSyBpbiBrZXlvZiBUXTogybVFbGVtZW50PFRbS10sIG51bGw+fT47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBpcyBub3QgdHlwZXNhZmUgYW5kIGNhbiByZXN1bHQgaW4gaXNzdWVzIHdpdGggQ2xvc3VyZSBDb21waWxlciByZW5hbWluZy5cbiAgICogVXNlIHRoZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgIG92ZXJsb2FkIHdpdGggYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGluc3RlYWQuXG4gICAqIE5vdGUgdGhhdCBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgZXhwZWN0cyBgdmFsaWRhdG9yc2AgYW5kIGBhc3luY1ZhbGlkYXRvcnNgIHRvIGJlIHZhbGlkXG4gICAqIHZhbGlkYXRvcnMuIElmIHlvdSBoYXZlIGN1c3RvbSB2YWxpZGF0b3JzLCBtYWtlIHN1cmUgdGhlaXIgdmFsaWRhdGlvbiBmdW5jdGlvbiBwYXJhbWV0ZXIgaXNcbiAgICogYEFic3RyYWN0Q29udHJvbGAgYW5kIG5vdCBhIHN1Yi1jbGFzcywgc3VjaCBhcyBgRm9ybUdyb3VwYC4gVGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkXG4gICAqIHdpdGggYW4gb2JqZWN0IG9mIHR5cGUgYEFic3RyYWN0Q29udHJvbGAgYW5kIHRoYXQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgZG93bmNhc3QgdG8gYVxuICAgKiBzdWJjbGFzcywgc28gVHlwZVNjcmlwdCBzZWVzIHRoaXMgYXMgYW4gZXJyb3IuIEZvciBleGFtcGxlLCBjaGFuZ2UgdGhlIGAoZ3JvdXA6IEZvcm1Hcm91cCkgPT5cbiAgICogVmFsaWRhdGlvbkVycm9yc3xudWxsYCBzaWduYXR1cmUgdG8gYmUgYChncm91cDogQWJzdHJhY3RDb250cm9sKSA9PiBWYWxpZGF0aW9uRXJyb3JzfG51bGxgLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSByZWNvcmQgb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggdGhlIGNvbnRyb2wgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIG9iamVjdCBmb3IgdGhlIGBGb3JtR3JvdXBgLiBUaGUgbGVnYWN5IGNvbmZpZ3VyYXRpb25cbiAgICogb2JqZWN0IGNvbnNpc3RzIG9mOlxuICAgKiAqIGB2YWxpZGF0b3JgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgYXN5bmNWYWxpZGF0b3JgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiBOb3RlOiB0aGUgbGVnYWN5IGZvcm1hdCBpcyBkZXByZWNhdGVkIGFuZCBtaWdodCBiZSByZW1vdmVkIGluIG9uZSBvZiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uc1xuICAgKiBvZiBBbmd1bGFyLlxuICAgKi9cbiAgZ3JvdXAoXG4gICAgICBjb250cm9sczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgICk6IEZvcm1Hcm91cDtcblxuICBncm91cChjb250cm9sczoge1trZXk6IHN0cmluZ106IGFueX0sIG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8e1trZXk6IHN0cmluZ106XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFueX18bnVsbCA9IG51bGwpOlxuICAgICAgRm9ybUdyb3VwIHtcbiAgICBjb25zdCByZWR1Y2VkQ29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9scyk7XG4gICAgbGV0IG5ld09wdGlvbnM6IEZvcm1Db250cm9sT3B0aW9ucyA9IHt9O1xuICAgIGlmIChpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnMob3B0aW9ucykpIHtcbiAgICAgIC8vIGBvcHRpb25zYCBhcmUgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgXG4gICAgICBuZXdPcHRpb25zID0gb3B0aW9ucztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMgIT09IG51bGwpIHtcbiAgICAgIC8vIGBvcHRpb25zYCBhcmUgbGVnYWN5IGZvcm0gZ3JvdXAgb3B0aW9uc1xuICAgICAgbmV3T3B0aW9ucy52YWxpZGF0b3JzID0gKG9wdGlvbnMgYXMgYW55KS52YWxpZGF0b3I7XG4gICAgICBuZXdPcHRpb25zLmFzeW5jVmFsaWRhdG9ycyA9IChvcHRpb25zIGFzIGFueSkuYXN5bmNWYWxpZGF0b3I7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRm9ybUdyb3VwKHJlZHVjZWRDb250cm9scywgbmV3T3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1SZWNvcmRgIGluc3RhbmNlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIGFuIG9iamVjdFxuICAgKiBjb250YWluaW5nIGFsbCB0aGUga2V5cyBhbmQgY29ycmVzcG9uZGluZyBpbm5lciBjb250cm9sIHR5cGVzLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybVJlY29yZGAuIFRoZSBvYmplY3Qgc2hvdWxkIGhhdmUgdGhlXG4gICAqIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCB0eXBlIGFuZCBtaWdodCBjb250YWluIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgKiAqIGB2YWxpZGF0b3JzYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYGFzeW5jVmFsaWRhdG9yc2A6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKiAqIGB1cGRhdGVPbmA6IFRoZSBldmVudCB1cG9uIHdoaWNoIHRoZSBjb250cm9sIHNob3VsZCBiZSB1cGRhdGVkIChvcHRpb25zOiAnY2hhbmdlJyB8ICdibHVyJ1xuICAgKiB8IHN1Ym1pdCcpLlxuICAgKi9cbiAgcmVjb3JkPFQ+KGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogVH0sIG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCA9IG51bGwpOlxuICAgICAgRm9ybVJlY29yZDzJtUVsZW1lbnQ8VCwgbnVsbD4+IHtcbiAgICBjb25zdCByZWR1Y2VkQ29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9scyk7XG4gICAgLy8gQ2FzdCB0byBgYW55YCBiZWNhdXNlIHRoZSBpbmZlcnJlZCB0eXBlcyBhcmUgbm90IGFzIHNwZWNpZmljIGFzIEVsZW1lbnQuXG4gICAgcmV0dXJuIG5ldyBGb3JtUmVjb3JkKHJlZHVjZWRDb250cm9scywgb3B0aW9ucykgYXMgYW55O1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgbm9uTnVsbGFibGVgIGluc3RlYWQuICovXG4gIGNvbnRyb2w8VD4oZm9ybVN0YXRlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4sIG9wdHM6IEZvcm1Db250cm9sT3B0aW9ucyZ7XG4gICAgaW5pdGlhbFZhbHVlSXNEZWZhdWx0OiB0cnVlXG4gIH0pOiBGb3JtQ29udHJvbDxUPjtcblxuICBjb250cm9sPFQ+KGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LCBvcHRzOiBGb3JtQ29udHJvbE9wdGlvbnMme25vbk51bGxhYmxlOiB0cnVlfSk6XG4gICAgICBGb3JtQ29udHJvbDxUPjtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgV2hlbiBwYXNzaW5nIGFuIGBvcHRpb25zYCBhcmd1bWVudCwgdGhlIGBhc3luY1ZhbGlkYXRvcmAgYXJndW1lbnQgaGFzIG5vIGVmZmVjdC5cbiAgICovXG4gIGNvbnRyb2w8VD4oXG4gICAgICBmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPiwgb3B0czogRm9ybUNvbnRyb2xPcHRpb25zLFxuICAgICAgYXN5bmNWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdKTogRm9ybUNvbnRyb2w8VHxudWxsPjtcblxuICBjb250cm9sPFQ+KFxuICAgICAgZm9ybVN0YXRlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEZvcm1Db250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2w8VHxudWxsPjtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1Db250cm9sYCB3aXRoIHRoZSBnaXZlbiBzdGF0ZSwgdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy4gU2V0c1xuICAgKiBge25vbk51bGxhYmxlOiB0cnVlfWAgaW4gdGhlIG9wdGlvbnMgdG8gZ2V0IGEgbm9uLW51bGxhYmxlIGNvbnRyb2wuIE90aGVyd2lzZSwgdGhlXG4gICAqIGNvbnRyb2wgd2lsbCBiZSBudWxsYWJsZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyB0aGUgdHlwZSAgb2YgdGhlXG4gICAqIGNvbnRyb2wncyB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsIG9yXG4gICAqIHdpdGggYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGEgYEZvcm1Db250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBJbml0aWFsaXplIGEgY29udHJvbCBhcyBkaXNhYmxlZFxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmV0dXJucyBhIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlIGluIGEgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cImZvcm1zL3RzL2Zvcm1CdWlsZGVyL2Zvcm1fYnVpbGRlcl9leGFtcGxlLnRzXCIgcmVnaW9uPVwiZGlzYWJsZWQtY29udHJvbFwiPlxuICAgKiA8L2NvZGUtZXhhbXBsZT5cbiAgICovXG4gIGNvbnRyb2w8VD4oXG4gICAgICBmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118Rm9ybUNvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQ29udHJvbCB7XG4gICAgbGV0IG5ld09wdGlvbnM6IEZvcm1Db250cm9sT3B0aW9ucyA9IHt9O1xuICAgIGlmICghdGhpcy51c2VOb25OdWxsYWJsZSkge1xuICAgICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICAgIH1cbiAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKHZhbGlkYXRvck9yT3B0cykpIHtcbiAgICAgIC8vIElmIHRoZSBzZWNvbmQgYXJndW1lbnQgaXMgb3B0aW9ucywgdGhlbiB0aGV5IGFyZSBjb3BpZWQuXG4gICAgICBuZXdPcHRpb25zID0gdmFsaWRhdG9yT3JPcHRzO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiB0aGUgb3RoZXIgYXJndW1lbnRzIGFyZSB2YWxpZGF0b3JzLCB0aGV5IGFyZSBjb3BpZWQgaW50byBhbiBvcHRpb25zIG9iamVjdC5cbiAgICAgIG5ld09wdGlvbnMudmFsaWRhdG9ycyA9IHZhbGlkYXRvck9yT3B0cztcbiAgICAgIG5ld09wdGlvbnMuYXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3I7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2w8VD4oZm9ybVN0YXRlLCB7Li4ubmV3T3B0aW9ucywgbm9uTnVsbGFibGU6IHRydWV9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQXJyYXlgIGZyb20gdGhlIGdpdmVuIGFycmF5IG9mIGNvbmZpZ3VyYXRpb25zLFxuICAgKiB2YWxpZGF0b3JzIGFuZCBvcHRpb25zLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIHRoZSB0eXBlIG9mIGVhY2ggY29udHJvbFxuICAgKiBpbnNpZGUgdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMgb3IgY29udHJvbCBjb25maWdzLiBFYWNoIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW5cbiAgICogICAgIGluZGV4IHdoZW4gaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2Ygc3VjaCBmdW5jdGlvbnMsIG9yIGFuXG4gICAqICAgICBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqL1xuICBhcnJheTxUPihcbiAgICAgIGNvbnRyb2xzOiBBcnJheTxUPiwgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQXJyYXk8ybVFbGVtZW50PFQsIG51bGw+PiB7XG4gICAgY29uc3QgY3JlYXRlZENvbnRyb2xzID0gY29udHJvbHMubWFwKGMgPT4gdGhpcy5fY3JlYXRlQ29udHJvbChjKSk7XG4gICAgLy8gQ2FzdCB0byBgYW55YCBiZWNhdXNlIHRoZSBpbmZlcnJlZCB0eXBlcyBhcmUgbm90IGFzIHNwZWNpZmljIGFzIEVsZW1lbnQuXG4gICAgcmV0dXJuIG5ldyBGb3JtQXJyYXkoY3JlYXRlZENvbnRyb2xzLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKSBhcyBhbnk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDb250cm9sczxUPihjb250cm9sczpcbiAgICAgICAgICAgICAgICAgICAgICAgICB7W2s6IHN0cmluZ106IFR8Q29udHJvbENvbmZpZzxUPnxGb3JtQ29udHJvbFN0YXRlPFQ+fEFic3RyYWN0Q29udHJvbDxUPn0pOlxuICAgICAge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0ge1xuICAgIGNvbnN0IGNyZWF0ZWRDb250cm9sczoge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0gPSB7fTtcbiAgICBPYmplY3Qua2V5cyhjb250cm9scykuZm9yRWFjaChjb250cm9sTmFtZSA9PiB7XG4gICAgICBjcmVhdGVkQ29udHJvbHNbY29udHJvbE5hbWVdID0gdGhpcy5fY3JlYXRlQ29udHJvbChjb250cm9sc1tjb250cm9sTmFtZV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjcmVhdGVkQ29udHJvbHM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jcmVhdGVDb250cm9sPFQ+KGNvbnRyb2xzOiBUfEZvcm1Db250cm9sU3RhdGU8VD58Q29udHJvbENvbmZpZzxUPnxGb3JtQ29udHJvbDxUPnxcbiAgICAgICAgICAgICAgICAgICAgQWJzdHJhY3RDb250cm9sPFQ+KTogRm9ybUNvbnRyb2w8VD58Rm9ybUNvbnRyb2w8VHxudWxsPnxBYnN0cmFjdENvbnRyb2w8VD4ge1xuICAgIGlmIChjb250cm9scyBpbnN0YW5jZW9mIEZvcm1Db250cm9sKSB7XG4gICAgICByZXR1cm4gY29udHJvbHMgYXMgRm9ybUNvbnRyb2w8VD47XG4gICAgfSBlbHNlIGlmIChjb250cm9scyBpbnN0YW5jZW9mIEFic3RyYWN0Q29udHJvbCkgeyAgLy8gQSBjb250cm9sOyBqdXN0IHJldHVybiBpdFxuICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjb250cm9scykpIHsgIC8vIENvbnRyb2xDb25maWcgVHVwbGVcbiAgICAgIGNvbnN0IHZhbHVlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4gPSBjb250cm9sc1swXTtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcjogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsID0gY29udHJvbHMubGVuZ3RoID4gMSA/IGNvbnRyb2xzWzFdISA6IG51bGw7XG4gICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCA9XG4gICAgICAgICAgY29udHJvbHMubGVuZ3RoID4gMiA/IGNvbnRyb2xzWzJdISA6IG51bGw7XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sPFQ+KHZhbHVlLCB2YWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yKTtcbiAgICB9IGVsc2UgeyAgLy8gVCBvciBGb3JtQ29udHJvbFN0YXRlPFQ+XG4gICAgICByZXR1cm4gdGhpcy5jb250cm9sPFQ+KGNvbnRyb2xzKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIGBOb25OdWxsYWJsZUZvcm1CdWlsZGVyYCBpcyBzaW1pbGFyIHRvIHtAbGluayBGb3JtQnVpbGRlcn0sIGJ1dCBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdGVkXG4gKiB7QGxpbmsgRm9ybUNvbnRyb2x9IGVsZW1lbnRzIGhhdmUgYHtub25OdWxsYWJsZTogdHJ1ZX1gIGFuZCBhcmUgbm9uLW51bGxhYmxlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIHVzZUZhY3Rvcnk6ICgpID0+IGluamVjdChGb3JtQnVpbGRlcikubm9uTnVsbGFibGUsXG59KVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogU2ltaWxhciB0byBgRm9ybUJ1aWxkZXIjZ3JvdXBgLCBleGNlcHQgYW55IGltcGxpY2l0bHkgY29uc3RydWN0ZWQgYEZvcm1Db250cm9sYFxuICAgKiB3aWxsIGJlIG5vbi1udWxsYWJsZSAoaS5lLiBpdCB3aWxsIGhhdmUgYG5vbk51bGxhYmxlYCBzZXQgdG8gdHJ1ZSkuIE5vdGVcbiAgICogdGhhdCBhbHJlYWR5LWNvbnN0cnVjdGVkIGNvbnRyb2xzIHdpbGwgbm90IGJlIGFsdGVyZWQuXG4gICAqL1xuICBhYnN0cmFjdCBncm91cDxUIGV4dGVuZHMge30+KFxuICAgICAgY29udHJvbHM6IFQsXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogRm9ybUdyb3VwPHtbSyBpbiBrZXlvZiBUXTogybVFbGVtZW50PFRbS10sIG5ldmVyPn0+O1xuXG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGBGb3JtQnVpbGRlciNyZWNvcmRgLCBleGNlcHQgYW55IGltcGxpY2l0bHkgY29uc3RydWN0ZWQgYEZvcm1Db250cm9sYFxuICAgKiB3aWxsIGJlIG5vbi1udWxsYWJsZSAoaS5lLiBpdCB3aWxsIGhhdmUgYG5vbk51bGxhYmxlYCBzZXQgdG8gdHJ1ZSkuIE5vdGVcbiAgICogdGhhdCBhbHJlYWR5LWNvbnN0cnVjdGVkIGNvbnRyb2xzIHdpbGwgbm90IGJlIGFsdGVyZWQuXG4gICAqL1xuICBhYnN0cmFjdCByZWNvcmQ8VD4oXG4gICAgICBjb250cm9sczoge1trZXk6IHN0cmluZ106IFR9LFxuICAgICAgb3B0aW9ucz86IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgICk6IEZvcm1SZWNvcmQ8ybVFbGVtZW50PFQsIG5ldmVyPj47XG5cbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8gYEZvcm1CdWlsZGVyI2FycmF5YCwgZXhjZXB0IGFueSBpbXBsaWNpdGx5IGNvbnN0cnVjdGVkIGBGb3JtQ29udHJvbGBcbiAgICogd2lsbCBiZSBub24tbnVsbGFibGUgKGkuZS4gaXQgd2lsbCBoYXZlIGBub25OdWxsYWJsZWAgc2V0IHRvIHRydWUpLiBOb3RlXG4gICAqIHRoYXQgYWxyZWFkeS1jb25zdHJ1Y3RlZCBjb250cm9scyB3aWxsIG5vdCBiZSBhbHRlcmVkLlxuICAgKi9cbiAgYWJzdHJhY3QgYXJyYXk8VD4oXG4gICAgICBjb250cm9sczogQXJyYXk8VD4sIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUFycmF5PMm1RWxlbWVudDxULCBuZXZlcj4+O1xuXG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGBGb3JtQnVpbGRlciNjb250cm9sYCwgZXhjZXB0IHRoaXMgb3ZlcnJpZGRlbiB2ZXJzaW9uIG9mIGBjb250cm9sYCBmb3JjZXNcbiAgICogYG5vbk51bGxhYmxlYCB0byBiZSBgdHJ1ZWAsIHJlc3VsdGluZyBpbiB0aGUgY29udHJvbCBhbHdheXMgYmVpbmcgbm9uLW51bGxhYmxlLlxuICAgKi9cbiAgYWJzdHJhY3QgY29udHJvbDxUPihcbiAgICAgIGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBGb3JtQ29udHJvbDxUPjtcbn1cblxuLyoqXG4gKiBVbnR5cGVkRm9ybUJ1aWxkZXIgaXMgdGhlIHNhbWUgYXMgYEZvcm1CdWlsZGVyYCwgYnV0IGl0IHByb3ZpZGVzIHVudHlwZWQgY29udHJvbHMuXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFVudHlwZWRGb3JtQnVpbGRlciBleHRlbmRzIEZvcm1CdWlsZGVyIHtcbiAgLyoqXG4gICAqIExpa2UgYEZvcm1CdWlsZGVyI2dyb3VwYCwgZXhjZXB0IHRoZSByZXN1bHRpbmcgZ3JvdXAgaXMgdW50eXBlZC5cbiAgICovXG4gIG92ZXJyaWRlIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9ucz86IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgICk6IFVudHlwZWRGb3JtR3JvdXA7XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFRoaXMgQVBJIGlzIG5vdCB0eXBlc2FmZSBhbmQgY2FuIHJlc3VsdCBpbiBpc3N1ZXMgd2l0aCBDbG9zdXJlIENvbXBpbGVyIHJlbmFtaW5nLlxuICAgKiBVc2UgdGhlIGBGb3JtQnVpbGRlciNncm91cGAgb3ZlcmxvYWQgd2l0aCBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgaW5zdGVhZC5cbiAgICovXG4gIG92ZXJyaWRlIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICApOiBVbnR5cGVkRm9ybUdyb3VwO1xuXG4gIG92ZXJyaWRlIGdyb3VwKFxuICAgICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsID0gbnVsbCk6IFVudHlwZWRGb3JtR3JvdXAge1xuICAgIHJldHVybiBzdXBlci5ncm91cChjb250cm9sc0NvbmZpZywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTGlrZSBgRm9ybUJ1aWxkZXIjY29udHJvbGAsIGV4Y2VwdCB0aGUgcmVzdWx0aW5nIGNvbnRyb2wgaXMgdW50eXBlZC5cbiAgICovXG4gIG92ZXJyaWRlIGNvbnRyb2woXG4gICAgICBmb3JtU3RhdGU6IGFueSwgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxGb3JtQ29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IFVudHlwZWRGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIHN1cGVyLmNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWtlIGBGb3JtQnVpbGRlciNhcnJheWAsIGV4Y2VwdCB0aGUgcmVzdWx0aW5nIGFycmF5IGlzIHVudHlwZWQuXG4gICAqL1xuICBvdmVycmlkZSBhcnJheShcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiBhbnlbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogVW50eXBlZEZvcm1BcnJheSB7XG4gICAgcmV0dXJuIHN1cGVyLmFycmF5KGNvbnRyb2xzQ29uZmlnLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxufVxuIl19