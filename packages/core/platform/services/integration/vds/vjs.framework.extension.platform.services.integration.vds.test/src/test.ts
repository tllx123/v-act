define('./test', function (require, exports, module) {
  var vds = window.vds || {}
  vds.test = vds.test || {}
  var global_key = 'mocha'

  vds.test.init = function (callback) {
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
  vds.test.describe = function (name, callback) {
    return describe(name, callback)
  }

  /**
   * 测试用例
   */
  vds.test.it = function (name, callback) {
    return it(name, callback)
  }

  /**
   * 断言
   */
  vds.test.expect = function () {
    return chai.expect.apply(chai.expect, arguments)
  }
})
