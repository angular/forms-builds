/**
 * @license Angular v21.2.0-rc.0+sha-eb6bce0
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { InjectionToken, ɵisPromise as _isPromise, resource, linkedSignal, inject, ɵRuntimeError as _RuntimeError, untracked, input, Renderer2, DestroyRef, computed, Injector, ElementRef, signal, afterRenderEffect, effect, ɵformatRuntimeError as _formatRuntimeError, Directive } from '@angular/core';
import { assertPathIsCurrent, FieldPathNode, addDefaultField, metadata, createMetadataKey, MAX, MAX_LENGTH, MIN, MIN_LENGTH, PATTERN, REQUIRED, createManagedMetadataKey, DEBOUNCER, signalErrorsToValidationErrors, submit } from './_validation_errors-chunk.mjs';
export { MetadataKey, MetadataReducer, apply, applyEach, applyWhen, applyWhenValue, form, schema } from './_validation_errors-chunk.mjs';
import { httpResource } from '@angular/common/http';
import { Validators, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import '@angular/core/primitives/signals';

const SIGNAL_FORMS_CONFIG = new InjectionToken(typeof ngDevMode !== 'undefined' && ngDevMode ? 'SIGNAL_FORMS_CONFIG' : '');

function provideSignalFormsConfig(config) {
  return [{
    provide: SIGNAL_FORMS_CONFIG,
    useValue: config
  }];
}

function disabled(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addDisabledReasonRule(ctx => {
    let result = true;
    if (typeof logic === 'string') {
      result = logic;
    } else if (logic) {
      result = logic(ctx);
    }
    if (typeof result === 'string') {
      return {
        fieldTree: ctx.fieldTree,
        message: result
      };
    }
    return result ? {
      fieldTree: ctx.fieldTree
    } : undefined;
  });
}

function hidden(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addHiddenRule(logic);
}

function readonly(path, logic = () => true) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addReadonlyRule(logic);
}

function getLengthOrSize(value) {
  const v = value;
  return typeof v.length === 'number' ? v.length : v.size;
}
function getOption(opt, ctx) {
  return opt instanceof Function ? opt(ctx) : opt;
}
function isEmpty(value) {
  if (typeof value === 'number') {
    return isNaN(value);
  }
  return value === '' || value === false || value == null;
}
function normalizeErrors(error) {
  if (error === undefined) {
    return [];
  }
  if (Array.isArray(error)) {
    return error;
  }
  return [error];
}

function validate(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addSyncErrorRule(ctx => {
    return addDefaultField(logic(ctx), ctx.fieldTree);
  });
}

function requiredError(options) {
  return new RequiredValidationError(options);
}
function minError(min, options) {
  return new MinValidationError(min, options);
}
function maxError(max, options) {
  return new MaxValidationError(max, options);
}
function minLengthError(minLength, options) {
  return new MinLengthValidationError(minLength, options);
}
function maxLengthError(maxLength, options) {
  return new MaxLengthValidationError(maxLength, options);
}
function patternError(pattern, options) {
  return new PatternValidationError(pattern, options);
}
function emailError(options) {
  return new EmailValidationError(options);
}
class BaseNgValidationError {
  __brand = undefined;
  kind = '';
  fieldTree;
  message;
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
}
class RequiredValidationError extends BaseNgValidationError {
  kind = 'required';
}
class MinValidationError extends BaseNgValidationError {
  min;
  kind = 'min';
  constructor(min, options) {
    super(options);
    this.min = min;
  }
}
class MaxValidationError extends BaseNgValidationError {
  max;
  kind = 'max';
  constructor(max, options) {
    super(options);
    this.max = max;
  }
}
class MinLengthValidationError extends BaseNgValidationError {
  minLength;
  kind = 'minLength';
  constructor(minLength, options) {
    super(options);
    this.minLength = minLength;
  }
}
class MaxLengthValidationError extends BaseNgValidationError {
  maxLength;
  kind = 'maxLength';
  constructor(maxLength, options) {
    super(options);
    this.maxLength = maxLength;
  }
}
class PatternValidationError extends BaseNgValidationError {
  pattern;
  kind = 'pattern';
  constructor(pattern, options) {
    super(options);
    this.pattern = pattern;
  }
}
class EmailValidationError extends BaseNgValidationError {
  kind = 'email';
}
class NativeInputParseError extends BaseNgValidationError {
  kind = 'parse';
}
const NgValidationError = BaseNgValidationError;

const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
function email(path, config) {
  validate(path, ctx => {
    if (isEmpty(ctx.value())) {
      return undefined;
    }
    if (!EMAIL_REGEXP.test(ctx.value())) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return emailError({
          message: getOption(config?.message, ctx)
        });
      }
    }
    return undefined;
  });
}

function max(path, maxValue, config) {
  const MAX_MEMO = metadata(path, createMetadataKey(), ctx => typeof maxValue === 'number' ? maxValue : maxValue(ctx));
  metadata(path, MAX, ({
    state
  }) => state.metadata(MAX_MEMO)());
  validate(path, ctx => {
    if (isEmpty(ctx.value())) {
      return undefined;
    }
    const max = ctx.state.metadata(MAX_MEMO)();
    if (max === undefined || Number.isNaN(max)) {
      return undefined;
    }
    const value = ctx.value();
    const numValue = !value && value !== 0 ? NaN : Number(value);
    if (numValue > max) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return maxError(max, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return undefined;
  });
}

function maxLength(path, maxLength, config) {
  const MAX_LENGTH_MEMO = metadata(path, createMetadataKey(), ctx => typeof maxLength === 'number' ? maxLength : maxLength(ctx));
  metadata(path, MAX_LENGTH, ({
    state
  }) => state.metadata(MAX_LENGTH_MEMO)());
  validate(path, ctx => {
    if (isEmpty(ctx.value())) {
      return undefined;
    }
    const maxLength = ctx.state.metadata(MAX_LENGTH_MEMO)();
    if (maxLength === undefined) {
      return undefined;
    }
    if (getLengthOrSize(ctx.value()) > maxLength) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return maxLengthError(maxLength, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return undefined;
  });
}

function min(path, minValue, config) {
  const MIN_MEMO = metadata(path, createMetadataKey(), ctx => typeof minValue === 'number' ? minValue : minValue(ctx));
  metadata(path, MIN, ({
    state
  }) => state.metadata(MIN_MEMO)());
  validate(path, ctx => {
    if (isEmpty(ctx.value())) {
      return undefined;
    }
    const min = ctx.state.metadata(MIN_MEMO)();
    if (min === undefined || Number.isNaN(min)) {
      return undefined;
    }
    const value = ctx.value();
    const numValue = !value && value !== 0 ? NaN : Number(value);
    if (numValue < min) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return minError(min, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return undefined;
  });
}

function minLength(path, minLength, config) {
  const MIN_LENGTH_MEMO = metadata(path, createMetadataKey(), ctx => typeof minLength === 'number' ? minLength : minLength(ctx));
  metadata(path, MIN_LENGTH, ({
    state
  }) => state.metadata(MIN_LENGTH_MEMO)());
  validate(path, ctx => {
    if (isEmpty(ctx.value())) {
      return undefined;
    }
    const minLength = ctx.state.metadata(MIN_LENGTH_MEMO)();
    if (minLength === undefined) {
      return undefined;
    }
    if (getLengthOrSize(ctx.value()) < minLength) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return minLengthError(minLength, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return undefined;
  });
}

function pattern(path, pattern, config) {
  const PATTERN_MEMO = metadata(path, createMetadataKey(), ctx => pattern instanceof RegExp ? pattern : pattern(ctx));
  metadata(path, PATTERN, ({
    state
  }) => state.metadata(PATTERN_MEMO)());
  validate(path, ctx => {
    if (isEmpty(ctx.value())) {
      return undefined;
    }
    const pattern = ctx.state.metadata(PATTERN_MEMO)();
    if (pattern === undefined) {
      return undefined;
    }
    if (!pattern.test(ctx.value())) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return patternError(pattern, {
          message: getOption(config?.message, ctx)
        });
      }
    }
    return undefined;
  });
}

function required(path, config) {
  const REQUIRED_MEMO = metadata(path, createMetadataKey(), ctx => config?.when ? config.when(ctx) : true);
  metadata(path, REQUIRED, ({
    state
  }) => state.metadata(REQUIRED_MEMO)());
  validate(path, ctx => {
    if (ctx.state.metadata(REQUIRED_MEMO)() && isEmpty(ctx.value())) {
      if (config?.error) {
        return getOption(config.error, ctx);
      } else {
        return requiredError({
          message: getOption(config?.message, ctx)
        });
      }
    }
    return undefined;
  });
}

function validateAsync(path, opts) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  const RESOURCE = createManagedMetadataKey(opts.factory);
  metadata(path, RESOURCE, ctx => {
    const node = ctx.stateOf(path);
    const validationState = node.validationState;
    if (validationState.shouldSkipValidation() || !validationState.syncValid()) {
      return undefined;
    }
    return opts.params(ctx);
  });
  pathNode.builder.addAsyncErrorRule(ctx => {
    const res = ctx.state.metadata(RESOURCE);
    let errors;
    switch (res.status()) {
      case 'idle':
        return undefined;
      case 'loading':
      case 'reloading':
        return 'pending';
      case 'resolved':
      case 'local':
        if (!res.hasValue()) {
          return undefined;
        }
        errors = opts.onSuccess(res.value(), ctx);
        return addDefaultField(errors, ctx.fieldTree);
      case 'error':
        errors = opts.onError(res.error(), ctx);
        return addDefaultField(errors, ctx.fieldTree);
    }
  });
}

function validateTree(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addSyncTreeErrorRule(ctx => addDefaultField(logic(ctx), ctx.fieldTree));
}

function validateStandardSchema(path, schema) {
  const VALIDATOR_MEMO = metadata(path, createMetadataKey(), ctx => {
    const resolvedSchema = typeof schema === 'function' ? schema(ctx) : schema;
    return resolvedSchema ? resolvedSchema['~standard'].validate(ctx.value()) : undefined;
  });
  validateTree(path, ({
    state,
    fieldTreeOf
  }) => {
    const result = state.metadata(VALIDATOR_MEMO)();
    if (!result || _isPromise(result)) {
      return [];
    }
    return result?.issues?.map(issue => standardIssueToFormTreeError(fieldTreeOf(path), issue)) ?? [];
  });
  validateAsync(path, {
    params: ({
      state
    }) => {
      const result = state.metadata(VALIDATOR_MEMO)();
      return result && _isPromise(result) ? result : undefined;
    },
    factory: params => {
      return resource({
        params,
        loader: async ({
          params
        }) => (await params)?.issues ?? []
      });
    },
    onSuccess: (issues, {
      fieldTreeOf
    }) => {
      return issues.map(issue => standardIssueToFormTreeError(fieldTreeOf(path), issue));
    },
    onError: () => {}
  });
}
function standardSchemaError(issue, options) {
  return new StandardSchemaValidationError(issue, options);
}
function standardIssueToFormTreeError(fieldTree, issue) {
  let target = fieldTree;
  for (const pathPart of issue.path ?? []) {
    const pathKey = typeof pathPart === 'object' ? pathPart.key : pathPart;
    target = target[pathKey];
  }
  return addDefaultField(standardSchemaError(issue, {
    message: issue.message
  }), target);
}
class StandardSchemaValidationError extends BaseNgValidationError {
  issue;
  kind = 'standardSchema';
  constructor(issue, options) {
    super(options);
    this.issue = issue;
  }
}

function validateHttp(path, opts) {
  validateAsync(path, {
    params: opts.request,
    factory: request => httpResource(request, opts.options),
    onSuccess: opts.onSuccess,
    onError: opts.onError
  });
}

function debounce(path, durationOrDebouncer) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  const debouncer = typeof durationOrDebouncer === 'function' ? durationOrDebouncer : durationOrDebouncer > 0 ? debounceForDuration(durationOrDebouncer) : immediate;
  pathNode.builder.addMetadataRule(DEBOUNCER, () => debouncer);
}
function debounceForDuration(durationInMilliseconds) {
  return (_context, abortSignal) => {
    return new Promise(resolve => {
      let timeoutId;
      const onAbort = () => {
        clearTimeout(timeoutId);
        resolve();
      };
      timeoutId = setTimeout(() => {
        abortSignal.removeEventListener('abort', onAbort);
        resolve();
      }, durationInMilliseconds);
      abortSignal.addEventListener('abort', onAbort, {
        once: true
      });
    });
  };
}
function immediate() {}

const FORM_FIELD_PARSE_ERRORS = new InjectionToken(typeof ngDevMode !== 'undefined' && ngDevMode ? 'FORM_FIELD_PARSE_ERRORS' : '');

function createParser(getValue, setValue, parse) {
  const errors = linkedSignal({
    ...(ngDevMode ? {
      debugName: "errors"
    } : {}),
    source: getValue,
    computation: () => []
  });
  const setRawValue = rawValue => {
    const result = parse(rawValue);
    errors.set(normalizeErrors(result.error));
    if (result.value !== undefined) {
      setValue(result.value);
    }
    errors.set(normalizeErrors(result.error));
  };
  return {
    errors: errors.asReadonly(),
    setRawValue
  };
}

function transformedValue(value, options) {
  const {
    parse,
    format
  } = options;
  const parser = createParser(value, value.set, parse);
  const formFieldParseErrors = inject(FORM_FIELD_PARSE_ERRORS, {
    self: true,
    optional: true
  });
  if (formFieldParseErrors) {
    formFieldParseErrors.set(parser.errors);
  }
  const rawValue = linkedSignal(() => format(value()), ...(ngDevMode ? [{
    debugName: "rawValue"
  }] : []));
  const result = rawValue;
  result.parseErrors = parser.errors;
  const originalSet = result.set.bind(result);
  result.set = newRawValue => {
    parser.setRawValue(newRawValue);
    originalSet(newRawValue);
  };
  result.update = updateFn => {
    result.set(updateFn(rawValue()));
  };
  return result;
}

class InteropNgControl {
  field;
  constructor(field) {
    this.field = field;
  }
  control = this;
  get value() {
    return this.field().value();
  }
  get valid() {
    return this.field().valid();
  }
  get invalid() {
    return this.field().invalid();
  }
  get pending() {
    return this.field().pending();
  }
  get disabled() {
    return this.field().disabled();
  }
  get enabled() {
    return !this.field().disabled();
  }
  get errors() {
    return signalErrorsToValidationErrors(this.field().errors());
  }
  get pristine() {
    return !this.field().dirty();
  }
  get dirty() {
    return this.field().dirty();
  }
  get touched() {
    return this.field().touched();
  }
  get untouched() {
    return !this.field().touched();
  }
  get status() {
    if (this.field().disabled()) {
      return 'DISABLED';
    }
    if (this.field().valid()) {
      return 'VALID';
    }
    if (this.field().invalid()) {
      return 'INVALID';
    }
    if (this.field().pending()) {
      return 'PENDING';
    }
    throw new _RuntimeError(1910, ngDevMode && 'Unknown form control status');
  }
  valueAccessor = null;
  hasValidator(validator) {
    if (validator === Validators.required) {
      return this.field().required();
    }
    return false;
  }
  updateValueAndValidity() {}
}

const FIELD_STATE_KEY_TO_CONTROL_BINDING = {
  disabled: 'disabled',
  disabledReasons: 'disabledReasons',
  dirty: 'dirty',
  errors: 'errors',
  hidden: 'hidden',
  invalid: 'invalid',
  max: 'max',
  maxLength: 'maxLength',
  min: 'min',
  minLength: 'minLength',
  name: 'name',
  pattern: 'pattern',
  pending: 'pending',
  readonly: 'readonly',
  required: 'required',
  touched: 'touched'
};
const CONTROL_BINDING_TO_FIELD_STATE_KEY = /* @__PURE__ */(() => {
  const map = {};
  for (const key of Object.keys(FIELD_STATE_KEY_TO_CONTROL_BINDING)) {
    map[FIELD_STATE_KEY_TO_CONTROL_BINDING[key]] = key;
  }
  return map;
})();
function readFieldStateBindingValue(fieldState, key) {
  const property = CONTROL_BINDING_TO_FIELD_STATE_KEY[key];
  return fieldState[property]?.();
}
const CONTROL_BINDING_NAMES = /* @__PURE__ */(() => Object.values(FIELD_STATE_KEY_TO_CONTROL_BINDING))();
function createBindings() {
  return {};
}
function bindingUpdated(bindings, key, value) {
  if (bindings[key] !== value) {
    bindings[key] = value;
    return true;
  }
  return false;
}

