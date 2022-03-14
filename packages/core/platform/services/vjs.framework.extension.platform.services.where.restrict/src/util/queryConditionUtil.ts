import {
  ExpressionContext,
  ExpressionEngine as expressionEngine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { StringUtil as strUtil } from '@v-act/vjs.framework.extension.util.string'

/**
 * 是否不需要参数化的操作符，例如is,is not
 * @param operation 操作符
 */
let needlessParameterizedOperations = ['is', 'is not']
let isNeedlessParameterized = function (operation) {
  for (let i = 0; i < needlessParameterizedOperations.length; i++) {
    if (needlessParameterizedOperations[i] === strUtil.trim(operation)) {
      return true
    }
  }
  return false
}

let getCurrentRecord = function (ds) {
  let manager = sb.getService(
    'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
  )
  let datasource = manager.lookup({ datasourceName: ds })
  return datasource.getCurrentRecord()
}

let getDsName = function (widgetCode) {
  let windowVmManager = sandbox.getService(
    'vjs.framework.extension.platform.services.vmmapping.manager.WindowVMMappingManager'
  )
  let dsNames = windowVmManager.getDatasourceNamesByWidgetCode({
    widgetCode: relaWidgetId
  })
  return dsNames[0]
}

/**
 * 获取自定义参数的值
 * @param queryfieldValue 参数值
 * @param type 参数类源类型(参数值类型1表字段，2系统变量，3组件变量，4固定值，5自定义，6面板参数，8控件的值, 9表达式)
 * @param componentControlId 参数来源控件
 */
let getCustomParamValue = function (
  queryfieldValue,
  type,
  componentControlId,
  routeContext
) {
  let returnValue = ''

  switch (strUtil.trim(type + '')) {
    case '1':
      if (queryfieldValue.indexOf('.') == -1) {
        log.warn(queryfieldValue + ' 格式必须为表名.字段名')
        break
      }
      var ds = queryfieldValue.split('.')[0]
      var fieldName = queryfieldValue.split('.')[1]
      var record = getCurrentRecord(ds)
      returnValue = record.get(fieldName)
      break
    case '2':
      var componentParam = sb.getService(
        'vjs.framework.extension.platform.services.param.manager.ComponentParam'
      )
      returnValue = componentParam.getVariant({ code: queryfieldValue })
      break
    case '3':
      var windowParam = sb.getService(
        'vjs.framework.extension.platform.services.param.manager.WindowParam'
      )
      returnValue = windowParam.getInput({ code: queryfieldValue })
      break
    case '4':
      // returnValue = queryfieldValue;
      // 固定值(0:假，1:真，2:空)
      switch ((queryfieldValue + '').toLowerCase()) {
        case '0':
          returnValue = false
          break
        case '1':
          returnValue = true
          break
        case '2':
          returnValue = null
          break
        default:
          returnValue = queryfieldValue
          break
      }
      break
    case '5':
      returnValue = queryfieldValue
      break
    case '6':
      var valueQueryControlID = componentControlId
      var value = queryfieldValue
      var widgetContext = sb.getService(
        'vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext'
      )
      var storeType = widgetContext.getStoreType(valueQueryControlID)
      var storeTypes = sb.getService(
        'vjs.framework.extension.platform.interface.enum.StoreTypes'
      )
      // 按照控件不同的属性类型，获取参数值
      if (storeTypes.SET == storeType) {
        // 集合类控件，组装表名.字段名进行取值
        var ds = getDsName(valueQueryControlID)
        var record = getCurrentRecord(ds)
        if (record) {
          var field = value.split('_')[1]
          returnValue = record.get(field)
        } else {
          log.error(
            '集合控件:' + valueQueryControlID + ' 无选中行，无法获取其参数值'
          )
        }
      } else if (storeTypes.SINGLE_RECORD_MULTI_VALUE == storeType) {
        // 单记录多值控件，按照控件属性名字取得关联的标识，再进行取值
        var ds = getDsName(valueQueryControlID)
        var record = getCurrentRecord(ds)
        //var propertyCode = value.split("_")[1];
        var propertyCode = ''
        // 目前认为使用-分隔，也可以使用_分隔
        if (value.indexOf('-') != -1) {
          propertyCode = value.split('-')[1]
        } else {
          propertyCode = value.split('_')[1]
        }
        var windowVmManager = sandbox.getService(
          'vjs.framework.extension.platform.services.vmmapping.manager.WindowVMMappingManager'
        )
        var fieldCode = windowVmManager.getFieldCodeByPropertyCode({
          widgetCode: valueQueryControlID,
          propertyCode: propertyCode
        })
        returnValue = record.get(fieldCode)
      } else if (storeTypes.SINGLE_RECORD == storeType) {
        // 单值控件，直接取值
        var ds = getDsName(valueQueryControlID)
        var windowVmManager = sandbox.getService(
          'vjs.framework.extension.platform.services.vmmapping.manager.WindowVMMappingManager'
        )
        var fieldCode = windowVmManager.getFieldCodesByWidgetCode({
          widgetCode: valueQueryControlID
        })[0]
        var record = getCurrentRecord(ds)
        returnValue = record.get(fieldCode)
        if (null == returnValue || undefined == returnValue) {
          returnValue = ''
        }
      }
      break
    case '8':
    case '9':
    default:
      var context = new ExpressionContext()
      context.setRouteContext(routeContext)
      if (!queryfieldValue) {
        // modify by xiedh 2016-04-26,预先校验，防止执行表达式报错
        if (null == queryfieldValue || undefined == queryfieldValue) {
          returnValue = null
        } else {
          returnValue = queryfieldValue
        } //end modify
      } else {
        returnValue = expressionEngine.execute({
          expression: queryfieldValue,
          context: context
        })
      }
      break
  }
  //todo
  if (queryfieldValue !== '""' && returnValue === '') {
    return null
  }
  // 统一输出为字符串
  //return (null == returnValue || undefined == returnValue ? "" : returnValue);
  return undefined == returnValue ? null : returnValue
}

const genCustomParams = function (params) {
  let rs = {},
    paramDefines = params.paramDefines,
    routeContext = params.routeContext
  if (paramDefines && paramDefines.length > 0) {
    for (let i = 0; i < paramDefines.length; i++) {
      let define = paramDefines[i]
      let key = define['queryfield']
      if (!key) {
        key = define['Queryfield']
      }
      let valueDefine = define['queryfieldValue']
      if (!valueDefine) {
        valueDefine = define['QueryfieldValue']
      }
      let type = define['type']
      let componentControlID = define['componentControlID']
      let value = getCustomParamValue(
        valueDefine,
        type,
        componentControlID,
        routeContext
      )
      rs[key] = value
    }
  }
  return rs
}

const ExtraConditionNode = function (routeContext) {
  this.type = 'WhereNode'
  this.processorType = 'extraCondition'
  this.conditionConfig = null
  this.fetchMode = 'table'
  this.routeContext = routeContext
  this.extraCondition = ''

  this.isNullValueReplace = false

  this.isContainTableName = false
  // 空值替换的条件，默认为1 = 0
  this.nullValueReplaceCondition = ' 1 = 0 '

  // 是否需要参数化
  this.parameterized = true

  this.toCondition = function () {
    if (strUtil.trim(this.extraCondition) == '') {
      return '(1 = 1)'
    }
    return '(' + this.extraCondition + ')'
  }

  // 扩展条件内部已经处理了是否非空，所有WhereRestrict解析不需要关注
  this.isNullValue = function () {
    return false
  }

  this.newInstance = function (
    _conditionCondition,
    _fetchMode,
    _parameterized,
    _isNullValueReplace,
    _nullValueReplaceCondition,
    _isContainTableName
  ) {
    this.conditionConfig = _conditionCondition
    if (_fetchMode && _fetchMode != '') {
      this.fetchMode = _fetchMode
    }

    // 值是否需要参数化
    if (undefined != _parameterized && null != _parameterized) {
      this.parameterized = _parameterized
    }

    // 值为null的条件是否需要变改
    if (undefined != _isNullValueReplace && null != _isNullValueReplace) {
      this.isNullValueReplace = _isNullValueReplace
      if (
        undefined != _nullValueReplaceCondition &&
        null != _nullValueReplaceCondition
      ) {
        this.nullValueReplaceCondition = _nullValueReplaceCondition
      }
    }
    this.isContainTableName = _isContainTableName
    this.parseCondSqlByRuleCfgs()
  }

  // 参数化区，是否需要参数化，由具体的实现类来做
  this.parameter = {}
  this.genFieldKeyByUUID = function (field, index) {
    //修改参数生成规则 kuangxw
    //return field + "_" + this.random_S8();
    return field + '_' + index + '_CONDITION_KEY_SUFFIX'
  }

  // 生成随机8位数
  this.random_S8 = function () {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return S4() + S4()
  }

  this.genParameter = function (field, value, index) {
    let fieldKey = this.genFieldKeyByUUID(field.replace(/\./g, '_'), index)
    this.parameter[fieldKey] = value
    return ':' + fieldKey
  }

  this.toParameter = function () {
    return this.parameter
  }

  // 连接符
  this.logic
  this.setLogic = function (logic) {
    this.logic = logic
    return this
  }

  /**
   * 解析查询条件配置，并拼装成查询的字符串
   * @param condCfgs: 查询条件配置，该配置在系统中为统一格式
   * @param queryMode: 查询方式，目前分为table(单表查询),custom(自定义查询)
   */
  this.parseCondSqlByRuleCfgs = function () {
    let a = this.conditionConfig
    let BLANK = ' '
    for (let i = 0; i < this.conditionConfig.length; i++) {
      let cond = this.conditionConfig[i]
      // 如果配置信息中不配置任何东西，则跳过
      let isSkip = true
      for (let attr in cond) {
        if (cond[attr] != undefined && cond[attr] != null && cond[attr] != '') {
          isSkip = false
          break
        }
      }

      if (isSkip) {
        continue
      }

      // 如果存在fieldQueryControlID属性，则认为值来源为控件当前的值
      let fieldQueryControlID = !cond['fieldQueryControlID']
        ? ''
        : cond['fieldQueryControlID']
      let valueQueryControlID = !cond['valueQueryControlID']
        ? ''
        : cond['valueQueryControlID']

      // 逻辑符
      let logicOperation = this.getLogicOperation(cond['logicOperation'])
      if (undefined == logicOperation || null == logicOperation || i == 0) {
        logicOperation = ''
      }
      // 左括号
      let lbracket = cond['leftBracket']
      if (undefined == lbracket || null == lbracket) {
        lbracket = ''
      }
      // 右括号
      let rbracket = cond['rightBracket']
      if (undefined == rbracket || null == rbracket) {
        rbracket = ''
      }

      // 运算符
      let operation = this.getOperation(cond['operation'])

      // 取运算符左侧
      let fieldObj = this.getCondLeft(
        cond['field'],
        cond['fieldType'],
        cond['columnType'],
        fieldQueryControlID,
        operation
      )
      let fieldValue = fieldObj.value
      let isFieldParam = fieldObj.isParam

      // 取运算符右侧
      if (!isNeedlessParameterized(operation)) {
        //判断是否需要参数，不需要参数，就没必要进入获取参数值
        let valueObj = this.getCondRight(
          cond['value'],
          cond['valueType'],
          cond['columnType'],
          cond['operation'],
          valueQueryControlID
        )
      } else {
        let valueObj = {
          value: 'null',
          isParam: false
        }
      }
      let value = valueObj.value
      let isValueParam = valueObj.isParam

      let condString = ''
      let condField, condValue

      // 运算符左侧是否进行参数化
      if (isFieldParam) {
        // 字段作为参数，使用随机数字作为字段参数名
        condField = this.genParameter('ParamField', fieldValue, i)
      } else {
        condField = fieldValue
      }

      // 运算符右侧是否进行参数化
      if (
        this.isNullValueReplace &&
        (undefined == value || null == value) &&
        !isNeedlessParameterized(operation)
      ) {
        // 右侧字段会影响条件是否生效，如果不生效，直接修改成1 = 0这种非真条件
        condString = this.nullValueReplaceCondition
      } else {
        // 正常参数
        if (
          this.parameterized &&
          !isNeedlessParameterized(operation) &&
          isValueParam
        ) {
          // 如果字段是参数化的，值的参数名前缀就使用固定值
          condValue = this.genParameter(
            isFieldParam ? 'ParamValue' : cond['field'],
            value,
            i
          )
        } else {
          condValue = value
        }
      }

      if (condString == '') {
        if (this.isInOperation(operation)) {
          condString =
            condField + BLANK + operation + BLANK + '(' + condValue + ')'
        } else {
          condString = condField + BLANK + operation + BLANK + condValue
        }
      }

      // TODO：如果当前操作符为like，则必须用括号把like整句包起来，否则字段如果是带有函数的话会解析报错
      if (strUtil.trim(operation) == 'like') {
        condString = '(' + condString + ')'
      }

      // 组装
      this.extraCondition +=
        logicOperation +
        BLANK +
        lbracket +
        BLANK +
        condString +
        BLANK +
        rbracket
    }
  }

  /**
   * 取逻辑运算符，暂时没任何特殊处理，留待以后有需要时扩展
   * @param logicOperation: 运算符
   */
  this.getLogicOperation = function (logicOperation) {
    if (!logicOperation) return ''
    return strUtil.trim(logicOperation)
  }

  /**
   * weicd add
   * 判断该操作是否为 in、 not in 操作
   * @param operation 操作符
   */
  this.isInOperation = function (operation) {
    return (
      strUtil.trim(operation + '') == 'in' ||
      strUtil.trim(operation + '') == 'not in'
    )
  }
  /**
   * 生成条件左侧数据
   * @param field:字段定义
   * @param fieldType:字段来源(0-是参数类型，1-是字段类型，9-表达式)
   * @param columnType:字段类型（某些字段类型需要有一个特殊的处理）
   * @param fieldQueryControlID:字段来源控件（一般为查询面板中才会存在，并且只能用于fieldType为0的情况）
   * @param operation:操作符（可能用于一些特殊的操作符，对左侧有对应的调整的情况）
   */
  this.getCondLeft = function (
    field,
    fieldType,
    columnType,
    fieldQueryControlID,
    operation
  ) {
    let returnField = ''
    let valueObj = {}
    if (this.isContainTableName) {
      returnField = field
    } else {
      returnField = field
      if (field.indexOf('.') != -1) {
        let _fieldItems = field.split('.')
        returnField = _fieldItems[_fieldItems.length - 1]
      }
    }

    // 按照字段类型，判断是否需要对字段进行特殊处理
    switch (strUtil.trim(columnType + '')) {
      case '4':
        // TODO:布尔值，目前认为null即为false，所以加上isnull判断
        if (!this.isInOperation(operation)) {
          returnField = 'ISNULL(' + returnField + ', 0)'
        }
        break
      default:
        break
    }

    valueObj.value = returnField
    return valueObj
  }

  /**
   * 获取操作符，用于定义时可能会出现的定义不对应而进行的转换
   * @param operation 操作符
   */
  this.getOperation = function (operation) {
    let specialOperationCfg = {
      'left like': 'like',
      'right like': 'like',
      '!=': '<>'
    }
    if (typeof specialOperationCfg[strUtil.trim(operation)] != 'undefined') {
      return specialOperationCfg[strUtil.trim(operation)]
    }
    return operation
  }

  /**
   * 获取指定的值（按照值来源、字段类型）
   * @param value: 值定义名称
   * @param valueType: 参数类源类型(参数值类型1表字段，2系统变量，3组件变量，4固定值，5自定义，6面板参数，7自定义参数, 8控件的值，9表达式)
   * @param columnType: 字段类型：(数据库中字段的类型)
   * @param operation: 操作符，有时需要按照操作符，附加value的值(例如like时，前后需要加上%%)
   * @param valueQueryControlID: 值来源控件（一般是查询面板类才会存在，并且valueType为0时才生效）
   */
  this.getCondRight = function (
    value,
    valueType,
    columnType,
    operation,
    valueQueryControlID
  ) {
    valueType = strUtil.trim(valueType + '')
    columnType = strUtil.trim(columnType + '')

    let valueObj = {}

    switch (valueType) {
      case '999':
        // （暂不生效）为字段，直接写入条件不需要取值
        valueObj.value = value
        valueObj.isParam = false
        break
      default:
        // 其他情况都需要取值，并进行参数化
        valueObj.value = this.getCondValue(
          value,
          valueType,
          columnType,
          operation,
          valueQueryControlID
        )
        valueObj.isParam = true
        break
    }

    return valueObj
  }

  /**
   * 按照类型在组件上获取对应的值
   * @param value: 值定义名称
   * @param valueType: 参数类源类型(参数值类型1表字段，2系统变量，3组件变量，4固定值，5自定义，6面板参数，7自定义参数, 8控件的值, 9表达式)
   * @param columnType: 字段类型：(数据库中字段的类型)
   * @param operation: 操作符，有时需要按照操作符，附加value的值(例如like时，前后需要加上%%)
   * @param valueQueryControlID: 值来源控件（一般是查询面板类才会存在，并且valueType为0时才生效）
   */
  this.getCondValue = function (
    value,
    valueType,
    columnType,
    operation,
    valueQueryControlID
  ) {
    let returnValue = ''

    switch (valueType) {
      case '1':
        // 表字段
        //returnValue = value;
        if (!value || value.indexOf('.') == -1) {
          log.error(
            '取值字段必须为[表名].[字段名]的格式，否则无法取值:' + value
          )
        }
        // TODO:可能存在id为大写的情况，暂时兼容为小写
        var dataSourceName = value.split('.')[0]
        var fieldName = value.split('.')[1]
        /*
                if (viewModel.getMetaModule().isCustomSqlDataSource(dataSourceName)) {
                    if (value.split(".")[1].toLowerCase() == "id") {
                        value = "id";
                    } else {
                        value = value.split(".")[1];
                    }
                } else {
                    if (value.split(".")[1].toLowerCase() == "id") {
                        value = dataSourceName + ".id";
                    }
                }*/

        //returnValue = viewModel.getDataModule().getSingleValueByDS(dataSourceName, value);
        returnValue = viewModel
          .getDataModule()
          .getSingleValueByDS(dataSourceName, fieldName)
        break
      case '2':
        // 系统变量
        returnValue = viewContext.getSystemVariableValue(value)
        break
      case '3':
        // 组件变量
        returnValue = viewContext.getVariableValue(value)
        break
      case '4':
        // 固定值
        switch ((value + '').toLowerCase()) {
          case 'true':
            returnValue = true
            break
          case 'false':
            returnValue = false
            break
          case 'null':
            returnValue = null
            break
          default:
            returnValue = value
            break
        }
        break
      case '5':
        // 自定义
        returnValue = value
        break
      case '6':
        // 面板参数
        try {
          var widgetType =
            viewContext.getWidgetTypeFromContext(valueQueryControlID)
          var storeType = viewContext.getWidgetStoreTypeFromContext(widgetType)

          // 按照控件不同的属性类型，获取参数值
          if (widgetAttribute.storeType.SET == storeType) {
            // 集合类控件，组装表名.字段名进行取值
            var record = viewModel
              .getDataModule()
              .getCurrentRow(valueQueryControlID)
            if (record) {
              var dataSourceName = viewModel
                .getMetaModule()
                .getDataSourceName(valueQueryControlID)
              var field = value.split('_')[1]
              //returnValue = records[0][dataSourceName + "." + field];
              returnValue = record.get(field)
            } else {
              log.error(
                '集合控件:' +
                  valueQueryControlID +
                  ' 无选中行，无法获取其参数值'
              )
            }
          } else if (
            widgetAttribute.storeType.SINGLE_RECORD_MULTI_VALUE == storeType
          ) {
            // 单记录多值控件，按照控件属性名字取得关联的标识，再进行取值
            var multiValue = viewModel
              .getDataModule()
              .getSingleRecordMultiValue(valueQueryControlID)
            var propertyCode = ''
            // 目前认为使用-分隔，也可以使用_分隔
            if (value.indexOf('-') != -1) {
              propertyCode = value.split('-')[1]
            } else {
              propertyCode = value.split('_')[1]
            }
            var defineFields = definerUtil.getWidgetVirtualFields(widgetType)
            var mappingInfo = viewModel
              .getMetaModule()
              .getMappingInfo(valueQueryControlID)
            var refField = vmUtil.getRefFieldFromMappingInfo(
              mappingInfo,
              defineFields[propertyCode]
            )
            returnValue = multiValue[refField]
          } else if (widgetAttribute.storeType.SINGLE_RECORD == storeType) {
            // 单值控件，直接取值
            returnValue = viewModel
              .getDataModule()
              .getSingleValue(valueQueryControlID)
            if (null == returnValue || undefined == returnValue) {
              returnValue = ''
            }
          }
        } catch (e) {
          log.error(
            '获取面板参数失败:' + valueQueryControlID + ' 错误:' + e.message
          )
          returnValue = ''
        }
        break
      case '7':
        // 自定义参数
        returnValue = ':' + value
        break
      case '8': // 控件值
      case '9':
        var context = new ExpressionContext()
        context.setRouteContext(this.routeContext)
        returnValue = expressionEngine.execute({
          expression: value,
          context: context
        })
        break
      default:
        // 默认按输入值
        returnValue = value
        break
    }

    // 目前操作符：like 需要特殊处理（分left like、right like、like），同时，由于like的特殊行，returnValue为null需改成空字符
    if (operation.indexOf('like') != -1) {
      returnValue = null == returnValue ? '' : returnValue
      if (operation.indexOf('left') != -1) {
        returnValue = '%' + returnValue + ''
      } else if (operation.indexOf('right') != -1) {
        returnValue = '' + returnValue + '%'
      } else {
        // 默认，左右都带%
        returnValue = '%' + returnValue + '%'
      }
    }

    //weicd add
    if (this.isInOperation(operation)) {
      //kuangxw modify 不创建数组兼容in为空值时直接去掉条件
      if (returnValue == '' || returnValue == null) {
        return returnValue
      }
      let tempArray:any = []
      if (arrayUtil.isArray(returnValue)) {
        tempArray = returnValue
      } else {
        let type = typeof returnValue
        if (type == 'string') {
          tempArray = returnValue.split(',')
        } else if (type == 'number' || type == 'boolean' || type == 'object') {
          tempArray.push(returnValue)
        } else if (type == 'undefined' || type == 'function') {
          log.error('in\not in 操作的值不正确，请检查！')
        }
      }
      let retArray = []
      for (let i = 0; i < tempArray.length; i++) {
        let temp = tempArray[i]
        //处理前台in的条件值存在空格时获取不到数据的问题，2018-07-28 liangzc
        //                    if ( typeof (temp) == "string") {
        //                        temp = strUtil.trim(temp);
        //                    }
        switch (columnType + '') {
          case '1':
            //1.文本-char
            break
          case '2':
            //2.长文本-text
            log.error('长文本字段不支持in\not in 操作！')
            break
          case '3':
            //3.浮点数-number
            temp = parseFloat(temp)
            break
          case '4':
            //4.布尔-boolean
            temp = new Boolean(temp).valueOf()
            break
          case '5':
            //5.日期-date
            break
          case '6':
            //长日期-longDate
            break
          case '7':
            //7.整数-integer
            temp = parseInt(temp)
            break
          case '8':
            //8.文件-file
            log.error('文件类型字段不支持in\not in 操作！')
            break
          case '9':
            //9.对象-object
            log.error('大字段类型不支持in\not in 操作！')
            break
          default:
            break
        }
        retArray.push(temp)
      }
      returnValue = retArray
    }

    // 检查条件值与字段类型是否匹配，否则可能引起查询出错
    switch (columnType + '') {
      case '3':
        // 如果是不需要参数化的操作符，则不需要进行格式验证
        if (null == returnValue && isNeedlessParameterized(operation)) {
          break
        }
        if (arrayUtil.isArray(returnValue)) {
          break
        }
        // 格式验证，将数字不合副格式的转成0
        if (
          null == returnValue ||
          undefined == returnValue ||
          isNaN(returnValue) ||
          returnValue === ''
        ) {
          returnValue = null //0;
        } else {
          returnValue = parseFloat(returnValue)
        }

        break
      default:
        break
    }
    //todo
    if (value !== '""' && returnValue === '') {
      return null
    }
    return returnValue
  }
}

export { ExtraConditionNode, genCustomParams }
