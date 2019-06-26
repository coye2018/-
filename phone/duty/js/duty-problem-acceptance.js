var platForm = appcan.locStorage.getVal("platForm");

var vm = new Vue({
    el: "#Page",
    data: {
        shade: false 
    }
});

(function($) {
    
 	appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act",function() {});
    
    appcan.ready(function(){
        
        var titleHeight = parseInt($('#Header').outerHeight()),
            pageHeight = parseInt($('#Page').height()),
            pageWidth = parseInt($('#Page').width());
            
        $('#ScrollContent').css({
            top: titleHeight+'px',
            height: pageHeight-titleHeight+'px'
        });
            
        appcan.frame.open({
            id:'ScrollContent',
            url:'duty-problem-acceptance-page.html',
            left:0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight
        });
        
        appcan.window.publish("option-click","option-click");
        
        appcan.window.subscribe('duty-problem-acceptance-shade', function (val) {
           vm.shade = val == 'show' ? true : false;
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
    });
    
	    
})($);
