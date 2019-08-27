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
 * @description
 * `InjectionToken` to provide to turn off the warning when using 'ngForm' deprecated selector.
 */
export var NG_FORM_SELECTOR_WARNING = new InjectionToken('NgFormSelectorWarning');
/**
 * This directive is solely used to display warnings when the deprecated `ngForm` selector is used.
 *
 * @deprecated in Angular v6 and will be removed in Angular v9.
 * @ngModule FormsModule
 * @publicApi
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
    NgFormSelectorWarning.ngFactoryDef = function NgFormSelectorWarning_Factory(t) { return new (t || NgFormSelectorWarning)(i0.ɵɵdirectiveInject(NG_FORM_SELECTOR_WARNING, 8)); };
    NgFormSelectorWarning.ngDirectiveDef = i0.ɵɵdefineDirective({ type: NgFormSelectorWarning, selectors: [["ngForm"]] });
    return NgFormSelectorWarning;
}());
export { NgFormSelectorWarning };
/*@__PURE__*/ i0.ɵsetClassMetadata(NgFormSelectorWarning, [{
        type: Directive,
        args: [{ selector: 'ngForm' }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NG_FORM_SELECTOR_WARNING]
            }] }]; }, null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbmdfZm9ybV9zZWxlY3Rvcl93YXJuaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7O0FBRTlEOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxJQUFNLHdCQUF3QixHQUFHLElBQUksY0FBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFFcEY7Ozs7OztHQU1HO0FBQ0g7SUFVRSwrQkFBMEQsYUFBMEI7UUFDbEYsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDO1lBQ3ZGLGFBQWEsS0FBSyxRQUFRLEVBQUU7WUFDOUIsb0JBQW9CLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckMscUJBQXFCLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztTQUM3QztJQUNILENBQUM7SUFkRDs7Ozs7T0FLRztJQUNJLG9DQUFjLEdBQUcsS0FBSyxDQUFDO3NHQVBuQixxQkFBcUIsdUJBU0Esd0JBQXdCO3dFQVQ3QyxxQkFBcUI7Z0NBekJsQztDQXlDQyxBQWpCRCxJQWlCQztTQWhCWSxxQkFBcUI7bUNBQXJCLHFCQUFxQjtjQURqQyxTQUFTO2VBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDOztzQkFVaEIsUUFBUTs7c0JBQUksTUFBTTt1QkFBQyx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1RlbXBsYXRlRHJpdmVuRXJyb3JzfSBmcm9tICcuL3RlbXBsYXRlX2RyaXZlbl9lcnJvcnMnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogYEluamVjdGlvblRva2VuYCB0byBwcm92aWRlIHRvIHR1cm4gb2ZmIHRoZSB3YXJuaW5nIHdoZW4gdXNpbmcgJ25nRm9ybScgZGVwcmVjYXRlZCBzZWxlY3Rvci5cbiAqL1xuZXhwb3J0IGNvbnN0IE5HX0ZPUk1fU0VMRUNUT1JfV0FSTklORyA9IG5ldyBJbmplY3Rpb25Ub2tlbignTmdGb3JtU2VsZWN0b3JXYXJuaW5nJyk7XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgc29sZWx5IHVzZWQgdG8gZGlzcGxheSB3YXJuaW5ncyB3aGVuIHRoZSBkZXByZWNhdGVkIGBuZ0Zvcm1gIHNlbGVjdG9yIGlzIHVzZWQuXG4gKlxuICogQGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIEFuZ3VsYXIgdjkuXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZ0Zvcm0nfSlcbmV4cG9ydCBjbGFzcyBOZ0Zvcm1TZWxlY3Rvcldhcm5pbmcge1xuICAvKipcbiAgICogU3RhdGljIHByb3BlcnR5IHVzZWQgdG8gdHJhY2sgd2hldGhlciB0aGUgZGVwcmVjYXRpb24gd2FybmluZyBmb3IgdGhpcyBzZWxlY3RvciBoYXMgYmVlbiBzZW50LlxuICAgKiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJvbmNlXCIuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgc3RhdGljIF9uZ0Zvcm1XYXJuaW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQEluamVjdChOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcpIG5nRm9ybVdhcm5pbmc6IHN0cmluZ3xudWxsKSB7XG4gICAgaWYgKCgoIW5nRm9ybVdhcm5pbmcgfHwgbmdGb3JtV2FybmluZyA9PT0gJ29uY2UnKSAmJiAhTmdGb3JtU2VsZWN0b3JXYXJuaW5nLl9uZ0Zvcm1XYXJuaW5nKSB8fFxuICAgICAgICBuZ0Zvcm1XYXJuaW5nID09PSAnYWx3YXlzJykge1xuICAgICAgVGVtcGxhdGVEcml2ZW5FcnJvcnMubmdGb3JtV2FybmluZygpO1xuICAgICAgTmdGb3JtU2VsZWN0b3JXYXJuaW5nLl9uZ0Zvcm1XYXJuaW5nID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==