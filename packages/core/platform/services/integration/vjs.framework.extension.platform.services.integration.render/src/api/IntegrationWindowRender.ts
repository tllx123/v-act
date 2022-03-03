let _instance

const _putInstance = function (instance) {
  _instance = instance
}

const renderAsModal = function (params) {
  _instance.renderAsModal(params)
}

const renderAsWindow = function (params) {
  _instance.renderAsWindow(params)
}

const renderAsElement = function (params) {
  _instance.renderAsElement(params)
}

const preLoad = function (params) {
  _instance.preLoad(params)
}

const openUrl = function (params) {
  _instance.openUrl(params)
}

const closeCurrentWindow = function (params) {
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
