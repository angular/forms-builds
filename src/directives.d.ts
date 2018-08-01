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
    static ngModuleDef: i0.ɵNgModuleDef<InternalFormsSharedModule, [typeof i1.NgNoValidate,typeof i2.NgSelectOption,typeof i3.NgSelectMultipleOption,typeof i4.DefaultValueAccessor,typeof i5.NumberValueAccessor,typeof i6.RangeValueAccessor,typeof i7.CheckboxControlValueAccessor,typeof i2.SelectControlValueAccessor,typeof i3.SelectMultipleControlValueAccessor,typeof i8.RadioControlValueAccessor,typeof i9.NgControlStatus,typeof i9.NgControlStatusGroup,typeof i10.RequiredValidator,typeof i10.MinLengthValidator,typeof i10.MaxLengthValidator,typeof i10.PatternValidator,typeof i10.CheckboxRequiredValidator,typeof i10.EmailValidator], never, [typeof i1.NgNoValidate,typeof i2.NgSelectOption,typeof i3.NgSelectMultipleOption,typeof i4.DefaultValueAccessor,typeof i5.NumberValueAccessor,typeof i6.RangeValueAccessor,typeof i7.CheckboxControlValueAccessor,typeof i2.SelectControlValueAccessor,typeof i3.SelectMultipleControlValueAccessor,typeof i8.RadioControlValueAccessor,typeof i9.NgControlStatus,typeof i9.NgControlStatusGroup,typeof i10.RequiredValidator,typeof i10.MinLengthValidator,typeof i10.MaxLengthValidator,typeof i10.PatternValidator,typeof i10.CheckboxRequiredValidator,typeof i10.EmailValidator]>;
    static ngInjectorDef: i0.ɵInjectorDef<InternalFormsSharedModule>;
}
