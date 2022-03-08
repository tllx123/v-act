/**
 *
 *
 */
var main = function (datetime) {
  if (!datetime) {
    throw new Error(
      '[DateTimeToUnixtimestamp]函数参数个数不正确,要求参数个数1个,实际参数个数=' +
        args.length
    )
  }
  if (datetime.replace(/(^\s*)|(\s*$)/g, '') == '') {
    throw new Error(
      '[DateTimeToUnixtimestamp]函数参数配置有误,转换的日期不能为空'
    )
  }

  var date = new Date(datetime)
  var unixTimestamp = date.getTime() / 1000
  return unixTimestamp + ''
}
export { main }
