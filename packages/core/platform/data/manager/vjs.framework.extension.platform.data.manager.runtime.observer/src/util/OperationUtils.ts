import { ObjectUtil as objUtils } from '@v-act/vjs.framework.extension.util.object'

export function combine(aim: any, source: any) {
  let params = source.getParams()
  let rs = aim.getParams().resultSet
  params.resultSet.iterate(function (rd: any) {
    let id = rd.getSysId()
    aim.setRecordPosition(rd, source.getRecordPosition(rd))
    rs.addRecord(rd)
  })
  source.markDestroy()
}

export function destroy(before: any, after: any) {
  var rs = before.getParams().resultSet,
    opRs = after.getParams().resultSet
  var remove: any = [],
    remove1: any = []
  rs.iterate(function (rd: any, i: any) {
    var id = rd.getSysId()
    opRs.iterate(function (record: any, index: number) {
      if (
        id == record.getSysId() &&
        after.getRecordPosition(record) > before.getRecordPosition(rd)
      ) {
        remove.push(i)
        remove1.push(index)
        return false
      }
    })
  })
  rs.removeByIndexs(remove)
  opRs.removeByIndexs(remove1)
  if (opRs.isEmpty()) {
    after.markDestroy()
  }
  if (rs.isEmpty()) {
    before.markDestroy()
  }
}
export function destroyBefore(before: any, after: any) {
  var bRs = before.getParams().resultSet,
    aRs = after.getParams().resultSet
  var remove: any = []
  bRs.iterate(function (rd: any, i: any) {
    var id = rd.getSysId()
    aRs.iterate(function (record: any, index: number) {
      if (
        id == record.getSysId() &&
        after.getRecordPosition(record) > before.getRecordPosition(rd)
      ) {
        remove.push(i)
        return false
      }
    })
  })
  bRs.removeByIndexs(remove)
  if (bRs.isEmpty()) {
    before.markDestroy()
  }
}

export function opUpdateWhenInsert(insert: any, update: any) {
  let resultSet = update.getParams().resultSet
  let iRs = insert.getParams().resultSet
  let toRemove: any = []
  resultSet.iterate(function (rd: any, index: any) {
    let id = rd.getSysId()
    iRs.iterate(function (record: any) {
      if (
        record.getSysId() == id &&
        update.getRecordPosition(rd) > insert.getRecordPosition(record)
      ) {
        let pre = rd.getChangedData()
        let changes = record.getChangedData()
        changes = changes || {}
        objUtils.extend(changes, pre)
        record.setChangedData(changes)
        toRemove.push(index)
        return false
      }
    })
  })
  resultSet.removeByIndexs(toRemove)
  if (resultSet.isEmpty()) {
    update.markDestroy()
  }
}

export function destroyCurrent(current: any, operation: any) {
  let resultSet = operation.getParams().resultSet
  if (resultSet) {
    let id = current.getParams().currentRecord.getSysId()
    resultSet.iterate(function (rd: any, i: any) {
      if (
        rd.getSysId() == id &&
        operation.getRecordPosition(id) > current.getRecordPosition(id)
      ) {
        current.markDestroy()
        return false
      }
    })
  }
}

export function destroyWhenLoad(operation: any, load: any) {
  let params = load.getParams()
  let isAppend = params.isAppend
  if (!isAppend) {
    //如果以覆盖方式加载
    let rs = operation.getParams().resultSet
    if (rs) {
      let toRemove: any = []
      rs.iterate(function (rd: any, index: number) {
        if (operation.getRecordPosition(rd) < load.getOperationPosition()) {
          toRemove.push(index)
        }
      })
      rs.removeByIndexs(toRemove)
      if (rs.isEmpty()) {
        operation.markDestroy()
      }
    }
  }
}

export function opSelectWhenDelete(select: any, deleted: any) {
  let rs = deleted.getParams().resultSet,
    sRs = select.getParams().resultSet
  let index = {}
  rs.iterate(function (rd: any) {
    index[rd.getSysId()] = rd
  })
  let toRemove: any = []
  sRs.iterate(function (rd: any, index: any) {
    let id = rd.getSysId()
    if (
      index[id] &&
      deleted.getRecordPosition(id) > select.getRecordPosition(id)
    ) {
      toRemove.push(index)
    }
  })
  sRs.removeByIndexs(toRemove)
  if (sRs.isEmpty()) {
    select.markDestroy()
  }
}
