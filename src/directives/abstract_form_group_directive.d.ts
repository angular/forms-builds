/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '../model';
import { ControlContainer } from './control_container';
import { Form } from './form_interface';
import { AsyncValidatorFn, ValidatorFn } from './validators';
/**
 * This is a base class for code shared between `NgModelGroup` and `FormGroupName`.
 *
 *
 */
export declare class AbstractFormGroupDirective extends ControlContainer implements OnInit, OnDestroy {
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Get the `FormGroup` backing this binding.
     */
    readonly control: FormGroup;
    /**
     * Get the path to this control group.
     */
    readonly path: string[];
    /**
     * Get the `Form` to which this group belongs.
     */
    readonly formDirective: Form | null;
    readonly validator: ValidatorFn | null;
    readonly asyncValidator: AsyncValidatorFn | null;
}
