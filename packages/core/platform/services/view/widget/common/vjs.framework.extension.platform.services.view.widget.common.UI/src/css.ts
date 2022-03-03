import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'

let undefined
let cssString
exports.initModule = function (sb) {
  cssString = {}
}

/**
 * 通过创建style标签设置控件样式
 *
 * params cloud be Array,JSON
 * [
 * 	{cssName:value,cssValue:value},
 *  {cssName:value,cssValue:value}
 * ]  or
 * {cssName:value,cssValue:value}
 *
 * state同Class 不同样式 是覆盖还是增加 默认覆盖 0
 */
let setWidgetCss = function (widgetCode, params, state) {
  let type = Object.prototype.toString.call(params)
  if (!/Array/i.test(type)) {
    params = [params]
  }
  let WidgetStyle = document.getElementById('proUi')
  if (!WidgetStyle) {
    WidgetStyle = creatStyleTag()
  }

  let now = ''
  let text = WidgetStyle.innerHTML

  for (let i = 0; i < params.length; i++) {
    cssString[params[i].cssName] = state
      ? cssString[params[i].cssName]
        ? assign(cssString[params[i].cssName], params[i].cssValue)
        : params[i].cssValue
      : params[i].cssValue
    if (text.indexOf(params[i].cssName) > -1) {
      now = JsontoString(cssString[params[i].cssName])
      let reg = new RegExp('(' + params[i].cssName + ')' + '({[^{}]*})')
      text = text.replace(reg, '$1' + now)
    } else {
      now = params[i].cssName + JsontoString(cssString[params[i].cssName])
      text += ' ' + now
    }
  }
  WidgetStyle.innerHTML = text
  cssString = {}
}
let creatStyleTag = function () {
  let WidgetStyle = document.createElement('style')
  WidgetStyle.id = 'proUi'
  WidgetStyle.type = 'text/css'
  document.head.appendChild(WidgetStyle)
  return WidgetStyle
}
let assign = function (o1, o2) {
  if (Object.assign) {
    return Object.assign(o1, o2)
  } else {
    for (let attr in o1) {
      if (!o2[attr]) {
        o2[attr] = o1[attr]
      }
    }
    return o2
  }
}
let JsontoString = function (params) {
  let key = ''
  for (let attr in params) {
    key += attr + ':' + params[attr] + ';'
  }
  return '{' + key + '}'
}
export { setWidgetCss }
