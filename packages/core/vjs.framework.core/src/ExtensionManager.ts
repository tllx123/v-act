let arrayUtil,
  collectionsUtil,
  slice = Array.prototype.slice,
  logger,
  Deferred

Deferred = require('vjs/framework/core/base/util/api/Deferred')
arrayUtil = require('vjs/framework/core/base/util/api/Arrays')
collectionsUtil = require('vjs/framework/core/base/util/api/Collections')
let Logger = require('vjs/framework/core/base/log/api/Log')
logger = new Logger('Extensions').enable()
let NULL_VERSION = null

function ExtensionManager(config) {
  this._allExtEntries = []
  this._unReadyExtEntries = []
  this._initialized = []
  this._initializedIndex = {}
  this._moduleLoder = config.moduleLoader
  this._extensionRegistry = config.extensionRegistry
  return this
}

//---------------------------------------------------------------------------
// Public API
//---------------------------------------------------------------------------

ExtensionManager.prototype.add = function (ext) {
  let newExtName = ''
  let newExtVersion = ''
  if (typeof ext.ref !== 'object') {
    newExtName = ext.ref
  } else {
    newExtName = Object.keys(ext.ref)[0]
    newExtVersion = ext.ref[newExtName]
  }

  //TODO-Exception
  if (!newExtName) {
    return this
  }

  //TODO -内核bundle运行时环境默认加载，通过内核只加载扩展bundle
  if (newExtName === 'vjs.framework.core') {
    return this
  }

  if (this._initializedIndex[newExtName]) {
    if (!newExtVersion) {
      return this
    } else if (this._initializedIndex[newExtName][newExtVersion]) {
      return this
    }
  }

  this._allExtEntries.push(ext)

  this._unReadyExtEntries.push(ext)

  return this
}

ExtensionManager.prototype.loadExtensions = function (app) {
  let extEntries = arrayUtil.compact(this._unReadyExtEntries),
    deferred = Deferred.Deferred()

  let extUris = []
  let loadingExtensions = []
  let initializedBundles = this._initialized
  //预加载但未执行初始化的bundle
  let unInitializedBundles = []
  //本加载器已加载的全部bundle
  let allLoadedBundles = this._moduleLoder.getAllLoadedBundles()
  //别名映射 add by xiedh 2016-01-28
  let aliasMap = this._moduleLoder.getAliasMap()
  collectionsUtil.each(extEntries, function (ext) {
    let extName = ''
    let extVersion = ''
    if (typeof ext.ref !== 'object') {
      extName = ext.ref
    } else {
      extName = Object.keys(ext.ref)[0]
      let val = ext.ref[extName]
      if (val != null && typeof val == 'object') {
        // modify by xiedh 2016-01-27
        extVersion = val.version
        let isAlias = val.isAlias
        if (isAlias) {
          extName = aliasMap[extName]
        }
      } else {
        extVersion = val
      }
    }

    //过滤掉已下载过的extension，不再重复请求
    for (let i = 0; i < initializedBundles.length; i++) {
      //被别的extension以依赖项的方式自动加载过
      if (
        initializedBundles[i].bundleName === extName &&
        (initializedBundles[i].version === extVersion || !extVersion)
      ) {
        ext['status'] = 'loaded'
        return
      }
    }

    if (
      ext.context.id === app.id &&
      ext['status'] !== 'loaded' &&
      ext['status'] !== 'loading'
    ) {
      if (allLoadedBundles[extName] && !extVersion) {
        if (allLoadedBundles[extName][NULL_VERSION]) {
          unInitializedBundles.push(allLoadedBundles[extName][NULL_VERSION])
        } else {
          for (version in allLoadedBundles[extName]) {
            unInitializedBundles.push(allLoadedBundles[extName][version])
          }
        }
      } else if (
        allLoadedBundles[extName] &&
        extVersion &&
        allLoadedBundles[extName][extVersion]
      ) {
        unInitializedBundles.push(allLoadedBundles[extName][extVersion])
      } else {
        let ref = ext.ref,
          val
        if (typeof ref == 'object') {
          let extName = Object.keys(ref)[0]
          val = ext.ref[extName]
        }
        if (!val || !val.optional) {
          extUris.push(ref)
          ext['status'] = 'loading'
          loadingExtensions.push(ext)
        }
      }
    }
  })

  //reset
  this._unReadyExtEntries.splice(0)

  //对预加载且未初始化的bundle进行初始化处理
  //TODO - 此逻辑与下面的一样，后续统一封装
  if (unInitializedBundles.length > 0) {
    for (let i = 0; i < unInitializedBundles.length; i++) {
      let unInitedBundle = unInitializedBundles[i].bundle

      //regidter bundle service
      getFn(unInitedBundle, unInitedBundle.initializeProvider)(app)

      //cache initialized Bundle Ref Objects
      initializedBundles.push(unInitializedBundles[i])

      //build index
      let bundleName = unInitializedBundles[i]['bundleName']
      let version = unInitializedBundles[i]['version']
      if (!this._initializedIndex[bundleName]) {
        this._initializedIndex[bundleName] = {}
      }
      this._initializedIndex[bundleName][version] = unInitedBundle
    }

    let unInitBundles = [],
      unInitBundleMap = {}
    for (let j = 0; j < unInitializedBundles.length; j++) {
      let bundle = unInitializedBundles[j]
      unInitBundleMap[bundle.alias] = bundle
    }
    let excludes = {}
    let iter = function (bundle) {
      if (!excludes[bundle.bundleName]) {
        excludes[bundle.bundleName] = true
        let bd = bundle.bundle
        let deps = bd.getVJS().deps
        if (deps) {
          for (let dep in deps) {
            if (unInitBundleMap[dep]) {
              iter(unInitBundleMap[dep])
            }
          }
        }
        unInitBundles.push(bundle)
      }
    }
    for (let j = 0; j < unInitializedBundles.length; j++) {
      iter(unInitializedBundles[j])
    }
    ;(excludes = null), (unInitBundleMap = null)
    for (let j = 0; j < unInitBundles.length; j++) {
      let unInitedBundle = unInitBundles[j].bundle

      //consume bundle service
      getFn(unInitedBundle, unInitedBundle.initializeConsumer)(app)
    }
  }

  if (extUris.length > 0) {
    let initializedIndex = this._initializedIndex

    //TODO -并发异步下载可能出现重复加载间接依赖bundle的问题
    //TODO -加载异常失败，如何加上补偿处理机制?
    this._moduleLoder.loadBundles(extUris, function (hostBundles, bundleEntry) {
      if (bundleEntry) {
        if (_hasError(bundleEntry)) {
          deferred.rejectWith(deferred, [
            {
              title: bundleEntry.getTitle(),
              message: bundleEntry.getMessage(),
              type: bundleEntry.getType(),
              reason: 'SystemError',
              exceptionLib: bundleEntry
            }
          ])
        } else {
          let bundles = bundleEntry.getBundles()
          for (let i = 0; i < bundles.length; i++) {
            let newBundle = bundles[i].bundle

            //regidter bundle service
            getFn(newBundle, newBundle.initializeProvider)(app)

            //cache initialized Bundle Ref Objects
            initializedBundles.push(bundles[i])

            //build index
            let bundleName = bundles[i]['bundleName']
            let version = bundles[i]['version']
            if (!initializedIndex[bundleName]) {
              initializedIndex[bundleName] = {}
            }
            initializedIndex[bundleName][version] = newBundle
          }

          for (let j = 0; j < bundles.length; j++) {
            let newBundle = bundles[j].bundle

            //consume bundle service
            getFn(newBundle, newBundle.initializeConsumer)(app)
          }

          for (let i = 0; i < loadingExtensions.length; i++) {
            loadingExtensions[i]['status'] = 'loaded'
          }
          deferred.resolve(bundleEntry)
        }
      } else {
        //TODO -离线版
        //deferred.resolve();
        deferred.rejectWith(deferred, [
          {
            message: '网络连接失败，请检查网络是否正常！',
            type: 'ModuleScriptException',
            reason: 'NetworkError'
          }
        ])
      }
    })
  } else {
    deferred.resolve()
  }

  return deferred.promise()
}

let _hasError = function (module) {
  return (
    !module ||
    (module.hasOwnProperty('__$isErrorModule') && module.__$isErrorModule)
  )
}

ExtensionManager.prototype.init = function (app) {
  if (this.initStarted) {
    throw new Error('Init extensions already called')
  }

  this.initStarted = true

  return this.loadExtensions(app)
}

function getFn() {
  let funcs = slice.call(arguments),
    fn
  for (let f = 0, l = funcs.length; f < l; f++) {
    fn = funcs[f]
    if (typeof fn === 'function') {
      return fn
    }
  }
  return function () {}
}

return ExtensionManager
