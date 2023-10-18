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
 * `FormGroup` is one of the four fundamental building blocks used to define forms in Angular,
 * along with `FormControl`, `FormArray`, and `FormRecord`.
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * `FormGroup` is intended for use cases where the keys are known ahead of time.
 * If you need to dynamically add and remove controls, use {@link FormRecord} instead.
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
 * ### The type argument, and optional controls
 *
 * `FormGroup` accepts one generic argument, which is an object containing its inner controls.
 * This type will usually be inferred automatically, but you can always specify it explicitly if you
 * wish.
 *
 * If you have controls that are optional (i.e. they can be removed, you can use the `?` in the
 * type):
 *
 * ```
 * const form = new FormGroup<{
 *   first: FormControl<string|null>,
 *   middle?: FormControl<string|null>, // Middle name is optional.
 *   last: FormControl<string|null>,
 * }>({
 *   first: new FormControl('Nancy'),
 *   last: new FormControl('Drew'),
 * });
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
        (typeof ngDevMode === 'undefined' || ngDevMode) && validateFormGroupControls(controls);
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
            control.reset(value ? value[name] : null, { onlySelf: true, emitEvent: options.emitEvent });
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
/**
 * Will validate that none of the controls has a key with a dot
 * Throws other wise
 */
function validateFormGroupControls(controls) {
    const invalidKeys = Object.keys(controls).filter(key => key.includes('.'));
    if (invalidKeys.length > 0) {
        // TODO: make this an error once there are no more uses in G3
        console.warn(`FormGroup keys cannot include \`.\`, please replace the keys for: ${invalidKeys.join(',')}.`);
    }
}
export const UntypedFormGroup = FormGroup;
/**
 * @description
 * Asserts that the given control is an instance of `FormGroup`
 *
 * @publicApi
 */
export const isFormGroup = (control) => control instanceof FormGroup;
/**
 * Tracks the value and validity state of a collection of `FormControl` instances, each of which has
 * the same value type.
 *
 * `FormRecord` is very similar to {@link FormGroup}, except it can be used with a dynamic keys,
 * with controls added and removed as needed.
 *
 * `FormRecord` accepts one generic argument, which describes the type of the controls it contains.
 *
 * @usageNotes
 *
 * ```
 * let numbers = new FormRecord({bill: new FormControl('415-123-456')});
 * numbers.addControl('bob', new FormControl('415-234-567'));
 * numbers.removeControl('bill');
 * ```
 *
 * @publicApi
 */
export class FormRecord extends FormGroup {
}
/**
 * @description
 * Asserts that the given control is an instance of `FormRecord`
 *
 * @publicApi
 */
export const isFormRecord = (control) => control instanceof FormRecord;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybV9ncm91cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9tb2RlbC9mb3JtX2dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQU1ILE9BQU8sRUFBQyxlQUFlLEVBQTBCLHNCQUFzQixFQUFFLG9CQUFvQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBcUMsTUFBTSxrQkFBa0IsQ0FBQztBQWlDaE07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnSEc7QUFDSCxNQUFNLE9BQU8sU0FBZ0YsU0FDekYsZUFFaUU7SUFDbkU7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsWUFDSSxRQUFrQixFQUFFLGVBQXVFLEVBQzNGLGNBQXlEO1FBQzNELEtBQUssQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLEVBQUUsbUJBQW1CLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDN0YsQ0FBQyxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxDQUFDLElBQUkseUJBQXlCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkYsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN0QixJQUFJLENBQUMsc0JBQXNCLENBQUM7WUFDMUIsUUFBUSxFQUFFLElBQUk7WUFDZCwwRkFBMEY7WUFDMUYsNkZBQTZGO1lBQzdGLHFGQUFxRjtZQUNyRixTQUFTLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjO1NBQ2pDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFtQkQsZUFBZSxDQUFrQyxJQUFPLEVBQUUsT0FBb0I7UUFDNUUsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUFFLE9BQVEsSUFBSSxDQUFDLFFBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDOUIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFpQixDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzlELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUF5QkQsVUFBVSxDQUFrQyxJQUFPLEVBQUUsT0FBOEIsRUFBRSxVQUVqRixFQUFFO1FBQ0osSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFTRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxhQUFhLENBQUMsSUFBWSxFQUFFLFVBQWtDLEVBQUU7UUFDOUQsSUFBSyxJQUFJLENBQUMsUUFBZ0IsQ0FBQyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLFFBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsMkJBQTJCLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckUsT0FBTyxDQUFFLElBQUksQ0FBQyxRQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEVBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUF1QkQsVUFBVSxDQUFrQyxJQUFPLEVBQUUsT0FBb0IsRUFBRSxVQUV2RSxFQUFFO1FBQ0osSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsMkJBQTJCLENBQUMsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkYsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLE9BQU87WUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQWVELFFBQVEsQ0FBa0MsV0FBYztRQUN0RCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ3pGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWtDRztJQUNNLFFBQVEsQ0FBQyxLQUFtQyxFQUFFLFVBR25ELEVBQUU7UUFDSixzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUEyQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMzRCxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQVcsQ0FBQyxDQUFDO1lBQzdDLElBQUksQ0FBQyxRQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FDaEMsS0FBYSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0E4Qkc7SUFDTSxVQUFVLENBQUMsS0FBZ0MsRUFBRSxVQUdsRCxFQUFFO1FBQ0oseUZBQXlGO1FBQ3pGLCtGQUErRjtRQUMvRiwwRkFBMEY7UUFDMUYsMEJBQTBCO1FBQzFCLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxpQ0FBaUM7WUFBRSxPQUFPO1FBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUEyQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMzRCw2RkFBNkY7WUFDN0Ysd0JBQXdCO1lBQ3hCLE1BQU0sT0FBTyxHQUFJLElBQUksQ0FBQyxRQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdDLElBQUksT0FBTyxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxVQUFVO2dCQUNkLHlEQUF5RCxDQUFDLEtBQUssQ0FDMUQsSUFBdUMsQ0FBRSxFQUM5QyxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO2FBQ3JEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdERztJQUNNLEtBQUssQ0FDVixRQUFtRSxFQUN0QyxFQUM3QixVQUFxRCxFQUFFO1FBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUF3QixFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxLQUFLLENBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBRSxLQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQzNGLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNNLFdBQVc7UUFDbEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDcEQsR0FBVyxDQUFDLElBQUksQ0FBQyxHQUFJLE9BQWUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNwRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsQ0FBUSxDQUFDO0lBQ1osQ0FBQztJQUVELGdCQUFnQjtJQUNQLG9CQUFvQjtRQUMzQixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDLE9BQWdCLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDM0UsT0FBTyxLQUFLLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFDSCxJQUFJLGNBQWM7WUFBRSxJQUFJLENBQUMsc0JBQXNCLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUNsRSxPQUFPLGNBQWMsQ0FBQztJQUN4QixDQUFDO0lBRUQsZ0JBQWdCO0lBQ1AsYUFBYSxDQUFDLEVBQTRCO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN2QyxxRkFBcUY7WUFDckYsdUZBQXVGO1lBQ3ZGLG1EQUFtRDtZQUNuRCxNQUFNLE9BQU8sR0FBSSxJQUFJLENBQUMsUUFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QyxPQUFPLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsY0FBYztRQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUM3QixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNoRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQkFBZ0I7SUFDUCxZQUFZO1FBQ2xCLElBQXVCLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQVMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ1AsWUFBWSxDQUFDLFNBQTBDO1FBQzlELEtBQUssTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNsRSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBa0IsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxPQUFjLENBQUMsRUFBRTtnQkFDbEUsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLFlBQVk7UUFDVixJQUFJLEdBQUcsR0FBc0IsRUFBRSxDQUFDO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3RELElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzthQUMzQjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGVBQWUsQ0FDWCxTQUFZLEVBQUUsRUFBZ0Q7UUFDaEUsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFvQixFQUFFLElBQU8sRUFBRSxFQUFFO1lBQ25ELEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELGdCQUFnQjtJQUNQLG9CQUFvQjtRQUMzQixLQUFLLE1BQU0sV0FBVyxJQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBMkIsRUFBRTtZQUMvRSxJQUFLLElBQUksQ0FBQyxRQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQkFDL0MsT0FBTyxLQUFLLENBQUM7YUFDZDtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDaEUsQ0FBQztJQUVELGdCQUFnQjtJQUNQLEtBQUssQ0FBQyxJQUFtQjtRQUNoQyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQWMsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLFFBQWdCLENBQUMsSUFBc0IsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDO0lBQ1gsQ0FBQztDQUNGO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyx5QkFBeUIsQ0FDOUIsUUFBNkQ7SUFDL0QsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDM0UsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUMxQiw2REFBNkQ7UUFDN0QsT0FBTyxDQUFDLElBQUksQ0FBQyxxRUFDVCxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMvQjtBQUNILENBQUM7QUFvQkQsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQXlCLFNBQVMsQ0FBQztBQUVoRTs7Ozs7R0FLRztBQUNILE1BQU0sQ0FBQyxNQUFNLFdBQVcsR0FBRyxDQUFDLE9BQWdCLEVBQXdCLEVBQUUsQ0FBQyxPQUFPLFlBQVksU0FBUyxDQUFDO0FBRXBHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxNQUFNLE9BQU8sVUFBK0QsU0FDeEUsU0FBb0M7Q0FBRztBQWdGM0M7Ozs7O0dBS0c7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxPQUFnQixFQUF5QixFQUFFLENBQ3BFLE9BQU8sWUFBWSxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHvJtVdyaXRhYmxlIGFzIFdyaXRhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIEFic3RyYWN0Q29udHJvbE9wdGlvbnMsIGFzc2VydEFsbFZhbHVlc1ByZXNlbnQsIGFzc2VydENvbnRyb2xQcmVzZW50LCBwaWNrQXN5bmNWYWxpZGF0b3JzLCBwaWNrVmFsaWRhdG9ycywgybVSYXdWYWx1ZSwgybVUeXBlZE9yVW50eXBlZCwgybVWYWx1ZX0gZnJvbSAnLi9hYnN0cmFjdF9tb2RlbCc7XG5cbi8qKlxuICogRm9ybUdyb3VwVmFsdWUgZXh0cmFjdHMgdGhlIHR5cGUgb2YgYC52YWx1ZWAgZnJvbSBhIEZvcm1Hcm91cCdzIGlubmVyIG9iamVjdCB0eXBlLiBUaGUgdW50eXBlZFxuICogY2FzZSBmYWxscyBiYWNrIHRvIHtba2V5OiBzdHJpbmddOiBhbnl9LlxuICpcbiAqIEFuZ3VsYXIgdXNlcyB0aGlzIHR5cGUgaW50ZXJuYWxseSB0byBzdXBwb3J0IFR5cGVkIEZvcm1zOyBkbyBub3QgdXNlIGl0IGRpcmVjdGx5LlxuICpcbiAqIEZvciBpbnRlcm5hbCB1c2Ugb25seS5cbiAqL1xuZXhwb3J0IHR5cGUgybVGb3JtR3JvdXBWYWx1ZTxUIGV4dGVuZHMge1tLIGluIGtleW9mIFRdPzogQWJzdHJhY3RDb250cm9sPGFueT59PiA9XG4gICAgybVUeXBlZE9yVW50eXBlZDxULCBQYXJ0aWFsPHtbSyBpbiBrZXlvZiBUXTogybVWYWx1ZTxUW0tdPn0+LCB7W2tleTogc3RyaW5nXTogYW55fT47XG5cbi8qKlxuICogRm9ybUdyb3VwUmF3VmFsdWUgZXh0cmFjdHMgdGhlIHR5cGUgb2YgYC5nZXRSYXdWYWx1ZSgpYCBmcm9tIGEgRm9ybUdyb3VwJ3MgaW5uZXIgb2JqZWN0IHR5cGUuIFRoZVxuICogdW50eXBlZCBjYXNlIGZhbGxzIGJhY2sgdG8ge1trZXk6IHN0cmluZ106IGFueX0uXG4gKlxuICogQW5ndWxhciB1c2VzIHRoaXMgdHlwZSBpbnRlcm5hbGx5IHRvIHN1cHBvcnQgVHlwZWQgRm9ybXM7IGRvIG5vdCB1c2UgaXQgZGlyZWN0bHkuXG4gKlxuICogRm9yIGludGVybmFsIHVzZSBvbmx5LlxuICovXG5leHBvcnQgdHlwZSDJtUZvcm1Hcm91cFJhd1ZhbHVlPFQgZXh0ZW5kcyB7W0sgaW4ga2V5b2YgVF0/OiBBYnN0cmFjdENvbnRyb2w8YW55Pn0+ID1cbiAgICDJtVR5cGVkT3JVbnR5cGVkPFQsIHtbSyBpbiBrZXlvZiBUXTogybVSYXdWYWx1ZTxUW0tdPn0sIHtba2V5OiBzdHJpbmddOiBhbnl9PjtcblxuLyoqXG4gKiBPcHRpb25hbEtleXMgcmV0dXJucyB0aGUgdW5pb24gb2YgYWxsIG9wdGlvbmFsIGtleXMgaW4gdGhlIG9iamVjdC5cbiAqXG4gKiBBbmd1bGFyIHVzZXMgdGhpcyB0eXBlIGludGVybmFsbHkgdG8gc3VwcG9ydCBUeXBlZCBGb3JtczsgZG8gbm90IHVzZSBpdCBkaXJlY3RseS5cbiAqL1xuZXhwb3J0IHR5cGUgybVPcHRpb25hbEtleXM8VD4gPSB7XG4gIFtLIGluIGtleW9mIFRdIC0/OiB1bmRlZmluZWQgZXh0ZW5kcyBUW0tdID8gSyA6IG5ldmVyXG59W2tleW9mIFRdO1xuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGEgZ3JvdXAgb2YgYEZvcm1Db250cm9sYCBpbnN0YW5jZXMuXG4gKlxuICogQSBgRm9ybUdyb3VwYCBhZ2dyZWdhdGVzIHRoZSB2YWx1ZXMgb2YgZWFjaCBjaGlsZCBgRm9ybUNvbnRyb2xgIGludG8gb25lIG9iamVjdCxcbiAqIHdpdGggZWFjaCBjb250cm9sIG5hbWUgYXMgdGhlIGtleS4gIEl0IGNhbGN1bGF0ZXMgaXRzIHN0YXR1cyBieSByZWR1Y2luZyB0aGUgc3RhdHVzIHZhbHVlc1xuICogb2YgaXRzIGNoaWxkcmVuLiBGb3IgZXhhbXBsZSwgaWYgb25lIG9mIHRoZSBjb250cm9scyBpbiBhIGdyb3VwIGlzIGludmFsaWQsIHRoZSBlbnRpcmVcbiAqIGdyb3VwIGJlY29tZXMgaW52YWxpZC5cbiAqXG4gKiBgRm9ybUdyb3VwYCBpcyBvbmUgb2YgdGhlIGZvdXIgZnVuZGFtZW50YWwgYnVpbGRpbmcgYmxvY2tzIHVzZWQgdG8gZGVmaW5lIGZvcm1zIGluIEFuZ3VsYXIsXG4gKiBhbG9uZyB3aXRoIGBGb3JtQ29udHJvbGAsIGBGb3JtQXJyYXlgLCBhbmQgYEZvcm1SZWNvcmRgLlxuICpcbiAqIFdoZW4gaW5zdGFudGlhdGluZyBhIGBGb3JtR3JvdXBgLCBwYXNzIGluIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBjb250cm9scyBhcyB0aGUgZmlyc3RcbiAqIGFyZ3VtZW50LiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIHJlZ2lzdGVycyB0aGUgbmFtZSBmb3IgdGhlIGNvbnRyb2wuXG4gKlxuICogYEZvcm1Hcm91cGAgaXMgaW50ZW5kZWQgZm9yIHVzZSBjYXNlcyB3aGVyZSB0aGUga2V5cyBhcmUga25vd24gYWhlYWQgb2YgdGltZS5cbiAqIElmIHlvdSBuZWVkIHRvIGR5bmFtaWNhbGx5IGFkZCBhbmQgcmVtb3ZlIGNvbnRyb2xzLCB1c2Uge0BsaW5rIEZvcm1SZWNvcmR9IGluc3RlYWQuXG4gKlxuICogYEZvcm1Hcm91cGAgYWNjZXB0cyBhbiBvcHRpb25hbCB0eXBlIHBhcmFtZXRlciBgVENvbnRyb2xgLCB3aGljaCBpcyBhbiBvYmplY3QgdHlwZSB3aXRoIGlubmVyXG4gKiBjb250cm9sIHR5cGVzIGFzIHZhbHVlcy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggMiBjb250cm9sc1xuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCdOYW5jeScsIFZhbGlkYXRvcnMubWluTGVuZ3RoKDIpKSxcbiAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiB9KTtcbiAqXG4gKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q7ICdEcmV3J31cbiAqIGNvbnNvbGUubG9nKGZvcm0uc3RhdHVzKTsgIC8vICdWQUxJRCdcbiAqIGBgYFxuICpcbiAqICMjIyBUaGUgdHlwZSBhcmd1bWVudCwgYW5kIG9wdGlvbmFsIGNvbnRyb2xzXG4gKlxuICogYEZvcm1Hcm91cGAgYWNjZXB0cyBvbmUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggaXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgaXRzIGlubmVyIGNvbnRyb2xzLlxuICogVGhpcyB0eXBlIHdpbGwgdXN1YWxseSBiZSBpbmZlcnJlZCBhdXRvbWF0aWNhbGx5LCBidXQgeW91IGNhbiBhbHdheXMgc3BlY2lmeSBpdCBleHBsaWNpdGx5IGlmIHlvdVxuICogd2lzaC5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBjb250cm9scyB0aGF0IGFyZSBvcHRpb25hbCAoaS5lLiB0aGV5IGNhbiBiZSByZW1vdmVkLCB5b3UgY2FuIHVzZSB0aGUgYD9gIGluIHRoZVxuICogdHlwZSk6XG4gKlxuICogYGBgXG4gKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cDx7XG4gKiAgIGZpcnN0OiBGb3JtQ29udHJvbDxzdHJpbmd8bnVsbD4sXG4gKiAgIG1pZGRsZT86IEZvcm1Db250cm9sPHN0cmluZ3xudWxsPiwgLy8gTWlkZGxlIG5hbWUgaXMgb3B0aW9uYWwuXG4gKiAgIGxhc3Q6IEZvcm1Db250cm9sPHN0cmluZ3xudWxsPixcbiAqIH0+KHtcbiAqICAgZmlyc3Q6IG5ldyBGb3JtQ29udHJvbCgnTmFuY3knKSxcbiAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKCdEcmV3JyksXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDcmVhdGUgYSBmb3JtIGdyb3VwIHdpdGggYSBncm91cC1sZXZlbCB2YWxpZGF0b3JcbiAqXG4gKiBZb3UgaW5jbHVkZSBncm91cC1sZXZlbCB2YWxpZGF0b3JzIGFzIHRoZSBzZWNvbmQgYXJnLCBvciBncm91cC1sZXZlbCBhc3luY1xuICogdmFsaWRhdG9ycyBhcyB0aGUgdGhpcmQgYXJnLiBUaGVzZSBjb21lIGluIGhhbmR5IHdoZW4geW91IHdhbnQgdG8gcGVyZm9ybSB2YWxpZGF0aW9uXG4gKiB0aGF0IGNvbnNpZGVycyB0aGUgdmFsdWUgb2YgbW9yZSB0aGFuIG9uZSBjaGlsZCBjb250cm9sLlxuICpcbiAqIGBgYFxuICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBwYXNzd29yZDogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiAgIHBhc3N3b3JkQ29uZmlybTogbmV3IEZvcm1Db250cm9sKCcnLCBWYWxpZGF0b3JzLm1pbkxlbmd0aCgyKSksXG4gKiB9LCBwYXNzd29yZE1hdGNoVmFsaWRhdG9yKTtcbiAqXG4gKlxuICogZnVuY3Rpb24gcGFzc3dvcmRNYXRjaFZhbGlkYXRvcihnOiBGb3JtR3JvdXApIHtcbiAqICAgIHJldHVybiBnLmdldCgncGFzc3dvcmQnKS52YWx1ZSA9PT0gZy5nZXQoJ3Bhc3N3b3JkQ29uZmlybScpLnZhbHVlXG4gKiAgICAgICA/IG51bGwgOiB7J21pc21hdGNoJzogdHJ1ZX07XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBMaWtlIGBGb3JtQ29udHJvbGAgaW5zdGFuY2VzLCB5b3UgY2hvb3NlIHRvIHBhc3MgaW5cbiAqIHZhbGlkYXRvcnMgYW5kIGFzeW5jIHZhbGlkYXRvcnMgYXMgcGFydCBvZiBhbiBvcHRpb25zIG9iamVjdC5cbiAqXG4gKiBgYGBcbiAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAqICAgcGFzc3dvcmQ6IG5ldyBGb3JtQ29udHJvbCgnJylcbiAqICAgcGFzc3dvcmRDb25maXJtOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiB9LCB7IHZhbGlkYXRvcnM6IHBhc3N3b3JkTWF0Y2hWYWxpZGF0b3IsIGFzeW5jVmFsaWRhdG9yczogb3RoZXJWYWxpZGF0b3IgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgU2V0IHRoZSB1cGRhdGVPbiBwcm9wZXJ0eSBmb3IgYWxsIGNvbnRyb2xzIGluIGEgZm9ybSBncm91cFxuICpcbiAqIFRoZSBvcHRpb25zIG9iamVjdCBpcyB1c2VkIHRvIHNldCBhIGRlZmF1bHQgdmFsdWUgZm9yIGVhY2ggY2hpbGRcbiAqIGNvbnRyb2wncyBgdXBkYXRlT25gIHByb3BlcnR5LiBJZiB5b3Ugc2V0IGB1cGRhdGVPbmAgdG8gYCdibHVyJ2AgYXQgdGhlXG4gKiBncm91cCBsZXZlbCwgYWxsIGNoaWxkIGNvbnRyb2xzIGRlZmF1bHQgdG8gJ2JsdXInLCB1bmxlc3MgdGhlIGNoaWxkXG4gKiBoYXMgZXhwbGljaXRseSBzcGVjaWZpZWQgYSBkaWZmZXJlbnQgYHVwZGF0ZU9uYCB2YWx1ZS5cbiAqXG4gKiBgYGB0c1xuICogY29uc3QgYyA9IG5ldyBGb3JtR3JvdXAoe1xuICogICBvbmU6IG5ldyBGb3JtQ29udHJvbCgpXG4gKiB9LCB7IHVwZGF0ZU9uOiAnYmx1cicgfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNpbmcgYSBGb3JtR3JvdXAgd2l0aCBvcHRpb25hbCBjb250cm9sc1xuICpcbiAqIEl0IGlzIHBvc3NpYmxlIHRvIGhhdmUgb3B0aW9uYWwgY29udHJvbHMgaW4gYSBGb3JtR3JvdXAuIEFuIG9wdGlvbmFsIGNvbnRyb2wgY2FuIGJlIHJlbW92ZWQgbGF0ZXJcbiAqIHVzaW5nIGByZW1vdmVDb250cm9sYCwgYW5kIGNhbiBiZSBvbWl0dGVkIHdoZW4gY2FsbGluZyBgcmVzZXRgLiBPcHRpb25hbCBjb250cm9scyBtdXN0IGJlXG4gKiBkZWNsYXJlZCBvcHRpb25hbCBpbiB0aGUgZ3JvdXAncyB0eXBlLlxuICpcbiAqIGBgYHRzXG4gKiBjb25zdCBjID0gbmV3IEZvcm1Hcm91cDx7b25lPzogRm9ybUNvbnRyb2w8c3RyaW5nPn0+KHtcbiAqICAgb25lOiBuZXcgRm9ybUNvbnRyb2woJycpXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIE5vdGljZSB0aGF0IGBjLnZhbHVlLm9uZWAgaGFzIHR5cGUgYHN0cmluZ3xudWxsfHVuZGVmaW5lZGAuIFRoaXMgaXMgYmVjYXVzZSBjYWxsaW5nIGBjLnJlc2V0KHt9KWBcbiAqIHdpdGhvdXQgcHJvdmlkaW5nIHRoZSBvcHRpb25hbCBrZXkgYG9uZWAgd2lsbCBjYXVzZSBpdCB0byBiZWNvbWUgYG51bGxgLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1Hcm91cDxUQ29udHJvbCBleHRlbmRzIHtbSyBpbiBrZXlvZiBUQ29udHJvbF06IEFic3RyYWN0Q29udHJvbDxhbnk+fSA9IGFueT4gZXh0ZW5kc1xuICAgIEFic3RyYWN0Q29udHJvbDxcbiAgICAgICAgybVUeXBlZE9yVW50eXBlZDxUQ29udHJvbCwgybVGb3JtR3JvdXBWYWx1ZTxUQ29udHJvbD4sIGFueT4sXG4gICAgICAgIMm1VHlwZWRPclVudHlwZWQ8VENvbnRyb2wsIMm1Rm9ybUdyb3VwUmF3VmFsdWU8VENvbnRyb2w+LCBhbnk+PiB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBGb3JtR3JvdXBgIGluc3RhbmNlLlxuICAgKlxuICAgKiBAcGFyYW0gY29udHJvbHMgQSBjb2xsZWN0aW9uIG9mIGNoaWxkIGNvbnRyb2xzLiBUaGUga2V5IGZvciBlYWNoIGNoaWxkIGlzIHRoZSBuYW1lXG4gICAqIHVuZGVyIHdoaWNoIGl0IGlzIHJlZ2lzdGVyZWQuXG4gICAqXG4gICAqIEBwYXJhbSB2YWxpZGF0b3JPck9wdHMgQSBzeW5jaHJvbm91cyB2YWxpZGF0b3IgZnVuY3Rpb24sIG9yIGFuIGFycmF5IG9mXG4gICAqIHN1Y2ggZnVuY3Rpb25zLCBvciBhbiBgQWJzdHJhY3RDb250cm9sT3B0aW9uc2Agb2JqZWN0IHRoYXQgY29udGFpbnMgdmFsaWRhdGlvbiBmdW5jdGlvbnNcbiAgICogYW5kIGEgdmFsaWRhdGlvbiB0cmlnZ2VyLlxuICAgKlxuICAgKiBAcGFyYW0gYXN5bmNWYWxpZGF0b3IgQSBzaW5nbGUgYXN5bmMgdmFsaWRhdG9yIG9yIGFycmF5IG9mIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbnNcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgY29udHJvbHM6IFRDb250cm9sLCB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCkge1xuICAgIHN1cGVyKHBpY2tWYWxpZGF0b3JzKHZhbGlkYXRvck9yT3B0cyksIHBpY2tBc3luY1ZhbGlkYXRvcnMoYXN5bmNWYWxpZGF0b3IsIHZhbGlkYXRvck9yT3B0cykpO1xuICAgICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpICYmIHZhbGlkYXRlRm9ybUdyb3VwQ29udHJvbHMoY29udHJvbHMpO1xuICAgIHRoaXMuY29udHJvbHMgPSBjb250cm9scztcbiAgICB0aGlzLl9pbml0T2JzZXJ2YWJsZXMoKTtcbiAgICB0aGlzLl9zZXRVcGRhdGVTdHJhdGVneSh2YWxpZGF0b3JPck9wdHMpO1xuICAgIHRoaXMuX3NldFVwQ29udHJvbHMoKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe1xuICAgICAgb25seVNlbGY6IHRydWUsXG4gICAgICAvLyBJZiBgYXN5bmNWYWxpZGF0b3JgIGlzIHByZXNlbnQsIGl0IHdpbGwgdHJpZ2dlciBjb250cm9sIHN0YXR1cyBjaGFuZ2UgZnJvbSBgUEVORElOR2AgdG9cbiAgICAgIC8vIGBWQUxJRGAgb3IgYElOVkFMSURgLiBUaGUgc3RhdHVzIHNob3VsZCBiZSBicm9hZGNhc3RlZCB2aWEgdGhlIGBzdGF0dXNDaGFuZ2VzYCBvYnNlcnZhYmxlLFxuICAgICAgLy8gc28gd2Ugc2V0IGBlbWl0RXZlbnRgIHRvIGB0cnVlYCB0byBhbGxvdyB0aGF0IGR1cmluZyB0aGUgY29udHJvbCBjcmVhdGlvbiBwcm9jZXNzLlxuICAgICAgZW1pdEV2ZW50OiAhIXRoaXMuYXN5bmNWYWxpZGF0b3JcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjb250cm9sczogybVUeXBlZE9yVW50eXBlZDxUQ29udHJvbCwgVENvbnRyb2wsIHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2w8YW55Pn0+O1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjb250cm9sIHdpdGggdGhlIGdyb3VwJ3MgbGlzdCBvZiBjb250cm9scy4gSW4gYSBzdHJvbmdseS10eXBlZCBncm91cCwgdGhlIGNvbnRyb2xcbiAgICogbXVzdCBiZSBpbiB0aGUgZ3JvdXAncyB0eXBlIChwb3NzaWJseSBhcyBhbiBvcHRpb25hbCBrZXkpLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBkb2VzIG5vdCB1cGRhdGUgdGhlIHZhbHVlIG9yIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKiBVc2Uge0BsaW5rIEZvcm1Hcm91cCNhZGRDb250cm9sIGFkZENvbnRyb2x9IGluc3RlYWQuXG4gICAqXG4gICAqIEBwYXJhbSBuYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gcmVnaXN0ZXIgaW4gdGhlIGNvbGxlY3Rpb25cbiAgICogQHBhcmFtIGNvbnRyb2wgUHJvdmlkZXMgdGhlIGNvbnRyb2wgZm9yIHRoZSBnaXZlbiBuYW1lXG4gICAqL1xuICByZWdpc3RlckNvbnRyb2w8SyBleHRlbmRzIHN0cmluZyZrZXlvZiBUQ29udHJvbD4obmFtZTogSywgY29udHJvbDogVENvbnRyb2xbS10pOiBUQ29udHJvbFtLXTtcbiAgcmVnaXN0ZXJDb250cm9sKFxuICAgICAgdGhpczogRm9ybUdyb3VwPHtba2V5OiBzdHJpbmddOiBBYnN0cmFjdENvbnRyb2w8YW55Pn0+LCBuYW1lOiBzdHJpbmcsXG4gICAgICBjb250cm9sOiBBYnN0cmFjdENvbnRyb2w8YW55Pik6IEFic3RyYWN0Q29udHJvbDxhbnk+O1xuXG4gIHJlZ2lzdGVyQ29udHJvbDxLIGV4dGVuZHMgc3RyaW5nJmtleW9mIFRDb250cm9sPihuYW1lOiBLLCBjb250cm9sOiBUQ29udHJvbFtLXSk6IFRDb250cm9sW0tdIHtcbiAgICBpZiAodGhpcy5jb250cm9sc1tuYW1lXSkgcmV0dXJuICh0aGlzLmNvbnRyb2xzIGFzIGFueSlbbmFtZV07XG4gICAgdGhpcy5jb250cm9sc1tuYW1lXSA9IGNvbnRyb2w7XG4gICAgY29udHJvbC5zZXRQYXJlbnQodGhpcyBhcyBGb3JtR3JvdXApO1xuICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgcmV0dXJuIGNvbnRyb2w7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29udHJvbCB0byB0aGlzIGdyb3VwLiBJbiBhIHN0cm9uZ2x5LXR5cGVkIGdyb3VwLCB0aGUgY29udHJvbCBtdXN0IGJlIGluIHRoZSBncm91cCdzIHR5cGVcbiAgICogKHBvc3NpYmx5IGFzIGFuIG9wdGlvbmFsIGtleSkuXG4gICAqXG4gICAqIElmIGEgY29udHJvbCB3aXRoIGEgZ2l2ZW4gbmFtZSBhbHJlYWR5IGV4aXN0cywgaXQgd291bGQgKm5vdCogYmUgcmVwbGFjZWQgd2l0aCBhIG5ldyBvbmUuXG4gICAqIElmIHlvdSB3YW50IHRvIHJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbCwgdXNlIHRoZSB7QGxpbmsgRm9ybUdyb3VwI3NldENvbnRyb2wgc2V0Q29udHJvbH1cbiAgICogbWV0aG9kIGluc3RlYWQuIFRoaXMgbWV0aG9kIGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIGFkZCB0byB0aGUgY29sbGVjdGlvblxuICAgKiBAcGFyYW0gY29udHJvbCBQcm92aWRlcyB0aGUgY29udHJvbCBmb3IgdGhlIGdpdmVuIG5hbWVcbiAgICogQHBhcmFtIG9wdGlvbnMgU3BlY2lmaWVzIHdoZXRoZXIgdGhpcyBGb3JtR3JvdXAgaW5zdGFuY2Ugc2hvdWxkIGVtaXQgZXZlbnRzIGFmdGVyIGEgbmV3XG4gICAqICAgICBjb250cm9sIGlzIGFkZGVkLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpc1xuICAgKiBhZGRlZC4gV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgYWRkQ29udHJvbChcbiAgICAgIHRoaXM6IEZvcm1Hcm91cDx7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sPGFueT59PiwgbmFtZTogc3RyaW5nLFxuICAgICAgY29udHJvbDogQWJzdHJhY3RDb250cm9sLCBvcHRpb25zPzoge2VtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcbiAgYWRkQ29udHJvbDxLIGV4dGVuZHMgc3RyaW5nJmtleW9mIFRDb250cm9sPihuYW1lOiBLLCBjb250cm9sOiBSZXF1aXJlZDxUQ29udHJvbD5bS10sIG9wdGlvbnM/OiB7XG4gICAgZW1pdEV2ZW50PzogYm9vbGVhblxuICB9KTogdm9pZDtcblxuICBhZGRDb250cm9sPEsgZXh0ZW5kcyBzdHJpbmcma2V5b2YgVENvbnRyb2w+KG5hbWU6IEssIGNvbnRyb2w6IFJlcXVpcmVkPFRDb250cm9sPltLXSwgb3B0aW9uczoge1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgdGhpcy5yZWdpc3RlckNvbnRyb2wobmFtZSwgY29udHJvbCk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KHtlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgdGhpcy5fb25Db2xsZWN0aW9uQ2hhbmdlKCk7XG4gIH1cblxuICByZW1vdmVDb250cm9sKHRoaXM6IEZvcm1Hcm91cDx7W2tleTogc3RyaW5nXTogQWJzdHJhY3RDb250cm9sPGFueT59PiwgbmFtZTogc3RyaW5nLCBvcHRpb25zPzoge1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gIH0pOiB2b2lkO1xuICByZW1vdmVDb250cm9sPFMgZXh0ZW5kcyBzdHJpbmc+KG5hbWU6IMm1T3B0aW9uYWxLZXlzPFRDb250cm9sPiZTLCBvcHRpb25zPzoge1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW47XG4gIH0pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb250cm9sIGZyb20gdGhpcyBncm91cC4gSW4gYSBzdHJvbmdseS10eXBlZCBncm91cCwgcmVxdWlyZWQgY29udHJvbHMgY2Fubm90IGJlXG4gICAqIHJlbW92ZWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFsc28gdXBkYXRlcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IG9mIHRoZSBjb250cm9sLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgY29udHJvbCBuYW1lIHRvIHJlbW92ZSBmcm9tIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIFNwZWNpZmllcyB3aGV0aGVyIHRoaXMgRm9ybUdyb3VwIGluc3RhbmNlIHNob3VsZCBlbWl0IGV2ZW50cyBhZnRlciBhXG4gICAqICAgICBjb250cm9sIGlzIHJlbW92ZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAqIHJlbW92ZWQuIFdoZW4gZmFsc2UsIG5vIGV2ZW50cyBhcmUgZW1pdHRlZC5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2wobmFtZTogc3RyaW5nLCBvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbjt9ID0ge30pOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMuY29udHJvbHMgYXMgYW55KVtuYW1lXSlcbiAgICAgICh0aGlzLmNvbnRyb2xzIGFzIGFueSlbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICBkZWxldGUgKCh0aGlzLmNvbnRyb2xzIGFzIGFueSlbbmFtZV0pO1xuICAgIHRoaXMudXBkYXRlVmFsdWVBbmRWYWxpZGl0eSh7ZW1pdEV2ZW50OiBvcHRpb25zLmVtaXRFdmVudH0pO1xuICAgIHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYW4gZXhpc3RpbmcgY29udHJvbC4gSW4gYSBzdHJvbmdseS10eXBlZCBncm91cCwgdGhlIGNvbnRyb2wgbXVzdCBiZSBpbiB0aGUgZ3JvdXAncyB0eXBlXG4gICAqIChwb3NzaWJseSBhcyBhbiBvcHRpb25hbCBrZXkpLlxuICAgKlxuICAgKiBJZiBhIGNvbnRyb2wgd2l0aCBhIGdpdmVuIG5hbWUgZG9lcyBub3QgZXhpc3QgaW4gdGhpcyBgRm9ybUdyb3VwYCwgaXQgd2lsbCBiZSBhZGRlZC5cbiAgICpcbiAgICogQHBhcmFtIG5hbWUgVGhlIGNvbnRyb2wgbmFtZSB0byByZXBsYWNlIGluIHRoZSBjb2xsZWN0aW9uXG4gICAqIEBwYXJhbSBjb250cm9sIFByb3ZpZGVzIHRoZSBjb250cm9sIGZvciB0aGUgZ2l2ZW4gbmFtZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBTcGVjaWZpZXMgd2hldGhlciB0aGlzIEZvcm1Hcm91cCBpbnN0YW5jZSBzaG91bGQgZW1pdCBldmVudHMgYWZ0ZXIgYW5cbiAgICogICAgIGV4aXN0aW5nIGNvbnRyb2wgaXMgcmVwbGFjZWQuXG4gICAqICogYGVtaXRFdmVudGA6IFdoZW4gdHJ1ZSBvciBub3Qgc3VwcGxpZWQgKHRoZSBkZWZhdWx0KSwgYm90aCB0aGUgYHN0YXR1c0NoYW5nZXNgIGFuZFxuICAgKiBgdmFsdWVDaGFuZ2VzYCBvYnNlcnZhYmxlcyBlbWl0IGV2ZW50cyB3aXRoIHRoZSBsYXRlc3Qgc3RhdHVzIGFuZCB2YWx1ZSB3aGVuIHRoZSBjb250cm9sIGlzXG4gICAqIHJlcGxhY2VkIHdpdGggYSBuZXcgb25lLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuXG4gICAqL1xuICBzZXRDb250cm9sPEsgZXh0ZW5kcyBzdHJpbmcma2V5b2YgVENvbnRyb2w+KG5hbWU6IEssIGNvbnRyb2w6IFRDb250cm9sW0tdLCBvcHRpb25zPzoge1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSk6IHZvaWQ7XG4gIHNldENvbnRyb2woXG4gICAgICB0aGlzOiBGb3JtR3JvdXA8e1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbDxhbnk+fT4sIG5hbWU6IHN0cmluZyxcbiAgICAgIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgb3B0aW9ucz86IHtlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG5cbiAgc2V0Q29udHJvbDxLIGV4dGVuZHMgc3RyaW5nJmtleW9mIFRDb250cm9sPihuYW1lOiBLLCBjb250cm9sOiBUQ29udHJvbFtLXSwgb3B0aW9uczoge1xuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY29udHJvbHNbbmFtZV0pIHRoaXMuY29udHJvbHNbbmFtZV0uX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgICBkZWxldGUgKHRoaXMuY29udHJvbHNbbmFtZV0pO1xuICAgIGlmIChjb250cm9sKSB0aGlzLnJlZ2lzdGVyQ29udHJvbChuYW1lLCBjb250cm9sKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe2VtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB0aGlzLl9vbkNvbGxlY3Rpb25DaGFuZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZXJlIGlzIGFuIGVuYWJsZWQgY29udHJvbCB3aXRoIHRoZSBnaXZlbiBuYW1lIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogUmVwb3J0cyBmYWxzZSBmb3IgZGlzYWJsZWQgY29udHJvbHMuIElmIHlvdSdkIGxpa2UgdG8gY2hlY2sgZm9yIGV4aXN0ZW5jZSBpbiB0aGUgZ3JvdXBcbiAgICogb25seSwgdXNlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjZ2V0IGdldH0gaW5zdGVhZC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRyb2xOYW1lIFRoZSBjb250cm9sIG5hbWUgdG8gY2hlY2sgZm9yIGV4aXN0ZW5jZSBpbiB0aGUgY29sbGVjdGlvblxuICAgKlxuICAgKiBAcmV0dXJucyBmYWxzZSBmb3IgZGlzYWJsZWQgY29udHJvbHMsIHRydWUgb3RoZXJ3aXNlLlxuICAgKi9cbiAgY29udGFpbnM8SyBleHRlbmRzIHN0cmluZz4oY29udHJvbE5hbWU6IEspOiBib29sZWFuO1xuICBjb250YWlucyh0aGlzOiBGb3JtR3JvdXA8e1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbDxhbnk+fT4sIGNvbnRyb2xOYW1lOiBzdHJpbmcpOiBib29sZWFuO1xuXG4gIGNvbnRhaW5zPEsgZXh0ZW5kcyBzdHJpbmcma2V5b2YgVENvbnRyb2w+KGNvbnRyb2xOYW1lOiBLKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbHMuaGFzT3duUHJvcGVydHkoY29udHJvbE5hbWUpICYmIHRoaXMuY29udHJvbHNbY29udHJvbE5hbWVdLmVuYWJsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB0aGF0IG1hdGNoZXNcbiAgICogdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAsIHdpdGggY29udHJvbCBuYW1lcyBhcyBrZXlzLlxuICAgKlxuICAgKiBAdXNhZ2VOb3Rlc1xuICAgKiAjIyMgU2V0IHRoZSBjb21wbGV0ZSB2YWx1ZSBmb3IgdGhlIGZvcm0gZ3JvdXBcbiAgICpcbiAgICogYGBgXG4gICAqIGNvbnN0IGZvcm0gPSBuZXcgRm9ybUdyb3VwKHtcbiAgICogICBmaXJzdDogbmV3IEZvcm1Db250cm9sKCksXG4gICAqICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogbnVsbCwgbGFzdDogbnVsbH1cbiAgICpcbiAgICogZm9ybS5zZXRWYWx1ZSh7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J30pO1xuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6ICdEcmV3J31cbiAgICogYGBgXG4gICAqXG4gICAqIEB0aHJvd3MgV2hlbiBzdHJpY3QgY2hlY2tzIGZhaWwsIHN1Y2ggYXMgc2V0dGluZyB0aGUgdmFsdWUgb2YgYSBjb250cm9sXG4gICAqIHRoYXQgZG9lc24ndCBleGlzdCBvciBpZiB5b3UgZXhjbHVkZSBhIHZhbHVlIG9mIGEgY29udHJvbCB0aGF0IGRvZXMgZXhpc3QuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZSBUaGUgbmV3IHZhbHVlIGZvciB0aGUgY29udHJvbCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzXG4gICAqIGFuZCBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGNoYW5nZXMuXG4gICAqIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0byB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5XG4gICAqIHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICpcbiAgICogKiBgb25seVNlbGZgOiBXaGVuIHRydWUsIGVhY2ggY2hhbmdlIG9ubHkgYWZmZWN0cyB0aGlzIGNvbnRyb2wsIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiBmYWxzZS5cbiAgICogKiBgZW1pdEV2ZW50YDogV2hlbiB0cnVlIG9yIG5vdCBzdXBwbGllZCAodGhlIGRlZmF1bHQpLCBib3RoIHRoZSBgc3RhdHVzQ2hhbmdlc2AgYW5kXG4gICAqIGB2YWx1ZUNoYW5nZXNgXG4gICAqIG9ic2VydmFibGVzIGVtaXQgZXZlbnRzIHdpdGggdGhlIGxhdGVzdCBzdGF0dXMgYW5kIHZhbHVlIHdoZW4gdGhlIGNvbnRyb2wgdmFsdWUgaXMgdXBkYXRlZC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKi9cbiAgb3ZlcnJpZGUgc2V0VmFsdWUodmFsdWU6IMm1Rm9ybUdyb3VwUmF3VmFsdWU8VENvbnRyb2w+LCBvcHRpb25zOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgYXNzZXJ0QWxsVmFsdWVzUHJlc2VudCh0aGlzLCB0cnVlLCB2YWx1ZSk7XG4gICAgKE9iamVjdC5rZXlzKHZhbHVlKSBhcyBBcnJheTxrZXlvZiBUQ29udHJvbD4pLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICBhc3NlcnRDb250cm9sUHJlc2VudCh0aGlzLCB0cnVlLCBuYW1lIGFzIGFueSk7XG4gICAgICAodGhpcy5jb250cm9scyBhcyBhbnkpW25hbWVdLnNldFZhbHVlKFxuICAgICAgICAgICh2YWx1ZSBhcyBhbnkpW25hbWVdLCB7b25seVNlbGY6IHRydWUsIGVtaXRFdmVudDogb3B0aW9ucy5lbWl0RXZlbnR9KTtcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogUGF0Y2hlcyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtR3JvdXBgLiBJdCBhY2NlcHRzIGFuIG9iamVjdCB3aXRoIGNvbnRyb2xcbiAgICogbmFtZXMgYXMga2V5cywgYW5kIGRvZXMgaXRzIGJlc3QgdG8gbWF0Y2ggdGhlIHZhbHVlcyB0byB0aGUgY29ycmVjdCBjb250cm9sc1xuICAgKiBpbiB0aGUgZ3JvdXAuXG4gICAqXG4gICAqIEl0IGFjY2VwdHMgYm90aCBzdXBlci1zZXRzIGFuZCBzdWItc2V0cyBvZiB0aGUgZ3JvdXAgd2l0aG91dCB0aHJvd2luZyBhbiBlcnJvci5cbiAgICpcbiAgICogQHVzYWdlTm90ZXNcbiAgICogIyMjIFBhdGNoIHRoZSB2YWx1ZSBmb3IgYSBmb3JtIGdyb3VwXG4gICAqXG4gICAqIGBgYFxuICAgKiBjb25zdCBmb3JtID0gbmV3IEZvcm1Hcm91cCh7XG4gICAqICAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woKSxcbiAgICogICAgbGFzdDogbmV3IEZvcm1Db250cm9sKClcbiAgICogfSk7XG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgIC8vIHtmaXJzdDogbnVsbCwgbGFzdDogbnVsbH1cbiAgICpcbiAgICogZm9ybS5wYXRjaFZhbHVlKHtmaXJzdDogJ05hbmN5J30pO1xuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgICAvLyB7Zmlyc3Q6ICdOYW5jeScsIGxhc3Q6IG51bGx9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gdmFsdWUgVGhlIG9iamVjdCB0aGF0IG1hdGNoZXMgdGhlIHN0cnVjdHVyZSBvZiB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSBvcHRpb25zIENvbmZpZ3VyYXRpb24gb3B0aW9ucyB0aGF0IGRldGVybWluZSBob3cgdGhlIGNvbnRyb2wgcHJvcGFnYXRlcyBjaGFuZ2VzIGFuZFxuICAgKiBlbWl0cyBldmVudHMgYWZ0ZXIgdGhlIHZhbHVlIGlzIHBhdGNoZWQuXG4gICAqICogYG9ubHlTZWxmYDogV2hlbiB0cnVlLCBlYWNoIGNoYW5nZSBvbmx5IGFmZmVjdHMgdGhpcyBjb250cm9sIGFuZCBub3QgaXRzIHBhcmVudC4gRGVmYXVsdCBpc1xuICAgKiB0cnVlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2Agb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCB2YWx1ZVxuICAgKiBpcyB1cGRhdGVkLiBXaGVuIGZhbHNlLCBubyBldmVudHMgYXJlIGVtaXR0ZWQuIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgYXJlIHBhc3NlZCB0b1xuICAgKiB0aGUge0BsaW5rIEFic3RyYWN0Q29udHJvbCN1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5IHVwZGF0ZVZhbHVlQW5kVmFsaWRpdHl9IG1ldGhvZC5cbiAgICovXG4gIG92ZXJyaWRlIHBhdGNoVmFsdWUodmFsdWU6IMm1Rm9ybUdyb3VwVmFsdWU8VENvbnRyb2w+LCBvcHRpb25zOiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSA9IHt9KTogdm9pZCB7XG4gICAgLy8gRXZlbiB0aG91Z2ggdGhlIGB2YWx1ZWAgYXJndW1lbnQgdHlwZSBkb2Vzbid0IGFsbG93IGBudWxsYCBhbmQgYHVuZGVmaW5lZGAgdmFsdWVzLCB0aGVcbiAgICAvLyBgcGF0Y2hWYWx1ZWAgY2FuIGJlIGNhbGxlZCByZWN1cnNpdmVseSBhbmQgaW5uZXIgZGF0YSBzdHJ1Y3R1cmVzIG1pZ2h0IGhhdmUgdGhlc2UgdmFsdWVzLCBzb1xuICAgIC8vIHdlIGp1c3QgaWdub3JlIHN1Y2ggY2FzZXMgd2hlbiBhIGZpZWxkIGNvbnRhaW5pbmcgRm9ybUdyb3VwIGluc3RhbmNlIHJlY2VpdmVzIGBudWxsYCBvclxuICAgIC8vIGB1bmRlZmluZWRgIGFzIGEgdmFsdWUuXG4gICAgaWYgKHZhbHVlID09IG51bGwgLyogYm90aCBgbnVsbGAgYW5kIGB1bmRlZmluZWRgICovKSByZXR1cm47XG4gICAgKE9iamVjdC5rZXlzKHZhbHVlKSBhcyBBcnJheTxrZXlvZiBUQ29udHJvbD4pLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAvLyBUaGUgY29tcGlsZXIgY2Fubm90IHNlZSB0aHJvdWdoIHRoZSB1bmluc3RhbnRpYXRlZCBjb25kaXRpb25hbCB0eXBlIG9mIGB0aGlzLmNvbnRyb2xzYCwgc29cbiAgICAgIC8vIGBhcyBhbnlgIGlzIHJlcXVpcmVkLlxuICAgICAgY29uc3QgY29udHJvbCA9ICh0aGlzLmNvbnRyb2xzIGFzIGFueSlbbmFtZV07XG4gICAgICBpZiAoY29udHJvbCkge1xuICAgICAgICBjb250cm9sLnBhdGNoVmFsdWUoXG4gICAgICAgICAgICAvKiBHdWFyYW50ZWVkIHRvIGJlIHByZXNlbnQsIGR1ZSB0byB0aGUgb3V0ZXIgZm9yRWFjaC4gKi8gdmFsdWVcbiAgICAgICAgICAgICAgICBbbmFtZSBhcyBrZXlvZiDJtUZvcm1Hcm91cFZhbHVlPFRDb250cm9sPl0hLFxuICAgICAgICAgICAge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgYEZvcm1Hcm91cGAsIG1hcmtzIGFsbCBkZXNjZW5kYW50cyBgcHJpc3RpbmVgIGFuZCBgdW50b3VjaGVkYCBhbmQgc2V0c1xuICAgKiB0aGUgdmFsdWUgb2YgYWxsIGRlc2NlbmRhbnRzIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWVzLCBvciBudWxsIGlmIG5vIGRlZmF1bHRzIHdlcmUgcHJvdmlkZWQuXG4gICAqXG4gICAqIFlvdSByZXNldCB0byBhIHNwZWNpZmljIGZvcm0gc3RhdGUgYnkgcGFzc2luZyBpbiBhIG1hcCBvZiBzdGF0ZXNcbiAgICogdGhhdCBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgb2YgeW91ciBmb3JtLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy4gVGhlIHN0YXRlXG4gICAqIGlzIGEgc3RhbmRhbG9uZSB2YWx1ZSBvciBhIGZvcm0gc3RhdGUgb2JqZWN0IHdpdGggYm90aCBhIHZhbHVlIGFuZCBhIGRpc2FibGVkXG4gICAqIHN0YXR1cy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIFJlc2V0cyB0aGUgY29udHJvbCB3aXRoIGFuIGluaXRpYWwgdmFsdWUsXG4gICAqIG9yIGFuIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGluaXRpYWwgdmFsdWUgYW5kIGRpc2FibGVkIHN0YXRlLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBDb25maWd1cmF0aW9uIG9wdGlvbnMgdGhhdCBkZXRlcm1pbmUgaG93IHRoZSBjb250cm9sIHByb3BhZ2F0ZXMgY2hhbmdlc1xuICAgKiBhbmQgZW1pdHMgZXZlbnRzIHdoZW4gdGhlIGdyb3VwIGlzIHJlc2V0LlxuICAgKiAqIGBvbmx5U2VsZmA6IFdoZW4gdHJ1ZSwgZWFjaCBjaGFuZ2Ugb25seSBhZmZlY3RzIHRoaXMgY29udHJvbCwgYW5kIG5vdCBpdHMgcGFyZW50LiBEZWZhdWx0IGlzXG4gICAqIGZhbHNlLlxuICAgKiAqIGBlbWl0RXZlbnRgOiBXaGVuIHRydWUgb3Igbm90IHN1cHBsaWVkICh0aGUgZGVmYXVsdCksIGJvdGggdGhlIGBzdGF0dXNDaGFuZ2VzYCBhbmRcbiAgICogYHZhbHVlQ2hhbmdlc2BcbiAgICogb2JzZXJ2YWJsZXMgZW1pdCBldmVudHMgd2l0aCB0aGUgbGF0ZXN0IHN0YXR1cyBhbmQgdmFsdWUgd2hlbiB0aGUgY29udHJvbCBpcyByZXNldC5cbiAgICogV2hlbiBmYWxzZSwgbm8gZXZlbnRzIGFyZSBlbWl0dGVkLlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIGFyZSBwYXNzZWQgdG8gdGhlIHtAbGluayBBYnN0cmFjdENvbnRyb2wjdXBkYXRlVmFsdWVBbmRWYWxpZGl0eVxuICAgKiB1cGRhdGVWYWx1ZUFuZFZhbGlkaXR5fSBtZXRob2QuXG4gICAqXG4gICAqIEB1c2FnZU5vdGVzXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXNcbiAgICpcbiAgICogYGBgdHNcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ2ZpcnN0IG5hbWUnKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ2ZpcnN0IG5hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICpcbiAgICogZm9ybS5yZXNldCh7IGZpcnN0OiAnbmFtZScsIGxhc3Q6ICdsYXN0IG5hbWUnIH0pO1xuICAgKlxuICAgKiBjb25zb2xlLmxvZyhmb3JtLnZhbHVlKTsgIC8vIHtmaXJzdDogJ25hbWUnLCBsYXN0OiAnbGFzdCBuYW1lJ31cbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBSZXNldCB0aGUgZm9ybSBncm91cCB2YWx1ZXMgYW5kIGRpc2FibGVkIHN0YXR1c1xuICAgKlxuICAgKiBgYGBcbiAgICogY29uc3QgZm9ybSA9IG5ldyBGb3JtR3JvdXAoe1xuICAgKiAgIGZpcnN0OiBuZXcgRm9ybUNvbnRyb2woJ2ZpcnN0IG5hbWUnKSxcbiAgICogICBsYXN0OiBuZXcgRm9ybUNvbnRyb2woJ2xhc3QgbmFtZScpXG4gICAqIH0pO1xuICAgKlxuICAgKiBmb3JtLnJlc2V0KHtcbiAgICogICBmaXJzdDoge3ZhbHVlOiAnbmFtZScsIGRpc2FibGVkOiB0cnVlfSxcbiAgICogICBsYXN0OiAnbGFzdCdcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnNvbGUubG9nKGZvcm0udmFsdWUpOyAgLy8ge2xhc3Q6ICdsYXN0J31cbiAgICogY29uc29sZS5sb2coZm9ybS5nZXQoJ2ZpcnN0Jykuc3RhdHVzKTsgIC8vICdESVNBQkxFRCdcbiAgICogYGBgXG4gICAqL1xuICBvdmVycmlkZSByZXNldChcbiAgICAgIHZhbHVlOiDJtVR5cGVkT3JVbnR5cGVkPFRDb250cm9sLCDJtUZvcm1Hcm91cFZhbHVlPFRDb250cm9sPiwgYW55PiA9IHt9IGFzIHVua25vd24gYXNcbiAgICAgICAgICDJtUZvcm1Hcm91cFZhbHVlPFRDb250cm9sPixcbiAgICAgIG9wdGlvbnM6IHtvbmx5U2VsZj86IGJvb2xlYW4sIGVtaXRFdmVudD86IGJvb2xlYW59ID0ge30pOiB2b2lkIHtcbiAgICB0aGlzLl9mb3JFYWNoQ2hpbGQoKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgbmFtZSkgPT4ge1xuICAgICAgY29udHJvbC5yZXNldChcbiAgICAgICAgICB2YWx1ZSA/ICh2YWx1ZSBhcyBhbnkpW25hbWVdIDogbnVsbCwge29ubHlTZWxmOiB0cnVlLCBlbWl0RXZlbnQ6IG9wdGlvbnMuZW1pdEV2ZW50fSk7XG4gICAgfSk7XG4gICAgdGhpcy5fdXBkYXRlUHJpc3RpbmUob3B0aW9ucyk7XG4gICAgdGhpcy5fdXBkYXRlVG91Y2hlZChvcHRpb25zKTtcbiAgICB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZ3JlZ2F0ZSB2YWx1ZSBvZiB0aGUgYEZvcm1Hcm91cGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFJldHJpZXZlcyBhbGwgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgZGlzYWJsZWQgc3RhdHVzLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0UmF3VmFsdWUoKTogybVUeXBlZE9yVW50eXBlZDxUQ29udHJvbCwgybVGb3JtR3JvdXBSYXdWYWx1ZTxUQ29udHJvbD4sIGFueT4ge1xuICAgIHJldHVybiB0aGlzLl9yZWR1Y2VDaGlsZHJlbih7fSwgKGFjYywgY29udHJvbCwgbmFtZSkgPT4ge1xuICAgICAgKGFjYyBhcyBhbnkpW25hbWVdID0gKGNvbnRyb2wgYXMgYW55KS5nZXRSYXdWYWx1ZSgpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9KSBhcyBhbnk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF9zeW5jUGVuZGluZ0NvbnRyb2xzKCk6IGJvb2xlYW4ge1xuICAgIGxldCBzdWJ0cmVlVXBkYXRlZCA9IHRoaXMuX3JlZHVjZUNoaWxkcmVuKGZhbHNlLCAodXBkYXRlZDogYm9vbGVhbiwgY2hpbGQpID0+IHtcbiAgICAgIHJldHVybiBjaGlsZC5fc3luY1BlbmRpbmdDb250cm9scygpID8gdHJ1ZSA6IHVwZGF0ZWQ7XG4gICAgfSk7XG4gICAgaWYgKHN1YnRyZWVVcGRhdGVkKSB0aGlzLnVwZGF0ZVZhbHVlQW5kVmFsaWRpdHkoe29ubHlTZWxmOiB0cnVlfSk7XG4gICAgcmV0dXJuIHN1YnRyZWVVcGRhdGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfZm9yRWFjaENoaWxkKGNiOiAodjogYW55LCBrOiBhbnkpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbnRyb2xzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAvLyBUaGUgbGlzdCBvZiBjb250cm9scyBjYW4gY2hhbmdlIChmb3IgZXguIGNvbnRyb2xzIG1pZ2h0IGJlIHJlbW92ZWQpIHdoaWxlIHRoZSBsb29wXG4gICAgICAvLyBpcyBydW5uaW5nIChhcyBhIHJlc3VsdCBvZiBpbnZva2luZyBGb3JtcyBBUEkgaW4gYHZhbHVlQ2hhbmdlc2Agc3Vic2NyaXB0aW9uKSwgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gbnVsbCBjaGVjayBiZWZvcmUgaW52b2tpbmcgdGhlIGNhbGxiYWNrLlxuICAgICAgY29uc3QgY29udHJvbCA9ICh0aGlzLmNvbnRyb2xzIGFzIGFueSlba2V5XTtcbiAgICAgIGNvbnRyb2wgJiYgY2IoY29udHJvbCwga2V5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3NldFVwQ29udHJvbHMoKTogdm9pZCB7XG4gICAgdGhpcy5fZm9yRWFjaENoaWxkKChjb250cm9sKSA9PiB7XG4gICAgICBjb250cm9sLnNldFBhcmVudCh0aGlzKTtcbiAgICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKHRoaXMuX29uQ29sbGVjdGlvbkNoYW5nZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIG92ZXJyaWRlIF91cGRhdGVWYWx1ZSgpOiB2b2lkIHtcbiAgICAodGhpcyBhcyBXcml0YWJsZTx0aGlzPikudmFsdWUgPSB0aGlzLl9yZWR1Y2VWYWx1ZSgpIGFzIGFueTtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FueUNvbnRyb2xzKGNvbmRpdGlvbjogKGM6IEFic3RyYWN0Q29udHJvbCkgPT4gYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3QgW2NvbnRyb2xOYW1lLCBjb250cm9sXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmNvbnRyb2xzKSkge1xuICAgICAgaWYgKHRoaXMuY29udGFpbnMoY29udHJvbE5hbWUgYXMgYW55KSAmJiBjb25kaXRpb24oY29udHJvbCBhcyBhbnkpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VWYWx1ZSgpOiBQYXJ0aWFsPFRDb250cm9sPiB7XG4gICAgbGV0IGFjYzogUGFydGlhbDxUQ29udHJvbD4gPSB7fTtcbiAgICByZXR1cm4gdGhpcy5fcmVkdWNlQ2hpbGRyZW4oYWNjLCAoYWNjLCBjb250cm9sLCBuYW1lKSA9PiB7XG4gICAgICBpZiAoY29udHJvbC5lbmFibGVkIHx8IHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgYWNjW25hbWVdID0gY29udHJvbC52YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9yZWR1Y2VDaGlsZHJlbjxULCBLIGV4dGVuZHMga2V5b2YgVENvbnRyb2w+KFxuICAgICAgaW5pdFZhbHVlOiBULCBmbjogKGFjYzogVCwgY29udHJvbDogVENvbnRyb2xbS10sIG5hbWU6IEspID0+IFQpOiBUIHtcbiAgICBsZXQgcmVzID0gaW5pdFZhbHVlO1xuICAgIHRoaXMuX2ZvckVhY2hDaGlsZCgoY29udHJvbDogVENvbnRyb2xbS10sIG5hbWU6IEspID0+IHtcbiAgICAgIHJlcyA9IGZuKHJlcywgY29udHJvbCwgbmFtZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgb3ZlcnJpZGUgX2FsbENvbnRyb2xzRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjb250cm9sTmFtZSBvZiAoT2JqZWN0LmtleXModGhpcy5jb250cm9scykgYXMgQXJyYXk8a2V5b2YgVENvbnRyb2w+KSkge1xuICAgICAgaWYgKCh0aGlzLmNvbnRyb2xzIGFzIGFueSlbY29udHJvbE5hbWVdLmVuYWJsZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5jb250cm9scykubGVuZ3RoID4gMCB8fCB0aGlzLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBvdmVycmlkZSBfZmluZChuYW1lOiBzdHJpbmd8bnVtYmVyKTogQWJzdHJhY3RDb250cm9sfG51bGwge1xuICAgIHJldHVybiB0aGlzLmNvbnRyb2xzLmhhc093blByb3BlcnR5KG5hbWUgYXMgc3RyaW5nKSA/XG4gICAgICAgICh0aGlzLmNvbnRyb2xzIGFzIGFueSlbbmFtZSBhcyBrZXlvZiBUQ29udHJvbF0gOlxuICAgICAgICBudWxsO1xuICB9XG59XG5cbi8qKlxuICogV2lsbCB2YWxpZGF0ZSB0aGF0IG5vbmUgb2YgdGhlIGNvbnRyb2xzIGhhcyBhIGtleSB3aXRoIGEgZG90XG4gKiBUaHJvd3Mgb3RoZXIgd2lzZVxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUZvcm1Hcm91cENvbnRyb2xzPFRDb250cm9sPihcbiAgICBjb250cm9sczoge1tLIGluIGtleW9mIFRDb250cm9sXTogQWJzdHJhY3RDb250cm9sPGFueSwgYW55Pjt9KSB7XG4gIGNvbnN0IGludmFsaWRLZXlzID0gT2JqZWN0LmtleXMoY29udHJvbHMpLmZpbHRlcihrZXkgPT4ga2V5LmluY2x1ZGVzKCcuJykpO1xuICBpZiAoaW52YWxpZEtleXMubGVuZ3RoID4gMCkge1xuICAgIC8vIFRPRE86IG1ha2UgdGhpcyBhbiBlcnJvciBvbmNlIHRoZXJlIGFyZSBubyBtb3JlIHVzZXMgaW4gRzNcbiAgICBjb25zb2xlLndhcm4oYEZvcm1Hcm91cCBrZXlzIGNhbm5vdCBpbmNsdWRlIFxcYC5cXGAsIHBsZWFzZSByZXBsYWNlIHRoZSBrZXlzIGZvcjogJHtcbiAgICAgICAgaW52YWxpZEtleXMuam9pbignLCcpfS5gKTtcbiAgfVxufVxuXG5cbmludGVyZmFjZSBVbnR5cGVkRm9ybUdyb3VwQ3RvciB7XG4gIG5ldyhjb250cm9sczoge1trZXk6IHN0cmluZ106IEFic3RyYWN0Q29udHJvbH0sXG4gICAgICB2YWxpZGF0b3JPck9wdHM/OiBWYWxpZGF0b3JGbnxWYWxpZGF0b3JGbltdfEFic3RyYWN0Q29udHJvbE9wdGlvbnN8bnVsbCxcbiAgICAgIGFzeW5jVmFsaWRhdG9yPzogQXN5bmNWYWxpZGF0b3JGbnxBc3luY1ZhbGlkYXRvckZuW118bnVsbCk6IFVudHlwZWRGb3JtR3JvdXA7XG5cbiAgLyoqXG4gICAqIFRoZSBwcmVzZW5jZSBvZiBhbiBleHBsaWNpdCBgcHJvdG90eXBlYCBwcm9wZXJ0eSBwcm92aWRlcyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBmb3IgYXBwcyB0aGF0XG4gICAqIG1hbnVhbGx5IGluc3BlY3QgdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgICovXG4gIHByb3RvdHlwZTogRm9ybUdyb3VwPGFueT47XG59XG5cbi8qKlxuICogVW50eXBlZEZvcm1Hcm91cCBpcyBhIG5vbi1zdHJvbmdseS10eXBlZCB2ZXJzaW9uIG9mIGBGb3JtR3JvdXBgLlxuICovXG5leHBvcnQgdHlwZSBVbnR5cGVkRm9ybUdyb3VwID0gRm9ybUdyb3VwPGFueT47XG5cbmV4cG9ydCBjb25zdCBVbnR5cGVkRm9ybUdyb3VwOiBVbnR5cGVkRm9ybUdyb3VwQ3RvciA9IEZvcm1Hcm91cDtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFzc2VydHMgdGhhdCB0aGUgZ2l2ZW4gY29udHJvbCBpcyBhbiBpbnN0YW5jZSBvZiBgRm9ybUdyb3VwYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNvbnN0IGlzRm9ybUdyb3VwID0gKGNvbnRyb2w6IHVua25vd24pOiBjb250cm9sIGlzIEZvcm1Hcm91cCA9PiBjb250cm9sIGluc3RhbmNlb2YgRm9ybUdyb3VwO1xuXG4vKipcbiAqIFRyYWNrcyB0aGUgdmFsdWUgYW5kIHZhbGlkaXR5IHN0YXRlIG9mIGEgY29sbGVjdGlvbiBvZiBgRm9ybUNvbnRyb2xgIGluc3RhbmNlcywgZWFjaCBvZiB3aGljaCBoYXNcbiAqIHRoZSBzYW1lIHZhbHVlIHR5cGUuXG4gKlxuICogYEZvcm1SZWNvcmRgIGlzIHZlcnkgc2ltaWxhciB0byB7QGxpbmsgRm9ybUdyb3VwfSwgZXhjZXB0IGl0IGNhbiBiZSB1c2VkIHdpdGggYSBkeW5hbWljIGtleXMsXG4gKiB3aXRoIGNvbnRyb2xzIGFkZGVkIGFuZCByZW1vdmVkIGFzIG5lZWRlZC5cbiAqXG4gKiBgRm9ybVJlY29yZGAgYWNjZXB0cyBvbmUgZ2VuZXJpYyBhcmd1bWVudCwgd2hpY2ggZGVzY3JpYmVzIHRoZSB0eXBlIG9mIHRoZSBjb250cm9scyBpdCBjb250YWlucy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIGBgYFxuICogbGV0IG51bWJlcnMgPSBuZXcgRm9ybVJlY29yZCh7YmlsbDogbmV3IEZvcm1Db250cm9sKCc0MTUtMTIzLTQ1NicpfSk7XG4gKiBudW1iZXJzLmFkZENvbnRyb2woJ2JvYicsIG5ldyBGb3JtQ29udHJvbCgnNDE1LTIzNC01NjcnKSk7XG4gKiBudW1iZXJzLnJlbW92ZUNvbnRyb2woJ2JpbGwnKTtcbiAqIGBgYFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEZvcm1SZWNvcmQ8VENvbnRyb2wgZXh0ZW5kcyBBYnN0cmFjdENvbnRyb2wgPSBBYnN0cmFjdENvbnRyb2w+IGV4dGVuZHNcbiAgICBGb3JtR3JvdXA8e1trZXk6IHN0cmluZ106IFRDb250cm9sfT4ge31cblxuZXhwb3J0IGludGVyZmFjZSBGb3JtUmVjb3JkPFRDb250cm9sPiB7XG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgYSBjb250cm9sIHdpdGggdGhlIHJlY29yZHMncyBsaXN0IG9mIGNvbnRyb2xzLlxuICAgKlxuICAgKiBTZWUgYEZvcm1Hcm91cCNyZWdpc3RlckNvbnRyb2xgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgcmVnaXN0ZXJDb250cm9sKG5hbWU6IHN0cmluZywgY29udHJvbDogVENvbnRyb2wpOiBUQ29udHJvbDtcblxuICAvKipcbiAgICogQWRkIGEgY29udHJvbCB0byB0aGlzIGdyb3VwLlxuICAgKlxuICAgKiBTZWUgYEZvcm1Hcm91cCNhZGRDb250cm9sYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGFkZENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBUQ29udHJvbCwgb3B0aW9ucz86IHtlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGNvbnRyb2wgZnJvbSB0aGlzIGdyb3VwLlxuICAgKlxuICAgKiBTZWUgYEZvcm1Hcm91cCNyZW1vdmVDb250cm9sYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIHJlbW92ZUNvbnRyb2wobmFtZTogc3RyaW5nLCBvcHRpb25zPzoge2VtaXRFdmVudD86IGJvb2xlYW59KTogdm9pZDtcblxuICAvKipcbiAgICogUmVwbGFjZSBhbiBleGlzdGluZyBjb250cm9sLlxuICAgKlxuICAgKiBTZWUgYEZvcm1Hcm91cCNzZXRDb250cm9sYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIHNldENvbnRyb2wobmFtZTogc3RyaW5nLCBjb250cm9sOiBUQ29udHJvbCwgb3B0aW9ucz86IHtlbWl0RXZlbnQ/OiBib29sZWFufSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIENoZWNrIHdoZXRoZXIgdGhlcmUgaXMgYW4gZW5hYmxlZCBjb250cm9sIHdpdGggdGhlIGdpdmVuIG5hbWUgaW4gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBTZWUgYEZvcm1Hcm91cCNjb250YWluc2AgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBjb250YWlucyhjb250cm9sTmFtZTogc3RyaW5nKTogYm9vbGVhbjtcblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGBGb3JtUmVjb3JkYC4gSXQgYWNjZXB0cyBhbiBvYmplY3QgdGhhdCBtYXRjaGVzXG4gICAqIHRoZSBzdHJ1Y3R1cmUgb2YgdGhlIGdyb3VwLCB3aXRoIGNvbnRyb2wgbmFtZXMgYXMga2V5cy5cbiAgICpcbiAgICogU2VlIGBGb3JtR3JvdXAjc2V0VmFsdWVgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWU6IHtba2V5OiBzdHJpbmddOiDJtVZhbHVlPFRDb250cm9sPn0sIG9wdGlvbnM/OiB7XG4gICAgb25seVNlbGY/OiBib29sZWFuLFxuICAgIGVtaXRFdmVudD86IGJvb2xlYW5cbiAgfSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFBhdGNoZXMgdGhlIHZhbHVlIG9mIHRoZSBgRm9ybVJlY29yZGAuIEl0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggY29udHJvbFxuICAgKiBuYW1lcyBhcyBrZXlzLCBhbmQgZG9lcyBpdHMgYmVzdCB0byBtYXRjaCB0aGUgdmFsdWVzIHRvIHRoZSBjb3JyZWN0IGNvbnRyb2xzXG4gICAqIGluIHRoZSBncm91cC5cbiAgICpcbiAgICogU2VlIGBGb3JtR3JvdXAjcGF0Y2hWYWx1ZWAgZm9yIGFkZGl0aW9uYWwgaW5mb3JtYXRpb24uXG4gICAqL1xuICBwYXRjaFZhbHVlKHZhbHVlOiB7W2tleTogc3RyaW5nXTogybVWYWx1ZTxUQ29udHJvbD59LCBvcHRpb25zPzoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuXG4gIH0pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGBGb3JtUmVjb3JkYCwgbWFya3MgYWxsIGRlc2NlbmRhbnRzIGBwcmlzdGluZWAgYW5kIGB1bnRvdWNoZWRgIGFuZCBzZXRzXG4gICAqIHRoZSB2YWx1ZSBvZiBhbGwgZGVzY2VuZGFudHMgdG8gbnVsbC5cbiAgICpcbiAgICogU2VlIGBGb3JtR3JvdXAjcmVzZXRgIGZvciBhZGRpdGlvbmFsIGluZm9ybWF0aW9uLlxuICAgKi9cbiAgcmVzZXQodmFsdWU/OiB7W2tleTogc3RyaW5nXTogybVWYWx1ZTxUQ29udHJvbD59LCBvcHRpb25zPzoge1xuICAgIG9ubHlTZWxmPzogYm9vbGVhbixcbiAgICBlbWl0RXZlbnQ/OiBib29sZWFuXG4gIH0pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBUaGUgYWdncmVnYXRlIHZhbHVlIG9mIHRoZSBgRm9ybVJlY29yZGAsIGluY2x1ZGluZyBhbnkgZGlzYWJsZWQgY29udHJvbHMuXG4gICAqXG4gICAqIFNlZSBgRm9ybUdyb3VwI2dldFJhd1ZhbHVlYCBmb3IgYWRkaXRpb25hbCBpbmZvcm1hdGlvbi5cbiAgICovXG4gIGdldFJhd1ZhbHVlKCk6IHtba2V5OiBzdHJpbmddOiDJtVJhd1ZhbHVlPFRDb250cm9sPn07XG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBc3NlcnRzIHRoYXQgdGhlIGdpdmVuIGNvbnRyb2wgaXMgYW4gaW5zdGFuY2Ugb2YgYEZvcm1SZWNvcmRgXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY29uc3QgaXNGb3JtUmVjb3JkID0gKGNvbnRyb2w6IHVua25vd24pOiBjb250cm9sIGlzIEZvcm1SZWNvcmQgPT5cbiAgICBjb250cm9sIGluc3RhbmNlb2YgRm9ybVJlY29yZDtcbiJdfQ==