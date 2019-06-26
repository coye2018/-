/**
 * Created by KC on 2017/12/20.
 */
/*appcan.switchBtn('.switch', function (obj, value) {
 //alert('111111')
 })*/
(function ($) {
    var title = localStorage.getItem('patrol-title');
    $('#change').text(title);
    //点击返回
    appcan.button("#nav-left", "btn-act", function () {
        //appcan.window.close(1);
        appcan.frame.evaluateScript({
            name: 'inspect-submit',
            popName: 'inspect-submit-content',
            scriptContent: 'vm.back()'
        });
    });

    appcan.ready(function () {

        //打开浮动页面
        var titleHeight = $('#Header').height();
        var clientH = $(window).height();
        var clientW = $(window).width();
        var footerH = $('#Footer').height();
        //打开浮动页面
        appcan.window.openPopover({
            name: 'inspect-submit-content',
            url: 'inspect-submit-content.html',
            left: 0,
            top: titleHeight,
            width: clientW,
            height: clientH - titleHeight - footerH
        });
        window.onorientationchange = window.onresize = function () {
            //重置指定弹出窗口的高度
            appcan.window.resizePopover({
                name: 'inspect-submit-content',
                url: 'inspect-submit-content.html',
                left: 0,
                top: titleHeight,
                width: clientW,
                height: clientH - titleHeight - footerH
            });
        };
        //安卓手机物理返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function (keyCode) {
            if (keyCode == 0) {
                appcan.frame.evaluateScript({
                    name: 'inspect-submit',
                    popName: 'inspect-submit-content',
                    scriptContent: 'vm.back()'
                });
            }
        };
        //处理IOS向右滑动关闭
        var myPlatForm = localStorage.getItem('platForm');
        var isSupport = true;
        if (myPlatForm == '1') {
            isSupport = false
        }
        var param = {
            isSupport: isSupport
        };

        uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
        //向右滑动的监听方法
        uexWindow.onSwipeRight = function () {
            appcan.frame.evaluateScript({
                name: 'inspect-submit',
                popName: 'inspect-submit-content',
                scriptContent: 'vm.back()'
            });
        };

    });
})($);

