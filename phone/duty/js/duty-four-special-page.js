var vm = new Vue({
    el: '#Page',
    data: {
        specialInfo: {
            content: '',
            imgURL: ''
        }
    },
    methods: {
        deletimg:function(){
            Vue.set(vm.specialInfo,"imgURL","");
        }
    }
});

(function($) {
    
    //读取duty-four.html传来的数据
    var this_spcl = appcan.locStorage.getVal('duty-4-special');
    if(isDefine(this_spcl)){
        vm.specialInfo = $.extend({}, JSON.parse(this_spcl));
    }else{
        var dutySpecialContent=appcan.locStorage.getVal("dutySpecialContent");
        if(isDefine(dutySpecialContent)){
            vm.specialInfo.content =dutySpecialContent;
        }
        var dutySpecialImg=appcan.locStorage.getVal("dutySpecialImg");
        if(isDefine(dutySpecialImg)){
            vm.specialInfo.imgURL =dutySpecialImg;
        }
    }
    
    appcan.ready(function() {

        appcan.window.subscribe('duty-four-special-save', function (){
            if(vm.specialInfo.content.trim() == ''){
                layerToast('请描述特殊情况。');
                return false;
            }else{
                layerToast("保存成功");
                appcan.locStorage.setVal("dutySpecialContent",vm.specialInfo.content);
                //appcan.window.publish('duty-four-special', JSON.stringify(vm.specialInfo));
                appcan.window.publish('duty-four-special-page-close', JSON.stringify(vm.specialInfo));
            }
        });
        
    });
    
})($);


function addPic(e){
    var json={
        min:1,
        max:1,
        quality:0.5,
        detailedInfo:true
    } 
    uexImage.openPicker(json, function(error,data){
        if(error==0){
            var arr=new Array();
            arr.push(data.data[0]);
                 var json1={
                    serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=duty4Must',
                    filePath:arr,
                    quality:3
                 };
                 appcan.plugInUploaderMgr.upload(json1,function(e){
                     if(e.status==1){
                         vm.specialInfo.imgURL=serverPath+e.responseString;
                         //将图片存入缓存中，以便下次进入4必时显示出来图片。
                         appcan.locStorage.setVal("dutySpecialImg",serverPath+e.responseString);
                         appcan.locStorage.setVal("dutySpecialImgSave",e.responseString);
                     }else if(e.status==2){
                     }else{
                     }
                 });
        }else{
        }
    });
}
