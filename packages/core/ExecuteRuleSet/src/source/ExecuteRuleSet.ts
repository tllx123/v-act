import { log as log } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceUtil as dbService } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { ExpressionEngine as formulaEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.engine.route'
import { RouteContext as RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { mediator as mediator } from '@v-act/vjs.framework.extension.system'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ComponentInit as componentInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetDatasource as widgetDatasource } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.logic.datasource'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'
import { DatasourcePusher as datasourcePusher } from '@v-act/vjs.framework.extension.platform.services.domain.datasource'
import { ApplicationParam as appData } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { snapshotManager as snapshotManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.snapshot'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { ScopeTask as ScopeTask } from '@v-act/vjs.framework.extension.platform.global.task'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global.data'
import { TaskManager as TaskManager } from '@v-act/vjs.framework.extension.platform.global.task'
let sandBox

exports.initModule = function (sBox) {
  sandBox = sBox
}

let main = function (ruleContext) {
  //获取规则上下文中的规则配置值
  let routeContext = ruleContext.getRouteContext()
  let args = routeContext.getEventArguments()
  //处理规则的入参
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let invokeTarget = inParamsObj['invokeTarget']
  processRuleLocation(invokeTarget)
  let invokeParams = inParamsObj['invokeParams']
  let returnMapping = inParamsObj['returnMapping']
  let filter = inParamsObj['filter']
  //设置并行属性（默认为false）
  let isRuleAsyn = false
  if (invokeTarget.isParallelism) {
    let ruleAsyn = invokeTarget.isParallelism
    if (ruleAsyn.toLowerCase() == 'true') {
      isRuleAsyn = true
    }
  }
  //如果方法并行执行，则不建立父子关系 add by xiedh 2018-05-31  解决事务问题
  let parentRouteContext = isRuleAsyn ? null : routeContext
  let currRouteRuntime = new RouteContext(null, parentRouteContext) //routeRuntime.init();
  if (typeof currRouteRuntime.setParentRuleContext == 'function') {
    currRouteRuntime.setParentRuleContext(ruleContext)
  }
  currRouteRuntime.putEventArgument(args)
  //获取invokeTarget属性
  let componentCode = invokeTarget.componentCode
  let windowCode = invokeTarget.windowCode
  let sourceType = invokeTarget.sourceType
  let ruleSetCode = invokeTarget.ruleSetCode
  let invokeType = invokeTarget.invokeType

  if (!ruleSetCode) {
    throw Error('[ExecuteRuleSet.main]执行活动集规则出错：不存在ruleSetCode！')
  }

  let func = (function () {
    return function () {
      //处理活动集返回结果
      let scopeId = scopeManager.getCurrentScopeId()
      let setOutputFunc = _setOutputFunc(
        scopeId,
        returnMapping,
        ruleContext,
        routeContext,
        currRouteRuntime
      )
      let fireRouteCallbackFunc = _fireRouteCallback(
        scopeId,
        ruleContext,
        isRuleAsyn
      )
      let callback = function (resultFromExeRuleSet) {
        let isActionListNormalWork = setOutputFunc(resultFromExeRuleSet)
        fireRouteCallbackFunc()
        return isActionListNormalWork
      }
      //TODO xiedh
      //ruleContext.setRuleCallbackFireFlag(true);
      //---------------------------执行活动集:本地的走框架API，构件间的走中介服务--------------------------------------
      let config = {}
      let instanceRefs = []
      if (filter && filter['windowInstanceCode']) {
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        let value = formulaEngine.execute({
          expression: filter['windowInstanceCode'],
          context: context
        })
        instanceRefs.push(value)
      }
      config['instanceRefs'] = instanceRefs
      config['parentRouteContext'] = parentRouteContext
      config['currentRouteContext'] = currRouteRuntime
      config['callback'] = callback
      let serviceName = mediator.getServiceName(
        componentCode,
        windowCode,
        ruleSetCode,
        sourceType
      )
      switch (invokeType) {
        case 'spi':
        case 'local':
          var inputParam = parseParam(
            invokeParams,
            componentCode,
            windowCode,
            ruleSetCode,
            invokeType,
            sourceType,
            routeContext
          )
          routeEngine.execute({
            targetConfig: invokeTarget,
            inputParam: inputParam,
            config: config
          })
          break
        case 'api':
          //调用目标构件的活动集在中介服务中不存在时,则先行加载目标构件模块,并将目标构建的API信息注册到中介服务
          var scopeId = scopeManager.getCurrentScopeId()
          var publishCallback = function () {
            //如果加载目标构件后，仍未向中介服务注册API，则报错！说明目标构件没有导出API
            try {
              var checkAgaingServece = mediator.isExistService(serviceName)
              if (checkAgaingServece) {
                //生成活动集入參需要在调用点域中，comment by xiedh 2015-09-16
                scopeManager.openScope(scopeId)
                snapshotManager.begine(routeContext.snapshotId)
                var inputParam = parseParam(
                  invokeParams,
                  componentCode,
                  windowCode,
                  ruleSetCode,
                  invokeType,
                  sourceType,
                  routeContext
                )
                scopeManager.closeScope()
                snapshotManager.end()
                mediator.publish(serviceName, [inputParam, config])
              } else {
                throw new Error(
                  '执行目标构件活动集出错！请检查目标构件:' +
                    componentCode +
                    '是否包含此API:' +
                    ruleSetCode
                )
              }
            } catch (e) {
              ruleContext.handleException(e)
            }
          }
          var errorPublishCallback = function (e) {
            var message = e
              ? e.message
              : '执行目标构件活动集出错！请检查目标构件:' +
                componentCode +
                '是否已部署！'
            e = new Error(message)
            ruleContext.handleException(e)
          }
          //actionHandler.executeComponentAction("getComponentByCode",componentCode,publishCallback,errorPublishCallback);
          var tmpMapping = componentPackData.getMapping({
            componentCode: componentCode,
            code: ruleSetCode
          })
          if (null != tmpMapping) {
            componentCode = tmpMapping.componentCode
            ruleSetCode = tmpMapping.funcCode
            serviceName = mediator.getServiceName(
              componentCode,
              windowCode,
              ruleSetCode,
              sourceType
            )
          }
          componentInit.initComponent({
            componentCode: componentCode,
            success: publishCallback,
            error: errorPublishCallback
          })
          break
        case 'extensionPoint':
          var isExistService = mediator.isExistService(serviceName)
          if (isExistService) {
            //ep执行条件参数
            var epConditionParams = getEpConditionParams(
              inParamsObj.epConditionParam,
              routeContext
            )
            epConditionParams['#invokeScope#'] = handleInvokeScope(
              invokeTarget.invokeScope
            )
            var inputParam = parseParam(
              invokeParams,
              componentCode,
              windowCode,
              ruleSetCode,
              invokeType,
              sourceType,
              routeContext
            )
            config['callback'] = setOutputFunc
            mediator.publishSerializable(
              serviceName,
              [inputParam, config, epConditionParams],
              fireRouteCallbackFunc
            )
          } else {
            //throw new BusinessException("执行活动集出错(扩展点),请先打开目标组件容器！");
            log.log(
              '该扩展点未找到[构件编号:' +
                componentCode +
                '窗体编号:' +
                windowCode +
                '活动集名称：' +
                ruleSetCode +
                '请检查服务映射信息是否发布或对应窗体是否已打开!'
            )
            ruleContext.fireRuleCallback()
          }
          break
      }
    }
  })()
  ruleContext.markRouteExecuteUnAuto()
  if (isRuleAsyn) {
    //并行处理异步域任务
    let scopeId = scopeManager.getCurrentScopeId()
    let task = new ScopeTask(scopeId, true, func)
    TaskManager.addTask(task)
    ruleContext.fireRouteCallback()
  } else {
    func()
  }
}

/**
 * 处理执行范围
 * @param {String} invokeScope 范围参数
 * */
let handleInvokeScope = function (invokeScope) {
  let childWindowInfos = null //null 表示没有配置执行范围，如果有配置执行范围，那就是数组
  if (invokeScope == 'child') {
    childWindowInfos = []
    let windowScope = scopeManager.getWindowScope()
    let childScopes = scopeManager.getChildrenScopes(
      windowScope.getInstanceId()
    )
    if (childScopes) {
      for (let i = 0, len = childScopes.length; i < len; i++) {
        let childScope = childScopes[i]
        let scopeId = childScope.getInstanceId()
        if (scopeManager.isWindowScope(scopeId)) {
          childWindowInfos.push({
            componentCode: childScope.getComponentCode(),
            windowCode: childScope.getWindowCode(),
            scopeId: scopeId
          })
        }
      }
    }
  }
  return childWindowInfos
}

let _setOutputFunc = function (
  scopeId,
  returnMapping,
  ruleContext,
  routeContext,
  currRouteRuntime
) {
  return function (resultFromExeRuleSet, epImpInfo) {
    scopeManager.openScope(scopeId)
    if (returnMapping && returnMapping.length > 0) {
      let tmpAllComponentVar = []
      for (let i = 0; i < returnMapping.length; i++) {
        let tmpSimpleComponent = {}
        let mapping = returnMapping[i]
        let dest = mapping['dest'] //目标名称
        if (!dest) {
          throw Error(
            '[ExecuteRuleSet.main]执行活动集规则出错：返回值设置目标不能为空！'
          )
        }
        let destType = mapping['destType'] //目标类型（entity：实体，control：控件，windowVariant：窗体变量，systemVariant：系统变量）
        let src = mapping['src'] //来源(returnValu:返回值，expression:表达式)
        let srcType = mapping['srcType'] //来源(当目标类型是实体时，返回实体存在此处)
        let value = null
        if (srcType == 'returnValue') {
          value = resultFromExeRuleSet[src]
        } else if (srcType == 'expression') {
          let context = new ExpressionContext()
          context.setRouteContext(currRouteRuntime)
          value = formulaEngine.execute({
            expression: src,
            context: context
          })
        }
        let extraParams = {}
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
         * 2015-05-09 liangchaohui：<br>
         * 修改insertOrUpdateRecords2Entity，操作类型为更新时，如果目标实体没有匹配id的记录，则不做任何操作，原来没匹配id时会新增记录<br>
         * 如果目标是实体类型时，走dbService.insertOrUpdateRecords2Entity，如果是其他类型，则走原来直接赋值的逻辑<br>
         * 原来case "entity"分支，由于目标是实体类型，所以已经抽到dbService.insertOrUpdateRecords2Entity中实现，所以在else分支中删除该逻辑<br>
         */
        if (dbService.isEntity(dest, destType, ruleContext)) {
          let destFieldMapping = mapping['destFieldMapping']
          let updateDestEntityMethod = mapping['updateDestEntityMethod']
          if (updateDestEntityMethod == null) {
            updateDestEntityMethod = 'insertOrUpdateBySameId'
          }
          let isCleanDestEntityData = mapping['isCleanDestEntityData']
          let srcRecords
          if (src == '#fieldEntity#') {
            //特殊类型
            extraParams.sourceType = 'fieldEntity'
            srcRecords = [{}] //只一条记录
          } else {
            if (null == value && epImpInfo) {
              //如果是ep实现，并且ep实现没有对应的实体输出，就暂时不处理
              continue
            }
            srcRecords = value.getAllRecords()
          }
          dbService.insertOrUpdateRecords2Entity(
            dest,
            destType,
            srcRecords,
            destFieldMapping,
            updateDestEntityMethod,
            isCleanDestEntityData,
            ruleContext,
            extraParams
          )
        } else {
          switch (destType) {
            case 'windowVariant':
              windowParam.setInput({
                code: dest,
                value: value
              })
              break
            case 'systemVariant':
              /*
               * time 2017-01-04
               * author liangzc
               * desc 逻辑优化，把全部构件变量保存起来，最后统一调用后台处理。
               * */
              tmpSimpleComponent['code'] = dest
              tmpSimpleComponent['value'] = value
              tmpAllComponentVar.push(tmpSimpleComponent)
              //									componentParam.setVariant({
              //										"code":dest,
              //										"value":value
              //									});
              break
            case 'control':
              setWidgetValue(dest, value)
              break
            case 'ruleSetVariant':
              routeContext.setVariable(dest, value)
              break
            case 'ruleSetOutput':
              routeContext.setOutputParam(dest, value)
              break
            case 'windowOutput':
              windowParam.setOutput({
                code: dest,
                value: value
              })
              break
            default:
              log.error('无效的目标类型：' + destType)
              break
          }
        }
      }
      /*调用批量设置构件变量的接口*/
      if (undefined != tmpAllComponentVar && tmpAllComponentVar.length > 0) {
        componentParam.setVariants(tmpAllComponentVar)
      }
    }
    //设置业务返回值
    let isActionListNormalWork = true
    let interruptType = currRouteRuntime.getInterruptType()
    /* 如果被调用的活动集执行了中断规则，这里会识别出中断了当前活动集执行
                        这样的话，需要把这个状态记录为执行活动集不是正常工作*/
    if (interruptType == currRouteRuntime.CURRENT) {
      isActionListNormalWork = false
    }
    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult({
        isActionListNormalWork: isActionListNormalWork
      })
    }
    scopeManager.closeScope()
    return isActionListNormalWork
  }
}

let _fireRouteCallback = function (scopeId, ruleContext, isRuleAsyn) {
  return function () {
    scopeManager.openScope(scopeId)
    ruleContext.fireRuleCallback()
    if (!isRuleAsyn) {
      //如果设置了串行，则重新设置路由回调
      ruleContext.fireRouteCallback()
    }
    scopeManager.closeScope()
  }
}

/**
 * 创建游离DB
 */
let getFreeDB = function (fieldsMapping) {
  let json = createJsonFronConfig(fieldsMapping)
  return datasourceFactory.unSerialize(json)
}

let createJsonFronConfig = function (params) {
  let fields = []
  let freeDBName = 'freeDB_' + uuid.generate()
  for (let i = 0, l = params.length; i < l; i++) {
    let param = params[i]
    fields.push({
      code: param.getCode(),
      name: param.getName(),
      type: param.getType(),
      defaultValue: param.geInitValue()
    })
  }
  return {
    datas: {
      values: []
    },
    metadata: {
      model: [
        {
          datasource: freeDBName,
          fields: fields
        }
      ]
    }
  }
}
/**
 * 解析扩展点条件参数
 * */
let getEpConditionParams = function (sourceParams, routeContext) {
  let datas = {}
  if (sourceParams) {
    for (let i = 0, len = sourceParams.length; i < len; i++) {
      let param = sourceParams[i]
      let code = param.paramCode
      let value = param.paramValue
      if (null != value && '' != value) {
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        value = formulaEngine.execute({
          expression: value,
          context: context
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
let parseParam = function (
  invokeParams,
  componentCode,
  windowCode,
  ruleSetCode,
  invokeType,
  sourceType,
  routeContext
) {
  let param = {}
  //获取活动集配置
  let ruleSetConfig
  if (windowCode) {
    let windowRoute = sandBox.getService(
      'vjs.framework.extension.platform.data.storage.schema.route.WindowRoute'
    )
    ruleSetConfig = windowRoute.getRoute({
      componentCode: componentCode,
      windowCode: windowCode,
      routeCode: ruleSetCode
    })
  } else {
    let componentRoute = sandBox.getService(
      'vjs.framework.extension.platform.data.storage.schema.route.ComponentRoute'
    )
    ruleSetConfig = componentRoute.getRoute({
      componentCode: componentCode,
      routeCode: ruleSetCode
    })
  }
  for (let i = 0; invokeParams != null && i < invokeParams.length; i++) {
    let invokeObj = invokeParams[i]
    //实体来源：1，父活动集的输入变量中的实体 2，父活动集的上下文变量 中的实体3，窗体实体
    let paramCode = invokeObj['paramCode']
    let paramSource = invokeObj['paramSource']
    //参数类型，expression:表达式，entity:实体
    let paramType = invokeObj['paramType']
    let value = invokeObj['paramValue']
    //获取前台实体数据方式，modify:修改过的(新增,修改或删除的)，all:(默认,新增,修改或删除的)
    let dataFilterType = invokeObj['dataFilterType']
    let paramFieldMapping = invokeObj['paramFieldMapping']
    //参数实体字段类型
    let paramFieldTypes = []
    //删除的记录id
    let deleteIds = []
    if (paramCode == null || paramCode == '')
      throw new Error('输入参数名不能为空')
    if (paramType == 'expression') {
      if (value != null && value != '') {
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        param[paramCode] = formulaEngine.execute({
          expression: value,
          context: context
        })
      }
    } else if (paramType == 'entity') {
      let entityName = value
      //校验
      if (paramFieldMapping == null || paramFieldMapping.length == 0)
        throw new Error('输入参数类型为实体时，参数实体字段映射不能为空')
      for (
        let k = 0;
        paramFieldMapping != null && k < paramFieldMapping.length;
        k++
      ) {
        let paramEntityField = paramFieldMapping[k]['paramEntityField']
        //字段值(字段值类型为field时为前台实体的字段,否则为表达式)
        let fieldValue = paramFieldMapping[k]['fieldValue']
        //field:前台实体字段,expression:表达式
        let fieldValueType = paramFieldMapping[k]['fieldValueType']
        if (paramEntityField == null || paramEntityField == '') {
          throw new Error('输入参数类型为实体时，参数实体字段不能为空')
        }
        if (
          fieldValueType == 'entityField' &&
          (fieldValue == null || fieldValue == '')
        ) {
          throw new Error('输入参数类型为实体时，来源字段配置不能为空')
        }
      }
      if (!ruleSetConfig) {
        let exception = exceptionFactory.create({
          message:
            '请先打开目标组件容器！componentCode=' +
            componentCode +
            'windowCode=' +
            windowCode,
          type: exceptionFactory.TYPES.Business
        })
        throw exception
      }
      //创建游离DB
      let fieldsMapping = ruleSetConfig.getInput(paramCode).getConfigs() //inputs[paramCode].configs;
      let freeDB = getFreeDB(fieldsMapping)
      let srcDB = null
      switch (paramSource) {
        case 'ruleSetInput':
          srcDB = routeContext.getInputParam(entityName)
          break
        case 'ruleSetVar':
          srcDB = routeContext.getVariable(entityName)
          break
        case 'windowInput':
          srcDB = windowParam.getInput({ code: entityName })
          break
        default:
          srcDB = datasourceManager.lookup({
            datasourceName: entityName
          })
          break
      }

      if (srcDB) {
        datasourcePusher.copyBetweenEntities({
          sourceEntity: srcDB,
          destEntity: freeDB,
          valuesMapping: paramFieldMapping,
          dataFilterType: dataFilterType,
          routeContext: routeContext
        })
      }

      param[paramCode] = freeDB
    }
  }
  if (sourceType == 'server-ruleSet') {
    return param
  }
  //如果调用活动集时，设置了入参，则将此入参的值覆盖到活动集原始配置参数中。
  let mockParam = {}
  if (ruleSetConfig && ruleSetConfig.getInputs()) {
    let ruleSetcfg_inputs = ruleSetConfig.getInputs()
    for (let i = 0, l = ruleSetcfg_inputs.length; i < l; i++) {
      let input_Obj = ruleSetcfg_inputs[i]
      let input_value = input_Obj.geInitValue()
      let type = input_Obj.getType()
      //如果参数为实体类型，则转为游离DB
      if (type == 'entity') {
        let fieldsMapping = input_Obj.getConfigs()
        let freeDB = getFreeDB(fieldsMapping)
        input_value = freeDB
      }
      mockParam[input_code] = input_value
      for (let param_code in param) {
        if ((input_code = param_code)) {
          mockParam[input_code] = param[param_code]
        }
      }
    }
  }
  //执行SPI活动集时，当发现有configData信息时，需要以configData的入参来替换掉原装SPI入参
  if (invokeType == 'spi') {
    let configData_inputs = appData.getRuleSetInputs({
      componentCode: componentCode,
      windowCode: windowCode,
      metaCode: ruleSetCode
    })
    if (configData_inputs && configData_inputs.length > 0) {
      //用configData过滤:只过滤非实体类型。(目前只考虑简单类型的匹配，即非实体类型)
      if (configData_inputs && configData_inputs.length > 0) {
        for (let input_code in mockParam) {
          for (let j = 0; j < configData_inputs.length; j++) {
            let configDataObj = configData_inputs[j]
            let configDataObj_code = configDataObj.getCode()
            let configDataObj_initValue = configDataObj.geInitValue()
            if (input_code == configDataObj_code) {
              mockParam[input_code] = configDataObj_initValue
            }
          }
        }
      }
    }
  }
  return mockParam
}

let copyEntityFromMapping = function (
  srcEntity,
  destEntity,
  valuesMapping,
  dataFilterType
) {
  let dataValues = []
  //得到源实体所有记录
  let srcAllRecords = srcEntity.getAllRecords().toArray()
  //根据值映射信息将记录载入目标实体
  for (let i = 0; i < srcAllRecords.length; i++) {
    let curRecord = srcAllRecords[i]
    let dsState = curRecord.getState()
    let paramValueObj = {}
    let isExistValue = false
    for (let j = 0; j < valuesMapping.length; j++) {
      let mapping = valuesMapping[j]
      let paramEntityField = mapping['paramEntityField']
      let fieldValueType = mapping['fieldValueType']
      let fieldValue = mapping['fieldValue']
      if (dataFilterType == 'modify' && dsState == 'default') {
        continue
      }
      if (curRecord != null) {
        isExistValue = true
        //字段值类型为前台实体字段时
        if (fieldValueType == 'field') {
          paramValueObj[paramEntityField] = curRecord.get(fieldValue)
        } else {
          //表达式类型
          paramValueObj[paramEntityField] =
            formulaUtil.evalExpression(fieldValue)
        }
      }
    }
    // 如果记录没有ID的情况下，补充UUID
    if (isExistValue) {
      if (typeof paramValueObj.id == 'undefined' || null == paramValueObj.id) {
        paramValueObj.id = uuid.generate()
      }
      dataValues.push(paramValueObj)
    }
  }
  let valuesCfg = {
    metadata: {
      model: destEntity.getMetadata()
    },
    datas: {
      values: dataValues
    }
  }
  destEntity.loadData(valuesCfg, true, false, true)
  destEntity.resetState()
  return destEntity
}

/**
 * 处理invokeTarget参数：
 * 1，调用本地或扩展点活动集
 * 		1）componentCode取当前窗体所在构件的
 *      2）如果活动集所在位置是window级别，且windowCode为空，则取当前窗体的windowCode
 * 2，调用方式为API不做处理
 */
let processRuleLocation = function (invokeTarget) {
  let ruleLocation = invokeTarget.ruleLocation
  let invokeType = invokeTarget.invokeType
  if (
    invokeType == 'local' ||
    invokeType == 'extensionPoint' ||
    invokeType == 'spi'
  ) {
    //取当前窗体所在构件的code赋值componentCode
    //如果窗体code为空，同样取当前窗体的windowCode
    if (ruleLocation == 'window' && !invokeTarget.windowCode) {
      let scope = scopeManager.getWindowScope()
      invokeTarget.componentCode = scope.getComponentCode()
      invokeTarget.windowCode = scope.getWindowCode()
    } else {
      let scope = scopeManager.getScope()
      invokeTarget.componentCode = scope.getComponentCode()
    }
  }
}
/**
 * 给控件赋值
 */
let setWidgetValue = function (destWidgetId, value) {
  let widgetCode
  if (destWidgetId != null && destWidgetId.indexOf('.') != -1) {
    let splits = destWidgetId.split('.')
    let widgetCode = splits[0]
  } else {
    widgetCode = destWidgetId
  }
  //2017-01-18 liangzc：判断是否多值控件
  let control_store_type = widgetContext.getStoreType(widgetCode)
  if (
    control_store_type != undefined &&
    control_store_type == 'singleRecordMultiValue'
  ) {
    widgetProperty.set(widgetCode, 'Value', value)
  } else {
    widgetDatasource.setSingleValue(widgetCode, value)
  }
}

export { main }
