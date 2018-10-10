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
 * \@experimental
  @type {?} */
export const COMPOSITION_BUFFER_MODE = new InjectionToken('CompositionEventMode');
/**
 * The default accessor for writing a value and listening to changes that is used by the
 * `NgModel`, `FormControlDirective`, and `FormControlName` directives.
 *
 * \@usageNotes
 * ### Example
 *
 * ```
 * <input type="text" name="searchQuery" ngModel>
 * ```
 *
 * \@ngModule FormsModule
 * \@ngModule ReactiveFormsModule
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
        this.onChange = (_) => { };
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
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        /** @type {?} */
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
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
DefaultValueAccessor.ngDirectiveDef = i0.ɵdefineDirective({ type: DefaultValueAccessor, selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]], factory: function DefaultValueAccessor_Factory(t) { return new (t || DefaultValueAccessor)(i0.ɵinjectRenderer2(), i0.ɵdirectiveInject(ElementRef), i0.ɵdirectiveInject(COMPOSITION_BUFFER_MODE, 8)); }, hostBindings: function DefaultValueAccessor_HostBindings(dirIndex, elIndex) { i0.ɵlistener("input", function DefaultValueAccessor_input_HostBindingHandler($event) { const pd_b = (i0.ɵload(dirIndex)._handleInput($event.target.value) !== false); return pd_b; }); i0.ɵlistener("blur", function DefaultValueAccessor_blur_HostBindingHandler($event) { const pd_b = (i0.ɵload(dirIndex).onTouched() !== false); return pd_b; }); i0.ɵlistener("compositionstart", function DefaultValueAccessor_compositionstart_HostBindingHandler($event) { const pd_b = (i0.ɵload(dirIndex)._compositionStart() !== false); return pd_b; }); i0.ɵlistener("compositionend", function DefaultValueAccessor_compositionend_HostBindingHandler($event) { const pd_b = (i0.ɵload(dirIndex)._compositionEnd($event.target.value) !== false); return pd_b; }); }, features: [i0.ɵPublicFeature] });
if (false) {
    /** @type {?} */
    DefaultValueAccessor.prototype.onChange;
    /** @type {?} */
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RyxPQUFPLEVBQUMsT0FBTyxJQUFJLE1BQU0sRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFFakYsYUFBYSxzQkFBc0IsR0FBUTtJQUN6QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLENBQUM7SUFDbkQsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDOzs7Ozs7QUFNRixTQUFTLFVBQVU7O0lBQ2pCLE1BQU0sU0FBUyxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzFELE9BQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztDQUN0RDs7Ozs7QUFNRCxhQUFhLHVCQUF1QixHQUFHLElBQUksY0FBYyxDQUFVLHNCQUFzQixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7OztBQThCM0YsTUFBTSxPQUFPLG9CQUFvQjs7Ozs7O0lBTy9CLFlBQ1ksV0FBOEIsV0FBdUIsRUFDUixnQkFBeUI7UUFEdEUsY0FBUyxHQUFULFNBQVM7UUFBcUIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDUixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVM7UUFSbEYsZ0JBQVcsQ0FBQyxDQUFNLEVBQUUsRUFBRSxJQUFHLENBQUM7UUFDMUIsaUJBQVksR0FBRyxFQUFFLElBQUcsQ0FBQzs7OzswQkFHQSxLQUFLO1FBS3hCLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksRUFBRTtZQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUN2QztLQUNGOzs7OztJQUVELFVBQVUsQ0FBQyxLQUFVOztRQUNuQixNQUFNLGVBQWUsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7S0FDdEY7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsRUFBb0IsSUFBVSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFOzs7OztJQUNwRSxpQkFBaUIsQ0FBQyxFQUFjLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRTs7Ozs7SUFFaEUsZ0JBQWdCLENBQUMsVUFBbUI7UUFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ3BGOzs7Ozs7SUFHRCxZQUFZLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7S0FDRjs7Ozs7SUFHRCxpQkFBaUIsS0FBVyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFOzs7Ozs7SUFHckQsZUFBZSxDQUFDLEtBQVU7UUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDL0M7OztZQXZERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUNKLDhNQUE4TTs7OztnQkFJbE4sSUFBSSxFQUFFO29CQUNKLFNBQVMsRUFBRSw4Q0FBOEM7b0JBQ3pELFFBQVEsRUFBRSxhQUFhO29CQUN2QixvQkFBb0IsRUFBRSxnQ0FBZ0M7b0JBQ3RELGtCQUFrQixFQUFFLGlEQUFpRDtpQkFDdEU7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7YUFDcEM7Ozs7WUFwRGdFLFNBQVM7WUFBdkQsVUFBVTswQ0E4RHRCLFFBQVEsWUFBSSxNQUFNLFNBQUMsdUJBQXVCOztrRUFUcEMsb0JBQW9CLG9YQUFwQixvQkFBb0IsNkNBUXdCLFVBQVUsdUJBQ3pDLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsLCBSZW5kZXJlcjIsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHvJtWdldERPTSBhcyBnZXRET019IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBEZWZhdWx0VmFsdWVBY2Nlc3NvciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIFdlIG11c3QgY2hlY2sgd2hldGhlciB0aGUgYWdlbnQgaXMgQW5kcm9pZCBiZWNhdXNlIGNvbXBvc2l0aW9uIGV2ZW50c1xuICogYmVoYXZlIGRpZmZlcmVudGx5IGJldHdlZW4gaU9TIGFuZCBBbmRyb2lkLlxuICovXG5mdW5jdGlvbiBfaXNBbmRyb2lkKCk6IGJvb2xlYW4ge1xuICBjb25zdCB1c2VyQWdlbnQgPSBnZXRET00oKSA/IGdldERPTSgpLmdldFVzZXJBZ2VudCgpIDogJyc7XG4gIHJldHVybiAvYW5kcm9pZCAoXFxkKykvLnRlc3QodXNlckFnZW50LnRvTG93ZXJDYXNlKCkpO1xufVxuXG4vKipcbiAqIFR1cm4gdGhpcyBtb2RlIG9uIGlmIHlvdSB3YW50IGZvcm0gZGlyZWN0aXZlcyB0byBidWZmZXIgSU1FIGlucHV0IHVudGlsIGNvbXBvc2l0aW9uZW5kXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBjb25zdCBDT01QT1NJVElPTl9CVUZGRVJfTU9ERSA9IG5ldyBJbmplY3Rpb25Ub2tlbjxib29sZWFuPignQ29tcG9zaXRpb25FdmVudE1vZGUnKTtcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBhY2Nlc3NvciBmb3Igd3JpdGluZyBhIHZhbHVlIGFuZCBsaXN0ZW5pbmcgdG8gY2hhbmdlcyB0aGF0IGlzIHVzZWQgYnkgdGhlXG4gKiBgTmdNb2RlbGAsIGBGb3JtQ29udHJvbERpcmVjdGl2ZWAsIGFuZCBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIGBgYFxuICogPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cInNlYXJjaFF1ZXJ5XCIgbmdNb2RlbD5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ2lucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW2Zvcm1Db250cm9sTmFtZV0sdGV4dGFyZWFbZm9ybUNvbnRyb2xOYW1lXSxpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtmb3JtQ29udHJvbF0sdGV4dGFyZWFbZm9ybUNvbnRyb2xdLGlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW25nTW9kZWxdLHRleHRhcmVhW25nTW9kZWxdLFtuZ0RlZmF1bHRDb250cm9sXScsXG4gIC8vIFRPRE86IHZzYXZraW4gcmVwbGFjZSB0aGUgYWJvdmUgc2VsZWN0b3Igd2l0aCB0aGUgb25lIGJlbG93IGl0IG9uY2VcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzAxMSBpcyBpbXBsZW1lbnRlZFxuICAvLyBzZWxlY3RvcjogJ1tuZ01vZGVsXSxbZm9ybUNvbnRyb2xdLFtmb3JtQ29udHJvbE5hbWVdJyxcbiAgaG9zdDoge1xuICAgICcoaW5wdXQpJzogJyRhbnkodGhpcykuX2hhbmRsZUlucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyxcbiAgICAnKGNvbXBvc2l0aW9uc3RhcnQpJzogJyRhbnkodGhpcykuX2NvbXBvc2l0aW9uU3RhcnQoKScsXG4gICAgJyhjb21wb3NpdGlvbmVuZCknOiAnJGFueSh0aGlzKS5fY29tcG9zaXRpb25FbmQoJGV2ZW50LnRhcmdldC52YWx1ZSknXG4gIH0sXG4gIHByb3ZpZGVyczogW0RFRkFVTFRfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBjcmVhdGluZyBhIGNvbXBvc2l0aW9uIHN0cmluZyAoSU1FIGV2ZW50cykuICovXG4gIHByaXZhdGUgX2NvbXBvc2luZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQ09NUE9TSVRJT05fQlVGRkVSX01PREUpIHByaXZhdGUgX2NvbXBvc2l0aW9uTW9kZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlID0gIV9pc0FuZHJvaWQoKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7IHRoaXMub25DaGFuZ2UgPSBmbjsgfVxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2hhbmRsZUlucHV0KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2NvbXBvc2l0aW9uTW9kZSB8fCAodGhpcy5fY29tcG9zaXRpb25Nb2RlICYmICF0aGlzLl9jb21wb3NpbmcpKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jb21wb3NpdGlvblN0YXJ0KCk6IHZvaWQgeyB0aGlzLl9jb21wb3NpbmcgPSB0cnVlOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29tcG9zaXRpb25FbmQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2NvbXBvc2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX2NvbXBvc2l0aW9uTW9kZSAmJiB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgfVxufVxuIl19