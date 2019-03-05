/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Host, Input, Optional, Renderer2, forwardRef, ɵlooseIdentical as looseIdentical } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
export const SELECT_MULTIPLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
    multi: true
};
/**
 * @param {?} id
 * @param {?} value
 * @return {?}
 */
function _buildValueString(id, value) {
    if (id == null)
        return `${value}`;
    if (typeof value === 'string')
        value = `'${value}'`;
    if (value && typeof value === 'object')
        value = 'Object';
    return `${id}: ${value}`.slice(0, 50);
}
/**
 * @param {?} valueString
 * @return {?}
 */
function _extractId(valueString) {
    return valueString.split(':')[0];
}
/**
 * Mock interface for HTML Options
 * @record
 */
function HTMLOption() { }
if (false) {
    /** @type {?} */
    HTMLOption.prototype.value;
    /** @type {?} */
    HTMLOption.prototype.selected;
}
/**
 * Mock interface for HTMLCollection
 * @abstract
 */
class HTMLCollection {
}
if (false) {
    /** @type {?} */
    HTMLCollection.prototype.length;
    /**
     * @abstract
     * @param {?} _
     * @return {?}
     */
    HTMLCollection.prototype.item = function (_) { };
}
/**
 * \@description
 * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and `NgModel`
 * directives.
 *
 * @see `SelectControlValueAccessor`
 *
 * \@usageNotes
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
 * \@ngModule ReactiveFormsModule
 * \@ngModule FormsModule
 * \@publicApi
 */
export class SelectMultipleControlValueAccessor {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * \@internal
         */
        this._optionMap = new Map();
        /**
         * \@internal
         */
        this._idCounter = 0;
        /**
         * \@description
         * The registered callback function called when a change event occurs on the input element.
         */
        this.onChange = (_) => { };
        /**
         * \@description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
        this._compareWith = looseIdentical;
    }
    /**
     * \@description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     * @param {?} fn
     * @return {?}
     */
    set compareWith(fn) {
        if (typeof fn !== 'function') {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }
    /**
     * \@description
     * Sets the "value" property on one or of more
     * of the select's options.
     *
     * @param {?} value The value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        /** @type {?} */
        let optionSelectedStateSetter;
        if (Array.isArray(value)) {
            // convert values to ids
            /** @type {?} */
            const ids = value.map((v) => this._getOptionId(v));
            optionSelectedStateSetter = (opt, o) => { opt._setSelected(ids.indexOf(o.toString()) > -1); };
        }
        else {
            optionSelectedStateSetter = (opt, o) => { opt._setSelected(false); };
        }
        this._optionMap.forEach(optionSelectedStateSetter);
    }
    /**
     * \@description
     * Registers a function called when the control value changes
     * and writes an array of the selected options.
     *
     * @param {?} fn The callback function
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = (_) => {
            /** @type {?} */
            const selected = [];
            if (_.hasOwnProperty('selectedOptions')) {
                /** @type {?} */
                const options = _.selectedOptions;
                for (let i = 0; i < options.length; i++) {
                    /** @type {?} */
                    const opt = options.item(i);
                    /** @type {?} */
                    const val = this._getOptionValue(opt.value);
                    selected.push(val);
                }
            }
            // Degrade on IE
            else {
                /** @type {?} */
                const options = (/** @type {?} */ (_.options));
                for (let i = 0; i < options.length; i++) {
                    /** @type {?} */
                    const opt = options.item(i);
                    if (opt.selected) {
                        /** @type {?} */
                        const val = this._getOptionValue(opt.value);
                        selected.push(val);
                    }
                }
            }
            this.value = selected;
            fn(selected);
        };
    }
    /**
     * \@description
     * Registers a function called when the control is touched.
     *
     * @param {?} fn The callback function
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * Sets the "disabled" property on the select input element.
     *
     * @param {?} isDisabled The disabled value
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _registerOption(value) {
        /** @type {?} */
        const id = (this._idCounter++).toString();
        this._optionMap.set(id, value);
        return id;
    }
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _getOptionId(value) {
        for (const id of Array.from(this._optionMap.keys())) {
            if (this._compareWith((/** @type {?} */ (this._optionMap.get(id)))._value, value))
                return id;
        }
        return null;
    }
    /**
     * \@internal
     * @param {?} valueString
     * @return {?}
     */
    _getOptionValue(valueString) {
        /** @type {?} */
        const id = _extractId(valueString);
        return this._optionMap.has(id) ? (/** @type {?} */ (this._optionMap.get(id)))._value : valueString;
    }
}
SelectMultipleControlValueAccessor.decorators = [
    { type: Directive, args: [{
                selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
                host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
                providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
SelectMultipleControlValueAccessor.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
SelectMultipleControlValueAccessor.propDecorators = {
    compareWith: [{ type: Input }]
};
/** @nocollapse */ SelectMultipleControlValueAccessor.ngDirectiveDef = i0.ɵdefineDirective({ type: SelectMultipleControlValueAccessor, selectors: [["select", "multiple", "", "formControlName", ""], ["select", "multiple", "", "formControl", ""], ["select", "multiple", "", "ngModel", ""]], factory: function SelectMultipleControlValueAccessor_Factory(t) { return new (t || SelectMultipleControlValueAccessor)(i0.ɵdirectiveInject(Renderer2), i0.ɵdirectiveInject(ElementRef)); }, hostBindings: function SelectMultipleControlValueAccessor_HostBindings(rf, ctx, elIndex) { if (rf & 1) {
        i0.ɵlistener("change", function SelectMultipleControlValueAccessor_change_HostBindingHandler($event) { return ctx.onChange($event.target); });
        i0.ɵlistener("blur", function SelectMultipleControlValueAccessor_blur_HostBindingHandler($event) { return ctx.onTouched(); });
    } }, inputs: { compareWith: "compareWith" }, features: [i0.ɵProvidersFeature([SELECT_MULTIPLE_VALUE_ACCESSOR])] });
/*@__PURE__*/ i0.ɵsetClassMetadata(SelectMultipleControlValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
                host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
                providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
            }]
    }], function () { return [{
        type: Renderer2
    }, {
        type: ElementRef
    }]; }, { compareWith: [{
            type: Input
        }] });
