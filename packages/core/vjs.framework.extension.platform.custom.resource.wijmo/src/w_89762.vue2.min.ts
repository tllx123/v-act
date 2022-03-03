/*
 *
 * Wijmo Library 5.20172.334
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 *
 * Licensed under the Wijmo Commercial License.
 * sales@wijmo.com
 * wijmo.com/products/wijmo-5/license/
 *
 */
var wijmo
;(function (wijmo) {
  var vue2
  ;(function (vue2) {
    function _getProps(ctlClass, extraProps) {
      for (
        var p, proto, props, cls = window, ns = ctlClass.split('.'), i = 0;
        i < ns.length && cls != null;
        i++
      )
        cls = cls[ns[i]]
      if (!cls) return null
      for (
        p = ['control', 'initialized'], proto = cls.prototype;
        proto != Object.prototype;
        proto = Object.getPrototypeOf(proto)
      )
        for (
          props = Object.getOwnPropertyNames(proto), i = 0;
          i < props.length;
          i++
        ) {
          var prop = props[i],
            pd = Object.getOwnPropertyDescriptor(proto, prop),
            eventRaiser = prop.match(/^on[A-Z]/)
          ;(pd.set || eventRaiser) &&
            (eventRaiser && (prop = prop[2].toLowerCase() + prop.substr(3)),
            p.indexOf(prop) < 0 &&
              !prop.match(/disabled|required/) &&
              p.push(prop))
        }
      return extraProps && Array.prototype.push.apply(p, extraProps), p
    }
    function _initialize(component, ctl) {
      function _updateControl(newValue) {
        this.ctl[this.prop] = newValue
      }
      var props = []
      for (var prop in component.$options.propsData) props.push(prop)
      return (
        props.sort(),
        props.forEach(function (prop) {
          !(prop in ctl) ||
            ctl[prop] instanceof wijmo.Event ||
            wijmo.isUndefined(component[prop]) ||
            ((ctl[prop] = component[prop]),
            component.$watch(
              prop,
              _updateControl.bind({
                ctl: ctl,
                prop: prop
              })
            ))
        }),
        props.forEach(function (prop) {
          if (ctl[prop] instanceof wijmo.Event) {
            var event = ctl[prop]
            wijmo.isFunction(component[prop]) &&
              event.addHandler(component[prop], ctl)
          }
        }),
        component.control &&
          component.$parent &&
          (component.$parent[component.control] = ctl),
        wijmo.isFunction(component.initialized) && component.initialized(ctl),
        ctl
      )
    }
    vue2._getProps = _getProps
    vue2._initialize = _initialize
  })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
})(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjInclude = Vue.component('wj-include', {
        template: '<div/>',
        props: ['src'],
        mounted: function () {
          var _this = this
          wijmo.httpRequest(this.src, {
            success: function (xhr) {
              _this.$el.innerHTML = xhr.response
            }
          })
        }
      })
      vue2.WjFormat = Vue.filter('wj-format', function (value, format) {
        return wijmo.Globalize.format(value, format)
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjComboBox = Vue.component('wj-combo-box', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.ComboBox'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.ComboBox(this.$el))
        }
      })
      vue2.WjAutoComplete = Vue.component('wj-auto-complete', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.AutoComplete'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.AutoComplete(this.$el))
        }
      })
      vue2.WjCalendar = Vue.component('wj-calendar', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.Calendar'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.Calendar(this.$el))
        }
      })
      vue2.WjColorPicker = Vue.component('wj-color-picker', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.ColorPicker'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.ColorPicker(this.$el))
        }
      })
      vue2.WjInputMask = Vue.component('wj-input-mask', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.InputMask'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.InputMask(this.$el))
        }
      })
      vue2.WjInputColor = Vue.component('wj-input-color', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.InputColor'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.InputColor(this.$el))
        }
      })
      vue2.WjMultiSelect = Vue.component('wj-multi-select', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.MultiSelect'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.MultiSelect(this.$el))
        }
      })
      vue2.WjMultiAutoComplete = Vue.component('wj-multi-auto-complete', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.MultiAutoComplete'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.MultiAutoComplete(this.$el))
        }
      })
      vue2.WjInputNumber = Vue.component('wj-input-number', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.InputNumber'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.InputNumber(this.$el))
        }
      })
      vue2.WjInputDate = Vue.component('wj-input-date', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.InputDate'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.InputDate(this.$el))
        }
      })
      vue2.WjInputTime = Vue.component('wj-input-time', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.InputTime'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.InputTime(this.$el))
        }
      })
      vue2.WjInputDateTime = Vue.component('wj-input-date-time', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.InputDateTime'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.InputDateTime(this.$el))
        }
      })
      vue2.WjListBox = Vue.component('wj-list-box', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.ListBox'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.ListBox(this.$el))
        }
      })
      vue2.WjMenu = Vue.component('wj-menu', {
        template: '<div/>',
        props: vue2._getProps('wijmo.input.Menu'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.Menu(this.$el))
        }
      })
      vue2.WjPopup = Vue.component('wj-popup', {
        template: '<div><slot/></div>',
        props: vue2._getProps('wijmo.input.Popup'),
        mounted: function () {
          vue2._initialize(this, new wijmo.input.Popup(this.$el))
        }
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjFlexGrid = Vue.component('wj-flex-grid', {
        template: '<div><slot/></div>',
        props: vue2._getProps('wijmo.grid.FlexGrid'),
        mounted: function () {
          var _this = this,
            autoGenerateColumns = !0,
            ctl
          this.$children.forEach(function (item) {
            switch (item.$options.name) {
              case 'wj-flex-grid-column':
                autoGenerateColumns = !1
            }
          })
          ctl = new wijmo.grid.FlexGrid(this.$el, {
            autoGenerateColumns: autoGenerateColumns
          })
          this.$children.forEach(function (item) {
            var col, filter
            switch (item.$options.name) {
              case 'wj-flex-grid-column':
                col = vue2._initialize(item, new wijmo.grid.Column())
                ctl.columns.push(col)
                break
              case 'wj-flex-grid-filter':
                filter = vue2._initialize(
                  item,
                  new wijmo.grid.filter.FlexGridFilter(ctl)
                )
            }
            _this.$el.removeChild(item.$el)
          })
          vue2._initialize(this, ctl)
        }
      })
      vue2.WjFlexGridColumn = Vue.component('wj-flex-grid-column', {
        template: '<div/>',
        props: vue2._getProps('wijmo.grid.Column')
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjFlexGridFilter = Vue.component('wj-flex-grid-filter', {
        template: '<div/>',
        props: vue2._getProps('wijmo.grid.filter.FlexGridFilter')
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjGroupPanel = Vue.component('wj-group-panel', {
        template: '<div/>',
        props: vue2._getProps('wijmo.grid.grouppanel.GroupPanel'),
        mounted: function () {
          vue2._initialize(this, new wijmo.grid.grouppanel.GroupPanel(this.$el))
        }
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjFlexChart = Vue.component('wj-flex-chart', {
        template: '<div><slot/></div>',
        props: vue2._getProps('wijmo.chart.FlexChart', ['tooltipContent']),
        mounted: function () {
          var _this = this,
            ctl = new wijmo.chart.FlexChart(this.$el)
          this.$children.forEach(function (item) {
            var series, style, legend, axis
            switch (item.$options.name) {
              case 'wj-flex-chart-series':
                series = vue2._initialize(item, new wijmo.chart.Series())
                item.$el.style.cssText.length &&
                  ((style = {}),
                  item.$el.style.cssText.split(';').forEach(function (prop) {
                    var kv = prop.split(':')
                    kv.length == 2 && (style[kv[0].trim()] = kv[1].trim())
                  }),
                  (series.style = style))
                ctl.series.push(series)
                break
              case 'wj-flex-chart-legend':
                legend = vue2._initialize(item, new wijmo.chart.Legend(null))
                ctl.legend = legend
                break
              case 'wj-flex-chart-axis':
                axis = vue2._initialize(item, new wijmo.chart.Axis())
                item.wjProperty
                  ? (ctl[item.wjProperty] = axis)
                  : ctl.axes.push(axis)
            }
            _this.$el.removeChild(item.$el)
          })
          this.tooltipContent && (ctl.tooltip.content = this.tooltipContent)
          vue2._initialize(this, ctl)
        }
      })
      vue2.WjFlexChartAxis = Vue.component('wj-flex-chart-axis', {
        template: '<div/>',
        props: vue2._getProps('wijmo.chart.Axis', ['wjProperty'])
      })
      vue2.WjFlexChartLegend = Vue.component('wj-flex-chart-legend', {
        template: '<div/>',
        props: vue2._getProps('wijmo.chart.Legend')
      })
      vue2.WjFlexChartSeries = Vue.component('wj-flex-chart-series', {
        template: '<div/>',
        props: vue2._getProps('wijmo.chart.Series')
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      function _addRanges(component, ctl) {
        component.$children.forEach(function (item) {
          switch (item.$options.name) {
            case 'wj-range':
              var range = vue2._initialize(item, new wijmo.gauge.Range())
              item.wjProperty
                ? (ctl[item.wjProperty] = range)
                : ctl.ranges.push(range)
          }
          component.$el.removeChild(item.$el)
        })
      }
      vue2.WjLinearGauge = Vue.component('wj-linear-gauge', {
        template: '<div><slot/></div>',
        props: vue2._getProps('wijmo.gauge.LinearGauge'),
        mounted: function () {
          var ctl = new wijmo.gauge.LinearGauge(this.$el)
          _addRanges(this, ctl)
          vue2._initialize(this, ctl)
        }
      })
      vue2.WjBulletGraph = Vue.component('wj-bullet-graph', {
        template: '<div><slot/></div>',
        props: vue2._getProps('wijmo.gauge.BulletGraph'),
        mounted: function () {
          var ctl = new wijmo.gauge.BulletGraph(this.$el)
          _addRanges(this, ctl)
          vue2._initialize(this, ctl)
        }
      })
      vue2.WjRadialGauge = Vue.component('wj-radial-gauge', {
        template: '<div><slot/></div>',
        props: vue2._getProps('wijmo.gauge.RadialGauge'),
        mounted: function () {
          var ctl = new wijmo.gauge.RadialGauge(this.$el)
          _addRanges(this, ctl)
          vue2._initialize(this, ctl)
        }
      })
      vue2.WjRange = Vue.component('wj-range', {
        template: '<div/>',
        props: vue2._getProps('wijmo.gauge.Range', ['wjProperty'])
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjPivotGrid = Vue.component('wj-pivot-grid', {
        template: '<div/>',
        props: vue2._getProps('wijmo.olap.PivotGrid'),
        mounted: function () {
          vue2._initialize(this, new wijmo.olap.PivotGrid(this.$el))
        }
      })
      vue2.WjPivotChart = Vue.component('wj-pivot-chart', {
        template: '<div/>',
        props: vue2._getProps('wijmo.olap.PivotChart'),
        mounted: function () {
          vue2._initialize(this, new wijmo.olap.PivotChart(this.$el))
        }
      })
      vue2.WjPivotPanel = Vue.component('wj-pivot-panel', {
        template: '<div/>',
        props: vue2._getProps('wijmo.olap.PivotPanel'),
        mounted: function () {
          vue2._initialize(this, new wijmo.olap.PivotPanel(this.$el))
        }
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjReportViewer = Vue.component('wj-report-viewer', {
        template: '<div/>',
        props: vue2._getProps('wijmo.viewer.ReportViewer'),
        mounted: function () {
          vue2._initialize(this, new wijmo.viewer.ReportViewer(this.$el))
        }
      })
      vue2.WjPdfViewer = Vue.component('wj-pdf-viewer', {
        template: '<div/>',
        props: vue2._getProps('wijmo.viewer.PdfViewer'),
        mounted: function () {
          vue2._initialize(this, new wijmo.viewer.PdfViewer(this.$el))
        }
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {})),
  (function (wijmo) {
    var vue2
    ;(function (vue2) {
      vue2.WjTreeView = Vue.component('wj-tree-view', {
        template: '<div/>',
        props: vue2._getProps('wijmo.nav.TreeView'),
        mounted: function () {
          vue2._initialize(this, new wijmo.nav.TreeView(this.$el))
        }
      })
    })((vue2 = wijmo.vue2 || (wijmo.vue2 = {})))
  })(wijmo || (wijmo = {}))
