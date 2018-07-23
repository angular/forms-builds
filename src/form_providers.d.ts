import * as i0 from '@angular/core';
import * as i1 from './directives/reactive_directives/form_control_directive';
import * as i2 from './directives/reactive_directives/form_group_directive';
import * as i3 from './directives/reactive_directives/form_control_name';
import * as i4 from './directives/reactive_directives/form_group_name';
import * as i5 from './directives/ng_model';
import * as i6 from './directives/ng_model_group';
import * as i7 from './directives/ng_form';
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
    static ngModuleDef: i0.ɵNgModuleDef<FormsModule, [typeof i5.NgModel,typeof i6.NgModelGroup,typeof i7.NgForm], never, [typeof InternalFormsSharedModule,typeof i5.NgModel,typeof i6.NgModelGroup,typeof i7.NgForm]>;
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
    static ngModuleDef: i0.ɵNgModuleDef<ReactiveFormsModule, [typeof i1.FormControlDirective,typeof i2.FormGroupDirective,typeof i3.FormControlName,typeof i4.FormGroupName,typeof i4.FormArrayName], never, [typeof InternalFormsSharedModule,typeof i1.FormControlDirective,typeof i2.FormGroupDirective,typeof i3.FormControlName,typeof i4.FormGroupName,typeof i4.FormArrayName]>;
    static ngInjectorDef: i0.ɵInjectorDef<ReactiveFormsModule>;
}
