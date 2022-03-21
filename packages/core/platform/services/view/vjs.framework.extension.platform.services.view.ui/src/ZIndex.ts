let zIndex = 800000

const getZIndex = function () {
  return zIndex
}

const getFrontZIndex = function () {
  zIndex = zIndex + 100
  return zIndex
}

const setZIndex = function (_zIndex: number) {
  if (_zIndex > zIndex) {
    zIndex = _zIndex
  }
}

export { getFrontZIndex, getZIndex, setZIndex }
