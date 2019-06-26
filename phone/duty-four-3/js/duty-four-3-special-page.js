var dutyDeptTime = appcan.locStorage.getVal('dutyDeptTime');

var vm = new Vue({
    el: '#Page',
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    data: {
        showBtn: false,
        textareaOrSpan: 0,
        isSubmit: 'true',
        isFinish: true,
        isReturn: false,
        isUploadShow: true,
        previewImgs: [],
        firstImgs: [],
        maxImgs: 10,
        obj: {
            specialDeptId: '',
            content: '',
            check_images: []
        },
        firstContent: ''
    },
    computed: {
        isUploadShow: function() {
            //超出上传图片数量限制时, 打开相机、相册的按钮隐藏
            return (this.textareaOrSpan == 1 && this.maxImgs - this.previewImgs.length > 0);
        }
    },
    methods: {
        delet: function (arr, index) {
            arr.splice(index, 1);
        },
        openImgFn: function (arr, index) {
            var data ={
                    displayActionButton:true,
                    displayNavArrows:true,
                    enableGrid:true,
                    //startOnGrid:true,
                    startIndex: index,
                    data: arr
            }
            uexImage.openBrowser(data,function(){
            });  
        },
        imgError: function(i) {
            //图片上传失败
            Vue.set(this.previewImgs[i], 'status', 'fail');
        },
        submitDataFn: function() {
            var self = this;
            if (!isDefine(self.obj.content)) {
                layerToast('请输入情况反馈。');
                return;
            };
            
            // 提交的图片
            var submitData = {};
            var isUploadFinish = true;
            $.each(self.previewImgs, function (index, item) {
                if (item.status == 'pending') {
                    isUploadFinish = false;
                    return false;
                } else {
                    submitData["imgURL"+(index+1)] = item.img;
                }
            })
            if (!isUploadFinish) {
                layerToast('请等待图片上传完成。');
                return;
            }
            submitData['id'] = self.obj.specialDeptId;
            submitData['specialCaseFeedbackReply'] = escape(self.obj.content);
            var path = [];
            for(var i = 0 ;i<self.previewImgs.length;i++){
                path.push(self.previewImgs[i].img)
            }
            submitData['specialCaseFeedbackPic'] = path.join(',');
            appcan.window.publish('duty-four-3-special-shade', 'show');
            addConfirm({
                content: '确定提交吗？',
                yes: function(i){
                    sendData(submitData);
                    layerRemove(i);
                },
                no: function (i) {
                    if(vm.isReturn){
                        appcan.window.publish('duty-four-3-special-close');
                    }
                    appcan.window.publish('duty-four-3-special-shade', 'hide');
                    layerRemove(i);
                }
            });
        },
        // saveDataFn:function(){
            // var self = this;
            // var isNeedDraft = false;
            // if (vm.isFinish == false && vm.isSubmit == 'false') {
                // if (isDefine(vm.obj.content) || vm.previewImgs.length != 0) {
                    // isNeedDraft = true;
                // }
            // }
//             
            // if (isNeedDraft == true) {
                 // appcan.window.publish('duty-four-3-special-shade', 'show');
                 // // 保存草稿
                 // saveDraft();
                 // appcan.window.publish('duty-four-3-special-shade', 'hide');
                 // appcan.window.publish('duty-four-3-special-close');
            // }else {
                // // 关闭页面
                // appcan.window.publish('duty-four-3-special-shade', 'hide');
                // appcan.window.publish('duty-four-3-special-close');
            // }
        // }
    }
});


(function($) {
    appcan.ready(function() {
        // 'true'是已交班, 'false'是未交班
        vm.isSubmit = appcan.locStorage.getVal('isSubmit');
        // 基础信息
        var parentData = appcan.locStorage.getVal("duty-four-3-special");
        var specDeptId = appcan.locStorage.getVal('duty-four-3-special-id');
        var specialPic = appcan.locStorage.getVal('duty-four-3-special-pic');
        //本地取数据 JSON.parse  先赋值变量 报错信息：unexpected token u 
        if (!isDefine(parentData) && vm.isSubmit == 'true') {
            vm.obj.content = '无';
        }else if(isDefine(parentData)){
            vm.obj.content = unescape(parentData);
            vm.firstContent = unescape(parentData);
        }
        if(isDefine(specialPic)){
            if(specialPic.indexOf(",") == -1){
                vm.previewImgs.push({
                    img:specialPic,
                    src:serverPath + specialPic,
                    status:'finish'
                });
                vm.firstImgs.push({
                    img:specialPic
                });
            }else{
                for(var i = 0; i < specialPic.split(",").length; i++){
                     var onecePic=specialPic.split(",")[i];
                     vm.previewImgs.push({
                         img:onecePic,
                         src:serverPath + onecePic,
                         status:'finish'
                     });
                     vm.firstImgs.push({
                         img:onecePic
                     });
                }
            }
        }
        vm.obj.specialDeptId = specDeptId;
        // //如未填写则未提交
        // if (vm.obj.content.length <= 0) {
            // vm.isFinish = false;
        // }
//         
        // // 已填写  || 已交班 
        // if (vm.isFinish || vm.isSubmit == 'true') {
            // // $("#txa").attr('readonly', 'readonly');
        // }
        
        // 未填写 && 未交班
        if (vm.isSubmit == 'false') {
            vm.showBtn = true;
            vm.textareaOrSpan = 1;
            // 恢复草稿
            // recoverDraft();
        }
        if(vm.isSubmit == 'true'){
            vm.showBtn = false;
            vm.textareaOrSpan = 2;
            vm.obj.content = unescape(vm.obj.content.replace(/\n/g,"</br>"));
        }
        
        // 弹出框提示保存
        appcan.window.subscribe('save-duty-four-special-draft', function () {
            vm.isReturn = true;
            var imgsHasChanged = false;
            var compareContent = vm.firstContent;
            var compareImgs = vm.firstImgs;
            if(vm.previewImgs.length == compareImgs.length){
                for(var i = 0; i < compareImgs.length; i++){
                    if(vm.previewImgs[i].img != compareImgs[i].img){
                        imgsHasChanged = true;
                        break;
                    }
                }
            }else{
                imgsHasChanged = true;
            }
            if(vm.obj.content != compareContent || imgsHasChanged){
                if(vm.isSubmit == 'false' && isDefine(vm.obj.content)){
                    vm.submitDataFn();
                }else{
                    layerRemove(i);
                    appcan.window.publish('duty-four-3-special-shade', 'hide');
                    appcan.window.publish('duty-four-3-special-close');
                }
            }else{
                layerRemove(i);
                appcan.window.publish('duty-four-3-special-shade', 'hide');
                appcan.window.publish('duty-four-3-special-close');
            }
            
        });
        
    });
})($);

