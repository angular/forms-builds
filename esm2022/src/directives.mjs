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
import { RadioControlRegistryModule, RadioControlValueAccessor } from './directives/radio_control_value_accessor';
import { RangeValueAccessor } from './directives/range_value_accessor';
import { FormControlDirective } from './directives/reactive_directives/form_control_directive';
import { FormControlName } from './directives/reactive_directives/form_control_name';
import { FormGroupDirective } from './directives/reactive_directives/form_group_directive';
import { FormArrayName, FormGroupName } from './directives/reactive_directives/form_group_name';
import { NgSelectOption, SelectControlValueAccessor } from './directives/select_control_value_accessor';
import { NgSelectMultipleOption, SelectMultipleControlValueAccessor } from './directives/select_multiple_control_value_accessor';
import { CheckboxRequiredValidator, EmailValidator, MaxLengthValidator, MaxValidator, MinLengthValidator, MinValidator, PatternValidator, RequiredValidator } from './directives/validators';
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
export { FormControlDirective, NG_MODEL_WITH_FORM_CONTROL_WARNING } from './directives/reactive_directives/form_control_directive';
export { FormControlName } from './directives/reactive_directives/form_control_name';
export { FormGroupDirective } from './directives/reactive_directives/form_group_directive';
export { FormArrayName, FormGroupName } from './directives/reactive_directives/form_group_name';
export { NgSelectOption, SelectControlValueAccessor } from './directives/select_control_value_accessor';
export { NgSelectMultipleOption, SelectMultipleControlValueAccessor } from './directives/select_multiple_control_value_accessor';
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
export const REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
class ɵInternalFormsSharedModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-rc.2+sha-cc099e7", ngImport: i0, type: ɵInternalFormsSharedModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0-rc.2+sha-cc099e7", ngImport: i0, type: ɵInternalFormsSharedModule, declarations: [NgNoValidate,
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
            MaxValidator], imports: [RadioControlRegistryModule], exports: [NgNoValidate,
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
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0-rc.2+sha-cc099e7", ngImport: i0, type: ɵInternalFormsSharedModule, imports: [RadioControlRegistryModule] }); }
}
export { ɵInternalFormsSharedModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-rc.2+sha-cc099e7", ngImport: i0, type: ɵInternalFormsSharedModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: SHARED_FORM_DIRECTIVES,
                    imports: [RadioControlRegistryModule],
                    exports: SHARED_FORM_DIRECTIVES,
                }]
        }] });
