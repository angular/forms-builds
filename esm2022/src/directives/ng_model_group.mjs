/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, forwardRef, Host, Inject, Input, Optional, Self, SkipSelf, } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { AbstractFormGroupDirective } from './abstract_form_group_directive';
import { ControlContainer } from './control_container';
import { NgForm } from './ng_form';
import { modelGroupParentException } from './template_driven_errors';
import * as i0 from "@angular/core";
import * as i1 from "./control_container";
export const modelGroupProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => NgModelGroup),
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
        /**
         * @description
         * Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
         * to a key in the parent `NgForm`.
         */
        this.name = '';
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @internal */
    _checkParentType() {
        if (!(this._parent instanceof NgModelGroup) &&
            !(this._parent instanceof NgForm) &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw modelGroupParentException();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: NgModelGroup, deps: [{ token: i1.ControlContainer, host: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.0.0-next.0+sha-f271021", type: NgModelGroup, selector: "[ngModelGroup]", inputs: { name: ["ngModelGroup", "name"] }, providers: [modelGroupProvider], exportAs: ["ngModelGroup"], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: NgModelGroup, decorators: [{
            type: Directive,
            args: [{ selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup' }]
        }], ctorParameters: () => [{ type: i1.ControlContainer, decorators: [{
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
                args: ['ngModelGroup']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kZWxfZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19tb2RlbF9ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNOLEtBQUssRUFHTCxRQUFRLEVBQ1IsSUFBSSxFQUNKLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7OztBQUduRSxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBUTtJQUNyQyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO0NBQzVDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlCRztBQUVILE1BQU0sT0FBTyxZQUFhLFNBQVEsMEJBQTBCO0lBUTFELFlBQ3NCLE1BQXdCLEVBQ0QsVUFBdUMsRUFJbEYsZUFBc0Q7UUFFdEQsS0FBSyxFQUFFLENBQUM7UUFmVjs7OztXQUlHO1FBQzZCLFNBQUksR0FBVyxFQUFFLENBQUM7UUFXaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELGdCQUFnQjtJQUNQLGdCQUFnQjtRQUN2QixJQUNFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxZQUFZLFlBQVksQ0FBQztZQUN2QyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sWUFBWSxNQUFNLENBQUM7WUFDakMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQy9DLENBQUM7WUFDRCxNQUFNLHlCQUF5QixFQUFFLENBQUM7UUFDcEMsQ0FBQztJQUNILENBQUM7eUhBL0JVLFlBQVksOEVBVU8sYUFBYSx5Q0FHakMsbUJBQW1COzZHQWJsQixZQUFZLHFGQUQwQixDQUFDLGtCQUFrQixDQUFDOztzR0FDMUQsWUFBWTtrQkFEeEIsU0FBUzttQkFBQyxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUM7OzBCQVU3RixJQUFJOzswQkFBSSxRQUFROzswQkFDaEIsUUFBUTs7MEJBQUksSUFBSTs7MEJBQUksTUFBTTsyQkFBQyxhQUFhOzswQkFDeEMsUUFBUTs7MEJBQ1IsSUFBSTs7MEJBQ0osTUFBTTsyQkFBQyxtQkFBbUI7eUNBUEcsSUFBSTtzQkFBbkMsS0FBSzt1QkFBQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgZm9yd2FyZFJlZixcbiAgSG9zdCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTZWxmLFxuICBTa2lwU2VsZixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdGb3JtfSBmcm9tICcuL25nX2Zvcm0nO1xuaW1wb3J0IHttb2RlbEdyb3VwUGFyZW50RXhjZXB0aW9ufSBmcm9tICcuL3RlbXBsYXRlX2RyaXZlbl9lcnJvcnMnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi92YWxpZGF0b3JzJztcblxuZXhwb3J0IGNvbnN0IG1vZGVsR3JvdXBQcm92aWRlcjogYW55ID0ge1xuICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ01vZGVsR3JvdXApLFxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYW5kIGJpbmRzIGEgYEZvcm1Hcm91cGAgaW5zdGFuY2UgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBjYW4gb25seSBiZSB1c2VkIGFzIGEgY2hpbGQgb2YgYE5nRm9ybWAgKHdpdGhpbiBgPGZvcm0+YCB0YWdzKS5cbiAqXG4gKiBVc2UgdGhpcyBkaXJlY3RpdmUgdG8gdmFsaWRhdGUgYSBzdWItZ3JvdXAgb2YgeW91ciBmb3JtIHNlcGFyYXRlbHkgZnJvbSB0aGVcbiAqIHJlc3Qgb2YgeW91ciBmb3JtLCBvciBpZiBzb21lIHZhbHVlcyBpbiB5b3VyIGRvbWFpbiBtb2RlbCBtYWtlIG1vcmUgc2Vuc2VcbiAqIHRvIGNvbnN1bWUgdG9nZXRoZXIgaW4gYSBuZXN0ZWQgb2JqZWN0LlxuICpcbiAqIFByb3ZpZGUgYSBuYW1lIGZvciB0aGUgc3ViLWdyb3VwIGFuZCBpdCB3aWxsIGJlY29tZSB0aGUga2V5XG4gKiBmb3IgdGhlIHN1Yi1ncm91cCBpbiB0aGUgZm9ybSdzIGZ1bGwgdmFsdWUuIElmIHlvdSBuZWVkIGRpcmVjdCBhY2Nlc3MsIGV4cG9ydCB0aGUgZGlyZWN0aXZlIGludG9cbiAqIGEgbG9jYWwgdGVtcGxhdGUgdmFyaWFibGUgdXNpbmcgYG5nTW9kZWxHcm91cGAgKGV4OiBgI215R3JvdXA9XCJuZ01vZGVsR3JvdXBcImApLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENvbnN1bWluZyBjb250cm9scyBpbiBhIGdyb3VwaW5nXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gY29tYmluZSBjb250cm9scyB0b2dldGhlciBpbiBhIHN1Yi1ncm91cFxuICogb2YgdGhlIGZvcm0uXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL25nTW9kZWxHcm91cC9uZ19tb2RlbF9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdNb2RlbEdyb3VwXScsIHByb3ZpZGVyczogW21vZGVsR3JvdXBQcm92aWRlcl0sIGV4cG9ydEFzOiAnbmdNb2RlbEdyb3VwJ30pXG5leHBvcnQgY2xhc3MgTmdNb2RlbEdyb3VwIGV4dGVuZHMgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgTmdNb2RlbEdyb3VwYCBib3VuZCB0byB0aGUgZGlyZWN0aXZlLiBUaGUgbmFtZSBjb3JyZXNwb25kc1xuICAgKiB0byBhIGtleSBpbiB0aGUgcGFyZW50IGBOZ0Zvcm1gLlxuICAgKi9cbiAgQElucHV0KCduZ01vZGVsR3JvdXAnKSBvdmVycmlkZSBuYW1lOiBzdHJpbmcgPSAnJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASG9zdCgpIEBTa2lwU2VsZigpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgdmFsaWRhdG9yczogKFZhbGlkYXRvciB8IFZhbGlkYXRvckZuKVtdLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQFNlbGYoKVxuICAgIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUylcbiAgICBhc3luY1ZhbGlkYXRvcnM6IChBc3luY1ZhbGlkYXRvciB8IEFzeW5jVmFsaWRhdG9yRm4pW10sXG4gICkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9jaGVja1BhcmVudFR5cGUoKTogdm9pZCB7XG4gICAgaWYgKFxuICAgICAgISh0aGlzLl9wYXJlbnQgaW5zdGFuY2VvZiBOZ01vZGVsR3JvdXApICYmXG4gICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nRm9ybSkgJiZcbiAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpXG4gICAgKSB7XG4gICAgICB0aHJvdyBtb2RlbEdyb3VwUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=