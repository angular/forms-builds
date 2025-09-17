/**
 * @license Angular v21.0.0-next.3+sha-e523384
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */

import { httpResource } from '@angular/common/http';
import * as i0 from '@angular/core';
import { computed, untracked, ɵSIGNAL as _SIGNAL, inject, Injector, Renderer2, signal, ElementRef, effect, afterNextRender, DestroyRef, Directive, Input, reflectComponentType, OutputEmitterRef, EventEmitter, runInInjectionContext, linkedSignal, APP_ID, ɵisPromise as _isPromise, resource } from '@angular/core';
import { Validators, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { SIGNAL } from '@angular/core/primitives/signals';

/**
 * A version of `Array.isArray` that handles narrowing of readonly arrays properly.
 */
function isArray(value) {
    return Array.isArray(value);
}
/**
 * Checks if a value is an object.
 */
function isObject(value) {
    return (typeof value === 'object' || typeof value === 'function') && value != null;
}

/**
 * Perform a reduction over a field's children (if any) and return the result.
 *
 * Optionally, the reduction is short circuited based on the provided `shortCircuit` function.
 */
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
/** A shortCircuit function for reduceChildren that short-circuits if the value is false. */
function shortCircuitFalse(value) {
    return !value;
}
/** A shortCircuit function for reduceChildren that short-circuits if the value is true. */
function shortCircuitTrue(value) {
    return value;
}

/**
 * Helper function taking validation state, and returning own state of the node.
 * @param state
 */
function calculateValidationSelfStatus(state) {
    if (state.errors().length > 0) {
        return 'invalid';
    }
    if (state.pending()) {
        return 'unknown';
    }
    return 'valid';
}
/**
 * The validation state associated with a `FieldNode`.
 *
 * This class collects together various types of errors to represent the full validation state of
 * the field. There are 4 types of errors that need to be combined to determine validity:
 * 1. The synchronous errors produced by the schema logic.
 * 2. The synchronous tree errors produced by the schema logic. Tree errors may apply to a different
 *    field than the one that the logic that produced them is bound to. They support targeting the
 *    error at an arbitrary descendant field.
 * 3. The asynchronous tree errors produced by the schema logic. These work like synchronous tree
 *    errors, except the error list may also contain a special sentinel value indicating that a
 *    validator is still running.
 * 4. Server errors are not produced by the schema logic, but instead get imperatively added when a
 *    form submit fails with errors.
 */
class FieldValidationState {
    node;
    constructor(node) {
        this.node = node;
    }
    /**
     * The full set of synchronous tree errors visible to this field. This includes ones that are
     * targeted at a descendant field rather than at this field.
     */
    rawSyncTreeErrors = computed(() => {
        if (this.shouldSkipValidation()) {
            return [];
        }
        return [
            ...this.node.logicNode.logic.syncTreeErrors.compute(this.node.context),
            ...(this.node.structure.parent?.validationState.rawSyncTreeErrors() ?? []),
        ];
    }, ...(ngDevMode ? [{ debugName: "rawSyncTreeErrors" }] : []));
    /**
     * The full set of synchronous errors for this field, including synchronous tree errors and server
     * errors. Server errors are considered "synchronous" because they are imperatively added. From
     * the perspective of the field state they are either there or not, they are never in a pending
     * state.
     */
    syncErrors = computed(() => {
        // Short-circuit running validators if validation doesn't apply to this field.
        if (this.shouldSkipValidation()) {
            return [];
        }
        return [
            ...this.node.logicNode.logic.syncErrors.compute(this.node.context),
            ...this.syncTreeErrors(),
            ...normalizeErrors(this.node.submitState.serverErrors()),
        ];
    }, ...(ngDevMode ? [{ debugName: "syncErrors" }] : []));
    /**
     * Whether the field is considered valid according solely to its synchronous validators.
     * Errors resulting from a previous submit attempt are also considered for this state.
     */
    syncValid = computed(() => {
        // Short-circuit checking children if validation doesn't apply to this field.
        if (this.shouldSkipValidation()) {
            return true;
        }
        return reduceChildren(this.node, this.syncErrors().length === 0, (child, value) => value && child.validationState.syncValid(), shortCircuitFalse);
    }, ...(ngDevMode ? [{ debugName: "syncValid" }] : []));
    /**
     * The synchronous tree errors visible to this field that are specifically targeted at this field
     * rather than a descendant.
     */
    syncTreeErrors = computed(() => this.rawSyncTreeErrors().filter((err) => err.field === this.node.fieldProxy), ...(ngDevMode ? [{ debugName: "syncTreeErrors" }] : []));
    /**
     * The full set of asynchronous tree errors visible to this field. This includes ones that are
     * targeted at a descendant field rather than at this field, as well as sentinel 'pending' values
     * indicating that the validator is still running and an error could still occur.
     */
    rawAsyncErrors = computed(() => {
        // Short-circuit running validators if validation doesn't apply to this field.
        if (this.shouldSkipValidation()) {
            return [];
        }
        return [
            // TODO: add field in `validateAsync` and remove this map
            ...this.node.logicNode.logic.asyncErrors.compute(this.node.context),
            // TODO: does it make sense to filter this to errors in this subtree?
            ...(this.node.structure.parent?.validationState.rawAsyncErrors() ?? []),
        ];
    }, ...(ngDevMode ? [{ debugName: "rawAsyncErrors" }] : []));
    /**
     * The asynchronous tree errors visible to this field that are specifically targeted at this field
     * rather than a descendant. This also includes all 'pending' sentinel values, since those could
     * theoretically result in errors for this field.
     */
    asyncErrors = computed(() => {
        if (this.shouldSkipValidation()) {
            return [];
        }
        return this.rawAsyncErrors().filter((err) => err === 'pending' || err.field === this.node.fieldProxy);
    }, ...(ngDevMode ? [{ debugName: "asyncErrors" }] : []));
    /**
     * The combined set of all errors that currently apply to this field.
     */
    errors = computed(() => [
        ...this.syncErrors(),
        ...this.asyncErrors().filter((err) => err !== 'pending'),
    ], ...(ngDevMode ? [{ debugName: "errors" }] : []));
    errorSummary = computed(() => reduceChildren(this.node, this.errors(), (child, result) => [
        ...result,
        ...child.errorSummary(),
    ]), ...(ngDevMode ? [{ debugName: "errorSummary" }] : []));
    /**
     * Whether this field has any asynchronous validators still pending.
     */
    pending = computed(() => reduceChildren(this.node, this.asyncErrors().includes('pending'), (child, value) => value || child.validationState.asyncErrors().includes('pending')), ...(ngDevMode ? [{ debugName: "pending" }] : []));
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
    status = computed(() => {
        // Short-circuit checking children if validation doesn't apply to this field.
        if (this.shouldSkipValidation()) {
            return 'valid';
        }
        let ownStatus = calculateValidationSelfStatus(this);
        return reduceChildren(this.node, ownStatus, (child, value) => {
            if (value === 'invalid' || child.validationState.status() === 'invalid') {
                return 'invalid';
            }
            else if (value === 'unknown' || child.validationState.status() === 'unknown') {
                return 'unknown';
            }
            return 'valid';
        }, (v) => v === 'invalid');
    }, ...(ngDevMode ? [{ debugName: "status" }] : []));
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
    valid = computed(() => this.status() === 'valid', ...(ngDevMode ? [{ debugName: "valid" }] : []));
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
    invalid = computed(() => this.status() === 'invalid', ...(ngDevMode ? [{ debugName: "invalid" }] : []));
    /**
     * Indicates whether validation should be skipped for this field because it is hidden, disabled,
     * or readonly.
     */
    shouldSkipValidation = computed(() => this.node.hidden() || this.node.disabled() || this.node.readonly(), ...(ngDevMode ? [{ debugName: "shouldSkipValidation" }] : []));
}
/** Normalizes a validation result to a list of validation errors. */
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
    }
    else if (errors) {
        errors.field ??= field;
    }
    return errors;
}

/**
 * Special key which is used to represent a dynamic logic property in a `FieldPathNode` path.
 * This property is used to represent logic that applies to every element of some dynamic form data
 * (i.e. an array).
 *
 * For example, a rule like `applyEach(p.myArray, () => { ... })` will add logic to the `DYNAMIC`
 * property of `p.myArray`.
 */
const DYNAMIC = Symbol();
/** Represents a result that should be ignored because its predicate indicates it is not active. */
const IGNORED = Symbol();
/**
 * Base class for all logic. It is responsible for combining the results from multiple individual
 * logic functions registered in the schema, and using them to derive the value for some associated
 * piece of field state.
 */
class AbstractLogic {
    predicates;
    /** The set of logic functions that contribute to the value of the associated state. */
    fns = [];
    constructor(
    /**
     * A list of predicates that conditionally enable all logic in this logic instance.
     * The logic is only enabled when *all* of the predicates evaluate to true.
     */
    predicates) {
        this.predicates = predicates;
    }
    /** Registers a logic function with this logic instance. */
    push(logicFn) {
        this.fns.push(wrapWithPredicates(this.predicates, logicFn));
    }
    /**
     * Merges in the logic from another logic instance, subject to the predicates of both the other
     * instance and this instance.
     */
    mergeIn(other) {
        const fns = this.predicates
            ? other.fns.map((fn) => wrapWithPredicates(this.predicates, fn))
            : other.fns;
        this.fns.push(...fns);
    }
}
/** Logic that combines its individual logic function results with logical OR. */
class BooleanOrLogic extends AbstractLogic {
    get defaultValue() {
        return false;
    }
    compute(arg) {
        return this.fns.some((f) => {
            const result = f(arg);
            return result && result !== IGNORED;
        });
    }
}
/**
 * Logic that combines its individual logic function results by aggregating them in an array.
 * Depending on its `ignore` function it may ignore certain values, omitting them from the array.
 */
