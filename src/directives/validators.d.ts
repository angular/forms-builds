/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnChanges, SimpleChanges, StaticProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractControl } from '../model';
import * as i0 from "@angular/core";
/**
 * @description
 * Defines the map of errors returned from failed validation checks.
 *
 * @publicApi
 */
export declare type ValidationErrors = {
    [key: string]: any;
};
/**
 * @description
 * An interface implemented by classes that perform synchronous validation.
 *
 * @usageNotes
 *
 * ### Provide a custom validator
 *
 * The following example implements the `Validator` interface to create a
 * validator directive with a custom error key.
 *
 * ```typescript
 * @Directive({
 *   selector: '[customValidator]',
 *   providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 * })
 * class CustomValidatorDirective implements Validator {
 *   validate(control: AbstractControl): ValidationErrors|null {
 *     return {'custom': true};
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export interface Validator {
    /**
     * @description
     * Method that performs synchronous validation against the provided control.
     *
     * @param control The control to validate against.
     *
     * @returns A map of validation errors if validation fails,
     * otherwise null.
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange?(fn: () => void): void;
}
/**
 * A base class for Validator-based Directives. The class contains common logic shared across such
 * Directives.
 *
 * For internal use only, this class is not intended for use outside of the Forms package.
 */
declare abstract class AbstractValidatorDirective implements Validator {
    private _validator;
    private _onChange;
    /**
     * Helper function invoked from child classes to process changes (from `ngOnChanges` hook).
     * @nodoc
     */
    handleChanges(changes: SimpleChanges): void;
    /** @nodoc */
    validate(control: AbstractControl): ValidationErrors | null;
    /** @nodoc */
    registerOnValidatorChange(fn: () => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractValidatorDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AbstractValidatorDirective, never, never, {}, {}, never>;
}
/**
 * @description
 * Provider which adds `MaxValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const MAX_VALIDATOR: StaticProvider;
/**
 * A directive which installs the {@link MaxValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `max` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a max validator
 *
 * The following example shows how to add a max validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel max="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MaxValidator extends AbstractValidatorDirective implements OnChanges {
    /**
     * @description
     * Tracks changes to the max bound to this directive.
     */
    max: string | number;
    /**
     * Declare `ngOnChanges` lifecycle hook at the main directive level (vs keeping it in base class)
     * to avoid differences in handling inheritance of lifecycle hooks between Ivy and ViewEngine in
     * AOT mode. This could be refactored once ViewEngine is removed.
     * @nodoc
     */
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaxValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MaxValidator, "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", never, { "max": "max"; }, {}, never>;
}
/**
 * @description
 * Provider which adds `MinValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const MIN_VALIDATOR: StaticProvider;
/**
 * A directive which installs the {@link MinValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `min` attribute.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a min validator
 *
 * The following example shows how to add a min validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input type="number" ngModel min="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MinValidator extends AbstractValidatorDirective implements OnChanges {
    /**
     * @description
     * Tracks changes to the min bound to this directive.
     */
    min: string | number;
    /**
     * Declare `ngOnChanges` lifecycle hook at the main directive level (vs keeping it in base class)
     * to avoid differences in handling inheritance of lifecycle hooks between Ivy and ViewEngine in
     * AOT mode. This could be refactored once ViewEngine is removed.
     * @nodoc
     */
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MinValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MinValidator, "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", never, { "min": "min"; }, {}, never>;
}
/**
 * @description
 * An interface implemented by classes that perform asynchronous validation.
 *
 * @usageNotes
 *
 * ### Provide a custom async validator directive
 *
 * The following example implements the `AsyncValidator` interface to create an
 * async validator directive with a custom error key.
 *
 * ```typescript
 * import { of } from 'rxjs';
 *
 * @Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(control: AbstractControl): Observable<ValidationErrors|null> {
 *     return of({'custom': true});
 *   }
 * }
 * ```
 *
 * @publicApi
 */
export interface AsyncValidator extends Validator {
    /**
     * @description
     * Method that performs async validation against the provided control.
     *
     * @param control The control to validate against.
     *
     * @returns A promise or observable that resolves a map of validation errors
     * if validation fails, otherwise null.
     */
    validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}
