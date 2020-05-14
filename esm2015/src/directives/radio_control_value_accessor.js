/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/directives/radio_control_value_accessor.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, forwardRef, Injectable, Injector, Input, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
export const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => RadioControlValueAccessor)),
    multi: true
};
/**
 * \@description
 * Class used by Angular to track radio buttons. For internal use only.
 */
let RadioControlRegistry = /** @class */ (() => {
    /**
     * \@description
     * Class used by Angular to track radio buttons. For internal use only.
     */
    class RadioControlRegistry {
        constructor() {
            this._accessors = [];
        }
        /**
         * \@description
         * Adds a control to the internal registry. For internal use only.
         * @param {?} control
         * @param {?} accessor
         * @return {?}
         */
        add(control, accessor) {
            this._accessors.push([control, accessor]);
        }
        /**
         * \@description
         * Removes a control from the internal registry. For internal use only.
         * @param {?} accessor
         * @return {?}
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
         * \@description
         * Selects a radio button. For internal use only.
         * @param {?} accessor
         * @return {?}
         */
        select(accessor) {
            this._accessors.forEach((/**
             * @param {?} c
             * @return {?}
             */
            (c) => {
                if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
                    c[1].fireUncheck(accessor.value);
                }
            }));
        }
        /**
         * @private
         * @param {?} controlPair
         * @param {?} accessor
         * @return {?}
         */
        _isSameGroup(controlPair, accessor) {
            if (!controlPair[0].control)
                return false;
            return controlPair[0]._parent === accessor._control._parent &&
                controlPair[1].name === accessor.name;
        }
    }
    RadioControlRegistry.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */ RadioControlRegistry.ɵfac = function RadioControlRegistry_Factory(t) { return new (t || RadioControlRegistry)(); };
    /** @nocollapse */ RadioControlRegistry.ɵprov = i0.ɵɵdefineInjectable({ token: RadioControlRegistry, factory: RadioControlRegistry.ɵfac });
    return RadioControlRegistry;
})();
export { RadioControlRegistry };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RadioControlRegistry, [{
        type: Injectable
    }], null, null); })();
if (false) {
    /**
     * @type {?}
     * @private
     */
    RadioControlRegistry.prototype._accessors;
}
/**
 * \@description
 * The `ControlValueAccessor` for writing radio control values and listening to radio control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * \@usageNotes
 *
 * ### Using radio buttons with reactive form directives
 *
 * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
 * a reactive form, radio buttons in the same group should have the same `formControlName`.
 * Providing a `name` attribute is optional.
 *
 * {\@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 * \@ngModule ReactiveFormsModule
 * \@ngModule FormsModule
 * \@publicApi
 */
let RadioControlValueAccessor = /** @class */ (() => {
    /**
     * \@description
     * The `ControlValueAccessor` for writing radio control values and listening to radio control
     * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
     * `NgModel` directives.
     *
     * \@usageNotes
     *
     * ### Using radio buttons with reactive form directives
     *
     * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
     * a reactive form, radio buttons in the same group should have the same `formControlName`.
     * Providing a `name` attribute is optional.
     *
     * {\@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
     *
     * \@ngModule ReactiveFormsModule
     * \@ngModule FormsModule
     * \@publicApi
     */
    class RadioControlValueAccessor {
        /**
         * @param {?} _renderer
         * @param {?} _elementRef
         * @param {?} _registry
         * @param {?} _injector
         */
        constructor(_renderer, _elementRef, _registry, _injector) {
            this._renderer = _renderer;
            this._elementRef = _elementRef;
            this._registry = _registry;
            this._injector = _injector;
            /**
             * \@description
             * The registered callback function called when a change event occurs on the input element.
             */
            this.onChange = (/**
             * @return {?}
             */
            () => { });
            /**
             * \@description
             * The registered callback function called when a blur event occurs on the input element.
             */
            this.onTouched = (/**
             * @return {?}
             */
            () => { });
        }
        /**
         * \@description
         * A lifecycle method called when the directive is initialized. For internal use only.
         * @return {?}
         */
        ngOnInit() {
            this._control = this._injector.get(NgControl);
            this._checkName();
            this._registry.add(this._control, this);
        }
        /**
         * \@description
         * Lifecycle method called before the directive's instance is destroyed. For internal use only.
         * @return {?}
         */
        ngOnDestroy() {
            this._registry.remove(this);
        }
        /**
         * \@description
         * Sets the "checked" property value on the radio input element.
         *
         * @param {?} value The checked value
         * @return {?}
         */
        writeValue(value) {
            this._state = value === this.value;
            this._renderer.setProperty(this._elementRef.nativeElement, 'checked', this._state);
        }
        /**
         * \@description
         * Registers a function called when the control value changes.
         *
         * @param {?} fn The callback function
         * @return {?}
         */
        registerOnChange(fn) {
            this._fn = fn;
            this.onChange = (/**
             * @return {?}
             */
            () => {
                fn(this.value);
                this._registry.select(this);
            });
        }
        /**
         * Sets the "value" on the radio input element and unchecks it.
         *
         * @param {?} value
         * @return {?}
         */
        fireUncheck(value) {
            this.writeValue(value);
        }
        /**
         * \@description
         * Registers a function called when the control is touched.
         *
         * @param {?} fn The callback function
         * @return {?}
         */
        registerOnTouched(fn) {
            this.onTouched = fn;
        }
        /**
         * Sets the "disabled" property on the input element.
         *
         * @param {?} isDisabled The disabled value
         * @return {?}
         */
        setDisabledState(isDisabled) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
        }
        /**
         * @private
         * @return {?}
         */
        _checkName() {
            if (this.name && this.formControlName && this.name !== this.formControlName) {
                this._throwNameError();
            }
            if (!this.name && this.formControlName)
                this.name = this.formControlName;
        }
        /**
         * @private
         * @return {?}
         */
        _throwNameError() {
            throw new Error(`
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
        }
    }
    RadioControlValueAccessor.decorators = [
        { type: Directive, args: [{
                    selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                    host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                    providers: [RADIO_VALUE_ACCESSOR]
                },] },
    ];
    /** @nocollapse */
    RadioControlValueAccessor.ctorParameters = () => [
        { type: Renderer2 },
        { type: ElementRef },
        { type: RadioControlRegistry },
        { type: Injector }
    ];
    RadioControlValueAccessor.propDecorators = {
        name: [{ type: Input }],
        formControlName: [{ type: Input }],
        value: [{ type: Input }]
    };
    /** @nocollapse */ RadioControlValueAccessor.ɵfac = function RadioControlValueAccessor_Factory(t) { return new (t || RadioControlValueAccessor)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(RadioControlRegistry), i0.ɵɵdirectiveInject(i0.Injector)); };
    /** @nocollapse */ RadioControlValueAccessor.ɵdir = i0.ɵɵdefineDirective({ type: RadioControlValueAccessor, selectors: [["input", "type", "radio", "formControlName", ""], ["input", "type", "radio", "formControl", ""], ["input", "type", "radio", "ngModel", ""]], hostBindings: function RadioControlValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("change", function RadioControlValueAccessor_change_HostBindingHandler() { return ctx.onChange(); })("blur", function RadioControlValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); });
        } }, inputs: { name: "name", formControlName: "formControlName", value: "value" }, features: [i0.ɵɵProvidersFeature([RADIO_VALUE_ACCESSOR])] });
    return RadioControlValueAccessor;
})();
export { RadioControlValueAccessor };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RadioControlValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                providers: [RADIO_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: RadioControlRegistry }, { type: i0.Injector }]; }, { name: [{
            type: Input
        }], formControlName: [{
            type: Input
        }], value: [{
            type: Input
        }] }); })();
if (false) {
    /**
     * \@internal
     * @type {?}
     */
    RadioControlValueAccessor.prototype._state;
    /**
     * \@internal
     * @type {?}
     */
    RadioControlValueAccessor.prototype._control;
    /**
     * \@internal
     * @type {?}
     */
    RadioControlValueAccessor.prototype._fn;
    /**
     * \@description
     * The registered callback function called when a change event occurs on the input element.
     * @type {?}
     */
    RadioControlValueAccessor.prototype.onChange;
    /**
     * \@description
     * The registered callback function called when a blur event occurs on the input element.
     * @type {?}
     */
    RadioControlValueAccessor.prototype.onTouched;
    /**
     * \@description
     * Tracks the name of the radio input element.
     * @type {?}
     */
    RadioControlValueAccessor.prototype.name;
    /**
     * \@description
     * Tracks the name of the `FormControl` bound to the directive. The name corresponds
     * to a key in the parent `FormGroup` or `FormArray`.
     * @type {?}
     */
    RadioControlValueAccessor.prototype.formControlName;
    /**
     * \@description
     * Tracks the value of the radio input element
     * @type {?}
     */
    RadioControlValueAccessor.prototype.value;
    /**
     * @type {?}
     * @private
     */
    RadioControlValueAccessor.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    RadioControlValueAccessor.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    RadioControlValueAccessor.prototype._registry;
    /**
     * @type {?}
     * @private
     */
    RadioControlValueAccessor.prototype._injector;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUUzSCxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDakYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQzs7Ozs7Ozs7OztBQUV2QyxNQUFNLE9BQU8sb0JBQW9CLEdBQVE7SUFDdkMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVTs7O0lBQUMsR0FBRyxFQUFFLENBQUMseUJBQXlCLEVBQUM7SUFDeEQsS0FBSyxFQUFFLElBQUk7Q0FDWjs7Ozs7QUFNRDs7Ozs7SUFBQSxNQUNhLG9CQUFvQjtRQURqQztZQUVVLGVBQVUsR0FBVSxFQUFFLENBQUM7U0EwQ2hDOzs7Ozs7OztRQXBDQyxHQUFHLENBQUMsT0FBa0IsRUFBRSxRQUFtQztZQUN6RCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzVDLENBQUM7Ozs7Ozs7UUFNRCxNQUFNLENBQUMsUUFBbUM7WUFDeEMsS0FBSyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDcEQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxL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QVc7NEhBRlgsQ0FBQyxvQkFBb0IsQ0FBQztvQ0E3Rm5DO0tBbU9DO1NBcElZLHlCQUF5QjtrREFBekIseUJBQXlCO2NBTnJDLFNBQVM7ZUFBQztnQkFDVCxRQUFRLEVBQ0osOEZBQThGO2dCQUNsRyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxhQUFhLEVBQUM7Z0JBQ3pELFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO2FBQ2xDO3VGQStDd0Isb0JBQW9CO2tCQWxCMUMsS0FBSzs7a0JBUUwsS0FBSzs7a0JBTUwsS0FBSzs7Ozs7OztJQXZDTiwyQ0FBaUI7Ozs7O0lBR2pCLDZDQUFxQjs7Ozs7SUFHckIsd0NBQWU7Ozs7OztJQU1mLDZDQUFvQjs7Ozs7O0lBTXBCLDhDQUFxQjs7Ozs7O0lBT3JCLHlDQUF1Qjs7Ozs7OztJQVF2QixvREFBa0M7Ozs7OztJQU1sQywwQ0FBb0I7Ozs7O0lBR2hCLDhDQUE0Qjs7Ozs7SUFBRSxnREFBK0I7Ozs7O0lBQzdELDhDQUF1Qzs7Ozs7SUFBRSw4Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3RhYmxlLCBJbmplY3RvciwgSW5wdXQsIE9uRGVzdHJveSwgT25Jbml0LCBSZW5kZXJlcjJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuXG5leHBvcnQgY29uc3QgUkFESU9fVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENsYXNzIHVzZWQgYnkgQW5ndWxhciB0byB0cmFjayByYWRpbyBidXR0b25zLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBSYWRpb0NvbnRyb2xSZWdpc3RyeSB7XG4gIHByaXZhdGUgX2FjY2Vzc29yczogYW55W10gPSBbXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBjb250cm9sIHRvIHRoZSBpbnRlcm5hbCByZWdpc3RyeS4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKi9cbiAgYWRkKGNvbnRyb2w6IE5nQ29udHJvbCwgYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMucHVzaChbY29udHJvbCwgYWNjZXNzb3JdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVtb3ZlcyBhIGNvbnRyb2wgZnJvbSB0aGUgaW50ZXJuYWwgcmVnaXN0cnkuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIHJlbW92ZShhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmICh0aGlzLl9hY2Nlc3NvcnNbaV1bMV0gPT09IGFjY2Vzc29yKSB7XG4gICAgICAgIHRoaXMuX2FjY2Vzc29ycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNlbGVjdHMgYSByYWRpbyBidXR0b24uIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIHNlbGVjdChhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIHRoaXMuX2FjY2Vzc29ycy5mb3JFYWNoKChjKSA9PiB7XG4gICAgICBpZiAodGhpcy5faXNTYW1lR3JvdXAoYywgYWNjZXNzb3IpICYmIGNbMV0gIT09IGFjY2Vzc29yKSB7XG4gICAgICAgIGNbMV0uZmlyZVVuY2hlY2soYWNjZXNzb3IudmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfaXNTYW1lR3JvdXAoXG4gICAgICBjb250cm9sUGFpcjogW05nQ29udHJvbCwgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcl0sXG4gICAgICBhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcik6IGJvb2xlYW4ge1xuICAgIGlmICghY29udHJvbFBhaXJbMF0uY29udHJvbCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiBjb250cm9sUGFpclswXS5fcGFyZW50ID09PSBhY2Nlc3Nvci5fY29udHJvbC5fcGFyZW50ICYmXG4gICAgICAgIGNvbnRyb2xQYWlyWzFdLm5hbWUgPT09IGFjY2Vzc29yLm5hbWU7XG4gIH1cbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB3cml0aW5nIHJhZGlvIGNvbnRyb2wgdmFsdWVzIGFuZCBsaXN0ZW5pbmcgdG8gcmFkaW8gY29udHJvbFxuICogY2hhbmdlcy4gVGhlIHZhbHVlIGFjY2Vzc29yIGlzIHVzZWQgYnkgdGhlIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGBGb3JtQ29udHJvbE5hbWVgLCBhbmRcbiAqIGBOZ01vZGVsYCBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIHJhZGlvIGJ1dHRvbnMgd2l0aCByZWFjdGl2ZSBmb3JtIGRpcmVjdGl2ZXNcbiAqXG4gKiBUaGUgZm9sbG93IGV4YW1wbGUgc2hvd3MgaG93IHRvIHVzZSByYWRpbyBidXR0b25zIGluIGEgcmVhY3RpdmUgZm9ybS4gV2hlbiB1c2luZyByYWRpbyBidXR0b25zIGluXG4gKiBhIHJlYWN0aXZlIGZvcm0sIHJhZGlvIGJ1dHRvbnMgaW4gdGhlIHNhbWUgZ3JvdXAgc2hvdWxkIGhhdmUgdGhlIHNhbWUgYGZvcm1Db250cm9sTmFtZWAuXG4gKiBQcm92aWRpbmcgYSBgbmFtZWAgYXR0cmlidXRlIGlzIG9wdGlvbmFsLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9yZWFjdGl2ZVJhZGlvQnV0dG9ucy9yZWFjdGl2ZV9yYWRpb19idXR0b25fZXhhbXBsZS50cyByZWdpb249J1JlYWN0aXZlJ31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPXJhZGlvXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9cmFkaW9dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPXJhZGlvXVtuZ01vZGVsXScsXG4gIGhvc3Q6IHsnKGNoYW5nZSknOiAnb25DaGFuZ2UoKScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknfSxcbiAgcHJvdmlkZXJzOiBbUkFESU9fVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25EZXN0cm95LCBPbkluaXQge1xuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfc3RhdGUhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfY29udHJvbCE6IE5nQ29udHJvbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX2ZuITogRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGNoYW5nZSBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqL1xuICBvbkNoYW5nZSA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBibHVyIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG5hbWUhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIG5hbWUgb2YgdGhlIGBGb3JtQ29udHJvbGAgYm91bmQgdG8gdGhlIGRpcmVjdGl2ZS4gVGhlIG5hbWUgY29ycmVzcG9uZHNcbiAgICogdG8gYSBrZXkgaW4gdGhlIHBhcmVudCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YC5cbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBmb3JtQ29udHJvbE5hbWUhOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3MgdGhlIHZhbHVlIG9mIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50XG4gICAqL1xuICBASW5wdXQoKSB2YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIHByaXZhdGUgX3JlZ2lzdHJ5OiBSYWRpb0NvbnRyb2xSZWdpc3RyeSwgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yKSB7fVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQSBsaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBkaXJlY3RpdmUgaXMgaW5pdGlhbGl6ZWQuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnRyb2wgPSB0aGlzLl9pbmplY3Rvci5nZXQoTmdDb250cm9sKTtcbiAgICB0aGlzLl9jaGVja05hbWUoKTtcbiAgICB0aGlzLl9yZWdpc3RyeS5hZGQodGhpcy5fY29udHJvbCwgdGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIExpZmVjeWNsZSBtZXRob2QgY2FsbGVkIGJlZm9yZSB0aGUgZGlyZWN0aXZlJ3MgaW5zdGFuY2UgaXMgZGVzdHJveWVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9yZWdpc3RyeS5yZW1vdmUodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIFwiY2hlY2tlZFwiIHByb3BlcnR5IHZhbHVlIG9uIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIGNoZWNrZWQgdmFsdWVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlID0gdmFsdWUgPT09IHRoaXMudmFsdWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnY2hlY2tlZCcsIHRoaXMuX3N0YXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9mbiA9IGZuO1xuICAgIHRoaXMub25DaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBmbih0aGlzLnZhbHVlKTtcbiAgICAgIHRoaXMuX3JlZ2lzdHJ5LnNlbGVjdCh0aGlzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwidmFsdWVcIiBvbiB0aGUgcmFkaW8gaW5wdXQgZWxlbWVudCBhbmQgdW5jaGVja3MgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgZmlyZVVuY2hlY2sodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMud3JpdGVWYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIGlzIHRvdWNoZWQuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJkaXNhYmxlZFwiIHByb3BlcnR5IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gaXNEaXNhYmxlZCBUaGUgZGlzYWJsZWQgdmFsdWVcbiAgICovXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gIH1cblxuICBwcml2YXRlIF9jaGVja05hbWUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubmFtZSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSAmJiB0aGlzLm5hbWUgIT09IHRoaXMuZm9ybUNvbnRyb2xOYW1lKSB7XG4gICAgICB0aGlzLl90aHJvd05hbWVFcnJvcigpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubmFtZSAmJiB0aGlzLmZvcm1Db250cm9sTmFtZSkgdGhpcy5uYW1lID0gdGhpcy5mb3JtQ29udHJvbE5hbWU7XG4gIH1cblxuICBwcml2YXRlIF90aHJvd05hbWVFcnJvcigpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgSWYgeW91IGRlZmluZSBib3RoIGEgbmFtZSBhbmQgYSBmb3JtQ29udHJvbE5hbWUgYXR0cmlidXRlIG9uIHlvdXIgcmFkaW8gYnV0dG9uLCB0aGVpciB2YWx1ZXNcbiAgICAgIG11c3QgbWF0Y2guIEV4OiA8aW5wdXQgdHlwZT1cInJhZGlvXCIgZm9ybUNvbnRyb2xOYW1lPVwiZm9vZFwiIG5hbWU9XCJmb29kXCI+XG4gICAgYCk7XG4gIH1cbn1cbiJdfQ==