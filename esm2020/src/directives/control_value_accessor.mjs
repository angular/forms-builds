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
class BaseControlValueAccessor {
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
BaseControlValueAccessor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.2+sha-ed110a0", ngImport: i0, type: BaseControlValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
BaseControlValueAccessor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.2+sha-ed110a0", type: BaseControlValueAccessor, ngImport: i0 });
export { BaseControlValueAccessor };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.2+sha-ed110a0", ngImport: i0, type: BaseControlValueAccessor, decorators: [{
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
class BuiltInControlValueAccessor extends BaseControlValueAccessor {
}
BuiltInControlValueAccessor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.2+sha-ed110a0", ngImport: i0, type: BuiltInControlValueAccessor, deps: null, target: i0.ɵɵFactoryTarget.Directive });
BuiltInControlValueAccessor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.2+sha-ed110a0", type: BuiltInControlValueAccessor, usesInheritance: true, ngImport: i0 });
export { BuiltInControlValueAccessor };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.2+sha-ed110a0", ngImport: i0, type: BuiltInControlValueAccessor, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUE2SC9FOzs7Ozs7R0FNRztBQUNILE1BQ2Esd0JBQXdCO0lBY25DLFlBQW9CLFNBQW9CLEVBQVUsV0FBdUI7UUFBckQsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBYnpFOzs7O1dBSUc7UUFDSCxhQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUUxQjs7O1dBR0c7UUFDSCxjQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBRXVELENBQUM7SUFFN0U7Ozs7T0FJRztJQUNPLFdBQVcsQ0FBQyxHQUFXLEVBQUUsS0FBVTtRQUMzQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOzs7T0FHRztJQUNILGlCQUFpQixDQUFDLEVBQWM7UUFDOUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdCQUFnQixDQUFDLEVBQWtCO1FBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxnQkFBZ0IsQ0FBQyxVQUFtQjtRQUNsQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMzQyxDQUFDOztnSUEvQ1Usd0JBQXdCO29IQUF4Qix3QkFBd0I7U0FBeEIsd0JBQXdCO3NHQUF4Qix3QkFBd0I7a0JBRHBDLFNBQVM7O0FBbURWOzs7Ozs7OztHQVFHO0FBQ0gsTUFDYSwyQkFBNEIsU0FBUSx3QkFBd0I7O21JQUE1RCwyQkFBMkI7dUhBQTNCLDJCQUEyQjtTQUEzQiwyQkFBMkI7c0dBQTNCLDJCQUEyQjtrQkFEdkMsU0FBUzs7QUFJVjs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FDMUIsSUFBSSxjQUFjLENBQXNDLGlCQUFpQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdGlvblRva2VuLCBSZW5kZXJlcjJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGVmaW5lcyBhbiBpbnRlcmZhY2UgdGhhdCBhY3RzIGFzIGEgYnJpZGdlIGJldHdlZW4gdGhlIEFuZ3VsYXIgZm9ybXMgQVBJIGFuZCBhXG4gKiBuYXRpdmUgZWxlbWVudCBpbiB0aGUgRE9NLlxuICpcbiAqIEltcGxlbWVudCB0aGlzIGludGVyZmFjZSB0byBjcmVhdGUgYSBjdXN0b20gZm9ybSBjb250cm9sIGRpcmVjdGl2ZVxuICogdGhhdCBpbnRlZ3JhdGVzIHdpdGggQW5ndWxhciBmb3Jtcy5cbiAqXG4gKiBAc2VlIERlZmF1bHRWYWx1ZUFjY2Vzc29yXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBXcml0ZXMgYSBuZXcgdmFsdWUgdG8gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIHRvIHdyaXRlIHRvIHRoZSB2aWV3IHdoZW4gcHJvZ3JhbW1hdGljXG4gICAqIGNoYW5nZXMgZnJvbSBtb2RlbCB0byB2aWV3IGFyZSByZXF1ZXN0ZWQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBXcml0ZSBhIHZhbHVlIHRvIHRoZSBlbGVtZW50XG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSB3cml0ZXMgYSB2YWx1ZSB0byB0aGUgbmF0aXZlIERPTSBlbGVtZW50LlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICogICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHZhbHVlKTtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIG9iaiBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZWxlbWVudFxuICAgKi9cbiAgd3JpdGVWYWx1ZShvYmo6IGFueSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sJ3MgdmFsdWVcbiAgICogY2hhbmdlcyBpbiB0aGUgVUkuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIG9uIGluaXRpYWxpemF0aW9uIHRvIHVwZGF0ZSB0aGUgZm9ybVxuICAgKiBtb2RlbCB3aGVuIHZhbHVlcyBwcm9wYWdhdGUgZnJvbSB0aGUgdmlldyB0byB0aGUgbW9kZWwuXG4gICAqXG4gICAqIFdoZW4gaW1wbGVtZW50aW5nIHRoZSBgcmVnaXN0ZXJPbkNoYW5nZWAgbWV0aG9kIGluIHlvdXIgb3duIHZhbHVlIGFjY2Vzc29yLFxuICAgKiBzYXZlIHRoZSBnaXZlbiBmdW5jdGlvbiBzbyB5b3VyIGNsYXNzIGNhbGxzIGl0IGF0IHRoZSBhcHByb3ByaWF0ZSB0aW1lLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU3RvcmUgdGhlIGNoYW5nZSBmdW5jdGlvblxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc3RvcmVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBhcyBhbiBpbnRlcm5hbCBtZXRob2QuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICogICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBXaGVuIHRoZSB2YWx1ZSBjaGFuZ2VzIGluIHRoZSBVSSwgY2FsbCB0aGUgcmVnaXN0ZXJlZFxuICAgKiBmdW5jdGlvbiB0byBhbGxvdyB0aGUgZm9ybXMgQVBJIHRvIHVwZGF0ZSBpdHNlbGY6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGhvc3Q6IHtcbiAgICogICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKSdcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byByZWdpc3RlclxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgb24gaW5pdGlhbGl6YXRpb25cbiAgICogdG8gdXBkYXRlIHRoZSBmb3JtIG1vZGVsIG9uIGJsdXIuXG4gICAqXG4gICAqIFdoZW4gaW1wbGVtZW50aW5nIGByZWdpc3Rlck9uVG91Y2hlZGAgaW4geW91ciBvd24gdmFsdWUgYWNjZXNzb3IsIHNhdmUgdGhlIGdpdmVuXG4gICAqIGZ1bmN0aW9uIHNvIHlvdXIgY2xhc3MgY2FsbHMgaXQgd2hlbiB0aGUgY29udHJvbCBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgKiBibHVycmVkIG9yIFwidG91Y2hlZFwiLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU3RvcmUgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzdG9yZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIGFzIGFuIGludGVybmFsIG1ldGhvZC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgKiAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBPbiBibHVyIChvciBlcXVpdmFsZW50KSwgeW91ciBjbGFzcyBzaG91bGQgY2FsbCB0aGUgcmVnaXN0ZXJlZCBmdW5jdGlvbiB0byBhbGxvd1xuICAgKiB0aGUgZm9ybXMgQVBJIHRvIHVwZGF0ZSBpdHNlbGY6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGhvc3Q6IHtcbiAgICogICAgJyhibHVyKSc6ICdfb25Ub3VjaGVkKCknXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gcmVnaXN0ZXJcbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSB3aGVuIHRoZSBjb250cm9sIHN0YXR1cyBjaGFuZ2VzIHRvXG4gICAqIG9yIGZyb20gJ0RJU0FCTEVEJy4gRGVwZW5kaW5nIG9uIHRoZSBzdGF0dXMsIGl0IGVuYWJsZXMgb3IgZGlzYWJsZXMgdGhlXG4gICAqIGFwcHJvcHJpYXRlIERPTSBlbGVtZW50LlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBUaGUgZm9sbG93aW5nIGlzIGFuIGV4YW1wbGUgb2Ygd3JpdGluZyB0aGUgZGlzYWJsZWQgcHJvcGVydHkgdG8gYSBuYXRpdmUgRE9NIGVsZW1lbnQ6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgKiAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFRoZSBkaXNhYmxlZCBzdGF0dXMgdG8gc2V0IG9uIHRoZSBlbGVtZW50XG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlPyhpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZDtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgQ29udHJvbFZhbHVlQWNjZXNzb3IgY2xhc3NlcyBkZWZpbmVkIGluIEZvcm1zIHBhY2thZ2UuXG4gKiBDb250YWlucyBjb21tb24gbG9naWMgYW5kIHV0aWxpdHkgZnVuY3Rpb25zLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgYW4gKmludGVybmFsLW9ubHkqIGNsYXNzIGFuZCBzaG91bGQgbm90IGJlIGV4dGVuZGVkIG9yIHVzZWQgZGlyZWN0bHkgaW5cbiAqIGFwcGxpY2F0aW9ucyBjb2RlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBjaGFuZ2Ugb3IgaW5wdXQgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dFxuICAgKiBlbGVtZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgYmx1ciBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0aGF0IHNldHMgYSBwcm9wZXJ0eSBvbiBhIHRhcmdldCBlbGVtZW50IHVzaW5nIHRoZSBjdXJyZW50IFJlbmRlcmVyXG4gICAqIGltcGxlbWVudGF0aW9uLlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHByb3RlY3RlZCBzZXRQcm9wZXJ0eShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwga2V5LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICogQG5vZG9jXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICogQG5vZG9jXG4gICAqL1xuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImRpc2FibGVkXCIgcHJvcGVydHkgb24gdGhlIHJhbmdlIGlucHV0IGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zZXRQcm9wZXJ0eSgnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGFsbCBidWlsdC1pbiBDb250cm9sVmFsdWVBY2Nlc3NvciBjbGFzc2VzIChleGNlcHQgRGVmYXVsdFZhbHVlQWNjZXNzb3IsIHdoaWNoIGlzXG4gKiB1c2VkIGluIGNhc2Ugbm8gb3RoZXIgQ1ZBcyBjYW4gYmUgZm91bmQpLiBXZSB1c2UgdGhpcyBjbGFzcyB0byBkaXN0aW5ndWlzaCBiZXR3ZWVuIGRlZmF1bHQgQ1ZBLFxuICogYnVpbHQtaW4gQ1ZBcyBhbmQgY3VzdG9tIENWQXMsIHNvIHRoYXQgRm9ybXMgbG9naWMgY2FuIHJlY29nbml6ZSBidWlsdC1pbiBDVkFzIGFuZCB0cmVhdCBjdXN0b21cbiAqIG9uZXMgd2l0aCBoaWdoZXIgcHJpb3JpdHkgKHdoZW4gYm90aCBidWlsdC1pbiBhbmQgY3VzdG9tIENWQXMgYXJlIHByZXNlbnQpLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgYW4gKmludGVybmFsLW9ubHkqIGNsYXNzIGFuZCBzaG91bGQgbm90IGJlIGV4dGVuZGVkIG9yIHVzZWQgZGlyZWN0bHkgaW5cbiAqIGFwcGxpY2F0aW9ucyBjb2RlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xufVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIGZvcm0gY29udHJvbHMuXG4gKlxuICogU2VlIGBEZWZhdWx0VmFsdWVBY2Nlc3NvcmAgZm9yIGhvdyB0byBpbXBsZW1lbnQgb25lLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IE5HX1ZBTFVFX0FDQ0VTU09SID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48UmVhZG9ubHlBcnJheTxDb250cm9sVmFsdWVBY2Nlc3Nvcj4+KCdOZ1ZhbHVlQWNjZXNzb3InKTtcbiJdfQ==