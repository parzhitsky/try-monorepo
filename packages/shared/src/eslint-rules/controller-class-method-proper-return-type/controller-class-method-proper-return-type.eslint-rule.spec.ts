import { RuleTester } from '@typescript-eslint/rule-tester'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { controllerClassMethodProperReturnType as rule } from './controller-class-method-proper-return-type.eslint-rule.js'

const invalidCases = [
  { name: 'invalid-class-anonymous', messageId: 'controller-class-not-anonymous' },
  { name: 'invalid-postfix-not-proper', messageId: 'controller-class-name-proper-postfix' },
  { name: 'invalid-return-type-missing', messageId: 'controller-class-method-explicit-return-type' },
  { name: 'invalid-return-type-not-proper', messageId: 'controller-class-method-proper-return-type' },
] as const

type InvalidCaseName = (typeof invalidCases)[number]['name']

async function getCaseCode(caseName: 'valid' | InvalidCaseName): Promise<string> {
  const caseUrl = new URL(`cases/${caseName}.txt`, import.meta.url)
  const casePath = fileURLToPath(caseUrl)
  const caseCode = await readFile(casePath, 'utf8')

  return caseCode
}

new RuleTester({ parser: '@typescript-eslint/parser' }).run('controller-class-method-proper-return-type', rule, {
  valid: [
    {
      filename: 'cats.controller.ts',
      name: 'valid',
      code: await getCaseCode('valid'),
    },
  ],
  invalid: await Promise.all(
    invalidCases.map(async ({ name, messageId }) => ({
      name,
      filename: 'cats.controller.ts',
      code: await getCaseCode(name),
      errors: [{ messageId }],
    })),
  ),
})
