import * as utils from '@typescript-eslint/utils'

export const controllerClassMethodProperReturnType = utils.ESLintUtils.RuleCreator.withoutDocs({
  defaultOptions: [],
  meta: {
    schema: [],
    type: 'suggestion',
    docs: {
      description: 'Enforce proper return type of controller\'s methods',
    },
    messages: {
      'controller-class-not-anonymous': 'Controller class must not be anonymous',
      'controller-class-name-proper-postfix': "Controller class's name must end with '…Controller'",
      'controller-class-method-explicit-return-type': "Controller class's methods must have an explicit return type annotation",
      'controller-class-method-proper-return-type': "The return type annotation of a controller class's method must be 'Promise<Api.HttpResponseBody<…>>'",
    },
  },
  create: (context) => ({
    ClassDeclaration(classNode) {
      const isControllerFile = context.filename.endsWith('controller.ts')

      // Find all controller classes
      if (!isControllerFile) {
        return
      }

      // Require controller class to have a "Controller" postfix
      if (classNode.id == null) {
        context.report({
          messageId: 'controller-class-not-anonymous',
          node: classNode,
        })
        return
      }

      if (!classNode.id.name.endsWith('Controller')) {
        context.report({
          messageId: 'controller-class-name-proper-postfix',
          node: classNode.id,
        })
        return
      }

      // Find all public methods of the class
      for (const classElement of classNode.body.body) {
        if (
          classElement.type !== 'MethodDefinition' ||
          classElement.accessibility !== 'public'
        ) {
          continue
        }

        const returnTypeAnnotation = classElement.value.returnType?.typeAnnotation

        // The method must have an explicit return type
        // The return type must be 'Promise<Api.HttpResponseBody<…>>', with one type argument
        if (!returnTypeAnnotation) {
          context.report({
            messageId: 'controller-class-method-explicit-return-type',
            node: classElement,
          })
          return
        }

        if (
          returnTypeAnnotation.type !== 'TSTypeReference' ||
          returnTypeAnnotation.typeName.type !== 'Identifier' ||
          returnTypeAnnotation.typeName.name !== 'Promise' ||
          returnTypeAnnotation.typeArguments?.params.length !== 1 ||
          returnTypeAnnotation.typeArguments.params[0].type !== 'TSTypeReference' ||
          returnTypeAnnotation.typeArguments.params[0].typeName.type !== 'TSQualifiedName' ||
          returnTypeAnnotation.typeArguments.params[0].typeName.left.type !== 'Identifier' ||
          returnTypeAnnotation.typeArguments.params[0].typeName.left.name !== 'Api' ||
          returnTypeAnnotation.typeArguments.params[0].typeName.right.name !== 'HttpResponseBody' ||
          returnTypeAnnotation.typeArguments.params[0].typeArguments?.params.length !== 1
        ) {
          context.report({
            messageId: 'controller-class-method-proper-return-type',
            node: returnTypeAnnotation,
          })
        }
      }
    },
  }),
})