// // 删除草稿
// function deleteDraft() {
    // var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.specialDeptId;
    // appcan.locStorage.remove(draftName);   
// }
// 
// // 保存草稿
// function saveDraft() {
    // var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.specialDeptId;
    // appcan.locStorage.setVal(draftName, JSON.stringify({
        // dutyDate: dutyDeptTime,
        // id: vm.obj.specialDeptId,
        // content: vm.obj.content,
        // imgs: vm.previewImgs
    // }));   
// }
// 
// // 恢复草稿
// function recoverDraft() {
    // var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.specialDeptId;
    // var draft = appcan.locStorage.getVal(draftName);
    // if (isDefine(draft)) {
        // draft = JSON.parse(draft);
        // if (draft.dutyDate == dutyDeptTime && draft.id == vm.obj.specialDeptId) {
            // vm.obj.content = draft.content;
            // vm.previewImgs = draft.imgs;
        // }
    // }
// }

//数据传到后台
function sendData(params){
    var json = {
        path: serverPath + 'focTrackInfoController.do?focAppDoUpdateFeedback',
        data: params,
        layer: true
    };
    console.log(JSON.stringify(json))
    ajaxRequest(json, function(data, e){
        appcan.window.publish('duty-four-3-special-shade', 'hide');
        if(e == 'success'){
            appcan.window.publish('duty-four-3-special');
            appcan.locStorage.remove("duty-four-special-draft");
            appcan.window.publish('duty-four-3-special-close');
        }else{
            layerToast('上传失败，请检查网络是否正常');
        }
    });
}

//获取所在地理位置
function getNowLocation(cb) {
    var openMapFail = false;
    var locaTimeout = setTimeout(function () {
        openMapFail = true;
        cb(null);
    }, 3000);
    //http://newdocx.appcan.cn/plugin-API/SDK/uexBaiduMap
    uexBaiduMap.open(0, 2, 2, 2, '116.309', '39.977', function(){
        uexBaiduMap.hideMap();
        uexBaiduMap.getCurrentLocation(function(error, data){
            clearTimeout(locaTimeout);
            if (!openMapFail) { 
                if (error == 0) {
                    var json = {
                        longitude: data.longitude,
                        latitude: data.latitude
                    };          
                    uexBaiduMap.reverseGeocode(json, function(error, data) {
                        if(error==0){
                            cb(data.address);
                        }else{
                            cb(null);
                        }
                        uexBaiduMap.close();
                    });
                } else {
                    cb(null);
                }
            };
        });
    });
}

// 上传图片
function uploadImgs (imgsArr, pvImgIndex) {
    var json1={
        serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=infomation',
        filePath: imgsArr,
        quality:1
    };
    //上传文件，返回服务器路径
    appcan.plugInUploaderMgr.upload(json1,function(response){
        if(response.status==1){
            vm.previewImgs[pvImgIndex].img = response.responseString;
            vm.previewImgs[pvImgIndex].src = serverPath + response.responseString;
            vm.previewImgs[pvImgIndex].status = 'finish';
        }else if(response.status==2){
            return reject("上传失败，请检查网络是否正常");
        }else{
            vm.previewImgs[pvImgIndex].percent = response.percent+"%";
        }
    });
}
//相册选择
function addPic(e){
    var maxAdd = vm.maxImgs - vm.previewImgs.length;
    if (maxAdd <= 0) return false;
    var json={
        min:1,
        max:maxAdd,
        quality:0.9,
        detailedInfo:true
    } 
    uexImage.openPicker(json, function(error,info){
        if(error==0){
            var xb = vm.previewImgs.length;
            var picPathArrs = info.data;
            for(var i = 0; i < picPathArrs.length; i++){
                vm.previewImgs.push({
                    img: '',  // 图片地址
                    src: '', // 加IP后的图片地址
                    status: 'pending', // 上传状态
                    percent: '1%'  // 上传进度
                });
                (function(h){
                    uploadImgs([picPathArrs[h]], xb + h);
                })(i);
            }
        }else{
        }
    });
}
//拍照
function openCamera(e){
    // if(vm.previewImgs.length >= 10){
        // layerToast('最多允许上传十张巡查图片。');
        // return;
    // }
    // 打开相机
    uexCamera.open(0, 90, function(picPath) {
        var picPathArrs = [picPath];
        vm.previewImgs.push({
            img: '',  // 图片地址
            src: '', // 加IP后的图片地址
            status: 'pending', // 上传状态
            percent: '1%'  // 上传进度
        })
        uploadImgs(picPathArrs, vm.previewImgs.length - 1);
    }); 
}
