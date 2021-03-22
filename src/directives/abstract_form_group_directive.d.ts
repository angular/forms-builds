/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '../model';
import { ControlContainer } from './control_container';
import { Form } from './form_interface';
import * as i0 from "@angular/core";
/**
 * @description
 * A base class for code shared between the `NgModelGroup` and `FormGroupName` directives.
 *
 * @publicApi
 */
export declare class AbstractFormGroupDirective extends ControlContainer implements OnInit, OnDestroy {
    /** @nodoc */
    ngOnInit(): void;
    /** @nodoc */
    ngOnDestroy(): void;
    /**
     * @description
     * The `FormGroup` bound to this directive.
     */
    get control(): FormGroup;
    /**
     * @description
     * The path to this group from the top-level directive.
     */
    get path(): string[];
    /**
     * @description
     * The top-level directive for this group if present, otherwise null.
     */
    get formDirective(): Form | null;
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractFormGroupDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AbstractFormGroupDirective, never, never, {}, {}, never>;
}
