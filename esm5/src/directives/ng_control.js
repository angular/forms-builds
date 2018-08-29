/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { AbstractControlDirective } from './abstract_control_directive';
function unimplemented() {
    throw new Error('unimplemented');
}
/**
 * A base class that all control directive extend.
 * It binds a `FormControl` object to a DOM element.
 *
 * Used internally by Angular forms.
 *
 *
 */
var NgControl = /** @class */ (function (_super) {
    tslib_1.__extends(NgControl, _super);
    function NgControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** @internal */
        _this._parent = null;
        _this.name = null;
        _this.valueAccessor = null;
        /** @internal */
        _this._rawValidators = [];
        /** @internal */
        _this._rawAsyncValidators = [];
        return _this;
    }
    Object.defineProperty(NgControl.prototype, "validator", {
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgControl.prototype, "asyncValidator", {
        get: function () { return unimplemented(); },
        enumerable: true,
        configurable: true
    });
    return NgControl;
}(AbstractControlDirective));
export { NgControl };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfY29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2Zvcm1zL3NyYy9kaXJlY3RpdmVzL25nX2NvbnRyb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUdILE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBS3RFLFNBQVMsYUFBYTtJQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0g7SUFBd0MscUNBQXdCO0lBQWhFO1FBQUEscUVBY0M7UUFiQyxnQkFBZ0I7UUFDaEIsYUFBTyxHQUEwQixJQUFJLENBQUM7UUFDdEMsVUFBSSxHQUFnQixJQUFJLENBQUM7UUFDekIsbUJBQWEsR0FBOEIsSUFBSSxDQUFDO1FBQ2hELGdCQUFnQjtRQUNoQixvQkFBYyxHQUFpQyxFQUFFLENBQUM7UUFDbEQsZ0JBQWdCO1FBQ2hCLHlCQUFtQixHQUEyQyxFQUFFLENBQUM7O0lBTW5FLENBQUM7SUFKQyxzQkFBSSxnQ0FBUzthQUFiLGNBQW9DLE9BQW9CLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDMUUsc0JBQUkscUNBQWM7YUFBbEIsY0FBOEMsT0FBeUIsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUczRixnQkFBQztBQUFELENBQUMsQUFkRCxDQUF3Qyx3QkFBd0IsR0FjL0QiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cblxuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2xEaXJlY3RpdmV9IGZyb20gJy4vYWJzdHJhY3RfY29udHJvbF9kaXJlY3RpdmUnO1xuaW1wb3J0IHtDb250cm9sQ29udGFpbmVyfSBmcm9tICcuL2NvbnRyb2xfY29udGFpbmVyJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJy4vY29udHJvbF92YWx1ZV9hY2Nlc3Nvcic7XG5pbXBvcnQge0FzeW5jVmFsaWRhdG9yLCBBc3luY1ZhbGlkYXRvckZuLCBWYWxpZGF0b3IsIFZhbGlkYXRvckZufSBmcm9tICcuL3ZhbGlkYXRvcnMnO1xuXG5mdW5jdGlvbiB1bmltcGxlbWVudGVkKCk6IGFueSB7XG4gIHRocm93IG5ldyBFcnJvcigndW5pbXBsZW1lbnRlZCcpO1xufVxuXG4vKipcbiAqIEEgYmFzZSBjbGFzcyB0aGF0IGFsbCBjb250cm9sIGRpcmVjdGl2ZSBleHRlbmQuXG4gKiBJdCBiaW5kcyBhIGBGb3JtQ29udHJvbGAgb2JqZWN0IHRvIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogVXNlZCBpbnRlcm5hbGx5IGJ5IEFuZ3VsYXIgZm9ybXMuXG4gKlxuICpcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nQ29udHJvbCBleHRlbmRzIEFic3RyYWN0Q29udHJvbERpcmVjdGl2ZSB7XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX3BhcmVudDogQ29udHJvbENvbnRhaW5lcnxudWxsID0gbnVsbDtcbiAgbmFtZTogc3RyaW5nfG51bGwgPSBudWxsO1xuICB2YWx1ZUFjY2Vzc29yOiBDb250cm9sVmFsdWVBY2Nlc3NvcnxudWxsID0gbnVsbDtcbiAgLyoqIEBpbnRlcm5hbCAqL1xuICBfcmF3VmFsaWRhdG9yczogQXJyYXk8VmFsaWRhdG9yfFZhbGlkYXRvckZuPiA9IFtdO1xuICAvKiogQGludGVybmFsICovXG4gIF9yYXdBc3luY1ZhbGlkYXRvcnM6IEFycmF5PEFzeW5jVmFsaWRhdG9yfEFzeW5jVmFsaWRhdG9yRm4+ID0gW107XG5cbiAgZ2V0IHZhbGlkYXRvcigpOiBWYWxpZGF0b3JGbnxudWxsIHsgcmV0dXJuIDxWYWxpZGF0b3JGbj51bmltcGxlbWVudGVkKCk7IH1cbiAgZ2V0IGFzeW5jVmFsaWRhdG9yKCk6IEFzeW5jVmFsaWRhdG9yRm58bnVsbCB7IHJldHVybiA8QXN5bmNWYWxpZGF0b3JGbj51bmltcGxlbWVudGVkKCk7IH1cblxuICBhYnN0cmFjdCB2aWV3VG9Nb2RlbFVwZGF0ZShuZXdWYWx1ZTogYW55KTogdm9pZDtcbn1cbiJdfQ==