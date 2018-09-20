/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { Directive, EventEmitter, Host, Inject, Input, Optional, Output, Self, SkipSelf, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { AbstractFormGroupDirective } from '../abstract_form_group_directive';
import { ControlContainer } from '../control_container';
import { NG_VALUE_ACCESSOR } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { ReactiveErrors } from '../reactive_errors';
import { _ngModelWarning, composeAsyncValidators, composeValidators, controlPath, isPropertyUpdated, selectValueAccessor } from '../shared';
import { NG_MODEL_WITH_FORM_CONTROL_WARNING } from './form_control_directive';
import { FormGroupDirective } from './form_group_directive';
import { FormArrayName, FormGroupName } from './form_group_name';
export var controlNameBinding = {
    provide: NgControl,
    useExisting: forwardRef(function () { return FormControlName; })
};
/**
 * @description
 *
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * This directive ensures that any values written to the `FormControl`
 * instance programmatically will be written to the DOM element (model -> view). Conversely,
 * any values written to the DOM element through user input will be reflected in the
 * `FormControl` instance (view -> model).
 *
 * This directive is designed to be used with a parent `FormGroupDirective` (selector:
 * `[formGroup]`).
 *
 * It accepts the string name of the `FormControl` instance you want to
 * link, and will look for a `FormControl` registered with that name in the
 * closest `FormGroup` or `FormArray` above it.
 *
 * **Access the control**: You can access the `FormControl` associated with
 * this directive by using the {@link AbstractControl#get get} method.
 * Ex: `this.form.get('first');`
 *
 * **Get value**: the `value` property is always synced and available on the `FormControl`.
 * See a full list of available properties in `AbstractControl`.
 *
 *  **Set value**: You can set an initial value for the control when instantiating the
 *  `FormControl`, or you can set it programmatically later using
 *  {@link AbstractControl#setValue setValue} or {@link AbstractControl#patchValue patchValue}.
 *
 * **Listen to value**: If you want to listen to changes in the value of the control, you can
 * subscribe to the {@link AbstractControl#valueChanges valueChanges} event.  You can also listen to
 * {@link AbstractControl#statusChanges statusChanges} to be notified when the validation status is
 * re-calculated.
 *
 * ### Example
 *
 * In this example, we create form controls for first name and last name.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * To see `formControlName` examples with different form control types, see:
 *
 * * Radio buttons: `RadioControlValueAccessor`
 * * Selects: `SelectControlValueAccessor`
 *
 * ### Use with ngModel
 *
 * Support for using the `ngModel` input property and `ngModelChange` event with reactive
 * form directives has been deprecated in Angular v6 and will be removed in Angular v7.
 *
 * Now deprecated:
 * ```html
 * <form [formGroup]="form">
 *   <input formControlName="first" [(ngModel)]="value">
 * </form>
 * ```
 *
 * ```ts
 * this.value = 'some value';
 * ```
 *
 * This has been deprecated for a few reasons. First, developers have found this pattern
 * confusing. It seems like the actual `ngModel` directive is being used, but in fact it's
 * an input/output property named `ngModel` on the reactive form directive that simply
 * approximates (some of) its behavior. Specifically, it allows getting/setting the value
 * and intercepting value events. However, some of `ngModel`'s other features - like
 * delaying updates with`ngModelOptions` or exporting the directive - simply don't work,
 * which has understandably caused some confusion.
 *
 * In addition, this pattern mixes template-driven and reactive forms strategies, which
 * we generally don't recommend because it doesn't take advantage of the full benefits of
 * either strategy. Setting the value in the template violates the template-agnostic
 * principles behind reactive forms, whereas adding a `FormControl`/`FormGroup` layer in
 * the class removes the convenience of defining forms in the template.
 *
 * To update your code before v7, you'll want to decide whether to stick with reactive form
 * directives (and get/set values using reactive forms patterns) or switch over to
 * template-driven directives.
 *
 * After (choice 1 - use reactive forms):
 *
 * ```html
 * <form [formGroup]="form">
 *   <input formControlName="first">
 * </form>
 * ```
 *
 * ```ts
 * this.form.get('first').setValue('some value');
 * ```
 *
 * After (choice 2 - use template-driven forms):
 *
 * ```html
 * <input [(ngModel)]="value">
 * ```
 *
 * ```ts
 * this.value = 'some value';
 * ```
 *
 * By default, when you use this pattern, you will see a deprecation warning once in dev
 * mode. You can choose to silence this warning by providing a config for
 * `ReactiveFormsModule` at import time:
 *
 * ```ts
 * imports: [
 *   ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'});
 * ]
 * ```
 *
 * Alternatively, you can choose to surface a separate warning for each instance of this
 * pattern with a config value of `"always"`. This may help to track down where in the code
 * the pattern is being used as the code is being updated.
 *
 * @ngModule ReactiveFormsModule
 */
var FormControlName = /** @class */ (function (_super) {
    tslib_1.__extends(FormControlName, _super);
    function FormControlName(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        var _this = _super.call(this) || this;
        _this._ngModelWarningConfig = _ngModelWarningConfig;
        _this._added = false;
        /** @deprecated as of v6 */
        _this.update = new EventEmitter();
        /**
         * Instance property used to track whether an ngModel warning has been sent out for this
         * particular FormControlName instance. Used to support warning config of "always".
         *
         * @internal
         */
        _this._ngModelWarningSent = false;
        _this._parent = parent;
        _this._rawValidators = validators || [];
        _this._rawAsyncValidators = asyncValidators || [];
        _this.valueAccessor = selectValueAccessor(_this, valueAccessors);
        return _this;
    }
    FormControlName_1 = FormControlName;
    Object.defineProperty(FormControlName.prototype, "isDisabled", {
        set: function (isDisabled) { ReactiveErrors.disabledAttrWarning(); },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype.ngOnChanges = function (changes) {
        if (!this._added)
            this._setUpControl();
        if (isPropertyUpdated(changes, this.viewModel)) {
            _ngModelWarning('formControlName', FormControlName_1, this, this._ngModelWarningConfig);
            this.viewModel = this.model;
            this.formDirective.updateModel(this, this.model);
        }
    };
    FormControlName.prototype.ngOnDestroy = function () {
        if (this.formDirective) {
            this.formDirective.removeControl(this);
        }
    };
    FormControlName.prototype.viewToModelUpdate = function (newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
    };
    Object.defineProperty(FormControlName.prototype, "path", {
        get: function () { return controlPath(this.name, this._parent); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "formDirective", {
        get: function () { return this._parent ? this._parent.formDirective : null; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "validator", {
        get: function () { return composeValidators(this._rawValidators); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormControlName.prototype, "asyncValidator", {
        get: function () {
            return composeAsyncValidators(this._rawAsyncValidators);
        },
        enumerable: true,
        configurable: true
    });
    FormControlName.prototype._checkParentType = function () {
        if (!(this._parent instanceof FormGroupName) &&
            this._parent instanceof AbstractFormGroupDirective) {
            ReactiveErrors.ngModelGroupException();
        }
        else if (!(this._parent instanceof FormGroupName) && !(this._parent instanceof FormGroupDirective) &&
            !(this._parent instanceof FormArrayName)) {
            ReactiveErrors.controlParentException();
        }
    };
    FormControlName.prototype._setUpControl = function () {
        this._checkParentType();
        this.control = this.formDirective.addControl(this);
        if (this.control.disabled && this.valueAccessor.setDisabledState) {
            this.valueAccessor.setDisabledState(true);
        }
        this._added = true;
    };
    var FormControlName_1;
    /**
     * Static property used to track whether any ngModel warnings have been sent across
     * all instances of FormControlName. Used to support warning config of "once".
     *
     * @internal
     */
    FormControlName._ngModelWarningSentOnce = false;
    tslib_1.__decorate([
        Input('formControlName'),
        tslib_1.__metadata("design:type", String)
    ], FormControlName.prototype, "name", void 0);
    tslib_1.__decorate([
        Input('disabled'),
        tslib_1.__metadata("design:type", Boolean),
        tslib_1.__metadata("design:paramtypes", [Boolean])
    ], FormControlName.prototype, "isDisabled", null);
    tslib_1.__decorate([
        Input('ngModel'),
        tslib_1.__metadata("design:type", Object)
    ], FormControlName.prototype, "model", void 0);
    tslib_1.__decorate([
        Output('ngModelChange'),
        tslib_1.__metadata("design:type", Object)
    ], FormControlName.prototype, "update", void 0);
    FormControlName = FormControlName_1 = tslib_1.__decorate([
        Directive({ selector: '[formControlName]', providers: [controlNameBinding] }),
        tslib_1.__param(0, Optional()), tslib_1.__param(0, Host()), tslib_1.__param(0, SkipSelf()),
        tslib_1.__param(1, Optional()), tslib_1.__param(1, Self()), tslib_1.__param(1, Inject(NG_VALIDATORS)),
        tslib_1.__param(2, Optional()), tslib_1.__param(2, Self()), tslib_1.__param(2, Inject(NG_ASYNC_VALIDATORS)),
        tslib_1.__param(3, Optional()), tslib_1.__param(3, Self()), tslib_1.__param(3, Inject(NG_VALUE_ACCESSOR)),
        tslib_1.__param(4, Optional()), tslib_1.__param(4, Inject(NG_MODEL_WITH_FORM_CONTROL_WARNING)),
        tslib_1.__metadata("design:paramtypes", [ControlContainer,
            Array,
            Array, Array, Object])
    ], FormControlName);
    return FormControlName;
}(NgControl));
export { FormControlName };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9jb250cm9sX25hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBd0IsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQWlCLFFBQVEsRUFBRSxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHOUosT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUcxSSxPQUFPLEVBQUMsa0NBQWtDLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUM1RSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUMxRCxPQUFPLEVBQUMsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRS9ELE1BQU0sQ0FBQyxJQUFNLGtCQUFrQixHQUFRO0lB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QUFDLEVBQUMsQ0FBQztRQXVDckUsbUJBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxtQkFBQSxJQUFJLEVBQUUsQ0FBQSxFQUFFLG1CQUFBLFFBQVEsRUFBRSxDQUFBO1FBQzlCLG1CQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsbUJBQUEsSUFBSSxFQUFFLENBQUEsRUFBRSxtQkFBQSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDekMsbUJBQUEsUUFBUSxFQUFFLENBQUEsRUFBRSxtQkFBQSxJQUFJLEVBQUUsQ0FBQSxFQUFFLG1CQUFBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBRS9DLG1CQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsbUJBQUEsSUFBSSxFQUFFLENBQUEsRUFBRSxtQkFBQSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtRQUM3QyxtQkFBQSxRQUFRLEVBQUUsQ0FBQSxFQUFFLG1CQUFBLE1BQU0sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO2lEQUxmLGdCQUFnQjtZQUNELEtBQUs7WUFFeEQsS0FBSztPQXpDRixlQUFlLENBcUczQjtJQUFELHNCQUFDO0NBQUEsQUFyR0QsQ0FBcUMsU0FBUyxHQXFHN0M7U0FyR1ksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSG9zdCwgSW5qZWN0LCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9wdGlvbmFsLCBPdXRwdXQsIFNlbGYsIFNpbXBsZUNoYW5nZXMsIFNraXBTZWxmLCBmb3J3YXJkUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtQ29udHJvbH0gZnJvbSAnLi4vLi4vbW9kZWwnO1xuaW1wb3J0IHtOR19BU1lOQ19WQUxJREFUT1JTLCBOR19WQUxJREFUT1JTfSBmcm9tICcuLi8uLi92YWxpZGF0b3JzJztcbmltcG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4uL2Fic3RyYWN0X2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJy4uL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4uL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtSZWFjdGl2ZUVycm9yc30gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7X25nTW9kZWxXYXJuaW5nLCBjb21wb3NlQXN5bmNWYWxpZGF0b3JzLCBjb21wb3NlVmFsaWRhdG9ycywgY29udHJvbFBhdGgsIGlzUHJvcGVydHlVcGRhdGVkLCBzZWxlY3RWYWx1ZUFjY2Vzc29yfSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7TkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklOR30gZnJvbSAnLi9mb3JtX2NvbnRyb2xfZGlyZWN0aXZlJztcbmltcG9ydCB7Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9mb3JtX2dyb3VwX25hbWUnO1xuXG5leHBvcnQgY29uc3QgY29udHJvbE5hbWVCaW5kaW5nOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5nQ29udHJvbCxcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUNvbnRyb2xOYW1lKVxufTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBTeW5jcyBhIGBGb3JtQ29udHJvbGAgaW4gYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgdG8gYSBmb3JtIGNvbnRyb2xcbiAqIGVsZW1lbnQgYnkgbmFtZS5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBlbnN1cmVzIHRoYXQgYW55IHZhbHVlcyB3cml0dGVuIHRvIHRoZSBgRm9ybUNvbnRyb2xgXG4gKiBpbnN0YW5jZSBwcm9ncmFtbWF0aWNhbGx5IHdpbGwgYmUgd3JpdHRlbiB0byB0aGUgRE9NIGVsZW1lbnQgKG1vZGVsIC0+IHZpZXcpLiBDb252ZXJzZWx5LFxuICogYW55IHZhbHVlcyB3cml0dGVuIHRvIHRoZSBET00gZWxlbWVudCB0aHJvdWdoIHVzZXIgaW5wdXQgd2lsbCBiZSByZWZsZWN0ZWQgaW4gdGhlXG4gKiBgRm9ybUNvbnRyb2xgIGluc3RhbmNlICh2aWV3IC0+IG1vZGVsKS5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBpcyBkZXNpZ25lZCB0byBiZSB1c2VkIHdpdGggYSBwYXJlbnQgYEZvcm1Hcm91cERpcmVjdGl2ZWAgKHNlbGVjdG9yOlxuICogYFtmb3JtR3JvdXBdYCkuXG4gKlxuICogSXQgYWNjZXB0cyB0aGUgc3RyaW5nIG5hbWUgb2YgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgeW91IHdhbnQgdG9cbiAqIGxpbmssIGFuZCB3aWxsIGxvb2sgZm9yIGEgYEZvcm1Db250cm9sYCByZWdpc3RlcmVkIHdpdGggdGhhdCBuYW1lIGluIHRoZVxuICogY2xvc2VzdCBgRm9ybUdyb3VwYCBvciBgRm9ybUFycmF5YCBhYm92ZSBpdC5cbiAqXG4gKiAqKkFjY2VzcyB0aGUgY29udHJvbCoqOiBZb3UgY2FuIGFjY2VzcyB0aGUgYEZvcm1Db250cm9sYCBhc3NvY2lhdGVkIHdpdGhcbiAqIHRoaXMgZGlyZWN0aXZlIGJ5IHVzaW5nIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI2dldCBnZXR9IG1ldGhvZC5cbiAqIEV4OiBgdGhpcy5mb3JtLmdldCgnZmlyc3QnKTtgXG4gKlxuICogKipHZXQgdmFsdWUqKjogdGhlIGB2YWx1ZWAgcHJvcGVydHkgaXMgYWx3YXlzIHN5bmNlZCBhbmQgYXZhaWxhYmxlIG9uIHRoZSBgRm9ybUNvbnRyb2xgLlxuICogU2VlIGEgZnVsbCBsaXN0IG9mIGF2YWlsYWJsZSBwcm9wZXJ0aWVzIGluIGBBYnN0cmFjdENvbnRyb2xgLlxuICpcbiAqICAqKlNldCB2YWx1ZSoqOiBZb3UgY2FuIHNldCBhbiBpbml0aWFsIHZhbHVlIGZvciB0aGUgY29udHJvbCB3aGVuIGluc3RhbnRpYXRpbmcgdGhlXG4gKiAgYEZvcm1Db250cm9sYCwgb3IgeW91IGNhbiBzZXQgaXQgcHJvZ3JhbW1hdGljYWxseSBsYXRlciB1c2luZ1xuICogIHtAbGluayBBYnN0cmFjdENvbnRyb2wjc2V0VmFsdWUgc2V0VmFsdWV9IG9yIHtAbGluayBBYnN0cmFjdENvbnRyb2wjcGF0Y2hWYWx1ZSBwYXRjaFZhbHVlfS5cbiAqXG4gKiAqKkxpc3RlbiB0byB2YWx1ZSoqOiBJZiB5b3Ugd2FudCB0byBsaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgdmFsdWUgb2YgdGhlIGNvbnRyb2wsIHlvdSBjYW5cbiAqIHN1YnNjcmliZSB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN2YWx1ZUNoYW5nZXMgdmFsdWVDaGFuZ2VzfSBldmVudC4gIFlvdSBjYW4gYWxzbyBsaXN0ZW4gdG9cbiAqIHtAbGluayBBYnN0cmFjdENvbnRyb2wjc3RhdHVzQ2hhbmdlcyBzdGF0dXNDaGFuZ2VzfSB0byBiZSBub3RpZmllZCB3aGVuIHRoZSB2YWxpZGF0aW9uIHN0YXR1cyBpc1xuICogcmUtY2FsY3VsYXRlZC5cbiAqXG4gKiAjIyMgRXhhbXBsZVxuICpcbiAqIEluIHRoaXMgZXhhbXBsZSwgd2UgY3JlYXRlIGZvcm0gY29udHJvbHMgZm9yIGZpcnN0IG5hbWUgYW5kIGxhc3QgbmFtZS5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybUdyb3VwL3NpbXBsZV9mb3JtX2dyb3VwX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqIFRvIHNlZSBgZm9ybUNvbnRyb2xOYW1lYCBleGFtcGxlcyB3aXRoIGRpZmZlcmVudCBmb3JtIGNvbnRyb2wgdHlwZXMsIHNlZTpcbiAqXG4gKiAqIFJhZGlvIGJ1dHRvbnM6IGBSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yYFxuICogKiBTZWxlY3RzOiBgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3JgXG4gKlxuICogIyMjIFVzZSB3aXRoIG5nTW9kZWxcbiAqXG4gKiBTdXBwb3J0IGZvciB1c2luZyB0aGUgYG5nTW9kZWxgIGlucHV0IHByb3BlcnR5IGFuZCBgbmdNb2RlbENoYW5nZWAgZXZlbnQgd2l0aCByZWFjdGl2ZVxuICogZm9ybSBkaXJlY3RpdmVzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgd2lsbCBiZSByZW1vdmVkIGluIEFuZ3VsYXIgdjcuXG4gKlxuICogTm93IGRlcHJlY2F0ZWQ6XG4gKiBgYGBodG1sXG4gKiA8Zm9ybSBbZm9ybUdyb3VwXT1cImZvcm1cIj5cbiAqICAgPGlucHV0IGZvcm1Db250cm9sTmFtZT1cImZpcnN0XCIgWyhuZ01vZGVsKV09XCJ2YWx1ZVwiPlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogYGBgdHNcbiAqIHRoaXMudmFsdWUgPSAnc29tZSB2YWx1ZSc7XG4gKiBgYGBcbiAqXG4gKiBUaGlzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgZm9yIGEgZmV3IHJlYXNvbnMuIEZpcnN0LCBkZXZlbG9wZXJzIGhhdmUgZm91bmQgdGhpcyBwYXR0ZXJuXG4gKiBjb25mdXNpbmcuIEl0IHNlZW1zIGxpa2UgdGhlIGFjdHVhbCBgbmdNb2RlbGAgZGlyZWN0aXZlIGlzIGJlaW5nIHVzZWQsIGJ1dCBpbiBmYWN0IGl0J3NcbiAqIGFuIGlucHV0L291dHB1dCBwcm9wZXJ0eSBuYW1lZCBgbmdNb2RlbGAgb24gdGhlIHJlYWN0aXZlIGZvcm0gZGlyZWN0aXZlIHRoYXQgc2ltcGx5XG4gKiBhcHByb3hpbWF0ZXMgKHNvbWUgb2YpIGl0cyBiZWhhdmlvci4gU3BlY2lmaWNhbGx5LCBpdCBhbGxvd3MgZ2V0dGluZy9zZXR0aW5nIHRoZSB2YWx1ZVxuICogYW5kIGludGVyY2VwdGluZyB2YWx1ZSBldmVudHMuIEhvd2V2ZXIsIHNvbWUgb2YgYG5nTW9kZWxgJ3Mgb3RoZXIgZmVhdHVyZXMgLSBsaWtlXG4gKiBkZWxheWluZyB1cGRhdGVzIHdpdGhgbmdNb2RlbE9wdGlvbnNgIG9yIGV4cG9ydGluZyB0aGUgZGlyZWN0aXZlIC0gc2ltcGx5IGRvbid0IHdvcmssXG4gKiB3aGljaCBoYXMgdW5kZXJzdGFuZGFibHkgY2F1c2VkIHNvbWUgY29uZnVzaW9uLlxuICpcbiAqIEluIGFkZGl0aW9uLCB0aGlzIHBhdHRlcm4gbWl4ZXMgdGVtcGxhdGUtZHJpdmVuIGFuZCByZWFjdGl2ZSBmb3JtcyBzdHJhdGVnaWVzLCB3aGljaFxuICogd2UgZ2VuZXJhbGx5IGRvbid0IHJlY29tbWVuZCBiZWNhdXNlIGl0IGRvZXNuJ3QgdGFrZSBhZHZhbnRhZ2Ugb2YgdGhlIGZ1bGwgYmVuZWZpdHMgb2ZcbiAqIGVpdGhlciBzdHJhdGVneS4gU2V0dGluZyB0aGUgdmFsdWUgaW4gdGhlIHRlbXBsYXRlIHZpb2xhdGVzIHRoZSB0ZW1wbGF0ZS1hZ25vc3RpY1xuICogcHJpbmNpcGxlcyBiZWhpbmQgcmVhY3RpdmUgZm9ybXMsIHdoZXJlYXMgYWRkaW5nIGEgYEZvcm1Db250cm9sYC9gRm9ybUdyb3VwYCBsYXllciBpblxuICogdGhlIGNsYXNzIHJlbW92ZXMgdGhlIGNvbnZlbmllbmNlIG9mIGRlZmluaW5nIGZvcm1zIGluIHRoZSB0ZW1wbGF0ZS5cbiAqXG4gKiBUbyB1cGRhdGUgeW91ciBjb2RlIGJlZm9yZSB2NywgeW91J2xsIHdhbnQgdG8gZGVjaWRlIHdoZXRoZXIgdG8gc3RpY2sgd2l0aCByZWFjdGl2ZSBmb3JtXG4gKiBkaXJlY3RpdmVzIChhbmQgZ2V0L3NldCB2YWx1ZXMgdXNpbmcgcmVhY3RpdmUgZm9ybXMgcGF0dGVybnMpIG9yIHN3aXRjaCBvdmVyIHRvXG4gKiB0ZW1wbGF0ZS1kcml2ZW4gZGlyZWN0aXZlcy5cbiAqXG4gKiBBZnRlciAoY2hvaWNlIDEgLSB1c2UgcmVhY3RpdmUgZm9ybXMpOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtIFtmb3JtR3JvdXBdPVwiZm9ybVwiPlxuICogICA8aW5wdXQgZm9ybUNvbnRyb2xOYW1lPVwiZmlyc3RcIj5cbiAqIDwvZm9ybT5cbiAqIGBgYFxuICpcbiAqIGBgYHRzXG4gKiB0aGlzLmZvcm0uZ2V0KCdmaXJzdCcpLnNldFZhbHVlKCdzb21lIHZhbHVlJyk7XG4gKiBgYGBcbiAqXG4gKiBBZnRlciAoY2hvaWNlIDIgLSB1c2UgdGVtcGxhdGUtZHJpdmVuIGZvcm1zKTpcbiAqXG4gKiBgYGBodG1sXG4gKiA8aW5wdXQgWyhuZ01vZGVsKV09XCJ2YWx1ZVwiPlxuICogYGBgXG4gKlxuICogYGBgdHNcbiAqIHRoaXMudmFsdWUgPSAnc29tZSB2YWx1ZSc7XG4gKiBgYGBcbiAqXG4gKiBCeSBkZWZhdWx0LCB3aGVuIHlvdSB1c2UgdGhpcyBwYXR0ZXJuLCB5b3Ugd2lsbCBzZWUgYSBkZXByZWNhdGlvbiB3YXJuaW5nIG9uY2UgaW4gZGV2XG4gKiBtb2RlLiBZb3UgY2FuIGNob29zZSB0byBzaWxlbmNlIHRoaXMgd2FybmluZyBieSBwcm92aWRpbmcgYSBjb25maWcgZm9yXG4gKiBgUmVhY3RpdmVGb3Jtc01vZHVsZWAgYXQgaW1wb3J0IHRpbWU6XG4gKlxuICogYGBgdHNcbiAqIGltcG9ydHM6IFtcbiAqICAgUmVhY3RpdmVGb3Jtc01vZHVsZS53aXRoQ29uZmlnKHt3YXJuT25OZ01vZGVsV2l0aEZvcm1Db250cm9sOiAnbmV2ZXInfSk7XG4gKiBdXG4gKiBgYGBcbiAqXG4gKiBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGNob29zZSB0byBzdXJmYWNlIGEgc2VwYXJhdGUgd2FybmluZyBmb3IgZWFjaCBpbnN0YW5jZSBvZiB0aGlzXG4gKiBwYXR0ZXJuIHdpdGggYSBjb25maWcgdmFsdWUgb2YgYFwiYWx3YXlzXCJgLiBUaGlzIG1heSBoZWxwIHRvIHRyYWNrIGRvd24gd2hlcmUgaW4gdGhlIGNvZGVcbiAqIHRoZSBwYXR0ZXJuIGlzIGJlaW5nIHVzZWQgYXMgdGhlIGNvZGUgaXMgYmVpbmcgdXBkYXRlZC5cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tmb3JtQ29udHJvbE5hbWVdJywgcHJvdmlkZXJzOiBbY29udHJvbE5hbWVCaW5kaW5nXX0pXG5leHBvcnQgY2xhc3MgRm9ybUNvbnRyb2xOYW1lIGV4dGVuZHMgTmdDb250cm9sIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9hZGRlZCA9IGZhbHNlO1xuICAvKiogQGludGVybmFsICovXG4gIHZpZXdNb2RlbDogYW55O1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcmVhZG9ubHkgY29udHJvbCAhOiBGb3JtQ29udHJvbDtcblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgQElucHV0KCdmb3JtQ29udHJvbE5hbWUnKSBuYW1lICE6IHN0cmluZztcblxuICBASW5wdXQoJ2Rpc2FibGVkJylcbiAgc2V0IGlzRGlzYWJsZWQoaXNEaXNhYmxlZDogYm9vbGVhbikgeyBSZWFjdGl2ZUVycm9ycy5kaXNhYmxlZEF0dHJXYXJuaW5nKCk7IH1cblxuICAvLyBUT0RPKGthcmEpOiByZW1vdmUgbmV4dCA0IHByb3BlcnRpZXMgb25jZSBkZXByZWNhdGlvbiBwZXJpb2QgaXMgb3ZlclxuXG4gIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqL1xuICBASW5wdXQoJ25nTW9kZWwnKSBtb2RlbDogYW55O1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBhcyBvZiB2NiAqL1xuICBAT3V0cHV0KCduZ01vZGVsQ2hhbmdlJykgdXBkYXRlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgcHJvcGVydHkgdXNlZCB0byB0cmFjayB3aGV0aGVyIGFueSBuZ01vZGVsIHdhcm5pbmdzIGhhdmUgYmVlbiBzZW50IGFjcm9zc1xuICAgKiBhbGwgaW5zdGFuY2VzIG9mIEZvcm1Db250cm9sTmFtZS4gVXNlZCB0byBzdXBwb3J0IHdhcm5pbmcgY29uZmlnIG9mIFwib25jZVwiLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHN0YXRpYyBfbmdNb2RlbFdhcm5pbmdTZW50T25jZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBwcm9wZXJ0eSB1c2VkIHRvIHRyYWNrIHdoZXRoZXIgYW4gbmdNb2RlbCB3YXJuaW5nIGhhcyBiZWVuIHNlbnQgb3V0IGZvciB0aGlzXG4gICAqIHBhcnRpY3VsYXIgRm9ybUNvbnRyb2xOYW1lIGluc3RhbmNlLiBVc2VkIHRvIHN1cHBvcnQgd2FybmluZyBjb25maWcgb2YgXCJhbHdheXNcIi5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBfbmdNb2RlbFdhcm5pbmdTZW50ID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBASG9zdCgpIEBTa2lwU2VsZigpIHBhcmVudDogQ29udHJvbENvbnRhaW5lcixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiBBcnJheTxWYWxpZGF0b3J8VmFsaWRhdG9yRm4+LFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczpcbiAgICAgICAgICBBcnJheTxBc3luY1ZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvckZuPixcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxVRV9BQ0NFU1NPUikgdmFsdWVBY2Nlc3NvcnM6IENvbnRyb2xWYWx1ZUFjY2Vzc29yW10sXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkcpIHByaXZhdGUgX25nTW9kZWxXYXJuaW5nQ29uZmlnOiBzdHJpbmd8XG4gICAgICBudWxsKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgdGhpcy5fcmF3VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMgfHwgW107XG4gICAgdGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzID0gYXN5bmNWYWxpZGF0b3JzIHx8IFtdO1xuICAgIHRoaXMudmFsdWVBY2Nlc3NvciA9IHNlbGVjdFZhbHVlQWNjZXNzb3IodGhpcywgdmFsdWVBY2Nlc3NvcnMpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICghdGhpcy5fYWRkZWQpIHRoaXMuX3NldFVwQ29udHJvbCgpO1xuICAgIGlmIChpc1Byb3BlcnR5VXBkYXRlZChjaGFuZ2VzLCB0aGlzLnZpZXdNb2RlbCkpIHtcbiAgICAgIF9uZ01vZGVsV2FybmluZygnZm9ybUNvbnRyb2xOYW1lJywgRm9ybUNvbnRyb2xOYW1lLCB0aGlzLCB0aGlzLl9uZ01vZGVsV2FybmluZ0NvbmZpZyk7XG4gICAgICB0aGlzLnZpZXdNb2RlbCA9IHRoaXMubW9kZWw7XG4gICAgICB0aGlzLmZvcm1EaXJlY3RpdmUudXBkYXRlTW9kZWwodGhpcywgdGhpcy5tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9ybURpcmVjdGl2ZSkge1xuICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUNvbnRyb2wodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgdmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMudmlld01vZGVsID0gbmV3VmFsdWU7XG4gICAgdGhpcy51cGRhdGUuZW1pdChuZXdWYWx1ZSk7XG4gIH1cblxuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7IHJldHVybiBjb250cm9sUGF0aCh0aGlzLm5hbWUsIHRoaXMuX3BhcmVudCAhKTsgfVxuXG4gIGdldCBmb3JtRGlyZWN0aXZlKCk6IGFueSB7IHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7IH1cblxuICBnZXQgdmFsaWRhdG9yKCk6IFZhbGlkYXRvckZufG51bGwgeyByZXR1cm4gY29tcG9zZVZhbGlkYXRvcnModGhpcy5fcmF3VmFsaWRhdG9ycyk7IH1cblxuICBnZXQgYXN5bmNWYWxpZGF0b3IoKTogQXN5bmNWYWxpZGF0b3JGbiB7XG4gICAgcmV0dXJuIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnModGhpcy5fcmF3QXN5bmNWYWxpZGF0b3JzKSAhO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge1xuICAgIGlmICghKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmXG4gICAgICAgIHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5uZ01vZGVsR3JvdXBFeGNlcHRpb24oKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1Hcm91cE5hbWUpICYmICEodGhpcy5fcGFyZW50IGluc3RhbmNlb2YgRm9ybUdyb3VwRGlyZWN0aXZlKSAmJlxuICAgICAgICAhKHRoaXMuX3BhcmVudCBpbnN0YW5jZW9mIEZvcm1BcnJheU5hbWUpKSB7XG4gICAgICBSZWFjdGl2ZUVycm9ycy5jb250cm9sUGFyZW50RXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBDb250cm9sKCkge1xuICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgICh0aGlzIGFze2NvbnRyb2w6IEZvcm1Db250cm9sfSkuY29udHJvbCA9IHRoaXMuZm9ybURpcmVjdGl2ZS5hZGRDb250cm9sKHRoaXMpO1xuICAgIGlmICh0aGlzLmNvbnRyb2wuZGlzYWJsZWQgJiYgdGhpcy52YWx1ZUFjY2Vzc29yICEuc2V0RGlzYWJsZWRTdGF0ZSkge1xuICAgICAgdGhpcy52YWx1ZUFjY2Vzc29yICEuc2V0RGlzYWJsZWRTdGF0ZSAhKHRydWUpO1xuICAgIH1cbiAgICB0aGlzLl9hZGRlZCA9IHRydWU7XG4gIH1cbn1cbiJdfQ==