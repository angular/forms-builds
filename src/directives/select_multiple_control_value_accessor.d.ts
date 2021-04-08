/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnDestroy, Renderer2, StaticProvider } from '@angular/core';
import { BuiltInControlValueAccessor, ControlValueAccessor } from './control_value_accessor';
import * as i0 from "@angular/core";
export declare const SELECT_MULTIPLE_VALUE_ACCESSOR: StaticProvider;
/**
 * @description
 * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
 * control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @see `SelectControlValueAccessor`
 *
 * @usageNotes
 *
 * ### Using a multi-select control
 *
 * The follow example shows you how to use a multi-select control with a reactive form.
 *
 * ```ts
 * const countryControl = new FormControl();
 * ```
 *
 * ```
 * <select multiple name="countries" [formControl]="countryControl">
 *   <option *ngFor="let country of countries" [ngValue]="country">
 *     {{ country.name }}
 *   </option>
 * </select>
 * ```
 *
 * ### Customizing option selection
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * See the `SelectControlValueAccessor` for usage.
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor {
    /**
     * The current value.
     * @nodoc
     */
    value: any;
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn: (o1: any, o2: any) => boolean);
    private _compareWith;
    /**
     * Sets the "value" property on one or of more of the select's options.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes
     * and writes an array of the selected options.
     * @nodoc
     */
    registerOnChange(fn: (value: any) => any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectMultipleControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SelectMultipleControlValueAccessor, "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]", never, { "compareWith": "compareWith"; }, {}, never>;
}
/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see `SelectMultipleControlValueAccessor`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class ɵNgSelectMultipleOption implements OnDestroy {
    private _element;
    private _renderer;
    private _select;
    id: string;
    constructor(_element: ElementRef, _renderer: Renderer2, _select: SelectMultipleControlValueAccessor);
    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    set ngValue(value: any);
    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    set value(value: any);
    /** @nodoc */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ɵNgSelectMultipleOption, [null, null, { optional: true; host: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ɵNgSelectMultipleOption, "option", never, { "ngValue": "ngValue"; "value": "value"; }, {}, never>;
}
export { ɵNgSelectMultipleOption as NgSelectMultipleOption };
