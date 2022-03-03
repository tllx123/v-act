/**
 * 获取主页面的对象
 * */
function getIndexObj() {
  return $('.language-type')
}
/**
 * 获取语种所在的html容器对象
 * */
function getContainerObj() {
  var _$container = $(".lang-list[data-container-iden='language_type_list']")
  return _$container
}
/**
 * 判断是否是系统默认语言
 * */
function isDefaultLanguageItem(id) {
  if (id == 'system_default_language') {
    return true
  }
  return false
}

/**
 * 获取添加语言项的窗体对象
 * */
function getAddLanguageContainer() {
  return $('div[data-iden="add-language-container"]')
}

/**
 * 生成一个语种项的html(主页面)
 * @param {Object} item 语种项信息
 * */
function generateItemHtml(item) {
  var html = []
  var applyClass =
    window._$V3Platform_Apply_Language_Info$_.languageId == item.id
      ? 's-default'
      : ''
  if (true === item.isDefault) {
    applyClass = applyClass + ' s-system '
  }
  if (item) {
    var percents = window._$V3Platform_Translator_Percents$_
    if (percents && percents.hasOwnProperty(item.id)) {
      applyClass = applyClass + ' s-translating '
    }
    html.push(
      '<li class="' +
        applyClass +
        '" ' +
        (!item.isDefault ? '' : ' style="cursor: default;"') +
        ' data-iden="language_li" type="' +
        item.languageType +
        '" data-language-iden="' +
        item.id +
        '">'
    )
    html.push('<span class="li-icon"><img src="' + item.icon + '"></span>')
    html.push('<span class="li-hd">' + item.name + '</span>')
    html.push('<p class="li-bd">' + item.date + '</p>')
    html.push('<div class="li-op">')
    html.push('<label class="checkbox">')
    html.push('</label>')
    html.push('<div class="dropDown">')
    html.push('<i class="icon-more"></i>')
    html.push('<ul class="dropDown-menu">')
    if (!item.isDefault) {
      html.push('<li>')
      html.push('<a href="#" op-iden="single-export">导出</a>')
      html.push('</li>')
      html.push('<li>')
      html.push('<a href="#" class="autoTranslator">自动翻译</a>')
      html.push('</li>')
      html.push('<li>')
      html.push(
        '<a href="#" class="setDefault" data-op-iden="single-apply">设置默认</a>'
      )
      html.push('</li>')
      html.push('<li>')
      html.push('<a href="#" data-op-iden="single-delete">删除</a>')
      html.push('</li>')
    } else {
      html.push('<li>')
      html.push(
        '<a href="#" class="setDefault" data-op-iden="single-apply">设置默认</a>'
      )
      html.push('</li>')
    }
    html.push('</ul>')
    html.push('</div>')
    html.push('</div>')
    html.push('<i class="prograss" style="width:0%;"></i>')
    html.push('</li>')
  }
  return html.join('')
}
/**
 * 生成一个语种的html模板（添加语种页面使用）
 * */
function generateLanguageTypeHtml(item) {
  var html = []
  if (item) {
    html.push(
      '<li class="' +
        (item.exist === true ? 'hide' : '') +
        '" data-iden="language_li" type="' +
        item.id +
        '">'
    )
    html.push('<figure class="flag"><img src="' + item.icon + '"></figure>')
    html.push('<span>' + item.name + '</span>')
    html.push('<a href="javascript:void(0)" class="btn btn-white"></a>')
    html.push('</li>')
  }
  return html.join('')
}
var needAutoHeightTextArea = []
/**
 * 生成一个语言的编辑模板
 * @param {Object} languageId 语言ID
 * @param {Object} languageInfo 语言信息
 * */
function generateEditLanguageHtml(languageId, languageInfo) {
  var html = []
  if (languageInfo) {
    var name = languageInfo.name
    var icon = languageInfo.icon
    var items = languageInfo.items
    html.push('<dl class="board" data-iden="' + languageId + '">')
    html.push('<dt>')
    html.push('<i class="icon-lang"><img src="' + icon + '"/></i>')
    html.push('<span>' + name + '</span>')
    html.push('</dt>')
    if (items && items.length > 0) {
      html.push('<dd>')
      for (var i = 0, len = items.length; i < len; i++) {
        var item = items[i]
        if (item) {
          html.push(
            '	<label data-desc="' +
              item.desc +
              '" data-iden="' +
              item.id +
              '" class="' +
              (item.error === true ? 'error' : '') +
              '">'
          )
          html.push('		<p class="keyword">' + item.defaultValue + '</p>')
          html.push('			<div class="desc">')
          html.push('				<i class="icon-info"></i>')
          html.push('				<div class="desc-info">' + item.desc + '</div>')
          html.push('			</div>')
          html.push(
            '			<div contenteditable="true" class="inputBox">' +
              item.value +
              '</div>'
          )
          html.push('	</label>')
          if (item.value && item.value.length > 24) {
            needAutoHeightTextArea.push(item.id)
          }
        }
      }
      html.push('</dd>')
    }
    html.push('</dl>')
  }
  return html.join('')
}

