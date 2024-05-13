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
 * @deprecated use `PristineChangeEvent` symbol instead.
 */
export class PristineEvent extends ControlEvent {
    constructor(pristine, source) {
        super();
        this.pristine = pristine;
        this.source = source;
    }
}
/**
 * Event fired when the control's pristine state changes (pristine <=> dirty).
 *
 * @publicApi
 */
export class PristineChangeEvent extends PristineEvent {
}
/**
 * @deprecated use `TouchedChangeEvent` symbol instead.
 */
export class TouchedEvent extends ControlEvent {
    constructor(touched, source) {
        super();
        this.touched = touched;
        this.source = source;
    }
}
/**
 * Event fired when the control's touched status changes (touched <=> untouched).
 *
 * @publicApi
 */
export class TouchedChangeEvent extends TouchedEvent {
}
/**
 * @deprecated use `StatusChangeEvent` symbol instead.
 */
export class StatusEvent extends ControlEvent {
    constructor(status, source) {
        super();
        this.status = status;
        this.source = source;
    }
}
/**
 * Event fired when the control's status changes.
 *
 * @publicApi
 */
export class StatusChangeEvent extends StatusEvent {
}
/**
 * Event fired when a form is submitted
 *
 * @publicApi
 */
export class FormSubmittedEvent extends ControlEvent {
    constructor(source) {
        super();
        this.source = source;
    }
}
/**
 * Event fired when a form is reset.
 *
 * @publicApi
 */
