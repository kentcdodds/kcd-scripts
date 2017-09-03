const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const fromRoot = (...p) => path.join(appDirectory, ...p)

module.exports = {appDirectory, fromRoot}
