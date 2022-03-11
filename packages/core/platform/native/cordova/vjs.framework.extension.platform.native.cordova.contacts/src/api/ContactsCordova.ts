import * as ContactsService from '@v-vact/vjs.framework.extension.platform.services.native.mobile.Contacts'

export function initModule(sb: any) {
  ContactsService.putInstance(exports)
}

/**
 * 初始化cordova的通讯录插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.Contacts = navigator.contacts
}

const getInfo = function (successCallback: Function, errorCallback: Function) {
  function onSuccess(contacts: any) {
    debugger
    console.log(contacts)
    if (typeof successCallback == 'function') {
      successCallback(contacts)
    }
  }

  function onError(contactError: any) {
    if (typeof errorCallback == 'function') {
      errorCallback(contactError)
    }
  }

  let options = new ContactFindOptions()
  options.filter = ''
  options.multiple = true
  let filter = ['displayName', 'name']
  //@ts-ignore
  navigator.contacts.find(filter, onSuccess, onError, options)
}

export { getInfo }
