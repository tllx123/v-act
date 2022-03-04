/**
 * 移动app相关的方法
 * @desc 提供与移动app相关的一系列接口，使用前请先import：vds.import("vds.app.*")
 * @namespace vds/app
 * @module app
 * @catalog 工具方法/移动App
 * @example
 * vds.import("vds.app.*");
 * vds.app.getVersion();
 */

import CameraService from 'vjs.framework.extension.platform.services.native.mobile.camera'
import FileTransferService from 'vjs.framework.extension.platform.services.native.mobile.filefransfer'
import geolocationService from 'vjs.framework.extension.platform.services.native.mobile.geolocation'
import hardwareOperationService from 'vjs.framework.extension.platform.services.native.mobile.hardwareoperation'
import payService from 'vjs.framework.extension.platform.services.native.mobile.pay'
import saveImageToGalleryService from 'vjs.framework.extension.platform.services.native.mobile.saveimagetogallery'

import exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import str from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import versionService from '@v-act/vjs.framework.extension.platform.services.native.mobile.appversion'
import ImagePickerService from '@v-act/vjs.framework.extension.platform.services.native.mobile.imagepicker'

/**
 * 获取app版本
 * @example
 * var promise = vds.app.getVersion();
 * promise.then(function(version){
 *  console.log("获取app版本成功，app版本：" + version);
 * }).catch(function(err){
 *  console.log("获取app版本失败.");
 * });
 * */
export function getVersion() {
  return new Promise(function (resolve, reject) {
    try {
      var callback = function (version: string) {
        resolve(version)
      }
      versionService.getVersionNumber(callback)
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 保存图片/视频到手机相册
 * @param {String} 文件路径
 * @param {String} 文件名称
 * @returns {Promise}
 * @example
 * vds.app.saveImage("url","fileName.jpg");
 * */
export function saveImage(fileUrl: string, fileName: string) {
  return new Promise<void>(function (resolve, reject) {
    try {
      if (str.isEmpty(fileUrl) || str.isEmpty(fileName)) {
        reject(exception.newBusinessException('文件路径或者文件名不能为空.'))
        return
      }
      saveImageToGalleryService.saveimagetogallery(resolve, reject, {
        fileUrl: fileUrl,
        fileName: fileName
      })
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 调用手机摄像头拍照
 * @param {Object} params 其他参数（可选）
 * {
 *  "quality":{Integer} 图片质量1-100，默认50（可选）
 *  "isFront":{Boolean} 是否使用前置摄像头，默认false（可选）
 *  "saveToAlbum":{Boolean} 是否保存到相册，默认false（可选）
 * }
 * @returns {Promise}
 * @example
 * var promise = vds.app.picture();
 * promise.then(functino(imageUrl){
 *  alert("图片地址：" + imageUrl);
 * });
 * */
export function picture(params: {
  quality?: number
  isFront?: boolean
  saveToAlbum?: boolean
}) {
  var __params = params || {}
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        //@ts-ignore
        cameraDirection: Camera.Direction.BACK,
        quality: 50,
        saveToPhotoAlbum: false,
        //@ts-ignore
        destinationType: Camera.DestinationType.FILE_URI, //??
        //@ts-ignore
        sourceType: Camera.PictureSourceType.CAMERA, //??
        //@ts-ignore
        encodingType: Camera.EncodingType.JPEG, //??
        //@ts-ignore
        mediaType: Camera.MediaType.PICTURE, //??
        allowEdit: false,
        correctOrientation: true
      }
      var params = __params
      if (typeof params['quality'] != 'undefined') {
        options['quality'] = params['quality']
      }
      if (
        typeof params['quality'] != 'undefined' &&
        params['isFront'] === true
      ) {
        //@ts-ignore
        options['cameraDirection'] = Camera.Direction.FRONT
      }
      if (
        params.hasOwnProperty('saveToAlbum') &&
        params['saveToAlbum'] === true
      ) {
        options['saveToPhotoAlbum'] = true
      }
      CameraService.getPicture(resolve, reject, options)
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 从相册取照片
 * @param {Object} param 其他参数（可选）
 * {
 *  "quality":{Integer} 图片质量1-100，默认50（可选）
 *  "max":{Integer} 最大选择数，默认9（可选）
 * }
 * @returns {Promise}
 * */
export function getPicture(params: { quality?: number; max?: number }) {
  return new Promise(function (resolve, reject) {
    try {
      var options: { maximumImagesCount: number; quality: number } = {
        maximumImagesCount: 9,
        quality: 50
      }
      if (params) {
        if (typeof params['quality'] != 'undefined') {
          options['quality'] = params['quality']
        }
        if (typeof params['max'] != 'undefined') {
          options['maximumImagesCount'] = params['max']
        }
      }
      ImagePickerService.getPicture(resolve, reject, options)
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 上传文件
 * @param {Array<String>} filePaths 图片路径列表
 * @returns {Promise}
 * @example
 * var promise = vds.app.upload(["path1","path2"]);
 * promise.then(function(fileIds){
 *  alert("文件id1：" + fileIds[0]+", 文件id2："+ fileIds[1]);
 * }).catch(function(err){
 *  throw err;
 * })
 * */
export function upload(
  filePaths: Array<string>,
  callback?: (res: Array<string>) => void
) {
  if (!object.isArray(filePaths) || filePaths.length < 1) {
    if (typeof callback == 'function') {
      callback([])
    }
    return
  }
  FileTransferService.filetransferUpload(filePaths, callback)
  //app内异步无效
  //		return new Promise(function (resolve, reject) {
  //			try {
  //				var success = resolve;
  //				var error = reject;
  //				if(!vds.object.isArray(filePaths) || filePaths.length < 1){
  //					resolve([]);
  //					return;
  //				}
  //				var callback = (function(success, error){
  //					return function(results){
  //						alert(results ? JSON.stringify(results) : null);
  //						if (results && (results.success == false || results.success == "false")) {
  //							alert("upload: error:" + typeof(error));
  //							error(vds.exception.newBusinessException("上传图片不成功"));
  //						}else{
  //							alert("upload: success: " + typeof(success));
  //							success(result);
  //						}
  //					}
  //				})(resolve,reject);
  //				FileTransferService.filetransferUpload(filePaths, resolve);
  //			} catch (err) {
  //				reject(err);
  //			}
  //		});
}
/**
 * 获取支付信息
 * @param {String} payId 支付标志码
 * @param {Boolean} isMock 是否是模拟支付场景，默认true
 * @return {Promise}
 * @example
 * var promise = vds.app.getPayInfo("payId");
 * promise.then(function(info){
 *  alert("获取成功.");
 * }).catch(function(err){
 *  alert("获取失败.");
 * });
 *
 * */
export function getPayInfo(payId: string, isMock?: boolean) {
  return new Promise(function (resolve, reject) {
    try {
      isMock = isMock === true ? true : false
      payService.getPayInfo(
        {
          chargeId: payId,
          liveMode: isMock
        },
        resolve,
        reject
      )
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 获取当前位置的经纬度
 * @returns {Promise}
 * @example
 * var promise = vds.app.getCurrentPosition();
 * promise.then(function(){
 *  alert("获取成功");
 * }).catch(function(){
 *  alert("获取失败");
 * });
 * */
export function getCurrentPosition() {
  return new Promise(function (resolve, reject) {
    try {
      geolocationService.getCurrentPosition(resolve, reject)
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 打开闪光灯
 * @example
 * vds.app.openFlashLight();
 * */
export function openFlashLight() {
  hardwareOperationService.openFlashLight()
}

/**
 * 关闭闪光灯
 * @example
 * vds.app.closeFlashLight();
 * */
export function closeFlashLight() {
  hardwareOperationService.closeFlashLight()
}
/**
 * 设置屏幕亮度
 * @param {Number} brightness 亮度，值范围：0-1，其中0表示最暗，1表示最亮
 * @example
 * vds.app.setScreenBrightness(0.5);
 * */
export function setScreenBrightness(brightness: number) {
  if (typeof brightness == 'number' && brightness >= 0 && brightness <= 1) {
    hardwareOperationService.setScreenBrightness(brightness)
  }
}
/**
 * 获取手机GPS开启状态
 * @returns {Promise} 返回值为布尔类型：true（开启成功）、false（开启失败）
 * @example
 * var promise = vds.app.getGPSStatus();
 * promise.then(function(statu){
 *  if(statu === true){
 *    alert("GPS已开启");
 *  }else{
 *    alert("GPS已关闭");
 *  }
 * }).catch(function(){
 *  alert("无法获取GPS开启状态");
 * })
 * */
export function getGPSStatus() {
  return new Promise(function (resolve, reject) {
    try {
      var success = function (statu: number) {
        resolve(statu === 1)
      }
      hardwareOperationService.getGPSStatus(success, reject)
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 蓝牙状态
 * @enum
 * */
const BluetoothStatus = {
  /**
   * 无蓝牙设备
   * */
  NONE: 'None',
  /**
   * 蓝牙已打开
   * */
  OPEN: 'Open',
  /**
   * 蓝牙已关闭
   * */
  CLOSE: 'Close'
}

/**
 * 获取蓝牙状态
 * @returns {Promise}
 * @example
 * var promise = vds.app.getBluetoothStatus();
 * promise.then(function(statu){
 *  switch(statu){
 *   case vds.app.BluetoothStatus.NONE:
 *    alert("无蓝牙设备");
 *    break;
 *   case vds.app.BluetoothStatus.OPEN:
 *    alert("蓝牙已打开");
 *    break;
 *   case vds.app.BluetoothStatus.CLOSE:
 *    alert("蓝牙已关闭");
 *    break;
 *  }
 * }).catch(function(){
 *  alert("无法获取GPS开启状态");
 * })
 * */
export function getBluetoothStatus() {
  return new Promise(function (resolve, reject) {
    try {
      var success = function (statu: number) {
        var data = BluetoothStatus.NONE
        switch (
          statu //0（无蓝牙设备）、1（蓝牙已打开）、2（蓝牙已关闭）
        ) {
          case 1:
            data = BluetoothStatus.OPEN
            break
          case 2:
            data = BluetoothStatus.CLOSE
            break
        }
        resolve(data)
      }
      hardwareOperationService.getBluetoothStatus(success, reject)
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 网络状态
 * */
const NetworkStatus = {
  /**
   * 无网络
   * */
  NONE: 'None',
  /**
   * 移动网络
   * */
  MOBILE: 'Mobile',
  /**
   * 无线网络
   * */
  WIFI: 'Wifi',
  /**
   * 其他
   * */
  OTHER: 'Other'
}

export { BluetoothStatus, NetworkStatus }

/**
 * 获取手机网络状态
 * @returns {@link app#NetworkStatus=}
 * */
export function getNetworkStatus() {
  return new Promise(function (resolve, reject) {
    try {
      var success = function (statu: string) {
        var data = NetworkStatus.OTHER
        switch (
          statu //wifi（无线网络）、mobile（移动网络）、other（其他）、no（无网络连接）
        ) {
          case 'wifi':
            data = NetworkStatus.WIFI
            break
          case 'mobile':
            data = NetworkStatus.MOBILE
            break
          case 'no':
            data = NetworkStatus.NONE
            break
        }
        resolve(data)
      }
      hardwareOperationService.getNetworkState(success, reject)
    } catch (err) {
      reject(err)
    }
  })
}
/**
 * 使手机设备震动
 * @param {Integer} time 震动时间，单位：秒
 * */
export function vibrate(time: number) {
  var reg = RegExp('^[0-9]*[1-9][0-9]*$')
  if (reg.test(time + '')) {
    hardwareOperationService.vibrate(time * 1000)
  }
}
