import * as component from '@v-act/vjs.framework.extension.platform.services.integration.vds.component'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
/**
 *  执行活动集
 *  业务逻辑：
 *  1，参数处理：
 *  	1）活动集入参处理：若为实体类型时，需根据映射关系克隆出一个新的DB。
 *  	2）活动集出参处理：执行活动集的结果和出参进行匹配，此处理逻辑放在回调函数中。
 *  	3）搜索窗体实体scopeIds：若执行窗体活动集，则需根据容器和tab名称搜索对应的窗体实例scopeId。
 *  2，执行loacal活动集时，直接调用前端框架API executeRoute。
 *  3，执行api/extensionPoint活动集时，表示构件间通信，则从服务中介Mediator调用对应活动集。
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as method from '@v-act/vjs.framework.extension.platform.services.integration.vds.method'
import {
  MethodContext,
  RuleContext
} from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as str from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
import * as win from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'

/**
 * 规则入口
 */
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject: (error: any) => void) {
    try {
      let inParamsObj = ruleContext.getVplatformInput()
      if (!inParamsObj) {
        //建议兼容
        inParamsObj = ''
      }
      //获取规则上下文中的规则配置值
      const routeContext = ruleContext.getMethodContext()
      //处理规则的入参
      const invokeTarget = inParamsObj['invokeTarget']
      processRuleLocation(invokeTarget)
      const invokeParams = inParamsObj['invokeParams']
      const returnMapping = inParamsObj['returnMapping']
      const filter = inParamsObj['filter'] //指定窗体域
      //设置并行属性（默认为false）
      const isRuleAsyn =
        invokeTarget.isParallelism &&
        invokeTarget.isParallelism.toLowerCase() == 'true'
      // if (invokeTarget.isParallelism) {
      // 	const ruleAsyn = invokeTarget.isParallelism;
      // 	if (ruleAsyn.toLowerCase() == "true") {
      // 		isRuleAsyn = true;
      // 	}
      // }
      //如果方法并行执行，则不建立父子关系 add by xiedh 2018-05-31  解决事务问题
      // const parentRouteContext = isRuleAsyn ? null : routeContext;
      // const currRouteRuntime = new RouteContext(null, parentRouteContext); //routeRuntime.init();
      // if (typeof (currRouteRuntime.setParentRuleContext) == "function") {
      // 	currRouteRuntime.setParentRuleContext(ruleContext);
      // }
      // currRouteRuntime.putEventArgument(args);
      //获取invokeTarget属性
      const componentCode = invokeTarget.componentCode //构件编码
      const windowCode = invokeTarget.windowCode //窗体编码
      const sourceType = invokeTarget.sourceType //方法来源类型：server-ruleSet、client-ruleSet
      const ruleSetCode = invokeTarget.ruleSetCode //方法编码
      const invokeType = invokeTarget.invokeType //

      if (!ruleSetCode) {
        throw exception.newConfigException('执行的方法编码不能为空！')
      }

      const func = function () {
        //处理活动集返回结果
        const setOutputFunc = _setOutputFunc(
          returnMapping,
          ruleContext,
          routeContext,
          resolve,
          reject
        )
        // const fireRouteCallbackFunc = _fireRouteCallback(ruleContext, isRuleAsyn, resolve);
        const callback = function (resultFromExeRuleSet: {
          [propName: string]: any
        }) {
          //如果当前域已效果再去执行返回值设置会引发问题，Task20200917109 xiedh 2020-09-23
          // const isActionListNormalWork = false;
          // if (scopeManager.isDestroy(scopeId)) {
          // 	routeContext.markForInterrupt(routeContext.GLOBAL);
          // } else {
          // 	isActionListNormalWork = setOutputFunc(resultFromExeRuleSet);
          // }
          setOutputFunc(resultFromExeRuleSet)
        }
        //TODO xiedh
        //ruleContext.setRuleCallbackFireFlag(true);
        //---------------------------执行活动集:本地的走框架API，构件间的走中介服务--------------------------------------
        // const config = {};
        const instanceRefs: string[] = []
        if (filter && filter['windowInstanceCode']) {
          // const context = new ExpressionContext();
          // context.setRouteContext(routeContext);
          const value = expression.execute(filter['windowInstanceCode'], {
            ruleContext: ruleContext
          })
          instanceRefs.push(value)
        }
        // config["instanceRefs"] = instanceRefs;
        // config["parentRouteContext"] = parentRouteContext;
        // config["currentRouteContext"] = currRouteRuntime;
        // config["callback"] = callback;
        const _parseParam = ruleContext.genAsynCallback(parseParam)
        if (invokeType == 'api') {
          //获取构件包
          const promise = component.getPack(componentCode, ruleSetCode)
          promise
            .then(function (mappings?: {
              componentCode: string
              funcCode: string
            }) {
              let _componentCode = componentCode
              let _ruleSetCode = ruleSetCode
              if (mappings) {
                _componentCode = mappings.componentCode
                _ruleSetCode = mappings.funcCode
              }
              const inputParam = _parseParam(
                invokeParams,
                _componentCode,
                windowCode,
                _ruleSetCode,
                sourceType,
                ruleContext
              )
              const promise = method.execute(_ruleSetCode, {
                componentCode: _componentCode,
                windowCode: windowCode,
                methodType:
                  sourceType == 'server-ruleSet'
                    ? method.MethodType.Server
                    : method.MethodType.Client,
                invokeType: invokeType,
                ruleContext: ruleContext,
                inputParam: inputParam,
                instanceIds: instanceRefs,
                isParallelism: isRuleAsyn
              })
              promise.then(callback).catch(reject)
            })
            .catch(reject)
        } else {
          const epConditionParams = getEpConditionParams(
            inParamsObj.epConditionParam,
            ruleContext
          )
          const inputParam = _parseParam(
            invokeParams,
            componentCode,
            windowCode,
            ruleSetCode,
            sourceType,
            ruleContext
          )
          const promise = method.execute(ruleSetCode, {
            componentCode: componentCode,
            windowCode: windowCode,
            methodType:
              sourceType == 'server-ruleSet'
                ? method.MethodType.Server
                : method.MethodType.Client,
            invokeType: invokeType,
            ruleContext: ruleContext,
            inputParam: inputParam,
            instanceIds: instanceRefs,
            isParallelism: isRuleAsyn,
            epParams: epConditionParams
          })
          promise.then(callback).catch(reject)
        }
      }
      // ruleContext.markRouteExecuteUnAuto();
      if (isRuleAsyn) {
        //并行处理异步域任务
        const newFun = ruleContext.genAsynCallback(func)
        setTimeout(newFun, 1)
        resolve()
      } else {
        func()
      }
    } catch (err: any) {
      reject(err)
    }
  })
}
const _setOutputFunc = function (
  returnMapping: Array<{
    destType: string
    dest: string
    src: string
    srcType: string
    destFieldMapping?: Array<{
      destField: string
      srcValueType: string
      srcValue: string
    }>
    updateDestEntityMethod: string
    isCleanDestEntityData: boolean
  }>,
  ruleContext: RuleContext,
  routeContext: MethodContext,
  resolve: () => void,
  reject: (error: any) => void
) {
  const callback = function (
    resultFromExeRuleSet: { [propName: string]: any },
    epImpInfo?: {
      componentCode: string
      windowCode: string
      ruleSetCode: string
    }
  ) {
    try {
      if (returnMapping && returnMapping.length > 0 && resultFromExeRuleSet) {
        // const tmpAllComponentVar = [];
        for (let i = 0; i < returnMapping.length; i++) {
          // const tmpSimpleComponent = {};
          const mapping = returnMapping[i]
          const dest = mapping['dest'] //目标名称
          if (!dest) {
            throw exception.newConfigException(
              '执行活动集规则出错：返回值设置目标不能为空！'
            )
          }
          const destType = mapping['destType'] //目标类型（entity：实体，control：控件，windowVariant：窗体变量，systemVariant：系统变量）
          const src = mapping['src'] //来源(returnValu:返回值，expression:表达式)
          const srcType = mapping['srcType'] //来源(当目标类型是实体时，返回实体存在此处)
          let value = null
          if (srcType == 'returnValue') {
            value = resultFromExeRuleSet[src]
          } else if (srcType == 'expression') {
            // const context = new ExpressionContext();
            // context.setRouteContext(currRouteRuntime);
            value = expression.execute(src, {
              ruleContext: ruleContext
            })
          }
          const extraParams: {
            epImpInfo: {} | { [propName: string]: string }
            sourceType: string
            returnDatas: any
          } = {}
          //扩展点信息
          if (epImpInfo) {
            extraParams.epImpInfo = {
              '#componentCode#': epImpInfo.componentCode,
              '#windowCode#': epImpInfo.windowCode,
              '#methodCode#': epImpInfo.ruleSetCode
            }
            extraParams.returnDatas = resultFromExeRuleSet
          } else {
            extraParams.epImpInfo = {}
          }
          /**
           * 修改insertOrUpdateRecords2Entity，操作类型为更新时，如果目标实体没有匹配id的记录，则不做任何操作，原来没匹配id时会新增记录<br>
           * 如果目标是实体类型时，走dbService.insertOrUpdateRecords2Entity，如果是其他类型，则走原来直接赋值的逻辑<br>
           * 原来case "entity"分支，由于目标是实体类型，所以已经抽到dbService.insertOrUpdateRecords2Entity中实现，所以在else分支中删除该逻辑<br>
           */
          const _info = _getInfo(dest, destType, ruleContext.getMethodContext())
          if (_info.isEntity) {
            const targetDs = _info.ds
            const destFieldMapping = mapping['destFieldMapping']
            const newMappings = []
            if (destFieldMapping) {
              const newMappings = []
              for (const j = 0, len = destFieldMapping.length; j < len; j++) {
                newMappings.push({
                  code: destFieldMapping[j]['destField'],
                  type: destFieldMapping[j]['srcValueType'],
                  value: destFieldMapping[j]['srcValue']
                })
              }
            }
            let updateDestEntityMethod = mapping['updateDestEntityMethod']
            if (updateDestEntityMethod == null) {
              updateDestEntityMethod = 'insertOrUpdateBySameId'
            }
            const isCleanDestEntityData = mapping['isCleanDestEntityData']
            let srcRecords
            if (src == '#fieldEntity#') {
              //特殊类型
              extraParams.sourceType = 'fieldEntity'
              srcRecords = [{}] //只一条记录
            } else {
              if (null == value) {
                //如果是ep实现，并且ep实现没有对应的实体输出，就暂时不处理
                if (epImpInfo) {
                  continue
                } else {
                  //										const exception = new Error("返回值的来源实体【"+src+"】不存在", undefined, undefined,exceptionFactory.TYPES.Config);
                  //										ruleContext.handleException(exception);
                  // throw ruleEngine.createRuleException({
                  // 	ruleContext: ruleContext,
                  // 	exception: new Error("返回值的来源实体【" + src + "】不存在", undefined, undefined, exceptionFactory.TYPES.Config)
                  // })
                  throw exception.newConfigException(
                    '返回值的来源实体【' + src + '】不存在'
                  )
                }
              }
              srcRecords = value.getAllRecords()
            }
            let isClear = false
            let mergeType
            switch (updateDestEntityMethod) {
              case 'loadRecord':
                mergeType = ds.MergeType.Load
                isClear = true
                break
              case 'updateRecord':
                mergeType = ds.MergeType.Update
                break
              default:
                mergeType = ds.MergeType.InsertOrUpdate
                isClear = isCleanDestEntityData
                break
            }
            ds.merge(
              targetDs,
              srcRecords,
              newMappings,
              mergeType,
              ruleContext.getMethodContext(),
              {
                isClear: isClear,
                extraParams: extraParams
              }
            )
            // vds.ds.merge(targetDs, srcRecords, destFieldMapping, updateDestEntityMethod, isCleanDestEntityData, ruleContext, extraParams);
          } else {
            switch (destType) {
              case 'windowVariant':
                win.setInput(dest, value)
                break
              case 'systemVariant':
                /*
                 * time 2017-01-04
                 * author liangzc
                 * desc 逻辑优化，把全部构件变量保存起来，最后统一调用后台处理。
                 * */
                // tmpSimpleComponent["code"] = dest;
                // tmpSimpleComponent["value"] = value;
                // tmpAllComponentVar.push(tmpSimpleComponent);
                component.setVariant(dest, value)
                break
              case 'control':
                setWidgetValue(dest, value)
                break
              case 'ruleSetVariant':
                routeContext.setVariable(dest, value)
                break
              case 'ruleSetOutput':
                routeContext.setOutput(dest, value)
                break
              case 'windowOutput':
                win.setOutput(dest, value)
                break
              default:
                log.error('无效的目标类型：' + destType)
                break
            }
          }
        }
        // /*调用批量设置构件变量的接口*/
        // if (undefined != tmpAllComponentVar && tmpAllComponentVar.length > 0) {
        // 	componentParam.setVariants(tmpAllComponentVar);
        // }
      }
      //设置业务返回值(暂时没有返回值)
      // const isActionListNormalWork = true;
      // const interruptType = currRouteRuntime.getInterruptType();
      // /* 如果被调用的活动集执行了中断规则，这里会识别出中断了当前活动集执行
      // 			  这样的话，需要把这个状态记录为执行活动集不是正常工作*/
      // if (interruptType == currRouteRuntime.CURRENT) {
      // 	isActionListNormalWork = false;
      // }
      // setResult(ruleContext, "isActionListNormalWork", isActionListNormalWork);
      resolve()
    } catch (error: any) {
      reject(error)
    }
  }
  return ruleContext.genAsynCallback(callback)
}

const _getInfo = function (
  entityName: string,
  entityType: string,
  methodContext: MethodContext
) {
  const info = {
    isEntity: false,
    ds: null
  }
  // 界面实体：开发系统中，有的规则用entity有的规则用window，此处做兼容
  if (entityType == 'entity' || entityType == 'window') {
    info.isEntity = true
    info.ds = ds.lookup(entityName)
  }
  // 窗体输入变量：开发系统中，有的规则用windowVariant有的规则用windowInput，此处做兼容
  else if (entityType == 'windowVariant' || entityType == 'windowInput') {
    const input = win.getInputType(entityName)
    if (input == 'entity') {
      info.isEntity = true
      info.ds = win.getInput(entityName)
    }
  }
  // 窗体输出变量
  else if (entityType == 'windowOutput') {
    const output = win.getOutputType(entityName)
    if (output == 'entity') {
      info.isEntity = true
      info.ds = win.getOutput(entityName)
    }
  }
  // 方法输入变量
  else if (entityType == 'ruleSetInput') {
    const varType = methodContext.getInputType(entityName)
    if (varType == 'entity') {
      info.isEntity = true
      info.ds = methodContext.getInput(entityName)
    }
  }
  // 方法输出变量
  else if (entityType == 'ruleSetOutput') {
    const varType = methodContext.getOutputType(entityName)
    if (varType == 'entity') {
      info.isEntity = true
      info.ds = methodContext.getOutput(entityName)
    }
  }
  // 方法变量：开发系统中，有的规则用ruleSetVariant有的规则用ruleSetVar，此处做兼容
  else if (entityType == 'ruleSetVariant' || entityType == 'ruleSetVar') {
    const varType = methodContext.getVariableType(entityName)
    if (varType == 'entity') {
      info.isEntity = true
      info.ds = methodContext.getVariable(entityName)
    }
  }
  return info
}

// const _fireRouteCallback = function (ruleContext, isRuleAsyn, resolve) {
// 	const callback = function () {
// 		// ruleContext.fireRuleCallback();
// 		// if (!isRuleAsyn) {//如果设置了串行，则重新设置路由回调
// 		// 	ruleContext.fireRouteCallback();
// 		// }
// 		resolve();
// 	}
// 	return ruleContext.genAsynCallback(callback);
// }

/**
 * 创建游离DB
 */
const getFreeDB = function (
  fieldsMapping: Array<{
    code: string
    name: string
    type: string
    initValue: any
  }>
) {
  const fields = []
  const freeDBName = 'freeDB_' + str.uuid()
  for (let i = 0, l = fieldsMapping.length; i < l; i++) {
    const param = fieldsMapping[i]
    fields.push({
      code: param.code,
      name: param.name,
      type: param.type,
      defaultValue: param.initValue
    })
  }
  // const json = {
  // 	"datas": {
  // 		"values": []
  // 	},
  // 	"metadata": {
  // 		"model": [{
  // 			"datasource": freeDBName,
  // 			"fields": fields
  // 		}]
  // 	}
  // };
  const json = {
    dsCode: freeDBName
  }
  return ds.unSerialize(fields, json)
}
/**
 * 解析扩展点条件参数
 * */
const getEpConditionParams = function (
  sourceParams: Array<{ paramCode: string; paramValue: any }>,
  ruleContext: RuleContext
) {
  const datas: { [propName: string]: any } = {}
  if (sourceParams) {
    for (let i = 0, len = sourceParams.length; i < len; i++) {
      const param = sourceParams[i]
      const code = param.paramCode
      let value = param.paramValue
      if (null != value && '' != value) {
        // const context = new ExpressionContext();
        // context.setRouteContext(routeContext);
        value = expression.execute(value, {
          ruleContext: ruleContext
        })
      }
      datas[code] = value
    }
  }
  return datas
}

/**
 * 参数解析
 */
const parseParam = function (
  invokeParams: Array<{
    paramCode: string
    paramSource: string
    paramType: string
    paramValue: any
    dataFilterType: string
    paramFieldMapping?: Array<{
      paramEntityField: string
      fieldValue: any
      fieldValueType: string
    }>
  }>,
  componentCode: string,
  windowCode: string,
  ruleSetCode: string,
  sourceType: string,
  ruleContext: RuleContext
) {
  const methodContext = ruleContext.getMethodContext()
  const param: { [propName: string]: any } = {}
  //获取活动集配置
  let ruleSetConfig
  if (windowCode) {
    ruleSetConfig = method.get(ruleSetCode, componentCode, windowCode)
  } else {
    // const componentRoute = sandBox.getService("vjs.framework.extension.platform.data.storage.schema.route.ComponentRoute");
    ruleSetConfig = method.get(ruleSetCode, componentCode)
  }
  for (let i = 0; invokeParams != null && i < invokeParams.length; i++) {
    const invokeObj = invokeParams[i]
    //实体来源：1，父活动集的输入变量中的实体 2，父活动集的上下文变量 中的实体3，窗体实体
    const paramCode = invokeObj['paramCode']
    const paramSource = invokeObj['paramSource']
    //参数类型，expression:表达式，entity:实体
    const paramType = invokeObj['paramType']
    const value = invokeObj['paramValue']
    //获取前台实体数据方式，modify:修改过的(新增,修改或删除的)，all:(默认,新增,修改或删除的)
    const dataFilterType = invokeObj['dataFilterType']
    const paramFieldMapping = invokeObj['paramFieldMapping']
    //参数实体字段类型
    // const paramFieldTypes = [];
    //删除的记录id
    const deleteIds = []
    if (paramCode == null || paramCode == '')
      throw exception.newConfigException('输入参数名不能为空')
    if (paramType == 'expression') {
      if (value != null && value != '') {
        // const context = new ExpressionContext();
        // context.setRouteContext(routeContext);
        param[paramCode] = expression.execute(value, {
          ruleContext: ruleContext
        })
      }
    } else if (paramType == 'entity') {
      const entityName = value
      //校验
      if (paramFieldMapping == null || paramFieldMapping.length == 0)
        throw exception.newConfigException(
          '输入参数类型为实体时，参数实体字段映射不能为空'
        )
      for (
        let k = 0;
        paramFieldMapping != null && k < paramFieldMapping.length;
        k++
      ) {
        const paramEntityField = paramFieldMapping[k]['paramEntityField']
        //字段值(字段值类型为field时为前台实体的字段,否则为表达式)
        const fieldValue = paramFieldMapping[k]['fieldValue']
        //field:前台实体字段,expression:表达式
        const fieldValueType = paramFieldMapping[k]['fieldValueType']
        if (paramEntityField == null || paramEntityField == '') {
          throw exception.newConfigException(
            '输入参数类型为实体时，参数实体字段不能为空'
          )
        }
        if (
          fieldValueType == 'entityField' &&
          (fieldValue == null || fieldValue == '')
        ) {
          throw exception.newConfigException(
            '输入参数类型为实体时，来源字段配置不能为空'
          )
        }
      }
      let fieldsMapping = []
      if ('server-ruleSet' == sourceType) {
        for (let j = 0; j < paramFieldMapping.length; j++) {
          const fMapping = paramFieldMapping[j]
          const fCode = fMapping.paramEntityField
          // const fType = "any";
          const entityEle = {
            code: fCode,
            type: 'any',
            name: '',
            configs: null
          }
          fieldsMapping.push(entityEle)
        }
      } else {
        if (!ruleSetConfig) {
          // const exception = exceptionFactory.create({
          // 	"message": "请先打开目标组件容器！componentCode=" + componentCode + "windowCode=" + windowCode,
          // 	"type": exceptionFactory.TYPES.Business
          // });
          throw exception.newConfigException(
            '请先打开目标组件容器！componentCode=' +
              componentCode +
              'windowCode=' +
              windowCode
          )
        }
        //创建游离DB
        fieldsMapping = ruleSetConfig.getInput(paramCode).getConfigs() //inputs[paramCode].configs;
      }
      const freeDB = getFreeDB(fieldsMapping)
      let srcDB = null
      switch (paramSource) {
        case 'ruleSetInput':
          srcDB = methodContext.getInput(entityName)
          break
        case 'ruleSetVar':
          srcDB = methodContext.getVariable(entityName)
          break
        case 'windowInput':
          srcDB = win.getInput(entityName)
          break
        default:
          srcDB = ds.lookup(entityName)
          break
      }

      if (srcDB) {
        const _mappings = []
        for (let j = 0; j < paramFieldMapping.length; j++) {
          const fMapping = paramFieldMapping[j]
          _mappings.push({
            sourceValue: fMapping['fieldValue'],
            type: fMapping['fieldValueType'],
            destField: fMapping['paramEntityField']
          })
        }
        // datasourcePusher.copyBetweenEntities({
        ds.copy(srcDB, freeDB, _mappings, {
          dataFilterType: dataFilterType,
          context: methodContext
        })
      }

      param[paramCode] = freeDB
    }
  }
  return param
}

