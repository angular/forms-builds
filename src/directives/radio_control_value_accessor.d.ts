/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Injector, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BuiltInControlValueAccessor, ControlValueAccessor } from './control_value_accessor';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
export declare const RADIO_VALUE_ACCESSOR: any;
/**
 * Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
 * provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
 * declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
 * `forwardRef` logic.
 */
export declare class RadioControlRegistryModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioControlRegistryModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<RadioControlRegistryModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<RadioControlRegistryModule>;
}
/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
export declare class RadioControlRegistry {
    private _accessors;
    /**
     * @description
     * Adds a control to the internal registry. For internal use only.
     */
    add(control: NgControl, accessor: RadioControlValueAccessor): void;
    /**
     * @description
     * Removes a control from the internal registry. For internal use only.
     */
    remove(accessor: RadioControlValueAccessor): void;
    /**
     * @description
     * Selects a radio button. For internal use only.
     */
    select(accessor: RadioControlValueAccessor): void;
    private _isSameGroup;
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioControlRegistry, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RadioControlRegistry>;
}
/**
 * @description
 * The `ControlValueAccessor` for writing radio control values and listening to radio control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using radio buttons with reactive form directives
 *
 * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
 * a reactive form, radio buttons in the same group should have the same `formControlName`.
 * Providing a `name` attribute is optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class RadioControlValueAccessor extends BuiltInControlValueAccessor implements ControlValueAccessor, OnDestroy, OnInit {
    private _renderer;
    private _elementRef;
    private _registry;
    private _injector;
    /**
     * The registered callback function called when a change event occurs on the input element.
     * @nodoc
     */
    onChange: () => void;
    /**
     * The registered callback function called when a blur event occurs on the input element.
     * @nodoc
     */
    onTouched: () => void;
    /**
     * @description
     * Tracks the name of the radio input element.
     */
    name: string;
    /**
     * @description
     * Tracks the name of the `FormControl` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     */
    formControlName: string;
    /**
     * @description
     * Tracks the value of the radio input element
     */
    value: any;
    constructor(_renderer: Renderer2, _elementRef: ElementRef, _registry: RadioControlRegistry, _injector: Injector);
    /** @nodoc */
    ngOnInit(): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * Sets the "checked" property value on the radio input element.
     * @nodoc
     */
    writeValue(value: any): void;
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn: (_: any) => {}): void;
    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    fireUncheck(value: any): void;
    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    registerOnTouched(fn: () => {}): void;
    /**
     * Sets the "disabled" property on the input element.
     * @nodoc
     */
    setDisabledState(isDisabled: boolean): void;
    private _checkName;
    static ɵfac: i0.ɵɵFactoryDeclaration<RadioControlValueAccessor, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RadioControlValueAccessor, "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", never, { "name": "name"; "formControlName": "formControlName"; "value": "value"; }, {}, never>;
}
