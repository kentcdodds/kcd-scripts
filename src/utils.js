const fs = require('fs')
const path = require('path')
const readPkgUp = require('read-pkg-up')
const arrify = require('arrify')

const getPkgProp = prop => readPkgUp.sync({cwd: process.cwd()}).pkg[prop]
const hasPkgProp = (pkgProp, props) =>
  arrify(props).some(prop => (getPkgProp(pkgProp) || {}).hasOwnProperty(prop))
const ifPkgProp = (pkgProp, props, t, f) => (hasPkgProp(pkgProp, props) ? t : f)

const hasPeerDep = hasPkgProp.bind(null, 'peerDependencies')
const hasDep = hasPkgProp.bind(null, 'dependencies')
const hasDevDep = hasPkgProp.bind(null, 'devDependencies')
const hasAnyDep = (...args) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(...args))

const ifPeerDep = ifPkgProp.bind(null, 'peerDependencies')
const ifDep = ifPkgProp.bind(null, 'dependencies')
const ifDevDep = ifPkgProp.bind(null, 'devDependencies')
const ifAnyDep = (deps, t, f) => (hasAnyDep(deps) ? t : f)

const ifScript = ifPkgProp.bind(null, 'scripts')

function ifConfig(type, defaultConfig) {
  const appDirectory = fs.realpathSync(process.cwd())
  const configPath = path.resolve(path.join(appDirectory, '/kcd.config.js'))
  if (fs.existsSync(configPath)) {
    return require(configPath)[type] || defaultConfig
  } else {
    return {}
  }
}

module.exports = {
  ifDevDep,
  ifPeerDep,
  ifScript,
  ifDep,
  ifAnyDep,
  ifConfig,
  hasPkgProp,
}
