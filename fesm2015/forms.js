/**
 * @license Angular v10.0.0-rc.0+315.sha-a5c3073
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

import { InjectionToken, forwardRef, ɵɵdirectiveInject, Renderer2, ElementRef, ɵɵdefineDirective, ɵɵlistener, ɵɵProvidersFeature, ɵsetClassMetadata, Directive, Optional, Inject, ɵɵclassProp, ɵɵInheritDefinitionFeature, Self, ɵisPromise, ɵisObservable, ɵɵdefineInjectable, Injectable, Injector, Input, Host, isDevMode, EventEmitter, ɵɵgetInheritedFactory, SkipSelf, ɵɵNgOnChangesFeature, Output, ɵɵattribute, ɵɵdefineNgModule, ɵɵdefineInjector, ɵɵsetNgModuleScope, NgModule, Version } from '@angular/core';
import { ɵgetDOM } from '@angular/common';
import { forkJoin, from } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Used to provide a `ControlValueAccessor` for form controls.
 *
 * See `DefaultValueAccessor` for how to implement one.
 *
 * @publicApi
 */
const NG_VALUE_ACCESSOR = new InjectionToken('NgValueAccessor');

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxControlValueAccessor),
    multi: true,
};
/**
 * @description
 * A `ControlValueAccessor` for writing a value and listening to changes on a checkbox input
 * element.
 *
 * @usageNotes
 *
 * ### Using a checkbox with a reactive form.
 *
 * The following example shows how to use a checkbox with a reactive form.
 *
 * ```ts
 * const rememberLoginControl = new FormControl();
 * ```
 *
 * ```
 * <input type="checkbox" [formControl]="rememberLoginControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class CheckboxControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * @description
         * The registered callback function called when a change event occurs on the input element.
         */
        this.onChange = (_) => { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
    }
    /**
     * Sets the "checked" property on the input element.
     *
     * @param value The checked value
     */
    writeValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'checked', value);
    }
    /**
     * @description
     * Registers a function called when the control value changes.
     *
     * @param fn The callback function
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the "disabled" property on the input element.
     *
     * @param isDisabled The disabled value
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}
CheckboxControlValueAccessor.ɵfac = function CheckboxControlValueAccessor_Factory(t) { return new (t || CheckboxControlValueAccessor)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef)); };
CheckboxControlValueAccessor.ɵdir = ɵɵdefineDirective({ type: CheckboxControlValueAccessor, selectors: [["input", "type", "checkbox", "formControlName", ""], ["input", "type", "checkbox", "formControl", ""], ["input", "type", "checkbox", "ngModel", ""]], hostBindings: function CheckboxControlValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("change", function CheckboxControlValueAccessor_change_HostBindingHandler($event) { return ctx.onChange($event.target.checked); })("blur", function CheckboxControlValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); });
    } }, features: [ɵɵProvidersFeature([CHECKBOX_VALUE_ACCESSOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(CheckboxControlValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
                host: { '(change)': 'onChange($event.target.checked)', '(blur)': 'onTouched()' },
                providers: [CHECKBOX_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: Renderer2 }, { type: ElementRef }]; }, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const DEFAULT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DefaultValueAccessor),
    multi: true
};
/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid() {
    const userAgent = ɵgetDOM() ? ɵgetDOM().getUserAgent() : '';
    return /android (\d+)/.test(userAgent.toLowerCase());
}
/**
 * @description
 * Provide this token to control if form directives buffer IME input until
 * the "compositionend" event occurs.
 * @publicApi
 */
const COMPOSITION_BUFFER_MODE = new InjectionToken('CompositionEventMode');
/**
 * @description
 * The default `ControlValueAccessor` for writing a value and listening to changes on input
 * elements. The accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
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
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class DefaultValueAccessor {
    constructor(_renderer, _elementRef, _compositionMode) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._compositionMode = _compositionMode;
        /**
         * @description
         * The registered callback function called when an input event occurs on the input element.
         */
        this.onChange = (_) => { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
        /** Whether the user is creating a composition string (IME events). */
        this._composing = false;
        if (this._compositionMode == null) {
            this._compositionMode = !_isAndroid();
        }
    }
    /**
     * Sets the "value" property on the input element.
     *
     * @param value The checked value
     */
    writeValue(value) {
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    }
    /**
     * @description
     * Registers a function called when the control value changes.
     *
     * @param fn The callback function
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the "disabled" property on the input element.
     *
     * @param isDisabled The disabled value
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
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
}
DefaultValueAccessor.ɵfac = function DefaultValueAccessor_Factory(t) { return new (t || DefaultValueAccessor)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(COMPOSITION_BUFFER_MODE, 8)); };
DefaultValueAccessor.ɵdir = ɵɵdefineDirective({ type: DefaultValueAccessor, selectors: [["input", "formControlName", "", 3, "type", "checkbox"], ["textarea", "formControlName", ""], ["input", "formControl", "", 3, "type", "checkbox"], ["textarea", "formControl", ""], ["input", "ngModel", "", 3, "type", "checkbox"], ["textarea", "ngModel", ""], ["", "ngDefaultControl", ""]], hostBindings: function DefaultValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("input", function DefaultValueAccessor_input_HostBindingHandler($event) { return ctx._handleInput($event.target.value); })("blur", function DefaultValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); })("compositionstart", function DefaultValueAccessor_compositionstart_HostBindingHandler() { return ctx._compositionStart(); })("compositionend", function DefaultValueAccessor_compositionend_HostBindingHandler($event) { return ctx._compositionEnd($event.target.value); });
    } }, features: [ɵɵProvidersFeature([DEFAULT_VALUE_ACCESSOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(DefaultValueAccessor, [{
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
    }], function () { return [{ type: Renderer2 }, { type: ElementRef }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [COMPOSITION_BUFFER_MODE]
            }] }]; }, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @description
 * Base class for control directives.
 *
 * This class is only used internally in the `ReactiveFormsModule` and the `FormsModule`.
 *
 * @publicApi
 */
class AbstractControlDirective {
    /**
     * @description
     * Reports the value of the control if it is present, otherwise null.
     */
    get value() {
        return this.control ? this.control.value : null;
    }
    /**
     * @description
     * Reports whether the control is valid. A control is considered valid if no
     * validation errors exist with the current value.
     * If the control is not present, null is returned.
     */
    get valid() {
        return this.control ? this.control.valid : null;
    }
    /**
     * @description
     * Reports whether the control is invalid, meaning that an error exists in the input value.
     * If the control is not present, null is returned.
     */
    get invalid() {
        return this.control ? this.control.invalid : null;
    }
    /**
     * @description
     * Reports whether a control is pending, meaning that that async validation is occurring and
     * errors are not yet available for the input value. If the control is not present, null is
     * returned.
     */
    get pending() {
        return this.control ? this.control.pending : null;
    }
    /**
     * @description
     * Reports whether the control is disabled, meaning that the control is disabled
     * in the UI and is exempt from validation checks and excluded from aggregate
     * values of ancestor controls. If the control is not present, null is returned.
     */
    get disabled() {
        return this.control ? this.control.disabled : null;
    }
    /**
     * @description
     * Reports whether the control is enabled, meaning that the control is included in ancestor
     * calculations of validity or value. If the control is not present, null is returned.
     */
    get enabled() {
        return this.control ? this.control.enabled : null;
    }
    /**
     * @description
     * Reports the control's validation errors. If the control is not present, null is returned.
     */
    get errors() {
        return this.control ? this.control.errors : null;
    }
    /**
     * @description
     * Reports whether the control is pristine, meaning that the user has not yet changed
     * the value in the UI. If the control is not present, null is returned.
     */
    get pristine() {
        return this.control ? this.control.pristine : null;
    }
    /**
     * @description
     * Reports whether the control is dirty, meaning that the user has changed
     * the value in the UI. If the control is not present, null is returned.
     */
    get dirty() {
        return this.control ? this.control.dirty : null;
    }
    /**
     * @description
     * Reports whether the control is touched, meaning that the user has triggered
     * a `blur` event on it. If the control is not present, null is returned.
     */
    get touched() {
        return this.control ? this.control.touched : null;
    }
    /**
     * @description
     * Reports the validation status of the control. Possible values include:
     * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
     * If the control is not present, null is returned.
     */
    get status() {
        return this.control ? this.control.status : null;
    }
    /**
     * @description
     * Reports whether the control is untouched, meaning that the user has not yet triggered
     * a `blur` event on it. If the control is not present, null is returned.
     */
    get untouched() {
        return this.control ? this.control.untouched : null;
    }
    /**
     * @description
     * Returns a multicasting observable that emits a validation status whenever it is
     * calculated for the control. If the control is not present, null is returned.
     */
    get statusChanges() {
        return this.control ? this.control.statusChanges : null;
    }
    /**
     * @description
     * Returns a multicasting observable of value changes for the control that emits every time the
     * value of the control changes in the UI or programmatically.
     * If the control is not present, null is returned.
     */
    get valueChanges() {
        return this.control ? this.control.valueChanges : null;
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return null;
    }
    /**
     * @description
     * Resets the control with the provided value if the control is present.
     */
    reset(value = undefined) {
        if (this.control)
            this.control.reset(value);
    }
    /**
     * @description
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * If no path is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode, path) {
        return this.control ? this.control.hasError(errorCode, path) : false;
    }
    /**
     * @description
     * Reports error data for the control with the given path.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode, path) {
        return this.control ? this.control.getError(errorCode, path) : null;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @description
 * A base class for directives that contain multiple registered instances of `NgControl`.
 * Only used by the forms module.
 *
 * @publicApi
 */
class ControlContainer extends AbstractControlDirective {
    /**
     * @description
     * The top-level form directive for the control.
     */
    get formDirective() {
        return null;
    }
    /**
     * @description
     * The path to this group.
     */
    get path() {
        return null;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function unimplemented() {
    throw new Error('unimplemented');
}
/**
 * @description
 * A base class that all control `FormControl`-based directives extend. It binds a `FormControl`
 * object to a DOM element.
 *
 * @publicApi
 */
class NgControl extends AbstractControlDirective {
    constructor() {
        super(...arguments);
        /**
         * @description
         * The parent form for the control.
         *
         * @internal
         */
        this._parent = null;
        /**
         * @description
         * The name for the control
         */
        this.name = null;
        /**
         * @description
         * The value accessor for the control
         */
        this.valueAccessor = null;
        /**
         * @description
         * The uncomposed array of synchronous validators for the control
         *
         * @internal
         */
        this._rawValidators = [];
        /**
         * @description
         * The uncomposed array of async validators for the control
         *
         * @internal
         */
        this._rawAsyncValidators = [];
    }
    /**
     * @description
     * The registered synchronous validator function for the control
     *
     * @throws An exception that this method is not implemented
     */
    get validator() {
        return unimplemented();
    }
    /**
     * @description
     * The registered async validator function for the control
     *
     * @throws An exception that this method is not implemented
     */
    get asyncValidator() {
        return unimplemented();
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class AbstractControlStatus {
    constructor(cd) {
        this._cd = cd;
    }
    get ngClassUntouched() {
        return this._cd.control ? this._cd.control.untouched : false;
    }
    get ngClassTouched() {
        return this._cd.control ? this._cd.control.touched : false;
    }
    get ngClassPristine() {
        return this._cd.control ? this._cd.control.pristine : false;
    }
    get ngClassDirty() {
        return this._cd.control ? this._cd.control.dirty : false;
    }
    get ngClassValid() {
        return this._cd.control ? this._cd.control.valid : false;
    }
    get ngClassInvalid() {
        return this._cd.control ? this._cd.control.invalid : false;
    }
    get ngClassPending() {
        return this._cd.control ? this._cd.control.pending : false;
    }
}
const ngControlStatusHost = {
    '[class.ng-untouched]': 'ngClassUntouched',
    '[class.ng-touched]': 'ngClassTouched',
    '[class.ng-pristine]': 'ngClassPristine',
    '[class.ng-dirty]': 'ngClassDirty',
    '[class.ng-valid]': 'ngClassValid',
    '[class.ng-invalid]': 'ngClassInvalid',
    '[class.ng-pending]': 'ngClassPending',
};
/**
 * @description
 * Directive automatically applied to Angular form controls that sets CSS classes
 * based on control status.
 *
 * @usageNotes
 *
 * ### CSS classes applied
 *
 * The following classes are applied as the properties become true:
 *
 * * ng-valid
 * * ng-invalid
 * * ng-pending
 * * ng-pristine
 * * ng-dirty
 * * ng-untouched
 * * ng-touched
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgControlStatus extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatus.ɵfac = function NgControlStatus_Factory(t) { return new (t || NgControlStatus)(ɵɵdirectiveInject(NgControl, 2)); };
NgControlStatus.ɵdir = ɵɵdefineDirective({ type: NgControlStatus, selectors: [["", "formControlName", ""], ["", "ngModel", ""], ["", "formControl", ""]], hostVars: 14, hostBindings: function NgControlStatus_HostBindings(rf, ctx) { if (rf & 2) {
        ɵɵclassProp("ng-untouched", ctx.ngClassUntouched)("ng-touched", ctx.ngClassTouched)("ng-pristine", ctx.ngClassPristine)("ng-dirty", ctx.ngClassDirty)("ng-valid", ctx.ngClassValid)("ng-invalid", ctx.ngClassInvalid)("ng-pending", ctx.ngClassPending);
    } }, features: [ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgControlStatus, [{
        type: Directive,
        args: [{ selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost }]
    }], function () { return [{ type: NgControl, decorators: [{
                type: Self
            }] }]; }, null); })();
/**
 * @description
 * Directive automatically applied to Angular form groups that sets CSS classes
 * based on control status (valid/invalid/dirty/etc).
 *
 * @see `NgControlStatus`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgControlStatusGroup extends AbstractControlStatus {
    constructor(cd) {
        super(cd);
    }
}
NgControlStatusGroup.ɵfac = function NgControlStatusGroup_Factory(t) { return new (t || NgControlStatusGroup)(ɵɵdirectiveInject(ControlContainer, 2)); };
NgControlStatusGroup.ɵdir = ɵɵdefineDirective({ type: NgControlStatusGroup, selectors: [["", "formGroupName", ""], ["", "formArrayName", ""], ["", "ngModelGroup", ""], ["", "formGroup", ""], ["form", 3, "ngNoForm", ""], ["", "ngForm", ""]], hostVars: 14, hostBindings: function NgControlStatusGroup_HostBindings(rf, ctx) { if (rf & 2) {
        ɵɵclassProp("ng-untouched", ctx.ngClassUntouched)("ng-touched", ctx.ngClassTouched)("ng-pristine", ctx.ngClassPristine)("ng-dirty", ctx.ngClassDirty)("ng-valid", ctx.ngClassValid)("ng-invalid", ctx.ngClassInvalid)("ng-pending", ctx.ngClassPending);
    } }, features: [ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgControlStatusGroup, [{
        type: Directive,
        args: [{
                selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
                host: ngControlStatusHost
            }]
    }], function () { return [{ type: ControlContainer, decorators: [{
                type: Self
            }] }]; }, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function isEmptyInputValue(value) {
    // we don't check for string here so it also works with arrays
    return value == null || value.length === 0;
}
function hasValidLength(value) {
    // non-strict comparison is intentional, to check for both `null` and `undefined` values
    return value != null && typeof value.length === 'number';
}
/**
 * @description
 * An `InjectionToken` for registering additional synchronous validators used with
 * `AbstractControl`s.
 *
 * @see `NG_ASYNC_VALIDATORS`
 *
 * @usageNotes
 *
 * ### Providing a custom validator
 *
 * The following example registers a custom validator directive. Adding the validator to the
 * existing collection of validators requires the `multi: true` option.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors | null {
 *     return { 'custom': true };
 *   }
 * }
 * ```
 *
 * @publicApi
 */
const NG_VALIDATORS = new InjectionToken('NgValidators');
/**
 * @description
 * An `InjectionToken` for registering additional asynchronous validators used with
 * `AbstractControl`s.
 *
 * @see `NG_VALIDATORS`
 *
 * @publicApi
 */
const NG_ASYNC_VALIDATORS = new InjectionToken('NgAsyncValidators');
/**
 * A regular expression that matches valid e-mail addresses.
 *
 * At a high level, this regexp matches e-mail addresses of the format `local-part@tld`, where:
 * - `local-part` consists of one or more of the allowed characters (alphanumeric and some
 *   punctuation symbols).
 * - `local-part` cannot begin or end with a period (`.`).
 * - `local-part` cannot be longer than 64 characters.
 * - `tld` consists of one or more `labels` separated by periods (`.`). For example `localhost` or
 *   `foo.com`.
 * - A `label` consists of one or more of the allowed characters (alphanumeric, dashes (`-`) and
 *   periods (`.`)).
 * - A `label` cannot begin or end with a dash (`-`) or a period (`.`).
 * - A `label` cannot be longer than 63 characters.
 * - The whole address cannot be longer than 254 characters.
 *
 * ## Implementation background
 *
 * This regexp was ported over from AngularJS (see there for git history):
 * https://github.com/angular/angular.js/blob/c133ef836/src/ng/directive/input.js#L27
 * It is based on the
 * [WHATWG version](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
 * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
 * lengths of different parts of the address). The main differences from the WHATWG version are:
 *   - Disallow `local-part` to begin or end with a period (`.`).
 *   - Disallow `local-part` length to exceed 64 characters.
 *   - Disallow total address length to exceed 254 characters.
 *
 * See [this commit](https://github.com/angular/angular.js/commit/f3f5cf72e) for more details.
 */
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/**
 * @description
 * Provides a set of built-in validators that can be used by form controls.
 *
 * A validator is a function that processes a `FormControl` or collection of
 * controls and returns an error map or null. A null map means that validation has passed.
 *
 * @see [Form Validation](/guide/form-validation)
 *
 * @publicApi
 */
class Validators {
    /**
     * @description
     * Validator that requires the control's value to be greater than or equal to the provided number.
     * The validator exists only as a function and not as a directive.
     *
     * @usageNotes
     *
     * ### Validate against a minimum of 3
     *
     * ```typescript
     * const control = new FormControl(2, Validators.min(3));
     *
     * console.log(control.errors); // {min: {min: 3, actual: 2}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `min` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static min(min) {
        return (control) => {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
                return null; // don't validate empty values to allow optional controls
            }
            const value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return !isNaN(value) && value < min ? { 'min': { 'min': min, 'actual': control.value } } : null;
        };
    }
    /**
     * @description
     * Validator that requires the control's value to be less than or equal to the provided number.
     * The validator exists only as a function and not as a directive.
     *
     * @usageNotes
     *
     * ### Validate against a maximum of 15
     *
     * ```typescript
     * const control = new FormControl(16, Validators.max(15));
     *
     * console.log(control.errors); // {max: {max: 15, actual: 16}}
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `max` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static max(max) {
        return (control) => {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
                return null; // don't validate empty values to allow optional controls
            }
            const value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return !isNaN(value) && value > max ? { 'max': { 'max': max, 'actual': control.value } } : null;
        };
    }
    /**
     * @description
     * Validator that requires the control have a non-empty value.
     *
     * @usageNotes
     *
     * ### Validate that the field is non-empty
     *
     * ```typescript
     * const control = new FormControl('', Validators.required);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map with the `required` property
     * if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static required(control) {
        return isEmptyInputValue(control.value) ? { 'required': true } : null;
    }
    /**
     * @description
     * Validator that requires the control's value be true. This validator is commonly
     * used for required checkboxes.
     *
     * @usageNotes
     *
     * ### Validate that the field value is true
     *
     * ```typescript
     * const control = new FormControl('', Validators.requiredTrue);
     *
     * console.log(control.errors); // {required: true}
     * ```
     *
     * @returns An error map that contains the `required` property
     * set to `true` if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static requiredTrue(control) {
        return control.value === true ? null : { 'required': true };
    }
    /**
     * @description
     * Validator that requires the control's value pass an email validation test.
     *
     * Tests the value using a [regular
     * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
     * pattern suitable for common usecases. The pattern is based on the definition of a valid email
     * address in the [WHATWG HTML
     * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
     * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
     * lengths of different parts of the address).
     *
     * The differences from the WHATWG version include:
     * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
     * - Disallow `local-part` to be longer than 64 characters.
     * - Disallow the whole address to be longer than 254 characters.
     *
     * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
     * validate the value against a different pattern.
     *
     * @usageNotes
     *
     * ### Validate that the field matches a valid email pattern
     *
     * ```typescript
     * const control = new FormControl('bad@', Validators.email);
     *
     * console.log(control.errors); // {email: true}
     * ```
     *
     * @returns An error map with the `email` property
     * if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static email(control) {
        if (isEmptyInputValue(control.value)) {
            return null; // don't validate empty values to allow optional controls
        }
        return EMAIL_REGEXP.test(control.value) ? null : { 'email': true };
    }
    /**
     * @description
     * Validator that requires the length of the control's value to be greater than or equal
     * to the provided minimum length. This validator is also provided by default if you use the
     * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays. The
     * `minLength` validator logic is also not invoked for values when their `length` property is 0
     * (for example in case of an empty string or an empty array), to support optional controls. You
     * can use the standard `required` validator if empty values should not be considered valid.
     *
     * @usageNotes
     *
     * ### Validate that the field has a minimum of 3 characters
     *
     * ```typescript
     * const control = new FormControl('ng', Validators.minLength(3));
     *
     * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
     * ```
     *
     * ```html
     * <input minlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `minlength` if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static minLength(minLength) {
        return (control) => {
            if (isEmptyInputValue(control.value) || !hasValidLength(control.value)) {
                // don't validate empty values to allow optional controls
                // don't validate values without `length` property
                return null;
            }
            return control.value.length < minLength ?
                { 'minlength': { 'requiredLength': minLength, 'actualLength': control.value.length } } :
                null;
        };
    }
    /**
     * @description
     * Validator that requires the length of the control's value to be less than or equal
     * to the provided maximum length. This validator is also provided by default if you use the
     * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
     * only for types that have a numeric `length` property, such as strings or arrays.
     *
     * @usageNotes
     *
     * ### Validate that the field has maximum of 5 characters
     *
     * ```typescript
     * const control = new FormControl('Angular', Validators.maxLength(5));
     *
     * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
     * ```
     *
     * ```html
     * <input maxlength="5">
     * ```
     *
     * @returns A validator function that returns an error map with the
     * `maxlength` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static maxLength(maxLength) {
        return (control) => {
            return hasValidLength(control.value) && control.value.length > maxLength ?
                { 'maxlength': { 'requiredLength': maxLength, 'actualLength': control.value.length } } :
                null;
        };
    }
    /**
     * @description
     * Validator that requires the control's value to match a regex pattern. This validator is also
     * provided by default if you use the HTML5 `pattern` attribute.
     *
     * @usageNotes
     *
     * ### Validate that the field only contains letters or spaces
     *
     * ```typescript
     * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
     *
     * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
     * ```
     *
     * ```html
     * <input pattern="[a-zA-Z ]*">
     * ```
     *
     * @param pattern A regular expression to be used as is to test the values, or a string.
     * If a string is passed, the `^` character is prepended and the `$` character is
     * appended to the provided string (if not already present), and the resulting regular
     * expression is used to test the values.
     *
     * @returns A validator function that returns an error map with the
     * `pattern` property if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static pattern(pattern) {
        if (!pattern)
            return Validators.nullValidator;
        let regex;
        let regexStr;
        if (typeof pattern === 'string') {
            regexStr = '';
            if (pattern.charAt(0) !== '^')
                regexStr += '^';
            regexStr += pattern;
            if (pattern.charAt(pattern.length - 1) !== '$')
                regexStr += '$';
            regex = new RegExp(regexStr);
        }
        else {
            regexStr = pattern.toString();
            regex = pattern;
        }
        return (control) => {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            const value = control.value;
            return regex.test(value) ? null :
                { 'pattern': { 'requiredPattern': regexStr, 'actualValue': value } };
        };
    }
    /**
     * @description
     * Validator that performs no operation.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static nullValidator(control) {
        return null;
    }
    static compose(validators) {
        if (!validators)
            return null;
        const presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            return _mergeErrors(_executeValidators(control, presentValidators));
        };
    }
    /**
     * @description
     * Compose multiple async validators into a single function that returns the union
     * of the individual error objects for the provided control.
     *
     * @returns A validator function that returns an error map with the
     * merged error objects of the async validators if the validation check fails, otherwise `null`.
     *
     * @see `updateValueAndValidity()`
     *
     */
    static composeAsync(validators) {
        if (!validators)
            return null;
        const presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            const observables = _executeAsyncValidators(control, presentValidators).map(toObservable);
            return forkJoin(observables).pipe(map(_mergeErrors));
        };
    }
}
function isPresent(o) {
    return o != null;
}
function toObservable(r) {
    const obs = ɵisPromise(r) ? from(r) : r;
    if (!(ɵisObservable(obs))) {
        throw new Error(`Expected validator to return Promise or Observable.`);
    }
    return obs;
}
function _executeValidators(control, validators) {
    return validators.map(v => v(control));
}
function _executeAsyncValidators(control, validators) {
    return validators.map(v => v(control));
}
function _mergeErrors(arrayOfErrors) {
    let res = {};
    // Not using Array.reduce here due to a Chrome 80 bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    arrayOfErrors.forEach((errors) => {
        res = errors != null ? Object.assign(Object.assign({}, res), errors) : res;
    });
    return Object.keys(res).length === 0 ? null : res;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function normalizeValidator(validator) {
    if (!!validator.validate) {
        return (c) => validator.validate(c);
    }
    else {
        return validator;
    }
}
function normalizeAsyncValidator(validator) {
    if (!!validator.validate) {
        return (c) => validator.validate(c);
    }
    else {
        return validator;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const NUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberValueAccessor),
    multi: true
};
/**
 * @description
 * The `ControlValueAccessor` for writing a number value and listening to number input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a number input with a reactive form.
 *
 * The following example shows how to use a number input with a reactive form.
 *
 * ```ts
 * const totalCountControl = new FormControl();
 * ```
 *
 * ```
 * <input type="number" [formControl]="totalCountControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NumberValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * @description
         * The registered callback function called when a change or input event occurs on the input
         * element.
         */
        this.onChange = (_) => { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
    }
    /**
     * Sets the "value" property on the input element.
     *
     * @param value The checked value
     */
    writeValue(value) {
        // The value needs to be normalized for IE9, otherwise it is set to 'null' when null
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    }
    /**
     * @description
     * Registers a function called when the control value changes.
     *
     * @param fn The callback function
     */
    registerOnChange(fn) {
        this.onChange = (value) => {
            fn(value == '' ? null : parseFloat(value));
        };
    }
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the "disabled" property on the input element.
     *
     * @param isDisabled The disabled value
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}
NumberValueAccessor.ɵfac = function NumberValueAccessor_Factory(t) { return new (t || NumberValueAccessor)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef)); };
NumberValueAccessor.ɵdir = ɵɵdefineDirective({ type: NumberValueAccessor, selectors: [["input", "type", "number", "formControlName", ""], ["input", "type", "number", "formControl", ""], ["input", "type", "number", "ngModel", ""]], hostBindings: function NumberValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("input", function NumberValueAccessor_input_HostBindingHandler($event) { return ctx.onChange($event.target.value); })("blur", function NumberValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); });
    } }, features: [ɵɵProvidersFeature([NUMBER_VALUE_ACCESSOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NumberValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
                host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                providers: [NUMBER_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: Renderer2 }, { type: ElementRef }]; }, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RadioControlValueAccessor),
    multi: true
};
/**
 * @description
 * Class used by Angular to track radio buttons. For internal use only.
 */
