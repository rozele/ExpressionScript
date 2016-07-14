import * as ts from 'typescript';
import {NotImplementedError} from '../lib/Error';

export class AstVisitor<T> {
    visit(node: ts.Node): T {
        switch(node.kind) {
            case ts.SyntaxKind.Unknown:
                throw new Error("Unknown node type not supported.");
            case ts.SyntaxKind.EndOfFileToken:
                throw new Error("EOF node type not supported.")
            case ts.SyntaxKind.SingleLineCommentTrivia:
            case ts.SyntaxKind.MultiLineCommentTrivia:
            case ts.SyntaxKind.NewLineTrivia:
            case ts.SyntaxKind.WhitespaceTrivia:
            // We detect and preserve #! on the first line
            case ts.SyntaxKind.ShebangTrivia:
            // We detect and provide better error recovery when we encounter a git merge marker.  This
            // allows us to edit files with git-conflict markers in them in a much more pleasant manner.
            case ts.SyntaxKind.ConflictMarkerTrivia:
                throw new Error("Trivia node type not supported.");
            // Literals
            case ts.SyntaxKind.NumericLiteral:
                return this.visitNumericLiteral(node);
            case ts.SyntaxKind.StringLiteral:
                return this.visitStringLiteral(<ts.StringLiteral>node);
            case ts.SyntaxKind.RegularExpressionLiteral:
                throw new Error("Regular expression literals not supported.");
            case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
                throw new Error("Template literals not supported.");
            // Pseudo-literals
            case ts.SyntaxKind.TemplateHead:
            case ts.SyntaxKind.TemplateMiddle:
            case ts.SyntaxKind.TemplateTail:
                throw new Error("Template literals not supported.");
            // Punctuation
            case ts.SyntaxKind.OpenBraceToken:
            case ts.SyntaxKind.CloseBraceToken:
            case ts.SyntaxKind.OpenParenToken:
            case ts.SyntaxKind.CloseParenToken:
            case ts.SyntaxKind.OpenBracketToken:
            case ts.SyntaxKind.CloseBracketToken:
            case ts.SyntaxKind.DotToken:
            case ts.SyntaxKind.DotDotDotToken:
            case ts.SyntaxKind.SemicolonToken:
            case ts.SyntaxKind.CommaToken:
            case ts.SyntaxKind.LessThanToken:
            case ts.SyntaxKind.LessThanSlashToken:
            case ts.SyntaxKind.GreaterThanToken:
            case ts.SyntaxKind.LessThanEqualsToken:
            case ts.SyntaxKind.GreaterThanEqualsToken:
            case ts.SyntaxKind.EqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsToken:
            case ts.SyntaxKind.EqualsEqualsEqualsToken:
            case ts.SyntaxKind.ExclamationEqualsEqualsToken:
            case ts.SyntaxKind.EqualsGreaterThanToken:
            case ts.SyntaxKind.PlusToken:
            case ts.SyntaxKind.MinusToken:
            case ts.SyntaxKind.AsteriskToken:
            case ts.SyntaxKind.AsteriskAsteriskToken:
            case ts.SyntaxKind.SlashToken:
            case ts.SyntaxKind.PercentToken:
            case ts.SyntaxKind.PlusPlusToken:
            case ts.SyntaxKind.MinusMinusToken:
            case ts.SyntaxKind.LessThanLessThanToken:
            case ts.SyntaxKind.GreaterThanGreaterThanToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken:
            case ts.SyntaxKind.AmpersandToken:
            case ts.SyntaxKind.BarToken:
            case ts.SyntaxKind.CaretToken:
            case ts.SyntaxKind.ExclamationToken:
            case ts.SyntaxKind.TildeToken:
            case ts.SyntaxKind.AmpersandAmpersandToken:
            case ts.SyntaxKind.BarBarToken:
            case ts.SyntaxKind.QuestionToken:
            case ts.SyntaxKind.ColonToken:
            case ts.SyntaxKind.AtToken:
                throw new Error("Punctuation token nodes are not supported.");
            // Assignments
            case ts.SyntaxKind.EqualsToken:
            case ts.SyntaxKind.PlusEqualsToken:
            case ts.SyntaxKind.MinusEqualsToken:
            case ts.SyntaxKind.AsteriskEqualsToken:
            case ts.SyntaxKind.AsteriskAsteriskEqualsToken:
            case ts.SyntaxKind.SlashEqualsToken:
            case ts.SyntaxKind.PercentEqualsToken:
            case ts.SyntaxKind.LessThanLessThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken:
            case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken:
            case ts.SyntaxKind.AmpersandEqualsToken:
            case ts.SyntaxKind.BarEqualsToken:
            case ts.SyntaxKind.CaretEqualsToken:
                throw new Error("Assignment token nodes are not supported.");
            // Identifiers
            case ts.SyntaxKind.Identifier:
                return this.visitIdentifier(<ts.Identifier>node);
            // Reserved words
            case ts.SyntaxKind.BreakKeyword:
            case ts.SyntaxKind.CaseKeyword:
            case ts.SyntaxKind.CatchKeyword:
            case ts.SyntaxKind.ClassKeyword:
            case ts.SyntaxKind.ConstKeyword:
            case ts.SyntaxKind.ContinueKeyword:
            case ts.SyntaxKind.DebuggerKeyword:
            case ts.SyntaxKind.DefaultKeyword:
            case ts.SyntaxKind.DeleteKeyword:
            case ts.SyntaxKind.DoKeyword:
            case ts.SyntaxKind.ElseKeyword:
            case ts.SyntaxKind.EnumKeyword:
            case ts.SyntaxKind.ExportKeyword:
            case ts.SyntaxKind.ExtendsKeyword:
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.FinallyKeyword:
            case ts.SyntaxKind.ForKeyword:
            case ts.SyntaxKind.FunctionKeyword:
            case ts.SyntaxKind.IfKeyword:
            case ts.SyntaxKind.ImportKeyword:
            case ts.SyntaxKind.InKeyword:
            case ts.SyntaxKind.InstanceOfKeyword:
            case ts.SyntaxKind.NewKeyword:
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.ReturnKeyword:
            case ts.SyntaxKind.SuperKeyword:
            case ts.SyntaxKind.SwitchKeyword:
            case ts.SyntaxKind.ThisKeyword:
            case ts.SyntaxKind.ThrowKeyword:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.TryKeyword:
            case ts.SyntaxKind.TypeOfKeyword:
            case ts.SyntaxKind.VarKeyword:
            case ts.SyntaxKind.VoidKeyword:
            case ts.SyntaxKind.WhileKeyword:
            case ts.SyntaxKind.WithKeyword:
            // Strict mode reserved words
            case ts.SyntaxKind.ImplementsKeyword:
            case ts.SyntaxKind.InterfaceKeyword:
            case ts.SyntaxKind.LetKeyword:
            case ts.SyntaxKind.PackageKeyword:
            case ts.SyntaxKind.PrivateKeyword:
            case ts.SyntaxKind.ProtectedKeyword:
            case ts.SyntaxKind.PublicKeyword:
            case ts.SyntaxKind.StaticKeyword:
            case ts.SyntaxKind.YieldKeyword:
                throw new Error("Reserved keyword nodes are not supported.");
            // Contextual keywords
            case ts.SyntaxKind.AbstractKeyword:
            case ts.SyntaxKind.AsKeyword:
            case ts.SyntaxKind.AnyKeyword:
            case ts.SyntaxKind.AsyncKeyword:
            case ts.SyntaxKind.AwaitKeyword:
            case ts.SyntaxKind.BooleanKeyword:
            case ts.SyntaxKind.ConstructorKeyword:
            case ts.SyntaxKind.DeclareKeyword:
            case ts.SyntaxKind.GetKeyword:
            case ts.SyntaxKind.IsKeyword:
            case ts.SyntaxKind.ModuleKeyword:
            case ts.SyntaxKind.NamespaceKeyword:
            case ts.SyntaxKind.NeverKeyword:
            case ts.SyntaxKind.ReadonlyKeyword:
            case ts.SyntaxKind.RequireKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.SetKeyword:
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.SymbolKeyword:
            case ts.SyntaxKind.TypeKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.FromKeyword:
            case ts.SyntaxKind.GlobalKeyword:
            case ts.SyntaxKind.OfKeyword:
                throw new Error("Contextual keyword nodes are not supported."); // LastKeyword and LastToken

            // Parse tree nodes

            // Names
            case ts.SyntaxKind.QualifiedName:
                return this.visitQualifiedName(<ts.QualifiedName>node);
            case ts.SyntaxKind.ComputedPropertyName:
                return this.visitComputedPropertyName(<ts.ComputedPropertyName>node);
            // Signature elements
            case ts.SyntaxKind.TypeParameter:
                return this.visitTypeParameter(<ts.TypeParameterDeclaration>node);
            case ts.SyntaxKind.Parameter:
                return this.visitParameter(<ts.ParameterDeclaration>node);
            case ts.SyntaxKind.Decorator:
                return this.visitDecorator(<ts.Decorator>node);
            // TypeMember
            case ts.SyntaxKind.PropertySignature:
            case ts.SyntaxKind.PropertyDeclaration:
            case ts.SyntaxKind.MethodSignature:
            case ts.SyntaxKind.MethodDeclaration:
            case ts.SyntaxKind.Constructor:
            case ts.SyntaxKind.GetAccessor:
            case ts.SyntaxKind.SetAccessor:
            case ts.SyntaxKind.CallSignature:
            case ts.SyntaxKind.ConstructSignature:
            case ts.SyntaxKind.IndexSignature:
                throw new Error("Type member nodes are not supported.")
            // Type
            case ts.SyntaxKind.TypePredicate:
                return this.visitTypePredicate(<ts.TypePredicateNode>node);
            case ts.SyntaxKind.TypeReference:
                return this.visitTypeReference(<ts.TypeReferenceNode>node);
            case ts.SyntaxKind.FunctionType:
                return this.visitFunctionType(<ts.FunctionTypeNode>node);
            case ts.SyntaxKind.ConstructorType:
                return this.visitConstructorType(<ts.ConstructorTypeNode>node);
            case ts.SyntaxKind.TypeQuery:
                return this.visitTypeQuery(<ts.TypeQueryNode>node);
            case ts.SyntaxKind.TypeLiteral:
                return this.visitTypeLiteral(<ts.TypeLiteralNode>node);
            case ts.SyntaxKind.ArrayType:
                return this.visitArrayType(<ts.ArrayTypeNode>node);
            case ts.SyntaxKind.TupleType:
                return this.visitTupleType(<ts.TupleTypeNode>node);
            case ts.SyntaxKind.UnionType:
                return this.visitUnionType(<ts.UnionTypeNode>node);
            case ts.SyntaxKind.IntersectionType:
                return this.visitIntersectionType(<ts.IntersectionTypeNode>node);
            case ts.SyntaxKind.ParenthesizedType:
                return this.visitParenthesizedType(<ts.ParenthesizedTypeNode>node);
            case ts.SyntaxKind.ThisType:
                return this.visitThisType(<ts.ThisTypeNode>node);
            case ts.SyntaxKind.StringLiteralType:
                return this.visitStringLiteralType(<ts.StringLiteralTypeNode>node);
            // Binding patterns
            case ts.SyntaxKind.ObjectBindingPattern:
                return this.visitObjectBindingPattern(<ts.ObjectBindingPattern>node);
            case ts.SyntaxKind.ArrayBindingPattern:
                return this.visitArrayBindingPattern(<ts.ArrayBindingPattern>node);
            case ts.SyntaxKind.BindingElement:
                return this.visitBindingElement(<ts.BindingElement>node);
            // Expression
            case ts.SyntaxKind.ArrayLiteralExpression:
                return this.visitArrayLiteralExpression(<ts.ArrayLiteralExpression>node);
            case ts.SyntaxKind.ObjectLiteralExpression:
                return this.visitObjectLiteralExpression(<ts.ObjectLiteralExpression>node);
            case ts.SyntaxKind.PropertyAccessExpression:
                return this.visitPropertyAccessExpression(<ts.PropertyAccessExpression>node);
            case ts.SyntaxKind.ElementAccessExpression:
                return this.visitElementAccessExpression(<ts.ElementAccessExpression>node);
            case ts.SyntaxKind.CallExpression:
                return this.visitCallExpression(<ts.CallExpression>node);
            case ts.SyntaxKind.NewExpression:
                return this.visitNewExpression(<ts.NewExpression>node);
            case ts.SyntaxKind.TaggedTemplateExpression:
                return this.visitTaggedTemplateExpression(<ts.TaggedTemplateExpression>node);
            case ts.SyntaxKind.TypeAssertionExpression:
                return this.visitTypeAssertionExpression(<ts.TypeAssertion>node);
            case ts.SyntaxKind.ParenthesizedExpression:
                return this.visitParenthesizedExpression(<ts.ParenthesizedExpression>node);
            case ts.SyntaxKind.FunctionExpression:
                return this.visitFunctionExpression(<ts.FunctionExpression>node);
            case ts.SyntaxKind.ArrowFunction:
                return this.visitArrowFunction(<ts.ArrowFunction>node);
            case ts.SyntaxKind.DeleteExpression:
                return this.visitDeleteExpression(<ts.DeleteExpression>node);
            case ts.SyntaxKind.TypeOfExpression:
                return this.visitTypeOfExpression(<ts.TypeOfExpression>node);
            case ts.SyntaxKind.VoidExpression:
                return this.visitVoidExpression(<ts.VoidExpression>node);
            case ts.SyntaxKind.AwaitExpression:
                return this.visitAwaitExpression(<ts.AwaitExpression>node);
            case ts.SyntaxKind.PrefixUnaryExpression:
                return this.visitPrefixUnaryExpression(<ts.PrefixUnaryExpression>node);
            case ts.SyntaxKind.PostfixUnaryExpression:
                return this.visitPostfixUnaryExpression(<ts.PostfixUnaryExpression>node);
            case ts.SyntaxKind.BinaryExpression:
                return this.visitBinaryExpression(<ts.BinaryExpression>node);
            case ts.SyntaxKind.ConditionalExpression:
                return this.visitConditionalExpression(<ts.ConditionalExpression>node);
            case ts.SyntaxKind.TemplateExpression:
                return this.visitTemplateExpression(<ts.TemplateExpression>node);
            case ts.SyntaxKind.YieldExpression:
                return this.visitYieldExpression(<ts.YieldExpression>node);
            case ts.SyntaxKind.SpreadElementExpression:
                return this.visitSpreadElementExpression(<ts.SpreadElementExpression>node);
            case ts.SyntaxKind.ClassExpression:
                return this.visitClassExpression(<ts.ClassExpression>node);
            case ts.SyntaxKind.OmittedExpression:
                return this.visitOmittedExpression(<ts.OmittedExpression>node);
            case ts.SyntaxKind.ExpressionWithTypeArguments:
                return this.visitExpressionWithTypeArguments(<ts.ExpressionWithTypeArguments>node);
            case ts.SyntaxKind.AsExpression:
                return this.visitAsExpression(<ts.AsExpression>node);
            case ts.SyntaxKind.NonNullExpression:
                return this.visitNonNullExpression(<ts.NonNullExpression>node);

            // Misc
            case ts.SyntaxKind.TemplateSpan:
                throw new Error("Template span node not supported.")
            case ts.SyntaxKind.SemicolonClassElement:
                throw new Error("Semicolon class element node not supported.");
            // Element
            case ts.SyntaxKind.Block:
                return this.visitBlock(<ts.Block>node);
            case ts.SyntaxKind.VariableStatement:
                return this.visitVariableStatement(<ts.VariableStatement>node);
            case ts.SyntaxKind.EmptyStatement:
                return this.visitEmptyStatement(<ts.EmptyStatement>node);
            case ts.SyntaxKind.ExpressionStatement:
                return this.visitExpressionStatement(<ts.ExpressionStatement>node);
            case ts.SyntaxKind.IfStatement:
                return this.visitIfStatement(<ts.IfStatement>node);
            case ts.SyntaxKind.DoStatement:
                return this.visitDoStatement(<ts.DoStatement>node);
            case ts.SyntaxKind.WhileStatement:
                return this.visitWhileStatement(<ts.WhileStatement>node);
            case ts.SyntaxKind.ForStatement:
                return this.visitForStatement(<ts.ForStatement>node);
            case ts.SyntaxKind.ForInStatement:
                return this.visitForInStatement(<ts.ForInStatement>node);
            case ts.SyntaxKind.ForOfStatement:
                return this.visitForOfStatement(<ts.ForOfStatement>node);
            case ts.SyntaxKind.ContinueStatement:
                return this.visitContinueStatement(<ts.ContinueStatement>node);
            case ts.SyntaxKind.BreakStatement:
                return this.visitBreakStatement(<ts.BreakStatement>node);
            case ts.SyntaxKind.ReturnStatement:
                return this.visitReturnStatement(<ts.ReturnStatement>node);
            case ts.SyntaxKind.WithStatement:
                return this.visitWithStatement(<ts.WithStatement>node);
            case ts.SyntaxKind.SwitchStatement:
                return this.visitSwitchStatement(<ts.SwitchStatement>node);
            case ts.SyntaxKind.LabeledStatement:
                return this.visitLabeledStatement(<ts.LabeledStatement>node);
            case ts.SyntaxKind.ThrowStatement:
                return this.visitThrowStatement(<ts.ThrowStatement>node);
            case ts.SyntaxKind.TryStatement:
                return this.visitTryStatement(<ts.TryStatement>node);
            case ts.SyntaxKind.DebuggerStatement:
                return this.visitDebuggerStatement(<ts.DebuggerStatement>node);
            case ts.SyntaxKind.VariableDeclaration:
                return this.visitVariableDeclaration(<ts.VariableDeclaration>node);
            case ts.SyntaxKind.VariableDeclarationList:
                return this.visitVariableDeclarationList(<ts.VariableDeclarationList>node);
            case ts.SyntaxKind.FunctionDeclaration:
                return this.visitFunctionDeclaration(<ts.FunctionDeclaration>node);
            case ts.SyntaxKind.ClassDeclaration:
                throw new Error("Class declaration node not supported.");
            case ts.SyntaxKind.InterfaceDeclaration:
                throw new Error("Interface declaration node not supported.");
            case ts.SyntaxKind.TypeAliasDeclaration:
                throw new Error("Type alias declaration node not supported.");
            case ts.SyntaxKind.EnumDeclaration:
                throw new Error("Enum declaration node not supported.");
            case ts.SyntaxKind.ModuleDeclaration:
                throw new Error("Module declaration node not supported.");
            case ts.SyntaxKind.ModuleBlock:
                throw new Error("Module block node not supported.");
            case ts.SyntaxKind.CaseBlock:
                return this.visitCaseBlock(<ts.CaseBlock>node);
            case ts.SyntaxKind.NamespaceExportDeclaration:
               throw new Error("Namespace export declaration node not supported.");
            case ts.SyntaxKind.ImportEqualsDeclaration:
                throw new Error("Import equals declaration node not supported.");
            case ts.SyntaxKind.ImportDeclaration:
                throw new Error("Import declaration node not supported.");
            case ts.SyntaxKind.ImportClause:
                throw new Error("Import clause node not supported.");
            case ts.SyntaxKind.NamespaceImport:
                throw new Error("Namespace import node not supported.");
            case ts.SyntaxKind.NamedImports:
                throw new Error("Named imports node not supported.");
            case ts.SyntaxKind.ImportSpecifier:
                throw new Error("Import specifier node not supported.");
            case ts.SyntaxKind.ExportAssignment:
                throw new Error("Export assignment node not supported.");
            case ts.SyntaxKind.ExportDeclaration:
                throw new Error("Export declaration node not supported.");
            case ts.SyntaxKind.NamedExports:
                throw new Error("Named exports node not supported.");
            case ts.SyntaxKind.ExportSpecifier:
                throw new Error("Export specifier node not supported.");
            case ts.SyntaxKind.MissingDeclaration:
                throw new Error("Missing declaration node not supported.");

            // Module references
            case ts.SyntaxKind.ExternalModuleReference:
                throw new Error("External module reference node not supported.");

            // JSX
            case ts.SyntaxKind.JsxElement:
            case ts.SyntaxKind.JsxSelfClosingElement:
            case ts.SyntaxKind.JsxOpeningElement:
            case ts.SyntaxKind.JsxText:
            case ts.SyntaxKind.JsxClosingElement:
            case ts.SyntaxKind.JsxAttribute:
            case ts.SyntaxKind.JsxSpreadAttribute:
            case ts.SyntaxKind.JsxExpression:
                throw new Error("JSX node not supported.");

            // Clauses
            case ts.SyntaxKind.CaseClause:
                return this.visitCaseClause(<ts.CaseClause>node);
            case ts.SyntaxKind.DefaultClause:
                return this.visitDefaultClause(<ts.DefaultClause>node);
            case ts.SyntaxKind.HeritageClause:
                return this.visitHeritageClause(<ts.HeritageClause>node);
            case ts.SyntaxKind.CatchClause:
                return this.visitCatchClause(<ts.CatchClause>node);

            // Property assignments
            case ts.SyntaxKind.PropertyAssignment:
                return this.visitPropertyAssignment(<ts.PropertyAssignment>node);
            case ts.SyntaxKind.ShorthandPropertyAssignment:
                return this.visitShorthandPropertyAssignment(<ts.ShorthandPropertyAssignment>node);

            // Enum
            case ts.SyntaxKind.EnumMember:
                throw new Error("Enum member node not supported.");
            // Top-level nodes
            case ts.SyntaxKind.SourceFile:
                throw new Error("Source file node not supported.");

            // JSDoc nodes
            case ts.SyntaxKind.JSDocTypeExpression:
            // The * type
            case ts.SyntaxKind.JSDocAllType:
            // The ? type
            case ts.SyntaxKind.JSDocUnknownType:
            case ts.SyntaxKind.JSDocArrayType:
            case ts.SyntaxKind.JSDocUnionType:
            case ts.SyntaxKind.JSDocTupleType:
            case ts.SyntaxKind.JSDocNullableType:
            case ts.SyntaxKind.JSDocNonNullableType:
            case ts.SyntaxKind.JSDocRecordType:
            case ts.SyntaxKind.JSDocRecordMember:
            case ts.SyntaxKind.JSDocTypeReference:
            case ts.SyntaxKind.JSDocOptionalType:
            case ts.SyntaxKind.JSDocFunctionType:
            case ts.SyntaxKind.JSDocVariadicType:
            case ts.SyntaxKind.JSDocConstructorType:
            case ts.SyntaxKind.JSDocThisType:
            case ts.SyntaxKind.JSDocComment:
            case ts.SyntaxKind.JSDocTag:
            case ts.SyntaxKind.JSDocParameterTag:
            case ts.SyntaxKind.JSDocReturnTag:
            case ts.SyntaxKind.JSDocTypeTag:
            case ts.SyntaxKind.JSDocTemplateTag:
            case ts.SyntaxKind.JSDocTypedefTag:
            case ts.SyntaxKind.JSDocPropertyTag:
            case ts.SyntaxKind.JSDocTypeLiteral:
                throw new Error("JSDoc node type not supported.");

            // Synthesized list
            case ts.SyntaxKind.SyntaxList:
                throw new Error("Syntax list node not supported.")
            // Enum value count
            case ts.SyntaxKind.Count:
                throw new Error("Count node not supported.");
            // Markers
            case ts.SyntaxKind.FirstAssignment:
            case ts.SyntaxKind.LastAssignment:
            case ts.SyntaxKind.FirstReservedWord:
            case ts.SyntaxKind.LastReservedWord:
            case ts.SyntaxKind.FirstKeyword:
            case ts.SyntaxKind.LastKeyword:
            case ts.SyntaxKind.FirstFutureReservedWord:
            case ts.SyntaxKind.LastFutureReservedWord:
            case ts.SyntaxKind.FirstTypeNode:
            case ts.SyntaxKind.LastTypeNode:
            case ts.SyntaxKind.FirstPunctuation:
            case ts.SyntaxKind.LastPunctuation:
            case ts.SyntaxKind.FirstToken:
            case ts.SyntaxKind.LastToken:
            case ts.SyntaxKind.FirstTriviaToken:
            case ts.SyntaxKind.LastTriviaToken:
            case ts.SyntaxKind.FirstLiteralToken:
            case ts.SyntaxKind.LastLiteralToken:
            case ts.SyntaxKind.FirstTemplateToken:
            case ts.SyntaxKind.LastTemplateToken:
            case ts.SyntaxKind.FirstBinaryOperator:
            case ts.SyntaxKind.LastBinaryOperator:
            case ts.SyntaxKind.FirstNode:
            case ts.SyntaxKind.FirstJSDocNode:
            case ts.SyntaxKind.LastJSDocNode:
            case ts.SyntaxKind.FirstJSDocTagNode:
            case ts.SyntaxKind.LastJSDocTagNode:
                throw new Error("Marker nodes not supported.")
        }
    }

