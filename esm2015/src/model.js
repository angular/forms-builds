/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/model.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter } from '@angular/core';
import { composeAsyncValidators, composeValidators } from './directives/shared';
import { toObservable } from './validators';
/**
 * Reports that a FormControl is valid, meaning that no errors exist in the input value.
 *
 * @see `status`
 * @type {?}
 */
export const VALID = 'VALID';
/**
 * Reports that a FormControl is invalid, meaning that an error exists in the input value.
 *
 * @see `status`
 * @type {?}
 */
export const INVALID = 'INVALID';
/**
 * Reports that a FormControl is pending, meaning that that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * @see `markAsPending`
 * @see `status`
 * @type {?}
 */
export const PENDING = 'PENDING';
/**
 * Reports that a FormControl is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see `markAsDisabled`
 * @see `status`
 * @type {?}
 */
export const DISABLED = 'DISABLED';
/**
 * @param {?} control
 * @param {?} path
 * @param {?} delimiter
 * @return {?}
 */
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
    /** @type {?} */
    let controlToFind = control;
    path.forEach((/**
     * @param {?} name
     * @return {?}
     */
    (name) => {
        if (controlToFind instanceof FormGroup) {
            controlToFind = controlToFind.controls.hasOwnProperty((/** @type {?} */ (name))) ?
                controlToFind.controls[name] :
                null;
        }
        else if (controlToFind instanceof FormArray) {
            controlToFind = controlToFind.at((/** @type {?} */ (name))) || null;
        }
        else {
            controlToFind = null;
        }
    }));
    return controlToFind;
}
/**
 * @param {?=} validatorOrOpts
 * @return {?}
 */
function coerceToValidator(validatorOrOpts) {
    /** @type {?} */
    const validator = (/** @type {?} */ ((isOptionsObj(validatorOrOpts) ? ((/** @type {?} */ (validatorOrOpts))).validators :
        validatorOrOpts)));
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
/**
 * @param {?=} asyncValidator
 * @param {?=} validatorOrOpts
 * @return {?}
 */
function coerceToAsyncValidator(asyncValidator, validatorOrOpts) {
    /** @type {?} */
    const origAsyncValidator = (/** @type {?} */ ((isOptionsObj(validatorOrOpts) ? ((/** @type {?} */ (validatorOrOpts))).asyncValidators :
        asyncValidator)));
    return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) :
        origAsyncValidator || null;
}
/**
 * Interface for options provided to an `AbstractControl`.
 *
 * \@publicApi
 * @record
 */
export function AbstractControlOptions() { }
if (false) {
    /**
     * \@description
     * The list of validators applied to a control.
     * @type {?|undefined}
     */
    AbstractControlOptions.prototype.validators;
    /**
     * \@description
     * The list of async validators applied to control.
     * @type {?|undefined}
     */
    AbstractControlOptions.prototype.asyncValidators;
    /**
     * \@description
     * The event name for control to update upon.
     * @type {?|undefined}
     */
    AbstractControlOptions.prototype.updateOn;
}
/**
 * @param {?=} validatorOrOpts
 * @return {?}
 */
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
 * \@publicApi
 * @abstract
 */
