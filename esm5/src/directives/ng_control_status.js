import * as tslib_1 from "tslib";
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
import * as i0 from "@angular/core";
var _c0 = ["ng-untouched", "ng-touched", "ng-pristine", "ng-dirty", "ng-valid", "ng-invalid", "ng-pending"];
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
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
var NgControlStatus = /** @class */ (function (_super) {
    tslib_1.__extends(NgControlStatus, _super);
    function NgControlStatus(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatus.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatus, selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]], factory: function NgControlStatus_Factory(t) { return new (t || NgControlStatus)(i0.ɵdirectiveInject(NgControl, 2)); }, hostBindings: function NgControlStatus_HostBindings(dirIndex, elIndex) { i0.ɵelementStyling(_c0, null, null, dirIndex); i0.ɵelementClassProp(elIndex, 0, i0.ɵload(dirIndex).ngClassUntouched, dirIndex); i0.ɵelementClassProp(elIndex, 1, i0.ɵload(dirIndex).ngClassTouched, dirIndex); i0.ɵelementClassProp(elIndex, 2, i0.ɵload(dirIndex).ngClassPristine, dirIndex); i0.ɵelementClassProp(elIndex, 3, i0.ɵload(dirIndex).ngClassDirty, dirIndex); i0.ɵelementClassProp(elIndex, 4, i0.ɵload(dirIndex).ngClassValid, dirIndex); i0.ɵelementClassProp(elIndex, 5, i0.ɵload(dirIndex).ngClassInvalid, dirIndex); i0.ɵelementClassProp(elIndex, 6, i0.ɵload(dirIndex).ngClassPending, dirIndex); i0.ɵelementStylingApply(elIndex, dirIndex); }, hostVars: 7, features: [i0.ɵInheritDefinitionFeature] });
    return NgControlStatus;
}(AbstractControlStatus));
export { NgControlStatus };
/*@__PURE__*/ i0.ɵsetClassMetadata(NgControlStatus, [{
        type: Directive,
        args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost }]
    }], [{
        type: NgControl,
        decorators: [{
                type: Self
            }]
    }], null);
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
var NgControlStatusGroup = /** @class */ (function (_super) {
    tslib_1.__extends(NgControlStatusGroup, _super);
    function NgControlStatusGroup(cd) {
        return _super.call(this, cd) || this;
    }
    NgControlStatusGroup.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatusGroup, selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]], factory: function NgControlStatusGroup_Factory(t) { return new (t || NgControlStatusGroup)(i0.ɵdirectiveInject(ControlContainer, 2)); }, hostBindings: function NgControlStatusGroup_HostBindings(dirIndex, elIndex) { i0.ɵelementStyling(_c0, null, null, dirIndex); i0.ɵelementClassProp(elIndex, 0, i0.ɵload(dirIndex).ngClassUntouched, dirIndex); i0.ɵelementClassProp(elIndex, 1, i0.ɵload(dirIndex).ngClassTouched, dirIndex); i0.ɵelementClassProp(elIndex, 2, i0.ɵload(dirIndex).ngClassPristine, dirIndex); i0.ɵelementClassProp(elIndex, 3, i0.ɵload(dirIndex).ngClassDirty, dirIndex); i0.ɵelementClassProp(elIndex, 4, i0.ɵload(dirIndex).ngClassValid, dirIndex); i0.ɵelementClassProp(elIndex, 5, i0.ɵload(dirIndex).ngClassInvalid, dirIndex); i0.ɵelementClassProp(elIndex, 6, i0.ɵload(dirIndex).ngClassPending, dirIndex); i0.ɵelementStylingApply(elIndex, dirIndex); }, hostVars: 7, features: [i0.ɵInheritDefinitionFeature] });
    return NgControlStatusGroup;
}(AbstractControlStatus));
export { NgControlStatusGroup };
/*@__PURE__*/ i0.ɵsetClassMetadata(NgControlStatusGroup, [{
        type: Directive,
        args: [{
                selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                host: ngControlStatusHost
            }]
    }], [{
        type: ControlContainer,
        decorators: [{
                type: Self
            }]
    }], null);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHOUMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7O0FBRXZDO0lBR0UsK0JBQVksRUFBNEI7UUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFFNUQsc0JBQUksbURBQWdCO2FBQXBCLGNBQWtDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDakcsc0JBQUksaURBQWM7YUFBbEIsY0FBZ0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUM3RixzQkFBSSxrREFBZTthQUFuQixjQUFpQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQy9GLHNCQUFJLCtDQUFZO2FBQWhCLGNBQThCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDekYsc0JBQUksK0NBQVk7YUFBaEIsY0FBOEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUN6RixzQkFBSSxpREFBYzthQUFsQixjQUFnQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzdGLHNCQUFJLGlEQUFjO2FBQWxCLGNBQWdDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDL0YsNEJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQzs7QUFFRCxNQUFNLENBQUMsSUFBTSxtQkFBbUIsR0FBRztJQUNqQyxzQkFBc0IsRUFBRSxrQkFBa0I7SUFDMUMsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLHFCQUFxQixFQUFFLGlCQUFpQjtJQUN4QyxrQkFBa0IsRUFBRSxjQUFjO0lBQ2xDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsb0JBQW9CLEVBQUUsZ0JBQWdCO0lBQ3RDLG9CQUFvQixFQUFFLGdCQUFnQjtDQUN2QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSDtJQUNxQywyQ0FBcUI7SUFDeEQseUJBQW9CLEVBQWE7ZUFBSSxrQkFBTSxFQUFFLENBQUM7SUFBRSxDQUFDO2lFQUR0QyxlQUFlLDBKQUFmLGVBQWUsc0JBQ0YsU0FBUzswQkF6RG5DO0NBMERDLEFBSEQsQ0FDcUMscUJBQXFCLEdBRXpEO1NBRlksZUFBZTttQ0FBZixlQUFlO2NBRDNCLFNBQVM7ZUFBQyxFQUFDLFFBQVEsRUFBRSwyQ0FBMkMsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUM7O2NBRW5FLFNBQVM7O3NCQUFwQixJQUFJOzs7QUFHbkI7Ozs7Ozs7R0FPRztBQUNIO0lBSzBDLGdEQUFxQjtJQUM3RCw4QkFBb0IsRUFBb0I7ZUFBSSxrQkFBTSxFQUFFLENBQUM7SUFBRSxDQUFDO3NFQUQ3QyxvQkFBb0IsNE9BQXBCLG9CQUFvQixzQkFDUCxnQkFBZ0I7K0JBMUUxQztDQTJFQyxBQVBELENBSzBDLHFCQUFxQixHQUU5RDtTQUZZLG9CQUFvQjttQ0FBcEIsb0JBQW9CO2NBTGhDLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQ0osMEZBQTBGO2dCQUM5RixJQUFJLEVBQUUsbUJBQW1CO2FBQzFCOztjQUV5QixnQkFBZ0I7O3NCQUEzQixJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgU2VsZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfSBmcm9tICcuL2Fic3RyYWN0X2NvbnRyb2xfZGlyZWN0aXZlJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcblxuZXhwb3J0IGNsYXNzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIHByaXZhdGUgX2NkOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmU7XG5cbiAgY29uc3RydWN0b3IoY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSkgeyB0aGlzLl9jZCA9IGNkOyB9XG5cbiAgZ2V0IG5nQ2xhc3NVbnRvdWNoZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC51bnRvdWNoZWQgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc1RvdWNoZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC50b3VjaGVkIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NQcmlzdGluZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnByaXN0aW5lIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NEaXJ0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLmRpcnR5IDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NWYWxpZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnZhbGlkIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NJbnZhbGlkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wuaW52YWxpZCA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzUGVuZGluZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnBlbmRpbmcgOiBmYWxzZTsgfVxufVxuXG5leHBvcnQgY29uc3QgbmdDb250cm9sU3RhdHVzSG9zdCA9IHtcbiAgJ1tjbGFzcy5uZy11bnRvdWNoZWRdJzogJ25nQ2xhc3NVbnRvdWNoZWQnLFxuICAnW2NsYXNzLm5nLXRvdWNoZWRdJzogJ25nQ2xhc3NUb3VjaGVkJyxcbiAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnbmdDbGFzc1ByaXN0aW5lJyxcbiAgJ1tjbGFzcy5uZy1kaXJ0eV0nOiAnbmdDbGFzc0RpcnR5JyxcbiAgJ1tjbGFzcy5uZy12YWxpZF0nOiAnbmdDbGFzc1ZhbGlkJyxcbiAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICduZ0NsYXNzSW52YWxpZCcsXG4gICdbY2xhc3MubmctcGVuZGluZ10nOiAnbmdDbGFzc1BlbmRpbmcnLFxufTtcblxuLyoqXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBjb250cm9scyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzLiBUaGUgZm9sbG93aW5nIGNsYXNzZXMgYXJlIGFwcGxpZWQgYXMgdGhlIHByb3BlcnRpZXNcbiAqIGJlY29tZSB0cnVlOlxuICpcbiAqICogbmctdmFsaWRcbiAqICogbmctaW52YWxpZFxuICogKiBuZy1wZW5kaW5nXG4gKiAqIG5nLXByaXN0aW5lXG4gKiAqIG5nLWRpcnR5XG4gKiAqIG5nLXVudG91Y2hlZFxuICogKiBuZy10b3VjaGVkXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdLFtuZ01vZGVsXSxbZm9ybUNvbnRyb2xdJywgaG9zdDogbmdDb250cm9sU3RhdHVzSG9zdH0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQFNlbGYoKSBjZDogTmdDb250cm9sKSB7IHN1cGVyKGNkKTsgfVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gQW5ndWxhciBmb3JtIGdyb3VwcyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzICh2YWxpZC9pbnZhbGlkL2RpcnR5L2V0YykuXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnW2Zvcm1Hcm91cE5hbWVdLFtmb3JtQXJyYXlOYW1lXSxbbmdNb2RlbEdyb3VwXSxbZm9ybUdyb3VwXSxmb3JtOm5vdChbbmdOb0Zvcm1dKSxbbmdGb3JtXScsXG4gIGhvc3Q6IG5nQ29udHJvbFN0YXR1c0hvc3Rcbn0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzR3JvdXAgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBjb25zdHJ1Y3RvcihAU2VsZigpIGNkOiBDb250cm9sQ29udGFpbmVyKSB7IHN1cGVyKGNkKTsgfVxufVxuIl19