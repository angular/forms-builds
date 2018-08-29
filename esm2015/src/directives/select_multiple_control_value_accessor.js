/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Host, Input, Optional, Renderer2, forwardRef, ɵlooseIdentical as looseIdentical } from '@angular/core';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
export const SELECT_MULTIPLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
    multi: true
};
function _buildValueString(id, value) {
    if (id == null)
        return `${value}`;
    if (typeof value === 'string')
        value = `'${value}'`;
    if (value && typeof value === 'object')
        value = 'Object';
    return `${id}: ${value}`.slice(0, 50);
}
function _extractId(valueString) {
    return valueString.split(':')[0];
}
/** Mock interface for HTMLCollection */
class HTMLCollection {
}
/**
 * The accessor for writing a value and listening to changes on a select element.
 *
 *  ### Caveat: Options selection
 *
 * Angular uses object identity to select options. It's possible for the identities of items
 * to change while the data does not. This can happen, for example, if the items are produced
 * from an RPC to the server, and that RPC is re-run. Even if the data hasn't changed, the
 * second response will produce objects with different identities.
 *
 * To customize the default option comparison algorithm, `<select multiple>` supports `compareWith`
 * input. `compareWith` takes a **function** which has two arguments: `option1` and `option2`.
 * If `compareWith` is given, Angular selects options by the return value of the function.
 *
 * #### Syntax
 *
 * ```
 * <select multiple [compareWith]="compareFn"  [(ngModel)]="selectedCountries">
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
 *
 */
let SelectMultipleControlValueAccessor = class SelectMultipleControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this._compareWith = looseIdentical;
    }
    set compareWith(fn) {
        if (typeof fn !== 'function') {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }
    writeValue(value) {
        this.value = value;
        let optionSelectedStateSetter;
        if (Array.isArray(value)) {
            // convert values to ids
            const ids = value.map((v) => this._getOptionId(v));
            optionSelectedStateSetter = (opt, o) => { opt._setSelected(ids.indexOf(o.toString()) > -1); };
        }
        else {
            optionSelectedStateSetter = (opt, o) => { opt._setSelected(false); };
        }
        this._optionMap.forEach(optionSelectedStateSetter);
    }
    registerOnChange(fn) {
        this.onChange = (_) => {
            const selected = [];
            if (_.hasOwnProperty('selectedOptions')) {
                const options = _.selectedOptions;
                for (let i = 0; i < options.length; i++) {
                    const opt = options.item(i);
                    const val = this._getOptionValue(opt.value);
                    selected.push(val);
                }
            }
            // Degrade on IE
            else {
                const options = _.options;
                for (let i = 0; i < options.length; i++) {
                    const opt = options.item(i);
                    if (opt.selected) {
                        const val = this._getOptionValue(opt.value);
                        selected.push(val);
                    }
                }
            }
            this.value = selected;
            fn(selected);
        };
    }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /** @internal */
    _registerOption(value) {
        const id = (this._idCounter++).toString();
        this._optionMap.set(id, value);
        return id;
    }
    /** @internal */
    _getOptionId(value) {
        for (const id of Array.from(this._optionMap.keys())) {
            if (this._compareWith(this._optionMap.get(id)._value, value))
                return id;
        }
        return null;
    }
    /** @internal */
    _getOptionValue(valueString) {
        const id = _extractId(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
    }
};
tslib_1.__decorate([
    Input(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Function])
], SelectMultipleControlValueAccessor.prototype, "compareWith", null);
SelectMultipleControlValueAccessor = tslib_1.__decorate([
    Directive({
        selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
        host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
        providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
    }),
    tslib_1.__metadata("design:paramtypes", [Renderer2, ElementRef])
], SelectMultipleControlValueAccessor);
export { SelectMultipleControlValueAccessor };
/**
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * ### Example
 *
 * ```
 * <select multiple name="city" ngModel>
 *   <option *ngFor="let c of cities" [value]="c"></option>
 * </select>
 * ```
 */
