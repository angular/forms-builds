/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { CheckboxControlValueAccessor } from './directives/checkbox_value_accessor';
import { DefaultValueAccessor } from './directives/default_value_accessor';
import { NgControlStatus, NgControlStatusGroup } from './directives/ng_control_status';
import { NgForm } from './directives/ng_form';
import { NgModel } from './directives/ng_model';
import { NgModelGroup } from './directives/ng_model_group';
import { NgNoValidate } from './directives/ng_no_validate_directive';
import { NumberValueAccessor } from './directives/number_value_accessor';
import { RadioControlValueAccessor } from './directives/radio_control_value_accessor';
import { RangeValueAccessor } from './directives/range_value_accessor';
import { FormControlDirective } from './directives/reactive_directives/form_control_directive';
import { FormControlName } from './directives/reactive_directives/form_control_name';
import { FormGroupDirective } from './directives/reactive_directives/form_group_directive';
import { FormArrayName, FormGroupName } from './directives/reactive_directives/form_group_name';
import { NgSelectOption, SelectControlValueAccessor, } from './directives/select_control_value_accessor';
import { NgSelectMultipleOption, SelectMultipleControlValueAccessor, } from './directives/select_multiple_control_value_accessor';
import { CheckboxRequiredValidator, EmailValidator, MaxLengthValidator, MaxValidator, MinLengthValidator, MinValidator, PatternValidator, RequiredValidator, } from './directives/validators';
import * as i0 from "@angular/core";
export { CheckboxControlValueAccessor } from './directives/checkbox_value_accessor';
export { DefaultValueAccessor } from './directives/default_value_accessor';
export { NgControl } from './directives/ng_control';
export { NgControlStatus, NgControlStatusGroup } from './directives/ng_control_status';
export { NgForm } from './directives/ng_form';
export { NgModel } from './directives/ng_model';
export { NgModelGroup } from './directives/ng_model_group';
export { NumberValueAccessor } from './directives/number_value_accessor';
export { RadioControlValueAccessor } from './directives/radio_control_value_accessor';
export { RangeValueAccessor } from './directives/range_value_accessor';
export { FormControlDirective, NG_MODEL_WITH_FORM_CONTROL_WARNING, } from './directives/reactive_directives/form_control_directive';
export { FormControlName } from './directives/reactive_directives/form_control_name';
export { FormGroupDirective } from './directives/reactive_directives/form_group_directive';
export { FormArrayName, FormGroupName } from './directives/reactive_directives/form_group_name';
export { NgSelectOption, SelectControlValueAccessor, } from './directives/select_control_value_accessor';
export { NgSelectMultipleOption, SelectMultipleControlValueAccessor, } from './directives/select_multiple_control_value_accessor';
export { CALL_SET_DISABLED_STATE } from './directives/shared';
export const SHARED_FORM_DIRECTIVES = [
    NgNoValidate,
    NgSelectOption,
    NgSelectMultipleOption,
    DefaultValueAccessor,
    NumberValueAccessor,
    RangeValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    SelectMultipleControlValueAccessor,
    RadioControlValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    MinLengthValidator,
    MaxLengthValidator,
    PatternValidator,
    CheckboxRequiredValidator,
    EmailValidator,
    MinValidator,
    MaxValidator,
];
export const TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
export const REACTIVE_DRIVEN_DIRECTIVES = [
    FormControlDirective,
    FormGroupDirective,
    FormControlName,
    FormGroupName,
    FormArrayName,
];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
export class ɵInternalFormsSharedModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: ɵInternalFormsSharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: ɵInternalFormsSharedModule, declarations: [NgNoValidate,
            NgSelectOption,
            NgSelectMultipleOption,
            DefaultValueAccessor,
            NumberValueAccessor,
            RangeValueAccessor,
            CheckboxControlValueAccessor,
            SelectControlValueAccessor,
            SelectMultipleControlValueAccessor,
            RadioControlValueAccessor,
            NgControlStatus,
            NgControlStatusGroup,
            RequiredValidator,
            MinLengthValidator,
            MaxLengthValidator,
            PatternValidator,
            CheckboxRequiredValidator,
            EmailValidator,
            MinValidator,
            MaxValidator], exports: [NgNoValidate,
            NgSelectOption,
            NgSelectMultipleOption,
            DefaultValueAccessor,
            NumberValueAccessor,
            RangeValueAccessor,
            CheckboxControlValueAccessor,
            SelectControlValueAccessor,
            SelectMultipleControlValueAccessor,
            RadioControlValueAccessor,
            NgControlStatus,
            NgControlStatusGroup,
            RequiredValidator,
            MinLengthValidator,
            MaxLengthValidator,
            PatternValidator,
            CheckboxRequiredValidator,
            EmailValidator,
            MinValidator,
            MaxValidator] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: ɵInternalFormsSharedModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.0.0-next.0+sha-f271021", ngImport: i0, type: ɵInternalFormsSharedModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: SHARED_FORM_DIRECTIVES,
                    exports: SHARED_FORM_DIRECTIVES,
                }]
        }] });
