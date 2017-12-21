const path = require('path');
const { getInstalledPathSync } = require('get-installed-path');

try {
  const cliPath = getInstalledPathSync('commitizen', {
    paths: process.mainModule.paths
  });
  const gitCzPath = path.resolve(cliPath, './dist/cli/git-cz.js');
  const gitCz = require(gitCzPath);
  const adapterPath = getInstalledPathSync('cz-conventional-changelog', {
    paths: process.mainModule.paths
  });
  gitCz.bootstrap({
    cliPath,
    config: {
      path: adapterPath
    }
  });
} catch (err) {
  throw err;
}
