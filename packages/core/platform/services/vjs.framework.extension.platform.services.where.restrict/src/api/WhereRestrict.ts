import * as queryConditionUtil from '../util/queryConditionUtil'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'
import { RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'

/**
 * 继承、克隆使用工具，目前是直接使用jQuery中的继承
 */
let _ObjectUtils = {
  extend: function (target: any, source: any) {
    $.extend(true, target, source)
  },

  clone: function (source: any) {
    return $.extend(true, {}, source)
  }
}

/**
 * WhereRestrict条件组装
 */
function WhereRestrict() {
  this.type = 'WhereRestrict'

  this.__WR__
  this.fetchMode
  this.__orderBy__
  this.logic = ''

  this.LOGIC_AND
  this.LOGIC_OR
  this.extraParameters = {}
  this.routeContext = null

  this.nullValueReplaceNode = null
  this.isNullValueReplace = false

  /**
   * @param fetchMode()
   */
  this.newInstance = function (
    fetchMode: any,
    isNullValueReplace: any,
    routeContext: RouteContext
  ) {
    this.__WR__ = {}
    this.__WR__['children'] = []
    this.routeContext = routeContext
    // eqTrue & eqFalse must be alive
    this.registryNodeProcessor(EqTrueNode)
    this.registryNodeProcessor(EqFalseNode)

    // 条件连接模式设置
    this.fetchMode = fetchMode ? fetchMode : 'table'
    if (
      'mql' == this.fetchMode ||
      'table' == this.fetchMode ||
      'custom' == this.fetchMode
    ) {
      this.LOGIC_AND = 'and'
      this.LOGIC_OR = 'or'
    } else {
      throw new Error('未定义fetchMode模式，无法构建条件连接符')
    }

    // 设置空值策略
    let replaceFlag = this.isNullValueReplace
    if (null != isNullValueReplace && undefined != isNullValueReplace) {
      replaceFlag = isNullValueReplace
    }
    this.setIsNullValueReplace(replaceFlag)
    return this
  }

  /**
   * 设置当条件的值为空时，这个条件是否需要生成
   */
  this.setIsNullValueReplace = function (isReplace: any) {
    if (typeof isReplace != 'boolean') {
      throw new Error('设置策略只能为布尔值')
    }
    this.isNullValueReplace = isReplace
    if (this.isNullValueReplace) {
      this.nullValueReplaceNode = this.eqFalse()
    }
  }

  this.getChildren = function () {
    return this.__WR__['children']
  }

  this.addChild = function (anything: any) {
    this.__WR__['children'].push(anything)
    return anything
  }

  this.clean = function () {
    this.__WR__['children'] = []
  }

  this.clone = function () {
    return _ObjectUtils.clone(this)
  }

  /**
   * 基础条件连接方法，condition如果是列表或WhereRestrict对象，将使用括号将整个condition包含起来
   * @param condition 需连接的条件(WhereNode节点、WhereNode列表或者WhereRestrict对象)
   * @param logicOutSide condition为列表时，连接的外围连接符
   * @param logicInSide condition为列表时，连接的内部连接符
   * @param isBracketsBefore 是否将concat前部分条件使用括号包含
   */
  this.concat = function (
    condition: any,
    logicOutSide: any,
    logicInSide: any,
    isBracketsBefore: any
  ) {
    if (!logicOutSide || logicOutSide == '') {
      throw new Error('必须设置外部连接符')
    }

    isBracketsBefore =
      isBracketsBefore == undefined || isBracketsBefore == null
        ? true
        : isBracketsBefore
    if (isBracketsBefore) {
      // 将现有的条件组装成WhereRestrict，在组装新的条件串
      let cloneWR = this.clone()
      this.clean()
      if (cloneWR.getChildren().length > 0) {
        this.addChild(cloneWR)
      }
    }

    let _outSide = logicOutSide
    if (
      typeof condition['type'] != 'undefined' &&
      condition['type'] == 'WhereNode'
    ) {
      this.addChild(condition.setLogic(_outSide))
    } else if (
      typeof condition['type'] != 'undefined' &&
      condition['type'] == 'WhereRestrict'
    ) {
      condition.logic = _outSide
      this.addChild(condition)
    } else if (condition instanceof Array) {
      if (!logicInSide || logicInSide == '') {
        throw new Error('必须设置内部连接符')
      }
      let _inSide = logicInSide

      // 构建新条件
      let $WR = this.addChild(new WhereRestrict(this.fetchMode).newInstance())
      $WR.logic = _outSide
      for (let i = 0; i < condition.length; i++) {
        if (i == 0) {
          $WR.addChild(condition[i])
        } else {
          $WR.addChild(condition[i].setLogic(_inSide))
        }
      }
    } else {
      throw new Error('使用了错误的参数')
    }
  }

  /**
   * 直接连接条件，该方法不会将已存在的条件用括号包含起来
   * @param condition 需连接的条件(WhereNode节点或者WhereNode列表)
   * @param logicOutSide condition为列表时，连接的外围连接符
   * @param logicInSide condition为列表时，连接的内部连接符
   */
  this.link = function (condition: any, logicOutSide: any, logicInSide: any) {
    this.concat(condition, logicOutSide, logicInSide, false)
  }

  /**
   * and一个条件(或条件列表)
   * @param WhereNode节点、WhereNode列表或者WhereRestrict对象
   */
  this.and = function (condition: any, isBracketsBefore: any) {
    if (isBracketsBefore == undefined || isBracketsBefore == null) {
      if (condition instanceof Array || condition.type == 'WhereRestrict') {
        isBracketsBefore = true
      } else {
        isBracketsBefore = false
      }
    }
    this.concat(condition, this.LOGIC_AND, this.LOGIC_AND, isBracketsBefore)
  }

  /**
   * or一个条件(或条件列表)
   * @param WhereNode节点、WhereNode列表或者WhereRestrict对象
   */
  this.or = function (condition: any, isBracketsBefore: any) {
    if (isBracketsBefore == undefined || isBracketsBefore == null) {
      if (condition instanceof Array || condition.type == 'WhereRestrict') {
        isBracketsBefore = true
      } else {
        isBracketsBefore = false
      }
    }
    this.concat(condition, this.LOGIC_OR, this.LOGIC_OR, isBracketsBefore)
  }

  this.toWhere = function () {
    if (this.__WR__['children'].length <= 0) {
      return this.eqTrue().toCondition()
    }
    let whereStr = this._toWhere(this.__WR__['children'])
    /* 去掉多余的括号，开始以为后台不支持存在多余括号，所以增加此逻辑。后台增强了这块逻辑，这里先不启用
        var reg = /\'{1,}.*(\({1,}|\){1,}).*\'{1,}/g;
        if(!reg.exec(whereStr)){
            whereStr = _deleteRedundanceBrace(whereStr);
        }*/
    return whereStr
  }

  this._toWhere = function (children: any) {
    if (!children || children.length <= 0) {
      return ''
    }
    let condition = ''
    for (let i = 0; i < children.length; i++) {
      let child = children[i]
      let logic =
        i == 0 || !child.logic || child.logic == ''
          ? ''
          : ' ' + child.logic + ' '
      if (child.type == 'WhereNode') {
        if (this.isNullValueReplace && child.isNullValue()) {
          condition += logic + this.nullValueReplaceNode.toCondition()
        } else {
          condition += logic + child.toCondition()
        }
      } else if (
        child.type == 'WhereRestrict' &&
        child.__WR__['children'].length > 0
      ) {
        // 有下级的时候，才能对WhereRestrict节点进行构建
        condition += logic + '(' + this._toWhere(child.__WR__['children']) + ')'
      }
    }
    return condition
  }
  /**
   * 获取连续的括号
   * @param charArray
   * @param braceType
   * @param position
   */
  let _getSeqBrace = function (
    charArray: any,
    braceType: any,
    position: number
  ) {
    let count = 0
    let len = 0
    let seqBrace: { [code: string]: any } = {}
    for (let i = position; i < charArray.length; i++) {
      let c = charArray[i]
      len++
      if (c == ' ') {
        continue
      } else if (c == braceType) {
        count++
      } else {
        len--
        break
      }
    }
    seqBrace['count'] = count
    seqBrace['len'] = len
    seqBrace['position'] = position
    return seqBrace
  }

  /**
   * 获取多余括号的位置
   * @param inValid 记录多余括号的数组
   * @param charArray 需要查找的字符数组
   * @param len 需要查找的字符数组中子串的长度
   * @param position 需要查找的字符数组中子串的长度
   * @param count 需要查找的字符数组中子串中括号的数量
   * @param type 需要查找的字符数组中子串中括号的类型
   */
  let _getInvalid = function (
    inValid: any,
    charArray: any,
    len: number,
    position: number,
    count: number,
    type: string
  ) {
    for (let i = position; i < position + len; i++) {
      if (count == 0) {
        break
      }
      if (charArray[i] == type) {
        inValid[i] = true
        count--
      }
    }
  }

  /**
   *  删除冗余的括号
   * @param {Object} str
   */
  let _deleteRedundanceBrace = function (str) {
    let charArray = new Array()
    charArray = str.split('')
    let seqCount: any
    let leftStack = new Array()
    let inValid = new Array()
    for (let i = 0; i < charArray.length; i++) {
      seqCount = null
      let c = charArray[i]
      switch (c) {
        case ' ':
          continue
          break
        case '(':
          seqCount = _getSeqBrace(str, '(', i)
          i += seqCount['len'] - 1
          var braceObj: { [code: string]: any } = {}
          braceObj['count'] = seqCount['count']
          braceObj['position'] = seqCount['position']
          braceObj['len'] = seqCount['len']
          braceObj['type'] = '('
          leftStack.push(braceObj)
          break
        case ')':
          seqCount = _getSeqBrace(str, ')', i)
          i += seqCount['len'] - 1
          var left
          if (seqCount['count'] == 1) {
            left = leftStack.pop()
            if (left['count'] > 1) {
              left['count']--
              leftStack.push(left)
            }
          } else if (seqCount['count'] > 1) {
            left = leftStack.pop()
            if (left['count'] <= seqCount['count']) {
              while (left['count'] <= seqCount['count']) {
                if (left['count'] > 1) {
                  _getInvalid(
                    inValid,
                    charArray,
                    left['len'],
                    left['position'],
                    left['count'] - 1,
                    left['type']
                  )
                  _getInvalid(
                    inValid,
                    charArray,
                    seqCount['len'],
                    seqCount['position'],
                    left['count'] - 1,
                    ')'
                  )
                }
                seqCount['count'] -= left['count']
                left = leftStack.pop()
                if (!left) {
                  break
                }
              }
              if (left) {
                left['count'] = left['count'] - seqCount['count']
                leftStack.push(left)
              }
            } else {
              _getInvalid(
                inValid,
                charArray,
                seqCount['len'],
                left['position'],
                seqCount['count'] - 1,
                '('
              )
              _getInvalid(
                inValid,
                charArray,
                seqCount['len'],
                seqCount['position'],
                seqCount['count'] - 1,
                ')'
              )
              left['count'] = left['count'] - seqCount['count']
              leftStack.push(left)
            }
          }
          break
        default:
          break
      }
    }
    let dst = new Array()
    let k = 0
    for (let i = 0; i < charArray.length; i++) {
      if (!inValid[i]) {
        dst[k++] = charArray[i]
      }
    }
    return dst.join('')
  }

  this.toParameters = function () {
    // add extra parameters
    let params = {}
    for (let key in this.extraParameters) {
      params[key] = this.extraParameters[key]
    }

    if (this.__WR__['children'].length > 0) {
      this._toParameters(this.__WR__['children'], params)
    }

    return params
  }

  this._toParameters = function (children: any, params: any) {
    if (!children || children.length <= 0) {
      return
    }
    for (let i = 0; i < children.length; i++) {
      let child = children[i]
      if (child.type == 'WhereNode') {
        let nodeParams = child.parameter
        for (let key in nodeParams) {
          params[key] = nodeParams[key]
        }
      } else if (child.type == 'WhereRestrict') {
        this._toParameters(child.__WR__['children'], params)
      }
    }
  }

  this.addExtraParameters = function (params: any) {
    if (!params) {
      return
    }
    for (let key in params) {
      this.addExtraParameter(key, params[key])
    }
  }

  this.addExtraParameter = function (key: any, value: any) {
    this.extraParameters[key] = value
  }

  this.addOrderBy = function (orderByField: any) {
    this.__addOrderBy__(orderByField, 'ASC')
  }

  this.addOrderByDesc = function (orderByField: any) {
    this.__addOrderBy__(orderByField, 'DESC')
  }

  this.addWholeOrderBy = function (orderByFieldWithSequence: any) {
    this.__addOrderBy__(orderByFieldWithSequence, '')
  }

  this.__addOrderBy__ = function (orderByField: any, sequence: any) {
    if (this.__orderBy__ && this.__orderBy__ != '') {
      this.__orderBy__ += ', ' + orderByField + ' ' + sequence
    } else {
      this.__orderBy__ = orderByField + ' ' + sequence
    }
  }

  this.toOrderBy = function () {
    return this.__orderBy__
  }

  // 条件处理存放区，用于记录加载后的对条件处理的回调
  this.EVENT_AFTER_FIND = 'afterFind'
  this.eventProcessor = {}
  this.addEvent = function (_name: any, _event: any) {
    if (typeof this.eventProcessor[_name] == 'undefined') {
      this.eventProcessor[_name] = []
    }
    this.eventProcessor[_name].push(_event)
  }

  this.fireEvent = function (_name: any) {
    if (
      typeof this.eventProcessor[_name] != 'undefined' &&
      this.eventProcessor[_name].length > 0
    ) {
      // 构建参数
      let args = []
      if (arguments && arguments.length > 1) {
        for (let i = 1; i < arguments.length; i++) {
          args.push(arguments[i])
        }
      }
      for (let i = 0; i < this.eventProcessor[_name].length; i++) {
        let _event = this.eventProcessor[_name][i]
        _event.apply(_event, args)
      }
    }
  }

  // 注册WhereNode处理器类
  this.wnProcessor = {}
  this.registryNodeProcessor = function (
    processor: any,
    routeContext: RouteContext
  ) {
    let proc = new processor(routeContext)
    let procName = proc.processorType

    // 不允许重复注册
    if (typeof this.wnProcessor[procName] != 'undefined') {
      throw new Error('不允许解析器重复注册:' + procName)
    }

    let logicProcName =
      procName.substring(0, 1).toUpperCase() + procName.substring(1)
    this.wnProcessor[procName] = processor
    // 注册解析器
    this[procName] = function () {
      let nodeProc = new processor(routeContext)
      nodeProc.newInstance.apply(nodeProc, arguments)
      return nodeProc
    }
    // 注册And的解析器
    this['and' + logicProcName] = function () {
      this.and(this[procName].apply(this[procName], arguments))
    }

    // 注册Or的解析器
    this['or' + logicProcName] = function () {
      this.or(this[procName].apply(this[procName], arguments))
    }
  }
}

/**
 * 基础WhereNode对象
 */
function BaseWhereNode() {
  this.type = 'WhereNode'
  this.toCondition = function () {
    throw new Error('未实例的节点类型')
  }

  this.newInstance = function () {
    throw new Error('未实现的节点实例方法')
  }

  // 参数化区，是否需要参数化，由具体的实现类来做
  this.parameter = {}
  this.genFieldKeyByUUID = function (field: any) {
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return field + '_' + (S4() + S4())
  }

  this.genParameter = function (field: any, value: any) {
    let fieldKey = this.genFieldKeyByUUID(field.replace(/\./g, '_'))
    this.parameter[fieldKey] = value
    return ':' + fieldKey
  }

  this.toParameter = function () {
    return this.parameter
  }

  // 连接符
  this.logic
  this.setLogic = function (logic: any) {
    this.logic = logic
    return this
  }

  // 值是否为空判断
  this.isNullValue = function () {
    return false
  }
}

/**
 * 一元操作符基准节点定义
 */
function DefaultWhereNode() {
  _ObjectUtils.extend(this, new BaseWhereNode())
  this.field
  this.fieldKey
  this.value
  this.newInstance = function (field: any, value: any) {
    // 2015-09-08 兼容处理[构件名].[表名].[字段]的情况，只取[字段]
    let _fieldItems = field.split('.')
    this.field = _fieldItems[_fieldItems.length - 1]
    this.value = value
    this.fieldKey = this.genParameter(this.field, this.value)
  }

  this.isNullValue = function () {
    return this.value == undefined || this.value == null
  }
}

/**
 * EqTrue节点(1 = 1)
 */
function EqTrueNode() {
  _ObjectUtils.extend(this, new BaseWhereNode())
  this.processorType = 'eqTrue'
  this.newInstance = function (field: any, value: any) {
    this.value = '1 = 1'
  }

  this.toCondition = function () {
    return this.value
  }
}

/**
 * EqFalse节点(1 = 0);
 */
function EqFalseNode() {
  _ObjectUtils.extend(this, new BaseWhereNode())
  this.processorType = 'eqFalse'
  this.newInstance = function (field, value) {
    this.value = '1 = 0'
  }

  this.toCondition = function () {
    return this.value
  }
}

/**
 * EQ节点(=)
 */
function EqNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'eq'
  this.toCondition = function () {
    return this.field + ' = ' + this.fieldKey
  }
}

