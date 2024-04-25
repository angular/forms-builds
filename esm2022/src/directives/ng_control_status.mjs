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
export class NgControlStatus extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0-next.0+sha-f1d6f86", ngImport: i0, type: NgControlStatus, deps: [{ token: i1.NgControl, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.0-next.0+sha-f1d6f86", type: NgControlStatus, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0-next.0+sha-f1d6f86", ngImport: i0, type: NgControlStatus, decorators: [{
            type: Directive,
            args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost }]
        }], ctorParameters: () => [{ type: i1.NgControl, decorators: [{
                    type: Self
                }] }] });
/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc). On groups, this includes the additional
 * class ng-submitted.
 *
 * @see {@link NgControlStatus}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0-next.0+sha-f1d6f86", ngImport: i0, type: NgControlStatusGroup, deps: [{ token: i2.ControlContainer, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.0-next.0+sha-f1d6f86", type: NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending", "class.ng-submitted": "isSubmitted" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0-next.0+sha-f1d6f86", ngImport: i0, type: NgControlStatusGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                    host: ngGroupStatusHost,
                }]
        }], ctorParameters: () => [{ type: i2.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQXdCLE1BQU0sZUFBZSxDQUFDO0FBRy9FLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7QUFJdkMsbUJBQW1CO0FBQ25CLHNFQUFzRTtBQUN0RSx1RUFBdUU7QUFDdkUsc0JBQXNCO0FBQ3RCLE1BQU0sT0FBTyxxQkFBcUI7SUFHaEMsWUFBWSxFQUFtQztRQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBYyxTQUFTO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxXQUFXO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBYyxVQUFVO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBYyxPQUFPO1FBQ25CLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBYyxPQUFPO1FBQ25CLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBYyxTQUFTO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxTQUFTO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxXQUFXO1FBQ3ZCLHlGQUF5RjtRQUN6RixxRkFBcUY7UUFDckYsT0FBTyxDQUFDLENBQUUsSUFBSSxDQUFDLEdBQW9ELEVBQUUsU0FBUyxDQUFDO0lBQ2pGLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHO0lBQ2pDLHNCQUFzQixFQUFFLGFBQWE7SUFDckMsb0JBQW9CLEVBQUUsV0FBVztJQUNqQyxxQkFBcUIsRUFBRSxZQUFZO0lBQ25DLGtCQUFrQixFQUFFLFNBQVM7SUFDN0Isa0JBQWtCLEVBQUUsU0FBUztJQUM3QixvQkFBb0IsRUFBRSxXQUFXO0lBQ2pDLG9CQUFvQixFQUFFLFdBQVc7Q0FDbEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHO0lBQy9CLEdBQUcsbUJBQW1CO0lBQ3RCLHNCQUFzQixFQUFFLGFBQWE7Q0FDdEMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBRUgsTUFBTSxPQUFPLGVBQWdCLFNBQVEscUJBQXFCO0lBQ3hELFlBQW9CLEVBQWE7UUFDL0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osQ0FBQzt5SEFIVSxlQUFlOzZHQUFmLGVBQWU7O3NHQUFmLGVBQWU7a0JBRDNCLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsMkNBQTJDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFDOzswQkFFOUUsSUFBSTs7QUFLbkI7Ozs7Ozs7Ozs7O0dBV0c7QUFNSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEscUJBQXFCO0lBQzdELFlBQWdDLEVBQW9CO1FBQ2xELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLENBQUM7eUhBSFUsb0JBQW9COzZHQUFwQixvQkFBb0I7O3NHQUFwQixvQkFBb0I7a0JBTGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUNOLDBGQUEwRjtvQkFDNUYsSUFBSSxFQUFFLGlCQUFpQjtpQkFDeEI7OzBCQUVjLFFBQVE7OzBCQUFJLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIE9wdGlvbmFsLCBTZWxmLCDJtVdyaXRhYmxlIGFzIFdyaXRhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHt0eXBlIE5nRm9ybX0gZnJvbSAnLi9uZ19mb3JtJztcbmltcG9ydCB7dHlwZSBGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5cbi8vIERPIE5PVCBSRUZBQ1RPUiFcbi8vIEVhY2ggc3RhdHVzIGlzIHJlcHJlc2VudGVkIGJ5IGEgc2VwYXJhdGUgZnVuY3Rpb24gdG8gbWFrZSBzdXJlIHRoYXRcbi8vIGFkdmFuY2VkIENsb3N1cmUgQ29tcGlsZXIgb3B0aW1pemF0aW9ucyByZWxhdGVkIHRvIHByb3BlcnR5IHJlbmFtaW5nXG4vLyBjYW4gd29yayBjb3JyZWN0bHkuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgcHJpdmF0ZSBfY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB8IG51bGwpIHtcbiAgICB0aGlzLl9jZCA9IGNkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc1RvdWNoZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnRvdWNoZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzVW50b3VjaGVkKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy51bnRvdWNoZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzUHJpc3RpbmUoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnByaXN0aW5lO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc0RpcnR5KCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5kaXJ0eTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNWYWxpZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8udmFsaWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzSW52YWxpZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8uaW52YWxpZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNQZW5kaW5nKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5wZW5kaW5nO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc1N1Ym1pdHRlZCgpIHtcbiAgICAvLyBXZSBjaGVjayBmb3IgdGhlIGBzdWJtaXR0ZWRgIGZpZWxkIGZyb20gYE5nRm9ybWAgYW5kIGBGb3JtR3JvdXBEaXJlY3RpdmVgIGNsYXNzZXMsIGJ1dFxuICAgIC8vIHdlIGF2b2lkIGluc3RhbmNlb2YgY2hlY2tzIHRvIHByZXZlbnQgbm9uLXRyZWUtc2hha2FibGUgcmVmZXJlbmNlcyB0byB0aG9zZSB0eXBlcy5cbiAgICByZXR1cm4gISEodGhpcy5fY2QgYXMgV3JpdGFibGU8TmdGb3JtIHwgRm9ybUdyb3VwRGlyZWN0aXZlPiB8IG51bGwpPy5zdWJtaXR0ZWQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG5nQ29udHJvbFN0YXR1c0hvc3QgPSB7XG4gICdbY2xhc3MubmctdW50b3VjaGVkXSc6ICdpc1VudG91Y2hlZCcsXG4gICdbY2xhc3MubmctdG91Y2hlZF0nOiAnaXNUb3VjaGVkJyxcbiAgJ1tjbGFzcy5uZy1wcmlzdGluZV0nOiAnaXNQcmlzdGluZScsXG4gICdbY2xhc3MubmctZGlydHldJzogJ2lzRGlydHknLFxuICAnW2NsYXNzLm5nLXZhbGlkXSc6ICdpc1ZhbGlkJyxcbiAgJ1tjbGFzcy5uZy1pbnZhbGlkXSc6ICdpc0ludmFsaWQnLFxuICAnW2NsYXNzLm5nLXBlbmRpbmddJzogJ2lzUGVuZGluZycsXG59O1xuXG5leHBvcnQgY29uc3QgbmdHcm91cFN0YXR1c0hvc3QgPSB7XG4gIC4uLm5nQ29udHJvbFN0YXR1c0hvc3QsXG4gICdbY2xhc3Mubmctc3VibWl0dGVkXSc6ICdpc1N1Ym1pdHRlZCcsXG59O1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gY29udHJvbHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDU1MgY2xhc3NlcyBhcHBsaWVkXG4gKlxuICogVGhlIGZvbGxvd2luZyBjbGFzc2VzIGFyZSBhcHBsaWVkIGFzIHRoZSBwcm9wZXJ0aWVzIGJlY29tZSB0cnVlOlxuICpcbiAqICogbmctdmFsaWRcbiAqICogbmctaW52YWxpZFxuICogKiBuZy1wZW5kaW5nXG4gKiAqIG5nLXByaXN0aW5lXG4gKiAqIG5nLWRpcnR5XG4gKiAqIG5nLXVudG91Y2hlZFxuICogKiBuZy10b3VjaGVkXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdLFtuZ01vZGVsXSxbZm9ybUNvbnRyb2xdJywgaG9zdDogbmdDb250cm9sU3RhdHVzSG9zdH0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQFNlbGYoKSBjZDogTmdDb250cm9sKSB7XG4gICAgc3VwZXIoY2QpO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBncm91cHMgdGhhdCBzZXRzIENTUyBjbGFzc2VzXG4gKiBiYXNlZCBvbiBjb250cm9sIHN0YXR1cyAodmFsaWQvaW52YWxpZC9kaXJ0eS9ldGMpLiBPbiBncm91cHMsIHRoaXMgaW5jbHVkZXMgdGhlIGFkZGl0aW9uYWxcbiAqIGNsYXNzIG5nLXN1Ym1pdHRlZC5cbiAqXG4gKiBAc2VlIHtAbGluayBOZ0NvbnRyb2xTdGF0dXN9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgJ1tmb3JtR3JvdXBOYW1lXSxbZm9ybUFycmF5TmFtZV0sW25nTW9kZWxHcm91cF0sW2Zvcm1Hcm91cF0sZm9ybTpub3QoW25nTm9Gb3JtXSksW25nRm9ybV0nLFxuICBob3N0OiBuZ0dyb3VwU3RhdHVzSG9zdCxcbn0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzR3JvdXAgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2VsZigpIGNkOiBDb250cm9sQ29udGFpbmVyKSB7XG4gICAgc3VwZXIoY2QpO1xuICB9XG59XG4iXX0=