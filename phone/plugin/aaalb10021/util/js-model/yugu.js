//鱼骨图
new Vue({
    el : '#Page',
    data : {
        progShowMax : 4, //折叠时只显示前progShowMax个
        option : [{
            "optionuser" : "沈斌",
            "optiondepartname" : "飞管",
            "optiontime" : 1548653242000,
            "optionflag" : 10,
            "optioncode" : "飞行区管理部验收通过,流程结束。",
            "optioncontent" : ""
        }, {
            "optionuser" : "钟莹",
            "optiondepartname" : "信息",
            "optiontime" : 1548395352000,
            "optionflag" : 8,
            "optioncode" : "信息科技公司整改完成了问题：",
            "optioncontent" : "基本龙膜go金融圈诺黑哦哦外婆公婆木木木西五巷鱼死网破童年哦婆婆孔融你哦婆婆MSN你哦婆婆go哦婆婆婆匿名磨破木木途游进哦咯够了吗诺"
        }, {
            "optionuser" : "testxinxi",
            "optiondepartname" : "信息",
            "optiontime" : 1548385786000,
            "optionflag" : 7,
            "optioncode" : "信息科技公司接收了问题：",
            "optioncontent" : "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
        }, {
            "optionuser" : "feiguan",
            "optiondepartname" : "飞管",
            "optiontime" : 1548385669000,
            "optionflag" : 4,
            "optioncode" : "飞行区管理部接收了问题并转派给了信息科技公司：",
            "optioncontent" : ""
        }, {
            "optionuser" : "testxinxi",
            "optiondepartname" : "信息",
            "optiontime" : 1548379214000,
            "optionflag" : 1,
            "optioncode" : "信息科技公司报送了问题给飞行区管理部。",
            "optioncontent" : ""
        }]
    }
})


(function($) {
    appcan.button('#nav-left', 'btn-act', function() {
        pageClose();
    });

    appcan.ready(function() {

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