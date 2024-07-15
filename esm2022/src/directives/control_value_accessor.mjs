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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.0+sha-e958fa8", ngImport: i0, type: BaseControlValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.0+sha-e958fa8", type: BaseControlValueAccessor, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.0+sha-e958fa8", ngImport: i0, type: BaseControlValueAccessor, decorators: [{
            type: Directive
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }] });
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.0+sha-e958fa8", ngImport: i0, type: BuiltInControlValueAccessor, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.0+sha-e958fa8", type: BuiltInControlValueAccessor, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.0+sha-e958fa8", ngImport: i0, type: BuiltInControlValueAccessor, decorators: [{
            type: Directive
        }] });
/**
 * Used to provide a `ControlValueAccessor` for form controls.
 *
 * See `DefaultValueAccessor` for how to implement one.
 *
 * @publicApi
 */
export const NG_VALUE_ACCESSOR = new InjectionToken(ngDevMode ? 'NgValueAccessor' : '');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUE2SC9FOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyx3QkFBd0I7SUFjbkMsWUFDVSxTQUFvQixFQUNwQixXQUF1QjtRQUR2QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBZmpDOzs7O1dBSUc7UUFDSCxhQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUUxQjs7O1dBR0c7UUFDSCxjQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBS2xCLENBQUM7SUFFSjs7OztPQUlHO0lBQ08sV0FBVyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUJBQWlCLENBQUMsRUFBYztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsRUFBa0I7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7eUhBbERVLHdCQUF3Qjs2R0FBeEIsd0JBQXdCOztzR0FBeEIsd0JBQXdCO2tCQURwQyxTQUFTOztBQXNEVjs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sT0FBTywyQkFBNEIsU0FBUSx3QkFBd0I7eUhBQTVELDJCQUEyQjs2R0FBM0IsMkJBQTJCOztzR0FBM0IsMkJBQTJCO2tCQUR2QyxTQUFTOztBQUdWOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLElBQUksY0FBYyxDQUNqRCxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdGlvblRva2VuLCBSZW5kZXJlcjJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGVmaW5lcyBhbiBpbnRlcmZhY2UgdGhhdCBhY3RzIGFzIGEgYnJpZGdlIGJldHdlZW4gdGhlIEFuZ3VsYXIgZm9ybXMgQVBJIGFuZCBhXG4gKiBuYXRpdmUgZWxlbWVudCBpbiB0aGUgRE9NLlxuICpcbiAqIEltcGxlbWVudCB0aGlzIGludGVyZmFjZSB0byBjcmVhdGUgYSBjdXN0b20gZm9ybSBjb250cm9sIGRpcmVjdGl2ZVxuICogdGhhdCBpbnRlZ3JhdGVzIHdpdGggQW5ndWxhciBmb3Jtcy5cbiAqXG4gKiBAc2VlIHtAbGluayBEZWZhdWx0VmFsdWVBY2Nlc3Nvcn1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFdyaXRlcyBhIG5ldyB2YWx1ZSB0byB0aGUgZWxlbWVudC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgdG8gd3JpdGUgdG8gdGhlIHZpZXcgd2hlbiBwcm9ncmFtbWF0aWNcbiAgICogY2hhbmdlcyBmcm9tIG1vZGVsIHRvIHZpZXcgYXJlIHJlcXVlc3RlZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFdyaXRlIGEgdmFsdWUgdG8gdGhlIGVsZW1lbnRcbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHdyaXRlcyBhIHZhbHVlIHRvIHRoZSBuYXRpdmUgRE9NIGVsZW1lbnQuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgKiAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gb2JqIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBlbGVtZW50XG4gICAqL1xuICB3cml0ZVZhbHVlKG9iajogYW55KTogdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wncyB2YWx1ZVxuICAgKiBjaGFuZ2VzIGluIHRoZSBVSS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgb24gaW5pdGlhbGl6YXRpb24gdG8gdXBkYXRlIHRoZSBmb3JtXG4gICAqIG1vZGVsIHdoZW4gdmFsdWVzIHByb3BhZ2F0ZSBmcm9tIHRoZSB2aWV3IHRvIHRoZSBtb2RlbC5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgdGhlIGByZWdpc3Rlck9uQ2hhbmdlYCBtZXRob2QgaW4geW91ciBvd24gdmFsdWUgYWNjZXNzb3IsXG4gICAqIHNhdmUgdGhlIGdpdmVuIGZ1bmN0aW9uIHNvIHlvdXIgY2xhc3MgY2FsbHMgaXQgYXQgdGhlIGFwcHJvcHJpYXRlIHRpbWUuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBTdG9yZSB0aGUgY2hhbmdlIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzdG9yZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIGFzIGFuIGludGVybmFsIG1ldGhvZC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgKiAgIHRoaXMuX29uQ2hhbmdlID0gZm47XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIFdoZW4gdGhlIHZhbHVlIGNoYW5nZXMgaW4gdGhlIFVJLCBjYWxsIHRoZSByZWdpc3RlcmVkXG4gICAqIGZ1bmN0aW9uIHRvIGFsbG93IHRoZSBmb3JtcyBBUEkgdG8gdXBkYXRlIGl0c2VsZjpcbiAgICpcbiAgICogYGBgdHNcbiAgICogaG9zdDoge1xuICAgKiAgICAnKGNoYW5nZSknOiAnX29uQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJ1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSBvbiBpbml0aWFsaXphdGlvblxuICAgKiB0byB1cGRhdGUgdGhlIGZvcm0gbW9kZWwgb24gYmx1ci5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgYHJlZ2lzdGVyT25Ub3VjaGVkYCBpbiB5b3VyIG93biB2YWx1ZSBhY2Nlc3Nvciwgc2F2ZSB0aGUgZ2l2ZW5cbiAgICogZnVuY3Rpb24gc28geW91ciBjbGFzcyBjYWxscyBpdCB3aGVuIHRoZSBjb250cm9sIHNob3VsZCBiZSBjb25zaWRlcmVkXG4gICAqIGJsdXJyZWQgb3IgXCJ0b3VjaGVkXCIuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBTdG9yZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHN0b3JlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gYXMgYW4gaW50ZXJuYWwgbWV0aG9kLlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZCB7XG4gICAqICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIE9uIGJsdXIgKG9yIGVxdWl2YWxlbnQpLCB5b3VyIGNsYXNzIHNob3VsZCBjYWxsIHRoZSByZWdpc3RlcmVkIGZ1bmN0aW9uIHRvIGFsbG93XG4gICAqIHRoZSBmb3JtcyBBUEkgdG8gdXBkYXRlIGl0c2VsZjpcbiAgICpcbiAgICogYGBgdHNcbiAgICogaG9zdDoge1xuICAgKiAgICAnKGJsdXIpJzogJ19vblRvdWNoZWQoKSdcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byByZWdpc3RlclxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBGdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIHdoZW4gdGhlIGNvbnRyb2wgc3RhdHVzIGNoYW5nZXMgdG9cbiAgICogb3IgZnJvbSAnRElTQUJMRUQnLiBEZXBlbmRpbmcgb24gdGhlIHN0YXR1cywgaXQgZW5hYmxlcyBvciBkaXNhYmxlcyB0aGVcbiAgICogYXBwcm9wcmlhdGUgRE9NIGVsZW1lbnQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqIFRoZSBmb2xsb3dpbmcgaXMgYW4gZXhhbXBsZSBvZiB3cml0aW5nIHRoZSBkaXNhYmxlZCBwcm9wZXJ0eSB0byBhIG5hdGl2ZSBET00gZWxlbWVudDpcbiAgICpcbiAgICogYGBgdHNcbiAgICogc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAqICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgVGhlIGRpc2FibGVkIHN0YXR1cyB0byBzZXQgb24gdGhlIGVsZW1lbnRcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGU/KGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkO1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBDb250cm9sVmFsdWVBY2Nlc3NvciBjbGFzc2VzIGRlZmluZWQgaW4gRm9ybXMgcGFja2FnZS5cbiAqIENvbnRhaW5zIGNvbW1vbiBsb2dpYyBhbmQgdXRpbGl0eSBmdW5jdGlvbnMuXG4gKlxuICogTm90ZTogdGhpcyBpcyBhbiAqaW50ZXJuYWwtb25seSogY2xhc3MgYW5kIHNob3VsZCBub3QgYmUgZXh0ZW5kZWQgb3IgdXNlZCBkaXJlY3RseSBpblxuICogYXBwbGljYXRpb25zIGNvZGUuXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGNoYW5nZSBvciBpbnB1dCBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0XG4gICAqIGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcblxuICAvKipcbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBibHVyIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogQG5vZG9jXG4gICAqL1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICkge31cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0aGF0IHNldHMgYSBwcm9wZXJ0eSBvbiBhIHRhcmdldCBlbGVtZW50IHVzaW5nIHRoZSBjdXJyZW50IFJlbmRlcmVyXG4gICAqIGltcGxlbWVudGF0aW9uLlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHByb3RlY3RlZCBzZXRQcm9wZXJ0eShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwga2V5LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogQG5vZG9jXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICogQG5vZG9jXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImRpc2FibGVkXCIgcHJvcGVydHkgb24gdGhlIHJhbmdlIGlucHV0IGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zZXRQcm9wZXJ0eSgnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBidWlsdC1pbiBDb250cm9sVmFsdWVBY2Nlc3NvciBjbGFzc2VzIChleGNlcHQgRGVmYXVsdFZhbHVlQWNjZXNzb3IsIHdoaWNoIGlzXG4gKiB1c2VkIGluIGNhc2Ugbm8gb3RoZXIgQ1ZBcyBjYW4gYmUgZm91bmQpLiBXZSB1c2UgdGhpcyBjbGFzcyB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIGRlZmF1bHQgQ1ZBLFxuICogYnVpbHQtaW4gQ1ZBcyBhbmQgY3VzdG9tIENWQXMsIHNvIHRoYXQgRm9ybXMgbG9naWMgY2FuIHJlY29nbml6ZSBidWlsdC1pbiBDVkFzIGFuZCB0cmVhdCBjdXN0b21cbiAqIG9uZXMgd2l0aCBoaWdoZXIgcHJpb3JpdHkgKHdoZW4gYm90aCBidWlsdC1pbiBhbmQgY3VzdG9tIENWQXMgYXJlIHByZXNlbnQpLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgYW4gKmludGVybmFsLW9ubHkqIGNsYXNzIGFuZCBzaG91bGQgbm90IGJlIGV4dGVuZGVkIG9yIHVzZWQgZGlyZWN0bHkgaW5cbiAqIGFwcGxpY2F0aW9ucyBjb2RlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3Ige31cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciBmb3JtIGNvbnRyb2xzLlxuICpcbiAqIFNlZSBgRGVmYXVsdFZhbHVlQWNjZXNzb3JgIGZvciBob3cgdG8gaW1wbGVtZW50IG9uZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBOR19WQUxVRV9BQ0NFU1NPUiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxSZWFkb25seUFycmF5PENvbnRyb2xWYWx1ZUFjY2Vzc29yPj4oXG4gIG5nRGV2TW9kZSA/ICdOZ1ZhbHVlQWNjZXNzb3InIDogJycsXG4pO1xuIl19