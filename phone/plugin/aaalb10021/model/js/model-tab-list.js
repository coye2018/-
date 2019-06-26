var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        search: ''
    },
    watch: {
        search: function(val, oldVal) {
            appcan.window.publish('tab-list-search', val);
        }
    }
});

(function($) {
    appcan.button('#nav-left', 'btn-act',function() {
        pageClose();
    });
    
    appcan.ready(function() {
        var dpr = platform ? window.devicePixelRatio : 1;
        var titleHeight = parseInt($('#Header').height() * dpr),
            pageHeight = parseInt($('#Page').height() * dpr),
            pageWidth = parseInt($('#Page').width() * dpr);
        
        appcan.window.openPopover({
            name: 'model-tab-list-page',
            url: 'model-tab-list-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight - titleHeight
        });
        
        window.onorientationchange = window.onresize = function() {
            titleHeight = parseInt($('#Header').height() * dpr);
            pageHeight = parseInt($('#Page').height() * dpr);
            pageWidth = parseInt($('#Page').width() * dpr);
            
            appcan.window.resizePopover({
                name: 'model-tab-list-page',
                left: 0,
                top: titleHeight,
                width: pageWidth,
                height: pageHeight - titleHeight
            });
        };
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                pageclose();
            }
        };
    })
})($);

function pageClose() {
    appcan.window.close(1);
}
