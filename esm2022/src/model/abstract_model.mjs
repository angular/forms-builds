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
         * It also stores if the control should emit events when the validation status changes.
         *
         * @internal
         */
        this._hasOwnPendingAsyncValidator = null;
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
            const shouldHaveEmitted = this._cancelExistingSubscription();
            this.errors = this._runValidator();
            this.status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                // If the canceled subscription should have emitted
                // we make sure the async validator emits the status change on completion
                this._runAsyncValidator(shouldHaveEmitted, opts.emitEvent);
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
    _runAsyncValidator(shouldHaveEmitted, emitEvent) {
        if (this.asyncValidator) {
            this.status = PENDING;
            this._hasOwnPendingAsyncValidator = { emitEvent: emitEvent !== false };
            const obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription = obs.subscribe((errors) => {
                this._hasOwnPendingAsyncValidator = null;
                // This will trigger the recalculation of the validation status, which depends on
                // the state of the asynchronous validation (whether it is in progress or not). So, it is
                // necessary that we have updated the `_hasOwnPendingAsyncValidator` boolean flag first.
                this.setErrors(errors, { emitEvent, shouldHaveEmitted });
            });
        }
    }
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
            // we're cancelling the validator subscribtion, we keep if it should have emitted
            // because we want to emit eventually if it was required at least once.
            const shouldHaveEmitted = this._hasOwnPendingAsyncValidator?.emitEvent ?? false;
            this._hasOwnPendingAsyncValidator = null;
            return shouldHaveEmitted;
        }
        return false;
    }
    setErrors(errors, opts = {}) {
        this.errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false, this, opts.shouldHaveEmitted);
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
    _updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted) {
        this.status = this._calculateStatus();
        if (emitEvent) {
            this.statusChanges.emit(this.status);
        }
        // The Events Observable expose a slight different bevahior than the statusChanges obs
        // An async validator will still emit a StatusChangeEvent is a previously cancelled
        // async validator has emitEvent set to true
        if (emitEvent || shouldHaveEmitted) {
            this._events.next(new StatusChangeEvent(this.status, changedControl));
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwvYWJzdHJhY3RfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxhQUFhLElBQUksWUFBWSxFQUF3QixNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRXpDLE9BQU8sRUFDTCxxQ0FBcUMsRUFDckMsbUJBQW1CLEVBQ25CLHdCQUF3QixFQUN4QixlQUFlLEdBQ2hCLE1BQU0sK0JBQStCLENBQUM7QUFJdkMsT0FBTyxFQUNMLGFBQWEsRUFDYixzQkFBc0IsRUFDdEIsaUJBQWlCLEVBQ2pCLFlBQVksRUFDWixnQkFBZ0IsRUFDaEIsWUFBWSxHQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBRTdCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFakM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztBQW1CbkM7Ozs7R0FJRztBQUNILE1BQU0sT0FBZ0IsWUFBWTtDQUtqQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sZ0JBQW9CLFNBQVEsWUFBZTtJQUN0RCxZQUNrQixLQUFRLEVBQ1IsTUFBdUI7UUFFdkMsS0FBSyxFQUFFLENBQUM7UUFIUSxVQUFLLEdBQUwsS0FBSyxDQUFHO1FBQ1IsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7SUFHekMsQ0FBQztDQUNGO0FBRUQ7O0dBRUc7QUFFSCxNQUFN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QUFDLENBQUMsVUFBVSxDQUFDO1FBQ2xGLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxzQkFBc0IsQ0FBQyxVQUF3RDtRQUNyRixJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDdkYsSUFBSSxDQUFDLHlCQUF5QixHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0V2ZW50RW1pdHRlciwgybVSdW50aW1lRXJyb3IgYXMgUnVudGltZUVycm9yLCDJtVdyaXRhYmxlIGFzIFdyaXRhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gIGFzeW5jVmFsaWRhdG9yc0Ryb3BwZWRXaXRoT3B0c1dhcm5pbmcsXG4gIG1pc3NpbmdDb250cm9sRXJyb3IsXG4gIG1pc3NpbmdDb250cm9sVmFsdWVFcnJvcixcbiAgbm9Db250cm9sc0Vycm9yLFxufSBmcm9tICcuLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2Vycm9ycyc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvckZufSBmcm9tICcuLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtSdW50aW1lRXJyb3JDb2RlfSBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IHtGb3JtQXJyYXksIEZvcm1Hcm91cH0gZnJvbSAnLi4vZm9ybXMnO1xuaW1wb3J0IHtcbiAgYWRkVmFsaWRhdG9ycyxcbiAgY29tcG9zZUFzeW5jVmFsaWRhdG9ycyxcbiAgY29tcG9zZVZhbGlkYXRvcnMsXG4gIGhhc1ZhbGlkYXRvcixcbiAgcmVtb3ZlVmFsaWRhdG9ycyxcbiAgdG9PYnNlcnZhYmxlLFxufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBjb250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBzdGF0dXN9XG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJRCA9ICdWQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyBpbnZhbGlkLCBtZWFuaW5nIHRoYXQgYW4gZXJyb3IgZXhpc3RzIGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIHtAbGluayBzdGF0dXN9XG4gKi9cbmV4cG9ydCBjb25zdCBJTlZBTElEID0gJ0lOVkFMSUQnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IGFzeW5jIHZhbGlkYXRpb24gaXMgb2NjdXJyaW5nIGFuZFxuICogZXJyb3JzIGFyZSBub3QgeWV0IGF2YWlsYWJsZSBmb3IgdGhlIGlucHV0IHZhbHVlLlxuICpcbiAqIEBzZWUge0BsaW5rIG1hcmtBc1BlbmRpbmd9XG4gKiBAc2VlIHtAbGluayBzdGF0dXN9XG4gKi9cbmV4cG9ydCBjb25zdCBQRU5ESU5HID0gJ1BFTkRJTkcnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgZGlzYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSBhbmNlc3RvclxuICogY2FsY3VsYXRpb25zIG9mIHZhbGlkaXR5IG9yIHZhbHVlLlxuICpcbiAqIEBzZWUge0BsaW5rIG1hcmtBc0Rpc2FibGVkfVxuICogQHNlZSB7QGxpbmsgc3RhdHVzfVxuICovXG5leHBvcnQgY29uc3QgRElTQUJMRUQgPSAnRElTQUJMRUQnO1xuXG4vKipcbiAqIEEgZm9ybSBjYW4gaGF2ZSBzZXZlcmFsIGRpZmZlcmVudCBzdGF0dXNlcy4gRWFjaFxuICogcG9zc2libGUgc3RhdHVzIGlzIHJldHVybmVkIGFzIGEgc3RyaW5nIGxpdGVyYWwuXG4gKlxuICogKiAqKlZBTElEKio6IFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgdmFsaWQsIG1lYW5pbmcgdGhhdCBubyBlcnJvcnMgZXhpc3QgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipJTlZBTElEKio6IFJlcG9ydHMgdGhhdCBhIGNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXRcbiAqIHZhbHVlLlxuICogKiAqKlBFTkRJTkcqKjogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpcyBwZW5kaW5nLCBtZWFuaW5nIHRoYXQgYXN5bmMgdmFsaWRhdGlvbiBpc1xuICogb2NjdXJyaW5nIGFuZCBlcnJvcnMgYXJlIG5vdCB5ZXQgYXZhaWxhYmxlIGZvciB0aGUgaW5wdXQgdmFsdWUuXG4gKiAqICoqRElTQUJMRUQqKjogUmVwb3J0cyB0aGF0IGEgY29udHJvbCBpc1xuICogZGlzYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSBhbmNlc3RvciBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBGb3JtQ29udHJvbFN0YXR1cyA9ICdWQUxJRCcgfCAnSU5WQUxJRCcgfCAnUEVORElORycgfCAnRElTQUJMRUQnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGV2ZXJ5IGV2ZW50IHNlbnQgYnkgYEFic3RyYWN0Q29udHJvbC5ldmVudHMoKWBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBDb250cm9sRXZlbnQ8VCA9IGFueT4ge1xuICAvKipcbiAgICogRm9ybSBjb250cm9sIGZyb20gd2hpY2ggdGhpcyBldmVudCBpcyBvcmlnaW5hdGVkLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sPHVua25vd24+O1xufVxuXG4vKipcbiAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIHZhbHVlIG9mIGEgY29udHJvbCBjaGFuZ2VzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIFZhbHVlQ2hhbmdlRXZlbnQ8VD4gZXh0ZW5kcyBDb250cm9sRXZlbnQ8VD4ge1xuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IFQsXG4gICAgcHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGBQcmlzdGluZUNoYW5nZUV2ZW50YCBzeW1ib2wgaW5zdGVhZC5cbiAqL1xuXG5leHBvcnQgY2xhc3MgUHJpc3RpbmVFdmVudCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBwcmlzdGluZTogYm9vbGVhbixcbiAgICBwdWJsaWMgcmVhZG9ubHkgc291cmNlOiBBYnN0cmFjdENvbnRyb2wsXG4gICkge1xuICAgIHN1cGVyKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBFdmVudCBmaXJlZCB3aGVuIHRoZSBjb250cm9sJ3MgcHJpc3RpbmUgc3RhdGUgY2hhbmdlcyAocHJpc3RpbmUgPD0+IGRpcnR5KS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cblxuZXhwb3J0IGNsYXNzIFByaXN0aW5lQ2hhbmdlRXZlbnQgZXh0ZW5kcyBQcmlzdGluZUV2ZW50IHt9XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGBUb3VjaGVkQ2hhbmdlRXZlbnRgIHN5bWJvbCBpbnN0ZWFkLlxuICovXG5leHBvcnQgY2xhc3MgVG91Y2hlZEV2ZW50IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IHRvdWNoZWQ6IGJvb2xlYW4sXG4gICAgcHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sLFxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG59XG5cbi8qKlxuICogRXZlbnQgZmlyZWQgd2hlbiB0aGUgY29udHJvbCdzIHRvdWNoZWQgc3RhdHVzIGNoYW5nZXMgKHRvdWNoZWQgPD0+IHVudG91Y2hlZCkuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgVG91Y2hlZENoYW5nZUV2ZW50IGV4dGVuZHMgVG91Y2hlZEV2ZW50IHt9XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgdXNlIGBTdGF0dXNDaGFuZ2VFdmVudGAgc3ltYm9sIGluc3RlYWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0dXNFdmVudCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBzdGF0dXM6IEZvcm1Db250cm9sU3RhdHVzLFxuICAgIHB1YmxpYyByZWFkb25seSBzb3VyY2U6IEFic3RyYWN0Q29udHJvbCxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuXG4vKipcbiAqIEV2ZW50IGZpcmVkIHdoZW4gdGhlIGNvbnRyb2wncyBzdGF0dXMgY2hhbmdlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0dXNDaGFuZ2VFdmVudCBleHRlbmRzIFN0YXR1c0V2ZW50IHt9XG5cbi8qKlxuICogRXZlbnQgZmlyZWQgd2hlbiBhIGZvcm0gaXMgc3VibWl0dGVkXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybVN1Ym1pdHRlZEV2ZW50IGV4dGVuZHMgQ29udHJvbEV2ZW50IHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHNvdXJjZTogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxufVxuLyoqXG4gKiBFdmVudCBmaXJlZCB3aGVuIGEgZm9ybSBpcyByZXNldC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBGb3JtUmVzZXRFdmVudCBleHRlbmRzIENvbnRyb2xFdmVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBzb3VyY2U6IEFic3RyYWN0Q29udHJvbCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHZhbGlkYXRvcnMgZnJvbSBlaXRoZXIgYW4gb3B0aW9ucyBvYmplY3Qgb3IgZ2l2ZW4gdmFsaWRhdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tWYWxpZGF0b3JzKFxuICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbik6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGwge1xuICByZXR1cm4gKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gdmFsaWRhdG9yT3JPcHRzLnZhbGlkYXRvcnMgOiB2YWxpZGF0b3JPck9wdHMpIHx8IG51bGw7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB2YWxpZGF0b3IgZnVuY3Rpb24gYnkgY29tYmluaW5nIHByb3ZpZGVkIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvcjogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbCk6IFZhbGlkYXRvckZuIHwgbnVsbCB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbGlkYXRvcikgPyBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3IpIDogdmFsaWRhdG9yIHx8IG51bGw7XG59XG5cbi8qKlxuICogR2V0cyBhc3luYyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrQXN5bmNWYWxpZGF0b3JzKFxuICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsLFxuICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCxcbik6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsIHtcbiAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgIGlmIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSAmJiBhc3luY1ZhbGlkYXRvcikge1xuICAgICAgY29uc29sZS53YXJuKGFzeW5jVmFsaWRhdG9yc0Ryb3BwZWRXaXRoT3B0c1dhcm5pbmcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gdmFsaWRhdG9yT3JPcHRzLmFzeW5jVmFsaWRhdG9ycyA6IGFzeW5jVmFsaWRhdG9yKSB8fCBudWxsO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uIGJ5IGNvbWJpbmluZyBwcm92aWRlZCBhc3luYyB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKFxuICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsLFxuKTogQXN5bmNWYWxpZGF0b3JGbiB8IG51bGwge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhc3luY1ZhbGlkYXRvcilcbiAgICA/IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IpXG4gICAgOiBhc3luY1ZhbGlkYXRvciB8fCBudWxsO1xufVxuXG5leHBvcnQgdHlwZSBGb3JtSG9va3MgPSAnY2hhbmdlJyB8ICdibHVyJyB8ICdzdWJtaXQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igb3B0aW9ucyBwcm92aWRlZCB0byBhbiBgQWJzdHJhY3RDb250cm9sYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGEgY29udHJvbC5cbiAgICovXG4gIHZhbGlkYXRvcnM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBudWxsO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBsaXN0IG9mIGFzeW5jIHZhbGlkYXRvcnMgYXBwbGllZCB0byBjb250cm9sLlxuICAgKi9cbiAgYXN5bmNWYWxpZGF0b3JzPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGw7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGV2ZW50IG5hbWUgZm9yIGNvbnRyb2wgdG8gdXBkYXRlIHVwb24uXG4gICAqL1xuICB1cGRhdGVPbj86ICdjaGFuZ2UnIHwgJ2JsdXInIHwgJ3N1Ym1pdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09wdGlvbnNPYmooXG4gIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsLFxuKTogdmFsaWRhdG9yT3JPcHRzIGlzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMge1xuICByZXR1cm4gKFxuICAgIHZhbGlkYXRvck9yT3B0cyAhPSBudWxsICYmXG4gICAgIUFycmF5LmlzQXJyYXkodmFsaWRhdG9yT3JPcHRzKSAmJlxuICAgIHR5cGVvZiB2YWxpZGF0b3JPck9wdHMgPT09ICdvYmplY3QnXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRDb250cm9sUHJlc2VudChwYXJlbnQ6IGFueSwgaXNHcm91cDogYm9vbGVhbiwga2V5OiBzdHJpbmcgfCBudW1iZXIpOiB2b2lkIHtcbiAgY29uc3QgY29udHJvbHMgPSBwYXJlbnQuY29udHJvbHMgYXMge1trZXk6IHN0cmluZyB8IG51bWJlcl06IHVua25vd259O1xuICBjb25zdCBjb2xsZWN0aW9uID0gaXNHcm91cCA/IE9iamVjdC5rZXlzKGNvbnRyb2xzKSA6IGNvbnRyb2xzO1xuICBpZiAoIWNvbGxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcbiAgICAgIFJ1bnRpbWVFcnJvckNvZGUuTk9fQ09OVFJPTFMsXG4gICAgICB0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUgPyBub0NvbnRyb2xzRXJyb3IoaXNHcm91cCkgOiAnJyxcbiAgICApO1xuICB9XG4gIGlmICghY29udHJvbHNba2V5XSkge1xuICAgIHRocm93IG5ldyBSdW50aW1lRXJyb3IoXG4gICAgICBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfQ09OVFJPTCxcbiAgICAgIHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSA/IG1pc3NpbmdDb250cm9sRXJyb3IoaXNHcm91cCwga2V5KSA6ICcnLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEFsbFZhbHVlc1ByZXNlbnQoY29udHJvbDogYW55LCBpc0dyb3VwOiBib29sZWFuLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gIGNvbnRyb2wuX2ZvckVhY2hDaGlsZCgoXzogdW5rbm93biwga2V5OiBzdHJpbmcgfCBudW1iZXIpID0+IHtcbiAgICBpZiAodmFsdWVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfQ09OVFJPTF9WQUxVRSxcbiAgICAgICAgdHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlID8gbWlzc2luZ0NvbnRyb2xWYWx1ZUVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyxcbiAgICAgICk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gSXNBbnkgY2hlY2tzIGlmIFQgaXMgYGFueWAsIGJ5IGNoZWNraW5nIGEgY29uZGl0aW9uIHRoYXQgY291bGRuJ3QgcG9zc2libHkgYmUgdHJ1ZSBvdGhlcndpc2UuXG5leHBvcnQgdHlwZSDJtUlzQW55PFQsIFksIE4+ID0gMCBleHRlbmRzIDEgJiBUID8gWSA6IE47XG5cbi8qKlxuICogYFR5cGVkT3JVbnR5cGVkYCBhbGxvd3Mgb25lIG9mIHR3byBkaWZmZXJlbnQgdHlwZXMgdG8gYmUgc2VsZWN0ZWQsIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBGb3Jtc1xuICogY2xhc3MgaXQncyBhcHBsaWVkIHRvIGlzIHR5cGVkIG9yIG5vdC5cbiAqXG4gKiBUaGlzIGlzIGZvciBpbnRlcm5hbCBBbmd1bGFyIHVzYWdlIHRvIHN1cHBvcnQgdHlwZWQgZm9ybXM7IGRvIG5vdCBkaXJlY3RseSB1c2UgaXQuXG4gKi9cbmV4cG9ydCB0eXBlIMm1VHlwZWRPclVudHlwZWQ8VCwgVHlwZWQsIFVudHlwZWQ+ID0gybVJc0FueTxULCBVbnR5cGVkLCBUeXBlZD47XG5cbi8qKlxuICogVmFsdWUgZ2l2ZXMgdGhlIHZhbHVlIHR5cGUgY29ycmVzcG9uZGluZyB0byBhIGNvbnRyb2wgdHlwZS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHJlc3VsdGluZyB0eXBlIHdpbGwgZm9sbG93IHRoZSBzYW1lIHJ1bGVzIGFzIGAudmFsdWVgIG9uIHlvdXIgY29udHJvbCwgZ3JvdXAsIG9yXG4gKiBhcnJheSwgaW5jbHVkaW5nIGB1bmRlZmluZWRgIGZvciBlYWNoIGdyb3VwIGVsZW1lbnQgd2hpY2ggbWlnaHQgYmUgZGlzYWJsZWQuXG4gKlxuICogSWYgeW91IGFyZSB0cnlpbmcgdG8gZXh0cmFjdCBhIHZhbHVlIHR5cGUgZm9yIGEgZGF0YSBtb2RlbCwgeW91IHByb2JhYmx5IHdhbnQge0BsaW5rIFJhd1ZhbHVlfSxcbiAqIHdoaWNoIHdpbGwgbm90IGhhdmUgYHVuZGVmaW5lZGAgaW4gZ3JvdXAga2V5cy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBgRm9ybUNvbnRyb2xgIHZhbHVlIHR5cGVcbiAqXG4gKiBZb3UgY2FuIGV4dHJhY3QgdGhlIHZhbHVlIHR5cGUgb2YgYSBzaW5nbGUgY29udHJvbDpcbiAqXG4gKiBgYGB0c1xuICogdHlwZSBOYW1lQ29udHJvbCA9IEZvcm1Db250cm9sPHN0cmluZz47XG4gKiB0eXBlIE5hbWVWYWx1ZSA9IFZhbHVlPE5hbWVDb250cm9sPjtcbiAqIGBgYFxuICpcbiAqIFRoZSByZXN1bHRpbmcgdHlwZSBpcyBgc3RyaW5nYC5cbiAqXG4gKiAjIyMgYEZvcm1Hcm91cGAgdmFsdWUgdHlwZVxuICpcbiAqIEltYWdpbmUgeW91IGhhdmUgYW4gaW50ZXJmYWNlIGRlZmluaW5nIHRoZSBjb250cm9scyBpbiB5b3VyIGdyb3VwLiBZb3UgY2FuIGV4dHJhY3QgdGhlIHNoYXBlIG9mXG4gKiB0aGUgdmFsdWVzIGFzIGZvbGxvd3M6XG4gKlxuICogYGBgdHNcbiAqIGludGVyZmFjZSBQYXJ0eUZvcm1Db250cm9scyB7XG4gKiAgIGFkZHJlc3M6IEZvcm1Db250cm9sPHN0cmluZz47XG4gKiB9XG4gKlxuICogLy8gVmFsdWUgb3BlcmF0ZXMgb24gY29udHJvbHM7IHRoZSBvYmplY3QgbXVzdCBiZSB3cmFwcGVkIGluIGEgRm9ybUdyb3VwLlxuICogdHlwZSBQYXJ0eUZvcm1WYWx1ZXMgPSBWYWx1ZTxGb3JtR3JvdXA8UGFydHlGb3JtQ29udHJvbHM+PjtcbiAqIGBgYFxuICpcbiAqIFRoZSByZXN1bHRpbmcgdHlwZSBpcyBge2FkZHJlc3M6IHN0cmluZ3x1bmRlZmluZWR9YC5cbiAqXG4gKiAjIyMgYEZvcm1BcnJheWAgdmFsdWUgdHlwZVxuICpcbiAqIFlvdSBjYW4gZXh0cmFjdCB2YWx1ZXMgZnJvbSBGb3JtQXJyYXlzIGFzIHdlbGw6XG4gKlxuICogYGBgdHNcbiAqIHR5cGUgR3Vlc3ROYW1lc0NvbnRyb2xzID0gRm9ybUFycmF5PEZvcm1Db250cm9sPHN0cmluZz4+O1xuICpcbiAqIHR5cGUgTmFtZXNWYWx1ZXMgPSBWYWx1ZTxHdWVzdE5hbWVzQ29udHJvbHM+O1xuICogYGBgXG4gKlxuICogVGhlIHJlc3VsdGluZyB0eXBlIGlzIGBzdHJpbmdbXWAuXG4gKlxuICogKipJbnRlcm5hbDogbm90IGZvciBwdWJsaWMgdXNlLioqXG4gKi9cbmV4cG9ydCB0eXBlIMm1VmFsdWU8VCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB8IHVuZGVmaW5lZD4gPVxuICBUIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sPGFueSwgYW55PiA/IFRbJ3ZhbHVlJ10gOiBuZXZlcjtcblxuLyoqXG4gKiBSYXdWYWx1ZSBnaXZlcyB0aGUgcmF3IHZhbHVlIHR5cGUgY29ycmVzcG9uZGluZyB0byBhIGNvbnRyb2wgdHlwZS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHJlc3VsdGluZyB0eXBlIHdpbGwgZm9sbG93IHRoZSBzYW1lIHJ1bGVzIGFzIGAuZ2V0UmF3VmFsdWUoKWAgb24geW91ciBjb250cm9sLFxuICogZ3JvdXAsIG9yIGFycmF5LiBUaGlzIG1lYW5zIHRoYXQgYWxsIGNvbnRyb2xzIGluc2lkZSBhIGdyb3VwIHdpbGwgYmUgcmVxdWlyZWQsIG5vdCBvcHRpb25hbCxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgZGlzYWJsZWQgc3RhdGUuXG4gKlxuICogWW91IG1heSBhbHNvIHdpc2ggdG8gdXNlIHtAbGluayDJtVZhbHVlfSwgd2hpY2ggd2lsbCBoYXZlIGB1bmRlZmluZWRgIGluIGdyb3VwIGtleXMgKHdoaWNoIGNhbiBiZVxuICogZGlzYWJsZWQpLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIGBGb3JtR3JvdXBgIHJhdyB2YWx1ZSB0eXBlXG4gKlxuICogSW1hZ2luZSB5b3UgaGF2ZSBhbiBpbnRlcmZhY2UgZGVmaW5pbmcgdGhlIGNvbnRyb2xzIGluIHlvdXIgZ3JvdXAuIFlvdSBjYW4gZXh0cmFjdCB0aGUgc2hhcGUgb2ZcbiAqIHRoZSByYXcgdmFsdWVzIGFzIGZvbGxvd3M6XG4gKlxuICogYGBgdHNcbiAqIGludGVyZmFjZSBQYXJ0eUZvcm1Db250cm9scyB7XG4gKiAgIGFkZHJlc3M6IEZvcm1Db250cm9sPHN0cmluZz47XG4gKiB9XG4gKlxuICogLy8gUmF3VmFsdWUgb3BlcmF0ZXMgb24gY29udHJvbHM7IHRoZSBvYmplY3QgbXVzdCBiZSB3cmFwcGVkIGluIGEgRm9ybUdyb3VwLlxuICogdHlwZSBQYXJ0eUZvcm1WYWx1ZXMgPSBSYXdWYWx1ZTxGb3JtR3JvdXA8UGFydHlGb3JtQ29udHJvbHM+PjtcbiAqIGBgYFxuICpcbiAqIFRoZSByZXN1bHRpbmcgdHlwZSBpcyBge2FkZHJlc3M6IHN0cmluZ31gLiAoTm90ZSB0aGUgYWJzZW5jZSBvZiBgdW5kZWZpbmVkYC4pXG4gKlxuICogICoqSW50ZXJuYWw6IG5vdCBmb3IgcHVibGljIHVzZS4qKlxuICovXG5leHBvcnQgdHlwZSDJtVJhd1ZhbHVlPFQgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wgfCB1bmRlZmluZWQ+ID1cbiAgVCBleHRlbmRzIEFic3RyYWN0Q29udHJvbDxhbnksIGFueT5cbiAgICA/IFRbJ3NldFZhbHVlJ10gZXh0ZW5kcyAodjogaW5mZXIgUikgPT4gdm9pZFxuICAgICAgPyBSXG4gICAgICA6IG5ldmVyXG4gICAgOiBuZXZlcjtcblxuLyoqXG4gKiBUb2tlbml6ZSBzcGxpdHMgYSBzdHJpbmcgbGl0ZXJhbCBTIGJ5IGEgZGVsaW1pdGVyIEQuXG4gKi9cbmV4cG9ydCB0eXBlIMm1VG9rZW5pemU8UyBleHRlbmRzIHN0cmluZywgRCBleHRlbmRzIHN0cmluZz4gPSBzdHJpbmcgZXh0ZW5kcyBTXG4gID8gc3RyaW5nW10gLyogUyBtdXN0IGJlIGEgbGl0ZXJhbCAqL1xuICA6IFMgZXh0ZW5kcyBgJHtpbmZlciBUfSR7RH0ke2luZmVyIFV9YFxuICAgID8gW1QsIC4uLsm1VG9rZW5pemU8VSwgRD5dXG4gICAgOiBbU10gLyogQmFzZSBjYXNlICovO1xuXG4vKipcbiAqIENvZXJjZVN0ckFyclRvTnVtQXJyIGFjY2VwdHMgYW4gYXJyYXkgb2Ygc3RyaW5ncywgYW5kIGNvbnZlcnRzIGFueSBudW1lcmljIHN0cmluZyB0byBhIG51bWJlci5cbiAqL1xuZXhwb3J0IHR5cGUgybVDb2VyY2VTdHJBcnJUb051bUFycjxTPiA9XG4gIC8vIEV4dHJhY3QgdGhlIGhlYWQgb2YgdGhlIGFycmF5LlxuICBTIGV4dGVuZHMgW2luZmVyIEhlYWQsIC4uLmluZmVyIFRhaWxdXG4gICAgPyAvLyBVc2luZyBhIHRlbXBsYXRlIGxpdGVyYWwgdHlwZSwgY29lcmNlIHRoZSBoZWFkIHRvIGBudW1iZXJgIGlmIHBvc3NpYmxlLlxuICAgICAgLy8gVGhlbiwgcmVjdXJzZSBvbiB0aGUgdGFpbC5cbiAgICAgIEhlYWQgZXh0ZW5kcyBgJHtudW1iZXJ9YFxuICAgICAgPyBbbnVtYmVyLCAuLi7JtUNvZXJjZVN0ckFyclRvTnVtQXJyPFRhaWw+XVxuICAgICAgOiBbSGVhZCwgLi4uybVDb2VyY2VTdHJBcnJUb051bUFycjxUYWlsPl1cbiAgICA6IFtdO1xuXG4vKipcbiAqIE5hdmlnYXRlIHRha2VzIGEgdHlwZSBUIGFuZCBhbiBhcnJheSBLLCBhbmQgcmV0dXJucyB0aGUgdHlwZSBvZiBUW0tbMF1dW0tbMV1dW0tbMl1dLi4uXG4gKi9cbmV4cG9ydCB0eXBlIMm1TmF2aWdhdGU8XG4gIFQsXG4gIEsgZXh0ZW5kcyBBcnJheTxzdHJpbmcgfCBudW1iZXI+LFxuPiA9IFQgZXh0ZW5kcyBvYmplY3QgLyogVCBtdXN0IGJlIGluZGV4YWJsZSAob2JqZWN0IG9yIGFycmF5KSAqL1xuICA/IEsgZXh0ZW5kcyBbaW5mZXIgSGVhZCwgLi4uaW5mZXIgVGFpbF0gLyogU3BsaXQgSyBpbnRvIGhlYWQgYW5kIHRhaWwgKi9cbiAgICA/IEhlYWQgZXh0ZW5kcyBrZXlvZiBUIC8qIGhlYWQoSykgbXVzdCBpbmRleCBUICovXG4gICAgICA/IFRhaWwgZXh0ZW5kcyAoc3RyaW5nIHwgbnVtYmVyKVtdIC8qIHRhaWwoSykgbXVzdCBiZSBhbiBhcnJheSAqL1xuICAgICAgICA/IFtdIGV4dGVuZHMgVGFpbFxuICAgICAgICAgID8gVFtIZWFkXSAvKiBiYXNlIGNhc2U6IEsgY2FuIGJlIHNwbGl0LCBidXQgVGFpbCBpcyBlbXB0eSAqL1xuICAgICAgICAgIDogybVOYXZpZ2F0ZTxUW0hlYWRdLCBUYWlsPiAvKiBleHBsb3JlIFRbaGVhZChLKV0gYnkgdGFpbChLKSAqL1xuICAgICAgICA6IGFueSAvKiB0YWlsKEspIHdhcyBub3QgYW4gYXJyYXksIGdpdmUgdXAgKi9cbiAgICAgIDogbmV2ZXIgLyogaGVhZChLKSBkb2VzIG5vdCBpbmRleCBULCBnaXZlIHVwICovXG4gICAgOiBhbnkgLyogSyBjYW5ub3QgYmUgc3BsaXQsIGdpdmUgdXAgKi9cbiAgOiBhbnkgLyogVCBpcyBub3QgaW5kZXhhYmxlLCBnaXZlIHVwICovO1xuXG4vKipcbiAqIMm1V3JpdGVhYmxlIHJlbW92ZXMgcmVhZG9ubHkgZnJvbSBhbGwga2V5cy5cbiAqL1xuZXhwb3J0IHR5cGUgybVXcml0ZWFibGU8VD4gPSB7XG4gIC1yZWFkb25seSBbUCBpbiBrZXlvZiBUXTogVFtQXTtcbn07XG5cbi8qKlxuICogR2V0UHJvcGVydHkgdGFrZXMgYSB0eXBlIFQgYW5kIHNvbWUgcHJvcGVydHkgbmFtZXMgb3IgaW5kaWNlcyBLLlxuICogSWYgSyBpcyBhIGRvdC1zZXBhcmF0ZWQgc3RyaW5nLCBpdCBpcyB0b2tlbml6ZWQgaW50byBhbiBhcnJheSBiZWZvcmUgcHJvY2VlZGluZy5cbiAqIFRoZW4sIHRoZSB0eXBlIG9mIHRoZSBuZXN0ZWQgcHJvcGVydHkgYXQgSyBpcyBjb21wdXRlZDogVFtLWzBdXVtLWzFdXVtLWzJdXS4uLlxuICogVGhpcyB3b3JrcyB3aXRoIGJvdGggb2JqZWN0cywgd2hpY2ggYXJlIGluZGV4ZWQgYnkgcHJvcGVydHkgbmFtZSwgYW5kIGFycmF5cywgd2hpY2ggYXJlIGluZGV4ZWRcbiAqIG51bWVyaWNhbGx5LlxuICpcbiAqIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAqL1xuZXhwb3J0IHR5cGUgybVHZXRQcm9wZXJ0eTxULCBLPiA9XG4gIC8vIEsgaXMgYSBzdHJpbmdcbiAgSyBleHRlbmRzIHN0cmluZ1xuICAgID8gybVHZXRQcm9wZXJ0eTxULCDJtUNvZXJjZVN0ckFyclRvTnVtQXJyPMm1VG9rZW5pemU8SywgJy4nPj4+XG4gICAgOiAvLyBJcyBpdCBhbiBhcnJheVxuICAgICAgybVXcml0ZWFibGU8Sz4gZXh0ZW5kcyBBcnJheTxzdHJpbmcgfCBudW1iZXI+XG4gICAgICA/IMm1TmF2aWdhdGU8VCwgybVXcml0ZWFibGU8Sz4+XG4gICAgICA6IC8vIEZhbGwgdGhyb3VnaCBwZXJtaXNzaXZlbHkgaWYgd2UgY2FuJ3QgY2FsY3VsYXRlIHRoZSB0eXBlIG9mIEsuXG4gICAgICAgIGFueTtcblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIEl0IHByb3ZpZGVzIHNvbWUgb2YgdGhlIHNoYXJlZCBiZWhhdmlvciB0aGF0IGFsbCBjb250cm9scyBhbmQgZ3JvdXBzIG9mIGNvbnRyb2xzIGhhdmUsIGxpa2VcbiAqIHJ1bm5pbmcgdmFsaWRhdG9ycywgY2FsY3VsYXRpbmcgc3RhdHVzLCBhbmQgcmVzZXR0aW5nIHN0YXRlLiBJdCBhbHNvIGRlZmluZXMgdGhlIHByb3BlcnRpZXNcbiAqIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBzdWItY2xhc3NlcywgbGlrZSBgdmFsdWVgLCBgdmFsaWRgLCBhbmQgYGRpcnR5YC4gSXQgc2hvdWxkbid0IGJlXG4gKiBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogVGhlIGZpcnN0IHR5cGUgcGFyYW1ldGVyIFRWYWx1ZSByZXByZXNlbnRzIHRoZSB2YWx1ZSB0eXBlIG9mIHRoZSBjb250cm9sIChgY29udHJvbC52YWx1ZWApLlxuICogVGhlIG9wdGlvbmFsIHR5cGUgcGFyYW1ldGVyIFRSYXdWYWx1ZSAgcmVwcmVzZW50cyB0aGUgcmF3IHZhbHVlIHR5cGUgKGBjb250cm9sLmdldFJhd1ZhbHVlKClgKS5cbiAqXG4gKiBAc2VlIFtGb3JtcyBHdWlkZV0oZ3VpZGUvZm9ybXMpXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvZm9ybXMvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIFtEeW5hbWljIEZvcm1zIEd1aWRlXShndWlkZS9mb3Jtcy9keW5hbWljLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbDxUVmFsdWUgPSBhbnksIFRSYXdWYWx1ZSBleHRlbmRzIFRWYWx1ZSA9IFRWYWx1ZT4ge1xuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgYSBjb250cm9sIGhhcyBpdHMgb3duIHBlbmRpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRpb24gaW4gcHJvZ3Jlc3MuXG4gICAqIEl0IGFsc28gc3RvcmVzIGlmIHRoZSBjb250cm9sIHNob3VsZCBlbWl0IGV2ZW50cyB3aGVuIHRoZSB2YWxpZGF0aW9uIHN0YXR1cyBjaGFuZ2VzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3I6IG51bGwgfCB7ZW1pdEV2ZW50OiBib29sZWFufSA9IG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVPbj86IEZvcm1Ib29rcztcblxuICBwcml2YXRlIF9wYXJlbnQ6IEZvcm1Hcm91cCB8IEZvcm1BcnJheSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogQ29udGFpbnMgdGhlIHJlc3VsdCBvZiBtZXJnaW5nIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICogKGNvbWJpbmVkIHVzaW5nIGBWYWxpZGF0b3JzLmNvbXBvc2VgKS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9jb21wb3NlZFZhbGlkYXRvckZuITogVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICogKGNvbWJpbmVkIHVzaW5nIGBWYWxpZGF0b3JzLmNvbXBvc2VBc3luY2ApLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiE6IEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIC8qKlxuICAgKiBTeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0VmFsaWRhdG9yc2AgZnVuY3Rpb25cbiAgICogIC0gd2hpbGUgY2FsbGluZyB0aGUgc2V0dGVyIG9uIHRoZSBgdmFsaWRhdG9yYCBmaWVsZCAoZS5nLiBgY29udHJvbC52YWxpZGF0b3IgPSB2YWxpZGF0b3JGbmApXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3VmFsaWRhdG9ycyE6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGw7XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0QXN5bmNWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGBhc3luY1ZhbGlkYXRvcmAgZmllbGQgKGUuZy4gYGNvbnRyb2wuYXN5bmNWYWxpZGF0b3IgPVxuICAgKiBhc3luY1ZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdBc3luY1ZhbGlkYXRvcnMhOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbDtcblxuICAvKipcbiAgICogVGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqICogRm9yIGEgYEZvcm1Db250cm9sYCwgdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAqICogRm9yIGFuIGVuYWJsZWQgYEZvcm1Hcm91cGAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBvYmplY3RcbiAgICogd2l0aCBhIGtleS12YWx1ZSBwYWlyIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgZ3JvdXAuXG4gICAqICogRm9yIGEgZGlzYWJsZWQgYEZvcm1Hcm91cGAsIHRoZSB2YWx1ZXMgb2YgYWxsIGNvbnRyb2xzIGFzIGFuIG9iamVjdFxuICAgKiB3aXRoIGEga2V5LXZhbHVlIHBhaXIgZm9yIGVhY2ggbWVtYmVyIG9mIHRoZSBncm91cC5cbiAgICogKiBGb3IgYSBgRm9ybUFycmF5YCwgdGhlIHZhbHVlcyBvZiBlbmFibGVkIGNvbnRyb2xzIGFzIGFuIGFycmF5LlxuICAgKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHZhbHVlITogVFZhbHVlO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBYnN0cmFjdENvbnRyb2wgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2ZcbiAgICogICAgIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB2YWxpZGl0eSBvZlxuICAgKiAgICAgdGhpcyBjb250cm9sIGFzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgdmFsaWRhdG9yczogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbCxcbiAgICBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10gfCBudWxsLFxuICApIHtcbiAgICB0aGlzLl9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX2Fzc2lnbkFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgKiBJZiBtdWx0aXBsZSB2YWxpZGF0b3JzIGhhdmUgYmVlbiBhZGRlZCwgdGhpcyB3aWxsIGJlIGEgc2luZ2xlIGNvbXBvc2VkIGZ1bmN0aW9uLlxuICAgKiBTZWUgYFZhbGlkYXRvcnMuY29tcG9zZSgpYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGdldCB2YWxpZGF0b3IoKTogVmFsaWRhdG9yRm4gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbjtcbiAgfVxuICBzZXQgdmFsaWRhdG9yKHZhbGlkYXRvckZuOiBWYWxpZGF0b3JGbiB8IG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IHZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbCBhc3luY2hyb25vdXNseS5cbiAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbiB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm47XG4gIH1cbiAgc2V0IGFzeW5jVmFsaWRhdG9yKGFzeW5jVmFsaWRhdG9yRm46IEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsKSB7XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuID0gYXN5bmNWYWxpZGF0b3JGbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IGNvbnRyb2wuXG4gICAqL1xuICBnZXQgcGFyZW50KCk6IEZvcm1Hcm91cCB8IEZvcm1BcnJheSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBGb3JtQ29udHJvbFN0YXR1c31cbiAgICpcbiAgICogVGhlc2Ugc3RhdHVzIHZhbHVlcyBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLCBzbyBhIGNvbnRyb2wgY2Fubm90IGJlXG4gICAqIGJvdGggdmFsaWQgQU5EIGludmFsaWQgb3IgaW52YWxpZCBBTkQgZGlzYWJsZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzITogRm9ybUNvbnRyb2xTdGF0dXM7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgdmFsaWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBWQUxJRGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIHBhc3NlZCBhbGwgb2YgaXRzIHZhbGlkYXRpb24gdGVzdHMsXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCB2YWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IFZBTElEO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgaW52YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYElOVkFMSURgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgY29udHJvbCBoYXMgZmFpbGVkIG9uZSBvciBtb3JlIG9mIGl0cyB2YWxpZGF0aW9uIGNoZWNrcyxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGludmFsaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBJTlZBTElEO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgcGVuZGluZ2Agd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFBFTkRJTkdgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgY29udHJvbCBpcyBpbiB0aGUgcHJvY2VzcyBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjayxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IHBlbmRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09IFBFTkRJTkc7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXNhYmxlZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYERJU0FCTEVEYC5cbiAgICpcbiAgICogRGlzYWJsZWQgY29udHJvbHMgYXJlIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiBhcmUgbm90IGluY2x1ZGVkIGluIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgdGhlaXIgYW5jZXN0b3JcbiAgICogY29udHJvbHMuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IERJU0FCTEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZW5hYmxlZGAgYXMgbG9uZyBhcyBpdHMgYHN0YXR1c2AgaXMgbm90IGBESVNBQkxFRGAuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIGFueSBzdGF0dXMgb3RoZXIgdGhhbiAnRElTQUJMRUQnLFxuICAgKiBmYWxzZSBpZiB0aGUgc3RhdHVzIGlzICdESVNBQkxFRCcuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqL1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgIT09IERJU0FCTEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIGFueSBlcnJvcnMgZ2VuZXJhdGVkIGJ5IGZhaWxpbmcgdmFsaWRhdGlvbixcbiAgICogb3IgbnVsbCBpZiB0aGVyZSBhcmUgbm8gZXJyb3JzLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGVycm9ycyE6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHByaXN0aW5lYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkXG4gICAqIHRoZSB2YWx1ZSBpbiB0aGUgVUkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZCB0aGUgdmFsdWUgaW4gdGhlIFVJOyBjb21wYXJlIGBkaXJ0eWAuXG4gICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByaXN0aW5lOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXJ0eWAgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlXG4gICAqIGluIHRoZSBVSS5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgdmFsdWUgb2YgdGhpcyBjb250cm9sIGluIHRoZSBVSTsgY29tcGFyZSBgcHJpc3RpbmVgLlxuICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIGdldCBkaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMucHJpc3RpbmU7XG4gIH1cblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBtYXJrZWQgYXMgYHRvdWNoZWRgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgbWFya2VkIGB0b3VjaGVkYCBvbmNlIHRoZSB1c2VyIGhhcyB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdG91Y2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBub3QgYmVlbiBtYXJrZWQgYXMgdG91Y2hlZFxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgYHVudG91Y2hlZGAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgZ2V0IHVudG91Y2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMudG91Y2hlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHBvc2VkIGFzIG9ic2VydmFibGUsIHNlZSBiZWxvdy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICByZWFkb25seSBfZXZlbnRzID0gbmV3IFN1YmplY3Q8Q29udHJvbEV2ZW50PFRWYWx1ZT4+KCk7XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSBzdGF0ZSBvZiB0aGUgY29udHJvbCBjaGFuZ2VzLlxuICAgKiBJdCBlbWl0cyBmb3IgdmFsdWUsIHN0YXR1cywgcHJpc3RpbmUgb3IgdG91Y2hlZCBjaGFuZ2VzLlxuICAgKlxuICAgKiAqKk5vdGUqKjogT24gdmFsdWUgY2hhbmdlLCB0aGUgZW1pdCBoYXBwZW5zIHJpZ2h0IGFmdGVyIGEgdmFsdWUgb2YgdGhpcyBjb250cm9sIGlzIHVwZGF0ZWQuIFRoZVxuICAgKiB2YWx1ZSBvZiBhIHBhcmVudCBjb250cm9sIChmb3IgZXhhbXBsZSBpZiB0aGlzIEZvcm1Db250cm9sIGlzIGEgcGFydCBvZiBhIEZvcm1Hcm91cCkgaXMgdXBkYXRlZFxuICAgKiBsYXRlciwgc28gYWNjZXNzaW5nIGEgdmFsdWUgb2YgYSBwYXJlbnQgY29udHJvbCAodXNpbmcgdGhlIGB2YWx1ZWAgcHJvcGVydHkpIGZyb20gdGhlIGNhbGxiYWNrXG4gICAqIG9mIHRoaXMgZXZlbnQgbWlnaHQgcmVzdWx0IGluIGdldHRpbmcgYSB2YWx1ZSB0aGF0IGhhcyBub3QgYmVlbiB1cGRhdGVkIHlldC4gU3Vic2NyaWJlIHRvIHRoZVxuICAgKiBgZXZlbnRzYCBvZiB0aGUgcGFyZW50IGNvbnRyb2wgaW5zdGVhZC5cbiAgICogRm9yIG90aGVyIGV2ZW50IHR5cGVzLCB0aGUgZXZlbnRzIGFyZSBlbWl0dGVkIGFmdGVyIHRoZSBwYXJlbnQgY29udHJvbCBoYXMgYmVlbiB1cGRhdGVkLlxuICAgKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGV2ZW50cyA9IHRoaXMuX2V2ZW50cy5hc09ic2VydmFibGUoKTtcblxuICAvKipcbiAgICogQSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGV2ZW50IGV2ZXJ5IHRpbWUgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGNoYW5nZXMsIGluXG4gICAqIHRoZSBVSSBvciBwcm9ncmFtbWF0aWNhbGx5LiBJdCBhbHNvIGVtaXRzIGFuIGV2ZW50IGVhY2ggdGltZSB5b3UgY2FsbCBlbmFibGUoKSBvciBkaXNhYmxlKClcbiAgICogd2l0aG91dCBwYXNzaW5nIGFsb25nIHtlbWl0RXZlbnQ6IGZhbHNlfSBhcyBhIGZ1bmN0aW9uIGFyZ3VtZW50LlxuICAgKlxuICAgKiAqKk5vdGUqKjogdGhlIGVtaXQgaGFwcGVucyByaWdodCBhZnRlciBhIHZhbHVlIG9mIHRoaXMgY29udHJvbCBpcyB1cGRhdGVkLiBUaGUgdmFsdWUgb2YgYVxuICAgKiBwYXJlbnQgY29udHJvbCAoZm9yIGV4YW1wbGUgaWYgdGhpcyBGb3JtQ29udHJvbCBpcyBhIHBhcnQgb2YgYSBGb3JtR3JvdXApIGlzIHVwZGF0ZWQgbGF0ZXIsIHNvXG4gICAqIGFjY2Vzc2luZyBhIHZhbHVlIG9mIGEgcGFyZW50IGNvbnRyb2wgKHVzaW5nIHRoZSBgdmFsdWVgIHByb3BlcnR5KSBmcm9tIHRoZSBjYWxsYmFjayBvZiB0aGlzXG4gICAqIGV2ZW50IG1pZ2h0IHJlc3VsdCBpbiBnZXR0aW5nIGEgdmFsdWUgdGhhdCBoYXMgbm90IGJlZW4gdXBkYXRlZCB5ZXQuIFN1YnNjcmliZSB0byB0aGVcbiAgICogYHZhbHVlQ2hhbmdlc2AgZXZlbnQgb2YgdGhlIHBhcmVudCBjb250cm9sIGluc3RlYWQuXG4gICAqXG4gICAqIFRPRE86IHRoaXMgc2hvdWxkIGJlIHBpcGVkIGZyb20gZXZlbnRzKCkgYnV0IGlzIGJyZWFraW5nIGluIEczXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWVDaGFuZ2VzITogT2JzZXJ2YWJsZTxUVmFsdWU+O1xuXG4gIC8qKlxuICAgKiBBIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgdmFsaWRhdGlvbiBgc3RhdHVzYCBvZiB0aGUgY29udHJvbFxuICAgKiByZWNhbGN1bGF0ZXMuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEZvcm1Db250cm9sU3RhdHVzfVxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBUT0RPOiB0aGlzIHNob3VsZCBiZSBwaXBlZCBmcm9tIGV2ZW50cygpIGJ1dCBpcyBicmVha2luZyBpbiBHM1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1c0NoYW5nZXMhOiBPYnNlcnZhYmxlPEZvcm1Db250cm9sU3RhdHVzPjtcblxuICAvKipcbiAgICogUmVwb3J0cyB0aGUgdXBkYXRlIHN0cmF0ZWd5IG9mIHRoZSBgQWJzdHJhY3RDb250cm9sYCAobWVhbmluZ1xuICAgKiB0aGUgZXZlbnQgb24gd2hpY2ggdGhlIGNvbnRyb2wgdXBkYXRlcyBpdHNlbGYpLlxuICAgKiBQb3NzaWJsZSB2YWx1ZXM6IGAnY2hhbmdlJ2AgfCBgJ2JsdXInYCB8IGAnc3VibWl0J2BcbiAgICogRGVmYXVsdCB2YWx1ZTogYCdjaGFuZ2UnYFxuICAgKi9cbiAgZ2V0IHVwZGF0ZU9uKCk6IEZvcm1Ib29rcyB7XG4gICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU9uID8gdGhpcy5fdXBkYXRlT24gOiB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnVwZGF0ZU9uIDogJ2NoYW5nZSc7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiAgQ2FsbGluZ1xuICAgKiB0aGlzIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gYWRkIGEgbmV3IHZhbGlkYXRvciB3aXRob3V0IGFmZmVjdGluZyBleGlzdGluZyBvbmVzLCBjb25zaWRlclxuICAgKiB1c2luZyBgYWRkVmFsaWRhdG9ycygpYCBtZXRob2QgaW5zdGVhZC5cbiAgICovXG4gIHNldFZhbGlkYXRvcnModmFsaWRhdG9yczogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX2Fzc2lnblZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gQ2FsbGluZyB0aGlzXG4gICAqIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGFkZCBhIG5ldyB2YWxpZGF0b3Igd2l0aG91dCBhZmZlY3RpbmcgZXhpc3Rpbmcgb25lcywgY29uc2lkZXJcbiAgICogdXNpbmcgYGFkZEFzeW5jVmFsaWRhdG9ycygpYCBtZXRob2QgaW5zdGVhZC5cbiAgICovXG4gIHNldEFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX2Fzc2lnbkFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQWRkaW5nIGEgdmFsaWRhdG9yIHRoYXQgYWxyZWFkeSBleGlzdHMgd2lsbCBoYXZlIG5vIGVmZmVjdC4gSWYgZHVwbGljYXRlIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICogYXJlIHByZXNlbnQgaW4gdGhlIGB2YWxpZGF0b3JzYCBhcnJheSwgb25seSB0aGUgZmlyc3QgaW5zdGFuY2Ugd291bGQgYmUgYWRkZWQgdG8gYSBmb3JtXG4gICAqIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBuZXcgdmFsaWRhdG9yIGZ1bmN0aW9uIG9yIGZ1bmN0aW9ucyB0byBhZGQgdG8gdGhpcyBjb250cm9sLlxuICAgKi9cbiAgYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbGlkYXRvcnMoYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyXG4gICAqIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQWRkaW5nIGEgdmFsaWRhdG9yIHRoYXQgYWxyZWFkeSBleGlzdHMgd2lsbCBoYXZlIG5vIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIG5ldyBhc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIG9yIGZ1bmN0aW9ucyB0byBhZGQgdG8gdGhpcyBjb250cm9sLlxuICAgKi9cbiAgYWRkQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmcm9tIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsXG4gICAqIGl0IGlzIGlnbm9yZWQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBSZWZlcmVuY2UgdG8gYSBWYWxpZGF0b3JGblxuICAgKlxuICAgKiBgYGBcbiAgICogLy8gUmVmZXJlbmNlIHRvIHRoZSBSZXF1aXJlZFZhbGlkYXRvclxuICAgKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sPHN0cmluZyB8IG51bGw+KCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAgICogY3RybC5yZW1vdmVWYWxpZGF0b3JzKFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICAgKlxuICAgKiAvLyBSZWZlcmVuY2UgdG8gYW5vbnltb3VzIGZ1bmN0aW9uIGluc2lkZSBNaW5WYWxpZGF0b3JcbiAgICogY29uc3QgbWluVmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW4oMyk7XG4gICAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2w8c3RyaW5nIHwgbnVsbD4oJycsIG1pblZhbGlkYXRvcik7XG4gICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihtaW5WYWxpZGF0b3IpKS50b0VxdWFsKHRydWUpXG4gICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihWYWxpZGF0b3JzLm1pbigzKSkpLnRvRXF1YWwoZmFsc2UpXG4gICAqXG4gICAqIGN0cmwucmVtb3ZlVmFsaWRhdG9ycyhtaW5WYWxpZGF0b3IpO1xuICAgKiBgYGBcbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbGlkYXRvcnMocmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnJvbSB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAqIFZhbGlkYXRvcnMgYXJlIGNvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZTsgeW91IG11c3QgcGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZVxuICAgKiB2YWxpZGF0b3IgZnVuY3Rpb24gYXMgdGhlIG9uZSB0aGF0IHdhcyBvcmlnaW5hbGx5IHNldC4gSWYgYSBwcm92aWRlZCB2YWxpZGF0b3IgaXMgbm90IGZvdW5kLCBpdFxuICAgKiBpcyBpZ25vcmVkLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm4gfCBBc3luY1ZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gaXMgcHJlc2VudCBvbiB0aGlzIGNvbnRyb2wuIFRoZSBwcm92aWRlZFxuICAgKiB2YWxpZGF0b3IgbXVzdCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZSBmdW5jdGlvbiB0aGF0IHdhcyBwcm92aWRlZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFJlZmVyZW5jZSB0byBhIFZhbGlkYXRvckZuXG4gICAqXG4gICAqIGBgYFxuICAgKiAvLyBSZWZlcmVuY2UgdG8gdGhlIFJlcXVpcmVkVmFsaWRhdG9yXG4gICAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2w8bnVtYmVyIHwgbnVsbD4oMCwgVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gICAqIGV4cGVjdChjdHJsLmhhc1ZhbGlkYXRvcihWYWxpZGF0b3JzLnJlcXVpcmVkKSkudG9FcXVhbCh0cnVlKVxuICAgKlxuICAgKiAvLyBSZWZlcmVuY2UgdG8gYW5vbnltb3VzIGZ1bmN0aW9uIGluc2lkZSBNaW5WYWxpZGF0b3JcbiAgICogY29uc3QgbWluVmFsaWRhdG9yID0gVmFsaWRhdG9ycy5taW4oMyk7XG4gICAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2w8bnVtYmVyIHwgbnVsbD4oMCwgbWluVmFsaWRhdG9yKTtcbiAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKG1pblZhbGlkYXRvcikpLnRvRXF1YWwodHJ1ZSlcbiAgICogZXhwZWN0KGN0cmwuaGFzVmFsaWRhdG9yKFZhbGlkYXRvcnMubWluKDMpKSkudG9FcXVhbChmYWxzZSlcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3IgVGhlIHZhbGlkYXRvciB0byBjaGVjayBmb3IgcHJlc2VuY2UuIENvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZS5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgcHJvdmlkZWQgdmFsaWRhdG9yIHdhcyBmb3VuZCBvbiB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBoYXNWYWxpZGF0b3IodmFsaWRhdG9yOiBWYWxpZGF0b3JGbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBoYXNWYWxpZGF0b3IodGhpcy5fcmF3VmFsaWRhdG9ycywgdmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gaXMgcHJlc2VudCBvbiB0aGlzIGNvbnRyb2wuIFRoZSBwcm92aWRlZFxuICAgKiB2YWxpZGF0b3IgbXVzdCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZSBmdW5jdGlvbiB0aGF0IHdhcyBwcm92aWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvciBUaGUgYXN5bmNocm9ub3VzIHZhbGlkYXRvciB0byBjaGVjayBmb3IgcHJlc2VuY2UuIENvbXBhcmVkIGJ5IGZ1bmN0aW9uXG4gICAqICAgICByZWZlcmVuY2UuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIHByb3ZpZGVkIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igd2FzIGZvdW5kIG9uIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGhhc0FzeW5jVmFsaWRhdG9yKHZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBoYXNWYWxpZGF0b3IodGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzLCB2YWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgbGlzdC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKi9cbiAgY2xlYXJWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMudmFsaWRhdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbXB0aWVzIG91dCB0aGUgYXN5bmMgdmFsaWRhdG9yIGxpc3QuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICovXG4gIGNsZWFyQXN5bmNWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMuYXN5bmNWYWxpZGF0b3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB0b3VjaGVkYC4gQSBjb250cm9sIGlzIHRvdWNoZWQgYnkgZm9jdXMgYW5kXG4gICAqIGJsdXIgZXZlbnRzIHRoYXQgZG8gbm90IGNoYW5nZSB0aGUgdmFsdWUuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1VudG91Y2hlZCgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNEaXJ0eSgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNQcmlzdGluZSgpfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhIGBUb3VjaGVkQ2hhbmdlRXZlbnRgIHdpdGggdGhlIGB0b3VjaGVkYCBwcm9wZXJ0eSBiZWluZyBgdHJ1ZWAuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIG1hcmtBc1RvdWNoZWQob3B0cz86IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbCBVc2VkIHRvIHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzXG4gICAqL1xuICBtYXJrQXNUb3VjaGVkKG9wdHM/OiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuO1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gICAgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbDtcbiAgfSk6IHZvaWQ7XG4gIG1hcmtBc1RvdWNoZWQoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0gPSB7fSxcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZCA9IHRoaXMudG91Y2hlZCA9PT0gZmFsc2U7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnRvdWNoZWQgPSB0cnVlO1xuXG4gICAgY29uc3Qgc291cmNlQ29udHJvbCA9IG9wdHMuc291cmNlQ29udHJvbCA/PyB0aGlzO1xuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNUb3VjaGVkKHsuLi5vcHRzLCBzb3VyY2VDb250cm9sfSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZWQgJiYgb3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgVG91Y2hlZENoYW5nZUV2ZW50KHRydWUsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYW5kIGFsbCBpdHMgZGVzY2VuZGFudCBjb250cm9scyBhcyBgdG91Y2hlZGAuXG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1RvdWNoZWQoKX1cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBldmVudHNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYSBgVG91Y2hlZENoYW5nZUV2ZW50YCB3aXRoIHRoZSBgdG91Y2hlZGAgcHJvcGVydHkgYmVpbmcgYHRydWVgLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBtYXJrQWxsQXNUb3VjaGVkKG9wdHM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5tYXJrQXNUb3VjaGVkKHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudCwgc291cmNlQ29udHJvbDogdGhpc30pO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wubWFya0FsbEFzVG91Y2hlZChvcHRzKSk7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHVudG91Y2hlZGAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIGFsc28gbWFya3MgYWxsIGNoaWxkcmVuIGFzIGB1bnRvdWNoZWRgXG4gICAqIGFuZCByZWNhbGN1bGF0ZXMgdGhlIGB0b3VjaGVkYCBzdGF0dXMgb2YgYWxsIHBhcmVudCBjb250cm9scy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbWFya0FzVG91Y2hlZCgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNEaXJ0eSgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNQcmlzdGluZSgpfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBldmVudHNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYSBgVG91Y2hlZENoYW5nZUV2ZW50YCB3aXRoIHRoZSBgdG91Y2hlZGAgcHJvcGVydHkgYmVpbmcgYGZhbHNlYC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgbWFya0FzVW50b3VjaGVkKG9wdHM/OiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG4gIC8qKlxuICAgKlxuICAgKiBAaW50ZXJuYWwgVXNlZCB0byBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkc1xuICAgKi9cbiAgbWFya0FzVW50b3VjaGVkKG9wdHM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW47XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgICBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sO1xuICB9KTogdm9pZDtcbiAgbWFya0FzVW50b3VjaGVkKFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9ID0ge30sXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWQgPSB0aGlzLnRvdWNoZWQgPT09IHRydWU7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnRvdWNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9wZW5kaW5nVG91Y2hlZCA9IGZhbHNlO1xuXG4gICAgY29uc3Qgc291cmNlQ29udHJvbCA9IG9wdHMuc291cmNlQ29udHJvbCA/PyB0aGlzO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLm1hcmtBc1VudG91Y2hlZCh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnQsIHNvdXJjZUNvbnRyb2x9KTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzLCBzb3VyY2VDb250cm9sKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlZCAmJiBvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBUb3VjaGVkQ2hhbmdlRXZlbnQoZmFsc2UsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYGRpcnR5YC4gQSBjb250cm9sIGJlY29tZXMgZGlydHkgd2hlblxuICAgKiB0aGUgY29udHJvbCdzIHZhbHVlIGlzIGNoYW5nZWQgdGhyb3VnaCB0aGUgVUk7IGNvbXBhcmUgYG1hcmtBc1RvdWNoZWRgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1VudG91Y2hlZCgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNQcmlzdGluZSgpfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhIGBQcmlzdGluZUNoYW5nZUV2ZW50YCB3aXRoIHRoZSBgcHJpc3RpbmVgIHByb3BlcnR5IGJlaW5nIGBmYWxzZWAuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIG1hcmtBc0RpcnR5KG9wdHM/OiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgVXNlZCB0byBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkc1xuICAgKi9cbiAgbWFya0FzRGlydHkob3B0czoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbjtcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgIHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2w7XG4gIH0pOiB2b2lkO1xuICBtYXJrQXNEaXJ0eShcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkID0gdGhpcy5wcmlzdGluZSA9PT0gdHJ1ZTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikucHJpc3RpbmUgPSBmYWxzZTtcblxuICAgIGNvbnN0IHNvdXJjZUNvbnRyb2wgPSBvcHRzLnNvdXJjZUNvbnRyb2wgPz8gdGhpcztcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzRGlydHkoey4uLm9wdHMsIHNvdXJjZUNvbnRyb2x9KTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlZCAmJiBvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBQcmlzdGluZUNoYW5nZUV2ZW50KGZhbHNlLCBzb3VyY2VDb250cm9sKSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwcmlzdGluZWAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgcHJpc3RpbmVgLFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgcHJpc3RpbmVgIHN0YXR1cyBvZiBhbGwgcGFyZW50XG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNUb3VjaGVkKCl9XG4gICAqIEBzZWUge0BsaW5rIG1hcmtBc1VudG91Y2hlZCgpfVxuICAgKiBAc2VlIHtAbGluayBtYXJrQXNEaXJ0eSgpfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIGVtaXRzIGV2ZW50cyBhZnRlclxuICAgKiBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBldmVudHNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYSBgUHJpc3RpbmVDaGFuZ2VFdmVudGAgd2l0aCB0aGUgYHByaXN0aW5lYCBwcm9wZXJ0eSBiZWluZyBgdHJ1ZWAuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIG1hcmtBc1ByaXN0aW5lKG9wdHM/OiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgVXNlZCB0byBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkc1xuICAgKi9cbiAgbWFya0FzUHJpc3RpbmUob3B0czoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbjtcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgIHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2w7XG4gIH0pOiB2b2lkO1xuICBtYXJrQXNQcmlzdGluZShcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBzb3VyY2VDb250cm9sPzogQWJzdHJhY3RDb250cm9sfSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkID0gdGhpcy5wcmlzdGluZSA9PT0gZmFsc2U7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnByaXN0aW5lID0gdHJ1ZTtcbiAgICB0aGlzLl9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAgIGNvbnN0IHNvdXJjZUNvbnRyb2wgPSBvcHRzLnNvdXJjZUNvbnRyb2wgPz8gdGhpcztcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgLyoqIFdlIGRvbid0IHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzICovXG4gICAgICBjb250cm9sLm1hcmtBc1ByaXN0aW5lKHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzLCBzb3VyY2VDb250cm9sKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlZCAmJiBvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBQcmlzdGluZUNoYW5nZUV2ZW50KHRydWUsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHBlbmRpbmdgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgcGVuZGluZyB3aGlsZSB0aGUgY29udHJvbCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyB0aGUgY29udHJvbCBpcyBtYXJrZWQgcGVuZGluZ1xuICAgKiBhbmQgdGhlIGBldmVudHNgIG9ic2VydmFibGUgZW1pdHMgYSBgU3RhdHVzQ2hhbmdlRXZlbnRgIHdpdGggdGhlIGBzdGF0dXNgIHByb3BlcnR5IGJlaW5nXG4gICAqIGBQRU5ESU5HYCBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICBtYXJrQXNQZW5kaW5nKG9wdHM/OiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWwgVXNlZCB0byBwcm9wYWdhdGUgdGhlIHNvdXJjZSBjb250cm9sIGRvd253YXJkc1xuICAgKi9cbiAgbWFya0FzUGVuZGluZyhvcHRzOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuO1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gICAgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbDtcbiAgfSk6IHZvaWQ7XG4gIG1hcmtBc1BlbmRpbmcoXG4gICAgb3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0gPSB7fSxcbiAgKTogdm9pZCB7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnN0YXR1cyA9IFBFTkRJTkc7XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFN0YXR1c0NoYW5nZUV2ZW50KHRoaXMuc3RhdHVzLCBzb3VyY2VDb250cm9sKSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNQZW5kaW5nKHsuLi5vcHRzLCBzb3VyY2VDb250cm9sfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHRoZSBjb250cm9sLiBUaGlzIG1lYW5zIHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiBleGNsdWRlZCBmcm9tIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgYW55IHBhcmVudC4gSXRzIHN0YXR1cyBpcyBgRElTQUJMRURgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgY2hpbGRyZW4sIGFsbCBjaGlsZHJlbiBhcmUgYWxzbyBkaXNhYmxlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzXG4gICAqIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgLFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBhbmQgYGV2ZW50c2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgZGlzYWJsZShvcHRzPzoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICAvKipcbiAgICogQGludGVybmFsIFVzZWQgdG8gcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHNcbiAgICovXG4gIGRpc2FibGUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbjsgc291cmNlQ29udHJvbD86IEFic3RyYWN0Q29udHJvbH0pOiB2b2lkO1xuICBkaXNhYmxlKFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9ID0ge30sXG4gICk6IHZvaWQge1xuICAgIC8vIElmIHBhcmVudCBoYXMgYmVlbiBtYXJrZWQgYXJ0aWZpY2lhbGx5IGRpcnR5IHdlIGRvbid0IHdhbnQgdG8gcmUtY2FsY3VsYXRlIHRoZVxuICAgIC8vIHBhcmVudCdzIGRpcnRpbmVzcyBiYXNlZCBvbiB0aGUgY2hpbGRyZW4uXG4gICAgY29uc3Qgc2tpcFByaXN0aW5lQ2hlY2sgPSB0aGlzLl9wYXJlbnRNYXJrZWREaXJ0eShvcHRzLm9ubHlTZWxmKTtcblxuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdGF0dXMgPSBESVNBQkxFRDtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuZXJyb3JzID0gbnVsbDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgLyoqIFdlIGRvbid0IHByb3BhZ2F0ZSB0aGUgc291cmNlIGNvbnRyb2wgZG93bndhcmRzICovXG4gICAgICBjb250cm9sLmRpc2FibGUoey4uLm9wdHMsIG9ubHlTZWxmOiB0cnVlfSk7XG4gICAgfSk7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcblxuICAgIGNvbnN0IHNvdXJjZUNvbnRyb2wgPSBvcHRzLnNvdXJjZUNvbnRyb2wgPz8gdGhpcztcbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgVmFsdWVDaGFuZ2VFdmVudCh0aGlzLnZhbHVlLCBzb3VyY2VDb250cm9sKSk7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgU3RhdHVzQ2hhbmdlRXZlbnQodGhpcy5zdGF0dXMsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICAgICh0aGlzLnZhbHVlQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8VFZhbHVlPikuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPEZvcm1Db250cm9sU3RhdHVzPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXBkYXRlQW5jZXN0b3JzKHsuLi5vcHRzLCBza2lwUHJpc3RpbmVDaGVja30sIHRoaXMpO1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKHRydWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSBjb250cm9sLiBUaGlzIG1lYW5zIHRoZSBjb250cm9sIGlzIGluY2x1ZGVkIGluIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGl0cyBwYXJlbnQuIEl0cyBzdGF0dXMgcmVjYWxjdWxhdGVzIGJhc2VkIG9uIGl0cyB2YWx1ZSBhbmRcbiAgICogaXRzIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIGlmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBlbmFibGVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGNvbnRyb2wgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIHdoZW4gbWFya2VkIGFzIHVudG91Y2hlZFxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2AsXG4gICAqIGB2YWx1ZUNoYW5nZXNgIGFuZCBgZXZlbnRzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGVuYWJsZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIGVuYWJsZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgLy8gSWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkgd2UgZG9uJ3Qgd2FudCB0byByZS1jYWxjdWxhdGUgdGhlXG4gICAgLy8gcGFyZW50J3MgZGlydGluZXNzIGJhc2VkIG9uIHRoZSBjaGlsZHJlbi5cbiAgICBjb25zdCBza2lwUHJpc3RpbmVDaGVjayA9IHRoaXMuX3BhcmVudE1hcmtlZERpcnR5KG9wdHMub25seVNlbGYpO1xuXG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnN0YXR1cyA9IFZBTElEO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLmVuYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSwgdGhpcyk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4oZmFsc2UpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUFuY2VzdG9ycyhcbiAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuOyBlbWl0RXZlbnQ/OiBib29sZWFuOyBza2lwUHJpc3RpbmVDaGVjaz86IGJvb2xlYW59LFxuICAgIHNvdXJjZUNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCxcbiAgKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyk7XG4gICAgICBpZiAoIW9wdHMuc2tpcFByaXN0aW5lQ2hlY2spIHtcbiAgICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZSh7fSwgc291cmNlQ29udHJvbCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQoe30sIHNvdXJjZUNvbnRyb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYXJlbnQgb2YgdGhlIGNvbnRyb2xcbiAgICpcbiAgICogQHBhcmFtIHBhcmVudCBUaGUgbmV3IHBhcmVudC5cbiAgICovXG4gIHNldFBhcmVudChwYXJlbnQ6IEZvcm1Hcm91cCB8IEZvcm1BcnJheSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0VmFsdWUodmFsdWU6IFRSYXdWYWx1ZSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHBhdGNoVmFsdWUodmFsdWU6IFRWYWx1ZSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCByZXNldCh2YWx1ZT86IFRWYWx1ZSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFRoZSByYXcgdmFsdWUgb2YgdGhpcyBjb250cm9sLiBGb3IgbW9zdCBjb250cm9sIGltcGxlbWVudGF0aW9ucywgdGhlIHJhdyB2YWx1ZSB3aWxsIGluY2x1ZGVcbiAgICogZGlzYWJsZWQgY2hpbGRyZW4uXG4gICAqL1xuICBnZXRSYXdWYWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpdCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiBpdHMgYW5jZXN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50c1xuICAgKiBhZnRlciB1cGRhdGVzIGFuZCB2YWxpZGl0eSBjaGVja3MgYXJlIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBvbmx5IHVwZGF0ZSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiB1cGRhdGUgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYCxcbiAgICogYHZhbHVlQ2hhbmdlc2AgYW5kIGBldmVudHNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzPzoge29ubHlTZWxmPzogYm9vbGVhbjsgZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICAvKipcbiAgICogQGludGVybmFsIFVzZWQgdG8gcHJvcGFnYXRlIHRoZSBzb3VyY2UgY29udHJvbCBkb3dud2FyZHNcbiAgICovXG4gIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0czoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbjtcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuO1xuICAgIHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2w7XG4gIH0pOiB2b2lkO1xuICB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KFxuICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW47IGVtaXRFdmVudD86IGJvb2xlYW47IHNvdXJjZUNvbnRyb2w/OiBBYnN0cmFjdENvbnRyb2x9ID0ge30sXG4gICk6IHZvaWQge1xuICAgIHRoaXMuX3NldEluaXRpYWxTdGF0dXMoKTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgY29uc3Qgc2hvdWxkSGF2ZUVtaXR0ZWQgPSB0aGlzLl9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpO1xuXG4gICAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuZXJyb3JzID0gdGhpcy5fcnVuVmFsaWRhdG9yKCk7XG4gICAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG5cbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gVkFMSUQgfHwgdGhpcy5zdGF0dXMgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgLy8gSWYgdGhlIGNhbmNlbGVkIHN1YnNjcmlwdGlvbiBzaG91bGQgaGF2ZSBlbWl0dGVkXG4gICAgICAgIC8vIHdlIG1ha2Ugc3VyZSB0aGUgYXN5bmMgdmFsaWRhdG9yIGVtaXRzIHRoZSBzdGF0dXMgY2hhbmdlIG9uIGNvbXBsZXRpb25cbiAgICAgICAgdGhpcy5fcnVuQXN5bmNWYWxpZGF0b3Ioc2hvdWxkSGF2ZUVtaXR0ZWQsIG9wdHMuZW1pdEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VDb250cm9sID0gb3B0cy5zb3VyY2VDb250cm9sID8/IHRoaXM7XG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFZhbHVlQ2hhbmdlRXZlbnQ8VFZhbHVlPih0aGlzLnZhbHVlLCBzb3VyY2VDb250cm9sKSk7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgU3RhdHVzQ2hhbmdlRXZlbnQodGhpcy5zdGF0dXMsIHNvdXJjZUNvbnRyb2wpKTtcbiAgICAgICh0aGlzLnZhbHVlQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8VFZhbHVlPikuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPEZvcm1Db250cm9sU3RhdHVzPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoey4uLm9wdHMsIHNvdXJjZUNvbnRyb2x9KTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUcmVlVmFsaWRpdHkob3B0czoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge2VtaXRFdmVudDogdHJ1ZX0pOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGN0cmw6IEFic3RyYWN0Q29udHJvbCkgPT4gY3RybC5fdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHMpKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRJbml0aWFsU3RhdHVzKCkge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdGF0dXMgPSB0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkgPyBESVNBQkxFRCA6IFZBTElEO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuVmFsaWRhdG9yKCk6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy52YWxpZGF0b3IgPyB0aGlzLnZhbGlkYXRvcih0aGlzKSA6IG51bGw7XG4gIH1cblxuICBwcml2YXRlIF9ydW5Bc3luY1ZhbGlkYXRvcihzaG91bGRIYXZlRW1pdHRlZDogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gUEVORElORztcbiAgICAgIHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IHtlbWl0RXZlbnQ6IGVtaXRFdmVudCAhPT0gZmFsc2V9O1xuICAgICAgY29uc3Qgb2JzID0gdG9PYnNlcnZhYmxlKHRoaXMuYXN5bmNWYWxpZGF0b3IodGhpcykpO1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uID0gb2JzLnN1YnNjcmliZSgoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCkgPT4ge1xuICAgICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBudWxsO1xuICAgICAgICAvLyBUaGlzIHdpbGwgdHJpZ2dlciB0aGUgcmVjYWxjdWxhdGlvbiBvZiB0aGUgdmFsaWRhdGlvbiBzdGF0dXMsIHdoaWNoIGRlcGVuZHMgb25cbiAgICAgICAgLy8gdGhlIHN0YXRlIG9mIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiAod2hldGhlciBpdCBpcyBpbiBwcm9ncmVzcyBvciBub3QpLiBTbywgaXQgaXNcbiAgICAgICAgLy8gbmVjZXNzYXJ5IHRoYXQgd2UgaGF2ZSB1cGRhdGVkIHRoZSBgX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvcmAgYm9vbGVhbiBmbGFnIGZpcnN0LlxuICAgICAgICB0aGlzLnNldEVycm9ycyhlcnJvcnMsIHtlbWl0RXZlbnQsIHNob3VsZEhhdmVFbWl0dGVkfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblxuICAgICAgLy8gd2UncmUgY2FuY2VsbGluZyB0aGUgdmFsaWRhdG9yIHN1YnNjcmlidGlvbiwgd2Uga2VlcCBpZiBpdCBzaG91bGQgaGF2ZSBlbWl0dGVkXG4gICAgICAvLyBiZWNhdXNlIHdlIHdhbnQgdG8gZW1pdCBldmVudHVhbGx5IGlmIGl0IHdhcyByZXF1aXJlZCBhdCBsZWFzdCBvbmNlLlxuICAgICAgY29uc3Qgc2hvdWxkSGF2ZUVtaXR0ZWQgPSB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3I/LmVtaXRFdmVudCA/PyBmYWxzZTtcbiAgICAgIHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IG51bGw7XG4gICAgICByZXR1cm4gc2hvdWxkSGF2ZUVtaXR0ZWQ7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGVycm9ycyBvbiBhIGZvcm0gY29udHJvbCB3aGVuIHJ1bm5pbmcgdmFsaWRhdGlvbnMgbWFudWFsbHksIHJhdGhlciB0aGFuIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIENhbGxpbmcgYHNldEVycm9yc2AgYWxzbyB1cGRhdGVzIHRoZSB2YWxpZGl0eSBvZiB0aGUgcGFyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgZXJyb3JzIGFyZSBzZXQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGFuIGV2ZW50IGFmdGVyIHRoZSBlcnJvcnMgYXJlIHNldC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIE1hbnVhbGx5IHNldCB0aGUgZXJyb3JzIGZvciBhIGNvbnRyb2xcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGxvZ2luID0gbmV3IEZvcm1Db250cm9sKCdzb21lTG9naW4nKTtcbiAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAqIGV4cGVjdChsb2dpbi5lcnJvcnMpLnRvRXF1YWwoeyBub3RVbmlxdWU6IHRydWUgfSk7XG4gICAqXG4gICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc2V0RXJyb3JzKGVycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwsIG9wdHM/OiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgc2V0RXJyb3JzKFxuICAgIGVycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGwsXG4gICAgb3B0cz86IHtlbWl0RXZlbnQ/OiBib29sZWFuOyBzaG91bGRIYXZlRW1pdHRlZD86IGJvb2xlYW59LFxuICApOiB2b2lkO1xuICBzZXRFcnJvcnMoXG4gICAgZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbCxcbiAgICBvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbjsgc2hvdWxkSGF2ZUVtaXR0ZWQ/OiBib29sZWFufSA9IHt9LFxuICApOiB2b2lkIHtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuZXJyb3JzID0gZXJyb3JzO1xuICAgIHRoaXMuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSwgdGhpcywgb3B0cy5zaG91bGRIYXZlRW1pdHRlZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgY2hpbGQgY29udHJvbCBnaXZlbiB0aGUgY29udHJvbCdzIG5hbWUgb3IgcGF0aC5cbiAgICpcbiAgICogVGhpcyBzaWduYXR1cmUgZm9yIGdldCBzdXBwb3J0cyBzdHJpbmdzIGFuZCBgY29uc3RgIGFycmF5cyAoYC5nZXQoWydmb28nLCAnYmFyJ10gYXMgY29uc3QpYCkuXG4gICAqL1xuICBnZXQ8UCBleHRlbmRzIHN0cmluZyB8IHJlYWRvbmx5IChzdHJpbmcgfCBudW1iZXIpW10+KFxuICAgIHBhdGg6IFAsXG4gICk6IEFic3RyYWN0Q29udHJvbDzJtUdldFByb3BlcnR5PFRSYXdWYWx1ZSwgUD4+IHwgbnVsbDtcblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgY2hpbGQgY29udHJvbCBnaXZlbiB0aGUgY29udHJvbCdzIG5hbWUgb3IgcGF0aC5cbiAgICpcbiAgICogVGhpcyBzaWduYXR1cmUgZm9yIGBnZXRgIHN1cHBvcnRzIG5vbi1jb25zdCAobXV0YWJsZSkgYXJyYXlzLiBJbmZlcnJlZCB0eXBlXG4gICAqIGluZm9ybWF0aW9uIHdpbGwgbm90IGJlIGFzIHJvYnVzdCwgc28gcHJlZmVyIHRvIHBhc3MgYSBgcmVhZG9ubHlgIGFycmF5IGlmIHBvc3NpYmxlLlxuICAgKi9cbiAgZ2V0PFAgZXh0ZW5kcyBzdHJpbmcgfCBBcnJheTxzdHJpbmcgfCBudW1iZXI+PihcbiAgICBwYXRoOiBQLFxuICApOiBBYnN0cmFjdENvbnRyb2w8ybVHZXRQcm9wZXJ0eTxUUmF3VmFsdWUsIFA+PiB8IG51bGw7XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyBhIGNoaWxkIGNvbnRyb2wgZ2l2ZW4gdGhlIGNvbnRyb2wncyBuYW1lIG9yIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoIEEgZG90LWRlbGltaXRlZCBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5nL251bWJlciB2YWx1ZXMgdGhhdCBkZWZpbmUgdGhlIHBhdGggdG8gdGhlXG4gICAqIGNvbnRyb2wuIElmIGEgc3RyaW5nIGlzIHByb3ZpZGVkLCBwYXNzaW5nIGl0IGFzIGEgc3RyaW5nIGxpdGVyYWwgd2lsbCByZXN1bHQgaW4gaW1wcm92ZWQgdHlwZVxuICAgKiBpbmZvcm1hdGlvbi4gTGlrZXdpc2UsIGlmIGFuIGFycmF5IGlzIHByb3ZpZGVkLCBwYXNzaW5nIGl0IGBhcyBjb25zdGAgd2lsbCBjYXVzZSBpbXByb3ZlZCB0eXBlXG4gICAqIGluZm9ybWF0aW9uIHRvIGJlIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJldHJpZXZlIGEgbmVzdGVkIGNvbnRyb2xcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBuYW1lYCBjb250cm9sIG5lc3RlZCB3aXRoaW4gYSBgcGVyc29uYCBzdWItZ3JvdXA6XG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoJ3BlcnNvbi5uYW1lJyk7YFxuICAgKlxuICAgKiAtT1ItXG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoWydwZXJzb24nLCAnbmFtZSddIGFzIGNvbnN0KTtgIC8vIGBhcyBjb25zdGAgZ2l2ZXMgaW1wcm92ZWQgdHlwaW5nc1xuICAgKlxuICAgKiAjIyMgUmV0cmlldmUgYSBjb250cm9sIGluIGEgRm9ybUFycmF5XG4gICAqXG4gICAqIFdoZW4gYWNjZXNzaW5nIGFuIGVsZW1lbnQgaW5zaWRlIGEgRm9ybUFycmF5LCB5b3UgY2FuIHVzZSBhbiBlbGVtZW50IGluZGV4LlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gZ2V0IGEgYHByaWNlYCBjb250cm9sIGZyb20gdGhlIGZpcnN0IGVsZW1lbnQgaW4gYW4gYGl0ZW1zYCBhcnJheSB5b3UgY2FuIHVzZTpcbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldCgnaXRlbXMuMC5wcmljZScpO2BcbiAgICpcbiAgICogLU9SLVxuICAgKlxuICAgKiAqIGB0aGlzLmZvcm0uZ2V0KFsnaXRlbXMnLCAwLCAncHJpY2UnXSk7YFxuICAgKi9cbiAgZ2V0PFAgZXh0ZW5kcyBzdHJpbmcgfCAoc3RyaW5nIHwgbnVtYmVyKVtdPihcbiAgICBwYXRoOiBQLFxuICApOiBBYnN0cmFjdENvbnRyb2w8ybVHZXRQcm9wZXJ0eTxUUmF3VmFsdWUsIFA+PiB8IG51bGwge1xuICAgIGxldCBjdXJyUGF0aDogQXJyYXk8c3RyaW5nIHwgbnVtYmVyPiB8IHN0cmluZyA9IHBhdGg7XG4gICAgaWYgKGN1cnJQYXRoID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShjdXJyUGF0aCkpIGN1cnJQYXRoID0gY3VyclBhdGguc3BsaXQoJy4nKTtcbiAgICBpZiAoY3VyclBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gY3VyclBhdGgucmVkdWNlKFxuICAgICAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCB8IG51bGwsIG5hbWUpID0+IGNvbnRyb2wgJiYgY29udHJvbC5fZmluZChuYW1lKSxcbiAgICAgIHRoaXMsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyBlcnJvciBkYXRhIGZvciB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gZXJyb3JDb2RlIFRoZSBjb2RlIG9mIHRoZSBlcnJvciB0byBjaGVja1xuICAgKiBAcGFyYW0gcGF0aCBBIGxpc3Qgb2YgY29udHJvbCBuYW1lcyB0aGF0IGRlc2lnbmF0ZXMgaG93IHRvIG1vdmUgZnJvbSB0aGUgY3VycmVudCBjb250cm9sXG4gICAqIHRvIHRoZSBjb250cm9sIHRoYXQgc2hvdWxkIGJlIHF1ZXJpZWQgZm9yIGVycm9ycy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogRm9yIGV4YW1wbGUsIGZvciB0aGUgZm9sbG93aW5nIGBGb3JtR3JvdXBgOlxuICAgKlxuICAgKiBgYGBcbiAgICogZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGFkZHJlc3M6IG5ldyBGb3JtR3JvdXAoeyBzdHJlZXQ6IG5ldyBGb3JtQ29udHJvbCgpIH0pXG4gICAqIH0pO1xuICAgKiBgYGBcbiAgICpcbiAgICogVGhlIHBhdGggdG8gdGhlICdzdHJlZXQnIGNvbnRyb2wgZnJvbSB0aGUgcm9vdCBmb3JtIHdvdWxkIGJlICdhZGRyZXNzJyAtPiAnc3RyZWV0Jy5cbiAgICpcbiAgICogSXQgY2FuIGJlIHByb3ZpZGVkIHRvIHRoaXMgbWV0aG9kIGluIG9uZSBvZiB0d28gZm9ybWF0czpcbiAgICpcbiAgICogMS4gQW4gYXJyYXkgb2Ygc3RyaW5nIGNvbnRyb2wgbmFtZXMsIGUuZy4gYFsnYWRkcmVzcycsICdzdHJlZXQnXWBcbiAgICogMS4gQSBwZXJpb2QtZGVsaW1pdGVkIGxpc3Qgb2YgY29udHJvbCBuYW1lcyBpbiBvbmUgc3RyaW5nLCBlLmcuIGAnYWRkcmVzcy5zdHJlZXQnYFxuICAgKlxuICAgKiBAcmV0dXJucyBlcnJvciBkYXRhIGZvciB0aGF0IHBhcnRpY3VsYXIgZXJyb3IuIElmIHRoZSBjb250cm9sIG9yIGVycm9yIGlzIG5vdCBwcmVzZW50LFxuICAgKiBudWxsIGlzIHJldHVybmVkLlxuICAgKi9cbiAgZ2V0RXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcsIHBhdGg/OiBBcnJheTxzdHJpbmcgfCBudW1iZXI+IHwgc3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBjb250cm9sID0gcGF0aCA/IHRoaXMuZ2V0KHBhdGgpIDogdGhpcztcbiAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sLmVycm9ycyA/IGNvbnRyb2wuZXJyb3JzW2Vycm9yQ29kZV0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGVycm9yIHNwZWNpZmllZC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogSWYgbm8gcGF0aCBpcyBnaXZlbiwgdGhpcyBtZXRob2QgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIGZhbHNlIGlzIHJldHVybmVkLlxuICAgKi9cbiAgaGFzRXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcsIHBhdGg/OiBBcnJheTxzdHJpbmcgfCBudW1iZXI+IHwgc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5nZXRFcnJvcihlcnJvckNvZGUsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgdG9wLWxldmVsIGFuY2VzdG9yIG9mIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGdldCByb290KCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgbGV0IHg6IEFic3RyYWN0Q29udHJvbCA9IHRoaXM7XG5cbiAgICB3aGlsZSAoeC5fcGFyZW50KSB7XG4gICAgICB4ID0geC5fcGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiB4O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlQ29udHJvbHNFcnJvcnMoXG4gICAgZW1pdEV2ZW50OiBib29sZWFuLFxuICAgIGNoYW5nZWRDb250cm9sOiBBYnN0cmFjdENvbnRyb2wsXG4gICAgc2hvdWxkSGF2ZUVtaXR0ZWQ/OiBib29sZWFuLFxuICApOiB2b2lkIHtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG5cbiAgICBpZiAoZW1pdEV2ZW50KSB7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIC8vIFRoZSBFdmVudHMgT2JzZXJ2YWJsZSBleHBvc2UgYSBzbGlnaHQgZGlmZmVyZW50IGJldmFoaW9yIHRoYW4gdGhlIHN0YXR1c0NoYW5nZXMgb2JzXG4gICAgLy8gQW4gYXN5bmMgdmFsaWRhdG9yIHdpbGwgc3RpbGwgZW1pdCBhIFN0YXR1c0NoYW5nZUV2ZW50IGlzIGEgcHJldmlvdXNseSBjYW5jZWxsZWRcbiAgICAvLyBhc3luYyB2YWxpZGF0b3IgaGFzIGVtaXRFdmVudCBzZXQgdG8gdHJ1ZVxuICAgIGlmIChlbWl0RXZlbnQgfHwgc2hvdWxkSGF2ZUVtaXR0ZWQpIHtcbiAgICAgIHRoaXMuX2V2ZW50cy5uZXh0KG5ldyBTdGF0dXNDaGFuZ2VFdmVudCh0aGlzLnN0YXR1cywgY2hhbmdlZENvbnRyb2wpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKGVtaXRFdmVudCwgY2hhbmdlZENvbnRyb2wsIHNob3VsZEhhdmVFbWl0dGVkKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9pbml0T2JzZXJ2YWJsZXMoKSB7XG4gICAgKHRoaXMgYXMgV3JpdGFibGU8dGhpcz4pLnZhbHVlQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3RhdHVzQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NhbGN1bGF0ZVN0YXR1cygpOiBGb3JtQ29udHJvbFN0YXR1cyB7XG4gICAgaWYgKHRoaXMuX2FsbENvbnRyb2xzRGlzYWJsZWQoKSkgcmV0dXJuIERJU0FCTEVEO1xuICAgIGlmICh0aGlzLmVycm9ycykgcmV0dXJuIElOVkFMSUQ7XG4gICAgaWYgKHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciB8fCB0aGlzLl9hbnlDb250cm9sc0hhdmVTdGF0dXMoUEVORElORykpIHJldHVybiBQRU5ESU5HO1xuICAgIGlmICh0aGlzLl9hbnlDb250cm9sc0hhdmVTdGF0dXMoSU5WQUxJRCkpIHJldHVybiBJTlZBTElEO1xuICAgIHJldHVybiBWQUxJRDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX3VwZGF0ZVZhbHVlKCk6IHZvaWQ7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfZm9yRWFjaENoaWxkKGNiOiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiB2b2lkKTogdm9pZDtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9hbnlDb250cm9scyhjb25kaXRpb246IChjOiBBYnN0cmFjdENvbnRyb2wpID0+IGJvb2xlYW4pOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNIYXZlU3RhdHVzKHN0YXR1czogRm9ybUNvbnRyb2xTdGF0dXMpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5zdGF0dXMgPT09IHN0YXR1cyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc0RpcnR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLmRpcnR5KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzVG91Y2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC50b3VjaGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVByaXN0aW5lKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59LCBjaGFuZ2VkQ29udHJvbDogQWJzdHJhY3RDb250cm9sKTogdm9pZCB7XG4gICAgY29uc3QgbmV3UHJpc3RpbmUgPSAhdGhpcy5fYW55Q29udHJvbHNEaXJ0eSgpO1xuICAgIGNvbnN0IGNoYW5nZWQgPSB0aGlzLnByaXN0aW5lICE9PSBuZXdQcmlzdGluZTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikucHJpc3RpbmUgPSBuZXdQcmlzdGluZTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUob3B0cywgY2hhbmdlZENvbnRyb2wpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VkKSB7XG4gICAgICB0aGlzLl9ldmVudHMubmV4dChuZXcgUHJpc3RpbmVDaGFuZ2VFdmVudCh0aGlzLnByaXN0aW5lLCBjaGFuZ2VkQ29udHJvbCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRvdWNoZWQob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSwgY2hhbmdlZENvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS50b3VjaGVkID0gdGhpcy5fYW55Q29udHJvbHNUb3VjaGVkKCk7XG4gICAgdGhpcy5fZXZlbnRzLm5leHQobmV3IFRvdWNoZWRDaGFuZ2VFdmVudCh0aGlzLnRvdWNoZWQsIGNoYW5nZWRDb250cm9sKSk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQob3B0cywgY2hhbmdlZENvbnRyb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uRGlzYWJsZWRDaGFuZ2U6IEFycmF5PChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB2b2lkPiA9IFtdO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcGRhdGVTdHJhdGVneShvcHRzPzogVmFsaWRhdG9yRm4gfCBWYWxpZGF0b3JGbltdIHwgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoaXNPcHRpb25zT2JqKG9wdHMpICYmIG9wdHMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdXBkYXRlT24gPSBvcHRzLnVwZGF0ZU9uITtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9wYXJlbnRNYXJrZWREaXJ0eShvbmx5U2VsZj86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJlbnREaXJ0eSA9IHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuZGlydHk7XG4gICAgcmV0dXJuICFvbmx5U2VsZiAmJiAhIXBhcmVudERpcnR5ICYmICF0aGlzLl9wYXJlbnQhLl9hbnlDb250cm9sc0RpcnR5KCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9maW5kKG5hbWU6IHN0cmluZyB8IG51bWJlcik6IEFic3RyYWN0Q29udHJvbCB8IG51bGwge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgc2V0VmFsaWRhdG9yc2AgbWV0aG9kLiBOZWVkcyB0byBiZSBzZXBhcmF0ZWQgb3V0IGludG8gYVxuICAgKiBkaWZmZXJlbnQgbWV0aG9kLCBiZWNhdXNlIGl0IGlzIGNhbGxlZCBpbiB0aGUgY29uc3RydWN0b3IgYW5kIGl0IGNhbiBicmVhayBjYXNlcyB3aGVyZVxuICAgKiBhIGNvbnRyb2wgaXMgZXh0ZW5kZWQuXG4gICAqL1xuICBwcml2YXRlIF9hc3NpZ25WYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JzKSA/IHZhbGlkYXRvcnMuc2xpY2UoKSA6IHZhbGlkYXRvcnM7XG4gICAgdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IGNvZXJjZVRvVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGltcGxlbWVudGF0aW9uIG9mIHRoZSBgc2V0QXN5bmNWYWxpZGF0b3JzYCBtZXRob2QuIE5lZWRzIHRvIGJlIHNlcGFyYXRlZCBvdXQgaW50byBhXG4gICAqIGRpZmZlcmVudCBtZXRob2QsIGJlY2F1c2UgaXQgaXMgY2FsbGVkIGluIHRoZSBjb25zdHJ1Y3RvciBhbmQgaXQgY2FuIGJyZWFrIGNhc2VzIHdoZXJlXG4gICAqIGEgY29udHJvbCBpcyBleHRlbmRlZC5cbiAgICovXG4gIHByaXZhdGUgX2Fzc2lnbkFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZuIHwgQXN5bmNWYWxpZGF0b3JGbltdIHwgbnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyA9IEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgPyB2YWxpZGF0b3JzLnNsaWNlKCkgOiB2YWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IodGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxufVxuIl19