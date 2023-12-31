import type { DefaultSharedModuleContext, LangiumServices, LangiumSharedServices, Module, PartialLangiumServices } from 'langium';
import { createDefaultModule, createDefaultSharedModule, inject } from 'langium';
import { DaedalusGeneratedModule, DaedalusGeneratedSharedModule,  } from './generated/module.js';
import { DaedalusValidator, registerValidationChecks } from './daedalus-validator.js';
import { DaedalusScopeComputation } from './variable-scope-computaiton.js';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type DaedalusAddedServices = {
    validation: {
        DaedalusValidator: DaedalusValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type DaedalusServices = LangiumServices & DaedalusAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const DaedalusModule: Module<DaedalusServices, PartialLangiumServices & DaedalusAddedServices> = {
    validation: {
        DaedalusValidator: () => new DaedalusValidator()
    },
    references: {
        ScopeComputation: (services) => new DaedalusScopeComputation(services)
    }
};


/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createDaedalusServices(context: DefaultSharedModuleContext): {
    shared: LangiumSharedServices,
    Daedalus: DaedalusServices,
} {
    const shared = inject(
        createDefaultSharedModule(context),
        DaedalusGeneratedSharedModule
    );
    const Daedalus = inject(
        createDefaultModule({ shared }),
        DaedalusGeneratedModule,
        DaedalusModule
    );

    shared.ServiceRegistry.register(Daedalus);
    registerValidationChecks(Daedalus);
    return { shared, Daedalus };
}
