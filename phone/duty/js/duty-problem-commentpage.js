var vm = new Vue({
    el: '#Page',
    data: {
        shade: false
    }
}); 

(function ($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    appcan.button("#approve-all", "btn-act", function() {
        appcan.window.publish('duty-comment-submit', '0');
    });    
    appcan.ready(function() {
        var titleHeight = parseInt($('#Header').height()),
            footerHeight = parseInt($('#Footer').height()),
            pageHeight = parseInt($('#Page').height()),
            pageWidth = parseInt($('#Page').width());
            
        $('#ScrollContent').css({
            top: titleHeight+'px',
            height: pageHeight-titleHeight-footerHeight+'px'
        });
            
        appcan.frame.open({
            id:'ScrollContent',
            url:'duty-problem-comment.html',
            left:0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight-footerHeight
        });
        
        //如果是ios设备，设置向右滑动关闭页面
         var platFormC=appcan.locStorage.getVal("platForm");
            var isSupport=true;
            if(platFormC=="1"){
                isSupport=false;
            }
            var paramClose = {
                isSupport:isSupport
            };
            uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
            uexWindow.onSwipeRight = function(){
                appcan.window.close(1);
            } 
        
        appcan.window.subscribe('task-send-shade', function (type) {
            vm.shade = (type == 'hide' ? false : true);
        });
        
    });
    
})($);