function isNativeFormElement(element) {
  return element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA';
}
function isNumericFormElement(element) {
  if (element.tagName !== 'INPUT') {
    return false;
  }
  const type = element.type;
  return type === 'date' || type === 'datetime-local' || type === 'month' || type === 'number' || type === 'range' || type === 'time' || type === 'week';
}
function isTextualFormElement(element) {
  return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA';
}
function getNativeControlValue(element, currentValue) {
  let modelValue;
  if (element.validity.badInput) {
    return {
      error: new NativeInputParseError()
    };
  }
  switch (element.type) {
    case 'checkbox':
      return {
        value: element.checked
      };
    case 'number':
    case 'range':
    case 'datetime-local':
      modelValue = untracked(currentValue);
      if (typeof modelValue === 'number' || modelValue === null) {
        return {
          value: element.value === '' ? null : element.valueAsNumber
        };
      }
      break;
    case 'date':
    case 'month':
    case 'time':
    case 'week':
      modelValue = untracked(currentValue);
      if (modelValue === null || modelValue instanceof Date) {
        return {
          value: element.valueAsDate
        };
      } else if (typeof modelValue === 'number') {
        return {
          value: element.valueAsNumber
        };
      }
      break;
  }
  return {
    value: element.value
  };
}
function setNativeControlValue(element, value) {
  switch (element.type) {
    case 'checkbox':
      element.checked = value;
      return;
    case 'radio':
      element.checked = value === element.value;
      return;
    case 'number':
    case 'range':
    case 'datetime-local':
      if (typeof value === 'number') {
        setNativeNumberControlValue(element, value);
        return;
      } else if (value === null) {
        element.value = '';
        return;
      }
      break;
    case 'date':
    case 'month':
    case 'time':
    case 'week':
      if (value === null || value instanceof Date) {
        element.valueAsDate = value;
        return;
      } else if (typeof value === 'number') {
        setNativeNumberControlValue(element, value);
        return;
      }
  }
  element.value = value;
}
function setNativeNumberControlValue(element, value) {
  if (isNaN(value)) {
    element.value = '';
  } else {
    element.valueAsNumber = value;
  }
}
function setNativeDomProperty(renderer, element, name, value) {
  switch (name) {
    case 'name':
      renderer.setAttribute(element, name, value);
      break;
    case 'disabled':
    case 'readonly':
    case 'required':
      if (value) {
        renderer.setAttribute(element, name, '');
      } else {
        renderer.removeAttribute(element, name);
      }
      break;
    case 'max':
    case 'min':
    case 'minLength':
    case 'maxLength':
      if (value !== undefined) {
        renderer.setAttribute(element, name, value.toString());
      } else {
        renderer.removeAttribute(element, name);
      }
      break;
  }
}