export class FormResetEvent extends ControlEvent {
    constructor(source) {
        super();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwvYWJzdHJhY3RfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxhQUFhLElBQUksWUFBWSxFQUF3QixNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXpDLE9BQU8sRUFDTCxxQ0FBcUMsRUFDckMsbUJBQW1CLEVBQ25CLHdCQUF3QixFQUN4QixlQUFlLEdBQ2hCLE1BQU0sK0JBQStCLENBQUM7QUFJdkMsT0FBTyxFQUNMLGFBQWEsRUFDYixzQkFBc0IsRUFDdEIsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBRTdCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFakM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztBQW1CbkM7Ozs7R0FJRztBQUNILE1BQU0sT0FBZ0IsWUFBWTtDQUtqQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sZ0JBQW9CLFNBQVEsWUFBZTtJQUN0RCxZQUNrQixLQUFRLEVBQ1IsTUFBdUI7UUFFdkMsS0FBSyxFQUFFLENBQUM7UUFIUSxVQUFLLEdBQUwsS0FBSyxDQUFHO1FBQ1IsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7SUFHekMsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sYUFBYyxTQUFRLFlBQVk7SUFDN0MsWUFDa0IsUUFBaUIsRUFDakIsTUFBdUI7UUFFdkMsS0FBSyxFQUFFLENBQUM7UUFIUSxhQUFRLEdBQVIsUUFBUSxDQUFTO1FBQ2pCLFdBQU0sR0FBTixNQUFNLENBQWlCO0lBR3pDLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sbUJBQW9CLFNBQVEsYUFBYTtDQUFHO0FBRXpEOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFlBQWEsU0FBUSxZQUFZO0lBQzVDLFlBQ2tCLE9BQWdCLEVBQ2hCLE1BQXVCO1FBRXZDLEtBQUssRUFBRSxDQUFDO1FBSFEsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixXQUFNLEdBQU4sTUFBTSxDQUFpQjtJQUd6QyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFlBQVk7Q0FBRztBQUV2RDs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFZLFNBQVEsWUFBWTtJQUMzQyxZQUNrQixNQUF5QixFQUN6QixNQUF1QjtRQUV2QyxLQUFLLEVBQUUsQ0FBQztRQUhRLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQ3pCLFdBQU0sR0FBTixNQUFNLENBQWlCO0lBR3pDLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8saUJBQWtCLFNBQVEsV0FBVztDQUFHO0FBRXJEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsWUFBWTtJQUNsRCxZQUE0QixNQUF1QjtRQUNqRCxLQUFLLEVBQUUsQ0FBQztRQURrQixXQUFNLEdBQU4sTUFBTSxDQUFpQjtJQUVuRCxDQUFDO0NBQ0Y7QUFDRDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLGNBQWUsU0FBUSxZQUFZO0lBQzlDLFlBQTRCLE1BQXVCO1FBQ2pELEtBQUssRUFBRSxDQUFDO1FBRGtCLFdBQU0sR0FBTixNQUFNLENBQWlCO0lBRW5ELENBQUM7Q0FDRjtBQUVEOztHQUVHO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FDNUIsZUFBNkU7SUFFN0UsT0FBTyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxDQUFDO0FBQ2hHLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsaUJBQWlCLENBQUMsU0FBNkM7SUFDdEUsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztBQUNyRixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsbUJBQW1CLENBQ2pDLGNBQTZELEVBQzdELGVBQTZFO0lBRTdFLElBQUksT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsRUFBRSxDQUFDO1FBQ2xELElBQUksWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUN0RCxDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLElBQUksQ0FBQztBQUNwRyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHNCQUFzQixDQUM3QixjQUE2RDtJQUU3RCxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQyxjQUFjLENBQUM7UUFDeEMsQ0FBQyxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUM7QUFDN0IsQ0FBQztBQTJCRCxNQUFNLFVBQVUsWUFBWSxDQUMxQixlQUE2RTtJQUU3RSxPQUFPLENBQ0wsZUFBZSxJQUFJLElBQUk7UUFDdkIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztRQUMvQixPQUFPLGVBQWUsS0FBSyxRQUFRLENBQ3BDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLG9CQUFvQixDQUFDLE1BQVcsRUFBRSxPQUFnQixFQUFFLEdBQW9CO0lBQ3RGLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUE2QyxDQUFDO0lBQ3RFLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzlELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDdkIsTUFBTSxJQUFJLFlBQVksMENBRXBCLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUM5RSxDQUFDO0lBQ0osQ0FBQztJQUNELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNuQixNQUFNLElBQUksWUFBWSw4Q0FFcEIsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ3ZGLENBQUM7SUFDSixDQUFDO0FBQ0gsQ0FBQztBQUVELE1BQU0sVUFBVSxzQkFBc0IsQ0FBQyxPQUFZLEVBQUUsT0FBZ0IsRUFBRSxLQUFVO0lBQy9FLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFVLEVBQUUsR0FBb0IsRUFBRSxFQUFFO1FBQ3pELElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzdCLE1BQU0sSUFBSSxZQUFZLG9EQUVwQixPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDNUYsQ0FBQztRQUNKLENBQUM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUEyS0Q7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLE9BQWdCLGVBQWU7SUF5RW5DOzs7Ozs7O09BT0c7SUFDSCxZQUNFLFVBQThDLEVBQzlDLGVBQTZEO1FBbEYvRCxnQkFBZ0I7UUFDaEIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEI7Ozs7V0FJRztRQUNILGlDQUE0QixHQUFHLEtBQUssQ0FBQztRQUVyQyxnQkFBZ0I7UUFDaEIsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFFeEIsZ0JBQWdCO1FBQ2hCLHdCQUFtQixHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUt2QixZQUFPLEdBQWlDLElBQUksQ0FBQztRQW9MckQ7Ozs7OztXQU1HO1FBQ2EsYUFBUSxHQUFZLElBQUksQ0FBQztRQWF6Qzs7Ozs7V0FLRztRQUNhLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFZekM7Ozs7V0FJRztRQUNNLFlBQU8sR0FBRyxJQUFJLE9BQU8sRUFBd0IsQ0FBQztRQUV2RDs7Ozs7Ozs7Ozs7V0FXRztRQUNhLFdBQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBcTVCckQsZ0JBQWdCO1FBQ2hCLHNCQUFpQixHQUF5QyxFQUFFLENBQUM7UUFsa0MzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsb0JBQW9CLENBQUM7SUFDbkMsQ0FBQztJQUNELElBQUksU0FBUyxDQUFDLFdBQStCO1FBQzNDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFdBQVcsQ0FBQztJQUNoRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztJQUN4QyxDQUFDO0lBQ0QsSUFBSSxjQUFjLENBQUMsZ0JBQXlDO1FBQzFELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMseUJBQXlCLEdBQUcsZ0JBQWdCLENBQUM7SUFDL0UsQ0FBQztJQUVEOztPQUVHO0lBQ0gsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFZRDs7Ozs7OztPQU9HO0lBQ0gsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQztJQUMvQixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssUUFBUSxDQUFDO0lBQ2xDLENBQUM7SUFpQkQ7Ozs7OztPQU1HO0lBQ0gsSUFBSSxLQUFLO1FBQ1AsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDeEIsQ0FBQztJQVVEOzs7OztPQUtHO0lBQ0gsSUFBSSxTQUFTO1FBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdkIsQ0FBQztJQWlERDs7Ozs7T0FLRztJQUNILElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztJQUN6RixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsYUFBYSxDQUFDLFVBQThDO1FBQzFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsa0JBQWtCLENBQUMsVUFBd0Q7UUFDekUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILGFBQWEsQ0FBQyxVQUF1QztRQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSCxrQkFBa0IsQ0FBQyxVQUFpRDtRQUNsRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQTRCRztJQUNILGdCQUFnQixDQUFDLFVBQXVDO1FBQ3RELElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0gscUJBQXFCLENBQUMsVUFBaUQ7UUFDckUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXNCRztJQUNILFlBQVksQ0FBQyxTQUFzQjtRQUNqQyxPQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsaUJBQWlCLENBQUMsU0FBMkI7UUFDM0MsT0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxlQUFlO1FBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDeEIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILG9CQUFvQjtRQUNsQixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBMkJELGFBQWEsQ0FDWCxPQUFtRixFQUFFO1FBRXJGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDO1FBQ3RDLElBQXVCLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUV4QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBQyxHQUFHLElBQUksRUFBRSxhQUFhLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFFRCxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxnQkFBZ0IsQ0FBQyxPQUE4QixFQUFFO1FBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBRXJGLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBOEJELGVBQWUsQ0FDYixPQUFtRixFQUFFO1FBRXJGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDO1FBQ3JDLElBQXVCLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN6QyxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUU3QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztRQUNqRCxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFO1lBQzlDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFFRCxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRSxDQUFDO1lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDbEUsQ0FBQztJQUNILENBQUM7SUEyQkQsV0FBVyxDQUNULE9BQW1GLEVBQUU7UUFFckYsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7UUFDdEMsSUFBdUIsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBRTFDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDO1FBQ2pELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFDLEdBQUcsSUFBSSxFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVELElBQUksT0FBTyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDO0lBQ0gsQ0FBQztJQThCRCxjQUFjLENBQ1osT0FBbUYsRUFBRTtRQUVyRixNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxLQUFLLEtBQUssQ0FBQztRQUN2QyxJQUF1QixDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFFM0IsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUM7UUFDakQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRTtZQUM5QyxzREFBc0Q7WUFDdEQsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBRUQsSUFBSSxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFtQixDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUM7SUFDSCxDQUFDO0lBNEJELGFBQWEsQ0FDWCxPQUFtRixFQUFFO1FBRXBGLElBQXVCLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUUxQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLGFBQWlELENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUMsR0FBRyxJQUFJLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0gsQ0FBQztJQXdCRCxPQUFPLENBQ0wsT0FBbUYsRUFBRTtRQUVyRixpRkFBaUY7UUFDakYsNENBQTRDO1FBQzVDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVoRSxJQUF1QixDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDMUMsSUFBdUIsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUU7WUFDOUMsc0RBQXNEO1lBQ3RELE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBQyxHQUFHLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDbkUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFlBQXFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsYUFBaUQsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLElBQUksRUFBRSxpQkFBaUIsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FpQkc7SUFDSCxNQUFNLENBQUMsT0FBa0QsRUFBRTtRQUN6RCxpRkFBaUY7UUFDakYsNENBQTRDO1FBQzVDLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVoRSxJQUF1QixDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDeEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRTtZQUM5QyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUMsR0FBRyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBQyxHQUFHLElBQUksRUFBRSxpQkFBaUIsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTyxnQkFBZ0IsQ0FDdEIsSUFBNEUsRUFDNUUsYUFBOEI7UUFFOUIsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7WUFDbEQsQ0FBQztZQUNELElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNqRCxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxTQUFTLENBQUMsTUFBb0M7UUFDNUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQWlCRDs7O09BR0c7SUFDSCxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUF5QkQsc0JBQXNCLENBQ3BCLE9BQW1GLEVBQUU7UUFFckYsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXBCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQ2xDLElBQXVCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUN0RCxJQUF1QixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUUxRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFLENBQUM7Z0JBQ3JELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDM0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLFlBQXFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1RCxJQUFJLENBQUMsYUFBaUQsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVFLENBQUM7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLEdBQUcsSUFBSSxFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsbUJBQW1CLENBQUMsT0FBOEIsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDO1FBQ2pFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFxQixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBRU8saUJBQWlCO1FBQ3RCLElBQXVCLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUNuRixDQUFDO0lBRU8sYUFBYTtRQUNuQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN0RCxDQUFDO0lBRU8sa0JBQWtCLENBQUMsU0FBbUI7UUFDNUMsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBdUIsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQzFDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUM7WUFDekMsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUMsNEJBQTRCLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQStCLEVBQUUsRUFBRTtnQkFDcEYsSUFBSSxDQUFDLDRCQUE0QixHQUFHLEtBQUssQ0FBQztnQkFDMUMsaUZBQWlGO2dCQUNqRix5RkFBeUY7Z0JBQ3pGLHdGQUF3RjtnQkFDeEYsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1lBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFTywyQkFBMkI7UUFDakMsSUFBSSxJQUFJLENBQUMsNEJBQTRCLEVBQUUsQ0FBQztZQUN0QyxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLDRCQUE0QixHQUFHLEtBQUssQ0FBQztRQUM1QyxDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0EyQkc7SUFDSCxTQUFTLENBQUMsTUFBK0IsRUFBRSxPQUE4QixFQUFFO1FBQ3hFLElBQXVCLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN6QyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQXFCRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E2Qkc7SUFDSCxHQUFHLENBQ0QsSUFBTztRQUVQLElBQUksUUFBUSxHQUFvQyxJQUFJLENBQUM7UUFDckQsSUFBSSxRQUFRLElBQUksSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUFFLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdELElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDdkMsT0FBTyxRQUFRLENBQUMsTUFBTSxDQUNwQixDQUFDLE9BQStCLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFDekUsSUFBSSxDQUNMLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BMEJHO0lBQ0gsUUFBUSxDQUFDLFNBQWlCLEVBQUUsSUFBc0M7UUFDaEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDN0MsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RFLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E2Qkc7SUFDSCxRQUFRLENBQUMsU0FBaUIsRUFBRSxJQUFzQztRQUNoRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLElBQUk7UUFDTixJQUFJLENBQUMsR0FBb0IsSUFBSSxDQUFDO1FBRTlCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2hCLENBQUM7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIscUJBQXFCLENBQUMsU0FBa0IsRUFBRSxjQUErQjtRQUN0RSxJQUF1QixDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUUxRCxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLGFBQWlELENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUN4RSxDQUFDO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDaEUsQ0FBQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO1FBQ2IsSUFBdUIsQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMxRCxJQUF1QixDQUFDLGFBQWEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQzlELENBQUM7SUFFTyxnQkFBZ0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7WUFBRSxPQUFPLFFBQVEsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQUUsT0FBTyxPQUFPLENBQUM7UUFDaEMsSUFBSSxJQUFJLENBQUMsNEJBQTRCLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQzlGLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQ3pELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQWlCRCxnQkFBZ0I7SUFDaEIsc0JBQXNCLENBQUMsTUFBeUI7UUFDOUMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLG1CQUFtQjtRQUNqQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUUsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixlQUFlLENBQUMsSUFBMEIsRUFBRSxjQUErQjtRQUN6RSxNQUFNLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzlDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDO1FBQzdDLElBQXVCLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUVoRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFFRCxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQztJQUNILENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsY0FBYyxDQUFDLE9BQTZCLEVBQUUsRUFBRSxjQUErQjtRQUM1RSxJQUF1QixDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUM5RCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUV4RSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7SUFDSCxDQUFDO0lBS0QsZ0JBQWdCO0lBQ2hCLDJCQUEyQixDQUFDLEVBQWM7UUFDeEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGtCQUFrQixDQUFDLElBQWtFO1FBQ25GLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFLENBQUM7WUFDaEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUyxDQUFDO1FBQ2xDLENBQUM7SUFDSCxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNLLGtCQUFrQixDQUFDLFFBQWtCO1FBQzNDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdkQsT0FBTyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzFFLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsS0FBSyxDQUFDLElBQXFCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxpQkFBaUIsQ0FBQyxVQUE4QztRQUN0RSxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQ2xGLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxzQkFBc0IsQ0FBQyxVQUF3RDtRQUNyRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDdkYsSUFBSSxDQUFDLHlCQUF5QixHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0V2ZW50RW1pdHRlciwgybVSdW50aW1lRXJyb3IgYXMgUnVudGltZUVycm9yLCDJtVdyaXRhYmxlIGFzIFdyaXRhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gIGFzeW5jVmFsaWRhdG9yc0Ryb3BwZWRXaXRoT3B0c1dhcm5pbmcsXG4gIG1pc3NpbmdDb250cm9sRXJyb3IsXG4gIG1pc3NpbmdDb250cm9sVmFsdWVFcnJvcixcbiAgbm9Db250cm9sc0Vycm9yLFxufSBmcm9tICcuLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2Vycm9ycyc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvckZufSBmcm9tICcuLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtSdW50aW1lRXJyb3JDb2RlfSBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IHtGb3JtQXJyYXksIEZvcm1Hcm91cH0gZnJvbSAnLi4vZm9ybXMnO1xuaW1wb3J0IHtcbiAgYWRkVmFsaWRhdG9ycyxcbiAgY29tcG9zZUFzeW5jVmFsaWRhdG9ycyxcbiAgY29tcG9zZVZhbGlkYXRvcnMsXG4gIGhhc1ZhbGlkYXRvcixcbiAgcmVtb3ZlVmFsaWRhdG9ycyxcbiAgdG9PYnNlcnZhYmxlLFxufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBzdGF0dXN9XG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJRCA9ICdWQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyBpbnZhbGlkLCBtZWFuaW5nIHRoYXQgYW4gZXJyb3IgZXhpc3RzIGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBzdGF0dXN9XG4gKi9cbmV4cG9ydCBjb25zdCBJTlZBTElEID0gJ0lOVkFMSUQnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IGFzeW5jIHZhbGlkYXRpb24gaXMgb2NjdXJyaW5nIGFuZFxuICogZXJyb3JzIGFyZSBub3QgeWV0IGF2YWlsYWJsZSBmb3IgdGhlIGlucHV0IHZhbHVlLlxuICpcbiAqIEBzZWUge0BsaW5rIG1hcmtBc1BlbmRpbmd9XG4gKiBAc2VlIHtAbGluayBzdGF0dXN9XG4gKi9cbmV4cG9ydCBjb25zdCBQRU5ESU5HID0gJ1BFTkRJTkcnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgZGlzYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSBhbmNlc3RvclxuICogY2FsY3VsYXRpb25zIG9mIHZhbGlkaXR5IG9yIHZhbHVlLlxuICpcbiAqIEBzZWUge0BsaW5rIG1hcmtBc0Rpc2FibGVkfVxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5leHBvcnQgY29uc3QgRElTQUJMRUQgPSAnRElTQUJMRUQnO1xuXG4vKipcbiAqIEEgZm9ybSBjYW4gaGF2ZSBzZXZlcmFsIGRpZmZlcmVudCBzdGF0dXNlcy4gRWFjaFxuICogcG9zc2libGUgc3RhdHVzIGlzIHJldHVybmVkIGFzIGEgc3RyaW5nIGxpdGVyYWwuXG4gKlxuICogKiAqKlZBTElEKio6IFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgdmFsaWQsIG1lYW5pbmcgdGhhdCBubyBlcnJvcnMgZXhpc3QgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipJTlZBTElEKio6IFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXRcbiAqIHZhbHVlLlxuICogKiAqKlBFTkRJTkcqKjogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyBwZW5kaW5nLCBtZWFuaW5nIHRoYXQgYXN5bmMgdmFsaWRhdGlvbiBpc1xuICogb2NjdXJyaW5nIGFuZCBlcnJvcnMgYXJlIG5vdCB5ZXQgYXZhaWxhYmxlIGZvciB0aGUgaW5wdXQgdmFsdWUuXG4gKiAqICoqRElTQUJMRUQqKjogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpc1xuICogZGlzYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSBhbmNlc3RvciBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBGb3JtQ29udHJvbFN0YXR1cyA9ICdWQUxJRCcgfCAnSU5WQUxJRCcgfCAnUEVORElORycgfCAnRElTQUJMRUQnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGV2ZXJ5IGV2ZW50IHNlbnQgYnkgYEFic3RyYWN0Q29udHJvbC5ldmVudHMoKWBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb250cm9sRXZlbnQ8VCA9IGFueT4ge1xuICAvKipcbiAgICogRm9ybSBjb250cm9sIGZyb20gd2hpY2ggdGhpcyBldmVudCBpcyBvcmlnaW5hdGVkLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sPHVua25vd24+O1xufVxuXG4vKipcbiAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIHZhbHVlIG9mIGEgY29udHJvbCBjaGFuZ2VzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIFZhbHVlQ2hhbmdlRXZlbnQ8VD4gZXh0ZW5kcyBDb250cm9sRXZlbnQ8VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IFQsXG4gICAgcHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGBQcmlzdGluZUNoYW5nZUV2ZW50YCBzeW1ib2wgaW5zdGVhZC5cbiAqL1xuXG5leHBvcnQgY2xhc3MgUHJpc3RpbmVFdmVudCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBwcmlzdGluZTogYm9vbGVhbixcbiAgICBwdWJsaWMgcmVhZG9ubHkgc291cmNlOiBBYnN0cmFjdENvbnRyb2wsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFdmVudCBmaXJlZCB3aGVuIHRoZSBjb250cm9sJ3MgcHJpc3RpbmUgc3RhdGUgY2hhbmdlcyAocHJpc3RpbmUgPD0+IGRpcnR5KS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cblxuZXhwb3J0IGNsYXNzIFByaXN0aW5lQ2hhbmdlRXZlbnQgZXh0ZW5kcyBQcmlzdGluZUV2ZW50IHt9XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGBUb3VjaGVkQ2hhbmdlRXZlbnRgIHN5bWJvbCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgVG91Y2hlZEV2ZW50IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IHRvdWNoZWQ6IGJvb2xlYW4sXG4gICAgcHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG5cbi8qKlxuICogRXZlbnQgZmlyZWQgd2hlbiB0aGUgY29udHJvbCdzIHRvdWNoZWQgc3RhdHVzIGNoYW5nZXMgKHRvdWNoZWQgPD0+IHVudG91Y2hlZCkuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVG91Y2hlZENoYW5nZUV2ZW50IGV4dGVuZHMgVG91Y2hlZEV2ZW50IHt9XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGBTdGF0dXNDaGFuZ2VFdmVudGAgc3ltYm9sIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0dXNFdmVudCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBzdGF0dXM6IEZvcm1Db250cm9sU3RhdHVzLFxuICAgIHB1YmxpYyByZWFkb25seSBzb3VyY2U6IEFic3RyYWN0Q29udHJvbCxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuXG4vKipcbiAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIGNvbnRyb2wncyBzdGF0dXMgY2hhbmdlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0dXNDaGFuZ2VFdmVudCBleHRlbmRzIFN0YXR1c0V2ZW50IHt9XG5cbi8qKlxuICogRXZlbnQgZmlyZWQgd2hlbiBhIGZvcm0gaXMgc3VibWl0dGVkXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybVN1Ym1pdHRlZEV2ZW50IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuLyoqXG4gKiBFdmVudCBmaXJlZCB3aGVuIGEgZm9ybSBpcyByZXNldC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBGb3JtUmVzZXRFdmVudCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBzb3VyY2U6IEFic3RyYWN0Q29udHJvbCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHZhbGlkYXRvcnMgZnJvbSBlaXRoZXIgYW4gb3B0aW9ucyBvYmplY3Qgb3IgZ2l2ZW4gdmFsaWRhdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tWYWxpZGF0b3JzKFxuICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbik6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGwge1xuICByZXR1cm4gKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gdmFsaWRhdG9yT3JPcHRzLnZhbGlkYXRvcnMgOiB2YWxpZGF0b3JPck9wdHMpIHx8IG51bGw7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB2YWxpZGF0b3IgZnVuY3Rpb24gYnkgY29tYmluaW5nIHByb3ZpZGVkIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbCk6IFZhbGlkYXRvckZuIHwgbnVsbCB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbGlkYXRvcikgPyBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3IpIDogdmFsaWRhdG9yIHx8IG51bGw7XG59XG5cbi8qKlxuICogR2V0cyBhc3luYyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrQXN5bmNWYWxpZGF0b3JzKFxuICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsLFxuICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbik6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsIHtcbiAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgIGlmIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSAmJiBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgY29uc29sZS53YXJuKGFzeW5jVmFsaWRhdG9yc0Ryb3BwZWRXaXRoT3B0c1dhcm5pbmcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gdmFsaWRhdG9yT3JPcHRzLmFzeW5jVmFsaWRhdG9ycyA6IGFzeW5jVmFsaWRhdG9yKSB8fCBudWxsO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uIGJ5IGNvbWJpbmluZyBwcm92aWRlZCBhc3luYyB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKFxuICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsLFxuKTogQXN5bmNWYWxpZGF0b3JGbiB8IG51bGwge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhc3luY1ZhbGlkYXRvcilcbiAgICA/IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IpXG4gICAgOiBhc3luY1ZhbGlkYXRvciB8fCBudWxsO1xufVxuXG5leHBvcnQgdHlwZSBGb3JtSG9va3MgPSAnY2hhbmdlJyB8ICdibHVyJyB8ICdzdWJtaXQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igb3B0aW9ucyBwcm92aWRlZCB0byBhbiBgQWJzdHJhY3RDb250cm9sYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGEgY29udHJvbC5cbiAgICovXG4gIHZhbGlkYXRvcnM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBudWxsO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBsaXN0IG9mIGFzeW5jIHZhbGlkYXRvcnMgYXBwbGllZCB0byBjb250cm9sLlxuICAgKi9cbiAgYXN5bmNWYWxpZGF0b3JzPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGw7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGV2ZW50IG5hbWUgZm9yIGNvbnRyb2wgdG8gdXBkYXRlIHVwb24uXG4gICAqL1xuICB1cGRhdGVPbj86ICdjaGFuZ2UnIHwgJ2JsdXInIHwgJ3N1Ym1pdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09wdGlvbnNPYmooXG4gIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsLFxuKTogdmFsaWRhdG9yT3JPcHRzIGlzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMge1xuICByZXR1cm4gKFxuICAgIHZhbGlkYXRvck9yT3B0cyAhPSBudWxsICYmXG4gICAgIUFycmF5LmlzQXJyYXkodmFsaWRhdG9yT3JPcHRzKSAmJlxuICAgIHR5cGVvZiB2YWxpZGF0b3JPck9wdHMgPT09ICdvYmplY3QnXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRDb250cm9sUHJlc2VudChwYXJlbnQ6IGFueSwgaXNHcm91cDogYm9vbGVhbiwga2V5OiBzdHJpbmcgfCBudW1iZXIpOiB2b2lkIHtcbiAgY29uc3QgY29udHJvbHMgPSBwYXJlbnQuY29udHJvbHMgYXMge1trZXk6IHN0cmluZyB8IG51bWJlcl06IHVua25vd259O1xuICBjb25zdCBjb2xsZWN0aW9uID0gaXNHcm91cCA/IE9iamVjdC5rZXlzKGNvbnRyb2xzKSA6IGNvbnRyb2xzO1xuICBpZiAoIWNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcbiAgICAgIFJ1bnRpbWVFcnJvckNvZGUuTk9fQ09OVFJPTFMsXG4gICAgICB0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUgPyBub0NvbnRyb2xzRXJyb3IoaXNHcm91cCkgOiAnJyxcbiAgICApO1xuICB9XG4gIGlmICghY29udHJvbHNba2V5XSkge1xuICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXG4gICAgICBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfQ09OVFJPTCxcbiAgICAgIHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSA/IG1pc3NpbmdDb250cm9sRXJyb3IoaXNHcm91cCwga2V5KSA6ICcnLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEFsbFZhbHVlc1ByZXNlbnQoY29udHJvbDogYW55LCBpc0dyb3VwOiBib29sZWFuLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gIGNvbnRyb2wuX2ZvckVhY2hDaGlsZCgoXzogdW5rbm93biwga2V5OiBzdHJpbmcgfCBudW1iZXIpID0+IHtcbiAgICBpZiAodmFsdWVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfQ09OVFJPTF9WQUxVRSxcbiAgICAgICAgdHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlID8gbWlzc2luZ0NvbnRyb2xWYWx1ZUVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyxcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gSXNBbnkgY2hlY2tzIGlmIFQgaXMgYGFueWAsIGJ5IGNoZWNraW5nIGEgY29uZGl0aW9uIHRoYXQgY291bGRuJ3QgcG9zc2libHkgYmUgdHJ1ZSBvdGhlcndpc2UuXG5leHBvcnQgdHlwZSDJtUlzQW55PFQsIFksIE4+ID0gMCBleHRlbmRzIDEgJiBUID8gWSA6IE47XG5cbi8qKlxuICogYFR5cGVkT3JVbnR5cGVkYCBhbGxvd3Mgb25lIG9mIHR3byBkaWZmZXJlbnQgdHlwZXMgdG8gYmUgc2VsZWN0ZWQsIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBGb3Jtc1xuICogY2xhc3MgaXQncyBhcHBsaWVkIHRvIGlzIHR5cGVkIG9yIG5vdC5cbiAqXG4gKiBUaGlzIGlzIGZvciBpbnRlcm5hbCBBbmd1bGFyIHVzYWdlIHRvIHN1cHBvcnQgdHlwZWQgZm9ybXM7IGRvIG5vdCBkaXJlY3RseSB1c2UgaXQuXG4gKi9cbmV4cG9ydCB0eXBlIMm1VHlwZWRPclVudHlwZWQ8VCwgVHlwZWQsIFVudHlwZWQ+ID0gybVJc0FueTxULCBVbnR5cGVkLCBUeXBlZD47XG5cbi8qKlxuICogVmFsdWUgZ2l2ZXMgdGhlIHZhbHVlIHR5cGUgY29ycmVzcG9uZGluZyB0byBhIGNvbnRyb2wgdHlwZS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHJlc3VsdGluZyB0eXBlIHdpbGwgZm9sbG93IHRoZSBzYW1lIHJ1bGVzIGFzIGAudmFsdWVgIG9uIHlvdXIgY29udHJvbCwgZ3JvdXAsIG9yXG4gKiBhcnJheSwgaW5jbHVkaW5nIGB1bmRlZmluZWRgIGZvciBlYWNoIGdyb3VwIGVsZW1lbnQgd2hpY2ggbWlnaHQgYmUgZGlzYWJsZWQuXG4gKlxuICogSWYgeW91IGFyZSB0cnlpbmcgdG8gZXh0cmFjdCBhIHZhbHVlIHR5cGUgZm9yIGEgZGF0YSBtb2RlbCwgeW91IHByb2JhYmx5IHdhbnQge0BsaW5rIFJhd1ZhbHVlfSxcbiAqIHdoaWNoIHdpbGwgbm90IGhhdmUgYHVuZGVmaW5lZGAgaW4gZ3JvdXAga2V5cy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBgRm9ybUNvbnRyb2xgIHZhbHVlIHR5cGVcbiAqXG4gKiBZb3UgY2FuIGV4dHJhY3QgdGhlIHZhbHVlIHR5cGUgb2YgYSBzaW5nbGUgY29udHJvbDpcbiAqXG4gKiBgYGB0c1xuICogdHlwZSBOYW1lQ29udHJvbCA9IEZvcm1Db250cm9sPHN0cmluZz47XG4gKiB0eXBlIE5hbWVWYWx1ZSA9IFZhbHVlPE5hbWVDb250cm9sPjtcbiAqIGBgYFxuICpcbiAqIFRoZSByZXN1bHRpbmcgdHlwZSBpcyBgc3RyaW5nYC5cbiAqXG4gKiAjIyMgYEZvcm1Hcm91cGAgdmFsdWUgdHlwZVxuICpcbiAqIEltYWdpbmUgeW91IGhhdmUgYW4gaW50ZXJmYWNlIGRlZmluaW5nIHRoZSBjb250cm9scyBpbiB5b3VyIGdyb3VwLiBZb3UgY2FuIGV4dHJhY3QgdGhlIHNoYXBlIG9mXG4gKiB0aGUgdmFsdWVzIGFzIGZvbGxvd3M6XG4gKlxuICogYGBgdHNcbiAqIGludGVyZmFjZSBQYXJ0eUZvcm1Db250cm9scyB7XG4gKiAgIGFkZHJlc3M6IEZvcm1Db250cm9sPHN0cmluZz47XG4gKiB9XG4gKlxuICogLy8gVmFsdWUgb3BlcmF0ZXMgb24gY29udHJvbHM7IHRoZSBvYmplY3QgbXVzdCBiZSB3cmFwcGVkIGluIGEgRm9ybUdyb3VwLlxuICogdHlwZSBQYXJ0eUZvcm1WYWx1ZXMgPSBWYWx1ZTxGb3JtR3JvdXA8UGFydHlGb3JtQ29udHJvbHM+PjtcbiAqIGBgYFxuICpcbiAqIFRoZSByZXN1bHRpbmcgdHlwZSBpcyBge2FkZHJlc3M6IHN0cmluZ3x1bmRlZmluZWR9YC5cbiAqXG4gKiAjIyMgYEZvcm1BcnJheWAgdmFsdWUgdHlwZVxuICpcbiAqIFlvdSBjYW4gZXh0cmFjdCB2YWx1ZXMgZnJvbSBGb3JtQXJyYXlzIGFzIHdlbGw6XG4gKlxuICogYGBgdHNcbiAqIHR5cGUgR3Vlc3ROYW1lc0NvbnRyb2xzID0gRm9ybUFycmF5PEZvcm1Db250cm9sPHN0cmluZz4+O1xuICpcbiAqIHR5cGUgTmFtZXNWYWx1ZXMgPSBWYWx1ZTxHdWVzdE5hbWVzQ29udHJvbHM+O1xuICogYGBgXG4gKlxuICogVGhlIHJlc3VsdGluZyB0eXBlIGlzIGBzdHJpbmdbXWAuXG4gKlxuICogKipJbnRlcm5hbDogbm90IGZvciBwdWJsaWMgdXNlLioqXG4gKi9cbmV4cG9ydCB0eXBlIMm1VmFsdWU8VCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB8IHVuZGVmaW5lZD4gPVxuICBUIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sPGFueSwgYW55PiA/IFRbJ3ZhbHVlJ10gOiBuZXZlcjtcblxuLyoqXG4gKiBSYXdWYWx1ZSBnaXZlcyB0aGUgcmF3IHZhbHVlIHR5cGUgY29ycmVzcG9uZGluZyB0byBhIGNvbnRyb2wgdHlwZS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHJlc3VsdGluZyB0eXBlIHdpbGwgZm9sbG93IHRoZSBzYW1lIHJ1bGVzIGFzIGAuZ2V0UmF3VmFsdWUoKWAgb24geW91ciBjb250cm9sLFxuICogZ3JvdXAsIG9yIGFycmF5LiBUaGlzIG1lYW5zIHRoYXQgYWxsIGNvbnRyb2xzIGluc2lkZSBhIGdyb3VwIHdpbGwgYmUgcmVxdWlyZWQsIG5vdCBvcHRpb25hbCxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgZGlzYWJsZWQgc3RhdGUuXG4gKlxuICogWW91IG1heSBhbHNvIHdpc2ggdG8gdXNlIHtAbGluayDJtVZhbHVlfSwgd2hpY2ggd2lsbCBoYXZlIGB1bmRlZmluZWRgIGluIGdyb3VwIGtleXMgKHdoaWNoIGNhbiBiZVxuICogZGlzYWJsZWQpLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIGBGb3JtR3JvdXBgIHJhdyB2YWx1ZSB0eXBlXG4gKlxuICogSW1hZ2luZSB5b3UgaGF2ZSBhbiBpbnRlcmZhY2UgZGVmaW5pbmcgdGhlIGNvbnRyb2xzIGluIHlvdXIgZ3JvdXAuIFlvdSBjYW4gZXh0cmFjdCB0aGUgc2hhcGUgb2ZcbiAqIHRoZSByYXcgdmFsdWVzIGFzIGZvbGxvd3M6XG4gKlxuICogYGBgdHNcbiAqIGludGVyZmFjZSBQYXJ0eUZvcm1Db250cm9scyB7XG4gKiAgIGFkZHJlc3M6IEZvcm1Db250cm9sPHN0cmluZz47XG4gKiB9XG4gKlxuICogLy8gUmF3VmFsdWUgb3BlcmF0ZXMgb24gY29udHJvbHM7IHRoZSBvYmplY3QgbXVzdCBiZSB3cmFwcGVkIGluIGEgRm9ybUdyb3VwLlxuICogdHlwZSBQYXJ0eUZvcm1WYWx1ZXMgPSBSYXdWYWx1ZTxGb3JtR3JvdXA8UGFydHlGb3JtQ29udHJvbHM+PjtcbiAqIGBgYFxuICpcbiAqIFRoZSByZXN1bHRpbmcgdHlwZSBpcyBge2FkZHJlc3M6IHN0cmluZ31gLiAoTm90ZSB0aGUgYWJzZW5jZSBvZiBgdW5kZWZpbmVkYC4pXG4gKlxuICogICoqSW50ZXJuYWw6IG5vdCBmb3IgcHVibGljIHVzZS4qKlxuICovXG5leHBvcnQgdHlwZSDJtVJhd1ZhbHVlPFQgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wgfCB1bmRlZmluZWQ+ID1cbiAgVCBleHRlbmRzIEFic3RyYWN0Q29udHJvbDxhbnksIGFueT5cbiAgICA/IFRbJ3NldFZhbHVlJ10gZXh0ZW5kcyAodjogaW5mZXIgUikgPT4gdm9pZFxuICAgICAgPyBSXG4gICAgICA6IG5ldmVyXG4gICAgOiBuZXZlcjtcblxuLyoqXG4gKiBUb2tlbml6ZSBzcGxpdHMgYSBzdHJpbmcgbGl0ZXJhbCBTIGJ5IGEgZGVsaW1pdGVyIEQuXG4gKi9cbmV4cG9ydCB0eXBlIMm1VG9rZW5pemU8UyBleHRlbmRzIHN0cmluZywgRCBleHRlbmRzIHN0cmluZz4gPSBzdHJpbmcgZXh0ZW5kcyBTXG4gID8gc3RyaW5nW10gLyogUyBtdXN0IGJlIGEgbGl0ZXJhbCAqL1xuICA6IFMgZXh0ZW5kcyBgJHtpbmZlciBUfSR7RH0ke2luZmVyIFV9YFxuICAgID8gW1QsIC4uLsm1VG9rZW5pemU8VSwgRD5dXG4gICAgOiBbU10gLyogQmFzZSBjYXNlICovO1xuXG4vKipcbiAqIENvZXJjZVN0ckFyclRvTnVtQXJyIGFjY2VwdHMgYW4gYXJyYXkgb2Ygc3RyaW5ncywgYW5kIGNvbnZlcnRzIGFueSBudW1lcmljIHN0cmluZyB0byBhIG51bWJlci5cbiAqL1xuZXhwb3J0IHR5cGUgybVDb2VyY2VTdHJBcnJUb051bUFycjxTPiA9XG4gIC8vIEV4dHJhY3QgdGhlIGhlYWQgb2YgdGhlIGFycmF5LlxuICBTIGV4dGVuZHMgW2luZmVyIEhlYWQsIC4uLmluZmVyIFRhaWxdXG4gICAgPyAvLyBVc2luZyBhIHRlbXBsYXRlIGxpdGVyYWwgdHlwZSwgY29lcmNlIHRoZSBoZWFkIHRvIGBudW1iZXJgIGlmIHBvc3NpYmxlLlxuICAgICAgLy8gVGhlbiwgcmVjdXJzZSBvbiB0aGUgdGFpbC5cbiAgICAgIEhlYWQgZXh0ZW5kcyBgJHtudW1iZXJ9YFxuICAgICAgPyBbbnVtYmVyLCAuLi7JtUNvZXJjZVN0ckFyclRvTnVtQXJyPFRhaWw+XVxuICAgICAgOiBbSGVhZCwgLi4uybVDb2VyY2VTdHJBcnJUb051bUFycjxUYWlsPl1cbiAgICA6IFtdO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRha2VzIGEgdHlwZSBUIGFuZCBhbiBhcnJheSBLLCBhbmQgcmV0dXJucyB0aGUgdHlwZSBvZiBUW0tbMF1dW0tbMV1dW0tbMl1dLi4uXG4gKi9cbmV4cG9ydCB0eXBlIMm1TmF2aWdhdGU8XG4gIFQsXG4gIEsgZXh0ZW5kcyBBcnJheTxzdHJpbmcgfCBudW1iZXI+LFxuPiA9IFQgZXh0ZW5kcyBvYmplY3QgLyogVCBtdXN0IGJlIGluZGV4YWJsZSAob2JqZWN0IG9yIGFycmF5KSAqL1xuICA/IEsgZXh0ZW5kcyBbaW5mZXIgSGVhZCwgLi4uaW5mZXIgVGFpbF0gLyogU3BsaXQgSyBpbnRvIGhlYWQgYW5kIHRhaWwgKi9cbiAgICA/IEhlYWQgZXh0ZW5kcyBrZXlvZiBUIC8qIGhlYWQoSykgbXVzdCBpbmRleCBUICovXG4gICAgICA/IFRhaWwgZXh0ZW5kcyAoc3RyaW5nIHwgbnVtYmVyKVtdIC8qIHRhaWwoSykgbXVzdCBiZSBhbiBhcnJheSAqL1xuICAgICAgICA/IFtdIGV4dGVuZHMgVGFpbFxuICAgICAgICAgID8gVFtIZWFkXSAvKiBiYXNlIGNhc2U6IEsgY2FuIGJlIHNwbGl0LCBidXQgVGFpbCBpcyBlbXB0eSAqL1xuICAgICAgICAgIDogybVOYXZpZ2F0ZTxUW0hlYWRdLCBUYWlsPiAvKiBleHBsb3JlIFRbaGVhZChLKV0gYnkgdGFpbChLKSAqL1xuICAgICAgICA6IGFueSAvKiB0YWlsKEspIHdhcyBub3QgYW4gYXJyYXksIGdpdmUgdXAgKi9cbiAgICAgIDogbmV2ZXIgLyogaGVhZChLKSBkb2VzIG5vdCBpbmRleCBULCBnaXZlIHVwICovXG4gICAgOiBhbnkgLyogSyBjYW5ub3QgYmUgc3BsaXQsIGdpdmUgdXAgKi9cbiAgOiBhbnkgLyogVCBpcyBub3QgaW5kZXhhYmxlLCBnaXZlIHVwICovO1xuXG4vKipcbiAqIMm1V3JpdGVhYmxlIHJlbW92ZXMgcmVhZG9ubHkgZnJvbSBhbGwga2V5cy5cbiAqL1xuZXhwb3J0IHR5cGUgybVXcml0ZWFibGU8VD4gPSB7XG4gIC1yZWFkb25seSBbUCBpbiBrZXlvZiBUXTogVFtQXTtcbn07XG5cbi8qKlxuICogR2V0UHJvcGVydHkgdGFrZXMgYSB0eXBlIFQgYW5kIHNvbWUgcHJvcGVydHkgbmFtZXMgb3IgaW5kaWNlcyBLLlxuICogSWYgSyBpcyBhIGRvdC1zZXBhcmF0ZWQgc3RyaW5nLCBpdCBpcyB0b2tlbml6ZWQgaW50byBhbiBhcnJheSBiZWZvcmUgcHJvY2VlZGluZy5cbiAqIFRoZW4sIHRoZSB0eXBlIG9mIHRoZSBuZXN0ZWQgcHJvcGVydHkgYXQgSyBpcyBjb21wdXRlZDogVFtLWzBdXVtLWzFdXVtLWzJdXS4uLlxuICogVGhpcyB3b3JrcyB3aXRoIGJvdGggb2JqZWN0cywgd2hpY2ggYXJlIGluZGV4ZWQgYnkgcHJvcGVydHkgbmFtZSwgYW5kIGFycmF5cywgd2hpY2ggYXJlIGluZGV4ZWRcbiAqIG51bWVyaWNhbGx5LlxuICpcbiAqIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAqL1xuZXhwb3J0IHR5cGUgybVHZXRQcm9wZXJ0eTxULCBLPiA9XG4gIC8vIEsgaXMgYSBzdHJpbmdcbiAgSyBleHRlbmRzIHN0cmluZ1xuICAgID8gybVHZXRQcm9wZXJ0eTxULCDJtUNvZXJjZVN0ckFyclRvTnVtQXJyPMm1VG9rZW5pemU8SywgJy4nPj4+XG4gICAgOiAvLyBJcyBpdCBhbiBhcnJheVxuICAgICAgybVXcml0ZWFibGU8Sz4gZXh0ZW5kcyBBcnJheTxzdHJpbmcgfCBudW1iZXI+XG4gICAgICA/IMm1TmF2aWdhdGU8VCwgybVXcml0ZWFibGU8Sz4+XG4gICAgICA6IC8vIEZhbGwgdGhyb3VnaCBwZXJtaXNzaXZlbHkgaWYgd2UgY2FuJ3QgY2FsY3VsYXRlIHRoZSB0eXBlIG9mIEsuXG4gICAgICAgIGFueTtcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIEl0IHByb3ZpZGVzIHNvbWUgb2YgdGhlIHNoYXJlZCBiZWhhdmlvciB0aGF0IGFsbCBjb250cm9scyBhbmQgZ3JvdXBzIG9mIGNvbnRyb2xzIGhhdmUsIGxpa2VcbiAqIHJ1bm5pbmcgdmFsaWRhdG9ycywgY2FsY3VsYXRpbmcgc3RhdHVzLCBhbmQgcmVzZXR0aW5nIHN0YXRlLiBJdCBhbHNvIGRlZmluZXMgdGhlIHByb3BlcnRpZXNcbiAqIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBzdWItY2xhc3NlcywgbGlrZSBgdmFsdWVgLCBgdmFsaWRgLCBhbmQgYGRpcnR5YC4gSXQgc2hvdWxkbid0IGJlXG4gKiBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogVGhlIGZpcnN0IHR5cGUgcGFyYW1ldGVyIFRWYWx1ZSByZXByZXNlbnRzIHRoZSB2YWx1ZSB0eXBlIG9mIHRoZSBjb250cm9sIChgY29udHJvbC52YWx1ZWApLlxuICogVGhlIG9wdGlvbmFsIHR5cGUgcGFyYW1ldGVyIFRSYXdWYWx1ZSAgcmVwcmVzZW50cyB0aGUgcmF3IHZhbHVlIHR5cGUgKGBjb250cm9sLmdldFJhd1ZhbHVlKClgKS5cbiAqXG4gKiBAc2VlIFtGb3JtcyBHdWlkZV0oZ3VpZGUvZm9ybXMpXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvZm9ybXMvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIFtEeW5hbWljIEZvcm1zIEd1aWRlXShndWlkZS9mb3Jtcy9keW5hbWljLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbDxUVmFsdWUgPSBhbnksIFRSYXdWYWx1ZSBleHRlbmRzIFRWYWx1ZSA9IFRWYWx1ZT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgYSBjb250cm9sIGhhcyBpdHMgb3duIHBlbmRpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRpb24gaW4gcHJvZ3Jlc3MuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IGZhbHNlO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdUb3VjaGVkID0gZmFsc2U7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25Db2xsZWN0aW9uQ2hhbmdlID0gKCkgPT4ge307XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlT24/OiBGb3JtSG9va3M7XG5cbiAgcHJpdmF0ZSBfcGFyZW50OiBGb3JtR3JvdXAgfCBGb3JtQXJyYXkgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uOiBhbnk7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIHRoZSByZXN1bHQgb2YgbWVyZ2luZyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqIChjb21iaW5lZCB1c2luZyBgVmFsaWRhdG9ycy5jb21wb3NlYCkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcG9zZWRWYWxpZGF0b3JGbiE6IFZhbGlkYXRvckZuIHwgbnVsbDtcblxuICAvKipcbiAgICogQ29udGFpbnMgdGhlIHJlc3VsdCBvZiBtZXJnaW5nIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGludG8gYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uXG4gICAqIChjb21iaW5lZCB1c2luZyBgVmFsaWRhdG9ycy5jb21wb3NlQXN5bmNgKS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4hOiBBc3luY1ZhbGlkYXRvckZuIHwgbnVsbDtcblxuICAvKipcbiAgICogU3luY2hyb25vdXMgdmFsaWRhdG9ycyBhcyB0aGV5IHdlcmUgcHJvdmlkZWQ6XG4gICAqICAtIGluIGBBYnN0cmFjdENvbnRyb2xgIGNvbnN0cnVjdG9yXG4gICAqICAtIGFzIGFuIGFyZ3VtZW50IHdoaWxlIGNhbGxpbmcgYHNldFZhbGlkYXRvcnNgIGZ1bmN0aW9uXG4gICAqICAtIHdoaWxlIGNhbGxpbmcgdGhlIHNldHRlciBvbiB0aGUgYHZhbGlkYXRvcmAgZmllbGQgKGUuZy4gYGNvbnRyb2wudmFsaWRhdG9yID0gdmFsaWRhdG9yRm5gKVxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX3Jhd1ZhbGlkYXRvcnMhOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhcyB0aGV5IHdlcmUgcHJvdmlkZWQ6XG4gICAqICAtIGluIGBBYnN0cmFjdENvbnRyb2xgIGNvbnN0cnVjdG9yXG4gICAqICAtIGFzIGFuIGFyZ3VtZW50IHdoaWxlIGNhbGxpbmcgYHNldEFzeW5jVmFsaWRhdG9yc2AgZnVuY3Rpb25cbiAgICogIC0gd2hpbGUgY2FsbGluZyB0aGUgc2V0dGVyIG9uIHRoZSBgYXN5bmNWYWxpZGF0b3JgIGZpZWxkIChlLmcuIGBjb250cm9sLmFzeW5jVmFsaWRhdG9yID1cbiAgICogYXN5bmNWYWxpZGF0b3JGbmApXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3QXN5bmNWYWxpZGF0b3JzITogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiAqIEZvciBhIGBGb3JtQ29udHJvbGAsIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiAqIEZvciBhbiBlbmFibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gb2JqZWN0XG4gICAqIHdpdGggYSBrZXktdmFsdWUgcGFpciBmb3IgZWFjaCBtZW1iZXIgb2YgdGhlIGdyb3VwLlxuICAgKiAqIEZvciBhIGRpc2FibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGFsbCBjb250cm9scyBhcyBhbiBvYmplY3RcbiAgICogd2l0aCBhIGtleS12YWx1ZSBwYWlyIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgZ3JvdXAuXG4gICAqICogRm9yIGEgYEZvcm1BcnJheWAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBhcnJheS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZSE6IFRWYWx1ZTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQWJzdHJhY3RDb250cm9sIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgZnVuY3Rpb24gb3IgYXJyYXkgb2YgZnVuY3Rpb25zIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mXG4gICAqICAgICB0aGlzIGNvbnRyb2wgc3luY2hyb25vdXNseS5cbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9ycyBUaGUgZnVuY3Rpb24gb3IgYXJyYXkgb2YgZnVuY3Rpb25zIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdmFsaWRpdHkgb2ZcbiAgICogICAgIHRoaXMgY29udHJvbCBhc3luY2hyb25vdXNseS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGwsXG4gICAgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCxcbiAgKSB7XG4gICAgdGhpcy5fYXNzaWduVmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICB0aGlzLl9hc3NpZ25Bc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZiB0aGlzIGNvbnRyb2wgc3luY2hyb25vdXNseS5cbiAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBnZXQgdmFsaWRhdG9yKCk6IFZhbGlkYXRvckZuIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm47XG4gIH1cbiAgc2V0IHZhbGlkYXRvcih2YWxpZGF0b3JGbjogVmFsaWRhdG9yRm4gfCBudWxsKSB7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSB2YWxpZGF0b3JGbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZiB0aGlzIGNvbnRyb2wgYXN5bmNocm9ub3VzbHkuXG4gICAqIElmIG11bHRpcGxlIHZhbGlkYXRvcnMgaGF2ZSBiZWVuIGFkZGVkLCB0aGlzIHdpbGwgYmUgYSBzaW5nbGUgY29tcG9zZWQgZnVuY3Rpb24uXG4gICAqIFNlZSBgVmFsaWRhdG9ycy5jb21wb3NlKClgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgZ2V0IGFzeW5jVmFsaWRhdG9yKCk6IEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuO1xuICB9XG4gIHNldCBhc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvckZuOiBBc3luY1ZhbGlkYXRvckZuIHwgbnVsbCkge1xuICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGFzeW5jVmFsaWRhdG9yRm47XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBhcmVudCBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHBhcmVudCgpOiBGb3JtR3JvdXAgfCBGb3JtQXJyYXkgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgRm9ybUNvbnRyb2xTdGF0dXN9XG4gICAqXG4gICAqIFRoZXNlIHN0YXR1cyB2YWx1ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSwgc28gYSBjb250cm9sIGNhbm5vdCBiZVxuICAgKiBib3RoIHZhbGlkIEFORCBpbnZhbGlkIG9yIGludmFsaWQgQU5EIGRpc2FibGVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1cyE6IEZvcm1Db250cm9sU3RhdHVzO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgVkFMSURgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBwYXNzZWQgYWxsIG9mIGl0cyB2YWxpZGF0aW9uIHRlc3RzLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgdmFsaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBWQUxJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGludmFsaWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBJTlZBTElEYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIGNvbnRyb2wgaGFzIGZhaWxlZCBvbmUgb3IgbW9yZSBvZiBpdHMgdmFsaWRhdGlvbiBjaGVja3MsXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBpbnZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gSU5WQUxJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHBlbmRpbmdgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBQRU5ESU5HYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIGNvbnRyb2wgaXMgaW4gdGhlIHByb2Nlc3Mgb2YgY29uZHVjdGluZyBhIHZhbGlkYXRpb24gY2hlY2ssXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBwZW5kaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PSBQRU5ESU5HO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlzYWJsZWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIERpc2FibGVkIGNvbnRyb2xzIGFyZSBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogYXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZWlyIGFuY2VzdG9yXG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBESVNBQkxFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGVuYWJsZWRgIGFzIGxvbmcgYXMgaXRzIGBzdGF0dXNgIGlzIG5vdCBgRElTQUJMRURgLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBhbnkgc3RhdHVzIG90aGVyIHRoYW4gJ0RJU0FCTEVEJyxcbiAgICogZmFsc2UgaWYgdGhlIHN0YXR1cyBpcyAnRElTQUJMRUQnLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKi9cbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzICE9PSBESVNBQkxFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhbnkgZXJyb3JzIGdlbmVyYXRlZCBieSBmYWlsaW5nIHZhbGlkYXRpb24sXG4gICAqIG9yIG51bGwgaWYgdGhlcmUgYXJlIG5vIGVycm9ycy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlcnJvcnMhOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbDtcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBwcmlzdGluZWAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZFxuICAgKiB0aGUgdmFsdWUgaW4gdGhlIFVJLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWQgdGhlIHZhbHVlIGluIHRoZSBVSTsgY29tcGFyZSBgZGlydHlgLlxuICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmlzdGluZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlydHlgIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZVxuICAgKiBpbiB0aGUgVUkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlIG9mIHRoaXMgY29udHJvbCBpbiB0aGUgVUk7IGNvbXBhcmUgYHByaXN0aW5lYC5cbiAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBnZXQgZGlydHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnByaXN0aW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgbWFya2VkIGFzIGB0b3VjaGVkYC5cbiAgICpcbiAgICogQSBjb250cm9sIGlzIG1hcmtlZCBgdG91Y2hlZGAgb25jZSB0aGUgdXNlciBoYXMgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRvdWNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgbm90IGJlZW4gbWFya2VkIGFzIHRvdWNoZWRcbiAgICpcbiAgICogQSBjb250cm9sIGlzIGB1bnRvdWNoZWRgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IHRyaWdnZXJlZFxuICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICovXG4gIGdldCB1bnRvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnRvdWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogRXhwb3NlZCBhcyBvYnNlcnZhYmxlLCBzZWUgYmVsb3cuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVhZG9ubHkgX2V2ZW50cyA9IG5ldyBTdWJqZWN0PENvbnRyb2xFdmVudDxUVmFsdWU+PigpO1xuXG4gIC8qKlxuICAgKiBBIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgc3RhdGUgb2YgdGhlIGNvbnRyb2wgY2hhbmdlcy5cbiAgICogSXQgZW1pdHMgZm9yIHZhbHVlLCBzdGF0dXMsIHByaXN0aW5lIG9yIHRvdWNoZWQgY2hhbmdlcy5cbiAgICpcbiAgICogKipOb3RlKio6IE9uIHZhbHVlIGNoYW5nZSwgdGhlIGVtaXQgaGFwcGVucyByaWdodCBhZnRlciBhIHZhbHVlIG9mIHRoaXMgY29udHJvbCBpcyB1cGRhdGVkLiBUaGVcbiAgICogdmFsdWUgb2YgYSBwYXJlbnQgY29udHJvbCAoZm9yIGV4YW1wbGUgaWYgdGhpcyBGb3JtQ29udHJvbCBpcyBhIHBhcnQgb2YgYSBGb3JtR3JvdXApIGlzIHVwZGF0ZWRcbiAgICogbGF0ZXIsIHNvIGFjY2Vzc2luZyBhIHZhbHVlIG9mIGEgcGFyZW50IGNvbnRyb2wgKHVzaW5nIHRoZSBgdmFsdWVgIHByb3BlcnR5KSBmcm9tIHRoZSBjYWxsYmFja1xuICAgKiBvZiB0aGlzIGV2ZW50IG1pZ2h0IHJlc3VsdCBpbiBnZXR0aW5nIGEgdmFsdWUgdGhhdCBoYXMgbm90IGJlZW4gdXBkYXRlZCB5ZXQuIFN1YnNjcmliZSB0byB0aGVcbiAgICogYGV2ZW50c2Agb2YgdGhlIHBhcmVudCBjb250cm9sIGluc3RlYWQuXG4gICAqIEZvciBvdGhlciBldmVudCB0eXBlcywgdGhlIGV2ZW50cyBhcmUgZW1pdHRlZCBhZnRlciB0aGUgcGFyZW50IGNvbnRyb2wgaGFzIGJlZW4gdXBkYXRlZC5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBldmVudHMgPSB0aGlzLl9ldmVudHMuYXNPYnNlcnZhYmxlKCk7XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbCBjaGFuZ2VzLCBpblxuICAgKiB0aGUgVUkgb3IgcHJvZ3JhbW1hdGljYWxseS4gSXQgYWxzbyBlbWl0cyBhbiBldmVudCBlYWNoIHRpbWUgeW91IGNhbGwgZW5hYmxlKCkgb3IgZGlzYWJsZSgpXG4gICAqIHdpdGhvdXQgcGFzc2luZyBhbG9uZyB7ZW1pdEV2ZW50OiBmYWxzZX0gYXMgYSBmdW5jdGlvbiBhcmd1bWVudC5cbiAgICpcbiAgICogKipOb3RlKio6IHRoZSBlbWl0IGhhcHBlbnMgcmlnaHQgYWZ0ZXIgYSB2YWx1ZSBvZiB0aGlzIGNvbnRyb2wgaXMgdXBkYXRlZC4gVGhlIHZhbHVlIG9mIGFcbiAgICogcGFyZW50IGNvbnRyb2wgKGZvciBleGFtcGxlIGlmIHRoaXMgRm9ybUNvbnRyb2wgaXMgYSBwYXJ0IG9mIGEgRm9ybUdyb3VwKSBpcyB1cGRhdGVkIGxhdGVyLCBzb1xuICAgKiBhY2Nlc3NpbmcgYSB2YWx1ZSBvZiBhIHBhcmVudCBjb250cm9sICh1c2luZyB0aGUgYHZhbHVlYCBwcm9wZXJ0eSkgZnJvbSB0aGUgY2FsbGJhY2sgb2YgdGhpc1xuICAgKiBldmVudCBtaWdodCByZXN1bHQgaW4gZ2V0dGluZyBhIHZhbHVlIHRoYXQgaGFzIG5vdCBiZWVuIHVwZGF0ZWQgeWV0LiBTdWJzY3JpYmUgdG8gdGhlXG4gICAqIGB2YWx1ZUNoYW5nZXNgIGV2ZW50IG9mIHRoZSBwYXJlbnQgY29udHJvbCBpbnN0ZWFkLlxuICAgKlxuICAgKiBUT0RPOiB0aGlzIHNob3VsZCBiZSBwaXBlZCBmcm9tIGV2ZW50cygpIGJ1dCBpcyBicmVha2luZyBpbiBHM1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlQ2hhbmdlcyE6IE9ic2VydmFibGU8VFZhbHVlPjtcblxuICAvKipcbiAgICogQSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGV2ZW50IGV2ZXJ5IHRpbWUgdGhlIHZhbGlkYXRpb24gYHN0YXR1c2Agb2YgdGhlIGNvbnRyb2xcbiAgICogcmVjYWxjdWxhdGVzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBGb3JtQ29udHJvbFN0YXR1c31cbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogVE9ETzogdGhpcyBzaG91bGQgYmUgcGlwZWQgZnJvbSBldmVudHMoKSBidXQgaXMgYnJlYWtpbmcgaW4gRzNcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGF0dXNDaGFuZ2VzITogT2JzZXJ2YWJsZTxGb3JtQ29udHJvbFN0YXR1cz47XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgdGhlIHVwZGF0ZSBzdHJhdGVneSBvZiB0aGUgYEFic3RyYWN0Q29udHJvbGAgKG1lYW5pbmdcbiAgICogdGhlIGV2ZW50IG9uIHdoaWNoIHRoZSBjb250cm9sIHVwZGF0ZXMgaXRzZWxmKS5cbiAgICogUG9zc2libGUgdmFsdWVzOiBgJ2NoYW5nZSdgIHwgYCdibHVyJ2AgfCBgJ3N1Ym1pdCdgXG4gICAqIERlZmF1bHQgdmFsdWU6IGAnY2hhbmdlJ2BcbiAgICovXG4gIGdldCB1cGRhdGVPbigpOiBGb3JtSG9va3Mge1xuICAgIHJldHVybiB0aGlzLl91cGRhdGVPbiA/IHRoaXMuX3VwZGF0ZU9uIDogdGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC51cGRhdGVPbiA6ICdjaGFuZ2UnO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gIENhbGxpbmdcbiAgICogdGhpcyBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGFkZCBhIG5ldyB2YWxpZGF0b3Igd2l0aG91dCBhZmZlY3RpbmcgZXhpc3Rpbmcgb25lcywgY29uc2lkZXJcbiAgICogdXNpbmcgYGFkZFZhbGlkYXRvcnMoKWAgbWV0aG9kIGluc3RlYWQuXG4gICAqL1xuICBzZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuIENhbGxpbmcgdGhpc1xuICAgKiBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBhZGQgYSBuZXcgdmFsaWRhdG9yIHdpdGhvdXQgYWZmZWN0aW5nIGV4aXN0aW5nIG9uZXMsIGNvbnNpZGVyXG4gICAqIHVzaW5nIGBhZGRBc3luY1ZhbGlkYXRvcnMoKWAgbWV0aG9kIGluc3RlYWQuXG4gICAqL1xuICBzZXRBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9hc3NpZ25Bc3luY1ZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlciB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEFkZGluZyBhIHZhbGlkYXRvciB0aGF0IGFscmVhZHkgZXhpc3RzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIElmIGR1cGxpY2F0ZSB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqIGFyZSBwcmVzZW50IGluIHRoZSBgdmFsaWRhdG9yc2AgYXJyYXksIG9ubHkgdGhlIGZpcnN0IGluc3RhbmNlIHdvdWxkIGJlIGFkZGVkIHRvIGEgZm9ybVxuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IHZhbGlkYXRvciBmdW5jdGlvbiBvciBmdW5jdGlvbnMgdG8gYWRkIHRvIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGFkZFZhbGlkYXRvcnModmFsaWRhdG9yczogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWxpZGF0b3JzKGFkZFZhbGlkYXRvcnModmFsaWRhdG9ycywgdGhpcy5fcmF3VmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBhc3luY2hyb25vdXMgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlclxuICAgKiB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEFkZGluZyBhIHZhbGlkYXRvciB0aGF0IGFscmVhZHkgZXhpc3RzIHdpbGwgaGF2ZSBubyBlZmZlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBuZXcgYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBvciBmdW5jdGlvbnMgdG8gYWRkIHRvIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGFkZEFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRBc3luY1ZhbGlkYXRvcnMoYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnJvbSB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAqIFZhbGlkYXRvcnMgYXJlIGNvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZTsgeW91IG11c3QgcGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZVxuICAgKiB2YWxpZGF0b3IgZnVuY3Rpb24gYXMgdGhlIG9uZSB0aGF0IHdhcyBvcmlnaW5hbGx5IHNldC4gSWYgYSBwcm92aWRlZCB2YWxpZGF0b3IgaXMgbm90IGZvdW5kLFxuICAgKiBpdCBpcyBpZ25vcmVkLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgUmVmZXJlbmNlIHRvIGEgVmFsaWRhdG9yRm5cbiAgICpcbiAgICogYGBgXG4gICAqIC8vIFJlZmVyZW5jZSB0byB0aGUgUmVxdWlyZWRWYWxpZGF0b3JcbiAgICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbDxzdHJpbmcgfCBudWxsPignJywgVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gICAqIGN0cmwucmVtb3ZlVmFsaWRhdG9ycyhWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICpcbiAgICogLy8gUmVmZXJlbmNlIHRvIGFub255bW91cyBmdW5jdGlvbiBpbnNpZGUgTWluVmFsaWRhdG9yXG4gICAqIGNvbnN0IG1pblZhbGlkYXRvciA9IFZhbGlkYXRvcnMubWluKDMpO1xuICAgKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sPHN0cmluZyB8IG51bGw+KCcnLCBtaW5WYWxpZGF0b3IpO1xuICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IobWluVmFsaWRhdG9yKSkudG9FcXVhbCh0cnVlKVxuICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5taW4oMykpKS50b0VxdWFsKGZhbHNlKVxuICAgKlxuICAgKiBjdHJsLnJlbW92ZVZhbGlkYXRvcnMobWluVmFsaWRhdG9yKTtcbiAgICogYGBgXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVZhbGlkYXRvcnModmFsaWRhdG9yczogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWxpZGF0b3JzKHJlbW92ZVZhbGlkYXRvcnModmFsaWRhdG9ycywgdGhpcy5fcmF3VmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBhc3luY2hyb25vdXMgdmFsaWRhdG9yIGZyb20gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlciB2YWxpZGF0b3JzLlxuICAgKiBWYWxpZGF0b3JzIGFyZSBjb21wYXJlZCBieSBmdW5jdGlvbiByZWZlcmVuY2U7IHlvdSBtdXN0IHBhc3MgYSByZWZlcmVuY2UgdG8gdGhlIGV4YWN0IHNhbWVcbiAgICogdmFsaWRhdG9yIGZ1bmN0aW9uIGFzIHRoZSBvbmUgdGhhdCB3YXMgb3JpZ2luYWxseSBzZXQuIElmIGEgcHJvdmlkZWQgdmFsaWRhdG9yIGlzIG5vdCBmb3VuZCwgaXRcbiAgICogaXMgaWdub3JlZC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgYXN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRBc3luY1ZhbGlkYXRvcnMocmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGlzIHByZXNlbnQgb24gdGhpcyBjb250cm9sLiBUaGUgcHJvdmlkZWRcbiAgICogdmFsaWRhdG9yIG11c3QgYmUgYSByZWZlcmVuY2UgdG8gdGhlIGV4YWN0IHNhbWUgZnVuY3Rpb24gdGhhdCB3YXMgcHJvdmlkZWQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBSZWZlcmVuY2UgdG8gYSBWYWxpZGF0b3JGblxuICAgKlxuICAgKiBgYGBcbiAgICogLy8gUmVmZXJlbmNlIHRvIHRoZSBSZXF1aXJlZFZhbGlkYXRvclxuICAgKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sPG51bWJlciB8IG51bGw+KDAsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgKiBleHBlY3QoY3RybC5oYXNWYWxpZGF0b3IoVmFsaWRhdG9ycy5yZXF1aXJlZCkpLnRvRXF1YWwodHJ1ZSlcbiAgICpcbiAgICogLy8gUmVmZXJlbmNlIHRvIGFub255bW91cyBmdW5jdGlvbiBpbnNpZGUgTWluVmFsaWRhdG9yXG4gICAqIGNvbnN0IG1pblZhbGlkYXRvciA9IFZhbGlkYXRvcnMubWluKDMpO1xuICAgKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sPG51bWJlciB8IG51bGw+KDAsIG1pblZhbGlkYXRvcik7XG4gICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihtaW5WYWxpZGF0b3IpKS50b0VxdWFsKHRydWUpXG4gICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihWYWxpZGF0b3JzLm1pbigzKSkpLnRvRXF1YWwoZmFsc2UpXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSB2YWxpZGF0b3IgdG8gY2hlY2sgZm9yIHByZXNlbmNlLiBDb21wYXJlZCBieSBmdW5jdGlvbiByZWZlcmVuY2UuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIHByb3ZpZGVkIHZhbGlkYXRvciB3YXMgZm91bmQgb24gdGhpcyBjb250cm9sLlxuICAgKi9cbiAgaGFzVmFsaWRhdG9yKHZhbGlkYXRvcjogVmFsaWRhdG9yRm4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gaGFzVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMsIHZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBhbiBhc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGlzIHByZXNlbnQgb24gdGhpcyBjb250cm9sLiBUaGUgcHJvdmlkZWRcbiAgICogdmFsaWRhdG9yIG11c3QgYmUgYSByZWZlcmVuY2UgdG8gdGhlIGV4YWN0IHNhbWUgZnVuY3Rpb24gdGhhdCB3YXMgcHJvdmlkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3IgVGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgdG8gY2hlY2sgZm9yIHByZXNlbmNlLiBDb21wYXJlZCBieSBmdW5jdGlvblxuICAgKiAgICAgcmVmZXJlbmNlLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBwcm92aWRlZCBhc3luY2hyb25vdXMgdmFsaWRhdG9yIHdhcyBmb3VuZCBvbiB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBoYXNBc3luY1ZhbGlkYXRvcih2YWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm4pOiBib29sZWFuIHtcbiAgICByZXR1cm4gaGFzVmFsaWRhdG9yKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycywgdmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbXB0aWVzIG91dCB0aGUgc3luY2hyb25vdXMgdmFsaWRhdG9yIGxpc3QuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICovXG4gIGNsZWFyVmFsaWRhdG9ycygpOiB2b2lkIHtcbiAgICB0aGlzLnZhbGlkYXRvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRW1wdGllcyBvdXQgdGhlIGFzeW5jIHZhbGlkYXRvciBsaXN0LlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBjbGVhckFzeW5jVmFsaWRhdG9ycygpOiB2b2lkIHtcbiAgICB0aGlzLmFzeW5jVmFsaWRhdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdG91Y2hlZGAuIEEgY29udHJvbCBpcyB0b3VjaGVkIGJ5IGZvY3VzIGFuZFxuICAgKiBibHVyIGV2ZW50cyB0aGF0IGRvIG5vdCBjaGFuZ2UgdGhlIHZhbHVlLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNVbnRvdWNoZWQoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzRGlydHkoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzUHJpc3RpbmUoKX1cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBldmVudHNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYSBgVG91Y2hlZENoYW5nZUV2ZW50YCB3aXRoIHRoZSBgdG91Y2hlZGAgcHJvcGVydHkgYmVpbmcgYHRydWVgLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBtYXJrQXNUb3VjaGVkKG9wdHM/OiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgVXNlZCB0byBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkc1xuICAgKi9cbiAgbWFya0FzVG91Y2hlZChvcHRzPzoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbjtcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgIHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2w7XG4gIH0pOiB2b2lkO1xuICBtYXJrQXNUb3VjaGVkKFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9ID0ge30sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWQgPSB0aGlzLnRvdWNoZWQgPT09IGZhbHNlO1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS50b3VjaGVkID0gdHJ1ZTtcblxuICAgIGNvbnN0IHNvdXJjZUNvbnRyb2wgPSBvcHRzLnNvdXJjZUNvbnRyb2wgPz8gdGhpcztcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzVG91Y2hlZCh7Li4ub3B0cywgc291cmNlQ29udHJvbH0pO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VkICYmIG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFRvdWNoZWRDaGFuZ2VFdmVudCh0cnVlLCBzb3VyY2VDb250cm9sKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFuZCBhbGwgaXRzIGRlc2NlbmRhbnQgY29udHJvbHMgYXMgYHRvdWNoZWRgLlxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGEgYFRvdWNoZWRDaGFuZ2VFdmVudGAgd2l0aCB0aGUgYHRvdWNoZWRgIHByb3BlcnR5IGJlaW5nIGB0cnVlYC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgbWFya0FsbEFzVG91Y2hlZChvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMubWFya0FzVG91Y2hlZCh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnQsIHNvdXJjZUNvbnRyb2w6IHRoaXN9KTtcblxuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLm1hcmtBbGxBc1RvdWNoZWQob3B0cykpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB1bnRvdWNoZWRgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBhbHNvIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgdW50b3VjaGVkYFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgdG91Y2hlZGAgc3RhdHVzIG9mIGFsbCBwYXJlbnQgY29udHJvbHMuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1RvdWNoZWQoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzRGlydHkoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzUHJpc3RpbmUoKX1cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGEgYFRvdWNoZWRDaGFuZ2VFdmVudGAgd2l0aCB0aGUgYHRvdWNoZWRgIHByb3BlcnR5IGJlaW5nIGBmYWxzZWAuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIG1hcmtBc1VudG91Y2hlZChvcHRzPzoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICAvKipcbiAgICpcbiAgICogQGludGVybmFsIFVzZWQgdG8gcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHNcbiAgICovXG4gIG1hcmtBc1VudG91Y2hlZChvcHRzOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuO1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gICAgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbDtcbiAgfSk6IHZvaWQ7XG4gIG1hcmtBc1VudG91Y2hlZChcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkID0gdGhpcy50b3VjaGVkID09PSB0cnVlO1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS50b3VjaGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcblxuICAgIGNvbnN0IHNvdXJjZUNvbnRyb2wgPSBvcHRzLnNvdXJjZUNvbnRyb2wgPz8gdGhpcztcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgY29udHJvbC5tYXJrQXNVbnRvdWNoZWQoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50LCBzb3VyY2VDb250cm9sfSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQob3B0cywgc291cmNlQ29udHJvbCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWQgJiYgb3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgVG91Y2hlZENoYW5nZUV2ZW50KGZhbHNlLCBzb3VyY2VDb250cm9sKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBkaXJ0eWAuIEEgY29udHJvbCBiZWNvbWVzIGRpcnR5IHdoZW5cbiAgICogdGhlIGNvbnRyb2wncyB2YWx1ZSBpcyBjaGFuZ2VkIHRocm91Z2ggdGhlIFVJOyBjb21wYXJlIGBtYXJrQXNUb3VjaGVkYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbWFya0FzVG91Y2hlZCgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNVbnRvdWNoZWQoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzUHJpc3RpbmUoKX1cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBldmVudHNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYSBgUHJpc3RpbmVDaGFuZ2VFdmVudGAgd2l0aCB0aGUgYHByaXN0aW5lYCBwcm9wZXJ0eSBiZWluZyBgZmFsc2VgLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBtYXJrQXNEaXJ0eShvcHRzPzoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICAvKipcbiAgICogQGludGVybmFsIFVzZWQgdG8gcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHNcbiAgICovXG4gIG1hcmtBc0RpcnR5KG9wdHM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgICBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sO1xuICB9KTogdm9pZDtcbiAgbWFya0FzRGlydHkoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0gPSB7fSxcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZCA9IHRoaXMucHJpc3RpbmUgPT09IHRydWU7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnByaXN0aW5lID0gZmFsc2U7XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc0RpcnR5KHsuLi5vcHRzLCBzb3VyY2VDb250cm9sfSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWQgJiYgb3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgUHJpc3RpbmVDaGFuZ2VFdmVudChmYWxzZSwgc291cmNlQ29udHJvbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcHJpc3RpbmVgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHByaXN0aW5lYCxcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHByaXN0aW5lYCBzdGF0dXMgb2YgYWxsIHBhcmVudFxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbWFya0FzVG91Y2hlZCgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNVbnRvdWNoZWQoKX1cbiAgICogQHNlZSB7QGxpbmsgbWFya0FzRGlydHkoKX1cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBlbWl0cyBldmVudHMgYWZ0ZXJcbiAgICogbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGEgYFByaXN0aW5lQ2hhbmdlRXZlbnRgIHdpdGggdGhlIGBwcmlzdGluZWAgcHJvcGVydHkgYmVpbmcgYHRydWVgLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBtYXJrQXNQcmlzdGluZShvcHRzPzoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICAvKipcbiAgICogQGludGVybmFsIFVzZWQgdG8gcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHNcbiAgICovXG4gIG1hcmtBc1ByaXN0aW5lKG9wdHM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgICBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sO1xuICB9KTogdm9pZDtcbiAgbWFya0FzUHJpc3RpbmUoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0gPSB7fSxcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZCA9IHRoaXMucHJpc3RpbmUgPT09IGZhbHNlO1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5wcmlzdGluZSA9IHRydWU7XG4gICAgdGhpcy5fcGVuZGluZ0RpcnR5ID0gZmFsc2U7XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIC8qKiBXZSBkb24ndCBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkcyAqL1xuICAgICAgY29udHJvbC5tYXJrQXNQcmlzdGluZSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUob3B0cywgc291cmNlQ29udHJvbCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWQgJiYgb3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgUHJpc3RpbmVDaGFuZ2VFdmVudCh0cnVlLCBzb3VyY2VDb250cm9sKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwZW5kaW5nYC5cbiAgICpcbiAgICogQSBjb250cm9sIGlzIHBlbmRpbmcgd2hpbGUgdGhlIGNvbnRyb2wgcGVyZm9ybXMgYXN5bmMgdmFsaWRhdGlvbi5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGFuIGV2ZW50IHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgdGhlIGNvbnRyb2wgaXMgbWFya2VkIHBlbmRpbmdcbiAgICogYW5kIHRoZSBgZXZlbnRzYCBvYnNlcnZhYmxlIGVtaXRzIGEgYFN0YXR1c0NoYW5nZUV2ZW50YCB3aXRoIHRoZSBgc3RhdHVzYCBwcm9wZXJ0eSBiZWluZ1xuICAgKiBgUEVORElOR2AgV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKlxuICAgKi9cbiAgbWFya0FzUGVuZGluZyhvcHRzPzoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICAvKipcbiAgICogQGludGVybmFsIFVzZWQgdG8gcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHNcbiAgICovXG4gIG1hcmtBc1BlbmRpbmcob3B0czoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbjtcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgIHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2w7XG4gIH0pOiB2b2lkO1xuICBtYXJrQXNQZW5kaW5nKFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9ID0ge30sXG4gICk6IHZvaWQge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdGF0dXMgPSBQRU5ESU5HO1xuXG4gICAgY29uc3Qgc291cmNlQ29udHJvbCA9IG9wdHMuc291cmNlQ29udHJvbCA/PyB0aGlzO1xuICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBTdGF0dXNDaGFuZ2VFdmVudCh0aGlzLnN0YXR1cywgc291cmNlQ29udHJvbCkpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzUGVuZGluZyh7Li4ub3B0cywgc291cmNlQ29udHJvbH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogZXhjbHVkZWQgZnJvbSB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGFueSBwYXJlbnQuIEl0cyBzdGF0dXMgaXMgYERJU0FCTEVEYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGFsc28gZGlzYWJsZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYCxcbiAgICogYHZhbHVlQ2hhbmdlc2AgYW5kIGBldmVudHNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIGRpc2FibGUob3B0cz86IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbCBVc2VkIHRvIHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzXG4gICAqL1xuICBkaXNhYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9KTogdm9pZDtcbiAgZGlzYWJsZShcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAvLyBwYXJlbnQncyBkaXJ0aW5lc3MgYmFzZWQgb24gdGhlIGNoaWxkcmVuLlxuICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG5cbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gRElTQUJMRUQ7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLmVycm9ycyA9IG51bGw7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIC8qKiBXZSBkb24ndCBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkcyAqL1xuICAgICAgY29udHJvbC5kaXNhYmxlKHsuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFZhbHVlQ2hhbmdlRXZlbnQodGhpcy52YWx1ZSwgc291cmNlQ29udHJvbCkpO1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFN0YXR1c0NoYW5nZUV2ZW50KHRoaXMuc3RhdHVzLCBzb3VyY2VDb250cm9sKSk7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPFRWYWx1ZT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUFuY2VzdG9ycyh7Li4ub3B0cywgc2tpcFByaXN0aW5lQ2hlY2t9LCB0aGlzKTtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLmZvckVhY2goKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbih0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBpbmNsdWRlZCBpbiB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBpdHMgcGFyZW50LiBJdHMgc3RhdHVzIHJlY2FsY3VsYXRlcyBiYXNlZCBvbiBpdHMgdmFsdWUgYW5kXG4gICAqIGl0cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpZiB0aGUgY29udHJvbCBoYXMgY2hpbGRyZW4sIGFsbCBjaGlsZHJlbiBhcmUgZW5hYmxlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBjb250cm9sIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyB3aGVuIG1hcmtlZCBhcyB1bnRvdWNoZWRcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgLFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBhbmQgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyBlbmFibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBlbmFibGUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIC8vIElmIHBhcmVudCBoYXMgYmVlbiBtYXJrZWQgYXJ0aWZpY2lhbGx5IGRpcnR5IHdlIGRvbid0IHdhbnQgdG8gcmUtY2FsY3VsYXRlIHRoZVxuICAgIC8vIHBhcmVudCdzIGRpcnRpbmVzcyBiYXNlZCBvbiB0aGUgY2hpbGRyZW4uXG4gICAgY29uc3Qgc2tpcFByaXN0aW5lQ2hlY2sgPSB0aGlzLl9wYXJlbnRNYXJrZWREaXJ0eShvcHRzLm9ubHlTZWxmKTtcblxuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdGF0dXMgPSBWQUxJRDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgY29udHJvbC5lbmFibGUoey4uLm9wdHMsIG9ubHlTZWxmOiB0cnVlfSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlQW5jZXN0b3JzKHsuLi5vcHRzLCBza2lwUHJpc3RpbmVDaGVja30sIHRoaXMpO1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKGZhbHNlKSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVBbmNlc3RvcnMoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc2tpcFByaXN0aW5lQ2hlY2s/OiBib29sZWFufSxcbiAgICBzb3VyY2VDb250cm9sOiBBYnN0cmFjdENvbnRyb2wsXG4gICk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHMpO1xuICAgICAgaWYgKCFvcHRzLnNraXBQcmlzdGluZUNoZWNrKSB7XG4gICAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUoe30sIHNvdXJjZUNvbnRyb2wpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKHt9LCBzb3VyY2VDb250cm9sKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcGFyZW50IG9mIHRoZSBjb250cm9sXG4gICAqXG4gICAqIEBwYXJhbSBwYXJlbnQgVGhlIG5ldyBwYXJlbnQuXG4gICAqL1xuICBzZXRQYXJlbnQocGFyZW50OiBGb3JtR3JvdXAgfCBGb3JtQXJyYXkgfCBudWxsKTogdm9pZCB7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHNldFZhbHVlKHZhbHVlOiBUUmF3VmFsdWUsIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCBwYXRjaFZhbHVlKHZhbHVlOiBUVmFsdWUsIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3QgcmVzZXQodmFsdWU/OiBUVmFsdWUsIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBUaGUgcmF3IHZhbHVlIG9mIHRoaXMgY29udHJvbC4gRm9yIG1vc3QgY29udHJvbCBpbXBsZW1lbnRhdGlvbnMsIHRoZSByYXcgdmFsdWUgd2lsbCBpbmNsdWRlXG4gICAqIGRpc2FibGVkIGNoaWxkcmVuLlxuICAgKi9cbiAgZ2V0UmF3VmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaXQgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgaXRzIGFuY2VzdG9ycy5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHNcbiAgICogYWZ0ZXIgdXBkYXRlcyBhbmQgdmFsaWRpdHkgY2hlY2tzIGFyZSBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgb25seSB1cGRhdGUgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogdXBkYXRlIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2AsXG4gICAqIGB2YWx1ZUNoYW5nZXNgIGFuZCBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cz86IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbCBVc2VkIHRvIHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzXG4gICAqL1xuICB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgICBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sO1xuICB9KTogdm9pZDtcbiAgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eShcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJbml0aWFsU3RhdHVzKCk7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcblxuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuX2NhbmNlbEV4aXN0aW5nU3Vic2NyaXB0aW9uKCk7XG4gICAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuZXJyb3JzID0gdGhpcy5fcnVuVmFsaWRhdG9yKCk7XG4gICAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG5cbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gVkFMSUQgfHwgdGhpcy5zdGF0dXMgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgdGhpcy5fcnVuQXN5bmNWYWxpZGF0b3Iob3B0cy5lbWl0RXZlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZUNvbnRyb2wgPSBvcHRzLnNvdXJjZUNvbnRyb2wgPz8gdGhpcztcbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgVmFsdWVDaGFuZ2VFdmVudDxUVmFsdWU+KHRoaXMudmFsdWUsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBTdGF0dXNDaGFuZ2VFdmVudCh0aGlzLnN0YXR1cywgc291cmNlQ29udHJvbCkpO1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxUVmFsdWU+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7Li4ub3B0cywgc291cmNlQ29udHJvbH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRyZWVWYWxpZGl0eShvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7ZW1pdEV2ZW50OiB0cnVlfSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY3RybDogQWJzdHJhY3RDb250cm9sKSA9PiBjdHJsLl91cGRhdGVUcmVlVmFsaWRpdHkob3B0cykpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnR9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldEluaXRpYWxTdGF0dXMoKSB7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnN0YXR1cyA9IHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSA/IERJU0FCTEVEIDogVkFMSUQ7XG4gIH1cblxuICBwcml2YXRlIF9ydW5WYWxpZGF0b3IoKTogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRvciA/IHRoaXMudmFsaWRhdG9yKHRoaXMpIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX3J1bkFzeW5jVmFsaWRhdG9yKGVtaXRFdmVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hc3luY1ZhbGlkYXRvcikge1xuICAgICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnN0YXR1cyA9IFBFTkRJTkc7XG4gICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSB0cnVlO1xuICAgICAgY29uc3Qgb2JzID0gdG9PYnNlcnZhYmxlKHRoaXMuYXN5bmNWYWxpZGF0b3IodGhpcykpO1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uID0gb2JzLnN1YnNjcmliZSgoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCkgPT4ge1xuICAgICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBmYWxzZTtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRyaWdnZXIgdGhlIHJlY2FsY3VsYXRpb24gb2YgdGhlIHZhbGlkYXRpb24gc3RhdHVzLCB3aGljaCBkZXBlbmRzIG9uXG4gICAgICAgIC8vIHRoZSBzdGF0ZSBvZiB0aGUgYXN5bmNocm9ub3VzIHZhbGlkYXRpb24gKHdoZXRoZXIgaXQgaXMgaW4gcHJvZ3Jlc3Mgb3Igbm90KS4gU28sIGl0IGlzXG4gICAgICAgIC8vIG5lY2Vzc2FyeSB0aGF0IHdlIGhhdmUgdXBkYXRlZCB0aGUgYF9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3JgIGJvb2xlYW4gZmxhZyBmaXJzdC5cbiAgICAgICAgdGhpcy5zZXRFcnJvcnMoZXJyb3JzLCB7ZW1pdEV2ZW50fSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGVycm9ycyBvbiBhIGZvcm0gY29udHJvbCB3aGVuIHJ1bm5pbmcgdmFsaWRhdGlvbnMgbWFudWFsbHksIHJhdGhlciB0aGFuIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIENhbGxpbmcgYHNldEVycm9yc2AgYWxzbyB1cGRhdGVzIHRoZSB2YWxpZGl0eSBvZiB0aGUgcGFyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgZXJyb3JzIGFyZSBzZXQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGFuIGV2ZW50IGFmdGVyIHRoZSBlcnJvcnMgYXJlIHNldC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIE1hbnVhbGx5IHNldCB0aGUgZXJyb3JzIGZvciBhIGNvbnRyb2xcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGxvZ2luID0gbmV3IEZvcm1Db250cm9sKCdzb21lTG9naW4nKTtcbiAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAqIGV4cGVjdChsb2dpbi5lcnJvcnMpLnRvRXF1YWwoeyBub3RVbmlxdWU6IHRydWUgfSk7XG4gICAqXG4gICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc2V0RXJyb3JzKGVycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwsIG9wdHM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLmVycm9ycyA9IGVycm9ycztcbiAgICB0aGlzLl91cGRhdGVDb250cm9sc0Vycm9ycyhvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UsIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIGNoaWxkIGNvbnRyb2wgZ2l2ZW4gdGhlIGNvbnRyb2wncyBuYW1lIG9yIHBhdGguXG4gICAqXG4gICAqIFRoaXMgc2lnbmF0dXJlIGZvciBnZXQgc3VwcG9ydHMgc3RyaW5ncyBhbmQgYGNvbnN0YCBhcnJheXMgKGAuZ2V0KFsnZm9vJywgJ2JhciddIGFzIGNvbnN0KWApLlxuICAgKi9cbiAgZ2V0PFAgZXh0ZW5kcyBzdHJpbmcgfCByZWFkb25seSAoc3RyaW5nIHwgbnVtYmVyKVtdPihcbiAgICBwYXRoOiBQLFxuICApOiBBYnN0cmFjdENvbnRyb2w8ybVHZXRQcm9wZXJ0eTxUUmF3VmFsdWUsIFA+PiB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIGNoaWxkIGNvbnRyb2wgZ2l2ZW4gdGhlIGNvbnRyb2wncyBuYW1lIG9yIHBhdGguXG4gICAqXG4gICAqIFRoaXMgc2lnbmF0dXJlIGZvciBgZ2V0YCBzdXBwb3J0cyBub24tY29uc3QgKG11dGFibGUpIGFycmF5cy4gSW5mZXJyZWQgdHlwZVxuICAgKiBpbmZvcm1hdGlvbiB3aWxsIG5vdCBiZSBhcyByb2J1c3QsIHNvIHByZWZlciB0byBwYXNzIGEgYHJlYWRvbmx5YCBhcnJheSBpZiBwb3NzaWJsZS5cbiAgICovXG4gIGdldDxQIGV4dGVuZHMgc3RyaW5nIHwgQXJyYXk8c3RyaW5nIHwgbnVtYmVyPj4oXG4gICAgcGF0aDogUCxcbiAgKTogQWJzdHJhY3RDb250cm9sPMm1R2V0UHJvcGVydHk8VFJhd1ZhbHVlLCBQPj4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBBIGRvdC1kZWxpbWl0ZWQgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZy9udW1iZXIgdmFsdWVzIHRoYXQgZGVmaW5lIHRoZSBwYXRoIHRvIHRoZVxuICAgKiBjb250cm9sLiBJZiBhIHN0cmluZyBpcyBwcm92aWRlZCwgcGFzc2luZyBpdCBhcyBhIHN0cmluZyBsaXRlcmFsIHdpbGwgcmVzdWx0IGluIGltcHJvdmVkIHR5cGVcbiAgICogaW5mb3JtYXRpb24uIExpa2V3aXNlLCBpZiBhbiBhcnJheSBpcyBwcm92aWRlZCwgcGFzc2luZyBpdCBgYXMgY29uc3RgIHdpbGwgY2F1c2UgaW1wcm92ZWQgdHlwZVxuICAgKiBpbmZvcm1hdGlvbiB0byBiZSBhdmFpbGFibGUuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBSZXRyaWV2ZSBhIG5lc3RlZCBjb250cm9sXG4gICAqXG4gICAqIEZvciBleGFtcGxlLCB0byBnZXQgYSBgbmFtZWAgY29udHJvbCBuZXN0ZWQgd2l0aGluIGEgYHBlcnNvbmAgc3ViLWdyb3VwOlxuICAgKlxuICAgKiAqIGB0aGlzLmZvcm0uZ2V0KCdwZXJzb24ubmFtZScpO2BcbiAgICpcbiAgICogLU9SLVxuICAgKlxuICAgKiAqIGB0aGlzLmZvcm0uZ2V0KFsncGVyc29uJywgJ25hbWUnXSBhcyBjb25zdCk7YCAvLyBgYXMgY29uc3RgIGdpdmVzIGltcHJvdmVkIHR5cGluZ3NcbiAgICpcbiAgICogIyMjIFJldHJpZXZlIGEgY29udHJvbCBpbiBhIEZvcm1BcnJheVxuICAgKlxuICAgKiBXaGVuIGFjY2Vzc2luZyBhbiBlbGVtZW50IGluc2lkZSBhIEZvcm1BcnJheSwgeW91IGNhbiB1c2UgYW4gZWxlbWVudCBpbmRleC5cbiAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBwcmljZWAgY29udHJvbCBmcm9tIHRoZSBmaXJzdCBlbGVtZW50IGluIGFuIGBpdGVtc2AgYXJyYXkgeW91IGNhbiB1c2U6XG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoJ2l0ZW1zLjAucHJpY2UnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ2l0ZW1zJywgMCwgJ3ByaWNlJ10pO2BcbiAgICovXG4gIGdldDxQIGV4dGVuZHMgc3RyaW5nIHwgKHN0cmluZyB8IG51bWJlcilbXT4oXG4gICAgcGF0aDogUCxcbiAgKTogQWJzdHJhY3RDb250cm9sPMm1R2V0UHJvcGVydHk8VFJhd1ZhbHVlLCBQPj4gfCBudWxsIHtcbiAgICBsZXQgY3VyclBhdGg6IEFycmF5PHN0cmluZyB8IG51bWJlcj4gfCBzdHJpbmcgPSBwYXRoO1xuICAgIGlmIChjdXJyUGF0aCA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY3VyclBhdGgpKSBjdXJyUGF0aCA9IGN1cnJQYXRoLnNwbGl0KCcuJyk7XG4gICAgaWYgKGN1cnJQYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGN1cnJQYXRoLnJlZHVjZShcbiAgICAgIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wgfCBudWxsLCBuYW1lKSA9PiBjb250cm9sICYmIGNvbnRyb2wuX2ZpbmQobmFtZSksXG4gICAgICB0aGlzLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogQHJldHVybnMgZXJyb3IgZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIGVycm9yLiBJZiB0aGUgY29udHJvbCBvciBlcnJvciBpcyBub3QgcHJlc2VudCxcbiAgICogbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIGdldEVycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogQXJyYXk8c3RyaW5nIHwgbnVtYmVyPiB8IHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgY29udHJvbCA9IHBhdGggPyB0aGlzLmdldChwYXRoKSA6IHRoaXM7XG4gICAgcmV0dXJuIGNvbnRyb2wgJiYgY29udHJvbC5lcnJvcnMgPyBjb250cm9sLmVycm9yc1tlcnJvckNvZGVdIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICogdG8gdGhlIGNvbnRyb2wgdGhhdCBzaG91bGQgYmUgcXVlcmllZCBmb3IgZXJyb3JzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgYEZvcm1Hcm91cGA6XG4gICAqXG4gICAqIGBgYFxuICAgKiBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgKlxuICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgKlxuICAgKiAxLiBBbiBhcnJheSBvZiBzdHJpbmcgY29udHJvbCBuYW1lcywgZS5nLiBgWydhZGRyZXNzJywgJ3N0cmVldCddYFxuICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAqXG4gICAqIElmIG5vIHBhdGggaXMgZ2l2ZW4sIHRoaXMgbWV0aG9kIGNoZWNrcyBmb3IgdGhlIGVycm9yIG9uIHRoZSBjdXJyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVycm9yIGlzIHByZXNlbnQgaW4gdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIHBhdGguXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBmYWxzZSBpcyByZXR1cm5lZC5cbiAgICovXG4gIGhhc0Vycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogQXJyYXk8c3RyaW5nIHwgbnVtYmVyPiB8IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuZ2V0RXJyb3IoZXJyb3JDb2RlLCBwYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgdGhlIHRvcC1sZXZlbCBhbmNlc3RvciBvZiB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBnZXQgcm9vdCgpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgIGxldCB4OiBBYnN0cmFjdENvbnRyb2wgPSB0aGlzO1xuXG4gICAgd2hpbGUgKHguX3BhcmVudCkge1xuICAgICAgeCA9IHguX3BhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKGVtaXRFdmVudDogYm9vbGVhbiwgY2hhbmdlZENvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcblxuICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPEZvcm1Db250cm9sU3RhdHVzPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgU3RhdHVzQ2hhbmdlRXZlbnQodGhpcy5zdGF0dXMsIGNoYW5nZWRDb250cm9sKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQsIGNoYW5nZWRDb250cm9sKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9pbml0T2JzZXJ2YWJsZXMoKSB7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnZhbHVlQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVN0YXR1cygpOiBGb3JtQ29udHJvbFN0YXR1cyB7XG4gICAgaWYgKHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSkgcmV0dXJuIERJU0FCTEVEO1xuICAgIGlmICh0aGlzLmVycm9ycykgcmV0dXJuIElOVkFMSUQ7XG4gICAgaWYgKHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciB8fCB0aGlzLl9hbnlDb250cm9sc0hhdmVTdGF0dXMoUEVORElORykpIHJldHVybiBQRU5ESU5HO1xuICAgIGlmICh0aGlzLl9hbnlDb250cm9sc0hhdmVTdGF0dXMoSU5WQUxJRCkpIHJldHVybiBJTlZBTElEO1xuICAgIHJldHVybiBWQUxJRDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX3VwZGF0ZVZhbHVlKCk6IHZvaWQ7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfZm9yRWFjaENoaWxkKGNiOiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiB2b2lkKTogdm9pZDtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9hbnlDb250cm9scyhjb25kaXRpb246IChjOiBBYnN0cmFjdENvbnRyb2wpID0+IGJvb2xlYW4pOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNIYXZlU3RhdHVzKHN0YXR1czogRm9ybUNvbnRyb2xTdGF0dXMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5zdGF0dXMgPT09IHN0YXR1cyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc0RpcnR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLmRpcnR5KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzVG91Y2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC50b3VjaGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVByaXN0aW5lKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59LCBjaGFuZ2VkQ29udHJvbDogQWJzdHJhY3RDb250cm9sKTogdm9pZCB7XG4gICAgY29uc3QgbmV3UHJpc3RpbmUgPSAhdGhpcy5fYW55Q29udHJvbHNEaXJ0eSgpO1xuICAgIGNvbnN0IGNoYW5nZWQgPSB0aGlzLnByaXN0aW5lICE9PSBuZXdQcmlzdGluZTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikucHJpc3RpbmUgPSBuZXdQcmlzdGluZTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUob3B0cywgY2hhbmdlZENvbnRyb2wpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgUHJpc3RpbmVDaGFuZ2VFdmVudCh0aGlzLnByaXN0aW5lLCBjaGFuZ2VkQ29udHJvbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRvdWNoZWQob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSwgY2hhbmdlZENvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS50b3VjaGVkID0gdGhpcy5fYW55Q29udHJvbHNUb3VjaGVkKCk7XG4gICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFRvdWNoZWRDaGFuZ2VFdmVudCh0aGlzLnRvdWNoZWQsIGNoYW5nZWRDb250cm9sKSk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQob3B0cywgY2hhbmdlZENvbnRyb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uRGlzYWJsZWRDaGFuZ2U6IEFycmF5PChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB2b2lkPiA9IFtdO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcGRhdGVTdHJhdGVneShvcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoaXNPcHRpb25zT2JqKG9wdHMpICYmIG9wdHMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdXBkYXRlT24gPSBvcHRzLnVwZGF0ZU9uITtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9wYXJlbnRNYXJrZWREaXJ0eShvbmx5U2VsZj86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJlbnREaXJ0eSA9IHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuZGlydHk7XG4gICAgcmV0dXJuICFvbmx5U2VsZiAmJiAhIXBhcmVudERpcnR5ICYmICF0aGlzLl9wYXJlbnQhLl9hbnlDb250cm9sc0RpcnR5KCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9maW5kKG5hbWU6IHN0cmluZyB8IG51bWJlcik6IEFic3RyYWN0Q29udHJvbCB8IG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgc2V0VmFsaWRhdG9yc2AgbWV0aG9kLiBOZWVkcyB0byBiZSBzZXBhcmF0ZWQgb3V0IGludG8gYVxuICAgKiBkaWZmZXJlbnQgbWV0aG9kLCBiZWNhdXNlIGl0IGlzIGNhbGxlZCBpbiB0aGUgY29uc3RydWN0b3IgYW5kIGl0IGNhbiBicmVhayBjYXNlcyB3aGVyZVxuICAgKiBhIGNvbnRyb2wgaXMgZXh0ZW5kZWQuXG4gICAqL1xuICBwcml2YXRlIF9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JzKSA/IHZhbGlkYXRvcnMuc2xpY2UoKSA6IHZhbGlkYXRvcnM7XG4gICAgdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IGNvZXJjZVRvVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgc2V0QXN5bmNWYWxpZGF0b3JzYCBtZXRob2QuIE5lZWRzIHRvIGJlIHNlcGFyYXRlZCBvdXQgaW50byBhXG4gICAqIGRpZmZlcmVudCBtZXRob2QsIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGluIHRoZSBjb25zdHJ1Y3RvciBhbmQgaXQgY2FuIGJyZWFrIGNhc2VzIHdoZXJlXG4gICAqIGEgY29udHJvbCBpcyBleHRlbmRlZC5cbiAgICovXG4gIHByaXZhdGUgX2Fzc2lnbkFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzLnNsaWNlKCkgOiB2YWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IodGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxufVxuIl19