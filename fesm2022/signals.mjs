/**
 * @license Angular v21.1.0-next.0+sha-7f16902
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

import { httpResource } from '@angular/common/http';
import * as i0 from '@angular/core';
import { computed, untracked, InjectionToken, inject, Injector, input, ɵCONTROL as _CONTROL, effect, Directive, runInInjectionContext, linkedSignal, signal, APP_ID, ɵisPromise as _isPromise, resource } from '@angular/core';
import { Validators, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
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
    if (builder.children.has(key)) {
      return [{
        builder: builder.children.get(key),
        predicates: []
      }];
    }
  } else {
    throw new Error('Unknown LogicNodeBuilder type');
  }
  return [];
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
  get element() {
    return this.getChild(DYNAMIC);
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
function standardSchemaError(issue, options) {
  return new StandardSchemaValidationError(issue, options);
}
function customError(obj) {
  return new CustomValidationError(obj);
}
class CustomValidationError {
  __brand = undefined;
  kind = '';
  field;
  message;
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
}
class _NgValidationError {
  __brand = undefined;
  kind = '';
  field;
  message;
  constructor(options) {
    if (options) {
      Object.assign(this, options);
    }
  }
}
class RequiredValidationError extends _NgValidationError {
  kind = 'required';
}
class MinValidationError extends _NgValidationError {
  min;
  kind = 'min';
  constructor(min, options) {
    super(options);
    this.min = min;
  }
}
class MaxValidationError extends _NgValidationError {
  max;
  kind = 'max';
  constructor(max, options) {
    super(options);
    this.max = max;
  }
}
class MinLengthValidationError extends _NgValidationError {
  minLength;
  kind = 'minLength';
  constructor(minLength, options) {
    super(options);
    this.minLength = minLength;
  }
}
class MaxLengthValidationError extends _NgValidationError {
  maxLength;
  kind = 'maxLength';
  constructor(maxLength, options) {
    super(options);
    this.maxLength = maxLength;
  }
}
class PatternValidationError extends _NgValidationError {
  pattern;
  kind = 'pattern';
  constructor(pattern, options) {
    super(options);
    this.pattern = pattern;
  }
}
class EmailValidationError extends _NgValidationError {
  kind = 'email';
}
class StandardSchemaValidationError extends _NgValidationError {
  issue;
  kind = 'standardSchema';
  constructor(issue, options) {
    super(options);
    this.issue = issue;
  }
}
const NgValidationError = _NgValidationError;

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
function isPlainError(error) {
  return typeof error === 'object' && (Object.getPrototypeOf(error) === Object.prototype || Object.getPrototypeOf(error) === null);
}
function ensureCustomValidationError(error) {
  if (isPlainError(error)) {
    return customError(error);
  }
  return error;
}
function ensureCustomValidationResult(result) {
  if (result === null || result === undefined) {
    return result;
  }
  if (isArray(result)) {
    return result.map(ensureCustomValidationError);
  }
  return ensureCustomValidationError(result);
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
        field: ctx.field,
        message: result
      };
    }
    return result ? {
      field: ctx.field
    } : undefined;
  });
}
function readonly(path, logic = () => true) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addReadonlyRule(logic);
}
function hidden(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addHiddenRule(logic);
}
function validate(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addSyncErrorRule(ctx => {
    return ensureCustomValidationResult(addDefaultField(logic(ctx), ctx.field));
  });
}
function validateTree(path, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addSyncTreeErrorRule(ctx => addDefaultField(logic(ctx), ctx.field));
}
function aggregateMetadata(path, key, logic) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addAggregateMetadataRule(key, logic);
}
function metadata(path, ...rest) {
  assertPathIsCurrent(path);
  let key;
  let factory;
  if (rest.length === 2) {
    [key, factory] = rest;
  } else {
    [factory] = rest;
  }
  key ??= createMetadataKey();
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  pathNode.builder.addMetadataFactory(key, factory);
  return key;
}

function validateAsync(path, opts) {
  assertPathIsCurrent(path);
  const pathNode = FieldPathNode.unwrapFieldPath(path);
  const RESOURCE = metadata(path, ctx => {
    const params = computed(() => {
      const node = ctx.stateOf(path);
      const validationState = node.validationState;
      if (validationState.shouldSkipValidation() || !validationState.syncValid()) {
        return undefined;
      }
      return opts.params(ctx);
    }, ...(ngDevMode ? [{
      debugName: "params"
    }] : []));
    return opts.factory(params);
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
        return addDefaultField(errors, ctx.field);
      case 'error':
        errors = opts.onError(res.error(), ctx);
        return addDefaultField(errors, ctx.field);
    }
  });
}
function validateHttp(path, opts) {
  validateAsync(path, {
    params: opts.request,
    factory: request => httpResource(request, opts.options),
    onSuccess: opts.onSuccess,
    onError: opts.onError
  });
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
    const errors = this.field().errors();
    if (errors.length === 0) {
      return null;
    }
    const errObj = {};
    for (const error of errors) {
      errObj[error.kind] = error;
    }
    return errObj;
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
    throw Error('AssertionError: unknown form control status');
  }
  valueAccessor = null;
  hasValidator(validator) {
    if (validator === Validators.required) {
      return this.field().metadata(REQUIRED)();
    }
    return false;
  }
  updateValueAndValidity() {}
}

const FIELD = new InjectionToken(typeof ngDevMode !== undefined && ngDevMode ? 'FIELD' : '');
class Field {
  injector = inject(Injector);
  field = input.required(...(ngDevMode ? [{
    debugName: "field"
  }] : []));
  state = computed(() => this.field()(), ...(ngDevMode ? [{
    debugName: "state"
  }] : []));
  [_CONTROL] = undefined;
  controlValueAccessors = inject(NG_VALUE_ACCESSOR, {
    optional: true,
    self: true
  });
  interopNgControl;
  get controlValueAccessor() {
    return this.controlValueAccessors?.[0] ?? this.interopNgControl?.valueAccessor ?? undefined;
  }
  get ɵhasInteropControl() {
    return this.controlValueAccessor !== undefined;
  }
  ɵgetOrCreateNgControl() {
    return this.interopNgControl ??= new InteropNgControl(this.state);
  }
  ɵinteropControlCreate() {
    const controlValueAccessor = this.controlValueAccessor;
    controlValueAccessor.registerOnChange(value => {
      const state = this.state();
      state.value.set(value);
      state.markAsDirty();
    });
    controlValueAccessor.registerOnTouched(() => this.state().markAsTouched());
  }
  ɵinteropControlUpdate() {
    const controlValueAccessor = this.controlValueAccessor;
    const value = this.state().value();
    const disabled = this.state().disabled();
    untracked(() => {
      controlValueAccessor.writeValue(value);
      controlValueAccessor.setDisabledState?.(disabled);
    });
  }
  ɵregister() {
    effect(onCleanup => {
      const fieldNode = this.state();
      fieldNode.nodeState.fieldBindings.update(controls => [...controls, this]);
      onCleanup(() => {
        fieldNode.nodeState.fieldBindings.update(controls => controls.filter(c => c !== this));
      });
    }, {
      injector: this.injector
    });
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.1.0-next.0+sha-7f16902",
    ngImport: i0,
    type: Field,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "17.1.0",
    version: "21.1.0-next.0+sha-7f16902",
    type: Field,
    isStandalone: true,
    selector: "[field]",
    inputs: {
      field: {
        classPropertyName: "field",
        publicName: "field",
        isSignal: true,
        isRequired: true,
        transformFunction: null
      }
    },
    providers: [{
      provide: FIELD,
      useExisting: Field
    }, {
      provide: NgControl,
      useFactory: () => inject(Field).ɵgetOrCreateNgControl()
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.1.0-next.0+sha-7f16902",
  ngImport: i0,
  type: Field,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[field]',
      providers: [{
        provide: FIELD,
        useExisting: Field
      }, {
        provide: NgControl,
        useFactory: () => inject(Field).ɵgetOrCreateNgControl()
      }]
    }]
  }],
  propDecorators: {
    field: [{
      type: i0.Input,
      args: [{
        isSignal: true,
        alias: "field",
        required: true
      }]
    }]
  }
});

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
  index = computed(() => {
    const key = this.key();
    if (!isArray(untracked(this.node.structure.parent.value))) {
      throw new Error(`RuntimeError: cannot access index, parent field is not an array`);
    }
    return Number(key);
  }, ...(ngDevMode ? [{
    debugName: "index"
  }] : []));
  fieldOf = p => this.resolve(p);
  stateOf = p => this.resolve(p)();
  valueOf = p => this.resolve(p)().value();
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
  get(getTgt, p) {
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
    return undefined;
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
  _context = undefined;
  fieldAdapter;
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
  get logicNode() {
    return this.structure.logic;
  }
  get value() {
    return this.structure.value;
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
    return this.metadataOrUndefined(PATTERN);
  }
  get required() {
    return this.metadataOrUndefined(REQUIRED);
  }
  metadata(key) {
    return this.metadataState.get(key);
  }
  hasMetadata(key) {
    return this.metadataState.has(key);
  }
  markAsTouched() {
    this.nodeState.markAsTouched();
  }
  markAsDirty() {
    this.nodeState.markAsDirty();
  }
  reset() {
    this.nodeState.markAsUntouched();
    this.nodeState.markAsPristine();
    for (const child of this.structure.children()) {
      child.reset();
    }
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
  const elementPath = FieldPathNode.unwrapFieldPath(path).element.fieldPathProxy;
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
  const MAX_MEMO = metadata(path, ctx => computed(() => typeof maxValue === 'number' ? maxValue : maxValue(ctx)));
  aggregateMetadata(path, MAX, ({
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
    if (ctx.value() > max) {
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
  const MAX_LENGTH_MEMO = metadata(path, ctx => computed(() => typeof maxLength === 'number' ? maxLength : maxLength(ctx)));
  aggregateMetadata(path, MAX_LENGTH, ({
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
  const MIN_MEMO = metadata(path, ctx => computed(() => typeof minValue === 'number' ? minValue : minValue(ctx)));
  aggregateMetadata(path, MIN, ({
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
    if (ctx.value() < min) {
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
  const MIN_LENGTH_MEMO = metadata(path, ctx => computed(() => typeof minLength === 'number' ? minLength : minLength(ctx)));
  aggregateMetadata(path, MIN_LENGTH, ({
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
  const PATTERN_MEMO = metadata(path, ctx => computed(() => pattern instanceof RegExp ? pattern : pattern(ctx)));
  aggregateMetadata(path, PATTERN, ({
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
  const REQUIRED_MEMO = metadata(path, ctx => computed(() => config?.when ? config.when(ctx) : true));
  aggregateMetadata(path, REQUIRED, ({
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

function validateStandardSchema(path, schema) {
  const VALIDATOR_MEMO = metadata(path, ({
    value
  }) => {
    return computed(() => schema['~standard'].validate(value()));
  });
  validateTree(path, ({
    state,
    fieldOf
  }) => {
    const result = state.metadata(VALIDATOR_MEMO)();
    if (_isPromise(result)) {
      return [];
    }
    return result.issues?.map(issue => standardIssueToFormTreeError(fieldOf(path), issue)) ?? [];
  });
  validateAsync(path, {
    params: ({
      state
    }) => {
      const result = state.metadata(VALIDATOR_MEMO)();
      return _isPromise(result) ? result : undefined;
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
      fieldOf
    }) => {
      return issues.map(issue => standardIssueToFormTreeError(fieldOf(path), issue));
    },
    onError: () => {}
  });
}
function standardIssueToFormTreeError(field, issue) {
  let target = field;
  for (const pathPart of issue.path ?? []) {
    const pathKey = typeof pathPart === 'object' ? pathPart.key : pathPart;
    target = target[pathKey];
  }
  return addDefaultField(standardSchemaError(issue), target);
}

export { AggregateMetadataKey, CustomValidationError, EmailValidationError, FIELD, Field, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MaxLengthValidationError, MaxValidationError, MetadataKey, MinLengthValidationError, MinValidationError, NgValidationError, PATTERN, PatternValidationError, REQUIRED, RequiredValidationError, StandardSchemaValidationError, aggregateMetadata, andMetadataKey, apply, applyEach, applyWhen, applyWhenValue, createMetadataKey, customError, disabled, email, emailError, form, hidden, listMetadataKey, max, maxError, maxLength, maxLengthError, maxMetadataKey, metadata, min, minError, minLength, minLengthError, minMetadataKey, orMetadataKey, pattern, patternError, readonly, reducedMetadataKey, required, requiredError, schema, standardSchemaError, submit, validate, validateAsync, validateHttp, validateStandardSchema, validateTree };
//# sourceMappingURL=signals.mjs.map
