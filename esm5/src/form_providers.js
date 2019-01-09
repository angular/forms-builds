/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/forms)
 *
 * @see [Forms Guide](/guide/forms)
 *
 * @publicApi
 */
var FormsModule = /** @class */ (function () {
    function FormsModule() {
    }
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
            ngModule: FormsModule,
            providers: [{ provide: NG_FORM_SELECTOR_WARNING, useValue: opts.warnOnDeprecatedNgFormSelector }]
        };
    };
    FormsModule.ngModuleDef = i0.ɵdefineNgModule({ type: FormsModule, bootstrap: [], declarations: [i1.NgModel, i2.NgModelGroup, i3.NgForm, i4.NgFormSelectorWarning], imports: [], exports: [InternalFormsSharedModule, i1.NgModel, i2.NgModelGroup, i3.NgForm, i4.NgFormSelectorWarning] });
    FormsModule.ngInjectorDef = i0.defineInjector({ factory: function FormsModule_Factory(t) { return new (t || FormsModule)(); }, providers: [RadioControlRegistry], imports: [[InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]] });
    return FormsModule;
}());
export { FormsModule };
/*@__PURE__*/ i0.ɵsetClassMetadata(FormsModule, [{
        type: NgModule,
        args: [{
                declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                providers: [RadioControlRegistry],
                exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
            }]
    }], null, null);
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/reactive-forms)
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 * @publicApi
 */
