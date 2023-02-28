/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Optional, Self } from '@angular/core';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
import * as i1 from "./ng_control";
import * as i2 from "./control_container";
// DO NOT REFACTOR!
// Each status is represented by a separate function to make sure that
// advanced Closure Compiler optimizations related to property renaming
// can work correctly.
export class AbstractControlStatus {
    constructor(cd) {
        this._cd = cd;
    }
    get isTouched() {
        return !!this._cd?.control?.touched;
    }
    get isUntouched() {
        return !!this._cd?.control?.untouched;
    }
    get isPristine() {
        return !!this._cd?.control?.pristine;
    }
    get isDirty() {
        return !!this._cd?.control?.dirty;
    }
    get isValid() {
        return !!this._cd?.control?.valid;
    }
    get isInvalid() {
        return !!this._cd?.control?.invalid;
    }
    get isPending() {
        return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
        // We check for the `submitted` field from `NgForm` and `FormGroupDirective` classes, but
        // we avoid instanceof checks to prevent non-tree-shakable references to those types.
        return !!this._cd?.submitted;
    }
}
export const ngControlStatusHost = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
};
export const ngGroupStatusHost = {
    ...ngControlStatusHost,
    '[class.ng-submitted]': 'isSubmitted',
};
/**
 * @description
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status.
 *
 * @usageNotes
 *
 * ### CSS classes applied
 *
 * The following classes are applied as the properties become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgControlStatus extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatus.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-dba747f", ngImport: i0, type: NgControlStatus, deps: [{ token: i1.NgControl, self: true }], target: i0.ɵɵFactoryTarget.Directive });
NgControlStatus.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.0+sha-dba747f", type: NgControlStatus, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending" } }, usesInheritance: true, ngImport: i0 });
export { NgControlStatus };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-dba747f", ngImport: i0, type: NgControlStatus, decorators: [{
            type: Directive,
            args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost }]
        }], ctorParameters: function () { return [{ type: i1.NgControl, decorators: [{
                    type: Self
                }] }]; } });
/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc). On groups, this includes the additional
 * class ng-submitted.
 *
 * @see `NgControlStatus`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatusGroup.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-dba747f", ngImport: i0, type: NgControlStatusGroup, deps: [{ token: i2.ControlContainer, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive });
NgControlStatusGroup.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.0+sha-dba747f", type: NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending", "class.ng-submitted": "isSubmitted" } }, usesInheritance: true, ngImport: i0 });
export { NgControlStatusGroup };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.0+sha-dba747f", ngImport: i0, type: NgControlStatusGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                    host: ngGroupStatusHost
                }]
        }], ctorParameters: function () { return [{ type: i2.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHeEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7OztBQUV2QyxtQkFBbUI7QUFDbkIsc0VBQXNFO0FBQ3RFLHVFQUF1RTtBQUN2RSxzQkFBc0I7QUFDdEIsTUFBTSxPQUFPLHFCQUFxQjtJQUdoQyxZQUFZLEVBQWlDO1FBQzNDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxJQUFjLFNBQVM7UUFDckIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFjLFdBQVc7UUFDdkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxJQUFjLFVBQVU7UUFDdEIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxJQUFjLE9BQU87UUFDbkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFjLE9BQU87UUFDbkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxJQUFjLFNBQVM7UUFDckIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFjLFNBQVM7UUFDckIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFjLFdBQVc7UUFDdkIseUZBQXlGO1FBQ3pGLHFGQUFxRjtRQUNyRixPQUFPLENBQUMsQ0FBRSxJQUFJLENBQUMsR0FBOEMsRUFBRSxTQUFTLENBQUM7SUFDM0UsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQUc7SUFDakMsc0JBQXNCLEVBQUUsYUFBYTtJQUNyQyxvQkFBb0IsRUFBRSxXQUFXO0lBQ2pDLHFCQUFxQixFQUFFLFlBQVk7SUFDbkMsa0JBQWtCLEVBQUUsU0FBUztJQUM3QixrQkFBa0IsRUFBRSxTQUFTO0lBQzdCLG9CQUFvQixFQUFFLFdBQVc7SUFDakMsb0JBQW9CLEVBQUUsV0FBVztDQUNsQyxDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUc7SUFDL0IsR0FBRyxtQkFBbUI7SUFDdEIsc0JBQXNCLEVBQUUsYUFBYTtDQUN0QyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQkc7QUFDSCxNQUNhLGVBQWdCLFNBQVEscUJBQXFCO0lBQ3hELFlBQW9CLEVBQWE7UUFDL0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osQ0FBQzs7dUhBSFUsZUFBZTsyR0FBZixlQUFlO1NBQWYsZUFBZTtzR0FBZixlQUFlO2tCQUQzQixTQUFTO21CQUFDLEVBQUMsUUFBUSxFQUFFLDJDQUEyQyxFQUFFLElBQUksRUFBRSxtQkFBbUIsRUFBQzs7MEJBRTlFLElBQUk7O0FBS25COzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFLYSxvQkFBcUIsU0FBUSxxQkFBcUI7SUFDN0QsWUFBZ0MsRUFBb0I7UUFDbEQsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osQ0FBQzs7NEhBSFUsb0JBQW9CO2dIQUFwQixvQkFBb0I7U0FBcEIsb0JBQW9CO3NHQUFwQixvQkFBb0I7a0JBTGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUNKLDBGQUEwRjtvQkFDOUYsSUFBSSxFQUFFLGlCQUFpQjtpQkFDeEI7OzBCQUVjLFFBQVE7OzBCQUFJLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIE9wdGlvbmFsLCBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuXG4vLyBETyBOT1QgUkVGQUNUT1IhXG4vLyBFYWNoIHN0YXR1cyBpcyByZXByZXNlbnRlZCBieSBhIHNlcGFyYXRlIGZ1bmN0aW9uIHRvIG1ha2Ugc3VyZSB0aGF0XG4vLyBhZHZhbmNlZCBDbG9zdXJlIENvbXBpbGVyIG9wdGltaXphdGlvbnMgcmVsYXRlZCB0byBwcm9wZXJ0eSByZW5hbWluZ1xuLy8gY2FuIHdvcmsgY29ycmVjdGx5LlxuZXhwb3J0IGNsYXNzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIHByaXZhdGUgX2NkOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV8bnVsbDtcblxuICBjb25zdHJ1Y3RvcihjZDogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfG51bGwpIHtcbiAgICB0aGlzLl9jZCA9IGNkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc1RvdWNoZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnRvdWNoZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzVW50b3VjaGVkKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy51bnRvdWNoZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzUHJpc3RpbmUoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnByaXN0aW5lO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc0RpcnR5KCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5kaXJ0eTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8udmFsaWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8uaW52YWxpZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNQZW5kaW5nKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5wZW5kaW5nO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc1N1Ym1pdHRlZCgpIHtcbiAgICAvLyBXZSBjaGVjayBmb3IgdGhlIGBzdWJtaXR0ZWRgIGZpZWxkIGZyb20gYE5nRm9ybWAgYW5kIGBGb3JtR3JvdXBEaXJlY3RpdmVgIGNsYXNzZXMsIGJ1dFxuICAgIC8vIHdlIGF2b2lkIGluc3RhbmNlb2YgY2hlY2tzIHRvIHByZXZlbnQgbm9uLXRyZWUtc2hha2FibGUgcmVmZXJlbmNlcyB0byB0aG9zZSB0eXBlcy5cbiAgICByZXR1cm4gISEodGhpcy5fY2QgYXMgdW5rbm93biBhcyB7c3VibWl0dGVkOiBib29sZWFufSB8IG51bGwpPy5zdWJtaXR0ZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG5nQ29udHJvbFN0YXR1c0hvc3QgPSB7XG4gICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdpc1VudG91Y2hlZCcsXG4gICdbY2xhc3MubmctdG91Y2hlZF0nOiAnaXNUb3VjaGVkJyxcbiAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnaXNQcmlzdGluZScsXG4gICdbY2xhc3MubmctZGlydHldJzogJ2lzRGlydHknLFxuICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdpc1ZhbGlkJyxcbiAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICdpc0ludmFsaWQnLFxuICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ2lzUGVuZGluZycsXG59O1xuXG5leHBvcnQgY29uc3QgbmdHcm91cFN0YXR1c0hvc3QgPSB7XG4gIC4uLm5nQ29udHJvbFN0YXR1c0hvc3QsXG4gICdbY2xhc3Mubmctc3VibWl0dGVkXSc6ICdpc1N1Ym1pdHRlZCcsXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gY29udHJvbHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDU1MgY2xhc3NlcyBhcHBsaWVkXG4gKlxuICogVGhlIGZvbGxvd2luZyBjbGFzc2VzIGFyZSBhcHBsaWVkIGFzIHRoZSBwcm9wZXJ0aWVzIGJlY29tZSB0cnVlOlxuICpcbiAqICogbmctdmFsaWRcbiAqICogbmctaW52YWxpZFxuICogKiBuZy1wZW5kaW5nXG4gKiAqIG5nLXByaXN0aW5lXG4gKiAqIG5nLWRpcnR5XG4gKiAqIG5nLXVudG91Y2hlZFxuICogKiBuZy10b3VjaGVkXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdLFtuZ01vZGVsXSxbZm9ybUNvbnRyb2xdJywgaG9zdDogbmdDb250cm9sU3RhdHVzSG9zdH0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQFNlbGYoKSBjZDogTmdDb250cm9sKSB7XG4gICAgc3VwZXIoY2QpO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBncm91cHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cyAodmFsaWQvaW52YWxpZC9kaXJ0eS9ldGMpLiBPbiBncm91cHMsIHRoaXMgaW5jbHVkZXMgdGhlIGFkZGl0aW9uYWxcbiAqIGNsYXNzIG5nLXN1Ym1pdHRlZC5cbiAqXG4gKiBAc2VlIGBOZ0NvbnRyb2xTdGF0dXNgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnW2Zvcm1Hcm91cE5hbWVdLFtmb3JtQXJyYXlOYW1lXSxbbmdNb2RlbEdyb3VwXSxbZm9ybUdyb3VwXSxmb3JtOm5vdChbbmdOb0Zvcm1dKSxbbmdGb3JtXScsXG4gIGhvc3Q6IG5nR3JvdXBTdGF0dXNIb3N0XG59KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1c0dyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQFNlbGYoKSBjZDogQ29udHJvbENvbnRhaW5lcikge1xuICAgIHN1cGVyKGNkKTtcbiAgfVxufVxuIl19