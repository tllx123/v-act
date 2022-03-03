/**
 * f7插件注册
 */
/* 注册framework7键盘 */
if (
  typeof Framework7 != 'undefined' &&
  typeof Framework7Keypad != 'undefined'
) {
  Framework7.use(Framework7Keypad)
}
/* 注册framework7标签 */
if (typeof Framework7Vue != 'undefined') {
  Vue.use(Framework7Vue)
}
