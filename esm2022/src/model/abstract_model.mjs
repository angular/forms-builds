/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, ɵRuntimeError as RuntimeError } from '@angular/core';
import { Subject } from 'rxjs';
import { asyncValidatorsDroppedWithOptsWarning, missingControlError, missingControlValueError, noControlsError, } from '../directives/reactive_errors';
import { addValidators, composeAsyncValidators, composeValidators, hasValidator, removeValidators, toObservable, } from '../validators';
/**
 * Reports that a control is valid, meaning that no errors exist in the input value.
 *
 * @see {@link status}
 */
export const VALID = 'VALID';
/**
 * Reports that a control is invalid, meaning that an error exists in the input value.
 *
 * @see {@link status}
 */
export const INVALID = 'INVALID';
/**
 * Reports that a control is pending, meaning that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * @see {@link markAsPending}
 * @see {@link status}
 */
export const PENDING = 'PENDING';
/**
 * Reports that a control is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see {@link markAsDisabled}
 * @see {@link status}
 */
export const DISABLED = 'DISABLED';
/**
 * Base class for every event sent by `AbstractControl.events()`
 *
 * @publicApi
 */
export class ControlEvent {
}
/**
 * Event fired when the value of a control changes.
 *
 * @publicApi
 */
export class ValueChangeEvent extends ControlEvent {
    constructor(value, source) {
        super();
        this.value = value;
        this.source = source;
    }
}
/**
 * Event fired when the control's pristine state changes (pristine <=> dirty).
 *
 * @publicApi
 */
export class PristineChangeEvent extends ControlEvent {
    constructor(pristine, source) {
        super();
        this.pristine = pristine;
        this.source = source;
    }
}
/**
 * Event fired when the control's touched status changes (touched <=> untouched).
 *
 * @publicApi
 */
export class TouchedChangeEvent extends ControlEvent {
    constructor(touched, source) {
        super();
        this.touched = touched;
        this.source = source;
    }
}
/**
 * Event fired when the control's status changes.
 *
 * @publicApi
 */
export class StatusChangeEvent extends ControlEvent {
    constructor(status, source) {
        super();
        this.status = status;
        this.source = source;
    }
}
/**
 * Gets validators from either an options object or given validators.
 */
export function pickValidators(validatorOrOpts) {
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}
/**
 * Creates validator function by combining provided validators.
 */
function coerceToValidator(validator) {
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
/**
 * Gets async validators from either an options object or given validators.
 */
export function pickAsyncValidators(asyncValidator, validatorOrOpts) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (isOptionsObj(validatorOrOpts) && asyncValidator) {
            console.warn(asyncValidatorsDroppedWithOptsWarning);
        }
    }
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
/**
 * Creates async validator function by combining provided async validators.
 */
function coerceToAsyncValidator(asyncValidator) {
    return Array.isArray(asyncValidator)
        ? composeAsyncValidators(asyncValidator)
        : asyncValidator || null;
}
export function isOptionsObj(validatorOrOpts) {
    return (validatorOrOpts != null &&
        !Array.isArray(validatorOrOpts) &&
        typeof validatorOrOpts === 'object');
}
export function assertControlPresent(parent, isGroup, key) {
    const controls = parent.controls;
    const collection = isGroup ? Object.keys(controls) : controls;
    if (!collection.length) {
        throw new RuntimeError(1000 /* RuntimeErrorCode.NO_CONTROLS */, typeof ngDevMode === 'undefined' || ngDevMode ? noControlsError(isGroup) : '');
    }
    if (!controls[key]) {
        throw new RuntimeError(1001 /* RuntimeErrorCode.MISSING_CONTROL */, typeof ngDevMode === 'undefined' || ngDevMode ? missingControlError(isGroup, key) : '');
    }
}
export function assertAllValuesPresent(control, isGroup, value) {
    control._forEachChild((_, key) => {
        if (value[key] === undefined) {
            throw new RuntimeError(1002 /* RuntimeErrorCode.MISSING_CONTROL_VALUE */, typeof ngDevMode === 'undefined' || ngDevMode ? missingControlValueError(isGroup, key) : '');
        }
    });
}
// clang-format on
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
 * @see [Forms Guide](guide/forms)
 * @see [Reactive Forms Guide](guide/forms/reactive-forms)
 * @see [Dynamic Forms Guide](guide/forms/dynamic-forms)
 *
 * @publicApi
 */
