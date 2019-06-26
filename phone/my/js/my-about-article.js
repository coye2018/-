//定义vue， 
var vm = new Vue({
    el: '#ScrollContent',
    data: {
        version:[],
        platForm:0,
    },
    methods: { 
         
    }
});
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
         var platFormC=appcan.locStorage.getVal("platForm");
         vm.platForm=Number(platFormC);
        var versionDs=JSON.parse(appcan.locStorage.getVal("versionDes"));
        vm.version=versionDs;
       
        appcan.window.publish("my-about-article-click","my-about-article-click");
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
             appcan.window.close(-1); 
        }

        //新版本发布控制
        //平台Android、iOS
        var platformName=appcan.widgetOne.getPlatformName();
        var ediId=appcan.locStorage.getVal('ediId');
        if (ediId==13){
            $(".uh h1").html("新版本介绍");
        }
        if(platformName=="android"){
            if(ediId){
                $(".edi"+ediId+"").show();
            }
        }else{
            if(ediId){
                $(".ios"+ediId+"").show();
            }
        }
    });

})($);

// var ediId=appcan.locStorage.getVal('ediId');
//
// if(ediId){
//     $(".edi"+ediId+"").show();
// }






