exports.initModule = function (sBox) {
  /**
   * 显示格式处理类
   */
  isc.ClassFactory.defineInterface('JGFormatHelper')
  isc.JGFormatHelper.addInterfaceProperties({})
  isc.JGFormatHelper.addInterfaceMethods({
    /**
     * 值格式化，统一调用的方法，会根据传入的numType来判断使用什么来格式化
     *
     * @param value
     * @param pattern
     * @param numType 0常规；1数值；2货币；3日期；4时间；5百分比；6文本;7自定义
     */
    valueFormat: function (value, pattern, numType) {
      switch (numType + '') {
        case '1':
          return this.numberFormat(value, pattern)
          break
        case '2':
          return this.moneyFormat(value, pattern)
          break
        case '3':
          return this.dateFormat(value, pattern)
          break
        case '4':
          return this.dateFormat(value, pattern)
          break
        case '5':
          return this.percentFormat(value, pattern)
          break
        case '7':
          if (pattern.indexOf('$') != -1 || pattern.indexOf('￥') != -1) {
            return this.moneyFormat(value, pattern)
          } else if (
            pattern == '0' ||
            pattern.indexOf('#0') != -1 ||
            pattern.indexOf('0.0') != -1
          ) {
            return this.numberFormat(value, pattern)
          } else {
            return this.dateFormat(value, pattern)
          }
          break
        case '8': //新增第8种显示格式是表达式解析出来的格式，按照第7种处理
          if (pattern.indexOf('$') != -1 || pattern.indexOf('￥') != -1) {
            return this.moneyFormat(value, pattern)
          } else if (
            pattern == '0' ||
            pattern.indexOf('#0') != -1 ||
            pattern.indexOf('0.0') != -1
          ) {
            if (pattern.endsWith('%')) {
              return this.percentFormat(value, pattern)
            } else {
              return this.numberFormat(value, pattern)
            }
          } else {
            return this.dateFormat(value, pattern)
          }
          break
        default:
          return value
          break
      }
    },

    pad: function (source, length) {
      let pre = '',
        negative = source < 0,
        string = String(Math.abs(source))

      if (string.length < length) {
        pre = new Array(length - string.length + 1).join('0')
      }

      return (negative ? '-' : '') + pre + string
    },

    /**
         * 对目标日期对象进行格式化
         * @param {Date} source 目标日期对象
         * @param {string} pattern 日期格式化规则
         * 
        <b>格式表达式，变量含义：</b><br><br>
        hh: 带 0 补齐的两位 12 进制时表示<br>
        h: 不带 0 补齐的 12 进制时表示<br>
        HH: 带 0 补齐的两位 24 进制时表示<br>
        H: 不带 0 补齐的 24 进制时表示<br>
        mm: 带 0 补齐两位分表示<br>
        m: 不带 0 补齐分表示<br>
        ss: 带 0 补齐两位秒表示<br>
        s: 不带 0 补齐秒表示<br>
        yyyy: 带 0 补齐的四位年表示<br>
        yy: 带 0 补齐的两位年表示<br>
        MM: 带 0 补齐的两位月表示<br>
        M: 不带 0 补齐的月表示<br>
        dd: 带 0 补齐的两位日表示<br>
        d: 不带 0 补齐的日表示
        tt: 上午下午
        t: AM PM
         *             
         * @returns {string} 格式化后的字符串
         */
    dateFormat: function (source, pattern) {
      // zhongl 如果source是string，先预处理一下，仅支持 '2012-05-18 09:30:13'或者'2012-05-18'
      if ('string' == typeof source) {
        let _source = source
        // zhongl 2012-05-29 可能会传入只有时间的，随便补一下日期
        if (!/\-/.test(source) && /\:/.test(source)) {
          _source = '2012-01-01 ' + source
        }
        let _t = _source.split(' '),
          _date = _t[0].split('-'),
          _time = _t.length == 2 ? _t[1].split(':') : ''
        if (_date.length != 3 || (_time != '' && _time.length != 3)) {
          return source
        }
        source =
          _time == ''
            ? new Date(_date[0], _date[1] - 1, _date[2])
            : new Date(
                _date[0],
                _date[1] - 1,
                _date[2],
                _time[0],
                _time[1],
                _time[2]
              )
      }

      if ('string' != typeof pattern) {
        return source.toString()
      }

      if (!source.getFullYear) {
        return source.toString()
      }

      function replacer(patternPart, result) {
        pattern = pattern.replace(patternPart, result)
      }

      let pad = this.pad
      ;(year = source.getFullYear()),
        (month = source.getMonth() + 1),
        (date2 = source.getDate()),
        (hours = source.getHours()),
        (minutes = source.getMinutes()),
        (seconds = source.getSeconds())

      replacer(/yyyy/g, pad(year, 4))
      replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2))
      replacer(/MM/g, pad(month, 2))
      replacer(/M/g, month)
      replacer(/dd/g, pad(date2, 2))
      replacer(/d/g, date2)

      //zhongl 2012-5-23 处理上下午
      if (/h/.test(pattern) && /t/.test(pattern)) {
        replacer(/tt/g, hours / 12 >= 1 ? '下午' : '上午')
        replacer(/t/g, hours / 12 >= 1 ? 'PM' : 'AM')
      }
      // 时间设置为24小时制，t配置无效，清空
      if (/H/.test(pattern) && /t/.test(pattern)) {
        replacer(/t/g, '')
      }

      replacer(/HH/g, pad(hours, 2))
      replacer(/H/g, hours)
      replacer(/hh/g, pad(hours == 12 ? 12 : hours % 12, 2)) // 这里有个小问题，12小时制的12点应该是12点而不是00点
      replacer(/h/g, hours == 12 ? 12 : hours % 12)
      replacer(/mm/g, pad(minutes, 2))
      replacer(/m/g, minutes)
      replacer(/ss/g, pad(seconds, 2))
      replacer(/s/g, seconds)

      return pattern
    },

    /**
     * 日期反格式化，
     * @param dateStr
     * @param pattern
     * @param defaultValue //如'2013-01-01'，传入默认要补全的year,month,day
     * @returns yyyy-MM-dd 或者 yyyy-MM-dd HH:mm:ss 或者 HH:mm:ss 格式的日期串
     */
    dateUnformat: function (dateStr, pattern, defaultValue) {
      if (!dateStr || !pattern) {
        return ''
      }
      if (
        pattern == 'yyyy-MM-dd' ||
        pattern == 'yyyy-MM-dd HH:mm:ss' ||
        pattern == 'HH:mm:ss'
      ) {
        return dateStr
      }
      let defaultYear = '',
        defaultMonth = '',
        defaultDay = ''
      if (defaultValue) {
        let _defaultDate = defaultValue.split('-')
        if (_defaultDate) {
          defaultYear = _defaultDate[0]
          defaultMonth = _defaultDate[1]
          defaultDay = _defaultDate[2]
        }
      }
      let supportPattern = /yyyy|yy|MM|M|dd|d|tt|t|HH|H|hh|h|mm|m|ss|s/g,
        full = {
          y: 'year',
          M: 'month',
          d: 'day',
          t: 'am-pm',
          H: 'hour',
          h: 'hour',
          m: 'minute',
          s: 'second'
        },
        match,
        i = 0,
        reg = '^',
        g = pattern.match(supportPattern),
        date = {}
      supportPattern.lastIndex = 0
      while ((match = supportPattern.exec(pattern)) !== null) {
        if (i >= 0) {
          reg += pattern.substring(i, match.index)
        }
        i = supportPattern.lastIndex
        switch (match[0]) {
          case 'yyyy':
            reg += '(\\d{4})'
            break
          case 'yy':
            reg += '(\\d{2})'
            break
          case 'tt':
            reg += '(上午|下午)'
            break
          case 't':
            reg += '(AM|PM)'
            break
          default:
            reg += '(\\d\\d?)'
            break
        }
      }
      reg += '.*$'
      match = new RegExp(reg).exec(dateStr)
      if (!match) {
        return dateStr
      }
      for (i = 0; i < g.length; i++) {
        let v = match[i + 1]
        if (v) {
          switch (g[i]) {
            case 'yy':
              if (v < 80) {
                v = parseInt(v) + 2000
                v = v + ''
              } else {
                v = parseInt(v) + 1900
                v = v + ''
              }
              date['year'] = v
              break
            default:
              date[full[g[i].slice(-1)]] = v
              break
          }
        }
      }
      let dayArr = [],
        timeArr = []
      if (defaultYear && !date['year']) {
        date['year'] = defaultYear
      }
      if (defaultMonth && !date['month']) {
        date['month'] = defaultMonth
      }
      if (defaultDay && !date['day']) {
        date['day'] = defaultDay
      }
      if (date['year'] && date['month'] && date['day']) {
        dayArr.push(date['year'])
        dayArr.push(date['month'])
        dayArr.push(date['day'])
      }
      if (date['hour'] && date['minute']) {
        timeArr.push(
          date['am-pm'] &&
            (date['am-pm'] == '下午' || date['am-pm'] == 'PM') &&
            date['hour'] != 12
            ? date['hour'] * 1 + 12
            : date['hour']
        )
        timeArr.push(date['minute'])
        timeArr.push(date['second'] ? date['second'] : '0')
      }

      if (dayArr.length != 0 && timeArr.length != 0) {
        return this.dateFormat(
          dayArr.join('-') + ' ' + timeArr.join(':'),
          'yyyy-MM-dd HH:mm:ss'
        )
      } else if (dayArr.length == 0) {
        return this.dateFormat(timeArr.join(':'), 'HH:mm:ss')
      } else if (timeArr.length == 0) {
        return this.dateFormat(dayArr.join('-'), 'yyyy-MM-dd')
      } else {
        return dateStr
      }
    },

    /**
     * 逆格式化值，将可能还原为数字的还原为数字
     *
     * @param value
     * @param decimal 这个暂时不用上 which part of the number is a decimal/float unformat("€ 1.000.000,00", ","); // 1000000
     * @return
     */
    numberUnformat: function (value, decimal) {
      // Fails silently (need decent errors):
      value = value || 0

      // Return the value as-is if it's already a number:
      if (typeof value === 'number') return value

      // zhaob 2012-11-29 针对100.00%的格式进行还原
      if (/^[0-9|\.]*%$/.test(value)) {
        value = value.replace(/%/, '')
        return this.movePoint(String(value), -2)
      }

      // Default decimal point is "." but could be set to eg. "," in opts:
      decimal = decimal || '.'

      // Build regex to strip out everything except digits, decimal point and minus sign:
      let regex = new RegExp('[^0-9-' + decimal + ']', ['g']),
        unformatted = parseFloat(
          ('' + value)
            .replace(/\((.*)\)/, '-$1') // replace bracketed values with negatives
            .replace(regex, '') // strip out any cruft
            .replace(decimal, '.') // make sure decimal point is standard
        )

      // This will fail silently which may cause trouble, let's wait and see:
      return !isNaN(unformatted) ? unformatted : 0
    },

    /**
         * 数字格式化
         * 
         * 格式：#,##0.0000;(#,##0.0000)|0
         * 由；和|分隔为3段：第一段表示正数的显示格式；第二段表示负数的显示格式；第三段表示负数的-或()颜色是否为红色。
           具体掩码说明如下：
           #,##：显示千分位分隔符
           0.0000：表示小数位数(4位)
           (0.0000)：负数用括号表示
           -0.0000：负数用“-”表示
           “|”后的一段表示负号或括号是否用红色显示(1红色，0默认色)
           
           第三段显示红色并不在这里处理
         * 
         * @param value
         * @param pattern
         */
    numberFormat: function (value, pattern) {
      if (isNaN(value)) {
        return value
      }
      let positive, negative, _t
      _t = pattern.split(';')
      positive = _t[0] // 正数格式，这个必须有；
      negative = _t.length > 1 ? _t[1].split('|')[0] : '-' + positive

      //var _positive = /^#\,##.*/.test(positive) ? '##'+positive : '#'+positive;
      //_positive = _positive.replace(/0/g, '#');
      //this._numberFormat(Math.abs(value), _positive);

      let thousand = /^#\,##.*/.test(positive) ? ',' : '',
        precision =
          positive.indexOf('.') < 0
            ? 0
            : positive.slice(positive.indexOf('.') + 1).length,
        opts = {
          precision: precision, // 精度（几位小数）
          grouping: 3, //这个目前是固定的
          thousand: thousand, //千分
          decimal: '.'
        },
        // Do some calc:
        base =
          parseInt(this.toFixed(Math.abs(value || 0), opts.precision), 10) + '',
        mod = base.length > 3 ? base.length % 3 : 0

      // Format the number:
      let formatValue =
        (mod ? base.substr(0, mod) + opts.thousand : '') +
        base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + opts.thousand) +
        (opts.precision
          ? opts.decimal +
            this.toFixed(Math.abs(value), opts.precision).split('.')[1]
          : '')

      if (value < 0) {
        formatValue = negative.replace(positive, formatValue)
      }
      return formatValue
    },

    /**
     * 数字串前补“0”
     */
    pad: function (source, length) {
      let pre = '',
        negative = source < 0,
        string = String(Math.abs(source))

      if (string.length < length) {
        pre = new Array(length - string.length + 1).join('0')
      }

      return (negative ? '-' : '') + pre + string
    },

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
     * problems for accounting- and finance-related software.
     */
    toFixed: function (value, precision) {
      let power = Math.pow(10, precision)
      // Multiply up by precision, round accurately, then divide and use native toFixed():
      return (Math.round(this.numberUnformat(value) * power) / power).toFixed(
        precision
      )
    },

    /**
     * 货币格式化
     *
     * 格式：￥0.00;(￥0.00)|0
     * 说明：由；和|分隔为3段：第一段表示正数的显示格式；第二段表示负数的显示格式；第三段表示负数的-或()颜色是否为红色。￥表示货币单位符号，其他说明同上。
     * 实质上就是货币符号加上格式化后的数字
     *
     * @param value
     * @param pattern
     */
    moneyFormat: function (value, pattern) {
      // 这里做个处理，货币符号字节可能为1位，也可能为2位
      // 替换掉所有的数字#.;|()-剩下的取一半就是货币符号
      let symbol = pattern.replace(/\-|\#|\,|\d|\.|\;|\(|\)|\|/g, '')
      symbol = symbol.substring(0, symbol.length / 2)
      let num_pattern = pattern.replace(new RegExp(symbol, 'g'), '')
      return symbol + this.numberFormat(this.numberUnformat(value), num_pattern)
    },

    /**
     * 百分比格式化
     *
     * 格式：0.000%
     * 数字加%
     * @param value
     * @param pattern
     */
    percentFormat: function (value, pattern) {
      let _value = this.movePoint(String(value), 2)
      return (
        this.numberFormat(
          this.numberUnformat(_value),
          pattern.replace(/\%/g, '')
        ) + '%'
      )
    },

    /**
     * 截取一个长字符串的第N-3个字符以后的内容代替为指定的内容或者'...'，例如：
     * &.woo.ellipsis('同望科技前端开发组有一群热情洋溢的年轻人',10)返回'同望科技前端开发组有...'
     *
     * @param {String}
     *            value 需要截取的字符串
     * @param {Number}
     *            len 指定的剩余字符串长度
     * @param {String}
     *            str 指定的内容，该参数可选，默认为'...'
     * @return {String} 截取替换完成以后的字符串
     */
    ellipsis: function (value, len, str) {
      if (value && value.length > len) {
        return value.substr(0, len - 3) + (str ? str : '...')
      }
      return value
    },
    /**
     * 返回一个指定数值的子字符串，可以是一个数字
     *
     * @param {String}
     *            value 原始的数据
     * @param {Number}
     *            start 子串开始的位置
     * @param {Number}
     *            length 子串的长度
     * @return {String} 子字符串
     */
    slice: function (value, start, length) {
      return String(value).slice(start, length)
    },

    /**
     * 返回一个指定数值的所有字符转换为小写字符，可以是一个数字
     *
     * @param {String}
     *            value 需要转换的数值
     * @return {String} 转换后的字符串
     */
    lowercase: function (value) {
      return String(value).toLowerCase()
    },

    /**
     * 返回一个指定数值的所有字符转换为大写字符，可以是一个数字
     *
     * @param {String}
     *            value 需要转换的数值
     * @return {String} 转换后的字符串
     */
    uppercase: function (value) {
      return String(value).toUpperCase()
    },

    /**
     * 将一个字符串的首字母变为大写,其他字符则全部变为小写
     *
     * @param {String}
     *            value 需要转变的字符串
     * @return {String} 转变后的字符串
     */
    cap: function (value) {
      return !value
        ? value
        : value.charAt(0).toUpperCase() + value.substr(1).toLowerCase()
    },
    /**
     * 返回一个指定字符串的子字符串，使用方法：
     * <p>
     * <ul>
     * <li>从I love bicycle中截取love，&.woo.substr('I love bicycle',3,4);</li>
     * <li>从数字1234567中需要获取234，&.woo.substr(1234567,2,3);</li>
     * </ul>
     * </p>
     *
     * @param {mixed}
     *            value 原始的数据
     * @param {Number}
     *            start 子串开始的位置
     * @param {Number}
     *            length 子串的长度
     * @return {String} 子字符串
     */
    substr: function (value, start, length) {
      return String(value).substr(start, length)
    },

    /**
     * 将百分比变成数字，例如 this.per2dec('34%') 返回 0.34
     *
     * @param {String}
     *            percent 百分比形式
     * @return {Number} decimals 数字形式，如果百分比形式没有包含%符号，则返回undefined
     */
    per2dec: function (percent) {
      let temp = String(percent)
      if (temp.indexOf('%') < 0) {
        return false
      }
      return Number(temp.slice(0, temp.indexOf('%'))) / 100
    },

    /**
     * 左补齐字符串
     *
     * @param nSize
     *            要补齐的长度
     * @param ch
     *            要补齐的字符
     * @return
     */
    padLeft: function (str, nSize, ch) {
      let len = 0
      let s = str ? str : ''
      ch = ch ? ch : '0' // 默认补0

      len = s.length
      while (len < nSize) {
        s = ch + s
        len++
      }
      return s
    },

    /**
     * 右补齐字符串
     *
     * @param nSize
     *            要补齐的长度
     * @param ch
     *            要补齐的字符
     * @return
     */
    padRight: function (str, nSize, ch) {
      let len = 0
      let s = str ? str : ''
      ch = ch ? ch : '0' // 默认补0

      len = s.length
      while (len < nSize) {
        s = s + ch
        len++
      }
      return s
    },

    /**
     * 左移小数点位置（用于数学计算，相当于除以Math.pow(10,scale)）
     *
     * @param scale
     *            要移位的刻度
     * @return
     */
    movePointLeft: function (str, scale) {
      let s, s1, s2, ch, ps, sign
      ch = '.'
      sign = ''
      s = str ? str : ''

      if (scale <= 0) return s
      ps = s.split('.')
      s1 = ps[0] ? ps[0] : ''
      s2 = ps[1] ? ps[1] : ''
      if (s1.slice(0, 1) == '-') {
        s1 = s1.slice(1)
        sign = '-'
      }
      if (s1.length <= scale) {
        ch = '0.'
        s1 = this.padLeft(s1, scale)
      }
      return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2
    },

    /**
     * 右移小数点位置（用于数学计算，相当于乘以Math.pow(10,scale)）
     *
     * @param scale
     *            要移位的刻度
     * @return
     */
    movePointRight: function (str, scale) {
      let s, s1, s2, ch, ps
      ch = '.'
      s = str ? str : ''

      if (scale <= 0) return s
      ps = s.split('.')
      s1 = ps[0] ? ps[0] : ''
      s2 = ps[1] ? ps[1] : ''
      if (s2.length <= scale) {
        ch = ''
        s2 = this.padRight(s2, scale)
      }
      return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length)
    },

    /**
     * 移动小数点位置（用于数学计算，相当于（乘以/除以）Math.pow(10,scale)）
     *
     * @param scale
     *            要移位的刻度（正数表示向右移；负数表示向左移动；0返回原值）
     * @return
     */
    movePoint: function (str, scale) {
      if (scale >= 0) return this.movePointRight(str, scale)
      else return this.movePointLeft(str, -scale)
    }
  })
}
