#!/usr/bin/env node

const consoleUtils = require('../src/utils/ConsoleUtils')
const childProcess = require('child_process')
const detectPort = require('detect-port')
const metadataUtil = require('../src/utils/Metadata')
const cache = require('@v-act/cache').get('v3-pack-center-template')
const PROCESS_PID_KEY = 'PROCESS_PID_KEY'

let startTime = Date.now()

const startedProcess = cache.get(PROCESS_PID_KEY)
if (startedProcess) {
  startedProcess.forEach((pId) => {
    try {
      process.kill(pId)
    } catch (e) {}
  })
}

const promises = [startComponentXmlWatcher(), startVActDevEnv()]

Promise.all(promises)
  .then(() => {
    cache.save()
    let cost = Date.now() - startTime
    console.log(`http服务启动完成，耗时【${cost}】毫秒！`)
    consoleUtils.serverStarted(cost)
  })
  .catch((err) => {
    const startedProcessPids = cache.get(PROCESS_PID_KEY) || []
    startedProcessPids.forEach((pId) => {
      try {
        process.kill(pId)
      } catch (e) {}
    })
    consoleUtils.serverStarException(err)
  })

/**
 * 启动业务构件部署包监听
 */
function startComponentXmlWatcher() {
  return new Promise((resolve, reject) => {
    const args = process.argv
    let command = 'vactWatch'
    if (args.length === 3) {
      command += ' '
      command += args[2]
    }
    let proc = childProcess.exec(
      command,
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
      const startedProcessPids = cache.get(PROCESS_PID_KEY) || []
      startedProcessPids.push(proc.pid)
      cache.put(PROCESS_PID_KEY, startedProcessPids)
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
    console.log('业务构件部署xml监听启动成功！')
    resolve()
  })
}

/**
 * 启动VAct开发环境
 */
function startVActDevEnv() {
  return new Promise((resolve, reject) => {
    const metadata = metadataUtil.get()
    const initPort = metadata.previewPort || 3000
    detectPort(initPort)
      .then((port) => {
        metadata.previewPort = port
        let proc = childProcess.exec(
          'vact start -p ' + port,
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
          const startedProcessPids = cache.get(PROCESS_PID_KEY) || []
          startedProcessPids.push(proc.pid)
          cache.put(PROCESS_PID_KEY, startedProcessPids)
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
        console.log('业务构件本地预览服务启动成功！')
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}
