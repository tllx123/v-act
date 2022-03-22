import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

// export function initModule(sBox) {}

const fileOpen = function (DOMID: string, fileID: string, fileName: string) {
  if (!fileName) {
    dialogUtil.propmtDialog(
      '打开文件失败！文件名不存在，请检查文件名是否正确！',
      null,
      false
    )
  } else {
    let extension = fileName
      .substring(fileName.lastIndexOf('.') + 1, fileName.length)
      .toLocaleLowerCase()
    if (extension == 'pdf') {
      readPDF(DOMID, fileID, fileName)
      return true
    } else if (
      extension == 'doc' ||
      extension == 'xls' ||
      extension == 'xlsx'
    ) {
      readMSOffice(DOMID, fileID, fileName)
      return true
    } else {
      dialogUtil.propmtDialog(
        '不支持此类文件的预览，可长按附件选择其他应用打开',
        null,
        false
      )
      return false
    }
  }
}

/**
 * 预览微软办公文件(.doc .docx .ppt .pptx .xls .xlsx)
 * @param DOMID  DOM结构ID
 * @param fileID 文件ID
 * @param fileName 文件名称（如 demo.doc）
 */
function readMSOffice(DOMID: string, fileID: string, fileName: string) {
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    if (window.device && window.device.platform == 'iOS') {
      //@ts-ignore
      let filePath =
        cordova.file.documentsDirectory +
        '/path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length)
      let html =
        '<iframe src="' + filePath + '" width="100%" height="100%"></iframe>'
      $('#' + DOMID).empty()
      $('#' + DOMID).append(html)
    }
  }

  //		var cb = function(res){
  //			var obj = $.parseJSON(res.responseText);
  //			var fileUrl= obj.data;
  //			if(window.GlobalVariables){
  //				fileUrl = GlobalVariables.getServerUrl()+"/"+fileUrl;
  //			}
  //			var html = '<iframe src="'+fileUrl+'" width="100%" height="100%"></iframe>'
  //			$("#"+DOMID).empty();
  //			$("#"+DOMID).append(html);
  //		}
  //		var config = {callBack:cb,isAsync:true};
  //		var ajaxUrl = location.href.substring(0,location.href.indexOf("module-operation")) + "/module-operation!executeOperation?operation=FileConvert";
  //		var ajaxData = {
  //			'fileid' : fileID
  //		}
  //		if(window.GlobalVariables){
  //			ajaxUrl =  GlobalVariables.getServerUrl() + ajaxUrl;
  //		}
  //		rpc.orginalRequest({
  //			host:ajaxUrl,
  //			param:{'fileid':fileID},
  //			isAsync:true,
  //			afterResponse:cb
  //		});
}

/**
 * 渲染PDF文件内容到指定的DOM结构内
 * @param DOMID  DOM结构ID
 * @param fileID 文件ID
 * @param fileName 文件名称（如 demo.pdf）
 */
function readPDF(DOMID: string, fileID: string, fileName?: string) {
  let url =
    'module-operation!executeOperation?operation=FileDown&token=%7B%22data%22%3A%7B%22dataId%22%3A%22' +
    fileID +
    '%22%7D%7D'
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    let host = window.GlobalVariables.getServerUrl()
    url = host + '/' + url
  }
  url = window.encodeURIComponent(url)
  //@ts-ignore
  let html =
    '<iframe src="' +
    host +
    '/itop/pdfjs/web/viewer.html?file=' +
    url +
    '" width="100%" height="100%"></iframe>'
  $('#' + DOMID).empty()
  $('#' + DOMID).append(html)
}

export { fileOpen }
