appcan.ready(function() {
     $("#pic").css({
         "background-image": "url(loading/img/a_1080_1920.png)",
         "background-size": "100%",
         "background-repeat": "no-repeat"
     });
     var systemScreen = uexDevice.getInfo(18);
     console.log(systemScreen);
     if(systemScreen='1080*1920'){
         $("#pic").css({
             "background-image": "url(loading/img/a_1080_1920.png)",
             "background-size": "100%",
             "background-repeat": "no-repeat"
         });
     }
     else if(systemScreen='1280*1920'){
         $("#pic").css({
             "background-image": "url(loading/img/a_1280_1920.png)",
             "background-size": "100%",
             "background-repeat": "no-repeat"
         });
     }
     else if(systemScreen='640*1136'){
         $("#pic").css({
             "background-image": "url(loading/img/i_640_1136.png)",
             "background-size": "100%",
             "background-repeat": "no-repeat"
         });
     }
     else if(systemScreen='640*960'){
         $("#pic").css({
             "background-image": "url(loading/img/i_640_960.png)",
             "background-size": "100%",
             "background-repeat": "no-repeat"
         });
     }
     
     initChat();
            //监听极光推送机制
     initJpush();
     if(isDefine(appcan.locStorage.getVal("upswd"))){
          appcan.window.open({
                  name:'index',
                  dataType:0,
                  aniId:9,
                  data:'index' + ".html",
                  type:64
             });
      }else{
          appcan.window.open('login','login.html',9);
      }
     
})