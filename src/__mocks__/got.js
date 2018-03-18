// provides mocks for `got.stream`

const {createReadableStreamFromString, createErrorReadableStream} = require('./_streamUtils')

const got = jest.genMockFromModule('got')

let _mockRequests = {}
got.__setMockRequests = (requests) => { _mockRequests = requests }

const stream = jest.fn((url) => {
  if (!_mockRequests[url]) {
    return createErrorReadableStream(new Error('Not found'))
  }

  return createReadableStreamFromString(_mockRequests[url])
})

got.stream = stream

module.exports = got
