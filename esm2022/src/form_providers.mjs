/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { InternalFormsSharedModule, NG_MODEL_WITH_FORM_CONTROL_WARNING, REACTIVE_DRIVEN_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES } from './directives';
import { CALL_SET_DISABLED_STATE, setDisabledStateDefault } from './directives/shared';
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
 * Providers associated with this module:
 * * `RadioControlRegistry`
 *
 * @see [Forms Overview](/guide/forms-overview)
 * @see [Template-driven Forms Guide](/guide/forms)
 *
 * @publicApi
 */
class FormsModule {
    /**
     * @description
     * Provides options for configuring the forms module.
     *
     * @param opts An object of configuration options
     * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
     * correct, or to only call it `whenDisabled`, which is the legacy behavior.
     */
    static withConfig(opts) {
        return {
            ngModule: FormsModule,
            providers: [{
                    provide: CALL_SET_DISABLED_STATE,
                    useValue: opts.callSetDisabledState ?? setDisabledStateDefault
                }]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: FormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: FormsModule, declarations: [i1.NgModel, i2.NgModelGroup, i3.NgForm], exports: [InternalFormsSharedModule, i1.NgModel, i2.NgModelGroup, i3.NgForm] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: FormsModule, imports: [InternalFormsSharedModule] }); }
}
export { FormsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: FormsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                    exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
                }]
        }] });
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 *
 * Providers associated with this module:
 * * `FormBuilder`
 * * `RadioControlRegistry`
 *
 * @see [Forms Overview](guide/forms-overview)
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @publicApi
 */
