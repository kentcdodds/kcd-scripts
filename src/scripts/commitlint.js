const path = require('path');
const spawn = require('cross-spawn');
const { hasPkgProp, resolveBin, hasFile } = require('../utils');

const args = process.argv.slice(2);
const here = p => path.join(__dirname, p);
const hereRelative = p => here(p).replace(process.cwd(), '.');

const useBuiltinConfig =
  !args.includes('--config') &&
  !args.includes('-g') &&
  !hasFile('commitlint.config.js') &&
  !hasFile('.commitlintrc.js') &&
  !hasFile('.commitlintrc.json') &&
  !hasFile('.commitlintrc.yml') &&
  !hasPkgProp('commitlint');

const config = useBuiltinConfig
  ? ['--config', hereRelative('../config/commitlint.config.js')]
  : [];

const result = spawn.sync(resolveBin('commitlint'), [...config, ...args], {
  stdio: 'inherit',
});

process.exit(result.status);
