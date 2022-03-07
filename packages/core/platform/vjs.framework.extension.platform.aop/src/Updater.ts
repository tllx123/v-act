import { WindowDatasource as windowDatasource } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'
import {
  ComponentParam as componentParam,
  WindowParam as windowParam
} from '@v-act/vjs.framework.extension.platform.services.param.manager'

export function initModule(sb) {}

let _iterate = function (obj, fn) {
  if (obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        fn(key, obj[key])
      }
    }
  }
}

let _setVal = function (data, getFn, setFn) {
  _iterate(data, function (key, config) {
    let type = config.config.type
    if (type == 'entity') {
      let ds = getFn(key)
      _updateDS(ds, config)
    } else {
      setFn(key, config.data.value)
    }
  })
}

let _updateDS = function (ds, config) {
  let datas = config.datas
  for (let i = 0, l = datas.length; i < l; i++) {
    let dt = datas[i]
    let val = dt.value,
      op = dt.operation
    if (op === 'insert') {
      let rd = ds.createRecord()
      rd.setDatas(val)
      ds.insertRecords({ records: [rd] })
    } else if (op === 'update') {
      let rd = ds.getRecordById(val.id)
      rd.setDatas(val)
      ds.updateRecords({ records: [rd] })
    } else if (op === 'delete') {
      ds.removeRecordByIds({ ids: [val.id] })
    }
  }
}

let _updateComponentVars = function (data) {
  _setVal(
    data,
    function (code) {
      return componentParam.getVariant({ code: code })
    },
    function (code, val) {
      componentParam.setVariant({ code: code, value: val })
    }
  )
}

let _udpateWindowVars = function (data) {
  _setVal(
    data,
    function (code) {
      return windowParam.getInput({ code: code })
    },
    function (code, val) {
      windowParam.setInput({ code: code, value: val })
    }
  )
}

let _updateWindowOuts = function (data) {
  _setVal(
    data,
    function (code) {
      return windowParam.getOutput({ code: code })
    },
    function (code, val) {
      windowParam.setOutput({ code: code, value: val })
    }
  )
}

let _updateRouteVars = function (data, rctx) {
  _setVal(
    data,
    function (code) {
      return rctx.getVariable(code)
    },
    function (code, val) {
      rctx.setVariable(code, val)
    }
  )
}

let _updateRouteIns = function (data, rctx) {
  _setVal(
    data,
    function (code) {
      return rctx.getInputParam(code)
    },
    function (code, val) {
      rctx.setInputParam(code, val)
    }
  )
}

let _updateRouteOuts = function (data, rctx) {
  _setVal(
    data,
    function (code) {
      return rctx.getOutPutParam(code)
    },
    function (code, val) {
      rctx.setOutputParam(code, val)
    }
  )
}

let _updateEntities = function (entities) {
  _iterate(entities, function (name, config) {
    let ds = windowDatasource.lookup({ datasourceName: name })
    _updateDS(ds, config)
  })
}

const update = function (data, routeContext) {
  _updateComponentVars(data.componentVariants)
  _udpateWindowVars(data.windowVariants)
  _updateWindowOuts(data.windowOutputs)
  let routeCtx = data.routeContext
  if (routeCtx) {
    _updateRouteIns(routeCtx.inputs, routeContext)
    _updateRouteVars(routeCtx.variants, routeContext)
    _updateRouteOuts(routeCtx.outputs, routeContext)
  }
  _updateEntities(data.entities)
}

export {
  _putAop,
  addRequest,
  clear,
  genParams,
  getHook,
  init,
  isDebugger,
  isInited,
  remove,
  update
}
