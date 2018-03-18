const fs = require('fs')
const { resolve, join } = require('path')
const parseLumpyFile = require('../parseLumpyFile')

jest.mock('fs')

describe('✍️   Parse lumpy.txt file', () => {
  test('😀   It should parse a valid lumpy file and return a list of dependencies', (endTest) => {
    const lumpyFilePath = resolve(join('.', 'lumpy.txt'))
    const lumpyFileContent =
`
http://sources.com/1.js
http://sources.com/2.js
http://sources.com/3.js
`
    fs._mockFiles = {
      [lumpyFilePath]: lumpyFileContent
    }

    const expectedDependencies = [
      'http://sources.com/1.js',
      'http://sources.com/2.js',
      'http://sources.com/3.js'
    ]

    parseLumpyFile(lumpyFilePath)
      .then((dependencies) => {
        expect(dependencies).toEqual(expectedDependencies)
        endTest()
      })
  })

  test('😃   It should parse a valid lumpy file with comments and return a list of dependencies', (endTest) => {
    const lumpyFilePath = resolve(join('.', 'lumpy.txt'))
    const lumpyFileContent =
`
# this is a comment
http://sources.com/1.js
# this is another comment
http://sources.com/2.js
# this is another another comment
http://sources.com/3.js
# this is a trailing comment
`
    fs._mockFiles = {
      [lumpyFilePath]: lumpyFileContent
    }

    const expectedDependencies = [
      'http://sources.com/1.js',
      'http://sources.com/2.js',
      'http://sources.com/3.js'
    ]

    parseLumpyFile(lumpyFilePath)
      .then((dependencies) => {
        expect(dependencies).toEqual(expectedDependencies)
        endTest()
      })
  })

  test('😃   It should fail with an invalid lumpy file (invalid url)', (endTest) => {
    const lumpyFilePath = resolve(join('.', 'lumpy.txt'))
    const lumpyFileContent =
`
# this is an invalid URL
sources.com/1.js
`
    fs._mockFiles = {
      [lumpyFilePath]: lumpyFileContent
    }

    parseLumpyFile(lumpyFilePath)
      .catch((err) => {
        expect(err).toBeInstanceOf(Error)
        expect(err.message.indexOf('Invalid URL in lumpyFile') === 0).toBeTruthy()
        endTest()
      })
  })
})
