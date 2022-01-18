/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, ɵRuntimeError as RuntimeError } from '@angular/core';
import { missingControlError, missingControlValueError, noControlsError } from './directives/reactive_errors';
import { removeListItem } from './directives/shared';
import { addValidators, composeAsyncValidators, composeValidators, hasValidator, removeValidators, toObservable } from './validators';
const NG_DEV_MODE = typeof ngDevMode === 'undefined' || !!ngDevMode;
/**
 * Reports that a FormControl is valid, meaning that no errors exist in the input value.
 *
 * @see `status`
 */
export const VALID = 'VALID';
/**
 * Reports that a FormControl is invalid, meaning that an error exists in the input value.
 *
 * @see `status`
 */
export const INVALID = 'INVALID';
/**
 * Reports that a FormControl is pending, meaning that that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * @see `markAsPending`
 * @see `status`
 */
export const PENDING = 'PENDING';
/**
 * Reports that a FormControl is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see `markAsDisabled`
 * @see `status`
 */
export const DISABLED = 'DISABLED';
function _find(control, path, delimiter) {
    if (path == null)
        return null;
    if (!Array.isArray(path)) {
        path = path.split(delimiter);
    }
    if (Array.isArray(path) && path.length === 0)
        return null;
    // Not using Array.reduce here due to a Chrome 80 bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    let controlToFind = control;
    path.forEach((name) => {
        if (isFormGroup(controlToFind)) {
            controlToFind = controlToFind.controls.hasOwnProperty(name) ?
                controlToFind.controls[name] :
                null;
        }
        else if (isFormArray(controlToFind)) {
            controlToFind = controlToFind.at(name) || null;
        }
        else {
            controlToFind = null;
        }
    });
    return controlToFind;
}
/**
 * Gets validators from either an options object or given validators.
 */
