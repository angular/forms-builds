/**
 * @license Angular v21.0.0-rc.0+sha-20b4b2c
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { Directive, InjectionToken, forwardRef, Optional, Inject, ɵisPromise as _isPromise, ɵisSubscribable as _isSubscribable, ɵRuntimeError as _RuntimeError, Self, untracked, computed, signal, EventEmitter, Input, Host, SkipSelf, booleanAttribute, ChangeDetectorRef, Output, Injectable, inject, ApplicationRef, DestroyRef, afterNextRender, NgModule, Version } from '@angular/core';
import { ɵgetDOM as _getDOM } from '@angular/common';
import { forkJoin, from, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

class BaseControlValueAccessor {
  _renderer;
  _elementRef;
  onChange = _ => {};
  onTouched = () => {};
  constructor(_renderer, _elementRef) {
    this._renderer = _renderer;
    this._elementRef = _elementRef;
  }
  setProperty(key, value) {
    this._renderer.setProperty(this._elementRef.nativeElement, key, value);
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  setDisabledState(isDisabled) {
    this.setProperty('disabled', isDisabled);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: BaseControlValueAccessor,
    deps: [{
      token: i0.Renderer2
    }, {
      token: i0.ElementRef
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: BaseControlValueAccessor,
    isStandalone: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: BaseControlValueAccessor,
  decorators: [{
    type: Directive
  }],
  ctorParameters: () => [{
    type: i0.Renderer2
  }, {
    type: i0.ElementRef
  }]
});
class BuiltInControlValueAccessor extends BaseControlValueAccessor {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: BuiltInControlValueAccessor,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: BuiltInControlValueAccessor,
    isStandalone: true,
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: BuiltInControlValueAccessor,
  decorators: [{
    type: Directive
  }]
});
const NG_VALUE_ACCESSOR = new InjectionToken(typeof ngDevMode !== undefined && ngDevMode ? 'NgValueAccessor' : '');

const CHECKBOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxControlValueAccessor),
  multi: true
};
class CheckboxControlValueAccessor extends BuiltInControlValueAccessor {
  writeValue(value) {
    this.setProperty('checked', value);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: CheckboxControlValueAccessor,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: CheckboxControlValueAccessor,
    isStandalone: false,
    selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]",
    host: {
      listeners: {
        "change": "onChange($any($event.target).checked)",
        "blur": "onTouched()"
      }
    },
    providers: [CHECKBOX_VALUE_ACCESSOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: CheckboxControlValueAccessor,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]',
      host: {
        '(change)': 'onChange($any($event.target).checked)',
        '(blur)': 'onTouched()'
      },
      providers: [CHECKBOX_VALUE_ACCESSOR],
      standalone: false
    }]
  }]
});

const DEFAULT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DefaultValueAccessor),
  multi: true
};
function _isAndroid() {
  const userAgent = _getDOM() ? _getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}
const COMPOSITION_BUFFER_MODE = new InjectionToken(typeof ngDevMode !== undefined && ngDevMode ? 'CompositionEventMode' : '');
class DefaultValueAccessor extends BaseControlValueAccessor {
  _compositionMode;
  _composing = false;
  constructor(renderer, elementRef, _compositionMode) {
    super(renderer, elementRef);
    this._compositionMode = _compositionMode;
    if (this._compositionMode == null) {
      this._compositionMode = !_isAndroid();
    }
  }
  writeValue(value) {
    const normalizedValue = value == null ? '' : value;
    this.setProperty('value', normalizedValue);
  }
  _handleInput(value) {
    if (!this._compositionMode || this._compositionMode && !this._composing) {
      this.onChange(value);
    }
  }
  _compositionStart() {
    this._composing = true;
  }
  _compositionEnd(value) {
    this._composing = false;
    this._compositionMode && this.onChange(value);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: DefaultValueAccessor,
    deps: [{
      token: i0.Renderer2
    }, {
      token: i0.ElementRef
    }, {
      token: COMPOSITION_BUFFER_MODE,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: DefaultValueAccessor,
    isStandalone: false,
    selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]",
    host: {
      listeners: {
        "input": "_handleInput($any($event.target).value)",
        "blur": "onTouched()",
        "compositionstart": "_compositionStart()",
        "compositionend": "_compositionEnd($any($event.target).value)"
      }
    },
    providers: [DEFAULT_VALUE_ACCESSOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: DefaultValueAccessor,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]',
      host: {
        '(input)': '_handleInput($any($event.target).value)',
        '(blur)': 'onTouched()',
        '(compositionstart)': '_compositionStart()',
        '(compositionend)': '_compositionEnd($any($event.target).value)'
      },
      providers: [DEFAULT_VALUE_ACCESSOR],
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: i0.Renderer2
  }, {
    type: i0.ElementRef
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [COMPOSITION_BUFFER_MODE]
    }]
  }]
});

function isEmptyInputValue(value) {
  return value == null || lengthOrSize(value) === 0;
}
function lengthOrSize(value) {
  if (value == null) {
    return null;
  } else if (Array.isArray(value) || typeof value === 'string') {
    return value.length;
  } else if (value instanceof Set) {
    return value.size;
  }
  return null;
}
const NG_VALIDATORS = new InjectionToken(typeof ngDevMode !== undefined && ngDevMode ? 'NgValidators' : '');
const NG_ASYNC_VALIDATORS = new InjectionToken(typeof ngDevMode !== undefined && ngDevMode ? 'NgAsyncValidators' : '');
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
class Validators {
  static min(min) {
    return minValidator(min);
  }
  static max(max) {
    return maxValidator(max);
  }
  static required(control) {
    return requiredValidator(control);
  }
  static requiredTrue(control) {
    return requiredTrueValidator(control);
  }
  static email(control) {
    return emailValidator(control);
  }
  static minLength(minLength) {
    return minLengthValidator(minLength);
  }
  static maxLength(maxLength) {
    return maxLengthValidator(maxLength);
  }
  static pattern(pattern) {
    return patternValidator(pattern);
  }
  static nullValidator(control) {
    return nullValidator();
  }
  static compose(validators) {
    return compose(validators);
  }
  static composeAsync(validators) {
    return composeAsync(validators);
  }
}
function minValidator(min) {
  return control => {
    if (control.value == null || min == null) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value < min ? {
      'min': {
        'min': min,
        'actual': control.value
      }
    } : null;
  };
}
function maxValidator(max) {
  return control => {
    if (control.value == null || max == null) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value > max ? {
      'max': {
        'max': max,
        'actual': control.value
      }
    } : null;
  };
}
function requiredValidator(control) {
  return isEmptyInputValue(control.value) ? {
    'required': true
  } : null;
}
function requiredTrueValidator(control) {
  return control.value === true ? null : {
    'required': true
  };
}
function emailValidator(control) {
  if (isEmptyInputValue(control.value)) {
    return null;
  }
  return EMAIL_REGEXP.test(control.value) ? null : {
    'email': true
  };
}
function minLengthValidator(minLength) {
  return control => {
    const length = control.value?.length ?? lengthOrSize(control.value);
    if (length === null || length === 0) {
      return null;
    }
    return length < minLength ? {
      'minlength': {
        'requiredLength': minLength,
        'actualLength': length
      }
    } : null;
  };
}
function maxLengthValidator(maxLength) {
  return control => {
    const length = control.value?.length ?? lengthOrSize(control.value);
    if (length !== null && length > maxLength) {
      return {
        'maxlength': {
          'requiredLength': maxLength,
          'actualLength': length
        }
      };
    }
    return null;
  };
}
function patternValidator(pattern) {
  if (!pattern) return nullValidator;
  let regex;
  let regexStr;
  if (typeof pattern === 'string') {
    regexStr = '';
    if (pattern.charAt(0) !== '^') regexStr += '^';
    regexStr += pattern;
    if (pattern.charAt(pattern.length - 1) !== '$') regexStr += '$';
    regex = new RegExp(regexStr);
  } else {
    regexStr = pattern.toString();
    regex = pattern;
  }
  return control => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    const value = control.value;
    return regex.test(value) ? null : {
      'pattern': {
        'requiredPattern': regexStr,
        'actualValue': value
      }
    };
  };
}
function nullValidator(control) {
  return null;
}
function isPresent(o) {
  return o != null;
}
function toObservable(value) {
  const obs = _isPromise(value) ? from(value) : value;
  if ((typeof ngDevMode === 'undefined' || ngDevMode) && !_isSubscribable(obs)) {
    let errorMessage = `Expected async validator to return Promise or Observable.`;
    if (typeof value === 'object') {
      errorMessage += ' Are you using a synchronous validator where an async validator is expected?';
    }
    throw new _RuntimeError(-1101, errorMessage);
  }
  return obs;
}
function mergeErrors(arrayOfErrors) {
  let res = {};
  arrayOfErrors.forEach(errors => {
    res = errors != null ? {
      ...res,
      ...errors
    } : res;
  });
  return Object.keys(res).length === 0 ? null : res;
}
function executeValidators(control, validators) {
  return validators.map(validator => validator(control));
}
function isValidatorFn(validator) {
  return !validator.validate;
}
function normalizeValidators(validators) {
  return validators.map(validator => {
    return isValidatorFn(validator) ? validator : c => validator.validate(c);
  });
}
function compose(validators) {
  if (!validators) return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0) return null;
  return function (control) {
    return mergeErrors(executeValidators(control, presentValidators));
  };
}
function composeValidators(validators) {
  return validators != null ? compose(normalizeValidators(validators)) : null;
}
function composeAsync(validators) {
  if (!validators) return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0) return null;
  return function (control) {
    const observables = executeValidators(control, presentValidators).map(toObservable);
    return forkJoin(observables).pipe(map(mergeErrors));
  };
}
function composeAsyncValidators(validators) {
  return validators != null ? composeAsync(normalizeValidators(validators)) : null;
}
function mergeValidators(controlValidators, dirValidator) {
  if (controlValidators === null) return [dirValidator];
  return Array.isArray(controlValidators) ? [...controlValidators, dirValidator] : [controlValidators, dirValidator];
}
function getControlValidators(control) {
  return control._rawValidators;
}
function getControlAsyncValidators(control) {
  return control._rawAsyncValidators;
}
function makeValidatorsArray(validators) {
  if (!validators) return [];
  return Array.isArray(validators) ? validators : [validators];
}
function hasValidator(validators, validator) {
  return Array.isArray(validators) ? validators.includes(validator) : validators === validator;
}
function addValidators(validators, currentValidators) {
  const current = makeValidatorsArray(currentValidators);
  const validatorsToAdd = makeValidatorsArray(validators);
  validatorsToAdd.forEach(v => {
    if (!hasValidator(current, v)) {
      current.push(v);
    }
  });
  return current;
}
function removeValidators(validators, currentValidators) {
  return makeValidatorsArray(currentValidators).filter(v => !hasValidator(validators, v));
}

class AbstractControlDirective {
  get value() {
    return this.control ? this.control.value : null;
  }
  get valid() {
    return this.control ? this.control.valid : null;
  }
  get invalid() {
    return this.control ? this.control.invalid : null;
  }
  get pending() {
    return this.control ? this.control.pending : null;
  }
  get disabled() {
    return this.control ? this.control.disabled : null;
  }
  get enabled() {
    return this.control ? this.control.enabled : null;
  }
  get errors() {
    return this.control ? this.control.errors : null;
  }
  get pristine() {
    return this.control ? this.control.pristine : null;
  }
  get dirty() {
    return this.control ? this.control.dirty : null;
  }
  get touched() {
    return this.control ? this.control.touched : null;
  }
  get status() {
    return this.control ? this.control.status : null;
  }
  get untouched() {
    return this.control ? this.control.untouched : null;
  }
  get statusChanges() {
    return this.control ? this.control.statusChanges : null;
  }
  get valueChanges() {
    return this.control ? this.control.valueChanges : null;
  }
  get path() {
    return null;
  }
  _composedValidatorFn;
  _composedAsyncValidatorFn;
  _rawValidators = [];
  _rawAsyncValidators = [];
  _setValidators(validators) {
    this._rawValidators = validators || [];
    this._composedValidatorFn = composeValidators(this._rawValidators);
  }
  _setAsyncValidators(validators) {
    this._rawAsyncValidators = validators || [];
    this._composedAsyncValidatorFn = composeAsyncValidators(this._rawAsyncValidators);
  }
  get validator() {
    return this._composedValidatorFn || null;
  }
  get asyncValidator() {
    return this._composedAsyncValidatorFn || null;
  }
  _onDestroyCallbacks = [];
  _registerOnDestroy(fn) {
    this._onDestroyCallbacks.push(fn);
  }
  _invokeOnDestroyCallbacks() {
    this._onDestroyCallbacks.forEach(fn => fn());
    this._onDestroyCallbacks = [];
  }
  reset(value = undefined) {
    if (this.control) this.control.reset(value);
  }
  hasError(errorCode, path) {
    return this.control ? this.control.hasError(errorCode, path) : false;
  }
  getError(errorCode, path) {
    return this.control ? this.control.getError(errorCode, path) : null;
  }
}

class ControlContainer extends AbstractControlDirective {
  name;
  get formDirective() {
    return null;
  }
  get path() {
    return null;
  }
}

class NgControl extends AbstractControlDirective {
  _parent = null;
  name = null;
  valueAccessor = null;
}

class AbstractControlStatus {
  _cd;
  constructor(cd) {
    this._cd = cd;
  }
  get isTouched() {
    this._cd?.control?._touched?.();
    return !!this._cd?.control?.touched;
  }
  get isUntouched() {
    return !!this._cd?.control?.untouched;
  }
  get isPristine() {
    this._cd?.control?._pristine?.();
    return !!this._cd?.control?.pristine;
  }
  get isDirty() {
    return !!this._cd?.control?.dirty;
  }
  get isValid() {
    this._cd?.control?._status?.();
    return !!this._cd?.control?.valid;
  }
  get isInvalid() {
    return !!this._cd?.control?.invalid;
  }
  get isPending() {
    return !!this._cd?.control?.pending;
  }
  get isSubmitted() {
    this._cd?._submitted?.();
    return !!this._cd?.submitted;
  }
}
const ngControlStatusHost = {
  '[class.ng-untouched]': 'isUntouched',
  '[class.ng-touched]': 'isTouched',
  '[class.ng-pristine]': 'isPristine',
  '[class.ng-dirty]': 'isDirty',
  '[class.ng-valid]': 'isValid',
  '[class.ng-invalid]': 'isInvalid',
  '[class.ng-pending]': 'isPending'
};
const ngGroupStatusHost = {
  ...ngControlStatusHost,
  '[class.ng-submitted]': 'isSubmitted'
};
class NgControlStatus extends AbstractControlStatus {
  constructor(cd) {
    super(cd);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NgControlStatus,
    deps: [{
      token: NgControl,
      self: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: NgControlStatus,
    isStandalone: false,
    selector: "[formControlName],[ngModel],[formControl]",
    host: {
      properties: {
        "class.ng-untouched": "isUntouched",
        "class.ng-touched": "isTouched",
        "class.ng-pristine": "isPristine",
        "class.ng-dirty": "isDirty",
        "class.ng-valid": "isValid",
        "class.ng-invalid": "isInvalid",
        "class.ng-pending": "isPending"
      }
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NgControlStatus,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formControlName],[ngModel],[formControl]',
      host: ngControlStatusHost,
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: NgControl,
    decorators: [{
      type: Self
    }]
  }]
});
class NgControlStatusGroup extends AbstractControlStatus {
  constructor(cd) {
    super(cd);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NgControlStatusGroup,
    deps: [{
      token: ControlContainer,
      optional: true,
      self: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: NgControlStatusGroup,
    isStandalone: false,
    selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]",
    host: {
      properties: {
        "class.ng-untouched": "isUntouched",
        "class.ng-touched": "isTouched",
        "class.ng-pristine": "isPristine",
        "class.ng-dirty": "isDirty",
        "class.ng-valid": "isValid",
        "class.ng-invalid": "isInvalid",
        "class.ng-pending": "isPending",
        "class.ng-submitted": "isSubmitted"
      }
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NgControlStatusGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],[formArray],form:not([ngNoForm]),[ngForm]',
      host: ngGroupStatusHost,
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }]
  }]
});

const formControlNameExample = `
  <div [formGroup]="myGroup">
    <input formControlName="firstName">
  </div>

  In your class:

  this.myGroup = new FormGroup({
      firstName: new FormControl()
  });`;
const formGroupNameExample = `
  <div [formGroup]="myGroup">
      <div formGroupName="person">
        <input formControlName="firstName">
      </div>
  </div>

  In your class:

  this.myGroup = new FormGroup({
      person: new FormGroup({ firstName: new FormControl() })
  });`;
const formArrayNameExample = `
  <div [formGroup]="myGroup">
    <div formArrayName="cities">
      <div *ngFor="let city of cityArray.controls; index as i">
        <input [formControlName]="i">
      </div>
    </div>
  </div>

  In your class:

  this.cityArray = new FormArray([new FormControl('SF')]);
  this.myGroup = new FormGroup({
    cities: this.cityArray
  });`;
const ngModelGroupExample = `
  <form>
      <div ngModelGroup="person">
        <input [(ngModel)]="person.name" name="firstName">
      </div>
  </form>`;
const ngModelWithFormGroupExample = `
  <div [formGroup]="myGroup">
      <input formControlName="firstName">
      <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
  </div>
`;

function controlParentException(nameOrIndex) {
  return new _RuntimeError(1050, `formControlName must be used with a parent formGroup or formArray directive.  You'll want to add a formGroup/formArray
      directive and pass it an existing FormGroup/FormArray instance (you can create one in your class).

      ${describeFormControl(nameOrIndex)}

    Example:

    ${formControlNameExample}`);
}
function describeFormControl(nameOrIndex) {
  if (nameOrIndex == null || nameOrIndex === '') {
    return '';
  }
  const valueType = typeof nameOrIndex === 'string' ? 'name' : 'index';
  return `Affected Form Control ${valueType}: "${nameOrIndex}"`;
}
function ngModelGroupException() {
  return new _RuntimeError(1051, `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
      that also have a "form" prefix: formGroupName, formArrayName, or formGroup.

      Option 1:  Update the parent to be formGroupName (reactive form strategy)

      ${formGroupNameExample}

      Option 2: Use ngModel instead of formControlName (template-driven strategy)

      ${ngModelGroupExample}`);
}
function missingFormException() {
  return new _RuntimeError(1052, `formGroup expects a FormGroup instance. Please pass one in.

      Example:

      ${formControlNameExample}`);
}
function groupParentException() {
  return new _RuntimeError(1053, `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
    directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formGroupNameExample}`);
}
function arrayParentException() {
  return new _RuntimeError(1054, `formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${formArrayNameExample}`);
}
const disabledAttrWarning = `
  It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
  when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
  you. We recommend using this approach to avoid 'changed after checked' errors.

  Example:
  // Specify the \`disabled\` property at control creation time:
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });

  // Controls can also be enabled/disabled after creation:
  form.get('first')?.enable();
  form.get('last')?.disable();
`;
const asyncValidatorsDroppedWithOptsWarning = `
  It looks like you're constructing using a FormControl with both an options argument and an
  async validators argument. Mixing these arguments will cause your async validators to be dropped.
  You should either put all your validators in the options object, or in separate validators
  arguments. For example:

  // Using validators arguments
  fc = new FormControl(42, Validators.required, myAsyncValidator);

  // Using AbstractControlOptions
  fc = new FormControl(42, {validators: Validators.required, asyncValidators: myAV});

  // Do NOT mix them: async validators will be dropped!
  fc = new FormControl(42, {validators: Validators.required}, /* Oops! */ myAsyncValidator);
