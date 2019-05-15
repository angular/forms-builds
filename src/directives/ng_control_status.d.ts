import { AbstractControlDirective } from './abstract_control_directive';
import { ControlContainer } from './control_container';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
export declare class AbstractControlStatus {
    private _cd;
    constructor(cd: AbstractControlDirective);
    readonly ngClassUntouched: boolean;
    readonly ngClassTouched: boolean;
    readonly ngClassPristine: boolean;
    readonly ngClassDirty: boolean;
    readonly ngClassValid: boolean;
    readonly ngClassInvalid: boolean;
    readonly ngClassPending: boolean;
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
    static ngDirectiveDef: i0.ΔDirectiveDefWithMeta<NgControlStatus, "[formControlName],[ngModel],[formControl]", never, {}, {}, never>;
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
    static ngDirectiveDef: i0.ΔDirectiveDefWithMeta<NgControlStatusGroup, "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", never, {}, {}, never>;
}
