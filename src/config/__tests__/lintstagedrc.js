import * as utilsMock from '../../utils'

jest.mock('../../utils', () => ({
  ...require.requireActual('../../utils'),
  isOptedOut: jest.fn((key, t) => t),
}))

afterEach(() => {
  jest.resetModules()
})

test('includes format and git add when not opted out', () => {
  utilsMock.isOptedOut.mockImplementation((key, t, f) => f)
  const config = require('../lintstagedrc')
  const jsLinter = getJsLinter(config)
  expect(hasFormat(jsLinter)).toBe(true)
  expect(hasGitAdd(jsLinter)).toBe(true)
})

test('does not include format and git add when opted out', () => {
  utilsMock.isOptedOut.mockImplementation((key, t) => t)
  const config = require('../lintstagedrc')
  const jsLinter = getJsLinter(config)
  expect(hasFormat(jsLinter)).toBe(false)
  expect(hasGitAdd(jsLinter)).toBe(false)
})

function hasFormat(linter) {
  return linter.some(l => l.includes('format'))
}

function hasGitAdd(linter) {
  return linter.includes('git add')
}

function getJsLinter(linters) {
  const key = Object.keys(linters).find(
    k => k.includes('*') && k.includes('js'),
  )
  return linters[key]
}
