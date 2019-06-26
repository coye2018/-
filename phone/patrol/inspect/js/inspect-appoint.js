/**
 * Created by KC on 2017/12/25.
 */
(function ($) {
    appcan.ready(function () {
        //打开浮动页面
        createPopover('inspect-appoint-content','inspect-appoint-content.html');
    });
    //返回键
    appcan.button('#nav-left', 'btn-act', function() {
        appcan.window.close(-1);
    });
    //安卓手机物理返回键
    appcan.ready(function () {
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.window.close(-1);
            }
        };
    });

})($);
//完成派发后返回之前页面方法
function back() {
    appcan.window.evaluateScript({
        name: 'inspect-finish',
        scriptContent: 'vm.getData()'
    });
    appcan.frame.evaluateScript({
        name:'inspect-submit',
        popName:'inspect-submit-content',
        scriptContent:'loading()'
    });
    appcan.window.evaluateScript({
        name: 'inspect-create',
        scriptContent: 'appcan.window.close(-1)'
    });
    appcan.window.close(-1);
}