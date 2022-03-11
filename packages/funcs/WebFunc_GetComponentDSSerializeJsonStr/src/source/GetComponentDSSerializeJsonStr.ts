import * as dbManager from 'module'
import * as jsonUtil from 'module'

//加载

export function initModule() {}
//主入口(必须有)
const main = function () {
  let retObj: any = {}
  if (arguments.length == 0) {
    //@ts-ignore
    let dbArr = dbManager.getAllDB()
    for (let i = 0; i < dbArr.length; i++) {
      let db = dbArr[i]
      retObj[db.getDBName()] = db.serialize()
    }
  } else if (arguments.length > 0) {
    for (let j = 0; j < arguments.length; j++) {
      //@ts-ignore
      let db = dbManager.getDB(arguments[j])
      retObj[db.getDBName()] = db.serialize()
    }
  }
  //@ts-ignore
  return jsonUtil.obj2json(retObj)
}
export { main }
