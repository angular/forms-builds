/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getControlAsyncValidators, getControlValidators, mergeValidators } from '../validators';
import { BuiltInControlValueAccessor } from './control_value_accessor';
import { DefaultValueAccessor } from './default_value_accessor';
import { ngModelWarning } from './reactive_errors';
export function controlPath(name, parent) {
    return [...parent.path, name];
}
/**
 * Links a Form control and a Form directive by setting up callbacks (such as `onChange`) on both
 * instances. This function is typically invoked when form directive is being initialized.
 *
 * @param control Form control instance that should be linked.
 * @param dir Directive that should be linked with a given control.
 */
export function setUpControl(control, dir) {
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        if (!control)
            _throwError(dir, 'Cannot find control with');
        if (!dir.valueAccessor)
            _throwError(dir, 'No value accessor for form control with');
    }
    setUpValidators(control, dir);
    dir.valueAccessor.writeValue(control.value);
    setUpViewChangePipeline(control, dir);
    setUpModelChangePipeline(control, dir);
    setUpBlurPipeline(control, dir);
    setUpDisabledChangeHandler(control, dir);
}
/**
 * Reverts configuration performed by the `setUpControl` control function.
 * Effectively disconnects form control with a given form directive.
 * This function is typically invoked when corresponding form directive is being destroyed.
 *
 * @param control Form control which should be cleaned up.
 * @param dir Directive that should be disconnected from a given control.
 * @param validateControlPresenceOnChange Flag that indicates whether onChange handler should
 *     contain asserts to verify that it's not called once directive is destroyed. We need this flag
 *     to avoid potentially breaking changes caused by better control cleanup introduced in #39235.
 */
export function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
    const noop = () => {
        if (validateControlPresenceOnChange && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            _noControlError(dir);
        }
    };
    // The `valueAccessor` field is typically defined on FromControl and FormControlName directive
    // instances and there is a logic in `selectValueAccessor` function that throws if it's not the
    // case. We still check the presence of `valueAccessor` before invoking its methods to make sure
    // that cleanup works correctly if app code or tests are setup to ignore the error thrown from
    // `selectValueAccessor`. See https://github.com/angular/angular/issues/40521.
    if (dir.valueAccessor) {
        dir.valueAccessor.registerOnChange(noop);
        dir.valueAccessor.registerOnTouched(noop);
    }
    cleanUpValidators(control, dir);
    if (control) {
        dir._invokeOnDestroyCallbacks();
        control._registerOnCollectionChange(() => { });
    }
}
function registerOnValidatorChange(validators, onChange) {
    validators.forEach((validator) => {
        if (validator.registerOnValidatorChange)
            validator.registerOnValidatorChange(onChange);
    });
}
/**
 * Sets up disabled change handler function on a given form control if ControlValueAccessor
 * associated with a given directive instance supports the `setDisabledState` call.
 *
 * @param control Form control where disabled change handler should be setup.
 * @param dir Corresponding directive instance associated with this control.
 */
export function setUpDisabledChangeHandler(control, dir) {
    if (dir.valueAccessor.setDisabledState) {
        const onDisabledChange = (isDisabled) => {
            dir.valueAccessor.setDisabledState(isDisabled);
        };
        control.registerOnDisabledChange(onDisabledChange);
        // Register a callback function to cleanup disabled change handler
        // from a control instance when a directive is destroyed.
        dir._registerOnDestroy(() => {
            control._unregisterOnDisabledChange(onDisabledChange);
        });
    }
}
/**
 * Sets up sync and async directive validators on provided form control.
 * This function merges validators from the directive into the validators of the control.
 *
 * @param control Form control where directive validators should be setup.
 * @param dir Directive instance that contains validators to be setup.
 */
export function setUpValidators(control, dir) {
    const validators = getControlValidators(control);
    if (dir.validator !== null) {
        control.setValidators(mergeValidators(validators, dir.validator));
    }
    else if (typeof validators === 'function') {
        // If sync validators are represented by a single validator function, we force the
        // `Validators.compose` call to happen by executing the `setValidators` function with
        // an array that contains that function. We need this to avoid possible discrepancies in
        // validators behavior, so sync validators are always processed by the `Validators.compose`.
        // Note: we should consider moving this logic inside the `setValidators` function itself, so we
        // have consistent behavior on AbstractControl API level. The same applies to the async
        // validators logic below.
        control.setValidators([validators]);
    }
    const asyncValidators = getControlAsyncValidators(control);
    if (dir.asyncValidator !== null) {
        control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
    }
    else if (typeof asyncValidators === 'function') {
        control.setAsyncValidators([asyncValidators]);
    }
    // Re-run validation when validator binding changes, e.g. minlength=3 -> minlength=4
    const onValidatorChange = () => control.updateValueAndValidity();
    registerOnValidatorChange(dir._rawValidators, onValidatorChange);
    registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
}
/**
 * Cleans up sync and async directive validators on provided form control.
 * This function reverts the setup performed by the `setUpValidators` function, i.e.
 * removes directive-specific validators from a given control instance.
 *
 * @param control Form control from where directive validators should be removed.
 * @param dir Directive instance that contains validators to be removed.
 * @returns true if a control was updated as a result of this action.
 */