/**
 * 保存加载过来的语种项
 * @param {Array} languageType 用户配置的语种列表
 * @param {Array} allLanguageType 全部未添加的语种列表
 * @param {Object} applyInfo 应用语言信息
 * */
function init(languageType, allLanguageType, applyInfo, percents) {
  if (languageType) {
    try {
      window._$V3Platform_Language_Type_Infos$_ = JSON.parse(languageType)
    } catch (e) {
      window._$V3Platform_Language_Type_Infos$_ = []
    }
  } else {
    window._$V3Platform_Language_Type_Infos$_ = []
  }
  if (allLanguageType) {
    try {
      window._$V3Platform_All_Language_Type_Infos$_ =
        JSON.parse(allLanguageType)
    } catch (e) {
      window._$V3Platform_All_Language_Type_Infos$_ = []
    }
  } else {
    window._$V3Platform_All_Language_Type_Infos$_ = []
  }
  if (applyInfo) {
    try {
      window._$V3Platform_Apply_Language_Info$_ = JSON.parse(applyInfo)
    } catch (e) {
      window._$V3Platform_Apply_Language_Info$_ = {
        byBrowser: false,
        languageId: false
      }
    }
  } else {
    window._$V3Platform_Apply_Language_Info$_ = {
      byBrowser: false,
      languageId: false
    }
  }
  if (percents) {
    try {
      window._$V3Platform_Translator_Percents$_ = JSON.parse(percents)
    } catch (e) {
      window._$V3Platform_Translator_Percents$_ = {}
    }
  } else {
    window._$V3Platform_Translator_Percents$_ = {}
  }
  window._$V3Platform_Translator_Percents_Iden$_ = null
}
/**
 * 更改批量处理状态
 * @param {Boolean} isMulti 是否批处理
 * */
function changeMultiState(isMulti) {
  var obj = getContainerObj()
  var bottomModal = $('.language-type div.smart-float')
  var labels = obj.find('li[data-iden="language_li"] .li-op>label')
  var dropDowns = obj.find('li[data-iden="language_li"] .li-op>div')
  if (true === isMulti) {
    labels.removeClass('hide')
    dropDowns.addClass('hide')
    bottomModal.removeClass('hide')
  } else {
    labels.addClass('hide')
    dropDowns.removeClass('hide')
    bottomModal.addClass('hide')
  }
}
/**
 * 发送请求
 * @param {Object} params
 * {
 * 		'datas' : {Object},//数据
 * 		'success' : {Function},//成功回调
 * 		'fail' : {Function}//失败回调
 * }
 * */
function send(params) {
  var data = params.datas,
    success = params.success,
    fail = params.fail
  var param = {
    datas: JSON.stringify(data)
  }
  $.post('', param, function (data) {
    if (data && data.success === true) {
      if (typeof success == 'function') {
        success(data)
      }
    } else {
      if (typeof fail == 'function') {
        fail(data)
      }
    }
  })
}

/**
 * 导出语种
 * @params {Array} ids 语种id
 * */
function exportLanguage(ids) {
  /*process(true);
	var params = {
		datas : {
			ids : ids,
			operation : "export"//操作标识
		},
		success : function(datas){
			if(datas.success){
				var filePath = datas.filePath;
				createIFrame("DownloadLanguage",filePath);
				process(false);
			}else{
				alert(datas.message);
			}
		},
		fail : function(){
			process(false);
			alert("导出失败.");
		}
	};
	send(params);*/
  var _iden = 'iden_' + parseInt(Math.random() * 100000)
  process(true)
  createIFrame(
    'DownloadLanguage',
    '?operation=export&&ids=' +
      ids.join(',') +
      '&&iden=' +
      _iden +
      '&&random=' +
      Math.random()
  )
  var index
  var params = {
    datas: {
      iden: _iden,
      operation: 'requestProgress' //操作标识
    },
    success: function (datas) {
      if (true == datas.isFinish) {
        process(false)
        clearInterval(index)
      }
    },
    fail: function () {
      process(false)
      clearInterval(index)
    }
  }
  index = setInterval(function () {
    send(params)
  }, 100)
}
/**
 * 删除语言
 * @param {Array} 语言id
 * @param {Array} 界面的语言对象，删除成功后需更新界面
 * @param {Array} 语种类型列表
 * */
