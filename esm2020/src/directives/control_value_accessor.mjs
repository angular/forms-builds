/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, InjectionToken, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Base class for all ControlValueAccessor classes defined in Forms package.
 * Contains common logic and utility functions.
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
export class BaseControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * The registered callback function called when a change or input event occurs on the input
         * element.
         * @nodoc
         */
        this.onChange = (_) => { };
        /**
         * The registered callback function called when a blur event occurs on the input element.
         * @nodoc
         */
        this.onTouched = () => { };
    }
    /**
     * Helper method that sets a property on a target element using the current Renderer
     * implementation.
     * @nodoc
     */
    setProperty(key, value) {
        this._renderer.setProperty(this._elementRef.nativeElement, key, value);
    }
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * Sets the "disabled" property on the range input element.
     * @nodoc
     */
    setDisabledState(isDisabled) {
        this.setProperty('disabled', isDisabled);
    }
}
BaseControlValueAccessor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-next.0+sha-3562eb1", ngImport: i0, type: BaseControlValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
BaseControlValueAccessor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-next.0+sha-3562eb1", type: BaseControlValueAccessor, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-next.0+sha-3562eb1", ngImport: i0, type: BaseControlValueAccessor, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }]; } });
/**
 * Base class for all built-in ControlValueAccessor classes (except DefaultValueAccessor, which is
 * used in case no other CVAs can be found). We use this class to distinguish between default CVA,
 * built-in CVAs and custom CVAs, so that Forms logic can recognize built-in CVAs and treat custom
 * ones with higher priority (when both built-in and custom CVAs are present).
 *
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
export class BuiltInControlValueAccessor extends BaseControlValueAccessor {
}
BuiltInControlValueAccessor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-next.0+sha-3562eb1", ngImport: i0, type: BuiltInControlValueAccessor, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BuiltInControlValueAccessor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-next.0+sha-3562eb1", type: BuiltInControlValueAccessor, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-next.0+sha-3562eb1", ngImport: i0, type: BuiltInControlValueAccessor, decorators: [{
            type: Directive
        }] });
/**
 * Used to provide a `ControlValueAccessor` for form controls.
 *
 * See `DefaultValueAccessor` for how to implement one.
 *
 * @publicApi
 */
