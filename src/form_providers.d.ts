import * as i0 from '@angular/core';
import * as i1 from './directives/reactive_directives/form_control_directive';
import * as i2 from './directives/reactive_directives/form_group_directive';
import * as i3 from './directives/reactive_directives/form_control_name';
import * as i4 from './directives/reactive_directives/form_group_name';
import * as i5 from './directives';
import * as i6 from './directives/ng_model';
import * as i7 from './directives/ng_model_group';
import * as i8 from './directives/ng_form';
import * as i9 from './directives/ng_form_selector_warning';
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ModuleWithProviders } from '@angular/core';
/**
 * The ng module for forms.
 *
 */
export declare class FormsModule {
    static withConfig(opts: {
        /** @deprecated as of v6 */ warnOnDeprecatedNgFormSelector?: 'never' | 'once' | 'always';
    }): ModuleWithProviders;
    static ngModuleDef: i0.ɵNgModuleDef<FormsModule, [typeof i6.NgModel,typeof i7.NgModelGroup,typeof i8.NgForm,typeof i9.NgFormSelectorWarning], never, [typeof i5.InternalFormsSharedModule,typeof i6.NgModel,typeof i7.NgModelGroup,typeof i8.NgForm,typeof i9.NgFormSelectorWarning]>;
    static ngInjectorDef: i0.ɵInjectorDef<FormsModule>;
}
/**
 * The ng module for reactive forms.
 *
 */
export declare class ReactiveFormsModule {
    static withConfig(opts: {
        /** @deprecated as of v6 */ warnOnNgModelWithFormControl: 'never' | 'once' | 'always';
    }): ModuleWithProviders<ReactiveFormsModule>;
    static ngModuleDef: i0.ɵNgModuleDef<ReactiveFormsModule, [typeof i1.FormControlDirective,typeof i2.FormGroupDirective,typeof i3.FormControlName,typeof i4.FormGroupName,typeof i4.FormArrayName], never, [typeof i5.InternalFormsSharedModule,typeof i1.FormControlDirective,typeof i2.FormGroupDirective,typeof i3.FormControlName,typeof i4.FormGroupName,typeof i4.FormArrayName]>;
    static ngInjectorDef: i0.ɵInjectorDef<ReactiveFormsModule>;
}
