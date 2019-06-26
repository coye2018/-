(function($) {
    var main;
    
    appcan.button("#nav-left", "btn-act",
    function() {});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        $('#btn_back').on('click', function(e) {
            closeWidget();
        });
        
        $('#btn_enter').on('click', function(e) {
            appcan.window.open({
                name: 'model-tab-list',
                data: 'model/model-tab-list.html',
                aniId: 0
            })
        });
        
        //获取打开者传入此widget的相关信息
        appcan.widget.getOpenerInfo(function(err,data,dataType,opId){
            if (!err){
                main = data;
            }
        });
        
        //监听系统返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                closeWidget();
            }
        };
        
        var paramClose = {
            isSupport: (main.platForm != "1")
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            closeWidget();
        };
    });
    
    function closeWidget() {
        //退出一个widget执行的操作
        appcan.widget.finishWidget({
            resultInfo : "关闭啦！",
            appId : "aaalb10021",
            isWgtBG : 0
        });
    }
})($);