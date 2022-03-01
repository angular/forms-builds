/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, ɵRuntimeError as RuntimeError } from '@angular/core';
import { missingControlError, missingControlValueError, noControlsError } from '../directives/reactive_errors';
import { addValidators, composeAsyncValidators, composeValidators, hasValidator, removeValidators, toObservable } from '../validators';
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
/**
 * Constant indicating that a control is valid, meaning that no errors exist in the input value.
 *
 * @see `status`
 */
export const VALID = 'VALID';
/**
 * Constant indicating that a control is invalid, meaning that an error exists in the input value.
 *
 * @see `status`
 */
export const INVALID = 'INVALID';
/**
 * Constant indicating that a control is pending, meaning that that async validation is occurring
 * and errors are not yet available for the input value.
 *
 * @see `markAsPending`
 * @see `status`
 */
export const PENDING = 'PENDING';
/**
 * Constant indicating that a control is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see `markAsDisabled`
 * @see `status`
 */
export const DISABLED = 'DISABLED';
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
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
/**
 * Creates async validator function by combining provided async validators.
 */
function coerceToAsyncValidator(asyncValidator) {
    return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) :
        asyncValidator || null;
}
export function isOptionsObj(validatorOrOpts) {
    return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
        typeof validatorOrOpts === 'object';
}
export function assertControlPresent(parent, isGroup, key) {
    const controls = parent.controls;
    const collection = isGroup ? Object.keys(controls) : controls;
    if (!collection.length) {
        throw new RuntimeError(1000 /* NO_CONTROLS */, NG_DEV_MODE ? noControlsError(isGroup) : '');
    }
    if (!controls[key]) {
        throw new RuntimeError(1001 /* MISSING_CONTROL */, NG_DEV_MODE ? missingControlError(isGroup, key) : '');
    }
}
export function assertAllValuesPresent(control, isGroup, value) {
    control._forEachChild(((_, key) => {
        if (value[key] === undefined) {
            throw new RuntimeError(1002 /* MISSING_CONTROL_VALUE */, NG_DEV_MODE ? missingControlValueError(isGroup, key) : '');
        }
    }));
}
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
        /** @internal */
        this._onDisabledChange = [];
        this._rawValidators = validators;
        this._rawAsyncValidators = asyncValidators;
        this._composedValidatorFn = coerceToValidator(this._rawValidators);
        this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
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
        return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
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
        this._rawValidators = validators;
        this._composedValidatorFn = coerceToValidator(validators);
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
        this._rawAsyncValidators = validators;
        this._composedAsyncValidatorFn = coerceToAsyncValidator(validators);
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
    markAsTouched(opts = {}) {
        this.touched = true;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched(opts);
        }
    }
    /**
     * Marks the control and all its descendant controls as `touched`.
     * @see `markAsTouched()`
     */
    markAllAsTouched() {
        this.markAsTouched({ onlySelf: true });
        this._forEachChild((control) => control.markAllAsTouched());
    }
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
    markAsUntouched(opts = {}) {
        this.touched = false;
        this._pendingTouched = false;
        this._forEachChild((control) => {
            control.markAsUntouched({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
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
    markAsDirty(opts = {}) {
        this.pristine = false;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsDirty(opts);
        }
    }
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
    markAsPristine(opts = {}) {
        this.pristine = true;
        this._pendingDirty = false;
        this._forEachChild((control) => {
            control.markAsPristine({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
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
    markAsPending(opts = {}) {
        this.status = PENDING;
        if (opts.emitEvent !== false) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsPending(opts);
        }
    }
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
    disable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild((control) => {
            control.disable({ ...opts, onlySelf: true });
        });
        this._updateValue();
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        this._updateAncestors({ ...opts, skipPristineCheck });
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
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
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
        this._updateAncestors({ ...opts, skipPristineCheck });
        this._onDisabledChange.forEach((changeFn) => changeFn(false));
    }
    _updateAncestors(opts) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            if (!opts.skipPristineCheck) {
                this._parent._updatePristine();
            }
            this._parent._updateTouched();
        }
    }
    /**
     * @param parent Sets the parent of the control
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
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
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
        this._updateControlsErrors(opts.emitEvent !== false);
    }
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
    get(path) {
        if (path == null)
            return null;
        if (!Array.isArray(path))
            path = path.split('.');
        if (path.length === 0)
            return null;
        return path.reduce((control, name) => control && control._find(name), this);
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
    _updateControlsErrors(emitEvent) {
        this.status = this._calculateStatus();
        if (emitEvent) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent);
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
    _updatePristine(opts = {}) {
        this.pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /** @internal */
    _updateTouched(opts = {}) {
        this.touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /** @internal */
    _isBoxedValue(formState) {
        return typeof formState === 'object' && formState !== null &&
            Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfbW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwvYWJzdHJhY3RfbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxhQUFhLElBQUksWUFBWSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRzFFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBRSxlQUFlLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztBQUk3RyxPQUFPLEVBQUMsYUFBYSxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFckksTUFBTSxXQUFXLEdBQUcsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFFcEU7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7QUFFN0I7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFakM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUVqQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBbUJuQzs7R0FFRztBQUNILE1BQU0sVUFBVSxjQUFjLENBQUMsZUFDSTtJQUNqQyxPQUFPLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDaEcsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBUyxpQkFBaUIsQ0FBQyxTQUF5QztJQUNsRSxPQUFPLEtBQUssQ0FB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SSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFTLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBQ0Q7Ozs7T0FJRztJQUNLLGtCQUFrQixDQUFDLFFBQWtCO1FBQzNDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdkQsT0FBTyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQVEsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzFFLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsS0FBSyxDQUFDLElBQW1CO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RXZlbnRFbWl0dGVyLCDJtVJ1bnRpbWVFcnJvciBhcyBSdW50aW1lRXJyb3J9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHttaXNzaW5nQ29udHJvbEVycm9yLCBtaXNzaW5nQ29udHJvbFZhbHVlRXJyb3IsIG5vQ29udHJvbHNFcnJvcn0gZnJvbSAnLi4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0aW9uRXJyb3JzLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7UnVudGltZUVycm9yQ29kZX0gZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCB7Rm9ybUFycmF5LCBGb3JtR3JvdXB9IGZyb20gJy4uL2Zvcm1zJztcbmltcG9ydCB7YWRkVmFsaWRhdG9ycywgY29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIGhhc1ZhbGlkYXRvciwgcmVtb3ZlVmFsaWRhdG9ycywgdG9PYnNlcnZhYmxlfSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuY29uc3QgTkdfREVWX01PREUgPSB0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCAhIW5nRGV2TW9kZTtcblxuLyoqXG4gKiBDb25zdGFudCBpbmRpY2F0aW5nIHRoYXQgYSBjb250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJRCA9ICdWQUxJRCc7XG5cbi8qKlxuICogQ29uc3RhbnQgaW5kaWNhdGluZyB0aGF0IGEgY29udHJvbCBpcyBpbnZhbGlkLCBtZWFuaW5nIHRoYXQgYW4gZXJyb3IgZXhpc3RzIGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBJTlZBTElEID0gJ0lOVkFMSUQnO1xuXG4vKipcbiAqIENvbnN0YW50IGluZGljYXRpbmcgdGhhdCBhIGNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IHRoYXQgYXN5bmMgdmFsaWRhdGlvbiBpcyBvY2N1cnJpbmdcbiAqIGFuZCBlcnJvcnMgYXJlIG5vdCB5ZXQgYXZhaWxhYmxlIGZvciB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzUGVuZGluZ2BcbiAqIEBzZWUgYHN0YXR1c2BcbiAqL1xuZXhwb3J0IGNvbnN0IFBFTkRJTkcgPSAnUEVORElORyc7XG5cbi8qKlxuICogQ29uc3RhbnQgaW5kaWNhdGluZyB0aGF0IGEgY29udHJvbCBpcyBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yXG4gKiBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzRGlzYWJsZWRgXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBESVNBQkxFRCA9ICdESVNBQkxFRCc7XG5cbi8qKlxuICogQSBmb3JtIGNhbiBoYXZlIHNldmVyYWwgZGlmZmVyZW50IHN0YXR1c2VzLiBFYWNoXG4gKiBwb3NzaWJsZSBzdGF0dXMgaXMgcmV0dXJuZWQgYXMgYSBzdHJpbmcgbGl0ZXJhbC5cbiAqXG4gKiAqICoqVkFMSUQqKjogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgdmFsaWQsIG1lYW5pbmcgdGhhdCBubyBlcnJvcnMgZXhpc3QgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipJTlZBTElEKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipQRU5ESU5HKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIHBlbmRpbmcsIG1lYW5pbmcgdGhhdCB0aGF0IGFzeW5jIHZhbGlkYXRpb24gaXNcbiAqIG9jY3VycmluZyBhbmQgZXJyb3JzIGFyZSBub3QgeWV0IGF2YWlsYWJsZSBmb3IgdGhlIGlucHV0IHZhbHVlLlxuICogKiAqKkRJU0FCTEVEKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzXG4gKiBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yIGNhbGN1bGF0aW9ucyBvZiB2YWxpZGl0eSBvciB2YWx1ZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIEZvcm1Db250cm9sU3RhdHVzID0gJ1ZBTElEJ3wnSU5WQUxJRCd8J1BFTkRJTkcnfCdESVNBQkxFRCc7XG5cbi8qKlxuICogR2V0cyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCk6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCB7XG4gIHJldHVybiAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyB2YWxpZGF0b3JPck9wdHMudmFsaWRhdG9ycyA6IHZhbGlkYXRvck9yT3B0cykgfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIHZhbGlkYXRvciBmdW5jdGlvbiBieSBjb21iaW5pbmcgcHJvdmlkZWQgdmFsaWRhdG9ycy5cbiAqL1xuZnVuY3Rpb24gY29lcmNlVG9WYWxpZGF0b3IodmFsaWRhdG9yOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwpOiBWYWxpZGF0b3JGbnxudWxsIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9yKSA/IGNvbXBvc2VWYWxpZGF0b3JzKHZhbGlkYXRvcikgOiB2YWxpZGF0b3IgfHwgbnVsbDtcbn1cblxuLyoqXG4gKiBHZXRzIGFzeW5jIHZhbGlkYXRvcnMgZnJvbSBlaXRoZXIgYW4gb3B0aW9ucyBvYmplY3Qgb3IgZ2l2ZW4gdmFsaWRhdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBpY2tBc3luY1ZhbGlkYXRvcnMoXG4gICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsLFxuICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsKTogQXN5bmNWYWxpZGF0b3JGbnxcbiAgICBBc3luY1ZhbGlkYXRvckZuW118bnVsbCB7XG4gIHJldHVybiAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyB2YWxpZGF0b3JPck9wdHMuYXN5bmNWYWxpZGF0b3JzIDogYXN5bmNWYWxpZGF0b3IpIHx8IG51bGw7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb24gYnkgY29tYmluaW5nIHByb3ZpZGVkIGFzeW5jIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCk6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFzeW5jVmFsaWRhdG9yKSA/IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNWYWxpZGF0b3IgfHwgbnVsbDtcbn1cblxuZXhwb3J0IHR5cGUgRm9ybUhvb2tzID0gJ2NoYW5nZSd8J2JsdXInfCdzdWJtaXQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igb3B0aW9ucyBwcm92aWRlZCB0byBhbiBgQWJzdHJhY3RDb250cm9sYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGEgY29udHJvbC5cbiAgICovXG4gIHZhbGlkYXRvcnM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGw7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgYXN5bmMgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGNvbnRyb2wuXG4gICAqL1xuICBhc3luY1ZhbGlkYXRvcnM/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBldmVudCBuYW1lIGZvciBjb250cm9sIHRvIHVwZGF0ZSB1cG9uLlxuICAgKi9cbiAgdXBkYXRlT24/OiAnY2hhbmdlJ3wnYmx1cid8J3N1Ym1pdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsKTogdmFsaWRhdG9yT3JPcHRzIGlzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMge1xuICByZXR1cm4gdmFsaWRhdG9yT3JPcHRzICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkodmFsaWRhdG9yT3JPcHRzKSAmJlxuICAgICAgdHlwZW9mIHZhbGlkYXRvck9yT3B0cyA9PT0gJ29iamVjdCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlcnRDb250cm9sUHJlc2VudChwYXJlbnQ6IGFueSwgaXNHcm91cDogYm9vbGVhbiwga2V5OiBzdHJpbmd8bnVtYmVyKTogdm9pZCB7XG4gIGNvbnN0IGNvbnRyb2xzID0gcGFyZW50LmNvbnRyb2xzIGFzIHtba2V5OiBzdHJpbmd8bnVtYmVyXTogdW5rbm93bn07XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBpc0dyb3VwID8gT2JqZWN0LmtleXMoY29udHJvbHMpIDogY29udHJvbHM7XG4gIGlmICghY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLk5PX0NPTlRST0xTLCBOR19ERVZfTU9ERSA/IG5vQ29udHJvbHNFcnJvcihpc0dyb3VwKSA6ICcnKTtcbiAgfVxuICBpZiAoIWNvbnRyb2xzW2tleV0pIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfQ09OVFJPTCwgTkdfREVWX01PREUgPyBtaXNzaW5nQ29udHJvbEVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydEFsbFZhbHVlc1ByZXNlbnQoY29udHJvbDogYW55LCBpc0dyb3VwOiBib29sZWFuLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gIGNvbnRyb2wuX2ZvckVhY2hDaGlsZCgoKF86IHVua25vd24sIGtleTogc3RyaW5nfG51bWJlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFJ1bnRpbWVFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUnVudGltZUVycm9yQ29kZS5NSVNTSU5HX0NPTlRST0xfVkFMVUUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE5HX0RFVl9NT0RFID8gbWlzc2luZ0NvbnRyb2xWYWx1ZUVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pIGFzIGFueSk7XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgYmFzZSBjbGFzcyBmb3IgYEZvcm1Db250cm9sYCwgYEZvcm1Hcm91cGAsIGFuZCBgRm9ybUFycmF5YC5cbiAqXG4gKiBJdCBwcm92aWRlcyBzb21lIG9mIHRoZSBzaGFyZWQgYmVoYXZpb3IgdGhhdCBhbGwgY29udHJvbHMgYW5kIGdyb3VwcyBvZiBjb250cm9scyBoYXZlLCBsaWtlXG4gKiBydW5uaW5nIHZhbGlkYXRvcnMsIGNhbGN1bGF0aW5nIHN0YXR1cywgYW5kIHJlc2V0dGluZyBzdGF0ZS4gSXQgYWxzbyBkZWZpbmVzIHRoZSBwcm9wZXJ0aWVzXG4gKiB0aGF0IGFyZSBzaGFyZWQgYmV0d2VlbiBhbGwgc3ViLWNsYXNzZXMsIGxpa2UgYHZhbHVlYCwgYHZhbGlkYCwgYW5kIGBkaXJ0eWAuIEl0IHNob3VsZG4ndCBiZVxuICogaW5zdGFudGlhdGVkIGRpcmVjdGx5LlxuICpcbiAqIEBzZWUgW0Zvcm1zIEd1aWRlXSgvZ3VpZGUvZm9ybXMpXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oL2d1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBbRHluYW1pYyBGb3JtcyBHdWlkZV0oL2d1aWRlL2R5bmFtaWMtZm9ybSlcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBYnN0cmFjdENvbnRyb2wge1xuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHRoYXQgYSBjb250cm9sIGhhcyBpdHMgb3duIHBlbmRpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRpb24gaW4gcHJvZ3Jlc3MuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IGZhbHNlO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdUb3VjaGVkID0gZmFsc2U7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25Db2xsZWN0aW9uQ2hhbmdlID0gKCkgPT4ge307XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlT24/OiBGb3JtSG9va3M7XG5cbiAgcHJpdmF0ZSBfcGFyZW50OiBGb3JtR3JvdXB8Rm9ybUFycmF5fG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogQ29udGFpbnMgdGhlIHJlc3VsdCBvZiBtZXJnaW5nIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICogKGNvbWJpbmVkIHVzaW5nIGBWYWxpZGF0b3JzLmNvbXBvc2VgKS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9jb21wb3NlZFZhbGlkYXRvckZuOiBWYWxpZGF0b3JGbnxudWxsO1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSB2YWxpZGF0b3IgZnVuY3Rpb25cbiAgICogKGNvbWJpbmVkIHVzaW5nIGBWYWxpZGF0b3JzLmNvbXBvc2VBc3luY2ApLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbjogQXN5bmNWYWxpZGF0b3JGbnxudWxsO1xuXG4gIC8qKlxuICAgKiBTeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0VmFsaWRhdG9yc2AgZnVuY3Rpb25cbiAgICogIC0gd2hpbGUgY2FsbGluZyB0aGUgc2V0dGVyIG9uIHRoZSBgdmFsaWRhdG9yYCBmaWVsZCAoZS5nLiBgY29udHJvbC52YWxpZGF0b3IgPSB2YWxpZGF0b3JGbmApXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3VmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsO1xuXG4gIC8qKlxuICAgKiBBc3luY2hyb25vdXMgdmFsaWRhdG9ycyBhcyB0aGV5IHdlcmUgcHJvdmlkZWQ6XG4gICAqICAtIGluIGBBYnN0cmFjdENvbnRyb2xgIGNvbnN0cnVjdG9yXG4gICAqICAtIGFzIGFuIGFyZ3VtZW50IHdoaWxlIGNhbGxpbmcgYHNldEFzeW5jVmFsaWRhdG9yc2AgZnVuY3Rpb25cbiAgICogIC0gd2hpbGUgY2FsbGluZyB0aGUgc2V0dGVyIG9uIHRoZSBgYXN5bmNWYWxpZGF0b3JgIGZpZWxkIChlLmcuIGBjb250cm9sLmFzeW5jVmFsaWRhdG9yID1cbiAgICogYXN5bmNWYWxpZGF0b3JGbmApXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcmF3QXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogKiBGb3IgYSBgRm9ybUNvbnRyb2xgLCB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICogKiBGb3IgYW4gZW5hYmxlZCBgRm9ybUdyb3VwYCwgdGhlIHZhbHVlcyBvZiBlbmFibGVkIGNvbnRyb2xzIGFzIGFuIG9iamVjdFxuICAgKiB3aXRoIGEga2V5LXZhbHVlIHBhaXIgZm9yIGVhY2ggbWVtYmVyIG9mIHRoZSBncm91cC5cbiAgICogKiBGb3IgYSBkaXNhYmxlZCBgRm9ybUdyb3VwYCwgdGhlIHZhbHVlcyBvZiBhbGwgY29udHJvbHMgYXMgYW4gb2JqZWN0XG4gICAqIHdpdGggYSBrZXktdmFsdWUgcGFpciBmb3IgZWFjaCBtZW1iZXIgb2YgdGhlIGdyb3VwLlxuICAgKiAqIEZvciBhIGBGb3JtQXJyYXlgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IGFueTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQWJzdHJhY3RDb250cm9sIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgZnVuY3Rpb24gb3IgYXJyYXkgb2YgZnVuY3Rpb25zIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mXG4gICAqICAgICB0aGlzIGNvbnRyb2wgc3luY2hyb25vdXNseS5cbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9ycyBUaGUgZnVuY3Rpb24gb3IgYXJyYXkgb2YgZnVuY3Rpb25zIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdmFsaWRpdHkgb2ZcbiAgICogICAgIHRoaXMgY29udHJvbCBhc3luY2hyb25vdXNseS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgdmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnM7XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSBjb2VyY2VUb1ZhbGlkYXRvcih0aGlzLl9yYXdWYWxpZGF0b3JzKTtcbiAgICB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZnVuY3Rpb24gdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2YgdGhpcyBjb250cm9sIHN5bmNocm9ub3VzbHkuXG4gICAqIElmIG11bHRpcGxlIHZhbGlkYXRvcnMgaGF2ZSBiZWVuIGFkZGVkLCB0aGlzIHdpbGwgYmUgYSBzaW5nbGUgY29tcG9zZWQgZnVuY3Rpb24uXG4gICAqIFNlZSBgVmFsaWRhdG9ycy5jb21wb3NlKClgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgZ2V0IHZhbGlkYXRvcigpOiBWYWxpZGF0b3JGbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbjtcbiAgfVxuICBzZXQgdmFsaWRhdG9yKHZhbGlkYXRvckZuOiBWYWxpZGF0b3JGbnxudWxsKSB7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSB2YWxpZGF0b3JGbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZiB0aGlzIGNvbnRyb2wgYXN5bmNocm9ub3VzbHkuXG4gICAqIElmIG11bHRpcGxlIHZhbGlkYXRvcnMgaGF2ZSBiZWVuIGFkZGVkLCB0aGlzIHdpbGwgYmUgYSBzaW5nbGUgY29tcG9zZWQgZnVuY3Rpb24uXG4gICAqIFNlZSBgVmFsaWRhdG9ycy5jb21wb3NlKClgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgZ2V0IGFzeW5jVmFsaWRhdG9yKCk6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbjtcbiAgfVxuICBzZXQgYXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3JGbjogQXN5bmNWYWxpZGF0b3JGbnxudWxsKSB7XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuID0gYXN5bmNWYWxpZGF0b3JGbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IGNvbnRyb2wuXG4gICAqL1xuICBnZXQgcGFyZW50KCk6IEZvcm1Hcm91cHxGb3JtQXJyYXl8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgdmFsaWRhdGlvbiBzdGF0dXMgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIEBzZWUgYEZvcm1Db250cm9sU3RhdHVzYFxuICAgKlxuICAgKiBUaGVzZSBzdGF0dXMgdmFsdWVzIGFyZSBtdXR1YWxseSBleGNsdXNpdmUsIHNvIGEgY29udHJvbCBjYW5ub3QgYmVcbiAgICogYm90aCB2YWxpZCBBTkQgaW52YWxpZCBvciBpbnZhbGlkIEFORCBkaXNhYmxlZC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGF0dXMhOiBGb3JtQ29udHJvbFN0YXR1cztcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGB2YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFZBTElEYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgcGFzc2VkIGFsbCBvZiBpdHMgdmFsaWRhdGlvbiB0ZXN0cyxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IHZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gVkFMSUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBpbnZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgSU5WQUxJRGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGhhcyBmYWlsZWQgb25lIG9yIG1vcmUgb2YgaXRzIHZhbGlkYXRpb24gY2hlY2tzLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgaW52YWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IElOVkFMSUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBwZW5kaW5nYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgUEVORElOR2AuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGlzIGluIHRoZSBwcm9jZXNzIG9mIGNvbmR1Y3RpbmcgYSB2YWxpZGF0aW9uIGNoZWNrLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgcGVuZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT0gUEVORElORztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGRpc2FibGVkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgRElTQUJMRURgLlxuICAgKlxuICAgKiBEaXNhYmxlZCBjb250cm9scyBhcmUgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGVpciBhbmNlc3RvclxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gRElTQUJMRUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBlbmFibGVkYCBhcyBsb25nIGFzIGl0cyBgc3RhdHVzYCBpcyBub3QgYERJU0FCTEVEYC5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgYW55IHN0YXR1cyBvdGhlciB0aGFuICdESVNBQkxFRCcsXG4gICAqIGZhbHNlIGlmIHRoZSBzdGF0dXMgaXMgJ0RJU0FCTEVEJy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICovXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyAhPT0gRElTQUJMRUQ7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgYW55IGVycm9ycyBnZW5lcmF0ZWQgYnkgZmFpbGluZyB2YWxpZGF0aW9uLFxuICAgKiBvciBudWxsIGlmIHRoZXJlIGFyZSBubyBlcnJvcnMuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZXJyb3JzITogVmFsaWRhdGlvbkVycm9yc3xudWxsO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHByaXN0aW5lYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkXG4gICAqIHRoZSB2YWx1ZSBpbiB0aGUgVUkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZCB0aGUgdmFsdWUgaW4gdGhlIFVJOyBjb21wYXJlIGBkaXJ0eWAuXG4gICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHByaXN0aW5lOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXJ0eWAgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlXG4gICAqIGluIHRoZSBVSS5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgdmFsdWUgb2YgdGhpcyBjb250cm9sIGluIHRoZSBVSTsgY29tcGFyZSBgcHJpc3RpbmVgLlxuICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIGdldCBkaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMucHJpc3RpbmU7XG4gIH1cblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBtYXJrZWQgYXMgYHRvdWNoZWRgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgbWFya2VkIGB0b3VjaGVkYCBvbmNlIHRoZSB1c2VyIGhhcyB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdG91Y2hlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBub3QgYmVlbiBtYXJrZWQgYXMgdG91Y2hlZFxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgYHVudG91Y2hlZGAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgZ2V0IHVudG91Y2hlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMudG91Y2hlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgY2hhbmdlcywgaW5cbiAgICogdGhlIFVJIG9yIHByb2dyYW1tYXRpY2FsbHkuIEl0IGFsc28gZW1pdHMgYW4gZXZlbnQgZWFjaCB0aW1lIHlvdSBjYWxsIGVuYWJsZSgpIG9yIGRpc2FibGUoKVxuICAgKiB3aXRob3V0IHBhc3NpbmcgYWxvbmcge2VtaXRFdmVudDogZmFsc2V9IGFzIGEgZnVuY3Rpb24gYXJndW1lbnQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWVDaGFuZ2VzITogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIC8qKlxuICAgKiBBIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgdmFsaWRhdGlvbiBgc3RhdHVzYCBvZiB0aGUgY29udHJvbFxuICAgKiByZWNhbGN1bGF0ZXMuXG4gICAqXG4gICAqIEBzZWUgYEZvcm1Db250cm9sU3RhdHVzYFxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1c0NoYW5nZXMhOiBPYnNlcnZhYmxlPEZvcm1Db250cm9sU3RhdHVzPjtcblxuICAvKipcbiAgICogUmVwb3J0cyB0aGUgdXBkYXRlIHN0cmF0ZWd5IG9mIHRoZSBgQWJzdHJhY3RDb250cm9sYCAobWVhbmluZ1xuICAgKiB0aGUgZXZlbnQgb24gd2hpY2ggdGhlIGNvbnRyb2wgdXBkYXRlcyBpdHNlbGYpLlxuICAgKiBQb3NzaWJsZSB2YWx1ZXM6IGAnY2hhbmdlJ2AgfCBgJ2JsdXInYCB8IGAnc3VibWl0J2BcbiAgICogRGVmYXVsdCB2YWx1ZTogYCdjaGFuZ2UnYFxuICAgKi9cbiAgZ2V0IHVwZGF0ZU9uKCk6IEZvcm1Ib29rcyB7XG4gICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU9uID8gdGhpcy5fdXBkYXRlT24gOiAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC51cGRhdGVPbiA6ICdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuICBDYWxsaW5nXG4gICAqIHRoaXMgb3ZlcndyaXRlcyBhbnkgZXhpc3Rpbmcgc3luY2hyb25vdXMgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBhZGQgYSBuZXcgdmFsaWRhdG9yIHdpdGhvdXQgYWZmZWN0aW5nIGV4aXN0aW5nIG9uZXMsIGNvbnNpZGVyXG4gICAqIHVzaW5nIGBhZGRWYWxpZGF0b3JzKClgIG1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cbiAgc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdmFsaWRhdG9ycztcbiAgICB0aGlzLl9jb21wb3NlZFZhbGlkYXRvckZuID0gY29lcmNlVG9WYWxpZGF0b3IodmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gQ2FsbGluZyB0aGlzXG4gICAqIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIGFzeW5jaHJvbm91cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGFkZCBhIG5ldyB2YWxpZGF0b3Igd2l0aG91dCBhZmZlY3RpbmcgZXhpc3Rpbmcgb25lcywgY29uc2lkZXJcbiAgICogdXNpbmcgYGFkZEFzeW5jVmFsaWRhdG9ycygpYCBtZXRob2QgaW5zdGVhZC5cbiAgICovXG4gIHNldEFzeW5jVmFsaWRhdG9ycyh2YWxpZGF0b3JzOiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogdm9pZCB7XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gdmFsaWRhdG9ycztcbiAgICB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKHZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBBZGRpbmcgYSB2YWxpZGF0b3IgdGhhdCBhbHJlYWR5IGV4aXN0cyB3aWxsIGhhdmUgbm8gZWZmZWN0LiBJZiBkdXBsaWNhdGUgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKiBhcmUgcHJlc2VudCBpbiB0aGUgYHZhbGlkYXRvcnNgIGFycmF5LCBvbmx5IHRoZSBmaXJzdCBpbnN0YW5jZSB3b3VsZCBiZSBhZGRlZCB0byBhIGZvcm1cbiAgICogY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIG5ldyB2YWxpZGF0b3IgZnVuY3Rpb24gb3IgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbGlkYXRvcnMoYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyXG4gICAqIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQWRkaW5nIGEgdmFsaWRhdG9yIHRoYXQgYWxyZWFkeSBleGlzdHMgd2lsbCBoYXZlIG5vIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIG5ldyBhc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIG9yIGZ1bmN0aW9ucyB0byBhZGQgdG8gdGhpcyBjb250cm9sLlxuICAgKi9cbiAgYWRkQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRBc3luY1ZhbGlkYXRvcnMoYWRkVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnJvbSB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAqIFZhbGlkYXRvcnMgYXJlIGNvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZTsgeW91IG11c3QgcGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZVxuICAgKiB2YWxpZGF0b3IgZnVuY3Rpb24gYXMgdGhlIG9uZSB0aGF0IHdhcyBvcmlnaW5hbGx5IHNldC4gSWYgYSBwcm92aWRlZCB2YWxpZGF0b3IgaXMgbm90IGZvdW5kLFxuICAgKiBpdCBpcyBpZ25vcmVkLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldFZhbGlkYXRvcnMocmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnJvbSB0aGlzIGNvbnRyb2wsIHdpdGhvdXQgYWZmZWN0aW5nIG90aGVyIHZhbGlkYXRvcnMuXG4gICAqIFZhbGlkYXRvcnMgYXJlIGNvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZTsgeW91IG11c3QgcGFzcyBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZVxuICAgKiB2YWxpZGF0b3IgZnVuY3Rpb24gYXMgdGhlIG9uZSB0aGF0IHdhcyBvcmlnaW5hbGx5IHNldC4gSWYgYSBwcm92aWRlZCB2YWxpZGF0b3IgaXMgbm90IGZvdW5kLCBpdFxuICAgKiBpcyBpZ25vcmVkLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlQXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRBc3luY1ZhbGlkYXRvcnMocmVtb3ZlVmFsaWRhdG9ycyh2YWxpZGF0b3JzLCB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGlzIHByZXNlbnQgb24gdGhpcyBjb250cm9sLiBUaGUgcHJvdmlkZWRcbiAgICogdmFsaWRhdG9yIG11c3QgYmUgYSByZWZlcmVuY2UgdG8gdGhlIGV4YWN0IHNhbWUgZnVuY3Rpb24gdGhhdCB3YXMgcHJvdmlkZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3IgVGhlIHZhbGlkYXRvciB0byBjaGVjayBmb3IgcHJlc2VuY2UuIENvbXBhcmVkIGJ5IGZ1bmN0aW9uIHJlZmVyZW5jZS5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgcHJvdmlkZWQgdmFsaWRhdG9yIHdhcyBmb3VuZCBvbiB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBoYXNWYWxpZGF0b3IodmFsaWRhdG9yOiBWYWxpZGF0b3JGbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBoYXNWYWxpZGF0b3IodGhpcy5fcmF3VmFsaWRhdG9ycywgdmFsaWRhdG9yKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGFuIGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gaXMgcHJlc2VudCBvbiB0aGlzIGNvbnRyb2wuIFRoZSBwcm92aWRlZFxuICAgKiB2YWxpZGF0b3IgbXVzdCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZSBmdW5jdGlvbiB0aGF0IHdhcyBwcm92aWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvciBUaGUgYXN5bmNocm9ub3VzIHZhbGlkYXRvciB0byBjaGVjayBmb3IgcHJlc2VuY2UuIENvbXBhcmVkIGJ5IGZ1bmN0aW9uXG4gICAqICAgICByZWZlcmVuY2UuXG4gICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIHByb3ZpZGVkIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igd2FzIGZvdW5kIG9uIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGhhc0FzeW5jVmFsaWRhdG9yKHZhbGlkYXRvcjogQXN5bmNWYWxpZGF0b3JGbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBoYXNWYWxpZGF0b3IodGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzLCB2YWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgbGlzdC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKi9cbiAgY2xlYXJWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMudmFsaWRhdG9yID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbXB0aWVzIG91dCB0aGUgYXN5bmMgdmFsaWRhdG9yIGxpc3QuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICovXG4gIGNsZWFyQXN5bmNWYWxpZGF0b3JzKCk6IHZvaWQge1xuICAgIHRoaXMuYXN5bmNWYWxpZGF0b3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB0b3VjaGVkYC4gQSBjb250cm9sIGlzIHRvdWNoZWQgYnkgZm9jdXMgYW5kXG4gICAqIGJsdXIgZXZlbnRzIHRoYXQgZG8gbm90IGNoYW5nZSB0aGUgdmFsdWUuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1VudG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNEaXJ0eSgpYFxuICAgKiBAc2VlIGBtYXJrQXNQcmlzdGluZSgpYFxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc1RvdWNoZWQob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHt0b3VjaGVkOiBib29sZWFufSkudG91Y2hlZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYW5kIGFsbCBpdHMgZGVzY2VuZGFudCBjb250cm9scyBhcyBgdG91Y2hlZGAuXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICovXG4gIG1hcmtBbGxBc1RvdWNoZWQoKTogdm9pZCB7XG4gICAgdGhpcy5tYXJrQXNUb3VjaGVkKHtvbmx5U2VsZjogdHJ1ZX0pO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wubWFya0FsbEFzVG91Y2hlZCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdW50b3VjaGVkYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGFueSBjaGlsZHJlbiwgYWxzbyBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHVudG91Y2hlZGBcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHRvdWNoZWRgIHN0YXR1cyBvZiBhbGwgcGFyZW50IGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIGBtYXJrQXNUb3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc0RpcnR5KClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc1VudG91Y2hlZChvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gZmFsc2U7XG4gICAgdGhpcy5fcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLm1hcmtBc1VudG91Y2hlZCh7b25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYGRpcnR5YC4gQSBjb250cm9sIGJlY29tZXMgZGlydHkgd2hlblxuICAgKiB0aGUgY29udHJvbCdzIHZhbHVlIGlzIGNoYW5nZWQgdGhyb3VnaCB0aGUgVUk7IGNvbXBhcmUgYG1hcmtBc1RvdWNoZWRgLlxuICAgKlxuICAgKiBAc2VlIGBtYXJrQXNUb3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1VudG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNQcmlzdGluZSgpYFxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc0RpcnR5KG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7cHJpc3RpbmU6IGJvb2xlYW59KS5wcmlzdGluZSA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Lm1hcmtBc0RpcnR5KG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcHJpc3RpbmVgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHByaXN0aW5lYCxcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHByaXN0aW5lYCBzdGF0dXMgb2YgYWxsIHBhcmVudFxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogQHNlZSBgbWFya0FzVG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNVbnRvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzRGlydHkoKWBcbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBlbWl0cyBldmVudHMgYWZ0ZXJcbiAgICogbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzUHJpc3RpbmUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtwcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gdHJ1ZTtcbiAgICB0aGlzLl9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLm1hcmtBc1ByaXN0aW5lKHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHBlbmRpbmdgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgcGVuZGluZyB3aGlsZSB0aGUgY29udHJvbCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCB0aGUgYHN0YXR1c0NoYW5nZXNgXG4gICAqIG9ic2VydmFibGUgZW1pdHMgYW4gZXZlbnQgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyB0aGUgY29udHJvbCBpcyBtYXJrZWQgcGVuZGluZy5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKlxuICAgKi9cbiAgbWFya0FzUGVuZGluZyhvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSBQRU5ESU5HO1xuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzUGVuZGluZyhvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGV4Y2x1ZGVkIGZyb20gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBhbnkgcGFyZW50LiBJdHMgc3RhdHVzIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBhbHNvIGRpc2FibGVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXNcbiAgICogY2hhbmdlcyBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgZGlzYWJsZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgLy8gSWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkgd2UgZG9uJ3Qgd2FudCB0byByZS1jYWxjdWxhdGUgdGhlXG4gICAgLy8gcGFyZW50J3MgZGlydGluZXNzIGJhc2VkIG9uIHRoZSBjaGlsZHJlbi5cbiAgICBjb25zdCBza2lwUHJpc3RpbmVDaGVjayA9IHRoaXMuX3BhcmVudE1hcmtlZERpcnR5KG9wdHMub25seVNlbGYpO1xuXG4gICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSBESVNBQkxFRDtcbiAgICAodGhpcyBhcyB7ZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbH0pLmVycm9ycyA9IG51bGw7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wuZGlzYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4odHJ1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgaW5jbHVkZWQgaW4gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgaXRzIHBhcmVudC4gSXRzIHN0YXR1cyByZWNhbGN1bGF0ZXMgYmFzZWQgb24gaXRzIHZhbHVlIGFuZFxuICAgKiBpdHMgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGVuYWJsZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgY29udHJvbCBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgd2hlbiBtYXJrZWQgYXMgdW50b3VjaGVkXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGVuYWJsZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIGVuYWJsZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgLy8gSWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkgd2UgZG9uJ3Qgd2FudCB0byByZS1jYWxjdWxhdGUgdGhlXG4gICAgLy8gcGFyZW50J3MgZGlydGluZXNzIGJhc2VkIG9uIHRoZSBjaGlsZHJlbi5cbiAgICBjb25zdCBza2lwUHJpc3RpbmVDaGVjayA9IHRoaXMuX3BhcmVudE1hcmtlZERpcnR5KG9wdHMub25seVNlbGYpO1xuXG4gICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSBWQUxJRDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgY29udHJvbC5lbmFibGUoey4uLm9wdHMsIG9ubHlTZWxmOiB0cnVlfSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlQW5jZXN0b3JzKHsuLi5vcHRzLCBza2lwUHJpc3RpbmVDaGVja30pO1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKGZhbHNlKSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVBbmNlc3RvcnMoXG4gICAgICBvcHRzOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFuLCBza2lwUHJpc3RpbmVDaGVjaz86IGJvb2xlYW59KSB7XG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50LnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0cyk7XG4gICAgICBpZiAoIW9wdHMuc2tpcFByaXN0aW5lQ2hlY2spIHtcbiAgICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBwYXJlbnQgU2V0cyB0aGUgcGFyZW50IG9mIHRoZSBjb250cm9sXG4gICAqL1xuICBzZXRQYXJlbnQocGFyZW50OiBGb3JtR3JvdXB8Rm9ybUFycmF5KTogdm9pZCB7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHNldFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCBwYXRjaFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3QgcmVzZXQodmFsdWU/OiBhbnksIG9wdGlvbnM/OiBPYmplY3QpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBUaGUgcmF3IHZhbHVlIG9mIHRoaXMgY29udHJvbC4gRm9yIG1vc3QgY29udHJvbCBpbXBsZW1lbnRhdGlvbnMsIHRoZSByYXcgdmFsdWUgd2lsbCBpbmNsdWRlXG4gICAqIGRpc2FibGVkIGNoaWxkcmVuLlxuICAgKi9cbiAgZ2V0UmF3VmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNhbGN1bGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaXQgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgaXRzIGFuY2VzdG9ycy5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHNcbiAgICogYWZ0ZXIgdXBkYXRlcyBhbmQgdmFsaWRpdHkgY2hlY2tzIGFyZSBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgb25seSB1cGRhdGUgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogdXBkYXRlIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJbml0aWFsU3RhdHVzKCk7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcblxuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuX2NhbmNlbEV4aXN0aW5nU3Vic2NyaXB0aW9uKCk7XG4gICAgICAodGhpcyBhcyB7ZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbH0pLmVycm9ycyA9IHRoaXMuX3J1blZhbGlkYXRvcigpO1xuICAgICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcblxuICAgICAgaWYgKHRoaXMuc3RhdHVzID09PSBWQUxJRCB8fCB0aGlzLnN0YXR1cyA9PT0gUEVORElORykge1xuICAgICAgICB0aGlzLl9ydW5Bc3luY1ZhbGlkYXRvcihvcHRzLmVtaXRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSkge1xuICAgICAgKHRoaXMudmFsdWVDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMudmFsdWUpO1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUcmVlVmFsaWRpdHkob3B0czoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge2VtaXRFdmVudDogdHJ1ZX0pIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGN0cmw6IEFic3RyYWN0Q29udHJvbCkgPT4gY3RybC5fdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHMpKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRJbml0aWFsU3RhdHVzKCkge1xuICAgICh0aGlzIGFzIHtzdGF0dXM6IEZvcm1Db250cm9sU3RhdHVzfSkuc3RhdHVzID0gdGhpcy5fYWxsQ29udHJvbHNEaXNhYmxlZCgpID8gRElTQUJMRUQgOiBWQUxJRDtcbiAgfVxuXG4gIHByaXZhdGUgX3J1blZhbGlkYXRvcigpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRvciA/IHRoaXMudmFsaWRhdG9yKHRoaXMpIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX3J1bkFzeW5jVmFsaWRhdG9yKGVtaXRFdmVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hc3luY1ZhbGlkYXRvcikge1xuICAgICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSBQRU5ESU5HO1xuICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG9icyA9IHRvT2JzZXJ2YWJsZSh0aGlzLmFzeW5jVmFsaWRhdG9yKHRoaXMpKTtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbiA9IG9icy5zdWJzY3JpYmUoKGVycm9yczogVmFsaWRhdGlvbkVycm9yc3xudWxsKSA9PiB7XG4gICAgICAgIHRoaXMuX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvciA9IGZhbHNlO1xuICAgICAgICAvLyBUaGlzIHdpbGwgdHJpZ2dlciB0aGUgcmVjYWxjdWxhdGlvbiBvZiB0aGUgdmFsaWRhdGlvbiBzdGF0dXMsIHdoaWNoIGRlcGVuZHMgb25cbiAgICAgICAgLy8gdGhlIHN0YXRlIG9mIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiAod2hldGhlciBpdCBpcyBpbiBwcm9ncmVzcyBvciBub3QpLiBTbywgaXQgaXNcbiAgICAgICAgLy8gbmVjZXNzYXJ5IHRoYXQgd2UgaGF2ZSB1cGRhdGVkIHRoZSBgX2hhc093blBlbmRpbmdBc3luY1ZhbGlkYXRvcmAgYm9vbGVhbiBmbGFnIGZpcnN0LlxuICAgICAgICB0aGlzLnNldEVycm9ycyhlcnJvcnMsIHtlbWl0RXZlbnR9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NhbmNlbEV4aXN0aW5nU3Vic2NyaXB0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZXJyb3JzIG9uIGEgZm9ybSBjb250cm9sIHdoZW4gcnVubmluZyB2YWxpZGF0aW9ucyBtYW51YWxseSwgcmF0aGVyIHRoYW4gYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogQ2FsbGluZyBgc2V0RXJyb3JzYCBhbHNvIHVwZGF0ZXMgdGhlIHZhbGlkaXR5IG9mIHRoZSBwYXJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIE1hbnVhbGx5IHNldCB0aGUgZXJyb3JzIGZvciBhIGNvbnRyb2xcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGxvZ2luID0gbmV3IEZvcm1Db250cm9sKCdzb21lTG9naW4nKTtcbiAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAqIGV4cGVjdChsb2dpbi5lcnJvcnMpLnRvRXF1YWwoeyBub3RVbmlxdWU6IHRydWUgfSk7XG4gICAqXG4gICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc2V0RXJyb3JzKGVycm9yczogVmFsaWRhdGlvbkVycm9yc3xudWxsLCBvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gZXJyb3JzO1xuICAgIHRoaXMuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKG9wdHMuZW1pdEV2ZW50ICE9PSBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgY2hpbGQgY29udHJvbCBnaXZlbiB0aGUgY29udHJvbCdzIG5hbWUgb3IgcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggQSBkb3QtZGVsaW1pdGVkIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmcvbnVtYmVyIHZhbHVlcyB0aGF0IGRlZmluZSB0aGUgcGF0aCB0byB0aGVcbiAgICogY29udHJvbC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJldHJpZXZlIGEgbmVzdGVkIGNvbnRyb2xcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBuYW1lYCBjb250cm9sIG5lc3RlZCB3aXRoaW4gYSBgcGVyc29uYCBzdWItZ3JvdXA6XG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoJ3BlcnNvbi5uYW1lJyk7YFxuICAgKlxuICAgKiAtT1ItXG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoWydwZXJzb24nLCAnbmFtZSddKTtgXG4gICAqXG4gICAqICMjIyBSZXRyaWV2ZSBhIGNvbnRyb2wgaW4gYSBGb3JtQXJyYXlcbiAgICpcbiAgICogV2hlbiBhY2Nlc3NpbmcgYW4gZWxlbWVudCBpbnNpZGUgYSBGb3JtQXJyYXksIHlvdSBjYW4gdXNlIGFuIGVsZW1lbnQgaW5kZXguXG4gICAqIEZvciBleGFtcGxlLCB0byBnZXQgYSBgcHJpY2VgIGNvbnRyb2wgZnJvbSB0aGUgZmlyc3QgZWxlbWVudCBpbiBhbiBgaXRlbXNgIGFycmF5IHlvdSBjYW4gdXNlOlxuICAgKlxuICAgKiAqIGB0aGlzLmZvcm0uZ2V0KCdpdGVtcy4wLnByaWNlJyk7YFxuICAgKlxuICAgKiAtT1ItXG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoWydpdGVtcycsIDAsICdwcmljZSddKTtgXG4gICAqL1xuICBnZXQocGF0aDogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogQWJzdHJhY3RDb250cm9sfG51bGwge1xuICAgIGlmIChwYXRoID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIGlmICghQXJyYXkuaXNBcnJheShwYXRoKSkgcGF0aCA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICAgIHJldHVybiBwYXRoLnJlZHVjZShcbiAgICAgICAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbHxudWxsLCBuYW1lKSA9PiBjb250cm9sICYmIGNvbnRyb2wuX2ZpbmQobmFtZSksIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIGVycm9yIGRhdGEgZm9yIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGguXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICogdG8gdGhlIGNvbnRyb2wgdGhhdCBzaG91bGQgYmUgcXVlcmllZCBmb3IgZXJyb3JzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgYEZvcm1Hcm91cGA6XG4gICAqXG4gICAqIGBgYFxuICAgKiBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgKlxuICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgKlxuICAgKiAxLiBBbiBhcnJheSBvZiBzdHJpbmcgY29udHJvbCBuYW1lcywgZS5nLiBgWydhZGRyZXNzJywgJ3N0cmVldCddYFxuICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAqXG4gICAqIEByZXR1cm5zIGVycm9yIGRhdGEgZm9yIHRoYXQgcGFydGljdWxhciBlcnJvci4gSWYgdGhlIGNvbnRyb2wgb3IgZXJyb3IgaXMgbm90IHByZXNlbnQsXG4gICAqIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXRFcnJvcihlcnJvckNvZGU6IHN0cmluZywgcGF0aD86IEFycmF5PHN0cmluZ3xudW1iZXI+fHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgY29udHJvbCA9IHBhdGggPyB0aGlzLmdldChwYXRoKSA6IHRoaXM7XG4gICAgcmV0dXJuIGNvbnRyb2wgJiYgY29udHJvbC5lcnJvcnMgPyBjb250cm9sLmVycm9yc1tlcnJvckNvZGVdIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGNvZGUgb2YgdGhlIGVycm9yIHRvIGNoZWNrXG4gICAqIEBwYXJhbSBwYXRoIEEgbGlzdCBvZiBjb250cm9sIG5hbWVzIHRoYXQgZGVzaWduYXRlcyBob3cgdG8gbW92ZSBmcm9tIHRoZSBjdXJyZW50IGNvbnRyb2xcbiAgICogdG8gdGhlIGNvbnRyb2wgdGhhdCBzaG91bGQgYmUgcXVlcmllZCBmb3IgZXJyb3JzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBGb3IgZXhhbXBsZSwgZm9yIHRoZSBmb2xsb3dpbmcgYEZvcm1Hcm91cGA6XG4gICAqXG4gICAqIGBgYFxuICAgKiBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgYWRkcmVzczogbmV3IEZvcm1Hcm91cCh7IHN0cmVldDogbmV3IEZvcm1Db250cm9sKCkgfSlcbiAgICogfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBUaGUgcGF0aCB0byB0aGUgJ3N0cmVldCcgY29udHJvbCBmcm9tIHRoZSByb290IGZvcm0gd291bGQgYmUgJ2FkZHJlc3MnIC0+ICdzdHJlZXQnLlxuICAgKlxuICAgKiBJdCBjYW4gYmUgcHJvdmlkZWQgdG8gdGhpcyBtZXRob2QgaW4gb25lIG9mIHR3byBmb3JtYXRzOlxuICAgKlxuICAgKiAxLiBBbiBhcnJheSBvZiBzdHJpbmcgY29udHJvbCBuYW1lcywgZS5nLiBgWydhZGRyZXNzJywgJ3N0cmVldCddYFxuICAgKiAxLiBBIHBlcmlvZC1kZWxpbWl0ZWQgbGlzdCBvZiBjb250cm9sIG5hbWVzIGluIG9uZSBzdHJpbmcsIGUuZy4gYCdhZGRyZXNzLnN0cmVldCdgXG4gICAqXG4gICAqIElmIG5vIHBhdGggaXMgZ2l2ZW4sIHRoaXMgbWV0aG9kIGNoZWNrcyBmb3IgdGhlIGVycm9yIG9uIHRoZSBjdXJyZW50IGNvbnRyb2wuXG4gICAqXG4gICAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIGVycm9yIGlzIHByZXNlbnQgaW4gdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIHBhdGguXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBmYWxzZSBpcyByZXR1cm5lZC5cbiAgICovXG4gIGhhc0Vycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5nZXRFcnJvcihlcnJvckNvZGUsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgdG9wLWxldmVsIGFuY2VzdG9yIG9mIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGdldCByb290KCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgbGV0IHg6IEFic3RyYWN0Q29udHJvbCA9IHRoaXM7XG5cbiAgICB3aGlsZSAoeC5fcGFyZW50KSB7XG4gICAgICB4ID0geC5fcGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiB4O1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50OiBib29sZWFuKTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcblxuICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPEZvcm1Db250cm9sU3RhdHVzPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2luaXRPYnNlcnZhYmxlcygpIHtcbiAgICAodGhpcyBhcyB7dmFsdWVDaGFuZ2VzOiBPYnNlcnZhYmxlPGFueT59KS52YWx1ZUNoYW5nZXMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgKHRoaXMgYXMge3N0YXR1c0NoYW5nZXM6IE9ic2VydmFibGU8Rm9ybUNvbnRyb2xTdGF0dXM+fSkuc3RhdHVzQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG5cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlU3RhdHVzKCk6IEZvcm1Db250cm9sU3RhdHVzIHtcbiAgICBpZiAodGhpcy5fYWxsQ29udHJvbHNEaXNhYmxlZCgpKSByZXR1cm4gRElTQUJMRUQ7XG4gICAgaWYgKHRoaXMuZXJyb3JzKSByZXR1cm4gSU5WQUxJRDtcbiAgICBpZiAodGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yIHx8IHRoaXMuX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhQRU5ESU5HKSkgcmV0dXJuIFBFTkRJTkc7XG4gICAgaWYgKHRoaXMuX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhJTlZBTElEKSkgcmV0dXJuIElOVkFMSUQ7XG4gICAgcmV0dXJuIFZBTElEO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfdXBkYXRlVmFsdWUoKTogdm9pZDtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9mb3JFYWNoQ2hpbGQoY2I6IChjOiBBYnN0cmFjdENvbnRyb2wpID0+IHZvaWQpOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbik6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc0hhdmVTdGF0dXMoc3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1cyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLnN0YXR1cyA9PT0gc3RhdHVzKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzRGlydHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuZGlydHkpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNUb3VjaGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbnlDb250cm9scygoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLnRvdWNoZWQpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlUHJpc3RpbmUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtwcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gIXRoaXMuX2FueUNvbnRyb2xzRGlydHkoKTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlVG91Y2hlZChvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gdGhpcy5fYW55Q29udHJvbHNUb3VjaGVkKCk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25EaXNhYmxlZENoYW5nZTogQXJyYXk8KGlzRGlzYWJsZWQ6IGJvb2xlYW4pID0+IHZvaWQ+ID0gW107XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaXNCb3hlZFZhbHVlKGZvcm1TdGF0ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHR5cGVvZiBmb3JtU3RhdGUgPT09ICdvYmplY3QnICYmIGZvcm1TdGF0ZSAhPT0gbnVsbCAmJlxuICAgICAgICBPYmplY3Qua2V5cyhmb3JtU3RhdGUpLmxlbmd0aCA9PT0gMiAmJiAndmFsdWUnIGluIGZvcm1TdGF0ZSAmJiAnZGlzYWJsZWQnIGluIGZvcm1TdGF0ZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcGRhdGVTdHJhdGVneShvcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwpOiB2b2lkIHtcbiAgICBpZiAoaXNPcHRpb25zT2JqKG9wdHMpICYmIG9wdHMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdXBkYXRlT24gPSBvcHRzLnVwZGF0ZU9uITtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eS5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9wYXJlbnRNYXJrZWREaXJ0eShvbmx5U2VsZj86IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICBjb25zdCBwYXJlbnREaXJ0eSA9IHRoaXMuX3BhcmVudCAmJiB0aGlzLl9wYXJlbnQuZGlydHk7XG4gICAgcmV0dXJuICFvbmx5U2VsZiAmJiAhIXBhcmVudERpcnR5ICYmICF0aGlzLl9wYXJlbnQhLl9hbnlDb250cm9sc0RpcnR5KCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9maW5kKG5hbWU6IHN0cmluZ3xudW1iZXIpOiBBYnN0cmFjdENvbnRyb2x8bnVsbCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiJdfQ==