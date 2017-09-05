const fs = require('fs')
const path = require('path')
const readPkgUp = require('read-pkg-up')
const arrify = require('arrify')
const has = require('lodash.has')

function resolveBin(modName, {executable = modName} = {}) {
  const pkgPath = require.resolve(`${modName}/package.json`)
  const pkgDir = path.dirname(pkgPath)
  const {bin} = require(pkgPath)
  if (typeof bin === 'string') {
    return path.join(pkgDir, bin)
  }
  return path.join(pkgDir, bin[executable])
}

const appDirectory = fs.realpathSync(process.cwd())
const fromRoot = (...p) => path.join(appDirectory, ...p)

const getPkg = () => readPkgUp.sync({cwd: process.cwd()}).pkg || {}

const hasPkgProp = props => arrify(props).some(prop => has(getPkg(), prop))

const hasPkgSubProp = pkgProp => props =>
  hasPkgProp(arrify(props).map(p => `${pkgProp}.${p}`))

const ifPkgSubProp = pkgProp => (props, t, f) =>
  hasPkgSubProp(pkgProp, props) ? t : f

const hasPeerDep = hasPkgSubProp('peerDependencies')
const hasDep = hasPkgSubProp('dependencies')
const hasDevDep = hasPkgSubProp('devDependencies')
const hasAnyDep = (...args) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(...args))

const ifPeerDep = ifPkgSubProp('peerDependencies')
const ifDep = ifPkgSubProp('dependencies')
const ifDevDep = ifPkgSubProp('devDependencies')
const ifAnyDep = (deps, t, f) => (hasAnyDep(deps) ? t : f)
const ifScript = ifPkgSubProp('scripts')

module.exports = {
  ifDevDep,
  ifPeerDep,
  ifScript,
  ifDep,
  ifAnyDep,
  hasPkgProp,
  appDirectory,
  fromRoot,
  resolveBin,
}