if (false) {
    /**
     * \@description
     * The current value
     * @type {?}
     */
    SelectMultipleControlValueAccessor.prototype.value;
    /**
     * \@internal
     * @type {?}
     */
    SelectMultipleControlValueAccessor.prototype._optionMap;
    /**
     * \@internal
     * @type {?}
     */
    SelectMultipleControlValueAccessor.prototype._idCounter;
    /**
     * \@description
     * The registered callback function called when a change event occurs on the input element.
     * @type {?}
     */
    SelectMultipleControlValueAccessor.prototype.onChange;
    /**
     * \@description
     * The registered callback function called when a blur event occurs on the input element.
     * @type {?}
     */
    SelectMultipleControlValueAccessor.prototype.onTouched;
    /**
     * @type {?}
     * @private
     */
    SelectMultipleControlValueAccessor.prototype._compareWith;
    /**
     * @type {?}
     * @private
     */
    SelectMultipleControlValueAccessor.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    SelectMultipleControlValueAccessor.prototype._elementRef;
}
/**
 * \@description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see `SelectMultipleControlValueAccessor`
 *
 * \@ngModule ReactiveFormsModule
 * \@ngModule FormsModule
 * \@publicApi
 */
export class ɵNgSelectMultipleOption {
    /**
     * @param {?} _element
     * @param {?} _renderer
     * @param {?} _select
     */
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select) {
            this.id = this._select._registerOption(this);
        }
    }
    /**
     * \@description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     * @param {?} value
     * @return {?}
     */
    set ngValue(value) {
        if (this._select == null)
            return;
        this._value = value;
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }
    /**
     * \@description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        if (this._select) {
            this._value = value;
            this._setElementValue(_buildValueString(this.id, value));
            this._select.writeValue(this._select.value);
        }
        else {
            this._setElementValue(value);
        }
    }
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _setElementValue(value) {
        this._renderer.setProperty(this._element.nativeElement, 'value', value);
    }
    /**
     * \@internal
     * @param {?} selected
     * @return {?}
     */
    _setSelected(selected) {
        this._renderer.setProperty(this._element.nativeElement, 'selected', selected);
    }
    /**
     * \@description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     * @return {?}
     */
    ngOnDestroy() {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
}
ɵNgSelectMultipleOption.decorators = [
    { type: Directive, args: [{ selector: 'option' },] },
];
/** @nocollapse */
ɵNgSelectMultipleOption.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SelectMultipleControlValueAccessor, decorators: [{ type: Optional }, { type: Host }] }
];
ɵNgSelectMultipleOption.propDecorators = {
    ngValue: [{ type: Input, args: ['ngValue',] }],
    value: [{ type: Input, args: ['value',] }]
};
/** @nocollapse */ ɵNgSelectMultipleOption.ngDirectiveDef = i0.ɵdefineDirective({ type: ɵNgSelectMultipleOption, selectors: [["option"]], factory: function ɵNgSelectMultipleOption_Factory(t) { return new (t || ɵNgSelectMultipleOption)(i0.ɵdirectiveInject(ElementRef), i0.ɵdirectiveInject(Renderer2), i0.ɵdirectiveInject(SelectMultipleControlValueAccessor, 9)); }, inputs: { ngValue: "ngValue", value: "value" } });
/*@__PURE__*/ i0.ɵsetClassMetadata(ɵNgSelectMultipleOption, [{
        type: Directive,
        args: [{ selector: 'option' }]
    }], function () { return [{
        type: ElementRef
    }, {
        type: Renderer2
    }, {
        type: SelectMultipleControlValueAccessor,
        decorators: [{
                type: Optional
            }, {
                type: Host
            }]
    }]; }, { ngValue: [{
            type: Input,
            args: ['ngValue']
        }], value: [{
            type: Input,
            args: ['value']
        }] });
