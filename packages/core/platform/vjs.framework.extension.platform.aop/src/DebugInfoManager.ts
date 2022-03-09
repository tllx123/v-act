import { RPC as rpc } from '@v-act/vjs.framework.extension.system'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

let DebugInfoManager = function () {}

export function initModule(sb) {}

//定义初始化标记变量
let initFlag = false
//用来存放被勾选的规则信息
let initArr = []
let initMapping = {}
let firstInit = false

const isInited = function () {
  //判断是否进行了初始化
  if (initArr.length == 0 && firstInit == false) {
    //说明没有进行初始化
    initFlag = false
  } else {
    initFlag = true
  }
  return initFlag
}

const init = function (devId) {
  //向服务器发送请求，获得开发系统提交给服务器的调试信息
  //发送请求，提交数据，发送到服务器
  let _this = this
  rpc.orginalRequest({
    isAsync: false,
    type: 'POST',
    host: 'module-operation!executeOperation',
    param: {
      operation: 'aop',
      type: 'getDebugInfo',
      closeId: devId, //开发系统调试标识id
      ajaxRequest: true
    },
    afterResponse: function (rs) {
      //如果获得返回数据，将返回数据放到数组中保存起来
      initArr = jsonUtil.json2obj(rs.responseText)
      if (initArr != null && initArr.length > 0) {
        let len = initArr.length
        for (let i = 0; i < len; i++) {
          let singleInfo = initArr[i]
          addDebuggerData(singleInfo)
        }
      }
      firstInit = true
    },
    error: function () {}
  })
}

/**
 * 添加单个调试信息
 * */
let addDebuggerData = function (data) {
  if (data) {
    let componentCode = data.componentCode
    if (!initMapping[componentCode]) {
      initMapping[componentCode] = { WindowCode: {}, Api: {} }
    }
    let typeContainer
    let windowCode = data.windowCode
    if (windowCode) {
      //有窗体编码，为窗体方法
      if (!initMapping[componentCode]['WindowCode'][windowCode]) {
        initMapping[componentCode]['WindowCode'][windowCode] = {}
      }
      typeContainer = initMapping[componentCode]['WindowCode'][windowCode]
    } else {
      //api
      typeContainer = initMapping[componentCode]['Api']
    }
    let ruleSetCode = data.ruleSetCode
    if (!typeContainer[ruleSetCode]) {
      typeContainer[ruleSetCode] = []
    }
    typeContainer[ruleSetCode].push(data)
  }
}
/**
 * 删除单个debugger数据
 * */
let removeDebuggerData = function (data) {
  if (data) {
    let comCode = data.componentCode
    let winCode = data.windowCode
    let ruleSetCode = data.ruleSetCode
    let dataArr = []
    if (initMapping[comCode]) {
      if (winCode) {
        if (
          initMapping[comCode]['WindowCode'][winCode] &&
          initMapping[comCode]['WindowCode'][winCode][ruleSetCode]
        ) {
          dataArr = initMapping[comCode]['WindowCode'][winCode][ruleSetCode]
        }
      } else {
        if (initMapping[comCode]['Api'][ruleSetCode]) {
          dataArr = initMapping[comCode]['Api'][ruleSetCode]
        }
      }
      if (dataArr && dataArr.length > 0) {
        let ruleCode = data.ruleCode
        for (let i = 0, l = dataArr.length; i < l; i++) {
          let da = dataArr[i]
          if (
            da.componentCode == comCode &&
            da.windowCode == winCode &&
            da.ruleSetCode == ruleSetCode &&
            da.ruleCode == ruleCode
          ) {
            dataArr.splice(i, 1)
          }
        }
      }
    }
  }
}
/**
 * 判断规则是否属于调试数据
 * */
let isDebuggerData = function (params) {
  let isdebgger = false
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    ruleSetCode = params.ruleSetCode,
    ruleCode = params.ruleCode
  if (initMapping[componentCode]) {
    let funContainer
    let dataArr = []
    if (windowCode != null) {
      let windoeCodeContainer = initMapping[componentCode]['WindowCode']
      if (
        windoeCodeContainer &&
        windoeCodeContainer[windowCode] &&
        windoeCodeContainer[windowCode][ruleSetCode]
      ) {
        dataArr = windoeCodeContainer[windowCode][ruleSetCode]
      }
    } else {
      let apiContainer = initMapping[componentCode]['Api']
      if (apiContainer && apiContainer[ruleSetCode]) {
        dataArr = apiContainer[ruleSetCode]
      }
    }
    if (dataArr.length > 0) {
      for (let i = 0, l = dataArr.length; i < l; i++) {
        if (
          dataArr[i].componentCode == componentCode &&
          dataArr[i].windowCode == windowCode &&
          dataArr[i].ruleSetCode == ruleSetCode &&
          dataArr[i].ruleCode == ruleCode
        ) {
          //说明这个规则需要调试
          isdebgger = true
        }
      }
    }
  }
  return isdebgger
}

const isDebugger = function (componentCode, windowCode, ruleSetCode, ruleCode) {
  return isDebuggerData({
    componentCode: componentCode,
    windowCode: windowCode,
    ruleSetCode: ruleSetCode,
    ruleCode: ruleCode
  })
  //			//判断是否需要调试
  //			var isdebgger=false;
  //
  //			for(var i=0;i<initArr.length;i++){
  //				if(initArr[i].componentCode==componentCode&&initArr[i].windowCode==windowCode
  //				&&initArr[i].ruleSetCode==ruleSetCode&&initArr[i].ruleCode==ruleCode){
  //					//说明这个规则需要调试
  //					 isdebgger=true;
  //				}
  //			}
  //			return isdebgger;
}

const update = function (datas) {
  //更新服务器返回的调试更新信息
  //遍历浏览器发回来的更新信息，把已经不需要调试的规则，从调试信息数组中删除
  for (let i = 0; i < datas.length; i++) {
    if (datas[i].selected == true) {
      addDebuggerData(datas[i])
      //initArr.push(datas[i]);
    } else {
      removeDebuggerData(datas[i])
      //将不需要调试的对象,从数组中删除
      //				for(var j=0;j<initArr.length;j++){
      //					if(initArr[j].componentCode==datas[i].componentCode&&initArr[j].windowCode==datas[i].windowCode&&initArr[j].ruleSetCode==datas[i].ruleSetCode&&initArr[j].ruleCode==datas[i].ruleCode){
      //						initArr.splice(j,1);
      //					}
      //				}
    }
  }
}

const clear = function () {
  //清空浏览器端保存的调试信息
  initArr = []
  initFlag = false
  initMapping = {}
}

export { _putAop, clear, getHook, init, isDebugger, isInited, update }