function customControlCreate(host, parent) {
  host.listenToCustomControlModel(value => parent.state().controlValue.set(value));
  host.listenToCustomControlOutput('touchedChange', () => parent.state().markAsTouched());
  parent.registerAsBinding(host.customControl);
  const bindings = createBindings();
  return () => {
    const state = parent.state();
    const controlValue = state.controlValue();
    if (bindingUpdated(bindings, 'controlValue', controlValue)) {
      host.setCustomControlModelInput(controlValue);
    }
    for (const name of CONTROL_BINDING_NAMES) {
      let value;
      if (name === 'errors') {
        value = parent.errors();
      } else {
        value = readFieldStateBindingValue(state, name);
      }
      if (bindingUpdated(bindings, name, value)) {
        host.setInputOnDirectives(name, value);
        if (parent.elementAcceptsNativeProperty(name) && !host.customControlHasInput(name)) {
          setNativeDomProperty(parent.renderer, parent.nativeFormElement, name, value);
        }
      }
    }
  };
}

function cvaControlCreate(host, parent) {
  parent.controlValueAccessor.registerOnChange(value => parent.state().controlValue.set(value));
  parent.controlValueAccessor.registerOnTouched(() => parent.state().markAsTouched());
  parent.registerAsBinding();
  const bindings = createBindings();
  return () => {
    const fieldState = parent.state();
    const value = fieldState.value();
    if (bindingUpdated(bindings, 'controlValue', value)) {
      untracked(() => parent.controlValueAccessor.writeValue(value));
    }
    for (const name of CONTROL_BINDING_NAMES) {
      const value = readFieldStateBindingValue(fieldState, name);
      if (bindingUpdated(bindings, name, value)) {
        const propertyWasSet = host.setInputOnDirectives(name, value);
        if (name === 'disabled' && parent.controlValueAccessor.setDisabledState) {
          untracked(() => parent.controlValueAccessor.setDisabledState(value));
        } else if (!propertyWasSet && parent.elementAcceptsNativeProperty(name)) {
          setNativeDomProperty(parent.renderer, parent.nativeFormElement, name, value);
        }
      }
    }
  };
}

