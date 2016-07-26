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
import { AbstractFormGroupDirective } from '../abstract_form_group_directive';
import { ControlContainer } from '../control_container';
import { FormGroupDirective } from './form_group_directive';
export const formGroupNameProvider = 
/*@ts2dart_const*/ /* @ts2dart_Provider */ {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupName)
};
export class FormGroupName extends AbstractFormGroupDirective {
    constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._validators = validators;
        this._asyncValidators = asyncValidators;
    }
    /** @internal */
    _checkParentType() {
        if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective)) {
            this._throwParentException();
        }
    }
    _throwParentException() {
        throw new BaseException(`formGroupName must be used with a parent formGroup directive.
                You'll want to add a formGroup directive and pass it an existing FormGroup instance
                (you can create one in your class).

                Example:
                <div [formGroup]="myGroup">
                  <div formGroupName="person">
                    <input formControlName="firstName">
                  </div>
                </div>

                In your class:
                this.myGroup = new FormGroup({
                  person: new FormGroup({ firstName: new FormControl() })
                });`);
    }
}
/** @nocollapse */
FormGroupName.decorators = [
    { type: Directive, args: [{ selector: '[formGroupName]', providers: [formGroupNameProvider] },] },
];
/** @nocollapse */
FormGroupName.ctorParameters = [
    { type: ControlContainer, decorators: [{ type: Optional }, { type: Host }, { type: SkipSelf },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] },] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] },] },
];
/** @nocollapse */
FormGroupName.propDecorators = {
    'name': [{ type: Input, args: ['formGroupName',] },],
};
//# sourceMappingURL=form_group_name.js.map