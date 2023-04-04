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
class FormBuilder {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: FormBuilder, providedIn: 'root' }); }
}
export { FormBuilder };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: FormBuilder, decorators: [{
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
class NonNullableFormBuilder {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: NonNullableFormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: NonNullableFormBuilder, providedIn: 'root', useFactory: () => inject(FormBuilder).nonNullable }); }
}
export { NonNullableFormBuilder };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: NonNullableFormBuilder, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                    useFactory: () => inject(FormBuilder).nonNullable,
                }]
        }] });
/**
 * UntypedFormBuilder is the same as `FormBuilder`, but it provides untyped controls.
 */
class UntypedFormBuilder extends FormBuilder {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: UntypedFormBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: UntypedFormBuilder, providedIn: 'root' }); }
}
export { UntypedFormBuilder };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.6+sha-4b673d5", ngImport: i0, type: UntypedFormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUdqRCxPQUFPLEVBQUMsZUFBZSxFQUFvQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFGLE9BQU8sRUFBQyxTQUFTLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUFDLFdBQVcsRUFBMkQsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRyxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBbUIsTUFBTSxvQkFBb0IsQ0FBQzs7QUFFM0UsU0FBUyx3QkFBd0IsQ0FBQyxPQUNTO0lBQ3pDLE9BQU8sQ0FBQyxDQUFDLE9BQU87UUFDWixDQUFFLE9BQWtDLENBQUMsZUFBZSxLQUFLLFNBQVM7WUFDaEUsT0FBa0MsQ0FBQyxVQUFVLEtBQUssU0FBUztZQUMzRCxPQUFrQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBK0VELGtCQUFrQjtBQUVsQjs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQ2EsV0FBVztJQUR4QjtRQUVVLG1CQUFjLEdBQVksS0FBSyxDQUFDO0tBMlB6QztJQXpQQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F5Q0c7SUFDSCxJQUFJLFdBQVc7UUFDYixNQUFNLElBQUksR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLE9BQU8sSUFBOEIsQ0FBQztJQUN4QyxDQUFDO0lBa0RELEtBQUssQ0FBQyxRQUE4QixFQUFFLFVBQ2lELElBQUk7UUFFekYsTUFBTSxlQUFlLEdBQUcsSUFBSSxD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TyxDQUNaLFNBQWMsRUFBRSxlQUFtRSxFQUNuRixjQUF5RDtRQUMzRCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQ7O09BRUc7SUFDTSxLQUFLLENBQ1YsY0FBcUIsRUFDckIsZUFBdUUsRUFDdkUsY0FBeUQ7UUFDM0QsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDdEUsQ0FBQzt5SEF6Q1Usa0JBQWtCOzZIQUFsQixrQkFBa0IsY0FETixNQUFNOztTQUNsQixrQkFBa0I7c0dBQWxCLGtCQUFrQjtrQkFEOUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQWJzdHJhY3RDb250cm9sT3B0aW9ucywgRm9ybUhvb2tzfSBmcm9tICcuL21vZGVsL2Fic3RyYWN0X21vZGVsJztcbmltcG9ydCB7Rm9ybUFycmF5LCBVbnR5cGVkRm9ybUFycmF5fSBmcm9tICcuL21vZGVsL2Zvcm1fYXJyYXknO1xuaW1wb3J0IHtGb3JtQ29udHJvbCwgRm9ybUNvbnRyb2xPcHRpb25zLCBGb3JtQ29udHJvbFN0YXRlLCBVbnR5cGVkRm9ybUNvbnRyb2x9IGZyb20gJy4vbW9kZWwvZm9ybV9jb250cm9sJztcbmltcG9ydCB7Rm9ybUdyb3VwLCBGb3JtUmVjb3JkLCBVbnR5cGVkRm9ybUdyb3VwfSBmcm9tICcuL21vZGVsL2Zvcm1fZ3JvdXAnO1xuXG5mdW5jdGlvbiBpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnMob3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTogYW55fXxudWxsfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk6IG9wdGlvbnMgaXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIHJldHVybiAhIW9wdGlvbnMgJiZcbiAgICAgICgob3B0aW9ucyBhcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zKS5hc3luY1ZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgIChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgIChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnVwZGF0ZU9uICE9PSB1bmRlZmluZWQpO1xufVxuXG4vLyBTb21ldGltZXMgd2UgbWlnaHQgbmVlZCB0aGlzIGJhc2Ugc2lnbmF0dXJlIGZvciBWYWxpZGF0b3JGbiBiZWNhdXNlIG9mIGNvbXBpbGVyIGxpbWl0YXRpb25zXG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8zMjYwOFxuZXhwb3J0IGludGVyZmFjZSBVbnNhZmVWYWxpZGF0b3JGbiB7XG4gIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGw7XG59XG5cbi8qKlxuICogVGhlIHVuaW9uIG9mIGFsbCB2YWxpZGF0b3IgdHlwZXMgdGhhdCBjYW4gYmUgYWNjZXB0ZWQgYnkgYSBDb250cm9sQ29uZmlnLlxuICovXG5cbnR5cGUgVmFsaWRhdG9yQ29uZmlnID0gVW5zYWZlVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbnxVbnNhZmVWYWxpZGF0b3JGbltdfEFzeW5jVmFsaWRhdG9yRm5bXTtcblxuLyoqXG4gKiBUaGUgY29tcGlsZXIgbWF5IG5vdCBhbHdheXMgYmUgYWJsZSB0byBwcm92ZSB0aGF0IHRoZSBlbGVtZW50cyBvZiB0aGUgY29udHJvbCBjb25maWcgYXJlIGEgdHVwbGVcbiAqIChpLmUuIG9jY3VyIGluIGEgZml4ZWQgb3JkZXIpLiBUaGlzIHNsaWdodGx5IGxvb3NlciB0eXBlIGlzIHVzZWQgZm9yIGluZmVyZW5jZSwgdG8gY2F0Y2ggY2FzZXNcbiAqIHdoZXJlIHRoZSBjb21waWxlciBjYW5ub3QgcHJvdmUgb3JkZXIgYW5kIHBvc2l0aW9uLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGUgc2ltcGxlIGNhc2UgYGZiLmdyb3VwKHtmb286IFsnYmFyJywgVmFsaWRhdG9ycy5yZXF1aXJlZF19KWAuIFRoZVxuICogY29tcGlsZXIgd2lsbCBpbmZlciB0aGlzIGFzIGFuIGFycmF5LCBub3QgYXMgYSB0dXBsZS5cbiAqL1xudHlwZSBQZXJtaXNzaXZlQ29udHJvbENvbmZpZzxUPiA9IEFycmF5PFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPnxWYWxpZGF0b3JDb25maWc+O1xuXG4vKipcbiAqIEhlbHBlciB0eXBlIHRvIGFsbG93IHRoZSBjb21waWxlciB0byBhY2NlcHQgW1hYWFgsIHsgdXBkYXRlT246IHN0cmluZyB9XSBhcyBhIHZhbGlkIHNob3J0aGFuZFxuICogYXJndW1lbnQgZm9yIC5ncm91cCgpXG4gKi9cbmludGVyZmFjZSBQZXJtaXNzaXZlQWJzdHJhY3RDb250cm9sT3B0aW9ucyBleHRlbmRzIE9taXQ8QWJzdHJhY3RDb250cm9sT3B0aW9ucywgJ3VwZGF0ZU9uJz4ge1xuICB1cGRhdGVPbj86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb250cm9sQ29uZmlnPFQ+IGlzIGEgdHVwbGUgY29udGFpbmluZyBhIHZhbHVlIG9mIHR5cGUgVCwgcGx1cyBvcHRpb25hbCB2YWxpZGF0b3JzIGFuZCBhc3luY1xuICogdmFsaWRhdG9ycy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIENvbnRyb2xDb25maWc8VD4gPSBbVHxGb3JtQ29udHJvbFN0YXRlPFQ+LCAoVmFsaWRhdG9yRm58KFZhbGlkYXRvckZuW10pKT8sIChBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXSk/XTtcblxuLy8gRGlzYWJsZSBjbGFuZy1mb3JtYXQgdG8gcHJvZHVjZSBjbGVhcmVyIGZvcm1hdHRpbmcgZm9yIHRoaXMgbXVsdGlsaW5lIHR5cGUuXG4vLyBjbGFuZy1mb3JtYXQgb2ZmXG5cbi8qKlxuICogRm9ybUJ1aWxkZXIgYWNjZXB0cyB2YWx1ZXMgaW4gdmFyaW91cyBjb250YWluZXIgc2hhcGVzLCBhcyB3ZWxsIGFzIHJhdyB2YWx1ZXMuXG4gKiBFbGVtZW50IHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIGNvcnJlc3BvbmRpbmcgbW9kZWwgY2xhc3MsIGdpdmVuIHRoZSBjb250YWluZXIgVC5cbiAqIFRoZSBmbGFnIE4sIGlmIG5vdCBuZXZlciwgbWFrZXMgdGhlIHJlc3VsdGluZyBgRm9ybUNvbnRyb2xgIGhhdmUgTiBpbiBpdHMgdHlwZS5cbiAqL1xuZXhwb3J0IHR5cGUgybVFbGVtZW50PFQsIE4gZXh0ZW5kcyBudWxsPiA9XG4gIC8vIFRoZSBgZXh0ZW5kc2AgY2hlY2tzIGFyZSB3cmFwcGVkIGluIGFycmF5cyBpbiBvcmRlciB0byBwcmV2ZW50IFR5cGVTY3JpcHQgZnJvbSBhcHBseWluZyB0eXBlIHVuaW9uc1xuICAvLyB0aHJvdWdoIHRoZSBkaXN0cmlidXRpdmUgY29uZGl0aW9uYWwgdHlwZS4gVGhpcyBpcyB0aGUgb2ZmaWNpYWxseSByZWNvbW1lbmRlZCBzb2x1dGlvbjpcbiAgLy8gaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svMi9jb25kaXRpb25hbC10eXBlcy5odG1sI2Rpc3RyaWJ1dGl2ZS1jb25kaXRpb25hbC10eXBlc1xuICAvL1xuICAvLyBJZGVudGlmeSBGb3JtQ29udHJvbCBjb250YWluZXIgdHlwZXMuXG4gIFtUXSBleHRlbmRzIFtGb3JtQ29udHJvbDxpbmZlciBVPl0gPyBGb3JtQ29udHJvbDxVPiA6XG4gIC8vIE9yIEZvcm1Db250cm9sIGNvbnRhaW5lcnMgdGhhdCBhcmUgb3B0aW9uYWwgaW4gdGhlaXIgcGFyZW50IGdyb3VwLlxuICBbVF0gZXh0ZW5kcyBbRm9ybUNvbnRyb2w8aW5mZXIgVT58dW5kZWZpbmVkXSA/IEZvcm1Db250cm9sPFU+IDpcbiAgLy8gRm9ybUdyb3VwIGNvbnRhaW5lcnMuXG4gIFtUXSBleHRlbmRzIFtGb3JtR3JvdXA8aW5mZXIgVT5dID8gRm9ybUdyb3VwPFU+IDpcbiAgLy8gT3B0aW9uYWwgRm9ybUdyb3VwIGNvbnRhaW5lcnMuXG4gIFtUXSBleHRlbmRzIFtGb3JtR3JvdXA8aW5mZXIgVT58dW5kZWZpbmVkXSA/IEZvcm1Hcm91cDxVPiA6XG4gIC8vIEZvcm1SZWNvcmQgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Zvcm1SZWNvcmQ8aW5mZXIgVT5dID8gRm9ybVJlY29yZDxVPiA6XG4gIC8vIE9wdGlvbmFsIEZvcm1SZWNvcmQgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Zvcm1SZWNvcmQ8aW5mZXIgVT58dW5kZWZpbmVkXSA/IEZvcm1SZWNvcmQ8VT4gOlxuICAvLyBGb3JtQXJyYXkgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Zvcm1BcnJheTxpbmZlciBVPl0gPyBGb3JtQXJyYXk8VT4gOlxuICAvLyBPcHRpb25hbCBGb3JtQXJyYXkgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Zvcm1BcnJheTxpbmZlciBVPnx1bmRlZmluZWRdID8gRm9ybUFycmF5PFU+IDpcbiAgLy8gT3RoZXJ3aXNlIHVua25vd24gQWJzdHJhY3RDb250cm9sIGNvbnRhaW5lcnMuXG4gIFtUXSBleHRlbmRzIFtBYnN0cmFjdENvbnRyb2w8aW5mZXIgVT5dID8gQWJzdHJhY3RDb250cm9sPFU+IDpcbiAgLy8gT3B0aW9uYWwgQWJzdHJhY3RDb250cm9sIGNvbnRhaW5lcnMuXG4gIFtUXSBleHRlbmRzIFtBYnN0cmFjdENvbnRyb2w8aW5mZXIgVT58dW5kZWZpbmVkXSA/IEFic3RyYWN0Q29udHJvbDxVPiA6XG4gIC8vIEZvcm1Db250cm9sU3RhdGUgb2JqZWN0IGNvbnRhaW5lciwgd2hpY2ggcHJvZHVjZXMgYSBudWxsYWJsZSBjb250cm9sLlxuICBbVF0gZXh0ZW5kcyBbRm9ybUNvbnRyb2xTdGF0ZTxpbmZlciBVPl0gPyBGb3JtQ29udHJvbDxVfE4+IDpcbiAgLy8gQSBDb250cm9sQ29uZmlnIHR1cGxlLCB3aGljaCBwcm9kdWNlcyBhIG51bGxhYmxlIGNvbnRyb2wuXG4gIFtUXSBleHRlbmRzIFtQZXJtaXNzaXZlQ29udHJvbENvbmZpZzxpbmZlciBVPl0gPyBGb3JtQ29udHJvbDxFeGNsdWRlPFUsIFZhbGlkYXRvckNvbmZpZ3wgUGVybWlzc2l2ZUFic3RyYWN0Q29udHJvbE9wdGlvbnM+fE4+IDpcbiAgRm9ybUNvbnRyb2w8VHxOPjtcblxuLy8gY2xhbmctZm9ybWF0IG9uXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGFuIGBBYnN0cmFjdENvbnRyb2xgIGZyb20gYSB1c2VyLXNwZWNpZmllZCBjb25maWd1cmF0aW9uLlxuICpcbiAqIFRoZSBgRm9ybUJ1aWxkZXJgIHByb3ZpZGVzIHN5bnRhY3RpYyBzdWdhciB0aGF0IHNob3J0ZW5zIGNyZWF0aW5nIGluc3RhbmNlcyBvZiBhXG4gKiBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgb3IgYEZvcm1BcnJheWAuIEl0IHJlZHVjZXMgdGhlIGFtb3VudCBvZiBib2lsZXJwbGF0ZSBuZWVkZWQgdG9cbiAqIGJ1aWxkIGNvbXBsZXggZm9ybXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgRm9ybUJ1aWxkZXIge1xuICBwcml2YXRlIHVzZU5vbk51bGxhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIGEgRm9ybUJ1aWxkZXIgaW4gd2hpY2ggYXV0b21hdGljYWxseSBjb25zdHJ1Y3RlZCBgRm9ybUNvbnRyb2xgIGVsZW1lbnRzXG4gICAqIGhhdmUgYHtub25OdWxsYWJsZTogdHJ1ZX1gIGFuZCBhcmUgbm9uLW51bGxhYmxlLlxuICAgKlxuICAgKiAqKkNvbnN0cnVjdGluZyBub24tbnVsbGFibGUgY29udHJvbHMqKlxuICAgKlxuICAgKiBXaGVuIGNvbnN0cnVjdGluZyBhIGNvbnRyb2wsIGl0IHdpbGwgYmUgbm9uLW51bGxhYmxlLCBhbmQgd2lsbCByZXNldCB0byBpdHMgaW5pdGlhbCB2YWx1ZS5cbiAgICpcbiAgICogYGBgdHNcbiAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICogbGV0IG5hbWUgPSBubmZiLmNvbnRyb2woJ0FsZXgnKTsgLy8gRm9ybUNvbnRyb2w8c3RyaW5nPlxuICAgKiBuYW1lLnJlc2V0KCk7XG4gICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyAnQWxleCdcbiAgICogYGBgXG4gICAqXG4gICAqICoqQ29uc3RydWN0aW5nIG5vbi1udWxsYWJsZSBncm91cHMgb3IgYXJyYXlzKipcbiAgICpcbiAgICogV2hlbiBjb25zdHJ1Y3RpbmcgYSBncm91cCBvciBhcnJheSwgYWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpbm5lciBjb250cm9scyB3aWxsIGJlXG4gICAqIG5vbi1udWxsYWJsZSwgYW5kIHdpbGwgcmVzZXQgdG8gdGhlaXIgaW5pdGlhbCB2YWx1ZXMuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAqIGxldCBuYW1lID0gbm5mYi5ncm91cCh7d2hvOiAnQWxleCd9KTsgLy8gRm9ybUdyb3VwPHt3aG86IEZvcm1Db250cm9sPHN0cmluZz59PlxuICAgKiBuYW1lLnJlc2V0KCk7XG4gICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyB7d2hvOiAnQWxleCd9XG4gICAqIGBgYFxuICAgKiAqKkNvbnN0cnVjdGluZyAqbnVsbGFibGUqIGZpZWxkcyBvbiBncm91cHMgb3IgYXJyYXlzKipcbiAgICpcbiAgICogSXQgaXMgc3RpbGwgcG9zc2libGUgdG8gaGF2ZSBhIG51bGxhYmxlIGZpZWxkLiBJbiBwYXJ0aWN1bGFyLCBhbnkgYEZvcm1Db250cm9sYCB3aGljaCBpc1xuICAgKiAqYWxyZWFkeSogY29uc3RydWN0ZWQgd2lsbCBub3QgYmUgYWx0ZXJlZC4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAqIC8vIEZvcm1Hcm91cDx7d2hvOiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD59PlxuICAgKiBsZXQgbmFtZSA9IG5uZmIuZ3JvdXAoe3dobzogbmV3IEZvcm1Db250cm9sKCdBbGV4Jyl9KTtcbiAgICogbmFtZS5yZXNldCgpOyBjb25zb2xlLmxvZyhuYW1lKTsgLy8ge3dobzogbnVsbH1cbiAgICogYGBgXG4gICAqXG4gICAqIEJlY2F1c2UgdGhlIGlubmVyIGNvbnRyb2wgaXMgY29uc3RydWN0ZWQgZXhwbGljaXRseSBieSB0aGUgY2FsbGVyLCB0aGUgYnVpbGRlciBoYXNcbiAgICogbm8gY29udHJvbCBvdmVyIGhvdyBpdCBpcyBjcmVhdGVkLCBhbmQgY2Fubm90IGV4Y2x1ZGUgdGhlIGBudWxsYC5cbiAgICovXG4gIGdldCBub25OdWxsYWJsZSgpOiBOb25OdWxsYWJsZUZvcm1CdWlsZGVyIHtcbiAgICBjb25zdCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCk7XG4gICAgbm5mYi51c2VOb25OdWxsYWJsZSA9IHRydWU7XG4gICAgcmV0dXJuIG5uZmIgYXMgTm9uTnVsbGFibGVGb3JtQnVpbGRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0cyBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyBhbGwgdGhlIGtleXMgYW5kIGNvcnJlc3BvbmRpbmcgaW5uZXIgY29udHJvbCB0eXBlcy5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1Hcm91cGAuIFRoZSBvYmplY3Qgc2hvdWxkIGhhdmUgdGhlXG4gICAqIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCB0eXBlIGFuZCBtaWdodCBjb250YWluIHRoZSBmb2xsb3dpbmcgZmllbGRzOlxuICAgKiAqIGB2YWxpZGF0b3JzYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYGFzeW5jVmFsaWRhdG9yc2A6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKiAqIGB1cGRhdGVPbmA6IFRoZSBldmVudCB1cG9uIHdoaWNoIHRoZSBjb250cm9sIHNob3VsZCBiZSB1cGRhdGVkIChvcHRpb25zOiAnY2hhbmdlJyB8ICdibHVyJ1xuICAgKiB8IHN1Ym1pdCcpLlxuICAgKi9cbiAgZ3JvdXA8VCBleHRlbmRzIHt9PihcbiAgICAgIGNvbnRyb2xzOiBULFxuICAgICAgb3B0aW9ucz86IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgICk6IEZvcm1Hcm91cDx7W0sgaW4ga2V5b2YgVF06IMm1RWxlbWVudDxUW0tdLCBudWxsPn0+O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0cyBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaXMgbm90IHR5cGVzYWZlIGFuZCBjYW4gcmVzdWx0IGluIGlzc3VlcyB3aXRoIENsb3N1cmUgQ29tcGlsZXIgcmVuYW1pbmcuXG4gICAqIFVzZSB0aGUgYEZvcm1CdWlsZGVyI2dyb3VwYCBvdmVybG9hZCB3aXRoIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBpbnN0ZWFkLlxuICAgKiBOb3RlIHRoYXQgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGV4cGVjdHMgYHZhbGlkYXRvcnNgIGFuZCBgYXN5bmNWYWxpZGF0b3JzYCB0byBiZSB2YWxpZFxuICAgKiB2YWxpZGF0b3JzLiBJZiB5b3UgaGF2ZSBjdXN0b20gdmFsaWRhdG9ycywgbWFrZSBzdXJlIHRoZWlyIHZhbGlkYXRpb24gZnVuY3Rpb24gcGFyYW1ldGVyIGlzXG4gICAqIGBBYnN0cmFjdENvbnRyb2xgIGFuZCBub3QgYSBzdWItY2xhc3MsIHN1Y2ggYXMgYEZvcm1Hcm91cGAuIFRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZFxuICAgKiB3aXRoIGFuIG9iamVjdCBvZiB0eXBlIGBBYnN0cmFjdENvbnRyb2xgIGFuZCB0aGF0IGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IGRvd25jYXN0IHRvIGFcbiAgICogc3ViY2xhc3MsIHNvIFR5cGVTY3JpcHQgc2VlcyB0aGlzIGFzIGFuIGVycm9yLiBGb3IgZXhhbXBsZSwgY2hhbmdlIHRoZSBgKGdyb3VwOiBGb3JtR3JvdXApID0+XG4gICAqIFZhbGlkYXRpb25FcnJvcnN8bnVsbGAgc2lnbmF0dXJlIHRvIGJlIGAoZ3JvdXA6IEFic3RyYWN0Q29udHJvbCkgPT4gVmFsaWRhdGlvbkVycm9yc3xudWxsYC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEEgcmVjb3JkIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIHRoZSBjb250cm9sIGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIGxlZ2FjeSBjb25maWd1cmF0aW9uXG4gICAqIG9iamVjdCBjb25zaXN0cyBvZjpcbiAgICogKiBgdmFsaWRhdG9yYDogQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYGFzeW5jVmFsaWRhdG9yYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogTm90ZTogdGhlIGxlZ2FjeSBmb3JtYXQgaXMgZGVwcmVjYXRlZCBhbmQgbWlnaHQgYmUgcmVtb3ZlZCBpbiBvbmUgb2YgdGhlIG5leHQgbWFqb3IgdmVyc2lvbnNcbiAgICogb2YgQW5ndWxhci5cbiAgICovXG4gIGdyb3VwKFxuICAgICAgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgb3B0aW9uczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICApOiBGb3JtR3JvdXA7XG5cbiAgZ3JvdXAoY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfHtba2V5OiBzdHJpbmddOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbnl9fG51bGwgPSBudWxsKTpcbiAgICAgIEZvcm1Hcm91cCB7XG4gICAgY29uc3QgcmVkdWNlZENvbnRyb2xzID0gdGhpcy5fcmVkdWNlQ29udHJvbHMoY29udHJvbHMpO1xuICAgIGxldCBuZXdPcHRpb25zOiBGb3JtQ29udHJvbE9wdGlvbnMgPSB7fTtcbiAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAvLyBgb3B0aW9uc2AgYXJlIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYFxuICAgICAgbmV3T3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAvLyBgb3B0aW9uc2AgYXJlIGxlZ2FjeSBmb3JtIGdyb3VwIG9wdGlvbnNcbiAgICAgIG5ld09wdGlvbnMudmFsaWRhdG9ycyA9IChvcHRpb25zIGFzIGFueSkudmFsaWRhdG9yO1xuICAgICAgbmV3T3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgPSAob3B0aW9ucyBhcyBhbnkpLmFzeW5jVmFsaWRhdG9yO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZvcm1Hcm91cChyZWR1Y2VkQ29udHJvbHMsIG5ld09wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtUmVjb3JkYCBpbnN0YW5jZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyBhbGwgdGhlIGtleXMgYW5kIGNvcnJlc3BvbmRpbmcgaW5uZXIgY29udHJvbCB0eXBlcy5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1SZWNvcmRgLiBUaGUgb2JqZWN0IHNob3VsZCBoYXZlIHRoZVxuICAgKiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgdHlwZSBhbmQgbWlnaHQgY29udGFpbiB0aGUgZm9sbG93aW5nIGZpZWxkczpcbiAgICogKiBgdmFsaWRhdG9yc2A6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKiAqIGBhc3luY1ZhbGlkYXRvcnNgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgdXBkYXRlT25gOiBUaGUgZXZlbnQgdXBvbiB3aGljaCB0aGUgY29udHJvbCBzaG91bGQgYmUgdXBkYXRlZCAob3B0aW9uczogJ2NoYW5nZScgfCAnYmx1cidcbiAgICogfCBzdWJtaXQnKS5cbiAgICovXG4gIHJlY29yZDxUPihjb250cm9sczoge1trZXk6IHN0cmluZ106IFR9LCBvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwgPSBudWxsKTpcbiAgICAgIEZvcm1SZWNvcmQ8ybVFbGVtZW50PFQsIG51bGw+PiB7XG4gICAgY29uc3QgcmVkdWNlZENvbnRyb2xzID0gdGhpcy5fcmVkdWNlQ29udHJvbHMoY29udHJvbHMpO1xuICAgIC8vIENhc3QgdG8gYGFueWAgYmVjYXVzZSB0aGUgaW5mZXJyZWQgdHlwZXMgYXJlIG5vdCBhcyBzcGVjaWZpYyBhcyBFbGVtZW50LlxuICAgIHJldHVybiBuZXcgRm9ybVJlY29yZChyZWR1Y2VkQ29udHJvbHMsIG9wdGlvbnMpIGFzIGFueTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYG5vbk51bGxhYmxlYCBpbnN0ZWFkLiAqL1xuICBjb250cm9sPFQ+KGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LCBvcHRzOiBGb3JtQ29udHJvbE9wdGlvbnMme1xuICAgIGluaXRpYWxWYWx1ZUlzRGVmYXVsdDogdHJ1ZVxuICB9KTogRm9ybUNvbnRyb2w8VD47XG5cbiAgY29udHJvbDxUPihmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPiwgb3B0czogRm9ybUNvbnRyb2xPcHRpb25zJntub25OdWxsYWJsZTogdHJ1ZX0pOlxuICAgICAgRm9ybUNvbnRyb2w8VD47XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFdoZW4gcGFzc2luZyBhbiBgb3B0aW9uc2AgYXJndW1lbnQsIHRoZSBgYXN5bmNWYWxpZGF0b3JgIGFyZ3VtZW50IGhhcyBubyBlZmZlY3QuXG4gICAqL1xuICBjb250cm9sPFQ+KFxuICAgICAgZm9ybVN0YXRlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4sIG9wdHM6IEZvcm1Db250cm9sT3B0aW9ucyxcbiAgICAgIGFzeW5jVmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXSk6IEZvcm1Db250cm9sPFR8bnVsbD47XG5cbiAgY29udHJvbDxUPihcbiAgICAgIGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxGb3JtQ29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1Db250cm9sPFR8bnVsbD47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtQ29udHJvbGAgd2l0aCB0aGUgZ2l2ZW4gc3RhdGUsIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuIFNldHNcbiAgICogYHtub25OdWxsYWJsZTogdHJ1ZX1gIGluIHRoZSBvcHRpb25zIHRvIGdldCBhIG5vbi1udWxsYWJsZSBjb250cm9sLiBPdGhlcndpc2UsIHRoZVxuICAgKiBjb250cm9sIHdpbGwgYmUgbnVsbGFibGUuIEFjY2VwdHMgYSBzaW5nbGUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggaXMgdGhlIHR5cGUgIG9mIHRoZVxuICAgKiBjb250cm9sJ3MgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgSW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHN0YXRlIHZhbHVlLCBvclxuICAgKiB3aXRoIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhIGBGb3JtQ29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3JcbiAgICogZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgSW5pdGlhbGl6ZSBhIGNvbnRyb2wgYXMgZGlzYWJsZWRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJldHVybnMgYSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSBpbiBhIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJmb3Jtcy90cy9mb3JtQnVpbGRlci9mb3JtX2J1aWxkZXJfZXhhbXBsZS50c1wiIHJlZ2lvbj1cImRpc2FibGVkLWNvbnRyb2xcIj5cbiAgICogPC9jb2RlLWV4YW1wbGU+XG4gICAqL1xuICBjb250cm9sPFQ+KFxuICAgICAgZm9ybVN0YXRlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEZvcm1Db250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2wge1xuICAgIGxldCBuZXdPcHRpb25zOiBGb3JtQ29udHJvbE9wdGlvbnMgPSB7fTtcbiAgICBpZiAoIXRoaXMudXNlTm9uTnVsbGFibGUpIHtcbiAgICAgIHJldHVybiBuZXcgRm9ybUNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgICB9XG4gICAgaWYgKGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyh2YWxpZGF0b3JPck9wdHMpKSB7XG4gICAgICAvLyBJZiB0aGUgc2Vjb25kIGFyZ3VtZW50IGlzIG9wdGlvbnMsIHRoZW4gdGhleSBhcmUgY29waWVkLlxuICAgICAgbmV3T3B0aW9ucyA9IHZhbGlkYXRvck9yT3B0cztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlIG90aGVyIGFyZ3VtZW50cyBhcmUgdmFsaWRhdG9ycywgdGhleSBhcmUgY29waWVkIGludG8gYW4gb3B0aW9ucyBvYmplY3QuXG4gICAgICBuZXdPcHRpb25zLnZhbGlkYXRvcnMgPSB2YWxpZGF0b3JPck9wdHM7XG4gICAgICBuZXdPcHRpb25zLmFzeW5jVmFsaWRhdG9ycyA9IGFzeW5jVmFsaWRhdG9yO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZvcm1Db250cm9sPFQ+KGZvcm1TdGF0ZSwgey4uLm5ld09wdGlvbnMsIG5vbk51bGxhYmxlOiB0cnVlfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBgRm9ybUFycmF5YCBmcm9tIHRoZSBnaXZlbiBhcnJheSBvZiBjb25maWd1cmF0aW9ucyxcbiAgICogdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyB0aGUgdHlwZSBvZiBlYWNoIGNvbnRyb2xcbiAgICogaW5zaWRlIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEFuIGFycmF5IG9mIGNoaWxkIGNvbnRyb2xzIG9yIGNvbnRyb2wgY29uZmlncy4gRWFjaCBjaGlsZCBjb250cm9sIGlzIGdpdmVuIGFuXG4gICAqICAgICBpbmRleCB3aGVuIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mIHN1Y2ggZnVuY3Rpb25zLCBvciBhblxuICAgKiAgICAgYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zXG4gICAqIHZhbGlkYXRpb24gZnVuY3Rpb25zIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKi9cbiAgYXJyYXk8VD4oXG4gICAgICBjb250cm9sczogQXJyYXk8VD4sIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUFycmF5PMm1RWxlbWVudDxULCBudWxsPj4ge1xuICAgIGNvbnN0IGNyZWF0ZWRDb250cm9scyA9IGNvbnRyb2xzLm1hcChjID0+IHRoaXMuX2NyZWF0ZUNvbnRyb2woYykpO1xuICAgIC8vIENhc3QgdG8gYGFueWAgYmVjYXVzZSB0aGUgaW5mZXJyZWQgdHlwZXMgYXJlIG5vdCBhcyBzcGVjaWZpYyBhcyBFbGVtZW50LlxuICAgIHJldHVybiBuZXcgRm9ybUFycmF5KGNyZWF0ZWRDb250cm9scywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcikgYXMgYW55O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVkdWNlQ29udHJvbHM8VD4oY29udHJvbHM6XG4gICAgICAgICAgICAgICAgICAgICAgICAge1trOiBzdHJpbmddOiBUfENvbnRyb2xDb25maWc8VD58Rm9ybUNvbnRyb2xTdGF0ZTxUPnxBYnN0cmFjdENvbnRyb2w8VD59KTpcbiAgICAgIHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9IHtcbiAgICBjb25zdCBjcmVhdGVkQ29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9ID0ge307XG4gICAgT2JqZWN0LmtleXMoY29udHJvbHMpLmZvckVhY2goY29udHJvbE5hbWUgPT4ge1xuICAgICAgY3JlYXRlZENvbnRyb2xzW2NvbnRyb2xOYW1lXSA9IHRoaXMuX2NyZWF0ZUNvbnRyb2woY29udHJvbHNbY29udHJvbE5hbWVdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY3JlYXRlZENvbnRyb2xzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY3JlYXRlQ29udHJvbDxUPihjb250cm9sczogVHxGb3JtQ29udHJvbFN0YXRlPFQ+fENvbnRyb2xDb25maWc8VD58Rm9ybUNvbnRyb2w8VD58XG4gICAgICAgICAgICAgICAgICAgIEFic3RyYWN0Q29udHJvbDxUPik6IEZvcm1Db250cm9sPFQ+fEZvcm1Db250cm9sPFR8bnVsbD58QWJzdHJhY3RDb250cm9sPFQ+IHtcbiAgICBpZiAoY29udHJvbHMgaW5zdGFuY2VvZiBGb3JtQ29udHJvbCkge1xuICAgICAgcmV0dXJuIGNvbnRyb2xzIGFzIEZvcm1Db250cm9sPFQ+O1xuICAgIH0gZWxzZSBpZiAoY29udHJvbHMgaW5zdGFuY2VvZiBBYnN0cmFjdENvbnRyb2wpIHsgIC8vIEEgY29udHJvbDsganVzdCByZXR1cm4gaXRcbiAgICAgIHJldHVybiBjb250cm9scztcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY29udHJvbHMpKSB7ICAvLyBDb250cm9sQ29uZmlnIFR1cGxlXG4gICAgICBjb25zdCB2YWx1ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+ID0gY29udHJvbHNbMF07XG4gICAgICBjb25zdCB2YWxpZGF0b3I6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCA9IGNvbnRyb2xzLmxlbmd0aCA+IDEgPyBjb250cm9sc1sxXSEgOiBudWxsO1xuICAgICAgY29uc3QgYXN5bmNWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwgPVxuICAgICAgICAgIGNvbnRyb2xzLmxlbmd0aCA+IDIgPyBjb250cm9sc1syXSEgOiBudWxsO1xuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbDxUPih2YWx1ZSwgdmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcik7XG4gICAgfSBlbHNlIHsgIC8vIFQgb3IgRm9ybUNvbnRyb2xTdGF0ZTxUPlxuICAgICAgcmV0dXJuIHRoaXMuY29udHJvbDxUPihjb250cm9scyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgTm9uTnVsbGFibGVGb3JtQnVpbGRlcmAgaXMgc2ltaWxhciB0byB7QGxpbmsgRm9ybUJ1aWxkZXJ9LCBidXQgYXV0b21hdGljYWxseSBjb25zdHJ1Y3RlZFxuICoge0BsaW5rIEZvcm1Db250cm9sfSBlbGVtZW50cyBoYXZlIGB7bm9uTnVsbGFibGU6IHRydWV9YCBhbmQgYXJlIG5vbi1udWxsYWJsZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICB1c2VGYWN0b3J5OiAoKSA9PiBpbmplY3QoRm9ybUJ1aWxkZXIpLm5vbk51bGxhYmxlLFxufSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOb25OdWxsYWJsZUZvcm1CdWlsZGVyIHtcbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8gYEZvcm1CdWlsZGVyI2dyb3VwYCwgZXhjZXB0IGFueSBpbXBsaWNpdGx5IGNvbnN0cnVjdGVkIGBGb3JtQ29udHJvbGBcbiAgICogd2lsbCBiZSBub24tbnVsbGFibGUgKGkuZS4gaXQgd2lsbCBoYXZlIGBub25OdWxsYWJsZWAgc2V0IHRvIHRydWUpLiBOb3RlXG4gICAqIHRoYXQgYWxyZWFkeS1jb25zdHJ1Y3RlZCBjb250cm9scyB3aWxsIG5vdCBiZSBhbHRlcmVkLlxuICAgKi9cbiAgYWJzdHJhY3QgZ3JvdXA8VCBleHRlbmRzIHt9PihcbiAgICAgIGNvbnRyb2xzOiBULFxuICAgICAgb3B0aW9ucz86IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgICk6IEZvcm1Hcm91cDx7W0sgaW4ga2V5b2YgVF06IMm1RWxlbWVudDxUW0tdLCBuZXZlcj59PjtcblxuICAvKipcbiAgICogU2ltaWxhciB0byBgRm9ybUJ1aWxkZXIjcmVjb3JkYCwgZXhjZXB0IGFueSBpbXBsaWNpdGx5IGNvbnN0cnVjdGVkIGBGb3JtQ29udHJvbGBcbiAgICogd2lsbCBiZSBub24tbnVsbGFibGUgKGkuZS4gaXQgd2lsbCBoYXZlIGBub25OdWxsYWJsZWAgc2V0IHRvIHRydWUpLiBOb3RlXG4gICAqIHRoYXQgYWxyZWFkeS1jb25zdHJ1Y3RlZCBjb250cm9scyB3aWxsIG5vdCBiZSBhbHRlcmVkLlxuICAgKi9cbiAgYWJzdHJhY3QgcmVjb3JkPFQ+KFxuICAgICAgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBUfSxcbiAgICAgIG9wdGlvbnM/OiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICApOiBGb3JtUmVjb3JkPMm1RWxlbWVudDxULCBuZXZlcj4+O1xuXG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGBGb3JtQnVpbGRlciNhcnJheWAsIGV4Y2VwdCBhbnkgaW1wbGljaXRseSBjb25zdHJ1Y3RlZCBgRm9ybUNvbnRyb2xgXG4gICAqIHdpbGwgYmUgbm9uLW51bGxhYmxlIChpLmUuIGl0IHdpbGwgaGF2ZSBgbm9uTnVsbGFibGVgIHNldCB0byB0cnVlKS4gTm90ZVxuICAgKiB0aGF0IGFscmVhZHktY29uc3RydWN0ZWQgY29udHJvbHMgd2lsbCBub3QgYmUgYWx0ZXJlZC5cbiAgICovXG4gIGFic3RyYWN0IGFycmF5PFQ+KFxuICAgICAgY29udHJvbHM6IEFycmF5PFQ+LCB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1BcnJheTzJtUVsZW1lbnQ8VCwgbmV2ZXI+PjtcblxuICAvKipcbiAgICogU2ltaWxhciB0byBgRm9ybUJ1aWxkZXIjY29udHJvbGAsIGV4Y2VwdCB0aGlzIG92ZXJyaWRkZW4gdmVyc2lvbiBvZiBgY29udHJvbGAgZm9yY2VzXG4gICAqIGBub25OdWxsYWJsZWAgdG8gYmUgYHRydWVgLCByZXN1bHRpbmcgaW4gdGhlIGNvbnRyb2wgYWx3YXlzIGJlaW5nIG5vbi1udWxsYWJsZS5cbiAgICovXG4gIGFic3RyYWN0IGNvbnRyb2w8VD4oXG4gICAgICBmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2w8VD47XG59XG5cbi8qKlxuICogVW50eXBlZEZvcm1CdWlsZGVyIGlzIHRoZSBzYW1lIGFzIGBGb3JtQnVpbGRlcmAsIGJ1dCBpdCBwcm92aWRlcyB1bnR5cGVkIGNvbnRyb2xzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBVbnR5cGVkRm9ybUJ1aWxkZXIgZXh0ZW5kcyBGb3JtQnVpbGRlciB7XG4gIC8qKlxuICAgKiBMaWtlIGBGb3JtQnVpbGRlciNncm91cGAsIGV4Y2VwdCB0aGUgcmVzdWx0aW5nIGdyb3VwIGlzIHVudHlwZWQuXG4gICAqL1xuICBvdmVycmlkZSBncm91cChcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM/OiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICApOiBVbnR5cGVkRm9ybUdyb3VwO1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBpcyBub3QgdHlwZXNhZmUgYW5kIGNhbiByZXN1bHQgaW4gaXNzdWVzIHdpdGggQ2xvc3VyZSBDb21waWxlciByZW5hbWluZy5cbiAgICogVXNlIHRoZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgIG92ZXJsb2FkIHdpdGggYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGluc3RlYWQuXG4gICAqL1xuICBvdmVycmlkZSBncm91cChcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgKTogVW50eXBlZEZvcm1Hcm91cDtcblxuICBvdmVycmlkZSBncm91cChcbiAgICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnN8e1trZXk6IHN0cmluZ106IGFueX18bnVsbCA9IG51bGwpOiBVbnR5cGVkRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gc3VwZXIuZ3JvdXAoY29udHJvbHNDb25maWcsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpa2UgYEZvcm1CdWlsZGVyI2NvbnRyb2xgLCBleGNlcHQgdGhlIHJlc3VsdGluZyBjb250cm9sIGlzIHVudHlwZWQuXG4gICAqL1xuICBvdmVycmlkZSBjb250cm9sKFxuICAgICAgZm9ybVN0YXRlOiBhbnksIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118Rm9ybUNvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBVbnR5cGVkRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiBzdXBlci5jb250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogTGlrZSBgRm9ybUJ1aWxkZXIjYXJyYXlgLCBleGNlcHQgdGhlIHJlc3VsdGluZyBhcnJheSBpcyB1bnR5cGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgYXJyYXkoXG4gICAgICBjb250cm9sc0NvbmZpZzogYW55W10sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IFVudHlwZWRGb3JtQXJyYXkge1xuICAgIHJldHVybiBzdXBlci5hcnJheShjb250cm9sc0NvbmZpZywgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gIH1cbn1cbiJdfQ==