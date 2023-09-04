grammar Daedalus

entry Model:
    (
    constantDefs+=ConstantDefinition ";" |
    variableDecs+=VariableDeclaration ";" |
    expressions+=Expression ";"
    )*;

ConstantDefinition:
    "const" primitive=("int" | "string")  name=ID "=" value=Expression;

Expression:
    Assignment;

Assignment infers Expression:
    Addition ({infer BinaryExpression.left=current} operator=('=') right=Addition)*;

Addition infers Expression:
    Multiplication ({infer BinaryExpression.left=current} operator=('+' | '-') right=Multiplication)*;

Multiplication infers Expression:
    Logical ({infer BinaryExpression.left=current} operator=('*' | '/') right=Logical)*;

Logical infers Expression:
    Comparison ({infer BinaryExpression.left=current} operator=('and' | 'or') right=Comparison)*;

Comparison infers Expression:
    MemberCall ({infer BinaryExpression.left=current} operator=('<' | '<=' | '>' | '>=' | '==' | '!=') right=MemberCall)*;

MemberCall infers Expression:
    Primary
	// ({infer MemberCall.previous=current} 
    //     // Member call with function call
    //     ("." element=[NamedElement:ID] (
	// 	explicitOperationCall?='('
	// 	(
	// 	    arguments+=Expression (',' arguments+=Expression)*
	// 	)?
	// 	')')? 
    //     // Chained function call
    //     | (
	// 	explicitOperationCall?='('
	// 	(
	// 	    arguments+=Expression (',' arguments+=Expression)*
	// 	)?
	// 	')'))
    // )*
;
Primary infers Expression:
    '(' Expression ')' |
    StringExpression |
    IntegerExpression |
    FeatureCall;

FeatureCall:
    element=[NamedElement:ID]
	//(
    // element=[NamedElement:ID] // | element=[NamedElement:'this'] | element=[NamedElement:'super'])
    // Optional function call after referencing an element
    // (explicitOperationCall?='('
	// (
	//     arguments+=Expression (',' arguments+=Expression)*
	// )?
	// ')')?
;

IntegerExpression:
    value=INT;

StringExpression:
    value=STRING;

VariableDeclaration:
    "var" type=TypeReference parameter+=VariableParameter ("," parameter+=VariableParameter)*;
VariableParameter:
    name=ID ( "[" size=Expression "]")?;

TypeReference:
    // reference=[Class:ID] |
    primitive=("int" | "string");



type NamedElement =  ConstantDefinition | VariableDeclaration | VariableParameter;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /(-)?[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

