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
var abstract_form_group_directive_1 = require('../abstract_form_group_directive');
var control_container_1 = require('../control_container');
var form_group_directive_1 = require('./form_group_directive');
exports.formGroupNameProvider = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: control_container_1.ControlContainer,
    useExisting: core_1.forwardRef(function () { return FormGroupName; })
};
var FormGroupName = (function (_super) {
    __extends(FormGroupName, _super);
    function FormGroupName(parent, validators, asyncValidators) {
        _super.call(this);
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /** @internal */
    FormGroupName.prototype._checkParentType = function () {
        if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof form_group_directive_1.FormGroupDirective)) {
            this._throwParentException();
        }
    };
    FormGroupName.prototype._throwParentException = function () {
        throw new exceptions_1.BaseException("formGroupName must be used with a parent formGroup directive.\n                You'll want to add a formGroup directive and pass it an existing FormGroup instance\n                (you can create one in your class).\n\n                Example:\n                <div [formGroup]=\"myGroup\">\n                  <div formGroupName=\"person\">\n                    <input formControlName=\"firstName\">\n                  </div>\n                </div>\n\n                In your class:\n                this.myGroup = new FormGroup({\n                  person: new FormGroup({ firstName: new FormControl() })\n                });");
    };
    /** @nocollapse */
    FormGroupName.decorators = [
        { type: core_1.Directive, args: [{ selector: '[formGroupName]', providers: [exports.formGroupNameProvider] },] },
    ];
    /** @nocollapse */
    FormGroupName.ctorParameters = [
        { type: control_container_1.ControlContainer, decorators: [{ type: core_1.Optional }, { type: core_1.Host }, { type: core_1.SkipSelf },] },
        { type: Array, decorators: [{ type: core_1.Optional }, { type: core_1.Self }, { type: core_1.Inject, args: [validators_1.NG_VALIDATORS,] },] },
        { type: Array, decorators: [{ type: core_1.Optional }, { type: core_1.Self }, { type: core_1.Inject, args: [validators_1.NG_ASYNC_VALIDATORS,] },] },
    ];
    /** @nocollapse */
    FormGroupName.propDecorators = {
        'name': [{ type: core_1.Input, args: ['formGroupName',] },],
    };
    return FormGroupName;
}(abstract_form_group_directive_1.AbstractFormGroupDirective));
exports.FormGroupName = FormGroupName;
//# sourceMappingURL=form_group_name.js.map