/**
 * @license Angular v21.3.0-next.0+sha-d501506
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { WritableSignal, Signal, InjectionToken, Injector, Provider } from '@angular/core';
import { AbstractControl, ValidationErrors, FormControlStatus, ControlValueAccessor, ValidatorFn } from '@angular/forms';
import { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Symbol used to retain generic type information when it would otherwise be lost.
 */
declare const ɵɵTYPE: unique symbol;
/**
 * Options that can be specified when submitting a form.
 *
 * @experimental 21.2.0
 */
interface FormSubmitOptions<TRootModel, TSubmittedModel> {
    /**
     * Function to run when submitting the form data (when form is valid).
     *
     * @param field The contextually relevant field for this action function (the root field when
     *   specified during form creation, and the submitted field when specified as part of the
     *   `submit()` call)
     * @param detail An object containing the root field of the submitted form as well as the
     *   submitted field itself
     */
    action: (field: FieldTree<TRootModel & TSubmittedModel>, detail: {
        root: FieldTree<TRootModel>;
        submitted: FieldTree<TSubmittedModel>;
    }) => Promise<TreeValidationResult>;
    /**
     * Function to run when attempting to submit the form data but validation is failing.
     *
     * @param field The contextually relevant field for this onInvalid function (the root field when
     *   specified during form creation, and the submitted field when specified as part of the
     *   `submit()` call)
     * @param detail An object containing the root field of the submitted form as well as the
     *   submitted field itself
     */
    onInvalid?: (field: FieldTree<TRootModel & TSubmittedModel>, detail: {
        root: FieldTree<TRootModel>;
        submitted: FieldTree<TSubmittedModel>;
    }) => void;
    /**
     * Whether to ignore any of the validators when submitting:
     * - 'pending': Will submit if there are no invalid validators, pending validators do not block submission (default)
     * - 'none': Will not submit unless all validators are passing, pending validators block submission
     * - 'ignore': Will always submit regardless of invalid or pending validators
     */
    ignoreValidators?: 'pending' | 'none' | 'all';
}
/**
 * A type that represents either a single value of type `T` or a readonly array of `T`.
 * @template T The type of the value(s).
 *
 * @experimental 21.0.0
 */
type OneOrMany<T> = T | readonly T[];
/**
 * The kind of `FieldPath` (`Root`, `Child` of another `FieldPath`, or `Item` in a `FieldPath` array)
 *
 * @experimental 21.0.0
 */
type PathKind = PathKind.Root | PathKind.Child | PathKind.Item;
declare namespace PathKind {
    /**
     * The `PathKind` for a `FieldPath` that is at the root of its field tree.
     */
    interface Root {
        /**
         * The `ɵɵTYPE` is constructed to allow the `extends` clause on `Child` and `Item` to narrow the
         * type. Another way to think about this is, if we have a function that expects this kind of
         * path, the `ɵɵTYPE` lists the kinds of path we are allowed to pass to it.
         */
        [ɵɵTYPE]: 'root' | 'child' | 'item';
    }
    /**
     * The `PathKind` for a `FieldPath` that is a child of another `FieldPath`.
     */
    interface Child extends PathKind.Root {
        [ɵɵTYPE]: 'child' | 'item';
    }
    /**
     * The `PathKind` for a `FieldPath` that is an item in a `FieldPath` array.
     */
    interface Item extends PathKind.Child {
        [ɵɵTYPE]: 'item';
    }
}
/**
 * A reason for a field's disablement.
 *
 * @category logic
 * @experimental 21.0.0
 */
interface DisabledReason {
    /** The field that is disabled. */
    readonly fieldTree: FieldTree<unknown>;
    /** A user-facing message describing the reason for the disablement. */
    readonly message?: string;
}
/**
 * The absence of an error which indicates a successful validation result.
 *
 * @category types
 * @experimental 21.0.0
 */
type ValidationSuccess = null | undefined | void;
/**
 * The result of running a tree validation function.
 *
 * The result may be one of the following:
 * 1. A {@link ValidationSuccess} to indicate no errors.
 * 2. A {@link ValidationError} without a field to indicate an error on the field being validated.
 * 3. A {@link ValidationError} with a field to indicate an error on the target field.
 * 4. A list of {@link ValidationError} with or without fields to indicate multiple errors.
 *
 * @template E the type of error (defaults to {@link ValidationError}).
 *
 * @category types
 * @experimental 21.0.0
 */
type TreeValidationResult<E extends ValidationError.WithOptionalFieldTree = ValidationError.WithOptionalFieldTree> = ValidationSuccess | OneOrMany<E>;
/**
 * A validation result where all errors explicitly define their target field.
 *
 * The result may be one of the following:
 * 1. A {@link ValidationSuccess} to indicate no errors.
 * 2. A {@link ValidationError} with a field to indicate an error on the target field.
 * 3. A list of {@link ValidationError} with fields to indicate multiple errors.
 *
 * @template E the type of error (defaults to {@link ValidationError}).
 *
 * @category types
 * @experimental 21.0.0
 */
type ValidationResult<E extends ValidationError = ValidationError> = ValidationSuccess | OneOrMany<E>;
/**
 * An asynchronous validation result where all errors explicitly define their target field.
 *
 * The result may be one of the following:
 * 1. A {@link ValidationResult} to indicate the result if resolved.
 * 5. 'pending' if the validation is not yet resolved.
 *
 * @template E the type of error (defaults to {@link ValidationError}).
 *
 * @category types
 * @experimental 21.0.0
 */
type AsyncValidationResult<E extends ValidationError = ValidationError> = ValidationResult<E> | 'pending';
/**
 * A field accessor function that returns the state of the field.
 *
 * @template TValue The type of the value stored in the field.
 * @template TKey The type of the property key which this field resides under in its parent.
 *
 * @category types
 * @experimental 21.2.0
 */
type Field<TValue, TKey extends string | number = string | number> = () => FieldState<TValue, TKey>;
/**
 * An object that represents a tree of fields in a form. This includes both primitive value fields
 * (e.g. fields that contain a `string` or `number`), as well as "grouping fields" that contain
 * sub-fields. `FieldTree` objects are arranged in a tree whose structure mimics the structure of the
 * underlying data. For example a `FieldTree<{x: number}>` has a property `x` which contains a
 * `FieldTree<number>`. To access the state associated with a field, call it as a function.
 *
 * @template TValue The type of the data which the field is wrapped around.
 * @template TKey The type of the property key which this field resides under in its parent.
 *
 * @category types
 * @experimental 21.0.0
 */
type FieldTree<TModel, TKey extends string | number = string | number> = (() => [TModel] extends [AbstractControl] ? CompatFieldState<TModel, TKey> : FieldState<TModel, TKey>) & ([TModel] extends [AbstractControl] ? object : [TModel] extends [ReadonlyArray<infer U>] ? ReadonlyArrayLike<MaybeFieldTree<U, number>> : TModel extends Record<string, any> ? Subfields<TModel> : object);
/**
 * The sub-fields that a user can navigate to from a `FieldTree<TModel>`.
 *
 * @template TModel The type of the data which the parent field is wrapped around.
 *
 * @experimental 21.0.0
 */
type Subfields<TModel> = {
    readonly [K in keyof TModel as TModel[K] extends Function ? never : K]: MaybeFieldTree<TModel[K], string>;
} & {
    [Symbol.iterator](): Iterator<[string, MaybeFieldTree<TModel[keyof TModel], string>]>;
};
/**
 * An iterable object with the same shape as a readonly array.
 *
 * @template T The array item type.
 *
 * @experimental 21.0.0
 */
type ReadonlyArrayLike<T> = Pick<ReadonlyArray<T>, number | 'length' | typeof Symbol.iterator>;
/**
 * Helper type for defining `FieldTree`. Given a type `TValue` that may include `undefined`, it extracts
 * the `undefined` outside the `FieldTree` type.
 *
 * For example `MaybeField<{a: number} | undefined, TKey>` would be equivalent to
 * `undefined | FieldTree<{a: number}, TKey>`.
 *
 * @template TModel The type of the data which the field is wrapped around.
 * @template TKey The type of the property key which this field resides under in its parent.
 *
 * @experimental 21.0.0
 */
type MaybeFieldTree<TModel, TKey extends string | number = string | number> = (TModel & undefined) | FieldTree<Exclude<TModel, undefined>, TKey>;
/**
 * Contains all of the state (e.g. value, statuses, etc.) associated with a `FieldTree`, exposed as
 * signals.
 *
 * @category structure
 * @experimental 21.0.0
 */
interface FieldState<TValue, TKey extends string | number = string | number> {
    /**
     * The {@link FieldTree} associated with this field state.
     */
    readonly fieldTree: FieldTree<unknown, TKey>;
    /**
     * A writable signal containing the value for this field.
     *
     * Updating this signal will update the data model that the field is bound to.
     *
     * While updates from the UI control are eventually reflected here, they may be delayed if
     * debounced.
     */
    readonly value: WritableSignal<TValue>;
    /**
     * A signal indicating whether the field is currently disabled.
     */
    readonly disabled: Signal<boolean>;
    /**
     * A signal indicating the field's maximum value, if applicable.
     *
     * Applies to `<input>` with a numeric or date `type` attribute and custom controls.
     */
    readonly max?: Signal<number | undefined>;
    /**
     * A signal indicating the field's maximum string length, if applicable.
     *
     * Applies to `<input>`, `<textarea>`, and custom controls.
     */
    readonly maxLength?: Signal<number | undefined>;
    /**
     * A signal indicating the field's minimum value, if applicable.
     *
     * Applies to `<input>` with a numeric or date `type` attribute and custom controls.
     */
    readonly min?: Signal<number | undefined>;
    /**
     * A signal indicating the field's minimum string length, if applicable.
     *
     * Applies to `<input>`, `<textarea>`, and custom controls.
     */
    readonly minLength?: Signal<number | undefined>;
    /**
     * A signal of a unique name for the field, by default based on the name of its parent field.
     */
    readonly name: Signal<string>;
    /**
     * A signal indicating the patterns the field must match.
     */
    readonly pattern: Signal<readonly RegExp[]>;
    /**
     * A signal indicating whether the field is currently readonly.
     */
    readonly readonly: Signal<boolean>;
    /**
     * A signal indicating whether the field is required.
     */
    readonly required: Signal<boolean>;
    /**
     * A signal indicating whether the field has been touched by the user.
     */
    readonly touched: Signal<boolean>;
    /**
     * A signal indicating whether field value has been changed by user.
     */
    readonly dirty: Signal<boolean>;
    /**
     * A signal indicating whether a field is hidden.
     *
     * When a field is hidden it is ignored when determining the valid, touched, and dirty states.
     *
     * Note: This doesn't hide the field in the template, that must be done manually.
     * ```
     * @if (!field.hidden()) {
     *   ...
     * }
     * ```
     */
    readonly hidden: Signal<boolean>;
    readonly disabledReasons: Signal<readonly DisabledReason[]>;
    readonly errors: Signal<ValidationError.WithFieldTree[]>;
    /**
     * A signal containing the {@link errors} of the field and its descendants.
     */
    readonly errorSummary: Signal<ValidationError.WithFieldTree[]>;
    /**
     * A signal indicating whether the field's value is currently valid.
     *
     * Note: `valid()` is not the same as `!invalid()`.
     * - `valid()` is `true` when there are no validation errors *and* no pending validators.
     * - `invalid()` is `true` when there are validation errors, regardless of pending validators.
     *
     * Ex: consider the situation where a field has 3 validators, 2 of which have no errors and 1 of
     * which is still pending. In this case `valid()` is `false` because of the pending validator.
     * However `invalid()` is also `false` because there are no errors.
     */
    readonly valid: Signal<boolean>;
    /**
     * A signal indicating whether the field's value is currently invalid.
     *
     * Note: `invalid()` is not the same as `!valid()`.
     * - `invalid()` is `true` when there are validation errors, regardless of pending validators.
     * - `valid()` is `true` when there are no validation errors *and* no pending validators.
     *
     * Ex: consider the situation where a field has 3 validators, 2 of which have no errors and 1 of
     * which is still pending. In this case `invalid()` is `false` because there are no errors.
     * However `valid()` is also `false` because of the pending validator.
     */
    readonly invalid: Signal<boolean>;
    /**
     * Whether there are any validators still pending for this field.
     */
    readonly pending: Signal<boolean>;
    /**
     * A signal indicating whether the field is currently in the process of being submitted.
     */
    readonly submitting: Signal<boolean>;
    /**
     * The property key in the parent field under which this field is stored. If the parent field is
     * array-valued, for example, this is the index of this field in that array.
     */
    readonly keyInParent: Signal<TKey>;
    /**
     * The {@link FormField} directives that bind this field to a UI control.
     */
    readonly formFieldBindings: Signal<readonly FormField<unknown>[]>;
    /**
     * A signal containing the value of the control to which this field is bound.
     *
     * This differs from {@link value} in that it's not subject to debouncing, and thus is used to
     * buffer debounced updates from the control to the field. This will also not take into account
     * the {@link controlValue} of children.
     */
    readonly controlValue: WritableSignal<TValue>;
    /**
     * Sets the dirty status of the field to `true`.
     */
    markAsDirty(): void;
    /**
     * Sets the touched status of the field to `true`.
     */
    markAsTouched(): void;
    /**
     * Reads a metadata value from the field.
     * @param key The metadata key to read.
     */
    metadata<M>(key: MetadataKey<M, any, any>): M | undefined;
    /**
     * Resets the {@link touched} and {@link dirty} state of the field and its descendants.
     *
     * Note this does not change the data model, which can be reset directly if desired.
     *
     * @param value Optional value to set to the form. If not passed, the value will not be changed.
     */
    reset(value?: TValue): void;
    /**
     * Focuses the first UI control in the DOM that is bound to this field state.
     * If no UI control is bound, does nothing.
     * @param options Optional focus options to pass to the native focus() method.
     */
    focusBoundControl(options?: FocusOptions): void;
}
/**
 * This is FieldState also providing access to the wrapped FormControl.
 *
 * @category interop
 * @experimental 21.0.0
 */
type CompatFieldState<TControl extends AbstractControl, TKey extends string | number = string | number> = FieldState<TControl extends AbstractControl<unknown, infer TValue> ? TValue : never, TKey> & {
    control: Signal<TControl>;
};
/**
 * Allows declaring whether the Rules are supported for a given path.
 *
 * @experimental 21.0.0
 **/
type SchemaPathRules = SchemaPathRules.Supported | SchemaPathRules.Unsupported;
declare namespace SchemaPathRules {
    /**
     * Used for paths that support settings rules.
     */
    type Supported = 1;
    /**
     * Used for paths that do not support settings rules, e.g., compatPath.
     */
    type Unsupported = 2;
}
/**
 * An object that represents a location in the `FieldTree` tree structure and is used to bind logic to a
 * particular part of the structure prior to the creation of the form. Because the `FieldPath`
 * exists prior to the form's creation, it cannot be used to access any of the field state.
 *
 * @template TValue The type of the data which the form is wrapped around.
 * @template TPathKind The kind of path (root field, child field, or item of an array)
 *
 * @category types
 * @experimental 21.0.0
 */
type SchemaPath<TValue, TSupportsRules extends SchemaPathRules = SchemaPathRules.Supported, TPathKind extends PathKind = PathKind.Root> = {
    [ɵɵTYPE]: {
        value: () => TValue;
        supportsRules: TSupportsRules;
        pathKind: TPathKind;
    };
};
/**
 * Schema path used if the value is an AbstractControl.
 *
 * @category interop
 * @experimental 21.0.0
 */
type CompatSchemaPath<TControl extends AbstractControl, TPathKind extends PathKind = PathKind.Root> = SchemaPath<TControl extends AbstractControl<unknown, infer TValue> ? TValue : never, SchemaPathRules.Unsupported, TPathKind> & {
    [ɵɵTYPE]: {
        control: TControl;
    };
};
/**
 * Nested schema path.
 *
 * It mirrors the structure of a given data structure, and allows applying rules to the appropriate
 * fields.
 *
 * @experimental 21.0.0
 */
type SchemaPathTree<TModel, TPathKind extends PathKind = PathKind.Root> = ([TModel] extends [AbstractControl] ? CompatSchemaPath<TModel, TPathKind> : SchemaPath<TModel, SchemaPathRules.Supported, TPathKind>) & (TModel extends AbstractControl ? unknown : TModel extends ReadonlyArray<any> ? unknown : TModel extends Record<string, any> ? {
    [K in keyof TModel]: MaybeSchemaPathTree<TModel[K], PathKind.Child>;
} : unknown);
/**
 * Helper type for defining `FieldPath`. Given a type `TValue` that may include `undefined`, it
 * extracts the `undefined` outside the `FieldPath` type.
 *
 * For example `MaybeFieldPath<{a: number} | undefined, PathKind.Child>` would be equivalent to
 * `undefined | FieldTree<{a: number}, PathKind.child>`.
 *
 * @template TValue The type of the data which the field is wrapped around.
 * @template TPathKind The kind of path (root field, child field, or item of an array)
 *
 * @experimental 21.0.0
 */
type MaybeSchemaPathTree<TModel, TPathKind extends PathKind = PathKind.Root> = (TModel & undefined) | SchemaPathTree<Exclude<TModel, undefined>, TPathKind>;
/**
 * A reusable schema that defines behavior and rules for a form.
 *
 * A `Schema` encapsulates form logic such as validation rules, disabled states, readonly states,
 * and other field-level behaviors.
 *
 * Unlike raw {@link SchemaFn}, a `Schema` is created using
 * the {@link schema} function and is cached per-form, even when applied to multiple fields.
 *
 * ### Creating a reusable schema
 *
 * ```typescript
 * interface Address {
 *   street: string;
 *   city: string;
 * }
 *
 * // Create a reusable schema for address fields
 * const addressSchema = schema<Address>((p) => {
 *   required(p.street);
 *   required(p.city);
 * });
 *
 * // Apply the schema to multiple forms
 * const shippingForm = form(shippingModel, addressSchema, {injector});
 * const billingForm = form(billingModel, addressSchema, {injector});
 * ```
 *
 * ### Passing a schema to a form
 *
 * A schema can also be passed as a second argument to the {@link form} function.
 *
 * ```typescript
 * readonly userForm = form(addressModel, addressSchema);
 * ```
 *
 * @template TModel Data type.
 *
 * @category types
 * @experimental 21.0.0
 */
type Schema<in TModel> = {
    [ɵɵTYPE]: SchemaFn<TModel, PathKind.Root>;
};
/**
 * A function that receives a {@link SchemaPathTree} and applies rules to fields.
 *
 * A `SchemaFn` can be passed directly to {@link form} or to the {@link schema} function to create a
 * cached {@link Schema}.
 *
 * ```typescript
 * const userFormSchema: SchemaFn<User> = (p) => {
 *   required(p.name);
 *   disabled(p.email, ({valueOf}) => valueOf(p.name) === '');
 * };
 *
 * const f = form(userModel, userFormSchema, {injector});
 * ```
 *
 * @template TModel Data type.
 * @template TPathKind The kind of path this schema function can be bound to.
 *
 * @category types
 * @experimental 21.0.0
 */
type SchemaFn<TModel, TPathKind extends PathKind = PathKind.Root> = (p: SchemaPathTree<TModel, TPathKind>) => void;
/**
 * A {@link Schema} or {@link SchemaFn}.
 *
 * @template TModel The type of data stored in the form that this schema function is attached to.
 * @template TPathKind The kind of path this schema function can be bound to.
 *
 * @category types
 * @experimental 21.0.0
 */
type SchemaOrSchemaFn<TModel, TPathKind extends PathKind = PathKind.Root> = Schema<TModel> | SchemaFn<TModel, TPathKind>;
/**
 * A function that receives the `FieldContext` for the field the logic is bound to and returns
 * a specific result type.
 *
 * @template TValue The data type for the field the logic is bound to.
 * @template TReturn The type of the result returned by the logic function.
 * @template TPathKind The kind of path the logic is applied to (root field, child field, or item of an array)
 *
 * @category types
 * @experimental 21.0.0
 */
type LogicFn<TValue, TReturn, TPathKind extends PathKind = PathKind.Root> = (ctx: FieldContext<TValue, TPathKind>) => TReturn;
/**
 * A function that takes the `FieldContext` for the field being validated and returns a
 * `ValidationResult` indicating errors for the field.
 *
 * @template TValue The type of value stored in the field being validated
 * @template TPathKind The kind of path being validated (root field, child field, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
type FieldValidator<TValue, TPathKind extends PathKind = PathKind.Root> = LogicFn<TValue, ValidationResult<ValidationError.WithoutFieldTree>, TPathKind>;
/**
 * A function that takes the `FieldContext` for the field being validated and returns a
 * `TreeValidationResult` indicating errors for the field and its sub-fields.
 *
 * @template TValue The type of value stored in the field being validated
 * @template TPathKind The kind of path being validated (root field, child field, or item of an array)
 *
 * @category types
 * @experimental 21.0.0
 */
type TreeValidator<TValue, TPathKind extends PathKind = PathKind.Root> = LogicFn<TValue, TreeValidationResult, TPathKind>;
/**
 * A function that takes the `FieldContext` for the field being validated and returns a
 * `ValidationResult` indicating errors for the field and its sub-fields. In a `Validator` all
 * errors must explicitly define their target field.
 *
 * @template TValue The type of value stored in the field being validated
 * @template TPathKind The kind of path being validated (root field, child field, or item of an array)
 * @see [Signal Form Validation](/guide/forms/signals/validation)
 * @category types
 * @experimental 21.0.0
 */
type Validator<TValue, TPathKind extends PathKind = PathKind.Root> = LogicFn<TValue, ValidationResult, TPathKind>;
/**
 * Provides access to the state of the current field as well as functions that can be used to look
 * up state of other fields based on a `FieldPath`.
 *
 * @category types
 * @experimental 21.0.0
 */
type FieldContext<TValue, TPathKind extends PathKind = PathKind.Root> = TPathKind extends PathKind.Item ? ItemFieldContext<TValue> : TPathKind extends PathKind.Child ? ChildFieldContext<TValue> : RootFieldContext<TValue>;
/**
 * The base field context that is available for all fields.
 *
 * @experimental 21.0.0
 */
interface RootFieldContext<TValue> {
    /** A signal containing the value of the current field. */
    readonly value: Signal<TValue>;
    /** The state of the current field. */
    readonly state: FieldState<TValue>;
    /** The current field. */
    readonly fieldTree: FieldTree<TValue>;
    /** Gets the value of the field represented by the given path. */
    valueOf<PValue>(p: SchemaPath<PValue, SchemaPathRules>): PValue;
    /** Gets the state of the field represented by the given path. */
    stateOf<PControl extends AbstractControl>(p: CompatSchemaPath<PControl>): CompatFieldState<PControl>;
    stateOf<PValue>(p: SchemaPath<PValue, SchemaPathRules>): FieldState<PValue>;
    /** Gets the field represented by the given path. */
    fieldTreeOf<PModel>(p: SchemaPathTree<PModel>): FieldTree<PModel>;
    /** The list of keys that lead from the root field to the current field. */
    readonly pathKeys: Signal<readonly string[]>;
}
/**
 * Field context that is available for all fields that are a child of another field.
 *
 * @category structure
 * @experimental 21.0.0
 */
interface ChildFieldContext<TValue> extends RootFieldContext<TValue> {
    /** The key of the current field in its parent field. */
    readonly key: Signal<string>;
}
/**
 * Field context that is available for all fields that are an item in an array field.
 *
 * @experimental 21.0.0
 */
interface ItemFieldContext<TValue> extends ChildFieldContext<TValue> {
    /** The index of the current field in its parent field. */
    readonly index: Signal<number>;
}
/**
 * Gets the item type of an object that is possibly an array.
 *
 * @experimental 21.0.0
 */
type ItemType<T extends Object> = T extends ReadonlyArray<any> ? T[number] : T[keyof T];
/**
 * A function that defines custom debounce logic for a field.
 *
 * @param context The field context.
 * @param abortSignal An `AbortSignal` used to communicate that the debounced operation was aborted.
 * @returns A `Promise<void>` to debounce an update, or `void` to apply an update immediately.
 * @template TValue The type of value stored in the field.
 * @template TPathKind The kind of path the debouncer is applied to (root field, child field, or item of an array).
 *
 * @experimental 21.0.0
 */
type Debouncer<TValue, TPathKind extends PathKind = PathKind.Root> = (context: FieldContext<TValue, TPathKind>, abortSignal: AbortSignal) => Promise<void> | void;

/**
 * Sets a value for the {@link MetadataKey} for this field.
 *
 * This value is combined via a reduce operation defined by the particular key,
 * since multiple rules in the schema might set values for it.
 *
 * @param path The target path to set the metadata for.
 * @param key The metadata key
 * @param logic A function that receives the `FieldContext` and returns a value for the metadata.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TKey The type of metadata key.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function metadata<TValue, TKey extends MetadataKey<any, any, any>, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, key: TKey, logic: NoInfer<LogicFn<TValue, MetadataSetterType<TKey>, TPathKind>>): TKey;
/**
 * A reducer that determines the accumulated value for a metadata key by reducing the individual
 * values contributed from `metadata()` rules.
 *
 * @template TAcc The accumulated type of the reduce operation.
 * @template TItem The type of the individual items that are reduced over.
 * @experimental 21.0.2
 */
interface MetadataReducer<TAcc, TItem> {
    /** The reduce function. */
    reduce: (acc: TAcc, item: TItem) => TAcc;
    /** Gets the initial accumulated value. */
    getInitial: () => TAcc;
}
declare const MetadataReducer: {
    /** Creates a reducer that accumulates a list of its individual item values. */
    readonly list: <TItem>() => MetadataReducer<TItem[], TItem | undefined>;
    /** Creates a reducer that accumulates the min of its individual item values. */
    readonly min: () => MetadataReducer<number | undefined, number | undefined>;
    /** Creates a reducer that accumulates a the max of its individual item values. */
    readonly max: () => MetadataReducer<number | undefined, number | undefined>;
    /** Creates a reducer that logically or's its accumulated value with each individual item value. */
    readonly or: () => MetadataReducer<boolean, boolean>;
    /** Creates a reducer that logically and's its accumulated value with each individual item value. */
    readonly and: () => MetadataReducer<boolean, boolean>;
    /** Creates a reducer that always takes the next individual item value as the accumulated value. */
    readonly override: typeof override;
};
declare function override<T>(): MetadataReducer<T | undefined, T>;
declare function override<T>(getInitial: () => T): MetadataReducer<T, T>;
/**
 * Represents metadata that is aggregated from multiple parts according to the key's reducer
 * function. A value can be contributed to the aggregated value for a field using an
 * `metadata` rule in the schema. There may be multiple rules in a schema that contribute
 * values to the same `MetadataKey` of the same field.
 *
 * @template TRead The type read from the `FieldState` for this key
 * @template TWrite The type written to this key using the `metadata()` rule
 * @template TAcc The type of the reducer's accumulated value.
 *
 * @experimental 21.0.0
 */
declare class MetadataKey<TRead, TWrite, TAcc> {
    readonly reducer: MetadataReducer<TAcc, TWrite>;
    readonly create: ((s: Signal<TAcc>) => TRead) | undefined;
    private brand;
    /** Use {@link reducedMetadataKey}. */
    protected constructor(reducer: MetadataReducer<TAcc, TWrite>, create: ((s: Signal<TAcc>) => TRead) | undefined);
}
/**
 * Extracts the the type that can be set into the given metadata key type using the `metadata()` rule.
 *
 * @template TKey The `MetadataKey` type
 *
 * @experimental 21.0.0
 */
type MetadataSetterType<TKey> = TKey extends MetadataKey<any, infer TWrite, any> ? TWrite : never;
/**
 * Creates a metadata key used to contain a computed value.
 * The last value set on a given field tree node overrides any previously set values.
 *
 * @template TWrite The type written to this key using the `metadata()` rule
 *
 * @experimental 21.0.0
 */
declare function createMetadataKey<TWrite>(): MetadataKey<Signal<TWrite | undefined>, TWrite, TWrite | undefined>;
/**
 * Creates a metadata key used to contain a computed value.
 *
 * @param reducer The reducer used to combine individually set values into the final computed value.
 * @template TWrite The type written to this key using the `metadata()` rule
 * @template TAcc The type of the reducer's accumulated value.
 *
 * @experimental 21.0.0
 */
declare function createMetadataKey<TWrite, TAcc>(reducer: MetadataReducer<TAcc, TWrite>): MetadataKey<Signal<TAcc>, TWrite, TAcc>;
/**
 * Creates a metadata key that exposes a managed value based on the accumulated result of the values
 * written to the key. The accumulated value takes the last value set on a given field tree node,
 * overriding any previously set values.
 *
 * @param create A function that receives a signal of the accumulated value and returns the managed
 *   value based on it. This function runs during the construction of the `FieldTree` node,
 *   and runs in the injection context of that node.
 * @template TRead The type read from the `FieldState` for this key
 * @template TWrite The type written to this key using the `metadata()` rule
 *
 * @experimental 21.0.0
 */
declare function createManagedMetadataKey<TRead, TWrite>(create: (s: Signal<TWrite | undefined>) => TRead): MetadataKey<TRead, TWrite, TWrite | undefined>;
/**
 * Creates a metadata key that exposes a managed value based on the accumulated result of the values
 * written to the key.
 *
 * @param create A function that receives a signal of the accumulated value and returns the managed
 *   value based on it. This function runs during the construction of the `FieldTree` node,
 *   and runs in the injection context of that node.
 * @param reducer The reducer used to combine individual value written to the key,
 *   this will determine the accumulated value that the create function receives.
 * @template TRead The type read from the `FieldState` for this key
 * @template TWrite The type written to this key using the `metadata()` rule
 * @template TAcc The type of the reducer's accumulated value.
 *
 * @experimental 21.0.0
 */
declare function createManagedMetadataKey<TRead, TWrite, TAcc>(create: (s: Signal<TAcc>) => TRead, reducer: MetadataReducer<TAcc, TWrite>): MetadataKey<TRead, TWrite, TAcc>;
/**
 * A {@link MetadataKey} representing whether the field is required.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const REQUIRED: MetadataKey<Signal<boolean>, boolean, boolean>;
/**
 * A {@link MetadataKey} representing the min value of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MIN: MetadataKey<Signal<number | undefined>, number | undefined, number | undefined>;
/**
 * A {@link MetadataKey} representing the max value of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MAX: MetadataKey<Signal<number | undefined>, number | undefined, number | undefined>;
/**
 * A {@link MetadataKey} representing the min length of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MIN_LENGTH: MetadataKey<Signal<number | undefined>, number | undefined, number | undefined>;
/**
 * A {@link MetadataKey} representing the max length of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MAX_LENGTH: MetadataKey<Signal<number | undefined>, number | undefined, number | undefined>;
/**
 * A {@link MetadataKey} representing the patterns the field must match.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const PATTERN: MetadataKey<Signal<RegExp[]>, RegExp | undefined, RegExp[]>;

/**
 * Utility type that removes a string index key when its value is `unknown`,
 * i.e. `{[key: string]: unknown}`. It allows specific string keys to pass through, even if their
 * value is `unknown`, e.g. `{key: unknown}`.
 *
 * @experimental 21.0.0
 */
type RemoveStringIndexUnknownKey<K, V> = string extends K ? unknown extends V ? never : K : K;
/**
 * Utility type that recursively ignores unknown string index properties on the given object.
 * We use this on the `TSchema` type in `validateStandardSchema` in order to accommodate Zod's
 * `looseObject` which includes `{[key: string]: unknown}` as part of the type.
 *
 * @experimental 21.0.0
 */
type IgnoreUnknownProperties<T> = T extends Record<PropertyKey, unknown> ? {
    [K in keyof T as RemoveStringIndexUnknownKey<K, T[K]>]: IgnoreUnknownProperties<T[K]>;
} : T;
/**
 * Validates a field using a `StandardSchemaV1` compatible validator (e.g. a Zod validator).
 *
 * See https://github.com/standard-schema/standard-schema for more about standard schema.
 *
 * @param path The `FieldPath` to the field to validate.
 * @param schema The standard schema compatible validator to use for validation, or a LogicFn that returns the schema.
 * @template TSchema The type validated by the schema. This may be either the full `TValue` type,
 *   or a partial of it.
 * @template TValue The type of value stored in the field being validated.
 *
 * @see [Signal Form Schema Validation](guide/forms/signals/validation#integration-with-schema-validation-libraries)
 * @category validation
 * @experimental 21.0.0
 */
declare function validateStandardSchema<TSchema, TModel extends IgnoreUnknownProperties<TSchema>>(path: SchemaPath<TModel> & SchemaPathTree<TModel>, schema: StandardSchemaV1<TSchema> | LogicFn<TModel, StandardSchemaV1<unknown> | undefined>): void;
/**
 * Create a standard schema issue error associated with the target field
 * @param issue The standard schema issue
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function standardSchemaError(issue: StandardSchemaV1.Issue, options: WithFieldTree<ValidationErrorOptions>): StandardSchemaValidationError;
/**
 * Create a standard schema issue error
 * @param issue The standard schema issue
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function standardSchemaError(issue: StandardSchemaV1.Issue, options?: ValidationErrorOptions): WithoutFieldTree<StandardSchemaValidationError>;
/**
 * An error used to indicate an issue validating against a standard schema.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class StandardSchemaValidationError extends BaseNgValidationError {
    readonly issue: StandardSchemaV1.Issue;
    readonly kind = "standardSchema";
    constructor(issue: StandardSchemaV1.Issue, options?: ValidationErrorOptions);
}

/**
 * Represents a combination of `NgControl` and `AbstractControl`.
 *
 * Note: We have this separate interface, rather than implementing the relevant parts of the two
 * controls with something like `InteropNgControl implements Pick<NgControl, ...>, Pick<AbstractControl, ...>`
 * because it confuses the internal JS minifier which can cause collisions in field names.
 */
interface CombinedControl {
    value: any;
    valid: boolean;
    invalid: boolean;
    touched: boolean;
    untouched: boolean;
    disabled: boolean;
    enabled: boolean;
    errors: ValidationErrors | null;
    pristine: boolean;
    dirty: boolean;
    status: FormControlStatus;
    control: AbstractControl<any, any>;
    valueAccessor: ControlValueAccessor | null;
    hasValidator(validator: ValidatorFn): boolean;
    updateValueAndValidity(): void;
}
/**
 * A fake version of `NgControl` provided by the `Field` directive. This allows interoperability
 * with a wider range of components designed to work with reactive forms, in particular ones that
 * inject the `NgControl`. The interop control does not implement *all* properties and methods of
 * the real `NgControl`, but does implement some of the most commonly used ones that have a clear
 * equivalent in signal forms.
 */
declare class InteropNgControl implements CombinedControl {
    protected field: () => FieldState<unknown>;
    constructor(field: () => FieldState<unknown>);
    readonly control: AbstractControl<any, any>;
    get value(): any;
    get valid(): boolean;
    get invalid(): boolean;
    get pending(): boolean | null;
    get disabled(): boolean;
    get enabled(): boolean;
    get errors(): ValidationErrors | null;
    get pristine(): boolean;
    get dirty(): boolean;
    get touched(): boolean;
    get untouched(): boolean;
    get status(): FormControlStatus;
    valueAccessor: ControlValueAccessor | null;
    hasValidator(validator: ValidatorFn): boolean;
    updateValueAndValidity(): void;
}

declare const ɵNgFieldDirective: unique symbol;
interface FormFieldBindingOptions {
    /**
     * Focuses the binding.
     *
     * If not specified, Signal Forms will attempt to focus the host element of the `FormField` when
     * asked to focus this binding.
     */
    readonly focus?: (focusOptions?: FocusOptions) => void;
}
/**
 * Lightweight DI token provided by the {@link FormField} directive.
 *
 * @category control
 * @experimental 21.0.0
 */
declare const FORM_FIELD: InjectionToken<FormField<unknown>>;
/**
 * Binds a form `FieldTree` to a UI control that edits it. A UI control can be one of several things:
 * 1. A native HTML input or textarea
 * 2. A signal forms custom control that implements `FormValueControl` or `FormCheckboxControl`
 * 3. A component that provides a `ControlValueAccessor`. This should only be used for backwards
 *    compatibility with reactive forms. Prefer options (1) and (2).
 *
 * This directive has several responsibilities:
 * 1. Two-way binds the field state's value with the UI control's value
 * 2. Binds additional forms related state on the field state to the UI control (disabled, required, etc.)
 * 3. Relays relevant events on the control to the field state (e.g. marks touched on blur)
 * 4. Provides a fake `NgControl` that implements a subset of the features available on the
 *    reactive forms `NgControl`. This is provided to improve interoperability with controls
 *    designed to work with reactive forms. It should not be used by controls written for signal
 *    forms.
 *
 * @category control
 * @experimental 21.0.0
 */
declare class FormField<T> {
    readonly field: i0.InputSignal<Field<T>>;
    /**
     * `FieldState` for the currently bound field.
     */
    readonly state: Signal<FieldState<T, string | number>>;
    /**
     * The node injector for the element this field binding.
     */
    readonly injector: Injector;
    /**
     * The DOM element hosting this field binding.
     */
    readonly element: HTMLElement;
    private readonly elementIsNativeFormElement;
    private readonly elementAcceptsNumericValues;
    private readonly elementAcceptsTextualValues;
    /**
     * Current focus implementation, set by `registerAsBinding`.
     */
    private focuser;
    /** Any `ControlValueAccessor` instances provided on the host element. */
    private readonly controlValueAccessors;
    private readonly config;
    private readonly parseErrorsSource;
    /** A lazily instantiated fake `NgControl`. */
    private _interopNgControl;
    /** Lazily instantiates a fake `NgControl` for this form field. */
    protected get interopNgControl(): InteropNgControl;
    /** Errors associated with this form field. */
    readonly errors: Signal<ValidationError.WithFieldTree[]>;
    /** Whether this `FormField` has been registered as a binding on its associated `FieldState`. */
    private isFieldBinding;
    /**
     * Creates an `afterRenderEffect` that applies the configured class bindings to the host element
     * if needed.
     */
    private installClassBindingEffect;
    /**
     * Focuses this field binding.
     *
     * By default, this will focus the host DOM element. However, custom `FormUiControl`s can
     * implement custom focusing behavior.
     */
    focus(options?: FocusOptions): void;
    /**
     * Registers this `FormField` as a binding on its associated `FieldState`.
     *
     * This method should be called at most once for a given `FormField`. A `FormField` placed on a
     * custom control (`FormUiControl`) automatically registers that custom control as a binding.
     */
    registerAsBinding(bindingOptions?: FormFieldBindingOptions): void;
    /**
     * The presence of this symbol tells the template type-checker that this directive is a control
     * directive and should be type-checked as such. We don't use the `ɵngControlCreate` method below
     * as it's marked internal and removed from the public API. A symbol is used instead to avoid
     * polluting the public API with the marker.
     */
    readonly [ɵNgFieldDirective]: true;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormField<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormField<any>, "[formField]", ["formField"], { "field": { "alias": "formField"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * Options used to create a `ValidationError`.
 */
interface ValidationErrorOptions {
    /** Human readable error message. */
    message?: string;
}
/**
 * A type that requires the given type `T` to have a `field` property.
 * @template T The type to add a `field` to.
 *
 * @experimental 21.0.0
 */
type WithFieldTree<T> = T & {
    fieldTree: FieldTree<unknown>;
};
/** @deprecated Use `WithFieldTree` instead  */
type WithField<T> = WithFieldTree<T>;
/**
 * A type that allows the given type `T` to optionally have a `field` property.
 * @template T The type to optionally add a `field` to.
 *
 * @experimental 21.0.0
 */
type WithOptionalFieldTree<T> = Omit<T, 'fieldTree'> & {
    fieldTree?: FieldTree<unknown>;
};
/** @deprecated Use `WithOptionalFieldTree` instead  */
type WithOptionalField<T> = WithOptionalFieldTree<T>;
/**
 * A type that ensures the given type `T` does not have a `field` property.
 * @template T The type to remove the `field` from.
 *
 * @experimental 21.0.0
 */
type WithoutFieldTree<T> = T & {
    fieldTree: never;
};
/** @deprecated Use `WithoutFieldTree` instead  */
type WithoutField<T> = WithoutFieldTree<T>;
/**
 * Create a required error associated with the target field
 * @param options The validation error options
 *
 * @experimental 21.0.0
 */
declare function requiredError(options: WithFieldTree<ValidationErrorOptions>): RequiredValidationError;
/**
 * Create a required error
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function requiredError(options?: ValidationErrorOptions): WithoutFieldTree<RequiredValidationError>;
/**
 * Create a min value error associated with the target field
 * @param min The min value constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minError(min: number, options: WithFieldTree<ValidationErrorOptions>): MinValidationError;
/**
 * Create a min value error
 * @param min The min value constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minError(min: number, options?: ValidationErrorOptions): WithoutFieldTree<MinValidationError>;
/**
 * Create a max value error associated with the target field
 * @param max The max value constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxError(max: number, options: WithFieldTree<ValidationErrorOptions>): MaxValidationError;
/**
 * Create a max value error
 * @param max The max value constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxError(max: number, options?: ValidationErrorOptions): WithoutFieldTree<MaxValidationError>;
/**
 * Create a minLength error associated with the target field
 * @param minLength The minLength constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minLengthError(minLength: number, options: WithFieldTree<ValidationErrorOptions>): MinLengthValidationError;
/**
 * Create a minLength error
 * @param minLength The minLength constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minLengthError(minLength: number, options?: ValidationErrorOptions): WithoutFieldTree<MinLengthValidationError>;
/**
 * Create a maxLength error associated with the target field
 * @param maxLength The maxLength constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxLengthError(maxLength: number, options: WithFieldTree<ValidationErrorOptions>): MaxLengthValidationError;
/**
 * Create a maxLength error
 * @param maxLength The maxLength constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxLengthError(maxLength: number, options?: ValidationErrorOptions): WithoutFieldTree<MaxLengthValidationError>;
/**
 * Create a pattern matching error associated with the target field
 * @param pattern The violated pattern
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function patternError(pattern: RegExp, options: WithFieldTree<ValidationErrorOptions>): PatternValidationError;
/**
 * Create a pattern matching error
 * @param pattern The violated pattern
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function patternError(pattern: RegExp, options?: ValidationErrorOptions): WithoutFieldTree<PatternValidationError>;
/**
 * Create an email format error associated with the target field
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function emailError(options: WithFieldTree<ValidationErrorOptions>): EmailValidationError;
/**
 * Create an email format error
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function emailError(options?: ValidationErrorOptions): WithoutFieldTree<EmailValidationError>;
/**
 * Common interface for all validation errors.
 *
 * This can be returned from validators.
 *
 * It's also used by the creation functions to create an instance
 * (e.g. `requiredError`, `minError`, etc.).
 *
 * @see [Signal Form Validation](guide/forms/signals/validation)
 * @see [Signal Form Validation Errors](guide/forms/signals/validation#validation-errors)
 * @category validation
 * @experimental 21.0.0
 */
interface ValidationError {
    /** Identifies the kind of error. */
    readonly kind: string;
    /** Human readable error message. */
    readonly message?: string;
}
declare namespace ValidationError {
    /**
     * Validation error with an associated field tree.
     *
     * This is returned from field state, e.g., catField.errors() would be of a list of errors with
     * `field: catField` bound to state.
     */
    interface WithFieldTree extends ValidationError {
        /** The field associated with this error. */
        readonly fieldTree: FieldTree<unknown>;
        readonly formField?: FormField<unknown>;
    }
    /** @deprecated Use `ValidationError.WithFieldTree` instead  */
    type WithField = WithFieldTree;
    /**
     * Validation error with an associated field tree and specific form field binding.
     */
    interface WithFormField extends WithFieldTree {
        readonly formField: FormField<unknown>;
    }
    /**
     * Validation error with optional field.
     *
     * This is generally used in places where the result might have a field.
     * e.g., as a result of a `validateTree`, or when handling form submission.
     */
    interface WithOptionalFieldTree extends ValidationError {
        /** The field associated with this error. */
        readonly fieldTree?: FieldTree<unknown>;
    }
    /** @deprecated Use `ValidationError.WithOptionalFieldTree` instead  */
    type WithOptionalField = WithOptionalFieldTree;
    /**
     * Validation error with no field.
     *
     * This is used to strongly enforce that fields are not allowed in validation result.
     */
    interface WithoutFieldTree extends ValidationError {
        /** The field associated with this error. */
        readonly fieldTree?: never;
        readonly formField?: never;
    }
    /** @deprecated Use `ValidationError.WithoutFieldTree` instead  */
    type WithoutField = WithoutFieldTree;
}
/**
 * Internal version of `NgValidationError`, we create this separately so we can change its type on
 * the exported version to a type union of the possible sub-classes.
 *
 * @experimental 21.0.0
 */
declare abstract class BaseNgValidationError implements ValidationError {
    /** Brand the class to avoid Typescript structural matching */
    private __brand;
    /** Identifies the kind of error. */
    readonly kind: string;
    /** The field associated with this error. */
    readonly fieldTree: FieldTree<unknown>;
    /** Human readable error message. */
    readonly message?: string;
    constructor(options?: ValidationErrorOptions);
}
/**
 * An error used to indicate that a required field is empty.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class RequiredValidationError extends BaseNgValidationError {
    readonly kind = "required";
}
/**
 * An error used to indicate that a value is lower than the minimum allowed.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class MinValidationError extends BaseNgValidationError {
    readonly min: number;
    readonly kind = "min";
    constructor(min: number, options?: ValidationErrorOptions);
}
/**
 * An error used to indicate that a value is higher than the maximum allowed.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class MaxValidationError extends BaseNgValidationError {
    readonly max: number;
    readonly kind = "max";
    constructor(max: number, options?: ValidationErrorOptions);
}
/**
 * An error used to indicate that a value is shorter than the minimum allowed length.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class MinLengthValidationError extends BaseNgValidationError {
    readonly minLength: number;
    readonly kind = "minLength";
    constructor(minLength: number, options?: ValidationErrorOptions);
}
/**
 * An error used to indicate that a value is longer than the maximum allowed length.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class MaxLengthValidationError extends BaseNgValidationError {
    readonly maxLength: number;
    readonly kind = "maxLength";
    constructor(maxLength: number, options?: ValidationErrorOptions);
}
/**
 * An error used to indicate that a value does not match the required pattern.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class PatternValidationError extends BaseNgValidationError {
    readonly pattern: RegExp;
    readonly kind = "pattern";
    constructor(pattern: RegExp, options?: ValidationErrorOptions);
}
/**
 * An error used to indicate that a value is not a valid email.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class EmailValidationError extends BaseNgValidationError {
    readonly kind = "email";
}
/**
 * An error used to indicate that a value entered in a native input does not parse.
 *
 * @category validation
 * @experimental 21.2.0
 */
declare class NativeInputParseError extends BaseNgValidationError {
    readonly kind = "parse";
}
/**
 * The base class for all built-in, non-custom errors. This class can be used to check if an error
 * is one of the standard kinds, allowing you to switch on the kind to further narrow the type.
 *
 * @example
 * ```ts
 * const f = form(...);
 * for (const e of form().errors()) {
 *   if (e instanceof NgValidationError) {
 *     switch(e.kind) {
 *       case 'required':
 *         console.log('This is required!');
 *         break;
 *       case 'min':
 *         console.log(`Must be at least ${e.min}`);
 *         break;
 *       ...
 *     }
 *   }
 * }
 * ```
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const NgValidationError: abstract new () => NgValidationError;
type NgValidationError = RequiredValidationError | MinValidationError | MaxValidationError | MinLengthValidationError | MaxLengthValidationError | PatternValidationError | EmailValidationError | StandardSchemaValidationError | NativeInputParseError;

/**
 * Configuration options for signal forms.
 *
 * @experimental 21.0.1
 */
interface SignalFormsConfig {
    /** A map of CSS class names to predicate functions that determine when to apply them. */
    classes?: {
        [className: string]: (state: FormField<unknown>) => boolean;
    };
}
/**
 * Provides configuration options for signal forms.
 *
 * @experimental 21.0.1
 */
declare function provideSignalFormsConfig(config: SignalFormsConfig): Provider[];

/**
 * Options that may be specified when creating a form.
 *
 * @category structure
 * @experimental 21.0.0
 */
interface FormOptions<TModel> {
    /**
     * The injector to use for dependency injection. If this is not provided, the injector for the
     * current [injection context](guide/di/dependency-injection-context), will be used.
     */
    injector?: Injector;
    /** The name of the root form, used in generating name attributes for the fields. */
    name?: string;
    /** Options that define how to handle form submission. */
    submission?: FormSubmitOptions<TModel, unknown>;
}
/**
 * Creates a form wrapped around the given model data. A form is represented as simply a `FieldTree`
 * of the model data.
 *
 * `form` uses the given model as the source of truth and *does not* maintain its own copy of the
 * data. This means that updating the value on a `FieldState` updates the originally passed in model
 * as well.
 *
 * @example
 * ```ts
 * const nameModel = signal({first: '', last: ''});
 * const nameForm = form(nameModel);
 * nameForm.first().value.set('John');
 * nameForm().value(); // {first: 'John', last: ''}
 * nameModel(); // {first: 'John', last: ''}
 * ```
 *
 * @param model A writable signal that contains the model data for the form. The resulting field
 * structure will match the shape of the model and any changes to the form data will be written to
 * the model.
 * @return A `FieldTree` representing a form around the data model.
 * @template TModel The type of the data model.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function form<TModel>(model: WritableSignal<TModel>): FieldTree<TModel>;
/**
 * Creates a form wrapped around the given model data. A form is represented as simply a `FieldTree`
 * of the model data.
 *
 * `form` uses the given model as the source of truth and *does not* maintain its own copy of the
 * data. This means that updating the value on a `FieldState` updates the originally passed in model
 * as well.
 *
 * @example
 * ```ts
 * const nameModel = signal({first: '', last: ''});
 * const nameForm = form(nameModel);
 * nameForm.first().value.set('John');
 * nameForm().value(); // {first: 'John', last: ''}
 * nameModel(); // {first: 'John', last: ''}
 * ```
 *
 * The form can also be created with a schema, which is a set of rules that define the logic for the
 * form. The schema can be either a pre-defined schema created with the `schema` function, or a
 * function that builds the schema by binding logic to a parts of the field structure.
 *
 * @example
 * ```ts
 * const nameForm = form(signal({first: '', last: ''}), (name) => {
 *   required(name.first);
 *   pattern(name.last, /^[a-z]+$/i, {message: 'Alphabet characters only'});
 * });
 * nameForm().valid(); // false
 * nameForm().value.set({first: 'John', last: 'Doe'});
 * nameForm().valid(); // true
 * ```
 *
 * @param model A writable signal that contains the model data for the form. The resulting field
 * structure will match the shape of the model and any changes to the form data will be written to
 * the model.
 * @param schemaOrOptions The second argument can be either
 *   1. A schema or a function used to specify logic for the form (e.g. validation, disabled fields, etc.).
 *      When passing a schema, the form options can be passed as a third argument if needed.
 *   2. The form options
 * @return A `FieldTree` representing a form around the data model
 * @template TValue The type of the data model.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function form<TModel>(model: WritableSignal<TModel>, schemaOrOptions: SchemaOrSchemaFn<TModel> | FormOptions<TModel>): FieldTree<TModel>;
/**
 * Creates a form wrapped around the given model data. A form is represented as simply a `FieldTree`
 * of the model data.
 *
 * `form` uses the given model as the source of truth and *does not* maintain its own copy of the
 * data. This means that updating the value on a `FieldState` updates the originally passed in model
 * as well.
 *
 * @example
 * ```ts
 * const nameModel = signal({first: '', last: ''});
 * const nameForm = form(nameModel);
 * nameForm.first().value.set('John');
 * nameForm().value(); // {first: 'John', last: ''}
 * nameModel(); // {first: 'John', last: ''}
 * ```
 *
 * The form can also be created with a schema, which is a set of rules that define the logic for the
 * form. The schema can be either a pre-defined schema created with the `schema` function, or a
 * function that builds the schema by binding logic to a parts of the field structure.
 *
 * @example
 * ```ts
 * const nameForm = form(signal({first: '', last: ''}), (name) => {
 *   required(name.first);
 *   validate(name.last, ({value}) => !/^[a-z]+$/i.test(value()) ? {kind: 'alphabet-only'} : undefined);
 * });
 * nameForm().valid(); // false
 * nameForm().value.set({first: 'John', last: 'Doe'});
 * nameForm().valid(); // true
 * ```
 *
 * @param model A writable signal that contains the model data for the form. The resulting field
 * structure will match the shape of the model and any changes to the form data will be written to
 * the model.
 * @param schema A schema or a function used to specify logic for the form (e.g. validation, disabled fields, etc.)
 * @param options The form options
 * @return A `FieldTree` representing a form around the data model.
 * @template TModel The type of the data model.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function form<TModel>(model: WritableSignal<TModel>, schema: SchemaOrSchemaFn<TModel>, options: FormOptions<TModel>): FieldTree<TModel>;
/**
 * Applies a schema to each item of an array.
 *
 * @example
 * ```ts
 * const nameSchema = schema<{first: string, last: string}>((name) => {
 *   required(name.first);
 *   required(name.last);
 * });
 * const namesForm = form(signal([{first: '', last: ''}]), (names) => {
 *   applyEach(names, nameSchema);
 * });
 * ```
 *
 * @param path The target path for an array field whose items the schema will be applied to.
 * @param schema A schema for an element of the array, or function that binds logic to an
 * element of the array.
 * @template TValue The data type of the item field to apply the schema to.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function applyEach<TValue extends ReadonlyArray<any>>(path: SchemaPath<TValue>, schema: NoInfer<SchemaOrSchemaFn<TValue[number], PathKind.Item>>): void;
declare function applyEach<TValue extends Object>(path: SchemaPath<TValue>, schema: NoInfer<SchemaOrSchemaFn<ItemType<TValue>, PathKind.Child>>): void;
/**
 * Applies a predefined schema to a given `FieldPath`.
 *
 * @example
 * ```ts
 * const nameSchema = schema<{first: string, last: string}>((name) => {
 *   required(name.first);
 *   required(name.last);
 * });
 * const profileForm = form(signal({name: {first: '', last: ''}, age: 0}), (profile) => {
 *   apply(profile.name, nameSchema);
 * });
 * ```
 *
 * @param path The target path to apply the schema to.
 * @param schema The schema to apply to the property
 * @template TValue The data type of the field to apply the schema to.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function apply<TValue>(path: SchemaPath<TValue>, schema: NoInfer<SchemaOrSchemaFn<TValue>>): void;
/**
 * Conditionally applies a predefined schema to a given `FieldPath`.
 *
 * @param path The target path to apply the schema to.
 * @param logic A `LogicFn<T, boolean>` that returns `true` when the schema should be applied.
 * @param schema The schema to apply to the field when the `logic` function returns `true`.
 * @template TValue The data type of the field to apply the schema to.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function applyWhen<TValue>(path: SchemaPath<TValue>, logic: LogicFn<TValue, boolean>, schema: NoInfer<SchemaOrSchemaFn<TValue>>): void;
/**
 * Conditionally applies a predefined schema to a given `FieldPath`.
 *
 * @param path The target path to apply the schema to.
 * @param predicate A type guard that accepts a value `T` and returns `true` if `T` is of type
 *   `TNarrowed`.
 * @param schema The schema to apply to the field when `predicate` returns `true`.
 * @template TValue The data type of the field to apply the schema to.
 * @template TNarrowed The data type of the schema (a narrowed type of TValue).
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function applyWhenValue<TValue, TNarrowed extends TValue>(path: SchemaPath<TValue>, predicate: (value: TValue) => value is TNarrowed, schema: SchemaOrSchemaFn<TNarrowed>): void;
/**
 * Conditionally applies a predefined schema to a given `FieldPath`.
 *
 * @param path The target path to apply the schema to.
 * @param predicate A function that accepts a value `T` and returns `true` when the schema
 *   should be applied.
 * @param schema The schema to apply to the field when `predicate` returns `true`.
 * @template TValue The data type of the field to apply the schema to.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function applyWhenValue<TValue>(path: SchemaPath<TValue>, predicate: (value: TValue) => boolean, schema: NoInfer<SchemaOrSchemaFn<TValue>>): void;
/**
 * Submits a given `FieldTree` using the given action function and applies any submission errors
 * resulting from the action to the field. Submission errors returned by the `action` will be integrated
 * into the field as a `ValidationError` on the sub-field indicated by the `fieldTree` property of the
 * submission error.
 *
 * @example
 * ```ts
 * async function registerNewUser(registrationForm: FieldTree<{username: string, password: string}>) {
 *   const result = await myClient.registerNewUser(registrationForm().value());
 *   if (result.errorCode === myClient.ErrorCode.USERNAME_TAKEN) {
 *     return [{
 *       fieldTree: registrationForm.username,
 *       kind: 'server',
 *       message: 'Username already taken'
 *     }];
 *   }
 *   return undefined;
 * }
 *
 * const registrationForm = form(signal({username: 'god', password: ''}));
 * submit(registrationForm, {
 *   action: async (f) => {
 *     return registerNewUser(registrationForm);
 *   }
 * });
 * registrationForm.username().errors(); // [{kind: 'server', message: 'Username already taken'}]
 * ```
 *
 * @param form The field to submit.
 * @param options Options for the submission.
 * @returns Whether the submission was successful.
 * @template TModel The data type of the field being submitted.
 *
 * @category submission
 * @experimental 21.0.0
 */
declare function submit<TModel>(form: FieldTree<TModel>, options?: NoInfer<FormSubmitOptions<unknown, TModel>>): Promise<boolean>;
declare function submit<TModel>(form: FieldTree<TModel>, action: NoInfer<FormSubmitOptions<unknown, TModel>['action']>): Promise<boolean>;
/**
 * Creates a `Schema` that adds logic rules to a form.
 * @param fn A **non-reactive** function that sets up reactive logic rules for the form.
 * @returns A schema object that implements the given logic.
 * @template TValue The value type of a `FieldTree` that this schema binds to.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function schema<TValue>(fn: SchemaFn<TValue>): Schema<TValue>;

export { BaseNgValidationError, EmailValidationError, FORM_FIELD, FormField, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MaxLengthValidationError, MaxValidationError, MetadataKey, MetadataReducer, MinLengthValidationError, MinValidationError, NativeInputParseError, NgValidationError, PATTERN, PathKind, PatternValidationError, REQUIRED, RequiredValidationError, SchemaPathRules, StandardSchemaValidationError, ValidationError, apply, applyEach, applyWhen, applyWhenValue, createManagedMetadataKey, createMetadataKey, emailError, form, maxError, maxLengthError, metadata, minError, minLengthError, patternError, provideSignalFormsConfig, requiredError, schema, standardSchemaError, submit, validateStandardSchema, ɵNgFieldDirective };
export type { AsyncValidationResult, ChildFieldContext, CompatFieldState, CompatSchemaPath, Debouncer, DisabledReason, Field, FieldContext, FieldState, FieldTree, FieldValidator, FormFieldBindingOptions, FormOptions, FormSubmitOptions, IgnoreUnknownProperties, ItemFieldContext, ItemType, LogicFn, MaybeFieldTree, MaybeSchemaPathTree, MetadataSetterType, OneOrMany, ReadonlyArrayLike, RemoveStringIndexUnknownKey, RootFieldContext, Schema, SchemaFn, SchemaOrSchemaFn, SchemaPath, SchemaPathTree, SignalFormsConfig, Subfields, TreeValidationResult, TreeValidator, ValidationErrorOptions, ValidationResult, ValidationSuccess, Validator, WithField, WithFieldTree, WithOptionalField, WithOptionalFieldTree, WithoutField, WithoutFieldTree };
