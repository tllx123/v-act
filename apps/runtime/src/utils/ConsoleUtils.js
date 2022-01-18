module.exports = {
  out: function (data) {
    if (!data.success) {
      console.log('错误详细信息:')
      console.log(data.content)
      if (typeof data.content == 'string') {
        data.content = data.content.substring(0, 150) + ' ....'
      }
    }
    let detail = JSON.stringify(data)
    console.log(`$v3Platform$:${detail}`)
  },

  serverUnStarted: function (err) {
    this.out({
      success: false,
      type: 'ServerUnStarted',
      title: '打包服务未启动',
      content:
        typeof err == 'string' ? err : err.stack ? err.stack : err.message
    })
  },

  serverStarted: function (cost) {
    this.out({
      success: true,
      type: 'ServerStarted',
      title: '服务启动成功！',
      content: `服务启动成功，耗时【${cost}】毫秒！`
    })
  },

  serverStarException: function (err) {
    this.out({
      success: false,
      type: 'ServerStartException',
      title: '服务启动失败！',
      content:
        typeof err == 'string' ? err : err.stack ? err.stack : err.message
    })
  }
}
