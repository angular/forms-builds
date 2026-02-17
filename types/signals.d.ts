/**
 * @license Angular v21.2.0-next.3+sha-9f4c025
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { Signal, ResourceRef, InputSignal, InputSignalWithTransform, ModelSignal, OutputRef, WritableSignal } from '@angular/core';
import { PathKind, SchemaPath, SchemaPathRules, LogicFn, OneOrMany, ValidationError, FieldValidator, FieldContext, TreeValidationResult, TreeValidator, WithOptionalFieldTree, DisabledReason, Debouncer, FieldTree } from './_structure-chunk.js';
export { AsyncValidationResult, BaseNgValidationError, ChildFieldContext, CompatFieldState, CompatSchemaPath, EmailValidationError, FORM_FIELD, Field, FieldState, FormField, FormFieldBindingOptions, FormOptions, FormSubmitOptions, IgnoreUnknownProperties, ItemFieldContext, ItemType, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MaxLengthValidationError, MaxValidationError, MaybeFieldTree, MaybeSchemaPathTree, MetadataKey, MetadataReducer, MetadataSetterType, MinLengthValidationError, MinValidationError, NativeInputParseError, NgValidationError, PATTERN, PatternValidationError, REQUIRED, ReadonlyArrayLike, RemoveStringIndexUnknownKey, RequiredValidationError, RootFieldContext, Schema, SchemaFn, SchemaOrSchemaFn, SchemaPathTree, SignalFormsConfig, StandardSchemaValidationError, Subfields, ValidationErrorOptions, ValidationResult, ValidationSuccess, Validator, WithField, WithFieldTree, WithOptionalField, WithoutField, WithoutFieldTree, apply, applyEach, applyWhen, applyWhenValue, createManagedMetadataKey, createMetadataKey, emailError, form, maxError, maxLengthError, metadata, minError, minLengthError, patternError, provideSignalFormsConfig, requiredError, schema, standardSchemaError, submit, validateStandardSchema, ɵNgFieldDirective } from './_structure-chunk.js';
import { HttpResourceRequest, HttpResourceOptions } from '@angular/common/http';
import '@angular/forms';
import '@standard-schema/spec';

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
declare function disabled<TValue, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, logic?: string | NoInfer<LogicFn<TValue, boolean | string, TPathKind>>): void;

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
declare function hidden<TValue, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, logic: NoInfer<LogicFn<TValue, boolean, TPathKind>>): void;

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
declare function readonly<TValue, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, logic?: NoInfer<LogicFn<TValue, boolean, TPathKind>>): void;

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
 * @see [Signal Form Email Validation](guide/forms/signals/validation#email)
 * @category validation
 * @experimental 21.0.0
 */
