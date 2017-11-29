const path = require('path')
const camelcase = require('lodash.camelcase')
const rollupBabel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const json = require('rollup-plugin-json')
const uglify = require('rollup-plugin-uglify')
const nodeBuiltIns = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const {pkg, hasFile, hasPkgProp, parseEnv, ifFile} = require('../utils')

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

const input =
  process.env.BUILD_INPUT ||
  ifFile(`src/${format}-entry.js`, `src/${format}-entry.js`, 'src/index.js')

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

const esm = format === 'esm'

const filename = [
  pkg.name,
  filenameSuffix,
  `.${format}`,
  minify ? '.min' : null,
  '.js',
]
  .filter(Boolean)
  .join('')

const filepath = path.join(
  ...[filenamePrefix, 'dist', filename].filter(Boolean),
)

const output = [{file: filepath, format: esm ? 'es' : format}]

const useBuiltinConfig = !hasFile('.babelrc') && !hasPkgProp('babel')
const babelPresets = useBuiltinConfig ? [here('../config/babelrc.js')] : []

module.exports = {
  input,
  output,
  exports: esm ? 'named' : 'default',
  name,
  external,
  globals,
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
    minify ? uglify() : null,
  ].filter(Boolean),
}
