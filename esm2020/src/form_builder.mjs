/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { inject, Injectable } from '@angular/core';
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
     * Construct a new `FormControl` with the given state, validators and options. Set
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
}
FormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: FormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
FormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: FormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: FormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
/**
 * @description
 * `NonNullableFormBuilder` is similar to {@link FormBuilder}, but automatically constructed
 * {@link FormControl} elements have `{nonNullable: true}` and are non-nullable.
 *
 * @publicApi
 */
export class NonNullableFormBuilder {
}
NonNullableFormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: NonNullableFormBuilder, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
NonNullableFormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: NonNullableFormBuilder, providedIn: ReactiveFormsModule, useFactory: () => inject(FormBuilder).nonNullable });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: NonNullableFormBuilder, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: ReactiveFormsModule,
                    useFactory: () => inject(FormBuilder).nonNullable,
                }]
        }] });
/**
 * UntypedFormBuilder is the same as @see FormBuilder, but it provides untyped controls.
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
}
UntypedFormBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: UntypedFormBuilder, deps: null, target: i0.ɵɵFactoryTarget.Injectable });
UntypedFormBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: UntypedFormBuilder, providedIn: ReactiveFormsModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.1.0+sha-79825d3", ngImport: i0, type: UntypedFormBuilder, decorators: [{
            type: Injectable,
            args: [{ providedIn: ReactiveFormsModule }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9idWlsZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2Zvcm1fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUdqRCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMsZUFBZSxFQUFvQyxNQUFNLHdCQUF3QixDQUFDO0FBQzFGLE9BQU8sRUFBQyxTQUFTLEVBQW1CLE1BQU0sb0JBQW9CLENBQUM7QUFDL0QsT0FBTyxFQUFDLFdBQVcsRUFBMkQsTUFBTSxzQkFBc0IsQ0FBQztBQUMzRyxPQUFPLEVBQUMsU0FBUyxFQUFtQixNQUFNLG9CQUFvQixDQUFDOztBQUUvRCxTQUFTLHdCQUF3QixDQUFDLE9BQ1M7SUFDekMsT0FBTyxDQUFDLENBQUMsT0FBTztRQUNaLENBQUUsT0FBa0MsQ0FBQyxlQUFlLEtBQUssU0FBUztZQUNoRSxPQUFrQyxDQUFDLFVBQVUsS0FBSyxTQUFTO1lBQzNELE9BQWtDLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFtREQsa0JBQWtCO0FBRWxCOzs7Ozs7Ozs7OztHQVdHO0FBRUgsTUFBTSxPQUFPLFdBQVc7SUFEeEI7UUFFVSxtQkFBYyxHQUFZLEtBQUssQ0FBQztLQXFPekM7SUFuT0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BeUNHO0lBQ0gsSUFBSSxXQUFXO1FBQ2IsTUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMzQixPQUFPLElBQThCLENBQUM7SUFDeEMsQ0FBQztJQWtERCxLQUFLLENBQUMsUUFBOEIsRUFBRSxVQUNpRCxJQUFJO1FBRXpGLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsSUFBSSxVQUFVLEdBQXVCLEVBQUUsQ0FBQztRQUN4QyxJQUFJLHdCQUF3QixDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3JDLHlDQUF5QztZQUN6QyxVQUFVLEdBQUcsT0FBTyxDQUFDO1NBQ3RCO2FBQU0sSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQzNCLDBDQUEwQztZQUMxQyxVQUFVLENBQUMsVUFBVSxHQUFJLE9BQWUsQ0FBQyxTQUFTLENBQUM7WUFDbkQsVUFBVSxDQUFDLGVBQWUsR0FBSSxPQUFlLENBQUMsY0FBYyxDQUFDO1NBQzlEO1FBQ0QsT0FBTyxJQUFJLFNBQVMsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQXNCRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlCRztJQUNILE9BQU8sQ0FDSCxTQUFnQyxFQUNoQyxlQUFtRSxFQUNuRSxjQUF5RDtRQUMzRCxJQUFJLFVBQVUsR0FBdUIsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3hCLE9BQU8sSUFBSSxXQUFXLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUNwRTtRQUNELElBQUksd0JBQXdCLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDN0MsMkRBQTJEO1lBQzNELFVBQVUsR0FBRyxlQUFlLENBQUM7U0FDOUI7YUFBTTtZQUNMLGlGQUFpRjtZQUNqRixVQUFVLENBQUMsVUFBVSxHQUFHLGVBQWUsQ0FBQztZQUN4QyxVQUFVLENBQUMsZUFBZSxHQUFHLGNBQWMsQ0FBQztTQUM3QztRQUNELE9BQU8sSUFBSSxXQUFXLENBQUksU0FBUyxFQUFFLEVBQUMsR0FBRyxVQUFVLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCxLQUFLLENBQ0QsUUFBa0IsRUFBRSxlQUF1RSxFQUMzRixjQUF5RDtRQUMzRCxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLDJFQUEyRTtRQUMzRSxPQUFPLElBQUksU0FBUyxDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFRLENBQUM7SUFDaEYsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixlQUFlLENBQUksUUFDNEU7UUFFN0YsTUFBTSxlQUFlLEdBQXFDLEVBQUUsQ0FBQztRQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUMxQyxlQUFlLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsY0FBYyxDQUFJLFFBQ2tCO1FBQ2xDLElBQUksUUFBUSxZQUFZLFdBQVcsRUFBRTtZQUNuQyxPQUFPLFFBQTBCLENBQUM7U0FDbkM7YUFBTSxJQUFJLFFBQVEsWUFBWSxlQUFlLEVBQUUsRUFBRyw0QkFBNEI7WUFDN0UsT0FBTyxRQUFRLENBQUM7U0FDakI7YUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRyxzQkFBc0I7WUFDM0QsTUFBTSxLQUFLLEdBQTBCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLFNBQVMsR0FBbUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzVGLE1BQU0sY0FBYyxHQUNoQixRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFJLEtBQUssRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDMUQ7YUFBTSxFQUFHLDJCQUEyQjtZQUNuQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUksUUFBUSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDOzttSEFyT1UsV0FBVzt1SEFBWCxXQUFXLGNBREMsbUJBQW1CO3NHQUMvQixXQUFXO2tCQUR2QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFDOztBQXlPN0M7Ozs7OztHQU1HO0FBS0gsTUFBTSxPQUFnQixzQkFBc0I7OzhIQUF0QixzQkFBc0I7a0lBQXRCLHNCQUFzQixjQUg5QixtQkFBbUIsY0FDbkIsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVc7c0dBRTdCLHNCQUFzQjtrQkFKM0MsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsbUJBQW1CO29CQUMvQixVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVc7aUJBQ2xEOztBQStCRDs7R0FFRztBQUVILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxXQUFXO0lBa0J4QyxLQUFLLENBQ1YsY0FBb0MsRUFDcEMsVUFBNEQsSUFBSTtRQUNsRSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRztJQUNNLE9BQU8sQ0FDWixTQUFjLEVBQUUsZUFBbUUsRUFDbkYsY0FBeUQ7UUFDM0QsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVEOztPQUVHO0lBQ00sS0FBSyxDQUNWLGNBQXFCLEVBQ3JCLGVBQXVFLEVBQ3ZFLGNBQXlEO1FBQzNELE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsZUFBZSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7OzBIQXpDVSxrQkFBa0I7OEhBQWxCLGtCQUFrQixjQUROLG1CQUFtQjtzR0FDL0Isa0JBQWtCO2tCQUQ5QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLG1CQUFtQixFQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aW5qZWN0LCBJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtSZWFjdGl2ZUZvcm1zTW9kdWxlfSBmcm9tICcuL2Zvcm1fcHJvdmlkZXJzJztcbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBBYnN0cmFjdENvbnRyb2xPcHRpb25zLCBGb3JtSG9va3N9IGZyb20gJy4vbW9kZWwvYWJzdHJhY3RfbW9kZWwnO1xuaW1wb3J0IHtGb3JtQXJyYXksIFVudHlwZWRGb3JtQXJyYXl9IGZyb20gJy4vbW9kZWwvZm9ybV9hcnJheSc7XG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtQ29udHJvbE9wdGlvbnMsIEZvcm1Db250cm9sU3RhdGUsIFVudHlwZWRGb3JtQ29udHJvbH0gZnJvbSAnLi9tb2RlbC9mb3JtX2NvbnRyb2wnO1xuaW1wb3J0IHtGb3JtR3JvdXAsIFVudHlwZWRGb3JtR3JvdXB9IGZyb20gJy4vbW9kZWwvZm9ybV9ncm91cCc7XG5cbmZ1bmN0aW9uIGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTogb3B0aW9ucyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuICEhb3B0aW9ucyAmJlxuICAgICAgKChvcHRpb25zIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLmFzeW5jVmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudmFsaWRhdG9ycyAhPT0gdW5kZWZpbmVkIHx8XG4gICAgICAgKG9wdGlvbnMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudXBkYXRlT24gIT09IHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQ29udHJvbENvbmZpZzxUPiBpcyBhIHR1cGxlIGNvbnRhaW5pbmcgYSB2YWx1ZSBvZiB0eXBlIFQsIHBsdXMgb3B0aW9uYWwgdmFsaWRhdG9ycyBhbmQgYXN5bmNcbiAqIHZhbGlkYXRvcnMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBDb250cm9sQ29uZmlnPFQ+ID0gW1R8Rm9ybUNvbnRyb2xTdGF0ZTxUPiwgKFZhbGlkYXRvckZufChWYWxpZGF0b3JGbltdKSk/LCAoQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW10pP107XG5cblxuLy8gRGlzYWJsZSBjbGFuZy1mb3JtYXQgdG8gcHJvZHVjZSBjbGVhcmVyIGZvcm1hdHRpbmcgZm9yIHRoaXMgbXVsdGlsaW5lIHR5cGUuXG4vLyBjbGFuZy1mb3JtYXQgb2ZmXG5cbi8qKlxuICogRm9ybUJ1aWxkZXIgYWNjZXB0cyB2YWx1ZXMgaW4gdmFyaW91cyBjb250YWluZXIgc2hhcGVzLCBhcyB3ZWxsIGFzIHJhdyB2YWx1ZXMuXG4gKiBFbGVtZW50IHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIGNvcnJlc3BvbmRpbmcgbW9kZWwgY2xhc3MsIGdpdmVuIHRoZSBjb250YWluZXIgVC5cbiAqIFRoZSBmbGFnIE4sIGlmIG5vdCBuZXZlciwgbWFrZXMgdGhlIHJlc3VsdGluZyBgRm9ybUNvbnRyb2xgIGhhdmUgTiBpbiBpdHMgdHlwZS5cbiAqL1xuZXhwb3J0IHR5cGUgybVFbGVtZW50PFQsIE4gZXh0ZW5kcyBudWxsPiA9XG4gIC8vIFRoZSBgZXh0ZW5kc2AgY2hlY2tzIGFyZSB3cmFwcGVkIGluIGFycmF5cyBpbiBvcmRlciB0byBwcmV2ZW50IFR5cGVTY3JpcHQgZnJvbSBhcHBseWluZyB0eXBlIHVuaW9uc1xuICAvLyB0aHJvdWdoIHRoZSBkaXN0cmlidXRpdmUgY29uZGl0aW9uYWwgdHlwZS4gVGhpcyBpcyB0aGUgb2ZmaWNpYWxseSByZWNvbW1lbmRlZCBzb2x1dGlvbjpcbiAgLy8gaHR0cHM6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL2RvY3MvaGFuZGJvb2svMi9jb25kaXRpb25hbC10eXBlcy5odG1sI2Rpc3RyaWJ1dGl2ZS1jb25kaXRpb25hbC10eXBlc1xuICAvL1xuICAvLyBJZGVudGlmeSBGb3JtQ29udHJvbCBjb250YWluZXIgdHlwZXMuXG4gIFtUXSBleHRlbmRzIFtGb3JtQ29udHJvbDxpbmZlciBVPl0gPyBGb3JtQ29udHJvbDxVPiA6XG4gIC8vIE9yIEZvcm1Db250cm9sIGNvbnRhaW5lcnMgdGhhdCBhcmUgb3B0aW9uYWwgaW4gdGhlaXIgcGFyZW50IGdyb3VwLlxuICBbVF0gZXh0ZW5kcyBbRm9ybUNvbnRyb2w8aW5mZXIgVT58dW5kZWZpbmVkXSA/IEZvcm1Db250cm9sPFU+IDpcbiAgLy8gRm9ybUdyb3VwIGNvbnRhaW5lcnMuXG4gIFtUXSBleHRlbmRzIFtGb3JtR3JvdXA8aW5mZXIgVT5dID8gRm9ybUdyb3VwPFU+IDpcbiAgLy8gT3B0aW9uYWwgRm9ybUdyb3VwIGNvbnRhaW5lcnMuXG4gIFtUXSBleHRlbmRzIFtGb3JtR3JvdXA8aW5mZXIgVT58dW5kZWZpbmVkXSA/IEZvcm1Hcm91cDxVPiA6XG4gIC8vIEZvcm1BcnJheSBjb250YWluZXJzLlxuICBbVF0gZXh0ZW5kcyBbRm9ybUFycmF5PGluZmVyIFU+XSA/IEZvcm1BcnJheTxVPiA6XG4gIC8vIE9wdGlvbmFsIEZvcm1BcnJheSBjb250YWluZXJzLlxuICBbVF0gZXh0ZW5kcyBbRm9ybUFycmF5PGluZmVyIFU+fHVuZGVmaW5lZF0gPyBGb3JtQXJyYXk8VT4gOlxuICAvLyBPdGhlcndpc2UgdW5rbm93biBBYnN0cmFjdENvbnRyb2wgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Fic3RyYWN0Q29udHJvbDxpbmZlciBVPl0gPyBBYnN0cmFjdENvbnRyb2w8VT4gOlxuICAvLyBPcHRpb25hbCBBYnN0cmFjdENvbnRyb2wgY29udGFpbmVycy5cbiAgW1RdIGV4dGVuZHMgW0Fic3RyYWN0Q29udHJvbDxpbmZlciBVPnx1bmRlZmluZWRdID8gQWJzdHJhY3RDb250cm9sPFU+IDpcbiAgLy8gRm9ybUNvbnRyb2xTdGF0ZSBvYmplY3QgY29udGFpbmVyLCB3aGljaCBwcm9kdWNlcyBhIG51bGxhYmxlIGNvbnRyb2wuXG4gIFtUXSBleHRlbmRzIFtGb3JtQ29udHJvbFN0YXRlPGluZmVyIFU+XSA/IEZvcm1Db250cm9sPFV8Tj4gOlxuICAvLyBBIENvbnRyb2xDb25maWcgdHVwbGUsIHdoaWNoIHByb2R1Y2VzIGEgbnVsbGFibGUgY29udHJvbC5cbiAgW1RdIGV4dGVuZHMgW0NvbnRyb2xDb25maWc8aW5mZXIgVT5dID8gRm9ybUNvbnRyb2w8VXxOPiA6XG4gIC8vIENvbnRyb2xDb25maWcgY2FuIGJlIHRvbyBtdWNoIGZvciB0aGUgY29tcGlsZXIgdG8gaW5mZXIgaW4gdGhlIHdyYXBwZWQgY2FzZS4gVGhpcyBpc1xuICAvLyBub3Qgc3VycHJpc2luZywgc2luY2UgaXQncyBwcmFjdGljYWxseSBkZWF0aC1ieS1wb2x5bW9ycGhpc20gKGUuZy4gdGhlIG9wdGlvbmFsIHZhbGlkYXRvcnNcbiAgLy8gbWVtYmVycyB0aGF0IG1pZ2h0IGJlIGFycmF5cykuIFdhdGNoIGZvciBDb250cm9sQ29uZmlncyB0aGF0IG1pZ2h0IGZhbGwgdGhyb3VnaC5cbiAgW1RdIGV4dGVuZHMgW0FycmF5PGluZmVyIFV8VmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXT5dID8gRm9ybUNvbnRyb2w8VXxOPiA6XG4gIC8vIEZhbGx0aG91Z2ggY2FzZTogVCBpcyBub3QgYSBjb250YWluZXIgdHlwZTsgdXNlIGl0IGRpcmVjdGx5IGFzIGEgdmFsdWUuXG4gIEZvcm1Db250cm9sPFR8Tj47XG5cbi8vIGNsYW5nLWZvcm1hdCBvblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhbiBgQWJzdHJhY3RDb250cm9sYCBmcm9tIGEgdXNlci1zcGVjaWZpZWQgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBUaGUgYEZvcm1CdWlsZGVyYCBwcm92aWRlcyBzeW50YWN0aWMgc3VnYXIgdGhhdCBzaG9ydGVucyBjcmVhdGluZyBpbnN0YW5jZXMgb2YgYVxuICogYEZvcm1Db250cm9sYCwgYEZvcm1Hcm91cGAsIG9yIGBGb3JtQXJyYXlgLiBJdCByZWR1Y2VzIHRoZSBhbW91bnQgb2YgYm9pbGVycGxhdGUgbmVlZGVkIHRvXG4gKiBidWlsZCBjb21wbGV4IGZvcm1zLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiBSZWFjdGl2ZUZvcm1zTW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBGb3JtQnVpbGRlciB7XG4gIHByaXZhdGUgdXNlTm9uTnVsbGFibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYSBGb3JtQnVpbGRlciBpbiB3aGljaCBhdXRvbWF0aWNhbGx5IGNvbnN0cnVjdGVkIEBzZWUgRm9ybUNvbnRyb2x9IGVsZW1lbnRzXG4gICAqIGhhdmUgYHtub25OdWxsYWJsZTogdHJ1ZX1gIGFuZCBhcmUgbm9uLW51bGxhYmxlLlxuICAgKlxuICAgKiAqKkNvbnN0cnVjdGluZyBub24tbnVsbGFibGUgY29udHJvbHMqKlxuICAgKlxuICAgKiBXaGVuIGNvbnN0cnVjdGluZyBhIGNvbnRyb2wsIGl0IHdpbGwgYmUgbm9uLW51bGxhYmxlLCBhbmQgd2lsbCByZXNldCB0byBpdHMgaW5pdGlhbCB2YWx1ZS5cbiAgICpcbiAgICogYGBgdHNcbiAgICogbGV0IG5uZmIgPSBuZXcgRm9ybUJ1aWxkZXIoKS5ub25OdWxsYWJsZTtcbiAgICogbGV0IG5hbWUgPSBubmZiLmNvbnRyb2woJ0FsZXgnKTsgLy8gRm9ybUNvbnRyb2w8c3RyaW5nPlxuICAgKiBuYW1lLnJlc2V0KCk7XG4gICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyAnQWxleCdcbiAgICogYGBgXG4gICAqXG4gICAqICoqQ29uc3RydWN0aW5nIG5vbi1udWxsYWJsZSBncm91cHMgb3IgYXJyYXlzKipcbiAgICpcbiAgICogV2hlbiBjb25zdHJ1Y3RpbmcgYSBncm91cCBvciBhcnJheSwgYWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpbm5lciBjb250cm9scyB3aWxsIGJlXG4gICAqIG5vbi1udWxsYWJsZSwgYW5kIHdpbGwgcmVzZXQgdG8gdGhlaXIgaW5pdGlhbCB2YWx1ZXMuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAqIGxldCBuYW1lID0gbm5mYi5ncm91cCh7d2hvOiAnQWxleCd9KTsgLy8gRm9ybUdyb3VwPHt3aG86IEZvcm1Db250cm9sPHN0cmluZz59PlxuICAgKiBuYW1lLnJlc2V0KCk7XG4gICAqIGNvbnNvbGUubG9nKG5hbWUpOyAvLyB7d2hvOiAnQWxleCd9XG4gICAqIGBgYFxuICAgKiAqKkNvbnN0cnVjdGluZyAqbnVsbGFibGUqIGZpZWxkcyBvbiBncm91cHMgb3IgYXJyYXlzKipcbiAgICpcbiAgICogSXQgaXMgc3RpbGwgcG9zc2libGUgdG8gaGF2ZSBhIG51bGxhYmxlIGZpZWxkLiBJbiBwYXJ0aWN1bGFyLCBhbnkgYEZvcm1Db250cm9sYCB3aGljaCBpc1xuICAgKiAqYWxyZWFkeSogY29uc3RydWN0ZWQgd2lsbCBub3QgYmUgYWx0ZXJlZC4gRm9yIGV4YW1wbGU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGxldCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCkubm9uTnVsbGFibGU7XG4gICAqIC8vIEZvcm1Hcm91cDx7d2hvOiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD59PlxuICAgKiBsZXQgbmFtZSA9IG5uZmIuZ3JvdXAoe3dobzogbmV3IEZvcm1Db250cm9sKCdBbGV4Jyl9KTtcbiAgICogbmFtZS5yZXNldCgpOyBjb25zb2xlLmxvZyhuYW1lKTsgLy8ge3dobzogbnVsbH1cbiAgICogYGBgXG4gICAqXG4gICAqIEJlY2F1c2UgdGhlIGlubmVyIGNvbnRyb2wgaXMgY29uc3RydWN0ZWQgZXhwbGljaXRseSBieSB0aGUgY2FsbGVyLCB0aGUgYnVpbGRlciBoYXNcbiAgICogbm8gY29udHJvbCBvdmVyIGhvdyBpdCBpcyBjcmVhdGVkLCBhbmQgY2Fubm90IGV4Y2x1ZGUgdGhlIGBudWxsYC5cbiAgICovXG4gIGdldCBub25OdWxsYWJsZSgpOiBOb25OdWxsYWJsZUZvcm1CdWlsZGVyIHtcbiAgICBjb25zdCBubmZiID0gbmV3IEZvcm1CdWlsZGVyKCk7XG4gICAgbm5mYi51c2VOb25OdWxsYWJsZSA9IHRydWU7XG4gICAgcmV0dXJuIG5uZmIgYXMgTm9uTnVsbGFibGVGb3JtQnVpbGRlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ29uc3RydWN0IGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIGFuIG9iamVjdFxuICAgKiBjb250YWluaW5nIGFsbCB0aGUga2V5cyBhbmQgY29ycmVzcG9uZGluZyBpbm5lciBjb250cm9sIHR5cGVzLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBvYmplY3QgZm9yIHRoZSBgRm9ybUdyb3VwYC4gVGhlIG9iamVjdCBzaG91bGQgaGF2ZSB0aGVcbiAgICogYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIHR5cGUgYW5kIG1pZ2h0IGNvbnRhaW4gdGhlIGZvbGxvd2luZyBmaWVsZHM6XG4gICAqICogYHZhbGlkYXRvcnNgOiBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2YgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICogKiBgYXN5bmNWYWxpZGF0b3JzYDogQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnMuXG4gICAqICogYHVwZGF0ZU9uYDogVGhlIGV2ZW50IHVwb24gd2hpY2ggdGhlIGNvbnRyb2wgc2hvdWxkIGJlIHVwZGF0ZWQgKG9wdGlvbnM6ICdjaGFuZ2UnIHwgJ2JsdXInXG4gICAqIHwgc3VibWl0JykuXG4gICAqL1xuICBncm91cDxUIGV4dGVuZHMge30+KFxuICAgICAgY29udHJvbHM6IFQsXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogRm9ybUdyb3VwPHtbSyBpbiBrZXlvZiBUXTogybVFbGVtZW50PFRbS10sIG51bGw+fT47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIFRoaXMgQVBJIGlzIG5vdCB0eXBlc2FmZSBhbmQgY2FuIHJlc3VsdCBpbiBpc3N1ZXMgd2l0aCBDbG9zdXJlIENvbXBpbGVyIHJlbmFtaW5nLlxuICAgKiBVc2UgdGhlIGBGb3JtQnVpbGRlciNncm91cGAgb3ZlcmxvYWQgd2l0aCBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2AgaW5zdGVhZC5cbiAgICogTm90ZSB0aGF0IGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBleHBlY3RzIGB2YWxpZGF0b3JzYCBhbmQgYGFzeW5jVmFsaWRhdG9yc2AgdG8gYmUgdmFsaWRcbiAgICogdmFsaWRhdG9ycy4gSWYgeW91IGhhdmUgY3VzdG9tIHZhbGlkYXRvcnMsIG1ha2Ugc3VyZSB0aGVpciB2YWxpZGF0aW9uIGZ1bmN0aW9uIHBhcmFtZXRlciBpc1xuICAgKiBgQWJzdHJhY3RDb250cm9sYCBhbmQgbm90IGEgc3ViLWNsYXNzLCBzdWNoIGFzIGBGb3JtR3JvdXBgLiBUaGVzZSBmdW5jdGlvbnMgd2lsbCBiZSBjYWxsZWRcbiAgICogd2l0aCBhbiBvYmplY3Qgb2YgdHlwZSBgQWJzdHJhY3RDb250cm9sYCBhbmQgdGhhdCBjYW5ub3QgYmUgYXV0b21hdGljYWxseSBkb3duY2FzdCB0byBhXG4gICAqIHN1YmNsYXNzLCBzbyBUeXBlU2NyaXB0IHNlZXMgdGhpcyBhcyBhbiBlcnJvci4gRm9yIGV4YW1wbGUsIGNoYW5nZSB0aGUgYChncm91cDogRm9ybUdyb3VwKSA9PlxuICAgKiBWYWxpZGF0aW9uRXJyb3JzfG51bGxgIHNpZ25hdHVyZSB0byBiZSBgKGdyb3VwOiBBYnN0cmFjdENvbnRyb2wpID0+IFZhbGlkYXRpb25FcnJvcnN8bnVsbGAuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBIHJlY29yZCBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCB0aGUgY29udHJvbCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgb2JqZWN0IGZvciB0aGUgYEZvcm1Hcm91cGAuIFRoZSBsZWdhY3kgY29uZmlndXJhdGlvblxuICAgKiBvYmplY3QgY29uc2lzdHMgb2Y6XG4gICAqICogYHZhbGlkYXRvcmA6IEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiB2YWxpZGF0b3IgZnVuY3Rpb25zLlxuICAgKiAqIGBhc3luY1ZhbGlkYXRvcmA6IEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqIE5vdGU6IHRoZSBsZWdhY3kgZm9ybWF0IGlzIGRlcHJlY2F0ZWQgYW5kIG1pZ2h0IGJlIHJlbW92ZWQgaW4gb25lIG9mIHRoZSBuZXh0IG1ham9yIHZlcnNpb25zXG4gICAqIG9mIEFuZ3VsYXIuXG4gICAqL1xuICBncm91cChcbiAgICAgIGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgIG9wdGlvbnM6IHtba2V5OiBzdHJpbmddOiBhbnl9LFxuICAgICAgKTogRm9ybUdyb3VwO1xuXG4gIGdyb3VwKGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogYW55fSwgb3B0aW9uczogQWJzdHJhY3RDb250cm9sT3B0aW9uc3x7W2tleTogc3RyaW5nXTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW55fXxudWxsID0gbnVsbCk6XG4gICAgICBGb3JtR3JvdXAge1xuICAgIGNvbnN0IHJlZHVjZWRDb250cm9scyA9IHRoaXMuX3JlZHVjZUNvbnRyb2xzKGNvbnRyb2xzKTtcbiAgICBsZXQgbmV3T3B0aW9uczogRm9ybUNvbnRyb2xPcHRpb25zID0ge307XG4gICAgaWYgKGlzQWJzdHJhY3RDb250cm9sT3B0aW9ucyhvcHRpb25zKSkge1xuICAgICAgLy8gYG9wdGlvbnNgIGFyZSBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2BcbiAgICAgIG5ld09wdGlvbnMgPSBvcHRpb25zO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucyAhPT0gbnVsbCkge1xuICAgICAgLy8gYG9wdGlvbnNgIGFyZSBsZWdhY3kgZm9ybSBncm91cCBvcHRpb25zXG4gICAgICBuZXdPcHRpb25zLnZhbGlkYXRvcnMgPSAob3B0aW9ucyBhcyBhbnkpLnZhbGlkYXRvcjtcbiAgICAgIG5ld09wdGlvbnMuYXN5bmNWYWxpZGF0b3JzID0gKG9wdGlvbnMgYXMgYW55KS5hc3luY1ZhbGlkYXRvcjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGb3JtR3JvdXAocmVkdWNlZENvbnRyb2xzLCBuZXdPcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBVc2UgYG5vbk51bGxhYmxlYCBpbnN0ZWFkLiAqL1xuICBjb250cm9sPFQ+KGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LCBvcHRzOiBGb3JtQ29udHJvbE9wdGlvbnMme1xuICAgIGluaXRpYWxWYWx1ZUlzRGVmYXVsdDogdHJ1ZVxuICB9KTogRm9ybUNvbnRyb2w8VD47XG5cbiAgY29udHJvbDxUPihmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPiwgb3B0czogRm9ybUNvbnRyb2xPcHRpb25zJntub25OdWxsYWJsZTogdHJ1ZX0pOlxuICAgICAgRm9ybUNvbnRyb2w8VD47XG5cbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIFdoZW4gcGFzc2luZyBhbiBgb3B0aW9uc2AgYXJndW1lbnQsIHRoZSBgYXN5bmNWYWxpZGF0b3JgIGFyZ3VtZW50IGhhcyBubyBlZmZlY3QuXG4gICAqL1xuICBjb250cm9sPFQ+KFxuICAgICAgZm9ybVN0YXRlOiBUfEZvcm1Db250cm9sU3RhdGU8VD4sIG9wdHM6IEZvcm1Db250cm9sT3B0aW9ucyxcbiAgICAgIGFzeW5jVmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXSk6IEZvcm1Db250cm9sPFR8bnVsbD47XG5cbiAgY29udHJvbDxUPihcbiAgICAgIGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxGb3JtQ29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1Db250cm9sPFR8bnVsbD47XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDb25zdHJ1Y3QgYSBuZXcgYEZvcm1Db250cm9sYCB3aXRoIHRoZSBnaXZlbiBzdGF0ZSwgdmFsaWRhdG9ycyBhbmQgb3B0aW9ucy4gU2V0XG4gICAqIGB7bm9uTnVsbGFibGU6IHRydWV9YCBpbiB0aGUgb3B0aW9ucyB0byBnZXQgYSBub24tbnVsbGFibGUgY29udHJvbC4gT3RoZXJ3aXNlLCB0aGVcbiAgICogY29udHJvbCB3aWxsIGJlIG51bGxhYmxlLiBBY2NlcHRzIGEgc2luZ2xlIGdlbmVyaWMgYXJndW1lbnQsIHdoaWNoIGlzIHRoZSB0eXBlICBvZiB0aGVcbiAgICogY29udHJvbCdzIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCBzdGF0ZSB2YWx1ZSwgb3JcbiAgICogd2l0aCBhbiBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYSBgRm9ybUNvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWluc1xuICAgKiB2YWxpZGF0aW9uIGZ1bmN0aW9ucyBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yXG4gICAqIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIEluaXRpYWxpemUgYSBjb250cm9sIGFzIGRpc2FibGVkXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSByZXR1cm5zIGEgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUgaW4gYSBkaXNhYmxlZCBzdGF0ZS5cbiAgICpcbiAgICogPGNvZGUtZXhhbXBsZSBwYXRoPVwiZm9ybXMvdHMvZm9ybUJ1aWxkZXIvZm9ybV9idWlsZGVyX2V4YW1wbGUudHNcIiByZWdpb249XCJkaXNhYmxlZC1jb250cm9sXCI+XG4gICAqIDwvY29kZS1leGFtcGxlPlxuICAgKi9cbiAgY29udHJvbDxUPihcbiAgICAgIGZvcm1TdGF0ZTogVHxGb3JtQ29udHJvbFN0YXRlPFQ+LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxGb3JtQ29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1Db250cm9sIHtcbiAgICBsZXQgbmV3T3B0aW9uczogRm9ybUNvbnRyb2xPcHRpb25zID0ge307XG4gICAgaWYgKCF0aGlzLnVzZU5vbk51bGxhYmxlKSB7XG4gICAgICByZXR1cm4gbmV3IEZvcm1Db250cm9sKGZvcm1TdGF0ZSwgdmFsaWRhdG9yT3JPcHRzLCBhc3luY1ZhbGlkYXRvcik7XG4gICAgfVxuICAgIGlmIChpc0Fic3RyYWN0Q29udHJvbE9wdGlvbnModmFsaWRhdG9yT3JPcHRzKSkge1xuICAgICAgLy8gSWYgdGhlIHNlY29uZCBhcmd1bWVudCBpcyBvcHRpb25zLCB0aGVuIHRoZXkgYXJlIGNvcGllZC5cbiAgICAgIG5ld09wdGlvbnMgPSB2YWxpZGF0b3JPck9wdHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIHRoZSBvdGhlciBhcmd1bWVudHMgYXJlIHZhbGlkYXRvcnMsIHRoZXkgYXJlIGNvcGllZCBpbnRvIGFuIG9wdGlvbnMgb2JqZWN0LlxuICAgICAgbmV3T3B0aW9ucy52YWxpZGF0b3JzID0gdmFsaWRhdG9yT3JPcHRzO1xuICAgICAgbmV3T3B0aW9ucy5hc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcjtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGb3JtQ29udHJvbDxUPihmb3JtU3RhdGUsIHsuLi5uZXdPcHRpb25zLCBub25OdWxsYWJsZTogdHJ1ZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgYEZvcm1BcnJheWAgZnJvbSB0aGUgZ2l2ZW4gYXJyYXkgb2YgY29uZmlndXJhdGlvbnMsXG4gICAqIHZhbGlkYXRvcnMgYW5kIG9wdGlvbnMuIEFjY2VwdHMgYSBzaW5nbGUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggaXMgdGhlIHR5cGUgb2YgZWFjaCBjb250cm9sXG4gICAqIGluc2lkZSB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scyBvciBjb250cm9sIGNvbmZpZ3MuIEVhY2ggY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhblxuICAgKiAgICAgaW5kZXggd2hlbiBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZiBzdWNoIGZ1bmN0aW9ucywgb3IgYW5cbiAgICogICAgIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWluc1xuICAgKiB2YWxpZGF0aW9uIGZ1bmN0aW9ucyBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9ucy5cbiAgICovXG4gIGFycmF5PFQ+KFxuICAgICAgY29udHJvbHM6IEFycmF5PFQ+LCB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1BcnJheTzJtUVsZW1lbnQ8VCwgbnVsbD4+IHtcbiAgICBjb25zdCBjcmVhdGVkQ29udHJvbHMgPSBjb250cm9scy5tYXAoYyA9PiB0aGlzLl9jcmVhdGVDb250cm9sKGMpKTtcbiAgICAvLyBDYXN0IHRvIGBhbnlgIGJlY2F1c2UgdGhlIGluZmVycmVkIHR5cGVzIGFyZSBub3QgYXMgc3BlY2lmaWMgYXMgRWxlbWVudC5cbiAgICByZXR1cm4gbmV3IEZvcm1BcnJheShjcmVhdGVkQ29udHJvbHMsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpIGFzIGFueTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZUNvbnRyb2xzPFQ+KGNvbnRyb2xzOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHtbazogc3RyaW5nXTogVHxDb250cm9sQ29uZmlnPFQ+fEZvcm1Db250cm9sU3RhdGU8VD58QWJzdHJhY3RDb250cm9sPFQ+fSk6XG4gICAgICB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7XG4gICAgY29uc3QgY3JlYXRlZENvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSA9IHt9O1xuICAgIE9iamVjdC5rZXlzKGNvbnRyb2xzKS5mb3JFYWNoKGNvbnRyb2xOYW1lID0+IHtcbiAgICAgIGNyZWF0ZWRDb250cm9sc1tjb250cm9sTmFtZV0gPSB0aGlzLl9jcmVhdGVDb250cm9sKGNvbnRyb2xzW2NvbnRyb2xOYW1lXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGNyZWF0ZWRDb250cm9scztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NyZWF0ZUNvbnRyb2w8VD4oY29udHJvbHM6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPnxDb250cm9sQ29uZmlnPFQ+fEZvcm1Db250cm9sPFQ+fFxuICAgICAgICAgICAgICAgICAgICBBYnN0cmFjdENvbnRyb2w8VD4pOiBGb3JtQ29udHJvbDxUPnxGb3JtQ29udHJvbDxUfG51bGw+fEFic3RyYWN0Q29udHJvbDxUPiB7XG4gICAgaWYgKGNvbnRyb2xzIGluc3RhbmNlb2YgRm9ybUNvbnRyb2wpIHtcbiAgICAgIHJldHVybiBjb250cm9scyBhcyBGb3JtQ29udHJvbDxUPjtcbiAgICB9IGVsc2UgaWYgKGNvbnRyb2xzIGluc3RhbmNlb2YgQWJzdHJhY3RDb250cm9sKSB7ICAvLyBBIGNvbnRyb2w7IGp1c3QgcmV0dXJuIGl0XG4gICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNvbnRyb2xzKSkgeyAgLy8gQ29udHJvbENvbmZpZyBUdXBsZVxuICAgICAgY29uc3QgdmFsdWU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPiA9IGNvbnRyb2xzWzBdO1xuICAgICAgY29uc3QgdmFsaWRhdG9yOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwgPSBjb250cm9scy5sZW5ndGggPiAxID8gY29udHJvbHNbMV0hIDogbnVsbDtcbiAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsID1cbiAgICAgICAgICBjb250cm9scy5sZW5ndGggPiAyID8gY29udHJvbHNbMl0hIDogbnVsbDtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2w8VD4odmFsdWUsIHZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3IpO1xuICAgIH0gZWxzZSB7ICAvLyBUIG9yIEZvcm1Db250cm9sU3RhdGU8VD5cbiAgICAgIHJldHVybiB0aGlzLmNvbnRyb2w8VD4oY29udHJvbHMpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogYE5vbk51bGxhYmxlRm9ybUJ1aWxkZXJgIGlzIHNpbWlsYXIgdG8ge0BsaW5rIEZvcm1CdWlsZGVyfSwgYnV0IGF1dG9tYXRpY2FsbHkgY29uc3RydWN0ZWRcbiAqIHtAbGluayBGb3JtQ29udHJvbH0gZWxlbWVudHMgaGF2ZSBge25vbk51bGxhYmxlOiB0cnVlfWAgYW5kIGFyZSBub24tbnVsbGFibGUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46IFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gIHVzZUZhY3Rvcnk6ICgpID0+IGluamVjdChGb3JtQnVpbGRlcikubm9uTnVsbGFibGUsXG59KVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5vbk51bGxhYmxlRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogU2ltaWxhciB0byBgRm9ybUJ1aWxkZXIjZ3JvdXBgLCBleGNlcHQgYW55IGltcGxpY2l0bHkgY29uc3RydWN0ZWQgYEZvcm1Db250cm9sYFxuICAgKiB3aWxsIGJlIG5vbi1udWxsYWJsZSAoaS5lLiBpdCB3aWxsIGhhdmUgYG5vbk51bGxhYmxlYCBzZXQgdG8gdHJ1ZSkuIE5vdGVcbiAgICogdGhhdCBhbHJlYWR5LWNvbnN0cnVjdGVkIGNvbnRyb2xzIHdpbGwgbm90IGJlIGFsdGVyZWQuXG4gICAqL1xuICBhYnN0cmFjdCBncm91cDxUIGV4dGVuZHMge30+KFxuICAgICAgY29udHJvbHM6IFQsXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogRm9ybUdyb3VwPHtbSyBpbiBrZXlvZiBUXTogybVFbGVtZW50PFRbS10sIG5ldmVyPn0+O1xuXG4gIC8qKlxuICAgKiBTaW1pbGFyIHRvIGBGb3JtQnVpbGRlciNhcnJheWAsIGV4Y2VwdCBhbnkgaW1wbGljaXRseSBjb25zdHJ1Y3RlZCBgRm9ybUNvbnRyb2xgXG4gICAqIHdpbGwgYmUgbm9uLW51bGxhYmxlIChpLmUuIGl0IHdpbGwgaGF2ZSBgbm9uTnVsbGFibGVgIHNldCB0byB0cnVlKS4gTm90ZVxuICAgKiB0aGF0IGFscmVhZHktY29uc3RydWN0ZWQgY29udHJvbHMgd2lsbCBub3QgYmUgYWx0ZXJlZC5cbiAgICovXG4gIGFic3RyYWN0IGFycmF5PFQ+KFxuICAgICAgY29udHJvbHM6IEFycmF5PFQ+LCB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IEZvcm1BcnJheTzJtUVsZW1lbnQ8VCwgbmV2ZXI+PjtcblxuICAvKipcbiAgICogU2ltaWxhciB0byBgRm9ybUJ1aWxkZXIjY29udHJvbGAsIGV4Y2VwdCB0aGlzIG92ZXJyaWRkZW4gdmVyc2lvbiBvZiBgY29udHJvbGAgZm9yY2VzXG4gICAqIGBub25OdWxsYWJsZWAgdG8gYmUgYHRydWVgLCByZXN1bHRpbmcgaW4gdGhlIGNvbnRyb2wgYWx3YXlzIGJlaW5nIG5vbi1udWxsYWJsZS5cbiAgICovXG4gIGFic3RyYWN0IGNvbnRyb2w8VD4oXG4gICAgICBmb3JtU3RhdGU6IFR8Rm9ybUNvbnRyb2xTdGF0ZTxUPixcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2w8VD47XG59XG5cbi8qKlxuICogVW50eXBlZEZvcm1CdWlsZGVyIGlzIHRoZSBzYW1lIGFzIEBzZWUgRm9ybUJ1aWxkZXIsIGJ1dCBpdCBwcm92aWRlcyB1bnR5cGVkIGNvbnRyb2xzLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogUmVhY3RpdmVGb3Jtc01vZHVsZX0pXG5leHBvcnQgY2xhc3MgVW50eXBlZEZvcm1CdWlsZGVyIGV4dGVuZHMgRm9ybUJ1aWxkZXIge1xuICAvKipcbiAgICogTGlrZSBgRm9ybUJ1aWxkZXIjZ3JvdXBgLCBleGNlcHQgdGhlIHJlc3VsdGluZyBncm91cCBpcyB1bnR5cGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zPzogQWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgKTogVW50eXBlZEZvcm1Hcm91cDtcblxuICAvKipcbiAgICogQGRlcHJlY2F0ZWQgVGhpcyBBUEkgaXMgbm90IHR5cGVzYWZlIGFuZCBjYW4gcmVzdWx0IGluIGlzc3VlcyB3aXRoIENsb3N1cmUgQ29tcGlsZXIgcmVuYW1pbmcuXG4gICAqIFVzZSB0aGUgYEZvcm1CdWlsZGVyI2dyb3VwYCBvdmVybG9hZCB3aXRoIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBpbnN0ZWFkLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiB7W2tleTogc3RyaW5nXTogYW55fSxcbiAgICAgICk6IFVudHlwZWRGb3JtR3JvdXA7XG5cbiAgb3ZlcnJpZGUgZ3JvdXAoXG4gICAgICBjb250cm9sc0NvbmZpZzoge1trZXk6IHN0cmluZ106IGFueX0sXG4gICAgICBvcHRpb25zOiBBYnN0cmFjdENvbnRyb2xPcHRpb25zfHtba2V5OiBzdHJpbmddOiBhbnl9fG51bGwgPSBudWxsKTogVW50eXBlZEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHN1cGVyLmdyb3VwKGNvbnRyb2xzQ29uZmlnLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaWtlIGBGb3JtQnVpbGRlciNjb250cm9sYCwgZXhjZXB0IHRoZSByZXN1bHRpbmcgY29udHJvbCBpcyB1bnR5cGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgY29udHJvbChcbiAgICAgIGZvcm1TdGF0ZTogYW55LCB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEZvcm1Db250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogVW50eXBlZEZvcm1Db250cm9sIHtcbiAgICByZXR1cm4gc3VwZXIuY29udHJvbChmb3JtU3RhdGUsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIExpa2UgYEZvcm1CdWlsZGVyI2FycmF5YCwgZXhjZXB0IHRoZSByZXN1bHRpbmcgYXJyYXkgaXMgdW50eXBlZC5cbiAgICovXG4gIG92ZXJyaWRlIGFycmF5KFxuICAgICAgY29udHJvbHNDb25maWc6IGFueVtdLFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiBVbnR5cGVkRm9ybUFycmF5IHtcbiAgICByZXR1cm4gc3VwZXIuYXJyYXkoY29udHJvbHNDb25maWcsIHZhbGlkYXRvck9yT3B0cywgYXN5bmNWYWxpZGF0b3IpO1xuICB9XG59XG4iXX0=