!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'),
      require('Vue')
    )
  else if ('function' == typeof define && define.amd)
    define(['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9', 'Vue'], t)
  else {
    var o =
      'object' == typeof exports
        ? t(
            require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'),
            require('Vue')
          )
        : t(e['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'], e.Vue)
    for (var i in o) ('object' == typeof exports ? exports : e)[i] = o[i]
  }
})(
  'undefined' != typeof self ? self : this,
  function (
    __WEBPACK_EXTERNAL_MODULE_9E2R__,
    __WEBPACK_EXTERNAL_MODULE_lRwf__
  ) {
    return (function (e) {
      function t(i) {
        if (o[i]) return o[i].exports
        var n = (o[i] = { i: i, l: !1, exports: {} })
        return e[i].call(n.exports, n, n.exports, t), (n.l = !0), n.exports
      }
      var o = {}
      return (
        (t.m = e),
        (t.c = o),
        (t.d = function (e, o, i) {
          t.o(e, o) ||
            Object.defineProperty(e, o, {
              configurable: !1,
              enumerable: !0,
              get: i
            })
        }),
        (t.n = function (e) {
          var o =
            e && e.__esModule
              ? function () {
                  return e.default
                }
              : function () {
                  return e
                }
          return t.d(o, 'a', o), o
        }),
        (t.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t)
        }),
        (t.p = ''),
        t((t.s = 'JkW7'))
      )
    })({
      '0Gnm': function (e, t, o) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = o('dP9W'),
          n = (function (e) {
            return e && e.__esModule ? e : { default: e }
          })(i)
        t.default = n.default
      },
      '1bS9': function (e, t, o) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = function () {
            var e = this,
              t = e.$createElement,
              o = e._self._c || t
            return o(
              'ul',
              { class: [e.prefixCls + '-list'] },
              e._l(e.files, function (t, i) {
                return o(
                  'li',
                  { key: i, class: e.fileCls(t) },
                  [
                    o(
                      'span',
                      [
                        o('Icon', { attrs: { type: e.format(t) } }),
                        e._v('\n      ' + e._s(t.name) + '\n    ')
                      ],
                      1
                    ),
                    e._v(' '),
                    o('Icon', {
                      directives: [
                        {
                          name: 'show',
                          rawName: 'v-show',
                          value: 'finished' === t.status,
                          expression: "file.status === 'finished'"
                        }
                      ],
                      class: [e.prefixCls + '-list-remove'],
                      attrs: { type: 'ios-close' },
                      nativeOn: {
                        click: function (o) {
                          e.handleRemove(t)
                        }
                      }
                    }),
                    e._v(' '),
                    o(
                      'transition',
                      { attrs: { name: 'fade' } },
                      [
                        t.showProgress
                          ? o('i-progress', {
                              attrs: {
                                'stroke-width': 2,
                                'percent': e.parsePercentage(t.percentage),
                                'status':
                                  'finished' === t.status && t.showProgress
                                    ? 'success'
                                    : 'normal'
                              }
                            })
                          : e._e()
                      ],
                      1
                    )
                  ],
                  1
                )
              })
            )
          },
          n = []
        ;(t.render = i), (t.staticRenderFns = n)
      },
      '3LZw': function (e, t, o) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = o('WtFz'),
          n = (function (e) {
            return e && e.__esModule ? e : { default: e }
          })(i)
        t.default = n.default
      },
      '6lIR': function (e, t) {},
      '9E2R': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_9E2R__
      },
      'JkW7': function (e, t, o) {
        'use strict'
        function i(e) {
          return e && e.__esModule ? e : { default: e }
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var n = o('3LZw'),
          r = i(n)
        i(o('lRwf')).default.component(r.default.name, r.default),
          (t.default = { vuiUpload: r.default })
      },
      'OsfH': function (e, t, o) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = function () {
            var e = this,
              t = e.$createElement,
              o = e._self._c || t
            return o(
              'div',
              [
                o(
                  'div',
                  {
                    class: { 'vui-upload-drag': 'drag' === e.type },
                    attrs: { id: e.uploadId }
                  },
                  [e._t('default')],
                  2
                ),
                e._v(' '),
                e.showUploadList
                  ? o('vui-upload-list', {
                      attrs: { files: e.fileList },
                      on: { 'on-file-remove': e.handleRemove }
                    })
                  : e._e()
              ],
              1
            )
          },
          n = []
        ;(t.render = i), (t.staticRenderFns = n)
      },
      'WtFz': function (e, t, o) {
        'use strict'
        function i(e) {
          o('6lIR')
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var n = o('aFcE'),
          r = o.n(n)
        for (var s in n)
          'default' !== s &&
            (function (e) {
              o.d(t, e, function () {
                return n[e]
              })
            })(s)
        var a = o('OsfH'),
          l = (o.n(a), o('XyMi')),
          u = i,
          f = Object(l.a)(
            r.a,
            a.render,
            a.staticRenderFns,
            !1,
            u,
            'data-v-78669dbe',
            null
          )
        t.default = f.exports
      },
      'XyMi': function (e, t, o) {
        'use strict'
        function i(e, t, o, i, n, r, s, a) {
          e = e || {}
          var l = typeof e.default
          ;('object' !== l && 'function' !== l) || (e = e.default)
          var u = 'function' == typeof e ? e.options : e
          t && ((u.render = t), (u.staticRenderFns = o), (u._compiled = !0)),
            i && (u.functional = !0),
            r && (u._scopeId = r)
          var f
          if (
            (s
              ? ((f = function (e) {
                  ;(e =
                    e ||
                    (this.$vnode && this.$vnode.ssrContext) ||
                    (this.parent &&
                      this.parent.$vnode &&
                      this.parent.$vnode.ssrContext)),
                    e ||
                      'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                      (e = __VUE_SSR_CONTEXT__),
                    n && n.call(this, e),
                    e &&
                      e._registeredComponents &&
                      e._registeredComponents.add(s)
                }),
                (u._ssrRegister = f))
              : n &&
                (f = a
                  ? function () {
                      n.call(this, this.$root.$options.shadowRoot)
                    }
                  : n),
            f)
          )
            if (u.functional) {
              u._injectStyles = f
              var d = u.render
              u.render = function (e, t) {
                return f.call(t), d(e, t)
              }
            } else {
              var c = u.beforeCreate
              u.beforeCreate = c ? [].concat(c, f) : [f]
            }
          return { exports: e, options: u }
        }
        t.a = i
      },
      'aFcE': function (module, exports, __webpack_require__) {
        'use strict'
        function _interopRequireDefault(e) {
          return e && e.__esModule ? e : { default: e }
        }
        Object.defineProperty(exports, '__esModule', { value: !0 })
        var _index = __webpack_require__('0Gnm'),
          _index2 = _interopRequireDefault(_index),
          _v3Vdk = __webpack_require__('9E2R'),
          _v3Vdk2 = _interopRequireDefault(_v3Vdk)
        exports.default = {
          mixins: [
            _v3Vdk2.default.vue.mixins.DatasourceMixin({
              prop: { name: 'dataSource' }
            })
          ],
          name: 'vuiUpload',
          components: { vuiUploadList: _index2.default },
          props: {
            fileIdField: { type: String },
            fileNameField: { type: String },
            fileSizeField: { type: String },
            maxSize: { type: Number, default: 3072 },
            multiple: { type: Boolean, default: !1 },
            showUploadList: { type: Boolean, default: !0 },
            format: { type: Array },
            type: { type: String, default: 'select' }
          },
          data: function () {
            return {
              uploadId:
                'vui_m_upload_' +
                new Date().getTime() +
                Math.floor(1e3 * Math.random()),
              fileInfolist: [],
              extensions: '',
              fileList: []
            }
          },
          methods: {
            initUploader: function initUploader() {
              var control_obj = this
              this.getFormat()
              var uploader = new plupload.Uploader({
                runtimes: 'html5,flash,html4',
                browse_button: this.uploadId,
                url: 'module-operation!executeOperation?operation=FileUpload&ajaxRequest=true',
                flash_swf_url: '../../static/js/Moxie.swf',
                multipart_params: {},
                multi_selection: !(!this.multiple && 'drag' !== this.type),
                filters: {
                  mime_types: [
                    { title: 'files', extensions: control_obj.extensions }
                  ],
                  max_file_size: this.maxSize + 'kb'
                },
                init: {
                  FilesAdded: function (e, t) {
                    e.start()
                    for (var o = 0; o < t.length; o++) {
                      var i = t[o].percent,
                        n = t[o].name,
                        r = 5 == t[o].status ? 'finished' : 'uploading',
                        s = t[o].id,
                        a = t[o].size
                      control_obj.fileList.push({
                        name: n,
                        percentage: i,
                        status: r,
                        showProgress: !0,
                        id: s,
                        size: a
                      })
                    }
                    control_obj.$emit('on-fileselected')
                  },
                  UploadProgress: function (e, t) {
                    control_obj._uploadProgress(e, t)
                  },
                  FileUploaded: function FileUploaded(
                    uploader,
                    file,
                    responseObject
                  ) {
                    try {
                      var response = eval('(' + responseObject.response + ')')
                      file.fileIdIden = response.id
                    } catch (e) {}
                    for (
                      var _loop = function (e) {
                          file.id == control_obj.fileList[e].id &&
                            ((control_obj.fileList[e].status =
                              5 == file.status ? 'finished' : 'uploading'),
                            (control_obj.fileList[e].fileIdIden = response.id),
                            setTimeout(function () {
                              control_obj.fileList[e].showProgress = !1
                            }, 500))
                        },
                        i = 0;
                      i < control_obj.fileList.length;
                      i++
                    )
                      _loop(i)
                    uploader.uploadFileInfo.push(file)
                  },
                  UploadComplete: function (e, t) {
                    var o = []
                    control_obj.dataSource.splice(
                      0,
                      control_obj.dataSource.length
                    )
                    for (var i = 0; i < control_obj.fileList.length; i++) {
                      var n = control_obj.fileList[i],
                        r = {}
                      ;(r[control_obj.fileIdField] = n.fileIdIden),
                        (r[control_obj.fileNameField] = n.name),
                        (r[control_obj.fileSizeField] = n.size),
                        (r.id = n.id),
                        o.push(r),
                        control_obj.dataSource.push(r)
                    }
                    ;(control_obj.fileInfolist = o),
                      (e.uploadFileInfo = []),
                      control_obj.$emit('on-fileupload', o)
                  },
                  Error: function (e, t) {
                    var o = t.file.name,
                      i =
                        -1 != o.indexOf('.')
                          ? '类型为' +
                            o.substring(o.indexOf('.') + 1, o.length) +
                            '的文件'
                          : '该类型的文件[' + o + ']',
                      n = {
                        '-100': '上传失败.',
                        '-200': '网络异常.',
                        '-300': '文件读取失败.',
                        '-400': '网络安全异常.',
                        '-500': '初始化失败.',
                        '-600':
                          '对不起，上传的文件[' +
                          t.file.name +
                          ']大小超过限制，上传的文件大小不能超过' +
                          control_obj.maxSize / 1024 +
                          'M.',
                        '-601': '对不起，不允许上传' + i + '.',
                        '-602': '执行失败.',
                        '-700': '图片格式错误.',
                        '-702': '文件大小超过可处理范围，请分批上传.'
                      },
                      r = n[t.code]
                    void 0 != r ? alert(r) : alert(t.message)
                  }
                }
              })
              return (
                uploader.init(),
                (uploader.is_upload_data = !1),
                (uploader.uploadFileInfo = []),
                uploader
              )
            },
            _uploadProgress: function (e, t) {
              for (
                var o = (e.total.percent, t.percent), i = 0;
                i < this.fileList.length;
                i++
              )
                t.id == this.fileList[i].id && (this.fileList[i].percentage = o)
            },
            getFormat: function () {
              this.format
                ? (this.extensions = this.format.toString())
                : (this.extensions = '*')
            },
            handleRemove: function (e) {
              var t = this.fileList
              t.splice(t.indexOf(e), 1)
              for (var o = 0; o < this.dataSource.length; o++)
                e.id == this.dataSource[o].id && this.dataSource.splice(o, 1)
              for (var i = 0; i < this.fileInfolist.length; i++)
                e.id == this.fileInfolist[i].id &&
                  this.$emit('on-clearfile', this.fileInfolist[i])
            }
          },
          mounted: function () {
            this.initUploader()
          }
        }
      },
      'dP9W': function (e, t, o) {
        'use strict'
        function i(e) {
          o('gM34')
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var n = o('t4wX'),
          r = o.n(n)
        for (var s in n)
          'default' !== s &&
            (function (e) {
              o.d(t, e, function () {
                return n[e]
              })
            })(s)
        var a = o('1bS9'),
          l = (o.n(a), o('XyMi')),
          u = i,
          f = Object(l.a)(
            r.a,
            a.render,
            a.staticRenderFns,
            !1,
            u,
            'data-v-60c033fe',
            null
          )
        t.default = f.exports
      },
      'gM34': function (e, t) {},
      'lRwf': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_lRwf__
      },
      't4wX': function (e, t, o) {
        'use strict'
        function i(e, t, o) {
          return (
            t in e
              ? Object.defineProperty(e, t, {
                  value: o,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0
                })
              : (e[t] = o),
            e
          )
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        t.default = {
          name: 'vuiUploadList',
          components: {},
          props: {
            files: {
              type: Array,
              default: function () {
                return []
              }
            }
          },
          data: function () {
            return { prefixCls: 'ivu-upload' }
          },
          methods: {
            fileCls: function (e) {
              return [
                'ivu-upload-list-file',
                i({}, 'ivu-upload-list-file-finish', 'finished' === e.status)
              ]
            },
            handleRemove: function (e) {
              this.$emit('on-file-remove', e)
            },
            format: function (e) {
              var t = e.name.split('.').pop().toLocaleLowerCase() || '',
                o = 'document'
              return (
                ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(t) > -1 &&
                  (o = 'android-image'),
                [
                  'mp4',
                  'm3u8',
                  'rmvb',
                  'avi',
                  'swf',
                  '3gp',
                  'mkv',
                  'flv'
                ].indexOf(t) > -1 && (o = 'android-film'),
                ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(t) > -1 &&
                  (o = 'ios-musical-notes'),
                ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(t) >
                  -1 && (o = 'android-document'),
                ['numbers', 'csv', 'xls', 'xlsx'].indexOf(t) > -1 &&
                  (o = 'stats-bars'),
                ['keynote', 'ppt', 'pptx'].indexOf(t) > -1 &&
                  (o = 'ios-videocam'),
                o
              )
            },
            parsePercentage: function (e) {
              return parseInt(e, 10)
            }
          }
        }
      }
    })
  }
)
