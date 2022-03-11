/**
 * 根据id取图片
 */
const getImageById = (imageObjId: string): string => {
  return imageObjId == null || imageObjId == ''
    ? ''
    : 'module-operation!executeOperation?operation=FileDown&token={"data":{"dataId":"' +
        imageObjId +
        '"}}'
}

/**
 * 根据name取图片
 */
let getImageByName = (imageName: string): string => {
  /*
    //找上下文路径
    var contextPath = document.location.pathname;
    var index =contextPath.substr(1).indexOf("/");
    contextPath = contextPath.substr(0,index+1);
    return (imageName==null||imageName=="") ? "" : contextPath + "/itop/resources/" + imageName;
    */
  return imageName == null || imageName == ''
    ? ''
    : 'itop/resources/' + imageName
}

export { getImageById, getImageByName }
