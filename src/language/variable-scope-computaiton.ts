import { DefaultScopeComputation, LangiumDocument, AstNodeDescription, streamAllContents } from "langium";
import {  isConstantDefinition, isVariableParameter } from "./generated/ast.js";

export class DaedalusScopeComputation extends DefaultScopeComputation {

    /**
     * Export all functions using their fully qualified name
     */
    override async computeExports(document: LangiumDocument): Promise<AstNodeDescription[]> {
        const exportedDescriptions: AstNodeDescription[] = [];
        for (const childNode of streamAllContents(document.parseResult.value)) {
            if (isVariableParameter(childNode) || isConstantDefinition(childNode)) {
                // exporting every principal name
                exportedDescriptions.push(this.descriptions.createDescription(childNode, childNode.name))
                // const fullyQualifiedName = this.getQualifiedName(childNode, childNode.name);
                // // `descriptions` is our `AstNodeDescriptionProvider` defined in `DefaultScopeComputation`
                // // It allows us to easily create descriptions that point to elements using a name.
                // exportedDescriptions.push(this.descriptions.createDescription(modelNode, fullyQualifiedName, document));
            }
        }
        return exportedDescriptions;
    }

    // override async computeLocalScopes(document: LangiumDocument): Promise<PrecomputedScopes> {
    //     const model = document.parseResult.value as Model;
    //     // This multi-map stores a list of descriptions for each node in our document
    //     const scopes = new MultiMap<AstNode, AstNodeDescription>();
    //     streamAllContents(model).filter(isVariableParameter).forEach(variableParameter => {
    //         scopes.add(model, this.descriptions.createDescription(variableParameter, variableParameter.name, document))
    //     })
    //     streamAllContents(model).filter(isConstantDefinition).forEach(constantDefinition => {
    //         scopes.add(model, this.descriptions.createDescription(constantDefinition, constantDefinition.name, document))
    //     })

    //     return scopes;
    // }


}