export { ɵInternalFormsSharedModule as InternalFormsSharedModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQU8sTUFBTSxlQUFlLENBQUM7QUFFN0MsT0FBTyxFQUFDLDRCQUE0QixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDbEYsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0scUNBQXFDLENBQUM7QUFDekUsT0FBTyxFQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JGLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNuRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMsMEJBQTBCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUNoSCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx5REFBeUQsQ0FBQztBQUM3RixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0RBQW9ELENBQUM7QUFDbkYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDekYsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUM5RixPQUFPLEVBQUMsY0FBYyxFQUFFLDBCQUEwQixFQUFDLE1BQU0sNENBQTRDLENBQUM7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b0JBQW9CO1lBQ3BCLG1CQUFtQjtZQUNuQixrQkFBa0I7WUFDbEIsNEJBQTRCO1lBQzVCLDBCQUEwQjtZQUMxQixrQ0FBa0M7WUFDbEMseUJBQXlCO1lBQ3pCLGVBQWU7WUFDZixvQkFBb0I7WUFDcEIsaUJBQWlCO1lBQ2pCLGtCQUFrQjtZQUNsQixrQkFBa0I7WUFDbEIsZ0JBQWdCO1lBQ2hCLHlCQUF5QjtZQUN6QixjQUFjO1lBQ2QsWUFBWTtZQUNaLFlBQVk7MEhBZ0JELDBCQUEwQixZQUgzQiwwQkFBMEI7O1NBR3pCLDBCQUEwQjtzR0FBMUIsMEJBQTBCO2tCQUx0QyxRQUFRO21CQUFDO29CQUNSLFlBQVksRUFBRSxzQkFBc0I7b0JBQ3BDLE9BQU8sRUFBRSxDQUFDLDBCQUEwQixDQUFDO29CQUNyQyxPQUFPLEVBQUUsc0JBQXNCO2lCQUNoQzs7QUFJRCxPQUFPLEVBQUMsMEJBQTBCLElBQUkseUJBQXlCLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge05nTW9kdWxlLCBUeXBlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvY2hlY2tib3hfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtEZWZhdWx0VmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtOZ0NvbnRyb2xTdGF0dXMsIE5nQ29udHJvbFN0YXR1c0dyb3VwfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfY29udHJvbF9zdGF0dXMnO1xuaW1wb3J0IHtOZ0Zvcm19IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19mb3JtJztcbmltcG9ydCB7TmdNb2RlbH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX21vZGVsJztcbmltcG9ydCB7TmdNb2RlbEdyb3VwfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbW9kZWxfZ3JvdXAnO1xuaW1wb3J0IHtOZ05vVmFsaWRhdGV9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19ub192YWxpZGF0ZV9kaXJlY3RpdmUnO1xuaW1wb3J0IHtOdW1iZXJWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvbnVtYmVyX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7UmFkaW9Db250cm9sUmVnaXN0cnlNb2R1bGUsIFJhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7UmFuZ2VWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmFuZ2VfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtGb3JtQ29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX25hbWUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9uYW1lJztcbmltcG9ydCB7TmdTZWxlY3RPcHRpb24sIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLCBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2VsZWN0X211bHRpcGxlX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBFbWFpbFZhbGlkYXRvciwgTWF4TGVuZ3RoVmFsaWRhdG9yLCBNYXhWYWxpZGF0b3IsIE1pbkxlbmd0aFZhbGlkYXRvciwgTWluVmFsaWRhdG9yLCBQYXR0ZXJuVmFsaWRhdG9yLCBSZXF1aXJlZFZhbGlkYXRvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuXG5leHBvcnQge0NoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9jaGVja2JveF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0RlZmF1bHRWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvZGVmYXVsdF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge05nQ29udHJvbH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX2NvbnRyb2wnO1xuZXhwb3J0IHtOZ0NvbnRyb2xTdGF0dXMsIE5nQ29udHJvbFN0YXR1c0dyb3VwfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfY29udHJvbF9zdGF0dXMnO1xuZXhwb3J0IHtOZ0Zvcm19IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19mb3JtJztcbmV4cG9ydCB7TmdNb2RlbH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX21vZGVsJztcbmV4cG9ydCB7TmdNb2RlbEdyb3VwfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbW9kZWxfZ3JvdXAnO1xuZXhwb3J0IHtOdW1iZXJWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvbnVtYmVyX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7UmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtSYW5nZVZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yYW5nZV92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0Zvcm1Db250cm9sRGlyZWN0aXZlLCBOR19NT0RFTF9XSVRIX0ZPUk1fQ09OVFJPTF9XQVJOSU5HfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2NvbnRyb2xfZGlyZWN0aXZlJztcbmV4cG9ydCB7Rm9ybUNvbnRyb2xOYW1lfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2NvbnRyb2xfbmFtZSc7XG5leHBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuZXhwb3J0IHtGb3JtQXJyYXlOYW1lLCBGb3JtR3JvdXBOYW1lfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUnO1xuZXhwb3J0IHtOZ1NlbGVjdE9wdGlvbiwgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3RfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge05nU2VsZWN0TXVsdGlwbGVPcHRpb24sIFNlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0NBTExfU0VUX0RJU0FCTEVEX1NUQVRFfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2hhcmVkJztcblxuZXhwb3J0IGNvbnN0IFNIQVJFRF9GT1JNX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW1xuICBOZ05vVmFsaWRhdGUsXG4gIE5nU2VsZWN0T3B0aW9uLFxuICBOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLFxuICBEZWZhdWx0VmFsdWVBY2Nlc3NvcixcbiAgTnVtYmVyVmFsdWVBY2Nlc3NvcixcbiAgUmFuZ2VWYWx1ZUFjY2Vzc29yLFxuICBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcixcbiAgTmdDb250cm9sU3RhdHVzLFxuICBOZ0NvbnRyb2xTdGF0dXNHcm91cCxcbiAgUmVxdWlyZWRWYWxpZGF0b3IsXG4gIE1pbkxlbmd0aFZhbGlkYXRvcixcbiAgTWF4TGVuZ3RoVmFsaWRhdG9yLFxuICBQYXR0ZXJuVmFsaWRhdG9yLFxuICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICBFbWFpbFZhbGlkYXRvcixcbiAgTWluVmFsaWRhdG9yLFxuICBNYXhWYWxpZGF0b3IsXG5dO1xuXG5leHBvcnQgY29uc3QgVEVNUExBVEVfRFJJVkVOX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW05nTW9kZWwsIE5nTW9kZWxHcm91cCwgTmdGb3JtXTtcblxuZXhwb3J0IGNvbnN0IFJFQUNUSVZFX0RSSVZFTl9ESVJFQ1RJVkVTOiBUeXBlPGFueT5bXSA9XG4gICAgW0Zvcm1Db250cm9sRGlyZWN0aXZlLCBGb3JtR3JvdXBEaXJlY3RpdmUsIEZvcm1Db250cm9sTmFtZSwgRm9ybUdyb3VwTmFtZSwgRm9ybUFycmF5TmFtZV07XG5cbi8qKlxuICogSW50ZXJuYWwgbW9kdWxlIHVzZWQgZm9yIHNoYXJpbmcgZGlyZWN0aXZlcyBiZXR3ZWVuIEZvcm1zTW9kdWxlIGFuZCBSZWFjdGl2ZUZvcm1zTW9kdWxlXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogU0hBUkVEX0ZPUk1fRElSRUNUSVZFUyxcbiAgaW1wb3J0czogW1JhZGlvQ29udHJvbFJlZ2lzdHJ5TW9kdWxlXSxcbiAgZXhwb3J0czogU0hBUkVEX0ZPUk1fRElSRUNUSVZFUyxcbn0pXG5leHBvcnQgY2xhc3MgybVJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlIHtcbn1cblxuZXhwb3J0IHvJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGUgYXMgSW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZX07XG4iXX0=