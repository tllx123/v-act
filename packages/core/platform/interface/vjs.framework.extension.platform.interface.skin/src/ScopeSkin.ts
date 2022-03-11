import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'

import * as skinVariable from './SkinVariable'

//let sandbox: any

export default class Skin {
  lessScripts
  varScript
  interfaceName
  deps
  css

  constructor(params: Record<string, any>) {
    this.lessScripts = params.lessScripts
    this.varScript = params.varScript
    this.interfaceName = params.interfaceName
    this.deps = params.deps
    this.css = params.css && params.css != '_$NotParseCss' ? params.css : ''
    this.render()
  }

  _getLessService(vjsName: string) {
    throw '暂时未开放此功能'
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

  _getSelfDeps() {
    return this.deps
  }

  render() {
    //			var css = [];
    //			for(var j = 0; j < this.lessScripts.length; j++){
    //				var lessObj = this.lessScripts[j];
    //				if(lessObj.less){
    //					var less = [lessObj.less,this.varScript];
    //					var selfDeps = this._getSelfDeps();
    //					for (var i = 0; i < selfDeps.length; i++) {
    //						this._appendVarScript(less, selfDeps[i]);
    //					}
    //					var res = lessUtil.render({
    //						less: less.join(''),
    //						templates:this.getTemplate(),
    //						scopeId : lessObj.scopedId
    //					});
    //					css.push(res.css);
    //				}else if(lessObj.css){
    //					css.push(lessObj.css);
    //				}
    //			}
    //			environment.parseCssStr(css.join(''));
    if (this.css) {
      environment.parseCssStr(this.css)
    }
  }

  getTemplate() {
    let rs = {}
    let selfDeps = this._getSelfDeps()
    for (let i = 0; i < selfDeps.length; i++) {
      let dep = selfDeps[i]
      let service = this._getLessService(dep)
      /*  if (service) {
        let cfg = service.getTemplate()
        sandbox.util.object.extend(rs, cfg)
      } */
      throw '暂时未开放此功能'
    }
    return rs
  }
}
