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
class AbstractFormGroupDirective extends ControlContainer {
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
}
AbstractFormGroupDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.3+sha-13dd614", ngImport: i0, type: AbstractFormGroupDirective, deps: null, target: i0.ɵɵFactoryTarget.Directive });
AbstractFormGroupDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.3+sha-13dd614", type: AbstractFormGroupDirective, usesInheritance: true, ngImport: i0 });
export { AbstractFormGroupDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.3+sha-13dd614", ngImport: i0, type: AbstractFormGroupDirective, decorators: [{
            type: Directive
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWJzdHJhY3RfZm9ybV9ncm91cF9kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9mb3Jtcy9zcmMvZGlyZWN0aXZlcy9hYnN0cmFjdF9mb3JtX2dyb3VwX2RpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFvQixNQUFNLGVBQWUsQ0FBQztBQUkzRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVyRCxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUlyQzs7Ozs7R0FLRztBQUNILE1BQ2EsMEJBQTJCLFNBQVEsZ0JBQWdCO0lBVTlELGFBQWE7SUFDYixRQUFRO1FBQ04sSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsNENBQTRDO1FBQzVDLElBQUksQ0FBQyxhQUFjLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxhQUFhO0lBQ2IsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QiwwQ0FBMEM7WUFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBYSxPQUFPO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGFBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQWEsSUFBSTtRQUNmLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6RixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBYSxhQUFhO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMxRCxDQUFDO0lBRUQsZ0JBQWdCO0lBQ2hCLGdCQUFnQixLQUFVLENBQUM7O2tJQWxEaEIsMEJBQTBCO3NIQUExQiwwQkFBMEI7U0FBMUIsMEJBQTBCO3NHQUExQiwwQkFBMEI7a0JBRHRDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIE9uRGVzdHJveSwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtGb3JtR3JvdXB9IGZyb20gJy4uL21vZGVsL2Zvcm1fZ3JvdXAnO1xuXG5pbXBvcnQge0NvbnRyb2xDb250YWluZXJ9IGZyb20gJy4vY29udHJvbF9jb250YWluZXInO1xuaW1wb3J0IHtGb3JtfSBmcm9tICcuL2Zvcm1faW50ZXJmYWNlJztcbmltcG9ydCB7Y29udHJvbFBhdGh9IGZyb20gJy4vc2hhcmVkJztcblxuXG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGJhc2UgY2xhc3MgZm9yIGNvZGUgc2hhcmVkIGJldHdlZW4gdGhlIGBOZ01vZGVsR3JvdXBgIGFuZCBgRm9ybUdyb3VwTmFtZWAgZGlyZWN0aXZlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGNsYXNzIEFic3RyYWN0Rm9ybUdyb3VwRGlyZWN0aXZlIGV4dGVuZHMgQ29udHJvbENvbnRhaW5lciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgcGFyZW50IGNvbnRyb2wgZm9yIHRoZSBncm91cFxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBfcGFyZW50ITogQ29udHJvbENvbnRhaW5lcjtcblxuICAvKiogQG5vZG9jICovXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NoZWNrUGFyZW50VHlwZSgpO1xuICAgIC8vIFJlZ2lzdGVyIHRoZSBncm91cCB3aXRoIGl0cyBwYXJlbnQgZ3JvdXAuXG4gICAgdGhpcy5mb3JtRGlyZWN0aXZlIS5hZGRGb3JtR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKiogQG5vZG9jICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvcm1EaXJlY3RpdmUpIHtcbiAgICAgIC8vIFJlbW92ZSB0aGUgZ3JvdXAgZnJvbSBpdHMgcGFyZW50IGdyb3VwLlxuICAgICAgdGhpcy5mb3JtRGlyZWN0aXZlLnJlbW92ZUZvcm1Hcm91cCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBgRm9ybUdyb3VwYCBib3VuZCB0byB0aGlzIGRpcmVjdGl2ZS5cbiAgICovXG4gIG92ZXJyaWRlIGdldCBjb250cm9sKCk6IEZvcm1Hcm91cCB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybURpcmVjdGl2ZSEuZ2V0Rm9ybUdyb3VwKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgcGF0aCB0byB0aGlzIGdyb3VwIGZyb20gdGhlIHRvcC1sZXZlbCBkaXJlY3RpdmUuXG4gICAqL1xuICBvdmVycmlkZSBnZXQgcGF0aCgpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIGNvbnRyb2xQYXRoKHRoaXMubmFtZSA9PSBudWxsID8gdGhpcy5uYW1lIDogdGhpcy5uYW1lLnRvU3RyaW5nKCksIHRoaXMuX3BhcmVudCk7XG4gIH1cblxuICAvKipcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSB0b3AtbGV2ZWwgZGlyZWN0aXZlIGZvciB0aGlzIGdyb3VwIGlmIHByZXNlbnQsIG90aGVyd2lzZSBudWxsLlxuICAgKi9cbiAgb3ZlcnJpZGUgZ2V0IGZvcm1EaXJlY3RpdmUoKTogRm9ybXxudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fcGFyZW50ID8gdGhpcy5fcGFyZW50LmZvcm1EaXJlY3RpdmUgOiBudWxsO1xuICB9XG5cbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfY2hlY2tQYXJlbnRUeXBlKCk6IHZvaWQge31cbn1cbiJdfQ==