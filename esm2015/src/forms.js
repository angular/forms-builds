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
export { FormArrayName } from './directives/reactive_directives/form_group_name';
export { FormGroupName } from './directives/reactive_directives/form_group_name';
export { NgSelectOption, SelectControlValueAccessor } from './directives/select_control_value_accessor';
export { SelectMultipleControlValueAccessor } from './directives/select_multiple_control_value_accessor';
export { ɵNgSelectMultipleOption } from './directives/select_multiple_control_value_accessor';
export { CheckboxRequiredValidator, EmailValidator, MaxLengthValidator, MinLengthValidator, PatternValidator, RequiredValidator } from './directives/validators';
export { FormBuilder } from './form_builder';
export { AbstractControl, FormArray, FormControl, FormGroup } from './model';
export { NG_ASYNC_VALIDATORS, NG_VALIDATORS, Validators } from './validators';
export { VERSION } from './version';
export * from './form_providers';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZm9ybXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7OztHQVNHO0FBR0gsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQ3hELE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLHlDQUF5QyxDQUFDO0FBQ2pGLE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLDRDQUE0QyxDQUFDO0FBQ3RGLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ2hFLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RixPQUFPLEVBQUMsdUJBQXVCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUVsRyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0seUJBQXlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBQ3JGLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUM1QyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ3pELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNwRSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUN2RSxPQUFPLEVBQUMseUJBQXlCLEVBQUMsTUFBTSwyQ0FBMkMsQ0FBQztBQUNwRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUNyRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx5REFBeUQsQ0FBQztBQUM3RixPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0RBQW9ELENBQUM7QUFDbkYsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sdURBQXVELENBQUM7QUFDekYsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtEQUFrRCxDQUFDO0FBQy9FLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxrREFBa0QsQ0FBQztBQUMvRSxPQUFPLEVBQUMsY0FBYyxFQUFFLDBCQUEwQixFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDdEcsT0FBTyxFQUFDLGtDQUFrQyxFQUFDLE1BQU0scURBQXFELENBQUM7QUFDdkcsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0scURBQXFELENBQUM7QUFDNUYsT0FBTyxFQUFtQyx5QkFBeUIsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQTJDLE1BQU0seUJBQXlCLENBQUM7QUFDM08sT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxlQUFlLEVBQTBCLFNBQVMsRUFBRSxXQUFXLEVBQUUsU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ25HLE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzVFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFbEMsY0FBYyxrQkFBa0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBtb2R1bGUgaXMgdXNlZCBmb3IgaGFuZGxpbmcgdXNlciBpbnB1dCwgYnkgZGVmaW5pbmcgYW5kIGJ1aWxkaW5nIGEgYEZvcm1Hcm91cGAgdGhhdFxuICogY29uc2lzdHMgb2YgYEZvcm1Db250cm9sYCBvYmplY3RzLCBhbmQgbWFwcGluZyB0aGVtIG9udG8gdGhlIERPTS4gYEZvcm1Db250cm9sYFxuICogb2JqZWN0cyBjYW4gdGhlbiBiZSB1c2VkIHRvIHJlYWQgaW5mb3JtYXRpb24gZnJvbSB0aGUgZm9ybSBET00gZWxlbWVudHMuXG4gKlxuICogRm9ybXMgcHJvdmlkZXJzIGFyZSBub3QgaW5jbHVkZWQgaW4gZGVmYXVsdCBwcm92aWRlcnM7IHlvdSBtdXN0IGltcG9ydCB0aGVzZSBwcm92aWRlcnNcbiAqIGV4cGxpY2l0bHkuXG4gKi9cblxuXG5leHBvcnQge8m1SW50ZXJuYWxGb3Jtc1NoYXJlZE1vZHVsZX0gZnJvbSAnLi9kaXJlY3RpdmVzJztcbmV4cG9ydCB7QWJzdHJhY3RDb250cm9sRGlyZWN0aXZlfSBmcm9tICcuL2RpcmVjdGl2ZXMvYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuZXhwb3J0IHtBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL2Fic3RyYWN0X2Zvcm1fZ3JvdXBfZGlyZWN0aXZlJztcbmV4cG9ydCB7Q2hlY2tib3hDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL2NoZWNrYm94X3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9kaXJlY3RpdmVzL2NvbnRyb2xfY29udGFpbmVyJztcbmV4cG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICcuL2RpcmVjdGl2ZXMvY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0NPTVBPU0lUSU9OX0JVRkZFUl9NT0RFLCBEZWZhdWx0VmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL2RlZmF1bHRfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtGb3JtfSBmcm9tICcuL2RpcmVjdGl2ZXMvZm9ybV9pbnRlcmZhY2UnO1xuZXhwb3J0IHtOZ0NvbnRyb2x9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19jb250cm9sJztcbmV4cG9ydCB7TmdDb250cm9sU3RhdHVzLCBOZ0NvbnRyb2xTdGF0dXNHcm91cH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX2NvbnRyb2xfc3RhdHVzJztcbmV4cG9ydCB7TmdGb3JtfSBmcm9tICcuL2RpcmVjdGl2ZXMvbmdfZm9ybSc7XG5leHBvcnQge05nTW9kZWx9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19tb2RlbCc7XG5leHBvcnQge05nTW9kZWxHcm91cH0gZnJvbSAnLi9kaXJlY3RpdmVzL25nX21vZGVsX2dyb3VwJztcbmV4cG9ydCB7ybVOZ05vVmFsaWRhdGV9IGZyb20gJy4vZGlyZWN0aXZlcy9uZ19ub192YWxpZGF0ZV9kaXJlY3RpdmUnO1xuZXhwb3J0IHtOdW1iZXJWYWx1ZUFjY2Vzc29yfSBmcm9tICcuL2RpcmVjdGl2ZXMvbnVtYmVyX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7UmFkaW9Db250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnLi9kaXJlY3RpdmVzL3JhZGlvX2NvbnRyb2xfdmFsdWVfYWNjZXNzb3InO1xuZXhwb3J0IHtSYW5nZVZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9yYW5nZV92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge0Zvcm1Db250cm9sRGlyZWN0aXZlfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2NvbnRyb2xfZGlyZWN0aXZlJztcbmV4cG9ydCB7Rm9ybUNvbnRyb2xOYW1lfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2NvbnRyb2xfbmFtZSc7XG5leHBvcnQge0Zvcm1Hcm91cERpcmVjdGl2ZX0gZnJvbSAnLi9kaXJlY3RpdmVzL3JlYWN0aXZlX2RpcmVjdGl2ZXMvZm9ybV9ncm91cF9kaXJlY3RpdmUnO1xuZXhwb3J0IHtGb3JtQXJyYXlOYW1lfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUnO1xuZXhwb3J0IHtGb3JtR3JvdXBOYW1lfSBmcm9tICcuL2RpcmVjdGl2ZXMvcmVhY3RpdmVfZGlyZWN0aXZlcy9mb3JtX2dyb3VwX25hbWUnO1xuZXhwb3J0IHtOZ1NlbGVjdE9wdGlvbiwgU2VsZWN0Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3RfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge1NlbGVjdE11bHRpcGxlQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vZGlyZWN0aXZlcy9zZWxlY3RfbXVsdGlwbGVfY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5leHBvcnQge8m1TmdTZWxlY3RNdWx0aXBsZU9wdGlvbn0gZnJvbSAnLi9kaXJlY3RpdmVzL3NlbGVjdF9tdWx0aXBsZV9jb250cm9sX3ZhbHVlX2FjY2Vzc29yJztcbmV4cG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIENoZWNrYm94UmVxdWlyZWRWYWxpZGF0b3IsIEVtYWlsVmFsaWRhdG9yLCBNYXhMZW5ndGhWYWxpZGF0b3IsIE1pbkxlbmd0aFZhbGlkYXRvciwgUGF0dGVyblZhbGlkYXRvciwgUmVxdWlyZWRWYWxpZGF0b3IsIFZhbGlkYXRpb25FcnJvcnMsIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vZGlyZWN0aXZlcy92YWxpZGF0b3JzJztcbmV4cG9ydCB7Rm9ybUJ1aWxkZXJ9IGZyb20gJy4vZm9ybV9idWlsZGVyJztcbmV4cG9ydCB7QWJzdHJhY3RDb250cm9sLCBBYnN0cmFjdENvbnRyb2xPcHRpb25zLCBGb3JtQXJyYXksIEZvcm1Db250cm9sLCBGb3JtR3JvdXB9IGZyb20gJy4vbW9kZWwnO1xuZXhwb3J0IHtOR19BU1lOQ19WQUxJREFUT1JTLCBOR19WQUxJREFUT1JTLCBWYWxpZGF0b3JzfSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuZXhwb3J0IHtWRVJTSU9OfSBmcm9tICcuL3ZlcnNpb24nO1xuXG5leHBvcnQgKiBmcm9tICcuL2Zvcm1fcHJvdmlkZXJzJztcbiJdfQ==