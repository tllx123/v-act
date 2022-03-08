import * as cssScopedPlugins from './cssScopedPlugins'
import * as rpxPlugins from './rpxPlugins'

let lessPlugins,
  template_index = 0

export function initModule() {}

/**
 * 解析less内容，生成css
 * */
let render = function (params) {
  let start = new Date().getTime()
  let result = {}
  if (
    params &&
    (params.less || (params.templates && params.templates.length > 0))
  ) {
    let lessStr = params.less || '',
      templates = params.templates
    let lessConfig = rpxPlugins.getLessPlugin() || {}
    if (templates) {
      let script = []
      let templateCfg = {}
      lessConfig.templates = templateCfg
      for (let id in templates) {
        if (templates.hasOwnProperty(id)) {
          templateCfg[id] = templates[id]
          script.push('@import ')
          script.push('"')
          script.push(id)
          script.push('";')
        }
      }
      script.push(lessStr)
      lessStr = script.join('')
    }
    //lessConfig.strictMath = false;//精确计算，非精确计算模式下calc(100%-60px)会计算出结果为40%，引发样式问题
    //lessConfig.strictUnits = false;
    lessConfig.javascriptEnabled = true
    let name = '@v-deep-selector'
    let newVDeepSelector = ''
    if (lessStr.indexOf(name) != -1 && params.scopeId) {
      newVDeepSelector = '.V_' + params.scopeId
      lessStr += ';' + name + ':' + newVDeepSelector + ';'
    }
    less.render(lessStr, lessConfig, function (_e, _css, _template) {
      let cb = function (e, css, template) {
        let end = new Date().getTime()
        let time = end - start
        if (!window.styleParseTime) {
          window.styleParseTime = time
        } else {
          window.styleParseTime += time
        }
        if (e) {
          if (window && window.console)
            console.error('无法解析less内容，原因：' + e.message)
          console.error('less源码：\n' + lessStr)
        } else {
          let templateId = 'less_template_' + template_index + '.less'
          template_index++
          result.css = css.css
          result.templateId = templateId
          result.template = template
        }
      }
      if (params.scopeId) {
        let sourceCss = _css && _css.css ? _css.css : ''
        let cssScopedConfig =
          cssScopedPlugins.getLessPlugin(params.scopeId, newVDeepSelector) || {}
        less.render(sourceCss, cssScopedConfig, cb)
      } else {
        cb(_e, _css, _template)
      }
    })
  }
  return result
}

export { getLessPlugin, getLessPlugin, render }
