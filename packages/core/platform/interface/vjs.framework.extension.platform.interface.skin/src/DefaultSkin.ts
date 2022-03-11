import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { Record } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

import * as skinVariable from './SkinVariable'

//let sandbox: any = 1

export default class Skin {
  lessScript
  varScript
  interfaceName
  deps
  templateInfo: Record<string, any>
  css
  constructor(params: Record<string, any>) {
    this.lessScript = params.lessScript
    this.varScript = params.varScript
    this.interfaceName = params.interfaceName
    this.deps = params.deps
    this.templateInfo = {}
    this.css = params.css && params.css != '_$NotParseCss' ? params.css : ''
    this.render()
  }

  render() {
    //			var selfDeps = this._getSelfDeps();
    //			var less = [this.varScript,this.lessScript,this.getVarScript()];
    /*for (var i = 0; i < selfDeps.length; i++) {
            this._appendVarScript(less, selfDeps[i]);
        }*/
    //less.push(this.lessScript);
    //			var res = lessUtil.render({
    //				less: less.join(''),
    //				templates:this.getTemplate()
    //			});
    //			this.templateInfo.template = res.template;
    //			this.templateInfo.templateId = res.templateId;
    if (this.css && environment) {
      environment.parseCssStr(this.css)
    }
  }

  getDeps() {
    /* let deps = this._getSelfDeps()解开注释
    let rs:Array<any> = [],
      depArray:Array<any> = []
    for (let i = 0; i < deps.length; i++) {
      let dep = deps[i]
      let service = this._getLessService(dep)
      rs.push(dep)
      if (service) {
        let depList = service.getDeps()
        depArray = arrayUtils.union(depList, depArray)
      }
    }
    return arrayUtils.union(depArray, rs) */
    throw '暂时未开放此功能'
  }

  getTemplate() {
    /* let rs: Record<string, any> = {}
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
    return rs 解开注释*/
    throw '暂时未开放此功能'
  }

  getVarScript() {
    /* let scripts = this.iterateVarScript()
    let buffer = []
    for (let i = 0; i < scripts.length; i++) {
      buffer.push(scripts[i].script)
    }
    return buffer.join('') 解开注释*/
    throw '暂时未开放此功能'
  }

  iterateVarScript(res?: Array<any>) {
    /* res = res || []
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
    return res 解开注释*/
    throw '暂时未开放此功能'
  }

  getLess() {
    /* let deps = this.getDeps()
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
    return buffer.join('\n') 解开注释*/
    throw '暂时未开放此功能'
  }

  _getLessService(vjsName: string) {
    throw '暂时未开放此功能'
    //return sandbox.getService(vjsName + '.lessTemplate')
  }

  _getInterfaceVarScript(interfaceName: string) {
    return skinVariable.getVarScript({
      id: interfaceName
    })
  }

  _getSelfDeps() {
    return this.deps || []
  }
}
