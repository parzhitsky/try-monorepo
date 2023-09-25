import { RuleTester } from '@typescript-eslint/rule-tester'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { controllerClassMethodProperReturnType as rule } from './controller-class-method-proper-return-type.eslint-rule.js'

async function getExampleCode(filename: 'valid' | `${'' | 'in'}valid-${string}`): Promise<string> {
  const fileUrl = new URL(`example-${filename}`, import.meta.url)
  const filePath = fileURLToPath(fileUrl)
  const fileContents = await readFile(filePath, 'utf8')

  return fileContents
}

new RuleTester({
  parser: '@typescript-eslint/parser',
})
  .run('controller-class-method-proper-return-type', rule, {
    valid: [
      {
        filename: 'cats.controller.ts',
        name: 'valid',
        code: await getExampleCode('valid'),
      },
    ],
    invalid: [
      {
        filename: 'cats.controller.ts',
        name: 'invalid-class-anonymous',
        code: await getExampleCode('invalid-class-anonymous'),
        errors: [{ messageId: 'controller-class-not-anonymous' }],
      },
      {
        filename: 'cats.controller.ts',
        name: 'invalid-postfix-not-proper',
        code: await getExampleCode('invalid-postfix-not-proper'),
        errors: [{ messageId: 'controller-class-name-proper-postfix' }],
      },
      {
        filename: 'cats.controller.ts',
        name: 'invalid-return-type-missing',
        code: await getExampleCode('invalid-return-type-missing'),
        errors: [{ messageId: 'controller-class-method-explicit-return-type' }],
      },
      {
        filename: 'cats.controller.ts',
        name: 'invalid-return-type-not-proper',
        code: await getExampleCode('invalid-return-type-not-proper'),
        errors: [{ messageId: 'controller-class-method-proper-return-type' }],
      },
    ],
  })
