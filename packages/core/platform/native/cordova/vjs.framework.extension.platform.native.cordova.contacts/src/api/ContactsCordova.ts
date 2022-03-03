exports.initModule = function (sb) {
  let ContactsService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Contacts'
  )
  ContactsService.putInstance(exports)
}

/**
 * 初始化cordova的通讯录插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Contacts = navigator.contacts
}

const getInfo = function (successCallback, errorCallback) {
  function onSuccess(contacts) {
    debugger
    console.log(contacts)
    if (typeof successCallback == 'function') {
      successCallback(contacts)
    }
  }

  function onError(contactError) {
    if (typeof errorCallback == 'function') {
      errorCallback(contactError)
    }
  }

  let options = new ContactFindOptions()
  options.filter = ''
  options.multiple = true
  filter = ['displayName', 'name']
  navigator.contacts.find(filter, onSuccess, onError, options)
}

export { getInfo }
