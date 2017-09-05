const [executor] = process.argv

const scripts = `${executor} ${require.resolve('../')}`

module.exports = {
  linters: {
    '**/*.+(js|json|less|css|ts)': [`${scripts} format`, 'git add'],
    '.all-contributorsrc': [
      // ling-staged passes arguments to the scripts.
      // to avoid passing these arguments, we do the echo thing
      `${scripts} contributors generate`,
      'git add README.md',
    ],
  },
}
