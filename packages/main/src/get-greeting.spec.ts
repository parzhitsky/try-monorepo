import { getGreeting } from './get-greeting.js'

describe(getGreeting, () => {
  it('should return "Hi mom!"', () => {
    expect(getGreeting()).toEqual('Hi mom!')
  })
})
