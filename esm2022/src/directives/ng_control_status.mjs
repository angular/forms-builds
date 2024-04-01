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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-840c375", ngImport: i0, type: NgControlStatus, deps: [{ token: i1.NgControl, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.0-next.2+sha-840c375", type: NgControlStatus, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-840c375", ngImport: i0, type: NgControlStatus, decorators: [{
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-840c375", ngImport: i0, type: NgControlStatusGroup, deps: [{ token: i2.ControlContainer, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.0-next.2+sha-840c375", type: NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending", "class.ng-submitted": "isSubmitted" } }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.2+sha-840c375", ngImport: i0, type: NgControlStatusGroup, decorators: [{
            type: Directive,
            args: [{
                    selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                    host: ngGroupStatusHost
                }]
        }], ctorParameters: () => [{ type: i2.ControlContainer, decorators: [{
                    type: Optional
                }, {
                    type: Self
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbF9zdGF0dXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQXdCLE1BQU0sZUFBZSxDQUFDO0FBRy9FLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3JELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7QUFJdkMsbUJBQW1CO0FBQ25CLHNFQUFzRTtBQUN0RSx1RUFBdUU7QUFDdkUsc0JBQXNCO0FBQ3RCLE1BQU0sT0FBTyxxQkFBcUI7SUFHaEMsWUFBWSxFQUFpQztRQUMzQyxJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsSUFBYyxTQUFTO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxXQUFXO1FBQ3ZCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsSUFBYyxVQUFVO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBYyxPQUFPO1FBQ25CLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBYyxPQUFPO1FBQ25CLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQztJQUNwQyxDQUFDO0lBRUQsSUFBYyxTQUFTO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxTQUFTO1FBQ3JCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBYyxXQUFXO1FBQ3ZCLHlGQUF5RjtRQUN6RixxRkFBcUY7UUFDckYsT0FBTyxDQUFDLENBQUUsSUFBSSxDQUFDLEdBQWlELEVBQUUsU0FBUyxDQUFDO0lBQzlFLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxNQUFNLG1CQUFtQixHQUFHO0lBQ2pDLHNCQUFzQixFQUFFLGFBQWE7SUFDckMsb0JBQW9CLEVBQUUsV0FBVztJQUNqQyxxQkFBcUIsRUFBRSxZQUFZO0lBQ25DLGtCQUFrQixFQUFFLFNBQVM7SUFDN0Isa0JBQWtCLEVBQUUsU0FBUztJQUM3QixvQkFBb0IsRUFBRSxXQUFXO0lBQ2pDLG9CQUFvQixFQUFFLFdBQVc7Q0FDbEMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHO0lBQy9CLEdBQUcsbUJBQW1CO0lBQ3RCLHNCQUFzQixFQUFFLGFBQWE7Q0FDdEMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBRUgsTUFBTSxPQUFPLGVBQWdCLFNBQVEscUJBQXFCO0lBQ3hELFlBQW9CLEVBQWE7UUFDL0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1osQ0FBQzt5SEFIVSxlQUFlOzZHQUFmLGVBQWU7O3NHQUFmLGVBQWU7a0JBRDNCLFNBQVM7bUJBQUMsRUFBQyxRQUFRLEVBQUUsMkNBQTJDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFDOzswQkFFOUUsSUFBSTs7QUFLbkI7Ozs7Ozs7Ozs7O0dBV0c7QUFNSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEscUJBQXFCO0lBQzdELFlBQWdDLEVBQW9CO1FBQ2xELEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLENBQUM7eUhBSFUsb0JBQW9COzZHQUFwQixvQkFBb0I7O3NHQUFwQixvQkFBb0I7a0JBTGhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUNKLDBGQUEwRjtvQkFDOUYsSUFBSSxFQUFFLGlCQUFpQjtpQkFDeEI7OzBCQUVjLFFBQVE7OzBCQUFJLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIE9wdGlvbmFsLCBTZWxmLCDJtVdyaXRhYmxlIGFzIFdyaXRhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHt0eXBlIE5nRm9ybX0gZnJvbSAnLi9uZ19mb3JtJztcbmltcG9ydCB7dHlwZSBGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5cbi8vIERPIE5PVCBSRUZBQ1RPUiFcbi8vIEVhY2ggc3RhdHVzIGlzIHJlcHJlc2VudGVkIGJ5IGEgc2VwYXJhdGUgZnVuY3Rpb24gdG8gbWFrZSBzdXJlIHRoYXRcbi8vIGFkdmFuY2VkIENsb3N1cmUgQ29tcGlsZXIgb3B0aW1pemF0aW9ucyByZWxhdGVkIHRvIHByb3BlcnR5IHJlbmFtaW5nXG4vLyBjYW4gd29yayBjb3JyZWN0bHkuXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RDb250cm9sU3RhdHVzIHtcbiAgcHJpdmF0ZSBfY2Q6IEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZXxudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGNkOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV8bnVsbCkge1xuICAgIHRoaXMuX2NkID0gY2Q7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzVG91Y2hlZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8udG91Y2hlZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNVbnRvdWNoZWQoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnVudG91Y2hlZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNQcmlzdGluZSgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jZD8uY29udHJvbD8ucHJpc3RpbmU7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzRGlydHkoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LmRpcnR5O1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc1ZhbGlkKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy52YWxpZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgaXNJbnZhbGlkKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NkPy5jb250cm9sPy5pbnZhbGlkO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBpc1BlbmRpbmcoKSB7XG4gICAgcmV0dXJuICEhdGhpcy5fY2Q/LmNvbnRyb2w/LnBlbmRpbmc7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGlzU3VibWl0dGVkKCkge1xuICAgIC8vIFdlIGNoZWNrIGZvciB0aGUgYHN1Ym1pdHRlZGAgZmllbGQgZnJvbSBgTmdGb3JtYCBhbmQgYEZvcm1Hcm91cERpcmVjdGl2ZWAgY2xhc3NlcywgYnV0XG4gICAgLy8gd2UgYXZvaWQgaW5zdGFuY2VvZiBjaGVja3MgdG8gcHJldmVudCBub24tdHJlZS1zaGFrYWJsZSByZWZlcmVuY2VzIHRvIHRob3NlIHR5cGVzLlxuICAgIHJldHVybiAhISh0aGlzLl9jZCBhcyBXcml0YWJsZTxOZ0Zvcm18Rm9ybUdyb3VwRGlyZWN0aXZlPnwgbnVsbCk/LnN1Ym1pdHRlZDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgbmdDb250cm9sU3RhdHVzSG9zdCA9IHtcbiAgJ1tjbGFzcy5uZy11bnRvdWNoZWRdJzogJ2lzVW50b3VjaGVkJyxcbiAgJ1tjbGFzcy5uZy10b3VjaGVkXSc6ICdpc1RvdWNoZWQnLFxuICAnW2NsYXNzLm5nLXByaXN0aW5lXSc6ICdpc1ByaXN0aW5lJyxcbiAgJ1tjbGFzcy5uZy1kaXJ0eV0nOiAnaXNEaXJ0eScsXG4gICdbY2xhc3MubmctdmFsaWRdJzogJ2lzVmFsaWQnLFxuICAnW2NsYXNzLm5nLWludmFsaWRdJzogJ2lzSW52YWxpZCcsXG4gICdbY2xhc3MubmctcGVuZGluZ10nOiAnaXNQZW5kaW5nJyxcbn07XG5cbmV4cG9ydCBjb25zdCBuZ0dyb3VwU3RhdHVzSG9zdCA9IHtcbiAgLi4ubmdDb250cm9sU3RhdHVzSG9zdCxcbiAgJ1tjbGFzcy5uZy1zdWJtaXR0ZWRdJzogJ2lzU3VibWl0dGVkJyxcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBEaXJlY3RpdmUgYXV0b21hdGljYWxseSBhcHBsaWVkIHRvIEFuZ3VsYXIgZm9ybSBjb250cm9scyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENTUyBjbGFzc2VzIGFwcGxpZWRcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGNsYXNzZXMgYXJlIGFwcGxpZWQgYXMgdGhlIHByb3BlcnRpZXMgYmVjb21lIHRydWU6XG4gKlxuICogKiBuZy12YWxpZFxuICogKiBuZy1pbnZhbGlkXG4gKiAqIG5nLXBlbmRpbmdcbiAqICogbmctcHJpc3RpbmVcbiAqICogbmctZGlydHlcbiAqICogbmctdW50b3VjaGVkXG4gKiAqIG5nLXRvdWNoZWRcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW2Zvcm1Db250cm9sTmFtZV0sW25nTW9kZWxdLFtmb3JtQ29udHJvbF0nLCBob3N0OiBuZ0NvbnRyb2xTdGF0dXNIb3N0fSlcbmV4cG9ydCBjbGFzcyBOZ0NvbnRyb2xTdGF0dXMgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBjb25zdHJ1Y3RvcihAU2VsZigpIGNkOiBOZ0NvbnRyb2wpIHtcbiAgICBzdXBlcihjZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIERpcmVjdGl2ZSBhdXRvbWF0aWNhbGx5IGFwcGxpZWQgdG8gQW5ndWxhciBmb3JtIGdyb3VwcyB0aGF0IHNldHMgQ1NTIGNsYXNzZXNcbiAqIGJhc2VkIG9uIGNvbnRyb2wgc3RhdHVzICh2YWxpZC9pbnZhbGlkL2RpcnR5L2V0YykuIE9uIGdyb3VwcywgdGhpcyBpbmNsdWRlcyB0aGUgYWRkaXRpb25hbFxuICogY2xhc3Mgbmctc3VibWl0dGVkLlxuICpcbiAqIEBzZWUge0BsaW5rIE5nQ29udHJvbFN0YXR1c31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdbZm9ybUdyb3VwTmFtZV0sW2Zvcm1BcnJheU5hbWVdLFtuZ01vZGVsR3JvdXBdLFtmb3JtR3JvdXBdLGZvcm06bm90KFtuZ05vRm9ybV0pLFtuZ0Zvcm1dJyxcbiAgaG9zdDogbmdHcm91cFN0YXR1c0hvc3Rcbn0pXG5leHBvcnQgY2xhc3MgTmdDb250cm9sU3RhdHVzR3JvdXAgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2xTdGF0dXMge1xuICBjb25zdHJ1Y3RvcihAT3B0aW9uYWwoKSBAU2VsZigpIGNkOiBDb250cm9sQ29udGFpbmVyKSB7XG4gICAgc3VwZXIoY2QpO1xuICB9XG59XG4iXX0=