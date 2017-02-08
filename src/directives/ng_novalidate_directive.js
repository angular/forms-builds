/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
var NgNovalidate = (function () {
    function NgNovalidate() {
    }
    return NgNovalidate;
}());
export { NgNovalidate };
NgNovalidate.decorators = [
    { type: Directive, args: [{
                selector: 'form:not([ngNoForm])',
                host: { 'novalidate': '' },
            },] },
];
/** @nocollapse */
NgNovalidate.ctorParameters = function () { return []; };
function NgNovalidate_tsickle_Closure_declarations() {
    /** @type {?} */
    NgNovalidate.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    NgNovalidate.ctorParameters;
}
//# sourceMappingURL=ng_novalidate_directive.js.map