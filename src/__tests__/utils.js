jest.mock('read-pkg-up', () => ({
  sync: jest.fn(() => ({pkg: {}, path: '/blah/package.json'})),
}))
jest.mock('which', () => ({sync: jest.fn(() => {})}))

let whichSyncMock, readPkgUpSyncMock

beforeEach(() => {
  jest.resetModules()
  whichSyncMock = require('which').sync
  readPkgUpSyncMock = require('read-pkg-up').sync
})

test('pkg is the package.json', () => {
  const myPkg = {name: 'blah'}
  mockPkg({pkg: myPkg})
  expect(require('../utils').pkg).toBe(myPkg)
})

test('appDirectory is the dirname to the package.json', () => {
  const pkgPath = '/some/path/to'
  mockPkg({path: `${pkgPath}/package.json`})
  expect(require('../utils').appDirectory).toBe(pkgPath)
})

test('resolveKcdScripts resolves to src/index.js when in the kcd-scripts package', () => {
  mockPkg({pkg: {name: 'kcd-scripts'}})
  expect(require('../utils').resolveKcdScripts()).toBe(
    require.resolve('../').replace(process.cwd(), '.'),
  )
})

test('resolveKcdScripts resolves to kcd-scripts if not in the kcd-scripts package', () => {
  mockPkg({pkg: {name: 'not-kcd-scripts'}})
  whichSyncMock.mockImplementationOnce(() => require.resolve('../'))
  expect(require('../utils').resolveKcdScripts()).toBe('kcd-scripts')
})

test(`resolveBin resolves to the full path when it's not in $PATH`, () => {
  expect(require('../utils').resolveBin('cross-env')).toBe(
    require.resolve('cross-env/dist/bin/cross-env').replace(process.cwd(), '.'),
  )
})

test(`resolveBin resolves to the binary if it's in $PATH`, () => {
  whichSyncMock.mockImplementationOnce(() =>
    require.resolve('cross-env/dist/bin/cross-env').replace(process.cwd(), '.'),
  )
  expect(require('../utils').resolveBin('cross-env')).toBe('cross-env')
  expect(whichSyncMock).toHaveBeenCalledTimes(1)
  expect(whichSyncMock).toHaveBeenCalledWith('cross-env')
})

test('getConcurrentlyArgs gives good args to pass to concurrently', () => {
  expect(
    require('../utils').getConcurrentlyArgs({
      build: 'echo build',
      lint: 'echo lint',
      test: 'echo test',
      validate: 'echo validate',
      a: 'echo a',
      b: 'echo b',
      c: 'echo c',
      d: 'echo d',
      e: 'echo e',
      f: 'echo f',
      g: 'echo g',
      h: 'echo h',
      i: 'echo i',
      j: 'echo j',
    }),
  ).toMatchSnapshot()
})

test('parseEnv parses the existing environment variable', () => {
  const globals = {react: 'React', 'prop-types': 'PropTypes'}
  process.env.BUILD_GLOBALS = JSON.stringify(globals)
  expect(require('../utils').parseEnv('BUILD_GLOBALS')).toEqual(globals)
  delete process.env.BUILD_GLOBALS
})

test(`parseEnv returns the default if the environment variable doesn't exist`, () => {
  const defaultVal = {hello: 'world'}
  expect(require('../utils').parseEnv('DOES_NOT_EXIST', defaultVal)).toBe(
    defaultVal,
  )
})

test('ifAnyDep returns the true argument if true and false argument if false', () => {
  mockPkg({pkg: {peerDependencies: {react: '*'}}})
  const t = {a: 'b'}
  const f = {c: 'd'}
  expect(require('../utils').ifAnyDep('react', t, f)).toBe(t)
  expect(require('../utils').ifAnyDep('preact', t, f)).toBe(f)
})

test('ifAnyDep works with arrays of dependencies', () => {
  mockPkg({pkg: {peerDependencies: {react: '*'}}})
  const t = {a: 'b'}
  const f = {c: 'd'}
  expect(require('../utils').ifAnyDep(['preact', 'react'], t, f)).toBe(t)
  expect(require('../utils').ifAnyDep(['preact', 'webpack'], t, f)).toBe(f)
})

test('ifScript returns the true argument if true and the false argument if false', () => {
  mockPkg({pkg: {scripts: {build: 'echo build'}}})
  const t = {e: 'f'}
  const f = {g: 'h'}
  expect(require('../utils').ifScript('build', t, f)).toBe(t)
  expect(require('../utils').ifScript('lint', t, f)).toBe(f)
})

test('ifFile returns the true argument if true and the false argument if false', () => {
  mockPkg({path: require.resolve('../../package.json')})
  const t = {e: 'f'}
  const f = {g: 'h'}
  expect(require('../utils').ifFile('package.json', t, f)).toBe(t)
  expect(require('../utils').ifFile('does-not-exist.blah', t, f)).toBe(f)
})

function mockPkg({pkg = {}, path = '/blah/package.json'}) {
  readPkgUpSyncMock.mockImplementationOnce(() => ({pkg, path}))
}
