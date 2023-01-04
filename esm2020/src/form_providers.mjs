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
export class FormsModule {
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
}
FormsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: FormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FormsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: FormsModule, declarations: [i1.NgModel, i2.NgModelGroup, i3.NgForm], exports: [InternalFormsSharedModule, i1.NgModel, i2.NgModelGroup, i3.NgForm] });
FormsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: FormsModule, imports: [InternalFormsSharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: FormsModule, decorators: [{
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
export class ReactiveFormsModule {
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
}
ReactiveFormsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: ReactiveFormsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ReactiveFormsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: ReactiveFormsModule, declarations: [i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName], exports: [InternalFormsSharedModule, i4.FormControlDirective, i5.FormGroupDirective, i6.FormControlName, i7.FormGroupName, i7.FormArrayName] });
ReactiveFormsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: ReactiveFormsModule, imports: [InternalFormsSharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.4+sha-7bbe492", ngImport: i0, type: ReactiveFormsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                    exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9wcm92aWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybV9wcm92aWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFzQixRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFNUQsT0FBTyxFQUFDLHlCQUF5QixFQUFFLGtDQUFrQyxFQUFFLDBCQUEwQixFQUFFLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ25KLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSx1QkFBdUIsRUFBeUIsTUFBTSxxQkFBcUIsQ0FBQzs7Ozs7Ozs7O0FBRTdHOzs7Ozs7Ozs7OztHQVdHO0FBS0gsTUFBTSxPQUFPLFdBQVc7SUFDdEI7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFFakI7UUFDQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLFdBQVc7WUFDckIsU0FBUyxFQUFFLENBQUM7b0JBQ1YsT0FBTyxFQUFFLHVCQUF1QjtvQkFDaEMsUUFBUSxFQUFFLElBQUksQ0FBQyxvQkFBb0IsSUFBSSx1QkFBdUI7aUJBQy9ELENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQzs7bUhBbkJVLFdBQVc7b0hBQVgsV0FBVyxvRUFGWix5QkFBeUI7b0hBRXhCLFdBQVcsWUFGWix5QkFBeUI7c0dBRXhCLFdBQVc7a0JBSnZCLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLDBCQUEwQjtvQkFDeEMsT0FBTyxFQUFFLENBQUMseUJBQXlCLEVBQUUsMEJBQTBCLENBQUM7aUJBQ2pFOztBQXVCRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFLSCxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCOzs7Ozs7Ozs7T0FTRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFJQztRQUNqQixPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsT0FBTyxFQUFFLGtDQUFrQztvQkFDM0MsUUFBUSxFQUFFLElBQUksQ0FBQyw0QkFBNEIsSUFBSSxRQUFRO2lCQUN4RDtnQkFDRDtvQkFDRSxPQUFPLEVBQUUsdUJBQXVCO29CQUNoQyxRQUFRLEVBQUUsSUFBSSxDQUFDLG9CQUFvQixJQUFJLHVCQUF1QjtpQkFDL0Q7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzsySEE3QlUsbUJBQW1COzRIQUFuQixtQkFBbUIsb0lBRnBCLHlCQUF5Qjs0SEFFeEIsbUJBQW1CLFlBRnBCLHlCQUF5QjtzR0FFeEIsbUJBQW1CO2tCQUovQixRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxDQUFDLDBCQUEwQixDQUFDO29CQUMxQyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSwwQkFBMEIsQ0FBQztpQkFDakUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORywgUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVMsIFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTfSBmcm9tICcuL2RpcmVjdGl2ZXMnO1xuaW1wb3J0IHtDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSwgc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHQsIFNldERpc2FibGVkU3RhdGVPcHRpb259IGZyb20gJy4vZGlyZWN0aXZlcy9zaGFyZWQnO1xuXG4vKipcbiAqIEV4cG9ydHMgdGhlIHJlcXVpcmVkIHByb3ZpZGVycyBhbmQgZGlyZWN0aXZlcyBmb3IgdGVtcGxhdGUtZHJpdmVuIGZvcm1zLFxuICogbWFraW5nIHRoZW0gYXZhaWxhYmxlIGZvciBpbXBvcnQgYnkgTmdNb2R1bGVzIHRoYXQgaW1wb3J0IHRoaXMgbW9kdWxlLlxuICpcbiAqIFByb3ZpZGVycyBhc3NvY2lhdGVkIHdpdGggdGhpcyBtb2R1bGU6XG4gKiAqIGBSYWRpb0NvbnRyb2xSZWdpc3RyeWBcbiAqXG4gKiBAc2VlIFtGb3JtcyBPdmVydmlld10oL2d1aWRlL2Zvcm1zLW92ZXJ2aWV3KVxuICogQHNlZSBbVGVtcGxhdGUtZHJpdmVuIEZvcm1zIEd1aWRlXSgvZ3VpZGUvZm9ybXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFRFTVBMQVRFX0RSSVZFTl9ESVJFQ1RJVkVTLFxuICBleHBvcnRzOiBbSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZSwgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVNdXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1zTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgZm9ybXMgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBBbiBvYmplY3Qgb2YgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqICogYGNhbGxTZXREaXNhYmxlZFN0YXRlYCBDb25maWd1cmVzIHdoZXRoZXIgdG8gYGFsd2F5c2AgY2FsbCBgc2V0RGlzYWJsZWRTdGF0ZWAsIHdoaWNoIGlzIG1vcmVcbiAgICogY29ycmVjdCwgb3IgdG8gb25seSBjYWxsIGl0IGB3aGVuRGlzYWJsZWRgLCB3aGljaCBpcyB0aGUgbGVnYWN5IGJlaGF2aW9yLlxuICAgKi9cbiAgc3RhdGljIHdpdGhDb25maWcob3B0czoge1xuICAgIGNhbGxTZXREaXNhYmxlZFN0YXRlPzogU2V0RGlzYWJsZWRTdGF0ZU9wdGlvbixcbiAgfSk6IE1vZHVsZVdpdGhQcm92aWRlcnM8UmVhY3RpdmVGb3Jtc01vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogRm9ybXNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFt7XG4gICAgICAgIHByb3ZpZGU6IENBTExfU0VUX0RJU0FCTEVEX1NUQVRFLFxuICAgICAgICB1c2VWYWx1ZTogb3B0cy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSA/PyBzZXREaXNhYmxlZFN0YXRlRGVmYXVsdFxuICAgICAgfV1cbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogRXhwb3J0cyB0aGUgcmVxdWlyZWQgaW5mcmFzdHJ1Y3R1cmUgYW5kIGRpcmVjdGl2ZXMgZm9yIHJlYWN0aXZlIGZvcm1zLFxuICogbWFraW5nIHRoZW0gYXZhaWxhYmxlIGZvciBpbXBvcnQgYnkgTmdNb2R1bGVzIHRoYXQgaW1wb3J0IHRoaXMgbW9kdWxlLlxuICpcbiAqIFByb3ZpZGVycyBhc3NvY2lhdGVkIHdpdGggdGhpcyBtb2R1bGU6XG4gKiAqIGBGb3JtQnVpbGRlcmBcbiAqICogYFJhZGlvQ29udHJvbFJlZ2lzdHJ5YFxuICpcbiAqIEBzZWUgW0Zvcm1zIE92ZXJ2aWV3XShndWlkZS9mb3Jtcy1vdmVydmlldylcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1JFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXSxcbiAgZXhwb3J0czogW0ludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUsIFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTXVxufSlcbmV4cG9ydCBjbGFzcyBSZWFjdGl2ZUZvcm1zTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBQcm92aWRlcyBvcHRpb25zIGZvciBjb25maWd1cmluZyB0aGUgcmVhY3RpdmUgZm9ybXMgbW9kdWxlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0cyBBbiBvYmplY3Qgb2YgY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqICogYHdhcm5Pbk5nTW9kZWxXaXRoRm9ybUNvbnRyb2xgIENvbmZpZ3VyZXMgd2hlbiB0byBlbWl0IGEgd2FybmluZyB3aGVuIGFuIGBuZ01vZGVsYFxuICAgKiBiaW5kaW5nIGlzIHVzZWQgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXMuXG4gICAqICogYGNhbGxTZXREaXNhYmxlZFN0YXRlYCBDb25maWd1cmVzIHdoZXRoZXIgdG8gYGFsd2F5c2AgY2FsbCBgc2V0RGlzYWJsZWRTdGF0ZWAsIHdoaWNoIGlzIG1vcmVcbiAgICogY29ycmVjdCwgb3IgdG8gb25seSBjYWxsIGl0IGB3aGVuRGlzYWJsZWRgLCB3aGljaCBpcyB0aGUgbGVnYWN5IGJlaGF2aW9yLlxuICAgKi9cbiAgc3RhdGljIHdpdGhDb25maWcob3B0czoge1xuICAgICAgICAgICAgICAgICAgICAvKiogQGRlcHJlY2F0ZWQgYXMgb2YgdjYgKi8gd2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbD86ICduZXZlcid8J29uY2UnfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhbHdheXMnLFxuICAgICAgICAgICAgICAgICAgICBjYWxsU2V0RGlzYWJsZWRTdGF0ZT86IFNldERpc2FibGVkU3RhdGVPcHRpb24sXG4gICAgICAgICAgICAgICAgICAgIH0pOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFJlYWN0aXZlRm9ybXNNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFJlYWN0aXZlRm9ybXNNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcsXG4gICAgICAgICAgdXNlVmFsdWU6IG9wdHMud2Fybk9uTmdNb2RlbFdpdGhGb3JtQ29udHJvbCA/PyAnYWx3YXlzJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQ0FMTF9TRVRfRElTQUJMRURfU1RBVEUsXG4gICAgICAgICAgdXNlVmFsdWU6IG9wdHMuY2FsbFNldERpc2FibGVkU3RhdGUgPz8gc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHRcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cbn1cbiJdfQ==