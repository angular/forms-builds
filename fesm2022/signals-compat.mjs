/**
 * @license Angular v21.2.0-next.2+sha-760910e
 * (c) 2010-2026 Google LLC. https://angular.dev/
 * License: MIT
 */

import { FieldNode, getInjectorFromOptions, FieldNodeState, FieldNodeStructure, calculateValidationSelfStatus, extractNestedReactiveErrors, BasicFieldAdapter, form, normalizeFormArgs, signalErrorsToValidationErrors } from './_validation_errors-chunk.mjs';
export { CompatValidationError } from './_validation_errors-chunk.mjs';
import { linkedSignal, untracked, runInInjectionContext, computed, signal, ɵRuntimeError as _RuntimeError, EventEmitter, inject, Injector, effect } from '@angular/core';
import { AbstractControl, ValueChangeEvent, StatusChangeEvent, TouchedChangeEvent, PristineChangeEvent, FormResetEvent } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import '@angular/core/primitives/signals';

class CompatFieldNode extends FieldNode {
  options;
  control;
  constructor(options) {
    super(options);
    this.options = options;
    this.control = this.options.control;
  }
}
function makeCreateDestroySubject() {
  let destroy$ = new ReplaySubject(1);
  return () => {
    if (destroy$) {
      destroy$.next();
      destroy$.complete();
    }
    return destroy$ = new ReplaySubject(1);
  };
}
function extractControlPropToSignal(options, makeSignal) {
  const injector = getInjectorFromOptions(options);
  const createDestroySubject = makeCreateDestroySubject();
  const signalOfControlSignal = linkedSignal({
    ...(ngDevMode ? {
      debugName: "signalOfControlSignal"
    } : {}),
    source: options.control,
    computation: control => {
      return untracked(() => {
        return runInInjectionContext(injector, () => makeSignal(control, createDestroySubject()));
      });
    }
  });
  return computed(() => signalOfControlSignal()());
}
const getControlStatusSignal = (options, getValue) => {
  return extractControlPropToSignal(options, (c, destroy$) => toSignal(c.statusChanges.pipe(map(() => getValue(c)), takeUntil(destroy$)), {
    initialValue: getValue(c)
  }));
};
const getControlEventsSignal = (options, getValue) => {
  return extractControlPropToSignal(options, (c, destroy$) => toSignal(c.events.pipe(map(() => {
    return getValue(c);
  }), takeUntil(destroy$)), {
    initialValue: getValue(c)
  }));
};

class CompatNodeState extends FieldNodeState {
  compatNode;
  touched;
  dirty;
  disabled;
  control;
  constructor(compatNode, options) {
    super(compatNode);
    this.compatNode = compatNode;
    this.control = options.control;
    this.touched = getControlEventsSignal(options, c => c.touched);
    this.dirty = getControlEventsSignal(options, c => c.dirty);
    const controlDisabled = getControlStatusSignal(options, c => c.disabled);
    this.disabled = computed(() => {
      return controlDisabled() || this.disabledReasons().length > 0;
    }, ...(ngDevMode ? [{
      debugName: "disabled"
    }] : []));
  }
  markAsDirty() {
    this.control().markAsDirty();
  }
  markAsTouched() {
    this.control().markAsTouched();
  }
  markAsPristine() {
    this.control().markAsPristine();
  }
  markAsUntouched() {
    this.control().markAsUntouched();
  }
}

function getParentFromOptions(options) {
  if (options.kind === 'root') {
    return undefined;
  }
  return options.parent;
}
function getFieldManagerFromOptions(options) {
  if (options.kind === 'root') {
    return options.fieldManager;
  }
  return options.parent.structure.root.structure.fieldManager;
}
function getControlValueSignal(options) {
  const value = extractControlPropToSignal(options, (control, destroy$) => {
    return toSignal(control.valueChanges.pipe(map(() => control.getRawValue()), takeUntil(destroy$)), {
      initialValue: control.getRawValue()
    });
  });
  value.set = value => {
    options.control().setValue(value);
  };
  value.update = fn => {
    value.set(fn(value()));
  };
  return value;
}
class CompatStructure extends FieldNodeStructure {
  value;
  keyInParent;
  root;
  pathKeys;
  children = signal([], ...(ngDevMode ? [{
    debugName: "children"
  }] : []));
  childrenMap = computed(() => undefined, ...(ngDevMode ? [{
    debugName: "childrenMap"
  }] : []));
  parent;
  fieldManager;
  constructor(node, options) {
    super(options.logic, node, () => {
      throw new _RuntimeError(1911, ngDevMode && `Compat nodes don't have children.`);
    });
    this.value = getControlValueSignal(options);
    this.parent = getParentFromOptions(options);
    this.root = this.parent?.structure.root ?? node;
    this.fieldManager = getFieldManagerFromOptions(options);
    const identityInParent = options.kind === 'child' ? options.identityInParent : undefined;
    const initialKeyInParent = options.kind === 'child' ? options.initialKeyInParent : undefined;
    this.keyInParent = this.createKeyInParent(options, identityInParent, initialKeyInParent);
    this.pathKeys = computed(() => this.parent ? [...this.parent.structure.pathKeys(), this.keyInParent()] : [], ...(ngDevMode ? [{
      debugName: "pathKeys"
    }] : []));
  }
  getChild() {
    return undefined;
  }
}

const EMPTY_ARRAY_SIGNAL = computed(() => [], ...(ngDevMode ? [{
  debugName: "EMPTY_ARRAY_SIGNAL"
}] : []));
const TRUE_SIGNAL = computed(() => true, ...(ngDevMode ? [{
  debugName: "TRUE_SIGNAL"
}] : []));
class CompatValidationState {
  syncValid;
  errors;
  pending;
  invalid;
  valid;
  parseErrors = computed(() => [], ...(ngDevMode ? [{
    debugName: "parseErrors"
  }] : []));
  constructor(options) {
    this.syncValid = getControlStatusSignal(options, c => c.status === 'VALID');
    this.errors = getControlStatusSignal(options, extractNestedReactiveErrors);
    this.pending = getControlStatusSignal(options, c => c.pending);
    this.valid = getControlStatusSignal(options, c => {
      return c.valid;
    });
    this.invalid = getControlStatusSignal(options, c => {
      return c.invalid;
    });
  }
  asyncErrors = EMPTY_ARRAY_SIGNAL;
  errorSummary = EMPTY_ARRAY_SIGNAL;
  rawSyncTreeErrors = EMPTY_ARRAY_SIGNAL;
  syncErrors = EMPTY_ARRAY_SIGNAL;
  rawAsyncErrors = EMPTY_ARRAY_SIGNAL;
  shouldSkipValidation = TRUE_SIGNAL;
  status = computed(() => {
    return calculateValidationSelfStatus(this);
  }, ...(ngDevMode ? [{
    debugName: "status"
  }] : []));
}

class CompatFieldAdapter {
  basicAdapter = new BasicFieldAdapter();
  newRoot(fieldManager, value, pathNode, adapter) {
    if (value() instanceof AbstractControl) {
      return createCompatNode({
        kind: 'root',
        fieldManager,
        value,
        pathNode,
        logic: pathNode.builder.build(),
        fieldAdapter: adapter
      });
    }
    return this.basicAdapter.newRoot(fieldManager, value, pathNode, adapter);
  }
  createNodeState(node, options) {
    if (!options.control) {
      return this.basicAdapter.createNodeState(node);
    }
    return new CompatNodeState(node, options);
  }
  createStructure(node, options) {
    if (!options.control) {
      return this.basicAdapter.createStructure(node, options);
    }
    return new CompatStructure(node, options);
  }
  createValidationState(node, options) {
    if (!options.control) {
      return this.basicAdapter.createValidationState(node);
    }
    return new CompatValidationState(options);
  }
  newChild(options) {
    const value = options.parent.value()[options.initialKeyInParent];
    if (value instanceof AbstractControl) {
      return createCompatNode(options);
    }
    return new FieldNode(options);
  }
}
function createCompatNode(options) {
  const control = options.kind === 'root' ? options.value : computed(() => {
    return options.parent.value()[options.initialKeyInParent];
  });
  return new CompatFieldNode({
    ...options,
    control
  });
}

