let sandbox
let TopStandardHeight = ['20px', '44px']
let BottomStandardHeight = ['34px']
//标准顶部20px
let TopStandard = [
  'iPhone1,1',
  'iPhone1,2',
  'iPhone2,1',
  'iPhone3,1',
  'iPhone3,2',
  'iPhone3,3',
  'iPhone4,1',
  'iPhone5,1',
  'iPhone5,2',
  'iPhone5,3',
  'iPhone5,4',
  'iPhone6,1',
  'iPhone6,2',
  'iPhone7,2',
  'iPhone7,1',
  'iPhone8,1',
  'iPhone8,2',
  'iPhone8,4',
  'iPhone9,1',
  'iPhone9,3',
  'iPhone9,2',
  'iPhone9,4',
  'iPhone10,1',
  'iPhone10,4',
  'iPhone10,2',
  'iPhone10,5',
  'iPad1,1',
  'iPad2,1',
  'iPad2,2',
  'iPad2,3',
  'iPad2,4',
  'iPad3,1',
  'iPad3,2',
  'iPad3,3',
  'iPad3,4',
  'iPad3,5',
  'iPad3,6',
  'iPad4,1',
  'iPad4,2',
  'iPad4,3',
  'iPad5,3',
  'iPad5,4',
  'iPad6,7',
  'iPad6,8',
  'iPad6,3',
  'iPad6,4',
  'iPad6,11',
  'iPad6,12',
  'iPad7,1',
  'iPad7,2',
  'iPad7,3',
  'iPad7,4',
  'iPad7,5',
  'iPad7,6',
  'iPad8,1',
  'iPad8,2',
  'iPad8,3',
  'iPad8,4',
  'iPad8,5',
  'iPad8,6',
  'iPad8,7',
  'iPad8,8',
  'iPad11,3',
  'iPad11,4',
  'iPad2,5',
  'iPad2,6',
  'iPad2,7',
  'iPad4,4',
  'iPad4,5',
  'iPad4,6',
  'iPad4,7',
  'iPad4,8',
  'iPad4,9',
  'iPad5,1',
  'iPad5,2',
  'iPad11,1',
  'iPad11,2'
]
//非标准顶部：44px
let TopHeight = [
  'iPhone10,3',
  'iPhone10,6',
  'iPhone11,8',
  'iPhone11,2',
  'iPhone11,6'
]
//非标准底部：34px
let BottomHeight = [
  'iPhone10,3',
  'iPhone10,6',
  'iPhone11,8',
  'iPhone11,2',
  'iPhone11,6'
]

/**
 * 部分适配数据
 * */
let FixDatas = {}
export function initModule(sBox) {
  sandbox = sBox
}

const getViewPortSize = function () {
  let type = getDeviceType()
  let left = 0
  let top = 0
  let right = 0
  let bottom = 0
  switch (type) {
    case 'ios':
      if (typeof device != 'undefined') {
        var model = device.model
        var tmp_top = 0
        if (TopStandard.indexOf(model) != -1) {
          top = TopStandardHeight[0]
        } else if (TopHeight.indexOf(model) != -1) {
          top = TopStandardHeight[1]
        }
        if (BottomHeight.indexOf(model) != -1) {
          bottom = BottomStandardHeight[0]
        }
      }
      break
    case 'android':
      break
  }
  return {
    left: left,
    top: top,
    right: right,
    bottom: bottom
  }
}

/**
 * 判断是否横屏
 * */
let isHorizontal = function () {
  if (window.VPlatformPatch.config.layouttype == 'horizontal') {
    return true
  }
  return false
}
/**
 * 获取设备类型
 * */
let getDeviceType = function () {
  if (isWeiXinDevice()) {
    return 'wx'
  }
  let ua = navigator.userAgent.toLowerCase()
  if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    //判断iPhone|iPad|iPod|iOS
    return 'ios'
  } else if (/(Android)/i.test(navigator.userAgent)) {
    //判断Android
    return 'android'
  } else {
    return 'pc'
  }
}
/**
 * 判断是否微信端
 * */
function isWeiXinDevice() {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true
  } else {
    return false
  }
}

export { getViewPortSize }
