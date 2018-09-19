import * as i0 from "@angular/core";
import * as i1 from "./directives/ng_model";
import * as i2 from "./directives/ng_model_group";
import * as i3 from "./directives/ng_form";
import * as i4 from "./directives/reactive_directives/form_control_directive";
import * as i5 from "./directives/reactive_directives/form_group_directive";
import * as i6 from "./directives/reactive_directives/form_control_name";
import * as i7 from "./directives/reactive_directives/form_group_name";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var FormsModule = /** @class */ (function () {
    function FormsModule() {
    }
    FormsModule.ngModuleDef = i0.ɵdefineNgModule({ type: FormsModule, bootstrap: [], declarations: [i1.NgModel, i2.NgModelGroup, i3.NgForm], imports: [], exports: [InternalFormsSharedModule, i1.NgModel, i2.NgModelGroup, i3.NgForm] });
    FormsModule.ngInjectorDef = i0.defineInjector({ factory: function FormsModule_Factory() { return new FormsModule(); }, providers: [RadioControlRegistry], imports: [[InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]] });
    return FormsModule;
}());
export { FormsModule };
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/reactive-forms)
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 */
var ReactiveFormsModule = /** @class */ (function () {
    function ReactiveFormsModule() {
    }
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options `warnOnNgModelWithFormControl` Configures when
     * to emit a warning when an `ngModel binding is used with reactive form directives.
     */
    ReactiveFormsModule.withConfig = function (opts) {
        return {
            ngModule: ReactiveFormsModule,
            providers: [{
                    provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl
                }]
        };
    };
    ReactiveFormsModule.ngModuleDef = i0.ɵdefineNgModule({ type: ReactiveFormsModule, bootstrap: [], declarations: [i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName], imports: [], exports: [InternalFormsSharedModule, i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName] });
    ReactiveFormsModule.ngInjectorDef = i0.defineInjector({ factory: function ReactiveFormsModule_Factory() { return new ReactiveFormsModule(); }, providers: [FormBuilder, RadioControlRegistry], imports: [[InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]] });
    return ReactiveFormsModule;
}());
export { ReactiveFormsModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUU1RCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsa0NBQWtDLEVBQUUsMEJBQTBCLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDbkosT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDL0UsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBSTNDOzs7Ozs7R0FNRztBQUNIO0lBQUE7S0FNQzt5REFEWSxXQUFXLGdHQUZaLHlCQUF5Qjt5R0FFeEIsV0FBVyxrQkFIWCxDQUFDLG9CQUFvQixDQUFDLFlBQ3hCLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7c0JBMUJsRTtDQTZCQyxBQU5ELElBTUM7U0FEWSxXQUFXO0FBR3hCOzs7Ozs7O0dBT0c7QUFDSDtJQUFBO0tBd0JDO0lBbEJDOzs7Ozs7T0FNRztJQUNJLDhCQUFVLEdBQWpCLFVBQWtCLElBRWpCO1FBQ0MsT0FBTztZQUNMLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFLENBQUM7b0JBQ1YsT0FBTyxFQUFFLGtDQUFrQztvQkFDM0MsUUFBUSxFQUFFLElBQUksQ0FBQyw0QkFBNEI7aUJBQzVDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztpRUFsQlUsbUJBQW1CLGdLQUZwQix5QkFBeUI7eUhBRXhCLG1CQUFtQixrQkFIbkIsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUMsWUFDckMsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQzs4QkExQ2xFO0NBK0RDLEFBeEJELElBd0JDO1NBbkJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORywgUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVMsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTfSBmcm9tICcuL2RpcmVjdGl2ZXMnO1xuaW1wb3J0IHtSYWRpb0NvbnRyb2xSZWdpc3RyeX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtGb3JtQnVpbGRlcn0gZnJvbSAnLi9mb3JtX2J1aWxkZXInO1xuXG5cblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBwcm92aWRlcnMgYW5kIGRpcmVjdGl2ZXMgZm9yIHRlbXBsYXRlLWRyaXZlbiBmb3JtcyxcbiAqIG1ha2luZyB0aGVtIGF2YWlsYWJsZSBmb3IgaW1wb3J0IGJ5IE5nTW9kdWxlcyB0aGF0IGltcG9ydCB0aGlzIG1vZHVsZS5cbiAqIEBzZWUgW0Zvcm1zXShndWlkZS9mb3JtcylcbiAqXG4gKiBAc2VlIFtGb3JtcyBHdWlkZV0oL2d1aWRlL2Zvcm1zKVxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTLFxuICBwcm92aWRlcnM6IFtSYWRpb0NvbnRyb2xSZWdpc3RyeV0sXG4gIGV4cG9ydHM6IFtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFU11cbn0pXG5leHBvcnQgY2xhc3MgRm9ybXNNb2R1bGUge1xufVxuXG4vKipcbiAqIEV4cG9ydHMgdGhlIHJlcXVpcmVkIGluZnJhc3RydWN0dXJlIGFuZCBkaXJlY3RpdmVzIGZvciByZWFjdGl2ZSBmb3JtcyxcbiAqIG1ha2luZyB0aGVtIGF2YWlsYWJsZSBmb3IgaW1wb3J0IGJ5IE5nTW9kdWxlcyB0aGF0IGltcG9ydCB0aGlzIG1vZHVsZS5cbiAqIEBzZWUgW0Zvcm1zXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oL2d1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1JFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXSxcbiAgcHJvdmlkZXJzOiBbRm9ybUJ1aWxkZXIsIFJhZGlvQ29udHJvbFJlZ2lzdHJ5XSxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZUZvcm1zTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgcmVhY3RpdmUgZm9ybXMgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBBbiBvYmplY3Qgb2YgY29uZmlndXJhdGlvbiBvcHRpb25zIGB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sYCBDb25maWd1cmVzIHdoZW5cbiAgICogdG8gZW1pdCBhIHdhcm5pbmcgd2hlbiBhbiBgbmdNb2RlbCBiaW5kaW5nIGlzIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aENvbmZpZyhvcHRzOiB7XG4gICAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovIHdhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2w6ICduZXZlcicgfCAnb25jZScgfCAnYWx3YXlzJ1xuICB9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxSZWFjdGl2ZUZvcm1zTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbe1xuICAgICAgICBwcm92aWRlOiBOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HLFxuICAgICAgICB1c2VWYWx1ZTogb3B0cy53YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sXG4gICAgICB9XVxuICAgIH07XG4gIH1cbn1cbiJdfQ==