/**
 * @license Angular v12.0.0-next.5+36.sha-eba1289
 * (c) 2010-2021 Google LLC. https://angular.io/
 * License: MIT
 */

import { AfterViewInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { InjectionToken } from '@angular/core';
import { Injector } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { StaticProvider } from '@angular/core';
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
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 * @publicApi
 */
export declare abstract class AbstractControl {
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
    readonly value: any;
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
     * The function that is used to determine the validity of this control synchronously.
     */
    get validator(): ValidatorFn | null;
    set validator(validatorFn: ValidatorFn | null);
    /**
     * The function that is used to determine the validity of this control asynchronously.
     */
    get asyncValidator(): AsyncValidatorFn | null;
    set asyncValidator(asyncValidatorFn: AsyncValidatorFn | null);
    /**
     * The parent control.
     */
    get parent(): FormGroup | FormArray | null;
    /**
     * The validation status of the control. There are four possible
     * validation status values:
     *
     * * **VALID**: This control has passed all validation checks.
     * * **INVALID**: This control has failed at least one validation check.
     * * **PENDING**: This control is in the midst of conducting a validation check.
     * * **DISABLED**: This control is exempt from validation checks.
     *
     * These status values are mutually exclusive, so a control cannot be
     * both valid AND invalid or invalid AND disabled.
     */
    readonly status: string;
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
     */
    readonly valueChanges: Observable<any>;
    /**
     * A multicasting observable that emits an event every time the validation `status` of the control
     * recalculates.
     *
     * @see {@link AbstractControl.status}
     *
     */
    readonly statusChanges: Observable<any>;
    /**
     * Reports the update strategy of the `AbstractControl` (meaning
     * the event on which the control updates itself).
     * Possible values: `'change'` | `'blur'` | `'submit'`
     * Default value: `'change'`
     */
    get updateOn(): FormHooks;
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this overwrites any existing sync validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    setValidators(newValidator: ValidatorFn | ValidatorFn[] | null): void;
    /**
     * Sets the async validators that are active on this control. Calling this
     * overwrites any existing async validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    setAsyncValidators(newValidator: AsyncValidatorFn | AsyncValidatorFn[] | null): void;
    /**
     * Empties out the sync validator list.
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
     * @see `markAsUntouched()`
     * @see `markAsDirty()`
     * @see `markAsPristine()`
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
     * @see `markAsTouched()`
     */
    markAllAsTouched(): void;
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     * @see `markAsTouched()`
     * @see `markAsDirty()`
     * @see `markAsPristine()`
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
     * @see `markAsTouched()`
     * @see `markAsUntouched()`
     * @see `markAsPristine()`
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
     * @see `markAsTouched()`
     * @see `markAsUntouched()`
     * @see `markAsDirty()`
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
     * @param parent Sets the parent of the control
     */
    setParent(parent: FormGroup | FormArray): void;
    /**
     * Sets the value of the control. Abstract method (implemented in sub-classes).
     */
    abstract setValue(value: any, options?: Object): void;
    /**
     * Patches the value of the control. Abstract method (implemented in sub-classes).
     */
    abstract patchValue(value: any, options?: Object): void;
    /**
     * Resets the control. Abstract method (implemented in sub-classes).
     */
    abstract reset(value?: any, options?: Object): void;
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
     * @param path A dot-delimited string or array of string/number values that define the path to the
     * control.
     *
     * @usageNotes
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     *
     * ### Retrieve a control in a FormArray
     *
     * When accessing an element inside a FormArray, you can use an element index.
     * For example, to get a `price` control from the first element in an `items` array you can use:
     *
     * * `this.form.get('items.0.price');`
     *
     * -OR-
     *
     * * `this.form.get(['items', 0, 'price']);`
     */
    get(path: Array<string | number> | string): AbstractControl | null;
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
     * Reports whether a control is pending, meaning that that async validation is occurring and
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
}

/**
 * A base class for Validator-based Directives. The class contains common logic shared across such
 * Directives.
 *
 * For internal use only, this class is not intended for use outside of the Forms package.
 */
declare abstract class AbstractValidatorDirective implements Validator {
    private _validator;
    private _onChange;
    /**
     * Helper function invoked from child classes to process changes (from `ngOnChanges` hook).
     * @nodoc
     */
    handleChanges(changes: SimpleChanges): void;
    /** @nodoc */
    validate(control: AbstractControl): ValidationErrors | null;
    /** @nodoc */
    registerOnValidatorChange(fn: () => void): void;
}

declare type AnyControlStatus = 'untouched' | 'touched' | 'pristine' | 'dirty' | 'valid' | 'invalid' | 'pending';

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
export declare class CheckboxControlValueAccessor extends ɵangular_packages_forms_forms_f implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    /**
     * The registered callback function called when a change event occurs on the input element.
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
     * Sets the "checked" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: any) => {}): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => {}): void;
    /**
     * Sets the "disabled" property on the input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
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
    /**
     * Method that validates whether or not the checkbox has been checked.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
}

/**
 * @description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * @publicApi
 */
export declare const COMPOSITION_BUFFER_MODE: InjectionToken<boolean>;

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
 * @see DefaultValueAccessor
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

/**
 * @description
 *
 * {@searchKeywords ngDefaultControl}
 *
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
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
export declare class DefaultValueAccessor implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    private _compositionMode;
    /**
     * The registered callback function called when an input event occurs on the input element.
     * @nodoc
     */
    onChange: (_: any) => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
    /** Whether the user is creating a composition string (IME events). */
    private _composing;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _compositionMode: boolean);
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: any) => void): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Sets the "disabled" property on the input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
}

