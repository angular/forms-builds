/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { ControlContainer } from './control_container';
import { controlPath } from './shared';
import * as i0 from "@angular/core";
/**
 * @description
 * A base class for code shared between the `NgModelGroup` and `FormGroupName` directives.
 *
 * @publicApi
 */
export class AbstractFormGroupDirective extends ControlContainer {
    /** @nodoc */
    ngOnInit() {
        this._checkParentType();
        // Register the group with its parent group.
        this.formDirective.addFormGroup(this);
    }
    /** @nodoc */
    ngOnDestroy() {
        if (this.formDirective) {
            // Remove the group from its parent group.
            this.formDirective.removeFormGroup(this);
        }
    }
    /**
     * @description
     * The `FormGroup` bound to this directive.
     */
    get control() {
        return this.formDirective.getFormGroup(this);
    }
    /**
     * @description
     * The path to this group from the top-level directive.
     */
    get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
    }
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective() {
        return this._parent ? this._parent.formDirective : null;
    }
    /** @internal */
    _checkParentType() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0-next.0+sha-da906fd", ngImport: i0, type: AbstractFormGroupDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.0-next.0+sha-da906fd", type: AbstractFormGroupDirective, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0-next.0+sha-da906fd", ngImport: i0, type: AbstractFormGroupDirective, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUkzRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUlyQzs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTywwQkFBMkIsU0FBUSxnQkFBZ0I7SUFVOUQsYUFBYTtJQUNiLFFBQVE7UUFDTixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4Qiw0Q0FBNEM7UUFDNUMsSUFBSSxDQUFDLGFBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGFBQWE7SUFDYixXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDdkIsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNDLENBQUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBYSxPQUFPO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGFBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQWEsSUFBSTtRQUNmLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBYSxhQUFhO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMxRCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGdCQUFnQixLQUFVLENBQUM7eUhBbERoQiwwQkFBMEI7NkdBQTFCLDBCQUEwQjs7c0dBQTFCLDBCQUEwQjtrQkFEdEMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgT25EZXN0cm95LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0Zvcm1Hcm91cH0gZnJvbSAnLi4vbW9kZWwvZm9ybV9ncm91cCc7XG5cbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0Zvcm19IGZyb20gJy4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHtjb250cm9sUGF0aH0gZnJvbSAnLi9zaGFyZWQnO1xuXG5cblxuLyoqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgYmFzZSBjbGFzcyBmb3IgY29kZSBzaGFyZWQgYmV0d2VlbiB0aGUgYE5nTW9kZWxHcm91cGAgYW5kIGBGb3JtR3JvdXBOYW1lYCBkaXJlY3RpdmVzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgY2xhc3MgQWJzdHJhY3RGb3JtR3JvdXBEaXJlY3RpdmUgZXh0ZW5kcyBDb250cm9sQ29udGFpbmVyIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBwYXJlbnQgY29udHJvbCBmb3IgdGhlIGdyb3VwXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9wYXJlbnQhOiBDb250cm9sQ29udGFpbmVyO1xuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY2hlY2tQYXJlbnRUeXBlKCk7XG4gICAgLy8gUmVnaXN0ZXIgdGhlIGdyb3VwIHdpdGggaXRzIHBhcmVudCBncm91cC5cbiAgICB0aGlzLmZvcm1EaXJlY3RpdmUhLmFkZEZvcm1Hcm91cCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAbm9kb2MgKi9cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9ybURpcmVjdGl2ZSkge1xuICAgICAgLy8gUmVtb3ZlIHRoZSBncm91cCBmcm9tIGl0cyBwYXJlbnQgZ3JvdXAuXG4gICAgICB0aGlzLmZvcm1EaXJlY3RpdmUucmVtb3ZlRm9ybUdyb3VwKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGBGb3JtR3JvdXBgIGJvdW5kIHRvIHRoaXMgZGlyZWN0aXZlLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGNvbnRyb2woKTogRm9ybUdyb3VwIHtcbiAgICByZXR1cm4gdGhpcy5mb3JtRGlyZWN0aXZlIS5nZXRGb3JtR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBwYXRoIHRvIHRoaXMgZ3JvdXAgZnJvbSB0aGUgdG9wLWxldmVsIGRpcmVjdGl2ZS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBwYXRoKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gY29udHJvbFBhdGgodGhpcy5uYW1lID09IG51bGwgPyB0aGlzLm5hbWUgOiB0aGlzLm5hbWUudG9TdHJpbmcoKSwgdGhpcy5fcGFyZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUgZm9yIHRoaXMgZ3JvdXAgaWYgcHJlc2VudCwgb3RoZXJ3aXNlIG51bGwuXG4gICAqL1xuICBvdmVycmlkZSBnZXQgZm9ybURpcmVjdGl2ZSgpOiBGb3JtfG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYXJlbnQgPyB0aGlzLl9wYXJlbnQuZm9ybURpcmVjdGl2ZSA6IG51bGw7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jaGVja1BhcmVudFR5cGUoKTogdm9pZCB7fVxufVxuIl19