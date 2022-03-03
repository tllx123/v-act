!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t(
        require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'),
        require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
      ))
    : 'function' == typeof define && define.amd
    ? define(
        'vPlatform-resource-3d8656f20a2205d0f7e61f6d7d33f965',
        [
          'vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649',
          'vPlatform-resource-caf94787885743c8664a5bf624698d3f'
        ],
        t
      )
    : 'object' == typeof exports
    ? (exports['vPlatform-resource-3d8656f20a2205d0f7e61f6d7d33f965'] = t(
        require('vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'),
        require('vPlatform-resource-caf94787885743c8664a5bf624698d3f')
      ))
    : (e['vPlatform-resource-3d8656f20a2205d0f7e61f6d7d33f965'] = t(
        e['vPlatform-resource-2899a1e4d5a85582fd42fa99fdb71649'],
        e['vPlatform-resource-caf94787885743c8664a5bf624698d3f']
      ))
})(
  'undefined' != typeof self ? self : this,
  function (
    __WEBPACK_EXTERNAL_MODULE_Ug0N__,
    __WEBPACK_EXTERNAL_MODULE_4Pzh__
  ) {
    return (function (e) {
      function t(o) {
        if (n[o]) return n[o].exports
        var r = (n[o] = { i: o, l: !1, exports: {} })
        return e[o].call(r.exports, r, r.exports, t), (r.l = !0), r.exports
      }
      var n = {}
      return (
        (t.m = e),
        (t.c = n),
        (t.d = function (e, n, o) {
          t.o(e, n) ||
            Object.defineProperty(e, n, {
              configurable: !1,
              enumerable: !0,
              get: o
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
      'JkW7': function (module, exports, __webpack_require__) {
        'use strict'
        function _interopRequireDefault(e) {
          return e && e.__esModule ? e : { default: e }
        }
        Object.defineProperty(exports, '__esModule', { value: !0 })
        var _Format = __webpack_require__('Ug0N'),
          _Format2 = _interopRequireDefault(_Format),
          _v3platform = __webpack_require__('4Pzh'),
          _v3platform2 = _interopRequireDefault(_v3platform),
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
              for (var n = 0, o = t.length; n < o; n++) {
                var r = t[n].tag,
                  a = getColumnType(r)
                if ('common' == a) return !0
              }
            return !1
          },
          saveHeader = function (e, t, n, o) {
            var r = null,
              a = null
            for (var l in o) {
              var i = o[l]
              i === e ? (r = l) : i == t && (a = l)
            }
            if (!r) {
              ;(r = _Format2.default.genUUID()), (o[r] = e)
              var u =
                e.componentOptions && t.componentOptions.propsData
                  ? t.componentOptions.propsData.title
                  : ''
              n.customHeaderDatas[r] = {
                id: r,
                node: e,
                name: u,
                parent: null,
                child: []
              }
            }
            if ((n === e && (n.customHeaderRootIden = r), !a)) {
              ;(a = _Format2.default.genUUID()), (o[a] = t)
              var u =
                t.componentOptions && t.componentOptions.propsData
                  ? t.componentOptions.propsData.title
                  : ''
              n.customHeaderDatas[a] = {
                id: a,
                node: t,
                name: u,
                parent: r,
                child: []
              }
            }
            var d = n.customHeaderDatas[r].child
            ;-1 == d.indexOf(a) && d.push(a)
          },
          handlerNode = function e(t, n, o, r) {
            var a = []
            if (hasColumn(t)) {
              saveHeader(n, t, o, r)
              for (
                var l = t.componentOptions.children, i = 0, u = l.length;
                i < u;
                i++
              ) {
                var d = l[i]
                a.push(d), a.concat(e(d, t, o, r))
              }
            } else {
              var f = t.tag
              if (f) {
                f = f.toLowerCase().replace(/-/g, '')
                switch (getColumnType(f)) {
                  case 'common':
                    saveHeader(n, t, o, r),
                      'function' == typeof o.handlerColumn && o.handlerColumn(t)
                    break
                  case 'style':
                    'function' == typeof o.handlerExpStyle &&
                      o.handlerExpStyle(t)
                }
              }
            }
            return a
          },
          handleHeadInfo = function (e) {
            for (
              var t = {}, n = [], o = 0, r = e.$slots.default.length;
              o < r;
              o++
            ) {
              var a = e.$slots.default[o],
                l = {}
              l.index = o
              var i = handlerNode(a, e, e, t)
              i.length > 0 &&
                (i.splice.apply(i, [0, 0, o, 1]), (l.datas = i), n.push(l))
            }
            n.length < 1 &&
              ((e.customHeaderRootIden = null), (e.customHeaderDatas = null))
            for (var o = n.length - 1; o >= 0; o--) {
              var l = n[o].datas
              e.$slots.default.splice.apply(e.$slots.default, l)
            }
          },
          setHeader = function (e, t, n, o, r, a) {
            try {
              for (var l = t; l <= o; l++)
                for (var i = n; i <= r; i++) e.setCellData(l, i, a)
            } catch (e) {}
          },
          handleHeadMerge = function (e, t) {
            var n = e.customHeaderRootIden,
              o = e.customHeaderDatas
            if (n && o) {
              t.allowMerging = wijmo.grid.AllowMerging.ColumnHeaders
              for (var r = t.columnHeaders, a = 0; a < t.columns.length; a++)
                t.columns[a].allowMerging = !0
              var l = e.columns.length - 1,
                i = 0,
                u = 0,
                d = o[n].child,
                f = function e(t) {
                  var n = 0,
                    r = t.child
                  if (r.length > 0) {
                    for (var a = 0, l = r.length; a < l; a++) {
                      n += e(o[r[a]])
                    }
                    return n
                  }
                  return 1
                },
                c = [],
                s = null,
                p = 0
              if (
                ((function t(n) {
                  if (n && n.length > 0) {
                    var a = new wijmo.grid.Row()
                    ;(a.allowMerging = !0), r.rows.insert(i, a)
                    var d = []
                    if ('Multi' === e.selectionMode)
                      for (
                        u = 1, 0 == i && (s = r), setHeader(r, i, 0, i, 0, '');
                        u <= l && c[u];

                      )
                        setHeader(r, i, u, i, u, c[u]), u++
                    else
                      for (u = 0; u <= l && c[u]; )
                        setHeader(r, i, u, i, u, c[u]), u++
                    for (var g = 0, m = n.length; g < m; g++) {
                      var v = u,
                        h = o[n[g]],
                        _ = h.child,
                        w = u + f(h) - 1
                      if (_ && _.length > 0)
                        for (var y = 0; y < _.length; y++) {
                          var C = o[_[y]]
                          C.child && C.child.length > 0
                            ? (d.push(_[y]), (v += f(C)))
                            : ((c[v] = C.name), v++)
                        }
                      else (c[v] = h.name), v++
                      for (
                        setHeader(r, i, u, i, w, h.name), u = w + 1;
                        u <= l && c[u];

                      )
                        setHeader(r, i, u, i, u, c[u]), u++
                    }
                    i++, p++, t(d)
                  }
                })(d),
                'Multi' === e.selectionMode && 0 != s)
              )
                try {
                  setHeader(s, i, 0, p + 1, 0, '')
                } catch (e) {}
            }
          },
          getFieldMapping = function (e) {
            var t = [],
              n = {}
            if (e.$slots.default)
              for (var o = 0, r = e.$slots.default.length; o < r; o++) {
                var a = e.$slots.default[o],
                  l = a.tag,
                  i = getColumnType(l)
                if ('common' == i) {
                  var u = a.componentOptions.propsData,
                    d = u.field
                  d && (t.push(d), u.widgetCode && (n[u.widgetCode] = d))
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
              var o = e.$root._$getEntityFieldType(n)
              if (o)
                switch (o[t]) {
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
            return '2.0' != _v3platform2.default.getVuiVersion(e)
          },
          evalExp = function evalExp(exp, data) {
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
            for (var n = !1, o = 0, r = e.percentColumns.length; o < r; o++)
              if (t === e.percentColumns[o]) {
                n = !0
                break
              }
            return n
          },
          isImgColumn = function (e, t) {
            for (var n = !1, o = 0, r = e.imgColumns.length; o < r; o++)
              if (t === e.imgColumns[o]) {
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
              o = e.$el
            if (o)
              return o.getClientRects().length
                ? ((t = o.getBoundingClientRect()),
                  (n = o.ownerDocument.defaultView),
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
                  var o = e.currentRowId,
                    r = e.columns.length,
                    a = 0,
                    l = n.length;
                  a < l;
                  a++
                ) {
                  var i = n[a]
                  if (o == i.dataItem.id) {
                    t.selection = new wijmo.grid.CellRange(a, 0, a, r)
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
          updateColumnAttribute = function (e, t, n, o) {
            var r = e.columns
            if (r && r.length > 0 && t && n)
              for (var a = 0, l = r.length; a < l; a++) {
                var i = r[a],
                  u = i.field
                if (u == t) {
                  i[n] = o
                  var d = getGridObj(e)
                  if (d) {
                    var f = d.columns.getColumn(u)
                    f && (f[n] = o)
                  }
                  return !0
                }
              }
          },
          addLinkSpan = function (e, t, n, o) {
            var r = e
            if (e && '' != e && t && '' != t) {
              var a = 'event_' + _Format2.default.genUUID()
              ;(window[a] = (function (e) {
                return function () {
                  'Multi' !== n.selectionMode && n.handlerSelectionChange(), e()
                }
              })(t)),
                n.linkEventNames.push(a)
              r =
                '<a ' +
                ('tree' == o ? '' : "class='grid-linkText'") +
                " onclick='" +
                a +
                "()'>" +
                e +
                '</a>'
            }
            return r
          },
          onCellValueChange = function (e, t, n, o, r) {
            var a = r.valueChangeEventField[e]
            'function' == typeof a && a.apply(r, [t, n, o])
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
        exports.default = {
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
      'Ug0N': function (e, t) {
        e.exports = __WEBPACK_EXTERNAL_MODULE_Ug0N__
      }
    })
  }
)
//# sourceMappingURL=GridUtils.js.map
