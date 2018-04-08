const path = require('path')
const glob = require('glob')
const camelcase = require('lodash.camelcase')
const rollupBabel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const json = require('rollup-plugin-json')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const nodeBuiltIns = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const omit = require('lodash.omit')
const {
  pkg,
  hasFile,
  hasPkgProp,
  parseEnv,
  ifFile,
  fromRoot,
  uniq,
  writeExtraEntry,
} = require('../utils')

const here = p => path.join(__dirname, p)
const capitalize = s => s[0].toUpperCase() + s.slice(1)

const minify = parseEnv('BUILD_MINIFY', false)
const format = process.env.BUILD_FORMAT
const isPreact = parseEnv('BUILD_PREACT', false)
const isNode = parseEnv('BUILD_NODE', false)
const name = process.env.BUILD_NAME || capitalize(camelcase(pkg.name))

const defaultGlobals = Object.keys(pkg.peerDependencies || {}).reduce(
  (deps, dep) => {
    deps[dep] = capitalize(camelcase(dep))
    return deps
  },
  {},
)

const defaultExternal = Object.keys(pkg.peerDependencies || {})

const input = glob.sync(
  fromRoot(
    process.env.BUILD_INPUT ||
      ifFile(
        `src/${format}-entry.js`,
        `src/${format}-entry.js`,
        'src/index.js',
      ),
  ),
)
const codeSplitting = input.length > 1

if (
  codeSplitting &&
  uniq(input.map(single => path.basename(single))).length !== input.length
) {
  throw new Error(
    'Filenames of code-splitted entries should be unique to get deterministic output filenames.' +
      `\nReceived those: ${input}.`,
  )
}

const filenameSuffix = process.env.BUILD_FILENAME_SUFFIX || ''
const filenamePrefix =
  process.env.BUILD_FILENAME_PREFIX || (isPreact ? 'preact/' : '')
const globals = parseEnv(
  'BUILD_GLOBALS',
  isPreact ? Object.assign(defaultGlobals, {preact: 'preact'}) : defaultGlobals,
)
const external = parseEnv(
  'BUILD_EXTERNAL',
  isPreact ? defaultExternal.concat(['preact', 'prop-types']) : defaultExternal,
).filter((e, i, arry) => arry.indexOf(e) === i)

if (isPreact) {
  delete globals.react
  delete globals['prop-types'] // TODO: is this necessary?
  external.splice(external.indexOf('react'), 1)
}

const externalPattern = new RegExp(`^(${external.join('|')})($|/)`)
const externalPredicate =
  external.length === 0 ? () => false : id => externalPattern.test(id)

const esm = format === 'esm'
const umd = format === 'umd'

const filename = [
  pkg.name,
  filenameSuffix,
  `.${format}`,
  minify ? '.min' : null,
  '.js',
]
  .filter(Boolean)
  .join('')

const dirpath = path.join(...[filenamePrefix, 'dist'].filter(Boolean))

const output = [
  {
    name,
    ...(codeSplitting
      ? {dir: path.join(dirpath, format)}
      : {file: path.join(dirpath, filename)}),
    format: esm ? 'es' : format,
    exports: esm ? 'named' : 'auto',
    globals,
  },
]

const useBuiltinConfig = !hasFile('.babelrc') && !hasPkgProp('babel')
const babelPresets = useBuiltinConfig ? [here('../config/babelrc.js')] : []

const replacements = Object.entries(
  umd ? process.env : omit(process.env, ['NODE_ENV']),
).reduce((acc, [key, value]) => {
  let val
  if (value === 'true' || value === 'false' || Number.isInteger(+value)) {
    val = value
  } else {
    val = JSON.stringify(value)
  }
  acc[`process.env.${key}`] = val
  return acc
}, {})

module.exports = {
  input: codeSplitting ? input : input[0],
  output,
  experimentalCodeSplitting: codeSplitting,
  external: externalPredicate,
  plugins: [
    isNode ? nodeBuiltIns() : null,
    isNode ? nodeGlobals() : null,
    nodeResolve({preferBuiltins: isNode, jsnext: true, main: true}),
    commonjs({include: 'node_modules/**'}),
    json(),
    rollupBabel({
      exclude: 'node_modules/**',
      presets: babelPresets,
      babelrc: true,
    }),
    replace(replacements),
    minify ? uglify() : null,
    codeSplitting &&
      ((writes = 0) => ({
        onwrite() {
          if (++writes !== input.length) {
            return
          }

          input
            .filter(single => single.indexOf('index.js') === -1)
            .forEach(single => {
              const chunk = path.basename(single)

              writeExtraEntry(chunk.replace(/\..+$/, ''), {
                cjs: `${dirpath}/cjs/${chunk}`,
                esm: `${dirpath}/esm/${chunk}`,
              })
            })
        },
      }))(),
  ].filter(Boolean),
}
