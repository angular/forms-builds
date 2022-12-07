/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, forwardRef, Injectable, Injector, Input, NgModule, Renderer2, ɵRuntimeError as RuntimeError } from '@angular/core';
import { BuiltInControlValueAccessor, NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
export const RADIO_VALUE_ACCESSOR = {
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
}
RadioControlRegistryModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlRegistryModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
RadioControlRegistryModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlRegistryModule });
RadioControlRegistryModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlRegistryModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlRegistryModule, decorators: [{
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
}
RadioControlRegistry.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlRegistry, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RadioControlRegistry.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlRegistry, providedIn: RadioControlRegistryModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlRegistry, decorators: [{
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
        /**
         * The registered callback function called when a change event occurs on the input element.
         * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
         * to override the `onChange` function (which expects 1 argument) in the parent
         * `BaseControlValueAccessor` class.
         * @nodoc
         */
        this.onChange = () => { };
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
}
RadioControlValueAccessor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: RadioControlRegistry }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Directive });
RadioControlValueAccessor.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.3+sha-b55d2da", type: RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: { name: "name", formControlName: "formControlName", value: "value" }, host: { listeners: { "change": "onChange()", "blur": "onTouched()" } }, providers: [RADIO_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.3+sha-b55d2da", ngImport: i0, type: RadioControlValueAccessor, decorators: [{
            type: Directive,
            args: [{
                    selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                    host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                    providers: [RADIO_VALUE_ACCESSOR]
                }]
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: RadioControlRegistry }, { type: i0.Injector }]; }, propDecorators: { name: [{
                type: Input
            }], formControlName: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBcUIsU0FBUyxFQUFFLGFBQWEsSUFBSSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJcEssT0FBTyxFQUFDLDJCQUEyQixFQUF3QixpQkFBaUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzlHLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7O0FBRXZDLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFRO0lBQ3ZDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztJQUN4RCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRixTQUFTLGNBQWM7SUFDckIsTUFBTSxJQUFJLFlBQVksb0VBQXlEOzs7S0FHNUUsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUVEOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLDBCQUEwQjs7a0lBQTFCLDBCQUEwQjttSUFBMUIsMEJBQTBCO21JQUExQiwwQkFBMEI7c0dBQTFCLDBCQUEwQjtrQkFEdEMsUUFBUTs7QUFJVDs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sb0JBQW9CO0lBRGpDO1FBRVUsZUFBVSxHQUFVLEVBQUUsQ0FBQztLQTBDaEM7SUF4Q0M7OztPQUdHO0lBQ0gsR0FBRyxDQUFDLE9BQWtCLEVBQUUsUUFBbUM7UUFDekQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJ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QUcsRUFBRTtZQUNuQixFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxXQUFXLENBQUMsS0FBVTtRQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFTyxVQUFVO1FBQ2hCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLGVBQWU7WUFDdkUsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLEVBQUU7WUFDbkQsY0FBYyxFQUFFLENBQUM7U0FDbEI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZTtZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUMzRSxDQUFDOztpSUFoR1UseUJBQXlCO3FIQUF6Qix5QkFBeUIsNlFBRnpCLENBQUMsb0JBQW9CLENBQUM7c0dBRXRCLHlCQUF5QjtrQkFOckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQ0osOEZBQThGO29CQUNsRyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUM7b0JBQ3pELFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2lCQUNsQztnTEEyQlUsSUFBSTtzQkFBWixLQUFLO2dCQVFHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBTUcsS0FBSztzQkFBYixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3RhYmxlLCBJbmplY3RvciwgSW5wdXQsIE5nTW9kdWxlLCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyLCDJtVJ1bnRpbWVFcnJvciBhcyBSdW50aW1lRXJyb3J9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1J1bnRpbWVFcnJvckNvZGV9IGZyb20gJy4uL2Vycm9ycyc7XG5cbmltcG9ydCB7QnVpbHRJbkNvbnRyb2xWYWx1ZUFjY2Vzc29yLCBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcblxuZXhwb3J0IGNvbnN0IFJBRElPX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbmZ1bmN0aW9uIHRocm93TmFtZUVycm9yKCkge1xuICB0aHJvdyBuZXcgUnVudGltZUVycm9yKFJ1bnRpbWVFcnJvckNvZGUuTkFNRV9BTkRfRk9STV9DT05UUk9MX05BTUVfTVVTVF9NQVRDSCwgYFxuICAgICAgSWYgeW91IGRlZmluZSBib3RoIGEgbmFtZSBhbmQgYSBmb3JtQ29udHJvbE5hbWUgYXR0cmlidXRlIG9uIHlvdXIgcmFkaW8gYnV0dG9uLCB0aGVpciB2YWx1ZXNcbiAgICAgIG11c3QgbWF0Y2guIEV4OiA8aW5wdXQgdHlwZT1cInJhZGlvXCIgZm9ybUNvbnRyb2xOYW1lPVwiZm9vZFwiIG5hbWU9XCJmb29kXCI+XG4gICAgYCk7XG59XG5cbi8qKlxuICogSW50ZXJuYWwtb25seSBOZ01vZHVsZSB0aGF0IHdvcmtzIGFzIGEgaG9zdCBmb3IgdGhlIGBSYWRpb0NvbnRyb2xSZWdpc3RyeWAgdHJlZS1zaGFrYWJsZVxuICogcHJvdmlkZXIuIE5vdGU6IHRoZSBgSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZWAgY2FuIG5vdCBiZSB1c2VkIGhlcmUgZGlyZWN0bHksIHNpbmNlIGl0J3NcbiAqIGRlY2xhcmVkICphZnRlciogdGhlIGBSYWRpb0NvbnRyb2xSZWdpc3RyeWAgY2xhc3MgYW5kIHRoZSBgcHJvdmlkZWRJbmAgZG9lc24ndCBzdXBwb3J0XG4gKiBgZm9yd2FyZFJlZmAgbG9naWMuXG4gKi9cbkBOZ01vZHVsZSgpXG5leHBvcnQgY2xhc3MgUmFkaW9Db250cm9sUmVnaXN0cnlNb2R1bGUge1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ2xhc3MgdXNlZCBieSBBbmd1bGFyIHRvIHRyYWNrIHJhZGlvIGJ1dHRvbnMuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46IFJhZGlvQ29udHJvbFJlZ2lzdHJ5TW9kdWxlfSlcbmV4cG9ydCBjbGFzcyBSYWRpb0NvbnRyb2xSZWdpc3RyeSB7XG4gIHByaXZhdGUgX2FjY2Vzc29yczogYW55W10gPSBbXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBjb250cm9sIHRvIHRoZSBpbnRlcm5hbCByZWdpc3RyeS4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKi9cbiAgYWRkKGNvbnRyb2w6IE5nQ29udHJvbCwgYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMucHVzaChbY29udHJvbCwgYWNjZXNzb3JdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVtb3ZlcyBhIGNvbnRyb2wgZnJvbSB0aGUgaW50ZXJuYWwgcmVnaXN0cnkuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIHJlbW92ZShhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmICh0aGlzLl9hY2Nlc3NvcnNbaV1bMV0gPT09IGFjY2Vzc29yKSB7XG4gICAgICAgIHRoaXMuX2FjY2Vzc29ycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNlbGVjdHMgYSByYWRpbyBidXR0b24uIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIHNlbGVjdChhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIHRoaXMuX2FjY2Vzc29ycy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICBpZiAodGhpcy5faXNTYW1lR3JvdXAoYywgYWNjZXNzb3IpICYmIGNbMV0gIT09IGFjY2Vzc29yKSB7XG4gICAgICAgIGNbMV0uZmlyZVVuY2hlY2soYWNjZXNzb3IudmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNTYW1lR3JvdXAoXG4gICAgICBjb250cm9sUGFpcjogW05nQ29udHJvbCwgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcl0sXG4gICAgICBhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcik6IGJvb2xlYW4ge1xuICAgIGlmICghY29udHJvbFBhaXJbMF0uY29udHJvbCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBjb250cm9sUGFpclswXS5fcGFyZW50ID09PSBhY2Nlc3Nvci5fY29udHJvbC5fcGFyZW50ICYmXG4gICAgICAgIGNvbnRyb2xQYWlyWzFdLm5hbWUgPT09IGFjY2Vzc29yLm5hbWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB3cml0aW5nIHJhZGlvIGNvbnRyb2wgdmFsdWVzIGFuZCBsaXN0ZW5pbmcgdG8gcmFkaW8gY29udHJvbFxuICogY2hhbmdlcy4gVGhlIHZhbHVlIGFjY2Vzc29yIGlzIHVzZWQgYnkgdGhlIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGBGb3JtQ29udHJvbE5hbWVgLCBhbmRcbiAqIGBOZ01vZGVsYCBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIHJhZGlvIGJ1dHRvbnMgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXNcbiAqXG4gKiBUaGUgZm9sbG93IGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSByYWRpbyBidXR0b25zIGluIGEgcmVhY3RpdmUgZm9ybS4gV2hlbiB1c2luZyByYWRpbyBidXR0b25zIGluXG4gKiBhIHJlYWN0aXZlIGZvcm0sIHJhZGlvIGJ1dHRvbnMgaW4gdGhlIHNhbWUgZ3JvdXAgc2hvdWxkIGhhdmUgdGhlIHNhbWUgYGZvcm1Db250cm9sTmFtZWAuXG4gKiBQcm92aWRpbmcgYSBgbmFtZWAgYXR0cmlidXRlIGlzIG9wdGlvbmFsLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9yZWFjdGl2ZVJhZGlvQnV0dG9ucy9yZWFjdGl2ZV9yYWRpb19idXR0b25fZXhhbXBsZS50cyByZWdpb249J1JlYWN0aXZlJ31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPXJhZGlvXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9cmFkaW9dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPXJhZGlvXVtuZ01vZGVsXScsXG4gIGhvc3Q6IHsnKGNoYW5nZSknOiAnb25DaGFuZ2UoKScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknfSxcbiAgcHJvdmlkZXJzOiBbUkFESU9fVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IgZXh0ZW5kcyBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50c1xuICAgIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9zdGF0ZSE6IGJvb2xlYW47XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9jb250cm9sITogTmdDb250cm9sO1xuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfZm4hOiBGdW5jdGlvbjtcblxuICAvKipcbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBjaGFuZ2UgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKiBOb3RlOiB3ZSBkZWNsYXJlIGBvbkNoYW5nZWAgaGVyZSAoYWxzbyB1c2VkIGFzIGhvc3QgbGlzdGVuZXIpIGFzIGEgZnVuY3Rpb24gd2l0aCBubyBhcmd1bWVudHNcbiAgICogdG8gb3ZlcnJpZGUgdGhlIGBvbkNoYW5nZWAgZnVuY3Rpb24gKHdoaWNoIGV4cGVjdHMgMSBhcmd1bWVudCkgaW4gdGhlIHBhcmVudFxuICAgKiBgQmFzZUNvbnRyb2xWYWx1ZUFjY2Vzc29yYCBjbGFzcy5cbiAgICogQG5vZG9jXG4gICAqL1xuICBvdmVycmlkZSBvbkNoYW5nZSA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG5hbWUhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIG5hbWUgb2YgdGhlIGBGb3JtQ29udHJvbGAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBmb3JtQ29udHJvbE5hbWUhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIHZhbHVlIG9mIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50XG4gICAqL1xuICBASW5wdXQoKSB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcmVuZGVyZXI6IFJlbmRlcmVyMiwgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBfcmVnaXN0cnk6IFJhZGlvQ29udHJvbFJlZ2lzdHJ5LFxuICAgICAgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yKSB7XG4gICAgc3VwZXIocmVuZGVyZXIsIGVsZW1lbnRSZWYpO1xuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250cm9sID0gdGhpcy5faW5qZWN0b3IuZ2V0KE5nQ29udHJvbCk7XG4gICAgdGhpcy5fY2hlY2tOYW1lKCk7XG4gICAgdGhpcy5fcmVnaXN0cnkuYWRkKHRoaXMuX2NvbnRyb2wsIHRoaXMpO1xuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZWdpc3RyeS5yZW1vdmUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJjaGVja2VkXCIgcHJvcGVydHkgdmFsdWUgb24gdGhlIHJhZGlvIGlucHV0IGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fc3RhdGUgPSB2YWx1ZSA9PT0gdGhpcy52YWx1ZTtcbiAgICB0aGlzLnNldFByb3BlcnR5KCdjaGVja2VkJywgdGhpcy5fc3RhdGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgb3ZlcnJpZGUgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9mbiA9IGZuO1xuICAgIHRoaXMub25DaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBmbih0aGlzLnZhbHVlKTtcbiAgICAgIHRoaXMuX3JlZ2lzdHJ5LnNlbGVjdCh0aGlzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwidmFsdWVcIiBvbiB0aGUgcmFkaW8gaW5wdXQgZWxlbWVudCBhbmQgdW5jaGVja3MgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgZmlyZVVuY2hlY2sodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja05hbWUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubmFtZSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSAmJiB0aGlzLm5hbWUgIT09IHRoaXMuZm9ybUNvbnRyb2xOYW1lICYmXG4gICAgICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvd05hbWVFcnJvcigpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubmFtZSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSkgdGhpcy5uYW1lID0gdGhpcy5mb3JtQ29udHJvbE5hbWU7XG4gIH1cbn1cbiJdfQ==