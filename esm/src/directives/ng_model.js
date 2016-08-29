/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Host, Inject, Input, Optional, Output, Self, forwardRef } from '@angular/core';
import { EventEmitter } from '../facade/async';
import { FormControl } from '../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { AbstractFormGroupDirective } from './abstract_form_group_directive';
import { ControlContainer } from './control_container';
import { NG_VALUE_ACCESSOR } from './control_value_accessor';
import { NgControl } from './ng_control';
import { NgForm } from './ng_form';
import { NgModelGroup } from './ng_model_group';
import { composeAsyncValidators, composeValidators, controlPath, isPropertyUpdated, selectValueAccessor, setUpControl } from './shared';
import { TemplateDrivenErrors } from './template_driven_errors';
export const formControlBinding = {
    provide: NgControl,
    useExisting: forwardRef(() => NgModel)
};
const resolvedPromise = Promise.resolve(null);
export class NgModel extends NgControl {
    constructor(_parent, validators, asyncValidators, valueAccessors) {
        super();
        this._parent = _parent;
        /** @internal */
        this._control = new FormControl();
        /** @internal */
        this._registered = false;
        this.update = new EventEmitter();
        this._rawValidators = validators || [];
        this._rawAsyncValidators = asyncValidators || [];
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
    }
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
    ngOnDestroy() { this.formDirective && this.formDirective.removeControl(this); }
    get control() { return this._control; }
    get path() {
        return this._parent ? controlPath(this.name, this._parent) : [this.name];
    }
    get formDirective() { return this._parent ? this._parent.formDirective : null; }
    get validator() { return composeValidators(this._rawValidators); }
    get asyncValidator() {
        return composeAsyncValidators(this._rawAsyncValidators);
    }
    viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    }
    _setUpControl() {
        this._isStandalone() ? this._setUpStandalone() :
            this.formDirective.addControl(this);
        this._registered = true;
    }
    _isStandalone() {
        return !this._parent || (this.options && this.options.standalone);
    }
    _setUpStandalone() {
        setUpControl(this._control, this);
        this._control.updateValueAndValidity({ emitEvent: false });
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
        resolvedPromise.then(() => { this.control.setValue(value, { emitViewToModelChange: false }); });
    }
    _updateDisabled(changes) {
        const disabledValue = changes['isDisabled'].currentValue;
        const isDisabled = disabledValue != null && disabledValue != false;
        resolvedPromise.then(() => {
            if (isDisabled && !this.control.disabled) {
                this.control.disable();
            }
            else if (!isDisabled && this.control.disabled) {
                this.control.enable();
            }
        });
    }
}
/** @nocollapse */
NgModel.decorators = [
    { type: Directive, args: [{
                selector: '[ngModel]:not([formControlName]):not([formControl])',
                providers: [formControlBinding],
                exportAs: 'ngModel'
            },] },
];
/** @nocollapse */
NgModel.ctorParameters = [
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALUE_ACCESSOR,] },] },
];
/** @nocollapse */
NgModel.propDecorators = {
    'name': [{ type: Input },],
    'isDisabled': [{ type: Input, args: ['disabled',] },],
    'model': [{ type: Input, args: ['ngModel',] },],
    'options': [{ type: Input, args: ['ngModelOptions',] },],
    'update': [{ type: Output, args: ['ngModelChange',] },],
};
//# sourceMappingURL=ng_model.js.map