    protected visitArray<TNode extends ts.Node>(nodes: ts.NodeArray<TNode>): T[] {
        var results: T[] = [];
        for (var i = 0; i < nodes.length; ++i) {
            results.push(this.visit(nodes[i]));
        }

        return results;
    }    
    
    protected visitArrayWith<TNode extends ts.Node, TResult extends T>(nodes: ts.NodeArray<TNode>, visitor: (node: TNode) => TResult): TResult[] {
        var results: TResult[] = [];
        for (var i = 0; i < nodes.length; ++i) {
            results.push(visitor(nodes[i]));
        }

        return results;
    }

    // Literals
    protected visitNumericLiteral(node: ts.Node): T {
        throw new NotImplementedError()
    }

    protected visitStringLiteral(node: ts.StringLiteral): T {
        throw new NotImplementedError()
    }

    // Identifiers
    protected visitIdentifier(node: ts.Identifier): T {
        throw new NotImplementedError()
    }

    // Parse tree nodes

    // Names
    protected visitQualifiedName(node: ts.QualifiedName): T {
        throw new NotImplementedError()
    }

    protected visitComputedPropertyName(node: ts.ComputedPropertyName): T {
        throw new NotImplementedError()
    }

    // Signature elements
    protected visitTypeParameter(node: ts.TypeParameterDeclaration): T {
        throw new NotImplementedError()
    }