export const NG_VALUE_ACCESSOR = new InjectionToken('NgValueAccessor');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUE2SC9FOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyx3QkFBd0I7SUFjbkMsWUFBb0IsU0FBb0IsRUFBVSxXQUF1QjtRQUFyRCxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFiekU7Ozs7V0FJRztRQUNILGFBQVEsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBRTFCOzs7V0FHRztRQUNILGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFFdUQsQ0FBQztJQUU3RTs7OztPQUlHO0lBQ08sV0FBVyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUJBQWlCLENBQUMsRUFBYztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsRUFBa0I7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7O2dJQS9DVSx3QkFBd0I7b0hBQXhCLHdCQUF3QjtzR0FBeEIsd0JBQXdCO2tCQURwQyxTQUFTOztBQW1EVjs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sT0FBTywyQkFBNEIsU0FBUSx3QkFBd0I7O21JQUE1RCwyQkFBMkI7dUhBQTNCLDJCQUEyQjtzR0FBM0IsMkJBQTJCO2tCQUR2QyxTQUFTOztBQUlWOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUMxQixJQUFJLGNBQWMsQ0FBc0MsaUJBQWlCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0aW9uVG9rZW4sIFJlbmRlcmVyMn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEZWZpbmVzIGFuIGludGVyZmFjZSB0aGF0IGFjdHMgYXMgYSBicmlkZ2UgYmV0d2VlbiB0aGUgQW5ndWxhciBmb3JtcyBBUEkgYW5kIGFcbiAqIG5hdGl2ZSBlbGVtZW50IGluIHRoZSBET00uXG4gKlxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhIGN1c3RvbSBmb3JtIGNvbnRyb2wgZGlyZWN0aXZlXG4gKiB0aGF0IGludGVncmF0ZXMgd2l0aCBBbmd1bGFyIGZvcm1zLlxuICpcbiAqIEBzZWUgRGVmYXVsdFZhbHVlQWNjZXNzb3JcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFdyaXRlcyBhIG5ldyB2YWx1ZSB0byB0aGUgZWxlbWVudC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgdG8gd3JpdGUgdG8gdGhlIHZpZXcgd2hlbiBwcm9ncmFtbWF0aWNcbiAgICogY2hhbmdlcyBmcm9tIG1vZGVsIHRvIHZpZXcgYXJlIHJlcXVlc3RlZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFdyaXRlIGEgdmFsdWUgdG8gdGhlIGVsZW1lbnRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHdyaXRlcyBhIHZhbHVlIHRvIHRoZSBuYXRpdmUgRE9NIGVsZW1lbnQuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgKiAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBlbGVtZW50XG4gICAqL1xuICB3cml0ZVZhbHVlKG9iajogYW55KTogdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wncyB2YWx1ZVxuICAgKiBjaGFuZ2VzIGluIHRoZSBVSS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgb24gaW5pdGlhbGl6YXRpb24gdG8gdXBkYXRlIHRoZSBmb3JtXG4gICAqIG1vZGVsIHdoZW4gdmFsdWVzIHByb3BhZ2F0ZSBmcm9tIHRoZSB2aWV3IHRvIHRoZSBtb2RlbC5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgdGhlIGByZWdpc3Rlck9uQ2hhbmdlYCBtZXRob2QgaW4geW91ciBvd24gdmFsdWUgYWNjZXNzb3IsXG4gICAqIHNhdmUgdGhlIGdpdmVuIGZ1bmN0aW9uIHNvIHlvdXIgY2xhc3MgY2FsbHMgaXQgYXQgdGhlIGFwcHJvcHJpYXRlIHRpbWUuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBTdG9yZSB0aGUgY2hhbmdlIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzdG9yZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIGFzIGFuIGludGVybmFsIG1ldGhvZC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgKiAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgaW4gdGhlIFVJLCBjYWxsIHRoZSByZWdpc3RlcmVkXG4gICAqIGZ1bmN0aW9uIHRvIGFsbG93IHRoZSBmb3JtcyBBUEkgdG8gdXBkYXRlIGl0c2VsZjpcbiAgICpcbiAgICogYGBgdHNcbiAgICogaG9zdDoge1xuICAgKiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJ1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSBvbiBpbml0aWFsaXphdGlvblxuICAgKiB0byB1cGRhdGUgdGhlIGZvcm0gbW9kZWwgb24gYmx1ci5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgYHJlZ2lzdGVyT25Ub3VjaGVkYCBpbiB5b3VyIG93biB2YWx1ZSBhY2Nlc3Nvciwgc2F2ZSB0aGUgZ2l2ZW5cbiAgICogZnVuY3Rpb24gc28geW91ciBjbGFzcyBjYWxscyBpdCB3aGVuIHRoZSBjb250cm9sIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAqIGJsdXJyZWQgb3IgXCJ0b3VjaGVkXCIuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBTdG9yZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHN0b3JlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gYXMgYW4gaW50ZXJuYWwgbWV0aG9kLlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAqICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIE9uIGJsdXIgKG9yIGVxdWl2YWxlbnQpLCB5b3VyIGNsYXNzIHNob3VsZCBjYWxsIHRoZSByZWdpc3RlcmVkIGZ1bmN0aW9uIHRvIGFsbG93XG4gICAqIHRoZSBmb3JtcyBBUEkgdG8gdXBkYXRlIGl0c2VsZjpcbiAgICpcbiAgICogYGBgdHNcbiAgICogaG9zdDoge1xuICAgKiAgICAnKGJsdXIpJzogJ19vblRvdWNoZWQoKSdcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byByZWdpc3RlclxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIHdoZW4gdGhlIGNvbnRyb2wgc3RhdHVzIGNoYW5nZXMgdG9cbiAgICogb3IgZnJvbSAnRElTQUJMRUQnLiBEZXBlbmRpbmcgb24gdGhlIHN0YXR1cywgaXQgZW5hYmxlcyBvciBkaXNhYmxlcyB0aGVcbiAgICogYXBwcm9wcmlhdGUgRE9NIGVsZW1lbnQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIFRoZSBmb2xsb3dpbmcgaXMgYW4gZXhhbXBsZSBvZiB3cml0aW5nIHRoZSBkaXNhYmxlZCBwcm9wZXJ0eSB0byBhIG5hdGl2ZSBET00gZWxlbWVudDpcbiAgICpcbiAgICogYGBgdHNcbiAgICogc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAqICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgVGhlIGRpc2FibGVkIHN0YXR1cyB0byBzZXQgb24gdGhlIGVsZW1lbnRcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGU/KGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBDb250cm9sVmFsdWVBY2Nlc3NvciBjbGFzc2VzIGRlZmluZWQgaW4gRm9ybXMgcGFja2FnZS5cbiAqIENvbnRhaW5zIGNvbW1vbiBsb2dpYyBhbmQgdXRpbGl0eSBmdW5jdGlvbnMuXG4gKlxuICogTm90ZTogdGhpcyBpcyBhbiAqaW50ZXJuYWwtb25seSogY2xhc3MgYW5kIHNob3VsZCBub3QgYmUgZXh0ZW5kZWQgb3IgdXNlZCBkaXJlY3RseSBpblxuICogYXBwbGljYXRpb25zIGNvZGUuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGNoYW5nZSBvciBpbnB1dCBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0XG4gICAqIGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcblxuICAvKipcbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBibHVyIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogQG5vZG9jXG4gICAqL1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRoYXQgc2V0cyBhIHByb3BlcnR5IG9uIGEgdGFyZ2V0IGVsZW1lbnQgdXNpbmcgdGhlIGN1cnJlbnQgUmVuZGVyZXJcbiAgICogaW1wbGVtZW50YXRpb24uXG4gICAqIEBub2RvY1xuICAgKi9cbiAgcHJvdGVjdGVkIHNldFByb3BlcnR5KGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCBpcyB0b3VjaGVkLlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWQgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBjaGFuZ2VzLlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwiZGlzYWJsZWRcIiBwcm9wZXJ0eSBvbiB0aGUgcmFuZ2UgaW5wdXQgZWxlbWVudC5cbiAgICogQG5vZG9jXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNldFByb3BlcnR5KCdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYWxsIGJ1aWx0LWluIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGNsYXNzZXMgKGV4Y2VwdCBEZWZhdWx0VmFsdWVBY2Nlc3Nvciwgd2hpY2ggaXNcbiAqIHVzZWQgaW4gY2FzZSBubyBvdGhlciBDVkFzIGNhbiBiZSBmb3VuZCkuIFdlIHVzZSB0aGlzIGNsYXNzIHRvIGRpc3Rpbmd1aXNoIGJldHdlZW4gZGVmYXVsdCBDVkEsXG4gKiBidWlsdC1pbiBDVkFzIGFuZCBjdXN0b20gQ1ZBcywgc28gdGhhdCBGb3JtcyBsb2dpYyBjYW4gcmVjb2duaXplIGJ1aWx0LWluIENWQXMgYW5kIHRyZWF0IGN1c3RvbVxuICogb25lcyB3aXRoIGhpZ2hlciBwcmlvcml0eSAod2hlbiBib3RoIGJ1aWx0LWluIGFuZCBjdXN0b20gQ1ZBcyBhcmUgcHJlc2VudCkuXG4gKlxuICogTm90ZTogdGhpcyBpcyBhbiAqaW50ZXJuYWwtb25seSogY2xhc3MgYW5kIHNob3VsZCBub3QgYmUgZXh0ZW5kZWQgb3IgdXNlZCBkaXJlY3RseSBpblxuICogYXBwbGljYXRpb25zIGNvZGUuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciBleHRlbmRzIEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciB7XG59XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3IgZm9ybSBjb250cm9scy5cbiAqXG4gKiBTZWUgYERlZmF1bHRWYWx1ZUFjY2Vzc29yYCBmb3IgaG93IHRvIGltcGxlbWVudCBvbmUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgTkdfVkFMVUVfQUNDRVNTT1IgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxSZWFkb25seUFycmF5PENvbnRyb2xWYWx1ZUFjY2Vzc29yPj4oJ05nVmFsdWVBY2Nlc3NvcicpO1xuIl19