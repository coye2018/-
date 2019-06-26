function a(){
    
    d();
    //c();
    return;
    //b();
    //return;
    var data={
                min:1,
                max:6,
                title:"ttttt",
                quality:0.5,
                //usePng:true,
                detailedInfo:true
            }
            var json=JSON.stringify(data);
            uexImage.openPicker(json,function(error,info){
                if(error==-1){
                }else if(error==0){
                       var json={
                            url:'http://10.10.11.120:8080/single/focInformationInfoController.do?doAdd',
                            filePath:info.data,
                            quality:3
                        };
                         appcan.plugInUploaderMgr.upload(json,function(e){
                             if(e.status==1){
                                 alert("成功");
                             }else if(e.status==2){
                                 alert("失败");
                             }else{
                                 $("#jd").html(e.percent+"%");
                             }
                         });
                       
                }else{
                }
            });
    
    
   
}
function b(){
    uexFileMgr.multiExplorer("/sdcard/widgetone",function(err,path){
    if(!err){
        //上传的方法。
        /**
         * 参数构成：
         * json={
         *     serverUrl为上传的路径
         *     filePath为文件地址的数组
         *     quality：类型如果为图片,表示是否需要压缩及压缩质量. 0:不压缩 1:高质量压缩 2:中质量压缩 3:低质量压缩
         * }
         */
        var json={
                    serverUrl:'http://10.10.11.120:8080/single/focInformationInfoController.do?doAdd',
                    filePath:path,
                    quality:3
                 };
                 appcan.plugInUploaderMgr.upload(json,function(e){
                     if(e.status==1){
                         alert("成功");
                     }else if(e.status==2){
                         alert("失败");
                     }else{
                         $("#jd").html(e.percent+"%");
                     }
                     
                 });
    }else{
        alert(err);
    }
    });
}
function c(){
        var json={
                    serverUrl:'http://10.10.236.142:8080/upload/zhanghuiTest.apk',
                    downloadUrl:'/sdcard/zhanghuiTest.apk'
        };
       appcan.plugInDownloaderMgr.download(json,function(e){
             if(e.status==1){
                 alert("成功");
             }else if(e.status==2){
                 alert("失败");
             }else{
                 uexWindow.toast('1', '5', '下载进度：' + e.percent + '%', '');
             }
       });
}
function d(){
    /**参数  如果为android 这两个参数可以为空，如果是ios则这两个参数第一个为检查版本更新地址，第二个为启动appStore的下载地址
     * 返回的参数为1时不需要更新，可直接登录，如果请求失败的话则提示网络错误 返回参数为2
     */
    var json={
        AppStoreUrl:"http://itunes.apple.com/cn/lookup?id=1153268668",
        IosUpdateUrl:"http://itunes.apple.com/cn/app/hang-xing-jia/id1153268668?mt=8"
    };
   appcan.plugInCheckUpdate.checkUpdate(json,function(e){
             if(e==1){
                 //直接登录系统
             }else{
                 //其他操作。
             }
   });
}