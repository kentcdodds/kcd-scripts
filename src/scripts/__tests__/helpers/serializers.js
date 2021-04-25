import slash from 'slash'

// this converts windows style file paths to unix...
export const winPathSerializer = {
  print: val => slash(val),
  test: val => typeof val === 'string' && val.includes('\\'),
}

export const relativePathSerializer = {
  print: val => normalizePaths(val),
  test: val => normalizePaths(val) !== val,
}

function normalizePaths(value) {
  if (typeof value !== 'string') {
    return value
  }
  return slash(value.split(process.cwd()).join('<PROJECT_ROOT>'))
}