class RadioControlRegistry {
    constructor() {
        this._accessors = [];
    }
    /**
     * @description
     * Adds a control to the internal registry. For internal use only.
     */
    add(control, accessor) {
        this._accessors.push([control, accessor]);
    }
    /**
     * @description
     * Removes a control from the internal registry. For internal use only.
     */
    remove(accessor) {
        for (let i = this._accessors.length - 1; i >= 0; --i) {
            if (this._accessors[i][1] === accessor) {
                this._accessors.splice(i, 1);
                return;
            }
        }
    }
    /**
     * @description
     * Selects a radio button. For internal use only.
     */
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
RadioControlRegistry.ɵfac = function RadioControlRegistry_Factory(t) { return new (t || RadioControlRegistry)(); };
RadioControlRegistry.ɵprov = ɵɵdefineInjectable({ token: RadioControlRegistry, factory: RadioControlRegistry.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(RadioControlRegistry, [{
        type: Injectable
    }], null, null); })();
/**
 * @description
 * The `ControlValueAccessor` for writing radio control values and listening to radio control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using radio buttons with reactive form directives
 *
 * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
 * a reactive form, radio buttons in the same group should have the same `formControlName`.
 * Providing a `name` attribute is optional.
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class RadioControlValueAccessor {
    constructor(_renderer, _elementRef, _registry, _injector) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._registry = _registry;
        this._injector = _injector;
        /**
         * @description
         * The registered callback function called when a change event occurs on the input element.
         */
        this.onChange = () => { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
    }
    /**
     * @description
     * A lifecycle method called when the directive is initialized. For internal use only.
     */
    ngOnInit() {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
    }
    /**
     * @description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     */
    ngOnDestroy() {
        this._registry.remove(this);
    }
    /**
     * @description
     * Sets the "checked" property value on the radio input element.
     *
     * @param value The checked value
     */
    writeValue(value) {
        this._state = value === this.value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'checked', this._state);
    }
    /**
     * @description
     * Registers a function called when the control value changes.
     *
     * @param fn The callback function
     */
    registerOnChange(fn) {
        this._fn = fn;
        this.onChange = () => {
            fn(this.value);
            this._registry.select(this);
        };
    }
    /**
     * Sets the "value" on the radio input element and unchecks it.
     *
     * @param value
     */
    fireUncheck(value) {
        this.writeValue(value);
    }
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the "disabled" property on the input element.
     *
     * @param isDisabled The disabled value
     */
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
RadioControlValueAccessor.ɵfac = function RadioControlValueAccessor_Factory(t) { return new (t || RadioControlValueAccessor)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(RadioControlRegistry), ɵɵdirectiveInject(Injector)); };
RadioControlValueAccessor.ɵdir = ɵɵdefineDirective({ type: RadioControlValueAccessor, selectors: [["input", "type", "radio", "formControlName", ""], ["input", "type", "radio", "formControl", ""], ["input", "type", "radio", "ngModel", ""]], hostBindings: function RadioControlValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("change", function RadioControlValueAccessor_change_HostBindingHandler() { return ctx.onChange(); })("blur", function RadioControlValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); });
    } }, inputs: { name: "name", formControlName: "formControlName", value: "value" }, features: [ɵɵProvidersFeature([RADIO_VALUE_ACCESSOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(RadioControlValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
                host: { '(change)': 'onChange()', '(blur)': 'onTouched()' },
                providers: [RADIO_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: Renderer2 }, { type: ElementRef }, { type: RadioControlRegistry }, { type: Injector }]; }, { name: [{
            type: Input
        }], formControlName: [{
            type: Input
        }], value: [{
            type: Input
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const RANGE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RangeValueAccessor),
    multi: true
};
/**
 * @description
 * The `ControlValueAccessor` for writing a range value and listening to range input changes.
 * The value accessor is used by the `FormControlDirective`, `FormControlName`, and  `NgModel`
 * directives.
 *
 * @usageNotes
 *
 * ### Using a range input with a reactive form
 *
 * The following example shows how to use a range input with a reactive form.
 *
 * ```ts
 * const ageControl = new FormControl();
 * ```
 *
 * ```
 * <input type="range" [formControl]="ageControl">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class RangeValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /**
         * @description
         * The registered callback function called when a change or input event occurs on the input
         * element.
         */
        this.onChange = (_) => { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
    }
    /**
     * Sets the "value" property on the input element.
     *
     * @param value The checked value
     */
    writeValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', parseFloat(value));
    }
    /**
     * @description
     * Registers a function called when the control value changes.
     *
     * @param fn The callback function
     */
    registerOnChange(fn) {
        this.onChange = (value) => {
            fn(value == '' ? null : parseFloat(value));
        };
    }
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the "disabled" property on the range input element.
     *
     * @param isDisabled The disabled value
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}
RangeValueAccessor.ɵfac = function RangeValueAccessor_Factory(t) { return new (t || RangeValueAccessor)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef)); };
RangeValueAccessor.ɵdir = ɵɵdefineDirective({ type: RangeValueAccessor, selectors: [["input", "type", "range", "formControlName", ""], ["input", "type", "range", "formControl", ""], ["input", "type", "range", "ngModel", ""]], hostBindings: function RangeValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("change", function RangeValueAccessor_change_HostBindingHandler($event) { return ctx.onChange($event.target.value); })("input", function RangeValueAccessor_input_HostBindingHandler($event) { return ctx.onChange($event.target.value); })("blur", function RangeValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); });
    } }, features: [ɵɵProvidersFeature([RANGE_VALUE_ACCESSOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(RangeValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
                host: {
                    '(change)': 'onChange($event.target.value)',
                    '(input)': 'onChange($event.target.value)',
                    '(blur)': 'onTouched()'
                },
                providers: [RANGE_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: Renderer2 }, { type: ElementRef }]; }, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const FormErrorExamples = {
    formControlName: `
    <div [formGroup]="myGroup">
      <input formControlName="firstName">
    </div>

    In your class:

    this.myGroup = new FormGroup({
       firstName: new FormControl()
    });`,
    formGroupName: `
    <div [formGroup]="myGroup">
       <div formGroupName="person">
          <input formControlName="firstName">
       </div>
    </div>

    In your class:

    this.myGroup = new FormGroup({
       person: new FormGroup({ firstName: new FormControl() })
    });`,
    formArrayName: `
    <div [formGroup]="myGroup">
      <div formArrayName="cities">
        <div *ngFor="let city of cityArray.controls; index as i">
          <input [formControlName]="i">
        </div>
      </div>
    </div>

    In your class:

    this.cityArray = new FormArray([new FormControl('SF')]);
    this.myGroup = new FormGroup({
      cities: this.cityArray
    });`,
    ngModelGroup: `
    <form>
       <div ngModelGroup="person">
          <input [(ngModel)]="person.name" name="firstName">
       </div>
    </form>`,
    ngModelWithFormGroup: `
    <div [formGroup]="myGroup">
       <input formControlName="firstName">
       <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
    </div>
  `
};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ReactiveErrors {
    static controlParentException() {
        throw new Error(`formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup
       directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${FormErrorExamples.formControlName}`);
    }
    static ngModelGroupException() {
        throw new Error(`formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
       that also have a "form" prefix: formGroupName, formArrayName, or formGroup.

       Option 1:  Update the parent to be formGroupName (reactive form strategy)

        ${FormErrorExamples.formGroupName}

        Option 2: Use ngModel instead of formControlName (template-driven strategy)

        ${FormErrorExamples.ngModelGroup}`);
    }
    static missingFormException() {
        throw new Error(`formGroup expects a FormGroup instance. Please pass one in.

       Example:

       ${FormErrorExamples.formControlName}`);
    }
    static groupParentException() {
        throw new Error(`formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${FormErrorExamples.formGroupName}`);
    }
    static arrayParentException() {
        throw new Error(`formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
       directive and pass it an existing FormGroup instance (you can create one in your class).

        Example:

        ${FormErrorExamples.formArrayName}`);
    }
    static disabledAttrWarning() {
        console.warn(`
      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
      you. We recommend using this approach to avoid 'changed after checked' errors.

      Example:
      form = new FormGroup({
        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
        last: new FormControl('Drew', Validators.required)
      });
    `);
    }
    static ngModelWarning(directiveName) {
        console.warn(`
    It looks like you're using ngModel on the same form field as ${directiveName}.
    Support for using the ngModel input property and ngModelChange event with
    reactive form directives has been deprecated in Angular v6 and will be removed
    in a future version of Angular.

    For more information on this, see our API docs here:
    https://angular.io/api/forms/${directiveName === 'formControl' ? 'FormControlDirective' :
            'FormControlName'}#use-with-ngmodel
    `);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const SELECT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectControlValueAccessor),
    multi: true
};
function _buildValueString(id, value) {
    if (id == null)
        return `${value}`;
    if (value && typeof value === 'object')
        value = 'Object';
    return `${id}: ${value}`.slice(0, 50);
}
function _extractId(valueString) {
    return valueString.split(':')[0];
}
/**
 * @description
 * The `ControlValueAccessor` for writing select control values and listening to select control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @usageNotes
 *
 * ### Using select controls in a reactive form
 *
 * The following examples show how to use a select control in a reactive form.
 *
 * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
 *
 * ### Using select controls in a template-driven form
 *
 * To use a select in a template-driven form, simply add an `ngModel` and a `name`
 * attribute to the main `<select>` tag.
 *
 * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
 *
 * ### Customizing option selection
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
 * ```ts
 * const selectedCountriesControl = new FormControl();
 * ```
 *
 * ```
 * <select [compareWith]="compareFn"  [formControl]="selectedCountriesControl">
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
 * **Note:** We listen to the 'change' event because 'input' events aren't fired
 * for selects in Firefox and IE:
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1024350
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4660045/
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class SelectControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        /**
         * @description
         * The registered callback function called when a change event occurs on the input element.
         */
        this.onChange = (_) => { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
        this._compareWith = Object.is;
    }
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn) {
        if (typeof fn !== 'function') {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }
    /**
     * Sets the "value" property on the input element. The "selectedIndex"
     * property is also set if an ID is provided on the option element.
     *
     * @param value The checked value
     */
    writeValue(value) {
        this.value = value;
        const id = this._getOptionId(value);
        if (id == null) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'selectedIndex', -1);
        }
        const valueString = _buildValueString(id, value);
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', valueString);
    }
    /**
     * @description
     * Registers a function called when the control value changes.
     *
     * @param fn The callback function
     */
    registerOnChange(fn) {
        this.onChange = (valueString) => {
            this.value = this._getOptionValue(valueString);
            fn(this.value);
        };
    }
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the "disabled" property on the select input element.
     *
     * @param isDisabled The disabled value
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /** @internal */
    _registerOption() {
        return (this._idCounter++).toString();
    }
    /** @internal */
    _getOptionId(value) {
        for (const id of Array.from(this._optionMap.keys())) {
            if (this._compareWith(this._optionMap.get(id), value))
                return id;
        }
        return null;
    }
    /** @internal */
    _getOptionValue(valueString) {
        const id = _extractId(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
    }
}
SelectControlValueAccessor.ɵfac = function SelectControlValueAccessor_Factory(t) { return new (t || SelectControlValueAccessor)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef)); };
SelectControlValueAccessor.ɵdir = ɵɵdefineDirective({ type: SelectControlValueAccessor, selectors: [["select", "formControlName", "", 3, "multiple", ""], ["select", "formControl", "", 3, "multiple", ""], ["select", "ngModel", "", 3, "multiple", ""]], hostBindings: function SelectControlValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("change", function SelectControlValueAccessor_change_HostBindingHandler($event) { return ctx.onChange($event.target.value); })("blur", function SelectControlValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); });
    } }, inputs: { compareWith: "compareWith" }, features: [ɵɵProvidersFeature([SELECT_VALUE_ACCESSOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(SelectControlValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
                host: { '(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
                providers: [SELECT_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: Renderer2 }, { type: ElementRef }]; }, { compareWith: [{
            type: Input
        }] }); })();
