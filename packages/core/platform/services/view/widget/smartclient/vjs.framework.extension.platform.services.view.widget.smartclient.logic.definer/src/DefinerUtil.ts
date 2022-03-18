let __storagePool__ = {}

let _registryFactory = function (type: string) {
  if (typeof __storagePool__[type] != 'undefined') {
    throw new Error('定义储存器:' + type + ' 已存在，不能重复注册')
  }
  let factory = (__storagePool__[type] = {})
  let definerPool = (__storagePool__[type]['definerPool'] = {})
  __storagePool__[type]['registryDefiner'] = function (name, definer) {
    definerPool[name] = definer
  }

  __storagePool__[type]['getDefiner'] = function (name) {
    if (typeof definerPool[name] == 'undefined') {
      // throw new Error("定义对象:" + name + " 未注册");
      return null
    }
    return definerPool[name]
  }
}

let _getFactory = function (type: string) {
  if (typeof __storagePool__[type] == 'undefined') {
    throw new Error('定义储存器:' + type + '未注册')
  }
  return __storagePool__[type]
}

/**
 * 注册默认定义器
 *
 * @param type
 *            储存器名称
 * @param name
 *            定义名
 * @param definer
 *            定义对象
 */
let registryDefiner = function (type: string, name: string, definer: any) {
  if (typeof __storagePool__[type] == 'undefined') {
    _registryFactory(type)
  }
  let factory = _getFactory(type)
  factory.registryDefiner(name, definer)
}

/**
 * 获取默认定义器
 *
 * @param type
 *            储存器名称
 * @param name
 *            定义名
 */
let getDefiner = function (type: string, name: string) {
  let factory = _getFactory(type)
  return factory.getDefiner(name)
}

// ========== 下面为与定义，以后可往外扩展 =========
let DEFINE_COLUMN_EDITOR = 'columnEditor'
let registryColumnEditor = function (name: string, definer: any) {
  registryDefiner(DEFINE_COLUMN_EDITOR, name, definer)
}

// 列表控件列editor属性
let getColumnEditor = function (name: string) {
  return getDefiner(DEFINE_COLUMN_EDITOR, name)
}

// 列表控件列默认宽度
let DEFINE_COLUMN_WIDTH = 'columnWidth'
registryDefiner(DEFINE_COLUMN_WIDTH, 'width', 80)
let getColumnWidth = function (name: string) {
  return getDefiner(DEFINE_COLUMN_WIDTH, 'width')
}

// 注册表格列默认类型定义：char|boolean|integer|number|text
registryColumnEditor('char', {
  type: 'text'
})
registryColumnEditor('boolean', {
  type: 'checkbox',
  options: {
    on: true,
    off: false
  }
})
registryColumnEditor('integer', {
  type: 'numberbox',
  options: {
    precision: 0
  }
})
registryColumnEditor('number', {
  type: 'numberbox',
  options: {
    precision: 2
  }
})
registryColumnEditor('text', {
  type: 'text'
})

/**
 * 控件进行虚拟化DB时，可能需要的字段列表定义
 */
let WIDGET_VIRTUAL_FIELDS = 'WidgetVirtualFields'
let getWidgetVirtualFields = function (name: string) {
  return getDefiner(WIDGET_VIRTUAL_FIELDS, name)
}
registryDefiner(WIDGET_VIRTUAL_FIELDS, 'JGComboBox', {
  IDColumnName: 'valueField',
  ColumnName: 'textField'
})
registryDefiner(WIDGET_VIRTUAL_FIELDS, 'JGBaseDictBox', {
  IDColumnName: 'valueField',
  ColumnName: 'textField'
})
registryDefiner(WIDGET_VIRTUAL_FIELDS, 'JGGroupBox', {
  IDColumnName: 'valueField',
  ColumnName: 'textField'
})
registryDefiner(WIDGET_VIRTUAL_FIELDS, 'JGRadioGroup', {
  IDColumnName: 'valueField',
  ColumnName: 'textField'
})
registryDefiner(WIDGET_VIRTUAL_FIELDS, 'JGCheckBoxGroup', {
  IDColumnName: 'valueField',
  ColumnName: 'textField'
})
registryDefiner(WIDGET_VIRTUAL_FIELDS, 'JGDateTimeSpan', {
  BeginColumnName: 'beginColumnName',
  EndColumnName: 'endColumnName'
})
registryDefiner(WIDGET_VIRTUAL_FIELDS, 'JGAuditSignature', {
  AuditStatusColumnName: 'auditStatusColumnName',
  LastAuditManIDColumnName: 'lastAuditManIDColumnName',
  LastAuditManNameColumnName: 'lastAuditManNameColumnName',
  LastAuditTimeColumnName: 'lastAuditTimeColumnName'
})

/**
 * metadata中数字type对应的真实type名称
 */
let METADATA_FIELD_TYPE = 'MetadataFieldType'
let getMetadataFieldType = function (name: string) {
  return getDefiner(METADATA_FIELD_TYPE, name)
}
registryDefiner(METADATA_FIELD_TYPE, '1', 'char')
registryDefiner(METADATA_FIELD_TYPE, '2', 'text')
registryDefiner(METADATA_FIELD_TYPE, '3', 'number')
registryDefiner(METADATA_FIELD_TYPE, '4', 'boolean')
registryDefiner(METADATA_FIELD_TYPE, '5', 'date')
registryDefiner(METADATA_FIELD_TYPE, '6', 'char')
registryDefiner(METADATA_FIELD_TYPE, '7', 'integer')
registryDefiner(METADATA_FIELD_TYPE, '8', 'file')
registryDefiner(METADATA_FIELD_TYPE, '9', 'object')

export {
  registryDefiner,
  getDefiner,
  registryColumnEditor,
  getColumnEditor,
  getColumnWidth,
  getWidgetVirtualFields,
  getMetadataFieldType
}
