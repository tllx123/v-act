import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'

class Channel {
  //@ts-ignore
  type = 'POST'
  //@ts-ignore
  isAsync = true
  //@ts-ignore
  timeout = 30000
  //@ts-ignore
  url = 'module-operation!executeMultiOperation'

  /**
   * 设置提交类型
   *
   * @param {Object} type
   */
  setType(type: any) {
    this.type = type
  }
  /**
   * 设置是否异步
   *
   * @param {Object} async
   */
  setAsync(async: any) {
    this.isAsync = async
  }
  /**
   * 设置超时时间
   *
   * @param {Object} timeout
   */
  setTimeout(timeout: any) {
    this.timeout = timeout
  }
  getTimeout() {
    return environment.isDebug() ? 999999999 : this.timeout
  }
  /**
   * 设置请求url
   *
   * @param {Object} url
   */
  setUrl(url: string) {
    this.url = url
  }
}

export default Channel