`;
function ngModelWarning(directiveName) {
  return `
  It looks like you're using ngModel on the same form field as ${directiveName}.
  Support for using the ngModel input property and ngModelChange event with
  reactive form directives has been deprecated in Angular v6 and will be removed
  in a future version of Angular.

  For more information on this, see our API docs here:
  https://angular.io/api/forms/${directiveName === 'formControl' ? 'FormControlDirective' : 'FormControlName'}#use-with-ngmodel
  `;
}
function describeKey(isFormGroup, key) {
  return isFormGroup ? `with name: '${key}'` : `at index: ${key}`;
}
function noControlsError(isFormGroup) {
  return `
    There are no form controls registered with this ${isFormGroup ? 'group' : 'array'} yet. If you're using ngModel,
    you may want to check next tick (e.g. use setTimeout).
  `;
}
function missingControlError(isFormGroup, key) {
  return `Cannot find form control ${describeKey(isFormGroup, key)}`;
}
function missingControlValueError(isFormGroup, key) {
  return `Must supply a value for form control ${describeKey(isFormGroup, key)}`;
}

const VALID = 'VALID';
const INVALID = 'INVALID';
const PENDING = 'PENDING';
const DISABLED = 'DISABLED';
class ControlEvent {}
class ValueChangeEvent extends ControlEvent {
  value;
  source;
  constructor(value, source) {
    super();
    this.value = value;
    this.source = source;
  }
}
class PristineChangeEvent extends ControlEvent {
  pristine;
  source;
  constructor(pristine, source) {
    super();
    this.pristine = pristine;
    this.source = source;
  }
}
class TouchedChangeEvent extends ControlEvent {
  touched;
  source;
  constructor(touched, source) {
    super();
    this.touched = touched;
    this.source = source;
  }
}
class StatusChangeEvent extends ControlEvent {
  status;
  source;
  constructor(status, source) {
    super();
    this.status = status;
    this.source = source;
  }
}
class FormSubmittedEvent extends ControlEvent {
  source;
  constructor(source) {
    super();
    this.source = source;
  }
}
class FormResetEvent extends ControlEvent {
  source;
  constructor(source) {
    super();
    this.source = source;
  }
}
function pickValidators(validatorOrOpts) {
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}
function coerceToValidator(validator) {
  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function pickAsyncValidators(asyncValidator, validatorOrOpts) {
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    if (isOptionsObj(validatorOrOpts) && asyncValidator) {
      console.warn(asyncValidatorsDroppedWithOptsWarning);
    }
  }
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
function coerceToAsyncValidator(asyncValidator) {
  return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) : asyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) && typeof validatorOrOpts === 'object';
}
function assertControlPresent(parent, isGroup, key) {
  const controls = parent.controls;
  const collection = isGroup ? Object.keys(controls) : controls;
  if (!collection.length) {
    throw new _RuntimeError(1000, typeof ngDevMode === 'undefined' || ngDevMode ? noControlsError(isGroup) : '');
  }
  if (!controls[key]) {
    throw new _RuntimeError(1001, typeof ngDevMode === 'undefined' || ngDevMode ? missingControlError(isGroup, key) : '');
  }
}
function assertAllValuesPresent(control, isGroup, value) {
  control._forEachChild((_, key) => {
    if (value[key] === undefined) {
      throw new _RuntimeError(1002, typeof ngDevMode === 'undefined' || ngDevMode ? missingControlValueError(isGroup, key) : '');
    }
  });
}
class AbstractControl {
  _pendingDirty = false;
  _hasOwnPendingAsyncValidator = null;
  _pendingTouched = false;
  _onCollectionChange = () => {};
  _updateOn;
  _parent = null;
  _asyncValidationSubscription;
  _composedValidatorFn;
  _composedAsyncValidatorFn;
  _rawValidators;
  _rawAsyncValidators;
  value;
  constructor(validators, asyncValidators) {
    this._assignValidators(validators);
    this._assignAsyncValidators(asyncValidators);
  }
  get validator() {
    return this._composedValidatorFn;
  }
  set validator(validatorFn) {
    this._rawValidators = this._composedValidatorFn = validatorFn;
  }
  get asyncValidator() {
    return this._composedAsyncValidatorFn;
  }
  set asyncValidator(asyncValidatorFn) {
    this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
  }
  get parent() {
    return this._parent;
  }
  get status() {
    return untracked(this.statusReactive);
  }
  set status(v) {
    untracked(() => this.statusReactive.set(v));
  }
  _status = computed(() => this.statusReactive(), ...(ngDevMode ? [{
    debugName: "_status"
  }] : []));
  statusReactive = signal(undefined, ...(ngDevMode ? [{
    debugName: "statusReactive"
  }] : []));
  get valid() {
    return this.status === VALID;
  }
  get invalid() {
    return this.status === INVALID;
  }
  get pending() {
    return this.status == PENDING;
  }
  get disabled() {
    return this.status === DISABLED;
  }
  get enabled() {
    return this.status !== DISABLED;
  }
  errors;
  get pristine() {
    return untracked(this.pristineReactive);
  }
  set pristine(v) {
    untracked(() => this.pristineReactive.set(v));
  }
  _pristine = computed(() => this.pristineReactive(), ...(ngDevMode ? [{
    debugName: "_pristine"
  }] : []));
  pristineReactive = signal(true, ...(ngDevMode ? [{
    debugName: "pristineReactive"
  }] : []));
  get dirty() {
    return !this.pristine;
  }
  get touched() {
    return untracked(this.touchedReactive);
  }
  set touched(v) {
    untracked(() => this.touchedReactive.set(v));
  }
  _touched = computed(() => this.touchedReactive(), ...(ngDevMode ? [{
    debugName: "_touched"
  }] : []));
  touchedReactive = signal(false, ...(ngDevMode ? [{
    debugName: "touchedReactive"
  }] : []));
  get untouched() {
    return !this.touched;
  }
  _events = new Subject();
  events = this._events.asObservable();
  valueChanges;
  statusChanges;
  get updateOn() {
    return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
  }
  setValidators(validators) {
    this._assignValidators(validators);
  }
  setAsyncValidators(validators) {
    this._assignAsyncValidators(validators);
  }
  addValidators(validators) {
    this.setValidators(addValidators(validators, this._rawValidators));
  }
  addAsyncValidators(validators) {
    this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
  }
  removeValidators(validators) {
    this.setValidators(removeValidators(validators, this._rawValidators));
  }
  removeAsyncValidators(validators) {
    this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
  }
  hasValidator(validator) {
    return hasValidator(this._rawValidators, validator);
  }
  hasAsyncValidator(validator) {
    return hasValidator(this._rawAsyncValidators, validator);
  }
  clearValidators() {
    this.validator = null;
  }
  clearAsyncValidators() {
    this.asyncValidator = null;
  }
  markAsTouched(opts = {}) {
    const changed = this.touched === false;
    this.touched = true;
    const sourceControl = opts.sourceControl ?? this;
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsTouched({
        ...opts,
        sourceControl
      });
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new TouchedChangeEvent(true, sourceControl));
    }
  }
  markAllAsDirty(opts = {}) {
    this.markAsDirty({
      onlySelf: true,
      emitEvent: opts.emitEvent,
      sourceControl: this
    });
    this._forEachChild(control => control.markAllAsDirty(opts));
  }
  markAllAsTouched(opts = {}) {
    this.markAsTouched({
      onlySelf: true,
      emitEvent: opts.emitEvent,
      sourceControl: this
    });
    this._forEachChild(control => control.markAllAsTouched(opts));
  }
  markAsUntouched(opts = {}) {
    const changed = this.touched === true;
    this.touched = false;
    this._pendingTouched = false;
    const sourceControl = opts.sourceControl ?? this;
    this._forEachChild(control => {
      control.markAsUntouched({
        onlySelf: true,
        emitEvent: opts.emitEvent,
        sourceControl
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts, sourceControl);
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new TouchedChangeEvent(false, sourceControl));
    }
  }
  markAsDirty(opts = {}) {
    const changed = this.pristine === true;
    this.pristine = false;
    const sourceControl = opts.sourceControl ?? this;
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsDirty({
        ...opts,
        sourceControl
      });
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new PristineChangeEvent(false, sourceControl));
    }
  }
  markAsPristine(opts = {}) {
    const changed = this.pristine === false;
    this.pristine = true;
    this._pendingDirty = false;
    const sourceControl = opts.sourceControl ?? this;
    this._forEachChild(control => {
      control.markAsPristine({
        onlySelf: true,
        emitEvent: opts.emitEvent
      });
    });
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts, sourceControl);
    }
    if (changed && opts.emitEvent !== false) {
      this._events.next(new PristineChangeEvent(true, sourceControl));
    }
  }
  markAsPending(opts = {}) {
    this.status = PENDING;
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.statusChanges.emit(this.status);
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.markAsPending({
        ...opts,
        sourceControl
      });
    }
  }
  disable(opts = {}) {
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
    this.status = DISABLED;
    this.errors = null;
    this._forEachChild(control => {
      control.disable({
        ...opts,
        onlySelf: true
      });
    });
    this._updateValue();
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new ValueChangeEvent(this.value, sourceControl));
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }
    this._updateAncestors({
      ...opts,
      skipPristineCheck
    }, this);
    this._onDisabledChange.forEach(changeFn => changeFn(true));
  }
  enable(opts = {}) {
    const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
    this.status = VALID;
    this._forEachChild(control => {
      control.enable({
        ...opts,
        onlySelf: true
      });
    });
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent
    });
    this._updateAncestors({
      ...opts,
      skipPristineCheck
    }, this);
    this._onDisabledChange.forEach(changeFn => changeFn(false));
  }
  _updateAncestors(opts, sourceControl) {
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity(opts);
      if (!opts.skipPristineCheck) {
        this._parent._updatePristine({}, sourceControl);
      }
      this._parent._updateTouched({}, sourceControl);
    }
  }
  setParent(parent) {
    this._parent = parent;
  }
  getRawValue() {
    return this.value;
  }
  updateValueAndValidity(opts = {}) {
    this._setInitialStatus();
    this._updateValue();
    if (this.enabled) {
      const shouldHaveEmitted = this._cancelExistingSubscription();
      this.errors = this._runValidator();
      this.status = this._calculateStatus();
      if (this.status === VALID || this.status === PENDING) {
        this._runAsyncValidator(shouldHaveEmitted, opts.emitEvent);
      }
    }
    const sourceControl = opts.sourceControl ?? this;
    if (opts.emitEvent !== false) {
      this._events.next(new ValueChangeEvent(this.value, sourceControl));
      this._events.next(new StatusChangeEvent(this.status, sourceControl));
      this.valueChanges.emit(this.value);
      this.statusChanges.emit(this.status);
    }
    if (this._parent && !opts.onlySelf) {
      this._parent.updateValueAndValidity({
        ...opts,
        sourceControl
      });
    }
  }
  _updateTreeValidity(opts = {
    emitEvent: true
  }) {
    this._forEachChild(ctrl => ctrl._updateTreeValidity(opts));
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: opts.emitEvent
    });
  }
  _setInitialStatus() {
    this.status = this._allControlsDisabled() ? DISABLED : VALID;
  }
  _runValidator() {
    return this.validator ? this.validator(this) : null;
  }
  _runAsyncValidator(shouldHaveEmitted, emitEvent) {
    if (this.asyncValidator) {
      this.status = PENDING;
      this._hasOwnPendingAsyncValidator = {
        emitEvent: emitEvent !== false,
        shouldHaveEmitted: shouldHaveEmitted !== false
      };
      const obs = toObservable(this.asyncValidator(this));
      this._asyncValidationSubscription = obs.subscribe(errors => {
        this._hasOwnPendingAsyncValidator = null;
        this.setErrors(errors, {
          emitEvent,
          shouldHaveEmitted
        });
      });
    }
  }
  _cancelExistingSubscription() {
    if (this._asyncValidationSubscription) {
      this._asyncValidationSubscription.unsubscribe();
      const shouldHaveEmitted = (this._hasOwnPendingAsyncValidator?.emitEvent || this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ?? false;
      this._hasOwnPendingAsyncValidator = null;
      return shouldHaveEmitted;
    }
    return false;
  }
  setErrors(errors, opts = {}) {
    this.errors = errors;
    this._updateControlsErrors(opts.emitEvent !== false, this, opts.shouldHaveEmitted);
  }
  get(path) {
    let currPath = path;
    if (currPath == null) return null;
    if (!Array.isArray(currPath)) currPath = currPath.split('.');
    if (currPath.length === 0) return null;
    return currPath.reduce((control, name) => control && control._find(name), this);
  }
  getError(errorCode, path) {
    const control = path ? this.get(path) : this;
    return control && control.errors ? control.errors[errorCode] : null;
  }
  hasError(errorCode, path) {
    return !!this.getError(errorCode, path);
  }
  get root() {
    let x = this;
    while (x._parent) {
      x = x._parent;
    }
    return x;
  }
  _updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted) {
    this.status = this._calculateStatus();
    if (emitEvent) {
      this.statusChanges.emit(this.status);
    }
    if (emitEvent || shouldHaveEmitted) {
      this._events.next(new StatusChangeEvent(this.status, changedControl));
    }
    if (this._parent) {
      this._parent._updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted);
    }
  }
  _initObservables() {
    this.valueChanges = new EventEmitter();
    this.statusChanges = new EventEmitter();
  }
  _calculateStatus() {
    if (this._allControlsDisabled()) return DISABLED;
    if (this.errors) return INVALID;
    if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING)) return PENDING;
    if (this._anyControlsHaveStatus(INVALID)) return INVALID;
    return VALID;
  }
  _anyControlsHaveStatus(status) {
    return this._anyControls(control => control.status === status);
  }
  _anyControlsDirty() {
    return this._anyControls(control => control.dirty);
  }
  _anyControlsTouched() {
    return this._anyControls(control => control.touched);
  }
  _updatePristine(opts, changedControl) {
    const newPristine = !this._anyControlsDirty();
    const changed = this.pristine !== newPristine;
    this.pristine = newPristine;
    if (this._parent && !opts.onlySelf) {
      this._parent._updatePristine(opts, changedControl);
    }
    if (changed) {
      this._events.next(new PristineChangeEvent(this.pristine, changedControl));
    }
  }
  _updateTouched(opts = {}, changedControl) {
    this.touched = this._anyControlsTouched();
    this._events.next(new TouchedChangeEvent(this.touched, changedControl));
    if (this._parent && !opts.onlySelf) {
      this._parent._updateTouched(opts, changedControl);
    }
  }
  _onDisabledChange = [];
  _registerOnCollectionChange(fn) {
    this._onCollectionChange = fn;
  }
  _setUpdateStrategy(opts) {
    if (isOptionsObj(opts) && opts.updateOn != null) {
      this._updateOn = opts.updateOn;
    }
  }
  _parentMarkedDirty(onlySelf) {
    const parentDirty = this._parent && this._parent.dirty;
    return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
  }
  _find(name) {
    return null;
  }
  _assignValidators(validators) {
    this._rawValidators = Array.isArray(validators) ? validators.slice() : validators;
    this._composedValidatorFn = coerceToValidator(this._rawValidators);
  }
  _assignAsyncValidators(validators) {
    this._rawAsyncValidators = Array.isArray(validators) ? validators.slice() : validators;
    this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
  }
}

class FormGroup extends AbstractControl {
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    (typeof ngDevMode === 'undefined' || ngDevMode) && validateFormGroupControls(controls);
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: !!this.asyncValidator
    });
  }
  controls;
  registerControl(name, control) {
    if (this.controls[name]) return this.controls[name];
    this.controls[name] = control;
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
    return control;
  }
  addControl(name, control, options = {}) {
    this.registerControl(name, control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  removeControl(name, options = {}) {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {});
    delete this.controls[name];
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  setControl(name, control, options = {}) {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {});
    delete this.controls[name];
    if (control) this.registerControl(name, control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  contains(controlName) {
    return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
  }
  setValue(value, options = {}) {
    assertAllValuesPresent(this, true, value);
    Object.keys(value).forEach(name => {
      assertControlPresent(this, true, name);
      this.controls[name].setValue(value[name], {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this.updateValueAndValidity(options);
  }
  patchValue(value, options = {}) {
    if (value == null) return;
    Object.keys(value).forEach(name => {
      const control = this.controls[name];
      if (control) {
        control.patchValue(value[name], {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      }
    });
    this.updateValueAndValidity(options);
  }
  reset(value = {}, options = {}) {
    this._forEachChild((control, name) => {
      control.reset(value ? value[name] : null, {
        ...options,
        onlySelf: true
      });
    });
    this._updatePristine(options, this);
    this._updateTouched(options, this);
    this.updateValueAndValidity(options);
    if (options?.emitEvent !== false) {
      this._events.next(new FormResetEvent(this));
    }
  }
  getRawValue() {
    return this._reduceChildren({}, (acc, control, name) => {
      acc[name] = control.getRawValue();
      return acc;
    });
  }
  _syncPendingControls() {
    let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
      return child._syncPendingControls() ? true : updated;
    });
    if (subtreeUpdated) this.updateValueAndValidity({
      onlySelf: true
    });
    return subtreeUpdated;
  }
  _forEachChild(cb) {
    Object.keys(this.controls).forEach(key => {
      const control = this.controls[key];
      control && cb(control, key);
    });
  }
  _setUpControls() {
    this._forEachChild(control => {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    });
  }
  _updateValue() {
    this.value = this._reduceValue();
  }
  _anyControls(condition) {
    for (const [controlName, control] of Object.entries(this.controls)) {
      if (this.contains(controlName) && condition(control)) {
        return true;
      }
    }
    return false;
  }
  _reduceValue() {
    let acc = {};
    return this._reduceChildren(acc, (acc, control, name) => {
      if (control.enabled || this.disabled) {
        acc[name] = control.value;
      }
      return acc;
    });
  }
  _reduceChildren(initValue, fn) {
    let res = initValue;
    this._forEachChild((control, name) => {
      res = fn(res, control, name);
    });
    return res;
  }
  _allControlsDisabled() {
    for (const controlName of Object.keys(this.controls)) {
      if (this.controls[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }
  _find(name) {
    return this.controls.hasOwnProperty(name) ? this.controls[name] : null;
  }
}
function validateFormGroupControls(controls) {
  const invalidKeys = Object.keys(controls).filter(key => key.includes('.'));
  if (invalidKeys.length > 0) {
    console.warn(`FormGroup keys cannot include \`.\`, please replace the keys for: ${invalidKeys.join(',')}.`);
  }
}
const UntypedFormGroup = FormGroup;
const isFormGroup = control => control instanceof FormGroup;
class FormRecord extends FormGroup {}
const isFormRecord = control => control instanceof FormRecord;

