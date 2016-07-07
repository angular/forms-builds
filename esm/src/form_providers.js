/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AppModule } from '@angular/core';
import { FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES } from './directives';
import { RadioControlRegistry } from './directives/radio_control_value_accessor';
import { FormBuilder } from './form_builder';
/**
 * Shorthand set of providers used for building Angular forms.
 * @experimental
 */
export const FORM_PROVIDERS = [RadioControlRegistry];
/**
 * Shorthand set of providers used for building reactive Angular forms.
 * @experimental
 */
export const REACTIVE_FORM_PROVIDERS = 
/*@ts2dart_const*/ [FormBuilder, RadioControlRegistry];
export class FormsModule {
}
/** @nocollapse */
FormsModule.decorators = [
    { type: AppModule, args: [{ providers: [FORM_PROVIDERS], directives: FORM_DIRECTIVES, pipes: [] },] },
];
export class ReactiveFormsModule {
}
/** @nocollapse */
ReactiveFormsModule.decorators = [
    { type: AppModule, args: [{ providers: [REACTIVE_FORM_PROVIDERS], directives: REACTIVE_FORM_DIRECTIVES, pipes: [] },] },
];
//# sourceMappingURL=form_providers.js.map