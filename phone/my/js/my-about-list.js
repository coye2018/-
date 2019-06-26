//定义vue， 
var vm = new Vue({
    el: '#ScrollContent',
    data: {
        version:[],
        platForm:0
    },
    methods: { 
        unclick:function(item){
            //将功能页点击事件锁死以防止多次打开页面
            noClick($('.lists-box'));
            var platForm=appcan.locStorage.getVal("platForm");
            appcan.locStorage.setVal("versionDes",JSON.stringify(item));
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('my-about-article','my-about-article6.html',2);
            }else{
                appcan.window.open({
                    name:'my-about-article',
                    dataType:0,
                    data:'my-about-article6.html',
                    aniId:aniId,
                    type:1024
                });
            }
        }
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
        appcan.window.subscribe("my-about-article-click",function(e){
            yesClick($('.lists-box'));
            
        })
        var platFormC=appcan.locStorage.getVal("platForm");
        vm.platForm=Number(platFormC);
        loadAppVersionDs(platFormC);
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        //uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        //uexWindow.onSwipeRight = function(){
             //appcan.window.close(-1); 
        //}
    });
})($);
function loadAppVersionDs(platForm){
    var json={
        path:serverPath+"appVersionController.do?focGetHistoryVersions",
        data:{
             
        },
        layer:false
    };
    ajaxRequest(json,function(data,e){
        //console.log(data);
        if(e=="success"){
            for (var i=0; i < data.obj.length; i++) {
              data.obj[i].create_time=timeStemp(Number(data.obj[i].create_time),'yyyy-MM-dd HH:mm').date;           
            };
            vm.version=data.obj;
        }
    })
}

//点击列表跳转到相应页面
$(".edition > .lists-box").click(function(){
    var platForm=appcan.locStorage.getVal("platForm");
    var editionId=$(this).attr("id");
    appcan.locStorage.setVal('ediId',editionId);
    if(platForm=="1"){
        appcan.window.open("../my/my-about-article","../my/my-about-article.html",2);
    }else{
        appcan.window.open({
            name:'../my/my-about-article',
            dataType:0,
            data:'../my/my-about-article.html',
            aniId:0,
            type:1024
        });
    }
})

