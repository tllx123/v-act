import * as aes from '../cryptoJS/aes'

// Use native String.trim function wherever possible
let trim = function (text: string | null) {
  return text == null
    ? ''
    : text.toString().replace(/^\s+/g, '').replace(/\s+$/g, '')
}
/*@params {Object}
 * {
 * 		"name":name
 *  	"value":name
 *  	"options":name
 *  	"isNotEncrypt":name
 *
 * }
 */

//vcookie = function (name, value, options,isNotEncrypt) {
let vcookie = function (params: Record<string, any>) {
  //des密钥
  let secretKey = 'toonev3'
  //des明文前缀
  let desValuePrefix = 'des:'

  if (typeof params.value != 'undefined') {
    // name and value given, set cookie
    params.options = params.options || {}
    if (params.value === null) {
      params.value = ''
      params.options.expires = -1
    }

    //加密
    let desValue = desValuePrefix + params.value
    let encryptedValue = null
    //encryptedValue=desUtil.encrypt(secretKey,desValue);
    //改用新的算法，因为原来的加密算法，解密后可能会多3个\0
    if (!params.isNotEncrypt) {
      encryptedValue = aes.CryptoJS.AES.encrypt(desValue, secretKey).toString()

      params.value = encryptedValue
    }

    let expires = ''
    if (
      params.options.expires &&
      (typeof params.options.expires == 'number' ||
        params.options.expires.toUTCString)
    ) {
      let date
      if (typeof params.options.expires == 'number') {
        date = new Date()
        date.setTime(
          date.getTime() + params.options.expires * 24 * 60 * 60 * 1000
        )
      } else {
        date = params.options.expires
      }
      expires = '; expires=' + date.toUTCString() // use expires attribute, max-age is not supported by IE
    }
    let path = params.options.path ? '; path=' + params.options.path : ''
    let domain = params.options.domain
      ? '; domain=' + params.options.domain
      : ''
    let secure = params.options.secure ? '; secure' : ''
    document.cookie = [
      params.name,
      '=',
      encodeURIComponent(params.value),
      expires,
      path,
      domain,
      secure
    ].join('')
  } else {
    // only name given, get cookie
    let cookieValue = null
    if (document.cookie && document.cookie != '') {
      let cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        let cookie = trim(cookies[i])
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, params.name.length + 1) == params.name + '=') {
          cookieValue = decodeURIComponent(
            cookie.substring(params.name.length + 1)
          )
          break
        }
      }
    }
    if (!params.isNotEncrypt) {
      try {
        let decryptedValue = null
        //decryptedValue=desUtil.decrypt(secretKey,cookieValue);
        //改用新的算法，因为原来的加密算法，解密后可能会多3个\0

        let decryptedObj = aes.CryptoJS.AES.decrypt(cookieValue, secretKey)
        decryptedValue = decryptedObj.toString(aes.CryptoJS.enc.Utf8)

        //如果明文存在des:标志，表明是合法的des明文,因为如果待解密的字符串不是des加密而成的但符合密文格式，也能解密的，
        //但此时解密出来的字符串并不是期望的，所以手工增加此标志来加以区分
        if (decryptedValue.indexOf(desValuePrefix) == 0) {
          decryptedValue = decryptedValue.replace(desValuePrefix, '')
          cookieValue = decryptedValue
        }
      } catch (e) {
        //报错则说明是普通的字符串不是des密文
      }
    }
    return cookieValue
  }
}

export { vcookie }
