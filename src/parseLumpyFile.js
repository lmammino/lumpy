const readline = require('readline')
const url = require('url')
const { createReadStream } = require('fs')

const parseLumpyFile = (filePath) => new Promise((resolve, reject) => {
  const dependencies = []
  const lineReader = readline.createInterface({
    input: createReadStream(filePath)
  })

  lineReader
    .on('line', function (line) {
      // strips comment lines
      if (line.trim()[0] !== '#') {
        // validates url
        const { protocol } = url.parse(line.trim())
        if (!protocol) {
          return reject(new Error(`Invalid URL in lumpyFile (${filePath}): ${line.trim()}`))
        }
        dependencies.push(line.trim())
      }
    })
    .on('close', () => resolve(dependencies))
    .on('error', reject)
})

module.exports = parseLumpyFile
