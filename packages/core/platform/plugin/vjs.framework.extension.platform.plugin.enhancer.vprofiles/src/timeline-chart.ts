;(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['module'], factory)
  } else if (typeof exports !== 'undefined') {
    factory(module)
  } else {
    var mod = {
      exports: {}
    }
    factory(mod)
    //@ts-ignore
    global.TimelineChart = mod.exports
  }
})(this, function (module) {
  'use strict'

  function _classCallCheck(instance: any, Constructor: Function) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function')
    }
  }

  let _createClass = (function () {
    function defineProperties(
      target: Record<string, any>,
      props: Record<string, any>
    ) {
      for (let i = 0; i < props.length; i++) {
        let descriptor = props[i]
        descriptor.enumerable = descriptor.enumerable || false
        descriptor.configurable = true
        if ('value' in descriptor) descriptor.writable = true
        Object.defineProperty(target, descriptor.key, descriptor)
      }
    }

    return function (
      Constructor: Function,
      protoProps: Record<string, any>,
      staticProps: Record<string, any>
    ) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps)
      if (staticProps) defineProperties(Constructor, staticProps)
      return Constructor
    }
  })()

  let TimelineChart = (function () {
    function TimelineChart(
      element: any,
      data: Array<any>,
      opts: Record<string, any>
    ) {
      _classCallCheck(this, TimelineChart)

      let self = this

      element.classList.add('timeline-chart')

      let options = this.extendOptions(opts)

      let allElements = data.reduce(function (agg, e) {
        return agg.concat(e.data)
      }, [])

      let minDt = d3.min(allElements, this.getPointMinDt)
      let maxDt = d3.max(allElements, this.getPointMaxDt)

      let elementWidth = options.width || element.clientWidth
      let elementHeight = options.height || element.clientHeight

      let margin = {
        top: 0,
        right: 0,
        bottom: 20,
        left: 0
      }

      let width = elementWidth - margin.left - margin.right
      let height = elementHeight - margin.top - margin.bottom

      let groupWidth = 200
      //@ts-ignore
      let x = d3.time.scale().domain([minDt, maxDt]).range([groupWidth, width])
      //@ts-ignore
      let xAxis = d3.svg.axis().scale(x).orient('bottom').tickSize(-height)
      //@ts-ignore
      let zoom = d3.behavior.zoom().x(x).on('zoom', zoomed)
      //@ts-ignore
      let svg = d3
        .select(element)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(zoom)

      svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'chart-content')
        .append('rect')
        .attr('x', groupWidth)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width - groupWidth)

      svg
        .append('rect')
        .attr('class', 'chart-bounds')
        .attr('x', groupWidth)
        .attr('y', 0)
        .attr('height', height)
        .attr('width', width - groupWidth)

      svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)

      if (options.enableLiveTimer) {
        self.now = svg
          .append('line')
          .attr('clip-path', 'url(#chart-content)')
          .attr('class', 'vertical-marker now')
          .attr('y1', 0)
          .attr('y2', height)
      }

      let groupHeight = height / data.length
      let groupSection = svg
        .selectAll('.group-section')
        .data(data)
        .enter()
        .append('line')
        .attr('class', 'group-section')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', function (d: any, i: number) {
          return groupHeight * (i + 1)
        })
        .attr('y2', function (d: any, i: number) {
          return groupHeight * (i + 1)
        })

      let groupLabels = svg
        .selectAll('.group-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'group-label')
        .attr('x', 0)
        .attr('y', function (d: any, i: number) {
          return groupHeight * i + groupHeight / 2 + 5.5
        })
        .attr('dx', '0.5em')
        .text(function (d: any) {
          return d.label
        })

      let lineSection = svg
        .append('line')
        .attr('x1', groupWidth)
        .attr('x2', groupWidth)
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'black')

      let groupIntervalItems = svg
        .selectAll('.group-interval-item')
        .data(data)
        .enter()
        .append('g')
        .attr('clip-path', 'url(#chart-content)')
        .attr('class', 'item')
        .attr('transform', function (d: any, i: number) {
          return 'translate(0, ' + groupHeight * i + ')'
        })
        .selectAll('.dot')
        .data(function (d: any) {
          return d.data.filter(function (_: any) {
            return _.type === TimelineChart.TYPE.INTERVAL
          })
        })
        .enter()

      let intervalBarHeight = 0.8 * groupHeight
      let intervalBarMargin = (groupHeight - intervalBarHeight) / 2
      let intervals = groupIntervalItems
        .append('rect')
        .attr('class', withCustom('interval'))
        .attr('width', function (d: any) {
          return Math.max(options.intervalMinWidth, x(d.to) - x(d.from))
        })
        .attr('height', intervalBarHeight)
        .attr('y', intervalBarMargin)
        .attr('x', function (d: any) {
          return x(d.from)
        })
      //add by xiedh
      if (options.tip || options.dblclick) {
        let tip
        //@ts-ignore
        if (d3.tip) {
          //@ts-ignore
          tip = d3.tip().attr('class', 'd3-tip').html(options.tip)
          svg.call(tip)
          intervals.on('mouseover', tip.show).on('mouseout', tip.hide)
        } else {
          console.error(
            'Please make sure you have d3.tip included as dependency (https://github.com/Caged/d3-tip)'
          )
        }
        let func = options.dblclick,
          hideFn = tip ? tip.hide : null
        if (func) {
          intervals.on('dblclick', function () {
            if (hideFn) {
              hideFn()
            }
            func.apply(this, arguments)
          })
        }
      }
      //end
      let intervalTexts = groupIntervalItems
        .append('text')
        .text(function (d: any) {
          return d.label
        })
        .attr('fill', 'white')
        .attr('class', withCustom('interval-text'))
        .attr('y', groupHeight / 2 + 5)
        .attr('x', function (d: any) {
          return x(d.from)
        })

      let groupDotItems = svg
        .selectAll('.group-dot-item')
        .data(data)
        .enter()
        .append('g')
        .attr('clip-path', 'url(#chart-content)')
        .attr('class', 'item')
        .attr('transform', function (d: any, i: number) {
          return 'translate(0, ' + groupHeight * i + ')'
        })
        .selectAll('.dot')
        .data(function (d: any) {
          return d.data.filter(function (_: any) {
            return _.type === TimelineChart.TYPE.POINT
          })
        })
        .enter()

      let dots = groupDotItems
        .append('circle')
        .attr('class', withCustom('dot'))
        .attr('cx', function (d: any) {
          return x(d.at)
        })
        .attr('cy', groupHeight / 2)
        .attr('r', 5)
      if (options.tip) {
        //@ts-ignore
        if (d3.tip) {
          //@ts-ignore
          let tip = d3.tip().attr('class', 'd3-tip').html(options.tip)
          svg.call(tip)
          dots.on('mouseover', tip.show).on('mouseout', tip.hide)
        } else {
          console.error(
            'Please make sure you have d3.tip included as dependency (https://github.com/Caged/d3-tip)'
          )
        }
      }

      zoomed()

      if (options.enableLiveTimer) {
        setInterval(updateNowMarker, options.timerTickInterval)
      }

      function updateNowMarker() {
        let nowX = x(new Date())

        self.now.attr('x1', nowX).attr('x2', nowX)
      }

      function withCustom(defaultClass: string) {
        return function (d: any) {
          return d.customClass
            ? [d.customClass, defaultClass].join(' ')
            : defaultClass
        }
      }

      function zoomed() {
        //@ts-ignore
        if (self.onVizChangeFn && d3.event) {
          self.onVizChangeFn.call(self, {
            //@ts-ignore
            scale: d3.event.scale,
            //@ts-ignore
            translate: d3.event.translate,
            domain: x.domain()
          })
        }

        if (options.enableLiveTimer) {
          updateNowMarker()
        }

        svg.select('.x.axis').call(xAxis)

        svg.selectAll('circle.dot').attr('cx', function (d: any) {
          return x(d.at)
        })
        svg
          .selectAll('rect.interval')
          .attr('x', function (d: any) {
            return x(d.from)
          })
          .attr('width', function (d: any) {
            return Math.max(options.intervalMinWidth, x(d.to) - x(d.from))
          })

        svg
          .selectAll('.interval-text')
          .attr('x', function (d: any) {
            var positionData = getTextPositionData.call(this, d)
            if (
              positionData.upToPosition - groupWidth - 10 <
              positionData.textWidth
            ) {
              return positionData.upToPosition
            } else if (
              positionData.xPosition < groupWidth &&
              positionData.upToPosition > groupWidth
            ) {
              return groupWidth
            }
            return positionData.xPosition
          })
          .attr('text-anchor', function (d: any) {
            var positionData = getTextPositionData.call(this, d)
            if (
              positionData.upToPosition - groupWidth - 10 <
              positionData.textWidth
            ) {
              return 'end'
            }
            return 'start'
          })
          .attr('dx', function (d: any) {
            var positionData = getTextPositionData.call(this, d)
            if (
              positionData.upToPosition - groupWidth - 10 <
              positionData.textWidth
            ) {
              return '-0.5em'
            }
            return '0.5em'
          })
          .text(function (d: any) {
            let positionData = getTextPositionData.call(this, d)
            let percent =
              (positionData.width - options.textTruncateThreshold) /
              positionData.textWidth
            if (percent < 1) {
              if (positionData.width > options.textTruncateThreshold) {
                return (
                  d.label.substr(0, Math.floor(d.label.length * percent)) +
                  '...'
                )
              } else {
                return ''
              }
            }

            return d.label
          })

        function getTextPositionData(d: any) {
          this.textSizeInPx = this.textSizeInPx || this.getComputedTextLength()
          let from = x(d.from)
          let to = x(d.to)
          return {
            xPosition: from,
            upToPosition: to,
            width: to - from,
            textWidth: this.textSizeInPx
          }
        }
      }
    }

    _createClass(
      TimelineChart,
      [
        {
          key: 'extendOptions',
          value: function extendOptions() {
            var ext =
              arguments.length <= 0 || arguments[0] === undefined
                ? {}
                : arguments[0]

            var defaultOptions = {
              intervalMinWidth: 8, // px
              tip: undefined,
              textTruncateThreshold: 30,
              enableLiveTimer: false,
              timerTickInterval: 1000
            }
            Object.keys(ext).map(function (k) {
              return (defaultOptions[k] = ext[k])
            })
            return defaultOptions
          }
        },
        {
          key: 'getPointMinDt',
          value: function getPointMinDt(p) {
            return p.type === TimelineChart.TYPE.POINT ? p.at : p.from
          }
        },
        {
          key: 'getPointMaxDt',
          value: function getPointMaxDt(p) {
            return p.type === TimelineChart.TYPE.POINT ? p.at : p.to
          }
        },
        {
          key: 'onVizChange',
          value: function onVizChange(fn) {
            this.onVizChangeFn = fn
            return this
          }
        }
      ],
      {}
    )

    return TimelineChart
  })()

  TimelineChart.TYPE = {
    POINT: Symbol(),
    INTERVAL: Symbol()
  }

  module.exports = TimelineChart
})
//# sourceMappingURL=timeline-chart.js.map
