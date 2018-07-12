import * as i0 from '@angular/core';
import * as i1 from './directives/ng_no_validate_directive';
import * as i2 from './directives/select_control_value_accessor';
import * as i3 from './directives/select_multiple_control_value_accessor';
import * as i4 from './directives/default_value_accessor';
import * as i5 from './directives/number_value_accessor';
import * as i6 from './directives/range_value_accessor';
import * as i7 from './directives/checkbox_value_accessor';
import * as i8 from './directives/radio_control_value_accessor';
import * as i9 from './directives/ng_control_status';
import * as i10 from './directives/validators';
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Type } from '@angular/core';
export { CheckboxControlValueAccessor } from './directives/checkbox_value_accessor';
export { ControlValueAccessor } from './directives/control_value_accessor';
export { DefaultValueAccessor } from './directives/default_value_accessor';
export { NgControl } from './directives/ng_control';
export { NgControlStatus, NgControlStatusGroup } from './directives/ng_control_status';
export { NgForm } from './directives/ng_form';
export { NgModel } from './directives/ng_model';
export { NgModelGroup } from './directives/ng_model_group';
export { NumberValueAccessor } from './directives/number_value_accessor';
export { RadioControlValueAccessor } from './directives/radio_control_value_accessor';
export { RangeValueAccessor } from './directives/range_value_accessor';
export { FormControlDirective, NG_MODEL_WITH_FORM_CONTROL_WARNING } from './directives/reactive_directives/form_control_directive';
export { FormControlName } from './directives/reactive_directives/form_control_name';
export { FormGroupDirective } from './directives/reactive_directives/form_group_directive';
export { FormArrayName, FormGroupName } from './directives/reactive_directives/form_group_name';
export { NgSelectOption, SelectControlValueAccessor } from './directives/select_control_value_accessor';
export { NgSelectMultipleOption, SelectMultipleControlValueAccessor } from './directives/select_multiple_control_value_accessor';
export declare const SHARED_FORM_DIRECTIVES: Type<any>[];
export declare const TEMPLATE_DRIVEN_DIRECTIVES: Type<any>[];
export declare const REACTIVE_DRIVEN_DIRECTIVES: Type<any>[];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
export declare class InternalFormsSharedModule {
    static ngModuleDef: i0.ɵNgModuleDef<InternalFormsSharedModule, [i1.NgNoValidate,i2.NgSelectOption,i3.NgSelectMultipleOption,i4.DefaultValueAccessor,i5.NumberValueAccessor,i6.RangeValueAccessor,i7.CheckboxControlValueAccessor,i2.SelectControlValueAccessor,i3.SelectMultipleControlValueAccessor,i8.RadioControlValueAccessor,i9.NgControlStatus,i9.NgControlStatusGroup,i10.RequiredValidator,i10.MinLengthValidator,i10.MaxLengthValidator,i10.PatternValidator,i10.CheckboxRequiredValidator,i10.EmailValidator], [], [i1.NgNoValidate,i2.NgSelectOption,i3.NgSelectMultipleOption,i4.DefaultValueAccessor,i5.NumberValueAccessor,i6.RangeValueAccessor,i7.CheckboxControlValueAccessor,i2.SelectControlValueAccessor,i3.SelectMultipleControlValueAccessor,i8.RadioControlValueAccessor,i9.NgControlStatus,i9.NgControlStatusGroup,i10.RequiredValidator,i10.MinLengthValidator,i10.MaxLengthValidator,i10.PatternValidator,i10.CheckboxRequiredValidator,i10.EmailValidator]>;
    static ngInjectorDef: i0.ɵInjectorDef<InternalFormsSharedModule>;
}
