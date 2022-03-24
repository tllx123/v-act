/**
 *	三元运算函数
 */
const main = function (
  logical_test: boolean,
  value_if_true: any,
  value_if_false: any
) {
  if (logical_test) return value_if_true
  else return value_if_false
}
export { main }
