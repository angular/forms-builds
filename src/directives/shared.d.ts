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
export declare function setUpControl(control: FormControl, dir: NgControl): void;
export declare function cleanUpControl(control: FormControl | null, dir: NgControl): void;
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
 */
export declare function cleanUpValidators(control: AbstractControl | null, dir: AbstractControlDirective, handleOnValidatorChange: boolean): void;
export declare function setUpFormContainer(control: FormGroup | FormArray, dir: AbstractFormGroupDirective | FormArrayName): void;
export declare function isPropertyUpdated(changes: {
    [key: string]: any;
}, viewModel: any): boolean;
export declare function isBuiltInAccessor(valueAccessor: ControlValueAccessor): boolean;
export declare function syncPendingControls(form: FormGroup, directives: NgControl[]): void;
export declare function selectValueAccessor(dir: NgControl, valueAccessors: ControlValueAccessor[]): ControlValueAccessor | null;
export declare function removeDir<T>(list: T[], el: T): void;
export declare function _ngModelWarning(name: string, type: {
    _ngModelWarningSentOnce: boolean;
}, instance: {
    _ngModelWarningSent: boolean;
}, warningConfig: string | null): void;
