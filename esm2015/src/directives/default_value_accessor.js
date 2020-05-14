/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/directives/default_value_accessor.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { ɵgetDOM as getDOM } from '@angular/common';
import { Directive, ElementRef, forwardRef, Inject, InjectionToken, Optional, Renderer2 } from '@angular/core';
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
export const DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => DefaultValueAccessor)),
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
/**
 * \@description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * \@publicApi
 * @type {?}
 */
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
let DefaultValueAccessor = /** @class */ (() => {
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
    class DefaultValueAccessor {
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
            this.onChange = (/**
             * @param {?} _
             * @return {?}
             */
            (_) => { });
            /**
             * \@description
             * The registered callback function called when a blur event occurs on the input element.
             */
            this.onTouched = (/**
             * @return {?}
             */
            () => { });
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
        registerOnChange(fn) {
            this.onChange = fn;
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
        _compositionStart() {
            this._composing = true;
        }
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
    /** @nocollapse */ DefaultValueAccessor.ɵfac = function DefaultValueAccessor_Factory(t) { return new (t || DefaultValueAccessor)(i0.ɵɵdirectiveInject(i0.Renderer2), i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(COMPOSITION_BUFFER_MODE, 8)); };
    /** @nocollapse */ DefaultValueAccessor.ɵdir = i0.ɵɵdefineDirective({ type: DefaultValueAccessor, selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]], hostBindings: function DefaultValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("input", function DefaultValueAccessor_input_HostBindingHandler($event) { return ctx._handleInput($event.target.value); })("blur", function DefaultValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); })("compositionstart", function DefaultValueAccessor_compositionstart_HostBindingHandler() { return ctx._compositionStart(); })("compositionend", function DefaultValueAccessor_compositionend_HostBindingHandler($event) { return ctx._compositionEnd($event.target.value); });
        } }, features: [i0.ɵɵProvidersFeature([DEFAULT_VALUE_ACCESSOR])] });
    return DefaultValueAccessor;
})();
export { DefaultValueAccessor };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(DefaultValueAccessor, [{
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
    }], function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [COMPOSITION_BUFFER_MODE]
            }] }]; }, null); })();
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
     * @private
     */
    DefaultValueAccessor.prototype._composing;
    /**
     * @type {?}
     * @private
     */
    DefaultValueAccessor.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    DefaultValueAccessor.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    DefaultValueAccessor.prototype._compositionMode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRQSxPQUFPLEVBQUMsT0FBTyxJQUFJLE1BQU0sRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFN0csT0FBTyxFQUF1QixpQkFBaUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDOzs7Ozs7Ozs7O0FBRWpGLE1BQU0sT0FBTyxzQkFBc0IsR0FBUTtJQUN6QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVOzs7SUFBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsRUFBQztJQUNuRCxLQUFLLEVBQUUsSUFBSTtDQUNaOzs7Ozs7QUFNRCxTQUFTLFVBQVU7O1VBQ1gsU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtJQUN6RCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDdkQsQ0FBQzs7Ozs7Ozs7QUFRRCxNQUFNLE9BQU8sdUJBQXVCLEdBQUcsSUFBSSxjQUFjLENBQVUsc0JBQXNCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkIxRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxNQWNhLG9CQUFvQjs7Ozs7O1FBZ0IvQixZQUNZLFNBQW9CLEVBQVUsV0FBdUIsRUFDUixnQkFBeUI7WUFEdEUsY0FBUyxHQUFULFNB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QkFtQk0sUUFBUTs7c0JBQUksTUFBTTt1QkFBQyx1QkFBdUI7Ozs7Ozs7O0lBYi9DLHdDQUEwQjs7Ozs7O0lBTTFCLHlDQUFxQjs7Ozs7O0lBR3JCLDBDQUEyQjs7Ozs7SUFHdkIseUNBQTRCOzs7OztJQUFFLDJDQUErQjs7Ozs7SUFDN0QsZ0RBQThFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge8m1Z2V0RE9NIGFzIGdldERPTX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBmb3J3YXJkUmVmLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCwgUmVuZGVyZXIyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEZWZhdWx0VmFsdWVBY2Nlc3NvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIFdlIG11c3QgY2hlY2sgd2hldGhlciB0aGUgYWdlbnQgaXMgQW5kcm9pZCBiZWNhdXNlIGNvbXBvc2l0aW9uIGV2ZW50c1xuICogYmVoYXZlIGRpZmZlcmVudGx5IGJldHdlZW4gaU9TIGFuZCBBbmRyb2lkLlxuICovXG5mdW5jdGlvbiBfaXNBbmRyb2lkKCk6IGJvb2xlYW4ge1xuICBjb25zdCB1c2VyQWdlbnQgPSBnZXRET00oKSA/IGdldERPTSgpLmdldFVzZXJBZ2VudCgpIDogJyc7XG4gIHJldHVybiAvYW5kcm9pZCAoXFxkKykvLnRlc3QodXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZSB0aGlzIHRva2VuIHRvIGNvbnRyb2wgaWYgZm9ybSBkaXJlY3RpdmVzIGJ1ZmZlciBJTUUgaW5wdXQgdW50aWxcbiAqIHRoZSBcImNvbXBvc2l0aW9uZW5kXCIgZXZlbnQgb2NjdXJzLlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgQ09NUE9TSVRJT05fQlVGRkVSX01PREUgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0NvbXBvc2l0aW9uRXZlbnRNb2RlJyk7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgZGVmYXVsdCBgQ29udHJvbFZhbHVlQWNjZXNzb3JgIGZvciB3cml0aW5nIGEgdmFsdWUgYW5kIGxpc3RlbmluZyB0byBjaGFuZ2VzIG9uIGlucHV0XG4gKiBlbGVtZW50cy4gVGhlIGFjY2Vzc29yIGlzIHVzZWQgYnkgdGhlIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGBGb3JtQ29udHJvbE5hbWVgLCBhbmRcbiAqIGBOZ01vZGVsYCBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGFjY2Vzc29yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgYW4gaW5wdXQgZWxlbWVudCB0aGF0IGFjdGl2YXRlcyB0aGUgZGVmYXVsdCB2YWx1ZSBhY2Nlc3NvclxuICogKGluIHRoaXMgY2FzZSwgYSB0ZXh0IGZpZWxkKS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgZmlyc3ROYW1lQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cInRleHRcIiBbZm9ybUNvbnRyb2xdPVwiZmlyc3ROYW1lQ29udHJvbFwiPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6XG4gICAgICAnaW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbZm9ybUNvbnRyb2xOYW1lXSx0ZXh0YXJlYVtmb3JtQ29udHJvbE5hbWVdLGlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW2Zvcm1Db250cm9sXSx0ZXh0YXJlYVtmb3JtQ29udHJvbF0saW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbbmdNb2RlbF0sdGV4dGFyZWFbbmdNb2RlbF0sW25nRGVmYXVsdENvbnRyb2xdJyxcbiAgLy8gVE9ETzogdnNhdmtpbiByZXBsYWNlIHRoZSBhYm92ZSBzZWxlY3RvciB3aXRoIHRoZSBvbmUgYmVsb3cgaXQgb25jZVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMDExIGlzIGltcGxlbWVudGVkXG4gIC8vIHNlbGVjdG9yOiAnW25nTW9kZWxdLFtmb3JtQ29udHJvbF0sW2Zvcm1Db250cm9sTmFtZV0nLFxuICBob3N0OiB7XG4gICAgJyhpbnB1dCknOiAnJGFueSh0aGlzKS5faGFuZGxlSW5wdXQoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoYmx1ciknOiAnb25Ub3VjaGVkKCknLFxuICAgICcoY29tcG9zaXRpb25zdGFydCknOiAnJGFueSh0aGlzKS5fY29tcG9zaXRpb25TdGFydCgpJyxcbiAgICAnKGNvbXBvc2l0aW9uZW5kKSc6ICckYW55KHRoaXMpLl9jb21wb3NpdGlvbkVuZCgkZXZlbnQudGFyZ2V0LnZhbHVlKSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbREVGQVVMVF9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgRGVmYXVsdFZhbHVlQWNjZXNzb3IgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYW4gaW5wdXQgZXZlbnQgb2NjdXJzIG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKi9cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGEgYmx1ciBldmVudCBvY2N1cnMgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqL1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBjcmVhdGluZyBhIGNvbXBvc2l0aW9uIHN0cmluZyAoSU1FIGV2ZW50cykuICovXG4gIHByaXZhdGUgX2NvbXBvc2luZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQ09NUE9TSVRJT05fQlVGRkVSX01PREUpIHByaXZhdGUgX2NvbXBvc2l0aW9uTW9kZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlID0gIV9pc0FuZHJvaWQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgXCJ2YWx1ZVwiIHByb3BlcnR5IG9uIHRoZSBpbnB1dCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIGNoZWNrZWQgdmFsdWVcbiAgICovXG4gIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRWYWx1ZSA9IHZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgbm9ybWFsaXplZFZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgY2hhbmdlcy5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKF86IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgIHRoaXMub25DaGFuZ2UgPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgZnVuY3Rpb24gY2FsbGVkIHdoZW4gdGhlIGNvbnRyb2wgaXMgdG91Y2hlZC5cbiAgICpcbiAgICogQHBhcmFtIGZuIFRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgKi9cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIFwiZGlzYWJsZWRcIiBwcm9wZXJ0eSBvbiB0aGUgaW5wdXQgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIGlzRGlzYWJsZWQgVGhlIGRpc2FibGVkIHZhbHVlXG4gICAqL1xuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdkaXNhYmxlZCcsIGlzRGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaGFuZGxlSW5wdXQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY29tcG9zaXRpb25Nb2RlIHx8ICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgIXRoaXMuX2NvbXBvc2luZykpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbXBvc2l0aW9uU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29tcG9zaW5nID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbXBvc2l0aW9uRW5kKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9jb21wb3NpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgdGhpcy5vbkNoYW5nZSh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==