/**
 * GT节点(>)
 */
function GtNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'gt'
  this.toCondition = function () {
    return this.field + ' > ' + this.fieldKey
  }
}

/**
 * LT节点(<)
 */
function LtNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'lt'
  this.toCondition = function () {
    return this.field + ' < ' + this.fieldKey
  }
}

/**
 * GE节点(>=)
 */
function GeNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'ge'
  this.toCondition = function () {
    return this.field + ' >= ' + this.fieldKey
  }
}

/**
 * LE节点(<=)
 */
function LeNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'le'
  this.toCondition = function () {
    return this.field + ' <= ' + this.fieldKey
  }
}

/**
 * NE节点(<>)
 */
function NeNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'ne'
  this.toCondition = function () {
    return this.field + ' <> ' + this.fieldKey
  }
}

/**
 * LIKE节点(like %value%)
 */
function LikeNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'like'
  this.newInstance = function (field: any, value: any) {
    this.field = field
    this.value = '%' + value + '%'
    this.fieldKey = this.genParameter(this.field, this.value)
  }

  this.toCondition = function () {
    return this.field + ' like ' + this.fieldKey
  }
}

/**
 * LeftLike节点(like %value)
 */
function LeftLikeNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'leftLike'
  this.newInstance = function (field: any, value: any) {
    this.field = field
    this.value = '%' + value
    this.fieldKey = this.genParameter(this.field, this.value)
  }

  this.toCondition = function () {
    return this.field + ' like ' + this.fieldKey
  }
}

