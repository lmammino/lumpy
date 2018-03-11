const { resolve, join } = require('path')
const { createReadStream, createWriteStream, existsSync, mkdirSync } = require('fs')
const { createHash } = require('crypto')
const got = require('got')
const { Readable } = require('readable-stream')

// TODO add progress events
class DependenciesAssembler extends Readable {
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
      mkdirSync(this.cacheFolder)
    }
  }

  _read (size) {
    // TODO debug
    console.log('READ', size, this.currentStreamName)

    // if a substream is open read from it
    if (this.currentStream) {
      // TODO cannot read data synchronously, use on('data') event
      const chunk = this.currentStream.read(size)
      console.log('CHUNK', chunk)

      if (chunk) {
        if (this.currentWriteCacheStream) {
          this.currentWriteCacheStream.write(chunk)
        }
        return this.push(chunk)
      }
    }

    // if there are no more files to process end the stream
    if (this.dependencies.length === 0) {
      return this.push(null)
    }

    // retrieve a new dependency
    const currentDep = this.dependencies.shift()
    this.currentStreamName = currentDep

    // check if dependency has been already downloaded and cached
    if (this.useCache) {
      const cacheKey = createHash('md5').update(currentDep).digest('hex')
      const cacheFile = resolve(join(this.cacheFolder, cacheKey))

      // if cache file exists read from it
      if (existsSync(cacheFile)) {
        this.currentStream = createReadStream(cacheFile)
        return this._read(size)
      }

      // otherwise write cache
      this.currentWriteCacheStream = createWriteStream(cacheFile)
    }

    // make http request and read from response stream
    this.currentStream = got.stream(currentDep)
    return this._read(size)
  }
}

module.exports = DependenciesAssembler
