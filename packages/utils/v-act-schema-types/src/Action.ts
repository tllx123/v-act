interface WindowAction {
  targetWindow: string
  targetWindowTitle: string
  targetContainerType: string
  targetSourceType: string
  widthExp: string
  heightExp: string
}
interface Action {
  /**
   * 控件编号
   */
  controlCode: string
  /**
   * 控件事件
   */
  triggerEvent: string
  /**
   * 窗体动作
   */
  windowAction: WindowAction
}

export { type Action, type WindowAction }

export default Action