const CALL_SET_DISABLED_STATE = new InjectionToken(typeof ngDevMode === 'undefined' || ngDevMode ? 'CallSetDisabledState' : '', {
  providedIn: 'root',
  factory: () => setDisabledStateDefault
});
const setDisabledStateDefault = 'always';
function controlPath(name, parent) {
  return [...parent.path, name];
}
function setUpControl(control, dir, callSetDisabledState = setDisabledStateDefault) {
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    if (!control) _throwError(dir, 'Cannot find control with');
    if (!dir.valueAccessor) _throwMissingValueAccessorError(dir);
  }
  setUpValidators(control, dir);
  dir.valueAccessor.writeValue(control.value);
  if (control.disabled || callSetDisabledState === 'always') {
    dir.valueAccessor.setDisabledState?.(control.disabled);
  }
  setUpViewChangePipeline(control, dir);
  setUpModelChangePipeline(control, dir);
  setUpBlurPipeline(control, dir);
  setUpDisabledChangeHandler(control, dir);
}
function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
  const noop = () => {
    if (validateControlPresenceOnChange && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      _noControlError(dir);
    }
  };
  if (dir.valueAccessor) {
    dir.valueAccessor.registerOnChange(noop);
    dir.valueAccessor.registerOnTouched(noop);
  }
  cleanUpValidators(control, dir);
  if (control) {
    dir._invokeOnDestroyCallbacks();
    control._registerOnCollectionChange(() => {});
  }
}
function registerOnValidatorChange(validators, onChange) {
  validators.forEach(validator => {
    if (validator.registerOnValidatorChange) validator.registerOnValidatorChange(onChange);
  });
}
function setUpDisabledChangeHandler(control, dir) {
  if (dir.valueAccessor.setDisabledState) {
    const onDisabledChange = isDisabled => {
      dir.valueAccessor.setDisabledState(isDisabled);
    };
    control.registerOnDisabledChange(onDisabledChange);
    dir._registerOnDestroy(() => {
      control._unregisterOnDisabledChange(onDisabledChange);
    });
  }
}
function setUpValidators(control, dir) {
  const validators = getControlValidators(control);
  if (dir.validator !== null) {
    control.setValidators(mergeValidators(validators, dir.validator));
  } else if (typeof validators === 'function') {
    control.setValidators([validators]);
  }
  const asyncValidators = getControlAsyncValidators(control);
  if (dir.asyncValidator !== null) {
    control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
  } else if (typeof asyncValidators === 'function') {
    control.setAsyncValidators([asyncValidators]);
  }
  const onValidatorChange = () => control.updateValueAndValidity();
  registerOnValidatorChange(dir._rawValidators, onValidatorChange);
  registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
}
function cleanUpValidators(control, dir) {
  let isControlUpdated = false;
  if (control !== null) {
    if (dir.validator !== null) {
      const validators = getControlValidators(control);
      if (Array.isArray(validators) && validators.length > 0) {
        const updatedValidators = validators.filter(validator => validator !== dir.validator);
        if (updatedValidators.length !== validators.length) {
          isControlUpdated = true;
          control.setValidators(updatedValidators);
        }
      }
    }
    if (dir.asyncValidator !== null) {
      const asyncValidators = getControlAsyncValidators(control);
      if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
        const updatedAsyncValidators = asyncValidators.filter(asyncValidator => asyncValidator !== dir.asyncValidator);
        if (updatedAsyncValidators.length !== asyncValidators.length) {
          isControlUpdated = true;
          control.setAsyncValidators(updatedAsyncValidators);
        }
      }
    }
  }
  const noop = () => {};
  registerOnValidatorChange(dir._rawValidators, noop);
  registerOnValidatorChange(dir._rawAsyncValidators, noop);
  return isControlUpdated;
}
function setUpViewChangePipeline(control, dir) {
  dir.valueAccessor.registerOnChange(newValue => {
    control._pendingValue = newValue;
    control._pendingChange = true;
    control._pendingDirty = true;
    if (control.updateOn === 'change') updateControl(control, dir);
  });
}
function setUpBlurPipeline(control, dir) {
  dir.valueAccessor.registerOnTouched(() => {
    control._pendingTouched = true;
    if (control.updateOn === 'blur' && control._pendingChange) updateControl(control, dir);
    if (control.updateOn !== 'submit') control.markAsTouched();
  });
}
function updateControl(control, dir) {
  if (control._pendingDirty) control.markAsDirty();
  control.setValue(control._pendingValue, {
    emitModelToViewChange: false
  });
  dir.viewToModelUpdate(control._pendingValue);
  control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
  const onChange = (newValue, emitModelEvent) => {
    dir.valueAccessor.writeValue(newValue);
    if (emitModelEvent) dir.viewToModelUpdate(newValue);
  };
  control.registerOnChange(onChange);
  dir._registerOnDestroy(() => {
    control._unregisterOnChange(onChange);
  });
}
function setUpFormContainer(control, dir) {
  if (control == null && (typeof ngDevMode === 'undefined' || ngDevMode)) _throwError(dir, 'Cannot find control with');
  setUpValidators(control, dir);
}
function cleanUpFormContainer(control, dir) {
  return cleanUpValidators(control, dir);
}
function _noControlError(dir) {
  return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
  const messageEnd = _describeControlLocation(dir);
  throw new Error(`${message} ${messageEnd}`);
}
function _describeControlLocation(dir) {
  const path = dir.path;
  if (path && path.length > 1) return `path: '${path.join(' -> ')}'`;
  if (path?.[0]) return `name: '${path}'`;
  return 'unspecified name attribute';
}
function _throwMissingValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new _RuntimeError(-1203, `No value accessor for form control ${loc}.`);
}
function _throwInvalidValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new _RuntimeError(1200, `Value accessor was not provided as an array for form control with ${loc}. ` + `Check that the \`NG_VALUE_ACCESSOR\` token is configured as a \`multi: true\` provider.`);
}
function isPropertyUpdated(changes, viewModel) {
  if (!changes.hasOwnProperty('model')) return false;
  const change = changes['model'];
  if (change.isFirstChange()) return true;
  return !Object.is(viewModel, change.currentValue);
}
function isBuiltInAccessor(valueAccessor) {
  return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}
