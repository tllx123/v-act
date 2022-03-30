import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine.route'

const initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (param) {
  let args = param.getArgs()
  if (args && args.length > 0) {
    let bizCode = args[0]
    let frameParams = new Array()
    let frameParam = {}
    frameParam['paramKey'] = 'bizCode'
    frameParam['paramValue'] = bizCode
    frameParams.push(frameParam)
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
      '[WFSetBizCodeValue.main] 设置业务单据编码异常，配置信息错误，配置信息为空！'
    )
  }
}

export { initModule, main }
