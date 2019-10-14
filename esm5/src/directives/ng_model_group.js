import * as tslib_1 from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Host, Inject, Input, Optional, Self, SkipSelf, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { AbstractFormGroupDirective } from './abstract_form_group_directive';
import { ControlContainer } from './control_container';
import { NgForm } from './ng_form';
import { TemplateDrivenErrors } from './template_driven_errors';
import * as i0 from "@angular/core";
import * as i1 from "./control_container";
export var modelGroupProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(function () { return NgModelGroup; })
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
var NgModelGroup = /** @class */ (function (_super) {
    tslib_1.__extends(NgModelGroup, _super);
    function NgModelGroup(parent, validators, asyncValidators) {
        var _this = _super.call(this) || this;
        _this._parent = parent;
        _this._validators = validators;
        _this._asyncValidators = asyncValidators;
        return _this;
    }
    /** @internal */
    NgModelGroup.prototype._checkParentType = function () {
        if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
            TemplateDrivenErrors.modelGroupParentException();
        }
    };
    NgModelGroup.ɵfac = function NgModelGroup_Factory(t) { return new (t || NgModelGroup)(i0.ɵɵdirectiveInject(i1.ControlContainer, 5), i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
    NgModelGroup.ɵdir = i0.ɵɵdefineDirective({ type: NgModelGroup, selectors: [["", "ngModelGroup", ""]], inputs: { name: ["ngModelGroup", "name"] }, exportAs: ["ngModelGroup"], features: [i0.ɵɵProvidersFeature([modelGroupProvider]), i0.ɵɵInheritDefinitionFeature] });
    return NgModelGroup;
}(AbstractFormGroupDirective));
export { NgModelGroup };
/*@__PURE__*/ i0.ɵsetClassMetadata(NgModelGroup, [{
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
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kZWxfZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19tb2RlbF9ncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBcUIsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXRILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFakUsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDM0UsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7O0FBRTlELE1BQU0sQ0FBQyxJQUFNLGtCQUFrQixHQUFRO0lBQ3JDLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsWUFBWSxFQUFaLENBQVksQ0FBQztDQUM1QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFDSDtJQUNrQyx3Q0FBMEI7SUFTMUQsc0JBQ3dCLE1BQXdCLEVBQ0QsVUFBaUIsRUFDWCxlQUFzQjtRQUgzRSxZQUlFLGlCQUFPLFNBSVI7UUFIQyxLQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixLQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztRQUM5QixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDOztJQUMxQyxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLHVDQUFnQixHQUFoQjtRQUNFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFlBQVksWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLFlBQVksTUFBTSxDQUFDLEVBQUU7WUFDaEYsb0JBQW9CLENBQUMseUJBQXlCLEVBQUUsQ0FBQztTQUNsRDtJQUNILENBQUM7NEVBeEJVLFlBQVkscUVBV1MsYUFBYSw0QkFDYixtQkFBbUI7cURBWnhDLFlBQVksa0pBRDBCLENBQUMsa0JBQWtCLENBQUM7dUJBaER2RTtDQTBFQyxBQTFCRCxDQUNrQywwQkFBMEIsR0F5QjNEO1NBekJZLFlBQVk7bUNBQVosWUFBWTtjQUR4QixTQUFTO2VBQUMsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLENBQUMsa0JBQWtCLENBQUMsRUFBRSxRQUFRLEVBQUUsY0FBYyxFQUFDOztzQkFXM0YsSUFBSTs7c0JBQUksUUFBUTs7c0JBQ2hCLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsYUFBYTs7c0JBQ3hDLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsbUJBQW1COztrQkFMbEQsS0FBSzttQkFBQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25EZXN0cm95LCBPbkluaXQsIE9wdGlvbmFsLCBTZWxmLCBTa2lwU2VsZiwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdGb3JtfSBmcm9tICcuL25nX2Zvcm0nO1xuaW1wb3J0IHtUZW1wbGF0ZURyaXZlbkVycm9yc30gZnJvbSAnLi90ZW1wbGF0ZV9kcml2ZW5fZXJyb3JzJztcblxuZXhwb3J0IGNvbnN0IG1vZGVsR3JvdXBQcm92aWRlcjogYW55ID0ge1xuICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ01vZGVsR3JvdXApXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhbmQgYmluZHMgYSBgRm9ybUdyb3VwYCBpbnN0YW5jZSB0byBhIERPTSBlbGVtZW50LlxuICpcbiAqIFRoaXMgZGlyZWN0aXZlIGNhbiBvbmx5IGJlIHVzZWQgYXMgYSBjaGlsZCBvZiBgTmdGb3JtYCAod2l0aGluIGA8Zm9ybT5gIHRhZ3MpLlxuICpcbiAqIFVzZSB0aGlzIGRpcmVjdGl2ZSB0byB2YWxpZGF0ZSBhIHN1Yi1ncm91cCBvZiB5b3VyIGZvcm0gc2VwYXJhdGVseSBmcm9tIHRoZVxuICogcmVzdCBvZiB5b3VyIGZvcm0sIG9yIGlmIHNvbWUgdmFsdWVzIGluIHlvdXIgZG9tYWluIG1vZGVsIG1ha2UgbW9yZSBzZW5zZVxuICogdG8gY29uc3VtZSB0b2dldGhlciBpbiBhIG5lc3RlZCBvYmplY3QuXG4gKlxuICogUHJvdmlkZSBhIG5hbWUgZm9yIHRoZSBzdWItZ3JvdXAgYW5kIGl0IHdpbGwgYmVjb21lIHRoZSBrZXlcbiAqIGZvciB0aGUgc3ViLWdyb3VwIGluIHRoZSBmb3JtJ3MgZnVsbCB2YWx1ZS4gSWYgeW91IG5lZWQgZGlyZWN0IGFjY2VzcywgZXhwb3J0IHRoZSBkaXJlY3RpdmUgaW50b1xuICogYSBsb2NhbCB0ZW1wbGF0ZSB2YXJpYWJsZSB1c2luZyBgbmdNb2RlbEdyb3VwYCAoZXg6IGAjbXlHcm91cD1cIm5nTW9kZWxHcm91cFwiYCkuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQ29uc3VtaW5nIGNvbnRyb2xzIGluIGEgZ3JvdXBpbmdcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgeW91IGhvdyB0byBjb21iaW5lIGNvbnRyb2xzIHRvZ2V0aGVyIGluIGEgc3ViLWdyb3VwXG4gKiBvZiB0aGUgZm9ybS5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvbmdNb2RlbEdyb3VwL25nX21vZGVsX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ01vZGVsR3JvdXBdJywgcHJvdmlkZXJzOiBbbW9kZWxHcm91cFByb3ZpZGVyXSwgZXhwb3J0QXM6ICduZ01vZGVsR3JvdXAnfSlcbmV4cG9ydCBjbGFzcyBOZ01vZGVsR3JvdXAgZXh0ZW5kcyBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIG5hbWUgb2YgdGhlIGBOZ01vZGVsR3JvdXBgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYE5nRm9ybWAuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCduZ01vZGVsR3JvdXAnKSBuYW1lICE6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBIb3N0KCkgQFNraXBTZWxmKCkgcGFyZW50OiBDb250cm9sQ29udGFpbmVyLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IGFueVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczogYW55W10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICB0aGlzLl92YWxpZGF0b3JzID0gdmFsaWRhdG9ycztcbiAgICB0aGlzLl9hc3luY1ZhbGlkYXRvcnMgPSBhc3luY1ZhbGlkYXRvcnM7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jaGVja1BhcmVudFR5cGUoKTogdm9pZCB7XG4gICAgaWYgKCEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgTmdNb2RlbEdyb3VwKSAmJiAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIE5nRm9ybSkpIHtcbiAgICAgIFRlbXBsYXRlRHJpdmVuRXJyb3JzLm1vZGVsR3JvdXBQYXJlbnRFeGNlcHRpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==