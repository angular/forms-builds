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
 * An interface that `FormGroupDirective` and `NgForm` implement.
 *
 * Only used by the forms module.
 *
 *
 * @record
 */
export function Form() { }
/**
 * Add a control to this form.
 * @type {?}
 */
Form.prototype.addControl;
/**
 * Remove a control from this form.
 * @type {?}
 */
Form.prototype.removeControl;
/**
 * Look up the `FormControl` associated with a particular `NgControl`.
 * @type {?}
 */
Form.prototype.getControl;
/**
 * Add a group of controls to this form.
 * @type {?}
 */
Form.prototype.addFormGroup;
/**
 * Remove a group of controls from this form.
 * @type {?}
 */
Form.prototype.removeFormGroup;
/**
 * Look up the `FormGroup` associated with a particular `AbstractFormGroupDirective`.
 * @type {?}
 */
Form.prototype.getFormGroup;
/**
 * Update the model for a particular control with a new value.
 * @type {?}
 */
Form.prototype.updateModel;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9pbnRlcmZhY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9mb3JtX2ludGVyZmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Zvcm1Db250cm9sLCBGb3JtR3JvdXB9IGZyb20gJy4uL21vZGVsJztcblxuaW1wb3J0IHtBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcblxuXG5cbi8qKlxuICogQW4gaW50ZXJmYWNlIHRoYXQgYEZvcm1Hcm91cERpcmVjdGl2ZWAgYW5kIGBOZ0Zvcm1gIGltcGxlbWVudC5cbiAqXG4gKiBPbmx5IHVzZWQgYnkgdGhlIGZvcm1zIG1vZHVsZS5cbiAqXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZvcm0ge1xuICAvKipcbiAgICogQWRkIGEgY29udHJvbCB0byB0aGlzIGZvcm0uXG4gICAqL1xuICBhZGRDb250cm9sKGRpcjogTmdDb250cm9sKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGEgY29udHJvbCBmcm9tIHRoaXMgZm9ybS5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2woZGlyOiBOZ0NvbnRyb2wpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBMb29rIHVwIHRoZSBgRm9ybUNvbnRyb2xgIGFzc29jaWF0ZWQgd2l0aCBhIHBhcnRpY3VsYXIgYE5nQ29udHJvbGAuXG4gICAqL1xuICBnZXRDb250cm9sKGRpcjogTmdDb250cm9sKTogRm9ybUNvbnRyb2w7XG5cbiAgLyoqXG4gICAqIEFkZCBhIGdyb3VwIG9mIGNvbnRyb2xzIHRvIHRoaXMgZm9ybS5cbiAgICovXG4gIGFkZEZvcm1Hcm91cChkaXI6IEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlKTogdm9pZDtcblxuICAvKipcbiAgICogUmVtb3ZlIGEgZ3JvdXAgb2YgY29udHJvbHMgZnJvbSB0aGlzIGZvcm0uXG4gICAqL1xuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIExvb2sgdXAgdGhlIGBGb3JtR3JvdXBgIGFzc29jaWF0ZWQgd2l0aCBhIHBhcnRpY3VsYXIgYEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlYC5cbiAgICovXG4gIGdldEZvcm1Hcm91cChkaXI6IEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlKTogRm9ybUdyb3VwO1xuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIG1vZGVsIGZvciBhIHBhcnRpY3VsYXIgY29udHJvbCB3aXRoIGEgbmV3IHZhbHVlLlxuICAgKi9cbiAgdXBkYXRlTW9kZWwoZGlyOiBOZ0NvbnRyb2wsIHZhbHVlOiBhbnkpOiB2b2lkO1xufVxuIl19