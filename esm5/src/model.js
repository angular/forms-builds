/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { EventEmitter } from '@angular/core';
import { composeAsyncValidators, composeValidators } from './directives/shared';
import { toObservable } from './validators';
/**
 * Indicates that a FormControl is valid, i.e. that no errors exist in the input value.
 */
export var /** @type {?} */ VALID = 'VALID';
/**
 * Indicates that a FormControl is invalid, i.e. that an error exists in the input value.
 */
export var /** @type {?} */ INVALID = 'INVALID';
/**
 * Indicates that a FormControl is pending, i.e. that async validation is occurring and
 * errors are not yet available for the input value.
 */
export var /** @type {?} */ PENDING = 'PENDING';
/**
 * Indicates that a FormControl is disabled, i.e. that the control is exempt from ancestor
 * calculations of validity or value.
 */
export var /** @type {?} */ DISABLED = 'DISABLED';
/**
 * @param {?} control
 * @param {?} path
 * @param {?} delimiter
 * @return {?}
 */
function _find(control, path, delimiter) {
    if (path == null)
        return null;
    if (!(path instanceof Array)) {
        path = (/** @type {?} */ (path)).split(delimiter);
    }
    if (path instanceof Array && (path.length === 0))
        return null;
    return (/** @type {?} */ (path)).reduce(function (v, name) {
        if (v instanceof FormGroup) {
            return v.controls[name] || null;
        }
        if (v instanceof FormArray) {
            return v.at(/** @type {?} */ (name)) || null;
        }
        return null;
    }, control);
}
/**
 * @param {?=} validatorOrOpts
 * @return {?}
 */
function coerceToValidator(validatorOrOpts) {
    var /** @type {?} */ validator = /** @type {?} */ ((isOptionsObj(validatorOrOpts) ? (/** @type {?} */ (validatorOrOpts)).validators :
        validatorOrOpts));
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
/**
 * @param {?=} asyncValidator
 * @param {?=} validatorOrOpts
 * @return {?}
 */
function coerceToAsyncValidator(asyncValidator, validatorOrOpts) {
    var /** @type {?} */ origAsyncValidator = /** @type {?} */ ((isOptionsObj(validatorOrOpts) ? (/** @type {?} */ (validatorOrOpts)).asyncValidators :
        asyncValidator));
    return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) :
        origAsyncValidator || null;
}
/**
 * \@whatItDoes Interface for options provided to an {\@link AbstractControl}.
 *
 * \@experimental
 * @record
 */
