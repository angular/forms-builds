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
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/forms)
 *
 * @see [Forms Guide](/guide/forms)
 *
 * @publicApi
 */
export declare class FormsModule {
    /**
     * @description
     * Provides options for configuring the template-driven forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnDeprecatedNgFormSelector` Configures when to emit a warning when the deprecated
     * `ngForm` selector is used.
     */
    static withConfig(opts: {
        /** @deprecated as of v6 */ warnOnDeprecatedNgFormSelector?: 'never' | 'once' | 'always';
    }): ModuleWithProviders<FormsModule>;
    static ngModuleDef: i0.ɵNgModuleDefWithMeta<FormsModule, [typeof i6.NgModel, typeof i7.NgModelGroup, typeof i8.NgForm, typeof i9.NgFormSelectorWarning], never, [typeof i5.InternalFormsSharedModule, typeof i6.NgModel, typeof i7.NgModelGroup, typeof i8.NgForm, typeof i9.NgFormSelectorWarning]>;
    static ngInjectorDef: i0.ɵInjectorDef<FormsModule>;
}
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/reactive-forms)
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 * @publicApi
 */
export declare class ReactiveFormsModule {
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     */
    static withConfig(opts: {
        /** @deprecated as of v6 */ warnOnNgModelWithFormControl: 'never' | 'once' | 'always';
    }): ModuleWithProviders<ReactiveFormsModule>;
    static ngModuleDef: i0.ɵNgModuleDefWithMeta<ReactiveFormsModule, [typeof i1.FormControlDirective, typeof i2.FormGroupDirective, typeof i3.FormControlName, typeof i4.FormGroupName, typeof i4.FormArrayName], never, [typeof i5.InternalFormsSharedModule, typeof i1.FormControlDirective, typeof i2.FormGroupDirective, typeof i3.FormControlName, typeof i4.FormGroupName, typeof i4.FormArrayName]>;
    static ngInjectorDef: i0.ɵInjectorDef<ReactiveFormsModule>;
}
