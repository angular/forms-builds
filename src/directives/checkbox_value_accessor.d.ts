import { BuiltInControlValueAccessor, ControlValueAccessor } from './control_value_accessor';
import * as i0 from "@angular/core";
export declare const CHECKBOX_VALUE_ACCESSOR: any;
/**
 * @description
 * A `ControlValueAccessor` for writing a value and listening to changes on a checkbox input
 * element.
 *
 * @usageNotes
 *
 * ### Using a checkbox with a reactive form.
 *
 * The following example shows how to use a checkbox with a reactive form.
 *
 * ```ts
 * const rememberLoginControl = new FormControl();
 * ```
 *
 * ```
 * <input type="checkbox" [formControl]="rememberLoginControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class CheckboxControlValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /**
     * Sets the "checked" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CheckboxControlValueAccessor, "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]", never, {}, {}, never>;
}
