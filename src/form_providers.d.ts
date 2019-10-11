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
import * as i4 from "./directives";
import * as i5 from "./directives/reactive_directives/form_control_directive";
import * as i6 from "./directives/reactive_directives/form_group_directive";
import * as i7 from "./directives/reactive_directives/form_control_name";
import * as i8 from "./directives/reactive_directives/form_group_name";
/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Guide](/guide/forms)
 *
 * @publicApi
 */
export declare class FormsModule {
    static ngModuleDef: i0.ɵɵNgModuleDefWithMeta<FormsModule, [typeof i1.NgModel, typeof i2.NgModelGroup, typeof i3.NgForm], never, [typeof i4.ɵInternalFormsSharedModule, typeof i1.NgModel, typeof i2.NgModelGroup, typeof i3.NgForm]>;
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
    static ngModuleDef: i0.ɵɵNgModuleDefWithMeta<ReactiveFormsModule, [typeof i5.FormControlDirective, typeof i6.FormGroupDirective, typeof i7.FormControlName, typeof i8.FormGroupName, typeof i8.FormArrayName], never, [typeof i4.ɵInternalFormsSharedModule, typeof i5.FormControlDirective, typeof i6.FormGroupDirective, typeof i7.FormControlName, typeof i8.FormGroupName, typeof i8.FormArrayName]>;
    static ngInjectorDef: i0.ɵɵInjectorDef<ReactiveFormsModule>;
}
