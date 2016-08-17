/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { EventEmitter } from '../../facade/async';
import { FormControl } from '../../model';
import { ControlContainer } from '../control_container';
import { ControlValueAccessor } from '../control_value_accessor';
import { NgControl } from '../ng_control';
import { AsyncValidatorFn, ValidatorFn } from '../validators';
export declare const controlNameBinding: any;
/**
 * Syncs an existing form control with the specified name to a DOM element.
 *
 * This directive can only be used as a child of {@link FormGroupDirective}.  It also requires
 * importing the {@link ReactiveFormsModule}.

 * ### Example
 *
 * In this example, we create the login and password controls.
 * We can work with each control separately: check its validity, get its value, listen to its
 * changes.
 *
 *  ```
 * @Component({
 *      selector: "login-comp",
 *      template: `
 *        <form [formGroup]="myForm" (submit)="onLogIn()">
 *          Login <input type="text" formControlName="login">
 *          <div *ngIf="!loginCtrl.valid">Login is invalid</div>
 *          Password <input type="password" formControlName="password">
 *          <button type="submit">Log in!</button>
 *        </form>
 *      `})
 * class LoginComp {
 *  loginCtrl = new FormControl();
 *  passwordCtrl = new FormControl();
 *  myForm = new FormGroup({
 *     login: loginCtrl,
 *     password: passwordCtrl
 *  });
 *  onLogIn(): void {
 *    // value === {login: 'some login', password: 'some password'}
 *  }
 * }
 *  ```
 *
 * We can also set the value of the form programmatically using setValue().
 *
 *  ```
 * @Component({
 *      selector: "login-comp",
 *      template: `
 *        <form [formGroup]="myForm" (submit)='onLogIn()'>
 *          Login <input type='text' formControlName='login'>
 *          Password <input type='password' formControlName='password'>
 *          <button type='submit'>Log in!</button>
 *        </form>
 *      `})
 * class LoginComp {
 *  myForm = new FormGroup({
 *    login: new FormControl(),
 *    password: new FormControl()
 *  });
 *
 *  populate() {
 *     this.myForm.setValue({login: 'some login', password: 'some password'});
 *  }
 *
 *  onLogIn(): void {
 *    // this.credentials.login === "some login"
 *    // this.credentials.password === "some password"
 *  }
 * }
 *  ```
 *
 *  @stable
 */
export declare class FormControlName extends NgControl implements OnChanges, OnDestroy {
    private _parent;
    private _validators;
    private _asyncValidators;
    private _added;
    name: string;
    model: any;
    update: EventEmitter<{}>;
    constructor(_parent: ControlContainer, _validators: any[], _asyncValidators: any[], valueAccessors: ControlValueAccessor[]);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    viewToModelUpdate(newValue: any): void;
    readonly path: string[];
    readonly formDirective: any;
    readonly validator: ValidatorFn;
    readonly asyncValidator: AsyncValidatorFn;
    readonly control: FormControl;
    private _checkParentType();
}
