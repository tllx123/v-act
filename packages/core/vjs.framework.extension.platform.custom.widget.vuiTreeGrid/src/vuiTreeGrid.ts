!(function (e, t) {
  if ('object' == typeof exports && 'object' == typeof module)
    module.exports = t(
      require('Vue'),
      require('vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'),
      require('vPlatform-resource-caf94787885743c8664a5bf624698d3f'),
      require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'),
      require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
    )
  else if ('function' == typeof define && define.amd)
    define([
      'Vue',
      'vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92',
      'vPlatform-resource-caf94787885743c8664a5bf624698d3f',
      'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649',
      'vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9'
    ], t)
  else {
    var n =
      'object' == typeof exports
        ? t(
            require('Vue'),
            require('vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'),
            require('vPlatform-resource-caf94787885743c8664a5bf624698d3f'),
            require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'),
            require('vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9')
          )
        : t(
            e.Vue,
            e['vPlatform-resource-2e4b3bdbff7df8ad9abd339aa39f4a92'],
            e['vPlatform-resource-caf94787885743c8664a5bf624698d3f'],
            e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'],
            e['vPlatform-resource-29ee768144ce68cbddff76c0a39b52c9']
          )
    for (var i in n) ('object' == typeof exports ? exports : e)[i] = n[i]
  }
})(
  'undefined' != typeof self ? self : this,
  function (
    __WEBPACK_EXTERNAL_MODULE_lRwf__,
    __WEBPACK_EXTERNAL_MODULE_kRJ1__,
    __WEBPACK_EXTERNAL_MODULE_4Pzh__,
    __WEBPACK_EXTERNAL_MODULE_Ug0N__,
    __WEBPACK_EXTERNAL_MODULE_9E2R__
  ) {
    return (function (e) {
      function t(i) {
        if (n[i]) return n[i].exports
        var o = (n[i] = { i: i, l: !1, exports: {} })
        return e[i].call(o.exports, o, o.exports, t), (o.l = !0), o.exports
      }
      var n = {}
      return (
        (t.m = e),
        (t.c = n),
        (t.d = function (e, n, i) {
          t.o(e, n) ||
            Object.defineProperty(e, n, {
              configurable: !1,
              enumerable: !0,
              get: i
            })
        }),
        (t.n = function (e) {
          var n =
            e && e.__esModule
              ? function () {
                  return e.default
                }
              : function () {
                  return e
                }
          return t.d(n, 'a', n), n
        }),
        (t.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t)
        }),
        (t.p = ''),
        t((t.s = 'JkW7'))
      )
    })({
      '4Pzh': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_4Pzh__
      },
      '4uoC': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = {
            name: 'vuiTreeGridColumnGroup',
            props: { title: { type: String } }
          })
      },
      '6NuM': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = n('83Xm'),
          o = (function (e) {
            return e && e.__esModule ? e : { default: e }
          })(i)
        t.default = o.default
      },
      '83Xm': function (e, t, n) {
        'use strict'
        function i(e) {
          n('dE75')
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var o = n('SVYT'),
          r = n.n(o)
        for (var a in o)
          'default' !== a &&
            (function (e) {
              n.d(t, e, function () {
                return o[e]
              })
            })(a)
        var l = n('I079'),
          d = (n.n(l), n('XyMi')),
          s = i,
          u = Object(d.a)(r.a, l.render, l.staticRenderFns, !1, s, null, null)
        t.default = u.exports
      },
      '9E2R': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_9E2R__
      },
      'Ck01': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = {
            name: 'vuiTreeGridColumn',
            props: {
              field: { type: String, required: !0 },
              title: { type: String },
              width: { type: [String, Number] },
              align: { type: String },
              minWidth: { type: [Number, String] },
              format: { type: String },
              formatFn: { type: Function },
              readonly: { type: Boolean, default: !1 },
              autoHeight: { type: Boolean, default: !1 },
              showTips: { type: Boolean, default: !1 },
              widgetCode: String
            },
            methods: {
              onLink: function (e) {
                this.$emit('on-link', e)
              }
            },
            watch: {
              readonly: function (e, t) {
                this.$parent.updateColumnAttribute(this.field, 'isReadOnly', e)
              }
            }
          })
      },
      'H/ej': function (module, __webpack_exports__, __webpack_require__) {
        'use strict'
        Object.defineProperty(__webpack_exports__, '__esModule', { value: !0 })
        var __WEBPACK_IMPORTED_MODULE_0_Format__ = __webpack_require__('Ug0N'),
          __WEBPACK_IMPORTED_MODULE_0_Format___default = __webpack_require__.n(
            __WEBPACK_IMPORTED_MODULE_0_Format__
          ),
          __WEBPACK_IMPORTED_MODULE_1_v3platform__ =
            __webpack_require__('4Pzh'),
          __WEBPACK_IMPORTED_MODULE_1_v3platform___default =
            __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_v3platform__),
          getColumnType = function (e) {
            if (e) {
              if (
                ((e = e.toLowerCase().replace(/-/g, '')),
                -1 != e.indexOf('vuigridcolumn') ||
                  -1 != e.indexOf('vuigridcolumngroup') ||
                  -1 != e.indexOf('vuitreegridcolumn') ||
                  -1 != e.indexOf('vuitreegridcolumngroup'))
              )
                return 'common'
              if (-1 != e.indexOf('expstyles')) return 'style'
            }
            return 'unknow'
          },
          hasColumn = function (e) {
            var t =
              e.componentOptions && e.componentOptions.children
                ? e.componentOptions.children
                : []
            if (t && t.length > 0)
              for (var n = 0, i = t.length; n < i; n++) {
                var o = t[n].tag,
                  r = getColumnType(o)
                if ('common' == r) return !0
              }
            return !1
          },
          saveHeader = function (e, t, n, i) {
            var o = null,
              r = null
            for (var a in i) {
              var l = i[a]
              l === e ? (o = a) : l == t && (r = a)
            }
            if (!o) {
              ;(o = __WEBPACK_IMPORTED_MODULE_0_Format___default.a.genUUID()),
                (i[o] = e)
              var d =
                e.componentOptions && t.componentOptions.propsData
                  ? t.componentOptions.propsData.title
                  : ''
              n.customHeaderDatas[o] = {
                id: o,
                node: e,
                name: d,
                parent: null,
                child: []
              }
            }
            if ((n === e && (n.customHeaderRootIden = o), !r)) {
              ;(r = __WEBPACK_IMPORTED_MODULE_0_Format___default.a.genUUID()),
                (i[r] = t)
              var d =
                t.componentOptions && t.componentOptions.propsData
                  ? t.componentOptions.propsData.title
                  : ''
              n.customHeaderDatas[r] = {
                id: r,
                node: t,
                name: d,
                parent: o,
                child: []
              }
            }
            var s = n.customHeaderDatas[o].child
            ;-1 == s.indexOf(r) && s.push(r)
          },
          handlerNode = function (e, t, n, i) {
            var o = []
            if (hasColumn(e)) {
              saveHeader(t, e, n, i)
              for (
                var r = e.componentOptions.children, a = 0, l = r.length;
                a < l;
                a++
              ) {
                var d = r[a]
                o.push(d), o.concat(handlerNode(d, e, n, i))
              }
            } else {
              var s = e.tag
              if (s) {
                s = s.toLowerCase().replace(/-/g, '')
                switch (getColumnType(s)) {
                  case 'common':
                    saveHeader(t, e, n, i),
                      'function' == typeof n.handlerColumn && n.handlerColumn(e)
                    break
                  case 'style':
                    'function' == typeof n.handlerExpStyle &&
                      n.handlerExpStyle(e)
                }
              }
            }
            return o
          },
          handleHeadInfo = function (e) {
            for (
              var t = {}, n = [], i = 0, o = e.$slots.default.length;
              i < o;
              i++
            ) {
              var r = e.$slots.default[i],
                a = {}
              a.index = i
              var l = handlerNode(r, e, e, t)
              l.length > 0 &&
                (l.splice.apply(l, [0, 0, i, 1]), (a.datas = l), n.push(a))
            }
            n.length < 1 &&
              ((e.customHeaderRootIden = null), (e.customHeaderDatas = null))
            for (var i = n.length - 1; i >= 0; i--) {
              var a = n[i].datas
              e.$slots.default.splice.apply(e.$slots.default, a)
            }
          },
          setHeader = function (e, t, n, i, o, r) {
            try {
              for (var a = t; a <= i; a++)
                for (var l = n; l <= o; l++) e.setCellData(a, l, r)
            } catch (e) {}
          },
          handleHeadMerge = function (e, t) {
            var n = e.customHeaderRootIden,
              i = e.customHeaderDatas
            if (n && i) {
              t.allowMerging = wijmo.grid.AllowMerging.ColumnHeaders
              for (var o = t.columnHeaders, r = 0; r < t.columns.length; r++)
                t.columns[r].allowMerging = !0
              var a = e.columns.length - 1,
                l = 0,
                d = 0,
                s = i[n].child,
                u = function (e) {
                  var t = 0,
                    n = e.child
                  if (n.length > 0) {
                    for (var o = 0, r = n.length; o < r; o++) {
                      var a = i[n[o]]
                      t += u(a)
                    }
                    return t
                  }
                  return 1
                },
                c = [],
                f = null,
                h = 0,
                p = function (t) {
                  if (t && t.length > 0) {
                    var n = new wijmo.grid.Row()
                    ;(n.allowMerging = !0), o.rows.insert(l, n)
                    var r = []
                    if ('Multi' === e.selectionMode)
                      for (
                        d = 1, 0 == l && (f = o), setHeader(o, l, 0, l, 0, '');
                        d <= a && c[d];

                      )
                        setHeader(o, l, d, l, d, c[d]), d++
                    else
                      for (d = 0; d <= a && c[d]; )
                        setHeader(o, l, d, l, d, c[d]), d++
                    for (var s = 0, m = t.length; s < m; s++) {
                      var g = d,
                        v = i[t[s]],
                        _ = v.child,
                        y = d + u(v) - 1
                      if (_ && _.length > 0)
                        for (var w = 0; w < _.length; w++) {
                          var C = i[_[w]]
                          C.child && C.child.length > 0
                            ? (r.push(_[w]), (g += u(C)))
                            : ((c[g] = C.name), g++)
                        }
                      else (c[g] = v.name), g++
                      for (
                        setHeader(o, l, d, l, y, v.name), d = y + 1;
                        d <= a && c[d];

                      )
                        setHeader(o, l, d, l, d, c[d]), d++
                    }
                    l++, h++, p(r)
                  }
                }
              if ((p(s), 'Multi' === e.selectionMode && 0 != f))
                try {
                  setHeader(f, l, 0, h + 1, 0, '')
                } catch (e) {}
            }
          },
          getFieldMapping = function (e) {
            var t = [],
              n = {}
            if (e.$slots.default)
              for (var i = 0, o = e.$slots.default.length; i < o; i++) {
                var r = e.$slots.default[i],
                  a = r.tag,
                  l = getColumnType(a)
                if ('common' == l) {
                  var d = r.componentOptions.propsData,
                    s = d.field
                  s && (t.push(s), d.widgetCode && (n[d.widgetCode] = s))
                }
              }
            return { tempWidgetCodeToField: n, tempColumnsField: t }
          },
          getDataType = function (e, t) {
            var n
            if (
              (isOldVue(e)
                ? (n = e.entityCode)
                : e.dataSource &&
                  e.dataSource._metadata_ &&
                  (n = e.dataSource._metadata_.dsName),
              n && '' != n)
            ) {
              var i = e.$root._$getEntityFieldType(n)
              if (i)
                switch (i[t]) {
                  case 'number':
                  case 'integer':
                    return 2
                  case 'boolean':
                    return 3
                }
            }
            return 1
          },
          isOldVue = function (e) {
            return (
              '2.0' !=
              __WEBPACK_IMPORTED_MODULE_1_v3platform___default.a.getVuiVersion(
                e
              )
            )
          },
          evalExp = function (exp, data) {
            var result = eval(exp)
            return 'boolean' == typeof result
              ? result
              : (window &&
                  window.console &&
                  console.warn('表达式的结果并不是布尔值，默认返回False'),
                !1)
          },
          addExpStyle = function (e, t, n) {
            e.columnExpStyles[t]
              ? e.columnExpStyles[t].push(n)
              : (e.columnExpStyles[t] = [n])
          },
          isPercentColumn = function (e, t) {
            for (var n = !1, i = 0, o = e.percentColumns.length; i < o; i++)
              if (t === e.percentColumns[i]) {
                n = !0
                break
              }
            return n
          },
          isImgColumn = function (e, t) {
            for (var n = !1, i = 0, o = e.imgColumns.length; i < o; i++)
              if (t === e.imgColumns[i]) {
                n = !0
                break
              }
            return n
          },
          gridDestroyed = function (e) {
            var t = e.linkEventNames
            if (t && t.length > 0)
              for (var n in t) {
                window[n] = null
                try {
                  delete window[n]
                } catch (e) {}
              }
          },
          getGridObj = function (e) {
            var t = e.getEl()
            return t
              ? wijmo.Control.getControl(t)
              : (window &&
                  window.console &&
                  console.warn('DOM还没生成，无法获取Grid'),
                null)
          },
          getOffset = function (e) {
            var t,
              n,
              i = e.$el
            if (i)
              return i.getClientRects().length
                ? ((t = i.getBoundingClientRect()),
                  (n = i.ownerDocument.defaultView),
                  { top: t.top + n.pageYOffset, left: t.left + n.pageXOffset })
                : { top: 0, left: 0 }
          },
          setRowHeight = function (e) {
            if (e.autoHeightField.length > 0) {
              getGridObj(e).autoSizeRows()
            }
          },
          updatedLayout = function (e) {
            if (!0 === e.isUpdateRowStyle) {
              ;(e.isUpdateRowStyle = !1), (e.isUiTrigger = !1)
              var t = getGridObj(e),
                n = t.rows
              if (n && n.length > 0)
                for (
                  var i = e.currentRowId,
                    o = e.columns.length,
                    r = 0,
                    a = n.length;
                  r < a;
                  r++
                ) {
                  var l = n[r]
                  if (i == l.dataItem.id) {
                    t.selection = new wijmo.grid.CellRange(r, 0, r, o)
                    break
                  }
                }
            }
          },
          loadedRows = function (e, t) {
            e.autoHeightField.length > 0 &&
              setTimeout(function () {
                t.autoSizeRows()
              }, 50)
          },
          updateColumnAttribute = function (e, t, n, i) {
            var o = e.columns
            if (o && o.length > 0 && t && n)
              for (var r = 0, a = o.length; r < a; r++) {
                var l = o[r],
                  d = l.field
                if (d == t) {
                  l[n] = i
                  var s = getGridObj(e)
                  if (s) {
                    var u = s.columns.getColumn(d)
                    u && (u[n] = i)
                  }
                  return !0
                }
              }
          },
          addLinkSpan = function (e, t, n, i) {
            var o = e
            if (e && '' != e && t && '' != t) {
              var r =
                'event_' +
                __WEBPACK_IMPORTED_MODULE_0_Format___default.a.genUUID()
              ;(window[r] = (function (e) {
                return function () {
                  'Multi' !== n.selectionMode && n.handlerSelectionChange(), e()
                }
              })(t)),
                n.linkEventNames.push(r)
              o =
                '<a ' +
                ('tree' == i ? '' : "class='grid-linkText'") +
                " onclick='" +
                r +
                "()'>" +
                e +
                '</a>'
            }
            return o
          },
          onCellValueChange = function (e, t, n, i, o) {
            var r = o.valueChangeEventField[e]
            'function' == typeof r && r.apply(o, [t, n, i])
          },
          onRowDblclick = function (e, t) {
            'Multi' !== t.selectionMode && t.handlerSelectionChange(),
              t.$emit('on-row-dblclick', e)
          },
          onRowClick = function (e, t) {
            'Multi' !== t.selectionMode && t.handlerSelectionChange(),
              t.$emit('on-row-click', e)
          },
          synSelectData = function (e, t) {
            e[getMultiSelectKey()] ? t.markSelected([e]) : t.markUnSelect([e])
          },
          synSelectDatas = function (e, t, n) {
            n ? t.markSelected(e) : t.markUnSelect(e)
          },
          getMultiSelectKey = function () {
            return '_selected_'
          }
        __webpack_exports__.default = {
          handleHeadInfo: handleHeadInfo,
          getMultiSelectKey: getMultiSelectKey,
          handleHeadMerge: handleHeadMerge,
          hasColumn: hasColumn,
          getColumnType: getColumnType,
          getFieldMapping: getFieldMapping,
          getDataType: getDataType,
          onRowClick: onRowClick,
          onRowDblclick: onRowDblclick,
          synSelectData: synSelectData,
          updateColumnAttribute: updateColumnAttribute,
          getOffset: getOffset,
          setRowHeight: setRowHeight,
          loadedRows: loadedRows,
          onCellValueChange: onCellValueChange,
          addLinkSpan: addLinkSpan,
          updatedLayout: updatedLayout,
          evalExp: evalExp,
          addExpStyle: addExpStyle,
          isPercentColumn: isPercentColumn,
          isImgColumn: isImgColumn,
          getGridObj: getGridObj,
          synSelectDatas: synSelectDatas,
          gridDestroyed: gridDestroyed,
          isOldVue: isOldVue
        }
      },
      'I079': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = function () {
            var e = this,
              t = e.$createElement,
              n = e._self._c || t
            return n(
              'div',
              [
                n(
                  'div',
                  { ref: e.currentGridIden },
                  [
                    n(
                      'wj-flex-grid',
                      {
                        style: e.styleStr,
                        attrs: {
                          'items-source': e.treeData,
                          'is-read-only': e.readonly,
                          'beginning-edit': e.beginningEdit,
                          'cell-edit-ended': e.cellEditEnded,
                          'loaded-rows': e.loadedRows,
                          'child-items-path': e.childField,
                          'allow-resizing': e.localAllowResize,
                          'selection-mode': e.selectMode,
                          'headers-visibility': e.localHeadersVisibility,
                          'allowDragging': 'None',
                          'name': 'flexGirdObj',
                          'format-item': e.columnFormaterFunc,
                          'frozen-columns': e.frozenColumns,
                          'selection-changed': e.selectionChanged,
                          'updated-layout': e.updatedLayout,
                          'initialized': e.initialized,
                          'tree-indent': 28
                        }
                      },
                      e._l(e.columns, function (e) {
                        return n('wj-flex-grid-column', {
                          key: e.field,
                          attrs: {
                            'binding': e.field,
                            'is-read-only': e.readonly,
                            'header': e.title,
                            'align': e.align,
                            'width': e.width,
                            'format': e.format,
                            'min-width': e.minWidth,
                            'data-type': e.dataType
                          }
                        })
                      }),
                      1
                    )
                  ],
                  1
                ),
                e._v(' '),
                e._t('default')
              ],
              2
            )
          },
          o = []
        ;(t.render = i), (t.staticRenderFns = o)
      },
      'IZ0r': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = function (e) {
          ;(this.columnField = e.columnField),
            (this.editorClass = e.editorClass),
            (this.editor = null),
            (this.column = null),
            (this.options = e.options),
            (this.columnType = e.columnType),
            (this.valueField = e.valueField)
        }
        ;(i.prototype = {
          bind: function (e) {
            var t = this
            ;(this.grid = e),
              (this.column = this.grid.columns.getColumn(this.columnField)),
              (this.editor = new this.editorClass(
                document.createElement('div'),
                this.isCustomColumnType() ? {} : this.options
              )),
              this.grid.beginningEdit.addHandler(this.beginningEdit, this),
              this.grid.scrollPositionChanged.addHandler(
                this.closeEditor,
                this
              ),
              (this.editor.v3PlatformDatas = {})
            var n = function (e) {
              switch (e.keyCode) {
                case wijmo.Key.Tab:
                case wijmo.Key.Enter:
                  t.closeEditor(!0), t.grid.focus()
                  var n = document.createEvent('HTMLEvents')
                  n.initEvent('keydown', !0, !0),
                    (n.ctrlKey = e.ctrlKey),
                    (n.shiftKey = e.shiftKey),
                    (n.keyCode = e.keyCode),
                    t.grid.hostElement.dispatchEvent(n)
                  break
                case wijmo.Key.Escape:
                  t.closeEditor(!1), t.grid.focus()
              }
            }
            this.editor.addEventListener(this.editor.hostElement, 'keydown', n)
            var i = function () {
              setTimeout(function () {
                t.hasFocus() || t.closeEditor(!0)
              })
            }
            this.editor.lostFocus.addHandler(i)
            var o = function (e) {
              ;(t._openDropDown = !1),
                (e.keyCode == wijmo.Key.F4 ||
                  (e.altKey &&
                    (e.keyCode == wijmo.Key.Down ||
                      e.keyCode == wijmo.Key.Up))) &&
                  ((t._openDropDown = !0),
                  t.grid.startEditing(!0),
                  e.preventDefault())
            }
            this.grid.addEventListener(this.grid.hostElement, 'keydown', o, !0),
              window.addEventListener('resize', function () {
                t.editor.containsFocus() && (t.closeEditor(!0), t.grid.focus())
              })
          },
          hasFocus: function () {
            if (!this.editor.containsFocus()) {
              var e = this.editor.hostElement
              if (e) {
                var t = e.id,
                  n = document.activeElement.id
                if (t && n && t == n) return !0
              }
              return !1
            }
            return !0
          },
          unbind: function (e, t) {
            var n = this
            ;(this.grid = e),
              (this.column = this.grid.columns.getColumn(this.columnField)),
              (this.editor = new this.editorClass(
                document.createElement('div'),
                this.isCustomColumnType() ? {} : this.options
              )),
              this.grid.beginningEdit.addHandler(this.beginningEdit, this),
              this.grid.scrollPositionChanged.addHandler(
                this.closeEditor,
                this
              ),
              this.editor.addEventListener(
                this.editor.hostElement,
                'keydown',
                function (e) {
                  switch (e.keyCode) {
                    case wijmo.Key.Tab:
                    case wijmo.Key.Enter:
                      n.closeEditor(!0), n.grid.focus()
                      var t = document.createEvent('HTMLEvents')
                      t.initEvent('keydown', !0, !0),
                        (t.ctrlKey = e.ctrlKey),
                        (t.shiftKey = e.shiftKey),
                        (t.keyCode = e.keyCode),
                        n.grid.hostElement.dispatchEvent(t)
                      break
                    case wijmo.Key.Escape:
                      n.closeEditor(!1), n.grid.focus()
                  }
                }
              ),
              this.editor.lostFocus.addHandler(function () {
                setTimeout(function () {
                  n.editor.containsFocus() || n.closeEditor(!0)
                })
              }),
              this.grid.addEventListener(
                this.grid.hostElement,
                'keydown',
                function (e) {
                  ;(n._openDropDown = !1),
                    (e.keyCode == wijmo.Key.F4 ||
                      (e.altKey &&
                        (e.keyCode == wijmo.Key.Down ||
                          e.keyCode == wijmo.Key.Up))) &&
                      ((n._openDropDown = !0),
                      n.grid.startEditing(!0),
                      e.preventDefault())
                },
                !0
              ),
              window.addEventListener('resize', function () {
                n.editor.containsFocus() && (n.closeEditor(!0), n.grid.focus())
              })
          },
          closeEditor: function (e) {
            if (this._rng) {
              var t = this.grid,
                n = this.editor,
                i = n.hostElement,
                o = new wijmo.grid.CellEditEndingEventArgs(t.cells, this._rng)
              if ((t.onCellEditEnding(o), e)) {
                var r,
                  a = this.options ? this.options.format : void 0,
                  l = this.columnType
                if (
                  ((r =
                    wijmo.isUndefined(n.value) || '' == n.value
                      ? wijmo.isUndefined(n.text)
                        ? void 0
                        : n.text
                      : n.value),
                  'combobox' === l)
                ) {
                  var d = this.valueField
                  if (d) {
                    var s = n.selectedValue,
                      u = t.rows[this._rng.row].dataItem[d]
                    null == u
                      ? ('' == s && (s = u), '' == r && (r = u))
                      : '' == u && (null == s && (s = u), null == r && (r = u)),
                      (t.rows[this._rng.row].dataItem[d] = s)
                  }
                }
                if (a && r && l)
                  switch (l) {
                    case 'date':
                    case 'time':
                      r = wijmo.Globalize.formatDate(r, a)
                  }
                t.setCellData(this._rng.row, this._rng.col, r), t.invalidate()
              }
              n instanceof wijmo.input.DropDown && (n.isDroppedDown = !1),
                null != i.parentElement && i.parentElement.removeChild(i)
              var c = n.editId
              if (c) {
                i = document.getElementById(c)
                try {
                  null != i.parentElement
                    ? i.parentElement.removeChild(i)
                    : i.remove()
                } catch (o) {}
              }
              ;(this._rng = null), t.onCellEditEnded(o)
            }
          },
          clearEditorValue: function () {
            ;(this.editor.selectedIndex = -1),
              (this.editor._lbx.selectedIndex = -1),
              (this.editor._tbx.value = '')
          },
          beginningEdit: function (e, t) {
            if (
              ('combobox' == this.columnType && this.clearEditorValue(),
              this.isCustomColumnType())
            )
              return void this.beginningEdit_custom(e, t)
            if (e.columns[t.col] == this.column) {
              var n = t.data
              if (!n || n.keyCode != wijmo.Key.Delete) {
                ;(t.cancel = !0), (this._rng = t.range)
                var i = e.getCellBoundingRect(t.row, t.col),
                  o = this.getMaxZIndex(e.hostElement, 0)
                'number' != typeof o && (o = '200101')
                var r = {
                  position: 'absolute',
                  left: i.left - 1 + pageXOffset,
                  top: i.top - 1 + pageYOffset,
                  width: i.width + 1,
                  height: e.rows[t.row].renderHeight + 1,
                  borderRadius: '0px',
                  zIndex: 9999999
                }
                wijmo.setCss(this.editor.hostElement, r)
                var a = this.editor.hostElement,
                  l = a.getAttribute('id')
                ;(null != l && '' != l) ||
                  ((l = 'vplatform_edit_iden'), a.setAttribute('id', l)),
                  (this.editor.editId = l),
                  wijmo.isUndefined(this.editor.text) ||
                    (this.editor.text = e.getCellData(
                      this._rng.row,
                      this._rng.col,
                      !0
                    ))
                var d = wijmo.tryCast(
                    e.collectionView,
                    'IEditableCollectionView'
                  ),
                  s = e.rows[t.row].dataItem
                d &&
                  s &&
                  setTimeout(function () {
                    d.editItem(s)
                  }, 210),
                  document.body.appendChild(a),
                  this.editor.focus()
                var u = this
                setTimeout(function () {
                  var e =
                    n && n.charCode > 32
                      ? String.fromCharCode(n.charCode)
                      : null
                  if (e) {
                    var t = u.editor.hostElement.querySelector('input')
                    if (t instanceof HTMLInputElement) {
                      ;(t.value = e),
                        wijmo.setSelectionRange(t, e.length, e.length)
                      var i = document.createEvent('HTMLEvents')
                      i.initEvent('input', !0, !1), t.dispatchEvent(i)
                    }
                  } else u.editor.focus()
                  u._openDropDown &&
                    u._ctl instanceof wijmo.input.DropDown &&
                    (u.editor.isDroppedDown = !0)
                }, 50)
              }
            }
          },
          getMaxZIndex: function (e, t) {
            var n = t,
              i = e.parentElement
            if ('BODY' != i.nodeName) {
              var o = i.style.zIndex
              if (!isNaN(Number(o))) {
                var r = Number(o)
                r > t && (n = r)
              }
              var a = this.getMaxZIndex(i, n)
              if ('number' == typeof a) {
                if ('number' == typeof n) {
                  var l = Number(a),
                    d = Number(n)
                  return l > d ? l : d
                }
                return a
              }
              return n
            }
            return n
          },
          isCustomColumnType: function () {
            var e = ['dictbox', 'text', 'textarea', 'password'],
              t = this.columnType
            return -1 != e.indexOf(t)
          },
          getCustomColumnTemplate: function (e) {
            var t = document.getElementById('wj-grid-edit-com')
            if (t && t.remove)
              try {
                t.remove()
              } catch (e) {}
            var n = document.createElement('div')
            n.setAttribute('id', 'wj-grid-edit-com'),
              (n.className = 'wj-gridInput-box')
            var i
            switch (e) {
              case 'text':
              case 'password':
              case 'textarea':
                var o = 'textarea' == e ? 'textarea' : 'input'
                ;(i = document.createElement(o)),
                  (i.className = 'wj-gridInput'),
                  'textarea' != e
                    ? i.setAttribute('type', e)
                    : (i.style.resize = 'none'),
                  n.appendChild(i)
                break
              case 'dictbox':
                ;(i = document.createElement('input')),
                  (i.className = 'wj-gridInput wj-gridInput-append'),
                  i.setAttribute('readonly', !0)
                var r = document.createElement('i')
                r.className = 'wj-gridInput-icon iconfont icon-calendar'
                var a = this.options
                'function' == typeof a.onClick && (r.onclick = a.onClick),
                  n.appendChild(i),
                  n.appendChild(r)
            }
            return n
          },
          beginningEdit_custom: function (e, t) {
            if (e.columns[t.col] == this.column) {
              var n = t.data
              if (!n || n.keyCode != wijmo.Key.Delete) {
                ;(t.cancel = !0), (this._rng = t.range)
                var i = e.getCellBoundingRect(t.row, t.col),
                  o = this.getMaxZIndex(e.hostElement, 0)
                o = 'number' != typeof o ? '200101' : Number(o) + 10 + ''
                var r = {
                    position: 'absolute',
                    left: i.left + pageXOffset,
                    top: i.top + pageYOffset,
                    width: i.width - 1,
                    height: e.rows[t.row].renderHeight - 1,
                    borderRadius: '0px',
                    zIndex: o
                  },
                  a = this.columnType,
                  l = this.getCustomColumnTemplate(a)
                wijmo.setCss(l, r)
                var d = e.getCellData(this._rng.row, this._rng.col, !0)
                'dictbox' == a &&
                  (d = this.options.dataSource[this.options.valueField]),
                  (this.editor.text = d)
                try {
                  this.editor.hostElement = l
                } catch (e) {}
                var s = l.getAttribute('id')
                ;(null != s && '' != s) ||
                  ((s = 'vplatform_edit_iden'), l.setAttribute('id', s)),
                  (this.editor.editId = s),
                  document.body.appendChild(l)
                var u = l.children[0]
                if (
                  (void 0 !== d && null !== d && (u.value = d),
                  'dictbox' == this.columnType)
                ) {
                  ;(document.body.onclick = (function (e, t, n) {
                    return function (i) {
                      if (
                        !(
                          i.x <= n.left + n.width &&
                          i.x >= n.left &&
                          i.y >= n.top &&
                          i.y <= n.top + n.height
                        )
                      ) {
                        t.closeEditor_custom(!0, e)
                        var o = e.parentElement
                        if ('function' != typeof o.remove) {
                          var r = o.parentElement
                          r || (r = document.body)
                          var a = o.id
                          r.removeChild(a ? document.getElementById(a) : o)
                        } else o.remove()
                      }
                    }
                  })(u, this, r)),
                    (u.onclick = function () {
                      return event.stopPropagation(), !1
                    })
                  l.children[1].addEventListener(
                    'click',
                    (function (e) {
                      return function (e) {
                        return e.stopPropagation(), !1
                      }
                    })(0)
                  )
                } else
                  (u.onkeyup = (function (e, t) {
                    return function () {
                      e.text = t.value
                    }
                  })(this.editor, u)),
                    (u.onblur = (function (e, t) {
                      return function () {
                        t.closeEditor_custom(!0, e)
                        var n = e.parentElement
                        'function' != typeof n.remove
                          ? n.parentElement.removeChild(n)
                          : n.remove()
                      }
                    })(u, this)),
                    setTimeout(
                      (function (e) {
                        u.focus()
                        var t = e.value.length
                        if (e.setSelectionRange) e.setSelectionRange(t, t)
                        else if (e.createTextRange) {
                          var n = e.createTextRange()
                          n.move('character', t), n.select()
                        }
                      })(u),
                      10
                    )
              }
            }
          },
          closeEditor_custom: function (e, t) {
            if (this._rng) {
              var n = this.grid,
                i = this.editor,
                o =
                  (i.hostElement,
                  new wijmo.grid.CellEditEndingEventArgs(n.cells, this._rng))
              if ((n.onCellEditEnding(o), e)) {
                var r = this.options ? this.options.format : void 0,
                  a = this.columnType,
                  l = t.value
                if ('dictbox' == this.columnType)
                  l = this.options.dataSource[this.options.textField]
                else if (r && l && a)
                  switch (a) {
                    case 'date':
                    case 'time':
                      l = wijmo.Globalize.formatDate(l, r)
                  }
                n.setCellData(this._rng.row, this._rng.col, l), n.invalidate()
              }
              i instanceof wijmo.input.DropDown && (i.isDroppedDown = !1),
                (this._rng = null),
                n.onCellEditEnded(o)
            }
          }
        }),
          Object.defineProperty(i.prototype, 'control', {
            get: function () {
              return this.editor
            },
            enumerable: !0,
            configurable: !0
          }),
          (t.default = i)
      },
      'IyzF': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = n('Lurs'),
          o = (function (e) {
            return e && e.__esModule ? e : { default: e }
          })(i)
        t.default = o.default
      },
      'JkW7': function (e, t, n) {
        'use strict'
        function i(e) {
          return e && e.__esModule ? e : { default: e }
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var o = n('6NuM'),
          r = i(o),
          a = n('R60C'),
          l = i(a),
          d = n('wq5j'),
          s = i(d),
          u = n('IyzF'),
          c = i(u)
        i(n('lRwf')).default.component(r.default.name, r.default),
          Vue.component(l.default.name, l.default),
          Vue.component(s.default.name, s.default),
          Vue.component(c.default.name, c.default),
          (t.default = {
            vuiTreeGrid: r.default,
            vuiTreeGridColumn: l.default,
            vuiTreeGridColumnGroup: s.default,
            ExpStyles: c.default
          })
      },
      'Lurs': function (e, t, n) {
        'use strict'
        function i(e) {
          n('VFif')
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var o = n('WnpZ'),
          r = n.n(o)
        for (var a in o)
          'default' !== a &&
            (function (e) {
              n.d(t, e, function () {
                return o[e]
              })
            })(a)
        var l = n('o7gF'),
          d = (n.n(l), n('XyMi')),
          s = i,
          u = Object(d.a)(
            r.a,
            l.render,
            l.staticRenderFns,
            !1,
            s,
            'data-v-1f021363',
            null
          )
        t.default = u.exports
      },
      'MX1f': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = n('4uoC'),
          o = n.n(i)
        for (var r in i)
          'default' !== r &&
            (function (e) {
              n.d(t, e, function () {
                return i[e]
              })
            })(r)
        var a = n('Rkr1'),
          l = (n.n(a), n('XyMi')),
          d = Object(l.a)(
            o.a,
            a.render,
            a.staticRenderFns,
            !1,
            null,
            null,
            null
          )
        t.default = d.exports
      },
      'PUWW': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = n('Ck01'),
          o = n.n(i)
        for (var r in i)
          'default' !== r &&
            (function (e) {
              n.d(t, e, function () {
                return i[e]
              })
            })(r)
        var a = n('oEnv'),
          l = (n.n(a), n('XyMi')),
          d = Object(l.a)(
            o.a,
            a.render,
            a.staticRenderFns,
            !1,
            null,
            null,
            null
          )
        t.default = d.exports
      },
      'R60C': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = n('PUWW'),
          o = (function (e) {
            return e && e.__esModule ? e : { default: e }
          })(i)
        t.default = o.default
      },
      'Rkr1': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = function () {
            var e = this,
              t = e.$createElement,
              n = e._self._c || t
            return n(
              'div',
              [n('wj-flex-grid-column', { attrs: { header: e.title } })],
              1
            )
          },
          o = []
        ;(t.render = i), (t.staticRenderFns = o)
      },
      'SVYT': function (e, t, n) {
        'use strict'
        function i(e) {
          return e && e.__esModule ? e : { default: e }
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var o =
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
          r = n('kRJ1'),
          a = i(r),
          l = n('4Pzh'),
          d = i(l),
          s = n('Ug0N'),
          u = i(s),
          c = n('H/ej'),
          f = i(c),
          h = n('nK+t'),
          p = i(h),
          m = n('IZ0r'),
          g = i(m),
          v = n('9E2R'),
          _ = i(v),
          y = {},
          w = []
        t.default = {
          name: 'vuiTreeGrid',
          mixins: [
            _.default.vue.mixins.DatasourceMixin({
              prop: { name: 'dataSource' },
              event: {
                change: {
                  name: 'on-change',
                  handler: function () {
                    this.$emit('on-change')
                  }
                },
                currentChange: {
                  handler: function (e) {
                    if (this.isUpdateEditors) {
                      var t = this
                      t.$nextTick(function () {
                        t.updateEditors()
                      })
                    }
                    e &&
                      (!1 === this.isUiTrigger
                        ? (this.isUpdateRowStyle = !0)
                        : (this.isUiTrigger = !1),
                      (this.PreRowId = this.currentRowId),
                      (this.currentRowId = e.id),
                      (this.PreRowId && '' != this.PreRowId) ||
                        (this.PreRowId = this.currentRowId)),
                      this.missCurrentEvent ||
                        (this.$emit('on-current-change'),
                        (this.missCurrentEvent = !1))
                  }
                },
                selectionChange: {
                  name: 'on-selection-change',
                  handler: function (e) {
                    this.$emit('on-selection-change', e)
                  }
                }
              }
            })
          ],
          props: {
            dataSource: {
              type: Array,
              default: function () {
                return []
              }
            },
            expandAll: { type: Boolean, default: !1 },
            parentField: { type: String, default: 'PID' },
            emptyMessage: { type: String, default: '无数据' },
            childField: { type: String, default: '_$children' },
            selectMode: { type: String, default: 'Row' },
            headersVisibility: { type: String, default: 'Column' },
            allowResize: { type: Boolean, default: !0 },
            width: { type: [String, Number], default: '100%' },
            height: { type: [String, Number], default: '100%' },
            showTips: { type: Boolean, default: !0 },
            frozenColumns: { type: Number, default: 0 },
            showCheckbox: { type: Boolean, default: !1 },
            entityCode: { type: String },
            showLevel: { type: Number, default: 0 },
            showHeader: { type: Boolean, default: !0 },
            readonly: { type: Boolean, default: !1 },
            autoHeight: { type: Boolean, default: !1 },
            selectionMode: { type: String, default: 'Single' }
          },
          data: function () {
            var e = this
            return {
              currentGridIden: u.default.genUUID(),
              treeData: [],
              columns: [],
              columnLinkEvent: {},
              columnFormaters: {},
              currentRowId: '',
              PreRowId: '',
              linkEventNames: [],
              missCurrentEvent: !1,
              customHeaderRootIden: null,
              customHeaderDatas: {},
              isChangeSelectRow: !1,
              isStartEdit: !1,
              destroyDataWatchFuncs: {},
              editors: [],
              columnInfos: {},
              valueChangeEventField: {},
              SelectionRecordChangeInfo: null,
              nowEditInfo: { row: -1, col: -1, value: null },
              autoHeightField: [],
              showTipsField: [],
              lastSelectRow: null,
              isUpdateEditors: !0,
              isUiTrigger: null,
              isUpdateRowStyle: !1,
              isHanderCurrentChange: !1,
              imgColumns: [],
              isUpdateData: !0,
              percentColumns: [],
              percentColumnOptions: {
                foregroundColor: 'red',
                backgroundColor: ''
              },
              columnExpStyles: {},
              widgetCodeToField: {},
              columnFormaterFunc: function (t, n) {
                if (
                  ('Multi' === e.selectionMode || e.selectionMode,
                  n.panel.cellType !== wijmo.grid.CellType.ColumnHeader)
                ) {
                  var i = t.columns[n.col].binding
                  if (f.default.isImgColumn(e, i)) {
                    var o = t.rows[n.row].dataItem[i],
                      r = d.default.getSrcPathFromId2url(o),
                      a = '<img src="' + r + '" style="height: 100%;" />'
                    n.cell.innerHTML = a
                  } else if (f.default.isPercentColumn(e, i)) {
                    var l = 100 * t.rows[n.row].dataItem[i]
                    l > 100 ? (l = 100) : l < 0 && (l = 0)
                    var s = e.percentColumnOptions.foregroundColor,
                      u = e.percentColumnOptions.backgroundColor
                        ? 'background-color: ' +
                          e.percentColumnOptions.backgroundColor
                        : '',
                      c =
                        l < 50
                          ? '<td align="right" class="percentTd" style="background-color: ' +
                            s +
                            '; width: ' +
                            l +
                            '%;"></td>'
                          : '<td align="right" class="percentTd" style="background-color: ' +
                            s +
                            '; width: ' +
                            l +
                            '%;">' +
                            l +
                            '%</td>',
                      h =
                        l < 50
                          ? '<td align="left" style="' +
                            u +
                            '; width: ' +
                            (100 - l) +
                            '%;">' +
                            l +
                            '%</td>'
                          : '<td align="left" style="' +
                            u +
                            '; width: ' +
                            (100 - l) +
                            '%;"></td>',
                      a =
                        '<table width="100%" border="0" cellpadding="0" cellspacing="0"><tbody><tr>' +
                        c +
                        h +
                        '</tr></tbody></table>'
                    n.cell.innerHTML = a
                  }
                } else
                  n.cell.innerHTML =
                    '<span style="position: absolute;transform: translate(-50%,-50%);top: 50%;left: 50%;-ms-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);-moz-transform:translate(-50%,-50%);-o-transform:translate(-50%,-50%);">' +
                    n.cell.innerHTML +
                    '</span>'
                if (e.columnExpStyles[i] && e.columnExpStyles[i].length > 0) {
                  var p = {}
                  if (
                    (e.columnExpStyles[i].forEach(function (e) {
                      if (f.default.evalExp(e.exp, t.rows[n.row].dataItem)) {
                        var i = e.foregroundColor,
                          o = e.backgroundColor
                        i && (p.foregroundColor = i),
                          o && (p.backgroundColor = o)
                      }
                    }),
                    p.foregroundColor)
                  )
                    if (f.default.isPercentColumn(e, i)) {
                      var m = n.cell.getElementsByClassName('percentTd')
                      if (m && m.length > 0) {
                        var g = m[0]
                        g.style.backgroundColor = p.foregroundColor
                      }
                    } else
                      n.cell.style.setProperty(
                        'color',
                        p.foregroundColor,
                        'important'
                      )
                  p.backgroundColor &&
                    n.cell.style.setProperty(
                      'background-color',
                      p.backgroundColor,
                      'important'
                    )
                }
                if (n.panel == t.cells) {
                  var i = t.columns[n.col].binding
                  if (
                    'Multi' === e.selectionMode ||
                    'Cascade' === e.selectionMode
                  ) {
                    if (i == t.columns[0].binding) {
                      var v = n.row,
                        _ = document.createElement('input')
                      _.setAttribute('type', 'checkbox'),
                        (_.id =
                          e.currentGridIden + 'CB' + t.rows[v].dataItem.id),
                        t.rows[v].dataItem._metadata_ &&
                          (_.checked =
                            t.rows[v].dataItem._metadata_.isSelected ||
                            t.rows[v].dataItem._selected_),
                        (_.onchange = function (n) {
                          e.isChangeSelectRow = !0
                          var i = n.target.checked
                          e.multiSelectChange(t.rows[v].dataItem, i),
                            (e.isChangeSelectRow = !1)
                        })
                      var y = n.cell.children
                      if (y && y.length > 0) {
                        var w = y[0]
                        ;-1 != w.className.indexOf('wj-elem-collapse')
                          ? n.cell.insertBefore(_, w.nextSibling)
                          : n.cell.insertBefore(_, w)
                      } else n.cell.insertBefore(_, n.cell.lastChild)
                      for (var C = 0, b = y.length; C < b; C++) {
                        var w = y[C],
                          E = 14
                        if (
                          ('INPUT' === w.tagName &&
                            'checkbox' === w.type &&
                            (E = w.offsetWidth),
                          -1 !== w.className.indexOf('wj-grid-editor'))
                        ) {
                          var O = n.cell.clientWidth - E
                          w.style.width = O + 'px'
                        }
                      }
                      _.checked &&
                        'Cascade' === e.selectionMode &&
                        e.$nextTick(function () {
                          e.changeChildNodeChecked(t.rows[v].dataItem, !0)
                        })
                    }
                  }
                  var x = e,
                    D = n.cell
                  if (D) {
                    D.recordClickNum = 0
                    var k = function (e, t) {
                      D.recordClickNum = e
                      var n = setTimeout(
                        (function (e, t, n) {
                          return function () {
                            var i = t,
                              o = e,
                              r = o.recordClickNum
                            1 == r
                              ? f.default.onRowClick(n, i)
                              : 2 == r && f.default.onRowDblclick(n, i),
                              (o.recordClickNum = 0)
                          }
                        })(D, x, t),
                        250
                      )
                      2 == e && clearTimeout(n)
                    }
                    ;(D.onclick = function (e) {
                      k(1, e)
                    }),
                      (D.ondblclick = function (e) {
                        k(2, e)
                      }),
                      -1 != x.autoHeightField.indexOf(i) &&
                        (n.cell.style.wordWrap = 'break-word')
                  }
                  var I = t.rows[n.row].dataItem[i],
                    T = e.columnFormaters[i],
                    M = I
                  if (
                    (T
                      ? (M = T(I))
                      : e.showTips &&
                        ((I = null == I || void 0 == I ? '' : I),
                        n.cell.setAttribute('title', I)),
                    !e.showTips)
                  ) {
                    !0 === e.columnInfos[i].showTips &&
                      n.cell.setAttribute('title', I)
                  }
                  var R = e.columnLinkEvent[i]
                  if (R) {
                    M = f.default.addLinkSpan(M, R, e, 'tree')
                    var y = n.cell.children,
                      S = document.createDocumentFragment()
                    if (y.length > 0)
                      for (var C = 0, P = y.length; C < P; C++)
                        S.appendChild(y[C])
                    var j = document.createElement('div')
                    ;(j.innerHTML = M), (y = j.children)
                    for (var C = 0, P = y.length; C < P; C++)
                      S.appendChild(y[C])
                    ;(n.cell.textContent = ''), n.cell.appendChild(S)
                  }
                }
              }
            }
          },
          beforeCreate: function () {
            var e = f.default.getFieldMapping(this)
            ;(y = e.tempWidgetCodeToField), (w = e.tempColumnsField)
          },
          created: function () {
            ;('Multi' !== this.selectionMode &&
              'Cascade' !== this.selectionMode) ||
              this.markDatasourceMultipleSelect(),
              this.$slots.default &&
                ((this.widgetCodeToField = y),
                (this.customHeaderDatas = {}),
                f.default.handleHeadInfo(this)),
              this.mapToTreeData()
          },
          computed: {
            styleStr: function () {
              return (
                'width:' +
                (isNaN(this.width) ? this.width + ';' : this.width + 'px;') +
                'height:' +
                (isNaN(this.height) ? this.height + ';' : this.height + 'px;')
              )
            },
            localHeadersVisibility: function () {
              return !1 === this.showHeader ? 'None' : 'Column'
            },
            localAllowResize: function () {
              var e = this.allowResize
              return 'boolean' == typeof e && !1 === e ? 'None' : 'Columns'
            }
          },
          watch: {
            dataSource: {
              handler: function (e, t) {
                if (!f.default.isOldVue(this) && !1 === this.isUpdateData)
                  return void (this.isUpdateData = void 0)
                var n = 0 == this.treeData.length
                if ((this.mapToTreeData(), n)) {
                  var i = f.default.getGridObj(this)
                  this.$nextTick(function () {
                    i.collapseGroupsToLevel(0)
                  })
                }
                0 == this.treeData.length
                  ? a.default.addClass(this.getEl(), 'vui-dataEmpty')
                  : (a.default.removeClass(this.getEl(), 'vui-dataEmpty'),
                    (this.selectCount = 0)),
                  this.autoHeightField.length > 0 &&
                    f.default.setRowHeight(this)
              },
              deep: !1
            },
            currentRowId: function () {}
          },
          mounted: function () {
            var e = f.default.getGridObj(this)
            this.expandAll || e.collapseGroupsToLevel(this.showLevel),
              0 == this.treeData.length &&
                a.default.addClass(this.getEl(), 'vui-dataEmpty'),
              d.default.registerCurrentHandler(
                this,
                (function (e) {
                  return function (t, n) {
                    e.entityCode === t &&
                      e.$nextTick(function () {
                        var t = wijmo.Control.getControl(e.getEl()),
                          i = t.rows
                        if (i && i.length > 0)
                          for (
                            var o = n.getSysId(), r = 0, a = i.length;
                            r < a;
                            r++
                          ) {
                            var l = i[r]
                            if (o == l.dataItem.id) {
                              l, (e.currentRowId = o)
                              break
                            }
                          }
                      })
                  }
                })(this)
              ),
              e.addEventListener(e.hostElement, 'mousemove', function (t) {
                for (
                  var n = e.hitTest(t),
                    i = e.rows,
                    o = n.row,
                    r = 0 == o && 2 == n.cellType,
                    a = 0,
                    l = i.length;
                  a < l;
                  a++
                ) {
                  var d = i[a],
                    s = d.cssClass
                  r || o != a
                    ? s &&
                      s.indexOf(!0) &&
                      (s = s.replace('v3-vui-grid-highlight-hover', '').trim())
                    : s
                    ? -1 == s.indexOf('v3-vui-grid-highlight-hover') &&
                      (s += ' v3-vui-grid-highlight-hover')
                    : (s = 'v3-vui-grid-highlight-hover'),
                    (d.cssClass = s)
                }
              }),
              e.addEventListener(e.hostElement, 'mouseout', function (t) {
                for (
                  var n = (e.hitTest(t), e.rows), i = 0, o = n.length;
                  i < o;
                  i++
                ) {
                  var r = n[i],
                    a = r.cssClass
                  a &&
                    -1 != a.indexOf('v3-vui-grid-highlight-hover') &&
                    (a = a.replace('v3-vui-grid-highlight-hover', '').trim()),
                    (r.cssClass = a)
                }
              })
          },
          methods: {
            initialized: function (e, t) {
              var n = f.default.getGridObj(this),
                i = this
              n.updatingView.addHandler(function () {
                var e = i.getEl()
                if (e && !a.default.visible(e)) {
                  var t = (function (t, n) {
                    return function () {
                      n.invalidate(), p.default.removeVisibleChangeHandler(e)
                    }
                  })(0, n)
                  p.default.onVisibleChagned(e, t)
                }
              }),
                f.default.handleHeadMerge(this, e)
            },
            handlerColumn: function (e) {
              var t = e.componentOptions.propsData,
                n = t.field,
                i = {
                  linkEvent: null,
                  format: null,
                  formatFn: null,
                  showTips: !1,
                  valueChangeEvent: null,
                  autoHeight: !1
                }
              this.columnInfos[n] = i
              var o = t.formatFn
              o &&
                'function' == typeof o &&
                ((this.columnFormaters[n] = o), (t.formatFn = null)),
                !0 === t.showTips &&
                  ((i.showTips = !0), this.showTipsField.push(t.field)),
                (!0 !== this.autoHeight && !0 !== t.autoHeight) ||
                  ((i.autoHeight = !0), this.autoHeightField.push(n))
              var r = e.componentOptions.listeners
              r &&
                ('function' == typeof r['on-link'] &&
                  ((i.linkEvent = r['on-link']),
                  (this.columnLinkEvent[n] = r['on-link'])),
                'function' == typeof r['on-change'] &&
                  this.registerColumnChangeHandler(n, r['on-change'])),
                (t.dataType = f.default.getDataType(this, n))
              var a = e.componentOptions.children
              if (a && a.length > 0) {
                var l = a[0],
                  d = l.tag
                this.setEditors(l, t),
                  -1 !== d.indexOf('Checkbox')
                    ? (t.dataType = 3)
                    : -1 !== d.indexOf('vui-img')
                    ? (this.imgColumns.push(t.field), (t.readonly = !0))
                    : -1 !== d.indexOf('vui-percent')
                    ? (this.percentColumns.push(t.field),
                      l.data &&
                        ((this.percentColumnOptions.foregroundColor = l.data
                          .attrs['foreground-color']
                          ? l.data.attrs['foreground-color']
                          : 'red'),
                        (this.percentColumnOptions.backgroundColor = l.data
                          .attrs['background-color']
                          ? l.data.attrs['background-color']
                          : '')),
                      (t.readonly = !0))
                    : -1 != d.toLowerCase().indexOf('inputnumber') &&
                      (t.dataType = 2)
              }
              this.columns.push(t)
            },
            handlerExpStyle: function (e) {
              var t = this
              e.componentOptions.children.forEach(function (e) {
                if (e.data && e.data.attrs) {
                  var n = e.data.attrs
                  if (n.columns) {
                    n.columns.split(',').forEach(function (e) {
                      var i = t.widgetCodeToField[e]
                      i
                        ? f.default.addExpStyle(t, i, {
                            exp: n.exp,
                            foregroundColor: n['foreground-color'],
                            backgroundColor: n['background-color']
                          })
                        : window &&
                          window.console &&
                          console.warn(
                            '无法获取widget-code与列字段的映射，请检查columns是否正确'
                          )
                    })
                  } else
                    w.forEach(function (e) {
                      f.default.addExpStyle(t, e, {
                        exp: n.exp,
                        foregroundColor: n['foreground-color'],
                        backgroundColor: n['background-color']
                      })
                    })
                }
              })
            },
            getEl: function () {
              return this.$children && this.$children[0]
                ? this.$children[0].$el
                : null
            },
            updateEditors: function () {
              if (((this.isUpdateEditors = !1), this.$slots.default)) {
                this.editors = []
                for (var e = 0, t = this.$slots.default.length; e < t; e++) {
                  var n = this.$slots.default[e]
                  if (
                    n.tag &&
                    (-1 !== n.tag.indexOf('vui-tree-grid-column') ||
                      -1 !== n.tag.indexOf('vuiTreeGridColumn'))
                  ) {
                    var i = n.componentOptions.propsData,
                      o = n.componentOptions.children
                    if (o && o.length > 0) {
                      var r = o[0]
                      this.setEditors(r, i)
                    }
                  }
                }
                for (
                  var a = f.default.getGridObj(this),
                    e = 0,
                    l = this.editors.length;
                  e < l;
                  e++
                )
                  this.editors[e].bind(a)
              }
            },
            setEditors: function (e, t) {
              var n = null,
                i = e.tag
              if (
                -1 !== i.indexOf('vuiComboBox') ||
                -1 != i.indexOf('vuicombobox')
              ) {
                var o = e.componentOptions.propsData,
                  r = [],
                  a = o.itemText,
                  l = o.itemValue,
                  d = o.valueField,
                  s = o.textField
                if (s && s !== t.field)
                  throw Error(
                    'vui-combo-box的text-field必须与vui-tree-grid-column的field相同'
                  )
                if (e.componentOptions.children) {
                  var u = e.componentOptions.children
                  ;(a = 'text'), (l = 'value')
                  for (var c = 0, f = u.length; c < f; c++) {
                    var h = u[c]
                    if (
                      h &&
                      h.componentOptions &&
                      h.componentOptions.propsData
                    ) {
                      var p = h.componentOptions.propsData,
                        m = {}
                      ;(m[a] = p.text), (m[l] = p.value), r.push(m)
                    }
                  }
                } else r = o.itemSource
                var v = {
                  itemsSource: r,
                  displayMemberPath: a,
                  selectedValuePath: l
                }
                n = new g.default({
                  editorClass: wijmo.input.ComboBox,
                  columnField: t.field,
                  options: v,
                  columnType: 'combobox',
                  valueField: d
                })
              } else if (
                -1 !== i.indexOf('vuiInputNumber') ||
                -1 != i.indexOf('vuiinputnumber')
              ) {
                var o = e.componentOptions.propsData,
                  _ = 'n',
                  y = Number(o.precision)
                isNaN(y) ? (_ = 'n0') : ((_ += y), t.format || (t.format = _))
                var v = { step: o.step, max: o.max, min: o.min, format: _ }
                n = new g.default({
                  editorClass: wijmo.input.InputNumber,
                  columnField: t.field,
                  options: v,
                  columnType: 'number'
                })
              } else if (
                -1 !== i.indexOf('vuiInput') ||
                -1 !== i.indexOf('vuiinput')
              ) {
                var o = e.componentOptions.propsData,
                  w = o.type ? o.type : 'text',
                  v = {}
                n = new g.default({
                  editorClass: wijmo.input.InputMask,
                  columnField: t.field,
                  options: v,
                  columnType: w
                })
              } else if (
                -1 !== i.indexOf('vuiDatePicker') ||
                -1 !== i.indexOf('vuidatepicker')
              ) {
                var o = e.componentOptions.propsData,
                  C = o.type,
                  v = {}
                'datetime' == C
                  ? ((v.format = 'yyyy-MM-dd HH:mm:ss'),
                    (n = new g.default({
                      editorClass: wijmo.input.InputDateTime,
                      columnField: t.field,
                      options: v,
                      columnType: 'date'
                    })))
                  : ((v.format = 'yyyy-MM-dd'),
                    (n = new g.default({
                      editorClass: wijmo.input.InputDate,
                      columnField: t.field,
                      options: v,
                      columnType: 'date'
                    })))
              } else if (
                -1 !== i.indexOf('vuiTimePicker') ||
                -1 !== i.indexOf('vuitimepicker')
              ) {
                var o = e.componentOptions.propsData,
                  v = {}
                n = new g.default({
                  editorClass: wijmo.input.InputTime,
                  columnField: t.field,
                  options: v,
                  columnType: 'time'
                })
              } else if (
                -1 !== i.indexOf('vuiDictBox') ||
                -1 !== i.indexOf('vuidictbox')
              ) {
                var o = e.componentOptions.propsData,
                  b = o.dataSource,
                  E = o.textField,
                  O = o.valueField
                if (!b && ((b = this.getDatasourceName()), !O)) {
                  var x = t.field
                  ;(O = x), E || (E = x)
                }
                var v = { dataSource: b, textField: E, valueField: O },
                  D = e.componentOptions.listeners
                D &&
                  'function' == typeof D['on-click'] &&
                  (v.onClick = D['on-click']),
                  (n = new g.default({
                    editorClass: wijmo.input.ComboBox,
                    columnField: t.field,
                    options: v,
                    columnType: 'dictbox'
                  }))
              }
              n && this.editors.push(n)
            },
            expandNodes: function () {
              f.default.getGridObj(this).collapseGroupsToLevel()
            },
            collapseNodes: function () {
              f.default.getGridObj(this).collapseGroupsToLevel(0)
            },
            treeDataMskToMap: function () {
              var e = [],
                t = this.childField,
                n = this.treeData
              return (
                n &&
                  (function n(i) {
                    for (var o = 0, r = i.length; o < r; o++) {
                      var a = i[o]
                      if ((a._selected_ && (e[a.id] = a._selected_), a[t])) {
                        n(a[t])
                      }
                    }
                  })(n),
                e
              )
            },
            bindRecordWatch: function (e) {
              this.destroyDataWatchFuncs[e.id] = this.$root.$watch(
                (function (e) {
                  return function () {
                    return e
                  }
                })(e),
                (function (e, t) {
                  return function (n, i) {
                    if (!t.isChangeSelectRow) {
                      if (n.id == e.id)
                        for (var o in n)
                          'id' != o &&
                            n.hasOwnProperty(o) &&
                            e[o] != n[o] &&
                            (e[o] = n[o])
                      var r = f.default.getGridObj(t),
                        a = r.rows
                      if (a && a.length > 0)
                        for (var l = 0, d = a.length; l < d; l++) {
                          var s = a[l]
                          if (s && s.dataItem && s.dataItem.id == n.id) {
                            s.onPropertyChanged()
                            break
                          }
                        }
                    }
                  }
                })(e, this),
                { deep: !0, sync: !0 }
              )
            },
            _getLastTreeNodeId: function (e, t) {
              var n = e.id,
                i = e[this.childField]
              if (i && i.length > 0)
                for (var o = i.length - 1; o >= 0; o--) {
                  var r = this._getLastTreeNodeId(i[o], t)
                  if (r && !t.hasOwnProperty(n)) {
                    n = r
                    break
                  }
                }
              if (!t.hasOwnProperty(n)) return n
            },
            _findRowIndexByDataId: function (e, t) {
              var n = { index: 0, row: null }
              t = t && '' != t ? t : e
              var i = f.default.getGridObj(this).rows
              if (i && i.length > 0)
                for (var o = 0, r = i.length; o < r; o++) {
                  var a = i[o].dataItem
                  if (a) {
                    var l = a.id
                    if ((t === l && (n.row = i[o]), l == e)) {
                      ;(n.index = o), t == l && (n.row = i[o])
                      break
                    }
                  }
                }
              return n
            },
            _generateNodes: function (e, t, n) {
              var i = new wijmo.grid.GroupRow()
              ;(i.isReadOnly = this.isReadOnly), (i.dataItem = e)
              var r = 0
              'object' == (void 0 === n ? 'undefined' : o(n))
                ? (r = n.level + 1)
                : 'number' == typeof n && (r = n),
                (i.level = r),
                t.push(i)
              var a = i[this.childField]
              if (a && a.length > 0)
                for (var l = 0, d = a.length; l < d; l++)
                  this._generateNodes(a[l], t, r + 1)
            },
            mapToTreeData: function () {
              for (
                var e = this,
                  t = this.treeData,
                  n = this.dataSource,
                  i = {},
                  o = {},
                  r = 0,
                  a = n.length;
                r < a;
                r++
              ) {
                var l = n[r],
                  d = Object.create(l)
                o[l.id] = d
              }
              var s = this.childField
              if (t && t.length > 0) {
                var u = [],
                  c = this.destroyDataWatchFuncs,
                  h = {},
                  p = []
                !(function t(n, i, r) {
                  for (var a = 0, l = n.length; a < l; a++) {
                    var d = n[a],
                      s = d.id,
                      u = r
                    ;(o[s] && !0 !== u) || (p.push(s), (u = !0)), (i[s] = d)
                    var f = d[e.childField]
                    if (f && f.length > 0) {
                      t(f, i, u)
                      for (var h = f.length - 1; h >= 0; h--) {
                        var m = f[h].id
                        if (!0 === u || -1 != p.indexOf(m)) {
                          f.splice(h, 1)
                          var g = c[m]
                          if ('function' == typeof g)
                            try {
                              g()
                            } catch (e) {}
                        }
                      }
                    }
                  }
                })(t, h, null)
                for (var r = t.length - 1; r >= 0; r--) {
                  var m = t[r].id
                  if (-1 != p.indexOf(m)) {
                    t.splice(r, 1)
                    var g = c[m]
                    if ('function' == typeof g)
                      try {
                        g()
                      } catch (e) {}
                  }
                }
                for (var r = n.length - 1; r >= 0; r--) {
                  var v = n[r].id
                  if (-1 != p.indexOf(v)) n.splice(r, 1)
                  else if (!h.hasOwnProperty(v)) {
                    i[v] = n[r]
                    var d = o[v]
                    this.bindRecordWatch(d)
                  }
                }
                if (p.length > 0)
                  for (
                    var _ = f.default.getGridObj(e).rows, r = _.length - 1;
                    r >= 0;
                    r--
                  ) {
                    var y = _[r].dataItem
                    y && -1 != p.indexOf(y.id) && _.splice(r, 1)
                  }
                var w = {},
                  C = [],
                  b = {}
                for (var E in i)
                  if (i.hasOwnProperty(E)) {
                    var d = i[E]
                    d._metadata_ && (d._selected_ = d._metadata_.isSelected)
                    var O = d[this.parentField]
                    if (null != O && '' != O)
                      if (h.hasOwnProperty(O)) {
                        var x = h[O]
                        if ('Cascade' === this.selectionMode) {
                          var D = x._selected_
                          ;(d._selected_ = D), !0 === D && u.push(d)
                        }
                        var k = x[s]
                        k ? k.push(d) : ((k = [d]), (x[s] = k)),
                          w.hasOwnProperty(O) ? w[O].push(d) : (w[O] = [d])
                      } else b.hasOwnProperty(O) ? b[O].push(d) : (b[O] = [d])
                    else
                      b.hasOwnProperty(E) && (d[s] = b[s]),
                        C.push(d),
                        this.treeData.push(d)
                    h.hasOwnProperty(E) || (h[E] = d)
                  }
                var I = f.default.getGridObj(e)
                for (var O in w) {
                  var T = w[O],
                    M = I.rows.length - 1,
                    R = null,
                    S = O
                  if (
                    (e.PreRowId != S && (S = e.PreRowId),
                    h.hasOwnProperty(S) && (S = e._getLastTreeNodeId(h[S], i)),
                    S)
                  ) {
                    var P = e._findRowIndexByDataId(S, O)
                    ;(M = P.index), (R = P.row)
                  }
                  for (var j = [M + 1, 0], r = 0, a = T.length; r < a; r++)
                    e._generateNodes(T[r], j, R)
                  R && R.isCollapsed && R._setCollapsed(!1),
                    I.rows.splice.apply(I.rows, j)
                }
                if (C.length > 0) {
                  var M = I.rows.length - 1
                  if (h.hasOwnProperty(this.PreRowId)) {
                    var S = e._getLastTreeNodeId(h[this.PreRowId], i),
                      P = e._findRowIndexByDataId(S)
                    M = P.index
                  }
                  for (var j = [M + 1, 0], r = 0, a = C.length; r < a; r++)
                    e._generateNodes(C[r], j, 0)
                  I.rows.splice.apply(I.rows, j)
                }
                u.length > 0 && f.default.synSelectDatas(u, e, !0)
              } else {
                for (var F = [], r = 0, N = n.length; r < N; r++) {
                  var l = n[r],
                    E = l.id,
                    d = o[E]
                  this.bindRecordWatch(d)
                  var O = l[this.parentField]
                  if (
                    (d._metadata_ && (d._selected_ = d._metadata_.isSelected),
                    o[O])
                  ) {
                    var x = o[O]
                    'Cascade' === this.selectionMode &&
                      (d._selected_ = x._selected_)
                    var k = x[s]
                    k ? k.push(d) : ((k = [d]), (x[s] = k))
                  } else F.push(d)
                }
                if (((this.treeData = F), this.treeData.length > 0)) {
                  var H = this.treeData[0]
                  H.id != this.currentRowId &&
                    ((this.missCurrentEvent = !0),
                    this.markCurrent(H),
                    (this.missCurrentEvent = !1))
                }
              }
            },
            checkParentNodeSelected: function (e) {
              var t = this.parentField,
                n = !1
              if (e[t]) {
                for (
                  var i = this.dataSource, o = {}, r = 0, a = i.length;
                  r < a;
                  r++
                ) {
                  var l = i[r],
                    d = l.id
                  o[d] = Object.create(l)
                }
                !(function e(i) {
                  var r = o[i]
                  r._metadata_ &&
                    (r._metadata_.isSelected ? (n = !0) : r[t] && e(r[t]))
                })(e[t])
              }
              return n
            },
            selectionChanged: function (e, t) {
              var n = e.rows[t.row].dataItem,
                i = n.id
              if (this.currentRowId != i) {
                try {
                  this.lastSelectRow = e.rows[t.row]
                  var o = event ? event.target || event.srcElement : void 0
                  f.default.isOldVue(this) &&
                    (n._metadata_ || (n._metadata_ = {}),
                    n._metadata_.dsName ||
                      (n._metadata_.dsName = this.entityCode))
                  var r = !1
                  1 == this.isHanderCurrentChange &&
                    this.SelectionRecordChangeInfo.data.id != i &&
                    (r = !0),
                    'Single' === this.selectionMode
                      ? ((this.SelectionRecordChangeInfo = {
                          grid: e,
                          data: n
                        }),
                        r &&
                          ((this.isHanderCurrentChange = !1),
                          this.handlerSelectionChange()))
                      : (o && 'INPUT' === o.tagName && 'checkbox' === o.type) ||
                        this.markCurrent(n)
                } catch (e) {}
                ;(this.currentRowId = i), this.selectCount
              }
              this.selectCount++
            },
            handlerSelectionChange: function (e) {
              if (this.SelectionRecordChangeInfo) {
                var t = this.SelectionRecordChangeInfo.grid,
                  n = this.SelectionRecordChangeInfo.data
                try {
                  ;(this.isUiTrigger = !0),
                    'Multi' === this.selectionMode
                      ? (!0 === this.isUpdateData && (this.isUpdateData = !1),
                        f.default.synSelectData(n, this))
                      : (!0 === this.isUpdateData && (this.isUpdateData = !1),
                        this.markCurrent(n),
                        (this.currentRowId = n.id),
                        !0 === e && (this.isHanderCurrentChange = !0)),
                    f.default.isOldVue(this) &&
                      this.$emit('on-current-change', t)
                } catch (e) {
                  window && window.console && console.error(e)
                }
              }
            },
            loadedRows: function (e, t) {
              e.rows.forEach(function (e) {
                e.isReadOnly = !1
              }),
                f.default.loadedRows(this, e)
            },
            beginningEdit: function (e, t) {
              var n = this,
                i = f.default.getGridObj(n)
              ;(n.nowPlace = f.default.getOffset(n)),
                (n.tmpPlaceInterval = setInterval(function () {
                  var e = n.nowPlace,
                    t = f.default.getOffset(n)
                  ;(e.left == t.left && e.top == t.top) ||
                    (i.onScrollPositionChanged(),
                    clearInterval(n.tmpPlaceInterval))
                }, 2))
              var o = t.row,
                r = t.col,
                a = e.columns[r].binding,
                l = e.rows[o]._data[a]
              f.default.isImgColumn(this, a)
                ? (t.cancel = !0)
                : f.default.isPercentColumn(this, a)
                ? (t.cancel = !0)
                : ((this.nowEditInfo = { row: o, col: r, field: a, value: l }),
                  (this.isStartEdit = !0))
            },
            updatedLayout: function () {
              f.default.updatedLayout(this)
            },
            cellEditEnded: function (e, t) {
              this.tmpPlaceInterval && clearInterval(this.tmpPlaceInterval)
              var n = this.nowEditInfo.value,
                i = t.row,
                o = t.col,
                r = e.columns[o].binding,
                a = e.rows[i]._data,
                l = a[r]
              f.default.isOldVue(this) &&
                n !== l &&
                f.default.onCellValueChange(r, l, n, a, this),
                'Multi' !== this.selectionMode &&
                  this.handlerSelectionChange(!0),
                (this.nowEditInfo = {
                  row: -1,
                  col: -1,
                  field: null,
                  value: null
                }),
                (this.isStartEdit = !1)
            },
            updateColumnAttribute: function (e, t, n) {
              f.default.updateColumnAttribute(this, e, t, n)
            },
            changeChildNodeChecked: function (e, t) {
              var n = this,
                i = this.childField
              if (((e._selected_ = t), !e.IsLeaf || e[i])) {
                var o = e[i]
                o &&
                  o.length > 0 &&
                  o.forEach(function (e) {
                    var i = document.getElementById(
                      n.currentGridIden + 'CB' + e.id
                    )
                    i && (i.checked = t), n.changeChildNodeChecked(e, t)
                  })
              }
            },
            multiSelectChange: function (e, t, n) {
              if (e) {
                var i = this.childField,
                  r = this
                e._selected_ = t
                var a = []
                a.push(e)
                if (
                  'Cascade' === this.selectionMode ||
                  'Multi' === this.selectionMode
                ) {
                  var l = []
                  if ('Cascade' === this.selectionMode) {
                    !(function t(n, o) {
                      var r = n[i]
                      if (
                        (n._selected_ !== o &&
                          ((n._selected_ = o),
                          n.id != e.id && a.push(n),
                          l.push(n.id)),
                        r && r.length > 0)
                      )
                        for (var d = 0, s = r.length; d < s; d++) t(r[d], o)
                    })(e, t)
                    var d = e[this.parentField]
                    if (null != d && '' != d) {
                      var s = (function e(t, n) {
                        for (var i = 0, a = t.length; i < a; i++) {
                          var l = t[i]
                          if (n == l.id) return !0
                          var d = l[r.childField]
                          if (d && d.length > 0) {
                            var s = e(d, n)
                            if (s) {
                              if ('boolean' == typeof s) return [l]
                              if (
                                'object' == (void 0 === s ? 'undefined' : o(s))
                              )
                                return s.push(l), s
                            }
                          }
                        }
                      })(this.treeData, e.id)
                      if (s && s.length > 0)
                        for (
                          var u = !1, c = {}, h = 0, p = s.length;
                          h < p;
                          h++
                        ) {
                          var m = s[h],
                            d = m.id
                          if (!t || u)
                            m._selected_ &&
                              (l.push(d),
                              (m._selected_ = !1),
                              (c[d] = !1),
                              a.push(m))
                          else {
                            for (
                              var g = m[r.childField],
                                v = !1,
                                _ = 0,
                                y = g.length;
                              _ < y;
                              _++
                            ) {
                              var w = g[_],
                                C = w.id
                              C != e.id &&
                                w._selected_ !== t &&
                                ((v = !0),
                                !1 !== m._selected_ &&
                                  ((u = !0),
                                  l.push(d),
                                  (m._selected_ = !1),
                                  (c[d] = !1),
                                  a.push(m)))
                            }
                            v ||
                              (t && !1 === m._selected_
                                ? (l.push(d),
                                  (m._selected_ = !0),
                                  (c[d] = !0),
                                  a.push(m))
                                : t ||
                                  !0 !== m._selected_ ||
                                  (l.push(d),
                                  (m._selected_ = !1),
                                  (u = !0),
                                  (c[d] = !1),
                                  a.push(m)))
                          }
                        }
                    }
                  } else l.push(e.id)
                  if (l.length > 0)
                    for (
                      var b = f.default.getGridObj(r),
                        E = b.rows,
                        h = 0,
                        p = E.length;
                      h < p;
                      h++
                    ) {
                      var O = E[h],
                        x = E[h].dataItem.id
                      O &&
                        O.dataItem &&
                        -1 != l.indexOf(x) &&
                        O.onPropertyChanged()
                    }
                }
                f.default.synSelectDatas(a, this, t),
                  n || this.isCurrent(e) || this.markCurrent(e)
              }
            }
          },
          destroyed: function () {
            f.default.gridDestroyed(this)
          }
        }
      },
      'Ug0N': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_Ug0N__
      },
      'VFif': function (e, t) {},
      'WnpZ': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.default = { name: 'ExpStyles' })
      },
      'XyMi': function (e, t, n) {
        'use strict'
        function i(e, t, n, i, o, r, a, l) {
          e = e || {}
          var d = typeof e.default
          ;('object' !== d && 'function' !== d) || (e = e.default)
          var s = 'function' == typeof e ? e.options : e
          t && ((s.render = t), (s.staticRenderFns = n), (s._compiled = !0)),
            i && (s.functional = !0),
            r && (s._scopeId = r)
          var u
          if (
            (a
              ? ((u = function (e) {
                  ;(e =
                    e ||
                    (this.$vnode && this.$vnode.ssrContext) ||
                    (this.parent &&
                      this.parent.$vnode &&
                      this.parent.$vnode.ssrContext)),
                    e ||
                      'undefined' == typeof __VUE_SSR_CONTEXT__ ||
                      (e = __VUE_SSR_CONTEXT__),
                    o && o.call(this, e),
                    e &&
                      e._registeredComponents &&
                      e._registeredComponents.add(a)
                }),
                (s._ssrRegister = u))
              : o &&
                (u = l
                  ? function () {
                      o.call(this, this.$root.$options.shadowRoot)
                    }
                  : o),
            u)
          )
            if (s.functional) {
              s._injectStyles = u
              var c = s.render
              s.render = function (e, t) {
                return u.call(t), c(e, t)
              }
            } else {
              var f = s.beforeCreate
              s.beforeCreate = f ? [].concat(f, u) : [u]
            }
          return { exports: e, options: s }
        }
        t.a = i
      },
      'dE75': function (e, t) {},
      'kRJ1': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_kRJ1__
      },
      'lRwf': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_lRwf__
      },
      'nK+t': function (e, t, n) {
        'use strict'
        function i(e, t) {
          if (e && 'function' == typeof t) {
            var n = e,
              i = n.getAttribute('id')
            ;(i && '' != i) || ((i = d.a.genUUID()), n.setAttribute('id', i)),
              !0 === a.a.visible(n) ? (s[i] = 'block') : (s[i] = 'none'),
              (u[i] = t)
          }
          c ||
            '{}' == JSON.stringify(s) ||
            (c = setInterval(function () {
              for (var e in s) {
                var t = document.getElementById(e)
                if (t) {
                  var n = s[e],
                    i = a.a.visible(t)
                  if ((i = !0 === i ? 'block' : 'none') != n) {
                    var r = u[e]
                    'function' == typeof r &&
                      (setTimeout(function () {
                        r(t)
                      }, 1),
                      r(t),
                      (s[e] = i))
                  }
                } else o(e)
              }
              '{}' == JSON.stringify(s) && (clearInterval(c), (c = null))
            }, 100))
        }
        function o(e) {
          var t = 'string' == typeof e ? e : e.getAttribute('id')
          try {
            delete s[t], delete u[t]
          } catch (e) {}
        }
        Object.defineProperty(t, '__esModule', { value: !0 })
        var r = n('kRJ1'),
          a = n.n(r),
          l = n('Ug0N'),
          d = n.n(l),
          s = {},
          u = {},
          c = null
        t.default = { onVisibleChagned: i, removeVisibleChangeHandler: o }
      },
      'o7gF': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = function () {
            var e = this,
              t = e.$createElement
            return (e._self._c || t)('div')
          },
          o = []
        ;(t.render = i), (t.staticRenderFns = o)
      },
      'oEnv': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = function () {
            var e = this,
              t = e.$createElement,
              n = e._self._c || t
            return n(
              'div',
              {
                directives: [
                  {
                    name: 'show',
                    rawName: 'v-show',
                    value: !1,
                    expression: 'false'
                  }
                ]
              },
              [
                n('wj-flex-grid-column', {
                  attrs: {
                    'binding': e.field,
                    'is-read-only': e.readonly,
                    'header': e.title,
                    'align': e.align,
                    'format': e.format,
                    'min-width': e.minWidth
                  }
                })
              ],
              1
            )
          },
          o = []
        ;(t.render = i), (t.staticRenderFns = o)
      },
      'wq5j': function (e, t, n) {
        'use strict'
        Object.defineProperty(t, '__esModule', { value: !0 })
        var i = n('MX1f'),
          o = (function (e) {
            return e && e.__esModule ? e : { default: e }
          })(i)
        t.default = o.default
      }
    })
  }
)
