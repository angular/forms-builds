/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ModuleWithProviders } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "./directives/ng_model";
import * as i2 from "./directives/ng_model_group";
import * as i3 from "./directives/ng_form";
import * as i4 from "./directives/ng_form_selector_warning";
import * as i5 from "./directives";
import * as i6 from "./directives/reactive_directives/form_control_directive";
import * as i7 from "./directives/reactive_directives/form_group_directive";
import * as i8 from "./directives/reactive_directives/form_control_name";
import * as i9 from "./directives/reactive_directives/form_group_name";
/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
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
    static ngModuleDef: i0.ɵɵNgModuleDefWithMeta<FormsModule, [typeof i1.NgModel, typeof i2.NgModelGroup, typeof i3.NgForm, typeof i4.NgFormSelectorWarning], never, [typeof i5.ɵInternalFormsSharedModule, typeof i1.NgModel, typeof i2.NgModelGroup, typeof i3.NgForm, typeof i4.NgFormSelectorWarning]>;
    static ngInjectorDef: i0.ɵɵInjectorDef<FormsModule>;
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
    static ngModuleDef: i0.ɵɵNgModuleDefWithMeta<ReactiveFormsModule, [typeof i6.FormControlDirective, typeof i7.FormGroupDirective, typeof i8.FormControlName, typeof i9.FormGroupName, typeof i9.FormArrayName], never, [typeof i5.ɵInternalFormsSharedModule, typeof i6.FormControlDirective, typeof i7.FormGroupDirective, typeof i8.FormControlName, typeof i9.FormGroupName, typeof i9.FormArrayName]>;
    static ngInjectorDef: i0.ɵɵInjectorDef<ReactiveFormsModule>;
}
