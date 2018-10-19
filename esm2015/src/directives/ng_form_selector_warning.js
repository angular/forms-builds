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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLOUQsYUFBYSx3QkFBd0IsR0FBRyxJQUFJLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOzs7Ozs7OztBQVVwRixNQUFNLE9BQU8scUJBQXFCOzs7O0lBU2hDLFlBQTBELGFBQTBCO1FBQ2xGLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGNBQWMsQ0FBQztZQUN2RixhQUFhLEtBQUssUUFBUSxFQUFFO1lBQzlCLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JDLHFCQUFxQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDN0M7S0FDRjs7Ozs7Ozs7QUFSRCx1Q0FBd0IsS0FBSyxDQUFDOztZQVIvQixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDOzs7OzRDQVVoQixRQUFRLFlBQUksTUFBTSxTQUFDLHdCQUF3Qjs7bUVBVDdDLHFCQUFxQixpR0FBckIscUJBQXFCLHNCQVNBLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGVtcGxhdGVEcml2ZW5FcnJvcnN9IGZyb20gJy4vdGVtcGxhdGVfZHJpdmVuX2Vycm9ycyc7XG5cbi8qKlxuICogVG9rZW4gdG8gcHJvdmlkZSB0byB0dXJuIG9mZiB0aGUgd2FybmluZyB3aGVuIHVzaW5nICduZ0Zvcm0nIGRlcHJlY2F0ZWQgc2VsZWN0b3IuXG4gKi9cbmV4cG9ydCBjb25zdCBOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ05nRm9ybVNlbGVjdG9yV2FybmluZycpO1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHNvbGVseSB1c2VkIHRvIGRpc3BsYXkgd2FybmluZ3Mgd2hlbiB0aGUgZGVwcmVjYXRlZCBgbmdGb3JtYCBzZWxlY3RvciBpcyB1c2VkLlxuICpcbiAqIEBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBBbmd1bGFyIHY5LlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmdGb3JtJ30pXG5leHBvcnQgY2xhc3MgTmdGb3JtU2VsZWN0b3JXYXJuaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgdGhlIGRlcHJlY2F0aW9uIHdhcm5pbmcgZm9yIHRoaXMgc2VsZWN0b3IgaGFzIGJlZW4gc2VudC5cbiAgICogVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwib25jZVwiLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHN0YXRpYyBfbmdGb3JtV2FybmluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HKSBuZ0Zvcm1XYXJuaW5nOiBzdHJpbmd8bnVsbCkge1xuICAgIGlmICgoKCFuZ0Zvcm1XYXJuaW5nIHx8IG5nRm9ybVdhcm5pbmcgPT09ICdvbmNlJykgJiYgIU5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZykgfHxcbiAgICAgICAgbmdGb3JtV2FybmluZyA9PT0gJ2Fsd2F5cycpIHtcbiAgICAgIFRlbXBsYXRlRHJpdmVuRXJyb3JzLm5nRm9ybVdhcm5pbmcoKTtcbiAgICAgIE5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZyA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iXX0=