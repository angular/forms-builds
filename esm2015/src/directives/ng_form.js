/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, Inject, Input, Optional, Self, forwardRef } from '@angular/core';
import { FormGroup } from '../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../validators';
import { ControlContainer } from './control_container';
import { composeAsyncValidators, composeValidators, removeDir, setUpControl, setUpFormContainer, syncPendingControls } from './shared';
/** @type {?} */
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => NgForm)
};
/** @type {?} */
const resolvedPromise = Promise.resolve(null);
/**
 * \@description
 *
 * Creates a top-level `FormGroup` instance and binds it to a form
 * to track aggregate form value and validation status.
 *
 * As soon as you import the `FormsModule`, this directive becomes active by default on
 * all `<form>` tags.  You don't need to add a special selector.
 *
 * You can export the directive into a local template variable using `ngForm` as the key
 * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
 * `FormGroup` instance are duplicated on the directive itself, so a reference to it
 * will give you access to the aggregate value and validity status of the form, as well as
 * user interaction properties like `dirty` and `touched`.
 *
 * To register child controls with the form, you'll want to use `NgModel` with a
 * `name` attribute.  You can also use `NgModelGroup` if you'd like to create
 * sub-groups within the form.
 *
 * You can listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event will be emitted with the original form
 * submission event.
 *
 * In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
 * If you want to import the `FormsModule` but skip its usage in some forms,
 * for example, to use native HTML5 validation, you can add `ngNoForm` and the `<form>`
 * tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
 * unnecessary because the `<form>` tags are inert. In that case, you would
 * refrain from using the `formGroup` directive.
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
 * {\@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * \@ngModule FormsModule
 */
