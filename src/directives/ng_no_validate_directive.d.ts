import * as i0 from "@angular/core";
/**
 * @description
 *
 * Adds `novalidate` attribute to all forms by default.
 *
 * `novalidate` is used to disable browser's native form validation.
 *
 * If you want to use native validation with Angular forms, just add `ngNativeValidate` attribute:
 *
 * ```
 * <form ngNativeValidate></form>
 * ```
 *
 * @publicApi
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 */
export declare class ɵNgNoValidate {
    static ngDirectiveDef: i0.ɵɵDirectiveDefWithMeta<ɵNgNoValidate, "form:not([ngNoForm]):not([ngNativeValidate])", never, {}, {}, never>;
}
export { ɵNgNoValidate as NgNoValidate };
