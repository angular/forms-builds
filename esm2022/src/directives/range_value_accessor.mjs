/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef } from '@angular/core';
import { BuiltInControlValueAccessor, NG_VALUE_ACCESSOR } from './control_value_accessor';
import * as i0 from "@angular/core";
const RANGE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RangeValueAccessor),
    multi: true
};
/**
 * @description
 * The `ControlValueAccessor` for writing a range value and listening to range input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a range input with a reactive form
 *
 * The following example shows how to use a range input with a reactive form.
 *
 * ```ts
 * const ageControl = new FormControl();
 * ```
 *
 * ```
 * <input type="range" [formControl]="ageControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class RangeValueAccessor extends BuiltInControlValueAccessor {
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value) {
        this.setProperty('value', parseFloat(value));
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this.onChange = (value) => {
            fn(value == '' ? null : parseFloat(value));
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.0-next.0+sha-2d1691a", ngImport: i0, type: RangeValueAccessor, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.0-next.0+sha-2d1691a", type: RangeValueAccessor, selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]", host: { listeners: { "change": "onChange($event.target.value)", "input": "onChange($event.target.value)", "blur": "onTouched()" } }, providers: [RANGE_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0 }); }
}
export { RangeValueAccessor };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.0-next.0+sha-2d1691a", ngImport: i0, type: RangeValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
                    host: {
                        '(change)': 'onChange($event.target.value)',
                        '(input)': 'onChange($event.target.value)',
                        '(blur)': 'onTouched()'
                    },
                    providers: [RANGE_VALUE_ACCESSOR]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2VfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yYW5nZV92YWx1ZV9hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBVyxNQUFNLGVBQWUsQ0FBQztBQUU5RCxPQUFPLEVBQUMsMkJBQTJCLEVBQXdCLGlCQUFpQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7O0FBRTlHLE1BQU0sb0JBQW9CLEdBQWE7SUFDckMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDO0lBQ2pELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNILE1BVWEsa0JBQW1CLFNBQVEsMkJBQTJCO0lBRWpFOzs7T0FHRztJQUNILFVBQVUsQ0FBQyxLQUFVO1FBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7O09BR0c7SUFDTSxnQkFBZ0IsQ0FBQyxFQUE0QjtRQUNwRCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDeEIsRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDO0lBQ0osQ0FBQzt5SEFsQlUsa0JBQWtCOzZHQUFsQixrQkFBa0IsNFBBRmxCLENBQUMsb0JBQW9CLENBQUM7O1NBRXRCLGtCQUFrQjtzR0FBbEIsa0JBQWtCO2tCQVY5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFDSiw4RkFBOEY7b0JBQ2xHLElBQUksRUFBRTt3QkFDSixVQUFVLEVBQUUsK0JBQStCO3dCQUMzQyxTQUFTLEVBQUUsK0JBQStCO3dCQUMxQyxRQUFRLEVBQUUsYUFBYTtxQkFDeEI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsb0JBQW9CLENBQUM7aUJBQ2xDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBQcm92aWRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5cbmNvbnN0IFJBTkdFX1ZBTFVFX0FDQ0VTU09SOiBQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJhbmdlVmFsdWVBY2Nlc3NvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgYSByYW5nZSB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIHJhbmdlIGlucHV0IGNoYW5nZXMuXG4gKiBUaGUgdmFsdWUgYWNjZXNzb3IgaXMgdXNlZCBieSB0aGUgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYEZvcm1Db250cm9sTmFtZWAsIGFuZCAgYE5nTW9kZWxgXG4gKiBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIGEgcmFuZ2UgaW5wdXQgd2l0aCBhIHJlYWN0aXZlIGZvcm1cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSBhIHJhbmdlIGlucHV0IHdpdGggYSByZWFjdGl2ZSBmb3JtLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBhZ2VDb250cm9sID0gbmV3IEZvcm1Db250cm9sKCk7XG4gKiBgYGBcbiAqXG4gKiBgYGBcbiAqIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBbZm9ybUNvbnRyb2xdPVwiYWdlQ29udHJvbFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXRbdHlwZT1yYW5nZV1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPXJhbmdlXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1yYW5nZV1bbmdNb2RlbF0nLFxuICBob3N0OiB7XG4gICAgJyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGlucHV0KSc6ICdvbkNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhibHVyKSc6ICdvblRvdWNoZWQoKSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbUkFOR0VfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIFJhbmdlVmFsdWVBY2Nlc3NvciBleHRlbmRzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRzXG4gICAgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogU2V0cyB0aGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc2V0UHJvcGVydHkoJ3ZhbHVlJywgcGFyc2VGbG9hdCh2YWx1ZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgb3ZlcnJpZGUgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IG51bWJlcnxudWxsKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9ICh2YWx1ZSkgPT4ge1xuICAgICAgZm4odmFsdWUgPT0gJycgPyBudWxsIDogcGFyc2VGbG9hdCh2YWx1ZSkpO1xuICAgIH07XG4gIH1cbn1cbiJdfQ==