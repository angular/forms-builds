/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directive, Inject, InjectionToken, Optional } from '@angular/core';
import { TemplateDrivenErrors } from './template_driven_errors';
/**
 * Token to provide to turn off the warning when using 'ngForm' deprecated selector.
 */
export var NG_FORM_SELECTOR_WARNING = new InjectionToken('NgFormSelectorWarning');
/**
 * This directive is solely used to display warnings when the deprecated `ngForm` selector is used.
 *
 * @deprecated in Angular v6 and will be removed in Angular v9.
 * @ngModule FormsModule
 */
var NgFormSelectorWarning = /** @class */ (function () {
    function NgFormSelectorWarning(ngFormWarning) {
        if (((!ngFormWarning || ngFormWarning === 'once') && !NgFormSelectorWarning_1._ngFormWarning) ||
            ngFormWarning === 'always') {
            TemplateDrivenErrors.ngFormWarning();
            NgFormSelectorWarning_1._ngFormWarning = true;
        }
    }
    NgFormSelectorWarning_1 = NgFormSelectorWarning;
    var NgFormSelectorWarning_1;
    /**
     * Static property used to track whether the deprecation warning for this selector has been sent.
     * Used to support warning config of "once".
     *
     * @internal
     */
    NgFormSelectorWarning._ngFormWarning = false;
    NgFormSelectorWarning = NgFormSelectorWarning_1 = tslib_1.__decorate([
        Directive({ selector: 'ngForm' }),
        tslib_1.__param(0, Optional()), tslib_1.__param(0, Inject(NG_FORM_SELECTOR_WARNING)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], NgFormSelectorWarning);
    return NgFormSelectorWarning;
}());
export { NgFormSelectorWarning };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFFLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRTlEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLElBQU0sd0JBQXdCLEdBQUcsSUFBSSxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUVwRjs7Ozs7R0FLRztBQUVIO0lBU0UsK0JBQTBELGFBQTBCO1FBQ2xGLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLGFBQWEsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUFxQixDQUFDLGNBQWMsQ0FBQztZQUN2RixhQUFhLEtBQUssUUFBUSxFQUFFO1lBQzlCLG9CQUFvQixDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JDLHVCQUFxQixDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDN0M7SUFDSCxDQUFDOzhCQWZVLHFCQUFxQjs7SUFDaEM7Ozs7O09BS0c7SUFDSSxvQ0FBYyxHQUFHLEtBQUssQ0FBQztJQVBuQixxQkFBcUI7UUFEakMsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO1FBVWpCLG1CQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsbUJBQUEsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUE7O09BVDlDLHFCQUFxQixDQWdCakM7SUFBRCw0QkFBQztDQUFBLEFBaEJELElBZ0JDO1NBaEJZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7VGVtcGxhdGVEcml2ZW5FcnJvcnN9IGZyb20gJy4vdGVtcGxhdGVfZHJpdmVuX2Vycm9ycyc7XG5cbi8qKlxuICogVG9rZW4gdG8gcHJvdmlkZSB0byB0dXJuIG9mZiB0aGUgd2FybmluZyB3aGVuIHVzaW5nICduZ0Zvcm0nIGRlcHJlY2F0ZWQgc2VsZWN0b3IuXG4gKi9cbmV4cG9ydCBjb25zdCBOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcgPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ05nRm9ybVNlbGVjdG9yV2FybmluZycpO1xuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIHNvbGVseSB1c2VkIHRvIGRpc3BsYXkgd2FybmluZ3Mgd2hlbiB0aGUgZGVwcmVjYXRlZCBgbmdGb3JtYCBzZWxlY3RvciBpcyB1c2VkLlxuICpcbiAqIEBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBBbmd1bGFyIHY5LlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmdGb3JtJ30pXG5leHBvcnQgY2xhc3MgTmdGb3JtU2VsZWN0b3JXYXJuaW5nIHtcbiAgLyoqXG4gICAqIFN0YXRpYyBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgdGhlIGRlcHJlY2F0aW9uIHdhcm5pbmcgZm9yIHRoaXMgc2VsZWN0b3IgaGFzIGJlZW4gc2VudC5cbiAgICogVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwib25jZVwiLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHN0YXRpYyBfbmdGb3JtV2FybmluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBJbmplY3QoTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HKSBuZ0Zvcm1XYXJuaW5nOiBzdHJpbmd8bnVsbCkge1xuICAgIGlmICgoKCFuZ0Zvcm1XYXJuaW5nIHx8IG5nRm9ybVdhcm5pbmcgPT09ICdvbmNlJykgJiYgIU5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZykgfHxcbiAgICAgICAgbmdGb3JtV2FybmluZyA9PT0gJ2Fsd2F5cycpIHtcbiAgICAgIFRlbXBsYXRlRHJpdmVuRXJyb3JzLm5nRm9ybVdhcm5pbmcoKTtcbiAgICAgIE5nRm9ybVNlbGVjdG9yV2FybmluZy5fbmdGb3JtV2FybmluZyA9IHRydWU7XG4gICAgfVxuICB9XG59XG4iXX0=