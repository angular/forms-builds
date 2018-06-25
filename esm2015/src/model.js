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
    if (!(path instanceof Array)) {
        path = path.split(delimiter);
    }
    if (path instanceof Array && (path.length === 0))
        return null;
    return path.reduce((v, name) => {
        if (v instanceof FormGroup) {
            return v.controls.hasOwnProperty(name) ? v.controls[name] : null;
        }
        if (v instanceof FormArray) {
            return v.at(name) || null;
        }
        return null;
    }, control);
}
function coerceToValidator(validatorOrOpts) {
    const validator = (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators :
        validatorOrOpts);
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function coerceToAsyncValidator(asyncValidator, validatorOrOpts) {
    const origAsyncValidator = (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators :
        asyncValidator);
    return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) :
        origAsyncValidator || null;
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
 */
export class AbstractControl {
    /**
     * Initialize the AbstractControl instance.
     *
     * @param validator The function that determines the synchronous validity of this control.
     * @param asyncValidator The function that determines the asynchronous validity of this
     * control.
     */
    constructor(validator, asyncValidator) {
        this.validator = validator;
        this.asyncValidator = asyncValidator;
        /** @internal */
        this._onCollectionChange = () => { };
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
    }
    /**
     * The parent control.
     */
    get parent() { return this._parent; }
    /**
     * A control is `valid` when its `status` is `VALID`.
     *
     * @see `status`
     *
     * @returns True if the control has passed all of its validation tests,
     * false otherwise.
     */
    get valid() { return this.status === VALID; }
    /**
     * A control is `invalid` when its `status` is `INVALID`.
     *
     * @see `status`
     *
     * @returns True if this control has failed one or more of its validation checks,
     * false otherwise.
     */
    get invalid() { return this.status === INVALID; }
    /**
     * A control is `pending` when its `status` is `PENDING`.
     *
     * @see `status`
     *
     * @returns True if this control is in the process of conducting a validation check,
     * false otherwise.
     */
    get pending() { return this.status == PENDING; }
    /**
     * A control is `disabled` when its `status` is `DISABLED`.
     *
     * @see `status`
     *
     * Disabled controls are exempt from validation checks and
     * are not included in the aggregate value of their ancestor
     * controls.
     *
     * @returns True if the control is disabled, false otherwise.
     */
    get disabled() { return this.status === DISABLED; }
    /**
     * A control is `enabled` as long as its `status` is not `DISABLED`.
     *
     * @see `status`
     *
     * @returns True if the control has any status other than 'DISABLED',
     * false if the status is 'DISABLED'.
     *
     */
    get enabled() { return this.status !== DISABLED; }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
     * Programmatic changes to a control's value do not mark it dirty.
     */
    get dirty() { return !this.pristine; }
    /**
     * True if the control has not been marked as touched
     *
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     */
    get untouched() { return !this.touched; }
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
     * this overwrites any existing sync validators.
     */
    setValidators(newValidator) {
        this.validator = coerceToValidator(newValidator);
    }
    /**
     * Sets the async validators that are active on this control. Calling this
     * overwrites any existing async validators.
     */
    setAsyncValidators(newValidator) {
        this.asyncValidator = coerceToAsyncValidator(newValidator);
    }
    /**
     * Empties out the sync validator list.
     */
    clearValidators() { this.validator = null; }
    /**
     * Empties out the async validator list.
     */
    clearAsyncValidators() { this.asyncValidator = null; }
    /**
     * Marks the control as `touched`. A control is touched by focus and
     * blur events that do not change the value; compare `markAsDirty`;
     *
     *  @param opts Configuration options that determine how the control propagates changes
     * and emits events events after marking is applied.
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
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     *  @param opts Configuration options that determine how the control propagates changes
     * and emits events after the marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsUntouched(opts = {}) {
        this.touched = false;
        this._pendingTouched = false;
        this._forEachChild((control) => { control.markAsUntouched({ onlySelf: true }); });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /**
     * Marks the control as `dirty`. A control becomes dirty when
     * the control's is changed through the UI; compare `markAsTouched`.
     *
     *  @param opts Configuration options that determine how the control propagates changes
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
     *  @param opts Configuration options that determine how the control emits events after
     * marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     */
    markAsPristine(opts = {}) {
        this.pristine = true;
        this._pendingDirty = false;
        this._forEachChild((control) => { control.markAsPristine({ onlySelf: true }); });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /**
     * Marks the control as `pending`.
     *
     * A control is pending while the control performs async validation.
     *
     *  @param opts Configuration options that determine how the control propagates changes and
     * emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
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
     *  @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control is disabled.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is disabled.
     * When false, no events are emitted.
     */
    disable(opts = {}) {
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild((control) => { control.disable(Object.assign({}, opts, { onlySelf: true })); });
        this._updateValue();
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        this._updateAncestors(opts);
        this._onDisabledChange.forEach((changeFn) => changeFn(true));
    }
    /**
     * Enables the control. This means the control is included in validation checks and
     * the aggregate value of its parent. Its status recalculates based on its value and
     * its validators.
     *
     * By default, if the control has children, all children are enabled.
     *
     *  @param opts Configure options that control how the control propagates changes and
     * emits events when marked as untouched
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false..
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     */
    enable(opts = {}) {
        this.status = VALID;
        this._forEachChild((control) => { control.enable(Object.assign({}, opts, { onlySelf: true })); });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors(opts);
        this._onDisabledChange.forEach((changeFn) => changeFn(false));
    }
    _updateAncestors(opts) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            this._parent._updatePristine();
            this._parent._updateTouched();
        }
    }
    /**
     * @param parent Sets the parent of the control
     */
    setParent(parent) { this._parent = parent; }
    /**
     * Recalculates the value and validation status of the control.
     *
     * By default, it also updates the value and validity of its ancestors.
     *
     * @param opts Configuration options determine how the control propagates changes and emits events
     * after updates and validity checks are applied.
     * * `onlySelf`: When true, only update this control. When false or not supplied,
     * update all direct ancestors. Default is false..
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
            const obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription =
                obs.subscribe((errors) => this.setErrors(errors, { emitEvent }));
        }
    }
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
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     */
    get(path) { return _find(this, path, '.'); }
    /**
     * Reports error data for a specific error occurring in this control or in another control.
     *
     * @param errorCode The error code for which to retrieve data
     * @param path The path to a control to check. If not supplied, checks for the error in this
     * control.
     *
     * @returns The error data if the control with the given path has the given error, otherwise null
     * or undefined.
     */
    getError(errorCode, path) {
        const control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    }
    /**
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The error code for which to retrieve data
     * @param path The path to a control to check. If not supplied, checks for the error in this
     * control.
     * @returns True when the control with the given path has the error, otherwise false.
     */
    hasError(errorCode, path) { return !!this.getError(errorCode, path); }
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
        if (this._anyControlsHaveStatus(PENDING))
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
    _registerOnCollectionChange(fn) { this._onCollectionChange = fn; }
    /** @internal */
    _setUpdateStrategy(opts) {
        if (isOptionsObj(opts) && opts.updateOn != null) {
            this._updateOn = opts.updateOn;
        }
    }
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
 * @usageNotes
 *
 * ### Initializing Form Controls
 *
 * Instantiate a `FormControl`, with an initial value.
 *
 * ```ts
 * const ctrl = new FormControl('some value');
 * console.log(ctrl.value);     // 'some value'
 *```
 *
 * The following example initializes the control with a form state object. The `value`
 * and `disabled` keys are required in this case.
 *
 * ```ts
 * const ctrl = new FormControl({ value: 'n/a', disabled: true });
 * console.log(ctrl.value);     // 'n/a'
 * console.log(ctrl.status);    // 'DISABLED'
 * ```
 *
 * The following example initializes the control with a sync validator.
 *
 * ```ts
 * const ctrl = new FormControl('', Validators.required);
 * console.log(ctrl.value);      // ''
 * console.log(ctrl.status);     // 'INVALID'
 * ```
 *
 * The following example initializes the control using an options object.
 *
 * ```ts
 * const ctrl = new FormControl('', {
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
 * const ctrl = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * ### Configure the control to update on a submit event
 *
 * Set the `updateOn` option to `'submit'` to update on a submit `event`.
 *
 * ```ts
 * const ctrl = new FormControl('', { updateOn: 'submit' });
 * ```
 *
 * ### Reset the control back to an initial value
 *
 * You reset to a specific form state by passing through a standalone
 * value or a form state object that contains both a value and a disabled state
 * (these are the only two properties that cannot be calculated).
 *
 * ```ts
 * const ctrl = new FormControl('Nancy');
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
 * const ctrl = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 * console.log(this.control.status); // 'DISABLED'
 *
 * control.reset({ value: 'Drew', disabled: true });
 *
 * console.log(this.control.value); // 'Drew'
 * console.log(this.control.status); // 'DISABLED'
 *
*/
export class FormControl extends AbstractControl {
    /**
    * Creates a new `FormControl` instance.
    *
    * @param formState Initializes the control with an initial state value,
    * or with an object that defines the initial value, status, and options
    * for handling updates and validation.
    *
    * @param validatorOrOpts A synchronous validator function, or an array of
    * such functions, or an `AbstractControlOptions` object that contains validation functions
    * and a validation trigger.
    *
    * @param asyncValidator A single async validator or array of async validator functions
    *
    */
    constructor(formState = null, validatorOrOpts, asyncValidator) {
        super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts));
        /** @internal */
        this._onChange = [];
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this._initObservables();
    }
    /**
     * Sets a new value for the form control.
     *
     * @param value The new value for the control.
     * @param options Configuration options that determine how the control proopagates changes
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
     * Resets the form control, marking it `pristine` and `untouched`, and setting
     * the value to null.
     *
     * @param formState Initializes the control with an initial state value,
     * or with an object that defines the initial value, status, and options
     * for handling updates and validation.
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
    reset(formState = null, options = {}) {
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
    _anyControls(condition) { return false; }
    /**
     * @internal
     */
    _allControlsDisabled() { return this.disabled; }
    /**
     * Register a listener for change events.
     *
     * @param fn The method that is called when the value changes
     */
    registerOnChange(fn) { this._onChange.push(fn); }
    /**
     * @internal
     */
    _clearChangeFns() {
        this._onChange = [];
        this._onDisabledChange = [];
        this._onCollectionChange = () => { };
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
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to add to the collection
     * @param control Provides the control for the given name
     */
    addControl(name, control) {
        this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Remove a control from this group.
     *
     * @param name The control name to remove from the collection
     */
    removeControl(name) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Replace an existing control.
     *
     * @param name The control name to replace in the collection
     * @param control Provides the control for the given name
     */
    setControl(name, control) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
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
     * only, use {@link AbstractControl#get get} instead.
     *
     * @param name The control name to check for existence in the collection
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
     *
     * ```
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you excluding the value of a control.
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
     * ### Patch the value for a form group
     *
     *  ```
     *  const form = new FormGroup({
     *     first: new FormControl(),
     *     last: new FormControl()
     *  });
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.patchValue({first: 'Nancy'});
     *  console.log(form.value);   // {first: 'Nancy', last: null}
     *
     *  ```
     *
     * @param value The object that matches the structure of the group
     * @param options Configure options that determines how the control propagates changes and
     * emits events after the value is patched
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        Object.keys(value).forEach(name => {
            if (this.controls[name]) {
                this.controls[name].patchValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
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
     * @param value Initializes the control with an initial state value,
     * or with an object that defines the initial value, status,
     * and options for handling updates and validation.
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
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     */
    reset(value = {}, options = {}) {
        this._forEachChild((control, name) => {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
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
        There are no form controls registered with this group yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.controls[name]) {
            throw new Error(`Cannot find form control with name: ${name}.`);
        }
    }
    /** @internal */
    _forEachChild(cb) {
        Object.keys(this.controls).forEach(k => cb(this.controls[k], k));
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => {
            control.setParent(this);
            control._registerOnCollectionChange(this._onCollectionChange);
        });
    }
    /** @internal */
    _updateValue() { this.value = this._reduceValue(); }
    /** @internal */
    _anyControls(condition) {
        let res = false;
        this._forEachChild((control, name) => {
            res = res || (this.contains(name) && condition(control));
        });
        return res;
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
        this._forEachChild((control, name) => { res = fn(res, control, name); });
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
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that result in strange and unexpected behavior such
 * as broken change detection.
 *
 *
 */
export class FormArray extends AbstractControl {
    /**
    * Creates a new `FormArray` instance.
    *
    * @param controls An array of child controls. Each child control is given an index
    * wheh it is registered.
    *
    * @param validatorOrOpts A synchronous validator function, or an array of
    * such functions, or an `AbstractControlOptions` object that contains validation functions
    * and a validation trigger.
    *
    * @param asyncValidator A single async validator or array of async validator functions
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
     * @param index Index in the array to retrieve the control
     */
    at(index) { return this.controls[index]; }
    /**
     * Insert a new `AbstractControl` at the end of the array.
     *
     * @param control Form control to be inserted
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
     * @param index Index in the array to insert the control
     * @param control Form control to be inserted
     */
    insert(index, control) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity();
    }
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param index Index in the array to remove the control
     */
    removeAt(index) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
        this.controls.splice(index, 1);
        this.updateValueAndValidity();
    }
    /**
     * Replace an existing control.
     *
     * @param index Index in the array to replace the control
     * @param control The `AbstractControl` control to replace the existing control
     */
    setControl(index, control) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
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
     */
    get length() { return this.controls.length; }
    /**
     * Sets the value of the `FormArray`. It accepts an array that matches
     * the structure of the control.
     *
     * This method performs strict checks, and throws an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
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
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
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
    reset(value = [], options = {}) {
        this._forEachChild((control, index) => {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
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
        There are no form controls registered with this array yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.at(index)) {
            throw new Error(`Cannot find form control at index ${index}`);
        }
    }
    /** @internal */
    _forEachChild(cb) {
        this.controls.forEach((control, index) => { cb(control, index); });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUMsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUU5RSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRTFDOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBRTdCOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRWpDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFFakM7Ozs7OztHQU1HO0FBQ0gsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUVuQyxlQUFlLE9BQXdCLEVBQUUsSUFBa0MsRUFBRSxTQUFpQjtJQUM1RixJQUFJLElBQUksSUFBSSxJQUFJO1FBQUUsT0FBTyxJQUFJLENBQUM7SUFFOUIsSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO1FBQzVCLElBQUksR0FBWSxJQUFLLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3hDO0lBQ0QsSUFBSSxJQUFJLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7UUFBRSxPQUFPLElBQUksQ0FBQztJQUU5RCxPQUE4QixJQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBa0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUN0RSxJQUFJLENBQUMsWUFBWSxTQUFTLEVBQUU7WUFDMUIsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFD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LElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUF3QixFQUFFLENBQVMsRUFBRSxFQUFFO1lBQ3pELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN6RTtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixvQkFBb0I7UUFDbEIsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25DLElBQUksT0FBTyxDQUFDLE9BQU87Z0JBQUUsT0FBTyxLQUFLLENBQUM7U0FDbkM7UUFDRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ25ELENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxPQUF3QjtRQUMvQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2NvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yRm59IGZyb20gJy4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmltcG9ydCB7dG9PYnNlcnZhYmxlfSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG4vKipcbiAqIFJlcG9ydHMgdGhhdCBhIEZvcm1Db250cm9sIGlzIHZhbGlkLCBtZWFuaW5nIHRoYXQgbm8gZXJyb3JzIGV4aXN0IGluIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBWQUxJRCA9ICdWQUxJRCc7XG5cbi8qKlxuICogUmVwb3J0cyB0aGF0IGEgRm9ybUNvbnRyb2wgaXMgaW52YWxpZCwgbWVhbmluZyB0aGF0IGFuIGVycm9yIGV4aXN0cyBpbiB0aGUgaW5wdXQgdmFsdWUuXG4gKlxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgSU5WQUxJRCA9ICdJTlZBTElEJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBwZW5kaW5nLCBtZWFuaW5nIHRoYXQgdGhhdCBhc3luYyB2YWxpZGF0aW9uIGlzIG9jY3VycmluZyBhbmRcbiAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS5cbiAqXG4gKiBAc2VlIGBtYXJrQXNQZW5kaW5nYFxuICogQHNlZSBgc3RhdHVzYFxuICovXG5leHBvcnQgY29uc3QgUEVORElORyA9ICdQRU5ESU5HJztcblxuLyoqXG4gKiBSZXBvcnRzIHRoYXQgYSBGb3JtQ29udHJvbCBpcyBkaXNhYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGV4ZW1wdCBmcm9tIGFuY2VzdG9yXG4gKiBjYWxjdWxhdGlvbnMgb2YgdmFsaWRpdHkgb3IgdmFsdWUuXG4gKlxuICogQHNlZSBgbWFya0FzRGlzYWJsZWRgXG4gKiBAc2VlIGBzdGF0dXNgXG4gKi9cbmV4cG9ydCBjb25zdCBESVNBQkxFRCA9ICdESVNBQkxFRCc7XG5cbmZ1bmN0aW9uIF9maW5kKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgcGF0aDogQXJyYXk8c3RyaW5nfG51bWJlcj58IHN0cmluZywgZGVsaW1pdGVyOiBzdHJpbmcpIHtcbiAgaWYgKHBhdGggPT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgaWYgKCEocGF0aCBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgIHBhdGggPSAoPHN0cmluZz5wYXRoKS5zcGxpdChkZWxpbWl0ZXIpO1xuICB9XG4gIGlmIChwYXRoIGluc3RhbmNlb2YgQXJyYXkgJiYgKHBhdGgubGVuZ3RoID09PSAwKSkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuICg8QXJyYXk8c3RyaW5nfG51bWJlcj4+cGF0aCkucmVkdWNlKCh2OiBBYnN0cmFjdENvbnRyb2wsIG5hbWUpID0+IHtcbiAgICBpZiAodiBpbnN0YW5jZW9mIEZvcm1Hcm91cCkge1xuICAgICAgcmV0dXJuIHYuY29udHJvbHMuaGFzT3duUHJvcGVydHkobmFtZSBhcyBzdHJpbmcpID8gdi5jb250cm9sc1tuYW1lXSA6IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHYgaW5zdGFuY2VvZiBGb3JtQXJyYXkpIHtcbiAgICAgIHJldHVybiB2LmF0KDxudW1iZXI+bmFtZSkgfHwgbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSwgY29udHJvbCk7XG59XG5cbmZ1bmN0aW9uIGNvZXJjZVRvVmFsaWRhdG9yKFxuICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZuIHwgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsKTogVmFsaWRhdG9yRm58XG4gICAgbnVsbCB7XG4gIGNvbnN0IHZhbGlkYXRvciA9XG4gICAgICAoaXNPcHRpb25zT2JqKHZhbGlkYXRvck9yT3B0cykgPyAodmFsaWRhdG9yT3JPcHRzIGFzIEFic3RyYWN0Q29udHJvbE9wdGlvbnMpLnZhbGlkYXRvcnMgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRhdG9yT3JPcHRzKSBhcyBWYWxpZGF0b3JGbiB8XG4gICAgICBWYWxpZGF0b3JGbltdIHwgbnVsbDtcblxuICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWxpZGF0b3IpID8gY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9yKSA6IHZhbGlkYXRvciB8fCBudWxsO1xufVxuXG5mdW5jdGlvbiBjb2VyY2VUb0FzeW5jVmFsaWRhdG9yKFxuICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbiB8IEFzeW5jVmFsaWRhdG9yRm5bXSB8IG51bGwsIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZuIHxcbiAgICAgICAgVmFsaWRhdG9yRm5bXSB8IEFic3RyYWN0Q29udHJvbE9wdGlvbnMgfCBudWxsKTogQXN5bmNWYWxpZGF0b3JGbnxudWxsIHtcbiAgY29uc3Qgb3JpZ0FzeW5jVmFsaWRhdG9yID1cbiAgICAgIChpc09wdGlvbnNPYmoodmFsaWRhdG9yT3JPcHRzKSA/ICh2YWxpZGF0b3JPck9wdHMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykuYXN5bmNWYWxpZGF0b3JzIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jVmFsaWRhdG9yKSBhcyBBc3luY1ZhbGlkYXRvckZuIHxcbiAgICAgIEFzeW5jVmFsaWRhdG9yRm4gfCBudWxsO1xuXG4gIHJldHVybiBBcnJheS5pc0FycmF5KG9yaWdBc3luY1ZhbGlkYXRvcikgPyBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKG9yaWdBc3luY1ZhbGlkYXRvcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ0FzeW5jVmFsaWRhdG9yIHx8IG51bGw7XG59XG5cbmV4cG9ydCB0eXBlIEZvcm1Ib29rcyA9ICdjaGFuZ2UnIHwgJ2JsdXInIHwgJ3N1Ym1pdCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBvcHRpb25zIHByb3ZpZGVkIHRvIGFuIGBBYnN0cmFjdENvbnRyb2xgLlxuICpcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHtcbiAgLyoqXG4gICAqIExpc3Qgb2YgdmFsaWRhdG9ycyBhcHBsaWVkIHRvIGNvbnRyb2wuXG4gICAqL1xuICB2YWxpZGF0b3JzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxudWxsO1xuICAvKipcbiAgICogTGlzdCBvZiBhc3luYyB2YWxpZGF0b3JzIGFwcGxpZWQgdG8gY29udHJvbC5cbiAgICovXG4gIGFzeW5jVmFsaWRhdG9ycz86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGw7XG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgbmFtZSBmb3IgY29udHJvbCB0byB1cGRhdGUgdXBvbi5cbiAgICovXG4gIHVwZGF0ZU9uPzogJ2NoYW5nZSd8J2JsdXInfCdzdWJtaXQnO1xufVxuXG5cbmZ1bmN0aW9uIGlzT3B0aW9uc09iaihcbiAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbiB8IFZhbGlkYXRvckZuW10gfCBBYnN0cmFjdENvbnRyb2xPcHRpb25zIHwgbnVsbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gdmFsaWRhdG9yT3JPcHRzICE9IG51bGwgJiYgIUFycmF5LmlzQXJyYXkodmFsaWRhdG9yT3JPcHRzKSAmJlxuICAgICAgdHlwZW9mIHZhbGlkYXRvck9yT3B0cyA9PT0gJ29iamVjdCc7XG59XG5cblxuLyoqXG4gKiBUaGlzIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCwgYW5kIGBGb3JtQXJyYXlgLlxuICpcbiAqIEl0IHByb3ZpZGVzIHNvbWUgb2YgdGhlIHNoYXJlZCBiZWhhdmlvciB0aGF0IGFsbCBjb250cm9scyBhbmQgZ3JvdXBzIG9mIGNvbnRyb2xzIGhhdmUsIGxpa2VcbiAqIHJ1bm5pbmcgdmFsaWRhdG9ycywgY2FsY3VsYXRpbmcgc3RhdHVzLCBhbmQgcmVzZXR0aW5nIHN0YXRlLiBJdCBhbHNvIGRlZmluZXMgdGhlIHByb3BlcnRpZXNcbiAqIHRoYXQgYXJlIHNoYXJlZCBiZXR3ZWVuIGFsbCBzdWItY2xhc3NlcywgbGlrZSBgdmFsdWVgLCBgdmFsaWRgLCBhbmQgYGRpcnR5YC4gSXQgc2hvdWxkbid0IGJlXG4gKiBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuXG4gKlxuICogQHNlZSBbRm9ybXMgR3VpZGVdKC9ndWlkZS9mb3JtcylcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXSgvZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIFtEeW5hbWljIEZvcm1zIEd1aWRlXSgvZ3VpZGUvZHluYW1pYy1mb3JtKVxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BlbmRpbmdEaXJ0eTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nVG91Y2hlZDogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVPbjogRm9ybUhvb2tzO1xuXG4gIHByaXZhdGUgX3BhcmVudDogRm9ybUdyb3VwfEZvcm1BcnJheTtcbiAgcHJpdmF0ZSBfYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uOiBhbnk7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiAqIEZvciBhIGBGb3JtQ29udHJvbGAsIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiAqIEZvciBhIGBGb3JtR3JvdXBgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gb2JqZWN0XG4gICAqIHdpdGggYSBrZXktdmFsdWUgcGFpciBmb3IgZWFjaCBtZW1iZXIgb2YgdGhlIGdyb3VwLlxuICAgKiAqIEZvciBhIGBGb3JtQXJyYXlgLCB0aGUgdmFsdWVzIG9mIGVuYWJsZWQgY29udHJvbHMgYXMgYW4gYXJyYXkuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWU6IGFueTtcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQWJzdHJhY3RDb250cm9sIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsaWRhdG9yIFRoZSBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgdGhlIHN5bmNocm9ub3VzIHZhbGlkaXR5IG9mIHRoaXMgY29udHJvbC5cbiAgICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIFRoZSBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgdGhlIGFzeW5jaHJvbm91cyB2YWxpZGl0eSBvZiB0aGlzXG4gICAqIGNvbnRyb2wuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsaWRhdG9yOiBWYWxpZGF0b3JGbnxudWxsLCBwdWJsaWMgYXN5bmNWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCkge31cblxuICAvKipcbiAgICogVGhlIHBhcmVudCBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHBhcmVudCgpOiBGb3JtR3JvdXB8Rm9ybUFycmF5IHsgcmV0dXJuIHRoaXMuX3BhcmVudDsgfVxuXG4gIC8qKlxuICAgKiBUaGUgdmFsaWRhdGlvbiBzdGF0dXMgb2YgdGhlIGNvbnRyb2wuIFRoZXJlIGFyZSBmb3VyIHBvc3NpYmxlXG4gICAqIHZhbGlkYXRpb24gc3RhdHVzIHZhbHVlczpcbiAgICpcbiAgICogKiAqKlZBTElEKio6IFRoaXMgY29udHJvbCBoYXMgcGFzc2VkIGFsbCB2YWxpZGF0aW9uIGNoZWNrcy5cbiAgICogKiAqKklOVkFMSUQqKjogVGhpcyBjb250cm9sIGhhcyBmYWlsZWQgYXQgbGVhc3Qgb25lIHZhbGlkYXRpb24gY2hlY2suXG4gICAqICogKipQRU5ESU5HKio6IFRoaXMgY29udHJvbCBpcyBpbiB0aGUgbWlkc3Qgb2YgY29uZHVjdGluZyBhIHZhbGlkYXRpb24gY2hlY2suXG4gICAqICogKipESVNBQkxFRCoqOiBUaGlzIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MuXG4gICAqXG4gICAqIFRoZXNlIHN0YXR1cyB2YWx1ZXMgYXJlIG11dHVhbGx5IGV4Y2x1c2l2ZSwgc28gYSBjb250cm9sIGNhbm5vdCBiZVxuICAgKiBib3RoIHZhbGlkIEFORCBpbnZhbGlkIG9yIGludmFsaWQgQU5EIGRpc2FibGVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YXR1czogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzYCBpcyBgVkFMSURgLlxuICAgKlxuICAgKiBAc2VlIGBzdGF0dXNgXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIHBhc3NlZCBhbGwgb2YgaXRzIHZhbGlkYXRpb24gdGVzdHMsXG4gICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCB2YWxpZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBWQUxJRDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGludmFsaWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBJTlZBTElEYC5cbiAgICpcbiAgICogQHNlZSBgc3RhdHVzYFxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgY29udHJvbCBoYXMgZmFpbGVkIG9uZSBvciBtb3JlIG9mIGl0cyB2YWxpZGF0aW9uIGNoZWNrcyxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IGludmFsaWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN0YXR1cyA9PT0gSU5WQUxJRDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHBlbmRpbmdgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBQRU5ESU5HYC5cbiAgICpcbiAgICogQHNlZSBgc3RhdHVzYFxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoaXMgY29udHJvbCBpcyBpbiB0aGUgcHJvY2VzcyBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjayxcbiAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKi9cbiAgZ2V0IHBlbmRpbmcoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN0YXR1cyA9PSBQRU5ESU5HOyB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlzYWJsZWRgIHdoZW4gaXRzIGBzdGF0dXNgIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIEBzZWUgYHN0YXR1c2BcbiAgICpcbiAgICogRGlzYWJsZWQgY29udHJvbHMgYXJlIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZFxuICAgKiBhcmUgbm90IGluY2x1ZGVkIGluIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgdGhlaXIgYW5jZXN0b3JcbiAgICogY29udHJvbHMuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICovXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3RhdHVzID09PSBESVNBQkxFRDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGVuYWJsZWRgIGFzIGxvbmcgYXMgaXRzIGBzdGF0dXNgIGlzIG5vdCBgRElTQUJMRURgLlxuICAgKlxuICAgKiBAc2VlIGBzdGF0dXNgXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIGFueSBzdGF0dXMgb3RoZXIgdGhhbiAnRElTQUJMRUQnLFxuICAgKiBmYWxzZSBpZiB0aGUgc3RhdHVzIGlzICdESVNBQkxFRCcuXG4gICAqXG4gICAqL1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3RhdHVzICE9PSBESVNBQkxFRDsgfVxuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBhbnkgZXJyb3JzIGdlbmVyYXRlZCBieSBmYWlsaW5nIHZhbGlkYXRpb24sXG4gICAqIG9yIG51bGwgaWYgdGhlcmUgYXJlIG5vIGVycm9ycy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnN8bnVsbDtcblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBwcmlzdGluZWAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgY2hhbmdlZFxuICAgKiB0aGUgdmFsdWUgaW4gdGhlIFVJLlxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIGlmIHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWQgdGhlIHZhbHVlIGluIHRoZSBVSTsgY29tcGFyZSBgZGlydHlgLlxuICAgKiBQcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSBkbyBub3QgbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBwcmlzdGluZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgZGlydHlgIGlmIHRoZSB1c2VyIGhhcyBjaGFuZ2VkIHRoZSB2YWx1ZVxuICAgKiBpbiB0aGUgVUkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRydWUgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlIG9mIHRoaXMgY29udHJvbCBpbiB0aGUgVUk7IGNvbXBhcmUgYHByaXN0aW5lYC5cbiAgICogUHJvZ3JhbW1hdGljIGNoYW5nZXMgdG8gYSBjb250cm9sJ3MgdmFsdWUgZG8gbm90IG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBnZXQgZGlydHkoKTogYm9vbGVhbiB7IHJldHVybiAhdGhpcy5wcmlzdGluZTsgfVxuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBjb250cm9sIGlzIG1hcmtlZCBhcyBgdG91Y2hlZGAuXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBtYXJrZWQgYHRvdWNoZWRgIG9uY2UgdGhlIHVzZXIgaGFzIHRyaWdnZXJlZFxuICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0b3VjaGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIGNvbnRyb2wgaGFzIG5vdCBiZWVuIG1hcmtlZCBhcyB0b3VjaGVkXG4gICAqXG4gICAqIEEgY29udHJvbCBpcyBgdW50b3VjaGVkYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBnZXQgdW50b3VjaGVkKCk6IGJvb2xlYW4geyByZXR1cm4gIXRoaXMudG91Y2hlZDsgfVxuXG4gIC8qKlxuICAgKiBBIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wgY2hhbmdlcywgaW5cbiAgICogdGhlIFVJIG9yIHByb2dyYW1tYXRpY2FsbHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgdmFsdWVDaGFuZ2VzOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgLyoqXG4gICAqIEEgbXVsdGljYXN0aW5nIG9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBldmVudCBldmVyeSB0aW1lIHRoZSB2YWxpZGF0aW9uIGBzdGF0dXNgIG9mIHRoZSBjb250cm9sXG4gICAqIHJlY2FsY3VsYXRlcy5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzdGF0dXNDaGFuZ2VzOiBPYnNlcnZhYmxlPGFueT47XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgdGhlIHVwZGF0ZSBzdHJhdGVneSBvZiB0aGUgYEFic3RyYWN0Q29udHJvbGAgKG1lYW5pbmdcbiAgICogdGhlIGV2ZW50IG9uIHdoaWNoIHRoZSBjb250cm9sIHVwZGF0ZXMgaXRzZWxmKS5cbiAgICogUG9zc2libGUgdmFsdWVzOiBgJ2NoYW5nZSdgIHwgYCdibHVyJ2AgfCBgJ3N1Ym1pdCdgXG4gICAqIERlZmF1bHQgdmFsdWU6IGAnY2hhbmdlJ2BcbiAgICovXG4gIGdldCB1cGRhdGVPbigpOiBGb3JtSG9va3Mge1xuICAgIHJldHVybiB0aGlzLl91cGRhdGVPbiA/IHRoaXMuX3VwZGF0ZU9uIDogKHRoaXMucGFyZW50ID8gdGhpcy5wYXJlbnQudXBkYXRlT24gOiAnY2hhbmdlJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgc3luY2hyb25vdXMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiAgQ2FsbGluZ1xuICAgKiB0aGlzIG92ZXJ3cml0ZXMgYW55IGV4aXN0aW5nIHN5bmMgdmFsaWRhdG9ycy5cbiAgICovXG4gIHNldFZhbGlkYXRvcnMobmV3VmFsaWRhdG9yOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLnZhbGlkYXRvciA9IGNvZXJjZVRvVmFsaWRhdG9yKG5ld1ZhbGlkYXRvcik7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgYXN5bmMgdmFsaWRhdG9ycyB0aGF0IGFyZSBhY3RpdmUgb24gdGhpcyBjb250cm9sLiBDYWxsaW5nIHRoaXNcbiAgICogb3ZlcndyaXRlcyBhbnkgZXhpc3RpbmcgYXN5bmMgdmFsaWRhdG9ycy5cbiAgICovXG4gIHNldEFzeW5jVmFsaWRhdG9ycyhuZXdWYWxpZGF0b3I6IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpOiB2b2lkIHtcbiAgICB0aGlzLmFzeW5jVmFsaWRhdG9yID0gY29lcmNlVG9Bc3luY1ZhbGlkYXRvcihuZXdWYWxpZGF0b3IpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtcHRpZXMgb3V0IHRoZSBzeW5jIHZhbGlkYXRvciBsaXN0LlxuICAgKi9cbiAgY2xlYXJWYWxpZGF0b3JzKCk6IHZvaWQgeyB0aGlzLnZhbGlkYXRvciA9IG51bGw7IH1cblxuICAvKipcbiAgICogRW1wdGllcyBvdXQgdGhlIGFzeW5jIHZhbGlkYXRvciBsaXN0LlxuICAgKi9cbiAgY2xlYXJBc3luY1ZhbGlkYXRvcnMoKTogdm9pZCB7IHRoaXMuYXN5bmNWYWxpZGF0b3IgPSBudWxsOyB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGB0b3VjaGVkYC4gQSBjb250cm9sIGlzIHRvdWNoZWQgYnkgZm9jdXMgYW5kXG4gICAqIGJsdXIgZXZlbnRzIHRoYXQgZG8gbm90IGNoYW5nZSB0aGUgdmFsdWU7IGNvbXBhcmUgYG1hcmtBc0RpcnR5YDtcbiAgICpcbiAgICogIEBwYXJhbSBvcHRzIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc1RvdWNoZWQob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFze3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl9wYXJlbnQgJiYgIW9wdHMub25seVNlbGYpIHtcbiAgICAgIHRoaXMuX3BhcmVudC5tYXJrQXNUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgdW50b3VjaGVkYC5cbiAgICpcbiAgICogSWYgdGhlIGNvbnRyb2wgaGFzIGFueSBjaGlsZHJlbiwgYWxzbyBtYXJrcyBhbGwgY2hpbGRyZW4gYXMgYHVudG91Y2hlZGBcbiAgICogYW5kIHJlY2FsY3VsYXRlcyB0aGUgYHRvdWNoZWRgIHN0YXR1cyBvZiBhbGwgcGFyZW50IGNvbnRyb2xzLlxuICAgKlxuICAgKiAgQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLlxuICAgKi9cbiAgbWFya0FzVW50b3VjaGVkKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3t0b3VjaGVkOiBib29sZWFufSkudG91Y2hlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3BlbmRpbmdUb3VjaGVkID0gZmFsc2U7XG5cbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoXG4gICAgICAgIChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHsgY29udHJvbC5tYXJrQXNVbnRvdWNoZWQoe29ubHlTZWxmOiB0cnVlfSk7IH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVUb3VjaGVkKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGUgY29udHJvbCBhcyBgZGlydHlgLiBBIGNvbnRyb2wgYmVjb21lcyBkaXJ0eSB3aGVuXG4gICAqIHRoZSBjb250cm9sJ3MgaXMgY2hhbmdlZCB0aHJvdWdoIHRoZSBVSTsgY29tcGFyZSBgbWFya0FzVG91Y2hlZGAuXG4gICAqXG4gICAqICBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIGFmdGVyIG1hcmtpbmcgaXMgYXBwbGllZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS5cbiAgICovXG4gIG1hcmtBc0RpcnR5KG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3twcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzRGlydHkob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBjb250cm9sIGFzIGBwcmlzdGluZWAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBhbnkgY2hpbGRyZW4sIG1hcmtzIGFsbCBjaGlsZHJlbiBhcyBgcHJpc3RpbmVgLFxuICAgKiBhbmQgcmVjYWxjdWxhdGVzIHRoZSBgcHJpc3RpbmVgIHN0YXR1cyBvZiBhbGwgcGFyZW50XG4gICAqIGNvbnRyb2xzLlxuICAgKlxuICAgKiAgQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBlbWl0cyBldmVudHMgYWZ0ZXJcbiAgICogbWFya2luZyBpcyBhcHBsaWVkLlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLi5cbiAgICovXG4gIG1hcmtBc1ByaXN0aW5lKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3twcmlzdGluZTogYm9vbGVhbn0pLnByaXN0aW5lID0gdHJ1ZTtcbiAgICB0aGlzLl9wZW5kaW5nRGlydHkgPSBmYWxzZTtcblxuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7IGNvbnRyb2wubWFya0FzUHJpc3RpbmUoe29ubHlTZWxmOiB0cnVlfSk7IH0pO1xuXG4gICAgaWYgKHRoaXMuX3BhcmVudCAmJiAhb3B0cy5vbmx5U2VsZikge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVQcmlzdGluZShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTWFya3MgdGhlIGNvbnRyb2wgYXMgYHBlbmRpbmdgLlxuICAgKlxuICAgKiBBIGNvbnRyb2wgaXMgcGVuZGluZyB3aGlsZSB0aGUgY29udHJvbCBwZXJmb3JtcyBhc3luYyB2YWxpZGF0aW9uLlxuICAgKlxuICAgKiAgQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciBtYXJraW5nIGlzIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBtYXJrIG9ubHkgdGhpcyBjb250cm9sLiBXaGVuIGZhbHNlIG9yIG5vdCBzdXBwbGllZCxcbiAgICogbWFya3MgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIHRoZSBgc3RhdHVzQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZSBlbWl0cyBhbiBldmVudCB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIHRoZSBjb250cm9sIGlzIG1hcmtlZCBwZW5kaW5nLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqXG4gICAqL1xuICBtYXJrQXNQZW5kaW5nKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3tzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IFBFTkRJTkc7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxhbnk+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQubWFya0FzUGVuZGluZyhvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGV4Y2x1ZGVkIGZyb20gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiBhbnkgcGFyZW50LiBJdHMgc3RhdHVzIGlzIGBESVNBQkxFRGAuXG4gICAqXG4gICAqIElmIHRoZSBjb250cm9sIGhhcyBjaGlsZHJlbiwgYWxsIGNoaWxkcmVuIGFyZSBhbHNvIGRpc2FibGVkLlxuICAgKlxuICAgKiAgQHBhcmFtIG9wdHMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzXG4gICAqIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgY29udHJvbCBpcyBkaXNhYmxlZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIG1hcmsgb25seSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiBtYXJrcyBhbGwgZGlyZWN0IGFuY2VzdG9ycy4gRGVmYXVsdCBpcyBmYWxzZS4uXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIGRpc2FibGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBkaXNhYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3tzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IERJU0FCTEVEO1xuICAgICh0aGlzIGFze2Vycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGx9KS5lcnJvcnMgPSBudWxsO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZChcbiAgICAgICAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4geyBjb250cm9sLmRpc2FibGUoey4uLm9wdHMsIG9ubHlTZWxmOiB0cnVlfSk7IH0pO1xuICAgIHRoaXMuX3VwZGF0ZVZhbHVlKCk7XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxzdHJpbmc+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICB0aGlzLl91cGRhdGVBbmNlc3RvcnMob3B0cyk7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5mb3JFYWNoKChjaGFuZ2VGbikgPT4gY2hhbmdlRm4odHJ1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdGhlIGNvbnRyb2wuIFRoaXMgbWVhbnMgdGhlIGNvbnRyb2wgaXMgaW5jbHVkZWQgaW4gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIHRoZSBhZ2dyZWdhdGUgdmFsdWUgb2YgaXRzIHBhcmVudC4gSXRzIHN0YXR1cyByZWNhbGN1bGF0ZXMgYmFzZWQgb24gaXRzIHZhbHVlIGFuZFxuICAgKiBpdHMgdmFsaWRhdG9ycy5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgaWYgdGhlIGNvbnRyb2wgaGFzIGNoaWxkcmVuLCBhbGwgY2hpbGRyZW4gYXJlIGVuYWJsZWQuXG4gICAqXG4gICAqICBAcGFyYW0gb3B0cyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGNvbnRyb2wgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIHdoZW4gbWFya2VkIGFzIHVudG91Y2hlZFxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgbWFyayBvbmx5IHRoaXMgY29udHJvbC4gV2hlbiBmYWxzZSBvciBub3Qgc3VwcGxpZWQsXG4gICAqIG1hcmtzIGFsbCBkaXJlY3QgYW5jZXN0b3JzLiBEZWZhdWx0IGlzIGZhbHNlLi5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgZW5hYmxlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgZW5hYmxlKG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICAodGhpcyBhc3tzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IFZBTElEO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZChcbiAgICAgICAgKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4geyBjb250cm9sLmVuYWJsZSh7Li4ub3B0cywgb25seVNlbGY6IHRydWV9KTsgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRzLmVtaXRFdmVudH0pO1xuXG4gICAgdGhpcy5fdXBkYXRlQW5jZXN0b3JzKG9wdHMpO1xuICAgIHRoaXMuX29uRGlzYWJsZWRDaGFuZ2UuZm9yRWFjaCgoY2hhbmdlRm4pID0+IGNoYW5nZUZuKGZhbHNlKSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVBbmNlc3RvcnMob3B0czoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0pIHtcbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlUHJpc3RpbmUoKTtcbiAgICAgIHRoaXMuX3BhcmVudC5fdXBkYXRlVG91Y2hlZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gcGFyZW50IFNldHMgdGhlIHBhcmVudCBvZiB0aGUgY29udHJvbFxuICAgKi9cbiAgc2V0UGFyZW50KHBhcmVudDogRm9ybUdyb3VwfEZvcm1BcnJheSk6IHZvaWQgeyB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7IH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuIEFic3RyYWN0IG1ldGhvZCAoaW1wbGVtZW50ZWQgaW4gc3ViLWNsYXNzZXMpLlxuICAgKi9cbiAgYWJzdHJhY3Qgc2V0VmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sLiBBYnN0cmFjdCBtZXRob2QgKGltcGxlbWVudGVkIGluIHN1Yi1jbGFzc2VzKS5cbiAgICovXG4gIGFic3RyYWN0IHBhdGNoVmFsdWUodmFsdWU6IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgY29udHJvbC4gQWJzdHJhY3QgbWV0aG9kIChpbXBsZW1lbnRlZCBpbiBzdWItY2xhc3NlcykuXG4gICAqL1xuICBhYnN0cmFjdCByZXNldCh2YWx1ZT86IGFueSwgb3B0aW9ucz86IE9iamVjdCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlY2FsY3VsYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBCeSBkZWZhdWx0LCBpdCBhbHNvIHVwZGF0ZXMgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBvZiBpdHMgYW5jZXN0b3JzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBDb25maWd1cmF0aW9uIG9wdGlvbnMgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kIGVtaXRzIGV2ZW50c1xuICAgKiBhZnRlciB1cGRhdGVzIGFuZCB2YWxpZGl0eSBjaGVja3MgYXJlIGFwcGxpZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBvbmx5IHVwZGF0ZSB0aGlzIGNvbnRyb2wuIFdoZW4gZmFsc2Ugb3Igbm90IHN1cHBsaWVkLFxuICAgKiB1cGRhdGUgYWxsIGRpcmVjdCBhbmNlc3RvcnMuIERlZmF1bHQgaXMgZmFsc2UuLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdHM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRJbml0aWFsU3RhdHVzKCk7XG4gICAgdGhpcy5fdXBkYXRlVmFsdWUoKTtcblxuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuX2NhbmNlbEV4aXN0aW5nU3Vic2NyaXB0aW9uKCk7XG4gICAgICAodGhpcyBhc3tlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsfSkuZXJyb3JzID0gdGhpcy5fcnVuVmFsaWRhdG9yKCk7XG4gICAgICAodGhpcyBhc3tzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuXG4gICAgICBpZiAodGhpcy5zdGF0dXMgPT09IFZBTElEIHx8IHRoaXMuc3RhdHVzID09PSBQRU5ESU5HKSB7XG4gICAgICAgIHRoaXMuX3J1bkFzeW5jVmFsaWRhdG9yKG9wdHMuZW1pdEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKSB7XG4gICAgICAodGhpcy52YWx1ZUNoYW5nZXMgYXMgRXZlbnRFbWl0dGVyPGFueT4pLmVtaXQodGhpcy52YWx1ZSk7XG4gICAgICAodGhpcy5zdGF0dXNDaGFuZ2VzIGFzIEV2ZW50RW1pdHRlcjxzdHJpbmc+KS5lbWl0KHRoaXMuc3RhdHVzKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRzKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVUcmVlVmFsaWRpdHkob3B0czoge2VtaXRFdmVudD86IGJvb2xlYW59ID0ge2VtaXRFdmVudDogdHJ1ZX0pIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGN0cmw6IEFic3RyYWN0Q29udHJvbCkgPT4gY3RybC5fdXBkYXRlVHJlZVZhbGlkaXR5KG9wdHMpKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdHMuZW1pdEV2ZW50fSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRJbml0aWFsU3RhdHVzKCkge1xuICAgICh0aGlzIGFze3N0YXR1czogc3RyaW5nfSkuc3RhdHVzID0gdGhpcy5fYWxsQ29udHJvbHNEaXNhYmxlZCgpID8gRElTQUJMRUQgOiBWQUxJRDtcbiAgfVxuXG4gIHByaXZhdGUgX3J1blZhbGlkYXRvcigpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwge1xuICAgIHJldHVybiB0aGlzLnZhbGlkYXRvciA/IHRoaXMudmFsaWRhdG9yKHRoaXMpIDogbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX3J1bkFzeW5jVmFsaWRhdG9yKGVtaXRFdmVudD86IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hc3luY1ZhbGlkYXRvcikge1xuICAgICAgKHRoaXMgYXN7c3RhdHVzOiBzdHJpbmd9KS5zdGF0dXMgPSBQRU5ESU5HO1xuICAgICAgY29uc3Qgb2JzID0gdG9PYnNlcnZhYmxlKHRoaXMuYXN5bmNWYWxpZGF0b3IodGhpcykpO1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uID1cbiAgICAgICAgICBvYnMuc3Vic2NyaWJlKChlcnJvcnM6IFZhbGlkYXRpb25FcnJvcnMgfCBudWxsKSA9PiB0aGlzLnNldEVycm9ycyhlcnJvcnMsIHtlbWl0RXZlbnR9KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2FuY2VsRXhpc3RpbmdTdWJzY3JpcHRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2FzeW5jVmFsaWRhdGlvblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXN5bmNWYWxpZGF0aW9uU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZXJyb3JzIG9uIGEgZm9ybSBjb250cm9sIHdoZW4gcnVubmluZyB2YWxpZGF0aW9ucyBtYW51YWxseSwgcmF0aGVyIHRoYW4gYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogQ2FsbGluZyBgc2V0RXJyb3JzYCBhbHNvIHVwZGF0ZXMgdGhlIHZhbGlkaXR5IG9mIHRoZSBwYXJlbnQgY29udHJvbC5cbiAgICpcbiAgICogIyMjIE1hbnVhbGx5IHNldCB0aGUgZXJyb3JzIGZvciBhIGNvbnRyb2xcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGxvZ2luID0gbmV3IEZvcm1Db250cm9sKCdzb21lTG9naW4nKTtcbiAgICogbG9naW4uc2V0RXJyb3JzKHtcbiAgICogICBub3RVbmlxdWU6IHRydWVcbiAgICogfSk7XG4gICAqXG4gICAqIGV4cGVjdChsb2dpbi52YWxpZCkudG9FcXVhbChmYWxzZSk7XG4gICAqIGV4cGVjdChsb2dpbi5lcnJvcnMpLnRvRXF1YWwoeyBub3RVbmlxdWU6IHRydWUgfSk7XG4gICAqXG4gICAqIGxvZ2luLnNldFZhbHVlKCdzb21lT3RoZXJMb2dpbicpO1xuICAgKlxuICAgKiBleHBlY3QobG9naW4udmFsaWQpLnRvRXF1YWwodHJ1ZSk7XG4gICAqIGBgYFxuICAgKi9cbiAgc2V0RXJyb3JzKGVycm9yczogVmFsaWRhdGlvbkVycm9yc3xudWxsLCBvcHRzOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFze2Vycm9yczogVmFsaWRhdGlvbkVycm9ycyB8IG51bGx9KS5lcnJvcnMgPSBlcnJvcnM7XG4gICAgdGhpcy5fdXBkYXRlQ29udHJvbHNFcnJvcnMob3B0cy5lbWl0RXZlbnQgIT09IGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCBjb250cm9sIGdpdmVuIHRoZSBjb250cm9sJ3MgbmFtZSBvciBwYXRoLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBBIGRvdC1kZWxpbWl0ZWQgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZy9udW1iZXIgdmFsdWVzIHRoYXQgZGVmaW5lIHRoZSBwYXRoIHRvIHRoZVxuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiAjIyMgUmV0cmlldmUgYSBuZXN0ZWQgY29udHJvbFxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgdG8gZ2V0IGEgYG5hbWVgIGNvbnRyb2wgbmVzdGVkIHdpdGhpbiBhIGBwZXJzb25gIHN1Yi1ncm91cDpcbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldCgncGVyc29uLm5hbWUnKTtgXG4gICAqXG4gICAqIC1PUi1cbiAgICpcbiAgICogKiBgdGhpcy5mb3JtLmdldChbJ3BlcnNvbicsICduYW1lJ10pO2BcbiAgICovXG4gIGdldChwYXRoOiBBcnJheTxzdHJpbmd8bnVtYmVyPnxzdHJpbmcpOiBBYnN0cmFjdENvbnRyb2x8bnVsbCB7IHJldHVybiBfZmluZCh0aGlzLCBwYXRoLCAnLicpOyB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgZXJyb3IgZGF0YSBmb3IgYSBzcGVjaWZpYyBlcnJvciBvY2N1cnJpbmcgaW4gdGhpcyBjb250cm9sIG9yIGluIGFub3RoZXIgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIGVycm9yQ29kZSBUaGUgZXJyb3IgY29kZSBmb3Igd2hpY2ggdG8gcmV0cmlldmUgZGF0YVxuICAgKiBAcGFyYW0gcGF0aCBUaGUgcGF0aCB0byBhIGNvbnRyb2wgdG8gY2hlY2suIElmIG5vdCBzdXBwbGllZCwgY2hlY2tzIGZvciB0aGUgZXJyb3IgaW4gdGhpc1xuICAgKiBjb250cm9sLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgZXJyb3IgZGF0YSBpZiB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBwYXRoIGhhcyB0aGUgZ2l2ZW4gZXJyb3IsIG90aGVyd2lzZSBudWxsXG4gICAqIG9yIHVuZGVmaW5lZC5cbiAgICovXG4gIGdldEVycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogc3RyaW5nW10pOiBhbnkge1xuICAgIGNvbnN0IGNvbnRyb2wgPSBwYXRoID8gdGhpcy5nZXQocGF0aCkgOiB0aGlzO1xuICAgIHJldHVybiBjb250cm9sICYmIGNvbnRyb2wuZXJyb3JzID8gY29udHJvbC5lcnJvcnNbZXJyb3JDb2RlXSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBwYXJhbSBlcnJvckNvZGUgVGhlIGVycm9yIGNvZGUgZm9yIHdoaWNoIHRvIHJldHJpZXZlIGRhdGFcbiAgICogQHBhcmFtIHBhdGggVGhlIHBhdGggdG8gYSBjb250cm9sIHRvIGNoZWNrLiBJZiBub3Qgc3VwcGxpZWQsIGNoZWNrcyBmb3IgdGhlIGVycm9yIGluIHRoaXNcbiAgICogY29udHJvbC5cbiAgICogQHJldHVybnMgVHJ1ZSB3aGVuIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciwgb3RoZXJ3aXNlIGZhbHNlLlxuICAgKi9cbiAgaGFzRXJyb3IoZXJyb3JDb2RlOiBzdHJpbmcsIHBhdGg/OiBzdHJpbmdbXSk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLmdldEVycm9yKGVycm9yQ29kZSwgcGF0aCk7IH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIHRoZSB0b3AtbGV2ZWwgYW5jZXN0b3Igb2YgdGhpcyBjb250cm9sLlxuICAgKi9cbiAgZ2V0IHJvb3QoKTogQWJzdHJhY3RDb250cm9sIHtcbiAgICBsZXQgeDogQWJzdHJhY3RDb250cm9sID0gdGhpcztcblxuICAgIHdoaWxlICh4Ll9wYXJlbnQpIHtcbiAgICAgIHggPSB4Ll9wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAodGhpcyBhc3tzdGF0dXM6IHN0cmluZ30pLnN0YXR1cyA9IHRoaXMuX2NhbGN1bGF0ZVN0YXR1cygpO1xuXG4gICAgaWYgKGVtaXRFdmVudCkge1xuICAgICAgKHRoaXMuc3RhdHVzQ2hhbmdlcyBhcyBFdmVudEVtaXR0ZXI8c3RyaW5nPikuZW1pdCh0aGlzLnN0YXR1cyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcmVudCkge1xuICAgICAgdGhpcy5fcGFyZW50Ll91cGRhdGVDb250cm9sc0Vycm9ycyhlbWl0RXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2luaXRPYnNlcnZhYmxlcygpIHtcbiAgICAodGhpcyBhc3t2YWx1ZUNoYW5nZXM6IE9ic2VydmFibGU8YW55Pn0pLnZhbHVlQ2hhbmdlcyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAodGhpcyBhc3tzdGF0dXNDaGFuZ2VzOiBPYnNlcnZhYmxlPGFueT59KS5zdGF0dXNDaGFuZ2VzID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICB9XG5cblxuICBwcml2YXRlIF9jYWxjdWxhdGVTdGF0dXMoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5fYWxsQ29udHJvbHNEaXNhYmxlZCgpKSByZXR1cm4gRElTQUJMRUQ7XG4gICAgaWYgKHRoaXMuZXJyb3JzKSByZXR1cm4gSU5WQUxJRDtcbiAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKFBFTkRJTkcpKSByZXR1cm4gUEVORElORztcbiAgICBpZiAodGhpcy5fYW55Q29udHJvbHNIYXZlU3RhdHVzKElOVkFMSUQpKSByZXR1cm4gSU5WQUxJRDtcbiAgICByZXR1cm4gVkFMSUQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF91cGRhdGVWYWx1ZSgpOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2ZvckVhY2hDaGlsZChjYjogRnVuY3Rpb24pOiB2b2lkO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgYWJzdHJhY3QgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbjtcblxuICAvKiogQGludGVybmFsICovXG4gIGFic3RyYWN0IF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW47XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNIYXZlU3RhdHVzKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuc3RhdHVzID09PSBzdGF0dXMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfYW55Q29udHJvbHNEaXJ0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYW55Q29udHJvbHMoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gY29udHJvbC5kaXJ0eSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbnlDb250cm9sc1RvdWNoZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2FueUNvbnRyb2xzKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wudG91Y2hlZCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVQcmlzdGluZShvcHRzOiB7b25seVNlbGY/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgKHRoaXMgYXN7cHJpc3RpbmU6IGJvb2xlYW59KS5wcmlzdGluZSA9ICF0aGlzLl9hbnlDb250cm9sc0RpcnR5KCk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVByaXN0aW5lKG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3VwZGF0ZVRvdWNoZWQob3B0czoge29ubHlTZWxmPzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFze3RvdWNoZWQ6IGJvb2xlYW59KS50b3VjaGVkID0gdGhpcy5fYW55Q29udHJvbHNUb3VjaGVkKCk7XG5cbiAgICBpZiAodGhpcy5fcGFyZW50ICYmICFvcHRzLm9ubHlTZWxmKSB7XG4gICAgICB0aGlzLl9wYXJlbnQuX3VwZGF0ZVRvdWNoZWQob3B0cyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25EaXNhYmxlZENoYW5nZTogRnVuY3Rpb25bXSA9IFtdO1xuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lzQm94ZWRWYWx1ZShmb3JtU3RhdGU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0eXBlb2YgZm9ybVN0YXRlID09PSAnb2JqZWN0JyAmJiBmb3JtU3RhdGUgIT09IG51bGwgJiZcbiAgICAgICAgT2JqZWN0LmtleXMoZm9ybVN0YXRlKS5sZW5ndGggPT09IDIgJiYgJ3ZhbHVlJyBpbiBmb3JtU3RhdGUgJiYgJ2Rpc2FibGVkJyBpbiBmb3JtU3RhdGU7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPSBmbjsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwZGF0ZVN0cmF0ZWd5KG9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCk6IHZvaWQge1xuICAgIGlmIChpc09wdGlvbnNPYmoob3B0cykgJiYgKG9wdHMgYXMgQWJzdHJhY3RDb250cm9sT3B0aW9ucykudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fdXBkYXRlT24gPSAob3B0cyBhcyBBYnN0cmFjdENvbnRyb2xPcHRpb25zKS51cGRhdGVPbiAhO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzIG9mIGFuIGluZGl2aWR1YWwgZm9ybSBjb250cm9sLlxuICpcbiAqIFRoaXMgaXMgb25lIG9mIHRoZSB0aHJlZSBmdW5kYW1lbnRhbCBidWlsZGluZyBibG9ja3Mgb2YgQW5ndWxhciBmb3JtcywgYWxvbmcgd2l0aFxuICogYEZvcm1Hcm91cGAgYW5kIGBGb3JtQXJyYXlgLiBJdCBleHRlbmRzIHRoZSBgQWJzdHJhY3RDb250cm9sYCBjbGFzcyB0aGF0XG4gKiBpbXBsZW1lbnRzIG1vc3Qgb2YgdGhlIGJhc2UgZnVuY3Rpb25hbGl0eSBmb3IgYWNjZXNzaW5nIHRoZSB2YWx1ZSwgdmFsaWRhdGlvbiBzdGF0dXMsXG4gKiB1c2VyIGludGVyYWN0aW9ucyBhbmQgZXZlbnRzLlxuICpcbiAqIEBzZWUgYEFic3RyYWN0Q29udHJvbGBcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUgW1VzYWdlIE5vdGVzXSgjdXNhZ2Utbm90ZXMpXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgSW5pdGlhbGl6aW5nIEZvcm0gQ29udHJvbHNcbiAqXG4gKiBJbnN0YW50aWF0ZSBhIGBGb3JtQ29udHJvbGAsIHdpdGggYW4gaW5pdGlhbCB2YWx1ZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbCgnc29tZSB2YWx1ZScpO1xuICogY29uc29sZS5sb2coY3RybC52YWx1ZSk7ICAgICAvLyAnc29tZSB2YWx1ZSdcbiAqYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGluaXRpYWxpemVzIHRoZSBjb250cm9sIHdpdGggYSBmb3JtIHN0YXRlIG9iamVjdC4gVGhlIGB2YWx1ZWBcbiAqIGFuZCBgZGlzYWJsZWRgIGtleXMgYXJlIHJlcXVpcmVkIGluIHRoaXMgY2FzZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgY3RybCA9IG5ldyBGb3JtQ29udHJvbCh7IHZhbHVlOiAnbi9hJywgZGlzYWJsZWQ6IHRydWUgfSk7XG4gKiBjb25zb2xlLmxvZyhjdHJsLnZhbHVlKTsgICAgIC8vICduL2EnXG4gKiBjb25zb2xlLmxvZyhjdHJsLnN0YXR1cyk7ICAgIC8vICdESVNBQkxFRCdcbiAqIGBgYFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBpbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGEgc3luYyB2YWxpZGF0b3IuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMucmVxdWlyZWQpO1xuICogY29uc29sZS5sb2coY3RybC52YWx1ZSk7ICAgICAgLy8gJydcbiAqIGNvbnNvbGUubG9nKGN0cmwuc3RhdHVzKTsgICAgIC8vICdJTlZBTElEJ1xuICogYGBgXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIGluaXRpYWxpemVzIHRoZSBjb250cm9sIHVzaW5nIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sKCcnLCB7XG4gKiAgICB2YWxpZGF0b3JzOiBWYWxpZGF0b3JzLnJlcXVpcmVkLFxuICogICAgYXN5bmNWYWxpZGF0b3JzOiBteUFzeW5jVmFsaWRhdG9yXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDb25maWd1cmUgdGhlIGNvbnRyb2wgdG8gdXBkYXRlIG9uIGEgYmx1ciBldmVudFxuICpcbiAqIFNldCB0aGUgYHVwZGF0ZU9uYCBvcHRpb24gdG8gYCdibHVyJ2AgdG8gdXBkYXRlIG9uIHRoZSBibHVyIGBldmVudGAuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2woJycsIHsgdXBkYXRlT246ICdibHVyJyB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDb25maWd1cmUgdGhlIGNvbnRyb2wgdG8gdXBkYXRlIG9uIGEgc3VibWl0IGV2ZW50XG4gKlxuICogU2V0IHRoZSBgdXBkYXRlT25gIG9wdGlvbiB0byBgJ3N1Ym1pdCdgIHRvIHVwZGF0ZSBvbiBhIHN1Ym1pdCBgZXZlbnRgLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjdHJsID0gbmV3IEZvcm1Db250cm9sKCcnLCB7IHVwZGF0ZU9uOiAnc3VibWl0JyB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBSZXNldCB0aGUgY29udHJvbCBiYWNrIHRvIGFuIGluaXRpYWwgdmFsdWVcbiAqXG4gKiBZb3UgcmVzZXQgdG8gYSBzcGVjaWZpYyBmb3JtIHN0YXRlIGJ5IHBhc3NpbmcgdGhyb3VnaCBhIHN0YW5kYWxvbmVcbiAqIHZhbHVlIG9yIGEgZm9ybSBzdGF0ZSBvYmplY3QgdGhhdCBjb250YWlucyBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWQgc3RhdGVcbiAqICh0aGVzZSBhcmUgdGhlIG9ubHkgdHdvIHByb3BlcnRpZXMgdGhhdCBjYW5ub3QgYmUgY2FsY3VsYXRlZCkuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2woJ05hbmN5Jyk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdOYW5jeSdcbiAqXG4gKiBjb250cm9sLnJlc2V0KCdEcmV3Jyk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdEcmV3J1xuICogYGBgXG4gKlxuICogIyMjIFJlc2V0IHRoZSBjb250cm9sIGJhY2sgdG8gYW4gaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWRcbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGN0cmwgPSBuZXcgRm9ybUNvbnRyb2woJ05hbmN5Jyk7XG4gKlxuICogY29uc29sZS5sb2coY29udHJvbC52YWx1ZSk7IC8vICdOYW5jeSdcbiAqIGNvbnNvbGUubG9nKHRoaXMuY29udHJvbC5zdGF0dXMpOyAvLyAnRElTQUJMRUQnXG4gKlxuICogY29udHJvbC5yZXNldCh7IHZhbHVlOiAnRHJldycsIGRpc2FibGVkOiB0cnVlIH0pO1xuICpcbiAqIGNvbnNvbGUubG9nKHRoaXMuY29udHJvbC52YWx1ZSk7IC8vICdEcmV3J1xuICogY29uc29sZS5sb2codGhpcy5jb250cm9sLnN0YXR1cyk7IC8vICdESVNBQkxFRCdcbiAqXG4qL1xuZXhwb3J0IGNsYXNzIEZvcm1Db250cm9sIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb25DaGFuZ2U6IEZ1bmN0aW9uW10gPSBbXTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nVmFsdWU6IGFueTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9wZW5kaW5nQ2hhbmdlOiBhbnk7XG5cbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgRm9ybUNvbnRyb2xgIGluc3RhbmNlLlxuICAqXG4gICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsXG4gICogb3Igd2l0aCBhbiBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSBpbml0aWFsIHZhbHVlLCBzdGF0dXMsIGFuZCBvcHRpb25zXG4gICogZm9yIGhhbmRsaW5nIHVwZGF0ZXMgYW5kIHZhbGlkYXRpb24uXG4gICpcbiAgKiBAcGFyYW0gdmFsaWRhdG9yT3JPcHRzIEEgc3luY2hyb25vdXMgdmFsaWRhdG9yIGZ1bmN0aW9uLCBvciBhbiBhcnJheSBvZlxuICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICpcbiAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgKlxuICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIGZvcm1TdGF0ZTogYW55ID0gbnVsbCxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvck9yT3B0cyksXG4gICAgICAgIGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgIHRoaXMuX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZSk7XG4gICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIG5ldyB2YWx1ZSBmb3IgdGhlIGZvcm0gY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBjb250cm9sLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb29wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogKiBgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlYDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAgKHRoZSBkZWZhdWx0KSwgZWFjaCBjaGFuZ2UgdHJpZ2dlcnMgYW5cbiAgICogYG9uQ2hhbmdlYCBldmVudCB0b1xuICAgKiB1cGRhdGUgdGhlIHZpZXcuXG4gICAqICogYGVtaXRWaWV3VG9Nb2RlbENoYW5nZWA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgZWFjaCBjaGFuZ2UgdHJpZ2dlcnMgYW5cbiAgICogYG5nTW9kZWxDaGFuZ2VgXG4gICAqIGV2ZW50IHRvIHVwZGF0ZSB0aGUgbW9kZWwuXG4gICAqXG4gICAqL1xuICBzZXRWYWx1ZSh2YWx1ZTogYW55LCBvcHRpb25zOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW4sXG4gICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlPzogYm9vbGVhbixcbiAgICBlbWl0Vmlld1RvTW9kZWxDaGFuZ2U/OiBib29sZWFuXG4gIH0gPSB7fSk6IHZvaWQge1xuICAgICh0aGlzIGFze3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0aGlzLl9vbkNoYW5nZS5sZW5ndGggJiYgb3B0aW9ucy5lbWl0TW9kZWxUb1ZpZXdDaGFuZ2UgIT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9vbkNoYW5nZS5mb3JFYWNoKFxuICAgICAgICAgIChjaGFuZ2VGbikgPT4gY2hhbmdlRm4odGhpcy52YWx1ZSwgb3B0aW9ucy5lbWl0Vmlld1RvTW9kZWxDaGFuZ2UgIT09IGZhbHNlKSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2wuXG4gICAqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgZnVuY3Rpb25hbGx5IHRoZSBzYW1lIGFzIHtAbGluayBGb3JtQ29udHJvbCNzZXRWYWx1ZSBzZXRWYWx1ZX0gYXQgdGhpcyBsZXZlbC5cbiAgICogSXQgZXhpc3RzIGZvciBzeW1tZXRyeSB3aXRoIHtAbGluayBGb3JtR3JvdXAjcGF0Y2hWYWx1ZSBwYXRjaFZhbHVlfSBvbiBgRm9ybUdyb3Vwc2AgYW5kXG4gICAqIGBGb3JtQXJyYXlzYCwgd2hlcmUgaXQgZG9lcyBiZWhhdmUgZGlmZmVyZW50bHkuXG4gICAqXG4gICAqIEBzZWUgYHNldFZhbHVlYCBmb3Igb3B0aW9uc1xuICAgKi9cbiAgcGF0Y2hWYWx1ZSh2YWx1ZTogYW55LCBvcHRpb25zOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW4sXG4gICAgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlPzogYm9vbGVhbixcbiAgICBlbWl0Vmlld1RvTW9kZWxDaGFuZ2U/OiBib29sZWFuXG4gIH0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgZm9ybSBjb250cm9sLCBtYXJraW5nIGl0IGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgLCBhbmQgc2V0dGluZ1xuICAgKiB0aGUgdmFsdWUgdG8gbnVsbC5cbiAgICpcbiAgICogQHBhcmFtIGZvcm1TdGF0ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsXG4gICAqIG9yIHdpdGggYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSwgc3RhdHVzLCBhbmQgb3B0aW9uc1xuICAgKiBmb3IgaGFuZGxpbmcgdXBkYXRlcyBhbmQgdmFsaWRhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICpcbiAgICovXG4gIHJlc2V0KGZvcm1TdGF0ZTogYW55ID0gbnVsbCwgb3B0aW9uczoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX2FwcGx5Rm9ybVN0YXRlKGZvcm1TdGF0ZSk7XG4gICAgdGhpcy5tYXJrQXNQcmlzdGluZShvcHRpb25zKTtcbiAgICB0aGlzLm1hcmtBc1VudG91Y2hlZChvcHRpb25zKTtcbiAgICB0aGlzLnNldFZhbHVlKHRoaXMudmFsdWUsIG9wdGlvbnMpO1xuICAgIHRoaXMuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF91cGRhdGVWYWx1ZSgpIHt9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmRpc2FibGVkOyB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGNoYW5nZSBldmVudHMuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgbWV0aG9kIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIHZhbHVlIGNoYW5nZXNcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlLnB1c2goZm4pOyB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgX2NsZWFyQ2hhbmdlRm5zKCk6IHZvaWQge1xuICAgIHRoaXMuX29uQ2hhbmdlID0gW107XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZSA9IFtdO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSA9ICgpID0+IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIGRpc2FibGVkIGV2ZW50cy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBtZXRob2QgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgZGlzYWJsZWQgc3RhdHVzIGNoYW5nZXMuXG4gICAqL1xuICByZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2UoZm46IChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5fb25EaXNhYmxlZENoYW5nZS5wdXNoKGZuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIF9mb3JFYWNoQ2hpbGQoY2I6IEZ1bmN0aW9uKTogdm9pZCB7fVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMudXBkYXRlT24gPT09ICdzdWJtaXQnKSB7XG4gICAgICBpZiAodGhpcy5fcGVuZGluZ0RpcnR5KSB0aGlzLm1hcmtBc0RpcnR5KCk7XG4gICAgICBpZiAodGhpcy5fcGVuZGluZ1RvdWNoZWQpIHRoaXMubWFya0FzVG91Y2hlZCgpO1xuICAgICAgaWYgKHRoaXMuX3BlbmRpbmdDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLl9wZW5kaW5nVmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZX0pO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlGb3JtU3RhdGUoZm9ybVN0YXRlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5faXNCb3hlZFZhbHVlKGZvcm1TdGF0ZSkpIHtcbiAgICAgICh0aGlzIGFze3ZhbHVlOiBhbnl9KS52YWx1ZSA9IHRoaXMuX3BlbmRpbmdWYWx1ZSA9IGZvcm1TdGF0ZS52YWx1ZTtcbiAgICAgIGZvcm1TdGF0ZS5kaXNhYmxlZCA/IHRoaXMuZGlzYWJsZSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMgYXN7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcGVuZGluZ1ZhbHVlID0gZm9ybVN0YXRlO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGEgZ3JvdXAgb2YgYEZvcm1Db250cm9sYCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUdyb3VwYCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gb25lIG9iamVjdCxcbiAqIHdpdGggZWFjaCBjb250cm9sIG5hbWUgYXMgdGhlIGtleS4gIEl0IGNhbGN1bGF0ZXMgaXRzIHN0YXR1cyBieSByZWR1Y2luZyB0aGUgc3RhdHVzIHZhbHVlc1xuICogb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mIHRoZSBjb250cm9scyBpbiBhIGdyb3VwIGlzIGludmFsaWQsIHRoZSBlbnRpcmVcbiAqIGdyb3VwIGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUdyb3VwYCBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyB1c2VkIHRvIGRlZmluZSBmb3JtcyBpbiBBbmd1bGFyLFxuICogYWxvbmcgd2l0aCBgRm9ybUNvbnRyb2xgIGFuZCBgRm9ybUFycmF5YC5cbiAqXG4gKiBXaGVuIGluc3RhbnRpYXRpbmcgYSBgRm9ybUdyb3VwYCwgcGFzcyBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMgYXMgdGhlIGZpcnN0XG4gKiBhcmd1bWVudC4gVGhlIGtleSBmb3IgZWFjaCBjaGlsZCByZWdpc3RlcnMgdGhlIG5hbWUgZm9yIHRoZSBjb250cm9sLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENyZWF0ZSBhIGZvcm0gZ3JvdXAgd2l0aCAyIGNvbnRyb2xzXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ05hbmN5JywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnKSxcbiAqIH0pO1xuICpcbiAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDsgJ0RyZXcnfVxuICogY29uc29sZS5sb2coZm9ybS5zdGF0dXMpOyAgLy8gJ1ZBTElEJ1xuICogYGBgXG4gKlxuICogIyMjIENyZWF0ZSBhIGZvcm0gZ3JvdXAgd2l0aCBhIGdyb3VwLWxldmVsIHZhbGlkYXRvclxuICpcbiAqIFlvdSBpbmNsdWRlIGdyb3VwLWxldmVsIHZhbGlkYXRvcnMgYXMgdGhlIHNlY29uZCBhcmcsIG9yIGdyb3VwLWxldmVsIGFzeW5jXG4gKiB2YWxpZGF0b3JzIGFzIHRoZSB0aGlyZCBhcmcuIFRoZXNlIGNvbWUgaW4gaGFuZHkgd2hlbiB5b3Ugd2FudCB0byBwZXJmb3JtIHZhbGlkYXRpb25cbiAqIHRoYXQgY29uc2lkZXJzIHRoZSB2YWx1ZSBvZiBtb3JlIHRoYW4gb25lIGNoaWxkIGNvbnRyb2wuXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIHBhc3N3b3JkOiBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgcGFzc3dvcmRDb25maXJtOiBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqIH0sIHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IpO1xuICpcbiAqXG4gKiBmdW5jdGlvbiBwYXNzd29yZE1hdGNoVmFsaWRhdG9yKGc6IEZvcm1Hcm91cCkge1xuICogICAgcmV0dXJuIGcuZ2V0KCdwYXNzd29yZCcpLnZhbHVlID09PSBnLmdldCgncGFzc3dvcmRDb25maXJtJykudmFsdWVcbiAqICAgICAgID8gbnVsbCA6IHsnbWlzbWF0Y2gnOiB0cnVlfTtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIExpa2UgYEZvcm1Db250cm9sYCBpbnN0YW5jZXMsIHlvdSBjaG9vc2UgdG8gcGFzcyBpblxuICogdmFsaWRhdG9ycyBhbmQgYXN5bmMgdmFsaWRhdG9ycyBhcyBwYXJ0IG9mIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBwYXNzd29yZDogbmV3IEZvcm1Db250cm9sKCcnKVxuICogICBwYXNzd29yZENvbmZpcm06IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqIH0sIHsgdmFsaWRhdG9yczogcGFzc3dvcmRNYXRjaFZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3JzOiBvdGhlclZhbGlkYXRvciB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBTZXQgdGhlIHVwZGF0ZU9uIHByb3BlcnR5IGZvciBhbGwgY29udHJvbHMgaW4gYSBmb3JtIGdyb3VwXG4gKlxuICogVGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQgdG8gc2V0IGEgZGVmYXVsdCB2YWx1ZSBmb3IgZWFjaCBjaGlsZFxuICogY29udHJvbCdzIGB1cGRhdGVPbmAgcHJvcGVydHkuIElmIHlvdSBzZXQgYHVwZGF0ZU9uYCB0byBgJ2JsdXInYCBhdCB0aGVcbiAqIGdyb3VwIGxldmVsLCBhbGwgY2hpbGQgY29udHJvbHMgZGVmYXVsdCB0byAnYmx1cicsIHVubGVzcyB0aGUgY2hpbGRcbiAqIGhhcyBleHBsaWNpdGx5IHNwZWNpZmllZCBhIGRpZmZlcmVudCBgdXBkYXRlT25gIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIG9uZTogbmV3IEZvcm1Db250cm9sKClcbiAqIH0sIHsgdXBkYXRlT246ICdibHVyJyB9KTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sIHtcbiAgLyoqXG4gICogQ3JlYXRlcyBhIG5ldyBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgKlxuICAqIEBwYXJhbSBjb250cm9scyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgKiB1bmRlciB3aGljaCBpdCBpcyByZWdpc3RlcmVkLlxuICAqXG4gICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgKiBzdWNoIGZ1bmN0aW9ucywgb3IgYW4gYEFic3RyYWN0Q29udHJvbE9wdGlvbnNgIG9iamVjdCB0aGF0IGNvbnRhaW5zIHZhbGlkYXRpb24gZnVuY3Rpb25zXG4gICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAqXG4gICogQHBhcmFtIGFzeW5jVmFsaWRhdG9yIEEgc2luZ2xlIGFzeW5jIHZhbGlkYXRvciBvciBhcnJheSBvZiBhc3luYyB2YWxpZGF0b3IgZnVuY3Rpb25zXG4gICpcbiAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBwdWJsaWMgY29udHJvbHM6IHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2x9LFxuICAgICAgdmFsaWRhdG9yT3JPcHRzPzogVmFsaWRhdG9yRm58VmFsaWRhdG9yRm5bXXxBYnN0cmFjdENvbnRyb2xPcHRpb25zfG51bGwsXG4gICAgICBhc3luY1ZhbGlkYXRvcj86IEFzeW5jVmFsaWRhdG9yRm58QXN5bmNWYWxpZGF0b3JGbltdfG51bGwpIHtcbiAgICBzdXBlcihcbiAgICAgICAgY29lcmNlVG9WYWxpZGF0b3IodmFsaWRhdG9yT3JPcHRzKSxcbiAgICAgICAgY29lcmNlVG9Bc3luY1ZhbGlkYXRvcihhc3luY1ZhbGlkYXRvciwgdmFsaWRhdG9yT3JPcHRzKSk7XG4gICAgdGhpcy5faW5pdE9ic2VydmFibGVzKCk7XG4gICAgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3kodmFsaWRhdG9yT3JPcHRzKTtcbiAgICB0aGlzLl9zZXRVcENvbnRyb2xzKCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNvbnRyb2wgd2l0aCB0aGUgZ3JvdXAncyBsaXN0IG9mIGNvbnRyb2xzLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBkb2VzIG5vdCB1cGRhdGUgdGhlIHZhbHVlIG9yIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKiBVc2Uge0BsaW5rIEZvcm1Hcm91cCNhZGRDb250cm9sIGFkZENvbnRyb2x9IGluc3RlYWQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVnaXN0ZXIgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuICByZWdpc3RlckNvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiBBYnN0cmFjdENvbnRyb2wge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSByZXR1cm4gdGhpcy5jb250cm9sc1tuYW1lXTtcbiAgICB0aGlzLmNvbnRyb2xzW25hbWVdID0gY29udHJvbDtcbiAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSh0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuICAgIHJldHVybiBjb250cm9sO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbnRyb2wgdG8gdGhpcyBncm91cC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gYWRkIHRvIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKi9cbiAgYWRkQ29udHJvbChuYW1lOiBzdHJpbmcsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgIHRoaXMucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGNvbnRyb2wgZnJvbSB0aGlzIGdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAqL1xuICByZW1vdmVDb250cm9sKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSB0aGlzLmNvbnRyb2xzW25hbWVdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgZGVsZXRlICh0aGlzLmNvbnRyb2xzW25hbWVdKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFuIGV4aXN0aW5nIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVwbGFjZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICovXG4gIHNldENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgdGhpcy5jb250cm9sc1tuYW1lXS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIGRlbGV0ZSAodGhpcy5jb250cm9sc1tuYW1lXSk7XG4gICAgaWYgKGNvbnRyb2wpIHRoaXMucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlcmUgaXMgYW4gZW5hYmxlZCBjb250cm9sIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBSZXBvcnRzIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scy4gSWYgeW91J2QgbGlrZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBncm91cFxuICAgKiBvbmx5LCB1c2Uge0BsaW5rIEFic3RyYWN0Q29udHJvbCNnZXQgZ2V0fSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGNoZWNrIGZvciBleGlzdGVuY2UgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICpcbiAgICogQHJldHVybnMgZmFsc2UgZm9yIGRpc2FibGVkIGNvbnRyb2xzLCB0cnVlIG90aGVyd2lzZS5cbiAgICovXG4gIGNvbnRhaW5zKGNvbnRyb2xOYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5oYXNPd25Qcm9wZXJ0eShjb250cm9sTmFtZSkgJiYgdGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHRoYXQgbWF0Y2hlc1xuICAgKiB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cCwgd2l0aCBjb250cm9sIG5hbWVzIGFzIGtleXMuXG4gICAqXG4gICAqICMjIyBTZXQgdGhlIGNvbXBsZXRlIHZhbHVlIGZvciB0aGUgZm9ybSBncm91cFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiBmb3JtLnNldFZhbHVlKHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfSk7XG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfVxuICAgKlxuICAgKiBgYGBcbiAgICogQHRocm93cyBXaGVuIHN0cmljdCBjaGVja3MgZmFpbCwgc3VjaCBhcyBzZXR0aW5nIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2xcbiAgICogdGhhdCBkb2Vzbid0IGV4aXN0IG9yIGlmIHlvdSBleGNsdWRpbmcgdGhlIHZhbHVlIG9mIGEgY29udHJvbC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBjb250cm9sIHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBzZXRWYWx1ZSh2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0sIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOlxuICAgICAgdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlKTtcbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHRoaXMuX3Rocm93SWZDb250cm9sTWlzc2luZyhuYW1lKTtcbiAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0uc2V0VmFsdWUodmFsdWVbbmFtZV0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggY29udHJvbFxuICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAqIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogSXQgYWNjZXB0cyBib3RoIHN1cGVyLXNldHMgYW5kIHN1Yi1zZXRzIG9mIHRoZSBncm91cCB3aXRob3V0IHRocm93aW5nIGFuIGVycm9yLlxuICAgKlxuICAgKiAjIyMgUGF0Y2ggdGhlIHZhbHVlIGZvciBhIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogIGBgYFxuICAgKiAgY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICogIH0pO1xuICAgKiAgY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiAgZm9ybS5wYXRjaFZhbHVlKHtmaXJzdDogJ05hbmN5J30pO1xuICAgKiAgY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiAnTmFuY3knLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiAgYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cFxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZXMgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBpcyBwYXRjaGVkXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogdHJ1ZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqL1xuICBwYXRjaFZhbHVlKHZhbHVlOiB7W2tleTogc3RyaW5nXTogYW55fSwgb3B0aW9uczoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6XG4gICAgICB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh2YWx1ZSkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSB7XG4gICAgICAgIHRoaXMuY29udHJvbHNbbmFtZV0ucGF0Y2hWYWx1ZSh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYEZvcm1Hcm91cGAsIG1hcmtzIGFsbCBkZXNjZW5kYW50cyBhcmUgbWFya2VkIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgLCBhbmRcbiAgICogdGhlIHZhbHVlIG9mIGFsbCBkZXNjZW5kYW50cyB0byBudWxsLlxuICAgKlxuICAgKiBZb3UgcmVzZXQgdG8gYSBzcGVjaWZpYyBmb3JtIHN0YXRlIGJ5IHBhc3NpbmcgaW4gYSBtYXAgb2Ygc3RhdGVzXG4gICAqIHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHlvdXIgZm9ybSwgd2l0aCBjb250cm9sIG5hbWVzIGFzIGtleXMuIFRoZSBzdGF0ZVxuICAgKiBpcyBhIHN0YW5kYWxvbmUgdmFsdWUgb3IgYSBmb3JtIHN0YXRlIG9iamVjdCB3aXRoIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZFxuICAgKiBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBJbml0aWFsaXplcyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgc3RhdGUgdmFsdWUsXG4gICAqIG9yIHdpdGggYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSwgc3RhdHVzLFxuICAgKiBhbmQgb3B0aW9ucyBmb3IgaGFuZGxpbmcgdXBkYXRlcyBhbmQgdmFsaWRhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyB3aGVuIHRoZSBncm91cCBpcyByZXNldC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7Zmlyc3Q6ICdmaXJzdCBuYW1lJywgbGFzdDogJ2xhc3QgbmFtZSd9XG4gICAqXG4gICAqIGZvcm0ucmVzZXQoeyBmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJyB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7Zmlyc3Q6ICduYW1lJywgbGFzdDogJ2xhc3QgbmFtZSd9XG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIGZvcm0gZ3JvdXAgdmFsdWVzIGFuZCBkaXNhYmxlZCBzdGF0dXNcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdmaXJzdCBuYW1lJyksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdsYXN0IG5hbWUnKVxuICAgKiB9KTtcbiAgICpcbiAgICogZm9ybS5yZXNldCh7XG4gICAqICAgZmlyc3Q6IHt2YWx1ZTogJ25hbWUnLCBkaXNhYmxlZDogdHJ1ZX0sXG4gICAqICAgbGFzdDogJ2xhc3QnXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyh0aGlzLmZvcm0udmFsdWUpOyAgLy8ge2ZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnfVxuICAgKiBjb25zb2xlLmxvZyh0aGlzLmZvcm0uZ2V0KCdmaXJzdCcpLnN0YXR1cyk7ICAvLyAnRElTQUJMRUQnXG4gICAqIGBgYFxuICAgKi9cbiAgcmVzZXQodmFsdWU6IGFueSA9IHt9LCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgY29udHJvbC5yZXNldCh2YWx1ZVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICAgIHRoaXMuX3VwZGF0ZVByaXN0aW5lKG9wdGlvbnMpO1xuICAgIHRoaXMuX3VwZGF0ZVRvdWNoZWQob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFJldHJpZXZlcyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKiBUaGUgYHZhbHVlYCBwcm9wZXJ0eSBpcyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgZ3JvdXAsIGJlY2F1c2VcbiAgICogaXQgZXhjbHVkZXMgZGlzYWJsZWQgY29udHJvbHMgaW4gdGhlIGBGb3JtR3JvdXBgLlxuICAgKi9cbiAgZ2V0UmF3VmFsdWUoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oXG4gICAgICAgIHt9LCAoYWNjOiB7W2s6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0sIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgYWNjW25hbWVdID0gY29udHJvbCBpbnN0YW5jZW9mIEZvcm1Db250cm9sID8gY29udHJvbC52YWx1ZSA6ICg8YW55PmNvbnRyb2wpLmdldFJhd1ZhbHVlKCk7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW4ge1xuICAgIGxldCBzdWJ0cmVlVXBkYXRlZCA9IHRoaXMuX3JlZHVjZUNoaWxkcmVuKGZhbHNlLCAodXBkYXRlZDogYm9vbGVhbiwgY2hpbGQ6IEFic3RyYWN0Q29udHJvbCkgPT4ge1xuICAgICAgcmV0dXJuIGNoaWxkLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCkgPyB0cnVlIDogdXBkYXRlZDtcbiAgICB9KTtcbiAgICBpZiAoc3VidHJlZVVwZGF0ZWQpIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWV9KTtcbiAgICByZXR1cm4gc3VidHJlZVVwZGF0ZWQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF90aHJvd0lmQ29udHJvbE1pc3NpbmcobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICAgIFRoZXJlIGFyZSBubyBmb3JtIGNvbnRyb2xzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGdyb3VwIHlldC4gIElmIHlvdSdyZSB1c2luZyBuZ01vZGVsLFxuICAgICAgICB5b3UgbWF5IHdhbnQgdG8gY2hlY2sgbmV4dCB0aWNrIChlLmcuIHVzZSBzZXRUaW1lb3V0KS5cbiAgICAgIGApO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuY29udHJvbHNbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZm9ybSBjb250cm9sIHdpdGggbmFtZTogJHtuYW1lfS5gKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9mb3JFYWNoQ2hpbGQoY2I6ICh2OiBhbnksIGs6IHN0cmluZykgPT4gdm9pZCk6IHZvaWQge1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29udHJvbHMpLmZvckVhY2goayA9PiBjYih0aGlzLmNvbnRyb2xzW2tdLCBrKSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRVcENvbnRyb2xzKCk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHsgKHRoaXMgYXN7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcmVkdWNlVmFsdWUoKTsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuIHtcbiAgICBsZXQgcmVzID0gZmFsc2U7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgcmVzID0gcmVzIHx8ICh0aGlzLmNvbnRhaW5zKG5hbWUpICYmIGNvbmRpdGlvbihjb250cm9sKSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZHVjZVZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbihcbiAgICAgICAge30sIChhY2M6IHtbazogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSwgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAoY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGFjY1tuYW1lXSA9IGNvbnRyb2wudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmVkdWNlQ2hpbGRyZW4oaW5pdFZhbHVlOiBhbnksIGZuOiBGdW5jdGlvbikge1xuICAgIGxldCByZXMgPSBpbml0VmFsdWU7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKFxuICAgICAgICAoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBuYW1lOiBzdHJpbmcpID0+IHsgcmVzID0gZm4ocmVzLCBjb250cm9sLCBuYW1lKTsgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjb250cm9sTmFtZSBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKSkge1xuICAgICAgaWYgKHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb250cm9scykubGVuZ3RoID4gMCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAodmFsdWVbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE11c3Qgc3VwcGx5IGEgdmFsdWUgZm9yIGZvcm0gY29udHJvbCB3aXRoIG5hbWU6ICcke25hbWV9Jy5gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGFuIGFycmF5IG9mIGBGb3JtQ29udHJvbGAsXG4gKiBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUFycmF5YCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gYW4gYXJyYXkuXG4gKiBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXMgb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mXG4gKiB0aGUgY29udHJvbHMgaW4gYSBgRm9ybUFycmF5YCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlIGFycmF5IGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUFycmF5YCBpcyBvbmUgb2YgdGhlIHRocmVlIGZ1bmRhbWVudGFsIGJ1aWxkaW5nIGJsb2NrcyB1c2VkIHRvIGRlZmluZSBmb3JtcyBpbiBBbmd1bGFyLFxuICogYWxvbmcgd2l0aCBgRm9ybUNvbnRyb2xgIGFuZCBgRm9ybUdyb3VwYC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYW4gYXJyYXkgb2YgZm9ybSBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnRHJldycpLFxuICogXSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyLnZhbHVlKTsgICAvLyBbJ05hbmN5JywgJ0RyZXcnXVxuICogY29uc29sZS5sb2coYXJyLnN0YXR1cyk7ICAvLyAnVkFMSUQnXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ3JlYXRlIGEgZm9ybSBhcnJheSB3aXRoIGFycmF5LWxldmVsIHZhbGlkYXRvcnNcbiAqXG4gKiBZb3UgaW5jbHVkZSBhcnJheS1sZXZlbCB2YWxpZGF0b3JzIGFuZCBhc3luYyB2YWxpZGF0b3JzLiBUaGVzZSBjb21lIGluIGhhbmR5XG4gKiB3aGVuIHlvdSB3YW50IHRvIHBlcmZvcm0gdmFsaWRhdGlvbiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZFxuICogY29udHJvbC5cbiAqXG4gKiBUaGUgdHdvIHR5cGVzIG9mIHZhbGlkYXRvcnMgYXJlIHBhc3NlZCBpbiBzZXBhcmF0ZWx5IGFzIHRoZSBzZWNvbmQgYW5kIHRoaXJkIGFyZ1xuICogcmVzcGVjdGl2ZWx5LCBvciB0b2dldGhlciBhcyBwYXJ0IG9mIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYFxuICogY29uc3QgYXJyID0gbmV3IEZvcm1BcnJheShbXG4gKiAgIG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKSxcbiAqICAgbmV3IEZvcm1Db250cm9sKCdEcmV3JylcbiAqIF0sIHt2YWxpZGF0b3JzOiBteVZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3JzOiBteUFzeW5jVmFsaWRhdG9yfSk7XG4gKiBgYGBcbiAqXG4gICogIyMjIFNldCB0aGUgdXBkYXRlT24gcHJvcGVydHkgZm9yIGFsbCBjb250cm9scyBpbiBhIGZvcm0gYXJyYXlcbiAqXG4gKiBUaGUgb3B0aW9ucyBvYmplY3QgaXMgdXNlZCB0byBzZXQgYSBkZWZhdWx0IHZhbHVlIGZvciBlYWNoIGNoaWxkXG4gKiBjb250cm9sJ3MgYHVwZGF0ZU9uYCBwcm9wZXJ0eS4gSWYgeW91IHNldCBgdXBkYXRlT25gIHRvIGAnYmx1cidgIGF0IHRoZVxuICogYXJyYXkgbGV2ZWwsIGFsbCBjaGlsZCBjb250cm9scyBkZWZhdWx0IHRvICdibHVyJywgdW5sZXNzIHRoZSBjaGlsZFxuICogaGFzIGV4cGxpY2l0bHkgc3BlY2lmaWVkIGEgZGlmZmVyZW50IGB1cGRhdGVPbmAgdmFsdWUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICogICAgbmV3IEZvcm1Db250cm9sKClcbiAqIF0sIHt1cGRhdGVPbjogJ2JsdXInfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQWRkaW5nIG9yIHJlbW92aW5nIGNvbnRyb2xzIGZyb20gYSBmb3JtIGFycmF5XG4gKlxuICogVG8gY2hhbmdlIHRoZSBjb250cm9scyBpbiB0aGUgYXJyYXksIHVzZSB0aGUgYHB1c2hgLCBgaW5zZXJ0YCwgb3IgYHJlbW92ZUF0YCBtZXRob2RzXG4gKiBpbiBgRm9ybUFycmF5YCBpdHNlbGYuIFRoZXNlIG1ldGhvZHMgZW5zdXJlIHRoZSBjb250cm9scyBhcmUgcHJvcGVybHkgdHJhY2tlZCBpbiB0aGVcbiAqIGZvcm0ncyBoaWVyYXJjaHkuIERvIG5vdCBtb2RpZnkgdGhlIGFycmF5IG9mIGBBYnN0cmFjdENvbnRyb2xgcyB1c2VkIHRvIGluc3RhbnRpYXRlXG4gKiB0aGUgYEZvcm1BcnJheWAgZGlyZWN0bHksIGFzIHRoYXQgcmVzdWx0IGluIHN0cmFuZ2UgYW5kIHVuZXhwZWN0ZWQgYmVoYXZpb3Igc3VjaFxuICogYXMgYnJva2VuIGNoYW5nZSBkZXRlY3Rpb24uXG4gKlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1BcnJheSBleHRlbmRzIEFic3RyYWN0Q29udHJvbCB7XG4gIC8qKlxuICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1BcnJheWAgaW5zdGFuY2UuXG4gICpcbiAgKiBAcGFyYW0gY29udHJvbHMgQW4gYXJyYXkgb2YgY2hpbGQgY29udHJvbHMuIEVhY2ggY2hpbGQgY29udHJvbCBpcyBnaXZlbiBhbiBpbmRleFxuICAqIHdoZWggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgKlxuICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAqIGFuZCBhIHZhbGlkYXRpb24gdHJpZ2dlci5cbiAgKlxuICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAqXG4gICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHVibGljIGNvbnRyb2xzOiBBYnN0cmFjdENvbnRyb2xbXSxcbiAgICAgIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIGNvZXJjZVRvVmFsaWRhdG9yKHZhbGlkYXRvck9yT3B0cyksXG4gICAgICAgIGNvZXJjZVRvQXN5bmNWYWxpZGF0b3IoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgIHRoaXMuX2luaXRPYnNlcnZhYmxlcygpO1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgdGhpcy5fc2V0VXBDb250cm9scygpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogZmFsc2V9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGBBYnN0cmFjdENvbnRyb2xgIGF0IHRoZSBnaXZlbiBgaW5kZXhgIGluIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IGluIHRoZSBhcnJheSB0byByZXRyaWV2ZSB0aGUgY29udHJvbFxuICAgKi9cbiAgYXQoaW5kZXg6IG51bWJlcik6IEFic3RyYWN0Q29udHJvbCB7IHJldHVybiB0aGlzLmNvbnRyb2xzW2luZGV4XTsgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgYSBuZXcgYEFic3RyYWN0Q29udHJvbGAgYXQgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgcHVzaChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2xzLnB1c2goY29udHJvbCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSgpO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCBhIG5ldyBgQWJzdHJhY3RDb250cm9sYCBhdCB0aGUgZ2l2ZW4gYGluZGV4YCBpbiB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCBpbiB0aGUgYXJyYXkgdG8gaW5zZXJ0IHRoZSBjb250cm9sXG4gICAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB0byBiZSBpbnNlcnRlZFxuICAgKi9cbiAgaW5zZXJ0KGluZGV4OiBudW1iZXIsIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCk6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcblxuICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGNvbnRyb2wgYXQgdGhlIGdpdmVuIGBpbmRleGAgaW4gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlbW92ZSB0aGUgY29udHJvbFxuICAgKi9cbiAgcmVtb3ZlQXQoaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW2luZGV4XSkgdGhpcy5jb250cm9sc1tpbmRleF0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICB0aGlzLmNvbnRyb2xzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggaW4gdGhlIGFycmF5IHRvIHJlcGxhY2UgdGhlIGNvbnRyb2xcbiAgICogQHBhcmFtIGNvbnRyb2wgVGhlIGBBYnN0cmFjdENvbnRyb2xgIGNvbnRyb2wgdG8gcmVwbGFjZSB0aGUgZXhpc3RpbmcgY29udHJvbFxuICAgKi9cbiAgc2V0Q29udHJvbChpbmRleDogbnVtYmVyLCBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tpbmRleF0pIHRoaXMuY29udHJvbHNbaW5kZXhdLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgdGhpcy5jb250cm9scy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgaWYgKGNvbnRyb2wpIHtcbiAgICAgIHRoaXMuY29udHJvbHMuc3BsaWNlKGluZGV4LCAwLCBjb250cm9sKTtcbiAgICAgIHRoaXMuX3JlZ2lzdGVyQ29udHJvbChjb250cm9sKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoKTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMZW5ndGggb2YgdGhlIGNvbnRyb2wgYXJyYXkuXG4gICAqL1xuICBnZXQgbGVuZ3RoKCk6IG51bWJlciB7IHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aDsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHBlcmZvcm1zIHN0cmljdCBjaGVja3MsIGFuZCB0aHJvd3MgYW4gZXJyb3IgaWYgeW91IHRyeVxuICAgKiB0byBzZXQgdGhlIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXNuJ3QgZXhpc3Qgb3IgaWYgeW91IGV4Y2x1ZGUgdGhlXG4gICAqIHZhbHVlIG9mIGEgY29udHJvbC5cbiAgICpcbiAgICogIyMjIFNldCB0aGUgdmFsdWVzIGZvciB0aGUgY29udHJvbHMgaW4gdGhlIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFtudWxsLCBudWxsXVxuICAgKlxuICAgKiBhcnIuc2V0VmFsdWUoWydOYW5jeScsICdEcmV3J10pO1xuICAgKiBjb25zb2xlLmxvZyhhcnIudmFsdWUpOyAgIC8vIFsnTmFuY3knLCAnRHJldyddXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgdmFsdWVzIGZvciB0aGUgY29udHJvbHNcbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJlIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlcyBhbmRcbiAgICogZW1pdHMgZXZlbnRzIGFmdGVyIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAqXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHRcbiAgICogaXMgZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGlzIHVwZGF0ZWQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tBbGxWYWx1ZXNQcmVzZW50KHZhbHVlKTtcbiAgICB2YWx1ZS5mb3JFYWNoKChuZXdWYWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICB0aGlzLl90aHJvd0lmQ29udHJvbE1pc3NpbmcoaW5kZXgpO1xuICAgICAgdGhpcy5hdChpbmRleCkuc2V0VmFsdWUobmV3VmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1BcnJheWAuIEl0IGFjY2VwdHMgYW4gYXJyYXkgdGhhdCBtYXRjaGVzIHRoZVxuICAgKiBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wsIGFuZCBkb2VzIGl0cyBiZXN0IHRvIG1hdGNoIHRoZSB2YWx1ZXMgdG8gdGhlIGNvcnJlY3RcbiAgICogY29udHJvbHMgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBJdCBhY2NlcHRzIGJvdGggc3VwZXItc2V0cyBhbmQgc3ViLXNldHMgb2YgdGhlIGFycmF5IHdpdGhvdXQgdGhyb3dpbmcgYW4gZXJyb3IuXG4gICAqXG4gICAqICMjIyBQYXRjaCB0aGUgdmFsdWVzIGZvciBjb250cm9scyBpbiBhIGZvcm0gYXJyYXlcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGFyciA9IG5ldyBGb3JtQXJyYXkoW1xuICAgKiAgICBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbmV3IEZvcm1Db250cm9sKClcbiAgICogXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gW251bGwsIG51bGxdXG4gICAqXG4gICAqIGFyci5wYXRjaFZhbHVlKFsnTmFuY3knXSk7XG4gICAqIGNvbnNvbGUubG9nKGFyci52YWx1ZSk7ICAgLy8gWydOYW5jeScsIG51bGxdXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgQXJyYXkgb2YgbGF0ZXN0IHZhbHVlcyBmb3IgdGhlIGNvbnRyb2xzXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyZSBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlc1xuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0XG4gICAqIGlzIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIHBhdGNoVmFsdWUodmFsdWU6IGFueVtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdmFsdWUuZm9yRWFjaCgobmV3VmFsdWU6IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHRoaXMuYXQoaW5kZXgpKSB7XG4gICAgICAgIHRoaXMuYXQoaW5kZXgpLnBhdGNoVmFsdWUobmV3VmFsdWUsIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGBGb3JtQXJyYXlgIGFuZCBhbGwgZGVzY2VuZGFudHMgYXJlIG1hcmtlZCBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCwgYW5kIHRoZVxuICAgKiB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gbnVsbCBvciBudWxsIG1hcHMuXG4gICAqXG4gICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhbiBhcnJheSBvZiBzdGF0ZXNcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGNvbnRyb2wuIFRoZSBzdGF0ZSBpcyBhIHN0YW5kYWxvbmUgdmFsdWVcbiAgICogb3IgYSBmb3JtIHN0YXRlIG9iamVjdCB3aXRoIGJvdGggYSB2YWx1ZSBhbmQgYSBkaXNhYmxlZCBzdGF0dXMuXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgdmFsdWVzIGluIGEgZm9ybSBhcnJheVxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBhcnIgPSBuZXcgRm9ybUFycmF5KFtcbiAgICogICAgbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgIG5ldyBGb3JtQ29udHJvbCgpXG4gICAqIF0pO1xuICAgKiBhcnIucmVzZXQoWyduYW1lJywgJ2xhc3QgbmFtZSddKTtcbiAgICpcbiAgICogY29uc29sZS5sb2codGhpcy5hcnIudmFsdWUpOyAgLy8gWyduYW1lJywgJ2xhc3QgbmFtZSddXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgUmVzZXQgdGhlIHZhbHVlcyBpbiBhIGZvcm0gYXJyYXkgYW5kIHRoZSBkaXNhYmxlZCBzdGF0dXMgZm9yIHRoZSBmaXJzdCBjb250cm9sXG4gICAqXG4gICAqIGBgYFxuICAgKiB0aGlzLmFyci5yZXNldChbXG4gICAqICAge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICogICAnbGFzdCdcbiAgICogXSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKHRoaXMuYXJyLnZhbHVlKTsgIC8vIFsnbmFtZScsICdsYXN0IG5hbWUnXVxuICAgKiBjb25zb2xlLmxvZyh0aGlzLmFyci5nZXQoMCkuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBBcnJheSBvZiB2YWx1ZXMgZm9yIHRoZSBjb250cm9sc1xuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmUgb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXNcbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdFxuICAgKiBpcyBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXMgcmVzZXQuXG4gICAqIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgcmVzZXQodmFsdWU6IGFueSA9IFtdLCBvcHRpb25zOiB7b25seVNlbGY/OiBib29sZWFuLCBlbWl0RXZlbnQ/OiBib29sZWFufSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGNvbnRyb2wucmVzZXQodmFsdWVbaW5kZXhdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBhcnJheSwgaW5jbHVkaW5nIGFueSBkaXNhYmxlZCBjb250cm9scy5cbiAgICpcbiAgICogUmVwb3J0cyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKiBGb3IgZW5hYmxlZCBjb250cm9scyBvbmx5LCB0aGUgYHZhbHVlYCBwcm9wZXJ0eSBpcyB0aGUgYmVzdCB3YXkgdG8gZ2V0IHRoZSB2YWx1ZSBvZiB0aGUgYXJyYXkuXG4gICAqL1xuICBnZXRSYXdWYWx1ZSgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMubWFwKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjb250cm9sIGluc3RhbmNlb2YgRm9ybUNvbnRyb2wgPyBjb250cm9sLnZhbHVlIDogKDxhbnk+Y29udHJvbCkuZ2V0UmF3VmFsdWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3N5bmNQZW5kaW5nQ29udHJvbHMoKTogYm9vbGVhbiB7XG4gICAgbGV0IHN1YnRyZWVVcGRhdGVkID0gdGhpcy5jb250cm9scy5yZWR1Y2UoKHVwZGF0ZWQ6IGJvb2xlYW4sIGNoaWxkOiBBYnN0cmFjdENvbnRyb2wpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSwgZmFsc2UpO1xuICAgIGlmIChzdWJ0cmVlVXBkYXRlZCkgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtvbmx5U2VsZjogdHJ1ZX0pO1xuICAgIHJldHVybiBzdWJ0cmVlVXBkYXRlZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3Rocm93SWZDb250cm9sTWlzc2luZyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNvbnRyb2xzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgICAgVGhlcmUgYXJlIG5vIGZvcm0gY29udHJvbHMgcmVnaXN0ZXJlZCB3aXRoIHRoaXMgYXJyYXkgeWV0LiAgSWYgeW91J3JlIHVzaW5nIG5nTW9kZWwsXG4gICAgICAgIHlvdSBtYXkgd2FudCB0byBjaGVjayBuZXh0IHRpY2sgKGUuZy4gdXNlIHNldFRpbWVvdXQpLlxuICAgICAgYCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5hdChpbmRleCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGZpbmQgZm9ybSBjb250cm9sIGF0IGluZGV4ICR7aW5kZXh9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZm9yRWFjaENoaWxkKGNiOiBGdW5jdGlvbik6IHZvaWQge1xuICAgIHRoaXMuY29udHJvbHMuZm9yRWFjaCgoY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBpbmRleDogbnVtYmVyKSA9PiB7IGNiKGNvbnRyb2wsIGluZGV4KTsgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICAodGhpcyBhc3t2YWx1ZTogYW55fSkudmFsdWUgPVxuICAgICAgICB0aGlzLmNvbnRyb2xzLmZpbHRlcigoY29udHJvbCkgPT4gY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpXG4gICAgICAgICAgICAubWFwKChjb250cm9sKSA9PiBjb250cm9sLnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogRnVuY3Rpb24pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5zb21lKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpID0+IGNvbnRyb2wuZW5hYmxlZCAmJiBjb25kaXRpb24oY29udHJvbCkpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0VXBDb250cm9scygpOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCkgPT4gdGhpcy5fcmVnaXN0ZXJDb250cm9sKGNvbnRyb2wpKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NoZWNrQWxsVmFsdWVzUHJlc2VudCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIGk6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKHZhbHVlW2ldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNdXN0IHN1cHBseSBhIHZhbHVlIGZvciBmb3JtIGNvbnRyb2wgYXQgaW5kZXg6ICR7aX0uYCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9hbGxDb250cm9sc0Rpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgY29udHJvbCBvZiB0aGlzLmNvbnRyb2xzKSB7XG4gICAgICBpZiAoY29udHJvbC5lbmFibGVkKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmxlbmd0aCA+IDAgfHwgdGhpcy5kaXNhYmxlZDtcbiAgfVxuXG4gIHByaXZhdGUgX3JlZ2lzdGVyQ29udHJvbChjb250cm9sOiBBYnN0cmFjdENvbnRyb2wpIHtcbiAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSh0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpO1xuICB9XG59XG4iXX0=