const Component = require('./Component')
const fs = require('fs')

class XmlComponent extends Component {
  constructor(filePath) {
    super(filePath)
  }

  _getContent() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.getFilePath())) {
        fs.readFile(this.getFilePath(), (err, data) => {
          if (err) {
            return reject(err)
          }
          resolve(new String(data))
        })
      } else {
        reject(Error('文件不存在！path=' + this.getFilePath()))
      }
    })
  }

  generate() {
    return new Promise((resolve, reject) => {
      this._getContent()
        .then((xmlContent) => {
          this.setXmlContent(xmlContent)
          super
            .generate()
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
  }
}

module.exports = XmlComponent
