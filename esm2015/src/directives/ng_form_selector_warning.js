import { Directive, Inject, InjectionToken, Optional } from '@angular/core';
import { TemplateDrivenErrors } from './template_driven_errors';
import * as i0 from "@angular/core";
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
/** *
 * Token to provide to turn off the warning when using 'ngForm' deprecated selector.
  @type {?} */
export const NG_FORM_SELECTOR_WARNING = new InjectionToken('NgFormSelectorWarning');
/**
 * This directive is solely used to display warnings when the deprecated `ngForm` selector is used.
 *
 * @deprecated in Angular v6 and will be removed in Angular v9.
 *
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
NgFormSelectorWarning.ngDirectiveDef = i0.ɵdefineDirective({ type: NgFormSelectorWarning, selectors: [["ngForm"]], factory: function NgFormSelectorWarning_Factory(t) { return new (t || NgFormSelectorWarning)(i0.ɵdirectiveInject(NG_FORM_SELECTOR_WARNING, 8)); }, features: [i0.ɵPublicFeature] });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLOUQsYUFBYSx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOzs7Ozs7O0FBU3BGLE1BQU0sT0FBTyxxQkFBcUI7Ozs7SUFTaEMsWUFBMEQsYUFBMEI7UUFDbEYsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDO1lBQ3ZGLGFBQWEsS0FBSyxRQUFRLEVBQUU7WUFDOUIsb0JBQW9CLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckMscUJBQXFCLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztTQUM3QztLQUNGOzs7Ozs7Ozt1Q0FSdUIsS0FBSzs7WUFSOUIsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQzs7Ozs0Q0FVaEIsUUFBUSxZQUFJLE1BQU0sU0FBQyx3QkFBd0I7O21FQVQ3QyxxQkFBcUIsaUdBQXJCLHFCQUFxQixzQkFTQSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RlbXBsYXRlRHJpdmVuRXJyb3JzfSBmcm9tICcuL3RlbXBsYXRlX2RyaXZlbl9lcnJvcnMnO1xuXG4vKipcbiAqIFRva2VuIHRvIHByb3ZpZGUgdG8gdHVybiBvZmYgdGhlIHdhcm5pbmcgd2hlbiB1c2luZyAnbmdGb3JtJyBkZXByZWNhdGVkIHNlbGVjdG9yLlxuICovXG5leHBvcnQgY29uc3QgTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HID0gbmV3IEluamVjdGlvblRva2VuKCdOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcnKTtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBzb2xlbHkgdXNlZCB0byBkaXNwbGF5IHdhcm5pbmdzIHdoZW4gdGhlIGRlcHJlY2F0ZWQgYG5nRm9ybWAgc2VsZWN0b3IgaXMgdXNlZC5cbiAqXG4gKiBAZGVwcmVjYXRlZCBpbiBBbmd1bGFyIHY2IGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gQW5ndWxhciB2OS5cbiAqXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmdGb3JtJ30pXG5leHBvcnQgY2xhc3MgTmdGb3JtU2VsZWN0b3JXYXJuaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgdGhlIGRlcHJlY2F0aW9uIHdhcm5pbmcgZm9yIHRoaXMgc2VsZWN0b3IgaGFzIGJlZW4gc2VudC5cbiAgICogVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwib25jZVwiLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHN0YXRpYyBfbmdGb3JtV2FybmluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HKSBuZ0Zvcm1XYXJuaW5nOiBzdHJpbmd8bnVsbCkge1xuICAgIGlmICgoKCFuZ0Zvcm1XYXJuaW5nIHx8IG5nRm9ybVdhcm5pbmcgPT09ICdvbmNlJykgJiYgIU5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZykgfHxcbiAgICAgICAgbmdGb3JtV2FybmluZyA9PT0gJ2Fsd2F5cycpIHtcbiAgICAgIFRlbXBsYXRlRHJpdmVuRXJyb3JzLm5nRm9ybVdhcm5pbmcoKTtcbiAgICAgIE5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZyA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iXX0=