/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵgetDOM as getDOM } from '@angular/common';
import { Directive, ElementRef, forwardRef, Inject, InjectionToken, Optional, Renderer2 } from '@angular/core';
import { BaseControlValueAccessor, NG_VALUE_ACCESSOR } from './control_value_accessor';
import * as i0 from "@angular/core";
export const DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DefaultValueAccessor),
    multi: true
};
/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid() {
    const userAgent = getDOM() ? getDOM().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}
/**
 * @description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * @publicApi
 */
export const COMPOSITION_BUFFER_MODE = new InjectionToken('CompositionEventMode');
/**
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * {@searchKeywords ngDefaultControl}
 *
 * @usageNotes
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
 * This value accessor is used by default for `<input type="text">` and `<textarea>` elements, but
 * you could also use it for custom components that have similar behavior and do not require special
 * processing. In order to attach the default value accessor to a custom element, add the
 * `ngDefaultControl` attribute as shown below.
 *
 * ```
 * <custom-input-component ngDefaultControl [(ngModel)]="value"></custom-input-component>
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class DefaultValueAccessor extends BaseControlValueAccessor {
    constructor(renderer, elementRef, _compositionMode) {
        super(renderer, elementRef);
        this._compositionMode = _compositionMode;
        /** Whether the user is creating a composition string (IME events). */
        this._composing = false;
        if (this._compositionMode == null) {
            this._compositionMode = !_isAndroid();
        }
    }
    /**
     * Sets the "value" property on the input element.
     * @nodoc
     */
    writeValue(value) {
        const normalizedValue = value == null ? '' : value;
        this.setProperty('value', normalizedValue);
    }
    /** @internal */
    _handleInput(value) {
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
            this.onChange(value);
        }
    }
    /** @internal */
    _compositionStart() {
        this._composing = true;
    }
    /** @internal */
    _compositionEnd(value) {
        this._composing = false;
        this._compositionMode && this.onChange(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.1+sha-9005717", ngImport: i0, type: DefaultValueAccessor, deps: [{ token: i0.Renderer2 }, { token: i0.ElementRef }, { token: COMPOSITION_BUFFER_MODE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.1+sha-9005717", type: DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]", host: { listeners: { "input": "$any(this)._handleInput($event.target.value)", "blur": "onTouched()", "compositionstart": "$any(this)._compositionStart()", "compositionend": "$any(this)._compositionEnd($event.target.value)" } }, providers: [DEFAULT_VALUE_ACCESSOR], usesInheritance: true, ngImport: i0 }); }
}
export { DefaultValueAccessor };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.1+sha-9005717", ngImport: i0, type: DefaultValueAccessor, decorators: [{
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
        }], ctorParameters: function () { return [{ type: i0.Renderer2 }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [COMPOSITION_BUFFER_MODE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLE9BQU8sSUFBSSxNQUFNLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRTdHLE9BQU8sRUFBQyx3QkFBd0IsRUFBd0IsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7QUFFM0csTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBQVE7SUFDekMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0lBQ25ELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7R0FHRztBQUNILFNBQVMsVUFBVTtJQUNqQixNQUFNLFNBQVMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxRCxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxjQUFjLENBQVUsc0JBQXNCLENBQUMsQ0FBQztBQUUzRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUNILE1BY2Esb0JBQXFCLFNBQVEsd0JBQXdCO0lBSWhFLFlBQ0ksUUFBbUIsRUFBRSxVQUFzQixFQUNVLGdCQUF5QjtRQUNoRixLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRDJCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUztRQUxsRixzRUFBc0U7UUFDOUQsZUFBVSxHQUFHLEtBQUssQ0FBQztRQU16QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLEVBQUU7WUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDdkM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsVUFBVSxDQUFDLEtBQVU7UUFDbkIsTUFBTSxlQUFlLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELGdCQUFnQjtJQUNoQixZQUFZLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGlCQUFpQjtRQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZUFBZSxDQUFDLEtBQVU7UUFDeEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQzt5SEF0Q1Usb0JBQW9CLHFFQU1QLHVCQUF1Qjs2R0FOcEMsb0JBQW9CLDJjQUZwQixDQUFDLHNCQUFzQixDQUFDOztTQUV4QixvQkFBb0I7c0dBQXBCLG9CQUFvQjtrQkFkaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQ0osOE1BQThNO29CQUNsTixzRUFBc0U7b0JBQ3RFLGdFQUFnRTtvQkFDaEUseURBQXlEO29CQUN6RCxJQUFJLEVBQUU7d0JBQ0osU0FBUyxFQUFFLDhDQUE4Qzt3QkFDekQsUUFBUSxFQUFFLGFBQWE7d0JBQ3ZCLG9CQUFvQixFQUFFLGdDQUFnQzt3QkFDdEQsa0JBQWtCLEVBQUUsaURBQWlEO3FCQUN0RTtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDcEM7OzBCQU9NLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7ybVnZXRET00gYXMgZ2V0RE9NfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIGZvcndhcmRSZWYsIEluamVjdCwgSW5qZWN0aW9uVG9rZW4sIE9wdGlvbmFsLCBSZW5kZXJlcjJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Jhc2VDb250cm9sVmFsdWVBY2Nlc3NvciwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGVmYXVsdFZhbHVlQWNjZXNzb3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBXZSBtdXN0IGNoZWNrIHdoZXRoZXIgdGhlIGFnZW50IGlzIEFuZHJvaWQgYmVjYXVzZSBjb21wb3NpdGlvbiBldmVudHNcbiAqIGJlaGF2ZSBkaWZmZXJlbnRseSBiZXR3ZWVuIGlPUyBhbmQgQW5kcm9pZC5cbiAqL1xuZnVuY3Rpb24gX2lzQW5kcm9pZCgpOiBib29sZWFuIHtcbiAgY29uc3QgdXNlckFnZW50ID0gZ2V0RE9NKCkgPyBnZXRET00oKS5nZXRVc2VyQWdlbnQoKSA6ICcnO1xuICByZXR1cm4gL2FuZHJvaWQgKFxcZCspLy50ZXN0KHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGUgdGhpcyB0b2tlbiB0byBjb250cm9sIGlmIGZvcm0gZGlyZWN0aXZlcyBidWZmZXIgSU1FIGlucHV0IHVudGlsXG4gKiB0aGUgXCJjb21wb3NpdGlvbmVuZFwiIGV2ZW50IG9jY3Vycy5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFID0gbmV3IEluamVjdGlvblRva2VuPGJvb2xlYW4+KCdDb21wb3NpdGlvbkV2ZW50TW9kZScpO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IGBDb250cm9sVmFsdWVBY2Nlc3NvcmAgZm9yIHdyaXRpbmcgYSB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIGNoYW5nZXMgb24gaW5wdXRcbiAqIGVsZW1lbnRzLiBUaGUgYWNjZXNzb3IgaXMgdXNlZCBieSB0aGUgYEZvcm1Db250cm9sRGlyZWN0aXZlYCwgYEZvcm1Db250cm9sTmFtZWAsIGFuZFxuICogYE5nTW9kZWxgIGRpcmVjdGl2ZXMuXG4gKlxuICoge0BzZWFyY2hLZXl3b3JkcyBuZ0RlZmF1bHRDb250cm9sfVxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIFVzaW5nIHRoZSBkZWZhdWx0IHZhbHVlIGFjY2Vzc29yXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byB1c2UgYW4gaW5wdXQgZWxlbWVudCB0aGF0IGFjdGl2YXRlcyB0aGUgZGVmYXVsdCB2YWx1ZSBhY2Nlc3NvclxuICogKGluIHRoaXMgY2FzZSwgYSB0ZXh0IGZpZWxkKS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgZmlyc3ROYW1lQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCgpO1xuICogYGBgXG4gKlxuICogYGBgXG4gKiA8aW5wdXQgdHlwZT1cInRleHRcIiBbZm9ybUNvbnRyb2xdPVwiZmlyc3ROYW1lQ29udHJvbFwiPlxuICogYGBgXG4gKlxuICogVGhpcyB2YWx1ZSBhY2Nlc3NvciBpcyB1c2VkIGJ5IGRlZmF1bHQgZm9yIGA8aW5wdXQgdHlwZT1cInRleHRcIj5gIGFuZCBgPHRleHRhcmVhPmAgZWxlbWVudHMsIGJ1dFxuICogeW91IGNvdWxkIGFsc28gdXNlIGl0IGZvciBjdXN0b20gY29tcG9uZW50cyB0aGF0IGhhdmUgc2ltaWxhciBiZWhhdmlvciBhbmQgZG8gbm90IHJlcXVpcmUgc3BlY2lhbFxuICogcHJvY2Vzc2luZy4gSW4gb3JkZXIgdG8gYXR0YWNoIHRoZSBkZWZhdWx0IHZhbHVlIGFjY2Vzc29yIHRvIGEgY3VzdG9tIGVsZW1lbnQsIGFkZCB0aGVcbiAqIGBuZ0RlZmF1bHRDb250cm9sYCBhdHRyaWJ1dGUgYXMgc2hvd24gYmVsb3cuXG4gKlxuICogYGBgXG4gKiA8Y3VzdG9tLWlucHV0LWNvbXBvbmVudCBuZ0RlZmF1bHRDb250cm9sIFsobmdNb2RlbCldPVwidmFsdWVcIj48L2N1c3RvbS1pbnB1dC1jb21wb25lbnQ+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjpcbiAgICAgICdpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtmb3JtQ29udHJvbE5hbWVdLHRleHRhcmVhW2Zvcm1Db250cm9sTmFtZV0saW5wdXQ6bm90KFt0eXBlPWNoZWNrYm94XSlbZm9ybUNvbnRyb2xdLHRleHRhcmVhW2Zvcm1Db250cm9sXSxpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtuZ01vZGVsXSx0ZXh0YXJlYVtuZ01vZGVsXSxbbmdEZWZhdWx0Q29udHJvbF0nLFxuICAvLyBUT0RPOiB2c2F2a2luIHJlcGxhY2UgdGhlIGFib3ZlIHNlbGVjdG9yIHdpdGggdGhlIG9uZSBiZWxvdyBpdCBvbmNlXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzMwMTEgaXMgaW1wbGVtZW50ZWRcbiAgLy8gc2VsZWN0b3I6ICdbbmdNb2RlbF0sW2Zvcm1Db250cm9sXSxbZm9ybUNvbnRyb2xOYW1lXScsXG4gIGhvc3Q6IHtcbiAgICAnKGlucHV0KSc6ICckYW55KHRoaXMpLl9oYW5kbGVJbnB1dCgkZXZlbnQudGFyZ2V0LnZhbHVlKScsXG4gICAgJyhibHVyKSc6ICdvblRvdWNoZWQoKScsXG4gICAgJyhjb21wb3NpdGlvbnN0YXJ0KSc6ICckYW55KHRoaXMpLl9jb21wb3NpdGlvblN0YXJ0KCknLFxuICAgICcoY29tcG9zaXRpb25lbmQpJzogJyRhbnkodGhpcykuX2NvbXBvc2l0aW9uRW5kKCRldmVudC50YXJnZXQudmFsdWUpJ1xuICB9LFxuICBwcm92aWRlcnM6IFtERUZBVUxUX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBEZWZhdWx0VmFsdWVBY2Nlc3NvciBleHRlbmRzIEJhc2VDb250cm9sVmFsdWVBY2Nlc3NvciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgLyoqIFdoZXRoZXIgdGhlIHVzZXIgaXMgY3JlYXRpbmcgYSBjb21wb3NpdGlvbiBzdHJpbmcgKElNRSBldmVudHMpLiAqL1xuICBwcml2YXRlIF9jb21wb3NpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KENPTVBPU0lUSU9OX0JVRkZFUl9NT0RFKSBwcml2YXRlIF9jb21wb3NpdGlvbk1vZGU6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihyZW5kZXJlciwgZWxlbWVudFJlZik7XG4gICAgaWYgKHRoaXMuX2NvbXBvc2l0aW9uTW9kZSA9PSBudWxsKSB7XG4gICAgICB0aGlzLl9jb21wb3NpdGlvbk1vZGUgPSAhX2lzQW5kcm9pZCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBcInZhbHVlXCIgcHJvcGVydHkgb24gdGhlIGlucHV0IGVsZW1lbnQuXG4gICAqIEBub2RvY1xuICAgKi9cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gdmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWU7XG4gICAgdGhpcy5zZXRQcm9wZXJ0eSgndmFsdWUnLCBub3JtYWxpemVkVmFsdWUpO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfaGFuZGxlSW5wdXQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fY29tcG9zaXRpb25Nb2RlIHx8ICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgIXRoaXMuX2NvbXBvc2luZykpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbXBvc2l0aW9uU3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29tcG9zaW5nID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2NvbXBvc2l0aW9uRW5kKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLl9jb21wb3NpbmcgPSBmYWxzZTtcbiAgICB0aGlzLl9jb21wb3NpdGlvbk1vZGUgJiYgdGhpcy5vbkNoYW5nZSh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==