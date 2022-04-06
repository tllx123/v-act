import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { IDomains } from '../interfase/initComponentInterface'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

// 动作
const ActionManager = 'ActionManager'
// 单据
const BizWindowInstance = 'BizWindowInstance'

export default (componentCode: string, domains: IDomains) => {
  if (!domains) return
  let { module } = domains
  let metadatas: any[] = []

  function parseElement(element: { $: { code: string }; config: any }) {
    if (!element || !element.config) return
    if (element.config && typeof element.config === 'string')
      element.config = JSON.parse(element.config)
    let data = {}
    let code = element['$'].code

    if (ActionManager === code) {
      // 动作配置列表
      let {
        config: { actionEntity, actionNavigationInfo, actionWindow }
      } = element
      if (actionEntity && actionEntity.datas && actionEntity.datas.values) {
        if (actionEntity.datas.values.length > 0) {
          for (let actionItem of actionEntity.datas.values) {
            data[actionItem.actionCode] = Object.assign(actionItem, {
              actionType: 'common'
            })
          }
        }
      }
    } else if (BizWindowInstance === code) {
      // 单据配置列表
      let {
        config: { bizWindowInstance, manifest }
      } = element
      if (bizWindowInstance && bizWindowInstance.length > 0) {
        for (let instanceItem of bizWindowInstance) {
          let windows = []
          for (let window of instanceItem.bizWindowInfos) {
            // 取出group
            let groups = []
            for (let group of window.frameAction) {
              // 取出action
              let actions = []
              for (let action of group.frameGroupAction) {
                let a = {
                  actionSPIComponentCode: action.actionSPIComponentCode,
                  groupId: uuid.generate(),
                  actionSPI: action.actionSPI,
                  actionAPIComponentCode: action.actionAPIComponentCode,
                  isVisible: action.isVisible,
                  actionType: 'common',
                  instanceId: `${componentCode}_${instanceItem.code}`,
                  actionAPI: action.actionAPI,
                  actionAPIType: action.actionAPIType,
                  isEnabled: action.isEnabled,
                  actionCode: action.actionCode,
                  id: uuid.generate(),
                  actionOrder: action.actionOrder,
                  actionName: action.actionName
                }
                actions.push(a)
              }

              let g = {
                instanceBizId: `${componentCode}_${instanceItem.code}`,
                groupName: group.frameGroupName,
                instanceId: `${componentCode}_${instanceItem.code}`,
                pid: uuid.generate(),
                id: uuid.generate(),
                isLeaf: false,
                groupCode: group.frameGroupCode,
                groupControlType: group.frameGroupControlType,
                order: group.frameGroupOrder,
                actions
              }

              for (let subGroup of group.subFrameGroup) {
                let subActs = []
                for (let subAction of subGroup.frameGroupAction) {
                  let a = {
                    actionSPIComponentCode: subAction.actionSPIComponentCode,
                    groupId: uuid.generate(),
                    actionSPI: subAction.actionSPI,
                    actionAPIComponentCode: subAction.actionAPIComponentCode,
                    isVisible: subAction.isVisible,
                    actionType: 'common',
                    instanceId: `${componentCode}_${instanceItem.code}`,
                    actionAPI: subAction.actionAPI,
                    actionAPIType: subAction.actionAPIType,
                    isEnabled: subAction.isEnabled,
                    actionCode: subAction.actionCode,
                    id: uuid.generate(),
                    actionOrder: subAction.actionOrder,
                    actionName: subAction.actionName
                  }
                  subActs.push(a)
                }
                let g = {
                  instanceBizId: `${componentCode}_${instanceItem.code}`,
                  groupName: subGroup.frameGroupName,
                  instanceId: `${componentCode}_${instanceItem.code}`,
                  pid: uuid.generate(),
                  id: uuid.generate(),
                  isLeaf: false,
                  groupCode: subGroup.frameGroupCode,
                  groupControlType: subGroup.frameGroupControlType,
                  order: subGroup.frameGroupOrder,
                  actions: subActs
                }
                groups.push(g)
              }

              groups.push(g)
            }

            let w = {
              bizWindowCode: instanceItem.code,
              isDefaultSelected: window.isDefaultSelected,
              bizComponentCode: window.code.split('.')[0],
              instanceId: `${componentCode}_${instanceItem.code}`,
              id: uuid.generate(),
              bizWindowName: window.name,
              bizWindowTitle: window.title,
              bizWindowOrder: 1,
              groups
            }
            windows.push(w)
          }

          data[instanceItem.code] = {
            instanceCode: instanceItem.code,
            instanceName: instanceItem.name,
            instanceComponentCode: componentCode,
            frameComponentCode: instanceItem.frameWindowInfo
              ? instanceItem.frameWindowInfo.code.split('.')[0]
              : '',
            id: `${componentCode}_${instanceItem.code}`,
            frameWindowCode: instanceItem.frameWindowInfo
              ? instanceItem.frameWindowInfo.code.split('.')[1]
              : '',
            instanceIcon: instanceItem.iconImage,
            instanceIconType: instanceItem.iconSourceType,
            frameWindowName: instanceItem.frameWindowInfo.name,
            windows
          }
        }
      }
    }
    console.log(data)
    metadatas.push({ domain: code, data: data })
  }

  if (Array.isArray(module)) {
    for (let item of module) {
      parseElement(item.elements.element)
    }
  }

  if (metadatas.length === 0) return
  // console.log(metadatas)
  for (let i = 0, len = metadatas.length; i < len; i++) {
    let metadata = metadatas[i]
    ComponentParam.registerMetadata(
      componentCode,
      metadata.domain,
      metadata.data
    )
  }
}
