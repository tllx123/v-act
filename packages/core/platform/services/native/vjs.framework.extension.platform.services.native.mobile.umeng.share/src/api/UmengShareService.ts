let instance

const putInstance = function (ins) {
  instance = ins
}

const share = function (
  text,
  title,
  url,
  imgUrl,
  platforms,
  successCB,
  errorCB
) {
  instance.share(text, title, url, imgUrl, platforms, successCB, errorCB)
}

const auth = function (platformName, successCB, errorCB) {
  instance.auth(platformName, successCB, errorCB)
}

const isInstall = function (platformName, callback) {
  instance.isInstall(platformName, callback)
}

export { putInstance, share, auth, isInstall }
