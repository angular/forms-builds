/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Host, Inject, Input, Optional, Self, SkipSelf } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { AbstractFormGroupDirective } from '../abstract_form_group_directive';
import { ControlContainer } from '../control_container';
import { arrayParentException, groupParentException } from '../reactive_errors';
import { controlPath } from '../shared';
import { FormGroupDirective } from './form_group_directive';
import * as i0 from "@angular/core";
import * as i1 from "../control_container";
export const formGroupNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupName)
};
/**
 * @description
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
 * @usageNotes
 *
 * ### Access the group by name
 *
 * The following example uses the {@link AbstractControl#get get} method to access the
 * associated `FormGroup`
 *
 * ```ts
 *   this.form.get('name');
 * ```
 *
 * ### Access individual controls in the group
 *
 * The following example uses the {@link AbstractControl#get get} method to access
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
}
FormGroupName.ɵfac = function FormGroupName_Factory(t) { return new (t || FormGroupName)(i0.ɵɵdirectiveInject(i1.ControlContainer, 13), i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
FormGroupName.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: FormGroupName, selectors: [["", "formGroupName", ""]], inputs: { name: ["formGroupName", "name"] }, features: [i0.ɵɵProvidersFeature([formGroupNameProvider]), i0.ɵɵInheritDefinitionFeature] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FormGroupName, [{
        type: Directive,
        args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] }]
    }], function () { return [{ type: i1.ControlContainer, decorators: [{
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
            }] }]; }, { name: [{
            type: Input,
            args: ['formGroupName']
        }] }); })();
export const formArrayNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormArrayName)
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
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
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
}
FormArrayName.ɵfac = function FormArrayName_Factory(t) { return new (t || FormArrayName)(i0.ɵɵdirectiveInject(i1.ControlContainer, 13), i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
FormArrayName.ɵdir = /*@__PURE__*/ i0.ɵɵdefineDirective({ type: FormArrayName, selectors: [["", "formArrayName", ""]], inputs: { name: ["formArrayName", "name"] }, features: [i0.ɵɵProvidersFeature([formArrayNameProvider]), i0.ɵɵInheritDefinitionFeature] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FormArrayName, [{
        type: Directive,
        args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] }]
    }], function () { return [{ type: i1.ControlContainer, decorators: [{
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
            }] }]; }, { name: [{
            type: Input,
            args: ['formArrayName']
        }] }); })();
