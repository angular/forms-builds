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
        // track the touched signal
        this._cd?.control?._touched?.();
        return !!this._cd?.control?.touched;
    }
    get isUntouched() {
        return !!this._cd?.control?.untouched;
    }
    get isPristine() {
        // track the pristine signal
        this._cd?.control?._pristine?.();
        return !!this._cd?.control?.pristine;
    }
    get isDirty() {
        // pristine signal already tracked above
        return !!this._cd?.control?.dirty;
    }
    get isValid() {
        // track the status signal
        this._cd?.control?._status?.();
        return !!this._cd?.control?.valid;
    }
    get isInvalid() {
        // status signal already tracked above
        return !!this._cd?.control?.invalid;
    }
    get isPending() {
        // status signal already tracked above
        return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
        // track the submitted signal
        this._cd?._submitted?.();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2+sha-03553c4", ngImport: i0, type: NgControlStatus, deps: [{ token: i1.NgControl, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2+sha-03553c4", type: NgControlStatus, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2+sha-03553c4", ngImport: i0, type: NgControlStatus, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2+sha-03553c4", ngImport: i0, type: NgControlStatusGroup, deps: [{ token: i2.ControlContainer, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2+sha-03553c4", type: NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending", "class.ng-submitted": "isSubmitted" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2+sha-03553c4", ngImport: i0, type: NgControlStatusGroup, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQXdCLE1BQU0sZUFBZSxDQUFDO0FBRy9FLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7QUFJdkMsbUJBQW1CO0FBQ25CLHNFQUFzRTtBQUN0RSx1RUFBdUU7QUFDdkUsc0JBQXNCO0FBQ3RCLE1BQU0sT0FBTyxxQkFBcUI7SUFHaEMsWUFBWSxFQUFtQztRQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBYyxTQUFTO1FBQ3JCLDJCQUEyQjtRQUMzQixJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxXQUFXO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBYyxVQUFVO1FBQ3RCLDRCQUE0QjtRQUM1QixJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBYyxPQUFPO1FBQ25CLHdDQUF3QztRQUN4QyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQWMsT0FBTztRQUNuQiwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQztRQUMvQixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUM7SUFDcEMsQ0FBQztJQUVELElBQWMsU0FBUztRQUNyQixzQ0FBc0M7UUFDdEMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxJQUFjLFNBQVM7UUFDckIsc0NBQXNDO1FBQ3RDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxXQUFXO1FBQ3ZCLDZCQUE2QjtRQUM1QixJQUFJLENBQUMsR0FBb0QsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDO1FBQzNFLHlGQUF5RjtRQUN6RixxRkFBcUY7UUFDckYsT0FBTyxDQUFDLENBQUUsSUFBSSxDQUFDLEdBQW9ELEVBQUUsU0FBUyxDQUFDO0lBQ2pGLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHO0lBQ2pDLHNCQUFzQixFQUFFLGFBQWE7SUFDckMsb0JBQW9CLEVBQUUsV0FBVztJQUNqQyxxQkFBcUIsRUFBRSxZQUFZO0lBQ25DLGtCQUFrQixFQUFFLFNBQVM7SUFDN0Isa0JBQWtCLEVBQUUsU0FBUztJQUM3QixvQkFBb0IsRUFBRSxXQUFXO0lBQ2pDLG9CQUFvQixFQUFFLFdBQVc7Q0FDbEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHO0lBQy9CLEdBQUcsbUJBQW1CO0lBQ3RCLHNCQUFzQixFQUFFLGFBQWE7Q0FDdEMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBRUgsTUFBTSxPQUFPLGVBQWdCLFNBQVEscUJBQXFCO0lBQ3hELFlBQW9CLEVBQWE7UUFDL0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osQ0FBQzt5SEFIVSxlQUFlOzZHQUFmLGVBQWU7O3NHQUFmLGVBQWU7a0JBRDNCLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsMkNBQTJDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFDOzswQkFFOUUsSUFBSTs7QUFLbkI7Ozs7Ozs7Ozs7O0dBV0c7QUFNSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEscUJBQXFCO0lBQzdELFlBQWdDLEVBQW9CO1FBQ2xELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLENBQUM7eUhBSFUsb0JBQW9COzZHQUFwQixvQkFBb0I7O3NHQUFwQixvQkFBb0I7a0JBTGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUNOLDBGQUEwRjtvQkFDNUYsSUFBSSxFQUFFLGlCQUFpQjtpQkFDeEI7OzBCQUVjLFFBQVE7OzBCQUFJLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIE9wdGlvbmFsLCBTZWxmLCDJtVdyaXRhYmxlIGFzIFdyaXRhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHt0eXBlIE5nRm9ybX0gZnJvbSAnLi9uZ19mb3JtJztcbmltcG9ydCB7dHlwZSBGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5cbi8vIERPIE5PVCBSRUZBQ1RPUiFcbi8vIEVhY2ggc3RhdHVzIGlzIHJlcHJlc2VudGVkIGJ5IGEgc2VwYXJhdGUgZnVuY3Rpb24gdG8gbWFrZSBzdXJlIHRoYXRcbi8vIGFkdmFuY2VkIENsb3N1cmUgQ29tcGlsZXIgb3B0aW1pemF0aW9ucyByZWxhdGVkIHRvIHByb3BlcnR5IHJlbmFtaW5nXG4vLyBjYW4gd29yayBjb3JyZWN0bHkuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgcHJpdmF0ZSBfY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB8IG51bGw7XG5cbiAgY29uc3RydWN0b3IoY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB8IG51bGwpIHtcbiAgICB0aGlzLl9jZCA9IGNkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc1RvdWNoZWQoKSB7XG4gICAgLy8gdHJhY2sgdGhlIHRvdWNoZWQgc2lnbmFsXG4gICAgdGhpcy5fY2Q/LmNvbnRyb2w/Ll90b3VjaGVkPy4oKTtcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8udG91Y2hlZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNVbnRvdWNoZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnVudG91Y2hlZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNQcmlzdGluZSgpIHtcbiAgICAvLyB0cmFjayB0aGUgcHJpc3RpbmUgc2lnbmFsXG4gICAgdGhpcy5fY2Q/LmNvbnRyb2w/Ll9wcmlzdGluZT8uKCk7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnByaXN0aW5lO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc0RpcnR5KCkge1xuICAgIC8vIHByaXN0aW5lIHNpZ25hbCBhbHJlYWR5IHRyYWNrZWQgYWJvdmVcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8uZGlydHk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzVmFsaWQoKSB7XG4gICAgLy8gdHJhY2sgdGhlIHN0YXR1cyBzaWduYWxcbiAgICB0aGlzLl9jZD8uY29udHJvbD8uX3N0YXR1cz8uKCk7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnZhbGlkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc0ludmFsaWQoKSB7XG4gICAgLy8gc3RhdHVzIHNpZ25hbCBhbHJlYWR5IHRyYWNrZWQgYWJvdmVcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8uaW52YWxpZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNQZW5kaW5nKCkge1xuICAgIC8vIHN0YXR1cyBzaWduYWwgYWxyZWFkeSB0cmFja2VkIGFib3ZlXG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnBlbmRpbmc7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzU3VibWl0dGVkKCkge1xuICAgIC8vIHRyYWNrIHRoZSBzdWJtaXR0ZWQgc2lnbmFsXG4gICAgKHRoaXMuX2NkIGFzIFdyaXRhYmxlPE5nRm9ybSB8IEZvcm1Hcm91cERpcmVjdGl2ZT4gfCBudWxsKT8uX3N1Ym1pdHRlZD8uKCk7XG4gICAgLy8gV2UgY2hlY2sgZm9yIHRoZSBgc3VibWl0dGVkYCBmaWVsZCBmcm9tIGBOZ0Zvcm1gIGFuZCBgRm9ybUdyb3VwRGlyZWN0aXZlYCBjbGFzc2VzLCBidXRcbiAgICAvLyB3ZSBhdm9pZCBpbnN0YW5jZW9mIGNoZWNrcyB0byBwcmV2ZW50IG5vbi10cmVlLXNoYWthYmxlIHJlZmVyZW5jZXMgdG8gdGhvc2UgdHlwZXMuXG4gICAgcmV0dXJuICEhKHRoaXMuX2NkIGFzIFdyaXRhYmxlPE5nRm9ybSB8IEZvcm1Hcm91cERpcmVjdGl2ZT4gfCBudWxsKT8uc3VibWl0dGVkO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBuZ0NvbnRyb2xTdGF0dXNIb3N0ID0ge1xuICAnW2NsYXNzLm5nLXVudG91Y2hlZF0nOiAnaXNVbnRvdWNoZWQnLFxuICAnW2NsYXNzLm5nLXRvdWNoZWRdJzogJ2lzVG91Y2hlZCcsXG4gICdbY2xhc3MubmctcHJpc3RpbmVdJzogJ2lzUHJpc3RpbmUnLFxuICAnW2NsYXNzLm5nLWRpcnR5XSc6ICdpc0RpcnR5JyxcbiAgJ1tjbGFzcy5uZy12YWxpZF0nOiAnaXNWYWxpZCcsXG4gICdbY2xhc3MubmctaW52YWxpZF0nOiAnaXNJbnZhbGlkJyxcbiAgJ1tjbGFzcy5uZy1wZW5kaW5nXSc6ICdpc1BlbmRpbmcnLFxufTtcblxuZXhwb3J0IGNvbnN0IG5nR3JvdXBTdGF0dXNIb3N0ID0ge1xuICAuLi5uZ0NvbnRyb2xTdGF0dXNIb3N0LFxuICAnW2NsYXNzLm5nLXN1Ym1pdHRlZF0nOiAnaXNTdWJtaXR0ZWQnLFxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gQW5ndWxhciBmb3JtIGNvbnRyb2xzIHRoYXQgc2V0cyBDU1MgY2xhc3Nlc1xuICogYmFzZWQgb24gY29udHJvbCBzdGF0dXMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgQ1NTIGNsYXNzZXMgYXBwbGllZFxuICpcbiAqIFRoZSBmb2xsb3dpbmcgY2xhc3NlcyBhcmUgYXBwbGllZCBhcyB0aGUgcHJvcGVydGllcyBiZWNvbWUgdHJ1ZTpcbiAqXG4gKiAqIG5nLXZhbGlkXG4gKiAqIG5nLWludmFsaWRcbiAqICogbmctcGVuZGluZ1xuICogKiBuZy1wcmlzdGluZVxuICogKiBuZy1kaXJ0eVxuICogKiBuZy11bnRvdWNoZWRcbiAqICogbmctdG91Y2hlZFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbZm9ybUNvbnRyb2xOYW1lXSxbbmdNb2RlbF0sW2Zvcm1Db250cm9sXScsIGhvc3Q6IG5nQ29udHJvbFN0YXR1c0hvc3R9KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1cyBleHRlbmRzIEFic3RyYWN0Q29udHJvbFN0YXR1cyB7XG4gIGNvbnN0cnVjdG9yKEBTZWxmKCkgY2Q6IE5nQ29udHJvbCkge1xuICAgIHN1cGVyKGNkKTtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogRGlyZWN0aXZlIGF1dG9tYXRpY2FsbHkgYXBwbGllZCB0byBBbmd1bGFyIGZvcm0gZ3JvdXBzIHRoYXQgc2V0cyBDU1MgY2xhc3Nlc1xuICogYmFzZWQgb24gY29udHJvbCBzdGF0dXMgKHZhbGlkL2ludmFsaWQvZGlydHkvZXRjKS4gT24gZ3JvdXBzLCB0aGlzIGluY2x1ZGVzIHRoZSBhZGRpdGlvbmFsXG4gKiBjbGFzcyBuZy1zdWJtaXR0ZWQuXG4gKlxuICogQHNlZSB7QGxpbmsgTmdDb250cm9sU3RhdHVzfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICdbZm9ybUdyb3VwTmFtZV0sW2Zvcm1BcnJheU5hbWVdLFtuZ01vZGVsR3JvdXBdLFtmb3JtR3JvdXBdLGZvcm06bm90KFtuZ05vRm9ybV0pLFtuZ0Zvcm1dJyxcbiAgaG9zdDogbmdHcm91cFN0YXR1c0hvc3QsXG59KVxuZXhwb3J0IGNsYXNzIE5nQ29udHJvbFN0YXR1c0dyb3VwIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgQFNlbGYoKSBjZDogQ29udHJvbENvbnRhaW5lcikge1xuICAgIHN1cGVyKGNkKTtcbiAgfVxufVxuIl19