export class AbstractControl {
    /**
     * Initialize the AbstractControl instance.
     *
     * @param validators The function or array of functions that is used to determine the validity of
     *     this control synchronously.
     * @param asyncValidators The function or array of functions that is used to determine validity of
     *     this control asynchronously.
     */
    constructor(validators, asyncValidators) {
        /** @internal */
        this._pendingDirty = false;
        /**
         * Indicates that a control has its own pending asynchronous validation in progress.
         *
         * @internal
         */
        this._hasOwnPendingAsyncValidator = false;
        /** @internal */
        this._pendingTouched = false;
        /** @internal */
        this._onCollectionChange = () => { };
        this._parent = null;
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
         * Programmatic changes to a control's value do not mark it dirty.
         */
        this.pristine = true;
        /**
         * True if the control is marked as `touched`.
         *
         * A control is marked `touched` once the user has triggered
         * a `blur` event on it.
         */
        this.touched = false;
        /**
         * Exposed as observable, see below.
         *
         * @internal
         */
        this._events = new Subject();
        /**
         * A multicasting observable that emits an event every time the state of the control changes.
         * It emits for value, status, pristine or touched changes.
         *
         * **Note**: On value change, the emit happens right after a value of this control is updated. The
         * value of a parent control (for example if this FormControl is a part of a FormGroup) is updated
         * later, so accessing a value of a parent control (using the `value` property) from the callback
         * of this event might result in getting a value that has not been updated yet. Subscribe to the
         * `events` of the parent control instead.
         * For other event types, the events are emitted after the parent control has been updated.
         *
         */
        this.events = this._events.asObservable();
        /** @internal */
        this._onDisabledChange = [];
        this._assignValidators(validators);
        this._assignAsyncValidators(asyncValidators);
    }
    /**
     * Returns the function that is used to determine the validity of this control synchronously.
     * If multiple validators have been added, this will be a single composed function.
     * See `Validators.compose()` for additional information.
     */
    get validator() {
        return this._composedValidatorFn;
    }
    set validator(validatorFn) {
        this._rawValidators = this._composedValidatorFn = validatorFn;
    }
    /**
     * Returns the function that is used to determine the validity of this control asynchronously.
     * If multiple validators have been added, this will be a single composed function.
     * See `Validators.compose()` for additional information.
     */
    get asyncValidator() {
        return this._composedAsyncValidatorFn;
    }
    set asyncValidator(asyncValidatorFn) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
    }
    /**
     * The parent control.
     */
    get parent() {
        return this._parent;
    }
    /**
     * A control is `valid` when its `status` is `VALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control has passed all of its validation tests,
     * false otherwise.
     */
    get valid() {
        return this.status === VALID;
    }
    /**
     * A control is `invalid` when its `status` is `INVALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control has failed one or more of its validation checks,
     * false otherwise.
     */
    get invalid() {
        return this.status === INVALID;
    }
    /**
     * A control is `pending` when its `status` is `PENDING`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control is in the process of conducting a validation check,
     * false otherwise.
     */
    get pending() {
        return this.status == PENDING;
    }
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
    get disabled() {
        return this.status === DISABLED;
    }
    /**
     * A control is `enabled` as long as its `status` is not `DISABLED`.
     *
     * @returns True if the control has any status other than 'DISABLED',
     * false if the status is 'DISABLED'.
     *
     * @see {@link AbstractControl.status}
     *
     */
    get enabled() {
        return this.status !== DISABLED;
    }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
     * Programmatic changes to a control's value do not mark it dirty.
     */
    get dirty() {
        return !this.pristine;
    }
    /**
     * True if the control has not been marked as touched
     *
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     */
    get untouched() {
        return !this.touched;
    }
    /**
     * Reports the update strategy of the `AbstractControl` (meaning
     * the event on which the control updates itself).
     * Possible values: `'change'` | `'blur'` | `'submit'`
     * Default value: `'change'`
     */
    get updateOn() {
        return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
    }
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
    setValidators(validators) {
        this._assignValidators(validators);
    }
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
    setAsyncValidators(validators) {
        this._assignAsyncValidators(validators);
    }
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
    addValidators(validators) {
        this.setValidators(addValidators(validators, this._rawValidators));
    }
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
    addAsyncValidators(validators) {
        this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
    }
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
    removeValidators(validators) {
        this.setValidators(removeValidators(validators, this._rawValidators));
    }
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
    removeAsyncValidators(validators) {
        this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
    }
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
    hasValidator(validator) {
        return hasValidator(this._rawValidators, validator);
    }
    /**
     * Check whether an asynchronous validator function is present on this control. The provided
     * validator must be a reference to the exact same function that was provided.
     *
     * @param validator The asynchronous validator to check for presence. Compared by function
     *     reference.
     * @returns Whether the provided asynchronous validator was found on this control.
     */
    hasAsyncValidator(validator) {
        return hasValidator(this._rawAsyncValidators, validator);
    }
    /**
     * Empties out the synchronous validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearValidators() {
        this.validator = null;
    }
    /**
     * Empties out the async validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearAsyncValidators() {
        this.asyncValidator = null;
    }
    markAsTouched(opts = {}) {
        const changed = this.touched === false;
        this.touched = true;
        const sourceControl = opts.sourceControl ?? this;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched({ ...opts, sourceControl });
        }
        if (changed && opts.emitEvent !== false) {
            this._events.next(new TouchedChangeEvent(true, sourceControl));
        }
    }
    /**
     * Marks the control and all its descendant controls as `touched`.
     * @see {@link markAsTouched()}
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `emitEvent`: When true or not supplied (the default), the `events`
     * observable emits a `TouchedChangeEvent` with the `touched` property being `true`.
     * When false, no events are emitted.
     */
    markAllAsTouched(opts = {}) {
        this.markAsTouched({ onlySelf: true, emitEvent: opts.emitEvent, sourceControl: this });
        this._forEachChild((control) => control.markAllAsTouched(opts));
    }
    markAsUntouched(opts = {}) {
        const changed = this.touched === true;
        this.touched = false;
        this._pendingTouched = false;
        const sourceControl = opts.sourceControl ?? this;
        this._forEachChild((control) => {
            control.markAsUntouched({ onlySelf: true, emitEvent: opts.emitEvent, sourceControl });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts, sourceControl);
        }
        if (changed && opts.emitEvent !== false) {
            this._events.next(new TouchedChangeEvent(false, sourceControl));
        }
    }
    markAsDirty(opts = {}) {
        const changed = this.pristine === true;
        this.pristine = false;
        const sourceControl = opts.sourceControl ?? this;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsDirty({ ...opts, sourceControl });
        }
        if (changed && opts.emitEvent !== false) {
            this._events.next(new PristineChangeEvent(false, sourceControl));
        }
    }
    markAsPristine(opts = {}) {
        const changed = this.pristine === false;
        this.pristine = true;
        this._pendingDirty = false;
        const sourceControl = opts.sourceControl ?? this;
        this._forEachChild((control) => {
            /** We don't propagate the source control downwards */
            control.markAsPristine({ onlySelf: true, emitEvent: opts.emitEvent });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts, sourceControl);
        }
        if (changed && opts.emitEvent !== false) {
            this._events.next(new PristineChangeEvent(true, sourceControl));
        }
    }
    markAsPending(opts = {}) {
        this.status = PENDING;
        const sourceControl = opts.sourceControl ?? this;
        if (opts.emitEvent !== false) {
            this._events.next(new StatusChangeEvent(this.status, sourceControl));
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsPending({ ...opts, sourceControl });
        }
    }
    disable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild((control) => {
            /** We don't propagate the source control downwards */
            control.disable({ ...opts, onlySelf: true });
        });
        this._updateValue();
        const sourceControl = opts.sourceControl ?? this;
        if (opts.emitEvent !== false) {
            this._events.next(new ValueChangeEvent(this.value, sourceControl));
            this._events.next(new StatusChangeEvent(this.status, sourceControl));
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        this._updateAncestors({ ...opts, skipPristineCheck }, this);
        this._onDisabledChange.forEach((changeFn) => changeFn(true));
    }
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
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`,
     * `valueChanges` and `events`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     */
    enable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = VALID;
        this._forEachChild((control) => {
            control.enable({ ...opts, onlySelf: true });
        });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors({ ...opts, skipPristineCheck }, this);
        this._onDisabledChange.forEach((changeFn) => changeFn(false));
    }
    _updateAncestors(opts, sourceControl) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            if (!opts.skipPristineCheck) {
                this._parent._updatePristine({}, sourceControl);
            }
            this._parent._updateTouched({}, sourceControl);
        }
    }
    /**
     * Sets the parent of the control
     *
     * @param parent The new parent.
     */
    setParent(parent) {
        this._parent = parent;
    }
    /**
     * The raw value of this control. For most control implementations, the raw value will include
     * disabled children.
     */
    getRawValue() {
        return this.value;
    }
    updateValueAndValidity(opts = {}) {
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._cancelExistingSubscription();
            this.errors = this._runValidator();
            this.status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                this._runAsyncValidator(opts.emitEvent);
            }
        }
        const sourceControl = opts.sourceControl ?? this;
        if (opts.emitEvent !== false) {
            this._events.next(new ValueChangeEvent(this.value, sourceControl));
            this._events.next(new StatusChangeEvent(this.status, sourceControl));
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity({ ...opts, sourceControl });
        }
    }
    /** @internal */
    _updateTreeValidity(opts = { emitEvent: true }) {
        this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
    }
    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? DISABLED : VALID;
    }
    _runValidator() {
        return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(emitEvent) {
        if (this.asyncValidator) {
            this.status = PENDING;
            this._hasOwnPendingAsyncValidator = true;
            const obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription = obs.subscribe((errors) => {
                this._hasOwnPendingAsyncValidator = false;
                // This will trigger the recalculation of the validation status, which depends on
                // the state of the asynchronous validation (whether it is in progress or not). So, it is
                // necessary that we have updated the `_hasOwnPendingAsyncValidator` boolean flag first.
                this.setErrors(errors, { emitEvent });
            });
        }
    }
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
            this._hasOwnPendingAsyncValidator = false;
        }
    }
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
    setErrors(errors, opts = {}) {
        this.errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false, this);
    }
    /**
     * Retrieves a child control given the control's name or path.
     *
     * @param path A dot-delimited string or array of string/number values that define the path to the
     * control. If a string is provided, passing it as a string literal will result in improved type
     * information. Likewise, if an array is provided, passing it `as const` will cause improved type
     * information to be available.
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
     * * `this.form.get(['person', 'name'] as const);` // `as const` gives improved typings
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
    get(path) {
        let currPath = path;
        if (currPath == null)
            return null;
        if (!Array.isArray(currPath))
            currPath = currPath.split('.');
        if (currPath.length === 0)
            return null;
        return currPath.reduce((control, name) => control && control._find(name), this);
    }
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
    getError(errorCode, path) {
        const control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    }
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
    hasError(errorCode, path) {
        return !!this.getError(errorCode, path);
    }
    /**
     * Retrieves the top-level ancestor of this control.
     */
    get root() {
        let x = this;
        while (x._parent) {
            x = x._parent;
        }
        return x;
    }
    /** @internal */
    _updateControlsErrors(emitEvent, changedControl) {
        this.status = this._calculateStatus();
        if (emitEvent) {
            this.statusChanges.emit(this.status);
            this._events.next(new StatusChangeEvent(this.status, changedControl));
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent, changedControl);
        }
    }
    /** @internal */
    _initObservables() {
        this.valueChanges = new EventEmitter();
        this.statusChanges = new EventEmitter();
    }
    _calculateStatus() {
        if (this._allControlsDisabled())
            return DISABLED;
        if (this.errors)
            return INVALID;
        if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    }
    /** @internal */
    _anyControlsHaveStatus(status) {
        return this._anyControls((control) => control.status === status);
    }
    /** @internal */
    _anyControlsDirty() {
        return this._anyControls((control) => control.dirty);
    }
    /** @internal */
    _anyControlsTouched() {
        return this._anyControls((control) => control.touched);
    }
    /** @internal */
    _updatePristine(opts, changedControl) {
        const newPristine = !this._anyControlsDirty();
        const changed = this.pristine !== newPristine;
        this.pristine = newPristine;
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts, changedControl);
        }
        if (changed) {
            this._events.next(new PristineChangeEvent(this.pristine, changedControl));
        }
    }
    /** @internal */
    _updateTouched(opts = {}, changedControl) {
        this.touched = this._anyControlsTouched();
        this._events.next(new TouchedChangeEvent(this.touched, changedControl));
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts, changedControl);
        }
    }
    /** @internal */
    _registerOnCollectionChange(fn) {
        this._onCollectionChange = fn;
    }
    /** @internal */
    _setUpdateStrategy(opts) {
        if (isOptionsObj(opts) && opts.updateOn != null) {
            this._updateOn = opts.updateOn;
        }
    }
    /**
     * Check to see if parent has been marked artificially dirty.
     *
     * @internal
     */
    _parentMarkedDirty(onlySelf) {
        const parentDirty = this._parent && this._parent.dirty;
        return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
    }
    /** @internal */
    _find(name) {
        return null;
    }
    /**
     * Internal implementation of the `setValidators` method. Needs to be separated out into a
     * different method, because it is called in the constructor and it can break cases where
     * a control is extended.
     */
    _assignValidators(validators) {
        this._rawValidators = Array.isArray(validators) ? validators.slice() : validators;
        this._composedValidatorFn = coerceToValidator(this._rawValidators);
    }
    /**
     * Internal implementation of the `setAsyncValidators` method. Needs to be separated out into a
     * different method, because it is called in the constructor and it can break cases where
     * a control is extended.
     */
    _assignAsyncValidators(validators) {
        this._rawAsyncValidators = Array.isArray(validators) ? validators.slice() : validators;
        this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwvYWJzdHJhY3RfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxhQUFhLElBQUksWUFBWSxFQUF3QixNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXpDLE9BQU8sRUFDTCxxQ0FBcUMsRUFDckMsbUJBQW1CLEVBQ25CLHdCQUF3QixFQUN4QixlQUFlLEdBQ2hCLE1BQU0sK0JBQStCLENBQUM7QUFJdkMsT0FBTyxFQUNMLGFBQWEsRUFDYixzQkFBc0IsRUFDdEIsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBRTdCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFakM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztBQW1CbkM7Ozs7R0FJRztBQUNILE1BQU0sT0FBZ0IsWUFBWTtDQUtqQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sZ0JBQW9CLFNBQVEsWUFBZTtJQUN0RCxZQUNrQixLQUFRLEVBQ1IsTUFBdUI7UUFFdkMsS0FBSyxFQUFFLENBQUM7UUFIUSxVQUFLLEdBQUwsS0FBSyxDQUFHO1FBQ1IsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7SUFHekMsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1B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QyxJQUFxQjtRQUN6QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssaUJBQWlCLENBQUMsVUFBOEM7UUFDdEUsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNsRixJQUFJLENBQUMsb0JBQW9CLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssc0JBQXNCLENBQUMsVUFBd0Q7UUFDckYsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ3ZGLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNwRixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtFdmVudEVtaXR0ZXIsIMm1UnVudGltZUVycm9yIGFzIFJ1bnRpbWVFcnJvciwgybVXcml0YWJsZSBhcyBXcml0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIFN1YmplY3R9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge1xuICBhc3luY1ZhbGlkYXRvcnNEcm9wcGVkV2l0aE9wdHNXYXJuaW5nLFxuICBtaXNzaW5nQ29udHJvbEVycm9yLFxuICBtaXNzaW5nQ29udHJvbFZhbHVlRXJyb3IsXG4gIG5vQ29udHJvbHNFcnJvcixcbn0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7UnVudGltZUVycm9yQ29kZX0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7Rm9ybUFycmF5LCBGb3JtR3JvdXB9IGZyb20gJy4uL2Zvcm1zJztcbmltcG9ydCB7XG4gIGFkZFZhbGlkYXRvcnMsXG4gIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMsXG4gIGNvbXBvc2VWYWxpZGF0b3JzLFxuICBoYXNWYWxpZGF0b3IsXG4gIHJlbW92ZVZhbGlkYXRvcnMsXG4gIHRvT2JzZXJ2YWJsZSxcbn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyB2YWxpZCwgbWVhbmluZyB0aGF0IG5vIGVycm9ycyBleGlzdCBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5leHBvcnQgY29uc3QgVkFMSUQgPSAnVkFMSUQnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5leHBvcnQgY29uc3QgSU5WQUxJRCA9ICdJTlZBTElEJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIHBlbmRpbmcsIG1lYW5pbmcgdGhhdCBhc3luYyB2YWxpZGF0aW9uIGlzIG9jY3VycmluZyBhbmRcbiAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBtYXJrQXNQZW5kaW5nfVxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5leHBvcnQgY29uc3QgUEVORElORyA9ICdQRU5ESU5HJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIGRpc2FibGVkLCBtZWFuaW5nIHRoYXQgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gYW5jZXN0b3JcbiAqIGNhbGN1bGF0aW9ucyBvZiB2YWxpZGl0eSBvciB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBtYXJrQXNEaXNhYmxlZH1cbiAqIEBzZWUge0BsaW5rIHN0YXR1c31cbiAqL1xuZXhwb3J0IGNvbnN0IERJU0FCTEVEID0gJ0RJU0FCTEVEJztcblxuLyoqXG4gKiBBIGZvcm0gY2FuIGhhdmUgc2V2ZXJhbCBkaWZmZXJlbnQgc3RhdHVzZXMuIEVhY2hcbiAqIHBvc3NpYmxlIHN0YXR1cyBpcyByZXR1cm5lZCBhcyBhIHN0cmluZyBsaXRlcmFsLlxuICpcbiAqICogKipWQUxJRCoqOiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dFxuICogdmFsdWUuXG4gKiAqICoqSU5WQUxJRCoqOiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipQRU5ESU5HKio6IFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IGFzeW5jIHZhbGlkYXRpb24gaXNcbiAqIG9jY3VycmluZyBhbmQgZXJyb3JzIGFyZSBub3QgeWV0IGF2YWlsYWJsZSBmb3IgdGhlIGlucHV0IHZhbHVlLlxuICogKiAqKkRJU0FCTEVEKio6IFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXNcbiAqIGRpc2FibGVkLCBtZWFuaW5nIHRoYXQgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gYW5jZXN0b3IgY2FsY3VsYXRpb25zIG9mIHZhbGlkaXR5IG9yIHZhbHVlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgRm9ybUNvbnRyb2xTdGF0dXMgPSAnVkFMSUQnIHwgJ0lOVkFMSUQnIHwgJ1BFTkRJTkcnIHwgJ0RJU0FCTEVEJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBldmVyeSBldmVudCBzZW50IGJ5IGBBYnN0cmFjdENvbnRyb2wuZXZlbnRzKClgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQ29udHJvbEV2ZW50PFQgPSBhbnk+IHtcbiAgLyoqXG4gICAqIEZvcm0gY29udHJvbCBmcm9tIHdoaWNoIHRoaXMgZXZlbnQgaXMgb3JpZ2luYXRlZC5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBzb3VyY2U6IEFic3RyYWN0Q29udHJvbDx1bmtub3duPjtcbn1cblxuLyoqXG4gKiBFdmVudCBmaXJlZCB3aGVuIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2wgY2hhbmdlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWx1ZUNoYW5nZUV2ZW50PFQ+IGV4dGVuZHMgQ29udHJvbEV2ZW50PFQ+IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IHZhbHVlOiBULFxuICAgIHB1YmxpYyByZWFkb25seSBzb3VyY2U6IEFic3RyYWN0Q29udHJvbCxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuXG4vKipcbiAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIGNvbnRyb2wncyBwcmlzdGluZSBzdGF0ZSBjaGFuZ2VzIChwcmlzdGluZSA8PT4gZGlydHkpLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIFByaXN0aW5lQ2hhbmdlRXZlbnQgZXh0ZW5kcyBDb250cm9sRXZlbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgcHJpc3RpbmU6IGJvb2xlYW4sXG4gICAgcHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG5cbi8qKlxuICogRXZlbnQgZmlyZWQgd2hlbiB0aGUgY29udHJvbCdzIHRvdWNoZWQgc3RhdHVzIGNoYW5nZXMgKHRvdWNoZWQgPD0+IHVudG91Y2hlZCkuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVG91Y2hlZENoYW5nZUV2ZW50IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IHRvdWNoZWQ6IGJvb2xlYW4sXG4gICAgcHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG5cbi8qKlxuICogRXZlbnQgZmlyZWQgd2hlbiB0aGUgY29udHJvbCdzIHN0YXR1cyBjaGFuZ2VzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXR1c0NoYW5nZUV2ZW50IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IHN0YXR1czogRm9ybUNvbnRyb2xTdGF0dXMsXG4gICAgcHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG5cbi8qKlxuICogR2V0cyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrVmFsaWRhdG9ycyhcbiAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwsXG4pOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBudWxsIHtcbiAgcmV0dXJuIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/IHZhbGlkYXRvck9yT3B0cy52YWxpZGF0b3JzIDogdmFsaWRhdG9yT3JPcHRzKSB8fCBudWxsO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGJ5IGNvbWJpbmluZyBwcm92aWRlZCB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBjb2VyY2VUb1ZhbGlkYXRvcih2YWxpZGF0b3I6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGwpOiBWYWxpZGF0b3JGbiB8IG51bGwge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3IpID8gY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9yKSA6IHZhbGlkYXRvciB8fCBudWxsO1xufVxuXG4vKipcbiAqIEdldHMgYXN5bmMgdmFsaWRhdG9ycyBmcm9tIGVpdGhlciBhbiBvcHRpb25zIG9iamVjdCBvciBnaXZlbiB2YWxpZGF0b3JzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGlja0FzeW5jVmFsaWRhdG9ycyhcbiAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCxcbiAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwsXG4pOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCB7XG4gIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICBpZiAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgJiYgYXN5bmNWYWxpZGF0b3IpIHtcbiAgICAgIGNvbnNvbGUud2Fybihhc3luY1ZhbGlkYXRvcnNEcm9wcGVkV2l0aE9wdHNXYXJuaW5nKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/IHZhbGlkYXRvck9yT3B0cy5hc3luY1ZhbGlkYXRvcnMgOiBhc3luY1ZhbGlkYXRvcikgfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbiBieSBjb21iaW5pbmcgcHJvdmlkZWQgYXN5bmMgdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gY29lcmNlVG9Bc3luY1ZhbGlkYXRvcihcbiAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCxcbik6IEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXN5bmNWYWxpZGF0b3IpXG4gICAgPyBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yKVxuICAgIDogYXN5bmNWYWxpZGF0b3IgfHwgbnVsbDtcbn1cblxuZXhwb3J0IHR5cGUgRm9ybUhvb2tzID0gJ2NoYW5nZScgfCAnYmx1cicgfCAnc3VibWl0JztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIG9wdGlvbnMgcHJvdmlkZWQgdG8gYW4gYEFic3RyYWN0Q29udHJvbGAuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0Q29udHJvbE9wdGlvbnMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBsaXN0IG9mIHZhbGlkYXRvcnMgYXBwbGllZCB0byBhIGNvbnRyb2wuXG4gICAqL1xuICB2YWxpZGF0b3JzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbDtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgbGlzdCBvZiBhc3luYyB2YWxpZGF0b3JzIGFwcGxpZWQgdG8gY29udHJvbC5cbiAgICovXG4gIGFzeW5jVmFsaWRhdG9ycz86IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBldmVudCBuYW1lIGZvciBjb250cm9sIHRvIHVwZGF0ZSB1cG9uLlxuICAgKi9cbiAgdXBkYXRlT24/OiAnY2hhbmdlJyB8ICdibHVyJyB8ICdzdWJtaXQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPcHRpb25zT2JqKFxuICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbik6IHZhbGlkYXRvck9yT3B0cyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuIChcbiAgICB2YWxpZGF0b3JPck9wdHMgIT0gbnVsbCAmJlxuICAgICFBcnJheS5pc0FycmF5KHZhbGlkYXRvck9yT3B0cykgJiZcbiAgICB0eXBlb2YgdmFsaWRhdG9yT3JPcHRzID09PSAnb2JqZWN0J1xuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZXJ0Q29udHJvbFByZXNlbnQocGFyZW50OiBhbnksIGlzR3JvdXA6IGJvb2xlYW4sIGtleTogc3RyaW5nIHwgbnVtYmVyKTogdm9pZCB7XG4gIGNvbnN0IGNvbnRyb2xzID0gcGFyZW50LmNvbnRyb2xzIGFzIHtba2V5OiBzdHJpbmcgfCBudW1iZXJdOiB1bmtub3dufTtcbiAgY29uc3QgY29sbGVjdGlvbiA9IGlzR3JvdXAgPyBPYmplY3Qua2V5cyhjb250cm9scykgOiBjb250cm9scztcbiAgaWYgKCFjb2xsZWN0aW9uLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXG4gICAgICBSdW50aW1lRXJyb3JDb2RlLk5PX0NPTlRST0xTLFxuICAgICAgdHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlID8gbm9Db250cm9sc0Vycm9yKGlzR3JvdXApIDogJycsXG4gICAgKTtcbiAgfVxuICBpZiAoIWNvbnRyb2xzW2tleV0pIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgUnVudGltZUVycm9yQ29kZS5NSVNTSU5HX0NPTlRST0wsXG4gICAgICB0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUgPyBtaXNzaW5nQ29udHJvbEVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyxcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50KGNvbnRyb2w6IGFueSwgaXNHcm91cDogYm9vbGVhbiwgdmFsdWU6IGFueSk6IHZvaWQge1xuICBjb250cm9sLl9mb3JFYWNoQ2hpbGQoKF86IHVua25vd24sIGtleTogc3RyaW5nIHwgbnVtYmVyKSA9PiB7XG4gICAgaWYgKHZhbHVlW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcbiAgICAgICAgUnVudGltZUVycm9yQ29kZS5NSVNTSU5HX0NPTlRST0xfVkFMVUUsXG4gICAgICAgIHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSA/IG1pc3NpbmdDb250cm9sVmFsdWVFcnJvcihpc0dyb3VwLCBrZXkpIDogJycsXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIElzQW55IGNoZWNrcyBpZiBUIGlzIGBhbnlgLCBieSBjaGVja2luZyBhIGNvbmRpdGlvbiB0aGF0IGNvdWxkbid0IHBvc3NpYmx5IGJlIHRydWUgb3RoZXJ3aXNlLlxuZXhwb3J0IHR5cGUgybVJc0FueTxULCBZLCBOPiA9IDAgZXh0ZW5kcyAxICYgVCA/IFkgOiBOO1xuXG4vKipcbiAqIGBUeXBlZE9yVW50eXBlZGAgYWxsb3dzIG9uZSBvZiB0d28gZGlmZmVyZW50IHR5cGVzIHRvIGJlIHNlbGVjdGVkLCBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgRm9ybXNcbiAqIGNsYXNzIGl0J3MgYXBwbGllZCB0byBpcyB0eXBlZCBvciBub3QuXG4gKlxuICogVGhpcyBpcyBmb3IgaW50ZXJuYWwgQW5ndWxhciB1c2FnZSB0byBzdXBwb3J0IHR5cGVkIGZvcm1zOyBkbyBub3QgZGlyZWN0bHkgdXNlIGl0LlxuICovXG5leHBvcnQgdHlwZSDJtVR5cGVkT3JVbnR5cGVkPFQsIFR5cGVkLCBVbnR5cGVkPiA9IMm1SXNBbnk8VCwgVW50eXBlZCwgVHlwZWQ+O1xuXG4vKipcbiAqIFZhbHVlIGdpdmVzIHRoZSB2YWx1ZSB0eXBlIGNvcnJlc3BvbmRpbmcgdG8gYSBjb250cm9sIHR5cGUuXG4gKlxuICogTm90ZSB0aGF0IHRoZSByZXN1bHRpbmcgdHlwZSB3aWxsIGZvbGxvdyB0aGUgc2FtZSBydWxlcyBhcyBgLnZhbHVlYCBvbiB5b3VyIGNvbnRyb2wsIGdyb3VwLCBvclxuICogYXJyYXksIGluY2x1ZGluZyBgdW5kZWZpbmVkYCBmb3IgZWFjaCBncm91cCBlbGVtZW50IHdoaWNoIG1pZ2h0IGJlIGRpc2FibGVkLlxuICpcbiAqIElmIHlvdSBhcmUgdHJ5aW5nIHRvIGV4dHJhY3QgYSB2YWx1ZSB0eXBlIGZvciBhIGRhdGEgbW9kZWwsIHlvdSBwcm9iYWJseSB3YW50IHtAbGluayBSYXdWYWx1ZX0sXG4gKiB3aGljaCB3aWxsIG5vdCBoYXZlIGB1bmRlZmluZWRgIGluIGdyb3VwIGtleXMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgYEZvcm1Db250cm9sYCB2YWx1ZSB0eXBlXG4gKlxuICogWW91IGNhbiBleHRyYWN0IHRoZSB2YWx1ZSB0eXBlIG9mIGEgc2luZ2xlIGNvbnRyb2w6XG4gKlxuICogYGBgdHNcbiAqIHR5cGUgTmFtZUNvbnRyb2wgPSBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICogdHlwZSBOYW1lVmFsdWUgPSBWYWx1ZTxOYW1lQ29udHJvbD47XG4gKiBgYGBcbiAqXG4gKiBUaGUgcmVzdWx0aW5nIHR5cGUgaXMgYHN0cmluZ2AuXG4gKlxuICogIyMjIGBGb3JtR3JvdXBgIHZhbHVlIHR5cGVcbiAqXG4gKiBJbWFnaW5lIHlvdSBoYXZlIGFuIGludGVyZmFjZSBkZWZpbmluZyB0aGUgY29udHJvbHMgaW4geW91ciBncm91cC4gWW91IGNhbiBleHRyYWN0IHRoZSBzaGFwZSBvZlxuICogdGhlIHZhbHVlcyBhcyBmb2xsb3dzOlxuICpcbiAqIGBgYHRzXG4gKiBpbnRlcmZhY2UgUGFydHlGb3JtQ29udHJvbHMge1xuICogICBhZGRyZXNzOiBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICogfVxuICpcbiAqIC8vIFZhbHVlIG9wZXJhdGVzIG9uIGNvbnRyb2xzOyB0aGUgb2JqZWN0IG11c3QgYmUgd3JhcHBlZCBpbiBhIEZvcm1Hcm91cC5cbiAqIHR5cGUgUGFydHlGb3JtVmFsdWVzID0gVmFsdWU8Rm9ybUdyb3VwPFBhcnR5Rm9ybUNvbnRyb2xzPj47XG4gKiBgYGBcbiAqXG4gKiBUaGUgcmVzdWx0aW5nIHR5cGUgaXMgYHthZGRyZXNzOiBzdHJpbmd8dW5kZWZpbmVkfWAuXG4gKlxuICogIyMjIGBGb3JtQXJyYXlgIHZhbHVlIHR5cGVcbiAqXG4gKiBZb3UgY2FuIGV4dHJhY3QgdmFsdWVzIGZyb20gRm9ybUFycmF5cyBhcyB3ZWxsOlxuICpcbiAqIGBgYHRzXG4gKiB0eXBlIEd1ZXN0TmFtZXNDb250cm9scyA9IEZvcm1BcnJheTxGb3JtQ29udHJvbDxzdHJpbmc+PjtcbiAqXG4gKiB0eXBlIE5hbWVzVmFsdWVzID0gVmFsdWU8R3Vlc3ROYW1lc0NvbnRyb2xzPjtcbiAqIGBgYFxuICpcbiAqIFRoZSByZXN1bHRpbmcgdHlwZSBpcyBgc3RyaW5nW11gLlxuICpcbiAqICoqSW50ZXJuYWw6IG5vdCBmb3IgcHVibGljIHVzZS4qKlxuICovXG5leHBvcnQgdHlwZSDJtVZhbHVlPFQgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wgfCB1bmRlZmluZWQ+ID1cbiAgVCBleHRlbmRzIEFic3RyYWN0Q29udHJvbDxhbnksIGFueT4gPyBUWyd2YWx1ZSddIDogbmV2ZXI7XG5cbi8qKlxuICogUmF3VmFsdWUgZ2l2ZXMgdGhlIHJhdyB2YWx1ZSB0eXBlIGNvcnJlc3BvbmRpbmcgdG8gYSBjb250cm9sIHR5cGUuXG4gKlxuICogTm90ZSB0aGF0IHRoZSByZXN1bHRpbmcgdHlwZSB3aWxsIGZvbGxvdyB0aGUgc2FtZSBydWxlcyBhcyBgLmdldFJhd1ZhbHVlKClgIG9uIHlvdXIgY29udHJvbCxcbiAqIGdyb3VwLCBvciBhcnJheS4gVGhpcyBtZWFucyB0aGF0IGFsbCBjb250cm9scyBpbnNpZGUgYSBncm91cCB3aWxsIGJlIHJlcXVpcmVkLCBub3Qgb3B0aW9uYWwsXG4gKiByZWdhcmRsZXNzIG9mIHRoZWlyIGRpc2FibGVkIHN0YXRlLlxuICpcbiAqIFlvdSBtYXkgYWxzbyB3aXNoIHRvIHVzZSB7QGxpbmsgybVWYWx1ZX0sIHdoaWNoIHdpbGwgaGF2ZSBgdW5kZWZpbmVkYCBpbiBncm91cCBrZXlzICh3aGljaCBjYW4gYmVcbiAqIGRpc2FibGVkKS5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBgRm9ybUdyb3VwYCByYXcgdmFsdWUgdHlwZVxuICpcbiAqIEltYWdpbmUgeW91IGhhdmUgYW4gaW50ZXJmYWNlIGRlZmluaW5nIHRoZSBjb250cm9scyBpbiB5b3VyIGdyb3VwLiBZb3UgY2FuIGV4dHJhY3QgdGhlIHNoYXBlIG9mXG4gKiB0aGUgcmF3IHZhbHVlcyBhcyBmb2xsb3dzOlxuICpcbiAqIGBgYHRzXG4gKiBpbnRlcmZhY2UgUGFydHlGb3JtQ29udHJvbHMge1xuICogICBhZGRyZXNzOiBGb3JtQ29udHJvbDxzdHJpbmc+O1xuICogfVxuICpcbiAqIC8vIFJhd1ZhbHVlIG9wZXJhdGVzIG9uIGNvbnRyb2xzOyB0aGUgb2JqZWN0IG11c3QgYmUgd3JhcHBlZCBpbiBhIEZvcm1Hcm91cC5cbiAqIHR5cGUgUGFydHlGb3JtVmFsdWVzID0gUmF3VmFsdWU8Rm9ybUdyb3VwPFBhcnR5Rm9ybUNvbnRyb2xzPj47XG4gKiBgYGBcbiAqXG4gKiBUaGUgcmVzdWx0aW5nIHR5cGUgaXMgYHthZGRyZXNzOiBzdHJpbmd9YC4gKE5vdGUgdGhlIGFic2VuY2Ugb2YgYHVuZGVmaW5lZGAuKVxuICpcbiAqICAqKkludGVybmFsOiBub3QgZm9yIHB1YmxpYyB1c2UuKipcbiAqL1xuZXhwb3J0IHR5cGUgybVSYXdWYWx1ZTxUIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHwgdW5kZWZpbmVkPiA9XG4gIFQgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2w8YW55LCBhbnk+XG4gICAgPyBUWydzZXRWYWx1ZSddIGV4dGVuZHMgKHY6IGluZmVyIFIpID0+IHZvaWRcbiAgICAgID8gUlxuICAgICAgOiBuZXZlclxuICAgIDogbmV2ZXI7XG5cbi8vIERpc2FibGUgY2xhbmctZm9ybWF0IHRvIHByb2R1Y2UgY2xlYXJlciBmb3JtYXR0aW5nIGZvciB0aGVzZSBtdWx0aWxpbmUgdHlwZXMuXG4vLyBjbGFuZy1mb3JtYXQgb2ZmXG5cbi8qKlxuICogVG9rZW5pemUgc3BsaXRzIGEgc3RyaW5nIGxpdGVyYWwgUyBieSBhIGRlbGltaXRlciBELlxuICovXG5leHBvcnQgdHlwZSDJtVRva2VuaXplPFMgZXh0ZW5kcyBzdHJpbmcsIEQgZXh0ZW5kcyBzdHJpbmc+ID0gc3RyaW5nIGV4dGVuZHMgU1xuICA/IHN0cmluZ1tdIC8qIFMgbXVzdCBiZSBhIGxpdGVyYWwgKi9cbiAgOiBTIGV4dGVuZHMgYCR7aW5mZXIgVH0ke0R9JHtpbmZlciBVfWBcbiAgICA/IFtULCAuLi7JtVRva2VuaXplPFUsIEQ+XVxuICAgIDogW1NdIC8qIEJhc2UgY2FzZSAqLztcblxuLyoqXG4gKiBDb2VyY2VTdHJBcnJUb051bUFyciBhY2NlcHRzIGFuIGFycmF5IG9mIHN0cmluZ3MsIGFuZCBjb252ZXJ0cyBhbnkgbnVtZXJpYyBzdHJpbmcgdG8gYSBudW1iZXIuXG4gKi9cbmV4cG9ydCB0eXBlIMm1Q29lcmNlU3RyQXJyVG9OdW1BcnI8Uz4gPVxuICAvLyBFeHRyYWN0IHRoZSBoZWFkIG9mIHRoZSBhcnJheS5cbiAgUyBleHRlbmRzIFtpbmZlciBIZWFkLCAuLi5pbmZlciBUYWlsXVxuICAgID8gLy8gVXNpbmcgYSB0ZW1wbGF0ZSBsaXRlcmFsIHR5cGUsIGNvZXJjZSB0aGUgaGVhZCB0byBgbnVtYmVyYCBpZiBwb3NzaWJsZS5cbiAgICAgIC8vIFRoZW4sIHJlY3Vyc2Ugb24gdGhlIHRhaWwuXG4gICAgICBIZWFkIGV4dGVuZHMgYCR7bnVtYmVyfWBcbiAgICAgID8gW251bWJlciwgLi4uybVDb2VyY2VTdHJBcnJUb051bUFycjxUYWlsPl1cbiAgICAgIDogW0hlYWQsIC4uLsm1Q29lcmNlU3RyQXJyVG9OdW1BcnI8VGFpbD5dXG4gICAgOiBbXTtcblxuLyoqXG4gKiBOYXZpZ2F0ZSB0YWtlcyBhIHR5cGUgVCBhbmQgYW4gYXJyYXkgSywgYW5kIHJldHVybnMgdGhlIHR5cGUgb2YgVFtLWzBdXVtLWzFdXVtLWzJdXS4uLlxuICovXG5leHBvcnQgdHlwZSDJtU5hdmlnYXRlPFxuICBULFxuICBLIGV4dGVuZHMgQXJyYXk8c3RyaW5nIHwgbnVtYmVyPixcbj4gPSBUIGV4dGVuZHMgb2JqZWN0IC8qIFQgbXVzdCBiZSBpbmRleGFibGUgKG9iamVjdCBvciBhcnJheSkgKi9cbiAgPyBLIGV4dGVuZHMgW2luZmVyIEhlYWQsIC4uLmluZmVyIFRhaWxdIC8qIFNwbGl0IEsgaW50byBoZWFkIGFuZCB0YWlsICovXG4gICAgPyBIZWFkIGV4dGVuZHMga2V5b2YgVCAvKiBoZWFkKEspIG11c3QgaW5kZXggVCAqL1xuICAgICAgPyBUYWlsIGV4dGVuZHMgKHN0cmluZyB8IG51bWJlcilbXSAvKiB0YWlsKEspIG11c3QgYmUgYW4gYXJyYXkgKi9cbiAgICAgICAgPyBbXSBleHRlbmRzIFRhaWxcbiAgICAgICAgICA/IFRbSGVhZF0gLyogYmFzZSBjYXNlOiBLIGNhbiBiZSBzcGxpdCwgYnV0IFRhaWwgaXMgZW1wdHkgKi9cbiAgICAgICAgICA6IMm1TmF2aWdhdGU8VFtIZWFkXSwgVGFpbD4gLyogZXhwbG9yZSBUW2hlYWQoSyldIGJ5IHRhaWwoSykgKi9cbiAgICAgICAgOiBhbnkgLyogdGFpbChLKSB3YXMgbm90IGFuIGFycmF5LCBnaXZlIHVwICovXG4gICAgICA6IG5ldmVyIC8qIGhlYWQoSykgZG9lcyBub3QgaW5kZXggVCwgZ2l2ZSB1cCAqL1xuICAgIDogYW55IC8qIEsgY2Fubm90IGJlIHNwbGl0LCBnaXZlIHVwICovXG4gIDogYW55IC8qIFQgaXMgbm90IGluZGV4YWJsZSwgZ2l2ZSB1cCAqLztcblxuLyoqXG4gKiDJtVdyaXRlYWJsZSByZW1vdmVzIHJlYWRvbmx5IGZyb20gYWxsIGtleXMuXG4gKi9cbmV4cG9ydCB0eXBlIMm1V3JpdGVhYmxlPFQ+ID0ge1xuICAtcmVhZG9ubHkgW1AgaW4ga2V5b2YgVF06IFRbUF07XG59O1xuXG4vKipcbiAqIEdldFByb3BlcnR5IHRha2VzIGEgdHlwZSBUIGFuZCBzb21lIHByb3BlcnR5IG5hbWVzIG9yIGluZGljZXMgSy5cbiAqIElmIEsgaXMgYSBkb3Qtc2VwYXJhdGVkIHN0cmluZywgaXQgaXMgdG9rZW5pemVkIGludG8gYW4gYXJyYXkgYmVmb3JlIHByb2NlZWRpbmcuXG4gKiBUaGVuLCB0aGUgdHlwZSBvZiB0aGUgbmVzdGVkIHByb3BlcnR5IGF0IEsgaXMgY29tcHV0ZWQ6IFRbS1swXV1bS1sxXV1bS1syXV0uLi5cbiAqIFRoaXMgd29ya3Mgd2l0aCBib3RoIG9iamVjdHMsIHdoaWNoIGFyZSBpbmRleGVkIGJ5IHByb3BlcnR5IG5hbWUsIGFuZCBhcnJheXMsIHdoaWNoIGFyZSBpbmRleGVkXG4gKiBudW1lcmljYWxseS5cbiAqXG4gKiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gKi9cbmV4cG9ydCB0eXBlIMm1R2V0UHJvcGVydHk8VCwgSz4gPVxuICAvLyBLIGlzIGEgc3RyaW5nXG4gIEsgZXh0ZW5kcyBzdHJpbmdcbiAgICA/IMm1R2V0UHJvcGVydHk8VCwgybVDb2VyY2VTdHJBcnJUb051bUFycjzJtVRva2VuaXplPEssICcuJz4+PlxuICAgIDogLy8gSXMgaXQgYW4gYXJyYXlcbiAgICAgIMm1V3JpdGVhYmxlPEs+IGV4dGVuZHMgQXJyYXk8c3RyaW5nIHwgbnVtYmVyPlxuICAgICAgPyDJtU5hdmlnYXRlPFQsIMm1V3JpdGVhYmxlPEs+PlxuICAgICAgOiAvLyBGYWxsIHRocm91Z2ggcGVybWlzc2l2ZWx5IGlmIHdlIGNhbid0IGNhbGN1bGF0ZSB0aGUgdHlwZSBvZiBLLlxuICAgICAgICBhbnk7XG5cbi8vIGNsYW5nLWZvcm1hdCBvblxuXG4vKipcbiAqIFRoaXMgaXMgdGhlIGJhc2UgY2xhc3MgZm9yIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBhbmQgYEZvcm1BcnJheWAuXG4gKlxuICogSXQgcHJvdmlkZXMgc29tZSBvZiB0aGUgc2hhcmVkIGJlaGF2aW9yIHRoYXQgYWxsIGNvbnRyb2xzIGFuZCBncm91cHMgb2YgY29udHJvbHMgaGF2ZSwgbGlrZVxuICogcnVubmluZyB2YWxpZGF0b3JzLCBjYWxjdWxhdGluZyBzdGF0dXMsIGFuZCByZXNldHRpbmcgc3RhdGUuIEl0IGFsc28gZGVmaW5lcyB0aGUgcHJvcGVydGllc1xuICogdGhhdCBhcmUgc2hhcmVkIGJldHdlZW4gYWxsIHN1Yi1jbGFzc2VzLCBsaWtlIGB2YWx1ZWAsIGB2YWxpZGAsIGFuZCBgZGlydHlgLiBJdCBzaG91bGRuJ3QgYmVcbiAqIGluc3RhbnRpYXRlZCBkaXJlY3RseS5cbiAqXG4gKiBUaGUgZmlyc3QgdHlwZSBwYXJhbWV0ZXIgVFZhbHVlIHJlcHJlc2VudHMgdGhlIHZhbHVlIHR5cGUgb2YgdGhlIGNvbnRyb2wgKGBjb250cm9sLnZhbHVlYCkuXG4gKiBUaGUgb3B0aW9uYWwgdHlwZSBwYXJhbWV0ZXIgVFJhd1ZhbHVlICByZXByZXNlbnRzIHRoZSByYXcgdmFsdWUgdHlwZSAoYGNvbnRyb2wuZ2V0UmF3VmFsdWUoKWApLlxuICpcbiAqIEBzZWUgW0Zvcm1zIEd1aWRlXShndWlkZS9mb3JtcylcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9mb3Jtcy9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgW0R5bmFtaWMgRm9ybXMgR3VpZGVdKGd1aWRlL2Zvcm1zL2R5bmFtaWMtZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RDb250cm9sPFRWYWx1ZSA9IGFueSwgVFJhd1ZhbHVlIGV4dGVuZHMgVFZhbHVlID0gVFZhbHVlPiB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBhIGNvbnRyb2wgaGFzIGl0cyBvd24gcGVuZGluZyBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiBpbiBwcm9ncmVzcy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfaGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVPbj86IEZvcm1Ib29rcztcblxuICBwcml2YXRlIF9wYXJlbnQ6IEZvcm1Hcm91cCB8IEZvcm1BcnJheSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogQ29udGFpbnMgdGhlIHJlc3VsdCBvZiBtZXJnaW5nIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICogKGNvbWJpbmVkIHVzaW5nIGBWYWxpZGF0b3JzLmNvbXBvc2VgKS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9jb21wb3NlZFZhbGlkYXRvckZuITogVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICogKGNvbWJpbmVkIHVzaW5nIGBWYWxpZGF0b3JzLmNvbXBvc2VBc3luY2ApLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiE6IEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBTeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0VmFsaWRhdG9yc2AgZnVuY3Rpb25cbiAgICogIC0gd2hpbGUgY2FsbGluZyB0aGUgc2V0dGVyIG9uIHRoZSBgdmFsaWRhdG9yYCBmaWVsZCAoZS5nLiBgY29udHJvbC52YWxpZGF0b3IgPSB2YWxpZGF0b3JGbmApXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3VmFsaWRhdG9ycyE6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0QXN5bmNWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGBhc3luY1ZhbGlkYXRvcmAgZmllbGQgKGUuZy4gYGNvbnRyb2wuYXN5bmNWYWxpZGF0b3IgPVxuICAgKiBhc3luY1ZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdBc3luY1ZhbGlkYXRvcnMhOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbDtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqICogRm9yIGEgYEZvcm1Db250cm9sYCwgdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAqICogRm9yIGFuIGVuYWJsZWQgYEZvcm1Hcm91cGAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBvYmplY3RcbiAgICogd2l0aCBhIGtleS12YWx1ZSBwYWlyIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgZ3JvdXAuXG4gICAqICogRm9yIGEgZGlzYWJsZWQgYEZvcm1Hcm91cGAsIHRoZSB2YWx1ZXMgb2YgYWxsIGNvbnRyb2xzIGFzIGFuIG9iamVjdFxuICAgKiB3aXRoIGEga2V5LXZhbHVlIHBhaXIgZm9yIGVhY2ggbWVtYmVyIG9mIHRoZSBncm91cC5cbiAgICogKiBGb3IgYSBgRm9ybUFycmF5YCwgdGhlIHZhbHVlcyBvZiBlbmFibGVkIGNvbnRyb2xzIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlITogVFZhbHVlO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBYnN0cmFjdENvbnRyb2wgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2ZcbiAgICogICAgIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB2YWxpZGl0eSBvZlxuICAgKiAgICAgdGhpcyBjb250cm9sIGFzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgdmFsaWRhdG9yczogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbCxcbiAgICBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsLFxuICApIHtcbiAgICB0aGlzLl9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX2Fzc2lnbkFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgKiBJZiBtdWx0aXBsZSB2YWxpZGF0b3JzIGhhdmUgYmVlbiBhZGRlZCwgdGhpcyB3aWxsIGJlIGEgc2luZ2xlIGNvbXBvc2VkIGZ1bmN0aW9uLlxuICAgKiBTZWUgYFZhbGlkYXRvcnMuY29tcG9zZSgpYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGdldCB2YWxpZGF0b3IoKTogVmFsaWRhdG9yRm4gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbjtcbiAgfVxuICBzZXQgdmFsaWRhdG9yKHZhbGlkYXRvckZuOiBWYWxpZGF0b3JGbiB8IG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IHZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbCBhc3luY2hyb25vdXNseS5cbiAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbiB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm47XG4gIH1cbiAgc2V0IGFzeW5jVmFsaWRhdG9yKGFzeW5jVmFsaWRhdG9yRm46IEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsKSB7XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuID0gYXN5bmNWYWxpZGF0b3JGbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IGNvbnRyb2wuXG4gICAqL1xuICBnZXQgcGFyZW50KCk6IEZvcm1Hcm91cCB8IEZvcm1BcnJheSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBGb3JtQ29udHJvbFN0YXR1c31cbiAgICpcbiAgICogVGhlc2Ugc3RhdHVzIHZhbHVlcyBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLCBzbyBhIGNvbnRyb2wgY2Fubm90IGJlXG4gICAqIGJvdGggdmFsaWQgQU5EIGludmFsaWQgb3IgaW52YWxpZCBBTkQgZGlzYWJsZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzITogRm9ybUNvbnRyb2xTdGF0dXM7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgdmFsaWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBWQUxJRGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIHBhc3NlZCBhbGwgb2YgaXRzIHZhbGlkYXRpb24gdGVzdHMsXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCB2YWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IFZBTElEO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgaW52YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYElOVkFMSURgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgY29udHJvbCBoYXMgZmFpbGVkIG9uZSBvciBtb3JlIG9mIGl0cyB2YWxpZGF0aW9uIGNoZWNrcyxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGludmFsaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBJTlZBTElEO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgcGVuZGluZ2Agd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFBFTkRJTkdgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgY29udHJvbCBpcyBpbiB0aGUgcHJvY2VzcyBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjayxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IHBlbmRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09IFBFTkRJTkc7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXNhYmxlZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYERJU0FCTEVEYC5cbiAgICpcbiAgICogRGlzYWJsZWQgY29udHJvbHMgYXJlIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiBhcmUgbm90IGluY2x1ZGVkIGluIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgdGhlaXIgYW5jZXN0b3JcbiAgICogY29udHJvbHMuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IERJU0FCTEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZW5hYmxlZGAgYXMgbG9uZyBhcyBpdHMgYHN0YXR1c2AgaXMgbm90IGBESVNBQkxFRGAuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIGFueSBzdGF0dXMgb3RoZXIgdGhhbiAnRElTQUJMRUQnLFxuICAgKiBmYWxzZSBpZiB0aGUgc3RhdHVzIGlzICdESVNBQkxFRCcuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqL1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgIT09IERJU0FCTEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGFueSBlcnJvcnMgZ2VuZXJhdGVkIGJ5IGZhaWxpbmcgdmFsaWRhdGlvbixcbiAgICogb3IgbnVsbCBpZiB0aGVyZSBhcmUgbm8gZXJyb3JzLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGVycm9ycyE6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHByaXN0aW5lYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkXG4gICAqIHRoZSB2YWx1ZSBpbiB0aGUgVUkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZCB0aGUgdmFsdWUgaW4gdGhlIFVJOyBjb21wYXJlIGBkaXJ0eWAuXG4gICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByaXN0aW5lOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXJ0eWAgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlXG4gICAqIGluIHRoZSBVSS5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgdmFsdWUgb2YgdGhpcyBjb250cm9sIGluIHRoZSBVSTsgY29tcGFyZSBgcHJpc3RpbmVgLlxuICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIGdldCBkaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMucHJpc3RpbmU7XG4gIH1cblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBtYXJrZWQgYXMgYHRvdWNoZWRgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgbWFya2VkIGB0b3VjaGVkYCBvbmNlIHRoZSB1c2VyIGhhcyB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdG91Y2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBub3QgYmVlbiBtYXJrZWQgYXMgdG91Y2hlZFxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgYHVudG91Y2hlZGAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgZ2V0IHVudG91Y2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMudG91Y2hlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2VkIGFzIG9ic2VydmFibGUsIHNlZSBiZWxvdy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9ldmVudHMgPSBuZXcgU3ViamVjdDxDb250cm9sRXZlbnQ8VFZhbHVlPj4oKTtcblxuICAvKipcbiAgICogQSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGV2ZW50IGV2ZXJ5IHRpbWUgdGhlIHN0YXRlIG9mIHRoZSBjb250cm9sIGNoYW5nZXMuXG4gICAqIEl0IGVtaXRzIGZvciB2YWx1ZSwgc3RhdHVzLCBwcmlzdGluZSBvciB0b3VjaGVkIGNoYW5nZXMuXG4gICAqXG4gICAqICoqTm90ZSoqOiBPbiB2YWx1ZSBjaGFuZ2UsIHRoZSBlbWl0IGhhcHBlbnMgcmlnaHQgYWZ0ZXIgYSB2YWx1ZSBvZiB0aGlzIGNvbnRyb2wgaXMgdXBkYXRlZC4gVGhlXG4gICAqIHZhbHVlIG9mIGEgcGFyZW50IGNvbnRyb2wgKGZvciBleGFtcGxlIGlmIHRoaXMgRm9ybUNvbnRyb2wgaXMgYSBwYXJ0IG9mIGEgRm9ybUdyb3VwKSBpcyB1cGRhdGVkXG4gICAqIGxhdGVyLCBzbyBhY2Nlc3NpbmcgYSB2YWx1ZSBvZiBhIHBhcmVudCBjb250cm9sICh1c2luZyB0aGUgYHZhbHVlYCBwcm9wZXJ0eSkgZnJvbSB0aGUgY2FsbGJhY2tcbiAgICogb2YgdGhpcyBldmVudCBtaWdodCByZXN1bHQgaW4gZ2V0dGluZyBhIHZhbHVlIHRoYXQgaGFzIG5vdCBiZWVuIHVwZGF0ZWQgeWV0LiBTdWJzY3JpYmUgdG8gdGhlXG4gICAqIGBldmVudHNgIG9mIHRoZSBwYXJlbnQgY29udHJvbCBpbnN0ZWFkLlxuICAgKiBGb3Igb3RoZXIgZXZlbnQgdHlwZXMsIHRoZSBldmVudHMgYXJlIGVtaXR0ZWQgYWZ0ZXIgdGhlIHBhcmVudCBjb250cm9sIGhhcyBiZWVuIHVwZGF0ZWQuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZXZlbnRzID0gdGhpcy5fZXZlbnRzLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIC8qKlxuICAgKiBBIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgY2hhbmdlcywgaW5cbiAgICogdGhlIFVJIG9yIHByb2dyYW1tYXRpY2FsbHkuIEl0IGFsc28gZW1pdHMgYW4gZXZlbnQgZWFjaCB0aW1lIHlvdSBjYWxsIGVuYWJsZSgpIG9yIGRpc2FibGUoKVxuICAgKiB3aXRob3V0IHBhc3NpbmcgYWxvbmcge2VtaXRFdmVudDogZmFsc2V9IGFzIGEgZnVuY3Rpb24gYXJndW1lbnQuXG4gICAqXG4gICAqICoqTm90ZSoqOiB0aGUgZW1pdCBoYXBwZW5zIHJpZ2h0IGFmdGVyIGEgdmFsdWUgb2YgdGhpcyBjb250cm9sIGlzIHVwZGF0ZWQuIFRoZSB2YWx1ZSBvZiBhXG4gICAqIHBhcmVudCBjb250cm9sIChmb3IgZXhhbXBsZSBpZiB0aGlzIEZvcm1Db250cm9sIGlzIGEgcGFydCBvZiBhIEZvcm1Hcm91cCkgaXMgdXBkYXRlZCBsYXRlciwgc29cbiAgICogYWNjZXNzaW5nIGEgdmFsdWUgb2YgYSBwYXJlbnQgY29udHJvbCAodXNpbmcgdGhlIGB2YWx1ZWAgcHJvcGVydHkpIGZyb20gdGhlIGNhbGxiYWNrIG9mIHRoaXNcbiAgICogZXZlbnQgbWlnaHQgcmVzdWx0IGluIGdldHRpbmcgYSB2YWx1ZSB0aGF0IGhhcyBub3QgYmVlbiB1cGRhdGVkIHlldC4gU3Vic2NyaWJlIHRvIHRoZVxuICAgKiBgdmFsdWVDaGFuZ2VzYCBldmVudCBvZiB0aGUgcGFyZW50IGNvbnRyb2wgaW5zdGVhZC5cbiAgICpcbiAgICogVE9ETzogdGhpcyBzaG91bGQgYmUgcGlwZWQgZnJvbSBldmVudHMoKSBidXQgaXMgYnJlYWtpbmcgaW4gRzNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXMhOiBPYnNlcnZhYmxlPFRWYWx1ZT47XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWxpZGF0aW9uIGBzdGF0dXNgIG9mIHRoZSBjb250cm9sXG4gICAqIHJlY2FsY3VsYXRlcy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgRm9ybUNvbnRyb2xTdGF0dXN9XG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIFRPRE86IHRoaXMgc2hvdWxkIGJlIHBpcGVkIGZyb20gZXZlbnRzKCkgYnV0IGlzIGJyZWFraW5nIGluIEczXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzQ2hhbmdlcyE6IE9ic2VydmFibGU8Rm9ybUNvbnRyb2xTdGF0dXM+O1xuXG4gIC8qKlxuICAgKiBSZXBvcnRzIHRoZSB1cGRhdGUgc3RyYXRlZ3kgb2YgdGhlIGBBYnN0cmFjdENvbnRyb2xgIChtZWFuaW5nXG4gICAqIHRoZSBldmVudCBvbiB3aGljaCB0aGUgY29udHJvbCB1cGRhdGVzIGl0c2VsZikuXG4gICAqIFBvc3NpYmxlIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYFxuICAgKiBEZWZhdWx0IHZhbHVlOiBgJ2NoYW5nZSdgXG4gICAqL1xuICBnZXQgdXBkYXRlT24oKTogRm9ybUhvb2tzIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlT24gPyB0aGlzLl91cGRhdGVPbiA6IHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudXBkYXRlT24gOiAnY2hhbmdlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuICBDYWxsaW5nXG4gICAqIHRoaXMgb3ZlcndyaXRlcyBhbnkgZXhpc3Rpbmcgc3luY2hyb25vdXMgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBhZGQgYSBuZXcgdmFsaWRhdG9yIHdpdGhvdXQgYWZmZWN0aW5nIGV4aXN0aW5nIG9uZXMsIGNvbnNpZGVyXG4gICAqIHVzaW5nIGBhZGRWYWxpZGF0b3JzKClgIG1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cbiAgc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBudWxsKTogdm9pZCB7XG4gICAgdGhpcy5fYXNzaWduVmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiBDYWxsaW5nIHRoaXNcbiAgICogb3ZlcndyaXRlcyBhbnkgZXhpc3RpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gYWRkIGEgbmV3IHZhbGlkYXRvciB3aXRob3V0IGFmZmVjdGluZyBleGlzdGluZyBvbmVzLCBjb25zaWRlclxuICAgKiB1c2luZyBgYWRkQXN5bmNWYWxpZGF0b3JzKClgIG1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cbiAgc2V0QXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsKTogdm9pZCB7XG4gICAgdGhpcy5fYXNzaWduQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBBZGRpbmcgYSB2YWxpZGF0b3IgdGhhdCBhbHJlYWR5IGV4aXN0cyB3aWxsIGhhdmUgbm8gZWZmZWN0LiBJZiBkdXBsaWNhdGUgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiBhcmUgcHJlc2VudCBpbiB0aGUgYHZhbGlkYXRvcnNgIGFycmF5LCBvbmx5IHRoZSBmaXJzdCBpbnN0YW5jZSB3b3VsZCBiZSBhZGRlZCB0byBhIGZvcm1cbiAgICogY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIG5ldyB2YWxpZGF0b3IgZnVuY3Rpb24gb3IgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXJcbiAgICogdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBBZGRpbmcgYSB2YWxpZGF0b3IgdGhhdCBhbHJlYWR5IGV4aXN0cyB3aWxsIGhhdmUgbm8gZWZmZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gb3IgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBhZGRBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0QXN5bmNWYWxpZGF0b3JzKGFkZFZhbGlkYXRvcnModmFsaWRhdG9ycywgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZyb20gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlciB2YWxpZGF0b3JzLlxuICAgKiBWYWxpZGF0b3JzIGFyZSBjb21wYXJlZCBieSBmdW5jdGlvbiByZWZlcmVuY2U7IHlvdSBtdXN0IHBhc3MgYSByZWZlcmVuY2UgdG8gdGhlIGV4YWN0IHNhbWVcbiAgICogdmFsaWRhdG9yIGZ1bmN0aW9uIGFzIHRoZSBvbmUgdGhhdCB3YXMgb3JpZ2luYWxseSBzZXQuIElmIGEgcHJvdmlkZWQgdmFsaWRhdG9yIGlzIG5vdCBmb3VuZCxcbiAgICogaXQgaXMgaWdub3JlZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFJlZmVyZW5jZSB0byBhIFZhbGlkYXRvckZuXG4gICAqXG4gICAqIGBgYFxuICAgKiAvLyBSZWZlcmVuY2UgdG8gdGhlIFJlcXVpcmVkVmFsaWRhdG9yXG4gICAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2w8c3RyaW5nIHwgbnVsbD4oJycsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgKiBjdHJsLnJlbW92ZVZhbGlkYXRvcnMoVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gICAqXG4gICAqIC8vIFJlZmVyZW5jZSB0byBhbm9ueW1vdXMgZnVuY3Rpb24gaW5zaWRlIE1pblZhbGlkYXRvclxuICAgKiBjb25zdCBtaW5WYWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1pbigzKTtcbiAgICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbDxzdHJpbmcgfCBudWxsPignJywgbWluVmFsaWRhdG9yKTtcbiAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKG1pblZhbGlkYXRvcikpLnRvRXF1YWwodHJ1ZSlcbiAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMubWluKDMpKSkudG9FcXVhbChmYWxzZSlcbiAgICpcbiAgICogY3RybC5yZW1vdmVWYWxpZGF0b3JzKG1pblZhbGlkYXRvcik7XG4gICAqIGBgYFxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmcm9tIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsIGl0XG4gICAqIGlzIGlnbm9yZWQuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0QXN5bmNWYWxpZGF0b3JzKHJlbW92ZVZhbGlkYXRvcnModmFsaWRhdG9ycywgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBpcyBwcmVzZW50IG9uIHRoaXMgY29udHJvbC4gVGhlIHByb3ZpZGVkXG4gICAqIHZhbGlkYXRvciBtdXN0IGJlIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lIGZ1bmN0aW9uIHRoYXQgd2FzIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgUmVmZXJlbmNlIHRvIGEgVmFsaWRhdG9yRm5cbiAgICpcbiAgICogYGBgXG4gICAqIC8vIFJlZmVyZW5jZSB0byB0aGUgUmVxdWlyZWRWYWxpZGF0b3JcbiAgICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbDxudW1iZXIgfCBudWxsPigwLCBWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMucmVxdWlyZWQpKS50b0VxdWFsKHRydWUpXG4gICAqXG4gICAqIC8vIFJlZmVyZW5jZSB0byBhbm9ueW1vdXMgZnVuY3Rpb24gaW5zaWRlIE1pblZhbGlkYXRvclxuICAgKiBjb25zdCBtaW5WYWxpZGF0b3IgPSBWYWxpZGF0b3JzLm1pbigzKTtcbiAgICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbDxudW1iZXIgfCBudWxsPigwLCBtaW5WYWxpZGF0b3IpO1xuICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IobWluVmFsaWRhdG9yKSkudG9FcXVhbCh0cnVlKVxuICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5taW4oMykpKS50b0VxdWFsKGZhbHNlKVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvciBUaGUgdmFsaWRhdG9yIHRvIGNoZWNrIGZvciBwcmVzZW5jZS4gQ29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBwcm92aWRlZCB2YWxpZGF0b3Igd2FzIGZvdW5kIG9uIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGhhc1ZhbGlkYXRvcih2YWxpZGF0b3I6IFZhbGlkYXRvckZuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc1ZhbGlkYXRvcih0aGlzLl9yYXdWYWxpZGF0b3JzLCB2YWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBpcyBwcmVzZW50IG9uIHRoaXMgY29udHJvbC4gVGhlIHByb3ZpZGVkXG4gICAqIHZhbGlkYXRvciBtdXN0IGJlIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lIGZ1bmN0aW9uIHRoYXQgd2FzIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9yIHRvIGNoZWNrIGZvciBwcmVzZW5jZS4gQ29tcGFyZWQgYnkgZnVuY3Rpb25cbiAgICogICAgIHJlZmVyZW5jZS5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgcHJvdmlkZWQgYXN5bmNocm9ub3VzIHZhbGlkYXRvciB3YXMgZm91bmQgb24gdGhpcyBjb250cm9sLlxuICAgKi9cbiAgaGFzQXN5bmNWYWxpZGF0b3IodmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc1ZhbGlkYXRvcih0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMsIHZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogRW1wdGllcyBvdXQgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvciBsaXN0LlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBjbGVhclZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBhc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKi9cbiAgY2xlYXJBc3luY1ZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy5hc3luY1ZhbGlkYXRvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHRvdWNoZWRgLiBBIGNvbnRyb2wgaXMgdG91Y2hlZCBieSBmb2N1cyBhbmRcbiAgICogYmx1ciBldmVudHMgdGhhdCBkbyBub3QgY2hhbmdlIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbWFya0FzVW50b3VjaGVkKCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc0RpcnR5KCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1ByaXN0aW5lKCl9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGEgYFRvdWNoZWRDaGFuZ2VFdmVudGAgd2l0aCB0aGUgYHRvdWNoZWRgIHByb3BlcnR5IGJlaW5nIGB0cnVlYC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgbWFya0FzVG91Y2hlZChvcHRzPzoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICAvKipcbiAgICogQGludGVybmFsIFVzZWQgdG8gcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHNcbiAgICovXG4gIG1hcmtBc1RvdWNoZWQob3B0cz86IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgICBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sO1xuICB9KTogdm9pZDtcbiAgbWFya0FzVG91Y2hlZChcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkID0gdGhpcy50b3VjaGVkID09PSBmYWxzZTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikudG91Y2hlZCA9IHRydWU7XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc1RvdWNoZWQoey4uLm9wdHMsIHNvdXJjZUNvbnRyb2x9KTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlZCAmJiBvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBUb3VjaGVkQ2hhbmdlRXZlbnQodHJ1ZSwgc291cmNlQ29udHJvbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhbmQgYWxsIGl0cyBkZXNjZW5kYW50IGNvbnRyb2xzIGFzIGB0b3VjaGVkYC5cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzVG91Y2hlZCgpfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhIGBUb3VjaGVkQ2hhbmdlRXZlbnRgIHdpdGggdGhlIGB0b3VjaGVkYCBwcm9wZXJ0eSBiZWluZyBgdHJ1ZWAuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIG1hcmtBbGxBc1RvdWNoZWQob3B0czoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLm1hcmtBc1RvdWNoZWQoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50LCBzb3VyY2VDb250cm9sOiB0aGlzfSk7XG5cbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5tYXJrQWxsQXNUb3VjaGVkKG9wdHMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdW50b3VjaGVkYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGFueSBjaGlsZHJlbiwgYWxzbyBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHVudG91Y2hlZGBcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHRvdWNoZWRgIHN0YXR1cyBvZiBhbGwgcGFyZW50IGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc0RpcnR5KCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1ByaXN0aW5lKCl9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhIGBUb3VjaGVkQ2hhbmdlRXZlbnRgIHdpdGggdGhlIGB0b3VjaGVkYCBwcm9wZXJ0eSBiZWluZyBgZmFsc2VgLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBtYXJrQXNVbnRvdWNoZWQob3B0cz86IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqXG4gICAqXG4gICAqIEBpbnRlcm5hbCBVc2VkIHRvIHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzXG4gICAqL1xuICBtYXJrQXNVbnRvdWNoZWQob3B0czoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbjtcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgIHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2w7XG4gIH0pOiB2b2lkO1xuICBtYXJrQXNVbnRvdWNoZWQoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0gPSB7fSxcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZCA9IHRoaXMudG91Y2hlZCA9PT0gdHJ1ZTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikudG91Y2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BlbmRpbmdUb3VjaGVkID0gZmFsc2U7XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wubWFya0FzVW50b3VjaGVkKHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudCwgc291cmNlQ29udHJvbH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMsIHNvdXJjZUNvbnRyb2wpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VkICYmIG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFRvdWNoZWRDaGFuZ2VFdmVudChmYWxzZSwgc291cmNlQ29udHJvbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgZGlydHlgLiBBIGNvbnRyb2wgYmVjb21lcyBkaXJ0eSB3aGVuXG4gICAqIHRoZSBjb250cm9sJ3MgdmFsdWUgaXMgY2hhbmdlZCB0aHJvdWdoIHRoZSBVSTsgY29tcGFyZSBgbWFya0FzVG91Y2hlZGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1RvdWNoZWQoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzVW50b3VjaGVkKCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1ByaXN0aW5lKCl9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGEgYFByaXN0aW5lQ2hhbmdlRXZlbnRgIHdpdGggdGhlIGBwcmlzdGluZWAgcHJvcGVydHkgYmVpbmcgYGZhbHNlYC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgbWFya0FzRGlydHkob3B0cz86IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbCBVc2VkIHRvIHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzXG4gICAqL1xuICBtYXJrQXNEaXJ0eShvcHRzOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuO1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gICAgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbDtcbiAgfSk6IHZvaWQ7XG4gIG1hcmtBc0RpcnR5KFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9ID0ge30sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWQgPSB0aGlzLnByaXN0aW5lID09PSB0cnVlO1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5wcmlzdGluZSA9IGZhbHNlO1xuXG4gICAgY29uc3Qgc291cmNlQ29udHJvbCA9IG9wdHMuc291cmNlQ29udHJvbCA/PyB0aGlzO1xuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNEaXJ0eSh7Li4ub3B0cywgc291cmNlQ29udHJvbH0pO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VkICYmIG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFByaXN0aW5lQ2hhbmdlRXZlbnQoZmFsc2UsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHByaXN0aW5lYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGFueSBjaGlsZHJlbiwgbWFya3MgYWxsIGNoaWxkcmVuIGFzIGBwcmlzdGluZWAsXG4gICAqIGFuZCByZWNhbGN1bGF0ZXMgdGhlIGBwcmlzdGluZWAgc3RhdHVzIG9mIGFsbCBwYXJlbnRcbiAgICogY29udHJvbHMuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1RvdWNoZWQoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzVW50b3VjaGVkKCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc0RpcnR5KCl9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgZW1pdHMgZXZlbnRzIGFmdGVyXG4gICAqIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhIGBQcmlzdGluZUNoYW5nZUV2ZW50YCB3aXRoIHRoZSBgcHJpc3RpbmVgIHByb3BlcnR5IGJlaW5nIGB0cnVlYC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgbWFya0FzUHJpc3RpbmUob3B0cz86IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbCBVc2VkIHRvIHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzXG4gICAqL1xuICBtYXJrQXNQcmlzdGluZShvcHRzOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuO1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gICAgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbDtcbiAgfSk6IHZvaWQ7XG4gIG1hcmtBc1ByaXN0aW5lKFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9ID0ge30sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWQgPSB0aGlzLnByaXN0aW5lID09PSBmYWxzZTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikucHJpc3RpbmUgPSB0cnVlO1xuICAgIHRoaXMuX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuXG4gICAgY29uc3Qgc291cmNlQ29udHJvbCA9IG9wdHMuc291cmNlQ29udHJvbCA/PyB0aGlzO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICAvKiogV2UgZG9uJ3QgcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHMgKi9cbiAgICAgIGNvbnRyb2wubWFya0FzUHJpc3RpbmUoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKG9wdHMsIHNvdXJjZUNvbnRyb2wpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VkICYmIG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFByaXN0aW5lQ2hhbmdlRXZlbnQodHJ1ZSwgc291cmNlQ29udHJvbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcGVuZGluZ2AuXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBwZW5kaW5nIHdoaWxlIHRoZSBjb250cm9sIHBlcmZvcm1zIGFzeW5jIHZhbGlkYXRpb24uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIHRoZSBjb250cm9sIGlzIG1hcmtlZCBwZW5kaW5nXG4gICAqIGFuZCB0aGUgYGV2ZW50c2Agb2JzZXJ2YWJsZSBlbWl0cyBhIGBTdGF0dXNDaGFuZ2VFdmVudGAgd2l0aCB0aGUgYHN0YXR1c2AgcHJvcGVydHkgYmVpbmdcbiAgICogYFBFTkRJTkdgIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICpcbiAgICovXG4gIG1hcmtBc1BlbmRpbmcob3B0cz86IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbCBVc2VkIHRvIHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzXG4gICAqL1xuICBtYXJrQXNQZW5kaW5nKG9wdHM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgICBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sO1xuICB9KTogdm9pZDtcbiAgbWFya0FzUGVuZGluZyhcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gUEVORElORztcblxuICAgIGNvbnN0IHNvdXJjZUNvbnRyb2wgPSBvcHRzLnNvdXJjZUNvbnRyb2wgPz8gdGhpcztcbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgU3RhdHVzQ2hhbmdlRXZlbnQodGhpcy5zdGF0dXMsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPEZvcm1Db250cm9sU3RhdHVzPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc1BlbmRpbmcoey4uLm9wdHMsIHNvdXJjZUNvbnRyb2x9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGV4Y2x1ZGVkIGZyb20gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBhbnkgcGFyZW50LiBJdHMgc3RhdHVzIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBhbHNvIGRpc2FibGVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXNcbiAgICogY2hhbmdlcyBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2AsXG4gICAqIGB2YWx1ZUNoYW5nZXNgIGFuZCBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBkaXNhYmxlKG9wdHM/OiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgVXNlZCB0byBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkc1xuICAgKi9cbiAgZGlzYWJsZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSk6IHZvaWQ7XG4gIGRpc2FibGUoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0gPSB7fSxcbiAgKTogdm9pZCB7XG4gICAgLy8gSWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkgd2UgZG9uJ3Qgd2FudCB0byByZS1jYWxjdWxhdGUgdGhlXG4gICAgLy8gcGFyZW50J3MgZGlydGluZXNzIGJhc2VkIG9uIHRoZSBjaGlsZHJlbi5cbiAgICBjb25zdCBza2lwUHJpc3RpbmVDaGVjayA9IHRoaXMuX3BhcmVudE1hcmtlZERpcnR5KG9wdHMub25seVNlbGYpO1xuXG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnN0YXR1cyA9IERJU0FCTEVEO1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5lcnJvcnMgPSBudWxsO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICAvKiogV2UgZG9uJ3QgcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHMgKi9cbiAgICAgIGNvbnRyb2wuZGlzYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgY29uc3Qgc291cmNlQ29udHJvbCA9IG9wdHMuc291cmNlQ29udHJvbCA/PyB0aGlzO1xuICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBWYWx1ZUNoYW5nZUV2ZW50KHRoaXMudmFsdWUsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBTdGF0dXNDaGFuZ2VFdmVudCh0aGlzLnN0YXR1cywgc291cmNlQ29udHJvbCkpO1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxUVmFsdWU+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSwgdGhpcyk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4odHJ1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgaW5jbHVkZWQgaW4gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgaXRzIHBhcmVudC4gSXRzIHN0YXR1cyByZWNhbGN1bGF0ZXMgYmFzZWQgb24gaXRzIHZhbHVlIGFuZFxuICAgKiBpdHMgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGVuYWJsZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgY29udHJvbCBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgd2hlbiBtYXJrZWQgYXMgdW50b3VjaGVkXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYCxcbiAgICogYHZhbHVlQ2hhbmdlc2AgYW5kIGBldmVudHNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgZW5hYmxlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgZW5hYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAvLyBwYXJlbnQncyBkaXJ0aW5lc3MgYmFzZWQgb24gdGhlIGNoaWxkcmVuLlxuICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG5cbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gVkFMSUQ7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wuZW5hYmxlKHsuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnR9KTtcblxuICAgIHRoaXMuX3VwZGF0ZUFuY2VzdG9ycyh7Li4ub3B0cywgc2tpcFByaXN0aW5lQ2hlY2t9LCB0aGlzKTtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLmZvckVhY2goKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbihmYWxzZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQW5jZXN0b3JzKFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNraXBQcmlzdGluZUNoZWNrPzogYm9vbGVhbn0sXG4gICAgc291cmNlQ29udHJvbDogQWJzdHJhY3RDb250cm9sLFxuICApOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICAgIGlmICghb3B0cy5za2lwUHJpc3RpbmVDaGVjaykge1xuICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKHt9LCBzb3VyY2VDb250cm9sKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZCh7fSwgc291cmNlQ29udHJvbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhcmVudCBvZiB0aGUgY29udHJvbFxuICAgKlxuICAgKiBAcGFyYW0gcGFyZW50IFRoZSBuZXcgcGFyZW50LlxuICAgKi9cbiAgc2V0UGFyZW50KHBhcmVudDogRm9ybUdyb3VwIHwgRm9ybUFycmF5IHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCBzZXRWYWx1ZSh2YWx1ZTogVFJhd1ZhbHVlLCBvcHRpb25zPzogT2JqZWN0KTogdm9pZDtcblxuICAvKipcbiAgICogUGF0Y2hlcyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3QgcGF0Y2hWYWx1ZSh2YWx1ZTogVFZhbHVlLCBvcHRpb25zPzogT2JqZWN0KTogdm9pZDtcblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHJlc2V0KHZhbHVlPzogVFZhbHVlLCBvcHRpb25zPzogT2JqZWN0KTogdm9pZDtcblxuICAvKipcbiAgICogVGhlIHJhdyB2YWx1ZSBvZiB0aGlzIGNvbnRyb2wuIEZvciBtb3N0IGNvbnRyb2wgaW1wbGVtZW50YXRpb25zLCB0aGUgcmF3IHZhbHVlIHdpbGwgaW5jbHVkZVxuICAgKiBkaXNhYmxlZCBjaGlsZHJlbi5cbiAgICovXG4gIGdldFJhd1ZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmVjYWxjdWxhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIGl0IGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIGl0cyBhbmNlc3RvcnMuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmQgZW1pdHMgZXZlbnRzXG4gICAqIGFmdGVyIHVwZGF0ZXMgYW5kIHZhbGlkaXR5IGNoZWNrcyBhcmUgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG9ubHkgdXBkYXRlIHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIHVwZGF0ZSBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgLFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBhbmQgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHM/OiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgVXNlZCB0byBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkc1xuICAgKi9cbiAgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuO1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gICAgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbDtcbiAgfSk6IHZvaWQ7XG4gIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0gPSB7fSxcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5fc2V0SW5pdGlhbFN0YXR1cygpO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG5cbiAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLl9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpO1xuICAgICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLmVycm9ycyA9IHRoaXMuX3J1blZhbGlkYXRvcigpO1xuICAgICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFZBTElEIHx8IHRoaXMuc3RhdHVzID09PSBQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3J1bkFzeW5jVmFsaWRhdG9yKG9wdHMuZW1pdEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFZhbHVlQ2hhbmdlRXZlbnQ8VFZhbHVlPih0aGlzLnZhbHVlLCBzb3VyY2VDb250cm9sKSk7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgU3RhdHVzQ2hhbmdlRXZlbnQodGhpcy5zdGF0dXMsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICAgICh0aGlzLnZhbHVlQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8VFZhbHVlPikuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPEZvcm1Db250cm9sU3RhdHVzPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoey4uLm9wdHMsIHNvdXJjZUNvbnRyb2x9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUcmVlVmFsaWRpdHkob3B0czoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge2VtaXRFdmVudDogdHJ1ZX0pOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGN0cmw6IEFic3RyYWN0Q29udHJvbCkgPT4gY3RybC5fdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHMpKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRJbml0aWFsU3RhdHVzKCkge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdGF0dXMgPSB0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkgPyBESVNBQkxFRCA6IFZBTElEO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuVmFsaWRhdG9yKCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy52YWxpZGF0b3IgPyB0aGlzLnZhbGlkYXRvcih0aGlzKSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9ydW5Bc3luY1ZhbGlkYXRvcihlbWl0RXZlbnQ/OiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYXN5bmNWYWxpZGF0b3IpIHtcbiAgICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdGF0dXMgPSBQRU5ESU5HO1xuICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9icyA9IHRvT2JzZXJ2YWJsZSh0aGlzLmFzeW5jVmFsaWRhdG9yKHRoaXMpKTtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbiA9IG9icy5zdWJzY3JpYmUoKGVycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwpID0+IHtcbiAgICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0cmlnZ2VyIHRoZSByZWNhbGN1bGF0aW9uIG9mIHRoZSB2YWxpZGF0aW9uIHN0YXR1cywgd2hpY2ggZGVwZW5kcyBvblxuICAgICAgICAvLyB0aGUgc3RhdGUgb2YgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0aW9uICh3aGV0aGVyIGl0IGlzIGluIHByb2dyZXNzIG9yIG5vdCkuIFNvLCBpdCBpc1xuICAgICAgICAvLyBuZWNlc3NhcnkgdGhhdCB3ZSBoYXZlIHVwZGF0ZWQgdGhlIGBfaGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yYCBib29sZWFuIGZsYWcgZmlyc3QuXG4gICAgICAgIHRoaXMuc2V0RXJyb3JzKGVycm9ycywge2VtaXRFdmVudH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBlcnJvcnMgb24gYSBmb3JtIGNvbnRyb2wgd2hlbiBydW5uaW5nIHZhbGlkYXRpb25zIG1hbnVhbGx5LCByYXRoZXIgdGhhbiBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBDYWxsaW5nIGBzZXRFcnJvcnNgIGFsc28gdXBkYXRlcyB0aGUgdmFsaWRpdHkgb2YgdGhlIHBhcmVudCBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXNcbiAgICogY2hhbmdlcyBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSBjb250cm9sIGVycm9ycyBhcmUgc2V0LlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhbiBldmVudCBhZnRlciB0aGUgZXJyb3JzIGFyZSBzZXQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBNYW51YWxseSBzZXQgdGhlIGVycm9ycyBmb3IgYSBjb250cm9sXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zdCBsb2dpbiA9IG5ldyBGb3JtQ29udHJvbCgnc29tZUxvZ2luJyk7XG4gICAqIGxvZ2luLnNldEVycm9ycyh7XG4gICAqICAgbm90VW5pcXVlOiB0cnVlXG4gICAqIH0pO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwoZmFsc2UpO1xuICAgKiBleHBlY3QobG9naW4uZXJyb3JzKS50b0VxdWFsKHsgbm90VW5pcXVlOiB0cnVlIH0pO1xuICAgKlxuICAgKiBsb2dpbi5zZXRWYWx1ZSgnc29tZU90aGVyTG9naW4nKTtcbiAgICpcbiAgICogZXhwZWN0KGxvZ2luLnZhbGlkKS50b0VxdWFsKHRydWUpO1xuICAgKiBgYGBcbiAgICovXG4gIHNldEVycm9ycyhlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsLCBvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgdGhpcy5fdXBkYXRlQ29udHJvbHNFcnJvcnMob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgKlxuICAgKiBUaGlzIHNpZ25hdHVyZSBmb3IgZ2V0IHN1cHBvcnRzIHN0cmluZ3MgYW5kIGBjb25zdGAgYXJyYXlzIChgLmdldChbJ2ZvbycsICdiYXInXSBhcyBjb25zdClgKS5cbiAgICovXG4gIGdldDxQIGV4dGVuZHMgc3RyaW5nIHwgcmVhZG9ubHkgKHN0cmluZyB8IG51bWJlcilbXT4oXG4gICAgcGF0aDogUCxcbiAgKTogQWJzdHJhY3RDb250cm9sPMm1R2V0UHJvcGVydHk8VFJhd1ZhbHVlLCBQPj4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgKlxuICAgKiBUaGlzIHNpZ25hdHVyZSBmb3IgYGdldGAgc3VwcG9ydHMgbm9uLWNvbnN0IChtdXRhYmxlKSBhcnJheXMuIEluZmVycmVkIHR5cGVcbiAgICogaW5mb3JtYXRpb24gd2lsbCBub3QgYmUgYXMgcm9idXN0LCBzbyBwcmVmZXIgdG8gcGFzcyBhIGByZWFkb25seWAgYXJyYXkgaWYgcG9zc2libGUuXG4gICAqL1xuICBnZXQ8UCBleHRlbmRzIHN0cmluZyB8IEFycmF5PHN0cmluZyB8IG51bWJlcj4+KFxuICAgIHBhdGg6IFAsXG4gICk6IEFic3RyYWN0Q29udHJvbDzJtUdldFByb3BlcnR5PFRSYXdWYWx1ZSwgUD4+IHwgbnVsbDtcblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgY2hpbGQgY29udHJvbCBnaXZlbiB0aGUgY29udHJvbCdzIG5hbWUgb3IgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggQSBkb3QtZGVsaW1pdGVkIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmcvbnVtYmVyIHZhbHVlcyB0aGF0IGRlZmluZSB0aGUgcGF0aCB0byB0aGVcbiAgICogY29udHJvbC4gSWYgYSBzdHJpbmcgaXMgcHJvdmlkZWQsIHBhc3NpbmcgaXQgYXMgYSBzdHJpbmcgbGl0ZXJhbCB3aWxsIHJlc3VsdCBpbiBpbXByb3ZlZCB0eXBlXG4gICAqIGluZm9ybWF0aW9uLiBMaWtld2lzZSwgaWYgYW4gYXJyYXkgaXMgcHJvdmlkZWQsIHBhc3NpbmcgaXQgYGFzIGNvbnN0YCB3aWxsIGNhdXNlIGltcHJvdmVkIHR5cGVcbiAgICogaW5mb3JtYXRpb24gdG8gYmUgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUmV0cmlldmUgYSBuZXN0ZWQgY29udHJvbFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gZ2V0IGEgYG5hbWVgIGNvbnRyb2wgbmVzdGVkIHdpdGhpbiBhIGBwZXJzb25gIHN1Yi1ncm91cDpcbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldCgncGVyc29uLm5hbWUnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ3BlcnNvbicsICduYW1lJ10gYXMgY29uc3QpO2AgLy8gYGFzIGNvbnN0YCBnaXZlcyBpbXByb3ZlZCB0eXBpbmdzXG4gICAqXG4gICAqICMjIyBSZXRyaWV2ZSBhIGNvbnRyb2wgaW4gYSBGb3JtQXJyYXlcbiAgICpcbiAgICogV2hlbiBhY2Nlc3NpbmcgYW4gZWxlbWVudCBpbnNpZGUgYSBGb3JtQXJyYXksIHlvdSBjYW4gdXNlIGFuIGVsZW1lbnQgaW5kZXguXG4gICAqIEZvciBleGFtcGxlLCB0byBnZXQgYSBgcHJpY2VgIGNvbnRyb2wgZnJvbSB0aGUgZmlyc3QgZWxlbWVudCBpbiBhbiBgaXRlbXNgIGFycmF5IHlvdSBjYW4gdXNlOlxuICAgKlxuICAgKiAqIGB0aGlzLmZvcm0uZ2V0KCdpdGVtcy4wLnByaWNlJyk7YFxuICAgKlxuICAgKiAtT1ItXG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoWydpdGVtcycsIDAsICdwcmljZSddKTtgXG4gICAqL1xuICBnZXQ8UCBleHRlbmRzIHN0cmluZyB8IChzdHJpbmcgfCBudW1iZXIpW10+KFxuICAgIHBhdGg6IFAsXG4gICk6IEFic3RyYWN0Q29udHJvbDzJtUdldFByb3BlcnR5PFRSYXdWYWx1ZSwgUD4+IHwgbnVsbCB7XG4gICAgbGV0IGN1cnJQYXRoOiBBcnJheTxzdHJpbmcgfCBudW1iZXI+IHwgc3RyaW5nID0gcGF0aDtcbiAgICBpZiAoY3VyclBhdGggPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGN1cnJQYXRoKSkgY3VyclBhdGggPSBjdXJyUGF0aC5zcGxpdCgnLicpO1xuICAgIGlmIChjdXJyUGF0aC5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICAgIHJldHVybiBjdXJyUGF0aC5yZWR1Y2UoXG4gICAgICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sIHwgbnVsbCwgbmFtZSkgPT4gY29udHJvbCAmJiBjb250cm9sLl9maW5kKG5hbWUpLFxuICAgICAgdGhpcyxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIGVycm9yIGRhdGEgZm9yIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICogdG8gdGhlIGNvbnRyb2wgdGhhdCBzaG91bGQgYmUgcXVlcmllZCBmb3IgZXJyb3JzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgYEZvcm1Hcm91cGA6XG4gICAqXG4gICAqIGBgYFxuICAgKiBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgKlxuICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgKlxuICAgKiAxLiBBbiBhcnJheSBvZiBzdHJpbmcgY29udHJvbCBuYW1lcywgZS5nLiBgWydhZGRyZXNzJywgJ3N0cmVldCddYFxuICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAqXG4gICAqIEByZXR1cm5zIGVycm9yIGRhdGEgZm9yIHRoYXQgcGFydGljdWxhciBlcnJvci4gSWYgdGhlIGNvbnRyb2wgb3IgZXJyb3IgaXMgbm90IHByZXNlbnQsXG4gICAqIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXRFcnJvcihlcnJvckNvZGU6IHN0cmluZywgcGF0aD86IEFycmF5PHN0cmluZyB8IG51bWJlcj4gfCBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IGNvbnRyb2wgPSBwYXRoID8gdGhpcy5nZXQocGF0aCkgOiB0aGlzO1xuICAgIHJldHVybiBjb250cm9sICYmIGNvbnRyb2wuZXJyb3JzID8gY29udHJvbC5lcnJvcnNbZXJyb3JDb2RlXSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBwYXRoIGhhcyB0aGUgZXJyb3Igc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVja1xuICAgKiBAcGFyYW0gcGF0aCBBIGxpc3Qgb2YgY29udHJvbCBuYW1lcyB0aGF0IGRlc2lnbmF0ZXMgaG93IHRvIG1vdmUgZnJvbSB0aGUgY3VycmVudCBjb250cm9sXG4gICAqIHRvIHRoZSBjb250cm9sIHRoYXQgc2hvdWxkIGJlIHF1ZXJpZWQgZm9yIGVycm9ycy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogRm9yIGV4YW1wbGUsIGZvciB0aGUgZm9sbG93aW5nIGBGb3JtR3JvdXBgOlxuICAgKlxuICAgKiBgYGBcbiAgICogZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGFkZHJlc3M6IG5ldyBGb3JtR3JvdXAoeyBzdHJlZXQ6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIHBhdGggdG8gdGhlICdzdHJlZXQnIGNvbnRyb2wgZnJvbSB0aGUgcm9vdCBmb3JtIHdvdWxkIGJlICdhZGRyZXNzJyAtPiAnc3RyZWV0Jy5cbiAgICpcbiAgICogSXQgY2FuIGJlIHByb3ZpZGVkIHRvIHRoaXMgbWV0aG9kIGluIG9uZSBvZiB0d28gZm9ybWF0czpcbiAgICpcbiAgICogMS4gQW4gYXJyYXkgb2Ygc3RyaW5nIGNvbnRyb2wgbmFtZXMsIGUuZy4gYFsnYWRkcmVzcycsICdzdHJlZXQnXWBcbiAgICogMS4gQSBwZXJpb2QtZGVsaW1pdGVkIGxpc3Qgb2YgY29udHJvbCBuYW1lcyBpbiBvbmUgc3RyaW5nLCBlLmcuIGAnYWRkcmVzcy5zdHJlZXQnYFxuICAgKlxuICAgKiBJZiBubyBwYXRoIGlzIGdpdmVuLCB0aGlzIG1ldGhvZCBjaGVja3MgZm9yIHRoZSBlcnJvciBvbiB0aGUgY3VycmVudCBjb250cm9sLlxuICAgKlxuICAgKiBAcmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBlcnJvciBpcyBwcmVzZW50IGluIHRoZSBjb250cm9sIGF0IHRoZSBnaXZlbiBwYXRoLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgZmFsc2UgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBoYXNFcnJvcihlcnJvckNvZGU6IHN0cmluZywgcGF0aD86IEFycmF5PHN0cmluZyB8IG51bWJlcj4gfCBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmdldEVycm9yKGVycm9yQ29kZSwgcGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSB0b3AtbGV2ZWwgYW5jZXN0b3Igb2YgdGhpcyBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHJvb3QoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBsZXQgeDogQWJzdHJhY3RDb250cm9sID0gdGhpcztcblxuICAgIHdoaWxlICh4Ll9wYXJlbnQpIHtcbiAgICAgIHggPSB4Ll9wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQ6IGJvb2xlYW4sIGNoYW5nZWRDb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG5cbiAgICBpZiAoZW1pdEV2ZW50KSB7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFN0YXR1c0NoYW5nZUV2ZW50KHRoaXMuc3RhdHVzLCBjaGFuZ2VkQ29udHJvbCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50LCBjaGFuZ2VkQ29udHJvbCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5pdE9ic2VydmFibGVzKCkge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS52YWx1ZUNoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnN0YXR1c0NoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIH1cblxuICBwcml2YXRlIF9jYWxjdWxhdGVTdGF0dXMoKTogRm9ybUNvbnRyb2xTdGF0dXMge1xuICAgIGlmICh0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkpIHJldHVybiBESVNBQkxFRDtcbiAgICBpZiAodGhpcy5lcnJvcnMpIHJldHVybiBJTlZBTElEO1xuICAgIGlmICh0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgfHwgdGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKFBFTkRJTkcpKSByZXR1cm4gUEVORElORztcbiAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKElOVkFMSUQpKSByZXR1cm4gSU5WQUxJRDtcbiAgICByZXR1cm4gVkFMSUQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF91cGRhdGVWYWx1ZSgpOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2ZvckVhY2hDaGlsZChjYjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfYW55Q29udHJvbHMoY29uZGl0aW9uOiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiBib29sZWFuKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhzdGF0dXM6IEZvcm1Db250cm9sU3RhdHVzKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuc3RhdHVzID09PSBzdGF0dXMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNEaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5kaXJ0eSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc1RvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wudG91Y2hlZCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSwgY2hhbmdlZENvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgIGNvbnN0IG5ld1ByaXN0aW5lID0gIXRoaXMuX2FueUNvbnRyb2xzRGlydHkoKTtcbiAgICBjb25zdCBjaGFuZ2VkID0gdGhpcy5wcmlzdGluZSAhPT0gbmV3UHJpc3RpbmU7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnByaXN0aW5lID0gbmV3UHJpc3RpbmU7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKG9wdHMsIGNoYW5nZWRDb250cm9sKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFByaXN0aW5lQ2hhbmdlRXZlbnQodGhpcy5wcmlzdGluZSwgY2hhbmdlZENvbnRyb2wpKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUb3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30sIGNoYW5nZWRDb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikudG91Y2hlZCA9IHRoaXMuX2FueUNvbnRyb2xzVG91Y2hlZCgpO1xuICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBUb3VjaGVkQ2hhbmdlRXZlbnQodGhpcy50b3VjaGVkLCBjaGFuZ2VkQ29udHJvbCkpO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMsIGNoYW5nZWRDb250cm9sKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkRpc2FibGVkQ2hhbmdlOiBBcnJheTwoaXNEaXNhYmxlZDogYm9vbGVhbikgPT4gdm9pZD4gPSBbXTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0VXBkYXRlU3RyYXRlZ3kob3B0cz86IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKGlzT3B0aW9uc09iaihvcHRzKSAmJiBvcHRzLnVwZGF0ZU9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU9uID0gb3B0cy51cGRhdGVPbiE7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyZW50TWFya2VkRGlydHkob25seVNlbGY/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyZW50RGlydHkgPSB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmRpcnR5O1xuICAgIHJldHVybiAhb25seVNlbGYgJiYgISFwYXJlbnREaXJ0eSAmJiAhdGhpcy5fcGFyZW50IS5fYW55Q29udHJvbHNEaXJ0eSgpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmluZChuYW1lOiBzdHJpbmcgfCBudW1iZXIpOiBBYnN0cmFjdENvbnRyb2wgfCBudWxsIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYHNldFZhbGlkYXRvcnNgIG1ldGhvZC4gTmVlZHMgdG8gYmUgc2VwYXJhdGVkIG91dCBpbnRvIGFcbiAgICogZGlmZmVyZW50IG1ldGhvZCwgYmVjYXVzZSBpdCBpcyBjYWxsZWQgaW4gdGhlIGNvbnN0cnVjdG9yIGFuZCBpdCBjYW4gYnJlYWsgY2FzZXMgd2hlcmVcbiAgICogYSBjb250cm9sIGlzIGV4dGVuZGVkLlxuICAgKi9cbiAgcHJpdmF0ZSBfYXNzaWduVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBudWxsKTogdm9pZCB7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzLnNsaWNlKCkgOiB2YWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSBjb2VyY2VUb1ZhbGlkYXRvcih0aGlzLl9yYXdWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgYHNldEFzeW5jVmFsaWRhdG9yc2AgbWV0aG9kLiBOZWVkcyB0byBiZSBzZXBhcmF0ZWQgb3V0IGludG8gYVxuICAgKiBkaWZmZXJlbnQgbWV0aG9kLCBiZWNhdXNlIGl0IGlzIGNhbGxlZCBpbiB0aGUgY29uc3RydWN0b3IgYW5kIGl0IGNhbiBicmVhayBjYXNlcyB3aGVyZVxuICAgKiBhIGNvbnRyb2wgaXMgZXh0ZW5kZWQuXG4gICAqL1xuICBwcml2YXRlIF9hc3NpZ25Bc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSBBcnJheS5pc0FycmF5KHZhbGlkYXRvcnMpID8gdmFsaWRhdG9ycy5zbGljZSgpIDogdmFsaWRhdG9ycztcbiAgICB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyk7XG4gIH1cbn1cbiJdfQ==