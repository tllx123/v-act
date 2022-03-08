import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

//主入口(必须有)
const main = function (param: FunctionContext) {
  //获取函数传入的参数
  let args = param.getArgs()
  let destControlId = args.length > 0 ? args[0] : null
  let processState = args.length > 1 && args[1] ? args[1].split(',') : null
  let processActivityId = args.length > 2 && args[2] ? args[2].split(',') : null

  let hasSetImageStyles: { [code: string]: any } = {}
  if (processActivityId && processState) {
    let allEdges = widgetAction.executeWidgetAction(
      destControlId,
      'getEdges',
      destControlId
    )
    for (let i = 0; i < processActivityId.length; i++) {
      let sourceAndTarget = widgetAction.executeWidgetAction(
        destControlId,
        'getSourceIdAndTargetIdByEdgeId',
        destControlId,
        processActivityId[i]
      )
      let edgeState = processState[i] == 'Complete' ? 2 : 1
      //@ts-ignore
      for (let j = 0; j < allEdges.length; j++) {
        //@ts-ignore
        if (allEdges[j].id == processActivityId[i]) {
          widgetAction.executeWidgetAction(
            destControlId,
            'setEdgeStyle',
            edgeState,
            //@ts-ignore
            allEdges[j].source,
            //@ts-ignore
            allEdges[j].target
          )
        }
      }

      let imgType = processState[i] + 'Image'
      let imgStyle = widgetAction.executeWidgetAction(
        destControlId,
        'getCellAttr',
        processActivityId[i],
        imgType
      )
      //@ts-ignore
      if (imgStyle) {
        widgetAction.executeWidgetAction(
          destControlId,
          'setCellStyle',
          processActivityId[i],
          imgStyle
        )
      }
      hasSetImageStyles[processActivityId[i]] = processActivityId[i]
    }
  }

  return true
}

export { main }
