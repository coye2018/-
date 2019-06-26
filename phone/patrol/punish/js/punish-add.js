(function($) {
	appcan.ready(function() {
		//返回
		appcan.button("#nav-left", "btn-act", function() {
			appcan.window.close(1);
		});
		//取消按钮 
		appcan.button("#nav-right", "btn-act", function() {
			appcan.window.close(1);
		});
		//打开浮动页面
		createPopover("punish-add-content", "punish-add-content.html");
		//提交
//		appcan.button("#distribute", "btn-act", function() {
//			appcan.window.publish('patrol-punish-distribute-submit', '0');
//		});
//		window.onorientationchange = window.onresize = function(){
//          var titleHeight = parseInt($('#Header').height()),
//              footerHeight = parseInt($('#Footer').height()),
//              pageHeight = parseInt($('#Page').height()),
//              pageWidth = parseInt($('#Page').width());
//          
//          //重置指定弹出窗口的高度
//          appcan.window.resizePopover({
//              name: 'punish-add-content',
//              url: 'punish-add-content.html',
//              left: 0,
//              top: titleHeight,
//              width: pageWidth,
//              height: pageHeight-titleHeight-footerHeight
//          });
//        };
	})
})($);