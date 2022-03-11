import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'

/**
 * 主入口
 * @param dataSourceName 数据源名称
 * @param treeStructMap 树结构配置信息
 * @param loadLevel 动态加载层次
 * @param whereObjJson where条件对象json
 */
const main = function (param: Record<string, any>) {
  let args = param.getArgs()
  let dataSourceName = args[0]
  let loadLevel = args[1]
  let treeStructJson = args[2]
  let whereObjJson = args[3]
  // 如果树结构未定义，即不是树结构，那么动态加载条件不适用
  if (treeStructJson == null) {
    return ''
  }

  // 如果动态加载层次未定义、或者加载层次==0（表示全部加载），则无需动态加载条件
  if (loadLevel == null || loadLevel == '0') {
    return ''
  }

  let expression =
    'DynamicLoadCondition("' +
    dataSourceName +
    '","' +
    loadLevel +
    '", "' +
    treeStructJson +
    '","' +
    whereObjJson +
    '")'

  let scope = scopeManager.getWindowScope()
  let result: Record<string, any> =
    operation.evalExpression({
      windowCode: scope.getWindowCode(),
      expression: expression
    }) || {}
  if (result && result.success == true) {
    return result.data.result.condition
  } else {
    throw new Error(
      '[DynamicLoadCondition.main]获取动态加载条件失败，result=' + result
    )
  }
}

export { main }
