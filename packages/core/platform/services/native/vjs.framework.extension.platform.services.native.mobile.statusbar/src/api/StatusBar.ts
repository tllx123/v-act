let instance

const putInstance = function (ins) {
  instance = ins
}

const changeStatusBarColor = function (colorName) {
  instance.changeStatusBarColor(colorName)
}

const isShow = function (isShow) {
  if (isShow) {
    instance.show()
  } else {
    instance.hide()
  }
}

export { putInstance, changeStatusBarColor, isShow }
