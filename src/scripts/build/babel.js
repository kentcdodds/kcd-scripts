const path = require('path')
const spawn = require('cross-spawn')
const rimraf = require('rimraf')
const {hasPkgProp, fromRoot, resolveBin, hasFile} = require('../../utils')

const args = process.argv.slice(2)
const here = p => path.join(__dirname, p)

const useBuiltinConfig =
  !args.includes('--presets') && !hasFile('.babelrc') && !hasPkgProp('babel')
const config = useBuiltinConfig
  ? ['--presets', here('../../config/babelrc.js')]
  : []

const ignore = args.includes('--ignore')
  ? []
  : ['--ignore', '__tests__,__mocks__']

const copyFiles = args.includes('--no-copy-files') ? [] : ['--copy-files']

const useDistOutDir = args.includes('--out-dir')
const outDir = useDistOutDir ? [] : ['--out-dir', 'dist']
if (useDistOutDir) {
  rimraf.sync(fromRoot('dist'))
}

const result = spawn.sync(
  resolveBin('babel-cli', {executable: 'babel'}),
  // prettier-ignore
  [
    ...outDir,
    ...copyFiles,
    ...ignore,
    ...config,
    'src',
  ].concat(args),
  {stdio: 'inherit'},
)

process.exit(result.status)