let NgSelectMultipleOption = class NgSelectMultipleOption {
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select) {
            this.id = this._select._registerOption(this);
        }
    }
    set ngValue(value) {
        if (this._select == null)
            return;
        this._value = value;
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }
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
    /** @internal */
    _setElementValue(value) {
        this._renderer.setProperty(this._element.nativeElement, 'value', value);
    }
    /** @internal */
    _setSelected(selected) {
        this._renderer.setProperty(this._element.nativeElement, 'selected', selected);
    }
    ngOnDestroy() {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
};
tslib_1.__decorate([
    Input('ngValue'),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], NgSelectMultipleOption.prototype, "ngValue", null);
tslib_1.__decorate([
    Input('value'),
    tslib_1.__metadata("design:type", Object),
    tslib_1.__metadata("design:paramtypes", [Object])
], NgSelectMultipleOption.prototype, "value", null);
NgSelectMultipleOption = tslib_1.__decorate([
    Directive({ selector: 'option' }),
    tslib_1.__param(2, Optional()), tslib_1.__param(2, Host()),
    tslib_1.__metadata("design:paramtypes", [ElementRef, Renderer2,
        SelectMultipleControlValueAccessor])
], NgSelectMultipleOption);
export { NgSelectMultipleOption };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X211bHRpcGxlX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBYSxRQUFRLEVBQUUsU0FBUyxFQUFrQixVQUFVLEVBQUUsZUFBZSxJQUFJLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVoSyxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFakYsTUFBTSxDQUFDLE1BQU0sOEJBQThCLEdBQW1CO0lBQzVELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FBQztJQUNqRSxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRixTQUFTLGlCQUFpQixDQUFDLEVBQVUsRUFBRSxLQUFVO0lBQy9DLElBQUksRUFBRSxJQUFJLElBQUk7UUFBRSxPQUFPLEdBQUcsS0FBSyxFQUFFLENBQUM7SUFDbEMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO1FBQUUsS0FBSyxHQUFHLElBQUksS0FBSyxHQUFHLENBQUM7SUFDcEQsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtRQUFFLEtBQUssR0FBRyxRQUFRLENBQUM7SUFDekQsT0FBTyxHQUFHLEVBQUUsS0FBSyxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxXQUFtQjtJQUNyQyxPQUFPLFdBQVcsQ0FBQyxLQUFLLENB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QyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQWxDQztJQURDLEtBQUssQ0FBQyxTQUFTLENBQUM7OztxREFNaEI7QUFHRDtJQURDLEtBQUssQ0FBQyxPQUFPLENBQUM7OzttREFTZDtBQS9CVSxzQkFBc0I7SUFEbEMsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxDQUFDO0lBU3pCLG1CQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsbUJBQUEsSUFBSSxFQUFFLENBQUE7NkNBREQsVUFBVSxFQUFxQixTQUFTO1FBQ3JCLGtDQUFrQztHQVJoRSxzQkFBc0IsQ0FpRGxDO1NBakRZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEhvc3QsIElucHV0LCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBSZW5kZXJlcjIsIFN0YXRpY1Byb3ZpZGVyLCBmb3J3YXJkUmVmLCDJtWxvb3NlSWRlbnRpY2FsIGFzIGxvb3NlSWRlbnRpY2FsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5cbmV4cG9ydCBjb25zdCBTRUxFQ1RfTVVMVElQTEVfVkFMVUVfQUNDRVNTT1I6IFN0YXRpY1Byb3ZpZGVyID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBfYnVpbGRWYWx1ZVN0cmluZyhpZDogc3RyaW5nLCB2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgaWYgKGlkID09IG51bGwpIHJldHVybiBgJHt2YWx1ZX1gO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykgdmFsdWUgPSBgJyR7dmFsdWV9J2A7XG4gIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB2YWx1ZSA9ICdPYmplY3QnO1xuICByZXR1cm4gYCR7aWR9OiAke3ZhbHVlfWAuc2xpY2UoMCwgNTApO1xufVxuXG5mdW5jdGlvbiBfZXh0cmFjdElkKHZhbHVlU3RyaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdmFsdWVTdHJpbmcuc3BsaXQoJzonKVswXTtcbn1cblxuLyoqIE1vY2sgaW50ZXJmYWNlIGZvciBIVE1MIE9wdGlvbnMgKi9cbmludGVyZmFjZSBIVE1MT3B0aW9uIHtcbiAgdmFsdWU6IHN0cmluZztcbiAgc2VsZWN0ZWQ6IGJvb2xlYW47XG59XG5cbi8qKiBNb2NrIGludGVyZmFjZSBmb3IgSFRNTENvbGxlY3Rpb24gKi9cbmFic3RyYWN0IGNsYXNzIEhUTUxDb2xsZWN0aW9uIHtcbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIGxlbmd0aCAhOiBudW1iZXI7XG4gIGFic3RyYWN0IGl0ZW0oXzogbnVtYmVyKTogSFRNTE9wdGlvbjtcbn1cblxuLyoqXG4gKiBUaGUgYWNjZXNzb3IgZm9yIHdyaXRpbmcgYSB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIGNoYW5nZXMgb24gYSBzZWxlY3QgZWxlbWVudC5cbiAqXG4gKiAgIyMjIENhdmVhdDogT3B0aW9ucyBzZWxlY3Rpb25cbiAqXG4gKiBBbmd1bGFyIHVzZXMgb2JqZWN0IGlkZW50aXR5IHRvIHNlbGVjdCBvcHRpb25zLiBJdCdzIHBvc3NpYmxlIGZvciB0aGUgaWRlbnRpdGllcyBvZiBpdGVtc1xuICogdG8gY2hhbmdlIHdoaWxlIHRoZSBkYXRhIGRvZXMgbm90LiBUaGlzIGNhbiBoYXBwZW4sIGZvciBleGFtcGxlLCBpZiB0aGUgaXRlbXMgYXJlIHByb2R1Y2VkXG4gKiBmcm9tIGFuIFJQQyB0byB0aGUgc2VydmVyLCBhbmQgdGhhdCBSUEMgaXMgcmUtcnVuLiBFdmVuIGlmIHRoZSBkYXRhIGhhc24ndCBjaGFuZ2VkLCB0aGVcbiAqIHNlY29uZCByZXNwb25zZSB3aWxsIHByb2R1Y2Ugb2JqZWN0cyB3aXRoIGRpZmZlcmVudCBpZGVudGl0aWVzLlxuICpcbiAqIFRvIGN1c3RvbWl6ZSB0aGUgZGVmYXVsdCBvcHRpb24gY29tcGFyaXNvbiBhbGdvcml0aG0sIGA8c2VsZWN0IG11bHRpcGxlPmAgc3VwcG9ydHMgYGNvbXBhcmVXaXRoYFxuICogaW5wdXQuIGBjb21wYXJlV2l0aGAgdGFrZXMgYSAqKmZ1bmN0aW9uKiogd2hpY2ggaGFzIHR3byBhcmd1bWVudHM6IGBvcHRpb24xYCBhbmQgYG9wdGlvbjJgLlxuICogSWYgYGNvbXBhcmVXaXRoYCBpcyBnaXZlbiwgQW5ndWxhciBzZWxlY3RzIG9wdGlvbnMgYnkgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24uXG4gKlxuICogIyMjIyBTeW50YXhcbiAqXG4gKiBgYGBcbiAqIDxzZWxlY3QgbXVsdGlwbGUgW2NvbXBhcmVXaXRoXT1cImNvbXBhcmVGblwiICBbKG5nTW9kZWwpXT1cInNlbGVjdGVkQ291bnRyaWVzXCI+XG4gKiAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgY291bnRyeSBvZiBjb3VudHJpZXNcIiBbbmdWYWx1ZV09XCJjb3VudHJ5XCI+XG4gKiAgICAgICAgIHt7Y291bnRyeS5uYW1lfX1cbiAqICAgICA8L29wdGlvbj5cbiAqIDwvc2VsZWN0PlxuICpcbiAqIGNvbXBhcmVGbihjMTogQ291bnRyeSwgYzI6IENvdW50cnkpOiBib29sZWFuIHtcbiAqICAgICByZXR1cm4gYzEgJiYgYzIgPyBjMS5pZCA9PT0gYzIuaWQgOiBjMSA9PT0gYzI7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnc2VsZWN0W211bHRpcGxlXVtmb3JtQ29udHJvbE5hbWVdLHNlbGVjdFttdWx0aXBsZV1bZm9ybUNvbnRyb2xdLHNlbGVjdFttdWx0aXBsZV1bbmdNb2RlbF0nLFxuICBob3N0OiB7JyhjaGFuZ2UpJzogJ29uQ2hhbmdlKCRldmVudC50YXJnZXQpJywgJyhibHVyKSc6ICdvblRvdWNoZWQoKSd9LFxuICBwcm92aWRlcnM6IFtTRUxFQ1RfTVVMVElQTEVfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHZhbHVlOiBhbnk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX29wdGlvbk1hcDogTWFwPHN0cmluZywgTmdTZWxlY3RNdWx0aXBsZU9wdGlvbj4gPSBuZXcgTWFwPHN0cmluZywgTmdTZWxlY3RNdWx0aXBsZU9wdGlvbj4oKTtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaWRDb3VudGVyOiBudW1iZXIgPSAwO1xuXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIEBJbnB1dCgpXG4gIHNldCBjb21wYXJlV2l0aChmbjogKG8xOiBhbnksIG8yOiBhbnkpID0+IGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIGZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGNvbXBhcmVXaXRoIG11c3QgYmUgYSBmdW5jdGlvbiwgYnV0IHJlY2VpdmVkICR7SlNPTi5zdHJpbmdpZnkoZm4pfWApO1xuICAgIH1cbiAgICB0aGlzLl9jb21wYXJlV2l0aCA9IGZuO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcGFyZVdpdGg6IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuID0gbG9vc2VJZGVudGljYWw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgbGV0IG9wdGlvblNlbGVjdGVkU3RhdGVTZXR0ZXI6IChvcHQ6IE5nU2VsZWN0TXVsdGlwbGVPcHRpb24sIG86IGFueSkgPT4gdm9pZDtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIC8vIGNvbnZlcnQgdmFsdWVzIHRvIGlkc1xuICAgICAgY29uc3QgaWRzID0gdmFsdWUubWFwKCh2KSA9PiB0aGlzLl9nZXRPcHRpb25JZCh2KSk7XG4gICAgICBvcHRpb25TZWxlY3RlZFN0YXRlU2V0dGVyID0gKG9wdCwgbykgPT4geyBvcHQuX3NldFNlbGVjdGVkKGlkcy5pbmRleE9mKG8udG9TdHJpbmcoKSkgPiAtMSk7IH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvblNlbGVjdGVkU3RhdGVTZXR0ZXIgPSAob3B0LCBvKSA9PiB7IG9wdC5fc2V0U2VsZWN0ZWQoZmFsc2UpOyB9O1xuICAgIH1cbiAgICB0aGlzLl9vcHRpb25NYXAuZm9yRWFjaChvcHRpb25TZWxlY3RlZFN0YXRlU2V0dGVyKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gKF86IGFueSkgPT4ge1xuICAgICAgY29uc3Qgc2VsZWN0ZWQ6IEFycmF5PGFueT4gPSBbXTtcbiAgICAgIGlmIChfLmhhc093blByb3BlcnR5KCdzZWxlY3RlZE9wdGlvbnMnKSkge1xuICAgICAgICBjb25zdCBvcHRpb25zOiBIVE1MQ29sbGVjdGlvbiA9IF8uc2VsZWN0ZWRPcHRpb25zO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBvcHQ6IGFueSA9IG9wdGlvbnMuaXRlbShpKTtcbiAgICAgICAgICBjb25zdCB2YWw6IGFueSA9IHRoaXMuX2dldE9wdGlvblZhbHVlKG9wdC52YWx1ZSk7XG4gICAgICAgICAgc2VsZWN0ZWQucHVzaCh2YWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBEZWdyYWRlIG9uIElFXG4gICAgICBlbHNlIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogSFRNTENvbGxlY3Rpb24gPSA8SFRNTENvbGxlY3Rpb24+Xy5vcHRpb25zO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBvcHQ6IEhUTUxPcHRpb24gPSBvcHRpb25zLml0ZW0oaSk7XG4gICAgICAgICAgaWYgKG9wdC5zZWxlY3RlZCkge1xuICAgICAgICAgICAgY29uc3QgdmFsOiBhbnkgPSB0aGlzLl9nZXRPcHRpb25WYWx1ZShvcHQudmFsdWUpO1xuICAgICAgICAgICAgc2VsZWN0ZWQucHVzaCh2YWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy52YWx1ZSA9IHNlbGVjdGVkO1xuICAgICAgZm4oc2VsZWN0ZWQpO1xuICAgIH07XG4gIH1cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3JlZ2lzdGVyT3B0aW9uKHZhbHVlOiBOZ1NlbGVjdE11bHRpcGxlT3B0aW9uKTogc3RyaW5nIHtcbiAgICBjb25zdCBpZDogc3RyaW5nID0gKHRoaXMuX2lkQ291bnRlcisrKS50b1N0cmluZygpO1xuICAgIHRoaXMuX29wdGlvbk1hcC5zZXQoaWQsIHZhbHVlKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRPcHRpb25JZCh2YWx1ZTogYW55KTogc3RyaW5nfG51bGwge1xuICAgIGZvciAoY29uc3QgaWQgb2YgQXJyYXkuZnJvbSh0aGlzLl9vcHRpb25NYXAua2V5cygpKSkge1xuICAgICAgaWYgKHRoaXMuX2NvbXBhcmVXaXRoKHRoaXMuX29wdGlvbk1hcC5nZXQoaWQpICEuX3ZhbHVlLCB2YWx1ZSkpIHJldHVybiBpZDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9nZXRPcHRpb25WYWx1ZSh2YWx1ZVN0cmluZzogc3RyaW5nKTogYW55IHtcbiAgICBjb25zdCBpZDogc3RyaW5nID0gX2V4dHJhY3RJZCh2YWx1ZVN0cmluZyk7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbk1hcC5oYXMoaWQpID8gdGhpcy5fb3B0aW9uTWFwLmdldChpZCkgIS5fdmFsdWUgOiB2YWx1ZVN0cmluZztcbiAgfVxufVxuXG4vKipcbiAqIE1hcmtzIGA8b3B0aW9uPmAgYXMgZHluYW1pYywgc28gQW5ndWxhciBjYW4gYmUgbm90aWZpZWQgd2hlbiBvcHRpb25zIGNoYW5nZS5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPHNlbGVjdCBtdWx0aXBsZSBuYW1lPVwiY2l0eVwiIG5nTW9kZWw+XG4gKiAgIDxvcHRpb24gKm5nRm9yPVwibGV0IGMgb2YgY2l0aWVzXCIgW3ZhbHVlXT1cImNcIj48L29wdGlvbj5cbiAqIDwvc2VsZWN0PlxuICogYGBgXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnb3B0aW9uJ30pXG5leHBvcnQgY2xhc3MgTmdTZWxlY3RNdWx0aXBsZU9wdGlvbiBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBpZCAhOiBzdHJpbmc7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3ZhbHVlOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgICAgQE9wdGlvbmFsKCkgQEhvc3QoKSBwcml2YXRlIF9zZWxlY3Q6IFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5fc2VsZWN0Ll9yZWdpc3Rlck9wdGlvbih0aGlzKTtcbiAgICB9XG4gIH1cblxuICBASW5wdXQoJ25nVmFsdWUnKVxuICBzZXQgbmdWYWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdCA9PSBudWxsKSByZXR1cm47XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLl9zZXRFbGVtZW50VmFsdWUoX2J1aWxkVmFsdWVTdHJpbmcodGhpcy5pZCwgdmFsdWUpKTtcbiAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICB9XG5cbiAgQElucHV0KCd2YWx1ZScpXG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdCkge1xuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZShfYnVpbGRWYWx1ZVN0cmluZyh0aGlzLmlkLCB2YWx1ZSkpO1xuICAgICAgdGhpcy5fc2VsZWN0LndyaXRlVmFsdWUodGhpcy5fc2VsZWN0LnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9zZXRFbGVtZW50VmFsdWUodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgdmFsdWUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0U2VsZWN0ZWQoc2VsZWN0ZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzZWxlY3RlZCcsIHNlbGVjdGVkKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgIHRoaXMuX3NlbGVjdC5fb3B0aW9uTWFwLmRlbGV0ZSh0aGlzLmlkKTtcbiAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=