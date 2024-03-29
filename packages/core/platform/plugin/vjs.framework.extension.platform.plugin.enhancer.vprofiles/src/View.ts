import { Modal as modal } from '@v-act/vjs.framework.extension.platform.services.view.modal'
import { uuid as uuidUtil } from '@v-act/vjs.framework.extension.util.uuid'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import * as dataManager from './DataManager'
import * as eventObserver from './EventObserver'

//var css = ".vprofiles{z-index:999999999;width:88px;height:auto;position:fixed;top:10px;right:15px}.vprofiles ul{display:block;list-style:none;padding-left:0px;}.vprofiles ul li a{width:88px;height:54px;line-height:54px;text-align:center;background-color:#fff;color:#32c96a;display:block}.vprofiles ul li a.cur,.vprofiles ul li a:hover{background-color:#32c92a;color:#fff}";

//var html = '<div class="vprofiles"><i class="handle"></i><ul><li><a href="javascript:void(0)" type="start" class="icon-start" title="开始"></a></li><li><a href="javascript:void(0)" type="pause" class="icon-pause" title="暂停"></a></li><li><a href="javascript:void(0)" type="stop" class="icon-clear" title="清除"></a></li><li><a href="javascript:void(0)" type="display" class="icon-show" title="显示"></a></li><li><a href="javascript:void(0)" type="submit" class="icon-submit" title="提交"></a></li></ul></div>';

let html =
  '<div class="vprofiles"><i id="monitor_tool_top" class="handle"></i>' +
  '<ul>' +
  '<li><a href="javascript:void(0)" type="start" class="icon-start" title="开始"></a></li>' +
  '<li><a href="javascript:void(0)" type="pause" class="icon-pause" title="暂停"></a></li>' +
  '<li><a href="javascript:void(0)" type="clear" class="icon-clear" title="清除"></a></li>' +
  '<li><a href="javascript:void(0)" type="display" class="icon-show" title="显示"></a></li>' +
  '<li><a href="javascript:void(0)" type="submit" class="icon-submit" title="提交"></a></li>' +
  '</ul>' +
  '</div>'
let ConsumeTimeDom =
  '<section flex flex-full-center>' +
  '<div class="tree-nav tree-default">' +
  '<a href="#" class="nav-prev btn-more" title="更多"></a>' +
  '<div class="tree-main">' +
  '<ul>' +
  //										'<li class="nav-first cur"><a href="#">ROOT</a></li>'+
  //'<li><a href="#">FormLoadAction</a></li>'+
  '</ul>' +
  '</div>' +
  '<a href="#" class="nav-next btn-more" title="更多"></a>' +
  '</div>' +
  '<div id="chart"></div>' +
  '<div class="row-zebra">' +
  '<i class="row-even"></i><i class="row-odd"></i><i class="row-even"></i><i class="row-odd"></i><i class="row-even"></i><i class="row-odd title-row"></i>' +
  '</div>' +
  '<div class="pop-mod" style="display:none"><div class="pop-submit"><h5>数据标识：</h5><textarea placeholder="为数据可靠的标识"></textarea><div class="btn-bar"><a href="#" class="btn btn-important">提交</a><a href="#" class="btn btn-default">取消</a></div></div></div>' +
  '</section>'
let closeFuncHandler: Function | null

const render = function () {
  //		environment.parseCssStr(css);
  $(function () {
    $(document.body).append(html)
    let isOpen = eventObserver.isOpenMonitor()
    if (isOpen) {
      $('.vprofiles').find("a[type='start']").parents('li').hide()
    } else {
      $('.vprofiles').find("a[type='pause']").parents('li').hide()
    }
    $('.vprofiles')
      .find('a')
      .click(function (event: Event) {
        $('.vprofiles a.cur').removeClass('cur')
        //$(this).addClass('cur')
        //let type = $(this).attr('type')
        let type = $(event.target).attr('type')
        $(event.target).addClass('cur')
        let func = dispatcher[type]
        if (func) {
          func()
        }
      })
  })
}

