#!/usr/bin/env node

let shouldThrow;

try {
  shouldThrow =
    // eslint-disable-next-line global-require,import/no-dynamic-require
    require(`${process.cwd()}/package.json`).name === 'cod-scripts' &&
    Number(process.version.slice(1).split('.')[0]) < 8;
} catch (error) {
  // ignore
}

if (shouldThrow) {
  throw new Error(
    'You must use Node version 8 or greater to run the scripts within cod-scripts ' +
      'because we dogfood the untranspiled version of the scripts.',
  );
}

require('./run-script');
