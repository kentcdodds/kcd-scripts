const path = require('path')
const {DEFAULT_EXTENSIONS} = require('@babel/core')
const spawn = require('cross-spawn')
const yargsParser = require('yargs-parser')
const rimraf = require('rimraf')
const glob = require('glob')
const {
  hasPkgProp,
  fromRoot,
  resolveBin,
  hasFile,
  hasTypescript,
  generateTypeDefs,
} = require('../../utils')

let args = process.argv.slice(2)
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

const extensions =
  args.includes('--extensions') || args.includes('--x')
    ? []
    : ['--extensions', [...DEFAULT_EXTENSIONS, '.ts', '.tsx']]

const builtInIgnore = '**/__tests__/**,**/__mocks__/**'

const ignore = args.includes('--ignore') ? [] : ['--ignore', builtInIgnore]

const copyFiles = args.includes('--no-copy-files') ? [] : ['--copy-files']

const useSpecifiedOutDir = args.includes('--out-dir')
const builtInOutDir = 'dist'
const outDir = useSpecifiedOutDir ? [] : ['--out-dir', builtInOutDir]
const noTypeDefinitions = args.includes('--no-ts-defs')

if (!useSpecifiedOutDir && !args.includes('--no-clean')) {
  rimraf.sync(fromRoot('dist'))
} else {
  args = args.filter(a => a !== '--no-clean')
}

if (noTypeDefinitions) {
  args = args.filter(a => a !== '--no-ts-defs')
}

async function go() {
  let result = spawn.sync(
    resolveBin('@babel/cli', {executable: 'babel'}),
    [
      ...outDir,
      ...copyFiles,
      ...ignore,
      ...extensions,
      ...config,
      'src',
    ].concat(args),
    {stdio: 'inherit'},
  )
  if (result.status !== 0) return result.status

  const pathToOutDir = fromRoot(parsedArgs.outDir || builtInOutDir)

  if (hasTypescript && !noTypeDefinitions) {
    console.log('Generating TypeScript definitions')
    result = await generateTypeDefs(pathToOutDir)
    if (result.status !== 0) return result.status
    console.log('TypeScript definitions generated')
  }

  // because babel will copy even ignored files, we need to remove the ignored files
  const ignoredPatterns = (parsedArgs.ignore || builtInIgnore)
    .split(',')
    .map(pattern => path.join(pathToOutDir, pattern))

  // type def files are compiled to an empty file and they're useless
  // so we'll get rid of those too.
  const typeDefCompiledFiles = path.join(pathToOutDir, '**/*.d.js')
  const ignoredFiles = ignoredPatterns.reduce(
    (all, pattern) => [...all, ...glob.sync(pattern)],
    [typeDefCompiledFiles],
  )
  ignoredFiles.forEach(ignoredFile => {
    rimraf.sync(ignoredFile)
  })

  return result.status
}

go().then(process.exit)
