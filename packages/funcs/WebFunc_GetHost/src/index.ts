import * as environment from '@v-act/vjs.framework.extension.platform.services.integration.vds.environment'

const vds = { environment }

const main = function () {
  var hostUrl = ''
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    hostUrl = GlobalVariables.getServerUrl()
    if (hostUrl && hostUrl.indexOf('http') == 0) {
      var index = hostUrl.indexOf('/')
      hostUrl = hostUrl.substring(index + 2)
    }
  } else {
    hostUrl = window.location.host + vds.environment.getContextPath()
  }
  return hostUrl
}
export { main }
