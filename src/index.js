#!/usr/bin/env node
let shouldThrow = false

try {
  const [major, minor] = process.version.slice(1).split('.').map(Number)
  shouldThrow =
    require(`${process.cwd()}/package.json`).name === 'kcd-scripts' &&
    (major < 10 || (major === 10 && minor < 18))
} catch (error) {
  // ignore
}

if (shouldThrow) {
  throw new Error(
    'You must use Node version 10.18 or greater to run the scripts within kcd-scripts, because we dogfood the untranspiled version of the scripts.',
  )
}

require('./run-script')
