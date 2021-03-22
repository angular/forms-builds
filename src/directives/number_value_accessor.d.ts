/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2 } from '@angular/core';
import { BuiltInControlValueAccessor, ControlValueAccessor } from './control_value_accessor';
import * as i0 from "@angular/core";
export declare const NUMBER_VALUE_ACCESSOR: any;
/**
 * @description
 * The `ControlValueAccessor` for writing a number value and listening to number input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a number input with a reactive form.
 *
 * The following example shows how to use a number input with a reactive form.
 *
 * ```ts
 * const totalCountControl = new FormControl();
 * ```
 *
 * ```
 * <input type="number" [formControl]="totalCountControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class NumberValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    /**
     * The registered callback function called when a change or input event occurs on the input
     * element.
     * @nodoc
     */
    onChange: (_: any) => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
    constructor(_renderer: Renderer2, _elementRef: ElementRef);
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: number): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: number | null) => void): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Sets the "disabled" property on the input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NumberValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NumberValueAccessor, "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]", never, {}, {}, never>;
}
