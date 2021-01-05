/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, EventEmitter, forwardRef, Inject, Input, Optional, Output, Self } from '@angular/core';
import { FormGroup } from '../../model';
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators';
import { ControlContainer } from '../control_container';
import { ReactiveErrors } from '../reactive_errors';
import { cleanUpControl, cleanUpFormContainer, cleanUpValidators, removeListItem, setUpControl, setUpFormContainer, setUpValidators, syncPendingControls } from '../shared';
import * as i0 from "@angular/core";
export const formDirectiveProvider = {
    provide: ControlContainer,
    useExisting: forwardRef(() => FormGroupDirective)
};
/**
 * @description
 *
 * Binds an existing `FormGroup` to a DOM element.
 *
 * This directive accepts an existing `FormGroup` instance. It will then use this
 * `FormGroup` instance to match any child `FormControl`, `FormGroup`,
 * and `FormArray` instances to child `FormControlName`, `FormGroupName`,
 * and `FormArrayName` directives.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `AbstractControl`
 *
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
    constructor(validators, asyncValidators) {
        super();
        this.validators = validators;
        this.asyncValidators = asyncValidators;
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
            cleanUpValidators(this.form, this, /* handleOnValidatorChange */ false);
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
        setUpControl(ctrl, dir);
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
    /** @internal */
    _updateDomValue() {
        this.directives.forEach(dir => {
            const newCtrl = this.form.get(dir.path);
            if (dir.control !== newCtrl) {
                // Note: the value of the `dir.control` may not be defined, for example when it's a first
                // `FormControl` that is added to a `FormGroup` instance (via `addControl` call).
                cleanUpControl(dir.control || null, dir);
                if (newCtrl)
                    setUpControl(newCtrl, dir);
                dir.control = newCtrl;
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
        setUpValidators(this.form, this, /* handleOnValidatorChange */ false);
        if (this._oldForm) {
            cleanUpValidators(this._oldForm, this, /* handleOnValidatorChange */ false);
        }
    }
    _checkFormPresent() {
        if (!this.form && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            ReactiveErrors.missingFormException();
        }
    }
}
FormGroupDirective.ɵfac = function FormGroupDirective_Factory(t) { return new (t || FormGroupDirective)(i0.ɵɵdirectiveInject(NG_VALIDATORS, 10), i0.ɵɵdirectiveInject(NG_ASYNC_VALIDATORS, 10)); };
FormGroupDirective.ɵdir = i0.ɵɵdefineDirective({ type: FormGroupDirective, selectors: [["", "formGroup", ""]], hostBindings: function FormGroupDirective_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("submit", function FormGroupDirective_submit_HostBindingHandler($event) { return ctx.onSubmit($event); })("reset", function FormGroupDirective_reset_HostBindingHandler() { return ctx.onReset(); });
    } }, inputs: { form: ["formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, exportAs: ["ngForm"], features: [i0.ɵɵProvidersFeature([formDirectiveProvider]), i0.ɵɵInheritDefinitionFeature, i0.ɵɵNgOnChangesFeature] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FormGroupDirective, [{
        type: Directive,
        args: [{
                selector: '[formGroup]',
                providers: [formDirectiveProvider],
                host: { '(submit)': 'onSubmit($event)', '(reset)': 'onReset()' },
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
            }] }]; }, { form: [{
            type: Input,
            args: ['formGroup']
        }], ngSubmit: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUF3QixRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFFOUksT0FBTyxFQUF5QixTQUFTLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUQsT0FBTyxFQUFDLG1CQUFtQixFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ3BFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBRXRELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNsRCxPQUFPLEVBQUMsY0FBYyxFQUFFLG9CQUFvQixFQUFFLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLG1CQUFtQixFQUFDLE1BQU0sV0FBVyxDQUFDOztBQU0xSyxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBUTtJQUN4QyxPQUFPLEVBQUUsZ0JBQWdCO0lBQ3pCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQUM7Q0FDbEQsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0JHO0FBT0gsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdCQUFnQjtJQXFDdEQsWUFDdUQsVUFBcUMsRUFDL0IsZUFDbEI7UUFDekMsS0FBSyxFQUFFLENBQUM7UUFINkMsZUFBVSxHQUFWLFVBQVUsQ0FBMkI7UUFDL0Is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QUFDLEVBQUU7WUFDakUsY0FBYyxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDdkM7SUFDSCxDQUFDOztvRkF2U1Usa0JBQWtCLHVCQXNDRyxhQUFhLDRCQUNiLG1CQUFtQjt1REF2Q3hDLGtCQUFrQjt1R0FBbEIsb0JBQWdCLDhFQUFoQixhQUFTOzRJQUpULENBQUMscUJBQXFCLENBQUM7dUZBSXZCLGtCQUFrQjtjQU45QixTQUFTO2VBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDO2dCQUNsQyxJQUFJLEVBQUUsRUFBQyxVQUFVLEVBQUUsa0JBQWtCLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBQztnQkFDOUQsUUFBUSxFQUFFLFFBQVE7YUFDbkI7O3NCQXVDTSxRQUFROztzQkFBSSxJQUFJOztzQkFBSSxNQUFNO3VCQUFDLGFBQWE7O3NCQUN4QyxRQUFROztzQkFBSSxJQUFJOztzQkFBSSxNQUFNO3VCQUFDLG1CQUFtQjt3QkFWL0IsSUFBSTtrQkFBdkIsS0FBSzttQkFBQyxXQUFXO1lBTVIsUUFBUTtrQkFBakIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRXZlbnRFbWl0dGVyLCBmb3J3YXJkUmVmLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT3B0aW9uYWwsIE91dHB1dCwgU2VsZiwgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUFycmF5LCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwfSBmcm9tICcuLi8uLi9tb2RlbCc7XG5pbXBvcnQge05HX0FTWU5DX1ZBTElEQVRPUlMsIE5HX1ZBTElEQVRPUlN9IGZyb20gJy4uLy4uL3ZhbGlkYXRvcnMnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0Zvcm19IGZyb20gJy4uL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7UmVhY3RpdmVFcnJvcnN9IGZyb20gJy4uL3JlYWN0aXZlX2Vycm9ycyc7XG5pbXBvcnQge2NsZWFuVXBDb250cm9sLCBjbGVhblVwRm9ybUNvbnRhaW5lciwgY2xlYW5VcFZhbGlkYXRvcnMsIHJlbW92ZUxpc3RJdGVtLCBzZXRVcENvbnRyb2wsIHNldFVwRm9ybUNvbnRhaW5lciwgc2V0VXBWYWxpZGF0b3JzLCBzeW5jUGVuZGluZ0NvbnRyb2xzfSBmcm9tICcuLi9zaGFyZWQnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvciwgQXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7Rm9ybUNvbnRyb2xOYW1lfSBmcm9tICcuL2Zvcm1fY29udHJvbF9uYW1lJztcbmltcG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9mb3JtX2dyb3VwX25hbWUnO1xuXG5leHBvcnQgY29uc3QgZm9ybURpcmVjdGl2ZVByb3ZpZGVyOiBhbnkgPSB7XG4gIHByb3ZpZGU6IENvbnRyb2xDb250YWluZXIsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEZvcm1Hcm91cERpcmVjdGl2ZSlcbn07XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKlxuICogQmluZHMgYW4gZXhpc3RpbmcgYEZvcm1Hcm91cGAgdG8gYSBET00gZWxlbWVudC5cbiAqXG4gKiBUaGlzIGRpcmVjdGl2ZSBhY2NlcHRzIGFuIGV4aXN0aW5nIGBGb3JtR3JvdXBgIGluc3RhbmNlLiBJdCB3aWxsIHRoZW4gdXNlIHRoaXNcbiAqIGBGb3JtR3JvdXBgIGluc3RhbmNlIHRvIG1hdGNoIGFueSBjaGlsZCBgRm9ybUNvbnRyb2xgLCBgRm9ybUdyb3VwYCxcbiAqIGFuZCBgRm9ybUFycmF5YCBpbnN0YW5jZXMgdG8gY2hpbGQgYEZvcm1Db250cm9sTmFtZWAsIGBGb3JtR3JvdXBOYW1lYCxcbiAqIGFuZCBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlcy5cbiAqXG4gKiBAc2VlIFtSZWFjdGl2ZSBGb3JtcyBHdWlkZV0oZ3VpZGUvcmVhY3RpdmUtZm9ybXMpXG4gKiBAc2VlIGBBYnN0cmFjdENvbnRyb2xgXG4gKlxuICogIyMjIFJlZ2lzdGVyIEZvcm0gR3JvdXBcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGV4YW1wbGUgcmVnaXN0ZXJzIGEgYEZvcm1Hcm91cGAgd2l0aCBmaXJzdCBuYW1lIGFuZCBsYXN0IG5hbWUgY29udHJvbHMsXG4gKiBhbmQgbGlzdGVucyBmb3IgdGhlICpuZ1N1Ym1pdCogZXZlbnQgd2hlbiB0aGUgYnV0dG9uIGlzIGNsaWNrZWQuXG4gKlxuICoge0BleGFtcGxlIGZvcm1zL3RzL3NpbXBsZUZvcm1Hcm91cC9zaW1wbGVfZm9ybV9ncm91cF9leGFtcGxlLnRzIHJlZ2lvbj0nQ29tcG9uZW50J31cbiAqXG4gKiBAbmdNb2R1bGUgUmVhY3RpdmVGb3Jtc01vZHVsZVxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbZm9ybUdyb3VwXScsXG4gIHByb3ZpZGVyczogW2Zvcm1EaXJlY3RpdmVQcm92aWRlcl0sXG4gIGhvc3Q6IHsnKHN1Ym1pdCknOiAnb25TdWJtaXQoJGV2ZW50KScsICcocmVzZXQpJzogJ29uUmVzZXQoKSd9LFxuICBleHBvcnRBczogJ25nRm9ybSdcbn0pXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwRGlyZWN0aXZlIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciBpbXBsZW1lbnRzIEZvcm0sIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGZvcm0gc3VibWlzc2lvbiBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3VibWl0dGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byBhbiBvbGQgZm9ybSBncm91cCBpbnB1dCB2YWx1ZSwgd2hpY2ggaXMgbmVlZGVkIHRvIGNsZWFudXAgb2xkIGluc3RhbmNlIGluIGNhc2UgaXRcbiAgICogd2FzIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLlxuICAgKi9cbiAgcHJpdmF0ZSBfb2xkRm9ybTogRm9ybUdyb3VwfHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQ2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgaW52b2tlZCB3aGVuIGNvbnRyb2xzIGluIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgY29sbGVjdGlvbiBjaGFuZ2VcbiAgICogKGFkZGVkIG9yIHJlbW92ZWQpLiBUaGlzIGNhbGxiYWNrIHRyaWdnZXJzIGNvcnJlc3BvbmRpbmcgRE9NIHVwZGF0ZXMuXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IF9vbkNvbGxlY3Rpb25DaGFuZ2UgPSAoKSA9PiB0aGlzLl91cGRhdGVEb21WYWx1ZSgpO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVHJhY2tzIHRoZSBsaXN0IG9mIGFkZGVkIGBGb3JtQ29udHJvbE5hbWVgIGluc3RhbmNlc1xuICAgKi9cbiAgZGlyZWN0aXZlczogRm9ybUNvbnRyb2xOYW1lW10gPSBbXTtcblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRyYWNrcyB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBASW5wdXQoJ2Zvcm1Hcm91cCcpIGZvcm06IEZvcm1Hcm91cCA9IG51bGwhO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgZm9ybSBzdWJtaXNzaW9uIGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICovXG4gIEBPdXRwdXQoKSBuZ1N1Ym1pdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBPcHRpb25hbCgpIEBTZWxmKCkgQEluamVjdChOR19WQUxJREFUT1JTKSBwcml2YXRlIHZhbGlkYXRvcnM6IChWYWxpZGF0b3J8VmFsaWRhdG9yRm4pW10sXG4gICAgICBAT3B0aW9uYWwoKSBAU2VsZigpIEBJbmplY3QoTkdfQVNZTkNfVkFMSURBVE9SUykgcHJpdmF0ZSBhc3luY1ZhbGlkYXRvcnM6XG4gICAgICAgICAgKEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4pW10pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3NldFZhbGlkYXRvcnModmFsaWRhdG9ycyk7XG4gICAgdGhpcy5fc2V0QXN5bmNWYWxpZGF0b3JzKGFzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICB0aGlzLl9jaGVja0Zvcm1QcmVzZW50KCk7XG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2Zvcm0nKSkge1xuICAgICAgdGhpcy5fdXBkYXRlVmFsaWRhdG9ycygpO1xuICAgICAgdGhpcy5fdXBkYXRlRG9tVmFsdWUoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVJlZ2lzdHJhdGlvbnMoKTtcbiAgICAgIHRoaXMuX29sZEZvcm0gPSB0aGlzLmZvcm07XG4gICAgfVxuICB9XG5cbiAgLyoqIEBub2RvYyAqL1xuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5mb3JtKSB7XG4gICAgICBjbGVhblVwVmFsaWRhdG9ycyh0aGlzLmZvcm0sIHRoaXMsIC8qIGhhbmRsZU9uVmFsaWRhdG9yQ2hhbmdlICovIGZhbHNlKTtcblxuICAgICAgLy8gQ3VycmVudGx5IHRoZSBgb25Db2xsZWN0aW9uQ2hhbmdlYCBjYWxsYmFjayBpcyByZXdyaXR0ZW4gZWFjaCB0aW1lIHRoZVxuICAgICAgLy8gYF9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZWAgZnVuY3Rpb24gaXMgaW52b2tlZC4gVGhlIGltcGxpY2F0aW9uIGlzIHRoYXQgY2xlYW51cCBzaG91bGRcbiAgICAgIC8vIGhhcHBlbiAqb25seSogd2hlbiB0aGUgYG9uQ29sbGVjdGlvbkNoYW5nZWAgY2FsbGJhY2sgd2FzIHNldCBieSB0aGlzIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICAgIC8vIE90aGVyd2lzZSBpdCBtaWdodCBjYXVzZSBvdmVycmlkaW5nIGEgY2FsbGJhY2sgb2Ygc29tZSBvdGhlciBkaXJlY3RpdmUgaW5zdGFuY2VzLiBXZSBzaG91bGRcbiAgICAgIC8vIGNvbnNpZGVyIHVwZGF0aW5nIHRoaXMgbG9naWMgbGF0ZXIgdG8gbWFrZSBpdCBzaW1pbGFyIHRvIGhvdyBgb25DaGFuZ2VgIGNhbGxiYWNrcyBhcmVcbiAgICAgIC8vIGhhbmRsZWQsIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zOTczMiBmb3IgYWRkaXRpb25hbCBpbmZvLlxuICAgICAgaWYgKHRoaXMuZm9ybS5fb25Db2xsZWN0aW9uQ2hhbmdlID09PSB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5mb3JtLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIHRoaXMgZGlyZWN0aXZlJ3MgaW5zdGFuY2UuXG4gICAqL1xuICBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyB0aGUgYEZvcm1Hcm91cGAgYm91bmQgdG8gdGhpcyBkaXJlY3RpdmUuXG4gICAqL1xuICBnZXQgY29udHJvbCgpOiBGb3JtR3JvdXAge1xuICAgIHJldHVybiB0aGlzLmZvcm07XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgYW4gYXJyYXkgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoaXMgZ3JvdXAuIEJlY2F1c2UgdGhpcyBkaXJlY3RpdmVcbiAgICogYWx3YXlzIGxpdmVzIGF0IHRoZSB0b3AgbGV2ZWwgb2YgYSBmb3JtLCBpdCBhbHdheXMgYW4gZW1wdHkgYXJyYXkuXG4gICAqL1xuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBNZXRob2QgdGhhdCBzZXRzIHVwIHRoZSBjb250cm9sIGRpcmVjdGl2ZSBpbiB0aGlzIGdyb3VwLCByZS1jYWxjdWxhdGVzIGl0cyB2YWx1ZVxuICAgKiBhbmQgdmFsaWRpdHksIGFuZCBhZGRzIHRoZSBpbnN0YW5jZSB0byB0aGUgaW50ZXJuYWwgbGlzdCBvZiBkaXJlY3RpdmVzLlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gICAqL1xuICBhZGRDb250cm9sKGRpcjogRm9ybUNvbnRyb2xOYW1lKTogRm9ybUNvbnRyb2wge1xuICAgIGNvbnN0IGN0cmw6IGFueSA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgIHNldFVwQ29udHJvbChjdHJsLCBkaXIpO1xuICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgIHRoaXMuZGlyZWN0aXZlcy5wdXNoKGRpcik7XG4gICAgcmV0dXJuIGN0cmw7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHJpZXZlcyB0aGUgYEZvcm1Db250cm9sYCBpbnN0YW5jZSBmcm9tIHRoZSBwcm92aWRlZCBgRm9ybUNvbnRyb2xOYW1lYCBkaXJlY3RpdmVcbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0Q29udHJvbChkaXI6IEZvcm1Db250cm9sTmFtZSk6IEZvcm1Db250cm9sIHtcbiAgICByZXR1cm4gPEZvcm1Db250cm9sPnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZW1vdmVzIHRoZSBgRm9ybUNvbnRyb2xOYW1lYCBpbnN0YW5jZSBmcm9tIHRoZSBpbnRlcm5hbCBsaXN0IG9mIGRpcmVjdGl2ZXNcbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbChkaXI6IEZvcm1Db250cm9sTmFtZSk6IHZvaWQge1xuICAgIGNsZWFuVXBDb250cm9sKGRpci5jb250cm9sIHx8IG51bGwsIGRpciwgLyogdmFsaWRhdGVDb250cm9sUHJlc2VuY2VPbkNoYW5nZSAqLyBmYWxzZSk7XG4gICAgcmVtb3ZlTGlzdEl0ZW0odGhpcy5kaXJlY3RpdmVzLCBkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBuZXcgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSB0byB0aGUgZm9ybS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGFkZEZvcm1Hcm91cChkaXI6IEZvcm1Hcm91cE5hbWUpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRVcEZvcm1Db250YWluZXIoZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyB0aGUgbmVjZXNzYXJ5IGNsZWFudXAgd2hlbiBhIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UgaXMgcmVtb3ZlZCBmcm9tIHRoZVxuICAgKiB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgcmVtb3ZlRm9ybUdyb3VwKGRpcjogRm9ybUdyb3VwTmFtZSk6IHZvaWQge1xuICAgIHRoaXMuX2NsZWFuVXBGb3JtQ29udGFpbmVyKGRpcik7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHJpZXZlcyB0aGUgYEZvcm1Hcm91cGAgZm9yIGEgcHJvdmlkZWQgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgZ2V0Rm9ybUdyb3VwKGRpcjogRm9ybUdyb3VwTmFtZSk6IEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIDxGb3JtR3JvdXA+dGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgdGhlIG5lY2Vzc2FyeSBzZXR1cCB3aGVuIGEgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZSBpcyBhZGRlZCB0byB0aGUgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGFkZEZvcm1BcnJheShkaXI6IEZvcm1BcnJheU5hbWUpOiB2b2lkIHtcbiAgICB0aGlzLl9zZXRVcEZvcm1Db250YWluZXIoZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyB0aGUgbmVjZXNzYXJ5IGNsZWFudXAgd2hlbiBhIGBGb3JtQXJyYXlOYW1lYCBkaXJlY3RpdmUgaW5zdGFuY2UgaXMgcmVtb3ZlZCBmcm9tIHRoZVxuICAgKiB2aWV3LlxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBgRm9ybUFycmF5TmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKi9cbiAgcmVtb3ZlRm9ybUFycmF5KGRpcjogRm9ybUFycmF5TmFtZSk6IHZvaWQge1xuICAgIHRoaXMuX2NsZWFuVXBGb3JtQ29udGFpbmVyKGRpcik7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHJpZXZlcyB0aGUgYEZvcm1BcnJheWAgZm9yIGEgcHJvdmlkZWQgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1BcnJheU5hbWVgIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAgICovXG4gIGdldEZvcm1BcnJheShkaXI6IEZvcm1BcnJheU5hbWUpOiBGb3JtQXJyYXkge1xuICAgIHJldHVybiA8Rm9ybUFycmF5PnRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIG5ldyB2YWx1ZSBmb3IgdGhlIHByb3ZpZGVkIGBGb3JtQ29udHJvbE5hbWVgIGRpcmVjdGl2ZS5cbiAgICpcbiAgICogQHBhcmFtIGRpciBUaGUgYEZvcm1Db250cm9sTmFtZWAgZGlyZWN0aXZlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGRpcmVjdGl2ZSdzIGNvbnRyb2wuXG4gICAqL1xuICB1cGRhdGVNb2RlbChkaXI6IEZvcm1Db250cm9sTmFtZSwgdmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGN0cmzCoCA9IDxGb3JtQ29udHJvbD50aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBjdHJsLnNldFZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIGNhbGxlZCB3aXRoIHRoZSBcInN1Ym1pdFwiIGV2ZW50IGlzIHRyaWdnZXJlZCBvbiB0aGUgZm9ybS5cbiAgICogVHJpZ2dlcnMgdGhlIGBuZ1N1Ym1pdGAgZW1pdHRlciB0byBlbWl0IHRoZSBcInN1Ym1pdFwiIGV2ZW50IGFzIGl0cyBwYXlsb2FkLlxuICAgKlxuICAgKiBAcGFyYW0gJGV2ZW50IFRoZSBcInN1Ym1pdFwiIGV2ZW50IG9iamVjdFxuICAgKi9cbiAgb25TdWJtaXQoJGV2ZW50OiBFdmVudCk6IGJvb2xlYW4ge1xuICAgICh0aGlzIGFzIHtzdWJtaXR0ZWQ6IGJvb2xlYW59KS5zdWJtaXR0ZWQgPSB0cnVlO1xuICAgIHN5bmNQZW5kaW5nQ29udHJvbHModGhpcy5mb3JtLCB0aGlzLmRpcmVjdGl2ZXMpO1xuICAgIHRoaXMubmdTdWJtaXQuZW1pdCgkZXZlbnQpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBcInJlc2V0XCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBmb3JtLlxuICAgKi9cbiAgb25SZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLnJlc2V0Rm9ybSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXNldHMgdGhlIGZvcm0gdG8gYW4gaW5pdGlhbCB2YWx1ZSBhbmQgcmVzZXRzIGl0cyBzdWJtaXR0ZWQgc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG5ldyB2YWx1ZSBmb3IgdGhlIGZvcm0uXG4gICAqL1xuICByZXNldEZvcm0odmFsdWU6IGFueSA9IHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIHRoaXMuZm9ybS5yZXNldCh2YWx1ZSk7XG4gICAgKHRoaXMgYXMge3N1Ym1pdHRlZDogYm9vbGVhbn0pLnN1Ym1pdHRlZCA9IGZhbHNlO1xuICB9XG5cblxuICAvKiogQGludGVybmFsICovXG4gIF91cGRhdGVEb21WYWx1ZSgpIHtcbiAgICB0aGlzLmRpcmVjdGl2ZXMuZm9yRWFjaChkaXIgPT4ge1xuICAgICAgY29uc3QgbmV3Q3RybDogYW55ID0gdGhpcy5mb3JtLmdldChkaXIucGF0aCk7XG4gICAgICBpZiAoZGlyLmNvbnRyb2wgIT09IG5ld0N0cmwpIHtcbiAgICAgICAgLy8gTm90ZTogdGhlIHZhbHVlIG9mIHRoZSBgZGlyLmNvbnRyb2xgIG1heSBub3QgYmUgZGVmaW5lZCwgZm9yIGV4YW1wbGUgd2hlbiBpdCdzIGEgZmlyc3RcbiAgICAgICAgLy8gYEZvcm1Db250cm9sYCB0aGF0IGlzIGFkZGVkIHRvIGEgYEZvcm1Hcm91cGAgaW5zdGFuY2UgKHZpYSBgYWRkQ29udHJvbGAgY2FsbCkuXG4gICAgICAgIGNsZWFuVXBDb250cm9sKGRpci5jb250cm9sIHx8IG51bGwsIGRpcik7XG4gICAgICAgIGlmIChuZXdDdHJsKSBzZXRVcENvbnRyb2wobmV3Q3RybCwgZGlyKTtcbiAgICAgICAgKGRpciBhcyB7Y29udHJvbDogRm9ybUNvbnRyb2x9KS5jb250cm9sID0gbmV3Q3RybDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuZm9ybS5fdXBkYXRlVHJlZVZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRVcEZvcm1Db250YWluZXIoZGlyOiBGb3JtQXJyYXlOYW1lfEZvcm1Hcm91cE5hbWUpOiB2b2lkIHtcbiAgICBjb25zdCBjdHJsOiBhbnkgPSB0aGlzLmZvcm0uZ2V0KGRpci5wYXRoKTtcbiAgICBzZXRVcEZvcm1Db250YWluZXIoY3RybCwgZGlyKTtcbiAgICAvLyBOT1RFOiB0aGlzIG9wZXJhdGlvbiBsb29rcyB1bm5lY2Vzc2FyeSBpbiBjYXNlIG5vIG5ldyB2YWxpZGF0b3JzIHdlcmUgYWRkZWQgaW5cbiAgICAvLyBgc2V0VXBGb3JtQ29udGFpbmVyYCBjYWxsLiBDb25zaWRlciB1cGRhdGluZyB0aGlzIGNvZGUgdG8gbWF0Y2ggdGhlIGxvZ2ljIGluXG4gICAgLy8gYF9jbGVhblVwRm9ybUNvbnRhaW5lcmAgZnVuY3Rpb24uXG4gICAgY3RybC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IGZhbHNlfSk7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhblVwRm9ybUNvbnRhaW5lcihkaXI6IEZvcm1BcnJheU5hbWV8Rm9ybUdyb3VwTmFtZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm0pIHtcbiAgICAgIGNvbnN0IGN0cmw6IGFueSA9IHRoaXMuZm9ybS5nZXQoZGlyLnBhdGgpO1xuICAgICAgaWYgKGN0cmwpIHtcbiAgICAgICAgY29uc3QgaXNDb250cm9sVXBkYXRlZCA9IGNsZWFuVXBGb3JtQ29udGFpbmVyKGN0cmwsIGRpcik7XG4gICAgICAgIGlmIChpc0NvbnRyb2xVcGRhdGVkKSB7XG4gICAgICAgICAgLy8gUnVuIHZhbGlkaXR5IGNoZWNrIG9ubHkgaW4gY2FzZSBhIGNvbnRyb2wgd2FzIHVwZGF0ZWQgKGkuZS4gdmlldyB2YWxpZGF0b3JzIHdlcmVcbiAgICAgICAgICAvLyByZW1vdmVkKSBhcyByZW1vdmluZyB2aWV3IHZhbGlkYXRvcnMgbWlnaHQgY2F1c2UgdmFsaWRpdHkgdG8gY2hhbmdlLlxuICAgICAgICAgIGN0cmwudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBmYWxzZX0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlUmVnaXN0cmF0aW9ucygpIHtcbiAgICB0aGlzLmZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgaWYgKHRoaXMuX29sZEZvcm0pIHtcbiAgICAgIHRoaXMuX29sZEZvcm0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVWYWxpZGF0b3JzKCkge1xuICAgIHNldFVwVmFsaWRhdG9ycyh0aGlzLmZvcm0sIHRoaXMsIC8qIGhhbmRsZU9uVmFsaWRhdG9yQ2hhbmdlICovIGZhbHNlKTtcbiAgICBpZiAodGhpcy5fb2xkRm9ybSkge1xuICAgICAgY2xlYW5VcFZhbGlkYXRvcnModGhpcy5fb2xkRm9ybSwgdGhpcywgLyogaGFuZGxlT25WYWxpZGF0b3JDaGFuZ2UgKi8gZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2NoZWNrRm9ybVByZXNlbnQoKSB7XG4gICAgaWYgKCF0aGlzLmZvcm0gJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIFJlYWN0aXZlRXJyb3JzLm1pc3NpbmdGb3JtRXhjZXB0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=