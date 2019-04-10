/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
export const CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => CheckboxControlValueAccessor)),
    multi: true,
};
/**
 * \@description
 * A `ControlValueAccessor` for writing a value and listening to changes on a checkbox input
 * element.
 *
 * \@usageNotes
 *
 * ### Using a checkbox with a reactive form.
 *
 * The following example shows how to use a checkbox with a reactive form.
 *
 * ```ts
 * const rememberLoginControl = new FormControl();
 * ```
 *
 * ```
 * <input type="checkbox" [formControl]="rememberLoginControl">
 * ```
 *
 * \@ngModule ReactiveFormsModule
 * \@ngModule FormsModule
 * \@publicApi
 */
export class CheckboxControlValueAccessor {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * \@description
         * The registered callback function called when a change event occurs on the input element.
         */
        this.onChange = (/**
         * @param {?} _
         * @return {?}
         */
        (_) => { });
        /**
         * \@description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = (/**
         * @return {?}
         */
        () => { });
    }
    /**
     * Sets the "checked" property on the input element.
     *
     * @param {?} value The checked value
     * @return {?}
     */
    writeValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'checked', value);
    }
    /**
     * \@description
     * Registers a function called when the control value changes.
     *
     * @param {?} fn The callback function
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * \@description
     * Registers a function called when the control is touched.
     *
     * @param {?} fn The callback function
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * Sets the "disabled" property on the input element.
     *
     * @param {?} isDisabled The disabled value
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}
CheckboxControlValueAccessor.decorators = [
    { type: Directive, args: [{
                selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
                host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
                providers: [CHECKBOX_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
CheckboxControlValueAccessor.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
/** @nocollapse */ CheckboxControlValueAccessor.ngDirectiveDef = i0.ΔdefineDirective({ type: CheckboxControlValueAccessor, selectors: [["input", "type", "checkbox", "formControlName", ""], ["input", "type", "checkbox", "formControl", ""], ["input", "type", "checkbox", "ngModel", ""]], factory: function CheckboxControlValueAccessor_Factory(t) { return new (t || CheckboxControlValueAccessor)(i0.ΔdirectiveInject(i0.Renderer2), i0.ΔdirectiveInject(i0.ElementRef)); }, hostBindings: function CheckboxControlValueAccessor_HostBindings(rf, ctx, elIndex) { if (rf & 1) {
        i0.Δlistener("change", function CheckboxControlValueAccessor_change_HostBindingHandler($event) { return ctx.onChange($event.target.checked); });
        i0.Δlistener("blur", function CheckboxControlValueAccessor_blur_HostBindingHandler($event) { return ctx.onTouched(); });
    } }, features: [i0.ΔProvidersFeature([CHECKBOX_VALUE_ACCESSOR])] });
/*@__PURE__*/ i0.ɵsetClassMetadata(CheckboxControlValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
                host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
                providers: [CHECKBOX_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; }, null);
if (false) {
    /**
     * \@description
     * The registered callback function called when a change event occurs on the input element.
     * @type {?}
     */
    CheckboxControlValueAccessor.prototype.onChange;
    /**
     * \@description
     * The registered callback function called when a blur event occurs on the input element.
     * @type {?}
     */
    CheckboxControlValueAccessor.prototype.onTouched;
    /**
     * @type {?}
     * @private
     */
    CheckboxControlValueAccessor.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    CheckboxControlValueAccessor.prototype._elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib3hfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9jaGVja2JveF92YWx1ZV9hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUzRSxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7Ozs7Ozs7Ozs7QUFFakYsTUFBTSxPQUFPLHVCQUF1QixHQUFRO0lBQzFDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVU7OztJQUFDLEdBQUcsRUFBRSxDQUFDLDRCQUE0QixFQUFDO0lBQzNELEtBQUssRUFBRSxJQUFJO0NBQ1o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQStCRCxNQUFNLE9BQU8sNEJBQTRCOzs7OztJQWF2QyxZQUFvQixTQUFvQixFQUFVLFdBQXVCO1FBQXJELGNBQVMsR0FBVCxTQUFTLENBQVc7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBWTs7Ozs7UUFSekUsYUFBUTs7OztRQUFHLENBQUMsQ0FBTSxFQUFFLEVBQUUsR0FBRSxDQUFDLEVBQUM7Ozs7O1FBTTFCLGNBQVM7OztRQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsRUFBQztJQUV1RCxDQUFDOzs7Ozs7O0lBTzdFLFVBQVUsQ0FBQyxLQUFVO1FBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvRSxDQUFDOzs7Ozs7OztJQVFELGdCQUFnQixDQUFDLEVBQWtCLElBQVUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7Ozs7OztJQVFsRSxpQkFBaUIsQ0FBQyxFQUFZLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7Ozs7O0lBTzlELGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNyRixDQUFDOzs7WUFyREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFDSix1R0FBdUc7Z0JBQzNHLElBQUksRUFBRSxFQUFDLFVBQVUsRUFBRSxpQ0FBaUMsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFDO2dCQUM5RSxTQUFTLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQzthQUNyQzs7OztZQXRDOEIsU0FBUztZQUFyQixVQUFVOzswRUF1Q2hCLDRCQUE0QixrUEFBNUIsNEJBQTRCOzs7eUNBRjVCLENBQUMsdUJBQXVCLENBQUM7bUNBRXpCLDRCQUE0QjtjQU54QyxTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUNKLHVHQUF1RztnQkFDM0csSUFBSSxFQUFFLEVBQUMsVUFBVSxFQUFFLGlDQUFpQyxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUM7Z0JBQzlFLFNBQVMsRUFBRSxDQUFDLHVCQUF1QixDQUFDO2FBQ3JDOzs7Ozs7OztJQU1DLGdEQUEwQjs7Ozs7O0lBTTFCLGlEQUFxQjs7Ozs7SUFFVCxpREFBNEI7Ozs7O0lBQUUsbURBQStCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBmb3J3YXJkUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5cbmV4cG9ydCBjb25zdCBDSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQ2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3NvciksXG4gIG11bHRpOiB0cnVlLFxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyBhIHZhbHVlIGFuZCBsaXN0ZW5pbmcgdG8gY2hhbmdlcyBvbiBhIGNoZWNrYm94IGlucHV0XG4gKiBlbGVtZW50LlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIGEgY2hlY2tib3ggd2l0aCBhIHJlYWN0aXZlIGZvcm0uXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgYSBjaGVja2JveCB3aXRoIGEgcmVhY3RpdmUgZm9ybS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgcmVtZW1iZXJMb2dpbkNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAqIGBgYFxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIFtmb3JtQ29udHJvbF09XCJyZW1lbWJlckxvZ2luQ29udHJvbFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXRbdHlwZT1jaGVja2JveF1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPWNoZWNrYm94XVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1jaGVja2JveF1bbmdNb2RlbF0nLFxuICBob3N0OiB7JyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQuY2hlY2tlZCknLCAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJ30sXG4gIHByb3ZpZGVyczogW0NIRUNLQk9YX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgY2hhbmdlIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGJsdXIgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJjaGVja2VkXCIgcHJvcGVydHkgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgY2hlY2tlZCB2YWx1ZVxuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnY2hlY2tlZCcsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4ge30pOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCBpcyB0b3VjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImRpc2FibGVkXCIgcHJvcGVydHkgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFRoZSBkaXNhYmxlZCB2YWx1ZVxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxufVxuIl19