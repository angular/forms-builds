/**
 * @license Angular v21.1.0-next.0+sha-86d05eb
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

import { HttpResourceRequest, HttpResourceOptions } from '@angular/common/http';
import * as i0 from '@angular/core';
import { InjectionToken, ɵControl as _Control, ɵCONTROL as _CONTROL, ɵFieldState as _FieldState, Signal, ResourceRef, InputSignal, ModelSignal, OutputRef, WritableSignal, DestroyableInjector, Injector } from '@angular/core';
import { NgControl, AbstractControl, ValidationErrors, FormControlStatus, ControlValueAccessor, ValidatorFn } from '@angular/forms';
import { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Properties of both NgControl & AbstractControl that are supported by the InteropNgControl.
 */
type InteropSharedKeys = 'value' | 'valid' | 'invalid' | 'touched' | 'untouched' | 'disabled' | 'enabled' | 'errors' | 'pristine' | 'dirty' | 'status';
/**
 * A fake version of `NgControl` provided by the `Field` directive. This allows interoperability
 * with a wider range of components designed to work with reactive forms, in particular ones that
 * inject the `NgControl`. The interop control does not implement *all* properties and methods of
 * the real `NgControl`, but does implement some of the most commonly used ones that have a clear
 * equivalent in signal forms.
 */
declare class InteropNgControl implements Pick<NgControl, InteropSharedKeys | 'control' | 'valueAccessor'>, Pick<AbstractControl<unknown>, InteropSharedKeys | 'hasValidator'> {
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

/**
 * Lightweight DI token provided by the {@link Field} directive.
 *
 * @category control
 * @experimental 21.0.0
 */
declare const FIELD: InjectionToken<Field<unknown>>;
/**
 * Binds a form `FieldTree` to a UI control that edits it. A UI control can be one of several things:
 * 1. A native HTML input or textarea
 * 2. A signal forms custom control that implements `FormValueControl` or `FormCheckboxControl`
 * 3. A component that provides a `ControlValueAccessor`. This should only be used for backwards
 *    compatibility with reactive forms. Prefer options (1) and (2).
 *
 * This directive has several responsibilities:
 * 1. Two-way binds the field's value with the UI control's value
 * 2. Binds additional forms related state on the field to the UI control (disabled, required, etc.)
 * 3. Relays relevant events on the control to the field (e.g. marks field touched on blur)
 * 4. Provides a fake `NgControl` that implements a subset of the features available on the
 *    reactive forms `NgControl`. This is provided to improve interoperability with controls
 *    designed to work with reactive forms. It should not be used by controls written for signal
 *    forms.
 *
 * @category control
 * @experimental 21.0.0
 */
declare class Field<T> implements _Control<T> {
    private readonly injector;
    readonly field: i0.InputSignal<FieldTree<T>>;
    readonly state: i0.Signal<FieldState<T, string | number>>;
    readonly [_CONTROL]: undefined;
    /** Any `ControlValueAccessor` instances provided on the host element. */
    private readonly controlValueAccessors;
    /** A lazily instantiated fake `NgControl`. */
    private interopNgControl;
    /** A `ControlValueAccessor`, if configured, for the host component. */
    private get controlValueAccessor();
    get ɵhasInteropControl(): boolean;
    /** Lazily instantiates a fake `NgControl` for this field. */
    ɵgetOrCreateNgControl(): InteropNgControl;
    ɵinteropControlCreate(): void;
    ɵinteropControlUpdate(): void;
    ɵregister(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Field<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<Field<any>, "[field]", never, { "field": { "alias": "field"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

/**
 * Represents metadata that may be defined on a field when it is created using a `metadata` rule
 * in the schema. A particular `MetadataKey` can only be defined on a particular field **once**.
 *
 * @category logic
 * @experimental 21.0.0
 */
declare class MetadataKey<TValue> {
    private brand;
    /** Use {@link createMetadataKey}. */
    private constructor();
}
/**
 * Creates a {@link MetadataKey}.
 *
 * @experimental 21.0.0
 */
declare function createMetadataKey<TValue>(): MetadataKey<TValue>;
/**
 * Represents metadata that is aggregated from multiple parts according to the key's reducer
 * function. A value can be contributed to the aggregated value for a field using an
 * `aggregateMetadata` rule in the schema. There may be multiple rules in a schema that contribute
 * values to the same `AggregateMetadataKey` of the same field.
 *
 * @experimental 21.0.0
 */
declare class AggregateMetadataKey<TAcc, TItem> {
    readonly reduce: (acc: TAcc, item: TItem) => TAcc;
    readonly getInitial: () => TAcc;
    private brand;
    /** Use {@link reducedMetadataKey}. */
    private constructor();
}
/**
 * Creates an {@link AggregateMetadataKey} that reduces its individual values into an accumulated
 * value using the given `reduce` and `getInitial` functions.
 * @param reduce The reducer function.
 * @param getInitial A function that gets the initial value for the reduce operation.
 *
 * @experimental 21.0.0
 */
declare function reducedMetadataKey<TAcc, TItem>(reduce: (acc: TAcc, item: TItem) => TAcc, getInitial: () => TAcc): AggregateMetadataKey<TAcc, TItem>;
/**
 * Creates an {@link AggregateMetadataKey} that reduces its individual values into a list.
 *
 * @experimental 21.0.0
 */
declare function listMetadataKey<TItem>(): AggregateMetadataKey<TItem[], TItem | undefined>;
/**
 * Creates {@link AggregateMetadataKey} that reduces its individual values by taking their min.
 *
 * @experimental 21.0.0
 */
declare function minMetadataKey(): AggregateMetadataKey<number | undefined, number | undefined>;
/**
 * Creates {@link AggregateMetadataKey} that reduces its individual values by taking their max.
 *
 * @experimental 21.0.0
 */
declare function maxMetadataKey(): AggregateMetadataKey<number | undefined, number | undefined>;
/**
 * Creates an {@link AggregateMetadataKey} that reduces its individual values by logically or-ing
 * them.
 *
 * @experimental 21.0.0
 */
declare function orMetadataKey(): AggregateMetadataKey<boolean, boolean>;
/**
 * Creates an {@link AggregateMetadataKey} that reduces its individual values by logically and-ing
 * them.
 *
 * @experimental 21.0.0
 */
declare function andMetadataKey(): AggregateMetadataKey<boolean, boolean>;
/**
 * An {@link AggregateMetadataKey} representing whether the field is required.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const REQUIRED: AggregateMetadataKey<boolean, boolean>;
/**
 * An {@link AggregateMetadataKey} representing the min value of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MIN: AggregateMetadataKey<number | undefined, number | undefined>;
/**
 * An {@link AggregateMetadataKey} representing the max value of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MAX: AggregateMetadataKey<number | undefined, number | undefined>;
/**
 * An {@link AggregateMetadataKey} representing the min length of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MIN_LENGTH: AggregateMetadataKey<number | undefined, number | undefined>;
/**
 * An {@link AggregateMetadataKey} representing the max length of the field.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const MAX_LENGTH: AggregateMetadataKey<number | undefined, number | undefined>;
/**
 * An {@link AggregateMetadataKey} representing the patterns the field must match.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare const PATTERN: AggregateMetadataKey<RegExp[], RegExp | undefined>;

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
type WithField<T> = T & {
    field: FieldTree<unknown>;
};
/**
 * A type that allows the given type `T` to optionally have a `field` property.
 * @template T The type to optionally add a `field` to.
 *
 * @experimental 21.0.0
 */
type WithOptionalField<T> = Omit<T, 'field'> & {
    field?: FieldTree<unknown>;
};
/**
 * A type that ensures the given type `T` does not have a `field` property.
 * @template T The type to remove the `field` from.
 *
 * @experimental 21.0.0
 */
type WithoutField<T> = T & {
    field: never;
};
/**
 * Create a required error associated with the target field
 * @param options The validation error options
 *
 * @experimental 21.0.0
 */
declare function requiredError(options: WithField<ValidationErrorOptions>): RequiredValidationError;
/**
 * Create a required error
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function requiredError(options?: ValidationErrorOptions): WithoutField<RequiredValidationError>;
/**
 * Create a min value error associated with the target field
 * @param min The min value constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minError(min: number, options: WithField<ValidationErrorOptions>): MinValidationError;
/**
 * Create a min value error
 * @param min The min value constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minError(min: number, options?: ValidationErrorOptions): WithoutField<MinValidationError>;
/**
 * Create a max value error associated with the target field
 * @param max The max value constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxError(max: number, options: WithField<ValidationErrorOptions>): MaxValidationError;
/**
 * Create a max value error
 * @param max The max value constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxError(max: number, options?: ValidationErrorOptions): WithoutField<MaxValidationError>;
/**
 * Create a minLength error associated with the target field
 * @param minLength The minLength constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minLengthError(minLength: number, options: WithField<ValidationErrorOptions>): MinLengthValidationError;
/**
 * Create a minLength error
 * @param minLength The minLength constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minLengthError(minLength: number, options?: ValidationErrorOptions): WithoutField<MinLengthValidationError>;
/**
 * Create a maxLength error associated with the target field
 * @param maxLength The maxLength constraint
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxLengthError(maxLength: number, options: WithField<ValidationErrorOptions>): MaxLengthValidationError;
/**
 * Create a maxLength error
 * @param maxLength The maxLength constraint
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxLengthError(maxLength: number, options?: ValidationErrorOptions): WithoutField<MaxLengthValidationError>;
/**
 * Create a pattern matching error associated with the target field
 * @param pattern The violated pattern
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function patternError(pattern: RegExp, options: WithField<ValidationErrorOptions>): PatternValidationError;
/**
 * Create a pattern matching error
 * @param pattern The violated pattern
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function patternError(pattern: RegExp, options?: ValidationErrorOptions): WithoutField<PatternValidationError>;
/**
 * Create an email format error associated with the target field
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function emailError(options: WithField<ValidationErrorOptions>): EmailValidationError;
/**
 * Create an email format error
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function emailError(options?: ValidationErrorOptions): WithoutField<EmailValidationError>;
/**
 * Create a standard schema issue error associated with the target field
 * @param issue The standard schema issue
 * @param options The validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function standardSchemaError(issue: StandardSchemaV1.Issue, options: WithField<ValidationErrorOptions>): StandardSchemaValidationError;
/**
 * Create a standard schema issue error
 * @param issue The standard schema issue
 * @param options The optional validation error options
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function standardSchemaError(issue: StandardSchemaV1.Issue, options?: ValidationErrorOptions): WithoutField<StandardSchemaValidationError>;
/**
 * Create a custom error associated with the target field
 * @param obj The object to create an error from
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function customError<E extends Partial<ValidationErrorWithField>>(obj: WithField<E>): CustomValidationError;
/**
 * Create a custom error
 * @param obj The object to create an error from
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function customError<E extends Partial<ValidationErrorWithField>>(obj?: E): WithoutField<CustomValidationError>;
/**
 * Common interface for all validation errors.
 *
 * This can be returned from validators.
 *
 * It's also used by the creation functions to create an instance
 * (e.g. `requiredError`, `minError`, etc.).
 *
 * @category validation
 * @experimental 21.0.0
 */
interface ValidationError {
    /** Identifies the kind of error. */
    readonly kind: string;
    /** Human readable error message. */
    readonly message?: string;
}
/**
 * Validation error with a field.
 *
 * This is returned from field state, e.g., catField.errors() would be of a list of errors with
 * `field: catField` bound to state.
 */
interface ValidationErrorWithField extends ValidationError {
    /** The field associated with this error. */
    readonly field: FieldTree<unknown>;
}
/**
 * Validation error with optional field.
 *
 * This is generally used in places where the result might have a field.
 * e.g., as a result of a `validateTree`, or when handling form submission.
 */
interface ValidationErrorWithOptionalField extends ValidationError {
    /** The field associated with this error. */
    readonly field?: FieldTree<unknown>;
}
/**
 * Validation error with no field.
 *
 * This is used to strongly enforce that fields are not allowed in validation result.
 */
interface ValidationErrorWithoutField extends ValidationError {
    /** The field associated with this error. */
    readonly field?: never;
}
/**
 * A custom error that may contain additional properties
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class CustomValidationError implements ValidationError {
    /** Brand the class to avoid Typescript structural matching */
    private __brand;
    /**
     * Allow the user to attach arbitrary other properties.
     */
    [key: PropertyKey]: unknown;
    /** Identifies the kind of error. */
    readonly kind: string;
    /** The field associated with this error. */
    readonly field: FieldTree<unknown>;
    /** Human readable error message. */
    readonly message?: string;
    constructor(options?: ValidationErrorOptions);
}
/**
 * Internal version of `NgValidationError`, we create this separately so we can change its type on
 * the exported version to a type union of the possible sub-classes.
 *
 * @experimental 21.0.0
 */
declare abstract class _NgValidationError implements ValidationError {
    /** Brand the class to avoid Typescript structural matching */
    private __brand;
    /** Identifies the kind of error. */
    readonly kind: string;
    /** The field associated with this error. */
    readonly field: FieldTree<unknown>;
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
declare class RequiredValidationError extends _NgValidationError {
    readonly kind = "required";
}
/**
 * An error used to indicate that a value is lower than the minimum allowed.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class MinValidationError extends _NgValidationError {
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
declare class MaxValidationError extends _NgValidationError {
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
declare class MinLengthValidationError extends _NgValidationError {
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
declare class MaxLengthValidationError extends _NgValidationError {
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
declare class PatternValidationError extends _NgValidationError {
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
declare class EmailValidationError extends _NgValidationError {
    readonly kind = "email";
}
/**
 * An error used to indicate an issue validating against a standard schema.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare class StandardSchemaValidationError extends _NgValidationError {
    readonly issue: StandardSchemaV1.Issue;
    readonly kind = "standardSchema";
    constructor(issue: StandardSchemaV1.Issue, options?: ValidationErrorOptions);
}
/**
 * The base class for all built-in, non-custom errors. This class can be used to check if an error
 * is one of the standard kinds, allowing you to switch on the kind to further narrow the type.
 *
 * @example
 * ```
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
type NgValidationError = RequiredValidationError | MinValidationError | MaxValidationError | MinLengthValidationError | MaxLengthValidationError | PatternValidationError | EmailValidationError | StandardSchemaValidationError;

/**
 * Symbol used to retain generic type information when it would otherwise be lost.
 */
declare const ɵɵTYPE: unique symbol;
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
 * A status indicating whether a field is unsubmitted, submitted, or currently submitting.
 *
 * @category types
 * @experimental 21.0.0
 */
type SubmittedStatus = 'unsubmitted' | 'submitted' | 'submitting';
/**
 * A reason for a field's disablement.
 *
 * @category logic
 * @experimental 21.0.0
 */
interface DisabledReason {
    /** The field that is disabled. */
    readonly field: FieldTree<unknown>;
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
type TreeValidationResult<E extends ValidationErrorWithOptionalField = ValidationErrorWithOptionalField> = ValidationSuccess | OneOrMany<E>;
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
type FieldTree<TValue, TKey extends string | number = string | number> = (() => FieldState<TValue, TKey>) & (TValue extends Array<infer U> ? ReadonlyArrayLike<MaybeFieldTree<U, number>> : TValue extends Record<string, any> ? Subfields<TValue> : unknown);
/**
 * The sub-fields that a user can navigate to from a `FieldTree<TValue>`.
 *
 * @template TValue The type of the data which the parent field is wrapped around.
 *
 * @experimental 21.0.0
 */
type Subfields<TValue> = {
    readonly [K in keyof TValue as TValue[K] extends Function ? never : K]: MaybeFieldTree<TValue[K], string>;
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
 * @template TValue The type of the data which the field is wrapped around.
 * @template TKey The type of the property key which this field resides under in its parent.
 *
 * @experimental 21.0.0
 */
type MaybeFieldTree<TValue, TKey extends string | number = string | number> = (TValue & undefined) | FieldTree<Exclude<TValue, undefined>, TKey>;
/**
 * Contains all of the state (e.g. value, statuses, etc.) associated with a `FieldTree`, exposed as
 * signals.
 *
 * @category structure
 * @experimental 21.0.0
 */
interface FieldState<TValue, TKey extends string | number = string | number> extends _FieldState<TValue> {
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
    readonly errors: Signal<ValidationErrorWithField[]>;
    /**
     * A signal containing the {@link errors} of the field and its descendants.
     */
    readonly errorSummary: Signal<ValidationErrorWithField[]>;
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
     * The {@link Field} directives that bind this field to a UI control.
     */
    readonly fieldBindings: Signal<readonly Field<unknown>[]>;
    /**
     * Reads an aggregate metadata value from the field.
     * @param key The metadata key to read.
     */
    metadata<M>(key: AggregateMetadataKey<M, any>): Signal<M>;
    /**
     * Reads a metadata value from the field.
     * @param key The metadata key to read.
     */
    metadata<M>(key: MetadataKey<M>): M | undefined;
    /**
     * Checks whether the given metadata key has been defined for this field.
     */
    hasMetadata(key: MetadataKey<any> | AggregateMetadataKey<any, any>): boolean;
    /**
     * Resets the {@link touched} and {@link dirty} state of the field and its descendants.
     *
     * Note this does not change the data model, which can be reset directly if desired.
     */
    reset(): void;
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
type FieldPath<TValue, TPathKind extends PathKind = PathKind.Root> = {
    [ɵɵTYPE]: [TValue, TPathKind];
} & (TValue extends Array<unknown> ? unknown : TValue extends Record<string, any> ? {
    [K in keyof TValue]: MaybeFieldPath<TValue[K], PathKind.Child>;
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
type MaybeFieldPath<TValue, TPathKind extends PathKind = PathKind.Root> = (TValue & undefined) | FieldPath<Exclude<TValue, undefined>, TPathKind>;
/**
 * Defines logic for a form.
 *
 * @template TValue The type of data stored in the form that this schema is attached to.
 *
 * @category types
 * @experimental 21.0.0
 */
type Schema<in TValue> = {
    [ɵɵTYPE]: SchemaFn<TValue, PathKind.Root>;
};
/**
 * Function that defines rules for a schema.
 *
 * @template TValue The type of data stored in the form that this schema function is attached to.
 * @template TPathKind The kind of path this schema function can be bound to.
 *
 * @category types
 * @experimental 21.0.0
 */
type SchemaFn<TValue, TPathKind extends PathKind = PathKind.Root> = (p: FieldPath<TValue, TPathKind>) => void;
/**
 * A schema or schema definition function.
 *
 * @template TValue The type of data stored in the form that this schema function is attached to.
 * @template TPathKind The kind of path this schema function can be bound to.
 *
 * @category types
 * @experimental 21.0.0
 */
type SchemaOrSchemaFn<TValue, TPathKind extends PathKind = PathKind.Root> = Schema<TValue> | SchemaFn<TValue, TPathKind>;
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
type FieldValidator<TValue, TPathKind extends PathKind = PathKind.Root> = LogicFn<TValue, ValidationResult<ValidationErrorWithoutField>, TPathKind>;
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
 *
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
    readonly field: FieldTree<TValue>;
    /** Gets the value of the field represented by the given path. */
    readonly valueOf: <P>(p: FieldPath<P>) => P;
    /** Gets the state of the field represented by the given path. */
    readonly stateOf: <P>(p: FieldPath<P>) => FieldState<P>;
    /** Gets the field represented by the given path. */
    readonly fieldOf: <P>(p: FieldPath<P>) => FieldTree<P>;
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
 * A function that takes the result of an async operation and the current field context, and maps it
 * to a list of validation errors.
 *
 * @param result The result of the async operation.
 * @param ctx The context for the field the validator is attached to.
 * @return A validation error, or list of validation errors to report based on the result of the async operation.
 *   The returned errors can optionally specify a field that the error should be targeted to.
 *   A targeted error will show up as an error on its target field rather than the field being validated.
 *   If a field is not given, the error is assumed to apply to the field being validated.
 * @template TValue The type of value stored in the field being validated.
 * @template TResult The type of result returned by the async operation
 * @template TPathKind The kind of path being validated (a root path, child path, or item of an array)
 *
 * @experimental 21.0.0
 */
type MapToErrorsFn<TValue, TResult, TPathKind extends PathKind = PathKind.Root> = (result: TResult, ctx: FieldContext<TValue, TPathKind>) => TreeValidationResult;
/**
 * Options that indicate how to create a resource for async validation for a field,
 * and map its result to validation errors.
 *
 * @template TValue The type of value stored in the field being validated.
 * @template TParams The type of parameters to the resource.
 * @template TResult The type of result returned by the resource
 * @template TPathKind The kind of path being validated (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
interface AsyncValidatorOptions<TValue, TParams, TResult, TPathKind extends PathKind = PathKind.Root> {
    /**
     * A function that receives the field context and returns the params for the resource.
     *
     * @param ctx The field context for the field being validated.
     * @returns The params for the resource.
     */
    readonly params: (ctx: FieldContext<TValue, TPathKind>) => TParams;
    /**
     * A function that receives the resource params and returns a resource of the given params.
     * The given params should be used as is to create the resource.
     * The forms system will report the params as `undefined` when this validation doesn't need to be run.
     *
     * @param params The params to use for constructing the resource
     * @returns A reference to the constructed resource.
     */
    readonly factory: (params: Signal<TParams | undefined>) => ResourceRef<TResult | undefined>;
    /**
     * A function to handle errors thrown by httpResource (HTTP errors, network errors, etc.).
     * Receives the error and the field context, returns a list of validation errors.
     */
    readonly onError: (error: unknown, ctx: FieldContext<TValue, TPathKind>) => TreeValidationResult;
    /**
     * A function that takes the resource result, and the current field context and maps it to a list
     * of validation errors.
     *
     * @param result The resource result.
     * @param ctx The context for the field the validator is attached to.
     * @return A validation error, or list of validation errors to report based on the resource result.
     *   The returned errors can optionally specify a field that the error should be targeted to.
     *   A targeted error will show up as an error on its target field rather than the field being validated.
     *   If a field is not given, the error is assumed to apply to the field being validated.
     */
    readonly onSuccess: MapToErrorsFn<TValue, TResult, TPathKind>;
}
/**
 * Options that indicate how to create an httpResource for async validation for a field,
 * and map its result to validation errors.
 *
 * @template TValue The type of value stored in the field being validated.
 * @template TResult The type of result returned by the httpResource
 * @template TPathKind The kind of path being validated (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
interface HttpValidatorOptions<TValue, TResult, TPathKind extends PathKind = PathKind.Root> {
    /**
     * A function that receives the field context and returns the url or request for the httpResource.
     * If given a URL, the underlying httpResource will perform an HTTP GET on it.
     *
     * @param ctx The field context for the field being validated.
     * @returns The URL or request for creating the httpResource.
     */
    readonly request: ((ctx: FieldContext<TValue, TPathKind>) => string | undefined) | ((ctx: FieldContext<TValue, TPathKind>) => HttpResourceRequest | undefined);
    /**
     * A function that takes the httpResource result, and the current field context and maps it to a
     * list of validation errors.
     *
     * @param result The httpResource result.
     * @param ctx The context for the field the validator is attached to.
     * @return A validation error, or list of validation errors to report based on the httpResource result.
     *   The returned errors can optionally specify a field that the error should be targeted to.
     *   A targeted error will show up as an error on its target field rather than the field being validated.
     *   If a field is not given, the error is assumed to apply to the field being validated.
     */
    readonly onSuccess: MapToErrorsFn<TValue, TResult, TPathKind>;
    /**
     * A function to handle errors thrown by httpResource (HTTP errors, network errors, etc.).
     * Receives the error and the field context, returns a list of validation errors.
     */
    readonly onError: (error: unknown, ctx: FieldContext<TValue, TPathKind>) => TreeValidationResult;
    /**
     * The options to use when creating the httpResource.
     */
    readonly options?: HttpResourceOptions<TResult, unknown>;
}
/**
 * Adds async validation to the field corresponding to the given path based on a resource.
 * Async validation for a field only runs once all synchronous validation is passing.
 *
 * @param path A path indicating the field to bind the async validation logic to.
 * @param opts The async validation options.
 * @template TValue The type of value stored in the field being validated.
 * @template TParams The type of parameters to the resource.
 * @template TResult The type of result returned by the resource
 * @template TPathKind The kind of path being validated (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function validateAsync<TValue, TParams, TResult, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, opts: AsyncValidatorOptions<TValue, TParams, TResult, TPathKind>): void;
/**
 * Adds async validation to the field corresponding to the given path based on an httpResource.
 * Async validation for a field only runs once all synchronous validation is passing.
 *
 * @param path A path indicating the field to bind the async validation logic to.
 * @param opts The http validation options.
 * @template TValue The type of value stored in the field being validated.
 * @template TResult The type of result returned by the httpResource
 * @template TPathKind The kind of path being validated (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function validateHttp<TValue, TResult = unknown, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, opts: HttpValidatorOptions<TValue, TResult, TPathKind>): void;

/**
 * The base set of properties shared by all form control contracts.
 *
 * @category control
 * @experimental 21.0.0
 */
interface FormUiControl {
    /**
     * An input to receive the errors for the field. If implemented, the `Field` directive will
     * automatically bind errors from the bound field to this input.
     */
    readonly errors?: InputSignal<readonly WithOptionalField<ValidationError>[]>;
    /**
     * An input to receive the disabled status for the field. If implemented, the `Field` directive
     * will automatically bind the disabled status from the bound field to this input.
     */
    readonly disabled?: InputSignal<boolean>;
    /**
     * An input to receive the reasons for the disablement of the field. If implemented, the `Field`
     * directive will automatically bind the disabled reason from the bound field to this input.
     */
    readonly disabledReasons?: InputSignal<readonly WithOptionalField<DisabledReason>[]>;
    /**
     * An input to receive the readonly status for the field. If implemented, the `Field` directive
     * will automatically bind the readonly status from the bound field to this input.
     */
    readonly readonly?: InputSignal<boolean>;
    /**
     * An input to receive the hidden status for the field. If implemented, the `Field` directive
     * will automatically bind the hidden status from the bound field to this input.
     */
    readonly hidden?: InputSignal<boolean>;
    /**
     * An input to receive the invalid status for the field. If implemented, the `Field` directive
     * will automatically bind the invalid status from the bound field to this input.
     */
    readonly invalid?: InputSignal<boolean>;
    /**
     * An input to receive the pending status for the field. If implemented, the `Field` directive
     * will automatically bind the pending status from the bound field to this input.
     */
    readonly pending?: InputSignal<boolean>;
    /**
     * An input to receive the touched status for the field. If implemented, the `Field` directive
     * will automatically bind the touched status from the bound field to this input.
     */
    readonly touched?: ModelSignal<boolean> | InputSignal<boolean> | OutputRef<boolean>;
    /**
     * An input to receive the dirty status for the field. If implemented, the `Field` directive
     * will automatically bind the dirty status from the bound field to this input.
     */
    readonly dirty?: InputSignal<boolean>;
    /**
     * An input to receive the name for the field. If implemented, the `Field` directive will
     * automatically bind the name from the bound field to this input.
     */
    readonly name?: InputSignal<string>;
    /**
     * An input to receive the required status for the field. If implemented, the `Field` directive
     * will automatically bind the required status from the bound field to this input.
     */
    readonly required?: InputSignal<boolean>;
    /**
     * An input to receive the min value for the field. If implemented, the `Field` directive will
     * automatically bind the min value from the bound field to this input.
     */
    readonly min?: InputSignal<number | undefined>;
    /**
     * An input to receive the min length for the field. If implemented, the `Field` directive will
     * automatically bind the min length from the bound field to this input.
     */
    readonly minLength?: InputSignal<number | undefined>;
    /**
     * An input to receive the max value for the field. If implemented, the `Field` directive will
     * automatically bind the max value from the bound field to this input.
     */
    readonly max?: InputSignal<number | undefined>;
    /**
     * An input to receive the max length for the field. If implemented, the `Field` directive will
     * automatically bind the max length from the bound field to this input.
     */
    readonly maxLength?: InputSignal<number | undefined>;
    /**
     * An input to receive the value patterns for the field. If implemented, the `Field` directive
     * will automatically bind the value patterns from the bound field to this input.
     */
    readonly pattern?: InputSignal<readonly RegExp[]>;
}
/**
 * A contract for a form control that edits a `FieldTree` of type `TValue`. Any component that
 * implements this contract can be used with the `Field` directive.
 *
 * Many of the properties declared on this contract are optional. They do not need to be
 * implemented, but if they are will be kept in sync with the field state of the field bound to the
 * `Field` directive.
 *
 * @template TValue The type of `FieldTree` that the implementing component can edit.
 *
 * @category control
 * @experimental 21.0.0
 */
interface FormValueControl<TValue> extends FormUiControl {
    /**
     * The value is the only required property in this contract. A component that wants to integrate
     * with the `Field` directive via this contract, *must* provide a `model()` that will be kept in
     * sync with the value of the bound `FieldTree`.
     */
    readonly value: ModelSignal<TValue>;
    /**
     * The implementing component *must not* define a `checked` property. This is reserved for
     * components that want to integrate with the `Field` directive as a checkbox.
     */
    readonly checked?: undefined;
}
/**
 * A contract for a form control that edits a boolean checkbox `FieldTree`. Any component that
 * implements this contract can be used with the `Field` directive.
 *
 * Many of the properties declared on this contract are optional. They do not need to be
 * implemented, but if they are will be kept in sync with the field state of the field bound to the
 * `Field` directive.
 *
 * @category control
 * @experimental 21.0.0
 */
interface FormCheckboxControl extends FormUiControl {
    /**
     * The checked is the only required property in this contract. A component that wants to integrate
     * with the `Field` directive, *must* provide a `model()` that will be kept in sync with the
     * value of the bound `FieldTree`.
     */
    readonly checked: ModelSignal<boolean>;
    /**
     * The implementing component *must not* define a `value` property. This is reserved for
     * components that want to integrate with the `Field` directive as a standard input.
     */
    readonly value?: undefined;
}

/**
 * Adds logic to a field to conditionally disable it. A disabled field does not contribute to the
 * validation, touched/dirty, or other state of its parent field.
 *
 * @param path The target path to add the disabled logic to.
 * @param logic A reactive function that returns `true` (or a string reason) when the field is disabled,
 *   and `false` when it is not disabled.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function disabled<TValue, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, logic?: string | NoInfer<LogicFn<TValue, boolean | string, TPathKind>>): void;
/**
 * Adds logic to a field to conditionally make it readonly. A readonly field does not contribute to
 * the validation, touched/dirty, or other state of its parent field.
 *
 * @param path The target path to make readonly.
 * @param logic A reactive function that returns `true` when the field is readonly.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function readonly<TValue, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, logic?: NoInfer<LogicFn<TValue, boolean, TPathKind>>): void;
/**
 * Adds logic to a field to conditionally hide it. A hidden field does not contribute to the
 * validation, touched/dirty, or other state of its parent field.
 *
 * If a field may be hidden it is recommended to guard it with an `@if` in the template:
 * ```
 * @if (!email().hidden()) {
 *   <label for="email">Email</label>
 *   <input id="email" type="email" [control]="email" />
 * }
 * ```
 *
 * @param path The target path to add the hidden logic to.
 * @param logic A reactive function that returns `true` when the field is hidden.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function hidden<TValue, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, logic: NoInfer<LogicFn<TValue, boolean, TPathKind>>): void;
/**
 * Adds logic to a field to determine if the field has validation errors.
 *
 * @param path The target path to add the validation logic to.
 * @param logic A `Validator` that returns the current validation errors.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function validate<TValue, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, logic: NoInfer<FieldValidator<TValue, TPathKind>>): void;
/**
 * Adds logic to a field to determine if the field or any of its child fields has validation errors.
 *
 * @param path The target path to add the validation logic to.
 * @param logic A `TreeValidator` that returns the current validation errors.
 *   Errors returned by the validator may specify a target field to indicate an error on a child field.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function validateTree<TValue, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, logic: NoInfer<TreeValidator<TValue, TPathKind>>): void;
/**
 * Adds a value to an {@link AggregateMetadataKey} of a field.
 *
 * @param path The target path to set the aggregate metadata on.
 * @param key The aggregate metadata key
 * @param logic A function that receives the `FieldContext` and returns a value to add to the aggregate metadata.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TMetadataItem The type of value the metadata aggregates over.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function aggregateMetadata<TValue, TMetadataItem, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, key: AggregateMetadataKey<any, TMetadataItem>, logic: NoInfer<LogicFn<TValue, TMetadataItem, TPathKind>>): void;
/**
 * Creates a new {@link MetadataKey} and defines the value of the new metadata key for the given field.
 *
 * @param path The path to define the metadata for.
 * @param factory A factory function that creates the value for the metadata.
 *   This function is **not** reactive. It is run once when the field is created.
 * @returns The newly created metadata key
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function metadata<TValue, TData, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, factory: (ctx: FieldContext<TValue, TPathKind>) => TData): MetadataKey<TData>;
/**
 * Defines the value of a {@link MetadataKey} for a given field.
 *
 * @param path The path to define the metadata for.
 * @param key  The metadata key to define.
 * @param factory A factory function that creates the value for the metadata.
 *   This function is **not** reactive. It is run once when the field is created.
 * @returns The given metadata key
 *
 * @category logic
 * @experimental 21.0.0
 */
declare function metadata<TValue, TData, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, key: MetadataKey<TData>, factory: (ctx: FieldContext<TValue, TPathKind>) => TData): MetadataKey<TData>;

/** Represents a result that should be ignored because its predicate indicates it is not active. */
declare const IGNORED: unique symbol;
/**
 * A predicate that indicates whether an `AbstractLogic` instance is currently active, or should be
 * ignored.
 */
interface Predicate {
    /** A boolean logic function that returns true if the logic is considered active. */
    readonly fn: LogicFn<any, boolean>;
    /**
     * The path which this predicate was created for. This is used to determine the correct
     * `FieldContext` to pass to the predicate function.
     */
    readonly path: FieldPath<any>;
}
/**
 * Represents a predicate that is bound to a particular depth in the field tree. This is needed for
 * recursively applied logic to ensure that the predicate is evaluated against the correct
 * application of that logic.
 *
 * Consider the following example:
 *
 * ```
 * const s = schema(p => {
 *   disabled(p.data);
 *   applyWhen(p.next, ({valueOf}) => valueOf(p.data) === 1, s);
 * });
 *
 * const f = form(signal({data: 0, next: {data: 1, next: {data: 2, next: undefined}}}), s);
 *
 * const isDisabled = f.next.next.data().disabled();
 * ```
 *
 * In order to determine `isDisabled` we need to evaluate the predicate from `applyWhen` *twice*.
 * Once to see if the schema should be applied to `f.next` and again to see if it should be applied
 * to `f.next.next`. The `depth` tells us which field we should be evaluating against each time.
 */
interface BoundPredicate extends Predicate {
    /** The depth in the field tree at which this predicate is bound. */
    readonly depth: number;
}
/**
 * Base class for all logic. It is responsible for combining the results from multiple individual
 * logic functions registered in the schema, and using them to derive the value for some associated
 * piece of field state.
 */
declare abstract class AbstractLogic<TReturn, TValue = TReturn> {
    /**
     * A list of predicates that conditionally enable all logic in this logic instance.
     * The logic is only enabled when *all* of the predicates evaluate to true.
     */
    private predicates;
    /** The set of logic functions that contribute to the value of the associated state. */
    protected readonly fns: Array<LogicFn<any, TValue | typeof IGNORED>>;
    constructor(
    /**
     * A list of predicates that conditionally enable all logic in this logic instance.
     * The logic is only enabled when *all* of the predicates evaluate to true.
     */
    predicates: ReadonlyArray<BoundPredicate>);
    /**
     * Computes the value of the associated field state based on the logic functions and predicates
     * registered with this logic instance.
     */
    abstract compute(arg: FieldContext<any>): TReturn;
    /**
     * The default value that the associated field state should assume if there are no logic functions
     * registered by the schema (or if the logic is disabled by a predicate).
     */
    abstract get defaultValue(): TReturn;
    /** Registers a logic function with this logic instance. */
    push(logicFn: LogicFn<any, TValue>): void;
    /**
     * Merges in the logic from another logic instance, subject to the predicates of both the other
     * instance and this instance.
     */
    mergeIn(other: AbstractLogic<TReturn, TValue>): void;
}
/** Logic that combines its individual logic function results with logical OR. */
declare class BooleanOrLogic extends AbstractLogic<boolean> {
    get defaultValue(): boolean;
    compute(arg: FieldContext<any>): boolean;
}
/**
 * Logic that combines its individual logic function results by aggregating them in an array.
 * Depending on its `ignore` function it may ignore certain values, omitting them from the array.
 */
declare class ArrayMergeIgnoreLogic<TElement, TIgnore = never> extends AbstractLogic<readonly TElement[], TElement | readonly (TElement | TIgnore)[] | TIgnore | undefined | void> {
    private ignore;
    /** Creates an instance of this class that ignores `null` values. */
    static ignoreNull<TElement>(predicates: ReadonlyArray<BoundPredicate>): ArrayMergeIgnoreLogic<TElement, null>;
    constructor(predicates: ReadonlyArray<BoundPredicate>, ignore: undefined | ((e: TElement | undefined | TIgnore) => e is TIgnore));
    get defaultValue(): never[];
    compute(arg: FieldContext<any>): readonly TElement[];
}
/** Logic that combines its individual logic function results by aggregating them in an array. */
declare class ArrayMergeLogic<TElement> extends ArrayMergeIgnoreLogic<TElement, never> {
    constructor(predicates: ReadonlyArray<BoundPredicate>);
}
/**
 * Container for all the different types of logic that can be applied to a field
 * (disabled, hidden, errors, etc.)
 */
declare class LogicContainer {
    private predicates;
    /** Logic that determines if the field is hidden. */
    readonly hidden: BooleanOrLogic;
    /** Logic that determines reasons for the field being disabled. */
    readonly disabledReasons: ArrayMergeLogic<DisabledReason>;
    /** Logic that determines if the field is read-only. */
    readonly readonly: BooleanOrLogic;
    /** Logic that produces synchronous validation errors for the field. */
    readonly syncErrors: ArrayMergeIgnoreLogic<ValidationErrorWithField, null>;
    /** Logic that produces synchronous validation errors for the field's subtree. */
    readonly syncTreeErrors: ArrayMergeIgnoreLogic<ValidationErrorWithField, null>;
    /** Logic that produces asynchronous validation results (errors or 'pending'). */
    readonly asyncErrors: ArrayMergeIgnoreLogic<ValidationErrorWithField | 'pending', null>;
    /** A map of aggregate metadata keys to the `AbstractLogic` instances that compute their values. */
    private readonly aggregateMetadataKeys;
    /** A map of metadata keys to the factory functions that create their values. */
    private readonly metadataFactories;
    /**
     * Constructs a new `Logic` container.
     * @param predicates An array of predicates that must all be true for the logic
     *   functions within this container to be active.
     */
    constructor(predicates: ReadonlyArray<BoundPredicate>);
    /** Checks whether there is logic for the given aggregate metadata key. */
    hasAggregateMetadata(key: AggregateMetadataKey<any, any>): boolean;
    /**
     * Gets an iterable of [aggregate metadata, logic function] pairs.
     * @returns An iterable of aggregate metadata entries.
     */
    getAggregateMetadataEntries(): MapIterator<[AggregateMetadataKey<unknown, unknown>, AbstractLogic<unknown, unknown>]>;
    /**
     * Gets an iterable of [metadata, value factory function] pairs.
     * @returns An iterable of metadata factory entries.
     */
    getMetadataFactoryEntries(): MapIterator<[MetadataKey<unknown>, (ctx: FieldContext<unknown>) => unknown]>;
    /**
     * Retrieves or creates the `AbstractLogic` for a given aggregate metadata key.
     * @param key The `AggregateMetadataKey` for which to get the logic.
     * @returns The `AbstractLogic` associated with the key.
     */
    getAggregateMetadata<T>(key: AggregateMetadataKey<unknown, T>): AbstractLogic<T>;
    /**
     * Adds a factory function for a given metadata key.
     * @param key The `MetadataKey` to associate the factory with.
     * @param factory The factory function.
     * @throws If a factory is already defined for the given key.
     */
    addMetadataFactory(key: MetadataKey<unknown>, factory: (ctx: FieldContext<unknown>) => unknown): void;
    /**
     * Merges logic from another `Logic` instance into this one.
     * @param other The `Logic` instance to merge from.
     */
    mergeIn(other: LogicContainer): void;
}

/**
 * Abstract base class for building a `LogicNode`.
 * This class defines the interface for adding various logic rules (e.g., hidden, disabled)
 * and data factories to a node in the logic tree.
 * LogicNodeBuilders are 1:1 with nodes in the Schema tree.
 */
declare abstract class AbstractLogicNodeBuilder {
    /** The depth of this node in the schema tree. */
    protected readonly depth: number;
    constructor(
    /** The depth of this node in the schema tree. */
    depth: number);
    /** Adds a rule to determine if a field should be hidden. */
    abstract addHiddenRule(logic: LogicFn<any, boolean>): void;
    /** Adds a rule to determine if a field should be disabled, and for what reason. */
    abstract addDisabledReasonRule(logic: LogicFn<any, DisabledReason | undefined>): void;
    /** Adds a rule to determine if a field should be read-only. */
    abstract addReadonlyRule(logic: LogicFn<any, boolean>): void;
    /** Adds a rule for synchronous validation errors for a field. */
    abstract addSyncErrorRule(logic: LogicFn<any, ValidationResult>): void;
    /** Adds a rule for synchronous validation errors that apply to a subtree. */
    abstract addSyncTreeErrorRule(logic: LogicFn<any, ValidationResult>): void;
    /** Adds a rule for asynchronous validation errors for a field. */
    abstract addAsyncErrorRule(logic: LogicFn<any, AsyncValidationResult>): void;
    /** Adds a rule to compute aggregate metadata for a field. */
    abstract addAggregateMetadataRule<M>(key: AggregateMetadataKey<unknown, M>, logic: LogicFn<any, M>): void;
    /** Adds a factory function to produce a data value associated with a field. */
    abstract addMetadataFactory<D>(key: MetadataKey<D>, factory: (ctx: FieldContext<any>) => D): void;
    /**
     * Gets a builder for a child node associated with the given property key.
     * @param key The property key of the child.
     * @returns A `LogicNodeBuilder` for the child.
     */
    abstract getChild(key: PropertyKey): LogicNodeBuilder;
    /**
     * Checks whether a particular `AbstractLogicNodeBuilder` has been merged into this one.
     * @param builder The builder to check for.
     * @returns True if the builder has been merged, false otherwise.
     */
    abstract hasLogic(builder: AbstractLogicNodeBuilder): boolean;
    /**
     * Builds the `LogicNode` from the accumulated rules and child builders.
     * @returns The constructed `LogicNode`.
     */
    build(): LogicNode;
}
/**
 * A builder for `LogicNode`. Used to add logic to the final `LogicNode` tree.
 * This builder supports merging multiple sources of logic, potentially with predicates,
 * preserving the order of rule application.
 */
declare class LogicNodeBuilder extends AbstractLogicNodeBuilder {
    constructor(depth: number);
    /**
     * The current `NonMergeableLogicNodeBuilder` being used to add rules directly to this
     * `LogicNodeBuilder`. Do not use this directly, call `getCurrent()` which will create a current
     * builder if there is none.
     */
    private current;
    /**
     * Stores all builders that contribute to this node, along with any predicates
     * that gate their application.
     */
    readonly all: {
        builder: AbstractLogicNodeBuilder;
        predicate?: Predicate;
    }[];
    addHiddenRule(logic: LogicFn<any, boolean>): void;
    addDisabledReasonRule(logic: LogicFn<any, DisabledReason | undefined>): void;
    addReadonlyRule(logic: LogicFn<any, boolean>): void;
    addSyncErrorRule(logic: LogicFn<any, ValidationResult<ValidationErrorWithField>>): void;
    addSyncTreeErrorRule(logic: LogicFn<any, ValidationResult<ValidationErrorWithField>>): void;
    addAsyncErrorRule(logic: LogicFn<any, AsyncValidationResult<ValidationErrorWithField>>): void;
    addAggregateMetadataRule<T>(key: AggregateMetadataKey<unknown, T>, logic: LogicFn<any, T>): void;
    addMetadataFactory<D>(key: MetadataKey<D>, factory: (ctx: FieldContext<any>) => D): void;
    getChild(key: PropertyKey): LogicNodeBuilder;
    hasLogic(builder: AbstractLogicNodeBuilder): boolean;
    /**
     * Merges logic from another `LogicNodeBuilder` into this one.
     * If a `predicate` is provided, all logic from the `other` builder will only apply
     * when the predicate evaluates to true.
     * @param other The `LogicNodeBuilder` to merge in.
     * @param predicate An optional predicate to gate the merged logic.
     */
    mergeIn(other: LogicNodeBuilder, predicate?: Predicate): void;
    /**
     * Gets the current `NonMergeableLogicNodeBuilder` for adding rules directly to this
     * `LogicNodeBuilder`. If no current builder exists, a new one is created.
     * The current builder is cleared whenever `mergeIn` is called to preserve the order
     * of rules when merging separate builder trees.
     * @returns The current `NonMergeableLogicNodeBuilder`.
     */
    private getCurrent;
    /**
     * Creates a new root `LogicNodeBuilder`.
     * @returns A new instance of `LogicNodeBuilder`.
     */
    static newRoot(): LogicNodeBuilder;
}
/**
 * Represents a node in the logic tree, containing all logic applicable
 * to a specific field or path in the form structure.
 * LogicNodes are 1:1 with nodes in the Field tree.
 */
interface LogicNode {
    /** The collection of logic rules (hidden, disabled, errors, etc.) for this node. */
    readonly logic: LogicContainer;
    /**
     * Retrieves the `LogicNode` for a child identified by the given property key.
     * @param key The property key of the child.
     * @returns The `LogicNode` for the specified child.
     */
    getChild(key: PropertyKey): LogicNode;
    /**
     * Checks whether the logic from a particular `AbstractLogicNodeBuilder` has been merged into this
     * node.
     * @param builder The builder to check for.
     * @returns True if the builder has been merged, false otherwise.
     */
    hasLogic(builder: AbstractLogicNodeBuilder): boolean;
}

/**
 * Implements the `Schema` concept.
 */
declare class SchemaImpl {
    private schemaFn;
    constructor(schemaFn: SchemaFn<unknown>);
    /**
     * Compiles this schema within the current root compilation context. If the schema was previously
     * compiled within this context, we reuse the cached FieldPathNode, otherwise we create a new one
     * and cache it in the compilation context.
     */
    compile(): FieldPathNode;
    /**
     * Creates a SchemaImpl from the given SchemaOrSchemaFn.
     */
    static create(schema: SchemaImpl | SchemaOrSchemaFn<any>): SchemaImpl;
    /**
     * Compiles the given schema in a fresh compilation context. This clears the cached results of any
     * previous compilations.
     */
    static rootCompile(schema: SchemaImpl | SchemaOrSchemaFn<any> | undefined): FieldPathNode;
}

/**
 * A path in the schema on which logic is stored so that it can be added to the corresponding field
 * when the field is created.
 */
declare class FieldPathNode {
    /** The property keys used to navigate from the root path to this path. */
    readonly keys: PropertyKey[];
    /** The parent of this path node. */
    private readonly parent;
    /** The key of this node in its parent. */
    private readonly keyInParent;
    /** The root path node from which this path node is descended. */
    readonly root: FieldPathNode;
    /**
     * A map containing all child path nodes that have been created on this path.
     * Child path nodes are created automatically on first access if they do not exist already.
     */
    private readonly children;
    /**
     * A proxy that wraps the path node, allowing navigation to its child paths via property access.
     */
    readonly fieldPathProxy: FieldPath<any>;
    /**
     * For a root path node this will contain the root logic builder. For non-root nodes,
     * they determine their logic builder from their parent so this is undefined.
     */
    private readonly logicBuilder;
    protected constructor(
    /** The property keys used to navigate from the root path to this path. */
    keys: PropertyKey[], root: FieldPathNode | undefined, 
    /** The parent of this path node. */
    parent: FieldPathNode | undefined, 
    /** The key of this node in its parent. */
    keyInParent: PropertyKey | undefined);
    /** The logic builder used to accumulate logic on this path node. */
    get builder(): LogicNodeBuilder;
    /**
     * Gets the special path node containing the per-element logic that applies to *all* children paths.
     */
    get element(): FieldPathNode;
    /**
     * Gets the path node for the given child property key.
     * Child paths are created automatically on first access if they do not exist already.
     */
    getChild(key: PropertyKey): FieldPathNode;
    /**
     * Merges in logic from another schema to this one.
     * @param other The other schema to merge in the logic from
     * @param predicate A predicate indicating when the merged in logic should be active.
     */
    mergeIn(other: SchemaImpl, predicate?: Predicate): void;
    /** Extracts the underlying path node from the given path proxy. */
    static unwrapFieldPath(formPath: FieldPath<unknown>): FieldPathNode;
    /** Creates a new root path node to be passed in to a schema function. */
    static newRoot(): FieldPathNode;
}

/**
 * Tracks custom metadata associated with a `FieldNode`.
 */
declare class FieldMetadataState {
    private readonly node;
    /** A map of all `MetadataKey` and `AggregateMetadataKey` that have been defined for this field. */
    private readonly metadata;
    constructor(node: FieldNode);
    /** Gets the value of a `MetadataKey` or `AggregateMetadataKey` for the field. */
    get<T>(key: MetadataKey<T> | AggregateMetadataKey<T, unknown>): T | undefined | Signal<T>;
    /** Checks whether the current metadata state has the given metadata key. */
    has(key: MetadataKey<any> | AggregateMetadataKey<any, any>): boolean;
}

/**
 * The non-validation and non-submit state associated with a `FieldNode`, such as touched and dirty
 * status, as well as derived logical state.
 */
declare class FieldNodeState {
    private readonly node;
    /**
     * Indicates whether this field has been touched directly by the user (as opposed to indirectly by
     * touching a child field).
     *
     * A field is considered directly touched when a user stops editing it for the first time (i.e. on blur)
     */
    private readonly selfTouched;
    /**
     * Indicates whether this field has been dirtied directly by the user (as opposed to indirectly by
     * dirtying a child field).
     *
     * A field is considered directly dirtied if a user changed the value of the field at least once.
     */
    private readonly selfDirty;
    /**
     * Marks this specific field as touched.
     */
    markAsTouched(): void;
    /**
     * Marks this specific field as dirty.
     */
    markAsDirty(): void;
    /**
     * Marks this specific field as not dirty.
     */
    markAsPristine(): void;
    /**
     * Marks this specific field as not touched.
     */
    markAsUntouched(): void;
    /** The {@link Field} directives that bind this field to a UI control. */
    readonly fieldBindings: i0.WritableSignal<readonly Field<unknown>[]>;
    constructor(node: FieldNode);
    /**
     * Whether this field is considered dirty.
     *
     * A field is considered dirty if one of the following is true:
     *  - It was directly dirtied and is interactive
     *  - One of its children is considered dirty
     */
    readonly dirty: Signal<boolean>;
    /**
     * Whether this field is considered touched.
     *
     * A field is considered touched if one of the following is true:
     *  - It was directly touched and is interactive
     *  - One of its children is considered touched
     */
    readonly touched: Signal<boolean>;
    /**
     * The reasons for this field's disablement. This includes disabled reasons for any parent field
     * that may have been disabled, indirectly causing this field to be disabled as well.
     * The `field` property of the `DisabledReason` can be used to determine which field ultimately
     * caused the disablement.
     */
    readonly disabledReasons: Signal<readonly DisabledReason[]>;
    /**
     * Whether this field is considered disabled.
     *
     * A field is considered disabled if one of the following is true:
     * - The schema contains logic that directly disabled it
     * - Its parent field is considered disabled
     */
    readonly disabled: Signal<boolean>;
    /**
     * Whether this field is considered readonly.
     *
     * A field is considered readonly if one of the following is true:
     * - The schema contains logic that directly made it readonly
     * - Its parent field is considered readonly
     */
    readonly readonly: Signal<boolean>;
    /**
     * Whether this field is considered hidden.
     *
     * A field is considered hidden if one of the following is true:
     * - The schema contains logic that directly hides it
     * - Its parent field is considered hidden
     */
    readonly hidden: Signal<boolean>;
    readonly name: Signal<string>;
    /** Whether this field is considered non-interactive.
     *
     * A field is considered non-interactive if one of the following is true:
     * - It is hidden
     * - It is disabled
     * - It is readonly
     */
    private readonly isNonInteractive;
}

/**
 * State of a `FieldNode` that's associated with form submission.
 */
declare class FieldSubmitState {
    private readonly node;
    /**
     * Whether this field was directly submitted (as opposed to indirectly by a parent field being submitted)
     * and is still in the process of submitting.
     */
    readonly selfSubmitting: WritableSignal<boolean>;
    /** Server errors that are associated with this field. */
    readonly serverErrors: WritableSignal<readonly ValidationErrorWithField[]>;
    constructor(node: FieldNode);
    /**
     * Whether this form is currently in the process of being submitted.
     * Either because the field was submitted directly, or because a parent field was submitted.
     */
    readonly submitting: Signal<boolean>;
}

interface ValidationState {
    /**
     * The full set of synchronous tree errors visible to this field. This includes ones that are
     * targeted at a descendant field rather than at this field.
     */
    rawSyncTreeErrors: Signal<ValidationErrorWithField[]>;
    /**
     * The full set of synchronous errors for this field, including synchronous tree errors and server
     * errors. Server errors are considered "synchronous" because they are imperatively added. From
     * the perspective of the field state they are either there or not, they are never in a pending
     * state.
     */
    syncErrors: Signal<ValidationErrorWithField[]>;
    /**
     * Whether the field is considered valid according solely to its synchronous validators.
     * Errors resulting from a previous submit attempt are also considered for this state.
     */
    syncValid: Signal<boolean>;
    /**
     * The full set of asynchronous tree errors visible to this field. This includes ones that are
     * targeted at a descendant field rather than at this field, as well as sentinel 'pending' values
     * indicating that the validator is still running and an error could still occur.
     */
    rawAsyncErrors: Signal<(ValidationErrorWithField | 'pending')[]>;
    /**
     * The asynchronous tree errors visible to this field that are specifically targeted at this field
     * rather than a descendant. This also includes all 'pending' sentinel values, since those could
     * theoretically result in errors for this field.
     */
    asyncErrors: Signal<(ValidationErrorWithField | 'pending')[]>;
    /**
     * The combined set of all errors that currently apply to this field.
     */
    errors: Signal<ValidationErrorWithField[]>;
    /**
     * The combined set of all errors that currently apply to this field and its descendants.
     */
    errorSummary: Signal<ValidationErrorWithField[]>;
    /**
     * Whether this field has any asynchronous validators still pending.
     */
    pending: Signal<boolean>;
    /**
     * The validation status of the field.
     * - The status is 'valid' if neither the field nor any of its children has any errors or pending
     *   validators.
     * - The status is 'invalid' if the field or any of its children has an error
     *   (regardless of pending validators)
     * - The status is 'unknown' if neither the field nor any of its children has any errors,
     *   but the field or any of its children does have a pending validator.
     *
     * A field is considered valid if *all* of the following are true:
     *  - It has no errors or pending validators
     *  - All of its children are considered valid
     * A field is considered invalid if *any* of the following are true:
     *  - It has an error
     *  - Any of its children is considered invalid
     * A field is considered to have unknown validity status if it is not valid or invalid.
     */
    status: Signal<'valid' | 'invalid' | 'unknown'>;
    /**
     * Whether the field is considered valid.
     *
     * A field is considered valid if *all* of the following are true:
     *  - It has no errors or pending validators
     *  - All of its children are considered valid
     *
     * Note: `!valid()` is *not* the same as `invalid()`. Both `valid()` and `invalid()` can be false
     * if there are currently no errors, but validators are still pending.
     */
    valid: Signal<boolean>;
    /**
     * Whether the field is considered invalid.
     *
     * A field is considered invalid if *any* of the following are true:
     *  - It has an error
     *  - Any of its children is considered invalid
     *
     * Note: `!invalid()` is *not* the same as `valid()`. Both `valid()` and `invalid()` can be false
     * if there are currently no errors, but validators are still pending.
     */
    invalid: Signal<boolean>;
    /**
     * Indicates whether validation should be skipped for this field because it is hidden, disabled,
     * or readonly.
     */
    shouldSkipValidation: Signal<boolean>;
}

/**
 * Internal node in the form tree for a given field.
 *
 * Field nodes have several responsibilities:
 *  - They track instance state for the particular field (touched)
 *  - They compute signals for derived state (valid, disabled, etc) based on their associated
 *    `LogicNode`
 *  - They act as the public API for the field (they implement the `FieldState` interface)
 *  - They implement navigation of the form tree via `.parent` and `.getChild()`.
 *
 * This class is largely a wrapper that aggregates several smaller pieces that each manage a subset of
 * the responsibilities.
 */
declare class FieldNode implements FieldState<unknown> {
    readonly structure: FieldNodeStructure;
    readonly validationState: ValidationState;
    readonly metadataState: FieldMetadataState;
    readonly nodeState: FieldNodeState;
    readonly submitState: FieldSubmitState;
    private _context;
    readonly fieldAdapter: FieldAdapter;
    get context(): FieldContext<unknown>;
    /**
     * Proxy to this node which allows navigation of the form graph below it.
     */
    readonly fieldProxy: FieldTree<any>;
    constructor(options: FieldNodeOptions);
    get logicNode(): LogicNode;
    get value(): WritableSignal<unknown>;
    get keyInParent(): Signal<string | number>;
    get errors(): Signal<ValidationErrorWithField[]>;
    get errorSummary(): Signal<ValidationErrorWithField[]>;
    get pending(): Signal<boolean>;
    get valid(): Signal<boolean>;
    get invalid(): Signal<boolean>;
    get dirty(): Signal<boolean>;
    get touched(): Signal<boolean>;
    get disabled(): Signal<boolean>;
    get disabledReasons(): Signal<readonly DisabledReason[]>;
    get hidden(): Signal<boolean>;
    get readonly(): Signal<boolean>;
    get fieldBindings(): Signal<readonly Field<unknown>[]>;
    get submitting(): Signal<boolean>;
    get name(): Signal<string>;
    private metadataOrUndefined;
    get max(): Signal<number | undefined> | undefined;
    get maxLength(): Signal<number | undefined> | undefined;
    get min(): Signal<number | undefined> | undefined;
    get minLength(): Signal<number | undefined> | undefined;
    get pattern(): Signal<readonly RegExp[]> | undefined;
    get required(): Signal<boolean> | undefined;
    metadata<M>(key: AggregateMetadataKey<M, any>): Signal<M>;
    metadata<M>(key: MetadataKey<M>): M | undefined;
    hasMetadata(key: MetadataKey<any> | AggregateMetadataKey<any, any>): boolean;
    /**
     * Marks this specific field as touched.
     */
    markAsTouched(): void;
    /**
     * Marks this specific field as dirty.
     */
    markAsDirty(): void;
    /**
     * Resets the {@link touched} and {@link dirty} state of the field and its descendants.
     *
     * Note this does not change the data model, which can be reset directly if desired.
     */
    reset(): void;
    /**
     * Creates a new root field node for a new form.
     */
    static newRoot<T>(fieldManager: FormFieldManager, value: WritableSignal<T>, pathNode: FieldPathNode, adapter: FieldAdapter): FieldNode;
    /**
     * Creates a child field node based on the given options.
     */
    private static newChild;
    createStructure(options: FieldNodeOptions): RootFieldNodeStructure | ChildFieldNodeStructure;
}
/**
 * Field node of a field that has children.
 * This simplifies and makes certain types cleaner.
 */
interface ParentFieldNode extends FieldNode {
    readonly value: WritableSignal<Record<string, unknown>>;
    readonly structure: FieldNodeStructure & {
        value: WritableSignal<Record<string, unknown>>;
    };
}

/**
 * Key by which a parent `FieldNode` tracks its children.
 *
 * Often this is the actual property key of the child, but in the case of arrays it could be a
 * tracking key allocated for the object.
 */
type TrackingKey = PropertyKey & {
    __brand: 'FieldIdentity';
};
/** Structural component of a `FieldNode` which tracks its path, parent, and children. */
declare abstract class FieldNodeStructure {
    /** The logic to apply to this field. */
    readonly logic: LogicNode;
    /** Computed map of child fields, based on the current value of this field. */
    abstract readonly childrenMap: Signal<Map<TrackingKey, FieldNode> | undefined>;
    /** The field's value. */
    abstract readonly value: WritableSignal<unknown>;
    /**
     * The key of this field in its parent field.
     * Attempting to read this for the root field will result in an error being thrown.
     */
    abstract readonly keyInParent: Signal<string>;
    /** The field manager responsible for managing this field. */
    abstract readonly fieldManager: FormFieldManager;
    /** The root field that this field descends from. */
    abstract readonly root: FieldNode;
    /** The list of property keys to follow to get from the `root` to this field. */
    abstract readonly pathKeys: Signal<readonly PropertyKey[]>;
    /** The parent field of this field. */
    abstract readonly parent: FieldNode | undefined;
    /** Added to array elements for tracking purposes. */
    readonly identitySymbol: symbol;
    /** Lazily initialized injector. Do not access directly, access via `injector` getter instead. */
    private _injector;
    /** Lazily initialized injector. */
    get injector(): DestroyableInjector;
    constructor(
    /** The logic to apply to this field. */
    logic: LogicNode);
    /** Gets the child fields of this field. */
    children(): Iterable<FieldNode>;
    /** Retrieve a child `FieldNode` of this node by property key. */
    getChild(key: PropertyKey): FieldNode | undefined;
    /** Destroys the field when it is no longer needed. */
    destroy(): void;
}
/** The structural component of a `FieldNode` that is the root of its field tree. */
declare class RootFieldNodeStructure extends FieldNodeStructure {
    /** The full field node that corresponds to this structure. */
    private readonly node;
    readonly fieldManager: FormFieldManager;
    readonly value: WritableSignal<unknown>;
    get parent(): undefined;
    get root(): FieldNode;
    get pathKeys(): Signal<readonly PropertyKey[]>;
    get keyInParent(): Signal<string>;
    readonly childrenMap: Signal<Map<TrackingKey, FieldNode> | undefined>;
    /**
     * Creates the structure for the root node of a field tree.
     *
     * @param node The full field node that this structure belongs to
     * @param pathNode The path corresponding to this node in the schema
     * @param logic The logic to apply to this field
     * @param fieldManager The field manager for this field
     * @param value The value signal for this field
     * @param adapter Adapter that knows how to create new fields and appropriate state.
     * @param createChildNode A factory function to create child nodes for this field.
     */
    constructor(
    /** The full field node that corresponds to this structure. */
    node: FieldNode, pathNode: FieldPathNode, logic: LogicNode, fieldManager: FormFieldManager, value: WritableSignal<unknown>, adapter: FieldAdapter, createChildNode: (options: ChildFieldNodeOptions) => FieldNode);
}
/** The structural component of a child `FieldNode` within a field tree. */
declare class ChildFieldNodeStructure extends FieldNodeStructure {
    readonly parent: ParentFieldNode;
    readonly root: FieldNode;
    readonly pathKeys: Signal<readonly PropertyKey[]>;
    readonly keyInParent: Signal<string>;
    readonly value: WritableSignal<unknown>;
    readonly childrenMap: Signal<Map<TrackingKey, FieldNode> | undefined>;
    get fieldManager(): FormFieldManager;
    /**
     * Creates the structure for a child field node in a field tree.
     *
     * @param node The full field node that this structure belongs to
     * @param pathNode The path corresponding to this node in the schema
     * @param logic The logic to apply to this field
     * @param parent The parent field node for this node
     * @param identityInParent The identity used to track this field in its parent
     * @param initialKeyInParent The key of this field in its parent at the time of creation
     * @param adapter Adapter that knows how to create new fields and appropriate state.
     * @param createChildNode A factory function to create child nodes for this field.
     */
    constructor(node: FieldNode, pathNode: FieldPathNode, logic: LogicNode, parent: ParentFieldNode, identityInParent: TrackingKey | undefined, initialKeyInParent: string, adapter: FieldAdapter, createChildNode: (options: ChildFieldNodeOptions) => FieldNode);
}
/** Options passed when constructing a root field node. */
interface RootFieldNodeOptions {
    /** Kind of node, used to differentiate root node options from child node options. */
    readonly kind: 'root';
    /** The path node corresponding to this field in the schema. */
    readonly pathNode: FieldPathNode;
    /** The logic to apply to this field. */
    readonly logic: LogicNode;
    /** The value signal for this field. */
    readonly value: WritableSignal<unknown>;
    /** The field manager for this field. */
    readonly fieldManager: FormFieldManager;
    /** This allows for more granular field and state management, and is currently used for compat. */
    readonly fieldAdapter: FieldAdapter;
}
/** Options passed when constructing a child field node. */
interface ChildFieldNodeOptions {
    /** Kind of node, used to differentiate root node options from child node options. */
    readonly kind: 'child';
    /** The parent field node of this field. */
    readonly parent: ParentFieldNode;
    /** The path node corresponding to this field in the schema. */
    readonly pathNode: FieldPathNode;
    /** The logic to apply to this field. */
    readonly logic: LogicNode;
    /** The key of this field in its parent at the time of creation. */
    readonly initialKeyInParent: string;
    /** The identity used to track this field in its parent. */
    readonly identityInParent: TrackingKey | undefined;
    /** This allows for more granular field and state management, and is currently used for compat. */
    readonly fieldAdapter: FieldAdapter;
}
/** Options passed when constructing a field node. */
type FieldNodeOptions = RootFieldNodeOptions | ChildFieldNodeOptions;

/**
 * Manages the collection of fields associated with a given `form`.
 *
 * Fields are created implicitly, through reactivity, and may create "owned" entities like effects
 * or resources. When a field is no longer connected to the form, these owned entities should be
 * destroyed, which is the job of the `FormFieldManager`.
 */
declare class FormFieldManager {
    readonly injector: Injector;
    readonly rootName: string;
    constructor(injector: Injector, rootName: string | undefined);
    /**
     * Contains all child field structures that have been created as part of the current form.
     * New child structures are automatically added when they are created.
     * Structures are destroyed and removed when they are no longer reachable from the root.
     */
    readonly structures: Set<FieldNodeStructure>;
    /**
     * Creates an effect that runs when the form's structure changes and checks for structures that
     * have become unreachable to clean up.
     *
     * For example, consider a form wrapped around the following model: `signal([0, 1, 2])`.
     * This form would have 4 nodes as part of its structure tree.
     * One structure for the root array, and one structure for each element of the array.
     * Now imagine the data is updated: `model.set([0])`. In this case the structure for the first
     * element can still be reached from the root, but the structures for the second and third
     * elements are now orphaned and not connected to the root. Thus they will be destroyed.
     *
     * @param root The root field structure.
     */
    createFieldManagementEffect(root: FieldNodeStructure): void;
    /**
     * Collects all structures reachable from the given structure into the given set.
     *
     * @param structure The root structure
     * @param liveStructures The set of reachable structures to populate
     */
    private markStructuresLive;
}

/**
 * Adapter allowing customization of the creation logic for a field and its associated
 * structure and state.
 */
interface FieldAdapter {
    /**
     * Creates a node structure.
     * @param node
     * @param options
     */
    createStructure(node: FieldNode, options: FieldNodeOptions): FieldNodeStructure;
    /**
     * Creates node validation state
     * @param param
     * @param options
     */
    createValidationState(param: FieldNode, options: FieldNodeOptions): ValidationState;
    /**
     * Creates node state.
     * @param param
     * @param options
     */
    createNodeState(param: FieldNode, options: FieldNodeOptions): FieldNodeState;
    /**
     * Creates a custom child node.
     * @param options
     */
    newChild(options: ChildFieldNodeOptions): FieldNode;
    /**
     * Creates a custom root node.
     * @param fieldManager
     * @param model
     * @param pathNode
     * @param adapter
     */
    newRoot<TValue>(fieldManager: FormFieldManager, model: WritableSignal<TValue>, pathNode: FieldPathNode, adapter: FieldAdapter): FieldNode;
}

/**
 * Options that may be specified when creating a form.
 *
 * @category structure
 * @experimental 21.0.0
 */
interface FormOptions {
    /**
     * The injector to use for dependency injection. If this is not provided, the injector for the
     * current [injection context](guide/di/dependency-injection-context), will be used.
     */
    injector?: Injector;
    name?: string;
    /**
     * Adapter allows managing fields in a more flexible way.
     * Currently this is used to support interop with reactive forms.
     */
    adapter?: FieldAdapter;
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
 * ```
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
 * @template TValue The type of the data model.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function form<TValue>(model: WritableSignal<TValue>): FieldTree<TValue>;
/**
 * Creates a form wrapped around the given model data. A form is represented as simply a `FieldTree`
 * of the model data.
 *
 * `form` uses the given model as the source of truth and *does not* maintain its own copy of the
 * data. This means that updating the value on a `FieldState` updates the originally passed in model
 * as well.
 *
 * @example
 * ```
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
 * ```
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
declare function form<TValue>(model: WritableSignal<TValue>, schemaOrOptions: SchemaOrSchemaFn<TValue> | FormOptions): FieldTree<TValue>;
/**
 * Creates a form wrapped around the given model data. A form is represented as simply a `FieldTree`
 * of the model data.
 *
 * `form` uses the given model as the source of truth and *does not* maintain its own copy of the
 * data. This means that updating the value on a `FieldState` updates the originally passed in model
 * as well.
 *
 * @example
 * ```
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
 * ```
 * const nameForm = form(signal({first: '', last: ''}), (name) => {
 *   required(name.first);
 *   error(name.last, ({value}) => !/^[a-z]+$/i.test(value()), 'Alphabet characters only');
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
 * @template TValue The type of the data model.
 *
 * @category structure
 * @experimental 21.0.0
 */
declare function form<TValue>(model: WritableSignal<TValue>, schema: SchemaOrSchemaFn<TValue>, options: FormOptions): FieldTree<TValue>;
/**
 * Applies a schema to each item of an array.
 *
 * @example
 * ```
 * const nameSchema = schema<{first: string, last: string}>((name) => {
 *   required(name.first);
 *   required(name.last);
 * });
 * const namesForm = form(signal([{first: '', last: ''}]), (names) => {
 *   applyEach(names, nameSchema);
 * });
 * ```
 *
 * When binding logic to the array items, the `FieldTree` for the array item is passed as an
 * additional argument. This can be used to reference other properties on the item.
 *
 * @example
 * ```
 * const namesForm = form(signal([{first: '', last: ''}]), (names) => {
 *   applyEach(names, (name) => {
 *     error(
 *       name.last,
 *       (value, nameField) => value === nameField.first().value(),
 *       'Last name must be different than first name',
 *     );
 *   });
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
declare function applyEach<TValue>(path: FieldPath<TValue[]>, schema: NoInfer<SchemaOrSchemaFn<TValue, PathKind.Item>>): void;
/**
 * Applies a predefined schema to a given `FieldPath`.
 *
 * @example
 * ```
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
declare function apply<TValue>(path: FieldPath<TValue>, schema: NoInfer<SchemaOrSchemaFn<TValue>>): void;
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
declare function applyWhen<TValue>(path: FieldPath<TValue>, logic: LogicFn<TValue, boolean>, schema: NoInfer<SchemaOrSchemaFn<TValue>>): void;
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
declare function applyWhenValue<TValue, TNarrowed extends TValue>(path: FieldPath<TValue>, predicate: (value: TValue) => value is TNarrowed, schema: SchemaOrSchemaFn<TNarrowed>): void;
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
declare function applyWhenValue<TValue>(path: FieldPath<TValue>, predicate: (value: TValue) => boolean, schema: NoInfer<SchemaOrSchemaFn<TValue>>): void;
/**
 * Submits a given `FieldTree` using the given action function and applies any server errors
 * resulting from the action to the field. Server errors returned by the `action` will be integrated
 * into the field as a `ValidationError` on the sub-field indicated by the `field` property of the
 * server error.
 *
 * @example
 * ```
 * async function registerNewUser(registrationForm: FieldTree<{username: string, password: string}>) {
 *   const result = await myClient.registerNewUser(registrationForm().value());
 *   if (result.errorCode === myClient.ErrorCode.USERNAME_TAKEN) {
 *     return [{
 *       field: registrationForm.username,
 *       error: {kind: 'server', message: 'Username already taken'}
 *     }];
 *   }
 *   return undefined;
 * }
 *
 * const registrationForm = form(signal({username: 'god', password: ''}));
 * submit(registrationForm, async (f) => {
 *   return registerNewUser(registrationForm);
 * });
 * registrationForm.username().errors(); // [{kind: 'server', message: 'Username already taken'}]
 * ```
 *
 * @param form The field to submit.
 * @param action An asynchronous action used to submit the field. The action may return server
 * errors.
 * @template TValue The data type of the field being submitted.
 *
 * @category submission
 * @experimental 21.0.0
 */
declare function submit<TValue>(form: FieldTree<TValue>, action: (form: FieldTree<TValue>) => Promise<TreeValidationResult>): Promise<void>;
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

/** Represents a value that has a length or size, such as an array or string, or set. */
type ValueWithLengthOrSize = {
    length: number;
} | {
    size: number;
};
/** Common options available on the standard validators. */
type BaseValidatorConfig<TValue, TPathKind extends PathKind = PathKind.Root> = {
    /** A user-facing error message to include with the error. */
    message?: string | LogicFn<TValue, string, TPathKind>;
    error?: never;
} | {
    /**
     * Custom validation error(s) to report instead of the default,
     * or a function that receives the `FieldContext` and returns custom validation error(s).
     */
    error?: OneOrMany<ValidationError> | LogicFn<TValue, OneOrMany<ValidationError>, TPathKind>;
    message?: never;
};

/**
 * Binds a validator to the given path that requires the value to match the standard email format.
 * This function can only be called on string paths.
 *
 * @param path Path of the field to validate
 * @param config Optional, allows providing any of the following options:
 *  - `error`: Custom validation error(s) to be used instead of the default `ValidationError.email()`
 *    or a function that receives the `FieldContext` and returns custom validation error(s).
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function email<TPathKind extends PathKind = PathKind.Root>(path: FieldPath<string, TPathKind>, config?: BaseValidatorConfig<string, TPathKind>): void;

/**
 * Binds a validator to the given path that requires the value to be less than or equal to the
 * given `maxValue`.
 * This function can only be called on number paths.
 * In addition to binding a validator, this function adds `MAX` property to the field.
 *
 * @param path Path of the field to validate
 * @param maxValue The maximum value, or a LogicFn that returns the maximum value.
 * @param config Optional, allows providing any of the following options:
 *  - `error`: Custom validation error(s) to be used instead of the default `ValidationError.max(maxValue)`
 *    or a function that receives the `FieldContext` and returns custom validation error(s).
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function max<TPathKind extends PathKind = PathKind.Root>(path: FieldPath<number, TPathKind>, maxValue: number | LogicFn<number, number | undefined, TPathKind>, config?: BaseValidatorConfig<number, TPathKind>): void;

/**
 * Binds a validator to the given path that requires the length of the value to be less than or
 * equal to the given `maxLength`.
 * This function can only be called on string or array paths.
 * In addition to binding a validator, this function adds `MAX_LENGTH` property to the field.
 *
 * @param path Path of the field to validate
 * @param maxLength The maximum length, or a LogicFn that returns the maximum length.
 * @param config Optional, allows providing any of the following options:
 *  - `error`: Custom validation error(s) to be used instead of the default `ValidationError.maxLength(maxLength)`
 *    or a function that receives the `FieldContext` and returns custom validation error(s).
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function maxLength<TValue extends ValueWithLengthOrSize, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, maxLength: number | LogicFn<TValue, number | undefined, TPathKind>, config?: BaseValidatorConfig<TValue, TPathKind>): void;

/**
 * Binds a validator to the given path that requires the value to be greater than or equal to
 * the given `minValue`.
 * This function can only be called on number paths.
 * In addition to binding a validator, this function adds `MIN` property to the field.
 *
 * @param path Path of the field to validate
 * @param minValue The minimum value, or a LogicFn that returns the minimum value.
 * @param config Optional, allows providing any of the following options:
 *  - `error`: Custom validation error(s) to be used instead of the default `ValidationError.min(minValue)`
 *    or a function that receives the `FieldContext` and returns custom validation error(s).
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function min<TPathKind extends PathKind = PathKind.Root>(path: FieldPath<number, TPathKind>, minValue: number | LogicFn<number, number | undefined, TPathKind>, config?: BaseValidatorConfig<number, TPathKind>): void;

/**
 * Binds a validator to the given path that requires the length of the value to be greater than or
 * equal to the given `minLength`.
 * This function can only be called on string or array paths.
 * In addition to binding a validator, this function adds `MIN_LENGTH` property to the field.
 *
 * @param path Path of the field to validate
 * @param minLength The minimum length, or a LogicFn that returns the minimum length.
 * @param config Optional, allows providing any of the following options:
 *  - `error`: Custom validation error(s) to be used instead of the default `ValidationError.minLength(minLength)`
 *    or a function that receives the `FieldContext` and returns custom validation error(s).
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function minLength<TValue extends ValueWithLengthOrSize, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, minLength: number | LogicFn<TValue, number | undefined, TPathKind>, config?: BaseValidatorConfig<TValue, TPathKind>): void;

/**
 * Binds a validator to the given path that requires the value to match a specific regex pattern.
 * This function can only be called on string paths.
 * In addition to binding a validator, this function adds `PATTERN` property to the field.
 *
 * @param path Path of the field to validate
 * @param pattern The RegExp pattern to match, or a LogicFn that returns the RegExp pattern.
 * @param config Optional, allows providing any of the following options:
 *  - `error`: Custom validation error(s) to be used instead of the default `ValidationError.pattern(pattern)`
 *    or a function that receives the `FieldContext` and returns custom validation error(s).
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function pattern<TPathKind extends PathKind = PathKind.Root>(path: FieldPath<string, TPathKind>, pattern: RegExp | LogicFn<string | undefined, RegExp | undefined, TPathKind>, config?: BaseValidatorConfig<string, TPathKind>): void;

/**
 * Binds a validator to the given path that requires the value to be non-empty.
 * This function can only be called on any type of path.
 * In addition to binding a validator, this function adds `REQUIRED` property to the field.
 *
 * @param path Path of the field to validate
 * @param config Optional, allows providing any of the following options:
 *  - `message`: A user-facing message for the error.
 *  - `error`: Custom validation error(s) to be used instead of the default `ValidationError.required()`
 *    or a function that receives the `FieldContext` and returns custom validation error(s).
 *  - `when`: A function that receives the `FieldContext` and returns true if the field is required
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function required<TValue, TPathKind extends PathKind = PathKind.Root>(path: FieldPath<TValue, TPathKind>, config?: BaseValidatorConfig<TValue, TPathKind> & {
    when?: NoInfer<LogicFn<TValue, boolean, TPathKind>>;
}): void;

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
 * @param schema The standard schema compatible validator to use for validation.
 * @template TSchema The type validated by the schema. This may be either the full `TValue` type,
 *   or a partial of it.
 * @template TValue The type of value stored in the field being validated.
 *
 * @category validation
 * @experimental 21.0.0
 */
declare function validateStandardSchema<TSchema, TValue extends IgnoreUnknownProperties<TSchema>>(path: FieldPath<TValue>, schema: StandardSchemaV1<TSchema>): void;

export { AggregateMetadataKey, CustomValidationError, EmailValidationError, FIELD, Field, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MaxLengthValidationError, MaxValidationError, MetadataKey, MinLengthValidationError, MinValidationError, NgValidationError, PATTERN, PathKind, PatternValidationError, REQUIRED, RequiredValidationError, StandardSchemaValidationError, aggregateMetadata, andMetadataKey, apply, applyEach, applyWhen, applyWhenValue, createMetadataKey, customError, disabled, email, emailError, form, hidden, listMetadataKey, max, maxError, maxLength, maxLengthError, maxMetadataKey, metadata, min, minError, minLength, minLengthError, minMetadataKey, orMetadataKey, pattern, patternError, readonly, reducedMetadataKey, required, requiredError, schema, standardSchemaError, submit, validate, validateAsync, validateHttp, validateStandardSchema, validateTree };
export type { AsyncValidationResult, AsyncValidatorOptions, ChildFieldContext, DisabledReason, FieldContext, FieldPath, FieldState, FieldTree, FieldValidator, FormCheckboxControl, FormOptions, FormUiControl, FormValueControl, HttpValidatorOptions, IgnoreUnknownProperties, ItemFieldContext, LogicFn, MapToErrorsFn, MaybeFieldPath, MaybeFieldTree, OneOrMany, ReadonlyArrayLike, RemoveStringIndexUnknownKey, RootFieldContext, Schema, SchemaFn, SchemaOrSchemaFn, Subfields, SubmittedStatus, TreeValidationResult, TreeValidator, ValidationError, ValidationErrorWithField, ValidationErrorWithOptionalField, ValidationErrorWithoutField, ValidationResult, ValidationSuccess, Validator, WithField, WithOptionalField, WithoutField };
