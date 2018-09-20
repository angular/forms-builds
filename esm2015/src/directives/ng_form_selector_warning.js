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
 * Token to provide to turn off the warning when using 'ngForm' deprecated selector.
  @type {?} */
export const NG_FORM_SELECTOR_WARNING = new InjectionToken('NgFormSelectorWarning');
/**
 * This directive is solely used to display warnings when the deprecated `ngForm` selector is used.
 *
 * @deprecated in Angular v6 and will be removed in Angular v9.
 * \@ngModule FormsModule
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7OztBQUs5RCxhQUFhLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Ozs7Ozs7QUFTcEYsTUFBTSxPQUFPLHFCQUFxQjs7OztJQVNoQyxZQUEwRCxhQUEwQjtRQUNsRixJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxhQUFhLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUM7WUFDdkYsYUFBYSxLQUFLLFFBQVEsRUFBRTtZQUM5QixvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQyxxQkFBcUIsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQzdDO0tBQ0Y7Ozs7Ozs7O3VDQVJ1QixLQUFLOztZQVI5QixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDOzs7OzRDQVVoQixRQUFRLFlBQUksTUFBTSxTQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGVtcGxhdGVEcml2ZW5FcnJvcnN9IGZyb20gJy4vdGVtcGxhdGVfZHJpdmVuX2Vycm9ycyc7XG5cbi8qKlxuICogVG9rZW4gdG8gcHJvdmlkZSB0byB0dXJuIG9mZiB0aGUgd2FybmluZyB3aGVuIHVzaW5nICduZ0Zvcm0nIGRlcHJlY2F0ZWQgc2VsZWN0b3IuXG4gKi9cbmV4cG9ydCBjb25zdCBOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ05nRm9ybVNlbGVjdG9yV2FybmluZycpO1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHNvbGVseSB1c2VkIHRvIGRpc3BsYXkgd2FybmluZ3Mgd2hlbiB0aGUgZGVwcmVjYXRlZCBgbmdGb3JtYCBzZWxlY3RvciBpcyB1c2VkLlxuICpcbiAqIEBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBBbmd1bGFyIHY5LlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmdGb3JtJ30pXG5leHBvcnQgY2xhc3MgTmdGb3JtU2VsZWN0b3JXYXJuaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgdGhlIGRlcHJlY2F0aW9uIHdhcm5pbmcgZm9yIHRoaXMgc2VsZWN0b3IgaGFzIGJlZW4gc2VudC5cbiAgICogVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwib25jZVwiLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHN0YXRpYyBfbmdGb3JtV2FybmluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HKSBuZ0Zvcm1XYXJuaW5nOiBzdHJpbmd8bnVsbCkge1xuICAgIGlmICgoKCFuZ0Zvcm1XYXJuaW5nIHx8IG5nRm9ybVdhcm5pbmcgPT09ICdvbmNlJykgJiYgIU5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZykgfHxcbiAgICAgICAgbmdGb3JtV2FybmluZyA9PT0gJ2Fsd2F5cycpIHtcbiAgICAgIFRlbXBsYXRlRHJpdmVuRXJyb3JzLm5nRm9ybVdhcm5pbmcoKTtcbiAgICAgIE5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZyA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iXX0=