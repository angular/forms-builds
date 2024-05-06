/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Output, Self, } from '@angular/core';
import { isFormControl } from '../../model/form_control';
import { FormGroup } from '../../model/form_group';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { ControlContainer } from '../control_container';
import { missingFormException } from '../reactive_errors';
import { CALL_SET_DISABLED_STATE, cleanUpControl, cleanUpFormContainer, cleanUpValidators, removeListItem, setUpControl, setUpFormContainer, setUpValidators, syncPendingControls, } from '../shared';
import * as i0 from "@angular/core";
const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupDirective),
};
/**
 * @description
 *
 * Binds an existing `FormGroup` or `FormRecord` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`/`FormRecord`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/forms/reactive-forms)
 * @see {@link AbstractControl}
 *
 * @usageNotes
 * ### Register Form Group
 *
 * The following example registers a `FormGroup` with first name and last name controls,
 * and listens for the *ngSubmit* event when the button is clicked.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export class FormGroupDirective extends ControlContainer {
    constructor(validators, asyncValidators, callSetDisabledState) {
        super();
        this.callSetDisabledState = callSetDisabledState;
        /**
         * @description
         * Reports whether the form submission has been triggered.
         */
        this.submitted = false;
        /**
         * Callback that should be invoked when controls in FormGroup or FormArray collection change
         * (added or removed). This callback triggers corresponding DOM updates.
         */
        this._onCollectionChange = () => this._updateDomValue();
        /**
         * @description
         * Tracks the list of added `FormControlName` instances
         */
        this.directives = [];
        /**
         * @description
         * Tracks the `FormGroup` bound to this directive.
         */
        this.form = null;
        /**
         * @description
         * Emits an event when the form submission has been triggered.
         */
        this.ngSubmit = new EventEmitter();
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
    }
    /** @nodoc */
    ngOnChanges(changes) {
        this._checkFormPresent();
        if (changes.hasOwnProperty('form')) {
            this._updateValidators();
            this._updateDomValue();
            this._updateRegistrations();
            this._oldForm = this.form;
        }
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.form) {
            cleanUpValidators(this.form, this);
            // Currently the `onCollectionChange` callback is rewritten each time the
            // `_registerOnCollectionChange` function is invoked. The implication is that cleanup should
            // happen *only* when the `onCollectionChange` callback was set by this directive instance.
            // Otherwise it might cause overriding a callback of some other directive instances. We should
            // consider updating this logic later to make it similar to how `onChange` callbacks are
            // handled, see https://github.com/angular/angular/issues/39732 for additional info.
            if (this.form._onCollectionChange === this._onCollectionChange) {
                this.form._registerOnCollectionChange(() => { });
            }
        }
    }
    /**
     * @description
     * Returns this directive's instance.
     */
    get formDirective() {
        return this;
    }
    /**
     * @description
     * Returns the `FormGroup` bound to this directive.
     */
    get control() {
        return this.form;
    }
    /**
     * @description
     * Returns an array representing the path to this group. Because this directive
     * always lives at the top level of a form, it always an empty array.
     */
    get path() {
        return [];
    }
    /**
     * @description
     * Method that sets up the control directive in this group, re-calculates its value
     * and validity, and adds the instance to the internal list of directives.
     *
     * @param dir The `FormControlName` directive instance.
     */
    addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir, this.callSetDisabledState);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
    }
    /**
     * @description
     * Retrieves the `FormControl` instance from the provided `FormControlName` directive
     *
     * @param dir The `FormControlName` directive instance.
     */
    getControl(dir) {
        return this.form.get(dir.path);
    }
    /**
     * @description
     * Removes the `FormControlName` instance from the internal list of directives
     *
     * @param dir The `FormControlName` directive instance.
     */
    removeControl(dir) {
        cleanUpControl(dir.control || null, dir, /* validateControlPresenceOnChange */ false);
        removeListItem(this.directives, dir);
    }
    /**
     * Adds a new `FormGroupName` directive instance to the form.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    addFormGroup(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormGroupName` directive instance.
     */
    removeFormGroup(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
     *
     * @param dir The `FormGroupName` directive instance.
     */
    getFormGroup(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    addFormArray(dir) {
        this._setUpFormContainer(dir);
    }
    /**
     * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
     * view.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    removeFormArray(dir) {
        this._cleanUpFormContainer(dir);
    }
    /**
     * @description
     * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
     *
     * @param dir The `FormArrayName` directive instance.
     */
    getFormArray(dir) {
        return this.form.get(dir.path);
    }
    /**
     * Sets the new value for the provided `FormControlName` directive.
     *
     * @param dir The `FormControlName` directive instance.
     * @param value The new value for the directive's control.
     */
    updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
    }
    /**
     * @description
     * Method called with the "submit" event is triggered on the form.
     * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
     *
     * @param $event The "submit" event object
     */
    onSubmit($event) {
        this.submitted = true;
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        // Forms with `method="dialog"` have some special behavior that won't reload the page and that
        // shouldn't be prevented. Note that we need to null check the `event` and the `target`, because
        // some internal apps call this method directly with the wrong arguments.
        return $event?.target?.method === 'dialog';
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
    /** @internal */
    _updateDomValue() {
        this.directives.forEach((dir) => {
            const oldCtrl = dir.control;
            const newCtrl = this.form.get(dir.path);
            if (oldCtrl !== newCtrl) {
                // Note: the value of the `dir.control` may not be defined, for example when it's a first
                // `FormControl` that is added to a `FormGroup` instance (via `addControl` call).
                cleanUpControl(oldCtrl || null, dir);
                // Check whether new control at the same location inside the corresponding `FormGroup` is an
                // instance of `FormControl` and perform control setup only if that's the case.
                // Note: we don't need to clear the list of directives (`this.directives`) here, it would be
                // taken care of in the `removeControl` method invoked when corresponding `formControlName`
                // directive instance is being removed (invoked from `FormControlName.ngOnDestroy`).
                if (isFormControl(newCtrl)) {
                    setUpControl(newCtrl, dir, this.callSetDisabledState);
                    dir.control = newCtrl;
                }
            }
        });
        this.form._updateTreeValidity({ emitEvent: false });
    }
    _setUpFormContainer(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        // NOTE: this operation looks unnecessary in case no new validators were added in
        // `setUpFormContainer` call. Consider updating this code to match the logic in
        // `_cleanUpFormContainer` function.
        ctrl.updateValueAndValidity({ emitEvent: false });
    }
    _cleanUpFormContainer(dir) {
        if (this.form) {
            const ctrl = this.form.get(dir.path);
            if (ctrl) {
                const isControlUpdated = cleanUpFormContainer(ctrl, dir);
                if (isControlUpdated) {
                    // Run validity check only in case a control was updated (i.e. view validators were
                    // removed) as removing view validators might cause validity to change.
                    ctrl.updateValueAndValidity({ emitEvent: false });
                }
            }
        }
    }
    _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange);
        if (this._oldForm) {
            this._oldForm._registerOnCollectionChange(() => { });
        }
    }
    _updateValidators() {
        setUpValidators(this.form, this);
        if (this._oldForm) {
            cleanUpValidators(this._oldForm, this);
        }
    }
    _checkFormPresent() {
        if (!this.form && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw missingFormException();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0-next.0+sha-aea3b57", ngImport: i0, type: FormGroupDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.1.0-next.0+sha-aea3b57", type: FormGroupDirective, selector: "[formGroup]", inputs: { form: ["formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0-next.0+sha-aea3b57", ngImport: i0, type: FormGroupDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[formGroup]',
                    providers: [formDirectiveProvider],
                    host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
                    exportAs: 'ngForm',
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
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
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [CALL_SET_DISABLED_STATE]
                }] }], propDecorators: { form: [{
                type: Input,
                args: ['formGroup']
            }], ngSubmit: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUdMLFFBQVEsRUFDUixNQUFNLEVBRU4sSUFBSSxHQUdMLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBYyxhQUFhLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXRELE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3hELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsY0FBYyxFQUNkLG9CQUFvQixFQUNwQixpQkFBaUIsRUFDakIsY0FBYyxFQUVkLFlBQVksRUFDWixrQkFBa0IsRUFDbEIsZUFBZSxFQUNmLG1CQUFtQixHQUNwQixNQUFNLFdBQVcsQ0FBQzs7QUFNbkIsTUFBTSxxQkFBcUIsR0FBYTtJQUN0QyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7Q0FDbEQsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQU9ILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFxQ3RELFlBQzZDLFVBQXVDLEVBSWxGLGVBQXNELEVB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bGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFByb3ZpZGVyLFxuICBTZWxmLFxuICBTaW1wbGVDaGFuZ2VzLFxuICDJtVdyaXRhYmxlIGFzIFdyaXRhYmxlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtQXJyYXl9IGZyb20gJy4uLy4uL21vZGVsL2Zvcm1fYXJyYXknO1xuaW1wb3J0IHtGb3JtQ29udHJvbCwgaXNGb3JtQ29udHJvbH0gZnJvbSAnLi4vLi4vbW9kZWwvZm9ybV9jb250cm9sJztcbmltcG9ydCB7Rm9ybUdyb3VwfSBmcm9tICcuLi8uLi9tb2RlbC9mb3JtX2dyb3VwJztcbmltcG9ydCB7TkdfQVNZTkNfVkFMSURBVE9SUywgTkdfVkFMSURBVE9SU30gZnJvbSAnLi4vLi4vdmFsaWRhdG9ycyc7XG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4uL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Rm9ybX0gZnJvbSAnLi4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHttaXNzaW5nRm9ybUV4Y2VwdGlvbn0gZnJvbSAnLi4vcmVhY3RpdmVfZXJyb3JzJztcbmltcG9ydCB7XG4gIENBTExfU0VUX0RJU0FCTEVEX1NUQVRFLFxuICBjbGVhblVwQ29udHJvbCxcbiAgY2xlYW5VcEZvcm1Db250YWluZXIsXG4gIGNsZWFuVXBWYWxpZGF0b3JzLFxuICByZW1vdmVMaXN0SXRlbSxcbiAgU2V0RGlzYWJsZWRTdGF0ZU9wdGlvbixcbiAgc2V0VXBDb250cm9sLFxuICBzZXRVcEZvcm1Db250YWluZXIsXG4gIHNldFVwVmFsaWRhdG9ycyxcbiAgc3luY1BlbmRpbmdDb250cm9scyxcbn0gZnJvbSAnLi4vc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9mb3JtX2NvbnRyb2xfbmFtZSc7XG5pbXBvcnQge0Zvcm1BcnJheU5hbWUsIEZvcm1Hcm91cE5hbWV9IGZyb20gJy4vZm9ybV9ncm91cF9uYW1lJztcblxuY29uc3QgZm9ybURpcmVjdGl2ZVByb3ZpZGVyOiBQcm92aWRlciA9IHtcbiAgcHJvdmlkZTogQ29udHJvbENvbnRhaW5lcixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRm9ybUdyb3VwRGlyZWN0aXZlKSxcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQmluZHMgYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgb3IgYEZvcm1SZWNvcmRgIHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVGhpcyBkaXJlY3RpdmUgYWNjZXB0cyBhbiBleGlzdGluZyBgRm9ybUdyb3VwYCBpbnN0YW5jZS4gSXQgd2lsbCB0aGVuIHVzZSB0aGlzXG4gKiBgRm9ybUdyb3VwYCBpbnN0YW5jZSB0byBtYXRjaCBhbnkgY2hpbGQgYEZvcm1Db250cm9sYCwgYEZvcm1Hcm91cGAvYEZvcm1SZWNvcmRgLFxuICogYW5kIGBGb3JtQXJyYXlgIGluc3RhbmNlcyB0byBjaGlsZCBgRm9ybUNvbnRyb2xOYW1lYCwgYEZvcm1Hcm91cE5hbWVgLFxuICogYW5kIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEBzZWUgW1JlYWN0aXZlIEZvcm1zIEd1aWRlXShndWlkZS9mb3Jtcy9yZWFjdGl2ZS1mb3JtcylcbiAqIEBzZWUge0BsaW5rIEFic3RyYWN0Q29udHJvbH1cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogIyMjIFJlZ2lzdGVyIEZvcm0gR3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgYEZvcm1Hcm91cGAgd2l0aCBmaXJzdCBuYW1lIGFuZCBsYXN0IG5hbWUgY29udHJvbHMsXG4gKiBhbmQgbGlzdGVucyBmb3IgdGhlICpuZ1N1Ym1pdCogZXZlbnQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZm9ybUdyb3VwXScsXG4gIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gIGhvc3Q6IHsnKHN1Ym1pdCknOiAnb25TdWJtaXQoJGV2ZW50KScsICcocmVzZXQpJzogJ29uUmVzZXQoKSd9LFxuICBleHBvcnRBczogJ25nRm9ybScsXG59KVxuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cERpcmVjdGl2ZSBleHRlbmRzIENvbnRyb2xDb250YWluZXIgaW1wbGVtZW50cyBGb3JtLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVwb3J0cyB3aGV0aGVyIHRoZSBmb3JtIHN1Ym1pc3Npb24gaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN1Ym1pdHRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gYW4gb2xkIGZvcm0gZ3JvdXAgaW5wdXQgdmFsdWUsIHdoaWNoIGlzIG5lZWRlZCB0byBjbGVhbnVwIG9sZCBpbnN0YW5jZSBpbiBjYXNlIGl0XG4gICAqIHdhcyByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS5cbiAgICovXG4gIHByaXZhdGUgX29sZEZvcm06IEZvcm1Hcm91cCB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgaW52b2tlZCB3aGVuIGNvbnRyb2xzIGluIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgY29sbGVjdGlvbiBjaGFuZ2VcbiAgICogKGFkZGVkIG9yIHJlbW92ZWQpLiBUaGlzIGNhbGxiYWNrIHRyaWdnZXJzIGNvcnJlc3BvbmRpbmcgRE9NIHVwZGF0ZXMuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB0aGlzLl91cGRhdGVEb21WYWx1ZSgpO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBsaXN0IG9mIGFkZGVkIGBGb3JtQ29udHJvbE5hbWVgIGluc3RhbmNlc1xuICAgKi9cbiAgZGlyZWN0aXZlczogRm9ybUNvbnRyb2xOYW1lW10gPSBbXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoJ2Zvcm1Hcm91cCcpIGZvcm06IEZvcm1Hcm91cCA9IG51bGwhO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgZm9ybSBzdWJtaXNzaW9uIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICovXG4gIEBPdXRwdXQoKSBuZ1N1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfVkFMSURBVE9SUykgdmFsaWRhdG9yczogKFZhbGlkYXRvciB8IFZhbGlkYXRvckZuKVtdLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQFNlbGYoKVxuICAgIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUylcbiAgICBhc3luY1ZhbGlkYXRvcnM6IChBc3luY1ZhbGlkYXRvciB8IEFzeW5jVmFsaWRhdG9yRm4pW10sXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KENBTExfU0VUX0RJU0FCTEVEX1NUQVRFKVxuICAgIHByaXZhdGUgY2FsbFNldERpc2FibGVkU3RhdGU/OiBTZXREaXNhYmxlZFN0YXRlT3B0aW9uLFxuICApIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0Zvcm1QcmVzZW50KCk7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Zvcm0nKSkge1xuICAgICAgdGhpcy5fdXBkYXRlVmFsaWRhdG9ycygpO1xuICAgICAgdGhpcy5fdXBkYXRlRG9tVmFsdWUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKTtcbiAgICAgIHRoaXMuX29sZEZvcm0gPSB0aGlzLmZvcm07XG4gICAgfVxuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICBjbGVhblVwVmFsaWRhdG9ycyh0aGlzLmZvcm0sIHRoaXMpO1xuXG4gICAgICAvLyBDdXJyZW50bHkgdGhlIGBvbkNvbGxlY3Rpb25DaGFuZ2VgIGNhbGxiYWNrIGlzIHJld3JpdHRlbiBlYWNoIHRpbWUgdGhlXG4gICAgICAvLyBgX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlYCBmdW5jdGlvbiBpcyBpbnZva2VkLiBUaGUgaW1wbGljYXRpb24gaXMgdGhhdCBjbGVhbnVwIHNob3VsZFxuICAgICAgLy8gaGFwcGVuICpvbmx5KiB3aGVuIHRoZSBgb25Db2xsZWN0aW9uQ2hhbmdlYCBjYWxsYmFjayB3YXMgc2V0IGJ5IHRoaXMgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgICAgLy8gT3RoZXJ3aXNlIGl0IG1pZ2h0IGNhdXNlIG92ZXJyaWRpbmcgYSBjYWxsYmFjayBvZiBzb21lIG90aGVyIGRpcmVjdGl2ZSBpbnN0YW5jZXMuIFdlIHNob3VsZFxuICAgICAgLy8gY29uc2lkZXIgdXBkYXRpbmcgdGhpcyBsb2dpYyBsYXRlciB0byBtYWtlIGl0IHNpbWlsYXIgdG8gaG93IGBvbkNoYW5nZWAgY2FsbGJhY2tzIGFyZVxuICAgICAgLy8gaGFuZGxlZCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzM5NzMyIGZvciBhZGRpdGlvbmFsIGluZm8uXG4gICAgICBpZiAodGhpcy5mb3JtLl9vbkNvbGxlY3Rpb25DaGFuZ2UgPT09IHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSkge1xuICAgICAgICB0aGlzLmZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgdGhpcyBkaXJlY3RpdmUncyBpbnN0YW5jZS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBmb3JtRGlyZWN0aXZlKCk6IEZvcm0ge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIHRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyBhbiBhcnJheSByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhpcyBncm91cC4gQmVjYXVzZSB0aGlzIGRpcmVjdGl2ZVxuICAgKiBhbHdheXMgbGl2ZXMgYXQgdGhlIHRvcCBsZXZlbCBvZiBhIGZvcm0sIGl0IGFsd2F5cyBhbiBlbXB0eSBhcnJheS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIE1ldGhvZCB0aGF0IHNldHMgdXAgdGhlIGNvbnRyb2wgZGlyZWN0aXZlIGluIHRoaXMgZ3JvdXAsIHJlLWNhbGN1bGF0ZXMgaXRzIHZhbHVlXG4gICAqIGFuZCB2YWxpZGl0eSwgYW5kIGFkZHMgdGhlIGluc3RhbmNlIHRvIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGFkZENvbnRyb2woZGlyOiBGb3JtQ29udHJvbE5hbWUpOiBGb3JtQ29udHJvbCB7XG4gICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgc2V0VXBDb250cm9sKGN0cmwsIGRpciwgdGhpcy5jYWxsU2V0RGlzYWJsZWRTdGF0ZSk7XG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgdGhpcy5kaXJlY3RpdmVzLnB1c2goZGlyKTtcbiAgICByZXR1cm4gY3RybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUNvbnRyb2xgIGluc3RhbmNlIGZyb20gdGhlIHByb3ZpZGVkIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZVxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogRm9ybUNvbnRyb2wge1xuICAgIHJldHVybiA8Rm9ybUNvbnRyb2w+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlbW92ZXMgdGhlIGBGb3JtQ29udHJvbE5hbWVgIGluc3RhbmNlIGZyb20gdGhlIGludGVybmFsIGxpc3Qgb2YgZGlyZWN0aXZlc1xuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogdm9pZCB7XG4gICAgY2xlYW5VcENvbnRyb2woZGlyLmNvbnRyb2wgfHwgbnVsbCwgZGlyLCAvKiB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICovIGZhbHNlKTtcbiAgICByZW1vdmVMaXN0SXRlbSh0aGlzLmRpcmVjdGl2ZXMsIGRpcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG5ldyBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIHRvIHRoZSBmb3JtLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkRm9ybUdyb3VwKGRpcjogRm9ybUdyb3VwTmFtZSk6IHZvaWQge1xuICAgIHRoaXMuX3NldFVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgY2xlYW51cCB3aGVuIGEgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAqIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogdm9pZCB7XG4gICAgdGhpcy5fY2xlYW5VcEZvcm1Db250YWluZXIoZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUdyb3VwYCBmb3IgYSBwcm92aWRlZCBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBnZXRGb3JtR3JvdXAoZGlyOiBGb3JtR3JvdXBOYW1lKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gPEZvcm1Hcm91cD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyB0aGUgbmVjZXNzYXJ5IHNldHVwIHdoZW4gYSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlIGlzIGFkZGVkIHRvIHRoZSB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgYWRkRm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IHZvaWQge1xuICAgIHRoaXMuX3NldFVwRm9ybUNvbnRhaW5lcihkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIHRoZSBuZWNlc3NhcnkgY2xlYW51cCB3aGVuIGEgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyByZW1vdmVkIGZyb20gdGhlXG4gICAqIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICByZW1vdmVGb3JtQXJyYXkoZGlyOiBGb3JtQXJyYXlOYW1lKTogdm9pZCB7XG4gICAgdGhpcy5fY2xlYW5VcEZvcm1Db250YWluZXIoZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0cmlldmVzIHRoZSBgRm9ybUFycmF5YCBmb3IgYSBwcm92aWRlZCBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0Rm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IEZvcm1BcnJheSB7XG4gICAgcmV0dXJuIDxGb3JtQXJyYXk+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgbmV3IHZhbHVlIGZvciB0aGUgcHJvdmlkZWQgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZGlyZWN0aXZlJ3MgY29udHJvbC5cbiAgICovXG4gIHVwZGF0ZU1vZGVsKGRpcjogRm9ybUNvbnRyb2xOYW1lLCB2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgY3RybCA9IDxGb3JtQ29udHJvbD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBjdHJsLnNldFZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIGNhbGxlZCB3aXRoIHRoZSBcInN1Ym1pdFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICogVHJpZ2dlcnMgdGhlIGBuZ1N1Ym1pdGAgZW1pdHRlciB0byBlbWl0IHRoZSBcInN1Ym1pdFwiIGV2ZW50IGFzIGl0cyBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0gJGV2ZW50IFRoZSBcInN1Ym1pdFwiIGV2ZW50IG9iamVjdFxuICAgKi9cbiAgb25TdWJtaXQoJGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuICAgICh0aGlzIGFzIFdyaXRhYmxlPHRoaXM+KS5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgIHN5bmNQZW5kaW5nQ29udHJvbHModGhpcy5mb3JtLCB0aGlzLmRpcmVjdGl2ZXMpO1xuICAgIHRoaXMubmdTdWJtaXQuZW1pdCgkZXZlbnQpO1xuICAgIC8vIEZvcm1zIHdpdGggYG1ldGhvZD1cImRpYWxvZ1wiYCBoYXZlIHNvbWUgc3BlY2lhbCBiZWhhdmlvciB0aGF0IHdvbid0IHJlbG9hZCB0aGUgcGFnZSBhbmQgdGhhdFxuICAgIC8vIHNob3VsZG4ndCBiZSBwcmV2ZW50ZWQuIE5vdGUgdGhhdCB3ZSBuZWVkIHRvIG51bGwgY2hlY2sgdGhlIGBldmVudGAgYW5kIHRoZSBgdGFyZ2V0YCwgYmVjYXVzZVxuICAgIC8vIHNvbWUgaW50ZXJuYWwgYXBwcyBjYWxsIHRoaXMgbWV0aG9kIGRpcmVjdGx5IHdpdGggdGhlIHdyb25nIGFyZ3VtZW50cy5cbiAgICByZXR1cm4gKCRldmVudD8udGFyZ2V0IGFzIEhUTUxGb3JtRWxlbWVudCB8IG51bGwpPy5tZXRob2QgPT09ICdkaWFsb2cnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIFwicmVzZXRcIiBldmVudCBpcyB0cmlnZ2VyZWQgb24gdGhlIGZvcm0uXG4gICAqL1xuICBvblJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMucmVzZXRGb3JtKCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlc2V0cyB0aGUgZm9ybSB0byBhbiBpbml0aWFsIHZhbHVlIGFuZCByZXNldHMgaXRzIHN1Ym1pdHRlZCBzdGF0dXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgZm9ybS5cbiAgICovXG4gIHJlc2V0Rm9ybSh2YWx1ZTogYW55ID0gdW5kZWZpbmVkKTogdm9pZCB7XG4gICAgdGhpcy5mb3JtLnJlc2V0KHZhbHVlKTtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikuc3VibWl0dGVkID0gZmFsc2U7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVEb21WYWx1ZSgpIHtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaCgoZGlyKSA9PiB7XG4gICAgICBjb25zdCBvbGRDdHJsID0gZGlyLmNvbnRyb2w7XG4gICAgICBjb25zdCBuZXdDdHJsID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICBpZiAob2xkQ3RybCAhPT0gbmV3Q3RybCkge1xuICAgICAgICAvLyBOb3RlOiB0aGUgdmFsdWUgb2YgdGhlIGBkaXIuY29udHJvbGAgbWF5IG5vdCBiZSBkZWZpbmVkLCBmb3IgZXhhbXBsZSB3aGVuIGl0J3MgYSBmaXJzdFxuICAgICAgICAvLyBgRm9ybUNvbnRyb2xgIHRoYXQgaXMgYWRkZWQgdG8gYSBgRm9ybUdyb3VwYCBpbnN0YW5jZSAodmlhIGBhZGRDb250cm9sYCBjYWxsKS5cbiAgICAgICAgY2xlYW5VcENvbnRyb2wob2xkQ3RybCB8fCBudWxsLCBkaXIpO1xuXG4gICAgICAgIC8vIENoZWNrIHdoZXRoZXIgbmV3IGNvbnRyb2wgYXQgdGhlIHNhbWUgbG9jYXRpb24gaW5zaWRlIHRoZSBjb3JyZXNwb25kaW5nIGBGb3JtR3JvdXBgIGlzIGFuXG4gICAgICAgIC8vIGluc3RhbmNlIG9mIGBGb3JtQ29udHJvbGAgYW5kIHBlcmZvcm0gY29udHJvbCBzZXR1cCBvbmx5IGlmIHRoYXQncyB0aGUgY2FzZS5cbiAgICAgICAgLy8gTm90ZTogd2UgZG9uJ3QgbmVlZCB0byBjbGVhciB0aGUgbGlzdCBvZiBkaXJlY3RpdmVzIChgdGhpcy5kaXJlY3RpdmVzYCkgaGVyZSwgaXQgd291bGQgYmVcbiAgICAgICAgLy8gdGFrZW4gY2FyZSBvZiBpbiB0aGUgYHJlbW92ZUNvbnRyb2xgIG1ldGhvZCBpbnZva2VkIHdoZW4gY29ycmVzcG9uZGluZyBgZm9ybUNvbnRyb2xOYW1lYFxuICAgICAgICAvLyBkaXJlY3RpdmUgaW5zdGFuY2UgaXMgYmVpbmcgcmVtb3ZlZCAoaW52b2tlZCBmcm9tIGBGb3JtQ29udHJvbE5hbWUubmdPbkRlc3Ryb3lgKS5cbiAgICAgICAgaWYgKGlzRm9ybUNvbnRyb2wobmV3Q3RybCkpIHtcbiAgICAgICAgICBzZXRVcENvbnRyb2wobmV3Q3RybCwgZGlyLCB0aGlzLmNhbGxTZXREaXNhYmxlZFN0YXRlKTtcbiAgICAgICAgICAoZGlyIGFzIFdyaXRhYmxlPEZvcm1Db250cm9sTmFtZT4pLmNvbnRyb2wgPSBuZXdDdHJsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmZvcm0uX3VwZGF0ZVRyZWVWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VXBGb3JtQ29udGFpbmVyKGRpcjogRm9ybUFycmF5TmFtZSB8IEZvcm1Hcm91cE5hbWUpOiB2b2lkIHtcbiAgICBjb25zdCBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBzZXRVcEZvcm1Db250YWluZXIoY3RybCwgZGlyKTtcbiAgICAvLyBOT1RFOiB0aGlzIG9wZXJhdGlvbiBsb29rcyB1bm5lY2Vzc2FyeSBpbiBjYXNlIG5vIG5ldyB2YWxpZGF0b3JzIHdlcmUgYWRkZWQgaW5cbiAgICAvLyBgc2V0VXBGb3JtQ29udGFpbmVyYCBjYWxsLiBDb25zaWRlciB1cGRhdGluZyB0aGlzIGNvZGUgdG8gbWF0Y2ggdGhlIGxvZ2ljIGluXG4gICAgLy8gYF9jbGVhblVwRm9ybUNvbnRhaW5lcmAgZnVuY3Rpb24uXG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhblVwRm9ybUNvbnRhaW5lcihkaXI6IEZvcm1BcnJheU5hbWUgfCBGb3JtR3JvdXBOYW1lKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9ybSkge1xuICAgICAgY29uc3QgY3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICBpZiAoY3RybCkge1xuICAgICAgICBjb25zdCBpc0NvbnRyb2xVcGRhdGVkID0gY2xlYW5VcEZvcm1Db250YWluZXIoY3RybCwgZGlyKTtcbiAgICAgICAgaWYgKGlzQ29udHJvbFVwZGF0ZWQpIHtcbiAgICAgICAgICAvLyBSdW4gdmFsaWRpdHkgY2hlY2sgb25seSBpbiBjYXNlIGEgY29udHJvbCB3YXMgdXBkYXRlZCAoaS5lLiB2aWV3IHZhbGlkYXRvcnMgd2VyZVxuICAgICAgICAgIC8vIHJlbW92ZWQpIGFzIHJlbW92aW5nIHZpZXcgdmFsaWRhdG9ycyBtaWdodCBjYXVzZSB2YWxpZGl0eSB0byBjaGFuZ2UuXG4gICAgICAgICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSZWdpc3RyYXRpb25zKCkge1xuICAgIHRoaXMuZm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICBpZiAodGhpcy5fb2xkRm9ybSkge1xuICAgICAgdGhpcy5fb2xkRm9ybS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVZhbGlkYXRvcnMoKSB7XG4gICAgc2V0VXBWYWxpZGF0b3JzKHRoaXMuZm9ybSwgdGhpcyk7XG4gICAgaWYgKHRoaXMuX29sZEZvcm0pIHtcbiAgICAgIGNsZWFuVXBWYWxpZGF0b3JzKHRoaXMuX29sZEZvcm0sIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrRm9ybVByZXNlbnQoKSB7XG4gICAgaWYgKCF0aGlzLmZvcm0gJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IG1pc3NpbmdGb3JtRXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=