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
var lang_1 = require('../facade/lang');
var control_container_1 = require('./control_container');
var ng_control_1 = require('./ng_control');
var AbstractControlStatus = (function () {
    function AbstractControlStatus(cd) {
        this._cd = cd;
    }
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.untouched : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.touched : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.pristine : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.dirty : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.valid : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
        get: function () {
            return lang_1.isPresent(this._cd.control) ? this._cd.control.invalid : false;
        },
        enumerable: true,
        configurable: true
    });
    return AbstractControlStatus;
}());
exports.AbstractControlStatus = AbstractControlStatus;
exports.ngControlStatusHost = {
    '[class.ng-untouched]': 'ngClassUntouched',
    '[class.ng-touched]': 'ngClassTouched',
    '[class.ng-pristine]': 'ngClassPristine',
    '[class.ng-dirty]': 'ngClassDirty',
    '[class.ng-valid]': 'ngClassValid',
    '[class.ng-invalid]': 'ngClassInvalid'
};
var NgControlStatus = (function (_super) {
    __extends(NgControlStatus, _super);
    function NgControlStatus(cd) {
        _super.call(this, cd);
    }
    /** @nocollapse */
    NgControlStatus.decorators = [
        { type: core_1.Directive, args: [{ selector: '[formControlName],[ngModel],[formControl]', host: exports.ngControlStatusHost },] },
    ];
    /** @nocollapse */
    NgControlStatus.ctorParameters = [
        { type: ng_control_1.NgControl, decorators: [{ type: core_1.Self },] },
    ];
    return NgControlStatus;
}(AbstractControlStatus));
exports.NgControlStatus = NgControlStatus;
var NgControlStatusGroup = (function (_super) {
    __extends(NgControlStatusGroup, _super);
    function NgControlStatusGroup(cd) {
        _super.call(this, cd);
    }
    /** @nocollapse */
    NgControlStatusGroup.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                    host: exports.ngControlStatusHost
                },] },
    ];
    /** @nocollapse */
    NgControlStatusGroup.ctorParameters = [
        { type: control_container_1.ControlContainer, decorators: [{ type: core_1.Self },] },
    ];
    return NgControlStatusGroup;
}(AbstractControlStatus));
exports.NgControlStatusGroup = NgControlStatusGroup;
//# sourceMappingURL=ng_control_status.js.map