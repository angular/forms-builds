import * as i0 from "@angular/core";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
import { NgSelectOption, SelectControlValueAccessor } from './directives/select_control_value_accessor';
import { NgSelectMultipleOption, SelectMultipleControlValueAccessor } from './directives/select_multiple_control_value_accessor';
import { CheckboxRequiredValidator, EmailValidator, MaxLengthValidator, MinLengthValidator, PatternValidator, RequiredValidator } from './directives/validators';
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
export var SHARED_FORM_DIRECTIVES = [
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
];
export var TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
export var REACTIVE_DRIVEN_DIRECTIVES = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName];
/**
 * Internal module used for sharing directives between FormsModule and ReactiveFormsModule
 */
var InternalFormsSharedModule = /** @class */ (function () {
    function InternalFormsSharedModule() {
    }
    InternalFormsSharedModule.ngModuleDef = i0.ɵdefineNgModule({ type: InternalFormsSharedModule, bootstrap: [], declarations: [NgNoValidate,
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
            EmailValidator], imports: [], exports: [NgNoValidate,
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
            EmailValidator] });
    InternalFormsSharedModule.ngInjectorDef = i0.defineInjector({ factory: function InternalFormsSharedModule_Factory() { return new InternalFormsSharedModule(); }, providers: [], imports: [SHARED_FORM_DIRECTIVES] });
    return InternalFormsSharedModule;
}());
export { InternalFormsSharedModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsUUFBUSxFQUFPLE1BQU0sZUFBZSxDQUFDO0FBRTdDLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxvQkFBb0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQ3pFLE9BQU8sRUFBQyxlQUFlLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUNyRixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDNUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzlDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sdUNBQXVDLENBQUM7QUFDbkUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDdkUsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0sMkNBQTJDLENBQUM7QUFDcEYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0seURBQXlELENBQUM7QUFDN0YsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9EQUFvRCxDQUFDO0FBQ25GLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLHVEQUF1RCxDQUFDO0FBQ3pGLE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFDLE1BQU0sa0RBQWtELENBQUM7QUFDOUYsT0FBTyxFQUFDLGNBQWMsRUFBRSwwQkFBMEIsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ3RHLE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxrQ0FBa0MsRUFBQyxNQUFNLHFEQUFxRCxDQUFDO0FBQy9ILE9BQU8sRUFBQyx5QkFBeUIsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUUvSixPQUFPLEVBQUMsNEJBQTRCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUVsRixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUN6RSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JGLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDJDQUEyQyxDQUFDO0FBQ3BGLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ3JFLE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxrQ0FBa0MsRUFBQyxNQUFNLHlEQUF5RCxDQUFDO0FBQ2pJLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvREFBb0QsQ0FBQztBQUNuRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSx1REFBdUQsQ0FBQztBQUN6RixPQUFPLEVBQUMsYUFBYSxFQUFFLGFBQWEsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQzlGLE9BQU8sRUFBQyxjQUFjLEVBQUUsMEJBQTBCLEVBQUMsTUFBTSw0Q0FBNEMsQ0FBQztBQUN0RyxPQUFPLEVBQUMsc0JBQXNCLEVBQUUsa0NBQWtDLEVBQUMsTUFBTSxxREFBcUQsQ0FBQztBQUUvSCxNQUFNLENBQUMsSUFBTSxzQkFBc0IsR0FBZ0I7SUFDakQsWUFBWTtJQUNaLGNBQWM7SUFDZCxzQkFBc0I7SUFDdEIsb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQixrQkFBa0I7SUFDbEIsNEJBQTRCO0lBQzVCLDBCQUEwQjtJQUMxQixrQ0FBa0M7SUFDbEMseUJBQXlCO0lBQ3pCLGVBQWU7SUFDZixvQkFBb0I7SUFDcEIsaUJBQWlCO0lBQ2pCLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIsZ0JBQWdCO0lBQ2hCLHlCQUF5QjtJQUN6QixjQUFjO0NBQ2YsQ0FBQztBQUVGLE1BQU0sQ0FBQyxJQUFNLDBCQUEwQixHQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFFdkYsTUFBTSxDQUFDLElBQU0sMEJBQTBCLEdBQ25DLENBQUMsb0JBQW9CLEVBQUUsa0JBQWtCLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUU5Rjs7R0FFRztBQUNIO0lBQUE7S0FLQzt1RUFEWSx5QkFBeUIsZ0NBaENwQyxZQUFZO1lBQ1osY0FBYztZQUNkLHNCQUFzQjtZQUN0QixvQkFBb0I7WUFDcEIsbUJBQW1CO1lBQ25CLGtCQUFrQjtZQUNsQiw0QkFBNEI7WUFDNUIsMEJBQTBCO1lBQzFCLGtDQUFrQztZQUNsQyx5QkFBeUI7WUFDekIsZUFBZTtZQUNmLG9CQUFvQjtZQUNwQixpQkFBaUI7WUFDakIsa0JBQWtCO1lBQ2xCLGtCQUFrQjtZQUNsQixnQkFBZ0I7WUFDaEIseUJBQXlCO1lBQ3pCLGNBQWMsMEJBakJkLFlBQVk7WUFDWixjQUFjO1lBQ2Qsc0JBQXNCO1lBQ3RCLG9CQUFvQjtZQUNwQixtQkFBbUI7WUFDbkIsa0JBQWtCO1lBQ2xCLDRCQUE0QjtZQUM1QiwwQkFBMEI7WUFDMUIsa0NBQWtDO1lBQ2xDLHlCQUF5QjtZQUN6QixlQUFlO1lBQ2Ysb0JBQW9CO1lBQ3BCLGlCQUFpQjtZQUNqQixrQkFBa0I7WUFDbEIsa0JBQWtCO1lBQ2xCLGdCQUFnQjtZQUNoQix5QkFBeUI7WUFDekIsY0FBYztxSUFlSCx5QkFBeUIsZ0NBRjNCLHNCQUFzQjtvQ0E3RWpDO0NBZ0ZDLEFBTEQsSUFLQztTQURZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtOZ01vZHVsZSwgVHlwZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Q2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL2NoZWNrYm94X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7RGVmYXVsdFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9kZWZhdWx0X3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7TmdDb250cm9sU3RhdHVzLCBOZ0NvbnRyb2xTdGF0dXNHcm91cH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX2NvbnRyb2xfc3RhdHVzJztcbmltcG9ydCB7TmdGb3JtfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfZm9ybSc7XG5pbXBvcnQge05nTW9kZWx9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19tb2RlbCc7XG5pbXBvcnQge05nTW9kZWxHcm91cH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX21vZGVsX2dyb3VwJztcbmltcG9ydCB7TmdOb1ZhbGlkYXRlfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlJztcbmltcG9ydCB7TnVtYmVyVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL251bWJlcl92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge1JhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmltcG9ydCB7UmFuZ2VWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmFuZ2VfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtGb3JtQ29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZSc7XG5pbXBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX25hbWUnO1xuaW1wb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmltcG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9uYW1lJztcbmltcG9ydCB7TmdTZWxlY3RPcHRpb24sIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLCBTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2VsZWN0X211bHRpcGxlX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuaW1wb3J0IHtDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBFbWFpbFZhbGlkYXRvciwgTWF4TGVuZ3RoVmFsaWRhdG9yLCBNaW5MZW5ndGhWYWxpZGF0b3IsIFBhdHRlcm5WYWxpZGF0b3IsIFJlcXVpcmVkVmFsaWRhdG9yfSBmcm9tICcuL2RpcmVjdGl2ZXMvdmFsaWRhdG9ycyc7XG5cbmV4cG9ydCB7Q2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL2NoZWNrYm94X3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7RGVmYXVsdFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9kZWZhdWx0X3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7TmdDb250cm9sfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfY29udHJvbCc7XG5leHBvcnQge05nQ29udHJvbFN0YXR1cywgTmdDb250cm9sU3RhdHVzR3JvdXB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cyc7XG5leHBvcnQge05nRm9ybX0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX2Zvcm0nO1xuZXhwb3J0IHtOZ01vZGVsfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbW9kZWwnO1xuZXhwb3J0IHtOZ01vZGVsR3JvdXB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19tb2RlbF9ncm91cCc7XG5leHBvcnQge051bWJlclZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9udW1iZXJfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtSYWRpb0NvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmFkaW9fY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge1JhbmdlVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL3JhbmdlX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7Rm9ybUNvbnRyb2xEaXJlY3RpdmUsIE5HX01PREVMX1dJVEhfRk9STV9DT05UUk9MX1dBUk5JTkd9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9kaXJlY3RpdmUnO1xuZXhwb3J0IHtGb3JtQ29udHJvbE5hbWV9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fY29udHJvbF9uYW1lJztcbmV4cG9ydCB7Rm9ybUdyb3VwRGlyZWN0aXZlfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5leHBvcnQge0Zvcm1BcnJheU5hbWUsIEZvcm1Hcm91cE5hbWV9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfbmFtZSc7XG5leHBvcnQge05nU2VsZWN0T3B0aW9uLCBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL3NlbGVjdF9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7TmdTZWxlY3RNdWx0aXBsZU9wdGlvbiwgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL3NlbGVjdF9tdWx0aXBsZV9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcblxuZXhwb3J0IGNvbnN0IFNIQVJFRF9GT1JNX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID0gW1xuICBOZ05vVmFsaWRhdGUsXG4gIE5nU2VsZWN0T3B0aW9uLFxuICBOZ1NlbGVjdE11bHRpcGxlT3B0aW9uLFxuICBEZWZhdWx0VmFsdWVBY2Nlc3NvcixcbiAgTnVtYmVyVmFsdWVBY2Nlc3NvcixcbiAgUmFuZ2VWYWx1ZUFjY2Vzc29yLFxuICBDaGVja2JveENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICBTZWxlY3RDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgU2VsZWN0TXVsdGlwbGVDb250cm9sVmFsdWVBY2Nlc3NvcixcbiAgUmFkaW9Db250cm9sVmFsdWVBY2Nlc3NvcixcbiAgTmdDb250cm9sU3RhdHVzLFxuICBOZ0NvbnRyb2xTdGF0dXNHcm91cCxcbiAgUmVxdWlyZWRWYWxpZGF0b3IsXG4gIE1pbkxlbmd0aFZhbGlkYXRvcixcbiAgTWF4TGVuZ3RoVmFsaWRhdG9yLFxuICBQYXR0ZXJuVmFsaWRhdG9yLFxuICBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLFxuICBFbWFpbFZhbGlkYXRvcixcbl07XG5cbmV4cG9ydCBjb25zdCBURU1QTEFURV9EUklWRU5fRElSRUNUSVZFUzogVHlwZTxhbnk+W10gPSBbTmdNb2RlbCwgTmdNb2RlbEdyb3VwLCBOZ0Zvcm1dO1xuXG5leHBvcnQgY29uc3QgUkVBQ1RJVkVfRFJJVkVOX0RJUkVDVElWRVM6IFR5cGU8YW55PltdID1cbiAgICBbRm9ybUNvbnRyb2xEaXJlY3RpdmUsIEZvcm1Hcm91cERpcmVjdGl2ZSwgRm9ybUNvbnRyb2xOYW1lLCBGb3JtR3JvdXBOYW1lLCBGb3JtQXJyYXlOYW1lXTtcblxuLyoqXG4gKiBJbnRlcm5hbCBtb2R1bGUgdXNlZCBmb3Igc2hhcmluZyBkaXJlY3RpdmVzIGJldHdlZW4gRm9ybXNNb2R1bGUgYW5kIFJlYWN0aXZlRm9ybXNNb2R1bGVcbiAqL1xuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBTSEFSRURfRk9STV9ESVJFQ1RJVkVTLFxuICBleHBvcnRzOiBTSEFSRURfRk9STV9ESVJFQ1RJVkVTLFxufSlcbmV4cG9ydCBjbGFzcyBJbnRlcm5hbEZvcm1zU2hhcmVkTW9kdWxlIHtcbn1cbiJdfQ==