class ArrayMergeIgnoreLogic extends AbstractLogic {
    ignore;
    /** Creates an instance of this class that ignores `null` values. */
    static ignoreNull(predicates) {
        return new ArrayMergeIgnoreLogic(predicates, (e) => e === null);
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
            }
            else if (isArray(value)) {
                return [...prev, ...(this.ignore ? value.filter((e) => !this.ignore(e)) : value)];
            }
            else {
                if (this.ignore && this.ignore(value)) {
                    return prev;
                }
                return [...prev, value];
            }
        }, []);
    }
}
/** Logic that combines its individual logic function results by aggregating them in an array. */
class ArrayMergeLogic extends ArrayMergeIgnoreLogic {
    constructor(predicates) {
        super(predicates, undefined);
    }
}
/** Logic that combines an AggregateProperty according to the property's own reduce function. */
class AggregatePropertyMergeLogic extends AbstractLogic {
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
/**
 * Wraps a logic function such that it returns the special `IGNORED` sentinel value if any of the
 * given predicates evaluates to false.
 *
 * @param predicates A list of bound predicates to apply to the logic function
 * @param logicFn The logic function to wrap
 * @returns A wrapped version of the logic function that may return `IGNORED`.
 */
function wrapWithPredicates(predicates, logicFn) {
    if (predicates.length === 0) {
        return logicFn;
    }
    return (arg) => {
        for (const predicate of predicates) {
            let predicateField = arg.stateOf(predicate.path);
            // Check the depth of the current field vs the depth this predicate is supposed to be
            // evaluated at. If necessary, walk up the field tree to grab the correct context field.
            // We can check the pathKeys as an untracked read since we know the structure of our fields
            // doesn't change.
            const depthDiff = untracked(predicateField.structure.pathKeys).length - predicate.depth;
            for (let i = 0; i < depthDiff; i++) {
                predicateField = predicateField.structure.parent;
            }
            // If any of the predicates don't match, don't actually run the logic function, just return
            // the default value.
            if (!predicate.fn(predicateField.context)) {
                return IGNORED;
            }
        }
        return logicFn(arg);
    };
}
/**
 * Container for all the different types of logic that can be applied to a field
 * (disabled, hidden, errors, etc.)
 */
class LogicContainer {
    predicates;
    /** Logic that determines if the field is hidden. */
    hidden;
    /** Logic that determines reasons for the field being disabled. */
    disabledReasons;
    /** Logic that determines if the field is read-only. */
    readonly;
    /** Logic that produces synchronous validation errors for the field. */
    syncErrors;
    /** Logic that produces synchronous validation errors for the field's subtree. */
    syncTreeErrors;
    /** Logic that produces asynchronous validation results (errors or 'pending'). */
    asyncErrors;
    /** A map of aggregate properties to the `AbstractLogic` instances that compute their values. */
    aggregateProperties = new Map();
    /** A map of property keys to the factory functions that create their values. */
    propertyFactories = new Map();
    /**
     * Constructs a new `Logic` container.
     * @param predicates An array of predicates that must all be true for the logic
     *   functions within this container to be active.
     */
    constructor(predicates) {
        this.predicates = predicates;
        this.hidden = new BooleanOrLogic(predicates);
        this.disabledReasons = new ArrayMergeLogic(predicates);
        this.readonly = new BooleanOrLogic(predicates);
        this.syncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
        this.syncTreeErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
        this.asyncErrors = ArrayMergeIgnoreLogic.ignoreNull(predicates);
    }
    /** Checks whether there is logic for the given aggregate property. */
    hasAggregateProperty(prop) {
        return this.aggregateProperties.has(prop);
    }
    /**
     * Gets an iterable of [aggregate property, logic function] pairs.
     * @returns An iterable of aggregate property entries.
     */
    getAggregatePropertyEntries() {
        return this.aggregateProperties.entries();
    }
    /**
     * Gets an iterable of [property, value factory function] pairs.
     * @returns An iterable of property factory entries.
     */
    getPropertyFactoryEntries() {
        return this.propertyFactories.entries();
    }
    /**
     * Retrieves or creates the `AbstractLogic` for a given aggregate property.
     * @param prop The `AggregateProperty` for which to get the logic.
     * @returns The `AbstractLogic` associated with the key.
     */
    getAggregateProperty(prop) {
        if (!this.aggregateProperties.has(prop)) {
            this.aggregateProperties.set(prop, new AggregatePropertyMergeLogic(this.predicates, prop));
        }
        return this.aggregateProperties.get(prop);
    }
    /**
     * Adds a factory function for a given property.
     * @param prop The `Property` to associate the factory with.
     * @param factory The factory function.
     * @throws If a factory is already defined for the given key.
     */
    addPropertyFactory(prop, factory) {
        if (this.propertyFactories.has(prop)) {
            // TODO: name of the property?
            throw new Error(`Can't define value twice for the same Property`);
        }
        this.propertyFactories.set(prop, factory);
    }
    /**
     * Merges logic from another `Logic` instance into this one.
     * @param other The `Logic` instance to merge from.
     */
    mergeIn(other) {
        this.hidden.mergeIn(other.hidden);
        this.disabledReasons.mergeIn(other.disabledReasons);
        this.readonly.mergeIn(other.readonly);
        this.syncErrors.mergeIn(other.syncErrors);
        this.syncTreeErrors.mergeIn(other.syncTreeErrors);
        this.asyncErrors.mergeIn(other.asyncErrors);
        for (const [prop, propertyLogic] of other.getAggregatePropertyEntries()) {
            this.getAggregateProperty(prop).mergeIn(propertyLogic);
        }
        for (const [prop, propertyFactory] of other.getPropertyFactoryEntries()) {
            this.addPropertyFactory(prop, propertyFactory);
        }
    }
}

let boundPathDepth = 0;
/**
 * The depth of the current path when evaluating a logic function.
 * Do not set this directly, it is a context variable managed by `setBoundPathDepthForResolution`.
 */
function getBoundPathDepth() {
    return boundPathDepth;
}
/**
 * Sets the bound path depth for the duration of the given logic function.
 * This is used to ensure that the field resolution algorithm walks far enough up the field tree to
 * reach the point where the root of the path we're bound to is applied. This normally isn't a big
 * concern, but matters when we're dealing with recursive structures.
 *
 * Consider this example:
 *
 * ```
 * const s = schema(p => {
 *   disabled(p.next, ({valueOf}) => valueOf(p.data));
 *   apply(p.next, s);
 * });
 * ```
 *
 * Here we need to know that the `disabled` logic was bound to a path of depth 1. Otherwise we'd
 * attempt to resolve `p.data` in the context of the field corresponding to `p.next`.
 * The resolution algorithm would start with the field for `p.next` and see that it *does* contain
 * the logic for `s` (due to the fact that its recursively applied.) It would then decide not to
 * walk up the field tree at all, and to immediately start walking down the keys for the target path
 * `p.data`, leading it to grab the field corresponding to `p.next.data`.
 *
 * We avoid the problem described above by keeping track of the depth (relative to Schema root) of
 * the path we were bound to. We then require the resolution algorithm to walk at least that far up
 * the tree before finding a node that contains the logic for `s`.
 *
 * @param fn A logic function that is bound to a particular path
 * @param depth The depth in the field tree of the field the logic is bound to
 * @returns A version of the logic function that is aware of its depth.
 */
function setBoundPathDepthForResolution(fn, depth) {
    return (...args) => {
        try {
            boundPathDepth = depth;
            return fn(...args);
        }
        finally {
            boundPathDepth = 0;
        }
    };
}

/**
 * Abstract base class for building a `LogicNode`.
 * This class defines the interface for adding various logic rules (e.g., hidden, disabled)
 * and data factories to a node in the logic tree.
 * LogicNodeBuilders are 1:1 with nodes in the Schema tree.
 */
class AbstractLogicNodeBuilder {
    depth;
    constructor(
    /** The depth of this node in the schema tree. */
    depth) {
        this.depth = depth;
    }
    /**
     * Builds the `LogicNode` from the accumulated rules and child builders.
     * @returns The constructed `LogicNode`.
     */
    build() {
        return new LeafLogicNode(this, [], 0);
    }
}
/**
 * A builder for `LogicNode`. Used to add logic to the final `LogicNode` tree.
 * This builder supports merging multiple sources of logic, potentially with predicates,
 * preserving the order of rule application.
 */
class LogicNodeBuilder extends AbstractLogicNodeBuilder {
    constructor(depth) {
        super(depth);
    }
    /**
     * The current `NonMergeableLogicNodeBuilder` being used to add rules directly to this
     * `LogicNodeBuilder`. Do not use this directly, call `getCurrent()` which will create a current
     * builder if there is none.
     */
    current;
    /**
     * Stores all builders that contribute to this node, along with any predicates
     * that gate their application.
     */
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
    addAggregatePropertyRule(key, logic) {
        this.getCurrent().addAggregatePropertyRule(key, logic);
    }
    addPropertyFactory(key, factory) {
        this.getCurrent().addPropertyFactory(key, factory);
    }
    getChild(key) {
        return this.getCurrent().getChild(key);
    }
    hasLogic(builder) {
        if (this === builder) {
            return true;
        }
        return this.all.some(({ builder: subBuilder }) => subBuilder.hasLogic(builder));
    }
    /**
     * Merges logic from another `LogicNodeBuilder` into this one.
     * If a `predicate` is provided, all logic from the `other` builder will only apply
     * when the predicate evaluates to true.
     * @param other The `LogicNodeBuilder` to merge in.
     * @param predicate An optional predicate to gate the merged logic.
     */
    mergeIn(other, predicate) {
        // Add the other builder to our collection, we'll defer the actual merging of the logic until
        // the logic node is requested to be created. In order to preserve the original ordering of the
        // rules, we close off the current builder to any further edits. If additional logic is added,
        // a new current builder will be created to capture it.
        if (predicate) {
            this.all.push({
                builder: other,
                predicate: {
                    fn: setBoundPathDepthForResolution(predicate.fn, this.depth),
                    path: predicate.path,
                },
            });
        }
        else {
            this.all.push({ builder: other });
        }
        this.current = undefined;
    }
    /**
     * Gets the current `NonMergeableLogicNodeBuilder` for adding rules directly to this
     * `LogicNodeBuilder`. If no current builder exists, a new one is created.
     * The current builder is cleared whenever `mergeIn` is called to preserve the order
     * of rules when merging separate builder trees.
     * @returns The current `NonMergeableLogicNodeBuilder`.
     */
    getCurrent() {
        if (this.current === undefined) {
            this.current = new NonMergeableLogicNodeBuilder(this.depth);
            this.all.push({ builder: this.current });
        }
        return this.current;
    }
    /**
     * Creates a new root `LogicNodeBuilder`.
     * @returns A new instance of `LogicNodeBuilder`.
     */
    static newRoot() {
        return new LogicNodeBuilder(0);
    }
}
/**
 * A type of `AbstractLogicNodeBuilder` used internally by the `LogicNodeBuilder` to record "pure"
 * chunks of logic that do not require merging in other builders.
 */
class NonMergeableLogicNodeBuilder extends AbstractLogicNodeBuilder {
    /** The collection of logic rules directly added to this builder. */
    logic = new LogicContainer([]);
    /**
     * A map of child property keys to their corresponding `LogicNodeBuilder` instances.
     * This allows for building a tree of logic.
     */
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
    addAggregatePropertyRule(key, logic) {
        this.logic.getAggregateProperty(key).push(setBoundPathDepthForResolution(logic, this.depth));
    }
    addPropertyFactory(key, factory) {
        this.logic.addPropertyFactory(key, setBoundPathDepthForResolution(factory, this.depth));
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
/**
 * A tree structure of `Logic` corresponding to a tree of fields.
 * This implementation represents a leaf in the sense that its logic is derived
 * from a single builder.
 */
class LeafLogicNode {
    builder;
    predicates;
    depth;
    /** The computed logic for this node. */
    logic;
    /**
     * Constructs a `LeafLogicNode`.
     * @param builder The `AbstractLogicNodeBuilder` from which to derive the logic.
     *   If undefined, an empty `Logic` instance is created.
     * @param predicates An array of predicates that gate the logic from the builder.
     */
    constructor(builder, predicates, 
    /** The depth of this node in the field tree. */
    depth) {
        this.builder = builder;
        this.predicates = predicates;
        this.depth = depth;
        this.logic = builder ? createLogic(builder, predicates, depth) : new LogicContainer([]);
    }
    // TODO: cache here, or just rely on the user of this API to do caching?
    /**
     * Retrieves the `LogicNode` for a child identified by the given property key.
     * @param key The property key of the child.
     * @returns The `LogicNode` for the specified child.
     */
    getChild(key) {
        // The logic for a particular child may be spread across multiple builders. We lazily combine
        // this logic at the time the child logic node is requested to be created.
        const childBuilders = this.builder ? getAllChildBuilders(this.builder, key) : [];
        if (childBuilders.length === 0) {
            return new LeafLogicNode(undefined, [], this.depth + 1);
        }
        else if (childBuilders.length === 1) {
            const { builder, predicates } = childBuilders[0];
            return new LeafLogicNode(builder, [...this.predicates, ...predicates.map((p) => bindLevel(p, this.depth))], this.depth + 1);
        }
        else {
            const builtNodes = childBuilders.map(({ builder, predicates }) => new LeafLogicNode(builder, [...this.predicates, ...predicates.map((p) => bindLevel(p, this.depth))], this.depth + 1));
            return new CompositeLogicNode(builtNodes);
        }
    }
    /**
     * Checks whether the logic from a particular `AbstractLogicNodeBuilder` has been merged into this
     * node.
     * @param builder The builder to check for.
     * @returns True if the builder has been merged, false otherwise.
     */
    hasLogic(builder) {
        return this.builder?.hasLogic(builder) ?? false;
    }
}
/**
 * A `LogicNode` that represents the composition of multiple `LogicNode` instances.
 * This is used when logic for a particular path is contributed by several distinct
 * builder branches that need to be merged.
 */
class CompositeLogicNode {
    all;
    /** The merged logic from all composed nodes. */
    logic;
    /**
     * Constructs a `CompositeLogicNode`.
     * @param all An array of `LogicNode` instances to compose.
     */
    constructor(all) {
        this.all = all;
        this.logic = new LogicContainer([]);
        for (const node of all) {
            this.logic.mergeIn(node.logic);
        }
    }
    /**
     * Retrieves the child `LogicNode` by composing the results of `getChild` from all
     * underlying `LogicNode` instances.
     * @param key The property key of the child.
     * @returns A `CompositeLogicNode` representing the composed child.
     */
    getChild(key) {
        return new CompositeLogicNode(this.all.flatMap((child) => child.getChild(key)));
    }
    /**
     * Checks whether the logic from a particular `AbstractLogicNodeBuilder` has been merged into this
     * node.
     * @param builder The builder to check for.
     * @returns True if the builder has been merged, false otherwise.
     */
    hasLogic(builder) {
        return this.all.some((node) => node.hasLogic(builder));
    }
}
/**
 * Gets all of the builders that contribute logic to the given child of the parent builder.
 * This function recursively traverses the builder hierarchy.
 * @param builder The parent `AbstractLogicNodeBuilder`.
 * @param key The property key of the child.
 * @returns An array of objects, each containing a `LogicNodeBuilder` for the child and any associated predicates.
 */
function getAllChildBuilders(builder, key) {
    if (builder instanceof LogicNodeBuilder) {
        return builder.all.flatMap(({ builder, predicate }) => {
            const children = getAllChildBuilders(builder, key);
            if (predicate) {
                return children.map(({ builder, predicates }) => ({
                    builder,
                    predicates: [...predicates, predicate],
                }));
            }
            return children;
        });
    }
    else if (builder instanceof NonMergeableLogicNodeBuilder) {
        if (builder.children.has(key)) {
            return [{ builder: builder.children.get(key), predicates: [] }];
        }
    }
    else {
        throw new Error('Unknown LogicNodeBuilder type');
    }
    return [];
}
/**
 * Creates the full `Logic` for a given builder.
 * This function handles different types of builders (`LogicNodeBuilder`, `NonMergeableLogicNodeBuilder`)
 * and applies the provided predicates.
 * @param builder The `AbstractLogicNodeBuilder` to process.
 * @param predicates Predicates to apply to the logic derived from the builder.
 * @param depth The depth in the field tree of the field which this logic applies to.
 * @returns The `Logic` instance.
 */
function createLogic(builder, predicates, depth) {
    const logic = new LogicContainer(predicates);
    if (builder instanceof LogicNodeBuilder) {
        const builtNodes = builder.all.map(({ builder, predicate }) => new LeafLogicNode(builder, predicate ? [...predicates, bindLevel(predicate, depth)] : predicates, depth));
        for (const node of builtNodes) {
            logic.mergeIn(node.logic);
        }
    }
    else if (builder instanceof NonMergeableLogicNodeBuilder) {
        logic.mergeIn(builder.logic);
    }
    else {
        throw new Error('Unknown LogicNodeBuilder type');
    }
    return logic;
}
/**
 * Create a bound version of the given predicate to a specific depth in the field tree.
 * This allows us to unambiguously know which `FieldContext` the predicate function should receive.
 *
 * This is of particular concern when a schema is applied recursively to itself. Since the schema is
 * only compiled once, each nested application adds the same predicate instance. We differentiate
 * these by recording the depth of the field they're bound to.
 *
 * @param predicate The unbound predicate
 * @param depth The depth of the field the predicate is bound to
 * @returns A bound predicate
 */
function bindLevel(predicate, depth) {
    return { ...predicate, depth: depth };
}

/**
 * Special key which is used to retrieve the `FieldPathNode` instance from its `FieldPath` proxy wrapper.
 */
const PATH = Symbol('PATH');
/**
 * A path in the schema on which logic is stored so that it can be added to the corresponding field
 * when the field is created.
 */
class FieldPathNode {
    keys;
    logic;
    /** The root path node from which this path node is descended. */
    root;
    /**
     * A map containing all child path nodes that have been created on this path.
     * Child path nodes are created automatically on first access if they do not exist already.
     */
    children = new Map();
    /**
     * A proxy that wraps the path node, allowing navigation to its child paths via property access.
     */
    fieldPathProxy = new Proxy(this, FIELD_PATH_PROXY_HANDLER);
    constructor(
    /** The property keys used to navigate from the root path to this path. */
    keys, 
    /** The logic builder used to accumulate logic on this path node. */
    logic, root) {
        this.keys = keys;
        this.logic = logic;
        this.root = root ?? this;
    }
    /**
     * Gets the special path node containing the per-element logic that applies to *all* children paths.
     */
    get element() {
        return this.getChild(DYNAMIC);
    }
    /**
     * Gets the path node for the given child property key.
     * Child paths are created automatically on first access if they do not exist already.
     */
    getChild(key) {
        if (!this.children.has(key)) {
            this.children.set(key, new FieldPathNode([...this.keys, key], this.logic.getChild(key), this.root));
        }
        return this.children.get(key);
    }
    /**
     * Merges in logic from another schema to this one.
     * @param other The other schema to merge in the logic from
     * @param predicate A predicate indicating when the merged in logic should be active.
     */
    mergeIn(other, predicate) {
        const path = other.compile();
        this.logic.mergeIn(path.logic, predicate);
    }
    /** Extracts the underlying path node from the given path proxy. */
    static unwrapFieldPath(formPath) {
        return formPath[PATH];
    }
    /** Creates a new root path node to be passed in to a schema function. */
    static newRoot() {
        return new FieldPathNode([], LogicNodeBuilder.newRoot(), undefined);
    }
}
/** Proxy handler which implements `FieldPath` on top of a `FieldPathNode`. */
const FIELD_PATH_PROXY_HANDLER = {
    get(node, property) {
        if (property === PATH) {
            return node;
        }
        return node.getChild(property).fieldPathProxy;
    },
};

/**
 * Keeps track of the path node for the schema function that is currently being compiled. This is
 * used to detect erroneous references to a path node outside of the context of its schema function.
 * Do not set this directly, it is a context variable managed by `SchemaImpl.compile`.
 */
let currentCompilingNode = undefined;
/**
 * A cache of all schemas compiled under the current root compilation. This is used to avoid doing
 * extra work when compiling a schema that reuses references to the same sub-schema. For example:
 *
 * ```
 * const sub = schema(p => ...);
 * const s = schema(p => {
 *   apply(p.a, sub);
 *   apply(p.b, sub);
 * });
 * ```
 *
 * This also ensures that we don't go into an infinite loop when compiling a schema that references
 * itself.
 *
 * Do not directly add or remove entries from this map, it is a context variable managed by
 * `SchemaImpl.compile` and `SchemaImpl.rootCompile`.
 */
const compiledSchemas = new Map();
/**
 * Implements the `Schema` concept.
 */
class SchemaImpl {
    schemaFn;
    constructor(schemaFn) {
        this.schemaFn = schemaFn;
    }
    /**
     * Compiles this schema within the current root compilation context. If the schema was previously
     * compiled within this context, we reuse the cached FieldPathNode, otherwise we create a new one
     * and cache it in the compilation context.
     */
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
        }
        finally {
            // Use a try/finally to ensure we restore the previous root upon completion,
            // even if there are errors while compiling the schema.
            currentCompilingNode = prevCompilingNode;
        }
        return path;
    }
    /**
     * Creates a SchemaImpl from the given SchemaOrSchemaFn.
     */
    static create(schema) {
        if (schema instanceof SchemaImpl) {
            return schema;
        }
        return new SchemaImpl(schema);
    }
    /**
     * Compiles the given schema in a fresh compilation context. This clears the cached results of any
     * previous compilations.
     */
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
        }
        finally {
            // Use a try/finally to ensure we properly reset the compilation context upon completion,
            // even if there are errors while compiling the schema.
            compiledSchemas.clear();
        }
    }
}
/** Checks if the given value is a schema or schema function. */
function isSchemaOrSchemaFn(value) {
    return value instanceof SchemaImpl || typeof value === 'function';
}
/** Checks that a path node belongs to the schema function currently being compiled. */
function assertPathIsCurrent(path) {
    if (currentCompilingNode !== FieldPathNode.unwrapFieldPath(path).root) {
        throw new Error(`A FieldPath can only be used directly within the Schema that owns it,` +
            ` **not** outside of it or within a sub-schema.`);
    }
}

