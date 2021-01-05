/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { getControlAsyncValidators, getControlValidators, mergeValidators } from '../validators';
import { CheckboxControlValueAccessor } from './checkbox_value_accessor';
import { DefaultValueAccessor } from './default_value_accessor';
import { NumberValueAccessor } from './number_value_accessor';
import { RadioControlValueAccessor } from './radio_control_value_accessor';
import { RangeValueAccessor } from './range_value_accessor';
import { ReactiveErrors } from './reactive_errors';
import { SelectControlValueAccessor } from './select_control_value_accessor';
import { SelectMultipleControlValueAccessor } from './select_multiple_control_value_accessor';
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
    setUpValidators(control, dir, /* handleOnValidatorChange */ true);
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
    dir.valueAccessor.registerOnChange(noop);
    dir.valueAccessor.registerOnTouched(noop);
    cleanUpValidators(control, dir, /* handleOnValidatorChange */ true);
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
 * @param handleOnValidatorChange Flag that determines whether directive validators should be setup
 *     to handle validator input change.
 */
export function setUpValidators(control, dir, handleOnValidatorChange) {
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
    if (handleOnValidatorChange) {
        const onValidatorChange = () => control.updateValueAndValidity();
        registerOnValidatorChange(dir._rawValidators, onValidatorChange);
        registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
    }
}
/**
 * Cleans up sync and async directive validators on provided form control.
 * This function reverts the setup performed by the `setUpValidators` function, i.e.
 * removes directive-specific validators from a given control instance.
 *
 * @param control Form control from where directive validators should be removed.
 * @param dir Directive instance that contains validators to be removed.
 * @param handleOnValidatorChange Flag that determines whether directive validators should also be
 *     cleaned up to stop handling validator input change (if previously configured to do so).
 * @returns true if a control was updated as a result of this action.
 */
export function cleanUpValidators(control, dir, handleOnValidatorChange) {
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
    if (handleOnValidatorChange) {
        // Clear onValidatorChange callbacks by providing a noop function.
        const noop = () => { };
        registerOnValidatorChange(dir._rawValidators, noop);
        registerOnValidatorChange(dir._rawAsyncValidators, noop);
    }
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
    setUpValidators(control, dir, /* handleOnValidatorChange */ false);
}
/**
 * Reverts the setup performed by the `setUpFormContainer` function.
 *
 * @param control FormGroup or FormArray instance that should be cleaned up.
 * @param dir Directive that provided view validators.
 * @returns true if a control was updated as a result of this action.
 */
export function cleanUpFormContainer(control, dir) {
    return cleanUpValidators(control, dir, /* handleOnValidatorChange */ false);
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
const BUILTIN_ACCESSORS = [
    CheckboxControlValueAccessor,
    RangeValueAccessor,
    NumberValueAccessor,
    SelectControlValueAccessor,
    SelectMultipleControlValueAccessor,
    RadioControlValueAccessor,
];
export function isBuiltInAccessor(valueAccessor) {
    return BUILTIN_ACCESSORS.some(a => valueAccessor.constructor === a);
}
export function syncPendingControls(form, directives) {
    form._syncPendingControls();
    directives.forEach(dir => {
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
        ReactiveErrors.ngModelWarning(name);
        type._ngModelWarningSentOnce = true;
        instance._ngModelWarningSent = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZm9ybXMvc3JjL2RpcmVjdGl2ZXMvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxvQkFBb0IsRUFBRSxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJL0YsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFHdkUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFFOUQsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sZ0NBQWdDLENBQUM7QUFDekUsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFFMUQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLGlDQUFpQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxrQ0FBa0MsRUFBQyxNQUFNLDBDQUEwQyxDQUFDO0FBSTVGLE1BQU0sVUFBVSxXQUFXLENBQUMsSUFBaUIsRUFBRSxNQUF3QjtJQUNyRSxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSyxFQUFFLElBQUssQ0FBQyxDQUFDO0FBQ2xDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLE9BQW9CLEVBQUUsR0FBYztJQUMvRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUU7UUFDakQsSUFBSSxDQUFDLE9BQU87WUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDM0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhO1lBQUUsV0FBVyxD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QUssUUFBUSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7UUFDakUsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7S0FDckM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QWJzdHJhY3RDb250cm9sLCBGb3JtQXJyYXksIEZvcm1Db250cm9sLCBGb3JtR3JvdXB9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7Z2V0Q29udHJvbEFzeW5jVmFsaWRhdG9ycywgZ2V0Q29udHJvbFZhbGlkYXRvcnMsIG1lcmdlVmFsaWRhdG9yc30gZnJvbSAnLi4vdmFsaWRhdG9ycyc7XG5cbmltcG9ydCB7QWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfSBmcm9tICcuL2Fic3RyYWN0X2NvbnRyb2xfZGlyZWN0aXZlJztcbmltcG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2NoZWNrYm94X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtEZWZhdWx0VmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kZWZhdWx0X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TmdDb250cm9sfSBmcm9tICcuL25nX2NvbnRyb2wnO1xuaW1wb3J0IHtOdW1iZXJWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL251bWJlcl92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1JhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vcmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1JhbmdlVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9yYW5nZV92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge0Zvcm1BcnJheU5hbWV9IGZyb20gJy4vcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUnO1xuaW1wb3J0IHtSZWFjdGl2ZUVycm9yc30gZnJvbSAnLi9yZWFjdGl2ZV9lcnJvcnMnO1xuaW1wb3J0IHtTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9zZWxlY3RfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1NlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vc2VsZWN0X211bHRpcGxlX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBjb250cm9sUGF0aChuYW1lOiBzdHJpbmd8bnVsbCwgcGFyZW50OiBDb250cm9sQ29udGFpbmVyKTogc3RyaW5nW10ge1xuICByZXR1cm4gWy4uLnBhcmVudC5wYXRoISwgbmFtZSFdO1xufVxuXG4vKipcbiAqIExpbmtzIGEgRm9ybSBjb250cm9sIGFuZCBhIEZvcm0gZGlyZWN0aXZlIGJ5IHNldHRpbmcgdXAgY2FsbGJhY2tzIChzdWNoIGFzIGBvbkNoYW5nZWApIG9uIGJvdGhcbiAqIGluc3RhbmNlcy4gVGhpcyBmdW5jdGlvbiBpcyB0eXBpY2FsbHkgaW52b2tlZCB3aGVuIGZvcm0gZGlyZWN0aXZlIGlzIGJlaW5nIGluaXRpYWxpemVkLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCBpbnN0YW5jZSB0aGF0IHNob3VsZCBiZSBsaW5rZWQuXG4gKiBAcGFyYW0gZGlyIERpcmVjdGl2ZSB0aGF0IHNob3VsZCBiZSBsaW5rZWQgd2l0aCBhIGdpdmVuIGNvbnRyb2wuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRVcENvbnRyb2woY29udHJvbDogRm9ybUNvbnRyb2wsIGRpcjogTmdDb250cm9sKTogdm9pZCB7XG4gIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICBpZiAoIWNvbnRyb2wpIF90aHJvd0Vycm9yKGRpciwgJ0Nhbm5vdCBmaW5kIGNvbnRyb2wgd2l0aCcpO1xuICAgIGlmICghZGlyLnZhbHVlQWNjZXNzb3IpIF90aHJvd0Vycm9yKGRpciwgJ05vIHZhbHVlIGFjY2Vzc29yIGZvciBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICB9XG5cbiAgc2V0VXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpciwgLyogaGFuZGxlT25WYWxpZGF0b3JDaGFuZ2UgKi8gdHJ1ZSk7XG5cbiAgZGlyLnZhbHVlQWNjZXNzb3IhLndyaXRlVmFsdWUoY29udHJvbC52YWx1ZSk7XG5cbiAgc2V0VXBWaWV3Q2hhbmdlUGlwZWxpbmUoY29udHJvbCwgZGlyKTtcbiAgc2V0VXBNb2RlbENoYW5nZVBpcGVsaW5lKGNvbnRyb2wsIGRpcik7XG5cbiAgc2V0VXBCbHVyUGlwZWxpbmUoY29udHJvbCwgZGlyKTtcblxuICBzZXRVcERpc2FibGVkQ2hhbmdlSGFuZGxlcihjb250cm9sLCBkaXIpO1xufVxuXG4vKipcbiAqIFJldmVydHMgY29uZmlndXJhdGlvbiBwZXJmb3JtZWQgYnkgdGhlIGBzZXRVcENvbnRyb2xgIGNvbnRyb2wgZnVuY3Rpb24uXG4gKiBFZmZlY3RpdmVseSBkaXNjb25uZWN0cyBmb3JtIGNvbnRyb2wgd2l0aCBhIGdpdmVuIGZvcm0gZGlyZWN0aXZlLlxuICogVGhpcyBmdW5jdGlvbiBpcyB0eXBpY2FsbHkgaW52b2tlZCB3aGVuIGNvcnJlc3BvbmRpbmcgZm9ybSBkaXJlY3RpdmUgaXMgYmVpbmcgZGVzdHJveWVkLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB3aGljaCBzaG91bGQgYmUgY2xlYW5lZCB1cC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIHRoYXQgc2hvdWxkIGJlIGRpc2Nvbm5lY3RlZCBmcm9tIGEgZ2l2ZW4gY29udHJvbC5cbiAqIEBwYXJhbSB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlIEZsYWcgdGhhdCBpbmRpY2F0ZXMgd2hldGhlciBvbkNoYW5nZSBoYW5kbGVyIHNob3VsZFxuICogICAgIGNvbnRhaW4gYXNzZXJ0cyB0byB2ZXJpZnkgdGhhdCBpdCdzIG5vdCBjYWxsZWQgb25jZSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLiBXZSBuZWVkIHRoaXMgZmxhZ1xuICogICAgIHRvIGF2b2lkIHBvdGVudGlhbGx5IGJyZWFraW5nIGNoYW5nZXMgY2F1c2VkIGJ5IGJldHRlciBjb250cm9sIGNsZWFudXAgaW50cm9kdWNlZCBpbiAjMzkyMzUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblVwQ29udHJvbChcbiAgICBjb250cm9sOiBGb3JtQ29udHJvbHxudWxsLCBkaXI6IE5nQ29udHJvbCxcbiAgICB2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlOiBib29sZWFuID0gdHJ1ZSk6IHZvaWQge1xuICBjb25zdCBub29wID0gKCkgPT4ge1xuICAgIGlmICh2YWxpZGF0ZUNvbnRyb2xQcmVzZW5jZU9uQ2hhbmdlICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICBfbm9Db250cm9sRXJyb3IoZGlyKTtcbiAgICB9XG4gIH07XG5cbiAgZGlyLnZhbHVlQWNjZXNzb3IhLnJlZ2lzdGVyT25DaGFuZ2Uobm9vcCk7XG4gIGRpci52YWx1ZUFjY2Vzc29yIS5yZWdpc3Rlck9uVG91Y2hlZChub29wKTtcblxuICBjbGVhblVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIsIC8qIGhhbmRsZU9uVmFsaWRhdG9yQ2hhbmdlICovIHRydWUpO1xuXG4gIGlmIChjb250cm9sKSB7XG4gICAgZGlyLl9pbnZva2VPbkRlc3Ryb3lDYWxsYmFja3MoKTtcbiAgICBjb250cm9sLl9yZWdpc3Rlck9uQ29sbGVjdGlvbkNoYW5nZSgoKSA9PiB7fSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZTxWPih2YWxpZGF0b3JzOiAoVnxWYWxpZGF0b3IpW10sIG9uQ2hhbmdlOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gIHZhbGlkYXRvcnMuZm9yRWFjaCgodmFsaWRhdG9yOiAoVnxWYWxpZGF0b3IpKSA9PiB7XG4gICAgaWYgKCg8VmFsaWRhdG9yPnZhbGlkYXRvcikucmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZSlcbiAgICAgICg8VmFsaWRhdG9yPnZhbGlkYXRvcikucmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZSEob25DaGFuZ2UpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTZXRzIHVwIGRpc2FibGVkIGNoYW5nZSBoYW5kbGVyIGZ1bmN0aW9uIG9uIGEgZ2l2ZW4gZm9ybSBjb250cm9sIGlmIENvbnRyb2xWYWx1ZUFjY2Vzc29yXG4gKiBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBkaXJlY3RpdmUgaW5zdGFuY2Ugc3VwcG9ydHMgdGhlIGBzZXREaXNhYmxlZFN0YXRlYCBjYWxsLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm0gY29udHJvbCB3aGVyZSBkaXNhYmxlZCBjaGFuZ2UgaGFuZGxlciBzaG91bGQgYmUgc2V0dXAuXG4gKiBAcGFyYW0gZGlyIENvcnJlc3BvbmRpbmcgZGlyZWN0aXZlIGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGNvbnRyb2wuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRVcERpc2FibGVkQ2hhbmdlSGFuZGxlcihjb250cm9sOiBGb3JtQ29udHJvbCwgZGlyOiBOZ0NvbnRyb2wpOiB2b2lkIHtcbiAgaWYgKGRpci52YWx1ZUFjY2Vzc29yIS5zZXREaXNhYmxlZFN0YXRlKSB7XG4gICAgY29uc3Qgb25EaXNhYmxlZENoYW5nZSA9IChpc0Rpc2FibGVkOiBib29sZWFuKSA9PiB7XG4gICAgICBkaXIudmFsdWVBY2Nlc3NvciEuc2V0RGlzYWJsZWRTdGF0ZSEoaXNEaXNhYmxlZCk7XG4gICAgfTtcbiAgICBjb250cm9sLnJlZ2lzdGVyT25EaXNhYmxlZENoYW5nZShvbkRpc2FibGVkQ2hhbmdlKTtcblxuICAgIC8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2xlYW51cCBkaXNhYmxlZCBjaGFuZ2UgaGFuZGxlclxuICAgIC8vIGZyb20gYSBjb250cm9sIGluc3RhbmNlIHdoZW4gYSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLlxuICAgIGRpci5fcmVnaXN0ZXJPbkRlc3Ryb3koKCkgPT4ge1xuICAgICAgY29udHJvbC5fdW5yZWdpc3Rlck9uRGlzYWJsZWRDaGFuZ2Uob25EaXNhYmxlZENoYW5nZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTZXRzIHVwIHN5bmMgYW5kIGFzeW5jIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIG9uIHByb3ZpZGVkIGZvcm0gY29udHJvbC5cbiAqIFRoaXMgZnVuY3Rpb24gbWVyZ2VzIHZhbGlkYXRvcnMgZnJvbSB0aGUgZGlyZWN0aXZlIGludG8gdGhlIHZhbGlkYXRvcnMgb2YgdGhlIGNvbnRyb2wuXG4gKlxuICogQHBhcmFtIGNvbnRyb2wgRm9ybSBjb250cm9sIHdoZXJlIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIHNob3VsZCBiZSBzZXR1cC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIGluc3RhbmNlIHRoYXQgY29udGFpbnMgdmFsaWRhdG9ycyB0byBiZSBzZXR1cC5cbiAqIEBwYXJhbSBoYW5kbGVPblZhbGlkYXRvckNoYW5nZSBGbGFnIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIHNob3VsZCBiZSBzZXR1cFxuICogICAgIHRvIGhhbmRsZSB2YWxpZGF0b3IgaW5wdXQgY2hhbmdlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0VXBWYWxpZGF0b3JzKFxuICAgIGNvbnRyb2w6IEFic3RyYWN0Q29udHJvbCwgZGlyOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUsXG4gICAgaGFuZGxlT25WYWxpZGF0b3JDaGFuZ2U6IGJvb2xlYW4pOiB2b2lkIHtcbiAgY29uc3QgdmFsaWRhdG9ycyA9IGdldENvbnRyb2xWYWxpZGF0b3JzKGNvbnRyb2wpO1xuICBpZiAoZGlyLnZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgIGNvbnRyb2wuc2V0VmFsaWRhdG9ycyhtZXJnZVZhbGlkYXRvcnM8VmFsaWRhdG9yRm4+KHZhbGlkYXRvcnMsIGRpci52YWxpZGF0b3IpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsaWRhdG9ycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIElmIHN5bmMgdmFsaWRhdG9ycyBhcmUgcmVwcmVzZW50ZWQgYnkgYSBzaW5nbGUgdmFsaWRhdG9yIGZ1bmN0aW9uLCB3ZSBmb3JjZSB0aGVcbiAgICAvLyBgVmFsaWRhdG9ycy5jb21wb3NlYCBjYWxsIHRvIGhhcHBlbiBieSBleGVjdXRpbmcgdGhlIGBzZXRWYWxpZGF0b3JzYCBmdW5jdGlvbiB3aXRoXG4gICAgLy8gYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGF0IGZ1bmN0aW9uLiBXZSBuZWVkIHRoaXMgdG8gYXZvaWQgcG9zc2libGUgZGlzY3JlcGFuY2llcyBpblxuICAgIC8vIHZhbGlkYXRvcnMgYmVoYXZpb3IsIHNvIHN5bmMgdmFsaWRhdG9ycyBhcmUgYWx3YXlzIHByb2Nlc3NlZCBieSB0aGUgYFZhbGlkYXRvcnMuY29tcG9zZWAuXG4gICAgLy8gTm90ZTogd2Ugc2hvdWxkIGNvbnNpZGVyIG1vdmluZyB0aGlzIGxvZ2ljIGluc2lkZSB0aGUgYHNldFZhbGlkYXRvcnNgIGZ1bmN0aW9uIGl0c2VsZiwgc28gd2VcbiAgICAvLyBoYXZlIGNvbnNpc3RlbnQgYmVoYXZpb3Igb24gQWJzdHJhY3RDb250cm9sIEFQSSBsZXZlbC4gVGhlIHNhbWUgYXBwbGllcyB0byB0aGUgYXN5bmNcbiAgICAvLyB2YWxpZGF0b3JzIGxvZ2ljIGJlbG93LlxuICAgIGNvbnRyb2wuc2V0VmFsaWRhdG9ycyhbdmFsaWRhdG9yc10pO1xuICB9XG5cbiAgY29uc3QgYXN5bmNWYWxpZGF0b3JzID0gZ2V0Q29udHJvbEFzeW5jVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgaWYgKGRpci5hc3luY1ZhbGlkYXRvciAhPT0gbnVsbCkge1xuICAgIGNvbnRyb2wuc2V0QXN5bmNWYWxpZGF0b3JzKFxuICAgICAgICBtZXJnZVZhbGlkYXRvcnM8QXN5bmNWYWxpZGF0b3JGbj4oYXN5bmNWYWxpZGF0b3JzLCBkaXIuYXN5bmNWYWxpZGF0b3IpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYXN5bmNWYWxpZGF0b3JzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY29udHJvbC5zZXRBc3luY1ZhbGlkYXRvcnMoW2FzeW5jVmFsaWRhdG9yc10pO1xuICB9XG5cbiAgLy8gUmUtcnVuIHZhbGlkYXRpb24gd2hlbiB2YWxpZGF0b3IgYmluZGluZyBjaGFuZ2VzLCBlLmcuIG1pbmxlbmd0aD0zIC0+IG1pbmxlbmd0aD00XG4gIGlmIChoYW5kbGVPblZhbGlkYXRvckNoYW5nZSkge1xuICAgIGNvbnN0IG9uVmFsaWRhdG9yQ2hhbmdlID0gKCkgPT4gY29udHJvbC51cGRhdGVWYWx1ZUFuZFZhbGlkaXR5KCk7XG4gICAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZTxWYWxpZGF0b3JGbj4oZGlyLl9yYXdWYWxpZGF0b3JzLCBvblZhbGlkYXRvckNoYW5nZSk7XG4gICAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZTxBc3luY1ZhbGlkYXRvckZuPihkaXIuX3Jhd0FzeW5jVmFsaWRhdG9ycywgb25WYWxpZGF0b3JDaGFuZ2UpO1xuICB9XG59XG5cbi8qKlxuICogQ2xlYW5zIHVwIHN5bmMgYW5kIGFzeW5jIGRpcmVjdGl2ZSB2YWxpZGF0b3JzIG9uIHByb3ZpZGVkIGZvcm0gY29udHJvbC5cbiAqIFRoaXMgZnVuY3Rpb24gcmV2ZXJ0cyB0aGUgc2V0dXAgcGVyZm9ybWVkIGJ5IHRoZSBgc2V0VXBWYWxpZGF0b3JzYCBmdW5jdGlvbiwgaS5lLlxuICogcmVtb3ZlcyBkaXJlY3RpdmUtc3BlY2lmaWMgdmFsaWRhdG9ycyBmcm9tIGEgZ2l2ZW4gY29udHJvbCBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0gY29udHJvbCBGb3JtIGNvbnRyb2wgZnJvbSB3aGVyZSBkaXJlY3RpdmUgdmFsaWRhdG9ycyBzaG91bGQgYmUgcmVtb3ZlZC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIGluc3RhbmNlIHRoYXQgY29udGFpbnMgdmFsaWRhdG9ycyB0byBiZSByZW1vdmVkLlxuICogQHBhcmFtIGhhbmRsZU9uVmFsaWRhdG9yQ2hhbmdlIEZsYWcgdGhhdCBkZXRlcm1pbmVzIHdoZXRoZXIgZGlyZWN0aXZlIHZhbGlkYXRvcnMgc2hvdWxkIGFsc28gYmVcbiAqICAgICBjbGVhbmVkIHVwIHRvIHN0b3AgaGFuZGxpbmcgdmFsaWRhdG9yIGlucHV0IGNoYW5nZSAoaWYgcHJldmlvdXNseSBjb25maWd1cmVkIHRvIGRvIHNvKS5cbiAqIEByZXR1cm5zIHRydWUgaWYgYSBjb250cm9sIHdhcyB1cGRhdGVkIGFzIGEgcmVzdWx0IG9mIHRoaXMgYWN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5VcFZhbGlkYXRvcnMoXG4gICAgY29udHJvbDogQWJzdHJhY3RDb250cm9sfG51bGwsIGRpcjogQWJzdHJhY3RDb250cm9sRGlyZWN0aXZlLFxuICAgIGhhbmRsZU9uVmFsaWRhdG9yQ2hhbmdlOiBib29sZWFuKTogYm9vbGVhbiB7XG4gIGxldCBpc0NvbnRyb2xVcGRhdGVkID0gZmFsc2U7XG4gIGlmIChjb250cm9sICE9PSBudWxsKSB7XG4gICAgaWYgKGRpci52YWxpZGF0b3IgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHZhbGlkYXRvcnMgPSBnZXRDb250cm9sVmFsaWRhdG9ycyhjb250cm9sKTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbGlkYXRvcnMpICYmIHZhbGlkYXRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBGaWx0ZXIgb3V0IGRpcmVjdGl2ZSB2YWxpZGF0b3IgZnVuY3Rpb24uXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRWYWxpZGF0b3JzID0gdmFsaWRhdG9ycy5maWx0ZXIodmFsaWRhdG9yID0+IHZhbGlkYXRvciAhPT0gZGlyLnZhbGlkYXRvcik7XG4gICAgICAgIGlmICh1cGRhdGVkVmFsaWRhdG9ycy5sZW5ndGggIT09IHZhbGlkYXRvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgaXNDb250cm9sVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgY29udHJvbC5zZXRWYWxpZGF0b3JzKHVwZGF0ZWRWYWxpZGF0b3JzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChkaXIuYXN5bmNWYWxpZGF0b3IgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGFzeW5jVmFsaWRhdG9ycyA9IGdldENvbnRyb2xBc3luY1ZhbGlkYXRvcnMoY29udHJvbCk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShhc3luY1ZhbGlkYXRvcnMpICYmIGFzeW5jVmFsaWRhdG9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgZGlyZWN0aXZlIGFzeW5jIHZhbGlkYXRvciBmdW5jdGlvbi5cbiAgICAgICAgY29uc3QgdXBkYXRlZEFzeW5jVmFsaWRhdG9ycyA9XG4gICAgICAgICAgICBhc3luY1ZhbGlkYXRvcnMuZmlsdGVyKGFzeW5jVmFsaWRhdG9yID0+IGFzeW5jVmFsaWRhdG9yICE9PSBkaXIuYXN5bmNWYWxpZGF0b3IpO1xuICAgICAgICBpZiAodXBkYXRlZEFzeW5jVmFsaWRhdG9ycy5sZW5ndGggIT09IGFzeW5jVmFsaWRhdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBpc0NvbnRyb2xVcGRhdGVkID0gdHJ1ZTtcbiAgICAgICAgICBjb250cm9sLnNldEFzeW5jVmFsaWRhdG9ycyh1cGRhdGVkQXN5bmNWYWxpZGF0b3JzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChoYW5kbGVPblZhbGlkYXRvckNoYW5nZSkge1xuICAgIC8vIENsZWFyIG9uVmFsaWRhdG9yQ2hhbmdlIGNhbGxiYWNrcyBieSBwcm92aWRpbmcgYSBub29wIGZ1bmN0aW9uLlxuICAgIGNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcbiAgICByZWdpc3Rlck9uVmFsaWRhdG9yQ2hhbmdlPFZhbGlkYXRvckZuPihkaXIuX3Jhd1ZhbGlkYXRvcnMsIG5vb3ApO1xuICAgIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2U8QXN5bmNWYWxpZGF0b3JGbj4oZGlyLl9yYXdBc3luY1ZhbGlkYXRvcnMsIG5vb3ApO1xuICB9XG5cbiAgcmV0dXJuIGlzQ29udHJvbFVwZGF0ZWQ7XG59XG5cbmZ1bmN0aW9uIHNldFVwVmlld0NoYW5nZVBpcGVsaW5lKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBkaXIudmFsdWVBY2Nlc3NvciEucmVnaXN0ZXJPbkNoYW5nZSgobmV3VmFsdWU6IGFueSkgPT4ge1xuICAgIGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGNvbnRyb2wuX3BlbmRpbmdDaGFuZ2UgPSB0cnVlO1xuICAgIGNvbnRyb2wuX3BlbmRpbmdEaXJ0eSA9IHRydWU7XG5cbiAgICBpZiAoY29udHJvbC51cGRhdGVPbiA9PT0gJ2NoYW5nZScpIHVwZGF0ZUNvbnRyb2woY29udHJvbCwgZGlyKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFVwQmx1clBpcGVsaW5lKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBkaXIudmFsdWVBY2Nlc3NvciEucmVnaXN0ZXJPblRvdWNoZWQoKCkgPT4ge1xuICAgIGNvbnRyb2wuX3BlbmRpbmdUb3VjaGVkID0gdHJ1ZTtcblxuICAgIGlmIChjb250cm9sLnVwZGF0ZU9uID09PSAnYmx1cicgJiYgY29udHJvbC5fcGVuZGluZ0NoYW5nZSkgdXBkYXRlQ29udHJvbChjb250cm9sLCBkaXIpO1xuICAgIGlmIChjb250cm9sLnVwZGF0ZU9uICE9PSAnc3VibWl0JykgY29udHJvbC5tYXJrQXNUb3VjaGVkKCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVDb250cm9sKGNvbnRyb2w6IEZvcm1Db250cm9sLCBkaXI6IE5nQ29udHJvbCk6IHZvaWQge1xuICBpZiAoY29udHJvbC5fcGVuZGluZ0RpcnR5KSBjb250cm9sLm1hcmtBc0RpcnR5KCk7XG4gIGNvbnRyb2wuc2V0VmFsdWUoY29udHJvbC5fcGVuZGluZ1ZhbHVlLCB7ZW1pdE1vZGVsVG9WaWV3Q2hhbmdlOiBmYWxzZX0pO1xuICBkaXIudmlld1RvTW9kZWxVcGRhdGUoY29udHJvbC5fcGVuZGluZ1ZhbHVlKTtcbiAgY29udHJvbC5fcGVuZGluZ0NoYW5nZSA9IGZhbHNlO1xufVxuXG5mdW5jdGlvbiBzZXRVcE1vZGVsQ2hhbmdlUGlwZWxpbmUoY29udHJvbDogRm9ybUNvbnRyb2wsIGRpcjogTmdDb250cm9sKTogdm9pZCB7XG4gIGNvbnN0IG9uQ2hhbmdlID0gKG5ld1ZhbHVlOiBhbnksIGVtaXRNb2RlbEV2ZW50OiBib29sZWFuKSA9PiB7XG4gICAgLy8gY29udHJvbCAtPiB2aWV3XG4gICAgZGlyLnZhbHVlQWNjZXNzb3IhLndyaXRlVmFsdWUobmV3VmFsdWUpO1xuXG4gICAgLy8gY29udHJvbCAtPiBuZ01vZGVsXG4gICAgaWYgKGVtaXRNb2RlbEV2ZW50KSBkaXIudmlld1RvTW9kZWxVcGRhdGUobmV3VmFsdWUpO1xuICB9O1xuICBjb250cm9sLnJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2UpO1xuXG4gIC8vIFJlZ2lzdGVyIGEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gY2xlYW51cCBvbkNoYW5nZSBoYW5kbGVyXG4gIC8vIGZyb20gYSBjb250cm9sIGluc3RhbmNlIHdoZW4gYSBkaXJlY3RpdmUgaXMgZGVzdHJveWVkLlxuICBkaXIuX3JlZ2lzdGVyT25EZXN0cm95KCgpID0+IHtcbiAgICBjb250cm9sLl91bnJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2UpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBMaW5rcyBhIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgaW5zdGFuY2UgYW5kIGNvcnJlc3BvbmRpbmcgRm9ybSBkaXJlY3RpdmUgYnkgc2V0dGluZyB1cCB2YWxpZGF0b3JzXG4gKiBwcmVzZW50IGluIHRoZSB2aWV3LlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgbGlua2VkLlxuICogQHBhcmFtIGRpciBEaXJlY3RpdmUgdGhhdCBwcm92aWRlcyB2aWV3IHZhbGlkYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRVcEZvcm1Db250YWluZXIoXG4gICAgY29udHJvbDogRm9ybUdyb3VwfEZvcm1BcnJheSwgZGlyOiBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZXxGb3JtQXJyYXlOYW1lKSB7XG4gIGlmIChjb250cm9sID09IG51bGwgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpXG4gICAgX3Rocm93RXJyb3IoZGlyLCAnQ2Fubm90IGZpbmQgY29udHJvbCB3aXRoJyk7XG4gIHNldFVwVmFsaWRhdG9ycyhjb250cm9sLCBkaXIsIC8qIGhhbmRsZU9uVmFsaWRhdG9yQ2hhbmdlICovIGZhbHNlKTtcbn1cblxuLyoqXG4gKiBSZXZlcnRzIHRoZSBzZXR1cCBwZXJmb3JtZWQgYnkgdGhlIGBzZXRVcEZvcm1Db250YWluZXJgIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSBjb250cm9sIEZvcm1Hcm91cCBvciBGb3JtQXJyYXkgaW5zdGFuY2UgdGhhdCBzaG91bGQgYmUgY2xlYW5lZCB1cC5cbiAqIEBwYXJhbSBkaXIgRGlyZWN0aXZlIHRoYXQgcHJvdmlkZWQgdmlldyB2YWxpZGF0b3JzLlxuICogQHJldHVybnMgdHJ1ZSBpZiBhIGNvbnRyb2wgd2FzIHVwZGF0ZWQgYXMgYSByZXN1bHQgb2YgdGhpcyBhY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhblVwRm9ybUNvbnRhaW5lcihcbiAgICBjb250cm9sOiBGb3JtR3JvdXB8Rm9ybUFycmF5LCBkaXI6IEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlfEZvcm1BcnJheU5hbWUpOiBib29sZWFuIHtcbiAgcmV0dXJuIGNsZWFuVXBWYWxpZGF0b3JzKGNvbnRyb2wsIGRpciwgLyogaGFuZGxlT25WYWxpZGF0b3JDaGFuZ2UgKi8gZmFsc2UpO1xufVxuXG5mdW5jdGlvbiBfbm9Db250cm9sRXJyb3IoZGlyOiBOZ0NvbnRyb2wpIHtcbiAgcmV0dXJuIF90aHJvd0Vycm9yKGRpciwgJ1RoZXJlIGlzIG5vIEZvcm1Db250cm9sIGluc3RhbmNlIGF0dGFjaGVkIHRvIGZvcm0gY29udHJvbCBlbGVtZW50IHdpdGgnKTtcbn1cblxuZnVuY3Rpb24gX3Rocm93RXJyb3IoZGlyOiBBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmUsIG1lc3NhZ2U6IHN0cmluZyk6IHZvaWQge1xuICBsZXQgbWVzc2FnZUVuZDogc3RyaW5nO1xuICBpZiAoZGlyLnBhdGghLmxlbmd0aCA+IDEpIHtcbiAgICBtZXNzYWdlRW5kID0gYHBhdGg6ICcke2Rpci5wYXRoIS5qb2luKCcgLT4gJyl9J2A7XG4gIH0gZWxzZSBpZiAoZGlyLnBhdGghWzBdKSB7XG4gICAgbWVzc2FnZUVuZCA9IGBuYW1lOiAnJHtkaXIucGF0aH0nYDtcbiAgfSBlbHNlIHtcbiAgICBtZXNzYWdlRW5kID0gJ3Vuc3BlY2lmaWVkIG5hbWUgYXR0cmlidXRlJztcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoYCR7bWVzc2FnZX0gJHttZXNzYWdlRW5kfWApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9wZXJ0eVVwZGF0ZWQoY2hhbmdlczoge1trZXk6IHN0cmluZ106IGFueX0sIHZpZXdNb2RlbDogYW55KTogYm9vbGVhbiB7XG4gIGlmICghY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnbW9kZWwnKSkgcmV0dXJuIGZhbHNlO1xuICBjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzWydtb2RlbCddO1xuXG4gIGlmIChjaGFuZ2UuaXNGaXJzdENoYW5nZSgpKSByZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuICFPYmplY3QuaXModmlld01vZGVsLCBjaGFuZ2UuY3VycmVudFZhbHVlKTtcbn1cblxuY29uc3QgQlVJTFRJTl9BQ0NFU1NPUlMgPSBbXG4gIENoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIFJhbmdlVmFsdWVBY2Nlc3NvcixcbiAgTnVtYmVyVmFsdWVBY2Nlc3NvcixcbiAgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IsXG4gIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3IsXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNCdWlsdEluQWNjZXNzb3IodmFsdWVBY2Nlc3NvcjogQ29udHJvbFZhbHVlQWNjZXNzb3IpOiBib29sZWFuIHtcbiAgcmV0dXJuIEJVSUxUSU5fQUNDRVNTT1JTLnNvbWUoYSA9PiB2YWx1ZUFjY2Vzc29yLmNvbnN0cnVjdG9yID09PSBhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5bmNQZW5kaW5nQ29udHJvbHMoZm9ybTogRm9ybUdyb3VwLCBkaXJlY3RpdmVzOiBOZ0NvbnRyb2xbXSk6IHZvaWQge1xuICBmb3JtLl9zeW5jUGVuZGluZ0NvbnRyb2xzKCk7XG4gIGRpcmVjdGl2ZXMuZm9yRWFjaChkaXIgPT4ge1xuICAgIGNvbnN0IGNvbnRyb2wgPSBkaXIuY29udHJvbCBhcyBGb3JtQ29udHJvbDtcbiAgICBpZiAoY29udHJvbC51cGRhdGVPbiA9PT0gJ3N1Ym1pdCcgJiYgY29udHJvbC5fcGVuZGluZ0NoYW5nZSkge1xuICAgICAgZGlyLnZpZXdUb01vZGVsVXBkYXRlKGNvbnRyb2wuX3BlbmRpbmdWYWx1ZSk7XG4gICAgICBjb250cm9sLl9wZW5kaW5nQ2hhbmdlID0gZmFsc2U7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gVE9ETzogdnNhdmtpbiByZW1vdmUgaXQgb25jZSBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMDExIGlzIGltcGxlbWVudGVkXG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0VmFsdWVBY2Nlc3NvcihcbiAgICBkaXI6IE5nQ29udHJvbCwgdmFsdWVBY2Nlc3NvcnM6IENvbnRyb2xWYWx1ZUFjY2Vzc29yW10pOiBDb250cm9sVmFsdWVBY2Nlc3NvcnxudWxsIHtcbiAgaWYgKCF2YWx1ZUFjY2Vzc29ycykgcmV0dXJuIG51bGw7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlQWNjZXNzb3JzKSAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSlcbiAgICBfdGhyb3dFcnJvcihkaXIsICdWYWx1ZSBhY2Nlc3NvciB3YXMgbm90IHByb3ZpZGVkIGFzIGFuIGFycmF5IGZvciBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuXG4gIGxldCBkZWZhdWx0QWNjZXNzb3I6IENvbnRyb2xWYWx1ZUFjY2Vzc29yfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgbGV0IGJ1aWx0aW5BY2Nlc3NvcjogQ29udHJvbFZhbHVlQWNjZXNzb3J8dW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICBsZXQgY3VzdG9tQWNjZXNzb3I6IENvbnRyb2xWYWx1ZUFjY2Vzc29yfHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICB2YWx1ZUFjY2Vzc29ycy5mb3JFYWNoKCh2OiBDb250cm9sVmFsdWVBY2Nlc3NvcikgPT4ge1xuICAgIGlmICh2LmNvbnN0cnVjdG9yID09PSBEZWZhdWx0VmFsdWVBY2Nlc3Nvcikge1xuICAgICAgZGVmYXVsdEFjY2Vzc29yID0gdjtcblxuICAgIH0gZWxzZSBpZiAoaXNCdWlsdEluQWNjZXNzb3IodikpIHtcbiAgICAgIGlmIChidWlsdGluQWNjZXNzb3IgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpXG4gICAgICAgIF90aHJvd0Vycm9yKGRpciwgJ01vcmUgdGhhbiBvbmUgYnVpbHQtaW4gdmFsdWUgYWNjZXNzb3IgbWF0Y2hlcyBmb3JtIGNvbnRyb2wgd2l0aCcpO1xuICAgICAgYnVpbHRpbkFjY2Vzc29yID0gdjtcblxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3VzdG9tQWNjZXNzb3IgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpXG4gICAgICAgIF90aHJvd0Vycm9yKGRpciwgJ01vcmUgdGhhbiBvbmUgY3VzdG9tIHZhbHVlIGFjY2Vzc29yIG1hdGNoZXMgZm9ybSBjb250cm9sIHdpdGgnKTtcbiAgICAgIGN1c3RvbUFjY2Vzc29yID0gdjtcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChjdXN0b21BY2Nlc3NvcikgcmV0dXJuIGN1c3RvbUFjY2Vzc29yO1xuICBpZiAoYnVpbHRpbkFjY2Vzc29yKSByZXR1cm4gYnVpbHRpbkFjY2Vzc29yO1xuICBpZiAoZGVmYXVsdEFjY2Vzc29yKSByZXR1cm4gZGVmYXVsdEFjY2Vzc29yO1xuXG4gIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICBfdGhyb3dFcnJvcihkaXIsICdObyB2YWxpZCB2YWx1ZSBhY2Nlc3NvciBmb3IgZm9ybSBjb250cm9sIHdpdGgnKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUxpc3RJdGVtPFQ+KGxpc3Q6IFRbXSwgZWw6IFQpOiB2b2lkIHtcbiAgY29uc3QgaW5kZXggPSBsaXN0LmluZGV4T2YoZWwpO1xuICBpZiAoaW5kZXggPiAtMSkgbGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xufVxuXG4vLyBUT0RPKGthcmEpOiByZW1vdmUgYWZ0ZXIgZGVwcmVjYXRpb24gcGVyaW9kXG5leHBvcnQgZnVuY3Rpb24gX25nTW9kZWxXYXJuaW5nKFxuICAgIG5hbWU6IHN0cmluZywgdHlwZToge19uZ01vZGVsV2FybmluZ1NlbnRPbmNlOiBib29sZWFufSxcbiAgICBpbnN0YW5jZToge19uZ01vZGVsV2FybmluZ1NlbnQ6IGJvb2xlYW59LCB3YXJuaW5nQ29uZmlnOiBzdHJpbmd8bnVsbCkge1xuICBpZiAod2FybmluZ0NvbmZpZyA9PT0gJ25ldmVyJykgcmV0dXJuO1xuXG4gIGlmICgoKHdhcm5pbmdDb25maWcgPT09IG51bGwgfHwgd2FybmluZ0NvbmZpZyA9PT0gJ29uY2UnKSAmJiAhdHlwZS5fbmdNb2RlbFdhcm5pbmdTZW50T25jZSkgfHxcbiAgICAgICh3YXJuaW5nQ29uZmlnID09PSAnYWx3YXlzJyAmJiAhaW5zdGFuY2UuX25nTW9kZWxXYXJuaW5nU2VudCkpIHtcbiAgICBSZWFjdGl2ZUVycm9ycy5uZ01vZGVsV2FybmluZyhuYW1lKTtcbiAgICB0eXBlLl9uZ01vZGVsV2FybmluZ1NlbnRPbmNlID0gdHJ1ZTtcbiAgICBpbnN0YW5jZS5fbmdNb2RlbFdhcm5pbmdTZW50ID0gdHJ1ZTtcbiAgfVxufVxuIl19