function compatForm(...args) {
  const [model, maybeSchema, maybeOptions] = normalizeFormArgs(args);
  const options = {
    ...maybeOptions,
    adapter: new CompatFieldAdapter()
  };
  const schema = maybeSchema || (() => {});
  return form(model, schema, options);
}

const NG_STATUS_CLASSES = {
  'ng-touched': ({
    state
  }) => state().touched(),
  'ng-untouched': ({
    state
  }) => !state().touched(),
  'ng-dirty': ({
    state
  }) => state().dirty(),
  'ng-pristine': ({
    state
  }) => !state().dirty(),
  'ng-valid': ({
    state
  }) => state().valid(),
  'ng-invalid': ({
    state
  }) => state().invalid(),
  'ng-pending': ({
    state
  }) => state().pending()
};

class SignalFormControl extends AbstractControl {
  fieldTree;
  sourceValue;
  fieldState;
  initialValue;
  pendingParentNotifications = 0;
  onChangeCallbacks = [];
  onDisabledChangeCallbacks = [];
  valueChanges = new EventEmitter();
  statusChanges = new EventEmitter();
  constructor(value, schemaOrOptions, options) {
    super(null, null);
    const [model, schema, opts] = normalizeFormArgs([signal(value), schemaOrOptions, options]);
    this.sourceValue = model;
    this.initialValue = value;
    const injector = opts?.injector ?? inject(Injector);
    const rawTree = schema ? compatForm(this.sourceValue, schema, {
      injector
    }) : compatForm(this.sourceValue, {
      injector
    });
    this.fieldTree = wrapFieldTreeForSyncUpdates(rawTree, () => this.parent?.updateValueAndValidity({
      sourceControl: this
    }));
    this.fieldState = this.fieldTree();
    this.defineCompatProperties();
    effect(() => {
      const value = this.sourceValue();
      untracked(() => {
        this.notifyParentUnlessPending();
        this.valueChanges.emit(value);
        this.emitControlEvent(new ValueChangeEvent(value, this));
      });
    }, {
      injector
    });
    effect(() => {
      const status = this.status;
      untracked(() => {
        this.statusChanges.emit(status);
      });
      this.emitControlEvent(new StatusChangeEvent(status, this));
    }, {
      injector
    });
    effect(() => {
      const isDisabled = this.disabled;
      untracked(() => {
        for (const fn of this.onDisabledChangeCallbacks) {
          fn(isDisabled);
        }
      });
    }, {
      injector
    });
    effect(() => {
      const isTouched = this.fieldState.touched();
      this.emitControlEvent(new TouchedChangeEvent(isTouched, this));
      const parent = this.parent;
      if (!parent) {
        return;
      }
      if (!isTouched) {
        parent.markAsUntouched();
      } else {
        parent.markAsTouched();
      }
    }, {
      injector
    });
    effect(() => {
      const isDirty = this.fieldState.dirty();
      this.emitControlEvent(new PristineChangeEvent(!isDirty, this));
      const parent = this.parent;
      if (!parent) {
        return;
      }
      if (isDirty) {
        parent.markAsDirty();
      } else {
        parent.markAsPristine();
      }
    }, {
      injector
    });
  }
  defineCompatProperties() {
    const valueProp = getClosureSafeProperty({
      value: getClosureSafeProperty
    });
    Object.defineProperty(this, valueProp, {
      get: () => this.sourceValue()
    });
    const errorsProp = getClosureSafeProperty({
      errors: getClosureSafeProperty
    });
    Object.defineProperty(this, errorsProp, {
      get: () => signalErrorsToValidationErrors(this.fieldState.errors())
    });
  }
  emitControlEvent(event) {
    untracked(() => {
      this._events.next(event);
    });
  }
  setValue(value, options) {
    this.updateValue(value, options);
  }
  patchValue(value, options) {
    this.updateValue(value, options);
  }
  updateValue(value, options) {
    const parent = this.scheduleParentUpdate(options);
    this.sourceValue.set(value);
    if (parent) {
      this.updateParentValueAndValidity(parent, options?.emitEvent);
    }
    if (options?.emitModelToViewChange !== false) {
      for (const fn of this.onChangeCallbacks) {
        fn(value, true);
      }
    }
  }
  registerOnChange(fn) {
    this.onChangeCallbacks.push(fn);
  }
  _unregisterOnChange(fn) {
    removeListItem(this.onChangeCallbacks, fn);
  }
  registerOnDisabledChange(fn) {
    this.onDisabledChangeCallbacks.push(fn);
  }
  _unregisterOnDisabledChange(fn) {
    removeListItem(this.onDisabledChangeCallbacks, fn);
  }
  getRawValue() {
    return this.value;
  }
  reset(value, options) {
    if (isFormControlState(value)) {
      throw unsupportedDisableEnableError();
    }
    const resetValue = value ?? this.initialValue;
    this.fieldState.reset(resetValue);
    if (value !== undefined) {
      this.updateValue(value, options);
    } else if (!options?.onlySelf) {
      const parent = this.parent;
      if (parent) {
        this.updateParentValueAndValidity(parent, options?.emitEvent);
      }
    }
    if (options?.emitEvent !== false) {
      this.emitControlEvent(new FormResetEvent(this));
    }
  }
  scheduleParentUpdate(options) {
    const parent = options?.onlySelf ? null : this.parent;
    if (options?.onlySelf || parent) {
      this.pendingParentNotifications++;
    }
    return parent;
  }
  notifyParentUnlessPending() {
    if (this.pendingParentNotifications > 0) {
      this.pendingParentNotifications--;
      return;
    }
    const parent = this.parent;
    if (parent) {
      this.updateParentValueAndValidity(parent);
    }
  }
  updateParentValueAndValidity(parent, emitEvent) {
    parent.updateValueAndValidity({
      emitEvent,
      sourceControl: this
    });
  }
  propagateToParent(opts, fn) {
    const parent = this.parent;
    if (parent && !opts?.onlySelf) {
      fn(parent);
    }
  }
  get status() {
    if (this.fieldState.disabled()) {
      return 'DISABLED';
    }
    if (this.fieldState.valid()) {
      return 'VALID';
    }
    if (this.fieldState.invalid()) {
      return 'INVALID';
    }
    return 'PENDING';
  }
  get valid() {
    return this.fieldState.valid();
  }
  get invalid() {
    return this.fieldState.invalid();
  }
  get pending() {
    return this.fieldState.pending();
  }
  get disabled() {
    return this.fieldState.disabled();
  }
  get enabled() {
    return !this.disabled;
  }
  get dirty() {
    return this.fieldState.dirty();
  }
  set dirty(_) {
    throw unsupportedFeatureError(ngDevMode && 'Setting dirty directly is not supported. Instead use markAsDirty().');
  }
  get pristine() {
    return !this.dirty;
  }
  set pristine(_) {
    throw unsupportedFeatureError(ngDevMode && 'Setting pristine directly is not supported. Instead use reset().');
  }
  get touched() {
    return this.fieldState.touched();
  }
  set touched(_) {
    throw unsupportedFeatureError(ngDevMode && 'Setting touched directly is not supported. Instead use markAsTouched() or reset().');
  }
  get untouched() {
    return !this.touched;
  }
  set untouched(_) {
    throw unsupportedFeatureError(ngDevMode && 'Setting untouched directly is not supported. Instead use reset().');
  }
  markAsTouched(opts) {
    this.fieldState.markAsTouched();
    this.propagateToParent(opts, parent => parent.markAsTouched(opts));
  }
  markAsDirty(opts) {
    this.fieldState.markAsDirty();
    this.propagateToParent(opts, parent => parent.markAsDirty(opts));
  }
  markAsPristine(opts) {
    this.fieldState.markAsPristine();
    this.propagateToParent(opts, parent => parent.markAsPristine(opts));
  }
  markAsUntouched(opts) {
    this.fieldState.markAsUntouched();
    this.propagateToParent(opts, parent => parent.markAsUntouched(opts));
  }
  updateValueAndValidity(_opts) {}
  _updateValue() {}
  _forEachChild(_cb) {}
  _anyControls(_condition) {
    return false;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  _syncPendingControls() {
    return false;
  }
  disable(_opts) {
    throw unsupportedDisableEnableError();
  }
  enable(_opts) {
    throw unsupportedDisableEnableError();
  }
  setValidators(_validators) {
    throw unsupportedValidatorsError();
  }
  setAsyncValidators(_validators) {
    throw unsupportedValidatorsError();
  }
  addValidators(_validators) {
    throw unsupportedValidatorsError();
  }
  addAsyncValidators(_validators) {
    throw unsupportedValidatorsError();
  }
  removeValidators(_validators) {
    throw unsupportedValidatorsError();
  }
  removeAsyncValidators(_validators) {
    throw unsupportedValidatorsError();
  }
  clearValidators() {
    throw unsupportedValidatorsError();
  }
  clearAsyncValidators() {
    throw unsupportedValidatorsError();
  }
  setErrors(_errors, _opts) {
    throw unsupportedFeatureError(ngDevMode && 'Imperatively setting errors is not supported in signal forms. Errors are derived from validation rules.');
  }
  markAsPending(_opts) {
    throw unsupportedFeatureError(ngDevMode && 'Imperatively marking as pending is not supported in signal forms. Pending state is derived from async validation status.');
  }
}
class CachingWeakMap {
  map = new WeakMap();
  getOrCreate(key, create) {
    const cached = this.map.get(key);
    if (cached) {
      return cached;
    }
    const value = create();
    this.map.set(key, value);
    return value;
  }
}
function wrapFieldTreeForSyncUpdates(tree, onUpdate) {
  const treeCache = new CachingWeakMap();
  const stateCache = new CachingWeakMap();
  const wrapState = state => {
    const {
      value
    } = state;
    const wrappedValue = Object.assign((...a) => value(...a), {
      set: v => {
        value.set(v);
        onUpdate();
      },
      update: fn => {
        value.update(fn);
        onUpdate();
      }
    });
    return Object.create(state, {
      value: {
        get: () => wrappedValue
      }
    });
  };
  const wrapTree = t => {
    return treeCache.getOrCreate(t, () => {
      return new Proxy(t, {
        get(target, prop, receiver) {
          const val = Reflect.get(target, prop, receiver);
          if (typeof val === 'function' && typeof prop === 'string') {
            return wrapTree(val);
          }
          return val;
        },
        apply(target, _, args) {
          const state = target(...args);
          return stateCache.getOrCreate(state, () => wrapState(state));
        }
      });
    });
  };
  return wrapTree(tree);
}
function isFormControlState(formState) {
  return typeof formState === 'object' && formState !== null && Object.keys(formState).length === 2 && 'value' in formState && 'disabled' in formState;
}
function unsupportedFeatureError(message) {
  return new _RuntimeError(1920, message ?? false);
}
function unsupportedDisableEnableError() {
  return unsupportedFeatureError(ngDevMode && 'Imperatively changing enabled/disabled status in form control is not supported in signal forms. Instead use a "disabled" rule to derive the disabled status from a signal.');
}
function unsupportedValidatorsError() {
  return unsupportedFeatureError(ngDevMode && 'Dynamically adding and removing validators is not supported in signal forms. Instead use the "applyWhen" rule to conditionally apply validators based on a signal.');
}
function removeListItem(list, el) {
  const index = list.indexOf(el);
  if (index > -1) list.splice(index, 1);
}
function getClosureSafeProperty(objWithPropertyToExtract) {
  for (let key in objWithPropertyToExtract) {
    if (objWithPropertyToExtract[key] === getClosureSafeProperty) {
      return key;
    }
  }
  throw Error(typeof ngDevMode === 'undefined' || ngDevMode ? 'Could not find renamed property on target object.' : '');
}

export { NG_STATUS_CLASSES, SignalFormControl, compatForm };
//# sourceMappingURL=signals-compat.mjs.map
