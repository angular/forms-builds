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
import { Directive, EventEmitter, Inject, Input, Optional, Output, Self, forwardRef } from '@angular/core';
import { FormGroup } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS, Validators } from '../../validators';
import { ControlContainer } from '../control_container';
import { ReactiveErrors } from '../reactive_errors';
import { cleanUpControl, composeAsyncValidators, composeValidators, removeDir, setUpControl, setUpFormContainer, syncPendingControls } from '../shared';
export var /** @type {?} */ formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(function () { return FormGroupDirective; })
};
/**
 * \@description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * **Set value**: You can set the form's initial value when instantiating the
 * `FormGroup`, or you can set it programmatically later using the `FormGroup`'s
 * {\@link AbstractControl#setValue setValue} or {\@link AbstractControl#patchValue patchValue}
 * methods.
 *
 * **Listen to value**: If you want to listen to changes in the value of the form, you can subscribe
 * to the `FormGroup`'s {\@link AbstractControl#valueChanges valueChanges} event.  You can also
 * listen to its {\@link AbstractControl#statusChanges statusChanges} event to be notified when the
 * validation status is re-calculated.
 *
 * Furthermore, you can listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event will be emitted with the original form
 * submission event.
 *
 * ### Example
 *
 * In this example, we create form controls for first name and last name.
 *
 * {\@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * **npm package**: `\@angular/forms`
 *
 * **NgModule**: `ReactiveFormsModule`
 *
 *
 */
var FormGroupDirective = /** @class */ (function (_super) {
    tslib_1.__extends(FormGroupDirective, _super);
    function FormGroupDirective(_validators, _asyncValidators) {
        var _this = _super.call(this) || this;
        _this._validators = _validators;
        _this._asyncValidators = _asyncValidators;
        _this.submitted = false;
        _this.directives = [];
        _this.form = /** @type {?} */ ((null));
        _this.ngSubmit = new EventEmitter();
        return _this;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    FormGroupDirective.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
        }
    };
    Object.defineProperty(FormGroupDirective.prototype, "formDirective", {
        get: /**
         * @return {?}
         */
        function () { return this; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormGroupDirective.prototype, "control", {
        get: /**
         * @return {?}
         */
        function () { return this.form; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormGroupDirective.prototype, "path", {
        get: /**
         * @return {?}
         */
        function () { return []; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.addControl = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        var /** @type {?} */ ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.getControl = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) { return /** @type {?} */ (this.form.get(dir.path)); };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.removeControl = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) { removeDir(this.directives, dir); };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.addFormGroup = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        var /** @type {?} */ ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.removeFormGroup = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) { };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.getFormGroup = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) { return /** @type {?} */ (this.form.get(dir.path)); };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.addFormArray = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) {
        var /** @type {?} */ ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.removeFormArray = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) { };
    /**
     * @param {?} dir
     * @return {?}
     */
    FormGroupDirective.prototype.getFormArray = /**
     * @param {?} dir
     * @return {?}
     */
    function (dir) { return /** @type {?} */ (this.form.get(dir.path)); };
    /**
     * @param {?} dir
     * @param {?} value
     * @return {?}
     */
    FormGroupDirective.prototype.updateModel = /**
     * @param {?} dir
     * @param {?} value
     * @return {?}
     */
    function (dir, value) {
        var /** @type {?} */ ctrl = /** @type {?} */ (this.form.get(dir.path));
        ctrl.setValue(value);
    };
    /**
     * @param {?} $event
     * @return {?}
     */
    FormGroupDirective.prototype.onSubmit = /**
     * @param {?} $event
     * @return {?}
     */
    function ($event) {
        (/** @type {?} */ (this)).submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        return false;
    };
    /**
     * @return {?}
     */
    FormGroupDirective.prototype.onReset = /**
     * @return {?}
     */
    function () { this.resetForm(); };
    /**
     * @param {?=} value
     * @return {?}
     */
    FormGroupDirective.prototype.resetForm = /**
     * @param {?=} value
     * @return {?}
     */
    function (value) {
        if (value === void 0) { value = undefined; }
        this.form.reset(value);
        (/** @type {?} */ (this)).submitted = false;
    };
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    FormGroupDirective.prototype._updateDomValue = /**
     * \@internal
     * @return {?}
     */
    function () {
        var _this = this;
        this.directives.forEach(function (dir) {
            var /** @type {?} */ newCtrl = _this.form.get(dir.path);
            if (dir.control !== newCtrl) {
                cleanUpControl(dir.control, dir);
                if (newCtrl)
                    setUpControl(newCtrl, dir);
                (/** @type {?} */ (dir)).control = newCtrl;
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    };
    /**
     * @return {?}
     */
    FormGroupDirective.prototype._updateRegistrations = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.form._registerOnCollectionChange(function () { return _this._updateDomValue(); });
        if (this._oldForm)
            this._oldForm._registerOnCollectionChange(function () { });
        this._oldForm = this.form;
    };
    /**
     * @return {?}
     */
    FormGroupDirective.prototype._updateValidators = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ sync = composeValidators(this._validators);
        this.form.validator = Validators.compose([/** @type {?} */ ((this.form.validator)), /** @type {?} */ ((sync))]);
        var /** @type {?} */ async = composeAsyncValidators(this._asyncValidators);
        this.form.asyncValidator = Validators.composeAsync([/** @type {?} */ ((this.form.asyncValidator)), /** @type {?} */ ((async))]);
    };
    /**
     * @return {?}
     */
    FormGroupDirective.prototype._checkFormPresent = /**
     * @return {?}
     */
    function () {
        if (!this.form) {
            ReactiveErrors.missingFormException();
        }
    };
    FormGroupDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[formGroup]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                    exportAs: 'ngForm'
                },] },
    ];
    /** @nocollapse */
    FormGroupDirective.ctorParameters = function () { return [
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] },] },
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] },] },
    ]; };
    FormGroupDirective.propDecorators = {
        "form": [{ type: Input, args: ['formGroup',] },],
        "ngSubmit": [{ type: Output },],
    };
    return FormGroupDirective;
}(ControlContainer));
export { FormGroupDirective };
function FormGroupDirective_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    FormGroupDirective.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    FormGroupDirective.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    FormGroupDirective.propDecorators;
    /** @type {?} */
    FormGroupDirective.prototype.submitted;
    /** @type {?} */
    FormGroupDirective.prototype._oldForm;
    /** @type {?} */
    FormGroupDirective.prototype.directives;
    /** @type {?} */
    FormGroupDirective.prototype.form;
    /** @type {?} */
    FormGroupDirective.prototype.ngSubmit;
    /** @type {?} */
    FormGroupDirective.prototype._validators;
    /** @type {?} */
    FormGroupDirective.prototype._asyncValidators;
}
//# sourceMappingURL=form_group_directive.js.map