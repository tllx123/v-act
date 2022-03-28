import { mocha } from '@v-act/vjs.framework.extension.vendor.mocha'

export function init(callback: () => void) {
  mocha.setup({
    //allowUncaught: true,
    //bail: true,
    checkLeaks: true,
    //forbidOnly: true,
    //forbidPending: true,
    //global: [global_key],
    //retries: 3,
    slow: '100',
    timeout: '2000',
    ui: 'bdd'
  })
  try {
    callback()
    mocha.run()
  } catch (e) {}
}

/**
 * 测试场景
 */
export function describe(name: any, callback: any): any {
  return describe(name, callback)
}

/**
 * 测试用例
 */
export function it(name: any, callback: any): any {
  return it(name, callback)
}

/**
 * 断言
 */
export function expect() {
  //@ts-ignore
  return chai.expect.apply(chai.expect, arguments)
}
