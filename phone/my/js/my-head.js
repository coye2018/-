var vm = new Vue({
    el: '#ScrollContent',
    data: {
        hashead: false,
        headClassBg: '',
        my: {
            userNameShort: '',
            headPic : ''
        }
    },
    methods : {
        openCamera : function() {
            //点击拍照截取头像
            appcan.plugInHeaderByCamera.open(0, 50, function(data) {
                if (isDefine(data)) {
                    //这个地方有显示不出来的问题
                    vm.my.headPic = data;
                    vm.hashead=true;
                }
            });
        },
        openImg : function() {
            //点击从相册中选择截取头像
            appcan.plugInImg.opens(function(data) {
                if (isDefine(data)) {
                    //这个地方有显示不出来的问题
                    vm.my.headPic = data;
                    vm.hashead=true;
                }
            });
        }
    }
});
(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.ready(function() {
        var headPic = appcan.locStorage.getVal("headPortraitURL");
        
        vm.headClassBg = getHeadClass(appcan.locStorage.getVal('userID'));
        vm.my.userNameShort = appcan.locStorage.getVal('userName').substr(-2, 2);
        
        if (!isDefine(headPic)) {
            vm.hashead = false;
        } else {
            vm.hashead = true;
            vm.my.headPic = serverPath + headPic;
        }
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
        appcan.window.publish("my-info-click","my-info-click");
    });

})($);
function saveHeadImg() {
     if(vm.my.headPic.indexOf("http")>=0){
        layerToast("图片未发生改变");
        return false;
    }
    var index = layerLoading();
    var arr = new Array();
    arr.push(vm.my.headPic);
    var json = {
        serverUrl : serverPath + 'focCommonController.do?focupload&uploadPath=personHead',
        filePath : arr,
        quality : 3
    };
    
    appcan.plugInUploaderMgr.upload(json, function(s) {
        if (s.status == 1) {
            vm.my.headPic = serverPath + s.responseString;
            appcan.locStorage.setVal("headPortraitURL", s.responseString);
            ajaxRequest({
                path : serverPath + 'focUserController.do?focsaveHeadImage',
                data : {
                    filePath : s.responseString
                },
                layer : false
            }, function(data, e) {
                //layerRemove(index);
                if (e == "success") {
                    
                    
                    loadAllPeopleInfo(s.responseString,index);
                    
                    
                }else{
                    layerRemove(index);
                }
            })
        } else if (s.status == 2) {
            layerRemove(index);
            layerToast("头像上传失败");
        } else {
        }
    });
    
}

function loadAllPeopleInfo(headPic,index){
    var ajaxJson={
        path:serverPath+"focchat.do?focgetAllUserHeadImages",
        data:{},
        layer:false
    }
    ajaxRequest(ajaxJson,function(data,e){
        if(e=="success"){
            
            //console.log(data);
            layerToast("头像保存成功");
            appcan.window.publish('reloadHead',headPic);
            appcan.locStorage.setVal("headPortraitURL",headPic);
            //将当前登录人所在的一级公司的所有用户的头像信息存入缓存中，以便聊天模块适用。
            appcan.locStorage.setVal("allPeopleHeadImg",JSON.stringify(data.obj));
            appcan.window.close(1);
            
        }else{
            layerRemove(index);
        }
    });
}

$("#nav-right").on("click",function(){
    saveHeadImg();
})
