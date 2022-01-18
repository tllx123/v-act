const WIDGET_INST_MAP: { [widgetType: string]: number } = {}

const getJGContextInstCode = function () {
  return getInstCode('JGContext')
}

const getJGSpacerInstCode = function () {
  return getInstCode('JGSpacer')
}

const getJGGroupPanelInstCode = function () {
  return getInstCode('JGGroupPanel')
}

const getInstCode = function (widetType: string) {
  const index = WIDGET_INST_MAP[widetType] || 0
  const code = widetType + '_$_' + index
  WIDGET_INST_MAP[widetType] = index + 1
  return code
}

export {
  getInstCode,
  getJGContextInstCode,
  getJGGroupPanelInstCode,
  getJGSpacerInstCode
}