function syncPendingControls(form, directives) {
  form._syncPendingControls();
  directives.forEach(dir => {
    const control = dir.control;
    if (control.updateOn === 'submit' && control._pendingChange) {
      dir.viewToModelUpdate(control._pendingValue);
      control._pendingChange = false;
    }
  });
}
function selectValueAccessor(dir, valueAccessors) {
  if (!valueAccessors) return null;
  if (!Array.isArray(valueAccessors) && (typeof ngDevMode === 'undefined' || ngDevMode)) _throwInvalidValueAccessorError(dir);
  let defaultAccessor = undefined;
  let builtinAccessor = undefined;
  let customAccessor = undefined;
  valueAccessors.forEach(v => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor && (typeof ngDevMode === 'undefined' || ngDevMode)) _throwError(dir, 'More than one built-in value accessor matches form control with');
      builtinAccessor = v;
    } else {
      if (customAccessor && (typeof ngDevMode === 'undefined' || ngDevMode)) _throwError(dir, 'More than one custom value accessor matches form control with');
      customAccessor = v;
    }
  });
  if (customAccessor) return customAccessor;
  if (builtinAccessor) return builtinAccessor;
  if (defaultAccessor) return defaultAccessor;
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    _throwError(dir, 'No valid value accessor for form control with');
  }
  return null;
}
function removeListItem$1(list, el) {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}
function _ngModelWarning(name, type, instance, warningConfig) {
  if (warningConfig === 'never') return;
  if ((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce || warningConfig === 'always' && !instance._ngModelWarningSent) {
    console.warn(ngModelWarning(name));
    type._ngModelWarningSentOnce = true;
    instance._ngModelWarningSent = true;
  }
}

const formDirectiveProvider$2 = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgForm)
};
const resolvedPromise$1 = (() => Promise.resolve())();
class NgForm extends ControlContainer {
  callSetDisabledState;
  get submitted() {
    return untracked(this.submittedReactive);
  }
  _submitted = computed(() => this.submittedReactive(), ...(ngDevMode ? [{
    debugName: "_submitted"
  }] : []));
  submittedReactive = signal(false, ...(ngDevMode ? [{
    debugName: "submittedReactive"
  }] : []));
  _directives = new Set();
  form;
  ngSubmit = new EventEmitter();
  options;
  constructor(validators, asyncValidators, callSetDisabledState) {
    super();
    this.callSetDisabledState = callSetDisabledState;
    this.form = new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
  }
  ngAfterViewInit() {
    this._setUpdateStrategy();
  }
  get formDirective() {
    return this;
  }
  get control() {
    return this.form;
  }
  get path() {
    return [];
  }
  get controls() {
    return this.form.controls;
  }
  addControl(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      dir.control = container.registerControl(dir.name, dir.control);
      setUpControl(dir.control, dir, this.callSetDisabledState);
      dir.control.updateValueAndValidity({
        emitEvent: false
      });
      this._directives.add(dir);
    });
  }
  getControl(dir) {
    return this.form.get(dir.path);
  }
  removeControl(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
      this._directives.delete(dir);
    });
  }
  addFormGroup(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      const group = new FormGroup({});
      setUpFormContainer(group, dir);
      container.registerControl(dir.name, group);
      group.updateValueAndValidity({
        emitEvent: false
      });
    });
  }
  removeFormGroup(dir) {
    resolvedPromise$1.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
    });
  }
  getFormGroup(dir) {
    return this.form.get(dir.path);
  }
  updateModel(dir, value) {
    resolvedPromise$1.then(() => {
      const ctrl = this.form.get(dir.path);
      ctrl.setValue(value);
    });
  }
  setValue(value) {
    this.control.setValue(value);
  }
  onSubmit($event) {
    this.submittedReactive.set(true);
    syncPendingControls(this.form, this._directives);
    this.ngSubmit.emit($event);
    this.form._events.next(new FormSubmittedEvent(this.control));
    return $event?.target?.method === 'dialog';
  }
  onReset() {
    this.resetForm();
  }
  resetForm(value = undefined) {
    this.form.reset(value);
    this.submittedReactive.set(false);
  }
  _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.form._updateOn = this.options.updateOn;
    }
  }
  _findContainer(path) {
    path.pop();
    return path.length ? this.form.get(path) : this.form;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NgForm,
    deps: [{
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: CALL_SET_DISABLED_STATE,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: NgForm,
    isStandalone: false,
    selector: "form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]",
    inputs: {
      options: ["ngFormOptions", "options"]
    },
    outputs: {
      ngSubmit: "ngSubmit"
    },
    host: {
      listeners: {
        "submit": "onSubmit($event)",
        "reset": "onReset()"
      }
    },
    providers: [formDirectiveProvider$2],
    exportAs: ["ngForm"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NgForm,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'form:not([ngNoForm]):not([formGroup]):not([formArray]),ng-form,[ngForm]',
      providers: [formDirectiveProvider$2],
      host: {
        '(submit)': 'onSubmit($event)',
        '(reset)': 'onReset()'
      },
      outputs: ['ngSubmit'],
      exportAs: 'ngForm',
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }],
  propDecorators: {
    options: [{
      type: Input,
      args: ['ngFormOptions']
    }]
  }
});

function removeListItem(list, el) {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}

function isFormControlState(formState) {
  return typeof formState === 'object' && formState !== null && Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
}
const FormControl = class FormControl extends AbstractControl {
  defaultValue = null;
  _onChange = [];
  _pendingValue;
  _pendingChange = false;
  constructor(formState = null, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this._applyFormState(formState);
    this._setUpdateStrategy(validatorOrOpts);
    this._initObservables();
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: !!this.asyncValidator
    });
    if (isOptionsObj(validatorOrOpts) && (validatorOrOpts.nonNullable || validatorOrOpts.initialValueIsDefault)) {
      if (isFormControlState(formState)) {
        this.defaultValue = formState.value;
      } else {
        this.defaultValue = formState;
      }
    }
  }
  setValue(value, options = {}) {
    this.value = this._pendingValue = value;
    if (this._onChange.length && options.emitModelToViewChange !== false) {
      this._onChange.forEach(changeFn => changeFn(this.value, options.emitViewToModelChange !== false));
    }
    this.updateValueAndValidity(options);
  }
  patchValue(value, options = {}) {
    this.setValue(value, options);
  }
  reset(formState = this.defaultValue, options = {}) {
    this._applyFormState(formState);
    this.markAsPristine(options);
    this.markAsUntouched(options);
    this.setValue(this.value, options);
    if (options.overwriteDefaultValue) {
      this.defaultValue = this.value;
    }
    this._pendingChange = false;
    if (options?.emitEvent !== false) {
      this._events.next(new FormResetEvent(this));
    }
  }
  _updateValue() {}
  _anyControls(condition) {
    return false;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(fn) {
    this._onChange.push(fn);
  }
  _unregisterOnChange(fn) {
    removeListItem(this._onChange, fn);
  }
  registerOnDisabledChange(fn) {
    this._onDisabledChange.push(fn);
  }
  _unregisterOnDisabledChange(fn) {
    removeListItem(this._onDisabledChange, fn);
  }
  _forEachChild(cb) {}
  _syncPendingControls() {
    if (this.updateOn === 'submit') {
      if (this._pendingDirty) this.markAsDirty();
      if (this._pendingTouched) this.markAsTouched();
      if (this._pendingChange) {
        this.setValue(this._pendingValue, {
          onlySelf: true,
          emitModelToViewChange: false
        });
        return true;
      }
    }
    return false;
  }
  _applyFormState(formState) {
    if (isFormControlState(formState)) {
      this.value = this._pendingValue = formState.value;
      formState.disabled ? this.disable({
        onlySelf: true,
        emitEvent: false
      }) : this.enable({
        onlySelf: true,
        emitEvent: false
      });
    } else {
      this.value = this._pendingValue = formState;
    }
  }
};
const UntypedFormControl = FormControl;
const isFormControl = control => control instanceof FormControl;