function removeLanguage(ids, objs, types) {
  var params = {
    datas: {
      ids: ids,
      operation: 'removeLanguage' //操作标识
    },
    success: function (datas) {
      if (objs && objs.length > 0) {
        for (var i = 0, len = objs.length; i < len; i++) {
          $(objs[i]).remove()
        }
      }
      if (types && types.length > 0) {
        for (var i = 0, len = types.length; i < len; i++) {
          $(".countrylist>li[type='" + types[i] + "']").removeClass('hide')
        }
      }
    },
    fail: function () {
      alert('删除失败.')
    }
  }
  send(params)
}
/**
 * 绑定点击事件
 * */
function bindClick(obj, func) {
  $(obj).on('click', func)
}

/**
 * 控制添加语言的弹出层
 * @param {Boolean} show 是否显示
 * */
function addModal(show) {
  var $obj = getAddLanguageContainer()
  var $all_language_type_btn = $obj.find(
    'ul[data-iden="language-container"] li'
  )
  $all_language_type_btn.removeClass('selected')
  if (true === show) {
    showMark(true)
    $obj.removeClass('hide')
  } else {
    showMark(false)
    $obj.addClass('hide')
  }
}

/**
 * 是否显示遮挡层
 * @parma {Boolean} show
 * */
function showMark(show) {
  var $mark = $('div[data-iden="add-language-mask"]')
  if (show) {
    $mark.removeClass('hide')
  } else {
    $mark.addClass('hide')
  }
}

/**
 * 是否显示编辑界面
 * @parma {Boolean} show
 * */
function showEdit(show) {
  if (show) {
    $('.sec-boards').removeClass('hide')
    showMark(true)
  } else {
    $('.sec-boards').addClass('hide')
    showMark(false)
  }
}
/**
 * 显示某一页的语言
 * @param {Integer} pageNum 第几页
 * */
function showPage(pageNum) {
  var $pages = $('#boardList>dl')
  $('#boardList>dl').addClass('hide')
  for (var i = 1; i < 4; i++) {
    var $dl = $('#boardList>dl:eq(' + (pageNum * 3 - i) + ')')
    if (i == 3) {
      $dl.addClass('board-first')
    }
    $dl.removeClass('hide')
  }
}

/**
 * 激活页
 * @param {String} op pre(上一页)/next(下一页)
 * */
function activePage(op) {
  var $pageCom = $('.popBox .popBox-ft .pageNav')
  var page = 1
  var isC = true
  $pageCom.find('span a').each(function () {
    if (isC) {
      if (!$(this).hasClass('active')) {
        page++
      } else {
        isC = false
      }
    }
  })
  if (op == 'prev') {
    if (page != 1) {
      var $nowSel = $pageCom.find('span a.active')
      $nowSel.removeClass('active')
      $nowSel.prev().addClass('active')
      showPage(page - 1)
    }
  } else if (op == 'next') {
    var len = $pageCom.find('span a').length
    if (page != len) {
      var $nowSel = $pageCom.find('span a.active')
      $nowSel.removeClass('active')
      $nowSel.next().addClass('active')
      showPage(page + 1)
    }
  }
}

/**
 * 编辑语言项
 * @param {Array} languageIds 语言标识id列表
 * */
