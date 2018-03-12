const { Transform } = require('readable-stream')

const promise = (stream) => new Promise((resolve, reject) => {
  let buffers = []
  stream
    .on('data', (d) => buffers.push(d))
    .on('error', reject)
    .on('end', () => resolve(Buffer.concat(buffers)))
})

class StreamAccumulator extends Transform {
  constructor (options = {}) {
    super(options)
    this.buffers = []
  }

  _transform (chunk, encoding, done) {
    this.buffers.push(chunk)
    done()
  }

  _flush (done) {
    this.push(Buffer.concat(this.buffers))
    done()
  }
}

const stream = () => new StreamAccumulator()

module.exports = {
  promise,
  stream,
  StreamAccumulator
}
