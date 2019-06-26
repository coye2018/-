;(function ($){
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function (){
        var type=md5("msjcAapp");
        var uniId=md5(appcan.locStorage.getVal("userCode"));uniId=md5('admin1');
        var name=md5(appcan.locStorage.getVal("userName"));name==md5('admin');
        var src="http://majc.baiyunport.com.cn:12012/airport/KN/user/index?type="+type+"&uniId="+uniId+"&name="+name;
        $("#if").attr("src",src);
        
        var platFormC = appcan.locStorage.getVal("platForm");
        var ifm = document.getElementById('if');
        var loadSetFont = function(){
            $(window).trigger('resize');
            var ifb = ifm.contentWindow.document.getElementsByTagName('html')[0];
            var ifmz = window.getComputedStyle(ifb).fontSize;
            if(!isDefine(ifb.style.fontSize) && platFormC=='1'){
                ifb.style.fontSize = parseFloat(ifmz)/window.devicePixelRatio+'px';
            }
        };
        ifm.addEventListener('load', loadSetFont);
        
        //如果是ios设备，设置向右滑动关闭页面
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
    });
    
})($);
