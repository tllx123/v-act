import { uuid } from '@v-act/vjs.framework.extension.util.uuid'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let TaskManager = function () {
  //任务列表
  this.taskList = []
  this.intervalIndex
  //是否正在执行
  this.executing
  //循环间隔
  this.intervalStep
  this.reset()
}
/**
 *开始执行异步处理，如果正在运行中，则忽略
 */
TaskManager.prototype.start = function () {
  if (!this.executing) {
    this.executing = true
    let _this = this
    this.intervalIndex = setInterval(function () {
      _this.execTask()
    }, this.intervalStep)
  }
}

TaskManager.prototype.execTask = function () {
  for (let i = 0, task; (task = this.taskList[i]); i++) {
    if (task.isAutoExe()) {
      arrayUtil.remove(this.taskList, task)
      i--
      return task.execute()
    }
  }
  this.reset()
}

TaskManager.prototype.execTaskById = function (taskId, args) {
  for (let i = 0, task; (task = this.taskList[i]); i++) {
    if (taskId === task.getTaskId()) {
      arrayUtil.remove(this.taskList, task)
      i--
      args = args || [] //ie下，如果args为undefine，报错
      return task.execute.apply(task, args)
    }
  }
}

TaskManager.prototype.addTask = function (task) {
  this.taskList.push(task)
}

/**
 *状态重置
 */
TaskManager.prototype.reset = function () {
  if (this.intervalIndex != null) {
    clearInterval(this.intervalIndex)
  }
  this.executing = false
  this.intervalStep = 1
  this.intervalIndex = null
}

TaskManager.prototype.exist = function (taskId) {
  let falg = false
  for (let i = 0, task; (task = this.taskList[i]); i++) {
    if (taskId === task.getTaskId()) {
      falg = true
      break
    }
  }
  return falg
}

let singlton = new TaskManager()

const addTask = function (task) {
  let scopeId = task.scopeId
  let taskId = uuid.generate()
  if (!scopeId || !scopeManager.isDestroy(scopeId)) {
    task.setTaskId(taskId)
    singlton.addTask(task)
    singlton.start()
  }
  return taskId
}

const execTaskById = function (taskId, args) {
  return singlton.execTaskById(taskId, args)
}

const exists = function (taskId) {
  return singlton.exist(taskId)
}

const removeById = function (taskId) {
  for (let task, i = 0; (task = singlton.taskList[i]); i++) {
    if (task.getTaskId() == taskId) {
      arrayUtil.remove(singlton.taskList, task)
      return true
    }
  }
  return false
}

const removeByFilter = function (filter) {
  for (let task, i = 0; (task = singlton.taskList[i]); i++) {
    if (task.isMatch(filter)) {
      arrayUtil.remove(singlton.taskList, task)
      i--
    }
  }
}

export {
  addComponentOptionDefines,
  addComponentRouteInfo,
  addComponentVariantDefines,
  addRuleSetInputs,
  addTask,
  componentIsInited,
  componentIsLoaded,
  destroy,
  execTaskById,
  existMapping,
  exists,
  getComponentOptionDefine,
  getComponentType,
  getComponentVariantDefine,
  getMapping,
  getRouteConfig,
  getRuleSetInput,
  getRuleSetInputs,
  init,
  isAppConfigInfoLoaded,
  loadIcons,
  markAppConfigInfoLoaded,
  markForComponentInited,
  markForComponentLoaded,
  removeByFilter,
  removeById,
  setComponentType
}
