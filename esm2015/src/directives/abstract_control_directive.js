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
/**
 * \@description
 * Base class for control directives.
 *
 * This class is only used internally in the `ReactiveFormsModule` and the `FormsModule`.
 *
 * @abstract
 */
export class AbstractControlDirective {
    /**
     * \@description
     * Reports the value of the control if it is present, otherwise null.
     * @return {?}
     */
    get value() { return this.control ? this.control.value : null; }
    /**
     * \@description
     * Reports whether the control is valid. A control is considered valid if no
     * validation errors exist with the current value.
     * If the control is not present, null is returned.
     * @return {?}
     */
    get valid() { return this.control ? this.control.valid : null; }
    /**
     * \@description
     * Reports whether the control is invalid, meaning that an error exists in the input value.
     * If the control is not present, null is returned.
     * @return {?}
     */
    get invalid() { return this.control ? this.control.invalid : null; }
    /**
     * \@description
     * Reports whether a control is pending, meaning that that async validation is occurring and
     * errors are not yet available for the input value. If the control is not present, null is
     * returned.
     * @return {?}
     */
    get pending() { return this.control ? this.control.pending : null; }
    /**
     * \@description
     * Reports whether the control is disabled, meaning that the control is disabled
     * in the UI and is exempt from validation checks and excluded from aggregate
     * values of ancestor controls. If the control is not present, null is returned.
     * @return {?}
     */
    get disabled() { return this.control ? this.control.disabled : null; }
    /**
     * \@description
     * Reports whether the control is enabled, meaning that the control is included in ancestor
     * calculations of validity or value. If the control is not present, null is returned.
     * @return {?}
     */
    get enabled() { return this.control ? this.control.enabled : null; }
    /**
     * \@description
     * Reports the control's validation errors. If the control is not present, null is returned.
     * @return {?}
     */
    get errors() { return this.control ? this.control.errors : null; }
    /**
     * \@description
     * Reports whether the control is pristine, meaning that the user has not yet changed
     * the value in the UI. If the control is not present, null is returned.
     * @return {?}
     */
    get pristine() { return this.control ? this.control.pristine : null; }
    /**
     * \@description
     * Reports whether the control is dirty, meaning that the user has changed
     * the value in the UI. If the control is not present, null is returned.
     * @return {?}
     */
    get dirty() { return this.control ? this.control.dirty : null; }
    /**
     * \@description
     * Reports whether the control is touched, meaning that the user has triggered
     * a `blur` event on it. If the control is not present, null is returned.
     * @return {?}
     */
    get touched() { return this.control ? this.control.touched : null; }
    /**
     * \@description
     * Reports the validation status of the control. Possible values include:
     * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
     * If the control is not present, null is returned.
     * @return {?}
     */
    get status() { return this.control ? this.control.status : null; }
    /**
     * \@description
     * Reports whether the control is untouched, meaning that the user has not yet triggered
     * a `blur` event on it. If the control is not present, null is returned.
     * @return {?}
     */
    get untouched() { return this.control ? this.control.untouched : null; }
    /**
     * \@description
     * Returns a multicasting observable that emits a validation status whenever it is
     * calculated for the control. If the control is not present, null is returned.
     * @return {?}
     */
    get statusChanges() {
        return this.control ? this.control.statusChanges : null;
    }
    /**
     * \@description
     * Returns a multicasting observable of value changes for the control that emits every time the
     * value of the control changes in the UI or programmatically.
     * If the control is not present, null is returned.
     * @return {?}
     */
    get valueChanges() {
        return this.control ? this.control.valueChanges : null;
    }
    /**
     * \@description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     * @return {?}
     */
    get path() { return null; }
    /**
     * \@description
     * Resets the control with the provided value if the control is present.
     * @param {?=} value
     * @return {?}
     */
    reset(value = undefined) {
        if (this.control)
            this.control.reset(value);
    }
    /**
     * \@description
     * Reports whether the control with the given path has the error specified.
     * If no path is given, it checks for the error on the present control.
     * If the control is not present, false is returned.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    hasError(errorCode, path) {
        return this.control ? this.control.hasError(errorCode, path) : false;
    }
    /**
     * \@description
     * Reports error data for the control with the given path.
     * If the control is not present, null is returned.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    getError(errorCode, path) {
        return this.control ? this.control.getError(errorCode, path) : null;
    }
}
if (false) {
    /**
     * \@description
     * A reference to the underlying control.
     *
     * @abstract
     * @return {?} the control that backs this directive. Most properties fall through to that instance.
     */
    AbstractControlDirective.prototype.control = function () { };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9hYnN0cmFjdF9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE1BQU0sT0FBZ0Isd0JBQXdCOzs7Ozs7SUFhNUMsSUFBSSxLQUFLLEtBQVUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7O0lBUXJFLElBQUksS0FBSyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7OztJQU85RSxJQUFJLE9BQU8sS0FBbUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7O0lBUWxGLElBQUksT0FBTyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7Ozs7SUFRbEYsSUFBSSxRQUFRLEtBQW1CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFOzs7Ozs7O0lBT3BGLElBQUksT0FBTyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7O0lBTWxGLElBQUksTUFBTSxLQUE0QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7OztJQU96RixJQUFJLFFBQVEsS0FBbUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7SUFPcEYsSUFBSSxLQUFLLEtBQW1CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFOzs7Ozs7O0lBTzlFLElBQUksT0FBTyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7Ozs7SUFRbEYsSUFBSSxNQUFNLEtBQWtCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFOzs7Ozs7O0lBTy9FLElBQUksU0FBUyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7OztJQU90RixJQUFJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDekQ7Ozs7Ozs7O0lBUUQsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ3hEOzs7Ozs7O0lBT0QsSUFBSSxJQUFJLEtBQW9CLE9BQU8sSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7SUFNMUMsS0FBSyxDQUFDLFFBQWEsU0FBUztRQUMxQixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0M7Ozs7Ozs7Ozs7SUFRRCxRQUFRLENBQUMsU0FBaUIsRUFBRSxJQUFlO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDdEU7Ozs7Ozs7OztJQU9ELFFBQVEsQ0FBQyxTQUFpQixFQUFFLElBQWU7UUFDekMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUNyRTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2x9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yc30gZnJvbSAnLi92YWxpZGF0b3JzJztcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEJhc2UgY2xhc3MgZm9yIGNvbnRyb2wgZGlyZWN0aXZlcy5cbiAqXG4gKiBUaGlzIGNsYXNzIGlzIG9ubHkgdXNlZCBpbnRlcm5hbGx5IGluIHRoZSBgUmVhY3RpdmVGb3Jtc01vZHVsZWAgYW5kIHRoZSBgRm9ybXNNb2R1bGVgLlxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSByZWZlcmVuY2UgdG8gdGhlIHVuZGVybHlpbmcgY29udHJvbC5cbiAgICpcbiAgICogQHJldHVybnMgdGhlIGNvbnRyb2wgdGhhdCBiYWNrcyB0aGlzIGRpcmVjdGl2ZS4gTW9zdCBwcm9wZXJ0aWVzIGZhbGwgdGhyb3VnaCB0byB0aGF0IGluc3RhbmNlLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGNvbnRyb2woKTogQWJzdHJhY3RDb250cm9sfG51bGw7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHRoZSB2YWx1ZSBvZiB0aGUgY29udHJvbCBpZiBpdCBpcyBwcmVzZW50LCBvdGhlcndpc2UgbnVsbC5cbiAgICovXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbHVlIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIHZhbGlkLiBBIGNvbnRyb2wgaXMgY29uc2lkZXJlZCB2YWxpZCBpZiBub1xuICAgKiB2YWxpZGF0aW9uIGVycm9ycyBleGlzdCB3aXRoIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIGdldCB2YWxpZCgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbGlkIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIGludmFsaWQsIG1lYW5pbmcgdGhhdCBhbiBlcnJvciBleGlzdHMgaW4gdGhlIGlucHV0IHZhbHVlLlxuICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIGdldCBpbnZhbGlkKCk6IGJvb2xlYW58bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuaW52YWxpZCA6IG51bGw7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgd2hldGhlciBhIGNvbnRyb2wgaXMgcGVuZGluZywgbWVhbmluZyB0aGF0IHRoYXQgYXN5bmMgdmFsaWRhdGlvbiBpcyBvY2N1cnJpbmcgYW5kXG4gICAqIGVycm9ycyBhcmUgbm90IHlldCBhdmFpbGFibGUgZm9yIHRoZSBpbnB1dCB2YWx1ZS4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXNcbiAgICogcmV0dXJuZWQuXG4gICAqL1xuICBnZXQgcGVuZGluZygpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnBlbmRpbmcgOiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZGlzYWJsZWQsIG1lYW5pbmcgdGhhdCB0aGUgY29udHJvbCBpcyBkaXNhYmxlZFxuICAgKiBpbiB0aGUgVUkgYW5kIGlzIGV4ZW1wdCBmcm9tIHZhbGlkYXRpb24gY2hlY2tzIGFuZCBleGNsdWRlZCBmcm9tIGFnZ3JlZ2F0ZVxuICAgKiB2YWx1ZXMgb2YgYW5jZXN0b3IgY29udHJvbHMuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgKi9cbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW58bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZGlzYWJsZWQgOiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgZW5hYmxlZCwgbWVhbmluZyB0aGF0IHRoZSBjb250cm9sIGlzIGluY2x1ZGVkIGluIGFuY2VzdG9yXG4gICAqIGNhbGN1bGF0aW9ucyBvZiB2YWxpZGl0eSBvciB2YWx1ZS4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXQgZW5hYmxlZCgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmVuYWJsZWQgOiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHRoZSBjb250cm9sJ3MgdmFsaWRhdGlvbiBlcnJvcnMuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgKi9cbiAgZ2V0IGVycm9ycygpOiBWYWxpZGF0aW9uRXJyb3JzfG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmVycm9ycyA6IG51bGw7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY29udHJvbCBpcyBwcmlzdGluZSwgbWVhbmluZyB0aGF0IHRoZSB1c2VyIGhhcyBub3QgeWV0IGNoYW5nZWRcbiAgICogdGhlIHZhbHVlIGluIHRoZSBVSS4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXQgcHJpc3RpbmUoKTogYm9vbGVhbnxudWxsIHsgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5wcmlzdGluZSA6IG51bGw7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlcG9ydHMgd2hldGhlciB0aGUgY29udHJvbCBpcyBkaXJ0eSwgbWVhbmluZyB0aGF0IHRoZSB1c2VyIGhhcyBjaGFuZ2VkXG4gICAqIHRoZSB2YWx1ZSBpbiB0aGUgVUkuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgKi9cbiAgZ2V0IGRpcnR5KCk6IGJvb2xlYW58bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZGlydHkgOiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGNvbnRyb2wgaXMgdG91Y2hlZCwgbWVhbmluZyB0aGF0IHRoZSB1c2VyIGhhcyB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgKi9cbiAgZ2V0IHRvdWNoZWQoKTogYm9vbGVhbnxudWxsIHsgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC50b3VjaGVkIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB0aGUgdmFsaWRhdGlvbiBzdGF0dXMgb2YgdGhlIGNvbnRyb2wuIFBvc3NpYmxlIHZhbHVlcyBpbmNsdWRlOlxuICAgKiAnVkFMSUQnLCAnSU5WQUxJRCcsICdESVNBQkxFRCcsIGFuZCAnUEVORElORycuXG4gICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBudWxsIGlzIHJldHVybmVkLlxuICAgKi9cbiAgZ2V0IHN0YXR1cygpOiBzdHJpbmd8bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuc3RhdHVzIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIGlzIHVudG91Y2hlZCwgbWVhbmluZyB0aGF0IHRoZSB1c2VyIGhhcyBub3QgeWV0IHRyaWdnZXJlZFxuICAgKiBhIGBibHVyYCBldmVudCBvbiBpdC4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXQgdW50b3VjaGVkKCk6IGJvb2xlYW58bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wudW50b3VjaGVkIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSB2YWxpZGF0aW9uIHN0YXR1cyB3aGVuZXZlciBpdCBpc1xuICAgKiBjYWxjdWxhdGVkIGZvciB0aGUgY29udHJvbC4gSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXQgc3RhdHVzQ2hhbmdlcygpOiBPYnNlcnZhYmxlPGFueT58bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5zdGF0dXNDaGFuZ2VzIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhIG11bHRpY2FzdGluZyBvYnNlcnZhYmxlIG9mIHZhbHVlIGNoYW5nZXMgZm9yIHRoZSBjb250cm9sIHRoYXQgZW1pdHMgZXZlcnkgdGltZSB0aGVcbiAgICogdmFsdWUgb2YgdGhlIGNvbnRyb2wgY2hhbmdlcyBpbiB0aGUgVUkgb3IgcHJvZ3JhbW1hdGljYWxseS5cbiAgICogSWYgdGhlIGNvbnRyb2wgaXMgbm90IHByZXNlbnQsIG51bGwgaXMgcmV0dXJuZWQuXG4gICAqL1xuICBnZXQgdmFsdWVDaGFuZ2VzKCk6IE9ic2VydmFibGU8YW55PnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbHVlQ2hhbmdlcyA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICogRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb24gdGhhdCBsZXZlbC5cbiAgICovXG4gIGdldCBwYXRoKCk6IHN0cmluZ1tdfG51bGwgeyByZXR1cm4gbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVzZXRzIHRoZSBjb250cm9sIHdpdGggdGhlIHByb3ZpZGVkIHZhbHVlIGlmIHRoZSBjb250cm9sIGlzIHByZXNlbnQuXG4gICAqL1xuICByZXNldCh2YWx1ZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbCkgdGhpcy5jb250cm9sLnJlc2V0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBjb250cm9sIHdpdGggdGhlIGdpdmVuIHBhdGggaGFzIHRoZSBlcnJvciBzcGVjaWZpZWQuXG4gICAqIElmIG5vIHBhdGggaXMgZ2l2ZW4sIGl0IGNoZWNrcyBmb3IgdGhlIGVycm9yIG9uIHRoZSBwcmVzZW50IGNvbnRyb2wuXG4gICAqIElmIHRoZSBjb250cm9sIGlzIG5vdCBwcmVzZW50LCBmYWxzZSBpcyByZXR1cm5lZC5cbiAgICovXG4gIGhhc0Vycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmhhc0Vycm9yKGVycm9yQ29kZSwgcGF0aCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyBlcnJvciBkYXRhIGZvciB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBwYXRoLlxuICAgKiBJZiB0aGUgY29udHJvbCBpcyBub3QgcHJlc2VudCwgbnVsbCBpcyByZXR1cm5lZC5cbiAgICovXG4gIGdldEVycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogc3RyaW5nW10pOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZ2V0RXJyb3IoZXJyb3JDb2RlLCBwYXRoKSA6IG51bGw7XG4gIH1cbn1cbiJdfQ==