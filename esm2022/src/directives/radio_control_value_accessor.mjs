/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, forwardRef, inject, Injectable, Injector, Input, NgModule, Renderer2, ɵRuntimeError as RuntimeError } from '@angular/core';
import { BuiltInControlValueAccessor, NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import { CALL_SET_DISABLED_STATE, setDisabledStateDefault } from './shared';
import * as i0 from "@angular/core";
const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioControlValueAccessor),
    multi: true
};
function throwNameError() {
    throw new RuntimeError(1202 /* RuntimeErrorCode.NAME_AND_FORM_CONTROL_NAME_MUST_MATCH */, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}
/**
 * Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
 * provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
 * declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
 * `forwardRef` logic.
 */
export class RadioControlRegistryModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlRegistryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlRegistryModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlRegistryModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlRegistryModule, decorators: [{
            type: NgModule
        }] });
/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
export class RadioControlRegistry {
    constructor() {
        this._accessors = [];
    }
    /**
     * @description
     * Adds a control to the internal registry. For internal use only.
     */
    add(control, accessor) {
        this._accessors.push([control, accessor]);
    }
    /**
     * @description
     * Removes a control from the internal registry. For internal use only.
     */
    remove(accessor) {
        for (let i = this._accessors.length - 1; i >= 0; --i) {
            if (this._accessors[i][1] === accessor) {
                this._accessors.splice(i, 1);
                return;
            }
        }
    }
    /**
     * @description
     * Selects a radio button. For internal use only.
     */
    select(accessor) {
        this._accessors.forEach((c) => {
            if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
                c[1].fireUncheck(accessor.value);
            }
        });
    }
    _isSameGroup(controlPair, accessor) {
        if (!controlPair[0].control)
            return false;
        return controlPair[0]._parent === accessor._control._parent &&
            controlPair[1].name === accessor.name;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlRegistry, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlRegistry, providedIn: RadioControlRegistryModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlRegistry, decorators: [{
            type: Injectable,
            args: [{ providedIn: RadioControlRegistryModule }]
        }] });
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
export class RadioControlValueAccessor extends BuiltInControlValueAccessor {
    constructor(renderer, elementRef, _registry, _injector) {
        super(renderer, elementRef);
        this._registry = _registry;
        this._injector = _injector;
        this.setDisabledStateFired = false;
        /**
         * The registered callback function called when a change event occurs on the input element.
         * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
         * to override the `onChange` function (which expects 1 argument) in the parent
         * `BaseControlValueAccessor` class.
         * @nodoc
         */
        this.onChange = () => { };
        this.callSetDisabledState = inject(CALL_SET_DISABLED_STATE, { optional: true }) ?? setDisabledStateDefault;
    }
    /** @nodoc */
    ngOnInit() {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
    }
    /** @nodoc */
    ngOnDestroy() {
        this._registry.remove(this);
    }
    /**
     * Sets the "checked" property value on the radio input element.
     * @nodoc
     */
    writeValue(value) {
        this._state = value === this.value;
        this.setProperty('checked', this._state);
    }
    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    registerOnChange(fn) {
        this._fn = fn;
        this.onChange = () => {
            fn(this.value);
            this._registry.select(this);
        };
    }
    /** @nodoc */
    setDisabledState(isDisabled) {
        /**
         * `setDisabledState` is supposed to be called whenever the disabled state of a control changes,
         * including upon control creation. However, a longstanding bug caused the method to not fire
         * when an *enabled* control was attached. This bug was fixed in v15 in #47576.
         *
         * This had a side effect: previously, it was possible to instantiate a reactive form control
         * with `[attr.disabled]=true`, even though the corresponding control was enabled in the
         * model. This resulted in a mismatch between the model and the DOM. Now, because
         * `setDisabledState` is always called, the value in the DOM will be immediately overwritten
         * with the "correct" enabled value.
         *
         * However, the fix also created an exceptional case: radio buttons. Because Reactive Forms
         * models the entire group of radio buttons as a single `FormControl`, there is no way to
         * control the disabled state for individual radios, so they can no longer be configured as
         * disabled. Thus, we keep the old behavior for radio buttons, so that `[attr.disabled]`
         * continues to work. Specifically, we drop the first call to `setDisabledState` if `disabled`
         * is `false`, and we are not in legacy mode.
         */
        if (this.setDisabledStateFired || isDisabled ||
            this.callSetDisabledState === 'whenDisabledForLegacyCode') {
            this.setProperty('disabled', isDisabled);
        }
        this.setDisabledStateFired = true;
    }
    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    fireUncheck(value) {
        this.writeValue(value);
    }
    _checkName() {
        if (this.name && this.formControlName && this.name !== this.formControlName &&
            (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throwNameError();
        }
        if (!this.name && this.formControlName)
            this.name = this.formControlName;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: RadioControlRegistry }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.2.0-next.0+sha-a2a0b33", type: RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: { name: "name", formControlName: "formControlName", value: "value" }, host: { listeners: { "change": "onChange()", "blur": "onTouched()" } }, providers: [RADIO_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0-next.0+sha-a2a0b33", ngImport: i0, type: RadioControlValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                    host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                    providers: [RADIO_VALUE_ACCESSOR]
                }]
        }], ctorParameters: () => [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: RadioControlRegistry }, { type: i0.Injector }], propDecorators: { name: [{
                type: Input
            }], formControlName: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQStCLFNBQVMsRUFBRSxhQUFhLElBQUksWUFBWSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBSXRMLE9BQU8sRUFBQywyQkFBMkIsRUFBd0IsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM5RyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3ZDLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSx1QkFBdUIsRUFBeUIsTUFBTSxVQUFVLENBQUM7O0FBRWxHLE1BQU0sb0JBQW9CLEdBQWE7SUFDckMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDO0lBQ3hELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGLFNBQVMsY0FBYztJQUNyQixNQUFNLElBQUksWUFBWSxvRUFBeUQ7OztLQUc1RSxDQUFDLENBQUM7QUFDUCxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFFSCxNQUFNLE9BQU8sMEJBQTBCO3lIQUExQiwwQkFBMEI7MEhBQTFCLDBCQUEwQjswSEFBMUIsMEJBQTBCOztzR0FBMUIsMEJBQTBCO2tCQUR0QyxRQUFROztBQUlUOzs7R0FHRztBQUVILE1BQU0sT0FBTyxvQkFBb0I7SUFEakM7UUFFVSxlQUFVLEdBQVUsRUFBRSxDQUFDO0tBMENoQztJQXhDQzs7O09BR0c7SUFDSCxHQUFHLENBQUMsT0FBa0IsRUFBRSxRQUFtQztRQUN6RCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxNQUFNLENBQUMsUUFBbUM7UUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3JELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixPQUFPO1lBQ1QsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsTUFBTSxDQUFDLFFBQW1DO1FBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFLENBQUM7Z0JBQ3hELENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxZQUFZLENBQ2hCLFdBQW1ELEVBQ25ELFFBQW1DO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUFFLE9BQU8sS0FBSyxDQUFDO1FBQzFDLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU87WUFDdkQsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQzVDLENBQUM7eUhBMUNVLG9CQUFvQjs2SEFBcEIsb0JBQW9CLGNBRFIsMEJBQTBCOztzR0FDdEMsb0JBQW9CO2tCQURoQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLDBCQUEwQixFQUFDOztBQThDcEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFPSCxNQUFNLE9BQU8seUJBQTBCLFNBQVEsMkJBQTJCO0lBK0N4RSxZQUNJLFFBQW1CLEVBQUUsVUFBc0IsRUFBVSxTQUErQixFQUM1RSxTQUFtQjtRQUM3QixLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRjJCLGNBQVMsR0FBVCxTQUFTLENBQXNCO1FBQzVFLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFyQ3ZCLDBCQUFxQixHQUFHLEtBQUssQ0FBQztRQUV0Qzs7Ozs7O1dBTUc7UUFDTSxhQUFRLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBdUJyQix5QkFBb0IsR0FDeEIsTUFBTSxDQUFDLHVCQUF1QixFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLElBQUksdUJBQXVCLENBQUM7SUFNakYsQ0FBQztJQUVELGFBQWE7SUFDYixRQUFRO1FBQ04sSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsYUFBYTtJQUNiLFdBQVc7UUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsVUFBVSxDQUFDLEtBQVU7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNNLGdCQUFnQixDQUFDLEVBQWtCO1FBQzFDLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEVBQUU7WUFDbkIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxhQUFhO0lBQ0osZ0JBQWdCLENBQUMsVUFBbUI7UUFDM0M7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBaUJHO1FBQ0gsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksVUFBVTtZQUN4QyxJQUFJLENBQUMsb0JBQW9CLEtBQUssMkJBQTJCLEVBQUUsQ0FBQztZQUM5RCxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQ0QsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztJQUNwQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxLQUFVO1FBQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVPLFVBQVU7UUFDaEIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsZUFBZTtZQUN2RSxDQUFDLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDO1lBQ3BELGNBQWMsRUFBRSxDQUFDO1FBQ25CLENBQUM7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZTtZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUMzRSxDQUFDO3lIQWhJVSx5QkFBeUI7NkdBQXpCLHlCQUF5Qiw2UUFGekIsQ0FBQyxvQkFBb0IsQ0FBQzs7c0dBRXRCLHlCQUF5QjtrQkFOckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQ0osOEZBQThGO29CQUNsRyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUM7b0JBQ3pELFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNsQzs4SkE2QlUsSUFBSTtzQkFBWixLQUFLO2dCQVFHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBTUcsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBpbmplY3QsIEluamVjdGFibGUsIEluamVjdG9yLCBJbnB1dCwgTmdNb2R1bGUsIE9uRGVzdHJveSwgT25Jbml0LCBQcm92aWRlciwgUmVuZGVyZXIyLCDJtVJ1bnRpbWVFcnJvciBhcyBSdW50aW1lRXJyb3J9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1J1bnRpbWVFcnJvckNvZGV9IGZyb20gJy4uL2Vycm9ycyc7XG5cbmltcG9ydCB7QnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcbmltcG9ydCB7Q0FMTF9TRVRfRElTQUJMRURfU1RBVEUsIHNldERpc2FibGVkU3RhdGVEZWZhdWx0LCBTZXREaXNhYmxlZFN0YXRlT3B0aW9ufSBmcm9tICcuL3NoYXJlZCc7XG5cbmNvbnN0IFJBRElPX1ZBTFVFX0FDQ0VTU09SOiBQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuZnVuY3Rpb24gdGhyb3dOYW1lRXJyb3IoKSB7XG4gIHRocm93IG5ldyBSdW50aW1lRXJyb3IoUnVudGltZUVycm9yQ29kZS5OQU1FX0FORF9GT1JNX0NPTlRST0xfTkFNRV9NVVNUX01BVENILCBgXG4gICAgICBJZiB5b3UgZGVmaW5lIGJvdGggYSBuYW1lIGFuZCBhIGZvcm1Db250cm9sTmFtZSBhdHRyaWJ1dGUgb24geW91ciByYWRpbyBidXR0b24sIHRoZWlyIHZhbHVlc1xuICAgICAgbXVzdCBtYXRjaC4gRXg6IDxpbnB1dCB0eXBlPVwicmFkaW9cIiBmb3JtQ29udHJvbE5hbWU9XCJmb29kXCIgbmFtZT1cImZvb2RcIj5cbiAgICBgKTtcbn1cblxuLyoqXG4gKiBJbnRlcm5hbC1vbmx5IE5nTW9kdWxlIHRoYXQgd29ya3MgYXMgYSBob3N0IGZvciB0aGUgYFJhZGlvQ29udHJvbFJlZ2lzdHJ5YCB0cmVlLXNoYWthYmxlXG4gKiBwcm92aWRlci4gTm90ZTogdGhlIGBJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlYCBjYW4gbm90IGJlIHVzZWQgaGVyZSBkaXJlY3RseSwgc2luY2UgaXQnc1xuICogZGVjbGFyZWQgKmFmdGVyKiB0aGUgYFJhZGlvQ29udHJvbFJlZ2lzdHJ5YCBjbGFzcyBhbmQgdGhlIGBwcm92aWRlZEluYCBkb2Vzbid0IHN1cHBvcnRcbiAqIGBmb3J3YXJkUmVmYCBsb2dpYy5cbiAqL1xuQE5nTW9kdWxlKClcbmV4cG9ydCBjbGFzcyBSYWRpb0NvbnRyb2xSZWdpc3RyeU1vZHVsZSB7XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDbGFzcyB1c2VkIGJ5IEFuZ3VsYXIgdG8gdHJhY2sgcmFkaW8gYnV0dG9ucy4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogUmFkaW9Db250cm9sUmVnaXN0cnlNb2R1bGV9KVxuZXhwb3J0IGNsYXNzIFJhZGlvQ29udHJvbFJlZ2lzdHJ5IHtcbiAgcHJpdmF0ZSBfYWNjZXNzb3JzOiBhbnlbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWRkcyBhIGNvbnRyb2wgdG8gdGhlIGludGVybmFsIHJlZ2lzdHJ5LiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICBhZGQoY29udHJvbDogTmdDb250cm9sLCBhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIHRoaXMuX2FjY2Vzc29ycy5wdXNoKFtjb250cm9sLCBhY2Nlc3Nvcl0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZW1vdmVzIGEgY29udHJvbCBmcm9tIHRoZSBpbnRlcm5hbCByZWdpc3RyeS4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKi9cbiAgcmVtb3ZlKGFjY2Vzc29yOiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuX2FjY2Vzc29ycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgaWYgKHRoaXMuX2FjY2Vzc29yc1tpXVsxXSA9PT0gYWNjZXNzb3IpIHtcbiAgICAgICAgdGhpcy5fYWNjZXNzb3JzLnNwbGljZShpLCAxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2VsZWN0cyBhIHJhZGlvIGJ1dHRvbi4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKi9cbiAgc2VsZWN0KGFjY2Vzc29yOiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSB7XG4gICAgdGhpcy5fYWNjZXNzb3JzLmZvckVhY2goKGMpID0+IHtcbiAgICAgIGlmICh0aGlzLl9pc1NhbWVHcm91cChjLCBhY2Nlc3NvcikgJiYgY1sxXSAhPT0gYWNjZXNzb3IpIHtcbiAgICAgICAgY1sxXS5maXJlVW5jaGVjayhhY2Nlc3Nvci52YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9pc1NhbWVHcm91cChcbiAgICAgIGNvbnRyb2xQYWlyOiBbTmdDb250cm9sLCBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yXSxcbiAgICAgIGFjY2Vzc29yOiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yKTogYm9vbGVhbiB7XG4gICAgaWYgKCFjb250cm9sUGFpclswXS5jb250cm9sKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIGNvbnRyb2xQYWlyWzBdLl9wYXJlbnQgPT09IGFjY2Vzc29yLl9jb250cm9sLl9wYXJlbnQgJiZcbiAgICAgICAgY29udHJvbFBhaXJbMV0ubmFtZSA9PT0gYWNjZXNzb3IubmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgcmFkaW8gY29udHJvbCB2YWx1ZXMgYW5kIGxpc3RlbmluZyB0byByYWRpbyBjb250cm9sXG4gKiBjaGFuZ2VzLiBUaGUgdmFsdWUgYWNjZXNzb3IgaXMgdXNlZCBieSB0aGUgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYEZvcm1Db250cm9sTmFtZWAsIGFuZFxuICogYE5nTW9kZWxgIGRpcmVjdGl2ZXMuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgVXNpbmcgcmFkaW8gYnV0dG9ucyB3aXRoIHJlYWN0aXZlIGZvcm0gZGlyZWN0aXZlc1xuICpcbiAqIFRoZSBmb2xsb3cgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIHJhZGlvIGJ1dHRvbnMgaW4gYSByZWFjdGl2ZSBmb3JtLiBXaGVuIHVzaW5nIHJhZGlvIGJ1dHRvbnMgaW5cbiAqIGEgcmVhY3RpdmUgZm9ybSwgcmFkaW8gYnV0dG9ucyBpbiB0aGUgc2FtZSBncm91cCBzaG91bGQgaGF2ZSB0aGUgc2FtZSBgZm9ybUNvbnRyb2xOYW1lYC5cbiAqIFByb3ZpZGluZyBhIGBuYW1lYCBhdHRyaWJ1dGUgaXMgb3B0aW9uYWwuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3JlYWN0aXZlUmFkaW9CdXR0b25zL3JlYWN0aXZlX3JhZGlvX2J1dHRvbl9leGFtcGxlLnRzIHJlZ2lvbj0nUmVhY3RpdmUnfVxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ2lucHV0W3R5cGU9cmFkaW9dW2Zvcm1Db250cm9sTmFtZV0saW5wdXRbdHlwZT1yYWRpb11bZm9ybUNvbnRyb2xdLGlucHV0W3R5cGU9cmFkaW9dW25nTW9kZWxdJyxcbiAgaG9zdDogeycoY2hhbmdlKSc6ICdvbkNoYW5nZSgpJywgJyhibHVyKSc6ICdvblRvdWNoZWQoKSd9LFxuICBwcm92aWRlcnM6IFtSQURJT19WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvciBleHRlbmRzIEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRzXG4gICAgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX3N0YXRlITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX2NvbnRyb2whOiBOZ0NvbnRyb2w7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9mbiE6IEZ1bmN0aW9uO1xuXG4gIHByaXZhdGUgc2V0RGlzYWJsZWRTdGF0ZUZpcmVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgY2hhbmdlIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICogTm90ZTogd2UgZGVjbGFyZSBgb25DaGFuZ2VgIGhlcmUgKGFsc28gdXNlZCBhcyBob3N0IGxpc3RlbmVyKSBhcyBhIGZ1bmN0aW9uIHdpdGggbm8gYXJndW1lbnRzXG4gICAqIHRvIG92ZXJyaWRlIHRoZSBgb25DaGFuZ2VgIGZ1bmN0aW9uICh3aGljaCBleHBlY3RzIDEgYXJndW1lbnQpIGluIHRoZSBwYXJlbnRcbiAgICogYEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvcmAgY2xhc3MuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgb3ZlcnJpZGUgb25DaGFuZ2UgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgbmFtZSBvZiB0aGUgcmFkaW8gaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBuYW1lITogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgRm9ybUNvbnRyb2xgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgZm9ybUNvbnRyb2xOYW1lITogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSB2YWx1ZSBvZiB0aGUgcmFkaW8gaW5wdXQgZWxlbWVudFxuICAgKi9cbiAgQElucHV0KCkgdmFsdWU6IGFueTtcblxuICBwcml2YXRlIGNhbGxTZXREaXNhYmxlZFN0YXRlID1cbiAgICAgIGluamVjdChDQUxMX1NFVF9ESVNBQkxFRF9TVEFURSwge29wdGlvbmFsOiB0cnVlfSkgPz8gc2V0RGlzYWJsZWRTdGF0ZURlZmF1bHQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICByZW5kZXJlcjogUmVuZGVyZXIyLCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBwcml2YXRlIF9yZWdpc3RyeTogUmFkaW9Db250cm9sUmVnaXN0cnksXG4gICAgICBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IpIHtcbiAgICBzdXBlcihyZW5kZXJlciwgZWxlbWVudFJlZik7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQoTmdDb250cm9sKTtcbiAgICB0aGlzLl9jaGVja05hbWUoKTtcbiAgICB0aGlzLl9yZWdpc3RyeS5hZGQodGhpcy5fY29udHJvbCwgdGhpcyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX3JlZ2lzdHJ5LnJlbW92ZSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImNoZWNrZWRcIiBwcm9wZXJ0eSB2YWx1ZSBvbiB0aGUgcmFkaW8gaW5wdXQgZWxlbWVudC5cbiAgICogQG5vZG9jXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGF0ZSA9IHZhbHVlID09PSB0aGlzLnZhbHVlO1xuICAgIHRoaXMuc2V0UHJvcGVydHkoJ2NoZWNrZWQnLCB0aGlzLl9zdGF0ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICogQG5vZG9jXG4gICAqL1xuICBvdmVycmlkZSByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMuX2ZuID0gZm47XG4gICAgdGhpcy5vbkNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGZuKHRoaXMudmFsdWUpO1xuICAgICAgdGhpcy5fcmVnaXN0cnkuc2VsZWN0KHRoaXMpO1xuICAgIH07XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG92ZXJyaWRlIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIC8qKlxuICAgICAqIGBzZXREaXNhYmxlZFN0YXRlYCBpcyBzdXBwb3NlZCB0byBiZSBjYWxsZWQgd2hlbmV2ZXIgdGhlIGRpc2FibGVkIHN0YXRlIG9mIGEgY29udHJvbCBjaGFuZ2VzLFxuICAgICAqIGluY2x1ZGluZyB1cG9uIGNvbnRyb2wgY3JlYXRpb24uIEhvd2V2ZXIsIGEgbG9uZ3N0YW5kaW5nIGJ1ZyBjYXVzZWQgdGhlIG1ldGhvZCB0byBub3QgZmlyZVxuICAgICAqIHdoZW4gYW4gKmVuYWJsZWQqIGNvbnRyb2wgd2FzIGF0dGFjaGVkLiBUaGlzIGJ1ZyB3YXMgZml4ZWQgaW4gdjE1IGluICM0NzU3Ni5cbiAgICAgKlxuICAgICAqIFRoaXMgaGFkIGEgc2lkZSBlZmZlY3Q6IHByZXZpb3VzbHksIGl0IHdhcyBwb3NzaWJsZSB0byBpbnN0YW50aWF0ZSBhIHJlYWN0aXZlIGZvcm0gY29udHJvbFxuICAgICAqIHdpdGggYFthdHRyLmRpc2FibGVkXT10cnVlYCwgZXZlbiB0aG91Z2ggdGhlIGNvcnJlc3BvbmRpbmcgY29udHJvbCB3YXMgZW5hYmxlZCBpbiB0aGVcbiAgICAgKiBtb2RlbC4gVGhpcyByZXN1bHRlZCBpbiBhIG1pc21hdGNoIGJldHdlZW4gdGhlIG1vZGVsIGFuZCB0aGUgRE9NLiBOb3csIGJlY2F1c2VcbiAgICAgKiBgc2V0RGlzYWJsZWRTdGF0ZWAgaXMgYWx3YXlzIGNhbGxlZCwgdGhlIHZhbHVlIGluIHRoZSBET00gd2lsbCBiZSBpbW1lZGlhdGVseSBvdmVyd3JpdHRlblxuICAgICAqIHdpdGggdGhlIFwiY29ycmVjdFwiIGVuYWJsZWQgdmFsdWUuXG4gICAgICpcbiAgICAgKiBIb3dldmVyLCB0aGUgZml4IGFsc28gY3JlYXRlZCBhbiBleGNlcHRpb25hbCBjYXNlOiByYWRpbyBidXR0b25zLiBCZWNhdXNlIFJlYWN0aXZlIEZvcm1zXG4gICAgICogbW9kZWxzIHRoZSBlbnRpcmUgZ3JvdXAgb2YgcmFkaW8gYnV0dG9ucyBhcyBhIHNpbmdsZSBgRm9ybUNvbnRyb2xgLCB0aGVyZSBpcyBubyB3YXkgdG9cbiAgICAgKiBjb250cm9sIHRoZSBkaXNhYmxlZCBzdGF0ZSBmb3IgaW5kaXZpZHVhbCByYWRpb3MsIHNvIHRoZXkgY2FuIG5vIGxvbmdlciBiZSBjb25maWd1cmVkIGFzXG4gICAgICogZGlzYWJsZWQuIFRodXMsIHdlIGtlZXAgdGhlIG9sZCBiZWhhdmlvciBmb3IgcmFkaW8gYnV0dG9ucywgc28gdGhhdCBgW2F0dHIuZGlzYWJsZWRdYFxuICAgICAqIGNvbnRpbnVlcyB0byB3b3JrLiBTcGVjaWZpY2FsbHksIHdlIGRyb3AgdGhlIGZpcnN0IGNhbGwgdG8gYHNldERpc2FibGVkU3RhdGVgIGlmIGBkaXNhYmxlZGBcbiAgICAgKiBpcyBgZmFsc2VgLCBhbmQgd2UgYXJlIG5vdCBpbiBsZWdhY3kgbW9kZS5cbiAgICAgKi9cbiAgICBpZiAodGhpcy5zZXREaXNhYmxlZFN0YXRlRmlyZWQgfHwgaXNEaXNhYmxlZCB8fFxuICAgICAgICB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlID09PSAnd2hlbkRpc2FibGVkRm9yTGVnYWN5Q29kZScpIHtcbiAgICAgIHRoaXMuc2V0UHJvcGVydHkoJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gICAgfVxuICAgIHRoaXMuc2V0RGlzYWJsZWRTdGF0ZUZpcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcInZhbHVlXCIgb24gdGhlIHJhZGlvIGlucHV0IGVsZW1lbnQgYW5kIHVuY2hlY2tzIGl0LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWVcbiAgICovXG4gIGZpcmVVbmNoZWNrKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLndyaXRlVmFsdWUodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tOYW1lKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm5hbWUgJiYgdGhpcy5mb3JtQ29udHJvbE5hbWUgJiYgdGhpcy5uYW1lICE9PSB0aGlzLmZvcm1Db250cm9sTmFtZSAmJlxuICAgICAgICAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3dOYW1lRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm5hbWUgJiYgdGhpcy5mb3JtQ29udHJvbE5hbWUpIHRoaXMubmFtZSA9IHRoaXMuZm9ybUNvbnRyb2xOYW1lO1xuICB9XG59XG4iXX0=