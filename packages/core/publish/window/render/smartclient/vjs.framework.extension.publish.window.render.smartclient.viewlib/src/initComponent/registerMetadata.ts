import { ComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { IDomains } from '../interfase/initComponentInterface'

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

    console.log(element.config)
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
          console.log(JSON.stringify(instanceItem, null, 2))
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
            windows: [
              {
                bizWindowCode: 'batchEditOrg',
                isDefaultSelected: true,
                bizComponentCode: 'vbase_prd_org',
                instanceId: 'vbase_prd_org_inst_batchEditOrg',
                groups: [
                  {
                    instanceBizId: 'vbase_prd_org_inst_batchEditOrg',
                    groupName: '功能区',
                    instanceId: 'vbase_prd_org_inst_batchEditOrg',
                    pid: null,
                    id: '8a819cc77fda1245017fde6e55952db3',
                    isLeaf: false,
                    actions: [
                      {
                        actionSPIComponentCode: 'vbase_prd_action',
                        groupId: '8a819cc77fda1245017fde6e55952db3',
                        actionSPI: 'SPI_BasicSaveDataAction',
                        actionAPIComponentCode: 'vbase_prd_action',
                        isVisible: true,
                        actionType: 'common',
                        instanceId: 'vbase_prd_org_inst_batchEditOrg',
                        actionAPI: 'API_BasicSaveDataAction',
                        actionAPIType: 'Client',
                        isEnabled: true,
                        actionCode: 'SaveAction',
                        id: '8a819cc77fda1245017fde6e55952db4',
                        actionOrder: 1,
                        actionName: '保存'
                      },
                      {
                        actionSPIComponentCode: 'vbase_prd_org_action',
                        groupId: '8a819cc77fda1245017fde6e55952db3',
                        actionSPI: 'SPI_ShowCustomizedColumnAction',
                        actionAPIComponentCode: 'vbase_prd_org_action',
                        isVisible: true,
                        actionType: 'common',
                        instanceId: 'vbase_prd_org_inst_batchEditOrg',
                        actionAPI: 'API_ShowCustomizedColumnAction',
                        actionAPIType: 'Client',
                        isEnabled: true,
                        actionCode: 'ShowCustomizedColumnAction',
                        id: '8a819cc77fda1245017fde6e55952db5',
                        actionOrder: 2,
                        actionName: '显示定制列'
                      }
                    ],
                    groupCode: 'frameGroupCode',
                    groupControlType: '',
                    order: 1
                  },
                  {
                    instanceBizId: 'vbase_prd_org_inst_batchEditOrg',
                    groupName: '\u6279\u91cf\u64cd\u4f5c',
                    instanceId: 'vbase_prd_org_inst_batchEditOrg',
                    pid: '8a819cc77fda1245017fde6e55952db3',
                    id: '8a819cc77fda1245017fde6e55952db6',
                    isLeaf: false,
                    actions: [
                      {
                        actionSPIComponentCode: 'vbase_prd_org_action',
                        groupId: '8a819cc77fda1245017fde6e55952db6',
                        actionSPI: 'SPI_BatchAdjustSuperiorAction',
                        actionAPIComponentCode: 'vbase_prd_org_action',
                        isVisible: true,
                        actionType: 'common',
                        instanceId: 'vbase_prd_org_inst_batchEditOrg',
                        actionAPI: 'API_BatchAdjustSuperiorAction',
                        actionAPIType: 'Client',
                        isEnabled: true,
                        actionCode: 'BatchAdjustSuperiorAction',
                        id: '8a819cc77fda1245017fde6e55952db7',
                        actionOrder: 1,
                        actionName: '\u6279\u91cf\u8c03\u6574\u4e0a\u7ea7'
                      },
                      {
                        actionSPIComponentCode: 'vbase_prd_org_action',
                        groupId: '8a819cc77fda1245017fde6e55952db6',
                        actionSPI: 'SPI_BatchEnable',
                        actionAPIComponentCode: 'vbase_prd_org_action',
                        isVisible: true,
                        actionType: 'common',
                        instanceId: 'vbase_prd_org_inst_batchEditOrg',
                        actionAPI: 'API_BatchEnable',
                        actionAPIType: 'Client',
                        isEnabled: true,
                        actionCode: 'BatchEnable',
                        id: '8a819cc77fda1245017fde6e55952db8',
                        actionOrder: 2,
                        actionName: '\u6279\u91cf\u542f\u7528'
                      },
                      {
                        actionSPIComponentCode: 'vbase_prd_org_action',
                        groupId: '8a819cc77fda1245017fde6e55952db6',
                        actionSPI: 'SPI_BatchDisable',
                        actionAPIComponentCode: 'vbase_prd_org_action',
                        isVisible: true,
                        actionType: 'common',
                        instanceId: 'vbase_prd_org_inst_batchEditOrg',
                        actionAPI: 'API_BatchDisable',
                        actionAPIType: 'Client',
                        isEnabled: true,
                        actionCode: 'BatchDisable',
                        id: '8a819cc77fda1245017fde6e55952db9',
                        actionOrder: 3,
                        actionName: '\u6279\u91cf\u505c\u7528'
                      },
                      {
                        actionSPIComponentCode: 'vbase_prd_action',
                        groupId: '8a819cc77fda1245017fde6e55952db6',
                        actionSPI: 'SPI_BasicBatchDeleteDataAction',
                        actionAPIComponentCode: 'vbase_prd_action',
                        isVisible: true,
                        actionType: 'common',
                        instanceId: 'vbase_prd_org_inst_batchEditOrg',
                        actionAPI: 'API_BasicBatchDeleteDataAction',
                        actionAPIType: 'Client',
                        isEnabled: true,
                        actionCode: 'BatchDeleteAction',
                        id: '8a819cc77fda1245017fde6e55952dba',
                        actionOrder: 4,
                        actionName: '\u6279\u91cf\u5220\u9664'
                      }
                    ],
                    groupCode: 'BatchOperate',
                    groupControlType: '',
                    order: 3
                  }
                ],
                id: '8a819cc77fda1245017fde6e55952db2',
                bizWindowName:
                  '\u6279\u91cf\u7f16\u8f91\u90e8\u95e8\u4fe1\u606f',
                bizWindowTitle:
                  '\u6279\u91cf\u7f16\u8f91\u90e8\u95e8\u4fe1\u606f',
                bizWindowOrder: 1
              }
            ],
            instanceIconType: instanceItem.iconSourceType,
            frameWindowName: instanceItem.frameWindowInfo.name
          }
          return
        }
      }
    }
    metadatas.push({ domain: code, data: data })
  }

  if (Array.isArray(module)) {
    for (let item of module) {
      parseElement(item.elements.element)
    }
  }

  if (metadatas.length === 0) return
  console.log(metadatas)
  for (let i = 0, len = metadatas.length; i < len; i++) {
    let metadata = metadatas[i]
    ComponentParam.registerMetadata(
      componentCode,
      metadata.domain,
      metadata.data
    )
  }
}
