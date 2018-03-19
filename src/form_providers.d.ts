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
 * @stable
 */
export declare class FormsModule {
}
/**
 * The ng module for reactive forms.
 * @stable
 */
export declare class ReactiveFormsModule {
    static withConfig(opts: {
        /** @deprecated as of v6 */ warnOnNgModelWithFormControl: 'never' | 'once' | 'always';
    }): ModuleWithProviders;
}
