import * as tslib_1 from "tslib";
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Self } from '@angular/core';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
var AbstractControlStatus = /** @class */ (function () {
    function AbstractControlStatus(cd) {
        this._cd = cd;
    }
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassUntouched", {
        get: function () { return this._cd.control ? this._cd.control.untouched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassTouched", {
        get: function () { return this._cd.control ? this._cd.control.touched : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPristine", {
        get: function () { return this._cd.control ? this._cd.control.pristine : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassDirty", {
        get: function () { return this._cd.control ? this._cd.control.dirty : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassValid", {
        get: function () { return this._cd.control ? this._cd.control.valid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassInvalid", {
        get: function () { return this._cd.control ? this._cd.control.invalid : false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractControlStatus.prototype, "ngClassPending", {
        get: function () { return this._cd.control ? this._cd.control.pending : false; },
        enumerable: true,
        configurable: true
    });
    return AbstractControlStatus;
}());
export { AbstractControlStatus };
export var ngControlStatusHost = {
    '[class.ng-untouched]': 'ngClassUntouched',
    '[class.ng-touched]': 'ngClassTouched',
    '[class.ng-pristine]': 'ngClassPristine',
    '[class.ng-dirty]': 'ngClassDirty',
    '[class.ng-valid]': 'ngClassValid',
    '[class.ng-invalid]': 'ngClassInvalid',
    '[class.ng-pending]': 'ngClassPending',
};
/**
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status. The following classes are applied as the properties
 * become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 *
 */
var NgControlStatus = /** @class */ (function (_super) {
    tslib_1.__extends(NgControlStatus, _super);
    function NgControlStatus(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatus.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatus, selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]], factory: function NgControlStatus_Factory() { return new NgControlStatus(i0.ɵdirectiveInject(NgControl, 2)); }, hostBindings: function NgControlStatus_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });
    return NgControlStatus;
}(AbstractControlStatus));
export { NgControlStatus };
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 *
 */
var NgControlStatusGroup = /** @class */ (function (_super) {
    tslib_1.__extends(NgControlStatusGroup, _super);
    function NgControlStatusGroup(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatusGroup.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatusGroup, selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]], factory: function NgControlStatusGroup_Factory() { return new NgControlStatusGroup(i0.ɵdirectiveInject(ControlContainer, 2)); }, hostBindings: function NgControlStatusGroup_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });
    return NgControlStatusGroup;
}(AbstractControlStatus));
export { NgControlStatusGroup };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRzlDLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFFdkM7SUFHRSwrQkFBWSxFQUE0QjtRQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQUMsQ0FBQztJQUU1RCxzQkFBSSxtREFBZ0I7YUFBcEIsY0FBa0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUNqRyxzQkFBSSxpREFBYzthQUFsQixjQUFnQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzdGLHNCQUFJLGtEQUFlO2FBQW5CLGNBQWlDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDL0Ysc0JBQUksK0NBQVk7YUFBaEIsY0FBOEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN6RixzQkFBSSwrQ0FBWTthQUFoQixjQUE4QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3pGLHNCQUFJLGlEQUFjO2FBQWxCLGNBQWdDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDN0Ysc0JBQUksaURBQWM7YUFBbEIsY0FBZ0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUMvRiw0QkFBQztBQUFELENBQUMsQUFaRCxJQVlDOztBQUVELE1BQU0sQ0FBQyxJQUFNLG1CQUFtQixHQUFHO0lBQ2pDLHNCQUFzQixFQUFFLGtCQUFrQjtJQUMxQyxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMscUJBQXFCLEVBQUUsaUJBQWlCO0lBQ3hDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsa0JBQWtCLEVBQUUsY0FBYztJQUNsQyxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMsb0JBQW9CLEVBQUUsZ0JBQWdCO0NBQ3ZDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNIO0lBQ3FDLDJDQUFxQjtJQUN4RCx5QkFBb0IsRUFBYTtlQUFJLGtCQUFNLEVBQUUsQ0FBQztJQUFFLENBQUM7aUVBRHRDLGVBQWUsbUpBQWYsZUFBZSxxQkFDRixTQUFTOzBCQXZEbkM7Q0F3REMsQUFIRCxDQUNxQyxxQkFBcUIsR0FFekQ7U0FGWSxlQUFlO0FBSTVCOzs7OztHQUtHO0FBQ0g7SUFLMEMsZ0RBQXFCO0lBQzdELDhCQUFvQixFQUFvQjtlQUFJLGtCQUFNLEVBQUUsQ0FBQztJQUFFLENBQUM7c0VBRDdDLG9CQUFvQixxT0FBcEIsb0JBQW9CLHFCQUNQLGdCQUFnQjsrQkF0RTFDO0NBdUVDLEFBUEQsQ0FLMEMscUJBQXFCLEdBRTlEO1NBRlksb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfSBmcm9tICcuL2Fic3RyYWN0X2NvbnRyb2xfZGlyZWN0aXZlJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcblxuZXhwb3J0IGNsYXNzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIHByaXZhdGUgX2NkOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmU7XG5cbiAgY29uc3RydWN0b3IoY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSkgeyB0aGlzLl9jZCA9IGNkOyB9XG5cbiAgZ2V0IG5nQ2xhc3NVbnRvdWNoZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC51bnRvdWNoZWQgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc1RvdWNoZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC50b3VjaGVkIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NQcmlzdGluZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnByaXN0aW5lIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NEaXJ0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLmRpcnR5IDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NWYWxpZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnZhbGlkIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NJbnZhbGlkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wuaW52YWxpZCA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzUGVuZGluZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnBlbmRpbmcgOiBmYWxzZTsgfVxufVxuXG5leHBvcnQgY29uc3QgbmdDb250cm9sU3RhdHVzSG9zdCA9IHtcbiAgJ1tjbGFzcy5uZy11bnRvdWNoZWRdJzogJ25nQ2xhc3NVbnRvdWNoZWQnLFxuICAnW2NsYXNzLm5nLXRvdWNoZWRdJzogJ25nQ2xhc3NUb3VjaGVkJyxcbiAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnbmdDbGFzc1ByaXN0aW5lJyxcbiAgJ1tjbGFzcy5uZy1kaXJ0eV0nOiAnbmdDbGFzc0RpcnR5JyxcbiAgJ1tjbGFzcy5uZy12YWxpZF0nOiAnbmdDbGFzc1ZhbGlkJyxcbiAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICduZ0NsYXNzSW52YWxpZCcsXG4gICdbY2xhc3MubmctcGVuZGluZ10nOiAnbmdDbGFzc1BlbmRpbmcnLFxufTtcblxuLyoqXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBjb250cm9scyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzLiBUaGUgZm9sbG93aW5nIGNsYXNzZXMgYXJlIGFwcGxpZWQgYXMgdGhlIHByb3BlcnRpZXNcbiAqIGJlY29tZSB0cnVlOlxuICpcbiAqICogbmctdmFsaWRcbiAqICogbmctaW52YWxpZFxuICogKiBuZy1wZW5kaW5nXG4gKiAqIG5nLXByaXN0aW5lXG4gKiAqIG5nLWRpcnR5XG4gKiAqIG5nLXVudG91Y2hlZFxuICogKiBuZy10b3VjaGVkXG4gKlxuICpcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xOYW1lXSxbbmdNb2RlbF0sW2Zvcm1Db250cm9sXScsIGhvc3Q6IG5nQ29udHJvbFN0YXR1c0hvc3R9KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1cyBleHRlbmRzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIGNvbnN0cnVjdG9yKEBTZWxmKCkgY2Q6IE5nQ29udHJvbCkgeyBzdXBlcihjZCk7IH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBncm91cHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cyAodmFsaWQvaW52YWxpZC9kaXJ0eS9ldGMpLlxuICpcbiAqXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdbZm9ybUdyb3VwTmFtZV0sW2Zvcm1BcnJheU5hbWVdLFtuZ01vZGVsR3JvdXBdLFtmb3JtR3JvdXBdLGZvcm06bm90KFtuZ05vRm9ybV0pLFtuZ0Zvcm1dJyxcbiAgaG9zdDogbmdDb250cm9sU3RhdHVzSG9zdFxufSlcbmV4cG9ydCBjbGFzcyBOZ0NvbnRyb2xTdGF0dXNHcm91cCBleHRlbmRzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIGNvbnN0cnVjdG9yKEBTZWxmKCkgY2Q6IENvbnRyb2xDb250YWluZXIpIHsgc3VwZXIoY2QpOyB9XG59XG4iXX0=