function observeSelectMutations(select, onMutation, destroyRef) {
  if (typeof MutationObserver !== 'function') {
    return;
  }
  const observer = new MutationObserver(mutations => {
    if (mutations.some(m => isRelevantSelectMutation(m))) {
      onMutation();
    }
  });
  observer.observe(select, {
    attributes: true,
    attributeFilter: ['value'],
    characterData: true,
    childList: true,
    subtree: true
  });
  destroyRef.onDestroy(() => observer.disconnect());
}
function isRelevantSelectMutation(mutation) {
  if (mutation.type === 'childList' || mutation.type === 'characterData') {
    if (mutation.target instanceof Comment) {
      return false;
    }
    for (const node of mutation.addedNodes) {
      if (!(node instanceof Comment)) {
        return true;
      }
    }
    for (const node of mutation.removedNodes) {
      if (!(node instanceof Comment)) {
        return true;
      }
    }
    return false;
  }
  if (mutation.type === 'attributes' && mutation.target instanceof HTMLOptionElement) {
    return true;
  }
  return false;
}

function nativeControlCreate(host, parent, parseErrorsSource) {
  let updateMode = false;
  const input = parent.nativeFormElement;
  const parser = createParser(() => parent.state().value(), rawValue => parent.state().controlValue.set(rawValue), () => getNativeControlValue(input, parent.state().value));
  parseErrorsSource.set(parser.errors);
  host.listenToDom('input', () => parser.setRawValue(undefined));
  host.listenToDom('blur', () => parent.state().markAsTouched());
  parent.registerAsBinding();
  if (input.tagName === 'SELECT') {
    observeSelectMutations(input, () => {
      if (!updateMode) {
        return;
      }
      input.value = parent.state().controlValue();
    }, parent.destroyRef);
  }
  const bindings = createBindings();
  return () => {
    const state = parent.state();
    const controlValue = state.controlValue();
    if (bindingUpdated(bindings, 'controlValue', controlValue)) {
      setNativeControlValue(input, controlValue);
    }
    for (const name of CONTROL_BINDING_NAMES) {
      const value = readFieldStateBindingValue(state, name);
      if (bindingUpdated(bindings, name, value)) {
        host.setInputOnDirectives(name, value);
        if (parent.elementAcceptsNativeProperty(name)) {
          setNativeDomProperty(parent.renderer, input, name, value);
        }
      }
    }
    updateMode = true;
  };
}

