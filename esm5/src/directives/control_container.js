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
import { AbstractControlDirective } from './abstract_control_directive';
/**
 * A directive that contains multiple {\@link NgControl}s.
 *
 * Only used by the forms module.
 *
 * \@stable
 * @abstract
 */
var /**
 * A directive that contains multiple {\@link NgControl}s.
 *
 * Only used by the forms module.
 *
 * \@stable
 * @abstract
 */
ControlContainer = /** @class */ (function (_super) {
    tslib_1.__extends(ControlContainer, _super);
    function ControlContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ControlContainer.prototype, "formDirective", {
        /**
         * Get the form to which this container belongs.
         */
        get: /**
         * Get the form to which this container belongs.
         * @return {?}
         */
        function () { return null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlContainer.prototype, "path", {
        /**
         * Get the path to this container.
         */
        get: /**
         * Get the path to this container.
         * @return {?}
         */
        function () { return null; },
        enumerable: true,
        configurable: true
    });
    return ControlContainer;
}(AbstractControlDirective));
/**
 * A directive that contains multiple {\@link NgControl}s.
 *
 * Only used by the forms module.
 *
 * \@stable
 * @abstract
 */
export { ControlContainer };
function ControlContainer_tsickle_Closure_declarations() {
    /** @type {?} */
    ControlContainer.prototype.name;
}
//# sourceMappingURL=control_container.js.map