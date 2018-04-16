/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup } from './model';
/**
 * \@description
 *
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * This is essentially syntactic sugar that shortens the `new FormGroup()`,
 * `new FormControl()`, and `new FormArray()` boilerplate that can build up in larger
 * forms.
 *
 * To use, inject `FormBuilder` into your component class. You can then call its methods
 * directly.
 *
 * {\@example forms/ts/formBuilder/form_builder_example.ts region='Component'}
 *
 *  * **npm package**: `\@angular/forms`
 *
 *  * **NgModule**: `ReactiveFormsModule`
 *
 *
 */
export class FormBuilder {
    /**
     * Construct a new `FormGroup` with the given map of configuration.
     * Valid keys for the `extra` parameter map are `validator` and `asyncValidator`.
     *
     * See the `FormGroup` constructor for more details.
     * @param {?} controlsConfig
     * @param {?=} extra
     * @return {?}
     */
    group(controlsConfig, extra = null) {
        const /** @type {?} */ controls = this._reduceControls(controlsConfig);
        const /** @type {?} */ validator = extra != null ? extra['validator'] : null;
        const /** @type {?} */ asyncValidator = extra != null ? extra['asyncValidator'] : null;
        return new FormGroup(controls, validator, asyncValidator);
    }
    /**
     * Construct a new `FormControl` with the given `formState`,`validator`, and
     * `asyncValidator`.
     *
     * `formState` can either be a standalone value for the form control or an object
     * that contains both a value and a disabled status.
     *
     * @param {?} formState
     * @param {?=} validator
     * @param {?=} asyncValidator
     * @return {?}
     */
    control(formState, validator, asyncValidator) {
        return new FormControl(formState, validator, asyncValidator);
    }
    /**
     * Construct a `FormArray` from the given `controlsConfig` array of
     * configuration, with the given optional `validator` and `asyncValidator`.
     * @param {?} controlsConfig
     * @param {?=} validator
     * @param {?=} asyncValidator
     * @return {?}
     */
    array(controlsConfig, validator, asyncValidator) {
        const /** @type {?} */ controls = controlsConfig.map(c => this._createControl(c));
        return new FormArray(controls, validator, asyncValidator);
    }
    /**
     * \@internal
     * @param {?} controlsConfig
     * @return {?}
     */
    _reduceControls(controlsConfig) {
        const /** @type {?} */ controls = {};
        Object.keys(controlsConfig).forEach(controlName => {
            controls[controlName] = this._createControl(controlsConfig[controlName]);
        });
        return controls;
    }
    /**
     * \@internal
     * @param {?} controlConfig
     * @return {?}
     */
    _createControl(controlConfig) {
        if (controlConfig instanceof FormControl || controlConfig instanceof FormGroup ||
            controlConfig instanceof FormArray) {
            return controlConfig;
        }
        else if (Array.isArray(controlConfig)) {
            const /** @type {?} */ value = controlConfig[0];
            const /** @type {?} */ validator = controlConfig.length > 1 ? controlConfig[1] : null;
            const /** @type {?} */ asyncValidator = controlConfig.length > 2 ? controlConfig[2] : null;
            return this.control(value, validator, asyncValidator);
        }
        else {
            return this.control(controlConfig);
        }
    }
}
FormBuilder.decorators = [
    { type: Injectable },
];
/** @nocollapse */
FormBuilder.ctorParameters = () => [];
function FormBuilder_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    FormBuilder.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    FormBuilder.ctorParameters;
}
//# sourceMappingURL=form_builder.js.map