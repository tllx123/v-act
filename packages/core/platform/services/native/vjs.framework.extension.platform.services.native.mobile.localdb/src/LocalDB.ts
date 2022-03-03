import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util'
import { RPC as operation } from '@v-act/vjs.framework.extension.system'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
let sandBox
let updatedTables = []

exports.initModule = function (sBox) {
  sandBox = sBox
}

const query = function (params) {
  let queryParam = params.queryParams,
    isAsync = params.isAsync,
    callback = params.success,
    isLocalDb = params.isLocalDb
  let selectDatas = []
  if (arrayUtil.isArray(queryParam) && queryParam.length > 0) {
    for (let i = 0; i < queryParam.length; i++) {
      let paramObj = queryParam[i]
      let whereRestrict = paramObj.whereRestrict
      //将查询参数值为undefined的改为null值
      let tmp_paramter = whereRestrict.toParameters()
      tmp_paramter = changeUndefinedToNull(tmp_paramter)
      let selectDataObj = {
        CheckUnique: paramObj.CheckUnique ? true : false,
        DataSourceName: paramObj.dataSourceName,
        QueryParams: tmp_paramter,
        QueryCondition: whereRestrict.toWhere(),
        QueryOrderBy: whereRestrict.toOrderBy(),
        QueryFields: paramObj.queryFields,
        QueryRecordStart: paramObj.queryRecordStart,
        QueryPageSize: paramObj.queryPageSize,
        QueryType: paramObj.queryType
      }
      selectDatas.push(selectDataObj)
    }
  }

  let callBackFunc = function (resultDataString) {
    if (resultDataString.success == true) {
      let outputResult = resultDataString.data.result
      let outputJson = outputResult.OutputJson
      let rsDataValueStr = outputJson.value
      let resultData = jsonUtil.json2obj(rsDataValueStr)
      if (typeof callback == 'function') {
        callback(resultData)
      }
    } else {
      let e = exceptionFactory.create({
        message: resultDataString.msg,
        type: resultDataString.exceptionType
      })
      throw e
    }
  }
  let scope = scopeManager.getScope()
  //根据路由上下文传递事务id
  let routeContext = params.routeContext
  let transactonId = null
  //异步请求时去除事务id，防止并发发起事务请求
  if (!isAsync && routeContext && routeContext.duringTransaction()) {
    transactonId = routeContext.getTransactionId()
  }

  let result = []
  let selectLength = selectDatas.length
  let componentCode = scope.getComponentCode()

  for (let selectDataIndex in selectDatas) {
    let selectData = selectDatas[selectDataIndex]
    let tableName = selectData.DataSourceName
    let sql = 'select * from ' + componentCode + '__' + tableName
    if (selectData.QueryCondition) {
      sql = sql + ' where ' + selectData.QueryCondition
    }
    if (selectData.QueryParams) {
      for (let key in selectData.QueryParams) {
        let value = selectData.QueryParams[key]
        if (typeof value == 'number') {
          sql = sql.replace(':' + key, ' ' + value + ' ')
        } else if (typeof value == 'string') {
          sql = sql.replace(':' + key, "'" + value + "'")
        } else if (typeof value == 'boolean') {
          sql = sql.replace(':' + key, "'" + wrapBoolean(value) + "'")
        } else if (typeof value == 'object') {
          if (value instanceof Array) {
            let tmpValueStr = ''
            for (let valueIndex = 0; valueIndex < value.length; valueIndex++) {
              if (typeof value[valueIndex] == 'number') {
                tmpValueStr = tmpValueStr + value[valueIndex] + ','
              } else if (typeof value[valueIndex] == 'string') {
                tmpValueStr = tmpValueStr + "'" + value[valueIndex] + "'" + ','
              }
            }
            if (tmpValueStr.substring(tmpValueStr.length - 1) == ',') {
              tmpValueStr = tmpValueStr.substring(0, tmpValueStr.length - 1)
            }
            sql = sql.replace(':' + key, tmpValueStr)
          }
        }
      }
    }
    if (selectData.QueryOrderBy) {
      sql = sql + ' order by ' + selectData.QueryOrderBy
    }

    if (window.sqlitePlugin) {
      let currentScopeId = scopeManager.getWindowScope().getInstanceId()
      executeSql(componentCode + '__' + tableName, sql, function (results) {
        let resultObject = {
          dataSource: tableName
        }
        let datas = {
          recordCount: results.rows.length
        }

        let rowDatas = []
        let len = results.rows.length
        for (let i = 0; i < len; i++) {
          let o = results.rows.item(i)
          for (let key in o) {
            let value = o[key]
            if (checkBoolean(value)) {
              o[key] = restoreBoolean(value)
            }
          }
          rowDatas.push(o)
        }
        datas.values = rowDatas
        resultObject.datas = datas

        let model = []
        if (len > 0) {
          let o = results.rows.item(0)
          for (let key in o) {
            let value = o[key]

            if (checkBoolean(value)) {
              value = restoreBoolean(value)
            }

            let dataType = typeof value
            let modelObject = {
              //截止目前（2019-12-26），这个对象保存的是服务端数据库的字段定义信息，但后面实际发挥作用的只有一个code字段，所以其他字段目前都只是填充值。
              code: key,
              name: key,
              precision: '0'
            }
            if (dataType == 'string') {
              modelObject.type = 'text'
              modelObject.length = '10000'
            } else if (dataType == 'number') {
              modelObject.type = 'number'
              modelObject.length = '50'
            } else if (dataType == 'boolean') {
              modelObject.type = 'boolean'
              modelObject.length = '50'
            }
            model.push(modelObject)
          }
        }
        resultObject.metadata = {
          model: [
            {
              object: tableName,
              fields: model
            }
          ]
        }
        result.push(resultObject)
        if (result.length == selectLength) {
          scopeManager.createScopeHandler({
            scopeId: currentScopeId,
            handler: callback
          })(result)
        }
      })
    } else {
      alert('本地数据库功能仅支持App端。')
    }
  }
}