export function cleanUpValidators(control, dir) {
    let isControlUpdated = false;
    if (control !== null) {
        if (dir.validator !== null) {
            const validators = getControlValidators(control);
            if (Array.isArray(validators) && validators.length > 0) {
                // Filter out directive validator function.
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
                // Filter out directive async validator function.
                const updatedAsyncValidators = asyncValidators.filter(asyncValidator => asyncValidator !== dir.asyncValidator);
                if (updatedAsyncValidators.length !== asyncValidators.length) {
                    isControlUpdated = true;
                    control.setAsyncValidators(updatedAsyncValidators);
                }
            }
        }
    }
    // Clear onValidatorChange callbacks by providing a noop function.
    const noop = () => { };
    registerOnValidatorChange(dir._rawValidators, noop);
    registerOnValidatorChange(dir._rawAsyncValidators, noop);
    return isControlUpdated;
}
function setUpViewChangePipeline(control, dir) {
    dir.valueAccessor.registerOnChange((newValue) => {
        control._pendingValue = newValue;
        control._pendingChange = true;
        control._pendingDirty = true;
        if (control.updateOn === 'change')
            updateControl(control, dir);
    });
}
function setUpBlurPipeline(control, dir) {
    dir.valueAccessor.registerOnTouched(() => {
        control._pendingTouched = true;
        if (control.updateOn === 'blur' && control._pendingChange)
            updateControl(control, dir);
        if (control.updateOn !== 'submit')
            control.markAsTouched();
    });
}
function updateControl(control, dir) {
    if (control._pendingDirty)
        control.markAsDirty();
    control.setValue(control._pendingValue, { emitModelToViewChange: false });
    dir.viewToModelUpdate(control._pendingValue);
    control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
    const onChange = (newValue, emitModelEvent) => {
        // control -> view
        dir.valueAccessor.writeValue(newValue);
        // control -> ngModel
        if (emitModelEvent)
            dir.viewToModelUpdate(newValue);
    };
    control.registerOnChange(onChange);
    // Register a callback function to cleanup onChange handler
    // from a control instance when a directive is destroyed.
    dir._registerOnDestroy(() => {
        control._unregisterOnChange(onChange);
    });
}
/**
 * Links a FormGroup or FormArray instance and corresponding Form directive by setting up validators
 * present in the view.
 *
 * @param control FormGroup or FormArray instance that should be linked.
 * @param dir Directive that provides view validators.
 */
export function setUpFormContainer(control, dir) {
    if (control == null && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwError(dir, 'Cannot find control with');
    setUpValidators(control, dir);
}
/**
 * Reverts the setup performed by the `setUpFormContainer` function.
 *
 * @param control FormGroup or FormArray instance that should be cleaned up.
 * @param dir Directive that provided view validators.
 * @returns true if a control was updated as a result of this action.
 */
export function cleanUpFormContainer(control, dir) {
    return cleanUpValidators(control, dir);
}
function _noControlError(dir) {
    return _throwError(dir, 'There is no FormControl instance attached to form control element with');
}
function _throwError(dir, message) {
    let messageEnd;
    if (dir.path.length > 1) {
        messageEnd = `path: '${dir.path.join(' -> ')}'`;
    }
    else if (dir.path[0]) {
        messageEnd = `name: '${dir.path}'`;
    }
    else {
        messageEnd = 'unspecified name attribute';
    }
    throw new Error(`${message} ${messageEnd}`);
}
export function isPropertyUpdated(changes, viewModel) {
    if (!changes.hasOwnProperty('model'))
        return false;
    const change = changes['model'];
    if (change.isFirstChange())
        return true;
    return !Object.is(viewModel, change.currentValue);
}
export function isBuiltInAccessor(valueAccessor) {
    // Check if a given value accessor is an instance of a class that directly extends
    // `BuiltInControlValueAccessor` one.
    return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}
export function syncPendingControls(form, directives) {
    form._syncPendingControls();
    directives.forEach((dir) => {
        const control = dir.control;
        if (control.updateOn === 'submit' && control._pendingChange) {
            dir.viewToModelUpdate(control._pendingValue);
            control._pendingChange = false;
        }
    });
}
// TODO: vsavkin remove it once https://github.com/angular/angular/issues/3011 is implemented
export function selectValueAccessor(dir, valueAccessors) {
    if (!valueAccessors)
        return null;
    if (!Array.isArray(valueAccessors) && (typeof ngDevMode === 'undefined' || ngDevMode))
        _throwError(dir, 'Value accessor was not provided as an array for form control with');
    let defaultAccessor = undefined;
    let builtinAccessor = undefined;
    let customAccessor = undefined;
    valueAccessors.forEach((v) => {
        if (v.constructor === DefaultValueAccessor) {
            defaultAccessor = v;
        }
        else if (isBuiltInAccessor(v)) {
            if (builtinAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                _throwError(dir, 'More than one built-in value accessor matches form control with');
            builtinAccessor = v;
        }
        else {
            if (customAccessor && (typeof ngDevMode === 'undefined' || ngDevMode))
                _throwError(dir, 'More than one custom value accessor matches form control with');
            customAccessor = v;
        }
    });
    if (customAccessor)
        return customAccessor;
    if (builtinAccessor)
        return builtinAccessor;
    if (defaultAccessor)
        return defaultAccessor;
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        _throwError(dir, 'No valid value accessor for form control with');
    }
    return null;
}
export function removeListItem(list, el) {
    const index = list.indexOf(el);
    if (index > -1)
        list.splice(index, 1);
}
// TODO(kara): remove after deprecation period
export function _ngModelWarning(name, type, instance, warningConfig) {
    if (warningConfig === 'never')
        return;
    if (((warningConfig === null || warningConfig === 'once') && !type._ngModelWarningSentOnce) ||
        (warningConfig === 'always' && !instance._ngModelWarningSent)) {
        console.warn(ngModelWarning(name));
        type._ngModelWarningSentOnce = true;
        instance._ngModelWarningSent = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFLL0YsT0FBTyxFQUFDLDJCQUEyQixFQUF1QixNQUFNLDBCQUEwQixDQUFDO0FBQzNGLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBRzlELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUlqRCxNQUFNLFVBQVUsV0FBVyxDQUFDLElBQWlCLEVBQUUsTUFBd0I7SUFDckUsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUssRUFBRSxJQUFLLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxPQUFvQixFQUFFLEdBQWM7SUFDL0QsSUFBSSxPQUFPLFNBQVMsS0FBSyxXQUFXLElBQUksU0FBUyxFQUFFO1FBQ2pELElBQUksQ0FBQyxPQUFPO1lBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYTtZQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUseUNBQXlDLENBQUMsQ0FBQztLQUNyRjtJQUVELGVBQWUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFOUIsR0FBRyxDQUFDLGFBQWMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTdDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0Qyx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7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U0FBUyxFQUFFO1FBQ2pELFdBQVcsQ0FBQyxHQUFHLEVBQUUsK0NBQStDLENBQUMsQ0FBQztLQUNuRTtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELE1BQU0sVUFBVSxjQUFjLENBQUksSUFBUyxFQUFFLEVBQUs7SUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMvQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQsOENBQThDO0FBQzlDLE1BQU0sVUFBVSxlQUFlLENBQzNCLElBQVksRUFBRSxJQUF3QyxFQUN0RCxRQUF3QyxFQUFFLGFBQTBCO0lBQ3RFLElBQUksYUFBYSxLQUFLLE9BQU87UUFBRSxPQUFPO0lBRXRDLElBQUksQ0FBQyxDQUFDLGFBQWEsS0FBSyxJQUFJLElBQUksYUFBYSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDO1FBQ3ZGLENBQUMsYUFBYSxLQUFLLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFO1FBQ2pFLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztRQUNwQyxRQUFRLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO0tBQ3JDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgRm9ybUFycmF5LCBGb3JtQ29udHJvbCwgRm9ybUdyb3VwfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge2dldENvbnRyb2xBc3luY1ZhbGlkYXRvcnMsIGdldENvbnRyb2xWYWxpZGF0b3JzLCBtZXJnZVZhbGlkYXRvcnN9IGZyb20gJy4uL3ZhbGlkYXRvcnMnO1xuXG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9hYnN0cmFjdF9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0Fic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuL2Fic3RyYWN0X2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0J1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvciwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge0RlZmF1bHRWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4vbmdfY29udHJvbCc7XG5pbXBvcnQge0Zvcm1BcnJheU5hbWV9IGZyb20gJy4vcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUnO1xuaW1wb3J0IHtuZ01vZGVsV2FybmluZ30gZnJvbSAnLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb250cm9sUGF0aChuYW1lOiBzdHJpbmd8bnVsbCwgcGFyZW50OiBDb250cm9sQ29udGFpbmVyKTogc3RyaW5nW10ge1xuICByZXR1cm4gWy4uLnBhcmVudC5wYXRoISwgbmFtZSFdO1xufVxuXG4vKipcbiAqIExpbmtzIGEgRm9ybSBjb250cm9sIGFuZCBhIEZvcm0gZGlyZWN0aXZlIGJ5IHNldHRpbmcgdXAgY2FsbGJhY2tzIChzdWNoIGFzIGBvbkNoYW5nZWApIG9uIGJvdGhcbiAqIGluc3RhbmNlcy4gVGhpcyBmdW5jdGlvbiBpcyB0eXBpY2FsbHkgaW52b2tlZCB3aGVuIGZvcm0gZGlyZWN0aXZlIGlzIGJlaW5nIGluaXRpYWxpemVkLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCBpbnN0YW5jZSB0aGF0IHNob3VsZCBiZSBsaW5rZWQuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSB0aGF0IHNob3VsZCBiZSBsaW5rZWQgd2l0aCBhIGdpdmVuIGNvbnRyb2wuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRVcENvbnRyb2woY29udHJvbDogRm9ybUNvbnRyb2wsIGRpcjogTmdDb250cm9sKTogdm9pZCB7XG4gIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICBpZiAoIWNvbnRyb2wpIF90aHJvd0Vycm9yKGRpciwgJ0Nhbm5vdCBmaW5kIGNvbnRyb2wgd2l0aCcpO1xuICAgIGlmICghZGlyLnZhbHVlQWNjZXNzb3IpIF90aHJvd0Vycm9yKGRpciwgJ05vIHZhbHVlIGFjY2Vzc29yIGZvciBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICB9XG5cbiAgc2V0VXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcik7XG5cbiAgZGlyLnZhbHVlQWNjZXNzb3IhLndyaXRlVmFsdWUoY29udHJvbC52YWx1ZSk7XG5cbiAgc2V0VXBWaWV3Q2hhbmdlUGlwZWxpbmUoY29udHJvbCwgZGlyKTtcbiAgc2V0VXBNb2RlbENoYW5nZVBpcGVsaW5lKGNvbnRyb2wsIGRpcik7XG5cbiAgc2V0VXBCbHVyUGlwZWxpbmUoY29udHJvbCwgZGlyKTtcblxuICBzZXRVcERpc2FibGVkQ2hhbmdlSGFuZGxlcihjb250cm9sLCBkaXIpO1xufVxuXG4vKipcbiAqIFJldmVydHMgY29uZmlndXJhdGlvbiBwZXJmb3JtZWQgYnkgdGhlIGBzZXRVcENvbnRyb2xgIGNvbnRyb2wgZnVuY3Rpb24uXG4gKiBFZmZlY3RpdmVseSBkaXNjb25uZWN0cyBmb3JtIGNvbnRyb2wgd2l0aCBhIGdpdmVuIGZvcm0gZGlyZWN0aXZlLlxuICogVGhpcyBmdW5jdGlvbiBpcyB0eXBpY2FsbHkgaW52b2tlZCB3aGVuIGNvcnJlc3BvbmRpbmcgZm9ybSBkaXJlY3RpdmUgaXMgYmVpbmcgZGVzdHJveWVkLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB3aGljaCBzaG91bGQgYmUgY2xlYW5lZCB1cC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIHRoYXQgc2hvdWxkIGJlIGRpc2Nvbm5lY3RlZCBmcm9tIGEgZ2l2ZW4gY29udHJvbC5cbiAqIEBwYXJhbSB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlIEZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBvbkNoYW5nZSBoYW5kbGVyIHNob3VsZFxuICogICAgIGNvbnRhaW4gYXNzZXJ0cyB0byB2ZXJpZnkgdGhhdCBpdCdzIG5vdCBjYWxsZWQgb25jZSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLiBXZSBuZWVkIHRoaXMgZmxhZ1xuICogICAgIHRvIGF2b2lkIHBvdGVudGlhbGx5IGJyZWFraW5nIGNoYW5nZXMgY2F1c2VkIGJ5IGJldHRlciBjb250cm9sIGNsZWFudXAgaW50cm9kdWNlZCBpbiAjMzkyMzUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblVwQ29udHJvbChcbiAgICBjb250cm9sOiBGb3JtQ29udHJvbHxudWxsLCBkaXI6IE5nQ29udHJvbCxcbiAgICB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICBjb25zdCBub29wID0gKCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICBfbm9Db250cm9sRXJyb3IoZGlyKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGB2YWx1ZUFjY2Vzc29yYCBmaWVsZCBpcyB0eXBpY2FsbHkgZGVmaW5lZCBvbiBGcm9tQ29udHJvbCBhbmQgRm9ybUNvbnRyb2xOYW1lIGRpcmVjdGl2ZVxuICAvLyBpbnN0YW5jZXMgYW5kIHRoZXJlIGlzIGEgbG9naWMgaW4gYHNlbGVjdFZhbHVlQWNjZXNzb3JgIGZ1bmN0aW9uIHRoYXQgdGhyb3dzIGlmIGl0J3Mgbm90IHRoZVxuICAvLyBjYXNlLiBXZSBzdGlsbCBjaGVjayB0aGUgcHJlc2VuY2Ugb2YgYHZhbHVlQWNjZXNzb3JgIGJlZm9yZSBpbnZva2luZyBpdHMgbWV0aG9kcyB0byBtYWtlIHN1cmVcbiAgLy8gdGhhdCBjbGVhbnVwIHdvcmtzIGNvcnJlY3RseSBpZiBhcHAgY29kZSBvciB0ZXN0cyBhcmUgc2V0dXAgdG8gaWdub3JlIHRoZSBlcnJvciB0aHJvd24gZnJvbVxuICAvLyBgc2VsZWN0VmFsdWVBY2Nlc3NvcmAuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy80MDUyMS5cbiAgaWYgKGRpci52YWx1ZUFjY2Vzc29yKSB7XG4gICAgZGlyLnZhbHVlQWNjZXNzb3IucmVnaXN0ZXJPbkNoYW5nZShub29wKTtcbiAgICBkaXIudmFsdWVBY2Nlc3Nvci5yZWdpc3Rlck9uVG91Y2hlZChub29wKTtcbiAgfVxuXG4gIGNsZWFuVXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcik7XG5cbiAgaWYgKGNvbnRyb2wpIHtcbiAgICBkaXIuX2ludm9rZU9uRGVzdHJveUNhbGxiYWNrcygpO1xuICAgIGNvbnRyb2wuX3JlZ2lzdGVyT25Db2xsZWN0aW9uQ2hhbmdlKCgpID0+IHt9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlPFY+KHZhbGlkYXRvcnM6IChWfFZhbGlkYXRvcilbXSwgb25DaGFuZ2U6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgdmFsaWRhdG9ycy5mb3JFYWNoKCh2YWxpZGF0b3I6IChWfFZhbGlkYXRvcikpID0+IHtcbiAgICBpZiAoKDxWYWxpZGF0b3I+dmFsaWRhdG9yKS5yZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlKVxuICAgICAgKDxWYWxpZGF0b3I+dmFsaWRhdG9yKS5yZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlIShvbkNoYW5nZSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFNldHMgdXAgZGlzYWJsZWQgY2hhbmdlIGhhbmRsZXIgZnVuY3Rpb24gb24gYSBnaXZlbiBmb3JtIGNvbnRyb2wgaWYgQ29udHJvbFZhbHVlQWNjZXNzb3JcbiAqIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIGRpcmVjdGl2ZSBpbnN0YW5jZSBzdXBwb3J0cyB0aGUgYHNldERpc2FibGVkU3RhdGVgIGNhbGwuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHdoZXJlIGRpc2FibGVkIGNoYW5nZSBoYW5kbGVyIHNob3VsZCBiZSBzZXR1cC5cbiAqIEBwYXJhbSBkaXIgQ29ycmVzcG9uZGluZyBkaXJlY3RpdmUgaW5zdGFuY2UgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY29udHJvbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFVwRGlzYWJsZWRDaGFuZ2VIYW5kbGVyKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBpZiAoZGlyLnZhbHVlQWNjZXNzb3IhLnNldERpc2FibGVkU3RhdGUpIHtcbiAgICBjb25zdCBvbkRpc2FibGVkQ2hhbmdlID0gKGlzRGlzYWJsZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGRpci52YWx1ZUFjY2Vzc29yIS5zZXREaXNhYmxlZFN0YXRlIShpc0Rpc2FibGVkKTtcbiAgICB9O1xuICAgIGNvbnRyb2wucmVnaXN0ZXJPbkRpc2FibGVkQ2hhbmdlKG9uRGlzYWJsZWRDaGFuZ2UpO1xuXG4gICAgLy8gUmVnaXN0ZXIgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjbGVhbnVwIGRpc2FibGVkIGNoYW5nZSBoYW5kbGVyXG4gICAgLy8gZnJvbSBhIGNvbnRyb2wgaW5zdGFuY2Ugd2hlbiBhIGRpcmVjdGl2ZSBpcyBkZXN0cm95ZWQuXG4gICAgZGlyLl9yZWdpc3Rlck9uRGVzdHJveSgoKSA9PiB7XG4gICAgICBjb250cm9sLl91bnJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShvbkRpc2FibGVkQ2hhbmdlKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFNldHMgdXAgc3luYyBhbmQgYXN5bmMgZGlyZWN0aXZlIHZhbGlkYXRvcnMgb24gcHJvdmlkZWQgZm9ybSBjb250cm9sLlxuICogVGhpcyBmdW5jdGlvbiBtZXJnZXMgdmFsaWRhdG9ycyBmcm9tIHRoZSBkaXJlY3RpdmUgaW50byB0aGUgdmFsaWRhdG9ycyBvZiB0aGUgY29udHJvbC5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgd2hlcmUgZGlyZWN0aXZlIHZhbGlkYXRvcnMgc2hvdWxkIGJlIHNldHVwLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgaW5zdGFuY2UgdGhhdCBjb250YWlucyB2YWxpZGF0b3JzIHRvIGJlIHNldHVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0VXBWYWxpZGF0b3JzKGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgZGlyOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUpOiB2b2lkIHtcbiAgY29uc3QgdmFsaWRhdG9ycyA9IGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2wpO1xuICBpZiAoZGlyLnZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgIGNvbnRyb2wuc2V0VmFsaWRhdG9ycyhtZXJnZVZhbGlkYXRvcnM8VmFsaWRhdG9yRm4+KHZhbGlkYXRvcnMsIGRpci52YWxpZGF0b3IpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsaWRhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIElmIHN5bmMgdmFsaWRhdG9ycyBhcmUgcmVwcmVzZW50ZWQgYnkgYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uLCB3ZSBmb3JjZSB0aGVcbiAgICAvLyBgVmFsaWRhdG9ycy5jb21wb3NlYCBjYWxsIHRvIGhhcHBlbiBieSBleGVjdXRpbmcgdGhlIGBzZXRWYWxpZGF0b3JzYCBmdW5jdGlvbiB3aXRoXG4gICAgLy8gYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGF0IGZ1bmN0aW9uLiBXZSBuZWVkIHRoaXMgdG8gYXZvaWQgcG9zc2libGUgZGlzY3JlcGFuY2llcyBpblxuICAgIC8vIHZhbGlkYXRvcnMgYmVoYXZpb3IsIHNvIHN5bmMgdmFsaWRhdG9ycyBhcmUgYWx3YXlzIHByb2Nlc3NlZCBieSB0aGUgYFZhbGlkYXRvcnMuY29tcG9zZWAuXG4gICAgLy8gTm90ZTogd2Ugc2hvdWxkIGNvbnNpZGVyIG1vdmluZyB0aGlzIGxvZ2ljIGluc2lkZSB0aGUgYHNldFZhbGlkYXRvcnNgIGZ1bmN0aW9uIGl0c2VsZiwgc28gd2VcbiAgICAvLyBoYXZlIGNvbnNpc3RlbnQgYmVoYXZpb3Igb24gQWJzdHJhY3RDb250cm9sIEFQSSBsZXZlbC4gVGhlIHNhbWUgYXBwbGllcyB0byB0aGUgYXN5bmNcbiAgICAvLyB2YWxpZGF0b3JzIGxvZ2ljIGJlbG93LlxuICAgIGNvbnRyb2wuc2V0VmFsaWRhdG9ycyhbdmFsaWRhdG9yc10pO1xuICB9XG5cbiAgY29uc3QgYXN5bmNWYWxpZGF0b3JzID0gZ2V0Q29udHJvbEFzeW5jVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgaWYgKGRpci5hc3luY1ZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgIGNvbnRyb2wuc2V0QXN5bmNWYWxpZGF0b3JzKFxuICAgICAgICBtZXJnZVZhbGlkYXRvcnM8QXN5bmNWYWxpZGF0b3JGbj4oYXN5bmNWYWxpZGF0b3JzLCBkaXIuYXN5bmNWYWxpZGF0b3IpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYXN5bmNWYWxpZGF0b3JzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29udHJvbC5zZXRBc3luY1ZhbGlkYXRvcnMoW2FzeW5jVmFsaWRhdG9yc10pO1xuICB9XG5cbiAgLy8gUmUtcnVuIHZhbGlkYXRpb24gd2hlbiB2YWxpZGF0b3IgYmluZGluZyBjaGFuZ2VzLCBlLmcuIG1pbmxlbmd0aD0zIC0+IG1pbmxlbmd0aD00XG4gIGNvbnN0IG9uVmFsaWRhdG9yQ2hhbmdlID0gKCkgPT4gY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U8VmFsaWRhdG9yRm4+KGRpci5fcmF3VmFsaWRhdG9ycywgb25WYWxpZGF0b3JDaGFuZ2UpO1xuICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlPEFzeW5jVmFsaWRhdG9yRm4+KGRpci5fcmF3QXN5bmNWYWxpZGF0b3JzLCBvblZhbGlkYXRvckNoYW5nZSk7XG59XG5cbi8qKlxuICogQ2xlYW5zIHVwIHN5bmMgYW5kIGFzeW5jIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIG9uIHByb3ZpZGVkIGZvcm0gY29udHJvbC5cbiAqIFRoaXMgZnVuY3Rpb24gcmV2ZXJ0cyB0aGUgc2V0dXAgcGVyZm9ybWVkIGJ5IHRoZSBgc2V0VXBWYWxpZGF0b3JzYCBmdW5jdGlvbiwgaS5lLlxuICogcmVtb3ZlcyBkaXJlY3RpdmUtc3BlY2lmaWMgdmFsaWRhdG9ycyBmcm9tIGEgZ2l2ZW4gY29udHJvbCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgZnJvbSB3aGVyZSBkaXJlY3RpdmUgdmFsaWRhdG9ycyBzaG91bGQgYmUgcmVtb3ZlZC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIGluc3RhbmNlIHRoYXQgY29udGFpbnMgdmFsaWRhdG9ycyB0byBiZSByZW1vdmVkLlxuICogQHJldHVybnMgdHJ1ZSBpZiBhIGNvbnRyb2wgd2FzIHVwZGF0ZWQgYXMgYSByZXN1bHQgb2YgdGhpcyBhY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblVwVmFsaWRhdG9ycyhcbiAgICBjb250cm9sOiBBYnN0cmFjdENvbnRyb2x8bnVsbCwgZGlyOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUpOiBib29sZWFuIHtcbiAgbGV0IGlzQ29udHJvbFVwZGF0ZWQgPSBmYWxzZTtcbiAgaWYgKGNvbnRyb2wgIT09IG51bGwpIHtcbiAgICBpZiAoZGlyLnZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgdmFsaWRhdG9ycyA9IGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2wpO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsaWRhdG9ycykgJiYgdmFsaWRhdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgZGlyZWN0aXZlIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAgICAgICAgY29uc3QgdXBkYXRlZFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcih2YWxpZGF0b3IgPT4gdmFsaWRhdG9yICE9PSBkaXIudmFsaWRhdG9yKTtcbiAgICAgICAgaWYgKHVwZGF0ZWRWYWxpZGF0b3JzLmxlbmd0aCAhPT0gdmFsaWRhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBpc0NvbnRyb2xVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICBjb250cm9sLnNldFZhbGlkYXRvcnModXBkYXRlZFZhbGlkYXRvcnMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGRpci5hc3luY1ZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgYXN5bmNWYWxpZGF0b3JzID0gZ2V0Q29udHJvbEFzeW5jVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGFzeW5jVmFsaWRhdG9ycykgJiYgYXN5bmNWYWxpZGF0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gRmlsdGVyIG91dCBkaXJlY3RpdmUgYXN5bmMgdmFsaWRhdG9yIGZ1bmN0aW9uLlxuICAgICAgICBjb25zdCB1cGRhdGVkQXN5bmNWYWxpZGF0b3JzID1cbiAgICAgICAgICAgIGFzeW5jVmFsaWRhdG9ycy5maWx0ZXIoYXN5bmNWYWxpZGF0b3IgPT4gYXN5bmNWYWxpZGF0b3IgIT09IGRpci5hc3luY1ZhbGlkYXRvcik7XG4gICAgICAgIGlmICh1cGRhdGVkQXN5bmNWYWxpZGF0b3JzLmxlbmd0aCAhPT0gYXN5bmNWYWxpZGF0b3JzLmxlbmd0aCkge1xuICAgICAgICAgIGlzQ29udHJvbFVwZGF0ZWQgPSB0cnVlO1xuICAgICAgICAgIGNvbnRyb2wuc2V0QXN5bmNWYWxpZGF0b3JzKHVwZGF0ZWRBc3luY1ZhbGlkYXRvcnMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ2xlYXIgb25WYWxpZGF0b3JDaGFuZ2UgY2FsbGJhY2tzIGJ5IHByb3ZpZGluZyBhIG5vb3AgZnVuY3Rpb24uXG4gIGNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZTxWYWxpZGF0b3JGbj4oZGlyLl9yYXdWYWxpZGF0b3JzLCBub29wKTtcbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZTxBc3luY1ZhbGlkYXRvckZuPihkaXIuX3Jhd0FzeW5jVmFsaWRhdG9ycywgbm9vcCk7XG5cbiAgcmV0dXJuIGlzQ29udHJvbFVwZGF0ZWQ7XG59XG5cbmZ1bmN0aW9uIHNldFVwVmlld0NoYW5nZVBpcGVsaW5lKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBkaXIudmFsdWVBY2Nlc3NvciEucmVnaXN0ZXJPbkNoYW5nZSgobmV3VmFsdWU6IGFueSkgPT4ge1xuICAgIGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSB0cnVlO1xuICAgIGNvbnRyb2wuX3BlbmRpbmdEaXJ0eSA9IHRydWU7XG5cbiAgICBpZiAoY29udHJvbC51cGRhdGVPbiA9PT0gJ2NoYW5nZScpIHVwZGF0ZUNvbnRyb2woY29udHJvbCwgZGlyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFVwQmx1clBpcGVsaW5lKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBkaXIudmFsdWVBY2Nlc3NvciEucmVnaXN0ZXJPblRvdWNoZWQoKCkgPT4ge1xuICAgIGNvbnRyb2wuX3BlbmRpbmdUb3VjaGVkID0gdHJ1ZTtcblxuICAgIGlmIChjb250cm9sLnVwZGF0ZU9uID09PSAnYmx1cicgJiYgY29udHJvbC5fcGVuZGluZ0NoYW5nZSkgdXBkYXRlQ29udHJvbChjb250cm9sLCBkaXIpO1xuICAgIGlmIChjb250cm9sLnVwZGF0ZU9uICE9PSAnc3VibWl0JykgY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDb250cm9sKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBpZiAoY29udHJvbC5fcGVuZGluZ0RpcnR5KSBjb250cm9sLm1hcmtBc0RpcnR5KCk7XG4gIGNvbnRyb2wuc2V0VmFsdWUoY29udHJvbC5fcGVuZGluZ1ZhbHVlLCB7ZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZX0pO1xuICBkaXIudmlld1RvTW9kZWxVcGRhdGUoY29udHJvbC5fcGVuZGluZ1ZhbHVlKTtcbiAgY29udHJvbC5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzZXRVcE1vZGVsQ2hhbmdlUGlwZWxpbmUoY29udHJvbDogRm9ybUNvbnRyb2wsIGRpcjogTmdDb250cm9sKTogdm9pZCB7XG4gIGNvbnN0IG9uQ2hhbmdlID0gKG5ld1ZhbHVlPzogYW55LCBlbWl0TW9kZWxFdmVudD86IGJvb2xlYW4pID0+IHtcbiAgICAvLyBjb250cm9sIC0+IHZpZXdcbiAgICBkaXIudmFsdWVBY2Nlc3NvciEud3JpdGVWYWx1ZShuZXdWYWx1ZSk7XG5cbiAgICAvLyBjb250cm9sIC0+IG5nTW9kZWxcbiAgICBpZiAoZW1pdE1vZGVsRXZlbnQpIGRpci52aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZSk7XG4gIH07XG4gIGNvbnRyb2wucmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZSk7XG5cbiAgLy8gUmVnaXN0ZXIgYSBjYWxsYmFjayBmdW5jdGlvbiB0byBjbGVhbnVwIG9uQ2hhbmdlIGhhbmRsZXJcbiAgLy8gZnJvbSBhIGNvbnRyb2wgaW5zdGFuY2Ugd2hlbiBhIGRpcmVjdGl2ZSBpcyBkZXN0cm95ZWQuXG4gIGRpci5fcmVnaXN0ZXJPbkRlc3Ryb3koKCkgPT4ge1xuICAgIGNvbnRyb2wuX3VucmVnaXN0ZXJPbkNoYW5nZShvbkNoYW5nZSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIExpbmtzIGEgRm9ybUdyb3VwIG9yIEZvcm1BcnJheSBpbnN0YW5jZSBhbmQgY29ycmVzcG9uZGluZyBGb3JtIGRpcmVjdGl2ZSBieSBzZXR0aW5nIHVwIHZhbGlkYXRvcnNcbiAqIHByZXNlbnQgaW4gdGhlIHZpZXcuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybUdyb3VwIG9yIEZvcm1BcnJheSBpbnN0YW5jZSB0aGF0IHNob3VsZCBiZSBsaW5rZWQuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSB0aGF0IHByb3ZpZGVzIHZpZXcgdmFsaWRhdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldFVwRm9ybUNvbnRhaW5lcihcbiAgICBjb250cm9sOiBGb3JtR3JvdXB8Rm9ybUFycmF5LCBkaXI6IEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlfEZvcm1BcnJheU5hbWUpIHtcbiAgaWYgKGNvbnRyb2wgPT0gbnVsbCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICBfdGhyb3dFcnJvcihkaXIsICdDYW5ub3QgZmluZCBjb250cm9sIHdpdGgnKTtcbiAgc2V0VXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpcik7XG59XG5cbi8qKlxuICogUmV2ZXJ0cyB0aGUgc2V0dXAgcGVyZm9ybWVkIGJ5IHRoZSBgc2V0VXBGb3JtQ29udGFpbmVyYCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtR3JvdXAgb3IgRm9ybUFycmF5IGluc3RhbmNlIHRoYXQgc2hvdWxkIGJlIGNsZWFuZWQgdXAuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSB0aGF0IHByb3ZpZGVkIHZpZXcgdmFsaWRhdG9ycy5cbiAqIEByZXR1cm5zIHRydWUgaWYgYSBjb250cm9sIHdhcyB1cGRhdGVkIGFzIGEgcmVzdWx0IG9mIHRoaXMgYWN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5VcEZvcm1Db250YWluZXIoXG4gICAgY29udHJvbDogRm9ybUdyb3VwfEZvcm1BcnJheSwgZGlyOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZXxGb3JtQXJyYXlOYW1lKTogYm9vbGVhbiB7XG4gIHJldHVybiBjbGVhblVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIpO1xufVxuXG5mdW5jdGlvbiBfbm9Db250cm9sRXJyb3IoZGlyOiBOZ0NvbnRyb2wpIHtcbiAgcmV0dXJuIF90aHJvd0Vycm9yKGRpciwgJ1RoZXJlIGlzIG5vIEZvcm1Db250cm9sIGluc3RhbmNlIGF0dGFjaGVkIHRvIGZvcm0gY29udHJvbCBlbGVtZW50IHdpdGgnKTtcbn1cblxuZnVuY3Rpb24gX3Rocm93RXJyb3IoZGlyOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUsIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICBsZXQgbWVzc2FnZUVuZDogc3RyaW5nO1xuICBpZiAoZGlyLnBhdGghLmxlbmd0aCA+IDEpIHtcbiAgICBtZXNzYWdlRW5kID0gYHBhdGg6ICcke2Rpci5wYXRoIS5qb2luKCcgLT4gJyl9J2A7XG4gIH0gZWxzZSBpZiAoZGlyLnBhdGghWzBdKSB7XG4gICAgbWVzc2FnZUVuZCA9IGBuYW1lOiAnJHtkaXIucGF0aH0nYDtcbiAgfSBlbHNlIHtcbiAgICBtZXNzYWdlRW5kID0gJ3Vuc3BlY2lmaWVkIG5hbWUgYXR0cmlidXRlJztcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZX0gJHttZXNzYWdlRW5kfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlczoge1trZXk6IHN0cmluZ106IGFueX0sIHZpZXdNb2RlbDogYW55KTogYm9vbGVhbiB7XG4gIGlmICghY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnbW9kZWwnKSkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzWydtb2RlbCddO1xuXG4gIGlmIChjaGFuZ2UuaXNGaXJzdENoYW5nZSgpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICFPYmplY3QuaXModmlld01vZGVsLCBjaGFuZ2UuY3VycmVudFZhbHVlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQnVpbHRJbkFjY2Vzc29yKHZhbHVlQWNjZXNzb3I6IENvbnRyb2xWYWx1ZUFjY2Vzc29yKTogYm9vbGVhbiB7XG4gIC8vIENoZWNrIGlmIGEgZ2l2ZW4gdmFsdWUgYWNjZXNzb3IgaXMgYW4gaW5zdGFuY2Ugb2YgYSBjbGFzcyB0aGF0IGRpcmVjdGx5IGV4dGVuZHNcbiAgLy8gYEJ1aWx0SW5Db250cm9sVmFsdWVBY2Nlc3NvcmAgb25lLlxuICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlQWNjZXNzb3IuY29uc3RydWN0b3IpID09PSBCdWlsdEluQ29udHJvbFZhbHVlQWNjZXNzb3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW5jUGVuZGluZ0NvbnRyb2xzKGZvcm06IEZvcm1Hcm91cCwgZGlyZWN0aXZlczogU2V0PE5nQ29udHJvbD58TmdDb250cm9sW10pOiB2b2lkIHtcbiAgZm9ybS5fc3luY1BlbmRpbmdDb250cm9scygpO1xuICBkaXJlY3RpdmVzLmZvckVhY2goKGRpcjogTmdDb250cm9sKSA9PiB7XG4gICAgY29uc3QgY29udHJvbCA9IGRpci5jb250cm9sIGFzIEZvcm1Db250cm9sO1xuICAgIGlmIChjb250cm9sLnVwZGF0ZU9uID09PSAnc3VibWl0JyAmJiBjb250cm9sLl9wZW5kaW5nQ2hhbmdlKSB7XG4gICAgICBkaXIudmlld1RvTW9kZWxVcGRhdGUoY29udHJvbC5fcGVuZGluZ1ZhbHVlKTtcbiAgICAgIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSBmYWxzZTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBUT0RPOiB2c2F2a2luIHJlbW92ZSBpdCBvbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzMwMTEgaXMgaW1wbGVtZW50ZWRcbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RWYWx1ZUFjY2Vzc29yKFxuICAgIGRpcjogTmdDb250cm9sLCB2YWx1ZUFjY2Vzc29yczogQ29udHJvbFZhbHVlQWNjZXNzb3JbXSk6IENvbnRyb2xWYWx1ZUFjY2Vzc29yfG51bGwge1xuICBpZiAoIXZhbHVlQWNjZXNzb3JzKSByZXR1cm4gbnVsbDtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWVBY2Nlc3NvcnMpICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKVxuICAgIF90aHJvd0Vycm9yKGRpciwgJ1ZhbHVlIGFjY2Vzc29yIHdhcyBub3QgcHJvdmlkZWQgYXMgYW4gYXJyYXkgZm9yIGZvcm0gY29udHJvbCB3aXRoJyk7XG5cbiAgbGV0IGRlZmF1bHRBY2Nlc3NvcjogQ29udHJvbFZhbHVlQWNjZXNzb3J8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBsZXQgYnVpbHRpbkFjY2Vzc29yOiBDb250cm9sVmFsdWVBY2Nlc3Nvcnx1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGxldCBjdXN0b21BY2Nlc3NvcjogQ29udHJvbFZhbHVlQWNjZXNzb3J8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuXG4gIHZhbHVlQWNjZXNzb3JzLmZvckVhY2goKHY6IENvbnRyb2xWYWx1ZUFjY2Vzc29yKSA9PiB7XG4gICAgaWYgKHYuY29uc3RydWN0b3IgPT09IERlZmF1bHRWYWx1ZUFjY2Vzc29yKSB7XG4gICAgICBkZWZhdWx0QWNjZXNzb3IgPSB2O1xuXG4gICAgfSBlbHNlIGlmIChpc0J1aWx0SW5BY2Nlc3Nvcih2KSkge1xuICAgICAgaWYgKGJ1aWx0aW5BY2Nlc3NvciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnTW9yZSB0aGFuIG9uZSBidWlsdC1pbiB2YWx1ZSBhY2Nlc3NvciBtYXRjaGVzIGZvcm0gY29udHJvbCB3aXRoJyk7XG4gICAgICBidWlsdGluQWNjZXNzb3IgPSB2O1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjdXN0b21BY2Nlc3NvciAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICAgICAgX3Rocm93RXJyb3IoZGlyLCAnTW9yZSB0aGFuIG9uZSBjdXN0b20gdmFsdWUgYWNjZXNzb3IgbWF0Y2hlcyBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICAgICAgY3VzdG9tQWNjZXNzb3IgPSB2O1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGN1c3RvbUFjY2Vzc29yKSByZXR1cm4gY3VzdG9tQWNjZXNzb3I7XG4gIGlmIChidWlsdGluQWNjZXNzb3IpIHJldHVybiBidWlsdGluQWNjZXNzb3I7XG4gIGlmIChkZWZhdWx0QWNjZXNzb3IpIHJldHVybiBkZWZhdWx0QWNjZXNzb3I7XG5cbiAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgIF90aHJvd0Vycm9yKGRpciwgJ05vIHZhbGlkIHZhbHVlIGFjY2Vzc29yIGZvciBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTGlzdEl0ZW08VD4obGlzdDogVFtdLCBlbDogVCk6IHZvaWQge1xuICBjb25zdCBpbmRleCA9IGxpc3QuaW5kZXhPZihlbCk7XG4gIGlmIChpbmRleCA+IC0xKSBsaXN0LnNwbGljZShpbmRleCwgMSk7XG59XG5cbi8vIFRPRE8oa2FyYSk6IHJlbW92ZSBhZnRlciBkZXByZWNhdGlvbiBwZXJpb2RcbmV4cG9ydCBmdW5jdGlvbiBfbmdNb2RlbFdhcm5pbmcoXG4gICAgbmFtZTogc3RyaW5nLCB0eXBlOiB7X25nTW9kZWxXYXJuaW5nU2VudE9uY2U6IGJvb2xlYW59LFxuICAgIGluc3RhbmNlOiB7X25nTW9kZWxXYXJuaW5nU2VudDogYm9vbGVhbn0sIHdhcm5pbmdDb25maWc6IHN0cmluZ3xudWxsKSB7XG4gIGlmICh3YXJuaW5nQ29uZmlnID09PSAnbmV2ZXInKSByZXR1cm47XG5cbiAgaWYgKCgod2FybmluZ0NvbmZpZyA9PT0gbnVsbCB8fCB3YXJuaW5nQ29uZmlnID09PSAnb25jZScpICYmICF0eXBlLl9uZ01vZGVsV2FybmluZ1NlbnRPbmNlKSB8fFxuICAgICAgKHdhcm5pbmdDb25maWcgPT09ICdhbHdheXMnICYmICFpbnN0YW5jZS5fbmdNb2RlbFdhcm5pbmdTZW50KSkge1xuICAgIGNvbnNvbGUud2FybihuZ01vZGVsV2FybmluZyhuYW1lKSk7XG4gICAgdHlwZS5fbmdNb2RlbFdhcm5pbmdTZW50T25jZSA9IHRydWU7XG4gICAgaW5zdGFuY2UuX25nTW9kZWxXYXJuaW5nU2VudCA9IHRydWU7XG4gIH1cbn1cbiJdfQ==