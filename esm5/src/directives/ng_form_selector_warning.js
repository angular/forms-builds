/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, InjectionToken, Optional } from '@angular/core';
import { TemplateDrivenErrors } from './template_driven_errors';
import * as i0 from "@angular/core";
/**
 * Token to provide to turn off the warning when using 'ngForm' deprecated selector.
 */
export var NG_FORM_SELECTOR_WARNING = new InjectionToken('NgFormSelectorWarning');
/**
 * This directive is solely used to display warnings when the deprecated `ngForm` selector is used.
 *
 * @deprecated in Angular v6 and will be removed in Angular v9.
 *
 */
var NgFormSelectorWarning = /** @class */ (function () {
    function NgFormSelectorWarning(ngFormWarning) {
        if (((!ngFormWarning || ngFormWarning === 'once') && !NgFormSelectorWarning._ngFormWarning) ||
            ngFormWarning === 'always') {
            TemplateDrivenErrors.ngFormWarning();
            NgFormSelectorWarning._ngFormWarning = true;
        }
    }
    /**
     * Static property used to track whether the deprecation warning for this selector has been sent.
     * Used to support warning config of "once".
     *
     * @internal
     */
    NgFormSelectorWarning._ngFormWarning = false;
    NgFormSelectorWarning.ngDirectiveDef = i0.ɵdefineDirective({ type: NgFormSelectorWarning, selectors: [["ngForm"]], factory: function NgFormSelectorWarning_Factory(t) { return new (t || NgFormSelectorWarning)(i0.ɵdirectiveInject(NG_FORM_SELECTOR_WARNING, 8)); }, features: [i0.ɵPublicFeature] });
    return NgFormSelectorWarning;
}());
export { NgFormSelectorWarning };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7O0FBRTlEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUVwRjs7Ozs7R0FLRztBQUNIO0lBVUUsK0JBQTBELGFBQTBCO1FBQ2xGLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQztZQUN2RixhQUFhLEtBQUssUUFBUSxFQUFFO1lBQzlCLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JDLHFCQUFxQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDN0M7SUFDSCxDQUFDO0lBZEQ7Ozs7O09BS0c7SUFDSSxvQ0FBYyxHQUFHLEtBQUssQ0FBQzt1RUFQbkIscUJBQXFCLGlHQUFyQixxQkFBcUIsc0JBU0Esd0JBQXdCO2dDQWhDMUQ7Q0F1Q0MsQUFqQkQsSUFpQkM7U0FoQlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUZW1wbGF0ZURyaXZlbkVycm9yc30gZnJvbSAnLi90ZW1wbGF0ZV9kcml2ZW5fZXJyb3JzJztcblxuLyoqXG4gKiBUb2tlbiB0byBwcm92aWRlIHRvIHR1cm4gb2ZmIHRoZSB3YXJuaW5nIHdoZW4gdXNpbmcgJ25nRm9ybScgZGVwcmVjYXRlZCBzZWxlY3Rvci5cbiAqL1xuZXhwb3J0IGNvbnN0IE5HX0ZPUk1fU0VMRUNUT1JfV0FSTklORyA9IG5ldyBJbmplY3Rpb25Ub2tlbignTmdGb3JtU2VsZWN0b3JXYXJuaW5nJyk7XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgc29sZWx5IHVzZWQgdG8gZGlzcGxheSB3YXJuaW5ncyB3aGVuIHRoZSBkZXByZWNhdGVkIGBuZ0Zvcm1gIHNlbGVjdG9yIGlzIHVzZWQuXG4gKlxuICogQGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIEFuZ3VsYXIgdjkuXG4gKlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nRm9ybSd9KVxuZXhwb3J0IGNsYXNzIE5nRm9ybVNlbGVjdG9yV2FybmluZyB7XG4gIC8qKlxuICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIHRoZSBkZXByZWNhdGlvbiB3YXJuaW5nIGZvciB0aGlzIHNlbGVjdG9yIGhhcyBiZWVuIHNlbnQuXG4gICAqIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBzdGF0aWMgX25nRm9ybVdhcm5pbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE5HX0ZPUk1fU0VMRUNUT1JfV0FSTklORykgbmdGb3JtV2FybmluZzogc3RyaW5nfG51bGwpIHtcbiAgICBpZiAoKCghbmdGb3JtV2FybmluZyB8fCBuZ0Zvcm1XYXJuaW5nID09PSAnb25jZScpICYmICFOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcuX25nRm9ybVdhcm5pbmcpIHx8XG4gICAgICAgIG5nRm9ybVdhcm5pbmcgPT09ICdhbHdheXMnKSB7XG4gICAgICBUZW1wbGF0ZURyaXZlbkVycm9ycy5uZ0Zvcm1XYXJuaW5nKCk7XG4gICAgICBOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcuX25nRm9ybVdhcm5pbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19