/**
 * Represents a property that may be defined on a field when it is created using a `property` rule
 * in the schema. A particular `Property` can only be defined on a particular field **once**.
 *
 * @experimental 21.0.0
 */
class Property {
    brand;
    /** Use {@link createProperty}. */
    constructor() { }
}
/**
 * Creates a {@link Property}.
 *
 * @experimental 21.0.0
 */
function createProperty() {
    return new Property();
}
/**
 * Represents a property that is aggregated from multiple parts according to the property's reducer
 * function. A value can be contributed to the aggregated value for a field using an
 * `aggregateProperty` rule in the schema. There may be multiple rules in a schema that contribute
 * values to the same `AggregateProperty` of the same field.
 *
 * @experimental 21.0.0
 */
class AggregateProperty {
    reduce;
    getInitial;
    brand;
    /** Use {@link reducedProperty}. */
    constructor(reduce, getInitial) {
        this.reduce = reduce;
        this.getInitial = getInitial;
    }
}
/**
 * Creates an aggregate property that reduces its individual values into an accumulated value using
 * the given `reduce` and `getInitial` functions.
 * @param reduce The reducer function.
 * @param getInitial A function that gets the initial value for the reduce operation.
 *
 * @experimental 21.0.0
 */
function reducedProperty(reduce, getInitial) {
    return new AggregateProperty(reduce, getInitial);
}
/**
 * Creates an aggregate property that reduces its individual values into a list.
 *
 * @experimental 21.0.0
 */
function listProperty() {
    return reducedProperty((acc, item) => (item === undefined ? acc : [...acc, item]), () => []);
}
/**
 * Creates an aggregate property that reduces its individual values by taking their min.
 *
 * @experimental 21.0.0
 */
function minProperty() {
    return reducedProperty((prev, next) => {
        if (prev === undefined) {
            return next;
        }
        if (next === undefined) {
            return prev;
        }
        return Math.min(prev, next);
    }, () => undefined);
}
/**
 * Creates an aggregate property that reduces its individual values by taking their max.
 *
 * @experimental 21.0.0
 */
function maxProperty() {
    return reducedProperty((prev, next) => {
        if (prev === undefined) {
            return next;
        }
        if (next === undefined) {
            return prev;
        }
        return Math.max(prev, next);
    }, () => undefined);
}
/**
 * Creates an aggregate property that reduces its individual values by logically or-ing them.
 *
 * @experimental 21.0.0
 */
function orProperty() {
    return reducedProperty((prev, next) => prev || next, () => false);
}
/**
 * Creates an aggregate property that reduces its individual values by logically and-ing them.
 *
 * @experimental 21.0.0
 */
function andProperty() {
    return reducedProperty((prev, next) => prev && next, () => true);
}
/**
 * An aggregate property representing whether the field is required.
 *
 * @experimental 21.0.0
 */
const REQUIRED = orProperty();
/**
 * An aggregate property representing the min value of the field.
 *
 * @experimental 21.0.0
 */
const MIN = maxProperty();
/**
 * An aggregate property representing the max value of the field.
 *
 * @experimental 21.0.0
 */
const MAX = minProperty();
/**
 * An aggregate property representing the min length of the field.
 *
 * @experimental 21.0.0
 */
const MIN_LENGTH = maxProperty();
/**
 * An aggregate property representing the max length of the field.
 *
 * @experimental 21.0.0
 */
const MAX_LENGTH = minProperty();
/**
 * An aggregate property representing the patterns the field must match.
 *
 * @experimental 21.0.0
 */
const PATTERN = listProperty();

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
 * @experimental 21.0.0
 */
function disabled(path, logic) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.logic.addDisabledReasonRule((ctx) => {
        let result = true;
        if (typeof logic === 'string') {
            result = logic;
        }
        else if (logic) {
            result = logic(ctx);
        }
        if (typeof result === 'string') {
            return { field: ctx.field, message: result };
        }
        return result ? { field: ctx.field } : undefined;
    });
}
/**
 * Adds logic to a field to conditionally make it readonly. A readonly field does not contribute to
 * the validation, touched/dirty, or other state of its parent field.
 *
 * @param path The target path to make readonly.
 * @param logic A reactive function that returns `true` when the field is readonly.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @experimental 21.0.0
 */
function readonly(path, logic = () => true) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.logic.addReadonlyRule(logic);
}
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
 * @experimental 21.0.0
 */
function hidden(path, logic) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.logic.addHiddenRule(logic);
}
/**
 * Adds logic to a field to determine if the field has validation errors.
 *
 * @param path The target path to add the validation logic to.
 * @param logic A `Validator` that returns the current validation errors.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @experimental 21.0.0
 */
function validate(path, logic) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.logic.addSyncErrorRule((ctx) => addDefaultField(logic(ctx), ctx.field));
}
/**
 * Adds logic to a field to determine if the field or any of its child fields has validation errors.
 *
 * @param path The target path to add the validation logic to.
 * @param logic A `TreeValidator` that returns the current validation errors.
 *   Errors returned by the validator may specify a target field to indicate an error on a child field.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @experimental 21.0.0
 */
function validateTree(path, logic) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.logic.addSyncTreeErrorRule((ctx) => addDefaultField(logic(ctx), ctx.field));
}
/**
 * Adds a value to an `AggregateProperty` of a field.
 *
 * @param path The target path to set the aggregate property on.
 * @param prop The aggregate property
 * @param logic A function that receives the `FieldContext` and returns a value to add to the aggregate property.
 * @template TValue The type of value stored in the field the logic is bound to.
 * @template TPropItem The type of value the property aggregates over.
 * @template TPathKind The kind of path the logic is bound to (a root path, child path, or item of an array)
 *
 * @experimental 21.0.0
 */
function aggregateProperty(path, prop, logic) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.logic.addAggregatePropertyRule(prop, logic);
}
function property(path, ...rest) {
    assertPathIsCurrent(path);
    let key;
    let factory;
    if (rest.length === 2) {
        [key, factory] = rest;
    }
    else {
        [factory] = rest;
    }
    key ??= createProperty();
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.logic.addPropertyFactory(key, factory);
    return key;
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
 * @experimental 21.0.0
 */
function validateAsync(path, opts) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    const RESOURCE = property(path, (ctx) => {
        const params = computed(() => {
            const node = ctx.stateOf(path);
            const validationState = node.validationState;
            if (validationState.shouldSkipValidation() || !validationState.syncValid()) {
                return undefined;
            }
            return opts.params(ctx);
        }, ...(ngDevMode ? [{ debugName: "params" }] : []));
        return opts.factory(params);
    });
    pathNode.logic.addAsyncErrorRule((ctx) => {
        const res = ctx.state.property(RESOURCE);
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
                const errors = opts.errors(res.value(), ctx);
                return addDefaultField(errors, ctx.field);
            case 'error':
                // TODO: Design error handling for async validation. For now, just throw the error.
                throw res.error();
        }
    });
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
 * @experimental 21.0.0
 */
function validateHttp(path, opts) {
    validateAsync(path, {
        params: opts.request,
        factory: (request) => httpResource(request, opts.options),
        errors: opts.errors,
    });
}

/**
 * A fake version of `NgControl` provided by the `Control` directive. This allows interoperability
 * with a wider range of components designed to work with reactive forms, in particular ones that
 * inject the `NgControl`. The interop control does not implement *all* properties and methods of
 * the real `NgControl`, but does implement some of the most commonly used ones that have a clear
 * equivalent in signal forms.
 */
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
        // This addresses a common case where users look for the presence of `Validators.required` to
        // determine whether or not to show a required "*" indicator in the UI.
        if (validator === Validators.required) {
            return this.field().property(REQUIRED)();
        }
        return false;
    }
    updateValueAndValidity() {
        // No-op since value and validity are always up to date in signal forms.
        // We offer this method so that reactive forms code attempting to call it doesn't error.
    }
}

// TODO: These utilities to be replaced with proper integration into framework.
function privateGetComponentInstance(injector) {
    assertIsNodeInjector(injector);
    if (injector._tNode.directiveStart === 0 || injector._tNode.componentOffset === -1) {
        return undefined;
    }
    return injector._lView[injector._tNode.directiveStart + injector._tNode.componentOffset];
}
function privateSetComponentInput(inputSignal, value) {
    inputSignal[_SIGNAL].applyValueToInputSignal(inputSignal[_SIGNAL], value);
}
function privateIsSignalInput(value) {
    return isInputSignal(value);
}
function privateIsModelInput(value) {
    return isInputSignal(value) && isObject(value) && 'subscribe' in value;
}
function privateRunEffect(ref) {
    ref[_SIGNAL].run();
}
function assertIsNodeInjector(injector) {
    if (!('_tNode' in injector)) {
        throw new Error('Expected a Node Injector');
    }
}
function isInputSignal(value) {
    if (!isObject(value) || !(_SIGNAL in value)) {
        return false;
    }
    const node = value[_SIGNAL];
    return isObject(node) && 'applyValueToInputSignal' in node;
}

/**
 * Binds a form `Field` to a UI control that edits it. A UI control can be one of several things:
 * 1. A native HTML input or textarea
 * 2. A signal forms custom control that implements `FormValueControl` or `FormCheckboxControl`
 * 3. A component that provides a ControlValueAccessor. This should only be used to backwards
 *    compatibility with reactive forms. Prefer options (1) and (2).
 *
 * This directive has several responsibilities:
 * 1. Two-way binds the field's value with the UI control's value
 * 2. Binds additional forms related state on the field to the UI control (disabled, required, etc.)
 * 3. Relays relevant events on the control to the field (e.g. marks field touched on blur)
 * 4. Provides a fake `NgControl` that implements a subset of the features available on the reactive
 *    forms `NgControl`. This is provided to improve interoperability with controls designed to work
 *    with reactive forms. It should not be used by controls written for signal forms.
 *
 * @experimental 21.0.0
 */
class Control {
    /** The injector for this component. */
    injector = inject(Injector);
    renderer = inject(Renderer2);
    /** Whether state synchronization with the field has been setup yet. */
    initialized = false;
    /** The field that is bound to this control. */
    field = signal(undefined, ...(ngDevMode ? [{ debugName: "field" }] : []));
    // If `[control]` is applied to a custom UI control, it wants to synchronize state in the field w/
    // the inputs of that custom control. This is difficult to do in user-land. We use `effect`, but
    // effects don't run before the lifecycle hooks of the component. This is usually okay, but has
    // one significant issue: the UI control's required inputs won't be set in time for those
    // lifecycle hooks to run.
    //
    // Eventually we can build custom functionality for the `Control` directive into the framework,
    // but for now we work around this limitation with a hack. We use an `@Input` instead of a
    // signal-based `input()` for the `[control]` to hook the exact moment inputs are being set,
    // before the important lifecycle hooks of the UI control. We can then initialize all our effects
    // and force them to run immediately, ensuring all required inputs have values.
    set _field(value) {
        this.field.set(value);
        if (!this.initialized) {
            this.initialize();
        }
    }
    /** The field state of the bound field. */
    state = computed(() => this.field()(), ...(ngDevMode ? [{ debugName: "state" }] : []));
    /** The HTMLElement this directive is attached to. */
    el = inject(ElementRef);
    /** The NG_VALUE_ACCESSOR array for the host component. */
    cvaArray = inject(NG_VALUE_ACCESSOR, { optional: true });
    /** The Cached value for the lazily created interop NgControl. */
    _ngControl;
    /** A fake NgControl provided for better interop with reactive forms. */
    get ngControl() {
        return (this._ngControl ??= new InteropNgControl(() => this.state()));
    }
    /** The ControlValueAccessor for the host component. */
    get cva() {
        return this.cvaArray?.[0] ?? this._ngControl?.valueAccessor ?? undefined;
    }
    /** Initializes state synchronization between the field and the host UI control. */
    initialize() {
        this.initialized = true;
        const injector = this.injector;
        const cmp = privateGetComponentInstance(injector);
        // If component has a `control` input, we assume that it will handle binding the field to the
        // appropriate native/custom control in its template, so we do not attempt to bind any inputs on
        // this component.
        if (cmp && isShadowedControlComponent(cmp)) {
            return;
        }
        if (cmp && isFormUiControl(cmp)) {
            // If we're binding to a component that follows the standard form ui control contract,
            // set up state synchronization based on the contract.
            this.setupCustomUiControl(cmp);
        }
        else if (this.cva !== undefined) {
            // If we're binding to a component that doesn't follow the standard contract, but provides a
            // control value accessor, set up state synchronization based on th CVA.
            this.setupControlValueAccessor(this.cva);
        }
        else if (this.el.nativeElement instanceof HTMLInputElement ||
            this.el.nativeElement instanceof HTMLTextAreaElement ||
            this.el.nativeElement instanceof HTMLSelectElement) {
            // If we're binding to a native html input, set up state synchronization with its native
            // properties / attributes.
            this.setupNativeInput(this.el.nativeElement);
        }
        else {
            throw new Error(`Unhandled control?`);
        }
        // Register this control on the field it is currently bound to. We do this at the end of
        // initialization so that it only runs if we are actually syncing with this control
        // (as opposed to just passing the field through to its `control` input).
        effect((onCleanup) => {
            const fieldNode = this.state();
            fieldNode.nodeState.controls.update((controls) => [...controls, this]);
            onCleanup(() => {
                fieldNode.nodeState.controls.update((controls) => controls.filter((c) => c !== this));
            });
        }, { injector: this.injector });
    }
    /**
     * Set up state synchronization between the field and a native <input>, <textarea>, or <select>.
     */
    setupNativeInput(input) {
        const inputType = input instanceof HTMLTextAreaElement
            ? 'text'
            : input instanceof HTMLSelectElement
                ? 'select'
                : input.type;
        input.addEventListener('input', () => {
            switch (inputType) {
                case 'checkbox':
                    this.state().value.set(input.checked);
                    break;
                case 'radio':
                    // The `input` event only fires when a radio button becomes selected, so write its `value`
                    // into the state.
                    this.state().value.set(input.value);
                    break;
                case 'number':
                case 'range':
                case 'datetime-local':
                    // We can read a `number` or a `string` from this input type.
                    // Prefer whichever is consistent with the current type.
                    if (typeof this.state().value() === 'number') {
                        this.state().value.set(input.valueAsNumber);
                    }
                    else {
                        this.state().value.set(input.value);
                    }
                    break;
                case 'date':
                case 'month':
                case 'week':
                case 'time':
                    // We can read a `Date | null` or a `number` or a `string` from this input type.
                    // Prefer whichever is consistent with the current type.
                    if (isDateOrNull(this.state().value())) {
                        this.state().value.set(input.valueAsDate);
                    }
                    else if (typeof this.state().value() === 'number') {
                        this.state().value.set(input.valueAsNumber);
                    }
                    else {
                        this.state().value.set(input.value);
                    }
                    break;
                default:
                    this.state().value.set(input.value);
                    break;
            }
            this.state().markAsDirty();
        });
        input.addEventListener('blur', () => this.state().markAsTouched());
        this.maybeSynchronize(() => this.state().readonly(), this.withBooleanAttribute(input, 'readonly'));
        // TODO: consider making a global configuration option for using aria-disabled instead.
        this.maybeSynchronize(() => this.state().disabled(), this.withBooleanAttribute(input, 'disabled'));
        this.maybeSynchronize(() => this.state().name(), this.withAttribute(input, 'name'));
        this.maybeSynchronize(this.propertySource(REQUIRED), this.withBooleanAttribute(input, 'required'));
        this.maybeSynchronize(this.propertySource(MIN), this.withAttribute(input, 'min'));
        this.maybeSynchronize(this.propertySource(MIN_LENGTH), this.withAttribute(input, 'minLength'));
        this.maybeSynchronize(this.propertySource(MAX), this.withAttribute(input, 'max'));
        this.maybeSynchronize(this.propertySource(MAX_LENGTH), this.withAttribute(input, 'maxLength'));
        switch (inputType) {
            case 'checkbox':
                this.maybeSynchronize(() => this.state().value(), (value) => (input.checked = value));
                break;
            case 'radio':
                this.maybeSynchronize(() => this.state().value(), (value) => {
                    // Although HTML behavior is to clear the input already, we do this just in case.
                    // It seems like it might be necessary in certain environments (e.g. Domino).
                    input.checked = input.value === value;
                });
                break;
            case 'select':
                this.maybeSynchronize(() => this.state().value(), (value) => {
                    // A select will not take a value unil the value's option has rendered.
                    afterNextRender(() => (input.value = value), { injector: this.injector });
                });
                break;
            case 'number':
            case 'range':
            case 'datetime-local':
                // This input type can receive a `number` or a `string`.
                this.maybeSynchronize(() => this.state().value(), (value) => {
                    if (typeof value === 'number') {
                        input.valueAsNumber = value;
                    }
                    else {
                        input.value = value;
                    }
                });
                break;
            case 'date':
            case 'month':
            case 'week':
            case 'time':
                // This input type can receive a `Date | null` or a `number` or a `string`.
                this.maybeSynchronize(() => this.state().value(), (value) => {
                    if (isDateOrNull(value)) {
                        input.valueAsDate = value;
                    }
                    else if (typeof value === 'number') {
                        input.valueAsNumber = value;
                    }
                    else {
                        input.value = value;
                    }
                });
                break;
            default:
                this.maybeSynchronize(() => this.state().value(), (value) => {
                    input.value = value;
                });
                break;
        }
    }
    /** Set up state synchronization between the field and a ControlValueAccessor. */
    setupControlValueAccessor(cva) {
        cva.registerOnChange((value) => this.state().value.set(value));
        cva.registerOnTouched(() => this.state().markAsTouched());
        this.maybeSynchronize(() => this.state().value(), (value) => cva.writeValue(value));
        if (cva.setDisabledState) {
            this.maybeSynchronize(() => this.state().disabled(), (value) => cva.setDisabledState(value));
        }
        cva.writeValue(this.state().value());
        cva.setDisabledState?.(this.state().disabled());
    }
    /** Set up state synchronization between the field and a FormUiControl. */
    setupCustomUiControl(cmp) {
        // Handle the property side of the model binding. How we do this depends on the shape of the
        // component. There are 2 options:
        // * it provides a `value` model (most controls that edit a single value)
        // * it provides a `checked` model with no `value` signal (custom checkbox)
        let cleanupValue;
        if (isFormValueControl(cmp)) {
            // <custom-input [(value)]="state().value">
            this.maybeSynchronize(() => this.state().value(), withInput(cmp.value));
            cleanupValue = cmp.value.subscribe((newValue) => this.state().value.set(newValue));
        }
        else if (isFormCheckboxControl(cmp)) {
            // <custom-checkbox [(checked)]="state().value" />
            this.maybeSynchronize(() => this.state().value(), withInput(cmp.checked));
            cleanupValue = cmp.checked.subscribe((newValue) => this.state().value.set(newValue));
        }
        else {
            throw new Error(`Unknown custom control subtype`);
        }
        this.maybeSynchronize(() => this.state().name(), withInput(cmp.name));
        this.maybeSynchronize(() => this.state().disabled(), withInput(cmp.disabled));
        this.maybeSynchronize(() => this.state().disabledReasons(), withInput(cmp.disabledReasons));
        this.maybeSynchronize(() => this.state().readonly(), withInput(cmp.readonly));
        this.maybeSynchronize(() => this.state().hidden(), withInput(cmp.hidden));
        this.maybeSynchronize(() => this.state().errors(), withInput(cmp.errors));
        if (privateIsModelInput(cmp.touched) || privateIsSignalInput(cmp.touched)) {
            this.maybeSynchronize(() => this.state().touched(), withInput(cmp.touched));
        }
        this.maybeSynchronize(() => this.state().dirty(), withInput(cmp.dirty));
        this.maybeSynchronize(() => this.state().invalid(), withInput(cmp.invalid));
        this.maybeSynchronize(() => this.state().pending(), withInput(cmp.pending));
        this.maybeSynchronize(this.propertySource(REQUIRED), withInput(cmp.required));
        this.maybeSynchronize(this.propertySource(MIN), withInput(cmp.min));
        this.maybeSynchronize(this.propertySource(MIN_LENGTH), withInput(cmp.minLength));
        this.maybeSynchronize(this.propertySource(MAX), withInput(cmp.max));
        this.maybeSynchronize(this.propertySource(MAX_LENGTH), withInput(cmp.maxLength));
        this.maybeSynchronize(this.propertySource(PATTERN), withInput(cmp.pattern));
        let cleanupTouch;
        let cleanupDefaultTouch;
        if (privateIsModelInput(cmp.touched) || isOutputRef(cmp.touched)) {
            cleanupTouch = cmp.touched.subscribe(() => this.state().markAsTouched());
        }
        else {
            // If the component did not give us a touch event stream, use the standard touch logic,
            // marking it touched when the focus moves from inside the host element to outside.
            const listener = (event) => {
                const newActiveEl = event.relatedTarget;
                if (!this.el.nativeElement.contains(newActiveEl)) {
                    this.state().markAsTouched();
                }
            };
            this.el.nativeElement.addEventListener('focusout', listener);
            cleanupDefaultTouch = () => this.el.nativeElement.removeEventListener('focusout', listener);
        }
        // Cleanup for output binding subscriptions:
        this.injector.get(DestroyRef).onDestroy(() => {
            cleanupValue?.unsubscribe();
            cleanupTouch?.unsubscribe();
            cleanupDefaultTouch?.();
        });
    }
    /** Synchronize a value from a reactive source to a given sink. */
    maybeSynchronize(source, sink) {
        if (!sink) {
            return undefined;
        }
        const ref = effect(() => {
            const value = source();
            untracked(() => sink(value));
        }, ...(ngDevMode ? [{ debugName: "ref", injector: this.injector }] : [{ injector: this.injector }]));
        // Run the effect immediately to ensure sinks which are required inputs are set before they can
        // be observed. See the note on `_field` for more details.
        privateRunEffect(ref);
    }
    /** Creates a reactive value source by reading the given AggregateProperty from the field. */
    propertySource(key) {
        const metaSource = computed(() => this.state().hasProperty(key) ? this.state().property(key) : key.getInitial, ...(ngDevMode ? [{ debugName: "metaSource" }] : []));
        return () => metaSource()?.();
    }
    /** Creates a (non-boolean) value sync that writes the given attribute of the given element. */
    withAttribute(element, attribute) {
        return (value) => {
            if (value !== undefined) {
                this.renderer.setAttribute(element, attribute, value.toString());
            }
            else {
                this.renderer.removeAttribute(element, attribute);
            }
        };
    }
    /** Creates a boolean value sync that writes the given attribute of the given element. */
    withBooleanAttribute(element, attribute) {
        return (value) => {
            if (value) {
                this.renderer.setAttribute(element, attribute, '');
            }
            else {
                this.renderer.removeAttribute(element, attribute);
            }
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.0-next.3+sha-e523384", ngImport: i0, type: Control, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.0-next.3+sha-e523384", type: Control, isStandalone: true, selector: "[control]", inputs: { _field: ["control", "_field"] }, providers: [
            {
                provide: NgControl,
                useFactory: () => inject(Control).ngControl,
            },
        ], ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.0-next.3+sha-e523384", ngImport: i0, type: Control, decorators: [{
            type: Directive,
            args: [{
                    selector: '[control]',
                    providers: [
                        {
                            provide: NgControl,
                            useFactory: () => inject(Control).ngControl,
                        },
                    ],
                }]
        }], propDecorators: { _field: [{
                type: Input,
                args: [{ required: true, alias: 'control' }]
            }] } });
/** Creates a value sync from an input signal. */
function withInput(input) {
    return input ? (value) => privateSetComponentInput(input, value) : undefined;
}
/**
 * Checks whether the given component matches the contract for either FormValueControl or
 * FormCheckboxControl.
 */
function isFormUiControl(cmp) {
    const castCmp = cmp;
    return ((isFormValueControl(castCmp) || isFormCheckboxControl(castCmp)) &&
        (castCmp.readonly === undefined || privateIsSignalInput(castCmp.readonly)) &&
        (castCmp.disabled === undefined || privateIsSignalInput(castCmp.disabled)) &&
        (castCmp.disabledReasons === undefined || privateIsSignalInput(castCmp.disabledReasons)) &&
        (castCmp.errors === undefined || privateIsSignalInput(castCmp.errors)) &&
        (castCmp.invalid === undefined || privateIsSignalInput(castCmp.invalid)) &&
        (castCmp.pending === undefined || privateIsSignalInput(castCmp.pending)) &&
        (castCmp.touched === undefined ||
            privateIsModelInput(castCmp.touched) ||
            privateIsSignalInput(castCmp.touched) ||
            isOutputRef(castCmp.touched)) &&
        (castCmp.dirty === undefined || privateIsSignalInput(castCmp.dirty)) &&
        (castCmp.min === undefined || privateIsSignalInput(castCmp.min)) &&
        (castCmp.minLength === undefined || privateIsSignalInput(castCmp.minLength)) &&
        (castCmp.max === undefined || privateIsSignalInput(castCmp.max)) &&
        (castCmp.maxLength === undefined || privateIsSignalInput(castCmp.maxLength)));
}
/** Checks whether the given FormUiControl is a FormValueControl. */
function isFormValueControl(cmp) {
    return privateIsModelInput(cmp.value);
}
/** Checks whether the given FormUiControl is a FormCheckboxControl. */
function isFormCheckboxControl(cmp) {
    return (privateIsModelInput(cmp.checked) &&
        cmp.value === undefined);
}
/** Checks whether the given component has an input called `control`. */
function isShadowedControlComponent(cmp) {
    const mirror = reflectComponentType(cmp.constructor);
    return mirror?.inputs.some((input) => input.templateName === 'control') ?? false;
}
/** Checks whether the given object is an output ref. */
function isOutputRef(value) {
    return value instanceof OutputEmitterRef || value instanceof EventEmitter;
}
/** Checks if a given value is a Date or null */
function isDateOrNull(value) {
    return value === null || value instanceof Date;
}

/**
 * `FieldContext` implementation, backed by a `FieldNode`.
 */
class FieldNodeContext {
    node;
    /**
     * Cache of paths that have been resolved for this context.
     *
     * For each resolved path we keep track of a signal of field that it maps to rather than a static
     * field, since it theoretically could change. In practice for the current system it should not
     * actually change, as they only place we currently track fields moving within the parent
     * structure is for arrays, and paths do not currently support array indexing.
     */
    cache = new WeakMap();
    constructor(
    /** The field node this context corresponds to. */
    node) {
        this.node = node;
    }
    /**
     * Resolves a target path relative to this context.
     * @param target The path to resolve
     * @returns The field corresponding to the target path.
     */
    resolve(target) {
        if (!this.cache.has(target)) {
            const resolver = computed(() => {
                const targetPathNode = FieldPathNode.unwrapFieldPath(target);
                // First, find the field where the root our target path was merged in.
                // We determine this by walking up the field tree from the current field and looking for
                // the place where the LogicNodeBuilder from the target path's root was merged in.
                // We always make sure to walk up at least as far as the depth of the path we were bound to.
                // This ensures that we do not accidentally match on the wrong application of a recursively
                // applied schema.
                let field = this.node;
                let stepsRemaining = getBoundPathDepth();
                while (stepsRemaining > 0 || !field.structure.logic.hasLogic(targetPathNode.root.logic)) {
                    stepsRemaining--;
                    field = field.structure.parent;
                    if (field === undefined) {
                        throw new Error('Path is not part of this field tree.');
                    }
                }
                // Now, we can navigate to the target field using the relative path in the target path node
                // to traverse down from the field we just found.
                for (let key of targetPathNode.keys) {
                    field = field.structure.getChild(key);
                    if (field === undefined) {
                        throw new Error(`Cannot resolve path .${targetPathNode.keys.join('.')} relative to field ${[
                            '<root>',
                            ...this.node.structure.pathKeys(),
                        ].join('.')}.`);
                    }
                }
                return field.fieldProxy;
            }, ...(ngDevMode ? [{ debugName: "resolver" }] : []));
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
        // Attempt to read the key first, this will throw an error if we're on a root field.
        const key = this.key();
        // Assert that the parent is actually an array.
        if (!isArray(untracked(this.node.structure.parent.value))) {
            throw new Error(`RuntimeError: cannot access index, parent field is not an array`);
        }
        // Return the key as a number if we are indeed inside an array field.
        return Number(key);
    }, ...(ngDevMode ? [{ debugName: "index" }] : []));
    fieldOf = (p) => this.resolve(p);
    stateOf = (p) => this.resolve(p)();
    valueOf = (p) => this.resolve(p)().value();
}

/**
 * Tracks custom properties associated with a `FieldNode`.
 */
class FieldPropertyState {
    node;
    /** A map of all `Property` and `AggregateProperty` that have been defined for this field. */
    properties = new Map();
    constructor(node) {
        this.node = node;
        // Field nodes (and thus their property state) are created in a linkedSignal in order to mirror
        // the structure of the model data. We need to run the property factories untracked so that they
        // do not cause recomputation of the linkedSignal.
        untracked(() => 
        // Property factories are run in the form's injection context so they can create resources
        // and inject DI dependencies.
        runInInjectionContext(this.node.structure.injector, () => {
            for (const [key, factory] of this.node.logicNode.logic.getPropertyFactoryEntries()) {
                this.properties.set(key, factory(this.node.context));
            }
        }));
    }
    /** Gets the value of a `Property` or `AggregateProperty` for the field. */
    get(prop) {
        if (prop instanceof Property) {
            return this.properties.get(prop);
        }
        if (!this.properties.has(prop)) {
            const logic = this.node.logicNode.logic.getAggregateProperty(prop);
            const result = computed(() => logic.compute(this.node.context), ...(ngDevMode ? [{ debugName: "result" }] : []));
            this.properties.set(prop, result);
        }
        return this.properties.get(prop);
    }
    /**
     * Checks whether the current property state has the given property.
     * @param prop
     * @returns
     */
    has(prop) {
        if (prop instanceof AggregateProperty) {
            // For aggregate properties, they get added to the map lazily, on first access, so we can't
            // rely on checking presence in the properties map. Instead we check if there is any logic for
            // the given property.
            return this.node.logicNode.logic.hasAggregateProperty(prop);
        }
        else {
            // Non-aggregate proeprties get added to our properties map on construction, so we can just
            // refer to their presence in the map.
            return this.properties.has(prop);
        }
    }
}

/**
 * Proxy handler which implements `Field<T>` on top of `FieldNode`.
 */
