/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/directives/reactive_directives/form_group_name.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Host, Inject, Input, Optional, Self, SkipSelf } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { AbstractFormGroupDirective } from '../abstract_form_group_directive';
import { ControlContainer } from '../control_container';
import { ReactiveErrors } from '../reactive_errors';
import { composeAsyncValidators, composeValidators, controlPath } from '../shared';
import { FormGroupDirective } from './form_group_directive';
/** @type {?} */
export const formGroupNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => FormGroupName))
};
/**
 * \@description
 *
 * Syncs a nested `FormGroup` to a DOM element.
 *
 * This directive can only be used with a parent `FormGroupDirective`.
 *
 * It accepts the string name of the nested `FormGroup` to link, and
 * looks for a `FormGroup` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * Use nested form groups to validate a sub-group of a
 * form separately from the rest or to group the values of certain
 * controls into their own nested object.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * \@usageNotes
 *
 * ### Access the group by name
 *
 * The following example uses the {\@link AbstractControl#get get} method to access the
 * associated `FormGroup`
 *
 * ```ts
 *   this.form.get('name');
 * ```
 *
 * ### Access individual controls in the group
 *
 * The following example uses the {\@link AbstractControl#get get} method to access
 * individual controls within the group using dot syntax.
 *
 * ```ts
 *   this.form.get('name.first');
 * ```
 *
 * ### Register a nested `FormGroup`.
 *
 * The following example registers a nested *name* `FormGroup` within an existing `FormGroup`,
 * and provides methods to retrieve the nested `FormGroup` and individual controls.
 *
 * {\@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
 *
 * \@ngModule ReactiveFormsModule
 * \@publicApi
 */
let FormGroupName = /** @class */ (() => {
    /**
     * \@description
     *
     * Syncs a nested `FormGroup` to a DOM element.
     *
     * This directive can only be used with a parent `FormGroupDirective`.
     *
     * It accepts the string name of the nested `FormGroup` to link, and
     * looks for a `FormGroup` registered with that name in the parent
     * `FormGroup` instance you passed into `FormGroupDirective`.
     *
     * Use nested form groups to validate a sub-group of a
     * form separately from the rest or to group the values of certain
     * controls into their own nested object.
     *
     * @see [Reactive Forms Guide](guide/reactive-forms)
     *
     * \@usageNotes
     *
     * ### Access the group by name
     *
     * The following example uses the {\@link AbstractControl#get get} method to access the
     * associated `FormGroup`
     *
     * ```ts
     *   this.form.get('name');
     * ```
     *
     * ### Access individual controls in the group
     *
     * The following example uses the {\@link AbstractControl#get get} method to access
     * individual controls within the group using dot syntax.
     *
     * ```ts
     *   this.form.get('name.first');
     * ```
     *
     * ### Register a nested `FormGroup`.
     *
     * The following example registers a nested *name* `FormGroup` within an existing `FormGroup`,
     * and provides methods to retrieve the nested `FormGroup` and individual controls.
     *
     * {\@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
     *
     * \@ngModule ReactiveFormsModule
     * \@publicApi
     */
    class FormGroupName extends AbstractFormGroupDirective {
        /**
         * @param {?} parent
         * @param {?} validators
         * @param {?} asyncValidators
         */
        constructor(parent, validators, asyncValidators) {
            super();
            this._parent = parent;
            this._validators = validators;
            this._asyncValidators = asyncValidators;
        }
        /**
         * \@internal
         * @return {?}
         */
        _checkParentType() {
            if (_hasInvalidParent(this._parent)) {
                ReactiveErrors.groupParentException();
            }
        }
    }
    FormGroupName.decorators = [
        { type: Directive, args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] },] }
    ];
    /** @nocollapse */
    FormGroupName.ctorParameters = () => [
        { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] },
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] }
    ];
    FormGroupName.propDecorators = {
        name: [{ type: Input, args: ['formGroupName',] }]
    };
    return FormGroupName;
})();
export { FormGroupName };
if (false) {
    /**
     * \@description
     * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * Accepts a name as a string or a number.
     * The name in the form of a string is useful for individual forms,
     * while the numerical form allows for form groups to be bound
     * to indices when iterating over groups in a `FormArray`.
     * @type {?}
     */
    FormGroupName.prototype.name;
}
/** @type {?} */
export const formArrayNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => FormArrayName))
};
/**
 * \@description
 *
 * Syncs a nested `FormArray` to a DOM element.
 *
 * This directive is designed to be used with a parent `FormGroupDirective` (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the nested `FormArray` you want to link, and
 * will look for a `FormArray` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
 * \@usageNotes
 *
 * ### Example
 *
 * {\@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
 *
 * \@ngModule ReactiveFormsModule
 * \@publicApi
 */
let FormArrayName = /** @class */ (() => {
    /**
     * \@description
     *
     * Syncs a nested `FormArray` to a DOM element.
     *
     * This directive is designed to be used with a parent `FormGroupDirective` (selector:
     * `[formGroup]`).
     *
     * It accepts the string name of the nested `FormArray` you want to link, and
     * will look for a `FormArray` registered with that name in the parent
     * `FormGroup` instance you passed into `FormGroupDirective`.
     *
     * @see [Reactive Forms Guide](guide/reactive-forms)
     * @see `AbstractControl`
     *
     * \@usageNotes
     *
     * ### Example
     *
     * {\@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
     *
     * \@ngModule ReactiveFormsModule
     * \@publicApi
     */
    class FormArrayName extends ControlContainer {
        /**
         * @param {?} parent
         * @param {?} validators
         * @param {?} asyncValidators
         */
        constructor(parent, validators, asyncValidators) {
            super();
            this._parent = parent;
            this._validators = validators;
            this._asyncValidators = asyncValidators;
        }
        /**
         * \@description
         * A lifecycle method called when the directive's inputs are initialized. For internal use only.
         *
         * @throws If the directive does not have a valid parent.
         * @return {?}
         */
        ngOnInit() {
            this._checkParentType();
            (/** @type {?} */ (this.formDirective)).addFormArray(this);
        }
        /**
         * \@description
         * A lifecycle method called before the directive's instance is destroyed. For internal use only.
         * @return {?}
         */
        ngOnDestroy() {
            if (this.formDirective) {
                this.formDirective.removeFormArray(this);
            }
        }
        /**
         * \@description
         * The `FormArray` bound to this directive.
         * @return {?}
         */
        get control() {
            return (/** @type {?} */ (this.formDirective)).getFormArray(this);
        }
        /**
         * \@description
         * The top-level directive for this group if present, otherwise null.
         * @return {?}
         */
        get formDirective() {
            return this._parent ? (/** @type {?} */ (this._parent.formDirective)) : null;
        }
        /**
         * \@description
         * Returns an array that represents the path from the top-level form to this control.
         * Each index is the string name of the control on that level.
         * @return {?}
         */
        get path() {
            return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
        }
        /**
         * \@description
         * Synchronous validator function composed of all the synchronous validators registered with this
         * directive.
         * @return {?}
         */
        get validator() {
            return composeValidators(this._validators);
        }
        /**
         * \@description
         * Async validator function composed of all the async validators registered with this directive.
         * @return {?}
         */
        get asyncValidator() {
            return composeAsyncValidators(this._asyncValidators);
        }
        /**
         * @private
         * @return {?}
         */
        _checkParentType() {
            if (_hasInvalidParent(this._parent)) {
                ReactiveErrors.arrayParentException();
            }
        }
    }
    FormArrayName.decorators = [
        { type: Directive, args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] },] }
    ];
    /** @nocollapse */
    FormArrayName.ctorParameters = () => [
        { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf }] },
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
        { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] }
    ];
    FormArrayName.propDecorators = {
        name: [{ type: Input, args: ['formArrayName',] }]
    };
    return FormArrayName;
})();
export { FormArrayName };
if (false) {
    /**
     * \@internal
     * @type {?}
     */
    FormArrayName.prototype._parent;
    /**
     * \@internal
     * @type {?}
     */
    FormArrayName.prototype._validators;
    /**
     * \@internal
     * @type {?}
     */
    FormArrayName.prototype._asyncValidators;
    /**
     * \@description
     * Tracks the name of the `FormArray` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * Accepts a name as a string or a number.
     * The name in the form of a string is useful for individual forms,
     * while the numerical form allows for form arrays to be bound
     * to indices when iterating over arrays in a `FormArray`.
     * @type {?}
     */
    FormArrayName.prototype.name;
}
/**
 * @param {?} parent
 * @return {?}
 */
