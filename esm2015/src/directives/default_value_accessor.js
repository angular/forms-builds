import { Directive, ElementRef, Inject, InjectionToken, Optional, Renderer2, forwardRef } from '@angular/core';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
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
export const DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DefaultValueAccessor),
    multi: true
};
/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 * @return {?}
 */
function _isAndroid() {
    /** @type {?} */
    const userAgent = getDOM() ? getDOM().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}
/** *
 * Turn this mode on if you want form directives to buffer IME input until compositionend
 * \@publicApi
  @type {?} */
export const COMPOSITION_BUFFER_MODE = new InjectionToken('CompositionEventMode');
/**
 * \@description
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * \@usageNotes
 *
 * ### Using the default value accessor
 *
 * The following example shows how to use an input element that activates the default value accessor
 * (in this case, a text field).
 *
 * ```ts
 * const firstNameControl = new FormControl();
 * ```
 *
 * ```
 * <input type="text" [formControl]="firstNameControl">
 * ```
 *
 * \@ngModule ReactiveFormsModule
 * \@ngModule FormsModule
 * \@publicApi
 */
export class DefaultValueAccessor {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     * @param {?} _compositionMode
     */
    constructor(_renderer, _elementRef, _compositionMode) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._compositionMode = _compositionMode;
        /**
         * \@description
         * The registered callback function called when an input event occurs on the input element.
         */
        this.onChange = (_) => { };
        /**
         * \@description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
        /**
         * Whether the user is creating a composition string (IME events).
         */
        this._composing = false;
        if (this._compositionMode == null) {
            this._compositionMode = !_isAndroid();
        }
    }
    /**
     * Sets the "value" property on the input element.
     *
     * @param {?} value The checked value
     * @return {?}
     */
    writeValue(value) {
        /** @type {?} */
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    }
    /**
     * \@description
     * Registers a function called when the control value changes.
     *
     * @param {?} fn The callback function
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * \@description
     * Registers a function called when the control is touched.
     *
     * @param {?} fn The callback function
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
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
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _handleInput(value) {
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
            this.onChange(value);
        }
    }
    /**
     * \@internal
     * @return {?}
     */
    _compositionStart() { this._composing = true; }
    /**
     * \@internal
     * @param {?} value
     * @return {?}
     */
    _compositionEnd(value) {
        this._composing = false;
        this._compositionMode && this.onChange(value);
    }
}
DefaultValueAccessor.decorators = [
    { type: Directive, args: [{
                selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
                // TODO: vsavkin replace the above selector with the one below it once
                // https://github.com/angular/angular/issues/3011 is implemented
                // selector: '[ngModel],[formControl],[formControlName]',
                host: {
                    '(input)': '$any(this)._handleInput($event.target.value)',
                    '(blur)': 'onTouched()',
                    '(compositionstart)': '$any(this)._compositionStart()',
                    '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
                },
                providers: [DEFAULT_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
DefaultValueAccessor.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef },
    { type: Boolean, decorators: [{ type: Optional }, { type: Inject, args: [COMPOSITION_BUFFER_MODE,] }] }
];
DefaultValueAccessor.ngDirectiveDef = i0.ɵdefineDirective({ type: DefaultValueAccessor, selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]], factory: function DefaultValueAccessor_Factory(t) { return new (t || DefaultValueAccessor)(i0.ɵdirectiveInject(Renderer2), i0.ɵdirectiveInject(ElementRef), i0.ɵdirectiveInject(COMPOSITION_BUFFER_MODE, 8)); }, hostBindings: function DefaultValueAccessor_HostBindings(rf, ctx, elIndex) { if (rf & 1) {
        i0.ɵlistener("input", function DefaultValueAccessor_input_HostBindingHandler($event) { return ctx._handleInput($event.target.value); });
        i0.ɵlistener("blur", function DefaultValueAccessor_blur_HostBindingHandler($event) { return ctx.onTouched(); });
        i0.ɵlistener("compositionstart", function DefaultValueAccessor_compositionstart_HostBindingHandler($event) { return ctx._compositionStart(); });
        i0.ɵlistener("compositionend", function DefaultValueAccessor_compositionend_HostBindingHandler($event) { return ctx._compositionEnd($event.target.value); });
    } }, features: [i0.ɵProvidersFeature([DEFAULT_VALUE_ACCESSOR])] });
/*@__PURE__*/ i0.ɵsetClassMetadata(DefaultValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
                // TODO: vsavkin replace the above selector with the one below it once
                // https://github.com/angular/angular/issues/3011 is implemented
                // selector: '[ngModel],[formControl],[formControlName]',
                host: {
                    '(input)': '$any(this)._handleInput($event.target.value)',
                    '(blur)': 'onTouched()',
                    '(compositionstart)': '$any(this)._compositionStart()',
                    '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
                },
                providers: [DEFAULT_VALUE_ACCESSOR]
            }]
    }], [{
        type: Renderer2
    }, {
        type: ElementRef
    }, {
        type: undefined,
        decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [COMPOSITION_BUFFER_MODE]
            }]
    }], null);
