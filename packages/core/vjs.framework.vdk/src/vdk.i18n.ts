;(function (ctx) {
  var vdk = ctx.vdk
  if (!vdk) {
    vdk = {}
    ctx.vdk = vdk
  }
  if (!vdk.i18n) {
    vdk.i18n = {
      I18N_POOL: {},
      /**
       * @param params Object 参数信息
       * {
       * 		code	:	String	多语言项编号
       * }
       */
      get: function (params) {
        var code = params.code
        if (vdk.i18n.I18N_POOL.hasOwnProperty(code)) {
          return vdk.i18n.I18N_POOL[code]
        }
        return params.defaultVal || ''
      },
      /**
       * 获取当前使用的多语言
       */
      getLanguage: function () {
        var language
        if (VMetrix && VMetrix._data && VMetrix._data.vjsContext) {
          language = VMetrix._data.vjsContext.language
        }
        return language || 'zh-CN'
      },
      /**
       * 是否处于指定语种中
       */
      isUseLanguage: function (tag) {
        var language = this.getLanguage()
        return tag == language.split('-')[0]
      },
      /**
       * @param	params	Object	参数信息
       */
      put: function (params) {
        if (params) {
          for (var code in params) {
            if (params.hasOwnProperty(code)) {
              vdk.i18n.I18N_POOL[code] = params[code]
            }
          }
        }
      }
    }
  }
})(this)
