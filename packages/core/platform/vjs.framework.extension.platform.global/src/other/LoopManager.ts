/**
 * 循环管理 不处理域，不处理调用对象
 * vjs名称：vjs.framework.extension.platform.global
 * vjs服务：vjs.framework.extension.platform.global.LoopManager
 */

import { uuid } from '@v-act/vjs.framework.extension.util.uuid'
//此处value用列表是因为可能循环同一个函数
//循环列表 key 循环速度  value 循环id列表
const loopList: { [code: string]: any } = {}
//循环标识 key 循环速度  value 循环标识
const loopIden: { [code: string]: any } = {}
//循环映射 key 循环id value 循环函数
const loopMappings: { [code: string]: any } = {}

/**
 * 根据循环速度生成循环函数
 * */
var createSpeedHandler = function (speed: any) {
  var hander = (function (_speed) {
    return function () {
      var loopIds = loopList[_speed]
      for (var i = 0, len = loopIds.length; i < len; i++) {
        var loopId = loopIds[i]
        var handler = loopMappings[loopId]
        if (handler) {
          try {
            handler()
          } catch (e) {}
        }
      }
    }
  })(speed)
  return hander
}

/**
 * 循环速度类型
 * */
var SPEEDTYPE = {
  FAST: 'fast', //快 50ms
  NORMAL: 'normal', //正常 200ms
  SLOW: 'slow' //慢 500ms
}
export { SPEEDTYPE }

/**
 * 添加循环
 * @params	{Object}	params
 * {
 * 	handler {Function},//循环函数
 * 	speed	{String}//循环速度，可忽略
 * }
 * */
export function add(params: any) {
  var handler = params.handler
  if (typeof handler == 'function') {
    var loopId = uuid.generate()
    loopMappings[loopId] = handler
    var speed = params.speed
    var time = 200
    switch (speed) {
      case SPEEDTYPE.FAST:
        time = 50
        break
      case SPEEDTYPE.SLOW:
        time = 500
        break
      default:
        speed = SPEEDTYPE.NORMAL
        break
    }
    if (!loopList[speed]) {
      loopList[speed] = [loopId]
      var hander = createSpeedHandler(speed)
      var index = setInterval(hander, time)
      loopIden[speed] = index
    } else {
      loopList[speed].push(loopId)
    }
    return loopId
  }
}
/**
 * 移除循环
 * @param	{String}	loopId	循环id
 * */
export function remove(loopId: string) {
  if (!loopMappings[loopId]) {
    return
  }
  //移除映射，保证不会继续执行
  delete loopMappings[loopId]
  for (var type in loopList) {
    var loops = loopList[type]
    var index = loops[loopId]
    if (index == -1) {
      continue
    }
    loops.splice(index, 1)
    if (loops.length == 0) {
      var id = loopIden[type]
      clearInterval(id)
      try {
        delete loopIden[type]
      } catch (e) {}
    }
  }
}