declare function email<TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>, config?: BaseValidatorConfig<string, TPathKind>): void;

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
 * @see [Signal Form Max Validation](guide/forms/signals/validation#min-and-max)
 * @category validation
 * @experimental 21.0.0
 */
declare function max<TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<number | string | null, SchemaPathRules.Supported, TPathKind>, maxValue: number | LogicFn<number | string | null, number | undefined, TPathKind>, config?: BaseValidatorConfig<number | string | null, TPathKind>): void;

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
 * @see [Signal Form Max Length Validation](guide/forms/signals/validation#minlength-and-maxlength)
 * @category validation
 * @experimental 21.0.0
 */
declare function maxLength<TValue extends ValueWithLengthOrSize, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, maxLength: number | LogicFn<TValue, number | undefined, TPathKind>, config?: BaseValidatorConfig<TValue, TPathKind>): void;

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
 * @see [Signal Form Min Validation](guide/forms/signals/validation#min-and-max)
 * @category validation
 * @experimental 21.0.0
 */
declare function min<TValue extends number | string | null, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, minValue: number | LogicFn<TValue, number | undefined, TPathKind>, config?: BaseValidatorConfig<TValue, TPathKind>): void;

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
 * @see [Signal Form Min Length Validation](guide/forms/signals/validation#minlength-and-maxlength)
 * @category validation
 * @experimental 21.0.0
 */
declare function minLength<TValue extends ValueWithLengthOrSize, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, minLength: number | LogicFn<TValue, number | undefined, TPathKind>, config?: BaseValidatorConfig<TValue, TPathKind>): void;

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
 * @see [Signal Form Pattern Validation](guide/forms/signals/validation#pattern)
 * @category validation
 * @experimental 21.0.0
 */
declare function pattern<TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>, pattern: RegExp | LogicFn<string | undefined, RegExp | undefined, TPathKind>, config?: BaseValidatorConfig<string, TPathKind>): void;

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
 * @see [Signal Form Required Validation](guide/forms/signals/validation#required)
 * @category validation
 * @experimental 21.0.0
 */
declare function required<TValue, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, config?: BaseValidatorConfig<TValue, TPathKind> & {
    when?: NoInfer<LogicFn<TValue, boolean, TPathKind>>;
}): void;

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
declare function validate<TValue, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, logic: NoInfer<FieldValidator<TValue, TPathKind>>): void;

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
 * @see [Signal Form Async Validation](guide/forms/signals/validation#async-validation)
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
 * @see [Signal Form Async Validation](guide/forms/signals/validation#async-validation)
 * @category validation
 * @experimental 21.0.0
 */
declare function validateAsync<TValue, TParams, TResult, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, opts: AsyncValidatorOptions<TValue, TParams, TResult, TPathKind>): void;

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
 * Adds async validation to the field corresponding to the given path based on an httpResource.
 * Async validation for a field only runs once all synchronous validation is passing.
 *
 * @param path A path indicating the field to bind the async validation logic to.
 * @param opts The http validation options.
 * @template TValue The type of value stored in the field being validated.
 * @template TResult The type of result returned by the httpResource
 * @template TPathKind The kind of path being validated (a root path, child path, or item of an array)
 *
 * @see [Signal Form Async Validation](guide/forms/signals/validation#async-validation)
 * @category validation
 * @experimental 21.0.0
 */
declare function validateHttp<TValue, TResult = unknown, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, opts: HttpValidatorOptions<TValue, TResult, TPathKind>): void;

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
declare function validateTree<TValue, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, logic: NoInfer<TreeValidator<TValue, TPathKind>>): void;

/**
 * The base set of properties shared by all form control contracts.
 *
 * @category control
 * @experimental 21.0.0
 */
