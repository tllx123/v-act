!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9', [], t)
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'] = t())
    : (e['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'] = t())
})('undefined' != typeof self ? self : this, function () {
  return (function (e) {
    function t(n) {
      if (r[n]) return r[n].exports
      var o = (r[n] = { i: n, l: !1, exports: {} })
      return e[n].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
    }
    var r = {}
    return (
      (t.m = e),
      (t.c = r),
      (t.d = function (e, r, n) {
        t.o(e, r) ||
          Object.defineProperty(e, r, {
            configurable: !1,
            enumerable: !0,
            get: n
          })
      }),
      (t.n = function (e) {
        var r =
          e && e.__esModule
            ? function () {
                return e.default
              }
            : function () {
                return e
              }
        return t.d(r, 'a', r), r
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
      }),
      (t.p = ''),
      t((t.s = 'JkW7'))
    )
  })({
    '2KSk': function (e, t, r) {
      'use strict'
      function n() {
        function e() {
          return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1)
        }
        return e() + e() + e() + e() + e() + e() + e() + e()
      }
      function o(e) {
        if (e && e.length > 0)
          for (var t = 0, r = e.length; t < r; t++) {
            var n = e[t]
            !0 === n._metadata_.isCurrent &&
              (n._metadata_ = {
                isCurrent: !1,
                isSelected: !1,
                dsName: n._metadata_.dsName
              })
          }
        return n
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e
              },
        i = r('g9f8'),
        c = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = {
        setCurrentRecord: function (e) {
          if (!(!e | !e.record)) {
            var t = e.vueObj
            if (t) {
              var r = e.record
              t.markCurrent(r)
            } else if (e.entityRecords && e.entityRecords.length > 0) {
              var n = e.record.id
              if (!n) throw new Error('无法读取记录的id属性，不能设置为当前行')
              if (e.record._metadata_ && e.record._metadata_.isCurrent) return
              for (var o = e.entityRecords, a = 0, i = o.length; a < i; a++) {
                var r = o[a]
                if (void 0 == r._metadata_)
                  throw new Error('实体记录存在非源数据的记录，请检查.')
                n == r.id
                  ? ((r._metadata_ = {
                      isCurrent: !0,
                      isSelected: !0,
                      dsName: r._metadata_.dsName
                    }),
                    (o.current = r))
                  : !0 === r._metadata_.isCurrent &&
                    (r._metadata_ = {
                      isCurrent: !1,
                      isSelected: !1,
                      dsName: r._metadata_.dsName
                    })
              }
            }
          }
        },
        getSelectedRecord: function (e) {
          var t = []
          if ('object' == (void 0 === e ? 'undefined' : a(e))) {
            var r = e.vueObj,
              n = e.records
            if (r) return r.getSelectedRecords()
            if (r && n && n.length > 0) {
              var o = e.records[0]._metadata_.dsName,
                i = c.default.getSelectedRecords(r, o)
              if (i && i.length > 0) {
                for (var s = [], l = 0, d = i.length; l < d; l++)
                  s.push(i[l].id)
                for (var l = 0, d = n.length; l < d; l++) {
                  var f = n[l]
                  ;-1 != s.indexOf(f.id) && t.push(f)
                }
              }
            } else if (e.length > 0)
              for (var l = 0, u = e.length; l < u; l++) {
                var f = e[l],
                  v = f._metadata_
                v && v.isSelected && t.push(f)
              }
          }
          return t
        },
        getCurrentRecord: function (e) {
          if ('object' == (void 0 === e ? 'undefined' : a(e))) {
            var t = e.vueObj,
              r = e.records
            if (t) return t.getCurrentRecord()
            if (t && r && r.length > 0) {
              var n = e.records[0],
                o = n._metadata_.dsName,
                i = c.default.getCurrentRecord(t, o)
              if (i)
                for (var s = 0, l = r.length; s < l; s++) {
                  var n = r[s]
                  if (n.id == i.id) return n
                }
            } else if (e.length > 0)
              for (var s = 0, d = e.length; s < d; s++) {
                var i = e[s],
                  f = i._metadata_
                if (f && !0 === f.isCurrent) return (e.current = i), i
              }
          }
          return null
        },
        setSelectRecords: function (e) {
          if (
            'object' == (void 0 === e ? 'undefined' : a(e)) &&
            e.records &&
            e.records.length > 0
          ) {
            var t = e.vueObj,
              r = !0 === e.isSelect,
              n = e.records
            if (t) t.markSelected(n)
            else
              for (var o = 0, i = n.length; o < i; o++) {
                var c = n[o],
                  s = c._metadata_
                s && 1 != s.isSelected && (c._metadata_.isSelected = r)
              }
          }
        },
        isSelected: function (e) {
          var t = e.vueObj
          if (t && e.record) return t.isSelected(e.record)
          var r = e._metadata_
          return r && r.isSelected
        },
        isCurrent: function (e) {
          var t = e.vueObj
          if (t && e.record) return t.isCurrent(e.record)
          var r = e._metadata_
          return r && r.isCurrent
        },
        insertRecords: function (e) {
          if (e && e.records) {
            for (var t = e.records, r = {}, a = 0, i = t.length; a < i; a++) {
              var c = t[a]
              c.id || (c.id = n())
              var s = a == i - 1
              ;(c._metadata_ = { isCurrent: s, isSelected: s }), s && (r = c)
            }
            var l = e.entityRecords
            l && l.length > 0 && o(l), l.push.apply(l, t), (l.current = r)
          }
        },
        deleteRecords: function (e) {
          if (
            e &&
            e.records &&
            e.records.length > 0 &&
            e.entityRecords &&
            e.entityRecords.length > 0
          ) {
            for (
              var t = null, r = [], n = e.records, a = 0, i = n.length;
              a < i;
              a++
            ) {
              var c = n[a].id
              !0 === n[a]._metadata_.isCurrent && (t = c), r.push(c)
            }
            for (var s = e.entityRecords, a = 0; a < s.length; a++) {
              var l = s[a].id
              ;-1 != r.indexOf(l) && (s.splice(a, 1), a--)
            }
            null != t &&
              (s.length > 0
                ? (o(s),
                  (s[0]._metadata_ = {
                    isCurrent: !0,
                    isSelected: !0,
                    dsName: s[0]._metadata_.dsName
                  }),
                  (s.current = s[0]))
                : (s.current = []))
          }
        },
        updateRecords: function (e) {
          if (e && e.records && e.records.length > 0) {
            for (var t = e.records, r = {}, n = 0, o = t.length; n < o; n++) {
              var a = t[n]
              r[a.id] = a
            }
            for (var i = e.entityRecords, n = 0, o = i.length; n < o; n++) {
              var a = i[n]
              if (r[a.id]) {
                var c = r[a.id]
                for (var s in c)
                  '_metadata_' != s && c.hasOwnProperty(s) && (a[s] = c[s])
              }
            }
          }
        },
        clearRecordDatas: function (e) {
          if (void 0 != e && e.length > 0)
            for (var t = 0, r = e.length; t < r; t++) {
              var n = e[t]
              if (n)
                for (var o in n)
                  n.hasOwnProperty(o) &&
                    'id' != o &&
                    '_metadata_' != o &&
                    (n[o] = null)
            }
        },
        markMultipleDs: function (e) {
          var t = e.vueObj
          e.records
          t && t.markDatasourceMultipleSelect()
        }
      }
    },
    'ATBs': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 }),
        (t.default = {
          _toLoadVjsList: [],
          _loadingVjsList: [],
          readyToLoad: !0,
          _isRunInV3Service: function () {
            return window.VMetrix && window.VMetrix.loadBundles
          },
          _getWindowScope: function () {
            var e = window.VPlatformScope
            return e && e.length > 0 ? e[e.length - 1] : null
          },
          loadVjs: function (e) {
            var t = this
            return new Promise(function (r, n) {
              t._isRunInV3Service()
                ? (t._toLoadVjsList.push({ vjsList: e, resolve: r, reject: n }),
                  t.readyToLoad &&
                    setTimeout(function () {
                      for (
                        var e = window.VMetrix,
                          r = [],
                          n = 0,
                          o = t._toLoadVjsList.length;
                        n < o;
                        n++
                      ) {
                        var a = t._toLoadVjsList[n]
                        t._loadingVjsList.push(a)
                        var i = a.vjsList
                        i = 'string' == typeof i ? [i] : i
                        for (var c = 0, s = i.length; c < s; c++) {
                          var l = i[c]
                          ;-1 == r.indexOf(l) && r.push(l)
                        }
                      }
                      t._toLoadVjsList = []
                      var d = e.sandbox.create({ extensions: r })
                      d.active().done(
                        function () {
                          t.readyToLoad = !0
                          for (
                            var e = 0, r = t._loadingVjsList.length;
                            e < r;
                            e++
                          ) {
                            t._loadingVjsList[e].resolve(d)
                          }
                          t._loadingVjsList = []
                        },
                        function (e) {
                          t.readyToLoad = !0
                          for (
                            var r = 0, n = t._loadingVjsList.length;
                            r < n;
                            r++
                          ) {
                            t._loadingVjsList[r].reject(e)
                          }
                          t._loadingVjsList = []
                        }
                      )
                    }, 1),
                  (t.readyToLoad = !1))
                : n(new Error('未运行在V3服务内，无法执行操作.'))
            })
          },
          loadVjsSync: function (e, t, r) {
            if (!this._isRunInV3Service())
              throw Error('未运行在V3服务内，无法执行操作.')
            var n = window.VMetrix,
              o = n.sandbox.create({ extensions: e })
            o.active().done(
              function () {
                'function' == typeof t && t(o)
              },
              function (e) {
                'function' == typeof r && r(e)
              }
            )
          },
          assertParamDef: function (e, t) {
            return !(!e || !e.hasOwnProperty(t))
          },
          assertNotNull: function (e, t) {
            if (this.assertParamDef(e, t)) {
              var r = e[t]
              return null !== r && void 0 !== r
            }
            return !1
          }
        })
    },
    'Anbr': function (e, t, r) {
      'use strict'
      function n() {
        return (
          'micromessenger' ==
          navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
        )
      }
      function o() {
        return 'DingTalk' == navigator.userAgent.match(/DingTalk/i)
      }
      function a() {
        return 'Android' == navigator.userAgent.match(/Android/i)
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var i = r('ATBs'),
        c = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(i)
      t.default = {
        mediaCapture: {
          captureVideo: function (e, t) {
            var r = [
              'vjs.framework.extension.platform.services.native.mobile.mediacapture'
            ]
            c.default
              .loadVjs(r)
              .then(function (r) {
                var n = r.getService(
                  'vjs.framework.extension.platform.services.native.mobile.Mediacapture'
                )
                if (n) {
                  var o = function (r) {
                    r.length > 0 && 'string' == typeof r[0].fullPath
                      ? e(r[0].fullPath)
                      : t('获取视频路径失败')
                  }
                  n.captureVideo(o, t)
                } else alert('请在移动端使用拍摄视频服务')
              })
              .catch(function (e) {
                t(e)
              })
          }
        },
        imagePicker: {
          getPicture: function (e, t, r) {
            if ((r.maximumImagesCount || (r.maximumImagesCount = 9), n())) {
              var o = [
                'vjs.framework.extension.platform.services.native.mobile.image',
                'vjs.framework.extension.platform.native.weixin.image',
                'vjs.framework.extension.platform.services.domain.weixin.sdk.config'
              ]
              c.default
                .loadVjs(o)
                .then(function (t) {
                  var n = t.getService(
                    'vjs.framework.extension.platform.services.native.mobile.Image'
                  )
                  n
                    ? n.chooseImage({
                        sizeType: ['compressed'],
                        count: r.maximumImagesCount,
                        sourceType: ['album'],
                        successCallback: e
                      })
                    : alert('请在微信端使用拍照服务')
                })
                .catch(function (e) {
                  t(e)
                })
            } else {
              var o = [
                'vjs.framework.extension.platform.services.native.mobile.imagepicker'
              ]
              c.default
                .loadVjs(o)
                .then(function (n) {
                  var o = n.getService(
                    'vjs.framework.extension.platform.services.native.mobile.ImagePicker'
                  )
                  o
                    ? o.getPicture(e, t, r)
                    : alert('请在移动端使用相册选择服务')
                })
                .catch(function (e) {
                  t(e)
                })
            }
          }
        },
        camera: {
          getPicture: function (e, t, r) {
            if ((r.maximumImagesCount || (r.maximumImagesCount = 9), n())) {
              var o = [
                'vjs.framework.extension.platform.services.native.mobile.image',
                'vjs.framework.extension.platform.native.weixin.image',
                'vjs.framework.extension.platform.services.domain.weixin.sdk.config'
              ]
              c.default
                .loadVjs(o)
                .then(function (n) {
                  var o = n.getService(
                    'vjs.framework.extension.platform.services.native.mobile.Image'
                  )
                  if (o) {
                    var a = function (r) {
                      r && r.length > 0 ? e(r[0]) : t('拍照被取消')
                    }
                    o.chooseImage({
                      count: r.maximumImagesCount,
                      sizeType: ['compressed'],
                      sourceType: ['camera'],
                      successCallback: a
                    })
                  } else alert('请在微信端使用拍照服务')
                })
                .catch(function (e) {
                  t(e)
                })
            } else {
              var o = [
                'vjs.framework.extension.platform.services.native.mobile.camera'
              ]
              c.default
                .loadVjs(o)
                .then(function (n) {
                  var o = n.getService(
                    'vjs.framework.extension.platform.services.native.mobile.Camera'
                  )
                  o ? o.getPicture(e, t, r) : alert('请在移动端使用拍照服务')
                })
                .catch(function (e) {
                  t(e)
                })
            }
          }
        },
        fileUpload: {
          upload: function (e, t, r, n) {
            if (o() && a() && n && n.useCamera && 'image/*' == n.fileMimeType) {
              i = [
                'vjs.framework.extension.platform.native.dingding.filetransfer'
              ]
              c.default
                .loadVjs(i)
                .then(function (r) {
                  var o = r.getService(
                    'vjs.framework.extension.platform.service.native.dingding.Filetransfer'
                  )
                  o
                    ? o.uploadFiles(e, t, n)
                    : alert(
                        '加载vjs【vjs.framework.extension.platform.native.h5.filetransfer】失败,请检查'
                      )
                })
                .catch(function (e) {
                  r(e)
                })
            } else {
              var i = [
                'vjs.framework.extension.platform.native.h5.filetransfer'
              ]
              c.default
                .loadVjs(i)
                .then(function (r) {
                  var o = r.getService(
                    'vjs.framework.extension.platform.native.h5.Filetransfer'
                  )
                  o
                    ? o.uploadFiles(e, t, n)
                    : alert(
                        '加载vjs【vjs.framework.extension.platform.native.h5.filetransfer】失败,请检查'
                      )
                })
                .catch(function (e) {
                  r(e)
                })
            }
          }
        },
        fileTransfer: {
          filetransferUpload: function (e, t, r) {
            var o = []
            ;(o = n()
              ? ['vjs.framework.extension.platform.native.weixin.filetransfer']
              : [
                  'vjs.framework.extension.platform.services.native.mobile.fileoperation'
                ]),
              c.default
                .loadVjs(o)
                .then(function (o) {
                  var a
                  if (
                    (a = n()
                      ? o.getService(
                          'vjs.framework.extension.platform.native.weixin.Filetransfer'
                        )
                      : o.getService(
                          'vjs.framework.extension.platform.services.native.mobile.FileTransfer'
                        ))
                  ) {
                    var i = function (e, r) {
                      var n = { success: !0, errorCode: 0 }
                      e
                        ? e && e.errorCode
                          ? t(e, r)
                          : t(n, r)
                        : ((n.success = !1), (n.errorCode = 2))
                    }
                    if (n()) {
                      var c = null
                      r && (c = r.$root._$getScopeId()), a.uploadFiles(e, i, c)
                    } else a.filetransferUpload(e, i)
                  } else alert('请在移动端使用文件上传服务')
                })
                .catch(function (e) {
                  alert('App端文件上传失败：' + e)
                })
          }
        },
        geoLocation: {
          getCurrentPosition: function (e, t) {
            if (o()) {
              var r = [
                'vjs.framework.extension.platform.native.dingding.geolocation'
              ]
              c.default
                .loadVjs(r)
                .then(function (r) {
                  var n = r.getService(
                    'vjs.framework.extension.platform.service.native.mobile.Geolocation'
                  )
                  if (n) {
                    var o = function (t) {
                      var r = t.coords.latitude,
                        n = t.coords.longitude
                      e({ latitude: r, longitude: n })
                    }
                    n.getCurrentPosition(o, t)
                  } else alert('请在移动端使用获取地理位置服务')
                })
                .catch(function (e) {
                  errorCallback(e)
                })
            } else {
              var r = [
                'vjs.framework.extension.platform.services.native.mobile.geolocation'
              ]
              c.default
                .loadVjs(r)
                .then(function (r) {
                  var n = r.getService(
                    'vjs.framework.extension.platform.services.native.mobile.Geolocation'
                  )
                  if (n) {
                    var o = function (t) {
                      var r = t.coords.latitude,
                        n = t.coords.longitude
                      e({ latitude: r, longitude: n })
                    }
                    n.getCurrentPosition(o, t)
                  } else alert('请在移动端使用获取地理位置服务')
                })
                .catch(function (e) {
                  errorCallback(e)
                })
            }
          }
        },
        sdkConfig: {
          getDingTalkConfigObject: function (e, t, r) {
            if (o()) {
              var n = [
                'vjs.framework.extension.platform.native.dingding.sdk.config'
              ]
              c.default
                .loadVjs(n)
                .then(function (n) {
                  var o = n.getService(
                    'vjs.framework.extension.platform.service.native.sdk.config'
                  )
                  o
                    ? o.initConfig(t, r, e)
                    : 'function' == typeof r &&
                      r('请在移动端使用获取地理位置服务')
                })
                .catch(function (e) {
                  errorCallback(e)
                })
            }
          }
        },
        network: {
          getNetworkState: function (e, t) {
            var r
            ;(r = o()
              ? ['vjs.framework.extension.platform.native.dingding.network']
              : n()
              ? ['vjs.framework.extension.platform.native.weixin.network']
              : ['vjs.framework.extension.platform.native.cordova.network']),
              c.default.loadVjs(r).then(function (r) {
                r.getService(
                  'vjs.framework.extension.platform.service.native.Network'
                ).getNetworkState(e, t)
              })
          },
          registerNetworkStateListener: function (e) {
            var t
            ;(t = o()
              ? ['vjs.framework.extension.platform.native.dingding.network']
              : n()
              ? ['vjs.framework.extension.platform.native.weixin.network']
              : ['vjs.framework.extension.platform.native.cordova.network']),
              c.default.loadVjs(t).then(function (t) {
                t.getService(
                  'vjs.framework.extension.platform.service.native.Network'
                ).registerNetworkStateListener(e)
              })
          }
        }
      }
    },
    'HaNs': function (e, t, r) {
      'use strict'
      function n() {
        return (
          s._$V3GlobalDataStore$_ || (s._$V3GlobalDataStore$_ = {}),
          s._$V3GlobalDataStore$_
        )
      }
      function o(e, t) {
        var r = n()
        if (r.hasOwnProperty(e))
          throw new Error('全局数据已存在key: ' + e + ', 请检查.')
        r[e] = t
      }
      function a(e) {
        return n()[e]
      }
      function i(e, t) {
        n()[e] = t
      }
      function c(e) {
        return n().hasOwnProperty(e)
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var s = window
      t.default = { put: o, get: a, meger: i, exists: c, datas: n() }
    },
    'JkW7': function (e, t, r) {
      'use strict'
      function n(e) {
        return e && e.__esModule ? e : { default: e }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = r('2KSk'),
        a = n(o),
        i = r('dThJ'),
        c = n(i),
        s = r('HaNs'),
        l = n(s),
        d = r('fTHo'),
        f = n(d),
        u = r('vn7Q'),
        v = n(u),
        _ = r('g9f8'),
        m = n(_),
        p = r('Vcb0'),
        S = n(p),
        E = r('Anbr'),
        g = n(E)
      t.default = {
        ds: a.default,
        win: c.default,
        page: c.default,
        GLOBAL: l.default,
        webapi: f.default,
        vue: v.default,
        v3platform: m.default,
        res: S.default,
        mobile: g.default
      }
    },
    'RYcG': function (e, t) {
      e.exports = {
        O_RDONLY: 0,
        O_WRONLY: 1,
        O_RDWR: 2,
        S_IFMT: 61440,
        S_IFREG: 32768,
        S_IFDIR: 16384,
        S_IFCHR: 8192,
        S_IFBLK: 24576,
        S_IFIFO: 4096,
        S_IFLNK: 40960,
        S_IFSOCK: 49152,
        O_CREAT: 512,
        O_EXCL: 2048,
        O_NOCTTY: 131072,
        O_TRUNC: 1024,
        O_APPEND: 8,
        O_DIRECTORY: 1048576,
        O_NOFOLLOW: 256,
        O_SYNC: 128,
        O_SYMLINK: 2097152,
        O_NONBLOCK: 4,
        S_IRWXU: 448,
        S_IRUSR: 256,
        S_IWUSR: 128,
        S_IXUSR: 64,
        S_IRWXG: 56,
        S_IRGRP: 32,
        S_IWGRP: 16,
        S_IXGRP: 8,
        S_IRWXO: 7,
        S_IROTH: 4,
        S_IWOTH: 2,
        S_IXOTH: 1,
        E2BIG: 7,
        EACCES: 13,
        EADDRINUSE: 48,
        EADDRNOTAVAIL: 49,
        EAFNOSUPPORT: 47,
        EAGAIN: 35,
        EALREADY: 37,
        EBADF: 9,
        EBADMSG: 94,
        EBUSY: 16,
        ECANCELED: 89,
        ECHILD: 10,
        ECONNABORTED: 53,
        ECONNREFUSED: 61,
        ECONNRESET: 54,
        EDEADLK: 11,
        EDESTADDRREQ: 39,
        EDOM: 33,
        EDQUOT: 69,
        EEXIST: 17,
        EFAULT: 14,
        EFBIG: 27,
        EHOSTUNREACH: 65,
        EIDRM: 90,
        EILSEQ: 92,
        EINPROGRESS: 36,
        EINTR: 4,
        EINVAL: 22,
        EIO: 5,
        EISCONN: 56,
        EISDIR: 21,
        ELOOP: 62,
        EMFILE: 24,
        EMLINK: 31,
        EMSGSIZE: 40,
        EMULTIHOP: 95,
        ENAMETOOLONG: 63,
        ENETDOWN: 50,
        ENETRESET: 52,
        ENETUNREACH: 51,
        ENFILE: 23,
        ENOBUFS: 55,
        ENODATA: 96,
        ENODEV: 19,
        ENOENT: 2,
        ENOEXEC: 8,
        ENOLCK: 77,
        ENOLINK: 97,
        ENOMEM: 12,
        ENOMSG: 91,
        ENOPROTOOPT: 42,
        ENOSPC: 28,
        ENOSR: 98,
        ENOSTR: 99,
        ENOSYS: 78,
        ENOTCONN: 57,
        ENOTDIR: 20,
        ENOTEMPTY: 66,
        ENOTSOCK: 38,
        ENOTSUP: 45,
        ENOTTY: 25,
        ENXIO: 6,
        EOPNOTSUPP: 102,
        EOVERFLOW: 84,
        EPERM: 1,
        EPIPE: 32,
        EPROTO: 100,
        EPROTONOSUPPORT: 43,
        EPROTOTYPE: 41,
        ERANGE: 34,
        EROFS: 30,
        ESPIPE: 29,
        ESRCH: 3,
        ESTALE: 70,
        ETIME: 101,
        ETIMEDOUT: 60,
        ETXTBSY: 26,
        EWOULDBLOCK: 35,
        EXDEV: 18,
        SIGHUP: 1,
        SIGINT: 2,
        SIGQUIT: 3,
        SIGILL: 4,
        SIGTRAP: 5,
        SIGABRT: 6,
        SIGIOT: 6,
        SIGBUS: 10,
        SIGFPE: 8,
        SIGKILL: 9,
        SIGUSR1: 30,
        SIGSEGV: 11,
        SIGUSR2: 31,
        SIGPIPE: 13,
        SIGALRM: 14,
        SIGTERM: 15,
        SIGCHLD: 20,
        SIGCONT: 19,
        SIGSTOP: 17,
        SIGTSTP: 18,
        SIGTTIN: 21,
        SIGTTOU: 22,
        SIGURG: 16,
        SIGXCPU: 24,
        SIGXFSZ: 25,
        SIGVTALRM: 26,
        SIGPROF: 27,
        SIGWINCH: 28,
        SIGIO: 23,
        SIGSYS: 12,
        SSL_OP_ALL: 2147486719,
        SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION: 262144,
        SSL_OP_CIPHER_SERVER_PREFERENCE: 4194304,
        SSL_OP_CISCO_ANYCONNECT: 32768,
        SSL_OP_COOKIE_EXCHANGE: 8192,
        SSL_OP_CRYPTOPRO_TLSEXT_BUG: 2147483648,
        SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS: 2048,
        SSL_OP_EPHEMERAL_RSA: 0,
        SSL_OP_LEGACY_SERVER_CONNECT: 4,
        SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER: 32,
        SSL_OP_MICROSOFT_SESS_ID_BUG: 1,
        SSL_OP_MSIE_SSLV2_RSA_PADDING: 0,
        SSL_OP_NETSCAPE_CA_DN_BUG: 536870912,
        SSL_OP_NETSCAPE_CHALLENGE_BUG: 2,
        SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG: 1073741824,
        SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG: 8,
        SSL_OP_NO_COMPRESSION: 131072,
        SSL_OP_NO_QUERY_MTU: 4096,
        SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION: 65536,
        SSL_OP_NO_SSLv2: 16777216,
        SSL_OP_NO_SSLv3: 33554432,
        SSL_OP_NO_TICKET: 16384,
        SSL_OP_NO_TLSv1: 67108864,
        SSL_OP_NO_TLSv1_1: 268435456,
        SSL_OP_NO_TLSv1_2: 134217728,
        SSL_OP_PKCS1_CHECK_1: 0,
        SSL_OP_PKCS1_CHECK_2: 0,
        SSL_OP_SINGLE_DH_USE: 1048576,
        SSL_OP_SINGLE_ECDH_USE: 524288,
        SSL_OP_SSLEAY_080_CLIENT_DH_BUG: 128,
        SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG: 0,
        SSL_OP_TLS_BLOCK_PADDING_BUG: 512,
        SSL_OP_TLS_D5_BUG: 256,
        SSL_OP_TLS_ROLLBACK_BUG: 8388608,
        ENGINE_METHOD_DSA: 2,
        ENGINE_METHOD_DH: 4,
        ENGINE_METHOD_RAND: 8,
        ENGINE_METHOD_ECDH: 16,
        ENGINE_METHOD_ECDSA: 32,
        ENGINE_METHOD_CIPHERS: 64,
        ENGINE_METHOD_DIGESTS: 128,
        ENGINE_METHOD_STORE: 256,
        ENGINE_METHOD_PKEY_METHS: 512,
        ENGINE_METHOD_PKEY_ASN1_METHS: 1024,
        ENGINE_METHOD_ALL: 65535,
        ENGINE_METHOD_NONE: 0,
        DH_CHECK_P_NOT_SAFE_PRIME: 2,
        DH_CHECK_P_NOT_PRIME: 1,
        DH_UNABLE_TO_CHECK_GENERATOR: 4,
        DH_NOT_SUITABLE_GENERATOR: 8,
        NPN_ENABLED: 1,
        RSA_PKCS1_PADDING: 1,
        RSA_SSLV23_PADDING: 2,
        RSA_NO_PADDING: 3,
        RSA_PKCS1_OAEP_PADDING: 4,
        RSA_X931_PADDING: 5,
        RSA_PKCS1_PSS_PADDING: 6,
        POINT_CONVERSION_COMPRESSED: 2,
        POINT_CONVERSION_UNCOMPRESSED: 4,
        POINT_CONVERSION_HYBRID: 6,
        F_OK: 0,
        R_OK: 4,
        W_OK: 2,
        X_OK: 1,
        UV_UDP_REUSEADDR: 4
      }
    },
    'Vcb0': function (e, t, r) {
      'use strict'
      function n(e, t, r) {
        var n = r,
          a = r.split('/'),
          i = a[a.length - 1]
        if (
          void 0 !== window._$v3platform_runtime_env &&
          window._$v3platform_runtime_env
        )
          n = 'itop/common/extension/custom/' + t + '/' + e + '/' + i
        else if ('undefined' != typeof GlobalVariables) {
          var c = GlobalVariables.getServerUrl()
          n = c + '/itop/common/extension/custom/' + t + '/' + e + '/' + i
        } else
          void 0 !== window._$v3platform_preview_env &&
            window._$v3platform_preview_env &&
            (n = o + '/' + e + '/' + r.substring(r.indexOf('/')))
        return n
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var o = 'dependencies'
      t.default = { getWidgetResPath: n }
    },
    'dThJ': function (e, t, r) {
      'use strict'
      function n(e) {
        return e && e && e.$root && 'function' == typeof e.$root._$getScopeId
          ? e.$root._$getScopeId()
          : null
      }
      function o(e) {
        var t = function (t) {
          throw new Error(e)
        }
        if (a) t()
        else {
          var r = [
            'vjs.framework.extension.platform.services.browser',
            'vjs.framework.extension.platform.interface.scope'
          ]
          s.default.loadVjs(r).then(function (e) {
            t()
          })
        }
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var a,
        i =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e
              },
        c = r('ATBs'),
        s = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(c)
      t.default = {
        redirectTo: function (e) {
          if (!e || !e.componentCode || !e.windowCode)
            throw Error('构件编码或者窗体编码为空, 无法跳转.')
          this.render({
            type: 'currentContainer',
            componentCode: e.componentCode,
            windowCode: e.windowCode,
            params: e.params,
            context: e.context
          })
        },
        navigateTo: function (e) {},
        navigateBack: function (e) {},
        getParam: function (e) {
          var t, r
          'object' == (void 0 === e ? 'undefined' : i(e))
            ? ((t = e.key), (r = e.context))
            : (t = e)
          var n = void 0,
            o = [
              'vjs.framework.extension.platform.data.storage.runtime.param',
              'vjs.framework.extension.platform.interface.scope'
            ],
            a = void 0,
            c = function (e) {
              a = e
            }
          s.default.loadVjsSync(o, c)
          var l = a.getService(
              'vjs.framework.extension.platform.data.storage.runtime.param.WindowParam'
            ),
            d = a.getService(
              'vjs.framework.extension.platform.interface.scope.ScopeManager'
            ),
            f =
              r && r && r.$root && 'function' == typeof r.$root._$getScopeId
                ? r.$root._$getScopeId()
                : null
          return (
            l &&
              (n = d.createScopeHandler({
                scopeId: f,
                handler: function (e) {
                  return e.getInput(t)
                }
              })(l)),
            n
          )
        },
        render: function (e) {
          if (!e) return void console.warn('参数无效，已忽略.')
          var t,
            r = e.componentCode,
            n = e.windowCode,
            o = e.params ? e.params : {},
            a = { variable: o },
            i = (e.success, e.fail),
            c = e.title,
            l = e.context
          switch (e.type) {
            case 'currentContainer':
              ;(a.variable.formulaOpenMode = 'locationHref'),
                (t = function (e) {
                  e.browser.redirectModule({
                    componentCode: e.componentCode,
                    windowCode: e.windowCode,
                    params: { inputParam: e.windowInputParams }
                  })
                })
              break
            case 'currentWindow':
              t = function (e) {
                e.browser.redirectLocation({
                  componentCode: e.componentCode,
                  windowCode: e.windowCode,
                  title: e.title,
                  inputParam: e.windowInputParams
                })
              }
              break
            case 'newWindow':
              ;(a.variable.formulaOpenMode = 'dialog'),
                (t = function (e) {
                  e.browser.callBrowserWindow({
                    componentCode: e.componentCode,
                    windowCode: e.windowCode,
                    title: e.title,
                    inputParam: e.windowInputParams,
                    isBlock: !1,
                    winName: '_blank'
                  })
                })
              break
            default:
              throw new Error('不支持这种打开方式: ' + e.type)
          }
          var d = [
              'vjs.framework.extension.platform.services.browser',
              'vjs.framework.extension.platform.interface.scope'
            ],
            f = s.default.loadVjs(d),
            u =
              l && l.$root && 'function' == typeof l.$root._$getScopeId
                ? l.$root._$getScopeId()
                : null
          f.then(function (e) {
            var o = e.getService(
              'vjs.framework.extension.platform.services.browser.Browser'
            )
            if (o) {
              var i = e.getService(
                'vjs.framework.extension.platform.interface.scope.ScopeManager'
              )
              if ('function' == typeof t) {
                var s = {
                  componentCode: r,
                  windowCode: n,
                  title: c,
                  windowInputParams: a,
                  browser: o
                }
                i.createScopeHandler({ scopeId: u, handler: t })(s)
              }
            }
          }).catch(function (e) {
            i(e)
          })
        },
        redirectToElement: function (e) {
          if (e) {
            var t = e.componentCode,
              r = e.windowCode,
              a = e.context,
              i = e.el,
              c = e.fail
            t || o('构件编码不能为空, 请检查入参是否正确.'),
              r || o('窗体编码不能为空, 请检查入参是否正确.'),
              a || o('vue实例不能为空, 请检查入参数据是否正确.')
            var l
            i
              ? 'string' == typeof i
                ? document.getElementById(i)
                  ? (l = i)
                  : o('目标dom元素不存在，请检查入参数据是否正确.')
                : (i[0] && (i = i[0]),
                  (l = i.getAttribute('id')) ||
                    ((l = 'rootContainer_' + new Date().getTime()),
                    i.setAttribute('id', l)))
              : o('目标dom元素不存在，请检查入参数据是否正确.')
            var d = { variable: e.params },
              f = n(a),
              u = [
                'vjs.framework.extension.ui.adapter.dependency',
                'vjs.framework.extension.platform.services.view.relation',
                'vjs.framework.extension.platform.services.view.widget.common.action',
                'vjs.framework.extension.platform.interface.scope',
                'vjs.framework.extension.platform.data.storage.schema.param'
              ]
            s.default.loadVjs(u).then(function (e) {
              var n = e.getService(
                'vjs.framework.extension.platform.data.storage.schema.param.ApplicationParam'
              )
              if (n && 'function' == typeof n.getWindowMapping) {
                var o = n.getWindowMapping({ componentCode: t, windowCode: r })
                null != o && ((t = o.componentCode), (r = o.windowCode))
              }
              var a = e.getService(
                  'vjs.framework.extension.platform.services.view.relation.WindowContainer'
                ),
                i = e.getService(
                  'vjs.framework.extension.platform.services.view.relation.WindowContainerManager'
                ),
                s = e.getService(
                  'vjs.framework.extension.platform.services.view.widget.common.action.WidgetRenderer'
                ),
                u = e.getService(
                  'vjs.framework.extension.platform.interface.scope.ScopeManager'
                ),
                v = u.createWindowScope({
                  parentScopeId: f,
                  componentCode: t,
                  windowCode: r
                }),
                _ = u.getScope(v)
              _.setOpenMode('vuiWindowContainer')
              var m = new a({
                scopeId: v,
                componentCode: t,
                windowCode: r,
                windowType: 'ComponentContainer'
              })
              i.put(m)
              var p = function () {
                var n = function (e) {
                  var t,
                    n = u.getWindowScope(),
                    o = e[0],
                    a = e[1],
                    i = !1
                  if ('bootstrap_mobile' == n.getSeries()) {
                    if (((i = !0), !n.isSimpleDivWindow())) {
                      var c = n.getWidgets()
                      if (c)
                        for (var d in c) {
                          var v = c[d].type
                          if ('JGComponent' != v && 'JGMDiv' != v) {
                            i = !1
                            break
                          }
                        }
                      else i = !1
                    }
                    if (i) {
                      var m = document.createElement('div'),
                        p = document.createElement('div')
                      m.appendChild(p),
                        (t = 'ap_' + new Date().getTime()),
                        m.setAttribute('id', t),
                        document.getElementById(l).appendChild(m),
                        n.set('AssignRenderPlace', { dom: p })
                    } else
                      e = $(
                        '<script type="text/javascript">' +
                          o.innerHTML +
                          '</script>' +
                          a.innerHTML
                      )
                  }
                  s.executeComponentRenderAction(
                    'renderWindowToContainer',
                    e,
                    l,
                    !1
                  ),
                    s.executeComponentRenderAction(
                      'setParentContainerInfo',
                      r,
                      { scopeId: f, containerCode: l }
                    ),
                    i && document.getElementById(l).removeChild(a),
                    _.on(
                      u.EVENTS.DESTROY,
                      (function (e, t, r) {
                        return function () {
                          var n = document.getElementById(e)
                          try {
                            if (
                              (r && n.removeChild(document.getElementById(r)),
                              t && t.length > 0)
                            )
                              for (var o = 0, a = t.length; o < a; o++)
                                n.removeChild(t[o])
                          } catch (e) {}
                        }
                      })(l, e, t)
                    ),
                    _.set(
                      'RemoveModalFunc',
                      (function (e, t, r) {
                        return function () {
                          var n = document.getElementById(e)
                          try {
                            if (
                              (r && n.removeChild(document.getElementById(r)),
                              t && t.length > 0)
                            )
                              for (var o = 0, a = t.length; o < a; o++)
                                n.removeChild(t[o])
                          } catch (e) {}
                        }
                      })(l, e, t)
                    )
                }
                e.getService(
                  'vjs.framework.extension.ui.adapter.init.' +
                    u.getProperty('type') +
                    '.web.util'
                ).renderComponentById(t, r, d || {}, {
                  scopeId: v,
                  rendered: n,
                  error: c
                })
              }
              e.getService(
                'vjs.framework.extension.ui.adapter.dependency'
              ).loadResources(t, r, e, v, p, c)
            })
          }
        }
      }
    },
    'fTHo': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = r('ATBs'),
        o = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(n)
      t.default = {
        exec: function (e) {
          if (
            !o.default.assertNotNull(e, 'apiCode') ||
            !o.default.assertNotNull(e, 'componentCode')
          ) {
            var t = '调用后台webapi时，请传递apiCode、componentCode参数！'
            if (!e.fail) throw Error(t)
            e.fail({ type: 'UnExpectedException', msg: t })
          }
          o.default
            .loadVjs(
              'vjs.framework.extension.platform.services.operation.remote.ruleset'
            )
            .then(function (t) {
              t.getService(
                'vjs.framework.extension.platform.services.operation.remote.RemoteMethodAccessor'
              ).invokeV3Webapi({
                componentCode: e.componentCode,
                apiCode: e.apiCode,
                param: e.params,
                afterResponse: e.success,
                error: e.fail
              })
            })
            .catch(function (t) {
              e.fail && e.fail(t)
            })
        }
      }
    },
    'g9f8': function (e, t, r) {
      'use strict'
      Object.defineProperty(t, '__esModule', { value: !0 })
      var n = function (e, t) {
          var r = t.$root
          if (r && r._$v3platform) {
            var n = r._$v3platform(),
              o = n.datasource[e]
            if (o) {
              var a = Array.prototype.slice.call(arguments, 2)
              return o.apply(r, a)
            }
          }
        },
        o = function (e) {
          var t = e.vueObj
          return (
            'function' == typeof t.$root._$registerDsEvent &&
            (t.$root._$registerDsEvent(
              (function (e) {
                return function () {
                  var t = e.$attrs
                  if (t && t.___ds___ && t.___field___) {
                    var r = t.___ds___,
                      n = t.___field___
                    n = -1 != n.indexOf(',') ? n.split(',') : [t.___field___]
                    var o = e.$root._$getDatasource(r)
                    null != o &&
                      o.on({
                        eventName: o.Events.UPDATE,
                        handler: function (t) {
                          var r = !1,
                            o = null,
                            a = null,
                            i = t.resultSet.datas
                          if (i && i.length > 0)
                            for (var c = 0, s = i.length; c < s; c++)
                              for (
                                var l = i[c],
                                  d = l.getChangedData(),
                                  f = 0,
                                  u = n.length;
                                f < u;
                                f++
                              )
                                d.hasOwnProperty(n[f]) &&
                                  ((a = d[n[f]]), (r = !0))
                          if ((i = t.oldResultSet.datas) && i.length > 0)
                            for (var c = 0, s = i.length; c < s; c++)
                              for (
                                var l = i[c], f = 0, u = n.length;
                                f < u;
                                f++
                              )
                                o = l[n[f]]
                          r &&
                            e.$nextTick(function () {
                              e.$emit('on-change', a, o)
                            })
                        }
                      })
                  }
                }
              })(t)
            ),
            !0)
          )
        },
        a = function (e, t) {
          if (!e.$root._getComponentCode) return t
          var r = e.$root._getComponentCode(),
            n = 'itop/resources/' + r + '_' + t
          return window.GlobalVariables
            ? GlobalVariables.getServerUrl() + '/' + n
            : n
        },
        i = function (e) {
          if (void 0 != e && null != e && e && '' != e) {
            var t =
              'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
              e +
              '%22%2C%22ImageObj%22%3A%22' +
              e +
              '%22%7D%7D'
            return window.GlobalVariables
              ? GlobalVariables.getServerUrl() + '/' + t
              : t
          }
        }
      t.default = {
        synCurrentRecordToDs: function (e, t, r, o) {
          return n('synCurrentRecordToDs', e, t, r, o)
        },
        synCurrentIdToDs: function (e, t, r, o) {
          return n('synCurrentIdToDs', e, t, r, o)
        },
        synSelectRecordToDs: function (e, t, r, o) {
          return n('synSelectRecordToDs', e, t, r, o)
        },
        registerCurrentHandler: function (e, t) {
          return n('registerCurrentHandler', e, t)
        },
        registerSelectHandler: function (e, t) {
          return n('registerSelectHandler', e, t)
        },
        markDsMultipleSelect: function (e, t) {
          return n('markDsMultipleSelect', e, t)
        },
        getVuiVersion: function (e) {
          return e && e.$root ? e.$root.vui_version : null
        },
        getCurrentRecord: function (e, t) {
          return n('getCurrentRecord', e, t)
        },
        getSelectedRecords: function (e, t) {
          return n('getSelectedRecords', e, t)
        },
        isSelected: function (e, t, r) {
          return n('isSelectedRecord', e, t, r)
        },
        isCurrent: function (e, t, r) {
          return n('isCurrentRecord', e, t, r)
        },
        markMultipleDs: function (e, t) {
          return n('setDsMultiSelect', e, t)
        },
        registerDsUpdateEvent: o,
        getSrcPathFromRes: a,
        getSrcPathFromId2url: i,
        genUUID: function () {
          function e() {
            return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1)
          }
          return e() + e() + e() + e() + e() + e() + e() + e()
        },
        isRunInV3Service: function (e) {
          return !(!window.VMetrix || !window.VMetrix.loadBundles)
        },
        v3Log: function (e, t) {
          if (window && window.console)
            switch (e) {
              case 'warn':
                window.console.warn(t)
                break
              case 'error':
                window.console.error(t)
                break
              default:
                window.console.log(t)
            }
        }
      }
    },
    'vn7Q': function (e, t, r) {
      'use strict'
      function n(e) {
        return I(e, 'datasource')
      }
      function o(e, t) {
        var r = a(t)
        for (var n in e.prop) r.prop[n] = e.prop[n]
        for (var o in e.event) r.event[o] = e.event[o]
        return r
      }
      function a(e) {
        return {
          datasource: {
            prop: { required: !0, default: [] },
            event: {
              load: !0,
              change: !0,
              currentChange: !0,
              selectionChange: !0
            }
          },
          record: {
            prop: { required: !0, default: {} },
            event: { load: !0, change: !0 }
          },
          cell: {
            prop: { required: !0, default: {} },
            event: { load: !0, change: !0 }
          }
        }[e]
      }
      function i(e, t) {
        var r = {
            datasource: [
              'isCurrent',
              'isSelected',
              'markCurrent',
              'markSelected',
              'markUnSelect',
              'getDatasourceName',
              'getCurrentRecord',
              'getSelectedRecords',
              'v3PlatformFireEvent',
              'markDatasourceMultipleSelect',
              'registerColumnChangeHandler'
            ]
          },
          n = e.prop.name,
          o = {},
          a = r[t]
        if (a)
          for (var i = 0, s = a.length; i < s; i++) {
            var l = a[i],
              d = c(l, n)
            o[l] = d
          }
        return o
      }
      function c(e, t) {
        var r = function (e, r, n) {
            if (!(r instanceof Array))
              throw new Error(
                '标记选中/不选中的数据必须为数组类型，只标记一行数据请用"[]"将数据包装成数组。'
              )
            var o = r.length
            if (o > 0)
              if (a(e)) {
                var i = null
                if (!r[0]._metadata_) throw new Error('无法获取实体编码')
                i = r[0]._metadata_.dsName
                for (var c = 0; c < o; c++) {
                  var s = r[c]
                  if (!s) throw new Error('行记录不存在，无法设置为选中状态')
                  h.default.synSelectRecordToDs(e, i, s, n)
                }
              } else {
                var l = e.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t],
                  d = l.selectedRecords
                if (!0 === n) {
                  var s = r[0]
                  if (!0 === e.isMultipleSel) {
                    for (var f = !1, c = 0, u = r.length; c < u; c++) {
                      var s = r[c]
                      ;-1 == d.indexOf(s) && (d.push(s), (f = !0))
                    }
                    f &&
                      e.v3PlatformFireEvent(e, l.selectionChange, [
                        l.selectedRecords
                      ])
                  } else
                    r.length > 1 &&
                      h.default.v3Log(
                        'warn',
                        '非多选数据源，不支持设置多个选中，已选第一条作为选中记录'
                      ),
                      s != l.currentRecord &&
                        ((l.currentRecord = s),
                        (l.selectedRecords = [s]),
                        e.v3PlatformFireEvent(e, l.currentChange, [
                          l.currentRecord
                        ]),
                        e.v3PlatformFireEvent(e, l.selectionChange, [
                          l.selectedRecords
                        ]))
                } else if (!0 === e.isMultipleSel) {
                  for (var f = !1, c = 0, u = r.length; c < u; c++) {
                    var s = r[c],
                      v = d.indexOf(s)
                    ;-1 != v && ((f = !0), d.splice(v, 1))
                  }
                  f &&
                    e.v3PlatformFireEvent(e, l.selectionChange, [
                      l.selectedRecords
                    ])
                } else h.default.v3Log('error', '非多选数据源, 不支持取消选中')
              }
          },
          n = function () {
            throw new Error('无法获取实体编码')
          },
          o = function (e) {
            return e.$options.propsData[t]._metadata_
              ? e.$options.propsData[t]._metadata_.dsName
              : e[t]._metadata_
              ? e[t]._metadata_.dsName
              : e[t] && e[t][0] && e[t][0]._metadata_
              ? e[t][0]._metadata_.dsName
              : null
          },
          a = function (e) {
            return h.default.isRunInV3Service()
          }
        return {
          registerColumnChangeHandler: function (e, t) {
            var r = this
            r[w] ? (r[w][e] = t) : ((r[w] = {}), (r[w][e] = t))
          },
          getDatasourceName: function () {
            var e = this
            return a(this)
              ? o(e)
              : (window.console &&
                  window.console.warn('本地数据暂不支持获取数据源名称'),
                null)
          },
          getCurrentRecord: function () {
            var e = this
            return a(this)
              ? h.default.getCurrentRecord(e, o(e))
              : e.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t].currentRecord
          },
          getSelectedRecords: function () {
            var e = this
            return a(this)
              ? h.default.getSelectedRecords(e, o(e))
              : e.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t].selectedRecords
          },
          markDatasourceMultipleSelect: function () {
            var e = this
            if (a(e)) {
              var r = o(e)
              h.default.markMultipleDs(e, r)
            } else {
              this.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t].isMultipleSel = !0
            }
          },
          isCurrent: function (e) {
            var r = this
            if ('string' == typeof e) {
              if (!a(this))
                return (
                  window.console &&
                    window.console.warn('本地数据不支持根据id判断是否当前行'),
                  !1
                )
              var i = o(r)
              if (i) {
                var c = h.default.getCurrentRecord(r, i),
                  s = c.id
                if (s) return s === e
                throw new Error('无法读取当前行记录的id属性，无法校验')
              }
              n()
            } else {
              if ('object' !== (void 0 === e ? 'undefined' : E(e)))
                throw new Error(
                  '不支持处理该类型数据，传入数据必须是行记录的id(string)或行记录(object)'
                )
              if (!a(this)) {
                return (
                  e == this.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t].currentRecord
                )
              }
              var i = e._metadata_.dsName
              if (i) return h.default.isCurrent(r, i, e)
              n()
            }
          },
          isSelected: function (e) {
            var r = this
            if ('string' == typeof e) {
              if (!a(this))
                return (
                  window.console &&
                    window.console.warn('本地数据不支持根据id判断是否选中行'),
                  !1
                )
              var i = o(r)
              if (i) {
                var c = h.default.getSelectedRecords(r, i)
                if (c) {
                  for (var s = 0, l = c.length; s < l; s++) {
                    if (c[s].id === e) return !0
                  }
                  return !1
                }
                throw new Error('无法获取选中行记录')
              }
              n()
            } else {
              if ('object' !== (void 0 === e ? 'undefined' : E(e)))
                throw new Error(
                  '不支持处理该类型数据，传入数据必须是行记录的id(string)或行记录(object)'
                )
              if (a(this)) {
                var i = e._metadata_.dsName
                if (i) return h.default.isSelected(r, i, e)
                n()
              } else {
                if (
                  -1 !=
                  this.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[
                    t
                  ].selectedRecords.indexOf(e)
                )
                  return !0
              }
            }
          },
          markCurrent: function (e) {
            var r = this,
              n = o(r)
            if ('string' == typeof e) {
              if (!a(this))
                return (
                  window.console &&
                    window.console.warn('本地数据不支持使用id设置选中行'),
                  !1
                )
              var i = r[t]
              if (!i) throw new Error('无法获取实体')
              for (var c = null, s = 0, l = i.length; s < l; s++) {
                var d = i[s]
                if (d.id === e) {
                  c = d
                  break
                }
              }
              if (!c) throw new Error('无法根据ID获取行记录')
              h.default.synCurrentRecordToDs(r, n, c)
            } else {
              if ('object' !== (void 0 === e ? 'undefined' : E(e)))
                throw new Error(
                  '不支持处理该类型数据，传入数据必须是行记录的id(string)或行记录(object)'
                )
              if (a(this))
                null == n && e._metadata_ && (n = e._metadata_.dsName),
                  h.default.synCurrentRecordToDs(r, n, e)
              else {
                var f = this.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t]
                ;(f.currentRecord = e),
                  this.v3PlatformFireEvent(this, f.currentChange, [
                    f.currentRecord
                  ]),
                  !1 === f.isMultipleSel &&
                    ((f.selectedRecords = [e]),
                    this.v3PlatformFireEvent(this, f.selectedChange, [
                      f.selectedRecords
                    ]))
              }
            }
          },
          markSelected: function (e) {
            r(this, e, !0)
          },
          markUnSelect: function (e) {
            r(this, e, !1)
          },
          v3PlatformFireEvent: function (e, t, r) {
            for (var n = 0, o = t.length; n < o; n++) {
              var a = t[n]
              'function' == typeof a && a.apply(e, r)
            }
          }
        }[e]
      }
      function s(e, t, r) {
        var n = e.$watch(
          'V3_PLATFORM_ENTITY_DATAS_INFO_IDEN.' + t + '.datas.' + r,
          (function (e, t) {
            return function (r) {
              var n = e.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t],
                o = n.change
              if (o && o.length > 0)
                for (var a = 0, i = o.length; a < i; a++) {
                  var c = o[a]
                  'function' == typeof c && c.apply(e, [r])
                }
            }
          })(e, t),
          { deep: !0, sync: !0 }
        )
        e.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t].destroys[r] = n
      }
      function l(e, t, r) {
        var n = r.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN
        if (!n.hasOwnProperty(t)) {
          var o =
            (h.default.genUUID(),
            { datas: {}, destroys: {}, load: [], change: [] })
          n[t] = o
          var a = (o.datas, r[t])
          if (e)
            for (var i = 0, c = e.length; i < c; i++) {
              var s = e[i],
                l = s.eventType
              o.hasOwnProperty(l) && o[l].push(s.handler)
            }
          a && u(r, o.load, [a]),
            r.$watch(t, function (e, n) {
              var o = r.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t].change
              if (o && o.length > 0)
                for (var a = 0, i = o.length; a < i; a++) {
                  var c = o[a]
                  'function' == typeof c && c.apply(r, [e, n])
                }
            })
        }
      }
      function d(e, t, r) {
        var n = r.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN
        if (!n.hasOwnProperty(t)) {
          var o =
            (h.default.genUUID(),
            { datas: {}, destroys: {}, load: [], change: [] })
          n[t] = o
          var a = o.datas,
            i = r[t]
          if (e)
            for (var c = 0, l = e.length; c < l; c++) {
              var d = e[c],
                f = d.eventType
              o.hasOwnProperty(f) && o[f].push(d.handler)
            }
          if (i) {
            var v = h.default.genUUID()
            ;(a[v] = i), s(r, t, v), u(r, o.load, i)
          }
        }
      }
      function f(e, t, r) {
        var n = r.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN
        if (!n.hasOwnProperty(t)) {
          var o =
            (h.default.genUUID(),
            {
              datas: {},
              destroys: {},
              currentRecord: null,
              currentRecordDestory: null,
              selectedRecords: [],
              selectedRecordsDestory: null,
              isMultipleSel: !1,
              load: [],
              change: [],
              currentChange: [],
              selectionChange: []
            })
          n[t] = o
          var a = o.datas,
            i = r[t]
          if (e)
            for (var c = 0, l = e.length; c < l; c++) {
              var d = e[c],
                f = d.eventType
              o.hasOwnProperty(f) && o[f].push(d.handler)
            }
          if (i && i.length > 0) {
            ;(o.currentRecord = i[0]), o.selectedRecords.push(i[0])
            for (var c = 0; c < i.length; c++) {
              var v = h.default.genUUID(),
                _ = i[c]
              ;(a[v] = _), s(r, t, v)
            }
            u(r, o.load, i)
          }
          r.$watch(
            t,
            function (e) {
              try {
                var n = this.V3_PLATFORM_ENTITY_DATAS_INFO_IDEN[t],
                  o = [],
                  a = n.datas
                for (var c in a) o.push(a[c])
                var l = [],
                  d = [],
                  f = n.selectedRecords
                if (e && e.length > 0)
                  for (var v = 0, _ = e.length; v < _; v++) {
                    var m = e[v]
                    ;-1 == o.indexOf(m) && l.push(m)
                  }
                for (var v = 0, _ = o.length; v < _; v++) {
                  var m = o[v]
                  ;-1 == e.indexOf(m) && d.push(m)
                }
                var p = !1
                if (d.length > 0)
                  for (var S = n.destroys, v = 0, _ = d.length; v < _; v++) {
                    var m = d[v]
                    n.currentRecord === m && !0
                    var E = f.indexOf(m)
                    ;-1 != E && (f.splice(E, 1), (p = !0))
                    for (var g in a)
                      if (m === a[g]) {
                        var w = S[g]
                        try {
                          'function' == typeof w && w(), delete a[g]
                          break
                        } catch (e) {}
                      }
                  }
                if (l.length > 0) {
                  !0
                  for (var v = 0, _ = l.length; v < _; v++) {
                    var m = l[v],
                      g = h.default.genUUID()
                    ;(a[g] = m), s(r, t, g)
                  }
                }
                if (e.length > 0) {
                  var O = e[e.length - 1]
                  ;(n.currentRecord = O),
                    !1 === n.isMultipleSel &&
                      -1 == n.selectedRecords.indexOf(O) &&
                      ((p = !0), n.selectedRecords.push(O)),
                    l.length > 0
                      ? l.length > 1 || d.length > 0
                        ? u(r, n.load, i)
                        : 1 == l.length &&
                          (u(this, n.currentChange, [n.currentRecord]),
                          p && u(this, n.selectionChange, [n.selectedRecords]))
                      : d.length > 0 &&
                        (u(this, n.currentChange, [n.currentRecord]),
                        u(this, n.selectionChange, [n.selectedRecords]))
                }
              } catch (e) {
                window &&
                  window.console &&
                  window.console.error('处理数据错误.' + e)
              } finally {
                this._$V3PlatformDataHandlerIden = !1
              }
            },
            { deep: !1, sync: !0 }
          )
        }
      }
      function u(e, t, r) {
        for (var n = 0, o = t.length; n < o; n++) {
          var a = t[n]
          'function' == typeof a && a.apply(e, r)
        }
      }
      function v(e, t) {
        var r = C
        return function () {
          var n = this,
            o = _(e, n, t)
          if (h.default.isRunInV3Service())
            o.forEach(function (e, t) {
              ;(e.vueObj = n), r(e)
            })
          else {
            var a = e.prop.name
            switch (t) {
              case 'record':
                d(o, a, n)
                break
              case 'cell':
                l(o, a, n)
                break
              default:
                f(o, a, n)
            }
          }
        }
      }
      function _(e, t, r) {
        var n = e.event,
          o = e.prop.name,
          a = []
        if (n)
          for (var i in n)
            if (n.hasOwnProperty(i)) {
              var c = m(n[i], i, t, r)
              c && ((c.controlType = r), (c.dsName = o), a.push(c))
            }
        if ('datasource' === r) {
          var s = {
            eventType: 'change',
            controlType: r,
            dsName: o,
            name: 'on-cell-change',
            handler: function (e, r) {
              T(e, r, t)
            }
          }
          a.push(s)
        }
        return a
      }
      function m(e, t, r, n) {
        var o = {
            load: {
              name: 'on-load',
              handler: function () {
                r.$emit('on-load')
              }
            },
            change: {
              name: 'on-change',
              handler: function () {
                r.$emit('on-change')
              }
            },
            currentChange: {
              name: 'on-current-change',
              handler: function () {
                r.$emit('on-current-change')
              }
            },
            selectionChange: {
              name: 'on-selection-change',
              handler: function () {
                r.$emit('on-selection-change')
              }
            }
          },
          a = {
            datasource: ['load', 'change', 'currentChange', 'selectionChange'],
            record: ['load', 'change'],
            cell: ['load', 'change']
          },
          i = null
        if (null != e && o[t] && a[n] && -1 != a[n].indexOf(t)) {
          var c = o[t],
            s = c.handler
          if ('boolean' == typeof e)
            !0 === e &&
              (i = { eventType: t, eventName: c.name, vueObj: r, handler: s })
          else if ('object' === (void 0 === e ? 'undefined' : E(e))) {
            var l = e.name
            ;(i = { eventType: t, vueObj: r, eventName: c.name }),
              l &&
                ((s = function () {
                  r.$emit(l)
                }),
                (i.eventName = l)),
              (i.handler =
                'function' != typeof e.handler
                  ? s
                  : function () {
                      e.handler.apply(r, arguments)
                    })
          }
        }
        return i
      }
      function p(e, t) {
        var r = {
            datasource: { type: Array, v3PropType: 'datasource', default: [] },
            record: { type: Object, v3PropType: 'record', default: {} },
            cell: {
              type: [String, Number, Boolean],
              v3PropType: 'cell',
              default: null
            }
          },
          n = e.name,
          o = r[t],
          a = e.default ? e.default : o.default,
          i = {}
        return (
          (i[n] = {
            type: o.type,
            v3PropType: t,
            required: !0 === e.required,
            default: (function (e) {
              return function () {
                return e
              }
            })(a),
            validator: 'function' == typeof e.validator ? e.validator : null
          }),
          i
        )
      }
      function S(e, t) {
        return 'cell' == t || !!(e && e.prop && e.prop.name)
      }
      Object.defineProperty(t, '__esModule', { value: !0 })
      var E =
          'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
            ? function (e) {
                return typeof e
              }
            : function (e) {
                return e &&
                  'function' == typeof Symbol &&
                  e.constructor === Symbol &&
                  e !== Symbol.prototype
                  ? 'symbol'
                  : typeof e
              },
        g = r('g9f8'),
        h = (function (e) {
          return e && e.__esModule ? e : { default: e }
        })(g),
        w = (r('RYcG'), '___$ColumnChangeHandler___'),
        O = function (e) {
          return I(e, 'record')
        },
        N = function (e) {
          e
            ? e.prop
              ? (e.prop.name = 'value')
              : (e.prop = { name: 'value' })
            : (e = { prop: { name: 'value' } })
          var t = I(e, 'cell')
          return (
            (t.watch = {
              value: function (e, t) {
                this.$emit('input', e)
              }
            }),
            t
          )
        },
        I = function (e, t) {
          var r = {}
          if (S(e, t)) {
            e = o(e, t)
            var n = p(e.prop, t),
              a = v(e, t),
              c = i(e, t)
            r = {
              props: n,
              created: a,
              data: function () {
                return { V3_PLATFORM_ENTITY_DATAS_INFO_IDEN: {} }
              },
              methods: c
            }
          }
          return r
        },
        T = function (e, t, r) {
          var n = r[w],
            o = e
          if (o && o.length > 0 && n)
            for (var a = 0, i = o.length; a < i; a++)
              !(function (e, t) {
                var r = o[e],
                  a = r,
                  i = Object.keys(a)
                i &&
                  i.length > 0 &&
                  i.forEach(function (e) {
                    var t = n[e]
                    if (t) {
                      t(a[e], r)
                    }
                  })
              })(a)
        },
        C = function (e) {
          var t = e.vueObj
          return (
            'function' == typeof t.$root._$registerDsEvent &&
              t.$root._$registerDsEvent(e),
            !1
          )
        },
        R = { DatasourceMixin: n, RecordMixin: O, CellMixin: N }
      t.default = { mixins: R }
    }
  })
})
//# sourceMappingURL=v3-vdk.js.map
