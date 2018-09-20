import * as i0 from '@angular/core';
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnChanges, SimpleChanges, StaticProvider } from '@angular/core';
import { Observable } from 'rxjs';
import { AbstractControl } from '../model';
/**
 * @description
 * Defines the map of errors returned from failed validation checks
 *
 * @experimental
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
 *   validate(c: AbstractControl): ValidationErrors|null {
 *     return {'custom': true};
 *   }
 * }
 * ```
 */
export interface Validator {
    /**
     * @description
     * Method that performs synchronous validation against the provided control.
     *
     * @param c The control to validate against.
     *
     * @returns A map of validation errors if validation fails,
     * otherwise null.
     */
    validate(c: AbstractControl): ValidationErrors | null;
    /**
     * @description
     * Registers a callback function to call when the validator inputs change.
     *
     * @param fn The callback function
     */
    registerOnValidatorChange?(fn: () => void): void;
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
 * import { of as observableOf } from 'rxjs';
 *
 * @Directive({
 *   selector: '[customAsyncValidator]',
 *   providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 * true}]
 * })
 * class CustomAsyncValidatorDirective implements AsyncValidator {
 *   validate(c: AbstractControl): Observable<ValidationErrors|null> {
 *     return observableOf({'custom': true});
 *   }
 * }
 * ```
 *
 * @experimental
 */
export interface AsyncValidator extends Validator {
    /**
     * @description
     * Method that performs async validation against the provided control.
     *
     * @param c The control to validate against.
     *
     * @returns A promise or observable that resolves a map of validation errors
     * if validation fails, otherwise null.
     */
    validate(c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}
export declare const REQUIRED_VALIDATOR: StaticProvider;
export declare const CHECKBOX_REQUIRED_VALIDATOR: StaticProvider;
/**
 * A Directive that adds the `required` validator to any controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * ### Example
 *
 * ```
 * <input name="fullName" ngModel required>
 * ```
 *
 *
 */
export declare class RequiredValidator implements Validator {
    private _required;
    private _onChange;
    required: boolean | string;
    validate(c: AbstractControl): ValidationErrors | null;
    registerOnValidatorChange(fn: () => void): void;
    static ngDirectiveDef: i0.ɵDirectiveDef<RequiredValidator, ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]'>;
}
/**
 * A Directive that adds the `required` validator to checkbox controls marked with the
 * `required` attribute, via the `NG_VALIDATORS` binding.
 *
 * ### Example
 *
 * ```
 * <input type="checkbox" name="active" ngModel required>
 * ```
 *
 * @experimental
 */
export declare class CheckboxRequiredValidator extends RequiredValidator {
    validate(c: AbstractControl): ValidationErrors | null;
    static ngDirectiveDef: i0.ɵDirectiveDef<CheckboxRequiredValidator, 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]'>;
}
/**
 * Provider which adds `EmailValidator` to `NG_VALIDATORS`.
 */
export declare const EMAIL_VALIDATOR: any;
/**
 * A Directive that adds the `email` validator to controls marked with the
 * `email` attribute, via the `NG_VALIDATORS` binding.
 *
 * ### Example
 *
 * ```
 * <input type="email" name="email" ngModel email>
 * <input type="email" name="email" ngModel email="true">
 * <input type="email" name="email" ngModel [email]="true">
 * ```
 *
 * @experimental
 */
export declare class EmailValidator implements Validator {
    private _enabled;
    private _onChange;
    email: boolean | string;
    validate(c: AbstractControl): ValidationErrors | null;
    registerOnValidatorChange(fn: () => void): void;
    static ngDirectiveDef: i0.ɵDirectiveDef<EmailValidator, '[email][formControlName],[email][formControl],[email][ngModel]'>;
}
export interface ValidatorFn {
    (c: AbstractControl): ValidationErrors | null;
}
export interface AsyncValidatorFn {
    (c: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
}
/**
 * Provider which adds `MinLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='min'}
 */
export declare const MIN_LENGTH_VALIDATOR: any;
/**
 * A directive which installs the `MinLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `minlength` attribute.
 *
 *
 */
export declare class MinLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange;
    minlength: string;
    ngOnChanges(changes: SimpleChanges): void;
    validate(c: AbstractControl): ValidationErrors | null;
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
    static ngDirectiveDef: i0.ɵDirectiveDef<MinLengthValidator, '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]'>;
}
/**
 * Provider which adds `MaxLengthValidator` to `NG_VALIDATORS`.
 *
 * ## Example:
 *
 * {@example common/forms/ts/validators/validators.ts region='max'}
 */
export declare const MAX_LENGTH_VALIDATOR: any;
/**
 * A directive which installs the `MaxLengthValidator` for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `maxlength` attribute.
 *
 *
 */
export declare class MaxLengthValidator implements Validator, OnChanges {
    private _validator;
    private _onChange;
    maxlength: string;
    ngOnChanges(changes: SimpleChanges): void;
    validate(c: AbstractControl): ValidationErrors | null;
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
    static ngDirectiveDef: i0.ɵDirectiveDef<MaxLengthValidator, '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]'>;
}
export declare const PATTERN_VALIDATOR: any;
/**
 * A Directive that adds the `pattern` validator to any controls marked with the
 * `pattern` attribute, via the `NG_VALIDATORS` binding. Uses attribute value
 * as the regex to validate Control value against.  Follows pattern attribute
 * semantics; i.e. regex must match entire Control value.
 *
 * ### Example
 *
 * ```
 * <input [name]="fullName" pattern="[a-zA-Z ]*" ngModel>
 * ```
 *
 */
export declare class PatternValidator implements Validator, OnChanges {
    private _validator;
    private _onChange;
    pattern: string | RegExp;
    ngOnChanges(changes: SimpleChanges): void;
    validate(c: AbstractControl): ValidationErrors | null;
    registerOnValidatorChange(fn: () => void): void;
    private _createValidator;
    static ngDirectiveDef: i0.ɵDirectiveDef<PatternValidator, '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]'>;
}
