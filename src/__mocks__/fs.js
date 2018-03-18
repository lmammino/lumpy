// provides mocks for `createReadStream`, `createWriteStream` and `existsSync` in `fs`
const { createReadableStreamFromString, createErrorReadableStream, createWritableStream } = require('./_streamUtils')

const fs = jest.genMockFromModule('fs')

fs._mockFiles = {}

const createReadStream = jest.fn((path) => {
  if (!fs._mockFiles[path]) {
    const error = new Error(`ENOENT: no such file or directory, open '${path}'`)
    return createErrorReadableStream(error)
  }

  return createReadableStreamFromString(fs._mockFiles[path])
})

const createWriteStream = jest.fn((path) => {
  return createWritableStream((data) => {
    if (!fs._mockFiles[path]) {
      fs._mockFiles[path] = ''
    }

    fs._mockFiles[path] += data.toString()
  })
})

const existsSync = jest.fn((path) => {
  if (!fs._mockFiles[path]) {
    return false
  }

  return true
})

fs.createReadStream = createReadStream
fs.createWriteStream = createWriteStream
fs.existsSync = existsSync

module.exports = fs
