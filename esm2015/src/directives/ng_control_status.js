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
export class AbstractControlStatus {
    constructor(cd) { this._cd = cd; }
    get ngClassUntouched() { return this._cd.control ? this._cd.control.untouched : false; }
    get ngClassTouched() { return this._cd.control ? this._cd.control.touched : false; }
    get ngClassPristine() { return this._cd.control ? this._cd.control.pristine : false; }
    get ngClassDirty() { return this._cd.control ? this._cd.control.dirty : false; }
    get ngClassValid() { return this._cd.control ? this._cd.control.valid : false; }
    get ngClassInvalid() { return this._cd.control ? this._cd.control.invalid : false; }
    get ngClassPending() { return this._cd.control ? this._cd.control.pending : false; }
}
export const ngControlStatusHost = {
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
export class NgControlStatus extends AbstractControlStatus {
    constructor(cd) { super(cd); }
}
NgControlStatus.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatus, selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]], factory: function NgControlStatus_Factory() { return new NgControlStatus(i0.ɵdirectiveInject(NgControl, 2)); }, hostBindings: function NgControlStatus_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 *
 */
export class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd) { super(cd); }
}
NgControlStatusGroup.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatusGroup, selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]], factory: function NgControlStatusGroup_Factory() { return new NgControlStatusGroup(i0.ɵdirectiveInject(ControlContainer, 2)); }, hostBindings: function NgControlStatusGroup_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHOUMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUV2QyxNQUFNO0lBR0osWUFBWSxFQUE0QixJQUFJLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU1RCxJQUFJLGdCQUFnQixLQUFjLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNqRyxJQUFJLGNBQWMsS0FBYyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDN0YsSUFBSSxlQUFlLEtBQWMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQy9GLElBQUksWUFBWSxLQUFjLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN6RixJQUFJLFlBQVksS0FBYyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekYsSUFBSSxjQUFjLEtBQWMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzdGLElBQUksY0FBYyxLQUFjLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztDQUM5RjtBQUVELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHO0lBQ2pDLHNCQUFzQixFQUFFLGtCQUFrQjtJQUMxQyxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMscUJBQXFCLEVBQUUsaUJBQWlCO0lBQ3hDLGtCQUFrQixFQUFFLGNBQWM7SUFDbEMsa0JBQWtCLEVBQUUsY0FBYztJQUNsQyxvQkFBb0IsRUFBRSxnQkFBZ0I7SUFDdEMsb0JBQW9CLEVBQUUsZ0JBQWdCO0NBQ3ZDLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILE1BQU0sc0JBQXVCLFNBQVEscUJBQXFCO0lBQ3hELFlBQW9CLEVBQWEsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzs2REFEdEMsZUFBZSxtSkFBZixlQUFlLHFCQUNGLFNBQVM7QUFHbkM7Ozs7O0dBS0c7QUFNSCxNQUFNLDJCQUE0QixTQUFRLHFCQUFxQjtJQUM3RCxZQUFvQixFQUFvQixJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O2tFQUQ3QyxvQkFBb0IscU9BQXBCLG9CQUFvQixxQkFDUCxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgcHJpdmF0ZSBfY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZTtcblxuICBjb25zdHJ1Y3RvcihjZDogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlKSB7IHRoaXMuX2NkID0gY2Q7IH1cblxuICBnZXQgbmdDbGFzc1VudG91Y2hlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnVudG91Y2hlZCA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzVG91Y2hlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLnRvdWNoZWQgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc1ByaXN0aW5lKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wucHJpc3RpbmUgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc0RpcnR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wuZGlydHkgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc1ZhbGlkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wudmFsaWQgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc0ludmFsaWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC5pbnZhbGlkIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NQZW5kaW5nKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wucGVuZGluZyA6IGZhbHNlOyB9XG59XG5cbmV4cG9ydCBjb25zdCBuZ0NvbnRyb2xTdGF0dXNIb3N0ID0ge1xuICAnW2NsYXNzLm5nLXVudG91Y2hlZF0nOiAnbmdDbGFzc1VudG91Y2hlZCcsXG4gICdbY2xhc3MubmctdG91Y2hlZF0nOiAnbmdDbGFzc1RvdWNoZWQnLFxuICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICduZ0NsYXNzUHJpc3RpbmUnLFxuICAnW2NsYXNzLm5nLWRpcnR5XSc6ICduZ0NsYXNzRGlydHknLFxuICAnW2NsYXNzLm5nLXZhbGlkXSc6ICduZ0NsYXNzVmFsaWQnLFxuICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ25nQ2xhc3NJbnZhbGlkJyxcbiAgJ1tjbGFzcy5uZy1wZW5kaW5nXSc6ICduZ0NsYXNzUGVuZGluZycsXG59O1xuXG4vKipcbiAqIERpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gQW5ndWxhciBmb3JtIGNvbnRyb2xzIHRoYXQgc2V0cyBDU1MgY2xhc3Nlc1xuICogYmFzZWQgb24gY29udHJvbCBzdGF0dXMuIFRoZSBmb2xsb3dpbmcgY2xhc3NlcyBhcmUgYXBwbGllZCBhcyB0aGUgcHJvcGVydGllc1xuICogYmVjb21lIHRydWU6XG4gKlxuICogKiBuZy12YWxpZFxuICogKiBuZy1pbnZhbGlkXG4gKiAqIG5nLXBlbmRpbmdcbiAqICogbmctcHJpc3RpbmVcbiAqICogbmctZGlydHlcbiAqICogbmctdW50b3VjaGVkXG4gKiAqIG5nLXRvdWNoZWRcbiAqXG4gKlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdLFtuZ01vZGVsXSxbZm9ybUNvbnRyb2xdJywgaG9zdDogbmdDb250cm9sU3RhdHVzSG9zdH0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQFNlbGYoKSBjZDogTmdDb250cm9sKSB7IHN1cGVyKGNkKTsgfVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gQW5ndWxhciBmb3JtIGdyb3VwcyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzICh2YWxpZC9pbnZhbGlkL2RpcnR5L2V0YykuXG4gKlxuICpcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ1tmb3JtR3JvdXBOYW1lXSxbZm9ybUFycmF5TmFtZV0sW25nTW9kZWxHcm91cF0sW2Zvcm1Hcm91cF0sZm9ybTpub3QoW25nTm9Gb3JtXSksW25nRm9ybV0nLFxuICBob3N0OiBuZ0NvbnRyb2xTdGF0dXNIb3N0XG59KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1c0dyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQFNlbGYoKSBjZDogQ29udHJvbENvbnRhaW5lcikgeyBzdXBlcihjZCk7IH1cbn1cbiJdfQ==