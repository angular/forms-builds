/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Host, Inject, Input, Optional, Self, SkipSelf } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { AbstractFormGroupDirective } from './abstract_form_group_directive';
import { ControlContainer } from './control_container';
import { NgForm } from './ng_form';
import { TemplateDrivenErrors } from './template_driven_errors';
import * as i0 from "@angular/core";
import * as i1 from "./control_container";
export const modelGroupProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => NgModelGroup)
};
/**
 * @description
 * Creates and binds a `FormGroup` instance to a DOM element.
 *
 * This directive can only be used as a child of `NgForm` (within `<form>` tags).
 *
 * Use this directive to validate a sub-group of your form separately from the
 * rest of your form, or if some values in your domain model make more sense
 * to consume together in a nested object.
 *
 * Provide a name for the sub-group and it will become the key
 * for the sub-group in the form's full value. If you need direct access, export the directive into
 * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
 *
 * @usageNotes
 *
 * ### Consuming controls in a grouping
 *
 * The following example shows you how to combine controls together in a sub-group
 * of the form.
 *
 * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
 *
 * @ngModule FormsModule
 * @publicApi
 */
export class NgModelGroup extends AbstractFormGroupDirective {
    constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /** @internal */
    _checkParentType() {
        if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm) &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            TemplateDrivenErrors.modelGroupParentException();
        }
    }
}
NgModelGroup.ɵfac = function NgModelGroup_Factory(t) { return new (t || NgModelGroup)(i0.ɵɵdirectiveInject(i1.ControlContainer, 5), i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
NgModelGroup.ɵdir = i0.ɵɵdefineDirective({ type: NgModelGroup, selectors: [["", "ngModelGroup", ""]], inputs: { name: ["ngModelGroup", "name"] }, exportAs: ["ngModelGroup"], features: [i0.ɵɵProvidersFeature([modelGroupProvider]), i0.ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgModelGroup, [{
        type: Directive,
        args: [{ selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup' }]
    }], function () { return [{ type: i1.ControlContainer, decorators: [{
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
            args: ['ngModelGroup']
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kZWxfZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19tb2RlbF9ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFdEgsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVqRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxpQ0FBaUMsQ0FBQztBQUMzRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7QUFHOUQsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQVE7SUFDckMsT0FBTyxFQUFFLGdCQUFnQjtJQUN6QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztDQUM1QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFFSCxNQUFNLE9BQU8sWUFBYSxTQUFRLDBCQUEwQjtJQVMxRCxZQUN3QixNQUF3QixFQUNELFVBQXFDLEVBQy9CLGVBQ1Y7UUFDekMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO0lBQzFDLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO1FBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxNQUFNLENBQUM7WUFDNUUsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7WUFDbkQsb0JBQW9CLENBQUMseUJBQXlCLEVBQUUsQ0FBQztTQUNsRDtJQUNILENBQUM7O3dFQTFCVSxZQUFZLHFFQVdTLGFBQWEsNEJBQ2IsbUJBQW1CO2lEQVp4QyxZQUFZLGtKQUQwQixDQUFDLGtCQUFrQixDQUFDO2tEQUMxRCxZQUFZO2NBRHhCLFNBQVM7ZUFBQyxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUM7O3NCQVczRixJQUFJOztzQkFBSSxRQUFROztzQkFDaEIsUUFBUTs7c0JBQUksSUFBSTs7c0JBQUksTUFBTTt1QkFBQyxhQUFhOztzQkFDeEMsUUFBUTs7c0JBQUksSUFBSTs7c0JBQUksTUFBTTt1QkFBQyxtQkFBbUI7d0JBTDVCLElBQUk7a0JBQTFCLEtBQUs7bUJBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBTZWxmLCBTa2lwU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdGb3JtfSBmcm9tICcuL25nX2Zvcm0nO1xuaW1wb3J0IHtUZW1wbGF0ZURyaXZlbkVycm9yc30gZnJvbSAnLi90ZW1wbGF0ZV9kcml2ZW5fZXJyb3JzJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBtb2RlbEdyb3VwUHJvdmlkZXI6IGFueSA9IHtcbiAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdNb2RlbEdyb3VwKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW5kIGJpbmRzIGEgYEZvcm1Hcm91cGAgaW5zdGFuY2UgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBjYW4gb25seSBiZSB1c2VkIGFzIGEgY2hpbGQgb2YgYE5nRm9ybWAgKHdpdGhpbiBgPGZvcm0+YCB0YWdzKS5cbiAqXG4gKiBVc2UgdGhpcyBkaXJlY3RpdmUgdG8gdmFsaWRhdGUgYSBzdWItZ3JvdXAgb2YgeW91ciBmb3JtIHNlcGFyYXRlbHkgZnJvbSB0aGVcbiAqIHJlc3Qgb2YgeW91ciBmb3JtLCBvciBpZiBzb21lIHZhbHVlcyBpbiB5b3VyIGRvbWFpbiBtb2RlbCBtYWtlIG1vcmUgc2Vuc2VcbiAqIHRvIGNvbnN1bWUgdG9nZXRoZXIgaW4gYSBuZXN0ZWQgb2JqZWN0LlxuICpcbiAqIFByb3ZpZGUgYSBuYW1lIGZvciB0aGUgc3ViLWdyb3VwIGFuZCBpdCB3aWxsIGJlY29tZSB0aGUga2V5XG4gKiBmb3IgdGhlIHN1Yi1ncm91cCBpbiB0aGUgZm9ybSdzIGZ1bGwgdmFsdWUuIElmIHlvdSBuZWVkIGRpcmVjdCBhY2Nlc3MsIGV4cG9ydCB0aGUgZGlyZWN0aXZlIGludG9cbiAqIGEgbG9jYWwgdGVtcGxhdGUgdmFyaWFibGUgdXNpbmcgYG5nTW9kZWxHcm91cGAgKGV4OiBgI215R3JvdXA9XCJuZ01vZGVsR3JvdXBcImApLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENvbnN1bWluZyBjb250cm9scyBpbiBhIGdyb3VwaW5nXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gY29tYmluZSBjb250cm9scyB0b2dldGhlciBpbiBhIHN1Yi1ncm91cFxuICogb2YgdGhlIGZvcm0uXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL25nTW9kZWxHcm91cC9uZ19tb2RlbF9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdNb2RlbEdyb3VwXScsIHByb3ZpZGVyczogW21vZGVsR3JvdXBQcm92aWRlcl0sIGV4cG9ydEFzOiAnbmdNb2RlbEdyb3VwJ30pXG5leHBvcnQgY2xhc3MgTmdNb2RlbEdyb3VwIGV4dGVuZHMgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgTmdNb2RlbEdyb3VwYCBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBUaGUgbmFtZSBjb3JyZXNwb25kc1xuICAgKiB0byBhIGtleSBpbiB0aGUgcGFyZW50IGBOZ0Zvcm1gLlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnbmdNb2RlbEdyb3VwJykgbmFtZSE6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBIb3N0KCkgQFNraXBTZWxmKCkgcGFyZW50OiBDb250cm9sQ29udGFpbmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IChWYWxpZGF0b3J8VmFsaWRhdG9yRm4pW10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgIChBc3luY1ZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvckZuKVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fdmFsaWRhdG9ycyA9IHZhbGlkYXRvcnM7XG4gICAgdGhpcy5fYXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3JzO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nTW9kZWxHcm91cCkgJiYgISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBOZ0Zvcm0pICYmXG4gICAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICBUZW1wbGF0ZURyaXZlbkVycm9ycy5tb2RlbEdyb3VwUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=