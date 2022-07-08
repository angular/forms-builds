/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Self } from '@angular/core';
import { FormGroup } from '../model/form_group';
import { composeAsyncValidators, composeValidators, NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { ControlContainer } from './control_container';
import { setUpControl, setUpFormContainer, syncPendingControls } from './shared';
import * as i0 from "@angular/core";
export const formDirectiveProvider = {
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
export class NgForm extends ControlContainer {
    constructor(validators, asyncValidators) {
        super();
        /**
         * @description
         * Returns whether the form submission has been triggered.
         */
        this.submitted = false;
        this._directives = new Set();
        /**
         * @description
         * Event emitter for the "ngSubmit" event
         */
        this.ngSubmit = new EventEmitter();
        this.form =
            new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
    }
    /** @nodoc */
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
            this._directives.add(dir);
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
            this._directives.delete(dir);
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
    _findContainer(path) {
        path.pop();
        return path.length ? this.form.get(path) : this.form;
    }
}
NgForm.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.5+sha-dfb6246", ngImport: i0, type: NgForm, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: i0.ɵɵFactoryTarget.Directive });
NgForm.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.5+sha-dfb6246", type: NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider], exportAs: ["ngForm"], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.5+sha-dfb6246", ngImport: i0, type: NgForm, decorators: [{
            type: Directive,
            args: [{
                    selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                    outputs: ['ngSubmit'],
                    exportAs: 'ngForm'
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
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
                }] }]; }, propDecorators: { options: [{
                type: Input,
                args: ['ngFormOptions']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFnQixTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJaEgsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFFNUcsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFLckQsT0FBTyxFQUFDLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFHL0UsTUFBTSxDQUFDLE1BQU0scUJBQXFCLEdBQVE7SUFDeEMsT0FBTyxFQUFFLGdCQUFnQjtJQUN6QixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQztDQUN0QyxDQUFDO0FBRUYsTUFBTSxlQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUV4RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0RHO0FBUUgsTUFBTSxPQUFPLE1BQU8sU0FBUSxnQkFBZ0I7SUFpQzFDLFlBQytDLFVBQXFDLEVBQy9CLGVBQ1Y7UUFDekMsS0FBSyxFQUFFLENBQUM7UUFwQ1Y7OztXQUdHO1FBQ2EsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUVuQyxn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OUIsS0FBSzt1QkFBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIEluamVjdCwgSW5wdXQsIE9wdGlvbmFsLCBTZWxmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIEZvcm1Ib29rc30gZnJvbSAnLi4vbW9kZWwvYWJzdHJhY3RfbW9kZWwnO1xuaW1wb3J0IHtGb3JtQ29udHJvbH0gZnJvbSAnLi4vbW9kZWwvZm9ybV9jb250cm9sJztcbmltcG9ydCB7Rm9ybUdyb3VwfSBmcm9tICcuLi9tb2RlbC9mb3JtX2dyb3VwJztcbmltcG9ydCB7Y29tcG9zZUFzeW5jVmFsaWRhdG9ycywgY29tcG9zZVZhbGlkYXRvcnMsIE5HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtOZ01vZGVsfSBmcm9tICcuL25nX21vZGVsJztcbmltcG9ydCB7TmdNb2RlbEdyb3VwfSBmcm9tICcuL25nX21vZGVsX2dyb3VwJztcbmltcG9ydCB7c2V0VXBDb250cm9sLCBzZXRVcEZvcm1Db250YWluZXIsIHN5bmNQZW5kaW5nQ29udHJvbHN9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBmb3JtRGlyZWN0aXZlUHJvdmlkZXI6IGFueSA9IHtcbiAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdGb3JtKVxufTtcblxuY29uc3QgcmVzb2x2ZWRQcm9taXNlID0gKCgpID0+IFByb21pc2UucmVzb2x2ZShudWxsKSkoKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSB0b3AtbGV2ZWwgYEZvcm1Hcm91cGAgaW5zdGFuY2UgYW5kIGJpbmRzIGl0IHRvIGEgZm9ybVxuICogdG8gdHJhY2sgYWdncmVnYXRlIGZvcm0gdmFsdWUgYW5kIHZhbGlkYXRpb24gc3RhdHVzLlxuICpcbiAqIEFzIHNvb24gYXMgeW91IGltcG9ydCB0aGUgYEZvcm1zTW9kdWxlYCwgdGhpcyBkaXJlY3RpdmUgYmVjb21lcyBhY3RpdmUgYnkgZGVmYXVsdCBvblxuICogYWxsIGA8Zm9ybT5gIHRhZ3MuICBZb3UgZG9uJ3QgbmVlZCB0byBhZGQgYSBzcGVjaWFsIHNlbGVjdG9yLlxuICpcbiAqIFlvdSBvcHRpb25hbGx5IGV4cG9ydCB0aGUgZGlyZWN0aXZlIGludG8gYSBsb2NhbCB0ZW1wbGF0ZSB2YXJpYWJsZSB1c2luZyBgbmdGb3JtYCBhcyB0aGUga2V5XG4gKiAoZXg6IGAjbXlGb3JtPVwibmdGb3JtXCJgKS4gVGhpcyBpcyBvcHRpb25hbCwgYnV0IHVzZWZ1bC4gIE1hbnkgcHJvcGVydGllcyBmcm9tIHRoZSB1bmRlcmx5aW5nXG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSBhcmUgZHVwbGljYXRlZCBvbiB0aGUgZGlyZWN0aXZlIGl0c2VsZiwgc28gYSByZWZlcmVuY2UgdG8gaXRcbiAqIGdpdmVzIHlvdSBhY2Nlc3MgdG8gdGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdHVzIG9mIHRoZSBmb3JtLCBhcyB3ZWxsIGFzXG4gKiB1c2VyIGludGVyYWN0aW9uIHByb3BlcnRpZXMgbGlrZSBgZGlydHlgIGFuZCBgdG91Y2hlZGAuXG4gKlxuICogVG8gcmVnaXN0ZXIgY2hpbGQgY29udHJvbHMgd2l0aCB0aGUgZm9ybSwgdXNlIGBOZ01vZGVsYCB3aXRoIGEgYG5hbWVgXG4gKiBhdHRyaWJ1dGUuIFlvdSBtYXkgdXNlIGBOZ01vZGVsR3JvdXBgIHRvIGNyZWF0ZSBzdWItZ3JvdXBzIHdpdGhpbiB0aGUgZm9ybS5cbiAqXG4gKiBJZiBuZWNlc3NhcnksIGxpc3RlbiB0byB0aGUgZGlyZWN0aXZlJ3MgYG5nU3VibWl0YCBldmVudCB0byBiZSBub3RpZmllZCB3aGVuIHRoZSB1c2VyIGhhc1xuICogdHJpZ2dlcmVkIGEgZm9ybSBzdWJtaXNzaW9uLiBUaGUgYG5nU3VibWl0YCBldmVudCBlbWl0cyB0aGUgb3JpZ2luYWwgZm9ybVxuICogc3VibWlzc2lvbiBldmVudC5cbiAqXG4gKiBJbiB0ZW1wbGF0ZSBkcml2ZW4gZm9ybXMsIGFsbCBgPGZvcm0+YCB0YWdzIGFyZSBhdXRvbWF0aWNhbGx5IHRhZ2dlZCBhcyBgTmdGb3JtYC5cbiAqIFRvIGltcG9ydCB0aGUgYEZvcm1zTW9kdWxlYCBidXQgc2tpcCBpdHMgdXNhZ2UgaW4gc29tZSBmb3JtcyxcbiAqIGZvciBleGFtcGxlLCB0byB1c2UgbmF0aXZlIEhUTUw1IHZhbGlkYXRpb24sIGFkZCB0aGUgYG5nTm9Gb3JtYCBhbmQgdGhlIGA8Zm9ybT5gXG4gKiB0YWdzIHdvbid0IGNyZWF0ZSBhbiBgTmdGb3JtYCBkaXJlY3RpdmUuIEluIHJlYWN0aXZlIGZvcm1zLCB1c2luZyBgbmdOb0Zvcm1gIGlzXG4gKiB1bm5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBgPGZvcm0+YCB0YWdzIGFyZSBpbmVydC4gSW4gdGhhdCBjYXNlLCB5b3Ugd291bGRcbiAqIHJlZnJhaW4gZnJvbSB1c2luZyB0aGUgYGZvcm1Hcm91cGAgZGlyZWN0aXZlLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIExpc3RlbmluZyBmb3IgZm9ybSBzdWJtaXNzaW9uXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIGhvdyB0byBjYXB0dXJlIHRoZSBmb3JtIHZhbHVlcyBmcm9tIHRoZSBcIm5nU3VibWl0XCIgZXZlbnQuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm0vc2ltcGxlX2Zvcm1fZXhhbXBsZS50cyByZWdpb249J0NvbXBvbmVudCd9XG4gKlxuICogIyMjIFNldHRpbmcgdGhlIHVwZGF0ZSBvcHRpb25zXG4gKlxuICogVGhlIGZvbGxvd2luZyBleGFtcGxlIHNob3dzIHlvdSBob3cgdG8gY2hhbmdlIHRoZSBcInVwZGF0ZU9uXCIgb3B0aW9uIGZyb20gaXRzIGRlZmF1bHQgdXNpbmdcbiAqIG5nRm9ybU9wdGlvbnMuXG4gKlxuICogYGBgaHRtbFxuICogPGZvcm0gW25nRm9ybU9wdGlvbnNdPVwie3VwZGF0ZU9uOiAnYmx1cid9XCI+XG4gKiAgICA8aW5wdXQgbmFtZT1cIm9uZVwiIG5nTW9kZWw+ICA8IS0tIHRoaXMgbmdNb2RlbCB3aWxsIHVwZGF0ZSBvbiBibHVyIC0tPlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogIyMjIE5hdGl2ZSBET00gdmFsaWRhdGlvbiBVSVxuICpcbiAqIEluIG9yZGVyIHRvIHByZXZlbnQgdGhlIG5hdGl2ZSBET00gZm9ybSB2YWxpZGF0aW9uIFVJIGZyb20gaW50ZXJmZXJpbmcgd2l0aCBBbmd1bGFyJ3MgZm9ybVxuICogdmFsaWRhdGlvbiwgQW5ndWxhciBhdXRvbWF0aWNhbGx5IGFkZHMgdGhlIGBub3ZhbGlkYXRlYCBhdHRyaWJ1dGUgb24gYW55IGA8Zm9ybT5gIHdoZW5ldmVyXG4gKiBgRm9ybU1vZHVsZWAgb3IgYFJlYWN0aXZlRm9ybU1vZHVsZWAgYXJlIGltcG9ydGVkIGludG8gdGhlIGFwcGxpY2F0aW9uLlxuICogSWYgeW91IHdhbnQgdG8gZXhwbGljaXRseSBlbmFibGUgbmF0aXZlIERPTSB2YWxpZGF0aW9uIFVJIHdpdGggQW5ndWxhciBmb3JtcywgeW91IGNhbiBhZGQgdGhlXG4gKiBgbmdOYXRpdmVWYWxpZGF0ZWAgYXR0cmlidXRlIHRvIHRoZSBgPGZvcm0+YCBlbGVtZW50OlxuICpcbiAqIGBgYGh0bWxcbiAqIDxmb3JtIG5nTmF0aXZlVmFsaWRhdGU+XG4gKiAgIC4uLlxuICogPC9mb3JtPlxuICogYGBgXG4gKlxuICogQG5nTW9kdWxlIEZvcm1zTW9kdWxlXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2Zvcm06bm90KFtuZ05vRm9ybV0pOm5vdChbZm9ybUdyb3VwXSksbmctZm9ybSxbbmdGb3JtXScsXG4gIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gIGhvc3Q6IHsnKHN1Ym1pdCknOiAnb25TdWJtaXQoJGV2ZW50KScsICcocmVzZXQpJzogJ29uUmVzZXQoKSd9LFxuICBvdXRwdXRzOiBbJ25nU3VibWl0J10sXG4gIGV4cG9ydEFzOiAnbmdGb3JtJ1xufSlcbmV4cG9ydCBjbGFzcyBOZ0Zvcm0gZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgRm9ybSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyB3aGV0aGVyIHRoZSBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2RpcmVjdGl2ZXMgPSBuZXcgU2V0PE5nTW9kZWw+KCk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgYEZvcm1Hcm91cGAgaW5zdGFuY2UgY3JlYXRlZCBmb3IgdGhpcyBmb3JtLlxuICAgKi9cbiAgZm9ybTogRm9ybUdyb3VwO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRXZlbnQgZW1pdHRlciBmb3IgdGhlIFwibmdTdWJtaXRcIiBldmVudFxuICAgKi9cbiAgbmdTdWJtaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUcmFja3Mgb3B0aW9ucyBmb3IgdGhlIGBOZ0Zvcm1gIGluc3RhbmNlLlxuICAgKlxuICAgKiAqKnVwZGF0ZU9uKio6IFNldHMgdGhlIGRlZmF1bHQgYHVwZGF0ZU9uYCB2YWx1ZSBmb3IgYWxsIGNoaWxkIGBOZ01vZGVsc2AgYmVsb3cgaXRcbiAgICogdW5sZXNzIGV4cGxpY2l0bHkgc2V0IGJ5IGEgY2hpbGQgYE5nTW9kZWxgIHVzaW5nIGBuZ01vZGVsT3B0aW9uc2ApLiBEZWZhdWx0cyB0byAnY2hhbmdlJy5cbiAgICogUG9zc2libGUgdmFsdWVzOiBgJ2NoYW5nZSdgIHwgYCdibHVyJ2AgfCBgJ3N1Ym1pdCdgLlxuICAgKlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnbmdGb3JtT3B0aW9ucycpIG9wdGlvbnMhOiB7dXBkYXRlT24/OiBGb3JtSG9va3N9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQE9wdGlvbmFsKCkgQFNlbGYoKSBASW5qZWN0KE5HX1ZBTElEQVRPUlMpIHZhbGlkYXRvcnM6IChWYWxpZGF0b3J8VmFsaWRhdG9yRm4pW10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgYXN5bmNWYWxpZGF0b3JzOlxuICAgICAgICAgIChBc3luY1ZhbGlkYXRvcnxBc3luY1ZhbGlkYXRvckZuKVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmZvcm0gPVxuICAgICAgICBuZXcgRm9ybUdyb3VwKHt9LCBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSwgY29tcG9zZUFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBvdmVycmlkZSBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGludGVybmFsIGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGNvbnRyb2woKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIGFuIGFycmF5IHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGlzIGdyb3VwLiBCZWNhdXNlIHRoaXMgZGlyZWN0aXZlXG4gICAqIGFsd2F5cyBsaXZlcyBhdCB0aGUgdG9wIGxldmVsIG9mIGEgZm9ybSwgaXQgaXMgYWx3YXlzIGFuIGVtcHR5IGFycmF5LlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IHBhdGgoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhIG1hcCBvZiB0aGUgY29udHJvbHMgaW4gdGhpcyBncm91cC5cbiAgICovXG4gIGdldCBjb250cm9scygpOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybS5jb250cm9scztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIHRoYXQgc2V0cyB1cCB0aGUgY29udHJvbCBkaXJlY3RpdmUgaW4gdGhpcyBncm91cCwgcmUtY2FsY3VsYXRlcyBpdHMgdmFsdWVcbiAgICogYW5kIHZhbGlkaXR5LCBhbmQgYWRkcyB0aGUgaW5zdGFuY2UgdG8gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlcy5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGFkZENvbnRyb2woZGlyOiBOZ01vZGVsKTogdm9pZCB7XG4gICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZmluZENvbnRhaW5lcihkaXIucGF0aCk7XG4gICAgICAoZGlyIGFzIHtjb250cm9sOiBGb3JtQ29udHJvbH0pLmNvbnRyb2wgPVxuICAgICAgICAgIDxGb3JtQ29udHJvbD5jb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBkaXIuY29udHJvbCk7XG4gICAgICBzZXRVcENvbnRyb2woZGlyLmNvbnRyb2wsIGRpcik7XG4gICAgICBkaXIuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVzLmFkZChkaXIpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2UgZnJvbSB0aGUgcHJvdmlkZWQgYE5nTW9kZWxgIGRpcmVjdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGdldENvbnRyb2woZGlyOiBOZ01vZGVsKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlbW92ZXMgdGhlIGBOZ01vZGVsYCBpbnN0YW5jZSBmcm9tIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXNcbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nTW9kZWxgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2woZGlyOiBOZ01vZGVsKTogdm9pZCB7XG4gICAgcmVzb2x2ZWRQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gdGhpcy5fZmluZENvbnRhaW5lcihkaXIucGF0aCk7XG4gICAgICBpZiAoY29udGFpbmVyKSB7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmVDb250cm9sKGRpci5uYW1lKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2RpcmVjdGl2ZXMuZGVsZXRlKGRpcik7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFkZHMgYSBuZXcgYE5nTW9kZWxHcm91cGAgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGNvbnN0IGdyb3VwID0gbmV3IEZvcm1Hcm91cCh7fSk7XG4gICAgICBzZXRVcEZvcm1Db250YWluZXIoZ3JvdXAsIGRpcik7XG4gICAgICBjb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBncm91cCk7XG4gICAgICBncm91cC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlbW92ZXMgdGhlIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZSBmcm9tIHRoZSBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNvbnRyb2woZGlyLm5hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXRyaWV2ZXMgdGhlIGBGb3JtR3JvdXBgIGZvciBhIHByb3ZpZGVkIGBOZ01vZGVsR3JvdXBgIGRpcmVjdGl2ZSBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgTmdNb2RlbEdyb3VwYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiBGb3JtR3JvdXAge1xuICAgIHJldHVybiA8Rm9ybUdyb3VwPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHByb3ZpZGVkIGBOZ0NvbnRyb2xgIGRpcmVjdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYE5nQ29udHJvbGAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGRpcmVjdGl2ZSdzIGNvbnRyb2wuXG4gICAqL1xuICB1cGRhdGVNb2RlbChkaXI6IE5nQ29udHJvbCwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGN0cmwgPSA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCEpO1xuICAgICAgY3RybC5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFNldHMgdGhlIHZhbHVlIGZvciB0aGlzIGBGb3JtR3JvdXBgLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZVxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogdm9pZCB7XG4gICAgdGhpcy5jb250cm9sLnNldFZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBcInN1Ym1pdFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICogVHJpZ2dlcnMgdGhlIGBuZ1N1Ym1pdGAgZW1pdHRlciB0byBlbWl0IHRoZSBcInN1Ym1pdFwiIGV2ZW50IGFzIGl0cyBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0gJGV2ZW50IFRoZSBcInN1Ym1pdFwiIGV2ZW50IG9iamVjdFxuICAgKi9cbiAgb25TdWJtaXQoJGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuICAgICh0aGlzIGFzIHtzdWJtaXR0ZWQ6IGJvb2xlYW59KS5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgIHN5bmNQZW5kaW5nQ29udHJvbHModGhpcy5mb3JtLCB0aGlzLl9kaXJlY3RpdmVzKTtcbiAgICB0aGlzLm5nU3VibWl0LmVtaXQoJGV2ZW50KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgXCJyZXNldFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICovXG4gIG9uUmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldEZvcm0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVzZXRzIHRoZSBmb3JtIHRvIGFuIGluaXRpYWwgdmFsdWUgYW5kIHJlc2V0cyBpdHMgc3VibWl0dGVkIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBmb3JtLlxuICAgKi9cbiAgcmVzZXRGb3JtKHZhbHVlOiBhbnkgPSB1bmRlZmluZWQpOiB2b2lkIHtcbiAgICB0aGlzLmZvcm0ucmVzZXQodmFsdWUpO1xuICAgICh0aGlzIGFzIHtzdWJtaXR0ZWQ6IGJvb2xlYW59KS5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFVwZGF0ZVN0cmF0ZWd5KCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnVwZGF0ZU9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZm9ybS5fdXBkYXRlT24gPSB0aGlzLm9wdGlvbnMudXBkYXRlT247XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZmluZENvbnRhaW5lcihwYXRoOiBzdHJpbmdbXSk6IEZvcm1Hcm91cCB7XG4gICAgcGF0aC5wb3AoKTtcbiAgICByZXR1cm4gcGF0aC5sZW5ndGggPyA8Rm9ybUdyb3VwPnRoaXMuZm9ybS5nZXQocGF0aCkgOiB0aGlzLmZvcm07XG4gIH1cbn1cbiJdfQ==