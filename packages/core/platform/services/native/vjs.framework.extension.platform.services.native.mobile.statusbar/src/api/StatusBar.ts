let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const changeStatusBarColor = function (colorName: string) {
  instance.changeStatusBarColor(colorName)
}

const isShow = function (isShow: boolean) {
  if (isShow) {
    instance.show()
  } else {
    instance.hide()
  }
}

export { changeStatusBarColor, isShow, putInstance }