function editLanguageItems(languageIds) {
  $('.popBox .filter-error .ui-switch').prop('checked', false)
  process(true)
  send({
    datas: {
      ids: languageIds,
      operation: 'getItems'
    },
    success: function (datas) {
      var languageItems = datas.items
      if (languageItems) {
        var htmls = []
        //确保编辑顺序
        for (var i = 0, len = languageIds.length; i < len; i++) {
          var languageId = languageIds[i]
          if (languageItems.hasOwnProperty(languageId)) {
            var languageInfo = languageItems[languageId]
            var html = generateEditLanguageHtml(languageId, languageInfo)
            if (html && '' != html) {
              htmls.push(html)
            }
          }
        }
        $('#boardList').html(htmls.join(''))
        window._$V3Platform_Edit_Data_ = {}
        $('#boardList dd textarea').on('change', function () {
          var $parent = $(this).parent()
          var desc = $parent.attr('data-desc')
          var defaultValue = $parent.find('p.keyword').html()
          var languageItemId = $parent.attr('data-iden')
          var languageId = $(this).parents('dl.board').attr('data-iden')
          if (!_$V3Platform_Edit_Data_[languageId]) {
            _$V3Platform_Edit_Data_[languageId] = {}
          }
          _$V3Platform_Edit_Data_[languageId][languageItemId] = {
            defaultValue: defaultValue,
            value: $(this).val(),
            desc: desc
          }
        })
        var active = 'active'
        var lis = []
        var length =
          parseInt(languageIds.length / 3) +
          (languageIds.length % 3 == 0 ? 0 : 1)
        for (var i = 0; i < length; i++) {
          lis.push('<a href="javascript:void(0)" class="' + active + '"></a>')
          active = ''
        }
        var $span = $('.popBox .pageNav>span')
        $span.html(lis.join(''))
        var $span_a = $span.find('a')
        bindClick($span_a, function () {
          $span_a.removeClass('active')
          $(this).addClass('active')
        })
        if (languageIds.length < 4) {
          //少于一页不显示
          $('.popBox .pageNav').addClass('hide')
        } else {
          $('.popBox .pageNav').removeClass('hide')
        }
      }
      showEdit(true)
      process(false)
      $(function () {
        //修改看板高度
        function setBoardHeight() {
          var disTop =
            $('#boardList > .board > dd').offset().top -
            $('#boardList').parents('.popBox-bd').offset().top
          var disBottom = $('#boardList').parents('.popBox-ft').outerHeight()
          var popBdHeight = $('#boardList').parents('.popBox-bd').outerHeight()
          $('#boardList > .board > dd').height(
            popBdHeight - disTop - disBottom - 30
          )
        }
        setBoardHeight()
        $(window).resize(setBoardHeight)

        var isEdit = true
        var tmpSourceValue
        //修改聚焦样式
        $('.board > dd label [contenteditable]')
          .focus(function () {
            tmpSourceValue = this.innerText
            $(this).parent('label').addClass('focus')
            $(this).siblings('.desc').show()
          })
          .blur(function () {
            if (tmpSourceValue != this.innerText) {
              var $parent = $(this).parent()
              var desc = $parent.attr('data-desc')
              var defaultValue = $parent.find('p.keyword').html()
              var languageItemId = $parent.attr('data-iden')
              var languageId = $(this).parents('dl.board').attr('data-iden')
              if (!_$V3Platform_Edit_Data_[languageId]) {
                _$V3Platform_Edit_Data_[languageId] = {}
              }
              _$V3Platform_Edit_Data_[languageId][languageItemId] = {
                defaultValue: defaultValue,
                value: this.innerText,
                desc: desc
              }
            }
            $(this).parent('label').removeClass('focus')
            $(this).siblings('.desc').hide()
          })

        $('[contenteditable]').each(function () {
          try {
            document.execCommand('AutoUrlDetect', false, false)
          } catch (e) {}

          $(this).on('paste', function (e) {
            e.preventDefault()
            var text = null

            if (window.clipboardData && clipboardData.setData) {
              // IE
              text = window.clipboardData.getData('text')
            } else {
              text =
                (e.originalEvent || e).clipboardData.getData('text/plain') ||
                prompt('在这里输入文本')
            }
            if (document.body.createTextRange) {
              if (document.selection) {
                textRange = document.selection.createRange()
              } else if (window.getSelection) {
                sel = window.getSelection()
                var range = sel.getRangeAt(0)

                // 创建临时元素，使得TextRange可以移动到正确的位置
                var tempEl = document.createElement('span')
                tempEl.innerHTML = '&#FEFF;'
                range.deleteContents()
                range.insertNode(tempEl)
                textRange = document.body.createTextRange()
                textRange.moveToElementText(tempEl)
                tempEl.parentNode.removeChild(tempEl)
              }
              textRange.text = text
              textRange.collapse(false)
              textRange.select()
            } else {
              // Chrome之类浏览器
              document.execCommand('insertText', false, text)
            }
          })
          // 去除Crtl+b/Ctrl+i/Ctrl+u等快捷键
          $(this).on('keydown', function (e) {
            // e.metaKey for mac
            if (e.ctrlKey || e.metaKey) {
              switch (e.keyCode) {
                case 66: //ctrl+B or ctrl+b
                case 98:
                case 73: //ctrl+I or ctrl+i
                case 105:
                case 85: //ctrl+U or ctrl+u
                case 117: {
                  e.preventDefault()
                  break
                }
              }
            }
          })
        })

        //鼠标经过
        $('.board > dd label .desc').hover(
          function () {
            var pop = $(this).find('.desc-info'),
              popDisY = $(this).offset().top,
              boxDisY = $(this).parents('dd').offset().top,
              popHeight = pop.outerHeight()
            if (popDisY - boxDisY > popHeight) {
              $(this).addClass('showTop')
            } else {
              $(this).addClass('showBottom')
            }
            $(this).find('.desc-info').fadeIn(200)
          },
          function () {
            $(this).find('.desc-info').hide()
            $(this).removeClass('showTop showBottom')
          }
        )
      })
    },
    fail: function () {
      alert('无法获取语言项.')
      $('#boardList').html()
    }
  })
}