    protected visitParameter(node: ts.ParameterDeclaration): T {
        throw new NotImplementedError()
    }

    protected visitDecorator(node: ts.Decorator): T {
        throw new NotImplementedError()
    }

    // Type
    protected visitTypePredicate(node: ts.TypePredicateNode): T {
        throw new NotImplementedError()
    }

    protected visitTypeReference(node: ts.TypeReferenceNode): T {
        throw new NotImplementedError()
    }

    protected visitFunctionType(node: ts.FunctionTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitConstructorType(node: ts.ConstructorTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitTypeQuery(node: ts.TypeQueryNode): T {
        throw new NotImplementedError()
    }

    protected visitTypeLiteral(node: ts.TypeLiteralNode): T {
        throw new NotImplementedError()
    }

    protected visitArrayType(node: ts.ArrayTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitTupleType(node: ts.TupleTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitUnionType(node: ts.UnionTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitIntersectionType(node: ts.IntersectionTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitParenthesizedType(node: ts.ParenthesizedTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitThisType(node: ts.ThisTypeNode): T {
        throw new NotImplementedError()
    }

    protected visitStringLiteralType(node: ts.StringLiteralTypeNode): T {
        throw new NotImplementedError()
    }

    // Binding patterns
    protected visitObjectBindingPattern(node: ts.ObjectBindingPattern): T {
        throw new NotImplementedError()
    }

    protected visitArrayBindingPattern(node: ts.ArrayBindingPattern): T {
        throw new NotImplementedError()
    }

    protected visitBindingElement(node: ts.BindingElement): T {
        throw new NotImplementedError()
    }

    // Expression
    protected visitArrayLiteralExpression(node: ts.ArrayLiteralExpression): T {
        throw new NotImplementedError()
    }

    protected visitObjectLiteralExpression(node: ts.ObjectLiteralExpression): T {
        throw new NotImplementedError()
    }

    protected visitPropertyAccessExpression(node: ts.PropertyAccessExpression): T {
        throw new NotImplementedError()
    }

    protected visitElementAccessExpression(node: ts.ElementAccessExpression): T {
        throw new NotImplementedError()
    }

    protected visitCallExpression(node: ts.CallExpression): T {
        throw new NotImplementedError()
    }

    protected visitNewExpression(node: ts.NewExpression): T {
        throw new NotImplementedError()
    }

    protected visitTaggedTemplateExpression(node: ts.TaggedTemplateExpression): T {
        throw new NotImplementedError()
    }

    protected visitTypeAssertionExpression(node: ts.TypeAssertion): T {
        throw new NotImplementedError()
    }

    protected visitParenthesizedExpression(node: ts.ParenthesizedExpression): T {
        throw new NotImplementedError()
    }

    protected visitFunctionExpression(node: ts.FunctionExpression): T {
        throw new NotImplementedError()
    }

    protected visitArrowFunction(node: ts.ArrowFunction): T {
        throw new NotImplementedError()
    }

    protected visitDeleteExpression(node: ts.DeleteExpression): T {
        throw new NotImplementedError()
    }

    protected visitTypeOfExpression(node: ts.TypeOfExpression): T {
        throw new NotImplementedError()
    }

    protected visitVoidExpression(node: ts.VoidExpression): T {
        throw new NotImplementedError()
    }

    protected visitAwaitExpression(node: ts.AwaitExpression): T {
        throw new NotImplementedError()
    }

    protected visitPrefixUnaryExpression(node: ts.PrefixUnaryExpression): T {
        throw new NotImplementedError()
    }

    protected visitPostfixUnaryExpression(node: ts.PostfixUnaryExpression): T {
        throw new NotImplementedError()
    }

    protected visitBinaryExpression(node: ts.BinaryExpression): T {
        throw new NotImplementedError()
    }

    protected visitConditionalExpression(node: ts.ConditionalExpression): T {
        throw new NotImplementedError()
    }

    protected visitTemplateExpression(node: ts.TemplateExpression): T {
        throw new NotImplementedError()
    }

    protected visitYieldExpression(node: ts.YieldExpression): T {
        throw new NotImplementedError()
    }

    protected visitSpreadElementExpression(node: ts.SpreadElementExpression): T {
        throw new NotImplementedError()
    }

    protected visitClassExpression(node: ts.ClassExpression): T {
        throw new NotImplementedError()
    }

    protected visitOmittedExpression(node: ts.OmittedExpression): T {
        throw new NotImplementedError()
    }

    protected visitExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments): T {
        throw new NotImplementedError()
    }

    protected visitAsExpression(node: ts.AsExpression): T {
        throw new NotImplementedError()
    }

    protected visitNonNullExpression(node: ts.NonNullExpression): T {
        throw new NotImplementedError()
    }


    // Element
    protected visitBlock(node: ts.Block): T {
        throw new NotImplementedError()
    }

    protected visitVariableStatement(node: ts.VariableStatement): T {
        throw new NotImplementedError()
    }

    protected visitEmptyStatement(node: ts.EmptyStatement): T {
        throw new NotImplementedError()
    }

    protected visitExpressionStatement(node: ts.ExpressionStatement): T {
        throw new NotImplementedError()
    }

    protected visitIfStatement(node: ts.IfStatement): T {
        throw new NotImplementedError()
    }

    protected visitDoStatement(node: ts.DoStatement): T {
        throw new NotImplementedError()
    }

    protected visitWhileStatement(node: ts.WhileStatement): T {
        throw new NotImplementedError()
    }

    protected visitForStatement(node: ts.ForStatement): T {
        throw new NotImplementedError()
    }

    protected visitForInStatement(node: ts.ForInStatement): T {
        throw new NotImplementedError()
    }

    protected visitForOfStatement(node: ts.ForOfStatement): T {
        throw new NotImplementedError()
    }

    protected visitContinueStatement(node: ts.ContinueStatement): T {
        throw new NotImplementedError()
    }

    protected visitBreakStatement(node: ts.BreakStatement): T {
        throw new NotImplementedError()
    }

    protected visitReturnStatement(node: ts.ReturnStatement): T {
        throw new NotImplementedError()
    }

    protected visitWithStatement(node: ts.WithStatement): T {
        throw new NotImplementedError()
    }

    protected visitSwitchStatement(node: ts.SwitchStatement): T {
        throw new NotImplementedError()
    }

    protected visitLabeledStatement(node: ts.LabeledStatement): T {
        throw new NotImplementedError()
    }

    protected visitThrowStatement(node: ts.ThrowStatement): T {
        throw new NotImplementedError()
    }

    protected visitTryStatement(node: ts.TryStatement): T {
        throw new NotImplementedError()
    }

    protected visitDebuggerStatement(node: ts.DebuggerStatement): T {
        throw new NotImplementedError()
    }

    protected visitVariableDeclaration(node: ts.VariableDeclaration): T {
        throw new NotImplementedError()
    }

    protected visitVariableDeclarationList(node: ts.VariableDeclarationList): T {
        throw new NotImplementedError()
    }

    protected visitFunctionDeclaration(node: ts.FunctionDeclaration): T {
        throw new NotImplementedError()
    }

    protected visitCaseBlock(node: ts.CaseBlock): T {
        throw new NotImplementedError()
    }

    // Clauses
    protected visitCaseClause(node: ts.CaseClause): T {
        throw new NotImplementedError()
    }

    protected visitDefaultClause(node: ts.DefaultClause): T {
        throw new NotImplementedError()
    }

    protected visitHeritageClause(node: ts.HeritageClause): T {
        throw new NotImplementedError()
    }

    protected visitCatchClause(node: ts.CatchClause): T {
        throw new NotImplementedError()
    }


    // Property assignments
    protected visitPropertyAssignment(node: ts.PropertyAssignment): T {
        throw new NotImplementedError()
    }

    protected visitShorthandPropertyAssignment(node: ts.ShorthandPropertyAssignment): T {
        throw new NotImplementedError()
    }
}