interface FormUiControl<TValue> {
    /**
     * An input to receive the errors for the field. If implemented, the `Field` directive will
     * automatically bind errors from the bound field to this input.
     */
    readonly errors?: InputSignal<readonly ValidationError.WithOptionalFieldTree[]> | InputSignalWithTransform<readonly ValidationError.WithOptionalFieldTree[], unknown>;
    /**
     * An input to receive the disabled status for the field. If implemented, the `Field` directive
     * will automatically bind the disabled status from the bound field to this input.
     */
    readonly disabled?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;
    /**
     * An input to receive the reasons for the disablement of the field. If implemented, the `Field`
     * directive will automatically bind the disabled reason from the bound field to this input.
     */
    readonly disabledReasons?: InputSignal<readonly WithOptionalFieldTree<DisabledReason>[]> | InputSignalWithTransform<readonly WithOptionalFieldTree<DisabledReason>[], unknown>;
    /**
     * An input to receive the readonly status for the field. If implemented, the `Field` directive
     * will automatically bind the readonly status from the bound field to this input.
     */
    readonly readonly?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;
    /**
     * An input to receive the hidden status for the field. If implemented, the `Field` directive
     * will automatically bind the hidden status from the bound field to this input.
     */
    readonly hidden?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;
    /**
     * An input to receive the invalid status for the field. If implemented, the `Field` directive
     * will automatically bind the invalid status from the bound field to this input.
     */
    readonly invalid?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;
    /**
     * An input to receive the pending status for the field. If implemented, the `Field` directive
     * will automatically bind the pending status from the bound field to this input.
     */
    readonly pending?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;
    /**
     * An input to receive the touched status for the field. If implemented, the `Field` directive
     * will automatically bind the touched status from the bound field to this input.
     */
    readonly touched?: ModelSignal<boolean> | InputSignal<boolean> | InputSignalWithTransform<boolean, unknown> | OutputRef<boolean>;
    /**
     * An input to receive the dirty status for the field. If implemented, the `Field` directive
     * will automatically bind the dirty status from the bound field to this input.
     */
    readonly dirty?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;
    /**
     * An input to receive the name for the field. If implemented, the `Field` directive will
     * automatically bind the name from the bound field to this input.
     */
    readonly name?: InputSignal<string> | InputSignalWithTransform<string, unknown>;
    /**
     * An input to receive the required status for the field. If implemented, the `Field` directive
     * will automatically bind the required status from the bound field to this input.
     */
    readonly required?: InputSignal<boolean> | InputSignalWithTransform<boolean, unknown>;
    /**
     * An input to receive the min value for the field. If implemented, the `Field` directive will
     * automatically bind the min value from the bound field to this input.
     */
    readonly min?: InputSignal<number | undefined> | InputSignalWithTransform<number | undefined, unknown>;
    /**
     * An input to receive the min length for the field. If implemented, the `Field` directive will
     * automatically bind the min length from the bound field to this input.
     */
    readonly minLength?: InputSignal<number | undefined> | InputSignalWithTransform<number | undefined, unknown>;
    /**
     * An input to receive the max value for the field. If implemented, the `Field` directive will
     * automatically bind the max value from the bound field to this input.
     */
    readonly max?: InputSignal<number | undefined> | InputSignalWithTransform<number | undefined, unknown>;
    /**
     * An input to receive the max length for the field. If implemented, the `Field` directive will
     * automatically bind the max length from the bound field to this input.
     */
    readonly maxLength?: InputSignal<number | undefined> | InputSignalWithTransform<number | undefined, unknown>;
    /**
     * An input to receive the value patterns for the field. If implemented, the `Field` directive
     * will automatically bind the value patterns from the bound field to this input.
     */
    readonly pattern?: InputSignal<readonly RegExp[]> | InputSignalWithTransform<readonly RegExp[], unknown>;
    /**
     * Focuses the UI control.
     *
     * If the focus method is not implemented, Signal Forms will attempt to focus the host element
     * when asked to focus this control.
     */
    focus?(options?: FocusOptions): void;
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
interface FormValueControl<TValue> extends FormUiControl<TValue> {
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
interface FormCheckboxControl extends FormUiControl<boolean> {
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
 * Configures the frequency at which a form field is updated by UI events.
 *
 * When this rule is applied, updates from the UI to the form model will be delayed until either
 * the field is touched, or the most recently debounced update resolves.
 *
 * @param path The target path to debounce.
 * @param durationOrDebouncer Either a debounce duration in milliseconds, or a custom
 *     {@link Debouncer} function.
 *
 * @experimental 21.0.0
 */
declare function debounce<TValue, TPathKind extends PathKind = PathKind.Root>(path: SchemaPath<TValue, SchemaPathRules.Supported, TPathKind>, durationOrDebouncer: number | Debouncer<TValue, TPathKind>): void;

/**
 * Result of parsing a raw value into a model value.
 */
interface ParseResult<TValue> {
    /**
     * The parsed value, if parsing was successful.
     */
    readonly value?: TValue;
    /**
     * Errors encountered during parsing, if any.
     */
    readonly errors?: readonly ValidationError.WithoutFieldTree[];
}
/**
 * Options for `transformedValue`.
 *
 * @experimental 21.2.0
 */
interface TransformedValueOptions<TValue, TRaw> {
    /**
     * Parse the raw value into the model value.
     *
     * Should return an object containing the parsed result, which may contain:
     *   - `value`: The parsed model value. If `undefined`, the model will not be updated.
     *   - `errors`: Any parse errors encountered. If `undefined`, no errors are reported.
     */
    parse: (rawValue: TRaw) => ParseResult<TValue>;
    /**
     * Format the model value into the raw value.
     */
    format: (value: TValue) => TRaw;
}
/**
 * A writable signal representing a "raw" UI value that is synchronized with a model signal
 * via parse/format transformations.
 *
 * @category control
 * @experimental 21.2.0
 */
interface TransformedValueSignal<TRaw> extends WritableSignal<TRaw> {
    /**
     * The current parse errors resulting from the last transformation.
     */
    readonly parseErrors: Signal<readonly ValidationError.WithoutFieldTree[]>;
}
/**
 * Creates a writable signal representing a "raw" UI value that is transformed to/from a model
 * value via `parse` and `format` functions.
 *
 * This utility simplifies the creation of custom form controls that parse a user-facing value
 * representation into an underlying model value. For example, a numeric input that displays and
 * accepts string values but stores a number.
 *
 * @param value The model signal to synchronize with.
 * @param options Configuration including `parse` and `format` functions.
 * @returns A `TransformedValueSignal` representing the raw value with parse error tracking.
 * @experimental 21.2.0
 *
 * @example
 * ```ts
 * @Component({
 *   selector: 'number-input',
 *   template: `<input [value]="rawValue()" (input)="rawValue.set($event.target.value)" />`,
 * })
 * export class NumberInput implements FormValueControl<number | null> {
 *   readonly value = model.required<number | null>();
 *
 *   protected readonly rawValue = transformedValue(this.value, {
 *     parse: (val) => {
 *       if (val === '') return {value: null};
 *       const num = Number(val);
 *       if (Number.isNaN(num)) {
 *         return {errors: [{kind: 'parse', message: `${val} is not numeric`}]};
 *       }
 *       return {value: num};
 *     },
 *     format: (val) => val?.toString() ?? '',
 *   });
 * }
 * ```
 */
declare function transformedValue<TValue, TRaw>(value: ModelSignal<TValue>, options: TransformedValueOptions<TValue, TRaw>): TransformedValueSignal<TRaw>;

/**
 * A directive that binds a `FieldTree` to a `<form>` element.
 *
 * It automatically:
 * 1. Sets `novalidate` on the form element to disable browser validation.
 * 2. Listens for the `submit` event, prevents the default behavior, and calls `submit()` on the
 * `FieldTree`.
 *
 * @usageNotes
 *
 * ```html
 * <form [formRoot]="myFieldTree">
 *   ...
 * </form>
 * ```
 *
 * @publicApi
 * @experimental 21.0.0
 */
declare class FormRoot<T> {
    readonly fieldTree: i0.InputSignal<FieldTree<T>>;
    protected onSubmit(event: Event): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormRoot<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormRoot<any>, "form[formRoot]", never, { "fieldTree": { "alias": "formRoot"; "required": true; "isSignal": true; }; }, {}, never, never, true, never>;
}

export { Debouncer, DisabledReason, FieldContext, FieldTree, FieldValidator, FormRoot, LogicFn, OneOrMany, PathKind, SchemaPath, SchemaPathRules, TreeValidationResult, TreeValidator, ValidationError, WithOptionalFieldTree, debounce, disabled, email, hidden, max, maxLength, min, minLength, pattern, readonly, required, transformedValue, validate, validateAsync, validateHttp, validateTree };
export type { AsyncValidatorOptions, FormCheckboxControl, FormUiControl, FormValueControl, HttpValidatorOptions, MapToErrorsFn, ParseResult, TransformedValueOptions, TransformedValueSignal };
