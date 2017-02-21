/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
/**
 * \@whatItDoes Adds `novalidate` attribute to all forms by default.
 *
 * `novalidate` is used to disable browser's native form validation.
 *
 * If you want to use native validation with Angular forms, just add `ngNativeValidate` attribute:
 *
 * ```
 * <form ngNativeValidate></form>
 * ```
 *
 * \@experimental
 */
var NgNoValidate = (function () {
    function NgNoValidate() {
    }
    return NgNoValidate;
}());
export { NgNoValidate };
NgNoValidate.decorators = [
    { type: Directive, args: [{
                selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
                host: { 'novalidate': '' },
            },] },
];
/** @nocollapse */
NgNoValidate.ctorParameters = function () { return []; };
function NgNoValidate_tsickle_Closure_declarations() {
    /** @type {?} */
    NgNoValidate.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgNoValidate.ctorParameters;
}
//# sourceMappingURL=ng_no_validate_directive.js.map