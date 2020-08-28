/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, InjectionToken, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '../../model';
import { ControlValueAccessor } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '../validators';
import * as i0 from "@angular/core";
/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
export declare const NG_MODEL_WITH_FORM_CONTROL_WARNING: InjectionToken<unknown>;
export declare const formControlBinding: any;
/**
 * @description
 * Synchronizes a standalone `FormControl` instance to a form control element.
 *
 * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives was deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * The following example shows how to register a standalone control and set its value.
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormControlDirective extends NgControl implements OnChanges {
    private _ngModelWarningConfig;
    /**
     * Internal reference to the view model value.
     * @nodoc
     */
    viewModel: any;
    /**
     * @description
     * Tracks the `FormControl` instance bound to the directive.
     */
    form: FormControl;
    /**
     * @description
     * Triggers a warning in dev mode that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled: boolean);
    /** @deprecated as of v6 */
    model: any;
    /** @deprecated as of v6 */
    update: EventEmitter<any>;
    constructor(validators: Array<Validator | ValidatorFn>, asyncValidators: Array<AsyncValidator | AsyncValidatorFn>, valueAccessors: ControlValueAccessor[], _ngModelWarningConfig: string | null);
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path(): string[];
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
    get asyncValidator(): AsyncValidatorFn | null;
    /**
     * @description
     * The `FormControl` bound to this directive.
     */
    get control(): FormControl;
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue: any): void;
    private _isControlChanged;
    static ɵfac: i0.ɵɵFactoryDef<FormControlDirective, [{ optional: true; self: true; }, { optional: true; self: true; }, { optional: true; self: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<FormControlDirective, "[formControl]", ["ngForm"], { "form": "formControl"; "isDisabled": "disabled"; "model": "ngModel"; }, { "update": "ngModelChange"; }, never>;
}