const save = function (params) {
  let dataSchemas = params.dataSchemas,
    treeStructs = params.treeStructs,
    success = params.success,
    transactionId = params.transactionId
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode()
  let currentScopeId = scopeManager.getWindowScope().getInstanceId()
  success = scopeManager.createScopeHandler({
    scopeId: currentScopeId,
    handler: success
  })

  let dataSchemaArray = []
  for (let dataSchemaKey in dataSchemas) {
    dataSchemaArray.push(dataSchemas[dataSchemaKey])
  }

  let dataSchemaIndex = 0
  let saveSchema = function () {
    if (dataSchemaIndex < dataSchemaArray.length) {
      let dataSchema = dataSchemaArray[dataSchemaIndex]
      dataSchemaIndex++
      let tableName = componentCode + '__' + dataSchema.dataSource
      let recordCount = dataSchema.datas.values.length

      if (recordCount > 0) {
        let recordIndex = 0
        let executeSave = function () {
          if (recordIndex < recordCount) {
            let data = dataSchema.datas.values[recordIndex]
            recordIndex++
            let operateType = data.__ds_state__
            if (operateType === 'insert') {
              let insertSql = createInsertSql(tableName, data)
              executeSql(tableName, insertSql, function (results) {
                //									alert("insert结果： " + JSON.stringify(results));
                executeSave()
              })
            } else if (operateType === 'update') {
              let updateSql = createUpdateSql(tableName, data)
              executeSql(tableName, updateSql, function (results) {
                //									alert("update结果： " + JSON.stringify(results));
                executeSave()
              })
            } else if (operateType === 'delete') {
              let deleteSql = createDeleteSql(tableName, data)
              executeSql(tableName, deleteSql, function (results) {
                //									alert("delete结果： " + JSON.stringify(results));
                executeSave()
              })
            } else if (operateType === 'insertorupdate') {
              let selectSql =
                'select * from ' + tableName + ' where id="' + data.id + '"'
              executeSql(tableName, selectSql, function (sResults) {
                let len = sResults.rows.length
                if (len == 0) {
                  let insertSql = createInsertSql(tableName, data)
                  executeSql(tableName, insertSql, function (results) {
                    executeSave()
                    //											alert("insert结果： " + JSON.stringify(results));
                  })
                } else {
                  let updateSql = createUpdateSql(tableName, data)
                  executeSql(tableName, updateSql, function (results) {
                    executeSave()
                    //											alert("update结果： " + JSON.stringify(results));
                  })
                }
              })
            }
          } else {
            saveSchema()
          }
        }
        executeSave()
      } else {
        saveSchema()
      }
    } else {
      success({
        success: true
      })
    }
  }
  saveSchema()

  for (let dataSchemaKey in dataSchemas) {
    let tableName = componentCode + '__' + dataSchemas[dataSchemaKey].dataSource
    let recordCount = dataSchemas[dataSchemaKey].datas.values.length
  }
}