/**
 * 处理invokeTarget参数：
 * 1，调用本地或扩展点活动集
 * 		1）componentCode取当前窗体所在构件的
 *      2）如果活动集所在位置是window级别，且windowCode为空，则取当前窗体的windowCode
 * 2，调用方式为API不做处理
 */
const processRuleLocation = function (invokeTarget: {
  componentCode?: string
  windowCode?: string
  ruleLocation: string
  invokeType: string
}) {
  const ruleLocation = invokeTarget.ruleLocation
  const invokeType = invokeTarget.invokeType
  if (
    invokeType == 'local' ||
    invokeType == 'extensionPoint' ||
    invokeType == 'spi'
  ) {
    //取当前窗体所在构件的code赋值componentCode
    //如果窗体code为空，同样取当前窗体的windowCode
    invokeTarget.componentCode = component.getCode()
    if (ruleLocation == 'window' && !invokeTarget.windowCode) {
      invokeTarget.windowCode = win.getCode()
    }
  }
}
/**
 * 给控件赋值
 */
const setWidgetValue = function (destWidgetId: string, value: any) {
  let widgetCode
  if (destWidgetId != null && destWidgetId.indexOf('.') != -1) {
    const splits = destWidgetId.split('.')
    widgetCode = splits[0]
  } else {
    widgetCode = destWidgetId
  }
  //2017-01-18 liangzc：判断是否多值控件
  const control_store_type = widget.getStoreType(widgetCode)
  if (
    control_store_type != undefined &&
    control_store_type == 'singleRecordMultiValue'
  ) {
    widget.execute(widgetCode, 'setValue', [value])
  } else {
    // widgetDatasource.setSingleValue(widgetCode, value);
    const datasourceNames = widget.getDatasourceCodes(widgetCode)
    if (!datasourceNames) {
      return
    }
    if (datasourceNames.length > 1) {
      throw exception.newConfigException(
        '获取控件【' +
          widgetCode +
          '】数据源失败！原因：控件绑定了多个数据源，但又没指定获取哪个数据源'
      )
    }
    const datasourceName = datasourceNames[0]
    const datasource = ds.lookup(datasourceName)
    // const datasource = getBindDatasource(widgetCode);
    // const fields = getBindDatasourceFields(widgetCode);
    const fields = widget.getFieldCodes(datasourceName, widgetCode)
    if (fields.length > 1)
      throw new Error(
        '接口调用错误，控件【' + widgetCode + '】绑定了多个字段！'
      )
    const field = fields[0]
    if (datasource == null || fields.length < 1) {
      widget.execute(widgetCode, 'setValue', value)
    } else {
      let record = datasource.getCurrentRecord()
      if (!record) {
        record = datasource.createRecord()
        datasource.insertRecords([record])
        record = datasource.getRecordById(record.getSysId())
      }
      record.set(field, value)
      datasource.updateRecords([record])
    }
  }
}
export { main }