const ɵNgFieldDirective = Symbol();
const FORM_FIELD = new InjectionToken(typeof ngDevMode !== 'undefined' && ngDevMode ? 'FORM_FIELD' : '');
class FormField {
  field = input.required({
    ...(ngDevMode ? {
      debugName: "field"
    } : {}),
    alias: 'formField'
  });
  renderer = inject(Renderer2);
  destroyRef = inject(DestroyRef);
  state = computed(() => this.field()(), ...(ngDevMode ? [{
    debugName: "state"
  }] : []));
  injector = inject(Injector);
  element = inject(ElementRef).nativeElement;
  elementIsNativeFormElement = isNativeFormElement(this.element);
  elementAcceptsNumericValues = isNumericFormElement(this.element);
  elementAcceptsTextualValues = isTextualFormElement(this.element);
  nativeFormElement = this.elementIsNativeFormElement ? this.element : undefined;
  focuser = options => this.element.focus(options);
  controlValueAccessors = inject(NG_VALUE_ACCESSOR, {
    optional: true,
    self: true
  });
  config = inject(SIGNAL_FORMS_CONFIG, {
    optional: true
  });
  parseErrorsSource = signal(undefined, ...(ngDevMode ? [{
    debugName: "parseErrorsSource"
  }] : []));
  _interopNgControl;
  get interopNgControl() {
    return this._interopNgControl ??= new InteropNgControl(this.state);
  }
  parseErrors = computed(() => this.parseErrorsSource()?.().map(err => ({
    ...err,
    fieldTree: untracked(this.state).fieldTree,
    formField: this
  })) ?? [], ...(ngDevMode ? [{
    debugName: "parseErrors"
  }] : []));
  errors = computed(() => this.state().errors().filter(err => !err.formField || err.formField === this), ...(ngDevMode ? [{
    debugName: "errors"
  }] : []));
  isFieldBinding = false;
  get controlValueAccessor() {
    return this.controlValueAccessors?.[0] ?? this.interopNgControl?.valueAccessor ?? undefined;
  }
  installClassBindingEffect() {
    const classes = Object.entries(this.config?.classes ?? {}).map(([className, computation]) => [className, computed(() => computation(this))]);
    if (classes.length === 0) {
      return;
    }
    const bindings = createBindings();
    afterRenderEffect({
      write: () => {
        for (const [className, computation] of classes) {
          const active = computation();
          if (bindingUpdated(bindings, className, active)) {
            if (active) {
              this.renderer.addClass(this.element, className);
            } else {
              this.renderer.removeClass(this.element, className);
            }
          }
        }
      }
    }, {
      injector: this.injector
    });
  }
  focus(options) {
    this.focuser(options);
  }
  registerAsBinding(bindingOptions) {
    if (this.isFieldBinding) {
      throw new _RuntimeError(1913, typeof ngDevMode !== 'undefined' && ngDevMode && 'FormField already registered as a binding');
    }
    this.isFieldBinding = true;
    this.installClassBindingEffect();
    if (bindingOptions?.focus) {
      this.focuser = focusOptions => bindingOptions.focus(focusOptions);
    }
    effect(onCleanup => {
      const fieldNode = this.state();
      fieldNode.nodeState.formFieldBindings.update(controls => [...controls, this]);
      onCleanup(() => {
        fieldNode.nodeState.formFieldBindings.update(controls => controls.filter(c => c !== this));
      });
    }, {
      injector: this.injector
    });
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      effect(() => {
        const fieldNode = this.state();
        if (fieldNode.hidden()) {
          const path = fieldNode.structure.pathKeys().join('.') || '<root>';
          console.warn(_formatRuntimeError(1916, `Field '${path}' is hidden but is being rendered. ` + `Hidden fields should be removed from the DOM using @if.`));
        }
      }, {
        injector: this.injector
      });
    }
  }
  [ɵNgFieldDirective];
  ɵngControlCreate(host) {
    if (host.hasPassThrough) {
      return;
    }
    if (this.controlValueAccessor) {
      this.ɵngControlUpdate = cvaControlCreate(host, this);
    } else if (host.customControl) {
      this.ɵngControlUpdate = customControlCreate(host, this);
    } else if (this.elementIsNativeFormElement) {
      this.ɵngControlUpdate = nativeControlCreate(host, this, this.parseErrorsSource);
    } else {
      throw new _RuntimeError(1914, typeof ngDevMode !== 'undefined' && ngDevMode && `${host.descriptor} is an invalid [formField] directive host. The host must be a native form control ` + `(such as <input>', '<select>', or '<textarea>') or a custom form control with a 'value' or ` + `'checked' model.`);
    }
  }
  ɵngControlUpdate;
  elementAcceptsNativeProperty(key) {
    if (!this.elementIsNativeFormElement) {
      return false;
    }
    switch (key) {
      case 'min':
      case 'max':
        return this.elementAcceptsNumericValues;
      case 'minLength':
      case 'maxLength':
        return this.elementAcceptsTextualValues;
      case 'disabled':
      case 'required':
      case 'readonly':
      case 'name':
        return true;
      default:
        return false;
    }
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.0-rc.0+sha-eb6bce0",
    ngImport: i0,
    type: FormField,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.2.0-rc.0+sha-eb6bce0",
    type: FormField,
    isStandalone: true,
    selector: "[formField]",
    inputs: {
      field: {
        classPropertyName: "field",
        publicName: "formField",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    providers: [{
      provide: FORM_FIELD,
      useExisting: FormField
    }, {
      provide: NgControl,
      useFactory: () => inject(FormField).interopNgControl
    }, {
      provide: FORM_FIELD_PARSE_ERRORS,
      useFactory: () => inject(FormField).parseErrorsSource
    }],
    exportAs: ["formField"],
    controlCreate: {
      passThroughInput: "formField"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.0-rc.0+sha-eb6bce0",
  ngImport: i0,
  type: FormField,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[formField]',
      exportAs: 'formField',
      providers: [{
        provide: FORM_FIELD,
        useExisting: FormField
      }, {
        provide: NgControl,
        useFactory: () => inject(FormField).interopNgControl
      }, {
        provide: FORM_FIELD_PARSE_ERRORS,
        useFactory: () => inject(FormField).parseErrorsSource
      }]
    }]
  }],
  propDecorators: {
    field: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "formField",
        required: true
      }]
    }]
  }
});

