/**
 * @license Angular v21.0.0+sha-a70a191
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

import { computed, untracked, runInInjectionContext, linkedSignal, Injector, signal, APP_ID, effect, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SIGNAL } from '@angular/core/primitives/signals';

function isArray(value) {
  return Array.isArray(value);
}
function isObject(value) {
  return (typeof value === 'object' || typeof value === 'function') && value != null;
}

function reduceChildren(node, initialValue, fn, shortCircuit) {
  const childrenMap = node.structure.childrenMap();
  if (!childrenMap) {
    return initialValue;
  }
  let value = initialValue;
  for (const child of childrenMap.values()) {
    if (shortCircuit?.(value)) {
      break;
    }
    value = fn(child, value);
  }
  return value;
}
function shortCircuitFalse(value) {
  return !value;
}
function shortCircuitTrue(value) {
  return value;
}
function getInjectorFromOptions(options) {
  if (options.kind === 'root') {
    return options.fieldManager.injector;
  }
  return options.parent.structure.root.structure.injector;
}

function calculateValidationSelfStatus(state) {
  if (state.errors().length > 0) {
    return 'invalid';
  }
  if (state.pending()) {
    return 'unknown';
  }
  return 'valid';
}
class FieldValidationState {
  node;
  constructor(node) {
    this.node = node;
  }
  rawSyncTreeErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.syncTreeErrors.compute(this.node.context), ...(this.node.structure.parent?.validationState.rawSyncTreeErrors() ?? [])];
  }, ...(ngDevMode ? [{
    debugName: "rawSyncTreeErrors"
  }] : []));
  syncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.syncErrors.compute(this.node.context), ...this.syncTreeErrors(), ...normalizeErrors(this.node.submitState.serverErrors())];
  }, ...(ngDevMode ? [{
    debugName: "syncErrors"
  }] : []));
  syncValid = computed(() => {
    if (this.shouldSkipValidation()) {
      return true;
    }
    return reduceChildren(this.node, this.syncErrors().length === 0, (child, value) => value && child.validationState.syncValid(), shortCircuitFalse);
  }, ...(ngDevMode ? [{
    debugName: "syncValid"
  }] : []));
  syncTreeErrors = computed(() => this.rawSyncTreeErrors().filter(err => err.field === this.node.fieldProxy), ...(ngDevMode ? [{
    debugName: "syncTreeErrors"
  }] : []));
  rawAsyncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return [...this.node.logicNode.logic.asyncErrors.compute(this.node.context), ...(this.node.structure.parent?.validationState.rawAsyncErrors() ?? [])];
  }, ...(ngDevMode ? [{
    debugName: "rawAsyncErrors"
  }] : []));
  asyncErrors = computed(() => {
    if (this.shouldSkipValidation()) {
      return [];
    }
    return this.rawAsyncErrors().filter(err => err === 'pending' || err.field === this.node.fieldProxy);
  }, ...(ngDevMode ? [{
    debugName: "asyncErrors"
  }] : []));
  errors = computed(() => [...this.syncErrors(), ...this.asyncErrors().filter(err => err !== 'pending')], ...(ngDevMode ? [{
    debugName: "errors"
  }] : []));
  errorSummary = computed(() => reduceChildren(this.node, this.errors(), (child, result) => [...result, ...child.errorSummary()]), ...(ngDevMode ? [{
    debugName: "errorSummary"
  }] : []));
  pending = computed(() => reduceChildren(this.node, this.asyncErrors().includes('pending'), (child, value) => value || child.validationState.asyncErrors().includes('pending')), ...(ngDevMode ? [{
    debugName: "pending"
  }] : []));
  status = computed(() => {
    if (this.shouldSkipValidation()) {
      return 'valid';
    }
    let ownStatus = calculateValidationSelfStatus(this);
    return reduceChildren(this.node, ownStatus, (child, value) => {
      if (value === 'invalid' || child.validationState.status() === 'invalid') {
        return 'invalid';
      } else if (value === 'unknown' || child.validationState.status() === 'unknown') {
        return 'unknown';
      }
      return 'valid';
    }, v => v === 'invalid');
  }, ...(ngDevMode ? [{
    debugName: "status"
  }] : []));
  valid = computed(() => this.status() === 'valid', ...(ngDevMode ? [{
    debugName: "valid"
  }] : []));
  invalid = computed(() => this.status() === 'invalid', ...(ngDevMode ? [{
    debugName: "invalid"
  }] : []));
  shouldSkipValidation = computed(() => this.node.hidden() || this.node.disabled() || this.node.readonly(), ...(ngDevMode ? [{
    debugName: "shouldSkipValidation"
  }] : []));
}
function normalizeErrors(error) {
  if (error === undefined) {
    return [];
  }
  if (isArray(error)) {
    return error;
  }
  return [error];
}
function addDefaultField(errors, field) {
  if (isArray(errors)) {
    for (const error of errors) {
      error.field ??= field;
    }
  } else if (errors) {
    errors.field ??= field;
  }
  return errors;
}

let boundPathDepth = 0;
function getBoundPathDepth() {
  return boundPathDepth;
}
function setBoundPathDepthForResolution(fn, depth) {
  return (...args) => {
    try {
      boundPathDepth = depth;
      return fn(...args);
    } finally {
      boundPathDepth = 0;
    }
  };
}

const DYNAMIC = Symbol();
const IGNORED = Symbol();
class AbstractLogic {
  predicates;
  fns = [];
  constructor(predicates) {
    this.predicates = predicates;
  }
  push(logicFn) {
    this.fns.push(wrapWithPredicates(this.predicates, logicFn));
  }
  mergeIn(other) {
    const fns = this.predicates ? other.fns.map(fn => wrapWithPredicates(this.predicates, fn)) : other.fns;
    this.fns.push(...fns);
  }
}
class BooleanOrLogic extends AbstractLogic {
  get defaultValue() {
    return false;
  }
  compute(arg) {
    return this.fns.some(f => {
      const result = f(arg);
      return result && result !== IGNORED;
    });
  }
}
class ArrayMergeIgnoreLogic extends AbstractLogic {
  ignore;
  static ignoreNull(predicates) {
    return new ArrayMergeIgnoreLogic(predicates, e => e === null);
  }
  constructor(predicates, ignore) {
    super(predicates);
    this.ignore = ignore;
  }
  get defaultValue() {
    return [];
  }
  compute(arg) {
    return this.fns.reduce((prev, f) => {
      const value = f(arg);
      if (value === undefined || value === IGNORED) {
        return prev;
      } else if (isArray(value)) {
        return [...prev, ...(this.ignore ? value.filter(e => !this.ignore(e)) : value)];
      } else {
        if (this.ignore && this.ignore(value)) {
          return prev;
        }
        return [...prev, value];
      }
    }, []);
  }
}
class ArrayMergeLogic extends ArrayMergeIgnoreLogic {
  constructor(predicates) {
    super(predicates, undefined);
  }
}
class AggregateMetadataMergeLogic extends AbstractLogic {
  key;
  get defaultValue() {
    return this.key.getInitial();
  }
  constructor(predicates, key) {
    super(predicates);
    this.key = key;
  }
  compute(ctx) {
    if (this.fns.length === 0) {
      return this.key.getInitial();
    }
    let acc = this.key.getInitial();
    for (let i = 0; i < this.fns.length; i++) {
      const item = this.fns[i](ctx);
      if (item !== IGNORED) {
        acc = this.key.reduce(acc, item);
      }
    }
    return acc;
  }
}
function wrapWithPredicates(predicates, logicFn) {
  if (predicates.length === 0) {
    return logicFn;
  }
  return arg => {
    for (const predicate of predicates) {
      let predicateField = arg.stateOf(predicate.path);
      const depthDiff = untracked(predicateField.structure.pathKeys).length - predicate.depth;
      for (let i = 0; i < depthDiff; i++) {
        predicateField = predicateField.structure.parent;
      }
      if (!predicate.fn(predicateField.context)) {
        return IGNORED;
      }
    }
    return logicFn(arg);
  };
}
class LogicContainer {
  predicates;
  hidden;
  disabledReasons;
  readonly;
  syncErrors;
  syncTreeErrors;
  asyncErrors;
  aggregateMetadataKeys = new Map();
  metadataFactories = new Map();
  constructor(predicates) {
    this.predicates = predicates;
    this.hidden = new BooleanOrLogic(predicates);
    this.disabledReasons = new ArrayMergeLogic(predicates);
    this.readonly = new BooleanOrLogic(predicates);
    this.syncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
    this.syncTreeErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
    this.asyncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
  }
  hasAggregateMetadata(key) {
    return this.aggregateMetadataKeys.has(key);
  }
  getAggregateMetadataEntries() {
    return this.aggregateMetadataKeys.entries();
  }
  getMetadataFactoryEntries() {
    return this.metadataFactories.entries();
  }
  getAggregateMetadata(key) {
    if (!this.aggregateMetadataKeys.has(key)) {
      this.aggregateMetadataKeys.set(key, new AggregateMetadataMergeLogic(this.predicates, key));
    }
    return this.aggregateMetadataKeys.get(key);
  }
  addMetadataFactory(key, factory) {
    if (this.metadataFactories.has(key)) {
      throw new Error(`Can't define value twice for the same MetadataKey`);
    }
    this.metadataFactories.set(key, factory);
  }
  mergeIn(other) {
    this.hidden.mergeIn(other.hidden);
    this.disabledReasons.mergeIn(other.disabledReasons);
    this.readonly.mergeIn(other.readonly);
    this.syncErrors.mergeIn(other.syncErrors);
    this.syncTreeErrors.mergeIn(other.syncTreeErrors);
    this.asyncErrors.mergeIn(other.asyncErrors);
    for (const [key, metadataLogic] of other.getAggregateMetadataEntries()) {
      this.getAggregateMetadata(key).mergeIn(metadataLogic);
    }
    for (const [key, metadataFactory] of other.getMetadataFactoryEntries()) {
      this.addMetadataFactory(key, metadataFactory);
    }
  }
}

class AbstractLogicNodeBuilder {
  depth;
  constructor(depth) {
    this.depth = depth;
  }
  build() {
    return new LeafLogicNode(this, [], 0);
  }
}
class LogicNodeBuilder extends AbstractLogicNodeBuilder {
  constructor(depth) {
    super(depth);
  }
  current;
  all = [];
  addHiddenRule(logic) {
    this.getCurrent().addHiddenRule(logic);
  }
  addDisabledReasonRule(logic) {
    this.getCurrent().addDisabledReasonRule(logic);
  }
  addReadonlyRule(logic) {
    this.getCurrent().addReadonlyRule(logic);
  }
  addSyncErrorRule(logic) {
    this.getCurrent().addSyncErrorRule(logic);
  }
  addSyncTreeErrorRule(logic) {
    this.getCurrent().addSyncTreeErrorRule(logic);
  }
  addAsyncErrorRule(logic) {
    this.getCurrent().addAsyncErrorRule(logic);
  }
  addAggregateMetadataRule(key, logic) {
    this.getCurrent().addAggregateMetadataRule(key, logic);
  }
  addMetadataFactory(key, factory) {
    this.getCurrent().addMetadataFactory(key, factory);
  }
  getChild(key) {
    if (key === DYNAMIC) {
      const children = this.getCurrent().children;
      if (children.size > (children.has(DYNAMIC) ? 1 : 0)) {
        this.current = undefined;
      }
    }
    return this.getCurrent().getChild(key);
  }
  hasLogic(builder) {
    if (this === builder) {
      return true;
    }
    return this.all.some(({
      builder: subBuilder
    }) => subBuilder.hasLogic(builder));
  }
  mergeIn(other, predicate) {
    if (predicate) {
      this.all.push({
        builder: other,
        predicate: {
          fn: setBoundPathDepthForResolution(predicate.fn, this.depth),
          path: predicate.path
        }
      });
    } else {
      this.all.push({
        builder: other
      });
    }
    this.current = undefined;
  }
  getCurrent() {
    if (this.current === undefined) {
      this.current = new NonMergeableLogicNodeBuilder(this.depth);
      this.all.push({
        builder: this.current
      });
    }
    return this.current;
  }
  static newRoot() {
    return new LogicNodeBuilder(0);
  }
}
class NonMergeableLogicNodeBuilder extends AbstractLogicNodeBuilder {
  logic = new LogicContainer([]);
  children = new Map();
  constructor(depth) {
    super(depth);
  }
  addHiddenRule(logic) {
    this.logic.hidden.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addDisabledReasonRule(logic) {
    this.logic.disabledReasons.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addReadonlyRule(logic) {
    this.logic.readonly.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addSyncErrorRule(logic) {
    this.logic.syncErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addSyncTreeErrorRule(logic) {
    this.logic.syncTreeErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addAsyncErrorRule(logic) {
    this.logic.asyncErrors.push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addAggregateMetadataRule(key, logic) {
    this.logic.getAggregateMetadata(key).push(setBoundPathDepthForResolution(logic, this.depth));
  }
  addMetadataFactory(key, factory) {
    this.logic.addMetadataFactory(key, setBoundPathDepthForResolution(factory, this.depth));
  }
  getChild(key) {
    if (!this.children.has(key)) {
      this.children.set(key, new LogicNodeBuilder(this.depth + 1));
    }
    return this.children.get(key);
  }
  hasLogic(builder) {
    return this === builder;
  }
}
class LeafLogicNode {
  builder;
  predicates;
  depth;
  logic;
  constructor(builder, predicates, depth) {
    this.builder = builder;
    this.predicates = predicates;
    this.depth = depth;
    this.logic = builder ? createLogic(builder, predicates, depth) : new LogicContainer([]);
  }
  getChild(key) {
    const childBuilders = this.builder ? getAllChildBuilders(this.builder, key) : [];
    if (childBuilders.length === 0) {
      return new LeafLogicNode(undefined, [], this.depth + 1);
    } else if (childBuilders.length === 1) {
      const {
        builder,
        predicates
      } = childBuilders[0];
      return new LeafLogicNode(builder, [...this.predicates, ...predicates.map(p => bindLevel(p, this.depth))], this.depth + 1);
    } else {
      const builtNodes = childBuilders.map(({
        builder,
        predicates
      }) => new LeafLogicNode(builder, [...this.predicates, ...predicates.map(p => bindLevel(p, this.depth))], this.depth + 1));
      return new CompositeLogicNode(builtNodes);
    }
  }
  hasLogic(builder) {
    return this.builder?.hasLogic(builder) ?? false;
  }
}
class CompositeLogicNode {
  all;
  logic;
  constructor(all) {
    this.all = all;
    this.logic = new LogicContainer([]);
    for (const node of all) {
      this.logic.mergeIn(node.logic);
    }
  }
  getChild(key) {
    return new CompositeLogicNode(this.all.flatMap(child => child.getChild(key)));
  }
  hasLogic(builder) {
    return this.all.some(node => node.hasLogic(builder));
  }
}
function getAllChildBuilders(builder, key) {
  if (builder instanceof LogicNodeBuilder) {
    return builder.all.flatMap(({
      builder,
      predicate
    }) => {
      const children = getAllChildBuilders(builder, key);
      if (predicate) {
        return children.map(({
          builder,
          predicates
        }) => ({
          builder,
          predicates: [...predicates, predicate]
        }));
      }
      return children;
    });
  } else if (builder instanceof NonMergeableLogicNodeBuilder) {
    return [...(key !== DYNAMIC && builder.children.has(DYNAMIC) ? [{
      builder: builder.getChild(DYNAMIC),
      predicates: []
    }] : []), ...(builder.children.has(key) ? [{
      builder: builder.getChild(key),
      predicates: []
    }] : [])];
  } else {
    throw new Error('Unknown LogicNodeBuilder type');
  }
}
function createLogic(builder, predicates, depth) {
  const logic = new LogicContainer(predicates);
  if (builder instanceof LogicNodeBuilder) {
    const builtNodes = builder.all.map(({
      builder,
      predicate
    }) => new LeafLogicNode(builder, predicate ? [...predicates, bindLevel(predicate, depth)] : predicates, depth));
    for (const node of builtNodes) {
      logic.mergeIn(node.logic);
    }
  } else if (builder instanceof NonMergeableLogicNodeBuilder) {
    logic.mergeIn(builder.logic);
  } else {
    throw new Error('Unknown LogicNodeBuilder type');
  }
  return logic;
}
function bindLevel(predicate, depth) {
  return {
    ...predicate,
    depth: depth
  };
}

const PATH = Symbol('PATH');
class FieldPathNode {
  keys;
  parent;
  keyInParent;
  root;
  children = new Map();
  fieldPathProxy = new Proxy(this, FIELD_PATH_PROXY_HANDLER);
  logicBuilder;
  constructor(keys, root, parent, keyInParent) {
    this.keys = keys;
    this.parent = parent;
    this.keyInParent = keyInParent;
    this.root = root ?? this;
    if (!parent) {
      this.logicBuilder = LogicNodeBuilder.newRoot();
    }
  }
  get builder() {
    if (this.logicBuilder) {
      return this.logicBuilder;
    }
    return this.parent.builder.getChild(this.keyInParent);
  }
  getChild(key) {
    if (!this.children.has(key)) {
      this.children.set(key, new FieldPathNode([...this.keys, key], this.root, this, key));
    }
    return this.children.get(key);
  }
  mergeIn(other, predicate) {
    const path = other.compile();
    this.builder.mergeIn(path.builder, predicate);
  }
  static unwrapFieldPath(formPath) {
    return formPath[PATH];
  }
  static newRoot() {
    return new FieldPathNode([], undefined, undefined, undefined);
  }
}
const FIELD_PATH_PROXY_HANDLER = {
  get(node, property) {
    if (property === PATH) {
      return node;
    }
    return node.getChild(property).fieldPathProxy;
  }
};

let currentCompilingNode = undefined;
const compiledSchemas = new Map();
class SchemaImpl {
  schemaFn;
  constructor(schemaFn) {
    this.schemaFn = schemaFn;
  }
  compile() {
    if (compiledSchemas.has(this)) {
      return compiledSchemas.get(this);
    }
    const path = FieldPathNode.newRoot();
    compiledSchemas.set(this, path);
    let prevCompilingNode = currentCompilingNode;
    try {
      currentCompilingNode = path;
      this.schemaFn(path.fieldPathProxy);
    } finally {
      currentCompilingNode = prevCompilingNode;
    }
    return path;
  }
  static create(schema) {
    if (schema instanceof SchemaImpl) {
      return schema;
    }
    return new SchemaImpl(schema);
  }
  static rootCompile(schema) {
    try {
      compiledSchemas.clear();
      if (schema === undefined) {
        return FieldPathNode.newRoot();
      }
      if (schema instanceof SchemaImpl) {
        return schema.compile();
      }
      return new SchemaImpl(schema).compile();
    } finally {
      compiledSchemas.clear();
    }
  }
}
function isSchemaOrSchemaFn(value) {
  return value instanceof SchemaImpl || typeof value === 'function';
}
function assertPathIsCurrent(path) {
  if (currentCompilingNode !== FieldPathNode.unwrapFieldPath(path).root) {
    throw new Error(`A FieldPath can only be used directly within the Schema that owns it,` + ` **not** outside of it or within a sub-schema.`);
  }
}

class MetadataKey {
  brand;
  constructor() {}
}
function createMetadataKey() {
  return new MetadataKey();
}
class AggregateMetadataKey {
  reduce;
  getInitial;
  brand;
  constructor(reduce, getInitial) {
    this.reduce = reduce;
    this.getInitial = getInitial;
  }
}
function reducedMetadataKey(reduce, getInitial) {
  return new AggregateMetadataKey(reduce, getInitial);
}
function listMetadataKey() {
  return reducedMetadataKey((acc, item) => item === undefined ? acc : [...acc, item], () => []);
}
function minMetadataKey() {
  return reducedMetadataKey((prev, next) => {
    if (prev === undefined) {
      return next;
    }
    if (next === undefined) {
      return prev;
    }
    return Math.min(prev, next);
  }, () => undefined);
}
function maxMetadataKey() {
  return reducedMetadataKey((prev, next) => {
    if (prev === undefined) {
      return next;
    }
    if (next === undefined) {
      return prev;
    }
    return Math.max(prev, next);
  }, () => undefined);
}
function orMetadataKey() {
  return reducedMetadataKey((prev, next) => prev || next, () => false);
}
function andMetadataKey() {
  return reducedMetadataKey((prev, next) => prev && next, () => true);
}
const REQUIRED = orMetadataKey();
const MIN = maxMetadataKey();
const MAX = minMetadataKey();
const MIN_LENGTH = maxMetadataKey();
const MAX_LENGTH = minMetadataKey();
const PATTERN = listMetadataKey();

const DEBOUNCER = reducedMetadataKey((_, item) => item, () => undefined);

class FieldNodeContext {
  node;
  cache = new WeakMap();
  constructor(node) {
    this.node = node;
  }
  resolve(target) {
    if (!this.cache.has(target)) {
      const resolver = computed(() => {
        const targetPathNode = FieldPathNode.unwrapFieldPath(target);
        let field = this.node;
        let stepsRemaining = getBoundPathDepth();
        while (stepsRemaining > 0 || !field.structure.logic.hasLogic(targetPathNode.root.builder)) {
          stepsRemaining--;
          field = field.structure.parent;
          if (field === undefined) {
            throw new Error('Path is not part of this field tree.');
          }
        }
        for (let key of targetPathNode.keys) {
          field = field.structure.getChild(key);
          if (field === undefined) {
            throw new Error(`Cannot resolve path .${targetPathNode.keys.join('.')} relative to field ${['<root>', ...this.node.structure.pathKeys()].join('.')}.`);
          }
        }
        return field.fieldProxy;
      }, ...(ngDevMode ? [{
        debugName: "resolver"
      }] : []));
      this.cache.set(target, resolver);
    }
    return this.cache.get(target)();
  }
  get field() {
    return this.node.fieldProxy;
  }
  get state() {
    return this.node;
  }
  get value() {
    return this.node.structure.value;
  }
  get key() {
    return this.node.structure.keyInParent;
  }
  get pathKeys() {
    return this.node.structure.pathKeys;
  }
  index = computed(() => {
    const key = this.key();
    if (!isArray(untracked(this.node.structure.parent.value))) {
      throw new Error(`RuntimeError: cannot access index, parent field is not an array`);
    }
    return Number(key);
  }, ...(ngDevMode ? [{
    debugName: "index"
  }] : []));
  fieldTreeOf = p => this.resolve(p);
  stateOf = p => this.resolve(p)();
  valueOf = p => {
    const result = this.resolve(p)().value();
    if (result instanceof AbstractControl) {
      throw new Error(`Tried to read an 'AbstractControl' value form a 'form()'. Did you mean to use 'compatForm()' instead?`);
    }
    return result;
  };
}

class FieldMetadataState {
  node;
  metadata = new Map();
  constructor(node) {
    this.node = node;
    untracked(() => runInInjectionContext(this.node.structure.injector, () => {
      for (const [key, factory] of this.node.logicNode.logic.getMetadataFactoryEntries()) {
        this.metadata.set(key, factory(this.node.context));
      }
    }));
  }
  get(key) {
    if (key instanceof MetadataKey) {
      return this.metadata.get(key);
    }
    if (!this.metadata.has(key)) {
      const logic = this.node.logicNode.logic.getAggregateMetadata(key);
      const result = computed(() => logic.compute(this.node.context), ...(ngDevMode ? [{
        debugName: "result"
      }] : []));
      this.metadata.set(key, result);
    }
    return this.metadata.get(key);
  }
  has(key) {
    if (key instanceof AggregateMetadataKey) {
      return this.node.logicNode.logic.hasAggregateMetadata(key);
    } else {
      return this.metadata.has(key);
    }
  }
}

const FIELD_PROXY_HANDLER = {
  get(getTgt, p, receiver) {
    const tgt = getTgt();
    const child = tgt.structure.getChild(p);
    if (child !== undefined) {
      return child.fieldProxy;
    }
    const value = untracked(tgt.value);
    if (isArray(value)) {
      if (p === 'length') {
        return tgt.value().length;
      }
      if (p === Symbol.iterator) {
        return Array.prototype[p];
      }
    }
    if (isObject(value)) {
      if (p === Symbol.iterator) {
        return function* () {
          for (const key in receiver) {
            yield [key, receiver[key]];
          }
        };
      }
    }
    return undefined;
  },
  getOwnPropertyDescriptor(getTgt, prop) {
    const value = untracked(getTgt().value);
    const desc = Reflect.getOwnPropertyDescriptor(value, prop);
    if (desc && !desc.configurable) {
      desc.configurable = true;
    }
    return desc;
  },
  ownKeys(getTgt) {
    const value = untracked(getTgt().value);
    return typeof value === 'object' && value !== null ? Reflect.ownKeys(value) : [];
  }
};

function deepSignal(source, prop) {
  const read = computed(() => source()[prop()]);
  read[SIGNAL] = source[SIGNAL];
  read.set = value => {
    source.update(current => valueForWrite(current, value, prop()));
  };
  read.update = fn => {
    read.set(fn(untracked(read)));
  };
  read.asReadonly = () => read;
  return read;
}
function valueForWrite(sourceValue, newPropValue, prop) {
  if (isArray(sourceValue)) {
    const newValue = [...sourceValue];
    newValue[prop] = newPropValue;
    return newValue;
  } else {
    return {
      ...sourceValue,
      [prop]: newPropValue
    };
  }
}

class FieldNodeStructure {
  logic;
  identitySymbol = Symbol();
  _injector = undefined;
  get injector() {
    this._injector ??= Injector.create({
      providers: [],
      parent: this.fieldManager.injector
    });
    return this._injector;
  }
  constructor(logic) {
    this.logic = logic;
  }
  children() {
    return this.childrenMap()?.values() ?? [];
  }
  getChild(key) {
    const map = this.childrenMap();
    const value = this.value();
    if (!map || !isObject(value)) {
      return undefined;
    }
    if (isArray(value)) {
      const childValue = value[key];
      if (isObject(childValue) && childValue.hasOwnProperty(this.identitySymbol)) {
        key = childValue[this.identitySymbol];
      }
    }
    return map.get(typeof key === 'number' ? key.toString() : key);
  }
  destroy() {
    this.injector.destroy();
  }
}
class RootFieldNodeStructure extends FieldNodeStructure {
  node;
  fieldManager;
  value;
  get parent() {
    return undefined;
  }
  get root() {
    return this.node;
  }
  get pathKeys() {
    return ROOT_PATH_KEYS;
  }
  get keyInParent() {
    return ROOT_KEY_IN_PARENT;
  }
  childrenMap;
  constructor(node, pathNode, logic, fieldManager, value, adapter, createChildNode) {
    super(logic);
    this.node = node;
    this.fieldManager = fieldManager;
    this.value = value;
    this.childrenMap = makeChildrenMapSignal(node, value, this.identitySymbol, pathNode, logic, adapter, createChildNode);
  }
}
class ChildFieldNodeStructure extends FieldNodeStructure {
  parent;
  root;
  pathKeys;
  keyInParent;
  value;
  childrenMap;
  get fieldManager() {
    return this.root.structure.fieldManager;
  }
  constructor(node, pathNode, logic, parent, identityInParent, initialKeyInParent, adapter, createChildNode) {
    super(logic);
    this.parent = parent;
    this.root = this.parent.structure.root;
    this.pathKeys = computed(() => [...parent.structure.pathKeys(), this.keyInParent()], ...(ngDevMode ? [{
      debugName: "pathKeys"
    }] : []));
    if (identityInParent === undefined) {
      const key = initialKeyInParent;
      this.keyInParent = computed(() => {
        if (parent.structure.childrenMap()?.get(key) !== node) {
          throw new Error(`RuntimeError: orphan field, looking for property '${key}' of ${getDebugName(parent)}`);
        }
        return key;
      }, ...(ngDevMode ? [{
        debugName: "keyInParent"
      }] : []));
    } else {
      let lastKnownKey = initialKeyInParent;
      this.keyInParent = computed(() => {
        const parentValue = parent.structure.value();
        if (!isArray(parentValue)) {
          throw new Error(`RuntimeError: orphan field, expected ${getDebugName(parent)} to be an array`);
        }
        const data = parentValue[lastKnownKey];
        if (isObject(data) && data.hasOwnProperty(parent.structure.identitySymbol) && data[parent.structure.identitySymbol] === identityInParent) {
          return lastKnownKey;
        }
        for (let i = 0; i < parentValue.length; i++) {
          const data = parentValue[i];
          if (isObject(data) && data.hasOwnProperty(parent.structure.identitySymbol) && data[parent.structure.identitySymbol] === identityInParent) {
            return lastKnownKey = i.toString();
          }
        }
        throw new Error(`RuntimeError: orphan field, can't find element in array ${getDebugName(parent)}`);
      }, ...(ngDevMode ? [{
        debugName: "keyInParent"
      }] : []));
    }
    this.value = deepSignal(this.parent.structure.value, this.keyInParent);
    this.childrenMap = makeChildrenMapSignal(node, this.value, this.identitySymbol, pathNode, logic, adapter, createChildNode);
    this.fieldManager.structures.add(this);
  }
}
let globalId = 0;
const ROOT_PATH_KEYS = computed(() => [], ...(ngDevMode ? [{
  debugName: "ROOT_PATH_KEYS"
}] : []));
const ROOT_KEY_IN_PARENT = computed(() => {
  throw new Error(`RuntimeError: the top-level field in the form has no parent`);
}, ...(ngDevMode ? [{
  debugName: "ROOT_KEY_IN_PARENT"
}] : []));
function makeChildrenMapSignal(node, valueSignal, identitySymbol, pathNode, logic, adapter, createChildNode) {
  return linkedSignal({
    source: valueSignal,
    computation: (value, previous) => {
      let childrenMap = previous?.value;
      if (!isObject(value)) {
        return undefined;
      }
      const isValueArray = isArray(value);
      if (childrenMap !== undefined) {
        let oldKeys = undefined;
        if (isValueArray) {
          oldKeys = new Set(childrenMap.keys());
          for (let i = 0; i < value.length; i++) {
            const childValue = value[i];
            if (isObject(childValue) && childValue.hasOwnProperty(identitySymbol)) {
              oldKeys.delete(childValue[identitySymbol]);
            } else {
              oldKeys.delete(i.toString());
            }
          }
          for (const key of oldKeys) {
            childrenMap.delete(key);
          }
        } else {
          for (let key of childrenMap.keys()) {
            if (!value.hasOwnProperty(key)) {
              childrenMap.delete(key);
            }
          }
        }
      }
      for (let key of Object.keys(value)) {
        let trackingId = undefined;
        const childValue = value[key];
        if (childValue === undefined) {
          childrenMap?.delete(key);
          continue;
        }
        if (isValueArray && isObject(childValue) && !isArray(childValue)) {
          trackingId = childValue[identitySymbol] ??= Symbol(ngDevMode ? `id:${globalId++}` : '');
        }
        const identity = trackingId ?? key;
        if (childrenMap?.has(identity)) {
          continue;
        }
        let childPath;
        let childLogic;
        if (isValueArray) {
          childPath = pathNode.getChild(DYNAMIC);
          childLogic = logic.getChild(DYNAMIC);
        } else {
          childPath = pathNode.getChild(key);
          childLogic = logic.getChild(key);
        }
        childrenMap ??= new Map();
        childrenMap.set(identity, createChildNode({
          kind: 'child',
          parent: node,
          pathNode: childPath,
          logic: childLogic,
          initialKeyInParent: key,
          identityInParent: trackingId,
          fieldAdapter: adapter
        }));
      }
      return childrenMap;
    },
    equal: () => false
  });
}
function getDebugName(node) {
  return `<root>.${node.structure.pathKeys().join('.')}`;
}

class FieldSubmitState {
  node;
  selfSubmitting = signal(false, ...(ngDevMode ? [{
    debugName: "selfSubmitting"
  }] : []));
  serverErrors;
  constructor(node) {
    this.node = node;
    this.serverErrors = linkedSignal(...(ngDevMode ? [{
      debugName: "serverErrors",
      source: this.node.structure.value,
      computation: () => []
    }] : [{
      source: this.node.structure.value,
      computation: () => []
    }]));
  }
  submitting = computed(() => {
    return this.selfSubmitting() || (this.node.structure.parent?.submitting() ?? false);
  }, ...(ngDevMode ? [{
    debugName: "submitting"
  }] : []));
}

class FieldNode {
  structure;
  validationState;
  metadataState;
  nodeState;
  submitState;
  fieldAdapter;
  _context = undefined;
  get context() {
    return this._context ??= new FieldNodeContext(this);
  }
  fieldProxy = new Proxy(() => this, FIELD_PROXY_HANDLER);
  constructor(options) {
    this.fieldAdapter = options.fieldAdapter;
    this.structure = this.fieldAdapter.createStructure(this, options);
    this.validationState = this.fieldAdapter.createValidationState(this, options);
    this.nodeState = this.fieldAdapter.createNodeState(this, options);
    this.metadataState = new FieldMetadataState(this);
    this.submitState = new FieldSubmitState(this);
  }
  pendingSync = linkedSignal(...(ngDevMode ? [{
    debugName: "pendingSync",
    source: () => this.value(),
    computation: (_source, previous) => {
      previous?.value?.abort();
      return undefined;
    }
  }] : [{
    source: () => this.value(),
    computation: (_source, previous) => {
      previous?.value?.abort();
      return undefined;
    }
  }]));
  get logicNode() {
    return this.structure.logic;
  }
  get value() {
    return this.structure.value;
  }
  _controlValue = linkedSignal(() => this.value(), ...(ngDevMode ? [{
    debugName: "_controlValue"
  }] : []));
  get controlValue() {
    return this._controlValue.asReadonly();
  }
  get keyInParent() {
    return this.structure.keyInParent;
  }
  get errors() {
    return this.validationState.errors;
  }
  get errorSummary() {
    return this.validationState.errorSummary;
  }
  get pending() {
    return this.validationState.pending;
  }
  get valid() {
    return this.validationState.valid;
  }
  get invalid() {
    return this.validationState.invalid;
  }
  get dirty() {
    return this.nodeState.dirty;
  }
  get touched() {
    return this.nodeState.touched;
  }
  get disabled() {
    return this.nodeState.disabled;
  }
  get disabledReasons() {
    return this.nodeState.disabledReasons;
  }
  get hidden() {
    return this.nodeState.hidden;
  }
  get readonly() {
    return this.nodeState.readonly;
  }
  get fieldBindings() {
    return this.nodeState.fieldBindings;
  }
  get submitting() {
    return this.submitState.submitting;
  }
  get name() {
    return this.nodeState.name;
  }
  metadataOrUndefined(key) {
    return this.hasMetadata(key) ? this.metadata(key) : undefined;
  }
  get max() {
    return this.metadataOrUndefined(MAX);
  }
  get maxLength() {
    return this.metadataOrUndefined(MAX_LENGTH);
  }
  get min() {
    return this.metadataOrUndefined(MIN);
  }
  get minLength() {
    return this.metadataOrUndefined(MIN_LENGTH);
  }
  get pattern() {
    return this.metadataOrUndefined(PATTERN) ?? EMPTY;
  }
  get required() {
    return this.metadataOrUndefined(REQUIRED) ?? FALSE;
  }
  metadata(key) {
    return this.metadataState.get(key);
  }
  hasMetadata(key) {
    return this.metadataState.has(key);
  }
  markAsTouched() {
    this.nodeState.markAsTouched();
    this.pendingSync()?.abort();
    this.sync();
  }
  markAsDirty() {
    this.nodeState.markAsDirty();
  }
  reset() {
    untracked(() => this._reset());
  }
  _reset() {
    this.nodeState.markAsUntouched();
    this.nodeState.markAsPristine();
    for (const child of this.structure.children()) {
      child._reset();
    }
  }
  setControlValue(newValue) {
    this._controlValue.set(newValue);
    this.markAsDirty();
    this.debounceSync();
  }
  sync() {
    this.value.set(this.controlValue());
  }
  async debounceSync() {
    this.pendingSync()?.abort();
    const debouncer = this.nodeState.debouncer();
    if (debouncer) {
      const controller = new AbortController();
      const promise = debouncer(controller.signal);
      if (promise) {
        this.pendingSync.set(controller);
        await promise;
        if (controller.signal.aborted) {
          return;
        }
      }
    }
    this.sync();
  }
  static newRoot(fieldManager, value, pathNode, adapter) {
    return adapter.newRoot(fieldManager, value, pathNode, adapter);
  }
  static newChild(options) {
    return options.fieldAdapter.newChild(options);
  }
  createStructure(options) {
    return options.kind === 'root' ? new RootFieldNodeStructure(this, options.pathNode, options.logic, options.fieldManager, options.value, options.fieldAdapter, FieldNode.newChild) : new ChildFieldNodeStructure(this, options.pathNode, options.logic, options.parent, options.identityInParent, options.initialKeyInParent, options.fieldAdapter, FieldNode.newChild);
  }
}
const EMPTY = computed(() => [], ...(ngDevMode ? [{
  debugName: "EMPTY"
}] : []));
const FALSE = computed(() => false, ...(ngDevMode ? [{
  debugName: "FALSE"
}] : []));

class FieldNodeState {
  node;
  selfTouched = signal(false, ...(ngDevMode ? [{
    debugName: "selfTouched"
  }] : []));
  selfDirty = signal(false, ...(ngDevMode ? [{
    debugName: "selfDirty"
  }] : []));
  markAsTouched() {
    this.selfTouched.set(true);
  }
  markAsDirty() {
    this.selfDirty.set(true);
  }
  markAsPristine() {
    this.selfDirty.set(false);
  }
  markAsUntouched() {
    this.selfTouched.set(false);
  }
  fieldBindings = signal([], ...(ngDevMode ? [{
    debugName: "fieldBindings"
  }] : []));
  constructor(node) {
    this.node = node;
  }
  dirty = computed(() => {
    const selfDirtyValue = this.selfDirty() && !this.isNonInteractive();
    return reduceChildren(this.node, selfDirtyValue, (child, value) => value || child.nodeState.dirty(), shortCircuitTrue);
  }, ...(ngDevMode ? [{
    debugName: "dirty"
  }] : []));
  touched = computed(() => {
    const selfTouchedValue = this.selfTouched() && !this.isNonInteractive();
    return reduceChildren(this.node, selfTouchedValue, (child, value) => value || child.nodeState.touched(), shortCircuitTrue);
  }, ...(ngDevMode ? [{
    debugName: "touched"
  }] : []));
  disabledReasons = computed(() => [...(this.node.structure.parent?.nodeState.disabledReasons() ?? []), ...this.node.logicNode.logic.disabledReasons.compute(this.node.context)], ...(ngDevMode ? [{
    debugName: "disabledReasons"
  }] : []));
  disabled = computed(() => !!this.disabledReasons().length, ...(ngDevMode ? [{
    debugName: "disabled"
  }] : []));
  readonly = computed(() => (this.node.structure.parent?.nodeState.readonly() || this.node.logicNode.logic.readonly.compute(this.node.context)) ?? false, ...(ngDevMode ? [{
    debugName: "readonly"
  }] : []));
  hidden = computed(() => (this.node.structure.parent?.nodeState.hidden() || this.node.logicNode.logic.hidden.compute(this.node.context)) ?? false, ...(ngDevMode ? [{
    debugName: "hidden"
  }] : []));
  name = computed(() => {
    const parent = this.node.structure.parent;
    if (!parent) {
      return this.node.structure.fieldManager.rootName;
    }
    return `${parent.name()}.${this.node.structure.keyInParent()}`;
  }, ...(ngDevMode ? [{
    debugName: "name"
  }] : []));
  debouncer = computed(() => {
    if (this.node.logicNode.logic.hasAggregateMetadata(DEBOUNCER)) {
      const debouncerLogic = this.node.logicNode.logic.getAggregateMetadata(DEBOUNCER);
      const debouncer = debouncerLogic.compute(this.node.context);
      if (debouncer) {
        return signal => debouncer(this.node.context, signal);
      }
    }
    return this.node.structure.parent?.nodeState.debouncer?.();
  }, ...(ngDevMode ? [{
    debugName: "debouncer"
  }] : []));
  isNonInteractive = computed(() => this.hidden() || this.disabled() || this.readonly(), ...(ngDevMode ? [{
    debugName: "isNonInteractive"
  }] : []));
}

class BasicFieldAdapter {
  newRoot(fieldManager, value, pathNode, adapter) {
    return new FieldNode({
      kind: 'root',
      fieldManager,
      value,
      pathNode,
      logic: pathNode.builder.build(),
      fieldAdapter: adapter
    });
  }
  newChild(options) {
    return new FieldNode(options);
  }
  createNodeState(node) {
    return new FieldNodeState(node);
  }
  createValidationState(node) {
    return new FieldValidationState(node);
  }
  createStructure(node, options) {
    return node.createStructure(options);
  }
}

class FormFieldManager {
  injector;
  rootName;
  constructor(injector, rootName) {
    this.injector = injector;
    this.rootName = rootName ?? `${this.injector.get(APP_ID)}.form${nextFormId++}`;
  }
  structures = new Set();
  createFieldManagementEffect(root) {
    effect(() => {
      const liveStructures = new Set();
      this.markStructuresLive(root, liveStructures);
      for (const structure of this.structures) {
        if (!liveStructures.has(structure)) {
          this.structures.delete(structure);
          untracked(() => structure.destroy());
        }
      }
    }, {
      injector: this.injector
    });
  }
  markStructuresLive(structure, liveStructures) {
    liveStructures.add(structure);
    for (const child of structure.children()) {
      this.markStructuresLive(child.structure, liveStructures);
    }
  }
}
let nextFormId = 0;

function normalizeFormArgs(args) {
  let model;
  let schema;
  let options;
  if (args.length === 3) {
    [model, schema, options] = args;
  } else if (args.length === 2) {
    if (isSchemaOrSchemaFn(args[1])) {
      [model, schema] = args;
    } else {
      [model, options] = args;
    }
  } else {
    [model] = args;
  }
  return [model, schema, options];
}

function form(...args) {
  const [model, schema, options] = normalizeFormArgs(args);
  const injector = options?.injector ?? inject(Injector);
  const pathNode = runInInjectionContext(injector, () => SchemaImpl.rootCompile(schema));
  const fieldManager = new FormFieldManager(injector, options?.name);
  const adapter = options?.adapter ?? new BasicFieldAdapter();
  const fieldRoot = FieldNode.newRoot(fieldManager, model, pathNode, adapter);
  fieldManager.createFieldManagementEffect(fieldRoot.structure);
  return fieldRoot.fieldProxy;
}
function applyEach(path, schema) {
  assertPathIsCurrent(path);
  const elementPath = FieldPathNode.unwrapFieldPath(path).getChild(DYNAMIC).fieldPathProxy;
  apply(elementPath, schema);
}
function apply(path, schema) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.mergeIn(SchemaImpl.create(schema));
}
function applyWhen(path, logic, schema) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.mergeIn(SchemaImpl.create(schema), {
    fn: logic,
    path
  });
}
function applyWhenValue(path, predicate, schema) {
  applyWhen(path, ({
    value
  }) => predicate(value()), schema);
}
async function submit(form, action) {
  const node = form();
  markAllAsTouched(node);
  if (node.invalid()) {
    return;
  }
  node.submitState.selfSubmitting.set(true);
  try {
    const errors = await action(form);
    errors && setServerErrors(node, errors);
  } finally {
    node.submitState.selfSubmitting.set(false);
  }
}
function setServerErrors(submittedField, errors) {
  if (!isArray(errors)) {
    errors = [errors];
  }
  const errorsByField = new Map();
  for (const error of errors) {
    const errorWithField = addDefaultField(error, submittedField.fieldProxy);
    const field = errorWithField.field();
    let fieldErrors = errorsByField.get(field);
    if (!fieldErrors) {
      fieldErrors = [];
      errorsByField.set(field, fieldErrors);
    }
    fieldErrors.push(errorWithField);
  }
  for (const [field, fieldErrors] of errorsByField) {
    field.submitState.serverErrors.set(fieldErrors);
  }
}
function schema(fn) {
  return SchemaImpl.create(fn);
}
function markAllAsTouched(node) {
  node.markAsTouched();
  for (const child of node.structure.children()) {
    markAllAsTouched(child);
  }
}

export { AggregateMetadataKey, BasicFieldAdapter, DEBOUNCER, FieldNode, FieldNodeState, FieldNodeStructure, FieldPathNode, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MetadataKey, PATTERN, REQUIRED, addDefaultField, andMetadataKey, apply, applyEach, applyWhen, applyWhenValue, assertPathIsCurrent, calculateValidationSelfStatus, createMetadataKey, form, getInjectorFromOptions, isArray, listMetadataKey, maxMetadataKey, minMetadataKey, normalizeFormArgs, orMetadataKey, reducedMetadataKey, schema, submit };
//# sourceMappingURL=_structure-chunk.mjs.map
