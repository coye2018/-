/**
 * Created by issuser on 2017/12/20 0020.
 */
//appcan.ready(function() {
//	//禁止右滑关闭
//	var pt = appcan.locStorage.getVal("pt"); //是安卓还是IOS
//	if(pt == 1 || pt == "undefined") { //安卓
//	} else { //IOS
//		var params = {
//			enable: 0,
//		};
//		var paramStr = JSON.stringify(params);
//		uexWindow.setSwipeCloseEnable(paramStr);
//	}
//})

//不可以点击方法
function noClick(jqObj) {
    jqObj.each(function() {
        $(this).addClass('no-click');
    });
}
//可以点击方法
function yesClick(jqObj) {
    jqObj.each(function() {
        $(this).removeClass('no-click');
    });
}

//打开页面方法
function openWindow(name, data, dataType) {
    //	name:新窗口的的名称，如果窗口存在直接打开，如果不存在先创建然后打开
    //  data:新窗口填充的数据
    //  dataType:新窗口填充的数据类型  默认 0: url(可不传)
    if(dataType == undefined || dataType == null || dataType == "") {
        dataType = 0;
    }
    var pt = appcan.locStorage.getVal("pt"); //是安卓还是IOS
    if(pt == 1 || pt == "undefined") { //安卓
        appcan.window.open({
            name: name,
            dataType: dataType,
            aniId: 2,
            data: data
        });
    } else { //IOS
        appcan.window.open({
            name: name,
            dataType: dataType,
            aniId: 0,
            type: 1024,
            data: data
        });
    }
}


//打开浮动窗口
function createPopover(name, url, pageID, headerID, footerID) {
    //	name:要打开弹出窗的名称
    //   url:弹出框要加载的页面的地址
    //pageID：主页面的ID(可不传，默认默认Page)
    //headerID:头部的ID(可不传,header)
    if(pageID == undefined || pageID == null || pageID == "") {
        pageID = "Page";
    }
    if(headerID == undefined || headerID == null || headerID == "") {
        headerID = "Header";
    }
    if(footerID == undefined || footerID == null || footerID == "") {
        footerID = "Footer";
    }
    var titleHeight = parseFloat($('#' + headerID).height()),
        footerHeight = parseFloat($('#' + footerID).height()),
        pageHeight = parseFloat($('#' + pageID).height()),
        pageWidth = parseFloat($('#' + pageID).width());
    appcan.window.openPopover({
        name: name,
        url: url,
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight - titleHeight -footerHeight
    });
};
//连续返回两个页面,传页面name,离页面远的在数组里排在前面
/***
 * @param arr
 */
function closeMultiPages(arr) {
    for(var i = 0; i < arr.length; i++) {
        appcan.window.evaluateScript({
            name: arr[i],
            scriptContent: 'appcan.window.close(1);'
        });
    }
}
/****
 * Vue截取字符串过滤器
 * start:开始位置
 * end:结束位置
 */
Vue.filter('substr', function (str,start,end) {
    if (!str){
        return false;
    }else {
        return str.substring(start,end)
    }
});