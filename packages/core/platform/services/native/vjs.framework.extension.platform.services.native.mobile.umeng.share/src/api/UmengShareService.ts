let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const share = function (
  text: string,
  title: unknown,
  url: string,
  imgUrl: string,
  platforms: unknown,
  successCB: unknown,
  errorCB: unknown
) {
  instance.share(text, title, url, imgUrl, platforms, successCB, errorCB)
}

const auth = function (
  platformName: string,
  successCB: unknown,
  errorCB: unknown
) {
  instance.auth(platformName, successCB, errorCB)
}

const isInstall = function (platformName: string, callback: unknown) {
  instance.isInstall(platformName, callback)
}

export { auth, isInstall, putInstance, share }
