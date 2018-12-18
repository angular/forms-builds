import { Directive, Inject, InjectionToken, Optional } from '@angular/core';
import { TemplateDrivenErrors } from './template_driven_errors';
import * as i0 from "@angular/core";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * \@description
 * `InjectionToken` to provide to turn off the warning when using 'ngForm' deprecated selector.
 * @type {?}
 */
export const NG_FORM_SELECTOR_WARNING = new InjectionToken('NgFormSelectorWarning');
/**
 * This directive is solely used to display warnings when the deprecated `ngForm` selector is used.
 *
 * @deprecated in Angular v6 and will be removed in Angular v9.
 * \@ngModule FormsModule
 * \@publicApi
 */
export class NgFormSelectorWarning {
    /**
     * @param {?} ngFormWarning
     */
    constructor(ngFormWarning) {
        if (((!ngFormWarning || ngFormWarning === 'once') && !NgFormSelectorWarning._ngFormWarning) ||
            ngFormWarning === 'always') {
            TemplateDrivenErrors.ngFormWarning();
            NgFormSelectorWarning._ngFormWarning = true;
        }
    }
}
/**
 * Static property used to track whether the deprecation warning for this selector has been sent.
 * Used to support warning config of "once".
 *
 * \@internal
 */
NgFormSelectorWarning._ngFormWarning = false;
NgFormSelectorWarning.decorators = [
    { type: Directive, args: [{ selector: 'ngForm' },] },
];
/** @nocollapse */
NgFormSelectorWarning.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [NG_FORM_SELECTOR_WARNING,] }] }
];
NgFormSelectorWarning.ngDirectiveDef = i0.ɵdefineDirective({ type: NgFormSelectorWarning, selectors: [["ngForm"]], factory: function NgFormSelectorWarning_Factory(t) { return new (t || NgFormSelectorWarning)(i0.ɵdirectiveInject(NG_FORM_SELECTOR_WARNING, 8)); } });
/*@__PURE__*/ i0.ɵsetClassMetadata(NgFormSelectorWarning, [{
        type: Directive,
        args: [{ selector: 'ngForm' }]
    }], function () { return [{
        type: undefined,
        decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NG_FORM_SELECTOR_WARNING]
            }]
    }]; }, null);
if (false) {
    /**
     * Static property used to track whether the deprecation warning for this selector has been sent.
     * Used to support warning config of "once".
     *
     * \@internal
     * @type {?}
     */
    NgFormSelectorWarning._ngFormWarning;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLyIsInNvdXJjZXMiOlsicGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU05RCxNQUFNLE9BQU8sd0JBQXdCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUM7Ozs7Ozs7O0FBVW5GLE1BQU0sT0FBTyxxQkFBcUI7Ozs7SUFTaEMsWUFBMEQsYUFBMEI7UUFDbEYsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDO1lBQ3ZGLGFBQWEsS0FBSyxRQUFRLEVBQUU7WUFDOUIsb0JBQW9CLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckMscUJBQXFCLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztTQUM3QztJQUNILENBQUM7Ozs7Ozs7O0FBUk0sb0NBQWMsR0FBRyxLQUFLLENBQUM7O1lBUi9CLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUM7Ozs7NENBVWhCLFFBQVEsWUFBSSxNQUFNLFNBQUMsd0JBQXdCOzttRUFUN0MscUJBQXFCLGlHQUFyQixxQkFBcUIsc0JBU0Esd0JBQXdCO21DQVQ3QyxxQkFBcUI7Y0FEakMsU0FBUztlQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQzs7OztzQkFVaEIsUUFBUTs7c0JBQUksTUFBTTt1QkFBQyx3QkFBd0I7Ozs7Ozs7Ozs7O0lBRnhELHFDQUE4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGVtcGxhdGVEcml2ZW5FcnJvcnN9IGZyb20gJy4vdGVtcGxhdGVfZHJpdmVuX2Vycm9ycyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgSW5qZWN0aW9uVG9rZW5gIHRvIHByb3ZpZGUgdG8gdHVybiBvZmYgdGhlIHdhcm5pbmcgd2hlbiB1c2luZyAnbmdGb3JtJyBkZXByZWNhdGVkIHNlbGVjdG9yLlxuICovXG5leHBvcnQgY29uc3QgTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HID0gbmV3IEluamVjdGlvblRva2VuKCdOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcnKTtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBzb2xlbHkgdXNlZCB0byBkaXNwbGF5IHdhcm5pbmdzIHdoZW4gdGhlIGRlcHJlY2F0ZWQgYG5nRm9ybWAgc2VsZWN0b3IgaXMgdXNlZC5cbiAqXG4gKiBAZGVwcmVjYXRlZCBpbiBBbmd1bGFyIHY2IGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gQW5ndWxhciB2OS5cbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nRm9ybSd9KVxuZXhwb3J0IGNsYXNzIE5nRm9ybVNlbGVjdG9yV2FybmluZyB7XG4gIC8qKlxuICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIHRoZSBkZXByZWNhdGlvbiB3YXJuaW5nIGZvciB0aGlzIHNlbGVjdG9yIGhhcyBiZWVuIHNlbnQuXG4gICAqIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBzdGF0aWMgX25nRm9ybVdhcm5pbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE5HX0ZPUk1fU0VMRUNUT1JfV0FSTklORykgbmdGb3JtV2FybmluZzogc3RyaW5nfG51bGwpIHtcbiAgICBpZiAoKCghbmdGb3JtV2FybmluZyB8fCBuZ0Zvcm1XYXJuaW5nID09PSAnb25jZScpICYmICFOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcuX25nRm9ybVdhcm5pbmcpIHx8XG4gICAgICAgIG5nRm9ybVdhcm5pbmcgPT09ICdhbHdheXMnKSB7XG4gICAgICBUZW1wbGF0ZURyaXZlbkVycm9ycy5uZ0Zvcm1XYXJuaW5nKCk7XG4gICAgICBOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcuX25nRm9ybVdhcm5pbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19