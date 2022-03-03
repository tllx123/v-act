import { DatasourceManager as dbManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { Record as Record } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

//加载actionHandler模块
let undefined

exports.initModule = function (sb) {}

/**
 * 主入口
 * @param widgetId 当前门户控件ID
 * @param configDataJson 初始化数据
 * @param tabSetInitConfig
 */
let main = function (param) {
  let args = param.getArgs()
  let portalOldTable = args[0]
  let portalTable = args[1]
  let windowTable = args[2]
  let dataSourceObj = dbManager.lookup({ datasourceName: portalOldTable })
  if (!dataSourceObj) {
    throw new Error('需要插入数据的数据源不存在:' + ds)
  }
  let records = dataSourceObj.getAllRecords().toArray()
  let recordList = {}
  for (let i = 0, num = records.length; i < num; i++) {
    let _record = records[i].toMap()
    if (recordList[_record.pageNum] == null) {
      recordList[_record.pageNum] = {}
    }
    if (recordList[_record.pageNum][_record.cloumnNum] == null) {
      recordList[_record.pageNum][_record.cloumnNum] = []
    }
    recordList[_record.pageNum][_record.cloumnNum].push(_record)
  }

  let allHeight
  let pageRow = {}
  for (let rpage in recordList) {
    let row = 1
    let cHeight = {}
    for (let rcloumn in recordList[rpage]) {
      allHeight = 0
      let items = recordList[rpage][rcloumn]
      for (let i = 0, num = items.length; i < num; i++) {
        let item = items[i]
        allHeight += parseInt(item.percentHeight)
      }
      cHeight[rcloumn] = allHeight
      if (allHeight > 100) {
        row = items.length * row
      } else {
        row = parseInt(100 / allHeight) * row
      }
    }
    pageRow[rpage] = { row: row, height: cHeight }
  }

  let portalJson = {}
  let windowList = []
  let portalList = []
  for (let rpage in recordList) {
    for (let rcloumn in recordList[rpage]) {
      let items = systemSort(recordList[rpage][rcloumn])
      let startRow = 0
      for (let i = 0, num = items.length; i < num; i++) {
        let item = items[i]
        if (portalJson[item.pageNum] == null) {
          let pageRows = getPage(item, pageRow[rpage].row)
          portalJson[item.pageNum] = pageRows
          //portalList.push(record.create(portalTable,pageRows));
          portalList.push(new Record(portalTable, pageRows))
        }

        let crossRow =
          (item.percentHeight / pageRow[rpage]['height'][rcloumn]) *
          pageRow[rpage].row
        windowList.push(
          getWindow(
            windowTable,
            item,
            pageRow[rpage].row,
            startRow,
            crossRow,
            portalJson[item.pageNum].pcode
          )
        )
        startRow = crossRow
      }
    }
  }
  let datasourcePortalTable = dbManager.lookup({ datasourceName: portalTable })
  datasourcePortalTable.insertRecords({ records: portalList })
  let datasourceWindowTable = dbManager.lookup({ datasourceName: windowTable })
  datasourcePortalTable.insertRecords({ records: windowList })
}

let systemSort = function (array) {
  return array.sort(function (a, b) {
    return a.orderNo - b.orderNo
  })
}

function getPage(item, row) {
  return {
    ptitle: item.title,
    pcloumn: item.columnCount,
    prow: row,
    pcode: genUUID()
  }
}

function getWindow(windowTable, item, row, startRow, crossRow, pcode) {
  startRow = Math.round(startRow)
  crossRow = Math.round(crossRow)

  return new Record(windowTable, {
    title: item.title,
    isWindow: item.isComponent,
    componentCode: item.componentCode,
    windowCode: item.windowCode,
    url: item.url,
    startRow: startRow,
    startCloumn: item.cloumnNum,
    crossRow: crossRow,
    crossCloumn: 1,
    pcode: pcode
  })
}
function genUUID() {
  let S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}
export { main }
