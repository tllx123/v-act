var zIndex = 800000

var _update = function () {
  if (window.isc && isc.Canvas) {
    //TODO
    var canvasIndex = isc.Canvas._BIG_Z_INDEX
    if (canvasIndex > zIndex) {
      zIndex = canvasIndex
    }
  }
}

var getZIndex = function () {
  _update()
  return zIndex
}

var getFrontZIndex = function () {
  _update()
  zIndex = zIndex + 100
  return zIndex
}

var setZIndex = function (_zIndex) {
  _update()
  if (_zIndex > zIndex) {
    zIndex = _zIndex
  }
}

exports.getZIndex = getZIndex
exports.getFrontZIndex = getFrontZIndex
exports.setZIndex = setZIndex
