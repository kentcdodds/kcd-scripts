#!/usr/bin/env node
let shouldThrow;
try {
  shouldThrow =
    require(`${process.cwd()}/package.json`).name === '@iopipe/scripts' &&
    Number(process.version.slice(1).split('.')[0]) < 6;
} catch (error) {
  // ignore
}

if (shouldThrow) {
  throw new Error(
    'You must use Node version 6.10 or greater to run the scripts within iopipe-scripts ' +
      'because we dogfood the untranspiled version of the scripts.'
  );
}
require('./run-script');
