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
import { AbstractControlDirective } from './abstract_control_directive';
/**
 * @return {?}
 */
function unimplemented() {
    throw new Error('unimplemented');
}
/**
 * A base class that all control directive extend.
 * It binds a `FormControl` object to a DOM element.
 *
 * Used internally by Angular forms.
 *
 *
 * @abstract
 */
export class NgControl extends AbstractControlDirective {
    constructor() {
        super(...arguments);
        /**
         * \@internal
         */
        this._parent = null;
        this.name = null;
        this.valueAccessor = null;
        /**
         * \@internal
         */
        this._rawValidators = [];
        /**
         * \@internal
         */
        this._rawAsyncValidators = [];
    }
    /**
     * @return {?}
     */
    get validator() { return /** @type {?} */ (unimplemented()); }
    /**
     * @return {?}
     */
    get asyncValidator() { return /** @type {?} */ (unimplemented()); }
}
function NgControl_tsickle_Closure_declarations() {
    /**
     * \@internal
     * @type {?}
     */
    NgControl.prototype._parent;
    /** @type {?} */
    NgControl.prototype.name;
    /** @type {?} */
    NgControl.prototype.valueAccessor;
    /**
     * \@internal
     * @type {?}
     */
    NgControl.prototype._rawValidators;
    /**
     * \@internal
     * @type {?}
     */
    NgControl.prototype._rawAsyncValidators;
    /**
     * @abstract
     * @param {?} newValue
     * @return {?}
     */
    NgControl.prototype.viewToModelUpdate = function (newValue) { };
}
//# sourceMappingURL=ng_control.js.map