/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Base class for control directives.
 *
 * Only used internally in the forms module.
 *
 *
 * @abstract
 */
export class AbstractControlDirective {
    /**
     * The value of the control.
     * @return {?}
     */
    get value() { return this.control ? this.control.value : null; }
    /**
     * A control is `valid` when its `status === VALID`.
     *
     * In order to have this status, the control must have passed all its
     * validation checks.
     * @return {?}
     */
    get valid() { return this.control ? this.control.valid : null; }
    /**
     * A control is `invalid` when its `status === INVALID`.
     *
     * In order to have this status, the control must have failed
     * at least one of its validation checks.
     * @return {?}
     */
    get invalid() { return this.control ? this.control.invalid : null; }
    /**
     * A control is `pending` when its `status === PENDING`.
     *
     * In order to have this status, the control must be in the
     * middle of conducting a validation check.
     * @return {?}
     */
    get pending() { return this.control ? this.control.pending : null; }
    /**
     * A control is `disabled` when its `status === DISABLED`.
     *
     * Disabled controls are exempt from validation checks and
     * are not included in the aggregate value of their ancestor
     * controls.
     * @return {?}
     */
    get disabled() { return this.control ? this.control.disabled : null; }
    /**
     * A control is `enabled` as long as its `status !== DISABLED`.
     *
     * In other words, it has a status of `VALID`, `INVALID`, or
     * `PENDING`.
     * @return {?}
     */
    get enabled() { return this.control ? this.control.enabled : null; }
    /**
     * Returns any errors generated by failing validation. If there
     * are no errors, it will return null.
     * @return {?}
     */
    get errors() { return this.control ? this.control.errors : null; }
    /**
     * A control is `pristine` if the user has not yet changed
     * the value in the UI.
     *
     * Note that programmatic changes to a control's value will
     * *not* mark it dirty.
     * @return {?}
     */
    get pristine() { return this.control ? this.control.pristine : null; }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * Note that programmatic changes to a control's value will
     * *not* mark it dirty.
     * @return {?}
     */
    get dirty() { return this.control ? this.control.dirty : null; }
    /**
     * A control is marked `touched` once the user has triggered
     * a `blur` event on it.
     * @return {?}
     */
    get touched() { return this.control ? this.control.touched : null; }
    /**
     * @return {?}
     */
    get status() { return this.control ? this.control.status : null; }
    /**
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     * @return {?}
     */
    get untouched() { return this.control ? this.control.untouched : null; }
    /**
     * Emits an event every time the validation status of the control
     * is re-calculated.
     * @return {?}
     */
    get statusChanges() {
        return this.control ? this.control.statusChanges : null;
    }
    /**
     * Emits an event every time the value of the control changes, in
     * the UI or programmatically.
     * @return {?}
     */
    get valueChanges() {
        return this.control ? this.control.valueChanges : null;
    }
    /**
     * Returns an array that represents the path from the top-level form
     * to this control. Each index is the string name of the control on
     * that level.
     * @return {?}
     */
    get path() { return null; }
    /**
     * Resets the form control. This means by default:
     *
     * * it is marked as `pristine`
     * * it is marked as `untouched`
     * * value is set to null
     *
     * For more information, see `AbstractControl`.
     * @param {?=} value
     * @return {?}
     */
    reset(value = undefined) {
        if (this.control)
            this.control.reset(value);
    }
    /**
     * Returns true if the control with the given path has the error specified. Otherwise
     * returns false.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    hasError(errorCode, path) {
        return this.control ? this.control.hasError(errorCode, path) : false;
    }
    /**
     * Returns error data if the control with the given path has the error specified. Otherwise
     * returns null or undefined.
     *
     * If no path is given, it checks for the error on the present control.
     * @param {?} errorCode
     * @param {?=} path
     * @return {?}
     */
    getError(errorCode, path) {
        return this.control ? this.control.getError(errorCode, path) : null;
    }
}
function AbstractControlDirective_tsickle_Closure_declarations() {
    /**
     * The `FormControl`, `FormGroup`, or `FormArray`
     * that backs this directive. Most properties fall through to that
     * instance.
     * @abstract
     * @return {?}
     */
    AbstractControlDirective.prototype.control = function () { };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9hYnN0cmFjdF9jb250cm9sX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE1BQU07Ozs7O0lBU0osSUFBSSxLQUFLLEtBQVUsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7O0lBUXJFLElBQUksS0FBSyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7Ozs7SUFROUUsSUFBSSxPQUFPLEtBQW1CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFOzs7Ozs7OztJQVFsRixJQUFJLE9BQU8sS0FBbUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7OztJQVNsRixJQUFJLFFBQVEsS0FBbUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7Ozs7O0lBUXBGLElBQUksT0FBTyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7O0lBTWxGLElBQUksTUFBTSxLQUE0QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7Ozs7O0lBU3pGLElBQUksUUFBUSxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7Ozs7O0lBU3BGLElBQUksS0FBSyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7Ozs7O0lBTTlFLElBQUksT0FBTyxLQUFtQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTs7OztJQUVsRixJQUFJLE1BQU0sS0FBa0IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7OztJQU0vRSxJQUFJLFNBQVMsS0FBbUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7Ozs7OztJQU10RixJQUFJLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDekQ7Ozs7OztJQU1ELElBQUksWUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztLQUN4RDs7Ozs7OztJQU9ELElBQUksSUFBSSxLQUFvQixPQUFPLElBQUksQ0FBQyxFQUFFOzs7Ozs7Ozs7Ozs7SUFXMUMsS0FBSyxDQUFDLFFBQWEsU0FBUztRQUMxQixJQUFJLElBQUksQ0FBQyxPQUFPO1lBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0M7Ozs7Ozs7Ozs7SUFRRCxRQUFRLENBQUMsU0FBaUIsRUFBRSxJQUFlO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDdEU7Ozs7Ozs7Ozs7SUFRRCxRQUFRLENBQUMsU0FBaUIsRUFBRSxJQUFlO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7S0FDckU7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7QWJzdHJhY3RDb250cm9sfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcnN9IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY29udHJvbCBkaXJlY3RpdmVzLlxuICpcbiAqIE9ubHkgdXNlZCBpbnRlcm5hbGx5IGluIHRoZSBmb3JtcyBtb2R1bGUuXG4gKlxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB7XG4gIC8qKlxuICAgKiBUaGUgYEZvcm1Db250cm9sYCwgYEZvcm1Hcm91cGAsIG9yIGBGb3JtQXJyYXlgXG4gICAqIHRoYXQgYmFja3MgdGhpcyBkaXJlY3RpdmUuIE1vc3QgcHJvcGVydGllcyBmYWxsIHRocm91Z2ggdG8gdGhhdFxuICAgKiBpbnN0YW5jZS5cbiAgICovXG4gIGFic3RyYWN0IGdldCBjb250cm9sKCk6IEFic3RyYWN0Q29udHJvbHxudWxsO1xuXG4gIC8qKiBUaGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wuICovXG4gIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbHVlIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHZhbGlkYCB3aGVuIGl0cyBgc3RhdHVzID09PSBWQUxJRGAuXG4gICAqXG4gICAqIEluIG9yZGVyIHRvIGhhdmUgdGhpcyBzdGF0dXMsIHRoZSBjb250cm9sIG11c3QgaGF2ZSBwYXNzZWQgYWxsIGl0c1xuICAgKiB2YWxpZGF0aW9uIGNoZWNrcy5cbiAgICovXG4gIGdldCB2YWxpZCgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnZhbGlkIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGludmFsaWRgIHdoZW4gaXRzIGBzdGF0dXMgPT09IElOVkFMSURgLlxuICAgKlxuICAgKiBJbiBvcmRlciB0byBoYXZlIHRoaXMgc3RhdHVzLCB0aGUgY29udHJvbCBtdXN0IGhhdmUgZmFpbGVkXG4gICAqIGF0IGxlYXN0IG9uZSBvZiBpdHMgdmFsaWRhdGlvbiBjaGVja3MuXG4gICAqL1xuICBnZXQgaW52YWxpZCgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmludmFsaWQgOiBudWxsOyB9XG5cbiAgLyoqXG4gICAqIEEgY29udHJvbCBpcyBgcGVuZGluZ2Agd2hlbiBpdHMgYHN0YXR1cyA9PT0gUEVORElOR2AuXG4gICAqXG4gICAqIEluIG9yZGVyIHRvIGhhdmUgdGhpcyBzdGF0dXMsIHRoZSBjb250cm9sIG11c3QgYmUgaW4gdGhlXG4gICAqIG1pZGRsZSBvZiBjb25kdWN0aW5nIGEgdmFsaWRhdGlvbiBjaGVjay5cbiAgICovXG4gIGdldCBwZW5kaW5nKCk6IGJvb2xlYW58bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wucGVuZGluZyA6IG51bGw7IH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXNhYmxlZGAgd2hlbiBpdHMgYHN0YXR1cyA9PT0gRElTQUJMRURgLlxuICAgKlxuICAgKiBEaXNhYmxlZCBjb250cm9scyBhcmUgZXhlbXB0IGZyb20gdmFsaWRhdGlvbiBjaGVja3MgYW5kXG4gICAqIGFyZSBub3QgaW5jbHVkZWQgaW4gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGVpciBhbmNlc3RvclxuICAgKiBjb250cm9scy5cbiAgICovXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmRpc2FibGVkIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYGVuYWJsZWRgIGFzIGxvbmcgYXMgaXRzIGBzdGF0dXMgIT09IERJU0FCTEVEYC5cbiAgICpcbiAgICogSW4gb3RoZXIgd29yZHMsIGl0IGhhcyBhIHN0YXR1cyBvZiBgVkFMSURgLCBgSU5WQUxJRGAsIG9yXG4gICAqIGBQRU5ESU5HYC5cbiAgICovXG4gIGdldCBlbmFibGVkKCk6IGJvb2xlYW58bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZW5hYmxlZCA6IG51bGw7IH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbnkgZXJyb3JzIGdlbmVyYXRlZCBieSBmYWlsaW5nIHZhbGlkYXRpb24uIElmIHRoZXJlXG4gICAqIGFyZSBubyBlcnJvcnMsIGl0IHdpbGwgcmV0dXJuIG51bGwuXG4gICAqL1xuICBnZXQgZXJyb3JzKCk6IFZhbGlkYXRpb25FcnJvcnN8bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuZXJyb3JzIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHByaXN0aW5lYCBpZiB0aGUgdXNlciBoYXMgbm90IHlldCBjaGFuZ2VkXG4gICAqIHRoZSB2YWx1ZSBpbiB0aGUgVUkuXG4gICAqXG4gICAqIE5vdGUgdGhhdCBwcm9ncmFtbWF0aWMgY2hhbmdlcyB0byBhIGNvbnRyb2wncyB2YWx1ZSB3aWxsXG4gICAqICpub3QqIG1hcmsgaXQgZGlydHkuXG4gICAqL1xuICBnZXQgcHJpc3RpbmUoKTogYm9vbGVhbnxudWxsIHsgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC5wcmlzdGluZSA6IG51bGw7IH1cblxuICAvKipcbiAgICogQSBjb250cm9sIGlzIGBkaXJ0eWAgaWYgdGhlIHVzZXIgaGFzIGNoYW5nZWQgdGhlIHZhbHVlXG4gICAqIGluIHRoZSBVSS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHByb2dyYW1tYXRpYyBjaGFuZ2VzIHRvIGEgY29udHJvbCdzIHZhbHVlIHdpbGxcbiAgICogKm5vdCogbWFyayBpdCBkaXJ0eS5cbiAgICovXG4gIGdldCBkaXJ0eSgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmRpcnR5IDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgbWFya2VkIGB0b3VjaGVkYCBvbmNlIHRoZSB1c2VyIGhhcyB0cmlnZ2VyZWRcbiAgICogYSBgYmx1cmAgZXZlbnQgb24gaXQuXG4gICAqL1xuICBnZXQgdG91Y2hlZCgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnRvdWNoZWQgOiBudWxsOyB9XG5cbiAgZ2V0IHN0YXR1cygpOiBzdHJpbmd8bnVsbCB7IHJldHVybiB0aGlzLmNvbnRyb2wgPyB0aGlzLmNvbnRyb2wuc3RhdHVzIDogbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBBIGNvbnRyb2wgaXMgYHVudG91Y2hlZGAgaWYgdGhlIHVzZXIgaGFzIG5vdCB5ZXQgdHJpZ2dlcmVkXG4gICAqIGEgYGJsdXJgIGV2ZW50IG9uIGl0LlxuICAgKi9cbiAgZ2V0IHVudG91Y2hlZCgpOiBib29sZWFufG51bGwgeyByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnVudG91Y2hlZCA6IG51bGw7IH1cblxuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgZXZlcnkgdGltZSB0aGUgdmFsaWRhdGlvbiBzdGF0dXMgb2YgdGhlIGNvbnRyb2xcbiAgICogaXMgcmUtY2FsY3VsYXRlZC5cbiAgICovXG4gIGdldCBzdGF0dXNDaGFuZ2VzKCk6IE9ic2VydmFibGU8YW55PnxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLnN0YXR1c0NoYW5nZXMgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGV2ZW50IGV2ZXJ5IHRpbWUgdGhlIHZhbHVlIG9mIHRoZSBjb250cm9sIGNoYW5nZXMsIGluXG4gICAqIHRoZSBVSSBvciBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKi9cbiAgZ2V0IHZhbHVlQ2hhbmdlcygpOiBPYnNlcnZhYmxlPGFueT58bnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbCA/IHRoaXMuY29udHJvbC52YWx1ZUNoYW5nZXMgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtXG4gICAqIHRvIHRoaXMgY29udHJvbC4gRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb25cbiAgICogdGhhdCBsZXZlbC5cbiAgICovXG4gIGdldCBwYXRoKCk6IHN0cmluZ1tdfG51bGwgeyByZXR1cm4gbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGZvcm0gY29udHJvbC4gVGhpcyBtZWFucyBieSBkZWZhdWx0OlxuICAgKlxuICAgKiAqIGl0IGlzIG1hcmtlZCBhcyBgcHJpc3RpbmVgXG4gICAqICogaXQgaXMgbWFya2VkIGFzIGB1bnRvdWNoZWRgXG4gICAqICogdmFsdWUgaXMgc2V0IHRvIG51bGxcbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBgQWJzdHJhY3RDb250cm9sYC5cbiAgICovXG4gIHJlc2V0KHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sKSB0aGlzLmNvbnRyb2wucmVzZXQodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBwYXRoIGhhcyB0aGUgZXJyb3Igc3BlY2lmaWVkLiBPdGhlcndpc2VcbiAgICogcmV0dXJucyBmYWxzZS5cbiAgICpcbiAgICogSWYgbm8gcGF0aCBpcyBnaXZlbiwgaXQgY2hlY2tzIGZvciB0aGUgZXJyb3Igb24gdGhlIHByZXNlbnQgY29udHJvbC5cbiAgICovXG4gIGhhc0Vycm9yKGVycm9yQ29kZTogc3RyaW5nLCBwYXRoPzogc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmhhc0Vycm9yKGVycm9yQ29kZSwgcGF0aCkgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGVycm9yIGRhdGEgaWYgdGhlIGNvbnRyb2wgd2l0aCB0aGUgZ2l2ZW4gcGF0aCBoYXMgdGhlIGVycm9yIHNwZWNpZmllZC4gT3RoZXJ3aXNlXG4gICAqIHJldHVybnMgbnVsbCBvciB1bmRlZmluZWQuXG4gICAqXG4gICAqIElmIG5vIHBhdGggaXMgZ2l2ZW4sIGl0IGNoZWNrcyBmb3IgdGhlIGVycm9yIG9uIHRoZSBwcmVzZW50IGNvbnRyb2wuXG4gICAqL1xuICBnZXRFcnJvcihlcnJvckNvZGU6IHN0cmluZywgcGF0aD86IHN0cmluZ1tdKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9sID8gdGhpcy5jb250cm9sLmdldEVycm9yKGVycm9yQ29kZSwgcGF0aCkgOiBudWxsO1xuICB9XG59XG4iXX0=