/**
 * A directive that adds the `email` validator to controls marked with the
 * `email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
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
export declare class EmailValidator implements Validator {
    private _enabled;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the email attribute bound to this directive.
     */
    set email(value: boolean | string);
    /**
     * Method that validates whether an email address is valid.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
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
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormGroup`.
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
export declare class FormArray extends AbstractControl {
    controls: AbstractControl[];
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
    constructor(controls: AbstractControl[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to retrieve the control
     */
    at(index: number): AbstractControl;
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
    push(control: AbstractControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to insert the control
     * @param control Form control to be inserted
     * @param options Specifies whether this FormArray instance should emit events after a new
     *     control is inserted.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * inserted. When false, no events are emitted.
     */
    insert(index: number, control: AbstractControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param index Index in the array to remove the control
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
     * @param index Index in the array to replace the control
     * @param control The `AbstractControl` control to replace the existing control
     * @param options Specifies whether this FormArray instance should emit events after an
     *     existing control is replaced with a new one.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * replaced with a new one. When false, no events are emitted.
     */
    setControl(index: number, control: AbstractControl, options?: {
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
    setValue(value: any[], options?: {
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
     * `valueChanges` observables emit events with the latest status and value when the control value
     * is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value: any[], options?: {
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
     * console.log(this.arr.value);  // ['name', 'last name']
     * ```
     *
     * ### Reset the values in a form array and the disabled status for the first control
     *
     * ```
     * this.arr.reset([
     *   {value: 'name', disabled: true},
     *   'last'
     * ]);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * console.log(this.arr.get(0).status);  // 'DISABLED'
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
    reset(value?: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     * For enabled controls only, the `value` property is the best way to get the value of the array.
     */
    getRawValue(): any[];
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
 * @see `AbstractControl`
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
export declare class FormBuilder {
    /**
     * @description
     * Construct a new `FormGroup` instance.
     *
     * @param controlsConfig A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param options Configuration options object for the `FormGroup`. The object should have the
     * the `AbstractControlOptions` type and might contain the following fields:
     * * `validators`: A synchronous validator function, or an array of validator functions
     * * `asyncValidators`: A single async validator or array of async validator functions
     * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur' |
     * submit')
     */
    group(controlsConfig: {
        [key: string]: any;
    }, options?: AbstractControlOptions | null): FormGroup;
    /**
     * @description
     * Construct a new `FormGroup` instance.
     *
     * @deprecated This API is not typesafe and can result in issues with Closure Compiler renaming.
     * Use the `FormBuilder#group` overload with `AbstractControlOptions` instead.
     * Note that `AbstractControlOptions` expects `validators` and `asyncValidators` to be valid
     * validators. If you have custom validators, make sure their validation function parameter is
     * `AbstractControl` and not a sub-class, such as `FormGroup`. These functions will be called with
     * an object of type `AbstractControl` and that cannot be automatically downcast to a subclass, so
     * TypeScript sees this as an error. For example, change the `(group: FormGroup) =>
     * ValidationErrors|null` signature to be `(group: AbstractControl) => ValidationErrors|null`.
     *
     * @param controlsConfig A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param options Configuration options object for the `FormGroup`. The legacy configuration
     * object consists of:
     * * `validator`: A synchronous validator function, or an array of validator functions
     * * `asyncValidator`: A single async validator or array of async validator functions
     * Note: the legacy format is deprecated and might be removed in one of the next major versions
     * of Angular.
     */
    group(controlsConfig: {
        [key: string]: any;
    }, options: {
        [key: string]: any;
    }): FormGroup;
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
    control(formState: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControl;
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
    array(controlsConfig: any[], validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormArray;
}

/**
 * Tracks the value and validation status of an individual form control.
 *
 * This is one of the three fundamental building blocks of Angular forms, along with
 * `FormGroup` and `FormArray`. It extends the `AbstractControl` class that
 * implements most of the base functionality for accessing the value, validation status,
 * user interactions and events. See [usage examples below](#usage-notes).
 *
 * @see `AbstractControl`
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see [Usage Notes](#usage-notes)
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
 *```
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
 * The following example initializes the control with a sync validator.
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
 * ### Reset the control back to an initial value
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
 *
 * @publicApi
 */
export declare class FormControl extends AbstractControl {
    /**
     * Creates a new `FormControl` instance.
     *
     * @param formState Initializes the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
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
    setValue(value: any, options?: {
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
     * @see `setValue` for options
     */
    patchValue(value: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
        emitModelToViewChange?: boolean;
        emitViewToModelChange?: boolean;
    }): void;
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and setting
     * the value to null.
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
    reset(formState?: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
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
    private _applyFormState;
}

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
 * @see `FormControl`
 * @see `AbstractControl`
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
    constructor(validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[], valueAccessors: ControlValueAccessor[], _ngModelWarningConfig: string | null);
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
}

/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
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
}

/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormArray`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
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
 * @publicApi
 */
export declare class FormGroup extends AbstractControl {
    controls: {
        [key: string]: AbstractControl;
    };
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
    constructor(controls: {
        [key: string]: AbstractControl;
    }, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null);
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control.
     * Use {@link FormGroup#addControl addControl} instead.
     *
     * @param name The control name to register in the collection
     * @param control Provides the control for the given name
     */
    registerControl(name: string, control: AbstractControl): AbstractControl;
    /**
     * Add a control to this group.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to add to the collection
     * @param control Provides the control for the given name
     * @param options Specifies whether this FormGroup instance should emit events after a new
     *     control is added.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * added. When false, no events are emitted.
     */
    addControl(name: string, control: AbstractControl, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Remove a control from this group.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to remove from the collection
     * @param options Specifies whether this FormGroup instance should emit events after a
     *     control is removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * removed. When false, no events are emitted.
     */
    removeControl(name: string, options?: {
        emitEvent?: boolean;
    }): void;
    /**
     * Replace an existing control.
     *
     * @param name The control name to replace in the collection
     * @param control Provides the control for the given name
     * @param options Specifies whether this FormGroup instance should emit events after an
     *     existing control is replaced.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * replaced with a new one. When false, no events are emitted.
     */
    setControl(name: string, control: AbstractControl, options?: {
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
    contains(controlName: string): boolean;
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
    setValue(value: {
        [key: string]: any;
    }, options?: {
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
    patchValue(value: {
        [key: string]: any;
    }, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
     * the value of all descendants to null.
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
    reset(value?: any, options?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     * The `value` property is the best way to get the value of the group, because
     * it excludes disabled controls in the `FormGroup`.
     */
    getRawValue(): any;
}

/**
 * @description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
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
    private validators;
    private asyncValidators;
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
    constructor(validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[]);
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
}

/**
 * @description
 *
 * Syncs a nested `FormGroup` to a DOM element.
 *
 * This directive can only be used with a parent `FormGroupDirective`.
 *
 * It accepts the string name of the nested `FormGroup` to link, and
 * looks for a `FormGroup` registered with that name in the parent
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
 * The following example uses the {@link AbstractControl#get get} method to access the
 * associated `FormGroup`
 *
 * ```ts
 *   this.form.get('name');
 * ```
 *
 * ### Access individual controls in the group
 *
 * The following example uses the {@link AbstractControl#get get} method to access
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
}

declare type FormHooks = 'change' | 'blur' | 'submit';

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
}

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
export declare class MaxLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the maximum length bound to this directive.
     */
    maxlength: string | number;
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Method that validates whether the value exceeds the maximum length requirement.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
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
export declare class MaxValidator extends AbstractValidatorDirective implements OnChanges {
    /**
     * @description
     * Tracks changes to the max bound to this directive.
     */
    max: string | number;
    /**
     * Declare `ngOnChanges` lifecycle hook at the main directive level (vs keeping it in base class)
     * to avoid differences in handling inheritance of lifecycle hooks between Ivy and ViewEngine in
     * AOT mode. This could be refactored once ViewEngine is removed.
     * @nodoc
     */
    ngOnChanges(changes: SimpleChanges): void;
}

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
export declare class MinLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the minimum length bound to this directive.
     */
    minlength: string | number;
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Method that validates whether the value meets a minimum length requirement.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
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
export declare class MinValidator extends AbstractValidatorDirective implements OnChanges {
    /**
     * @description
     * Tracks changes to the min bound to this directive.
     */
    min: string | number;
    /**
     * Declare `ngOnChanges` lifecycle hook at the main directive level (vs keeping it in base class)
     * to avoid differences in handling inheritance of lifecycle hooks between Ivy and ViewEngine in
     * AOT mode. This could be refactored once ViewEngine is removed.
     * @nodoc
     */
    ngOnChanges(changes: SimpleChanges): void;
}

/**
 * @description
 * An `InjectionToken` for registering additional asynchronous validators used with
 * `AbstractControl`s.
 *
 * @see `NG_VALIDATORS`
 *
 * @publicApi
 */
export declare const NG_ASYNC_VALIDATORS: InjectionToken<(Function | Validator)[]>;

/**
 * @description
 * An `InjectionToken` for registering additional synchronous validators used with
 * `AbstractControl`s.
 *
 * @see `NG_ASYNC_VALIDATORS`
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
export declare const NG_VALIDATORS: InjectionToken<(Function | Validator)[]>;

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
export declare class NgControlStatus extends ɵangular_packages_forms_forms_h {
    constructor(cd: NgControl);
}

/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @see `NgControlStatus`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgControlStatusGroup extends ɵangular_packages_forms_forms_h {
    constructor(cd: ControlContainer);
}

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
    constructor(validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[]);
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
}

/**
 * @description
 * Creates a `FormControl` instance from a domain model and binds it
 * to a form control element.
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
 * @see `RadioControlValueAccessor`
 * @see `SelectControlValueAccessor`
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
    constructor(parent: ControlContainer, validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[], valueAccessors: ControlValueAccessor[]);
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
}

/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see `SelectControlValueAccessor`
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
export declare class NumberValueAccessor extends ɵangular_packages_forms_forms_f implements ControlValueAccessor {
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
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: number): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: number | null) => void): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Sets the "disabled" property on the input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
}

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
export declare class PatternValidator implements Validator, OnChanges {
    private _validator;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the pattern bound to this directive.
     */
    pattern: string | RegExp;
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Method that validates whether the value matches the pattern requirement.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
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
export declare class RadioControlValueAccessor extends ɵangular_packages_forms_forms_f implements ControlValueAccessor, OnDestroy, OnInit {
    private _renderer;
    private _elementRef;
    private _registry;
    private _injector;
    /**
     * The registered callback function called when a change event occurs on the input element.
     * @nodoc
     */
    onChange: () => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
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
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _registry: ɵangular_packages_forms_forms_p, _injector: Injector);
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
    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    fireUncheck(value: any): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => {}): void;
    /**
     * Sets the "disabled" property on the input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
    private _checkName;
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
export declare class RangeValueAccessor extends ɵangular_packages_forms_forms_f implements ControlValueAccessor {
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
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: number | null) => void): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Sets the "disabled" property on the range input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
}

/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 *
 * Providers associated with this module:
 * * `FormBuilder`
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
     */
    static withConfig(opts: {
        /** @deprecated as of v6 */ warnOnNgModelWithFormControl: 'never' | 'once' | 'always';
    }): ModuleWithProviders<ReactiveFormsModule>;
}

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
export declare class RequiredValidator implements Validator {
    private _required;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the required attribute bound to this directive.
     */
    get required(): boolean | string;
    set required(value: boolean | string);
    /**
     * Method that validates whether the control is empty.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
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
export declare class SelectControlValueAccessor extends ɵangular_packages_forms_forms_f implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    /** @nodoc */
    value: any;
    /**
     * The registered callback function called when a change event occurs on the input element.
     * @nodoc
     */
    onChange: (_: any) => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    /**
     * Sets the "value" property on the input element. The "selectedIndex"
     * property is also set if an ID is provided on the option element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (value: any) => any): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => any): void;
    /**
     * Sets the "disabled" property on the select input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
}

/**
 * @description
 * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
 * control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @see `SelectControlValueAccessor`
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
export declare class SelectMultipleControlValueAccessor extends ɵangular_packages_forms_forms_f implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    /**
     * The current value.
     * @nodoc
     */
    value: any;
    /**
     * The registered callback function called when a change event occurs on the input element.
     * @nodoc
     */
    onChange: (_: any) => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
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
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => any): void;
    /**
     * Sets the "disabled" property on the select input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
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
     * @see `updateValueAndValidity()`
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
     * @see `updateValueAndValidity()`
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
     * @see `updateValueAndValidity()`
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
     * const control = new FormControl('', Validators.requiredTrue);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map that contains the `required` property
     * set to `true` if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static requiredTrue(control: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Validator that requires the control's value pass an email validation test.
     *
     * Tests the value using a [regular
     * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
     * pattern suitable for common usecases. The pattern is based on the definition of a valid email
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
     * @see `updateValueAndValidity()`
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
     * @see `updateValueAndValidity()`
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
     * @see `updateValueAndValidity()`
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
     * @see `updateValueAndValidity()`
     *
     */
    static pattern(pattern: string | RegExp): ValidatorFn;
    /**
     * @description
     * Validator that performs no operation.
     *
     * @see `updateValueAndValidity()`
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
     * @see `updateValueAndValidity()`
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
     * @see `updateValueAndValidity()`
     *
     */
    static composeAsync(validators: (AsyncValidatorFn | null)[]): AsyncValidatorFn | null;
}

/**
 * @publicApi
 */
export declare const VERSION: Version;

export declare const ɵangular_packages_forms_forms_a: Type<any>[];

export declare const ɵangular_packages_forms_forms_b: Type<any>[];

/**
 * @description
 * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_bb: StaticProvider;

/**
 * @description
 * Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_bc: StaticProvider;

/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_bd: StaticProvider;

/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_be: StaticProvider;

/**
 * @description
 * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_bf: any;

/**
 * @description
 * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_bg: any;

/**
 * @description
 * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_bh: any;

/**
 * @description
 * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const ɵangular_packages_forms_forms_bi: any;

/**
 * Validator that requires the control's value to be greater than or equal to the provided number.
 * See `Validators.min` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bj(min: number): ValidatorFn;

/**
 * Validator that requires the control's value to be less than or equal to the provided number.
 * See `Validators.max` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bk(max: number): ValidatorFn;

/**
 * Validator that requires the control have a non-empty value.
 * See `Validators.required` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bl(control: AbstractControl): ValidationErrors | null;

/**
 * Validator that requires the control's value be true. This validator is commonly
 * used for required checkboxes.
 * See `Validators.requiredTrue` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bm(control: AbstractControl): ValidationErrors | null;

/**
 * Validator that requires the control's value pass an email validation test.
 * See `Validators.email` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bn(control: AbstractControl): ValidationErrors | null;

/**
 * Validator that requires the length of the control's value to be greater than or equal
 * to the provided minimum length. See `Validators.minLength` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bo(minLength: number): ValidatorFn;

/**
 * Validator that requires the length of the control's value to be less than or equal
 * to the provided maximum length. See `Validators.maxLength` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bp(maxLength: number): ValidatorFn;

/**
 * Validator that requires the control's value to match a regex pattern.
 * See `Validators.pattern` for additional information.
 */
export declare function ɵangular_packages_forms_forms_bq(pattern: string | RegExp): ValidatorFn;

/**
 * Function that has `ValidatorFn` shape, but performs no operation.
 */
export declare function ɵangular_packages_forms_forms_br(control: AbstractControl): ValidationErrors | null;

export declare const ɵangular_packages_forms_forms_c: Type<any>[];

export declare const ɵangular_packages_forms_forms_e: any;

/**
 * Base class for all built-in ControlValueAccessor classes. We use this class to distinguish
 * between built-in and custom CVAs, so that Forms logic can recognize built-in CVAs and treat
 * custom ones with higher priority (when both built-in and custom CVAs are present).
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
export declare class ɵangular_packages_forms_forms_f {
}

export declare const ɵangular_packages_forms_forms_g: any;

export declare class ɵangular_packages_forms_forms_h {
    private _cd;
    constructor(cd: AbstractControlDirective | null);
    is(status: AnyControlStatus): boolean;
}

export declare const ɵangular_packages_forms_forms_i: {
    '[class.ng-untouched]': string;
    '[class.ng-touched]': string;
    '[class.ng-pristine]': string;
    '[class.ng-dirty]': string;
    '[class.ng-valid]': string;
    '[class.ng-invalid]': string;
    '[class.ng-pending]': string;
};

export declare const ɵangular_packages_forms_forms_j: any;

export declare const ɵangular_packages_forms_forms_k: any;

export declare const ɵangular_packages_forms_forms_l: any;

export declare const ɵangular_packages_forms_forms_m: any;

export declare const ɵangular_packages_forms_forms_n: any;

/**
 * Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
 * provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
 * declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
 * `forwardRef` logic.
 */
export declare class ɵangular_packages_forms_forms_o {
}

/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
export declare class ɵangular_packages_forms_forms_p {
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
}

export declare const ɵangular_packages_forms_forms_q: StaticProvider;

/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
export declare const ɵangular_packages_forms_forms_r: InjectionToken<unknown>;

export declare const ɵangular_packages_forms_forms_s: any;

export declare const ɵangular_packages_forms_forms_t: any;

export declare const ɵangular_packages_forms_forms_u: any;

export declare const ɵangular_packages_forms_forms_v: any;

export declare const ɵangular_packages_forms_forms_w: any;

export declare const ɵangular_packages_forms_forms_x: StaticProvider;

export declare const ɵangular_packages_forms_forms_y: StaticProvider;

/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
declare class ɵInternalFormsSharedModule {
}
export { ɵInternalFormsSharedModule }
export { ɵInternalFormsSharedModule as ɵangular_packages_forms_forms_d }


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
declare class ɵNgNoValidate {
}
export { ɵNgNoValidate }
export { ɵNgNoValidate as ɵangular_packages_forms_forms_ba }

/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see `SelectMultipleControlValueAccessor`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
declare class ɵNgSelectMultipleOption implements OnDestroy {
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
}
export { ɵNgSelectMultipleOption }
export { ɵNgSelectMultipleOption as ɵangular_packages_forms_forms_z }

export { }
