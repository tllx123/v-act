import { ViewLib as viewLib } from '@v-act/vjs.framework.extension.publish.window.render.smartclient.viewlib'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { WindowSchema } from '@v-act/schema-types'
import { WidgetContextProps } from '@v-act/widget-context'

const _getRandomNum = function () {
  const random = Math.random() * 10000
  return parseInt(random + '')
}

const init = function (params: {
  componentCode: string
  windowCode: string
  ruleDefines: { [ruleCode: string]: any }
  funcDefines: { [funcCode: string]: any }
  widgetDefines: { [funcCode: string]: any }
  context: WidgetContextProps
  winJson: WindowSchema
  router: any
  stackInfo: any
  scopeId: string
}) {
  const {
    componentCode,
    windowCode,
    scopeId,
    router,
    winJson,
    ruleDefines,
    funcDefines,
    stackInfo,
    context
  } = params
  const query = router.query
  const param = JSON.parse(query.param || '{}')
  const entityOperation = {
    insert: context.insertDataFunc,
    update: context.updateDataFunc,
    remove: context.removeDataFunc,
    clear: context.clearDataFunc
  }
  scopeManager.getScope(scopeId).markInited()
  viewLib.init({
    paramCfg: {
      skinType: 'default',
      runningMode: 'test',
      debug: false,
      debugPort: '',
      devId: '',
      contextPath: '',
      refComponents: {},
      showChromePlugin: false
    },
    languageCode: '',
    scopeId: scopeId,
    componentCode,
    windowCode,
    componentPackMappingDatas: {},
    envirmentContext: {
      optimizeLink: true,
      isEncryptToken: false,
      ExceptionInstanceIden: 'vxl0b2bdLP7aSIRoZJlf1Q__',
      CompatibleMode: true
    },
    inputParam: {
      variable: Object.assign(
        {
          windowCode,
          componentCode,
          workspaceKey: ''
        },
        param
      )
    },
    winDatas: winJson,
    rendered: (sId: string) => {
      const scope = scopeManager.getScope(sId)
      scope.set('ruleDefines', ruleDefines)
      scope.set('funcDefines', funcDefines)
      const { thisLevel } = stackInfo
      const windowScope = scopeManager.getWindowScope()
      windowScope.set(
        'dialogWindowHandler',
        (params: {
          componentCode: string
          windowCode: string
          title: string
          param: { [code: string]: any }
          rendered: (scopeId: string) => void
          closed: (...args: any[]) => any
        }) => {
          let { componentCode, windowCode, title, param, rendered, closed } =
            params
          param = param || {}
          const callbackId = '__dialog_win_close_cb_' + (thisLevel + 1)
          const renderedCallbackId =
            '__dialog_win_rendered_cb_' + (thisLevel + 1)
          window[callbackId] = (...args: any[]) => {
            try {
              if (typeof closed == 'function') {
                closed(...args)
              }
            } finally {
              delete window[callbackId]
            }
          }
          window[renderedCallbackId] = (sId: string) => {
            try {
              if (typeof rendered == 'function') {
                rendered(scopeId)
              }
            } finally {
              delete window[renderedCallbackId]
            }
          }
          router.push({
            pathname: `/${componentCode}/${windowCode}`,
            query: {
              modal: thisLevel + 1,
              param: JSON.stringify(param),
              title: title ? title : '',
              v: _getRandomNum()
            }
          })
        }
      )
      windowScope.set(
        'currentWindowHandler',
        (
          componentCode: string,
          windowCode: string,
          title: string,
          param: { [code: string]: any }
        ) => {
          param = param || {}
          router.push({
            pathname: `/${componentCode}/${windowCode}`,
            query: {
              modal: thisLevel,
              param: JSON.stringify(param),
              title: title ? title : '',
              v: _getRandomNum()
            }
          })
        }
      )
      windowScope.set('dataSourceHandler', entityOperation)
      windowScope.set('dailogWindowCloseHandler', (...args: any[]) => {
        const closeHandlerId = '__dialog_win_close_handler_' + thisLevel
        const handler = window[closeHandlerId]
        if (handler) {
          try {
            handler(...args)
          } finally {
            delete window[closeHandlerId]
          }
        }
      })
      if (router.query) {
        let modal = router.query.modal
        const rendercb = window['__dialog_win_rendered_cb_' + modal]
        if (rendercb) {
          try {
            rendercb(scopeId)
          } finally {
            delete window['__dialog_win_rendered_cb_' + modal]
          }
        }
      }
    }
  })
}

export { init }
