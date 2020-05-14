/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/directives/normalize_validator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
    if (!!((/** @type {?} */ (validator))).validate) {
        return (/**
         * @param {?} c
         * @return {?}
         */
        (c) => ((/** @type {?} */ (validator))).validate(c));
    }
    else {
        return (/** @type {?} */ (validator));
    }
}
/**
 * @param {?} validator
 * @return {?}
 */
export function normalizeAsyncValidator(validator) {
    if (!!((/** @type {?} */ (validator))).validate) {
        return (/**
         * @param {?} c
         * @return {?}
         */
        (c) => ((/** @type {?} */ (validator))).validate(c));
    }
    else {
        return (/** @type {?} */ (validator));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXplX3ZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25vcm1hbGl6ZV92YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQVdBLE1BQU0sVUFBVSxrQkFBa0IsQ0FBQyxTQUFnQztJQUNqRSxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFXLFNBQVMsRUFBQSxDQUFDLENBQUMsUUFBUSxFQUFFO1FBQ3JDOzs7O1FBQU8sQ0FBQyxDQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLFNBQVMsRUFBQSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDO0tBQ25FO1NBQU07UUFDTCxPQUFPLG1CQUFhLFNBQVMsRUFBQSxDQUFDO0tBQy9CO0FBQ0gsQ0FBQzs7Ozs7QUFFRCxNQUFNLFVBQVUsdUJBQXVCLENBQUMsU0FDYztJQUNwRCxJQUFJLENBQUMsQ0FBQyxDQUFDLG1CQUFnQixTQUFTLEVBQUEsQ0FBQyxDQUFDLFFBQVEsRUFBRTtRQUMxQzs7OztRQUFPLENBQUMsQ0FBa0IsRUFBRSxFQUFFLENBQUMsQ0FBQyxtQkFBZ0IsU0FBUyxFQUFBLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUM7S0FDeEU7U0FBTTtRQUNMLE9BQU8sbUJBQWtCLFNBQVMsRUFBQSxDQUFDO0tBQ3BDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVWYWxpZGF0b3IodmFsaWRhdG9yOiBWYWxpZGF0b3JGbnxWYWxpZGF0b3IpOiBWYWxpZGF0b3JGbiB7XG4gIGlmICghISg8VmFsaWRhdG9yPnZhbGlkYXRvcikudmFsaWRhdGUpIHtcbiAgICByZXR1cm4gKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gKDxWYWxpZGF0b3I+dmFsaWRhdG9yKS52YWxpZGF0ZShjKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gPFZhbGlkYXRvckZuPnZhbGlkYXRvcjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplQXN5bmNWYWxpZGF0b3IodmFsaWRhdG9yOiBBc3luY1ZhbGlkYXRvckZufFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFzeW5jVmFsaWRhdG9yKTogQXN5bmNWYWxpZGF0b3JGbiB7XG4gIGlmICghISg8QXN5bmNWYWxpZGF0b3I+dmFsaWRhdG9yKS52YWxpZGF0ZSkge1xuICAgIHJldHVybiAoYzogQWJzdHJhY3RDb250cm9sKSA9PiAoPEFzeW5jVmFsaWRhdG9yPnZhbGlkYXRvcikudmFsaWRhdGUoYyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIDxBc3luY1ZhbGlkYXRvckZuPnZhbGlkYXRvcjtcbiAgfVxufVxuIl19