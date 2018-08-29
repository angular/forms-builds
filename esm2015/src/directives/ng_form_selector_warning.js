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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7OztBQUs5RCxhQUFhLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Ozs7Ozs7QUFTcEYsTUFBTSxPQUFPLHFCQUFxQjs7OztJQVNoQyxZQUEwRCxhQUEwQjtRQUNsRixJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsSUFBSSxhQUFhLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxjQUFjLENBQUM7WUFDdkYsYUFBYSxLQUFLLFFBQVEsRUFBRTtZQUM5QixvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQyxxQkFBcUIsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQzdDO0tBQ0Y7Ozs7Ozs7O3VDQVJ1QixLQUFLOztZQVI5QixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDOzs7OzRDQVVoQixRQUFRLFlBQUksTUFBTSxTQUFDLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGVtcGxhdGVEcml2ZW5FcnJvcnN9IGZyb20gJy4vdGVtcGxhdGVfZHJpdmVuX2Vycm9ycyc7XG5cbi8qKlxuICogVG9rZW4gdG8gcHJvdmlkZSB0byB0dXJuIG9mZiB0aGUgd2FybmluZyB3aGVuIHVzaW5nICduZ0Zvcm0nIGRlcHJlY2F0ZWQgc2VsZWN0b3IuXG4gKi9cbmV4cG9ydCBjb25zdCBOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ05nRm9ybVNlbGVjdG9yV2FybmluZycpO1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHNvbGVseSB1c2VkIHRvIGRpc3BsYXkgd2FybmluZ3Mgd2hlbiB0aGUgZGVwcmVjYXRlZCBgbmdGb3JtYCBzZWxlY3RvciBpcyB1c2VkLlxuICpcbiAqIEBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBBbmd1bGFyIHY5LlxuICpcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZ0Zvcm0nfSlcbmV4cG9ydCBjbGFzcyBOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcge1xuICAvKipcbiAgICogU3RhdGljIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciB0aGUgZGVwcmVjYXRpb24gd2FybmluZyBmb3IgdGhpcyBzZWxlY3RvciBoYXMgYmVlbiBzZW50LlxuICAgKiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJvbmNlXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc3RhdGljIF9uZ0Zvcm1XYXJuaW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcpIG5nRm9ybVdhcm5pbmc6IHN0cmluZ3xudWxsKSB7XG4gICAgaWYgKCgoIW5nRm9ybVdhcm5pbmcgfHwgbmdGb3JtV2FybmluZyA9PT0gJ29uY2UnKSAmJiAhTmdGb3JtU2VsZWN0b3JXYXJuaW5nLl9uZ0Zvcm1XYXJuaW5nKSB8fFxuICAgICAgICBuZ0Zvcm1XYXJuaW5nID09PSAnYWx3YXlzJykge1xuICAgICAgVGVtcGxhdGVEcml2ZW5FcnJvcnMubmdGb3JtV2FybmluZygpO1xuICAgICAgTmdGb3JtU2VsZWN0b3JXYXJuaW5nLl9uZ0Zvcm1XYXJuaW5nID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==