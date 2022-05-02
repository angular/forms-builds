/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AbstractControl, assertAllValuesPresent, assertControlPresent, pickAsyncValidators, pickValidators } from './abstract_model';
/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * `FormGroup` is one of the three fundamental building blocks used to define forms in Angular,
 * along with `FormControl` and `FormArray`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * `FormGroup` accepts an optional type parameter `TControl`, which is an object type with inner
 * control types as values.
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 *
 * ### Using a FormGroup with optional controls
 *
 * It is possible to have optional controls in a FormGroup. An optional control can be removed later
 * using `removeControl`, and can be omitted when calling `reset`. Optional controls must be
 * declared optional in the group's type.
 *
 * ```ts
 * const c = new FormGroup<{one?: FormControl<string>}>({
 *   one: new FormControl('')
 * });
 * ```
 *
 * Notice that `c.value.one` has type `string|null|undefined`. This is because calling `c.reset({})`
 * without providing the optional key `one` will cause it to become `null`.
 *
 * @publicApi
 */
export class FormGroup extends AbstractControl {
    /**
     * Creates a new `FormGroup` instance.
     *
     * @param controls A collection of child controls. The key for each child is the name
     * under which it is registered.
     *
     * @param validatorOrOpts A synchronous validator function, or an array of
     * such functions, or an `AbstractControlOptions` object that contains validation functions
     * and a validation trigger.
     *
     * @param asyncValidator A single async validator or array of async validator functions
     *
     */
    constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
            onlySelf: true,
            // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
            // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
            // so we set `emitEvent` to `true` to allow that during the control creation process.
            emitEvent: !!this.asyncValidator
        });
    }
    registerControl(name, control) {
        if (this.controls[name])
            return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
    }
    addControl(name, control, options = {}) {
        this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    /**
     * Remove a control from this group. In a strongly-typed group, required controls cannot be
     * removed.
     *
     * This method also updates the value and validity of the control.
     *
     * @param name The control name to remove from the collection
     * @param options Specifies whether this FormGroup instance should emit events after a
     *     control is removed.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control is
     * removed. When false, no events are emitted.
     */
    removeControl(name, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    setControl(name, control, options = {}) {
        if (this.controls[name])
            this.controls[name]._registerOnCollectionChange(() => { });
        delete (this.controls[name]);
        if (control)
            this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
    }
    contains(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
    }
    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     * the structure of the group, with control names as keys.
     *
     * @usageNotes
     * ### Set the complete value for the form group
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl(),
     *   last: new FormControl()
     * });
     *
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.setValue({first: 'Nancy', last: 'Drew'});
     * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
     * ```
     *
     * @throws When strict checks fail, such as setting the value of a control
     * that doesn't exist or if you exclude a value of a control that does exist.
     *
     * @param value The new value for the control that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes
     * and emits events after the value changes.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control value is updated.
     * When false, no events are emitted.
     */
    setValue(value, options = {}) {
        assertAllValuesPresent(this, true, value);
        Object.keys(value).forEach(name => {
            assertControlPresent(this, true, name);
            this.controls[name].setValue(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Patches the value of the `FormGroup`. It accepts an object with control
     * names as keys, and does its best to match the values to the correct controls
     * in the group.
     *
     * It accepts both super-sets and sub-sets of the group without throwing an error.
     *
     * @usageNotes
     * ### Patch the value for a form group
     *
     * ```
     * const form = new FormGroup({
     *    first: new FormControl(),
     *    last: new FormControl()
     * });
     * console.log(form.value);   // {first: null, last: null}
     *
     * form.patchValue({first: 'Nancy'});
     * console.log(form.value);   // {first: 'Nancy', last: null}
     * ```
     *
     * @param value The object that matches the structure of the group.
     * @param options Configuration options that determine how the control propagates changes and
     * emits events after the value is patched.
     * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
     * true.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges` observables emit events with the latest status and value when the control value
     * is updated. When false, no events are emitted. The configuration options are passed to
     * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
     */
    patchValue(value, options = {}) {
        // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
        // `patchValue` can be called recursively and inner data structures might have these values, so
        // we just ignore such cases when a field containing FormGroup instance receives `null` or
        // `undefined` as a value.
        if (value == null /* both `null` and `undefined` */)
            return;
        Object.keys(value).forEach(name => {
            // The compiler cannot see through the uninstantiated conditional type of `this.controls`, so
            // `as any` is required.
            const control = this.controls[name];
            if (control) {
                control.patchValue(
                /* Guaranteed to be present, due to the outer forEach. */ value[name], { onlySelf: true, emitEvent: options.emitEvent });
            }
        });
        this.updateValueAndValidity(options);
    }
    /**
     * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
     * the value of all descendants to their default values, or null if no defaults were provided.
     *
     * You reset to a specific form state by passing in a map of states
     * that matches the structure of your form, with control names as keys. The state
     * is a standalone value or a form state object with both a value and a disabled
     * status.
     *
     * @param value Resets the control with an initial value,
     * or an object that defines the initial value and disabled state.
     *
     * @param options Configuration options that determine how the control propagates changes
     * and emits events when the group is reset.
     * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
     * false.
     * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
     * `valueChanges`
     * observables emit events with the latest status and value when the control is reset.
     * When false, no events are emitted.
     * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
     * updateValueAndValidity} method.
     *
     * @usageNotes
     *
     * ### Reset the form group values
     *
     * ```ts
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * console.log(form.value);  // {first: 'first name', last: 'last name'}
     *
     * form.reset({ first: 'name', last: 'last name' });
     *
     * console.log(form.value);  // {first: 'name', last: 'last name'}
     * ```
     *
     * ### Reset the form group values and disabled status
     *
     * ```
     * const form = new FormGroup({
     *   first: new FormControl('first name'),
     *   last: new FormControl('last name')
     * });
     *
     * form.reset({
     *   first: {value: 'name', disabled: true},
     *   last: 'last'
     * });
     *
     * console.log(form.value);  // {last: 'last'}
     * console.log(form.get('first').status);  // 'DISABLED'
     * ```
     */
    reset(value = {}, options = {}) {
        this._forEachChild((control, name) => {
            control.reset(value[name], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options);
        this._updateTouched(options);
        this.updateValueAndValidity(options);
    }
    /**
     * The aggregate value of the `FormGroup`, including any disabled controls.
     *
     * Retrieves all values regardless of disabled status.
     */
    getRawValue() {
        return this._reduceChildren({}, (acc, control, name) => {
            acc[name] = control.getRawValue();
            return acc;
        });
    }
    /** @internal */
    _syncPendingControls() {
        let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
            return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
            this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
    }
    /** @internal */
    _forEachChild(cb) {
        Object.keys(this.controls).forEach(key => {
            // The list of controls can change (for ex. controls might be removed) while the loop
            // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
            // have to null check before invoking the callback.
            const control = this.controls[key];
            control && cb(control, key);
        });
    }
    /** @internal */
    _setUpControls() {
        this._forEachChild((control) => {
            control.setParent(this);
            control._registerOnCollectionChange(this._onCollectionChange);
        });
    }
    /** @internal */
    _updateValue() {
        this.value = this._reduceValue();
    }
    /** @internal */
    _anyControls(condition) {
        for (const [controlName, control] of Object.entries(this.controls)) {
            if (this.contains(controlName) && condition(control)) {
                return true;
            }
        }
        return false;
    }
    /** @internal */
    _reduceValue() {
        let acc = {};
        return this._reduceChildren(acc, (acc, control, name) => {
            if (control.enabled || this.disabled) {
                acc[name] = control.value;
            }
            return acc;
        });
    }
    /** @internal */
    _reduceChildren(initValue, fn) {
        let res = initValue;
        this._forEachChild((control, name) => {
            res = fn(res, control, name);
        });
        return res;
    }
    /** @internal */
    _allControlsDisabled() {
        for (const controlName of Object.keys(this.controls)) {
            if (this.controls[controlName].enabled) {
                return false;
            }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
    }
    /** @internal */
    _find(name) {
        return this.controls.hasOwnProperty(name) ?
            this.controls[name] :
            null;
    }
}
export const UntypedFormGroup = FormGroup;
export const isFormGroup = (control) => control instanceof FormGroup;
export class FormRecord extends FormGroup {
}
export const isFormRecord = (control) => control instanceof FormRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9tb2RlbC9mb3JtX2dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUlILE9BQU8sRUFBQyxlQUFlLEVBQTBCLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBcUMsTUFBTSxrQkFBa0IsQ0FBQztBQWlDaE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUZHO0FBQ0gsTUFBTSxPQUFPLFNBQWdGLFNBQ3pGLGVBRWlFO0lBQ25FOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILFlBQ0ksUUFBa0IsRUFBRSxlQUF1RSxFQUMzRixjQUF5RDtRQUMzRCxLQUFLLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxFQUFFLG1CQUFtQixDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQzdGLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLHNCQUFzQixDQUFDO1lBQzFCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsMEZBQTBGO1lBQzFGLDZGQUE2RjtZQUM3RixxRkFBcUY7WUFDckYsU0FBUyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYztTQUNqQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBbUJELGVBQWUsQ0FBa0MsSUFBTyxFQUFFLE9BQW9CO1FBQzVFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENB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QUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXN5bmNWYWxpZGF0b3JGbiwgVmFsaWRhdG9yRm59IGZyb20gJy4uL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBBYnN0cmFjdENvbnRyb2xPcHRpb25zLCBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50LCBhc3NlcnRDb250cm9sUHJlc2VudCwgcGlja0FzeW5jVmFsaWRhdG9ycywgcGlja1ZhbGlkYXRvcnMsIMm1UmF3VmFsdWUsIMm1VHlwZWRPclVudHlwZWQsIMm1VmFsdWV9IGZyb20gJy4vYWJzdHJhY3RfbW9kZWwnO1xuXG4vKipcbiAqIEZvcm1Hcm91cFZhbHVlIGV4dHJhY3RzIHRoZSB0eXBlIG9mIGAudmFsdWVgIGZyb20gYSBGb3JtR3JvdXAncyBpbm5lciBvYmplY3QgdHlwZS4gVGhlIHVudHlwZWRcbiAqIGNhc2UgZmFsbHMgYmFjayB0byB7W2tleTogc3RyaW5nXTogYW55fS5cbiAqXG4gKiBBbmd1bGFyIHVzZXMgdGhpcyB0eXBlIGludGVybmFsbHkgdG8gc3VwcG9ydCBUeXBlZCBGb3JtczsgZG8gbm90IHVzZSBpdCBkaXJlY3RseS5cbiAqXG4gKiBGb3IgaW50ZXJuYWwgdXNlIG9ubHkuXG4gKi9cbmV4cG9ydCB0eXBlIMm1Rm9ybUdyb3VwVmFsdWU8VCBleHRlbmRzIHtbSyBpbiBrZXlvZiBUXT86IEFic3RyYWN0Q29udHJvbDxhbnk+fT4gPVxuICAgIMm1VHlwZWRPclVudHlwZWQ8VCwgUGFydGlhbDx7W0sgaW4ga2V5b2YgVF06IMm1VmFsdWU8VFtLXT59Piwge1trZXk6IHN0cmluZ106IGFueX0+O1xuXG4vKipcbiAqIEZvcm1Hcm91cFJhd1ZhbHVlIGV4dHJhY3RzIHRoZSB0eXBlIG9mIGAuZ2V0UmF3VmFsdWUoKWAgZnJvbSBhIEZvcm1Hcm91cCdzIGlubmVyIG9iamVjdCB0eXBlLiBUaGVcbiAqIHVudHlwZWQgY2FzZSBmYWxscyBiYWNrIHRvIHtba2V5OiBzdHJpbmddOiBhbnl9LlxuICpcbiAqIEFuZ3VsYXIgdXNlcyB0aGlzIHR5cGUgaW50ZXJuYWxseSB0byBzdXBwb3J0IFR5cGVkIEZvcm1zOyBkbyBub3QgdXNlIGl0IGRpcmVjdGx5LlxuICpcbiAqIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAqL1xuZXhwb3J0IHR5cGUgybVGb3JtR3JvdXBSYXdWYWx1ZTxUIGV4dGVuZHMge1tLIGluIGtleW9mIFRdPzogQWJzdHJhY3RDb250cm9sPGFueT59PiA9XG4gICAgybVUeXBlZE9yVW50eXBlZDxULCB7W0sgaW4ga2V5b2YgVF06IMm1UmF3VmFsdWU8VFtLXT59LCB7W2tleTogc3RyaW5nXTogYW55fT47XG5cbi8qKlxuICogT3B0aW9uYWxLZXlzIHJldHVybnMgdGhlIHVuaW9uIG9mIGFsbCBvcHRpb25hbCBrZXlzIGluIHRoZSBvYmplY3QuXG4gKlxuICogQW5ndWxhciB1c2VzIHRoaXMgdHlwZSBpbnRlcm5hbGx5IHRvIHN1cHBvcnQgVHlwZWQgRm9ybXM7IGRvIG5vdCB1c2UgaXQgZGlyZWN0bHkuXG4gKi9cbmV4cG9ydCB0eXBlIMm1T3B0aW9uYWxLZXlzPFQ+ID0ge1xuICBbSyBpbiBrZXlvZiBUXSAtPzogdW5kZWZpbmVkIGV4dGVuZHMgVFtLXSA/IEsgOiBuZXZlclxufVtrZXlvZiBUXTtcblxuLyoqXG4gKiBUcmFja3MgdGhlIHZhbHVlIGFuZCB2YWxpZGl0eSBzdGF0ZSBvZiBhIGdyb3VwIG9mIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLlxuICpcbiAqIEEgYEZvcm1Hcm91cGAgYWdncmVnYXRlcyB0aGUgdmFsdWVzIG9mIGVhY2ggY2hpbGQgYEZvcm1Db250cm9sYCBpbnRvIG9uZSBvYmplY3QsXG4gKiB3aXRoIGVhY2ggY29udHJvbCBuYW1lIGFzIHRoZSBrZXkuICBJdCBjYWxjdWxhdGVzIGl0cyBzdGF0dXMgYnkgcmVkdWNpbmcgdGhlIHN0YXR1cyB2YWx1ZXNcbiAqIG9mIGl0cyBjaGlsZHJlbi4gRm9yIGV4YW1wbGUsIGlmIG9uZSBvZiB0aGUgY29udHJvbHMgaW4gYSBncm91cCBpcyBpbnZhbGlkLCB0aGUgZW50aXJlXG4gKiBncm91cCBiZWNvbWVzIGludmFsaWQuXG4gKlxuICogYEZvcm1Hcm91cGAgaXMgb25lIG9mIHRoZSB0aHJlZSBmdW5kYW1lbnRhbCBidWlsZGluZyBibG9ja3MgdXNlZCB0byBkZWZpbmUgZm9ybXMgaW4gQW5ndWxhcixcbiAqIGFsb25nIHdpdGggYEZvcm1Db250cm9sYCBhbmQgYEZvcm1BcnJheWAuXG4gKlxuICogV2hlbiBpbnN0YW50aWF0aW5nIGEgYEZvcm1Hcm91cGAsIHBhc3MgaW4gYSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzIGFzIHRoZSBmaXJzdFxuICogYXJndW1lbnQuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgcmVnaXN0ZXJzIHRoZSBuYW1lIGZvciB0aGUgY29udHJvbC5cbiAqXG4gKiBgRm9ybUdyb3VwYCBhY2NlcHRzIGFuIG9wdGlvbmFsIHR5cGUgcGFyYW1ldGVyIGBUQ29udHJvbGAsIHdoaWNoIGlzIGFuIG9iamVjdCB0eXBlIHdpdGggaW5uZXJcbiAqIGNvbnRyb2wgdHlwZXMgYXMgdmFsdWVzLlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKlxuICogIyMjIENyZWF0ZSBhIGZvcm0gZ3JvdXAgd2l0aCAyIGNvbnRyb2xzXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ05hbmN5JywgVmFsaWRhdG9ycy5taW5MZW5ndGgoMikpLFxuICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ0RyZXcnKSxcbiAqIH0pO1xuICpcbiAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDsgJ0RyZXcnfVxuICogY29uc29sZS5sb2coZm9ybS5zdGF0dXMpOyAgLy8gJ1ZBTElEJ1xuICogYGBgXG4gKlxuICogIyMjIENyZWF0ZSBhIGZvcm0gZ3JvdXAgd2l0aCBhIGdyb3VwLWxldmVsIHZhbGlkYXRvclxuICpcbiAqIFlvdSBpbmNsdWRlIGdyb3VwLWxldmVsIHZhbGlkYXRvcnMgYXMgdGhlIHNlY29uZCBhcmcsIG9yIGdyb3VwLWxldmVsIGFzeW5jXG4gKiB2YWxpZGF0b3JzIGFzIHRoZSB0aGlyZCBhcmcuIFRoZXNlIGNvbWUgaW4gaGFuZHkgd2hlbiB5b3Ugd2FudCB0byBwZXJmb3JtIHZhbGlkYXRpb25cbiAqIHRoYXQgY29uc2lkZXJzIHRoZSB2YWx1ZSBvZiBtb3JlIHRoYW4gb25lIGNoaWxkIGNvbnRyb2wuXG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIHBhc3N3b3JkOiBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgcGFzc3dvcmRDb25maXJtOiBuZXcgRm9ybUNvbnRyb2woJycsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqIH0sIHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IpO1xuICpcbiAqXG4gKiBmdW5jdGlvbiBwYXNzd29yZE1hdGNoVmFsaWRhdG9yKGc6IEZvcm1Hcm91cCkge1xuICogICAgcmV0dXJuIGcuZ2V0KCdwYXNzd29yZCcpLnZhbHVlID09PSBnLmdldCgncGFzc3dvcmRDb25maXJtJykudmFsdWVcbiAqICAgICAgID8gbnVsbCA6IHsnbWlzbWF0Y2gnOiB0cnVlfTtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIExpa2UgYEZvcm1Db250cm9sYCBpbnN0YW5jZXMsIHlvdSBjaG9vc2UgdG8gcGFzcyBpblxuICogdmFsaWRhdG9ycyBhbmQgYXN5bmMgdmFsaWRhdG9ycyBhcyBwYXJ0IG9mIGFuIG9wdGlvbnMgb2JqZWN0LlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBwYXNzd29yZDogbmV3IEZvcm1Db250cm9sKCcnKVxuICogICBwYXNzd29yZENvbmZpcm06IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqIH0sIHsgdmFsaWRhdG9yczogcGFzc3dvcmRNYXRjaFZhbGlkYXRvciwgYXN5bmNWYWxpZGF0b3JzOiBvdGhlclZhbGlkYXRvciB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBTZXQgdGhlIHVwZGF0ZU9uIHByb3BlcnR5IGZvciBhbGwgY29udHJvbHMgaW4gYSBmb3JtIGdyb3VwXG4gKlxuICogVGhlIG9wdGlvbnMgb2JqZWN0IGlzIHVzZWQgdG8gc2V0IGEgZGVmYXVsdCB2YWx1ZSBmb3IgZWFjaCBjaGlsZFxuICogY29udHJvbCdzIGB1cGRhdGVPbmAgcHJvcGVydHkuIElmIHlvdSBzZXQgYHVwZGF0ZU9uYCB0byBgJ2JsdXInYCBhdCB0aGVcbiAqIGdyb3VwIGxldmVsLCBhbGwgY2hpbGQgY29udHJvbHMgZGVmYXVsdCB0byAnYmx1cicsIHVubGVzcyB0aGUgY2hpbGRcbiAqIGhhcyBleHBsaWNpdGx5IHNwZWNpZmllZCBhIGRpZmZlcmVudCBgdXBkYXRlT25gIHZhbHVlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjID0gbmV3IEZvcm1Hcm91cCh7XG4gKiAgIG9uZTogbmV3IEZvcm1Db250cm9sKClcbiAqIH0sIHsgdXBkYXRlT246ICdibHVyJyB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBVc2luZyBhIEZvcm1Hcm91cCB3aXRoIG9wdGlvbmFsIGNvbnRyb2xzXG4gKlxuICogSXQgaXMgcG9zc2libGUgdG8gaGF2ZSBvcHRpb25hbCBjb250cm9scyBpbiBhIEZvcm1Hcm91cC4gQW4gb3B0aW9uYWwgY29udHJvbCBjYW4gYmUgcmVtb3ZlZCBsYXRlclxuICogdXNpbmcgYHJlbW92ZUNvbnRyb2xgLCBhbmQgY2FuIGJlIG9taXR0ZWQgd2hlbiBjYWxsaW5nIGByZXNldGAuIE9wdGlvbmFsIGNvbnRyb2xzIG11c3QgYmVcbiAqIGRlY2xhcmVkIG9wdGlvbmFsIGluIHRoZSBncm91cCdzIHR5cGUuXG4gKlxuICogYGBgdHNcbiAqIGNvbnN0IGMgPSBuZXcgRm9ybUdyb3VwPHtvbmU/OiBGb3JtQ29udHJvbDxzdHJpbmc+fT4oe1xuICogICBvbmU6IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqIH0pO1xuICogYGBgXG4gKlxuICogTm90aWNlIHRoYXQgYGMudmFsdWUub25lYCBoYXMgdHlwZSBgc3RyaW5nfG51bGx8dW5kZWZpbmVkYC4gVGhpcyBpcyBiZWNhdXNlIGNhbGxpbmcgYGMucmVzZXQoe30pYFxuICogd2l0aG91dCBwcm92aWRpbmcgdGhlIG9wdGlvbmFsIGtleSBgb25lYCB3aWxsIGNhdXNlIGl0IHRvIGJlY29tZSBgbnVsbGAuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgRm9ybUdyb3VwPFRDb250cm9sIGV4dGVuZHMge1tLIGluIGtleW9mIFRDb250cm9sXTogQWJzdHJhY3RDb250cm9sPGFueT59ID0gYW55PiBleHRlbmRzXG4gICAgQWJzdHJhY3RDb250cm9sPFxuICAgICAgICDJtVR5cGVkT3JVbnR5cGVkPFRDb250cm9sLCDJtUZvcm1Hcm91cFZhbHVlPFRDb250cm9sPiwgYW55PixcbiAgICAgICAgybVUeXBlZE9yVW50eXBlZDxUQ29udHJvbCwgybVGb3JtR3JvdXBSYXdWYWx1ZTxUQ29udHJvbD4sIGFueT4+IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEZvcm1Hcm91cGAgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb250cm9scyBBIGNvbGxlY3Rpb24gb2YgY2hpbGQgY29udHJvbHMuIFRoZSBrZXkgZm9yIGVhY2ggY2hpbGQgaXMgdGhlIG5hbWVcbiAgICogdW5kZXIgd2hpY2ggaXQgaXMgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhbGlkYXRvck9yT3B0cyBBIHN5bmNocm9ub3VzIHZhbGlkYXRvciBmdW5jdGlvbiwgb3IgYW4gYXJyYXkgb2ZcbiAgICogc3VjaCBmdW5jdGlvbnMsIG9yIGFuIGBBYnN0cmFjdENvbnRyb2xPcHRpb25zYCBvYmplY3QgdGhhdCBjb250YWlucyB2YWxpZGF0aW9uIGZ1bmN0aW9uc1xuICAgKiBhbmQgYSB2YWxpZGF0aW9uIHRyaWdnZXIuXG4gICAqXG4gICAqIEBwYXJhbSBhc3luY1ZhbGlkYXRvciBBIHNpbmdsZSBhc3luYyB2YWxpZGF0b3Igb3IgYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uc1xuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb250cm9sczogVENvbnRyb2wsIHZhbGlkYXRvck9yT3B0cz86IFZhbGlkYXRvckZufFZhbGlkYXRvckZuW118QWJzdHJhY3RDb250cm9sT3B0aW9uc3xudWxsLFxuICAgICAgYXN5bmNWYWxpZGF0b3I/OiBBc3luY1ZhbGlkYXRvckZufEFzeW5jVmFsaWRhdG9yRm5bXXxudWxsKSB7XG4gICAgc3VwZXIocGlja1ZhbGlkYXRvcnModmFsaWRhdG9yT3JPcHRzKSwgcGlja0FzeW5jVmFsaWRhdG9ycyhhc3luY1ZhbGlkYXRvciwgdmFsaWRhdG9yT3JPcHRzKSk7XG4gICAgdGhpcy5jb250cm9scyA9IGNvbnRyb2xzO1xuICAgIHRoaXMuX2luaXRPYnNlcnZhYmxlcygpO1xuICAgIHRoaXMuX3NldFVwZGF0ZVN0cmF0ZWd5KHZhbGlkYXRvck9yT3B0cyk7XG4gICAgdGhpcy5fc2V0VXBDb250cm9scygpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7XG4gICAgICBvbmx5U2VsZjogdHJ1ZSxcbiAgICAgIC8vIElmIGBhc3luY1ZhbGlkYXRvcmAgaXMgcHJlc2VudCwgaXQgd2lsbCB0cmlnZ2VyIGNvbnRyb2wgc3RhdHVzIGNoYW5nZSBmcm9tIGBQRU5ESU5HYCB0b1xuICAgICAgLy8gYFZBTElEYCBvciBgSU5WQUxJRGAuIFRoZSBzdGF0dXMgc2hvdWxkIGJlIGJyb2FkY2FzdGVkIHZpYSB0aGUgYHN0YXR1c0NoYW5nZXNgIG9ic2VydmFibGUsXG4gICAgICAvLyBzbyB3ZSBzZXQgYGVtaXRFdmVudGAgdG8gYHRydWVgIHRvIGFsbG93IHRoYXQgZHVyaW5nIHRoZSBjb250cm9sIGNyZWF0aW9uIHByb2Nlc3MuXG4gICAgICBlbWl0RXZlbnQ6ICEhdGhpcy5hc3luY1ZhbGlkYXRvclxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGNvbnRyb2xzOiDJtVR5cGVkT3JVbnR5cGVkPFRDb250cm9sLCBUQ29udHJvbCwge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbDxhbnk+fT47XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNvbnRyb2wgd2l0aCB0aGUgZ3JvdXAncyBsaXN0IG9mIGNvbnRyb2xzLiBJbiBhIHN0cm9uZ2x5LXR5cGVkIGdyb3VwLCB0aGUgY29udHJvbFxuICAgKiBtdXN0IGJlIGluIHRoZSBncm91cCdzIHR5cGUgKHBvc3NpYmx5IGFzIGFuIG9wdGlvbmFsIGtleSkuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGRvZXMgbm90IHVwZGF0ZSB0aGUgdmFsdWUgb3IgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqIFVzZSB7QGxpbmsgRm9ybUdyb3VwI2FkZENvbnRyb2wgYWRkQ29udHJvbH0gaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZWdpc3RlciBpbiB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICovXG4gIHJlZ2lzdGVyQ29udHJvbDxLIGV4dGVuZHMgc3RyaW5nJmtleW9mIFRDb250cm9sPihuYW1lOiBLLCBjb250cm9sOiBUQ29udHJvbFtLXSk6IFRDb250cm9sW0tdO1xuICByZWdpc3RlckNvbnRyb2woXG4gICAgICB0aGlzOiBGb3JtR3JvdXA8e1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbDxhbnk+fT4sIG5hbWU6IHN0cmluZyxcbiAgICAgIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbDxhbnk+KTogQWJzdHJhY3RDb250cm9sPGFueT47XG5cbiAgcmVnaXN0ZXJDb250cm9sPEsgZXh0ZW5kcyBzdHJpbmcma2V5b2YgVENvbnRyb2w+KG5hbWU6IEssIGNvbnRyb2w6IFRDb250cm9sW0tdKTogVENvbnRyb2xbS10ge1xuICAgIGlmICh0aGlzLmNvbnRyb2xzW25hbWVdKSByZXR1cm4gKHRoaXMuY29udHJvbHMgYXMgYW55KVtuYW1lXTtcbiAgICB0aGlzLmNvbnRyb2xzW25hbWVdID0gY29udHJvbDtcbiAgICBjb250cm9sLnNldFBhcmVudCh0aGlzIGFzIEZvcm1Hcm91cCk7XG4gICAgY29udHJvbC5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UodGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKTtcbiAgICByZXR1cm4gY29udHJvbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb250cm9sIHRvIHRoaXMgZ3JvdXAuIEluIGEgc3Ryb25nbHktdHlwZWQgZ3JvdXAsIHRoZSBjb250cm9sIG11c3QgYmUgaW4gdGhlIGdyb3VwJ3MgdHlwZVxuICAgKiAocG9zc2libHkgYXMgYW4gb3B0aW9uYWwga2V5KS5cbiAgICpcbiAgICogSWYgYSBjb250cm9sIHdpdGggYSBnaXZlbiBuYW1lIGFscmVhZHkgZXhpc3RzLCBpdCB3b3VsZCAqbm90KiBiZSByZXBsYWNlZCB3aXRoIGEgbmV3IG9uZS5cbiAgICogSWYgeW91IHdhbnQgdG8gcmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLCB1c2UgdGhlIHtAbGluayBGb3JtR3JvdXAjc2V0Q29udHJvbCBzZXRDb250cm9sfVxuICAgKiBtZXRob2QgaW5zdGVhZC4gVGhpcyBtZXRob2QgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gYWRkIHRvIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1Hcm91cCBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYSBuZXdcbiAgICogICAgIGNvbnRyb2wgaXMgYWRkZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAqIGFkZGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBhZGRDb250cm9sKFxuICAgICAgdGhpczogRm9ybUdyb3VwPHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2w8YW55Pn0+LCBuYW1lOiBzdHJpbmcsXG4gICAgICBjb250cm9sOiBBYnN0cmFjdENvbnRyb2wsIG9wdGlvbnM/OiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0pOiB2b2lkO1xuICBhZGRDb250cm9sPEsgZXh0ZW5kcyBzdHJpbmcma2V5b2YgVENvbnRyb2w+KG5hbWU6IEssIGNvbnRyb2w6IFJlcXVpcmVkPFRDb250cm9sPltLXSwgb3B0aW9ucz86IHtcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuXG4gIH0pOiB2b2lkO1xuXG4gIGFkZENvbnRyb2w8SyBleHRlbmRzIHN0cmluZyZrZXlvZiBUQ29udHJvbD4obmFtZTogSywgY29udHJvbDogUmVxdWlyZWQ8VENvbnRyb2w+W0tdLCBvcHRpb25zOiB7XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIHJlbW92ZUNvbnRyb2wodGhpczogRm9ybUdyb3VwPHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2w8YW55Pn0+LCBuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiB7XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgfSk6IHZvaWQ7XG4gIHJlbW92ZUNvbnRyb2w8UyBleHRlbmRzIHN0cmluZz4obmFtZTogybVPcHRpb25hbEtleXM8VENvbnRyb2w+JlMsIG9wdGlvbnM/OiB7XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhbjtcbiAgfSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGNvbnRyb2wgZnJvbSB0aGlzIGdyb3VwLiBJbiBhIHN0cm9uZ2x5LXR5cGVkIGdyb3VwLCByZXF1aXJlZCBjb250cm9scyBjYW5ub3QgYmVcbiAgICogcmVtb3ZlZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWxzbyB1cGRhdGVzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgb2YgdGhlIGNvbnRyb2wuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVtb3ZlIGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGFcbiAgICogICAgIGNvbnRyb2wgaXMgcmVtb3ZlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogcmVtb3ZlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgcmVtb3ZlQ29udHJvbChuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IHtlbWl0RXZlbnQ/OiBib29sZWFuO30gPSB7fSk6IHZvaWQge1xuICAgIGlmICgodGhpcy5jb250cm9scyBhcyBhbnkpW25hbWVdKVxuICAgICAgKHRoaXMuY29udHJvbHMgYXMgYW55KVtuYW1lXS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIGRlbGV0ZSAoKHRoaXMuY29udHJvbHMgYXMgYW55KVtuYW1lXSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLiBJbiBhIHN0cm9uZ2x5LXR5cGVkIGdyb3VwLCB0aGUgY29udHJvbCBtdXN0IGJlIGluIHRoZSBncm91cCdzIHR5cGVcbiAgICogKHBvc3NpYmx5IGFzIGFuIG9wdGlvbmFsIGtleSkuXG4gICAqXG4gICAqIElmIGEgY29udHJvbCB3aXRoIGEgZ2l2ZW4gbmFtZSBkb2VzIG5vdCBleGlzdCBpbiB0aGlzIGBGb3JtR3JvdXBgLCBpdCB3aWxsIGJlIGFkZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlcGxhY2UgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUdyb3VwIGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhblxuICAgKiAgICAgZXhpc3RpbmcgY29udHJvbCBpcyByZXBsYWNlZC5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgaXNcbiAgICogcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHNldENvbnRyb2w8SyBleHRlbmRzIHN0cmluZyZrZXlvZiBUQ29udHJvbD4obmFtZTogSywgY29udHJvbDogVENvbnRyb2xbS10sIG9wdGlvbnM/OiB7XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhblxuICB9KTogdm9pZDtcbiAgc2V0Q29udHJvbChcbiAgICAgIHRoaXM6IEZvcm1Hcm91cDx7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sPGFueT59PiwgbmFtZTogc3RyaW5nLFxuICAgICAgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBvcHRpb25zPzoge2VtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcblxuICBzZXRDb250cm9sPEsgZXh0ZW5kcyBzdHJpbmcma2V5b2YgVENvbnRyb2w+KG5hbWU6IEssIGNvbnRyb2w6IFRDb250cm9sW0tdLCBvcHRpb25zOiB7XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgdGhpcy5jb250cm9sc1tuYW1lXS5fcmVnaXN0ZXJPbkNvbGxlY3Rpb25DaGFuZ2UoKCkgPT4ge30pO1xuICAgIGRlbGV0ZSAodGhpcy5jb250cm9sc1tuYW1lXSk7XG4gICAgaWYgKGNvbnRyb2wpIHRoaXMucmVnaXN0ZXJDb250cm9sKG5hbWUsIGNvbnRyb2wpO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlcmUgaXMgYW4gZW5hYmxlZCBjb250cm9sIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBSZXBvcnRzIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scy4gSWYgeW91J2QgbGlrZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBncm91cFxuICAgKiBvbmx5LCB1c2Uge0BsaW5rIEFic3RyYWN0Q29udHJvbCNnZXQgZ2V0fSBpbnN0ZWFkLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbE5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byBjaGVjayBmb3IgZXhpc3RlbmNlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqXG4gICAqIEByZXR1cm5zIGZhbHNlIGZvciBkaXNhYmxlZCBjb250cm9scywgdHJ1ZSBvdGhlcndpc2UuXG4gICAqL1xuICBjb250YWluczxLIGV4dGVuZHMgc3RyaW5nPihjb250cm9sTmFtZTogSyk6IGJvb2xlYW47XG4gIGNvbnRhaW5zKHRoaXM6IEZvcm1Hcm91cDx7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sPGFueT59PiwgY29udHJvbE5hbWU6IHN0cmluZyk6IGJvb2xlYW47XG5cbiAgY29udGFpbnM8SyBleHRlbmRzIHN0cmluZyZrZXlvZiBUQ29udHJvbD4oY29udHJvbE5hbWU6IEspOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jb250cm9scy5oYXNPd25Qcm9wZXJ0eShjb250cm9sTmFtZSkgJiYgdGhpcy5jb250cm9sc1tjb250cm9sTmFtZV0uZW5hYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHRoYXQgbWF0Y2hlc1xuICAgKiB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cCwgd2l0aCBjb250cm9sIG5hbWVzIGFzIGtleXMuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqICMjIyBTZXQgdGhlIGNvbXBsZXRlIHZhbHVlIGZvciB0aGUgZm9ybSBncm91cFxuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiBmb3JtLnNldFZhbHVlKHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfSk7XG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogJ0RyZXcnfVxuICAgKiBgYGBcbiAgICpcbiAgICogQHRocm93cyBXaGVuIHN0cmljdCBjaGVja3MgZmFpbCwgc3VjaCBhcyBzZXR0aW5nIHRoZSB2YWx1ZSBvZiBhIGNvbnRyb2xcbiAgICogdGhhdCBkb2Vzbid0IGV4aXN0IG9yIGlmIHlvdSBleGNsdWRlIGEgdmFsdWUgb2YgYSBjb250cm9sIHRoYXQgZG9lcyBleGlzdC5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFRoZSBuZXcgdmFsdWUgZm9yIHRoZSBjb250cm9sIHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXNcbiAgICogYW5kIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICogVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHlcbiAgICogdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZSBpcyB1cGRhdGVkLlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBvdmVycmlkZSBzZXRWYWx1ZSh2YWx1ZTogybVGb3JtR3JvdXBSYXdWYWx1ZTxUQ29udHJvbD4sIG9wdGlvbnM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW4sXG4gICAgZW1pdEV2ZW50PzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICBhc3NlcnRBbGxWYWx1ZXNQcmVzZW50KHRoaXMsIHRydWUsIHZhbHVlKTtcbiAgICAoT2JqZWN0LmtleXModmFsdWUpIGFzIEFycmF5PGtleW9mIFRDb250cm9sPikuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIGFzc2VydENvbnRyb2xQcmVzZW50KHRoaXMsIHRydWUsIG5hbWUgYXMgYW55KTtcbiAgICAgICh0aGlzLmNvbnRyb2xzIGFzIGFueSlbbmFtZV0uc2V0VmFsdWUoXG4gICAgICAgICAgKHZhbHVlIGFzIGFueSlbbmFtZV0sIHtvbmx5U2VsZjogdHJ1ZSwgZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXRjaGVzIHRoZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggY29udHJvbFxuICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAqIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogSXQgYWNjZXB0cyBib3RoIHN1cGVyLXNldHMgYW5kIHN1Yi1zZXRzIG9mIHRoZSBncm91cCB3aXRob3V0IHRocm93aW5nIGFuIGVycm9yLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgUGF0Y2ggdGhlIHZhbHVlIGZvciBhIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgpLFxuICAgKiAgICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woKVxuICAgKiB9KTtcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAgLy8ge2ZpcnN0OiBudWxsLCBsYXN0OiBudWxsfVxuICAgKlxuICAgKiBmb3JtLnBhdGNoVmFsdWUoe2ZpcnN0OiAnTmFuY3knfSk7XG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogJ05hbmN5JywgbGFzdDogbnVsbH1cbiAgICogYGBgXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgb2JqZWN0IHRoYXQgbWF0Y2hlcyB0aGUgc3RydWN0dXJlIG9mIHRoZSBncm91cC5cbiAgICogQHBhcmFtIG9wdGlvbnMgQ29uZmlndXJhdGlvbiBvcHRpb25zIHRoYXQgZGV0ZXJtaW5lIGhvdyB0aGUgY29udHJvbCBwcm9wYWdhdGVzIGNoYW5nZXMgYW5kXG4gICAqIGVtaXRzIGV2ZW50cyBhZnRlciB0aGUgdmFsdWUgaXMgcGF0Y2hlZC5cbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIHRydWUuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIHZhbHVlXG4gICAqIGlzIHVwZGF0ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC4gVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyBhcmUgcGFzc2VkIHRvXG4gICAqIHRoZSB7QGxpbmsgQWJzdHJhY3RDb250cm9sI3VwZGF0ZVZhbHVlQW5kVmFsaWRpdHkgdXBkYXRlVmFsdWVBbmRWYWxpZGl0eX0gbWV0aG9kLlxuICAgKi9cbiAgb3ZlcnJpZGUgcGF0Y2hWYWx1ZSh2YWx1ZTogybVGb3JtR3JvdXBWYWx1ZTxUQ29udHJvbD4sIG9wdGlvbnM6IHtcbiAgICBvbmx5U2VsZj86IGJvb2xlYW4sXG4gICAgZW1pdEV2ZW50PzogYm9vbGVhblxuICB9ID0ge30pOiB2b2lkIHtcbiAgICAvLyBFdmVuIHRob3VnaCB0aGUgYHZhbHVlYCBhcmd1bWVudCB0eXBlIGRvZXNuJ3QgYWxsb3cgYG51bGxgIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMsIHRoZVxuICAgIC8vIGBwYXRjaFZhbHVlYCBjYW4gYmUgY2FsbGVkIHJlY3Vyc2l2ZWx5IGFuZCBpbm5lciBkYXRhIHN0cnVjdHVyZXMgbWlnaHQgaGF2ZSB0aGVzZSB2YWx1ZXMsIHNvXG4gICAgLy8gd2UganVzdCBpZ25vcmUgc3VjaCBjYXNlcyB3aGVuIGEgZmllbGQgY29udGFpbmluZyBGb3JtR3JvdXAgaW5zdGFuY2UgcmVjZWl2ZXMgYG51bGxgIG9yXG4gICAgLy8gYHVuZGVmaW5lZGAgYXMgYSB2YWx1ZS5cbiAgICBpZiAodmFsdWUgPT0gbnVsbCAvKiBib3RoIGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgKi8pIHJldHVybjtcbiAgICAoT2JqZWN0LmtleXModmFsdWUpIGFzIEFycmF5PGtleW9mIFRDb250cm9sPikuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIC8vIFRoZSBjb21waWxlciBjYW5ub3Qgc2VlIHRocm91Z2ggdGhlIHVuaW5zdGFudGlhdGVkIGNvbmRpdGlvbmFsIHR5cGUgb2YgYHRoaXMuY29udHJvbHNgLCBzb1xuICAgICAgLy8gYGFzIGFueWAgaXMgcmVxdWlyZWQuXG4gICAgICBjb25zdCBjb250cm9sID0gKHRoaXMuY29udHJvbHMgYXMgYW55KVtuYW1lXTtcbiAgICAgIGlmIChjb250cm9sKSB7XG4gICAgICAgIGNvbnRyb2wucGF0Y2hWYWx1ZShcbiAgICAgICAgICAgIC8qIEd1YXJhbnRlZWQgdG8gYmUgcHJlc2VudCwgZHVlIHRvIHRoZSBvdXRlciBmb3JFYWNoLiAqLyB2YWx1ZVxuICAgICAgICAgICAgICAgIFtuYW1lIGFzIGtleW9mIMm1Rm9ybUdyb3VwVmFsdWU8VENvbnRyb2w+XSEsXG4gICAgICAgICAgICB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBgRm9ybUdyb3VwYCwgbWFya3MgYWxsIGRlc2NlbmRhbnRzIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgIGFuZCBzZXRzXG4gICAqIHRoZSB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZXMsIG9yIG51bGwgaWYgbm8gZGVmYXVsdHMgd2VyZSBwcm92aWRlZC5cbiAgICpcbiAgICogWW91IHJlc2V0IHRvIGEgc3BlY2lmaWMgZm9ybSBzdGF0ZSBieSBwYXNzaW5nIGluIGEgbWFwIG9mIHN0YXRlc1xuICAgKiB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB5b3VyIGZvcm0sIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLiBUaGUgc3RhdGVcbiAgICogaXMgYSBzdGFuZGFsb25lIHZhbHVlIG9yIGEgZm9ybSBzdGF0ZSBvYmplY3Qgd2l0aCBib3RoIGEgdmFsdWUgYW5kIGEgZGlzYWJsZWRcbiAgICogc3RhdHVzLlxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgUmVzZXRzIHRoZSBjb250cm9sIHdpdGggYW4gaW5pdGlhbCB2YWx1ZSxcbiAgICogb3IgYW4gb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgaW5pdGlhbCB2YWx1ZSBhbmQgZGlzYWJsZWQgc3RhdGUuXG4gICAqXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgd2hlbiB0aGUgZ3JvdXAgaXMgcmVzZXQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sLCBhbmQgbm90IGl0cyBwYXJlbnQuIERlZmF1bHQgaXNcbiAgICogZmFsc2UuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYFxuICAgKiBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzIHJlc2V0LlxuICAgKiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICpcbiAgICogIyMjIFJlc2V0IHRoZSBmb3JtIGdyb3VwIHZhbHVlc1xuICAgKlxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnZmlyc3QgbmFtZScpLFxuICAgKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnbGFzdCBuYW1lJylcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2ZpcnN0OiAnZmlyc3QgbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnfVxuICAgKlxuICAgKiBmb3JtLnJlc2V0KHsgZmlyc3Q6ICduYW1lJywgbGFzdDogJ2xhc3QgbmFtZScgfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2ZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnfVxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIFJlc2V0IHRoZSBmb3JtIGdyb3VwIHZhbHVlcyBhbmQgZGlzYWJsZWQgc3RhdHVzXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnZmlyc3QgbmFtZScpLFxuICAgKiAgIGxhc3Q6IG5ldyBGb3JtQ29udHJvbCgnbGFzdCBuYW1lJylcbiAgICogfSk7XG4gICAqXG4gICAqIGZvcm0ucmVzZXQoe1xuICAgKiAgIGZpcnN0OiB7dmFsdWU6ICduYW1lJywgZGlzYWJsZWQ6IHRydWV9LFxuICAgKiAgIGxhc3Q6ICdsYXN0J1xuICAgKiB9KTtcbiAgICpcbiAgICogY29uc29sZS5sb2coZm9ybS52YWx1ZSk7ICAvLyB7bGFzdDogJ2xhc3QnfVxuICAgKiBjb25zb2xlLmxvZyhmb3JtLmdldCgnZmlyc3QnKS5zdGF0dXMpOyAgLy8gJ0RJU0FCTEVEJ1xuICAgKiBgYGBcbiAgICovXG4gIG92ZXJyaWRlIHJlc2V0KFxuICAgICAgdmFsdWU6IMm1VHlwZWRPclVudHlwZWQ8VENvbnRyb2wsIMm1Rm9ybUdyb3VwVmFsdWU8VENvbnRyb2w+LCBhbnk+ID0ge30gYXMgdW5rbm93biBhc1xuICAgICAgICAgIMm1Rm9ybUdyb3VwVmFsdWU8VENvbnRyb2w+LFxuICAgICAgb3B0aW9uczoge29ubHlTZWxmPzogYm9vbGVhbiwgZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSk6IHZvaWQge1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbCwgbmFtZSkgPT4ge1xuICAgICAgY29udHJvbC5yZXNldCgodmFsdWUgYXMgYW55KVtuYW1lXSwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFJldHJpZXZlcyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0UmF3VmFsdWUoKTogybVUeXBlZE9yVW50eXBlZDxUQ29udHJvbCwgybVGb3JtR3JvdXBSYXdWYWx1ZTxUQ29udHJvbD4sIGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbih7fSwgKGFjYywgY29udHJvbCwgbmFtZSkgPT4ge1xuICAgICAgKGFjYyBhcyBhbnkpW25hbWVdID0gKGNvbnRyb2wgYXMgYW55KS5nZXRSYXdWYWx1ZSgpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9KSBhcyBhbnk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW4ge1xuICAgIGxldCBzdWJ0cmVlVXBkYXRlZCA9IHRoaXMuX3JlZHVjZUNoaWxkcmVuKGZhbHNlLCAodXBkYXRlZDogYm9vbGVhbiwgY2hpbGQpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSk7XG4gICAgaWYgKHN1YnRyZWVVcGRhdGVkKSB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlfSk7XG4gICAgcmV0dXJuIHN1YnRyZWVVcGRhdGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfZm9yRWFjaENoaWxkKGNiOiAodjogYW55LCBrOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBUaGUgbGlzdCBvZiBjb250cm9scyBjYW4gY2hhbmdlIChmb3IgZXguIGNvbnRyb2xzIG1pZ2h0IGJlIHJlbW92ZWQpIHdoaWxlIHRoZSBsb29wXG4gICAgICAvLyBpcyBydW5uaW5nIChhcyBhIHJlc3VsdCBvZiBpbnZva2luZyBGb3JtcyBBUEkgaW4gYHZhbHVlQ2hhbmdlc2Agc3Vic2NyaXB0aW9uKSwgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gbnVsbCBjaGVjayBiZWZvcmUgaW52b2tpbmcgdGhlIGNhbGxiYWNrLlxuICAgICAgY29uc3QgY29udHJvbCA9ICh0aGlzLmNvbnRyb2xzIGFzIGFueSlba2V5XTtcbiAgICAgIGNvbnRyb2wgJiYgY2IoY29udHJvbCwga2V5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwQ29udHJvbHMoKTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICAodGhpcyBhcyB7dmFsdWU6IGFueX0pLnZhbHVlID0gdGhpcy5fcmVkdWNlVmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgW2NvbnRyb2xOYW1lLCBjb250cm9sXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNvbnRyb2xzKSkge1xuICAgICAgaWYgKHRoaXMuY29udGFpbnMoY29udHJvbE5hbWUgYXMgYW55KSAmJiBjb25kaXRpb24oY29udHJvbCBhcyBhbnkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VWYWx1ZSgpOiBQYXJ0aWFsPFRDb250cm9sPiB7XG4gICAgbGV0IGFjYzogUGFydGlhbDxUQ29udHJvbD4gPSB7fTtcbiAgICByZXR1cm4gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oYWNjLCAoYWNjLCBjb250cm9sLCBuYW1lKSA9PiB7XG4gICAgICBpZiAoY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgYWNjW25hbWVdID0gY29udHJvbC52YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDaGlsZHJlbjxULCBLIGV4dGVuZHMga2V5b2YgVENvbnRyb2w+KFxuICAgICAgaW5pdFZhbHVlOiBULCBmbjogKGFjYzogVCwgY29udHJvbDogVENvbnRyb2xbS10sIG5hbWU6IEspID0+IFQpOiBUIHtcbiAgICBsZXQgcmVzID0gaW5pdFZhbHVlO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogVENvbnRyb2xbS10sIG5hbWU6IEspID0+IHtcbiAgICAgIHJlcyA9IGZuKHJlcywgY29udHJvbCwgbmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjb250cm9sTmFtZSBvZiAoT2JqZWN0LmtleXModGhpcy5jb250cm9scykgYXMgQXJyYXk8a2V5b2YgVENvbnRyb2w+KSkge1xuICAgICAgaWYgKCh0aGlzLmNvbnRyb2xzIGFzIGFueSlbY29udHJvbE5hbWVdLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb250cm9scykubGVuZ3RoID4gMCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfZmluZChuYW1lOiBzdHJpbmd8bnVtYmVyKTogQWJzdHJhY3RDb250cm9sfG51bGwge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmhhc093blByb3BlcnR5KG5hbWUgYXMgc3RyaW5nKSA/XG4gICAgICAgICh0aGlzLmNvbnRyb2xzIGFzIGFueSlbbmFtZSBhcyBrZXlvZiBUQ29udHJvbF0gOlxuICAgICAgICBudWxsO1xuICB9XG59XG5cbmludGVyZmFjZSBVbnR5cGVkRm9ybUdyb3VwQ3RvciB7XG4gIG5ldyhjb250cm9sczoge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IFVudHlwZWRGb3JtR3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBwcmVzZW5jZSBvZiBhbiBleHBsaWNpdCBgcHJvdG90eXBlYCBwcm9wZXJ0eSBwcm92aWRlcyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgYXBwcyB0aGF0XG4gICAqIG1hbnVhbGx5IGluc3BlY3QgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICovXG4gIHByb3RvdHlwZTogRm9ybUdyb3VwPGFueT47XG59XG5cbi8qKlxuICogVW50eXBlZEZvcm1Hcm91cCBpcyBhIG5vbi1zdHJvbmdseS10eXBlZCB2ZXJzaW9uIG9mIEBzZWUgRm9ybUdyb3VwLlxuICogTm90ZTogdGhpcyBpcyB1c2VkIGZvciBtaWdyYXRpb24gcHVycG9zZXMgb25seS4gUGxlYXNlIGF2b2lkIHVzaW5nIGl0IGRpcmVjdGx5IGluIHlvdXIgY29kZSBhbmRcbiAqIHByZWZlciBgRm9ybUNvbnRyb2xgIGluc3RlYWQsIHVubGVzcyB5b3UgaGF2ZSBiZWVuIG1pZ3JhdGVkIHRvIGl0IGF1dG9tYXRpY2FsbHkuXG4gKi9cbmV4cG9ydCB0eXBlIFVudHlwZWRGb3JtR3JvdXAgPSBGb3JtR3JvdXA8YW55PjtcblxuZXhwb3J0IGNvbnN0IFVudHlwZWRGb3JtR3JvdXA6IFVudHlwZWRGb3JtR3JvdXBDdG9yID0gRm9ybUdyb3VwO1xuXG5leHBvcnQgY29uc3QgaXNGb3JtR3JvdXAgPSAoY29udHJvbDogdW5rbm93bik6IGNvbnRyb2wgaXMgRm9ybUdyb3VwID0+IGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtR3JvdXA7XG5cbmV4cG9ydCBjbGFzcyBGb3JtUmVjb3JkPFRDb250cm9sIGV4dGVuZHMgQWJzdHJhY3RDb250cm9sPMm1VmFsdWU8VENvbnRyb2w+LCDJtVJhd1ZhbHVlPFRDb250cm9sPj4gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWJzdHJhY3RDb250cm9sPiBleHRlbmRzXG4gICAgRm9ybUdyb3VwPHtba2V5OiBzdHJpbmddOiBUQ29udHJvbH0+IHt9XG5cbi8qKlxuICogVHJhY2tzIHRoZSB2YWx1ZSBhbmQgdmFsaWRpdHkgc3RhdGUgb2YgYSBjb2xsZWN0aW9uIG9mIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLCBlYWNoIG9mIHdoaWNoIGhhc1xuICogdGhlIHNhbWUgdmFsdWUgdHlwZS5cbiAqXG4gKiBgRm9ybVJlY29yZGAgaXMgdmVyeSBzaW1pbGFyIHRvIHtAc2VlIEZvcm1Hcm91cH0sIGV4Y2VwdCBpdCBlbmZvcmNlcyB0aGF0IGFsbCBjb250cm9scyBpbiB0aGUgZ3JvdXAgaGF2ZSB0aGUgc2FtZSB0eXBlLFxuICogYW5kIGNhbiBiZSB1c2VkIHdpdGggYW4gb3Blbi1lbmRlZCwgZHluYW1pY2FsbHkgY2hhbmdpbmcgc2V0IG9mIGNvbnRyb2xzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGb3JtUmVjb3JkPFRDb250cm9sPiB7XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjb250cm9sIHdpdGggdGhlIHJlY29yZHMncyBsaXN0IG9mIGNvbnRyb2xzLlxuICAgKlxuICAgKiB7QHNlZSBGb3JtR3JvdXAjcmVnaXN0ZXJDb250cm9sfVxuICAgKi9cbiAgcmVnaXN0ZXJDb250cm9sKG5hbWU6IHN0cmluZywgY29udHJvbDogVENvbnRyb2wpOiBUQ29udHJvbDtcblxuICAvKipcbiAgICogQWRkIGEgY29udHJvbCB0byB0aGlzIGdyb3VwLlxuICAgKlxuICAgKiB7QHNlZSBGb3JtR3JvdXAjYWRkQ29udHJvbH1cbiAgICovXG4gIGFkZENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBUQ29udHJvbCwgb3B0aW9ucz86IHtlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGNvbnRyb2wgZnJvbSB0aGlzIGdyb3VwLlxuICAgKlxuICAgKiB7QHNlZSBGb3JtR3JvdXAjcmVtb3ZlQ29udHJvbH1cbiAgICovXG4gIHJlbW92ZUNvbnRyb2wobmFtZTogc3RyaW5nLCBvcHRpb25zPzoge2VtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgKlxuICAgKiB7QHNlZSBGb3JtR3JvdXAjc2V0Q29udHJvbH1cbiAgICovXG4gIHNldENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBUQ29udHJvbCwgb3B0aW9ucz86IHtlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlcmUgaXMgYW4gZW5hYmxlZCBjb250cm9sIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiB7QHNlZSBGb3JtR3JvdXAjY29udGFpbnN9XG4gICAqL1xuICBjb250YWlucyhjb250cm9sTmFtZTogc3RyaW5nKTogYm9vbGVhbjtcblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtUmVjb3JkYC4gSXQgYWNjZXB0cyBhbiBvYmplY3QgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy5cbiAgICpcbiAgICoge0BzZWUgRm9ybUdyb3VwI3NldFZhbHVlfVxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IHtba2V5OiBzdHJpbmddOiDJtVZhbHVlPFRDb250cm9sPn0sIG9wdGlvbnM/OiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybVJlY29yZGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggY29udHJvbFxuICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAqIGluIHRoZSBncm91cC5cbiAgICpcbiAgICoge0BzZWUgRm9ybUdyb3VwI3BhdGNoVmFsdWV9XG4gICAqL1xuICBwYXRjaFZhbHVlKHZhbHVlOiB7W2tleTogc3RyaW5nXTogybVWYWx1ZTxUQ29udHJvbD59LCBvcHRpb25zPzoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuXG4gIH0pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGBGb3JtUmVjb3JkYCwgbWFya3MgYWxsIGRlc2NlbmRhbnRzIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgIGFuZCBzZXRzXG4gICAqIHRoZSB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gbnVsbC5cbiAgICpcbiAgICoge0BzZWUgRm9ybUdyb3VwI3Jlc2V0fVxuICAgKi9cbiAgcmVzZXQodmFsdWU/OiB7W2tleTogc3RyaW5nXTogybVWYWx1ZTxUQ29udHJvbD59LCBvcHRpb25zPzoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuXG4gIH0pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBgRm9ybVJlY29yZGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIHtAc2VlIEZvcm1Hcm91cCNnZXRSYXdWYWx1ZX1cbiAgICovXG4gIGdldFJhd1ZhbHVlKCk6IHtba2V5OiBzdHJpbmddOiDJtVJhd1ZhbHVlPFRDb250cm9sPn07XG59XG5cbmV4cG9ydCBjb25zdCBpc0Zvcm1SZWNvcmQgPSAoY29udHJvbDogdW5rbm93bik6IGNvbnRyb2wgaXMgRm9ybVJlY29yZCA9PlxuICAgIGNvbnRyb2wgaW5zdGFuY2VvZiBGb3JtUmVjb3JkO1xuIl19