#!/usr/bin/env node

const consoleUtils = require('../src/utils/ConsoleUtils')
const childProcess = require('child_process')
const cache = require('@v-act/cache').get('v3-pack-center-template')
const PROCESS_PID_KEY = 'PROCESS_PID_KEY'

let startTime = Date.now()
const processList = []

const promises = [stopComponentXmlWatcher(), stopVActDevEnv()]

Promise.all(promises)
  .then(() => {
    const startedProcessPids = cache.get(PROCESS_PID_KEY) || []
    startedProcessPids.forEach((pId) => {
      try {
        process.kill(pId)
      } catch (e) {}
    })
    cache.put(PROCESS_PID_KEY, [])
    cache.save()
    let cost = Date.now() - startTime
    console.log(`http服务关闭完成，耗时【${cost}】毫秒！`)
    consoleUtils.serverStarted(cost)
  })
  .catch((err) => {
    processList.forEach((pId) => {
      try {
        process.kill(pId)
      } catch (e) {}
    })
    consoleUtils.serverStarException(err)
  })

/**
 * 启动业务构件部署包监听
 */
function stopComponentXmlWatcher() {
  return new Promise((resolve, reject) => {
    let proc = childProcess.exec(
      'stopWatch',
      {
        cwd: process.cwd()
      },
      function (err) {
        if (err) {
          return reject(err)
        }
      }
    )
    if (proc) {
      processList.push(proc.pid)
    }
    if (proc && proc.stdout) {
      proc.stdout.on('data', (data) => {
        consoleUtils.out({
          success: true,
          content: data
        })
      })
    }
    if (proc && proc.stderr) {
      proc.stderr.on('data', (data) => {
        consoleUtils.out({
          success: false,
          content: data
        })
      })
    }
    console.log('业务构件部署xml监听关闭成功！')
    resolve()
  })
}

/**
 * 关闭VAct开发环境
 */
function stopVActDevEnv() {
  return new Promise((resolve, reject) => {
    let proc = childProcess.exec(
      'vact stop',
      {
        cwd: process.cwd()
      },
      function (err) {
        if (err) {
          return reject(err)
        }
      }
    )
    if (proc) {
      processList.push(proc.pid)
    }
    if (proc && proc.stdout) {
      proc.stdout.on('data', (data) => {
        consoleUtils.out({
          success: true,
          content: data
        })
      })
    }
    if (proc && proc.stderr) {
      proc.stderr.on('data', (data) => {
        consoleUtils.out({
          success: false,
          content: data
        })
      })
    }
    console.log('业务构件本地预览服务关闭成功！')
    resolve()
  })
}
