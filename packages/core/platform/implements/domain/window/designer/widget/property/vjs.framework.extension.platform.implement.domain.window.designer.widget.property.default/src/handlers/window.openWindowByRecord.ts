import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WindowContainerManager as windowRelation } from '@v-act/vjs.framework.extension.platform.services.view.relation'

import { DatasourceManager as dsManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

export function getHandlerName() {
  return 'window.openWindowByRecord'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (
        widgetCode,
        record,
        paramsMapping,
        entityCode,
        nextFunc
      ) {
        var type = record[paramsMapping['openWay']]
        if (null == type || '' == type || 'win' == type) {
          type = 0 //0是打开窗体，1是执行方法
        }
        var menuAction = sandbox.getService(
          'vjs.framework.extension.platform.services.view.widget.common.logic.menu.action',
          {
            type: type
          }
        )
        if (null != menuAction) {
          var recordId = record.id
          var item = {
            compCode: record[paramsMapping['componentCode']],
            winCode: record[paramsMapping['formCode']],
            id: recordId,
            title: record[paramsMapping['title']],
            params: record[paramsMapping['inputParams']],
            selected: record[paramsMapping['selected']],
            rendered: (function (_nextFunc) {
              return function (params) {
                if (params) {
                  var tab = params.tab
                  if (tab) {
                    tab.recordId = recordId
                  }
                  var containerId = params.containerId
                  var container = windowRelation.get(containerId)
                  if (container) {
                    windowRelation.updateWindowInfo(container, {
                      recordId: recordId
                    })
                    //页签关闭事件，非点击页签×关闭页签的事件触发前追加到销毁事件内
                    container.set('tabCloseFunc', params.tabCloseFunc) //到触发源才添加事件
                    //记录移除
                    var removeRecord = scopeManager.createScopeHandler({
                      scopeId: params.preScopeId,
                      handler: (function (rId, _entityCode) {
                        return function () {
                          var datasource = dsManager.lookup({
                            datasourceName: _entityCode
                          })
                          if (datasource) {
                            datasource.removeRecordByIds({
                              ids: [rId]
                            })
                          }
                        }
                      })(recordId, entityCode)
                    })
                    container.set('removeRecord', removeRecord)
                    //注册销毁域事件
                    container.addEvent(
                      windowRelation.EVENTS.DESTROY,
                      (function (_container) {
                        return function () {
                          if (_container.scopeId) {
                            scopeManager.destroy(_container.scopeId)
                          }
                        }
                      })(container)
                    )
                  }
                }
                if (typeof _nextFunc == 'function') {
                  _nextFunc()
                }
              }
            })(nextFunc)
          }
          var properties = {
            ComponentContainer: widgetCode,
            ComponentOpenWay: 'SpecifiedContainer'
          }
          menuAction.doAction({
            properties: properties,
            data: item,
            callback: function () {}
          })
        }
      }
    })
    widgetProperty[property.code] = handler
  }
}
