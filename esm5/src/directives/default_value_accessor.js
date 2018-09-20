/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, InjectionToken, Optional, Renderer2, forwardRef } from '@angular/core';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import * as i0 from "@angular/core";
export var DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return DefaultValueAccessor; }),
    multi: true
};
/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid() {
    var userAgent = getDOM() ? getDOM().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}
/**
 * Turn this mode on if you want form directives to buffer IME input until compositionend
 * @experimental
 */
export var COMPOSITION_BUFFER_MODE = new InjectionToken('CompositionEventMode');
/**
 * The default accessor for writing a value and listening to changes that is used by the
 * `NgModel`, `FormControlDirective`, and `FormControlName` directives.
 *
 *  ### Example
 *  ```
 *  <input type="text" name="searchQuery" ngModel>
 *  ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
var DefaultValueAccessor = /** @class */ (function () {
    function DefaultValueAccessor(_renderer, _elementRef, _compositionMode) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._compositionMode = _compositionMode;
        this.onChange = function (_) { };
        this.onTouched = function () { };
        /** Whether the user is creating a composition string (IME events). */
        this._composing = false;
        if (this._compositionMode == null) {
            this._compositionMode = !_isAndroid();
        }
    }
    DefaultValueAccessor.prototype.writeValue = function (value) {
        var normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    };
    DefaultValueAccessor.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    DefaultValueAccessor.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    DefaultValueAccessor.prototype.setDisabledState = function (isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    };
    /** @internal */
    DefaultValueAccessor.prototype._handleInput = function (value) {
        if (!this._compositionMode || (this._compositionMode && !this._composing)) {
            this.onChange(value);
        }
    };
    /** @internal */
    DefaultValueAccessor.prototype._compositionStart = function () { this._composing = true; };
    /** @internal */
    DefaultValueAccessor.prototype._compositionEnd = function (value) {
        this._composing = false;
        this._compositionMode && this.onChange(value);
    };
    DefaultValueAccessor.ngDirectiveDef = i0.ɵdefineDirective({ type: DefaultValueAccessor, selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]], factory: function DefaultValueAccessor_Factory(t) { return new (t || DefaultValueAccessor)(i0.ɵinjectRenderer2(), i0.ɵinjectElementRef(), i0.ɵdirectiveInject(COMPOSITION_BUFFER_MODE, 8)); }, hostBindings: function DefaultValueAccessor_HostBindings(dirIndex, elIndex) { i0.ɵlistener("input", function DefaultValueAccessor_input_HostBindingHandler($event) { var pd_b = (i0.ɵloadDirective(dirIndex)._handleInput($event.target.value) !== false); return pd_b; }); i0.ɵlistener("blur", function DefaultValueAccessor_blur_HostBindingHandler($event) { var pd_b = (i0.ɵloadDirective(dirIndex).onTouched() !== false); return pd_b; }); i0.ɵlistener("compositionstart", function DefaultValueAccessor_compositionstart_HostBindingHandler($event) { var pd_b = (i0.ɵloadDirective(dirIndex)._compositionStart() !== false); return pd_b; }); i0.ɵlistener("compositionend", function DefaultValueAccessor_compositionend_HostBindingHandler($event) { var pd_b = (i0.ɵloadDirective(dirIndex)._compositionEnd($event.target.value) !== false); return pd_b; }); }, features: [i0.ɵPublicFeature] });
    return DefaultValueAccessor;
}());
export { DefaultValueAccessor };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RyxPQUFPLEVBQUMsT0FBTyxJQUFJLE1BQU0sRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQzs7QUFFakYsTUFBTSxDQUFDLElBQU0sc0JBQXNCLEdBQVE7SUFDekMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLGNBQU0sT0FBQSxvQkFBb0IsRUFBcEIsQ0FBb0IsQ0FBQztJQUNuRCxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRjs7O0dBR0c7QUFDSCxTQUFTLFVBQVU7SUFDakIsSUFBTSxTQUFTLEdBQUcsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDMUQsT0FBTyxlQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsSUFBTSx1QkFBdUIsR0FBRyxJQUFJLGNBQWMsQ0FBVSxzQkFBc0IsQ0FBQyxDQUFDO0FBRTNGOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUFxQkUsOEJBQ1ksU0FBb0IsRUFBVSxXQUF1QixFQUNSLGdCQUF5QjtRQUR0RSxjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQVk7UUFDUixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVM7UUFSbEYsYUFBUSxHQUFHLFVBQUMsQ0FBTSxJQUFNLENBQUMsQ0FBQztRQUMxQixjQUFTLEdBQUcsY0FBTyxDQUFDLENBQUM7UUFFckIsc0VBQXNFO1FBQzlELGVBQVUsR0FBRyxLQUFLLENBQUM7UUFLekIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUVELHlDQUFVLEdBQVYsVUFBVyxLQUFVO1FBQ25CLElBQU0sZUFBZSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQsK0NBQWdCLEdBQWhCLFVBQWlCLEVBQW9CLElBQVUsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLGdEQUFpQixHQUFqQixVQUFrQixFQUFjLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWhFLCtDQUFnQixHQUFoQixVQUFpQixVQUFtQjtRQUNsQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELGdCQUFnQjtJQUNoQiwyQ0FBWSxHQUFaLFVBQWEsS0FBVTtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3pFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGdEQUFpQixHQUFqQixjQUE0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFFckQsZ0JBQWdCO0lBQ2hCLDhDQUFlLEdBQWYsVUFBZ0IsS0FBVTtRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxDQUFDO3NFQXpDVSxvQkFBb0Isb1hBQXBCLG9CQUFvQixxRUFTUCx1QkFBdUI7K0JBcEVqRDtDQXFHQyxBQXhERCxJQXdEQztTQTFDWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbGVtZW50UmVmLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBPcHRpb25hbCwgUmVuZGVyZXIyLCBmb3J3YXJkUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ybVnZXRET00gYXMgZ2V0RE9NfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGVmYXVsdFZhbHVlQWNjZXNzb3IpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBXZSBtdXN0IGNoZWNrIHdoZXRoZXIgdGhlIGFnZW50IGlzIEFuZHJvaWQgYmVjYXVzZSBjb21wb3NpdGlvbiBldmVudHNcbiAqIGJlaGF2ZSBkaWZmZXJlbnRseSBiZXR3ZWVuIGlPUyBhbmQgQW5kcm9pZC5cbiAqL1xuZnVuY3Rpb24gX2lzQW5kcm9pZCgpOiBib29sZWFuIHtcbiAgY29uc3QgdXNlckFnZW50ID0gZ2V0RE9NKCkgPyBnZXRET00oKS5nZXRVc2VyQWdlbnQoKSA6ICcnO1xuICByZXR1cm4gL2FuZHJvaWQgKFxcZCspLy50ZXN0KHVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcbn1cblxuLyoqXG4gKiBUdXJuIHRoaXMgbW9kZSBvbiBpZiB5b3Ugd2FudCBmb3JtIGRpcmVjdGl2ZXMgdG8gYnVmZmVyIElNRSBpbnB1dCB1bnRpbCBjb21wb3NpdGlvbmVuZFxuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgY29uc3QgQ09NUE9TSVRJT05fQlVGRkVSX01PREUgPSBuZXcgSW5qZWN0aW9uVG9rZW48Ym9vbGVhbj4oJ0NvbXBvc2l0aW9uRXZlbnRNb2RlJyk7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgYWNjZXNzb3IgZm9yIHdyaXRpbmcgYSB2YWx1ZSBhbmQgbGlzdGVuaW5nIHRvIGNoYW5nZXMgdGhhdCBpcyB1c2VkIGJ5IHRoZVxuICogYE5nTW9kZWxgLCBgRm9ybUNvbnRyb2xEaXJlY3RpdmVgLCBhbmQgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlcy5cbiAqXG4gKiAgIyMjIEV4YW1wbGVcbiAqICBgYGBcbiAqICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwic2VhcmNoUXVlcnlcIiBuZ01vZGVsPlxuICogIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQG5nTW9kdWxlIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOlxuICAgICAgJ2lucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW2Zvcm1Db250cm9sTmFtZV0sdGV4dGFyZWFbZm9ybUNvbnRyb2xOYW1lXSxpbnB1dDpub3QoW3R5cGU9Y2hlY2tib3hdKVtmb3JtQ29udHJvbF0sdGV4dGFyZWFbZm9ybUNvbnRyb2xdLGlucHV0Om5vdChbdHlwZT1jaGVja2JveF0pW25nTW9kZWxdLHRleHRhcmVhW25nTW9kZWxdLFtuZ0RlZmF1bHRDb250cm9sXScsXG4gIC8vIFRPRE86IHZzYXZraW4gcmVwbGFjZSB0aGUgYWJvdmUgc2VsZWN0b3Igd2l0aCB0aGUgb25lIGJlbG93IGl0IG9uY2VcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMzAxMSBpcyBpbXBsZW1lbnRlZFxuICAvLyBzZWxlY3RvcjogJ1tuZ01vZGVsXSxbZm9ybUNvbnRyb2xdLFtmb3JtQ29udHJvbE5hbWVdJyxcbiAgaG9zdDoge1xuICAgICcoaW5wdXQpJzogJyRhbnkodGhpcykuX2hhbmRsZUlucHV0KCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGJsdXIpJzogJ29uVG91Y2hlZCgpJyxcbiAgICAnKGNvbXBvc2l0aW9uc3RhcnQpJzogJyRhbnkodGhpcykuX2NvbXBvc2l0aW9uU3RhcnQoKScsXG4gICAgJyhjb21wb3NpdGlvbmVuZCknOiAnJGFueSh0aGlzKS5fY29tcG9zaXRpb25FbmQoJGV2ZW50LnRhcmdldC52YWx1ZSknXG4gIH0sXG4gIHByb3ZpZGVyczogW0RFRkFVTFRfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIERlZmF1bHRWYWx1ZUFjY2Vzc29yIGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICAvKiogV2hldGhlciB0aGUgdXNlciBpcyBjcmVhdGluZyBhIGNvbXBvc2l0aW9uIHN0cmluZyAoSU1FIGV2ZW50cykuICovXG4gIHByaXZhdGUgX2NvbXBvc2luZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQ09NUE9TSVRJT05fQlVGRkVSX01PREUpIHByaXZhdGUgX2NvbXBvc2l0aW9uTW9kZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLl9jb21wb3NpdGlvbk1vZGUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fY29tcG9zaXRpb25Nb2RlID0gIV9pc0FuZHJvaWQoKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSB2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIG5vcm1hbGl6ZWRWYWx1ZSk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAoXzogYW55KSA9PiB2b2lkKTogdm9pZCB7IHRoaXMub25DaGFuZ2UgPSBmbjsgfVxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnZGlzYWJsZWQnLCBpc0Rpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2hhbmRsZUlucHV0KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX2NvbXBvc2l0aW9uTW9kZSB8fCAodGhpcy5fY29tcG9zaXRpb25Nb2RlICYmICF0aGlzLl9jb21wb3NpbmcpKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jb21wb3NpdGlvblN0YXJ0KCk6IHZvaWQgeyB0aGlzLl9jb21wb3NpbmcgPSB0cnVlOyB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY29tcG9zaXRpb25FbmQodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX2NvbXBvc2luZyA9IGZhbHNlO1xuICAgIHRoaXMuX2NvbXBvc2l0aW9uTW9kZSAmJiB0aGlzLm9uQ2hhbmdlKHZhbHVlKTtcbiAgfVxufVxuIl19