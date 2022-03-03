exports.initModule = function (sb) {}
let _handleColor = function (colors) {
  let _handleColor = ''
  _color = colors.split(',')
  if (_color.length == 3) {
    _handleColor = colors + ',1'
  } else if (_color.length == 4) {
    let opacity = parseInt((_color[0] * 100) / 255) / 100
    _color.splice(0, 1)
    _color.push(opacity)
    _handleColor = _color.join(',')
  } else {
    console.warn('警告：参数不是颜色值')
  }
  return _handleColor
}

const setRgbaColor = function (el, property, colors) {
  let _colors = 'rgba(' + _handleColor(colors) + ')'
  el.css(property, _colors)
}

const setRgbaColors = function (el, optionArrys) {
  if (optionArrys instanceof Array) {
    let options = {}
    for (let i = 0; i < optionArrys.length; i++) {
      let _option = optionArrys[i]
      if (!_option instanceof Array) {
        i == 1 && (options[optionArrys[0]] = _handleColor(optionArrys[1]))
      } else {
        options[_option[0]] = _handleColor(_option[1])
      }
    }
    el.css(options)
  }
}

export { setWidgetCss, setRgbaColor, setRgbaColors }
