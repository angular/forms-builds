/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
var ReactiveFormsModule_1;
import { NgModule } from '@angular/core';
import { InternalFormsSharedModule, NG_MODEL_WITH_FORM_CONTROL_WARNING, REACTIVE_DRIVEN_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES } from './directives';
import { RadioControlRegistry } from './directives/radio_control_value_accessor';
import { FormBuilder } from './form_builder';
/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/forms)
 *
 * @see [Forms Guide](/guide/forms)
 */
let FormsModule = class FormsModule {
};
FormsModule = tslib_1.__decorate([
    NgModule({
        declarations: TEMPLATE_DRIVEN_DIRECTIVES,
        providers: [RadioControlRegistry],
        exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
    })
], FormsModule);
export { FormsModule };
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/reactive-forms)
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 */
let ReactiveFormsModule = ReactiveFormsModule_1 = class ReactiveFormsModule {
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options `warnOnNgModelWithFormControl` Configures when
     * to emit a warning when an `ngModel binding is used with reactive form directives.
     */
    static withConfig(opts) {
        return {
            ngModule: ReactiveFormsModule_1,
            providers: [{
                    provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl
                }]
        };
    }
};
ReactiveFormsModule = ReactiveFormsModule_1 = tslib_1.__decorate([
    NgModule({
        declarations: [REACTIVE_DRIVEN_DIRECTIVES],
        providers: [FormBuilder, RadioControlRegistry],
        exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
    })
], ReactiveFormsModule);
export { ReactiveFormsModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7QUFFSCxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUU1RCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsa0NBQWtDLEVBQUUsMEJBQTBCLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDbkosT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDL0UsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBSTNDOzs7Ozs7R0FNRztBQU1ILElBQWEsV0FBVyxHQUF4QjtDQUNDLENBQUE7QUFEWSxXQUFXO0lBTHZCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRSwwQkFBMEI7UUFDeEMsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7UUFDakMsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7S0FDakUsQ0FBQztHQUNXLFdBQVcsQ0FDdkI7U0FEWSxXQUFXO0FBR3hCOzs7Ozs7O0dBT0c7QUFNSCxJQUFhLG1CQUFtQiwyQkFBaEM7SUFDRTs7Ozs7O09BTUc7SUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLElBRWpCO1FBQ0MsT0FBTztZQUNMLFFBQVEsRUFBRSxxQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUM7b0JBQ1YsT0FBTyxFQUFFLGtDQUFrQztvQkFDM0MsUUFBUSxFQUFFLElBQUksQ0FBQyw0QkFBNEI7aUJBQzVDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUE7QUFuQlksbUJBQW1CO0lBTC9CLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixDQUFDO1FBQzFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQztRQUM5QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQztLQUNqRSxDQUFDO0dBQ1csbUJBQW1CLENBbUIvQjtTQW5CWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTLCBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFU30gZnJvbSAnLi9kaXJlY3RpdmVzJztcbmltcG9ydCB7UmFkaW9Db250cm9sUmVnaXN0cnl9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7Rm9ybUJ1aWxkZXJ9IGZyb20gJy4vZm9ybV9idWlsZGVyJztcblxuXG5cbi8qKlxuICogRXhwb3J0cyB0aGUgcmVxdWlyZWQgcHJvdmlkZXJzIGFuZCBkaXJlY3RpdmVzIGZvciB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXMsXG4gKiBtYWtpbmcgdGhlbSBhdmFpbGFibGUgZm9yIGltcG9ydCBieSBOZ01vZHVsZXMgdGhhdCBpbXBvcnQgdGhpcyBtb2R1bGUuXG4gKiBAc2VlIFtGb3Jtc10oZ3VpZGUvZm9ybXMpXG4gKlxuICogQHNlZSBbRm9ybXMgR3VpZGVdKC9ndWlkZS9mb3JtcylcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFUyxcbiAgcHJvdmlkZXJzOiBbUmFkaW9Db250cm9sUmVnaXN0cnldLFxuICBleHBvcnRzOiBbSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1zTW9kdWxlIHtcbn1cblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBpbmZyYXN0cnVjdHVyZSBhbmQgZGlyZWN0aXZlcyBmb3IgcmVhY3RpdmUgZm9ybXMsXG4gKiBtYWtpbmcgdGhlbSBhdmFpbGFibGUgZm9yIGltcG9ydCBieSBOZ01vZHVsZXMgdGhhdCBpbXBvcnQgdGhpcyBtb2R1bGUuXG4gKiBAc2VlIFtGb3Jtc10oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIFxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU10sXG4gIHByb3ZpZGVyczogW0Zvcm1CdWlsZGVyLCBSYWRpb0NvbnRyb2xSZWdpc3RyeV0sXG4gIGV4cG9ydHM6IFtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU11cbn0pXG5leHBvcnQgY2xhc3MgUmVhY3RpdmVGb3Jtc01vZHVsZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHJlYWN0aXZlIGZvcm1zIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBgd2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbGAgQ29uZmlndXJlcyB3aGVuXG4gICAqIHRvIGVtaXQgYSB3YXJuaW5nIHdoZW4gYW4gYG5nTW9kZWwgYmluZGluZyBpcyB1c2VkIHdpdGggcmVhY3RpdmUgZm9ybSBkaXJlY3RpdmVzLlxuICAgKi9cbiAgc3RhdGljIHdpdGhDb25maWcob3B0czoge1xuICAgIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqLyB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sOiAnbmV2ZXInIHwgJ29uY2UnIHwgJ2Fsd2F5cydcbiAgfSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UmVhY3RpdmVGb3Jtc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3tcbiAgICAgICAgcHJvdmlkZTogTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORyxcbiAgICAgICAgdXNlVmFsdWU6IG9wdHMud2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbFxuICAgICAgfV1cbiAgICB9O1xuICB9XG59XG4iXX0=