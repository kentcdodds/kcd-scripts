const fs = require('fs')
const path = require('path')
const {mergeWith} = require('lodash')
const readPkgUp = require('read-pkg-up')

function hasDevDependency(dep) {
  return getPkgProp('devDependencies').hasOwnProperty(dep)
}

function getPkgProp(prop) {
  const {pkg} = readPkgUp.sync({cwd: process.cwd()})
  return pkg[prop]
}

function hasScript(script) {
  return getPkgProp('scripts').hasOwnProperty(script)
}

function ifScript(script, t, f) {
  return hasScript(script) ? t : f
}

function ifDevDep(dep, t, f) {
  return hasDevDependency(dep) ? t : f
}

// this will do a deep merge of two objects
// If the object has a value that's an array,
// then the source's value will be concat-ed with it.
function mergeWithArrayConcat(object, source) {
  return mergeWith(object, source, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      return objValue.concat(srcValue)
    }
    return srcValue
  })
}

function applyOverrides({config = {}, type}) {
  config = applyOverridesToPath({
    config,
    type,
    overrideConfig: readUserConfig()[type],
  })
  return config
}

function readUserConfig() {
  const appDirectory = fs.realpathSync(process.cwd())
  const configPath = path.resolve(path.join(appDirectory, '/kcd.config.js'))
  if (fs.existsSync(configPath)) {
    return require(configPath)
  } else {
    return {}
  }
}

// eslint-disable-next-line complexity
function applyOverridesToPath({config, type, overrideConfig}) {
  if (!overrideConfig) {
    return config
  }
  try {
    if (typeof overrideConfig === 'function') {
      const overrides = overrideConfig(config, process.env.NODE_ENV)
      if (!overrides) {
        throw new Error(
          `${type} overrides function provided, but the config was not returned. You need to return the config`
        )
      }
      return overrides
    } else if (typeof overrideConfig === 'object') {
      return mergeWithArrayConcat(config, overrideConfig)
    }
  } catch (error) {
    console.error(
      `There was a problem trying to apply ${type} config overrides`
    )
    throw error
  }
  return config
}

module.exports = {
  applyOverrides,
  hasDevDependency,
  ifDevDep,
  hasScript,
  ifScript,
}
