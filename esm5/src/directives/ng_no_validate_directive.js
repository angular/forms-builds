/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
var _c0 = ["novalidate", ""];
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
var ɵNgNoValidate = /** @class */ (function () {
    function ɵNgNoValidate() {
    }
    ɵNgNoValidate.ngDirectiveDef = i0.ΔdefineDirective({ type: ɵNgNoValidate, selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]], factory: function ɵNgNoValidate_Factory(t) { return new (t || ɵNgNoValidate)(); }, hostBindings: function ɵNgNoValidate_HostBindings(rf, ctx, elIndex) { if (rf & 1) {
            i0.ΔelementHostAttrs(_c0);
        } } });
    return ɵNgNoValidate;
}());
export { ɵNgNoValidate };
/*@__PURE__*/ i0.ɵsetClassMetadata(ɵNgNoValidate, [{
        type: Directive,
        args: [{
                selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
                host: { 'novalidate': '' },
            }]
    }], null, null);
export { ɵNgNoValidate as NgNoValidate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7OztBQUV4Qzs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNIO0lBQUE7S0FLQzsrREFEWSxhQUFhLHFJQUFiLGFBQWE7Ozt3QkEvQjFCO0NBZ0NDLEFBTEQsSUFLQztTQURZLGFBQWE7bUNBQWIsYUFBYTtjQUp6QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLDhDQUE4QztnQkFDeEQsSUFBSSxFQUFFLEVBQUMsWUFBWSxFQUFFLEVBQUUsRUFBQzthQUN6Qjs7QUFJRCxPQUFPLEVBQUMsYUFBYSxJQUFJLFlBQVksRUFBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQWRkcyBgbm92YWxpZGF0ZWAgYXR0cmlidXRlIHRvIGFsbCBmb3JtcyBieSBkZWZhdWx0LlxuICpcbiAqIGBub3ZhbGlkYXRlYCBpcyB1c2VkIHRvIGRpc2FibGUgYnJvd3NlcidzIG5hdGl2ZSBmb3JtIHZhbGlkYXRpb24uXG4gKlxuICogSWYgeW91IHdhbnQgdG8gdXNlIG5hdGl2ZSB2YWxpZGF0aW9uIHdpdGggQW5ndWxhciBmb3JtcywganVzdCBhZGQgYG5nTmF0aXZlVmFsaWRhdGVgIGF0dHJpYnV0ZTpcbiAqXG4gKiBgYGBcbiAqIDxmb3JtIG5nTmF0aXZlVmFsaWRhdGU+PC9mb3JtPlxuICogYGBgXG4gKlxuICogQHB1YmxpY0FwaVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdmb3JtOm5vdChbbmdOb0Zvcm1dKTpub3QoW25nTmF0aXZlVmFsaWRhdGVdKScsXG4gIGhvc3Q6IHsnbm92YWxpZGF0ZSc6ICcnfSxcbn0pXG5leHBvcnQgY2xhc3MgybVOZ05vVmFsaWRhdGUge1xufVxuXG5leHBvcnQge8m1TmdOb1ZhbGlkYXRlIGFzIE5nTm9WYWxpZGF0ZX07XG4iXX0=