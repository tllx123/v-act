let loadDependencies = function (sandbox, scopeId, callback) {
  let sb = sandbox.create({
    extensions: [
      { 'vjs.framework.extension.ui.adapter.dependency.bootstrap.mobile': null }
    ]
  })

  sb.active().done(function () {
    let dependencyService = sb.getService(
      'vjs.framework.extension.ui.adapter.dependency.bootstrapMobile'
    )
    dependencyService.loadDependencies(scopeId, function () {
      callback(sb)
    })
  })
}

export { loadDependencies }