class AbstractFormGroupDirective extends ControlContainer {
  _parent;
  ngOnInit() {
    this._checkParentType();
    this.formDirective.addFormGroup(this);
  }
  ngOnDestroy() {
    if (this.formDirective) {
      this.formDirective.removeFormGroup(this);
    }
  }
  get control() {
    return this.formDirective.getFormGroup(this);
  }
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  _checkParentType() {}
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: AbstractFormGroupDirective,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: AbstractFormGroupDirective,
    isStandalone: false,
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: AbstractFormGroupDirective,
  decorators: [{
    type: Directive,
    args: [{
      standalone: false
    }]
  }]
});

function modelParentException() {
  return new _RuntimeError(1350, `
    ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
    formGroup's partner directive "formControlName" instead.  Example:

    ${formControlNameExample}

    Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

    Example:

    ${ngModelWithFormGroupExample}`);
}
function formGroupNameException() {
  return new _RuntimeError(1351, `
    ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

    Option 1: Use formControlName instead of ngModel (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

    ${ngModelGroupExample}`);
}
function missingNameException() {
  return new _RuntimeError(1352, `If ngModel is used within a form tag, either the name attribute must be set or the form
    control must be defined as 'standalone' in ngModelOptions.

    Example 1: <input [(ngModel)]="person.firstName" name="first">
    Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
}
function modelGroupParentException() {
  return new _RuntimeError(1353, `
    ngModelGroup cannot be used with a parent formGroup directive.

    Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

    ${ngModelGroupExample}`);
}

const modelGroupProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgModelGroup)
};
class NgModelGroup extends AbstractFormGroupDirective {
  name = '';
  constructor(parent, validators, asyncValidators) {
    super();
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  _checkParentType() {
    if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw modelGroupParentException();
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NgModelGroup,
    deps: [{
      token: ControlContainer,
      host: true,
      skipSelf: true
    }, {
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: NgModelGroup,
    isStandalone: false,
    selector: "[ngModelGroup]",
    inputs: {
      name: ["ngModelGroup", "name"]
    },
    providers: [modelGroupProvider],
    exportAs: ["ngModelGroup"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NgModelGroup,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngModelGroup]',
      providers: [modelGroupProvider],
      exportAs: 'ngModelGroup',
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: ControlContainer,
    decorators: [{
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }],
  propDecorators: {
    name: [{
      type: Input,
      args: ['ngModelGroup']
    }]
  }
});

const formControlBinding$1 = {
  provide: NgControl,
  useExisting: forwardRef(() => NgModel)
};
const resolvedPromise = (() => Promise.resolve())();
class NgModel extends NgControl {
  _changeDetectorRef;
  callSetDisabledState;
  control = new FormControl();
  static ngAcceptInputType_isDisabled;
  _registered = false;
  viewModel;
  name = '';
  isDisabled;
  model;
  options;
  update = new EventEmitter();
  constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef, callSetDisabledState) {
    super();
    this._changeDetectorRef = _changeDetectorRef;
    this.callSetDisabledState = callSetDisabledState;
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  ngOnChanges(changes) {
    this._checkForErrors();
    if (!this._registered || 'name' in changes) {
      if (this._registered) {
        this._checkName();
        if (this.formDirective) {
          const oldName = changes['name'].previousValue;
          this.formDirective.removeControl({
            name: oldName,
            path: this._getPath(oldName)
          });
        }
      }
      this._setUpControl();
    }
    if ('isDisabled' in changes) {
      this._updateDisabled(changes);
    }
    if (isPropertyUpdated(changes, this.viewModel)) {
      this._updateValue(this.model);
      this.viewModel = this.model;
    }
  }
  ngOnDestroy() {
    this.formDirective && this.formDirective.removeControl(this);
  }
  get path() {
    return this._getPath(this.name);
  }
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  _setUpControl() {
    this._setUpdateStrategy();
    this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
    this._registered = true;
  }
  _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.control._updateOn = this.options.updateOn;
    }
  }
  _isStandalone() {
    return !this._parent || !!(this.options && this.options.standalone);
  }
  _setUpStandalone() {
    setUpControl(this.control, this, this.callSetDisabledState);
    this.control.updateValueAndValidity({
      emitEvent: false
    });
  }
  _checkForErrors() {
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && !this._isStandalone()) {
      checkParentType$1(this._parent);
    }
    this._checkName();
  }
  _checkName() {
    if (this.options && this.options.name) this.name = this.options.name;
    if (!this._isStandalone() && !this.name && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw missingNameException();
    }
  }
  _updateValue(value) {
    resolvedPromise.then(() => {
      this.control.setValue(value, {
        emitViewToModelChange: false
      });
      this._changeDetectorRef?.markForCheck();
    });
  }
  _updateDisabled(changes) {
    const disabledValue = changes['isDisabled'].currentValue;
    const isDisabled = disabledValue !== 0 && booleanAttribute(disabledValue);
    resolvedPromise.then(() => {
      if (isDisabled && !this.control.disabled) {
        this.control.disable();
      } else if (!isDisabled && this.control.disabled) {
        this.control.enable();
      }
      this._changeDetectorRef?.markForCheck();
    });
  }
  _getPath(controlName) {
    return this._parent ? controlPath(controlName, this._parent) : [controlName];
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NgModel,
    deps: [{
      token: ControlContainer,
      host: true,
      optional: true
    }, {
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_VALUE_ACCESSOR,
      optional: true,
      self: true
    }, {
      token: ChangeDetectorRef,
      optional: true
    }, {
      token: CALL_SET_DISABLED_STATE,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: NgModel,
    isStandalone: false,
    selector: "[ngModel]:not([formControlName]):not([formControl])",
    inputs: {
      name: "name",
      isDisabled: ["disabled", "isDisabled"],
      model: ["ngModel", "model"],
      options: ["ngModelOptions", "options"]
    },
    outputs: {
      update: "ngModelChange"
    },
    providers: [formControlBinding$1],
    exportAs: ["ngModel"],
    usesInheritance: true,
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NgModel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[ngModel]:not([formControlName]):not([formControl])',
      providers: [formControlBinding$1],
      exportAs: 'ngModel',
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: i0.ChangeDetectorRef,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ChangeDetectorRef]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }],
  propDecorators: {
    name: [{
      type: Input
    }],
    isDisabled: [{
      type: Input,
      args: ['disabled']
    }],
    model: [{
      type: Input,
      args: ['ngModel']
    }],
    options: [{
      type: Input,
      args: ['ngModelOptions']
    }],
    update: [{
      type: Output,
      args: ['ngModelChange']
    }]
  }
});
function checkParentType$1(parent) {
  if (!(parent instanceof NgModelGroup) && parent instanceof AbstractFormGroupDirective) {
    throw formGroupNameException();
  } else if (!(parent instanceof NgModelGroup) && !(parent instanceof NgForm)) {
    throw modelParentException();
  }
}

class ɵNgNoValidate {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ɵNgNoValidate,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: ɵNgNoValidate,
    isStandalone: false,
    selector: "form:not([ngNoForm]):not([ngNativeValidate])",
    host: {
      attributes: {
        "novalidate": ""
      }
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: ɵNgNoValidate,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
      host: {
        'novalidate': ''
      },
      standalone: false
    }]
  }]
});

const NUMBER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberValueAccessor),
  multi: true
};
class NumberValueAccessor extends BuiltInControlValueAccessor {
  writeValue(value) {
    const normalizedValue = value == null ? '' : value;
    this.setProperty('value', normalizedValue);
  }
  registerOnChange(fn) {
    this.onChange = value => {
      fn(value == '' ? null : parseFloat(value));
    };
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NumberValueAccessor,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: NumberValueAccessor,
    isStandalone: false,
    selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]",
    host: {
      listeners: {
        "input": "onChange($any($event.target).value)",
        "blur": "onTouched()"
      }
    },
    providers: [NUMBER_VALUE_ACCESSOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NumberValueAccessor,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]',
      host: {
        '(input)': 'onChange($any($event.target).value)',
        '(blur)': 'onTouched()'
      },
      providers: [NUMBER_VALUE_ACCESSOR],
      standalone: false
    }]
  }]
});

const RADIO_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioControlValueAccessor),
  multi: true
};
function throwNameError() {
  throw new _RuntimeError(1202, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}
class RadioControlRegistry {
  _accessors = [];
  add(control, accessor) {
    this._accessors.push([control, accessor]);
  }
  remove(accessor) {
    for (let i = this._accessors.length - 1; i >= 0; --i) {
      if (this._accessors[i][1] === accessor) {
        this._accessors.splice(i, 1);
        return;
      }
    }
  }
  select(accessor) {
    this._accessors.forEach(c => {
      if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
        c[1].fireUncheck(accessor.value);
      }
    });
  }
  _isSameGroup(controlPair, accessor) {
    if (!controlPair[0].control) return false;
    return controlPair[0]._parent === accessor._control._parent && controlPair[1].name === accessor.name;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: RadioControlRegistry,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: RadioControlRegistry,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: RadioControlRegistry,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }]
});
class RadioControlValueAccessor extends BuiltInControlValueAccessor {
  _registry;
  _injector;
  _state;
  _control;
  _fn;
  setDisabledStateFired = false;
  onChange = () => {};
  name;
  formControlName;
  value;
  callSetDisabledState = inject(CALL_SET_DISABLED_STATE, {
    optional: true
  }) ?? setDisabledStateDefault;
  constructor(renderer, elementRef, _registry, _injector) {
    super(renderer, elementRef);
    this._registry = _registry;
    this._injector = _injector;
  }
  ngOnInit() {
    this._control = this._injector.get(NgControl);
    this._checkName();
    this._registry.add(this._control, this);
  }
  ngOnDestroy() {
    this._registry.remove(this);
  }
  writeValue(value) {
    this._state = value === this.value;
    this.setProperty('checked', this._state);
  }
  registerOnChange(fn) {
    this._fn = fn;
    this.onChange = () => {
      fn(this.value);
      this._registry.select(this);
    };
  }
  setDisabledState(isDisabled) {
    if (this.setDisabledStateFired || isDisabled || this.callSetDisabledState === 'whenDisabledForLegacyCode') {
      this.setProperty('disabled', isDisabled);
    }
    this.setDisabledStateFired = true;
  }
  fireUncheck(value) {
    this.writeValue(value);
  }
  _checkName() {
    if (this.name && this.formControlName && this.name !== this.formControlName && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwNameError();
    }
    if (!this.name && this.formControlName) this.name = this.formControlName;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: RadioControlValueAccessor,
    deps: [{
      token: i0.Renderer2
    }, {
      token: i0.ElementRef
    }, {
      token: RadioControlRegistry
    }, {
      token: i0.Injector
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: RadioControlValueAccessor,
    isStandalone: false,
    selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]",
    inputs: {
      name: "name",
      formControlName: "formControlName",
      value: "value"
    },
    host: {
      listeners: {
        "change": "onChange()",
        "blur": "onTouched()"
      }
    },
    providers: [RADIO_VALUE_ACCESSOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: RadioControlValueAccessor,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
      host: {
        '(change)': 'onChange()',
        '(blur)': 'onTouched()'
      },
      providers: [RADIO_VALUE_ACCESSOR],
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: i0.Renderer2
  }, {
    type: i0.ElementRef
  }, {
    type: RadioControlRegistry
  }, {
    type: i0.Injector
  }],
  propDecorators: {
    name: [{
      type: Input
    }],
    formControlName: [{
      type: Input
    }],
    value: [{
      type: Input
    }]
  }
});

const RANGE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RangeValueAccessor),
  multi: true
};
class RangeValueAccessor extends BuiltInControlValueAccessor {
  writeValue(value) {
    this.setProperty('value', parseFloat(value));
  }
  registerOnChange(fn) {
    this.onChange = value => {
      fn(value == '' ? null : parseFloat(value));
    };
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: RangeValueAccessor,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: RangeValueAccessor,
    isStandalone: false,
    selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]",
    host: {
      listeners: {
        "change": "onChange($any($event.target).value)",
        "input": "onChange($any($event.target).value)",
        "blur": "onTouched()"
      }
    },
    providers: [RANGE_VALUE_ACCESSOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: RangeValueAccessor,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
      host: {
        '(change)': 'onChange($any($event.target).value)',
        '(input)': 'onChange($any($event.target).value)',
        '(blur)': 'onTouched()'
      },
      providers: [RANGE_VALUE_ACCESSOR],
      standalone: false
    }]
  }]
});

class FormArray extends AbstractControl {
  constructor(controls, validatorOrOpts, asyncValidator) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      emitEvent: !!this.asyncValidator
    });
  }
  controls;
  at(index) {
    return this.controls[this._adjustIndex(index)];
  }
  push(control, options = {}) {
    if (Array.isArray(control)) {
      control.forEach(ctrl => {
        this.controls.push(ctrl);
        this._registerControl(ctrl);
      });
    } else {
      this.controls.push(control);
      this._registerControl(control);
    }
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  insert(index, control, options = {}) {
    this.controls.splice(index, 0, control);
    this._registerControl(control);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  removeAt(index, options = {}) {
    let adjustedIndex = this._adjustIndex(index);
    if (adjustedIndex < 0) adjustedIndex = 0;
    if (this.controls[adjustedIndex]) this.controls[adjustedIndex]._registerOnCollectionChange(() => {});
    this.controls.splice(adjustedIndex, 1);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  setControl(index, control, options = {}) {
    let adjustedIndex = this._adjustIndex(index);
    if (adjustedIndex < 0) adjustedIndex = 0;
    if (this.controls[adjustedIndex]) this.controls[adjustedIndex]._registerOnCollectionChange(() => {});
    this.controls.splice(adjustedIndex, 1);
    if (control) {
      this.controls.splice(adjustedIndex, 0, control);
      this._registerControl(control);
    }
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
    this._onCollectionChange();
  }
  get length() {
    return this.controls.length;
  }
  setValue(value, options = {}) {
    assertAllValuesPresent(this, false, value);
    value.forEach((newValue, index) => {
      assertControlPresent(this, false, index);
      this.at(index).setValue(newValue, {
        onlySelf: true,
        emitEvent: options.emitEvent
      });
    });
    this.updateValueAndValidity(options);
  }
  patchValue(value, options = {}) {
    if (value == null) return;
    value.forEach((newValue, index) => {
      if (this.at(index)) {
        this.at(index).patchValue(newValue, {
          onlySelf: true,
          emitEvent: options.emitEvent
        });
      }
    });
    this.updateValueAndValidity(options);
  }
  reset(value = [], options = {}) {
    this._forEachChild((control, index) => {
      control.reset(value[index], {
        ...options,
        onlySelf: true
      });
    });
    this._updatePristine(options, this);
    this._updateTouched(options, this);
    this.updateValueAndValidity(options);
    if (options?.emitEvent !== false) {
      this._events.next(new FormResetEvent(this));
    }
  }
  getRawValue() {
    return this.controls.map(control => control.getRawValue());
  }
  clear(options = {}) {
    if (this.controls.length < 1) return;
    this._forEachChild(control => control._registerOnCollectionChange(() => {}));
    this.controls.splice(0);
    this.updateValueAndValidity({
      emitEvent: options.emitEvent
    });
  }
  _adjustIndex(index) {
    return index < 0 ? index + this.length : index;
  }
  _syncPendingControls() {
    let subtreeUpdated = this.controls.reduce((updated, child) => {
      return child._syncPendingControls() ? true : updated;
    }, false);
    if (subtreeUpdated) this.updateValueAndValidity({
      onlySelf: true
    });
    return subtreeUpdated;
  }
  _forEachChild(cb) {
    this.controls.forEach((control, index) => {
      cb(control, index);
    });
  }
  _updateValue() {
    this.value = this.controls.filter(control => control.enabled || this.disabled).map(control => control.value);
  }
  _anyControls(condition) {
    return this.controls.some(control => control.enabled && condition(control));
  }
  _setUpControls() {
    this._forEachChild(control => this._registerControl(control));
  }
  _allControlsDisabled() {
    for (const control of this.controls) {
      if (control.enabled) return false;
    }
    return this.controls.length > 0 || this.disabled;
  }
  _registerControl(control) {
    control.setParent(this);
    control._registerOnCollectionChange(this._onCollectionChange);
  }
  _find(name) {
    return this.at(name) ?? null;
  }
}
const UntypedFormArray = FormArray;
const isFormArray = control => control instanceof FormArray;

class AbstractFormDirective extends ControlContainer {
  callSetDisabledState;
  get submitted() {
    return untracked(this._submittedReactive);
  }
  set submitted(value) {
    this._submittedReactive.set(value);
  }
  _submitted = computed(() => this._submittedReactive(), ...(ngDevMode ? [{
    debugName: "_submitted"
  }] : []));
  _submittedReactive = signal(false, ...(ngDevMode ? [{
    debugName: "_submittedReactive"
  }] : []));
  _oldForm;
  _onCollectionChange = () => this._updateDomValue();
  directives = [];
  constructor(validators, asyncValidators, callSetDisabledState) {
    super();
    this.callSetDisabledState = callSetDisabledState;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  ngOnChanges(changes) {
    this.onChanges(changes);
  }
  ngOnDestroy() {
    this.onDestroy();
  }
  onChanges(changes) {
    this._checkFormPresent();
    if (changes.hasOwnProperty('form')) {
      this._updateValidators();
      this._updateDomValue();
      this._updateRegistrations();
      this._oldForm = this.form;
    }
  }
  onDestroy() {
    if (this.form) {
      cleanUpValidators(this.form, this);
      if (this.form._onCollectionChange === this._onCollectionChange) {
        this.form._registerOnCollectionChange(() => {});
      }
    }
  }
  get formDirective() {
    return this;
  }
  get path() {
    return [];
  }
  addControl(dir) {
    const ctrl = this.form.get(dir.path);
    setUpControl(ctrl, dir, this.callSetDisabledState);
    ctrl.updateValueAndValidity({
      emitEvent: false
    });
    this.directives.push(dir);
    return ctrl;
  }
  getControl(dir) {
    return this.form.get(dir.path);
  }
  removeControl(dir) {
    cleanUpControl(dir.control || null, dir, false);
    removeListItem$1(this.directives, dir);
  }
  addFormGroup(dir) {
    this._setUpFormContainer(dir);
  }
  removeFormGroup(dir) {
    this._cleanUpFormContainer(dir);
  }
  getFormGroup(dir) {
    return this.form.get(dir.path);
  }
  getFormArray(dir) {
    return this.form.get(dir.path);
  }
  addFormArray(dir) {
    this._setUpFormContainer(dir);
  }
  removeFormArray(dir) {
    this._cleanUpFormContainer(dir);
  }
  updateModel(dir, value) {
    const ctrl = this.form.get(dir.path);
    ctrl.setValue(value);
  }
  onReset() {
    this.resetForm();
  }
  resetForm(value = undefined, options = {}) {
    this.form.reset(value, options);
    this._submittedReactive.set(false);
  }
  onSubmit($event) {
    this.submitted = true;
    syncPendingControls(this.form, this.directives);
    this.ngSubmit.emit($event);
    this.form._events.next(new FormSubmittedEvent(this.control));
    return $event?.target?.method === 'dialog';
  }
  _updateDomValue() {
    this.directives.forEach(dir => {
      const oldCtrl = dir.control;
      const newCtrl = this.form.get(dir.path);
      if (oldCtrl !== newCtrl) {
        cleanUpControl(oldCtrl || null, dir);
        if (isFormControl(newCtrl)) {
          setUpControl(newCtrl, dir, this.callSetDisabledState);
          dir.control = newCtrl;
        }
      }
    });
    this.form._updateTreeValidity({
      emitEvent: false
    });
  }
  _setUpFormContainer(dir) {
    const ctrl = this.form.get(dir.path);
    setUpFormContainer(ctrl, dir);
    ctrl.updateValueAndValidity({
      emitEvent: false
    });
  }
  _cleanUpFormContainer(dir) {
    if (this.form) {
      const ctrl = this.form.get(dir.path);
      if (ctrl) {
        const isControlUpdated = cleanUpFormContainer(ctrl, dir);
        if (isControlUpdated) {
          ctrl.updateValueAndValidity({
            emitEvent: false
          });
        }
      }
    }
  }
  _updateRegistrations() {
    this.form._registerOnCollectionChange(this._onCollectionChange);
    if (this._oldForm) {
      this._oldForm._registerOnCollectionChange(() => {});
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
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: AbstractFormDirective,
    deps: [{
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: CALL_SET_DISABLED_STATE,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: AbstractFormDirective,
    isStandalone: true,
    usesInheritance: true,
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: AbstractFormDirective,
  decorators: [{
    type: Directive
  }],
  ctorParameters: () => [{
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }]
});

const formDirectiveProvider$1 = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormArrayDirective)
};
class FormArrayDirective extends AbstractFormDirective {
  form = null;
  ngSubmit = new EventEmitter();
  get control() {
    return this.form;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormArrayDirective,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: FormArrayDirective,
    isStandalone: false,
    selector: "[formArray]",
    inputs: {
      form: ["formArray", "form"]
    },
    outputs: {
      ngSubmit: "ngSubmit"
    },
    host: {
      listeners: {
        "submit": "onSubmit($event)",
        "reset": "onReset()"
      }
    },
    providers: [formDirectiveProvider$1],
    exportAs: ["ngForm"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormArrayDirective,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formArray]',
      providers: [formDirectiveProvider$1],
      host: {
        '(submit)': 'onSubmit($event)',
        '(reset)': 'onReset()'
      },
      exportAs: 'ngForm',
      standalone: false
    }]
  }],
  propDecorators: {
    form: [{
      type: Input,
      args: ['formArray']
    }],
    ngSubmit: [{
      type: Output
    }]
  }
});

const NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken(typeof ngDevMode !== undefined && ngDevMode ? 'NgModelWithFormControlWarning' : '');
const formControlBinding = {
  provide: NgControl,
  useExisting: forwardRef(() => FormControlDirective)
};
class FormControlDirective extends NgControl {
  _ngModelWarningConfig;
  callSetDisabledState;
  viewModel;
  form;
  set isDisabled(isDisabled) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      console.warn(disabledAttrWarning);
    }
  }
  model;
  update = new EventEmitter();
  static _ngModelWarningSentOnce = false;
  _ngModelWarningSent = false;
  constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig, callSetDisabledState) {
    super();
    this._ngModelWarningConfig = _ngModelWarningConfig;
    this.callSetDisabledState = callSetDisabledState;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  ngOnChanges(changes) {
    if (this._isControlChanged(changes)) {
      const previousForm = changes['form'].previousValue;
      if (previousForm) {
        cleanUpControl(previousForm, this, false);
      }
      setUpControl(this.form, this, this.callSetDisabledState);
      this.form.updateValueAndValidity({
        emitEvent: false
      });
    }
    if (isPropertyUpdated(changes, this.viewModel)) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        _ngModelWarning('formControl', FormControlDirective, this, this._ngModelWarningConfig);
      }
      this.form.setValue(this.model);
      this.viewModel = this.model;
    }
  }
  ngOnDestroy() {
    if (this.form) {
      cleanUpControl(this.form, this, false);
    }
  }
  get path() {
    return [];
  }
  get control() {
    return this.form;
  }
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  _isControlChanged(changes) {
    return changes.hasOwnProperty('form');
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormControlDirective,
    deps: [{
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_VALUE_ACCESSOR,
      optional: true,
      self: true
    }, {
      token: NG_MODEL_WITH_FORM_CONTROL_WARNING,
      optional: true
    }, {
      token: CALL_SET_DISABLED_STATE,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: FormControlDirective,
    isStandalone: false,
    selector: "[formControl]",
    inputs: {
      form: ["formControl", "form"],
      isDisabled: ["disabled", "isDisabled"],
      model: ["ngModel", "model"]
    },
    outputs: {
      update: "ngModelChange"
    },
    providers: [formControlBinding],
    exportAs: ["ngForm"],
    usesInheritance: true,
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormControlDirective,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formControl]',
      providers: [formControlBinding],
      exportAs: 'ngForm',
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }]
  }],
  propDecorators: {
    form: [{
      type: Input,
      args: ['formControl']
    }],
    isDisabled: [{
      type: Input,
      args: ['disabled']
    }],
    model: [{
      type: Input,
      args: ['ngModel']
    }],
    update: [{
      type: Output,
      args: ['ngModelChange']
    }]
  }
});

const formGroupNameProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupName)
};
class FormGroupName extends AbstractFormGroupDirective {
  name = null;
  constructor(parent, validators, asyncValidators) {
    super();
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  _checkParentType() {
    if (hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw groupParentException();
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormGroupName,
    deps: [{
      token: ControlContainer,
      host: true,
      optional: true,
      skipSelf: true
    }, {
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: FormGroupName,
    isStandalone: false,
    selector: "[formGroupName]",
    inputs: {
      name: ["formGroupName", "name"]
    },
    providers: [formGroupNameProvider],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormGroupName,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formGroupName]',
      providers: [formGroupNameProvider],
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }],
  propDecorators: {
    name: [{
      type: Input,
      args: ['formGroupName']
    }]
  }
});
const formArrayNameProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormArrayName)
};
class FormArrayName extends ControlContainer {
  _parent;
  name = null;
  constructor(parent, validators, asyncValidators) {
    super();
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
  }
  ngOnInit() {
    if (hasInvalidParent(this._parent) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw arrayParentException();
    }
    this.formDirective.addFormArray(this);
  }
  ngOnDestroy() {
    this.formDirective?.removeFormArray(this);
  }
  get control() {
    return this.formDirective.getFormArray(this);
  }
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormArrayName,
    deps: [{
      token: ControlContainer,
      host: true,
      optional: true,
      skipSelf: true
    }, {
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: FormArrayName,
    isStandalone: false,
    selector: "[formArrayName]",
    inputs: {
      name: ["formArrayName", "name"]
    },
    providers: [formArrayNameProvider],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormArrayName,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formArrayName]',
      providers: [formArrayNameProvider],
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }],
  propDecorators: {
    name: [{
      type: Input,
      args: ['formArrayName']
    }]
  }
});
function hasInvalidParent(parent) {
  return !(parent instanceof FormGroupName) && !(parent instanceof AbstractFormDirective) && !(parent instanceof FormArrayName);
}

const controlNameBinding = {
  provide: NgControl,
  useExisting: forwardRef(() => FormControlName)
};
class FormControlName extends NgControl {
  _ngModelWarningConfig;
  _added = false;
  viewModel;
  control;
  name = null;
  set isDisabled(isDisabled) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      console.warn(disabledAttrWarning);
    }
  }
  model;
  update = new EventEmitter();
  static _ngModelWarningSentOnce = false;
  _ngModelWarningSent = false;
  constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
    super();
    this._ngModelWarningConfig = _ngModelWarningConfig;
    this._parent = parent;
    this._setValidators(validators);
    this._setAsyncValidators(asyncValidators);
    this.valueAccessor = selectValueAccessor(this, valueAccessors);
  }
  ngOnChanges(changes) {
    if (!this._added) this._setUpControl();
    if (isPropertyUpdated(changes, this.viewModel)) {
      if (typeof ngDevMode === 'undefined' || ngDevMode) {
        _ngModelWarning('formControlName', FormControlName, this, this._ngModelWarningConfig);
      }
      this.viewModel = this.model;
      this.formDirective.updateModel(this, this.model);
    }
  }
  ngOnDestroy() {
    if (this.formDirective) {
      this.formDirective.removeControl(this);
    }
  }
  viewToModelUpdate(newValue) {
    this.viewModel = newValue;
    this.update.emit(newValue);
  }
  get path() {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }
  get formDirective() {
    return this._parent ? this._parent.formDirective : null;
  }
  _setUpControl() {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      checkParentType(this._parent, this.name);
    }
    this.control = this.formDirective.addControl(this);
    this._added = true;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormControlName,
    deps: [{
      token: ControlContainer,
      host: true,
      optional: true,
      skipSelf: true
    }, {
      token: NG_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_ASYNC_VALIDATORS,
      optional: true,
      self: true
    }, {
      token: NG_VALUE_ACCESSOR,
      optional: true,
      self: true
    }, {
      token: NG_MODEL_WITH_FORM_CONTROL_WARNING,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: FormControlName,
    isStandalone: false,
    selector: "[formControlName]",
    inputs: {
      name: ["formControlName", "name"],
      isDisabled: ["disabled", "isDisabled"],
      model: ["ngModel", "model"]
    },
    outputs: {
      update: "ngModelChange"
    },
    providers: [controlNameBinding],
    usesInheritance: true,
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormControlName,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formControlName]',
      providers: [controlNameBinding],
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: ControlContainer,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }]
  }, {
    type: undefined,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }]
  }],
  propDecorators: {
    name: [{
      type: Input,
      args: ['formControlName']
    }],
    isDisabled: [{
      type: Input,
      args: ['disabled']
    }],
    model: [{
      type: Input,
      args: ['ngModel']
    }],
    update: [{
      type: Output,
      args: ['ngModelChange']
    }]
  }
});
function checkParentType(parent, name) {
  if (!(parent instanceof FormGroupName) && parent instanceof AbstractFormGroupDirective) {
    throw ngModelGroupException();
  } else if (!(parent instanceof FormGroupName) && !(parent instanceof AbstractFormDirective) && !(parent instanceof FormArrayName)) {
    throw controlParentException(name);
  }
}

const formDirectiveProvider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupDirective)
};
class FormGroupDirective extends AbstractFormDirective {
  form = null;
  ngSubmit = new EventEmitter();
  get control() {
    return this.form;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormGroupDirective,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: FormGroupDirective,
    isStandalone: false,
    selector: "[formGroup]",
    inputs: {
      form: ["formGroup", "form"]
    },
    outputs: {
      ngSubmit: "ngSubmit"
    },
    host: {
      listeners: {
        "submit": "onSubmit($event)",
        "reset": "onReset()"
      }
    },
    providers: [formDirectiveProvider],
    exportAs: ["ngForm"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormGroupDirective,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formGroup]',
      providers: [formDirectiveProvider],
      host: {
        '(submit)': 'onSubmit($event)',
        '(reset)': 'onReset()'
      },
      exportAs: 'ngForm',
      standalone: false
    }]
  }],
  propDecorators: {
    form: [{
      type: Input,
      args: ['formGroup']
    }],
    ngSubmit: [{
      type: Output
    }]
  }
});

const SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlValueAccessor),
  multi: true
};
function _buildValueString$1(id, value) {
  if (id == null) return `${value}`;
  if (value && typeof value === 'object') value = 'Object';
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId$1(valueString) {
  return valueString.split(':')[0];
}
class SelectControlValueAccessor extends BuiltInControlValueAccessor {
  value;
  _optionMap = new Map();
  _idCounter = 0;
  set compareWith(fn) {
    if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw new _RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }
  _compareWith = Object.is;
  appRefInjector = inject(ApplicationRef).injector;
  destroyRef = inject(DestroyRef);
  cdr = inject(ChangeDetectorRef);
  _queuedWrite = false;
  _writeValueAfterRender() {
    if (this._queuedWrite || this.appRefInjector.destroyed) {
      return;
    }
    this._queuedWrite = true;
    afterNextRender({
      write: () => {
        if (this.destroyRef.destroyed) {
          return;
        }
        this._queuedWrite = false;
        this.writeValue(this.value);
      }
    }, {
      injector: this.appRefInjector
    });
  }
  writeValue(value) {
    this.cdr.markForCheck();
    this.value = value;
    const id = this._getOptionId(value);
    const valueString = _buildValueString$1(id, value);
    this.setProperty('value', valueString);
  }
  registerOnChange(fn) {
    this.onChange = valueString => {
      this.value = this._getOptionValue(valueString);
      fn(this.value);
    };
  }
  _registerOption() {
    return (this._idCounter++).toString();
  }
  _getOptionId(value) {
    for (const id of this._optionMap.keys()) {
      if (this._compareWith(this._optionMap.get(id), value)) return id;
    }
    return null;
  }
  _getOptionValue(valueString) {
    const id = _extractId$1(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: SelectControlValueAccessor,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: SelectControlValueAccessor,
    isStandalone: false,
    selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]",
    inputs: {
      compareWith: "compareWith"
    },
    host: {
      listeners: {
        "change": "onChange($any($event.target).value)",
        "blur": "onTouched()"
      }
    },
    providers: [SELECT_VALUE_ACCESSOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: SelectControlValueAccessor,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
      host: {
        '(change)': 'onChange($any($event.target).value)',
        '(blur)': 'onTouched()'
      },
      providers: [SELECT_VALUE_ACCESSOR],
      standalone: false
    }]
  }],
  propDecorators: {
    compareWith: [{
      type: Input
    }]
  }
});
class NgSelectOption {
  _element;
  _renderer;
  _select;
  id;
  constructor(_element, _renderer, _select) {
    this._element = _element;
    this._renderer = _renderer;
    this._select = _select;
    if (this._select) this.id = this._select._registerOption();
  }
  set ngValue(value) {
    if (this._select == null) return;
    this._select._optionMap.set(this.id, value);
    this._setElementValue(_buildValueString$1(this.id, value));
    this._select._writeValueAfterRender();
  }
  set value(value) {
    this._setElementValue(value);
    if (this._select) this._select._writeValueAfterRender();
  }
  _setElementValue(value) {
    this._renderer.setProperty(this._element.nativeElement, 'value', value);
  }
  ngOnDestroy() {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select._writeValueAfterRender();
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NgSelectOption,
    deps: [{
      token: i0.ElementRef
    }, {
      token: i0.Renderer2
    }, {
      token: SelectControlValueAccessor,
      host: true,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: NgSelectOption,
    isStandalone: false,
    selector: "option",
    inputs: {
      ngValue: "ngValue",
      value: "value"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NgSelectOption,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'option',
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: i0.ElementRef
  }, {
    type: i0.Renderer2
  }, {
    type: SelectControlValueAccessor,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }],
  propDecorators: {
    ngValue: [{
      type: Input,
      args: ['ngValue']
    }],
    value: [{
      type: Input,
      args: ['value']
    }]
  }
});

const SELECT_MULTIPLE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
  multi: true
};
function _buildValueString(id, value) {
  if (id == null) return `${value}`;
  if (typeof value === 'string') value = `'${value}'`;
  if (value && typeof value === 'object') value = 'Object';
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId(valueString) {
  return valueString.split(':')[0];
}
class SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor {
  value;
  _optionMap = new Map();
  _idCounter = 0;
  set compareWith(fn) {
    if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw new _RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }
  _compareWith = Object.is;
  writeValue(value) {
    this.value = value;
    let optionSelectedStateSetter;
    if (Array.isArray(value)) {
      const ids = value.map(v => this._getOptionId(v));
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(ids.indexOf(o.toString()) > -1);
      };
    } else {
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(false);
      };
    }
    this._optionMap.forEach(optionSelectedStateSetter);
  }
  registerOnChange(fn) {
    this.onChange = element => {
      const selected = [];
      const selectedOptions = element.selectedOptions;
      if (selectedOptions !== undefined) {
        const options = selectedOptions;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          const val = this._getOptionValue(opt.value);
          selected.push(val);
        }
      } else {
        const options = element.options;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          if (opt.selected) {
            const val = this._getOptionValue(opt.value);
            selected.push(val);
          }
        }
      }
      this.value = selected;
      fn(selected);
    };
  }
  _registerOption(value) {
    const id = (this._idCounter++).toString();
    this._optionMap.set(id, value);
    return id;
  }
  _getOptionId(value) {
    for (const id of this._optionMap.keys()) {
      if (this._compareWith(this._optionMap.get(id)._value, value)) return id;
    }
    return null;
  }
  _getOptionValue(valueString) {
    const id = _extractId(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: SelectMultipleControlValueAccessor,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: SelectMultipleControlValueAccessor,
    isStandalone: false,
    selector: "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]",
    inputs: {
      compareWith: "compareWith"
    },
    host: {
      listeners: {
        "change": "onChange($event.target)",
        "blur": "onTouched()"
      }
    },
    providers: [SELECT_MULTIPLE_VALUE_ACCESSOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: SelectMultipleControlValueAccessor,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
      host: {
        '(change)': 'onChange($event.target)',
        '(blur)': 'onTouched()'
      },
      providers: [SELECT_MULTIPLE_VALUE_ACCESSOR],
      standalone: false
    }]
  }],
  propDecorators: {
    compareWith: [{
      type: Input
    }]
  }
});
class ɵNgSelectMultipleOption {
  _element;
  _renderer;
  _select;
  id;
  _value;
  constructor(_element, _renderer, _select) {
    this._element = _element;
    this._renderer = _renderer;
    this._select = _select;
    if (this._select) {
      this.id = this._select._registerOption(this);
    }
  }
  set ngValue(value) {
    if (this._select == null) return;
    this._value = value;
    this._setElementValue(_buildValueString(this.id, value));
    this._select.writeValue(this._select.value);
  }
  set value(value) {
    if (this._select) {
      this._value = value;
      this._setElementValue(_buildValueString(this.id, value));
      this._select.writeValue(this._select.value);
    } else {
      this._setElementValue(value);
    }
  }
  _setElementValue(value) {
    this._renderer.setProperty(this._element.nativeElement, 'value', value);
  }
  _setSelected(selected) {
    this._renderer.setProperty(this._element.nativeElement, 'selected', selected);
  }
  ngOnDestroy() {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ɵNgSelectMultipleOption,
    deps: [{
      token: i0.ElementRef
    }, {
      token: i0.Renderer2
    }, {
      token: SelectMultipleControlValueAccessor,
      host: true,
      optional: true
    }],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: ɵNgSelectMultipleOption,
    isStandalone: false,
    selector: "option",
    inputs: {
      ngValue: "ngValue",
      value: "value"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: ɵNgSelectMultipleOption,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'option',
      standalone: false
    }]
  }],
  ctorParameters: () => [{
    type: i0.ElementRef
  }, {
    type: i0.Renderer2
  }, {
    type: SelectMultipleControlValueAccessor,
    decorators: [{
      type: Optional
    }, {
      type: Host
    }]
  }],
  propDecorators: {
    ngValue: [{
      type: Input,
      args: ['ngValue']
    }],
    value: [{
      type: Input,
      args: ['value']
    }]
  }
});

function toInteger(value) {
  return typeof value === 'number' ? value : parseInt(value, 10);
}
function toFloat(value) {
  return typeof value === 'number' ? value : parseFloat(value);
}
class AbstractValidatorDirective {
  _validator = nullValidator;
  _onChange;
  _enabled;
  ngOnChanges(changes) {
    if (this.inputName in changes) {
      const input = this.normalizeInput(changes[this.inputName].currentValue);
      this._enabled = this.enabled(input);
      this._validator = this._enabled ? this.createValidator(input) : nullValidator;
      if (this._onChange) {
        this._onChange();
      }
    }
  }
  validate(control) {
    return this._validator(control);
  }
  registerOnValidatorChange(fn) {
    this._onChange = fn;
  }
  enabled(input) {
    return input != null;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: AbstractValidatorDirective,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: AbstractValidatorDirective,
    isStandalone: true,
    usesOnChanges: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: AbstractValidatorDirective,
  decorators: [{
    type: Directive
  }]
});
const MAX_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxValidator),
  multi: true
};
class MaxValidator extends AbstractValidatorDirective {
  max;
  inputName = 'max';
  normalizeInput = input => toFloat(input);
  createValidator = max => maxValidator(max);
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: MaxValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: MaxValidator,
    isStandalone: false,
    selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]",
    inputs: {
      max: "max"
    },
    host: {
      properties: {
        "attr.max": "_enabled ? max : null"
      }
    },
    providers: [MAX_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: MaxValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]',
      providers: [MAX_VALIDATOR],
      host: {
        '[attr.max]': '_enabled ? max : null'
      },
      standalone: false
    }]
  }],
  propDecorators: {
    max: [{
      type: Input
    }]
  }
});
const MIN_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinValidator),
  multi: true
};
class MinValidator extends AbstractValidatorDirective {
  min;
  inputName = 'min';
  normalizeInput = input => toFloat(input);
  createValidator = min => minValidator(min);
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: MinValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: MinValidator,
    isStandalone: false,
    selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]",
    inputs: {
      min: "min"
    },
    host: {
      properties: {
        "attr.min": "_enabled ? min : null"
      }
    },
    providers: [MIN_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: MinValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]',
      providers: [MIN_VALIDATOR],
      host: {
        '[attr.min]': '_enabled ? min : null'
      },
      standalone: false
    }]
  }],
  propDecorators: {
    min: [{
      type: Input
    }]
  }
});
const REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => RequiredValidator),
  multi: true
};
const CHECKBOX_REQUIRED_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CheckboxRequiredValidator),
  multi: true
};
class RequiredValidator extends AbstractValidatorDirective {
  required;
  inputName = 'required';
  normalizeInput = booleanAttribute;
  createValidator = input => requiredValidator;
  enabled(input) {
    return input;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: RequiredValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: RequiredValidator,
    isStandalone: false,
    selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]",
    inputs: {
      required: "required"
    },
    host: {
      properties: {
        "attr.required": "_enabled ? \"\" : null"
      }
    },
    providers: [REQUIRED_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: RequiredValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
      providers: [REQUIRED_VALIDATOR],
      host: {
        '[attr.required]': '_enabled ? "" : null'
      },
      standalone: false
    }]
  }],
  propDecorators: {
    required: [{
      type: Input
    }]
  }
});
class CheckboxRequiredValidator extends RequiredValidator {
  createValidator = input => requiredTrueValidator;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: CheckboxRequiredValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: CheckboxRequiredValidator,
    isStandalone: false,
    selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]",
    host: {
      properties: {
        "attr.required": "_enabled ? \"\" : null"
      }
    },
    providers: [CHECKBOX_REQUIRED_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: CheckboxRequiredValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
      providers: [CHECKBOX_REQUIRED_VALIDATOR],
      host: {
        '[attr.required]': '_enabled ? "" : null'
      },
      standalone: false
    }]
  }]
});
const EMAIL_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EmailValidator),
  multi: true
};
class EmailValidator extends AbstractValidatorDirective {
  email;
  inputName = 'email';
  normalizeInput = booleanAttribute;
  createValidator = input => emailValidator;
  enabled(input) {
    return input;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: EmailValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: EmailValidator,
    isStandalone: false,
    selector: "[email][formControlName],[email][formControl],[email][ngModel]",
    inputs: {
      email: "email"
    },
    providers: [EMAIL_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: EmailValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[email][formControlName],[email][formControl],[email][ngModel]',
      providers: [EMAIL_VALIDATOR],
      standalone: false
    }]
  }],
  propDecorators: {
    email: [{
      type: Input
    }]
  }
});
const MIN_LENGTH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinLengthValidator),
  multi: true
};
class MinLengthValidator extends AbstractValidatorDirective {
  minlength;
  inputName = 'minlength';
  normalizeInput = input => toInteger(input);
  createValidator = minlength => minLengthValidator(minlength);
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: MinLengthValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: MinLengthValidator,
    isStandalone: false,
    selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]",
    inputs: {
      minlength: "minlength"
    },
    host: {
      properties: {
        "attr.minlength": "_enabled ? minlength : null"
      }
    },
    providers: [MIN_LENGTH_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: MinLengthValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
      providers: [MIN_LENGTH_VALIDATOR],
      host: {
        '[attr.minlength]': '_enabled ? minlength : null'
      },
      standalone: false
    }]
  }],
  propDecorators: {
    minlength: [{
      type: Input
    }]
  }
});
const MAX_LENGTH_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxLengthValidator),
  multi: true
};
class MaxLengthValidator extends AbstractValidatorDirective {
  maxlength;
  inputName = 'maxlength';
  normalizeInput = input => toInteger(input);
  createValidator = maxlength => maxLengthValidator(maxlength);
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: MaxLengthValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: MaxLengthValidator,
    isStandalone: false,
    selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]",
    inputs: {
      maxlength: "maxlength"
    },
    host: {
      properties: {
        "attr.maxlength": "_enabled ? maxlength : null"
      }
    },
    providers: [MAX_LENGTH_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: MaxLengthValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
      providers: [MAX_LENGTH_VALIDATOR],
      host: {
        '[attr.maxlength]': '_enabled ? maxlength : null'
      },
      standalone: false
    }]
  }],
  propDecorators: {
    maxlength: [{
      type: Input
    }]
  }
});
const PATTERN_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PatternValidator),
  multi: true
};
class PatternValidator extends AbstractValidatorDirective {
  pattern;
  inputName = 'pattern';
  normalizeInput = input => input;
  createValidator = input => patternValidator(input);
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: PatternValidator,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    type: PatternValidator,
    isStandalone: false,
    selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]",
    inputs: {
      pattern: "pattern"
    },
    host: {
      properties: {
        "attr.pattern": "_enabled ? pattern : null"
      }
    },
    providers: [PATTERN_VALIDATOR],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: PatternValidator,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
      providers: [PATTERN_VALIDATOR],
      host: {
        '[attr.pattern]': '_enabled ? pattern : null'
      },
      standalone: false
    }]
  }],
  propDecorators: {
    pattern: [{
      type: Input
    }]
  }
});

const SHARED_FORM_DIRECTIVES = [ɵNgNoValidate, NgSelectOption, ɵNgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator];
const TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
const REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormArrayDirective, FormControlName, FormGroupName, FormArrayName];
class ɵInternalFormsSharedModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ɵInternalFormsSharedModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ɵInternalFormsSharedModule,
    declarations: [ɵNgNoValidate, NgSelectOption, ɵNgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator],
    exports: [ɵNgNoValidate, NgSelectOption, ɵNgSelectMultipleOption, DefaultValueAccessor, NumberValueAccessor, RangeValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, SelectMultipleControlValueAccessor, RadioControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, MinLengthValidator, MaxLengthValidator, PatternValidator, CheckboxRequiredValidator, EmailValidator, MinValidator, MaxValidator]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ɵInternalFormsSharedModule
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: ɵInternalFormsSharedModule,
  decorators: [{
    type: NgModule,
    args: [{
      declarations: SHARED_FORM_DIRECTIVES,
      exports: SHARED_FORM_DIRECTIVES
    }]
  }]
});

function isAbstractControlOptions(options) {
  return !!options && (options.asyncValidators !== undefined || options.validators !== undefined || options.updateOn !== undefined);
}
class FormBuilder {
  useNonNullable = false;
  get nonNullable() {
    const nnfb = new FormBuilder();
    nnfb.useNonNullable = true;
    return nnfb;
  }
  group(controls, options = null) {
    const reducedControls = this._reduceControls(controls);
    let newOptions = {};
    if (isAbstractControlOptions(options)) {
      newOptions = options;
    } else if (options !== null) {
      newOptions.validators = options.validator;
      newOptions.asyncValidators = options.asyncValidator;
    }
    return new FormGroup(reducedControls, newOptions);
  }
  record(controls, options = null) {
    const reducedControls = this._reduceControls(controls);
    return new FormRecord(reducedControls, options);
  }
  control(formState, validatorOrOpts, asyncValidator) {
    let newOptions = {};
    if (!this.useNonNullable) {
      return new FormControl(formState, validatorOrOpts, asyncValidator);
    }
    if (isAbstractControlOptions(validatorOrOpts)) {
      newOptions = validatorOrOpts;
    } else {
      newOptions.validators = validatorOrOpts;
      newOptions.asyncValidators = asyncValidator;
    }
    return new FormControl(formState, {
      ...newOptions,
      nonNullable: true
    });
  }
  array(controls, validatorOrOpts, asyncValidator) {
    const createdControls = controls.map(c => this._createControl(c));
    return new FormArray(createdControls, validatorOrOpts, asyncValidator);
  }
  _reduceControls(controls) {
    const createdControls = {};
    Object.keys(controls).forEach(controlName => {
      createdControls[controlName] = this._createControl(controls[controlName]);
    });
    return createdControls;
  }
  _createControl(controls) {
    if (controls instanceof FormControl) {
      return controls;
    } else if (controls instanceof AbstractControl) {
      return controls;
    } else if (Array.isArray(controls)) {
      const value = controls[0];
      const validator = controls.length > 1 ? controls[1] : null;
      const asyncValidator = controls.length > 2 ? controls[2] : null;
      return this.control(value, validator, asyncValidator);
    } else {
      return this.control(controls);
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormBuilder,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormBuilder,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormBuilder,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }]
});
class NonNullableFormBuilder {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NonNullableFormBuilder,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: NonNullableFormBuilder,
    providedIn: 'root',
    useFactory: () => inject(FormBuilder).nonNullable
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: NonNullableFormBuilder,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root',
      useFactory: () => inject(FormBuilder).nonNullable
    }]
  }]
});
class UntypedFormBuilder extends FormBuilder {
  group(controlsConfig, options = null) {
    return super.group(controlsConfig, options);
  }
  control(formState, validatorOrOpts, asyncValidator) {
    return super.control(formState, validatorOrOpts, asyncValidator);
  }
  array(controlsConfig, validatorOrOpts, asyncValidator) {
    return super.array(controlsConfig, validatorOrOpts, asyncValidator);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: UntypedFormBuilder,
    deps: null,
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: UntypedFormBuilder,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: UntypedFormBuilder,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }]
});

const VERSION = new Version('21.0.0-rc.0+sha-20b4b2c');

class FormsModule {
  static withConfig(opts) {
    return {
      ngModule: FormsModule,
      providers: [{
        provide: CALL_SET_DISABLED_STATE,
        useValue: opts.callSetDisabledState ?? setDisabledStateDefault
      }]
    };
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormsModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormsModule,
    declarations: [NgModel, NgModelGroup, NgForm],
    exports: [ɵInternalFormsSharedModule, NgModel, NgModelGroup, NgForm]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: FormsModule,
    imports: [ɵInternalFormsSharedModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: FormsModule,
  decorators: [{
    type: NgModule,
    args: [{
      declarations: TEMPLATE_DRIVEN_DIRECTIVES,
      exports: [ɵInternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
    }]
  }]
});
class ReactiveFormsModule {
  static withConfig(opts) {
    return {
      ngModule: ReactiveFormsModule,
      providers: [{
        provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
        useValue: opts.warnOnNgModelWithFormControl ?? 'always'
      }, {
        provide: CALL_SET_DISABLED_STATE,
        useValue: opts.callSetDisabledState ?? setDisabledStateDefault
      }]
    };
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ReactiveFormsModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ReactiveFormsModule,
    declarations: [FormControlDirective, FormGroupDirective, FormArrayDirective, FormControlName, FormGroupName, FormArrayName],
    exports: [ɵInternalFormsSharedModule, FormControlDirective, FormGroupDirective, FormArrayDirective, FormControlName, FormGroupName, FormArrayName]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0-rc.0+sha-20b4b2c",
    ngImport: i0,
    type: ReactiveFormsModule,
    imports: [ɵInternalFormsSharedModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.0+sha-20b4b2c",
  ngImport: i0,
  type: ReactiveFormsModule,
  decorators: [{
    type: NgModule,
    args: [{
      declarations: [REACTIVE_DRIVEN_DIRECTIVES],
      exports: [ɵInternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
    }]
  }]
});

export { AbstractControl, AbstractControlDirective, AbstractFormDirective, AbstractFormGroupDirective, COMPOSITION_BUFFER_MODE, CheckboxControlValueAccessor, CheckboxRequiredValidator, ControlContainer, ControlEvent, DefaultValueAccessor, EmailValidator, FormArray, FormArrayDirective, FormArrayName, FormBuilder, FormControl, FormControlDirective, FormControlName, FormGroup, FormGroupDirective, FormGroupName, FormRecord, FormResetEvent, FormSubmittedEvent, FormsModule, MaxLengthValidator, MaxValidator, MinLengthValidator, MinValidator, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, NgControlStatus, NgControlStatusGroup, NgForm, NgModel, NgModelGroup, NgSelectOption, NonNullableFormBuilder, NumberValueAccessor, PatternValidator, PristineChangeEvent, RadioControlValueAccessor, RangeValueAccessor, ReactiveFormsModule, RequiredValidator, SelectControlValueAccessor, SelectMultipleControlValueAccessor, StatusChangeEvent, TouchedChangeEvent, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, VERSION, Validators, ValueChangeEvent, isFormArray, isFormControl, isFormGroup, isFormRecord, ɵInternalFormsSharedModule, ɵNgNoValidate, ɵNgSelectMultipleOption };
//# sourceMappingURL=forms.mjs.map