/**
 * 将参数值为undefined的改为null值
 * */
let changeUndefinedToNull = function (params) {
  if (undefined == params) return
  for (let _key in params) {
    if (undefined === params[_key]) {
      params[_key] = null
    }
  }
  return params
}

function createUpdateSql(tableName, datas) {
  let updateSql = ''
  let whereClause = ' where id = "' + datas.id + '"'
  for (let key in datas) {
    if (key != '__ds_state__' && key != 'id') {
      let value = datas[key]
      if (typeof value == 'string') {
        updateSql = updateSql + key + '=' + '"' + value + '"' + ','
      } else if (typeof value == 'boolean') {
        updateSql = updateSql + key + '=' + '"' + wrapBoolean(value) + '"' + ','
      } else {
        updateSql = updateSql + key + '=' + datas[key] + ','
      }
    }
  }
  if (updateSql.endsWith(',')) {
    updateSql = updateSql.substring(0, updateSql.length - 1)
  }

  return 'update ' + tableName + ' set ' + updateSql + whereClause
}

function createInsertSql(tableName, datas) {
  let insertSql = 'insert into ' + tableName + '('
  let insertValueClause = ''
  for (let key in datas) {
    if (key != '__ds_state__') {
      insertSql = insertSql + key + ','
      let value = datas[key]
      if (typeof value == 'string') {
        insertValueClause = insertValueClause + '"' + value + '"' + ','
      } else if (typeof value == 'boolean') {
        insertValueClause =
          insertValueClause + '"' + wrapBoolean(value) + '"' + ','
      } else {
        insertValueClause = insertValueClause + value + ','
      }
    }
  }
  if (insertSql.endsWith(',')) {
    insertSql = insertSql.substring(0, insertSql.length - 1)
    insertValueClause = insertValueClause.substring(
      0,
      insertValueClause.length - 1
    )
  }

  return insertSql + ')values(' + insertValueClause + ')'
}

/**
 * columns:[{
 * 	name:columnName,
 * 	type:columnType
 * }]
 */
function createCreateSql(tableName, columns) {
  let columnClause = ''
  for (let index in columns) {
    let column = columns[index]
    columnClause = columnClause + column.name + ' '
    if (column.type == 1 || column.type == 2) {
      //TODO TEXT
      columnClause += 'TEXT ,'
    } else if (column.type == 3) {
      //TODO REAL
      columnClause += 'REAL ,'
    } else if (column.type == 4) {
      //布尔，Sqlite不支持boolean，布尔型数据会被封装成字符串来保存。
      columnClause += 'TEXT ,'
    } else if (column.type == 5) {
      //日期
      columnClause += 'TEXT ,'
    } else if (column.type == 6) {
      // 日期时间
      columnClause += 'TEXT ,'
    } else if (column.type == 7) {
      //TODO Integer
      columnClause += 'INTEGER ,'
    }
  }
  if (columnClause.endsWith(',')) {
    columnClause = columnClause.substring(0, columnClause.length - 1)
  }

  return 'create table if not exists ' + tableName + '(' + columnClause + ')'
}

function createDeleteSql(tableName, datas) {
  return (deleteSql =
    'delete from ' + tableName + ' where id = "' + datas.id + '"')
}

function createAlterAddSql(tableName, column) {
  return 'alter table ' + tableName + ' add ' + column
}

function createAlterRenameSql(tableName, columnOld, columnNew) {
  return (
    'alter table ' +
    tableName +
    ' rename column ' +
    columnOld +
    ' to ' +
    columnNew
  )
}

function createRenameTableSql(oldTableName, newTableName) {
  return 'alter table ' + oldTableName + ' rename to ' + newTableName
}

function createAlterDropSql(tableName, columns) {}

