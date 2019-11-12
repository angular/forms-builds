/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Injectable, Injector, Input, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import * as i0 from "@angular/core";
export var RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return RadioControlValueAccessor; }),
    multi: true
};
/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
var RadioControlRegistry = /** @class */ (function () {
    function RadioControlRegistry() {
        this._accessors = [];
    }
    /**
     * @description
     * Adds a control to the internal registry. For internal use only.
     */
    RadioControlRegistry.prototype.add = function (control, accessor) {
        this._accessors.push([control, accessor]);
    };
    /**
     * @description
     * Removes a control from the internal registry. For internal use only.
     */
    RadioControlRegistry.prototype.remove = function (accessor) {
        for (var i = this._accessors.length - 1; i >= 0; --i) {
            if (this._accessors[i][1] === accessor) {
                this._accessors.splice(i, 1);
                return;
            }
        }
    };
    /**
     * @description
     * Selects a radio button. For internal use only.
     */
    RadioControlRegistry.prototype.select = function (accessor) {
        var _this = this;
        this._accessors.forEach(function (c) {
            if (_this._isSameGroup(c, accessor) && c[1] !== accessor) {
                c[1].fireUncheck(accessor.value);
            }
        });
    };
    RadioControlRegistry.prototype._isSameGroup = function (controlPair, accessor) {
        if (!controlPair[0].control)
            return false;
        return controlPair[0]._parent === accessor._control._parent &&
            controlPair[1].name === accessor.name;
    };
    RadioControlRegistry.ɵfac = function RadioControlRegistry_Factory(t) { return new (t || RadioControlRegistry)(); };
    RadioControlRegistry.ɵprov = i0.ɵɵdefineInjectable({ token: RadioControlRegistry, factory: function (t) { return RadioControlRegistry.ɵfac(t); }, providedIn: null });
    return RadioControlRegistry;
}());
export { RadioControlRegistry };
/*@__PURE__*/ i0.ɵsetClassMetadata(RadioControlRegistry, [{
        type: Injectable
    }], null, null);
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
var RadioControlValueAccessor = /** @class */ (function () {
    function RadioControlValueAccessor(_renderer, _elementRef, _registry, _injector) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._registry = _registry;
        this._injector = _injector;
        /**
         * @description
         * The registered callback function called when a change event occurs on the input element.
         */
        this.onChange = function () { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = function () { };
    }
    /**
     * @description
     * A lifecycle method called when the directive is initialized. For internal use only.
     */
    RadioControlValueAccessor.prototype.ngOnInit = function () {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
    };
    /**
     * @description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     */
    RadioControlValueAccessor.prototype.ngOnDestroy = function () { this._registry.remove(this); };
    /**
     * @description
     * Sets the "checked" property value on the radio input element.
     *
     * @param value The checked value
     */
    RadioControlValueAccessor.prototype.writeValue = function (value) {
        this._state = value === this.value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'checked', this._state);
    };
    /**
     * @description
     * Registers a function called when the control value changes.
     *
     * @param fn The callback function
     */
    RadioControlValueAccessor.prototype.registerOnChange = function (fn) {
        var _this = this;
        this._fn = fn;
        this.onChange = function () {
            fn(_this.value);
            _this._registry.select(_this);
        };
    };
    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    RadioControlValueAccessor.prototype.fireUncheck = function (value) { this.writeValue(value); };
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    RadioControlValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * Sets the "disabled" property on the input element.
     *
     * @param isDisabled The disabled value
     */
    RadioControlValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    RadioControlValueAccessor.prototype._checkName = function () {
        if (this.name && this.formControlName && this.name !== this.formControlName) {
            this._throwNameError();
        }
        if (!this.name && this.formControlName)
            this.name = this.formControlName;
    };
    RadioControlValueAccessor.prototype._throwNameError = function () {
        throw new Error("\n      If you define both a name and a formControlName attribute on your radio button, their values\n      must match. Ex: <input type=\"radio\" formControlName=\"food\" name=\"food\">\n    ");
    };
    RadioControlValueAccessor.ɵfac = function RadioControlValueAccessor_Factory(t) { return new (t || RadioControlValueAccessor)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(RadioControlRegistry), i0.ɵɵdirectiveInject(i0.Injector)); };
    RadioControlValueAccessor.ɵdir = i0.ɵɵdefineDirective({ type: RadioControlValueAccessor, selectors: [["input", "type", "radio", "formControlName", ""], ["input", "type", "radio", "formControl", ""], ["input", "type", "radio", "ngModel", ""]], hostBindings: function RadioControlValueAccessor_HostBindings(rf, ctx, elIndex) { if (rf & 1) {
            i0.ɵɵlistener("change", function RadioControlValueAccessor_change_HostBindingHandler($event) { return ctx.onChange(); })("blur", function RadioControlValueAccessor_blur_HostBindingHandler($event) { return ctx.onTouched(); });
        } }, inputs: { name: "name", formControlName: "formControlName", value: "value" }, features: [i0.ɵɵProvidersFeature([RADIO_VALUE_ACCESSOR])] });
    return RadioControlValueAccessor;
}());
export { RadioControlValueAccessor };
/*@__PURE__*/ i0.ɵsetClassMetadata(RadioControlValueAccessor, [{
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
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQXFCLFNBQVMsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFM0gsT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7O0FBRXZDLE1BQU0sQ0FBQyxJQUFNLG9CQUFvQixHQUFRO0lBQ3ZDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEseUJBQXlCLEVBQXpCLENBQXlCLENBQUM7SUFDeEQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBRUY7OztHQUdHO0FBQ0g7SUFBQTtRQUVVLGVBQVUsR0FBVSxFQUFFLENBQUM7S0EwQ2hDO0lBeENDOzs7T0FHRztJQUNILGtDQUFHLEdBQUgsVUFBSSxPQUFrQixFQUFFLFFBQW1DO1FBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILHFDQUFNLEdBQU4sVUFBTyxRQUFtQztRQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3BELElBQUksSUFBSSxDQUFDLFVB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LENBQUMsb0JBQW9CLENBQUM7YUFDbEM7dUZBZ0R3QixvQkFBb0I7a0JBbEIxQyxLQUFLOztrQkFRTCxLQUFLOztrQkFNTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyLCBmb3J3YXJkUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcblxuZXhwb3J0IGNvbnN0IFJBRElPX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDbGFzcyB1c2VkIGJ5IEFuZ3VsYXIgdG8gdHJhY2sgcmFkaW8gYnV0dG9ucy4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmFkaW9Db250cm9sUmVnaXN0cnkge1xuICBwcml2YXRlIF9hY2Nlc3NvcnM6IGFueVtdID0gW107XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBZGRzIGEgY29udHJvbCB0byB0aGUgaW50ZXJuYWwgcmVnaXN0cnkuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIGFkZChjb250cm9sOiBOZ0NvbnRyb2wsIGFjY2Vzc29yOiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSB7XG4gICAgdGhpcy5fYWNjZXNzb3JzLnB1c2goW2NvbnRyb2wsIGFjY2Vzc29yXSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlbW92ZXMgYSBjb250cm9sIGZyb20gdGhlIGludGVybmFsIHJlZ2lzdHJ5LiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICByZW1vdmUoYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5fYWNjZXNzb3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICBpZiAodGhpcy5fYWNjZXNzb3JzW2ldWzFdID09PSBhY2Nlc3Nvcikge1xuICAgICAgICB0aGlzLl9hY2Nlc3NvcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZWxlY3RzIGEgcmFkaW8gYnV0dG9uLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICBzZWxlY3QoYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgaWYgKHRoaXMuX2lzU2FtZUdyb3VwKGMsIGFjY2Vzc29yKSAmJiBjWzFdICE9PSBhY2Nlc3Nvcikge1xuICAgICAgICBjWzFdLmZpcmVVbmNoZWNrKGFjY2Vzc29yLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzU2FtZUdyb3VwKFxuICAgICAgY29udHJvbFBhaXI6IFtOZ0NvbnRyb2wsIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3JdLFxuICAgICAgYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpOiBib29sZWFuIHtcbiAgICBpZiAoIWNvbnRyb2xQYWlyWzBdLmNvbnRyb2wpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gY29udHJvbFBhaXJbMF0uX3BhcmVudCA9PT0gYWNjZXNzb3IuX2NvbnRyb2wuX3BhcmVudCAmJlxuICAgICAgICBjb250cm9sUGFpclsxXS5uYW1lID09PSBhY2Nlc3Nvci5uYW1lO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyByYWRpbyBjb250cm9sIHZhbHVlcyBhbmQgbGlzdGVuaW5nIHRvIHJhZGlvIGNvbnRyb2xcbiAqIGNoYW5nZXMuIFRoZSB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kXG4gKiBgTmdNb2RlbGAgZGlyZWN0aXZlcy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBVc2luZyByYWRpbyBidXR0b25zIHdpdGggcmVhY3RpdmUgZm9ybSBkaXJlY3RpdmVzXG4gKlxuICogVGhlIGZvbGxvdyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgcmFkaW8gYnV0dG9ucyBpbiBhIHJlYWN0aXZlIGZvcm0uIFdoZW4gdXNpbmcgcmFkaW8gYnV0dG9ucyBpblxuICogYSByZWFjdGl2ZSBmb3JtLCByYWRpbyBidXR0b25zIGluIHRoZSBzYW1lIGdyb3VwIHNob3VsZCBoYXZlIHRoZSBzYW1lIGBmb3JtQ29udHJvbE5hbWVgLlxuICogUHJvdmlkaW5nIGEgYG5hbWVgIGF0dHJpYnV0ZSBpcyBvcHRpb25hbC5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvcmVhY3RpdmVSYWRpb0J1dHRvbnMvcmVhY3RpdmVfcmFkaW9fYnV0dG9uX2V4YW1wbGUudHMgcmVnaW9uPSdSZWFjdGl2ZSd9XG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXRbdHlwZT1yYWRpb11bZm9ybUNvbnRyb2xOYW1lXSxpbnB1dFt0eXBlPXJhZGlvXVtmb3JtQ29udHJvbF0saW5wdXRbdHlwZT1yYWRpb11bbmdNb2RlbF0nLFxuICBob3N0OiB7JyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCknLCAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJ30sXG4gIHByb3ZpZGVyczogW1JBRElPX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gICAgT25EZXN0cm95LCBPbkluaXQge1xuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfc3RhdGUgITogYm9vbGVhbjtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX2NvbnRyb2wgITogTmdDb250cm9sO1xuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfZm4gITogRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGNoYW5nZSBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqL1xuICBvbkNoYW5nZSA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBibHVyIGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG5hbWUgITogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBuYW1lIG9mIHRoZSBgRm9ybUNvbnRyb2xgIGJvdW5kIHRvIHRoZSBkaXJlY3RpdmUuIFRoZSBuYW1lIGNvcnJlc3BvbmRzXG4gICAqIHRvIGEga2V5IGluIHRoZSBwYXJlbnQgYEZvcm1Hcm91cGAgb3IgYEZvcm1BcnJheWAuXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgZm9ybUNvbnRyb2xOYW1lICE6IHN0cmluZztcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgdmFsdWUgb2YgdGhlIHJhZGlvIGlucHV0IGVsZW1lbnRcbiAgICovXG4gIEBJbnB1dCgpIHZhbHVlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgcHJpdmF0ZSBfcmVnaXN0cnk6IFJhZGlvQ29udHJvbFJlZ2lzdHJ5LCBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IpIHt9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBIGxpZmVjeWNsZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGRpcmVjdGl2ZSBpcyBpbml0aWFsaXplZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29udHJvbCA9IHRoaXMuX2luamVjdG9yLmdldChOZ0NvbnRyb2wpO1xuICAgIHRoaXMuX2NoZWNrTmFtZSgpO1xuICAgIHRoaXMuX3JlZ2lzdHJ5LmFkZCh0aGlzLl9jb250cm9sLCB0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTGlmZWN5Y2xlIG1ldGhvZCBjYWxsZWQgYmVmb3JlIHRoZSBkaXJlY3RpdmUncyBpbnN0YW5jZSBpcyBkZXN0cm95ZWQuIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQgeyB0aGlzLl9yZWdpc3RyeS5yZW1vdmUodGhpcyk7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIFwiY2hlY2tlZFwiIHByb3BlcnR5IHZhbHVlIG9uIHRoZSByYWRpbyBpbnB1dCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIGNoZWNrZWQgdmFsdWVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlID0gdmFsdWUgPT09IHRoaXMudmFsdWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnY2hlY2tlZCcsIHRoaXMuX3N0YXRlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9mbiA9IGZuO1xuICAgIHRoaXMub25DaGFuZ2UgPSAoKSA9PiB7XG4gICAgICBmbih0aGlzLnZhbHVlKTtcbiAgICAgIHRoaXMuX3JlZ2lzdHJ5LnNlbGVjdCh0aGlzKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwidmFsdWVcIiBvbiB0aGUgcmFkaW8gaW5wdXQgZWxlbWVudCBhbmQgdW5jaGVja3MgaXQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKi9cbiAgZmlyZVVuY2hlY2sodmFsdWU6IGFueSk6IHZvaWQgeyB0aGlzLndyaXRlVmFsdWUodmFsdWUpOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCBpcyB0b3VjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcImRpc2FibGVkXCIgcHJvcGVydHkgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFRoZSBkaXNhYmxlZCB2YWx1ZVxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrTmFtZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uYW1lICYmIHRoaXMuZm9ybUNvbnRyb2xOYW1lICYmIHRoaXMubmFtZSAhPT0gdGhpcy5mb3JtQ29udHJvbE5hbWUpIHtcbiAgICAgIHRoaXMuX3Rocm93TmFtZUVycm9yKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5uYW1lICYmIHRoaXMuZm9ybUNvbnRyb2xOYW1lKSB0aGlzLm5hbWUgPSB0aGlzLmZvcm1Db250cm9sTmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgX3Rocm93TmFtZUVycm9yKCk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBJZiB5b3UgZGVmaW5lIGJvdGggYSBuYW1lIGFuZCBhIGZvcm1Db250cm9sTmFtZSBhdHRyaWJ1dGUgb24geW91ciByYWRpbyBidXR0b24sIHRoZWlyIHZhbHVlc1xuICAgICAgbXVzdCBtYXRjaC4gRXg6IDxpbnB1dCB0eXBlPVwicmFkaW9cIiBmb3JtQ29udHJvbE5hbWU9XCJmb29kXCIgbmFtZT1cImZvb2RcIj5cbiAgICBgKTtcbiAgfVxufVxuIl19