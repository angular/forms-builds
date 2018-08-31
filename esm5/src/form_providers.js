/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { InternalFormsSharedModule, NG_FORM_SELECTOR_WARNING, NG_MODEL_WITH_FORM_CONTROL_WARNING, REACTIVE_DRIVEN_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES } from './directives';
import { RadioControlRegistry } from './directives/radio_control_value_accessor';
import { FormBuilder } from './form_builder';
/**
 * @description
 * An `NgModule` that registers the directives and providers for template-driven forms.
 *
 * @see [Forms Guide](/guide/forms)
 */
var FormsModule = /** @class */ (function () {
    function FormsModule() {
    }
    FormsModule_1 = FormsModule;
    /**
     * @description
     * Provides options for configuring the template-driven forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnDeprecatedNgFormSelector` Configures when to emit a warning when the deprecated
     * `ngForm` selector is used.
     */
    FormsModule.withConfig = function (opts) {
        return {
            ngModule: FormsModule_1,
            providers: [{ provide: NG_FORM_SELECTOR_WARNING, useValue: opts.warnOnDeprecatedNgFormSelector }]
        };
    };
    var FormsModule_1;
    FormsModule = FormsModule_1 = tslib_1.__decorate([
        NgModule({
            declarations: TEMPLATE_DRIVEN_DIRECTIVES,
            providers: [RadioControlRegistry],
            exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
        })
    ], FormsModule);
    return FormsModule;
}());
export { FormsModule };
/**
 * @description
 * An `NgModule` that registers the directives and providers for reactive forms.
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 */
var ReactiveFormsModule = /** @class */ (function () {
    function ReactiveFormsModule() {
    }
    ReactiveFormsModule_1 = ReactiveFormsModule;
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     */
    ReactiveFormsModule.withConfig = function (opts) {
        return {
            ngModule: ReactiveFormsModule_1,
            providers: [{
                    provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl
                }]
        };
    };
    var ReactiveFormsModule_1;
    ReactiveFormsModule = ReactiveFormsModule_1 = tslib_1.__decorate([
        NgModule({
            declarations: [REACTIVE_DRIVEN_DIRECTIVES],
            providers: [FormBuilder, RadioControlRegistry],
            exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
        })
    ], ReactiveFormsModule);
    return ReactiveFormsModule;
}());
export { ReactiveFormsModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBc0IsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTVELE9BQU8sRUFBQyx5QkFBeUIsRUFBRSx3QkFBd0IsRUFBRSxrQ0FBa0MsRUFBRSwwQkFBMEIsRUFBRSwwQkFBMEIsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM3SyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUMvRSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0M7Ozs7O0dBS0c7QUFNSDtJQUFBO0lBa0JBLENBQUM7b0JBbEJZLFdBQVc7SUFDdEI7Ozs7Ozs7T0FPRztJQUNJLHNCQUFVLEdBQWpCLFVBQWtCLElBRWpCO1FBQ0MsT0FBTztZQUNMLFFBQVEsRUFBRSxhQUFXO1lBQ3JCLFNBQVMsRUFDTCxDQUFDLEVBQUMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsOEJBQThCLEVBQUMsQ0FBQztTQUN6RixDQUFDO0lBQ0osQ0FBQzs7SUFqQlUsV0FBVztRQUx2QixRQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsMEJBQTBCO1lBQ3hDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO1lBQ2pDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDO1NBQ2pFLENBQUM7T0FDVyxXQUFXLENBa0J2QjtJQUFELGtCQUFDO0NBQUEsQUFsQkQsSUFrQkM7U0FsQlksV0FBVztBQW9CeEI7Ozs7OztHQU1HO0FBTUg7SUFBQTtJQW9CQSxDQUFDOzRCQXBCWSxtQkFBbUI7SUFDOUI7Ozs7Ozs7T0FPRztJQUNJLDhCQUFVLEdBQWpCLFVBQWtCLElBRWpCO1FBQ0MsT0FBTztZQUNMLFFBQVEsRUFBRSxxQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUM7b0JBQ1YsT0FBTyxFQUFFLGtDQUFrQztvQkFDM0MsUUFBUSxFQUFFLElBQUksQ0FBQyw0QkFBNEI7aUJBQzVDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQzs7SUFuQlUsbUJBQW1CO1FBTC9CLFFBQVEsQ0FBQztZQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixDQUFDO1lBQzFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQztZQUM5QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQztTQUNqRSxDQUFDO09BQ1csbUJBQW1CLENBb0IvQjtJQUFELDBCQUFDO0NBQUEsQUFwQkQsSUFvQkM7U0FwQlksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcsIE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTLCBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFU30gZnJvbSAnLi9kaXJlY3RpdmVzJztcbmltcG9ydCB7UmFkaW9Db250cm9sUmVnaXN0cnl9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7Rm9ybUJ1aWxkZXJ9IGZyb20gJy4vZm9ybV9idWlsZGVyJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBOZ01vZHVsZWAgdGhhdCByZWdpc3RlcnMgdGhlIGRpcmVjdGl2ZXMgYW5kIHByb3ZpZGVycyBmb3IgdGVtcGxhdGUtZHJpdmVuIGZvcm1zLlxuICpcbiAqIEBzZWUgW0Zvcm1zIEd1aWRlXSgvZ3VpZGUvZm9ybXMpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVMsXG4gIHByb3ZpZGVyczogW1JhZGlvQ29udHJvbFJlZ2lzdHJ5XSxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBGb3Jtc01vZHVsZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHRlbXBsYXRlLWRyaXZlbiBmb3JtcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIEFuIG9iamVjdCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogKiBgd2Fybk9uRGVwcmVjYXRlZE5nRm9ybVNlbGVjdG9yYCBDb25maWd1cmVzIHdoZW4gdG8gZW1pdCBhIHdhcm5pbmcgd2hlbiB0aGUgZGVwcmVjYXRlZFxuICAgKiBgbmdGb3JtYCBzZWxlY3RvciBpcyB1c2VkLlxuICAgKi9cbiAgc3RhdGljIHdpdGhDb25maWcob3B0czoge1xuICAgIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqLyB3YXJuT25EZXByZWNhdGVkTmdGb3JtU2VsZWN0b3I/OiAnbmV2ZXInIHwgJ29uY2UnIHwgJ2Fsd2F5cycsXG4gIH0pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEZvcm1zTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOlxuICAgICAgICAgIFt7cHJvdmlkZTogTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HLCB1c2VWYWx1ZTogb3B0cy53YXJuT25EZXByZWNhdGVkTmdGb3JtU2VsZWN0b3J9XVxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBOZ01vZHVsZWAgdGhhdCByZWdpc3RlcnMgdGhlIGRpcmVjdGl2ZXMgYW5kIHByb3ZpZGVycyBmb3IgcmVhY3RpdmUgZm9ybXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIFxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU10sXG4gIHByb3ZpZGVyczogW0Zvcm1CdWlsZGVyLCBSYWRpb0NvbnRyb2xSZWdpc3RyeV0sXG4gIGV4cG9ydHM6IFtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU11cbn0pXG5leHBvcnQgY2xhc3MgUmVhY3RpdmVGb3Jtc01vZHVsZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHJlYWN0aXZlIGZvcm1zIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiAqIGB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sYCBDb25maWd1cmVzIHdoZW4gdG8gZW1pdCBhIHdhcm5pbmcgd2hlbiBhbiBgbmdNb2RlbGBcbiAgICogYmluZGluZyBpcyB1c2VkIHdpdGggcmVhY3RpdmUgZm9ybSBkaXJlY3RpdmVzLlxuICAgKi9cbiAgc3RhdGljIHdpdGhDb25maWcob3B0czoge1xuICAgIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqLyB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sOiAnbmV2ZXInIHwgJ29uY2UnIHwgJ2Fsd2F5cydcbiAgfSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UmVhY3RpdmVGb3Jtc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3tcbiAgICAgICAgcHJvdmlkZTogTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORyxcbiAgICAgICAgdXNlVmFsdWU6IG9wdHMud2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbFxuICAgICAgfV1cbiAgICB9O1xuICB9XG59XG4iXX0=