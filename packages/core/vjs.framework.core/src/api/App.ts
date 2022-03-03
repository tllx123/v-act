require('vjs/framework/core/Platform')

let ExtensionRegistry,
  ExtensionProvider,
  ServiceRegistry,
  ExtManager,
  Logger,
  base,
  util
ExtensionRegistry = require('vjs/framework/core/ExtensionRegistry')
ExtensionProvider = require('vjs/framework/core/ExtensionProvider')
ServiceRegistry = require('vjs/framework/core/ServiceRegistry')
ExtManager = require('vjs/framework/core/ExtensionManager')
Logger = require('vjs/framework/core/base/log/api/Log')
base = {
  util: {
    deferred: {},
    arrays: {},
    collections: {},
    functions: {},
    object: {},
    utility: {}
  }
}
let Deferred = require('vjs/framework/core/base/util/api/Deferred')
base['util'].deferred = Deferred
base['util'].arrays = require('vjs/framework/core/base/util/api/Arrays')
base[
  'util'
].collections = require('vjs/framework/core/base/util/api/Collections')
base['util'].functions = require('vjs/framework/core/base/util/api/Functions')
base['util'].object = require('vjs/framework/core/base/util/api/Objects')
base['util'].utility = require('vjs/framework/core/base/util/api/Utility')
util = base['util']

function VJS(config) {
  if (!(this instanceof VJS)) {
    return new VJS(config)
  }

  let moduleLoader = config.moduleLoader || VMetrix

  let extRegistry = new ExtensionRegistry()

  let extManager = new ExtManager({
      moduleLoader: moduleLoader,
      extensionRegistry: extRegistry
    }),
    app = this

  let appSandboxes = {}
  let baseSandbox = Object.create(base)

  app.id = config.id || util.utility.uniqueId('vjs_')
  app.name = config.name

  app.logger = new Logger('app[' + app.id + ']')

  app.util = util

  app._config = config = config || {}
  config.debug = config.debug || {}
  let debug = config.debug
  if (debug.enable) {
    app.logger.enable()
  }

  baseSandbox._require = function (ref) {
    if (Array.isArray(ref)) {
      for (let i = 0; i < ref.length; i++) {
        if (ref[i]) {
          extManager.add({
            ref: ref[i],
            context: app
          })
        }
      }
    } else {
      if (ref) {
        extManager.add({
          ref: ref,
          context: app
        })
      }
    }

    return app
  }

  app.use = baseSandbox._require

  app.start = function (options) {
    if (app._started) {
      app.logger.error('APP[' + app.name + '] already started!')
      return extManager.initStatus
    }

    app.logger.log('Starting APP[' + app.name + ']')

    app._started = true

    return extManager.init(app)
  }

  app.stop = function () {
    // TODO: We need to actually do some cleanup here.
    app._started = false
  }

  app.sandboxes = {}

  app.sandboxes.create = baseSandbox.create = function (sandboxConfig) {
    var sbConfig = sandboxConfig || {}
    var ref = sbConfig.ref

    //todo 临时处理
    var extensions = sbConfig.extensions || []
    extensions.splice(
      0,
      0,
      'vjs.framework.extension.platform.skin.base',
      'theme.catalog.advance.pc.base.general.$skin',
      'theme.catalog.advance.pc.base.date.$skin'
    )
    sbConfig.extensions = extensions
    //todo end

    // Making shure we have a unique ref
    ref = ref || util.utility.uniqueId('sandbox-')
    if (appSandboxes[ref]) {
      throw new Error('Sandbox with ref ' + ref + ' already exists.')
    }

    // Create a brand new sandbox based on the baseSandbox
    var sandbox = Object.create(baseSandbox)

    // Give it a ref
    sandbox.ref = ref

    // Attach a Logger
    sandbox.logger = new Logger(sandbox.ref).enable()

    // Sandbox's dependency extensions
    sandbox.extensions = []

    sandbox.initConsumer =
      (sandboxConfig && sandboxConfig.initConsumer) || false

    sandbox.use = function (extensions) {
      if (extensions) {
        if (Array.isArray(extensions)) {
          for (var i = 0; i < extensions.length; i++) {
            sandbox.extensions.push(extensions[i])
          }
        } else {
          sandbox.extensions.push(extensions)
        }

        sandbox._require(extensions)
      }
    }

    // Registry extensions from sandbox's config
    sandbox.use(sbConfig.extensions)

    sandbox._serviceRegistry = null

    sandbox.getService = function (serviceName, filter) {
      var service = sandbox._serviceRegistry.getService(serviceName, filter)
      return service
    }

    sandbox.getServiceByAlias = function (alias, filter) {
      var service = sandbox._serviceRegistry.getServiceByAlias(alias, filter)
      return service
    }

    // Load sandbox's dependency extensions and make sandbox instance valid
    sandbox.active = function () {
      var dfd = extManager.loadExtensions(app).done(function () {
        var srConfig = {
          ref: sandbox.ref,
          extensions: sandbox.extensions,
          extensionRegistry: extRegistry
        }
        sandbox._serviceRegistry = new ServiceRegistry(srConfig)
      })
      dfd.fail(function (rs) {
        sandbox.logger.error(rs.message)
      })
      /*if(!sandbox.initConsumer){
                var d = Deferred.Deferred();
                dfd.done(function(bundleEntry){
                    var loadedBundles = moduleLoader.getAllLoadedBundles();
                    for(var name in loadedBundles){
                        if(loadedBundles.hasOwnProperty(name)){
                            var bundle = loadedBundles[name];
                            for(var version in bundle){
                                if(bundle.hasOwnProperty(version)){
                                    var bundleObj = bundle[version];
                                    if(!bundleObj.inited){
                                        bundleObj.inited = true;
                                        if(bundleObj.bundle&&bundleObj.bundle.inited){
                                            bundleObj.bundle.inited(sandbox);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    d.resolve();
                });
                return d;
            }else{
                return dfd;
            }*/
      return dfd
    }

    // Register it in the app's sandboxes registry
    appSandboxes[sandbox.ref] = sandbox

    var debug = config.debug
    if (debug === true) {
      sandbox.logger.enable()
    }

    _.extend(sandbox, sbConfig.options || {})

    return sandbox
  }

  //给VMetrix添加sandbox信息，在v3-vdk中需要使用
  if (VMetrix) {
    VMetrix.sandbox = app.sandboxes
  }

  app.sandboxes.get = function (ref) {
    return appSandboxes[ref]
  }

  app.extensions = {}

  app.extensions.registerExtensionService = function (extensionProvider) {
    extRegistry.registerExtensionProvider(extensionProvider)
  }

  //init module  add by xiedh 2014-12-26
  app.extensions.initModule = function (module, sandbox) {
    if (module) {
      let func
      switch (typeof module) {
        case 'function':
          func = module.prototype.initModule
          break
        case 'object':
          func = module.initModule
          break
      }
      if (func) {
        func.call(module, sandbox)
      }
    }
  }

  app.extensions.ExtensionProvider = ExtensionProvider

  return app
}

return VJS