function _hasInvalidParent(parent) {
    return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) &&
        !(parent instanceof FormArrayName);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9uYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQXFCLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3RILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUM1RSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUM5RSxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBR3RDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHdCQUF3QixDQUFDOzs7QUFFMUQsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDeEMsT0FBTyxFQUFFLGdCQUFnQjtJQUN6QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztDQUM3QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q0c7QUFFSCxNQUFNLE9BQU8sYUFBYyxTQUFRLDBCQUEwQjtJQWEzRCxZQUNvQyxNQUF3QixFQUNiLFVBQXFDLEVBQy9CLGVBQ1Y7UUFDekMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0s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QUFtQjtnRUFuQnhDLGFBQWEsd0hBRDBCLENBQUMscUJBQXFCLENBQUM7dUZBQzlELGFBQWE7Y0FEekIsU0FBUztlQUFDLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLEVBQUM7O3NCQWtCckUsUUFBUTs7c0JBQUksSUFBSTs7c0JBQUksUUFBUTs7c0JBQzVCLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsYUFBYTs7c0JBQ3hDLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsbUJBQW1CO3dCQUxsQixJQUFJO2tCQUFwQyxLQUFLO21CQUFDLGVBQWU7O0FBaUV4QixTQUFTLGlCQUFpQixDQUFDLE1BQXdCO0lBQ2pELE9BQU8sQ0FBQyxDQUFDLE1BQU0sWUFBWSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxZQUFZLGtCQUFrQixDQUFDO1FBQ2hGLENBQUMsQ0FBQyxNQUFNLFlBQVksYUFBYSxDQUFDLENBQUM7QUFDekMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBTZWxmLCBTa2lwU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUFycmF5fSBmcm9tICcuLi8uLi9tb2RlbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uLy4uL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge2FycmF5UGFyZW50RXhjZXB0aW9uLCBncm91cFBhcmVudEV4Y2VwdGlvbn0gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7Y29udHJvbFBhdGh9IGZyb20gJy4uL3NoYXJlZCc7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuLi92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuXG5leHBvcnQgY29uc3QgZm9ybUdyb3VwTmFtZVByb3ZpZGVyOiBhbnkgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Hcm91cE5hbWUpXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFN5bmNzIGEgbmVzdGVkIGBGb3JtR3JvdXBgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgY2FuIG9ubHkgYmUgdXNlZCB3aXRoIGEgcGFyZW50IGBGb3JtR3JvdXBEaXJlY3RpdmVgLlxuICpcbiAqIEl0IGFjY2VwdHMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBuZXN0ZWQgYEZvcm1Hcm91cGAgdG8gbGluaywgYW5kXG4gKiBsb29rcyBmb3IgYSBgRm9ybUdyb3VwYCByZWdpc3RlcmVkIHdpdGggdGhhdCBuYW1lIGluIHRoZSBwYXJlbnRcbiAqIGBGb3JtR3JvdXBgIGluc3RhbmNlIHlvdSBwYXNzZWQgaW50byBgRm9ybUdyb3VwRGlyZWN0aXZlYC5cbiAqXG4gKiBVc2UgbmVzdGVkIGZvcm0gZ3JvdXBzIHRvIHZhbGlkYXRlIGEgc3ViLWdyb3VwIG9mIGFcbiAqIGZvcm0gc2VwYXJhdGVseSBmcm9tIHRoZSByZXN0IG9yIHRvIGdyb3VwIHRoZSB2YWx1ZXMgb2YgY2VydGFpblxuICogY29udHJvbHMgaW50byB0aGVpciBvd24gbmVzdGVkIG9iamVjdC5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQWNjZXNzIHRoZSBncm91cCBieSBuYW1lXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHVzZXMgdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjZ2V0IGdldH0gbWV0aG9kIHRvIGFjY2VzcyB0aGVcbiAqIGFzc29jaWF0ZWQgYEZvcm1Hcm91cGBcbiAqXG4gKiBgYGB0c1xuICogICB0aGlzLmZvcm0uZ2V0KCduYW1lJyk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgQWNjZXNzIGluZGl2aWR1YWwgY29udHJvbHMgaW4gdGhlIGdyb3VwXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHVzZXMgdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjZ2V0IGdldH0gbWV0aG9kIHRvIGFjY2Vzc1xuICogaW5kaXZpZHVhbCBjb250cm9scyB3aXRoaW4gdGhlIGdyb3VwIHVzaW5nIGRvdCBzeW50YXguXG4gKlxuICogYGBgdHNcbiAqICAgdGhpcy5mb3JtLmdldCgnbmFtZS5maXJzdCcpO1xuICogYGBgXG4gKlxuICogIyMjIFJlZ2lzdGVyIGEgbmVzdGVkIGBGb3JtR3JvdXBgLlxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSByZWdpc3RlcnMgYSBuZXN0ZWQgKm5hbWUqIGBGb3JtR3JvdXBgIHdpdGhpbiBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCxcbiAqIGFuZCBwcm92aWRlcyBtZXRob2RzIHRvIHJldHJpZXZlIHRoZSBuZXN0ZWQgYEZvcm1Hcm91cGAgYW5kIGluZGl2aWR1YWwgY29udHJvbHMuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL25lc3RlZEZvcm1Hcm91cC9uZXN0ZWRfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtR3JvdXBOYW1lXScsIHByb3ZpZGVyczogW2Zvcm1Hcm91cE5hbWVQcm92aWRlcl19KVxuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cE5hbWUgZXh0ZW5kcyBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIG5hbWUgb2YgdGhlIGBGb3JtR3JvdXBgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAqIEFjY2VwdHMgYSBuYW1lIGFzIGEgc3RyaW5nIG9yIGEgbnVtYmVyLlxuICAgKiBUaGUgbmFtZSBpbiB0aGUgZm9ybSBvZiBhIHN0cmluZyBpcyB1c2VmdWwgZm9yIGluZGl2aWR1YWwgZm9ybXMsXG4gICAqIHdoaWxlIHRoZSBudW1lcmljYWwgZm9ybSBhbGxvd3MgZm9yIGZvcm0gZ3JvdXBzIHRvIGJlIGJvdW5kXG4gICAqIHRvIGluZGljZXMgd2hlbiBpdGVyYXRpbmcgb3ZlciBncm91cHMgaW4gYSBgRm9ybUFycmF5YC5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ2Zvcm1Hcm91cE5hbWUnKSBvdmVycmlkZSBuYW1lITogc3RyaW5nfG51bWJlcnxudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQEhvc3QoKSBAU2tpcFNlbGYoKSBwYXJlbnQ6IENvbnRyb2xDb250YWluZXIsXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgdmFsaWRhdG9yczogKFZhbGlkYXRvcnxWYWxpZGF0b3JGbilbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBhc3luY1ZhbGlkYXRvcnM6XG4gICAgICAgICAgKEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4pW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl9zZXRWYWxpZGF0b3JzKHZhbGlkYXRvcnMpO1xuICAgIHRoaXMuX3NldEFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmIChfaGFzSW52YWxpZFBhcmVudCh0aGlzLl9wYXJlbnQpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBncm91cFBhcmVudEV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3QgZm9ybUFycmF5TmFtZVByb3ZpZGVyOiBhbnkgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1BcnJheU5hbWUpXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIFN5bmNzIGEgbmVzdGVkIGBGb3JtQXJyYXlgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgaXMgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIGEgcGFyZW50IGBGb3JtR3JvdXBEaXJlY3RpdmVgIChzZWxlY3RvcjpcbiAqIGBbZm9ybUdyb3VwXWApLlxuICpcbiAqIEl0IGFjY2VwdHMgdGhlIHN0cmluZyBuYW1lIG9mIHRoZSBuZXN0ZWQgYEZvcm1BcnJheWAgeW91IHdhbnQgdG8gbGluaywgYW5kXG4gKiB3aWxsIGxvb2sgZm9yIGEgYEZvcm1BcnJheWAgcmVnaXN0ZXJlZCB3aXRoIHRoYXQgbmFtZSBpbiB0aGUgcGFyZW50XG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB5b3UgcGFzc2VkIGludG8gYEZvcm1Hcm91cERpcmVjdGl2ZWAuXG4gKlxuICogQHNlZSBbUmVhY3RpdmUgRm9ybXMgR3VpZGVdKGd1aWRlL3JlYWN0aXZlLWZvcm1zKVxuICogQHNlZSBgQWJzdHJhY3RDb250cm9sYFxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvbmVzdGVkRm9ybUFycmF5L25lc3RlZF9mb3JtX2FycmF5X2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1BcnJheU5hbWVdJywgcHJvdmlkZXJzOiBbZm9ybUFycmF5TmFtZVByb3ZpZGVyXX0pXG5leHBvcnQgY2xhc3MgRm9ybUFycmF5TmFtZSBleHRlbmRzIENvbnRyb2xDb250YWluZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BhcmVudDogQ29udHJvbENvbnRhaW5lcjtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgYEZvcm1BcnJheWAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICogQWNjZXB0cyBhIG5hbWUgYXMgYSBzdHJpbmcgb3IgYSBudW1iZXIuXG4gICAqIFRoZSBuYW1lIGluIHRoZSBmb3JtIG9mIGEgc3RyaW5nIGlzIHVzZWZ1bCBmb3IgaW5kaXZpZHVhbCBmb3JtcyxcbiAgICogd2hpbGUgdGhlIG51bWVyaWNhbCBmb3JtIGFsbG93cyBmb3IgZm9ybSBhcnJheXMgdG8gYmUgYm91bmRcbiAgICogdG8gaW5kaWNlcyB3aGVuIGl0ZXJhdGluZyBvdmVyIGFycmF5cyBpbiBhIGBGb3JtQXJyYXlgLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnZm9ybUFycmF5TmFtZScpIG92ZXJyaWRlIG5hbWUhOiBzdHJpbmd8bnVtYmVyfG51bGw7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIEBTa2lwU2VsZigpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiAoVmFsaWRhdG9yfFZhbGlkYXRvckZuKVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczpcbiAgICAgICAgICAoQXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbilbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKipcbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUncyBpbnB1dHMgYXJlIGluaXRpYWxpemVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqIEB0aHJvd3MgSWYgdGhlIGRpcmVjdGl2ZSBkb2VzIG5vdCBoYXZlIGEgdmFsaWQgcGFyZW50LlxuICAgKiBAbm9kb2NcbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgIHRoaXMuZm9ybURpcmVjdGl2ZSEuYWRkRm9ybUFycmF5KHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbGlmZWN5Y2xlIG1ldGhvZCBjYWxsZWQgYmVmb3JlIHRoZSBkaXJlY3RpdmUncyBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICogQG5vZG9jXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb3JtRGlyZWN0aXZlKSB7XG4gICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlRm9ybUFycmF5KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGBGb3JtQXJyYXlgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGNvbnRyb2woKTogRm9ybUFycmF5IHtcbiAgICByZXR1cm4gdGhpcy5mb3JtRGlyZWN0aXZlIS5nZXRGb3JtQXJyYXkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGdyb3VwIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGZvcm1EaXJlY3RpdmUoKTogRm9ybUdyb3VwRGlyZWN0aXZlfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyA8Rm9ybUdyb3VwRGlyZWN0aXZlPnRoaXMuX3BhcmVudC5mb3JtRGlyZWN0aXZlIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSB0aGF0IHJlcHJlc2VudHMgdGhlIHBhdGggZnJvbSB0aGUgdG9wLWxldmVsIGZvcm0gdG8gdGhpcyBjb250cm9sLlxuICAgKiBFYWNoIGluZGV4IGlzIHRoZSBzdHJpbmcgbmFtZSBvZiB0aGUgY29udHJvbCBvbiB0aGF0IGxldmVsLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBjb250cm9sUGF0aCh0aGlzLm5hbWUgPT0gbnVsbCA/IHRoaXMubmFtZSA6IHRoaXMubmFtZS50b1N0cmluZygpLCB0aGlzLl9wYXJlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmIChfaGFzSW52YWxpZFBhcmVudCh0aGlzLl9wYXJlbnQpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBhcnJheVBhcmVudEV4Y2VwdGlvbigpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBfaGFzSW52YWxpZFBhcmVudChwYXJlbnQ6IENvbnRyb2xDb250YWluZXIpOiBib29sZWFuIHtcbiAgcmV0dXJuICEocGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwTmFtZSkgJiYgIShwYXJlbnQgaW5zdGFuY2VvZiBGb3JtR3JvdXBEaXJlY3RpdmUpICYmXG4gICAgICAhKHBhcmVudCBpbnN0YW5jZW9mIEZvcm1BcnJheU5hbWUpO1xufVxuIl19