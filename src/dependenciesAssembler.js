const { resolve, join } = require('path')
const { createReadStream, createWriteStream, existsSync } = require('fs')
const { createHash } = require('crypto')
const mkdirpsync = require('mkdirpsync')
const got = require('got')
const { Transform } = require('readable-stream')

class DependenciesAssembler extends Transform {
  constructor (dependencies = [], options = {}) {
    super(options)
    this.dependencies = dependencies
    this.cacheFolder = options.cacheFolder
    this.useCache = !options.noCache
    this.currentStream = null
    this.currentStreamName = null
    this.currentWriteCacheStream = null

    // create cache dir if it doesn't exist
    if (this.useCache && !existsSync(this.cacheFolder)) {
      mkdirpsync(this.cacheFolder)
    }

    const nextDependency = () => {
      this.currentStream = null
      this.currentWriteCacheStream = null
      this.currentStreamName = this.dependencies.shift()

      if (!this.currentStreamName) {
        return this.push(null)
      }

      if (this.useCache) {
        const cacheKey = createHash('md5').update(this.currentStreamName).digest('hex')
        const cacheFile = resolve(join(this.cacheFolder, cacheKey))

        if (existsSync(cacheFile)) {
          // if cache file exists read from it
          this.currentStream = createReadStream(cacheFile)
        } else {
          // otherwise write cache
          this.currentWriteCacheStream = createWriteStream(cacheFile)
        }
      }

      this.currentStream = this.currentStream || got.stream(this.currentStreamName)

      if (this.currentWriteCacheStream) {
        this.currentStream
          .pipe(this.currentWriteCacheStream)
      }

      let lastChar
      this.currentStream
        .on('end', () => {
          // adds a safety separator if needed
          if (lastChar !== ';') {
            this.push(';')
          }
          this.push('\n')
          return nextDependency()
        })
        .on('data', (d) => {
          lastChar = d.toString()[d.toString().length - 1]
        })
        .on('error', console.error)
        .pipe(this, { end: false })
    }

    setImmediate(nextDependency)
  }

  _transform (chunk, encoding, callback) {
    return callback(null, chunk)
  }
}

module.exports = DependenciesAssembler
