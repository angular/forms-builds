import * as i0 from "@angular/core";
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
export const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioControlValueAccessor),
    multi: true
};
/**
 * Internal class used by Angular to uncheck radio buttons with the matching name.
 */
export class RadioControlRegistry {
    constructor() {
        this._accessors = [];
    }
    add(control, accessor) {
        this._accessors.push([control, accessor]);
    }
    remove(accessor) {
        for (let i = this._accessors.length - 1; i >= 0; --i) {
            if (this._accessors[i][1] === accessor) {
                this._accessors.splice(i, 1);
                return;
            }
        }
    }
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
RadioControlRegistry.ngInjectableDef = i0.defineInjectable({ token: RadioControlRegistry, factory: function RadioControlRegistry_Factory() { return new RadioControlRegistry(); }, providedIn: null });
/**
 * @description
 *
 * Writes radio control values and listens to radio control changes.
 *
 * Used by `NgModel`, `FormControlDirective`, and `FormControlName`
 * to keep the view synced with the `FormControl` model.
 *
 * If you have imported the `FormsModule` or the `ReactiveFormsModule`, this
 * value accessor will be active on any radio control that has a form directive. You do
 * **not** need to add a special selector to activate it.
 *
 * ### How to use radio buttons with form directives
 *
 * To use radio buttons in a template-driven form, you'll want to ensure that radio buttons
 * in the same group have the same `name` attribute.  Radio buttons with different `name`
 * attributes do not affect each other.
 *
 * {@example forms/ts/radioButtons/radio_button_example.ts region='TemplateDriven'}
 *
 * When using radio buttons in a reactive form, radio buttons in the same group should have the
 * same `formControlName`. You can also add a `name` attribute, but it's optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 *  * **npm package**: `@angular/forms`
 *
 *
 */
export class RadioControlValueAccessor {
    constructor(_renderer, _elementRef, _registry, _injector) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._registry = _registry;
        this._injector = _injector;
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    ngOnInit() {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
    }
    ngOnDestroy() { this._registry.remove(this); }
    writeValue(value) {
        this._state = value === this.value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'checked', this._state);
    }
    registerOnChange(fn) {
        this._fn = fn;
        this.onChange = () => {
            fn(this.value);
            this._registry.select(this);
        };
    }
    fireUncheck(value) { this.writeValue(value); }
    registerOnTouched(fn) { this.onTouched = fn; }
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    _checkName() {
        if (this.name && this.formControlName && this.name !== this.formControlName) {
            this._throwNameError();
        }
        if (!this.name && this.formControlName)
            this.name = this.formControlName;
    }
    _throwNameError() {
        throw new Error(`
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
    }
}
RadioControlValueAccessor.ngDirectiveDef = i0.ɵdefineDirective({ type: RadioControlValueAccessor, selectors: [["input", "type", "radio", "formControlName", ""], ["input", "type", "radio", "formControl", ""], ["input", "type", "radio", "ngModel", ""]], factory: function RadioControlValueAccessor_Factory() { return new RadioControlValueAccessor(i0.ɵdirectiveInject(Renderer2), i0.ɵinjectElementRef(), i0.ɵdirectiveInject(RadioControlRegistry), i0.ɵdirectiveInject(Injector)); }, inputs: { name: "name", formControlName: "formControlName", value: "value" } });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFxQixTQUFTLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTNILE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNqRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRXZDLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFRO0lBQ3ZDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztJQUN4RCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRjs7R0FFRztBQUVILE1BQU07SUFETjtRQUVVLGVBQVUsR0FBVSxFQUFFLENBQUM7S0E4QmhDO0lBNUJDLEdBQUcsQ0FBQyxPQUFrQixFQUFFLFFBQW1DO1FBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxRQUFtQztRQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ3BELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7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SSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFTyxVQUFVO1FBQ2hCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUMzRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsZUFBZTtZQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUMzRSxDQUFDO0lBRU8sZUFBZTtRQUNyQixNQUFNLElBQUksS0FBSyxDQUFDOzs7S0FHZixDQUFDLENBQUM7SUFDTCxDQUFDOzt1RUFqRVUseUJBQXlCLCtOQUF6Qix5QkFBeUIscUJBcUJiLFNBQVMsK0NBQ1Qsb0JBQW9CLHVCQUFxQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIElucHV0LCBPbkRlc3Ryb3ksIE9uSW5pdCwgUmVuZGVyZXIyLCBmb3J3YXJkUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9uZ19jb250cm9sJztcblxuZXhwb3J0IGNvbnN0IFJBRElPX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogSW50ZXJuYWwgY2xhc3MgdXNlZCBieSBBbmd1bGFyIHRvIHVuY2hlY2sgcmFkaW8gYnV0dG9ucyB3aXRoIHRoZSBtYXRjaGluZyBuYW1lLlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUmFkaW9Db250cm9sUmVnaXN0cnkge1xuICBwcml2YXRlIF9hY2Nlc3NvcnM6IGFueVtdID0gW107XG5cbiAgYWRkKGNvbnRyb2w6IE5nQ29udHJvbCwgYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMucHVzaChbY29udHJvbCwgYWNjZXNzb3JdKTtcbiAgfVxuXG4gIHJlbW92ZShhY2Nlc3NvcjogUmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcikge1xuICAgIGZvciAobGV0IGkgPSB0aGlzLl9hY2Nlc3NvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIGlmICh0aGlzLl9hY2Nlc3NvcnNbaV1bMV0gPT09IGFjY2Vzc29yKSB7XG4gICAgICAgIHRoaXMuX2FjY2Vzc29ycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZWxlY3QoYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpIHtcbiAgICB0aGlzLl9hY2Nlc3NvcnMuZm9yRWFjaCgoYykgPT4ge1xuICAgICAgaWYgKHRoaXMuX2lzU2FtZUdyb3VwKGMsIGFjY2Vzc29yKSAmJiBjWzFdICE9PSBhY2Nlc3Nvcikge1xuICAgICAgICBjWzFdLmZpcmVVbmNoZWNrKGFjY2Vzc29yLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzU2FtZUdyb3VwKFxuICAgICAgY29udHJvbFBhaXI6IFtOZ0NvbnRyb2wsIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3JdLFxuICAgICAgYWNjZXNzb3I6IFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IpOiBib29sZWFuIHtcbiAgICBpZiAoIWNvbnRyb2xQYWlyWzBdLmNvbnRyb2wpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gY29udHJvbFBhaXJbMF0uX3BhcmVudCA9PT0gYWNjZXNzb3IuX2NvbnRyb2wuX3BhcmVudCAmJlxuICAgICAgICBjb250cm9sUGFpclsxXS5uYW1lID09PSBhY2Nlc3Nvci5uYW1lO1xuICB9XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogV3JpdGVzIHJhZGlvIGNvbnRyb2wgdmFsdWVzIGFuZCBsaXN0ZW5zIHRvIHJhZGlvIGNvbnRyb2wgY2hhbmdlcy5cbiAqXG4gKiBVc2VkIGJ5IGBOZ01vZGVsYCwgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYW5kIGBGb3JtQ29udHJvbE5hbWVgXG4gKiB0byBrZWVwIHRoZSB2aWV3IHN5bmNlZCB3aXRoIHRoZSBgRm9ybUNvbnRyb2xgIG1vZGVsLlxuICpcbiAqIElmIHlvdSBoYXZlIGltcG9ydGVkIHRoZSBgRm9ybXNNb2R1bGVgIG9yIHRoZSBgUmVhY3RpdmVGb3Jtc01vZHVsZWAsIHRoaXNcbiAqIHZhbHVlIGFjY2Vzc29yIHdpbGwgYmUgYWN0aXZlIG9uIGFueSByYWRpbyBjb250cm9sIHRoYXQgaGFzIGEgZm9ybSBkaXJlY3RpdmUuIFlvdSBkb1xuICogKipub3QqKiBuZWVkIHRvIGFkZCBhIHNwZWNpYWwgc2VsZWN0b3IgdG8gYWN0aXZhdGUgaXQuXG4gKlxuICogIyMjIEhvdyB0byB1c2UgcmFkaW8gYnV0dG9ucyB3aXRoIGZvcm0gZGlyZWN0aXZlc1xuICpcbiAqIFRvIHVzZSByYWRpbyBidXR0b25zIGluIGEgdGVtcGxhdGUtZHJpdmVuIGZvcm0sIHlvdSdsbCB3YW50IHRvIGVuc3VyZSB0aGF0IHJhZGlvIGJ1dHRvbnNcbiAqIGluIHRoZSBzYW1lIGdyb3VwIGhhdmUgdGhlIHNhbWUgYG5hbWVgIGF0dHJpYnV0ZS4gIFJhZGlvIGJ1dHRvbnMgd2l0aCBkaWZmZXJlbnQgYG5hbWVgXG4gKiBhdHRyaWJ1dGVzIGRvIG5vdCBhZmZlY3QgZWFjaCBvdGhlci5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvcmFkaW9CdXR0b25zL3JhZGlvX2J1dHRvbl9leGFtcGxlLnRzIHJlZ2lvbj0nVGVtcGxhdGVEcml2ZW4nfVxuICpcbiAqIFdoZW4gdXNpbmcgcmFkaW8gYnV0dG9ucyBpbiBhIHJlYWN0aXZlIGZvcm0sIHJhZGlvIGJ1dHRvbnMgaW4gdGhlIHNhbWUgZ3JvdXAgc2hvdWxkIGhhdmUgdGhlXG4gKiBzYW1lIGBmb3JtQ29udHJvbE5hbWVgLiBZb3UgY2FuIGFsc28gYWRkIGEgYG5hbWVgIGF0dHJpYnV0ZSwgYnV0IGl0J3Mgb3B0aW9uYWwuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3JlYWN0aXZlUmFkaW9CdXR0b25zL3JlYWN0aXZlX3JhZGlvX2J1dHRvbl9leGFtcGxlLnRzIHJlZ2lvbj0nUmVhY3RpdmUnfVxuICpcbiAqICAqICoqbnBtIHBhY2thZ2UqKjogYEBhbmd1bGFyL2Zvcm1zYFxuICpcbiAqXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dFt0eXBlPXJhZGlvXVtmb3JtQ29udHJvbE5hbWVdLGlucHV0W3R5cGU9cmFkaW9dW2Zvcm1Db250cm9sXSxpbnB1dFt0eXBlPXJhZGlvXVtuZ01vZGVsXScsXG4gIGhvc3Q6IHsnKGNoYW5nZSknOiAnb25DaGFuZ2UoKScsICcoYmx1ciknOiAnb25Ub3VjaGVkKCknfSxcbiAgcHJvdmlkZXJzOiBbUkFESU9fVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgICBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9zdGF0ZSAhOiBib29sZWFuO1xuICAvKiogQGludGVybmFsICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfY29udHJvbCAhOiBOZ0NvbnRyb2w7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9mbiAhOiBGdW5jdGlvbjtcbiAgb25DaGFuZ2UgPSAoKSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgpIG5hbWUgITogc3RyaW5nO1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCkgZm9ybUNvbnRyb2xOYW1lICE6IHN0cmluZztcbiAgQElucHV0KCkgdmFsdWU6IGFueTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBwcml2YXRlIF9yZWdpc3RyeTogUmFkaW9Db250cm9sUmVnaXN0cnksIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3Rvcikge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250cm9sID0gdGhpcy5faW5qZWN0b3IuZ2V0KE5nQ29udHJvbCk7XG4gICAgdGhpcy5fY2hlY2tOYW1lKCk7XG4gICAgdGhpcy5fcmVnaXN0cnkuYWRkKHRoaXMuX2NvbnRyb2wsIHRoaXMpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7IHRoaXMuX3JlZ2lzdHJ5LnJlbW92ZSh0aGlzKTsgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlID0gdmFsdWUgPT09IHRoaXMudmFsdWU7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnY2hlY2tlZCcsIHRoaXMuX3N0YXRlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHt9KTogdm9pZCB7XG4gICAgdGhpcy5fZm4gPSBmbjtcbiAgICB0aGlzLm9uQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgZm4odGhpcy52YWx1ZSk7XG4gICAgICB0aGlzLl9yZWdpc3RyeS5zZWxlY3QodGhpcyk7XG4gICAgfTtcbiAgfVxuXG4gIGZpcmVVbmNoZWNrKHZhbHVlOiBhbnkpOiB2b2lkIHsgdGhpcy53cml0ZVZhbHVlKHZhbHVlKTsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiB7fSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrTmFtZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uYW1lICYmIHRoaXMuZm9ybUNvbnRyb2xOYW1lICYmIHRoaXMubmFtZSAhPT0gdGhpcy5mb3JtQ29udHJvbE5hbWUpIHtcbiAgICAgIHRoaXMuX3Rocm93TmFtZUVycm9yKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5uYW1lICYmIHRoaXMuZm9ybUNvbnRyb2xOYW1lKSB0aGlzLm5hbWUgPSB0aGlzLmZvcm1Db250cm9sTmFtZTtcbiAgfVxuXG4gIHByaXZhdGUgX3Rocm93TmFtZUVycm9yKCk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBJZiB5b3UgZGVmaW5lIGJvdGggYSBuYW1lIGFuZCBhIGZvcm1Db250cm9sTmFtZSBhdHRyaWJ1dGUgb24geW91ciByYWRpbyBidXR0b24sIHRoZWlyIHZhbHVlc1xuICAgICAgbXVzdCBtYXRjaC4gRXg6IDxpbnB1dCB0eXBlPVwicmFkaW9cIiBmb3JtQ29udHJvbE5hbWU9XCJmb29kXCIgbmFtZT1cImZvb2RcIj5cbiAgICBgKTtcbiAgfVxufVxuIl19