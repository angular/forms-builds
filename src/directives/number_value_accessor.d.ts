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
    static ɵfac: i0.ɵɵFactoryDeclaration<NumberValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<NumberValueAccessor, "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]", never, {}, {}, never>;
}
