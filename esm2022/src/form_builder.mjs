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
import { FormControl, } from './model/form_control';
import { FormGroup, FormRecord } from './model/form_group';
import * as i0 from "@angular/core";
function isAbstractControlOptions(options) {
    return (!!options &&
        (options.asyncValidators !== undefined ||
            options.validators !== undefined ||
            options.updateOn !== undefined));
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
 * @see [Reactive Forms Guide](guide/forms/reactive-forms)
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
        const createdControls = controls.map((c) => this._createControl(c));
        // Cast to `any` because the inferred types are not as specific as Element.
        return new FormArray(createdControls, validatorOrOpts, asyncValidator);
    }
    /** @internal */
    _reduceControls(controls) {
        const createdControls = {};
        Object.keys(controls).forEach((controlName) => {
            createdControls[controlName] = this._createControl(controls[controlName]);
        });
        return createdControls;
    }
    /** @internal */
    _createControl(controls) {
        if (controls instanceof FormControl) {
            return controls;
        }
        else if (controls instanceof AbstractControl) {
            // A control; just return it
            return controls;
        }
        else if (Array.isArray(controls)) {
            // ControlConfig Tuple
            const value = controls[0];
            const validator = controls.length > 1 ? controls[1] : null;
            const asyncValidator = controls.length > 2 ? controls[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else {
            // T or FormControlState<T>
            return this.control(controls);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: FormBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: FormBuilder, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: NonNullableFormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: NonNullableFormBuilder, providedIn: 'root', useFactory: () => inject(FormBuilder).nonNullable }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: NonNullableFormBuilder, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: UntypedFormBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: UntypedFormBuilder, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-rc.0+sha-4837621", ngImport: i0, type: UntypedFormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUdqRCxPQUFPLEVBQUMsZUFBZSxFQUFvQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFGLE9BQU8sRUFBQyxTQUFTLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUNMLFdBQVcsR0FJWixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFtQixNQUFNLG9CQUFvQixDQUFDOztBQUUzRSxTQUFTLHdCQUF3QixDQUMvQixPQUF5RTtJQUV6RSxPQUFPLENBQ0wsQ0FBQyxDQUFDLE9BQU87UUFDVCxDQUFFLE9BQWtDLENBQUMsZUFBZSxLQUFLLFNBQVM7WUFDL0QsT0FBa0MsQ0FBQyxVQUFVLEtBQUssU0FBUztZQUMzRCxPQUFrQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FDOUQsQ0FBQztBQUNKLENBQUM7QUEwRkQsa0JBQWtCO0FBRWxCOzs7Ozs7Ozs7OztHQVdHO0FBRUgsTUFBTSxPQUFPLFdBQVc7SUFEeEI7UUFFVSxtQkFBYyxHQUFZLEtBQUssQ0FBQztLQTJRekM7SUF6UUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BeUNHO0lBQ0gsSUFBSSxXQUFXO1FBQ2IsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixPQUFPLElBQThCLENBQUM7SUFDeEMsQ0FBQztJQStDRCxLQUFLLENBQ0gsUUFBOEIsRUFDOUIsVUFBZ0UsSUFBSTtRQUVwRSxNQUFN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b0MsRUFDcEMsVUFBZ0UsSUFBSTtRQUVwRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRztJQUNNLE9BQU8sQ0FDZCxTQUFjLEVBQ2QsZUFBeUUsRUFDekUsY0FBNkQ7UUFFN0QsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOztPQUVHO0lBQ00sS0FBSyxDQUNaLGNBQXFCLEVBQ3JCLGVBQTZFLEVBQzdFLGNBQTZEO1FBRTdELE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7eUhBN0NVLGtCQUFrQjs2SEFBbEIsa0JBQWtCLGNBRE4sTUFBTTs7c0dBQ2xCLGtCQUFrQjtrQkFEOUIsVUFBVTttQkFBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpbmplY3QsIEluamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQWJzdHJhY3RDb250cm9sT3B0aW9ucywgRm9ybUhvb2tzfSBmcm9tICcuL21vZGVsL2Fic3RyYWN0X21vZGVsJztcbmltcG9ydCB7Rm9ybUFycmF5LCBVbnR5cGVkRm9ybUFycmF5fSBmcm9tICcuL21vZGVsL2Zvcm1fYXJyYXknO1xuaW1wb3J0IHtcbiAgRm9ybUNvbnRyb2wsXG4gIEZvcm1Db250cm9sT3B0aW9ucyxcbiAgRm9ybUNvbnRyb2xTdGF0ZSxcbiAgVW50eXBlZEZvcm1Db250cm9sLFxufSBmcm9tICcuL21vZGVsL2Zvcm1fY29udHJvbCc7XG5pbXBvcnQge0Zvcm1Hcm91cCwgRm9ybVJlY29yZCwgVW50eXBlZEZvcm1Hcm91cH0gZnJvbSAnLi9tb2RlbC9mb3JtX2dyb3VwJztcblxuZnVuY3Rpb24gaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKFxuICBvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwge1trZXk6IHN0cmluZ106IGFueX0gfCBudWxsIHwgdW5kZWZpbmVkLFxuKTogb3B0aW9ucyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuIChcbiAgICAhIW9wdGlvbnMgJiZcbiAgICAoKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykuYXN5bmNWYWxpZGF0b3JzICE9PSB1bmRlZmluZWQgfHxcbiAgICAgIChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnZhbGlkYXRvcnMgIT09IHVuZGVmaW5lZCB8fFxuICAgICAgKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudXBkYXRlT24gIT09IHVuZGVmaW5lZClcbiAgKTtcbn1cblxuLyoqXG4gKiBUaGUgdW5pb24gb2YgYWxsIHZhbGlkYXRvciB0eXBlcyB0aGF0IGNhbiBiZSBhY2NlcHRlZCBieSBhIENvbnRyb2xDb25maWcuXG4gKi9cbnR5cGUgVmFsaWRhdG9yQ29uZmlnID0gVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IEFzeW5jVmFsaWRhdG9yRm5bXTtcblxuLyoqXG4gKiBUaGUgY29tcGlsZXIgbWF5IG5vdCBhbHdheXMgYmUgYWJsZSB0byBwcm92ZSB0aGF0IHRoZSBlbGVtZW50cyBvZiB0aGUgY29udHJvbCBjb25maWcgYXJlIGEgdHVwbGVcbiAqIChpLmUuIG9jY3VyIGluIGEgZml4ZWQgb3JkZXIpLiBUaGlzIHNsaWdodGx5IGxvb3NlciB0eXBlIGlzIHVzZWQgZm9yIGluZmVyZW5jZSwgdG8gY2F0Y2ggY2FzZXNcbiAqIHdoZXJlIHRoZSBjb21waWxlciBjYW5ub3QgcHJvdmUgb3JkZXIgYW5kIHBvc2l0aW9uLlxuICpcbiAqIEZvciBleGFtcGxlLCBjb25zaWRlciB0aGUgc2ltcGxlIGNhc2UgYGZiLmdyb3VwKHtmb286IFsnYmFyJywgVmFsaWRhdG9ycy5yZXF1aXJlZF19KWAuIFRoZVxuICogY29tcGlsZXIgd2lsbCBpbmZlciB0aGlzIGFzIGFuIGFycmF5LCBub3QgYXMgYSB0dXBsZS5cbiAqL1xudHlwZSBQZXJtaXNzaXZlQ29udHJvbENvbmZpZzxUPiA9IEFycmF5PFQgfCBGb3JtQ29udHJvbFN0YXRlPFQ+IHwgVmFsaWRhdG9yQ29uZmlnPjtcblxuLyoqXG4gKiBIZWxwZXIgdHlwZSB0byBhbGxvdyB0aGUgY29tcGlsZXIgdG8gYWNjZXB0IFtYWFhYLCB7IHVwZGF0ZU9uOiBzdHJpbmcgfV0gYXMgYSB2YWxpZCBzaG9ydGhhbmRcbiAqIGFyZ3VtZW50IGZvciAuZ3JvdXAoKVxuICovXG5pbnRlcmZhY2UgUGVybWlzc2l2ZUFic3RyYWN0Q29udHJvbE9wdGlvbnMgZXh0ZW5kcyBPbWl0PEFic3RyYWN0Q29udHJvbE9wdGlvbnMsICd1cGRhdGVPbic+IHtcbiAgdXBkYXRlT24/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogQ29udHJvbENvbmZpZzxUPiBpcyBhIHR1cGxlIGNvbnRhaW5pbmcgYSB2YWx1ZSBvZiB0eXBlIFQsIHBsdXMgb3B0aW9uYWwgdmFsaWRhdG9ycyBhbmQgYXN5bmNcbiAqIHZhbGlkYXRvcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBDb250cm9sQ29uZmlnPFQ+ID0gW1xuICBUIHwgRm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgKFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSk/LFxuICAoQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSk/LFxuXTtcblxuLy8gRGlzYWJsZSBjbGFuZy1mb3JtYXQgdG8gcHJvZHVjZSBjbGVhcmVyIGZvcm1hdHRpbmcgZm9yIHRoaXMgbXVsdGlsaW5lIHR5cGUuXG4vLyBjbGFuZy1mb3JtYXQgb2ZmXG5cbi8qKlxuICogRm9ybUJ1aWxkZXIgYWNjZXB0cyB2YWx1ZXMgaW4gdmFyaW91cyBjb250YWluZXIgc2hhcGVzLCBhcyB3ZWxsIGFzIHJhdyB2YWx1ZXMuXG4gKiBFbGVtZW50IHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIGNvcnJlc3BvbmRpbmcgbW9kZWwgY2xhc3MsIGdpdmVuIHRoZSBjb250YWluZXIgVC5cbiAqIFRoZSBmbGFnIE4sIGlmIG5vdCBuZXZlciwgbWFrZXMgdGhlIHJlc3VsdGluZyBgRm9ybUNvbnRyb2xgIGhhdmUgTiBpbiBpdHMgdHlwZS5cbiAqL1xuZXhwb3J0IHR5cGUgybVFbGVtZW50PFQsIE4gZXh0ZW5kcyBudWxsPiA9XG4gIC8vIFRoZSBgZXh0ZW5kc2AgY2hlY2tzIGFyZSB3cmFwcGVkIGluIGFycmF5cyBpbiBvcmRlciB0byBwcmV2ZW50IFR5cGVTY3JpcHQgZnJvbSBhcHBseWluZyB0eXBlIHVuaW9uc1xuICAvLyB0aHJvdWdoIHRoZSBkaXN0cmlidXRpdmUgY29uZGl0aW9uYWwgdHlwZS4gVGhpcyBpcyB0aGUgb2ZmaWNpYWxseSByZWNvbW1lbmRlZCBzb2x1dGlvbjpcbiAgLy8gaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svMi9jb25kaXRpb25hbC10eXBlcy5odG1sI2Rpc3RyaWJ1dGl2ZS1jb25kaXRpb25hbC10eXBlc1xuICAvL1xuICAvLyBJZGVudGlmeSBGb3JtQ29udHJvbCBjb250YWluZXIgdHlwZXMuXG4gIFtUXSBleHRlbmRzIFtGb3JtQ29udHJvbDxpbmZlciBVPl1cbiAgICA/IEZvcm1Db250cm9sPFU+XG4gICAgOiAvLyBPciBGb3JtQ29udHJvbCBjb250YWluZXJzIHRoYXQgYXJlIG9wdGlvbmFsIGluIHRoZWlyIHBhcmVudCBncm91cC5cbiAgICAgIFtUXSBleHRlbmRzIFtGb3JtQ29udHJvbDxpbmZlciBVPiB8IHVuZGVmaW5lZF1cbiAgICAgID8gRm9ybUNvbnRyb2w8VT5cbiAgICAgIDogLy8gRm9ybUdyb3VwIGNvbnRhaW5lcnMuXG4gICAgICAgIFtUXSBleHRlbmRzIFtGb3JtR3JvdXA8aW5mZXIgVT5dXG4gICAgICAgID8gRm9ybUdyb3VwPFU+XG4gICAgICAgIDogLy8gT3B0aW9uYWwgRm9ybUdyb3VwIGNvbnRhaW5lcnMuXG4gICAgICAgICAgW1RdIGV4dGVuZHMgW0Zvcm1Hcm91cDxpbmZlciBVPiB8IHVuZGVmaW5lZF1cbiAgICAgICAgICA/IEZvcm1Hcm91cDxVPlxuICAgICAgICAgIDogLy8gRm9ybVJlY29yZCBjb250YWluZXJzLlxuICAgICAgICAgICAgW1RdIGV4dGVuZHMgW0Zvcm1SZWNvcmQ8aW5mZXIgVT5dXG4gICAgICAgICAgICA/IEZvcm1SZWNvcmQ8VT5cbiAgICAgICAgICAgIDogLy8gT3B0aW9uYWwgRm9ybVJlY29yZCBjb250YWluZXJzLlxuICAgICAgICAgICAgICBbVF0gZXh0ZW5kcyBbRm9ybVJlY29yZDxpbmZlciBVPiB8IHVuZGVmaW5lZF1cbiAgICAgICAgICAgICAgPyBGb3JtUmVjb3JkPFU+XG4gICAgICAgICAgICAgIDogLy8gRm9ybUFycmF5IGNvbnRhaW5lcnMuXG4gICAgICAgICAgICAgICAgW1RdIGV4dGVuZHMgW0Zvcm1BcnJheTxpbmZlciBVPl1cbiAgICAgICAgICAgICAgICA/IEZvcm1BcnJheTxVPlxuICAgICAgICAgICAgICAgIDogLy8gT3B0aW9uYWwgRm9ybUFycmF5IGNvbnRhaW5lcnMuXG4gICAgICAgICAgICAgICAgICBbVF0gZXh0ZW5kcyBbRm9ybUFycmF5PGluZmVyIFU+IHwgdW5kZWZpbmVkXVxuICAgICAgICAgICAgICAgICAgPyBGb3JtQXJyYXk8VT5cbiAgICAgICAgICAgICAgICAgIDogLy8gT3RoZXJ3aXNlIHVua25vd24gQWJzdHJhY3RDb250cm9sIGNvbnRhaW5lcnMuXG4gICAgICAgICAgICAgICAgICAgIFtUXSBleHRlbmRzIFtBYnN0cmFjdENvbnRyb2w8aW5mZXIgVT5dXG4gICAgICAgICAgICAgICAgICAgID8gQWJzdHJhY3RDb250cm9sPFU+XG4gICAgICAgICAgICAgICAgICAgIDogLy8gT3B0aW9uYWwgQWJzdHJhY3RDb250cm9sIGNvbnRhaW5lcnMuXG4gICAgICAgICAgICAgICAgICAgICAgW1RdIGV4dGVuZHMgW0Fic3RyYWN0Q29udHJvbDxpbmZlciBVPiB8IHVuZGVmaW5lZF1cbiAgICAgICAgICAgICAgICAgICAgICA/IEFic3RyYWN0Q29udHJvbDxVPlxuICAgICAgICAgICAgICAgICAgICAgIDogLy8gRm9ybUNvbnRyb2xTdGF0ZSBvYmplY3QgY29udGFpbmVyLCB3aGljaCBwcm9kdWNlcyBhIG51bGxhYmxlIGNvbnRyb2wuXG4gICAgICAgICAgICAgICAgICAgICAgICBbVF0gZXh0ZW5kcyBbRm9ybUNvbnRyb2xTdGF0ZTxpbmZlciBVPl1cbiAgICAgICAgICAgICAgICAgICAgICAgID8gRm9ybUNvbnRyb2w8VSB8IE4+XG4gICAgICAgICAgICAgICAgICAgICAgICA6IC8vIEEgQ29udHJvbENvbmZpZyB0dXBsZSwgd2hpY2ggcHJvZHVjZXMgYSBudWxsYWJsZSBjb250cm9sLlxuICAgICAgICAgICAgICAgICAgICAgICAgICBbVF0gZXh0ZW5kcyBbUGVybWlzc2l2ZUNvbnRyb2xDb25maWc8aW5mZXIgVT5dXG4gICAgICAgICAgICAgICAgICAgICAgICAgID8gRm9ybUNvbnRyb2w8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFeGNsdWRlPFUsIFZhbGlkYXRvckNvbmZpZyB8IFBlcm1pc3NpdmVBYnN0cmFjdENvbnRyb2xPcHRpb25zPiB8IE5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogRm9ybUNvbnRyb2w8VCB8IE4+O1xuXG4vLyBjbGFuZy1mb3JtYXQgb25cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW4gYEFic3RyYWN0Q29udHJvbGAgZnJvbSBhIHVzZXItc3BlY2lmaWVkIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogVGhlIGBGb3JtQnVpbGRlcmAgcHJvdmlkZXMgc3ludGFjdGljIHN1Z2FyIHRoYXQgc2hvcnRlbnMgY3JlYXRpbmcgaW5zdGFuY2VzIG9mIGFcbiAqIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBvciBgRm9ybUFycmF5YC4gSXQgcmVkdWNlcyB0aGUgYW1vdW50IG9mIGJvaWxlcnBsYXRlIG5lZWRlZCB0b1xuICogYnVpbGQgY29tcGxleCBmb3Jtcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvZm9ybXMvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBGb3JtQnVpbGRlciB7XG4gIHByaXZhdGUgdXNlTm9uTnVsbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYSBGb3JtQnVpbGRlciBpbiB3aGljaCBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdGVkIGBGb3JtQ29udHJvbGAgZWxlbWVudHNcbiAgICogaGF2ZSBge25vbk51bGxhYmxlOiB0cnVlfWAgYW5kIGFyZSBub24tbnVsbGFibGUuXG4gICAqXG4gICAqICoqQ29uc3RydWN0aW5nIG5vbi1udWxsYWJsZSBjb250cm9scyoqXG4gICAqXG4gICAqIFdoZW4gY29uc3RydWN0aW5nIGEgY29udHJvbCwgaXQgd2lsbCBiZSBub24tbnVsbGFibGUsIGFuZCB3aWxsIHJlc2V0IHRvIGl0cyBpbml0aWFsIHZhbHVlLlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBsZXQgbm5mYiA9IG5ldyBGb3JtQnVpbGRlcigpLm5vbk51bGxhYmxlO1xuICAgKiBsZXQgbmFtZSA9IG5uZmIuY29udHJvbCgnQWxleCcpOyAvLyBGb3JtQ29udHJvbDxzdHJpbmc+XG4gICAqIG5hbWUucmVzZXQoKTtcbiAgICogY29uc29sZS5sb2cobmFtZSk7IC8vICdBbGV4J1xuICAgKiBgYGBcbiAgICpcbiAgICogKipDb25zdHJ1Y3Rpbmcgbm9uLW51bGxhYmxlIGdyb3VwcyBvciBhcnJheXMqKlxuICAgKlxuICAgKiBXaGVuIGNvbnN0cnVjdGluZyBhIGdyb3VwIG9yIGFycmF5LCBhbGwgYXV0b21hdGljYWxseSBjcmVhdGVkIGlubmVyIGNvbnRyb2xzIHdpbGwgYmVcbiAgICogbm9uLW51bGxhYmxlLCBhbmQgd2lsbCByZXNldCB0byB0aGVpciBpbml0aWFsIHZhbHVlcy5cbiAgICpcbiAgICogYGBgdHNcbiAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICogbGV0IG5hbWUgPSBubmZiLmdyb3VwKHt3aG86ICdBbGV4J30pOyAvLyBGb3JtR3JvdXA8e3dobzogRm9ybUNvbnRyb2w8c3RyaW5nPn0+XG4gICAqIG5hbWUucmVzZXQoKTtcbiAgICogY29uc29sZS5sb2cobmFtZSk7IC8vIHt3aG86ICdBbGV4J31cbiAgICogYGBgXG4gICAqICoqQ29uc3RydWN0aW5nICpudWxsYWJsZSogZmllbGRzIG9uIGdyb3VwcyBvciBhcnJheXMqKlxuICAgKlxuICAgKiBJdCBpcyBzdGlsbCBwb3NzaWJsZSB0byBoYXZlIGEgbnVsbGFibGUgZmllbGQuIEluIHBhcnRpY3VsYXIsIGFueSBgRm9ybUNvbnRyb2xgIHdoaWNoIGlzXG4gICAqICphbHJlYWR5KiBjb25zdHJ1Y3RlZCB3aWxsIG5vdCBiZSBhbHRlcmVkLiBGb3IgZXhhbXBsZTpcbiAgICpcbiAgICogYGBgdHNcbiAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICogLy8gRm9ybUdyb3VwPHt3aG86IEZvcm1Db250cm9sPHN0cmluZ3xudWxsPn0+XG4gICAqIGxldCBuYW1lID0gbm5mYi5ncm91cCh7d2hvOiBuZXcgRm9ybUNvbnRyb2woJ0FsZXgnKX0pO1xuICAgKiBuYW1lLnJlc2V0KCk7IGNvbnNvbGUubG9nKG5hbWUpOyAvLyB7d2hvOiBudWxsfVxuICAgKiBgYGBcbiAgICpcbiAgICogQmVjYXVzZSB0aGUgaW5uZXIgY29udHJvbCBpcyBjb25zdHJ1Y3RlZCBleHBsaWNpdGx5IGJ5IHRoZSBjYWxsZXIsIHRoZSBidWlsZGVyIGhhc1xuICAgKiBubyBjb250cm9sIG92ZXIgaG93IGl0IGlzIGNyZWF0ZWQsIGFuZCBjYW5ub3QgZXhjbHVkZSB0aGUgYG51bGxgLlxuICAgKi9cbiAgZ2V0IG5vbk51bGxhYmxlKCk6IE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIge1xuICAgIGNvbnN0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKTtcbiAgICBubmZiLnVzZU5vbk51bGxhYmxlID0gdHJ1ZTtcbiAgICByZXR1cm4gbm5mYiBhcyBOb25OdWxsYWJsZUZvcm1CdWlsZGVyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIGFuIG9iamVjdFxuICAgKiBjb250YWluaW5nIGFsbCB0aGUga2V5cyBhbmQgY29ycmVzcG9uZGluZyBpbm5lciBjb250cm9sIHR5cGVzLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIG9iamVjdCBzaG91bGQgaGF2ZSB0aGVcbiAgICogYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIHR5cGUgYW5kIG1pZ2h0IGNvbnRhaW4gdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAqICogYHZhbGlkYXRvcnNgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgYXN5bmNWYWxpZGF0b3JzYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYHVwZGF0ZU9uYDogVGhlIGV2ZW50IHVwb24gd2hpY2ggdGhlIGNvbnRyb2wgc2hvdWxkIGJlIHVwZGF0ZWQgKG9wdGlvbnM6ICdjaGFuZ2UnIHwgJ2JsdXInXG4gICAqIHwgc3VibWl0JykuXG4gICAqL1xuICBncm91cDxUIGV4dGVuZHMge30+KFxuICAgIGNvbnRyb2xzOiBULFxuICAgIG9wdGlvbnM/OiBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbiAgKTogRm9ybUdyb3VwPHtbSyBpbiBrZXlvZiBUXTogybVFbGVtZW50PFRbS10sIG51bGw+fT47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBUaGlzIEFQSSBpcyBub3QgdHlwZXNhZmUgYW5kIGNhbiByZXN1bHQgaW4gaXNzdWVzIHdpdGggQ2xvc3VyZSBDb21waWxlciByZW5hbWluZy5cbiAgICogVXNlIHRoZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgIG92ZXJsb2FkIHdpdGggYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIGluc3RlYWQuXG4gICAqIE5vdGUgdGhhdCBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgZXhwZWN0cyBgdmFsaWRhdG9yc2AgYW5kIGBhc3luY1ZhbGlkYXRvcnNgIHRvIGJlIHZhbGlkXG4gICAqIHZhbGlkYXRvcnMuIElmIHlvdSBoYXZlIGN1c3RvbSB2YWxpZGF0b3JzLCBtYWtlIHN1cmUgdGhlaXIgdmFsaWRhdGlvbiBmdW5jdGlvbiBwYXJhbWV0ZXIgaXNcbiAgICogYEFic3RyYWN0Q29udHJvbGAgYW5kIG5vdCBhIHN1Yi1jbGFzcywgc3VjaCBhcyBgRm9ybUdyb3VwYC4gVGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkXG4gICAqIHdpdGggYW4gb2JqZWN0IG9mIHR5cGUgYEFic3RyYWN0Q29udHJvbGAgYW5kIHRoYXQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgZG93bmNhc3QgdG8gYVxuICAgKiBzdWJjbGFzcywgc28gVHlwZVNjcmlwdCBzZWVzIHRoaXMgYXMgYW4gZXJyb3IuIEZvciBleGFtcGxlLCBjaGFuZ2UgdGhlIGAoZ3JvdXA6IEZvcm1Hcm91cCkgPT5cbiAgICogVmFsaWRhdGlvbkVycm9yc3xudWxsYCBzaWduYXR1cmUgdG8gYmUgYChncm91cDogQWJzdHJhY3RDb250cm9sKSA9PiBWYWxpZGF0aW9uRXJyb3JzfG51bGxgLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSByZWNvcmQgb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggdGhlIGNvbnRyb2wgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIG9iamVjdCBmb3IgdGhlIGBGb3JtR3JvdXBgLiBUaGUgbGVnYWN5IGNvbmZpZ3VyYXRpb25cbiAgICogb2JqZWN0IGNvbnNpc3RzIG9mOlxuICAgKiAqIGB2YWxpZGF0b3JgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgYXN5bmNWYWxpZGF0b3JgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiBOb3RlOiB0aGUgbGVnYWN5IGZvcm1hdCBpcyBkZXByZWNhdGVkIGFuZCBtaWdodCBiZSByZW1vdmVkIGluIG9uZSBvZiB0aGUgbmV4dCBtYWpvciB2ZXJzaW9uc1xuICAgKiBvZiBBbmd1bGFyLlxuICAgKi9cbiAgZ3JvdXAoY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBvcHRpb25zOiB7W2tleTogc3RyaW5nXTogYW55fSk6IEZvcm1Hcm91cDtcblxuICBncm91cChcbiAgICBjb250cm9sczoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgb3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IHtba2V5OiBzdHJpbmddOiBhbnl9IHwgbnVsbCA9IG51bGwsXG4gICk6IEZvcm1Hcm91cCB7XG4gICAgY29uc3QgcmVkdWNlZENvbnRyb2xzID0gdGhpcy5fcmVkdWNlQ29udHJvbHMoY29udHJvbHMpO1xuICAgIGxldCBuZXdPcHRpb25zOiBGb3JtQ29udHJvbE9wdGlvbnMgPSB7fTtcbiAgICBpZiAoaXNBYnN0cmFjdENvbnRyb2xPcHRpb25zKG9wdGlvbnMpKSB7XG4gICAgICAvLyBgb3B0aW9uc2AgYXJlIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYFxuICAgICAgbmV3T3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAvLyBgb3B0aW9uc2AgYXJlIGxlZ2FjeSBmb3JtIGdyb3VwIG9wdGlvbnNcbiAgICAgIG5ld09wdGlvbnMudmFsaWRhdG9ycyA9IChvcHRpb25zIGFzIGFueSkudmFsaWRhdG9yO1xuICAgICAgbmV3T3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgPSAob3B0aW9ucyBhcyBhbnkpLmFzeW5jVmFsaWRhdG9yO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZvcm1Hcm91cChyZWR1Y2VkQ29udHJvbHMsIG5ld09wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGBGb3JtUmVjb3JkYCBpbnN0YW5jZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBvYmplY3RcbiAgICogY29udGFpbmluZyBhbGwgdGhlIGtleXMgYW5kIGNvcnJlc3BvbmRpbmcgaW5uZXIgY29udHJvbCB0eXBlcy5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1SZWNvcmRgLiBUaGUgb2JqZWN0IHNob3VsZCBoYXZlIHRoZVxuICAgKiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgdHlwZSBhbmQgbWlnaHQgY29udGFpbiB0aGUgZm9sbG93aW5nIGZpZWxkczpcbiAgICogKiBgdmFsaWRhdG9yc2A6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKiAqIGBhc3luY1ZhbGlkYXRvcnNgOiBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgdXBkYXRlT25gOiBUaGUgZXZlbnQgdXBvbiB3aGljaCB0aGUgY29udHJvbCBzaG91bGQgYmUgdXBkYXRlZCAob3B0aW9uczogJ2NoYW5nZScgfCAnYmx1cidcbiAgICogfCBzdWJtaXQnKS5cbiAgICovXG4gIHJlY29yZDxUPihcbiAgICBjb250cm9sczoge1trZXk6IHN0cmluZ106IFR9LFxuICAgIG9wdGlvbnM6IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsID0gbnVsbCxcbiAgKTogRm9ybVJlY29yZDzJtUVsZW1lbnQ8VCwgbnVsbD4+IHtcbiAgICBjb25zdCByZWR1Y2VkQ29udHJvbHMgPSB0aGlzLl9yZWR1Y2VDb250cm9scyhjb250cm9scyk7XG4gICAgLy8gQ2FzdCB0byBgYW55YCBiZWNhdXNlIHRoZSBpbmZlcnJlZCB0eXBlcyBhcmUgbm90IGFzIHNwZWNpZmljIGFzIEVsZW1lbnQuXG4gICAgcmV0dXJuIG5ldyBGb3JtUmVjb3JkKHJlZHVjZWRDb250cm9scywgb3B0aW9ucykgYXMgYW55O1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgbm9uTnVsbGFibGVgIGluc3RlYWQuICovXG4gIGNvbnRyb2w8VD4oXG4gICAgZm9ybVN0YXRlOiBUIHwgRm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICBvcHRzOiBGb3JtQ29udHJvbE9wdGlvbnMgJiB7XG4gICAgICBpbml0aWFsVmFsdWVJc0RlZmF1bHQ6IHRydWU7XG4gICAgfSxcbiAgKTogRm9ybUNvbnRyb2w8VD47XG5cbiAgY29udHJvbDxUPihcbiAgICBmb3JtU3RhdGU6IFQgfCBGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgIG9wdHM6IEZvcm1Db250cm9sT3B0aW9ucyAmIHtub25OdWxsYWJsZTogdHJ1ZX0sXG4gICk6IEZvcm1Db250cm9sPFQ+O1xuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCBXaGVuIHBhc3NpbmcgYW4gYG9wdGlvbnNgIGFyZ3VtZW50LCB0aGUgYGFzeW5jVmFsaWRhdG9yYCBhcmd1bWVudCBoYXMgbm8gZWZmZWN0LlxuICAgKi9cbiAgY29udHJvbDxUPihcbiAgICBmb3JtU3RhdGU6IFQgfCBGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgIG9wdHM6IEZvcm1Db250cm9sT3B0aW9ucyxcbiAgICBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSxcbiAgKTogRm9ybUNvbnRyb2w8VCB8IG51bGw+O1xuXG4gIGNvbnRyb2w8VD4oXG4gICAgZm9ybVN0YXRlOiBUIHwgRm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBGb3JtQ29udHJvbE9wdGlvbnMgfCBudWxsLFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwsXG4gICk6IEZvcm1Db250cm9sPFQgfCBudWxsPjtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1Db250cm9sYCB3aXRoIHRoZSBnaXZlbiBzdGF0ZSwgdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy4gU2V0c1xuICAgKiBge25vbk51bGxhYmxlOiB0cnVlfWAgaW4gdGhlIG9wdGlvbnMgdG8gZ2V0IGEgbm9uLW51bGxhYmxlIGNvbnRyb2wuIE90aGVyd2lzZSwgdGhlXG4gICAqIGNvbnRyb2wgd2lsbCBiZSBudWxsYWJsZS4gQWNjZXB0cyBhIHNpbmdsZSBnZW5lcmljIGFyZ3VtZW50LCB3aGljaCBpcyB0aGUgdHlwZSAgb2YgdGhlXG4gICAqIGNvbnRyb2wncyB2YWx1ZS5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsIG9yXG4gICAqIHdpdGggYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGEgYEZvcm1Db250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnNcbiAgICogdmFsaWRhdGlvbiBmdW5jdGlvbnMgYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvclxuICAgKiBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBJbml0aWFsaXplIGEgY29udHJvbCBhcyBkaXNhYmxlZFxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmV0dXJucyBhIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlIGluIGEgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cImZvcm1zL3RzL2Zvcm1CdWlsZGVyL2Zvcm1fYnVpbGRlcl9leGFtcGxlLnRzXCIgcmVnaW9uPVwiZGlzYWJsZWQtY29udHJvbFwiPlxuICAgKiA8L2NvZGUtZXhhbXBsZT5cbiAgICovXG4gIGNvbnRyb2w8VD4oXG4gICAgZm9ybVN0YXRlOiBUIHwgRm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBGb3JtQ29udHJvbE9wdGlvbnMgfCBudWxsLFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwsXG4gICk6IEZvcm1Db250cm9sIHtcbiAgICBsZXQgbmV3T3B0aW9uczogRm9ybUNvbnRyb2xPcHRpb25zID0ge307XG4gICAgaWYgKCF0aGlzLnVzZU5vbk51bGxhYmxlKSB7XG4gICAgICByZXR1cm4gbmV3IEZvcm1Db250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gICAgfVxuICAgIGlmIChpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnModmFsaWRhdG9yT3JPcHRzKSkge1xuICAgICAgLy8gSWYgdGhlIHNlY29uZCBhcmd1bWVudCBpcyBvcHRpb25zLCB0aGVuIHRoZXkgYXJlIGNvcGllZC5cbiAgICAgIG5ld09wdGlvbnMgPSB2YWxpZGF0b3JPck9wdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSBvdGhlciBhcmd1bWVudHMgYXJlIHZhbGlkYXRvcnMsIHRoZXkgYXJlIGNvcGllZCBpbnRvIGFuIG9wdGlvbnMgb2JqZWN0LlxuICAgICAgbmV3T3B0aW9ucy52YWxpZGF0b3JzID0gdmFsaWRhdG9yT3JPcHRzO1xuICAgICAgbmV3T3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbDxUPihmb3JtU3RhdGUsIHsuLi5uZXdPcHRpb25zLCBub25OdWxsYWJsZTogdHJ1ZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1BcnJheWAgZnJvbSB0aGUgZ2l2ZW4gYXJyYXkgb2YgY29uZmlndXJhdGlvbnMsXG4gICAqIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuIEFjY2VwdHMgYSBzaW5nbGUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggaXMgdGhlIHR5cGUgb2YgZWFjaCBjb250cm9sXG4gICAqIGluc2lkZSB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scyBvciBjb250cm9sIGNvbmZpZ3MuIEVhY2ggY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhblxuICAgKiAgICAgaW5kZXggd2hlbiBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiBzdWNoIGZ1bmN0aW9ucywgb3IgYW5cbiAgICogICAgIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWluc1xuICAgKiB2YWxpZGF0aW9uIGZ1bmN0aW9ucyBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICovXG4gIGFycmF5PFQ+KFxuICAgIGNvbnRyb2xzOiBBcnJheTxUPixcbiAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbiAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsLFxuICApOiBGb3JtQXJyYXk8ybVFbGVtZW50PFQsIG51bGw+PiB7XG4gICAgY29uc3QgY3JlYXRlZENvbnRyb2xzID0gY29udHJvbHMubWFwKChjKSA9PiB0aGlzLl9jcmVhdGVDb250cm9sKGMpKTtcbiAgICAvLyBDYXN0IHRvIGBhbnlgIGJlY2F1c2UgdGhlIGluZmVycmVkIHR5cGVzIGFyZSBub3QgYXMgc3BlY2lmaWMgYXMgRWxlbWVudC5cbiAgICByZXR1cm4gbmV3IEZvcm1BcnJheShjcmVhdGVkQ29udHJvbHMsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpIGFzIGFueTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZUNvbnRyb2xzPFQ+KGNvbnRyb2xzOiB7XG4gICAgW2s6IHN0cmluZ106IFQgfCBDb250cm9sQ29uZmlnPFQ+IHwgRm9ybUNvbnRyb2xTdGF0ZTxUPiB8IEFic3RyYWN0Q29udHJvbDxUPjtcbiAgfSk6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9IHtcbiAgICBjb25zdCBjcmVhdGVkQ29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9ID0ge307XG4gICAgT2JqZWN0LmtleXMoY29udHJvbHMpLmZvckVhY2goKGNvbnRyb2xOYW1lKSA9PiB7XG4gICAgICBjcmVhdGVkQ29udHJvbHNbY29udHJvbE5hbWVdID0gdGhpcy5fY3JlYXRlQ29udHJvbChjb250cm9sc1tjb250cm9sTmFtZV0pO1xuICAgIH0pO1xuICAgIHJldHVybiBjcmVhdGVkQ29udHJvbHM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jcmVhdGVDb250cm9sPFQ+KFxuICAgIGNvbnRyb2xzOiBUIHwgRm9ybUNvbnRyb2xTdGF0ZTxUPiB8IENvbnRyb2xDb25maWc8VD4gfCBGb3JtQ29udHJvbDxUPiB8IEFic3RyYWN0Q29udHJvbDxUPixcbiAgKTogRm9ybUNvbnRyb2w8VD4gfCBGb3JtQ29udHJvbDxUIHwgbnVsbD4gfCBBYnN0cmFjdENvbnRyb2w8VD4ge1xuICAgIGlmIChjb250cm9scyBpbnN0YW5jZW9mIEZvcm1Db250cm9sKSB7XG4gICAgICByZXR1cm4gY29udHJvbHMgYXMgRm9ybUNvbnRyb2w8VD47XG4gICAgfSBlbHNlIGlmIChjb250cm9scyBpbnN0YW5jZW9mIEFic3RyYWN0Q29udHJvbCkge1xuICAgICAgLy8gQSBjb250cm9sOyBqdXN0IHJldHVybiBpdFxuICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjb250cm9scykpIHtcbiAgICAgIC8vIENvbnRyb2xDb25maWcgVHVwbGVcbiAgICAgIGNvbnN0IHZhbHVlOiBUIHwgRm9ybUNvbnRyb2xTdGF0ZTxUPiA9IGNvbnRyb2xzWzBdO1xuICAgICAgY29uc3QgdmFsaWRhdG9yOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBudWxsID1cbiAgICAgICAgY29udHJvbHMubGVuZ3RoID4gMSA/IGNvbnRyb2xzWzFdISA6IG51bGw7XG4gICAgICBjb25zdCBhc3luY1ZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwgPVxuICAgICAgICBjb250cm9scy5sZW5ndGggPiAyID8gY29udHJvbHNbMl0hIDogbnVsbDtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2w8VD4odmFsdWUsIHZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUIG9yIEZvcm1Db250cm9sU3RhdGU8VD5cbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2w8VD4oY29udHJvbHMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogYE5vbk51bGxhYmxlRm9ybUJ1aWxkZXJgIGlzIHNpbWlsYXIgdG8ge0BsaW5rIEZvcm1CdWlsZGVyfSwgYnV0IGF1dG9tYXRpY2FsbHkgY29uc3RydWN0ZWRcbiAqIHtAbGluayBGb3JtQ29udHJvbH0gZWxlbWVudHMgaGF2ZSBge25vbk51bGxhYmxlOiB0cnVlfWAgYW5kIGFyZSBub24tbnVsbGFibGUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290JyxcbiAgdXNlRmFjdG9yeTogKCkgPT4gaW5qZWN0KEZvcm1CdWlsZGVyKS5ub25OdWxsYWJsZSxcbn0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTm9uTnVsbGFibGVGb3JtQnVpbGRlciB7XG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGBGb3JtQnVpbGRlciNncm91cGAsIGV4Y2VwdCBhbnkgaW1wbGljaXRseSBjb25zdHJ1Y3RlZCBgRm9ybUNvbnRyb2xgXG4gICAqIHdpbGwgYmUgbm9uLW51bGxhYmxlIChpLmUuIGl0IHdpbGwgaGF2ZSBgbm9uTnVsbGFibGVgIHNldCB0byB0cnVlKS4gTm90ZVxuICAgKiB0aGF0IGFscmVhZHktY29uc3RydWN0ZWQgY29udHJvbHMgd2lsbCBub3QgYmUgYWx0ZXJlZC5cbiAgICovXG4gIGFic3RyYWN0IGdyb3VwPFQgZXh0ZW5kcyB7fT4oXG4gICAgY29udHJvbHM6IFQsXG4gICAgb3B0aW9ucz86IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsLFxuICApOiBGb3JtR3JvdXA8e1tLIGluIGtleW9mIFRdOiDJtUVsZW1lbnQ8VFtLXSwgbmV2ZXI+fT47XG5cbiAgLyoqXG4gICAqIFNpbWlsYXIgdG8gYEZvcm1CdWlsZGVyI3JlY29yZGAsIGV4Y2VwdCBhbnkgaW1wbGljaXRseSBjb25zdHJ1Y3RlZCBgRm9ybUNvbnRyb2xgXG4gICAqIHdpbGwgYmUgbm9uLW51bGxhYmxlIChpLmUuIGl0IHdpbGwgaGF2ZSBgbm9uTnVsbGFibGVgIHNldCB0byB0cnVlKS4gTm90ZVxuICAgKiB0aGF0IGFscmVhZHktY29uc3RydWN0ZWQgY29udHJvbHMgd2lsbCBub3QgYmUgYWx0ZXJlZC5cbiAgICovXG4gIGFic3RyYWN0IHJlY29yZDxUPihcbiAgICBjb250cm9sczoge1trZXk6IHN0cmluZ106IFR9LFxuICAgIG9wdGlvbnM/OiBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbiAgKTogRm9ybVJlY29yZDzJtUVsZW1lbnQ8VCwgbmV2ZXI+PjtcblxuICAvKipcbiAgICogU2ltaWxhciB0byBgRm9ybUJ1aWxkZXIjYXJyYXlgLCBleGNlcHQgYW55IGltcGxpY2l0bHkgY29uc3RydWN0ZWQgYEZvcm1Db250cm9sYFxuICAgKiB3aWxsIGJlIG5vbi1udWxsYWJsZSAoaS5lLiBpdCB3aWxsIGhhdmUgYG5vbk51bGxhYmxlYCBzZXQgdG8gdHJ1ZSkuIE5vdGVcbiAgICogdGhhdCBhbHJlYWR5LWNvbnN0cnVjdGVkIGNvbnRyb2xzIHdpbGwgbm90IGJlIGFsdGVyZWQuXG4gICAqL1xuICBhYnN0cmFjdCBhcnJheTxUPihcbiAgICBjb250cm9sczogQXJyYXk8VD4sXG4gICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwsXG4gICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCxcbiAgKTogRm9ybUFycmF5PMm1RWxlbWVudDxULCBuZXZlcj4+O1xuXG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGBGb3JtQnVpbGRlciNjb250cm9sYCwgZXhjZXB0IHRoaXMgb3ZlcnJpZGRlbiB2ZXJzaW9uIG9mIGBjb250cm9sYCBmb3JjZXNcbiAgICogYG5vbk51bGxhYmxlYCB0byBiZSBgdHJ1ZWAsIHJlc3VsdGluZyBpbiB0aGUgY29udHJvbCBhbHdheXMgYmVpbmcgbm9uLW51bGxhYmxlLlxuICAgKi9cbiAgYWJzdHJhY3QgY29udHJvbDxUPihcbiAgICBmb3JtU3RhdGU6IFQgfCBGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsLFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwsXG4gICk6IEZvcm1Db250cm9sPFQ+O1xufVxuXG4vKipcbiAqIFVudHlwZWRGb3JtQnVpbGRlciBpcyB0aGUgc2FtZSBhcyBgRm9ybUJ1aWxkZXJgLCBidXQgaXQgcHJvdmlkZXMgdW50eXBlZCBjb250cm9scy5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgVW50eXBlZEZvcm1CdWlsZGVyIGV4dGVuZHMgRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogTGlrZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgLCBleGNlcHQgdGhlIHJlc3VsdGluZyBncm91cCBpcyB1bnR5cGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgIG9wdGlvbnM/OiBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbiAgKTogVW50eXBlZEZvcm1Hcm91cDtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaXMgbm90IHR5cGVzYWZlIGFuZCBjYW4gcmVzdWx0IGluIGlzc3VlcyB3aXRoIENsb3N1cmUgQ29tcGlsZXIgcmVuYW1pbmcuXG4gICAqIFVzZSB0aGUgYEZvcm1CdWlsZGVyI2dyb3VwYCBvdmVybG9hZCB3aXRoIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBpbnN0ZWFkLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgY29udHJvbHNDb25maWc6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgIG9wdGlvbnM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICApOiBVbnR5cGVkRm9ybUdyb3VwO1xuXG4gIG92ZXJyaWRlIGdyb3VwKFxuICAgIGNvbnRyb2xzQ29uZmlnOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICBvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwge1trZXk6IHN0cmluZ106IGFueX0gfCBudWxsID0gbnVsbCxcbiAgKTogVW50eXBlZEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHN1cGVyLmdyb3VwKGNvbnRyb2xzQ29uZmlnLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWtlIGBGb3JtQnVpbGRlciNjb250cm9sYCwgZXhjZXB0IHRoZSByZXN1bHRpbmcgY29udHJvbCBpcyB1bnR5cGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgY29udHJvbChcbiAgICBmb3JtU3RhdGU6IGFueSxcbiAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBGb3JtQ29udHJvbE9wdGlvbnMgfCBudWxsLFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwsXG4gICk6IFVudHlwZWRGb3JtQ29udHJvbCB7XG4gICAgcmV0dXJuIHN1cGVyLmNvbnRyb2woZm9ybVN0YXRlLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWtlIGBGb3JtQnVpbGRlciNhcnJheWAsIGV4Y2VwdCB0aGUgcmVzdWx0aW5nIGFycmF5IGlzIHVudHlwZWQuXG4gICAqL1xuICBvdmVycmlkZSBhcnJheShcbiAgICBjb250cm9sc0NvbmZpZzogYW55W10sXG4gICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwsXG4gICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCxcbiAgKTogVW50eXBlZEZvcm1BcnJheSB7XG4gICAgcmV0dXJuIHN1cGVyLmFycmF5KGNvbnRyb2xzQ29uZmlnLCB2YWxpZGF0b3JPck9wdHMsIGFzeW5jVmFsaWRhdG9yKTtcbiAgfVxufVxuIl19