function pickValidators(validatorOrOpts) {
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
function pickAsyncValidators(asyncValidator, validatorOrOpts) {
    return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
/**
 * Creates async validator function by combining provided async validators.
 */
function coerceToAsyncValidator(asyncValidator) {
    return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) :
        asyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
    return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
        typeof validatorOrOpts === 'object';
}
export const isFormControl = (control) => control instanceof FormControl;
export const isFormGroup = (control) => control instanceof FormGroup;
export const isFormArray = (control) => control instanceof FormArray;
function getRawValue(control) {
    return isFormControl(control) ? control.value : control.getRawValue();
}
function assertControlPresent(parent, key) {
    const isGroup = isFormGroup(parent);
    const controls = parent.controls;
    const collection = isGroup ? Object.keys(controls) : controls;
    if (!collection.length) {
        throw new RuntimeError(1000 /* NO_CONTROLS */, NG_DEV_MODE ? noControlsError(isGroup) : '');
    }
    if (!controls[key]) {
        throw new RuntimeError(1001 /* MISSING_CONTROL */, NG_DEV_MODE ? missingControlError(isGroup, key) : '');
    }
}
function assertAllValuesPresent(control, value) {
    const isGroup = isFormGroup(control);
    control._forEachChild((_, key) => {
        if (value[key] === undefined) {
            throw new RuntimeError(1002 /* MISSING_CONTROL_VALUE */, NG_DEV_MODE ? missingControlValueError(isGroup, key) : '');
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
        return _find(this, path, '.');
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
 */
export class FormControlImpl extends AbstractControl {
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
     *
     */
    constructor(formState = null, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        /**
         * The default value of this FormControl, used whenever the control is reset without an explicit
         * value. See {@link FormControlOptions#initialValueIsDefault} for more information on configuring
         * a default value.
         * @publicApi
         */
        this.defaultValue = null;
        /** @internal */
        this._onChange = [];
        /** @internal */
        this._pendingChange = false;
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this._initObservables();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`.
            // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
            // to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
        if (isOptionsObj(validatorOrOpts) && validatorOrOpts.initialValueIsDefault) {
            if (this._isBoxedValue(formState)) {
                this.defaultValue = formState.value;
            }
            else {
                this.defaultValue = formState;
            }
        }
    }
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
    setValue(value, options = {}) {
        this.value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
            this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
        }
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     *
     * @see `setValue` for options
     */
    patchValue(value, options = {}) {
        this.setValue(value, options);
    }
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and resetting
     * the value. The new value will be the provided value (if passed), `null`, or the initial value
     * if `initialValueIsDefault` was set in the constructor via {@link FormControlOptions}.
     *
     * ```ts
     * // By default, the control will reset to null.
     * const dog = new FormControl('spot');
     * dog.reset(); // dog.value is null
     *
     * // If this flag is set, the control will instead reset to the initial value.
     * const cat = new FormControl('tabby', {initialValueIsDefault: true});
     * cat.reset(); // cat.value is "tabby"
     *
     * // A value passed to reset always takes precedence.
     * const fish = new FormControl('finn', {initialValueIsDefault: true});
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
    reset(formState = this.defaultValue, options = {}) {
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
    }
    /**
     * @internal
     */
    _updateValue() { }
    /**
     * @internal
     */
    _anyControls(condition) {
        return false;
    }
    /**
     * @internal
     */
    _allControlsDisabled() {
        return this.disabled;
    }
    /**
     * Register a listener for change events.
     *
     * @param fn The method that is called when the value changes
     */
    registerOnChange(fn) {
        this._onChange.push(fn);
    }
    /**
     * Internal function to unregister a change events listener.
     * @internal
     */
    _unregisterOnChange(fn) {
        removeListItem(this._onChange, fn);
    }
    /**
     * Register a listener for disabled events.
     *
     * @param fn The method that is called when the disabled status changes.
     */
    registerOnDisabledChange(fn) {
        this._onDisabledChange.push(fn);
    }
    /**
     * Internal function to unregister a disabled event listener.
     * @internal
     */
    _unregisterOnDisabledChange(fn) {
        removeListItem(this._onDisabledChange, fn);
    }
    /**
     * @internal
     */
    _forEachChild(cb) { }
    /** @internal */
    _syncPendingControls() {
        if (this.updateOn === 'submit') {
            if (this._pendingDirty)
                this.markAsDirty();
            if (this._pendingTouched)
                this.markAsTouched();
            if (this._pendingChange) {
                this.setValue(this._pendingValue, { onlySelf: true, emitModelToViewChange: false });
                return true;
            }
        }
        return false;
    }
    _applyFormState(formState) {
        if (this._isBoxedValue(formState)) {
            this.value = this._pendingValue = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            this.value = this._pendingValue = formState;
        }
    }
}
/**
 * @overriddenImplementation The constructor for FormControl is decoupled from its implementation.
 * This allows us to provide multiple constructor signatures.
 */
export const FormControl = FormControlImpl;
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
export class FormGroup extends AbstractControl {
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
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
            // so we set `emitEvent` to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control.
     * Use {@link FormGroup#addControl addControl} instead.
     *
     * @param name The control name to register in the collection
     * @param control Provides the control for the given name
     */
    registerControl(name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    }
    /**
     * Add a control to this group.
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
    addControl(name, control, options = {}) {
        this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
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
    removeControl(name, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Replace an existing control.
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
    setControl(name, control, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
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
    contains(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    }
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
    setValue(value, options = {}) {
        assertAllValuesPresent(this, value);
        Object.keys(value).forEach(name => {
            assertControlPresent(this, name);
            this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
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
    patchValue(value, options = {}) {
        // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
        // `patchValue` can be called recursively and inner data structures might have these values, so
        // we just ignore such cases when a field containing FormGroup instance receives `null` or
        // `undefined` as a value.
        if (value == null /* both `null` and `undefined` */)
            return;
        Object.keys(value).forEach(name => {
            if (this.controls[name]) {
                this.controls[name].patchValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
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
    reset(value = {}, options = {}) {
        this._forEachChild((control, name) => {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     * The `value` property is the best way to get the value of the group, because
     * it excludes disabled controls in the `FormGroup`.
     */
    getRawValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            acc[name] = getRawValue(control);
            return acc;
        });
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
            return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _forEachChild(cb) {
        Object.keys(this.controls).forEach(key => {
            // The list of controls can change (for ex. controls might be removed) while the loop
            // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
            // have to null check before invoking the callback.
            const control = this.controls[key];
            control && cb(control, key);
        });
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => {
            control.setParent(this);
            control._registerOnCollectionChange(this._onCollectionChange);
        });
    }
    /** @internal */
    _updateValue() {
        this.value = this._reduceValue();
    }
    /** @internal */
    _anyControls(condition) {
        for (const controlName of Object.keys(this.controls)) {
            const control = this.controls[controlName];
            if (this.contains(controlName) && condition(control)) {
                return true;
            }
        }
        return false;
    }
    /** @internal */
    _reduceValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            if (control.enabled || this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    }
    /** @internal */
    _reduceChildren(initValue, fn) {
        let res = initValue;
        this._forEachChild((control, name) => {
            res = fn(res, control, name);
        });
        return res;
    }
    /** @internal */
    _allControlsDisabled() {
        for (const controlName of Object.keys(this.controls)) {
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    }
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
export class FormArray extends AbstractControl {
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
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`.
            // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
            // to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to retrieve the control
     */
    at(index) {
        return this.controls[index];
    }
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
    push(control, options = {}) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
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
    insert(index, control, options = {}) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
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
    removeAt(index, options = {}) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
        this.controls.splice(index, 1);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
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
    setControl(index, control, options = {}) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
        this.controls.splice(index, 1);
        if (control) {
            this.controls.splice(index, 0, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Length of the control array.
     */
    get length() {
        return this.controls.length;
    }
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
    setValue(value, options = {}) {
        assertAllValuesPresent(this, value);
        value.forEach((newValue, index) => {
            assertControlPresent(this, index);
            this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
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
    patchValue(value, options = {}) {
        // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
        // `patchValue` can be called recursively and inner data structures might have these values, so
        // we just ignore such cases when a field containing FormArray instance receives `null` or
        // `undefined` as a value.
        if (value == null /* both `null` and `undefined` */)
            return;
        value.forEach((newValue, index) => {
            if (this.at(index)) {
                this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
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
    reset(value = [], options = {}) {
        this._forEachChild((control, index) => {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     * For enabled controls only, the `value` property is the best way to get the value of the array.
     */
    getRawValue() {
        return this.controls.map((control) => getRawValue(control));
    }
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
    clear(options = {}) {
        if (this.controls.length < 1)
            return;
        this._forEachChild((control) => control._registerOnCollectionChange(() => { }));
        this.controls.splice(0);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this.controls.reduce((updated, child) => {
            return child._syncPendingControls() ? true : updated;
        }, false);
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _forEachChild(cb) {
        this.controls.forEach((control, index) => {
            cb(control, index);
        });
    }
    /** @internal */
    _updateValue() {
        this.value =
            this.controls.filter((control) => control.enabled || this.disabled)
                .map((control) => control.value);
    }
    /** @internal */
    _anyControls(condition) {
        return this.controls.some((control) => control.enabled && condition(control));
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => this._registerControl(control));
    }
    /** @internal */
    _allControlsDisabled() {
        for (const control of this.controls) {
            if (control.enabled)
                return false;
        }
        return this.controls.length > 0 || this.disabled;
    }
    _registerControl(control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBRSxhQUFhLElBQUksWUFBWSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRzFFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSx3QkFBd0IsRUFBRSxlQUFlLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUM1RyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFHbkQsT0FBTyxFQUFDLGFBQWEsRUFBRSxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRXBJLE1BQU0sV0FBVyxHQUFHLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO0FBRXBFOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBRTdCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFakM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztBQW1CbkMsU0FBUyxLQUFLLENBQUMsT0FBd0IsRUFBRSxJQUFpQyxFQUFFLFNBQWlCO0lBQzNGLElBQUksSUFBSSxJQUFJLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUU5QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5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SUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztpQkFDOUQsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELGdCQUFnQjtJQUNQLFlBQVksQ0FBQyxTQUEwQztRQUM5RCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNqRyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGNBQWM7UUFDWixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELGdCQUFnQjtJQUNQLG9CQUFvQjtRQUMzQixLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxPQUFPLENBQUMsT0FBTztnQkFBRSxPQUFPLEtBQUssQ0FBQztTQUNuQztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkQsQ0FBQztJQUVPLGdCQUFnQixDQUFDLE9BQXdCO1FBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0V2ZW50RW1pdHRlciwgybVSdW50aW1lRXJyb3IgYXMgUnVudGltZUVycm9yfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7bWlzc2luZ0NvbnRyb2xFcnJvciwgbWlzc2luZ0NvbnRyb2xWYWx1ZUVycm9yLCBub0NvbnRyb2xzRXJyb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtyZW1vdmVMaXN0SXRlbX0gZnJvbSAnLi9kaXJlY3RpdmVzL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge1J1bnRpbWVFcnJvckNvZGV9IGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7YWRkVmFsaWRhdG9ycywgY29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIGhhc1ZhbGlkYXRvciwgcmVtb3ZlVmFsaWRhdG9ycywgdG9PYnNlcnZhYmxlfSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG5jb25zdCBOR19ERVZfTU9ERSA9IHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8ICEhbmdEZXZNb2RlO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJRCA9ICdWQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgSU5WQUxJRCA9ICdJTlZBTElEJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBwZW5kaW5nLCBtZWFuaW5nIHRoYXQgdGhhdCBhc3luYyB2YWxpZGF0aW9uIGlzIG9jY3VycmluZyBhbmRcbiAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBtYXJrQXNQZW5kaW5nYFxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgUEVORElORyA9ICdQRU5ESU5HJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yXG4gKiBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzRGlzYWJsZWRgXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBESVNBQkxFRCA9ICdESVNBQkxFRCc7XG5cbi8qKlxuICogQSBmb3JtIGNhbiBoYXZlIHNldmVyYWwgZGlmZmVyZW50IHN0YXR1c2VzLiBFYWNoXG4gKiBwb3NzaWJsZSBzdGF0dXMgaXMgcmV0dXJuZWQgYXMgYSBzdHJpbmcgbGl0ZXJhbC5cbiAqXG4gKiAqICoqVkFMSUQqKjogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgdmFsaWQsIG1lYW5pbmcgdGhhdCBubyBlcnJvcnMgZXhpc3QgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipJTlZBTElEKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipQRU5ESU5HKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIHBlbmRpbmcsIG1lYW5pbmcgdGhhdCB0aGF0IGFzeW5jIHZhbGlkYXRpb24gaXNcbiAqIG9jY3VycmluZyBhbmQgZXJyb3JzIGFyZSBub3QgeWV0IGF2YWlsYWJsZSBmb3IgdGhlIGlucHV0IHZhbHVlLlxuICogKiAqKkRJU0FCTEVEKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzXG4gKiBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yIGNhbGN1bGF0aW9ucyBvZiB2YWxpZGl0eSBvciB2YWx1ZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIEZvcm1Db250cm9sU3RhdHVzID0gJ1ZBTElEJ3wnSU5WQUxJRCd8J1BFTkRJTkcnfCdESVNBQkxFRCc7XG5cbmZ1bmN0aW9uIF9maW5kKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgcGF0aDogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nLCBkZWxpbWl0ZXI6IHN0cmluZykge1xuICBpZiAocGF0aCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkocGF0aCkpIHtcbiAgICBwYXRoID0gcGF0aC5zcGxpdChkZWxpbWl0ZXIpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHBhdGgpICYmIHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICAvLyBOb3QgdXNpbmcgQXJyYXkucmVkdWNlIGhlcmUgZHVlIHRvIGEgQ2hyb21lIDgwIGJ1Z1xuICAvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMDQ5OTgyXG4gIGxldCBjb250cm9sVG9GaW5kOiBBYnN0cmFjdENvbnRyb2x8bnVsbCA9IGNvbnRyb2w7XG4gIHBhdGguZm9yRWFjaCgobmFtZTogc3RyaW5nfG51bWJlcikgPT4ge1xuICAgIGlmIChpc0Zvcm1Hcm91cChjb250cm9sVG9GaW5kKSkge1xuICAgICAgY29udHJvbFRvRmluZCA9IGNvbnRyb2xUb0ZpbmQuY29udHJvbHMuaGFzT3duUHJvcGVydHkobmFtZSBhcyBzdHJpbmcpID9cbiAgICAgICAgICBjb250cm9sVG9GaW5kLmNvbnRyb2xzW25hbWVdIDpcbiAgICAgICAgICBudWxsO1xuICAgIH0gZWxzZSBpZiAoaXNGb3JtQXJyYXkoY29udHJvbFRvRmluZCkpIHtcbiAgICAgIGNvbnRyb2xUb0ZpbmQgPSBjb250cm9sVG9GaW5kLmF0KDxudW1iZXI+bmFtZSkgfHwgbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udHJvbFRvRmluZCA9IG51bGw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGNvbnRyb2xUb0ZpbmQ7XG59XG5cbi8qKlxuICogR2V0cyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIHBpY2tWYWxpZGF0b3JzKHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bGwpOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwge1xuICByZXR1cm4gKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gdmFsaWRhdG9yT3JPcHRzLnZhbGlkYXRvcnMgOiB2YWxpZGF0b3JPck9wdHMpIHx8IG51bGw7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB2YWxpZGF0b3IgZnVuY3Rpb24gYnkgY29tYmluaW5nIHByb3ZpZGVkIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvcjogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsKTogVmFsaWRhdG9yRm58bnVsbCB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHZhbGlkYXRvcikgPyBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3IpIDogdmFsaWRhdG9yIHx8IG51bGw7XG59XG5cbi8qKlxuICogR2V0cyBhc3luYyB2YWxpZGF0b3JzIGZyb20gZWl0aGVyIGFuIG9wdGlvbnMgb2JqZWN0IG9yIGdpdmVuIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIHBpY2tBc3luY1ZhbGlkYXRvcnMoXG4gICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsLFxuICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsKTogQXN5bmNWYWxpZGF0b3JGbnxcbiAgICBBc3luY1ZhbGlkYXRvckZuW118bnVsbCB7XG4gIHJldHVybiAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyB2YWxpZGF0b3JPck9wdHMuYXN5bmNWYWxpZGF0b3JzIDogYXN5bmNWYWxpZGF0b3IpIHx8IG51bGw7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb24gYnkgY29tYmluaW5nIHByb3ZpZGVkIGFzeW5jIHZhbGlkYXRvcnMuXG4gKi9cbmZ1bmN0aW9uIGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCk6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFzeW5jVmFsaWRhdG9yKSA/IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNWYWxpZGF0b3IgfHwgbnVsbDtcbn1cblxuZXhwb3J0IHR5cGUgRm9ybUhvb2tzID0gJ2NoYW5nZSd8J2JsdXInfCdzdWJtaXQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igb3B0aW9ucyBwcm92aWRlZCB0byBhbiBgQWJzdHJhY3RDb250cm9sYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGEgY29udHJvbC5cbiAgICovXG4gIHZhbGlkYXRvcnM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGw7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgYXN5bmMgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGNvbnRyb2wuXG4gICAqL1xuICBhc3luY1ZhbGlkYXRvcnM/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBldmVudCBuYW1lIGZvciBjb250cm9sIHRvIHVwZGF0ZSB1cG9uLlxuICAgKi9cbiAgdXBkYXRlT24/OiAnY2hhbmdlJ3wnYmx1cid8J3N1Ym1pdCc7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBvcHRpb25zIHByb3ZpZGVkIHRvIGEge0BsaW5rIEZvcm1Db250cm9sfS5cbiAqXG4gKiBUaGlzIGludGVyZmFjZSBleHRlbmRzIGFsbCBvcHRpb25zIGZyb20ge0BsaW5rIEFic3RyYWN0Q29udHJvbE9wdGlvbnN9LCBwbHVzIHNvbWUgb3B0aW9uc1xuICogdW5pcXVlIHRvIGBGb3JtQ29udHJvbGAuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZvcm1Db250cm9sT3B0aW9ucyBleHRlbmRzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFdoZXRoZXIgdG8gdXNlIHRoZSBpbml0aWFsIHZhbHVlIHVzZWQgdG8gY29uc3RydWN0IHRoZSB7QGxpbmsgRm9ybUNvbnRyb2x9IGFzIGl0cyBkZWZhdWx0IHZhbHVlXG4gICAqIGFzIHdlbGwuIElmIHRoaXMgb3B0aW9uIGlzIGZhbHNlIG9yIG5vdCBwcm92aWRlZCwgdGhlIGRlZmF1bHQgdmFsdWUgb2YgYSBGb3JtQ29udHJvbCBpcyBgbnVsbGAuXG4gICAqIFdoZW4gYSBGb3JtQ29udHJvbCBpcyByZXNldCB3aXRob3V0IGFuIGV4cGxpY2l0IHZhbHVlLCBpdHMgdmFsdWUgcmV2ZXJ0cyB0b1xuICAgKiBpdHMgZGVmYXVsdCB2YWx1ZS5cbiAgICovXG4gIGluaXRpYWxWYWx1ZUlzRGVmYXVsdD86IGJvb2xlYW47XG59XG5cbmZ1bmN0aW9uIGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8XG4gICAgICAgICAgICAgICAgICAgICAgbnVsbCk6IHZhbGlkYXRvck9yT3B0cyBpcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgcmV0dXJuIHZhbGlkYXRvck9yT3B0cyAhPSBudWxsICYmICFBcnJheS5pc0FycmF5KHZhbGlkYXRvck9yT3B0cykgJiZcbiAgICAgIHR5cGVvZiB2YWxpZGF0b3JPck9wdHMgPT09ICdvYmplY3QnO1xufVxuXG5leHBvcnQgY29uc3QgaXNGb3JtQ29udHJvbCA9IChjb250cm9sOiB1bmtub3duKTogY29udHJvbCBpcyBGb3JtQ29udHJvbCA9PlxuICAgIGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtQ29udHJvbDtcblxuZXhwb3J0IGNvbnN0IGlzRm9ybUdyb3VwID0gKGNvbnRyb2w6IHVua25vd24pOiBjb250cm9sIGlzIEZvcm1Hcm91cCA9PiBjb250cm9sIGluc3RhbmNlb2YgRm9ybUdyb3VwO1xuXG5leHBvcnQgY29uc3QgaXNGb3JtQXJyYXkgPSAoY29udHJvbDogdW5rbm93bik6IGNvbnRyb2wgaXMgRm9ybUFycmF5ID0+IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtQXJyYXk7XG5cbmZ1bmN0aW9uIGdldFJhd1ZhbHVlKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IGFueSB7XG4gIHJldHVybiBpc0Zvcm1Db250cm9sKGNvbnRyb2wpID8gY29udHJvbC52YWx1ZSA6IChjb250cm9sIGFzIEZvcm1Hcm91cCB8IEZvcm1BcnJheSkuZ2V0UmF3VmFsdWUoKTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0Q29udHJvbFByZXNlbnQocGFyZW50OiBGb3JtR3JvdXB8Rm9ybUFycmF5LCBrZXk6IHN0cmluZ3xudW1iZXIpOiB2b2lkIHtcbiAgY29uc3QgaXNHcm91cCA9IGlzRm9ybUdyb3VwKHBhcmVudCk7XG4gIGNvbnN0IGNvbnRyb2xzID0gcGFyZW50LmNvbnRyb2xzIGFzIHtba2V5OiBzdHJpbmd8bnVtYmVyXTogdW5rbm93bn07XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBpc0dyb3VwID8gT2JqZWN0LmtleXMoY29udHJvbHMpIDogY29udHJvbHM7XG4gIGlmICghY29sbGVjdGlvbi5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLk5PX0NPTlRST0xTLCBOR19ERVZfTU9ERSA/IG5vQ29udHJvbHNFcnJvcihpc0dyb3VwKSA6ICcnKTtcbiAgfVxuICBpZiAoIWNvbnRyb2xzW2tleV0pIHtcbiAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICBSdW50aW1lRXJyb3JDb2RlLk1JU1NJTkdfQ09OVFJPTCwgTkdfREVWX01PREUgPyBtaXNzaW5nQ29udHJvbEVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0QWxsVmFsdWVzUHJlc2VudChjb250cm9sOiBGb3JtR3JvdXB8Rm9ybUFycmF5LCB2YWx1ZTogYW55KTogdm9pZCB7XG4gIGNvbnN0IGlzR3JvdXAgPSBpc0Zvcm1Hcm91cChjb250cm9sKTtcbiAgY29udHJvbC5fZm9yRWFjaENoaWxkKChfOiB1bmtub3duLCBrZXk6IHN0cmluZ3xudW1iZXIpID0+IHtcbiAgICBpZiAodmFsdWVba2V5XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFxuICAgICAgICAgIFJ1bnRpbWVFcnJvckNvZGUuTUlTU0lOR19DT05UUk9MX1ZBTFVFLFxuICAgICAgICAgIE5HX0RFVl9NT0RFID8gbWlzc2luZ0NvbnRyb2xWYWx1ZUVycm9yKGlzR3JvdXAsIGtleSkgOiAnJyk7XG4gICAgfVxuICB9KTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIEl0IHByb3ZpZGVzIHNvbWUgb2YgdGhlIHNoYXJlZCBiZWhhdmlvciB0aGF0IGFsbCBjb250cm9scyBhbmQgZ3JvdXBzIG9mIGNvbnRyb2xzIGhhdmUsIGxpa2VcbiAqIHJ1bm5pbmcgdmFsaWRhdG9ycywgY2FsY3VsYXRpbmcgc3RhdHVzLCBhbmQgcmVzZXR0aW5nIHN0YXRlLiBJdCBhbHNvIGRlZmluZXMgdGhlIHByb3BlcnRpZXNcbiAqIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBzdWItY2xhc3NlcywgbGlrZSBgdmFsdWVgLCBgdmFsaWRgLCBhbmQgYGRpcnR5YC4gSXQgc2hvdWxkbid0IGJlXG4gKiBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogQHNlZSBbRm9ybXMgR3VpZGVdKC9ndWlkZS9mb3JtcylcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXSgvZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIFtEeW5hbWljIEZvcm1zIEd1aWRlXSgvZ3VpZGUvZHluYW1pYy1mb3JtKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBhIGNvbnRyb2wgaGFzIGl0cyBvd24gcGVuZGluZyBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiBpbiBwcm9ncmVzcy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfaGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVPbj86IEZvcm1Ib29rcztcblxuICBwcml2YXRlIF9wYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXl8bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbjogYW55O1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvblxuICAgKiAoY29tYmluZWQgdXNpbmcgYFZhbGlkYXRvcnMuY29tcG9zZWApLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX2NvbXBvc2VkVmFsaWRhdG9yRm46IFZhbGlkYXRvckZufG51bGw7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIHRoZSByZXN1bHQgb2YgbWVyZ2luZyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvblxuICAgKiAoY29tYmluZWQgdXNpbmcgYFZhbGlkYXRvcnMuY29tcG9zZUFzeW5jYCkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuOiBBc3luY1ZhbGlkYXRvckZufG51bGw7XG5cbiAgLyoqXG4gICAqIFN5bmNocm9ub3VzIHZhbGlkYXRvcnMgYXMgdGhleSB3ZXJlIHByb3ZpZGVkOlxuICAgKiAgLSBpbiBgQWJzdHJhY3RDb250cm9sYCBjb25zdHJ1Y3RvclxuICAgKiAgLSBhcyBhbiBhcmd1bWVudCB3aGlsZSBjYWxsaW5nIGBzZXRWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGB2YWxpZGF0b3JgIGZpZWxkIChlLmcuIGBjb250cm9sLnZhbGlkYXRvciA9IHZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdWYWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGw7XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0QXN5bmNWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGBhc3luY1ZhbGlkYXRvcmAgZmllbGQgKGUuZy4gYGNvbnRyb2wuYXN5bmNWYWxpZGF0b3IgPVxuICAgKiBhc3luY1ZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdBc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiAqIEZvciBhIGBGb3JtQ29udHJvbGAsIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiAqIEZvciBhbiBlbmFibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gb2JqZWN0XG4gICAqIHdpdGggYSBrZXktdmFsdWUgcGFpciBmb3IgZWFjaCBtZW1iZXIgb2YgdGhlIGdyb3VwLlxuICAgKiAqIEZvciBhIGRpc2FibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGFsbCBjb250cm9scyBhcyBhbiBvYmplY3RcbiAgICogd2l0aCBhIGtleS12YWx1ZSBwYWlyIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgZ3JvdXAuXG4gICAqICogRm9yIGEgYEZvcm1BcnJheWAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBhcnJheS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBYnN0cmFjdENvbnRyb2wgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2ZcbiAgICogICAgIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB2YWxpZGl0eSBvZlxuICAgKiAgICAgdGhpcyBjb250cm9sIGFzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdmFsaWRhdG9ycztcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcnM7XG4gICAgdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IGNvZXJjZVRvVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IodGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZiB0aGlzIGNvbnRyb2wgc3luY2hyb25vdXNseS5cbiAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBnZXQgdmFsaWRhdG9yKCk6IFZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb21wb3NlZFZhbGlkYXRvckZuO1xuICB9XG4gIHNldCB2YWxpZGF0b3IodmFsaWRhdG9yRm46IFZhbGlkYXRvckZufG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IHZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbCBhc3luY2hyb25vdXNseS5cbiAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuO1xuICB9XG4gIHNldCBhc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvckZuOiBBc3luY1ZhbGlkYXRvckZufG51bGwpIHtcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBhc3luY1ZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJlbnQgY29udHJvbC5cbiAgICovXG4gIGdldCBwYXJlbnQoKTogRm9ybUdyb3VwfEZvcm1BcnJheXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQHNlZSBgRm9ybUNvbnRyb2xTdGF0dXNgXG4gICAqXG4gICAqIFRoZXNlIHN0YXR1cyB2YWx1ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSwgc28gYSBjb250cm9sIGNhbm5vdCBiZVxuICAgKiBib3RoIHZhbGlkIEFORCBpbnZhbGlkIG9yIGludmFsaWQgQU5EIGRpc2FibGVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1cyE6IEZvcm1Db250cm9sU3RhdHVzO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgVkFMSURgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBwYXNzZWQgYWxsIG9mIGl0cyB2YWxpZGF0aW9uIHRlc3RzLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgdmFsaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBWQUxJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGludmFsaWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBJTlZBTElEYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIGNvbnRyb2wgaGFzIGZhaWxlZCBvbmUgb3IgbW9yZSBvZiBpdHMgdmFsaWRhdGlvbiBjaGVja3MsXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBpbnZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gSU5WQUxJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHBlbmRpbmdgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBQRU5ESU5HYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIGNvbnRyb2wgaXMgaW4gdGhlIHByb2Nlc3Mgb2YgY29uZHVjdGluZyBhIHZhbGlkYXRpb24gY2hlY2ssXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBwZW5kaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PSBQRU5ESU5HO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlzYWJsZWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIERpc2FibGVkIGNvbnRyb2xzIGFyZSBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogYXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZWlyIGFuY2VzdG9yXG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBESVNBQkxFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGVuYWJsZWRgIGFzIGxvbmcgYXMgaXRzIGBzdGF0dXNgIGlzIG5vdCBgRElTQUJMRURgLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBhbnkgc3RhdHVzIG90aGVyIHRoYW4gJ0RJU0FCTEVEJyxcbiAgICogZmFsc2UgaWYgdGhlIHN0YXR1cyBpcyAnRElTQUJMRUQnLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKi9cbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzICE9PSBESVNBQkxFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhbnkgZXJyb3JzIGdlbmVyYXRlZCBieSBmYWlsaW5nIHZhbGlkYXRpb24sXG4gICAqIG9yIG51bGwgaWYgdGhlcmUgYXJlIG5vIGVycm9ycy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlcnJvcnMhOiBWYWxpZGF0aW9uRXJyb3JzfG51bGw7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgcHJpc3RpbmVgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWRcbiAgICogdGhlIHZhbHVlIGluIHRoZSBVSS5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkIHRoZSB2YWx1ZSBpbiB0aGUgVUk7IGNvbXBhcmUgYGRpcnR5YC5cbiAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpc3RpbmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGRpcnR5YCBpZiB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgdmFsdWVcbiAgICogaW4gdGhlIFVJLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZSBvZiB0aGlzIGNvbnRyb2wgaW4gdGhlIFVJOyBjb21wYXJlIGBwcmlzdGluZWAuXG4gICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgKi9cbiAgZ2V0IGRpcnR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5wcmlzdGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGlzIG1hcmtlZCBhcyBgdG91Y2hlZGAuXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBtYXJrZWQgYHRvdWNoZWRgIG9uY2UgdGhlIHVzZXIgaGFzIHRyaWdnZXJlZFxuICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0b3VjaGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIG5vdCBiZWVuIG1hcmtlZCBhcyB0b3VjaGVkXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBgdW50b3VjaGVkYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBnZXQgdW50b3VjaGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy50b3VjaGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbCBjaGFuZ2VzLCBpblxuICAgKiB0aGUgVUkgb3IgcHJvZ3JhbW1hdGljYWxseS4gSXQgYWxzbyBlbWl0cyBhbiBldmVudCBlYWNoIHRpbWUgeW91IGNhbGwgZW5hYmxlKCkgb3IgZGlzYWJsZSgpXG4gICAqIHdpdGhvdXQgcGFzc2luZyBhbG9uZyB7ZW1pdEV2ZW50OiBmYWxzZX0gYXMgYSBmdW5jdGlvbiBhcmd1bWVudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXMhOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWxpZGF0aW9uIGBzdGF0dXNgIG9mIHRoZSBjb250cm9sXG4gICAqIHJlY2FsY3VsYXRlcy5cbiAgICpcbiAgICogQHNlZSBgRm9ybUNvbnRyb2xTdGF0dXNgXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzQ2hhbmdlcyE6IE9ic2VydmFibGU8Rm9ybUNvbnRyb2xTdGF0dXM+O1xuXG4gIC8qKlxuICAgKiBSZXBvcnRzIHRoZSB1cGRhdGUgc3RyYXRlZ3kgb2YgdGhlIGBBYnN0cmFjdENvbnRyb2xgIChtZWFuaW5nXG4gICAqIHRoZSBldmVudCBvbiB3aGljaCB0aGUgY29udHJvbCB1cGRhdGVzIGl0c2VsZikuXG4gICAqIFBvc3NpYmxlIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYFxuICAgKiBEZWZhdWx0IHZhbHVlOiBgJ2NoYW5nZSdgXG4gICAqL1xuICBnZXQgdXBkYXRlT24oKTogRm9ybUhvb2tzIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlT24gPyB0aGlzLl91cGRhdGVPbiA6ICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnVwZGF0ZU9uIDogJ2NoYW5nZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gIENhbGxpbmdcbiAgICogdGhpcyBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGFkZCBhIG5ldyB2YWxpZGF0b3Igd2l0aG91dCBhZmZlY3RpbmcgZXhpc3Rpbmcgb25lcywgY29uc2lkZXJcbiAgICogdXNpbmcgYGFkZFZhbGlkYXRvcnMoKWAgbWV0aG9kIGluc3RlYWQuXG4gICAqL1xuICBzZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX3Jhd1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSBjb2VyY2VUb1ZhbGlkYXRvcih2YWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiBDYWxsaW5nIHRoaXNcbiAgICogb3ZlcndyaXRlcyBhbnkgZXhpc3RpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gYWRkIGEgbmV3IHZhbGlkYXRvciB3aXRob3V0IGFmZmVjdGluZyBleGlzdGluZyBvbmVzLCBjb25zaWRlclxuICAgKiB1c2luZyBgYWRkQXN5bmNWYWxpZGF0b3JzKClgIG1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cbiAgc2V0QXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IodmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlciB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEFkZGluZyBhIHZhbGlkYXRvciB0aGF0IGFscmVhZHkgZXhpc3RzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIElmIGR1cGxpY2F0ZSB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqIGFyZSBwcmVzZW50IGluIHRoZSBgdmFsaWRhdG9yc2AgYXJyYXksIG9ubHkgdGhlIGZpcnN0IGluc3RhbmNlIHdvdWxkIGJlIGFkZGVkIHRvIGEgZm9ybVxuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IHZhbGlkYXRvciBmdW5jdGlvbiBvciBmdW5jdGlvbnMgdG8gYWRkIHRvIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGFkZFZhbGlkYXRvcnModmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXJcbiAgICogdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBBZGRpbmcgYSB2YWxpZGF0b3IgdGhhdCBhbHJlYWR5IGV4aXN0cyB3aWxsIGhhdmUgbm8gZWZmZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gb3IgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBhZGRBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmcm9tIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsXG4gICAqIGl0IGlzIGlnbm9yZWQuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVZhbGlkYXRvcnModmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmcm9tIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsIGl0XG4gICAqIGlzIGlnbm9yZWQuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gaXMgcHJlc2VudCBvbiB0aGlzIGNvbnRyb2wuIFRoZSBwcm92aWRlZFxuICAgKiB2YWxpZGF0b3IgbXVzdCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZSBmdW5jdGlvbiB0aGF0IHdhcyBwcm92aWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvciBUaGUgdmFsaWRhdG9yIHRvIGNoZWNrIGZvciBwcmVzZW5jZS4gQ29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBwcm92aWRlZCB2YWxpZGF0b3Igd2FzIGZvdW5kIG9uIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGhhc1ZhbGlkYXRvcih2YWxpZGF0b3I6IFZhbGlkYXRvckZuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc1ZhbGlkYXRvcih0aGlzLl9yYXdWYWxpZGF0b3JzLCB2YWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBpcyBwcmVzZW50IG9uIHRoaXMgY29udHJvbC4gVGhlIHByb3ZpZGVkXG4gICAqIHZhbGlkYXRvciBtdXN0IGJlIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lIGZ1bmN0aW9uIHRoYXQgd2FzIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9yIHRvIGNoZWNrIGZvciBwcmVzZW5jZS4gQ29tcGFyZWQgYnkgZnVuY3Rpb25cbiAgICogICAgIHJlZmVyZW5jZS5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgcHJvdmlkZWQgYXN5bmNocm9ub3VzIHZhbGlkYXRvciB3YXMgZm91bmQgb24gdGhpcyBjb250cm9sLlxuICAgKi9cbiAgaGFzQXN5bmNWYWxpZGF0b3IodmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc1ZhbGlkYXRvcih0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMsIHZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogRW1wdGllcyBvdXQgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvciBsaXN0LlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBjbGVhclZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBhc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKi9cbiAgY2xlYXJBc3luY1ZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy5hc3luY1ZhbGlkYXRvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHRvdWNoZWRgLiBBIGNvbnRyb2wgaXMgdG91Y2hlZCBieSBmb2N1cyBhbmRcbiAgICogYmx1ciBldmVudHMgdGhhdCBkbyBub3QgY2hhbmdlIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQHNlZSBgbWFya0FzVW50b3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc0RpcnR5KClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzVG91Y2hlZChvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhbmQgYWxsIGl0cyBkZXNjZW5kYW50IGNvbnRyb2xzIGFzIGB0b3VjaGVkYC5cbiAgICogQHNlZSBgbWFya0FzVG91Y2hlZCgpYFxuICAgKi9cbiAgbWFya0FsbEFzVG91Y2hlZCgpOiB2b2lkIHtcbiAgICB0aGlzLm1hcmtBc1RvdWNoZWQoe29ubHlTZWxmOiB0cnVlfSk7XG5cbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5tYXJrQWxsQXNUb3VjaGVkKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB1bnRvdWNoZWRgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBhbHNvIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgdW50b3VjaGVkYFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgdG91Y2hlZGAgc3RhdHVzIG9mIGFsbCBwYXJlbnQgY29udHJvbHMuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzRGlydHkoKWBcbiAgICogQHNlZSBgbWFya0FzUHJpc3RpbmUoKWBcbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzVW50b3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dG91Y2hlZDogYm9vbGVhbn0pLnRvdWNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9wZW5kaW5nVG91Y2hlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wubWFya0FzVW50b3VjaGVkKHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgZGlydHlgLiBBIGNvbnRyb2wgYmVjb21lcyBkaXJ0eSB3aGVuXG4gICAqIHRoZSBjb250cm9sJ3MgdmFsdWUgaXMgY2hhbmdlZCB0aHJvdWdoIHRoZSBVSTsgY29tcGFyZSBgbWFya0FzVG91Y2hlZGAuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzVW50b3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzRGlydHkob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtwcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzRGlydHkob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwcmlzdGluZWAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgcHJpc3RpbmVgLFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgcHJpc3RpbmVgIHN0YXR1cyBvZiBhbGwgcGFyZW50XG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIGBtYXJrQXNUb3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1VudG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNEaXJ0eSgpYFxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIGVtaXRzIGV2ZW50cyBhZnRlclxuICAgKiBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqL1xuICBtYXJrQXNQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ByaXN0aW5lOiBib29sZWFufSkucHJpc3RpbmUgPSB0cnVlO1xuICAgIHRoaXMuX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wubWFya0FzUHJpc3RpbmUoe29ubHlTZWxmOiB0cnVlfSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcGVuZGluZ2AuXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBwZW5kaW5nIHdoaWxlIHRoZSBjb250cm9sIHBlcmZvcm1zIGFzeW5jIHZhbGlkYXRpb24uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIHRoZSBjb250cm9sIGlzIG1hcmtlZCBwZW5kaW5nLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICBtYXJrQXNQZW5kaW5nKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IFBFTkRJTkc7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNQZW5kaW5nKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogZXhjbHVkZWQgZnJvbSB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGFueSBwYXJlbnQuIEl0cyBzdGF0dXMgaXMgYERJU0FCTEVEYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGFsc28gZGlzYWJsZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBkaXNhYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAvLyBwYXJlbnQncyBkaXJ0aW5lc3MgYmFzZWQgb24gdGhlIGNoaWxkcmVuLlxuICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG5cbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IERJU0FCTEVEO1xuICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gbnVsbDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgY29udHJvbC5kaXNhYmxlKHsuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUFuY2VzdG9ycyh7Li4ub3B0cywgc2tpcFByaXN0aW5lQ2hlY2t9KTtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLmZvckVhY2goKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbih0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBpbmNsdWRlZCBpbiB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBpdHMgcGFyZW50LiBJdHMgc3RhdHVzIHJlY2FsY3VsYXRlcyBiYXNlZCBvbiBpdHMgdmFsdWUgYW5kXG4gICAqIGl0cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpZiB0aGUgY29udHJvbCBoYXMgY2hpbGRyZW4sIGFsbCBjaGlsZHJlbiBhcmUgZW5hYmxlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBjb250cm9sIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyB3aGVuIG1hcmtlZCBhcyB1bnRvdWNoZWRcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgZW5hYmxlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgZW5hYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAvLyBwYXJlbnQncyBkaXJ0aW5lc3MgYmFzZWQgb24gdGhlIGNoaWxkcmVuLlxuICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG5cbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IFZBTElEO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLmVuYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4oZmFsc2UpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUFuY2VzdG9ycyhcbiAgICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW4sIHNraXBQcmlzdGluZUNoZWNrPzogYm9vbGVhbn0pIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICAgIGlmICghb3B0cy5za2lwUHJpc3RpbmVDaGVjaykge1xuICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHBhcmVudCBTZXRzIHRoZSBwYXJlbnQgb2YgdGhlIGNvbnRyb2xcbiAgICovXG4gIHNldFBhcmVudChwYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXkpOiB2b2lkIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCByZXNldCh2YWx1ZT86IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpdCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiBpdHMgYW5jZXN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50c1xuICAgKiBhZnRlciB1cGRhdGVzIGFuZCB2YWxpZGl0eSBjaGVja3MgYXJlIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBvbmx5IHVwZGF0ZSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiB1cGRhdGUgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX3NldEluaXRpYWxTdGF0dXMoKTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5fY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTtcbiAgICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gdGhpcy5fcnVuVmFsaWRhdG9yKCk7XG4gICAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFZBTElEIHx8IHRoaXMuc3RhdHVzID09PSBQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3J1bkFzeW5jVmFsaWRhdG9yKG9wdHMuZW1pdEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRyZWVWYWxpZGl0eShvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7ZW1pdEV2ZW50OiB0cnVlfSkge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY3RybDogQWJzdHJhY3RDb250cm9sKSA9PiBjdHJsLl91cGRhdGVUcmVlVmFsaWRpdHkob3B0cykpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnR9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldEluaXRpYWxTdGF0dXMoKSB7XG4gICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSB0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkgPyBESVNBQkxFRCA6IFZBTElEO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuVmFsaWRhdG9yKCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yID8gdGhpcy52YWxpZGF0b3IodGhpcykgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuQXN5bmNWYWxpZGF0b3IoZW1pdEV2ZW50PzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IFBFTkRJTkc7XG4gICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSB0cnVlO1xuICAgICAgY29uc3Qgb2JzID0gdG9PYnNlcnZhYmxlKHRoaXMuYXN5bmNWYWxpZGF0b3IodGhpcykpO1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uID0gb2JzLnN1YnNjcmliZSgoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwpID0+IHtcbiAgICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0cmlnZ2VyIHRoZSByZWNhbGN1bGF0aW9uIG9mIHRoZSB2YWxpZGF0aW9uIHN0YXR1cywgd2hpY2ggZGVwZW5kcyBvblxuICAgICAgICAvLyB0aGUgc3RhdGUgb2YgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0aW9uICh3aGV0aGVyIGl0IGlzIGluIHByb2dyZXNzIG9yIG5vdCkuIFNvLCBpdCBpc1xuICAgICAgICAvLyBuZWNlc3NhcnkgdGhhdCB3ZSBoYXZlIHVwZGF0ZWQgdGhlIGBfaGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yYCBib29sZWFuIGZsYWcgZmlyc3QuXG4gICAgICAgIHRoaXMuc2V0RXJyb3JzKGVycm9ycywge2VtaXRFdmVudH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBlcnJvcnMgb24gYSBmb3JtIGNvbnRyb2wgd2hlbiBydW5uaW5nIHZhbGlkYXRpb25zIG1hbnVhbGx5LCByYXRoZXIgdGhhbiBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBDYWxsaW5nIGBzZXRFcnJvcnNgIGFsc28gdXBkYXRlcyB0aGUgdmFsaWRpdHkgb2YgdGhlIHBhcmVudCBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgTWFudWFsbHkgc2V0IHRoZSBlcnJvcnMgZm9yIGEgY29udHJvbFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgbG9naW4gPSBuZXcgRm9ybUNvbnRyb2woJ3NvbWVMb2dpbicpO1xuICAgKiBsb2dpbi5zZXRFcnJvcnMoe1xuICAgKiAgIG5vdFVuaXF1ZTogdHJ1ZVxuICAgKiB9KTtcbiAgICpcbiAgICogZXhwZWN0KGxvZ2luLnZhbGlkKS50b0VxdWFsKGZhbHNlKTtcbiAgICogZXhwZWN0KGxvZ2luLmVycm9ycykudG9FcXVhbCh7IG5vdFVuaXF1ZTogdHJ1ZSB9KTtcbiAgICpcbiAgICogbG9naW4uc2V0VmFsdWUoJ3NvbWVPdGhlckxvZ2luJyk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbCh0cnVlKTtcbiAgICogYGBgXG4gICAqL1xuICBzZXRFcnJvcnMoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwsIG9wdHM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge2Vycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGx9KS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgdGhpcy5fdXBkYXRlQ29udHJvbHNFcnJvcnMob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBBIGRvdC1kZWxpbWl0ZWQgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZy9udW1iZXIgdmFsdWVzIHRoYXQgZGVmaW5lIHRoZSBwYXRoIHRvIHRoZVxuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUmV0cmlldmUgYSBuZXN0ZWQgY29udHJvbFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gZ2V0IGEgYG5hbWVgIGNvbnRyb2wgbmVzdGVkIHdpdGhpbiBhIGBwZXJzb25gIHN1Yi1ncm91cDpcbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldCgncGVyc29uLm5hbWUnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ3BlcnNvbicsICduYW1lJ10pO2BcbiAgICpcbiAgICogIyMjIFJldHJpZXZlIGEgY29udHJvbCBpbiBhIEZvcm1BcnJheVxuICAgKlxuICAgKiBXaGVuIGFjY2Vzc2luZyBhbiBlbGVtZW50IGluc2lkZSBhIEZvcm1BcnJheSwgeW91IGNhbiB1c2UgYW4gZWxlbWVudCBpbmRleC5cbiAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBwcmljZWAgY29udHJvbCBmcm9tIHRoZSBmaXJzdCBlbGVtZW50IGluIGFuIGBpdGVtc2AgYXJyYXkgeW91IGNhbiB1c2U6XG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoJ2l0ZW1zLjAucHJpY2UnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ2l0ZW1zJywgMCwgJ3ByaWNlJ10pO2BcbiAgICovXG4gIGdldChwYXRoOiBBcnJheTxzdHJpbmd8bnVtYmVyPnxzdHJpbmcpOiBBYnN0cmFjdENvbnRyb2x8bnVsbCB7XG4gICAgcmV0dXJuIF9maW5kKHRoaXMsIHBhdGgsICcuJyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogQHJldHVybnMgZXJyb3IgZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIGVycm9yLiBJZiB0aGUgY29udHJvbCBvciBlcnJvciBpcyBub3QgcHJlc2VudCxcbiAgICogbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIGdldEVycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBjb250cm9sID0gcGF0aCA/IHRoaXMuZ2V0KHBhdGgpIDogdGhpcztcbiAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sLmVycm9ycyA/IGNvbnRyb2wuZXJyb3JzW2Vycm9yQ29kZV0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGVycm9yIHNwZWNpZmllZC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogSWYgbm8gcGF0aCBpcyBnaXZlbiwgdGhpcyBtZXRob2QgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIGZhbHNlIGlzIHJldHVybmVkLlxuICAgKi9cbiAgaGFzRXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcsIHBhdGg/OiBBcnJheTxzdHJpbmd8bnVtYmVyPnxzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmdldEVycm9yKGVycm9yQ29kZSwgcGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSB0b3AtbGV2ZWwgYW5jZXN0b3Igb2YgdGhpcyBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHJvb3QoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBsZXQgeDogQWJzdHJhY3RDb250cm9sID0gdGhpcztcblxuICAgIHdoaWxlICh4Ll9wYXJlbnQpIHtcbiAgICAgIHggPSB4Ll9wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuXG4gICAgaWYgKGVtaXRFdmVudCkge1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKGVtaXRFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5pdE9ic2VydmFibGVzKCkge1xuICAgICh0aGlzIGFzIHt2YWx1ZUNoYW5nZXM6IE9ic2VydmFibGU8YW55Pn0pLnZhbHVlQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAodGhpcyBhcyB7c3RhdHVzQ2hhbmdlczogT2JzZXJ2YWJsZTxGb3JtQ29udHJvbFN0YXR1cz59KS5zdGF0dXNDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB9XG5cblxuICBwcml2YXRlIF9jYWxjdWxhdGVTdGF0dXMoKTogRm9ybUNvbnRyb2xTdGF0dXMge1xuICAgIGlmICh0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkpIHJldHVybiBESVNBQkxFRDtcbiAgICBpZiAodGhpcy5lcnJvcnMpIHJldHVybiBJTlZBTElEO1xuICAgIGlmICh0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgfHwgdGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKFBFTkRJTkcpKSByZXR1cm4gUEVORElORztcbiAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKElOVkFMSUQpKSByZXR1cm4gSU5WQUxJRDtcbiAgICByZXR1cm4gVkFMSUQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF91cGRhdGVWYWx1ZSgpOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2ZvckVhY2hDaGlsZChjYjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfYW55Q29udHJvbHMoY29uZGl0aW9uOiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiBib29sZWFuKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhzdGF0dXM6IEZvcm1Db250cm9sU3RhdHVzKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuc3RhdHVzID09PSBzdGF0dXMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNEaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5kaXJ0eSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc1RvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wudG91Y2hlZCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ByaXN0aW5lOiBib29sZWFufSkucHJpc3RpbmUgPSAhdGhpcy5fYW55Q29udHJvbHNEaXJ0eSgpO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUb3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dG91Y2hlZDogYm9vbGVhbn0pLnRvdWNoZWQgPSB0aGlzLl9hbnlDb250cm9sc1RvdWNoZWQoKTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkRpc2FibGVkQ2hhbmdlOiBBcnJheTwoaXNEaXNhYmxlZDogYm9vbGVhbikgPT4gdm9pZD4gPSBbXTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9pc0JveGVkVmFsdWUoZm9ybVN0YXRlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIGZvcm1TdGF0ZSA9PT0gJ29iamVjdCcgJiYgZm9ybVN0YXRlICE9PSBudWxsICYmXG4gICAgICAgIE9iamVjdC5rZXlzKGZvcm1TdGF0ZSkubGVuZ3RoID09PSAyICYmICd2YWx1ZScgaW4gZm9ybVN0YXRlICYmICdkaXNhYmxlZCcgaW4gZm9ybVN0YXRlO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwZGF0ZVN0cmF0ZWd5KG9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCk6IHZvaWQge1xuICAgIGlmIChpc09wdGlvbnNPYmoob3B0cykgJiYgb3B0cy51cGRhdGVPbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLl91cGRhdGVPbiA9IG9wdHMudXBkYXRlT24hO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIHBhcmVudCBoYXMgYmVlbiBtYXJrZWQgYXJ0aWZpY2lhbGx5IGRpcnR5LlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX3BhcmVudE1hcmtlZERpcnR5KG9ubHlTZWxmPzogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHBhcmVudERpcnR5ID0gdGhpcy5fcGFyZW50ICYmIHRoaXMuX3BhcmVudC5kaXJ0eTtcbiAgICByZXR1cm4gIW9ubHlTZWxmICYmICEhcGFyZW50RGlydHkgJiYgIXRoaXMuX3BhcmVudCEuX2FueUNvbnRyb2xzRGlydHkoKTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIEZvcm1Db250cm9sIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgcmVhZG9ubHkgZGVmYXVsdFZhbHVlOiBhbnk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uQ2hhbmdlOiBGdW5jdGlvbltdO1xuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nVmFsdWU6IGFueTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ0NoYW5nZTogYm9vbGVhbjtcbiAgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW4sXG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbixcbiAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxuICAgIGVtaXRWaWV3VG9Nb2RlbENoYW5nZT86IGJvb2xlYW5cbiAgfSk6IHZvaWQ7XG4gIHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW4sXG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbixcbiAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxuICAgIGVtaXRWaWV3VG9Nb2RlbENoYW5nZT86IGJvb2xlYW5cbiAgfSk6IHZvaWQ7XG4gIHJlc2V0KGZvcm1TdGF0ZT86IGFueSwgb3B0aW9ucz86IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlVmFsdWUoKTogdm9pZDtcbiAgLyoqICBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW47XG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdW5yZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQ7XG4gIHJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShmbjogKGlzRGlzYWJsZWQ6IGJvb2xlYW4pID0+IHZvaWQpOiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF91bnJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShmbjogKGlzRGlzYWJsZWQ6IGJvb2xlYW4pID0+IHZvaWQpOiB2b2lkO1xuICAvKiogQGludGVybmFsICovXG4gIF9mb3JFYWNoQ2hpbGQoY2I6IEZ1bmN0aW9uKTogdm9pZDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFZhcmlvdXMgYXZhaWxhYmxlIGNvbnN0cnVjdG9ycyBmb3IgYEZvcm1Db250cm9sYC5cbiAqIERvIG5vdCB1c2UgdGhpcyBpbnRlcmZhY2UgZGlyZWN0bHkuIEluc3RlYWQsIHVzZSBgRm9ybUNvbnRyb2xgOlxuICogYGBgXG4gKiBjb25zdCBmYyA9IG5ldyBGb3JtQ29udHJvbCgnZm9vJyk7XG4gKiBgYGBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGb3JtQ29udHJvbEN0b3Ige1xuICAvKipcbiAgICogQ29uc3RydWN0IGEgRm9ybUNvbnRyb2wgd2l0aCBubyBpbml0aWFsIHZhbHVlIG9yIHZhbGlkYXRvcnMuXG4gICAqL1xuICBuZXcoKTogRm9ybUNvbnRyb2w7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Db250cm9sYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEZvcm1Db250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICovXG4gIG5ldyh2YWx1ZTogYW55LCB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEZvcm1Db250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKTogRm9ybUNvbnRyb2w7XG59XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMgb2YgYW4gaW5kaXZpZHVhbCBmb3JtIGNvbnRyb2wuXG4gKlxuICogVGhpcyBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyBvZiBBbmd1bGFyIGZvcm1zLCBhbG9uZyB3aXRoXG4gKiBgRm9ybUdyb3VwYCBhbmQgYEZvcm1BcnJheWAuIEl0IGV4dGVuZHMgdGhlIGBBYnN0cmFjdENvbnRyb2xgIGNsYXNzIHRoYXRcbiAqIGltcGxlbWVudHMgbW9zdCBvZiB0aGUgYmFzZSBmdW5jdGlvbmFsaXR5IGZvciBhY2Nlc3NpbmcgdGhlIHZhbHVlLCB2YWxpZGF0aW9uIHN0YXR1cyxcbiAqIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBldmVudHMuIFNlZSBbdXNhZ2UgZXhhbXBsZXMgYmVsb3ddKCN1c2FnZS1ub3RlcykuXG4gKlxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBbVXNhZ2UgTm90ZXNdKCN1c2FnZS1ub3RlcylcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBJbml0aWFsaXppbmcgRm9ybSBDb250cm9sc1xuICpcbiAqIEluc3RhbnRpYXRlIGEgYEZvcm1Db250cm9sYCwgd2l0aCBhbiBpbml0aWFsIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdzb21lIHZhbHVlJyk7XG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgICAgIC8vICdzb21lIHZhbHVlJ1xuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYSBmb3JtIHN0YXRlIG9iamVjdC4gVGhlIGB2YWx1ZWBcbiAqIGFuZCBgZGlzYWJsZWRgIGtleXMgYXJlIHJlcXVpcmVkIGluIHRoaXMgY2FzZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCh7IHZhbHVlOiAnbi9hJywgZGlzYWJsZWQ6IHRydWUgfSk7XG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgICAgIC8vICduL2EnXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnN0YXR1cyk7ICAgIC8vICdESVNBQkxFRCdcbiAqIGBgYFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLnJlcXVpcmVkKTtcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAgICAgIC8vICcnXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnN0YXR1cyk7ICAgICAvLyAnSU5WQUxJRCdcbiAqIGBgYFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbml0aWFsaXplcyB0aGUgY29udHJvbCB1c2luZyBhbiBvcHRpb25zIG9iamVjdC5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywge1xuICogICAgdmFsaWRhdG9yczogVmFsaWRhdG9ycy5yZXF1aXJlZCxcbiAqICAgIGFzeW5jVmFsaWRhdG9yczogbXlBc3luY1ZhbGlkYXRvclxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uZmlndXJlIHRoZSBjb250cm9sIHRvIHVwZGF0ZSBvbiBhIGJsdXIgZXZlbnRcbiAqXG4gKiBTZXQgdGhlIGB1cGRhdGVPbmAgb3B0aW9uIHRvIGAnYmx1cidgIHRvIHVwZGF0ZSBvbiB0aGUgYmx1ciBgZXZlbnRgLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCB7IHVwZGF0ZU9uOiAnYmx1cicgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uZmlndXJlIHRoZSBjb250cm9sIHRvIHVwZGF0ZSBvbiBhIHN1Ym1pdCBldmVudFxuICpcbiAqIFNldCB0aGUgYHVwZGF0ZU9uYCBvcHRpb24gdG8gYCdzdWJtaXQnYCB0byB1cGRhdGUgb24gYSBzdWJtaXQgYGV2ZW50YC5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgeyB1cGRhdGVPbjogJ3N1Ym1pdCcgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVzZXQgdGhlIGNvbnRyb2wgYmFjayB0byBhbiBpbml0aWFsIHZhbHVlXG4gKlxuICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIHRocm91Z2ggYSBzdGFuZGFsb25lXG4gKiB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHRoYXQgY29udGFpbnMgYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXRlXG4gKiAodGhlc2UgYXJlIHRoZSBvbmx5IHR3byBwcm9wZXJ0aWVzIHRoYXQgY2Fubm90IGJlIGNhbGN1bGF0ZWQpLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdOYW5jeScpO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnTmFuY3knXG4gKlxuICogY29udHJvbC5yZXNldCgnRHJldycpO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnRHJldydcbiAqIGBgYFxuICpcbiAqICMjIyBSZXNldCB0aGUgY29udHJvbCBiYWNrIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkXG4gKlxuICogYGBgXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdOYW5jeScpO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnTmFuY3knXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnN0YXR1cyk7IC8vICdWQUxJRCdcbiAqXG4gKiBjb250cm9sLnJlc2V0KHsgdmFsdWU6ICdEcmV3JywgZGlzYWJsZWQ6IHRydWUgfSk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdEcmV3J1xuICogY29uc29sZS5sb2coY29udHJvbC5zdGF0dXMpOyAvLyAnRElTQUJMRUQnXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sSW1wbCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCB2YWx1ZSBvZiB0aGlzIEZvcm1Db250cm9sLCB1c2VkIHdoZW5ldmVyIHRoZSBjb250cm9sIGlzIHJlc2V0IHdpdGhvdXQgYW4gZXhwbGljaXRcbiAgICogdmFsdWUuIFNlZSB7QGxpbmsgRm9ybUNvbnRyb2xPcHRpb25zI2luaXRpYWxWYWx1ZUlzRGVmYXVsdH0gZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gY29uZmlndXJpbmdcbiAgICogYSBkZWZhdWx0IHZhbHVlLlxuICAgKiBAcHVibGljQXBpXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29uQ2hhbmdlOiBGdW5jdGlvbltdID0gW107XG5cbiAgLyoqXG4gICAqIFRoaXMgZmllbGQgaG9sZHMgYSBwZW5kaW5nIHZhbHVlIHRoYXQgaGFzIG5vdCB5ZXQgYmVlbiBhcHBsaWVkIHRvIHRoZSBmb3JtJ3MgdmFsdWUuXG4gICAqIEl0IGlzIGBhbnlgIGJlY2F1c2UgdGhlIHZhbHVlIGlzIHVudHlwZWQuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3BlbmRpbmdWYWx1ZSE6IGFueTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nQ2hhbmdlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Db250cm9sYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYSBgRm9ybUNvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBmb3JtU3RhdGU6IGFueSA9IG51bGwsIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118Rm9ybUNvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGUpO1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtcbiAgICAgIG9ubHlTZWxmOiB0cnVlLFxuICAgICAgLy8gSWYgYGFzeW5jVmFsaWRhdG9yYCBpcyBwcmVzZW50LCBpdCB3aWxsIHRyaWdnZXIgY29udHJvbCBzdGF0dXMgY2hhbmdlIGZyb20gYFBFTkRJTkdgIHRvXG4gICAgICAvLyBgVkFMSURgIG9yIGBJTlZBTElEYC5cbiAgICAgIC8vIFRoZSBzdGF0dXMgc2hvdWxkIGJlIGJyb2FkY2FzdGVkIHZpYSB0aGUgYHN0YXR1c0NoYW5nZXNgIG9ic2VydmFibGUsIHNvIHdlIHNldCBgZW1pdEV2ZW50YFxuICAgICAgLy8gdG8gYHRydWVgIHRvIGFsbG93IHRoYXQgZHVyaW5nIHRoZSBjb250cm9sIGNyZWF0aW9uIHByb2Nlc3MuXG4gICAgICBlbWl0RXZlbnQ6ICEhdGhpcy5hc3luY1ZhbGlkYXRvclxuICAgIH0pO1xuICAgIGlmIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSAmJiB2YWxpZGF0b3JPck9wdHMuaW5pdGlhbFZhbHVlSXNEZWZhdWx0KSB7XG4gICAgICBpZiAodGhpcy5faXNCb3hlZFZhbHVlKGZvcm1TdGF0ZSkpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0VmFsdWUgPSBmb3JtU3RhdGUudmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGZvcm1TdGF0ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIG5ldyB2YWx1ZSBmb3IgdGhlIGZvcm0gY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBjb250cm9sLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiAqIGBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2VgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICAodGhlIGRlZmF1bHQpLCBlYWNoIGNoYW5nZSB0cmlnZ2VycyBhblxuICAgKiBgb25DaGFuZ2VgIGV2ZW50IHRvXG4gICAqIHVwZGF0ZSB0aGUgdmlldy5cbiAgICogKiBgZW1pdFZpZXdUb01vZGVsQ2hhbmdlYDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBlYWNoIGNoYW5nZSB0cmlnZ2VycyBhblxuICAgKiBgbmdNb2RlbENoYW5nZWBcbiAgICogZXZlbnQgdG8gdXBkYXRlIHRoZSBtb2RlbC5cbiAgICpcbiAgICovXG4gIG92ZXJyaWRlIHNldFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW4sXG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbixcbiAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxuICAgIGVtaXRWaWV3VG9Nb2RlbENoYW5nZT86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl9vbkNoYW5nZS5sZW5ndGggJiYgb3B0aW9ucy5lbWl0TW9kZWxUb1ZpZXdDaGFuZ2UgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9vbkNoYW5nZS5mb3JFYWNoKFxuICAgICAgICAgIChjaGFuZ2VGbikgPT4gY2hhbmdlRm4odGhpcy52YWx1ZSwgb3B0aW9ucy5lbWl0Vmlld1RvTW9kZWxDaGFuZ2UgIT09IGZhbHNlKSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2wuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgZnVuY3Rpb25hbGx5IHRoZSBzYW1lIGFzIHtAbGluayBGb3JtQ29udHJvbCNzZXRWYWx1ZSBzZXRWYWx1ZX0gYXQgdGhpcyBsZXZlbC5cbiAgICogSXQgZXhpc3RzIGZvciBzeW1tZXRyeSB3aXRoIHtAbGluayBGb3JtR3JvdXAjcGF0Y2hWYWx1ZSBwYXRjaFZhbHVlfSBvbiBgRm9ybUdyb3Vwc2AgYW5kXG4gICAqIGBGb3JtQXJyYXlzYCwgd2hlcmUgaXQgZG9lcyBiZWhhdmUgZGlmZmVyZW50bHkuXG4gICAqXG4gICAqIEBzZWUgYHNldFZhbHVlYCBmb3Igb3B0aW9uc1xuICAgKi9cbiAgb3ZlcnJpZGUgcGF0Y2hWYWx1ZSh2YWx1ZTogYW55LCBvcHRpb25zOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW4sXG4gICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlPzogYm9vbGVhbixcbiAgICBlbWl0Vmlld1RvTW9kZWxDaGFuZ2U/OiBib29sZWFuXG4gIH0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgZm9ybSBjb250cm9sLCBtYXJraW5nIGl0IGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgLCBhbmQgcmVzZXR0aW5nXG4gICAqIHRoZSB2YWx1ZS4gVGhlIG5ldyB2YWx1ZSB3aWxsIGJlIHRoZSBwcm92aWRlZCB2YWx1ZSAoaWYgcGFzc2VkKSwgYG51bGxgLCBvciB0aGUgaW5pdGlhbCB2YWx1ZVxuICAgKiBpZiBgaW5pdGlhbFZhbHVlSXNEZWZhdWx0YCB3YXMgc2V0IGluIHRoZSBjb25zdHJ1Y3RvciB2aWEge0BsaW5rIEZvcm1Db250cm9sT3B0aW9uc30uXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIC8vIEJ5IGRlZmF1bHQsIHRoZSBjb250cm9sIHdpbGwgcmVzZXQgdG8gbnVsbC5cbiAgICogY29uc3QgZG9nID0gbmV3IEZvcm1Db250cm9sKCdzcG90Jyk7XG4gICAqIGRvZy5yZXNldCgpOyAvLyBkb2cudmFsdWUgaXMgbnVsbFxuICAgKlxuICAgKiAvLyBJZiB0aGlzIGZsYWcgaXMgc2V0LCB0aGUgY29udHJvbCB3aWxsIGluc3RlYWQgcmVzZXQgdG8gdGhlIGluaXRpYWwgdmFsdWUuXG4gICAqIGNvbnN0IGNhdCA9IG5ldyBGb3JtQ29udHJvbCgndGFiYnknLCB7aW5pdGlhbFZhbHVlSXNEZWZhdWx0OiB0cnVlfSk7XG4gICAqIGNhdC5yZXNldCgpOyAvLyBjYXQudmFsdWUgaXMgXCJ0YWJieVwiXG4gICAqXG4gICAqIC8vIEEgdmFsdWUgcGFzc2VkIHRvIHJlc2V0IGFsd2F5cyB0YWtlcyBwcmVjZWRlbmNlLlxuICAgKiBjb25zdCBmaXNoID0gbmV3IEZvcm1Db250cm9sKCdmaW5uJywge2luaXRpYWxWYWx1ZUlzRGVmYXVsdDogdHJ1ZX0pO1xuICAgKiBmaXNoLnJlc2V0KCdidWJibGUnKTsgLy8gZmlzaC52YWx1ZSBpcyBcImJ1YmJsZVwiXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIFJlc2V0cyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKlxuICAgKi9cbiAgb3ZlcnJpZGUgcmVzZXQoZm9ybVN0YXRlOiBhbnkgPSB0aGlzLmRlZmF1bHRWYWx1ZSwgb3B0aW9uczoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuXG4gIH0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZSk7XG4gICAgdGhpcy5tYXJrQXNQcmlzdGluZShvcHRpb25zKTtcbiAgICB0aGlzLm1hcmtBc1VudG91Y2hlZChvcHRpb25zKTtcbiAgICB0aGlzLnNldFZhbHVlKHRoaXMudmFsdWUsIG9wdGlvbnMpO1xuICAgIHRoaXMuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG92ZXJyaWRlIF91cGRhdGVWYWx1ZSgpIHt9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb3ZlcnJpZGUgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG92ZXJyaWRlIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGNoYW5nZSBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXNcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UucHVzaChmbik7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJuYWwgZnVuY3Rpb24gdG8gdW5yZWdpc3RlciBhIGNoYW5nZSBldmVudHMgbGlzdGVuZXIuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3VucmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlPzogYW55LCBlbWl0TW9kZWxFdmVudD86IGJvb2xlYW4pID0+IHZvaWQpOiB2b2lkIHtcbiAgICByZW1vdmVMaXN0SXRlbSh0aGlzLl9vbkNoYW5nZSwgZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGRpc2FibGVkIGV2ZW50cy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgZGlzYWJsZWQgc3RhdHVzIGNoYW5nZXMuXG4gICAqL1xuICByZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2UoZm46IChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5wdXNoKGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyIGEgZGlzYWJsZWQgZXZlbnQgbGlzdGVuZXIuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3VucmVnaXN0ZXJPbkRpc2FibGVkQ2hhbmdlKGZuOiAoaXNEaXNhYmxlZDogYm9vbGVhbikgPT4gdm9pZCk6IHZvaWQge1xuICAgIHJlbW92ZUxpc3RJdGVtKHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UsIGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIG92ZXJyaWRlIF9mb3JFYWNoQ2hpbGQoY2I6IChjOiBBYnN0cmFjdENvbnRyb2wpID0+IHZvaWQpOiB2b2lkIHt9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy51cGRhdGVPbiA9PT0gJ3N1Ym1pdCcpIHtcbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nRGlydHkpIHRoaXMubWFya0FzRGlydHkoKTtcbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nVG91Y2hlZCkgdGhpcy5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICBpZiAodGhpcy5fcGVuZGluZ0NoYW5nZSkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuX3BlbmRpbmdWYWx1ZSwge29ubHlTZWxmOiB0cnVlLCBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGU6IGFueSkge1xuICAgIGlmICh0aGlzLl9pc0JveGVkVmFsdWUoZm9ybVN0YXRlKSkge1xuICAgICAgKHRoaXMgYXMge3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZS52YWx1ZTtcbiAgICAgIGZvcm1TdGF0ZS5kaXNhYmxlZCA/IHRoaXMuZGlzYWJsZSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMgYXMge3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBAb3ZlcnJpZGRlbkltcGxlbWVudGF0aW9uIFRoZSBjb25zdHJ1Y3RvciBmb3IgRm9ybUNvbnRyb2wgaXMgZGVjb3VwbGVkIGZyb20gaXRzIGltcGxlbWVudGF0aW9uLlxuICogVGhpcyBhbGxvd3MgdXMgdG8gcHJvdmlkZSBtdWx0aXBsZSBjb25zdHJ1Y3RvciBzaWduYXR1cmVzLlxuICovXG5leHBvcnQgY29uc3QgRm9ybUNvbnRyb2w6IEZvcm1Db250cm9sQ3RvciA9IEZvcm1Db250cm9sSW1wbCBhcyBGb3JtQ29udHJvbEN0b3I7XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdGUgb2YgYSBncm91cCBvZiBgRm9ybUNvbnRyb2xgIGluc3RhbmNlcy5cbiAqXG4gKiBBIGBGb3JtR3JvdXBgIGFnZ3JlZ2F0ZXMgdGhlIHZhbHVlcyBvZiBlYWNoIGNoaWxkIGBGb3JtQ29udHJvbGAgaW50byBvbmUgb2JqZWN0LFxuICogd2l0aCBlYWNoIGNvbnRyb2wgbmFtZSBhcyB0aGUga2V5LiAgSXQgY2FsY3VsYXRlcyBpdHMgc3RhdHVzIGJ5IHJlZHVjaW5nIHRoZSBzdGF0dXMgdmFsdWVzXG4gKiBvZiBpdHMgY2hpbGRyZW4uIEZvciBleGFtcGxlLCBpZiBvbmUgb2YgdGhlIGNvbnRyb2xzIGluIGEgZ3JvdXAgaXMgaW52YWxpZCwgdGhlIGVudGlyZVxuICogZ3JvdXAgYmVjb21lcyBpbnZhbGlkLlxuICpcbiAqIGBGb3JtR3JvdXBgIGlzIG9uZSBvZiB0aGUgdGhyZWUgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIHVzZWQgdG8gZGVmaW5lIGZvcm1zIGluIEFuZ3VsYXIsXG4gKiBhbG9uZyB3aXRoIGBGb3JtQ29udHJvbGAgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIFdoZW4gaW5zdGFudGlhdGluZyBhIGBGb3JtR3JvdXBgLCBwYXNzIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scyBhcyB0aGUgZmlyc3RcbiAqIGFyZ3VtZW50LiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIHJlZ2lzdGVycyB0aGUgbmFtZSBmb3IgdGhlIGNvbnRyb2wuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBncm91cCB3aXRoIDIgY29udHJvbHNcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogfSk7XG4gKlxuICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OyAnRHJldyd9XG4gKiBjb25zb2xlLmxvZyhmb3JtLnN0YXR1cyk7ICAvLyAnVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBncm91cCB3aXRoIGEgZ3JvdXAtbGV2ZWwgdmFsaWRhdG9yXG4gKlxuICogWW91IGluY2x1ZGUgZ3JvdXAtbGV2ZWwgdmFsaWRhdG9ycyBhcyB0aGUgc2Vjb25kIGFyZywgb3IgZ3JvdXAtbGV2ZWwgYXN5bmNcbiAqIHZhbGlkYXRvcnMgYXMgdGhlIHRoaXJkIGFyZy4gVGhlc2UgY29tZSBpbiBoYW5keSB3aGVuIHlvdSB3YW50IHRvIHBlcmZvcm0gdmFsaWRhdGlvblxuICogdGhhdCBjb25zaWRlcnMgdGhlIHZhbHVlIG9mIG1vcmUgdGhhbiBvbmUgY2hpbGQgY29udHJvbC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgcGFzc3dvcmQ6IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogICBwYXNzd29yZENvbmZpcm06IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogfSwgcGFzc3dvcmRNYXRjaFZhbGlkYXRvcik7XG4gKlxuICpcbiAqIGZ1bmN0aW9uIHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IoZzogRm9ybUdyb3VwKSB7XG4gKiAgICByZXR1cm4gZy5nZXQoJ3Bhc3N3b3JkJykudmFsdWUgPT09IGcuZ2V0KCdwYXNzd29yZENvbmZpcm0nKS52YWx1ZVxuICogICAgICAgPyBudWxsIDogeydtaXNtYXRjaCc6IHRydWV9O1xuICogfVxuICogYGBgXG4gKlxuICogTGlrZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlcywgeW91IGNob29zZSB0byBwYXNzIGluXG4gKiB2YWxpZGF0b3JzIGFuZCBhc3luYyB2YWxpZGF0b3JzIGFzIHBhcnQgb2YgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIHBhc3N3b3JkOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiAgIHBhc3N3b3JkQ29uZmlybTogbmV3IEZvcm1Db250cm9sKCcnKVxuICogfSwgeyB2YWxpZGF0b3JzOiBwYXNzd29yZE1hdGNoVmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcnM6IG90aGVyVmFsaWRhdG9yIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFNldCB0aGUgdXBkYXRlT24gcHJvcGVydHkgZm9yIGFsbCBjb250cm9scyBpbiBhIGZvcm0gZ3JvdXBcbiAqXG4gKiBUaGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZCB0byBzZXQgYSBkZWZhdWx0IHZhbHVlIGZvciBlYWNoIGNoaWxkXG4gKiBjb250cm9sJ3MgYHVwZGF0ZU9uYCBwcm9wZXJ0eS4gSWYgeW91IHNldCBgdXBkYXRlT25gIHRvIGAnYmx1cidgIGF0IHRoZVxuICogZ3JvdXAgbGV2ZWwsIGFsbCBjaGlsZCBjb250cm9scyBkZWZhdWx0IHRvICdibHVyJywgdW5sZXNzIHRoZSBjaGlsZFxuICogaGFzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIGEgZGlmZmVyZW50IGB1cGRhdGVPbmAgdmFsdWUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGMgPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgb25lOiBuZXcgRm9ybUNvbnRyb2woKVxuICogfSwgeyB1cGRhdGVPbjogJ2JsdXInIH0pO1xuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgIHRoaXMuX3NldFVwQ29udHJvbHMoKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe1xuICAgICAgb25seVNlbGY6IHRydWUsXG4gICAgICAvLyBJZiBgYXN5bmNWYWxpZGF0b3JgIGlzIHByZXNlbnQsIGl0IHdpbGwgdHJpZ2dlciBjb250cm9sIHN0YXR1cyBjaGFuZ2UgZnJvbSBgUEVORElOR2AgdG9cbiAgICAgIC8vIGBWQUxJRGAgb3IgYElOVkFMSURgLiBUaGUgc3RhdHVzIHNob3VsZCBiZSBicm9hZGNhc3RlZCB2aWEgdGhlIGBzdGF0dXNDaGFuZ2VzYCBvYnNlcnZhYmxlLFxuICAgICAgLy8gc28gd2Ugc2V0IGBlbWl0RXZlbnRgIHRvIGB0cnVlYCB0byBhbGxvdyB0aGF0IGR1cmluZyB0aGUgY29udHJvbCBjcmVhdGlvbiBwcm9jZXNzLlxuICAgICAgZW1pdEV2ZW50OiAhIXRoaXMuYXN5bmNWYWxpZGF0b3JcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjb250cm9sIHdpdGggdGhlIGdyb3VwJ3MgbGlzdCBvZiBjb250cm9scy5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgZG9lcyBub3QgdXBkYXRlIHRoZSB2YWx1ZSBvciB2YWxpZGl0eSBvZiB0aGUgY29udHJvbC5cbiAgICogVXNlIHtAbGluayBGb3JtR3JvdXAjYWRkQ29udHJvbCBhZGRDb250cm9sfSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlZ2lzdGVyIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cbiAgcmVnaXN0ZXJDb250cm9sKG5hbWU6IHN0cmluZywgY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgcmV0dXJuIHRoaXMuY29udHJvbHNbbmFtZV07XG4gICAgdGhpcy5jb250cm9sc1tuYW1lXSA9IGNvbnRyb2w7XG4gICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICByZXR1cm4gY29udHJvbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb250cm9sIHRvIHRoaXMgZ3JvdXAuXG4gICAqXG4gICAqIElmIGEgY29udHJvbCB3aXRoIGEgZ2l2ZW4gbmFtZSBhbHJlYWR5IGV4aXN0cywgaXQgd291bGQgKm5vdCogYmUgcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuXG4gICAqIElmIHlvdSB3YW50IHRvIHJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbCwgdXNlIHRoZSB7QGxpbmsgRm9ybUdyb3VwI3NldENvbnRyb2wgc2V0Q29udHJvbH1cbiAgICogbWV0aG9kIGluc3RlYWQuIFRoaXMgbWV0aG9kIGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGFkZCB0byB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAqICAgICBjb250cm9sIGlzIGFkZGVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiBhZGRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgYWRkQ29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb250cm9sIGZyb20gdGhpcyBncm91cC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFcbiAgICogICAgIGNvbnRyb2wgaXMgcmVtb3ZlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogcmVtb3ZlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbChuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbC5cbiAgICpcbiAgICogSWYgYSBjb250cm9sIHdpdGggYSBnaXZlbiBuYW1lIGRvZXMgbm90IGV4aXN0IGluIHRoaXMgYEZvcm1Hcm91cGAsIGl0IHdpbGwgYmUgYWRkZWQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVwbGFjZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFuXG4gICAqICAgICBleGlzdGluZyBjb250cm9sIGlzIHJlcGxhY2VkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgc2V0Q29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgdGhpcy5jb250cm9sc1tuYW1lXS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIGRlbGV0ZSAodGhpcy5jb250cm9sc1tuYW1lXSk7XG4gICAgaWYgKGNvbnRyb2wpIHRoaXMucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlcmUgaXMgYW4gZW5hYmxlZCBjb250cm9sIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBSZXBvcnRzIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scy4gSWYgeW91J2QgbGlrZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBncm91cFxuICAgKiBvbmx5LCB1c2Uge0BsaW5rIEFic3RyYWN0Q29udHJvbCNnZXQgZ2V0fSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbE5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scywgdHJ1ZSBvdGhlcndpc2UuXG4gICAqL1xuICBjb250YWlucyhjb250cm9sTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMuaGFzT3duUHJvcGVydHkoY29udHJvbE5hbWUpICYmIHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB0aGF0IG1hdGNoZXNcbiAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAsIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU2V0IHRoZSBjb21wbGV0ZSB2YWx1ZSBmb3IgdGhlIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogbnVsbCwgbGFzdDogbnVsbH1cbiAgICpcbiAgICogZm9ybS5zZXRWYWx1ZSh7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J30pO1xuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J31cbiAgICogYGBgXG4gICAqXG4gICAqIEB0aHJvd3MgV2hlbiBzdHJpY3QgY2hlY2tzIGZhaWwsIHN1Y2ggYXMgc2V0dGluZyB0aGUgdmFsdWUgb2YgYSBjb250cm9sXG4gICAqIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkZSBhIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXMgZXhpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0VmFsdWUoXG4gICAgICB2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50KHRoaXMsIHZhbHVlKTtcbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGFzc2VydENvbnRyb2xQcmVzZW50KHRoaXMsIG5hbWUpO1xuICAgICAgdGhpcy5jb250cm9sc1tuYW1lXS5zZXRWYWx1ZSh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYC4gSXQgYWNjZXB0cyBhbiBvYmplY3Qgd2l0aCBjb250cm9sXG4gICAqIG5hbWVzIGFzIGtleXMsIGFuZCBkb2VzIGl0cyBiZXN0IHRvIG1hdGNoIHRoZSB2YWx1ZXMgdG8gdGhlIGNvcnJlY3QgY29udHJvbHNcbiAgICogaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBJdCBhY2NlcHRzIGJvdGggc3VwZXItc2V0cyBhbmQgc3ViLXNldHMgb2YgdGhlIGdyb3VwIHdpdGhvdXQgdGhyb3dpbmcgYW4gZXJyb3IuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBQYXRjaCB0aGUgdmFsdWUgZm9yIGEgZm9ybSBncm91cFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIH0pO1xuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6IG51bGwsIGxhc3Q6IG51bGx9XG4gICAqXG4gICAqIGZvcm0ucGF0Y2hWYWx1ZSh7Zmlyc3Q6ICdOYW5jeSd9KTtcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OiBudWxsfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBvYmplY3QgdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBpcyBwYXRjaGVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogdHJ1ZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWVcbiAgICogaXMgdXBkYXRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG9cbiAgICogdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqL1xuICBvdmVycmlkZSBwYXRjaFZhbHVlKFxuICAgICAgdmFsdWU6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgLy8gRXZlbiB0aG91Z2ggdGhlIGB2YWx1ZWAgYXJndW1lbnQgdHlwZSBkb2Vzbid0IGFsbG93IGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLCB0aGVcbiAgICAvLyBgcGF0Y2hWYWx1ZWAgY2FuIGJlIGNhbGxlZCByZWN1cnNpdmVseSBhbmQgaW5uZXIgZGF0YSBzdHJ1Y3R1cmVzIG1pZ2h0IGhhdmUgdGhlc2UgdmFsdWVzLCBzb1xuICAgIC8vIHdlIGp1c3QgaWdub3JlIHN1Y2ggY2FzZXMgd2hlbiBhIGZpZWxkIGNvbnRhaW5pbmcgRm9ybUdyb3VwIGluc3RhbmNlIHJlY2VpdmVzIGBudWxsYCBvclxuICAgIC8vIGB1bmRlZmluZWRgIGFzIGEgdmFsdWUuXG4gICAgaWYgKHZhbHVlID09IG51bGwgLyogYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgICovKSByZXR1cm47XG5cbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0ucGF0Y2hWYWx1ZSh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYEZvcm1Hcm91cGAsIG1hcmtzIGFsbCBkZXNjZW5kYW50cyBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCBhbmQgc2V0c1xuICAgKiB0aGUgdmFsdWUgb2YgYWxsIGRlc2NlbmRhbnRzIHRvIG51bGwuXG4gICAqXG4gICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhIG1hcCBvZiBzdGF0ZXNcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgeW91ciBmb3JtLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy4gVGhlIHN0YXRlXG4gICAqIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkXG4gICAqIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFJlc2V0cyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIHdoZW4gdGhlIGdyb3VwIGlzIHJlc2V0LlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXNcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ2ZpcnN0IG5hbWUnKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ2ZpcnN0IG5hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICpcbiAgICogZm9ybS5yZXNldCh7IGZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXMgYW5kIGRpc2FibGVkIHN0YXR1c1xuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ2ZpcnN0IG5hbWUnKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBmb3JtLnJlc2V0KHtcbiAgICogICBmaXJzdDoge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICogICBsYXN0OiAnbGFzdCdcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2xhc3Q6ICdsYXN0J31cbiAgICogY29uc29sZS5sb2coZm9ybS5nZXQoJ2ZpcnN0Jykuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICogYGBgXG4gICAqL1xuICBvdmVycmlkZSByZXNldCh2YWx1ZTogYW55ID0ge30sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb250cm9sLnJlc2V0KHZhbHVlW25hbWVdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcbiAgICB0aGlzLl91cGRhdGVQcmlzdGluZShvcHRpb25zKTtcbiAgICB0aGlzLl91cGRhdGVUb3VjaGVkKG9wdGlvbnMpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYCwgaW5jbHVkaW5nIGFueSBkaXNhYmxlZCBjb250cm9scy5cbiAgICpcbiAgICogUmV0cmlldmVzIGFsbCB2YWx1ZXMgcmVnYXJkbGVzcyBvZiBkaXNhYmxlZCBzdGF0dXMuXG4gICAqIFRoZSBgdmFsdWVgIHByb3BlcnR5IGlzIHRoZSBiZXN0IHdheSB0byBnZXQgdGhlIHZhbHVlIG9mIHRoZSBncm91cCwgYmVjYXVzZVxuICAgKiBpdCBleGNsdWRlcyBkaXNhYmxlZCBjb250cm9scyBpbiB0aGUgYEZvcm1Hcm91cGAuXG4gICAqL1xuICBnZXRSYXdWYWx1ZSgpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbihcbiAgICAgICAge30sIChhY2M6IHtbazogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBhY2NbbmFtZV0gPSBnZXRSYXdWYWx1ZShjb250cm9sKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oZmFsc2UsICh1cGRhdGVkOiBib29sZWFuLCBjaGlsZDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICByZXR1cm4gY2hpbGQuX3N5bmNQZW5kaW5nQ29udHJvbHMoKSA/IHRydWUgOiB1cGRhdGVkO1xuICAgIH0pO1xuICAgIGlmIChzdWJ0cmVlVXBkYXRlZCkgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2ZvckVhY2hDaGlsZChjYjogKHY6IGFueSwgazogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb250cm9scykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gVGhlIGxpc3Qgb2YgY29udHJvbHMgY2FuIGNoYW5nZSAoZm9yIGV4LiBjb250cm9scyBtaWdodCBiZSByZW1vdmVkKSB3aGlsZSB0aGUgbG9vcFxuICAgICAgLy8gaXMgcnVubmluZyAoYXMgYSByZXN1bHQgb2YgaW52b2tpbmcgRm9ybXMgQVBJIGluIGB2YWx1ZUNoYW5nZXNgIHN1YnNjcmlwdGlvbiksIHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIG51bGwgY2hlY2sgYmVmb3JlIGludm9raW5nIHRoZSBjYWxsYmFjay5cbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2xzW2tleV07XG4gICAgICBjb250cm9sICYmIGNiKGNvbnRyb2wsIGtleSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcENvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcmVkdWNlVmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY29udHJvbE5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5jb250cm9scykpIHtcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2xzW2NvbnRyb2xOYW1lXTtcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGNvbnRyb2xOYW1lKSAmJiBjb25kaXRpb24oY29udHJvbCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbihcbiAgICAgICAge30sIChhY2M6IHtbazogc3RyaW5nXTogYW55fSwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpOiBhbnkgPT4ge1xuICAgICAgICAgIGlmIChjb250cm9sLmVuYWJsZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgYWNjW25hbWVdID0gY29udHJvbC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDaGlsZHJlbjxUPihpbml0VmFsdWU6IFQsIGZuOiAoYWNjOiBULCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4gVCk6IFQge1xuICAgIGxldCByZXMgPSBpbml0VmFsdWU7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgcmVzID0gZm4ocmVzLCBjb250cm9sLCBuYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNvbnRyb2xOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cbn1cblxuLyoqXG4gKiBUcmFja3MgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0ZSBvZiBhbiBhcnJheSBvZiBgRm9ybUNvbnRyb2xgLFxuICogYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAgaW5zdGFuY2VzLlxuICpcbiAqIEEgYEZvcm1BcnJheWAgYWdncmVnYXRlcyB0aGUgdmFsdWVzIG9mIGVhY2ggY2hpbGQgYEZvcm1Db250cm9sYCBpbnRvIGFuIGFycmF5LlxuICogSXQgY2FsY3VsYXRlcyBpdHMgc3RhdHVzIGJ5IHJlZHVjaW5nIHRoZSBzdGF0dXMgdmFsdWVzIG9mIGl0cyBjaGlsZHJlbi4gRm9yIGV4YW1wbGUsIGlmIG9uZSBvZlxuICogdGhlIGNvbnRyb2xzIGluIGEgYEZvcm1BcnJheWAgaXMgaW52YWxpZCwgdGhlIGVudGlyZSBhcnJheSBiZWNvbWVzIGludmFsaWQuXG4gKlxuICogYEZvcm1BcnJheWAgaXMgb25lIG9mIHRoZSB0aHJlZSBmdW5kYW1lbnRhbCBidWlsZGluZyBibG9ja3MgdXNlZCB0byBkZWZpbmUgZm9ybXMgaW4gQW5ndWxhcixcbiAqIGFsb25nIHdpdGggYEZvcm1Db250cm9sYCBhbmQgYEZvcm1Hcm91cGAuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQ3JlYXRlIGFuIGFycmF5IG9mIGZvcm0gY29udHJvbHNcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICogICBuZXcgRm9ybUNvbnRyb2woJ05hbmN5JywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogICBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnKSxcbiAqIF0pO1xuICpcbiAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsICdEcmV3J11cbiAqIGNvbnNvbGUubG9nKGFyci5zdGF0dXMpOyAgLy8gJ1ZBTElEJ1xuICogYGBgXG4gKlxuICogIyMjIENyZWF0ZSBhIGZvcm0gYXJyYXkgd2l0aCBhcnJheS1sZXZlbCB2YWxpZGF0b3JzXG4gKlxuICogWW91IGluY2x1ZGUgYXJyYXktbGV2ZWwgdmFsaWRhdG9ycyBhbmQgYXN5bmMgdmFsaWRhdG9ycy4gVGhlc2UgY29tZSBpbiBoYW5keVxuICogd2hlbiB5b3Ugd2FudCB0byBwZXJmb3JtIHZhbGlkYXRpb24gdGhhdCBjb25zaWRlcnMgdGhlIHZhbHVlIG9mIG1vcmUgdGhhbiBvbmUgY2hpbGRcbiAqIGNvbnRyb2wuXG4gKlxuICogVGhlIHR3byB0eXBlcyBvZiB2YWxpZGF0b3JzIGFyZSBwYXNzZWQgaW4gc2VwYXJhdGVseSBhcyB0aGUgc2Vjb25kIGFuZCB0aGlyZCBhcmdcbiAqIHJlc3BlY3RpdmVseSwgb3IgdG9nZXRoZXIgYXMgcGFydCBvZiBhbiBvcHRpb25zIG9iamVjdC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICogICBuZXcgRm9ybUNvbnRyb2woJ05hbmN5JyksXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnRHJldycpXG4gKiBdLCB7dmFsaWRhdG9yczogbXlWYWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yczogbXlBc3luY1ZhbGlkYXRvcn0pO1xuICogYGBgXG4gKlxuICogIyMjIFNldCB0aGUgdXBkYXRlT24gcHJvcGVydHkgZm9yIGFsbCBjb250cm9scyBpbiBhIGZvcm0gYXJyYXlcbiAqXG4gKiBUaGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZCB0byBzZXQgYSBkZWZhdWx0IHZhbHVlIGZvciBlYWNoIGNoaWxkXG4gKiBjb250cm9sJ3MgYHVwZGF0ZU9uYCBwcm9wZXJ0eS4gSWYgeW91IHNldCBgdXBkYXRlT25gIHRvIGAnYmx1cidgIGF0IHRoZVxuICogYXJyYXkgbGV2ZWwsIGFsbCBjaGlsZCBjb250cm9scyBkZWZhdWx0IHRvICdibHVyJywgdW5sZXNzIHRoZSBjaGlsZFxuICogaGFzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIGEgZGlmZmVyZW50IGB1cGRhdGVPbmAgdmFsdWUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICogICAgbmV3IEZvcm1Db250cm9sKClcbiAqIF0sIHt1cGRhdGVPbjogJ2JsdXInfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQWRkaW5nIG9yIHJlbW92aW5nIGNvbnRyb2xzIGZyb20gYSBmb3JtIGFycmF5XG4gKlxuICogVG8gY2hhbmdlIHRoZSBjb250cm9scyBpbiB0aGUgYXJyYXksIHVzZSB0aGUgYHB1c2hgLCBgaW5zZXJ0YCwgYHJlbW92ZUF0YCBvciBgY2xlYXJgIG1ldGhvZHNcbiAqIGluIGBGb3JtQXJyYXlgIGl0c2VsZi4gVGhlc2UgbWV0aG9kcyBlbnN1cmUgdGhlIGNvbnRyb2xzIGFyZSBwcm9wZXJseSB0cmFja2VkIGluIHRoZVxuICogZm9ybSdzIGhpZXJhcmNoeS4gRG8gbm90IG1vZGlmeSB0aGUgYXJyYXkgb2YgYEFic3RyYWN0Q29udHJvbGBzIHVzZWQgdG8gaW5zdGFudGlhdGVcbiAqIHRoZSBgRm9ybUFycmF5YCBkaXJlY3RseSwgYXMgdGhhdCByZXN1bHQgaW4gc3RyYW5nZSBhbmQgdW5leHBlY3RlZCBiZWhhdmlvciBzdWNoXG4gKiBhcyBicm9rZW4gY2hhbmdlIGRldGVjdGlvbi5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBGb3JtQXJyYXkgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgRm9ybUFycmF5YCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEFuIGFycmF5IG9mIGNoaWxkIGNvbnRyb2xzLiBFYWNoIGNoaWxkIGNvbnRyb2wgaXMgZ2l2ZW4gYW4gaW5kZXhcbiAgICogd2hlcmUgaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgY29udHJvbHM6IEFic3RyYWN0Q29udHJvbFtdLFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICBzdXBlcihwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHMpLCBwaWNrQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgIHRoaXMuX3NldFVwQ29udHJvbHMoKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe1xuICAgICAgb25seVNlbGY6IHRydWUsXG4gICAgICAvLyBJZiBgYXN5bmNWYWxpZGF0b3JgIGlzIHByZXNlbnQsIGl0IHdpbGwgdHJpZ2dlciBjb250cm9sIHN0YXR1cyBjaGFuZ2UgZnJvbSBgUEVORElOR2AgdG9cbiAgICAgIC8vIGBWQUxJRGAgb3IgYElOVkFMSURgLlxuICAgICAgLy8gVGhlIHN0YXR1cyBzaG91bGQgYmUgYnJvYWRjYXN0ZWQgdmlhIHRoZSBgc3RhdHVzQ2hhbmdlc2Agb2JzZXJ2YWJsZSwgc28gd2Ugc2V0IGBlbWl0RXZlbnRgXG4gICAgICAvLyB0byBgdHJ1ZWAgdG8gYWxsb3cgdGhhdCBkdXJpbmcgdGhlIGNvbnRyb2wgY3JlYXRpb24gcHJvY2Vzcy5cbiAgICAgIGVtaXRFdmVudDogISF0aGlzLmFzeW5jVmFsaWRhdG9yXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBgQWJzdHJhY3RDb250cm9sYCBhdCB0aGUgZ2l2ZW4gYGluZGV4YCBpbiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gcmV0cmlldmUgdGhlIGNvbnRyb2xcbiAgICovXG4gIGF0KGluZGV4OiBudW1iZXIpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzW2luZGV4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYSBuZXdcbiAgICogICAgIGNvbnRyb2wgaXMgYWRkZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAqIGluc2VydGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBwdXNoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2xzLnB1c2goY29udHJvbCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIG5ldyBgQWJzdHJhY3RDb250cm9sYCBhdCB0aGUgZ2l2ZW4gYGluZGV4YCBpbiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gaW5zZXJ0IHRoZSBjb250cm9sXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYSBuZXdcbiAgICogICAgIGNvbnRyb2wgaXMgaW5zZXJ0ZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAqIGluc2VydGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBpbnNlcnQoaW5kZXg6IG51bWJlciwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlbW92ZSB0aGUgY29udHJvbFxuICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYVxuICAgKiAgICAgY29udHJvbCBpcyByZW1vdmVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiByZW1vdmVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICByZW1vdmVBdChpbmRleDogbnVtYmVyLCBvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW2luZGV4XSkgdGhpcy5jb250cm9sc1tpbmRleF0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlcGxhY2UgdGhlIGNvbnRyb2xcbiAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGBBYnN0cmFjdENvbnRyb2xgIGNvbnRyb2wgdG8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgY29udHJvbFxuICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYW5cbiAgICogICAgIGV4aXN0aW5nIGNvbnRyb2wgaXMgcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAqIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBzZXRDb250cm9sKGluZGV4OiBudW1iZXIsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tpbmRleF0pIHRoaXMuY29udHJvbHNbaW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgdGhpcy5jb250cm9scy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZW5ndGggb2YgdGhlIGNvbnRyb2wgYXJyYXkuXG4gICAqL1xuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUFycmF5YC4gSXQgYWNjZXB0cyBhbiBhcnJheSB0aGF0IG1hdGNoZXNcbiAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgcGVyZm9ybXMgc3RyaWN0IGNoZWNrcywgYW5kIHRocm93cyBhbiBlcnJvciBpZiB5b3UgdHJ5XG4gICAqIHRvIHNldCB0aGUgdmFsdWUgb2YgYSBjb250cm9sIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkZSB0aGVcbiAgICogdmFsdWUgb2YgYSBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBjb250cm9scyBpbiB0aGUgZm9ybSBhcnJheVxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAqICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gW251bGwsIG51bGxdXG4gICAqXG4gICAqIGFyci5zZXRWYWx1ZShbJ05hbmN5JywgJ0RyZXcnXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsICdEcmV3J11cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBjb250cm9sc1xuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXNcbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdFxuICAgKiBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqL1xuICBvdmVycmlkZSBzZXRWYWx1ZSh2YWx1ZTogYW55W10sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50KHRoaXMsIHZhbHVlKTtcbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBhc3NlcnRDb250cm9sUHJlc2VudCh0aGlzLCBpbmRleCk7XG4gICAgICB0aGlzLmF0KGluZGV4KS5zZXRWYWx1ZShuZXdWYWx1ZSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUFycmF5YC4gSXQgYWNjZXB0cyBhbiBhcnJheSB0aGF0IG1hdGNoZXMgdGhlXG4gICAqIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbCwgYW5kIGRvZXMgaXRzIGJlc3QgdG8gbWF0Y2ggdGhlIHZhbHVlcyB0byB0aGUgY29ycmVjdFxuICAgKiBjb250cm9scyBpbiB0aGUgZ3JvdXAuXG4gICAqXG4gICAqIEl0IGFjY2VwdHMgYm90aCBzdXBlci1zZXRzIGFuZCBzdWItc2V0cyBvZiB0aGUgYXJyYXkgd2l0aG91dCB0aHJvd2luZyBhbiBlcnJvci5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFBhdGNoIHRoZSB2YWx1ZXMgZm9yIGNvbnRyb2xzIGluIGEgZm9ybSBhcnJheVxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiBdKTtcbiAgICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbbnVsbCwgbnVsbF1cbiAgICpcbiAgICogYXJyLnBhdGNoVmFsdWUoWydOYW5jeSddKTtcbiAgICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbJ05hbmN5JywgbnVsbF1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiBsYXRlc3QgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlXG4gICAqIGlzIHVwZGF0ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC4gVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvXG4gICAqIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHkgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgb3ZlcnJpZGUgcGF0Y2hWYWx1ZSh2YWx1ZTogYW55W10sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAvLyBFdmVuIHRob3VnaCB0aGUgYHZhbHVlYCBhcmd1bWVudCB0eXBlIGRvZXNuJ3QgYWxsb3cgYG51bGxgIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMsIHRoZVxuICAgIC8vIGBwYXRjaFZhbHVlYCBjYW4gYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5IGFuZCBpbm5lciBkYXRhIHN0cnVjdHVyZXMgbWlnaHQgaGF2ZSB0aGVzZSB2YWx1ZXMsIHNvXG4gICAgLy8gd2UganVzdCBpZ25vcmUgc3VjaCBjYXNlcyB3aGVuIGEgZmllbGQgY29udGFpbmluZyBGb3JtQXJyYXkgaW5zdGFuY2UgcmVjZWl2ZXMgYG51bGxgIG9yXG4gICAgLy8gYHVuZGVmaW5lZGAgYXMgYSB2YWx1ZS5cbiAgICBpZiAodmFsdWUgPT0gbnVsbCAvKiBib3RoIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgKi8pIHJldHVybjtcblxuICAgIHZhbHVlLmZvckVhY2goKG5ld1ZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmICh0aGlzLmF0KGluZGV4KSkge1xuICAgICAgICB0aGlzLmF0KGluZGV4KS5wYXRjaFZhbHVlKG5ld1ZhbHVlLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBgRm9ybUFycmF5YCBhbmQgYWxsIGRlc2NlbmRhbnRzIGFyZSBtYXJrZWQgYHByaXN0aW5lYCBhbmQgYHVudG91Y2hlZGAsIGFuZCB0aGVcbiAgICogdmFsdWUgb2YgYWxsIGRlc2NlbmRhbnRzIHRvIG51bGwgb3IgbnVsbCBtYXBzLlxuICAgKlxuICAgKiBZb3UgcmVzZXQgdG8gYSBzcGVjaWZpYyBmb3JtIHN0YXRlIGJ5IHBhc3NpbmcgaW4gYW4gYXJyYXkgb2Ygc3RhdGVzXG4gICAqIHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBjb250cm9sLiBUaGUgc3RhdGUgaXMgYSBzdGFuZGFsb25lIHZhbHVlXG4gICAqIG9yIGEgZm9ybSBzdGF0ZSBvYmplY3Qgd2l0aCBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUmVzZXQgdGhlIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiBdKTtcbiAgICogYXJyLnJlc2V0KFsnbmFtZScsICdsYXN0IG5hbWUnXSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAvLyBbJ25hbWUnLCAnbGFzdCBuYW1lJ11cbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgdmFsdWVzIGluIGEgZm9ybSBhcnJheSBhbmQgdGhlIGRpc2FibGVkIHN0YXR1cyBmb3IgdGhlIGZpcnN0IGNvbnRyb2xcbiAgICpcbiAgICogYGBgXG4gICAqIGFyci5yZXNldChbXG4gICAqICAge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICogICAnbGFzdCdcbiAgICogXSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAvLyBbJ2xhc3QnXVxuICAgKiBjb25zb2xlLmxvZyhhcnIuYXQoMCkuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBjb250cm9sc1xuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXNcbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdFxuICAgKiBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgb3ZlcnJpZGUgcmVzZXQodmFsdWU6IGFueSA9IFtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnRyb2wucmVzZXQodmFsdWVbaW5kZXhdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcbiAgICB0aGlzLl91cGRhdGVQcmlzdGluZShvcHRpb25zKTtcbiAgICB0aGlzLl91cGRhdGVUb3VjaGVkKG9wdGlvbnMpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBhcnJheSwgaW5jbHVkaW5nIGFueSBkaXNhYmxlZCBjb250cm9scy5cbiAgICpcbiAgICogUmVwb3J0cyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKiBGb3IgZW5hYmxlZCBjb250cm9scyBvbmx5LCB0aGUgYHZhbHVlYCBwcm9wZXJ0eSBpcyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgYXJyYXkuXG4gICAqL1xuICBnZXRSYXdWYWx1ZSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMubWFwKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGdldFJhd1ZhbHVlKGNvbnRyb2wpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGNvbnRyb2xzIGluIHRoZSBgRm9ybUFycmF5YC5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFsbFxuICAgKiAgICAgY29udHJvbHMgYXJlIHJlbW92ZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIGFsbCBjb250cm9sc1xuICAgKiBpbiB0aGlzIEZvcm1BcnJheSBpbnN0YW5jZSBhcmUgcmVtb3ZlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUmVtb3ZlIGFsbCBlbGVtZW50cyBmcm9tIGEgRm9ybUFycmF5XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci5sZW5ndGgpOyAgLy8gMlxuICAgKlxuICAgKiBhcnIuY2xlYXIoKTtcbiAgICogY29uc29sZS5sb2coYXJyLmxlbmd0aCk7ICAvLyAwXG4gICAqIGBgYFxuICAgKlxuICAgKiBJdCdzIGEgc2ltcGxlciBhbmQgbW9yZSBlZmZpY2llbnQgYWx0ZXJuYXRpdmUgdG8gcmVtb3ZpbmcgYWxsIGVsZW1lbnRzIG9uZSBieSBvbmU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqXG4gICAqIHdoaWxlIChhcnIubGVuZ3RoKSB7XG4gICAqICAgIGFyci5yZW1vdmVBdCgwKTtcbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIGNsZWFyKG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHMubGVuZ3RoIDwgMSkgcmV0dXJuO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSkpO1xuICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKDApO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuIHtcbiAgICBsZXQgc3VidHJlZVVwZGF0ZWQgPSB0aGlzLmNvbnRyb2xzLnJlZHVjZSgodXBkYXRlZDogYm9vbGVhbiwgY2hpbGQ6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCkgPyB0cnVlIDogdXBkYXRlZDtcbiAgICB9LCBmYWxzZSk7XG4gICAgaWYgKHN1YnRyZWVVcGRhdGVkKSB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlfSk7XG4gICAgcmV0dXJuIHN1YnRyZWVVcGRhdGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfZm9yRWFjaENoaWxkKGNiOiAoYzogQWJzdHJhY3RDb250cm9sLCBpbmRleDogbnVtYmVyKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5jb250cm9scy5mb3JFYWNoKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNiKGNvbnRyb2wsIGluZGV4KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3VwZGF0ZVZhbHVlKCk6IHZvaWQge1xuICAgICh0aGlzIGFzIHt2YWx1ZTogYW55fSkudmFsdWUgPVxuICAgICAgICB0aGlzLmNvbnRyb2xzLmZpbHRlcigoY29udHJvbCkgPT4gY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpXG4gICAgICAgICAgICAubWFwKChjb250cm9sKSA9PiBjb250cm9sLnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLnNvbWUoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5lbmFibGVkICYmIGNvbmRpdGlvbihjb250cm9sKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcENvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCkpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xuICAgICAgaWYgKGNvbnRyb2wuZW5hYmxlZCkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3RlckNvbnRyb2woY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgfVxufVxuIl19