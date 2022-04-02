import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine'

//主入口(必须有)
let main = function (...args: any[]) {
  if (args && args.length > 0) {
    let bizState = args[0]
    let frameParams = new Array()
    let frameParam = {}
    frameParam['paramKey'] = 'bizState'
    frameParam['paramValue'] = bizState
    frameParams.push(frameParam)
    // 设置状态颜色
    if (args.length > 1) {
      let bizStateColor = args[1]
      let colorFrameParam = {}
      colorFrameParam['paramKey'] = 'bizStateColor'
      colorFrameParam['paramValue'] = bizStateColor
      frameParams.push(colorFrameParam)
    }
    let frameParamsDataJson = {
      datas: {
        recordCount: 1, //实体总记录数
        values: frameParams //实体数据
      },
      metadata: {
        model: [
          {
            datasource: 'FrameData', //实体编码
            /* 字段列表 */
            fields: [
              { code: 'paramKey', type: 'char' },
              { code: 'paramValue', type: 'char' }
            ]
          }
        ]
      }
    }
    let frameParamDataValue = DBFactory.unSerialize(frameParamsDataJson)
    let frameInputParams = {}
    frameInputParams['FrameData'] = frameParamDataValue
    // 执行api
    let ruleSetParams = {
      targetConfig: {
        sourceType: 'client-ruleSet', //client-ruleSet(客户端)，server-ruleSet(服务端)
        invokeType: 'api',
        componentCode: 'vbase_prd_workflow',
        windowCode: '',
        ruleSetCode: 'API_WorkflowChangeFrameDatas'
      },
      inputParam: frameInputParams,
      config: {
        success: function () {
          //
        },
        error: function () {
          //alert("执行异常！");
        }
      }
    }
    routeEngine.execute(ruleSetParams)
  } else {
    throw new Error(
      '[WFSetBizStateValue.main] 设置业务单据编码异常，配置信息错误，配置信息为空！'
    )
  }
}

export { main }
