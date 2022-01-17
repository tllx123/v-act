const decompress = require('decompress')
const path = require('path')
const File = require('../utils/File')
const Component = require('./Component')

class ZipComponent extends Component {
  constructor(filePath) {
    super(filePath)
  }

  generate() {
    return new Promise((resolve, reject) => {
      decompress(this.getFilePath(), {
        filter: (file) => {
          return (
            path.basename(file.path) === 'package.xml' ||
            path.dirname(file.path) === 'resource'
          )
        }
      })
        .then((files) => {
          const componentRes = []
          files.forEach((file) => {
            if (path.basename(file.path) === 'package.xml') {
              this.setXmlContent(new String(file.data))
            } else {
              componentRes.push(file)
            }
          })
          super
            .generate()
            .then(() => {
              const componentCode = this.getCode()
              const promises = []
              componentRes.forEach((res) => {
                promises.push(
                  new Promise((resl, rej) => {
                    File.write(
                      path.resolve(
                        process.cwd(),
                        'public',
                        'resources',
                        `${componentCode}_${path.basename(res.path)}`
                      ),
                      res.data
                    )
                      .then(() => {
                        resl()
                      })
                      .catch((err) => {
                        rej(err)
                      })
                  })
                )
              })
              Promise.all(promises)
                .then(() => {
                  resolve()
                })
                .catch((err) => {
                  reject(err)
                })
            })
            .catch((err) => {
              reject(err)
            })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
}

module.exports = ZipComponent