if (false) {
    /**
     * \@description
     * The registered callback function called when an input event occurs on the input element.
     * @type {?}
     */
    DefaultValueAccessor.prototype.onChange;
    /**
     * \@description
     * The registered callback function called when a blur event occurs on the input element.
     * @type {?}
     */
    DefaultValueAccessor.prototype.onTouched;
    /**
     * Whether the user is creating a composition string (IME events).
     * @type {?}
     */
    DefaultValueAccessor.prototype._composing;
    /** @type {?} */
    DefaultValueAccessor.prototype._renderer;
    /** @type {?} */
    DefaultValueAccessor.prototype._elementRef;
    /** @type {?} */
    DefaultValueAccessor.prototype._compositionMode;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RyxPQUFPLEVBQUMsT0FBTyxJQUFJLE1BQU0sRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFFakYsYUFBYSxzQkFBc0IsR0FBUTtJQUN6QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7SUFDbkQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDOzs7Ozs7QUFNRixTQUFTLFVBQVU7O0lBQ2pCLE1BQU0sU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztDQUN0RDs7Ozs7QUFNRCxhQUFhLHVCQUF1QixHQUFHLElBQUksY0FBYyxDQUFVLHNCQUFzQixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUMzRixNQUFNLE9BQU8sb0JBQW9COzs7Ozs7SUFnQi9CLFlBQ1ksV0FBOEIsV0FBdUIsRUFDUixnQkFBeUI7UUFEdEUsY0FBUyxHQUFULFNBQVM7UUFBcUIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7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bmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbmplY3Rpb25Ub2tlbiwgT3B0aW9uYWwsIFJlbmRlcmVyMiwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge8m1Z2V0RE9NIGFzIGdldERPTX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERlZmF1bHRWYWx1ZUFjY2Vzc29yKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogV2UgbXVzdCBjaGVjayB3aGV0aGVyIHRoZSBhZ2VudCBpcyBBbmRyb2lkIGJlY2F1c2UgY29tcG9zaXRpb24gZXZlbnRzXG4gKiBiZWhhdmUgZGlmZmVyZW50bHkgYmV0d2VlbiBpT1MgYW5kIEFuZHJvaWQuXG4gKi9cbmZ1bmN0aW9uIF9pc0FuZHJvaWQoKTogYm9vbGVhbiB7XG4gIGNvbnN0IHVzZXJBZ2VudCA9IGdldERPTSgpID8gZ2V0RE9NKCkuZ2V0VXNlckFnZW50KCkgOiAnJztcbiAgcmV0dXJuIC9hbmRyb2lkIChcXGQrKS8udGVzdCh1c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XG59XG5cbi8qKlxuICogVHVybiB0aGlzIG1vZGUgb24gaWYgeW91IHdhbnQgZm9ybSBkaXJlY3RpdmVzIHRvIGJ1ZmZlciBJTUUgaW5wdXQgdW50aWwgY29tcG9zaXRpb25lbmRcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdDb21wb3NpdGlvbkV2ZW50TW9kZScpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIGRlZmF1bHQgYENvbnRyb2xWYWx1ZUFjY2Vzc29yYCBmb3Igd3JpdGluZyBhIHZhbHVlIGFuZCBsaXN0ZW5pbmcgdG8gY2hhbmdlcyBvbiBpbnB1dFxuICogZWxlbWVudHMuIFRoZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IHRoZSBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBgRm9ybUNvbnRyb2xOYW1lYCwgYW5kXG4gKiBgTmdNb2RlbGAgZGlyZWN0aXZlcy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBVc2luZyB0aGUgZGVmYXVsdCB2YWx1ZSBhY2Nlc3NvclxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gdXNlIGFuIGlucHV0IGVsZW1lbnQgdGhhdCBhY3RpdmF0ZXMgdGhlIGRlZmF1bHQgdmFsdWUgYWNjZXNzb3JcbiAqIChpbiB0aGlzIGNhc2UsIGEgdGV4dCBmaWVsZCkuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGZpcnN0TmFtZUNvbnRyb2wgPSBuZXcgRm9ybUNvbnRyb2woKTtcbiAqIGBgYFxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgW2Zvcm1Db250cm9sXT1cImZpcnN0TmFtZUNvbnRyb2xcIj5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ2lucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW2Zvcm1Db250cm9sTmFtZV0sdGV4dGFyZWFbZm9ybUNvbnRyb2xOYW1lXSxpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtmb3JtQ29udHJvbF0sdGV4dGFyZWFbZm9ybUNvbnRyb2xdLGlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW25nTW9kZWxdLHRleHRhcmVhW25nTW9kZWxdLFtuZ0RlZmF1bHRDb250cm9sXScsXG4gIC8vIFRPRE86IHZzYXZraW4gcmVwbGFjZSB0aGUgYWJvdmUgc2VsZWN0b3Igd2l0aCB0aGUgb25lIGJlbG93IGl0IG9uY2VcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzAxMSBpcyBpbXBsZW1lbnRlZFxuICAvLyBzZWxlY3RvcjogJ1tuZ01vZGVsXSxbZm9ybUNvbnRyb2xdLFtmb3JtQ29udHJvbE5hbWVdJyxcbiAgaG9zdDoge1xuICAgICcoaW5wdXQpJzogJyRhbnkodGhpcykuX2hhbmRsZUlucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyxcbiAgICAnKGNvbXBvc2l0aW9uc3RhcnQpJzogJyRhbnkodGhpcykuX2NvbXBvc2l0aW9uU3RhcnQoKScsXG4gICAgJyhjb21wb3NpdGlvbmVuZCknOiAnJGFueSh0aGlzKS5fY29tcG9zaXRpb25FbmQoJGV2ZW50LnRhcmdldC52YWx1ZSknXG4gIH0sXG4gIHByb3ZpZGVyczogW0RFRkFVTFRfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGFuIGlucHV0IGV2ZW50IG9jY3VycyBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICovXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgd2hlbiBhIGJsdXIgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgaXMgY3JlYXRpbmcgYSBjb21wb3NpdGlvbiBzdHJpbmcgKElNRSBldmVudHMpLiAqL1xuICBwcml2YXRlIF9jb21wb3NpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFKSBwcml2YXRlIF9jb21wb3NpdGlvbk1vZGU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fY29tcG9zaXRpb25Nb2RlID09IG51bGwpIHtcbiAgICAgIHRoaXMuX2NvbXBvc2l0aW9uTW9kZSA9ICFfaXNBbmRyb2lkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwidmFsdWVcIiBwcm9wZXJ0eSBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBjaGVja2VkIHZhbHVlXG4gICAqL1xuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIHRoZSBjb250cm9sIHZhbHVlIGNoYW5nZXMuXG4gICAqXG4gICAqIEBwYXJhbSBmbiBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46IChfOiBhbnkpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBmdW5jdGlvbiBjYWxsZWQgd2hlbiB0aGUgY29udHJvbCBpcyB0b3VjaGVkLlxuICAgKlxuICAgKiBAcGFyYW0gZm4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwiZGlzYWJsZWRcIiBwcm9wZXJ0eSBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgVGhlIGRpc2FibGVkIHZhbHVlXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaGFuZGxlSW5wdXQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY29tcG9zaXRpb25Nb2RlIHx8ICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgIXRoaXMuX2NvbXBvc2luZykpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbXBvc2l0aW9uU3RhcnQoKTogdm9pZCB7IHRoaXMuX2NvbXBvc2luZyA9IHRydWU7IH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jb21wb3NpdGlvbkVuZCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fY29tcG9zaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlICYmIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICB9XG59XG4iXX0=