export { ɵInternalFormsSharedModule as InternalFormsSharedModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQU8sTUFBTSxlQUFlLENBQUM7QUFFN0MsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDbEYsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JGLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNuRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUNwRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx5REFBeUQsQ0FBQztBQUM3RixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0RBQW9ELENBQUM7QUFDbkYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDekYsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUM5RixPQUFPLEVBQ0wsY0FBYyxFQUNkLDBCQUEwQixHQUMzQixNQUFNLDRDQUE0QyxDQUFDO0FBQ3BELE9BQU8s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QjtZQUNwQixtQkFBbUI7WUFDbkIsa0JBQWtCO1lBQ2xCLDRCQUE0QjtZQUM1QiwwQkFBMEI7WUFDMUIsa0NBQWtDO1lBQ2xDLHlCQUF5QjtZQUN6QixlQUFlO1lBQ2Ysb0JBQW9CO1lBQ3BCLGlCQUFpQjtZQUNqQixrQkFBa0I7WUFDbEIsa0JBQWtCO1lBQ2xCLGdCQUFnQjtZQUNoQix5QkFBeUI7WUFDekIsY0FBYztZQUNkLFlBQVk7WUFDWixZQUFZOzBIQW9CRCwwQkFBMEI7O3NHQUExQiwwQkFBMEI7a0JBSnRDLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLHNCQUFzQjtvQkFDcEMsT0FBTyxFQUFFLHNCQUFzQjtpQkFDaEM7O0FBR0QsT0FBTyxFQUFDLDBCQUEwQixJQUFJLHlCQUF5QixFQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZSwgVHlwZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Q2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL2NoZWNrYm94X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7RGVmYXVsdFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9kZWZhdWx0X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TmdDb250cm9sU3RhdHVzLCBOZ0NvbnRyb2xTdGF0dXNHcm91cH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX2NvbnRyb2xfc3RhdHVzJztcbmltcG9ydCB7TmdGb3JtfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfZm9ybSc7XG5pbXBvcnQge05nTW9kZWx9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19tb2RlbCc7XG5pbXBvcnQge05nTW9kZWxHcm91cH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX21vZGVsX2dyb3VwJztcbmltcG9ydCB7TmdOb1ZhbGlkYXRlfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlJztcbmltcG9ydCB7TnVtYmVyVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL251bWJlcl92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1JhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7UmFuZ2VWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmFuZ2VfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtGb3JtQ29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX25hbWUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9uYW1lJztcbmltcG9ydCB7XG4gIE5nU2VsZWN0T3B0aW9uLFxuICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcixcbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3NlbGVjdF9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7XG4gIE5nU2VsZWN0TXVsdGlwbGVPcHRpb24sXG4gIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IsXG59IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1xuICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICBFbWFpbFZhbGlkYXRvcixcbiAgTWF4TGVuZ3RoVmFsaWRhdG9yLFxuICBNYXhWYWxpZGF0b3IsXG4gIE1pbkxlbmd0aFZhbGlkYXRvcixcbiAgTWluVmFsaWRhdG9yLFxuICBQYXR0ZXJuVmFsaWRhdG9yLFxuICBSZXF1aXJlZFZhbGlkYXRvcixcbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuXG5leHBvcnQge0NoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9jaGVja2JveF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0RlZmF1bHRWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX2NvbnRyb2wnO1xuZXhwb3J0IHtOZ0NvbnRyb2xTdGF0dXMsIE5nQ29udHJvbFN0YXR1c0dyb3VwfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfY29udHJvbF9zdGF0dXMnO1xuZXhwb3J0IHtOZ0Zvcm19IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19mb3JtJztcbmV4cG9ydCB7TmdNb2RlbH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX21vZGVsJztcbmV4cG9ydCB7TmdNb2RlbEdyb3VwfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbW9kZWxfZ3JvdXAnO1xuZXhwb3J0IHtOdW1iZXJWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvbnVtYmVyX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7UmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtSYW5nZVZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yYW5nZV92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge1xuICBGb3JtQ29udHJvbERpcmVjdGl2ZSxcbiAgTkdfTU9ERUxfV0lUSF9GT1JNX0NPTlRST0xfV0FSTklORyxcbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZSc7XG5leHBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX25hbWUnO1xuZXhwb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmV4cG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9uYW1lJztcbmV4cG9ydCB7XG4gIE5nU2VsZWN0T3B0aW9uLFxuICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcixcbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3NlbGVjdF9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7XG4gIE5nU2VsZWN0TXVsdGlwbGVPcHRpb24sXG4gIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3IsXG59IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0NBTExfU0VUX0RJU0FCTEVEX1NUQVRFfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2hhcmVkJztcblxuZXhwb3J0IGNvbnN0IFNIQVJFRF9GT1JNX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW1xuICBOZ05vVmFsaWRhdGUsXG4gIE5nU2VsZWN0T3B0aW9uLFxuICBOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLFxuICBEZWZhdWx0VmFsdWVBY2Nlc3NvcixcbiAgTnVtYmVyVmFsdWVBY2Nlc3NvcixcbiAgUmFuZ2VWYWx1ZUFjY2Vzc29yLFxuICBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcixcbiAgTmdDb250cm9sU3RhdHVzLFxuICBOZ0NvbnRyb2xTdGF0dXNHcm91cCxcbiAgUmVxdWlyZWRWYWxpZGF0b3IsXG4gIE1pbkxlbmd0aFZhbGlkYXRvcixcbiAgTWF4TGVuZ3RoVmFsaWRhdG9yLFxuICBQYXR0ZXJuVmFsaWRhdG9yLFxuICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICBFbWFpbFZhbGlkYXRvcixcbiAgTWluVmFsaWRhdG9yLFxuICBNYXhWYWxpZGF0b3IsXG5dO1xuXG5leHBvcnQgY29uc3QgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW05nTW9kZWwsIE5nTW9kZWxHcm91cCwgTmdGb3JtXTtcblxuZXhwb3J0IGNvbnN0IFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9IFtcbiAgRm9ybUNvbnRyb2xEaXJlY3RpdmUsXG4gIEZvcm1Hcm91cERpcmVjdGl2ZSxcbiAgRm9ybUNvbnRyb2xOYW1lLFxuICBGb3JtR3JvdXBOYW1lLFxuICBGb3JtQXJyYXlOYW1lLFxuXTtcblxuLyoqXG4gKiBJbnRlcm5hbCBtb2R1bGUgdXNlZCBmb3Igc2hhcmluZyBkaXJlY3RpdmVzIGJldHdlZW4gRm9ybXNNb2R1bGUgYW5kIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBTSEFSRURfRk9STV9ESVJFQ1RJVkVTLFxuICBleHBvcnRzOiBTSEFSRURfRk9STV9ESVJFQ1RJVkVTLFxufSlcbmV4cG9ydCBjbGFzcyDJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUge31cblxuZXhwb3J0IHvJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUgYXMgSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZX07XG4iXX0=