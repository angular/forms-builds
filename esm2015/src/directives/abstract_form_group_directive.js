/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { ControlContainer } from './control_container';
import { composeAsyncValidators, composeValidators, controlPath } from './shared';
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
    /**
     * @description
     * The synchronous validators registered with this group.
     */
    get validator() {
        return composeValidators(this._validators);
    }
    /**
     * @description
     * The async validators registered with this group.
     */
    get asyncValidator() {
        return composeAsyncValidators(this._asyncValidators);
    }
    /** @internal */
    _checkParentType() { }
}
AbstractFormGroupDirective.decorators = [
    { type: Directive }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUkzRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBS2hGOzs7OztHQUtHO0FBRUgsTUFBTSxPQUFPLDBCQUEyQixTQUFRLGdCQUFnQjtJQTRCOUQsYUFBYTtJQUNiLFFBQVE7UUFDTixJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4Qiw0Q0FBNEM7UUFDNUMsSUFBSSxDQUFDLGFBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGFBQWE7SUFDYixXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLDBDQUEwQztZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQztJQUNILENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxhQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLElBQUk7UUFDTixPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMxRCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxTQUFTO1FBQ1gsT0FBTyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksY0FBYztRQUNoQixPQUFPLHNCQUFzQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCxnQkFBZ0I7SUFDaEIsZ0JBQWdCLEtBQVUsQ0FBQzs7O1lBckY1QixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBPbkRlc3Ryb3ksIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7Rm9ybUdyb3VwfSBmcm9tICcuLi9tb2RlbCc7XG5cbmltcG9ydCB7Q29udHJvbENvbnRhaW5lcn0gZnJvbSAnLi9jb250cm9sX2NvbnRhaW5lcic7XG5pbXBvcnQge0Zvcm19IGZyb20gJy4vZm9ybV9pbnRlcmZhY2UnO1xuaW1wb3J0IHtjb21wb3NlQXN5bmNWYWxpZGF0b3JzLCBjb21wb3NlVmFsaWRhdG9ycywgY29udHJvbFBhdGh9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7QXN5bmNWYWxpZGF0b3IsIEFzeW5jVmFsaWRhdG9yRm4sIFZhbGlkYXRvciwgVmFsaWRhdG9yRm59IGZyb20gJy4vdmFsaWRhdG9ycyc7XG5cblxuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICogQSBiYXNlIGNsYXNzIGZvciBjb2RlIHNoYXJlZCBiZXR3ZWVuIHRoZSBgTmdNb2RlbEdyb3VwYCBhbmQgYEZvcm1Hcm91cE5hbWVgIGRpcmVjdGl2ZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBBYnN0cmFjdEZvcm1Hcm91cERpcmVjdGl2ZSBleHRlbmRzIENvbnRyb2xDb250YWluZXIgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIHBhcmVudCBjb250cm9sIGZvciB0aGUgZ3JvdXBcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX3BhcmVudCE6IENvbnRyb2xDb250YWluZXI7XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBbiBhcnJheSBvZiBzeW5jaHJvbm91cyB2YWxpZGF0b3JzIGZvciB0aGUgZ3JvdXBcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgX3ZhbGlkYXRvcnMhOiAoVmFsaWRhdG9yfFZhbGlkYXRvckZuKVtdO1xuXG4gIC8qKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQW4gYXJyYXkgb2YgYXN5bmMgdmFsaWRhdG9ycyBmb3IgdGhlIGdyb3VwXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIF9hc3luY1ZhbGlkYXRvcnMhOiAoQXN5bmNWYWxpZGF0b3J8QXN5bmNWYWxpZGF0b3JGbilbXTtcblxuICAvKiogQG5vZG9jICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgIC8vIFJlZ2lzdGVyIHRoZSBncm91cCB3aXRoIGl0cyBwYXJlbnQgZ3JvdXAuXG4gICAgdGhpcy5mb3JtRGlyZWN0aXZlIS5hZGRGb3JtR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZ3JvdXAgZnJvbSBpdHMgcGFyZW50IGdyb3VwLlxuICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUZvcm1Hcm91cCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybURpcmVjdGl2ZSEuZ2V0Rm9ybUdyb3VwKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgcGF0aCB0byB0aGlzIGdyb3VwIGZyb20gdGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUuXG4gICAqL1xuICBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSA9PSBudWxsID8gdGhpcy5uYW1lIDogdGhpcy5uYW1lLnRvU3RyaW5nKCksIHRoaXMuX3BhcmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGdyb3VwIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgZ2V0IGZvcm1EaXJlY3RpdmUoKTogRm9ybXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmZvcm1EaXJlY3RpdmUgOiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgc3luY2hyb25vdXMgdmFsaWRhdG9ycyByZWdpc3RlcmVkIHdpdGggdGhpcyBncm91cC5cbiAgICovXG4gIGdldCB2YWxpZGF0b3IoKTogVmFsaWRhdG9yRm58bnVsbCB7XG4gICAgcmV0dXJuIGNvbXBvc2VWYWxpZGF0b3JzKHRoaXMuX3ZhbGlkYXRvcnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgYXN5bmMgdmFsaWRhdG9ycyByZWdpc3RlcmVkIHdpdGggdGhpcyBncm91cC5cbiAgICovXG4gIGdldCBhc3luY1ZhbGlkYXRvcigpOiBBc3luY1ZhbGlkYXRvckZufG51bGwge1xuICAgIHJldHVybiBjb21wb3NlQXN5bmNWYWxpZGF0b3JzKHRoaXMuX2FzeW5jVmFsaWRhdG9ycyk7XG4gIH1cblxuICAvKiogQGludGVybmFsICovXG4gIF9jaGVja1BhcmVudFR5cGUoKTogdm9pZCB7fVxufVxuIl19