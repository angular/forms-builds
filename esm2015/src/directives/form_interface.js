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
 * An interface implemented by `FormGroupDirective` and `NgForm` directives.
 *
 * Only used by the `ReactiveFormsModule` and `FormsModule`.
 *
 * \@publicApi
 * @record
 */
export function Form() { }
/**
 * \@description
 * Add a control to this form.
 *
 * \@param dir The control directive to add to the form.
 * @type {?}
 */
Form.prototype.addControl;
/**
 * \@description
 * Remove a control from this form.
 *
 * \@param dir: The control directive to remove from the form.
 * @type {?}
 */
Form.prototype.removeControl;
/**
 * \@description
 * The control directive from which to get the `FormControl`.
 *
 * \@param dir: The control directive.
 * @type {?}
 */
Form.prototype.getControl;
/**
 * \@description
 * Add a group of controls to this form.
 *
 * \@param dir: The control group directive to add.
 * @type {?}
 */
Form.prototype.addFormGroup;
/**
 * \@description
 * Remove a group of controls to this form.
 *
 * \@param dir: The control group directive to remove.
 * @type {?}
 */
Form.prototype.removeFormGroup;
/**
 * \@description
 * The `FormGroup` associated with a particular `AbstractFormGroupDirective`.
 *
 * \@param dir: The form group directive from which to get the `FormGroup`.
 * @type {?}
 */
Form.prototype.getFormGroup;
/**
 * \@description
 * Update the model for a particular control with a new value.
 *
 * \@param dir: The control directive to update.
 * \@param value: The new value for the control.
 * @type {?}
 */
Form.prototype.updateModel;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9mb3JtX2ludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtR3JvdXB9IGZyb20gJy4uL21vZGVsJztcblxuaW1wb3J0IHtBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcblxuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBbiBpbnRlcmZhY2UgaW1wbGVtZW50ZWQgYnkgYEZvcm1Hcm91cERpcmVjdGl2ZWAgYW5kIGBOZ0Zvcm1gIGRpcmVjdGl2ZXMuXG4gKlxuICogT25seSB1c2VkIGJ5IHRoZSBgUmVhY3RpdmVGb3Jtc01vZHVsZWAgYW5kIGBGb3Jtc01vZHVsZWAuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZvcm0ge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZCBhIGNvbnRyb2wgdG8gdGhpcyBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBjb250cm9sIGRpcmVjdGl2ZSB0byBhZGQgdG8gdGhlIGZvcm0uXG4gICAqL1xuICBhZGRDb250cm9sKGRpcjogTmdDb250cm9sKTogdm9pZDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlbW92ZSBhIGNvbnRyb2wgZnJvbSB0aGlzIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSBkaXI6IFRoZSBjb250cm9sIGRpcmVjdGl2ZSB0byByZW1vdmUgZnJvbSB0aGUgZm9ybS5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2woZGlyOiBOZ0NvbnRyb2wpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGNvbnRyb2wgZGlyZWN0aXZlIGZyb20gd2hpY2ggdG8gZ2V0IHRoZSBgRm9ybUNvbnRyb2xgLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyOiBUaGUgY29udHJvbCBkaXJlY3RpdmUuXG4gICAqL1xuICBnZXRDb250cm9sKGRpcjogTmdDb250cm9sKTogRm9ybUNvbnRyb2w7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBZGQgYSBncm91cCBvZiBjb250cm9scyB0byB0aGlzIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSBkaXI6IFRoZSBjb250cm9sIGdyb3VwIGRpcmVjdGl2ZSB0byBhZGQuXG4gICAqL1xuICBhZGRGb3JtR3JvdXAoZGlyOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZW1vdmUgYSBncm91cCBvZiBjb250cm9scyB0byB0aGlzIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSBkaXI6IFRoZSBjb250cm9sIGdyb3VwIGRpcmVjdGl2ZSB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgYEZvcm1Hcm91cGAgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmVgLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyOiBUaGUgZm9ybSBncm91cCBkaXJlY3RpdmUgZnJvbSB3aGljaCB0byBnZXQgdGhlIGBGb3JtR3JvdXBgLlxuICAgKi9cbiAgZ2V0Rm9ybUdyb3VwKGRpcjogQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUpOiBGb3JtR3JvdXA7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBVcGRhdGUgdGhlIG1vZGVsIGZvciBhIHBhcnRpY3VsYXIgY29udHJvbCB3aXRoIGEgbmV3IHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyOiBUaGUgY29udHJvbCBkaXJlY3RpdmUgdG8gdXBkYXRlLlxuICAgKiBAcGFyYW0gdmFsdWU6IFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBjb250cm9sLlxuICAgKi9cbiAgdXBkYXRlTW9kZWwoZGlyOiBOZ0NvbnRyb2wsIHZhbHVlOiBhbnkpOiB2b2lkO1xufVxuIl19