import { Directive, ElementRef, Host, Input, Optional, Renderer2, forwardRef, ɵlooseIdentical as looseIdentical } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import * as i0 from "@angular/core";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
export const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectControlValueAccessor),
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
 * \@description
 *
 * Writes values and listens to changes on a select element.
 *
 * Used by `NgModel`, `FormControlDirective`, and `FormControlName`
 * to keep the view synced with the `FormControl` model.
 *
 * If you have imported the `FormsModule` or the `ReactiveFormsModule`, this
 * value accessor will be active on any select control that has a form directive. You do
 * **not** need to add a special selector to activate it.
 *
 * \@usageNotes
 * ### How to use select controls with form directives
 *
 * To use a select in a template-driven form, simply add an `ngModel` and a `name`
 * attribute to the main `<select>` tag.
 *
 * If your option values are simple strings, you can bind to the normal `value` property
 * on the option.  If your option values happen to be objects (and you'd like to save the
 * selection in your form as an object), use `ngValue` instead:
 *
 * {\@example forms/ts/selectControl/select_control_example.ts region='Component'}
 *
 * In reactive forms, you'll also want to add your form directive (`formControlName` or
 * `formControl`) on the main `<select>` tag. Like in the former example, you have the
 * choice of binding to the  `value` or `ngValue` property on the select's options.
 *
 * {\@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
 *
 * ### Caveat: Option selection
 *
 * Angular uses object identity to select option. It's possible for the identities of items
 * to change while the data does not. This can happen, for example, if the items are produced
 * from an RPC to the server, and that RPC is re-run. Even if the data hasn't changed, the
 * second response will produce objects with different identities.
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * `compareWith` takes a **function** which has two arguments: `option1` and `option2`.
 * If `compareWith` is given, Angular selects option by the return value of the function.
 *
 * ### Syntax
 *
 * ```
 * <select [compareWith]="compareFn"  [(ngModel)]="selectedCountries">
 *     <option *ngFor="let country of countries" [ngValue]="country">
 *         {{country.name}}
 *     </option>
 * </select>
 *
 * compareFn(c1: Country, c2: Country): boolean {
 *     return c1 && c2 ? c1.id === c2.id : c1 === c2;
 * }
 * ```
 *
 * Note: We listen to the 'change' event because 'input' events aren't fired
 * for selects in Firefox and IE:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1024350
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4660045/
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
export class SelectControlValueAccessor {
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
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this._compareWith = looseIdentical;
    }
    /**
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
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.value = value;
        /** @type {?} */
        const id = this._getOptionId(value);
        if (id == null) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'selectedIndex', -1);
        }
        /** @type {?} */
        const valueString = _buildValueString(id, value);
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', valueString);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChange = (valueString) => {
            this.value = this._getOptionValue(valueString);
            fn(this.value);
        };
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * \@internal
     * @return {?}
     */
    _registerOption() { return (this._idCounter++).toString(); }
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _getOptionId(value) {
        for (const id of Array.from(this._optionMap.keys())) {
            if (this._compareWith(this._optionMap.get(id), value))
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
        return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
    }
}
SelectControlValueAccessor.decorators = [
    { type: Directive, args: [{
                selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
                host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                providers: [SELECT_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
SelectControlValueAccessor.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
SelectControlValueAccessor.propDecorators = {
    compareWith: [{ type: Input }]
};
SelectControlValueAccessor.ngDirectiveDef = i0.ɵdefineDirective({ type: SelectControlValueAccessor, selectors: [["select", "formControlName", "", 3, "multiple", ""], ["select", "formControl", "", 3, "multiple", ""], ["select", "ngModel", "", 3, "multiple", ""]], factory: function SelectControlValueAccessor_Factory(t) { return new (t || SelectControlValueAccessor)(i0.ɵdirectiveInject(Renderer2), i0.ɵdirectiveInject(ElementRef)); }, hostBindings: function SelectControlValueAccessor_HostBindings(dirIndex, elIndex) { i0.ɵlistener("change", function SelectControlValueAccessor_change_HostBindingHandler($event) { const pd_b = (i0.ɵload(dirIndex).onChange($event.target.value) !== false); return pd_b; }); i0.ɵlistener("blur", function SelectControlValueAccessor_blur_HostBindingHandler($event) { const pd_b = (i0.ɵload(dirIndex).onTouched() !== false); return pd_b; }); }, inputs: { compareWith: "compareWith" }, features: [i0.ɵPublicFeature] });
if (false) {
    /** @type {?} */
    SelectControlValueAccessor.prototype.value;
    /**
     * \@internal
     * @type {?}
     */
    SelectControlValueAccessor.prototype._optionMap;
    /**
     * \@internal
     * @type {?}
     */
    SelectControlValueAccessor.prototype._idCounter;
    /** @type {?} */
    SelectControlValueAccessor.prototype.onChange;
    /** @type {?} */
    SelectControlValueAccessor.prototype.onTouched;
    /** @type {?} */
    SelectControlValueAccessor.prototype._compareWith;
    /** @type {?} */
    SelectControlValueAccessor.prototype._renderer;
    /** @type {?} */
    SelectControlValueAccessor.prototype._elementRef;
}
/**
 * \@description
 *
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * See docs for `SelectControlValueAccessor` for usage examples.
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
 */
export class NgSelectOption {
    /**
     * @param {?} _element
     * @param {?} _renderer
     * @param {?} _select
     */
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select)
            this.id = this._select._registerOption();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set ngValue(value) {
        if (this._select == null)
            return;
        this._select._optionMap.set(this.id, value);
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        this._setElementValue(value);
        if (this._select)
            this._select.writeValue(this._select.value);
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
     * @return {?}
     */
    ngOnDestroy() {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
}
NgSelectOption.decorators = [
    { type: Directive, args: [{ selector: 'option' },] },
];
/** @nocollapse */
NgSelectOption.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: SelectControlValueAccessor, decorators: [{ type: Optional }, { type: Host }] }
];
NgSelectOption.propDecorators = {
    ngValue: [{ type: Input, args: ['ngValue',] }],
    value: [{ type: Input, args: ['value',] }]
};
NgSelectOption.ngDirectiveDef = i0.ɵdefineDirective({ type: NgSelectOption, selectors: [["option"]], factory: function NgSelectOption_Factory(t) { return new (t || NgSelectOption)(i0.ɵdirectiveInject(ElementRef), i0.ɵdirectiveInject(Renderer2), i0.ɵdirectiveInject(SelectControlValueAccessor, 9)); }, inputs: { ngValue: "ngValue", value: "value" }, features: [i0.ɵPublicFeature] });
if (false) {
    /** @type {?} */
    NgSelectOption.prototype.id;
    /** @type {?} */
    NgSelectOption.prototype._element;
    /** @type {?} */
    NgSelectOption.prototype._renderer;
    /** @type {?} */
    NgSelectOption.prototype._select;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9zZWxlY3RfY29udHJvbF92YWx1ZV9hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFhLFFBQVEsRUFBRSxTQUFTLEVBQWtCLFVBQVUsRUFBRSxlQUFlLElBQUksY0FBYyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWhLLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFFakYsYUFBYSxxQkFBcUIsR0FBbUI7SUFDbkQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLDBCQUEwQixDQUFDO0lBQ3pELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQzs7Ozs7O0FBRUYsU0FBUyxpQkFBaUIsQ0FBQyxFQUFpQixFQUFFLEtBQVU7SUFDdEQsSUFBSSxFQUFFLElBQUksSUFBSTtRQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUUsQ0FBQztJQUNsQyxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO1FBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQztJQUN6RCxPQUFPLEdBQUcsRUFBRSxLQUFLLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDdkM7Ozs7O0FBRUQsU0FBUyxVQUFVLENBQUMsV0FBbUI7SUFDckMsT0FBTyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QU87WUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQy9EOzs7Ozs7SUFHRCxnQkFBZ0IsQ0FBQyxLQUFhO1FBQzVCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN6RTs7OztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdDO0tBQ0Y7OztZQW5DRixTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDOzs7O1lBaktaLFVBQVU7WUFBb0MsU0FBUztZQXdLL0IsMEJBQTBCLHVCQUE5RCxRQUFRLFlBQUksSUFBSTs7O3NCQUlwQixLQUFLLFNBQUMsU0FBUztvQkFRZixLQUFLLFNBQUMsT0FBTzs7NERBbEJILGNBQWMsMEZBQWQsY0FBYyxzQkFLSCxVQUFVLHVCQUFxQixTQUFTLHVCQUNyQiwwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0LCBJbnB1dCwgT25EZXN0cm95LCBPcHRpb25hbCwgUmVuZGVyZXIyLCBTdGF0aWNQcm92aWRlciwgZm9yd2FyZFJlZiwgybVsb29zZUlkZW50aWNhbCBhcyBsb29zZUlkZW50aWNhbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuXG5leHBvcnQgY29uc3QgU0VMRUNUX1ZBTFVFX0FDQ0VTU09SOiBTdGF0aWNQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbmZ1bmN0aW9uIF9idWlsZFZhbHVlU3RyaW5nKGlkOiBzdHJpbmcgfCBudWxsLCB2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgaWYgKGlkID09IG51bGwpIHJldHVybiBgJHt2YWx1ZX1gO1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JykgdmFsdWUgPSAnT2JqZWN0JztcbiAgcmV0dXJuIGAke2lkfTogJHt2YWx1ZX1gLnNsaWNlKDAsIDUwKTtcbn1cblxuZnVuY3Rpb24gX2V4dHJhY3RJZCh2YWx1ZVN0cmluZzogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHZhbHVlU3RyaW5nLnNwbGl0KCc6JylbMF07XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogV3JpdGVzIHZhbHVlcyBhbmQgbGlzdGVucyB0byBjaGFuZ2VzIG9uIGEgc2VsZWN0IGVsZW1lbnQuXG4gKlxuICogVXNlZCBieSBgTmdNb2RlbGAsIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGFuZCBgRm9ybUNvbnRyb2xOYW1lYFxuICogdG8ga2VlcCB0aGUgdmlldyBzeW5jZWQgd2l0aCB0aGUgYEZvcm1Db250cm9sYCBtb2RlbC5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBpbXBvcnRlZCB0aGUgYEZvcm1zTW9kdWxlYCBvciB0aGUgYFJlYWN0aXZlRm9ybXNNb2R1bGVgLCB0aGlzXG4gKiB2YWx1ZSBhY2Nlc3NvciB3aWxsIGJlIGFjdGl2ZSBvbiBhbnkgc2VsZWN0IGNvbnRyb2wgdGhhdCBoYXMgYSBmb3JtIGRpcmVjdGl2ZS4gWW91IGRvXG4gKiAqKm5vdCoqIG5lZWQgdG8gYWRkIGEgc3BlY2lhbCBzZWxlY3RvciB0byBhY3RpdmF0ZSBpdC5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIEhvdyB0byB1c2Ugc2VsZWN0IGNvbnRyb2xzIHdpdGggZm9ybSBkaXJlY3RpdmVzXG4gKlxuICogVG8gdXNlIGEgc2VsZWN0IGluIGEgdGVtcGxhdGUtZHJpdmVuIGZvcm0sIHNpbXBseSBhZGQgYW4gYG5nTW9kZWxgIGFuZCBhIGBuYW1lYFxuICogYXR0cmlidXRlIHRvIHRoZSBtYWluIGA8c2VsZWN0PmAgdGFnLlxuICpcbiAqIElmIHlvdXIgb3B0aW9uIHZhbHVlcyBhcmUgc2ltcGxlIHN0cmluZ3MsIHlvdSBjYW4gYmluZCB0byB0aGUgbm9ybWFsIGB2YWx1ZWAgcHJvcGVydHlcbiAqIG9uIHRoZSBvcHRpb24uICBJZiB5b3VyIG9wdGlvbiB2YWx1ZXMgaGFwcGVuIHRvIGJlIG9iamVjdHMgKGFuZCB5b3UnZCBsaWtlIHRvIHNhdmUgdGhlXG4gKiBzZWxlY3Rpb24gaW4geW91ciBmb3JtIGFzIGFuIG9iamVjdCksIHVzZSBgbmdWYWx1ZWAgaW5zdGVhZDpcbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2VsZWN0Q29udHJvbC9zZWxlY3RfY29udHJvbF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBJbiByZWFjdGl2ZSBmb3JtcywgeW91J2xsIGFsc28gd2FudCB0byBhZGQgeW91ciBmb3JtIGRpcmVjdGl2ZSAoYGZvcm1Db250cm9sTmFtZWAgb3JcbiAqIGBmb3JtQ29udHJvbGApIG9uIHRoZSBtYWluIGA8c2VsZWN0PmAgdGFnLiBMaWtlIGluIHRoZSBmb3JtZXIgZXhhbXBsZSwgeW91IGhhdmUgdGhlXG4gKiBjaG9pY2Ugb2YgYmluZGluZyB0byB0aGUgIGB2YWx1ZWAgb3IgYG5nVmFsdWVgIHByb3BlcnR5IG9uIHRoZSBzZWxlY3QncyBvcHRpb25zLlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9yZWFjdGl2ZVNlbGVjdENvbnRyb2wvcmVhY3RpdmVfc2VsZWN0X2NvbnRyb2xfZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogIyMjIENhdmVhdDogT3B0aW9uIHNlbGVjdGlvblxuICpcbiAqIEFuZ3VsYXIgdXNlcyBvYmplY3QgaWRlbnRpdHkgdG8gc2VsZWN0IG9wdGlvbi4gSXQncyBwb3NzaWJsZSBmb3IgdGhlIGlkZW50aXRpZXMgb2YgaXRlbXNcbiAqIHRvIGNoYW5nZSB3aGlsZSB0aGUgZGF0YSBkb2VzIG5vdC4gVGhpcyBjYW4gaGFwcGVuLCBmb3IgZXhhbXBsZSwgaWYgdGhlIGl0ZW1zIGFyZSBwcm9kdWNlZFxuICogZnJvbSBhbiBSUEMgdG8gdGhlIHNlcnZlciwgYW5kIHRoYXQgUlBDIGlzIHJlLXJ1bi4gRXZlbiBpZiB0aGUgZGF0YSBoYXNuJ3QgY2hhbmdlZCwgdGhlXG4gKiBzZWNvbmQgcmVzcG9uc2Ugd2lsbCBwcm9kdWNlIG9iamVjdHMgd2l0aCBkaWZmZXJlbnQgaWRlbnRpdGllcy5cbiAqXG4gKiBUbyBjdXN0b21pemUgdGhlIGRlZmF1bHQgb3B0aW9uIGNvbXBhcmlzb24gYWxnb3JpdGhtLCBgPHNlbGVjdD5gIHN1cHBvcnRzIGBjb21wYXJlV2l0aGAgaW5wdXQuXG4gKiBgY29tcGFyZVdpdGhgIHRha2VzIGEgKipmdW5jdGlvbioqIHdoaWNoIGhhcyB0d28gYXJndW1lbnRzOiBgb3B0aW9uMWAgYW5kIGBvcHRpb24yYC5cbiAqIElmIGBjb21wYXJlV2l0aGAgaXMgZ2l2ZW4sIEFuZ3VsYXIgc2VsZWN0cyBvcHRpb24gYnkgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24uXG4gKlxuICogIyMjIFN5bnRheFxuICpcbiAqIGBgYFxuICogPHNlbGVjdCBbY29tcGFyZVdpdGhdPVwiY29tcGFyZUZuXCIgIFsobmdNb2RlbCldPVwic2VsZWN0ZWRDb3VudHJpZXNcIj5cbiAqICAgICA8b3B0aW9uICpuZ0Zvcj1cImxldCBjb3VudHJ5IG9mIGNvdW50cmllc1wiIFtuZ1ZhbHVlXT1cImNvdW50cnlcIj5cbiAqICAgICAgICAge3tjb3VudHJ5Lm5hbWV9fVxuICogICAgIDwvb3B0aW9uPlxuICogPC9zZWxlY3Q+XG4gKlxuICogY29tcGFyZUZuKGMxOiBDb3VudHJ5LCBjMjogQ291bnRyeSk6IGJvb2xlYW4ge1xuICogICAgIHJldHVybiBjMSAmJiBjMiA/IGMxLmlkID09PSBjMi5pZCA6IGMxID09PSBjMjtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIE5vdGU6IFdlIGxpc3RlbiB0byB0aGUgJ2NoYW5nZScgZXZlbnQgYmVjYXVzZSAnaW5wdXQnIGV2ZW50cyBhcmVuJ3QgZmlyZWRcbiAqIGZvciBzZWxlY3RzIGluIEZpcmVmb3ggYW5kIElFOlxuICogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTAyNDM1MFxuICogaHR0cHM6Ly9kZXZlbG9wZXIubWljcm9zb2Z0LmNvbS9lbi11cy9taWNyb3NvZnQtZWRnZS9wbGF0Zm9ybS9pc3N1ZXMvNDY2MDA0NS9cbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdzZWxlY3Q6bm90KFttdWx0aXBsZV0pW2Zvcm1Db250cm9sTmFtZV0sc2VsZWN0Om5vdChbbXVsdGlwbGVdKVtmb3JtQ29udHJvbF0sc2VsZWN0Om5vdChbbXVsdGlwbGVdKVtuZ01vZGVsXScsXG4gIGhvc3Q6IHsnKGNoYW5nZSknOiAnb25DaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknLCAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJ30sXG4gIHByb3ZpZGVyczogW1NFTEVDVF9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHZhbHVlOiBhbnk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29wdGlvbk1hcDogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXA8c3RyaW5nLCBhbnk+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lkQ291bnRlcjogbnVtYmVyID0gMDtcblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBASW5wdXQoKVxuICBzZXQgY29tcGFyZVdpdGgoZm46IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBjb21wYXJlV2l0aCBtdXN0IGJlIGEgZnVuY3Rpb24sIGJ1dCByZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KGZuKX1gKTtcbiAgICB9XG4gICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbiA9IGxvb3NlSWRlbnRpY2FsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIGNvbnN0IGlkOiBzdHJpbmd8bnVsbCA9IHRoaXMuX2dldE9wdGlvbklkKHZhbHVlKTtcbiAgICBpZiAoaWQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnc2VsZWN0ZWRJbmRleCcsIC0xKTtcbiAgICB9XG4gICAgY29uc3QgdmFsdWVTdHJpbmcgPSBfYnVpbGRWYWx1ZVN0cmluZyhpZCwgdmFsdWUpO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWVTdHJpbmcpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSAodmFsdWVTdHJpbmc6IHN0cmluZykgPT4ge1xuICAgICAgdGhpcy52YWx1ZSA9IHRoaXMuX2dldE9wdGlvblZhbHVlKHZhbHVlU3RyaW5nKTtcbiAgICAgIGZuKHRoaXMudmFsdWUpO1xuICAgIH07XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT3B0aW9uKCk6IHN0cmluZyB7IHJldHVybiAodGhpcy5faWRDb3VudGVyKyspLnRvU3RyaW5nKCk7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRPcHRpb25JZCh2YWx1ZTogYW55KTogc3RyaW5nfG51bGwge1xuICAgIGZvciAoY29uc3QgaWQgb2YgQXJyYXkuZnJvbSh0aGlzLl9vcHRpb25NYXAua2V5cygpKSkge1xuICAgICAgaWYgKHRoaXMuX2NvbXBhcmVXaXRoKHRoaXMuX29wdGlvbk1hcC5nZXQoaWQpLCB2YWx1ZSkpIHJldHVybiBpZDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRPcHRpb25WYWx1ZSh2YWx1ZVN0cmluZzogc3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBpZDogc3RyaW5nID0gX2V4dHJhY3RJZCh2YWx1ZVN0cmluZyk7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbk1hcC5oYXMoaWQpID8gdGhpcy5fb3B0aW9uTWFwLmdldChpZCkgOiB2YWx1ZVN0cmluZztcbiAgfVxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIE1hcmtzIGA8b3B0aW9uPmAgYXMgZHluYW1pYywgc28gQW5ndWxhciBjYW4gYmUgbm90aWZpZWQgd2hlbiBvcHRpb25zIGNoYW5nZS5cbiAqXG4gKiBTZWUgZG9jcyBmb3IgYFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3IgdXNhZ2UgZXhhbXBsZXMuXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ29wdGlvbid9KVxuZXhwb3J0IGNsYXNzIE5nU2VsZWN0T3B0aW9uIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIGlkICE6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIHByaXZhdGUgX3NlbGVjdDogU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0KSB0aGlzLmlkID0gdGhpcy5fc2VsZWN0Ll9yZWdpc3Rlck9wdGlvbigpO1xuICB9XG5cbiAgQElucHV0KCduZ1ZhbHVlJylcbiAgc2V0IG5nVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl9zZWxlY3QgPT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMuX3NlbGVjdC5fb3B0aW9uTWFwLnNldCh0aGlzLmlkLCB2YWx1ZSk7XG4gICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKF9idWlsZFZhbHVlU3RyaW5nKHRoaXMuaWQsIHZhbHVlKSk7XG4gICAgdGhpcy5fc2VsZWN0LndyaXRlVmFsdWUodGhpcy5fc2VsZWN0LnZhbHVlKTtcbiAgfVxuXG4gIEBJbnB1dCgndmFsdWUnKVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuX3NlbGVjdCkgdGhpcy5fc2VsZWN0LndyaXRlVmFsdWUodGhpcy5fc2VsZWN0LnZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB2YWx1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICB0aGlzLl9zZWxlY3QuX29wdGlvbk1hcC5kZWxldGUodGhpcy5pZCk7XG4gICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19