export class NgForm extends ControlContainer {
    /**
     * @param {?} validators
     * @param {?} asyncValidators
     */
    constructor(validators, asyncValidators) {
        super();
        this.submitted = false;
        this._directives = [];
        this.ngSubmit = new EventEmitter();
        this.form =
            new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() { this._setUpdateStrategy(); }
    /**
     * @return {?}
     */
    get formDirective() { return this; }
    /**
     * @return {?}
     */
    get control() { return this.form; }
    /**
     * @return {?}
     */
    get path() { return []; }
    /**
     * @return {?}
     */
    get controls() { return this.form.controls; }
    /**
     * @param {?} dir
     * @return {?}
     */
    addControl(dir) {
        resolvedPromise.then(() => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            (/** @type {?} */ (dir)).control = /** @type {?} */ (container.registerControl(dir.name, dir.control));
            setUpControl(dir.control, dir);
            dir.control.updateValueAndValidity({ emitEvent: false });
            this._directives.push(dir);
        });
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    getControl(dir) { return /** @type {?} */ (this.form.get(dir.path)); }
    /**
     * @param {?} dir
     * @return {?}
     */
    removeControl(dir) {
        resolvedPromise.then(() => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
            removeDir(this._directives, dir);
        });
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    addFormGroup(dir) {
        resolvedPromise.then(() => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            /** @type {?} */
            const group = new FormGroup({});
            setUpFormContainer(group, dir);
            container.registerControl(dir.name, group);
            group.updateValueAndValidity({ emitEvent: false });
        });
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    removeFormGroup(dir) {
        resolvedPromise.then(() => {
            /** @type {?} */
            const container = this._findContainer(dir.path);
            if (container) {
                container.removeControl(dir.name);
            }
        });
    }
    /**
     * @param {?} dir
     * @return {?}
     */
    getFormGroup(dir) { return /** @type {?} */ (this.form.get(dir.path)); }
    /**
     * @param {?} dir
     * @param {?} value
     * @return {?}
     */
    updateModel(dir, value) {
        resolvedPromise.then(() => {
            /** @type {?} */
            const ctrl = /** @type {?} */ (this.form.get(/** @type {?} */ ((dir.path))));
            ctrl.setValue(value);
        });
    }
    /**
     * @param {?} value
     * @return {?}
     */
    setValue(value) { this.control.setValue(value); }
    /**
     * @param {?} $event
     * @return {?}
     */
    onSubmit($event) {
        (/** @type {?} */ (this)).submitted = true;
        syncPendingControls(this.form, this._directives);
        this.ngSubmit.emit($event);
        return false;
    }
    /**
     * @return {?}
     */
    onReset() { this.resetForm(); }
    /**
     * @param {?=} value
     * @return {?}
     */
    resetForm(value = undefined) {
        this.form.reset(value);
        (/** @type {?} */ (this)).submitted = false;
    }
    /**
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
        return path.length ? /** @type {?} */ (this.form.get(path)) : this.form;
    }
}
NgForm.decorators = [
    { type: Directive, args: [{
                selector: 'form:not([ngNoForm]):not([formGroup]),ngForm,ng-form,[ngForm]',
                providers: [formDirectiveProvider],
                host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                outputs: ['ngSubmit'],
                exportAs: 'ngForm'
            },] }
];
/** @nocollapse */
NgForm.ctorParameters = () => [
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_VALIDATORS,] }] },
    { type: Array, decorators: [{ type: Optional }, { type: Self }, { type: Inject, args: [NG_ASYNC_VALIDATORS,] }] }
];
NgForm.propDecorators = {
    options: [{ type: Input, args: ['ngFormOptions',] }]
};
if (false) {
    /** @type {?} */
    NgForm.prototype.submitted;
    /** @type {?} */
    NgForm.prototype._directives;
    /** @type {?} */
    NgForm.prototype.form;
    /** @type {?} */
    NgForm.prototype.ngSubmit;
    /**
     * Options for the `NgForm` instance. Accepts the following properties:
     *
     * **updateOn**: Serves as the default `updateOn` value for all child `NgModels` below it
     * (unless a child has explicitly set its own value for this in `ngModelOptions`).
     * Potential values: `'change'` | `'blur'` | `'submit'`
     *
     * ```html
     * <form [ngFormOptions]="{updateOn: 'blur'}">
     *    <input name="one" ngModel>  <!-- this ngModel will update on blur -->
     * </form>
     * ```
     *
     * @type {?}
     */
    NgForm.prototype.options;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2Zvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQWdCLFNBQVMsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVoSCxPQUFPLEVBQStCLFNBQVMsRUFBWSxNQUFNLFVBQVUsQ0FBQztBQUM1RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUUsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRWpFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBS3JELE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLG1CQUFtQixFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUVySSxhQUFhLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxnQkFBZ0I7SUFDekIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7Q0FDdEMsQ0FBQzs7QUFFRixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyRDlDLE1BQU0sT0FBTyxNQUFPLFNBQVEsZ0JBQWdCOzs7OztJQTBCMUMsWUFDK0MsVUFBaUIsRUFDWCxlQUFzQjtRQUN6RSxLQUFLLEVBQUUsQ0FBQzt5QkEzQjJCLEtBQUs7MkJBRVQsRUFBRTtRQUduQyxnQkFBVyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBdUI1QixJQUFJLENBQUMsSUFBSTtZQUNMLElBQUksU0FBUyxDQUFD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QyxJQUFjO1FBQzNCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNYLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLG1CQUFZLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2pFOzs7WUFoSUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSwrREFBK0Q7Z0JBQ3pFLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO2dCQUNsQyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQztnQkFDOUQsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNyQixRQUFRLEVBQUUsUUFBUTthQUNuQjs7Ozt3Q0E0Qk0sUUFBUSxZQUFJLElBQUksWUFBSSxNQUFNLFNBQUMsYUFBYTt3Q0FDeEMsUUFBUSxZQUFJLElBQUksWUFBSSxNQUFNLFNBQUMsbUJBQW1COzs7c0JBSmxELEtBQUssU0FBQyxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FmdGVyVmlld0luaXQsIERpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBJbmplY3QsIElucHV0LCBPcHRpb25hbCwgU2VsZiwgZm9yd2FyZFJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwLCBGb3JtSG9va3N9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0Zvcm19IGZyb20gJy4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4vbmdfY29udHJvbCc7XG5pbXBvcnQge05nTW9kZWx9IGZyb20gJy4vbmdfbW9kZWwnO1xuaW1wb3J0IHtOZ01vZGVsR3JvdXB9IGZyb20gJy4vbmdfbW9kZWxfZ3JvdXAnO1xuaW1wb3J0IHtjb21wb3NlQXN5bmNWYWxpZGF0b3JzLCBjb21wb3NlVmFsaWRhdG9ycywgcmVtb3ZlRGlyLCBzZXRVcENvbnRyb2wsIHNldFVwRm9ybUNvbnRhaW5lciwgc3luY1BlbmRpbmdDb250cm9sc30gZnJvbSAnLi9zaGFyZWQnO1xuXG5leHBvcnQgY29uc3QgZm9ybURpcmVjdGl2ZVByb3ZpZGVyOiBhbnkgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nRm9ybSlcbn07XG5cbmNvbnN0IHJlc29sdmVkUHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZShudWxsKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBDcmVhdGVzIGEgdG9wLWxldmVsIGBGb3JtR3JvdXBgIGluc3RhbmNlIGFuZCBiaW5kcyBpdCB0byBhIGZvcm1cbiAqIHRvIHRyYWNrIGFnZ3JlZ2F0ZSBmb3JtIHZhbHVlIGFuZCB2YWxpZGF0aW9uIHN0YXR1cy5cbiAqXG4gKiBBcyBzb29uIGFzIHlvdSBpbXBvcnQgdGhlIGBGb3Jtc01vZHVsZWAsIHRoaXMgZGlyZWN0aXZlIGJlY29tZXMgYWN0aXZlIGJ5IGRlZmF1bHQgb25cbiAqIGFsbCBgPGZvcm0+YCB0YWdzLiAgWW91IGRvbid0IG5lZWQgdG8gYWRkIGEgc3BlY2lhbCBzZWxlY3Rvci5cbiAqXG4gKiBZb3UgY2FuIGV4cG9ydCB0aGUgZGlyZWN0aXZlIGludG8gYSBsb2NhbCB0ZW1wbGF0ZSB2YXJpYWJsZSB1c2luZyBgbmdGb3JtYCBhcyB0aGUga2V5XG4gKiAoZXg6IGAjbXlGb3JtPVwibmdGb3JtXCJgKS4gVGhpcyBpcyBvcHRpb25hbCwgYnV0IHVzZWZ1bC4gIE1hbnkgcHJvcGVydGllcyBmcm9tIHRoZSB1bmRlcmx5aW5nXG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSBhcmUgZHVwbGljYXRlZCBvbiB0aGUgZGlyZWN0aXZlIGl0c2VsZiwgc28gYSByZWZlcmVuY2UgdG8gaXRcbiAqIHdpbGwgZ2l2ZSB5b3UgYWNjZXNzIHRvIHRoZSBhZ2dyZWdhdGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXR1cyBvZiB0aGUgZm9ybSwgYXMgd2VsbCBhc1xuICogdXNlciBpbnRlcmFjdGlvbiBwcm9wZXJ0aWVzIGxpa2UgYGRpcnR5YCBhbmQgYHRvdWNoZWRgLlxuICpcbiAqIFRvIHJlZ2lzdGVyIGNoaWxkIGNvbnRyb2xzIHdpdGggdGhlIGZvcm0sIHlvdSdsbCB3YW50IHRvIHVzZSBgTmdNb2RlbGAgd2l0aCBhXG4gKiBgbmFtZWAgYXR0cmlidXRlLiAgWW91IGNhbiBhbHNvIHVzZSBgTmdNb2RlbEdyb3VwYCBpZiB5b3UnZCBsaWtlIHRvIGNyZWF0ZVxuICogc3ViLWdyb3VwcyB3aXRoaW4gdGhlIGZvcm0uXG4gKlxuICogWW91IGNhbiBsaXN0ZW4gdG8gdGhlIGRpcmVjdGl2ZSdzIGBuZ1N1Ym1pdGAgZXZlbnQgdG8gYmUgbm90aWZpZWQgd2hlbiB0aGUgdXNlciBoYXNcbiAqIHRyaWdnZXJlZCBhIGZvcm0gc3VibWlzc2lvbi4gVGhlIGBuZ1N1Ym1pdGAgZXZlbnQgd2lsbCBiZSBlbWl0dGVkIHdpdGggdGhlIG9yaWdpbmFsIGZvcm1cbiAqIHN1Ym1pc3Npb24gZXZlbnQuXG4gKlxuICogSW4gdGVtcGxhdGUgZHJpdmVuIGZvcm1zLCBhbGwgYDxmb3JtPmAgdGFncyBhcmUgYXV0b21hdGljYWxseSB0YWdnZWQgYXMgYE5nRm9ybWAuXG4gKiBJZiB5b3Ugd2FudCB0byBpbXBvcnQgdGhlIGBGb3Jtc01vZHVsZWAgYnV0IHNraXAgaXRzIHVzYWdlIGluIHNvbWUgZm9ybXMsXG4gKiBmb3IgZXhhbXBsZSwgdG8gdXNlIG5hdGl2ZSBIVE1MNSB2YWxpZGF0aW9uLCB5b3UgY2FuIGFkZCBgbmdOb0Zvcm1gIGFuZCB0aGUgYDxmb3JtPmBcbiAqIHRhZ3Mgd29uJ3QgY3JlYXRlIGFuIGBOZ0Zvcm1gIGRpcmVjdGl2ZS4gSW4gcmVhY3RpdmUgZm9ybXMsIHVzaW5nIGBuZ05vRm9ybWAgaXNcbiAqIHVubmVjZXNzYXJ5IGJlY2F1c2UgdGhlIGA8Zm9ybT5gIHRhZ3MgYXJlIGluZXJ0LiBJbiB0aGF0IGNhc2UsIHlvdSB3b3VsZFxuICogcmVmcmFpbiBmcm9tIHVzaW5nIHRoZSBgZm9ybUdyb3VwYCBkaXJlY3RpdmUuXG4gKlxuICogU3VwcG9ydCBmb3IgdXNpbmcgYG5nRm9ybWAgZWxlbWVudCBzZWxlY3RvciBoYXMgYmVlbiBkZXByZWNhdGVkIGluIEFuZ3VsYXIgdjYgYW5kIHdpbGwgYmUgcmVtb3ZlZFxuICogaW4gQW5ndWxhciB2OS5cbiAqXG4gKiBUaGlzIGhhcyBiZWVuIGRlcHJlY2F0ZWQgdG8ga2VlcCBzZWxlY3RvcnMgY29uc2lzdGVudCB3aXRoIG90aGVyIGNvcmUgQW5ndWxhciBzZWxlY3RvcnMsXG4gKiBhcyBlbGVtZW50IHNlbGVjdG9ycyBhcmUgdHlwaWNhbGx5IHdyaXR0ZW4gaW4ga2ViYWItY2FzZS5cbiAqXG4gKiBOb3cgZGVwcmVjYXRlZDpcbiAqIGBgYGh0bWxcbiAqIDxuZ0Zvcm0gI215Rm9ybT1cIm5nRm9ybVwiPlxuICogYGBgXG4gKlxuICogQWZ0ZXI6XG4gKiBgYGBodG1sXG4gKiA8bmctZm9ybSAjbXlGb3JtPVwibmdGb3JtXCI+XG4gKiBgYGBcbiAqXG4gKiB7QGV4YW1wbGUgZm9ybXMvdHMvc2ltcGxlRm9ybS9zaW1wbGVfZm9ybV9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgRm9ybXNNb2R1bGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZm9ybTpub3QoW25nTm9Gb3JtXSk6bm90KFtmb3JtR3JvdXBdKSxuZ0Zvcm0sbmctZm9ybSxbbmdGb3JtXScsXG4gIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gIGhvc3Q6IHsnKHN1Ym1pdCknOiAnb25TdWJtaXQoJGV2ZW50KScsICcocmVzZXQpJzogJ29uUmVzZXQoKSd9LFxuICBvdXRwdXRzOiBbJ25nU3VibWl0J10sXG4gIGV4cG9ydEFzOiAnbmdGb3JtJ1xufSlcbmV4cG9ydCBjbGFzcyBOZ0Zvcm0gZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgRm9ybSxcbiAgICBBZnRlclZpZXdJbml0IHtcbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX2RpcmVjdGl2ZXM6IE5nTW9kZWxbXSA9IFtdO1xuXG4gIGZvcm06IEZvcm1Hcm91cDtcbiAgbmdTdWJtaXQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIHRoZSBgTmdGb3JtYCBpbnN0YW5jZS4gQWNjZXB0cyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAqXG4gICAqICoqdXBkYXRlT24qKjogU2VydmVzIGFzIHRoZSBkZWZhdWx0IGB1cGRhdGVPbmAgdmFsdWUgZm9yIGFsbCBjaGlsZCBgTmdNb2RlbHNgIGJlbG93IGl0XG4gICAqICh1bmxlc3MgYSBjaGlsZCBoYXMgZXhwbGljaXRseSBzZXQgaXRzIG93biB2YWx1ZSBmb3IgdGhpcyBpbiBgbmdNb2RlbE9wdGlvbnNgKS5cbiAgICogUG90ZW50aWFsIHZhbHVlczogYCdjaGFuZ2UnYCB8IGAnYmx1cidgIHwgYCdzdWJtaXQnYFxuICAgKlxuICAgKiBgYGBodG1sXG4gICAqIDxmb3JtIFtuZ0Zvcm1PcHRpb25zXT1cInt1cGRhdGVPbjogJ2JsdXInfVwiPlxuICAgKiAgICA8aW5wdXQgbmFtZT1cIm9uZVwiIG5nTW9kZWw+ICA8IS0tIHRoaXMgbmdNb2RlbCB3aWxsIHVwZGF0ZSBvbiBibHVyIC0tPlxuICAgKiA8L2Zvcm0+XG4gICAqIGBgYFxuICAgKlxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIEBJbnB1dCgnbmdGb3JtT3B0aW9ucycpIG9wdGlvbnMgIToge3VwZGF0ZU9uPzogRm9ybUhvb2tzfTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSB2YWxpZGF0b3JzOiBhbnlbXSxcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19BU1lOQ19WQUxJREFUT1JTKSBhc3luY1ZhbGlkYXRvcnM6IGFueVtdKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmZvcm0gPVxuICAgICAgICBuZXcgRm9ybUdyb3VwKHt9LCBjb21wb3NlVmFsaWRhdG9ycyh2YWxpZGF0b3JzKSwgY29tcG9zZUFzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvcnMpKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHsgdGhpcy5fc2V0VXBkYXRlU3RyYXRlZ3koKTsgfVxuXG4gIGdldCBmb3JtRGlyZWN0aXZlKCk6IEZvcm0geyByZXR1cm4gdGhpczsgfVxuXG4gIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7IHJldHVybiB0aGlzLmZvcm07IH1cblxuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7IHJldHVybiBbXTsgfVxuXG4gIGdldCBjb250cm9scygpOiB7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sfSB7IHJldHVybiB0aGlzLmZvcm0uY29udHJvbHM7IH1cblxuICBhZGRDb250cm9sKGRpcjogTmdNb2RlbCk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuX2ZpbmRDb250YWluZXIoZGlyLnBhdGgpO1xuICAgICAgKGRpciBhc3tjb250cm9sOiBGb3JtQ29udHJvbH0pLmNvbnRyb2wgPVxuICAgICAgICAgIDxGb3JtQ29udHJvbD5jb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBkaXIuY29udHJvbCk7XG4gICAgICBzZXRVcENvbnRyb2woZGlyLmNvbnRyb2wsIGRpcik7XG4gICAgICBkaXIuY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgICB0aGlzLl9kaXJlY3RpdmVzLnB1c2goZGlyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldENvbnRyb2woZGlyOiBOZ01vZGVsKTogRm9ybUNvbnRyb2wgeyByZXR1cm4gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpOyB9XG5cbiAgcmVtb3ZlQ29udHJvbChkaXI6IE5nTW9kZWwpOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNvbnRyb2woZGlyLm5hbWUpO1xuICAgICAgfVxuICAgICAgcmVtb3ZlRGlyPE5nTW9kZWw+KHRoaXMuX2RpcmVjdGl2ZXMsIGRpcik7XG4gICAgfSk7XG4gIH1cblxuICBhZGRGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGNvbnN0IGdyb3VwID0gbmV3IEZvcm1Hcm91cCh7fSk7XG4gICAgICBzZXRVcEZvcm1Db250YWluZXIoZ3JvdXAsIGRpcik7XG4gICAgICBjb250YWluZXIucmVnaXN0ZXJDb250cm9sKGRpci5uYW1lLCBncm91cCk7XG4gICAgICBncm91cC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgfSk7XG4gIH1cblxuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBOZ01vZGVsR3JvdXApOiB2b2lkIHtcbiAgICByZXNvbHZlZFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLl9maW5kQ29udGFpbmVyKGRpci5wYXRoKTtcbiAgICAgIGlmIChjb250YWluZXIpIHtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUNvbnRyb2woZGlyLm5hbWUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0Rm9ybUdyb3VwKGRpcjogTmdNb2RlbEdyb3VwKTogRm9ybUdyb3VwIHsgcmV0dXJuIDxGb3JtR3JvdXA+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7IH1cblxuICB1cGRhdGVNb2RlbChkaXI6IE5nQ29udHJvbCwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIHJlc29sdmVkUHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgIGNvbnN0IGN0cmwgPSA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCAhKTtcbiAgICAgIGN0cmwuc2V0VmFsdWUodmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0VmFsdWUodmFsdWU6IHtba2V5OiBzdHJpbmddOiBhbnl9KTogdm9pZCB7IHRoaXMuY29udHJvbC5zZXRWYWx1ZSh2YWx1ZSk7IH1cblxuICBvblN1Ym1pdCgkZXZlbnQ6IEV2ZW50KTogYm9vbGVhbiB7XG4gICAgKHRoaXMgYXN7c3VibWl0dGVkOiBib29sZWFufSkuc3VibWl0dGVkID0gdHJ1ZTtcbiAgICBzeW5jUGVuZGluZ0NvbnRyb2xzKHRoaXMuZm9ybSwgdGhpcy5fZGlyZWN0aXZlcyk7XG4gICAgdGhpcy5uZ1N1Ym1pdC5lbWl0KCRldmVudCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb25SZXNldCgpOiB2b2lkIHsgdGhpcy5yZXNldEZvcm0oKTsgfVxuXG4gIHJlc2V0Rm9ybSh2YWx1ZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtLnJlc2V0KHZhbHVlKTtcbiAgICAodGhpcyBhc3tzdWJtaXR0ZWQ6IGJvb2xlYW59KS5zdWJtaXR0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFVwZGF0ZVN0cmF0ZWd5KCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnVwZGF0ZU9uICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZm9ybS5fdXBkYXRlT24gPSB0aGlzLm9wdGlvbnMudXBkYXRlT247XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfZmluZENvbnRhaW5lcihwYXRoOiBzdHJpbmdbXSk6IEZvcm1Hcm91cCB7XG4gICAgcGF0aC5wb3AoKTtcbiAgICByZXR1cm4gcGF0aC5sZW5ndGggPyA8Rm9ybUdyb3VwPnRoaXMuZm9ybS5nZXQocGF0aCkgOiB0aGlzLmZvcm07XG4gIH1cbn1cbiJdfQ==