const path = require('path')
const fs = require('fs')
const spawn = require('cross-spawn')
const glob = require('glob')
const rimraf = require('rimraf')
const yargsParser = require('yargs-parser')
const {
  hasFile,
  resolveBin,
  fromRoot,
  getConcurrentlyArgs,
  writeExtraEntry,
  hasTypescript,
  generateTypeDefs,
  getRollupInputs,
  getRollupOutput,
} = require('../../utils')

const crossEnv = resolveBin('cross-env')
const rollup = resolveBin('rollup')
const args = process.argv.slice(2)
const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(process.cwd(), '.')
const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes('--config') && !hasFile('rollup.config.js')
const config = useBuiltinConfig
  ? `--config ${hereRelative('../../config/rollup.config.js')}`
  : args.includes('--config')
  ? ''
  : '--config' // --config will pick up the rollup.config.js file

const environment = parsedArgs.environment
  ? `--environment ${parsedArgs.environment}`
  : ''
const watch = parsedArgs.watch ? '--watch' : ''
const sizeSnapshot = parsedArgs['size-snapshot']

let formats = ['esm', 'cjs', 'umd', 'umd.min']

if (typeof parsedArgs.bundle === 'string') {
  formats = parsedArgs.bundle.split(',')
}

const defaultEnv = 'BUILD_ROLLUP=true'

const getCommand = (env, ...flags) =>
  [crossEnv, defaultEnv, env, rollup, config, environment, watch, ...flags]
    .filter(Boolean)
    .join(' ')

const buildPreact = args.includes('--p-react')
const scripts = getConcurrentlyArgs(
  buildPreact ? getPReactCommands() : getCommands(),
)

const cleanBuildDirs = !args.includes('--no-clean')

if (cleanBuildDirs) {
  rimraf.sync(fromRoot('dist'))

  if (buildPreact) {
    rimraf.sync(fromRoot('preact'))
  }
}

function go() {
  let result = spawn.sync(resolveBin('concurrently'), scripts, {
    stdio: 'inherit',
  })

  if (result.status !== 0) return result.status

  if (buildPreact && !args.includes('--no-package-json')) {
    writeExtraEntry(
      'preact',
      {
        cjs: glob.sync(fromRoot('preact/**/*.cjs.js'))[0],
        esm: glob.sync(fromRoot('preact/**/*.esm.js'))[0],
      },
      false,
    )
  }

  if (hasTypescript && !args.includes('--no-ts-defs')) {
    console.log('Generating TypeScript definitions')
    result = generateTypeDefs(fromRoot('dist'))
    if (result.status !== 0) return result.status

    const rollupInputs = getRollupInputs()
    const typeDefFiles = rollupInputs.map(input => {
      return input
        .replace(path.join(process.cwd(), 'src'), 'dist')
        .replace(/\.(t|j)sx?$/, '.d.ts')
    })

    for (const format of formats) {
      const {dirpath, filename} = getRollupOutput(format)

      const isCodesplitting = rollupInputs.length > 1

      const outputs = isCodesplitting
        ? glob.sync(fromRoot(path.join(dirpath, format, '*.js')))
        : [fromRoot(path.join(dirpath, filename))]

      for (const output of outputs) {
        const {name, dir} = path.parse(output)
        const typeDef = isCodesplitting
          ? typeDefFiles.find(f => path.basename(f) === `${name}.d.ts`)
          : 'dist/index.d.ts'
        const relativePath = path
          .join(path.relative(dir, process.cwd()), typeDef)
          .replace(/\.d\.ts$/, '')
        // make a .d.ts file for every generated file that re-exports index.d.ts
        fs.writeFileSync(
          path.join(dir, `${name}.d.ts`),
          `export * from "${relativePath}";\n`,
        )
      }
    }

    // because typescript generates type defs for ignored files, we need to
    // remove the ignored files
    const ignoredFiles = [
      ...glob.sync(fromRoot('dist', '**/__tests__/**')),
      ...glob.sync(fromRoot('dist', '**/__mocks__/**')),
    ]
    ignoredFiles.forEach(ignoredFile => {
      rimraf.sync(ignoredFile)
    })
    console.log('TypeScript definitions generated')
  }

  return result.status
}

function getPReactCommands() {
  return {
    ...prefixKeys('react.', getCommands()),
    ...prefixKeys('preact.', getCommands({preact: true})),
  }
}

function prefixKeys(prefix, object) {
  return Object.entries(object).reduce((cmds, [key, value]) => {
    cmds[`${prefix}${key}`] = value
    return cmds
  }, {})
}

function getCommands({preact = false} = {}) {
  return formats.reduce((cmds, format) => {
    const [formatName, minify = false] = format.split('.')
    const nodeEnv = minify ? 'production' : 'development'
    const sourceMap = formatName === 'umd' ? '--sourcemap' : ''
    const buildMinify = Boolean(minify)

    cmds[format] = getCommand(
      [
        `BUILD_FORMAT=${formatName}`,
        `BUILD_MINIFY=${buildMinify}`,
        `NODE_ENV=${nodeEnv}`,
        `BUILD_PREACT=${preact}`,
        `BUILD_SIZE_SNAPSHOT=${sizeSnapshot}`,
        `BUILD_NODE=${process.env.BUILD_NODE || false}`,
        `BUILD_REACT_NATIVE=${process.env.BUILD_REACT_NATIVE || false}`,
      ].join(' '),
      sourceMap,
    )
    return cmds
  }, {})
}

process.exit(go())
