interface Event {
  /**
   * 事件编号
   */
  code: string
  /**
   * 事件名称
   */
  name: string
  /**
   * 事件handler
   */
  handler: Function
}
export default Event
