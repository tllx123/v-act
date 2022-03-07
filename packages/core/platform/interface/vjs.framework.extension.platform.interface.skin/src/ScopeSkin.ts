import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { lessUtil } from '@v-act/vjs.framework.extension.util.style.preprocessor'

import * as skinVariable from './SkinVariable'

let sandbox

let Skin = function (params) {
  this.lessScripts = params.lessScripts
  this.varScript = params.varScript
  this.interfaceName = params.interfaceName
  this.deps = params.deps
  this.render()
}

Skin.prototype = {
  initModule: function (sb) {
    sandbox = sb
  },

  _getLessService: function (vjsName) {
    return sandbox.getService(vjsName + '.lessTemplate')
  },

  _appendVarScript: function (buffer, vjsName) {
    let varScript = skinVariable.getVarScript({
      id: vjsName
    })
    if (varScript) {
      buffer.push(varScript)
    }
  },

  _getSelfDeps: function () {
    return this.deps
  },

  render: function () {
    let css = []
    for (let j = 0; j < this.lessScripts.length; j++) {
      let lessObj = this.lessScripts[j]
      if (lessObj.less) {
        let less = [lessObj.less, this.varScript]
        let selfDeps = this._getSelfDeps()
        for (let i = 0; i < selfDeps.length; i++) {
          this._appendVarScript(less, selfDeps[i])
        }
        let res = lessUtil.render({
          less: less.join(''),
          templates: this.getTemplate(),
          scopeId: lessObj.scopedId
        })
        css.push(res.css)
      } else if (lessObj.css) {
        css.push(lessObj.css)
      }
    }
    environment.parseCssStr(css.join(''))
  },

  getTemplate: function () {
    let rs = {}
    let selfDeps = this._getSelfDeps()
    for (let i = 0; i < selfDeps.length; i++) {
      let dep = selfDeps[i]
      let service = this._getLessService(dep)
      if (service) {
        let cfg = service.getTemplate()
        sandbox.util.object.extend(rs, cfg)
      }
    }
    return rs
  }
}

module.exports = Skin
