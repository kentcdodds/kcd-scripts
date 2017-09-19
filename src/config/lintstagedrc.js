module.exports = {
  linters: {
    '**/*.+(js|json|less|css|ts)': [
      'kcd-scripts format',
      'kcd-scripts lint',
      'kcd-scripts test --findRelatedTests',
      'git add',
    ],
    '.all-contributorsrc': [
      // lint-staged passes arguments to the scripts.
      // to avoid passing these arguments, we do the echo thing
      'kcd-scripts contributors generate',
      'git add README.md',
    ],
  },
}
