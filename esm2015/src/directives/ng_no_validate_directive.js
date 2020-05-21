/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { Directive } from '@angular/core';
/**
 * @description
 *
 * Adds `novalidate` attribute to all forms by default.
 *
 * `novalidate` is used to disable browser's native form validation.
 *
 * If you want to use native validation with Angular forms, just add `ngNativeValidate` attribute:
 *
 * ```
 * <form ngNativeValidate></form>
 * ```
 *
 * @publicApi
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 */
let ɵNgNoValidate = /** @class */ (() => {
    let ɵNgNoValidate = class ɵNgNoValidate {
    };
    ɵNgNoValidate = __decorate([
        Directive({
            selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
            host: { 'novalidate': '' },
        })
    ], ɵNgNoValidate);
    return ɵNgNoValidate;
})();
export { ɵNgNoValidate };
export { ɵNgNoValidate as NgNoValidate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXhDOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBS0g7SUFBQSxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0tBQ3pCLENBQUE7SUFEWSxhQUFhO1FBSnpCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSw4Q0FBOEM7WUFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLEVBQUUsRUFBQztTQUN6QixDQUFDO09BQ1csYUFBYSxDQUN6QjtJQUFELG9CQUFDO0tBQUE7U0FEWSxhQUFhO0FBRzFCLE9BQU8sRUFBQyxhQUFhLElBQUksWUFBWSxFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBBZGRzIGBub3ZhbGlkYXRlYCBhdHRyaWJ1dGUgdG8gYWxsIGZvcm1zIGJ5IGRlZmF1bHQuXG4gKlxuICogYG5vdmFsaWRhdGVgIGlzIHVzZWQgdG8gZGlzYWJsZSBicm93c2VyJ3MgbmF0aXZlIGZvcm0gdmFsaWRhdGlvbi5cbiAqXG4gKiBJZiB5b3Ugd2FudCB0byB1c2UgbmF0aXZlIHZhbGlkYXRpb24gd2l0aCBBbmd1bGFyIGZvcm1zLCBqdXN0IGFkZCBgbmdOYXRpdmVWYWxpZGF0ZWAgYXR0cmlidXRlOlxuICpcbiAqIGBgYFxuICogPGZvcm0gbmdOYXRpdmVWYWxpZGF0ZT48L2Zvcm0+XG4gKiBgYGBcbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Zvcm06bm90KFtuZ05vRm9ybV0pOm5vdChbbmdOYXRpdmVWYWxpZGF0ZV0pJyxcbiAgaG9zdDogeydub3ZhbGlkYXRlJzogJyd9LFxufSlcbmV4cG9ydCBjbGFzcyDJtU5nTm9WYWxpZGF0ZSB7XG59XG5cbmV4cG9ydCB7ybVOZ05vVmFsaWRhdGUgYXMgTmdOb1ZhbGlkYXRlfTtcbiJdfQ==