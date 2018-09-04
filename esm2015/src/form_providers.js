import { NgModule } from '@angular/core';
import { InternalFormsSharedModule, NG_FORM_SELECTOR_WARNING, NG_MODEL_WITH_FORM_CONTROL_WARNING, REACTIVE_DRIVEN_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES } from './directives';
import { RadioControlRegistry } from './directives/radio_control_value_accessor';
import { FormBuilder } from './form_builder';
import * as i0 from "@angular/core";
import * as i1 from "./directives/ng_model";
import * as i2 from "./directives/ng_model_group";
import * as i3 from "./directives/ng_form";
import * as i4 from "./directives/ng_form_selector_warning";
import * as i5 from "./directives/reactive_directives/form_control_directive";
import * as i6 from "./directives/reactive_directives/form_group_directive";
import * as i7 from "./directives/reactive_directives/form_control_name";
import * as i8 from "./directives/reactive_directives/form_group_name";
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
/**
 * \@description
 * An `NgModule` that registers the directives and providers for template-driven forms.
 *
 * @see [Forms Guide](/guide/forms)
 */
export class FormsModule {
    /**
     * \@description
     * Provides options for configuring the template-driven forms module.
     *
     * @param {?} opts An object of configuration options
     * * `warnOnDeprecatedNgFormSelector` Configures when to emit a warning when the deprecated
     * `ngForm` selector is used.
     * @return {?}
     */
    static withConfig(opts) {
        return {
            ngModule: FormsModule,
            providers: [{ provide: NG_FORM_SELECTOR_WARNING, useValue: opts.warnOnDeprecatedNgFormSelector }]
        };
    }
}
FormsModule.decorators = [
    { type: NgModule, args: [{
                declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                providers: [RadioControlRegistry],
                exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
            },] },
];
FormsModule.ngModuleDef = i0.ɵdefineNgModule({ type: FormsModule, bootstrap: [], declarations: [i1.NgModel, i2.NgModelGroup, i3.NgForm, i4.NgFormSelectorWarning], imports: [], exports: [InternalFormsSharedModule, i1.NgModel, i2.NgModelGroup, i3.NgForm, i4.NgFormSelectorWarning] });
FormsModule.ngInjectorDef = i0.defineInjector({ factory: function FormsModule_Factory(t) { return new (t || FormsModule)(); }, providers: [RadioControlRegistry], imports: [[InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]] });
/**
 * \@description
 * An `NgModule` that registers the directives and providers for reactive forms.
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 */
export class ReactiveFormsModule {
    /**
     * \@description
     * Provides options for configuring the reactive forms module.
     *
     * @param {?} opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     * @return {?}
     */
    static withConfig(opts) {
        return {
            ngModule: ReactiveFormsModule,
            providers: [{
                    provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl
                }]
        };
    }
}
ReactiveFormsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                providers: [FormBuilder, RadioControlRegistry],
                exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
            },] },
];
ReactiveFormsModule.ngModuleDef = i0.ɵdefineNgModule({ type: ReactiveFormsModule, bootstrap: [], declarations: [i5.FormControlDirective, i6.FormGroupDirective, i7.FormControlName, i8.FormGroupName, i8.FormArrayName], imports: [], exports: [InternalFormsSharedModule, i5.FormControlDirective, i6.FormGroupDirective, i7.FormControlName, i8.FormGroupName, i8.FormArrayName] });
ReactiveFormsModule.ngInjectorDef = i0.defineInjector({ factory: function ReactiveFormsModule_Factory(t) { return new (t || ReactiveFormsModule)(); }, providers: [FormBuilder, RadioControlRegistry], imports: [[InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]] });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHdCQUF3QixFQUFFLGtDQUFrQyxFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzdLLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQy9FLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYTNDLE1BQU0sT0FBTyxXQUFXOzs7Ozs7Ozs7O0lBU3RCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFFakI7UUFDQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLFdBQVc7WUFDckIsU0FBUyxFQUNMLENBQUMsRUFBQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyw4QkFBOEIsRUFBQyxDQUFDO1NBQ3pGLENBQUM7S0FDSDs7O1lBdEJGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsMEJBQTBCO2dCQUN4QyxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDakMsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7YUFDakU7O3FEQUNZLFdBQVcsMEhBRloseUJBQXlCOzRHQUV4QixXQUFXLG1CQUhYLENBQUMsb0JBQW9CLENBQUMsWUFDeEIsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7QUFrQ2xFLE1BQU0sT0FBTyxtQkFBbUI7Ozs7Ozs7Ozs7SUFTOUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUVqQjtRQUNDLE9BQU87WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRSxDQUFDO29CQUNWLE9BQU8sRUFBRSxrQ0FBa0M7b0JBQzNDLFFBQVEsRUFBRSxJQUFJLENBQUMsNEJBQTRCO2lCQUM1QyxDQUFDO1NBQ0gsQ0FBQztLQUNIOzs7WUF4QkYsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixDQUFDO2dCQUMxQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUM7Z0JBQzlDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDO2FBQ2pFOzs2REFDWSxtQkFBbUIsZ0tBRnBCLHlCQUF5Qjs0SEFFeEIsbUJBQW1CLG1CQUhuQixDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQyxZQUNyQyxDQUFDLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcsIE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTLCBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFU30gZnJvbSAnLi9kaXJlY3RpdmVzJztcbmltcG9ydCB7UmFkaW9Db250cm9sUmVnaXN0cnl9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7Rm9ybUJ1aWxkZXJ9IGZyb20gJy4vZm9ybV9idWlsZGVyJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBOZ01vZHVsZWAgdGhhdCByZWdpc3RlcnMgdGhlIGRpcmVjdGl2ZXMgYW5kIHByb3ZpZGVycyBmb3IgdGVtcGxhdGUtZHJpdmVuIGZvcm1zLlxuICpcbiAqIEBzZWUgW0Zvcm1zIEd1aWRlXSgvZ3VpZGUvZm9ybXMpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVMsXG4gIHByb3ZpZGVyczogW1JhZGlvQ29udHJvbFJlZ2lzdHJ5XSxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBGb3Jtc01vZHVsZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHRlbXBsYXRlLWRyaXZlbiBmb3JtcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIEFuIG9iamVjdCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogKiBgd2Fybk9uRGVwcmVjYXRlZE5nRm9ybVNlbGVjdG9yYCBDb25maWd1cmVzIHdoZW4gdG8gZW1pdCBhIHdhcm5pbmcgd2hlbiB0aGUgZGVwcmVjYXRlZFxuICAgKiBgbmdGb3JtYCBzZWxlY3RvciBpcyB1c2VkLlxuICAgKi9cbiAgc3RhdGljIHdpdGhDb25maWcob3B0czoge1xuICAgIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqLyB3YXJuT25EZXByZWNhdGVkTmdGb3JtU2VsZWN0b3I/OiAnbmV2ZXInIHwgJ29uY2UnIHwgJ2Fsd2F5cycsXG4gIH0pOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEZvcm1zTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOlxuICAgICAgICAgIFt7cHJvdmlkZTogTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HLCB1c2VWYWx1ZTogb3B0cy53YXJuT25EZXByZWNhdGVkTmdGb3JtU2VsZWN0b3J9XVxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFuIGBOZ01vZHVsZWAgdGhhdCByZWdpc3RlcnMgdGhlIGRpcmVjdGl2ZXMgYW5kIHByb3ZpZGVycyBmb3IgcmVhY3RpdmUgZm9ybXMuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqIFxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU10sXG4gIHByb3ZpZGVyczogW0Zvcm1CdWlsZGVyLCBSYWRpb0NvbnRyb2xSZWdpc3RyeV0sXG4gIGV4cG9ydHM6IFtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFU11cbn0pXG5leHBvcnQgY2xhc3MgUmVhY3RpdmVGb3Jtc01vZHVsZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIHJlYWN0aXZlIGZvcm1zIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiAqIGB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sYCBDb25maWd1cmVzIHdoZW4gdG8gZW1pdCBhIHdhcm5pbmcgd2hlbiBhbiBgbmdNb2RlbGBcbiAgICogYmluZGluZyBpcyB1c2VkIHdpdGggcmVhY3RpdmUgZm9ybSBkaXJlY3RpdmVzLlxuICAgKi9cbiAgc3RhdGljIHdpdGhDb25maWcob3B0czoge1xuICAgIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqLyB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sOiAnbmV2ZXInIHwgJ29uY2UnIHwgJ2Fsd2F5cydcbiAgfSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UmVhY3RpdmVGb3Jtc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3tcbiAgICAgICAgcHJvdmlkZTogTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORyxcbiAgICAgICAgdXNlVmFsdWU6IG9wdHMud2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbFxuICAgICAgfV1cbiAgICB9O1xuICB9XG59XG4iXX0=