/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see `SelectControlValueAccessor`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class NgSelectOption {
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select)
            this.id = this._select._registerOption();
    }
    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    set ngValue(value) {
        if (this._select == null)
            return;
        this._select._optionMap.set(this.id, value);
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
    }
    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    set value(value) {
        this._setElementValue(value);
        if (this._select)
            this._select.writeValue(this._select.value);
    }
    /** @internal */
    _setElementValue(value) {
        this._renderer.setProperty(this._element.nativeElement, 'value', value);
    }
    /**
     * @description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     */
    ngOnDestroy() {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
}
NgSelectOption.ɵfac = function NgSelectOption_Factory(t) { return new (t || NgSelectOption)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(SelectControlValueAccessor, 9)); };
NgSelectOption.ɵdir = ɵɵdefineDirective({ type: NgSelectOption, selectors: [["option"]], inputs: { ngValue: "ngValue", value: "value" } });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgSelectOption, [{
        type: Directive,
        args: [{ selector: 'option' }]
    }], function () { return [{ type: ElementRef }, { type: Renderer2 }, { type: SelectControlValueAccessor, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }]; }, { ngValue: [{
            type: Input,
            args: ['ngValue']
        }], value: [{
            type: Input,
            args: ['value']
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const SELECT_MULTIPLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
    multi: true
};
function _buildValueString$1(id, value) {
    if (id == null)
        return `${value}`;
    if (typeof value === 'string')
        value = `'${value}'`;
    if (value && typeof value === 'object')
        value = 'Object';
    return `${id}: ${value}`.slice(0, 50);
}
function _extractId$1(valueString) {
    return valueString.split(':')[0];
}
/** Mock interface for HTMLCollection */
class HTMLCollection {
}
/**
 * @description
 * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
 * control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * @see `SelectControlValueAccessor`
 *
 * @usageNotes
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
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class SelectMultipleControlValueAccessor {
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        /** @internal */
        this._optionMap = new Map();
        /** @internal */
        this._idCounter = 0;
        /**
         * @description
         * The registered callback function called when a change event occurs on the input element.
         */
        this.onChange = (_) => { };
        /**
         * @description
         * The registered callback function called when a blur event occurs on the input element.
         */
        this.onTouched = () => { };
        this._compareWith = Object.is;
    }
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    set compareWith(fn) {
        if (typeof fn !== 'function') {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }
    /**
     * @description
     * Sets the "value" property on one or of more
     * of the select's options.
     *
     * @param value The value
     */
    writeValue(value) {
        this.value = value;
        let optionSelectedStateSetter;
        if (Array.isArray(value)) {
            // convert values to ids
            const ids = value.map((v) => this._getOptionId(v));
            optionSelectedStateSetter = (opt, o) => {
                opt._setSelected(ids.indexOf(o.toString()) > -1);
            };
        }
        else {
            optionSelectedStateSetter = (opt, o) => {
                opt._setSelected(false);
            };
        }
        this._optionMap.forEach(optionSelectedStateSetter);
    }
    /**
     * @description
     * Registers a function called when the control value changes
     * and writes an array of the selected options.
     *
     * @param fn The callback function
     */
    registerOnChange(fn) {
        this.onChange = (_) => {
            const selected = [];
            if (_.selectedOptions !== undefined) {
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
    /**
     * @description
     * Registers a function called when the control is touched.
     *
     * @param fn The callback function
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * Sets the "disabled" property on the select input element.
     *
     * @param isDisabled The disabled value
     */
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
        const id = _extractId$1(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
    }
}
SelectMultipleControlValueAccessor.ɵfac = function SelectMultipleControlValueAccessor_Factory(t) { return new (t || SelectMultipleControlValueAccessor)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef)); };
SelectMultipleControlValueAccessor.ɵdir = ɵɵdefineDirective({ type: SelectMultipleControlValueAccessor, selectors: [["select", "multiple", "", "formControlName", ""], ["select", "multiple", "", "formControl", ""], ["select", "multiple", "", "ngModel", ""]], hostBindings: function SelectMultipleControlValueAccessor_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("change", function SelectMultipleControlValueAccessor_change_HostBindingHandler($event) { return ctx.onChange($event.target); })("blur", function SelectMultipleControlValueAccessor_blur_HostBindingHandler() { return ctx.onTouched(); });
    } }, inputs: { compareWith: "compareWith" }, features: [ɵɵProvidersFeature([SELECT_MULTIPLE_VALUE_ACCESSOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(SelectMultipleControlValueAccessor, [{
        type: Directive,
        args: [{
                selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
                host: { '(change)': 'onChange($event.target)', '(blur)': 'onTouched()' },
                providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
            }]
    }], function () { return [{ type: Renderer2 }, { type: ElementRef }]; }, { compareWith: [{
            type: Input
        }] }); })();
/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * @see `SelectMultipleControlValueAccessor`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class ɵNgSelectMultipleOption {
    constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select) {
            this.id = this._select._registerOption(this);
        }
    }
    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    set ngValue(value) {
        if (this._select == null)
            return;
        this._value = value;
        this._setElementValue(_buildValueString$1(this.id, value));
        this._select.writeValue(this._select.value);
    }
    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    set value(value) {
        if (this._select) {
            this._value = value;
            this._setElementValue(_buildValueString$1(this.id, value));
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
    /**
     * @description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     */
    ngOnDestroy() {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }
}
ɵNgSelectMultipleOption.ɵfac = function ɵNgSelectMultipleOption_Factory(t) { return new (t || ɵNgSelectMultipleOption)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(SelectMultipleControlValueAccessor, 9)); };
ɵNgSelectMultipleOption.ɵdir = ɵɵdefineDirective({ type: ɵNgSelectMultipleOption, selectors: [["option"]], inputs: { ngValue: "ngValue", value: "value" } });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ɵNgSelectMultipleOption, [{
        type: Directive,
        args: [{ selector: 'option' }]
    }], function () { return [{ type: ElementRef }, { type: Renderer2 }, { type: SelectMultipleControlValueAccessor, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }]; }, { ngValue: [{
            type: Input,
            args: ['ngValue']
        }], value: [{
            type: Input,
            args: ['value']
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function controlPath(name, parent) {
    return [...parent.path, name];
}
function setUpControl(control, dir) {
    if (!control)
        _throwError(dir, 'Cannot find control with');
    if (!dir.valueAccessor)
        _throwError(dir, 'No value accessor for form control with');
    control.validator = Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
    dir.valueAccessor.writeValue(control.value);
    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);
    setUpBlurPipeline(control, dir);
    if (dir.valueAccessor.setDisabledState) {
        control.registerOnDisabledChange((isDisabled) => {
            dir.valueAccessor.setDisabledState(isDisabled);
        });
    }
    // re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    dir._rawValidators.forEach((validator) => {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(() => control.updateValueAndValidity());
    });
    dir._rawAsyncValidators.forEach((validator) => {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(() => control.updateValueAndValidity());
    });
}
function cleanUpControl(control, dir) {
    dir.valueAccessor.registerOnChange(() => _noControlError(dir));
    dir.valueAccessor.registerOnTouched(() => _noControlError(dir));
    dir._rawValidators.forEach((validator) => {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });
    dir._rawAsyncValidators.forEach((validator) => {
        if (validator.registerOnValidatorChange) {
            validator.registerOnValidatorChange(null);
        }
    });
    if (control)
        control._clearChangeFns();
}
function setUpViewChangePipeline(control, dir) {
    dir.valueAccessor.registerOnChange((newValue) => {
        control._pendingValue = newValue;
        control._pendingChange = true;
        control._pendingDirty = true;
        if (control.updateOn === 'change')
            updateControl(control, dir);
    });
}
function setUpBlurPipeline(control, dir) {
    dir.valueAccessor.registerOnTouched(() => {
        control._pendingTouched = true;
        if (control.updateOn === 'blur' && control._pendingChange)
            updateControl(control, dir);
        if (control.updateOn !== 'submit')
            control.markAsTouched();
    });
}
function updateControl(control, dir) {
    if (control._pendingDirty)
        control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
    dir.viewToModelUpdate(control._pendingValue);
    control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
    control.registerOnChange((newValue, emitModelEvent) => {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    });
}
function setUpFormContainer(control, dir) {
    if (control == null)
        _throwError(dir, 'Cannot find control with');
    control.validator = Validators.compose([control.validator, dir.validator]);
    control.asyncValidator = Validators.composeAsync([control.asyncValidator, dir.asyncValidator]);
}
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
    let messageEnd;
    if (dir.path.length > 1) {
        messageEnd = `path: '${dir.path.join(' -> ')}'`;
    }
    else if (dir.path[0]) {
        messageEnd = `name: '${dir.path}'`;
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(`${message} ${messageEnd}`);
}
function composeValidators(validators) {
    return validators != null ? Validators.compose(validators.map(normalizeValidator)) : null;
}
function composeAsyncValidators(validators) {
    return validators != null ? Validators.composeAsync(validators.map(normalizeAsyncValidator)) :
        null;
}
function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    const change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !Object.is(viewModel, change.currentValue);
}
const BUILTIN_ACCESSORS = [
    CheckboxControlValueAccessor,
    RangeValueAccessor,
    NumberValueAccessor,
    SelectControlValueAccessor,
    SelectMultipleControlValueAccessor,
    RadioControlValueAccessor,
];
function isBuiltInAccessor(valueAccessor) {
    return BUILTIN_ACCESSORS.some(a => valueAccessor.constructor === a);
}
function syncPendingControls(form, directives) {
    form._syncPendingControls();
    directives.forEach(dir => {
        const control = dir.control;
        if (control.updateOn === 'submit' && control._pendingChange) {
            dir.viewToModelUpdate(control._pendingValue);
            control._pendingChange = false;
        }
    });
}
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
function selectValueAccessor(dir, valueAccessors) {
    if (!valueAccessors)
        return null;
    if (!Array.isArray(valueAccessors))
        _throwError(dir, 'Value accessor was not provided as an array for form control with');
    let defaultAccessor = undefined;
    let builtinAccessor = undefined;
    let customAccessor = undefined;
    valueAccessors.forEach((v) => {
        if (v.constructor === DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (builtinAccessor)
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (customAccessor)
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (customAccessor)
        return customAccessor;
    if (builtinAccessor)
        return builtinAccessor;
    if (defaultAccessor)
        return defaultAccessor;
    _throwError(dir, 'No valid value accessor for form control with');
    return null;
}
function removeDir(list, el) {
    const index = list.indexOf(el);
    if (index > -1)
        list.splice(index, 1);
}
// TODO(kara): remove after deprecation period
function _ngModelWarning(name, type, instance, warningConfig) {
    if (!isDevMode() || warningConfig === 'never')
        return;
    if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
        (warningConfig === 'always' && !instance._ngModelWarningSent)) {
        ReactiveErrors.ngModelWarning(name);
        type._ngModelWarningSentOnce = true;
        instance._ngModelWarningSent = true;
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Reports that a FormControl is valid, meaning that no errors exist in the input value.
 *
 * @see `status`
 */
const VALID = 'VALID';
/**
 * Reports that a FormControl is invalid, meaning that an error exists in the input value.
 *
 * @see `status`
 */
const INVALID = 'INVALID';
/**
 * Reports that a FormControl is pending, meaning that that async validation is occurring and
 * errors are not yet available for the input value.
 *
 * @see `markAsPending`
 * @see `status`
 */
const PENDING = 'PENDING';
/**
 * Reports that a FormControl is disabled, meaning that the control is exempt from ancestor
 * calculations of validity or value.
 *
 * @see `markAsDisabled`
 * @see `status`
 */
const DISABLED = 'DISABLED';
function _find(control, path, delimiter) {
    if (path == null)
        return null;
    if (!Array.isArray(path)) {
        path = path.split(delimiter);
    }
    if (Array.isArray(path) && path.length === 0)
        return null;
    // Not using Array.reduce here due to a Chrome 80 bug
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
    let controlToFind = control;
    path.forEach((name) => {
        if (controlToFind instanceof FormGroup) {
            controlToFind = controlToFind.controls.hasOwnProperty(name) ?
                controlToFind.controls[name] :
                null;
        }
        else if (controlToFind instanceof FormArray) {
            controlToFind = controlToFind.at(name) || null;
        }
        else {
            controlToFind = null;
        }
    });
    return controlToFind;
}
function coerceToValidator(validatorOrOpts) {
    const validator = isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts;
    return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function coerceToAsyncValidator(asyncValidator, validatorOrOpts) {
    const origAsyncValidator = isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator;
    return Array.isArray(origAsyncValidator) ? composeAsyncValidators(origAsyncValidator) :
        origAsyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
    return validatorOrOpts != null && !Array.isArray(validatorOrOpts) &&
        typeof validatorOrOpts === 'object';
}
/**
 * This is the base class for `FormControl`, `FormGroup`, and `FormArray`.
 *
 * It provides some of the shared behavior that all controls and groups of controls have, like
 * running validators, calculating status, and resetting state. It also defines the properties
 * that are shared between all sub-classes, like `value`, `valid`, and `dirty`. It shouldn't be
 * instantiated directly.
 *
 * @see [Forms Guide](/guide/forms)
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 * @see [Dynamic Forms Guide](/guide/dynamic-form)
 *
 * @publicApi
 */
class AbstractControl {
    /**
     * Initialize the AbstractControl instance.
     *
     * @param validator The function that determines the synchronous validity of this control.
     * @param asyncValidator The function that determines the asynchronous validity of this
     * control.
     */
    constructor(validator, asyncValidator) {
        this.validator = validator;
        this.asyncValidator = asyncValidator;
        /**
         * Indicates that a control has its own pending asynchronous validation in progress.
         *
         * @internal
         */
        this._hasOwnPendingAsyncValidator = false;
        /** @internal */
        this._onCollectionChange = () => { };
        /**
         * A control is `pristine` if the user has not yet changed
         * the value in the UI.
         *
         * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
         * Programmatic changes to a control's value do not mark it dirty.
         */
        this.pristine = true;
        /**
         * True if the control is marked as `touched`.
         *
         * A control is marked `touched` once the user has triggered
         * a `blur` event on it.
         */
        this.touched = false;
        /** @internal */
        this._onDisabledChange = [];
    }
    /**
     * The parent control.
     */
    get parent() {
        return this._parent;
    }
    /**
     * A control is `valid` when its `status` is `VALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control has passed all of its validation tests,
     * false otherwise.
     */
    get valid() {
        return this.status === VALID;
    }
    /**
     * A control is `invalid` when its `status` is `INVALID`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control has failed one or more of its validation checks,
     * false otherwise.
     */
    get invalid() {
        return this.status === INVALID;
    }
    /**
     * A control is `pending` when its `status` is `PENDING`.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if this control is in the process of conducting a validation check,
     * false otherwise.
     */
    get pending() {
        return this.status == PENDING;
    }
    /**
     * A control is `disabled` when its `status` is `DISABLED`.
     *
     * Disabled controls are exempt from validation checks and
     * are not included in the aggregate value of their ancestor
     * controls.
     *
     * @see {@link AbstractControl.status}
     *
     * @returns True if the control is disabled, false otherwise.
     */
    get disabled() {
        return this.status === DISABLED;
    }
    /**
     * A control is `enabled` as long as its `status` is not `DISABLED`.
     *
     * @returns True if the control has any status other than 'DISABLED',
     * false if the status is 'DISABLED'.
     *
     * @see {@link AbstractControl.status}
     *
     */
    get enabled() {
        return this.status !== DISABLED;
    }
    /**
     * A control is `dirty` if the user has changed the value
     * in the UI.
     *
     * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
     * Programmatic changes to a control's value do not mark it dirty.
     */
    get dirty() {
        return !this.pristine;
    }
    /**
     * True if the control has not been marked as touched
     *
     * A control is `untouched` if the user has not yet triggered
     * a `blur` event on it.
     */
    get untouched() {
        return !this.touched;
    }
    /**
     * Reports the update strategy of the `AbstractControl` (meaning
     * the event on which the control updates itself).
     * Possible values: `'change'` | `'blur'` | `'submit'`
     * Default value: `'change'`
     */
    get updateOn() {
        return this._updateOn ? this._updateOn : (this.parent ? this.parent.updateOn : 'change');
    }
    /**
     * Sets the synchronous validators that are active on this control.  Calling
     * this overwrites any existing sync validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    setValidators(newValidator) {
        this.validator = coerceToValidator(newValidator);
    }
    /**
     * Sets the async validators that are active on this control. Calling this
     * overwrites any existing async validators.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    setAsyncValidators(newValidator) {
        this.asyncValidator = coerceToAsyncValidator(newValidator);
    }
    /**
     * Empties out the sync validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearValidators() {
        this.validator = null;
    }
    /**
     * Empties out the async validator list.
     *
     * When you add or remove a validator at run time, you must call
     * `updateValueAndValidity()` for the new validation to take effect.
     *
     */
    clearAsyncValidators() {
        this.asyncValidator = null;
    }
    /**
     * Marks the control as `touched`. A control is touched by focus and
     * blur events that do not change the value.
     *
     * @see `markAsUntouched()`
     * @see `markAsDirty()`
     * @see `markAsPristine()`
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsTouched(opts = {}) {
        this.touched = true;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsTouched(opts);
        }
    }
    /**
     * Marks the control and all its descendant controls as `touched`.
     * @see `markAsTouched()`
     */
    markAllAsTouched() {
        this.markAsTouched({ onlySelf: true });
        this._forEachChild((control) => control.markAllAsTouched());
    }
    /**
     * Marks the control as `untouched`.
     *
     * If the control has any children, also marks all children as `untouched`
     * and recalculates the `touched` status of all parent controls.
     *
     * @see `markAsTouched()`
     * @see `markAsDirty()`
     * @see `markAsPristine()`
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after the marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsUntouched(opts = {}) {
        this.touched = false;
        this._pendingTouched = false;
        this._forEachChild((control) => {
            control.markAsUntouched({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /**
     * Marks the control as `dirty`. A control becomes dirty when
     * the control's value is changed through the UI; compare `markAsTouched`.
     *
     * @see `markAsTouched()`
     * @see `markAsUntouched()`
     * @see `markAsPristine()`
     *
     * @param opts Configuration options that determine how the control propagates changes
     * and emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsDirty(opts = {}) {
        this.pristine = false;
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsDirty(opts);
        }
    }
    /**
     * Marks the control as `pristine`.
     *
     * If the control has any children, marks all children as `pristine`,
     * and recalculates the `pristine` status of all parent
     * controls.
     *
     * @see `markAsTouched()`
     * @see `markAsUntouched()`
     * @see `markAsDirty()`
     *
     * @param opts Configuration options that determine how the control emits events after
     * marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     */
    markAsPristine(opts = {}) {
        this.pristine = true;
        this._pendingDirty = false;
        this._forEachChild((control) => {
            control.markAsPristine({ onlySelf: true });
        });
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /**
     * Marks the control as `pending`.
     *
     * A control is pending while the control performs async validation.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates changes and
     * emits events after marking is applied.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), the `statusChanges`
     * observable emits an event with the latest status the control is marked pending.
     * When false, no events are emitted.
     *
     */
    markAsPending(opts = {}) {
        this.status = PENDING;
        if (opts.emitEvent !== false) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.markAsPending(opts);
        }
    }
    /**
     * Disables the control. This means the control is exempt from validation checks and
     * excluded from the aggregate value of any parent. Its status is `DISABLED`.
     *
     * If the control has children, all children are also disabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configuration options that determine how the control propagates
     * changes and emits events after the control is disabled.
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is disabled.
     * When false, no events are emitted.
     */
    disable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild((control) => {
            control.disable(Object.assign(Object.assign({}, opts), { onlySelf: true }));
        });
        this._updateValue();
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        this._updateAncestors(Object.assign(Object.assign({}, opts), { skipPristineCheck }));
        this._onDisabledChange.forEach((changeFn) => changeFn(true));
    }
    /**
     * Enables the control. This means the control is included in validation checks and
     * the aggregate value of its parent. Its status recalculates based on its value and
     * its validators.
     *
     * By default, if the control has children, all children are enabled.
     *
     * @see {@link AbstractControl.status}
     *
     * @param opts Configure options that control how the control propagates changes and
     * emits events when marked as untouched
     * * `onlySelf`: When true, mark only this control. When false or not supplied,
     * marks all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is enabled.
     * When false, no events are emitted.
     */
    enable(opts = {}) {
        // If parent has been marked artificially dirty we don't want to re-calculate the
        // parent's dirtiness based on the children.
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = VALID;
        this._forEachChild((control) => {
            control.enable(Object.assign(Object.assign({}, opts), { onlySelf: true }));
        });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors(Object.assign(Object.assign({}, opts), { skipPristineCheck }));
        this._onDisabledChange.forEach((changeFn) => changeFn(false));
    }
    _updateAncestors(opts) {
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
            if (!opts.skipPristineCheck) {
                this._parent._updatePristine();
            }
            this._parent._updateTouched();
        }
    }
    /**
     * @param parent Sets the parent of the control
     */
    setParent(parent) {
        this._parent = parent;
    }
    /**
     * Recalculates the value and validation status of the control.
     *
     * By default, it also updates the value and validity of its ancestors.
     *
     * @param opts Configuration options determine how the control propagates changes and emits events
     * after updates and validity checks are applied.
     * * `onlySelf`: When true, only update this control. When false or not supplied,
     * update all direct ancestors. Default is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is updated.
     * When false, no events are emitted.
     */
    updateValueAndValidity(opts = {}) {
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
            this._cancelExistingSubscription();
            this.errors = this._runValidator();
            this.status = this._calculateStatus();
            if (this.status === VALID || this.status === PENDING) {
                this._runAsyncValidator(opts.emitEvent);
            }
        }
        if (opts.emitEvent !== false) {
            this.valueChanges.emit(this.value);
            this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
            this._parent.updateValueAndValidity(opts);
        }
    }
    /** @internal */
    _updateTreeValidity(opts = { emitEvent: true }) {
        this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
    }
    _setInitialStatus() {
        this.status = this._allControlsDisabled() ? DISABLED : VALID;
    }
    _runValidator() {
        return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(emitEvent) {
        if (this.asyncValidator) {
            this.status = PENDING;
            this._hasOwnPendingAsyncValidator = true;
            const obs = toObservable(this.asyncValidator(this));
            this._asyncValidationSubscription = obs.subscribe((errors) => {
                this._hasOwnPendingAsyncValidator = false;
                // This will trigger the recalculation of the validation status, which depends on
                // the state of the asynchronous validation (whether it is in progress or not). So, it is
                // necessary that we have updated the `_hasOwnPendingAsyncValidator` boolean flag first.
                this.setErrors(errors, { emitEvent });
            });
        }
    }
    _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
            this._asyncValidationSubscription.unsubscribe();
            this._hasOwnPendingAsyncValidator = false;
        }
    }
    /**
     * Sets errors on a form control when running validations manually, rather than automatically.
     *
     * Calling `setErrors` also updates the validity of the parent control.
     *
     * @usageNotes
     *
     * ### Manually set the errors for a control
     *
     * ```
     * const login = new FormControl('someLogin');
     * login.setErrors({
     *   notUnique: true
     * });
     *
     * expect(login.valid).toEqual(false);
     * expect(login.errors).toEqual({ notUnique: true });
     *
     * login.setValue('someOtherLogin');
     *
     * expect(login.valid).toEqual(true);
     * ```
     */
    setErrors(errors, opts = {}) {
        this.errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false);
    }
    /**
     * Retrieves a child control given the control's name or path.
     *
     * @param path A dot-delimited string or array of string/number values that define the path to the
     * control.
     *
     * @usageNotes
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * * `this.form.get('person.name');`
     *
     * -OR-
     *
     * * `this.form.get(['person', 'name']);`
     */
    get(path) {
        return _find(this, path, '.');
    }
    /**
     * @description
     * Reports error data for the control with the given path.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * @returns error data for that particular error. If the control or error is not present,
     * null is returned.
     */
    getError(errorCode, path) {
        const control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
    }
    /**
     * @description
     * Reports whether the control with the given path has the error specified.
     *
     * @param errorCode The code of the error to check
     * @param path A list of control names that designates how to move from the current control
     * to the control that should be queried for errors.
     *
     * @usageNotes
     * For example, for the following `FormGroup`:
     *
     * ```
     * form = new FormGroup({
     *   address: new FormGroup({ street: new FormControl() })
     * });
     * ```
     *
     * The path to the 'street' control from the root form would be 'address' -> 'street'.
     *
     * It can be provided to this method in one of two formats:
     *
     * 1. An array of string control names, e.g. `['address', 'street']`
     * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
     *
     * If no path is given, this method checks for the error on the current control.
     *
     * @returns whether the given error is present in the control at the given path.
     *
     * If the control is not present, false is returned.
     */
    hasError(errorCode, path) {
        return !!this.getError(errorCode, path);
    }
    /**
     * Retrieves the top-level ancestor of this control.
     */
    get root() {
        let x = this;
        while (x._parent) {
            x = x._parent;
        }
        return x;
    }
    /** @internal */
    _updateControlsErrors(emitEvent) {
        this.status = this._calculateStatus();
        if (emitEvent) {
            this.statusChanges.emit(this.status);
        }
        if (this._parent) {
            this._parent._updateControlsErrors(emitEvent);
        }
    }
    /** @internal */
    _initObservables() {
        this.valueChanges = new EventEmitter();
        this.statusChanges = new EventEmitter();
    }
    _calculateStatus() {
        if (this._allControlsDisabled())
            return DISABLED;
        if (this.errors)
            return INVALID;
        if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING))
            return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
            return INVALID;
        return VALID;
    }
    /** @internal */
    _anyControlsHaveStatus(status) {
        return this._anyControls((control) => control.status === status);
    }
    /** @internal */
    _anyControlsDirty() {
        return this._anyControls((control) => control.dirty);
    }
    /** @internal */
    _anyControlsTouched() {
        return this._anyControls((control) => control.touched);
    }
    /** @internal */
    _updatePristine(opts = {}) {
        this.pristine = !this._anyControlsDirty();
        if (this._parent && !opts.onlySelf) {
            this._parent._updatePristine(opts);
        }
    }
    /** @internal */
    _updateTouched(opts = {}) {
        this.touched = this._anyControlsTouched();
        if (this._parent && !opts.onlySelf) {
            this._parent._updateTouched(opts);
        }
    }
    /** @internal */
    _isBoxedValue(formState) {
        return typeof formState === 'object' && formState !== null &&
            Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
    }
    /** @internal */
    _registerOnCollectionChange(fn) {
        this._onCollectionChange = fn;
    }
    /** @internal */
    _setUpdateStrategy(opts) {
        if (isOptionsObj(opts) && opts.updateOn != null) {
            this._updateOn = opts.updateOn;
        }
    }
    /**
     * Check to see if parent has been marked artificially dirty.
     *
     * @internal
     */
    _parentMarkedDirty(onlySelf) {
        const parentDirty = this._parent && this._parent.dirty;
        return !onlySelf && parentDirty && !this._parent._anyControlsDirty();
    }
}
/**
 * Tracks the value and validation status of an individual form control.
 *
 * This is one of the three fundamental building blocks of Angular forms, along with
 * `FormGroup` and `FormArray`. It extends the `AbstractControl` class that
 * implements most of the base functionality for accessing the value, validation status,
 * user interactions and events. See [usage examples below](#usage-notes).
 *
 * @see `AbstractControl`
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see [Usage Notes](#usage-notes)
 *
 * @usageNotes
 *
 * ### Initializing Form Controls
 *
 * Instantiate a `FormControl`, with an initial value.
 *
 * ```ts
 * const control = new FormControl('some value');
 * console.log(control.value);     // 'some value'
 *```
 *
 * The following example initializes the control with a form state object. The `value`
 * and `disabled` keys are required in this case.
 *
 * ```ts
 * const control = new FormControl({ value: 'n/a', disabled: true });
 * console.log(control.value);     // 'n/a'
 * console.log(control.status);    // 'DISABLED'
 * ```
 *
 * The following example initializes the control with a sync validator.
 *
 * ```ts
 * const control = new FormControl('', Validators.required);
 * console.log(control.value);      // ''
 * console.log(control.status);     // 'INVALID'
 * ```
 *
 * The following example initializes the control using an options object.
 *
 * ```ts
 * const control = new FormControl('', {
 *    validators: Validators.required,
 *    asyncValidators: myAsyncValidator
 * });
 * ```
 *
 * ### Configure the control to update on a blur event
 *
 * Set the `updateOn` option to `'blur'` to update on the blur `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'blur' });
 * ```
 *
 * ### Configure the control to update on a submit event
 *
 * Set the `updateOn` option to `'submit'` to update on a submit `event`.
 *
 * ```ts
 * const control = new FormControl('', { updateOn: 'submit' });
 * ```
 *
 * ### Reset the control back to an initial value
 *
 * You reset to a specific form state by passing through a standalone
 * value or a form state object that contains both a value and a disabled state
 * (these are the only two properties that cannot be calculated).
 *
 * ```ts
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 *
 * control.reset('Drew');
 *
 * console.log(control.value); // 'Drew'
 * ```
 *
 * ### Reset the control back to an initial value and disabled
 *
 * ```
 * const control = new FormControl('Nancy');
 *
 * console.log(control.value); // 'Nancy'
 * console.log(control.status); // 'VALID'
 *
 * control.reset({ value: 'Drew', disabled: true });
 *
 * console.log(control.value); // 'Drew'
 * console.log(control.status); // 'DISABLED'
 * ```
 *
 * @publicApi
 */