class ReactiveFormsModule {
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
     * correct, or to only call it `whenDisabled`, which is the legacy behavior.
     */
    static withConfig(opts) {
        return {
            ngModule: ReactiveFormsModule,
            providers: [
                {
                    provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
                    useValue: opts.warnOnNgModelWithFormControl ?? 'always'
                },
                {
                    provide: CALL_SET_DISABLED_STATE,
                    useValue: opts.callSetDisabledState ?? setDisabledStateDefault
                }
            ]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: ReactiveFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: ReactiveFormsModule, declarations: [i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName], exports: [InternalFormsSharedModule, i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: ReactiveFormsModule, imports: [InternalFormsSharedModule] }); }
}
export { ReactiveFormsModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.1+sha-5fd4bf6", ngImport: i0, type: ReactiveFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                    exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLGtDQUFrQyxFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ25KLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSx1QkFBdUIsRUFBeUIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7O0FBRTdHOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFJYSxXQUFXO0lBQ3RCOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsVUFBVSxDQUFDLElBRWpCO1FBQ0MsT0FBTztZQUNMLFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFNBQVMsRUFBRSxDQUFDO29CQUNWLE9BQU8sRUFBRSx1QkFBdUI7b0JBQ2hDLFFBQVEsRUFBRSxJQUFJLENBQUMsb0JBQW9CLElBQUksdUJBQXVCO2lCQUMvRCxDQUFDO1NBQ0gsQ0FBQztJQUNKLENBQUM7eUhBbkJVLFdBQVc7MEhBQVgsV0FBVyxvRUFGWix5QkFBeUI7MEhBRXhCLFdBQVcsWUFGWix5QkFBeUI7O1NBRXhCLFdBQVc7c0dBQVgsV0FBVztrQkFKdkIsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsMEJBQTBCO29CQUN4QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQztpQkFDakU7O0FBdUJEOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILE1BSWEsbUJBQW1CO0lBQzlCOzs7Ozs7Ozs7T0FTRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFJQztRQUNqQixPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGtDQUFrQztvQkFDM0MsUUFBUSxFQUFFLElBQUksQ0FBQyw0QkFBNEIsSUFBSSxRQUFRO2lCQUN4RDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsdUJBQXVCO29CQUNoQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixJQUFJLHVCQUF1QjtpQkFDL0Q7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO3lIQTdCVSxtQkFBbUI7MEhBQW5CLG1CQUFtQixvSUFGcEIseUJBQXlCOzBIQUV4QixtQkFBbUIsWUFGcEIseUJBQXlCOztTQUV4QixtQkFBbUI7c0dBQW5CLG1CQUFtQjtrQkFKL0IsUUFBUTttQkFBQztvQkFDUixZQUFZLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztvQkFDMUMsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7aUJBQ2pFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTLCBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFU30gZnJvbSAnLi9kaXJlY3RpdmVzJztcbmltcG9ydCB7Q0FMTF9TRVRfRElTQUJMRURfU1RBVEUsIHNldERpc2FibGVkU3RhdGVEZWZhdWx0LCBTZXREaXNhYmxlZFN0YXRlT3B0aW9ufSBmcm9tICcuL2RpcmVjdGl2ZXMvc2hhcmVkJztcblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBwcm92aWRlcnMgYW5kIGRpcmVjdGl2ZXMgZm9yIHRlbXBsYXRlLWRyaXZlbiBmb3JtcyxcbiAqIG1ha2luZyB0aGVtIGF2YWlsYWJsZSBmb3IgaW1wb3J0IGJ5IE5nTW9kdWxlcyB0aGF0IGltcG9ydCB0aGlzIG1vZHVsZS5cbiAqXG4gKiBQcm92aWRlcnMgYXNzb2NpYXRlZCB3aXRoIHRoaXMgbW9kdWxlOlxuICogKiBgUmFkaW9Db250cm9sUmVnaXN0cnlgXG4gKlxuICogQHNlZSBbRm9ybXMgT3ZlcnZpZXddKC9ndWlkZS9mb3Jtcy1vdmVydmlldylcbiAqIEBzZWUgW1RlbXBsYXRlLWRyaXZlbiBGb3JtcyBHdWlkZV0oL2d1aWRlL2Zvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFUyxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBGb3Jtc01vZHVsZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUHJvdmlkZXMgb3B0aW9ucyBmb3IgY29uZmlndXJpbmcgdGhlIGZvcm1zIG1vZHVsZS5cbiAgICpcbiAgICogQHBhcmFtIG9wdHMgQW4gb2JqZWN0IG9mIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiAqIGBjYWxsU2V0RGlzYWJsZWRTdGF0ZWAgQ29uZmlndXJlcyB3aGV0aGVyIHRvIGBhbHdheXNgIGNhbGwgYHNldERpc2FibGVkU3RhdGVgLCB3aGljaCBpcyBtb3JlXG4gICAqIGNvcnJlY3QsIG9yIHRvIG9ubHkgY2FsbCBpdCBgd2hlbkRpc2FibGVkYCwgd2hpY2ggaXMgdGhlIGxlZ2FjeSBiZWhhdmlvci5cbiAgICovXG4gIHN0YXRpYyB3aXRoQ29uZmlnKG9wdHM6IHtcbiAgICBjYWxsU2V0RGlzYWJsZWRTdGF0ZT86IFNldERpc2FibGVkU3RhdGVPcHRpb24sXG4gIH0pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEZvcm1zTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBGb3Jtc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3tcbiAgICAgICAgcHJvdmlkZTogQ0FMTF9TRVRfRElTQUJMRURfU1RBVEUsXG4gICAgICAgIHVzZVZhbHVlOiBvcHRzLmNhbGxTZXREaXNhYmxlZFN0YXRlID8/IHNldERpc2FibGVkU3RhdGVEZWZhdWx0XG4gICAgICB9XVxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBFeHBvcnRzIHRoZSByZXF1aXJlZCBpbmZyYXN0cnVjdHVyZSBhbmQgZGlyZWN0aXZlcyBmb3IgcmVhY3RpdmUgZm9ybXMsXG4gKiBtYWtpbmcgdGhlbSBhdmFpbGFibGUgZm9yIGltcG9ydCBieSBOZ01vZHVsZXMgdGhhdCBpbXBvcnQgdGhpcyBtb2R1bGUuXG4gKlxuICogUHJvdmlkZXJzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIG1vZHVsZTpcbiAqICogYEZvcm1CdWlsZGVyYFxuICogKiBgUmFkaW9Db250cm9sUmVnaXN0cnlgXG4gKlxuICogQHNlZSBbRm9ybXMgT3ZlcnZpZXddKGd1aWRlL2Zvcm1zLW92ZXJ2aWV3KVxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVNdLFxuICBleHBvcnRzOiBbSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIFJlYWN0aXZlRm9ybXNNb2R1bGUge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFByb3ZpZGVzIG9wdGlvbnMgZm9yIGNvbmZpZ3VyaW5nIHRoZSByZWFjdGl2ZSBmb3JtcyBtb2R1bGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRzIEFuIG9iamVjdCBvZiBjb25maWd1cmF0aW9uIG9wdGlvbnNcbiAgICogKiBgd2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbGAgQ29uZmlndXJlcyB3aGVuIHRvIGVtaXQgYSB3YXJuaW5nIHdoZW4gYW4gYG5nTW9kZWxgXG4gICAqIGJpbmRpbmcgaXMgdXNlZCB3aXRoIHJlYWN0aXZlIGZvcm0gZGlyZWN0aXZlcy5cbiAgICogKiBgY2FsbFNldERpc2FibGVkU3RhdGVgIENvbmZpZ3VyZXMgd2hldGhlciB0byBgYWx3YXlzYCBjYWxsIGBzZXREaXNhYmxlZFN0YXRlYCwgd2hpY2ggaXMgbW9yZVxuICAgKiBjb3JyZWN0LCBvciB0byBvbmx5IGNhbGwgaXQgYHdoZW5EaXNhYmxlZGAsIHdoaWNoIGlzIHRoZSBsZWdhY3kgYmVoYXZpb3IuXG4gICAqL1xuICBzdGF0aWMgd2l0aENvbmZpZyhvcHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqLyB3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sPzogJ25ldmVyJ3wnb25jZSd8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Fsd2F5cycsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxTZXREaXNhYmxlZFN0YXRlPzogU2V0RGlzYWJsZWRTdGF0ZU9wdGlvbixcbiAgICAgICAgICAgICAgICAgICAgfSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UmVhY3RpdmVGb3Jtc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORyxcbiAgICAgICAgICB1c2VWYWx1ZTogb3B0cy53YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sID8/ICdhbHdheXMnXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSxcbiAgICAgICAgICB1c2VWYWx1ZTogb3B0cy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSA/PyBzZXREaXNhYmxlZFN0YXRlRGVmYXVsdFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxufVxuIl19