/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FormErrorExamples as Examples } from './error_examples';
export class TemplateDrivenErrors {
    /**
     * @return {?}
     */
    static modelParentException() {
        throw new Error(`
      ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
      formGroup's partner directive "formControlName" instead.  Example:

      ${Examples.formControlName}

      Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

      Example:

      ${Examples.ngModelWithFormGroup}`);
    }
    /**
     * @return {?}
     */
    static formGroupNameException() {
        throw new Error(`
      ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

      Option 1: Use formControlName instead of ngModel (reactive strategy):

      ${Examples.formGroupName}

      Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

      ${Examples.ngModelGroup}`);
    }
    /**
     * @return {?}
     */
    static missingNameException() {
        throw new Error(`If ngModel is used within a form tag, either the name attribute must be set or the form
      control must be defined as 'standalone' in ngModelOptions.

      Example 1: <input [(ngModel)]="person.firstName" name="first">
      Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
    }
    /**
     * @return {?}
     */
    static modelGroupParentException() {
        throw new Error(`
      ngModelGroup cannot be used with a parent formGroup directive.

      Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

      ${Examples.formGroupName}

      Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

      ${Examples.ngModelGroup}`);
    }
    /**
     * @return {?}
     */
    static ngFormWarning() {
        console.warn(`
    It looks like you're using 'ngForm'.

    Support for using the 'ngForm' element selector has been deprecated in Angular v6 and will be removed
    in Angular v9.

    Use 'ng-form' instead.

    Before:
    <ngForm #myForm="ngForm">

    After:
    <ng-form #myForm="ngForm">
    `);
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfZHJpdmVuX2Vycm9ycy5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL3RlbXBsYXRlX2RyaXZlbl9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsaUJBQWlCLElBQUksUUFBUSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFFL0QsTUFBTSxPQUFPLG9CQUFvQjs7OztJQUMvQixNQUFNLENBQUMsb0JBQW9CO1FBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUM7Ozs7UUFJWixRQUFRLENBQUMsZUFBZTs7Ozs7O1FBTXhCLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7S0FDdEM7Ozs7SUFFRCxNQUFNLENBQUMsc0JBQXNCO1FBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUM7Ozs7O1FBS1osUUFBUSxDQUFDLGFBQWE7Ozs7UUFJdEIsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7S0FDOUI7Ozs7SUFFRCxNQUFNLENBQUMsb0JBQW9CO1FBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQ1g7Ozs7OEZBSXNGLENBQUMsQ0FBQztLQUM3Rjs7OztJQUVELE1BQU0sQ0FBQyx5QkFBeUI7UUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQzs7Ozs7UUFLWixRQUFRLENBQUMsYUFBYTs7OztRQUl0QixRQUFRLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztLQUM5Qjs7OztJQUVELE1BQU0sQ0FBQyxhQUFhO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7S0FhWixDQUFDLENBQUM7S0FDSjtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Zvcm1FcnJvckV4YW1wbGVzIGFzIEV4YW1wbGVzfSBmcm9tICcuL2Vycm9yX2V4YW1wbGVzJztcblxuZXhwb3J0IGNsYXNzIFRlbXBsYXRlRHJpdmVuRXJyb3JzIHtcbiAgc3RhdGljIG1vZGVsUGFyZW50RXhjZXB0aW9uKCk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBuZ01vZGVsIGNhbm5vdCBiZSB1c2VkIHRvIHJlZ2lzdGVyIGZvcm0gY29udHJvbHMgd2l0aCBhIHBhcmVudCBmb3JtR3JvdXAgZGlyZWN0aXZlLiAgVHJ5IHVzaW5nXG4gICAgICBmb3JtR3JvdXAncyBwYXJ0bmVyIGRpcmVjdGl2ZSBcImZvcm1Db250cm9sTmFtZVwiIGluc3RlYWQuICBFeGFtcGxlOlxuXG4gICAgICAke0V4YW1wbGVzLmZvcm1Db250cm9sTmFtZX1cblxuICAgICAgT3IsIGlmIHlvdSdkIGxpa2UgdG8gYXZvaWQgcmVnaXN0ZXJpbmcgdGhpcyBmb3JtIGNvbnRyb2wsIGluZGljYXRlIHRoYXQgaXQncyBzdGFuZGFsb25lIGluIG5nTW9kZWxPcHRpb25zOlxuXG4gICAgICBFeGFtcGxlOlxuXG4gICAgICAke0V4YW1wbGVzLm5nTW9kZWxXaXRoRm9ybUdyb3VwfWApO1xuICB9XG5cbiAgc3RhdGljIGZvcm1Hcm91cE5hbWVFeGNlcHRpb24oKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBcbiAgICAgIG5nTW9kZWwgY2Fubm90IGJlIHVzZWQgdG8gcmVnaXN0ZXIgZm9ybSBjb250cm9scyB3aXRoIGEgcGFyZW50IGZvcm1Hcm91cE5hbWUgb3IgZm9ybUFycmF5TmFtZSBkaXJlY3RpdmUuXG5cbiAgICAgIE9wdGlvbiAxOiBVc2UgZm9ybUNvbnRyb2xOYW1lIGluc3RlYWQgb2YgbmdNb2RlbCAocmVhY3RpdmUgc3RyYXRlZ3kpOlxuXG4gICAgICAke0V4YW1wbGVzLmZvcm1Hcm91cE5hbWV9XG5cbiAgICAgIE9wdGlvbiAyOiAgVXBkYXRlIG5nTW9kZWwncyBwYXJlbnQgYmUgbmdNb2RlbEdyb3VwICh0ZW1wbGF0ZS1kcml2ZW4gc3RyYXRlZ3kpOlxuXG4gICAgICAke0V4YW1wbGVzLm5nTW9kZWxHcm91cH1gKTtcbiAgfVxuXG4gIHN0YXRpYyBtaXNzaW5nTmFtZUV4Y2VwdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJZiBuZ01vZGVsIGlzIHVzZWQgd2l0aGluIGEgZm9ybSB0YWcsIGVpdGhlciB0aGUgbmFtZSBhdHRyaWJ1dGUgbXVzdCBiZSBzZXQgb3IgdGhlIGZvcm1cbiAgICAgIGNvbnRyb2wgbXVzdCBiZSBkZWZpbmVkIGFzICdzdGFuZGFsb25lJyBpbiBuZ01vZGVsT3B0aW9ucy5cblxuICAgICAgRXhhbXBsZSAxOiA8aW5wdXQgWyhuZ01vZGVsKV09XCJwZXJzb24uZmlyc3ROYW1lXCIgbmFtZT1cImZpcnN0XCI+XG4gICAgICBFeGFtcGxlIDI6IDxpbnB1dCBbKG5nTW9kZWwpXT1cInBlcnNvbi5maXJzdE5hbWVcIiBbbmdNb2RlbE9wdGlvbnNdPVwie3N0YW5kYWxvbmU6IHRydWV9XCI+YCk7XG4gIH1cblxuICBzdGF0aWMgbW9kZWxHcm91cFBhcmVudEV4Y2VwdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFxuICAgICAgbmdNb2RlbEdyb3VwIGNhbm5vdCBiZSB1c2VkIHdpdGggYSBwYXJlbnQgZm9ybUdyb3VwIGRpcmVjdGl2ZS5cblxuICAgICAgT3B0aW9uIDE6IFVzZSBmb3JtR3JvdXBOYW1lIGluc3RlYWQgb2YgbmdNb2RlbEdyb3VwIChyZWFjdGl2ZSBzdHJhdGVneSk6XG5cbiAgICAgICR7RXhhbXBsZXMuZm9ybUdyb3VwTmFtZX1cblxuICAgICAgT3B0aW9uIDI6ICBVc2UgYSByZWd1bGFyIGZvcm0gdGFnIGluc3RlYWQgb2YgdGhlIGZvcm1Hcm91cCBkaXJlY3RpdmUgKHRlbXBsYXRlLWRyaXZlbiBzdHJhdGVneSk6XG5cbiAgICAgICR7RXhhbXBsZXMubmdNb2RlbEdyb3VwfWApO1xuICB9XG5cbiAgc3RhdGljIG5nRm9ybVdhcm5pbmcoKSB7XG4gICAgY29uc29sZS53YXJuKGBcbiAgICBJdCBsb29rcyBsaWtlIHlvdSdyZSB1c2luZyAnbmdGb3JtJy5cblxuICAgIFN1cHBvcnQgZm9yIHVzaW5nIHRoZSAnbmdGb3JtJyBlbGVtZW50IHNlbGVjdG9yIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gQW5ndWxhciB2NiBhbmQgd2lsbCBiZSByZW1vdmVkXG4gICAgaW4gQW5ndWxhciB2OS5cblxuICAgIFVzZSAnbmctZm9ybScgaW5zdGVhZC5cblxuICAgIEJlZm9yZTpcbiAgICA8bmdGb3JtICNteUZvcm09XCJuZ0Zvcm1cIj5cblxuICAgIEFmdGVyOlxuICAgIDxuZy1mb3JtICNteUZvcm09XCJuZ0Zvcm1cIj5cbiAgICBgKTtcbiAgfVxufVxuIl19