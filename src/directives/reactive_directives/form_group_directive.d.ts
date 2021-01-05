/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { EventEmitter, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '../../model';
import { ControlContainer } from '../control_container';
import { Form } from '../form_interface';
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '../validators';
import { FormControlName } from './form_control_name';
import { FormArrayName, FormGroupName } from './form_group_name';
import * as i0 from "@angular/core";
export declare const formDirectiveProvider: any;
/**
 * @description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class FormGroupDirective extends ControlContainer implements Form, OnChanges, OnDestroy {
    private validators;
    private asyncValidators;
    /**
     * @description
     * Reports whether the form submission has been triggered.
     */
    readonly submitted: boolean;
    /**
     * Reference to an old form group input value, which is needed to cleanup old instance in case it
     * was replaced with a new one.
     */
    private _oldForm;
    /**
     * Callback that should be invoked when controls in FormGroup or FormArray collection change
     * (added or removed). This callback triggers corresponding DOM updates.
     */
    private readonly _onCollectionChange;
    /**
     * @description
     * Tracks the list of added `FormControlName` instances
     */
    directives: FormControlName[];
    /**
     * @description
     * Tracks the `FormGroup` bound to this directive.
     */
    form: FormGroup;
    /**
     * @description
     * Emits an event when the form submission has been triggered.
     */
    ngSubmit: EventEmitter<any>;
    constructor(validators: (Validator | ValidatorFn)[], asyncValidators: (AsyncValidator | AsyncValidatorFn)[]);
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective(): Form;
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control(): FormGroup;
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path(): string[];
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir: FormControlName): FormControl;
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir: FormControlName): FormControl;
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir: FormControlName): void;
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir: FormGroupName): void;
    /**
     * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir: FormGroupName): void;
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir: FormGroupName): FormGroup;
    /**
     * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir: FormArrayName): void;
    /**
     * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir: FormArrayName): void;
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir: FormArrayName): FormArray;
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir: FormControlName, value: any): void;
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event: Event): boolean;
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset(): void;
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value?: any): void;
    private _setUpFormContainer;
    private _cleanUpFormContainer;
    private _updateRegistrations;
    private _updateValidators;
    private _checkFormPresent;
    static ɵfac: i0.ɵɵFactoryDef<FormGroupDirective, [{ optional: true; self: true; }, { optional: true; self: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<FormGroupDirective, "[formGroup]", ["ngForm"], { "form": "formGroup"; }, { "ngSubmit": "ngSubmit"; }, never>;
}
