var ScopeManager, environment, componentUtil, sandbox, progressbar
var uuidUtil
var windowRelation, WindowContainer, exceptionHandler

export function initModule(sbox) {
  ScopeManager = sbox.getService(
    'vjs.framework.extension.platform.interface.scope.ScopeManager'
  )
  environment = sbox.getService(
    'vjs.framework.extension.platform.interface.environment.Environment'
  )
  componentUtil = require('vjs/framework/extension/ui/adapter/init/smartclient/web/api/SmartClientUtil')
  WindowContainer = sbox.getService(
    'vjs.framework.extension.platform.services.view.relation.WindowContainer'
  )
  windowRelation = sbox.getService(
    'vjs.framework.extension.platform.services.view.relation.WindowContainerManager'
  )
  uuidUtil = sbox.getService('vjs.framework.extension.util.UUID')
  exceptionHandler = sbox.getService(
    'vjs.framework.extension.platform.interface.exception.ExceptionHandler'
  )
  sandbox = sbox
}

/**
 * 渲染组件
 * @param componentCode<String> 组件编号
 * @param windowCode 窗体编号
 * @param {Object} inputParam 输入变量
 * @param {Object} paramCfg 参数配置
 *  runningMode 运行模式,
 * debug 是否debug模式,
 * contextPath 上下文路径,
 * showChromePlugin 是否提示安装chromePlugin插件
 * rendered:渲染回调
 * inited ： 组件初始化后回调
 * refComponents:{}
 */
var execute = function (
  componentCode,
  windowCode,
  inputParam,
  paramCfg,
  languageCode
) {
  isc.WidgetContext.setSkinType(paramCfg.skinType)
  var showChromePlugin = paramCfg.showChromePlugin,
    runningMode = paramCfg.runningMode,
    debug = paramCfg.debug,
    contextPath = paramCfg.contextPath,
    platformType = paramCfg.platformType
  environment.setRunningMode(runningMode)
  environment.setDebug(debug)
  environment.setContextPath(contextPath)
  environment.setPlatformType('RuntimeSchema')
  environment.setDebugPort(paramCfg.debugPort)
  environment.setDevId(paramCfg.devId)
  var renderedCallback = paramCfg.rendered
  var initedCallback = paramCfg.inited
  var rendererCallback = callBackFunc(showChromePlugin)
  isc.WidgetContext.setContextPath(contextPath)
  isc.WidgetContext.setRunningMode(runningMode)
  if (runningMode == 'prd') {
    //关闭日志功能
    isc.Log.addClassMethods({
      isEnabledFor: function () {
        return false
      }
    })
  }
  var refComponents = paramCfg.refComponents
  var parentScopeId = ScopeManager.getCurrentScopeId()
  var scopeId = ScopeManager.createWindowScope({
    parentScopeId: parentScopeId,
    componentCode: componentCode,
    windowCode: windowCode,
    series: 'smartclient'
  })
  isc.setAutoDraw(false)
  isc.Log.setDefaultPriority(3)
  isc.Log.setLogPriority(isc.Log.getClassName(), 5)
  var _this = this
  if (languageCode) {
    var resourcePackage = sandbox.getService(
      'vjs.framework.extension.ui.adapter.resourcepackage'
    )
    resourcePackage.setWindowCurrentResourceCode(
      scopeId,
      null,
      componentCode,
      languageCode
    )
  }
  componentUtil.renderComponent.call(
    _this,
    componentCode,
    windowCode,
    scopeId,
    function (component, scopeId) {
      rendererCallback(component, scopeId)
      ScopeManager.openScope(scopeId)
      var setTitle = function (newTitle) {
        if (newTitle) document.title = newTitle
      }
      //处理窗体无法显示进度条的问题
      var ele =
        component && typeof component.getContentElement == 'function'
          ? component.getContentElement()
          : null
      var _title = ScopeManager.getWindowScope().getTitle()
      //链接地址打开时没有域信息，暂时通过window对象上的信息传递
      if (!window._$VPLATFORMCHANGETITLEIDEN) {
        if (_title && document.title != _title) {
          document.title = _title
        }
      } else {
        document.title = window._$VPLATFORMCHANGETITLEIDEN
      }
      var container = new WindowContainer({
        titleFunc: setTitle,
        scopeId: scopeId,
        componentCode: componentCode,
        windowCode: windowCode,
        title: _title,
        ele: ele ? ele.id : null
      })
      var windowContainerId = windowRelation.put(container)
      ScopeManager.closeScope()

      if (typeof renderedCallback == 'function') {
        renderedCallback(component, scopeId)
      }
      var viewLib = this
      var initComponent = function () {
        seajs.config({
          alias: { smartclient: 'itop/v3/publish/smartclient/' }
        })
        //				seajs.use("smartclient/allforsmartclientext",function(){
        //				});
        VMetrix.loadBundles(
          [
            'vjs.framework.extension.platform.init.view.schema.window.' +
              componentCode +
              '.' +
              windowCode,
            'vjs.framework.extension.platform.init.view.schema.component.' +
              componentCode
          ],
          function (bundles) {
            //VMetrix.useBundles(["itop/v3/publish/"+componentCode+"/"+windowCode+"/moduleLib-vjs"], function (bundles) {
            componentUtil.prepareComponent.call(
              _this,
              componentCode,
              windowCode,
              scopeId,
              inputParam,
              function () {
                viewLib.fireCallback()
                if (typeof initedCallback == 'function') {
                  initedCallback(component, scopeId)
                }
              },
              refComponents,
              function (exception) {
                exception.handle()
              },
              [
                {
                  'vjs.framework.extension.ui.adapter.dependency.smartclient':
                    null
                }
              ]
            )
          }
        )
      }
      setTimeout(initComponent, 10)
    },
    refComponents,
    function (exception) {
      var progressbar = sandbox.getService(
        'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
      )
      progressbar.hideProgress()
      exceptionHandler.handle(exception)
    },
    true
  )
  var progressbar = sandbox.getService(
    'vjs.framework.extension.ui.common.plugin.services.progressbar.ProgressBarUtil'
  )
  progressbar.hideProgress()
}

