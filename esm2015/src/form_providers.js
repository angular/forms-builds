/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { InternalFormsSharedModule, NG_MODEL_WITH_FORM_CONTROL_WARNING, REACTIVE_DRIVEN_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES } from './directives';
import { RadioControlRegistry } from './directives/radio_control_value_accessor';
import { FormBuilder } from './form_builder';
import * as i0 from "@angular/core";
import * as i1 from "./directives/ng_model";
import * as i2 from "./directives/ng_model_group";
import * as i3 from "./directives/ng_form";
import * as i4 from "./directives/reactive_directives/form_control_directive";
import * as i5 from "./directives/reactive_directives/form_group_directive";
import * as i6 from "./directives/reactive_directives/form_control_name";
import * as i7 from "./directives/reactive_directives/form_group_name";
/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Overview](/guide/forms-overview)
 * @see [Template-driven Forms Guide](/guide/forms)
 *
 * @publicApi
 */
export class FormsModule {
}
FormsModule.ɵmod = i0.ɵɵdefineNgModule({ type: FormsModule });
FormsModule.ɵinj = i0.ɵɵdefineInjector({ factory: function FormsModule_Factory(t) { return new (t || FormsModule)(); }, providers: [RadioControlRegistry], imports: [InternalFormsSharedModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FormsModule, { declarations: [i1.NgModel, i2.NgModelGroup, i3.NgForm], exports: [InternalFormsSharedModule, i1.NgModel, i2.NgModelGroup, i3.NgForm] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FormsModule, [{
        type: NgModule,
        args: [{
                declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                providers: [RadioControlRegistry],
                exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
            }]
    }], null, null); })();
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Overview](guide/forms-overview)
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @publicApi
 */
export class ReactiveFormsModule {
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     */
    static withConfig(opts) {
        return {
            ngModule: ReactiveFormsModule,
            providers: [
                { provide: NG_MODEL_WITH_FORM_CONTROL_WARNING, useValue: opts.warnOnNgModelWithFormControl }
            ]
        };
    }
}
ReactiveFormsModule.ɵmod = i0.ɵɵdefineNgModule({ type: ReactiveFormsModule });
ReactiveFormsModule.ɵinj = i0.ɵɵdefineInjector({ factory: function ReactiveFormsModule_Factory(t) { return new (t || ReactiveFormsModule)(); }, providers: [FormBuilder, RadioControlRegistry], imports: [InternalFormsSharedModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(ReactiveFormsModule, { declarations: [i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName], exports: [InternalFormsSharedModule, i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName] }); })();
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ReactiveFormsModule, [{
        type: NgModule,
        args: [{
                declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                providers: [FormBuilder, RadioControlRegistry],
                exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLGtDQUFrQyxFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ25KLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQy9FLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7O0FBRTNDOzs7Ozs7OztHQVFHO0FBTUgsTUFBTSxPQUFPLFdBQVc7OytDQUFYLFdBQVc7cUdBQVgsV0FBVyxtQkFIWCxDQUFDLG9CQUFvQixDQUFDLFlBQ3ZCLHlCQUF5Qjt3RkFFeEIsV0FBVyxzRUFGWix5QkFBeUI7dUZBRXhCLFdBQVc7Y0FMdkIsUUFBUTtlQUFDO2dCQUNSLFlBQVksRUFBRSwwQkFBMEI7Z0JBQ3hDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2dCQUNqQyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQzthQUNqRTs7QUFJRDs7Ozs7Ozs7R0FRRztBQU1ILE1BQU0sT0FBTyxtQkFBbUI7SUFDOUI7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFFakI7UUFDQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsa0NBQWtDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyw0QkFBNEIsRUFBQzthQUMzRjtTQUNGLENBQUM7SUFDSixDQUFDOzt1REFsQlUsbUJBQW1CO3FIQUFuQixtQkFBbUIsbUJBSG5CLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDLFlBQ3BDLHlCQUF5Qjt3RkFFeEIsbUJBQW1CLHNJQUZwQix5QkFBeUI7dUZBRXhCLG1CQUFtQjtjQUwvQixRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsMEJBQTBCLENBQUM7Z0JBQzFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQztnQkFDOUMsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7YUFDakUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORywgUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVMsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTfSBmcm9tICcuL2RpcmVjdGl2ZXMnO1xuaW1wb3J0IHtSYWRpb0NvbnRyb2xSZWdpc3RyeX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtGb3JtQnVpbGRlcn0gZnJvbSAnLi9mb3JtX2J1aWxkZXInO1xuXG4vKipcbiAqIEV4cG9ydHMgdGhlIHJlcXVpcmVkIHByb3ZpZGVycyBhbmQgZGlyZWN0aXZlcyBmb3IgdGVtcGxhdGUtZHJpdmVuIGZvcm1zLFxuICogbWFraW5nIHRoZW0gYXZhaWxhYmxlIGZvciBpbXBvcnQgYnkgTmdNb2R1bGVzIHRoYXQgaW1wb3J0IHRoaXMgbW9kdWxlLlxuICpcbiAqIEBzZWUgW0Zvcm1zIE92ZXJ2aWV3XSgvZ3VpZGUvZm9ybXMtb3ZlcnZpZXcpXG4gKiBAc2VlIFtUZW1wbGF0ZS1kcml2ZW4gRm9ybXMgR3VpZGVdKC9ndWlkZS9mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVMsXG4gIHByb3ZpZGVyczogW1JhZGlvQ29udHJvbFJlZ2lzdHJ5XSxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBGb3Jtc01vZHVsZSB7XG59XG5cbi8qKlxuICogRXhwb3J0cyB0aGUgcmVxdWlyZWQgaW5mcmFzdHJ1Y3R1cmUgYW5kIGRpcmVjdGl2ZXMgZm9yIHJlYWN0aXZlIGZvcm1zLFxuICogbWFraW5nIHRoZW0gYXZhaWxhYmxlIGZvciBpbXBvcnQgYnkgTmdNb2R1bGVzIHRoYXQgaW1wb3J0IHRoaXMgbW9kdWxlLlxuICpcbiAqIEBzZWUgW0Zvcm1zIE92ZXJ2aWV3XShndWlkZS9mb3Jtcy1vdmVydmlldylcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1JFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXSxcbiAgcHJvdmlkZXJzOiBbRm9ybUJ1aWxkZXIsIFJhZGlvQ29udHJvbFJlZ2lzdHJ5XSxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZUZvcm1zTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgcmVhY3RpdmUgZm9ybXMgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBBbiBvYmplY3Qgb2YgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqICogYHdhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2xgIENvbmZpZ3VyZXMgd2hlbiB0byBlbWl0IGEgd2FybmluZyB3aGVuIGFuIGBuZ01vZGVsYFxuICAgKiBiaW5kaW5nIGlzIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aENvbmZpZyhvcHRzOiB7XG4gICAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovIHdhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2w6ICduZXZlcid8J29uY2UnfCdhbHdheXMnXG4gIH0pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFJlYWN0aXZlRm9ybXNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIHVzZVZhbHVlOiBvcHRzLndhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2x9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19