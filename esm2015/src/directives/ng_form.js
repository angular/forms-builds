/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, EventEmitter, Inject, Input, Optional, Self, forwardRef } from '@angular/core';
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
 * ### Migrating from deprecated ngForm selector
 *
 * Support for using `ngForm` element selector has been deprecated in Angular v6 and will be removed
 * in Angular v9.
 *
 * This has been deprecated to keep selectors consistent with other core Angular selectors,
 * as element selectors are typically written in kebab-case.
 *
 * Now deprecated:
 * ```html
 * <ngForm #myForm="ngForm">
 * ```
 *
 * After:
 * ```html
 * <ng-form #myForm="ngForm">
 * ```
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
    ngAfterViewInit() { this._setUpdateStrategy(); }
    /**
     * \@description
     * The directive instance.
     * @return {?}
     */
    get formDirective() { return this; }
    /**
     * \@description
     * The internal `FormGroup` instance.
     * @return {?}
     */
    get control() { return this.form; }
    /**
     * \@description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it is always an empty array.
     * @return {?}
     */
    get path() { return []; }
    /**
     * \@description
     * Returns a map of the controls in this group.
     * @return {?}
     */
    get controls() { return this.form.controls; }
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
    getControl(dir) { return (/** @type {?} */ (this.form.get(dir.path))); }
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
    getFormGroup(dir) { return (/** @type {?} */ (this.form.get(dir.path))); }
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
    setValue(value) { this.control.setValue(value); }
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
    onReset() { this.resetForm(); }
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
/** @nocollapse */ NgForm.ngFactoryDef = function NgForm_Factory(t) { return new (t || NgForm)(i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
/** @nocollapse */ NgForm.ngDirectiveDef = i0.ɵɵdefineDirective({ type: NgForm, selectors: [["form", 3, "ngNoForm", "", 3, "formGroup", ""], ["ng-form"], ["", "ngForm", ""]], hostBindings: function NgForm_HostBindings(rf, ctx, elIndex) { if (rf & 1) {
        i0.ɵɵlistener("submit", function NgForm_submit_HostBindingHandler($event) { return ctx.onSubmit($event); });
        i0.ɵɵlistener("reset", function NgForm_reset_HostBindingHandler($event) { return ctx.onReset(); });
    } }, inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], features: [i0.ɵɵProvidersFeature([formDirectiveProvider]), i0.ɵɵInheritDefinitionFeature] });
/*@__PURE__*/ i0.ɵsetClassMetadata(NgForm, [{
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
        }] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQVFBLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWhILE9BQU8sRUFBK0IsU0FBUyxFQUFZLE1BQU0sVUFBVSxDQUFDO0FBQzVFLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFakUsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFLckQsT0FBTyxFQUFDLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUMsTUFBTSxVQUFVLENBQUM7Ozs7Ozs7Ozs7QUFFckksTUFBTSxPQUFPLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsV0FBVyxFQUFFLFVBQVU7OztJQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBQztDQUN0Qzs7TUFFSyxlQUFlLEdBQUc7OztBQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNkV2RCxNQUFNLE9BQU8sTUFBTyxTQUFRLGdCQUFnQjs7Ozs7SUFrQzFDLFlBQytDLFVBQWlCLEVBQ1gsZUFBc0I7UUFDekUsS0FBSyxFQUFFLENBQUM7Ozs7O1FBL0JNLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFFbkMsZ0JBQVcsR0FBYyxFQUFFLENB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QVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO2dCQUNsQyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQztnQkFDOUQsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNyQixRQUFRLEVBQUUsUUFBUTthQUNuQjs7c0JBb0NNLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsYUFBYTs7c0JBQ3hDLFFBQVE7O3NCQUFJLElBQUk7O3NCQUFJLE1BQU07dUJBQUMsbUJBQW1COztrQkFKbEQsS0FBSzttQkFBQyxlQUFlOzs7Ozs7OztJQTFCdEIsMkJBQTJDOzs7OztJQUUzQyw2QkFBb0M7Ozs7OztJQU1wQyxzQkFBZ0I7Ozs7OztJQU1oQiwwQkFBOEI7Ozs7Ozs7Ozs7O0lBWTlCLHlCQUEwRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBZnRlclZpZXdJbml0LCBEaXJlY3RpdmUsIEV2ZW50RW1pdHRlciwgSW5qZWN0LCBJbnB1dCwgT3B0aW9uYWwsIFNlbGYsIGZvcndhcmRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgRm9ybUNvbnRyb2wsIEZvcm1Hcm91cCwgRm9ybUhvb2tzfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtOZ01vZGVsfSBmcm9tICcuL25nX21vZGVsJztcbmltcG9ydCB7TmdNb2RlbEdyb3VwfSBmcm9tICcuL25nX21vZGVsX2dyb3VwJztcbmltcG9ydCB7Y29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIHJlbW92ZURpciwgc2V0VXBDb250cm9sLCBzZXRVcEZvcm1Db250YWluZXIsIHN5bmNQZW5kaW5nQ29udHJvbHN9IGZyb20gJy4vc2hhcmVkJztcblxuZXhwb3J0IGNvbnN0IGZvcm1EaXJlY3RpdmVQcm92aWRlcjogYW55ID0ge1xuICBwcm92aWRlOiBDb250cm9sQ29udGFpbmVyLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ0Zvcm0pXG59O1xuXG5jb25zdCByZXNvbHZlZFByb21pc2UgPSAoKCkgPT4gUHJvbWlzZS5yZXNvbHZlKG51bGwpKSgpO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIHRvcC1sZXZlbCBgRm9ybUdyb3VwYCBpbnN0YW5jZSBhbmQgYmluZHMgaXQgdG8gYSBmb3JtXG4gKiB0byB0cmFjayBhZ2dyZWdhdGUgZm9ybSB2YWx1ZSBhbmQgdmFsaWRhdGlvbiBzdGF0dXMuXG4gKlxuICogQXMgc29vbiBhcyB5b3UgaW1wb3J0IHRoZSBgRm9ybXNNb2R1bGVgLCB0aGlzIGRpcmVjdGl2ZSBiZWNvbWVzIGFjdGl2ZSBieSBkZWZhdWx0IG9uXG4gKiBhbGwgYDxmb3JtPmAgdGFncy4gIFlvdSBkb24ndCBuZWVkIHRvIGFkZCBhIHNwZWNpYWwgc2VsZWN0b3IuXG4gKlxuICogWW91IG9wdGlvbmFsbHkgZXhwb3J0IHRoZSBkaXJlY3RpdmUgaW50byBhIGxvY2FsIHRlbXBsYXRlIHZhcmlhYmxlIHVzaW5nIGBuZ0Zvcm1gIGFzIHRoZSBrZXlcbiAqIChleDogYCNteUZvcm09XCJuZ0Zvcm1cImApLiBUaGlzIGlzIG9wdGlvbmFsLCBidXQgdXNlZnVsLiAgTWFueSBwcm9wZXJ0aWVzIGZyb20gdGhlIHVuZGVybHlpbmdcbiAqIGBGb3JtR3JvdXBgIGluc3RhbmNlIGFyZSBkdXBsaWNhdGVkIG9uIHRoZSBkaXJlY3RpdmUgaXRzZWxmLCBzbyBhIHJlZmVyZW5jZSB0byBpdFxuICogZ2l2ZXMgeW91IGFjY2VzcyB0byB0aGUgYWdncmVnYXRlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0dXMgb2YgdGhlIGZvcm0sIGFzIHdlbGwgYXNcbiAqIHVzZXIgaW50ZXJhY3Rpb24gcHJvcGVydGllcyBsaWtlIGBkaXJ0eWAgYW5kIGB0b3VjaGVkYC5cbiAqXG4gKiBUbyByZWdpc3RlciBjaGlsZCBjb250cm9scyB3aXRoIHRoZSBmb3JtLCB1c2UgYE5nTW9kZWxgIHdpdGggYSBgbmFtZWBcbiAqIGF0dHJpYnV0ZS4gWW91IG1heSB1c2UgYE5nTW9kZWxHcm91cGAgdG8gY3JlYXRlIHN1Yi1ncm91cHMgd2l0aGluIHRoZSBmb3JtLlxuICpcbiAqIElmIG5lY2Vzc2FyeSwgbGlzdGVuIHRvIHRoZSBkaXJlY3RpdmUncyBgbmdTdWJtaXRgIGV2ZW50IHRvIGJlIG5vdGlmaWVkIHdoZW4gdGhlIHVzZXIgaGFzXG4gKiB0cmlnZ2VyZWQgYSBmb3JtIHN1Ym1pc3Npb24uIFRoZSBgbmdTdWJtaXRgIGV2ZW50IGVtaXRzIHRoZSBvcmlnaW5hbCBmb3JtXG4gKiBzdWJtaXNzaW9uIGV2ZW50LlxuICpcbiAqIEluIHRlbXBsYXRlIGRyaXZlbiBmb3JtcywgYWxsIGA8Zm9ybT5gIHRhZ3MgYXJlIGF1dG9tYXRpY2FsbHkgdGFnZ2VkIGFzIGBOZ0Zvcm1gLlxuICogVG8gaW1wb3J0IHRoZSBgRm9ybXNNb2R1bGVgIGJ1dCBza2lwIGl0cyB1c2FnZSBpbiBzb21lIGZvcm1zLFxuICogZm9yIGV4YW1wbGUsIHRvIHVzZSBuYXRpdmUgSFRNTDUgdmFsaWRhdGlvbiwgYWRkIHRoZSBgbmdOb0Zvcm1gIGFuZCB0aGUgYDxmb3JtPmBcbiAqIHRhZ3Mgd29uJ3QgY3JlYXRlIGFuIGBOZ0Zvcm1gIGRpcmVjdGl2ZS4gSW4gcmVhY3RpdmUgZm9ybXMsIHVzaW5nIGBuZ05vRm9ybWAgaXNcbiAqIHVubmVjZXNzYXJ5IGJlY2F1c2UgdGhlIGA8Zm9ybT5gIHRhZ3MgYXJlIGluZXJ0LiBJbiB0aGF0IGNhc2UsIHlvdSB3b3VsZFxuICogcmVmcmFpbiBmcm9tIHVzaW5nIHRoZSBgZm9ybUdyb3VwYCBkaXJlY3RpdmUuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiAjIyMgTWlncmF0aW5nIGZyb20gZGVwcmVjYXRlZCBuZ0Zvcm0gc2VsZWN0b3JcbiAqXG4gKiBTdXBwb3J0IGZvciB1c2luZyBgbmdGb3JtYCBlbGVtZW50IHNlbGVjdG9yIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgd2lsbCBiZSByZW1vdmVkXG4gKiBpbiBBbmd1bGFyIHY5LlxuICpcbiAqIFRoaXMgaGFzIGJlZW4gZGVwcmVjYXRlZCB0byBrZWVwIHNlbGVjdG9ycyBjb25zaXN0ZW50IHdpdGggb3RoZXIgY29yZSBBbmd1bGFyIHNlbGVjdG9ycyxcbiAqIGFzIGVsZW1lbnQgc2VsZWN0b3JzIGFyZSB0eXBpY2FsbHkgd3JpdHRlbiBpbiBrZWJhYi1jYXNlLlxuICpcbiAqIE5vdyBkZXByZWNhdGVkOlxuICogYGBgaHRtbFxuICogPG5nRm9ybSAjbXlGb3JtPVwibmdGb3JtXCI+XG4gKiBgYGBcbiAqXG4gKiBBZnRlcjpcbiAqIGBgYGh0bWxcbiAqIDxuZy1mb3JtICNteUZvcm09XCJuZ0Zvcm1cIj5cbiAqIGBgYFxuICpcbiAqICMjIyBMaXN0ZW5pbmcgZm9yIGZvcm0gc3VibWlzc2lvblxuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyBob3cgdG8gY2FwdHVyZSB0aGUgZm9ybSB2YWx1ZXMgZnJvbSB0aGUgXCJuZ1N1Ym1pdFwiIGV2ZW50LlxuICpcbiAqIHtAZXhhbXBsZSBmb3Jtcy90cy9zaW1wbGVGb3JtL3NpbXBsZV9mb3JtX2V4YW1wbGUudHMgcmVnaW9uPSdDb21wb25lbnQnfVxuICpcbiAqICMjIyBTZXR0aW5nIHRoZSB1cGRhdGUgb3B0aW9uc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgZXhhbXBsZSBzaG93cyB5b3UgaG93IHRvIGNoYW5nZSB0aGUgXCJ1cGRhdGVPblwiIG9wdGlvbiBmcm9tIGl0cyBkZWZhdWx0IHVzaW5nXG4gKiBuZ0Zvcm1PcHRpb25zLlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtIFtuZ0Zvcm1PcHRpb25zXT1cInt1cGRhdGVPbjogJ2JsdXInfVwiPlxuICogICAgPGlucHV0IG5hbWU9XCJvbmVcIiBuZ01vZGVsPiAgPCEtLSB0aGlzIG5nTW9kZWwgd2lsbCB1cGRhdGUgb24gYmx1ciAtLT5cbiAqIDwvZm9ybT5cbiAqIGBgYFxuICpcbiAqIEBuZ01vZHVsZSBGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdmb3JtOm5vdChbbmdOb0Zvcm1dKTpub3QoW2Zvcm1Hcm91cF0pLG5nLWZvcm0sW25nRm9ybV0nLFxuICBwcm92aWRlcnM6IFtmb3JtRGlyZWN0aXZlUHJvdmlkZXJdLFxuICBob3N0OiB7JyhzdWJtaXQpJzogJ29uU3VibWl0KCRldmVudCknLCAnKHJlc2V0KSc6ICdvblJlc2V0KCknfSxcbiAgb3V0cHV0czogWyduZ1N1Ym1pdCddLFxuICBleHBvcnRBczogJ25nRm9ybSdcbn0pXG5leHBvcnQgY2xhc3MgTmdGb3JtIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciBpbXBsZW1lbnRzIEZvcm0sXG4gICAgQWZ0ZXJWaWV3SW5pdCB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2RpcmVjdGl2ZXM6IE5nTW9kZWxbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGBGb3JtR3JvdXBgIGluc3RhbmNlIGNyZWF0ZWQgZm9yIHRoaXMgZm9ybS5cbiAgICovXG4gIGZvcm06IEZvcm1Hcm91cDtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEV2ZW50IGVtaXR0ZXIgZm9yIHRoZSBcIm5nU3VibWl0XCIgZXZlbnRcbiAgICovXG4gIG5nU3VibWl0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIG9wdGlvbnMgZm9yIHRoZSBgTmdGb3JtYCBpbnN0YW5jZS5cbiAgICpcbiAgICogKip1cGRhdGVPbioqOiBTZXRzIHRoZSBkZWZhdWx0IGB1cGRhdGVPbmAgdmFsdWUgZm9yIGFsbCBjaGlsZCBgTmdNb2RlbHNgIGJlbG93IGl0XG4gICAqIHVubGVzcyBleHBsaWNpdGx5IHNldCBieSBhIGNoaWxkIGBOZ01vZGVsYCB1c2luZyBgbmdNb2RlbE9wdGlvbnNgKS4gRGVmYXVsdHMgdG8gJ2NoYW5nZScuXG4gICAqIFBvc3NpYmxlIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYC5cbiAgICpcbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoJ25nRm9ybU9wdGlvbnMnKSBvcHRpb25zICE6IHt1cGRhdGVPbj86IEZvcm1Ib29rc307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgdmFsaWRhdG9yczogYW55W10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgYXN5bmNWYWxpZGF0b3JzOiBhbnlbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5mb3JtID1cbiAgICAgICAgbmV3IEZvcm1Hcm91cCh7fSwgY29tcG9zZVZhbGlkYXRvcnModmFsaWRhdG9ycyksIGNvbXBvc2VBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3JzKSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIExpZmVjeWNsZSBtZXRob2QgY2FsbGVkIGFmdGVyIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gICAqL1xuICBuZ0FmdGVyVmlld0luaXQoKSB7IHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KCk7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtIHsgcmV0dXJuIHRoaXM7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBpbnRlcm5hbCBgRm9ybUdyb3VwYCBpbnN0YW5jZS5cbiAgICovXG4gIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7IHJldHVybiB0aGlzLmZvcm07IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoaXMgZ3JvdXAuIEJlY2F1c2UgdGhpcyBkaXJlY3RpdmVcbiAgICogYWx3YXlzIGxpdmVzIGF0IHRoZSB0b3AgbGV2ZWwgb2YgYSBmb3JtLCBpdCBpcyBhbHdheXMgYW4gZW1wdHkgYXJyYXkuXG4gICAqL1xuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7IHJldHVybiBbXTsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhIG1hcCBvZiB0aGUgY29udHJvbHMgaW4gdGhpcyBncm91cC5cbiAgICovXG4gIGdldCBjb250cm9scygpOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7IHJldHVybiB0aGlzLmZvcm0uY29udHJvbHM7IH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHNldHMgdXAgdGhlIGNvbnRyb2wgZGlyZWN0aXZlIGluIHRoaXMgZ3JvdXAsIHJlLWNhbGN1bGF0ZXMgaXRzIHZhbHVlXG4gICAqIGFuZCB2YWxpZGl0eSwgYW5kIGFkZHMgdGhlIGluc3RhbmNlIHRvIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRDb250cm9sKGRpcjogTmdNb2RlbCk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgKGRpciBhc3tjb250cm9sOiBGb3JtQ29udHJvbH0pLmNvbnRyb2wgPVxuICAgICAgICAgIDxGb3JtQ29udHJvbD5jb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBkaXIuY29udHJvbCk7XG4gICAgICBzZXRVcENvbnRyb2woZGlyLmNvbnRyb2wsIGRpcik7XG4gICAgICBkaXIuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVzLnB1c2goZGlyKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIGZyb20gdGhlIHByb3ZpZGVkIGBOZ01vZGVsYCBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ01vZGVsYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRDb250cm9sKGRpcjogTmdNb2RlbCk6IEZvcm1Db250cm9sIHsgcmV0dXJuIDxGb3JtQ29udHJvbD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVtb3ZlcyB0aGUgYE5nTW9kZWxgIGluc3RhbmNlIGZyb20gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlc1xuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbChkaXI6IE5nTW9kZWwpOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNvbnRyb2woZGlyLm5hbWUpO1xuICAgICAgfVxuICAgICAgcmVtb3ZlRGlyPE5nTW9kZWw+KHRoaXMuX2RpcmVjdGl2ZXMsIGRpcik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBuZXcgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGNvbnN0IGdyb3VwID0gbmV3IEZvcm1Hcm91cCh7fSk7XG4gICAgICBzZXRVcEZvcm1Db250YWluZXIoZ3JvdXAsIGRpcik7XG4gICAgICBjb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBncm91cCk7XG4gICAgICBncm91cC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlbW92ZXMgdGhlIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZSBmcm9tIHRoZSBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNvbnRyb2woZGlyLm5hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtR3JvdXBgIGZvciBhIHByb3ZpZGVkIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiBGb3JtR3JvdXAgeyByZXR1cm4gPEZvcm1Hcm91cD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTsgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBuZXcgdmFsdWUgZm9yIHRoZSBwcm92aWRlZCBgTmdDb250cm9sYCBkaXJlY3RpdmUuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBOZ0NvbnRyb2xgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBkaXJlY3RpdmUncyBjb250cm9sLlxuICAgKi9cbiAgdXBkYXRlTW9kZWwoZGlyOiBOZ0NvbnRyb2wsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjdHJsID0gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGggISk7XG4gICAgICBjdHJsLnNldFZhbHVlKHZhbHVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoaXMgYEZvcm1Hcm91cGAuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlXG4gICAqL1xuICBzZXRWYWx1ZSh2YWx1ZToge1trZXk6IHN0cmluZ106IGFueX0pOiB2b2lkIHsgdGhpcy5jb250cm9sLnNldFZhbHVlKHZhbHVlKTsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBcInN1Ym1pdFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICogVHJpZ2dlcnMgdGhlIGBuZ1N1Ym1pdGAgZW1pdHRlciB0byBlbWl0IHRoZSBcInN1Ym1pdFwiIGV2ZW50IGFzIGl0cyBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0gJGV2ZW50IFRoZSBcInN1Ym1pdFwiIGV2ZW50IG9iamVjdFxuICAgKi9cbiAgb25TdWJtaXQoJGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuICAgICh0aGlzIGFze3N1Ym1pdHRlZDogYm9vbGVhbn0pLnN1Ym1pdHRlZCA9IHRydWU7XG4gICAgc3luY1BlbmRpbmdDb250cm9scyh0aGlzLmZvcm0sIHRoaXMuX2RpcmVjdGl2ZXMpO1xuICAgIHRoaXMubmdTdWJtaXQuZW1pdCgkZXZlbnQpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBcInJlc2V0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgKi9cbiAgb25SZXNldCgpOiB2b2lkIHsgdGhpcy5yZXNldEZvcm0oKTsgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVzZXRzIHRoZSBmb3JtIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIHJlc2V0cyBpdHMgc3VibWl0dGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBmb3JtLlxuICAgKi9cbiAgcmVzZXRGb3JtKHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm0ucmVzZXQodmFsdWUpO1xuICAgICh0aGlzIGFze3N1Ym1pdHRlZDogYm9vbGVhbn0pLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBkYXRlU3RyYXRlZ3koKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMudXBkYXRlT24gIT0gbnVsbCkge1xuICAgICAgdGhpcy5mb3JtLl91cGRhdGVPbiA9IHRoaXMub3B0aW9ucy51cGRhdGVPbjtcbiAgICB9XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9maW5kQ29udGFpbmVyKHBhdGg6IHN0cmluZ1tdKTogRm9ybUdyb3VwIHtcbiAgICBwYXRoLnBvcCgpO1xuICAgIHJldHVybiBwYXRoLmxlbmd0aCA/IDxGb3JtR3JvdXA+dGhpcy5mb3JtLmdldChwYXRoKSA6IHRoaXMuZm9ybTtcbiAgfVxufVxuIl19