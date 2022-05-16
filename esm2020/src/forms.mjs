/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @module
 * @description
 * This module is used for handling user input, by defining and building a `FormGroup` that
 * consists of `FormControl` objects, and mapping them onto the DOM. `FormControl`
 * objects can then be used to read information from the form DOM elements.
 *
 * Forms providers are not included in default providers; you must import these providers
 * explicitly.
 */
export { ɵInternalFormsSharedModule } from './directives';
export { AbstractControlDirective } from './directives/abstract_control_directive';
export { AbstractFormGroupDirective } from './directives/abstract_form_group_directive';
export { CheckboxControlValueAccessor } from './directives/checkbox_value_accessor';
export { ControlContainer } from './directives/control_container';
export { NG_VALUE_ACCESSOR } from './directives/control_value_accessor';
export { COMPOSITION_BUFFER_MODE, DefaultValueAccessor } from './directives/default_value_accessor';
export { NgControl } from './directives/ng_control';
export { NgControlStatus, NgControlStatusGroup } from './directives/ng_control_status';
export { NgForm } from './directives/ng_form';
export { NgModel } from './directives/ng_model';
export { NgModelGroup } from './directives/ng_model_group';
export { ɵNgNoValidate } from './directives/ng_no_validate_directive';
export { NumberValueAccessor } from './directives/number_value_accessor';
export { RadioControlValueAccessor } from './directives/radio_control_value_accessor';
export { RangeValueAccessor } from './directives/range_value_accessor';
export { FormControlDirective } from './directives/reactive_directives/form_control_directive';
export { FormControlName } from './directives/reactive_directives/form_control_name';
export { FormGroupDirective } from './directives/reactive_directives/form_group_directive';
export { FormArrayName, FormGroupName } from './directives/reactive_directives/form_group_name';
export { NgSelectOption, SelectControlValueAccessor } from './directives/select_control_value_accessor';
export { SelectMultipleControlValueAccessor, ɵNgSelectMultipleOption } from './directives/select_multiple_control_value_accessor';
export { CheckboxRequiredValidator, EmailValidator, MaxLengthValidator, MaxValidator, MinLengthValidator, MinValidator, PatternValidator, RequiredValidator } from './directives/validators';
export { FormBuilder, NonNullableFormBuilder, UntypedFormBuilder } from './form_builder';
export { AbstractControl } from './model/abstract_model';
export { FormArray, UntypedFormArray } from './model/form_array';
export { FormControl, UntypedFormControl } from './model/form_control';
export { FormGroup, FormRecord, UntypedFormGroup } from './model/form_group';
export { NG_ASYNC_VALIDATORS, NG_VALIDATORS, Validators } from './validators';
export { VERSION } from './version';
export * from './form_providers';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7OztHQVNHO0FBRUgsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pGLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ3RGLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ2hFLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RixPQUFPLEVBQUMsdUJBQXVCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUVsRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JGLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUNwRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx5REFBeUQsQ0FBQztBQUM3RixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0RBQW9ELENBQUM7QUFDbkYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDekYsT0FBTyxFQUFDLGFBQWEsRUFBRSxhQUFhLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUM5RixPQUFPLEVBQUMsY0FBYyxFQUFFLDBCQUEwQixFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDdEcsT0FBTyxFQUFDLGtDQUFrQyxFQUFFLHVCQUF1QixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDaEksT0FBTyxFQUFtQyx5QkFBeUIsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsWUFBWSxFQUFFLGtCQUFrQixFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBMkMsTUFBTSx5QkFBeUIsQ0FBQztBQUN2USxPQUFPLEVBQUMsV0FBVyxFQUFFLHNCQUFzQixFQUFFLGtCQUFrQixFQUFXLE1BQU0sZ0JBQWdCLENBQUM7QUFDakcsT0FBTyxFQUFDLGVBQWUsRUFBcUosTUFBTSx3QkFBd0IsQ0FBQztBQUMzTSxPQUFPLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFzQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3BHLE9BQU8sRUFBQyxXQUFXLEVBQXdDLGtCQUFrQixFQUFtQixNQUFNLHNCQUFzQixDQUFDO0FBQzdILE9BQU8sRUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFxRCxNQUFNLG9CQUFvQixDQUFDO0FBQy9ILE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEMsY0FBYyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBtb2R1bGUgaXMgdXNlZCBmb3IgaGFuZGxpbmcgdXNlciBpbnB1dCwgYnkgZGVmaW5pbmcgYW5kIGJ1aWxkaW5nIGEgYEZvcm1Hcm91cGAgdGhhdFxuICogY29uc2lzdHMgb2YgYEZvcm1Db250cm9sYCBvYmplY3RzLCBhbmQgbWFwcGluZyB0aGVtIG9udG8gdGhlIERPTS4gYEZvcm1Db250cm9sYFxuICogb2JqZWN0cyBjYW4gdGhlbiBiZSB1c2VkIHRvIHJlYWQgaW5mb3JtYXRpb24gZnJvbSB0aGUgZm9ybSBET00gZWxlbWVudHMuXG4gKlxuICogRm9ybXMgcHJvdmlkZXJzIGFyZSBub3QgaW5jbHVkZWQgaW4gZGVmYXVsdCBwcm92aWRlcnM7IHlvdSBtdXN0IGltcG9ydCB0aGVzZSBwcm92aWRlcnNcbiAqIGV4cGxpY2l0bHkuXG4gKi9cblxuZXhwb3J0IHvJtUludGVybmFsRm9ybXNTaGFyZWRNb2R1bGV9IGZyb20gJy4vZGlyZWN0aXZlcyc7XG5leHBvcnQge0Fic3RyYWN0Q29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL2Fic3RyYWN0X2NvbnRyb2xfZGlyZWN0aXZlJztcbmV4cG9ydCB7QWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZGlyZWN0aXZlcy9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZSc7XG5leHBvcnQge0NoZWNrYm94Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9jaGVja2JveF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vZGlyZWN0aXZlcy9jb250cm9sX2NvbnRhaW5lcic7XG5leHBvcnQge0NvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUn0gZnJvbSAnLi9kaXJlY3RpdmVzL2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtDT01QT1NJVElPTl9CVUZGRVJfTU9ERSwgRGVmYXVsdFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9kZWZhdWx0X3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7Rm9ybX0gZnJvbSAnLi9kaXJlY3RpdmVzL2Zvcm1faW50ZXJmYWNlJztcbmV4cG9ydCB7TmdDb250cm9sfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfY29udHJvbCc7XG5leHBvcnQge05nQ29udHJvbFN0YXR1cywgTmdDb250cm9sU3RhdHVzR3JvdXB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19jb250cm9sX3N0YXR1cyc7XG5leHBvcnQge05nRm9ybX0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX2Zvcm0nO1xuZXhwb3J0IHtOZ01vZGVsfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbW9kZWwnO1xuZXhwb3J0IHtOZ01vZGVsR3JvdXB9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19tb2RlbF9ncm91cCc7XG5leHBvcnQge8m1TmdOb1ZhbGlkYXRlfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfbm9fdmFsaWRhdGVfZGlyZWN0aXZlJztcbmV4cG9ydCB7TnVtYmVyVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL251bWJlcl92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge1JhZGlvQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yYWRpb19jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7UmFuZ2VWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmFuZ2VfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtGb3JtQ29udHJvbERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX2RpcmVjdGl2ZSc7XG5leHBvcnQge0Zvcm1Db250cm9sTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9jb250cm9sX25hbWUnO1xuZXhwb3J0IHtGb3JtR3JvdXBEaXJlY3RpdmV9IGZyb20gJy4vZGlyZWN0aXZlcy9yZWFjdGl2ZV9kaXJlY3RpdmVzL2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmV4cG9ydCB7Rm9ybUFycmF5TmFtZSwgRm9ybUdyb3VwTmFtZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9uYW1lJztcbmV4cG9ydCB7TmdTZWxlY3RPcHRpb24sIFNlbGVjdENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvc2VsZWN0X2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtTZWxlY3RNdWx0aXBsZUNvbnRyb2xWYWx1ZUFjY2Vzc29yLCDJtU5nU2VsZWN0TXVsdGlwbGVPcHRpb259IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBDaGVja2JveFJlcXVpcmVkVmFsaWRhdG9yLCBFbWFpbFZhbGlkYXRvciwgTWF4TGVuZ3RoVmFsaWRhdG9yLCBNYXhWYWxpZGF0b3IsIE1pbkxlbmd0aFZhbGlkYXRvciwgTWluVmFsaWRhdG9yLCBQYXR0ZXJuVmFsaWRhdG9yLCBSZXF1aXJlZFZhbGlkYXRvciwgVmFsaWRhdGlvbkVycm9ycywgVmFsaWRhdG9yLCBWYWxpZGF0b3JGbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3ZhbGlkYXRvcnMnO1xuZXhwb3J0IHtGb3JtQnVpbGRlciwgTm9uTnVsbGFibGVGb3JtQnVpbGRlciwgVW50eXBlZEZvcm1CdWlsZGVyLCDJtUVsZW1lbnR9IGZyb20gJy4vZm9ybV9idWlsZGVyJztcbmV4cG9ydCB7QWJzdHJhY3RDb250cm9sLCBBYnN0cmFjdENvbnRyb2xPcHRpb25zLCBGb3JtQ29udHJvbFN0YXR1cywgUmF3VmFsdWUsIFZhbHVlLCDJtUNvZXJjZVN0ckFyclRvTnVtQXJyLCDJtUdldFByb3BlcnR5LCDJtU5hdmlnYXRlLCDJtVRva2VuaXplLCDJtVR5cGVkT3JVbnR5cGVkLCDJtVdyaXRlYWJsZX0gZnJvbSAnLi9tb2RlbC9hYnN0cmFjdF9tb2RlbCc7XG5leHBvcnQge0Zvcm1BcnJheSwgVW50eXBlZEZvcm1BcnJheSwgybVGb3JtQXJyYXlSYXdWYWx1ZSwgybVGb3JtQXJyYXlWYWx1ZX0gZnJvbSAnLi9tb2RlbC9mb3JtX2FycmF5JztcbmV4cG9ydCB7Rm9ybUNvbnRyb2wsIEZvcm1Db250cm9sT3B0aW9ucywgRm9ybUNvbnRyb2xTdGF0ZSwgVW50eXBlZEZvcm1Db250cm9sLCDJtUZvcm1Db250cm9sQ3Rvcn0gZnJvbSAnLi9tb2RlbC9mb3JtX2NvbnRyb2wnO1xuZXhwb3J0IHtGb3JtR3JvdXAsIEZvcm1SZWNvcmQsIFVudHlwZWRGb3JtR3JvdXAsIMm1Rm9ybUdyb3VwUmF3VmFsdWUsIMm1Rm9ybUdyb3VwVmFsdWUsIMm1T3B0aW9uYWxLZXlzfSBmcm9tICcuL21vZGVsL2Zvcm1fZ3JvdXAnO1xuZXhwb3J0IHtOR19BU1lOQ19WQUxJREFUT1JTLCBOR19WQUxJREFUT1JTLCBWYWxpZGF0b3JzfSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuZXhwb3J0IHtWRVJTSU9OfSBmcm9tICcuL3ZlcnNpb24nO1xuXG5leHBvcnQgKiBmcm9tICcuL2Zvcm1fcHJvdmlkZXJzJztcbiJdfQ==