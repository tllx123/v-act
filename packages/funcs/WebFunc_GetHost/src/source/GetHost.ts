import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'

let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let hostUrl = ''
  if (window.GlobalVariables) {
    hostUrl = GlobalVariables.getServerUrl()
    if (hostUrl && hostUrl.indexOf('http') == 0) {
      let index = hostUrl.indexOf('/')
      hostUrl = hostUrl.substring(index + 2)
    }
  } else {
    hostUrl = window.location.host + environment.getContextPath()
  }
  return hostUrl
}

export { main }