/**
 * RightLike节点(like value%)
 */
function RightLikeNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'rightLike'
  this.newInstance = function (field: any, value: any) {
    this.field = field
    this.value = value + '%'
    this.fieldKey = this.genParameter(this.field, this.value)
  }

  this.toCondition = function () {
    return this.field + ' like ' + this.fieldKey
  }
}

/**
 * 扩展的Like节点，值前后需要用什么字符由使用者决定(like 前缀字符 +值+后缀字符)
 */
function BaseLikeNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'baseLike'
  this.newInstance = function (
    field: any,
    prefix: any,
    value: any,
    suffix: any
  ) {
    this.field = field
    this.value = (!prefix ? '' : prefix) + value + (!suffix ? '' : suffix)
    this.fieldKey = this.genParameter(this.field, this.value)
  }

  this.toCondition = function () {
    return this.field + ' like ' + this.fieldKey
  }
}

/**
 * InValues节点(in (列表数值))
 * 注意值参数必须是Array
 */
function InValuesNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'inValues'
  this.newInstance = function (field: any, value: any) {
    this.field = field
    this.value = value
    this.fieldKey = this.genParameter(this.field, this.value)
  }

  this.toCondition = function () {
    return this.field + ' in (' + this.fieldKey + ')'
  }
}

/**
 * NotInValues节点(not in (列表数值))
 * 注意值参数必须是Array
 */
function NotInValuesNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'notInValues'
  this.newInstance = function (field, value) {
    this.field = field
    this.value = value
    this.fieldKey = this.genParameter(this.field, this.value)
  }

  this.toCondition = function () {
    return this.field + ' not in (' + this.fieldKey + ')'
  }
}

/**
 * FormulaString节点(真实sql表达式串)
 * 使用该节点时，必须使用者自己确认sql的准确性
 */
function ConditionStringNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'conditionString'
  this.formulaString = ''
  this.newInstance = function (formulaString) {
    this.formulaString = formulaString
  }

  this.isNullValue = function () {
    return this.formulaString == undefined || this.formulaString == null
  }

  this.toCondition = function () {
    return this.formulaString
  }
}

/**
 * isnull节点(字段 is null)
 */
function IsNullNode() {
  _ObjectUtils.extend(this, new DefaultWhereNode())
  this.processorType = 'isNull'
  this.toCondition = function () {
    return this.field + ' is null or ' + this.field + " = ''"
  }
}

// ----------------------------------------------------------------
/**
 * WhereRestrict实例工厂类
 */
let WhereRestrictFactory = {
  newInstance: function (fetchMode, routeContext) {
    var w = new WhereRestrict().newInstance(fetchMode, false, routeContext)
    // 注册节点解析器
    w.registryNodeProcessor(EqNode, routeContext)
    w.registryNodeProcessor(GtNode, routeContext)
    w.registryNodeProcessor(LtNode, routeContext)
    w.registryNodeProcessor(InValuesNode, routeContext)
    w.registryNodeProcessor(NotInValuesNode, routeContext)
    w.registryNodeProcessor(GeNode, routeContext)
    w.registryNodeProcessor(LeNode, routeContext)
    w.registryNodeProcessor(NeNode, routeContext)
    w.registryNodeProcessor(LikeNode, routeContext)
    w.registryNodeProcessor(LeftLikeNode, routeContext)
    w.registryNodeProcessor(RightLikeNode, routeContext)
    w.registryNodeProcessor(BaseLikeNode, routeContext)
    w.registryNodeProcessor(ConditionStringNode, routeContext)
    w.registryNodeProcessor(IsNullNode, routeContext)

    // 特殊节点解析器
    var extraConditionNode = queryConditionUtil.ExtraConditionNode
    w.registryNodeProcessor(extraConditionNode, routeContext)
    return w
  }
}

/**
 * 基础实例化
 * @param fetchMode 实例模式(已经作废)
 * @return WhereRestrict对象
 */
let init = function (fetchMode?: string) {
  let params =
    typeof fetchMode == 'object' ? fetchMode : { fetchMode: fetchMode }
  let mode = params.fetchMode,
    routeContext = params.routeContext
  return WhereRestrictFactory.newInstance(mode, routeContext)
}
export { init }
