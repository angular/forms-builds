import * as i0 from "@angular/core";
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
import { Directive, Self } from '@angular/core';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
export class AbstractControlStatus {
    /**
     * @param {?} cd
     */
    constructor(cd) { this._cd = cd; }
    /**
     * @return {?}
     */
    get ngClassUntouched() { return this._cd.control ? this._cd.control.untouched : false; }
    /**
     * @return {?}
     */
    get ngClassTouched() { return this._cd.control ? this._cd.control.touched : false; }
    /**
     * @return {?}
     */
    get ngClassPristine() { return this._cd.control ? this._cd.control.pristine : false; }
    /**
     * @return {?}
     */
    get ngClassDirty() { return this._cd.control ? this._cd.control.dirty : false; }
    /**
     * @return {?}
     */
    get ngClassValid() { return this._cd.control ? this._cd.control.valid : false; }
    /**
     * @return {?}
     */
    get ngClassInvalid() { return this._cd.control ? this._cd.control.invalid : false; }
    /**
     * @return {?}
     */
    get ngClassPending() { return this._cd.control ? this._cd.control.pending : false; }
}
if (false) {
    /** @type {?} */
    AbstractControlStatus.prototype._cd;
}
/** @type {?} */
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
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
export class NgControlStatus extends AbstractControlStatus {
    /**
     * @param {?} cd
     */
    constructor(cd) { super(cd); }
}
NgControlStatus.decorators = [
    { type: Directive, args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost },] },
];
/** @nocollapse */
NgControlStatus.ctorParameters = () => [
    { type: NgControl, decorators: [{ type: Self }] }
];
NgControlStatus.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatus, selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]], factory: function NgControlStatus_Factory() { return new NgControlStatus(i0.ɵdirectiveInject(NgControl, 2)); }, hostBindings: function NgControlStatus_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });
/**
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
export class NgControlStatusGroup extends AbstractControlStatus {
    /**
     * @param {?} cd
     */
    constructor(cd) { super(cd); }
}
NgControlStatusGroup.decorators = [
    { type: Directive, args: [{
                selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                host: ngControlStatusHost
            },] },
];
/** @nocollapse */
NgControlStatusGroup.ctorParameters = () => [
    { type: ControlContainer, decorators: [{ type: Self }] }
];
NgControlStatusGroup.ngDirectiveDef = i0.ɵdefineDirective({ type: NgControlStatusGroup, selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]], factory: function NgControlStatusGroup_Factory() { return new NgControlStatusGroup(i0.ɵdirectiveInject(ControlContainer, 2)); }, hostBindings: function NgControlStatusGroup_HostBindings(dirIndex, elIndex) { i0.ɵp(elIndex, "class.ng-untouched", i0.ɵb(i0.ɵd(dirIndex).ngClassUntouched)); i0.ɵp(elIndex, "class.ng-touched", i0.ɵb(i0.ɵd(dirIndex).ngClassTouched)); i0.ɵp(elIndex, "class.ng-pristine", i0.ɵb(i0.ɵd(dirIndex).ngClassPristine)); i0.ɵp(elIndex, "class.ng-dirty", i0.ɵb(i0.ɵd(dirIndex).ngClassDirty)); i0.ɵp(elIndex, "class.ng-valid", i0.ɵb(i0.ɵd(dirIndex).ngClassValid)); i0.ɵp(elIndex, "class.ng-invalid", i0.ɵb(i0.ɵd(dirIndex).ngClassInvalid)); i0.ɵp(elIndex, "class.ng-pending", i0.ɵb(i0.ɵd(dirIndex).ngClassPending)); }, features: [i0.ɵInheritDefinitionFeature] });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUc5QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUNyRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRXZDLE1BQU07Ozs7SUFHSixZQUFZLEVBQTRCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRTs7OztJQUU1RCxJQUFJLGdCQUFnQixLQUFjLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Ozs7SUFDakcsSUFBSSxjQUFjLEtBQWMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7OztJQUM3RixJQUFJLGVBQWUsS0FBYyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFOzs7O0lBQy9GLElBQUksWUFBWSxLQUFjLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Ozs7SUFDekYsSUFBSSxZQUFZLEtBQWMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7OztJQUN6RixJQUFJLGNBQWMsS0FBYyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFOzs7O0lBQzdGLElBQUksY0FBYyxLQUFjLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Q0FDOUY7Ozs7OztBQUVELGFBQWEsbUJBQW1CLEdBQUc7SUFDakMsc0JBQXNCLEVBQUUsa0JBQWtCO0lBQzFDLG9CQUFvQixFQUFFLGdCQUFnQjtJQUN0QyxxQkFBcUIsRUFBRSxpQkFBaUI7SUFDeEMsa0JBQWtCLEVBQUUsY0FBYztJQUNsQyxrQkFBa0IsRUFBRSxjQUFjO0lBQ2xDLG9CQUFvQixFQUFFLGdCQUFnQjtJQUN0QyxvQkFBb0IsRUFBRSxnQkFBZ0I7Q0FDdkMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkYsTUFBTSxzQkFBdUIsU0FBUSxxQkFBcUI7Ozs7SUFDeEQsWUFBb0IsRUFBYSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFOzs7WUFGbEQsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLDJDQUEyQyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBQzs7OztZQTFDckYsU0FBUyx1QkE0Q0YsSUFBSTs7NkRBRE4sZUFBZSxtSkFBZixlQUFlLHFCQUNGLFNBQVM7Ozs7Ozs7O0FBZW5DLE1BQU0sMkJBQTRCLFNBQVEscUJBQXFCOzs7O0lBQzdELFlBQW9CLEVBQW9CLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7OztZQU56RCxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUNKLDBGQUEwRjtnQkFDOUYsSUFBSSxFQUFFLG1CQUFtQjthQUMxQjs7OztZQTNETyxnQkFBZ0IsdUJBNkRULElBQUk7O2tFQUROLG9CQUFvQixxT0FBcEIsb0JBQW9CLHFCQUNQLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9hYnN0cmFjdF9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4vbmdfY29udHJvbCc7XG5cbmV4cG9ydCBjbGFzcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBwcml2YXRlIF9jZDogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlO1xuXG4gIGNvbnN0cnVjdG9yKGNkOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUpIHsgdGhpcy5fY2QgPSBjZDsgfVxuXG4gIGdldCBuZ0NsYXNzVW50b3VjaGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wudW50b3VjaGVkIDogZmFsc2U7IH1cbiAgZ2V0IG5nQ2xhc3NUb3VjaGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fY2QuY29udHJvbCA/IHRoaXMuX2NkLmNvbnRyb2wudG91Y2hlZCA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzUHJpc3RpbmUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC5wcmlzdGluZSA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzRGlydHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC5kaXJ0eSA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzVmFsaWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC52YWxpZCA6IGZhbHNlOyB9XG4gIGdldCBuZ0NsYXNzSW52YWxpZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2NkLmNvbnRyb2wgPyB0aGlzLl9jZC5jb250cm9sLmludmFsaWQgOiBmYWxzZTsgfVxuICBnZXQgbmdDbGFzc1BlbmRpbmcoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9jZC5jb250cm9sID8gdGhpcy5fY2QuY29udHJvbC5wZW5kaW5nIDogZmFsc2U7IH1cbn1cblxuZXhwb3J0IGNvbnN0IG5nQ29udHJvbFN0YXR1c0hvc3QgPSB7XG4gICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICduZ0NsYXNzVW50b3VjaGVkJyxcbiAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICduZ0NsYXNzVG91Y2hlZCcsXG4gICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ25nQ2xhc3NQcmlzdGluZScsXG4gICdbY2xhc3MubmctZGlydHldJzogJ25nQ2xhc3NEaXJ0eScsXG4gICdbY2xhc3MubmctdmFsaWRdJzogJ25nQ2xhc3NWYWxpZCcsXG4gICdbY2xhc3MubmctaW52YWxpZF0nOiAnbmdDbGFzc0ludmFsaWQnLFxuICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ25nQ2xhc3NQZW5kaW5nJyxcbn07XG5cbi8qKlxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gY29udHJvbHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cy4gVGhlIGZvbGxvd2luZyBjbGFzc2VzIGFyZSBhcHBsaWVkIGFzIHRoZSBwcm9wZXJ0aWVzXG4gKiBiZWNvbWUgdHJ1ZTpcbiAqXG4gKiAqIG5nLXZhbGlkXG4gKiAqIG5nLWludmFsaWRcbiAqICogbmctcGVuZGluZ1xuICogKiBuZy1wcmlzdGluZVxuICogKiBuZy1kaXJ0eVxuICogKiBuZy11bnRvdWNoZWRcbiAqICogbmctdG91Y2hlZFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xOYW1lXSxbbmdNb2RlbF0sW2Zvcm1Db250cm9sXScsIGhvc3Q6IG5nQ29udHJvbFN0YXR1c0hvc3R9KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1cyBleHRlbmRzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIGNvbnN0cnVjdG9yKEBTZWxmKCkgY2Q6IE5nQ29udHJvbCkgeyBzdXBlcihjZCk7IH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBncm91cHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cyAodmFsaWQvaW52YWxpZC9kaXJ0eS9ldGMpLlxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ1tmb3JtR3JvdXBOYW1lXSxbZm9ybUFycmF5TmFtZV0sW25nTW9kZWxHcm91cF0sW2Zvcm1Hcm91cF0sZm9ybTpub3QoW25nTm9Gb3JtXSksW25nRm9ybV0nLFxuICBob3N0OiBuZ0NvbnRyb2xTdGF0dXNIb3N0XG59KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1c0dyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQFNlbGYoKSBjZDogQ29udHJvbENvbnRhaW5lcikgeyBzdXBlcihjZCk7IH1cbn1cbiJdfQ==