/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/**
 * Base class for all built-in ControlValueAccessor classes. We use this class to distinguish
 * between built-in and custom CVAs, so that Forms logic can recognize built-in CVAs and treat
 * custom ones with higher priority (when both built-in and custom CVAs are present).
 * Note: this is an *internal-only* class and should not be extended or used directly in
 * applications code.
 */
export class BuiltInControlValueAccessor {
}
/**
 * Used to provide a `ControlValueAccessor` for form controls.
 *
 * See `DefaultValueAccessor` for how to implement one.
 *
 * @publicApi
 */
export const NG_VALUE_ACCESSOR = new InjectionToken('NgValueAccessor');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQTZIN0M7Ozs7OztHQU1HO0FBQ0gsTUFBTSxPQUFPLDJCQUEyQjtDQUFHO0FBRTNDOzs7Ozs7R0FNRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUMxQixJQUFJLGNBQWMsQ0FBc0MsaUJBQWlCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGlvblRva2VufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERlZmluZXMgYW4gaW50ZXJmYWNlIHRoYXQgYWN0cyBhcyBhIGJyaWRnZSBiZXR3ZWVuIHRoZSBBbmd1bGFyIGZvcm1zIEFQSSBhbmQgYVxuICogbmF0aXZlIGVsZW1lbnQgaW4gdGhlIERPTS5cbiAqXG4gKiBJbXBsZW1lbnQgdGhpcyBpbnRlcmZhY2UgdG8gY3JlYXRlIGEgY3VzdG9tIGZvcm0gY29udHJvbCBkaXJlY3RpdmVcbiAqIHRoYXQgaW50ZWdyYXRlcyB3aXRoIEFuZ3VsYXIgZm9ybXMuXG4gKlxuICogQHNlZSBEZWZhdWx0VmFsdWVBY2Nlc3NvclxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogV3JpdGVzIGEgbmV3IHZhbHVlIHRvIHRoZSBlbGVtZW50LlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSB0byB3cml0ZSB0byB0aGUgdmlldyB3aGVuIHByb2dyYW1tYXRpY1xuICAgKiBjaGFuZ2VzIGZyb20gbW9kZWwgdG8gdmlldyBhcmUgcmVxdWVzdGVkLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgV3JpdGUgYSB2YWx1ZSB0byB0aGUgZWxlbWVudFxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgd3JpdGVzIGEgdmFsdWUgdG8gdGhlIG5hdGl2ZSBET00gZWxlbWVudC5cbiAgICpcbiAgICogYGBgdHNcbiAgICogd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAqICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB2YWx1ZSk7XG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBvYmogVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGVsZW1lbnRcbiAgICovXG4gIHdyaXRlVmFsdWUob2JqOiBhbnkpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCdzIHZhbHVlXG4gICAqIGNoYW5nZXMgaW4gdGhlIFVJLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgYnkgdGhlIGZvcm1zIEFQSSBvbiBpbml0aWFsaXphdGlvbiB0byB1cGRhdGUgdGhlIGZvcm1cbiAgICogbW9kZWwgd2hlbiB2YWx1ZXMgcHJvcGFnYXRlIGZyb20gdGhlIHZpZXcgdG8gdGhlIG1vZGVsLlxuICAgKlxuICAgKiBXaGVuIGltcGxlbWVudGluZyB0aGUgYHJlZ2lzdGVyT25DaGFuZ2VgIG1ldGhvZCBpbiB5b3VyIG93biB2YWx1ZSBhY2Nlc3NvcixcbiAgICogc2F2ZSB0aGUgZ2l2ZW4gZnVuY3Rpb24gc28geW91ciBjbGFzcyBjYWxscyBpdCBhdCB0aGUgYXBwcm9wcmlhdGUgdGltZS5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFN0b3JlIHRoZSBjaGFuZ2UgZnVuY3Rpb25cbiAgICpcbiAgICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHN0b3JlcyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gYXMgYW4gaW50ZXJuYWwgbWV0aG9kLlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7XG4gICAqICAgdGhpcy5fb25DaGFuZ2UgPSBmbjtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogV2hlbiB0aGUgdmFsdWUgY2hhbmdlcyBpbiB0aGUgVUksIGNhbGwgdGhlIHJlZ2lzdGVyZWRcbiAgICogZnVuY3Rpb24gdG8gYWxsb3cgdGhlIGZvcm1zIEFQSSB0byB1cGRhdGUgaXRzZWxmOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBob3N0OiB7XG4gICAqICAgICcoY2hhbmdlKSc6ICdfb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknXG4gICAqIH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdG8gcmVnaXN0ZXJcbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCBieSB0aGUgZm9ybXMgQVBJIG9uIGluaXRpYWxpemF0aW9uXG4gICAqIHRvIHVwZGF0ZSB0aGUgZm9ybSBtb2RlbCBvbiBibHVyLlxuICAgKlxuICAgKiBXaGVuIGltcGxlbWVudGluZyBgcmVnaXN0ZXJPblRvdWNoZWRgIGluIHlvdXIgb3duIHZhbHVlIGFjY2Vzc29yLCBzYXZlIHRoZSBnaXZlblxuICAgKiBmdW5jdGlvbiBzbyB5b3VyIGNsYXNzIGNhbGxzIGl0IHdoZW4gdGhlIGNvbnRyb2wgc2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAgICogYmx1cnJlZCBvciBcInRvdWNoZWRcIi5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFN0b3JlIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKlxuICAgKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc3RvcmVzIHRoZSBwcm92aWRlZCBmdW5jdGlvbiBhcyBhbiBpbnRlcm5hbCBtZXRob2QuXG4gICAqXG4gICAqIGBgYHRzXG4gICAqIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBhbnkpOiB2b2lkIHtcbiAgICogICB0aGlzLl9vblRvdWNoZWQgPSBmbjtcbiAgICogfVxuICAgKiBgYGBcbiAgICpcbiAgICogT24gYmx1ciAob3IgZXF1aXZhbGVudCksIHlvdXIgY2xhc3Mgc2hvdWxkIGNhbGwgdGhlIHJlZ2lzdGVyZWQgZnVuY3Rpb24gdG8gYWxsb3dcbiAgICogdGhlIGZvcm1zIEFQSSB0byB1cGRhdGUgaXRzZWxmOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBob3N0OiB7XG4gICAqICAgICcoYmx1ciknOiAnX29uVG91Y2hlZCgpJ1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHJlZ2lzdGVyXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KTogdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIGJ5IHRoZSBmb3JtcyBBUEkgd2hlbiB0aGUgY29udHJvbCBzdGF0dXMgY2hhbmdlcyB0b1xuICAgKiBvciBmcm9tICdESVNBQkxFRCcuIERlcGVuZGluZyBvbiB0aGUgc3RhdHVzLCBpdCBlbmFibGVzIG9yIGRpc2FibGVzIHRoZVxuICAgKiBhcHByb3ByaWF0ZSBET00gZWxlbWVudC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogVGhlIGZvbGxvd2luZyBpcyBhbiBleGFtcGxlIG9mIHdyaXRpbmcgdGhlIGRpc2FibGVkIHByb3BlcnR5IHRvIGEgbmF0aXZlIERPTSBlbGVtZW50OlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICogICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICAgKiB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBUaGUgZGlzYWJsZWQgc3RhdHVzIHRvIHNldCBvbiB0aGUgZWxlbWVudFxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZT8oaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQ7XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgYWxsIGJ1aWx0LWluIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGNsYXNzZXMuIFdlIHVzZSB0aGlzIGNsYXNzIHRvIGRpc3Rpbmd1aXNoXG4gKiBiZXR3ZWVuIGJ1aWx0LWluIGFuZCBjdXN0b20gQ1ZBcywgc28gdGhhdCBGb3JtcyBsb2dpYyBjYW4gcmVjb2duaXplIGJ1aWx0LWluIENWQXMgYW5kIHRyZWF0XG4gKiBjdXN0b20gb25lcyB3aXRoIGhpZ2hlciBwcmlvcml0eSAod2hlbiBib3RoIGJ1aWx0LWluIGFuZCBjdXN0b20gQ1ZBcyBhcmUgcHJlc2VudCkuXG4gKiBOb3RlOiB0aGlzIGlzIGFuICppbnRlcm5hbC1vbmx5KiBjbGFzcyBhbmQgc2hvdWxkIG5vdCBiZSBleHRlbmRlZCBvciB1c2VkIGRpcmVjdGx5IGluXG4gKiBhcHBsaWNhdGlvbnMgY29kZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciB7fVxuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIGZvcm0gY29udHJvbHMuXG4gKlxuICogU2VlIGBEZWZhdWx0VmFsdWVBY2Nlc3NvcmAgZm9yIGhvdyB0byBpbXBsZW1lbnQgb25lLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IE5HX1ZBTFVFX0FDQ0VTU09SID1cbiAgICBuZXcgSW5qZWN0aW9uVG9rZW48UmVhZG9ubHlBcnJheTxDb250cm9sVmFsdWVBY2Nlc3Nvcj4+KCdOZ1ZhbHVlQWNjZXNzb3InKTsiXX0=