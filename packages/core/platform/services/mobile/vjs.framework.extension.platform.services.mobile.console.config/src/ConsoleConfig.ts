interface consoleConfigTs {
  [key: string]: any
}
let consoleConfig: consoleConfigTs = {
  guideComponentCode: '',
  guideWindowCode: '',
  mainComponentCode: '',
  mainWindowCode: '',
  preLoadMainPage: '',
  isStartWithGuidePage: '' //本次访问APP是否开启引导页
}

// export function initModule(sb) {}

const setConfig = function (key: string, value: string) {
  if (key) {
    consoleConfig[key] = value
  }
}

const getConfig = function (key: string) {
  if (key) {
    return consoleConfig[key]
  }
  return null
}

const showMainPage = function () {
  consoleConfig.preLoadMainPage.show()
  consoleConfig.isStartWithGuidePage = false
}

const needShowMainPage = function (componentCode: string, windowCode: string) {
  if (
    componentCode == consoleConfig.mainComponentCode &&
    windowCode == consoleConfig.mainWindowCode
  ) {
    if (
      consoleConfig.isStartWithGuidePage == true &&
      consoleConfig.preLoadMainPage &&
      (window as any).cordova &&
      (window as any).cordova.platformId == 'ios'
    ) {
      return true
    }
    return false
  }
  return false
}

export { getConfig, needShowMainPage, setConfig, showMainPage }
