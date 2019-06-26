/**
 * Created by issuser on 2017/12/21.
 */
(function($) {
    var vm = new Vue({
        el:'#Page',
        data:{
            xunChaRole:'',//角色  0、表示巡查角色  1、二级单位角色   不传表示大队领导角色
            status:'',//状态
        },
        methods:{
            //升级处罚单
            goPunishAdd: function () {
                appcan.window.publish('patrol-upPunish','upPunish');
            },

        },
        created: function () {
            this.xunChaRole = appcan.locStorage.getVal('patrol-role');
            this.status = appcan.locStorage.getVal('patrol-status');
        },
    });
    //返回列表
    appcan.button("#nav-left", "btn-act",function() {
        appcan.window.evaluateScript({
            name: 'reform',
            scriptContent: 'vm.ResetUpScroll()'
        });
        closeMultiPages([
            'reform-temporary',
            'punish-detail',
            'reform-rectification-details'
        ]);
        appcan.window.evaluateScript({
            name: 'punish',
            scriptContent: 'vm.ResetUpScroll()'
        });
        //清除详情页缓存字段
        var reformArr = ['patrol-status', 'patrol-reformId', 'patrol-role','patrol-alertSuccess','patrol-reform-headerNav'];
        reformArr.forEach(function(name){
            appcan.locStorage.remove(name);
        });
    });

    appcan.ready(function() {
        //打开子浮动窗口
        createPopover('reform-rectification-details-content','reform-rectification-details-content.html','');

        //重置指定弹出窗口的高度
        window.onorientationchange = window.onresize = function(){
            var titleHeight = parseInt($('#Header').height()),
                pageHeight = parseInt($('#Page').height()),
                pageWidth = parseInt($('#Page').width());
            appcan.window.resizePopover({
                name: 'reform-rectification-details-content',
                url: 'reform-rectification-details-content.html',
                left: 0,
                top: titleHeight,
                width: pageWidth,
                height: pageHeight-titleHeight
            });
        };

        //防止按钮点击两次
        appcan.window.subscribe('patrol-clickBtn', function (msg) {
            if(msg == 'PassCheckClick'){
//                    $(".btnFooter").attr("disabled", true);
                $('.btnFooter').css({
                    'opacity':0.6
                })
            }else if(msg == 'noPassCheckClick'){
//                    $(".btnFooter").removeAttr("disabled");
                $('.btnFooter').css({
                    'opacity':1
                })
            }
        });

        //处理IOS向右滑动关闭
        var platForm = appcan.locStorage.getVal("platForm"); //是安卓还是IOS
        var isSupport = true;
        if(platForm =='1'){
            isSupport = false
        }
        var param = {
            isSupport: isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
        //向右滑动的监听方法
        uexWindow.onSwipeRight = function() {
            appcan.window.evaluateScript({
                name: 'reform',
                scriptContent: 'vm.ResetUpScroll()'
            });
            closeMultiPages([
                'reform-temporary',
                 'punish-detail',
                'reform-rectification-details'
            ]);
            appcan.window.evaluateScript({
            name: 'punish',
            scriptContent: 'vm.ResetUpScroll()'
        });
            //清除详情页缓存字段
            var reformArr = ['patrol-status', 'patrol-reformId', 'patrol-role','patrol-alertSuccess','patrol-reform-headerNav'];
            reformArr.forEach(function(name){
                appcan.locStorage.remove(name);
            });
        };
//不能滑动的
        //var params  = {
        //    enable:0
        //};
        //var paramStr = JSON.stringify(params);
        //uexWindow.setSwipeCloseEnable(paramStr);

        //处理安卓手机返回键点击返回主页面
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if(keyCode == 0) {
                appcan.window.evaluateScript({
                    name: 'reform',
                    scriptContent: 'vm.ResetUpScroll()'
                });
                closeMultiPages([
                    'reform-temporary',
                     'punish-detail',
                    'reform-rectification-details'
                ]);
                appcan.window.evaluateScript({
                    name: 'punish',
                    scriptContent: 'vm.ResetUpScroll()'
                });
                //清除详情页缓存字段
                var reformArr = ['patrol-status', 'patrol-reformId', 'patrol-role','patrol-alertSuccess','patrol-reform-headerNav'];
                reformArr.forEach(function(name){
                    appcan.locStorage.remove(name);
                });
            }
        };
    })


})($);
//网络连接失败,隐藏底部
function hideFooter(){
    $('#footerBox').hide();
}