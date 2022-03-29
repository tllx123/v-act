import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

function DefaultValueGenerator(
  datasourceName: string,
  datasourceFieldCode: string
) {
  //@ts-ignore
  this.datasourceName = datasourceName
  //@ts-ignore
  this.datasourceFieldCode = datasourceFieldCode
}

DefaultValueGenerator.prototype.initModule = function (sandbox: any) {}

DefaultValueGenerator.prototype.generate = function () {
  let defaultValue = datasourceUtil.getDatasourceField(
    this.datasourceName,
    this.datasourceFieldCode
  ).defaultValue
  let scope = scopeManager.getWindowScope()
  let widgetCodeList
  while (true) {
    let childId = scope.getChildId()
    if (childId) {
      scope = scopeManager.getScope(childId)
    } else {
      break
    }
  }
  let scopeId = scope.getInstanceId()
  return scopeManager.createScopeHandler({
    scopeId: scopeId,
    handler: function (datasourceName, datasourceFieldCode) {
      var widgetCodeList = datasourceUtil.getWidgetCodesByDatasource(
        datasourceName,
        datasourceFieldCode
      )
      for (var j = 0; j < widgetCodeList.length; j++) {
        var widgetCode = widgetCodeList[j]
        if (widgetAction.isWidgetActionExist(widgetCode, 'getDefaultValue')) {
          var widgetDefaultValue = widgetAction.executeWidgetAction(
            widgetCode,
            'getDefaultValue',
            datasourceFieldCode
          )
          if (undefined != widgetDefaultValue && null != widgetDefaultValue) {
            if (typeof widgetDefaultValue == 'object') {
              var widgetDefaultValueObject = {}
              for (var widgetDefaultValueField in widgetDefaultValue) {
                if (
                  undefined != widgetDefaultValue[widgetDefaultValueField] &&
                  null != widgetDefaultValue[widgetDefaultValueField]
                )
                  widgetDefaultValueObject[widgetDefaultValueField] =
                    widgetDefaultValue[widgetDefaultValueField]
              }
              defaultValue = widgetDefaultValueObject
            } else {
              defaultValue = widgetDefaultValue
            }
          }
        }
      }
      if (undefined == defaultValue || null == defaultValue) {
        return null
      } else {
        return defaultValue
      }
    }
  })(this.datasourceName, this.datasourceFieldCode)
  //		for (var j = 0; j < widgetCodeList.length; j++) {
  //			var widgetCode = widgetCodeList[j];
  //			if (widgetAction.isWidgetActionExist(widgetCode, "getDefaultValue")) {
  //				var widgetDefaultValue = widgetAction.executeWidgetAction(widgetCode, "getDefaultValue", this.datasourceFieldCode);
  //				if (undefined != widgetDefaultValue && null != widgetDefaultValue) {
  //					if (typeof (widgetDefaultValue) == "object") {
  //						var widgetDefaultValueObject = {};
  //						for(var widgetDefaultValueField in widgetDefaultValue){
  //							if(undefined != widgetDefaultValue[widgetDefaultValueField] && null != widgetDefaultValue[widgetDefaultValueField])
  //								widgetDefaultValueObject[widgetDefaultValueField] = widgetDefaultValue[widgetDefaultValueField]
  //						}
  //						defaultValue = widgetDefaultValueObject;
  //					} else {
  //						defaultValue = widgetDefaultValue;
  //					}
  //
  //				}
  //			}
  //		}
  //		if (undefined == defaultValue || null == defaultValue) {
  //			return null
  //		} else {
  //			return defaultValue;
  //		}
}

export default DefaultValueGenerator
