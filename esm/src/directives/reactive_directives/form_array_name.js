/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Host, Inject, Input, Optional, Self, SkipSelf, forwardRef } from '@angular/core';
import { BaseException } from '../../facade/exceptions';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { ControlContainer } from '../control_container';
import { composeAsyncValidators, composeValidators, controlPath } from '../shared';
import { FormGroupDirective } from './form_group_directive';
import { FormGroupName } from './form_group_name';
export const formArrayNameProvider = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormArrayName)
};
export class FormArrayName extends ControlContainer {
    constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    ngOnInit() {
        this._checkParentType();
        this.formDirective.addFormArray(this);
    }
    ngOnDestroy() { this.formDirective.removeFormArray(this); }
    get control() { return this.formDirective.getFormArray(this); }
    get formDirective() { return this._parent.formDirective; }
    get path() { return controlPath(this.name, this._parent); }
    get validator() { return composeValidators(this._validators); }
    get asyncValidator() { return composeAsyncValidators(this._asyncValidators); }
    _checkParentType() {
        if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective)) {
            this._throwParentException();
        }
    }
    _throwParentException() {
        throw new BaseException(`formArrayName must be used with a parent formGroup directive.
                You'll want to add a formGroup directive and pass it an existing FormGroup instance
                (you can create one in your class).

                Example:
                <div [formGroup]="myGroup">
                  <div formArrayName="cities">
                    <div *ngFor="let city of cityArray.controls; let i=index">
                      <input [formControlName]="i">
                    </div>
                  </div>
                </div>

                In your class:
                this.cityArray = new FormArray([new FormControl('SF')]);
                this.myGroup = new FormGroup({
                  cities: this.cityArray
                });`);
    }
}
/** @nocollapse */
FormArrayName.decorators = [
    { type: Directive, args: [{ selector: '[formArrayName]', providers: [formArrayNameProvider] },] },
];
/** @nocollapse */
FormArrayName.ctorParameters = [
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] },] },
];
/** @nocollapse */
FormArrayName.propDecorators = {
    'name': [{ type: Input, args: ['formArrayName',] },],
};
//# sourceMappingURL=form_array_name.js.map