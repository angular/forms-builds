/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/form_providers.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Overview](/guide/forms-overview)
 * @see [Template-driven Forms Guide](/guide/forms)
 *
 * \@publicApi
 */
let FormsModule = /** @class */ (() => {
    /**
     * Exports the required providers and directives for template-driven forms,
     * making them available for import by NgModules that import this module.
     *
     * @see [Forms Overview](/guide/forms-overview)
     * @see [Template-driven Forms Guide](/guide/forms)
     *
     * \@publicApi
     */
    class FormsModule {
    }
    FormsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                    providers: [RadioControlRegistry],
                    exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
                },] },
    ];
    /** @nocollapse */ FormsModule.ɵmod = i0.ɵɵdefineNgModule({ type: FormsModule });
    /** @nocollapse */ FormsModule.ɵinj = i0.ɵɵdefineInjector({ factory: function FormsModule_Factory(t) { return new (t || FormsModule)(); }, providers: [RadioControlRegistry], imports: [InternalFormsSharedModule] });
    return FormsModule;
})();
export { FormsModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(FormsModule, { declarations: [i1.NgModel, i2.NgModelGroup, i3.NgForm], exports: [InternalFormsSharedModule, i1.NgModel, i2.NgModelGroup, i3.NgForm] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FormsModule, [{
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
 * \@publicApi
 */
let ReactiveFormsModule = /** @class */ (() => {
    /**
     * Exports the required infrastructure and directives for reactive forms,
     * making them available for import by NgModules that import this module.
     *
     * @see [Forms Overview](guide/forms-overview)
     * @see [Reactive Forms Guide](guide/reactive-forms)
     *
     * \@publicApi
     */
    class ReactiveFormsModule {
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
                providers: [
                    { provide: NG_MODEL_WITH_FORM_CONTROL_WARNING, useValue: opts.warnOnNgModelWithFormControl }
                ]
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
    /** @nocollapse */ ReactiveFormsModule.ɵmod = i0.ɵɵdefineNgModule({ type: ReactiveFormsModule });
    /** @nocollapse */ ReactiveFormsModule.ɵinj = i0.ɵɵdefineInjector({ factory: function ReactiveFormsModule_Factory(t) { return new (t || ReactiveFormsModule)(); }, providers: [FormBuilder, RadioControlRegistry], imports: [InternalFormsSharedModule] });
    return ReactiveFormsModule;
})();
export { ReactiveFormsModule };
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(ReactiveFormsModule, { declarations: [i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName], exports: [InternalFormsSharedModule, i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ReactiveFormsModule, [{
        type: NgModule,
        args: [{
                declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                providers: [FormBuilder, RadioControlRegistry],
                exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRQSxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUU1RCxPQUFPLEVBQUMseUJBQXlCLEVBQUUsa0NBQWtDLEVBQUUsMEJBQTBCLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDbkosT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDL0UsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBVzNDOzs7Ozs7Ozs7O0lBQUEsTUFLYSxXQUFXOzs7Z0JBTHZCLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsMEJBQTBCO29CQUN4QyxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDakMsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7aUJBQ2pFOztzRUFDWSxXQUFXOzRIQUFYLFdBQVcsbUJBSFgsQ0FBQyxvQkFBb0IsQ0FBQyxZQUN2Qix5QkFBeUI7c0JBMUJyQztLQTZCQztTQURZLFdBQVc7d0ZBQVgsV0FBVyxzRUFGWix5QkFBeUI7a0RBRXhCLFdBQVc7Y0FMdkIsUUFBUTtlQUFDO2dCQUNSLFlBQVksRUFBRSwwQkFBMEI7Z0JBQ3hDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2dCQUNqQyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQzthQUNqRTs7Ozs7Ozs7Ozs7QUFhRDs7Ozs7Ozs7OztJQUFBLE1BS2EsbUJBQW1COzs7Ozs7Ozs7O1FBUzlCLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFFakI7WUFDQyxPQUFPO2dCQUNMLFFBQVEsRUFBRSxtQkFBbUI7Z0JBQzdCLFNBQVMsRUFBRTtvQkFDVCxFQUFDLE9BQU8sRUFBRSxrQ0FBa0MsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLDRCQUE0QixFQUFDO2lCQUMzRjthQUNGLENBQUM7UUFDSixDQUFDOzs7Z0JBdkJGLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztvQkFDMUMsU0FBUyxFQUFFLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDO29CQUM5QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQztpQkFDakU7OzhFQUNZLG1CQUFtQjs0SUFBbkIsbUJBQW1CLG1CQUhuQixDQUFDLFdBQVcsRUFBRSxvQkFBb0IsQ0FBQyxZQUNwQyx5QkFBeUI7OEJBM0NyQztLQWdFQztTQW5CWSxtQkFBbUI7d0ZBQW5CLG1CQUFtQixzSUFGcEIseUJBQXlCO2tEQUV4QixtQkFBbUI7Y0FML0IsUUFBUTtlQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixDQUFDO2dCQUMxQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLEVBQUUsb0JBQW9CLENBQUM7Z0JBQzlDLE9BQU8sRUFBRSxDQUFDLHlCQUF5QixFQUFFLDBCQUEwQixDQUFDO2FBQ2pFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlLCBOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HLCBSRUFDVElWRV9EUklWRU5fRElSRUNUSVZFUywgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVN9IGZyb20gJy4vZGlyZWN0aXZlcyc7XG5pbXBvcnQge1JhZGlvQ29udHJvbFJlZ2lzdHJ5fSBmcm9tICcuL2RpcmVjdGl2ZXMvcmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge0Zvcm1CdWlsZGVyfSBmcm9tICcuL2Zvcm1fYnVpbGRlcic7XG5cbi8qKlxuICogRXhwb3J0cyB0aGUgcmVxdWlyZWQgcHJvdmlkZXJzIGFuZCBkaXJlY3RpdmVzIGZvciB0ZW1wbGF0ZS1kcml2ZW4gZm9ybXMsXG4gKiBtYWtpbmcgdGhlbSBhdmFpbGFibGUgZm9yIGltcG9ydCBieSBOZ01vZHVsZXMgdGhhdCBpbXBvcnQgdGhpcyBtb2R1bGUuXG4gKlxuICogQHNlZSBbRm9ybXMgT3ZlcnZpZXddKC9ndWlkZS9mb3Jtcy1vdmVydmlldylcbiAqIEBzZWUgW1RlbXBsYXRlLWRyaXZlbiBGb3JtcyBHdWlkZV0oL2d1aWRlL2Zvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFUyxcbiAgcHJvdmlkZXJzOiBbUmFkaW9Db250cm9sUmVnaXN0cnldLFxuICBleHBvcnRzOiBbSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1zTW9kdWxlIHtcbn1cblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBpbmZyYXN0cnVjdHVyZSBhbmQgZGlyZWN0aXZlcyBmb3IgcmVhY3RpdmUgZm9ybXMsXG4gKiBtYWtpbmcgdGhlbSBhdmFpbGFibGUgZm9yIGltcG9ydCBieSBOZ01vZHVsZXMgdGhhdCBpbXBvcnQgdGhpcyBtb2R1bGUuXG4gKlxuICogQHNlZSBbRm9ybXMgT3ZlcnZpZXddKGd1aWRlL2Zvcm1zLW92ZXJ2aWV3KVxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVNdLFxuICBwcm92aWRlcnM6IFtGb3JtQnVpbGRlciwgUmFkaW9Db250cm9sUmVnaXN0cnldLFxuICBleHBvcnRzOiBbSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIFJlYWN0aXZlRm9ybXNNb2R1bGUge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFByb3ZpZGVzIG9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIHRoZSByZWFjdGl2ZSBmb3JtcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIEFuIG9iamVjdCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogKiBgd2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbGAgQ29uZmlndXJlcyB3aGVuIHRvIGVtaXQgYSB3YXJuaW5nIHdoZW4gYW4gYG5nTW9kZWxgXG4gICAqIGJpbmRpbmcgaXMgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm0gZGlyZWN0aXZlcy5cbiAgICovXG4gIHN0YXRpYyB3aXRoQ29uZmlnKG9wdHM6IHtcbiAgICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi8gd2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbDogJ25ldmVyJ3wnb25jZSd8J2Fsd2F5cydcbiAgfSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UmVhY3RpdmVGb3Jtc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORywgdXNlVmFsdWU6IG9wdHMud2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbH1cbiAgICAgIF1cbiAgICB9O1xuICB9XG59XG4iXX0=