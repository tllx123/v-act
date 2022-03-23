/**
 * @class AjaxProxy
 * @desc ajax请求代理
 */
let Proxy = function (contract?: any, channel?: any) {
  //@ts-ignore
  this.contract = contract
  //@ts-ignore
  this.channel = channel
}

Proxy.prototype = {
  /**
   * 设置数据操作协议
   * @param {Object} contract
   */
  setContract: function (contract: any) {
    this.contract = contract
  },
  /**
   * 获取数据操作协议
   * @param {Object} contract
   */
  getContract: function () {
    return this.contract
  },
  /**
   * 设置数据交互信道
   * @param {Object} channel
   */
  setChannel: function (channel: any) {
    this.channel = channel
  },
  /**
   * 获取数据交互信道
   * @param {Object} channel
   */
  getChannel: function (channel: any) {
    return this.channel
  },
  /**
   *  发送请求
   * @param {Request} request
   */
  request: function (request: any) {
    let channel = this.getChannel()
    let contract = this.getContract()
    return channel.request(request, contract)
  }
}

export default Proxy
