const resolveBin = require('resolve-bin')
const spawn = require('cross-spawn')
const rimraf = require('rimraf')
const {fromRoot} = require('../paths')

const argv = process.argv.slice(2)

rimraf.sync(fromRoot('dist'))

const result = spawn.sync(
  resolveBin.sync('babel-cli', {executable: 'babel'}),
  // prettier-ignore
  [
    '--copy-files',
    '--out-dir', 'dist',
    '--ignore', '__tests__,__mocks__',
    'src',
  ].concat(argv),
  {stdio: 'inherit'}
)

process.exit(result)