const FIELD_PROXY_HANDLER = {
    get(getTgt, p) {
        const tgt = getTgt();
        // First, check whether the requested property is a defined child node of this node.
        const child = tgt.structure.getChild(p);
        if (child !== undefined) {
            // If so, return the child node's `Field` proxy, allowing the developer to continue navigating
            // the form structure.
            return child.fieldProxy;
        }
        // Otherwise, we need to consider whether the properties they're accessing are related to array
        // iteration. We're specifically interested in `length`, but we only want to pass this through
        // if the value is actually an array.
        //
        // We untrack the value here to avoid spurious reactive notifications. In reality, we've already
        // incurred a dependency on the value via `tgt.getChild()` above.
        const value = untracked(tgt.value);
        if (isArray(value)) {
            // Allow access to the length for field arrays, it should be the same as the length of the data.
            if (p === 'length') {
                return tgt.value().length;
            }
            // Allow access to the iterator. This allows the user to spread the field array into a
            // standard array in order to call methods like `filter`, `map`, etc.
            if (p === Symbol.iterator) {
                return Array.prototype[p];
            }
            // Note: We can consider supporting additional array methods if we want in the future,
            // but they should be thoroughly tested. Just forwarding the method directly from the
            // `Array` prototype results in broken behavior for some methods like `map`.
        }
        // Otherwise, this property doesn't exist.
        return undefined;
    },
};

/**
 * Creates a writable signal for a specific property on a source writeable signal.
 * @param source A writeable signal to derive from
 * @param prop A signal of a property key of the source value
 * @returns A writeable signal for the given property of the source value.
 * @template S The source value type
 * @template K The key type for S
 */
function deepSignal(source, prop) {
    // Memoize the property.
    const read = computed(() => source()[prop()]);
    read[SIGNAL] = source[SIGNAL];
    read.set = (value) => {
        source.update((current) => valueForWrite(current, value, prop()));
    };
    read.update = (fn) => {
        read.set(fn(untracked(read)));
    };
    read.asReadonly = () => read;
    return read;
}
/**
 * Gets an updated root value to use when setting a value on a deepSignal with the given path.
 * @param sourceValue The current value of the deepSignal's source.
 * @param newPropValue The value being written to the deepSignal's property
 * @param prop The deepSignal's property key
 * @returns An updated value for the deepSignal's source
 */
function valueForWrite(sourceValue, newPropValue, prop) {
    if (isArray(sourceValue)) {
        const newValue = [...sourceValue];
        newValue[prop] = newPropValue;
        return newValue;
    }
    else {
        return { ...sourceValue, [prop]: newPropValue };
    }
}

/** Structural component of a `FieldNode` which tracks its path, parent, and children. */
class FieldNodeStructure {
    logic;
    /** Added to array elements for tracking purposes. */
    // TODO: given that we don't ever let a field move between parents, is it safe to just extract
    // this to a shared symbol for all fields, rather than having a separate one per parent?
    identitySymbol = Symbol();
    /** Lazily initialized injector. Do not access directly, access via `injector` getter instead. */
    _injector = undefined;
    /** Lazily initialized injector. */
    get injector() {
        this._injector ??= Injector.create({
            providers: [],
            parent: this.fieldManager.injector,
        });
        return this._injector;
    }
    constructor(
    /** The logic to apply to this field. */
    logic) {
        this.logic = logic;
    }
    /** Gets the child fields of this field. */
    children() {
        return this.childrenMap()?.values() ?? [];
    }
    /** Retrieve a child `FieldNode` of this node by property key. */
    getChild(key) {
        const map = this.childrenMap();
        const value = this.value();
        if (!map || !isObject(value)) {
            return undefined;
        }
        if (isArray(value)) {
            const childValue = value[key];
            if (isObject(childValue) && childValue.hasOwnProperty(this.identitySymbol)) {
                // For arrays, we want to use the tracking identity of the value instead of the raw property
                // as our index into the `childrenMap`.
                key = childValue[this.identitySymbol];
            }
        }
        return map.get((typeof key === 'number' ? key.toString() : key));
    }
    /** Destroys the field when it is no longer needed. */
    destroy() {
        this.injector.destroy();
    }
}
/** The structural component of a `FieldNode` that is the root of its field tree. */
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
    node, pathNode, logic, fieldManager, value, adapter, createChildNode) {
        super(logic);
        this.node = node;
        this.fieldManager = fieldManager;
        this.value = value;
        this.childrenMap = makeChildrenMapSignal(node, value, this.identitySymbol, pathNode, logic, adapter, createChildNode);
    }
}
/** The structural component of a child `FieldNode` within a field tree. */
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
    constructor(node, pathNode, logic, parent, identityInParent, initialKeyInParent, adapter, createChildNode) {
        super(logic);
        this.parent = parent;
        this.root = this.parent.structure.root;
        this.pathKeys = computed(() => [...parent.structure.pathKeys(), this.keyInParent()], ...(ngDevMode ? [{ debugName: "pathKeys" }] : []));
        if (identityInParent === undefined) {
            const key = initialKeyInParent;
            this.keyInParent = computed(() => {
                if (parent.structure.childrenMap()?.get(key) !== node) {
                    throw new Error(`RuntimeError: orphan field, looking for property '${key}' of ${getDebugName(parent)}`);
                }
                return key;
            }, ...(ngDevMode ? [{ debugName: "keyInParent" }] : []));
        }
        else {
            let lastKnownKey = initialKeyInParent;
            this.keyInParent = computed(() => {
                // TODO(alxhub): future perf optimization: here we depend on the parent's value, but most
                // changes to the value aren't structural - they aren't moving around objects and thus
                // shouldn't affect `keyInParent`. We currently mitigate this issue via `lastKnownKey`
                // which avoids a search.
                const parentValue = parent.structure.value();
                if (!isArray(parentValue)) {
                    // It should not be possible to encounter this error. It would require the parent to
                    // change from an array field to non-array field. However, in the current implementation
                    // a field's parent can never change.
                    throw new Error(`RuntimeError: orphan field, expected ${getDebugName(parent)} to be an array`);
                }
                // Check the parent value at the last known key to avoid a scan.
                // Note: lastKnownKey is a string, but we pretend to typescript like its a number,
                // since accessing someArray['1'] is the same as accessing someArray[1]
                const data = parentValue[lastKnownKey];
                if (isObject(data) &&
                    data.hasOwnProperty(parent.structure.identitySymbol) &&
                    data[parent.structure.identitySymbol] === identityInParent) {
                    return lastKnownKey;
                }
                // Otherwise, we need to check all the keys in the parent.
                for (let i = 0; i < parentValue.length; i++) {
                    const data = parentValue[i];
                    if (isObject(data) &&
                        data.hasOwnProperty(parent.structure.identitySymbol) &&
                        data[parent.structure.identitySymbol] === identityInParent) {
                        return (lastKnownKey = i.toString());
                    }
                }
                throw new Error(`RuntimeError: orphan field, can't find element in array ${getDebugName(parent)}`);
            }, ...(ngDevMode ? [{ debugName: "keyInParent" }] : []));
        }
        this.value = deepSignal(this.parent.structure.value, this.keyInParent);
        this.childrenMap = makeChildrenMapSignal(node, this.value, this.identitySymbol, pathNode, logic, adapter, createChildNode);
        this.fieldManager.structures.add(this);
    }
}
/** Global id used for tracking keys. */
let globalId = 0;
/** A signal representing an empty list of path keys, used for root fields. */
const ROOT_PATH_KEYS = computed(() => [], ...(ngDevMode ? [{ debugName: "ROOT_PATH_KEYS" }] : []));
/**
 * A signal representing a non-existent key of the field in its parent, used for root fields which
 * do not have a parent. This signal will throw if it is read.
 */
const ROOT_KEY_IN_PARENT = computed(() => {
    throw new Error(`RuntimeError: the top-level field in the form has no parent`);
}, ...(ngDevMode ? [{ debugName: "ROOT_KEY_IN_PARENT" }] : []));
/**
 * Creates a linked signal map of all child fields for a field.
 *
 * @param node The field to create the children map signal for.
 * @param valueSignal The value signal for the field.
 * @param identitySymbol The key used to access the tracking id of a field.
 * @param pathNode The path node corresponding to the field in the schema.
 * @param logic The logic to apply to the field.
 * @param adapter Adapter that knows how to create new fields and appropriate state.
 * @param createChildNode A factory function to create child nodes for this field.
 * @returns
 */
function makeChildrenMapSignal(node, valueSignal, identitySymbol, pathNode, logic, adapter, createChildNode) {
    // We use a `linkedSignal` to preserve the instances of `FieldNode` for each child field even if
    // the value of this field changes its object identity. The computation creates or updates the map
    // of child `FieldNode`s for `node` based on its current value.
    return linkedSignal({
        source: valueSignal,
        computation: (value, previous) => {
            // We may or may not have a previous map. If there isn't one, then `childrenMap` will be lazily
            // initialized to a new map instance if needed.
            let childrenMap = previous?.value;
            if (!isObject(value)) {
                // Non-object values have no children.
                return undefined;
            }
            const isValueArray = isArray(value);
            // Remove fields that have disappeared since the last time this map was computed.
            if (childrenMap !== undefined) {
                let oldKeys = undefined;
                if (isValueArray) {
                    oldKeys = new Set(childrenMap.keys());
                    for (let i = 0; i < value.length; i++) {
                        const childValue = value[i];
                        if (isObject(childValue) && childValue.hasOwnProperty(identitySymbol)) {
                            oldKeys.delete(childValue[identitySymbol]);
                        }
                        else {
                            oldKeys.delete(i.toString());
                        }
                    }
                    for (const key of oldKeys) {
                        childrenMap.delete(key);
                    }
                }
                else {
                    for (let key of childrenMap.keys()) {
                        if (!value.hasOwnProperty(key)) {
                            childrenMap.delete(key);
                        }
                    }
                }
            }
            // Add fields that exist in the value but don't yet have instances in the map.
            for (let key of Object.keys(value)) {
                let trackingId = undefined;
                const childValue = value[key];
                // Fields explicitly set to `undefined` are treated as if they don't exist.
                // This ensures that `{value: undefined}` and `{}` have the same behavior for their `value`
                // field.
                if (childValue === undefined) {
                    // The value might have _become_ `undefined`, so we need to delete it here.
                    childrenMap?.delete(key);
                    continue;
                }
                if (isValueArray && isObject(childValue)) {
                    // For object values in arrays, assign a synthetic identity instead.
                    trackingId = childValue[identitySymbol] ??= Symbol(ngDevMode ? `id:${globalId++}` : '');
                }
                const identity = trackingId ?? key;
                if (childrenMap?.has(identity)) {
                    continue;
                }
                // Determine the logic for the field that we're defining.
                let childPath;
                let childLogic;
                if (isValueArray) {
                    // Fields for array elements have their logic defined by the `element` mechanism.
                    // TODO: other dynamic data
                    childPath = pathNode.getChild(DYNAMIC);
                    childLogic = logic.getChild(DYNAMIC);
                }
                else {
                    // Fields for plain properties exist in our logic node's child map.
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
                    fieldAdapter: adapter,
                }));
            }
            return childrenMap;
        },
        equal: () => false,
    });
}
/** Gets a human readable name for a field node for use in error messages. */
function getDebugName(node) {
    return `<root>.${node.structure.pathKeys().join('.')}`;
}

/**
 * State of a `FieldNode` that's associated with form submission.
 */
class FieldSubmitState {
    node;
    /**
     * Whether this field was directly submitted (as opposed to indirectly by a parent field being submitted)
     * and is still in the process of submitting.
     */
    selfSubmitting = signal(false, ...(ngDevMode ? [{ debugName: "selfSubmitting" }] : []));
    /** Server errors that are associated with this field. */
    serverErrors;
    constructor(node) {
        this.node = node;
        this.serverErrors = linkedSignal({
            source: this.node.structure.value,
            computation: () => [],
        });
    }
    /**
     * Whether this form is currently in the process of being submitted.
     * Either because the field was submitted directly, or because a parent field was submitted.
     */
    submitting = computed(() => {
        return this.selfSubmitting() || (this.node.structure.parent?.submitting() ?? false);
    }, ...(ngDevMode ? [{ debugName: "submitting" }] : []));
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
class FieldNode {
    structure;
    validationState;
    propertyState;
    nodeState;
    submitState;
    _context = undefined;
    fieldAdapter;
    get context() {
        return (this._context ??= new FieldNodeContext(this));
    }
    /**
     * Proxy to this node which allows navigation of the form graph below it.
     */
    fieldProxy = new Proxy(() => this, FIELD_PROXY_HANDLER);
    constructor(options) {
        this.fieldAdapter = options.fieldAdapter;
        this.structure = this.fieldAdapter.createStructure(this, options);
        this.validationState = this.fieldAdapter.createValidationState(this, options);
        this.nodeState = this.fieldAdapter.createNodeState(this, options);
        this.propertyState = new FieldPropertyState(this);
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
    get controls() {
        return this.nodeState.controls;
    }
    get submitting() {
        return this.submitState.submitting;
    }
    get name() {
        return this.nodeState.name;
    }
    property(prop) {
        return this.propertyState.get(prop);
    }
    hasProperty(prop) {
        return this.propertyState.has(prop);
    }
    /**
     * Marks this specific field as touched.
     */
    markAsTouched() {
        this.nodeState.markAsTouched();
    }
    /**
     * Marks this specific field as dirty.
     */
    markAsDirty() {
        this.nodeState.markAsDirty();
    }
    /**
     * Resets the {@link touched} and {@link dirty} state of the field and its descendants.
     *
     * Note this does not change the data model, which can be reset directly if desired.
     */
    reset() {
        this.nodeState.markAsUntouched();
        this.nodeState.markAsPristine();
        for (const child of this.structure.children()) {
            child.reset();
        }
    }
    /**
     * Creates a new root field node for a new form.
     */
    static newRoot(fieldManager, value, pathNode, adapter) {
        return adapter.newRoot(fieldManager, value, pathNode, adapter);
    }
    /**
     * Creates a child field node based on the given options.
     */
    static newChild(options) {
        return options.fieldAdapter.newChild(options);
    }
    createStructure(options) {
        return options.kind === 'root'
            ? new RootFieldNodeStructure(this, options.pathNode, options.logic, options.fieldManager, options.value, options.fieldAdapter, FieldNode.newChild)
            : new ChildFieldNodeStructure(this, options.pathNode, options.logic, options.parent, options.identityInParent, options.initialKeyInParent, options.fieldAdapter, FieldNode.newChild);
    }
}

/**
 * The non-validation and non-submit state associated with a `FieldNode`, such as touched and dirty
 * status, as well as derived logical state.
 */
class FieldNodeState {
    node;
    /**
     * Indicates whether this field has been touched directly by the user (as opposed to indirectly by
     * touching a child field).
     *
     * A field is considered directly touched when a user stops editing it for the first time (i.e. on blur)
     */
    selfTouched = signal(false, ...(ngDevMode ? [{ debugName: "selfTouched" }] : []));
    /**
     * Indicates whether this field has been dirtied directly by the user (as opposed to indirectly by
     * dirtying a child field).
     *
     * A field is considered directly dirtied if a user changed the value of the field at least once.
     */
    selfDirty = signal(false, ...(ngDevMode ? [{ debugName: "selfDirty" }] : []));
    /**
     * Marks this specific field as touched.
     */
    markAsTouched() {
        this.selfTouched.set(true);
    }
    /**
     * Marks this specific field as dirty.
     */
    markAsDirty() {
        this.selfDirty.set(true);
    }
    /**
     * Marks this specific field as not dirty.
     */
    markAsPristine() {
        this.selfDirty.set(false);
    }
    /**
     * Marks this specific field as not touched.
     */
    markAsUntouched() {
        this.selfTouched.set(false);
    }
    /** The UI controls the field is currently bound to. */
    controls = signal([], ...(ngDevMode ? [{ debugName: "controls" }] : []));
    constructor(node) {
        this.node = node;
    }
    /**
     * Whether this field is considered dirty.
     *
     * A field is considered dirty if one of the following is true:
     *  - It was directly dirtied and is interactive
     *  - One of its children is considered dirty
     */
    dirty = computed(() => {
        const selfDirtyValue = this.selfDirty() && !this.isNonInteractive();
        return reduceChildren(this.node, selfDirtyValue, (child, value) => value || child.nodeState.dirty(), shortCircuitTrue);
    }, ...(ngDevMode ? [{ debugName: "dirty" }] : []));
    /**
     * Whether this field is considered touched.
     *
     * A field is considered touched if one of the following is true:
     *  - It was directly touched and is interactive
     *  - One of its children is considered touched
     */
    touched = computed(() => {
        const selfTouchedValue = this.selfTouched() && !this.isNonInteractive();
        return reduceChildren(this.node, selfTouchedValue, (child, value) => value || child.nodeState.touched(), shortCircuitTrue);
    }, ...(ngDevMode ? [{ debugName: "touched" }] : []));
    /**
     * The reasons for this field's disablement. This includes disabled reasons for any parent field
     * that may have been disabled, indirectly causing this field to be disabled as well.
     * The `field` property of the `DisabledReason` can be used to determine which field ultimately
     * caused the disablement.
     */
    disabledReasons = computed(() => [
        ...(this.node.structure.parent?.nodeState.disabledReasons() ?? []),
        ...this.node.logicNode.logic.disabledReasons.compute(this.node.context),
    ], ...(ngDevMode ? [{ debugName: "disabledReasons" }] : []));
    /**
     * Whether this field is considered disabled.
     *
     * A field is considered disabled if one of the following is true:
     * - The schema contains logic that directly disabled it
     * - Its parent field is considered disabled
     */
    disabled = computed(() => !!this.disabledReasons().length, ...(ngDevMode ? [{ debugName: "disabled" }] : []));
    /**
     * Whether this field is considered readonly.
     *
     * A field is considered readonly if one of the following is true:
     * - The schema contains logic that directly made it readonly
     * - Its parent field is considered readonly
     */
    readonly = computed(() => (this.node.structure.parent?.nodeState.readonly() ||
        this.node.logicNode.logic.readonly.compute(this.node.context)) ??
        false, ...(ngDevMode ? [{ debugName: "readonly" }] : []));
    /**
     * Whether this field is considered hidden.
     *
     * A field is considered hidden if one of the following is true:
     * - The schema contains logic that directly hides it
     * - Its parent field is considered hidden
     */
    hidden = computed(() => (this.node.structure.parent?.nodeState.hidden() ||
        this.node.logicNode.logic.hidden.compute(this.node.context)) ??
        false, ...(ngDevMode ? [{ debugName: "hidden" }] : []));
    name = computed(() => {
        const parent = this.node.structure.parent;
        if (!parent) {
            return this.node.structure.fieldManager.rootName;
        }
        return `${parent.name()}.${this.node.structure.keyInParent()}`;
    }, ...(ngDevMode ? [{ debugName: "name" }] : []));
    /** Whether this field is considered non-interactive.
     *
     * A field is considered non-interactive if one of the following is true:
     * - It is hidden
     * - It is disabled
     * - It is readonly
     */
    isNonInteractive = computed(() => this.hidden() || this.disabled() || this.readonly(), ...(ngDevMode ? [{ debugName: "isNonInteractive" }] : []));
}

/**
 * Basic adapter supporting standard form behavior.
 */
class BasicFieldAdapter {
    /**
     * Creates a new Root field node.
     * @param fieldManager
     * @param value
     * @param pathNode
     * @param adapter
     */
    newRoot(fieldManager, value, pathNode, adapter) {
        return new FieldNode({
            kind: 'root',
            fieldManager,
            value,
            pathNode,
            logic: pathNode.logic.build(),
            fieldAdapter: adapter,
        });
    }
    /**
     * Creates a new child field node.
     * @param options
     */
    newChild(options) {
        return new FieldNode(options);
    }
    /**
     * Creates a node state.
     * @param node
     */
    createNodeState(node) {
        return new FieldNodeState(node);
    }
    /**
     * Creates a validation state.
     * @param node
     */
    createValidationState(node) {
        return new FieldValidationState(node);
    }
    /**
     * Creates a node structure.
     * @param node
     * @param options
     */
    createStructure(node, options) {
        return node.createStructure(options);
    }
}

/**
 * Manages the collection of fields associated with a given `form`.
 *
 * Fields are created implicitly, through reactivity, and may create "owned" entities like effects
 * or resources. When a field is no longer connected to the form, these owned entities should be
 * destroyed, which is the job of the `FormFieldManager`.
 */
class FormFieldManager {
    injector;
    rootName;
    constructor(injector, rootName) {
        this.injector = injector;
        this.rootName = rootName ?? `${this.injector.get(APP_ID)}.form${nextFormId++}`;
    }
    /**
     * Contains all child field structures that have been created as part of the current form.
     * New child structures are automatically added when they are created.
     * Structures are destroyed and removed when they are no longer reachable from the root.
     */
    structures = new Set();
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
    createFieldManagementEffect(root) {
        effect(() => {
            const liveStructures = new Set();
            this.markStructuresLive(root, liveStructures);
            // Destroy all nodes that are no longer live.
            for (const structure of this.structures) {
                if (!liveStructures.has(structure)) {
                    this.structures.delete(structure);
                    untracked(() => structure.destroy());
                }
            }
        }, { injector: this.injector });
    }
    /**
     * Collects all structures reachable from the given structure into the given set.
     *
     * @param structure The root structure
     * @param liveStructures The set of reachable structures to populate
     */
    markStructuresLive(structure, liveStructures) {
        liveStructures.add(structure);
        for (const child of structure.children()) {
            this.markStructuresLive(child.structure, liveStructures);
        }
    }
}
let nextFormId = 0;

/** Extracts the model, schema, and options from the arguments passed to `form()`. */
function normalizeFormArgs(args) {
    let model;
    let schema;
    let options;
    if (args.length === 3) {
        [model, schema, options] = args;
    }
    else if (args.length === 2) {
        if (isSchemaOrSchemaFn(args[1])) {
            [model, schema] = args;
        }
        else {
            [model, options] = args;
        }
    }
    else {
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
 * When binding logic to the array items, the `Field` for the array item is passed as an additional
 * argument. This can be used to reference other properties on the item.
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
 * @experimental 21.0.0
 */
function applyEach(path, schema) {
    assertPathIsCurrent(path);
    const elementPath = FieldPathNode.unwrapFieldPath(path).element.fieldPathProxy;
    apply(elementPath, schema);
}
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
 * @experimental 21.0.0
 */
function apply(path, schema) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.mergeIn(SchemaImpl.create(schema));
}
/**
 * Conditionally applies a predefined schema to a given `FieldPath`.
 *
 * @param path The target path to apply the schema to.
 * @param logic A `LogicFn<T, boolean>` that returns `true` when the schema should be applied.
 * @param schema The schema to apply to the field when the `logic` function returns `true`.
 * @template TValue The data type of the field to apply the schema to.
 *
 * @experimental 21.0.0
 */
function applyWhen(path, logic, schema) {
    assertPathIsCurrent(path);
    const pathNode = FieldPathNode.unwrapFieldPath(path);
    pathNode.mergeIn(SchemaImpl.create(schema), { fn: logic, path });
}
function applyWhenValue(path, predicate, schema) {
    applyWhen(path, ({ value }) => predicate(value()), schema);
}
/**
 * Submits a given `Field` using the given action function and applies any server errors resulting
 * from the action to the field. Server errors returned by the `action` will be integrated into the
 * field as a `ValidationError` on the sub-field indicated by the `field` property of the server
 * error.
 *
 * @example
 * ```
 * async function registerNewUser(registrationForm: Field<{username: string, password: string}>) {
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
 * @experimental 21.0.0
 */
async function submit(form, action) {
    const node = form();
    markAllAsTouched(node);
    // Fail fast if the form is already invalid.
    if (node.invalid()) {
        return;
    }
    node.submitState.selfSubmitting.set(true);
    try {
        const errors = await action(form);
        errors && setServerErrors(node, errors);
    }
    finally {
        node.submitState.selfSubmitting.set(false);
    }
}
/**
 * Sets a list of server errors to their individual fields.
 *
 * @param submittedField The field that was submitted, resulting in the errors.
 * @param errors The errors to set.
 */
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
/**
 * Creates a `Schema` that adds logic rules to a form.
 * @param fn A **non-reactive** function that sets up reactive logic rules for the form.
 * @returns A schema object that implements the given logic.
 * @template TValue The value type of a `Field` that this schema binds to.
 *
 * @experimental 21.0.0
 */
function schema(fn) {
    return SchemaImpl.create(fn);
}
/** Marks a {@link node} and its descendants as touched. */
function markAllAsTouched(node) {
    node.markAsTouched();
    for (const child of node.structure.children()) {
        markAllAsTouched(child);
    }
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
function standardSchemaError(issue, options) {
    return new StandardSchemaValidationError(issue, options);
}
function customError(obj) {
    return new CustomValidationError(obj);
}
/**
 * A custom error that may contain additional properties
 *
 * @experimental 21.0.0
 */
class CustomValidationError {
    /** Brand the class to avoid Typescript structural matching */
    __brand = undefined;
    /** Identifies the kind of error. */
    kind = '';
    /** The field associated with this error. */
    field;
    /** Human readable error message. */
    message;
    constructor(options) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
/**
 * Internal version of `NgValidationError`, we create this separately so we can change its type on
 * the exported version to a type union of the possible sub-classes.
 *
 * @experimental 21.0.0
 */
class _NgValidationError {
    /** Brand the class to avoid Typescript structural matching */
    __brand = undefined;
    /** Identifies the kind of error. */
    kind = '';
    /** The field associated with this error. */
    field;
    /** Human readable error message. */
    message;
    constructor(options) {
        if (options) {
            Object.assign(this, options);
        }
    }
}
/**
 * An error used to indicate that a required field is empty.
 *
 * @experimental 21.0.0
 */
class RequiredValidationError extends _NgValidationError {
    kind = 'required';
}
/**
 * An error used to indicate that a value is lower than the minimum allowed.
 *
 * @experimental 21.0.0
 */
class MinValidationError extends _NgValidationError {
    min;
    kind = 'min';
    constructor(min, options) {
        super(options);
        this.min = min;
    }
}
/**
 * An error used to indicate that a value is higher than the maximum allowed.
 *
 * @experimental 21.0.0
 */
class MaxValidationError extends _NgValidationError {
    max;
    kind = 'max';
    constructor(max, options) {
        super(options);
        this.max = max;
    }
}
/**
 * An error used to indicate that a value is shorter than the minimum allowed length.
 *
 * @experimental 21.0.0
 */
class MinLengthValidationError extends _NgValidationError {
    minLength;
    kind = 'minLength';
    constructor(minLength, options) {
        super(options);
        this.minLength = minLength;
    }
}
/**
 * An error used to indicate that a value is longer than the maximum allowed length.
 *
 * @experimental 21.0.0
 */
class MaxLengthValidationError extends _NgValidationError {
    maxLength;
    kind = 'maxLength';
    constructor(maxLength, options) {
        super(options);
        this.maxLength = maxLength;
    }
}
/**
 * An error used to indicate that a value does not match the required pattern.
 *
 * @experimental 21.0.0
 */
class PatternValidationError extends _NgValidationError {
    pattern;
    kind = 'pattern';
    constructor(pattern, options) {
        super(options);
        this.pattern = pattern;
    }
}
/**
 * An error used to indicate that a value is not a valid email.
 *
 * @experimental 21.0.0
 */
class EmailValidationError extends _NgValidationError {
    kind = 'email';
}
/**
 * An error used to indicate an issue validating against a standard schema.
 *
 * @experimental 21.0.0
 */
class StandardSchemaValidationError extends _NgValidationError {
    issue;
    kind = 'standardSchema';
    constructor(issue, options) {
        super(options);
        this.issue = issue;
    }
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
 * @experimental 21.0.0
 */
const NgValidationError = _NgValidationError;

/** Gets the length or size of the given value. */
function getLengthOrSize(value) {
    const v = value;
    return typeof v.length === 'number' ? v.length : v.size;
}
/**
 * Gets the value for an option that may be either a static value or a logic function that produces
 * the option value.
 *
 * @param opt The option from BaseValidatorConfig.
 * @param ctx The current FieldContext.
 * @returns The value for the option.
 */
function getOption(opt, ctx) {
    return opt instanceof Function ? opt(ctx) : opt;
}
/**
 * Checks if the given value is considered empty. Empty values are: null, undefined, '', false, NaN.
 */
function isEmpty(value) {
    if (typeof value === 'number') {
        return isNaN(value);
    }
    return value === '' || value === false || value == null;
}

/**
 * A regular expression that matches valid e-mail addresses.
 *
 * At a high level, this regexp matches e-mail addresses of the format `local-part@tld`, where:
 * - `local-part` consists of one or more of the allowed characters (alphanumeric and some
 *   punctuation symbols).
 * - `local-part` cannot begin or end with a period (`.`).
 * - `local-part` cannot be longer than 64 characters.
 * - `tld` consists of one or more `labels` separated by periods (`.`). For example `localhost` or
 *   `foo.com`.
 * - A `label` consists of one or more of the allowed characters (alphanumeric, dashes (`-`) and
 *   periods (`.`)).
 * - A `label` cannot begin or end with a dash (`-`) or a period (`.`).
 * - A `label` cannot be longer than 63 characters.
 * - The whole address cannot be longer than 254 characters.
 *
 * ## Implementation background
 *
 * This regexp was ported over from AngularJS (see there for git history):
 * https://github.com/angular/angular.js/blob/c133ef836/src/ng/directive/input.js#L27
 * It is based on the
 * [WHATWG version](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
 * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
 * lengths of different parts of the address). The main differences from the WHATWG version are:
 *   - Disallow `local-part` to begin or end with a period (`.`).
 *   - Disallow `local-part` length to exceed 64 characters.
 *   - Disallow total address length to exceed 254 characters.
 *
 * See [this commit](https://github.com/angular/angular.js/commit/f3f5cf72e) for more details.
 */
const EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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
 * @experimental 21.0.0
 */
function email(path, config) {
    validate(path, (ctx) => {
        if (isEmpty(ctx.value())) {
            return undefined;
        }
        if (!EMAIL_REGEXP.test(ctx.value())) {
            if (config?.error) {
                return getOption(config.error, ctx);
            }
            else {
                return emailError({ message: getOption(config?.message, ctx) });
            }
        }
        return undefined;
    });
}

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
 * @experimental 21.0.0
 */
function max(path, maxValue, config) {
    const MAX_MEMO = property(path, (ctx) => computed(() => (typeof maxValue === 'number' ? maxValue : maxValue(ctx))));
    aggregateProperty(path, MAX, ({ state }) => state.property(MAX_MEMO)());
    validate(path, (ctx) => {
        if (isEmpty(ctx.value())) {
            return undefined;
        }
        const max = ctx.state.property(MAX_MEMO)();
        if (max === undefined || Number.isNaN(max)) {
            return undefined;
        }
        if (ctx.value() > max) {
            if (config?.error) {
                return getOption(config.error, ctx);
            }
            else {
                return maxError(max, { message: getOption(config?.message, ctx) });
            }
        }
        return undefined;
    });
}

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
 * @experimental 21.0.0
 */
function maxLength(path, maxLength, config) {
    const MAX_LENGTH_MEMO = property(path, (ctx) => computed(() => (typeof maxLength === 'number' ? maxLength : maxLength(ctx))));
    aggregateProperty(path, MAX_LENGTH, ({ state }) => state.property(MAX_LENGTH_MEMO)());
    validate(path, (ctx) => {
        if (isEmpty(ctx.value())) {
            return undefined;
        }
        const maxLength = ctx.state.property(MAX_LENGTH_MEMO)();
        if (maxLength === undefined) {
            return undefined;
        }
        if (getLengthOrSize(ctx.value()) > maxLength) {
            if (config?.error) {
                return getOption(config.error, ctx);
            }
            else {
                return maxLengthError(maxLength, { message: getOption(config?.message, ctx) });
            }
        }
        return undefined;
    });
}

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
 * @experimental 21.0.0
 */
function min(path, minValue, config) {
    const MIN_MEMO = property(path, (ctx) => computed(() => (typeof minValue === 'number' ? minValue : minValue(ctx))));
    aggregateProperty(path, MIN, ({ state }) => state.property(MIN_MEMO)());
    validate(path, (ctx) => {
        if (isEmpty(ctx.value())) {
            return undefined;
        }
        const min = ctx.state.property(MIN_MEMO)();
        if (min === undefined || Number.isNaN(min)) {
            return undefined;
        }
        if (ctx.value() < min) {
            if (config?.error) {
                return getOption(config.error, ctx);
            }
            else {
                return minError(min, { message: getOption(config?.message, ctx) });
            }
        }
        return undefined;
    });
}

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
 * @experimental 21.0.0
 */
function minLength(path, minLength, config) {
    const MIN_LENGTH_MEMO = property(path, (ctx) => computed(() => (typeof minLength === 'number' ? minLength : minLength(ctx))));
    aggregateProperty(path, MIN_LENGTH, ({ state }) => state.property(MIN_LENGTH_MEMO)());
    validate(path, (ctx) => {
        if (isEmpty(ctx.value())) {
            return undefined;
        }
        const minLength = ctx.state.property(MIN_LENGTH_MEMO)();
        if (minLength === undefined) {
            return undefined;
        }
        if (getLengthOrSize(ctx.value()) < minLength) {
            if (config?.error) {
                return getOption(config.error, ctx);
            }
            else {
                return minLengthError(minLength, { message: getOption(config?.message, ctx) });
            }
        }
        return undefined;
    });
}

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
 * @experimental 21.0.0
 */
function pattern(path, pattern, config) {
    const PATTERN_MEMO = property(path, (ctx) => computed(() => (pattern instanceof RegExp ? pattern : pattern(ctx))));
    aggregateProperty(path, PATTERN, ({ state }) => state.property(PATTERN_MEMO)());
    validate(path, (ctx) => {
        if (isEmpty(ctx.value())) {
            return undefined;
        }
        const pattern = ctx.state.property(PATTERN_MEMO)();
        if (pattern === undefined) {
            return undefined;
        }
        if (!pattern.test(ctx.value())) {
            if (config?.error) {
                return getOption(config.error, ctx);
            }
            else {
                return patternError(pattern, { message: getOption(config?.message, ctx) });
            }
        }
        return undefined;
    });
}

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
 * @experimental 21.0.0
 */
function required(path, config) {
    const REQUIRED_MEMO = property(path, (ctx) => computed(() => (config?.when ? config.when(ctx) : true)));
    aggregateProperty(path, REQUIRED, ({ state }) => state.property(REQUIRED_MEMO)());
    validate(path, (ctx) => {
        if (ctx.state.property(REQUIRED_MEMO)() && isEmpty(ctx.value())) {
            if (config?.error) {
                return getOption(config.error, ctx);
            }
            else {
                return requiredError({ message: getOption(config?.message, ctx) });
            }
        }
        return undefined;
    });
}

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
 * @experimental 21.0.0
 */
function validateStandardSchema(path, schema) {
    // We create both a sync and async validator because the standard schema validator can return
    // either a sync result or a Promise, and we need to handle both cases. The sync validator
    // handles the sync result, and the async validator handles the Promise.
    // We memoize the result of the validation function here, so that it is only run once for both
    // validators, it can then be passed through both sync & async validation.
    const VALIDATOR_MEMO = property(path, ({ value }) => {
        return computed(() => schema['~standard'].validate(value()));
    });
    validateTree(path, ({ state, fieldOf }) => {
        // Skip sync validation if the result is a Promise.
        const result = state.property(VALIDATOR_MEMO)();
        if (_isPromise(result)) {
            return [];
        }
        return result.issues?.map((issue) => standardIssueToFormTreeError(fieldOf(path), issue)) ?? [];
    });
    validateAsync(path, {
        params: ({ state }) => {
            // Skip async validation if the result is *not* a Promise.
            const result = state.property(VALIDATOR_MEMO)();
            return _isPromise(result) ? result : undefined;
        },
        factory: (params) => {
            return resource({
                params,
                loader: async ({ params }) => (await params)?.issues ?? [],
            });
        },
        errors: (issues, { fieldOf }) => {
            return issues.map((issue) => standardIssueToFormTreeError(fieldOf(path), issue));
        },
    });
}
/**
 * Converts a `StandardSchemaV1.Issue` to a `FormTreeError`.
 *
 * @param field The root field to which the issue's path is relative.
 * @param issue The `StandardSchemaV1.Issue` to convert.
 * @returns A `ValidationError` representing the issue.
 */
function standardIssueToFormTreeError(field, issue) {
    let target = field;
    for (const pathPart of issue.path ?? []) {
        const pathKey = typeof pathPart === 'object' ? pathPart.key : pathPart;
        target = target[pathKey];
    }
    return addDefaultField(standardSchemaError(issue), target);
}

export { AggregateProperty, Control, CustomValidationError, EmailValidationError, MAX, MAX_LENGTH, MIN, MIN_LENGTH, MaxLengthValidationError, MaxValidationError, MinLengthValidationError, MinValidationError, NgValidationError, PATTERN, PatternValidationError, Property, REQUIRED, RequiredValidationError, StandardSchemaValidationError, aggregateProperty, andProperty, apply, applyEach, applyWhen, applyWhenValue, createProperty, customError, disabled, email, emailError, form, hidden, listProperty, max, maxError, maxLength, maxLengthError, maxProperty, min, minError, minLength, minLengthError, minProperty, orProperty, pattern, patternError, property, readonly, reducedProperty, required, requiredError, schema, standardSchemaError, submit, validate, validateAsync, validateHttp, validateStandardSchema, validateTree };
//# sourceMappingURL=signals.mjs.map
