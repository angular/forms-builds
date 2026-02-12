/**
 * @license Angular v21.2.0-next.3+sha-b386f95
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */

import { WritableSignal, EventEmitter } from '@angular/core';
import { FormOptions, FieldTree, SchemaOrSchemaFn, ValidationError, SignalFormsConfig, SchemaFn } from './_structure-chunk.js';
import { AbstractControl, FormControlStatus, FormControlState } from '@angular/forms';
import '@standard-schema/spec';

/**
 * Options that may be specified when creating a compat form.
 *
 * @category interop
 * @experimental 21.0.0
 */
type CompatFormOptions<TModel> = Omit<FormOptions<TModel>, 'adapter'>;
/**
 * Creates a compatibility form wrapped around the given model data.
 *
 * `compatForm` is a version of the `form` function that is designed for backwards
 * compatibility with Reactive forms by accepting Reactive controls as a part of the data.
 *
 * @example
 * ```ts
 * const lastName = new FormControl('lastName');
 *
 * const nameModel = signal({
 *    first: '',
 *    last: lastName
 * });
 *
 * const nameForm = compatForm(nameModel, (name) => {
 *   required(name.first);
 * });
 *
 * nameForm.last().value(); // lastName, not FormControl
 * ```
 *
 * @param model A writable signal that contains the model data for the form. The resulting field
 * structure will match the shape of the model and any changes to the form data will be written to
 * the model.

 * @category interop
 * @experimental 21.0.0
 */
declare function compatForm<TModel>(model: WritableSignal<TModel>): FieldTree<TModel>;
/**
 * Creates a compatibility form wrapped around the given model data.
 *
 * `compatForm` is a version of the `form` function that is designed for backwards
 * compatibility with Reactive forms by accepting Reactive controls as a part of the data.
 *
 * @example
 * ```ts
 * const lastName = new FormControl('lastName');
 *
 * const nameModel = signal({
 *    first: '',
 *    last: lastName
 * });
 *
 * const nameForm = compatForm(nameModel, (name) => {
 *   required(name.first);
 * });
 *
 * nameForm.last().value(); // lastName, not FormControl
 *
 * @param model A writable signal that contains the model data for the form. The resulting field
 * structure will match the shape of the model and any changes to the form data will be written to
 * the model.
 * @param schemaOrOptions The second argument can be either
 *   1. A schema or a function used to specify logic for the form (e.g. validation, disabled fields, etc.).
 *      When passing a schema, the form options can be passed as a third argument if needed.
 *   2. The form options (excluding adapter, since it's provided).
 *
 * @category interop
 * @experimental 21.0.0
 */
declare function compatForm<TModel>(model: WritableSignal<TModel>, schemaOrOptions: SchemaOrSchemaFn<TModel> | CompatFormOptions<TModel>): FieldTree<TModel>;
/**
 * Creates a compatibility form wrapped around the given model data.
 *
 * `compatForm` is a version of the `form` function that is designed for backwards
 * compatibility with Reactive forms by accepting Reactive controls as a part of the data.
 *
 * @example
 * ```ts
 * const lastName = new FormControl('lastName');
 *
 * const nameModel = signal({
 *    first: '',
 *    last: lastName
 * });
 *
 * const nameForm = compatForm(nameModel, (name) => {
 *   required(name.first);
 * });
 *
 * nameForm.last().value(); // lastName, not FormControl
 *
 * @param model A writable signal that contains the model data for the form. The resulting field
 * structure will match the shape of the model and any changes to the form data will be written to
 * the model.
 * @param schemaOrOptions A schema or a function used to specify logic for the form (e.g. validation, disabled fields, etc.).
 *      When passing a schema, the form options can be passed as a third argument if needed.
 * @param options The form options (excluding adapter, since it's provided).
 *
 * @category interop
 * @experimental 21.0.0
 */
declare function compatForm<TModel>(model: WritableSignal<TModel>, schema: SchemaOrSchemaFn<TModel>, options: CompatFormOptions<TModel>): FieldTree<TModel>;

/**
 * An error used for compat errors.
 *
 * @experimental 21.0.0
 * @category interop
 */
declare class CompatValidationError<T = unknown> implements ValidationError {
    readonly kind: string;
    readonly control: AbstractControl;
    readonly fieldTree: FieldTree<unknown>;
    readonly context: T;
    readonly message?: string;
    constructor({ context, kind, control }: {
        context: T;
        kind: string;
        control: AbstractControl;
    });
}

/**
 * A value that can be used for `SignalFormsConfig.classes` to automatically add
 * the `ng-*` status classes from reactive forms.
 *
 * @experimental 21.0.1
 */
declare const NG_STATUS_CLASSES: SignalFormsConfig['classes'];

/** Options used to update the control value. */
type ValueUpdateOptions = {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
};
/**
 * A `FormControl` that is backed by signal forms rules.
 *
 * This class provides a bridge between Signal Forms and Reactive Forms, allowing
 * signal-based controls to be used within a standard `FormGroup` or `FormArray`.
 *
 * A control could be created using signal forms, and integrated with an existing FormGroup
 * propagating all the statuses and validity.
 *
 * @usageNotes
 *
 * ### Basic usage
 *
 * ```angular-ts
 * const form = new FormGroup({
 *   // You can create SignalFormControl with signal form rules, and add it to a FormGroup.
 *   name: new SignalFormControl('Alice', p => {
 *     required(p);
 *   }),
 *   age: new FormControl(25),
 * });
 * ```
 * In the template you can get the underlying `fieldTree` and bind it:
 *
 * ```angular-html
 *  <form [formGroup]="form">
 *    <input [formField]="nameControl.fieldTree" />
 *    <input formControlName="age" />
 *  </form>
 * ```
 *
 * @experimental
 */
declare class SignalFormControl<T> extends AbstractControl {
    /** Source FieldTree. */
    readonly fieldTree: FieldTree<T>;
    /** The raw signal driving the control value. */
    readonly sourceValue: WritableSignal<T>;
    private readonly fieldState;
    private readonly initialValue;
    private pendingParentNotifications;
    private readonly onChangeCallbacks;
    private readonly onDisabledChangeCallbacks;
    readonly valueChanges: EventEmitter<T>;
    readonly statusChanges: EventEmitter<FormControlStatus>;
    constructor(value: T, schemaOrOptions?: SchemaFn<T> | FormOptions<T>, options?: FormOptions<T>);
    /**
     * Defines properties using closure-safe names to prevent issues with property renaming optimizations.
     *
     * AbstractControl have `value` and `errors` as readonly prop, which doesn't allow getters.
     **/
    private defineCompatProperties;
    private emitControlEvent;
    setValue(value: any, options?: ValueUpdateOptions): void;
    patchValue(value: any, options?: ValueUpdateOptions): void;
    private updateValue;
    registerOnChange(fn: (value?: any, emitModelEvent?: boolean) => void): void;
    registerOnDisabledChange(fn: (isDisabled: boolean) => void): void;
    getRawValue(): T;
    reset(value?: T | FormControlState<T>, options?: ValueUpdateOptions): void;
    private scheduleParentUpdate;
    private notifyParentUnlessPending;
    private updateParentValueAndValidity;
    private propagateToParent;
    get status(): FormControlStatus;
    get valid(): boolean;
    get invalid(): boolean;
    get pending(): boolean;
    get disabled(): boolean;
    get enabled(): boolean;
    get dirty(): boolean;
    set dirty(_: boolean);
    get pristine(): boolean;
    set pristine(_: boolean);
    get touched(): boolean;
    set touched(_: boolean);
    get untouched(): boolean;
    set untouched(_: boolean);
    markAsTouched(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsDirty(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsPristine(opts?: {
        onlySelf?: boolean;
    }): void;
    markAsUntouched(opts?: {
        onlySelf?: boolean;
    }): void;
    updateValueAndValidity(_opts?: Object): void;
    disable(_opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    enable(_opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
    setValidators(_validators: any): void;
    setAsyncValidators(_validators: any): void;
    addValidators(_validators: any): void;
    addAsyncValidators(_validators: any): void;
    removeValidators(_validators: any): void;
    removeAsyncValidators(_validators: any): void;
    clearValidators(): void;
    clearAsyncValidators(): void;
    setErrors(_errors: any, _opts?: {
        emitEvent?: boolean;
    }): void;
    markAsPending(_opts?: {
        onlySelf?: boolean;
        emitEvent?: boolean;
    }): void;
}

export { CompatValidationError, NG_STATUS_CLASSES, SignalFormControl, compatForm };
export type { CompatFormOptions };