if (false) {
    /** @type {?} */
    ɵNgSelectMultipleOption.prototype.id;
    /**
     * \@internal
     * @type {?}
     */
    ɵNgSelectMultipleOption.prototype._value;
    /**
     * @type {?}
     * @private
     */
    ɵNgSelectMultipleOption.prototype._element;
    /**
     * @type {?}
     * @private
     */
    ɵNgSelectMultipleOption.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    ɵNgSelectMultipleOption.prototype._select;
}
export { ɵNgSelectMultipleOption as NgSelectMultipleOption };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X211bHRpcGxlX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBYSxRQUFRLEVBQUUsU0FBUyxFQUFrQixVQUFVLEVBQUUsZUFBZSxJQUFJLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVoSyxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7Ozs7Ozs7Ozs7QUFFakYsTUFBTSxPQUFPLDhCQUE4QixHQUFtQjtJQUM1RCxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0NBQWtDLENBQUM7SUFDakUsS0FBSyxFQUFFLElBQUk7Q0FDWjs7Ozs7O0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxFQUFVLEVBQUUsS0FBVTtJQUMvQyxJQUFJLEVBQUUsSUFBSSxJQUFJO1FBQUUsT0FBTyxHQUFHLEtBQUssRUFBRSxDQUFDO0lBQ2xDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtRQUFFLEtBQUssR0FBRyxJQUFJLEtBQUssR0FBRyxDQUFDO0lBQ3BELElBQUksS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQ3pELE9BQU8sR0FBRyxFQUFFLEtBQUssS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN4QyxDQUFDOzs7OztBQUVELFNBQVMsVUFBVSxDQUFDLFdBQW1CO0lBQ3JDLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxH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RDdFLE9BQU8sRUFBQyx1QkFBdUIsSUFBSSxzQkFBc0IsRUFBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdCwgSW5wdXQsIE9uRGVzdHJveSwgT3B0aW9uYWwsIFJlbmRlcmVyMiwgU3RhdGljUHJvdmlkZXIsIGZvcndhcmRSZWYsIMm1bG9vc2VJZGVudGljYWwgYXMgbG9vc2VJZGVudGljYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcblxuZXhwb3J0IGNvbnN0IFNFTEVDVF9NVUxUSVBMRV9WQUxVRV9BQ0NFU1NPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbmZ1bmN0aW9uIF9idWlsZFZhbHVlU3RyaW5nKGlkOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICBpZiAoaWQgPT0gbnVsbCkgcmV0dXJuIGAke3ZhbHVlfWA7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB2YWx1ZSA9IGAnJHt2YWx1ZX0nYDtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHZhbHVlID0gJ09iamVjdCc7XG4gIHJldHVybiBgJHtpZH06ICR7dmFsdWV9YC5zbGljZSgwLCA1MCk7XG59XG5cbmZ1bmN0aW9uIF9leHRyYWN0SWQodmFsdWVTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZVN0cmluZy5zcGxpdCgnOicpWzBdO1xufVxuXG4vKiogTW9jayBpbnRlcmZhY2UgZm9yIEhUTUwgT3B0aW9ucyAqL1xuaW50ZXJmYWNlIEhUTUxPcHRpb24ge1xuICB2YWx1ZTogc3RyaW5nO1xuICBzZWxlY3RlZDogYm9vbGVhbjtcbn1cblxuLyoqIE1vY2sgaW50ZXJmYWNlIGZvciBIVE1MQ29sbGVjdGlvbiAqL1xuYWJzdHJhY3QgY2xhc3MgSFRNTENvbGxlY3Rpb24ge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgbGVuZ3RoICE6IG51bWJlcjtcbiAgYWJzdHJhY3QgaXRlbShfOiBudW1iZXIpOiBIVE1MT3B0aW9uO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgbXVsdGktc2VsZWN0IGNvbnRyb2wgdmFsdWVzIGFuZCBsaXN0ZW5pbmcgdG8gbXVsdGktc2VsZWN0IGNvbnRyb2xcbiAqIGNoYW5nZXMuIFRoZSB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kIGBOZ01vZGVsYFxuICogZGlyZWN0aXZlcy5cbiAqIFxuICogQHNlZSBgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JgXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIFxuICogIyMjIFVzaW5nIGEgbXVsdGktc2VsZWN0IGNvbnRyb2xcbiAqIFxuICogVGhlIGZvbGxvdyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gdXNlIGEgbXVsdGktc2VsZWN0IGNvbnRyb2wgd2l0aCBhIHJlYWN0aXZlIGZvcm0uXG4gKiBcbiAqIGBgYHRzXG4gKiBjb25zdCBjb3VudHJ5Q29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8c2VsZWN0IG11bHRpcGxlIG5hbWU9XCJjb3VudHJpZXNcIiBbZm9ybUNvbnRyb2xdPVwiY291bnRyeUNvbnRyb2xcIj5cbiAqICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgY291bnRyeSBvZiBjb3VudHJpZXNcIiBbbmdWYWx1ZV09XCJjb3VudHJ5XCI+XG4gKiAgICAge3sgY291bnRyeS5uYW1lIH19XG4gKiAgIDwvb3B0aW9uPlxuICogPC9zZWxlY3Q+XG4gKiBgYGBcbiAqIFxuICogIyMjIEN1c3RvbWl6aW5nIG9wdGlvbiBzZWxlY3Rpb25cbiAqICBcbiAqIFRvIGN1c3RvbWl6ZSB0aGUgZGVmYXVsdCBvcHRpb24gY29tcGFyaXNvbiBhbGdvcml0aG0sIGA8c2VsZWN0PmAgc3VwcG9ydHMgYGNvbXBhcmVXaXRoYCBpbnB1dC5cbiAqIFNlZSB0aGUgYFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3IgdXNhZ2UuXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnc2VsZWN0W211bHRpcGxlXVtmb3JtQ29udHJvbE5hbWVdLHNlbGVjdFttdWx0aXBsZV1bZm9ybUNvbnRyb2xdLHNlbGVjdFttdWx0aXBsZV1bbmdNb2RlbF0nLFxuICBob3N0OiB7JyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQpJywgJyhibHVyKSc6ICdvblRvdWNoZWQoKSd9LFxuICBwcm92aWRlcnM6IFtTRUxFQ1RfTVVMVElQTEVfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGN1cnJlbnQgdmFsdWVcbiAgICovXG4gIHZhbHVlOiBhbnk7XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfb3B0aW9uTWFwOiBNYXA8c3RyaW5nLCDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24+ID0gbmV3IE1hcDxzdHJpbmcsIMm1TmdTZWxlY3RNdWx0aXBsZU9wdGlvbj4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaWRDb3VudGVyOiBudW1iZXIgPSAwO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBjaGFuZ2UgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgYmx1ciBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqL1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgb3B0aW9uIGNvbXBhcmlzb24gYWxnb3JpdGhtIGZvciB0cmFja2luZyBpZGVudGl0aWVzIHdoZW5cbiAgICogY2hlY2tpbmcgZm9yIGNoYW5nZXMuXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgY29tcGFyZVdpdGgoZm46IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBjb21wYXJlV2l0aCBtdXN0IGJlIGEgZnVuY3Rpb24sIGJ1dCByZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KGZuKX1gKTtcbiAgICB9XG4gICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbiA9IGxvb3NlSWRlbnRpY2FsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTZXRzIHRoZSBcInZhbHVlXCIgcHJvcGVydHkgb24gb25lIG9yIG9mIG1vcmVcbiAgICogb2YgdGhlIHNlbGVjdCdzIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICBsZXQgb3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlcjogKG9wdDogybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLCBvOiBhbnkpID0+IHZvaWQ7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAvLyBjb252ZXJ0IHZhbHVlcyB0byBpZHNcbiAgICAgIGNvbnN0IGlkcyA9IHZhbHVlLm1hcCgodikgPT4gdGhpcy5fZ2V0T3B0aW9uSWQodikpO1xuICAgICAgb3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlciA9IChvcHQsIG8pID0+IHsgb3B0Ll9zZXRTZWxlY3RlZChpZHMuaW5kZXhPZihvLnRvU3RyaW5nKCkpID4gLTEpOyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25TZWxlY3RlZFN0YXRlU2V0dGVyID0gKG9wdCwgbykgPT4geyBvcHQuX3NldFNlbGVjdGVkKGZhbHNlKTsgfTtcbiAgICB9XG4gICAgdGhpcy5fb3B0aW9uTWFwLmZvckVhY2gob3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlcik7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXNcbiAgICogYW5kIHdyaXRlcyBhbiBhcnJheSBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSAoXzogYW55KSA9PiB7XG4gICAgICBjb25zdCBzZWxlY3RlZDogQXJyYXk8YW55PiA9IFtdO1xuICAgICAgaWYgKF8uaGFzT3duUHJvcGVydHkoJ3NlbGVjdGVkT3B0aW9ucycpKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEhUTUxDb2xsZWN0aW9uID0gXy5zZWxlY3RlZE9wdGlvbnM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IG9wdDogYW55ID0gb3B0aW9ucy5pdGVtKGkpO1xuICAgICAgICAgIGNvbnN0IHZhbDogYW55ID0gdGhpcy5fZ2V0T3B0aW9uVmFsdWUob3B0LnZhbHVlKTtcbiAgICAgICAgICBzZWxlY3RlZC5wdXNoKHZhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIERlZ3JhZGUgb24gSUVcbiAgICAgIGVsc2Uge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBIVE1MQ29sbGVjdGlvbiA9IDxIVE1MQ29sbGVjdGlvbj5fLm9wdGlvbnM7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IG9wdDogSFRNTE9wdGlvbiA9IG9wdGlvbnMuaXRlbShpKTtcbiAgICAgICAgICBpZiAob3B0LnNlbGVjdGVkKSB7XG4gICAgICAgICAgICBjb25zdCB2YWw6IGFueSA9IHRoaXMuX2dldE9wdGlvblZhbHVlKG9wdC52YWx1ZSk7XG4gICAgICAgICAgICBzZWxlY3RlZC5wdXNoKHZhbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnZhbHVlID0gc2VsZWN0ZWQ7XG4gICAgICBmbihzZWxlY3RlZCk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwiZGlzYWJsZWRcIiBwcm9wZXJ0eSBvbiB0aGUgc2VsZWN0IGlucHV0IGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBpc0Rpc2FibGVkIFRoZSBkaXNhYmxlZCB2YWx1ZVxuICAgKi9cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT3B0aW9uKHZhbHVlOiDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb24pOiBzdHJpbmcge1xuICAgIGNvbnN0IGlkOiBzdHJpbmcgPSAodGhpcy5faWRDb3VudGVyKyspLnRvU3RyaW5nKCk7XG4gICAgdGhpcy5fb3B0aW9uTWFwLnNldChpZCwgdmFsdWUpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldE9wdGlvbklkKHZhbHVlOiBhbnkpOiBzdHJpbmd8bnVsbCB7XG4gICAgZm9yIChjb25zdCBpZCBvZiBBcnJheS5mcm9tKHRoaXMuX29wdGlvbk1hcC5rZXlzKCkpKSB7XG4gICAgICBpZiAodGhpcy5fY29tcGFyZVdpdGgodGhpcy5fb3B0aW9uTWFwLmdldChpZCkgIS5fdmFsdWUsIHZhbHVlKSkgcmV0dXJuIGlkO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldE9wdGlvblZhbHVlKHZhbHVlU3RyaW5nOiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IGlkOiBzdHJpbmcgPSBfZXh0cmFjdElkKHZhbHVlU3RyaW5nKTtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uTWFwLmhhcyhpZCkgPyB0aGlzLl9vcHRpb25NYXAuZ2V0KGlkKSAhLl92YWx1ZSA6IHZhbHVlU3RyaW5nO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBNYXJrcyBgPG9wdGlvbj5gIGFzIGR5bmFtaWMsIHNvIEFuZ3VsYXIgY2FuIGJlIG5vdGlmaWVkIHdoZW4gb3B0aW9ucyBjaGFuZ2UuXG4gKlxuICogQHNlZSBgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvcmBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnb3B0aW9uJ30pXG5leHBvcnQgY2xhc3MgybVOZ1NlbGVjdE11bHRpcGxlT3B0aW9uIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIGlkICE6IHN0cmluZztcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIHByaXZhdGUgX3NlbGVjdDogU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLl9zZWxlY3QuX3JlZ2lzdGVyT3B0aW9uKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSB2YWx1ZSBib3VuZCB0byB0aGUgb3B0aW9uIGVsZW1lbnQuIFVubGlrZSB0aGUgdmFsdWUgYmluZGluZyxcbiAgICogbmdWYWx1ZSBzdXBwb3J0cyBiaW5kaW5nIHRvIG9iamVjdHMuXG4gICAqL1xuICBASW5wdXQoJ25nVmFsdWUnKVxuICBzZXQgbmdWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdCA9PSBudWxsKSByZXR1cm47XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9zZXRFbGVtZW50VmFsdWUoX2J1aWxkVmFsdWVTdHJpbmcodGhpcy5pZCwgdmFsdWUpKTtcbiAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3Mgc2ltcGxlIHN0cmluZyB2YWx1ZXMgYm91bmQgdG8gdGhlIG9wdGlvbiBlbGVtZW50LlxuICAgKiBGb3Igb2JqZWN0cywgdXNlIHRoZSBgbmdWYWx1ZWAgaW5wdXQgYmluZGluZy5cbiAgICovXG4gIEBJbnB1dCgndmFsdWUnKVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9zZXRFbGVtZW50VmFsdWUoX2J1aWxkVmFsdWVTdHJpbmcodGhpcy5pZCwgdmFsdWUpKTtcbiAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0RWxlbWVudFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFNlbGVjdGVkKHNlbGVjdGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc2VsZWN0ZWQnLCBzZWxlY3RlZCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIExpZmVjeWNsZSBtZXRob2QgY2FsbGVkIGJlZm9yZSB0aGUgZGlyZWN0aXZlJ3MgaW5zdGFuY2UgaXMgZGVzdHJveWVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICB0aGlzLl9zZWxlY3QuX29wdGlvbk1hcC5kZWxldGUodGhpcy5pZCk7XG4gICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQge8m1TmdTZWxlY3RNdWx0aXBsZU9wdGlvbiBhcyBOZ1NlbGVjdE11bHRpcGxlT3B0aW9ufTtcbiJdfQ==