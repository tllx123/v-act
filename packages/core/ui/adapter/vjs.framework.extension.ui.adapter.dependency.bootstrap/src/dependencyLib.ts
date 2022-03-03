let loadDependencies = function (sandbox, scopeId, callback) {
  let sb = sandbox.create({
    extensions: [
      { 'vjs.framework.extension.ui.adapter.dependency.bootstrap': null }
    ]
  })

  sb.active().done(function () {
    let dependencyService = sb.getService(
      'vjs.framework.extension.ui.adapter.dependency.bootstrap'
    )
    dependencyService.loadDependencies(scopeId, function () {
      callback(sb)
    })
  })
}

export { loadDependencies, loadDependencies }
