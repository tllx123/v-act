let template
let aStatement

let easyTemplate = function (s, d) {
  if (!s) {
    return ''
  }
  if (s != template) {
    template = s
    aStatement = parsing(separate(s))
  }
  let aST = aStatement
  let process = function (d2) {
    if (d2) {
      d = d2
    }
    return arguments.callee
  }
  process.toString = function () {
    return new Function(aST[0], aST[1])(d)
  }
  return process
}

let separate = function (s) {
  let r = /\\'/g
  let sRet = s.replace(
    /(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g,
    function (a, b, c, d, e, f, g, h) {
      if (b) {
        // 处理if标签中的表达式：
        // 处理前：<#if (${sys_user[0]} != null)>
        // 处理后：if(data.sys_user[0] != null)
        d = d.replace(/\$\{([^\}]*?)\}/g, function (a, b) {
          return '(data.' + b.replace(r, "'") + ')'
        })
        return '{|}' + (c ? '-' : '+') + d + '{|}'
      }
      if (e) {
        return "\\'"
      }
      if (f) {
        return ''
      }
      //if(g){return '\'+(data.'+h.replace(r,'\'')+')+\'';}
      if (g) {
        return (
          '{|}+if (data.' +
          h.replace(r, "'") +
          '){|}' +
          "'+(data." +
          h.replace(r, "'") +
          ")+'" +
          '{|}-if{|}'
        )
      }
    }
  )
  return sRet
}

let parsing = function (s) {
  let mName,
    vName,
    sTmp,
    aTmp,
    sFL,
    sEl,
    aList,
    aStm = ['var aRet = [];']
  aList = s.split(/\{\|\}/)
  let r = /\s/
  while (aList.length) {
    sTmp = aList.shift()
    if (!sTmp) {
      continue
    }
    sFL = sTmp.charAt(0)
    if (sFL !== '+' && sFL !== '-') {
      sTmp = "'" + sTmp + "'"
      aStm.push('aRet.push(' + sTmp + ');')
      continue
    }
    aTmp = sTmp.split(r)
    switch (aTmp[0]) {
      case '+macro':
        mName = aTmp[1]
        vName = aTmp[2]
        aStm.push('aRet.push("<!--' + mName + ' start-->");')
        break
      case '-macro':
        aStm.push('aRet.push("<!--' + mName + ' end-->");')
        break
      case '+if':
        aTmp.splice(0, 1)
        aStm.push('if' + aTmp.join(' ') + '{')
        break
      case '+elseif':
        aTmp.splice(0, 1)
        aStm.push('}else if' + aTmp.join(' ') + '{')
        break
      case '-if':
        aStm.push('}')
        break
      case '+else':
        aStm.push('}else{')
        break
      case '+list':
        aStm.push(
          'if(' +
            aTmp[1] +
            '&&' +
            aTmp[1] +
            '.constructor === Array){with({i:0,l:' +
            aTmp[1] +
            '.length,' +
            aTmp[3] +
            '_index:0,' +
            aTmp[3] +
            ':null}){for(i=l;i--;){' +
            aTmp[3] +
            '_index=(l-i-1);' +
            aTmp[3] +
            '=' +
            aTmp[1] +
            '[' +
            aTmp[3] +
            '_index];'
        )
        break
      case '-list':
        aStm.push('}}}')
        break
      default:
        break
    }
  }
  aStm.push('return aRet.join("");')
  if (!vName) {
    aStm.unshift('var data = arguments[0];')
  }
  return [vName, aStm.join('')]
}

export { easyTemplate }
