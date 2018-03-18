const got = require('got')
const fs = require('fs')
const { createHash } = require('crypto')
const { resolve, join } = require('path')
const StreamAccumulator = require('stream-accumulator')
const DependenciesAssembler = require('../dependenciesAssembler')

jest.mock('got')
jest.mock('fs')
jest.mock('mkdirpsync')

const sources = {
  'http://sources.com/1.js': ';;(function(){ console.log(\'Hello\') })()',
  'http://sources.com/2.js': ';;(function(){ console.log(\'World\') })()',
  'http://sources.com/3.js': ';;(function(){ alert(\'Hello World\') })()'
}

const combinedSources = Object
  .values(sources)
  .reduce((accumulator, current) => {
    accumulator += current
    return accumulator
  }, '')

const cacheKeysMap = Object
  .keys(sources)
  .reduce((accumulator, current) => {
    accumulator[current] = createHash('md5').update(current).digest('hex')
    return accumulator
  }, {})

describe('🥦   Dependency Assembler', () => {
  test('😺   It should emit an the content of the specified dependencies (no cache)', (endTest) => {
    got.__setMockRequests(sources)
    const da = new DependenciesAssembler(Object.keys(sources), { noCache: true })
    StreamAccumulator.promise(da)
      .then((data) => {
        expect(data.toString()).toEqual(combinedSources)
        endTest()
      })
  })

  test('😸   It should emit an the content of the specified dependencies (with cache)', (endTest) => {
    got.__setMockRequests(sources)
    const cacheFolder = resolve(join('.fakecache'))
    const da = new DependenciesAssembler(Object.keys(sources), { cacheFolder })
    StreamAccumulator.promise(da)
      .then((data) => {
        expect(data.toString()).toEqual(combinedSources)
        // verify cache has been created properly
        Object.entries(cacheKeysMap).forEach(([url, hashedKey]) => {
          const path = join(cacheFolder, hashedKey)
          expect(fs._mockFiles[path]).toEqual(sources[url])
        })
        endTest()
      })
  })

  test('😹   It should emit an the content of the specified dependencies (reuse cache)', (endTest) => {
    got.__setMockRequests(sources)
    got.stream.mockClear()
    const cacheFolder = resolve(join('.fakecache'))
    const da = new DependenciesAssembler(Object.keys(sources), { cacheFolder })
    StreamAccumulator.promise(da)
      .then((data) => {
        expect(data.toString()).toEqual(combinedSources)
        expect(got.stream).not.toHaveBeenCalled() // didn't issue new requests
        endTest()
      })
  })

  test('😻   Accepts stream options during construction', (endTest) => {
    const stream = new DependenciesAssembler(undefined, {
      readable: false,
      writable: false,
      allowHalfOpen: false
    })
    expect(stream.readable).toBe(false)
    expect(stream.writable).toBe(false)
    expect(stream.allowHalfOpen).toBe(false)

    // stream with defaults
    const stream2 = new DependenciesAssembler()
    expect(stream2.readable).toBe(true)
    expect(stream2.writable).toBe(true)
    expect(stream2.allowHalfOpen).toBe(true)
    endTest()
  })
})
