import * as skinVariable from './SkinVariable'
import { ArrayUtil as arrayUtils } from '@v-act/vjs.framework.extension.util'
import { lessUtil as lessUtil } from '@v-act/vjs.framework.extension.util.style.preprocessor'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'

let sandbox

let Skin = function (params) {
  this.lessScript = params.lessScript
  this.varScript = params.varScript
  this.interfaceName = params.interfaceName
  this.deps = params.deps
  this.templateInfo = {}
  this.render()
}

Skin.prototype = {
  initModule: function (sb) {
    sandbox = sb
  },

  render: function () {
    let selfDeps = this._getSelfDeps()
    let less = [this.varScript, this.lessScript, this.getVarScript()]
    /*for (var i = 0; i < selfDeps.length; i++) {
            this._appendVarScript(less, selfDeps[i]);
        }*/
    //less.push(this.lessScript);
    let res = lessUtil.render({
      less: less.join(''),
      templates: this.getTemplate()
    })
    this.templateInfo.template = res.template
    this.templateInfo.templateId = res.templateId
    environment.parseCssStr(res.css)
  },

  getDeps: function () {
    let deps = this._getSelfDeps()
    let rs = [],
      depArray = []
    for (let i = 0; i < deps.length; i++) {
      let dep = deps[i]
      let service = this._getLessService(dep)
      rs.push(dep)
      if (service) {
        let depList = service.getDeps()
        depArray = arrayUtils.union(depList, depArray)
      }
    }
    return arrayUtils.union(depArray, rs)
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
    if (this.templateInfo.templateId) {
      rs[this.templateInfo.templateId] = this.templateInfo.template
    }
    return rs
  },

  getVarScript: function () {
    let scripts = this.iterateVarScript()
    let buffer = []
    for (let i = 0; i < scripts.length; i++) {
      buffer.push(scripts[i].script)
    }
    return buffer.join('')
  },

  iterateVarScript: function (res) {
    res = res || []
    let deps = this._getSelfDeps()
    let buffer = []
    for (let i = 0; i < deps.length; i++) {
      let service = this._getLessService(deps[i])
      if (service && service.iterateVarScript) {
        service.iterateVarScript(res)
      }
    }
    for (let i = 0, l = res.length; i < l; i++) {
      let item = res[i]
      if (item.id == this.interfaceName) {
        return res
      }
    }
    let script = this._getInterfaceVarScript(this.interfaceName)
    if (script) {
      res.push({
        id: this.interfaceName,
        script: script
      })
    }
    return res
  },

  getLess: function () {
    let deps = this.getDeps()
    let buffer = []
    for (let i = 0; i < deps.length; i++) {
      let dep = deps[i]
      let service = this._getLessService(dep)
      if (service) {
        let scrpt = service.getLess()
        buffer.push(scrpt)
      }
    }
    buffer.push(this.lessScript)
    return buffer.join('\n')
  },

  _getLessService: function (vjsName) {
    return sandbox.getService(vjsName + '.lessTemplate')
  },

  _getInterfaceVarScript: function (interfaceName) {
    return skinVariable.getVarScript({
      id: interfaceName
    })
  },

  _getSelfDeps: function () {
    return this.deps
  }
}

return Skin
