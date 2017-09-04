const [executor] = process.argv

module.exports = {
  linters: {
    '**/*.+(js|json|less|css|ts)': [
      `${executor} ${require.resolve('../')} format`,
      'git add',
    ],
  },
}
