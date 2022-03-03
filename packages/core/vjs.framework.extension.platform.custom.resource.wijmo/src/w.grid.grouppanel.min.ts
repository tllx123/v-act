/*
 *
 * Wijmo Library 5.20181.436
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 *
 * Licensed under the GrapeCity Commercial License.
 * sales@wijmo.com
 * wijmo.com/products/wijmo-5/license/
 *
 */
var __extends =
    (this && this.__extends) ||
    (function () {
      var e =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (e, t) {
            e.__proto__ = t
          }) ||
        function (e, t) {
          for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i])
        }
      return function (t, i) {
        function r() {
          this.constructor = t
        }
        e(t, i),
          (t.prototype =
            null === i
              ? Object.create(i)
              : ((r.prototype = i.prototype), new r()))
      }
    })(),
  wijmo
!(function (e) {
  !(function (t) {
    !(function (i) {
      'use strict'
      var r = (function (i) {
        function r(r, n) {
          var o = i.call(this, r) || this
          ;(o._hideGroupedCols = !0), (o._maxGroups = 6), (o._hiddenCols = [])
          e.assert(
            null != t,
            'Missing dependency: GroupPanel requires wijmo.grid.'
          )
          var s = o.getTemplate()
          o.applyTemplate('wj-grouppanel wj-control', s, {
            _divMarkers: 'div-markers',
            _divPH: 'div-ph'
          })
          var a = o.hostElement
          return (
            o.addEventListener(a, 'dragstart', o._dragStart.bind(o)),
            o.addEventListener(a, 'dragover', o._dragOver.bind(o)),
            o.addEventListener(a, 'drop', o._drop.bind(o)),
            o.addEventListener(a, 'dragend', o._dragEnd.bind(o)),
            o.addEventListener(a, 'click', o._click.bind(o)),
            o.initialize(n),
            o
          )
        }
        return (
          __extends(r, i),
          Object.defineProperty(r.prototype, 'hideGroupedColumns', {
            get: function () {
              return this._hideGroupedCols
            },
            set: function (t) {
              t != this._hideGroupedCols &&
                (this._hideGroupedCols = e.asBoolean(t))
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(r.prototype, 'maxGroups', {
            get: function () {
              return this._maxGroups
            },
            set: function (t) {
              t != this._maxGroups && (this._maxGroups = e.asNumber(t))
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(r.prototype, 'placeholder', {
            get: function () {
              return this._divPH.textContent
            },
            set: function (e) {
              this._divPH.textContent = e
            },
            enumerable: !0,
            configurable: !0
          }),
          Object.defineProperty(r.prototype, 'grid', {
            get: function () {
              return this._g
            },
            set: function (i) {
              ;(i = e.asType(i, t.FlexGrid, !0)) != this._g &&
                (this._g &&
                  (this._g.draggingColumn.removeHandler(this._draggingColumn),
                  this._g.sortedColumn.removeHandler(this.invalidate),
                  this._g.itemsSourceChanging.removeHandler(
                    this._itemsSourceChanging
                  ),
                  this._g.itemsSourceChanged.removeHandler(
                    this._itemsSourceChanged
                  ),
                  this._g.columns.collectionChanged.removeHandler(
                    this._itemsSourceChanged
                  )),
                (this._g = i),
                (this._hiddenCols = []),
                this._g &&
                  (this._g.draggingColumn.addHandler(
                    this._draggingColumn,
                    this
                  ),
                  this._g.sortedColumn.addHandler(this.invalidate, this),
                  this._g.itemsSourceChanging.addHandler(
                    this._itemsSourceChanging,
                    this
                  ),
                  this._g.itemsSourceChanged.addHandler(
                    this._itemsSourceChanged,
                    this
                  ),
                  this._g.columns.collectionChanged.addHandler(
                    this._itemsSourceChanged,
                    this
                  )),
                this._itemsSourceChanged(this._g, null))
            },
            enumerable: !0,
            configurable: !0
          }),
          (r.prototype.refresh = function () {
            if (
              (i.prototype.refresh.call(this),
              (this._divMarkers.innerHTML = ''),
              (this._dragMarker = this._dragCol = null),
              this._gds)
            ) {
              for (var t = 0; t < this._gds.length; t++) {
                for (
                  var r = this._gds[t],
                    n = this._g.columnHeaders,
                    o = -1,
                    s = -1,
                    a = n.rows.length - 1;
                  a >= 0 && s < 0;
                  a--
                )
                  for (var d = 0; d < n.columns.length && s < 0; d++) {
                    var l = this._g._getBindingColumn(n, a, n.columns[d])
                    if (l && l.binding == r.propertyName) {
                      ;(s = d), (o = a)
                      break
                    }
                  }
                if (s > -1 && o > -1) {
                  var h = document.createElement('div')
                  this._g.cellFactory.updateCell(
                    this._g.columnHeaders,
                    o,
                    s,
                    h
                  ),
                    h.setAttribute('class', 'wj-cell wj-header wj-groupmarker'),
                    e.setCss(h, {
                      position: 'static',
                      display: 'inline-block',
                      verticalAlign: 'top',
                      left: '',
                      top: '',
                      right: '',
                      height: 'auto',
                      width: 'auto'
                    })
                  var g = h.querySelector('.wj-elem-filter')
                  g && e.removeChild(g)
                  e.createElement(
                    '<span wj-remove="" style="font-weight:normal;cursor:pointer;pointer;padding:12px;padding-right:3px">&times;</span>',
                    h
                  )
                  this._divMarkers.appendChild(h)
                }
              }
              this._divMarkers.children.length > 0
                ? ((this._divPH.style.display = 'none'),
                  (this._divMarkers.style.display = ''))
                : ((this._divPH.style.display = ''),
                  (this._divMarkers.style.display = 'none'))
            }
          }),
          (r.prototype._addGroup = function (t, i) {
            for (
              var r = this._getIndex(i), n = this._gds, o = 0;
              o < n.length;
              o++
            )
              if (n[o].propertyName == t.binding) {
                n.removeAt(o), o < r && r--
                break
              }
            for (o = this.maxGroups - 1; o < n.length; o++)
              this._removeGroup(o, n), o < r && r--
            n.deferUpdate(function () {
              var i = new e.collections.PropertyGroupDescription(t.binding)
              n.insert(r, i)
            }),
              t &&
                this.hideGroupedColumns &&
                ((t.visible = !1), this._hiddenCols.push(t)),
              this.invalidate()
          }),
          (r.prototype._moveGroup = function (e, t) {
            var i = this._gds,
              r = this._getElementIndex(this._dragMarker),
              n = this._getIndex(t)
            n > r && n--,
              n >= this._gds.length && (n = this._gds.length),
              r != n &&
                i.deferUpdate(function () {
                  var e = i[r]
                  i.removeAt(r), i.insert(n, e)
                })
          }),
          (r.prototype._removeGroup = function (e, t) {
            void 0 === t && (t = this._gds)
            var i = null
            t && e > -1 && ((i = t[e]), t.removeAt(e))
            var r = i ? i.propertyName : null,
              n = r ? this._g.columns.getColumn(r) : null
            if (n) {
              n.visible = !0
              var o = this._hiddenCols.indexOf(n)
              o > -1 && this._hiddenCols.splice(o, 1)
            }
          }),
          (r.prototype._getIndex = function (e) {
            for (var t = this._divMarkers.children, i = 0; i < t.length; i++) {
              var r = t[i].getBoundingClientRect()
              if (e.clientX < r.left + r.width / 2) return i
            }
            return t.length
          }),
          (r.prototype._getElementIndex = function (e) {
            if (e && e.parentElement)
              for (var t = e.parentElement.children, i = 0; i < t.length; i++)
                if (t[i] == e) return i
            return -1
          }),
          (r.prototype._draggingColumn = function (e, t) {
            var i = this._g,
              r = i._getBindingColumn(t.panel, t.row, i.columns[t.col])
            this._dragCol = r.binding ? r : null
          }),
          (r.prototype._itemsSourceChanging = function (e, t) {
            this._hiddenCols.forEach(function (e) {
              e.visible = !0
            }),
              (this._hiddenCols = [])
          }),
          (r.prototype._itemsSourceChanged = function (e, t) {
            this._gds &&
              this._gds.collectionChanged.removeHandler(this._groupsChanged),
              (this._gds = null),
              this._g.collectionView &&
                ((this._gds = this._g.collectionView.groupDescriptions),
                this._gds.collectionChanged.addHandler(
                  this._groupsChanged,
                  this
                )),
              this.invalidate()
          }),
          (r.prototype._groupsChanged = function (e, t) {
            this.invalidate()
          }),
          (r.prototype._dragStart = function (t) {
            e._startDrag(t.dataTransfer, 'move'),
              (this._dragMarker = t.target),
              (this._dragCol = null)
          }),
          (r.prototype._dragOver = function (e) {
            ;(this._dragCol || this._dragMarker) &&
              ((e.dataTransfer.dropEffect = 'move'),
              e.preventDefault(),
              e.stopPropagation())
          }),
          (r.prototype._drop = function (e) {
            this._dragMarker
              ? this._moveGroup(this._dragMarker, e)
              : this._dragCol && this._addGroup(this._dragCol, e)
          }),
          (r.prototype._dragEnd = function (e) {
            this._dragMarker = this._dragCol = null
          }),
          (r.prototype._click = function (t) {
            var i = t.target,
              r = null != i.getAttribute('wj-remove'),
              n = e.closest(i, '.wj-cell')
            if (e.hasClass(n, 'wj-cell')) {
              var o = this._getElementIndex(n),
                s = this._g.collectionView.sortDescriptions
              if (r) this._removeGroup(o)
              else if (t.ctrlKey) s.clear(), this.invalidate()
              else {
                for (var a = this._gds[o], d = !0, l = 0; l < s.length; l++)
                  if (s[l].property == a.propertyName) {
                    d = !s[l].ascending
                    break
                  }
                var h = new e.collections.SortDescription(a.propertyName, d)
                s.splice(0, s.length, h), this.invalidate()
              }
            }
          }),
          (r.controlTemplate =
            '<div style="cursor:default;overflow:hidden;height:100%;width:100%;min-height:1em"><div wj-part="div-ph"></div><div wj-part="div-markers"></div></div>'),
          r
        )
      })(e.Control)
      i.GroupPanel = r
    })(t.grouppanel || (t.grouppanel = {}))
  })(e.grid || (e.grid = {}))
})(wijmo || (wijmo = {}))
