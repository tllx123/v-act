let consoleConfig = {
  guideComponentCode: '',
  guideWindowCode: '',
  mainComponentCode: '',
  mainWindowCode: '',
  preLoadMainPage: '',
  isStartWithGuidePage: '' //本次访问APP是否开启引导页
}

exports.initModule = function (sb) {}

const setConfig = function (key, value) {
  if (key) {
    consoleConfig[key] = value
  }
}

const getConfig = function (key) {
  if (key) {
    return consoleConfig[key]
  }
  return null
}

const showMainPage = function () {
  consoleConfig.preLoadMainPage.show()
  consoleConfig.isStartWithGuidePage = false
}

const needShowMainPage = function (componentCode, windowCode) {
  if (
    componentCode == consoleConfig.mainComponentCode &&
    windowCode == consoleConfig.mainWindowCode
  ) {
    if (
      consoleConfig.isStartWithGuidePage == true &&
      consoleConfig.preLoadMainPage &&
      window.cordova &&
      window.cordova.platformId == 'ios'
    ) {
      return true
    }
    return false
  }
  return false
}

export { setConfig, getConfig, showMainPage, needShowMainPage }
