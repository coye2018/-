var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
    },
    methods: {
        submit: function() {
            appcan.window.publish('model-form-2-submit', '1');
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
            footerHeight = parseInt($('#Footer').height() * dpr),
            pageHeight = parseInt($('#Page').height() * dpr),
            pageWidth = parseInt($('#Page').width() * dpr);
        
        appcan.window.openPopover({
            name: 'model-form-2-page',
            url: 'model-form-2-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight - titleHeight - footerHeight
        });
        
        window.onorientationchange = window.onresize = function() {
            titleHeight = parseInt($('#Header').height() * dpr);
            footerHeight = parseInt($('#Footer').height() * dpr);
            pageHeight = parseInt($('#Page').height() * dpr);
            pageWidth = parseInt($('#Page').width() * dpr);
            
            appcan.window.resizePopover({
                name: 'model-form-2-page',
                left: 0,
                top: titleHeight,
                width: pageWidth,
                height: pageHeight - titleHeight - footerHeight
            });
        };
        
        //主页面的遮罩
        appcan.window.subscribe('model-form-2-shade', function(v) {
            v == '1' ? layerLoading() : layerRemoveAll();
        });
        
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