class FormControl extends AbstractControl {
    /**
     * Creates a new `FormControl` instance.
     *
     * @param formState Initializes the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(formState = null, validatorOrOpts, asyncValidator) {
        super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts));
        /** @internal */
        this._onChange = [];
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this._initObservables();
    }
    /**
     * Sets a new value for the form control.
     *
     * @param value The new value for the control.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * * `emitModelToViewChange`: When true or not supplied  (the default), each change triggers an
     * `onChange` event to
     * update the view.
     * * `emitViewToModelChange`: When true or not supplied (the default), each change triggers an
     * `ngModelChange`
     * event to update the model.
     *
     */
    setValue(value, options = {}) {
        this.value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
            this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
        }
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of a control.
     *
     * This function is functionally the same as {@link FormControl#setValue setValue} at this level.
     * It exists for symmetry with {@link FormGroup#patchValue patchValue} on `FormGroups` and
     * `FormArrays`, where it does behave differently.
     *
     * @see `setValue` for options
     */
    patchValue(value, options = {}) {
        this.setValue(value, options);
    }
    /**
     * Resets the form control, marking it `pristine` and `untouched`, and setting
     * the value to null.
     *
     * @param formState Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     *
     */
    reset(formState = null, options = {}) {
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
    }
    /**
     * @internal
     */
    _updateValue() { }
    /**
     * @internal
     */
    _anyControls(condition) {
        return false;
    }
    /**
     * @internal
     */
    _allControlsDisabled() {
        return this.disabled;
    }
    /**
     * Register a listener for change events.
     *
     * @param fn The method that is called when the value changes
     */
    registerOnChange(fn) {
        this._onChange.push(fn);
    }
    /**
     * @internal
     */
    _clearChangeFns() {
        this._onChange = [];
        this._onDisabledChange = [];
        this._onCollectionChange = () => { };
    }
    /**
     * Register a listener for disabled events.
     *
     * @param fn The method that is called when the disabled status changes.
     */
    registerOnDisabledChange(fn) {
        this._onDisabledChange.push(fn);
    }
    /**
     * @internal
     */
    _forEachChild(cb) { }
    /** @internal */
    _syncPendingControls() {
        if (this.updateOn === 'submit') {
            if (this._pendingDirty)
                this.markAsDirty();
            if (this._pendingTouched)
                this.markAsTouched();
            if (this._pendingChange) {
                this.setValue(this._pendingValue, { onlySelf: true, emitModelToViewChange: false });
                return true;
            }
        }
        return false;
    }
    _applyFormState(formState) {
        if (this._isBoxedValue(formState)) {
            this.value = this._pendingValue = formState.value;
            formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) :
                this.enable({ onlySelf: true, emitEvent: false });
        }
        else {
            this.value = this._pendingValue = formState;
        }
    }
}
/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormArray`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 *
 * @publicApi
 */
class FormGroup extends AbstractControl {
    /**
     * Creates a new `FormGroup` instance.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    /**
     * Registers a control with the group's list of controls.
     *
     * This method does not update the value or validity of the control.
     * Use {@link FormGroup#addControl addControl} instead.
     *
     * @param name The control name to register in the collection
     * @param control Provides the control for the given name
     */
    registerControl(name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    }
    /**
     * Add a control to this group.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to add to the collection
     * @param control Provides the control for the given name
     */
    addControl(name, control) {
        this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Remove a control from this group.
     *
     * @param name The control name to remove from the collection
     */
    removeControl(name) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Replace an existing control.
     *
     * @param name The control name to replace in the collection
     * @param control Provides the control for the given name
     */
    setControl(name, control) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Check whether there is an enabled control with the given name in the group.
     *
     * Reports false for disabled controls. If you'd like to check for existence in the group
     * only, use {@link AbstractControl#get get} instead.
     *
     * @param controlName The control name to check for existence in the collection
     *
     * @returns false for disabled controls, true otherwise.
     */
    contains(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    }
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * @usageNotes
     * ### Set the complete value for the form group
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl(),
     *   last: new FormControl()
     * });
     *
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.setValue({first: 'Nancy', last: 'Drew'});
     * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     * ```
     *
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you exclude a value of a control that does exist.
     *
     * @param value The new value for the control that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     */
    setValue(value, options = {}) {
        this._checkAllValuesPresent(value);
        Object.keys(value).forEach(name => {
            this._throwIfControlMissing(name);
            this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * @usageNotes
     * ### Patch the value for a form group
     *
     * ```
     * const form = new FormGroup({
     *    first: new FormControl(),
     *    last: new FormControl()
     * });
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.patchValue({first: 'Nancy'});
     * console.log(form.value);   // {first: 'Nancy', last: null}
     * ```
     *
     * @param value The object that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        Object.keys(value).forEach(name => {
            if (this.controls[name]) {
                this.controls[name].patchValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormGroup`, marks all descendants are marked `pristine` and `untouched`, and
     * the value of all descendants to null.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * @param value Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * @usageNotes
     *
     * ### Reset the form group values
     *
     * ```ts
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * console.log(form.value);  // {first: 'first name', last: 'last name'}
     *
     * form.reset({ first: 'name', last: 'last name' });
     *
     * console.log(form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * ### Reset the form group values and disabled status
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(this.form.value);  // {first: 'name', last: 'last name'}
     * console.log(this.form.get('first').status);  // 'DISABLED'
     * ```
     */
    reset(value = {}, options = {}) {
        this._forEachChild((control, name) => {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     * The `value` property is the best way to get the value of the group, because
     * it excludes disabled controls in the `FormGroup`.
     */
    getRawValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            acc[name] = control instanceof FormControl ? control.value : control.getRawValue();
            return acc;
        });
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
            return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _throwIfControlMissing(name) {
        if (!Object.keys(this.controls).length) {
            throw new Error(`
        There are no form controls registered with this group yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.controls[name]) {
            throw new Error(`Cannot find form control with name: ${name}.`);
        }
    }
    /** @internal */
    _forEachChild(cb) {
        Object.keys(this.controls).forEach(k => cb(this.controls[k], k));
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => {
            control.setParent(this);
            control._registerOnCollectionChange(this._onCollectionChange);
        });
    }
    /** @internal */
    _updateValue() {
        this.value = this._reduceValue();
    }
    /** @internal */
    _anyControls(condition) {
        for (const controlName of Object.keys(this.controls)) {
            const control = this.controls[controlName];
            if (this.contains(controlName) && condition(control)) {
                return true;
            }
        }
        return false;
    }
    /** @internal */
    _reduceValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            if (control.enabled || this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    }
    /** @internal */
    _reduceChildren(initValue, fn) {
        let res = initValue;
        this._forEachChild((control, name) => {
            res = fn(res, control, name);
        });
        return res;
    }
    /** @internal */
    _allControlsDisabled() {
        for (const controlName of Object.keys(this.controls)) {
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    }
    /** @internal */
    _checkAllValuesPresent(value) {
        this._forEachChild((control, name) => {
            if (value[name] === undefined) {
                throw new Error(`Must supply a value for form control with name: '${name}'.`);
            }
        });
    }
}
/**
 * Tracks the value and validity state of an array of `FormControl`,
 * `FormGroup` or `FormArray` instances.
 *
 * A `FormArray` aggregates the values of each child `FormControl` into an array.
 * It calculates its status by reducing the status values of its children. For example, if one of
 * the controls in a `FormArray` is invalid, the entire array becomes invalid.
 *
 * `FormArray` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormGroup`.
 *
 * @usageNotes
 *
 * ### Create an array of form controls
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy', Validators.minLength(2)),
 *   new FormControl('Drew'),
 * ]);
 *
 * console.log(arr.value);   // ['Nancy', 'Drew']
 * console.log(arr.status);  // 'VALID'
 * ```
 *
 * ### Create a form array with array-level validators
 *
 * You include array-level validators and async validators. These come in handy
 * when you want to perform validation that considers the value of more than one child
 * control.
 *
 * The two types of validators are passed in separately as the second and third arg
 * respectively, or together as part of an options object.
 *
 * ```
 * const arr = new FormArray([
 *   new FormControl('Nancy'),
 *   new FormControl('Drew')
 * ], {validators: myValidator, asyncValidators: myAsyncValidator});
 * ```
 *
 * ### Set the updateOn property for all controls in a form array
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * array level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const arr = new FormArray([
 *    new FormControl()
 * ], {updateOn: 'blur'});
 * ```
 *
 * ### Adding or removing controls from a form array
 *
 * To change the controls in the array, use the `push`, `insert`, `removeAt` or `clear` methods
 * in `FormArray` itself. These methods ensure the controls are properly tracked in the
 * form's hierarchy. Do not modify the array of `AbstractControl`s used to instantiate
 * the `FormArray` directly, as that result in strange and unexpected behavior such
 * as broken change detection.
 *
 * @publicApi
 */
class FormArray extends AbstractControl {
    /**
     * Creates a new `FormArray` instance.
     *
     * @param controls An array of child controls. Each child control is given an index
     * where it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(coerceToValidator(validatorOrOpts), coerceToAsyncValidator(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    /**
     * Get the `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to retrieve the control
     */
    at(index) {
        return this.controls[index];
    }
    /**
     * Insert a new `AbstractControl` at the end of the array.
     *
     * @param control Form control to be inserted
     */
    push(control) {
        this.controls.push(control);
        this._registerControl(control);
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Insert a new `AbstractControl` at the given `index` in the array.
     *
     * @param index Index in the array to insert the control
     * @param control Form control to be inserted
     */
    insert(index, control) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity();
    }
    /**
     * Remove the control at the given `index` in the array.
     *
     * @param index Index in the array to remove the control
     */
    removeAt(index) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
        this.controls.splice(index, 1);
        this.updateValueAndValidity();
    }
    /**
     * Replace an existing control.
     *
     * @param index Index in the array to replace the control
     * @param control The `AbstractControl` control to replace the existing control
     */
    setControl(index, control) {
        if (this.controls[index])
            this.controls[index]._registerOnCollectionChange(() => { });
        this.controls.splice(index, 1);
        if (control) {
            this.controls.splice(index, 0, control);
            this._registerControl(control);
        }
        this.updateValueAndValidity();
        this._onCollectionChange();
    }
    /**
     * Length of the control array.
     */
    get length() {
        return this.controls.length;
    }
    /**
     * Sets the value of the `FormArray`. It accepts an array that matches
     * the structure of the control.
     *
     * This method performs strict checks, and throws an error if you try
     * to set the value of a control that doesn't exist or if you exclude the
     * value of a control.
     *
     * @usageNotes
     * ### Set the values for the controls in the form array
     *
     * ```
     * const arr = new FormArray([
     *   new FormControl(),
     *   new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.setValue(['Nancy', 'Drew']);
     * console.log(arr.value);   // ['Nancy', 'Drew']
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    setValue(value, options = {}) {
        this._checkAllValuesPresent(value);
        value.forEach((newValue, index) => {
            this._throwIfControlMissing(index);
            this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormArray`. It accepts an array that matches the
     * structure of the control, and does its best to match the values to the correct
     * controls in the group.
     *
     * It accepts both super-sets and sub-sets of the array without throwing an error.
     *
     * @usageNotes
     * ### Patch the values for controls in a form array
     *
     * ```
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.value);   // [null, null]
     *
     * arr.patchValue(['Nancy']);
     * console.log(arr.value);   // ['Nancy', null]
     * ```
     *
     * @param value Array of latest values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        value.forEach((newValue, index) => {
            if (this.at(index)) {
                this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
     * value of all descendants to null or null maps.
     *
     * You reset to a specific form state by passing in an array of states
     * that matches the structure of the control. The state is a standalone value
     * or a form state object with both a value and a disabled status.
     *
     * @usageNotes
     * ### Reset the values in a form array
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * arr.reset(['name', 'last name']);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * ```
     *
     * ### Reset the values in a form array and the disabled status for the first control
     *
     * ```
     * this.arr.reset([
     *   {value: 'name', disabled: true},
     *   'last'
     * ]);
     *
     * console.log(this.arr.value);  // ['name', 'last name']
     * console.log(this.arr.get(0).status);  // 'DISABLED'
     * ```
     *
     * @param value Array of values for the controls
     * @param options Configure options that determine how the control propagates changes and
     * emits events after the value changes
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
     * is false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     */
    reset(value = [], options = {}) {
        this._forEachChild((control, index) => {
            control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the array, including any disabled controls.
     *
     * Reports all values regardless of disabled status.
     * For enabled controls only, the `value` property is the best way to get the value of the array.
     */
    getRawValue() {
        return this.controls.map((control) => {
            return control instanceof FormControl ? control.value : control.getRawValue();
        });
    }
    /**
     * Remove all controls in the `FormArray`.
     *
     * @usageNotes
     * ### Remove all elements from a FormArray
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     * console.log(arr.length);  // 2
     *
     * arr.clear();
     * console.log(arr.length);  // 0
     * ```
     *
     * It's a simpler and more efficient alternative to removing all elements one by one:
     *
     * ```ts
     * const arr = new FormArray([
     *    new FormControl(),
     *    new FormControl()
     * ]);
     *
     * while (arr.length) {
     *    arr.removeAt(0);
     * }
     * ```
     */
    clear() {
        if (this.controls.length < 1)
            return;
        this._forEachChild((control) => control._registerOnCollectionChange(() => { }));
        this.controls.splice(0);
        this.updateValueAndValidity();
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this.controls.reduce((updated, child) => {
            return child._syncPendingControls() ? true : updated;
        }, false);
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _throwIfControlMissing(index) {
        if (!this.controls.length) {
            throw new Error(`
        There are no form controls registered with this array yet.  If you're using ngModel,
        you may want to check next tick (e.g. use setTimeout).
      `);
        }
        if (!this.at(index)) {
            throw new Error(`Cannot find form control at index ${index}`);
        }
    }
    /** @internal */
    _forEachChild(cb) {
        this.controls.forEach((control, index) => {
            cb(control, index);
        });
    }
    /** @internal */
    _updateValue() {
        this.value =
            this.controls.filter((control) => control.enabled || this.disabled)
                .map((control) => control.value);
    }
    /** @internal */
    _anyControls(condition) {
        return this.controls.some((control) => control.enabled && condition(control));
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => this._registerControl(control));
    }
    /** @internal */
    _checkAllValuesPresent(value) {
        this._forEachChild((control, i) => {
            if (value[i] === undefined) {
                throw new Error(`Must supply a value for form control at index: ${i}.`);
            }
        });
    }
    /** @internal */
    _allControlsDisabled() {
        for (const control of this.controls) {
            if (control.enabled)
                return false;
        }
        return this.controls.length > 0 || this.disabled;
    }
    _registerControl(control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => NgForm)
};
const resolvedPromise = (() => Promise.resolve(null))();
/**
 * @description
 * Creates a top-level `FormGroup` instance and binds it to a form
 * to track aggregate form value and validation status.
 *
 * As soon as you import the `FormsModule`, this directive becomes active by default on
 * all `<form>` tags.  You don't need to add a special selector.
 *
 * You optionally export the directive into a local template variable using `ngForm` as the key
 * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
 * `FormGroup` instance are duplicated on the directive itself, so a reference to it
 * gives you access to the aggregate value and validity status of the form, as well as
 * user interaction properties like `dirty` and `touched`.
 *
 * To register child controls with the form, use `NgModel` with a `name`
 * attribute. You may use `NgModelGroup` to create sub-groups within the form.
 *
 * If necessary, listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event emits the original form
 * submission event.
 *
 * In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
 * To import the `FormsModule` but skip its usage in some forms,
 * for example, to use native HTML5 validation, add the `ngNoForm` and the `<form>`
 * tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
 * unnecessary because the `<form>` tags are inert. In that case, you would
 * refrain from using the `formGroup` directive.
 *
 * @usageNotes
 *
 * ### Listening for form submission
 *
 * The following example shows how to capture the form values from the "ngSubmit" event.
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Setting the update options
 *
 * The following example shows you how to change the "updateOn" option from its default using
 * ngFormOptions.
 *
 * ```html
 * <form [ngFormOptions]="{updateOn: 'blur'}">
 *    <input name="one" ngModel>  <!-- this ngModel will update on blur -->
 * </form>
 * ```
 *
 * ### Native DOM validation UI
 *
 * In order to prevent the native DOM form validation UI from interfering with Angular's form
 * validation, Angular automatically adds the `novalidate` attribute on any `<form>` whenever
 * `FormModule` or `ReactiveFormModule` are imported into the application.
 * If you want to explicitly enable native DOM validation UI with Angular forms, you can add the
 * `ngNativeValidate` attribute to the `<form>` element:
 *
 * ```html
 * <form ngNativeValidate>
 *   ...
 * </form>
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
class NgForm extends ControlContainer {
    constructor(validators, asyncValidators) {
        super();
        /**
         * @description
         * Returns whether the form submission has been triggered.
         */
        this.submitted = false;
        this._directives = [];
        /**
         * @description
         * Event emitter for the "ngSubmit" event
         */
        this.ngSubmit = new EventEmitter();
        this.form =
            new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
    }
    /**
     * @description
     * Lifecycle method called after the view is initialized. For internal use only.
     */
    ngAfterViewInit() {
        this._setUpdateStrategy();
    }
    /**
     * @description
     * The directive instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * The internal `FormGroup` instance.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it is always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Returns a map of the controls in this group.
     */
    get controls() {
        return this.form.controls;
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `NgModel` directive instance.
     */
    addControl(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            dir.control =
                container.registerControl(dir.name, dir.control);
            setUpControl(dir.control, dir);
            dir.control.updateValueAndValidity({ emitEvent: false });
            this._directives.push(dir);
        });
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `NgModel` directive.
     *
     * @param dir The `NgModel` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `NgModel` instance from the internal list of directives
     *
     * @param dir The `NgModel` directive instance.
     */
    removeControl(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
            removeDir(this._directives, dir);
        });
    }
    /**
     * @description
     * Adds a new `NgModelGroup` directive instance to the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    addFormGroup(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            const group = new FormGroup({});
            setUpFormContainer(group, dir);
            container.registerControl(dir.name, group);
            group.updateValueAndValidity({ emitEvent: false });
        });
    }
    /**
     * @description
     * Removes the `NgModelGroup` directive instance from the form.
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    removeFormGroup(dir) {
        resolvedPromise.then(() => {
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
        });
    }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
     *
     * @param dir The `NgModelGroup` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `NgControl` directive.
     *
     * @param dir The `NgControl` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        resolvedPromise.then(() => {
            const ctrl = this.form.get(dir.path);
            ctrl.setValue(value);
        });
    }
    /**
     * @description
     * Sets the value for this `FormGroup`.
     *
     * @param value The new value
     */
    setValue(value) {
        this.control.setValue(value);
    }
    /**
     * @description
     * Method called when the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this._directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset() {
        this.resetForm();
    }
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
            this.form._updateOn = this.options.updateOn;
        }
    }
    /** @internal */
    _findContainer(path) {
        path.pop();
        return path.length ? this.form.get(path) : this.form;
    }
}
NgForm.ɵfac = function NgForm_Factory(t) { return new (t || NgForm)(ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
NgForm.ɵdir = ɵɵdefineDirective({ type: NgForm, selectors: [["form", 3, "ngNoForm", "", 3, "formGroup", ""], ["ng-form"], ["", "ngForm", ""]], hostBindings: function NgForm_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("submit", function NgForm_submit_HostBindingHandler($event) { return ctx.onSubmit($event); })("reset", function NgForm_reset_HostBindingHandler() { return ctx.onReset(); });
    } }, inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], features: [ɵɵProvidersFeature([formDirectiveProvider]), ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgForm, [{
        type: Directive,
        args: [{
                selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
                providers: [formDirectiveProvider],
                host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                outputs: ['ngSubmit'],
                exportAs: 'ngForm'
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }]; }, { options: [{
            type: Input,
            args: ['ngFormOptions']
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @description
 * A base class for code shared between the `NgModelGroup` and `FormGroupName` directives.
 *
 * @publicApi
 */
class AbstractFormGroupDirective extends ControlContainer {
    /**
     * @description
     * An internal callback method triggered on the instance after the inputs are set.
     * Registers the group with its parent group.
     */
    ngOnInit() {
        this._checkParentType();
        this.formDirective.addFormGroup(this);
    }
    /**
     * @description
     * An internal callback method triggered before the instance is destroyed.
     * Removes the group from its parent group.
     */
    ngOnDestroy() {
        if (this.formDirective) {
            this.formDirective.removeFormGroup(this);
        }
    }
    /**
     * @description
     * The `FormGroup` bound to this directive.
     */
    get control() {
        return this.formDirective.getFormGroup(this);
    }
    /**
     * @description
     * The path to this group from the top-level directive.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * The synchronous validators registered with this group.
     */
    get validator() {
        return composeValidators(this._validators);
    }
    /**
     * @description
     * The async validators registered with this group.
     */
    get asyncValidator() {
        return composeAsyncValidators(this._asyncValidators);
    }
    /** @internal */
    _checkParentType() { }
}
AbstractFormGroupDirective.ɵfac = function AbstractFormGroupDirective_Factory(t) { return ɵAbstractFormGroupDirective_BaseFactory(t || AbstractFormGroupDirective); };
AbstractFormGroupDirective.ɵdir = ɵɵdefineDirective({ type: AbstractFormGroupDirective, features: [ɵɵInheritDefinitionFeature] });
const ɵAbstractFormGroupDirective_BaseFactory = ɵɵgetInheritedFactory(AbstractFormGroupDirective);
/*@__PURE__*/ (function () { ɵsetClassMetadata(AbstractFormGroupDirective, [{
        type: Directive
    }], null, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class TemplateDrivenErrors {
    static modelParentException() {
        throw new Error(`
      ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
      formGroup's partner directive "formControlName" instead.  Example:

      ${FormErrorExamples.formControlName}

      Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

      Example:

      ${FormErrorExamples.ngModelWithFormGroup}`);
    }
    static formGroupNameException() {
        throw new Error(`
      ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

      Option 1: Use formControlName instead of ngModel (reactive strategy):

      ${FormErrorExamples.formGroupName}

      Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

      ${FormErrorExamples.ngModelGroup}`);
    }
    static missingNameException() {
        throw new Error(`If ngModel is used within a form tag, either the name attribute must be set or the form
      control must be defined as 'standalone' in ngModelOptions.

      Example 1: <input [(ngModel)]="person.firstName" name="first">
      Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
    }
    static modelGroupParentException() {
        throw new Error(`
      ngModelGroup cannot be used with a parent formGroup directive.

      Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

      ${FormErrorExamples.formGroupName}

      Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

      ${FormErrorExamples.ngModelGroup}`);
    }
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const modelGroupProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => NgModelGroup)
};
/**
 * @description
 * Creates and binds a `FormGroup` instance to a DOM element.
 *
 * This directive can only be used as a child of `NgForm` (within `<form>` tags).
 *
 * Use this directive to validate a sub-group of your form separately from the
 * rest of your form, or if some values in your domain model make more sense
 * to consume together in a nested object.
 *
 * Provide a name for the sub-group and it will become the key
 * for the sub-group in the form's full value. If you need direct access, export the directive into
 * a local template variable using `ngModelGroup` (ex: `#myGroup="ngModelGroup"`).
 *
 * @usageNotes
 *
 * ### Consuming controls in a grouping
 *
 * The following example shows you how to combine controls together in a sub-group
 * of the form.
 *
 * {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
 *
 * @ngModule FormsModule
 * @publicApi
 */
class NgModelGroup extends AbstractFormGroupDirective {
    constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /** @internal */
    _checkParentType() {
        if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
            TemplateDrivenErrors.modelGroupParentException();
        }
    }
}
NgModelGroup.ɵfac = function NgModelGroup_Factory(t) { return new (t || NgModelGroup)(ɵɵdirectiveInject(ControlContainer, 5), ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
NgModelGroup.ɵdir = ɵɵdefineDirective({ type: NgModelGroup, selectors: [["", "ngModelGroup", ""]], inputs: { name: ["ngModelGroup", "name"] }, exportAs: ["ngModelGroup"], features: [ɵɵProvidersFeature([modelGroupProvider]), ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgModelGroup, [{
        type: Directive,
        args: [{ selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup' }]
    }], function () { return [{ type: ControlContainer, decorators: [{
                type: Host
            }, {
                type: SkipSelf
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }]; }, { name: [{
            type: Input,
            args: ['ngModelGroup']
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const formControlBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => NgModel)
};
/**
 * `ngModel` forces an additional change detection run when its inputs change:
 * E.g.:
 * ```
 * <div>{{myModel.valid}}</div>
 * <input [(ngModel)]="myValue" #myModel="ngModel">
 * ```
 * I.e. `ngModel` can export itself on the element and then be used in the template.
 * Normally, this would result in expressions before the `input` that use the exported directive
 * to have and old value as they have been
 * dirty checked before. As this is a very common case for `ngModel`, we added this second change
 * detection run.
 *
 * Notes:
 * - this is just one extra run no matter how many `ngModel` have been changed.
 * - this is a general problem when using `exportAs` for directives!
 */
const resolvedPromise$1 = (() => Promise.resolve(null))();
/**
 * @description
 * Creates a `FormControl` instance from a domain model and binds it
 * to a form control element.
 *
 * The `FormControl` instance tracks the value, user interaction, and
 * validation status of the control and keeps the view synced with the model. If used
 * within a parent form, the directive also registers itself with the form as a child
 * control.
 *
 * This directive is used by itself or as part of a larger form. Use the
 * `ngModel` selector to activate it.
 *
 * It accepts a domain model as an optional `Input`. If you have a one-way binding
 * to `ngModel` with `[]` syntax, changing the value of the domain model in the component
 * class sets the value in the view. If you have a two-way binding with `[()]` syntax
 * (also known as 'banana-box syntax'), the value in the UI always syncs back to
 * the domain model in your class.
 *
 * To inspect the properties of the associated `FormControl` (like validity state),
 * export the directive into a local template variable using `ngModel` as the key (ex:
 * `#myVar="ngModel"`). You then access the control using the directive's `control` property, but
 * most properties used (like `valid` and `dirty`) fall through to the control anyway for direct
 * access. See a full list of properties directly available in `AbstractControlDirective`.
 *
 * @see `RadioControlValueAccessor`
 * @see `SelectControlValueAccessor`
 *
 * @usageNotes
 *
 * ### Using ngModel on a standalone control
 *
 * The following examples show a simple standalone control using `ngModel`:
 *
 * {@example forms/ts/simpleNgModel/simple_ng_model_example.ts region='Component'}
 *
 * When using the `ngModel` within `<form>` tags, you'll also need to supply a `name` attribute
 * so that the control can be registered with the parent form under that name.
 *
 * In the context of a parent form, it's often unnecessary to include one-way or two-way binding,
 * as the parent form syncs the value for you. You access its properties by exporting it into a
 * local template variable using `ngForm` such as (`#f="ngForm"`). Use the variable where
 * needed on form submission.
 *
 * If you do need to populate initial values into your form, using a one-way binding for
 * `ngModel` tends to be sufficient as long as you use the exported form's value rather
 * than the domain model's value on submit.
 *
 * ### Using ngModel within a form
 *
 * The following example shows controls using `ngModel` within a form:
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Using a standalone ngModel within a group
 *
 * The following example shows you how to use a standalone ngModel control
 * within a form. This controls the display of the form, but doesn't contain form data.
 *
 * ```html
 * <form>
 *   <input name="login" ngModel placeholder="Login">
 *   <input type="checkbox" ngModel [ngModelOptions]="{standalone: true}"> Show more options?
 * </form>
 * <!-- form value: {login: ''} -->
 * ```
 *
 * ### Setting the ngModel name attribute through options
 *
 * The following example shows you an alternate way to set the name attribute. The name attribute is
 * used within a custom form component, and the name `@Input` property serves a different purpose.
 *
 * ```html
 * <form>
 *   <my-person-control name="Nancy" ngModel [ngModelOptions]="{name: 'user'}">
 *   </my-person-control>
 * </form>
 * <!-- form value: {user: ''} -->
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
class NgModel extends NgControl {
    constructor(parent, validators, asyncValidators, valueAccessors) {
        super();
        this.control = new FormControl();
        /** @internal */
        this._registered = false;
        /**
         * @description
         * Event emitter for producing the `ngModelChange` event after
         * the view model updates.
         */
        this.update = new EventEmitter();
        this._parent = parent;
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        this._checkForErrors();
        if (!this._registered)
            this._setUpControl();
        if ('isDisabled' in changes) {
            this._updateDisabled(changes);
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            this._updateValue(this.model);
            this.viewModel = this.model;
        }
    }
    /**
     * @description
     * Lifecycle method called before the directive's instance is destroyed. For internal
     * use only.
     */
    ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return this._parent ? controlPath(this.name, this._parent) : [this.name];
    }
    /**
     * @description
     * The top-level directive for this control if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators
     * registered with this directive.
     */
    get validator() {
        return composeValidators(this._rawValidators);
    }
    /**
     * @description
     * Async validator function composed of all the async validators registered with this
     * directive.
     */
    get asyncValidator() {
        return composeAsyncValidators(this._rawAsyncValidators);
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value emitted by `ngModelChange`.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _setUpControl() {
        this._setUpdateStrategy();
        this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
        this._registered = true;
    }
    _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
            this.control._updateOn = this.options.updateOn;
        }
    }
    _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
    }
    _setUpStandalone() {
        setUpControl(this.control, this);
        this.control.updateValueAndValidity({ emitEvent: false });
    }
    _checkForErrors() {
        if (!this._isStandalone()) {
            this._checkParentType();
        }
        this._checkName();
    }
    _checkParentType() {
        if (!(this._parent instanceof NgModelGroup) &&
            this._parent instanceof AbstractFormGroupDirective) {
            TemplateDrivenErrors.formGroupNameException();
        }
        else if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
            TemplateDrivenErrors.modelParentException();
        }
    }
    _checkName() {
        if (this.options && this.options.name)
            this.name = this.options.name;
        if (!this._isStandalone() && !this.name) {
            TemplateDrivenErrors.missingNameException();
        }
    }
    _updateValue(value) {
        resolvedPromise$1.then(() => {
            this.control.setValue(value, { emitViewToModelChange: false });
        });
    }
    _updateDisabled(changes) {
        const disabledValue = changes['isDisabled'].currentValue;
        const isDisabled = disabledValue === '' || (disabledValue && disabledValue !== 'false');
        resolvedPromise$1.then(() => {
            if (isDisabled && !this.control.disabled) {
                this.control.disable();
            }
            else if (!isDisabled && this.control.disabled) {
                this.control.enable();
            }
        });
    }
}
NgModel.ɵfac = function NgModel_Factory(t) { return new (t || NgModel)(ɵɵdirectiveInject(ControlContainer, 9), ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10), ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10)); };
NgModel.ɵdir = ɵɵdefineDirective({ type: NgModel, selectors: [["", "ngModel", "", 3, "formControlName", "", 3, "formControl", ""]], inputs: { name: "name", isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"], options: ["ngModelOptions", "options"] }, outputs: { update: "ngModelChange" }, exportAs: ["ngModel"], features: [ɵɵProvidersFeature([formControlBinding]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(NgModel, [{
        type: Directive,
        args: [{
                selector: '[ngModel]:not([formControlName]):not([formControl])',
                providers: [formControlBinding],
                exportAs: 'ngModel'
            }]
    }], function () { return [{ type: ControlContainer, decorators: [{
                type: Optional
            }, {
                type: Host
            }] }, { type: Array, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: Array, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALUE_ACCESSOR]
            }] }]; }, { name: [{
            type: Input
        }], isDisabled: [{
            type: Input,
            args: ['disabled']
        }], model: [{
            type: Input,
            args: ['ngModel']
        }], options: [{
            type: Input,
            args: ['ngModelOptions']
        }], update: [{
            type: Output,
            args: ['ngModelChange']
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @description
 *
 * Adds `novalidate` attribute to all forms by default.
 *
 * `novalidate` is used to disable browser's native form validation.
 *
 * If you want to use native validation with Angular forms, just add `ngNativeValidate` attribute:
 *
 * ```
 * <form ngNativeValidate></form>
 * ```
 *
 * @publicApi
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 */
class ɵNgNoValidate {
}
ɵNgNoValidate.ɵfac = function ɵNgNoValidate_Factory(t) { return new (t || ɵNgNoValidate)(); };
ɵNgNoValidate.ɵdir = ɵɵdefineDirective({ type: ɵNgNoValidate, selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]], hostAttrs: ["novalidate", ""] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(ɵNgNoValidate, [{
        type: Directive,
        args: [{
                selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
                host: { 'novalidate': '' },
            }]
    }], null, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Token to provide to turn off the ngModel warning on formControl and formControlName.
 */
const NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken('NgModelWithFormControlWarning');
const formControlBinding$1 = {
    provide: NgControl,
    useExisting: forwardRef(() => FormControlDirective)
};
/**
 * @description
 * Synchronizes a standalone `FormControl` instance to a form control element.
 *
 * Note that support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives was deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * The following example shows how to register a standalone control and set its value.
 *
 * {@example forms/ts/simpleFormControl/simple_form_control_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormControlDirective extends NgControl {
    constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        /** @deprecated as of v6 */
        this.update = new EventEmitter();
        /**
         * @description
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular `FormControlDirective` instance. Used to support warning config of "always".
         *
         * @internal
         */
        this._ngModelWarningSent = false;
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /**
     * @description
     * Triggers a warning that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled) {
        ReactiveErrors.disabledAttrWarning();
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
            setUpControl(this.form, this);
            if (this.control.disabled && this.valueAccessor.setDisabledState) {
                this.valueAccessor.setDisabledState(true);
            }
            this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
            _ngModelWarning('formControl', FormControlDirective, this, this._ngModelWarningConfig);
            this.form.setValue(this.model);
            this.viewModel = this.model;
        }
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators
     * registered with this directive.
     */
    get validator() {
        return composeValidators(this._rawValidators);
    }
    /**
     * @description
     * Async validator function composed of all the async validators registered with this
     * directive.
     */
    get asyncValidator() {
        return composeAsyncValidators(this._rawAsyncValidators);
    }
    /**
     * @description
     * The `FormControl` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _isControlChanged(changes) {
        return changes.hasOwnProperty('form');
    }
}
/**
 * @description
 * Static property used to track whether any ngModel warnings have been sent across
 * all instances of FormControlDirective. Used to support warning config of "once".
 *
 * @internal
 */
FormControlDirective._ngModelWarningSentOnce = false;
FormControlDirective.ɵfac = function FormControlDirective_Factory(t) { return new (t || FormControlDirective)(ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10), ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10), ɵɵdirectiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8)); };
FormControlDirective.ɵdir = ɵɵdefineDirective({ type: FormControlDirective, selectors: [["", "formControl", ""]], inputs: { form: ["formControl", "form"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, exportAs: ["ngForm"], features: [ɵɵProvidersFeature([formControlBinding$1]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FormControlDirective, [{
        type: Directive,
        args: [{ selector: '[formControl]', providers: [formControlBinding$1], exportAs: 'ngForm' }]
    }], function () { return [{ type: Array, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: Array, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALUE_ACCESSOR]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
            }] }]; }, { form: [{
            type: Input,
            args: ['formControl']
        }], isDisabled: [{
            type: Input,
            args: ['disabled']
        }], model: [{
            type: Input,
            args: ['ngModel']
        }], update: [{
            type: Output,
            args: ['ngModelChange']
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const formDirectiveProvider$1 = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupDirective)
};
/**
 * @description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormGroupDirective extends ControlContainer {
    constructor(_validators, _asyncValidators) {
        super();
        this._validators = _validators;
        this._asyncValidators = _asyncValidators;
        /**
         * @description
         * Reports whether the form submission has been triggered.
         */
        this.submitted = false;
        /**
         * @description
         * Tracks the list of added `FormControlName` instances
         */
        this.directives = [];
        /**
         * @description
         * Tracks the `FormGroup` bound to this directive.
         */
        this.form = null;
        /**
         * @description
         * Emits an event when the form submission has been triggered.
         */
        this.ngSubmit = new EventEmitter();
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
        }
    }
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir) {
        removeDir(this.directives, dir);
    }
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    /**
     * No-op method to remove the form group.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir) { }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Adds a new `FormArrayName` directive instance to the form.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    /**
     * No-op method to remove the form array.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir) { }
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    }
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * @description
     * Method called when the "reset" event is triggered on the form.
     */
    onReset() {
        this.resetForm();
    }
    /**
     * @description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param value The new value for the form.
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        this.submitted = false;
    }
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            const newCtrl = this.form.get(dir.path);
            if (dir.control !== newCtrl) {
                cleanUpControl(dir.control, dir);
                if (newCtrl)
                    setUpControl(newCtrl, dir);
                dir.control = newCtrl;
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    _updateRegistrations() {
        this.form._registerOnCollectionChange(() => this._updateDomValue());
        if (this._oldForm)
            this._oldForm._registerOnCollectionChange(() => { });
        this._oldForm = this.form;
    }
    _updateValidators() {
        const sync = composeValidators(this._validators);
        this.form.validator = Validators.compose([this.form.validator, sync]);
        const async = composeAsyncValidators(this._asyncValidators);
        this.form.asyncValidator = Validators.composeAsync([this.form.asyncValidator, async]);
    }
    _checkFormPresent() {
        if (!this.form) {
            ReactiveErrors.missingFormException();
        }
    }
}
FormGroupDirective.ɵfac = function FormGroupDirective_Factory(t) { return new (t || FormGroupDirective)(ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
FormGroupDirective.ɵdir = ɵɵdefineDirective({ type: FormGroupDirective, selectors: [["", "formGroup", ""]], hostBindings: function FormGroupDirective_HostBindings(rf, ctx) { if (rf & 1) {
        ɵɵlistener("submit", function FormGroupDirective_submit_HostBindingHandler($event) { return ctx.onSubmit($event); })("reset", function FormGroupDirective_reset_HostBindingHandler() { return ctx.onReset(); });
    } }, inputs: { form: ["formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], features: [ɵɵProvidersFeature([formDirectiveProvider$1]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FormGroupDirective, [{
        type: Directive,
        args: [{
                selector: '[formGroup]',
                providers: [formDirectiveProvider$1],
                host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                exportAs: 'ngForm'
            }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }]; }, { form: [{
            type: Input,
            args: ['formGroup']
        }], ngSubmit: [{
            type: Output
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const formGroupNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupName)
};
/**
 * @description
 *
 * Syncs a nested `FormGroup` to a DOM element.
 *
 * This directive can only be used with a parent `FormGroupDirective`.
 *
 * It accepts the string name of the nested `FormGroup` to link, and
 * looks for a `FormGroup` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * Use nested form groups to validate a sub-group of a
 * form separately from the rest or to group the values of certain
 * controls into their own nested object.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @usageNotes
 *
 * ### Access the group by name
 *
 * The following example uses the {@link AbstractControl#get get} method to access the
 * associated `FormGroup`
 *
 * ```ts
 *   this.form.get('name');
 * ```
 *
 * ### Access individual controls in the group
 *
 * The following example uses the {@link AbstractControl#get get} method to access
 * individual controls within the group using dot syntax.
 *
 * ```ts
 *   this.form.get('name.first');
 * ```
 *
 * ### Register a nested `FormGroup`.
 *
 * The following example registers a nested *name* `FormGroup` within an existing `FormGroup`,
 * and provides methods to retrieve the nested `FormGroup` and individual controls.
 *
 * {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormGroupName extends AbstractFormGroupDirective {
    constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /** @internal */
    _checkParentType() {
        if (_hasInvalidParent(this._parent)) {
            ReactiveErrors.groupParentException();
        }
    }
}
FormGroupName.ɵfac = function FormGroupName_Factory(t) { return new (t || FormGroupName)(ɵɵdirectiveInject(ControlContainer, 13), ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
FormGroupName.ɵdir = ɵɵdefineDirective({ type: FormGroupName, selectors: [["", "formGroupName", ""]], inputs: { name: ["formGroupName", "name"] }, features: [ɵɵProvidersFeature([formGroupNameProvider]), ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FormGroupName, [{
        type: Directive,
        args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] }]
    }], function () { return [{ type: ControlContainer, decorators: [{
                type: Optional
            }, {
                type: Host
            }, {
                type: SkipSelf
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }]; }, { name: [{
            type: Input,
            args: ['formGroupName']
        }] }); })();
const formArrayNameProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormArrayName)
};
/**
 * @description
 *
 * Syncs a nested `FormArray` to a DOM element.
 *
 * This directive is designed to be used with a parent `FormGroupDirective` (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the nested `FormArray` you want to link, and
 * will look for a `FormArray` registered with that name in the parent
 * `FormGroup` instance you passed into `FormGroupDirective`.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * ### Example
 *
 * {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormArrayName extends ControlContainer {
    constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs are initialized. For internal use only.
     *
     * @throws If the directive does not have a valid parent.
     */
    ngOnInit() {
        this._checkParentType();
        this.formDirective.addFormArray(this);
    }
    /**
     * @description
     * A lifecycle method called before the directive's instance is destroyed. For internal use only.
     */
    ngOnDestroy() {
        if (this.formDirective) {
            this.formDirective.removeFormArray(this);
        }
    }
    /**
     * @description
     * The `FormArray` bound to this directive.
     */
    get control() {
        return this.formDirective.getFormArray(this);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators registered with this
     * directive.
     */
    get validator() {
        return composeValidators(this._validators);
    }
    /**
     * @description
     * Async validator function composed of all the async validators registered with this directive.
     */
    get asyncValidator() {
        return composeAsyncValidators(this._asyncValidators);
    }
    _checkParentType() {
        if (_hasInvalidParent(this._parent)) {
            ReactiveErrors.arrayParentException();
        }
    }
}
FormArrayName.ɵfac = function FormArrayName_Factory(t) { return new (t || FormArrayName)(ɵɵdirectiveInject(ControlContainer, 13), ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
FormArrayName.ɵdir = ɵɵdefineDirective({ type: FormArrayName, selectors: [["", "formArrayName", ""]], inputs: { name: ["formArrayName", "name"] }, features: [ɵɵProvidersFeature([formArrayNameProvider]), ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FormArrayName, [{
        type: Directive,
        args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] }]
    }], function () { return [{ type: ControlContainer, decorators: [{
                type: Optional
            }, {
                type: Host
            }, {
                type: SkipSelf
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }]; }, { name: [{
            type: Input,
            args: ['formArrayName']
        }] }); })();
function _hasInvalidParent(parent) {
    return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) &&
        !(parent instanceof FormArrayName);
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const controlNameBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => FormControlName)
};
/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * ### Register `FormControl` within a group
 *
 * The following example shows how to register multiple form controls within a form group
 * and set their value.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel is deprecated
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and is scheduled for removal in
 * a future version of Angular.
 *
 * For details, see [Deprecated features](guide/deprecations#ngmodel-with-reactive-forms).
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class FormControlName extends NgControl {
    constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        this._added = false;
        /** @deprecated as of v6 */
        this.update = new EventEmitter();
        /**
         * @description
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular FormControlName instance. Used to support warning config of "always".
         *
         * @internal
         */
        this._ngModelWarningSent = false;
        this._parent = parent;
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
    /**
     * @description
     * Triggers a warning that this input should not be used with reactive forms.
     */
    set isDisabled(isDisabled) {
        ReactiveErrors.disabledAttrWarning();
    }
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        if (!this._added)
            this._setUpControl();
        if (isPropertyUpdated(changes, this.viewModel)) {
            _ngModelWarning('formControlName', FormControlName, this, this._ngModelWarningConfig);
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    }
    /**
     * @description
     * Lifecycle method called before the directive's instance is destroyed. For internal use only.
     */
    ngOnDestroy() {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
    }
    /**
     * @description
     * Sets the new value for the view model and emits an `ngModelChange` event.
     *
     * @param newValue The new value for the view model.
     */
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    /**
     * @description
     * Returns an array that represents the path from the top-level form to this control.
     * Each index is the string name of the control on that level.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /**
     * @description
     * Synchronous validator function composed of all the synchronous validators
     * registered with this directive.
     */
    get validator() {
        return composeValidators(this._rawValidators);
    }
    /**
     * @description
     * Async validator function composed of all the async validators registered with this
     * directive.
     */
    get asyncValidator() {
        return composeAsyncValidators(this._rawAsyncValidators);
    }
    _checkParentType() {
        if (!(this._parent instanceof FormGroupName) &&
            this._parent instanceof AbstractFormGroupDirective) {
            ReactiveErrors.ngModelGroupException();
        }
        else if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective) &&
            !(this._parent instanceof FormArrayName)) {
            ReactiveErrors.controlParentException();
        }
    }
    _setUpControl() {
        this._checkParentType();
        this.control = this.formDirective.addControl(this);
        if (this.control.disabled && this.valueAccessor.setDisabledState) {
            this.valueAccessor.setDisabledState(true);
        }
        this._added = true;
    }
}
/**
 * @description
 * Static property used to track whether any ngModel warnings have been sent across
 * all instances of FormControlName. Used to support warning config of "once".
 *
 * @internal
 */
FormControlName._ngModelWarningSentOnce = false;
FormControlName.ɵfac = function FormControlName_Factory(t) { return new (t || FormControlName)(ɵɵdirectiveInject(ControlContainer, 13), ɵɵdirectiveInject(NG_VALIDATORS, 10), ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10), ɵɵdirectiveInject(NG_VALUE_ACCESSOR, 10), ɵɵdirectiveInject(NG_MODEL_WITH_FORM_CONTROL_WARNING, 8)); };
FormControlName.ɵdir = ɵɵdefineDirective({ type: FormControlName, selectors: [["", "formControlName", ""]], inputs: { name: ["formControlName", "name"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, features: [ɵɵProvidersFeature([controlNameBinding]), ɵɵInheritDefinitionFeature, ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FormControlName, [{
        type: Directive,
        args: [{ selector: '[formControlName]', providers: [controlNameBinding] }]
    }], function () { return [{ type: ControlContainer, decorators: [{
                type: Optional
            }, {
                type: Host
            }, {
                type: SkipSelf
            }] }, { type: Array, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALIDATORS]
            }] }, { type: Array, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_ASYNC_VALIDATORS]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Self
            }, {
                type: Inject,
                args: [NG_VALUE_ACCESSOR]
            }] }, { type: undefined, decorators: [{
                type: Optional
            }, {
                type: Inject,
                args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
            }] }]; }, { name: [{
            type: Input,
            args: ['formControlName']
        }], isDisabled: [{
            type: Input,
            args: ['disabled']
        }], model: [{
            type: Input,
            args: ['ngModel']
        }], update: [{
            type: Output,
            args: ['ngModelChange']
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => RequiredValidator),
    multi: true
};
/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const CHECKBOX_REQUIRED_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CheckboxRequiredValidator),
    multi: true
};
/**
 * @description
 * A directive that adds the `required` validator to any controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required validator using template-driven forms
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
class RequiredValidator {
    /**
     * @description
     * Tracks changes to the required attribute bound to this directive.
     */
    get required() {
        return this._required;
    }
    set required(value) {
        this._required = value != null && value !== false && `${value}` !== 'false';
        if (this._onChange)
            this._onChange();
    }
    /**
     * @description
     * Method that validates whether the control is empty.
     * Returns the validation result if enabled, otherwise null.
     */
    validate(control) {
        return this.required ? Validators.required(control) : null;
    }
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
}
RequiredValidator.ɵfac = function RequiredValidator_Factory(t) { return new (t || RequiredValidator)(); };
RequiredValidator.ɵdir = ɵɵdefineDirective({ type: RequiredValidator, selectors: [["", "required", "", "formControlName", "", 3, "type", "checkbox"], ["", "required", "", "formControl", "", 3, "type", "checkbox"], ["", "required", "", "ngModel", "", 3, "type", "checkbox"]], hostVars: 1, hostBindings: function RequiredValidator_HostBindings(rf, ctx) { if (rf & 2) {
        ɵɵattribute("required", ctx.required ? "" : null);
    } }, inputs: { required: "required" }, features: [ɵɵProvidersFeature([REQUIRED_VALIDATOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(RequiredValidator, [{
        type: Directive,
        args: [{
                selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
                providers: [REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required ? "" : null' }
            }]
    }], null, { required: [{
            type: Input
        }] }); })();
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required checkbox validator using template-driven forms
 *
 * The following example shows how to add a checkbox required validator to an input attached to an
 * ngModel binding.
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
class CheckboxRequiredValidator extends RequiredValidator {
    /**
     * @description
     * Method that validates whether or not the checkbox has been checked.
     * Returns the validation result if enabled, otherwise null.
     */
    validate(control) {
        return this.required ? Validators.requiredTrue(control) : null;
    }
}
CheckboxRequiredValidator.ɵfac = function CheckboxRequiredValidator_Factory(t) { return ɵCheckboxRequiredValidator_BaseFactory(t || CheckboxRequiredValidator); };
CheckboxRequiredValidator.ɵdir = ɵɵdefineDirective({ type: CheckboxRequiredValidator, selectors: [["input", "type", "checkbox", "required", "", "formControlName", ""], ["input", "type", "checkbox", "required", "", "formControl", ""], ["input", "type", "checkbox", "required", "", "ngModel", ""]], hostVars: 1, hostBindings: function CheckboxRequiredValidator_HostBindings(rf, ctx) { if (rf & 2) {
        ɵɵattribute("required", ctx.required ? "" : null);
    } }, features: [ɵɵProvidersFeature([CHECKBOX_REQUIRED_VALIDATOR]), ɵɵInheritDefinitionFeature] });
const ɵCheckboxRequiredValidator_BaseFactory = ɵɵgetInheritedFactory(CheckboxRequiredValidator);
/*@__PURE__*/ (function () { ɵsetClassMetadata(CheckboxRequiredValidator, [{
        type: Directive,
        args: [{
                selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
                providers: [CHECKBOX_REQUIRED_VALIDATOR],
                host: { '[attr.required]': 'required ? "" : null' }
            }]
    }], null, null); })();
/**
 * @description
 * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const EMAIL_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => EmailValidator),
    multi: true
};
/**
 * A directive that adds the `email` validator to controls marked with the
 * `email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding an email validator
 *
 * The following example shows how to add an email validator to an input attached to an ngModel
 * binding.
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
class EmailValidator {
    /**
     * @description
     * Tracks changes to the email attribute bound to this directive.
     */
    set email(value) {
        this._enabled = value === '' || value === true || value === 'true';
        if (this._onChange)
            this._onChange();
    }
    /**
     * @description
     * Method that validates whether an email address is valid.
     * Returns the validation result if enabled, otherwise null.
     */
    validate(control) {
        return this._enabled ? Validators.email(control) : null;
    }
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
}
EmailValidator.ɵfac = function EmailValidator_Factory(t) { return new (t || EmailValidator)(); };
EmailValidator.ɵdir = ɵɵdefineDirective({ type: EmailValidator, selectors: [["", "email", "", "formControlName", ""], ["", "email", "", "formControl", ""], ["", "email", "", "ngModel", ""]], inputs: { email: "email" }, features: [ɵɵProvidersFeature([EMAIL_VALIDATOR])] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(EmailValidator, [{
        type: Directive,
        args: [{
                selector: '[email][formControlName],[email][formControl],[email][ngModel]',
                providers: [EMAIL_VALIDATOR]
            }]
    }], null, { email: [{
            type: Input
        }] }); })();
/**
 * @description
 * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const MIN_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinLengthValidator),
    multi: true
};
/**
 * A directive that adds minimum length validation to controls marked with the
 * `minlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a minimum length validator
 *
 * The following example shows how to add a minimum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel minlength="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class MinLengthValidator {
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        if ('minlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    /**
     * @description
     * Method that validates whether the value meets a minimum length
     * requirement. Returns the validation result if enabled, otherwise null.
     */
    validate(control) {
        return this.minlength == null ? null : this._validator(control);
    }
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
    _createValidator() {
        this._validator = Validators.minLength(typeof this.minlength === 'number' ? this.minlength : parseInt(this.minlength, 10));
    }
}
MinLengthValidator.ɵfac = function MinLengthValidator_Factory(t) { return new (t || MinLengthValidator)(); };
MinLengthValidator.ɵdir = ɵɵdefineDirective({ type: MinLengthValidator, selectors: [["", "minlength", "", "formControlName", ""], ["", "minlength", "", "formControl", ""], ["", "minlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function MinLengthValidator_HostBindings(rf, ctx) { if (rf & 2) {
        ɵɵattribute("minlength", ctx.minlength ? ctx.minlength : null);
    } }, inputs: { minlength: "minlength" }, features: [ɵɵProvidersFeature([MIN_LENGTH_VALIDATOR]), ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(MinLengthValidator, [{
        type: Directive,
        args: [{
                selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
                providers: [MIN_LENGTH_VALIDATOR],
                host: { '[attr.minlength]': 'minlength ? minlength : null' }
            }]
    }], null, { minlength: [{
            type: Input
        }] }); })();
/**
 * @description
 * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const MAX_LENGTH_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxLengthValidator),
    multi: true
};
/**
 * A directive that adds max length validation to controls marked with the
 * `maxlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a maximum length validator
 *
 * The following example shows how to add a maximum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel maxlength="25">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class MaxLengthValidator {
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        if ('maxlength' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    /**
     * @description
     * Method that validates whether the value exceeds
     * the maximum length requirement.
     */
    validate(control) {
        return this.maxlength != null ? this._validator(control) : null;
    }
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
    _createValidator() {
        this._validator = Validators.maxLength(typeof this.maxlength === 'number' ? this.maxlength : parseInt(this.maxlength, 10));
    }
}
MaxLengthValidator.ɵfac = function MaxLengthValidator_Factory(t) { return new (t || MaxLengthValidator)(); };
MaxLengthValidator.ɵdir = ɵɵdefineDirective({ type: MaxLengthValidator, selectors: [["", "maxlength", "", "formControlName", ""], ["", "maxlength", "", "formControl", ""], ["", "maxlength", "", "ngModel", ""]], hostVars: 1, hostBindings: function MaxLengthValidator_HostBindings(rf, ctx) { if (rf & 2) {
        ɵɵattribute("maxlength", ctx.maxlength ? ctx.maxlength : null);
    } }, inputs: { maxlength: "maxlength" }, features: [ɵɵProvidersFeature([MAX_LENGTH_VALIDATOR]), ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(MaxLengthValidator, [{
        type: Directive,
        args: [{
                selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
                providers: [MAX_LENGTH_VALIDATOR],
                host: { '[attr.maxlength]': 'maxlength ? maxlength : null' }
            }]
    }], null, { maxlength: [{
            type: Input
        }] }); })();
/**
 * @description
 * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
 */
const PATTERN_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => PatternValidator),
    multi: true
};
/**
 * @description
 * A directive that adds regex pattern validation to controls marked with the
 * `pattern` attribute. The regex must match the entire control value.
 * The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a pattern validator
 *
 * The following example shows how to add a pattern validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel pattern="[a-zA-Z ]*">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
class PatternValidator {
    /**
     * @description
     * A lifecycle method called when the directive's inputs change. For internal use
     * only.
     *
     * @param changes A object of key/value pairs for the set of changed inputs.
     */
    ngOnChanges(changes) {
        if ('pattern' in changes) {
            this._createValidator();
            if (this._onChange)
                this._onChange();
        }
    }
    /**
     * @description
     * Method that validates whether the value matches the
     * the pattern requirement.
     */
    validate(control) {
        return this._validator(control);
    }
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange(fn) {
        this._onChange = fn;
    }
    _createValidator() {
        this._validator = Validators.pattern(this.pattern);
    }
}
PatternValidator.ɵfac = function PatternValidator_Factory(t) { return new (t || PatternValidator)(); };
PatternValidator.ɵdir = ɵɵdefineDirective({ type: PatternValidator, selectors: [["", "pattern", "", "formControlName", ""], ["", "pattern", "", "formControl", ""], ["", "pattern", "", "ngModel", ""]], hostVars: 1, hostBindings: function PatternValidator_HostBindings(rf, ctx) { if (rf & 2) {
        ɵɵattribute("pattern", ctx.pattern ? ctx.pattern : null);
    } }, inputs: { pattern: "pattern" }, features: [ɵɵProvidersFeature([PATTERN_VALIDATOR]), ɵɵNgOnChangesFeature] });
/*@__PURE__*/ (function () { ɵsetClassMetadata(PatternValidator, [{
        type: Directive,
        args: [{
                selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
                providers: [PATTERN_VALIDATOR],
                host: { '[attr.pattern]': 'pattern ? pattern : null' }
            }]
    }], null, { pattern: [{
            type: Input
        }] }); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const SHARED_FORM_DIRECTIVES = [
    ɵNgNoValidate,
    NgSelectOption,
    ɵNgSelectMultipleOption,
    DefaultValueAccessor,
    NumberValueAccessor,
    RangeValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    SelectMultipleControlValueAccessor,
    RadioControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    MinLengthValidator,
    MaxLengthValidator,
    PatternValidator,
    CheckboxRequiredValidator,
    EmailValidator,
];
const TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
const REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
class ɵInternalFormsSharedModule {
}
ɵInternalFormsSharedModule.ɵmod = ɵɵdefineNgModule({ type: ɵInternalFormsSharedModule });
ɵInternalFormsSharedModule.ɵinj = ɵɵdefineInjector({ factory: function ɵInternalFormsSharedModule_Factory(t) { return new (t || ɵInternalFormsSharedModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(ɵInternalFormsSharedModule, { declarations: [ɵNgNoValidate,
        NgSelectOption,
        ɵNgSelectMultipleOption,
        DefaultValueAccessor,
        NumberValueAccessor,
        RangeValueAccessor,
        CheckboxControlValueAccessor,
        SelectControlValueAccessor,
        SelectMultipleControlValueAccessor,
        RadioControlValueAccessor,
        NgControlStatus,
        NgControlStatusGroup,
        RequiredValidator,
        MinLengthValidator,
        MaxLengthValidator,
        PatternValidator,
        CheckboxRequiredValidator,
        EmailValidator], exports: [ɵNgNoValidate,
        NgSelectOption,
        ɵNgSelectMultipleOption,
        DefaultValueAccessor,
        NumberValueAccessor,
        RangeValueAccessor,
        CheckboxControlValueAccessor,
        SelectControlValueAccessor,
        SelectMultipleControlValueAccessor,
        RadioControlValueAccessor,
        NgControlStatus,
        NgControlStatusGroup,
        RequiredValidator,
        MinLengthValidator,
        MaxLengthValidator,
        PatternValidator,
        CheckboxRequiredValidator,
        EmailValidator] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(ɵInternalFormsSharedModule, [{
        type: NgModule,
        args: [{
                declarations: SHARED_FORM_DIRECTIVES,
                exports: SHARED_FORM_DIRECTIVES,
            }]
    }], null, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function isAbstractControlOptions(options) {
    return options.asyncValidators !== undefined ||
        options.validators !== undefined ||
        options.updateOn !== undefined;
}
/**
 * @description
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * The `FormBuilder` provides syntactic sugar that shortens creating instances of a `FormControl`,
 * `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to build complex
 * forms.
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 * @publicApi
 */
class FormBuilder {
    /**
     * @description
     * Construct a new `FormGroup` instance.
     *
     * @param controlsConfig A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param options Configuration options object for the `FormGroup`. The object can
     * have two shapes:
     *
     * 1) `AbstractControlOptions` object (preferred), which consists of:
     * * `validators`: A synchronous validator function, or an array of validator functions
     * * `asyncValidators`: A single async validator or array of async validator functions
     * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur' |
     * submit')
     *
     * 2) Legacy configuration object, which consists of:
     * * `validator`: A synchronous validator function, or an array of validator functions
     * * `asyncValidator`: A single async validator or array of async validator functions
     *
     */
    group(controlsConfig, options = null) {
        const controls = this._reduceControls(controlsConfig);
        let validators = null;
        let asyncValidators = null;
        let updateOn = undefined;
        if (options != null) {
            if (isAbstractControlOptions(options)) {
                // `options` are `AbstractControlOptions`
                validators = options.validators != null ? options.validators : null;
                asyncValidators = options.asyncValidators != null ? options.asyncValidators : null;
                updateOn = options.updateOn != null ? options.updateOn : undefined;
            }
            else {
                // `options` are legacy form group options
                validators = options['validator'] != null ? options['validator'] : null;
                asyncValidators = options['asyncValidator'] != null ? options['asyncValidator'] : null;
            }
        }
        return new FormGroup(controls, { asyncValidators, updateOn, validators });
    }
    /**
     * @description
     * Construct a new `FormControl` with the given state, validators and options.
     *
     * @param formState Initializes the control with an initial state value, or
     * with an object that contains both a value and a disabled status.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator
     * functions.
     *
     * @usageNotes
     *
     * ### Initialize a control as disabled
     *
     * The following example returns a control with an initial value in a disabled state.
     *
     * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
     * </code-example>
     */
    control(formState, validatorOrOpts, asyncValidator) {
        return new FormControl(formState, validatorOrOpts, asyncValidator);
    }
    /**
     * Constructs a new `FormArray` from the given array of configurations,
     * validators and options.
     *
     * @param controlsConfig An array of child controls or control configs. Each
     * child control is given an index when it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains
     * validation functions and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator
     * functions.
     */
    array(controlsConfig, validatorOrOpts, asyncValidator) {
        const controls = controlsConfig.map(c => this._createControl(c));
        return new FormArray(controls, validatorOrOpts, asyncValidator);
    }
    /** @internal */
    _reduceControls(controlsConfig) {
        const controls = {};
        Object.keys(controlsConfig).forEach(controlName => {
            controls[controlName] = this._createControl(controlsConfig[controlName]);
        });
        return controls;
    }
    /** @internal */
    _createControl(controlConfig) {
        if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
            controlConfig instanceof FormArray) {
            return controlConfig;
        }
        else if (Array.isArray(controlConfig)) {
            const value = controlConfig[0];
            const validator = controlConfig.length > 1 ? controlConfig[1] : null;
            const asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else {
            return this.control(controlConfig);
        }
    }
}
FormBuilder.ɵfac = function FormBuilder_Factory(t) { return new (t || FormBuilder)(); };
FormBuilder.ɵprov = ɵɵdefineInjectable({ token: FormBuilder, factory: FormBuilder.ɵfac });
/*@__PURE__*/ (function () { ɵsetClassMetadata(FormBuilder, [{
        type: Injectable
    }], null, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @publicApi
 */
const VERSION = new Version('10.0.0-rc.0+315.sha-a5c3073');

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Overview](/guide/forms-overview)
 * @see [Template-driven Forms Guide](/guide/forms)
 *
 * @publicApi
 */
class FormsModule {
}
FormsModule.ɵmod = ɵɵdefineNgModule({ type: FormsModule });
FormsModule.ɵinj = ɵɵdefineInjector({ factory: function FormsModule_Factory(t) { return new (t || FormsModule)(); }, providers: [RadioControlRegistry], imports: [ɵInternalFormsSharedModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(FormsModule, { declarations: [NgModel, NgModelGroup, NgForm], exports: [ɵInternalFormsSharedModule, NgModel, NgModelGroup, NgForm] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(FormsModule, [{
        type: NgModule,
        args: [{
                declarations: TEMPLATE_DRIVEN_DIRECTIVES,
                providers: [RadioControlRegistry],
                exports: [ɵInternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
            }]
    }], null, null); })();
/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 *
 * @see [Forms Overview](guide/forms-overview)
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * @publicApi
 */
class ReactiveFormsModule {
    /**
     * @description
     * Provides options for configuring the reactive forms module.
     *
     * @param opts An object of configuration options
     * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
     * binding is used with reactive form directives.
     */
    static withConfig(opts) {
        return {
            ngModule: ReactiveFormsModule,
            providers: [
                { provide: NG_MODEL_WITH_FORM_CONTROL_WARNING, useValue: opts.warnOnNgModelWithFormControl }
            ]
        };
    }
}
ReactiveFormsModule.ɵmod = ɵɵdefineNgModule({ type: ReactiveFormsModule });
ReactiveFormsModule.ɵinj = ɵɵdefineInjector({ factory: function ReactiveFormsModule_Factory(t) { return new (t || ReactiveFormsModule)(); }, providers: [FormBuilder, RadioControlRegistry], imports: [ɵInternalFormsSharedModule] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && ɵɵsetNgModuleScope(ReactiveFormsModule, { declarations: [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName], exports: [ɵInternalFormsSharedModule, FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName] }); })();
/*@__PURE__*/ (function () { ɵsetClassMetadata(ReactiveFormsModule, [{
        type: NgModule,
        args: [{
                declarations: [REACTIVE_DRIVEN_DIRECTIVES],
                providers: [FormBuilder, RadioControlRegistry],
                exports: [ɵInternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
            }]
    }], null, null); })();

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// This file only reexports content of the `src` folder. Keep it that way.

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { AbstractControl, AbstractControlDirective, AbstractFormGroupDirective, COMPOSITION_BUFFER_MODE, CheckboxControlValueAccessor, CheckboxRequiredValidator, ControlContainer, DefaultValueAccessor, EmailValidator, FormArray, FormArrayName, FormBuilder, FormControl, FormControlDirective, FormControlName, FormGroup, FormGroupDirective, FormGroupName, FormsModule, MaxLengthValidator, MinLengthValidator, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, NgControlStatus, NgControlStatusGroup, NgForm, NgModel, NgModelGroup, NgSelectOption, NumberValueAccessor, PatternValidator, RadioControlValueAccessor, RangeValueAccessor, ReactiveFormsModule, RequiredValidator, SelectControlValueAccessor, SelectMultipleControlValueAccessor, VERSION, Validators, ɵInternalFormsSharedModule, ɵNgNoValidate, ɵNgSelectMultipleOption };
//# sourceMappingURL=forms.js.map
