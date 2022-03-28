let _instance: Record<string, any>

const _putInstance = function (instance: Record<string, any>) {
  _instance = instance
}

const renderAsModal = function (params: any) {
  _instance.renderAsModal(params)
}

const renderAsWindow = function (params: any) {
  _instance.renderAsWindow(params)
}

const renderAsElement = function (params: any) {
  _instance.renderAsElement(params)
}

const preLoad = function (params: any) {
  _instance.preLoad(params)
}

const openUrl = function (params: {}) {
  _instance.openUrl(params)
}

const closeCurrentWindow = function (params: any) {
  _instance.closeCurrentWindow(params)
}

export {
  _putInstance,
  renderAsModal,
  renderAsWindow,
  renderAsElement,
  preLoad,
  openUrl,
  closeCurrentWindow
}
