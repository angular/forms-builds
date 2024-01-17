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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-b0e0f00", ngImport: i0, type: BaseControlValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0-next.0+sha-b0e0f00", type: BaseControlValueAccessor, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-b0e0f00", ngImport: i0, type: BaseControlValueAccessor, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-b0e0f00", ngImport: i0, type: BuiltInControlValueAccessor, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0-next.0+sha-b0e0f00", type: BuiltInControlValueAccessor, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-b0e0f00", ngImport: i0, type: BuiltInControlValueAccessor, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUE2SC9FOzs7Ozs7R0FNRztBQUVILE1BQU0sT0FBTyx3QkFBd0I7SUFjbkMsWUFBb0IsU0FBb0IsRUFBVSxXQUF1QjtRQUFyRCxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFiekU7Ozs7V0FJRztRQUNILGFBQVEsR0FBRyxDQUFDLENBQU0sRUFBRSxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBRTFCOzs7V0FHRztRQUNILGNBQVMsR0FBRyxHQUFHLEVBQUUsR0FBRSxDQUFDLENBQUM7SUFFdUQsQ0FBQztJQUU3RTs7OztPQUlHO0lBQ08sV0FBVyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsaUJBQWlCLENBQUMsRUFBYztRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0JBQWdCLENBQUMsRUFBa0I7UUFDakMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7T0FHRztJQUNILGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7eUhBL0NVLHdCQUF3Qjs2R0FBeEIsd0JBQXdCOztzR0FBeEIsd0JBQXdCO2tCQURwQyxTQUFTOztBQW1EVjs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sT0FBTywyQkFBNEIsU0FBUSx3QkFBd0I7eUhBQTVELDJCQUEyQjs2R0FBM0IsMkJBQTJCOztzR0FBM0IsMkJBQTJCO2tCQUR2QyxTQUFTOztBQUlWOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUMxQixJQUFJLGNBQWMsQ0FBc0MsaUJBQWlCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0aW9uVG9rZW4sIFJlbmRlcmVyMn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEZWZpbmVzIGFuIGludGVyZmFjZSB0aGF0IGFjdHMgYXMgYSBicmlkZ2UgYmV0d2VlbiB0aGUgQW5ndWxhciBmb3JtcyBBUEkgYW5kIGFcbiAqIG5hdGl2ZSBlbGVtZW50IGluIHRoZSBET00uXG4gKlxuICogSW1wbGVtZW50IHRoaXMgaW50ZXJmYWNlIHRvIGNyZWF0ZSBhIGN1c3RvbSBmb3JtIGNvbnRyb2wgZGlyZWN0aXZlXG4gKiB0aGF0IGludGVncmF0ZXMgd2l0aCBBbmd1bGFyIGZvcm1zLlxuICpcbiAqIEBzZWUge0BsaW5rIERlZmF1bHRWYWx1ZUFjY2Vzc29yfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogV3JpdGVzIGEgbmV3IHZhbHVlIHRvIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSB0byB3cml0ZSB0byB0aGUgdmlldyB3aGVuIHByb2dyYW1tYXRpY1xuICAgKiBjaGFuZ2VzIGZyb20gbW9kZWwgdG8gdmlldyBhcmUgcmVxdWVzdGVkLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgV3JpdGUgYSB2YWx1ZSB0byB0aGUgZWxlbWVudFxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgd3JpdGVzIGEgdmFsdWUgdG8gdGhlIG5hdGl2ZSBET00gZWxlbWVudC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAqICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB2YWx1ZSk7XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBvYmogVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGVsZW1lbnRcbiAgICovXG4gIHdyaXRlVmFsdWUob2JqOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCdzIHZhbHVlXG4gICAqIGNoYW5nZXMgaW4gdGhlIFVJLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSBvbiBpbml0aWFsaXphdGlvbiB0byB1cGRhdGUgdGhlIGZvcm1cbiAgICogbW9kZWwgd2hlbiB2YWx1ZXMgcHJvcGFnYXRlIGZyb20gdGhlIHZpZXcgdG8gdGhlIG1vZGVsLlxuICAgKlxuICAgKiBXaGVuIGltcGxlbWVudGluZyB0aGUgYHJlZ2lzdGVyT25DaGFuZ2VgIG1ldGhvZCBpbiB5b3VyIG93biB2YWx1ZSBhY2Nlc3NvcixcbiAgICogc2F2ZSB0aGUgZ2l2ZW4gZnVuY3Rpb24gc28geW91ciBjbGFzcyBjYWxscyBpdCBhdCB0aGUgYXBwcm9wcmlhdGUgdGltZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFN0b3JlIHRoZSBjaGFuZ2UgZnVuY3Rpb25cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHN0b3JlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gYXMgYW4gaW50ZXJuYWwgbWV0aG9kLlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAqICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogV2hlbiB0aGUgdmFsdWUgY2hhbmdlcyBpbiB0aGUgVUksIGNhbGwgdGhlIHJlZ2lzdGVyZWRcbiAgICogZnVuY3Rpb24gdG8gYWxsb3cgdGhlIGZvcm1zIEFQSSB0byB1cGRhdGUgaXRzZWxmOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBob3N0OiB7XG4gICAqICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gcmVnaXN0ZXJcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIG9uIGluaXRpYWxpemF0aW9uXG4gICAqIHRvIHVwZGF0ZSB0aGUgZm9ybSBtb2RlbCBvbiBibHVyLlxuICAgKlxuICAgKiBXaGVuIGltcGxlbWVudGluZyBgcmVnaXN0ZXJPblRvdWNoZWRgIGluIHlvdXIgb3duIHZhbHVlIGFjY2Vzc29yLCBzYXZlIHRoZSBnaXZlblxuICAgKiBmdW5jdGlvbiBzbyB5b3VyIGNsYXNzIGNhbGxzIGl0IHdoZW4gdGhlIGNvbnRyb2wgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICogYmx1cnJlZCBvciBcInRvdWNoZWRcIi5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFN0b3JlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc3RvcmVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBhcyBhbiBpbnRlcm5hbCBtZXRob2QuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICogICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogT24gYmx1ciAob3IgZXF1aXZhbGVudCksIHlvdXIgY2xhc3Mgc2hvdWxkIGNhbGwgdGhlIHJlZ2lzdGVyZWQgZnVuY3Rpb24gdG8gYWxsb3dcbiAgICogdGhlIGZvcm1zIEFQSSB0byB1cGRhdGUgaXRzZWxmOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBob3N0OiB7XG4gICAqICAgICcoYmx1ciknOiAnX29uVG91Y2hlZCgpJ1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgd2hlbiB0aGUgY29udHJvbCBzdGF0dXMgY2hhbmdlcyB0b1xuICAgKiBvciBmcm9tICdESVNBQkxFRCcuIERlcGVuZGluZyBvbiB0aGUgc3RhdHVzLCBpdCBlbmFibGVzIG9yIGRpc2FibGVzIHRoZVxuICAgKiBhcHByb3ByaWF0ZSBET00gZWxlbWVudC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogVGhlIGZvbGxvd2luZyBpcyBhbiBleGFtcGxlIG9mIHdyaXRpbmcgdGhlIGRpc2FibGVkIHByb3BlcnR5IHRvIGEgbmF0aXZlIERPTSBlbGVtZW50OlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICogICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBUaGUgZGlzYWJsZWQgc3RhdHVzIHRvIHNldCBvbiB0aGUgZWxlbWVudFxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZT8oaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQ7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYWxsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGNsYXNzZXMgZGVmaW5lZCBpbiBGb3JtcyBwYWNrYWdlLlxuICogQ29udGFpbnMgY29tbW9uIGxvZ2ljIGFuZCB1dGlsaXR5IGZ1bmN0aW9ucy5cbiAqXG4gKiBOb3RlOiB0aGlzIGlzIGFuICppbnRlcm5hbC1vbmx5KiBjbGFzcyBhbmQgc2hvdWxkIG5vdCBiZSBleHRlbmRlZCBvciB1c2VkIGRpcmVjdGx5IGluXG4gKiBhcHBsaWNhdGlvbnMgY29kZS5cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgY2hhbmdlIG9yIGlucHV0IGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXRcbiAgICogZWxlbWVudC5cbiAgICogQG5vZG9jXG4gICAqL1xuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGJsdXIgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2QgdGhhdCBzZXRzIGEgcHJvcGVydHkgb24gYSB0YXJnZXQgZWxlbWVudCB1c2luZyB0aGUgY3VycmVudCBSZW5kZXJlclxuICAgKiBpbXBsZW1lbnRhdGlvbi5cbiAgICogQG5vZG9jXG4gICAqL1xuICBwcm90ZWN0ZWQgc2V0UHJvcGVydHkoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIGtleSwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIGlzIHRvdWNoZWQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJkaXNhYmxlZFwiIHByb3BlcnR5IG9uIHRoZSByYW5nZSBpbnB1dCBlbGVtZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2V0UHJvcGVydHkoJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhbGwgYnVpbHQtaW4gQ29udHJvbFZhbHVlQWNjZXNzb3IgY2xhc3NlcyAoZXhjZXB0IERlZmF1bHRWYWx1ZUFjY2Vzc29yLCB3aGljaCBpc1xuICogdXNlZCBpbiBjYXNlIG5vIG90aGVyIENWQXMgY2FuIGJlIGZvdW5kKS4gV2UgdXNlIHRoaXMgY2xhc3MgdG8gZGlzdGluZ3Vpc2ggYmV0d2VlbiBkZWZhdWx0IENWQSxcbiAqIGJ1aWx0LWluIENWQXMgYW5kIGN1c3RvbSBDVkFzLCBzbyB0aGF0IEZvcm1zIGxvZ2ljIGNhbiByZWNvZ25pemUgYnVpbHQtaW4gQ1ZBcyBhbmQgdHJlYXQgY3VzdG9tXG4gKiBvbmVzIHdpdGggaGlnaGVyIHByaW9yaXR5ICh3aGVuIGJvdGggYnVpbHQtaW4gYW5kIGN1c3RvbSBDVkFzIGFyZSBwcmVzZW50KS5cbiAqXG4gKiBOb3RlOiB0aGlzIGlzIGFuICppbnRlcm5hbC1vbmx5KiBjbGFzcyBhbmQgc2hvdWxkIG5vdCBiZSBleHRlbmRlZCBvciB1c2VkIGRpcmVjdGx5IGluXG4gKiBhcHBsaWNhdGlvbnMgY29kZS5cbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgQnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yIGV4dGVuZHMgQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbn1cblxuLyoqXG4gKiBVc2VkIHRvIHByb3ZpZGUgYSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciBmb3JtIGNvbnRyb2xzLlxuICpcbiAqIFNlZSBgRGVmYXVsdFZhbHVlQWNjZXNzb3JgIGZvciBob3cgdG8gaW1wbGVtZW50IG9uZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjb25zdCBOR19WQUxVRV9BQ0NFU1NPUiA9XG4gICAgbmV3IEluamVjdGlvblRva2VuPFJlYWRvbmx5QXJyYXk8Q29udHJvbFZhbHVlQWNjZXNzb3I+PignTmdWYWx1ZUFjY2Vzc29yJyk7XG4iXX0=