if (process.argv.includes('--browser')) {
  console.error('--browser has been deprecated, use --bundle instead');
}

if (process.argv.includes('--bundle') || process.argv.includes('--browser')) {
  require('./rollup');
} else {
  require('./babel');
}
