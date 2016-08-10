import { Observable } from '../facade/async';
import { AbstractControl } from '../model';
/**
 * Base class for control directives.
 *
 * Only used internally in the forms module.
 *
 * @experimental
 */
export declare abstract class AbstractControlDirective {
    control: AbstractControl;
    value: any;
    valid: boolean;
    invalid: boolean;
    pending: boolean;
    errors: {
        [key: string]: any;
    };
    pristine: boolean;
    dirty: boolean;
    touched: boolean;
    untouched: boolean;
    statusChanges: Observable<any>;
    valueChanges: Observable<any>;
    path: string[];
    reset(value?: any): void;
}
