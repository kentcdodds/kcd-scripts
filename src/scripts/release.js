const spawn = require('cross-spawn');
const { resolveBin, pkg, parseEnv } = require('../utils');

const shouldRelease = [
  pkg.version === '0.0.0-semantically-released',
  parseEnv('CIRCLECI', false),
  process.env.CIRCLE_BRANCH === 'master',
  !parseEnv('CI_PULL_REQUEST', false)
].every(Boolean);

if (shouldRelease) {
  const result = spawn.sync(
    resolveBin('semantic-release'),
    ['--verify-conditions=@semantic-release/npm,@semantic-release/github'],
    {
      stdio: 'inherit'
    }
  );
  process.exit(result.status);
} else {
  console.log(
    'Release conditions not met: should be in CI with pkg.version set correctly. Skipping release script.'
  );
}
