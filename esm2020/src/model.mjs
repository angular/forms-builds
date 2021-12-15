/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
import { removeListItem } from './directives/shared';
import { addValidators, composeAsyncValidators, composeValidators, hasValidator, removeValidators, toObservable } from './validators';
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
        if (controlToFind instanceof FormGroup) {
            controlToFind = controlToFind.controls.hasOwnProperty(name) ?
                controlToFind.controls[name] :
                null;
        }
        else if (controlToFind instanceof FormArray) {
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
 *
 * @publicApi
 */
export class FormControl extends AbstractControl {
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
        this._checkAllValuesPresent(value);
        Object.keys(value).forEach(name => {
            this._throwIfControlMissing(name);
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
            acc[name] = control instanceof FormControl ? control.value : control.getRawValue();
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
    _throwIfControlMissing(name) {
        if (!Object.keys(this.controls).length) {
            throw new Error(`
        There are no form controls registered with this group yet. If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.controls[name]) {
            throw new Error(`Cannot find form control with name: ${name}.`);
        }
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
    /** @internal */
    _checkAllValuesPresent(value) {
        this._forEachChild((control, name) => {
            if (value[name] === undefined) {
                throw new Error(`Must supply a value for form control with name: '${name}'.`);
            }
        });
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
        this._checkAllValuesPresent(value);
        value.forEach((newValue, index) => {
            this._throwIfControlMissing(index);
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
        return this.controls.map((control) => {
            return control instanceof FormControl ? control.value : control.getRawValue();
        });
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
    _throwIfControlMissing(index) {
        if (!this.controls.length) {
            throw new Error(`
        There are no form controls registered with this array yet. If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.at(index)) {
            throw new Error(`Cannot find form control at index ${index}`);
        }
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
    _checkAllValuesPresent(value) {
        this._forEachChild((control, i) => {
            if (value[i] === undefined) {
                throw new Error(`Must supply a value for form control at index: ${i}.`);
            }
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUczQyxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGFBQWEsRUFBRSxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFZLEVBQXVCLGdCQUFnQixFQUFFLFlBQVksRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUV6Sjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUU3Qjs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUVqQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLFFBQVEsR0FBRyxVQUFVLENBQUM7QUFtQm5DLFNBQVMsS0FBSyxDQUFDLE9BQXdCLEVBQUUsSUFBaUMsRUFBRSxTQUFpQjtJQUMzRixJQUFJLElBQUksSUFBSSxJQUFJO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDeEIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDOUI7SUFDRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFMUQscURBQXFEO0lBQ3JELGdFQUFnRTtJQUNoRSxJQUFJLGFBQWEsR0FBeUIsT0FBTyxDQUFDO0lB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QUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6RTtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNQLG9CQUFvQjtRQUMzQixLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxPQUFPLENBQUMsT0FBTztnQkFBRSxPQUFPLEtBQUssQ0FBQztTQUNuQztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkQsQ0FBQztJQUVPLGdCQUFnQixDQUFDLE9BQXdCO1FBQy9DLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEIsT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge3JlbW92ZUxpc3RJdGVtfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm59IGZyb20gJy4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7YWRkVmFsaWRhdG9ycywgY29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIGhhc1ZhbGlkYXRvciwgbWFrZVZhbGlkYXRvcnNBcnJheSwgcmVtb3ZlVmFsaWRhdG9ycywgdG9PYnNlcnZhYmxlfSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJRCA9ICdWQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgSU5WQUxJRCA9ICdJTlZBTElEJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBwZW5kaW5nLCBtZWFuaW5nIHRoYXQgdGhhdCBhc3luYyB2YWxpZGF0aW9uIGlzIG9jY3VycmluZyBhbmRcbiAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBtYXJrQXNQZW5kaW5nYFxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgUEVORElORyA9ICdQRU5ESU5HJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yXG4gKiBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzRGlzYWJsZWRgXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBESVNBQkxFRCA9ICdESVNBQkxFRCc7XG5cbi8qKlxuICogQSBmb3JtIGNhbiBoYXZlIHNldmVyYWwgZGlmZmVyZW50IHN0YXR1c2VzLiBFYWNoXG4gKiBwb3NzaWJsZSBzdGF0dXMgaXMgcmV0dXJuZWQgYXMgYSBzdHJpbmcgbGl0ZXJhbC5cbiAqXG4gKiAqICoqVkFMSUQqKjogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgdmFsaWQsIG1lYW5pbmcgdGhhdCBubyBlcnJvcnMgZXhpc3QgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipJTlZBTElEKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0XG4gKiB2YWx1ZS5cbiAqICogKipQRU5ESU5HKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIHBlbmRpbmcsIG1lYW5pbmcgdGhhdCB0aGF0IGFzeW5jIHZhbGlkYXRpb24gaXNcbiAqIG9jY3VycmluZyBhbmQgZXJyb3JzIGFyZSBub3QgeWV0IGF2YWlsYWJsZSBmb3IgdGhlIGlucHV0IHZhbHVlLlxuICogKiAqKkRJU0FCTEVEKio6IFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzXG4gKiBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yIGNhbGN1bGF0aW9ucyBvZiB2YWxpZGl0eSBvciB2YWx1ZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIEZvcm1Db250cm9sU3RhdHVzID0gJ1ZBTElEJ3wnSU5WQUxJRCd8J1BFTkRJTkcnfCdESVNBQkxFRCc7XG5cbmZ1bmN0aW9uIF9maW5kKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgcGF0aDogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nLCBkZWxpbWl0ZXI6IHN0cmluZykge1xuICBpZiAocGF0aCA9PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkocGF0aCkpIHtcbiAgICBwYXRoID0gcGF0aC5zcGxpdChkZWxpbWl0ZXIpO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KHBhdGgpICYmIHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcblxuICAvLyBOb3QgdXNpbmcgQXJyYXkucmVkdWNlIGhlcmUgZHVlIHRvIGEgQ2hyb21lIDgwIGJ1Z1xuICAvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMDQ5OTgyXG4gIGxldCBjb250cm9sVG9GaW5kOiBBYnN0cmFjdENvbnRyb2x8bnVsbCA9IGNvbnRyb2w7XG4gIHBhdGguZm9yRWFjaCgobmFtZTogc3RyaW5nfG51bWJlcikgPT4ge1xuICAgIGlmIChjb250cm9sVG9GaW5kIGluc3RhbmNlb2YgRm9ybUdyb3VwKSB7XG4gICAgICBjb250cm9sVG9GaW5kID0gY29udHJvbFRvRmluZC5jb250cm9scy5oYXNPd25Qcm9wZXJ0eShuYW1lIGFzIHN0cmluZykgP1xuICAgICAgICAgIGNvbnRyb2xUb0ZpbmQuY29udHJvbHNbbmFtZV0gOlxuICAgICAgICAgIG51bGw7XG4gICAgfSBlbHNlIGlmIChjb250cm9sVG9GaW5kIGluc3RhbmNlb2YgRm9ybUFycmF5KSB7XG4gICAgICBjb250cm9sVG9GaW5kID0gY29udHJvbFRvRmluZC5hdCg8bnVtYmVyPm5hbWUpIHx8IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRyb2xUb0ZpbmQgPSBudWxsO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjb250cm9sVG9GaW5kO1xufVxuXG4vKipcbiAqIEdldHMgdmFsaWRhdG9ycyBmcm9tIGVpdGhlciBhbiBvcHRpb25zIG9iamVjdCBvciBnaXZlbiB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBwaWNrVmFsaWRhdG9ycyh2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8XG4gICAgICAgICAgICAgICAgICAgICAgICBudWxsKTogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsIHtcbiAgcmV0dXJuIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/IHZhbGlkYXRvck9yT3B0cy52YWxpZGF0b3JzIDogdmFsaWRhdG9yT3JPcHRzKSB8fCBudWxsO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgdmFsaWRhdG9yIGZ1bmN0aW9uIGJ5IGNvbWJpbmluZyBwcm92aWRlZCB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBjb2VyY2VUb1ZhbGlkYXRvcih2YWxpZGF0b3I6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCk6IFZhbGlkYXRvckZufG51bGwge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3IpID8gY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9yKSA6IHZhbGlkYXRvciB8fCBudWxsO1xufVxuXG4vKipcbiAqIEdldHMgYXN5bmMgdmFsaWRhdG9ycyBmcm9tIGVpdGhlciBhbiBvcHRpb25zIG9iamVjdCBvciBnaXZlbiB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBwaWNrQXN5bmNWYWxpZGF0b3JzKFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCxcbiAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCk6IEFzeW5jVmFsaWRhdG9yRm58XG4gICAgQXN5bmNWYWxpZGF0b3JGbltdfG51bGwge1xuICByZXR1cm4gKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gdmFsaWRhdG9yT3JPcHRzLmFzeW5jVmFsaWRhdG9ycyA6IGFzeW5jVmFsaWRhdG9yKSB8fCBudWxsO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uIGJ5IGNvbWJpbmluZyBwcm92aWRlZCBhc3luYyB2YWxpZGF0b3JzLlxuICovXG5mdW5jdGlvbiBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bGwpOiBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhc3luY1ZhbGlkYXRvcikgPyBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9yKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jVmFsaWRhdG9yIHx8IG51bGw7XG59XG5cbmV4cG9ydCB0eXBlIEZvcm1Ib29rcyA9ICdjaGFuZ2UnfCdibHVyJ3wnc3VibWl0JztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIG9wdGlvbnMgcHJvdmlkZWQgdG8gYW4gYEFic3RyYWN0Q29udHJvbGAuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFic3RyYWN0Q29udHJvbE9wdGlvbnMge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBsaXN0IG9mIHZhbGlkYXRvcnMgYXBwbGllZCB0byBhIGNvbnRyb2wuXG4gICAqL1xuICB2YWxpZGF0b3JzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBsaXN0IG9mIGFzeW5jIHZhbGlkYXRvcnMgYXBwbGllZCB0byBjb250cm9sLlxuICAgKi9cbiAgYXN5bmNWYWxpZGF0b3JzPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbDtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgZXZlbnQgbmFtZSBmb3IgY29udHJvbCB0byB1cGRhdGUgdXBvbi5cbiAgICovXG4gIHVwZGF0ZU9uPzogJ2NoYW5nZSd8J2JsdXInfCdzdWJtaXQnO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igb3B0aW9ucyBwcm92aWRlZCB0byBhIHtAbGluayBGb3JtQ29udHJvbH0uXG4gKlxuICogVGhpcyBpbnRlcmZhY2UgZXh0ZW5kcyBhbGwgb3B0aW9ucyBmcm9tIHtAbGluayBBYnN0cmFjdENvbnRyb2xPcHRpb25zfSwgcGx1cyBzb21lIG9wdGlvbnNcbiAqIHVuaXF1ZSB0byBgRm9ybUNvbnRyb2xgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGb3JtQ29udHJvbE9wdGlvbnMgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBXaGV0aGVyIHRvIHVzZSB0aGUgaW5pdGlhbCB2YWx1ZSB1c2VkIHRvIGNvbnN0cnVjdCB0aGUgRm9ybUNvbnRyb2wgYXMgaXRzIGRlZmF1bHQgdmFsdWUgYXNcbiAgICogd2VsbC4gSWYgdGhpcyBvcHRpb24gaXMgZmFsc2Ugb3Igbm90IHByb3ZpZGVkLCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhIEZvcm1Db250cm9sIGlzIGBudWxsYC5cbiAgICogV2hlbiBhIEZvcm1Db250cm9sIGlzIHtAbGluayBGb3JtQ29udHJvbCNyZXNldH0gd2l0aG91dCBhbiBleHBsaWNpdCB2YWx1ZSwgaXRzIHZhbHVlIHJldmVydHMgdG9cbiAgICogaXRzIGRlZmF1bHQgdmFsdWUuXG4gICAqL1xuICBpbml0aWFsVmFsdWVJc0RlZmF1bHQ/OiBib29sZWFuO1xufVxuXG5mdW5jdGlvbiBpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfFxuICAgICAgICAgICAgICAgICAgICAgIG51bGwpOiB2YWxpZGF0b3JPck9wdHMgaXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIHJldHVybiB2YWxpZGF0b3JPck9wdHMgIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JPck9wdHMpICYmXG4gICAgICB0eXBlb2YgdmFsaWRhdG9yT3JPcHRzID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIEl0IHByb3ZpZGVzIHNvbWUgb2YgdGhlIHNoYXJlZCBiZWhhdmlvciB0aGF0IGFsbCBjb250cm9scyBhbmQgZ3JvdXBzIG9mIGNvbnRyb2xzIGhhdmUsIGxpa2VcbiAqIHJ1bm5pbmcgdmFsaWRhdG9ycywgY2FsY3VsYXRpbmcgc3RhdHVzLCBhbmQgcmVzZXR0aW5nIHN0YXRlLiBJdCBhbHNvIGRlZmluZXMgdGhlIHByb3BlcnRpZXNcbiAqIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBzdWItY2xhc3NlcywgbGlrZSBgdmFsdWVgLCBgdmFsaWRgLCBhbmQgYGRpcnR5YC4gSXQgc2hvdWxkbid0IGJlXG4gKiBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogQHNlZSBbRm9ybXMgR3VpZGVdKC9ndWlkZS9mb3JtcylcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXSgvZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIFtEeW5hbWljIEZvcm1zIEd1aWRlXSgvZ3VpZGUvZHluYW1pYy1mb3JtKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBhIGNvbnRyb2wgaGFzIGl0cyBvd24gcGVuZGluZyBhc3luY2hyb25vdXMgdmFsaWRhdGlvbiBpbiBwcm9ncmVzcy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfaGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcGVuZGluZ1RvdWNoZWQgPSBmYWxzZTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVPbj86IEZvcm1Ib29rcztcblxuICBwcml2YXRlIF9wYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXl8bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbjogYW55O1xuXG4gIC8qKlxuICAgKiBDb250YWlucyB0aGUgcmVzdWx0IG9mIG1lcmdpbmcgc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvblxuICAgKiAoY29tYmluZWQgdXNpbmcgYFZhbGlkYXRvcnMuY29tcG9zZWApLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHByaXZhdGUgX2NvbXBvc2VkVmFsaWRhdG9yRm46IFZhbGlkYXRvckZufG51bGw7XG5cbiAgLyoqXG4gICAqIENvbnRhaW5zIHRoZSByZXN1bHQgb2YgbWVyZ2luZyBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyBpbnRvIGEgc2luZ2xlIHZhbGlkYXRvciBmdW5jdGlvblxuICAgKiAoY29tYmluZWQgdXNpbmcgYFZhbGlkYXRvcnMuY29tcG9zZUFzeW5jYCkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuOiBBc3luY1ZhbGlkYXRvckZufG51bGw7XG5cbiAgLyoqXG4gICAqIFN5bmNocm9ub3VzIHZhbGlkYXRvcnMgYXMgdGhleSB3ZXJlIHByb3ZpZGVkOlxuICAgKiAgLSBpbiBgQWJzdHJhY3RDb250cm9sYCBjb25zdHJ1Y3RvclxuICAgKiAgLSBhcyBhbiBhcmd1bWVudCB3aGlsZSBjYWxsaW5nIGBzZXRWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGB2YWxpZGF0b3JgIGZpZWxkIChlLmcuIGBjb250cm9sLnZhbGlkYXRvciA9IHZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdWYWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGw7XG5cbiAgLyoqXG4gICAqIEFzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGFzIHRoZXkgd2VyZSBwcm92aWRlZDpcbiAgICogIC0gaW4gYEFic3RyYWN0Q29udHJvbGAgY29uc3RydWN0b3JcbiAgICogIC0gYXMgYW4gYXJndW1lbnQgd2hpbGUgY2FsbGluZyBgc2V0QXN5bmNWYWxpZGF0b3JzYCBmdW5jdGlvblxuICAgKiAgLSB3aGlsZSBjYWxsaW5nIHRoZSBzZXR0ZXIgb24gdGhlIGBhc3luY1ZhbGlkYXRvcmAgZmllbGQgKGUuZy4gYGNvbnRyb2wuYXN5bmNWYWxpZGF0b3IgPVxuICAgKiBhc3luY1ZhbGlkYXRvckZuYClcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwcml2YXRlIF9yYXdBc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGw7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiAqIEZvciBhIGBGb3JtQ29udHJvbGAsIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiAqIEZvciBhbiBlbmFibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gb2JqZWN0XG4gICAqIHdpdGggYSBrZXktdmFsdWUgcGFpciBmb3IgZWFjaCBtZW1iZXIgb2YgdGhlIGdyb3VwLlxuICAgKiAqIEZvciBhIGRpc2FibGVkIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGFsbCBjb250cm9scyBhcyBhbiBvYmplY3RcbiAgICogd2l0aCBhIGtleS12YWx1ZSBwYWlyIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgZ3JvdXAuXG4gICAqICogRm9yIGEgYEZvcm1BcnJheWAsIHRoZSB2YWx1ZXMgb2YgZW5hYmxlZCBjb250cm9scyBhcyBhbiBhcnJheS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBYnN0cmFjdENvbnRyb2wgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgdmFsaWRpdHkgb2ZcbiAgICogICAgIHRoaXMgY29udHJvbCBzeW5jaHJvbm91c2x5LlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3JzIFRoZSBmdW5jdGlvbiBvciBhcnJheSBvZiBmdW5jdGlvbnMgdGhhdCBpcyB1c2VkIHRvIGRldGVybWluZSB2YWxpZGl0eSBvZlxuICAgKiAgICAgdGhpcyBjb250cm9sIGFzeW5jaHJvbm91c2x5LlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB2YWxpZGF0b3JzOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdmFsaWRhdG9ycztcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcnM7XG4gICAgdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IGNvZXJjZVRvVmFsaWRhdG9yKHRoaXMuX3Jhd1ZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IodGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmdW5jdGlvbiB0aGF0IGlzIHVzZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWxpZGl0eSBvZiB0aGlzIGNvbnRyb2wgc3luY2hyb25vdXNseS5cbiAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBnZXQgdmFsaWRhdG9yKCk6IFZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb21wb3NlZFZhbGlkYXRvckZuO1xuICB9XG4gIHNldCB2YWxpZGF0b3IodmFsaWRhdG9yRm46IFZhbGlkYXRvckZufG51bGwpIHtcbiAgICB0aGlzLl9yYXdWYWxpZGF0b3JzID0gdGhpcy5fY29tcG9zZWRWYWxpZGF0b3JGbiA9IHZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBkZXRlcm1pbmUgdGhlIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbCBhc3luY2hyb25vdXNseS5cbiAgICogSWYgbXVsdGlwbGUgdmFsaWRhdG9ycyBoYXZlIGJlZW4gYWRkZWQsIHRoaXMgd2lsbCBiZSBhIHNpbmdsZSBjb21wb3NlZCBmdW5jdGlvbi5cbiAgICogU2VlIGBWYWxpZGF0b3JzLmNvbXBvc2UoKWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9zZWRBc3luY1ZhbGlkYXRvckZuO1xuICB9XG4gIHNldCBhc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvckZuOiBBc3luY1ZhbGlkYXRvckZufG51bGwpIHtcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSB0aGlzLl9jb21wb3NlZEFzeW5jVmFsaWRhdG9yRm4gPSBhc3luY1ZhbGlkYXRvckZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJlbnQgY29udHJvbC5cbiAgICovXG4gIGdldCBwYXJlbnQoKTogRm9ybUdyb3VwfEZvcm1BcnJheXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQHNlZSBgRm9ybUNvbnRyb2xTdGF0dXNgXG4gICAqXG4gICAqIFRoZXNlIHN0YXR1cyB2YWx1ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSwgc28gYSBjb250cm9sIGNhbm5vdCBiZVxuICAgKiBib3RoIHZhbGlkIEFORCBpbnZhbGlkIG9yIGludmFsaWQgQU5EIGRpc2FibGVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1cyE6IEZvcm1Db250cm9sU3RhdHVzO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgVkFMSURgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBwYXNzZWQgYWxsIG9mIGl0cyB2YWxpZGF0aW9uIHRlc3RzLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgdmFsaWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBWQUxJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGludmFsaWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBJTlZBTElEYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIGNvbnRyb2wgaGFzIGZhaWxlZCBvbmUgb3IgbW9yZSBvZiBpdHMgdmFsaWRhdGlvbiBjaGVja3MsXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBpbnZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gSU5WQUxJRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHBlbmRpbmdgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBQRU5ESU5HYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGlzIGNvbnRyb2wgaXMgaW4gdGhlIHByb2Nlc3Mgb2YgY29uZHVjdGluZyBhIHZhbGlkYXRpb24gY2hlY2ssXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBwZW5kaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PSBQRU5ESU5HO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlzYWJsZWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIERpc2FibGVkIGNvbnRyb2xzIGFyZSBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogYXJlIG5vdCBpbmNsdWRlZCBpbiB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZWlyIGFuY2VzdG9yXG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLCBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBESVNBQkxFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGVuYWJsZWRgIGFzIGxvbmcgYXMgaXRzIGBzdGF0dXNgIGlzIG5vdCBgRElTQUJMRURgLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSBjb250cm9sIGhhcyBhbnkgc3RhdHVzIG90aGVyIHRoYW4gJ0RJU0FCTEVEJyxcbiAgICogZmFsc2UgaWYgdGhlIHN0YXR1cyBpcyAnRElTQUJMRUQnLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKi9cbiAgZ2V0IGVuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdHVzICE9PSBESVNBQkxFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhbnkgZXJyb3JzIGdlbmVyYXRlZCBieSBmYWlsaW5nIHZhbGlkYXRpb24sXG4gICAqIG9yIG51bGwgaWYgdGhlcmUgYXJlIG5vIGVycm9ycy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlcnJvcnMhOiBWYWxpZGF0aW9uRXJyb3JzfG51bGw7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgcHJpc3RpbmVgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWRcbiAgICogdGhlIHZhbHVlIGluIHRoZSBVSS5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkIHRoZSB2YWx1ZSBpbiB0aGUgVUk7IGNvbXBhcmUgYGRpcnR5YC5cbiAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcHJpc3RpbmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGRpcnR5YCBpZiB0aGUgdXNlciBoYXMgY2hhbmdlZCB0aGUgdmFsdWVcbiAgICogaW4gdGhlIFVJLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZSBvZiB0aGlzIGNvbnRyb2wgaW4gdGhlIFVJOyBjb21wYXJlIGBwcmlzdGluZWAuXG4gICAqIFByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIGRvIG5vdCBtYXJrIGl0IGRpcnR5LlxuICAgKi9cbiAgZ2V0IGRpcnR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5wcmlzdGluZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGlzIG1hcmtlZCBhcyBgdG91Y2hlZGAuXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBtYXJrZWQgYHRvdWNoZWRgIG9uY2UgdGhlIHVzZXIgaGFzIHRyaWdnZXJlZFxuICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0b3VjaGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIG5vdCBiZWVuIG1hcmtlZCBhcyB0b3VjaGVkXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBgdW50b3VjaGVkYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBnZXQgdW50b3VjaGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy50b3VjaGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbCBjaGFuZ2VzLCBpblxuICAgKiB0aGUgVUkgb3IgcHJvZ3JhbW1hdGljYWxseS4gSXQgYWxzbyBlbWl0cyBhbiBldmVudCBlYWNoIHRpbWUgeW91IGNhbGwgZW5hYmxlKCkgb3IgZGlzYWJsZSgpXG4gICAqIHdpdGhvdXQgcGFzc2luZyBhbG9uZyB7ZW1pdEV2ZW50OiBmYWxzZX0gYXMgYSBmdW5jdGlvbiBhcmd1bWVudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXMhOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWxpZGF0aW9uIGBzdGF0dXNgIG9mIHRoZSBjb250cm9sXG4gICAqIHJlY2FsY3VsYXRlcy5cbiAgICpcbiAgICogQHNlZSBgRm9ybUNvbnRyb2xTdGF0dXNgXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzQ2hhbmdlcyE6IE9ic2VydmFibGU8Rm9ybUNvbnRyb2xTdGF0dXM+O1xuXG4gIC8qKlxuICAgKiBSZXBvcnRzIHRoZSB1cGRhdGUgc3RyYXRlZ3kgb2YgdGhlIGBBYnN0cmFjdENvbnRyb2xgIChtZWFuaW5nXG4gICAqIHRoZSBldmVudCBvbiB3aGljaCB0aGUgY29udHJvbCB1cGRhdGVzIGl0c2VsZikuXG4gICAqIFBvc3NpYmxlIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYFxuICAgKiBEZWZhdWx0IHZhbHVlOiBgJ2NoYW5nZSdgXG4gICAqL1xuICBnZXQgdXBkYXRlT24oKTogRm9ybUhvb2tzIHtcbiAgICByZXR1cm4gdGhpcy5fdXBkYXRlT24gPyB0aGlzLl91cGRhdGVPbiA6ICh0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LnVwZGF0ZU9uIDogJ2NoYW5nZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gIENhbGxpbmdcbiAgICogdGhpcyBvdmVyd3JpdGVzIGFueSBleGlzdGluZyBzeW5jaHJvbm91cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIElmIHlvdSB3YW50IHRvIGFkZCBhIG5ldyB2YWxpZGF0b3Igd2l0aG91dCBhZmZlY3RpbmcgZXhpc3Rpbmcgb25lcywgY29uc2lkZXJcbiAgICogdXNpbmcgYGFkZFZhbGlkYXRvcnMoKWAgbWV0aG9kIGluc3RlYWQuXG4gICAqL1xuICBzZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118bnVsbCk6IHZvaWQge1xuICAgIHRoaXMuX3Jhd1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkVmFsaWRhdG9yRm4gPSBjb2VyY2VUb1ZhbGlkYXRvcih2YWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiBDYWxsaW5nIHRoaXNcbiAgICogb3ZlcndyaXRlcyBhbnkgZXhpc3RpbmcgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gYWRkIGEgbmV3IHZhbGlkYXRvciB3aXRob3V0IGFmZmVjdGluZyBleGlzdGluZyBvbmVzLCBjb25zaWRlclxuICAgKiB1c2luZyBgYWRkQXN5bmNWYWxpZGF0b3JzKClgIG1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cbiAgc2V0QXN5bmNWYWxpZGF0b3JzKHZhbGlkYXRvcnM6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzO1xuICAgIHRoaXMuX2NvbXBvc2VkQXN5bmNWYWxpZGF0b3JGbiA9IGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IodmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc3luY2hyb25vdXMgdmFsaWRhdG9yIG9yIHZhbGlkYXRvcnMgdG8gdGhpcyBjb250cm9sLCB3aXRob3V0IGFmZmVjdGluZyBvdGhlciB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqIEFkZGluZyBhIHZhbGlkYXRvciB0aGF0IGFscmVhZHkgZXhpc3RzIHdpbGwgaGF2ZSBubyBlZmZlY3QuIElmIGR1cGxpY2F0ZSB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqIGFyZSBwcmVzZW50IGluIHRoZSBgdmFsaWRhdG9yc2AgYXJyYXksIG9ubHkgdGhlIGZpcnN0IGluc3RhbmNlIHdvdWxkIGJlIGFkZGVkIHRvIGEgZm9ybVxuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IHZhbGlkYXRvciBmdW5jdGlvbiBvciBmdW5jdGlvbnMgdG8gYWRkIHRvIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGFkZFZhbGlkYXRvcnModmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXJcbiAgICogdmFsaWRhdG9ycy5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKiBBZGRpbmcgYSB2YWxpZGF0b3IgdGhhdCBhbHJlYWR5IGV4aXN0cyB3aWxsIGhhdmUgbm8gZWZmZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9ycyBUaGUgbmV3IGFzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gb3IgZnVuY3Rpb25zIHRvIGFkZCB0byB0aGlzIGNvbnRyb2wuXG4gICAqL1xuICBhZGRBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhhZGRWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmcm9tIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsXG4gICAqIGl0IGlzIGlnbm9yZWQuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIHZhbGlkYXRvciBvciB2YWxpZGF0b3JzIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVZhbGlkYXRvcnModmFsaWRhdG9yczogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmcm9tIHRoaXMgY29udHJvbCwgd2l0aG91dCBhZmZlY3Rpbmcgb3RoZXIgdmFsaWRhdG9ycy5cbiAgICogVmFsaWRhdG9ycyBhcmUgY29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlOyB5b3UgbXVzdCBwYXNzIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lXG4gICAqIHZhbGlkYXRvciBmdW5jdGlvbiBhcyB0aGUgb25lIHRoYXQgd2FzIG9yaWdpbmFsbHkgc2V0LiBJZiBhIHByb3ZpZGVkIHZhbGlkYXRvciBpcyBub3QgZm91bmQsIGl0XG4gICAqIGlzIGlnbm9yZWQuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvcnMgVGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0b3Igb3IgdmFsaWRhdG9ycyB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVBc3luY1ZhbGlkYXRvcnModmFsaWRhdG9yczogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEFzeW5jVmFsaWRhdG9ycyhyZW1vdmVWYWxpZGF0b3JzKHZhbGlkYXRvcnMsIHRoaXMuX3Jhd0FzeW5jVmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gaXMgcHJlc2VudCBvbiB0aGlzIGNvbnRyb2wuIFRoZSBwcm92aWRlZFxuICAgKiB2YWxpZGF0b3IgbXVzdCBiZSBhIHJlZmVyZW5jZSB0byB0aGUgZXhhY3Qgc2FtZSBmdW5jdGlvbiB0aGF0IHdhcyBwcm92aWRlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvciBUaGUgdmFsaWRhdG9yIHRvIGNoZWNrIGZvciBwcmVzZW5jZS4gQ29tcGFyZWQgYnkgZnVuY3Rpb24gcmVmZXJlbmNlLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBwcm92aWRlZCB2YWxpZGF0b3Igd2FzIGZvdW5kIG9uIHRoaXMgY29udHJvbC5cbiAgICovXG4gIGhhc1ZhbGlkYXRvcih2YWxpZGF0b3I6IFZhbGlkYXRvckZuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc1ZhbGlkYXRvcih0aGlzLl9yYXdWYWxpZGF0b3JzLCB2YWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgYW4gYXN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiBpcyBwcmVzZW50IG9uIHRoaXMgY29udHJvbC4gVGhlIHByb3ZpZGVkXG4gICAqIHZhbGlkYXRvciBtdXN0IGJlIGEgcmVmZXJlbmNlIHRvIHRoZSBleGFjdCBzYW1lIGZ1bmN0aW9uIHRoYXQgd2FzIHByb3ZpZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSBhc3luY2hyb25vdXMgdmFsaWRhdG9yIHRvIGNoZWNrIGZvciBwcmVzZW5jZS4gQ29tcGFyZWQgYnkgZnVuY3Rpb25cbiAgICogICAgIHJlZmVyZW5jZS5cbiAgICogQHJldHVybnMgV2hldGhlciB0aGUgcHJvdmlkZWQgYXN5bmNocm9ub3VzIHZhbGlkYXRvciB3YXMgZm91bmQgb24gdGhpcyBjb250cm9sLlxuICAgKi9cbiAgaGFzQXN5bmNWYWxpZGF0b3IodmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc1ZhbGlkYXRvcih0aGlzLl9yYXdBc3luY1ZhbGlkYXRvcnMsIHZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogRW1wdGllcyBvdXQgdGhlIHN5bmNocm9ub3VzIHZhbGlkYXRvciBsaXN0LlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBjbGVhclZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBhc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKi9cbiAgY2xlYXJBc3luY1ZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy5hc3luY1ZhbGlkYXRvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHRvdWNoZWRgLiBBIGNvbnRyb2wgaXMgdG91Y2hlZCBieSBmb2N1cyBhbmRcbiAgICogYmx1ciBldmVudHMgdGhhdCBkbyBub3QgY2hhbmdlIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQHNlZSBgbWFya0FzVW50b3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc0RpcnR5KClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzVG91Y2hlZChvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhbmQgYWxsIGl0cyBkZXNjZW5kYW50IGNvbnRyb2xzIGFzIGB0b3VjaGVkYC5cbiAgICogQHNlZSBgbWFya0FzVG91Y2hlZCgpYFxuICAgKi9cbiAgbWFya0FsbEFzVG91Y2hlZCgpOiB2b2lkIHtcbiAgICB0aGlzLm1hcmtBc1RvdWNoZWQoe29ubHlTZWxmOiB0cnVlfSk7XG5cbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5tYXJrQWxsQXNUb3VjaGVkKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB1bnRvdWNoZWRgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBhbHNvIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgdW50b3VjaGVkYFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgdG91Y2hlZGAgc3RhdHVzIG9mIGFsbCBwYXJlbnQgY29udHJvbHMuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzRGlydHkoKWBcbiAgICogQHNlZSBgbWFya0FzUHJpc3RpbmUoKWBcbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzVW50b3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dG91Y2hlZDogYm9vbGVhbn0pLnRvdWNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9wZW5kaW5nVG91Y2hlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wubWFya0FzVW50b3VjaGVkKHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgZGlydHlgLiBBIGNvbnRyb2wgYmVjb21lcyBkaXJ0eSB3aGVuXG4gICAqIHRoZSBjb250cm9sJ3MgdmFsdWUgaXMgY2hhbmdlZCB0aHJvdWdoIHRoZSBVSTsgY29tcGFyZSBgbWFya0FzVG91Y2hlZGAuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzVW50b3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzRGlydHkob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtwcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzRGlydHkob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwcmlzdGluZWAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgcHJpc3RpbmVgLFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgcHJpc3RpbmVgIHN0YXR1cyBvZiBhbGwgcGFyZW50XG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIGBtYXJrQXNUb3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1VudG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNEaXJ0eSgpYFxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIGVtaXRzIGV2ZW50cyBhZnRlclxuICAgKiBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqL1xuICBtYXJrQXNQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ByaXN0aW5lOiBib29sZWFufSkucHJpc3RpbmUgPSB0cnVlO1xuICAgIHRoaXMuX3BlbmRpbmdEaXJ0eSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wubWFya0FzUHJpc3RpbmUoe29ubHlTZWxmOiB0cnVlfSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgcGVuZGluZ2AuXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBwZW5kaW5nIHdoaWxlIHRoZSBjb250cm9sIHBlcmZvcm1zIGFzeW5jIHZhbGlkYXRpb24uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIHRoZSBjb250cm9sIGlzIG1hcmtlZCBwZW5kaW5nLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICBtYXJrQXNQZW5kaW5nKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IFBFTkRJTkc7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNQZW5kaW5nKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogZXhjbHVkZWQgZnJvbSB0aGUgYWdncmVnYXRlIHZhbHVlIG9mIGFueSBwYXJlbnQuIEl0cyBzdGF0dXMgaXMgYERJU0FCTEVEYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGFsc28gZGlzYWJsZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlc1xuICAgKiBjaGFuZ2VzIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBkaXNhYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAvLyBwYXJlbnQncyBkaXJ0aW5lc3MgYmFzZWQgb24gdGhlIGNoaWxkcmVuLlxuICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG5cbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IERJU0FCTEVEO1xuICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gbnVsbDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgY29udHJvbC5kaXNhYmxlKHsuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIHRoaXMuX3VwZGF0ZUFuY2VzdG9ycyh7Li4ub3B0cywgc2tpcFByaXN0aW5lQ2hlY2t9KTtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLmZvckVhY2goKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbih0cnVlKSk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlcyB0aGUgY29udHJvbC4gVGhpcyBtZWFucyB0aGUgY29udHJvbCBpcyBpbmNsdWRlZCBpbiB2YWxpZGF0aW9uIGNoZWNrcyBhbmRcbiAgICogdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBpdHMgcGFyZW50LiBJdHMgc3RhdHVzIHJlY2FsY3VsYXRlcyBiYXNlZCBvbiBpdHMgdmFsdWUgYW5kXG4gICAqIGl0cyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpZiB0aGUgY29udHJvbCBoYXMgY2hpbGRyZW4sIGFsbCBjaGlsZHJlbiBhcmUgZW5hYmxlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBjb250cm9sIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyB3aGVuIG1hcmtlZCBhcyB1bnRvdWNoZWRcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgZW5hYmxlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgZW5hYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAvLyBJZiBwYXJlbnQgaGFzIGJlZW4gbWFya2VkIGFydGlmaWNpYWxseSBkaXJ0eSB3ZSBkb24ndCB3YW50IHRvIHJlLWNhbGN1bGF0ZSB0aGVcbiAgICAvLyBwYXJlbnQncyBkaXJ0aW5lc3MgYmFzZWQgb24gdGhlIGNoaWxkcmVuLlxuICAgIGNvbnN0IHNraXBQcmlzdGluZUNoZWNrID0gdGhpcy5fcGFyZW50TWFya2VkRGlydHkob3B0cy5vbmx5U2VsZik7XG5cbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IFZBTElEO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLmVuYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4oZmFsc2UpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUFuY2VzdG9ycyhcbiAgICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW4sIHNraXBQcmlzdGluZUNoZWNrPzogYm9vbGVhbn0pIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICAgIGlmICghb3B0cy5za2lwUHJpc3RpbmVDaGVjaykge1xuICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHBhcmVudCBTZXRzIHRoZSBwYXJlbnQgb2YgdGhlIGNvbnRyb2xcbiAgICovXG4gIHNldFBhcmVudChwYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXkpOiB2b2lkIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCByZXNldCh2YWx1ZT86IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpdCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiBpdHMgYW5jZXN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50c1xuICAgKiBhZnRlciB1cGRhdGVzIGFuZCB2YWxpZGl0eSBjaGVja3MgYXJlIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBvbmx5IHVwZGF0ZSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiB1cGRhdGUgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX3NldEluaXRpYWxTdGF0dXMoKTtcbiAgICB0aGlzLl91cGRhdGVWYWx1ZSgpO1xuXG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5fY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTtcbiAgICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gdGhpcy5fcnVuVmFsaWRhdG9yKCk7XG4gICAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFZBTElEIHx8IHRoaXMuc3RhdHVzID09PSBQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3J1bkFzeW5jVmFsaWRhdG9yKG9wdHMuZW1pdEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxGb3JtQ29udHJvbFN0YXR1cz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRyZWVWYWxpZGl0eShvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7ZW1pdEV2ZW50OiB0cnVlfSkge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY3RybDogQWJzdHJhY3RDb250cm9sKSA9PiBjdHJsLl91cGRhdGVUcmVlVmFsaWRpdHkob3B0cykpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnR9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldEluaXRpYWxTdGF0dXMoKSB7XG4gICAgKHRoaXMgYXMge3N0YXR1czogRm9ybUNvbnRyb2xTdGF0dXN9KS5zdGF0dXMgPSB0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkgPyBESVNBQkxFRCA6IFZBTElEO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuVmFsaWRhdG9yKCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudmFsaWRhdG9yID8gdGhpcy52YWxpZGF0b3IodGhpcykgOiBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBfcnVuQXN5bmNWYWxpZGF0b3IoZW1pdEV2ZW50PzogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLmFzeW5jVmFsaWRhdG9yKSB7XG4gICAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IFBFTkRJTkc7XG4gICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSB0cnVlO1xuICAgICAgY29uc3Qgb2JzID0gdG9PYnNlcnZhYmxlKHRoaXMuYXN5bmNWYWxpZGF0b3IodGhpcykpO1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uID0gb2JzLnN1YnNjcmliZSgoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwpID0+IHtcbiAgICAgICAgdGhpcy5faGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yID0gZmFsc2U7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0cmlnZ2VyIHRoZSByZWNhbGN1bGF0aW9uIG9mIHRoZSB2YWxpZGF0aW9uIHN0YXR1cywgd2hpY2ggZGVwZW5kcyBvblxuICAgICAgICAvLyB0aGUgc3RhdGUgb2YgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGF0aW9uICh3aGV0aGVyIGl0IGlzIGluIHByb2dyZXNzIG9yIG5vdCkuIFNvLCBpdCBpc1xuICAgICAgICAvLyBuZWNlc3NhcnkgdGhhdCB3ZSBoYXZlIHVwZGF0ZWQgdGhlIGBfaGFzT3duUGVuZGluZ0FzeW5jVmFsaWRhdG9yYCBib29sZWFuIGZsYWcgZmlyc3QuXG4gICAgICAgIHRoaXMuc2V0RXJyb3JzKGVycm9ycywge2VtaXRFdmVudH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBlcnJvcnMgb24gYSBmb3JtIGNvbnRyb2wgd2hlbiBydW5uaW5nIHZhbGlkYXRpb25zIG1hbnVhbGx5LCByYXRoZXIgdGhhbiBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBDYWxsaW5nIGBzZXRFcnJvcnNgIGFsc28gdXBkYXRlcyB0aGUgdmFsaWRpdHkgb2YgdGhlIHBhcmVudCBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgTWFudWFsbHkgc2V0IHRoZSBlcnJvcnMgZm9yIGEgY29udHJvbFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgbG9naW4gPSBuZXcgRm9ybUNvbnRyb2woJ3NvbWVMb2dpbicpO1xuICAgKiBsb2dpbi5zZXRFcnJvcnMoe1xuICAgKiAgIG5vdFVuaXF1ZTogdHJ1ZVxuICAgKiB9KTtcbiAgICpcbiAgICogZXhwZWN0KGxvZ2luLnZhbGlkKS50b0VxdWFsKGZhbHNlKTtcbiAgICogZXhwZWN0KGxvZ2luLmVycm9ycykudG9FcXVhbCh7IG5vdFVuaXF1ZTogdHJ1ZSB9KTtcbiAgICpcbiAgICogbG9naW4uc2V0VmFsdWUoJ3NvbWVPdGhlckxvZ2luJyk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbCh0cnVlKTtcbiAgICogYGBgXG4gICAqL1xuICBzZXRFcnJvcnMoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwsIG9wdHM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge2Vycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGx9KS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgdGhpcy5fdXBkYXRlQ29udHJvbHNFcnJvcnMob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBBIGRvdC1kZWxpbWl0ZWQgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZy9udW1iZXIgdmFsdWVzIHRoYXQgZGVmaW5lIHRoZSBwYXRoIHRvIHRoZVxuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUmV0cmlldmUgYSBuZXN0ZWQgY29udHJvbFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gZ2V0IGEgYG5hbWVgIGNvbnRyb2wgbmVzdGVkIHdpdGhpbiBhIGBwZXJzb25gIHN1Yi1ncm91cDpcbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldCgncGVyc29uLm5hbWUnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ3BlcnNvbicsICduYW1lJ10pO2BcbiAgICpcbiAgICogIyMjIFJldHJpZXZlIGEgY29udHJvbCBpbiBhIEZvcm1BcnJheVxuICAgKlxuICAgKiBXaGVuIGFjY2Vzc2luZyBhbiBlbGVtZW50IGluc2lkZSBhIEZvcm1BcnJheSwgeW91IGNhbiB1c2UgYW4gZWxlbWVudCBpbmRleC5cbiAgICogRm9yIGV4YW1wbGUsIHRvIGdldCBhIGBwcmljZWAgY29udHJvbCBmcm9tIHRoZSBmaXJzdCBlbGVtZW50IGluIGFuIGBpdGVtc2AgYXJyYXkgeW91IGNhbiB1c2U6XG4gICAqXG4gICAqICogYHRoaXMuZm9ybS5nZXQoJ2l0ZW1zLjAucHJpY2UnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ2l0ZW1zJywgMCwgJ3ByaWNlJ10pO2BcbiAgICovXG4gIGdldChwYXRoOiBBcnJheTxzdHJpbmd8bnVtYmVyPnxzdHJpbmcpOiBBYnN0cmFjdENvbnRyb2x8bnVsbCB7XG4gICAgcmV0dXJuIF9maW5kKHRoaXMsIHBhdGgsICcuJyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogQHJldHVybnMgZXJyb3IgZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIGVycm9yLiBJZiB0aGUgY29udHJvbCBvciBlcnJvciBpcyBub3QgcHJlc2VudCxcbiAgICogbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIGdldEVycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBjb250cm9sID0gcGF0aCA/IHRoaXMuZ2V0KHBhdGgpIDogdGhpcztcbiAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sLmVycm9ycyA/IGNvbnRyb2wuZXJyb3JzW2Vycm9yQ29kZV0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGVycm9yIHNwZWNpZmllZC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogSWYgbm8gcGF0aCBpcyBnaXZlbiwgdGhpcyBtZXRob2QgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIGZhbHNlIGlzIHJldHVybmVkLlxuICAgKi9cbiAgaGFzRXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcsIHBhdGg/OiBBcnJheTxzdHJpbmd8bnVtYmVyPnxzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmdldEVycm9yKGVycm9yQ29kZSwgcGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSB0b3AtbGV2ZWwgYW5jZXN0b3Igb2YgdGhpcyBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHJvb3QoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBsZXQgeDogQWJzdHJhY3RDb250cm9sID0gdGhpcztcblxuICAgIHdoaWxlICh4Ll9wYXJlbnQpIHtcbiAgICAgIHggPSB4Ll9wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7c3RhdHVzOiBGb3JtQ29udHJvbFN0YXR1c30pLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuXG4gICAgaWYgKGVtaXRFdmVudCkge1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8Rm9ybUNvbnRyb2xTdGF0dXM+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50KSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZUNvbnRyb2xzRXJyb3JzKGVtaXRFdmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaW5pdE9ic2VydmFibGVzKCkge1xuICAgICh0aGlzIGFzIHt2YWx1ZUNoYW5nZXM6IE9ic2VydmFibGU8YW55Pn0pLnZhbHVlQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAodGhpcyBhcyB7c3RhdHVzQ2hhbmdlczogT2JzZXJ2YWJsZTxGb3JtQ29udHJvbFN0YXR1cz59KS5zdGF0dXNDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB9XG5cblxuICBwcml2YXRlIF9jYWxjdWxhdGVTdGF0dXMoKTogRm9ybUNvbnRyb2xTdGF0dXMge1xuICAgIGlmICh0aGlzLl9hbGxDb250cm9sc0Rpc2FibGVkKCkpIHJldHVybiBESVNBQkxFRDtcbiAgICBpZiAodGhpcy5lcnJvcnMpIHJldHVybiBJTlZBTElEO1xuICAgIGlmICh0aGlzLl9oYXNPd25QZW5kaW5nQXN5bmNWYWxpZGF0b3IgfHwgdGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKFBFTkRJTkcpKSByZXR1cm4gUEVORElORztcbiAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKElOVkFMSUQpKSByZXR1cm4gSU5WQUxJRDtcbiAgICByZXR1cm4gVkFMSUQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF91cGRhdGVWYWx1ZSgpOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2ZvckVhY2hDaGlsZChjYjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gdm9pZCk6IHZvaWQ7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfYW55Q29udHJvbHMoY29uZGl0aW9uOiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiBib29sZWFuKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBhYnN0cmFjdCBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzSGF2ZVN0YXR1cyhzdGF0dXM6IEZvcm1Db250cm9sU3RhdHVzKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuc3RhdHVzID09PSBzdGF0dXMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNEaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5kaXJ0eSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc1RvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wudG91Y2hlZCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ByaXN0aW5lOiBib29sZWFufSkucHJpc3RpbmUgPSAhdGhpcy5fYW55Q29udHJvbHNEaXJ0eSgpO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUb3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dG91Y2hlZDogYm9vbGVhbn0pLnRvdWNoZWQgPSB0aGlzLl9hbnlDb250cm9sc1RvdWNoZWQoKTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkRpc2FibGVkQ2hhbmdlOiBBcnJheTwoaXNEaXNhYmxlZDogYm9vbGVhbikgPT4gdm9pZD4gPSBbXTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9pc0JveGVkVmFsdWUoZm9ybVN0YXRlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdHlwZW9mIGZvcm1TdGF0ZSA9PT0gJ29iamVjdCcgJiYgZm9ybVN0YXRlICE9PSBudWxsICYmXG4gICAgICAgIE9iamVjdC5rZXlzKGZvcm1TdGF0ZSkubGVuZ3RoID09PSAyICYmICd2YWx1ZScgaW4gZm9ybVN0YXRlICYmICdkaXNhYmxlZCcgaW4gZm9ybVN0YXRlO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwZGF0ZVN0cmF0ZWd5KG9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCk6IHZvaWQge1xuICAgIGlmIChpc09wdGlvbnNPYmoob3B0cykgJiYgb3B0cy51cGRhdGVPbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLl91cGRhdGVPbiA9IG9wdHMudXBkYXRlT24hO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyZW50TWFya2VkRGlydHkob25seVNlbGY/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyZW50RGlydHkgPSB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmRpcnR5O1xuICAgIHJldHVybiAhb25seVNlbGYgJiYgISFwYXJlbnREaXJ0eSAmJiAhdGhpcy5fcGFyZW50IS5fYW55Q29udHJvbHNEaXJ0eSgpO1xuICB9XG59XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMgb2YgYW4gaW5kaXZpZHVhbCBmb3JtIGNvbnRyb2wuXG4gKlxuICogVGhpcyBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyBvZiBBbmd1bGFyIGZvcm1zLCBhbG9uZyB3aXRoXG4gKiBgRm9ybUdyb3VwYCBhbmQgYEZvcm1BcnJheWAuIEl0IGV4dGVuZHMgdGhlIGBBYnN0cmFjdENvbnRyb2xgIGNsYXNzIHRoYXRcbiAqIGltcGxlbWVudHMgbW9zdCBvZiB0aGUgYmFzZSBmdW5jdGlvbmFsaXR5IGZvciBhY2Nlc3NpbmcgdGhlIHZhbHVlLCB2YWxpZGF0aW9uIHN0YXR1cyxcbiAqIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBldmVudHMuIFNlZSBbdXNhZ2UgZXhhbXBsZXMgYmVsb3ddKCN1c2FnZS1ub3RlcykuXG4gKlxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBbVXNhZ2UgTm90ZXNdKCN1c2FnZS1ub3RlcylcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBJbml0aWFsaXppbmcgRm9ybSBDb250cm9sc1xuICpcbiAqIEluc3RhbnRpYXRlIGEgYEZvcm1Db250cm9sYCwgd2l0aCBhbiBpbml0aWFsIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdzb21lIHZhbHVlJyk7XG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgICAgIC8vICdzb21lIHZhbHVlJ1xuICpgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhIGZvcm0gc3RhdGUgb2JqZWN0LiBUaGUgYHZhbHVlYFxuICogYW5kIGBkaXNhYmxlZGAga2V5cyBhcmUgcmVxdWlyZWQgaW4gdGhpcyBjYXNlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKHsgdmFsdWU6ICduL2EnLCBkaXNhYmxlZDogdHJ1ZSB9KTtcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAgICAgLy8gJ24vYSdcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wuc3RhdHVzKTsgICAgLy8gJ0RJU0FCTEVEJ1xuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYSBzeW5jaHJvbm91cyB2YWxpZGF0b3IuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7ICAgICAgLy8gJydcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wuc3RhdHVzKTsgICAgIC8vICdJTlZBTElEJ1xuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGluaXRpYWxpemVzIHRoZSBjb250cm9sIHVzaW5nIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCB7XG4gKiAgICB2YWxpZGF0b3JzOiBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICogICAgYXN5bmNWYWxpZGF0b3JzOiBteUFzeW5jVmFsaWRhdG9yXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDb25maWd1cmUgdGhlIGNvbnRyb2wgdG8gdXBkYXRlIG9uIGEgYmx1ciBldmVudFxuICpcbiAqIFNldCB0aGUgYHVwZGF0ZU9uYCBvcHRpb24gdG8gYCdibHVyJ2AgdG8gdXBkYXRlIG9uIHRoZSBibHVyIGBldmVudGAuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIHsgdXBkYXRlT246ICdibHVyJyB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDb25maWd1cmUgdGhlIGNvbnRyb2wgdG8gdXBkYXRlIG9uIGEgc3VibWl0IGV2ZW50XG4gKlxuICogU2V0IHRoZSBgdXBkYXRlT25gIG9wdGlvbiB0byBgJ3N1Ym1pdCdgIHRvIHVwZGF0ZSBvbiBhIHN1Ym1pdCBgZXZlbnRgLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCcnLCB7IHVwZGF0ZU9uOiAnc3VibWl0JyB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBSZXNldCB0aGUgY29udHJvbCBiYWNrIHRvIGFuIGluaXRpYWwgdmFsdWVcbiAqXG4gKiBZb3UgcmVzZXQgdG8gYSBzcGVjaWZpYyBmb3JtIHN0YXRlIGJ5IHBhc3NpbmcgdGhyb3VnaCBhIHN0YW5kYWxvbmVcbiAqIHZhbHVlIG9yIGEgZm9ybSBzdGF0ZSBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdGVcbiAqICh0aGVzZSBhcmUgdGhlIG9ubHkgdHdvIHByb3BlcnRpZXMgdGhhdCBjYW5ub3QgYmUgY2FsY3VsYXRlZCkuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ05hbmN5Jyk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdOYW5jeSdcbiAqXG4gKiBjb250cm9sLnJlc2V0KCdEcmV3Jyk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdEcmV3J1xuICogYGBgXG4gKlxuICogIyMjIFJlc2V0IHRoZSBjb250cm9sIGJhY2sgdG8gYW4gaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWRcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJ05hbmN5Jyk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdOYW5jeSdcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wuc3RhdHVzKTsgLy8gJ1ZBTElEJ1xuICpcbiAqIGNvbnRyb2wucmVzZXQoeyB2YWx1ZTogJ0RyZXcnLCBkaXNhYmxlZDogdHJ1ZSB9KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgLy8gJ0RyZXcnXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnN0YXR1cyk7IC8vICdESVNBQkxFRCdcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIG9mIHRoaXMgRm9ybUNvbnRyb2wsIHVzZWQgd2hlbmV2ZXIgdGhlIGNvbnRyb2wgaXMgcmVzZXQgd2l0aG91dCBhbiBleHBsaWNpdFxuICAgKiB2YWx1ZS4gU2VlIHtAbGluayBGb3JtQ29udHJvbE9wdGlvbnMjaW5pdGlhbFZhbHVlSXNEZWZhdWx0fSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBjb25maWd1cmluZ1xuICAgKiBhIGRlZmF1bHQgdmFsdWUuXG4gICAqIEBwdWJsaWNBcGlcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGw7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25DaGFuZ2U6IEFycmF5PEZ1bmN0aW9uPiA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGlzIGZpZWxkIGhvbGRzIGEgcGVuZGluZyB2YWx1ZSB0aGF0IGhhcyBub3QgeWV0IGJlZW4gYXBwbGllZCB0byB0aGUgZm9ybSdzIHZhbHVlLlxuICAgKiBJdCBpcyBgYW55YCBiZWNhdXNlIHRoZSB2YWx1ZSBpcyB1bnR5cGVkLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9wZW5kaW5nVmFsdWU6IGFueTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nQ2hhbmdlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Db250cm9sYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHZhbGlkYXRpb24gZnVuY3Rpb25zXG4gICAqIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGZvcm1TdGF0ZTogYW55ID0gbnVsbCwgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxGb3JtQ29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCkge1xuICAgIHN1cGVyKHBpY2tWYWxpZGF0b3JzKHZhbGlkYXRvck9yT3B0cyksIHBpY2tBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgIHRoaXMuX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZSk7XG4gICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe1xuICAgICAgb25seVNlbGY6IHRydWUsXG4gICAgICAvLyBJZiBgYXN5bmNWYWxpZGF0b3JgIGlzIHByZXNlbnQsIGl0IHdpbGwgdHJpZ2dlciBjb250cm9sIHN0YXR1cyBjaGFuZ2UgZnJvbSBgUEVORElOR2AgdG9cbiAgICAgIC8vIGBWQUxJRGAgb3IgYElOVkFMSURgLlxuICAgICAgLy8gVGhlIHN0YXR1cyBzaG91bGQgYmUgYnJvYWRjYXN0ZWQgdmlhIHRoZSBgc3RhdHVzQ2hhbmdlc2Agb2JzZXJ2YWJsZSwgc28gd2Ugc2V0IGBlbWl0RXZlbnRgXG4gICAgICAvLyB0byBgdHJ1ZWAgdG8gYWxsb3cgdGhhdCBkdXJpbmcgdGhlIGNvbnRyb2wgY3JlYXRpb24gcHJvY2Vzcy5cbiAgICAgIGVtaXRFdmVudDogISF0aGlzLmFzeW5jVmFsaWRhdG9yXG4gICAgfSk7XG4gICAgaWYgKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpICYmIHZhbGlkYXRvck9yT3B0cy5pbml0aWFsVmFsdWVJc0RlZmF1bHQpIHtcbiAgICAgIGlmICh0aGlzLl9pc0JveGVkVmFsdWUoZm9ybVN0YXRlKSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IGZvcm1TdGF0ZS52YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFZhbHVlID0gZm9ybVN0YXRlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgbmV3IHZhbHVlIGZvciB0aGUgZm9ybSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGNvbnRyb2wuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqICogYGVtaXRNb2RlbFRvVmlld0NoYW5nZWA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBvbkNoYW5nZWAgZXZlbnQgdG9cbiAgICogdXBkYXRlIHRoZSB2aWV3LlxuICAgKiAqIGBlbWl0Vmlld1RvTW9kZWxDaGFuZ2VgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBuZ01vZGVsQ2hhbmdlYFxuICAgKiBldmVudCB0byB1cGRhdGUgdGhlIG1vZGVsLlxuICAgKlxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9uczoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxuICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXG4gICAgZW1pdFZpZXdUb01vZGVsQ2hhbmdlPzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcGVuZGluZ1ZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlLmxlbmd0aCAmJiBvcHRpb25zLmVtaXRNb2RlbFRvVmlld0NoYW5nZSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlLmZvckVhY2goXG4gICAgICAgICAgKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbih0aGlzLnZhbHVlLCBvcHRpb25zLmVtaXRWaWV3VG9Nb2RlbENoYW5nZSAhPT0gZmFsc2UpKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIGEgY29udHJvbC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBmdW5jdGlvbmFsbHkgdGhlIHNhbWUgYXMge0BsaW5rIEZvcm1Db250cm9sI3NldFZhbHVlIHNldFZhbHVlfSBhdCB0aGlzIGxldmVsLlxuICAgKiBJdCBleGlzdHMgZm9yIHN5bW1ldHJ5IHdpdGgge0BsaW5rIEZvcm1Hcm91cCNwYXRjaFZhbHVlIHBhdGNoVmFsdWV9IG9uIGBGb3JtR3JvdXBzYCBhbmRcbiAgICogYEZvcm1BcnJheXNgLCB3aGVyZSBpdCBkb2VzIGJlaGF2ZSBkaWZmZXJlbnRseS5cbiAgICpcbiAgICogQHNlZSBgc2V0VmFsdWVgIGZvciBvcHRpb25zXG4gICAqL1xuICBvdmVycmlkZSBwYXRjaFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW4sXG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbixcbiAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxuICAgIGVtaXRWaWV3VG9Nb2RlbENoYW5nZT86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBmb3JtIGNvbnRyb2wsIG1hcmtpbmcgaXQgYHByaXN0aW5lYCBhbmQgYHVudG91Y2hlZGAsIGFuZCByZXNldHRpbmdcbiAgICogdGhlIHZhbHVlLiBUaGUgbmV3IHZhbHVlIHdpbGwgYmUgdGhlIHByb3ZpZGVkIHZhbHVlIChpZiBwYXNzZWQpLCBgbnVsbGAsIG9yIHRoZSBpbml0aWFsIHZhbHVlXG4gICAqIGlmIGBpbml0aWFsVmFsdWVJc0RlZmF1bHRgIHdhcyBzZXQgaW4gdGhlIGNvbnN0cnVjdG9yIHZpYSB7QGxpbmsgRm9ybUNvbnRyb2xPcHRpb25zfS5cbiAgICpcbiAgICogYGBgdHNcbiAgICogLy8gQnkgZGVmYXVsdCwgdGhlIGNvbnRyb2wgd2lsbCByZXNldCB0byBudWxsLlxuICAgKiBjb25zdCBkb2cgPSBuZXcgRm9ybUNvbnRyb2woJ3Nwb3QnKTtcbiAgICogZG9nLnJlc2V0KCk7IC8vIGRvZy52YWx1ZSBpcyBudWxsXG4gICAqXG4gICAqIC8vIElmIHRoaXMgZmxhZyBpcyBzZXQsIHRoZSBjb250cm9sIHdpbGwgaW5zdGVhZCByZXNldCB0byB0aGUgaW5pdGlhbCB2YWx1ZS5cbiAgICogY29uc3QgY2F0ID0gbmV3IEZvcm1Db250cm9sKCd0YWJieScsIHtpbml0aWFsVmFsdWVJc0RlZmF1bHQ6IHRydWV9KTtcbiAgICogY2F0LnJlc2V0KCk7IC8vIGNhdC52YWx1ZSBpcyBcInRhYmJ5XCJcbiAgICpcbiAgICogLy8gQSB2YWx1ZSBwYXNzZWQgdG8gcmVzZXQgYWx3YXlzIHRha2VzIHByZWNlZGVuY2UuXG4gICAqIGNvbnN0IGZpc2ggPSBuZXcgRm9ybUNvbnRyb2woJ2Zpbm4nLCB7aW5pdGlhbFZhbHVlSXNEZWZhdWx0OiB0cnVlfSk7XG4gICAqIGZpc2gucmVzZXQoJ2J1YmJsZScpOyAvLyBmaXNoLnZhbHVlIGlzIFwiYnViYmxlXCJcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBmb3JtU3RhdGUgUmVzZXRzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICBvdmVycmlkZSByZXNldChmb3JtU3RhdGU6IGFueSA9IHRoaXMuZGVmYXVsdFZhbHVlLCBvcHRpb25zOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlKTtcbiAgICB0aGlzLm1hcmtBc1ByaXN0aW5lKG9wdGlvbnMpO1xuICAgIHRoaXMubWFya0FzVW50b3VjaGVkKG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy52YWx1ZSwgb3B0aW9ucyk7XG4gICAgdGhpcy5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb3ZlcnJpZGUgX3VwZGF0ZVZhbHVlKCkge31cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBvdmVycmlkZSBfYW55Q29udHJvbHMoY29uZGl0aW9uOiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb3ZlcnJpZGUgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgY2hhbmdlIGV2ZW50cy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgdmFsdWUgY2hhbmdlc1xuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICB0aGlzLl9vbkNoYW5nZS5wdXNoKGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB0byB1bnJlZ2lzdGVyIGEgY2hhbmdlIGV2ZW50cyBsaXN0ZW5lci5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBfdW5yZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU/OiBhbnksIGVtaXRNb2RlbEV2ZW50PzogYm9vbGVhbikgPT4gdm9pZCk6IHZvaWQge1xuICAgIHJlbW92ZUxpc3RJdGVtKHRoaXMuX29uQ2hhbmdlLCBmbik7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgZGlzYWJsZWQgZXZlbnRzLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBkaXNhYmxlZCBzdGF0dXMgY2hhbmdlcy5cbiAgICovXG4gIHJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShmbjogKGlzRGlzYWJsZWQ6IGJvb2xlYW4pID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLnB1c2goZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGZ1bmN0aW9uIHRvIHVucmVnaXN0ZXIgYSBkaXNhYmxlZCBldmVudCBsaXN0ZW5lci5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBfdW5yZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2UoZm46IChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgcmVtb3ZlTGlzdEl0ZW0odGhpcy5fb25EaXNhYmxlZENoYW5nZSwgZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgb3ZlcnJpZGUgX2ZvckVhY2hDaGlsZChjYjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gdm9pZCk6IHZvaWQge31cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLnVwZGF0ZU9uID09PSAnc3VibWl0Jykge1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmdEaXJ0eSkgdGhpcy5tYXJrQXNEaXJ0eSgpO1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmdUb3VjaGVkKSB0aGlzLm1hcmtBc1RvdWNoZWQoKTtcbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5fcGVuZGluZ1ZhbHVlLCB7b25seVNlbGY6IHRydWUsIGVtaXRNb2RlbFRvVmlld0NoYW5nZTogZmFsc2V9KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX2lzQm94ZWRWYWx1ZShmb3JtU3RhdGUpKSB7XG4gICAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcGVuZGluZ1ZhbHVlID0gZm9ybVN0YXRlLnZhbHVlO1xuICAgICAgZm9ybVN0YXRlLmRpc2FibGVkID8gdGhpcy5kaXNhYmxlKHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZX0pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlKHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcGVuZGluZ1ZhbHVlID0gZm9ybVN0YXRlO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGEgZ3JvdXAgb2YgYEZvcm1Db250cm9sYCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUdyb3VwYCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gb25lIG9iamVjdCxcbiAqIHdpdGggZWFjaCBjb250cm9sIG5hbWUgYXMgdGhlIGtleS4gIEl0IGNhbGN1bGF0ZXMgaXRzIHN0YXR1cyBieSByZWR1Y2luZyB0aGUgc3RhdHVzIHZhbHVlc1xuICogb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mIHRoZSBjb250cm9scyBpbiBhIGdyb3VwIGlzIGludmFsaWQsIHRoZSBlbnRpcmVcbiAqIGdyb3VwIGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUdyb3VwYCBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyB1c2VkIHRvIGRlZmluZSBmb3JtcyBpbiBBbmd1bGFyLFxuICogYWxvbmcgd2l0aCBgRm9ybUNvbnRyb2xgIGFuZCBgRm9ybUFycmF5YC5cbiAqXG4gKiBXaGVuIGluc3RhbnRpYXRpbmcgYSBgRm9ybUdyb3VwYCwgcGFzcyBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMgYXMgdGhlIGZpcnN0XG4gKiBhcmd1bWVudC4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCByZWdpc3RlcnMgdGhlIG5hbWUgZm9yIHRoZSBjb250cm9sLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENyZWF0ZSBhIGZvcm0gZ3JvdXAgd2l0aCAyIGNvbnRyb2xzXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ05hbmN5JywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnKSxcbiAqIH0pO1xuICpcbiAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDsgJ0RyZXcnfVxuICogY29uc29sZS5sb2coZm9ybS5zdGF0dXMpOyAgLy8gJ1ZBTElEJ1xuICogYGBgXG4gKlxuICogIyMjIENyZWF0ZSBhIGZvcm0gZ3JvdXAgd2l0aCBhIGdyb3VwLWxldmVsIHZhbGlkYXRvclxuICpcbiAqIFlvdSBpbmNsdWRlIGdyb3VwLWxldmVsIHZhbGlkYXRvcnMgYXMgdGhlIHNlY29uZCBhcmcsIG9yIGdyb3VwLWxldmVsIGFzeW5jXG4gKiB2YWxpZGF0b3JzIGFzIHRoZSB0aGlyZCBhcmcuIFRoZXNlIGNvbWUgaW4gaGFuZHkgd2hlbiB5b3Ugd2FudCB0byBwZXJmb3JtIHZhbGlkYXRpb25cbiAqIHRoYXQgY29uc2lkZXJzIHRoZSB2YWx1ZSBvZiBtb3JlIHRoYW4gb25lIGNoaWxkIGNvbnRyb2wuXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIHBhc3N3b3JkOiBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgcGFzc3dvcmRDb25maXJtOiBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqIH0sIHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IpO1xuICpcbiAqXG4gKiBmdW5jdGlvbiBwYXNzd29yZE1hdGNoVmFsaWRhdG9yKGc6IEZvcm1Hcm91cCkge1xuICogICAgcmV0dXJuIGcuZ2V0KCdwYXNzd29yZCcpLnZhbHVlID09PSBnLmdldCgncGFzc3dvcmRDb25maXJtJykudmFsdWVcbiAqICAgICAgID8gbnVsbCA6IHsnbWlzbWF0Y2gnOiB0cnVlfTtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIExpa2UgYEZvcm1Db250cm9sYCBpbnN0YW5jZXMsIHlvdSBjaG9vc2UgdG8gcGFzcyBpblxuICogdmFsaWRhdG9ycyBhbmQgYXN5bmMgdmFsaWRhdG9ycyBhcyBwYXJ0IG9mIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBwYXNzd29yZDogbmV3IEZvcm1Db250cm9sKCcnKVxuICogICBwYXNzd29yZENvbmZpcm06IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqIH0sIHsgdmFsaWRhdG9yczogcGFzc3dvcmRNYXRjaFZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3JzOiBvdGhlclZhbGlkYXRvciB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBTZXQgdGhlIHVwZGF0ZU9uIHByb3BlcnR5IGZvciBhbGwgY29udHJvbHMgaW4gYSBmb3JtIGdyb3VwXG4gKlxuICogVGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQgdG8gc2V0IGEgZGVmYXVsdCB2YWx1ZSBmb3IgZWFjaCBjaGlsZFxuICogY29udHJvbCdzIGB1cGRhdGVPbmAgcHJvcGVydHkuIElmIHlvdSBzZXQgYHVwZGF0ZU9uYCB0byBgJ2JsdXInYCBhdCB0aGVcbiAqIGdyb3VwIGxldmVsLCBhbGwgY2hpbGQgY29udHJvbHMgZGVmYXVsdCB0byAnYmx1cicsIHVubGVzcyB0aGUgY2hpbGRcbiAqIGhhcyBleHBsaWNpdGx5IHNwZWNpZmllZCBhIGRpZmZlcmVudCBgdXBkYXRlT25gIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIG9uZTogbmV3IEZvcm1Db250cm9sKClcbiAqIH0sIHsgdXBkYXRlT246ICdibHVyJyB9KTtcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cCBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbnRyb2xzOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIocGlja1ZhbGlkYXRvcnModmFsaWRhdG9yT3JPcHRzKSwgcGlja0FzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvciwgdmFsaWRhdG9yT3JPcHRzKSk7XG4gICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICB0aGlzLl9zZXRVcENvbnRyb2xzKCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtcbiAgICAgIG9ubHlTZWxmOiB0cnVlLFxuICAgICAgLy8gSWYgYGFzeW5jVmFsaWRhdG9yYCBpcyBwcmVzZW50LCBpdCB3aWxsIHRyaWdnZXIgY29udHJvbCBzdGF0dXMgY2hhbmdlIGZyb20gYFBFTkRJTkdgIHRvXG4gICAgICAvLyBgVkFMSURgIG9yIGBJTlZBTElEYC4gVGhlIHN0YXR1cyBzaG91bGQgYmUgYnJvYWRjYXN0ZWQgdmlhIHRoZSBgc3RhdHVzQ2hhbmdlc2Agb2JzZXJ2YWJsZSxcbiAgICAgIC8vIHNvIHdlIHNldCBgZW1pdEV2ZW50YCB0byBgdHJ1ZWAgdG8gYWxsb3cgdGhhdCBkdXJpbmcgdGhlIGNvbnRyb2wgY3JlYXRpb24gcHJvY2Vzcy5cbiAgICAgIGVtaXRFdmVudDogISF0aGlzLmFzeW5jVmFsaWRhdG9yXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY29udHJvbCB3aXRoIHRoZSBncm91cCdzIGxpc3Qgb2YgY29udHJvbHMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGRvZXMgbm90IHVwZGF0ZSB0aGUgdmFsdWUgb3IgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqIFVzZSB7QGxpbmsgRm9ybUdyb3VwI2FkZENvbnRyb2wgYWRkQ29udHJvbH0gaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZWdpc3RlciBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICovXG4gIHJlZ2lzdGVyQ29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHJldHVybiB0aGlzLmNvbnRyb2xzW25hbWVdO1xuICAgIHRoaXMuY29udHJvbHNbbmFtZV0gPSBjb250cm9sO1xuICAgIGNvbnRyb2wuc2V0UGFyZW50KHRoaXMpO1xuICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgcmV0dXJuIGNvbnRyb2w7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udHJvbCB0byB0aGlzIGdyb3VwLlxuICAgKlxuICAgKiBJZiBhIGNvbnRyb2wgd2l0aCBhIGdpdmVuIG5hbWUgYWxyZWFkeSBleGlzdHMsIGl0IHdvdWxkICpub3QqIGJlIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLlxuICAgKiBJZiB5b3Ugd2FudCB0byByZXBsYWNlIGFuIGV4aXN0aW5nIGNvbnRyb2wsIHVzZSB0aGUge0BsaW5rIEZvcm1Hcm91cCNzZXRDb250cm9sIHNldENvbnRyb2x9XG4gICAqIG1ldGhvZCBpbnN0ZWFkLiBUaGlzIG1ldGhvZCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byBhZGQgdG8gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUdyb3VwIGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhIG5ld1xuICAgKiAgICAgY29udHJvbCBpcyBhZGRlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogYWRkZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIGFkZENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5yZWdpc3RlckNvbnRyb2wobmFtZSwgY29udHJvbCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgY29udHJvbCBmcm9tIHRoaXMgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUdyb3VwIGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhXG4gICAqICAgICBjb250cm9sIGlzIHJlbW92ZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAqIHJlbW92ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2wobmFtZTogc3RyaW5nLCBvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSB0aGlzLmNvbnRyb2xzW25hbWVdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgZGVsZXRlICh0aGlzLmNvbnRyb2xzW25hbWVdKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFuIGV4aXN0aW5nIGNvbnRyb2wuXG4gICAqXG4gICAqIElmIGEgY29udHJvbCB3aXRoIGEgZ2l2ZW4gbmFtZSBkb2VzIG5vdCBleGlzdCBpbiB0aGlzIGBGb3JtR3JvdXBgLCBpdCB3aWxsIGJlIGFkZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlcGxhY2UgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUdyb3VwIGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhblxuICAgKiAgICAgZXhpc3RpbmcgY29udHJvbCBpcyByZXBsYWNlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHNldENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgIGlmIChjb250cm9sKSB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZXJlIGlzIGFuIGVuYWJsZWQgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBuYW1lIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogUmVwb3J0cyBmYWxzZSBmb3IgZGlzYWJsZWQgY29udHJvbHMuIElmIHlvdSdkIGxpa2UgdG8gY2hlY2sgZm9yIGV4aXN0ZW5jZSBpbiB0aGUgZ3JvdXBcbiAgICogb25seSwgdXNlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjZ2V0IGdldH0gaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xOYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gY2hlY2sgZm9yIGV4aXN0ZW5jZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyBmYWxzZSBmb3IgZGlzYWJsZWQgY29udHJvbHMsIHRydWUgb3RoZXJ3aXNlLlxuICAgKi9cbiAgY29udGFpbnMoY29udHJvbE5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmhhc093blByb3BlcnR5KGNvbnRyb2xOYW1lKSAmJiB0aGlzLmNvbnRyb2xzW2NvbnRyb2xOYW1lXS5lbmFibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUdyb3VwYC4gSXQgYWNjZXB0cyBhbiBvYmplY3QgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFNldCB0aGUgY29tcGxldGUgdmFsdWUgZm9yIHRoZSBmb3JtIGdyb3VwXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6IG51bGwsIGxhc3Q6IG51bGx9XG4gICAqXG4gICAqIGZvcm0uc2V0VmFsdWUoe2ZpcnN0OiAnTmFuY3knLCBsYXN0OiAnRHJldyd9KTtcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OiAnRHJldyd9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAdGhyb3dzIFdoZW4gc3RyaWN0IGNoZWNrcyBmYWlsLCBzdWNoIGFzIHNldHRpbmcgdGhlIHZhbHVlIG9mIGEgY29udHJvbFxuICAgKiB0aGF0IGRvZXNuJ3QgZXhpc3Qgb3IgaWYgeW91IGV4Y2x1ZGUgYSB2YWx1ZSBvZiBhIGNvbnRyb2wgdGhhdCBkb2VzIGV4aXN0LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGNvbnRyb2wgdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIG92ZXJyaWRlIHNldFZhbHVlKFxuICAgICAgdmFsdWU6IHtba2V5OiBzdHJpbmddOiBhbnl9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlKTtcbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHRoaXMuX3Rocm93SWZDb250cm9sTWlzc2luZyhuYW1lKTtcbiAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0uc2V0VmFsdWUodmFsdWVbbmFtZV0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggY29udHJvbFxuICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAqIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogSXQgYWNjZXB0cyBib3RoIHN1cGVyLXNldHMgYW5kIHN1Yi1zZXRzIG9mIHRoZSBncm91cCB3aXRob3V0IHRocm93aW5nIGFuIGVycm9yLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUGF0Y2ggdGhlIHZhbHVlIGZvciBhIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiB9KTtcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiBmb3JtLnBhdGNoVmFsdWUoe2ZpcnN0OiAnTmFuY3knfSk7XG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogbnVsbH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgaXMgcGF0Y2hlZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIHRydWUuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlXG4gICAqIGlzIHVwZGF0ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC4gVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvXG4gICAqIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHkgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgb3ZlcnJpZGUgcGF0Y2hWYWx1ZShcbiAgICAgIHZhbHVlOiB7W2tleTogc3RyaW5nXTogYW55fSwgb3B0aW9uczoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIC8vIEV2ZW4gdGhvdWdoIHRoZSBgdmFsdWVgIGFyZ3VtZW50IHR5cGUgZG9lc24ndCBhbGxvdyBgbnVsbGAgYW5kIGB1bmRlZmluZWRgIHZhbHVlcywgdGhlXG4gICAgLy8gYHBhdGNoVmFsdWVgIGNhbiBiZSBjYWxsZWQgcmVjdXJzaXZlbHkgYW5kIGlubmVyIGRhdGEgc3RydWN0dXJlcyBtaWdodCBoYXZlIHRoZXNlIHZhbHVlcywgc29cbiAgICAvLyB3ZSBqdXN0IGlnbm9yZSBzdWNoIGNhc2VzIHdoZW4gYSBmaWVsZCBjb250YWluaW5nIEZvcm1Hcm91cCBpbnN0YW5jZSByZWNlaXZlcyBgbnVsbGAgb3JcbiAgICAvLyBgdW5kZWZpbmVkYCBhcyBhIHZhbHVlLlxuICAgIGlmICh2YWx1ZSA9PSBudWxsIC8qIGJvdGggYG51bGxgIGFuZCBgdW5kZWZpbmVkYCAqLykgcmV0dXJuO1xuXG4gICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzW25hbWVdLnBhdGNoVmFsdWUodmFsdWVbbmFtZV0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGBGb3JtR3JvdXBgLCBtYXJrcyBhbGwgZGVzY2VuZGFudHMgYHByaXN0aW5lYCBhbmQgYHVudG91Y2hlZGAgYW5kIHNldHNcbiAgICogdGhlIHZhbHVlIG9mIGFsbCBkZXNjZW5kYW50cyB0byBudWxsLlxuICAgKlxuICAgKiBZb3UgcmVzZXQgdG8gYSBzcGVjaWZpYyBmb3JtIHN0YXRlIGJ5IHBhc3NpbmcgaW4gYSBtYXAgb2Ygc3RhdGVzXG4gICAqIHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHlvdXIgZm9ybSwgd2l0aCBjb250cm9sIG5hbWVzIGFzIGtleXMuIFRoZSBzdGF0ZVxuICAgKiBpcyBhIHN0YW5kYWxvbmUgdmFsdWUgb3IgYSBmb3JtIHN0YXRlIG9iamVjdCB3aXRoIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZFxuICAgKiBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBSZXNldHMgdGhlIGNvbnRyb2wgd2l0aCBhbiBpbml0aWFsIHZhbHVlLFxuICAgKiBvciBhbiBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSBpbml0aWFsIHZhbHVlIGFuZCBkaXNhYmxlZCBzdGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aGVuIHRoZSBncm91cCBpcyByZXNldC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7Zmlyc3Q6ICdmaXJzdCBuYW1lJywgbGFzdDogJ2xhc3QgbmFtZSd9XG4gICAqXG4gICAqIGZvcm0ucmVzZXQoeyBmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJyB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7Zmlyc3Q6ICduYW1lJywgbGFzdDogJ2xhc3QgbmFtZSd9XG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzIGFuZCBkaXNhYmxlZCBzdGF0dXNcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgKiB9KTtcbiAgICpcbiAgICogZm9ybS5yZXNldCh7XG4gICAqICAgZmlyc3Q6IHt2YWx1ZTogJ25hbWUnLCBkaXNhYmxlZDogdHJ1ZX0sXG4gICAqICAgbGFzdDogJ2xhc3QnXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtsYXN0OiAnbGFzdCd9XG4gICAqIGNvbnNvbGUubG9nKGZvcm0uZ2V0KCdmaXJzdCcpLnN0YXR1cyk7ICAvLyAnRElTQUJMRUQnXG4gICAqIGBgYFxuICAgKi9cbiAgb3ZlcnJpZGUgcmVzZXQodmFsdWU6IGFueSA9IHt9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgY29udHJvbC5yZXNldCh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFJldHJpZXZlcyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKiBUaGUgYHZhbHVlYCBwcm9wZXJ0eSBpcyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgZ3JvdXAsIGJlY2F1c2VcbiAgICogaXQgZXhjbHVkZXMgZGlzYWJsZWQgY29udHJvbHMgaW4gdGhlIGBGb3JtR3JvdXBgLlxuICAgKi9cbiAgZ2V0UmF3VmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oXG4gICAgICAgIHt9LCAoYWNjOiB7W2s6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0sIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgYWNjW25hbWVdID0gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sID8gY29udHJvbC52YWx1ZSA6ICg8YW55PmNvbnRyb2wpLmdldFJhd1ZhbHVlKCk7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW4ge1xuICAgIGxldCBzdWJ0cmVlVXBkYXRlZCA9IHRoaXMuX3JlZHVjZUNoaWxkcmVuKGZhbHNlLCAodXBkYXRlZDogYm9vbGVhbiwgY2hpbGQ6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCkgPyB0cnVlIDogdXBkYXRlZDtcbiAgICB9KTtcbiAgICBpZiAoc3VidHJlZVVwZGF0ZWQpIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWV9KTtcbiAgICByZXR1cm4gc3VidHJlZVVwZGF0ZWQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF90aHJvd0lmQ29udHJvbE1pc3NpbmcobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgIFRoZXJlIGFyZSBubyBmb3JtIGNvbnRyb2xzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGdyb3VwIHlldC4gSWYgeW91J3JlIHVzaW5nIG5nTW9kZWwsXG4gICAgICAgIHlvdSBtYXkgd2FudCB0byBjaGVjayBuZXh0IHRpY2sgKGUuZy4gdXNlIHNldFRpbWVvdXQpLlxuICAgICAgYCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5jb250cm9sc1tuYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBmb3JtIGNvbnRyb2wgd2l0aCBuYW1lOiAke25hbWV9LmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2ZvckVhY2hDaGlsZChjYjogKHY6IGFueSwgazogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb250cm9scykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgLy8gVGhlIGxpc3Qgb2YgY29udHJvbHMgY2FuIGNoYW5nZSAoZm9yIGV4LiBjb250cm9scyBtaWdodCBiZSByZW1vdmVkKSB3aGlsZSB0aGUgbG9vcFxuICAgICAgLy8gaXMgcnVubmluZyAoYXMgYSByZXN1bHQgb2YgaW52b2tpbmcgRm9ybXMgQVBJIGluIGB2YWx1ZUNoYW5nZXNgIHN1YnNjcmlwdGlvbiksIHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIG51bGwgY2hlY2sgYmVmb3JlIGludm9raW5nIHRoZSBjYWxsYmFjay5cbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2xzW2tleV07XG4gICAgICBjb250cm9sICYmIGNiKGNvbnRyb2wsIGtleSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcENvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcmVkdWNlVmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY29udHJvbE5hbWUgb2YgT2JqZWN0LmtleXModGhpcy5jb250cm9scykpIHtcbiAgICAgIGNvbnN0IGNvbnRyb2wgPSB0aGlzLmNvbnRyb2xzW2NvbnRyb2xOYW1lXTtcbiAgICAgIGlmICh0aGlzLmNvbnRhaW5zKGNvbnRyb2xOYW1lKSAmJiBjb25kaXRpb24oY29udHJvbCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbihcbiAgICAgICAge30sIChhY2M6IHtbazogc3RyaW5nXTogYW55fSwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpOiBhbnkgPT4ge1xuICAgICAgICAgIGlmIChjb250cm9sLmVuYWJsZWQgfHwgdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgYWNjW25hbWVdID0gY29udHJvbC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDaGlsZHJlbjxUPihpbml0VmFsdWU6IFQsIGZuOiAoYWNjOiBULCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4gVCk6IFQge1xuICAgIGxldCByZXMgPSBpbml0VmFsdWU7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgcmVzID0gZm4ocmVzLCBjb250cm9sLCBuYW1lKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNvbnRyb2xOYW1lIG9mIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpKSB7XG4gICAgICBpZiAodGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jaGVja0FsbFZhbHVlc1ByZXNlbnQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmICh2YWx1ZVtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTXVzdCBzdXBwbHkgYSB2YWx1ZSBmb3IgZm9ybSBjb250cm9sIHdpdGggbmFtZTogJyR7bmFtZX0nLmApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdGUgb2YgYW4gYXJyYXkgb2YgYEZvcm1Db250cm9sYCxcbiAqIGBGb3JtR3JvdXBgIG9yIGBGb3JtQXJyYXlgIGluc3RhbmNlcy5cbiAqXG4gKiBBIGBGb3JtQXJyYXlgIGFnZ3JlZ2F0ZXMgdGhlIHZhbHVlcyBvZiBlYWNoIGNoaWxkIGBGb3JtQ29udHJvbGAgaW50byBhbiBhcnJheS5cbiAqIEl0IGNhbGN1bGF0ZXMgaXRzIHN0YXR1cyBieSByZWR1Y2luZyB0aGUgc3RhdHVzIHZhbHVlcyBvZiBpdHMgY2hpbGRyZW4uIEZvciBleGFtcGxlLCBpZiBvbmUgb2ZcbiAqIHRoZSBjb250cm9scyBpbiBhIGBGb3JtQXJyYXlgIGlzIGludmFsaWQsIHRoZSBlbnRpcmUgYXJyYXkgYmVjb21lcyBpbnZhbGlkLlxuICpcbiAqIGBGb3JtQXJyYXlgIGlzIG9uZSBvZiB0aGUgdGhyZWUgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIHVzZWQgdG8gZGVmaW5lIGZvcm1zIGluIEFuZ3VsYXIsXG4gKiBhbG9uZyB3aXRoIGBGb3JtQ29udHJvbGAgYW5kIGBGb3JtR3JvdXBgLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENyZWF0ZSBhbiBhcnJheSBvZiBmb3JtIGNvbnRyb2xzXG4gKlxuICogYGBgXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgbmV3IEZvcm1Db250cm9sKCdOYW5jeScsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiBdKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gKiBjb25zb2xlLmxvZyhhcnIuc3RhdHVzKTsgIC8vICdWQUxJRCdcbiAqIGBgYFxuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGFycmF5IHdpdGggYXJyYXktbGV2ZWwgdmFsaWRhdG9yc1xuICpcbiAqIFlvdSBpbmNsdWRlIGFycmF5LWxldmVsIHZhbGlkYXRvcnMgYW5kIGFzeW5jIHZhbGlkYXRvcnMuIFRoZXNlIGNvbWUgaW4gaGFuZHlcbiAqIHdoZW4geW91IHdhbnQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uIHRoYXQgY29uc2lkZXJzIHRoZSB2YWx1ZSBvZiBtb3JlIHRoYW4gb25lIGNoaWxkXG4gKiBjb250cm9sLlxuICpcbiAqIFRoZSB0d28gdHlwZXMgb2YgdmFsaWRhdG9ycyBhcmUgcGFzc2VkIGluIHNlcGFyYXRlbHkgYXMgdGhlIHNlY29uZCBhbmQgdGhpcmQgYXJnXG4gKiByZXNwZWN0aXZlbHksIG9yIHRvZ2V0aGVyIGFzIHBhcnQgb2YgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgbmV3IEZvcm1Db250cm9sKCdOYW5jeScpLFxuICogICBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnKVxuICogXSwge3ZhbGlkYXRvcnM6IG15VmFsaWRhdG9yLCBhc3luY1ZhbGlkYXRvcnM6IG15QXN5bmNWYWxpZGF0b3J9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBTZXQgdGhlIHVwZGF0ZU9uIHByb3BlcnR5IGZvciBhbGwgY29udHJvbHMgaW4gYSBmb3JtIGFycmF5XG4gKlxuICogVGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQgdG8gc2V0IGEgZGVmYXVsdCB2YWx1ZSBmb3IgZWFjaCBjaGlsZFxuICogY29udHJvbCdzIGB1cGRhdGVPbmAgcHJvcGVydHkuIElmIHlvdSBzZXQgYHVwZGF0ZU9uYCB0byBgJ2JsdXInYCBhdCB0aGVcbiAqIGFycmF5IGxldmVsLCBhbGwgY2hpbGQgY29udHJvbHMgZGVmYXVsdCB0byAnYmx1cicsIHVubGVzcyB0aGUgY2hpbGRcbiAqIGhhcyBleHBsaWNpdGx5IHNwZWNpZmllZCBhIGRpZmZlcmVudCBgdXBkYXRlT25gIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gKiBdLCB7dXBkYXRlT246ICdibHVyJ30pO1xuICogYGBgXG4gKlxuICogIyMjIEFkZGluZyBvciByZW1vdmluZyBjb250cm9scyBmcm9tIGEgZm9ybSBhcnJheVxuICpcbiAqIFRvIGNoYW5nZSB0aGUgY29udHJvbHMgaW4gdGhlIGFycmF5LCB1c2UgdGhlIGBwdXNoYCwgYGluc2VydGAsIGByZW1vdmVBdGAgb3IgYGNsZWFyYCBtZXRob2RzXG4gKiBpbiBgRm9ybUFycmF5YCBpdHNlbGYuIFRoZXNlIG1ldGhvZHMgZW5zdXJlIHRoZSBjb250cm9scyBhcmUgcHJvcGVybHkgdHJhY2tlZCBpbiB0aGVcbiAqIGZvcm0ncyBoaWVyYXJjaHkuIERvIG5vdCBtb2RpZnkgdGhlIGFycmF5IG9mIGBBYnN0cmFjdENvbnRyb2xgcyB1c2VkIHRvIGluc3RhbnRpYXRlXG4gKiB0aGUgYEZvcm1BcnJheWAgZGlyZWN0bHksIGFzIHRoYXQgcmVzdWx0IGluIHN0cmFuZ2UgYW5kIHVuZXhwZWN0ZWQgYmVoYXZpb3Igc3VjaFxuICogYXMgYnJva2VuIGNoYW5nZSBkZXRlY3Rpb24uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybUFycmF5IGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1BcnJheWAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBbiBhcnJheSBvZiBjaGlsZCBjb250cm9scy4gRWFjaCBjaGlsZCBjb250cm9sIGlzIGdpdmVuIGFuIGluZGV4XG4gICAqIHdoZXJlIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbnRyb2xzOiBBYnN0cmFjdENvbnRyb2xbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIocGlja1ZhbGlkYXRvcnModmFsaWRhdG9yT3JPcHRzKSwgcGlja0FzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvciwgdmFsaWRhdG9yT3JPcHRzKSk7XG4gICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICB0aGlzLl9zZXRVcENvbnRyb2xzKCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtcbiAgICAgIG9ubHlTZWxmOiB0cnVlLFxuICAgICAgLy8gSWYgYGFzeW5jVmFsaWRhdG9yYCBpcyBwcmVzZW50LCBpdCB3aWxsIHRyaWdnZXIgY29udHJvbCBzdGF0dXMgY2hhbmdlIGZyb20gYFBFTkRJTkdgIHRvXG4gICAgICAvLyBgVkFMSURgIG9yIGBJTlZBTElEYC5cbiAgICAgIC8vIFRoZSBzdGF0dXMgc2hvdWxkIGJlIGJyb2FkY2FzdGVkIHZpYSB0aGUgYHN0YXR1c0NoYW5nZXNgIG9ic2VydmFibGUsIHNvIHdlIHNldCBgZW1pdEV2ZW50YFxuICAgICAgLy8gdG8gYHRydWVgIHRvIGFsbG93IHRoYXQgZHVyaW5nIHRoZSBjb250cm9sIGNyZWF0aW9uIHByb2Nlc3MuXG4gICAgICBlbWl0RXZlbnQ6ICEhdGhpcy5hc3luY1ZhbGlkYXRvclxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJldHJpZXZlIHRoZSBjb250cm9sXG4gICAqL1xuICBhdChpbmRleDogbnVtYmVyKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sc1tpbmRleF07XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IGEgbmV3IGBBYnN0cmFjdENvbnRyb2xgIGF0IHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgdG8gYmUgaW5zZXJ0ZWRcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAqICAgICBjb250cm9sIGlzIGFkZGVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiBpbnNlcnRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgcHVzaChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5jb250cm9scy5wdXNoKGNvbnRyb2wpO1xuICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIGluc2VydCB0aGUgY29udHJvbFxuICAgKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgdG8gYmUgaW5zZXJ0ZWRcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAqICAgICBjb250cm9sIGlzIGluc2VydGVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiBpbnNlcnRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgaW5zZXJ0KGluZGV4OiBudW1iZXIsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMCwgY29udHJvbCk7XG5cbiAgICB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjb250cm9sIGF0IHRoZSBnaXZlbiBgaW5kZXhgIGluIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZW1vdmUgdGhlIGNvbnRyb2xcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFcbiAgICogICAgIGNvbnRyb2wgaXMgcmVtb3ZlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogcmVtb3ZlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgcmVtb3ZlQXQoaW5kZXg6IG51bWJlciwgb3B0aW9uczoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tpbmRleF0pIHRoaXMuY29udHJvbHNbaW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgdGhpcy5jb250cm9scy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZXBsYWNlIHRoZSBjb250cm9sXG4gICAqIEBwYXJhbSBjb250cm9sIFRoZSBgQWJzdHJhY3RDb250cm9sYCBjb250cm9sIHRvIHJlcGxhY2UgdGhlIGV4aXN0aW5nIGNvbnRyb2xcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFuXG4gICAqICAgICBleGlzdGluZyBjb250cm9sIGlzIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgc2V0Q29udHJvbChpbmRleDogbnVtYmVyLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbaW5kZXhdKSB0aGlzLmNvbnRyb2xzW2luZGV4XS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIGlmIChjb250cm9sKSB7XG4gICAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMCwgY29udHJvbCk7XG4gICAgICB0aGlzLl9yZWdpc3RlckNvbnRyb2woY29udHJvbCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogTGVuZ3RoIG9mIHRoZSBjb250cm9sIGFycmF5LlxuICAgKi9cbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHN0cmljdCBjaGVja3MsIGFuZCB0aHJvd3MgYW4gZXJyb3IgaWYgeW91IHRyeVxuICAgKiB0byBzZXQgdGhlIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXNuJ3QgZXhpc3Qgb3IgaWYgeW91IGV4Y2x1ZGUgdGhlXG4gICAqIHZhbHVlIG9mIGEgY29udHJvbC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFNldCB0aGUgdmFsdWVzIGZvciB0aGUgY29udHJvbHMgaW4gdGhlIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFtudWxsLCBudWxsXVxuICAgKlxuICAgKiBhcnIuc2V0VmFsdWUoWydOYW5jeScsICdEcmV3J10pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0VmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlKTtcbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICB0aGlzLl90aHJvd0lmQ29udHJvbE1pc3NpbmcoaW5kZXgpO1xuICAgICAgdGhpcy5hdChpbmRleCkuc2V0VmFsdWUobmV3VmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzIHRoZVxuICAgKiBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wsIGFuZCBkb2VzIGl0cyBiZXN0IHRvIG1hdGNoIHRoZSB2YWx1ZXMgdG8gdGhlIGNvcnJlY3RcbiAgICogY29udHJvbHMgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBJdCBhY2NlcHRzIGJvdGggc3VwZXItc2V0cyBhbmQgc3ViLXNldHMgb2YgdGhlIGFycmF5IHdpdGhvdXQgdGhyb3dpbmcgYW4gZXJyb3IuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBQYXRjaCB0aGUgdmFsdWVzIGZvciBjb250cm9scyBpbiBhIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gW251bGwsIG51bGxdXG4gICAqXG4gICAqIGFyci5wYXRjaFZhbHVlKFsnTmFuY3knXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsIG51bGxdXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgbGF0ZXN0IHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlc1xuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0XG4gICAqIGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZVxuICAgKiBpcyB1cGRhdGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0b1xuICAgKiB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5IHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIG92ZXJyaWRlIHBhdGNoVmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgLy8gRXZlbiB0aG91Z2ggdGhlIGB2YWx1ZWAgYXJndW1lbnQgdHlwZSBkb2Vzbid0IGFsbG93IGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLCB0aGVcbiAgICAvLyBgcGF0Y2hWYWx1ZWAgY2FuIGJlIGNhbGxlZCByZWN1cnNpdmVseSBhbmQgaW5uZXIgZGF0YSBzdHJ1Y3R1cmVzIG1pZ2h0IGhhdmUgdGhlc2UgdmFsdWVzLCBzb1xuICAgIC8vIHdlIGp1c3QgaWdub3JlIHN1Y2ggY2FzZXMgd2hlbiBhIGZpZWxkIGNvbnRhaW5pbmcgRm9ybUFycmF5IGluc3RhbmNlIHJlY2VpdmVzIGBudWxsYCBvclxuICAgIC8vIGB1bmRlZmluZWRgIGFzIGEgdmFsdWUuXG4gICAgaWYgKHZhbHVlID09IG51bGwgLyogYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgICovKSByZXR1cm47XG5cbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5hdChpbmRleCkpIHtcbiAgICAgICAgdGhpcy5hdChpbmRleCkucGF0Y2hWYWx1ZShuZXdWYWx1ZSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYEZvcm1BcnJheWAgYW5kIGFsbCBkZXNjZW5kYW50cyBhcmUgbWFya2VkIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgLCBhbmQgdGhlXG4gICAqIHZhbHVlIG9mIGFsbCBkZXNjZW5kYW50cyB0byBudWxsIG9yIG51bGwgbWFwcy5cbiAgICpcbiAgICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIGluIGFuIGFycmF5IG9mIHN0YXRlc1xuICAgKiB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbC4gVGhlIHN0YXRlIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZVxuICAgKiBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJlc2V0IHRoZSB2YWx1ZXMgaW4gYSBmb3JtIGFycmF5XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGFyci5yZXNldChbJ25hbWUnLCAnbGFzdCBuYW1lJ10pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgLy8gWyduYW1lJywgJ2xhc3QgbmFtZSddXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgYW5kIHRoZSBkaXNhYmxlZCBzdGF0dXMgZm9yIHRoZSBmaXJzdCBjb250cm9sXG4gICAqXG4gICAqIGBgYFxuICAgKiBhcnIucmVzZXQoW1xuICAgKiAgIHt2YWx1ZTogJ25hbWUnLCBkaXNhYmxlZDogdHJ1ZX0sXG4gICAqICAgJ2xhc3QnXG4gICAqIF0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgLy8gWydsYXN0J11cbiAgICogY29uc29sZS5sb2coYXJyLmF0KDApLnN0YXR1cyk7ICAvLyAnRElTQUJMRUQnXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIG92ZXJyaWRlIHJlc2V0KHZhbHVlOiBhbnkgPSBbXSwgb3B0aW9uczoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBjb250cm9sLnJlc2V0KHZhbHVlW2luZGV4XSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYXJyYXksIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFJlcG9ydHMgYWxsIHZhbHVlcyByZWdhcmRsZXNzIG9mIGRpc2FibGVkIHN0YXR1cy5cbiAgICogRm9yIGVuYWJsZWQgY29udHJvbHMgb25seSwgdGhlIGB2YWx1ZWAgcHJvcGVydHkgaXMgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgdmFsdWUgb2YgdGhlIGFycmF5LlxuICAgKi9cbiAgZ2V0UmF3VmFsdWUoKTogYW55W10ge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLm1hcCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICByZXR1cm4gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sID8gY29udHJvbC52YWx1ZSA6ICg8YW55PmNvbnRyb2wpLmdldFJhd1ZhbHVlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBjb250cm9scyBpbiB0aGUgYEZvcm1BcnJheWAuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUFycmF5IGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhbGxcbiAgICogICAgIGNvbnRyb2xzIGFyZSByZW1vdmVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiBhbGwgY29udHJvbHNcbiAgICogaW4gdGhpcyBGb3JtQXJyYXkgaW5zdGFuY2UgYXJlIHJlbW92ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJlbW92ZSBhbGwgZWxlbWVudHMgZnJvbSBhIEZvcm1BcnJheVxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIubGVuZ3RoKTsgIC8vIDJcbiAgICpcbiAgICogYXJyLmNsZWFyKCk7XG4gICAqIGNvbnNvbGUubG9nKGFyci5sZW5ndGgpOyAgLy8gMFxuICAgKiBgYGBcbiAgICpcbiAgICogSXQncyBhIHNpbXBsZXIgYW5kIG1vcmUgZWZmaWNpZW50IGFsdGVybmF0aXZlIHRvIHJlbW92aW5nIGFsbCBlbGVtZW50cyBvbmUgYnkgb25lOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKlxuICAgKiB3aGlsZSAoYXJyLmxlbmd0aCkge1xuICAgKiAgICBhcnIucmVtb3ZlQXQoMCk7XG4gICAqIH1cbiAgICogYGBgXG4gICAqL1xuICBjbGVhcihvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pKTtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZSgwKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5jb250cm9scy5yZWR1Y2UoKHVwZGF0ZWQ6IGJvb2xlYW4sIGNoaWxkOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlmIChzdWJ0cmVlVXBkYXRlZCkgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rocm93SWZDb250cm9sTWlzc2luZyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgVGhlcmUgYXJlIG5vIGZvcm0gY29udHJvbHMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgYXJyYXkgeWV0LiBJZiB5b3UncmUgdXNpbmcgbmdNb2RlbCxcbiAgICAgICAgeW91IG1heSB3YW50IHRvIGNoZWNrIG5leHQgdGljayAoZS5nLiB1c2Ugc2V0VGltZW91dCkuXG4gICAgICBgKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmF0KGluZGV4KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZmluZCBmb3JtIGNvbnRyb2wgYXQgaW5kZXggJHtpbmRleH1gKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9mb3JFYWNoQ2hpbGQoY2I6IChjOiBBYnN0cmFjdENvbnRyb2wsIGluZGV4OiBudW1iZXIpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2xzLmZvckVhY2goKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgY2IoY29udHJvbCwgaW5kZXgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfdXBkYXRlVmFsdWUoKTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ZhbHVlOiBhbnl9KS52YWx1ZSA9XG4gICAgICAgIHRoaXMuY29udHJvbHMuZmlsdGVyKChjb250cm9sKSA9PiBjb250cm9sLmVuYWJsZWQgfHwgdGhpcy5kaXNhYmxlZClcbiAgICAgICAgICAgIC5tYXAoKGNvbnRyb2wpID0+IGNvbnRyb2wudmFsdWUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfYW55Q29udHJvbHMoY29uZGl0aW9uOiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMuc29tZSgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLmVuYWJsZWQgJiYgY29uZGl0aW9uKGNvbnRyb2wpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwQ29udHJvbHMoKTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jaGVja0FsbFZhbHVlc1ByZXNlbnQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpOiBudW1iZXIpID0+IHtcbiAgICAgIGlmICh2YWx1ZVtpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTXVzdCBzdXBwbHkgYSB2YWx1ZSBmb3IgZm9ybSBjb250cm9sIGF0IGluZGV4OiAke2l9LmApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xuICAgICAgaWYgKGNvbnRyb2wuZW5hYmxlZCkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3RlckNvbnRyb2woY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgfVxufVxuIl19