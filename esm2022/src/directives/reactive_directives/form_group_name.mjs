/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Host, Inject, Input, Optional, Self, SkipSelf, } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { AbstractFormGroupDirective } from '../abstract_form_group_directive';
import { ControlContainer } from '../control_container';
import { arrayParentException, groupParentException } from '../reactive_errors';
import { controlPath } from '../shared';
import { FormGroupDirective } from './form_group_directive';
import * as i0 from "@angular/core";
import * as i1 from "../control_container";
const formGroupNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupName),
};
/**
 * @description
 *
 * Syncs a nested `FormGroup` or `FormRecord` to a DOM element.
 *
 * This directive can only be used with a parent `FormGroupDirective`.
 *
 * It accepts the string name of the nested `FormGroup` or `FormRecord` to link, and
 * looks for a `FormGroup` or `FormRecord` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * Use nested form groups to validate a sub-group of a
 * form separately from the rest or to group the values of certain
 * controls into their own nested object.
 *
 * @see [Reactive Forms Guide](guide/forms/reactive-forms)
 *
 * @usageNotes
 *
 * ### Access the group by name
 *
 * The following example uses the `AbstractControl.get` method to access the
 * associated `FormGroup`
 *
 * ```ts
 *   this.form.get('name');
 * ```
 *
 * ### Access individual controls in the group
 *
 * The following example uses the `AbstractControl.get` method to access
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
 * {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormGroupName extends AbstractFormGroupDirective {
    constructor(parent, validators, asyncValidators) {
        super();
        /**
         * @description
         * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
         * to a key in the parent `FormGroup` or `FormArray`.
         * Accepts a name as a string or a number.
         * The name in the form of a string is useful for individual forms,
         * while the numerical form allows for form groups to be bound
         * to indices when iterating over groups in a `FormArray`.
         */
        this.name = null;
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @internal */
    _checkParentType() {
        if (_hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw groupParentException();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: FormGroupName, deps: [{ token: i1.ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.0-next.0+sha-f271021", type: FormGroupName, selector: "[formGroupName]", inputs: { name: ["formGroupName", "name"] }, providers: [formGroupNameProvider], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: FormGroupName, decorators: [{
            type: Directive,
            args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] }]
        }], ctorParameters: () => [{ type: i1.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Host
                }, {
                    type: SkipSelf
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }], propDecorators: { name: [{
                type: Input,
                args: ['formGroupName']
            }] } });
export const formArrayNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormArrayName),
};
/**
 * @description
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
 * @see [Reactive Forms Guide](guide/forms/reactive-forms)
 * @see {@link AbstractControl}
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormArrayName extends ControlContainer {
    constructor(parent, validators, asyncValidators) {
        super();
        /**
         * @description
         * Tracks the name of the `FormArray` bound to the directive. The name corresponds
         * to a key in the parent `FormGroup` or `FormArray`.
         * Accepts a name as a string or a number.
         * The name in the form of a string is useful for individual forms,
         * while the numerical form allows for form arrays to be bound
         * to indices when iterating over arrays in a `FormArray`.
         */
        this.name = null;
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /**
     * A lifecycle method called when the directive's inputs are initialized. For internal use only.
     * @throws If the directive does not have a valid parent.
     * @nodoc
     */
    ngOnInit() {
        this._checkParentType();
        this.formDirective.addFormArray(this);
    }
    /**
     * A lifecycle method called before the directive's instance is destroyed. For internal use only.
     * @nodoc
     */
    ngOnDestroy() {
        if (this.formDirective) {
            this.formDirective.removeFormArray(this);
        }
    }
    /**
     * @description
     * The `FormArray` bound to this directive.
     */
    get control() {
        return this.formDirective.getFormArray(this);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    _checkParentType() {
        if (_hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw arrayParentException();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: FormArrayName, deps: [{ token: i1.ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.0-next.0+sha-f271021", type: FormArrayName, selector: "[formArrayName]", inputs: { name: ["formArrayName", "name"] }, providers: [formArrayNameProvider], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: FormArrayName, decorators: [{
            type: Directive,
            args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] }]
        }], ctorParameters: () => [{ type: i1.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Host
                }, {
                    type: SkipSelf
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_VALIDATORS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }, {
                    type: Inject,
                    args: [NG_ASYNC_VALIDATORS]
                }] }], propDecorators: { name: [{
                type: Input,
                args: ['formArrayName']
            }] } });
function _hasInvalidParent(parent) {
    return (!(parent instanceof FormGroupName) &&
        !(parent instanceof FormGroupDirective) &&
        !(parent instanceof FormArrayName));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsSUFBSSxFQUNKLE1BQU0sRUFDTixLQUFLLEVBR0wsUUFBUSxFQUVSLElBQUksRUFDSixRQUFRLEdBQ1QsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQzlFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFHdEMsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7OztBQUUxRCxNQUFNLHFCQUFxQixHQUFhO0lBQ3RDLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7Q0FDN0MsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENHO0FBRUgsTUFBTSxPQUFPLGFBQWMsU0FBUSwwQkFBMEI7SUFZM0QsWUFDa0MsTUFBd0IsRUFDYixVQUF1QyxFQUlsRixlQUFzRDtRQUV0RCxLQUFLLEVBQUUsQ0FBQztRQW5CVjs7Ozs7Ozs7V0FRRztRQUM4QixTQUFJLEdBQTJCLElBQUks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SyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUN2RixNQUFNLG9CQUFvQixFQUFFLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7eUhBOUVVLGFBQWEsOEZBaUJNLGFBQWEseUNBR2pDLG1CQUFtQjs2R0FwQmxCLGFBQWEsdUZBRDBCLENBQUMscUJBQXFCLENBQUM7O3NHQUM5RCxhQUFhO2tCQUR6QixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLEVBQUM7OzBCQWlCdkUsUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksUUFBUTs7MEJBQzVCLFFBQVE7OzBCQUFJLElBQUk7OzBCQUFJLE1BQU07MkJBQUMsYUFBYTs7MEJBQ3hDLFFBQVE7OzBCQUNSLElBQUk7OzBCQUNKLE1BQU07MkJBQUMsbUJBQW1CO3lDQVBJLElBQUk7c0JBQXBDLEtBQUs7dUJBQUMsZUFBZTs7QUFvRXhCLFNBQVMsaUJBQWlCLENBQUMsTUFBd0I7SUFDakQsT0FBTyxDQUNMLENBQUMsQ0FBQyxNQUFNLFlBQVksYUFBYSxDQUFDO1FBQ2xDLENBQUMsQ0FBQyxNQUFNLFlBQVksa0JBQWtCLENBQUM7UUFDdkMsQ0FBQyxDQUFDLE1BQU0sWUFBWSxhQUFhLENBQUMsQ0FDbkMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFByb3ZpZGVyLFxuICBTZWxmLFxuICBTa2lwU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUFycmF5fSBmcm9tICcuLi8uLi9tb2RlbC9mb3JtX2FycmF5JztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0Fic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuLi9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4uL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7YXJyYXlQYXJlbnRFeGNlcHRpb24sIGdyb3VwUGFyZW50RXhjZXB0aW9ufSBmcm9tICcuLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtjb250cm9sUGF0aH0gZnJvbSAnLi4vc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5cbmNvbnN0IGZvcm1Hcm91cE5hbWVQcm92aWRlcjogUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Hcm91cE5hbWUpLFxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBTeW5jcyBhIG5lc3RlZCBgRm9ybUdyb3VwYCBvciBgRm9ybVJlY29yZGAgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBjYW4gb25seSBiZSB1c2VkIHdpdGggYSBwYXJlbnQgYEZvcm1Hcm91cERpcmVjdGl2ZWAuXG4gKlxuICogSXQgYWNjZXB0cyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIG5lc3RlZCBgRm9ybUdyb3VwYCBvciBgRm9ybVJlY29yZGAgdG8gbGluaywgYW5kXG4gKiBsb29rcyBmb3IgYSBgRm9ybUdyb3VwYCBvciBgRm9ybVJlY29yZGAgcmVnaXN0ZXJlZCB3aXRoIHRoYXQgbmFtZSBpbiB0aGUgcGFyZW50XG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB5b3UgcGFzc2VkIGludG8gYEZvcm1Hcm91cERpcmVjdGl2ZWAuXG4gKlxuICogVXNlIG5lc3RlZCBmb3JtIGdyb3VwcyB0byB2YWxpZGF0ZSBhIHN1Yi1ncm91cCBvZiBhXG4gKiBmb3JtIHNlcGFyYXRlbHkgZnJvbSB0aGUgcmVzdCBvciB0byBncm91cCB0aGUgdmFsdWVzIG9mIGNlcnRhaW5cbiAqIGNvbnRyb2xzIGludG8gdGhlaXIgb3duIG5lc3RlZCBvYmplY3QuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL2Zvcm1zL3JlYWN0aXZlLWZvcm1zKVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEFjY2VzcyB0aGUgZ3JvdXAgYnkgbmFtZVxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSB1c2VzIHRoZSBgQWJzdHJhY3RDb250cm9sLmdldGAgbWV0aG9kIHRvIGFjY2VzcyB0aGVcbiAqIGFzc29jaWF0ZWQgYEZvcm1Hcm91cGBcbiAqXG4gKiBgYGB0c1xuICogICB0aGlzLmZvcm0uZ2V0KCduYW1lJyk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQWNjZXNzIGluZGl2aWR1YWwgY29udHJvbHMgaW4gdGhlIGdyb3VwXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHVzZXMgdGhlIGBBYnN0cmFjdENvbnRyb2wuZ2V0YCBtZXRob2QgdG8gYWNjZXNzXG4gKiBpbmRpdmlkdWFsIGNvbnRyb2xzIHdpdGhpbiB0aGUgZ3JvdXAgdXNpbmcgZG90IHN5bnRheC5cbiAqXG4gKiBgYGB0c1xuICogICB0aGlzLmZvcm0uZ2V0KCduYW1lLmZpcnN0Jyk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgUmVnaXN0ZXIgYSBuZXN0ZWQgYEZvcm1Hcm91cGAuXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHJlZ2lzdGVycyBhIG5lc3RlZCAqbmFtZSogYEZvcm1Hcm91cGAgd2l0aGluIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgLFxuICogYW5kIHByb3ZpZGVzIG1ldGhvZHMgdG8gcmV0cmlldmUgdGhlIG5lc3RlZCBgRm9ybUdyb3VwYCBhbmQgaW5kaXZpZHVhbCBjb250cm9scy5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvbmVzdGVkRm9ybUdyb3VwL25lc3RlZF9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Hcm91cE5hbWVdJywgcHJvdmlkZXJzOiBbZm9ybUdyb3VwTmFtZVByb3ZpZGVyXX0pXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwTmFtZSBleHRlbmRzIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICogQWNjZXB0cyBhIG5hbWUgYXMgYSBzdHJpbmcgb3IgYSBudW1iZXIuXG4gICAqIFRoZSBuYW1lIGluIHRoZSBmb3JtIG9mIGEgc3RyaW5nIGlzIHVzZWZ1bCBmb3IgaW5kaXZpZHVhbCBmb3JtcyxcbiAgICogd2hpbGUgdGhlIG51bWVyaWNhbCBmb3JtIGFsbG93cyBmb3IgZm9ybSBncm91cHMgdG8gYmUgYm91bmRcbiAgICogdG8gaW5kaWNlcyB3aGVuIGl0ZXJhdGluZyBvdmVyIGdyb3VwcyBpbiBhIGBGb3JtQXJyYXlgLlxuICAgKi9cbiAgQElucHV0KCdmb3JtR3JvdXBOYW1lJykgb3ZlcnJpZGUgbmFtZTogc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQE9wdGlvbmFsKCkgQEhvc3QoKSBAU2tpcFNlbGYoKSBwYXJlbnQ6IENvbnRyb2xDb250YWluZXIsXG4gICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IChWYWxpZGF0b3IgfCBWYWxpZGF0b3JGbilbXSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBTZWxmKClcbiAgICBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpXG4gICAgYXN5bmNWYWxpZGF0b3JzOiAoQXN5bmNWYWxpZGF0b3IgfCBBc3luY1ZhbGlkYXRvckZuKVtdLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX3NldEFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmIChfaGFzSW52YWxpZFBhcmVudCh0aGlzLl9wYXJlbnQpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBncm91cFBhcmVudEV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZm9ybUFycmF5TmFtZVByb3ZpZGVyOiBhbnkgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1BcnJheU5hbWUpLFxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBTeW5jcyBhIG5lc3RlZCBgRm9ybUFycmF5YCB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGlzIGRlc2lnbmVkIHRvIGJlIHVzZWQgd2l0aCBhIHBhcmVudCBgRm9ybUdyb3VwRGlyZWN0aXZlYCAoc2VsZWN0b3I6XG4gKiBgW2Zvcm1Hcm91cF1gKS5cbiAqXG4gKiBJdCBhY2NlcHRzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgbmVzdGVkIGBGb3JtQXJyYXlgIHlvdSB3YW50IHRvIGxpbmssIGFuZFxuICogd2lsbCBsb29rIGZvciBhIGBGb3JtQXJyYXlgIHJlZ2lzdGVyZWQgd2l0aCB0aGF0IG5hbWUgaW4gdGhlIHBhcmVudFxuICogYEZvcm1Hcm91cGAgaW5zdGFuY2UgeW91IHBhc3NlZCBpbnRvIGBGb3JtR3JvdXBEaXJlY3RpdmVgLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9mb3Jtcy9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbH1cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL25lc3RlZEZvcm1BcnJheS9uZXN0ZWRfZm9ybV9hcnJheV9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQXJyYXlOYW1lXScsIHByb3ZpZGVyczogW2Zvcm1BcnJheU5hbWVQcm92aWRlcl19KVxuZXhwb3J0IGNsYXNzIEZvcm1BcnJheU5hbWUgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKiogQGludGVybmFsICovXG4gIF9wYXJlbnQ6IENvbnRyb2xDb250YWluZXI7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIG5hbWUgb2YgdGhlIGBGb3JtQXJyYXlgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAqIEFjY2VwdHMgYSBuYW1lIGFzIGEgc3RyaW5nIG9yIGEgbnVtYmVyLlxuICAgKiBUaGUgbmFtZSBpbiB0aGUgZm9ybSBvZiBhIHN0cmluZyBpcyB1c2VmdWwgZm9yIGluZGl2aWR1YWwgZm9ybXMsXG4gICAqIHdoaWxlIHRoZSBudW1lcmljYWwgZm9ybSBhbGxvd3MgZm9yIGZvcm0gYXJyYXlzIHRvIGJlIGJvdW5kXG4gICAqIHRvIGluZGljZXMgd2hlbiBpdGVyYXRpbmcgb3ZlciBhcnJheXMgaW4gYSBgRm9ybUFycmF5YC5cbiAgICovXG4gIEBJbnB1dCgnZm9ybUFycmF5TmFtZScpIG92ZXJyaWRlIG5hbWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgQFNraXBTZWxmKCkgcGFyZW50OiBDb250cm9sQ29udGFpbmVyLFxuICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiAoVmFsaWRhdG9yIHwgVmFsaWRhdG9yRm4pW10sXG4gICAgQE9wdGlvbmFsKClcbiAgICBAU2VsZigpXG4gICAgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKVxuICAgIGFzeW5jVmFsaWRhdG9yczogKEFzeW5jVmFsaWRhdG9yIHwgQXN5bmNWYWxpZGF0b3JGbilbXSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fc2V0VmFsaWRhdG9ycyh2YWxpZGF0b3JzKTtcbiAgICB0aGlzLl9zZXRBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGRpcmVjdGl2ZSdzIGlucHV0cyBhcmUgaW5pdGlhbGl6ZWQuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICogQHRocm93cyBJZiB0aGUgZGlyZWN0aXZlIGRvZXMgbm90IGhhdmUgYSB2YWxpZCBwYXJlbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tQYXJlbnRUeXBlKCk7XG4gICAgdGhpcy5mb3JtRGlyZWN0aXZlIS5hZGRGb3JtQXJyYXkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCBiZWZvcmUgdGhlIGRpcmVjdGl2ZSdzIGluc3RhbmNlIGlzIGRlc3Ryb3llZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgIHRoaXMuZm9ybURpcmVjdGl2ZS5yZW1vdmVGb3JtQXJyYXkodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgYEZvcm1BcnJheWAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBvdmVycmlkZSBnZXQgY29udHJvbCgpOiBGb3JtQXJyYXkge1xuICAgIHJldHVybiB0aGlzLmZvcm1EaXJlY3RpdmUhLmdldEZvcm1BcnJheSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgZ3JvdXAgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBvdmVycmlkZSBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtR3JvdXBEaXJlY3RpdmUgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gPEZvcm1Hcm91cERpcmVjdGl2ZT50aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYW4gYXJyYXkgdGhhdCByZXByZXNlbnRzIHRoZSBwYXRoIGZyb20gdGhlIHRvcC1sZXZlbCBmb3JtIHRvIHRoaXMgY29udHJvbC5cbiAgICogRWFjaCBpbmRleCBpcyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGNvbnRyb2wgb24gdGhhdCBsZXZlbC5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gY29udHJvbFBhdGgodGhpcy5uYW1lID09IG51bGwgPyB0aGlzLm5hbWUgOiB0aGlzLm5hbWUudG9TdHJpbmcoKSwgdGhpcy5fcGFyZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrUGFyZW50VHlwZSgpOiB2b2lkIHtcbiAgICBpZiAoX2hhc0ludmFsaWRQYXJlbnQodGhpcy5fcGFyZW50KSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgYXJyYXlQYXJlbnRFeGNlcHRpb24oKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gX2hhc0ludmFsaWRQYXJlbnQocGFyZW50OiBDb250cm9sQ29udGFpbmVyKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgIShwYXJlbnQgaW5zdGFuY2VvZiBGb3JtR3JvdXBOYW1lKSAmJlxuICAgICEocGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwRGlyZWN0aXZlKSAmJlxuICAgICEocGFyZW50IGluc3RhbmNlb2YgRm9ybUFycmF5TmFtZSlcbiAgKTtcbn1cbiJdfQ==