/**
 * 确认提示框
 * @param {String} msg 提示信息
 * */
function confirmWindow(msg) {
  if (confirm(msg)) {
    return true
  }
  return false
}

/**
 * 显示进度条
 * @param {String} show 是否显示
 * */
function process(show) {
  var $mark = $('div[data-iden="edit-language-mask"]')
  var $obj = $('.loading')
  if (show === true) {
    $mark.removeClass('hide')
    $obj.removeClass('hide')
  } else {
    $obj.addClass('hide')
    $mark.addClass('hide')
  }
}

/**
 * 初始化页面数据
 * */
function initPageData() {
  var languageType = window._$V3Platform_Language_Type_Infos$_
  var _$container = getContainerObj()
  var applyInfo = window._$V3Platform_Apply_Language_Info$_
  var $fitLang = $('#fitLang .ui-switch')
  var $list = $('#langList')
  if (true === applyInfo.byBrowser) {
    $fitLang.prop('checked', true)
  }
  var isSetDefault = false
  $fitLang.on('change', function () {
    if (isSetDefault) {
      //若是由设置默认按钮引起的改变则不处理
      return
    }
    //用于还原原来设置的默认语言
    let nowSelectLanguageId = $list
      .find('li.s-default')
      .attr('data-language-iden')
    $list.find('li.s-default').removeClass('s-default')
    let byBrowser = $fitLang.prop('checked') === true ? true : false
    if (byBrowser) {
      if (nowSelectLanguageId) {
        $fitLang.attr('default-language', nowSelectLanguageId)
      }
      nowSelectLanguageId = null
    } else {
      nowSelectLanguageId = $fitLang.attr('default-language')
      $fitLang.removeAttr('default-language')
    }
    send({
      datas: {
        operation: 'apply',
        byBrowser: byBrowser,
        languageId: nowSelectLanguageId
      },
      success: function () {
        if (!byBrowser && nowSelectLanguageId) {
          setDefault(
            $list.find("li[data-language-iden='" + nowSelectLanguageId + "']")
          )
        }
      }
    })
  })
  //1、生成语种信息
  if (languageType && languageType.length > 0) {
    var html = []
    for (var i = 0, len = languageType.length; i < len; i++) {
      var item = generateItemHtml(languageType[i])
      if (item && '' != item) {
        html.push(item)
      }
    }
    _$container.append(html.join(''))
  }
  var $addContainer = getAddLanguageContainer()
  var languageTypes = window._$V3Platform_All_Language_Type_Infos$_
  if (languageTypes && languageTypes.length > 0) {
    var html = []
    var $ul = $addContainer.find('ul[data-iden="language-container"]')
    for (var i = 0, len = languageTypes.length; i < len; i++) {
      var item = generateLanguageTypeHtml(languageTypes[i])
      if (item && '' != item) {
        html.push(item)
      }
    }
    $ul.append(html.join(''))
  }
  //2、绑定事件
  //添加语种
  var $indexObj = getIndexObj()
  var $add_language_btn = $indexObj.find(
    ".toolBar button[op-iden='add-language']"
  )
  bindClick($add_language_btn, function () {
    addModal(true)
  })

  $('.dropDown').click(function () {
    let _this = this
    $('.dropDown').each(function () {
      if (this === _this) {
        $(this).toggleClass('active')
        if ($(this).hasClass('active')) {
          $('.dropDown-mask').removeClass('hide')
        } else {
          $('.dropDown-mask').addClass('hide')
        }
      } else {
        $(this).removeClass('active')
      }
    })
    if (typeof event.stopPropagation == 'function') {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  })

  $('#batch').click(function () {
    if (this.innerText == '批量操作') {
      this.innerText = '取消批操作'
      $list.find('li').removeClass('s-selected')
      $('#smartFloat input[type="checkbox"]').prop('checked', false)
    } else {
      this.innerText = '批量操作'
    }
    $list.toggleClass('s-batch')
    $('#smartFloat').toggleClass('active')
  })
  //切换列表状态
  $list.find('li[data-iden="language_li"]').click(function () {
    if ($(this).hasClass('s-translating')) {
      return
    }
    if ($list.hasClass('s-batch')) {
      $(this).toggleClass('s-selected')
      let allLi = $list.find('li[data-iden="language_li"]')
      let selLi = $list.find('li[data-iden="language_li"].s-selected')
      if (allLi.length > 0 && selLi.length == allLi.length) {
        $('#smartFloat .layout input[data-op-iden="all-select"]').prop(
          'checked',
          true
        )
      } else {
        $('#smartFloat .layout input[data-op-iden="all-select"]').prop(
          'checked',
          false
        )
      }
    } else {
      if (event) {
        let $parent = $(event.target).parents('.dropDown')
        if (!$parent || $parent.length == 0) {
          let id = $(this).attr('data-language-iden')
          if (!isDefaultLanguageItem(id)) {
            editLanguageItems([id])
          }
        }
        if (typeof event.stopPropagation == 'function') {
          event.stopPropagation()
        } else {
          event.cancelBubble = true
        }
      }
    }
  })
  //全部语言的对象
  var $allLanguageLi = _$container.find('li[data-iden="language_li"]')
  //单个导出按钮
  var $singleExporsts = $allLanguageLi.find('a[op-iden="single-export"]')
  $singleExporsts.on('click', function () {
    let li = $(this).parents("li[data-iden='language_li']")[0]
    let id = $(li).attr('data-language-iden')
    exportLanguage([id])
  })
  //单个删除按钮
  var $single_delete_btn = $allLanguageLi.find(
    'a[data-op-iden="single-delete"]'
  )
  $single_delete_btn.on('click', function () {
    if (!confirmWindow('确认删除?')) return
    let li = $(this).parents("li[data-iden='language_li']")[0]
    let id = $(li).attr('data-language-iden')
    let type = $(li).attr('type')
    removeLanguage([id], [li], [type])
  })
  var setDefault = function (li) {
    if ($(li).length < 1 || $(li).hasClass('s-default')) {
      return
    }
    var languageId = $(li).attr('data-language-iden')
    var isUseDefault = false
    if (isDefaultLanguageItem(languageId)) {
      isUseDefault = true
    }
    var byBrowser = $fitLang.prop('checked')
    if (languageId) {
      process(true)
      send({
        datas: {
          byBrowser: false,
          languageId: languageId,
          operation: 'apply',
          isUseDefault: isUseDefault
        },
        success: function () {
          process(false)
          isSetDefault = true
          $fitLang.prop('checked', false)
          isSetDefault = false
          $list.find('li').removeClass('s-default')
          $(li).addClass('s-default')
        },
        fail: function () {
          process(false)
          alert('设置失败.')
        }
      })
    }
  }
  bindClick($('.setDefault'), function () {
    let li = $(this).parents("li[data-iden='language_li']")[0]
    setDefault(li)
  })
  var autoTranslator = function (li) {
    var languageId = $(li).attr('data-language-iden')
    var percents = window._$V3Platform_Translator_Percents$_
    if (percents.hasOwnProperty(languageId)) {
      alert('语言正在翻译中...')
      return
    }
    if (languageId) {
      var $p = $(li).find('.li-bd')
      $p.attr('desc', $p.html())
      $p.html('正在自动翻译...  &nbsp;&nbsp;已完成<em>0%</em>')
      $(li).addClass('s-translating')
      send({
        datas: {
          languageId: languageId,
          operation: 'autoTranslator'
        },
        success: function () {
          percents = window._$V3Platform_Translator_Percents$_
          if (percents.hasOwnProperty(languageId)) {
            try {
              delete percents[languageId]
            } catch (e) {}
          }
        },
        fail: function () {
          alert('自动翻译失败.')
        }
      })
      addAutoTranslatorLanguage(languageId)
    }
  }
  //自动翻译
  bindClick($('.autoTranslator'), function () {
    let li = $(this).parents("li[data-iden='language_li']")[0]
    autoTranslator(li)
  })
  //编辑界面的上一页
  bindClick($('.btn-prev'), function () {
    activePage('prev')
  })
  //编辑界面的下一页
  bindClick($('.btn-next'), function () {
    activePage('next')
  })
  bindClick($('.popBox .popBox-ft .saveLanguage'), function () {
    let $btn = $(this)
    if ($btn.attr('isedit') === true) {
      return
    }
    $btn.attr('isedit', true)
    if (JSON.stringify(_$V3Platform_Edit_Data_) != '{}') {
      process(true)
      send({
        datas: {
          items: _$V3Platform_Edit_Data_,
          operation: 'updateItems'
        },
        success: function () {
          $btn.attr('isedit', false)
          _$V3Platform_Edit_Data_ = {}
          process(false)
          alert('更新成功.')
          //window.location.reload();
        },
        fail: function () {
          $btn.attr('isedit', false)
          process(false)
          alert('更新失败.')
        }
      })
    } else {
      alert('无修改内容，已忽略更新操作.')
    }
  })
  bindClick($('#smartFloat a[data-open-iden="batch-delete"]'), function () {
    let $li = $('#langList>li.s-selected')
    let ids = []
    let lis = []
    let types = []
    $li.each(function () {
      let id = $(this).attr('data-language-iden')
      lis.push($(this))
      let type = $(this).attr('type')
      if (null != id && ids.indexOf(id) == -1) {
        ids.push(id)
      }
      if (types.indexOf(type) == -1) {
        types.push(type)
      }
    })
    if (ids.length > 0) {
      if (!confirmWindow('确认删除?')) return
      $('#batch').trigger('click')
      removeLanguage(ids, lis, types)
    } else {
      alert('请选择需要删除的语言')
    }
  })
  //批量导出按钮
  var $batch_export_btn = $(
    ".language-type .smart-float .btn-box a[data-op-iden='batch-export']"
  )
  $batch_export_btn.on('click', function () {
    let $selectLanguage = _$container.find('.s-selected')
    let ids = []
    $selectLanguage.each(function () {
      let id = $(this).attr('data-language-iden')
      if (null != id) {
        ids.push(id)
      }
    })
    if (ids.length > 0) {
      $('#batch').trigger('click')
      exportLanguage(ids)
    } else {
      alert('请选择需要导出的语言')
    }
  })
  bindClick($('.batch-edit'), function () {
    let $selectLanguages = $list.find("li[data-iden='language_li'].s-selected")
    let ids = []
    $selectLanguages.each(function () {
      let languageId = $(this).attr('data-language-iden')
      if (
        languageId &&
        '' != languageId &&
        !isDefaultLanguageItem(languageId)
      ) {
        ids.push(languageId)
      }
    })
    if (ids.length > 0) {
      $('#batch').trigger('click')
      editLanguageItems(ids)
    } else {
      alert('请选择需要编辑的语言.')
    }
  })
  /*
	//全选/取消全选按钮
	var $bacth_select_btn = $('.language-type .smart-float [data-op-iden="all-select"]');
	$bacth_select_btn.on("change",function(){
		var now_state = $(this).prop("checked");
		var $checkboxs = $allLanguageLi.find('.li-op>label input[type="checkbox"]');
		if(true === now_state){
			$checkboxs.prop("checked",true);
			$(this).parent().find("span").html("取消全选");
		}else{
			var $checkboxs = $allLanguageLi.find('.li-op>label input[type="checkbox"]');
			$checkboxs.prop("checked",false);
			$(this).parent().find("span").html("全选");
		}
	});*/
  $('#smartFloat label input').click(function () {
    if (this.checked) {
      $list.find('li').addClass('s-selected')
    } else {
      $list.find('li').removeClass('s-selected')
    }
  })
  //添加语种页面的语种点击事件
  var $all_language_type_btn = $addContainer.find(
    'ul[data-iden="language-container"] li'
  )
  bindClick($all_language_type_btn, function () {
    let isSel = $(this).hasClass('selected')
    if (true === isSel) {
      $(this).removeClass('selected')
    } else {
      $(this).addClass('selected')
    }
  })
  bindClick($('#save'), function () {
    let $li = $('.countrylist>li.selected')
    let types = []
    $li.each(function () {
      let type = $(this).attr('type')
      if (type) {
        types.push(type)
      }
    })
    if (types.length > 0) {
      process(true)
      send({
        datas: {
          types: types,
          operation: 'addLanguage'
        },
        success: function () {
          process(false)
          //					$li.addClass("hide");
          window.location.reload()
        },
        fail: function () {
          process(false)
          alert('保存失败.')
        }
      })
    } else {
      alert('请选择需要添加的语言')
    }
  })
  var $close_add_language_btn = $addContainer.find(
    'a[data-op-iden="close-add-language-modal"]'
  )
  bindClick($close_add_language_btn, function () {
    addModal(false)
  })
  bindClick($('.popBox .popBox-hd .icon-close'), function () {
    showEdit(false)
  })
  bindClick($('.popBox .toolBar i.icon-close'), function () {
    $(this).parent().addClass('hide')
  })
  bindClick($('.popBox .popBox-ft a.cancle'), function () {
    showEdit(false)
  })
  $('.popBox .filter-error input').on('change', function () {
    let show = $(this).prop('checked')
    if (true === show) {
      $("#boardList dd>label:not([class='error'])").addClass('hide')
    } else {
      $("#boardList dd>label:not([class='error'])").removeClass('hide')
    }
  })
  $(document).click(function (e) {
    $('.dropDown-mask').addClass('hide')
    $('.dropDown').removeClass('active')
  })
  //左右箭头切换上/下页
  $(window).on('keydown', function (e) {
    //显示编辑界面并且不是在提交的过程中才生效
    if (
      !$('.popBox.sec-boards').hasClass('hide') &&
      $('.edit').hasClass('hide')
    ) {
      let keyCode = e.keyCode
      if (keyCode == 37) {
        activePage('prev')
      } else if (keyCode == 39) {
        activePage('next')
      }
    }
  })
  var multiLanguage_plupload = new plupload.Uploader({
    runtimes: 'html5',
    browse_button: 'import-language',
    url: 'multiLanguage',
    filters: {
      mime_types: [{ title: 'Excel files', extensions: 'xls,xlsx' }]
    },
    init: {
      FilesAdded: function (upload, files) {
        process(true)
        upload.start()
      },
      UploadComplete: function (up) {
        if (this.isError != true) {
          alert('更新成功.')
        }
        process(false)
      },
      Error: function (up, err) {
        alert('导入失败.')
        up.isError = true
      }
    }
  })
  multiLanguage_plupload.init()
  if (JSON.stringify(window._$V3Platform_Translator_Percents$_) != '{}') {
    startRequestPercent()
  }
}

function refreshProcess() {
  var $langList = $('#langList')
  var percents = window._$V3Platform_Translator_Percents$_
  var $percentLis = $langList.find('.s-translating')
  $percentLis.each(function () {
    let iden = $(this).attr('data-language-iden')
    if (percents.hasOwnProperty(iden)) {
      let percent = percents[iden] + '%'
      try {
        if (Number(percents[iden]) == 100) {
          $(this).find('.li-bd').html('翻译已完成, 正在生成语言包...')
        } else {
          $(this).find('.li-bd em').html(percent)
        }
      } catch (e) {
        $(this).find('.li-bd em').html(percent)
      }
      $(this).find('.prograss').css('width', percent)
    } else {
      $(this).removeClass('s-translating')
      let $p = $(this).find('.li-bd')
      $p.html($p.attr('desc'))
      $(this).find('.prograss').css('width', '0%')
    }
  })
}

function startRequestPercent() {
  setTimeout(function () {
    window._$V3Platform_Translator_Percents_Iden$_ = setInterval(function () {
      console.log(JSON.stringify(window._$V3Platform_Translator_Percents$_))
      send({
        datas: {
          operation: 'requestPercent'
        },
        success: function (datas) {
          var percents = datas.percents
          if (JSON.stringify(percents) == '{}') {
            clearInterval(window._$V3Platform_Translator_Percents_Iden$_)
            window._$V3Platform_Translator_Percents_Iden$_ = null
            window._$V3Platform_Translator_Percents$_ = {}
          } else {
            window._$V3Platform_Translator_Percents$_ = percents
          }
          refreshProcess()
        },
        fail: function () {
          clearInterval(window._$V3Platform_Translator_Percents_Iden$_)
          window._$V3Platform_Translator_Percents_Iden$_ = null
          alert('翻译进度请求异常，')
        }
      })
    }, 1000)
  }, 500)
}

function addAutoTranslatorLanguage(languageId) {
  var percents = window._$V3Platform_Translator_Percents$_
  percents[languageId] = 0
  if (null == window._$V3Platform_Translator_Percents_Iden$_) {
    startRequestPercent()
  }
}

function createIFrame(iframeId, url) {
  var iframeObj = document.getElementById(iframeId)
  if (iframeObj == null) {
    iframeObj = document.createElement('iframe')
    iframeObj.setAttribute('id', iframeId)
    iframeObj.setAttribute('style', 'display:none')
    document.body.appendChild(iframeObj)
  }
  iframeObj.setAttribute('src', url)
}
////输入框自动高度
//jQuery.fn.extend({
//    autoHeight: function(){
//        return this.each(function(){
//            var $this = jQuery(this);
//            if( !$this.attr('_initAdjustHeight') ){
//                $this.attr('_initAdjustHeight', $this.outerHeight());
//            }
//            _adjustH(this).on('input', function(){
//                _adjustH(this);
//            });
//        });
//
//        function _adjustH(elem){
//            var $obj = jQuery(elem);
//            return $obj.css({height: $obj.attr('_initAdjustHeight'), 'overflow-y': 'hidden'})
//                    .height( elem.scrollHeight );
//        }
//    }
//});

export { main }
