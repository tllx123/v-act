import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { LessUtil as lessUtil } from '@v-act/vjs.framework.extension.util.style.preprocessor.less'

import * as skinVariable from './SkinVariable'

//let sandbox: any

export default class Skin {
  lessScript
  deps
  currentSkin: number
  constructor(params: Record<string, any>) {
    this.lessScript = params.lessScript
    this.deps = params.deps
    this.currentSkin = 0
  }

  _getLessService(vjsName: string) {
    throw '此功能暂未开放'
    //return sandbox.getService(vjsName + '.lessTemplate')
  }

  _appendVarScript(buffer: Array<any>, vjsName: string) {
    let varScript = skinVariable.getVarScript({
      id: vjsName
    })
    if (varScript) {
      buffer.push(varScript)
    }
  }

  getTemplate() {
    /* let rs = {}
    let selfDeps = this._getSelfDeps()
    for (let i = 0; i < selfDeps.length; i++) {
      let dep = selfDeps[i]
      let service = this._getLessService(dep)
      if (service) {
        let cfg = service.getTemplate()
        sandbox.util.object.extend(rs, cfg)
      }
    }
    return rs 解开注释*/
    throw '此功能暂未开放'
  }

  _getSelfDeps() {
    return this.deps
  }

  getDeps() {
    /* let deps = this._getSelfDeps()
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
    return arrayUtils.union(depArray, rs) 解开注释*/
    throw '此功能暂未开放'
  }

  _hashcode(str: string) {
    let hash = 0,
      i,
      chr,
      len
    if (str.length === 0) return hash
    for (i = 0, len = str.length; i < len; i++) {
      chr = str.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  render(vars: Record<string, any>) {
    let less = []
    let varScript
    if (vars) {
      let script = []
      for (let name in vars) {
        if (vars.hasOwnProperty(name)) {
          script.push('@')
          script.push(name)
          script.push(':')
          let val = vars[name]
          script.push(val == '' || val == undefined || val == null ? "''" : val)
          script.push(';')
        }
      }
      varScript = script.join('')
    } else {
      varScript = ''
    }
    let hashCode = this._hashcode(varScript)
    if (this.currentSkin != hashCode) {
      this.currentSkin = hashCode
      less.push(this.lessScript)
      less.push(varScript)
      let res: Record<string, any> = lessUtil.render({
        less: less.join(''),
        templates: this.getTemplate()
      })
      environment.parseCssStr(res.css)
    }
  }
}
