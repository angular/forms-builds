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
import { FormErrorExamples as Examples } from './error_examples';
var ReactiveErrors = /** @class */ (function () {
    function ReactiveErrors() {
    }
    /**
     * @return {?}
     */
    ReactiveErrors.controlParentException = /**
     * @return {?}
     */
    function () {
        throw new Error("formControlName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + Examples.formControlName);
    };
    /**
     * @return {?}
     */
    ReactiveErrors.ngModelGroupException = /**
     * @return {?}
     */
    function () {
        throw new Error("formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents\n       that also have a \"form\" prefix: formGroupName, formArrayName, or formGroup.\n\n       Option 1:  Update the parent to be formGroupName (reactive form strategy)\n\n        " + Examples.formGroupName + "\n\n        Option 2: Use ngModel instead of formControlName (template-driven strategy)\n\n        " + Examples.ngModelGroup);
    };
    /**
     * @return {?}
     */
    ReactiveErrors.missingFormException = /**
     * @return {?}
     */
    function () {
        throw new Error("formGroup expects a FormGroup instance. Please pass one in.\n\n       Example:\n\n       " + Examples.formControlName);
    };
    /**
     * @return {?}
     */
    ReactiveErrors.groupParentException = /**
     * @return {?}
     */
    function () {
        throw new Error("formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup\n      directive and pass it an existing FormGroup instance (you can create one in your class).\n\n      Example:\n\n      " + Examples.formGroupName);
    };
    /**
     * @return {?}
     */
    ReactiveErrors.arrayParentException = /**
     * @return {?}
     */
    function () {
        throw new Error("formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup\n       directive and pass it an existing FormGroup instance (you can create one in your class).\n\n        Example:\n\n        " + Examples.formArrayName);
    };
    /**
     * @return {?}
     */
    ReactiveErrors.disabledAttrWarning = /**
     * @return {?}
     */
    function () {
        console.warn("\n      It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true\n      when you set up this control in your component class, the disabled attribute will actually be set in the DOM for\n      you. We recommend using this approach to avoid 'changed after checked' errors.\n       \n      Example: \n      form = new FormGroup({\n        first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),\n        last: new FormControl('Drew', Validators.required)\n      });\n    ");
    };
    /**
     * @param {?} directiveName
     * @return {?}
     */
    ReactiveErrors.ngModelWarning = /**
     * @param {?} directiveName
     * @return {?}
     */
    function (directiveName) {
        console.warn("\n    It looks like you're using ngModel on the same form field as " + directiveName + ". \n    Support for using the ngModel input property and ngModelChange event with \n    reactive form directives has been deprecated in Angular v6 and will be removed \n    in Angular v7.\n    \n    For more information on this, see our API docs here:\n    https://angular.io/api/forms/" + (directiveName === 'formControl' ? 'FormControlDirective'
            : 'FormControlName') + "#use-with-ngmodel\n    ");
    };
    return ReactiveErrors;
}());
export { ReactiveErrors };
//# sourceMappingURL=reactive_errors.js.map