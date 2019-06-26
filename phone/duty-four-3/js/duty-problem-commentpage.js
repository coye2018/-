var platForm = appcan.locStorage.getVal('platForm');

var vm = new Vue({
    el: '#Page',
    data: {
        shade: false
    }
}); 

function pageClose() {
    appcan.window.publish('duty-problem-detail-reload', '1');
    appcan.window.close(1);
}

(function ($) {
    appcan.button("#nav-left", "btn-act", function() {
        pageClose();
    });
    appcan.button("#approve-all", "btn-act", function() {
        appcan.window.publish('duty-comment-submit', '0');
    });
    appcan.ready(function() {
        var titleHeight = parseInt($('#Header').height()),
            footerHeight = parseInt($('#Footer').height()),
            pageHeight = parseInt($('#Page').height()),
            pageWidth = parseInt($('#Page').width());
        var windowHeight = pageHeight - titleHeight - footerHeight;
        
        $('#ScrollContent').css({
            top: titleHeight + 'px',
            height: windowHeight + 'px'
        });
            
        appcan.window.openPopover({
            name: 'duty-problem-comment',
            url: 'duty-problem-comment.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: windowHeight
        });
        
        appcan.window.subscribe('duty-comment-shade', function (type) {
            vm.shade = (type != 'hide');
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        var paramClose = {
            isSupport: (platForm != '1')
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            pageClose();
        } 
        
    });
})($);
