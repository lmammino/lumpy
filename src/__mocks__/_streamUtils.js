const { Readable, PassThrough } = require('readable-stream')

const createReadableStreamFromString = (str) => {
  const stream = new Readable({read (size) {
    this.push(str)
    this.push(null)
  }})
  return stream
}

const createErrorReadableStream = (err) => {
  const stream = new Readable({read (size) {
    this.emit('error', err)
  }})
  return stream
}

const createWritableStream = (onData) => {
  const stream = new PassThrough()
  stream.on('data', onData)

  return stream
}

module.exports = {
  createReadableStreamFromString,
  createErrorReadableStream,
  createWritableStream
}
