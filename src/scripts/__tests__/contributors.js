const {sync: crossSpawnSyncMock} = require('cross-spawn')

const originalExit = process.exit
const originalArgv = process.argv

beforeEach(() => {
  process.exit = jest.fn()
})

afterEach(() => {
  process.exit = originalExit
  process.argv = originalArgv
  jest.resetModules()
})

test('calls all-contributors CLI with args', () => {
  process.argv = ['node', '../contributors', 'add']
  require('../contributors')
  expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1)
  expect(crossSpawnSyncMock).toHaveBeenCalledWith(
    expect.stringMatching('all-contributors'),
    ['add'],
    {stdio: 'inherit'},
  )
})
