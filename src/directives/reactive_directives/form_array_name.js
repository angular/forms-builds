/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('@angular/core');
var exceptions_1 = require('../../facade/exceptions');
var validators_1 = require('../../validators');
var control_container_1 = require('../control_container');
var shared_1 = require('../shared');
var form_group_directive_1 = require('./form_group_directive');
var form_group_name_1 = require('./form_group_name');
exports.formArrayNameProvider = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: control_container_1.ControlContainer,
    useExisting: core_1.forwardRef(function () { return FormArrayName; })
};
var FormArrayName = (function (_super) {
    __extends(FormArrayName, _super);
    function FormArrayName(parent, validators, asyncValidators) {
        _super.call(this);
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    FormArrayName.prototype.ngOnInit = function () {
        this._checkParentType();
        this.formDirective.addFormArray(this);
    };
    FormArrayName.prototype.ngOnDestroy = function () { this.formDirective.removeFormArray(this); };
    Object.defineProperty(FormArrayName.prototype, "control", {
        get: function () { return this.formDirective.getFormArray(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "formDirective", {
        get: function () { return this._parent.formDirective; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "path", {
        get: function () { return shared_1.controlPath(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "validator", {
        get: function () { return shared_1.composeValidators(this._validators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormArrayName.prototype, "asyncValidator", {
        get: function () { return shared_1.composeAsyncValidators(this._asyncValidators); },
        enumerable: true,
        configurable: true
    });
    FormArrayName.prototype._checkParentType = function () {
        if (!(this._parent instanceof form_group_name_1.FormGroupName) && !(this._parent instanceof form_group_directive_1.FormGroupDirective)) {
            this._throwParentException();
        }
    };
    FormArrayName.prototype._throwParentException = function () {
        throw new exceptions_1.BaseException("formArrayName must be used with a parent formGroup directive.\n                You'll want to add a formGroup directive and pass it an existing FormGroup instance\n                (you can create one in your class).\n\n                Example:\n                <div [formGroup]=\"myGroup\">\n                  <div formArrayName=\"cities\">\n                    <div *ngFor=\"let city of cityArray.controls; let i=index\">\n                      <input [formControlName]=\"i\">\n                    </div>\n                  </div>\n                </div>\n\n                In your class:\n                this.cityArray = new FormArray([new FormControl('SF')]);\n                this.myGroup = new FormGroup({\n                  cities: this.cityArray\n                });");
    };
    /** @nocollapse */
    FormArrayName.decorators = [
        { type: core_1.Directive, args: [{ selector: '[formArrayName]', providers: [exports.formArrayNameProvider] },] },
    ];
    /** @nocollapse */
    FormArrayName.ctorParameters = [
        { type: control_container_1.ControlContainer, decorators: [{ type: core_1.Optional }, { type: core_1.Host }, { type: core_1.SkipSelf },] },
        { type: Array, decorators: [{ type: core_1.Optional }, { type: core_1.Self }, { type: core_1.Inject, args: [validators_1.NG_VALIDATORS,] },] },
        { type: Array, decorators: [{ type: core_1.Optional }, { type: core_1.Self }, { type: core_1.Inject, args: [validators_1.NG_ASYNC_VALIDATORS,] },] },
    ];
    /** @nocollapse */
    FormArrayName.propDecorators = {
        'name': [{ type: core_1.Input, args: ['formArrayName',] },],
    };
    return FormArrayName;
}(control_container_1.ControlContainer));
exports.FormArrayName = FormArrayName;
//# sourceMappingURL=form_array_name.js.map