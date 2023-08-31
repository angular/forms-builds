/**
 * @license Angular v17.0.0-next.2+sha-b710ab6
 * (c) 2010-2022 Google LLC. https://angular.io/
 * License: MIT
 */


import { AfterViewInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import * as i0 from '@angular/core';
import { InjectionToken } from '@angular/core';
import { Injector } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Provider } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { Type } from '@angular/core';
import { Version } from '@angular/core';

/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * The first type parameter TValue represents the value type of the control (`control.value`).
 * The optional type parameter TRawValue  represents the raw value type (`control.getRawValue()`).
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 * @publicApi
 */
export declare abstract class AbstractControl<TValue = any, TRawValue extends TValue = TValue> {
    private _parent;
    private _asyncValidationSubscription;
    /**
     * The current value of the control.
     *
     * * For a `FormControl`, the current value.
     * * For an enabled `FormGroup`, the values of enabled controls as an object
     * with a key-value pair for each member of the group.
     * * For a disabled `FormGroup`, the values of all controls as an object
     * with a key-value pair for each member of the group.
     * * For a `FormArray`, the values of enabled controls as an array.
     *
     */
    readonly value: TValue;
    /**
     * Initialize the AbstractControl instance.
     *
     * @param validators The function or array of functions that is used to determine the validity of
     *     this control synchronously.
     * @param asyncValidators The function or array of functions that is used to determine validity of
     *     this control asynchronously.
     */
    constructor(validators: ValidatorFn | ValidatorFn[] | null, asyncValidators: AsyncValidatorFn | AsyncValidatorFn[] | null);
    /**
     * Returns the function that is used to determine the validity of this control synchronously.
     * If multiple validators have been added, this will be a single composed function.
     * See `Validators.compose()` for additional information.
     */
    get validator(): ValidatorFn | null;
    set validator(validatorFn: ValidatorFn | null);
    /**
     * Returns the function that is used to determine the validity of this control asynchronously.
     * If multiple validators have been added, this will be a single composed function.
     * See `Validators.compose()` for additional information.
     */
    get asyncValidator(): AsyncValidatorFn | null;
    set asyncValidator(asyncValidatorFn: AsyncValidatorFn | null);
    /**
     * The parent control.
     */
    get parent(): FormGroup | FormArray | null;
    /**
     * The validation status of the control.
     *
     * @see {@link FormControlStatus}
     *
     * These status values are mutually exclusive, so a control cannot be
     * both valid AND invalid or invalid AND disabled.
     */
    readonly status: FormControlStatus;
    /**
     * A control is `valid` when its `status` is `VALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control has passed all of its validation tests,
     * false otherwise.
     */
    get valid(): boolean;
    /**
     * A control is `invalid` when its `status` is `INVALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control has failed one or more of its validation checks,
     * false otherwise.
     */
    get invalid(): boolean;
    /**
     * A control is `pending` when its `status` is `PENDING`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control is in the process of conducting a validation check,
     * false otherwise.
     */
    get pending(): boolean;
    /**
     * A control is `disabled` when its `status` is `DISABLED`.
     *
     * Disabled controls are exempt from validation checks and
     * are not included in the aggregate value of their ancestor
     * controls.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control is disabled, false otherwise.
     */
    get disabled(): boolean;
    /**
     * A control is `enabled` as long as its `status` is not `DISABLED`.
     *
     * @returns True if the control has any status other than 'DISABLED',
     * false if the status is 'DISABLED'.
     *
     * @see {@link AbstractControl.status}
     *
     */
    get enabled(): boolean;
    /**
     * An object containing any errors generated by failing validation,
     * or null if there are no errors.
     */
    readonly errors: ValidationErrors | null;
    /**
     * A control is `pristine` if the user has not yet changed
     * the value in the UI.
     *
     * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
     * Programmatic changes to a control's value do not mark it dirty.
     */
    readonly pristine: boolean;
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
     * Programmatic changes to a control's value do not mark it dirty.
     */
    get dirty(): boolean;
    /**
     * True if the control is marked as `touched`.
     *
     * A control is marked `touched` once the user has triggered
     * a `blur` event on it.
     */
    readonly touched: boolean;
    /**
     * True if the control has not been marked as touched
     *
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     */
    get untouched(): boolean;
    /**
     * A multicasting observable that emits an event every time the value of the control changes, in
     * the UI or programmatically. It also emits an event each time you call enable() or disable()
     * without passing along {emitEvent: false} as a function argument.
     *
     * **Note**: the emit happens right after a value of this control is updated. The value of a
     * parent control (for example if this FormControl is a part of a FormGroup) is updated later, so
     * accessing a value of a parent control (using the `value` property) from the callback of this
     * event might result in getting a value that has not been updated yet. Subscribe to the
     * `valueChanges` event of the parent control instead.
     */
    readonly valueChanges: Observable<TValue>;
    /**
     * A multicasting observable that emits an event every time the validation `status` of the control
     * recalculates.
     *
     * @see {@link FormControlStatus}
     * @see {@link AbstractControl.status}
     *
     */
    readonly statusChanges: Observable<FormControlStatus>;
    /**
     * Reports the update strategy of the `AbstractControl` (meaning
     * the event on which the control updates itself).
     * Possible values: `'change'` | `'blur'` | `'submit'`
     * Default value: `'change'`
     */
    get updateOn(): FormHooks;
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this overwrites any existing synchronous validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * If you want to add a new validator without affecting existing ones, consider
     * using `addValidators()` method instead.
     */
    setValidators(validators: ValidatorFn | ValidatorFn[] | null): void;
    /**
     * Sets the asynchronous validators that are active on this control. Calling this
     * overwrites any existing asynchronous validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * If you want to add a new validator without affecting existing ones, consider
     * using `addAsyncValidators()` method instead.
     */
    setAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[] | null): void;
    /**
     * Add a synchronous validator or validators to this control, without affecting other validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * Adding a validator that already exists will have no effect. If duplicate validator functions
     * are present in the `validators` array, only the first instance would be added to a form
     * control.
     *
     * @param validators The new validator function or functions to add to this control.
     */
    addValidators(validators: ValidatorFn | ValidatorFn[]): void;
    /**
     * Add an asynchronous validator or validators to this control, without affecting other
     * validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * Adding a validator that already exists will have no effect.
     *
     * @param validators The new asynchronous validator function or functions to add to this control.
     */
    addAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void;
    /**
     * Remove a synchronous validator from this control, without affecting other validators.
     * Validators are compared by function reference; you must pass a reference to the exact same
     * validator function as the one that was originally set. If a provided validator is not found,
     * it is ignored.
     *
     * @usageNotes
     *
     * ### Reference to a ValidatorFn
     *
     * ```
     * // Reference to the RequiredValidator
     * const ctrl = new FormControl<string | null>('', Validators.required);
     * ctrl.removeValidators(Validators.required);
     *
     * // Reference to anonymous function inside MinValidator
     * const minValidator = Validators.min(3);
     * const ctrl = new FormControl<string | null>('', minValidator);
     * expect(ctrl.hasValidator(minValidator)).toEqual(true)
     * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
     *
     * ctrl.removeValidators(minValidator);
     * ```
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * @param validators The validator or validators to remove.
     */
    removeValidators(validators: ValidatorFn | ValidatorFn[]): void;
    /**
     * Remove an asynchronous validator from this control, without affecting other validators.
     * Validators are compared by function reference; you must pass a reference to the exact same
     * validator function as the one that was originally set. If a provided validator is not found, it
     * is ignored.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * @param validators The asynchronous validator or validators to remove.
     */
    removeAsyncValidators(validators: AsyncValidatorFn | AsyncValidatorFn[]): void;
    /**
     * Check whether a synchronous validator function is present on this control. The provided
     * validator must be a reference to the exact same function that was provided.
     *
     * @usageNotes
     *
     * ### Reference to a ValidatorFn
     *
     * ```
     * // Reference to the RequiredValidator
     * const ctrl = new FormControl<number | null>(0, Validators.required);
     * expect(ctrl.hasValidator(Validators.required)).toEqual(true)
     *
     * // Reference to anonymous function inside MinValidator
     * const minValidator = Validators.min(3);
     * const ctrl = new FormControl<number | null>(0, minValidator);
     * expect(ctrl.hasValidator(minValidator)).toEqual(true)
     * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
     * ```
     *
     * @param validator The validator to check for presence. Compared by function reference.
     * @returns Whether the provided validator was found on this control.
     */
    hasValidator(validator: ValidatorFn): boolean;
    /**
     * Check whether an asynchronous validator function is present on this control. The provided
     * validator must be a reference to the exact same function that was provided.
     *
     * @param validator The asynchronous validator to check for presence. Compared by function
     *     reference.
     * @returns Whether the provided asynchronous validator was found on this control.
     */
    hasAsyncValidator(validator: AsyncValidatorFn): boolean;
    /**
     * Empties out the synchronous validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearValidators(): void;
    /**
     * Empties out the async validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearAsyncValidators(): void;
    /**
     * Marks the control as `touched`. A control is touched by focus and
     * blur events that do not change the value.
     *
     * @see {@link markAsUntouched()}
     * @see {@link markAsDirty()}
     * @see {@link markAsPristine()}
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsTouched(opts?: {
        onlySelf?: boolean;
    }): void;
    /**
     * Marks the control and all its descendant controls as `touched`.
     * @see {@link markAsTouched()}
     */
    markAllAsTouched(): void;
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     * @see {@link markAsTouched()}
     * @see {@link markAsDirty()}
     * @see {@link markAsPristine()}
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after the marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsUntouched(opts?: {
        onlySelf?: boolean;
    }): void;
    /**
     * Marks the control as `dirty`. A control becomes dirty when
     * the control's value is changed through the UI; compare `markAsTouched`.
     *
     * @see {@link markAsTouched()}
     * @see {@link markAsUntouched()}
     * @see {@link markAsPristine()}
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsDirty(opts?: {
        onlySelf?: boolean;
    }): void;
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, marks all children as `pristine`,
     * and recalculates the `pristine` status of all parent
     * controls.
     *
     * @see {@link markAsTouched()}
     * @see {@link markAsUntouched()}
     * @see {@link markAsDirty()}
     *
     * @param opts Configuration options that determine how the control emits events after
     * marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsPristine(opts?: {
        onlySelf?: boolean;
    }): void;
    /**
     * Marks the control as `pending`.
     *
     * A control is pending while the control performs async validation.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates changes and
     * emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event with the latest status the control is marked pending.
     * When false, no events are emitted.
     *
     */
    markAsPending(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Disables the control. This means the control is exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children are also disabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control is disabled.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is disabled.
     * When false, no events are emitted.
     */
    disable(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Enables the control. This means the control is included in validation checks and
     * the aggregate value of its parent. Its status recalculates based on its value and
     * its validators.
     *
     * By default, if the control has children, all children are enabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configure options that control how the control propagates changes and
     * emits events when marked as untouched
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     */
    enable(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    private _updateAncestors;
    /**
     * Sets the parent of the control
     *
     * @param parent The new parent.
     */
    setParent(parent: FormGroup | FormArray | null): void;
    /**
     * Sets the value of the control. Abstract method (implemented in sub-classes).
     */
    abstract setValue(value: TRawValue, options?: Object): void;
    /**
     * Patches the value of the control. Abstract method (implemented in sub-classes).
     */
    abstract patchValue(value: TValue, options?: Object): void;
    /**
     * Resets the control. Abstract method (implemented in sub-classes).
     */
    abstract reset(value?: TValue, options?: Object): void;
    /**
     * The raw value of this control. For most control implementations, the raw value will include
     * disabled children.
     */
    getRawValue(): any;
    /**
     * Recalculates the value and validation status of the control.
     *
     * By default, it also updates the value and validity of its ancestors.
     *
     * @param opts Configuration options determine how the control propagates changes and emits events
     * after updates and validity checks are applied.
     * * `onlySelf`: When true, only update this control. When false or not supplied,
     * update all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is updated.
     * When false, no events are emitted.
     */
    updateValueAndValidity(opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    private _setInitialStatus;
    private _runValidator;
    private _runAsyncValidator;
    private _cancelExistingSubscription;
    /**
     * Sets errors on a form control when running validations manually, rather than automatically.
     *
     * Calling `setErrors` also updates the validity of the parent control.
     *
     * @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control errors are set.
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event after the errors are set.
     *
     * @usageNotes
     *
     * ### Manually set the errors for a control
     *
     * ```
     * const login = new FormControl('someLogin');
     * login.setErrors({
     *   notUnique: true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({ notUnique: true });
     *
     * login.setValue('someOtherLogin');
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    setErrors(errors: ValidationErrors | null, opts?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Retrieves a child control given the control's name or path.
     *
     * This signature for get supports strings and `const` arrays (`.get(['foo', 'bar'] as const)`).
     */
    get<P extends string | (readonly (string | number)[])>(path: P): AbstractControl<ɵGetProperty<TRawValue, P>> | null;
    /**
     * Retrieves a child control given the control's name or path.
     *
     * This signature for `get` supports non-const (mutable) arrays. Inferred type
     * information will not be as robust, so prefer to pass a `readonly` array if possible.
     */
    get<P extends string | Array<string | number>>(path: P): AbstractControl<ɵGetProperty<TRawValue, P>> | null;
    /**
     * @description
     * Reports error data for the control with the given path.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode: string, path?: Array<string | number> | string): any;
    /**
     * @description
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * If no path is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode: string, path?: Array<string | number> | string): boolean;
    /**
     * Retrieves the top-level ancestor of this control.
     */
    get root(): AbstractControl;
    private _calculateStatus;
    /**
     * Internal implementation of the `setValidators` method. Needs to be separated out into a
     * different method, because it is called in the constructor and it can break cases where
     * a control is extended.
     */
    private _assignValidators;
    /**
     * Internal implementation of the `setAsyncValidators` method. Needs to be separated out into a
     * different method, because it is called in the constructor and it can break cases where
     * a control is extended.
     */
    private _assignAsyncValidators;
}

/**
 * @description
 * Base class for control directives.
 *
 * This class is only used internally in the `ReactiveFormsModule` and the `FormsModule`.
 *
 * @publicApi
 */
export declare abstract class AbstractControlDirective {
    /**
     * @description
     * A reference to the underlying control.
     *
     * @returns the control that backs this directive. Most properties fall through to that instance.
     */
    abstract get control(): AbstractControl | null;
    /**
     * @description
     * Reports the value of the control if it is present, otherwise null.
     */
    get value(): any;
    /**
     * @description
     * Reports whether the control is valid. A control is considered valid if no
     * validation errors exist with the current value.
     * If the control is not present, null is returned.
     */
    get valid(): boolean | null;
    /**
     * @description
     * Reports whether the control is invalid, meaning that an error exists in the input value.
     * If the control is not present, null is returned.
     */
    get invalid(): boolean | null;
    /**
     * @description
     * Reports whether a control is pending, meaning that async validation is occurring and
     * errors are not yet available for the input value. If the control is not present, null is
     * returned.
     */
    get pending(): boolean | null;
    /**
     * @description
     * Reports whether the control is disabled, meaning that the control is disabled
     * in the UI and is exempt from validation checks and excluded from aggregate
     * values of ancestor controls. If the control is not present, null is returned.
     */
    get disabled(): boolean | null;
    /**
     * @description
     * Reports whether the control is enabled, meaning that the control is included in ancestor
     * calculations of validity or value. If the control is not present, null is returned.
     */
    get enabled(): boolean | null;
    /**
     * @description
     * Reports the control's validation errors. If the control is not present, null is returned.
     */
    get errors(): ValidationErrors | null;
    /**
     * @description
     * Reports whether the control is pristine, meaning that the user has not yet changed
     * the value in the UI. If the control is not present, null is returned.
     */
    get pristine(): boolean | null;
    /**
     * @description
     * Reports whether the control is dirty, meaning that the user has changed
     * the value in the UI. If the control is not present, null is returned.
     */
    get dirty(): boolean | null;
    /**
     * @description
     * Reports whether the control is touched, meaning that the user has triggered
     * a `blur` event on it. If the control is not present, null is returned.
     */
    get touched(): boolean | null;
    /**
     * @description
     * Reports the validation status of the control. Possible values include:
     * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
     * If the control is not present, null is returned.
     */
    get status(): string | null;
    /**
     * @description
     * Reports whether the control is untouched, meaning that the user has not yet triggered
     * a `blur` event on it. If the control is not present, null is returned.
     */
    get untouched(): boolean | null;
    /**
     * @description
     * Returns a multicasting observable that emits a validation status whenever it is
     * calculated for the control. If the control is not present, null is returned.
     */
    get statusChanges(): Observable<any> | null;
    /**
     * @description
     * Returns a multicasting observable of value changes for the control that emits every time the
     * value of the control changes in the UI or programmatically.
     * If the control is not present, null is returned.
     */
    get valueChanges(): Observable<any> | null;
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path(): string[] | null;
    /**
     * Contains the result of merging synchronous validators into a single validator function
     * (combined using `Validators.compose`).
     */
    private _composedValidatorFn;
    /**
     * Contains the result of merging asynchronous validators into a single validator function
     * (combined using `Validators.composeAsync`).
     */
    private _composedAsyncValidatorFn;
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators registered with this
     * directive.
     */
    get validator(): ValidatorFn | null;
    /**
     * @description
     * Asynchronous validator function composed of all the asynchronous validators registered with
     * this directive.
     */
    get asyncValidator(): AsyncValidatorFn | null;
    private _onDestroyCallbacks;
    /**
     * @description
     * Resets the control with the provided value if the control is present.
     */
    reset(value?: any): void;
    /**
     * @description
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * If no path is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode: string, path?: Array<string | number> | string): boolean;
    /**
     * @description
     * Reports error data for the control with the given path.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode: string, path?: Array<string | number> | string): any;
}

/**
 * Interface for options provided to an `AbstractControl`.
 *
 * @publicApi
 */
export declare interface AbstractControlOptions {
    /**
     * @description
     * The list of validators applied to a control.
     */
    validators?: ValidatorFn | ValidatorFn[] | null;
    /**
     * @description
     * The list of async validators applied to control.
     */
    asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
    /**
     * @description
     * The event name for control to update upon.
     */
    updateOn?: 'change' | 'blur' | 'submit';
}

declare class AbstractControlStatus {
    private _cd;
    constructor(cd: AbstractControlDirective | null);
    protected get isTouched(): boolean;
    protected get isUntouched(): boolean;
    protected get isPristine(): boolean;
    protected get isDirty(): boolean;
    protected get isValid(): boolean;
    protected get isInvalid(): boolean;
    protected get isPending(): boolean;
    protected get isSubmitted(): boolean;
}

/**
 * @description
 * A base class for code shared between the `NgModelGroup` and `FormGroupName` directives.
 *
 * @publicApi
 */
export declare class AbstractFormGroupDirective extends ControlContainer implements OnInit, OnDestroy {
    /** @nodoc */
    ngOnInit(): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * @description
     * The `FormGroup` bound to this directive.
     */
    get control(): FormGroup;
    /**
     * @description
     * The path to this group from the top-level directive.
     */
    get path(): string[];
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective(): Form | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractFormGroupDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AbstractFormGroupDirective, never, never, {}, {}, never, never, false, never>;
}

/**
 * A base class for Validator-based Directives. The class contains common logic shared across such
 * Directives.
 *
 * For internal use only, this class is not intended for use outside of the Forms package.
 */
declare abstract class AbstractValidatorDirective implements Validator, OnChanges {
    private _validator;
    private _onChange;
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /** @nodoc */
    validate(control: AbstractControl): ValidationErrors | null;
    /** @nodoc */
    registerOnValidatorChange(fn: () => void): void;
    /**
     * @description
     * Determines whether this validator should be active or not based on an input.
     * Base class implementation checks whether an input is defined (if the value is different from
     * `null` and `undefined`). Validator classes that extend this base class can override this
     * function with the logic specific to a particular validator directive.
     */
    enabled(input: unknown): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractValidatorDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AbstractValidatorDirective, never, never, {}, {}, never, never, false, never>;
}

/**
 * @description
 * An interface implemented by classes that perform asynchronous validation.
 *
 * @usageNotes
 *
 * ### Provide a custom async validator directive
 *
 * The following example implements the `AsyncValidator` interface to create an
 * async validator directive with a custom error key.
 *
 * ```typescript
 * import { of } from 'rxjs';
 *
 * @Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(control: AbstractControl): Observable<ValidationErrors|null> {
 *     return of({'custom': true});
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export declare interface AsyncValidator extends Validator {
    /**
     * @description
     * Method that performs async validation against the provided control.
     *
     * @param control The control to validate against.
     *
     * @returns A promise or observable that resolves a map of validation errors
     * if validation fails, otherwise null.
     */
    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}

/**
 * @description
 * A function that receives a control and returns a Promise or observable
 * that emits validation errors if present, otherwise null.
 *
 * @publicApi
 */
export declare interface AsyncValidatorFn {
    (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}

/**
 * Base class for all ControlValueAccessor classes defined in Forms package.
 * Contains common logic and utility functions.
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
declare class BaseControlValueAccessor {
    private _renderer;
    private _elementRef;
    /**
     * The registered callback function called when a change or input event occurs on the input
     * element.
     * @nodoc
     */
    onChange: (_: any) => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    /**
     * Helper method that sets a property on a target element using the current Renderer
     * implementation.
     * @nodoc
     */
    protected setProperty(key: string, value: any): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: any) => {}): void;
    /**
     * Sets the "disabled" property on the range input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BaseControlValueAccessor, never, never, {}, {}, never, never, false, never>;
}

/**
 * Base class for all built-in ControlValueAccessor classes (except DefaultValueAccessor, which is
 * used in case no other CVAs can be found). We use this class to distinguish between default CVA,
 * built-in CVAs and custom CVAs, so that Forms logic can recognize built-in CVAs and treat custom
 * ones with higher priority (when both built-in and custom CVAs are present).
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
declare class BuiltInControlValueAccessor extends BaseControlValueAccessor {
    static ɵfac: i0.ɵɵFactoryDeclaration<BuiltInControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BuiltInControlValueAccessor, never, never, {}, {}, never, never, false, never>;
}

/**
 * Token to provide to allow SetDisabledState to always be called when a CVA is added, regardless of
 * whether the control is disabled or enabled.
 *
 * @see {@link FormsModule#withconfig}
 */
declare const CALL_SET_DISABLED_STATE: InjectionToken<SetDisabledStateOption>;

/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const CHECKBOX_REQUIRED_VALIDATOR: Provider;

/**
 * @description
 * A `ControlValueAccessor` for writing a value and listening to changes on a checkbox input
 * element.
 *
 * @usageNotes
 *
 * ### Using a checkbox with a reactive form.
 *
 * The following example shows how to use a checkbox with a reactive form.
 *
 * ```ts
 * const rememberLoginControl = new FormControl();
 * ```
 *
 * ```
 * <input type="checkbox" [formControl]="rememberLoginControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class CheckboxControlValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /**
     * Sets the "checked" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CheckboxControlValueAccessor, "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]", never, {}, {}, never, never, false, never>;
}

/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required checkbox validator using template-driven forms
 *
 * The following example shows how to add a checkbox required validator to an input attached to an
 * ngModel binding.
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
export declare class CheckboxRequiredValidator extends RequiredValidator {
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxRequiredValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CheckboxRequiredValidator, "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", never, {}, {}, never, never, false, never>;
}

/**
 * @description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * @publicApi
 */
export declare const COMPOSITION_BUFFER_MODE: InjectionToken<boolean>;

/**
 * ControlConfig<T> is a tuple containing a value of type T, plus optional validators and async
 * validators.
 *
 * @publicApi
 */
export declare type ControlConfig<T> = [T | FormControlState<T>, (ValidatorFn | (ValidatorFn[]))?, (AsyncValidatorFn | AsyncValidatorFn[])?];

/**
 * @description
 * A base class for directives that contain multiple registered instances of `NgControl`.
 * Only used by the forms module.
 *
 * @publicApi
 */
export declare abstract class ControlContainer extends AbstractControlDirective {
    /**
     * @description
     * The name for the control
     */
    name: string | number | null;
    /**
     * @description
     * The top-level form directive for the control.
     */
    get formDirective(): Form | null;
    /**
     * @description
     * The path to this group.
     */
    get path(): string[] | null;
}

/**
 * @description
 * Defines an interface that acts as a bridge between the Angular forms API and a
 * native element in the DOM.
 *
 * Implement this interface to create a custom form control directive
 * that integrates with Angular forms.
 *
 * @see {@link DefaultValueAccessor}
 *
 * @publicApi
 */
export declare interface ControlValueAccessor {
    /**
     * @description
     * Writes a new value to the element.
     *
     * This method is called by the forms API to write to the view when programmatic
     * changes from model to view are requested.
     *
     * @usageNotes
     * ### Write a value to the element
     *
     * The following example writes a value to the native DOM element.
     *
     * ```ts
     * writeValue(value: any): void {
     *   this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
     * }
     * ```
     *
     * @param obj The new value for the element
     */
    writeValue(obj: any): void;
    /**
     * @description
     * Registers a callback function that is called when the control's value
     * changes in the UI.
     *
     * This method is called by the forms API on initialization to update the form
     * model when values propagate from the view to the model.
     *
     * When implementing the `registerOnChange` method in your own value accessor,
     * save the given function so your class calls it at the appropriate time.
     *
     * @usageNotes
     * ### Store the change function
     *
     * The following example stores the provided function as an internal method.
     *
     * ```ts
     * registerOnChange(fn: (_: any) => void): void {
     *   this._onChange = fn;
     * }
     * ```
     *
     * When the value changes in the UI, call the registered
     * function to allow the forms API to update itself:
     *
     * ```ts
     * host: {
     *    '(change)': '_onChange($event.target.value)'
     * }
     * ```
     *
     * @param fn The callback function to register
     */
    registerOnChange(fn: any): void;
    /**
     * @description
     * Registers a callback function that is called by the forms API on initialization
     * to update the form model on blur.
     *
     * When implementing `registerOnTouched` in your own value accessor, save the given
     * function so your class calls it when the control should be considered
     * blurred or "touched".
     *
     * @usageNotes
     * ### Store the callback function
     *
     * The following example stores the provided function as an internal method.
     *
     * ```ts
     * registerOnTouched(fn: any): void {
     *   this._onTouched = fn;
     * }
     * ```
     *
     * On blur (or equivalent), your class should call the registered function to allow
     * the forms API to update itself:
     *
     * ```ts
     * host: {
     *    '(blur)': '_onTouched()'
     * }
     * ```
     *
     * @param fn The callback function to register
     */
    registerOnTouched(fn: any): void;
    /**
     * @description
     * Function that is called by the forms API when the control status changes to
     * or from 'DISABLED'. Depending on the status, it enables or disables the
     * appropriate DOM element.
     *
     * @usageNotes
     * The following is an example of writing the disabled property to a native DOM element:
     *
     * ```ts
     * setDisabledState(isDisabled: boolean): void {
     *   this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
     * }
     * ```
     *
     * @param isDisabled The disabled status to set on the element
     */
    setDisabledState?(isDisabled: boolean): void;
}

declare const DEFAULT_VALUE_ACCESSOR: any;

/**
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * {@searchKeywords ngDefaultControl}
 *
 * @usageNotes
 *
 * ### Using the default value accessor
 *
 * The following example shows how to use an input element that activates the default value accessor
 * (in this case, a text field).
 *
 * ```ts
 * const firstNameControl = new FormControl();
 * ```
 *
 * ```
 * <input type="text" [formControl]="firstNameControl">
 * ```
 *
 * This value accessor is used by default for `<input type="text">` and `<textarea>` elements, but
 * you could also use it for custom components that have similar behavior and do not require special
 * processing. In order to attach the default value accessor to a custom element, add the
 * `ngDefaultControl` attribute as shown below.
 *
 * ```
 * <custom-input-component ngDefaultControl [(ngModel)]="value"></custom-input-component>
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class DefaultValueAccessor extends BaseControlValueAccessor implements ControlValueAccessor {
    private _compositionMode;
    /** Whether the user is creating a composition string (IME events). */
    private _composing;
    constructor(renderer: Renderer2, elementRef: ElementRef, _compositionMode: boolean);
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DefaultValueAccessor, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DefaultValueAccessor, "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]", never, {}, {}, never, never, false, never>;
}

/**
 * @description
 * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const EMAIL_VALIDATOR: any;

/**
 * A directive that adds the `email` validator to controls marked with the
 * `email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * The email validation is based on the WHATWG HTML specification with some enhancements to
 * incorporate more RFC rules. More information can be found on the [Validators.email
 * page](api/forms/Validators#email).
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding an email validator
 *
 * The following example shows how to add an email validator to an input attached to an ngModel
 * binding.
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
export declare class EmailValidator extends AbstractValidatorDirective {
    /**
     * @description
     * Tracks changes to the email attribute bound to this directive.
     */
    email: boolean | string;
    /** @nodoc */
    enabled(input: boolean): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmailValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<EmailValidator, "[email][formControlName],[email][formControl],[email][ngModel]", never, { "email": { "alias": "email"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * @description
 * An interface implemented by `FormGroupDirective` and `NgForm` directives.
 *
 * Only used by the `ReactiveFormsModule` and `FormsModule`.
 *
 * @publicApi
 */
export declare interface Form {
    /**
     * @description
     * Add a control to this form.
     *
     * @param dir The control directive to add to the form.
     */
    addControl(dir: NgControl): void;
    /**
     * @description
     * Remove a control from this form.
     *
     * @param dir: The control directive to remove from the form.
     */
    removeControl(dir: NgControl): void;
    /**
     * @description
     * The control directive from which to get the `FormControl`.
     *
     * @param dir: The control directive.
     */
    getControl(dir: NgControl): FormControl;
    /**
     * @description
     * Add a group of controls to this form.
     *
     * @param dir: The control group directive to add.
     */
    addFormGroup(dir: AbstractFormGroupDirective): void;
    /**
     * @description
     * Remove a group of controls to this form.
     *
     * @param dir: The control group directive to remove.
     */
    removeFormGroup(dir: AbstractFormGroupDirective): void;
    /**
     * @description
     * The `FormGroup` associated with a particular `AbstractFormGroupDirective`.
     *
     * @param dir: The form group directive from which to get the `FormGroup`.
     */
    getFormGroup(dir: AbstractFormGroupDirective): FormGroup;
    /**
     * @description
     * Update the model for a particular control with a new value.
     *
     * @param dir: The control directive to update.
     * @param value: The new value for the control.
     */
    updateModel(dir: NgControl, value: any): void;
}

/**
 * Tracks the value and validity state of an array of `FormControl`,
 * `FormGroup` or `FormArray` instances.
 *
 * A `FormArray` aggregates the values of each child `FormControl` into an array.
 * It calculates its status by reducing the status values of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` accepts one generic argument, which is the type of the controls inside.
 * If you need a heterogenous array, use {@link UntypedFormArray}.
 *
 * `FormArray` is one of the four fundamental building blocks used to define forms in Angular,
 * along with `FormControl`, `FormGroup`, and `FormRecord`.
 *
 * @usageNotes
 *
 * ### Create an array of form controls
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy', Validators.minLength(2)),
 *   new FormControl('Drew'),
 * ]);
 *
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * ### Create a form array with array-level validators
 *
 * You include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators are passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * ### Set the updateOn property for all controls in a form array
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const arr = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls from a form array
 *
 * To change the controls in the array, use the `push`, `insert`, `removeAt` or `clear` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that result in strange and unexpected behavior such
 * as broken change detection.
 *
 * @publicApi
 */
export declare class FormArray<TControl extends AbstractControl<any> = any> extends AbstractControl<ɵTypedOrUntyped<TControl, ɵFormArrayValue<TControl>, any>, ɵTypedOrUntyped<TControl, ɵFormArrayRawValue<TControl>, any>> {
    /**
     * Creates a new `FormArray` instance.
     *
     * @param controls An array of child controls. Each child control is given an index
     * where it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls: Array<TControl>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    controls: ɵTypedOrUntyped<TControl, Array<TControl>, Array<AbstractControl<any>>>;
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to retrieve the control. If `index` is negative, it will wrap
     *     around from the back, and if index is greatly negative (less than `-length`), the result is
     * undefined. This behavior is the same as `Array.at(index)`.
     */
    at(index: number): ɵTypedOrUntyped<TControl, TControl, AbstractControl<any>>;
    /**
     * Insert a new `AbstractControl` at the end of the array.
     *
     * @param control Form control to be inserted
     * @param options Specifies whether this FormArray instance should emit events after a new
     *     control is added.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * inserted. When false, no events are emitted.
     */
    push(control: TControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to insert the control. If `index` is negative, wraps around
     *     from the back. If `index` is greatly negative (less than `-length`), prepends to the array.
     * This behavior is the same as `Array.splice(index, 0, control)`.
     * @param control Form control to be inserted
     * @param options Specifies whether this FormArray instance should emit events after a new
     *     control is inserted.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * inserted. When false, no events are emitted.
     */
    insert(index: number, control: TControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param index Index in the array to remove the control.  If `index` is negative, wraps around
     *     from the back. If `index` is greatly negative (less than `-length`), removes the first
     *     element. This behavior is the same as `Array.splice(index, 1)`.
     * @param options Specifies whether this FormArray instance should emit events after a
     *     control is removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * removed. When false, no events are emitted.
     */
    removeAt(index: number, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Replace an existing control.
     *
     * @param index Index in the array to replace the control. If `index` is negative, wraps around
     *     from the back. If `index` is greatly negative (less than `-length`), replaces the first
     *     element. This behavior is the same as `Array.splice(index, 1, control)`.
     * @param control The `AbstractControl` control to replace the existing control
     * @param options Specifies whether this FormArray instance should emit events after an
     *     existing control is replaced with a new one.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * replaced with a new one. When false, no events are emitted.
     */
    setControl(index: number, control: TControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Length of the control array.
     */
    get length(): number;
    /**
     * Sets the value of the `FormArray`. It accepts an array that matches
     * the structure of the control.
     *
     * This method performs strict checks, and throws an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     * @usageNotes
     * ### Set the values for the controls in the form array
     *
     * ```
     * const arr = new FormArray([
     *   new FormControl(),
     *   new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.setValue(['Nancy', 'Drew']);
     * console.log(arr.value);   // ['Nancy', 'Drew']
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    setValue(value: ɵFormArrayRawValue<TControl>, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Patches the value of the `FormArray`. It accepts an array that matches the
     * structure of the control, and does its best to match the values to the correct
     * controls in the group.
     *
     * It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     * @usageNotes
     * ### Patch the values for controls in a form array
     *
     * ```
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.patchValue(['Nancy']);
     * console.log(arr.value);   // ['Nancy', null]
     * ```
     *
     * @param value Array of latest values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control
     * value is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value: ɵFormArrayValue<TControl>, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
     * value of all descendants to null or null maps.
     *
     * You reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state is a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * @usageNotes
     * ### Reset the values in a form array
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * arr.reset(['name', 'last name']);
     *
     * console.log(arr.value);  // ['name', 'last name']
     * ```
     *
     * ### Reset the values in a form array and the disabled status for the first control
     *
     * ```
     * arr.reset([
     *   {value: 'name', disabled: true},
     *   'last'
     * ]);
     *
     * console.log(arr.value);  // ['last']
     * console.log(arr.at(0).status);  // 'DISABLED'
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    reset(value?: ɵTypedOrUntyped<TControl, ɵFormArrayValue<TControl>, any>, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     */
    getRawValue(): ɵFormArrayRawValue<TControl>;
    /**
     * Remove all controls in the `FormArray`.
     *
     * @param options Specifies whether this FormArray instance should emit events after all
     *     controls are removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when all controls
     * in this FormArray instance are removed. When false, no events are emitted.
     *
     * @usageNotes
     * ### Remove all elements from a FormArray
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.length);  // 2
     *
     * arr.clear();
     * console.log(arr.length);  // 0
     * ```
     *
     * It's a simpler and more efficient alternative to removing all elements one by one:
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     *
     * while (arr.length) {
     *    arr.removeAt(0);
     * }
     * ```
     */
    clear(options?: {
        emitEvent?: boolean;
    }): void;
    private _registerControl;
}

/**
 * @description
 *
 * Syncs a nested `FormArray` to a DOM element.
 *
 * This directive is designed to be used with a parent `FormGroupDirective` (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the nested `FormArray` you want to link, and
 * will look for a `FormArray` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link AbstractControl}
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormArrayName extends ControlContainer implements OnInit, OnDestroy {
    /**
     * @description
     * Tracks the name of the `FormArray` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * Accepts a name as a string or a number.
     * The name in the form of a string is useful for individual forms,
     * while the numerical form allows for form arrays to be bound
     * to indices when iterating over arrays in a `FormArray`.
     */
    name: string | number | null;
    constructor(parent: ControlContainer, validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[]);
    /**
     * A lifecycle method called when the directive's inputs are initialized. For internal use only.
     * @throws If the directive does not have a valid parent.
     * @nodoc
     */
    ngOnInit(): void;
    /**
     * A lifecycle method called before the directive's instance is destroyed. For internal use only.
     * @nodoc
     */
    ngOnDestroy(): void;
    /**
     * @description
     * The `FormArray` bound to this directive.
     */
    get control(): FormArray;
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective(): FormGroupDirective | null;
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path(): string[];
    private _checkParentType;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormArrayName, [{ optional: true; host: true; skipSelf: true; }, { optional: true; self: true; }, { optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormArrayName, "[formArrayName]", never, { "name": { "alias": "formArrayName"; "required": false; }; }, {}, never, never, false, never>;
}

declare const formArrayNameProvider: any;

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
export declare class FormBuilder {
    private useNonNullable;
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
    get nonNullable(): NonNullableFormBuilder;
    /**
     * @description
     * Constructs a new `FormGroup` instance. Accepts a single generic argument, which is an object
     * containing all the keys and corresponding inner control types.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param options Configuration options object for the `FormGroup`. The object should have the
     * `AbstractControlOptions` type and might contain the following fields:
     * * `validators`: A synchronous validator function, or an array of validator functions.
     * * `asyncValidators`: A single async validator or array of async validator functions.
     * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
     * | submit').
     */
    group<T extends {}>(controls: T, options?: AbstractControlOptions | null): FormGroup<{
        [K in keyof T]: ɵElement<T[K], null>;
    }>;
    /**
     * @description
     * Constructs a new `FormGroup` instance.
     *
     * @deprecated This API is not typesafe and can result in issues with Closure Compiler renaming.
     * Use the `FormBuilder#group` overload with `AbstractControlOptions` instead.
     * Note that `AbstractControlOptions` expects `validators` and `asyncValidators` to be valid
     * validators. If you have custom validators, make sure their validation function parameter is
     * `AbstractControl` and not a sub-class, such as `FormGroup`. These functions will be called
     * with an object of type `AbstractControl` and that cannot be automatically downcast to a
     * subclass, so TypeScript sees this as an error. For example, change the `(group: FormGroup) =>
     * ValidationErrors|null` signature to be `(group: AbstractControl) => ValidationErrors|null`.
     *
     * @param controls A record of child controls. The key for each child is the name
     * under which the control is registered.
     *
     * @param options Configuration options object for the `FormGroup`. The legacy configuration
     * object consists of:
     * * `validator`: A synchronous validator function, or an array of validator functions.
     * * `asyncValidator`: A single async validator or array of async validator functions
     * Note: the legacy format is deprecated and might be removed in one of the next major versions
     * of Angular.
     */
    group(controls: {
        [key: string]: any;
    }, options: {
        [key: string]: any;
    }): FormGroup;
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
    record<T>(controls: {
        [key: string]: T;
    }, options?: AbstractControlOptions | null): FormRecord<ɵElement<T, null>>;
    /** @deprecated Use `nonNullable` instead. */
    control<T>(formState: T | FormControlState<T>, opts: FormControlOptions & {
        initialValueIsDefault: true;
    }): FormControl<T>;
    control<T>(formState: T | FormControlState<T>, opts: FormControlOptions & {
        nonNullable: true;
    }): FormControl<T>;
    /**
     * @deprecated When passing an `options` argument, the `asyncValidator` argument has no effect.
     */
    control<T>(formState: T | FormControlState<T>, opts: FormControlOptions, asyncValidator: AsyncValidatorFn | AsyncValidatorFn[]): FormControl<T | null>;
    control<T>(formState: T | FormControlState<T>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControl<T | null>;
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
    array<T>(controls: Array<T>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormArray<ɵElement<T, null>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormBuilder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FormBuilder>;
}

/**
 * Tracks the value and validation status of an individual form control.
 *
 * This is one of the four fundamental building blocks of Angular forms, along with
 * `FormGroup`, `FormArray` and `FormRecord`. It extends the `AbstractControl` class that
 * implements most of the base functionality for accessing the value, validation status,
 * user interactions and events.
 *
 * `FormControl` takes a single generic argument, which describes the type of its value. This
 * argument always implicitly includes `null` because the control can be reset. To change this
 * behavior, set `nonNullable` or see the usage notes below.
 *
 * See [usage examples below](#usage-notes).
 *
 * @see {@link AbstractControl}
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see [Usage Notes](#usage-notes)
 *
 * @publicApi
 *
 * @overriddenImplementation ɵFormControlCtor
 *
 * @usageNotes
 *
 * ### Initializing Form Controls
 *
 * Instantiate a `FormControl`, with an initial value.
 *
 * ```ts
 * const control = new FormControl('some value');
 * console.log(control.value);     // 'some value'
 * ```
 *
 * The following example initializes the control with a form state object. The `value`
 * and `disabled` keys are required in this case.
 *
 * ```ts
 * const control = new FormControl({ value: 'n/a', disabled: true });
 * console.log(control.value);     // 'n/a'
 * console.log(control.status);    // 'DISABLED'
 * ```
 *
 * The following example initializes the control with a synchronous validator.
 *
 * ```ts
 * const control = new FormControl('', Validators.required);
 * console.log(control.value);      // ''
 * console.log(control.status);     // 'INVALID'
 * ```
 *
 * The following example initializes the control using an options object.
 *
 * ```ts
 * const control = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * ### The single type argument
 *
 * `FormControl` accepts a generic argument, which describes the type of its value.
 * In most cases, this argument will be inferred.
 *
 * If you are initializing the control to `null`, or you otherwise wish to provide a
 * wider type, you may specify the argument explicitly:
 *
 * ```
 * let fc = new FormControl<string|null>(null);
 * fc.setValue('foo');
 * ```
 *
 * You might notice that `null` is always added to the type of the control.
 * This is because the control will become `null` if you call `reset`. You can change
 * this behavior by setting `{nonNullable: true}`.
 *
 * ### Configure the control to update on a blur event
 *
 * Set the `updateOn` option to `'blur'` to update on the blur `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * ### Configure the control to update on a submit event
 *
 * Set the `updateOn` option to `'submit'` to update on a submit `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'submit' });
 * ```
 *
 * ### Reset the control back to a specific value
 *
 * You reset to a specific form state by passing through a standalone
 * value or a form state object that contains both a value and a disabled state
 * (these are the only two properties that cannot be calculated).
 *
 * ```ts
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 *
 * control.reset('Drew');
 *
 * console.log(control.value); // 'Drew'
 * ```
 *
 * ### Reset the control to its initial value
 *
 * If you wish to always reset the control to its initial value (instead of null),
 * you can pass the `nonNullable` option:
 *
 * ```
 * const control = new FormControl('Nancy', {nonNullable: true});
 *
 * console.log(control.value); // 'Nancy'
 *
 * control.reset();
 *
 * console.log(control.value); // 'Nancy'
 * ```
 *
 * ### Reset the control back to an initial value and disabled
 *
 * ```
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 * console.log(control.status); // 'VALID'
 *
 * control.reset({ value: 'Drew', disabled: true });
 *
 * console.log(control.value); // 'Drew'
 * console.log(control.status); // 'DISABLED'
 * ```
 */
export declare interface FormControl<TValue = any> extends AbstractControl<TValue> {
    /**
     * The default value of this FormControl, used whenever the control is reset without an explicit
     * value. See {@link FormControlOptions#nonNullable} for more information on configuring
     * a default value.
     */
    readonly defaultValue: TValue;
    /**
     * Sets a new value for the form control.
     *
     * @param value The new value for the control.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * * `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an
     * `onChange` event to
     * update the view.
     * * `emitViewToModelChange`: When true or not supplied (the default), each change triggers an
     * `ngModelChange`
     * event to update the model.
     *
     */
    setValue(value: TValue, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    }): void;
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     *
     * @see {@link FormControl#setValue} for options
     */
    patchValue(value: TValue, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    }): void;
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and resetting
     * the value. The new value will be the provided value (if passed), `null`, or the initial value
     * if `nonNullable` was set in the constructor via {@link FormControlOptions}.
     *
     * ```ts
     * // By default, the control will reset to null.
     * const dog = new FormControl('spot');
     * dog.reset(); // dog.value is null
     *
     * // If this flag is set, the control will instead reset to the initial value.
     * const cat = new FormControl('tabby', {nonNullable: true});
     * cat.reset(); // cat.value is "tabby"
     *
     * // A value passed to reset always takes precedence.
     * const fish = new FormControl('finn', {nonNullable: true});
     * fish.reset('bubble'); // fish.value is "bubble"
     * ```
     *
     * @param formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     *
     */
    reset(formState?: TValue | FormControlState<TValue>, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * For a simple FormControl, the raw value is equivalent to the value.
     */
    getRawValue(): TValue;
    /**
     * Register a listener for change events.
     *
     * @param fn The method that is called when the value changes
     */
    registerOnChange(fn: Function): void;
    /**
     * Register a listener for disabled events.
     *
     * @param fn The method that is called when the disabled status changes.
     */
    registerOnDisabledChange(fn: (isDisabled: boolean) => void): void;
}

export declare const FormControl: ɵFormControlCtor;

/**
 * @description
 * Synchronizes a standalone `FormControl` instance to a form control element.
 *
 * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives was deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link FormControl}
 * @see {@link AbstractControl}
 *
 * @usageNotes
 *
 * The following example shows how to register a standalone control and set its value.
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormControlDirective extends NgControl implements OnChanges, OnDestroy {
    private _ngModelWarningConfig;
    private callSetDisabledState?;
    /**
     * Internal reference to the view model value.
     * @nodoc
     */
    viewModel: any;
    /**
     * @description
     * Tracks the `FormControl` instance bound to the directive.
     */
    form: FormControl;
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled: boolean);
    /** @deprecated as of v6 */
    model: any;
    /** @deprecated as of v6 */
    update: EventEmitter<any>;
    constructor(validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[], valueAccessors: ControlValueAccessor[], _ngModelWarningConfig: string | null, callSetDisabledState?: SetDisabledStateOption | undefined);
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path(): string[];
    /**
     * @description
     * The `FormControl` bound to this directive.
     */
    get control(): FormControl;
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue: any): void;
    private _isControlChanged;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormControlDirective, [{ optional: true; self: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormControlDirective, "[formControl]", ["ngForm"], { "form": { "alias": "formControl"; "required": false; }; "isDisabled": { "alias": "disabled"; "required": false; }; "model": { "alias": "ngModel"; "required": false; }; }, { "update": "ngModelChange"; }, never, never, false, never>;
}

/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link FormControl}
 * @see {@link AbstractControl}
 *
 * @usageNotes
 *
 * ### Register `FormControl` within a group
 *
 * The following example shows how to register multiple form controls within a form group
 * and set their value.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel is deprecated
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 *
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormControlName extends NgControl implements OnChanges, OnDestroy {
    private _ngModelWarningConfig;
    private _added;
    /**
     * @description
     * Tracks the `FormControl` instance bound to the directive.
     */
    readonly control: FormControl;
    /**
     * @description
     * Tracks the name of the `FormControl` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * Accepts a name as a string or a number.
     * The name in the form of a string is useful for individual forms,
     * while the numerical form allows for form controls to be bound
     * to indices when iterating over controls in a `FormArray`.
     */
    name: string | number | null;
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled: boolean);
    /** @deprecated as of v6 */
    model: any;
    /** @deprecated as of v6 */
    update: EventEmitter<any>;
    constructor(parent: ControlContainer, validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[], valueAccessors: ControlValueAccessor[], _ngModelWarningConfig: string | null);
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue: any): void;
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path(): string[];
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective(): any;
    private _checkParentType;
    private _setUpControl;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormControlName, [{ optional: true; host: true; skipSelf: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormControlName, "[formControlName]", never, { "name": { "alias": "formControlName"; "required": false; }; "isDisabled": { "alias": "disabled"; "required": false; }; "model": { "alias": "ngModel"; "required": false; }; }, { "update": "ngModelChange"; }, never, never, false, never>;
}

/**
 * Interface for options provided to a `FormControl`.
 *
 * This interface extends all options from {@link AbstractControlOptions}, plus some options
 * unique to `FormControl`.
 *
 * @publicApi
 */
export declare interface FormControlOptions extends AbstractControlOptions {
    /**
     * @description
     * Whether to use the initial value used to construct the `FormControl` as its default value
     * as well. If this option is false or not provided, the default value of a FormControl is `null`.
     * When a FormControl is reset without an explicit value, its value reverts to
     * its default value.
     */
    nonNullable?: boolean;
    /**
     * @deprecated Use `nonNullable` instead.
     */
    initialValueIsDefault?: boolean;
}

/**
 * FormControlState is a boxed form value. It is an object with a `value` key and a `disabled` key.
 *
 * @publicApi
 */
export declare interface FormControlState<T> {
    value: T;
    disabled: boolean;
}

/**
 * A form can have several different statuses. Each
 * possible status is returned as a string literal.
 *
 * * **VALID**: Reports that a control is valid, meaning that no errors exist in the input
 * value.
 * * **INVALID**: Reports that a control is invalid, meaning that an error exists in the input
 * value.
 * * **PENDING**: Reports that a control is pending, meaning that async validation is
 * occurring and errors are not yet available for the input value.
 * * **DISABLED**: Reports that a control is
 * disabled, meaning that the control is exempt from ancestor calculations of validity or value.
 *
 * @publicApi
 */
export declare type FormControlStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the four fundamental building blocks used to define forms in Angular,
 * along with `FormControl`, `FormArray`, and `FormRecord`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * `FormGroup` is intended for use cases where the keys are known ahead of time.
 * If you need to dynamically add and remove controls, use {@link FormRecord} instead.
 *
 * `FormGroup` accepts an optional type parameter `TControl`, which is an object type with inner
 * control types as values.
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### The type argument, and optional controls
 *
 * `FormGroup` accepts one generic argument, which is an object containing its inner controls.
 * This type will usually be inferred automatically, but you can always specify it explicitly if you
 * wish.
 *
 * If you have controls that are optional (i.e. they can be removed, you can use the `?` in the
 * type):
 *
 * ```
 * const form = new FormGroup<{
 *   first: FormControl<string|null>,
 *   middle?: FormControl<string|null>, // Middle name is optional.
 *   last: FormControl<string|null>,
 * }>({
 *   first: new FormControl('Nancy'),
 *   last: new FormControl('Drew'),
 * });
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 *
 * ### Using a FormGroup with optional controls
 *
 * It is possible to have optional controls in a FormGroup. An optional control can be removed later
 * using `removeControl`, and can be omitted when calling `reset`. Optional controls must be
 * declared optional in the group's type.
 *
 * ```ts
 * const c = new FormGroup<{one?: FormControl<string>}>({
 *   one: new FormControl('')
 * });
 * ```
 *
 * Notice that `c.value.one` has type `string|null|undefined`. This is because calling `c.reset({})`
 * without providing the optional key `one` will cause it to become `null`.
 *
 * @publicApi
 */
export declare class FormGroup<TControl extends {
    [K in keyof TControl]: AbstractControl<any>;
} = any> extends AbstractControl<ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any>, ɵTypedOrUntyped<TControl, ɵFormGroupRawValue<TControl>, any>> {
    /**
     * Creates a new `FormGroup` instance.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls: TControl, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    controls: ɵTypedOrUntyped<TControl, TControl, {
        [key: string]: AbstractControl<any>;
    }>;
    /**
     * Registers a control with the group's list of controls. In a strongly-typed group, the control
     * must be in the group's type (possibly as an optional key).
     *
     * This method does not update the value or validity of the control.
     * Use {@link FormGroup#addControl addControl} instead.
     *
     * @param name The control name to register in the collection
     * @param control Provides the control for the given name
     */
    registerControl<K extends string & keyof TControl>(name: K, control: TControl[K]): TControl[K];
    registerControl(this: FormGroup<{
        [key: string]: AbstractControl<any>;
    }>, name: string, control: AbstractControl<any>): AbstractControl<any>;
    /**
     * Add a control to this group. In a strongly-typed group, the control must be in the group's type
     * (possibly as an optional key).
     *
     * If a control with a given name already exists, it would *not* be replaced with a new one.
     * If you want to replace an existing control, use the {@link FormGroup#setControl setControl}
     * method instead. This method also updates the value and validity of the control.
     *
     * @param name The control name to add to the collection
     * @param control Provides the control for the given name
     * @param options Specifies whether this FormGroup instance should emit events after a new
     *     control is added.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * added. When false, no events are emitted.
     */
    addControl(this: FormGroup<{
        [key: string]: AbstractControl<any>;
    }>, name: string, control: AbstractControl, options?: {
        emitEvent?: boolean;
    }): void;
    addControl<K extends string & keyof TControl>(name: K, control: Required<TControl>[K], options?: {
        emitEvent?: boolean;
    }): void;
    removeControl(this: FormGroup<{
        [key: string]: AbstractControl<any>;
    }>, name: string, options?: {
        emitEvent?: boolean;
    }): void;
    removeControl<S extends string>(name: ɵOptionalKeys<TControl> & S, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Replace an existing control. In a strongly-typed group, the control must be in the group's type
     * (possibly as an optional key).
     *
     * If a control with a given name does not exist in this `FormGroup`, it will be added.
     *
     * @param name The control name to replace in the collection
     * @param control Provides the control for the given name
     * @param options Specifies whether this FormGroup instance should emit events after an
     *     existing control is replaced.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * replaced with a new one. When false, no events are emitted.
     */
    setControl<K extends string & keyof TControl>(name: K, control: TControl[K], options?: {
        emitEvent?: boolean;
    }): void;
    setControl(this: FormGroup<{
        [key: string]: AbstractControl<any>;
    }>, name: string, control: AbstractControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * Reports false for disabled controls. If you'd like to check for existence in the group
     * only, use {@link AbstractControl#get get} instead.
     *
     * @param controlName The control name to check for existence in the collection
     *
     * @returns false for disabled controls, true otherwise.
     */
    contains<K extends string>(controlName: K): boolean;
    contains(this: FormGroup<{
        [key: string]: AbstractControl<any>;
    }>, controlName: string): boolean;
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * @usageNotes
     * ### Set the complete value for the form group
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl(),
     *   last: new FormControl()
     * });
     *
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.setValue({first: 'Nancy', last: 'Drew'});
     * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     * ```
     *
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you exclude a value of a control that does exist.
     *
     * @param value The new value for the control that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     */
    setValue(value: ɵFormGroupRawValue<TControl>, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * @usageNotes
     * ### Patch the value for a form group
     *
     * ```
     * const form = new FormGroup({
     *    first: new FormControl(),
     *    last: new FormControl()
     * });
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.patchValue({first: 'Nancy'});
     * console.log(form.value);   // {first: 'Nancy', last: null}
     * ```
     *
     * @param value The object that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control value
     * is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value: ɵFormGroupValue<TControl>, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
     * the value of all descendants to their default values, or null if no defaults were provided.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * @param value Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * @usageNotes
     *
     * ### Reset the form group values
     *
     * ```ts
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * console.log(form.value);  // {first: 'first name', last: 'last name'}
     *
     * form.reset({ first: 'name', last: 'last name' });
     *
     * console.log(form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * ### Reset the form group values and disabled status
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(form.value);  // {last: 'last'}
     * console.log(form.get('first').status);  // 'DISABLED'
     * ```
     */
    reset(value?: ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any>, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     */
    getRawValue(): ɵTypedOrUntyped<TControl, ɵFormGroupRawValue<TControl>, any>;
}

/**
 * @description
 *
 * Binds an existing `FormGroup` or `FormRecord` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`/`FormRecord`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see {@link AbstractControl}
 *
 * @usageNotes
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormGroupDirective extends ControlContainer implements Form, OnChanges, OnDestroy {
    private callSetDisabledState?;
    /**
     * @description
     * Reports whether the form submission has been triggered.
     */
    readonly submitted: boolean;
    /**
     * Reference to an old form group input value, which is needed to cleanup old instance in case it
     * was replaced with a new one.
     */
    private _oldForm;
    /**
     * Callback that should be invoked when controls in FormGroup or FormArray collection change
     * (added or removed). This callback triggers corresponding DOM updates.
     */
    private readonly _onCollectionChange;
    /**
     * @description
     * Tracks the list of added `FormControlName` instances
     */
    directives: FormControlName[];
    /**
     * @description
     * Tracks the `FormGroup` bound to this directive.
     */
    form: FormGroup;
    /**
     * @description
     * Emits an event when the form submission has been triggered.
     */
    ngSubmit: EventEmitter<any>;
    constructor(validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[], callSetDisabledState?: SetDisabledStateOption | undefined);
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective(): Form;
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control(): FormGroup;
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path(): string[];
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir: FormControlName): FormControl;
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir: FormControlName): FormControl;
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir: FormControlName): void;
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir: FormGroupName): void;
    /**
     * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir: FormGroupName): void;
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir: FormGroupName): FormGroup;
    /**
     * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir: FormArrayName): void;
    /**
     * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir: FormArrayName): void;
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir: FormArrayName): FormArray;
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir: FormControlName, value: any): void;
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event: Event): boolean;
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset(): void;
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value?: any): void;
    private _setUpFormContainer;
    private _cleanUpFormContainer;
    private _updateRegistrations;
    private _updateValidators;
    private _checkFormPresent;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormGroupDirective, [{ optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormGroupDirective, "[formGroup]", ["ngForm"], { "form": { "alias": "formGroup"; "required": false; }; }, { "ngSubmit": "ngSubmit"; }, never, never, false, never>;
}

/**
 * @description
 *
 * Syncs a nested `FormGroup` or `FormRecord` to a DOM element.
 *
 * This directive can only be used with a parent `FormGroupDirective`.
 *
 * It accepts the string name of the nested `FormGroup` or `FormRecord` to link, and
 * looks for a `FormGroup` or `FormRecord` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * Use nested form groups to validate a sub-group of a
 * form separately from the rest or to group the values of certain
 * controls into their own nested object.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @usageNotes
 *
 * ### Access the group by name
 *
 * The following example uses the `AbstractControl.get` method to access the
 * associated `FormGroup`
 *
 * ```ts
 *   this.form.get('name');
 * ```
 *
 * ### Access individual controls in the group
 *
 * The following example uses the `AbstractControl.get` method to access
 * individual controls within the group using dot syntax.
 *
 * ```ts
 *   this.form.get('name.first');
 * ```
 *
 * ### Register a nested `FormGroup`.
 *
 * The following example registers a nested *name* `FormGroup` within an existing `FormGroup`,
 * and provides methods to retrieve the nested `FormGroup` and individual controls.
 *
 * {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormGroupName extends AbstractFormGroupDirective implements OnInit, OnDestroy {
    /**
     * @description
     * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * Accepts a name as a string or a number.
     * The name in the form of a string is useful for individual forms,
     * while the numerical form allows for form groups to be bound
     * to indices when iterating over groups in a `FormArray`.
     */
    name: string | number | null;
    constructor(parent: ControlContainer, validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<FormGroupName, [{ optional: true; host: true; skipSelf: true; }, { optional: true; self: true; }, { optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormGroupName, "[formGroupName]", never, { "name": { "alias": "formGroupName"; "required": false; }; }, {}, never, never, false, never>;
}

declare type FormHooks = 'change' | 'blur' | 'submit';

/**
 * Tracks the value and validity state of a collection of `FormControl` instances, each of which has
 * the same value type.
 *
 * `FormRecord` is very similar to {@link FormGroup}, except it can be used with a dynamic keys,
 * with controls added and removed as needed.
 *
 * `FormRecord` accepts one generic argument, which describes the type of the controls it contains.
 *
 * @usageNotes
 *
 * ```
 * let numbers = new FormRecord({bill: new FormControl('415-123-456')});
 * numbers.addControl('bob', new FormControl('415-234-567'));
 * numbers.removeControl('bill');
 * ```
 *
 * @publicApi
 */
export declare class FormRecord<TControl extends AbstractControl = AbstractControl> extends FormGroup<{
    [key: string]: TControl;
}> {
}

export declare interface FormRecord<TControl> {
    /**
     * Registers a control with the records's list of controls.
     *
     * See `FormGroup#registerControl` for additional information.
     */
    registerControl(name: string, control: TControl): TControl;
    /**
     * Add a control to this group.
     *
     * See `FormGroup#addControl` for additional information.
     */
    addControl(name: string, control: TControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Remove a control from this group.
     *
     * See `FormGroup#removeControl` for additional information.
     */
    removeControl(name: string, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Replace an existing control.
     *
     * See `FormGroup#setControl` for additional information.
     */
    setControl(name: string, control: TControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * See `FormGroup#contains` for additional information.
     */
    contains(controlName: string): boolean;
    /**
     * Sets the value of the `FormRecord`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * See `FormGroup#setValue` for additional information.
     */
    setValue(value: {
        [key: string]: ɵValue<TControl>;
    }, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Patches the value of the `FormRecord`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * See `FormGroup#patchValue` for additional information.
     */
    patchValue(value: {
        [key: string]: ɵValue<TControl>;
    }, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Resets the `FormRecord`, marks all descendants `pristine` and `untouched` and sets
     * the value of all descendants to null.
     *
     * See `FormGroup#reset` for additional information.
     */
    reset(value?: {
        [key: string]: ɵValue<TControl>;
    }, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * The aggregate value of the `FormRecord`, including any disabled controls.
     *
     * See `FormGroup#getRawValue` for additional information.
     */
    getRawValue(): {
        [key: string]: ɵRawValue<TControl>;
    };
}

/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 *
 * Providers associated with this module:
 * * `RadioControlRegistry`
 *
 * @see [Forms Overview](/guide/forms-overview)
 * @see [Template-driven Forms Guide](/guide/forms)
 *
 * @publicApi
 */
export declare class FormsModule {
    /**
     * @description
     * Provides options for configuring the forms module.
     *
     * @param opts An object of configuration options
     * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
     * correct, or to only call it `whenDisabled`, which is the legacy behavior.
     */
    static withConfig(opts: {
        callSetDisabledState?: SetDisabledStateOption;
    }): ModuleWithProviders<FormsModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<FormsModule, [typeof i1_2.NgModel, typeof i2_2.NgModelGroup, typeof i3_2.NgForm], never, [typeof i4_2.ɵInternalFormsSharedModule, typeof i1_2.NgModel, typeof i2_2.NgModelGroup, typeof i3_2.NgForm]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<FormsModule>;
}

declare namespace i1 {
    export {
        ɵNgNoValidate,
        ɵNgNoValidate as NgNoValidate
    }
}

declare namespace i10 {
    export {
        ValidationErrors,
        Validator,
        MAX_VALIDATOR,
        MaxValidator,
        MIN_VALIDATOR,
        MinValidator,
        AsyncValidator,
        REQUIRED_VALIDATOR,
        CHECKBOX_REQUIRED_VALIDATOR,
        RequiredValidator,
        CheckboxRequiredValidator,
        EMAIL_VALIDATOR,
        EmailValidator,
        ValidatorFn,
        AsyncValidatorFn,
        MIN_LENGTH_VALIDATOR,
        MinLengthValidator,
        MAX_LENGTH_VALIDATOR,
        MaxLengthValidator,
        PATTERN_VALIDATOR,
        PatternValidator
    }
}

declare namespace i1_2 {
    export {
        NgModel
    }
}

declare namespace i2 {
    export {
        SelectControlValueAccessor,
        NgSelectOption
    }
}

declare namespace i2_2 {
    export {
        modelGroupProvider,
        NgModelGroup
    }
}

declare namespace i3 {
    export {
        SelectMultipleControlValueAccessor,
        ɵNgSelectMultipleOption,
        ɵNgSelectMultipleOption as NgSelectMultipleOption
    }
}

declare namespace i3_2 {
    export {
        NgForm
    }
}

declare namespace i4 {
    export {
        DEFAULT_VALUE_ACCESSOR,
        COMPOSITION_BUFFER_MODE,
        DefaultValueAccessor
    }
}

declare namespace i4_2 {
    export {
        CheckboxControlValueAccessor,
        ControlValueAccessor,
        DefaultValueAccessor,
        NgControl,
        NgControlStatus,
        NgControlStatusGroup,
        NgForm,
        NgModel,
        NgModelGroup,
        NumberValueAccessor,
        RadioControlValueAccessor,
        RangeValueAccessor,
        FormControlDirective,
        NG_MODEL_WITH_FORM_CONTROL_WARNING,
        FormControlName,
        FormGroupDirective,
        FormArrayName,
        FormGroupName,
        NgSelectOption,
        SelectControlValueAccessor,
        ɵNgSelectMultipleOption as NgSelectMultipleOption,
        SelectMultipleControlValueAccessor,
        CALL_SET_DISABLED_STATE,
        SHARED_FORM_DIRECTIVES,
        TEMPLATE_DRIVEN_DIRECTIVES,
        REACTIVE_DRIVEN_DIRECTIVES,
        ɵInternalFormsSharedModule,
        ɵInternalFormsSharedModule as InternalFormsSharedModule
    }
}

declare namespace i5 {
    export {
        NumberValueAccessor
    }
}

declare namespace i5_2 {
    export {
        NG_MODEL_WITH_FORM_CONTROL_WARNING,
        FormControlDirective
    }
}

declare namespace i6 {
    export {
        RangeValueAccessor
    }
}

declare namespace i6_2 {
    export {
        FormGroupDirective
    }
}

declare namespace i7 {
    export {
        CheckboxControlValueAccessor
    }
}

declare namespace i7_2 {
    export {
        FormControlName
    }
}

declare namespace i8 {
    export {
        RadioControlRegistryModule,
        RadioControlRegistry,
        RadioControlValueAccessor
    }
}

declare namespace i8_2 {
    export {
        FormGroupName,
        formArrayNameProvider,
        FormArrayName
    }
}

declare namespace i9 {
    export {
        AbstractControlStatus,
        ngControlStatusHost,
        ngGroupStatusHost,
        NgControlStatus,
        NgControlStatusGroup
    }
}

/**
 * @description
 * Asserts that the given control is an instance of `FormArray`
 *
 * @publicApi
 */
export declare const isFormArray: (control: unknown) => control is FormArray<any>;

/**
 * @description
 * Asserts that the given control is an instance of `FormControl`
 *
 * @publicApi
 */
export declare const isFormControl: (control: unknown) => control is FormControl<any>;

/**
 * @description
 * Asserts that the given control is an instance of `FormGroup`
 *
 * @publicApi
 */
export declare const isFormGroup: (control: unknown) => control is FormGroup<any>;

/**
 * @description
 * Asserts that the given control is an instance of `FormRecord`
 *
 * @publicApi
 */
export declare const isFormRecord: (control: unknown) => control is FormRecord<AbstractControl<any, any>>;

/**
 * @description
 * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const MAX_LENGTH_VALIDATOR: any;

/**
 * @description
 * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const MAX_VALIDATOR: Provider;

/**
 * A directive that adds max length validation to controls marked with the
 * `maxlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a maximum length validator
 *
 * The following example shows how to add a maximum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel maxlength="25">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MaxLengthValidator extends AbstractValidatorDirective {
    /**
     * @description
     * Tracks changes to the minimum length bound to this directive.
     */
    maxlength: string | number | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaxLengthValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MaxLengthValidator, "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", never, { "maxlength": { "alias": "maxlength"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * A directive which installs the {@link MaxValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `max` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a max validator
 *
 * The following example shows how to add a max validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel max="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MaxValidator extends AbstractValidatorDirective {
    /**
     * @description
     * Tracks changes to the max bound to this directive.
     */
    max: string | number | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaxValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MaxValidator, "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", never, { "max": { "alias": "max"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * @description
 * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const MIN_LENGTH_VALIDATOR: any;

/**
 * @description
 * Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const MIN_VALIDATOR: Provider;

/**
 * A directive that adds minimum length validation to controls marked with the
 * `minlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a minimum length validator
 *
 * The following example shows how to add a minimum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel minlength="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MinLengthValidator extends AbstractValidatorDirective {
    /**
     * @description
     * Tracks changes to the minimum length bound to this directive.
     */
    minlength: string | number | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MinLengthValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MinLengthValidator, "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", never, { "minlength": { "alias": "minlength"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * A directive which installs the {@link MinValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `min` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a min validator
 *
 * The following example shows how to add a min validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel min="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MinValidator extends AbstractValidatorDirective {
    /**
     * @description
     * Tracks changes to the min bound to this directive.
     */
    min: string | number | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<MinValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MinValidator, "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", never, { "min": { "alias": "min"; "required": false; }; }, {}, never, never, false, never>;
}

declare const modelGroupProvider: any;

/**
 * @description
 * An `InjectionToken` for registering additional asynchronous validators used with
 * `AbstractControl`s.
 *
 * @see {@link NG_VALIDATORS}
 *
 * @usageNotes
 *
 * ### Provide a custom async validator directive
 *
 * The following example implements the `AsyncValidator` interface to create an
 * async validator directive with a custom error key.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(control: AbstractControl): Promise<ValidationErrors|null> {
 *     return Promise.resolve({'custom': true});
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export declare const NG_ASYNC_VALIDATORS: InjectionToken<readonly (Function | Validator)[]>;

/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
declare const NG_MODEL_WITH_FORM_CONTROL_WARNING: InjectionToken<unknown>;

/**
 * @description
 * An `InjectionToken` for registering additional synchronous validators used with
 * `AbstractControl`s.
 *
 * @see {@link NG_ASYNC_VALIDATORS}
 *
 * @usageNotes
 *
 * ### Providing a custom validator
 *
 * The following example registers a custom validator directive. Adding the validator to the
 * existing collection of validators requires the `multi: true` option.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors | null {
 *     return { 'custom': true };
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export declare const NG_VALIDATORS: InjectionToken<readonly (Function | Validator)[]>;

/**
 * Used to provide a `ControlValueAccessor` for form controls.
 *
 * See `DefaultValueAccessor` for how to implement one.
 *
 * @publicApi
 */
export declare const NG_VALUE_ACCESSOR: InjectionToken<readonly ControlValueAccessor[]>;

/**
 * @description
 * A base class that all `FormControl`-based directives extend. It binds a `FormControl`
 * object to a DOM element.
 *
 * @publicApi
 */
export declare abstract class NgControl extends AbstractControlDirective {
    /**
     * @description
     * The name for the control
     */
    name: string | number | null;
    /**
     * @description
     * The value accessor for the control
     */
    valueAccessor: ControlValueAccessor | null;
    /**
     * @description
     * The callback method to update the model from the view when requested
     *
     * @param newValue The new value for the view
     */
    abstract viewToModelUpdate(newValue: any): void;
}

/**
 * @description
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status.
 *
 * @usageNotes
 *
 * ### CSS classes applied
 *
 * The following classes are applied as the properties become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgControlStatus extends AbstractControlStatus {
    constructor(cd: NgControl);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgControlStatus, [{ self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgControlStatus, "[formControlName],[ngModel],[formControl]", never, {}, {}, never, never, false, never>;
}

/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc). On groups, this includes the additional
 * class ng-submitted.
 *
 * @see {@link NgControlStatus}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd: ControlContainer);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgControlStatusGroup, [{ optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgControlStatusGroup, "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", never, {}, {}, never, never, false, never>;
}

declare const ngControlStatusHost: {
    '[class.ng-untouched]': string;
    '[class.ng-touched]': string;
    '[class.ng-pristine]': string;
    '[class.ng-dirty]': string;
    '[class.ng-valid]': string;
    '[class.ng-invalid]': string;
    '[class.ng-pending]': string;
};

/**
 * @description
 * Creates a top-level `FormGroup` instance and binds it to a form
 * to track aggregate form value and validation status.
 *
 * As soon as you import the `FormsModule`, this directive becomes active by default on
 * all `<form>` tags.  You don't need to add a special selector.
 *
 * You optionally export the directive into a local template variable using `ngForm` as the key
 * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
 * `FormGroup` instance are duplicated on the directive itself, so a reference to it
 * gives you access to the aggregate value and validity status of the form, as well as
 * user interaction properties like `dirty` and `touched`.
 *
 * To register child controls with the form, use `NgModel` with a `name`
 * attribute. You may use `NgModelGroup` to create sub-groups within the form.
 *
 * If necessary, listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event emits the original form
 * submission event.
 *
 * In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
 * To import the `FormsModule` but skip its usage in some forms,
 * for example, to use native HTML5 validation, add the `ngNoForm` and the `<form>`
 * tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
 * unnecessary because the `<form>` tags are inert. In that case, you would
 * refrain from using the `formGroup` directive.
 *
 * @usageNotes
 *
 * ### Listening for form submission
 *
 * The following example shows how to capture the form values from the "ngSubmit" event.
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Setting the update options
 *
 * The following example shows you how to change the "updateOn" option from its default using
 * ngFormOptions.
 *
 * ```html
 * <form [ngFormOptions]="{updateOn: 'blur'}">
 *    <input name="one" ngModel>  <!-- this ngModel will update on blur -->
 * </form>
 * ```
 *
 * ### Native DOM validation UI
 *
 * In order to prevent the native DOM form validation UI from interfering with Angular's form
 * validation, Angular automatically adds the `novalidate` attribute on any `<form>` whenever
 * `FormModule` or `ReactiveFormModule` are imported into the application.
 * If you want to explicitly enable native DOM validation UI with Angular forms, you can add the
 * `ngNativeValidate` attribute to the `<form>` element:
 *
 * ```html
 * <form ngNativeValidate>
 *   ...
 * </form>
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgForm extends ControlContainer implements Form, AfterViewInit {
    private callSetDisabledState?;
    /**
     * @description
     * Returns whether the form submission has been triggered.
     */
    readonly submitted: boolean;
    private _directives;
    /**
     * @description
     * The `FormGroup` instance created for this form.
     */
    form: FormGroup;
    /**
     * @description
     * Event emitter for the "ngSubmit" event
     */
    ngSubmit: EventEmitter<any>;
    /**
     * @description
     * Tracks options for the `NgForm` instance.
     *
     * **updateOn**: Sets the default `updateOn` value for all child `NgModels` below it
     * unless explicitly set by a child `NgModel` using `ngModelOptions`). Defaults to 'change'.
     * Possible values: `'change'` | `'blur'` | `'submit'`.
     *
     */
    options: {
        updateOn?: FormHooks;
    };
    constructor(validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[], callSetDisabledState?: SetDisabledStateOption | undefined);
    /** @nodoc */
    ngAfterViewInit(): void;
    /**
     * @description
     * The directive instance.
     */
    get formDirective(): Form;
    /**
     * @description
     * The internal `FormGroup` instance.
     */
    get control(): FormGroup;
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it is always an empty array.
     */
    get path(): string[];
    /**
     * @description
     * Returns a map of the controls in this group.
     */
    get controls(): {
        [key: string]: AbstractControl;
    };
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `NgModel` directive instance.
     */
    addControl(dir: NgModel): void;
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `NgModel` directive.
     *
     * @param dir The `NgModel` directive instance.
     */
    getControl(dir: NgModel): FormControl;
    /**
     * @description
     * Removes the `NgModel` instance from the internal list of directives
     *
     * @param dir The `NgModel` directive instance.
     */
    removeControl(dir: NgModel): void;
    /**
     * @description
     * Adds a new `NgModelGroup` directive instance to the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    addFormGroup(dir: NgModelGroup): void;
    /**
     * @description
     * Removes the `NgModelGroup` directive instance from the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    removeFormGroup(dir: NgModelGroup): void;
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    getFormGroup(dir: NgModelGroup): FormGroup;
    /**
     * Sets the new value for the provided `NgControl` directive.
     *
     * @param dir The `NgControl` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir: NgControl, value: any): void;
    /**
     * @description
     * Sets the value for this `FormGroup`.
     *
     * @param value The new value
     */
    setValue(value: {
        [key: string]: any;
    }): void;
    /**
     * @description
     * Method called when the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event: Event): boolean;
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset(): void;
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value?: any): void;
    private _setUpdateStrategy;
    private _findContainer;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgForm, [{ optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgForm, "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", ["ngForm"], { "options": { "alias": "ngFormOptions"; "required": false; }; }, { "ngSubmit": "ngSubmit"; }, never, never, false, never>;
}

declare const ngGroupStatusHost: {
    '[class.ng-submitted]': string;
    '[class.ng-untouched]': string;
    '[class.ng-touched]': string;
    '[class.ng-pristine]': string;
    '[class.ng-dirty]': string;
    '[class.ng-valid]': string;
    '[class.ng-invalid]': string;
    '[class.ng-pending]': string;
};

/**
 * @description
 * Creates a `FormControl` instance from a [domain
 * model](https://en.wikipedia.org/wiki/Domain_model) and binds it to a form control element.
 *
 * The `FormControl` instance tracks the value, user interaction, and
 * validation status of the control and keeps the view synced with the model. If used
 * within a parent form, the directive also registers itself with the form as a child
 * control.
 *
 * This directive is used by itself or as part of a larger form. Use the
 * `ngModel` selector to activate it.
 *
 * It accepts a domain model as an optional `Input`. If you have a one-way binding
 * to `ngModel` with `[]` syntax, changing the domain model's value in the component
 * class sets the value in the view. If you have a two-way binding with `[()]` syntax
 * (also known as 'banana-in-a-box syntax'), the value in the UI always syncs back to
 * the domain model in your class.
 *
 * To inspect the properties of the associated `FormControl` (like the validity state),
 * export the directive into a local template variable using `ngModel` as the key (ex:
 * `#myVar="ngModel"`). You can then access the control using the directive's `control` property.
 * However, the most commonly used properties (like `valid` and `dirty`) also exist on the control
 * for direct access. See a full list of properties directly available in
 * `AbstractControlDirective`.
 *
 * @see {@link RadioControlValueAccessor}
 * @see {@link SelectControlValueAccessor}
 *
 * @usageNotes
 *
 * ### Using ngModel on a standalone control
 *
 * The following examples show a simple standalone control using `ngModel`:
 *
 * {@example forms/ts/simpleNgModel/simple_ng_model_example.ts region='Component'}
 *
 * When using the `ngModel` within `<form>` tags, you'll also need to supply a `name` attribute
 * so that the control can be registered with the parent form under that name.
 *
 * In the context of a parent form, it's often unnecessary to include one-way or two-way binding,
 * as the parent form syncs the value for you. You access its properties by exporting it into a
 * local template variable using `ngForm` such as (`#f="ngForm"`). Use the variable where
 * needed on form submission.
 *
 * If you do need to populate initial values into your form, using a one-way binding for
 * `ngModel` tends to be sufficient as long as you use the exported form's value rather
 * than the domain model's value on submit.
 *
 * ### Using ngModel within a form
 *
 * The following example shows controls using `ngModel` within a form:
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Using a standalone ngModel within a group
 *
 * The following example shows you how to use a standalone ngModel control
 * within a form. This controls the display of the form, but doesn't contain form data.
 *
 * ```html
 * <form>
 *   <input name="login" ngModel placeholder="Login">
 *   <input type="checkbox" ngModel [ngModelOptions]="{standalone: true}"> Show more options?
 * </form>
 * <!-- form value: {login: ''} -->
 * ```
 *
 * ### Setting the ngModel `name` attribute through options
 *
 * The following example shows you an alternate way to set the name attribute. Here,
 * an attribute identified as name is used within a custom form control component. To still be able
 * to specify the NgModel's name, you must specify it using the `ngModelOptions` input instead.
 *
 * ```html
 * <form>
 *   <my-custom-form-control name="Nancy" ngModel [ngModelOptions]="{name: 'user'}">
 *   </my-custom-form-control>
 * </form>
 * <!-- form value: {user: ''} -->
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgModel extends NgControl implements OnChanges, OnDestroy {
    private _changeDetectorRef?;
    private callSetDisabledState?;
    readonly control: FormControl;
    /** @nodoc */
    static ngAcceptInputType_isDisabled: boolean | string;
    /**
     * Internal reference to the view model value.
     * @nodoc
     */
    viewModel: any;
    /**
     * @description
     * Tracks the name bound to the directive. If a parent form exists, it
     * uses this name as a key to retrieve this control's value.
     */
    name: string;
    /**
     * @description
     * Tracks whether the control is disabled.
     */
    isDisabled: boolean;
    /**
     * @description
     * Tracks the value bound to this directive.
     */
    model: any;
    /**
     * @description
     * Tracks the configuration options for this `ngModel` instance.
     *
     * **name**: An alternative to setting the name attribute on the form control element. See
     * the [example](api/forms/NgModel#using-ngmodel-on-a-standalone-control) for using `NgModel`
     * as a standalone control.
     *
     * **standalone**: When set to true, the `ngModel` will not register itself with its parent form,
     * and acts as if it's not in the form. Defaults to false. If no parent form exists, this option
     * has no effect.
     *
     * **updateOn**: Defines the event upon which the form control value and validity update.
     * Defaults to 'change'. Possible values: `'change'` | `'blur'` | `'submit'`.
     *
     */
    options: {
        name?: string;
        standalone?: boolean;
        updateOn?: FormHooks;
    };
    /**
     * @description
     * Event emitter for producing the `ngModelChange` event after
     * the view model updates.
     */
    update: EventEmitter<any>;
    constructor(parent: ControlContainer, validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[], valueAccessors: ControlValueAccessor[], _changeDetectorRef?: ChangeDetectorRef | null | undefined, callSetDisabledState?: SetDisabledStateOption | undefined);
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path(): string[];
    /**
     * @description
     * The top-level directive for this control if present, otherwise null.
     */
    get formDirective(): any;
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value emitted by `ngModelChange`.
     */
    viewToModelUpdate(newValue: any): void;
    private _setUpControl;
    private _setUpdateStrategy;
    private _isStandalone;
    private _setUpStandalone;
    private _checkForErrors;
    private _checkParentType;
    private _checkName;
    private _updateValue;
    private _updateDisabled;
    private _getPath;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgModel, [{ optional: true; host: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgModel, "[ngModel]:not([formControlName]):not([formControl])", ["ngModel"], { "name": { "alias": "name"; "required": false; }; "isDisabled": { "alias": "disabled"; "required": false; }; "model": { "alias": "ngModel"; "required": false; }; "options": { "alias": "ngModelOptions"; "required": false; }; }, { "update": "ngModelChange"; }, never, never, false, never>;
}

/**
 * @description
 * Creates and binds a `FormGroup` instance to a DOM element.
 *
 * This directive can only be used as a child of `NgForm` (within `<form>` tags).
 *
 * Use this directive to validate a sub-group of your form separately from the
 * rest of your form, or if some values in your domain model make more sense
 * to consume together in a nested object.
 *
 * Provide a name for the sub-group and it will become the key
 * for the sub-group in the form's full value. If you need direct access, export the directive into
 * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
 *
 * @usageNotes
 *
 * ### Consuming controls in a grouping
 *
 * The following example shows you how to combine controls together in a sub-group
 * of the form.
 *
 * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
 *
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgModelGroup extends AbstractFormGroupDirective implements OnInit, OnDestroy {
    /**
     * @description
     * Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
     * to a key in the parent `NgForm`.
     */
    name: string;
    constructor(parent: ControlContainer, validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[]);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgModelGroup, [{ host: true; skipSelf: true; }, { optional: true; self: true; }, { optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgModelGroup, "[ngModelGroup]", ["ngModelGroup"], { "name": { "alias": "ngModelGroup"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see {@link SelectControlValueAccessor}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgSelectOption implements OnDestroy {
    private _element;
    private _renderer;
    private _select;
    /**
     * @description
     * ID of the option element
     */
    id: string;
    constructor(_element: ElementRef, _renderer: Renderer2, _select: SelectControlValueAccessor);
    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    set ngValue(value: any);
    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    set value(value: any);
    /** @nodoc */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgSelectOption, [null, null, { optional: true; host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgSelectOption, "option", never, { "ngValue": { "alias": "ngValue"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * @description
 * `NonNullableFormBuilder` is similar to {@link FormBuilder}, but automatically constructed
 * {@link FormControl} elements have `{nonNullable: true}` and are non-nullable.
 *
 * @publicApi
 */
export declare abstract class NonNullableFormBuilder {
    /**
     * Similar to `FormBuilder#group`, except any implicitly constructed `FormControl`
     * will be non-nullable (i.e. it will have `nonNullable` set to true). Note
     * that already-constructed controls will not be altered.
     */
    abstract group<T extends {}>(controls: T, options?: AbstractControlOptions | null): FormGroup<{
        [K in keyof T]: ɵElement<T[K], never>;
    }>;
    /**
     * Similar to `FormBuilder#record`, except any implicitly constructed `FormControl`
     * will be non-nullable (i.e. it will have `nonNullable` set to true). Note
     * that already-constructed controls will not be altered.
     */
    abstract record<T>(controls: {
        [key: string]: T;
    }, options?: AbstractControlOptions | null): FormRecord<ɵElement<T, never>>;
    /**
     * Similar to `FormBuilder#array`, except any implicitly constructed `FormControl`
     * will be non-nullable (i.e. it will have `nonNullable` set to true). Note
     * that already-constructed controls will not be altered.
     */
    abstract array<T>(controls: Array<T>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormArray<ɵElement<T, never>>;
    /**
     * Similar to `FormBuilder#control`, except this overridden version of `control` forces
     * `nonNullable` to be `true`, resulting in the control always being non-nullable.
     */
    abstract control<T>(formState: T | FormControlState<T>, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControl<T>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NonNullableFormBuilder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NonNullableFormBuilder>;
}

/**
 * @description
 * The `ControlValueAccessor` for writing a number value and listening to number input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a number input with a reactive form.
 *
 * The following example shows how to use a number input with a reactive form.
 *
 * ```ts
 * const totalCountControl = new FormControl();
 * ```
 *
 * ```
 * <input type="number" [formControl]="totalCountControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NumberValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: number): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: number | null) => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NumberValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NumberValueAccessor, "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]", never, {}, {}, never, never, false, never>;
}

/**
 * @description
 * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const PATTERN_VALIDATOR: any;

/**
 * @description
 * A directive that adds regex pattern validation to controls marked with the
 * `pattern` attribute. The regex must match the entire control value.
 * The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a pattern validator
 *
 * The following example shows how to add a pattern validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel pattern="[a-zA-Z ]*">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class PatternValidator extends AbstractValidatorDirective {
    /**
     * @description
     * Tracks changes to the pattern bound to this directive.
     */
    pattern: string | RegExp;
    static ɵfac: i0.ɵɵFactoryDeclaration<PatternValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PatternValidator, "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", never, { "pattern": { "alias": "pattern"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * Helper type to allow the compiler to accept [XXXX, { updateOn: string }] as a valid shorthand
 * argument for .group()
 */
declare interface PermissiveAbstractControlOptions extends Omit<AbstractControlOptions, 'updateOn'> {
    updateOn?: string;
}

/**
 * The compiler may not always be able to prove that the elements of the control config are a tuple
 * (i.e. occur in a fixed order). This slightly looser type is used for inference, to catch cases
 * where the compiler cannot prove order and position.
 *
 * For example, consider the simple case `fb.group({foo: ['bar', Validators.required]})`. The
 * compiler will infer this as an array, not as a tuple.
 */
declare type PermissiveControlConfig<T> = Array<T | FormControlState<T> | ValidatorConfig>;

/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
declare class RadioControlRegistry {
    private _accessors;
    /**
     * @description
     * Adds a control to the internal registry. For internal use only.
     */
    add(control: NgControl, accessor: RadioControlValueAccessor): void;
    /**
     * @description
     * Removes a control from the internal registry. For internal use only.
     */
    remove(accessor: RadioControlValueAccessor): void;
    /**
     * @description
     * Selects a radio button. For internal use only.
     */
    select(accessor: RadioControlValueAccessor): void;
    private _isSameGroup;
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioControlRegistry, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RadioControlRegistry>;
}

/**
 * Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
 * provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
 * declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
 * `forwardRef` logic.
 */
declare class RadioControlRegistryModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioControlRegistryModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<RadioControlRegistryModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<RadioControlRegistryModule>;
}

/**
 * @description
 * The `ControlValueAccessor` for writing radio control values and listening to radio control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using radio buttons with reactive form directives
 *
 * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
 * a reactive form, radio buttons in the same group should have the same `formControlName`.
 * Providing a `name` attribute is optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class RadioControlValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor, OnDestroy, OnInit {
    private _registry;
    private _injector;
    private setDisabledStateFired;
    /**
     * The registered callback function called when a change event occurs on the input element.
     * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
     * to override the `onChange` function (which expects 1 argument) in the parent
     * `BaseControlValueAccessor` class.
     * @nodoc
     */
    onChange: () => void;
    /**
     * @description
     * Tracks the name of the radio input element.
     */
    name: string;
    /**
     * @description
     * Tracks the name of the `FormControl` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     */
    formControlName: string;
    /**
     * @description
     * Tracks the value of the radio input element
     */
    value: any;
    private callSetDisabledState;
    constructor(renderer: Renderer2, elementRef: ElementRef, _registry: RadioControlRegistry, _injector: Injector);
    /** @nodoc */
    ngOnInit(): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * Sets the "checked" property value on the radio input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: any) => {}): void;
    /** @nodoc */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    fireUncheck(value: any): void;
    private _checkName;
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RadioControlValueAccessor, "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", never, { "name": { "alias": "name"; "required": false; }; "formControlName": { "alias": "formControlName"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * @description
 * The `ControlValueAccessor` for writing a range value and listening to range input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a range input with a reactive form
 *
 * The following example shows how to use a range input with a reactive form.
 *
 * ```ts
 * const ageControl = new FormControl();
 * ```
 *
 * ```
 * <input type="range" [formControl]="ageControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class RangeValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: number | null) => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RangeValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RangeValueAccessor, "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]", never, {}, {}, never, never, false, never>;
}

declare const REACTIVE_DRIVEN_DIRECTIVES: Type<any>[];

/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 *
 * Providers associated with this module:
 * * `RadioControlRegistry`
 *
 * @see [Forms Overview](guide/forms-overview)
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @publicApi
 */
export declare class ReactiveFormsModule {
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
     * correct, or to only call it `whenDisabled`, which is the legacy behavior.
     */
    static withConfig(opts: {
        /** @deprecated as of v6 */ warnOnNgModelWithFormControl?: 'never' | 'once' | 'always';
        callSetDisabledState?: SetDisabledStateOption;
    }): ModuleWithProviders<ReactiveFormsModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReactiveFormsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ReactiveFormsModule, [typeof i5_2.FormControlDirective, typeof i6_2.FormGroupDirective, typeof i7_2.FormControlName, typeof i8_2.FormGroupName, typeof i8_2.FormArrayName], never, [typeof i4_2.ɵInternalFormsSharedModule, typeof i5_2.FormControlDirective, typeof i6_2.FormGroupDirective, typeof i7_2.FormControlName, typeof i8_2.FormGroupName, typeof i8_2.FormArrayName]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ReactiveFormsModule>;
}

/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
declare const REQUIRED_VALIDATOR: Provider;

/**
 * @description
 * A directive that adds the `required` validator to any controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required validator using template-driven forms
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class RequiredValidator extends AbstractValidatorDirective {
    /**
     * @description
     * Tracks changes to the required attribute bound to this directive.
     */
    required: boolean | string;
    /** @nodoc */
    enabled(input: boolean): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<RequiredValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RequiredValidator, ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", never, { "required": { "alias": "required"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * @description
 * The `ControlValueAccessor` for writing select control values and listening to select control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using select controls in a reactive form
 *
 * The following examples show how to use a select control in a reactive form.
 *
 * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
 *
 * ### Using select controls in a template-driven form
 *
 * To use a select in a template-driven form, simply add an `ngModel` and a `name`
 * attribute to the main `<select>` tag.
 *
 * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
 *
 * ### Customizing option selection
 *
 * Angular uses object identity to select option. It's possible for the identities of items
 * to change while the data does not. This can happen, for example, if the items are produced
 * from an RPC to the server, and that RPC is re-run. Even if the data hasn't changed, the
 * second response will produce objects with different identities.
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * `compareWith` takes a **function** which has two arguments: `option1` and `option2`.
 * If `compareWith` is given, Angular selects option by the return value of the function.
 *
 * ```ts
 * const selectedCountriesControl = new FormControl();
 * ```
 *
 * ```
 * <select [compareWith]="compareFn"  [formControl]="selectedCountriesControl">
 *     <option *ngFor="let country of countries" [ngValue]="country">
 *         {{country.name}}
 *     </option>
 * </select>
 *
 * compareFn(c1: Country, c2: Country): boolean {
 *     return c1 && c2 ? c1.id === c2.id : c1 === c2;
 * }
 * ```
 *
 * **Note:** We listen to the 'change' event because 'input' events aren't fired
 * for selects in IE, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event#browser_compatibility
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class SelectControlValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /** @nodoc */
    value: any;
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    /**
     * Sets the "value" property on the select element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (value: any) => any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SelectControlValueAccessor, "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", never, { "compareWith": { "alias": "compareWith"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * @description
 * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
 * control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @see {@link SelectControlValueAccessor}
 *
 * @usageNotes
 *
 * ### Using a multi-select control
 *
 * The follow example shows you how to use a multi-select control with a reactive form.
 *
 * ```ts
 * const countryControl = new FormControl();
 * ```
 *
 * ```
 * <select multiple name="countries" [formControl]="countryControl">
 *   <option *ngFor="let country of countries" [ngValue]="country">
 *     {{ country.name }}
 *   </option>
 * </select>
 * ```
 *
 * ### Customizing option selection
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * See the `SelectControlValueAccessor` for usage.
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /**
     * The current value.
     * @nodoc
     */
    value: any;
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    /**
     * Sets the "value" property on one or of more of the select's options.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes
     * and writes an array of the selected options.
     * @nodoc
     */
    registerOnChange(fn: (value: any) => any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectMultipleControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SelectMultipleControlValueAccessor, "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]", never, { "compareWith": { "alias": "compareWith"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * The type for CALL_SET_DISABLED_STATE. If `always`, then ControlValueAccessor will always call
 * `setDisabledState` when attached, which is the most correct behavior. Otherwise, it will only be
 * called when disabled, which is the legacy behavior for compatibility.
 *
 * @publicApi
 * @see {@link FormsModule#withconfig}
 */
export declare type SetDisabledStateOption = 'whenDisabledForLegacyCode' | 'always';

declare const SHARED_FORM_DIRECTIVES: Type<any>[];

declare const TEMPLATE_DRIVEN_DIRECTIVES: Type<any>[];

/**
 * UntypedFormArray is a non-strongly-typed version of `FormArray`, which
 * permits heterogenous controls.
 */
export declare type UntypedFormArray = FormArray<any>;

export declare const UntypedFormArray: UntypedFormArrayCtor;

declare interface UntypedFormArrayCtor {
    new (controls: AbstractControl[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): UntypedFormArray;
    /**
     * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
     * manually inspect the prototype chain.
     */
    prototype: FormArray<any>;
}

/**
 * UntypedFormBuilder is the same as `FormBuilder`, but it provides untyped controls.
 */
export declare class UntypedFormBuilder extends FormBuilder {
    /**
     * Like `FormBuilder#group`, except the resulting group is untyped.
     */
    group(controlsConfig: {
        [key: string]: any;
    }, options?: AbstractControlOptions | null): UntypedFormGroup;
    /**
     * @deprecated This API is not typesafe and can result in issues with Closure Compiler renaming.
     * Use the `FormBuilder#group` overload with `AbstractControlOptions` instead.
     */
    group(controlsConfig: {
        [key: string]: any;
    }, options: {
        [key: string]: any;
    }): UntypedFormGroup;
    /**
     * Like `FormBuilder#control`, except the resulting control is untyped.
     */
    control(formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): UntypedFormControl;
    /**
     * Like `FormBuilder#array`, except the resulting array is untyped.
     */
    array(controlsConfig: any[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): UntypedFormArray;
    static ɵfac: i0.ɵɵFactoryDeclaration<UntypedFormBuilder, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<UntypedFormBuilder>;
}

/**
 * UntypedFormControl is a non-strongly-typed version of `FormControl`.
 */
export declare type UntypedFormControl = FormControl<any>;

export declare const UntypedFormControl: UntypedFormControlCtor;

declare interface UntypedFormControlCtor {
    new (): UntypedFormControl;
    new (formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): UntypedFormControl;
    /**
     * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
     * manually inspect the prototype chain.
     */
    prototype: FormControl<any>;
}

/**
 * UntypedFormGroup is a non-strongly-typed version of `FormGroup`.
 */
export declare type UntypedFormGroup = FormGroup<any>;

export declare const UntypedFormGroup: UntypedFormGroupCtor;

declare interface UntypedFormGroupCtor {
    new (controls: {
        [key: string]: AbstractControl;
    }, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): UntypedFormGroup;
    /**
     * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
     * manually inspect the prototype chain.
     */
    prototype: FormGroup<any>;
}

/**
 * @description
 * Defines the map of errors returned from failed validation checks.
 *
 * @publicApi
 */
export declare type ValidationErrors = {
    [key: string]: any;
};

/**
 * @description
 * An interface implemented by classes that perform synchronous validation.
 *
 * @usageNotes
 *
 * ### Provide a custom validator
 *
 * The following example implements the `Validator` interface to create a
 * validator directive with a custom error key.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors|null {
 *     return {'custom': true};
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export declare interface Validator {
    /**
     * @description
     * Method that performs synchronous validation against the provided control.
     *
     * @param control The control to validate against.
     *
     * @returns A map of validation errors if validation fails,
     * otherwise null.
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange?(fn: () => void): void;
}

/**
 * The union of all validator types that can be accepted by a ControlConfig.
 */
declare type ValidatorConfig = ValidatorFn | AsyncValidatorFn | ValidatorFn[] | AsyncValidatorFn[];

/**
 * @description
 * A function that receives a control and synchronously returns a map of
 * validation errors if present, otherwise null.
 *
 * @publicApi
 */
export declare interface ValidatorFn {
    (control: AbstractControl): ValidationErrors | null;
}

/**
 * @description
 * Provides a set of built-in validators that can be used by form controls.
 *
 * A validator is a function that processes a `FormControl` or collection of
 * controls and returns an error map or null. A null map means that validation has passed.
 *
 * @see [Form Validation](/guide/form-validation)
 *
 * @publicApi
 */
export declare class Validators {
    /**
     * @description
     * Validator that requires the control's value to be greater than or equal to the provided number.
     *
     * @usageNotes
     *
     * ### Validate against a minimum of 3
     *
     * ```typescript
     * const control = new FormControl(2, Validators.min(3));
     *
     * console.log(control.errors); // {min: {min: 3, actual: 2}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `min` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static min(min: number): ValidatorFn;
    /**
     * @description
     * Validator that requires the control's value to be less than or equal to the provided number.
     *
     * @usageNotes
     *
     * ### Validate against a maximum of 15
     *
     * ```typescript
     * const control = new FormControl(16, Validators.max(15));
     *
     * console.log(control.errors); // {max: {max: 15, actual: 16}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `max` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static max(max: number): ValidatorFn;
    /**
     * @description
     * Validator that requires the control have a non-empty value.
     *
     * @usageNotes
     *
     * ### Validate that the field is non-empty
     *
     * ```typescript
     * const control = new FormControl('', Validators.required);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map with the `required` property
     * if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static required(control: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Validator that requires the control's value be true. This validator is commonly
     * used for required checkboxes.
     *
     * @usageNotes
     *
     * ### Validate that the field value is true
     *
     * ```typescript
     * const control = new FormControl('some value', Validators.requiredTrue);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map that contains the `required` property
     * set to `true` if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static requiredTrue(control: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Validator that requires the control's value pass an email validation test.
     *
     * Tests the value using a [regular
     * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
     * pattern suitable for common use cases. The pattern is based on the definition of a valid email
     * address in the [WHATWG HTML
     * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
     * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
     * lengths of different parts of the address).
     *
     * The differences from the WHATWG version include:
     * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
     * - Disallow `local-part` to be longer than 64 characters.
     * - Disallow the whole address to be longer than 254 characters.
     *
     * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
     * validate the value against a different pattern.
     *
     * @usageNotes
     *
     * ### Validate that the field matches a valid email pattern
     *
     * ```typescript
     * const control = new FormControl('bad@', Validators.email);
     *
     * console.log(control.errors); // {email: true}
     * ```
     *
     * @returns An error map with the `email` property
     * if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static email(control: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Validator that requires the length of the control's value to be greater than or equal
     * to the provided minimum length. This validator is also provided by default if you use the
     * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays. The
     * `minLength` validator logic is also not invoked for values when their `length` property is 0
     * (for example in case of an empty string or an empty array), to support optional controls. You
     * can use the standard `required` validator if empty values should not be considered valid.
     *
     * @usageNotes
     *
     * ### Validate that the field has a minimum of 3 characters
     *
     * ```typescript
     * const control = new FormControl('ng', Validators.minLength(3));
     *
     * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
     * ```
     *
     * ```html
     * <input minlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `minlength` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static minLength(minLength: number): ValidatorFn;
    /**
     * @description
     * Validator that requires the length of the control's value to be less than or equal
     * to the provided maximum length. This validator is also provided by default if you use the
     * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays.
     *
     * @usageNotes
     *
     * ### Validate that the field has maximum of 5 characters
     *
     * ```typescript
     * const control = new FormControl('Angular', Validators.maxLength(5));
     *
     * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
     * ```
     *
     * ```html
     * <input maxlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `maxlength` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static maxLength(maxLength: number): ValidatorFn;
    /**
     * @description
     * Validator that requires the control's value to match a regex pattern. This validator is also
     * provided by default if you use the HTML5 `pattern` attribute.
     *
     * @usageNotes
     *
     * ### Validate that the field only contains letters or spaces
     *
     * ```typescript
     * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
     *
     * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
     * ```
     *
     * ```html
     * <input pattern="[a-zA-Z ]*">
     * ```
     *
     * ### Pattern matching with the global or sticky flag
     *
     * `RegExp` objects created with the `g` or `y` flags that are passed into `Validators.pattern`
     * can produce different results on the same input when validations are run consecutively. This is
     * due to how the behavior of `RegExp.prototype.test` is
     * specified in [ECMA-262](https://tc39.es/ecma262/#sec-regexpbuiltinexec)
     * (`RegExp` preserves the index of the last match when the global or sticky flag is used).
     * Due to this behavior, it is recommended that when using
     * `Validators.pattern` you **do not** pass in a `RegExp` object with either the global or sticky
     * flag enabled.
     *
     * ```typescript
     * // Not recommended (since the `g` flag is used)
     * const controlOne = new FormControl('1', Validators.pattern(/foo/g));
     *
     * // Good
     * const controlTwo = new FormControl('1', Validators.pattern(/foo/));
     * ```
     *
     * @param pattern A regular expression to be used as is to test the values, or a string.
     * If a string is passed, the `^` character is prepended and the `$` character is
     * appended to the provided string (if not already present), and the resulting regular
     * expression is used to test the values.
     *
     * @returns A validator function that returns an error map with the
     * `pattern` property if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static pattern(pattern: string | RegExp): ValidatorFn;
    /**
     * @description
     * Validator that performs no operation.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static nullValidator(control: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Compose multiple validators into a single function that returns the union
     * of the individual error maps for the provided control.
     *
     * @returns A validator function that returns an error map with the
     * merged error maps of the validators if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static compose(validators: null): null;
    static compose(validators: (ValidatorFn | null | undefined)[]): ValidatorFn | null;
    /**
     * @description
     * Compose multiple async validators into a single function that returns the union
     * of the individual error objects for the provided control.
     *
     * @returns A validator function that returns an error map with the
     * merged error objects of the async validators if the validation check fails, otherwise `null`.
     *
     * @see {@link updateValueAndValidity()}
     *
     */
    static composeAsync(validators: (AsyncValidatorFn | null)[]): AsyncValidatorFn | null;
}

/**
 * @publicApi
 */
export declare const VERSION: Version;

/**
 * CoerceStrArrToNumArr accepts an array of strings, and converts any numeric string to a number.
 */
export declare type ɵCoerceStrArrToNumArr<S> = S extends [infer Head, ...infer Tail] ? Head extends `${number}` ? [
number,
...ɵCoerceStrArrToNumArr<Tail>
] : [
Head,
...ɵCoerceStrArrToNumArr<Tail>
] : [
];

/**
 * FormBuilder accepts values in various container shapes, as well as raw values.
 * Element returns the appropriate corresponding model class, given the container T.
 * The flag N, if not never, makes the resulting `FormControl` have N in its type.
 */
export declare type ɵElement<T, N extends null> = [
T
] extends [FormControl<infer U>] ? FormControl<U> : [
T
] extends [FormControl<infer U> | undefined] ? FormControl<U> : [
T
] extends [FormGroup<infer U>] ? FormGroup<U> : [
T
] extends [FormGroup<infer U> | undefined] ? FormGroup<U> : [
T
] extends [FormRecord<infer U>] ? FormRecord<U> : [
T
] extends [FormRecord<infer U> | undefined] ? FormRecord<U> : [
T
] extends [FormArray<infer U>] ? FormArray<U> : [
T
] extends [FormArray<infer U> | undefined] ? FormArray<U> : [
T
] extends [AbstractControl<infer U>] ? AbstractControl<U> : [
T
] extends [AbstractControl<infer U> | undefined] ? AbstractControl<U> : [
T
] extends [FormControlState<infer U>] ? FormControl<U | N> : [
T
] extends [PermissiveControlConfig<infer U>] ? FormControl<Exclude<U, ValidatorConfig | PermissiveAbstractControlOptions> | N> : FormControl<T | N>;

/**
 * FormArrayRawValue extracts the type of `.getRawValue()` from a FormArray's element type, and
 * wraps it in an array. The untyped case falls back to any[].
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 */
export declare type ɵFormArrayRawValue<T extends AbstractControl<any>> = ɵTypedOrUntyped<T, Array<ɵRawValue<T>>, any[]>;

/**
 * FormArrayValue extracts the type of `.value` from a FormArray's element type, and wraps it in an
 * array.
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly. The untyped
 * case falls back to any[].
 */
export declare type ɵFormArrayValue<T extends AbstractControl<any>> = ɵTypedOrUntyped<T, Array<ɵValue<T>>, any[]>;

/**
 * Various available constructors for `FormControl`.
 * Do not use this interface directly. Instead, use `FormControl`:
 * ```
 * const fc = new FormControl('foo');
 * ```
 * This symbol is prefixed with ɵ to make plain that it is an internal symbol.
 */
export declare interface ɵFormControlCtor {
    /**
     * Construct a FormControl with no initial value or validators.
     */
    new (): FormControl<any>;
    /**
     * Creates a new `FormControl` instance.
     *
     * @param formState Initializes the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or a `FormControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     */
    new <T = any>(value: FormControlState<T> | T, opts: FormControlOptions & {
        nonNullable: true;
    }): FormControl<T>;
    /**
     * @deprecated Use `nonNullable` instead.
     */
    new <T = any>(value: FormControlState<T> | T, opts: FormControlOptions & {
        initialValueIsDefault: true;
    }): FormControl<T>;
    /**
     * @deprecated When passing an `options` argument, the `asyncValidator` argument has no effect.
     */
    new <T = any>(value: FormControlState<T> | T, opts: FormControlOptions, asyncValidator: AsyncValidatorFn | AsyncValidatorFn[]): FormControl<T | null>;
    new <T = any>(value: FormControlState<T> | T, validatorOrOpts?: ValidatorFn | ValidatorFn[] | FormControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControl<T | null>;
    /**
     * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
     * manually inspect the prototype chain.
     */
    prototype: FormControl<any>;
}

/**
 * FormGroupRawValue extracts the type of `.getRawValue()` from a FormGroup's inner object type. The
 * untyped case falls back to {[key: string]: any}.
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 *
 * For internal use only.
 */
export declare type ɵFormGroupRawValue<T extends {
    [K in keyof T]?: AbstractControl<any>;
}> = ɵTypedOrUntyped<T, {
    [K in keyof T]: ɵRawValue<T[K]>;
}, {
    [key: string]: any;
}>;

/**
 * FormGroupValue extracts the type of `.value` from a FormGroup's inner object type. The untyped
 * case falls back to {[key: string]: any}.
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 *
 * For internal use only.
 */
export declare type ɵFormGroupValue<T extends {
    [K in keyof T]?: AbstractControl<any>;
}> = ɵTypedOrUntyped<T, Partial<{
    [K in keyof T]: ɵValue<T[K]>;
}>, {
    [key: string]: any;
}>;

/**
 * GetProperty takes a type T and some property names or indices K.
 * If K is a dot-separated string, it is tokenized into an array before proceeding.
 * Then, the type of the nested property at K is computed: T[K[0]][K[1]][K[2]]...
 * This works with both objects, which are indexed by property name, and arrays, which are indexed
 * numerically.
 *
 * For internal use only.
 */
export declare type ɵGetProperty<T, K> = K extends string ? ɵGetProperty<T, ɵCoerceStrArrToNumArr<ɵTokenize<K, '.'>>> : ɵWriteable<K> extends Array<string | number> ? ɵNavigate<T, ɵWriteable<K>> : any;

/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
export declare class ɵInternalFormsSharedModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ɵInternalFormsSharedModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ɵInternalFormsSharedModule, [typeof i1.ɵNgNoValidate, typeof i2.NgSelectOption, typeof i3.ɵNgSelectMultipleOption, typeof i4.DefaultValueAccessor, typeof i5.NumberValueAccessor, typeof i6.RangeValueAccessor, typeof i7.CheckboxControlValueAccessor, typeof i2.SelectControlValueAccessor, typeof i3.SelectMultipleControlValueAccessor, typeof i8.RadioControlValueAccessor, typeof i9.NgControlStatus, typeof i9.NgControlStatusGroup, typeof i10.RequiredValidator, typeof i10.MinLengthValidator, typeof i10.MaxLengthValidator, typeof i10.PatternValidator, typeof i10.CheckboxRequiredValidator, typeof i10.EmailValidator, typeof i10.MinValidator, typeof i10.MaxValidator], [typeof i8.RadioControlRegistryModule], [typeof i1.ɵNgNoValidate, typeof i2.NgSelectOption, typeof i3.ɵNgSelectMultipleOption, typeof i4.DefaultValueAccessor, typeof i5.NumberValueAccessor, typeof i6.RangeValueAccessor, typeof i7.CheckboxControlValueAccessor, typeof i2.SelectControlValueAccessor, typeof i3.SelectMultipleControlValueAccessor, typeof i8.RadioControlValueAccessor, typeof i9.NgControlStatus, typeof i9.NgControlStatusGroup, typeof i10.RequiredValidator, typeof i10.MinLengthValidator, typeof i10.MaxLengthValidator, typeof i10.PatternValidator, typeof i10.CheckboxRequiredValidator, typeof i10.EmailValidator, typeof i10.MinValidator, typeof i10.MaxValidator]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ɵInternalFormsSharedModule>;
}

declare type ɵIsAny<T, Y, N> = 0 extends (1 & T) ? Y : N;

/**
 * Navigate takes a type T and an array K, and returns the type of T[K[0]][K[1]][K[2]]...
 */
export declare type ɵNavigate<T, K extends (Array<string | number>)> = T extends object ? (K extends [infer Head, ...infer Tail] ? (Head extends keyof T ? (Tail extends (string | number)[] ? [
] extends Tail ? T[Head] : (ɵNavigate<T[Head], Tail>) : any) : never) : any) : any;

/**
 * @description
 *
 * Adds `novalidate` attribute to all forms by default.
 *
 * `novalidate` is used to disable browser's native form validation.
 *
 * If you want to use native validation with Angular forms, just add `ngNativeValidate` attribute:
 *
 * ```
 * <form ngNativeValidate></form>
 * ```
 *
 * @publicApi
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 */
export declare class ɵNgNoValidate {
    static ɵfac: i0.ɵɵFactoryDeclaration<ɵNgNoValidate, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ɵNgNoValidate, "form:not([ngNoForm]):not([ngNativeValidate])", never, {}, {}, never, never, false, never>;
}

/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see {@link SelectMultipleControlValueAccessor}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class ɵNgSelectMultipleOption implements OnDestroy {
    private _element;
    private _renderer;
    private _select;
    id: string;
    constructor(_element: ElementRef, _renderer: Renderer2, _select: SelectMultipleControlValueAccessor);
    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    set ngValue(value: any);
    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    set value(value: any);
    /** @nodoc */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ɵNgSelectMultipleOption, [null, null, { optional: true; host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ɵNgSelectMultipleOption, "option", never, { "ngValue": { "alias": "ngValue"; "required": false; }; "value": { "alias": "value"; "required": false; }; }, {}, never, never, false, never>;
}

/**
 * OptionalKeys returns the union of all optional keys in the object.
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 */
export declare type ɵOptionalKeys<T> = {
    [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * RawValue gives the raw value type corresponding to a control type.
 *
 * Note that the resulting type will follow the same rules as `.getRawValue()` on your control,
 * group, or array. This means that all controls inside a group will be required, not optional,
 * regardless of their disabled state.
 *
 * You may also wish to use {@link ɵValue}, which will have `undefined` in group keys (which can be
 * disabled).
 *
 * @usageNotes
 *
 * ### `FormGroup` raw value type
 *
 * Imagine you have an interface defining the controls in your group. You can extract the shape of
 * the raw values as follows:
 *
 * ```ts
 * interface PartyFormControls {
 *   address: FormControl<string>;
 * }
 *
 * // RawValue operates on controls; the object must be wrapped in a FormGroup.
 * type PartyFormValues = RawValue<FormGroup<PartyFormControls>>;
 * ```
 *
 * The resulting type is `{address: string}`. (Note the absence of `undefined`.)
 *
 *  **Internal: not for public use.**
 */
export declare type ɵRawValue<T extends AbstractControl | undefined> = T extends AbstractControl<any, any> ? (T['setValue'] extends ((v: infer R) => void) ? R : never) : never;

/**
 * Tokenize splits a string literal S by a delimiter D.
 */
export declare type ɵTokenize<S extends string, D extends string> = string extends S ? string[] : S extends `${infer T}${D}${infer U}` ? [T, ...ɵTokenize<U, D>] : [
S
];

/**
 * `TypedOrUntyped` allows one of two different types to be selected, depending on whether the Forms
 * class it's applied to is typed or not.
 *
 * This is for internal Angular usage to support typed forms; do not directly use it.
 */
export declare type ɵTypedOrUntyped<T, Typed, Untyped> = ɵIsAny<T, Untyped, Typed>;

/**
 * Value gives the value type corresponding to a control type.
 *
 * Note that the resulting type will follow the same rules as `.value` on your control, group, or
 * array, including `undefined` for each group element which might be disabled.
 *
 * If you are trying to extract a value type for a data model, you probably want {@link RawValue},
 * which will not have `undefined` in group keys.
 *
 * @usageNotes
 *
 * ### `FormControl` value type
 *
 * You can extract the value type of a single control:
 *
 * ```ts
 * type NameControl = FormControl<string>;
 * type NameValue = Value<NameControl>;
 * ```
 *
 * The resulting type is `string`.
 *
 * ### `FormGroup` value type
 *
 * Imagine you have an interface defining the controls in your group. You can extract the shape of
 * the values as follows:
 *
 * ```ts
 * interface PartyFormControls {
 *   address: FormControl<string>;
 * }
 *
 * // Value operates on controls; the object must be wrapped in a FormGroup.
 * type PartyFormValues = Value<FormGroup<PartyFormControls>>;
 * ```
 *
 * The resulting type is `{address: string|undefined}`.
 *
 * ### `FormArray` value type
 *
 * You can extract values from FormArrays as well:
 *
 * ```ts
 * type GuestNamesControls = FormArray<FormControl<string>>;
 *
 * type NamesValues = Value<GuestNamesControls>;
 * ```
 *
 * The resulting type is `string[]`.
 *
 * **Internal: not for public use.**
 */
export declare type ɵValue<T extends AbstractControl | undefined> = T extends AbstractControl<any, any> ? T['value'] : never;

/**
 * ɵWriteable removes readonly from all keys.
 */
export declare type ɵWriteable<T> = {
    -readonly [P in keyof T]: T[P];
};

export { }