var ReactiveFormsModule = /** @class */ (function () {
    function ReactiveFormsModule() {
    }
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
            ngModule: ReactiveFormsModule,
            providers: [{
                    provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl
                }]
        };
    };
    ReactiveFormsModule.ngModuleDef = i0.ɵdefineNgModule({ type: ReactiveFormsModule, bootstrap: [], declarations: [i5.FormControlDirective, i6.FormGroupDirective, i7.FormControlName, i8.FormGroupName, i8.FormArrayName], imports: [], exports: [InternalFormsSharedModule, i5.FormControlDirective, i6.FormGroupDirective, i7.FormControlName, i8.FormGroupName, i8.FormArrayName] });
    ReactiveFormsModule.ngInjectorDef = i0.defineInjector({ factory: function ReactiveFormsModule_Factory(t) { return new (t || ReactiveFormsModule)(); }, providers: [FormBuilder, RadioControlRegistry], imports: [[InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]] });
    return ReactiveFormsModule;
}());
export { ReactiveFormsModule };
/*@__PURE__*/ i0.ɵsetClassMetadata(ReactiveFormsModule, [{
        type: NgModule,
        args: [{
                declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                providers: [FormBuilder, RadioControlRegistry],
                exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
            }]
    }], null, null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLHdCQUF3QixFQUFFLGtDQUFrQyxFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzdLLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQy9FLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7OztBQUUzQzs7Ozs7Ozs7R0FRRztBQUNIO0lBQUE7S0F1QkM7SUFqQkM7Ozs7Ozs7T0FPRztJQUNJLHNCQUFVLEdBQWpCLFVBQWtCLElBRWpCO1FBQ0MsT0FBTztZQUNMLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFNBQVMsRUFDTCxDQUFDLEVBQUMsT0FBTyxFQUFFLHdCQUF3QixFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsOEJBQThCLEVBQUMsQ0FBQztTQUN6RixDQUFDO0lBQ0osQ0FBQzt5REFqQlUsV0FBVywwSEFGWix5QkFBeUI7Z0hBRXhCLFdBQVcsbUJBSFgsQ0FBQyxvQkFBb0IsQ0FBQyxZQUN4QixDQUFDLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDO3NCQTFCbEU7Q0E4Q0MsQUF2QkQsSUF1QkM7U0FsQlksV0FBVzttQ0FBWCxXQUFXO2NBTHZCLFFBQVE7ZUFBQztnQkFDUixZQUFZLEVBQUUsMEJBQTBCO2dCQUN4QyxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDakMsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7YUFDakU7O0FBcUJEOzs7Ozs7OztHQVFHO0FBQ0g7SUFBQTtLQXlCQztJQW5CQzs7Ozs7OztPQU9HO0lBQ0ksOEJBQVUsR0FBakIsVUFBa0IsSUFFakI7UUFDQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUUsQ0FBQztvQkFDVixPQUFPLEVBQUUsa0NBQWtDO29CQUMzQyxRQUFRLEVBQUUsSUFBSSxDQUFDLDRCQUE0QjtpQkFDNUMsQ0FBQztTQUNILENBQUM7SUFDSixDQUFDO2lFQW5CVSxtQkFBbUIsZ0tBRnBCLHlCQUF5QjtnSUFFeEIsbUJBQW1CLG1CQUhuQixDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQyxZQUNyQyxDQUFDLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDOzhCQTVEbEU7Q0FrRkMsQUF6QkQsSUF5QkM7U0FwQlksbUJBQW1CO21DQUFuQixtQkFBbUI7Y0FML0IsUUFBUTtlQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixDQUFDO2dCQUMxQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUM7Z0JBQzlDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDO2FBQ2pFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBOR19GT1JNX1NFTEVDVE9SX1dBUk5JTkcsIE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTLCBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFU30gZnJvbSAnLi9kaXJlY3RpdmVzJztcbmltcG9ydCB7UmFkaW9Db250cm9sUmVnaXN0cnl9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7Rm9ybUJ1aWxkZXJ9IGZyb20gJy4vZm9ybV9idWlsZGVyJztcblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBwcm92aWRlcnMgYW5kIGRpcmVjdGl2ZXMgZm9yIHRlbXBsYXRlLWRyaXZlbiBmb3JtcyxcbiAqIG1ha2luZyB0aGVtIGF2YWlsYWJsZSBmb3IgaW1wb3J0IGJ5IE5nTW9kdWxlcyB0aGF0IGltcG9ydCB0aGlzIG1vZHVsZS5cbiAqIEBzZWUgW0Zvcm1zXShndWlkZS9mb3JtcylcbiAqXG4gKiBAc2VlIFtGb3JtcyBHdWlkZV0oL2d1aWRlL2Zvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFUyxcbiAgcHJvdmlkZXJzOiBbUmFkaW9Db250cm9sUmVnaXN0cnldLFxuICBleHBvcnRzOiBbSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1zTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgdGVtcGxhdGUtZHJpdmVuIGZvcm1zIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiAqIGB3YXJuT25EZXByZWNhdGVkTmdGb3JtU2VsZWN0b3JgIENvbmZpZ3VyZXMgd2hlbiB0byBlbWl0IGEgd2FybmluZyB3aGVuIHRoZSBkZXByZWNhdGVkXG4gICAqIGBuZ0Zvcm1gIHNlbGVjdG9yIGlzIHVzZWQuXG4gICAqL1xuICBzdGF0aWMgd2l0aENvbmZpZyhvcHRzOiB7XG4gICAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovIHdhcm5PbkRlcHJlY2F0ZWROZ0Zvcm1TZWxlY3Rvcj86ICduZXZlcicgfCAnb25jZScgfCAnYWx3YXlzJyxcbiAgfSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Rm9ybXNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IEZvcm1zTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOlxuICAgICAgICAgIFt7cHJvdmlkZTogTkdfRk9STV9TRUxFQ1RPUl9XQVJOSU5HLCB1c2VWYWx1ZTogb3B0cy53YXJuT25EZXByZWNhdGVkTmdGb3JtU2VsZWN0b3J9XVxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBpbmZyYXN0cnVjdHVyZSBhbmQgZGlyZWN0aXZlcyBmb3IgcmVhY3RpdmUgZm9ybXMsXG4gKiBtYWtpbmcgdGhlbSBhdmFpbGFibGUgZm9yIGltcG9ydCBieSBOZ01vZHVsZXMgdGhhdCBpbXBvcnQgdGhpcyBtb2R1bGUuXG4gKiBAc2VlIFtGb3Jtc10oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKC9ndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1JFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXSxcbiAgcHJvdmlkZXJzOiBbRm9ybUJ1aWxkZXIsIFJhZGlvQ29udHJvbFJlZ2lzdHJ5XSxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZUZvcm1zTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgcmVhY3RpdmUgZm9ybXMgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBBbiBvYmplY3Qgb2YgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqICogYHdhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2xgIENvbmZpZ3VyZXMgd2hlbiB0byBlbWl0IGEgd2FybmluZyB3aGVuIGFuIGBuZ01vZGVsYFxuICAgKiBiaW5kaW5nIGlzIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXMuXG4gICAqL1xuICBzdGF0aWMgd2l0aENvbmZpZyhvcHRzOiB7XG4gICAgLyoqIEBkZXByZWNhdGVkIGFzIG9mIHY2ICovIHdhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2w6ICduZXZlcicgfCAnb25jZScgfCAnYWx3YXlzJ1xuICB9KTogTW9kdWxlV2l0aFByb3ZpZGVyczxSZWFjdGl2ZUZvcm1zTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbe1xuICAgICAgICBwcm92aWRlOiBOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HLFxuICAgICAgICB1c2VWYWx1ZTogb3B0cy53YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sXG4gICAgICB9XVxuICAgIH07XG4gIH1cbn1cbiJdfQ==