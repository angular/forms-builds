/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbstractControl, FormArray, FormControl, FormGroup } from '../model';
import { AbstractControlDirective } from './abstract_control_directive';
import { AbstractFormGroupDirective } from './abstract_form_group_directive';
import { ControlContainer } from './control_container';
import { ControlValueAccessor } from './control_value_accessor';
import { NgControl } from './ng_control';
import { FormArrayName } from './reactive_directives/form_group_name';
export declare function controlPath(name: string | null, parent: ControlContainer): string[];
/**
 * Links a Form control and a Form directive by setting up callbacks (such as `onChange`) on both
 * instances. This function is typically invoked when form directive is being initialized.
 *
 * @param control Form control instance that should be linked.
 * @param dir Directive that should be linked with a given control.
 */
export declare function setUpControl(control: FormControl, dir: NgControl): void;
/**
 * Reverts configuration performed by the `setUpControl` control function.
 * Effectively disconnects form control with a given form directive.
 * This function is typically invoked when corresponding form directive is being destroyed.
 *
 * @param control Form control which should be cleaned up.
 * @param dir Directive that should be disconnected from a given control.
 * @param validateControlPresenceOnChange Flag that indicates whether onChange handler should
 *     contain asserts to verify that it's not called once directive is destroyed. We need this flag
 *     to avoid potentially breaking changes caused by better control cleanup introduced in #39235.
 */
export declare function cleanUpControl(control: FormControl | null, dir: NgControl, validateControlPresenceOnChange?: boolean): void;
/**
 * Sets up disabled change handler function on a given form control if ControlValueAccessor
 * associated with a given directive instance supports the `setDisabledState` call.
 *
 * @param control Form control where disabled change handler should be setup.
 * @param dir Corresponding directive instance associated with this control.
 */
export declare function setUpDisabledChangeHandler(control: FormControl, dir: NgControl): void;
/**
 * Sets up sync and async directive validators on provided form control.
 * This function merges validators from the directive into the validators of the control.
 *
 * @param control Form control where directive validators should be setup.
 * @param dir Directive instance that contains validators to be setup.
 * @param handleOnValidatorChange Flag that determines whether directive validators should be setup
 *     to handle validator input change.
 */
export declare function setUpValidators(control: AbstractControl, dir: AbstractControlDirective, handleOnValidatorChange: boolean): void;
/**
 * Cleans up sync and async directive validators on provided form control.
 * This function reverts the setup performed by the `setUpValidators` function, i.e.
 * removes directive-specific validators from a given control instance.
 *
 * @param control Form control from where directive validators should be removed.
 * @param dir Directive instance that contains validators to be removed.
 * @param handleOnValidatorChange Flag that determines whether directive validators should also be
 *     cleaned up to stop handling validator input change (if previously configured to do so).
 * @returns true if a control was updated as a result of this action.
 */
export declare function cleanUpValidators(control: AbstractControl | null, dir: AbstractControlDirective, handleOnValidatorChange: boolean): boolean;
/**
 * Links a FormGroup or FormArray instance and corresponding Form directive by setting up validators
 * present in the view.
 *
 * @param control FormGroup or FormArray instance that should be linked.
 * @param dir Directive that provides view validators.
 */
export declare function setUpFormContainer(control: FormGroup | FormArray, dir: AbstractFormGroupDirective | FormArrayName): void;
/**
 * Reverts the setup performed by the `setUpFormContainer` function.
 *
 * @param control FormGroup or FormArray instance that should be cleaned up.
 * @param dir Directive that provided view validators.
 * @returns true if a control was updated as a result of this action.
 */
export declare function cleanUpFormContainer(control: FormGroup | FormArray, dir: AbstractFormGroupDirective | FormArrayName): boolean;
export declare function isPropertyUpdated(changes: {
    [key: string]: any;
}, viewModel: any): boolean;
export declare function isBuiltInAccessor(valueAccessor: ControlValueAccessor): boolean;
export declare function syncPendingControls(form: FormGroup, directives: NgControl[]): void;
export declare function selectValueAccessor(dir: NgControl, valueAccessors: ControlValueAccessor[]): ControlValueAccessor | null;
export declare function removeListItem<T>(list: T[], el: T): void;
export declare function _ngModelWarning(name: string, type: {
    _ngModelWarningSentOnce: boolean;
}, instance: {
    _ngModelWarningSent: boolean;
}, warningConfig: string | null): void;
