/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
const _c0 = ["novalidate", ""];
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@description
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
 * \@publicApi
 * \@ngModule ReactiveFormsModule
 * \@ngModule FormsModule
 */
export class ɵNgNoValidate {
}
ɵNgNoValidate.decorators = [
    { type: Directive, args: [{
                selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
                host: { 'novalidate': '' },
            },] },
];
/** @nocollapse */ ɵNgNoValidate.ngDirectiveDef = i0.ɵɵdefineDirective({ type: ɵNgNoValidate, selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]], factory: function ɵNgNoValidate_Factory(t) { return new (t || ɵNgNoValidate)(); }, hostBindings: function ɵNgNoValidate_HostBindings(rf, ctx, elIndex) { if (rf & 1) {
        i0.ɵɵelementHostAttrs(_c0);
    } } });
/*@__PURE__*/ i0.ɵsetClassMetadata(ɵNgNoValidate, [{
        type: Directive,
        args: [{
                selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
                host: { 'novalidate': '' },
            }]
    }], null, null);
export { ɵNgNoValidate as NgNoValidate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QnhDLE1BQU0sT0FBTyxhQUFhOzs7WUFKekIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw4Q0FBOEM7Z0JBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxFQUFFLEVBQUM7YUFDekI7OzREQUNZLGFBQWEscUlBQWIsYUFBYTs7O21DQUFiLGFBQWE7Y0FKekIsU0FBUztlQUFDO2dCQUNULFFBQVEsRUFBRSw4Q0FBOEM7Z0JBQ3hELElBQUksRUFBRSxFQUFDLFlBQVksRUFBRSxFQUFFLEVBQUM7YUFDekI7O0FBSUQsT0FBTyxFQUFDLGFBQWEsSUFBSSxZQUFZLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEFkZHMgYG5vdmFsaWRhdGVgIGF0dHJpYnV0ZSB0byBhbGwgZm9ybXMgYnkgZGVmYXVsdC5cbiAqXG4gKiBgbm92YWxpZGF0ZWAgaXMgdXNlZCB0byBkaXNhYmxlIGJyb3dzZXIncyBuYXRpdmUgZm9ybSB2YWxpZGF0aW9uLlxuICpcbiAqIElmIHlvdSB3YW50IHRvIHVzZSBuYXRpdmUgdmFsaWRhdGlvbiB3aXRoIEFuZ3VsYXIgZm9ybXMsIGp1c3QgYWRkIGBuZ05hdGl2ZVZhbGlkYXRlYCBhdHRyaWJ1dGU6XG4gKlxuICogYGBgXG4gKiA8Zm9ybSBuZ05hdGl2ZVZhbGlkYXRlPjwvZm9ybT5cbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZm9ybTpub3QoW25nTm9Gb3JtXSk6bm90KFtuZ05hdGl2ZVZhbGlkYXRlXSknLFxuICBob3N0OiB7J25vdmFsaWRhdGUnOiAnJ30sXG59KVxuZXhwb3J0IGNsYXNzIMm1TmdOb1ZhbGlkYXRlIHtcbn1cblxuZXhwb3J0IHvJtU5nTm9WYWxpZGF0ZSBhcyBOZ05vVmFsaWRhdGV9O1xuIl19