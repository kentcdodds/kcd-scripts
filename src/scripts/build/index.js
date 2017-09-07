if (process.argv.includes('--browser')) {
  require('./rollup')
} else {
  require('./babel')
}
