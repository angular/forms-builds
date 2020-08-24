/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl } from '../../model';
import { ControlContainer } from '../control_container';
import { ControlValueAccessor } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '../validators';
import * as i0 from "@angular/core";
export declare const controlNameBinding: any;
/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * ### Register `FormControl` within a group
 *
 * The following example shows how to register multiple form controls within a form group
 * and set their value.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel is deprecated
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 *
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormControlName extends NgControl implements OnChanges, OnDestroy {
    private _ngModelWarningConfig;
    private _added;
    /**
     * @description
     * Tracks the `FormControl` instance bound to the directive.
     */
    readonly control: FormControl;
    /**
     * @description
     * Tracks the name of the `FormControl` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * Accepts a name as a string or a number.
     * The name in the form of a string is useful for individual forms,
     * while the numerical form allows for form controls to be bound
     * to indices when iterating over controls in a `FormArray`.
     */
    name: string | number | null;
    /**
     * @description
     * Triggers a warning that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled: boolean);
    /** @deprecated as of v6 */
    model: any;
    /** @deprecated as of v6 */
    update: EventEmitter<any>;
    constructor(parent: ControlContainer, validators: Array<Validator | ValidatorFn>, asyncValidators: Array<AsyncValidator | AsyncValidatorFn>, valueAccessors: ControlValueAccessor[], _ngModelWarningConfig: string | null);
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     */
    ngOnDestroy(): void;
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue: any): void;
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path(): string[];
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective(): any;
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators
     * registered with this directive.
     */
    get validator(): ValidatorFn | null;
    /**
     * @description
     * Async validator function composed of all the async validators registered with this
     * directive.
     */
    get asyncValidator(): AsyncValidatorFn;
    private _checkParentType;
    private _setUpControl;
    static ɵfac: i0.ɵɵFactoryDef<FormControlName, [{ optional: true; host: true; skipSelf: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<FormControlName, "[formControlName]", never, { "name": "formControlName"; "isDisabled": "disabled"; "model": "ngModel"; }, { "update": "ngModelChange"; }, never>;
}
