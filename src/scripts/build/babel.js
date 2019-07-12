const path = require('path')
const spawn = require('cross-spawn')
const yargsParser = require('yargs-parser')
const rimraf = require('rimraf')
const glob = require('glob')
const {hasPkgProp, fromRoot, resolveBin, hasFile} = require('../../utils')

const args = process.argv.slice(2)
const here = p => path.join(__dirname, p)

const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes('--presets') &&
  !hasFile('.babelrc') &&
  !hasFile('.babelrc.js') &&
  !hasFile('babel.config.js') &&
  !hasPkgProp('babel')
const config = useBuiltinConfig
  ? ['--presets', here('../../config/babelrc.js')]
  : []

const builtInIgnore = '**/__tests__/**,**/__mocks__/**'

const ignore = args.includes('--ignore') ? [] : ['--ignore', builtInIgnore]

const copyFiles = args.includes('--no-copy-files') ? [] : ['--copy-files']

const useSpecifiedOutDir = args.includes('--out-dir')
const builtInOutDir = 'dist'
const outDir = useSpecifiedOutDir ? [] : ['--out-dir', builtInOutDir]

if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
  rimraf.sync(fromRoot('dist'))
}

const result = spawn.sync(
  resolveBin('@babel/cli', {executable: 'babel'}),
  [...outDir, ...copyFiles, ...ignore, ...config, 'src'].concat(args),
  {stdio: 'inherit'},
)

// because babel will copy even ignored files, we need to remove the ignored files
const pathToOutDir = fromRoot(parsedArgs.outDir || builtInOutDir)
const ignoredPatterns = (parsedArgs.ignore || builtInIgnore)
  .split(',')
  .map(pattern => path.join(pathToOutDir, pattern))
const ignoredFiles = ignoredPatterns.reduce(
  (all, pattern) => [...all, ...glob.sync(pattern)],
  [],
)
ignoredFiles.forEach(ignoredFile => {
  rimraf.sync(ignoredFile)
})

process.exit(result.status)
