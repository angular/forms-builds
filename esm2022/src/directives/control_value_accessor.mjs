/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.6+sha-46a2ad3", ngImport: i0, type: BaseControlValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.6+sha-46a2ad3", type: BaseControlValueAccessor, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.6+sha-46a2ad3", ngImport: i0, type: BaseControlValueAccessor, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.6+sha-46a2ad3", ngImport: i0, type: BuiltInControlValueAccessor, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.6+sha-46a2ad3", type: BuiltInControlValueAccessor, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.6+sha-46a2ad3", ngImport: i0, type: BuiltInControlValueAccessor, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUE2SC9FOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyx3QkFBd0I7SUFjbkMsWUFDVSxTQUFvQixFQUNwQixXQUF1QjtRQUR2QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3BCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBZmpDOzs7O1dBSUc7UUFDSCxhQUFRLEdBQUcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUUxQjs7O1dBR0c7UUFDSCxjQUFTLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO0lBS2xCLENBQUM7SUFFSjs7OztPQUlHO0lBQ08sV0FBVyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUJBQWlCLENBQUMsRUFBYztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsRUFBa0I7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7eUhBbERVLHdCQUF3Qjs2R0FBeEIsd0JBQXdCOztzR0FBeEIsd0JBQXdCO2tCQURwQyxTQUFTOztBQXNEVjs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sT0FBTywyQkFBNEIsU0FBUSx3QkFBd0I7eUhBQTVELDJCQUEyQjs2R0FBM0IsMkJBQTJCOztzR0FBM0IsMkJBQTJCO2tCQUR2QyxTQUFTOztBQUdWOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLElBQUksY0FBYyxDQUNqRCxTQUFTLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQ25DLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5kZXYvbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3Rpb25Ub2tlbiwgUmVuZGVyZXIyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERlZmluZXMgYW4gaW50ZXJmYWNlIHRoYXQgYWN0cyBhcyBhIGJyaWRnZSBiZXR3ZWVuIHRoZSBBbmd1bGFyIGZvcm1zIEFQSSBhbmQgYVxuICogbmF0aXZlIGVsZW1lbnQgaW4gdGhlIERPTS5cbiAqXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2UgdG8gY3JlYXRlIGEgY3VzdG9tIGZvcm0gY29udHJvbCBkaXJlY3RpdmVcbiAqIHRoYXQgaW50ZWdyYXRlcyB3aXRoIEFuZ3VsYXIgZm9ybXMuXG4gKlxuICogQHNlZSB7QGxpbmsgRGVmYXVsdFZhbHVlQWNjZXNzb3J9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBXcml0ZXMgYSBuZXcgdmFsdWUgdG8gdGhlIGVsZW1lbnQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIHRvIHdyaXRlIHRvIHRoZSB2aWV3IHdoZW4gcHJvZ3JhbW1hdGljXG4gICAqIGNoYW5nZXMgZnJvbSBtb2RlbCB0byB2aWV3IGFyZSByZXF1ZXN0ZWQuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBXcml0ZSBhIHZhbHVlIHRvIHRoZSBlbGVtZW50XG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSB3cml0ZXMgYSB2YWx1ZSB0byB0aGUgbmF0aXZlIERPTSBlbGVtZW50LlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICogICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHZhbHVlKTtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIG9iaiBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZWxlbWVudFxuICAgKi9cbiAgd3JpdGVWYWx1ZShvYmo6IGFueSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sJ3MgdmFsdWVcbiAgICogY2hhbmdlcyBpbiB0aGUgVUkuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIG9uIGluaXRpYWxpemF0aW9uIHRvIHVwZGF0ZSB0aGUgZm9ybVxuICAgKiBtb2RlbCB3aGVuIHZhbHVlcyBwcm9wYWdhdGUgZnJvbSB0aGUgdmlldyB0byB0aGUgbW9kZWwuXG4gICAqXG4gICAqIFdoZW4gaW1wbGVtZW50aW5nIHRoZSBgcmVnaXN0ZXJPbkNoYW5nZWAgbWV0aG9kIGluIHlvdXIgb3duIHZhbHVlIGFjY2Vzc29yLFxuICAgKiBzYXZlIHRoZSBnaXZlbiBmdW5jdGlvbiBzbyB5b3VyIGNsYXNzIGNhbGxzIGl0IGF0IHRoZSBhcHByb3ByaWF0ZSB0aW1lLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU3RvcmUgdGhlIGNoYW5nZSBmdW5jdGlvblxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc3RvcmVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBhcyBhbiBpbnRlcm5hbCBtZXRob2QuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICogICB0aGlzLl9vbkNoYW5nZSA9IGZuO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBXaGVuIHRoZSB2YWx1ZSBjaGFuZ2VzIGluIHRoZSBVSSwgY2FsbCB0aGUgcmVnaXN0ZXJlZFxuICAgKiBmdW5jdGlvbiB0byBhbGxvdyB0aGUgZm9ybXMgQVBJIHRvIHVwZGF0ZSBpdHNlbGY6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGhvc3Q6IHtcbiAgICogICAgJyhjaGFuZ2UpJzogJ19vbkNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlKSdcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiB0byByZWdpc3RlclxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogYW55KTogdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgb24gaW5pdGlhbGl6YXRpb25cbiAgICogdG8gdXBkYXRlIHRoZSBmb3JtIG1vZGVsIG9uIGJsdXIuXG4gICAqXG4gICAqIFdoZW4gaW1wbGVtZW50aW5nIGByZWdpc3Rlck9uVG91Y2hlZGAgaW4geW91ciBvd24gdmFsdWUgYWNjZXNzb3IsIHNhdmUgdGhlIGdpdmVuXG4gICAqIGZ1bmN0aW9uIHNvIHlvdXIgY2xhc3MgY2FsbHMgaXQgd2hlbiB0aGUgY29udHJvbCBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgKiBibHVycmVkIG9yIFwidG91Y2hlZFwiLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU3RvcmUgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqXG4gICAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzdG9yZXMgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uIGFzIGFuIGludGVybmFsIG1ldGhvZC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogcmVnaXN0ZXJPblRvdWNoZWQoZm46IGFueSk6IHZvaWQge1xuICAgKiAgIHRoaXMuX29uVG91Y2hlZCA9IGZuO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBPbiBibHVyIChvciBlcXVpdmFsZW50KSwgeW91ciBjbGFzcyBzaG91bGQgY2FsbCB0aGUgcmVnaXN0ZXJlZCBmdW5jdGlvbiB0byBhbGxvd1xuICAgKiB0aGUgZm9ybXMgQVBJIHRvIHVwZGF0ZSBpdHNlbGY6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGhvc3Q6IHtcbiAgICogICAgJyhibHVyKSc6ICdfb25Ub3VjaGVkKCknXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gcmVnaXN0ZXJcbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSB3aGVuIHRoZSBjb250cm9sIHN0YXR1cyBjaGFuZ2VzIHRvXG4gICAqIG9yIGZyb20gJ0RJU0FCTEVEJy4gRGVwZW5kaW5nIG9uIHRoZSBzdGF0dXMsIGl0IGVuYWJsZXMgb3IgZGlzYWJsZXMgdGhlXG4gICAqIGFwcHJvcHJpYXRlIERPTSBlbGVtZW50LlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiBUaGUgZm9sbG93aW5nIGlzIGFuIGV4YW1wbGUgb2Ygd3JpdGluZyB0aGUgZGlzYWJsZWQgcHJvcGVydHkgdG8gYSBuYXRpdmUgRE9NIGVsZW1lbnQ6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgKiAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFRoZSBkaXNhYmxlZCBzdGF0dXMgdG8gc2V0IG9uIHRoZSBlbGVtZW50XG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlPyhpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZDtcbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgQ29udHJvbFZhbHVlQWNjZXNzb3IgY2xhc3NlcyBkZWZpbmVkIGluIEZvcm1zIHBhY2thZ2UuXG4gKiBDb250YWlucyBjb21tb24gbG9naWMgYW5kIHV0aWxpdHkgZnVuY3Rpb25zLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgYW4gKmludGVybmFsLW9ubHkqIGNsYXNzIGFuZCBzaG91bGQgbm90IGJlIGV4dGVuZGVkIG9yIHVzZWQgZGlyZWN0bHkgaW5cbiAqIGFwcGxpY2F0aW9ucyBjb2RlLlxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBCYXNlQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBjaGFuZ2Ugb3IgaW5wdXQgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dFxuICAgKiBlbGVtZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgYmx1ciBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICApIHt9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2QgdGhhdCBzZXRzIGEgcHJvcGVydHkgb24gYSB0YXJnZXQgZWxlbWVudCB1c2luZyB0aGUgY3VycmVudCBSZW5kZXJlclxuICAgKiBpbXBsZW1lbnRhdGlvbi5cbiAgICogQG5vZG9jXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0UHJvcGVydHkoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIGlzIHRvdWNoZWQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJkaXNhYmxlZFwiIHByb3BlcnR5IG9uIHRoZSByYW5nZSBpbnB1dCBlbGVtZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2V0UHJvcGVydHkoJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgYnVpbHQtaW4gQ29udHJvbFZhbHVlQWNjZXNzb3IgY2xhc3NlcyAoZXhjZXB0IERlZmF1bHRWYWx1ZUFjY2Vzc29yLCB3aGljaCBpc1xuICogdXNlZCBpbiBjYXNlIG5vIG90aGVyIENWQXMgY2FuIGJlIGZvdW5kKS4gV2UgdXNlIHRoaXMgY2xhc3MgdG8gZGlzdGluZ3Vpc2ggYmV0d2VlbiBkZWZhdWx0IENWQSxcbiAqIGJ1aWx0LWluIENWQXMgYW5kIGN1c3RvbSBDVkFzLCBzbyB0aGF0IEZvcm1zIGxvZ2ljIGNhbiByZWNvZ25pemUgYnVpbHQtaW4gQ1ZBcyBhbmQgdHJlYXQgY3VzdG9tXG4gKiBvbmVzIHdpdGggaGlnaGVyIHByaW9yaXR5ICh3aGVuIGJvdGggYnVpbHQtaW4gYW5kIGN1c3RvbSBDVkFzIGFyZSBwcmVzZW50KS5cbiAqXG4gKiBOb3RlOiB0aGlzIGlzIGFuICppbnRlcm5hbC1vbmx5KiBjbGFzcyBhbmQgc2hvdWxkIG5vdCBiZSBleHRlbmRlZCBvciB1c2VkIGRpcmVjdGx5IGluXG4gKiBhcHBsaWNhdGlvbnMgY29kZS5cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yIHt9XG5cbi8qKlxuICogVXNlZCB0byBwcm92aWRlIGEgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3IgZm9ybSBjb250cm9scy5cbiAqXG4gKiBTZWUgYERlZmF1bHRWYWx1ZUFjY2Vzc29yYCBmb3IgaG93IHRvIGltcGxlbWVudCBvbmUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgTkdfVkFMVUVfQUNDRVNTT1IgPSBuZXcgSW5qZWN0aW9uVG9rZW48UmVhZG9ubHlBcnJheTxDb250cm9sVmFsdWVBY2Nlc3Nvcj4+KFxuICBuZ0Rldk1vZGUgPyAnTmdWYWx1ZUFjY2Vzc29yJyA6ICcnLFxuKTtcbiJdfQ==