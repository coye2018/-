(function($) {
    appcan.button("#nav-left", "btn-act",function() {
        appcan.window.close(1);
        appcan.window.evaluateScript({
            name: 'reform',
            scriptContent: 'vm.ResetUpScroll()'
        });
    });
    appcan.button("#nav-right", "btn-act",function() {
        appcan.window.close(1);
        appcan.window.evaluateScript({
            name: 'reform',
            scriptContent: 'vm.ResetUpScroll()'
        });
    });

    appcan.ready(function() {
        //打开子浮动窗口
        createPopover('reform-temporary-content','reform-temporary-content.html');

        window.onorientationchange = window.onresize = function(){
            var titleHeight = parseInt($('#Header').height()),
                pageHeight = parseInt($('#Page').height()),
                pageWidth = parseInt($('#Page').width());

            //重置指定弹出窗口的高度
            appcan.window.resizePopover({
                name: 'reform-temporary-content',
                url: 'reform-temporary-content.html',
                left: 0,
                top: titleHeight,
                width: pageWidth,
                height: pageHeight-titleHeight
            });
        };

    })

})($);