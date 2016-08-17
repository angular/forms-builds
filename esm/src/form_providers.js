/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES } from './directives';
import { RadioControlRegistry } from './directives/radio_control_value_accessor';
import { FormBuilder } from './form_builder';
/**
 * Shorthand set of providers used for building Angular forms.
 * @stable
 */
export const FORM_PROVIDERS = [RadioControlRegistry];
/**
 * Shorthand set of providers used for building reactive Angular forms.
 * @stable
 */
export const REACTIVE_FORM_PROVIDERS = [FormBuilder, RadioControlRegistry];
export class FormsModule {
}
/** @nocollapse */
FormsModule.decorators = [
    { type: NgModule, args: [{
                declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                providers: [FORM_PROVIDERS],
                exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
            },] },
];
export class ReactiveFormsModule {
}
/** @nocollapse */
ReactiveFormsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                providers: [REACTIVE_FORM_PROVIDERS],
                exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
            },] },
];
//# sourceMappingURL=form_providers.js.map