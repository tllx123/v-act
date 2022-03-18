let sandbox

export function initModule(sb: any) {
  sandbox = sb
}

/**
 * 处理颜色
 */
let handleColor = function (colorStr: string) {
  if (colorStr.indexOf(',') == -1) {
    return colorStr
  } else {
    let rgbs = colorStr.split(',')
    // 0, 255, 255, 255 四位前面为0的代表为透明色
    if (rgbs.length == 4 && rgbs[0] == '0') {
      return 'transparent'
    } else {
      return 'rgb(' + rgbs + ')'
    }
  }
}

export { handleColor }