function executeSql(tableName, sql, successCB) {
  if (tableName != null) {
    let isUpdated = false
    for (let index in updatedTables) {
      if (tableName == updatedTables[index]) {
        isUpdated = true
        break
      }
    }

    if (!isUpdated) {
      if (tableName == 'system_tableinfo') {
        executeSql(
          null,
          'create table if not exists system_tableinfo(id,name)',
          function () {
            updatedTables.push('system_tableinfo')
            executeSql(null, sql, successCB)
          }
        )
        return
      }

      if (tableName == 'system_tablecolumn') {
        executeSql(
          null,
          'create table if not exists system_tablecolumn(id,name,type,tableId)',
          function () {
            updatedTables.push('system_tablecolumn')
            executeSql(null, sql, successCB)
          }
        )
        return
      }

      setTimeout(function () {
        syncTable(tableName, function () {
          updatedTables.push(tableName)
          executeSql(null, sql, successCB)
        })
      })
    } else {
      executeSql(null, sql, successCB)
    }
  } else {
    if (!window.sqliteDB) {
      window.sqliteDB = window.sqlitePlugin.openDatabase({
        name: 'mydb',
        location: 'default'
      })
    }
    window.sqliteDB.transaction(function (tx) {
      if (window.sqliteDB.debug) console.log('查询字符串：' + sql)
      tx.executeSql(
        sql,
        [],
        function (tx, results) {
          successCB(results)
          //							setTimeout(function(){
          //
          //							});
        },
        function (tx, error) {
          if (tableName == null) return
          if (
            (error.code == 5 &&
              error.message.indexOf('no such column') != -1) ||
            (error.code == 5 && error.message.indexOf('no such table') != -1)
          ) {
            //TODO
          }
        }
      )
    })
  }
}

function addTableColumn(config, successCB, errorCB) {
  let tableName = config.tableName
  let columns = config.columns
  let index = 0
  let cb
  cb = function () {
    if (index < columns.length) {
      let column = columns[index]
      index++
      let sql = createAlterAddSql(tableName, column.name)
      executeSql(null, sql, function () {
        let insertSql =
          "insert into system_tablecolumn(id , name , tableId , type ) values('" +
          column.id +
          "','" +
          column.name +
          "','" +
          config.tableId +
          "'," +
          column.type +
          ')'
        executeSql('system_tablecolumn', insertSql, cb)
      })
    } else {
      successCB()
    }
  }
  cb()
}

function renameTableColumn(config, successCB, errorCB) {
  let tableName = config.tableName
  let columns = config.columns
  let tableId = config.tableId

  let cb
  cb = function () {
    let column = columns.pop()
    if (column) {
      let sql = createAlterRenameSql(
        tableName,
        column.oldColumn,
        column.newColumn
      )
      executeSql(null, sql, function () {
        let updateSql =
          "update system_tablecolumn set name = '" +
          column.newColumn +
          "' where id= '" +
          column.id +
          "'"
        executeSql('system_tablecolumn', updateSql, successCB)
      })
    } else {
      successCB()
    }
  }
  cb()
}

