/**
 * @fileoverview added by tsickle
 * Generated from: packages/forms/src/directives/ng_form.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Self } from '@angular/core';
import { FormGroup } from '../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { ControlContainer } from './control_container';
import { composeAsyncValidators, composeValidators, removeDir, setUpControl, setUpFormContainer, syncPendingControls } from './shared';
import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef((/**
     * @return {?}
     */
    () => NgForm))
};
/** @type {?} */
const resolvedPromise = ((/**
 * @return {?}
 */
() => Promise.resolve(null)))();
/**
 * \@description
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
 * \@usageNotes
 *
 * ### Listening for form submission
 *
 * The following example shows how to capture the form values from the "ngSubmit" event.
 *
 * {\@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
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
 * \@ngModule FormsModule
 * \@publicApi
 */
export class NgForm extends ControlContainer {
    /**
     * @param {?} validators
     * @param {?} asyncValidators
     */
    constructor(validators, asyncValidators) {
        super();
        /**
         * \@description
         * Returns whether the form submission has been triggered.
         */
        this.submitted = false;
        this._directives = [];
        /**
         * \@description
         * Event emitter for the "ngSubmit" event
         */
        this.ngSubmit = new EventEmitter();
        this.form =
            new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
    }
    /**
     * \@description
     * Lifecycle method called after the view is initialized. For internal use only.
     * @return {?}
     */
    ngAfterViewInit() {
        this._setUpdateStrategy();
    }
    /**
     * \@description
     * The directive instance.
     * @return {?}
     */
    get formDirective() {
        return this;
    }
    /**
     * \@description
     * The internal `FormGroup` instance.
     * @return {?}
     */
    get control() {
        return this.form;
    }
    /**
     * \@description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it is always an empty array.
     * @return {?}
     */
    get path() {
        return [];
    }
    /**
     * \@description
     * Returns a map of the controls in this group.
     * @return {?}
     */
    get controls() {
        return this.form.controls;
    }
    /**
     * \@description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param {?} dir The `NgModel` directive instance.
     * @return {?}
     */
    addControl(dir) {
        resolvedPromise.then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            ((/** @type {?} */ (dir))).control =
                (/** @type {?} */ (container.registerControl(dir.name, dir.control)));
            setUpControl(dir.control, dir);
            dir.control.updateValueAndValidity({ emitEvent: false });
            this._directives.push(dir);
        }));
    }
    /**
     * \@description
     * Retrieves the `FormControl` instance from the provided `NgModel` directive.
     *
     * @param {?} dir The `NgModel` directive instance.
     * @return {?}
     */
    getControl(dir) {
        return (/** @type {?} */ (this.form.get(dir.path)));
    }
    /**
     * \@description
     * Removes the `NgModel` instance from the internal list of directives
     *
     * @param {?} dir The `NgModel` directive instance.
     * @return {?}
     */
    removeControl(dir) {
        resolvedPromise.then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
            removeDir(this._directives, dir);
        }));
    }
    /**
     * \@description
     * Adds a new `NgModelGroup` directive instance to the form.
     *
     * @param {?} dir The `NgModelGroup` directive instance.
     * @return {?}
     */
    addFormGroup(dir) {
        resolvedPromise.then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            /** @type {?} */
            const group = new FormGroup({});
            setUpFormContainer(group, dir);
            container.registerControl(dir.name, group);
            group.updateValueAndValidity({ emitEvent: false });
        }));
    }
    /**
     * \@description
     * Removes the `NgModelGroup` directive instance from the form.
     *
     * @param {?} dir The `NgModelGroup` directive instance.
     * @return {?}
     */
    removeFormGroup(dir) {
        resolvedPromise.then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
        }));
    }
    /**
     * \@description
     * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
     *
     * @param {?} dir The `NgModelGroup` directive instance.
     * @return {?}
     */
    getFormGroup(dir) {
        return (/** @type {?} */ (this.form.get(dir.path)));
    }
    /**
     * Sets the new value for the provided `NgControl` directive.
     *
     * @param {?} dir The `NgControl` directive instance.
     * @param {?} value The new value for the directive's control.
     * @return {?}
     */
    updateModel(dir, value) {
        resolvedPromise.then((/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const ctrl = (/** @type {?} */ (this.form.get((/** @type {?} */ (dir.path)))));
            ctrl.setValue(value);
        }));
    }
    /**
     * \@description
     * Sets the value for this `FormGroup`.
     *
     * @param {?} value The new value
     * @return {?}
     */
    setValue(value) {
        this.control.setValue(value);
    }
    /**
     * \@description
     * Method called when the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param {?} $event The "submit" event object
     * @return {?}
     */
    onSubmit($event) {
        ((/** @type {?} */ (this))).submitted = true;
        syncPendingControls(this.form, this._directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * \@description
     * Method called when the "reset" event is triggered on the form.
     * @return {?}
     */
    onReset() {
        this.resetForm();
    }
    /**
     * \@description
     * Resets the form to an initial value and resets its submitted status.
     *
     * @param {?=} value The new value for the form.
     * @return {?}
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        ((/** @type {?} */ (this))).submitted = false;
    }
    /**
     * @private
     * @return {?}
     */
    _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
            this.form._updateOn = this.options.updateOn;
        }
    }
    /**
     * \@internal
     * @param {?} path
     * @return {?}
     */
    _findContainer(path) {
        path.pop();
        return path.length ? (/** @type {?} */ (this.form.get(path))) : this.form;
    }
}
NgForm.decorators = [
    { type: Directive, args: [{
                selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
                providers: [formDirectiveProvider],
                host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                outputs: ['ngSubmit'],
                exportAs: 'ngForm'
            },] },
];
/** @nocollapse */
NgForm.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] }
];
NgForm.propDecorators = {
    options: [{ type: Input, args: ['ngFormOptions',] }]
};
/** @nocollapse */ NgForm.ɵfac = function NgForm_Factory(t) { return new (t || NgForm)(i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
/** @nocollapse */ NgForm.ɵdir = i0.ɵɵdefineDirective({ type: NgForm, selectors: [["form", 3, "ngNoForm", "", 3, "formGroup", ""], ["ng-form"], ["", "ngForm", ""]], hostBindings: function NgForm_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("submit", function NgForm_submit_HostBindingHandler($event) { return ctx.onSubmit($event); })("reset", function NgForm_reset_HostBindingHandler() { return ctx.onReset(); });
    } }, inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], features: [i0.ɵɵProvidersFeature([formDirectiveProvider]), i0.ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(NgForm, [{
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
if (false) {
    /**
     * \@description
     * Returns whether the form submission has been triggered.
     * @type {?}
     */
    NgForm.prototype.submitted;
    /**
     * @type {?}
     * @private
     */
    NgForm.prototype._directives;
    /**
     * \@description
     * The `FormGroup` instance created for this form.
     * @type {?}
     */
    NgForm.prototype.form;
    /**
     * \@description
     * Event emitter for the "ngSubmit" event
     * @type {?}
     */
    NgForm.prototype.ngSubmit;
    /**
     * \@description
     * Tracks options for the `NgForm` instance.
     *
     * **updateOn**: Sets the default `updateOn` value for all child `NgModels` below it
     * unless explicitly set by a child `NgModel` using `ngModelOptions`). Defaults to 'change'.
     * Possible values: `'change'` | `'blur'` | `'submit'`.
     *
     * @type {?}
     */
    NgForm.prototype.options;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFRQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVoSCxPQUFPLEVBQStCLFNBQVMsRUFBWSxNQUFNLFVBQVUsQ0FBQztBQUM1RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBS3JELE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDOzs7Ozs7Ozs7O0FBRXJJLE1BQU0sT0FBTyxxQkFBcUIsR0FBUTtJQUN4QyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFdBQVcsRUFBRSxVQUFVOzs7SUFBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUM7Q0FDdEM7O01BRUssZUFBZSxHQUFHOzs7QUFBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUV2RCxNQUFNLE9BQU8sTUFBTyxTQUFRLGdCQUFnQjs7Ozs7SUFpQzFDLFlBQytDLFVBQWlCLEVBQ1gsZUFBc0I7UUFDekUsS0FBSyxFQUFFLENBQUM7Ozs7O1FBL0JNLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFFbkMsZ0JBQVcsR0FBYyxFQUFFLENBQUM7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RSx3REFBd0Q7Z0JBQ2xFLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO2dCQUNsQyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQztnQkFDOUQsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNyQixRQUFRLEVBQUUsUUFBUTthQUNuQjs7c0JBbUNNLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsYUFBYTs7c0JBQ3hDLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsbUJBQW1COztrQkFKbEQsS0FBSzttQkFBQyxlQUFlOzs7Ozs7OztJQTFCdEIsMkJBQTJDOzs7OztJQUUzQyw2QkFBb0M7Ozs7OztJQU1wQyxzQkFBZ0I7Ozs7OztJQU1oQiwwQkFBOEI7Ozs7Ozs7Ozs7O0lBWTlCLHlCQUF5RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbnB1dCwgT3B0aW9uYWwsIFNlbGZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgRm9ybUhvb2tzfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtOZ01vZGVsfSBmcm9tICcuL25nX21vZGVsJztcbmltcG9ydCB7TmdNb2RlbEdyb3VwfSBmcm9tICcuL25nX21vZGVsX2dyb3VwJztcbmltcG9ydCB7Y29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIHJlbW92ZURpciwgc2V0VXBDb250cm9sLCBzZXRVcEZvcm1Db250YWluZXIsIHN5bmNQZW5kaW5nQ29udHJvbHN9IGZyb20gJy4vc2hhcmVkJztcblxuZXhwb3J0IGNvbnN0IGZvcm1EaXJlY3RpdmVQcm92aWRlcjogYW55ID0ge1xuICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ0Zvcm0pXG59O1xuXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSAoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKG51bGwpKSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIHRvcC1sZXZlbCBgRm9ybUdyb3VwYCBpbnN0YW5jZSBhbmQgYmluZHMgaXQgdG8gYSBmb3JtXG4gKiB0byB0cmFjayBhZ2dyZWdhdGUgZm9ybSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMuXG4gKlxuICogQXMgc29vbiBhcyB5b3UgaW1wb3J0IHRoZSBgRm9ybXNNb2R1bGVgLCB0aGlzIGRpcmVjdGl2ZSBiZWNvbWVzIGFjdGl2ZSBieSBkZWZhdWx0IG9uXG4gKiBhbGwgYDxmb3JtPmAgdGFncy4gIFlvdSBkb24ndCBuZWVkIHRvIGFkZCBhIHNwZWNpYWwgc2VsZWN0b3IuXG4gKlxuICogWW91IG9wdGlvbmFsbHkgZXhwb3J0IHRoZSBkaXJlY3RpdmUgaW50byBhIGxvY2FsIHRlbXBsYXRlIHZhcmlhYmxlIHVzaW5nIGBuZ0Zvcm1gIGFzIHRoZSBrZXlcbiAqIChleDogYCNteUZvcm09XCJuZ0Zvcm1cImApLiBUaGlzIGlzIG9wdGlvbmFsLCBidXQgdXNlZnVsLiAgTWFueSBwcm9wZXJ0aWVzIGZyb20gdGhlIHVuZGVybHlpbmdcbiAqIGBGb3JtR3JvdXBgIGluc3RhbmNlIGFyZSBkdXBsaWNhdGVkIG9uIHRoZSBkaXJlY3RpdmUgaXRzZWxmLCBzbyBhIHJlZmVyZW5jZSB0byBpdFxuICogZ2l2ZXMgeW91IGFjY2VzcyB0byB0aGUgYWdncmVnYXRlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0dXMgb2YgdGhlIGZvcm0sIGFzIHdlbGwgYXNcbiAqIHVzZXIgaW50ZXJhY3Rpb24gcHJvcGVydGllcyBsaWtlIGBkaXJ0eWAgYW5kIGB0b3VjaGVkYC5cbiAqXG4gKiBUbyByZWdpc3RlciBjaGlsZCBjb250cm9scyB3aXRoIHRoZSBmb3JtLCB1c2UgYE5nTW9kZWxgIHdpdGggYSBgbmFtZWBcbiAqIGF0dHJpYnV0ZS4gWW91IG1heSB1c2UgYE5nTW9kZWxHcm91cGAgdG8gY3JlYXRlIHN1Yi1ncm91cHMgd2l0aGluIHRoZSBmb3JtLlxuICpcbiAqIElmIG5lY2Vzc2FyeSwgbGlzdGVuIHRvIHRoZSBkaXJlY3RpdmUncyBgbmdTdWJtaXRgIGV2ZW50IHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIHVzZXIgaGFzXG4gKiB0cmlnZ2VyZWQgYSBmb3JtIHN1Ym1pc3Npb24uIFRoZSBgbmdTdWJtaXRgIGV2ZW50IGVtaXRzIHRoZSBvcmlnaW5hbCBmb3JtXG4gKiBzdWJtaXNzaW9uIGV2ZW50LlxuICpcbiAqIEluIHRlbXBsYXRlIGRyaXZlbiBmb3JtcywgYWxsIGA8Zm9ybT5gIHRhZ3MgYXJlIGF1dG9tYXRpY2FsbHkgdGFnZ2VkIGFzIGBOZ0Zvcm1gLlxuICogVG8gaW1wb3J0IHRoZSBgRm9ybXNNb2R1bGVgIGJ1dCBza2lwIGl0cyB1c2FnZSBpbiBzb21lIGZvcm1zLFxuICogZm9yIGV4YW1wbGUsIHRvIHVzZSBuYXRpdmUgSFRNTDUgdmFsaWRhdGlvbiwgYWRkIHRoZSBgbmdOb0Zvcm1gIGFuZCB0aGUgYDxmb3JtPmBcbiAqIHRhZ3Mgd29uJ3QgY3JlYXRlIGFuIGBOZ0Zvcm1gIGRpcmVjdGl2ZS4gSW4gcmVhY3RpdmUgZm9ybXMsIHVzaW5nIGBuZ05vRm9ybWAgaXNcbiAqIHVubmVjZXNzYXJ5IGJlY2F1c2UgdGhlIGA8Zm9ybT5gIHRhZ3MgYXJlIGluZXJ0LiBJbiB0aGF0IGNhc2UsIHlvdSB3b3VsZFxuICogcmVmcmFpbiBmcm9tIHVzaW5nIHRoZSBgZm9ybUdyb3VwYCBkaXJlY3RpdmUuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgTGlzdGVuaW5nIGZvciBmb3JtIHN1Ym1pc3Npb25cbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgaG93IHRvIGNhcHR1cmUgdGhlIGZvcm0gdmFsdWVzIGZyb20gdGhlIFwibmdTdWJtaXRcIiBldmVudC5cbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybS9zaW1wbGVfZm9ybV9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiAjIyMgU2V0dGluZyB0aGUgdXBkYXRlIG9wdGlvbnNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgc2hvd3MgeW91IGhvdyB0byBjaGFuZ2UgdGhlIFwidXBkYXRlT25cIiBvcHRpb24gZnJvbSBpdHMgZGVmYXVsdCB1c2luZ1xuICogbmdGb3JtT3B0aW9ucy5cbiAqXG4gKiBgYGBodG1sXG4gKiA8Zm9ybSBbbmdGb3JtT3B0aW9uc109XCJ7dXBkYXRlT246ICdibHVyJ31cIj5cbiAqICAgIDxpbnB1dCBuYW1lPVwib25lXCIgbmdNb2RlbD4gIDwhLS0gdGhpcyBuZ01vZGVsIHdpbGwgdXBkYXRlIG9uIGJsdXIgLS0+XG4gKiA8L2Zvcm0+XG4gKiBgYGBcbiAqXG4gKiAjIyMgTmF0aXZlIERPTSB2YWxpZGF0aW9uIFVJXG4gKlxuICogSW4gb3JkZXIgdG8gcHJldmVudCB0aGUgbmF0aXZlIERPTSBmb3JtIHZhbGlkYXRpb24gVUkgZnJvbSBpbnRlcmZlcmluZyB3aXRoIEFuZ3VsYXIncyBmb3JtXG4gKiB2YWxpZGF0aW9uLCBBbmd1bGFyIGF1dG9tYXRpY2FsbHkgYWRkcyB0aGUgYG5vdmFsaWRhdGVgIGF0dHJpYnV0ZSBvbiBhbnkgYDxmb3JtPmAgd2hlbmV2ZXJcbiAqIGBGb3JtTW9kdWxlYCBvciBgUmVhY3RpdmVGb3JtTW9kdWxlYCBhcmUgaW1wb3J0ZWQgaW50byB0aGUgYXBwbGljYXRpb24uXG4gKiBJZiB5b3Ugd2FudCB0byBleHBsaWNpdGx5IGVuYWJsZSBuYXRpdmUgRE9NIHZhbGlkYXRpb24gVUkgd2l0aCBBbmd1bGFyIGZvcm1zLCB5b3UgY2FuIGFkZCB0aGVcbiAqIGBuZ05hdGl2ZVZhbGlkYXRlYCBhdHRyaWJ1dGUgdG8gdGhlIGA8Zm9ybT5gIGVsZW1lbnQ6XG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0gbmdOYXRpdmVWYWxpZGF0ZT5cbiAqICAgLi4uXG4gKiA8L2Zvcm0+XG4gKiBgYGBcbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZm9ybTpub3QoW25nTm9Gb3JtXSk6bm90KFtmb3JtR3JvdXBdKSxuZy1mb3JtLFtuZ0Zvcm1dJyxcbiAgcHJvdmlkZXJzOiBbZm9ybURpcmVjdGl2ZVByb3ZpZGVyXSxcbiAgaG9zdDogeycoc3VibWl0KSc6ICdvblN1Ym1pdCgkZXZlbnQpJywgJyhyZXNldCknOiAnb25SZXNldCgpJ30sXG4gIG91dHB1dHM6IFsnbmdTdWJtaXQnXSxcbiAgZXhwb3J0QXM6ICduZ0Zvcm0nXG59KVxuZXhwb3J0IGNsYXNzIE5nRm9ybSBleHRlbmRzIENvbnRyb2xDb250YWluZXIgaW1wbGVtZW50cyBGb3JtLCBBZnRlclZpZXdJbml0IHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIHdoZXRoZXIgdGhlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0dGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfZGlyZWN0aXZlczogTmdNb2RlbFtdID0gW107XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgYEZvcm1Hcm91cGAgaW5zdGFuY2UgY3JlYXRlZCBmb3IgdGhpcyBmb3JtLlxuICAgKi9cbiAgZm9ybTogRm9ybUdyb3VwO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRXZlbnQgZW1pdHRlciBmb3IgdGhlIFwibmdTdWJtaXRcIiBldmVudFxuICAgKi9cbiAgbmdTdWJtaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3Mgb3B0aW9ucyBmb3IgdGhlIGBOZ0Zvcm1gIGluc3RhbmNlLlxuICAgKlxuICAgKiAqKnVwZGF0ZU9uKio6IFNldHMgdGhlIGRlZmF1bHQgYHVwZGF0ZU9uYCB2YWx1ZSBmb3IgYWxsIGNoaWxkIGBOZ01vZGVsc2AgYmVsb3cgaXRcbiAgICogdW5sZXNzIGV4cGxpY2l0bHkgc2V0IGJ5IGEgY2hpbGQgYE5nTW9kZWxgIHVzaW5nIGBuZ01vZGVsT3B0aW9uc2ApLiBEZWZhdWx0cyB0byAnY2hhbmdlJy5cbiAgICogUG9zc2libGUgdmFsdWVzOiBgJ2NoYW5nZSdgIHwgYCdibHVyJ2AgfCBgJ3N1Ym1pdCdgLlxuICAgKlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnbmdGb3JtT3B0aW9ucycpIG9wdGlvbnMhOiB7dXBkYXRlT24/OiBGb3JtSG9va3N9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IGFueVtdLFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX0FTWU5DX1ZBTElEQVRPUlMpIGFzeW5jVmFsaWRhdG9yczogYW55W10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZm9ybSA9XG4gICAgICAgIG5ldyBGb3JtR3JvdXAoe30sIGNvbXBvc2VWYWxpZGF0b3JzKHZhbGlkYXRvcnMpLCBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBMaWZlY3ljbGUgbWV0aG9kIGNhbGxlZCBhZnRlciB0aGUgdmlldyBpcyBpbml0aWFsaXplZC4gRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGludGVybmFsIGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0IGNvbnRyb2woKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGlzIGdyb3VwLiBCZWNhdXNlIHRoaXMgZGlyZWN0aXZlXG4gICAqIGFsd2F5cyBsaXZlcyBhdCB0aGUgdG9wIGxldmVsIG9mIGEgZm9ybSwgaXQgaXMgYWx3YXlzIGFuIGVtcHR5IGFycmF5LlxuICAgKi9cbiAgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhIG1hcCBvZiB0aGUgY29udHJvbHMgaW4gdGhpcyBncm91cC5cbiAgICovXG4gIGdldCBjb250cm9scygpOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5jb250cm9scztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgc2V0cyB1cCB0aGUgY29udHJvbCBkaXJlY3RpdmUgaW4gdGhpcyBncm91cCwgcmUtY2FsY3VsYXRlcyBpdHMgdmFsdWVcbiAgICogYW5kIHZhbGlkaXR5LCBhbmQgYWRkcyB0aGUgaW5zdGFuY2UgdG8gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlcy5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGFkZENvbnRyb2woZGlyOiBOZ01vZGVsKTogdm9pZCB7XG4gICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZmluZENvbnRhaW5lcihkaXIucGF0aCk7XG4gICAgICAoZGlyIGFzIHtjb250cm9sOiBGb3JtQ29udHJvbH0pLmNvbnRyb2wgPVxuICAgICAgICAgIDxGb3JtQ29udHJvbD5jb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBkaXIuY29udHJvbCk7XG4gICAgICBzZXRVcENvbnRyb2woZGlyLmNvbnRyb2wsIGRpcik7XG4gICAgICBkaXIuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVzLnB1c2goZGlyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIGZyb20gdGhlIHByb3ZpZGVkIGBOZ01vZGVsYCBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRDb250cm9sKGRpcjogTmdNb2RlbCk6IEZvcm1Db250cm9sIHtcbiAgICByZXR1cm4gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZW1vdmVzIHRoZSBgTmdNb2RlbGAgaW5zdGFuY2UgZnJvbSB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVDb250cm9sKGRpcjogTmdNb2RlbCk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ29udHJvbChkaXIubmFtZSk7XG4gICAgICB9XG4gICAgICByZW1vdmVEaXI8TmdNb2RlbD4odGhpcy5fZGlyZWN0aXZlcywgZGlyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWRkcyBhIG5ldyBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UgdG8gdGhlIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGFkZEZvcm1Hcm91cChkaXI6IE5nTW9kZWxHcm91cCk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgY29uc3QgZ3JvdXAgPSBuZXcgRm9ybUdyb3VwKHt9KTtcbiAgICAgIHNldFVwRm9ybUNvbnRhaW5lcihncm91cCwgZGlyKTtcbiAgICAgIGNvbnRhaW5lci5yZWdpc3RlckNvbnRyb2woZGlyLm5hbWUsIGdyb3VwKTtcbiAgICAgIGdyb3VwLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogZmFsc2V9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVtb3ZlcyB0aGUgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlIGZyb20gdGhlIGZvcm0uXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIHJlbW92ZUZvcm1Hcm91cChkaXI6IE5nTW9kZWxHcm91cCk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgaWYgKGNvbnRhaW5lcikge1xuICAgICAgICBjb250YWluZXIucmVtb3ZlQ29udHJvbChkaXIubmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHJpZXZlcyB0aGUgYEZvcm1Hcm91cGAgZm9yIGEgcHJvdmlkZWQgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGdldEZvcm1Hcm91cChkaXI6IE5nTW9kZWxHcm91cCk6IEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIDxGb3JtR3JvdXA+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgYE5nQ29udHJvbGAgZGlyZWN0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdDb250cm9sYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZGlyZWN0aXZlJ3MgY29udHJvbC5cbiAgICovXG4gIHVwZGF0ZU1vZGVsKGRpcjogTmdDb250cm9sLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgY3RybCA9IDxGb3JtQ29udHJvbD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoISk7XG4gICAgICBjdHJsLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoaXMgYEZvcm1Hcm91cGAuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlXG4gICAqL1xuICBzZXRWYWx1ZSh2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0pOiB2b2lkIHtcbiAgICB0aGlzLmNvbnRyb2wuc2V0VmFsdWUodmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIFwic3VibWl0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgKiBUcmlnZ2VycyB0aGUgYG5nU3VibWl0YCBlbWl0dGVyIHRvIGVtaXQgdGhlIFwic3VibWl0XCIgZXZlbnQgYXMgaXRzIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSAkZXZlbnQgVGhlIFwic3VibWl0XCIgZXZlbnQgb2JqZWN0XG4gICAqL1xuICBvblN1Ym1pdCgkZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgKHRoaXMgYXMge3N1Ym1pdHRlZDogYm9vbGVhbn0pLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgc3luY1BlbmRpbmdDb250cm9scyh0aGlzLmZvcm0sIHRoaXMuX2RpcmVjdGl2ZXMpO1xuICAgIHRoaXMubmdTdWJtaXQuZW1pdCgkZXZlbnQpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBcInJlc2V0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgKi9cbiAgb25SZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlc2V0Rm9ybSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXNldHMgdGhlIGZvcm0gdG8gYW4gaW5pdGlhbCB2YWx1ZSBhbmQgcmVzZXRzIGl0cyBzdWJtaXR0ZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGZvcm0uXG4gICAqL1xuICByZXNldEZvcm0odmFsdWU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHRoaXMuZm9ybS5yZXNldCh2YWx1ZSk7XG4gICAgKHRoaXMgYXMge3N1Ym1pdHRlZDogYm9vbGVhbn0pLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBkYXRlU3RyYXRlZ3koKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5mb3JtLl91cGRhdGVPbiA9IHRoaXMub3B0aW9ucy51cGRhdGVPbjtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9maW5kQ29udGFpbmVyKHBhdGg6IHN0cmluZ1tdKTogRm9ybUdyb3VwIHtcbiAgICBwYXRoLnBvcCgpO1xuICAgIHJldHVybiBwYXRoLmxlbmd0aCA/IDxGb3JtR3JvdXA+dGhpcy5mb3JtLmdldChwYXRoKSA6IHRoaXMuZm9ybTtcbiAgfVxufVxuIl19