(function($) {
    var bgData = [
        {bgclass: 'bc-bg', bgname: '默认'},
        {bgclass: 'bg-tbg-0', bgname: '自然清新'},
        {bgclass: 'bg-tbg-1', bgname: '高贵典雅'},
        {bgclass: 'bg-tbg-2', bgname: '土豪金'},
        {bgclass: 'bg-tbg-3', bgname: '东北银'},
        {bgclass: 'bg-tbg-4', bgname: '黑夜精灵'},
        {bgclass: 'bg-tbg-5', bgname: '爱莲说'},
        {bgclass: 'bg-tbg-6', bgname: '青青草原'},
        {bgclass: 'bg-tbg-7', bgname: '粉红心事'}
    ];
    
    var chatbg = appcan.locStorage.getVal('chatbg');
    if(!isDefine(chatbg)){
        chatbg = 'bc-bg';
        appcan.locStorage.setVal('chatbg', chatbg);
    }
    
    for(var g=0; g<bgData.length; g++){
        if(chatbg == bgData[g].bgclass){
            $('#bgname').text(bgData[g].bgname);
            break;
        }
    }
    
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        appcan.window.subscribe('my-general-bg-name', function(msg){
            $('#bgname').text(msg);
        });
        var platFormC=appcan.locStorage.getVal("platForm");
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
        appcan.window.publish("my-general-click","my-general-click");
        appcan.window.subscribe('my-general-bg-click', function(msg){
            yesClick($("#fromDefault"));
        });
    });
    
    appcan.button("#fromDefault", "btn-act", function() {
        noClick($("#fromDefault"));
        appcan.locStorage.setVal('chatbgdata', JSON.stringify(bgData));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-general-bg-default','my-general-bg-default.html',2);
        }else{
            appcan.window.open({
                name:'my-general-bg-default',
                dataType:0,
                data:'my-general-bg-default.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    
})($);