let dispatcher: Record<string, any> = {
  display: function () {
    modal.create({
      title: '耗时监控',
      width: 900,
      height: 200,
      tmpZIndex: 8888888,
      //				maximizeBox:false,
      rendered: function (containerCode: string, closeFunc: Function) {
        closeFuncHandler = closeFunc
        var tmp_data = dataManager.genViewTimePoint('')
        var hasData = false
        for (var i = 0, l = tmp_data.length; i < l; i++) {
          if (tmp_data[i]['data'].length > 0) {
            hasData = true
            break
          }
        }
        if (hasData) {
          $('#' + containerCode).append(ConsumeTimeDom)
          var targetDom = $('#' + containerCode + ' section div#chart')[0]
          _createTimeLineChart(targetDom, tmp_data, containerCode)
          addTopNode({
            containerCode: containerCode,
            funKey: 'ROOTKEY' + uuidUtil.generate(),
            funName: 'ROOT',
            resetFunc: _createTimeLineChart
          })
        } else {
          $('#' + containerCode).append(
            '<div class="empty-prompt">暂无数据</div>'
          )
        }
        //					var timeline = new TimelineChart(targetDom, data, {
        //						intervalMinWidth:16,
        //			            enableLiveTimer: true,
        //			            tip: function(d) {
        //			                return d.dt || '${d.from}<br>${d.to}';
        //			            },
        //			            dblclick : function(data){
        //			            	if(data.customClass == "type-rule" && data.children && data.children.length > 0){
        //			            		dataManager.getViewData();
        //			            		new TimelineChart(targetDom, data, {
        //									intervalMinWidth:16,
        //						            enableLiveTimer: true,
        //						            tip: function(d) {
        //						                return d.dt || '${d.from}<br>${d.to}';
        //						            },
        //						            dblclick : function(data){
        //						            	if(data.customClass == "type-rule" && data.children && data.children.length > 0){
        //						            		dataManager.getViewData();
        //						            	}
        //									}
        //						        })
        //			            	}
        //						}
        //			        })
      },
      closed: function () {
        if (closeFuncHandler) {
          var func = closeFuncHandler
          closeFuncHandler = null
          func()
        }
      }
    })
  },
  start: function () {
    eventObserver.doStart()
    var $el = $('.vprofiles')
    $el.find("a[type='start']").parents('li').hide()
    $el.find("a[type='pause']").parents('li').show()
  },
  pause: function () {
    eventObserver.doStop()
    var $el = $('.vprofiles')
    $el.find("a[type='start']").parents('li').show()
    $el.find("a[type='pause']").parents('li').hide()
  },
  clear: function () {
    eventObserver.doClear()
    var $el = $('.vprofiles')
    $el.find("a[type='start']").parents('li').show()
    $el.find("a[type='pause']").parents('li').hide()
  },
  submit: function () {}
}
let _createTimeLineChart = function (
  targetDom: HTMLElement,
  data: Record<string, any>,
  containerCode: string
) {
  targetDom.innerHTML = ''
  //@ts-ignore
  let timeline = new TimelineChart(targetDom, data, {
    intervalMinWidth: 16,
    enableLiveTimer: true,
    tip: function (d: any) {
      if (d.customClass == 'type-rule' && d.children.length > 0) {
        $(this).css('cursor', 'pointer')
      }
      return d.dt || '${d.from}<br>${d.to}'
    },
    dblclick: (function (cCode) {
      return function (data: Record<string, any>) {
        //$(event.target).trigger('mouseout')
        $(targetDom).trigger('mouseout')
        if (
          data.customClass == 'type-rule' &&
          data.children &&
          data.children.length > 0
        ) {
          var funKey = data.children[0].key
          var funCode = data.children[0].funCode
          var ruleKey = data.key
          addTopNode({
            containerCode: cCode,
            funKey: funKey,
            funName: funCode,
            ruleKey: ruleKey,
            resetFunc: _createTimeLineChart
          })
          var showData = dataManager.genViewTimePoint(ruleKey)
          _createTimeLineChart(targetDom, showData, cCode)
        }
      }
    })(containerCode)
  })
}
let addTopNode = function (params: Record<string, any>) {
  let containerCode = params.containerCode,
    funName = params.funName,
    funKey = params.funKey,
    ruleKey = params.ruleKey,
    resetFunc = params.resetFunc
  let targetDom = $('#' + containerCode + ' section div.tree-main ul')
  $(targetDom).find('li').removeClass('cur')
  let nfStyle = funKey.indexOf('ROOTKEY') != -1 ? 'nav-first' : ''
  let li =
    '<li id="' +
    funKey +
    '" class="' +
    nfStyle +
    ' cur"><a href="#">' +
    funName +
    '</a></li>'
  targetDom.append(li)
  targetDom.find("li[id='" + funKey + "']").on('click', function () {
    let removeli = []
    let isDelete = false
    $('#' + containerCode + ' section div.tree-main ul li').each(function (
      item: any
    ) {
      //let key = $(this).attr('id')
      let key = $(item).attr('id')
      if (!isDelete) {
        if (key == funKey) {
          //$(this).addClass('cur')
          $(item).addClass('cur')
          isDelete = true
        }
      } else {
        // $(this).remove()
        $(item).remove()
        //					removeli.push(key);
      }
    })
    //			for(var i = 0,l=removeli.length;i<l;i++){
    //				$(targetDom).remove($("#" + containerCode+" section div.tree-main ul li[id='"+removeli[i]+"']"));
    //			}
    if (typeof resetFunc == 'function') {
      let dom = $('#' + containerCode + ' section div#chart')[0]
      let showData = dataManager.genViewTimePoint(ruleKey)
      resetFunc(dom, showData, containerCode)
    }
  })
}

export { render }
