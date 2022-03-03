exports.initModule = function (sBox) {
  /**
   *
   * 图片助手，主要是在图片加载之前获取图片的宽高信息
   *
   * Created with JetBrains WebStorm.
   * User: zhengll
   * Date: 14-1-16
   * Time: 下午1:26
   * To change this template use File | Settings | File Templates.
   */
  isc.ClassFactory.defineClass('JGImageHelper')
  isc.JGImageHelper.addClassProperties({
    list: [],
    intervalId: null
  })
  isc.JGImageHelper.addClassMethods({
    /**
     * 用于执行队列
     */
    tick: function () {
      let i = 0
      for (; i < isc.JGImageHelper.list.length; i++) {
        isc.JGImageHelper.list[i].end
          ? isc.JGImageHelper.list.splice(i--, 1)
          : isc.JGImageHelper.list[i]()
      }
      !isc.JGImageHelper.list.length && isc.JGImageHelper.stop()
    },

    /**
     * 图片头数据加载就绪事件 - 更快获取图片尺寸
     * @example
     * isc.JGImageHelper.imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
     *    alert('size ready: width=' + this.width + '; height=' + this.height);
     * }
     *
     */
    imageReady: function (url, ready, load, error) {
      let onready,
        width,
        height,
        newWidth,
        newHeight,
        img = new Image()
      img.src = url

      /* 处理IE11下图片只显示一部分，暂时方案
            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                ready && ready.call(img);
                load && load.call(img);
                return;
            };*/

      width = img.width
      height = img.height

      // 加载错误后的事件
      img.onerror = function () {
        error && error.call(img)
        onready.end = true
        img = img.onload = img.onerror = null
      }

      // 图片尺寸就绪
      onready = function () {
        newWidth = img.width
        newHeight = img.height
        if (
          newWidth !== width ||
          newHeight !== height ||
          // 如果图片已经在其他地方加载可使用面积检测
          newWidth * newHeight >
            0 /*面积大于0 证明已经获取到高宽（IE8下走这个）*/
        ) {
          ready && ready.call(img)
          onready.end = true
        }
      }
      onready()

      // 完全加载完毕的事件
      img.onload = function () {
        // onload在定时器时间差范围内可能比onready快
        // 这里进行检查并保证onready优先执行
        !onready.end && onready()

        load && load.call(img)

        // IE gif动画会循环执行onload，置空onload即可
        img = img.onload = img.onerror = null

        //无论之前是否已经停止 停止图片加载
        onready.end = true
      }

      // 加入队列中定期执行
      if (!onready.end) {
        isc.JGImageHelper.list.push(onready)
        // 无论何时只允许出现一个定时器，减少浏览器性能损耗
        if (isc.JGImageHelper.intervalId === null)
          isc.JGImageHelper.intervalId = setInterval(isc.JGImageHelper.tick, 40)
      }
    },

    // 停止所有定时器队列
    stop: function () {
      window.clearInterval(isc.JGImageHelper.intervalId)
      isc.JGImageHelper.intervalId = null
    }
  })
}
