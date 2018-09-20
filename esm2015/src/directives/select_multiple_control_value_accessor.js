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
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
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
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0X211bHRpcGxlX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBYSxRQUFRLEVBQUUsU0FBUyxFQUFrQixVQUFVLEVBQUUsZUFBZSxJQUFJLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVoSyxPQUFPLEVBQXVCLGlCQUFpQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFakYsTUFBTSxDQUFDLE1BQU0sOEJBQThCLEdBQW1CO0lBQzVELE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQ0FBa0MsQ0FBQztJQUNqRSxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRiwyQkFBMkIsRUFBVSxFQUFFLEtBQVU7SUFDL0MsSUFBSSxFQUFFLElBQUksSUFBSTtRQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUUsQ0FBQztJQUNsQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7UUFBRSxLQUFLLEdBQUcsSUFBSSxLQUFLLEdBQUcsQ0FBQztJQUNwRCxJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRO1FBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQztJQUN6RCxPQUFPLEdBQUcsRUFBRSxLQUFLLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVELG9CQUFvQixXQUFtQjtJQUNyQyxPQUFPLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMs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LE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QztJQUNILENBQUM7Q0FDRixDQUFBO0FBbENDO0lBREMsS0FBSyxDQUFDLFNBQVMsQ0FBQzs7O3FEQU1oQjtBQUdEO0lBREMsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7O21EQVNkO0FBL0JVLHNCQUFzQjtJQURsQyxTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFDLENBQUM7SUFTekIsbUJBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxtQkFBQSxJQUFJLEVBQUUsQ0FBQTs2Q0FERCxVQUFVLEVBQXFCLFNBQVM7UUFDckIsa0NBQWtDO0dBUmhFLHNCQUFzQixDQWlEbEM7U0FqRFksc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSG9zdCwgSW5wdXQsIE9uRGVzdHJveSwgT3B0aW9uYWwsIFJlbmRlcmVyMiwgU3RhdGljUHJvdmlkZXIsIGZvcndhcmRSZWYsIMm1bG9vc2VJZGVudGljYWwgYXMgbG9vc2VJZGVudGljYWx9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcblxuZXhwb3J0IGNvbnN0IFNFTEVDVF9NVUxUSVBMRV9WQUxVRV9BQ0NFU1NPUjogU3RhdGljUHJvdmlkZXIgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbmZ1bmN0aW9uIF9idWlsZFZhbHVlU3RyaW5nKGlkOiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBzdHJpbmcge1xuICBpZiAoaWQgPT0gbnVsbCkgcmV0dXJuIGAke3ZhbHVlfWA7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB2YWx1ZSA9IGAnJHt2YWx1ZX0nYDtcbiAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHZhbHVlID0gJ09iamVjdCc7XG4gIHJldHVybiBgJHtpZH06ICR7dmFsdWV9YC5zbGljZSgwLCA1MCk7XG59XG5cbmZ1bmN0aW9uIF9leHRyYWN0SWQodmFsdWVTdHJpbmc6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiB2YWx1ZVN0cmluZy5zcGxpdCgnOicpWzBdO1xufVxuXG4vKiogTW9jayBpbnRlcmZhY2UgZm9yIEhUTUwgT3B0aW9ucyAqL1xuaW50ZXJmYWNlIEhUTUxPcHRpb24ge1xuICB2YWx1ZTogc3RyaW5nO1xuICBzZWxlY3RlZDogYm9vbGVhbjtcbn1cblxuLyoqIE1vY2sgaW50ZXJmYWNlIGZvciBIVE1MQ29sbGVjdGlvbiAqL1xuYWJzdHJhY3QgY2xhc3MgSFRNTENvbGxlY3Rpb24ge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgbGVuZ3RoICE6IG51bWJlcjtcbiAgYWJzdHJhY3QgaXRlbShfOiBudW1iZXIpOiBIVE1MT3B0aW9uO1xufVxuXG4vKipcbiAqIFRoZSBhY2Nlc3NvciBmb3Igd3JpdGluZyBhIHZhbHVlIGFuZCBsaXN0ZW5pbmcgdG8gY2hhbmdlcyBvbiBhIHNlbGVjdCBlbGVtZW50LlxuICpcbiAqICAjIyMgQ2F2ZWF0OiBPcHRpb25zIHNlbGVjdGlvblxuICpcbiAqIEFuZ3VsYXIgdXNlcyBvYmplY3QgaWRlbnRpdHkgdG8gc2VsZWN0IG9wdGlvbnMuIEl0J3MgcG9zc2libGUgZm9yIHRoZSBpZGVudGl0aWVzIG9mIGl0ZW1zXG4gKiB0byBjaGFuZ2Ugd2hpbGUgdGhlIGRhdGEgZG9lcyBub3QuIFRoaXMgY2FuIGhhcHBlbiwgZm9yIGV4YW1wbGUsIGlmIHRoZSBpdGVtcyBhcmUgcHJvZHVjZWRcbiAqIGZyb20gYW4gUlBDIHRvIHRoZSBzZXJ2ZXIsIGFuZCB0aGF0IFJQQyBpcyByZS1ydW4uIEV2ZW4gaWYgdGhlIGRhdGEgaGFzbid0IGNoYW5nZWQsIHRoZVxuICogc2Vjb25kIHJlc3BvbnNlIHdpbGwgcHJvZHVjZSBvYmplY3RzIHdpdGggZGlmZmVyZW50IGlkZW50aXRpZXMuXG4gKlxuICogVG8gY3VzdG9taXplIHRoZSBkZWZhdWx0IG9wdGlvbiBjb21wYXJpc29uIGFsZ29yaXRobSwgYDxzZWxlY3QgbXVsdGlwbGU+YCBzdXBwb3J0cyBgY29tcGFyZVdpdGhgXG4gKiBpbnB1dC4gYGNvbXBhcmVXaXRoYCB0YWtlcyBhICoqZnVuY3Rpb24qKiB3aGljaCBoYXMgdHdvIGFyZ3VtZW50czogYG9wdGlvbjFgIGFuZCBgb3B0aW9uMmAuXG4gKiBJZiBgY29tcGFyZVdpdGhgIGlzIGdpdmVuLCBBbmd1bGFyIHNlbGVjdHMgb3B0aW9ucyBieSB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbi5cbiAqXG4gKiAjIyMjIFN5bnRheFxuICpcbiAqIGBgYFxuICogPHNlbGVjdCBtdWx0aXBsZSBbY29tcGFyZVdpdGhdPVwiY29tcGFyZUZuXCIgIFsobmdNb2RlbCldPVwic2VsZWN0ZWRDb3VudHJpZXNcIj5cbiAqICAgICA8b3B0aW9uICpuZ0Zvcj1cImxldCBjb3VudHJ5IG9mIGNvdW50cmllc1wiIFtuZ1ZhbHVlXT1cImNvdW50cnlcIj5cbiAqICAgICAgICAge3tjb3VudHJ5Lm5hbWV9fVxuICogICAgIDwvb3B0aW9uPlxuICogPC9zZWxlY3Q+XG4gKlxuICogY29tcGFyZUZuKGMxOiBDb3VudHJ5LCBjMjogQ291bnRyeSk6IGJvb2xlYW4ge1xuICogICAgIHJldHVybiBjMSAmJiBjMiA/IGMxLmlkID09PSBjMi5pZCA6IGMxID09PSBjMjtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ3NlbGVjdFttdWx0aXBsZV1bZm9ybUNvbnRyb2xOYW1lXSxzZWxlY3RbbXVsdGlwbGVdW2Zvcm1Db250cm9sXSxzZWxlY3RbbXVsdGlwbGVdW25nTW9kZWxdJyxcbiAgaG9zdDogeycoY2hhbmdlKSc6ICdvbkNoYW5nZSgkZXZlbnQudGFyZ2V0KScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknfSxcbiAgcHJvdmlkZXJzOiBbU0VMRUNUX01VTFRJUExFX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICB2YWx1ZTogYW55O1xuICAvKiogQGludGVybmFsICovXG4gIF9vcHRpb25NYXA6IE1hcDxzdHJpbmcsIE5nU2VsZWN0TXVsdGlwbGVPcHRpb24+ID0gbmV3IE1hcDxzdHJpbmcsIE5nU2VsZWN0TXVsdGlwbGVPcHRpb24+KCk7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lkQ291bnRlcjogbnVtYmVyID0gMDtcblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBASW5wdXQoKVxuICBzZXQgY29tcGFyZVdpdGgoZm46IChvMTogYW55LCBvMjogYW55KSA9PiBib29sZWFuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBjb21wYXJlV2l0aCBtdXN0IGJlIGEgZnVuY3Rpb24sIGJ1dCByZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KGZuKX1gKTtcbiAgICB9XG4gICAgdGhpcy5fY29tcGFyZVdpdGggPSBmbjtcbiAgfVxuXG4gIHByaXZhdGUgX2NvbXBhcmVXaXRoOiAobzE6IGFueSwgbzI6IGFueSkgPT4gYm9vbGVhbiA9IGxvb3NlSWRlbnRpY2FsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIGxldCBvcHRpb25TZWxlY3RlZFN0YXRlU2V0dGVyOiAob3B0OiBOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLCBvOiBhbnkpID0+IHZvaWQ7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAvLyBjb252ZXJ0IHZhbHVlcyB0byBpZHNcbiAgICAgIGNvbnN0IGlkcyA9IHZhbHVlLm1hcCgodikgPT4gdGhpcy5fZ2V0T3B0aW9uSWQodikpO1xuICAgICAgb3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlciA9IChvcHQsIG8pID0+IHsgb3B0Ll9zZXRTZWxlY3RlZChpZHMuaW5kZXhPZihvLnRvU3RyaW5nKCkpID4gLTEpOyB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25TZWxlY3RlZFN0YXRlU2V0dGVyID0gKG9wdCwgbykgPT4geyBvcHQuX3NldFNlbGVjdGVkKGZhbHNlKTsgfTtcbiAgICB9XG4gICAgdGhpcy5fb3B0aW9uTWFwLmZvckVhY2gob3B0aW9uU2VsZWN0ZWRTdGF0ZVNldHRlcik7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IChfOiBhbnkpID0+IHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkOiBBcnJheTxhbnk+ID0gW107XG4gICAgICBpZiAoXy5oYXNPd25Qcm9wZXJ0eSgnc2VsZWN0ZWRPcHRpb25zJykpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uczogSFRNTENvbGxlY3Rpb24gPSBfLnNlbGVjdGVkT3B0aW9ucztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3Qgb3B0OiBhbnkgPSBvcHRpb25zLml0ZW0oaSk7XG4gICAgICAgICAgY29uc3QgdmFsOiBhbnkgPSB0aGlzLl9nZXRPcHRpb25WYWx1ZShvcHQudmFsdWUpO1xuICAgICAgICAgIHNlbGVjdGVkLnB1c2godmFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRGVncmFkZSBvbiBJRVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IEhUTUxDb2xsZWN0aW9uID0gPEhUTUxDb2xsZWN0aW9uPl8ub3B0aW9ucztcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3Qgb3B0OiBIVE1MT3B0aW9uID0gb3B0aW9ucy5pdGVtKGkpO1xuICAgICAgICAgIGlmIChvcHQuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbDogYW55ID0gdGhpcy5fZ2V0T3B0aW9uVmFsdWUob3B0LnZhbHVlKTtcbiAgICAgICAgICAgIHNlbGVjdGVkLnB1c2godmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMudmFsdWUgPSBzZWxlY3RlZDtcbiAgICAgIGZuKHNlbGVjdGVkKTtcbiAgICB9O1xuICB9XG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWdpc3Rlck9wdGlvbih2YWx1ZTogTmdTZWxlY3RNdWx0aXBsZU9wdGlvbik6IHN0cmluZyB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9ICh0aGlzLl9pZENvdW50ZXIrKykudG9TdHJpbmcoKTtcbiAgICB0aGlzLl9vcHRpb25NYXAuc2V0KGlkLCB2YWx1ZSk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2V0T3B0aW9uSWQodmFsdWU6IGFueSk6IHN0cmluZ3xudWxsIHtcbiAgICBmb3IgKGNvbnN0IGlkIG9mIEFycmF5LmZyb20odGhpcy5fb3B0aW9uTWFwLmtleXMoKSkpIHtcbiAgICAgIGlmICh0aGlzLl9jb21wYXJlV2l0aCh0aGlzLl9vcHRpb25NYXAuZ2V0KGlkKSAhLl92YWx1ZSwgdmFsdWUpKSByZXR1cm4gaWQ7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZ2V0T3B0aW9uVmFsdWUodmFsdWVTdHJpbmc6IHN0cmluZyk6IGFueSB7XG4gICAgY29uc3QgaWQ6IHN0cmluZyA9IF9leHRyYWN0SWQodmFsdWVTdHJpbmcpO1xuICAgIHJldHVybiB0aGlzLl9vcHRpb25NYXAuaGFzKGlkKSA/IHRoaXMuX29wdGlvbk1hcC5nZXQoaWQpICEuX3ZhbHVlIDogdmFsdWVTdHJpbmc7XG4gIH1cbn1cblxuLyoqXG4gKiBNYXJrcyBgPG9wdGlvbj5gIGFzIGR5bmFtaWMsIHNvIEFuZ3VsYXIgY2FuIGJlIG5vdGlmaWVkIHdoZW4gb3B0aW9ucyBjaGFuZ2UuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIDxzZWxlY3QgbXVsdGlwbGUgbmFtZT1cImNpdHlcIiBuZ01vZGVsPlxuICogICA8b3B0aW9uICpuZ0Zvcj1cImxldCBjIG9mIGNpdGllc1wiIFt2YWx1ZV09XCJjXCI+PC9vcHRpb24+XG4gKiA8L3NlbGVjdD5cbiAqIGBgYFxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ29wdGlvbid9KVxuZXhwb3J0IGNsYXNzIE5nU2VsZWN0TXVsdGlwbGVPcHRpb24gaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgaWQgITogc3RyaW5nO1xuICAvKiogQGludGVybmFsICovXG4gIF92YWx1ZTogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgIEBPcHRpb25hbCgpIEBIb3N0KCkgcHJpdmF0ZSBfc2VsZWN0OiBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yKSB7XG4gICAgaWYgKHRoaXMuX3NlbGVjdCkge1xuICAgICAgdGhpcy5pZCA9IHRoaXMuX3NlbGVjdC5fcmVnaXN0ZXJPcHRpb24odGhpcyk7XG4gICAgfVxuICB9XG5cbiAgQElucHV0KCduZ1ZhbHVlJylcbiAgc2V0IG5nVmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl9zZWxlY3QgPT0gbnVsbCkgcmV0dXJuO1xuICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5fc2V0RWxlbWVudFZhbHVlKF9idWlsZFZhbHVlU3RyaW5nKHRoaXMuaWQsIHZhbHVlKSk7XG4gICAgdGhpcy5fc2VsZWN0LndyaXRlVmFsdWUodGhpcy5fc2VsZWN0LnZhbHVlKTtcbiAgfVxuXG4gIEBJbnB1dCgndmFsdWUnKVxuICBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xuICAgIGlmICh0aGlzLl9zZWxlY3QpIHtcbiAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLl9zZXRFbGVtZW50VmFsdWUoX2J1aWxkVmFsdWVTdHJpbmcodGhpcy5pZCwgdmFsdWUpKTtcbiAgICAgIHRoaXMuX3NlbGVjdC53cml0ZVZhbHVlKHRoaXMuX3NlbGVjdC52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3NldEVsZW1lbnRWYWx1ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfc2V0RWxlbWVudFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFNlbGVjdGVkKHNlbGVjdGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnc2VsZWN0ZWQnLCBzZWxlY3RlZCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fc2VsZWN0KSB7XG4gICAgICB0aGlzLl9zZWxlY3QuX29wdGlvbk1hcC5kZWxldGUodGhpcy5pZCk7XG4gICAgICB0aGlzLl9zZWxlY3Qud3JpdGVWYWx1ZSh0aGlzLl9zZWxlY3QudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19