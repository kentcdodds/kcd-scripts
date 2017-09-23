module.exports = babelPluginEnvBuild

function babelPluginEnvBuild({types: t}) {
  return {
    name: 'env-build',
    visitor: {
      MemberExpression(path) {
        if (path.get('object').matchesPattern('process.env')) {
          const key = path.toComputedKey()
          if (t.isStringLiteral(key) && key.value.startsWith('BUILD_')) {
            path.replaceWith(t.valueToNode(process.env[key.value]))
          }
        }
      },
    },
  }
}
