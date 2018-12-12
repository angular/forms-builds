/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Inject, InjectionToken, Optional } from '@angular/core';
import { TemplateDrivenErrors } from './template_driven_errors';
/** *
 * \@description
 * `InjectionToken` to provide to turn off the warning when using 'ngForm' deprecated selector.
  @type {?} */
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
    { type: Directive, args: [{ selector: 'ngForm' },] }
];
/** @nocollapse */
NgFormSelectorWarning.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [NG_FORM_SELECTOR_WARNING,] }] }
];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLyIsInNvdXJjZXMiOlsicGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7QUFNOUQsYUFBYSx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOzs7Ozs7OztBQVVwRixNQUFNLE9BQU8scUJBQXFCOzs7O0lBU2hDLFlBQTBELGFBQTBCO1FBQ2xGLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQztZQUN2RixhQUFhLEtBQUssUUFBUSxFQUFFO1lBQzlCLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JDLHFCQUFxQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDN0M7S0FDRjs7Ozs7Ozs7QUFSRCx1Q0FBd0IsS0FBSyxDQUFDOztZQVIvQixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDOzs7OzRDQVVoQixRQUFRLFlBQUksTUFBTSxTQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGVtcGxhdGVEcml2ZW5FcnJvcnN9IGZyb20gJy4vdGVtcGxhdGVfZHJpdmVuX2Vycm9ycyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgSW5qZWN0aW9uVG9rZW5gIHRvIHByb3ZpZGUgdG8gdHVybiBvZmYgdGhlIHdhcm5pbmcgd2hlbiB1c2luZyAnbmdGb3JtJyBkZXByZWNhdGVkIHNlbGVjdG9yLlxuICovXG5leHBvcnQgY29uc3QgTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HID0gbmV3IEluamVjdGlvblRva2VuKCdOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcnKTtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBzb2xlbHkgdXNlZCB0byBkaXNwbGF5IHdhcm5pbmdzIHdoZW4gdGhlIGRlcHJlY2F0ZWQgYG5nRm9ybWAgc2VsZWN0b3IgaXMgdXNlZC5cbiAqXG4gKiBAZGVwcmVjYXRlZCBpbiBBbmd1bGFyIHY2IGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gQW5ndWxhciB2OS5cbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nRm9ybSd9KVxuZXhwb3J0IGNsYXNzIE5nRm9ybVNlbGVjdG9yV2FybmluZyB7XG4gIC8qKlxuICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIHRoZSBkZXByZWNhdGlvbiB3YXJuaW5nIGZvciB0aGlzIHNlbGVjdG9yIGhhcyBiZWVuIHNlbnQuXG4gICAqIFVzZWQgdG8gc3VwcG9ydCB3YXJuaW5nIGNvbmZpZyBvZiBcIm9uY2VcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBzdGF0aWMgX25nRm9ybVdhcm5pbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBASW5qZWN0KE5HX0ZPUk1fU0VMRUNUT1JfV0FSTklORykgbmdGb3JtV2FybmluZzogc3RyaW5nfG51bGwpIHtcbiAgICBpZiAoKCghbmdGb3JtV2FybmluZyB8fCBuZ0Zvcm1XYXJuaW5nID09PSAnb25jZScpICYmICFOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcuX25nRm9ybVdhcm5pbmcpIHx8XG4gICAgICAgIG5nRm9ybVdhcm5pbmcgPT09ICdhbHdheXMnKSB7XG4gICAgICBUZW1wbGF0ZURyaXZlbkVycm9ycy5uZ0Zvcm1XYXJuaW5nKCk7XG4gICAgICBOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcuX25nRm9ybVdhcm5pbmcgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuIl19