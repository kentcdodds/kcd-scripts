module.exports = babelPluginEnvBuild

function babelPluginEnvBuild({types: t}) {
  return {
    name: 'env-build',
    visitor: {
      MemberExpression(path) {
        if (path.get('object').matchesPattern('process.env.BUILD_')) {
          const key = path.toComputedKey()
          if (t.isStringLiteral(key)) {
            path.replaceWith(t.valueToNode(process.env[key.value]))
          }
        }
      },
    },
  }
}
