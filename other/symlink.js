const fs = require('fs')
const path = require('path')

const here = p => path.join(__dirname, p)

const link = here('../node_modules/.bin/kcd-scripts')
if (!fs.existsSync(link)) {
  fs.symlinkSync(here('../src/index.js'), link)
}
