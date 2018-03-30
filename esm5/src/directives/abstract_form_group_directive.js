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
import { ControlContainer } from './control_container';
import { composeAsyncValidators, composeValidators, controlPath } from './shared';
/**
 * This is a base class for code shared between {\@link NgModelGroup} and {\@link FormGroupName}.
 *
 * \@stable
 */
var /**
 * This is a base class for code shared between {\@link NgModelGroup} and {\@link FormGroupName}.
 *
 * \@stable
 */
AbstractFormGroupDirective = /** @class */ (function (_super) {
    tslib_1.__extends(AbstractFormGroupDirective, _super);
    function AbstractFormGroupDirective() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @return {?}
     */
    AbstractFormGroupDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this._checkParentType(); /** @type {?} */
        ((this.formDirective)).addFormGroup(this);
    };
    /**
     * @return {?}
     */
    AbstractFormGroupDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        if (this.formDirective) {
            this.formDirective.removeFormGroup(this);
        }
    };
    Object.defineProperty(AbstractFormGroupDirective.prototype, "control", {
        /**
         * Get the {@link FormGroup} backing this binding.
         */
        get: /**
         * Get the {\@link FormGroup} backing this binding.
         * @return {?}
         */
        function () { return /** @type {?} */ ((this.formDirective)).getFormGroup(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "path", {
        /**
         * Get the path to this control group.
         */
        get: /**
         * Get the path to this control group.
         * @return {?}
         */
        function () { return controlPath(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "formDirective", {
        /**
         * Get the {@link Form} to which this group belongs.
         */
        get: /**
         * Get the {\@link Form} to which this group belongs.
         * @return {?}
         */
        function () { return this._parent ? this._parent.formDirective : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "validator", {
        get: /**
         * @return {?}
         */
        function () { return composeValidators(this._validators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractFormGroupDirective.prototype, "asyncValidator", {
        get: /**
         * @return {?}
         */
        function () {
            return composeAsyncValidators(this._asyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    /** @internal */
    /**
     * \@internal
     * @return {?}
     */
    AbstractFormGroupDirective.prototype._checkParentType = /**
     * \@internal
     * @return {?}
     */
    function () { };
    return AbstractFormGroupDirective;
}(ControlContainer));
/**
 * This is a base class for code shared between {\@link NgModelGroup} and {\@link FormGroupName}.
 *
 * \@stable
 */
export { AbstractFormGroupDirective };
function AbstractFormGroupDirective_tsickle_Closure_declarations() {
    /**
     * \@internal
     * @type {?}
     */
    AbstractFormGroupDirective.prototype._parent;
    /**
     * \@internal
     * @type {?}
     */
    AbstractFormGroupDirective.prototype._validators;
    /**
     * \@internal
     * @type {?}
     */
    AbstractFormGroupDirective.prototype._asyncValidators;
}
//# sourceMappingURL=abstract_form_group_directive.js.map