export function AbstractControlOptions() { }
function AbstractControlOptions_tsickle_Closure_declarations() {
    /**
     * List of validators applied to control.
     * @type {?|undefined}
     */
    AbstractControlOptions.prototype.validators;
    /**
     * List of async validators applied to control.
     * @type {?|undefined}
     */
    AbstractControlOptions.prototype.asyncValidators;
    /**
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
 * \@whatItDoes This is the base class for {\@link FormControl}, {\@link FormGroup}, and
 * {\@link FormArray}.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 * \@stable
 * @abstract
 */
var /**
 * \@whatItDoes This is the base class for {\@link FormControl}, {\@link FormGroup}, and
 * {\@link FormArray}.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 * \@stable
 * @abstract
 */
AbstractControl = /** @class */ (function () {
    /**
     * Initialize the AbstractControl instance.
     * @param validator The function that will determine the synchronous validity of this control.
     * @param asyncValidator The function that will determine the asynchronous validity of this
     * control.
     */
    function AbstractControl(validator, asyncValidator) {
        this.validator = validator;
        this.asyncValidator = asyncValidator;
        /**
         * \@internal
         */
        this._onCollectionChange = function () { };
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * Note that programmatic changes to a control's value will
         * *not* mark it dirty.
         */
        this.pristine = true;
        /**
         * A control is marked `touched` once the user has triggered
         * a `blur` event on it.
         */
        this.touched = false;
        /**
         * \@internal
         */
        this._onDisabledChange = [];
    }
    Object.defineProperty(AbstractControl.prototype, "parent", {
        /**
         * The parent control.
         */
        get: /**
         * The parent control.
         * @return {?}
         */
        function () { return this._parent; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "valid", {
        /**
         * A control is `valid` when its `status === VALID`.
         *
         * In order to have this status, the control must have passed all its
         * validation checks.
         */
        get: /**
         * A control is `valid` when its `status === VALID`.
         *
         * In order to have this status, the control must have passed all its
         * validation checks.
         * @return {?}
         */
        function () { return this.status === VALID; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "invalid", {
        /**
         * A control is `invalid` when its `status === INVALID`.
         *
         * In order to have this status, the control must have failed
         * at least one of its validation checks.
         */
        get: /**
         * A control is `invalid` when its `status === INVALID`.
         *
         * In order to have this status, the control must have failed
         * at least one of its validation checks.
         * @return {?}
         */
        function () { return this.status === INVALID; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "pending", {
        /**
         * A control is `pending` when its `status === PENDING`.
         *
         * In order to have this status, the control must be in the
         * middle of conducting a validation check.
         */
        get: /**
         * A control is `pending` when its `status === PENDING`.
         *
         * In order to have this status, the control must be in the
         * middle of conducting a validation check.
         * @return {?}
         */
        function () { return this.status == PENDING; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "disabled", {
        /**
         * A control is `disabled` when its `status === DISABLED`.
         *
         * Disabled controls are exempt from validation checks and
         * are not included in the aggregate value of their ancestor
         * controls.
         */
        get: /**
         * A control is `disabled` when its `status === DISABLED`.
         *
         * Disabled controls are exempt from validation checks and
         * are not included in the aggregate value of their ancestor
         * controls.
         * @return {?}
         */
        function () { return this.status === DISABLED; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "enabled", {
        /**
         * A control is `enabled` as long as its `status !== DISABLED`.
         *
         * In other words, it has a status of `VALID`, `INVALID`, or
         * `PENDING`.
         */
        get: /**
         * A control is `enabled` as long as its `status !== DISABLED`.
         *
         * In other words, it has a status of `VALID`, `INVALID`, or
         * `PENDING`.
         * @return {?}
         */
        function () { return this.status !== DISABLED; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "dirty", {
        /**
         * A control is `dirty` if the user has changed the value
         * in the UI.
         *
         * Note that programmatic changes to a control's value will
         * *not* mark it dirty.
         */
        get: /**
         * A control is `dirty` if the user has changed the value
         * in the UI.
         *
         * Note that programmatic changes to a control's value will
         * *not* mark it dirty.
         * @return {?}
         */
        function () { return !this.pristine; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "untouched", {
        /**
         * A control is `untouched` if the user has not yet triggered
         * a `blur` event on it.
         */
        get: /**
         * A control is `untouched` if the user has not yet triggered
         * a `blur` event on it.
         * @return {?}
         */
        function () { return !this.touched; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControl.prototype, "updateOn", {
        /**
         * Returns the update strategy of the `AbstractControl` (i.e.
         * the event on which the control will update itself).
         * Possible values: `'change'` (default) | `'blur'` | `'submit'`
         */
        get: /**
         * Returns the update strategy of the `AbstractControl` (i.e.
         * the event on which the control will update itself).
         * Possible values: `'change'` (default) | `'blur'` | `'submit'`
         * @return {?}
         */
        function () {
            return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this will overwrite any existing sync validators.
     */
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this will overwrite any existing sync validators.
     * @param {?} newValidator
     * @return {?}
     */
    AbstractControl.prototype.setValidators = /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this will overwrite any existing sync validators.
     * @param {?} newValidator
     * @return {?}
     */
    function (newValidator) {
        this.validator = coerceToValidator(newValidator);
    };
    /**
     * Sets the async validators that are active on this control. Calling this
     * will overwrite any existing async validators.
     */
    /**
     * Sets the async validators that are active on this control. Calling this
     * will overwrite any existing async validators.
     * @param {?} newValidator
     * @return {?}
     */
    AbstractControl.prototype.setAsyncValidators = /**
     * Sets the async validators that are active on this control. Calling this
     * will overwrite any existing async validators.
     * @param {?} newValidator
     * @return {?}
     */
    function (newValidator) {
        this.asyncValidator = coerceToAsyncValidator(newValidator);
    };
    /**
     * Empties out the sync validator list.
     */
    /**
     * Empties out the sync validator list.
     * @return {?}
     */
    AbstractControl.prototype.clearValidators = /**
     * Empties out the sync validator list.
     * @return {?}
     */
    function () { this.validator = null; };
    /**
     * Empties out the async validator list.
     */
    /**
     * Empties out the async validator list.
     * @return {?}
     */
    AbstractControl.prototype.clearAsyncValidators = /**
     * Empties out the async validator list.
     * @return {?}
     */
    function () { this.asyncValidator = null; };
    /**
     * Marks the control as `touched`.
     *
     * This will also mark all direct ancestors as `touched` to maintain
     * the model.
     */
    /**
     * Marks the control as `touched`.
     *
     * This will also mark all direct ancestors as `touched` to maintain
     * the model.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.markAsTouched = /**
     * Marks the control as `touched`.
     *
     * This will also mark all direct ancestors as `touched` to maintain
     * the model.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).touched = true;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched(opts);
        }
    };
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, it will also mark all children as `untouched`
     * to maintain the model, and re-calculate the `touched` status of all parent
     * controls.
     */
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, it will also mark all children as `untouched`
     * to maintain the model, and re-calculate the `touched` status of all parent
     * controls.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.markAsUntouched = /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, it will also mark all children as `untouched`
     * to maintain the model, and re-calculate the `touched` status of all parent
     * controls.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).touched = false;
        this._pendingTouched = false;
        this._forEachChild(function (control) { control.markAsUntouched({ onlySelf: true }); });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    };
    /**
     * Marks the control as `dirty`.
     *
     * This will also mark all direct ancestors as `dirty` to maintain
     * the model.
     */
    /**
     * Marks the control as `dirty`.
     *
     * This will also mark all direct ancestors as `dirty` to maintain
     * the model.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.markAsDirty = /**
     * Marks the control as `dirty`.
     *
     * This will also mark all direct ancestors as `dirty` to maintain
     * the model.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).pristine = false;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsDirty(opts);
        }
    };
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, it will also mark all children as `pristine`
     * to maintain the model, and re-calculate the `pristine` status of all parent
     * controls.
     */
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, it will also mark all children as `pristine`
     * to maintain the model, and re-calculate the `pristine` status of all parent
     * controls.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.markAsPristine = /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, it will also mark all children as `pristine`
     * to maintain the model, and re-calculate the `pristine` status of all parent
     * controls.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).pristine = true;
        this._pendingDirty = false;
        this._forEachChild(function (control) { control.markAsPristine({ onlySelf: true }); });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    };
    /**
     * Marks the control as `pending`.
     *
     * An event will be emitted by `statusChanges` by default.
     *
     * Passing `false` for `emitEvent` will cause `statusChanges` to not event an event.
     */
    /**
     * Marks the control as `pending`.
     *
     * An event will be emitted by `statusChanges` by default.
     *
     * Passing `false` for `emitEvent` will cause `statusChanges` to not event an event.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.markAsPending = /**
     * Marks the control as `pending`.
     *
     * An event will be emitted by `statusChanges` by default.
     *
     * Passing `false` for `emitEvent` will cause `statusChanges` to not event an event.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).status = PENDING;
        if (opts.emitEvent !== false) {
            (/** @type {?} */ (this.statusChanges)).emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsPending(opts);
        }
    };
    /**
     * Disables the control. This means the control will be exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children will be disabled to maintain the model.
     */
    /**
     * Disables the control. This means the control will be exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children will be disabled to maintain the model.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.disable = /**
     * Disables the control. This means the control will be exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children will be disabled to maintain the model.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).status = DISABLED;
        (/** @type {?} */ (this)).errors = null;
        this._forEachChild(function (control) { control.disable(tslib_1.__assign({}, opts, { onlySelf: true })); });
        this._updateValue();
        if (opts.emitEvent !== false) {
            (/** @type {?} */ (this.valueChanges)).emit(this.value);
            (/** @type {?} */ (this.statusChanges)).emit(this.status);
        }
        this._updateAncestors(opts);
        this._onDisabledChange.forEach(function (changeFn) { return changeFn(true); });
    };
    /**
     * Enables the control. This means the control will be included in validation checks and
     * the aggregate value of its parent. Its status is re-calculated based on its value and
     * its validators.
     *
     * If the control has children, all children will be enabled.
     */
    /**
     * Enables the control. This means the control will be included in validation checks and
     * the aggregate value of its parent. Its status is re-calculated based on its value and
     * its validators.
     *
     * If the control has children, all children will be enabled.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.enable = /**
     * Enables the control. This means the control will be included in validation checks and
     * the aggregate value of its parent. Its status is re-calculated based on its value and
     * its validators.
     *
     * If the control has children, all children will be enabled.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).status = VALID;
        this._forEachChild(function (control) { control.enable(tslib_1.__assign({}, opts, { onlySelf: true })); });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors(opts);
        this._onDisabledChange.forEach(function (changeFn) { return changeFn(false); });
    };
    /**
     * @param {?} opts
     * @return {?}
     */
    AbstractControl.prototype._updateAncestors = /**
     * @param {?} opts
     * @return {?}
     */
    function (opts) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            this._parent._updatePristine();
            this._parent._updateTouched();
        }
    };
    /**
     * @param {?} parent
     * @return {?}
     */
    AbstractControl.prototype.setParent = /**
     * @param {?} parent
     * @return {?}
     */
    function (parent) { this._parent = parent; };
    /**
     * Re-calculates the value and validation status of the control.
     *
     * By default, it will also update the value and validity of its ancestors.
     */
    /**
     * Re-calculates the value and validation status of the control.
     *
     * By default, it will also update the value and validity of its ancestors.
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.updateValueAndValidity = /**
     * Re-calculates the value and validation status of the control.
     *
     * By default, it will also update the value and validity of its ancestors.
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._cancelExistingSubscription();
            (/** @type {?} */ (this)).errors = this._runValidator();
            (/** @type {?} */ (this)).status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                this._runAsyncValidator(opts.emitEvent);
            }
        }
        if (opts.emitEvent !== false) {
            (/** @type {?} */ (this.valueChanges)).emit(this.value);
            (/** @type {?} */ (this.statusChanges)).emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
        }
    };
    /** @internal */
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype._updateTreeValidity = /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = { emitEvent: true }; }
        this._forEachChild(function (ctrl) { return ctrl._updateTreeValidity(opts); });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
    };
    /**
     * @return {?}
     */
    AbstractControl.prototype._setInitialStatus = /**
     * @return {?}
     */
    function () {
        (/** @type {?} */ (this)).status = this._allControlsDisabled() ? DISABLED : VALID;
    };
    /**
     * @return {?}
     */
    AbstractControl.prototype._runValidator = /**
     * @return {?}
     */
    function () {
        return this.validator ? this.validator(this) : null;
    };
    /**
     * @param {?=} emitEvent
     * @return {?}
     */
    AbstractControl.prototype._runAsyncValidator = /**
     * @param {?=} emitEvent
     * @return {?}
     */
    function (emitEvent) {
        var _this = this;
        if (this.asyncValidator) {
            (/** @type {?} */ (this)).status = PENDING;
            var /** @type {?} */ obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription =
                obs.subscribe(function (errors) { return _this.setErrors(errors, { emitEvent: emitEvent }); });
        }
    };
    /**
     * @return {?}
     */
    AbstractControl.prototype._cancelExistingSubscription = /**
     * @return {?}
     */
    function () {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
        }
    };
    /**
     * Sets errors on a form control.
     *
     * This is used when validations are run manually by the user, rather than automatically.
     *
     * Calling `setErrors` will also update the validity of the parent control.
     *
     * ### Example
     *
     * ```
     * const login = new FormControl("someLogin");
     * login.setErrors({
     *   "notUnique": true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({"notUnique": true});
     *
     * login.setValue("someOtherLogin");
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    /**
     * Sets errors on a form control.
     *
     * This is used when validations are run manually by the user, rather than automatically.
     *
     * Calling `setErrors` will also update the validity of the parent control.
     *
     * ### Example
     *
     * ```
     * const login = new FormControl("someLogin");
     * login.setErrors({
     *   "notUnique": true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({"notUnique": true});
     *
     * login.setValue("someOtherLogin");
     *
     * expect(login.valid).toEqual(true);
     * ```
     * @param {?} errors
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype.setErrors = /**
     * Sets errors on a form control.
     *
     * This is used when validations are run manually by the user, rather than automatically.
     *
     * Calling `setErrors` will also update the validity of the parent control.
     *
     * ### Example
     *
     * ```
     * const login = new FormControl("someLogin");
     * login.setErrors({
     *   "notUnique": true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({"notUnique": true});
     *
     * login.setValue("someOtherLogin");
     *
     * expect(login.valid).toEqual(true);
     * ```
     * @param {?} errors
     * @param {?=} opts
     * @return {?}
     */
    function (errors, opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false);
    };
    /**
     * Retrieves a child control given the control's name or path.
     *
     * Paths can be passed in as an array or a string delimited by a dot.
     *
     * To get a control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     */
    /**
     * Retrieves a child control given the control's name or path.
     *
     * Paths can be passed in as an array or a string delimited by a dot.
     *
     * To get a control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     * @param {?} path
     * @return {?}
     */
    AbstractControl.prototype.get = /**
     * Retrieves a child control given the control's name or path.
     *
     * Paths can be passed in as an array or a string delimited by a dot.
     *
     * To get a control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     * @param {?} path
     * @return {?}
     */
    function (path) { return _find(this, path, '.'); };
    /**
     * Returns error data if the control with the given path has the error specified. Otherwise
     * returns null or undefined.
     *
     * If no path is given, it checks for the error on the present control.
     */
    /**
     * Returns error data if the control with the given path has the error specified. Otherwise
     * returns null or undefined.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    AbstractControl.prototype.getError = /**
     * Returns error data if the control with the given path has the error specified. Otherwise
     * returns null or undefined.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    function (errorCode, path) {
        var /** @type {?} */ control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    };
    /**
     * Returns true if the control with the given path has the error specified. Otherwise
     * returns false.
     *
     * If no path is given, it checks for the error on the present control.
     */
    /**
     * Returns true if the control with the given path has the error specified. Otherwise
     * returns false.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    AbstractControl.prototype.hasError = /**
     * Returns true if the control with the given path has the error specified. Otherwise
     * returns false.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    function (errorCode, path) { return !!this.getError(errorCode, path); };
    Object.defineProperty(AbstractControl.prototype, "root", {
        /**
         * Retrieves the top-level ancestor of this control.
         */
        get: /**
         * Retrieves the top-level ancestor of this control.
         * @return {?}
         */
        function () {
            var /** @type {?} */ x = this;
            while (x._parent) {
                x = x._parent;
            }
            return x;
        },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    /**
     * \@internal
     * @param {?} emitEvent
     * @return {?}
     */
    AbstractControl.prototype._updateControlsErrors = /**
     * \@internal
     * @param {?} emitEvent
     * @return {?}
     */
    function (emitEvent) {
        (/** @type {?} */ (this)).status = this._calculateStatus();
        if (emitEvent) {
            (/** @type {?} */ (this.statusChanges)).emit(this.status);
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent);
        }
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    AbstractControl.prototype._initObservables = /**
     * \@internal
     * @return {?}
     */
    function () {
        (/** @type {?} */ (this)).valueChanges = new EventEmitter();
        (/** @type {?} */ (this)).statusChanges = new EventEmitter();
    };
    /**
     * @return {?}
     */
    AbstractControl.prototype._calculateStatus = /**
     * @return {?}
     */
    function () {
        if (this._allControlsDisabled())
            return DISABLED;
        if (this.errors)
            return INVALID;
        if (this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} status
     * @return {?}
     */
    AbstractControl.prototype._anyControlsHaveStatus = /**
     * \@internal
     * @param {?} status
     * @return {?}
     */
    function (status) {
        return this._anyControls(function (control) { return control.status === status; });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    AbstractControl.prototype._anyControlsDirty = /**
     * \@internal
     * @return {?}
     */
    function () {
        return this._anyControls(function (control) { return control.dirty; });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    AbstractControl.prototype._anyControlsTouched = /**
     * \@internal
     * @return {?}
     */
    function () {
        return this._anyControls(function (control) { return control.touched; });
    };
    /** @internal */
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype._updatePristine = /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    };
    /** @internal */
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype._updateTouched = /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (opts === void 0) { opts = {}; }
        (/** @type {?} */ (this)).touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} formState
     * @return {?}
     */
    AbstractControl.prototype._isBoxedValue = /**
     * \@internal
     * @param {?} formState
     * @return {?}
     */
    function (formState) {
        return typeof formState === 'object' && formState !== null &&
            Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} fn
     * @return {?}
     */
    AbstractControl.prototype._registerOnCollectionChange = /**
     * \@internal
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onCollectionChange = fn; };
    /** @internal */
    /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    AbstractControl.prototype._setUpdateStrategy = /**
     * \@internal
     * @param {?=} opts
     * @return {?}
     */
    function (opts) {
        if (isOptionsObj(opts) && (/** @type {?} */ (opts)).updateOn != null) {
            this._updateOn = /** @type {?} */ (((/** @type {?} */ (opts)).updateOn));
        }
    };
    return AbstractControl;
}());
/**
 * \@whatItDoes This is the base class for {\@link FormControl}, {\@link FormGroup}, and
 * {\@link FormArray}.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 * \@stable
 * @abstract
 */
export { AbstractControl };
function AbstractControl_tsickle_Closure_declarations() {
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
    /** @type {?} */
    AbstractControl.prototype._parent;
    /** @type {?} */
    AbstractControl.prototype._asyncValidationSubscription;
    /** @type {?} */
    AbstractControl.prototype.value;
    /**
     * The validation status of the control. There are four possible
     * validation statuses:
     *
     * * **VALID**:  control has passed all validation checks
     * * **INVALID**: control has failed at least one validation check
     * * **PENDING**: control is in the midst of conducting a validation check
     * * **DISABLED**: control is exempt from validation checks
     *
     * These statuses are mutually exclusive, so a control cannot be
     * both valid AND invalid or invalid AND disabled.
     * @type {?}
     */
    AbstractControl.prototype.status;
    /**
     * Returns any errors generated by failing validation. If there
     * are no errors, it will return null.
     * @type {?}
     */
    AbstractControl.prototype.errors;
    /**
     * A control is `pristine` if the user has not yet changed
     * the value in the UI.
     *
     * Note that programmatic changes to a control's value will
     * *not* mark it dirty.
     * @type {?}
     */
    AbstractControl.prototype.pristine;
    /**
     * A control is marked `touched` once the user has triggered
     * a `blur` event on it.
     * @type {?}
     */
    AbstractControl.prototype.touched;
    /**
     * Emits an event every time the value of the control changes, in
     * the UI or programmatically.
     * @type {?}
     */
    AbstractControl.prototype.valueChanges;
    /**
     * Emits an event every time the validation status of the control
     * is re-calculated.
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
 * \@whatItDoes Tracks the value and validation status of an individual form control.
 *
 * It is one of the three fundamental building blocks of Angular forms, along with
 * {\@link FormGroup} and {\@link FormArray}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormControl}, you can pass in an initial value as the
 * first argument. Example:
 *
 * ```ts
 * const ctrl = new FormControl('some value');
 * console.log(ctrl.value);     // 'some value'
 * ```
 *
 * You can also initialize the control with a form state object on instantiation,
 * which includes both the value and whether or not the control is disabled.
 * You can't use the value key without the disabled key; both are required
 * to use this way of initialization.
 *
 * ```ts
 * const ctrl = new FormControl({value: 'n/a', disabled: true});
 * console.log(ctrl.value);     // 'n/a'
 * console.log(ctrl.status);   // 'DISABLED'
 * ```
 *
 * The second {\@link FormControl} argument can accept one of three things:
 * * a sync validator function
 * * an array of sync validator functions
 * * an options object containing validator and/or async validator functions
 *
 * Example of a single sync validator function:
 *
 * ```ts
 * const ctrl = new FormControl('', Validators.required);
 * console.log(ctrl.value);     // ''
 * console.log(ctrl.status);   // 'INVALID'
 * ```
 *
 * Example using options object:
 *
 * ```ts
 * const ctrl = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * The options object can also be used to define when the control should update.
 * By default, the value and validity of a control updates whenever the value
 * changes. You can configure it to update on the blur event instead by setting
 * the `updateOn` option to `'blur'`.
 *
 * ```ts
 * const c = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * You can also set `updateOn` to `'submit'`, which will delay value and validity
 * updates until the parent form of the control fires a submit event.
 *
 * See its superclass, {\@link AbstractControl}, for more properties and methods.
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
var /**
 * \@whatItDoes Tracks the value and validation status of an individual form control.
 *
 * It is one of the three fundamental building blocks of Angular forms, along with
 * {\@link FormGroup} and {\@link FormArray}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormControl}, you can pass in an initial value as the
 * first argument. Example:
 *
 * ```ts
 * const ctrl = new FormControl('some value');
 * console.log(ctrl.value);     // 'some value'
 * ```
 *
 * You can also initialize the control with a form state object on instantiation,
 * which includes both the value and whether or not the control is disabled.
 * You can't use the value key without the disabled key; both are required
 * to use this way of initialization.
 *
 * ```ts
 * const ctrl = new FormControl({value: 'n/a', disabled: true});
 * console.log(ctrl.value);     // 'n/a'
 * console.log(ctrl.status);   // 'DISABLED'
 * ```
 *
 * The second {\@link FormControl} argument can accept one of three things:
 * * a sync validator function
 * * an array of sync validator functions
 * * an options object containing validator and/or async validator functions
 *
 * Example of a single sync validator function:
 *
 * ```ts
 * const ctrl = new FormControl('', Validators.required);
 * console.log(ctrl.value);     // ''
 * console.log(ctrl.status);   // 'INVALID'
 * ```
 *
 * Example using options object:
 *
 * ```ts
 * const ctrl = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * The options object can also be used to define when the control should update.
 * By default, the value and validity of a control updates whenever the value
 * changes. You can configure it to update on the blur event instead by setting
 * the `updateOn` option to `'blur'`.
 *
 * ```ts
 * const c = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * You can also set `updateOn` to `'submit'`, which will delay value and validity
 * updates until the parent form of the control fires a submit event.
 *
 * See its superclass, {\@link AbstractControl}, for more properties and methods.
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
FormControl = /** @class */ (function (_super) {
    tslib_1.__extends(FormControl, _super);
    function FormControl(formState, validatorOrOpts, asyncValidator) {
        if (formState === void 0) { formState = null; }
        var _this = _super.call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)) || this;
        /**
         * \@internal
         */
        _this._onChange = [];
        _this._applyFormState(formState);
        _this._setUpdateStrategy(validatorOrOpts);
        _this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        _this._initObservables();
        return _this;
    }
    /**
     * Set the value of the form control to `value`.
     *
     * If `onlySelf` is `true`, this change will only affect the validation of this `FormControl`
     * and not its parent component. This defaults to false.
     *
     * If `emitEvent` is `true`, this
     * change will cause a `valueChanges` event on the `FormControl` to be emitted. This defaults
     * to true (as it falls through to `updateValueAndValidity`).
     *
     * If `emitModelToViewChange` is `true`, the view will be notified about the new value
     * via an `onChange` event. This is the default behavior if `emitModelToViewChange` is not
     * specified.
     *
     * If `emitViewToModelChange` is `true`, an ngModelChange event will be fired to update the
     * model.  This is the default behavior if `emitViewToModelChange` is not specified.
     */
    /**
     * Set the value of the form control to `value`.
     *
     * If `onlySelf` is `true`, this change will only affect the validation of this `FormControl`
     * and not its parent component. This defaults to false.
     *
     * If `emitEvent` is `true`, this
     * change will cause a `valueChanges` event on the `FormControl` to be emitted. This defaults
     * to true (as it falls through to `updateValueAndValidity`).
     *
     * If `emitModelToViewChange` is `true`, the view will be notified about the new value
     * via an `onChange` event. This is the default behavior if `emitModelToViewChange` is not
     * specified.
     *
     * If `emitViewToModelChange` is `true`, an ngModelChange event will be fired to update the
     * model.  This is the default behavior if `emitViewToModelChange` is not specified.
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    FormControl.prototype.setValue = /**
     * Set the value of the form control to `value`.
     *
     * If `onlySelf` is `true`, this change will only affect the validation of this `FormControl`
     * and not its parent component. This defaults to false.
     *
     * If `emitEvent` is `true`, this
     * change will cause a `valueChanges` event on the `FormControl` to be emitted. This defaults
     * to true (as it falls through to `updateValueAndValidity`).
     *
     * If `emitModelToViewChange` is `true`, the view will be notified about the new value
     * via an `onChange` event. This is the default behavior if `emitModelToViewChange` is not
     * specified.
     *
     * If `emitViewToModelChange` is `true`, an ngModelChange event will be fired to update the
     * model.  This is the default behavior if `emitViewToModelChange` is not specified.
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        (/** @type {?} */ (this)).value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
            this._onChange.forEach(function (changeFn) { return changeFn(_this.value, options.emitViewToModelChange !== false); });
        }
        this.updateValueAndValidity(options);
    };
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     */
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {\@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {\@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    FormControl.prototype.patchValue = /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {\@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {\@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        if (options === void 0) { options = {}; }
        this.setValue(value, options);
    };
    /**
     * Resets the form control. This means by default:
     *
     * * it is marked as `pristine`
     * * it is marked as `untouched`
     * * value is set to null
     *
     * You can also reset to a specific form state by passing through a standalone
     * value or a form state object that contains both a value and a disabled state
     * (these are the only two properties that cannot be calculated).
     *
     * Ex:
     *
     * ```ts
     * this.control.reset('Nancy');
     *
     * console.log(this.control.value);  // 'Nancy'
     * ```
     *
     * OR
     *
     * ```
     * this.control.reset({value: 'Nancy', disabled: true});
     *
     * console.log(this.control.value);  // 'Nancy'
     * console.log(this.control.status);  // 'DISABLED'
     * ```
     */
    /**
     * Resets the form control. This means by default:
     *
     * * it is marked as `pristine`
     * * it is marked as `untouched`
     * * value is set to null
     *
     * You can also reset to a specific form state by passing through a standalone
     * value or a form state object that contains both a value and a disabled state
     * (these are the only two properties that cannot be calculated).
     *
     * Ex:
     *
     * ```ts
     * this.control.reset('Nancy');
     *
     * console.log(this.control.value);  // 'Nancy'
     * ```
     *
     * OR
     *
     * ```
     * this.control.reset({value: 'Nancy', disabled: true});
     *
     * console.log(this.control.value);  // 'Nancy'
     * console.log(this.control.status);  // 'DISABLED'
     * ```
     * @param {?=} formState
     * @param {?=} options
     * @return {?}
     */
    FormControl.prototype.reset = /**
     * Resets the form control. This means by default:
     *
     * * it is marked as `pristine`
     * * it is marked as `untouched`
     * * value is set to null
     *
     * You can also reset to a specific form state by passing through a standalone
     * value or a form state object that contains both a value and a disabled state
     * (these are the only two properties that cannot be calculated).
     *
     * Ex:
     *
     * ```ts
     * this.control.reset('Nancy');
     *
     * console.log(this.control.value);  // 'Nancy'
     * ```
     *
     * OR
     *
     * ```
     * this.control.reset({value: 'Nancy', disabled: true});
     *
     * console.log(this.control.value);  // 'Nancy'
     * console.log(this.control.status);  // 'DISABLED'
     * ```
     * @param {?=} formState
     * @param {?=} options
     * @return {?}
     */
    function (formState, options) {
        if (formState === void 0) { formState = null; }
        if (options === void 0) { options = {}; }
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @return {?}
     */
    FormControl.prototype._updateValue = /**
     * \@internal
     * @return {?}
     */
    function () { };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    FormControl.prototype._anyControls = /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    function (condition) { return false; };
    /**
     * @internal
     */
    /**
     * \@internal
     * @return {?}
     */
    FormControl.prototype._allControlsDisabled = /**
     * \@internal
     * @return {?}
     */
    function () { return this.disabled; };
    /**
     * Register a listener for change events.
     */
    /**
     * Register a listener for change events.
     * @param {?} fn
     * @return {?}
     */
    FormControl.prototype.registerOnChange = /**
     * Register a listener for change events.
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange.push(fn); };
    /**
     * @internal
     */
    /**
     * \@internal
     * @return {?}
     */
    FormControl.prototype._clearChangeFns = /**
     * \@internal
     * @return {?}
     */
    function () {
        this._onChange = [];
        this._onDisabledChange = [];
        this._onCollectionChange = function () { };
    };
    /**
     * Register a listener for disabled events.
     */
    /**
     * Register a listener for disabled events.
     * @param {?} fn
     * @return {?}
     */
    FormControl.prototype.registerOnDisabledChange = /**
     * Register a listener for disabled events.
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this._onDisabledChange.push(fn);
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    FormControl.prototype._forEachChild = /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    function (cb) { };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormControl.prototype._syncPendingControls = /**
     * \@internal
     * @return {?}
     */
    function () {
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
    };
    /**
     * @param {?} formState
     * @return {?}
     */
    FormControl.prototype._applyFormState = /**
     * @param {?} formState
     * @return {?}
     */
    function (formState) {
        if (this._isBoxedValue(formState)) {
            (/** @type {?} */ (this)).value = this._pendingValue = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            (/** @type {?} */ (this)).value = this._pendingValue = formState;
        }
    };
    return FormControl;
}(AbstractControl));
/**
 * \@whatItDoes Tracks the value and validation status of an individual form control.
 *
 * It is one of the three fundamental building blocks of Angular forms, along with
 * {\@link FormGroup} and {\@link FormArray}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormControl}, you can pass in an initial value as the
 * first argument. Example:
 *
 * ```ts
 * const ctrl = new FormControl('some value');
 * console.log(ctrl.value);     // 'some value'
 * ```
 *
 * You can also initialize the control with a form state object on instantiation,
 * which includes both the value and whether or not the control is disabled.
 * You can't use the value key without the disabled key; both are required
 * to use this way of initialization.
 *
 * ```ts
 * const ctrl = new FormControl({value: 'n/a', disabled: true});
 * console.log(ctrl.value);     // 'n/a'
 * console.log(ctrl.status);   // 'DISABLED'
 * ```
 *
 * The second {\@link FormControl} argument can accept one of three things:
 * * a sync validator function
 * * an array of sync validator functions
 * * an options object containing validator and/or async validator functions
 *
 * Example of a single sync validator function:
 *
 * ```ts
 * const ctrl = new FormControl('', Validators.required);
 * console.log(ctrl.value);     // ''
 * console.log(ctrl.status);   // 'INVALID'
 * ```
 *
 * Example using options object:
 *
 * ```ts
 * const ctrl = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * The options object can also be used to define when the control should update.
 * By default, the value and validity of a control updates whenever the value
 * changes. You can configure it to update on the blur event instead by setting
 * the `updateOn` option to `'blur'`.
 *
 * ```ts
 * const c = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * You can also set `updateOn` to `'submit'`, which will delay value and validity
 * updates until the parent form of the control fires a submit event.
 *
 * See its superclass, {\@link AbstractControl}, for more properties and methods.
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
export { FormControl };
function FormControl_tsickle_Closure_declarations() {
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
 * \@whatItDoes Tracks the value and validity state of a group of {\@link FormControl}
 * instances.
 *
 * A `FormGroup` aggregates the values of each child {\@link FormControl} into one object,
 * with each control name as the key.  It calculates its status by reducing the statuses
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {\@link FormControl} and {\@link FormArray}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormGroup}, pass in a collection of child controls as the first
 * argument. The key for each child will be the name under which it is registered.
 *
 * ### Example
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
 * You can also include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ### Example
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
 * Like {\@link FormControl} instances, you can alternatively choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, {validators: passwordMatchValidator, asyncValidators: otherValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *    one: new FormControl()
 * }, {updateOn: 'blur'});
 * ```
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
var /**
 * \@whatItDoes Tracks the value and validity state of a group of {\@link FormControl}
 * instances.
 *
 * A `FormGroup` aggregates the values of each child {\@link FormControl} into one object,
 * with each control name as the key.  It calculates its status by reducing the statuses
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {\@link FormControl} and {\@link FormArray}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormGroup}, pass in a collection of child controls as the first
 * argument. The key for each child will be the name under which it is registered.
 *
 * ### Example
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
 * You can also include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ### Example
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
 * Like {\@link FormControl} instances, you can alternatively choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, {validators: passwordMatchValidator, asyncValidators: otherValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *    one: new FormControl()
 * }, {updateOn: 'blur'});
 * ```
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
FormGroup = /** @class */ (function (_super) {
    tslib_1.__extends(FormGroup, _super);
    function FormGroup(controls, validatorOrOpts, asyncValidator) {
        var _this = _super.call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)) || this;
        _this.controls = controls;
        _this._initObservables();
        _this._setUpdateStrategy(validatorOrOpts);
        _this._setUpControls();
        _this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        return _this;
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control, so for most cases you'll want
     * to use {@link FormGroup#addControl addControl} instead.
     */
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control, so for most cases you'll want
     * to use {\@link FormGroup#addControl addControl} instead.
     * @param {?} name
     * @param {?} control
     * @return {?}
     */
    FormGroup.prototype.registerControl = /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control, so for most cases you'll want
     * to use {\@link FormGroup#addControl addControl} instead.
     * @param {?} name
     * @param {?} control
     * @return {?}
     */
    function (name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    };
    /**
     * Add a control to this group.
     */
    /**
     * Add a control to this group.
     * @param {?} name
     * @param {?} control
     * @return {?}
     */
    FormGroup.prototype.addControl = /**
     * Add a control to this group.
     * @param {?} name
     * @param {?} control
     * @return {?}
     */
    function (name, control) {
        this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Remove a control from this group.
     */
    /**
     * Remove a control from this group.
     * @param {?} name
     * @return {?}
     */
    FormGroup.prototype.removeControl = /**
     * Remove a control from this group.
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(function () { });
        delete (this.controls[name]);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Replace an existing control.
     */
    /**
     * Replace an existing control.
     * @param {?} name
     * @param {?} control
     * @return {?}
     */
    FormGroup.prototype.setControl = /**
     * Replace an existing control.
     * @param {?} name
     * @param {?} control
     * @return {?}
     */
    function (name, control) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(function () { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * It will return false for disabled controls. If you'd like to check for existence in the group
     * only, use {@link AbstractControl#get get} instead.
     */
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * It will return false for disabled controls. If you'd like to check for existence in the group
     * only, use {\@link AbstractControl#get get} instead.
     * @param {?} controlName
     * @return {?}
     */
    FormGroup.prototype.contains = /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * It will return false for disabled controls. If you'd like to check for existence in the group
     * only, use {\@link AbstractControl#get get} instead.
     * @param {?} controlName
     * @return {?}
     */
    function (controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    };
    /**
     *  Sets the value of the {@link FormGroup}. It accepts an object that matches
     *  the structure of the group, with control names as keys.
     *
     *  ### Example
     *
     *  ```
     *  const form = new FormGroup({
     *     first: new FormControl(),
     *     last: new FormControl()
     *  });
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.setValue({first: 'Nancy', last: 'Drew'});
     *  console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     *
     *  ```
     * @throws This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     */
    /**
     *  Sets the value of the {\@link FormGroup}. It accepts an object that matches
     *  the structure of the group, with control names as keys.
     *
     *  ### Example
     *
     *  ```
     *  const form = new FormGroup({
     *     first: new FormControl(),
     *     last: new FormControl()
     *  });
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.setValue({first: 'Nancy', last: 'Drew'});
     *  console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     *
     *  ```
     * @throws This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    FormGroup.prototype.setValue = /**
     *  Sets the value of the {\@link FormGroup}. It accepts an object that matches
     *  the structure of the group, with control names as keys.
     *
     *  ### Example
     *
     *  ```
     *  const form = new FormGroup({
     *     first: new FormControl(),
     *     last: new FormControl()
     *  });
     *  console.log(form.value);   // {first: null, last: null}
     *
     *  form.setValue({first: 'Nancy', last: 'Drew'});
     *  console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     *
     *  ```
     * @throws This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._checkAllValuesPresent(value);
        Object.keys(value).forEach(function (name) {
            _this._throwIfControlMissing(name);
            _this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    };
    /**
     *  Patches the value of the {@link FormGroup}. It accepts an object with control
     *  names as keys, and will do its best to match the values to the correct controls
     *  in the group.
     *
     *  It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     *  ### Example
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
     */
    /**
     *  Patches the value of the {\@link FormGroup}. It accepts an object with control
     *  names as keys, and will do its best to match the values to the correct controls
     *  in the group.
     *
     *  It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     *  ### Example
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
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    FormGroup.prototype.patchValue = /**
     *  Patches the value of the {\@link FormGroup}. It accepts an object with control
     *  names as keys, and will do its best to match the values to the correct controls
     *  in the group.
     *
     *  It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     *  ### Example
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
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        Object.keys(value).forEach(function (name) {
            if (_this.controls[name]) {
                _this.controls[name].patchValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    };
    /**
     * Resets the {@link FormGroup}. This means by default:
     *
     * * The group and all descendants are marked `pristine`
     * * The group and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * can be a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * ### Example
     *
     * ```ts
     * this.form.reset({first: 'name', last: 'last name'});
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * - OR -
     *
     * ```
     * this.form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     */
    /**
     * Resets the {\@link FormGroup}. This means by default:
     *
     * * The group and all descendants are marked `pristine`
     * * The group and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * can be a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * ### Example
     *
     * ```ts
     * this.form.reset({first: 'name', last: 'last name'});
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * - OR -
     *
     * ```
     * this.form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     * @param {?=} value
     * @param {?=} options
     * @return {?}
     */
    FormGroup.prototype.reset = /**
     * Resets the {\@link FormGroup}. This means by default:
     *
     * * The group and all descendants are marked `pristine`
     * * The group and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * can be a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * ### Example
     *
     * ```ts
     * this.form.reset({first: 'name', last: 'last name'});
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * - OR -
     *
     * ```
     * this.form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     * @param {?=} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        if (value === void 0) { value = {}; }
        if (options === void 0) { options = {}; }
        this._forEachChild(function (control, name) {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
    };
    /**
     * The aggregate value of the {@link FormGroup}, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the group.
     */
    /**
     * The aggregate value of the {\@link FormGroup}, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the group.
     * @return {?}
     */
    FormGroup.prototype.getRawValue = /**
     * The aggregate value of the {\@link FormGroup}, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the group.
     * @return {?}
     */
    function () {
        return this._reduceChildren({}, function (acc, control, name) {
            acc[name] = control instanceof FormControl ? control.value : (/** @type {?} */ (control)).getRawValue();
            return acc;
        });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormGroup.prototype._syncPendingControls = /**
     * \@internal
     * @return {?}
     */
    function () {
        var /** @type {?} */ subtreeUpdated = this._reduceChildren(false, function (updated, child) {
            return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} name
     * @return {?}
     */
    FormGroup.prototype._throwIfControlMissing = /**
     * \@internal
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (!Object.keys(this.controls).length) {
            throw new Error("\n        There are no form controls registered with this group yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.controls[name]) {
            throw new Error("Cannot find form control with name: " + name + ".");
        }
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    FormGroup.prototype._forEachChild = /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    function (cb) {
        var _this = this;
        Object.keys(this.controls).forEach(function (k) { return cb(_this.controls[k], k); });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormGroup.prototype._setUpControls = /**
     * \@internal
     * @return {?}
     */
    function () {
        var _this = this;
        this._forEachChild(function (control) {
            control.setParent(_this);
            control._registerOnCollectionChange(_this._onCollectionChange);
        });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormGroup.prototype._updateValue = /**
     * \@internal
     * @return {?}
     */
    function () { (/** @type {?} */ (this)).value = this._reduceValue(); };
    /** @internal */
    /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    FormGroup.prototype._anyControls = /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    function (condition) {
        var _this = this;
        var /** @type {?} */ res = false;
        this._forEachChild(function (control, name) {
            res = res || (_this.contains(name) && condition(control));
        });
        return res;
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormGroup.prototype._reduceValue = /**
     * \@internal
     * @return {?}
     */
    function () {
        var _this = this;
        return this._reduceChildren({}, function (acc, control, name) {
            if (control.enabled || _this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} initValue
     * @param {?} fn
     * @return {?}
     */
    FormGroup.prototype._reduceChildren = /**
     * \@internal
     * @param {?} initValue
     * @param {?} fn
     * @return {?}
     */
    function (initValue, fn) {
        var /** @type {?} */ res = initValue;
        this._forEachChild(function (control, name) { res = fn(res, control, name); });
        return res;
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormGroup.prototype._allControlsDisabled = /**
     * \@internal
     * @return {?}
     */
    function () {
        for (var _i = 0, _a = Object.keys(this.controls); _i < _a.length; _i++) {
            var controlName = _a[_i];
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    FormGroup.prototype._checkAllValuesPresent = /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._forEachChild(function (control, name) {
            if (value[name] === undefined) {
                throw new Error("Must supply a value for form control with name: '" + name + "'.");
            }
        });
    };
    return FormGroup;
}(AbstractControl));
/**
 * \@whatItDoes Tracks the value and validity state of a group of {\@link FormControl}
 * instances.
 *
 * A `FormGroup` aggregates the values of each child {\@link FormControl} into one object,
 * with each control name as the key.  It calculates its status by reducing the statuses
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {\@link FormControl} and {\@link FormArray}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormGroup}, pass in a collection of child controls as the first
 * argument. The key for each child will be the name under which it is registered.
 *
 * ### Example
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
 * You can also include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ### Example
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
 * Like {\@link FormControl} instances, you can alternatively choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, {validators: passwordMatchValidator, asyncValidators: otherValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *    one: new FormControl()
 * }, {updateOn: 'blur'});
 * ```
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
export { FormGroup };
function FormGroup_tsickle_Closure_declarations() {
    /** @type {?} */
    FormGroup.prototype.controls;
}
/**
 * \@whatItDoes Tracks the value and validity state of an array of {\@link FormControl},
 * {\@link FormGroup} or {\@link FormArray} instances.
 *
 * A `FormArray` aggregates the values of each child {\@link FormControl} into an array.
 * It calculates its status by reducing the statuses of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {\@link FormControl} and {\@link FormGroup}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormArray}, pass in an array of child controls as the first
 * argument.
 *
 * ### Example
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
 * You can also include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators can be passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls
 *
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that will result in strange and unexpected behavior such
 * as broken change detection.
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
var /**
 * \@whatItDoes Tracks the value and validity state of an array of {\@link FormControl},
 * {\@link FormGroup} or {\@link FormArray} instances.
 *
 * A `FormArray` aggregates the values of each child {\@link FormControl} into an array.
 * It calculates its status by reducing the statuses of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {\@link FormControl} and {\@link FormGroup}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormArray}, pass in an array of child controls as the first
 * argument.
 *
 * ### Example
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
 * You can also include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators can be passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls
 *
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that will result in strange and unexpected behavior such
 * as broken change detection.
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
FormArray = /** @class */ (function (_super) {
    tslib_1.__extends(FormArray, _super);
    function FormArray(controls, validatorOrOpts, asyncValidator) {
        var _this = _super.call(this, coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts)) || this;
        _this.controls = controls;
        _this._initObservables();
        _this._setUpdateStrategy(validatorOrOpts);
        _this._setUpControls();
        _this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        return _this;
    }
    /**
     * Get the {@link AbstractControl} at the given `index` in the array.
     */
    /**
     * Get the {\@link AbstractControl} at the given `index` in the array.
     * @param {?} index
     * @return {?}
     */
    FormArray.prototype.at = /**
     * Get the {\@link AbstractControl} at the given `index` in the array.
     * @param {?} index
     * @return {?}
     */
    function (index) { return this.controls[index]; };
    /**
     * Insert a new {@link AbstractControl} at the end of the array.
     */
    /**
     * Insert a new {\@link AbstractControl} at the end of the array.
     * @param {?} control
     * @return {?}
     */
    FormArray.prototype.push = /**
     * Insert a new {\@link AbstractControl} at the end of the array.
     * @param {?} control
     * @return {?}
     */
    function (control) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    /** Insert a new {@link AbstractControl} at the given `index` in the array. */
    /**
     * Insert a new {\@link AbstractControl} at the given `index` in the array.
     * @param {?} index
     * @param {?} control
     * @return {?}
     */
    FormArray.prototype.insert = /**
     * Insert a new {\@link AbstractControl} at the given `index` in the array.
     * @param {?} index
     * @param {?} control
     * @return {?}
     */
    function (index, control) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity();
    };
    /** Remove the control at the given `index` in the array. */
    /**
     * Remove the control at the given `index` in the array.
     * @param {?} index
     * @return {?}
     */
    FormArray.prototype.removeAt = /**
     * Remove the control at the given `index` in the array.
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(function () { });
        this.controls.splice(index, 1);
        this.updateValueAndValidity();
    };
    /**
     * Replace an existing control.
     */
    /**
     * Replace an existing control.
     * @param {?} index
     * @param {?} control
     * @return {?}
     */
    FormArray.prototype.setControl = /**
     * Replace an existing control.
     * @param {?} index
     * @param {?} control
     * @return {?}
     */
    function (index, control) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(function () { });
        this.controls.splice(index, 1);
        if (control) {
            this.controls.splice(index, 0, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity();
        this._onCollectionChange();
    };
    Object.defineProperty(FormArray.prototype, "length", {
        /**
         * Length of the control array.
         */
        get: /**
         * Length of the control array.
         * @return {?}
         */
        function () { return this.controls.length; },
        enumerable: true,
        configurable: true
    });
    /**
     *  Sets the value of the {@link FormArray}. It accepts an array that matches
     *  the structure of the control.
     *
     * This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.setValue(['Nancy', 'Drew']);
     *  console.log(arr.value);   // ['Nancy', 'Drew']
     *  ```
     */
    /**
     *  Sets the value of the {\@link FormArray}. It accepts an array that matches
     *  the structure of the control.
     *
     * This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.setValue(['Nancy', 'Drew']);
     *  console.log(arr.value);   // ['Nancy', 'Drew']
     *  ```
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    FormArray.prototype.setValue = /**
     *  Sets the value of the {\@link FormArray}. It accepts an array that matches
     *  the structure of the control.
     *
     * This method performs strict checks, so it will throw an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.setValue(['Nancy', 'Drew']);
     *  console.log(arr.value);   // ['Nancy', 'Drew']
     *  ```
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._checkAllValuesPresent(value);
        value.forEach(function (newValue, index) {
            _this._throwIfControlMissing(index);
            _this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    };
    /**
     *  Patches the value of the {@link FormArray}. It accepts an array that matches the
     *  structure of the control, and will do its best to match the values to the correct
     *  controls in the group.
     *
     *  It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.patchValue(['Nancy']);
     *  console.log(arr.value);   // ['Nancy', null]
     *  ```
     */
    /**
     *  Patches the value of the {\@link FormArray}. It accepts an array that matches the
     *  structure of the control, and will do its best to match the values to the correct
     *  controls in the group.
     *
     *  It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.patchValue(['Nancy']);
     *  console.log(arr.value);   // ['Nancy', null]
     *  ```
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    FormArray.prototype.patchValue = /**
     *  Patches the value of the {\@link FormArray}. It accepts an array that matches the
     *  structure of the control, and will do its best to match the values to the correct
     *  controls in the group.
     *
     *  It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     *  ### Example
     *
     *  ```
     *  const arr = new FormArray([
     *     new FormControl(),
     *     new FormControl()
     *  ]);
     *  console.log(arr.value);   // [null, null]
     *
     *  arr.patchValue(['Nancy']);
     *  console.log(arr.value);   // ['Nancy', null]
     *  ```
     * @param {?} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        value.forEach(function (newValue, index) {
            if (_this.at(index)) {
                _this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    };
    /**
     * Resets the {@link FormArray}. This means by default:
     *
     * * The array and all descendants are marked `pristine`
     * * The array and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state can be a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * ### Example
     *
     * ```ts
     * this.arr.reset(['name', 'last name']);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * ```
     *
     * - OR -
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
     */
    /**
     * Resets the {\@link FormArray}. This means by default:
     *
     * * The array and all descendants are marked `pristine`
     * * The array and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state can be a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * ### Example
     *
     * ```ts
     * this.arr.reset(['name', 'last name']);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * ```
     *
     * - OR -
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
     * @param {?=} value
     * @param {?=} options
     * @return {?}
     */
    FormArray.prototype.reset = /**
     * Resets the {\@link FormArray}. This means by default:
     *
     * * The array and all descendants are marked `pristine`
     * * The array and all descendants are marked `untouched`
     * * The value of all descendants will be null or null maps
     *
     * You can also reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state can be a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * ### Example
     *
     * ```ts
     * this.arr.reset(['name', 'last name']);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * ```
     *
     * - OR -
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
     * @param {?=} value
     * @param {?=} options
     * @return {?}
     */
    function (value, options) {
        if (value === void 0) { value = []; }
        if (options === void 0) { options = {}; }
        this._forEachChild(function (control, index) {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
        this._updatePristine(options);
        this._updateTouched(options);
    };
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the array.
     */
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the array.
     * @return {?}
     */
    FormArray.prototype.getRawValue = /**
     * The aggregate value of the array, including any disabled controls.
     *
     * If you'd like to include all values regardless of disabled status, use this method.
     * Otherwise, the `value` property is the best way to get the value of the array.
     * @return {?}
     */
    function () {
        return this.controls.map(function (control) {
            return control instanceof FormControl ? control.value : (/** @type {?} */ (control)).getRawValue();
        });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormArray.prototype._syncPendingControls = /**
     * \@internal
     * @return {?}
     */
    function () {
        var /** @type {?} */ subtreeUpdated = this.controls.reduce(function (updated, child) {
            return child._syncPendingControls() ? true : updated;
        }, false);
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} index
     * @return {?}
     */
    FormArray.prototype._throwIfControlMissing = /**
     * \@internal
     * @param {?} index
     * @return {?}
     */
    function (index) {
        if (!this.controls.length) {
            throw new Error("\n        There are no form controls registered with this array yet.  If you're using ngModel,\n        you may want to check next tick (e.g. use setTimeout).\n      ");
        }
        if (!this.at(index)) {
            throw new Error("Cannot find form control at index " + index);
        }
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    FormArray.prototype._forEachChild = /**
     * \@internal
     * @param {?} cb
     * @return {?}
     */
    function (cb) {
        this.controls.forEach(function (control, index) { cb(control, index); });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormArray.prototype._updateValue = /**
     * \@internal
     * @return {?}
     */
    function () {
        var _this = this;
        (/** @type {?} */ (this)).value =
            this.controls.filter(function (control) { return control.enabled || _this.disabled; })
                .map(function (control) { return control.value; });
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    FormArray.prototype._anyControls = /**
     * \@internal
     * @param {?} condition
     * @return {?}
     */
    function (condition) {
        return this.controls.some(function (control) { return control.enabled && condition(control); });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormArray.prototype._setUpControls = /**
     * \@internal
     * @return {?}
     */
    function () {
        var _this = this;
        this._forEachChild(function (control) { return _this._registerControl(control); });
    };
    /** @internal */
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    FormArray.prototype._checkAllValuesPresent = /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._forEachChild(function (control, i) {
            if (value[i] === undefined) {
                throw new Error("Must supply a value for form control at index: " + i + ".");
            }
        });
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormArray.prototype._allControlsDisabled = /**
     * \@internal
     * @return {?}
     */
    function () {
        for (var _i = 0, _a = this.controls; _i < _a.length; _i++) {
            var control = _a[_i];
            if (control.enabled)
                return false;
        }
        return this.controls.length > 0 || this.disabled;
    };
    /**
     * @param {?} control
     * @return {?}
     */
    FormArray.prototype._registerControl = /**
     * @param {?} control
     * @return {?}
     */
    function (control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    };
    return FormArray;
}(AbstractControl));
/**
 * \@whatItDoes Tracks the value and validity state of an array of {\@link FormControl},
 * {\@link FormGroup} or {\@link FormArray} instances.
 *
 * A `FormArray` aggregates the values of each child {\@link FormControl} into an array.
 * It calculates its status by reducing the statuses of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with {\@link FormControl} and {\@link FormGroup}.
 *
 * \@howToUse
 *
 * When instantiating a {\@link FormArray}, pass in an array of child controls as the first
 * argument.
 *
 * ### Example
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
 * You can also include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators can be passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * The options object can also be used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls will default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls
 *
 * To change the controls in the array, use the `push`, `insert`, or `removeAt` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that will result in strange and unexpected behavior such
 * as broken change detection.
 *
 * * **npm package**: `\@angular/forms`
 *
 * \@stable
 */
export { FormArray };
function FormArray_tsickle_Closure_declarations() {
    /** @type {?} */
    FormArray.prototype.controls;
}
//# sourceMappingURL=model.js.map