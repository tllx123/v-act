const obj2json = function (obj: object, encodeFunc?: boolean) {
  return encode(obj, encodeFunc)
}

const json2obj = function (json: string) {
  return decode(json)
}

const clone = function (obj: object) {
  let json = encode(obj)
  return decode(json)
}

let useHasOwn = {}.hasOwnProperty ? true : false

let pad = function (n) {
  return n < 10 ? '0' + n : n
}

let s = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r'
}

let regStr = ['([']
for (let key in s) {
  if (s.hasOwnProperty(key)) {
    regStr.push(key)
  }
}
regStr.push('])')

let sReg = new RegExp(regStr.join(''), 'g')

let m = {
  '"': '\\"',
  '\\': '\\\\'
}

let encodeString = function (s: string) {
  if (/["\\\x00-\x1f]/.test(s)) {
    return (
      '"' +
      s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
        var c = m[b] || s[b]
        if (c) {
          return c
        }
        c = b.charCodeAt()
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16)
      }) +
      '"'
    )
  }
  return '"' + s + '"'
}

let encodeArray = function (o: any[], encodeFunc?: boolean) {
  let a = ['['],
    b,
    i,
    l = o.length,
    v
  for (i = 0; i < l; i += 1) {
    v = o[i]
    switch (typeof v) {
      case 'undefined':
      case 'function':
        if (encodeFunc) {
          if (b) {
            a.push(',')
          }
          a.push(encode(i, encodeFunc), ':', v.toString())
          b = true
        }
        break
      case 'unknown':
        break
      default:
        if (b) {
          a.push(',')
        }
        a.push(v === null ? 'null' : encode(v, encodeFunc))
        b = true
    }
  }
  a.push(']')
  return a.join('')
}

let encodeDate = function (o: Date) {
  return (
    '"' +
    o.getFullYear() +
    '-' +
    pad(o.getMonth() + 1) +
    '-' +
    pad(o.getDate()) +
    'T' +
    pad(o.getHours()) +
    ':' +
    pad(o.getMinutes()) +
    ':' +
    pad(o.getSeconds()) +
    '"'
  )
}

let encode = function (o: object, encodeFunc?: boolean) {
  if (typeof o == 'undefined' || o === null) {
    return 'null'
  } else if (Array.isArray(o)) {
    return encodeArray(o, encodeFunc)
  } else if (o instanceof Date) {
    return encodeDate(o)
  } else if (typeof o == 'string') {
    return encodeString(o)
  } else if (typeof o == 'number') {
    return isFinite(o) ? String(o) : 'null'
  } else if (typeof o == 'boolean') {
    return String(o)
  } else if (encodeFunc && typeof o == 'function') {
    return o.toString()
  } else {
    let a = ['{'],
      b,
      i,
      v
    for (i in o) {
      if (!useHasOwn || o.hasOwnProperty(i)) {
        v = o[i]
        switch (typeof v) {
          case 'undefined':
          case 'function':
            if (encodeFunc) {
              if (b) {
                a.push(',')
              }
              a.push(encode(i, encodeFunc), ':', v.toString())
              b = true
            }
            break
          case 'unknown':
            break
          default:
            if (b) {
              a.push(',')
            }
            a.push(
              encode(i, encodeFunc),
              ':',
              v === null ? 'null' : encode(v, encodeFunc)
            )
            b = true
        }
      }
    }
    a.push('}')
    return a.join('')
  }
}

let decode = function (json: string) {
  if (json == null || json == '') {
    return json
  }
  try {
    return new Function(
      'return ' +
        json.replace(sReg, function (a, b) {
          var val = s[b]
          return val ? val : b
        }) +
        ';'
    )()
  } catch (e) {
    if (JSON && JSON.parse) {
      try {
        return JSON.parse(json)
      } catch (e) {
        throw e
      }
    } else {
      throw e
    }
  }
}

export { clone, json2obj, obj2json }
