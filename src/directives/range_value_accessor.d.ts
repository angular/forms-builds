/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { StaticProvider } from '@angular/core';
import { BuiltInControlValueAccessor, ControlValueAccessor } from './control_value_accessor';
import * as i0 from "@angular/core";
export declare const RANGE_VALUE_ACCESSOR: StaticProvider;
/**
 * @description
 * The `ControlValueAccessor` for writing a range value and listening to range input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a range input with a reactive form
 *
 * The following example shows how to use a range input with a reactive form.
 *
 * ```ts
 * const ageControl = new FormControl();
 * ```
 *
 * ```
 * <input type="range" [formControl]="ageControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class RangeValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: number | null) => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RangeValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RangeValueAccessor, "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]", never, {}, {}, never>;
}
