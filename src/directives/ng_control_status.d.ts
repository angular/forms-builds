import { AbstractControlDirective } from './abstract_control_directive';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
declare type AnyControlStatus = 'untouched' | 'touched' | 'pristine' | 'dirty' | 'valid' | 'invalid' | 'pending';
export declare class AbstractControlStatus {
    private _cd;
    constructor(cd: AbstractControlDirective | null);
    is(status: AnyControlStatus): boolean;
}
export declare const ngControlStatusHost: {
    '[class.ng-untouched]': string;
    '[class.ng-touched]': string;
    '[class.ng-pristine]': string;
    '[class.ng-dirty]': string;
    '[class.ng-valid]': string;
    '[class.ng-invalid]': string;
    '[class.ng-pending]': string;
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
export declare class NgControlStatus extends AbstractControlStatus {
    constructor(cd: NgControl);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgControlStatus, [{ self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgControlStatus, "[formControlName],[ngModel],[formControl]", never, {}, {}, never>;
}
/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @see `NgControlStatus`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd: ControlContainer);
    static ɵfac: i0.ɵɵFactoryDeclaration<NgControlStatusGroup, [{ optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NgControlStatusGroup, "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", never, {}, {}, never>;
}
export {};
