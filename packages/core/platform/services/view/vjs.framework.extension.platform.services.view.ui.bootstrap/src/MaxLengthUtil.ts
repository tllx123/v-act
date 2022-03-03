let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

let _isValLenValid = function (maxLength, value) {
  if (value === null || value === undefined) return true
  // 按照字节处理, 中文按照3字节
  let inputNum = value.replace(/[^\x00-\xff]/g, 'aaa').length
  if (inputNum > maxLength * 1) return false
  else return true
}

let _transforInput = function (maxLength, value) {
  if (maxLength != null && typeof value === 'string') {
    let inputNum = value.replace(/[^\x00-\xff]/g, 'aaa').length //随便用三个字符替换中文计算总字节数
    if (inputNum > maxLength) {
      // 原字符串长度
      let inputValueLen = value.length
      let cutLen = maxLength
      let cutSubString
      let lenCount = 0
      let okFlag = false
      if (inputValueLen <= cutLen / 3) {
        cutSubString = value
        okFlag = true
      }

      if (!okFlag) {
        for (let i = 0; i < inputValueLen; i++) {
          let charCode = value.charCodeAt(i)
          if (charCode >= 0 && charCode <= 128) {
            lenCount += 1
          } else {
            lenCount += 3
          }

          if (lenCount > cutLen) {
            cutSubString = value.substring(0, i)
            okFlag = true
            break
          } else if (lenCount == cutLen) {
            cutSubString = value.substring(0, i + 1)
            okFlag = true
            break
          }
        }
      }

      if (!okFlag) {
        cutSubString = value
      }

      return cutSubString
    } else {
      return value
    }
  }
  return value
}

let _maxLengthHandler = function (maxLength) {
  let _curVal = this.value

  if (!_isValLenValid(maxLength, _curVal)) {
    //var _newVal = _curVal.substring(0, maxLength);
    this.value = _transforInput(maxLength, _curVal)
  }
}

let setMaxLength = function (globalCode, maxLength) {
  let $target = $('#' + globalCode)

  // 处理中文输入法输入拼音时被input事件中断
  let cpLock = false
  $target.on('compositionstart', function () {
    cpLock = true
  })
  $target.on('compositionend', function () {
    cpLock = false
    _maxLengthHandler.call(this, maxLength)
  })

  // 兼容ie9以上 谷歌浏览器
  $target.on('input propertychange', function () {
    if (!cpLock) _maxLengthHandler.call(this, maxLength)
  })

  // 兼容处理 IE8 propertychange,
  // 在输入数值达到最大长度后第二次输入时未触发propertychange
  if (document.all && document.querySelector && !document.addEventListener) {
    $target.on('keypress paste', function () {
      if (!_isValLenValid(maxLength, this.value)) return false
      return true
    })
  }
}

export { setMaxLength }
