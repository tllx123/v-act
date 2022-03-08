/**
 *
 *
 */
var main = function (unixTimestamp, dateFormat) {
  if (arguments.length < 1) {
    throw new Error(
      '参数个数不正确,要求参数个数1或2个,实际参数个数=' + args.length
    )
  }
  if (!unixTimestamp) {
    throw new Error('参数一【转换的时间戳】不能为空')
  }
  if (!dateFormat) {
    dateFormat = 'yyyy-MM-dd HH:mm:ss'
  }
  //为空
  if (unixTimestamp.replace(/(^\s*)|(\s*$)/g, '') == '') {
    throw new Error(
      '[UnixtimestampToDateTime]函数参数配置有误,转换的时间戳不能为空'
    )
  }
  if (dateFormat.replace(/(^\s*)|(\s*$)/g, '') == '') {
    throw new Error(
      '[UnixtimestampToDateTime]函数参数配置有误,转换格式不能为空'
    )
  }

  var date = new Date(parseInt(unixTimestamp) * 1000)
  //var date = new Date(parseInt(unixTimestamp));
  //date转为指定格式字符串的方法
  Date.prototype.format = function (format) {
    var date = {
      'M+': this.getMonth() + 1,
      'd+': this.getDate(),
      'H+': this.getHours(),
      'm+': this.getMinutes(),
      's+': this.getSeconds(),
      'S+': this.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? date[k]
            : ('00' + date[k]).substr(('' + date[k]).length)
        )
      }
    }
    return format
  }

  return date.format(dateFormat)
}
export { main }
