import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

let undefined
let undefined
exports.initModule = function (sBox) {}
// 操作类型：0为打印预览，1为打印
let OP_PRINT_PREVIEW = '0',
  OP_PRINT = '1'

function main(ruleContext) {
  let ruleConfig = ruleContext.getRuleCfg()
  let inParams = ruleConfig.inParams
  let inParamObj = jsonUtil.json2obj(inParams)

  // 控件数组
  let controlIDs = inParamObj.componentControls

  //没有要打印的控件，直接返回
  if (!controlIDs) return

  // 操作类型
  let type = inParamObj['type']

  let controls = []
  for (let i = 0; i < controlIDs.length; i++) {
    let controlID = controlIDs[i].componentControlCode
    let control = widgetContext.get(controlID, 'widgetObj')
    //			var control = viewContext.getRuntimeWidgetObjFromContext(controlID);
    if (control) {
      controls.push(control)
    }
  }

  //没有要打印的控件，直接返回
  if (controls.length <= 0) return

  switch (type) {
    case OP_PRINT_PREVIEW:
      controls[0].controlPrintPreview(controls)
      break
    case OP_PRINT:
      controls[0].controlPrint(controls)
      break
    default:
      break
  }
}

export { main }
