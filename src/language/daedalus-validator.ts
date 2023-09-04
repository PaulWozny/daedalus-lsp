import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { DaedalusAstType, Model } from './generated/ast.js';
import type { DaedalusServices } from './daedalus-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: DaedalusServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.DaedalusValidator;
    const checks: ValidationChecks<DaedalusAstType> = {
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DaedalusValidator {

    checkPersonStartsWithCapital(model: Model, accept: ValidationAcceptor): void {
        // if (person.name) {
        //     const firstChar = person.name.substring(0, 1);
        //     if (firstChar.toUpperCase() !== firstChar) {
        //         accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
        //     }
        // }
    }

}
