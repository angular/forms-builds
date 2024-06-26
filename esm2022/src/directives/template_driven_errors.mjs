/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ɵRuntimeError as RuntimeError } from '@angular/core';
import { formControlNameExample, formGroupNameExample, ngModelGroupExample, ngModelWithFormGroupExample, } from './error_examples';
export function modelParentException() {
    return new RuntimeError(1350 /* RuntimeErrorCode.NGMODEL_IN_FORM_GROUP */, `
    ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
    formGroup's partner directive "formControlName" instead.  Example:

    ${formControlNameExample}

    Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

    Example:

    ${ngModelWithFormGroupExample}`);
}
export function formGroupNameException() {
    return new RuntimeError(1351 /* RuntimeErrorCode.NGMODEL_IN_FORM_GROUP_NAME */, `
    ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

    Option 1: Use formControlName instead of ngModel (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

    ${ngModelGroupExample}`);
}
export function missingNameException() {
    return new RuntimeError(1352 /* RuntimeErrorCode.NGMODEL_WITHOUT_NAME */, `If ngModel is used within a form tag, either the name attribute must be set or the form
    control must be defined as 'standalone' in ngModelOptions.

    Example 1: <input [(ngModel)]="person.firstName" name="first">
    Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
}
export function modelGroupParentException() {
    return new RuntimeError(1353 /* RuntimeErrorCode.NGMODELGROUP_IN_FORM_GROUP */, `
    ngModelGroup cannot be used with a parent formGroup directive.

    Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

    ${ngModelGroupExample}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfZHJpdmVuX2Vycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3RlbXBsYXRlX2RyaXZlbl9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsSUFBSSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFJNUQsT0FBTyxFQUNMLHNCQUFzQixFQUN0QixvQkFBb0IsRUFDcEIsbUJBQW1CLEVBQ25CLDJCQUEyQixHQUM1QixNQUFNLGtCQUFrQixDQUFDO0FBRTFCLE1BQU0sVUFBVSxvQkFBb0I7SUFDbEMsT0FBTyxJQUFJLFlBQVksb0RBRXJCOzs7O01BSUUsc0JBQXNCOzs7Ozs7TUFNdEIsMkJBQTJCLEVBQUUsQ0FDaEMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVUsc0JBQXNCO0lBQ3BDLE9BQU8sSUFBSSxZQUFZLHlEQUVyQjs7Ozs7TUFLRSxvQkFBb0I7Ozs7TUFJcEIsbUJBQW1CLEVBQUUsQ0FDeEIsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVUsb0JBQW9CO0lBQ2xDLE9BQU8sSUFBSSxZQUFZLG1EQUVyQjs7Ozs0RkFJd0YsQ0FDekYsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVUseUJBQXlCO0lBQ3ZDLE9BQU8sSUFBSSxZQUFZLHlEQUVyQjs7Ozs7TUFLRSxvQkFBb0I7Ozs7TUFJcEIsbUJBQW1CLEVBQUUsQ0FDeEIsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHvJtVJ1bnRpbWVFcnJvciBhcyBSdW50aW1lRXJyb3J9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge1J1bnRpbWVFcnJvckNvZGV9IGZyb20gJy4uL2Vycm9ycyc7XG5cbmltcG9ydCB7XG4gIGZvcm1Db250cm9sTmFtZUV4YW1wbGUsXG4gIGZvcm1Hcm91cE5hbWVFeGFtcGxlLFxuICBuZ01vZGVsR3JvdXBFeGFtcGxlLFxuICBuZ01vZGVsV2l0aEZvcm1Hcm91cEV4YW1wbGUsXG59IGZyb20gJy4vZXJyb3JfZXhhbXBsZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbW9kZWxQYXJlbnRFeGNlcHRpb24oKTogRXJyb3Ige1xuICByZXR1cm4gbmV3IFJ1bnRpbWVFcnJvcihcbiAgICBSdW50aW1lRXJyb3JDb2RlLk5HTU9ERUxfSU5fRk9STV9HUk9VUCxcbiAgICBgXG4gICAgbmdNb2RlbCBjYW5ub3QgYmUgdXNlZCB0byByZWdpc3RlciBmb3JtIGNvbnRyb2xzIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwIGRpcmVjdGl2ZS4gIFRyeSB1c2luZ1xuICAgIGZvcm1Hcm91cCdzIHBhcnRuZXIgZGlyZWN0aXZlIFwiZm9ybUNvbnRyb2xOYW1lXCIgaW5zdGVhZC4gIEV4YW1wbGU6XG5cbiAgICAke2Zvcm1Db250cm9sTmFtZUV4YW1wbGV9XG5cbiAgICBPciwgaWYgeW91J2QgbGlrZSB0byBhdm9pZCByZWdpc3RlcmluZyB0aGlzIGZvcm0gY29udHJvbCwgaW5kaWNhdGUgdGhhdCBpdCdzIHN0YW5kYWxvbmUgaW4gbmdNb2RlbE9wdGlvbnM6XG5cbiAgICBFeGFtcGxlOlxuXG4gICAgJHtuZ01vZGVsV2l0aEZvcm1Hcm91cEV4YW1wbGV9YCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1Hcm91cE5hbWVFeGNlcHRpb24oKTogRXJyb3Ige1xuICByZXR1cm4gbmV3IFJ1bnRpbWVFcnJvcihcbiAgICBSdW50aW1lRXJyb3JDb2RlLk5HTU9ERUxfSU5fRk9STV9HUk9VUF9OQU1FLFxuICAgIGBcbiAgICBuZ01vZGVsIGNhbm5vdCBiZSB1c2VkIHRvIHJlZ2lzdGVyIGZvcm0gY29udHJvbHMgd2l0aCBhIHBhcmVudCBmb3JtR3JvdXBOYW1lIG9yIGZvcm1BcnJheU5hbWUgZGlyZWN0aXZlLlxuXG4gICAgT3B0aW9uIDE6IFVzZSBmb3JtQ29udHJvbE5hbWUgaW5zdGVhZCBvZiBuZ01vZGVsIChyZWFjdGl2ZSBzdHJhdGVneSk6XG5cbiAgICAke2Zvcm1Hcm91cE5hbWVFeGFtcGxlfVxuXG4gICAgT3B0aW9uIDI6ICBVcGRhdGUgbmdNb2RlbCdzIHBhcmVudCBiZSBuZ01vZGVsR3JvdXAgKHRlbXBsYXRlLWRyaXZlbiBzdHJhdGVneSk6XG5cbiAgICAke25nTW9kZWxHcm91cEV4YW1wbGV9YCxcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1pc3NpbmdOYW1lRXhjZXB0aW9uKCk6IEVycm9yIHtcbiAgcmV0dXJuIG5ldyBSdW50aW1lRXJyb3IoXG4gICAgUnVudGltZUVycm9yQ29kZS5OR01PREVMX1dJVEhPVVRfTkFNRSxcbiAgICBgSWYgbmdNb2RlbCBpcyB1c2VkIHdpdGhpbiBhIGZvcm0gdGFnLCBlaXRoZXIgdGhlIG5hbWUgYXR0cmlidXRlIG11c3QgYmUgc2V0IG9yIHRoZSBmb3JtXG4gICAgY29udHJvbCBtdXN0IGJlIGRlZmluZWQgYXMgJ3N0YW5kYWxvbmUnIGluIG5nTW9kZWxPcHRpb25zLlxuXG4gICAgRXhhbXBsZSAxOiA8aW5wdXQgWyhuZ01vZGVsKV09XCJwZXJzb24uZmlyc3ROYW1lXCIgbmFtZT1cImZpcnN0XCI+XG4gICAgRXhhbXBsZSAyOiA8aW5wdXQgWyhuZ01vZGVsKV09XCJwZXJzb24uZmlyc3ROYW1lXCIgW25nTW9kZWxPcHRpb25zXT1cIntzdGFuZGFsb25lOiB0cnVlfVwiPmAsXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb2RlbEdyb3VwUGFyZW50RXhjZXB0aW9uKCk6IEVycm9yIHtcbiAgcmV0dXJuIG5ldyBSdW50aW1lRXJyb3IoXG4gICAgUnVudGltZUVycm9yQ29kZS5OR01PREVMR1JPVVBfSU5fRk9STV9HUk9VUCxcbiAgICBgXG4gICAgbmdNb2RlbEdyb3VwIGNhbm5vdCBiZSB1c2VkIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwIGRpcmVjdGl2ZS5cblxuICAgIE9wdGlvbiAxOiBVc2UgZm9ybUdyb3VwTmFtZSBpbnN0ZWFkIG9mIG5nTW9kZWxHcm91cCAocmVhY3RpdmUgc3RyYXRlZ3kpOlxuXG4gICAgJHtmb3JtR3JvdXBOYW1lRXhhbXBsZX1cblxuICAgIE9wdGlvbiAyOiAgVXNlIGEgcmVndWxhciBmb3JtIHRhZyBpbnN0ZWFkIG9mIHRoZSBmb3JtR3JvdXAgZGlyZWN0aXZlICh0ZW1wbGF0ZS1kcml2ZW4gc3RyYXRlZ3kpOlxuXG4gICAgJHtuZ01vZGVsR3JvdXBFeGFtcGxlfWAsXG4gICk7XG59XG4iXX0=