import { ElementRef, InjectionToken, Renderer2 } from '@angular/core';
import { ControlValueAccessor } from './control_value_accessor';
import * as i0 from "@angular/core";
export declare const DEFAULT_VALUE_ACCESSOR: any;
/**
 * @description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * @publicApi
 */
export declare const COMPOSITION_BUFFER_MODE: InjectionToken<boolean>;
/**
 * @description
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using the default value accessor
 *
 * The following example shows how to use an input element that activates the default value accessor
 * (in this case, a text field).
 *
 * ```ts
 * const firstNameControl = new FormControl();
 * ```
 *
 * ```
 * <input type="text" [formControl]="firstNameControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class DefaultValueAccessor implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    private _compositionMode;
    /**
     * The registered callback function called when an input event occurs on the input element.
     * @nodoc
     */
    onChange: (_: any) => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
    /** Whether the user is creating a composition string (IME events). */
    private _composing;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _compositionMode: boolean);
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: any) => void): void;
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
    static ɵfac: i0.ɵɵFactoryDef<DefaultValueAccessor, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<DefaultValueAccessor, "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]", never, {}, {}, never>;
}