class FormRoot {
  fieldTree = input.required({
    ...(ngDevMode ? {
      debugName: "fieldTree"
    } : {}),
    alias: 'formRoot'
  });
  onSubmit(event) {
    event.preventDefault();
    submit(this.fieldTree());
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.2.0-rc.0+sha-eb6bce0",
    ngImport: i0,
    type: FormRoot,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.2.0-rc.0+sha-eb6bce0",
    type: FormRoot,
    isStandalone: true,
    selector: "form[formRoot]",
    inputs: {
      fieldTree: {
        classPropertyName: "fieldTree",
        publicName: "formRoot",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    host: {
      attributes: {
        "novalidate": ""
      },
      listeners: {
        "submit": "onSubmit($event)"
      }
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.2.0-rc.0+sha-eb6bce0",
  ngImport: i0,
  type: FormRoot,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'form[formRoot]',
      host: {
        'novalidate': '',
        '(submit)': 'onSubmit($event)'
      }
    }]
  }],
  propDecorators: {
    fieldTree: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "formRoot",
        required: true
      }]
    }]
  }
});

export { BaseNgValidationError, EmailValidationError, FORM_FIELD, FormField, FormRoot, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MaxLengthValidationError, MaxValidationError, MinLengthValidationError, MinValidationError, NativeInputParseError, NgValidationError, PATTERN, PatternValidationError, REQUIRED, RequiredValidationError, StandardSchemaValidationError, createManagedMetadataKey, createMetadataKey, debounce, disabled, email, emailError, hidden, max, maxError, maxLength, maxLengthError, metadata, min, minError, minLength, minLengthError, pattern, patternError, provideSignalFormsConfig, readonly, required, requiredError, standardSchemaError, submit, transformedValue, validate, validateAsync, validateHttp, validateStandardSchema, validateTree, ɵNgFieldDirective };
//# sourceMappingURL=signals.mjs.map
