const path = require('path')
const camelcase = require('lodash.camelcase')
const rollupBabel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const json = require('rollup-plugin-json')
const uglify = require('rollup-plugin-uglify')
const rollupAlias = require('rollup-plugin-alias')
const {pkg, hasFile, hasPkgProp, parseEnv} = require('../utils')

const here = p => path.join(__dirname, p)

const minify = parseEnv('BUILD_MINIFY', false)
const format = process.env.BUILD_FORMAT
const isPreact = parseEnv('BUILD_PREACT', false)

const capitalize = s => s[0].toUpperCase() + s.slice(1)

const defaultGlobals = Object.keys(pkg.peerDependencies).reduce((deps, dep) => {
  deps[dep] = capitalize(camelcase(dep))
  return deps
}, {})

const defaultExternal = Object.keys(pkg.peerDependencies)

const filenameSuffix = parseEnv(
  'BUILD_FILENAME_SUFFIX',
  isPreact ? '.preact' : '',
)
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

const alias = parseEnv('BUILD_ALIAS', isPreact ? {react: 'preact'} : null)
const esm = format === 'esm'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

const filename = path.join('dist', pkg.name)

if (esm) {
  output = [{file: `${filename}${filenameSuffix}.es.js`, format: 'es'}]
} else if (umd) {
  if (minify) {
    output = [
      {
        file: `${filename}${filenameSuffix}.umd.min.js`,
        format: 'umd',
        sourcemap: true,
      },
    ]
  } else {
    output = [
      {
        file: `${filename}${filenameSuffix}.umd.js`,
        format: 'umd',
        sourcemap: true,
      },
    ]
  }
} else if (cjs) {
  output = [{file: `${filename}${filenameSuffix}.cjs.js`, format: 'cjs'}]
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

const useBuiltinConfig = !hasFile('.babelrc') && !hasPkgProp('babel')
const babelPresets = useBuiltinConfig ? [here('../config/babelrc.js')] : []

module.exports = {
  input: 'src/index.js',
  output,
  exports: esm ? 'named' : 'default',
  name: capitalize(camelcase(pkg.name)),
  external,
  globals,
  plugins: [
    alias ? rollupAlias(alias) : null,
    nodeResolve({jsnext: true, main: true}),
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