function deleteTableColumn(config, successCB, errorCB) {
  //1. 获取现有字段
  //2. 根据删除字段获取要保留的字段
  //3. 重命名现有表
  //4. 根据保留的字段创建一个新表
  //5. 将旧表数据复制到信标数据中。
  //6. 删除system_tablecolumn中对应字段。
  let tableName = config.tableName
  let columns = config.columns
  let tableId = config.tableId
  executeSql(
    'system_tablecolumn',
    "select * from system_tablecolumn where tableId = '" + tableId + "'",
    function (tableColumnResults) {
      if (tableColumnResults.rows.length > 0) {
        let reservedColumns = []
        for (let i = 0; i < tableColumnResults.rows.length; i++) {
          let column = tableColumnResults.rows.item(i)
          let contained = false
          for (let j = 0; j < columns.length; j++) {
            if (column.name == columns[j].name) {
              contained = true
              break
            }
          }
          if (!contained) {
            reservedColumns.push(column)
          }
        }
        let bikTableName = tableName + '_bik'
        executeSql(
          null,
          createRenameTableSql(tableName, bikTableName),
          function (result1) {
            executeSql(
              null,
              createCreateSql(tableName, reservedColumns),
              function (result2) {
                let columnClause = ''
                for (let reservedColumnIndex in reservedColumns) {
                  columnClause =
                    columnClause +
                    reservedColumns[reservedColumnIndex].name +
                    ','
                }
                if (columnClause.endsWith(',')) {
                  columnClause = columnClause.substring(
                    0,
                    columnClause.length - 1
                  )
                }
                executeSql(
                  null,
                  'insert into ' +
                    tableName +
                    '(' +
                    columnClause +
                    ') select ' +
                    columnClause +
                    ' from ' +
                    bikTableName,
                  function () {
                    let columnClause = ''
                    for (let deletedColumnIndex in columns) {
                      columnClause =
                        columnClause +
                        "'" +
                        columns[deletedColumnIndex].name +
                        "',"
                    }
                    if (columnClause.endsWith(',')) {
                      columnClause = columnClause.substring(
                        0,
                        columnClause.length - 1
                      )
                    }

                    executeSql(
                      null,
                      "delete from system_tablecolumn where tableId = '" +
                        tableId +
                        "' and name in (" +
                        columnClause +
                        ')',
                      function () {
                        executeSql(
                          null,
                          'drop table if exists ' + bikTableName,
                          successCB
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        )
      }
    }
  )
}

/**
 * 重新建表
 * @param newwColumns 新表信息，新表中不能有原表没有的字段定义，否则会出错
 */
function reCreateTable(config, reCreateSuccessCB, errorCB) {
  //重命名原表
  //重新建表
  //将原表数据插入到新表中。
  //重新插入system_tablecolumn中对应的信息
  let tableName = config.tableName
  let newColumns = config.newColumns
  let tableId = config.tableId

  let bikTableName = tableName + '_bik_' + new Date().getTime()
  executeSql(
    null,
    createRenameTableSql(tableName, bikTableName),
    function (result1) {
      executeSql(
        null,
        "delete from system_tablecolumn where tableId = '" + tableId + "'",
        function () {
          executeSql(
            null,
            "delete from system_tableinfo where id = '" + tableId + "'",
            function () {
              executeCreateTable({
                tableName: tableName,
                tableId: tableId,
                columns: newColumns,
                successCB: function () {
                  let columnClause = ''
                  for (let index in newColumns) {
                    columnClause = columnClause + newColumns[index].name + ','
                  }
                  if (columnClause.endsWith(',')) {
                    columnClause = columnClause.substring(
                      0,
                      columnClause.length - 1
                    )
                  }

                  let copySql =
                    'insert into ' +
                    tableName +
                    '(' +
                    columnClause +
                    ') select ' +
                    columnClause +
                    ' from ' +
                    bikTableName

                  executeSql(null, copySql, function () {
                    //executeSql(null , "drop table if exists " + bikTableName ,successCB);
                    reCreateSuccessCB()
                  })
                }
              })
            }
          )
        }
      )
    }
  )
}

function executeSyncTable(config, successCB, errorCB) {
  let addCB = function () {
    let renameCB = function () {
      //				var deleteCB = function(){
      //					successCB();
      //				}
      //
      //				if(config.deleteColumns && config.deleteColumns.length>0){
      //					deleteTableColumn({
      //						tableId:config.tableId,
      //						tableName:config.tableName,
      //						columns :  config.deleteColumns
      //					} , deleteCB );
      //				}else{
      //					deleteCB();
      //				}

      let reCreateCB = function () {
        successCB()
      }
      if (config.reCreate) {
        reCreateTable(
          {
            tableId: config.tableId,
            newColumns: config.newColumns,
            tableName: config.tableName
          },
          successCB
        )
      } else {
        reCreateCB()
      }
    }
    if (config.renameColumns && config.renameColumns.length > 0) {
      renameTableColumn(
        {
          tableId: config.tableId,
          tableName: config.tableName,
          columns: config.renameColumns
        },
        renameCB
      )
    } else {
      renameCB()
    }
  }

  if (config.addColumns && config.addColumns.length > 0) {
    addTableColumn(
      {
        tableId: config.tableId,
        tableName: config.tableName,
        columns: config.addColumns
      },
      addCB
    )
  } else {
    addCB()
  }
}
/**
 * tableName , tableId , columns , successCB
 * @params columns [{id:id, name:name,type:type }]
 */
function executeCreateTable(config) {
  let tableName = config.tableName
  let tableId = config.tableId
  let columns = config.columns
  let successCB = config.successCB

  let sql = createCreateSql(tableName, columns)
  executeSql(null, sql, function () {
    let insertTableInfoSql =
      "insert into system_tableinfo(id,name) values('" +
      tableId +
      "','" +
      tableName +
      "')"
    executeSql('system_tablecolumn', insertTableInfoSql, function () {
      let valueClause = ''
      for (let index in columns) {
        valueClause =
          valueClause +
          "('" +
          columns[index].id +
          "','" +
          columns[index].name +
          "','" +
          tableId +
          "' , " +
          columns[index].type +
          '),'
      }
      if (valueClause.endsWith(',')) {
        valueClause = valueClause.substring(0, valueClause.length - 1)
      }
      let insertTableColumnSql =
        'insert into system_tablecolumn(id,name,tableId,type) values ' +
        valueClause
      executeSql('system_tablecolumn', insertTableColumnSql, function () {
        successCB()
      })
    })
  })
}

function syncTable(tableName, successCB, errorCB) {
  let oldColumns = [] // 旧列名数组
  let newColumns = [] // 新列名数组

  let deleteColumns = []
  let addColumns = []
  let renameColumns = []
  let changeColumns = []
  let reCreate = false

  if (!window.cordova.plugins.http.getTableDefine) {
    alert('App版本过旧，请升级客户端')
    return
  }
  window.cordova.plugins.http.getTableDefine(
    { tableName: tableName },
    function (data) {
      let dataObj = JSON.parse(data)
      let tableColumnInfos = dataObj.tableColumnInfos
      for (let tableColumnInfoIndex in tableColumnInfos) {
        newColumns.push({
          id: tableColumnInfos[tableColumnInfoIndex].id,
          name: tableColumnInfos[tableColumnInfoIndex].ColumnName,
          type: tableColumnInfos[tableColumnInfoIndex].ColumnType
        })
      }

      executeSql(
        'system_tableinfo',
        "select * from system_tableinfo where name = '" + tableName + "'",
        function (tableInfoResults) {
          if (tableInfoResults.rows.length > 0) {
            let tableId = tableInfoResults.rows.item(0).id
            executeSql(
              'system_tablecolumn',
              "select * from system_tablecolumn where tableId = '" +
                tableId +
                "'",
              function (tableColumnResults) {
                if (tableColumnResults) {
                  for (
                    let index = 0;
                    index < tableColumnResults.rows.length;
                    index++
                  ) {
                    oldColumns.push(tableColumnResults.rows.item(index))
                  }
                }

                for (let i = 0; i < oldColumns.length; i++) {
                  let contain = false
                  for (let j = 0; j < newColumns.length; j++) {
                    if (oldColumns[i].id == newColumns[j].id) {
                      contain = true
                      break
                    }
                  }
                  if (!contain) {
                    deleteColumns.push(oldColumns[i])
                    reCreate = true
                  }
                }

                for (let i = 0; i < newColumns.length; i++) {
                  let contain = false
                  for (let j = 0; j < oldColumns.length; j++) {
                    if (newColumns[i].id == oldColumns[j].id) {
                      contain = true
                      if (newColumns[i].type != oldColumns[j].type) {
                        changeColumns.push(newColumns[i])
                        reCreate = true
                      }

                      break
                    }
                  }
                  if (!contain) {
                    addColumns.push(newColumns[i])
                  }
                }

                executeSyncTable(
                  {
                    tableName: tableName,
                    tableId: tableId,
                    addColumns: addColumns,
                    renameColumns: renameColumns,
                    newColumns: newColumns,
                    reCreate: reCreate,
                    deleteColumns: deleteColumns,
                    changeColumns: changeColumns
                  },
                  function () {
                    //								alert("同步表结构成功：加字段：" + addColumns.length + "删字段：" + deleteColumns.length );
                    successCB()
                  }
                )
              }
            )
          } else {
            executeCreateTable({
              tableName: tableName,
              tableId: dataObj.tableInfo.id,
              columns: newColumns,
              successCB: function () {
                //								alert("同步表结构成功：建表");
                successCB()
              }
            })
          }
        }
      )
    },
    function (e) {
      console.info(e)
    }
  )

  //获取需要删除的列名数组：旧数组中有而新数组中没有的
  //获取需要添加的列名数组：新数组中有而旧数组中没有的

  //执行删除
  //执行添加
}

/**
 * sqlite内部不支持布尔型数据的存储，所以布尔型数据在保存时需要封装成字符串，以便读取时能够识别出源数据是布尔型。
 * @returns 如果入参是布尔型数据，返回封装后的对应的入参值。否则返回封装后的false。
 */
function wrapBoolean(booleanValue) {
  if (typeof booleanValue == 'boolean') {
    return '_vplatform_inner_boolean_' + booleanValue
  } else {
    return '_vplatform_inner_boolean_false'
  }
}

/**
 * 检测数据是不是被封装的布尔型
 * @returns 如果入参是封装后的布尔型数据，返回true，否则返回false。
 */
function checkBoolean(srcValue) {
  if (typeof srcValue == 'string') {
    if (
      srcValue == '_vplatform_inner_boolean_true' ||
      srcValue == '_vplatform_inner_boolean_false'
    ) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

/**
 * 将被封装成字符串的布尔型数据还原出来。
 * @returns 如果入参是封装后的true，返回true。否则返回false。
 */
function restoreBoolean(wrapBoolean) {
  if (wrapBoolean == '_vplatform_inner_boolean_true') {
    return true
  } else {
    return false
  }
}

export { query, save }
