let zIndex = 800000

const _update = function () {
  //@ts-ignore
  if (window.isc && isc.Canvas) {
    //TODO
    //@ts-ignore
    const canvasIndex = isc.Canvas._BIG_Z_INDEX
    if (canvasIndex > zIndex) {
      zIndex = canvasIndex
    }
  }
}

const getZIndex = function () {
  _update()
  return zIndex
}

const getFrontZIndex = function () {
  _update()
  zIndex = zIndex + 100
  return zIndex
}

const setZIndex = function (_zIndex: number) {
  _update()
  if (_zIndex > zIndex) {
    zIndex = _zIndex
  }
}

export { getFrontZIndex, getZIndex, setZIndex }