function _hasInvalidParent(parent) {
    return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) &&
        !(parent instanceof FormArrayName);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3RILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUM1RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFDLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUdqRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQzs7QUFFMUQsTUFBTSxPQUFPLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsV0FBVyxFQUFFLFVBQVU7OztJQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBQztDQUM3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxNQUNhLGFBQWMsU0FBUSwwQkFBMEI7Ozs7OztRQWEzRCxZQUNvQyxNQUF3QixFQUNiLFVBQWlCLEVBQ1gsZUFBc0I7WUFDekUsS0FB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YyxDQUFDLG9CQUFvQixFQUFFLENBQUM7YUFDdkM7UUFDSCxDQUFDOzs7Z0JBcEdGLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFDOzs7O2dCQXhIcEUsZ0JBQWdCLHVCQWdKakIsUUFBUSxZQUFJLElBQUksWUFBSSxRQUFROzRDQUM1QixRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyxhQUFhOzRDQUN4QyxRQUFRLFlBQUksSUFBSSxZQUFJLE1BQU0sU0FBQyxtQkFBbUI7Ozt1QkFMbEQsS0FBSyxTQUFDLGVBQWU7O0lBZ0Z4QixvQkFBQztLQUFBO1NBcEdZLGFBQWE7Ozs7OztJQUV4QixnQ0FBMEI7Ozs7O0lBRzFCLG9DQUFtQjs7Ozs7SUFHbkIseUNBQXdCOzs7Ozs7Ozs7OztJQVl4Qiw2QkFBa0Q7Ozs7OztBQWtGcEQsU0FBUyxpQkFBaUIsQ0FBQyxNQUF3QjtJQUNqRCxPQUFPLENBQUMsQ0FBQyxNQUFNLFlBQVksYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sWUFBWSxrQkFBa0IsQ0FBQztRQUNoRixDQUFDLENBQUMsTUFBTSxZQUFZLGFBQWEsQ0FBQyxDQUFDO0FBQ3pDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBIb3N0LCBJbmplY3QsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgT3B0aW9uYWwsIFNlbGYsIFNraXBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtQXJyYXl9IGZyb20gJy4uLy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuLi9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4uL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7UmVhY3RpdmVFcnJvcnN9IGZyb20gJy4uL3JlYWN0aXZlX2Vycm9ycyc7XG5pbXBvcnQge2NvbXBvc2VBc3luY1ZhbGlkYXRvcnMsIGNvbXBvc2VWYWxpZGF0b3JzLCBjb250cm9sUGF0aH0gZnJvbSAnLi4vc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yRm59IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5cbmV4cG9ydCBjb25zdCBmb3JtR3JvdXBOYW1lUHJvdmlkZXI6IGFueSA9IHtcbiAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUdyb3VwTmFtZSlcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogU3luY3MgYSBuZXN0ZWQgYEZvcm1Hcm91cGAgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBjYW4gb25seSBiZSB1c2VkIHdpdGggYSBwYXJlbnQgYEZvcm1Hcm91cERpcmVjdGl2ZWAuXG4gKlxuICogSXQgYWNjZXB0cyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIG5lc3RlZCBgRm9ybUdyb3VwYCB0byBsaW5rLCBhbmRcbiAqIGxvb2tzIGZvciBhIGBGb3JtR3JvdXBgIHJlZ2lzdGVyZWQgd2l0aCB0aGF0IG5hbWUgaW4gdGhlIHBhcmVudFxuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgeW91IHBhc3NlZCBpbnRvIGBGb3JtR3JvdXBEaXJlY3RpdmVgLlxuICpcbiAqIFVzZSBuZXN0ZWQgZm9ybSBncm91cHMgdG8gdmFsaWRhdGUgYSBzdWItZ3JvdXAgb2YgYVxuICogZm9ybSBzZXBhcmF0ZWx5IGZyb20gdGhlIHJlc3Qgb3IgdG8gZ3JvdXAgdGhlIHZhbHVlcyBvZiBjZXJ0YWluXG4gKiBjb250cm9scyBpbnRvIHRoZWlyIG93biBuZXN0ZWQgb2JqZWN0LlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9yZWFjdGl2ZS1mb3JtcylcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBBY2Nlc3MgdGhlIGdyb3VwIGJ5IG5hbWVcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgdXNlcyB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCNnZXQgZ2V0fSBtZXRob2QgdG8gYWNjZXNzIHRoZVxuICogYXNzb2NpYXRlZCBgRm9ybUdyb3VwYFxuICpcbiAqIGBgYHRzXG4gKiAgIHRoaXMuZm9ybS5nZXQoJ25hbWUnKTtcbiAqIGBgYFxuICpcbiAqICMjIyBBY2Nlc3MgaW5kaXZpZHVhbCBjb250cm9scyBpbiB0aGUgZ3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgdXNlcyB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCNnZXQgZ2V0fSBtZXRob2QgdG8gYWNjZXNzXG4gKiBpbmRpdmlkdWFsIGNvbnRyb2xzIHdpdGhpbiB0aGUgZ3JvdXAgdXNpbmcgZG90IHN5bnRheC5cbiAqXG4gKiBgYGB0c1xuICogICB0aGlzLmZvcm0uZ2V0KCduYW1lLmZpcnN0Jyk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVnaXN0ZXIgYSBuZXN0ZWQgYEZvcm1Hcm91cGAuXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJlZ2lzdGVycyBhIG5lc3RlZCAqbmFtZSogYEZvcm1Hcm91cGAgd2l0aGluIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgLFxuICogYW5kIHByb3ZpZGVzIG1ldGhvZHMgdG8gcmV0cmlldmUgdGhlIG5lc3RlZCBgRm9ybUdyb3VwYCBhbmQgaW5kaXZpZHVhbCBjb250cm9scy5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvbmVzdGVkRm9ybUdyb3VwL25lc3RlZF9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Hcm91cE5hbWVdJywgcHJvdmlkZXJzOiBbZm9ybUdyb3VwTmFtZVByb3ZpZGVyXX0pXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwTmFtZSBleHRlbmRzIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICogQWNjZXB0cyBhIG5hbWUgYXMgYSBzdHJpbmcgb3IgYSBudW1iZXIuXG4gICAqIFRoZSBuYW1lIGluIHRoZSBmb3JtIG9mIGEgc3RyaW5nIGlzIHVzZWZ1bCBmb3IgaW5kaXZpZHVhbCBmb3JtcyxcbiAgICogd2hpbGUgdGhlIG51bWVyaWNhbCBmb3JtIGFsbG93cyBmb3IgZm9ybSBncm91cHMgdG8gYmUgYm91bmRcbiAgICogdG8gaW5kaWNlcyB3aGVuIGl0ZXJhdGluZyBvdmVyIGdyb3VwcyBpbiBhIGBGb3JtQXJyYXlgLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnZm9ybUdyb3VwTmFtZScpIG5hbWUhOiBzdHJpbmd8bnVtYmVyfG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIEBTa2lwU2VsZigpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiBhbnlbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBhc3luY1ZhbGlkYXRvcnM6IGFueVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnM7XG4gICAgdGhpcy5fYXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3JzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmIChfaGFzSW52YWxpZFBhcmVudCh0aGlzLl9wYXJlbnQpKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5ncm91cFBhcmVudEV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZm9ybUFycmF5TmFtZVByb3ZpZGVyOiBhbnkgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1BcnJheU5hbWUpXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFN5bmNzIGEgbmVzdGVkIGBGb3JtQXJyYXlgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIGEgcGFyZW50IGBGb3JtR3JvdXBEaXJlY3RpdmVgIChzZWxlY3RvcjpcbiAqIGBbZm9ybUdyb3VwXWApLlxuICpcbiAqIEl0IGFjY2VwdHMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBuZXN0ZWQgYEZvcm1BcnJheWAgeW91IHdhbnQgdG8gbGluaywgYW5kXG4gKiB3aWxsIGxvb2sgZm9yIGEgYEZvcm1BcnJheWAgcmVnaXN0ZXJlZCB3aXRoIHRoYXQgbmFtZSBpbiB0aGUgcGFyZW50XG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB5b3UgcGFzc2VkIGludG8gYEZvcm1Hcm91cERpcmVjdGl2ZWAuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvbmVzdGVkRm9ybUFycmF5L25lc3RlZF9mb3JtX2FycmF5X2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1BcnJheU5hbWVdJywgcHJvdmlkZXJzOiBbZm9ybUFycmF5TmFtZVByb3ZpZGVyXX0pXG5leHBvcnQgY2xhc3MgRm9ybUFycmF5TmFtZSBleHRlbmRzIENvbnRyb2xDb250YWluZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BhcmVudDogQ29udHJvbENvbnRhaW5lcjtcblxuICAvKiogQGludGVybmFsICovXG4gIF92YWxpZGF0b3JzOiBhbnlbXTtcblxuICAvKiogQGludGVybmFsICovXG4gIF9hc3luY1ZhbGlkYXRvcnM6IGFueVtdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgRm9ybUFycmF5YCBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBUaGUgbmFtZSBjb3JyZXNwb25kc1xuICAgKiB0byBhIGtleSBpbiB0aGUgcGFyZW50IGBGb3JtR3JvdXBgIG9yIGBGb3JtQXJyYXlgLlxuICAgKiBBY2NlcHRzIGEgbmFtZSBhcyBhIHN0cmluZyBvciBhIG51bWJlci5cbiAgICogVGhlIG5hbWUgaW4gdGhlIGZvcm0gb2YgYSBzdHJpbmcgaXMgdXNlZnVsIGZvciBpbmRpdmlkdWFsIGZvcm1zLFxuICAgKiB3aGlsZSB0aGUgbnVtZXJpY2FsIGZvcm0gYWxsb3dzIGZvciBmb3JtIGFycmF5cyB0byBiZSBib3VuZFxuICAgKiB0byBpbmRpY2VzIHdoZW4gaXRlcmF0aW5nIG92ZXIgYXJyYXlzIGluIGEgYEZvcm1BcnJheWAuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCdmb3JtQXJyYXlOYW1lJykgbmFtZSE6IHN0cmluZ3xudW1iZXJ8bnVsbDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgQFNraXBTZWxmKCkgcGFyZW50OiBDb250cm9sQ29udGFpbmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IGFueVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczogYW55W10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl92YWxpZGF0b3JzID0gdmFsaWRhdG9ycztcbiAgICB0aGlzLl9hc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcnM7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEEgbGlmZWN5Y2xlIG1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgZGlyZWN0aXZlJ3MgaW5wdXRzIGFyZSBpbml0aWFsaXplZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKlxuICAgKiBAdGhyb3dzIElmIHRoZSBkaXJlY3RpdmUgZG9lcyBub3QgaGF2ZSBhIHZhbGlkIHBhcmVudC5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgIHRoaXMuZm9ybURpcmVjdGl2ZSEuYWRkRm9ybUFycmF5KHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIGJlZm9yZSB0aGUgZGlyZWN0aXZlJ3MgaW5zdGFuY2UgaXMgZGVzdHJveWVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb3JtRGlyZWN0aXZlKSB7XG4gICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlRm9ybUFycmF5KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGBGb3JtQXJyYXlgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgZ2V0IGNvbnRyb2woKTogRm9ybUFycmF5IHtcbiAgICByZXR1cm4gdGhpcy5mb3JtRGlyZWN0aXZlIS5nZXRGb3JtQXJyYXkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGdyb3VwIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgZ2V0IGZvcm1EaXJlY3RpdmUoKTogRm9ybUdyb3VwRGlyZWN0aXZlfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyA8Rm9ybUdyb3VwRGlyZWN0aXZlPnRoaXMuX3BhcmVudC5mb3JtRGlyZWN0aXZlIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgKi9cbiAgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBjb250cm9sUGF0aCh0aGlzLm5hbWUgPT0gbnVsbCA/IHRoaXMubmFtZSA6IHRoaXMubmFtZS50b1N0cmluZygpLCB0aGlzLl9wYXJlbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24gY29tcG9zZWQgb2YgYWxsIHRoZSBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzXG4gICAqIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCB2YWxpZGF0b3IoKTogVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgcmV0dXJuIGNvbXBvc2VWYWxpZGF0b3JzKHRoaXMuX3ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBc3luYyB2YWxpZGF0b3IgZnVuY3Rpb24gY29tcG9zZWQgb2YgYWxsIHRoZSBhc3luYyB2YWxpZGF0b3JzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCBhc3luY1ZhbGlkYXRvcigpOiBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHRoaXMuX2FzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja1BhcmVudFR5cGUoKTogdm9pZCB7XG4gICAgaWYgKF9oYXNJbnZhbGlkUGFyZW50KHRoaXMuX3BhcmVudCkpIHtcbiAgICAgIFJlYWN0aXZlRXJyb3JzLmFycmF5UGFyZW50RXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIF9oYXNJbnZhbGlkUGFyZW50KHBhcmVudDogQ29udHJvbENvbnRhaW5lcik6IGJvb2xlYW4ge1xuICByZXR1cm4gIShwYXJlbnQgaW5zdGFuY2VvZiBGb3JtR3JvdXBOYW1lKSAmJiAhKHBhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cERpcmVjdGl2ZSkgJiZcbiAgICAgICEocGFyZW50IGluc3RhbmNlb2YgRm9ybUFycmF5TmFtZSk7XG59XG4iXX0=