var callBackFunc = function (showChromePlugin) {
  return function (component, scopeId) {
    component.show()
    /**
     * 浏览器页面关闭前事件
     * */
    window.onbeforeunload = (function (param_scopeId) {
      return function () {
        var isError = null
        var success = function () {}
        var error = function () {
          isError = true
        }
        ScopeManager.openScope(param_scopeId)
        var windowScope = ScopeManager.getWindowScope()
        if (windowScope && windowScope.fireBeforeClose) {
          windowScope.fireBeforeClose(success, error)
        }
        ScopeManager.closeScope()
        if (isError) return isError
      }
    })(scopeId)
    /*var overflowVal = "auto";
			if(component.HeightSet && component.HeightSet == "AutoHeight" 
				&& component.LayoutType && component.LayoutType == "None"){
				overflowVal = "visible";
			}
			component.setParentContainer(window);
			if(!_layout){
				_layout = isc.VLayout.create({
				    width: "100%",
				    height: "100%",
				    align: "center",
				    layoutMargin: 0,
				    membersMargin:0,
					overflow:overflowVal,
				    autoDraw: false,
				    canFocus:true,
                    showFocusOutline:false,
				    defaultLayoutAlign:"center",
				    contents:''
				});
			}
			_layout.removeMembers(_layout.getMembers());
			var	_canvas = isc.Canvas.create({
				ID:"$RootContainer",
				width:component.Width,
				canFocus:true,
				overflow:overflowVal,
                showFocusOutline:false,
				height:'*',
				tabIndex:isc.JGComponent.getComponentIndex(component.getId()),
				children:[component],
				contents:''
			});
			if(showChromePlugin){
				var plugin = createChromePluginCanvas();
				_layout.addMember(plugin);
				component.on("destroy",function(){
					_layout.removeMember(plugin);
				});
			}
			_layout.addMember(component);*/
  }
}

/*var createChromePluginCanvas = function(){
		return isc.Canvas.create({
			autoDraw:false,
			height:30,
			contents:"<div style=\"background:#FEFBC6;border:#C8CD7B solid 1px;text-align:center;padding:6px 0;color:#000;font-size:14px;z-index:999999;margin:0px 0;\">您当前的IE浏览器版本低于9.0，为取得最佳效果，建议您安装Chrome Frame，点击<a href=\"module-operation!executeOperation?operation=ChromeFrameGetter\" style=\"color:#00F;\">此处下载</a>！</div>"
		});
	}*/

exports.execute = execute