/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const REQUIRED_VALIDATOR: StaticProvider;
/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const CHECKBOX_REQUIRED_VALIDATOR: StaticProvider;
/**
 * @description
 * A directive that adds the `required` validator to any controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required validator using template-driven forms
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
export declare class RequiredValidator implements Validator {
    private _required;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the required attribute bound to this directive.
     */
    get required(): boolean | string;
    set required(value: boolean | string);
    /**
     * Method that validates whether the control is empty.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RequiredValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<RequiredValidator, ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", never, { "required": "required"; }, {}, never>;
}
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a required checkbox validator using template-driven forms
 *
 * The following example shows how to add a checkbox required validator to an input attached to an
 * ngModel binding.
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
export declare class CheckboxRequiredValidator extends RequiredValidator {
    /**
     * Method that validates whether or not the checkbox has been checked.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<CheckboxRequiredValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CheckboxRequiredValidator, "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", never, {}, {}, never>;
}
/**
 * @description
 * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const EMAIL_VALIDATOR: any;
/**
 * A directive that adds the `email` validator to controls marked with the
 * `email` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding an email validator
 *
 * The following example shows how to add an email validator to an input attached to an ngModel
 * binding.
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
export declare class EmailValidator implements Validator {
    private _enabled;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the email attribute bound to this directive.
     */
    set email(value: boolean | string);
    /**
     * Method that validates whether an email address is valid.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmailValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<EmailValidator, "[email][formControlName],[email][formControl],[email][ngModel]", never, { "email": "email"; }, {}, never>;
}
/**
 * @description
 * A function that receives a control and synchronously returns a map of
 * validation errors if present, otherwise null.
 *
 * @publicApi
 */
export interface ValidatorFn {
    (control: AbstractControl): ValidationErrors | null;
}
/**
 * @description
 * A function that receives a control and returns a Promise or observable
 * that emits validation errors if present, otherwise null.
 *
 * @publicApi
 */
export interface AsyncValidatorFn {
    (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}
/**
 * @description
 * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const MIN_LENGTH_VALIDATOR: any;
/**
 * A directive that adds minimum length validation to controls marked with the
 * `minlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a minimum length validator
 *
 * The following example shows how to add a minimum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel minlength="4">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MinLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the minimum length bound to this directive.
     */
    minlength: string | number;
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Method that validates whether the value meets a minimum length requirement.
     * Returns the validation result if enabled, otherwise null.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
    static ɵfac: i0.ɵɵFactoryDeclaration<MinLengthValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MinLengthValidator, "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", never, { "minlength": "minlength"; }, {}, never>;
}
/**
 * @description
 * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const MAX_LENGTH_VALIDATOR: any;
/**
 * A directive that adds max length validation to controls marked with the
 * `maxlength` attribute. The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a maximum length validator
 *
 * The following example shows how to add a maximum length validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel maxlength="25">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class MaxLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the maximum length bound to this directive.
     */
    maxlength: string | number;
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Method that validates whether the value exceeds the maximum length requirement.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaxLengthValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MaxLengthValidator, "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", never, { "maxlength": "maxlength"; }, {}, never>;
}
/**
 * @description
 * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export declare const PATTERN_VALIDATOR: any;
/**
 * @description
 * A directive that adds regex pattern validation to controls marked with the
 * `pattern` attribute. The regex must match the entire control value.
 * The directive is provided with the `NG_VALIDATORS` multi-provider list.
 *
 * @see [Form Validation](guide/form-validation)
 *
 * @usageNotes
 *
 * ### Adding a pattern validator
 *
 * The following example shows how to add a pattern validator to an input attached to an
 * ngModel binding.
 *
 * ```html
 * <input name="firstName" ngModel pattern="[a-zA-Z ]*">
 * ```
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
export declare class PatternValidator implements Validator, OnChanges {
    private _validator;
    private _onChange?;
    /**
     * @description
     * Tracks changes to the pattern bound to this directive.
     */
    pattern: string | RegExp;
    /** @nodoc */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Method that validates whether the value matches the pattern requirement.
     * @nodoc
     */
    validate(control: AbstractControl): ValidationErrors | null;
    /**
     * Registers a callback function to call when the validator inputs change.
     * @nodoc
     */
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
    static ɵfac: i0.ɵɵFactoryDeclaration<PatternValidator, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PatternValidator, "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", never, { "pattern": "pattern"; }, {}, never>;
}
export {};
