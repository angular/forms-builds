import * as i0 from "@angular/core";
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
import { Directive, ElementRef, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
/** @type {?} */
export const NUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberValueAccessor),
    multi: true
};
/**
 * The accessor for writing a number value and listening to changes that is used by the
 * `NgModel`, `FormControlDirective`, and `FormControlName` directives.
 *
 *  ### Example
 *  ```
 *  <input type="number" [(ngModel)]="age">
 *  ```
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
export class NumberValueAccessor {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        /** @type {?} */
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = (value) => { fn(value == '' ? null : parseFloat(value)); };
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}
NumberValueAccessor.decorators = [
    { type: Directive, args: [{
                selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
                host: {
                    '(change)': 'onChange($event.target.value)',
                    '(input)': 'onChange($event.target.value)',
                    '(blur)': 'onTouched()'
                },
                providers: [NUMBER_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
NumberValueAccessor.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
NumberValueAccessor.ngDirectiveDef = i0.ɵdefineDirective({ type: NumberValueAccessor, selectors: [["input", "type", "number", "formControlName", ""], ["input", "type", "number", "formControl", ""], ["input", "type", "number", "ngModel", ""]], factory: function NumberValueAccessor_Factory() { return new NumberValueAccessor(i0.ɵdirectiveInject(Renderer2), i0.ɵinjectElementRef()); }, hostBindings: function NumberValueAccessor_HostBindings(dirIndex, elIndex) { i0.ɵL("change", function NumberValueAccessor_change_HostBindingHandler($event) { const pd_b = (i0.ɵd(dirIndex).onChange($event.target.value) !== false); return pd_b; }); i0.ɵL("input", function NumberValueAccessor_input_HostBindingHandler($event) { const pd_b = (i0.ɵd(dirIndex).onChange($event.target.value) !== false); return pd_b; }); i0.ɵL("blur", function NumberValueAccessor_blur_HostBindingHandler($event) { const pd_b = (i0.ɵd(dirIndex).onTouched() !== false); return pd_b; }); } });
if (false) {
    /** @type {?} */
    NumberValueAccessor.prototype.onChange;
    /** @type {?} */
    NumberValueAccessor.prototype.onTouched;
    /** @type {?} */
    NumberValueAccessor.prototype._renderer;
    /** @type {?} */
    NumberValueAccessor.prototype._elementRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVtYmVyX3ZhbHVlX2FjY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvbnVtYmVyX3ZhbHVlX2FjY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFM0UsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDOztBQUVqRixhQUFhLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztJQUNsRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7Ozs7Ozs7Ozs7OztBQXVCRixNQUFNOzs7OztJQUlKLFlBQW9CLFNBQW9CLEVBQVUsV0FBdUI7UUFBckQsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO3dCQUg5RCxDQUFDLENBQU0sRUFBRSxFQUFFLElBQUc7eUJBQ2IsR0FBRyxFQUFFLElBQUc7S0FFeUQ7Ozs7O0lBRTdFLFVBQVUsQ0FBQyxLQUFhOztRQUV0QixNQUFNLGVBQWUsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7S0FDdEY7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsRUFBNEI7UUFDM0MsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQzVFOzs7OztJQUNELGlCQUFpQixDQUFDLEVBQWMsSUFBVSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFOzs7OztJQUVoRSxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDcEY7OztZQTdCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUNKLGlHQUFpRztnQkFDckcsSUFBSSxFQUFFO29CQUNKLFVBQVUsRUFBRSwrQkFBK0I7b0JBQzNDLFNBQVMsRUFBRSwrQkFBK0I7b0JBQzFDLFFBQVEsRUFBRSxhQUFhO2lCQUN4QjtnQkFDRCxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQzthQUNuQzs7OztZQTlCOEIsU0FBUztZQUFyQixVQUFVOztpRUErQmhCLG1CQUFtQiw0TkFBbkIsbUJBQW1CLHFCQUlDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcblxuZXhwb3J0IGNvbnN0IE5VTUJFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTnVtYmVyVmFsdWVBY2Nlc3NvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIFRoZSBhY2Nlc3NvciBmb3Igd3JpdGluZyBhIG51bWJlciB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIGNoYW5nZXMgdGhhdCBpcyB1c2VkIGJ5IHRoZVxuICogYE5nTW9kZWxgLCBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBhbmQgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlcy5cbiAqXG4gKiAgIyMjIEV4YW1wbGVcbiAqICBgYGBcbiAqICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIFsobmdNb2RlbCldPVwiYWdlXCI+XG4gKiAgYGBgXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPW51bWJlcl1bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPW51bWJlcl1bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9bnVtYmVyXVtuZ01vZGVsXScsXG4gIGhvc3Q6IHtcbiAgICAnKGNoYW5nZSknOiAnb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoaW5wdXQpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtOVU1CRVJfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE51bWJlclZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgLy8gVGhlIHZhbHVlIG5lZWRzIHRvIGJlIG5vcm1hbGl6ZWQgZm9yIElFOSwgb3RoZXJ3aXNlIGl0IGlzIHNldCB0byAnbnVsbCcgd2hlbiBudWxsXG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCBub3JtYWxpemVkVmFsdWUpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IG51bWJlcnxudWxsKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9ICh2YWx1ZSkgPT4geyBmbih2YWx1ZSA9PSAnJyA/IG51bGwgOiBwYXJzZUZsb2F0KHZhbHVlKSk7IH07XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gIH1cbn1cbiJdfQ==