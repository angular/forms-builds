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
/**
 * @param {?} validator
 * @return {?}
 */
export function normalizeValidator(validator) {
    if ((/** @type {?} */ (validator)).validate) {
        return (c) => (/** @type {?} */ (validator)).validate(c);
    }
    else {
        return /** @type {?} */ (validator);
    }
}
/**
 * @param {?} validator
 * @return {?}
 */
export function normalizeAsyncValidator(validator) {
    if ((/** @type {?} */ (validator)).validate) {
        return (c) => (/** @type {?} */ (validator)).validate(c);
    }
    else {
        return /** @type {?} */ (validator);
    }
}
//# sourceMappingURL=normalize_validator.js.map