export class AbstractControl {
    /**
     * Initialize the AbstractControl instance.
     *
     * @param {?} validator The function that determines the synchronous validity of this control.
     * @param {?} asyncValidator The function that determines the asynchronous validity of this
     * control.
     */
    constructor(validator, asyncValidator) {
        this.validator = validator;
        this.asyncValidator = asyncValidator;
        /**
         * \@internal
         */
        this._onCollectionChange = (/**
         * @return {?}
         */
        () => { });
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * @return True if the user has not yet changed the value in the UI; compare `dirty`.
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
         * \@internal
         */
        this._onDisabledChange = [];
    }
    /**
     * The parent control.
     * @return {?}
     */
    get parent() {
        return this._parent;
    }
    /**
     * A control is `valid` when its `status` is `VALID`.
     *
     * @see {\@link AbstractControl.status}
     *
     * @return {?} True if the control has passed all of its validation tests,
     * false otherwise.
     */
    get valid() {
        return this.status === VALID;
    }
    /**
     * A control is `invalid` when its `status` is `INVALID`.
     *
     * @see {\@link AbstractControl.status}
     *
     * @return {?} True if this control has failed one or more of its validation checks,
     * false otherwise.
     */
    get invalid() {
        return this.status === INVALID;
    }
    /**
     * A control is `pending` when its `status` is `PENDING`.
     *
     * @see {\@link AbstractControl.status}
     *
     * @return {?} True if this control is in the process of conducting a validation check,
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
     * @see {\@link AbstractControl.status}
     *
     * @return {?} True if the control is disabled, false otherwise.
     */
    get disabled() {
        return this.status === DISABLED;
    }
    /**
     * A control is `enabled` as long as its `status` is not `DISABLED`.
     *
     * @see {\@link AbstractControl.status}
     *
     * @return {?} True if the control has any status other than 'DISABLED',
     * false if the status is 'DISABLED'.
     *
     */
    get enabled() {
        return this.status !== DISABLED;
    }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * @return {?} True if the user has changed the value of this control in the UI; compare `pristine`.
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
     * @return {?}
     */
    get untouched() {
        return !this.touched;
    }
    /**
     * Reports the update strategy of the `AbstractControl` (meaning
     * the event on which the control updates itself).
     * Possible values: `'change'` | `'blur'` | `'submit'`
     * Default value: `'change'`
     * @return {?}
     */
    get updateOn() {
        return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
    }
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this overwrites any existing sync validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * @param {?} newValidator
     * @return {?}
     */
    setValidators(newValidator) {
        this.validator = coerceToValidator(newValidator);
    }
    /**
     * Sets the async validators that are active on this control. Calling this
     * overwrites any existing async validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * @param {?} newValidator
     * @return {?}
     */
    setAsyncValidators(newValidator) {
        this.asyncValidator = coerceToAsyncValidator(newValidator);
    }
    /**
     * Empties out the sync validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     * @return {?}
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
     * @return {?}
     */
    clearAsyncValidators() {
        this.asyncValidator = null;
    }
    /**
     * Marks the control as `touched`. A control is touched by focus and
     * blur events that do not change the value.
     *
     * @see `markAsUntouched()` / `markAsDirty()` / `markAsPristine()`
     *
     * @param {?=} opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * @return {?}
     */
    markAsTouched(opts = {}) {
        ((/** @type {?} */ (this))).touched = true;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched(opts);
        }
    }
    /**
     * Marks the control and all its descendant controls as `touched`.
     * @see `markAsTouched()`
     * @return {?}
     */
    markAllAsTouched() {
        this.markAsTouched({ onlySelf: true });
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => control.markAllAsTouched()));
    }
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     * @see `markAsTouched()` / `markAsDirty()` / `markAsPristine()`
     *
     * @param {?=} opts Configuration options that determine how the control propagates changes
     * and emits events after the marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * @return {?}
     */
    markAsUntouched(opts = {}) {
        ((/** @type {?} */ (this))).touched = false;
        this._pendingTouched = false;
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            control.markAsUntouched({ onlySelf: true });
        }));
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /**
     * Marks the control as `dirty`. A control becomes dirty when
     * the control's value is changed through the UI; compare `markAsTouched`.
     *
     * @see `markAsTouched()` / `markAsUntouched()` / `markAsPristine()`
     *
     * @param {?=} opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * @return {?}
     */
    markAsDirty(opts = {}) {
        ((/** @type {?} */ (this))).pristine = false;
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
     * @see `markAsTouched()` / `markAsUntouched()` / `markAsDirty()`
     *
     * @param {?=} opts Configuration options that determine how the control emits events after
     * marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * @return {?}
     */
    markAsPristine(opts = {}) {
        ((/** @type {?} */ (this))).pristine = true;
        this._pendingDirty = false;
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            control.markAsPristine({ onlySelf: true });
        }));
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /**
     * Marks the control as `pending`.
     *
     * A control is pending while the control performs async validation.
     *
     * @see {\@link AbstractControl.status}
     *
     * @param {?=} opts Configuration options that determine how the control propagates changes and
     * emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event with the latest status the control is marked pending.
     * When false, no events are emitted.
     *
     * @return {?}
     */
    markAsPending(opts = {}) {
        ((/** @type {?} */ (this))).status = PENDING;
        if (opts.emitEvent !== false) {
            ((/** @type {?} */ (this.statusChanges))).emit(this.status);
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
     * @see {\@link AbstractControl.status}
     *
     * @param {?=} opts Configuration options that determine how the control propagates
     * changes and emits events after the control is disabled.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is disabled.
     * When false, no events are emitted.
     * @return {?}
     */
    disable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        /** @type {?} */
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        ((/** @type {?} */ (this))).status = DISABLED;
        ((/** @type {?} */ (this))).errors = null;
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            control.disable(Object.assign(Object.assign({}, opts), { onlySelf: true }));
        }));
        this._updateValue();
        if (opts.emitEvent !== false) {
            ((/** @type {?} */ (this.valueChanges))).emit(this.value);
            ((/** @type {?} */ (this.statusChanges))).emit(this.status);
        }
        this._updateAncestors(Object.assign(Object.assign({}, opts), { skipPristineCheck }));
        this._onDisabledChange.forEach((/**
         * @param {?} changeFn
         * @return {?}
         */
        (changeFn) => changeFn(true)));
    }
    /**
     * Enables the control. This means the control is included in validation checks and
     * the aggregate value of its parent. Its status recalculates based on its value and
     * its validators.
     *
     * By default, if the control has children, all children are enabled.
     *
     * @see {\@link AbstractControl.status}
     *
     * @param {?=} opts Configure options that control how the control propagates changes and
     * emits events when marked as untouched
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     * @return {?}
     */
    enable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        /** @type {?} */
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        ((/** @type {?} */ (this))).status = VALID;
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            control.enable(Object.assign(Object.assign({}, opts), { onlySelf: true }));
        }));
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors(Object.assign(Object.assign({}, opts), { skipPristineCheck }));
        this._onDisabledChange.forEach((/**
         * @param {?} changeFn
         * @return {?}
         */
        (changeFn) => changeFn(false)));
    }
    /**
     * @private
     * @param {?} opts
     * @return {?}
     */
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
     * @param {?} parent Sets the parent of the control
     * @return {?}
     */
    setParent(parent) {
        this._parent = parent;
    }
    /**
     * Recalculates the value and validation status of the control.
     *
     * By default, it also updates the value and validity of its ancestors.
     *
     * @param {?=} opts Configuration options determine how the control propagates changes and emits events
     * after updates and validity checks are applied.
     * * `onlySelf`: When true, only update this control. When false or not supplied,
     * update all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is updated.
     * When false, no events are emitted.
     * @return {?}
     */
    updateValueAndValidity(opts = {}) {
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._cancelExistingSubscription();
            ((/** @type {?} */ (this))).errors = this._runValidator();
            ((/** @type {?} */ (this))).status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                this._runAsyncValidator(opts.emitEvent);
            }
        }
        if (opts.emitEvent !== false) {
            ((/** @type {?} */ (this.valueChanges))).emit(this.value);
            ((/** @type {?} */ (this.statusChanges))).emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
        }
    }
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    _updateTreeValidity(opts = { emitEvent: true }) {
        this._forEachChild((/**
         * @param {?} ctrl
         * @return {?}
         */
        (ctrl) => ctrl._updateTreeValidity(opts)));
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
    }
    /**
     * @private
     * @return {?}
     */
    _setInitialStatus() {
        ((/** @type {?} */ (this))).status = this._allControlsDisabled() ? DISABLED : VALID;
    }
    /**
     * @private
     * @return {?}
     */
    _runValidator() {
        return this.validator ? this.validator(this) : null;
    }
    /**
     * @private
     * @param {?=} emitEvent
     * @return {?}
     */
    _runAsyncValidator(emitEvent) {
        if (this.asyncValidator) {
            ((/** @type {?} */ (this))).status = PENDING;
            /** @type {?} */
            const obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription =
                obs.subscribe((/**
                 * @param {?} errors
                 * @return {?}
                 */
                (errors) => this.setErrors(errors, { emitEvent })));
        }
    }
    /**
     * @private
     * @return {?}
     */
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
        }
    }
    /**
     * Sets errors on a form control when running validations manually, rather than automatically.
     *
     * Calling `setErrors` also updates the validity of the parent control.
     *
     * \@usageNotes
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
     * @param {?} errors
     * @param {?=} opts
     * @return {?}
     */
    setErrors(errors, opts = {}) {
        ((/** @type {?} */ (this))).errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false);
    }
    /**
     * Retrieves a child control given the control's name or path.
     *
     * \@usageNotes
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     * @param {?} path A dot-delimited string or array of string/number values that define the path to the
     * control.
     *
     * @return {?}
     */
    get(path) {
        return _find(this, path, '.');
    }
    /**
     * \@description
     * Reports error data for the control with the given path.
     *
     * \@usageNotes
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
     * @param {?} errorCode The code of the error to check
     * @param {?=} path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @return {?} error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode, path) {
        /** @type {?} */
        const control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    }
    /**
     * \@description
     * Reports whether the control with the given path has the error specified.
     *
     * \@usageNotes
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
     * @param {?} errorCode The code of the error to check
     * @param {?=} path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @return {?} whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode, path) {
        return !!this.getError(errorCode, path);
    }
    /**
     * Retrieves the top-level ancestor of this control.
     * @return {?}
     */
    get root() {
        /** @type {?} */
        let x = this;
        while (x._parent) {
            x = x._parent;
        }
        return x;
    }
    /**
     * \@internal
     * @param {?} emitEvent
     * @return {?}
     */
    _updateControlsErrors(emitEvent) {
        ((/** @type {?} */ (this))).status = this._calculateStatus();
        if (emitEvent) {
            ((/** @type {?} */ (this.statusChanges))).emit(this.status);
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent);
        }
    }
    /**
     * \@internal
     * @return {?}
     */
    _initObservables() {
        ((/** @type {?} */ (this))).valueChanges = new EventEmitter();
        ((/** @type {?} */ (this))).statusChanges = new EventEmitter();
    }
    /**
     * @private
     * @return {?}
     */
    _calculateStatus() {
        if (this._allControlsDisabled())
            return DISABLED;
        if (this.errors)
            return INVALID;
        if (this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    }
    /**
     * \@internal
     * @param {?} status
     * @return {?}
     */
    _anyControlsHaveStatus(status) {
        return this._anyControls((/**
         * @param {?} control
         * @return {?}
         */
        (control) => control.status === status));
    }
    /**
     * \@internal
     * @return {?}
     */
    _anyControlsDirty() {
        return this._anyControls((/**
         * @param {?} control
         * @return {?}
         */
        (control) => control.dirty));
    }
    /**
     * \@internal
     * @return {?}
     */
    _anyControlsTouched() {
        return this._anyControls((/**
         * @param {?} control
         * @return {?}
         */
        (control) => control.touched));
    }
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    _updatePristine(opts = {}) {
        ((/** @type {?} */ (this))).pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    _updateTouched(opts = {}) {
        ((/** @type {?} */ (this))).touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /**
     * \@internal
     * @param {?} formState
     * @return {?}
     */
    _isBoxedValue(formState) {
        return typeof formState === 'object' && formState !== null &&
            Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
    }
    /**
     * \@internal
     * @param {?} fn
     * @return {?}
     */
    _registerOnCollectionChange(fn) {
        this._onCollectionChange = fn;
    }
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    _setUpdateStrategy(opts) {
        if (isOptionsObj(opts) && ((/** @type {?} */ (opts))).updateOn != null) {
            this._updateOn = (/** @type {?} */ (((/** @type {?} */ (opts))).updateOn));
        }
    }
    /**
     * Check to see if parent has been marked artificially dirty.
     *
     * \@internal
     * @private
     * @param {?=} onlySelf
     * @return {?}
     */
    _parentMarkedDirty(onlySelf) {
        /** @type {?} */
        const parentDirty = this._parent && this._parent.dirty;
        return !onlySelf && parentDirty && !this._parent._anyControlsDirty();
    }
}
if (false) {
    /**
     * \@internal
     * @type {?}
     */
    AbstractControl.prototype._pendingDirty;
    /**
     * \@internal
     * @type {?}
     */
    AbstractControl.prototype._pendingTouched;
    /**
     * \@internal
     * @type {?}
     */
    AbstractControl.prototype._onCollectionChange;
    /**
     * \@internal
     * @type {?}
     */
    AbstractControl.prototype._updateOn;
    /**
     * @type {?}
     * @private
     */
    AbstractControl.prototype._parent;
    /**
     * @type {?}
     * @private
     */
    AbstractControl.prototype._asyncValidationSubscription;
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
     * @type {?}
     */
    AbstractControl.prototype.value;
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
     * @type {?}
     */
    AbstractControl.prototype.status;
    /**
     * An object containing any errors generated by failing validation,
     * or null if there are no errors.
     * @type {?}
     */
    AbstractControl.prototype.errors;
    /**
     * A control is `pristine` if the user has not yet changed
     * the value in the UI.
     *
     * \@return True if the user has not yet changed the value in the UI; compare `dirty`.
     * Programmatic changes to a control's value do not mark it dirty.
     * @type {?}
     */
    AbstractControl.prototype.pristine;
    /**
     * True if the control is marked as `touched`.
     *
     * A control is marked `touched` once the user has triggered
     * a `blur` event on it.
     * @type {?}
     */
    AbstractControl.prototype.touched;
    /**
     * A multicasting observable that emits an event every time the value of the control changes, in
     * the UI or programmatically. It also emits an event each time you call enable() or disable()
     * without passing along {emitEvent: false} as a function argument.
     * @type {?}
     */
    AbstractControl.prototype.valueChanges;
    /**
     * A multicasting observable that emits an event every time the validation `status` of the control
     * recalculates.
     *
     * @see {\@link AbstractControl.status}
     *
     * @type {?}
     */
    AbstractControl.prototype.statusChanges;
    /**
     * \@internal
     * @type {?}
     */
    AbstractControl.prototype._onDisabledChange;
    /** @type {?} */
    AbstractControl.prototype.validator;
    /** @type {?} */
    AbstractControl.prototype.asyncValidator;
    /**
     * Sets the value of the control. Abstract method (implemented in sub-classes).
     * @abstract
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    AbstractControl.prototype.setValue = function (value, options) { };
    /**
     * Patches the value of the control. Abstract method (implemented in sub-classes).
     * @abstract
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    AbstractControl.prototype.patchValue = function (value, options) { };
    /**
     * Resets the control. Abstract method (implemented in sub-classes).
     * @abstract
     * @param {?=} value
     * @param {?=} options
     * @return {?}
     */
    AbstractControl.prototype.reset = function (value, options) { };
    /**
     * \@internal
     * @abstract
     * @return {?}
     */
    AbstractControl.prototype._updateValue = function () { };
    /**
     * \@internal
     * @abstract
     * @param {?} cb
     * @return {?}
     */
    AbstractControl.prototype._forEachChild = function (cb) { };
    /**
     * \@internal
     * @abstract
     * @param {?} condition
     * @return {?}
     */
    AbstractControl.prototype._anyControls = function (condition) { };
    /**
     * \@internal
     * @abstract
     * @return {?}
     */
    AbstractControl.prototype._allControlsDisabled = function () { };
    /**
     * \@internal
     * @abstract
     * @return {?}
     */
    AbstractControl.prototype._syncPendingControls = function () { };
}
/**
 * Tracks the value and validation status of an individual form control.
 *
 * This is one of the three fundamental building blocks of Angular forms, along with
 * `FormGroup` and `FormArray`. It extends the `AbstractControl` class that
 * implements most of the base functionality for accessing the value, validation status,
 * user interactions and events.
 *
 * @see `AbstractControl`
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see [Usage Notes](#usage-notes)
 *
 * \@usageNotes
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
 * \@publicApi
 */
export class FormControl extends AbstractControl {
    /**
     * Creates a new `FormControl` instance.
     *
     * @param {?=} formState Initializes the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param {?=} validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param {?=} asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(formState = null, validatorOrOpts, asyncValidator) {
        super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts));
        /**
         * \@internal
         */
        this._onChange = [];
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this._initObservables();
    }
    /**
     * Sets a new value for the form control.
     *
     * @param {?} value The new value for the control.
     * @param {?=} options Configuration options that determine how the control propagates changes
     * and emits events when the value changes.
     * The configuration options are passed to the {\@link AbstractControl#updateValueAndValidity
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
     * @return {?}
     */
    setValue(value, options = {}) {
        ((/** @type {?} */ (this))).value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
            this._onChange.forEach((/**
             * @param {?} changeFn
             * @return {?}
             */
            (changeFn) => changeFn(this.value, options.emitViewToModelChange !== false)));
        }
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {\@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {\@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     *
     * @see `setValue` for options
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    patchValue(value, options = {}) {
        this.setValue(value, options);
    }
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and setting
     * the value to null.
     *
     * @param {?=} formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param {?=} options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     *
     * @return {?}
     */
    reset(formState = null, options = {}) {
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
    }
    /**
     * \@internal
     * @return {?}
     */
    _updateValue() { }
    /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    _anyControls(condition) {
        return false;
    }
    /**
     * \@internal
     * @return {?}
     */
    _allControlsDisabled() {
        return this.disabled;
    }
    /**
     * Register a listener for change events.
     *
     * @param {?} fn The method that is called when the value changes
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange.push(fn);
    }
    /**
     * \@internal
     * @return {?}
     */
    _clearChangeFns() {
        this._onChange = [];
        this._onDisabledChange = [];
        this._onCollectionChange = (/**
         * @return {?}
         */
        () => { });
    }
    /**
     * Register a listener for disabled events.
     *
     * @param {?} fn The method that is called when the disabled status changes.
     * @return {?}
     */
    registerOnDisabledChange(fn) {
        this._onDisabledChange.push(fn);
    }
    /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    _forEachChild(cb) { }
    /**
     * \@internal
     * @return {?}
     */
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
    /**
     * @private
     * @param {?} formState
     * @return {?}
     */
    _applyFormState(formState) {
        if (this._isBoxedValue(formState)) {
            ((/** @type {?} */ (this))).value = this._pendingValue = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            ((/** @type {?} */ (this))).value = this._pendingValue = formState;
        }
    }
}
if (false) {
    /**
     * \@internal
     * @type {?}
     */
    FormControl.prototype._onChange;
    /**
     * \@internal
     * @type {?}
     */
    FormControl.prototype._pendingValue;
    /**
     * \@internal
     * @type {?}
     */
    FormControl.prototype._pendingChange;
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
 * \@usageNotes
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
 * \@publicApi
 */
export class FormGroup extends AbstractControl {
    /**
     * Creates a new `FormGroup` instance.
     *
     * @param {?} controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param {?=} validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param {?=} asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control.
     * Use {\@link FormGroup#addControl addControl} instead.
     *
     * @param {?} name The control name to register in the collection
     * @param {?} control Provides the control for the given name
     * @return {?}
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
     * This method also updates the value and validity of the control.
     *
     * @param {?} name The control name to add to the collection
     * @param {?} control Provides the control for the given name
     * @return {?}
     */
    addControl(name, control) {
        this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Remove a control from this group.
     *
     * @param {?} name The control name to remove from the collection
     * @return {?}
     */
    removeControl(name) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange((/**
             * @return {?}
             */
            () => { }));
        delete (this.controls[name]);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Replace an existing control.
     *
     * @param {?} name The control name to replace in the collection
     * @param {?} control Provides the control for the given name
     * @return {?}
     */
    setControl(name, control) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange((/**
             * @return {?}
             */
            () => { }));
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * Reports false for disabled controls. If you'd like to check for existence in the group
     * only, use {\@link AbstractControl#get get} instead.
     *
     * @param {?} controlName The control name to check for existence in the collection
     *
     * @return {?} false for disabled controls, true otherwise.
     */
    contains(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    }
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * \@usageNotes
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
     * @param {?} value The new value for the control that matches the structure of the group.
     * @param {?=} options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the {\@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * @return {?}
     */
    setValue(value, options = {}) {
        this._checkAllValuesPresent(value);
        Object.keys(value).forEach((/**
         * @param {?} name
         * @return {?}
         */
        name => {
            this._throwIfControlMissing(name);
            this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        }));
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * \@usageNotes
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
     * @param {?} value The object that matches the structure of the group.
     * @param {?=} options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {\@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     * @return {?}
     */
    patchValue(value, options = {}) {
        Object.keys(value).forEach((/**
         * @param {?} name
         * @return {?}
         */
        name => {
            if (this.controls[name]) {
                this.controls[name].patchValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        }));
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormGroup`, marks all descendants are marked `pristine` and `untouched`, and
     * the value of all descendants to null.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * \@usageNotes
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
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     * @param {?=} value Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param {?=} options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {\@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * @return {?}
     */
    reset(value = {}, options = {}) {
        this._forEachChild((/**
         * @param {?} control
         * @param {?} name
         * @return {?}
         */
        (control, name) => {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        }));
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
     * @return {?}
     */
    getRawValue() {
        return this._reduceChildren({}, (/**
         * @param {?} acc
         * @param {?} control
         * @param {?} name
         * @return {?}
         */
        (acc, control, name) => {
            acc[name] = control instanceof FormControl ? control.value : ((/** @type {?} */ (control))).getRawValue();
            return acc;
        }));
    }
    /**
     * \@internal
     * @return {?}
     */
    _syncPendingControls() {
        /** @type {?} */
        let subtreeUpdated = this._reduceChildren(false, (/**
         * @param {?} updated
         * @param {?} child
         * @return {?}
         */
        (updated, child) => {
            return child._syncPendingControls() ? true : updated;
        }));
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /**
     * \@internal
     * @param {?} name
     * @return {?}
     */
    _throwIfControlMissing(name) {
        if (!Object.keys(this.controls).length) {
            throw new Error(`
        There are no form controls registered with this group yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.controls[name]) {
            throw new Error(`Cannot find form control with name: ${name}.`);
        }
    }
    /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    _forEachChild(cb) {
        Object.keys(this.controls).forEach((/**
         * @param {?} k
         * @return {?}
         */
        k => cb(this.controls[k], k)));
    }
    /**
     * \@internal
     * @return {?}
     */
    _setUpControls() {
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            control.setParent(this);
            control._registerOnCollectionChange(this._onCollectionChange);
        }));
    }
    /**
     * \@internal
     * @return {?}
     */
    _updateValue() {
        ((/** @type {?} */ (this))).value = this._reduceValue();
    }
    /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    _anyControls(condition) {
        /** @type {?} */
        let res = false;
        this._forEachChild((/**
         * @param {?} control
         * @param {?} name
         * @return {?}
         */
        (control, name) => {
            res = res || (this.contains(name) && condition(control));
        }));
        return res;
    }
    /**
     * \@internal
     * @return {?}
     */
    _reduceValue() {
        return this._reduceChildren({}, (/**
         * @param {?} acc
         * @param {?} control
         * @param {?} name
         * @return {?}
         */
        (acc, control, name) => {
            if (control.enabled || this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        }));
    }
    /**
     * \@internal
     * @param {?} initValue
     * @param {?} fn
     * @return {?}
     */
    _reduceChildren(initValue, fn) {
        /** @type {?} */
        let res = initValue;
        this._forEachChild((/**
         * @param {?} control
         * @param {?} name
         * @return {?}
         */
        (control, name) => {
            res = fn(res, control, name);
        }));
        return res;
    }
    /**
     * \@internal
     * @return {?}
     */
    _allControlsDisabled() {
        for (const controlName of Object.keys(this.controls)) {
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    }
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _checkAllValuesPresent(value) {
        this._forEachChild((/**
         * @param {?} control
         * @param {?} name
         * @return {?}
         */
        (control, name) => {
            if (value[name] === undefined) {
                throw new Error(`Must supply a value for form control with name: '${name}'.`);
            }
        }));
    }
}
if (false) {
    /** @type {?} */
    FormGroup.prototype.controls;
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
 * \@usageNotes
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
 * \@publicApi
 */
export class FormArray extends AbstractControl {
    /**
     * Creates a new `FormArray` instance.
     *
     * @param {?} controls An array of child controls. Each child control is given an index
     * where it is registered.
     *
     * @param {?=} validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param {?=} asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param {?} index Index in the array to retrieve the control
     * @return {?}
     */
    at(index) {
        return this.controls[index];
    }
    /**
     * Insert a new `AbstractControl` at the end of the array.
     *
     * @param {?} control Form control to be inserted
     * @return {?}
     */
    push(control) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     *
     * @param {?} index Index in the array to insert the control
     * @param {?} control Form control to be inserted
     * @return {?}
     */
    insert(index, control) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity();
    }
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param {?} index Index in the array to remove the control
     * @return {?}
     */
    removeAt(index) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange((/**
             * @return {?}
             */
            () => { }));
        this.controls.splice(index, 1);
        this.updateValueAndValidity();
    }
    /**
     * Replace an existing control.
     *
     * @param {?} index Index in the array to replace the control
     * @param {?} control The `AbstractControl` control to replace the existing control
     * @return {?}
     */
    setControl(index, control) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange((/**
             * @return {?}
             */
            () => { }));
        this.controls.splice(index, 1);
        if (control) {
            this.controls.splice(index, 0, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Length of the control array.
     * @return {?}
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
     * \@usageNotes
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
     * @param {?} value Array of values for the controls
     * @param {?=} options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {\@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     * @return {?}
     */
    setValue(value, options = {}) {
        this._checkAllValuesPresent(value);
        value.forEach((/**
         * @param {?} newValue
         * @param {?} index
         * @return {?}
         */
        (newValue, index) => {
            this._throwIfControlMissing(index);
            this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        }));
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormArray`. It accepts an array that matches the
     * structure of the control, and does its best to match the values to the correct
     * controls in the group.
     *
     * It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     * \@usageNotes
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
     * @param {?} value Array of latest values for the controls
     * @param {?=} options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {\@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     * @return {?}
     */
    patchValue(value, options = {}) {
        value.forEach((/**
         * @param {?} newValue
         * @param {?} index
         * @return {?}
         */
        (newValue, index) => {
            if (this.at(index)) {
                this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
            }
        }));
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
     * \@usageNotes
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
     * @param {?=} value Array of values for the controls
     * @param {?=} options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {\@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     * @return {?}
     */
    reset(value = [], options = {}) {
        this._forEachChild((/**
         * @param {?} control
         * @param {?} index
         * @return {?}
         */
        (control, index) => {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        }));
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     * For enabled controls only, the `value` property is the best way to get the value of the array.
     * @return {?}
     */
    getRawValue() {
        return this.controls.map((/**
         * @param {?} control
         * @return {?}
         */
        (control) => {
            return control instanceof FormControl ? control.value : ((/** @type {?} */ (control))).getRawValue();
        }));
    }
    /**
     * Remove all controls in the `FormArray`.
     *
     * \@usageNotes
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
     * @return {?}
     */
    clear() {
        if (this.controls.length < 1)
            return;
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => control._registerOnCollectionChange((/**
         * @return {?}
         */
        () => { }))));
        this.controls.splice(0);
        this.updateValueAndValidity();
    }
    /**
     * \@internal
     * @return {?}
     */
    _syncPendingControls() {
        /** @type {?} */
        let subtreeUpdated = this.controls.reduce((/**
         * @param {?} updated
         * @param {?} child
         * @return {?}
         */
        (updated, child) => {
            return child._syncPendingControls() ? true : updated;
        }), false);
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /**
     * \@internal
     * @param {?} index
     * @return {?}
     */
    _throwIfControlMissing(index) {
        if (!this.controls.length) {
            throw new Error(`
        There are no form controls registered with this array yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.at(index)) {
            throw new Error(`Cannot find form control at index ${index}`);
        }
    }
    /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    _forEachChild(cb) {
        this.controls.forEach((/**
         * @param {?} control
         * @param {?} index
         * @return {?}
         */
        (control, index) => {
            cb(control, index);
        }));
    }
    /**
     * \@internal
     * @return {?}
     */
    _updateValue() {
        ((/** @type {?} */ (this))).value =
            this.controls.filter((/**
             * @param {?} control
             * @return {?}
             */
            (control) => control.enabled || this.disabled))
                .map((/**
             * @param {?} control
             * @return {?}
             */
            (control) => control.value));
    }
    /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    _anyControls(condition) {
        return this.controls.some((/**
         * @param {?} control
         * @return {?}
         */
        (control) => control.enabled && condition(control)));
    }
    /**
     * \@internal
     * @return {?}
     */
    _setUpControls() {
        this._forEachChild((/**
         * @param {?} control
         * @return {?}
         */
        (control) => this._registerControl(control)));
    }
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _checkAllValuesPresent(value) {
        this._forEachChild((/**
         * @param {?} control
         * @param {?} i
         * @return {?}
         */
        (control, i) => {
            if (value[i] === undefined) {
                throw new Error(`Must supply a value for form control at index: ${i}.`);
            }
        }));
    }
    /**
     * \@internal
     * @return {?}
     */
    _allControlsDisabled() {
        for (const control of this.controls) {
            if (control.enabled)
                return false;
        }
        return this.controls.length > 0 || this.disabled;
    }
    /**
     * @private
     * @param {?} control
     * @return {?}
     */
    _registerControl(control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    }
}
if (false) {
    /** @type {?} */
    FormArray.prototype.controls;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUMsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUU5RSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7Ozs7O0FBTzFDLE1BQU0sT0FBTyxLQUFLLEdBQUcsT0FBTzs7Ozs7OztBQU81QixNQUFNLE9BQU8sT0FBTyxHQUFHLFNBQVM7Ozs7Ozs7OztBQVNoQyxNQUFNLE9BQU8sT0FBTyxHQUFHLFNBQVM7Ozs7Ozs7OztBQVNoQyxNQUFNLE9BQU8sUUFBUSxHQUFHLFVBQVU7Ozs7Ozs7QUFFbEMsU0FBUyxLQUFLLENBQUMsT0FBd0IsRUFBRSxJQUFpQyxFQUFFLFNBQWlCO0lBQzNGLElBQUksSUFBSSxJQUFJLElBQUk7UUFBRSxPQUFPLElBQUksQ0FBQztJQUU5QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4QixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5QjtJQUNELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQzs7OztRQUl0RCxhQUFhLEdBQXlCLE9BQU87SUFDakQsSUFBSSxDQUFDLE9BQU87Ozs7SUFBQyxDQUFDLElBQW1CLEVBQUUsRUFBRTtRQUNuQyxJQUFJLGFBQWEsWUFBWSxTQUFTLEVBQUU7WUFDdEMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFBLElBQUksRUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUM7U0FDVjthQUFNLElBQUksYUFBYSxZQUFZLFNBQVMsRUFBRTtZQUM3QyxhQUFhLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQyxtQkFBUSxJQUFJLEVBQUEsQ0FBQyxJQUFJLElBQUksQ0FBQztTQUN4RDthQUFNO1lBQ0wsYUFBYSxHQUFHLElBQUksQ0FBQztTQUN0QjtJQUNILENBQUMsRUFBQyxDQUFDO0lBQ0gsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQzs7Ozs7QUFFRCxTQUFTLGlCQUFpQixDQUFDLGVBQ0k7O1VBQ3ZCLFNBQVMsR0FDWCxtQkFBQSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBQSxlQUFlLEVBQTBCLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN4RCxlQUFlLENBQUMsRUFDN0I7SUFFeEIsT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQztBQUNyRixDQUFDOzs7Ozs7QUFFRCxTQUFTLHNCQUFzQixDQUMzQixjQUF5RCxFQUN6RCxlQUF1RTs7VUFFbkUsa0JBQWtCLEdBQ3BCLG1CQUFBLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFBLGVBQWUsRUFBMEIsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdELGNBQWMsQ0FBQyxFQUN6QjtJQUUzQixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQzVDLGtCQUFrQixJQUFJLElBQUksQ0FBQztBQUN4RSxDQUFDOzs7Ozs7O0FBU0QsNENBZ0JDOzs7Ozs7O0lBWEMsNENBQTRDOzs7Ozs7SUFLNUMsaURBQTJEOzs7Ozs7SUFLM0QsMENBQW9DOzs7Ozs7QUFJdEMsU0FBUyxZQUFZLENBQUMsZUFDSTtJQUN4QixPQUFPLGVBQWUsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztRQUM3RCxPQUFPLGVBQWUsS0FBSyxRQUFRLENBQUM7QUFDMUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCRCxNQUFNLE9BQWdCLGVBQWU7Ozs7Ozs7O0lBd0NuQyxZQUFtQixTQUEyQixFQUFTLGNBQXFDO1FBQXpFLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQVMsbUJBQWMsR0FBZCxjQUFjLENBQXVCOzs7O1FBOUI1Rix3QkFBbUI7OztRQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBQzs7Ozs7Ozs7UUFvSWYsYUFBUSxHQUFZLElBQUksQ0FBQzs7Ozs7OztRQW1CekIsWUFBTyxHQUFZLEtBQUssQ0FBQzs7OztRQXNsQnpDLHNCQUFpQixHQUFlLEVBQUUsQ0FBQztJQS9zQjRELENBQUM7Ozs7O0lBS2hHLElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDOzs7Ozs7Ozs7SUF5QkQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQztJQUMvQixDQUFDOzs7Ozs7Ozs7SUFVRCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxDQUFDO0lBQ2pDLENBQUM7Ozs7Ozs7OztJQVVELElBQUksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUM7SUFDaEMsQ0FBQzs7Ozs7Ozs7Ozs7O0lBYUQsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztJQUNsQyxDQUFDOzs7Ozs7Ozs7O0lBV0QsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVEsQ0FBQztJQUNsQyxDQUFDOzs7Ozs7OztJQXlCRCxJQUFJLEtBQUs7UUFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN4QixDQUFDOzs7Ozs7OztJQWdCRCxJQUFJLFNBQVM7UUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN2QixDQUFDOzs7Ozs7OztJQTBCRCxJQUFJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNGLENBQUM7Ozs7Ozs7Ozs7O0lBVUQsYUFBYSxDQUFDLFlBQTRDO1FBQ3hELElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbkQsQ0FBQzs7Ozs7Ozs7Ozs7SUFVRCxrQkFBa0IsQ0FBQyxZQUFzRDtRQUN2RSxJQUFJLENBQUMsY0FBYyxHQUFHLHNCQUFzQixDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzdELENBQUM7Ozs7Ozs7OztJQVNELGVBQWU7UUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN4QixDQUFDOzs7Ozs7Ozs7SUFTRCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQzs7Ozs7Ozs7Ozs7OztJQWVELGFBQWEsQ0FBQyxPQUE2QixFQUFFO1FBQzNDLENBQUMsbUJBQUEsSUFBSSxFQUFzQixDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUU1QyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQzs7Ozs7O0lBTUQsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBRXJDLElBQUksQ0FBQyxhQUFhOzs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxDQUFDO0lBQy9FLENBQUM7Ozs7Ozs7Ozs7Ozs7OztJQWlCRCxlQUFlLENBQUMsT0FBNkIsRUFBRTtRQUM3QyxDQUFDLG1CQUFBLElBQUksRUFBc0IsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFFN0IsSUFBSSxDQUFDLGFBQWE7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRTtZQUM5QyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxFQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7OztJQWVELFdBQVcsQ0FBQyxPQUE2QixFQUFFO1FBQ3pDLENBQUMsbUJBQUEsSUFBSSxFQUF1QixDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUUvQyxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztJQWtCRCxjQUFjLENBQUMsT0FBNkIsRUFBRTtRQUM1QyxDQUFDLG1CQUFBLElBQUksRUFBdUIsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDOUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFFM0IsSUFBSSxDQUFDLGFBQWE7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRTtZQUM5QyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxFQUFDLENBQUM7UUFFSCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JELGFBQWEsQ0FBQyxPQUFrRCxFQUFFO1FBQ2hFLENBQUMsbUJBQUEsSUFBSSxFQUFvQixDQUFDLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUU1QyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQzVCLENBQUMsbUJBQUEsSUFBSSxDQUFDLGFBQWEsRUFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0Q7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1CRCxPQUFPLENBQUMsT0FBa0QsRUFBRTs7OztjQUdwRCxpQkFBaUIsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUVoRSxDQUFDLG1CQUFBLElBQUksRUFBb0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDN0MsQ0FBQyxtQkFBQSxJQUFJLEVBQXFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQzFELElBQUksQ0FBQyxhQUFhOzs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUU7WUFDOUMsT0FBTyxDQUFDLE9BQU8saUNBQUssSUFBSSxLQUFFLFFBQVEsRUFBRSxJQUFJLElBQUUsQ0FBQztRQUM3QyxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQzVCLENBQUMsbUJBQUEsSUFBSSxDQUFDLFlBQVksRUFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxtQkFBQSxJQUFJLENBQUMsYUFBYSxFQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRTtRQUVELElBQUksQ0FBQyxnQkFBZ0IsaUNBQUssSUFBSSxLQUFFLGlCQUFpQixJQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUM7SUFDL0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQkQsTUFBTSxDQUFDLE9BQWtELEVBQUU7Ozs7Y0FHbkQsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7UUFFaEUsQ0FBQyxtQkFBQSxJQUFJLEVBQW9CLENBQUMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQzFDLElBQUksQ0FBQyxhQUFhOzs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUU7WUFDOUMsT0FBTyxDQUFDLE1BQU0saUNBQUssSUFBSSxLQUFFLFFBQVEsRUFBRSxJQUFJLElBQUUsQ0FBQztRQUM1QyxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBRXpFLElBQUksQ0FBQyxnQkFBZ0IsaUNBQUssSUFBSSxLQUFFLGlCQUFpQixJQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUM7SUFDaEUsQ0FBQzs7Ozs7O0lBRU8sZ0JBQWdCLENBQ3BCLElBQTRFO1FBQzlFLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDO2FBQ2hDO1lBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMvQjtJQUNILENBQUM7Ozs7O0lBS0QsU0FBUyxDQUFDLE1BQTJCO1FBQ25DLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUErQkQsc0JBQXNCLENBQUMsT0FBa0QsRUFBRTtRQUN6RSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO1lBQ25DLENBQUMsbUJBQUEsSUFBSSxFQUFxQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMxRSxDQUFDLG1CQUFBLElBQUksRUFBb0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUU1RCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssT0FBTyxFQUFFO2dCQUNwRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3pDO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQzVCLENBQUMsbUJBQUEsSUFBSSxDQUFDLFlBQVksRUFBcUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUQsQ0FBQyxtQkFBQSxJQUFJLENBQUMsYUFBYSxFQUF3QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNoRTtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQztJQUNILENBQUM7Ozs7OztJQUdELG1CQUFtQixDQUFDLE9BQThCLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQztRQUNqRSxJQUFJLENBQUMsYUFBYTs7OztRQUFDLENBQUMsSUFBcUIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQzs7Ozs7SUFFTyxpQkFBaUI7UUFDdkIsQ0FBQyxtQkFBQSxJQUFJLEVBQW9CLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3JGLENBQUM7Ozs7O0lBRU8sYUFBYTtRQUNuQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUN0RCxDQUFDOzs7Ozs7SUFFTyxrQkFBa0IsQ0FBQyxTQUFtQjtRQUM1QyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsQ0FBQyxtQkFBQSxJQUFJLEVBQW9CLENBQUMsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDOztrQkFDdEMsR0FBRyxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyw0QkFBNEI7Z0JBQzdCLEdBQUcsQ0FBQyxTQUFTOzs7O2dCQUFDLENBQUMsTUFBNkIsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBQyxTQUFTLEVBQUMsQ0FBQyxFQUFDLENBQUM7U0FDM0Y7SUFDSCxDQUFDOzs7OztJQUVPLDJCQUEyQjtRQUNqQyxJQUFJLElBQUksQ0FBQyw0QkFBNEIsRUFBRTtZQUNyQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDakQ7SUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCRCxTQUFTLENBQUMsTUFBNkIsRUFBRSxPQUE4QixFQUFFO1FBQ3ZFLENBQUMsbUJBQUEsSUFBSSxFQUFxQyxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUM1RCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsS0FBSyxLQUFLLENBQUMsQ0FBQztJQUN2RCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJELEdBQUcsQ0FBQyxJQUFpQztRQUNuQyxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUE2QkQsUUFBUSxDQUFDLFNBQWlCLEVBQUUsSUFBa0M7O2NBQ3RELE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7UUFDNUMsT0FBTyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3RFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQ0QsUUFBUSxDQUFDLFNBQWlCLEVBQUUsSUFBa0M7UUFDNUQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUMsQ0FBQzs7Ozs7SUFLRCxJQUFJLElBQUk7O1lBQ0YsQ0FBQyxHQUFvQixJQUFJO1FBRTdCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRTtZQUNoQixDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUNmO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDOzs7Ozs7SUFHRCxxQkFBcUIsQ0FBQyxTQUFrQjtRQUN0QyxDQUFDLG1CQUFBLElBQUksRUFBb0IsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUU1RCxJQUFJLFNBQVMsRUFBRTtZQUNiLENBQUMsbUJBQUEsSUFBSSxDQUFDLGFBQWEsRUFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEU7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMvQztJQUNILENBQUM7Ozs7O0lBR0QsZ0JBQWdCO1FBQ2QsQ0FBQyxtQkFBQSxJQUFJLEVBQW1DLENBQUMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUM1RSxDQUFDLG1CQUFBLElBQUksRUFBb0MsQ0FBQyxDQUFDLGFBQWEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQ2hGLENBQUM7Ozs7O0lBR08sZ0JBQWdCO1FBQ3RCLElBQUksSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQUUsT0FBTyxRQUFRLENBQUM7UUFDakQsSUFBSSxJQUFJLENBQUMsTUFBTTtZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQ2hDLElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQ3pELElBQUksSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBQ3pELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7O0lBa0JELHNCQUFzQixDQUFDLE1BQWM7UUFDbkMsT0FBTyxJQUFJLENBQUMsWUFBWTs7OztRQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxNQUFNLEVBQUMsQ0FBQztJQUNwRixDQUFDOzs7OztJQUdELGlCQUFpQjtRQUNmLE9BQU8sSUFBSSxDQUFDLFlBQVk7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsQ0FBQztJQUN4RSxDQUFDOzs7OztJQUdELG1CQUFtQjtRQUNqQixPQUFPLElBQUksQ0FBQyxZQUFZOzs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFDLENBQUM7SUFDMUUsQ0FBQzs7Ozs7O0lBR0QsZUFBZSxDQUFDLE9BQTZCLEVBQUU7UUFDN0MsQ0FBQyxtQkFBQSxJQUFJLEVBQXVCLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUVuRSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3BDO0lBQ0gsQ0FBQzs7Ozs7O0lBR0QsY0FBYyxDQUFDLE9BQTZCLEVBQUU7UUFDNUMsQ0FBQyxtQkFBQSxJQUFJLEVBQXNCLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFFbEUsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7Ozs7OztJQU1ELGFBQWEsQ0FBQyxTQUFjO1FBQzFCLE9BQU8sT0FBTyxTQUFTLEtBQUssUUFBUSxJQUFJLFNBQVMsS0FBSyxJQUFJO1lBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxPQUFPLElBQUksU0FBUyxJQUFJLFVBQVUsSUFBSSxTQUFTLENBQUM7SUFDN0YsQ0FBQzs7Ozs7O0lBR0QsMkJBQTJCLENBQUMsRUFBYztRQUN4QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Ozs7OztJQUdELGtCQUFrQixDQUFDLElBQTREO1FBQzdFLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQUEsSUFBSSxFQUEwQixDQUFDLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUMzRSxJQUFJLENBQUMsU0FBUyxHQUFHLG1CQUFBLENBQUMsbUJBQUEsSUFBSSxFQUEwQixDQUFDLENBQUMsUUFBUSxFQUFDLENBQUM7U0FDN0Q7SUFDSCxDQUFDOzs7Ozs7Ozs7SUFPTyxrQkFBa0IsQ0FBQyxRQUFrQjs7Y0FDckMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO1FBQ3RELE9BQU8sQ0FBQyxRQUFRLElBQUksV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQ3ZFLENBQUM7Q0FDRjs7Ozs7O0lBanhCQyx3Q0FBd0I7Ozs7O0lBSXhCLDBDQUEwQjs7Ozs7SUFHMUIsOENBQStCOzs7OztJQUkvQixvQ0FBc0I7Ozs7O0lBR3RCLGtDQUFzQzs7Ozs7SUFDdEMsdURBQTBDOzs7Ozs7Ozs7Ozs7O0lBYTFDLGdDQUEyQjs7Ozs7Ozs7Ozs7Ozs7SUErQjNCLGlDQUFnQzs7Ozs7O0lBdUVoQyxpQ0FBK0M7Ozs7Ozs7OztJQVMvQyxtQ0FBeUM7Ozs7Ozs7O0lBbUJ6QyxrQ0FBeUM7Ozs7Ozs7SUFrQnpDLHVDQUErQzs7Ozs7Ozs7O0lBVS9DLHdDQUFnRDs7Ozs7SUEwakJoRCw0Q0FBbUM7O0lBL3NCdkIsb0NBQWtDOztJQUFFLHlDQUE0Qzs7Ozs7Ozs7SUFvYjVGLG1FQUFzRDs7Ozs7Ozs7SUFLdEQscUVBQXdEOzs7Ozs7OztJQUt4RCxnRUFBb0Q7Ozs7OztJQWlPcEQseURBQThCOzs7Ozs7O0lBRzlCLDREQUEyQzs7Ozs7OztJQUczQyxrRUFBb0Q7Ozs7OztJQUdwRCxpRUFBeUM7Ozs7OztJQUd6QyxpRUFBeUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9LM0MsTUFBTSxPQUFPLFdBQVksU0FBUSxlQUFlOzs7Ozs7Ozs7Ozs7OztJQXVCOUMsWUFDSSxZQUFpQixJQUFJLEVBQ3JCLGVBQXVFLEVBQ3ZFLGNBQXlEO1FBQzNELEtBQUssQ0FDRCxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsRUFDbEMsc0JBQXNCLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7Ozs7UUEzQi9ELGNBQVMsR0FBZSxFQUFFLENBQUM7UUE0QnpCLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDMUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXlCRCxRQUFRLENBQUMsS0FBVSxFQUFFLFVBS2pCLEVBQUU7UUFDSixDQUFDLG1CQUFBLElBQUksRUFBZ0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMxRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxxQkFBcUIsS0FBSyxLQUFLLEVBQUU7WUFDcEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPOzs7O1lBQ2xCLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMscUJBQXFCLEtBQUssS0FBSyxDQUFDLEVBQUMsQ0FBQztTQUNsRjtRQUNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7Ozs7Ozs7Ozs7O0lBV0QsVUFBVSxDQUFDLEtBQVUsRUFBRSxVQUtuQixFQUFFO1FBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQkQsS0FBSyxDQUFDLFlBQWlCLElBQUksRUFBRSxVQUFxRCxFQUFFO1FBQ2xGLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztJQUM5QixDQUFDOzs7OztJQUtELFlBQVksS0FBSSxDQUFDOzs7Ozs7SUFLakIsWUFBWSxDQUFDLFNBQW1CO1FBQzlCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs7Ozs7SUFLRCxvQkFBb0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7Ozs7Ozs7SUFPRCxnQkFBZ0IsQ0FBQyxFQUFZO1FBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7Ozs7O0lBS0QsZUFBZTtRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLG1CQUFtQjs7O1FBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFBLENBQUM7SUFDdEMsQ0FBQzs7Ozs7OztJQU9ELHdCQUF3QixDQUFDLEVBQWlDO1FBQ3hELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7Ozs7O0lBS0QsYUFBYSxDQUFDLEVBQVksSUFBUyxDQUFDOzs7OztJQUdwQyxvQkFBb0I7UUFDbEIsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUM5QixJQUFJLElBQUksQ0FBQyxhQUFhO2dCQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMzQyxJQUFJLElBQUksQ0FBQyxlQUFlO2dCQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMvQyxJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUscUJBQXFCLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDbEYsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzs7Ozs7SUFFTyxlQUFlLENBQUMsU0FBYztRQUNwQyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDakMsQ0FBQyxtQkFBQSxJQUFJLEVBQWdCLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ3BFLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1NBQ3RFO2FBQU07WUFDTCxDQUFDLG1CQUFBLElBQUksRUFBZ0IsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztTQUMvRDtJQUNILENBQUM7Q0FDRjs7Ozs7O0lBNUxDLGdDQUEyQjs7Ozs7SUFHM0Isb0NBQW1COzs7OztJQUduQixxQ0FBb0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ1F0QixNQUFNLE9BQU8sU0FBVSxTQUFRLGVBQWU7Ozs7Ozs7Ozs7Ozs7O0lBYzVDLFlBQ1csUUFBMEMsRUFDakQsZUFBdUUsRUFDdkUsY0FBeUQ7UUFDM0QsS0FBSyxDQUNELGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxFQUNsQyxzQkFBc0IsQ0FBQyxjQUFjLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUxwRCxhQUFRLEdBQVIsUUFBUSxDQUFrQztRQU1uRCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4QixJQUFJLENBQUMsa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQzs7Ozs7Ozs7Ozs7SUFXRCxlQUFlLENBQUMsSUFBWSxFQUFFLE9BQXdCO1FBQ3BELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDOUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixPQUFPLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDOUQsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQzs7Ozs7Ozs7OztJQVVELFVBQVUsQ0FBQyxJQUFZLEVBQUUsT0FBd0I7UUFDL0MsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQzs7Ozs7OztJQU9ELGFBQWEsQ0FBQyxJQUFZO1FBQ3hCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLDJCQUEyQjs7O1lBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxFQUFDLENBQUM7UUFDbkYsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUM3QixDQUFDOzs7Ozs7OztJQVFELFVBQVUsQ0FBQyxJQUFZLEVBQUUsT0FBd0I7UUFDL0MsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsMkJBQTJCOzs7WUFBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQUMsQ0FBQztRQUNuRixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzdCLElBQUksT0FBTztZQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7Ozs7Ozs7O0lBWUQsUUFBUSxDQUFDLFdBQW1CO1FBQzFCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDekYsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFDRCxRQUFRLENBQUMsS0FBMkIsRUFBRSxVQUFxRCxFQUFFO1FBRTNGLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDNUYsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQ0QsVUFBVSxDQUFDLEtBQTJCLEVBQUUsVUFBcUQsRUFBRTtRQUU3RixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO2FBQzdGO1FBQ0gsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyREQsS0FBSyxDQUFDLFFBQWEsRUFBRSxFQUFFLFVBQXFELEVBQUU7UUFDNUUsSUFBSSxDQUFDLGFBQWE7Ozs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLElBQVksRUFBRSxFQUFFO1lBQzVELE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDN0UsQ0FBQyxFQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7Ozs7OztJQVNELFdBQVc7UUFDVCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQ3ZCLEVBQUU7Ozs7OztRQUFFLENBQUMsR0FBbUMsRUFBRSxPQUF3QixFQUFFLElBQVksRUFBRSxFQUFFO1lBQ2xGLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLFlBQVksV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLG1CQUFLLE9BQU8sRUFBQSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDMUYsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLEVBQUMsQ0FBQztJQUNULENBQUM7Ozs7O0lBR0Qsb0JBQW9COztZQUNkLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUs7Ozs7O1FBQUUsQ0FBQyxPQUFnQixFQUFFLEtBQXNCLEVBQUUsRUFBRTtZQUM1RixPQUFPLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN2RCxDQUFDLEVBQUM7UUFDRixJQUFJLGNBQWM7WUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNsRSxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDOzs7Ozs7SUFHRCxzQkFBc0IsQ0FBQyxJQUFZO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQzs7O09BR2YsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0gsQ0FBQzs7Ozs7O0lBR0QsYUFBYSxDQUFDLEVBQStCO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU87Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDbkUsQ0FBQzs7Ozs7SUFHRCxjQUFjO1FBQ1osSUFBSSxDQUFDLGFBQWE7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRTtZQUM5QyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNoRSxDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7O0lBR0QsWUFBWTtRQUNWLENBQUMsbUJBQUEsSUFBSSxFQUFnQixDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUNyRCxDQUFDOzs7Ozs7SUFHRCxZQUFZLENBQUMsU0FBbUI7O1lBQzFCLEdBQUcsR0FBRyxLQUFLO1FBQ2YsSUFBSSxDQUFDLGFBQWE7Ozs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLElBQVksRUFBRSxFQUFFO1lBQzVELEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQzNELENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDOzs7OztJQUdELFlBQVk7UUFDVixPQUFPLElBQUksQ0FBQyxlQUFlLENBQ3ZCLEVBQUU7Ozs7OztRQUFFLENBQUMsR0FBbUMsRUFBRSxPQUF3QixFQUFFLElBQVksRUFBRSxFQUFFO1lBQ2xGLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzthQUMzQjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFDLENBQUM7SUFDVCxDQUFDOzs7Ozs7O0lBR0QsZUFBZSxDQUFDLFNBQWMsRUFBRSxFQUFZOztZQUN0QyxHQUFHLEdBQUcsU0FBUztRQUNuQixJQUFJLENBQUMsYUFBYTs7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsSUFBWSxFQUFFLEVBQUU7WUFDNUQsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUMsRUFBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDOzs7OztJQUdELG9CQUFvQjtRQUNsQixLQUFLLE1BQU0sV0FBVyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3BELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RDLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ2hFLENBQUM7Ozs7OztJQUdELHNCQUFzQixDQUFDLEtBQVU7UUFDL0IsSUFBSSxDQUFDLGFBQWE7Ozs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLElBQVksRUFBRSxFQUFFO1lBQzVELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsSUFBSSxJQUFJLENBQUMsQ0FBQzthQUMvRTtRQUNILENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGOzs7SUFuVkssNkJBQWlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxWnZELE1BQU0sT0FBTyxTQUFVLFNBQVEsZUFBZTs7Ozs7Ozs7Ozs7Ozs7SUFjNUMsWUFDVyxRQUEyQixFQUNsQyxlQUF1RSxFQUN2RSxjQUF5RDtRQUMzRCxLQUFLLENBQ0QsaUJBQWlCLENBQUMsZUFBZSxDQUFDLEVBQ2xDLHNCQUFzQixDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBTHBELGFBQVEsR0FBUixRQUFRLENBQW1CO1FBTXBDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDOzs7Ozs7O0lBT0QsRUFBRSxDQUFDLEtBQWE7UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQzs7Ozs7OztJQU9ELElBQUksQ0FBQyxPQUF3QjtRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQzs7Ozs7Ozs7SUFRRCxNQUFNLENBQUMsS0FBYSxFQUFFLE9BQXdCO1FBQzVDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Ozs7Ozs7SUFPRCxRQUFRLENBQUMsS0FBYTtRQUNwQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1lBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQywyQkFBMkI7OztZQUFDLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNoQyxDQUFDOzs7Ozs7OztJQVFELFVBQVUsQ0FBQyxLQUFhLEVBQUUsT0FBd0I7UUFDaEQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsMkJBQTJCOzs7WUFBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQUMsQ0FBQztRQUNyRixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFL0IsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQztRQUVELElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7Ozs7O0lBS0QsSUFBSSxNQUFNO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztJQUM5QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUNELFFBQVEsQ0FBQyxLQUFZLEVBQUUsVUFBcUQsRUFBRTtRQUM1RSxJQUFJLENBQUMsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsS0FBSyxDQUFDLE9BQU87Ozs7O1FBQUMsQ0FBQyxRQUFhLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDN0MsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQ3BGLENBQUMsRUFBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9DRCxVQUFVLENBQUMsS0FBWSxFQUFFLFVBQXFELEVBQUU7UUFDOUUsS0FBSyxDQUFDLE9BQU87Ozs7O1FBQUMsQ0FBQyxRQUFhLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDN0MsSUFBSSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQzthQUNyRjtRQUNILENBQUMsRUFBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWdERCxLQUFLLENBQUMsUUFBYSxFQUFFLEVBQUUsVUFBcUQsRUFBRTtRQUM1RSxJQUFJLENBQUMsYUFBYTs7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsS0FBYSxFQUFFLEVBQUU7WUFDN0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDLEVBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7Ozs7Ozs7SUFRRCxXQUFXO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUc7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsRUFBRTtZQUNwRCxPQUFPLE9BQU8sWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQUssT0FBTyxFQUFBLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2RixDQUFDLEVBQUMsQ0FBQztJQUNMLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBZ0NELEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUM7WUFBRSxPQUFPO1FBQ3JDLElBQUksQ0FBQyxhQUFhOzs7O1FBQUMsQ0FBQyxPQUF3QixFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsMkJBQTJCOzs7UUFBQyxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQUMsRUFBQyxDQUFDO1FBQ2hHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Ozs7O0lBR0Qsb0JBQW9COztZQUNkLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07Ozs7O1FBQUMsQ0FBQyxPQUFnQixFQUFFLEtBQXNCLEVBQUUsRUFBRTtZQUNyRixPQUFPLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUN2RCxDQUFDLEdBQUUsS0FBSyxDQUFDO1FBQ1QsSUFBSSxjQUFjO1lBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDbEUsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQzs7Ozs7O0lBR0Qsc0JBQXNCLENBQUMsS0FBYTtRQUNsQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQzs7O09BR2YsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNuQixNQUFNLElBQUksS0FBSyxDQUFDLHFDQUFxQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQy9EO0lBQ0gsQ0FBQzs7Ozs7O0lBR0QsYUFBYSxDQUFDLEVBQVk7UUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPOzs7OztRQUFDLENBQUMsT0FBd0IsRUFBRSxLQUFhLEVBQUUsRUFBRTtZQUNoRSxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFHRCxZQUFZO1FBQ1YsQ0FBQyxtQkFBQSxJQUFJLEVBQWdCLENBQUMsQ0FBQyxLQUFLO1lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTs7OztZQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUM7aUJBQzlELEdBQUc7Ozs7WUFBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDO0lBQzNDLENBQUM7Ozs7OztJQUdELFlBQVksQ0FBQyxTQUFtQjtRQUM5QixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSTs7OztRQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQztJQUNqRyxDQUFDOzs7OztJQUdELGNBQWM7UUFDWixJQUFJLENBQUMsYUFBYTs7OztRQUFDLENBQUMsT0FBd0IsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFDLENBQUM7SUFDbkYsQ0FBQzs7Ozs7O0lBR0Qsc0JBQXNCLENBQUMsS0FBVTtRQUMvQixJQUFJLENBQUMsYUFBYTs7Ozs7UUFBQyxDQUFDLE9BQXdCLEVBQUUsQ0FBUyxFQUFFLEVBQUU7WUFDekQsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO2dCQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLGtEQUFrRCxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pFO1FBQ0gsQ0FBQyxFQUFDLENBQUM7SUFDTCxDQUFDOzs7OztJQUdELG9CQUFvQjtRQUNsQixLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxPQUFPLENBQUMsT0FBTztnQkFBRSxPQUFPLEtBQUssQ0FBQztTQUNuQztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDbkQsQ0FBQzs7Ozs7O0lBRU8sZ0JBQWdCLENBQUMsT0FBd0I7UUFDL0MsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QixPQUFPLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNGOzs7SUFyVkssNkJBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0V2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtjb21wb3NlQXN5bmNWYWxpZGF0b3JzLCBjb21wb3NlVmFsaWRhdG9yc30gZnJvbSAnLi9kaXJlY3RpdmVzL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvckZufSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5pbXBvcnQge3RvT2JzZXJ2YWJsZX0gZnJvbSAnLi92YWxpZGF0b3JzJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyB2YWxpZCwgbWVhbmluZyB0aGF0IG5vIGVycm9ycyBleGlzdCBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgVkFMSUQgPSAnVkFMSUQnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0IHZhbHVlLlxuICpcbiAqIEBzZWUgYHN0YXR1c2BcbiAqL1xuZXhwb3J0IGNvbnN0IElOVkFMSUQgPSAnSU5WQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IHRoYXQgYXN5bmMgdmFsaWRhdGlvbiBpcyBvY2N1cnJpbmcgYW5kXG4gKiBlcnJvcnMgYXJlIG5vdCB5ZXQgYXZhaWxhYmxlIGZvciB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzUGVuZGluZ2BcbiAqIEBzZWUgYHN0YXR1c2BcbiAqL1xuZXhwb3J0IGNvbnN0IFBFTkRJTkcgPSAnUEVORElORyc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgZGlzYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBleGVtcHQgZnJvbSBhbmNlc3RvclxuICogY2FsY3VsYXRpb25zIG9mIHZhbGlkaXR5IG9yIHZhbHVlLlxuICpcbiAqIEBzZWUgYG1hcmtBc0Rpc2FibGVkYFxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgRElTQUJMRUQgPSAnRElTQUJMRUQnO1xuXG5mdW5jdGlvbiBfZmluZChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIHBhdGg6IEFycmF5PHN0cmluZ3xudW1iZXI+fHN0cmluZywgZGVsaW1pdGVyOiBzdHJpbmcpIHtcbiAgaWYgKHBhdGggPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhdGgpKSB7XG4gICAgcGF0aCA9IHBhdGguc3BsaXQoZGVsaW1pdGVyKTtcbiAgfVxuICBpZiAoQXJyYXkuaXNBcnJheShwYXRoKSAmJiBwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgLy8gTm90IHVzaW5nIEFycmF5LnJlZHVjZSBoZXJlIGR1ZSB0byBhIENocm9tZSA4MCBidWdcbiAgLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9MTA0OTk4MlxuICBsZXQgY29udHJvbFRvRmluZDogQWJzdHJhY3RDb250cm9sfG51bGwgPSBjb250cm9sO1xuICBwYXRoLmZvckVhY2goKG5hbWU6IHN0cmluZ3xudW1iZXIpID0+IHtcbiAgICBpZiAoY29udHJvbFRvRmluZCBpbnN0YW5jZW9mIEZvcm1Hcm91cCkge1xuICAgICAgY29udHJvbFRvRmluZCA9IGNvbnRyb2xUb0ZpbmQuY29udHJvbHMuaGFzT3duUHJvcGVydHkobmFtZSBhcyBzdHJpbmcpID9cbiAgICAgICAgICBjb250cm9sVG9GaW5kLmNvbnRyb2xzW25hbWVdIDpcbiAgICAgICAgICBudWxsO1xuICAgIH0gZWxzZSBpZiAoY29udHJvbFRvRmluZCBpbnN0YW5jZW9mIEZvcm1BcnJheSkge1xuICAgICAgY29udHJvbFRvRmluZCA9IGNvbnRyb2xUb0ZpbmQuYXQoPG51bWJlcj5uYW1lKSB8fCBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb250cm9sVG9GaW5kID0gbnVsbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY29udHJvbFRvRmluZDtcbn1cblxuZnVuY3Rpb24gY29lcmNlVG9WYWxpZGF0b3IodmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCk6IFZhbGlkYXRvckZufG51bGwge1xuICBjb25zdCB2YWxpZGF0b3IgPVxuICAgICAgKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gKHZhbGlkYXRvck9yT3B0cyBhcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zKS52YWxpZGF0b3JzIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRvck9yT3B0cykgYXMgVmFsaWRhdG9yRm4gfFxuICAgICAgVmFsaWRhdG9yRm5bXSB8IG51bGw7XG5cbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsaWRhdG9yKSA/IGNvbXBvc2VWYWxpZGF0b3JzKHZhbGlkYXRvcikgOiB2YWxpZGF0b3IgfHwgbnVsbDtcbn1cblxuZnVuY3Rpb24gY29lcmNlVG9Bc3luY1ZhbGlkYXRvcihcbiAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwsXG4gICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwpOiBBc3luY1ZhbGlkYXRvckZufFxuICAgIG51bGwge1xuICBjb25zdCBvcmlnQXN5bmNWYWxpZGF0b3IgPVxuICAgICAgKGlzT3B0aW9uc09iaih2YWxpZGF0b3JPck9wdHMpID8gKHZhbGlkYXRvck9yT3B0cyBhcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zKS5hc3luY1ZhbGlkYXRvcnMgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmNWYWxpZGF0b3IpIGFzIEFzeW5jVmFsaWRhdG9yRm4gfFxuICAgICAgQXN5bmNWYWxpZGF0b3JGbiB8IG51bGw7XG5cbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkob3JpZ0FzeW5jVmFsaWRhdG9yKSA/IGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMob3JpZ0FzeW5jVmFsaWRhdG9yKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnQXN5bmNWYWxpZGF0b3IgfHwgbnVsbDtcbn1cblxuZXhwb3J0IHR5cGUgRm9ybUhvb2tzID0gJ2NoYW5nZSd8J2JsdXInfCdzdWJtaXQnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3Igb3B0aW9ucyBwcm92aWRlZCB0byBhbiBgQWJzdHJhY3RDb250cm9sYC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWJzdHJhY3RDb250cm9sT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGEgY29udHJvbC5cbiAgICovXG4gIHZhbGlkYXRvcnM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGw7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGxpc3Qgb2YgYXN5bmMgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGNvbnRyb2wuXG4gICAqL1xuICBhc3luY1ZhbGlkYXRvcnM/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsO1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBldmVudCBuYW1lIGZvciBjb250cm9sIHRvIHVwZGF0ZSB1cG9uLlxuICAgKi9cbiAgdXBkYXRlT24/OiAnY2hhbmdlJ3wnYmx1cid8J3N1Ym1pdCc7XG59XG5cblxuZnVuY3Rpb24gaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xcbiAgICAgICAgICAgICAgICAgICAgICBudWxsKTogYm9vbGVhbiB7XG4gIHJldHVybiB2YWxpZGF0b3JPck9wdHMgIT0gbnVsbCAmJiAhQXJyYXkuaXNBcnJheSh2YWxpZGF0b3JPck9wdHMpICYmXG4gICAgICB0eXBlb2YgdmFsaWRhdG9yT3JPcHRzID09PSAnb2JqZWN0Jztcbn1cblxuXG4vKipcbiAqIFRoaXMgaXMgdGhlIGJhc2UgY2xhc3MgZm9yIGBGb3JtQ29udHJvbGAsIGBGb3JtR3JvdXBgLCBhbmQgYEZvcm1BcnJheWAuXG4gKlxuICogSXQgcHJvdmlkZXMgc29tZSBvZiB0aGUgc2hhcmVkIGJlaGF2aW9yIHRoYXQgYWxsIGNvbnRyb2xzIGFuZCBncm91cHMgb2YgY29udHJvbHMgaGF2ZSwgbGlrZVxuICogcnVubmluZyB2YWxpZGF0b3JzLCBjYWxjdWxhdGluZyBzdGF0dXMsIGFuZCByZXNldHRpbmcgc3RhdGUuIEl0IGFsc28gZGVmaW5lcyB0aGUgcHJvcGVydGllc1xuICogdGhhdCBhcmUgc2hhcmVkIGJldHdlZW4gYWxsIHN1Yi1jbGFzc2VzLCBsaWtlIGB2YWx1ZWAsIGB2YWxpZGAsIGFuZCBgZGlydHlgLiBJdCBzaG91bGRuJ3QgYmVcbiAqIGluc3RhbnRpYXRlZCBkaXJlY3RseS5cbiAqXG4gKiBAc2VlIFtGb3JtcyBHdWlkZV0oL2d1aWRlL2Zvcm1zKVxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgW0R5bmFtaWMgRm9ybXMgR3VpZGVdKC9ndWlkZS9keW5hbWljLWZvcm0pXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX3BlbmRpbmdEaXJ0eSE6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX3BlbmRpbmdUb3VjaGVkITogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfdXBkYXRlT24hOiBGb3JtSG9va3M7XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgX3BhcmVudCE6IEZvcm1Hcm91cHxGb3JtQXJyYXk7XG4gIHByaXZhdGUgX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbjogYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogKiBGb3IgYSBgRm9ybUNvbnRyb2xgLCB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICogKiBGb3IgYW4gZW5hYmxlZCBgRm9ybUdyb3VwYCwgdGhlIHZhbHVlcyBvZiBlbmFibGVkIGNvbnRyb2xzIGFzIGFuIG9iamVjdFxuICAgKiB3aXRoIGEga2V5LXZhbHVlIHBhaXIgZm9yIGVhY2ggbWVtYmVyIG9mIHRoZSBncm91cC5cbiAgICogKiBGb3IgYSBkaXNhYmxlZCBgRm9ybUdyb3VwYCwgdGhlIHZhbHVlcyBvZiBhbGwgY29udHJvbHMgYXMgYW4gb2JqZWN0XG4gICAqIHdpdGggYSBrZXktdmFsdWUgcGFpciBmb3IgZWFjaCBtZW1iZXIgb2YgdGhlIGdyb3VwLlxuICAgKiAqIEZvciBhIGBGb3JtQXJyYXlgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IGFueTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQWJzdHJhY3RDb250cm9sIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgdGhlIHN5bmNocm9ub3VzIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbC5cbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIFRoZSBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGl0eSBvZiB0aGlzXG4gICAqIGNvbnRyb2wuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsaWRhdG9yOiBWYWxpZGF0b3JGbnxudWxsLCBwdWJsaWMgYXN5bmNWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCkge31cblxuICAvKipcbiAgICogVGhlIHBhcmVudCBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHBhcmVudCgpOiBGb3JtR3JvdXB8Rm9ybUFycmF5IHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB2YWxpZGF0aW9uIHN0YXR1cyBvZiB0aGUgY29udHJvbC4gVGhlcmUgYXJlIGZvdXIgcG9zc2libGVcbiAgICogdmFsaWRhdGlvbiBzdGF0dXMgdmFsdWVzOlxuICAgKlxuICAgKiAqICoqVkFMSUQqKjogVGhpcyBjb250cm9sIGhhcyBwYXNzZWQgYWxsIHZhbGlkYXRpb24gY2hlY2tzLlxuICAgKiAqICoqSU5WQUxJRCoqOiBUaGlzIGNvbnRyb2wgaGFzIGZhaWxlZCBhdCBsZWFzdCBvbmUgdmFsaWRhdGlvbiBjaGVjay5cbiAgICogKiAqKlBFTkRJTkcqKjogVGhpcyBjb250cm9sIGlzIGluIHRoZSBtaWRzdCBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjay5cbiAgICogKiAqKkRJU0FCTEVEKio6IFRoaXMgY29udHJvbCBpcyBleGVtcHQgZnJvbSB2YWxpZGF0aW9uIGNoZWNrcy5cbiAgICpcbiAgICogVGhlc2Ugc3RhdHVzIHZhbHVlcyBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlLCBzbyBhIGNvbnRyb2wgY2Fubm90IGJlXG4gICAqIGJvdGggdmFsaWQgQU5EIGludmFsaWQgb3IgaW52YWxpZCBBTkQgZGlzYWJsZWQuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1cyE6IHN0cmluZztcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGB2YWxpZGAgd2hlbiBpdHMgYHN0YXR1c2AgaXMgYFZBTElEYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgcGFzc2VkIGFsbCBvZiBpdHMgdmFsaWRhdGlvbiB0ZXN0cyxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IHZhbGlkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gVkFMSUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBpbnZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgSU5WQUxJRGAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGhhcyBmYWlsZWQgb25lIG9yIG1vcmUgb2YgaXRzIHZhbGlkYXRpb24gY2hlY2tzLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgaW52YWxpZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT09IElOVkFMSUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBwZW5kaW5nYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgUEVORElOR2AuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBjb250cm9sIGlzIGluIHRoZSBwcm9jZXNzIG9mIGNvbmR1Y3RpbmcgYSB2YWxpZGF0aW9uIGNoZWNrLFxuICAgKiBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBnZXQgcGVuZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMgPT0gUEVORElORztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGRpc2FibGVkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgRElTQUJMRURgLlxuICAgKlxuICAgKiBEaXNhYmxlZCBjb250cm9scyBhcmUgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGVpciBhbmNlc3RvclxuICAgKiBjb250cm9scy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBpcyBkaXNhYmxlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyA9PT0gRElTQUJMRUQ7XG4gIH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBlbmFibGVkYCBhcyBsb25nIGFzIGl0cyBgc3RhdHVzYCBpcyBub3QgYERJU0FCTEVEYC5cbiAgICpcbiAgICogQHJldHVybnMgVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgYW55IHN0YXR1cyBvdGhlciB0aGFuICdESVNBQkxFRCcsXG4gICAqIGZhbHNlIGlmIHRoZSBzdGF0dXMgaXMgJ0RJU0FCTEVEJy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICovXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN0YXR1cyAhPT0gRElTQUJMRUQ7XG4gIH1cblxuICAvKipcbiAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgYW55IGVycm9ycyBnZW5lcmF0ZWQgYnkgZmFpbGluZyB2YWxpZGF0aW9uLFxuICAgKiBvciBudWxsIGlmIHRoZXJlIGFyZSBubyBlcnJvcnMuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHVibGljIHJlYWRvbmx5IGVycm9ycyE6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBwcmlzdGluZWAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZFxuICAgKiB0aGUgdmFsdWUgaW4gdGhlIFVJLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWQgdGhlIHZhbHVlIGluIHRoZSBVSTsgY29tcGFyZSBgZGlydHlgLlxuICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmlzdGluZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlydHlgIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZVxuICAgKiBpbiB0aGUgVUkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlIG9mIHRoaXMgY29udHJvbCBpbiB0aGUgVUk7IGNvbXBhcmUgYHByaXN0aW5lYC5cbiAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBnZXQgZGlydHkoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnByaXN0aW5lO1xuICB9XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgbWFya2VkIGFzIGB0b3VjaGVkYC5cbiAgICpcbiAgICogQSBjb250cm9sIGlzIG1hcmtlZCBgdG91Y2hlZGAgb25jZSB0aGUgdXNlciBoYXMgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRvdWNoZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgY29udHJvbCBoYXMgbm90IGJlZW4gbWFya2VkIGFzIHRvdWNoZWRcbiAgICpcbiAgICogQSBjb250cm9sIGlzIGB1bnRvdWNoZWRgIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IHRyaWdnZXJlZFxuICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICovXG4gIGdldCB1bnRvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLnRvdWNoZWQ7XG4gIH1cblxuICAvKipcbiAgICogQSBtdWx0aWNhc3Rpbmcgb2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGV2ZW50IGV2ZXJ5IHRpbWUgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGNoYW5nZXMsIGluXG4gICAqIHRoZSBVSSBvciBwcm9ncmFtbWF0aWNhbGx5LiBJdCBhbHNvIGVtaXRzIGFuIGV2ZW50IGVhY2ggdGltZSB5b3UgY2FsbCBlbmFibGUoKSBvciBkaXNhYmxlKClcbiAgICogd2l0aG91dCBwYXNzaW5nIGFsb25nIHtlbWl0RXZlbnQ6IGZhbHNlfSBhcyBhIGZ1bmN0aW9uIGFyZ3VtZW50LlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHB1YmxpYyByZWFkb25seSB2YWx1ZUNoYW5nZXMhOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWxpZGF0aW9uIGBzdGF0dXNgIG9mIHRoZSBjb250cm9sXG4gICAqIHJlY2FsY3VsYXRlcy5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sLnN0YXR1c31cbiAgICpcbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwdWJsaWMgcmVhZG9ubHkgc3RhdHVzQ2hhbmdlcyE6IE9ic2VydmFibGU8YW55PjtcblxuICAvKipcbiAgICogUmVwb3J0cyB0aGUgdXBkYXRlIHN0cmF0ZWd5IG9mIHRoZSBgQWJzdHJhY3RDb250cm9sYCAobWVhbmluZ1xuICAgKiB0aGUgZXZlbnQgb24gd2hpY2ggdGhlIGNvbnRyb2wgdXBkYXRlcyBpdHNlbGYpLlxuICAgKiBQb3NzaWJsZSB2YWx1ZXM6IGAnY2hhbmdlJ2AgfCBgJ2JsdXInYCB8IGAnc3VibWl0J2BcbiAgICogRGVmYXVsdCB2YWx1ZTogYCdjaGFuZ2UnYFxuICAgKi9cbiAgZ2V0IHVwZGF0ZU9uKCk6IEZvcm1Ib29rcyB7XG4gICAgcmV0dXJuIHRoaXMuX3VwZGF0ZU9uID8gdGhpcy5fdXBkYXRlT24gOiAodGhpcy5wYXJlbnQgPyB0aGlzLnBhcmVudC51cGRhdGVPbiA6ICdjaGFuZ2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHRoYXQgYXJlIGFjdGl2ZSBvbiB0aGlzIGNvbnRyb2wuICBDYWxsaW5nXG4gICAqIHRoaXMgb3ZlcndyaXRlcyBhbnkgZXhpc3Rpbmcgc3luYyB2YWxpZGF0b3JzLlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBzZXRWYWxpZGF0b3JzKG5ld1ZhbGlkYXRvcjogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBjb2VyY2VUb1ZhbGlkYXRvcihuZXdWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGFzeW5jIHZhbGlkYXRvcnMgdGhhdCBhcmUgYWN0aXZlIG9uIHRoaXMgY29udHJvbC4gQ2FsbGluZyB0aGlzXG4gICAqIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIGFzeW5jIHZhbGlkYXRvcnMuXG4gICAqXG4gICAqIFdoZW4geW91IGFkZCBvciByZW1vdmUgYSB2YWxpZGF0b3IgYXQgcnVuIHRpbWUsIHlvdSBtdXN0IGNhbGxcbiAgICogYHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKWAgZm9yIHRoZSBuZXcgdmFsaWRhdGlvbiB0byB0YWtlIGVmZmVjdC5cbiAgICpcbiAgICovXG4gIHNldEFzeW5jVmFsaWRhdG9ycyhuZXdWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLmFzeW5jVmFsaWRhdG9yID0gY29lcmNlVG9Bc3luY1ZhbGlkYXRvcihuZXdWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBzeW5jIHZhbGlkYXRvciBsaXN0LlxuICAgKlxuICAgKiBXaGVuIHlvdSBhZGQgb3IgcmVtb3ZlIGEgdmFsaWRhdG9yIGF0IHJ1biB0aW1lLCB5b3UgbXVzdCBjYWxsXG4gICAqIGB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KClgIGZvciB0aGUgbmV3IHZhbGlkYXRpb24gdG8gdGFrZSBlZmZlY3QuXG4gICAqXG4gICAqL1xuICBjbGVhclZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBhc3luYyB2YWxpZGF0b3IgbGlzdC5cbiAgICpcbiAgICogV2hlbiB5b3UgYWRkIG9yIHJlbW92ZSBhIHZhbGlkYXRvciBhdCBydW4gdGltZSwgeW91IG11c3QgY2FsbFxuICAgKiBgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpYCBmb3IgdGhlIG5ldyB2YWxpZGF0aW9uIHRvIHRha2UgZWZmZWN0LlxuICAgKlxuICAgKi9cbiAgY2xlYXJBc3luY1ZhbGlkYXRvcnMoKTogdm9pZCB7XG4gICAgdGhpcy5hc3luY1ZhbGlkYXRvciA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHRvdWNoZWRgLiBBIGNvbnRyb2wgaXMgdG91Y2hlZCBieSBmb2N1cyBhbmRcbiAgICogYmx1ciBldmVudHMgdGhhdCBkbyBub3QgY2hhbmdlIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQHNlZSBgbWFya0FzVW50b3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc0RpcnR5KClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzVG91Y2hlZChvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhbmQgYWxsIGl0cyBkZXNjZW5kYW50IGNvbnRyb2xzIGFzIGB0b3VjaGVkYC5cbiAgICogQHNlZSBgbWFya0FzVG91Y2hlZCgpYFxuICAgKi9cbiAgbWFya0FsbEFzVG91Y2hlZCgpOiB2b2lkIHtcbiAgICB0aGlzLm1hcmtBc1RvdWNoZWQoe29ubHlTZWxmOiB0cnVlfSk7XG5cbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5tYXJrQWxsQXNUb3VjaGVkKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB1bnRvdWNoZWRgLlxuICAgKlxuICAgKiBJZiB0aGUgY29udHJvbCBoYXMgYW55IGNoaWxkcmVuLCBhbHNvIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgdW50b3VjaGVkYFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgdG91Y2hlZGAgc3RhdHVzIG9mIGFsbCBwYXJlbnQgY29udHJvbHMuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzRGlydHkoKWBcbiAgICogQHNlZSBgbWFya0FzUHJpc3RpbmUoKWBcbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzVW50b3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dG91Y2hlZDogYm9vbGVhbn0pLnRvdWNoZWQgPSBmYWxzZTtcbiAgICB0aGlzLl9wZW5kaW5nVG91Y2hlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIGNvbnRyb2wubWFya0FzVW50b3VjaGVkKHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgZGlydHlgLiBBIGNvbnRyb2wgYmVjb21lcyBkaXJ0eSB3aGVuXG4gICAqIHRoZSBjb250cm9sJ3MgdmFsdWUgaXMgY2hhbmdlZCB0aHJvdWdoIHRoZSBVSTsgY29tcGFyZSBgbWFya0FzVG91Y2hlZGAuXG4gICAqXG4gICAqIEBzZWUgYG1hcmtBc1RvdWNoZWQoKWBcbiAgICogQHNlZSBgbWFya0FzVW50b3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1ByaXN0aW5lKClgXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzRGlydHkob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtwcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzRGlydHkob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwcmlzdGluZWAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgcHJpc3RpbmVgLFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgcHJpc3RpbmVgIHN0YXR1cyBvZiBhbGwgcGFyZW50XG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiBAc2VlIGBtYXJrQXNUb3VjaGVkKClgXG4gICAqIEBzZWUgYG1hcmtBc1VudG91Y2hlZCgpYFxuICAgKiBAc2VlIGBtYXJrQXNEaXJ0eSgpYFxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIGVtaXRzIGV2ZW50cyBhZnRlclxuICAgKiBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuLlxuICAgKi9cbiAgbWFya0FzUHJpc3RpbmUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtwcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gdHJ1ZTtcbiAgICB0aGlzLl9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLm1hcmtBc1ByaXN0aW5lKHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHBlbmRpbmdgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgcGVuZGluZyB3aGlsZSB0aGUgY29udHJvbCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS4uXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgdGhlIGBzdGF0dXNDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlIGVtaXRzIGFuIGV2ZW50IHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgdGhlIGNvbnRyb2wgaXMgbWFya2VkIHBlbmRpbmcuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICpcbiAgICovXG4gIG1hcmtBc1BlbmRpbmcob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFzIHtzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IFBFTkRJTkc7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzUGVuZGluZyhvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGV4Y2x1ZGVkIGZyb20gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBhbnkgcGFyZW50LiBJdHMgc3RhdHVzIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBhbHNvIGRpc2FibGVkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBBYnN0cmFjdENvbnRyb2wuc3RhdHVzfVxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXNcbiAgICogY2hhbmdlcyBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLi5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIGRpc2FibGUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIC8vIElmIHBhcmVudCBoYXMgYmVlbiBtYXJrZWQgYXJ0aWZpY2lhbGx5IGRpcnR5IHdlIGRvbid0IHdhbnQgdG8gcmUtY2FsY3VsYXRlIHRoZVxuICAgIC8vIHBhcmVudCdzIGRpcnRpbmVzcyBiYXNlZCBvbiB0aGUgY2hpbGRyZW4uXG4gICAgY29uc3Qgc2tpcFByaXN0aW5lQ2hlY2sgPSB0aGlzLl9wYXJlbnRNYXJrZWREaXJ0eShvcHRzLm9ubHlTZWxmKTtcblxuICAgICh0aGlzIGFzIHtzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IERJU0FCTEVEO1xuICAgICh0aGlzIGFzIHtlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gbnVsbDtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgY29udHJvbC5kaXNhYmxlKHsuLi5vcHRzLCBvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIH0pO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxzdHJpbmc+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4odHJ1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgaW5jbHVkZWQgaW4gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgaXRzIHBhcmVudC4gSXRzIHN0YXR1cyByZWNhbGN1bGF0ZXMgYmFzZWQgb24gaXRzIHZhbHVlIGFuZFxuICAgKiBpdHMgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGVuYWJsZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbC5zdGF0dXN9XG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgY29udHJvbCBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgd2hlbiBtYXJrZWQgYXMgdW50b3VjaGVkXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyBlbmFibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBlbmFibGUob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIC8vIElmIHBhcmVudCBoYXMgYmVlbiBtYXJrZWQgYXJ0aWZpY2lhbGx5IGRpcnR5IHdlIGRvbid0IHdhbnQgdG8gcmUtY2FsY3VsYXRlIHRoZVxuICAgIC8vIHBhcmVudCdzIGRpcnRpbmVzcyBiYXNlZCBvbiB0aGUgY2hpbGRyZW4uXG4gICAgY29uc3Qgc2tpcFByaXN0aW5lQ2hlY2sgPSB0aGlzLl9wYXJlbnRNYXJrZWREaXJ0eShvcHRzLm9ubHlTZWxmKTtcblxuICAgICh0aGlzIGFzIHtzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IFZBTElEO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLmVuYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMoey4uLm9wdHMsIHNraXBQcmlzdGluZUNoZWNrfSk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4oZmFsc2UpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUFuY2VzdG9ycyhcbiAgICAgIG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW4sIHNraXBQcmlzdGluZUNoZWNrPzogYm9vbGVhbn0pIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICAgIGlmICghb3B0cy5za2lwUHJpc3RpbmVDaGVjaykge1xuICAgICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHBhcmVudCBTZXRzIHRoZSBwYXJlbnQgb2YgdGhlIGNvbnRyb2xcbiAgICovXG4gIHNldFBhcmVudChwYXJlbnQ6IEZvcm1Hcm91cHxGb3JtQXJyYXkpOiB2b2lkIHtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCByZXNldCh2YWx1ZT86IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpdCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiBpdHMgYW5jZXN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50c1xuICAgKiBhZnRlciB1cGRhdGVzIGFuZCB2YWxpZGl0eSBjaGVja3MgYXJlIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBvbmx5IHVwZGF0ZSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiB1cGRhdGUgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJbml0aWFsU3RhdHVzKCk7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcblxuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuX2NhbmNlbEV4aXN0aW5nU3Vic2NyaXB0aW9uKCk7XG4gICAgICAodGhpcyBhcyB7ZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzIHwgbnVsbH0pLmVycm9ycyA9IHRoaXMuX3J1blZhbGlkYXRvcigpO1xuICAgICAgKHRoaXMgYXMge3N0YXR1czogc3RyaW5nfSkuc3RhdHVzID0gdGhpcy5fY2FsY3VsYXRlU3RhdHVzKCk7XG5cbiAgICAgIGlmICh0aGlzLnN0YXR1cyA9PT0gVkFMSUQgfHwgdGhpcy5zdGF0dXMgPT09IFBFTkRJTkcpIHtcbiAgICAgICAgdGhpcy5fcnVuQXN5bmNWYWxpZGF0b3Iob3B0cy5lbWl0RXZlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRzLmVtaXRFdmVudCAhPT0gZmFsc2UpIHtcbiAgICAgICh0aGlzLnZhbHVlQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8YW55PikuZW1pdCh0aGlzLnZhbHVlKTtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPHN0cmluZz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRyZWVWYWxpZGl0eShvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7ZW1pdEV2ZW50OiB0cnVlfSkge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY3RybDogQWJzdHJhY3RDb250cm9sKSA9PiBjdHJsLl91cGRhdGVUcmVlVmFsaWRpdHkob3B0cykpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0cy5lbWl0RXZlbnR9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldEluaXRpYWxTdGF0dXMoKSB7XG4gICAgKHRoaXMgYXMge3N0YXR1czogc3RyaW5nfSkuc3RhdHVzID0gdGhpcy5fYWxsQ29udHJvbHNEaXNhYmxlZCgpID8gRElTQUJMRUQgOiBWQUxJRDtcbiAgfVxuXG4gIHByaXZhdGUgX3J1blZhbGlkYXRvcigpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRvciA/IHRoaXMudmFsaWRhdG9yKHRoaXMpIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX3J1bkFzeW5jVmFsaWRhdG9yKGVtaXRFdmVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hc3luY1ZhbGlkYXRvcikge1xuICAgICAgKHRoaXMgYXMge3N0YXR1czogc3RyaW5nfSkuc3RhdHVzID0gUEVORElORztcbiAgICAgIGNvbnN0IG9icyA9IHRvT2JzZXJ2YWJsZSh0aGlzLmFzeW5jVmFsaWRhdG9yKHRoaXMpKTtcbiAgICAgIHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbiA9XG4gICAgICAgICAgb2JzLnN1YnNjcmliZSgoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwpID0+IHRoaXMuc2V0RXJyb3JzKGVycm9ycywge2VtaXRFdmVudH0pKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9jYW5jZWxFeGlzdGluZ1N1YnNjcmlwdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hc3luY1ZhbGlkYXRpb25TdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBlcnJvcnMgb24gYSBmb3JtIGNvbnRyb2wgd2hlbiBydW5uaW5nIHZhbGlkYXRpb25zIG1hbnVhbGx5LCByYXRoZXIgdGhhbiBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBDYWxsaW5nIGBzZXRFcnJvcnNgIGFsc28gdXBkYXRlcyB0aGUgdmFsaWRpdHkgb2YgdGhlIHBhcmVudCBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgTWFudWFsbHkgc2V0IHRoZSBlcnJvcnMgZm9yIGEgY29udHJvbFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgbG9naW4gPSBuZXcgRm9ybUNvbnRyb2woJ3NvbWVMb2dpbicpO1xuICAgKiBsb2dpbi5zZXRFcnJvcnMoe1xuICAgKiAgIG5vdFVuaXF1ZTogdHJ1ZVxuICAgKiB9KTtcbiAgICpcbiAgICogZXhwZWN0KGxvZ2luLnZhbGlkKS50b0VxdWFsKGZhbHNlKTtcbiAgICogZXhwZWN0KGxvZ2luLmVycm9ycykudG9FcXVhbCh7IG5vdFVuaXF1ZTogdHJ1ZSB9KTtcbiAgICpcbiAgICogbG9naW4uc2V0VmFsdWUoJ3NvbWVPdGhlckxvZ2luJyk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbCh0cnVlKTtcbiAgICogYGBgXG4gICAqL1xuICBzZXRFcnJvcnMoZXJyb3JzOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwsIG9wdHM6IHtlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge2Vycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGx9KS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgdGhpcy5fdXBkYXRlQ29udHJvbHNFcnJvcnMob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBBIGRvdC1kZWxpbWl0ZWQgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZy9udW1iZXIgdmFsdWVzIHRoYXQgZGVmaW5lIHRoZSBwYXRoIHRvIHRoZVxuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUmV0cmlldmUgYSBuZXN0ZWQgY29udHJvbFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gZ2V0IGEgYG5hbWVgIGNvbnRyb2wgbmVzdGVkIHdpdGhpbiBhIGBwZXJzb25gIHN1Yi1ncm91cDpcbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldCgncGVyc29uLm5hbWUnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ3BlcnNvbicsICduYW1lJ10pO2BcbiAgICovXG4gIGdldChwYXRoOiBBcnJheTxzdHJpbmd8bnVtYmVyPnxzdHJpbmcpOiBBYnN0cmFjdENvbnRyb2x8bnVsbCB7XG4gICAgcmV0dXJuIF9maW5kKHRoaXMsIHBhdGgsICcuJyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogQHJldHVybnMgZXJyb3IgZGF0YSBmb3IgdGhhdCBwYXJ0aWN1bGFyIGVycm9yLiBJZiB0aGUgY29udHJvbCBvciBlcnJvciBpcyBub3QgcHJlc2VudCxcbiAgICogbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIGdldEVycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogQXJyYXk8c3RyaW5nfG51bWJlcj58c3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBjb250cm9sID0gcGF0aCA/IHRoaXMuZ2V0KHBhdGgpIDogdGhpcztcbiAgICByZXR1cm4gY29udHJvbCAmJiBjb250cm9sLmVycm9ycyA/IGNvbnRyb2wuZXJyb3JzW2Vycm9yQ29kZV0gOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGVycm9yIHNwZWNpZmllZC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgY29kZSBvZiB0aGUgZXJyb3IgdG8gY2hlY2tcbiAgICogQHBhcmFtIHBhdGggQSBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgdGhhdCBkZXNpZ25hdGVzIGhvdyB0byBtb3ZlIGZyb20gdGhlIGN1cnJlbnQgY29udHJvbFxuICAgKiB0byB0aGUgY29udHJvbCB0aGF0IHNob3VsZCBiZSBxdWVyaWVkIGZvciBlcnJvcnMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIEZvciBleGFtcGxlLCBmb3IgdGhlIGZvbGxvd2luZyBgRm9ybUdyb3VwYDpcbiAgICpcbiAgICogYGBgXG4gICAqIGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBhZGRyZXNzOiBuZXcgRm9ybUdyb3VwKHsgc3RyZWV0OiBuZXcgRm9ybUNvbnRyb2woKSB9KVxuICAgKiB9KTtcbiAgICogYGBgXG4gICAqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSAnc3RyZWV0JyBjb250cm9sIGZyb20gdGhlIHJvb3QgZm9ybSB3b3VsZCBiZSAnYWRkcmVzcycgLT4gJ3N0cmVldCcuXG4gICAqXG4gICAqIEl0IGNhbiBiZSBwcm92aWRlZCB0byB0aGlzIG1ldGhvZCBpbiBvbmUgb2YgdHdvIGZvcm1hdHM6XG4gICAqXG4gICAqIDEuIEFuIGFycmF5IG9mIHN0cmluZyBjb250cm9sIG5hbWVzLCBlLmcuIGBbJ2FkZHJlc3MnLCAnc3RyZWV0J11gXG4gICAqIDEuIEEgcGVyaW9kLWRlbGltaXRlZCBsaXN0IG9mIGNvbnRyb2wgbmFtZXMgaW4gb25lIHN0cmluZywgZS5nLiBgJ2FkZHJlc3Muc3RyZWV0J2BcbiAgICpcbiAgICogSWYgbm8gcGF0aCBpcyBnaXZlbiwgdGhpcyBtZXRob2QgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIGN1cnJlbnQgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gZXJyb3IgaXMgcHJlc2VudCBpbiB0aGUgY29udHJvbCBhdCB0aGUgZ2l2ZW4gcGF0aC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIGZhbHNlIGlzIHJldHVybmVkLlxuICAgKi9cbiAgaGFzRXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcsIHBhdGg/OiBBcnJheTxzdHJpbmd8bnVtYmVyPnxzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLmdldEVycm9yKGVycm9yQ29kZSwgcGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSB0b3AtbGV2ZWwgYW5jZXN0b3Igb2YgdGhpcyBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHJvb3QoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBsZXQgeDogQWJzdHJhY3RDb250cm9sID0gdGhpcztcblxuICAgIHdoaWxlICh4Ll9wYXJlbnQpIHtcbiAgICAgIHggPSB4Ll9wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSB0aGlzLl9jYWxjdWxhdGVTdGF0dXMoKTtcblxuICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICh0aGlzLnN0YXR1c0NoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPHN0cmluZz4pLmVtaXQodGhpcy5zdGF0dXMpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlQ29udHJvbHNFcnJvcnMoZW1pdEV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9pbml0T2JzZXJ2YWJsZXMoKSB7XG4gICAgKHRoaXMgYXMge3ZhbHVlQ2hhbmdlczogT2JzZXJ2YWJsZTxhbnk+fSkudmFsdWVDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICh0aGlzIGFzIHtzdGF0dXNDaGFuZ2VzOiBPYnNlcnZhYmxlPGFueT59KS5zdGF0dXNDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB9XG5cblxuICBwcml2YXRlIF9jYWxjdWxhdGVTdGF0dXMoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5fYWxsQ29udHJvbHNEaXNhYmxlZCgpKSByZXR1cm4gRElTQUJMRUQ7XG4gICAgaWYgKHRoaXMuZXJyb3JzKSByZXR1cm4gSU5WQUxJRDtcbiAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKFBFTkRJTkcpKSByZXR1cm4gUEVORElORztcbiAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKElOVkFMSUQpKSByZXR1cm4gSU5WQUxJRDtcbiAgICByZXR1cm4gVkFMSUQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF91cGRhdGVWYWx1ZSgpOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2ZvckVhY2hDaGlsZChjYjogRnVuY3Rpb24pOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNIYXZlU3RhdHVzKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuc3RhdHVzID09PSBzdGF0dXMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNEaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5kaXJ0eSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc1RvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wudG91Y2hlZCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ByaXN0aW5lOiBib29sZWFufSkucHJpc3RpbmUgPSAhdGhpcy5fYW55Q29udHJvbHNEaXJ0eSgpO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUb3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dG91Y2hlZDogYm9vbGVhbn0pLnRvdWNoZWQgPSB0aGlzLl9hbnlDb250cm9sc1RvdWNoZWQoKTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZChvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkRpc2FibGVkQ2hhbmdlOiBGdW5jdGlvbltdID0gW107XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaXNCb3hlZFZhbHVlKGZvcm1TdGF0ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHR5cGVvZiBmb3JtU3RhdGUgPT09ICdvYmplY3QnICYmIGZvcm1TdGF0ZSAhPT0gbnVsbCAmJlxuICAgICAgICBPYmplY3Qua2V5cyhmb3JtU3RhdGUpLmxlbmd0aCA9PT0gMiAmJiAndmFsdWUnIGluIGZvcm1TdGF0ZSAmJiAnZGlzYWJsZWQnIGluIGZvcm1TdGF0ZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcGRhdGVTdHJhdGVneShvcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwpOiB2b2lkIHtcbiAgICBpZiAoaXNPcHRpb25zT2JqKG9wdHMpICYmIChvcHRzIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnVwZGF0ZU9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3VwZGF0ZU9uID0gKG9wdHMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudXBkYXRlT24hO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgcGFyZW50IGhhcyBiZWVuIG1hcmtlZCBhcnRpZmljaWFsbHkgZGlydHkuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHJpdmF0ZSBfcGFyZW50TWFya2VkRGlydHkob25seVNlbGY/OiBib29sZWFuKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcGFyZW50RGlydHkgPSB0aGlzLl9wYXJlbnQgJiYgdGhpcy5fcGFyZW50LmRpcnR5O1xuICAgIHJldHVybiAhb25seVNlbGYgJiYgcGFyZW50RGlydHkgJiYgIXRoaXMuX3BhcmVudC5fYW55Q29udHJvbHNEaXJ0eSgpO1xuICB9XG59XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMgb2YgYW4gaW5kaXZpZHVhbCBmb3JtIGNvbnRyb2wuXG4gKlxuICogVGhpcyBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyBvZiBBbmd1bGFyIGZvcm1zLCBhbG9uZyB3aXRoXG4gKiBgRm9ybUdyb3VwYCBhbmQgYEZvcm1BcnJheWAuIEl0IGV4dGVuZHMgdGhlIGBBYnN0cmFjdENvbnRyb2xgIGNsYXNzIHRoYXRcbiAqIGltcGxlbWVudHMgbW9zdCBvZiB0aGUgYmFzZSBmdW5jdGlvbmFsaXR5IGZvciBhY2Nlc3NpbmcgdGhlIHZhbHVlLCB2YWxpZGF0aW9uIHN0YXR1cyxcbiAqIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBldmVudHMuXG4gKlxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBbVXNhZ2UgTm90ZXNdKCN1c2FnZS1ub3RlcylcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBJbml0aWFsaXppbmcgRm9ybSBDb250cm9sc1xuICpcbiAqIEluc3RhbnRpYXRlIGEgYEZvcm1Db250cm9sYCwgd2l0aCBhbiBpbml0aWFsIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKCdzb21lIHZhbHVlJyk7XG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgICAgIC8vICdzb21lIHZhbHVlJ1xuICpgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgd2l0aCBhIGZvcm0gc3RhdGUgb2JqZWN0LiBUaGUgYHZhbHVlYFxuICogYW5kIGBkaXNhYmxlZGAga2V5cyBhcmUgcmVxdWlyZWQgaW4gdGhpcyBjYXNlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjb250cm9sID0gbmV3IEZvcm1Db250cm9sKHsgdmFsdWU6ICduL2EnLCBkaXNhYmxlZDogdHJ1ZSB9KTtcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAgICAgLy8gJ24vYSdcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wuc3RhdHVzKTsgICAgLy8gJ0RJU0FCTEVEJ1xuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYSBzeW5jIHZhbGlkYXRvci5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgVmFsaWRhdG9ycy5yZXF1aXJlZCk7XG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgICAgICAvLyAnJ1xuICogY29uc29sZS5sb2coY29udHJvbC5zdGF0dXMpOyAgICAgLy8gJ0lOVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgaW5pdGlhbGl6ZXMgdGhlIGNvbnRyb2wgdXNpbmcgYW4gb3B0aW9ucyBvYmplY3QuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIHtcbiAqICAgIHZhbGlkYXRvcnM6IFZhbGlkYXRvcnMucmVxdWlyZWQsXG4gKiAgICBhc3luY1ZhbGlkYXRvcnM6IG15QXN5bmNWYWxpZGF0b3JcbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIENvbmZpZ3VyZSB0aGUgY29udHJvbCB0byB1cGRhdGUgb24gYSBibHVyIGV2ZW50XG4gKlxuICogU2V0IHRoZSBgdXBkYXRlT25gIG9wdGlvbiB0byBgJ2JsdXInYCB0byB1cGRhdGUgb24gdGhlIGJsdXIgYGV2ZW50YC5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnJywgeyB1cGRhdGVPbjogJ2JsdXInIH0pO1xuICogYGBgXG4gKlxuICogIyMjIENvbmZpZ3VyZSB0aGUgY29udHJvbCB0byB1cGRhdGUgb24gYSBzdWJtaXQgZXZlbnRcbiAqXG4gKiBTZXQgdGhlIGB1cGRhdGVPbmAgb3B0aW9uIHRvIGAnc3VibWl0J2AgdG8gdXBkYXRlIG9uIGEgc3VibWl0IGBldmVudGAuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woJycsIHsgdXBkYXRlT246ICdzdWJtaXQnIH0pO1xuICogYGBgXG4gKlxuICogIyMjIFJlc2V0IHRoZSBjb250cm9sIGJhY2sgdG8gYW4gaW5pdGlhbCB2YWx1ZVxuICpcbiAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyB0aHJvdWdoIGEgc3RhbmRhbG9uZVxuICogdmFsdWUgb3IgYSBmb3JtIHN0YXRlIG9iamVjdCB0aGF0IGNvbnRhaW5zIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0ZVxuICogKHRoZXNlIGFyZSB0aGUgb25seSB0d28gcHJvcGVydGllcyB0aGF0IGNhbm5vdCBiZSBjYWxjdWxhdGVkKS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgLy8gJ05hbmN5J1xuICpcbiAqIGNvbnRyb2wucmVzZXQoJ0RyZXcnKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgLy8gJ0RyZXcnXG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVzZXQgdGhlIGNvbnRyb2wgYmFjayB0byBhbiBpbml0aWFsIHZhbHVlIGFuZCBkaXNhYmxlZFxuICpcbiAqIGBgYFxuICogY29uc3QgY29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKTtcbiAqXG4gKiBjb25zb2xlLmxvZyhjb250cm9sLnZhbHVlKTsgLy8gJ05hbmN5J1xuICogY29uc29sZS5sb2coY29udHJvbC5zdGF0dXMpOyAvLyAnVkFMSUQnXG4gKlxuICogY29udHJvbC5yZXNldCh7IHZhbHVlOiAnRHJldycsIGRpc2FibGVkOiB0cnVlIH0pO1xuICpcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wudmFsdWUpOyAvLyAnRHJldydcbiAqIGNvbnNvbGUubG9nKGNvbnRyb2wuc3RhdHVzKTsgLy8gJ0RJU0FCTEVEJ1xuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2wgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wge1xuICAvKiogQGludGVybmFsICovXG4gIF9vbkNoYW5nZTogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdWYWx1ZTogYW55O1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdDaGFuZ2U6IGFueTtcblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgRm9ybUNvbnRyb2xgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIEluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgZm9ybVN0YXRlOiBhbnkgPSBudWxsLFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICBzdXBlcihcbiAgICAgICAgY29lcmNlVG9WYWxpZGF0b3IodmFsaWRhdG9yT3JPcHRzKSxcbiAgICAgICAgY29lcmNlVG9Bc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvciwgdmFsaWRhdG9yT3JPcHRzKSk7XG4gICAgdGhpcy5fYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlKTtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KTtcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgbmV3IHZhbHVlIGZvciB0aGUgZm9ybSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGNvbnRyb2wuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqICogYGVtaXRNb2RlbFRvVmlld0NoYW5nZWA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBvbkNoYW5nZWAgZXZlbnQgdG9cbiAgICogdXBkYXRlIHRoZSB2aWV3LlxuICAgKiAqIGBlbWl0Vmlld1RvTW9kZWxDaGFuZ2VgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGVhY2ggY2hhbmdlIHRyaWdnZXJzIGFuXG4gICAqIGBuZ01vZGVsQ2hhbmdlYFxuICAgKiBldmVudCB0byB1cGRhdGUgdGhlIG1vZGVsLlxuICAgKlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9uczoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuLFxuICAgIGVtaXRNb2RlbFRvVmlld0NoYW5nZT86IGJvb2xlYW4sXG4gICAgZW1pdFZpZXdUb01vZGVsQ2hhbmdlPzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcGVuZGluZ1ZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHRoaXMuX29uQ2hhbmdlLmxlbmd0aCAmJiBvcHRpb25zLmVtaXRNb2RlbFRvVmlld0NoYW5nZSAhPT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX29uQ2hhbmdlLmZvckVhY2goXG4gICAgICAgICAgKGNoYW5nZUZuKSA9PiBjaGFuZ2VGbih0aGlzLnZhbHVlLCBvcHRpb25zLmVtaXRWaWV3VG9Nb2RlbENoYW5nZSAhPT0gZmFsc2UpKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIGEgY29udHJvbC5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBmdW5jdGlvbmFsbHkgdGhlIHNhbWUgYXMge0BsaW5rIEZvcm1Db250cm9sI3NldFZhbHVlIHNldFZhbHVlfSBhdCB0aGlzIGxldmVsLlxuICAgKiBJdCBleGlzdHMgZm9yIHN5bW1ldHJ5IHdpdGgge0BsaW5rIEZvcm1Hcm91cCNwYXRjaFZhbHVlIHBhdGNoVmFsdWV9IG9uIGBGb3JtR3JvdXBzYCBhbmRcbiAgICogYEZvcm1BcnJheXNgLCB3aGVyZSBpdCBkb2VzIGJlaGF2ZSBkaWZmZXJlbnRseS5cbiAgICpcbiAgICogQHNlZSBgc2V0VmFsdWVgIGZvciBvcHRpb25zXG4gICAqL1xuICBwYXRjaFZhbHVlKHZhbHVlOiBhbnksIG9wdGlvbnM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW4sXG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbixcbiAgICBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U/OiBib29sZWFuLFxuICAgIGVtaXRWaWV3VG9Nb2RlbENoYW5nZT86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBmb3JtIGNvbnRyb2wsIG1hcmtpbmcgaXQgYHByaXN0aW5lYCBhbmQgYHVudG91Y2hlZGAsIGFuZCBzZXR0aW5nXG4gICAqIHRoZSB2YWx1ZSB0byBudWxsLlxuICAgKlxuICAgKiBAcGFyYW0gZm9ybVN0YXRlIFJlc2V0cyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKlxuICAgKi9cbiAgcmVzZXQoZm9ybVN0YXRlOiBhbnkgPSBudWxsLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlKTtcbiAgICB0aGlzLm1hcmtBc1ByaXN0aW5lKG9wdGlvbnMpO1xuICAgIHRoaXMubWFya0FzVW50b3VjaGVkKG9wdGlvbnMpO1xuICAgIHRoaXMuc2V0VmFsdWUodGhpcy52YWx1ZSwgb3B0aW9ucyk7XG4gICAgdGhpcy5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX3VwZGF0ZVZhbHVlKCkge31cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfYW55Q29udHJvbHMoY29uZGl0aW9uOiBGdW5jdGlvbik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGNoYW5nZSBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXNcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UucHVzaChmbik7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfY2xlYXJDaGFuZ2VGbnMoKTogdm9pZCB7XG4gICAgdGhpcy5fb25DaGFuZ2UgPSBbXTtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlID0gW107XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlID0gKCkgPT4ge307XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgZGlzYWJsZWQgZXZlbnRzLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIG1ldGhvZCB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBkaXNhYmxlZCBzdGF0dXMgY2hhbmdlcy5cbiAgICovXG4gIHJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShmbjogKGlzRGlzYWJsZWQ6IGJvb2xlYW4pID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLl9vbkRpc2FibGVkQ2hhbmdlLnB1c2goZm4pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2ZvckVhY2hDaGlsZChjYjogRnVuY3Rpb24pOiB2b2lkIHt9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy51cGRhdGVPbiA9PT0gJ3N1Ym1pdCcpIHtcbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nRGlydHkpIHRoaXMubWFya0FzRGlydHkoKTtcbiAgICAgIGlmICh0aGlzLl9wZW5kaW5nVG91Y2hlZCkgdGhpcy5tYXJrQXNUb3VjaGVkKCk7XG4gICAgICBpZiAodGhpcy5fcGVuZGluZ0NoYW5nZSkge1xuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuX3BlbmRpbmdWYWx1ZSwge29ubHlTZWxmOiB0cnVlLCBlbWl0TW9kZWxUb1ZpZXdDaGFuZ2U6IGZhbHNlfSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseUZvcm1TdGF0ZShmb3JtU3RhdGU6IGFueSkge1xuICAgIGlmICh0aGlzLl9pc0JveGVkVmFsdWUoZm9ybVN0YXRlKSkge1xuICAgICAgKHRoaXMgYXMge3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZS52YWx1ZTtcbiAgICAgIGZvcm1TdGF0ZS5kaXNhYmxlZCA/IHRoaXMuZGlzYWJsZSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMgYXMge3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUcmFja3MgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0ZSBvZiBhIGdyb3VwIG9mIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLlxuICpcbiAqIEEgYEZvcm1Hcm91cGAgYWdncmVnYXRlcyB0aGUgdmFsdWVzIG9mIGVhY2ggY2hpbGQgYEZvcm1Db250cm9sYCBpbnRvIG9uZSBvYmplY3QsXG4gKiB3aXRoIGVhY2ggY29udHJvbCBuYW1lIGFzIHRoZSBrZXkuICBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXNcbiAqIG9mIGl0cyBjaGlsZHJlbi4gRm9yIGV4YW1wbGUsIGlmIG9uZSBvZiB0aGUgY29udHJvbHMgaW4gYSBncm91cCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlXG4gKiBncm91cCBiZWNvbWVzIGludmFsaWQuXG4gKlxuICogYEZvcm1Hcm91cGAgaXMgb25lIG9mIHRoZSB0aHJlZSBmdW5kYW1lbnRhbCBidWlsZGluZyBibG9ja3MgdXNlZCB0byBkZWZpbmUgZm9ybXMgaW4gQW5ndWxhcixcbiAqIGFsb25nIHdpdGggYEZvcm1Db250cm9sYCBhbmQgYEZvcm1BcnJheWAuXG4gKlxuICogV2hlbiBpbnN0YW50aWF0aW5nIGEgYEZvcm1Hcm91cGAsIHBhc3MgaW4gYSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzIGFzIHRoZSBmaXJzdFxuICogYXJndW1lbnQuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgcmVnaXN0ZXJzIHRoZSBuYW1lIGZvciB0aGUgY29udHJvbC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggMiBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdOYW5jeScsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiB9KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q7ICdEcmV3J31cbiAqIGNvbnNvbGUubG9nKGZvcm0uc3RhdHVzKTsgIC8vICdWQUxJRCdcbiAqIGBgYFxuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggYSBncm91cC1sZXZlbCB2YWxpZGF0b3JcbiAqXG4gKiBZb3UgaW5jbHVkZSBncm91cC1sZXZlbCB2YWxpZGF0b3JzIGFzIHRoZSBzZWNvbmQgYXJnLCBvciBncm91cC1sZXZlbCBhc3luY1xuICogdmFsaWRhdG9ycyBhcyB0aGUgdGhpcmQgYXJnLiBUaGVzZSBjb21lIGluIGhhbmR5IHdoZW4geW91IHdhbnQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uXG4gKiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZCBjb250cm9sLlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBwYXNzd29yZDogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIHBhc3N3b3JkQ29uZmlybTogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiB9LCBwYXNzd29yZE1hdGNoVmFsaWRhdG9yKTtcbiAqXG4gKlxuICogZnVuY3Rpb24gcGFzc3dvcmRNYXRjaFZhbGlkYXRvcihnOiBGb3JtR3JvdXApIHtcbiAqICAgIHJldHVybiBnLmdldCgncGFzc3dvcmQnKS52YWx1ZSA9PT0gZy5nZXQoJ3Bhc3N3b3JkQ29uZmlybScpLnZhbHVlXG4gKiAgICAgICA/IG51bGwgOiB7J21pc21hdGNoJzogdHJ1ZX07XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBMaWtlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLCB5b3UgY2hvb3NlIHRvIHBhc3MgaW5cbiAqIHZhbGlkYXRvcnMgYW5kIGFzeW5jIHZhbGlkYXRvcnMgYXMgcGFydCBvZiBhbiBvcHRpb25zIG9iamVjdC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgcGFzc3dvcmQ6IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqICAgcGFzc3dvcmRDb25maXJtOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiB9LCB7IHZhbGlkYXRvcnM6IHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yczogb3RoZXJWYWxpZGF0b3IgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgU2V0IHRoZSB1cGRhdGVPbiBwcm9wZXJ0eSBmb3IgYWxsIGNvbnRyb2xzIGluIGEgZm9ybSBncm91cFxuICpcbiAqIFRoZSBvcHRpb25zIG9iamVjdCBpcyB1c2VkIHRvIHNldCBhIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggY2hpbGRcbiAqIGNvbnRyb2wncyBgdXBkYXRlT25gIHByb3BlcnR5LiBJZiB5b3Ugc2V0IGB1cGRhdGVPbmAgdG8gYCdibHVyJ2AgYXQgdGhlXG4gKiBncm91cCBsZXZlbCwgYWxsIGNoaWxkIGNvbnRyb2xzIGRlZmF1bHQgdG8gJ2JsdXInLCB1bmxlc3MgdGhlIGNoaWxkXG4gKiBoYXMgZXhwbGljaXRseSBzcGVjaWZpZWQgYSBkaWZmZXJlbnQgYHVwZGF0ZU9uYCB2YWx1ZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYyA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBvbmU6IG5ldyBGb3JtQ29udHJvbCgpXG4gKiB9LCB7IHVwZGF0ZU9uOiAnYmx1cicgfSk7XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBGb3JtR3JvdXAgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xzIEEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scy4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCBpcyB0aGUgbmFtZVxuICAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHZhbGlkYXRpb24gZnVuY3Rpb25zXG4gICAqIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBjb250cm9sczoge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCkge1xuICAgIHN1cGVyKFxuICAgICAgICBjb2VyY2VUb1ZhbGlkYXRvcih2YWxpZGF0b3JPck9wdHMpLFxuICAgICAgICBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgIHRoaXMuX3NldFVwQ29udHJvbHMoKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY29udHJvbCB3aXRoIHRoZSBncm91cCdzIGxpc3Qgb2YgY29udHJvbHMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGRvZXMgbm90IHVwZGF0ZSB0aGUgdmFsdWUgb3IgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqIFVzZSB7QGxpbmsgRm9ybUdyb3VwI2FkZENvbnRyb2wgYWRkQ29udHJvbH0gaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZWdpc3RlciBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICovXG4gIHJlZ2lzdGVyQ29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IEFic3RyYWN0Q29udHJvbCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHJldHVybiB0aGlzLmNvbnRyb2xzW25hbWVdO1xuICAgIHRoaXMuY29udHJvbHNbbmFtZV0gPSBjb250cm9sO1xuICAgIGNvbnRyb2wuc2V0UGFyZW50KHRoaXMpO1xuICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgcmV0dXJuIGNvbnRyb2w7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udHJvbCB0byB0aGlzIGdyb3VwLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byBhZGQgdG8gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuICBhZGRDb250cm9sKG5hbWU6IHN0cmluZywgY29udHJvbDogQWJzdHJhY3RDb250cm9sKTogdm9pZCB7XG4gICAgdGhpcy5yZWdpc3RlckNvbnRyb2wobmFtZSwgY29udHJvbCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgY29udHJvbCBmcm9tIHRoaXMgZ3JvdXAuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICovXG4gIHJlbW92ZUNvbnRyb2wobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZXBsYWNlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cbiAgc2V0Q29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSB0aGlzLmNvbnRyb2xzW25hbWVdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgZGVsZXRlICh0aGlzLmNvbnRyb2xzW25hbWVdKTtcbiAgICBpZiAoY29udHJvbCkgdGhpcy5yZWdpc3RlckNvbnRyb2wobmFtZSwgY29udHJvbCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciB0aGVyZSBpcyBhbiBlbmFibGVkIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gbmFtZSBpbiB0aGUgZ3JvdXAuXG4gICAqXG4gICAqIFJlcG9ydHMgZmFsc2UgZm9yIGRpc2FibGVkIGNvbnRyb2xzLiBJZiB5b3UnZCBsaWtlIHRvIGNoZWNrIGZvciBleGlzdGVuY2UgaW4gdGhlIGdyb3VwXG4gICAqIG9ubHksIHVzZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI2dldCBnZXR9IGluc3RlYWQuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sTmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGNoZWNrIGZvciBleGlzdGVuY2UgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICpcbiAgICogQHJldHVybnMgZmFsc2UgZm9yIGRpc2FibGVkIGNvbnRyb2xzLCB0cnVlIG90aGVyd2lzZS5cbiAgICovXG4gIGNvbnRhaW5zKGNvbnRyb2xOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5oYXNPd25Qcm9wZXJ0eShjb250cm9sTmFtZSkgJiYgdGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHRoYXQgbWF0Y2hlc1xuICAgKiB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cCwgd2l0aCBjb250cm9sIG5hbWVzIGFzIGtleXMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBTZXQgdGhlIGNvbXBsZXRlIHZhbHVlIGZvciB0aGUgZm9ybSBncm91cFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiBmb3JtLnNldFZhbHVlKHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfSk7XG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHRocm93cyBXaGVuIHN0cmljdCBjaGVja3MgZmFpbCwgc3VjaCBhcyBzZXR0aW5nIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2xcbiAgICogdGhhdCBkb2Vzbid0IGV4aXN0IG9yIGlmIHlvdSBleGNsdWRlIGEgdmFsdWUgb2YgYSBjb250cm9sIHRoYXQgZG9lcyBleGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBjb250cm9sIHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBzZXRWYWx1ZSh2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOlxuICAgICAgdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlKTtcbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHRoaXMuX3Rocm93SWZDb250cm9sTWlzc2luZyhuYW1lKTtcbiAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0uc2V0VmFsdWUodmFsdWVbbmFtZV0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggY29udHJvbFxuICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAqIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogSXQgYWNjZXB0cyBib3RoIHN1cGVyLXNldHMgYW5kIHN1Yi1zZXRzIG9mIHRoZSBncm91cCB3aXRob3V0IHRocm93aW5nIGFuIGVycm9yLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUGF0Y2ggdGhlIHZhbHVlIGZvciBhIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiB9KTtcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiBmb3JtLnBhdGNoVmFsdWUoe2ZpcnN0OiAnTmFuY3knfSk7XG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogbnVsbH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgaXMgcGF0Y2hlZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIHRydWUuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgcGF0Y2hWYWx1ZSh2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOlxuICAgICAgdm9pZCB7XG4gICAgT2JqZWN0LmtleXModmFsdWUpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkge1xuICAgICAgICB0aGlzLmNvbnRyb2xzW25hbWVdLnBhdGNoVmFsdWUodmFsdWVbbmFtZV0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGBGb3JtR3JvdXBgLCBtYXJrcyBhbGwgZGVzY2VuZGFudHMgYXJlIG1hcmtlZCBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCwgYW5kXG4gICAqIHRoZSB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gbnVsbC5cbiAgICpcbiAgICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIGluIGEgbWFwIG9mIHN0YXRlc1xuICAgKiB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB5b3VyIGZvcm0sIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLiBUaGUgc3RhdGVcbiAgICogaXMgYSBzdGFuZGFsb25lIHZhbHVlIG9yIGEgZm9ybSBzdGF0ZSBvYmplY3Qgd2l0aCBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWRcbiAgICogc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgUmVzZXRzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2hlbiB0aGUgZ3JvdXAgaXMgcmVzZXQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFJlc2V0IHRoZSBmb3JtIGdyb3VwIHZhbHVlc1xuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnZmlyc3QgbmFtZScpLFxuICAgKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnbGFzdCBuYW1lJylcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2ZpcnN0OiAnZmlyc3QgbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnfVxuICAgKlxuICAgKiBmb3JtLnJlc2V0KHsgZmlyc3Q6ICduYW1lJywgbGFzdDogJ2xhc3QgbmFtZScgfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2ZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnfVxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIFJlc2V0IHRoZSBmb3JtIGdyb3VwIHZhbHVlcyBhbmQgZGlzYWJsZWQgc3RhdHVzXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnZmlyc3QgbmFtZScpLFxuICAgKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnbGFzdCBuYW1lJylcbiAgICogfSk7XG4gICAqXG4gICAqIGZvcm0ucmVzZXQoe1xuICAgKiAgIGZpcnN0OiB7dmFsdWU6ICduYW1lJywgZGlzYWJsZWQ6IHRydWV9LFxuICAgKiAgIGxhc3Q6ICdsYXN0J1xuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2codGhpcy5mb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICogY29uc29sZS5sb2codGhpcy5mb3JtLmdldCgnZmlyc3QnKS5zdGF0dXMpOyAgLy8gJ0RJU0FCTEVEJ1xuICAgKiBgYGBcbiAgICovXG4gIHJlc2V0KHZhbHVlOiBhbnkgPSB7fSwgb3B0aW9uczoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnRyb2wucmVzZXQodmFsdWVbbmFtZV0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMuX3VwZGF0ZVByaXN0aW5lKG9wdGlvbnMpO1xuICAgIHRoaXMuX3VwZGF0ZVRvdWNoZWQob3B0aW9ucyk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLCBpbmNsdWRpbmcgYW55IGRpc2FibGVkIGNvbnRyb2xzLlxuICAgKlxuICAgKiBSZXRyaWV2ZXMgYWxsIHZhbHVlcyByZWdhcmRsZXNzIG9mIGRpc2FibGVkIHN0YXR1cy5cbiAgICogVGhlIGB2YWx1ZWAgcHJvcGVydHkgaXMgdGhlIGJlc3Qgd2F5IHRvIGdldCB0aGUgdmFsdWUgb2YgdGhlIGdyb3VwLCBiZWNhdXNlXG4gICAqIGl0IGV4Y2x1ZGVzIGRpc2FibGVkIGNvbnRyb2xzIGluIHRoZSBgRm9ybUdyb3VwYC5cbiAgICovXG4gIGdldFJhd1ZhbHVlKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlZHVjZUNoaWxkcmVuKFxuICAgICAgICB7fSwgKGFjYzoge1trOiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9LCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGFjY1tuYW1lXSA9IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtQ29udHJvbCA/IGNvbnRyb2wudmFsdWUgOiAoPGFueT5jb250cm9sKS5nZXRSYXdWYWx1ZSgpO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc3luY1BlbmRpbmdDb250cm9scygpOiBib29sZWFuIHtcbiAgICBsZXQgc3VidHJlZVVwZGF0ZWQgPSB0aGlzLl9yZWR1Y2VDaGlsZHJlbihmYWxzZSwgKHVwZGF0ZWQ6IGJvb2xlYW4sIGNoaWxkOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSk7XG4gICAgaWYgKHN1YnRyZWVVcGRhdGVkKSB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlfSk7XG4gICAgcmV0dXJuIHN1YnRyZWVVcGRhdGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdGhyb3dJZkNvbnRyb2xNaXNzaW5nKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghT2JqZWN0LmtleXModGhpcy5jb250cm9scykubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgICBUaGVyZSBhcmUgbm8gZm9ybSBjb250cm9scyByZWdpc3RlcmVkIHdpdGggdGhpcyBncm91cCB5ZXQuICBJZiB5b3UncmUgdXNpbmcgbmdNb2RlbCxcbiAgICAgICAgeW91IG1heSB3YW50IHRvIGNoZWNrIG5leHQgdGljayAoZS5nLiB1c2Ugc2V0VGltZW91dCkuXG4gICAgICBgKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBmaW5kIGZvcm0gY29udHJvbCB3aXRoIG5hbWU6ICR7bmFtZX0uYCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZm9yRWFjaENoaWxkKGNiOiAodjogYW55LCBrOiBzdHJpbmcpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5mb3JFYWNoKGsgPT4gY2IodGhpcy5jb250cm9sc1trXSwgaykpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0VXBDb250cm9scygpOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSh0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdXBkYXRlVmFsdWUoKTogdm9pZCB7XG4gICAgKHRoaXMgYXMge3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3JlZHVjZVZhbHVlKCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9scyhjb25kaXRpb246IEZ1bmN0aW9uKTogYm9vbGVhbiB7XG4gICAgbGV0IHJlcyA9IGZhbHNlO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIHJlcyA9IHJlcyB8fCAodGhpcy5jb250YWlucyhuYW1lKSAmJiBjb25kaXRpb24oY29udHJvbCkpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VWYWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oXG4gICAgICAgIHt9LCAoYWNjOiB7W2s6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0sIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgaWYgKGNvbnRyb2wuZW5hYmxlZCB8fCB0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICBhY2NbbmFtZV0gPSBjb250cm9sLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZUNoaWxkcmVuKGluaXRWYWx1ZTogYW55LCBmbjogRnVuY3Rpb24pIHtcbiAgICBsZXQgcmVzID0gaW5pdFZhbHVlO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIHJlcyA9IGZuKHJlcywgY29udHJvbCwgbmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjb250cm9sTmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKSkge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb250cm9scykubGVuZ3RoID4gMCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAodmFsdWVbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11c3Qgc3VwcGx5IGEgdmFsdWUgZm9yIGZvcm0gY29udHJvbCB3aXRoIG5hbWU6ICcke25hbWV9Jy5gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGFuIGFycmF5IG9mIGBGb3JtQ29udHJvbGAsXG4gKiBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUFycmF5YCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gYW4gYXJyYXkuXG4gKiBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXMgb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mXG4gKiB0aGUgY29udHJvbHMgaW4gYSBgRm9ybUFycmF5YCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlIGFycmF5IGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUFycmF5YCBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyB1c2VkIHRvIGRlZmluZSBmb3JtcyBpbiBBbmd1bGFyLFxuICogYWxvbmcgd2l0aCBgRm9ybUNvbnRyb2xgIGFuZCBgRm9ybUdyb3VwYC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYW4gYXJyYXkgb2YgZm9ybSBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogXSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbJ05hbmN5JywgJ0RyZXcnXVxuICogY29uc29sZS5sb2coYXJyLnN0YXR1cyk7ICAvLyAnVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBhcnJheSB3aXRoIGFycmF5LWxldmVsIHZhbGlkYXRvcnNcbiAqXG4gKiBZb3UgaW5jbHVkZSBhcnJheS1sZXZlbCB2YWxpZGF0b3JzIGFuZCBhc3luYyB2YWxpZGF0b3JzLiBUaGVzZSBjb21lIGluIGhhbmR5XG4gKiB3aGVuIHlvdSB3YW50IHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZFxuICogY29udHJvbC5cbiAqXG4gKiBUaGUgdHdvIHR5cGVzIG9mIHZhbGlkYXRvcnMgYXJlIHBhc3NlZCBpbiBzZXBhcmF0ZWx5IGFzIHRoZSBzZWNvbmQgYW5kIHRoaXJkIGFyZ1xuICogcmVzcGVjdGl2ZWx5LCBvciB0b2dldGhlciBhcyBwYXJ0IG9mIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKSxcbiAqICAgbmV3IEZvcm1Db250cm9sKCdEcmV3JylcbiAqIF0sIHt2YWxpZGF0b3JzOiBteVZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3JzOiBteUFzeW5jVmFsaWRhdG9yfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgU2V0IHRoZSB1cGRhdGVPbiBwcm9wZXJ0eSBmb3IgYWxsIGNvbnRyb2xzIGluIGEgZm9ybSBhcnJheVxuICpcbiAqIFRoZSBvcHRpb25zIG9iamVjdCBpcyB1c2VkIHRvIHNldCBhIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggY2hpbGRcbiAqIGNvbnRyb2wncyBgdXBkYXRlT25gIHByb3BlcnR5LiBJZiB5b3Ugc2V0IGB1cGRhdGVPbmAgdG8gYCdibHVyJ2AgYXQgdGhlXG4gKiBhcnJheSBsZXZlbCwgYWxsIGNoaWxkIGNvbnRyb2xzIGRlZmF1bHQgdG8gJ2JsdXInLCB1bmxlc3MgdGhlIGNoaWxkXG4gKiBoYXMgZXhwbGljaXRseSBzcGVjaWZpZWQgYSBkaWZmZXJlbnQgYHVwZGF0ZU9uYCB2YWx1ZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgICBuZXcgRm9ybUNvbnRyb2woKVxuICogXSwge3VwZGF0ZU9uOiAnYmx1cid9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBBZGRpbmcgb3IgcmVtb3ZpbmcgY29udHJvbHMgZnJvbSBhIGZvcm0gYXJyYXlcbiAqXG4gKiBUbyBjaGFuZ2UgdGhlIGNvbnRyb2xzIGluIHRoZSBhcnJheSwgdXNlIHRoZSBgcHVzaGAsIGBpbnNlcnRgLCBgcmVtb3ZlQXRgIG9yIGBjbGVhcmAgbWV0aG9kc1xuICogaW4gYEZvcm1BcnJheWAgaXRzZWxmLiBUaGVzZSBtZXRob2RzIGVuc3VyZSB0aGUgY29udHJvbHMgYXJlIHByb3Blcmx5IHRyYWNrZWQgaW4gdGhlXG4gKiBmb3JtJ3MgaGllcmFyY2h5LiBEbyBub3QgbW9kaWZ5IHRoZSBhcnJheSBvZiBgQWJzdHJhY3RDb250cm9sYHMgdXNlZCB0byBpbnN0YW50aWF0ZVxuICogdGhlIGBGb3JtQXJyYXlgIGRpcmVjdGx5LCBhcyB0aGF0IHJlc3VsdCBpbiBzdHJhbmdlIGFuZCB1bmV4cGVjdGVkIGJlaGF2aW9yIHN1Y2hcbiAqIGFzIGJyb2tlbiBjaGFuZ2UgZGV0ZWN0aW9uLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1BcnJheSBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBGb3JtQXJyYXlgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMuIEVhY2ggY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhbiBpbmRleFxuICAgKiB3aGVyZSBpdCBpcyByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHZhbGlkYXRpb24gZnVuY3Rpb25zXG4gICAqIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgICpcbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICAqXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHB1YmxpYyBjb250cm9sczogQWJzdHJhY3RDb250cm9sW10sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCkge1xuICAgIHN1cGVyKFxuICAgICAgICBjb2VyY2VUb1ZhbGlkYXRvcih2YWxpZGF0b3JPck9wdHMpLFxuICAgICAgICBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKGFzeW5jVmFsaWRhdG9yLCB2YWxpZGF0b3JPck9wdHMpKTtcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgIHRoaXMuX3NldFVwQ29udHJvbHMoKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBgQWJzdHJhY3RDb250cm9sYCBhdCB0aGUgZ2l2ZW4gYGluZGV4YCBpbiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gcmV0cmlldmUgdGhlIGNvbnRyb2xcbiAgICovXG4gIGF0KGluZGV4OiBudW1iZXIpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzW2luZGV4XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgcHVzaChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2xzLnB1c2goY29udHJvbCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIG5ldyBgQWJzdHJhY3RDb250cm9sYCBhdCB0aGUgZ2l2ZW4gYGluZGV4YCBpbiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gaW5zZXJ0IHRoZSBjb250cm9sXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgaW5zZXJ0KGluZGV4OiBudW1iZXIsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlbW92ZSB0aGUgY29udHJvbFxuICAgKi9cbiAgcmVtb3ZlQXQoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW2luZGV4XSkgdGhpcy5jb250cm9sc1tpbmRleF0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlcGxhY2UgdGhlIGNvbnRyb2xcbiAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGBBYnN0cmFjdENvbnRyb2xgIGNvbnRyb2wgdG8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgY29udHJvbFxuICAgKi9cbiAgc2V0Q29udHJvbChpbmRleDogbnVtYmVyLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tpbmRleF0pIHRoaXMuY29udHJvbHNbaW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgdGhpcy5jb250cm9scy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZW5ndGggb2YgdGhlIGNvbnRyb2wgYXJyYXkuXG4gICAqL1xuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUFycmF5YC4gSXQgYWNjZXB0cyBhbiBhcnJheSB0aGF0IG1hdGNoZXNcbiAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgcGVyZm9ybXMgc3RyaWN0IGNoZWNrcywgYW5kIHRocm93cyBhbiBlcnJvciBpZiB5b3UgdHJ5XG4gICAqIHRvIHNldCB0aGUgdmFsdWUgb2YgYSBjb250cm9sIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkZSB0aGVcbiAgICogdmFsdWUgb2YgYSBjb250cm9sLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU2V0IHRoZSB2YWx1ZXMgZm9yIHRoZSBjb250cm9scyBpbiB0aGUgZm9ybSBhcnJheVxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAqICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gW251bGwsIG51bGxdXG4gICAqXG4gICAqIGFyci5zZXRWYWx1ZShbJ05hbmN5JywgJ0RyZXcnXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsICdEcmV3J11cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBjb250cm9sc1xuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXNcbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdFxuICAgKiBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqL1xuICBzZXRWYWx1ZSh2YWx1ZTogYW55W10sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0FsbFZhbHVlc1ByZXNlbnQodmFsdWUpO1xuICAgIHZhbHVlLmZvckVhY2goKG5ld1ZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHRoaXMuX3Rocm93SWZDb250cm9sTWlzc2luZyhpbmRleCk7XG4gICAgICB0aGlzLmF0KGluZGV4KS5zZXRWYWx1ZShuZXdWYWx1ZSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybUFycmF5YC4gSXQgYWNjZXB0cyBhbiBhcnJheSB0aGF0IG1hdGNoZXMgdGhlXG4gICAqIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbCwgYW5kIGRvZXMgaXRzIGJlc3QgdG8gbWF0Y2ggdGhlIHZhbHVlcyB0byB0aGUgY29ycmVjdFxuICAgKiBjb250cm9scyBpbiB0aGUgZ3JvdXAuXG4gICAqXG4gICAqIEl0IGFjY2VwdHMgYm90aCBzdXBlci1zZXRzIGFuZCBzdWItc2V0cyBvZiB0aGUgYXJyYXkgd2l0aG91dCB0aHJvd2luZyBhbiBlcnJvci5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFBhdGNoIHRoZSB2YWx1ZXMgZm9yIGNvbnRyb2xzIGluIGEgZm9ybSBhcnJheVxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiBdKTtcbiAgICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbbnVsbCwgbnVsbF1cbiAgICpcbiAgICogYXJyLnBhdGNoVmFsdWUoWydOYW5jeSddKTtcbiAgICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbJ05hbmN5JywgbnVsbF1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiBsYXRlc3QgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgcGF0Y2hWYWx1ZSh2YWx1ZTogYW55W10sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAodGhpcy5hdChpbmRleCkpIHtcbiAgICAgICAgdGhpcy5hdChpbmRleCkucGF0Y2hWYWx1ZShuZXdWYWx1ZSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYEZvcm1BcnJheWAgYW5kIGFsbCBkZXNjZW5kYW50cyBhcmUgbWFya2VkIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgLCBhbmQgdGhlXG4gICAqIHZhbHVlIG9mIGFsbCBkZXNjZW5kYW50cyB0byBudWxsIG9yIG51bGwgbWFwcy5cbiAgICpcbiAgICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIGluIGFuIGFycmF5IG9mIHN0YXRlc1xuICAgKiB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgY29udHJvbC4gVGhlIHN0YXRlIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZVxuICAgKiBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFJlc2V0IHRoZSB2YWx1ZXMgaW4gYSBmb3JtIGFycmF5XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGFyci5yZXNldChbJ25hbWUnLCAnbGFzdCBuYW1lJ10pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyh0aGlzLmFyci52YWx1ZSk7ICAvLyBbJ25hbWUnLCAnbGFzdCBuYW1lJ11cbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgdmFsdWVzIGluIGEgZm9ybSBhcnJheSBhbmQgdGhlIGRpc2FibGVkIHN0YXR1cyBmb3IgdGhlIGZpcnN0IGNvbnRyb2xcbiAgICpcbiAgICogYGBgXG4gICAqIHRoaXMuYXJyLnJlc2V0KFtcbiAgICogICB7dmFsdWU6ICduYW1lJywgZGlzYWJsZWQ6IHRydWV9LFxuICAgKiAgICdsYXN0J1xuICAgKiBdKTtcbiAgICpcbiAgICogY29uc29sZS5sb2codGhpcy5hcnIudmFsdWUpOyAgLy8gWyduYW1lJywgJ2xhc3QgbmFtZSddXG4gICAqIGNvbnNvbGUubG9nKHRoaXMuYXJyLmdldCgwKS5zdGF0dXMpOyAgLy8gJ0RJU0FCTEVEJ1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIEFycmF5IG9mIHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlc1xuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0XG4gICAqIGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqL1xuICByZXNldCh2YWx1ZTogYW55ID0gW10sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgY29udHJvbC5yZXNldCh2YWx1ZVtpbmRleF0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMuX3VwZGF0ZVByaXN0aW5lKG9wdGlvbnMpO1xuICAgIHRoaXMuX3VwZGF0ZVRvdWNoZWQob3B0aW9ucyk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgdGhlIGFycmF5LCBpbmNsdWRpbmcgYW55IGRpc2FibGVkIGNvbnRyb2xzLlxuICAgKlxuICAgKiBSZXBvcnRzIGFsbCB2YWx1ZXMgcmVnYXJkbGVzcyBvZiBkaXNhYmxlZCBzdGF0dXMuXG4gICAqIEZvciBlbmFibGVkIGNvbnRyb2xzIG9ubHksIHRoZSBgdmFsdWVgIHByb3BlcnR5IGlzIHRoZSBiZXN0IHdheSB0byBnZXQgdGhlIHZhbHVlIG9mIHRoZSBhcnJheS5cbiAgICovXG4gIGdldFJhd1ZhbHVlKCk6IGFueVtdIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5tYXAoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgcmV0dXJuIGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtQ29udHJvbCA/IGNvbnRyb2wudmFsdWUgOiAoPGFueT5jb250cm9sKS5nZXRSYXdWYWx1ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgY29udHJvbHMgaW4gdGhlIGBGb3JtQXJyYXlgLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUmVtb3ZlIGFsbCBlbGVtZW50cyBmcm9tIGEgRm9ybUFycmF5XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci5sZW5ndGgpOyAgLy8gMlxuICAgKlxuICAgKiBhcnIuY2xlYXIoKTtcbiAgICogY29uc29sZS5sb2coYXJyLmxlbmd0aCk7ICAvLyAwXG4gICAqIGBgYFxuICAgKlxuICAgKiBJdCdzIGEgc2ltcGxlciBhbmQgbW9yZSBlZmZpY2llbnQgYWx0ZXJuYXRpdmUgdG8gcmVtb3ZpbmcgYWxsIGVsZW1lbnRzIG9uZSBieSBvbmU6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqXG4gICAqIHdoaWxlIChhcnIubGVuZ3RoKSB7XG4gICAqICAgIGFyci5yZW1vdmVBdCgwKTtcbiAgICogfVxuICAgKiBgYGBcbiAgICovXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzLmxlbmd0aCA8IDEpIHJldHVybjtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pKTtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZSgwKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5jb250cm9scy5yZWR1Y2UoKHVwZGF0ZWQ6IGJvb2xlYW4sIGNoaWxkOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlmIChzdWJ0cmVlVXBkYXRlZCkgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rocm93SWZDb250cm9sTWlzc2luZyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgVGhlcmUgYXJlIG5vIGZvcm0gY29udHJvbHMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgYXJyYXkgeWV0LiAgSWYgeW91J3JlIHVzaW5nIG5nTW9kZWwsXG4gICAgICAgIHlvdSBtYXkgd2FudCB0byBjaGVjayBuZXh0IHRpY2sgKGUuZy4gdXNlIHNldFRpbWVvdXQpLlxuICAgICAgYCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5hdChpbmRleCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZm9ybSBjb250cm9sIGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZm9yRWFjaENoaWxkKGNiOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbHMuZm9yRWFjaCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBjYihjb250cm9sLCBpbmRleCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID1cbiAgICAgICAgdGhpcy5jb250cm9scy5maWx0ZXIoKGNvbnRyb2wpID0+IGNvbnRyb2wuZW5hYmxlZCB8fCB0aGlzLmRpc2FibGVkKVxuICAgICAgICAgICAgLm1hcCgoY29udHJvbCkgPT4gY29udHJvbC52YWx1ZSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9scyhjb25kaXRpb246IEZ1bmN0aW9uKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMuc29tZSgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiBjb250cm9sLmVuYWJsZWQgJiYgY29uZGl0aW9uKGNvbnRyb2wpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwQ29udHJvbHMoKTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jaGVja0FsbFZhbHVlc1ByZXNlbnQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpOiBudW1iZXIpID0+IHtcbiAgICAgIGlmICh2YWx1ZVtpXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgTXVzdCBzdXBwbHkgYSB2YWx1ZSBmb3IgZm9ybSBjb250cm9sIGF0IGluZGV4OiAke2l9LmApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYWxsQ29udHJvbHNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBmb3IgKGNvbnN0IGNvbnRyb2wgb2YgdGhpcy5jb250cm9scykge1xuICAgICAgaWYgKGNvbnRyb2wuZW5hYmxlZCkgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5sZW5ndGggPiAwIHx8IHRoaXMuZGlzYWJsZWQ7XG4gIH1cblxuICBwcml2YXRlIF9yZWdpc3RlckNvbnRyb2woY29udHJvbDogQWJzdHJhY3RDb250cm9sKSB7XG4gICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyk7XG4gICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgfVxufVxuIl19