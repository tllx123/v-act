let loadDependencies = function (sandbox, scopeId, callback) {
  let sb = sandbox.create({
    extensions: [
      { 'vjs.framework.extension.ui.adapter.dependency.smartclient': null },
      { 'vjs.framework.extension.ui.plugin.smartclient.JGComponent': null }
    ]
  })

  sb.active().done(function () {
    let dependencyService = sb.getService(
      'vjs.framework.extension.ui.adapter.dependency.smartclient'
    )
    dependencyService.loadDependencies(scopeId, function () {
      callback(sb)
    })
  })
}

export { loadDependencies }
