var dutyDeptTime = appcan.locStorage.getVal('dutyDeptTime');

var vm = new Vue({
    el: '#Page',
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    data: {
        showBtn: false,
        isSubmit: 'true',
        isFinish: true,
        previewImgs: [],
        obj: {
            content: '',
            check_images: []
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
            submitData['content'] = self.obj.content;
            submitData['dutyDate'] = dutyDeptTime;
            
            appcan.window.publish('duty-four-2-special-shade', 'show');
            addConfirm({
                content: '确定提交吗？',
                yes: function(i){
                    sendData(submitData);
                    layerRemove(i);
                },
                no: function (i) {
                    appcan.window.publish('duty-four-2-special-shade', 'hide');
                    layerRemove(i);
                }
            });
        },
        saveDataFn:function(){
            var self = this;
            var isNeedDraft = false;
            if (vm.isFinish == false && vm.isSubmit == 'false') {
                if (isDefine(vm.obj.content) || vm.previewImgs.length != 0) {
                    isNeedDraft = true;
                }
            }
            
            if (isNeedDraft == true) {
                 appcan.window.publish('duty-four-2-special-shade', 'show');
                 // 保存草稿
                 saveDraft();
                 appcan.window.publish('duty-four-2-special-shade', 'hide');
                 appcan.window.publish('duty-four-2-special-close');
            }else {
                // 关闭页面
                appcan.window.publish('duty-four-2-special-shade', 'hide');
                appcan.window.publish('duty-four-2-special-close');
            }
        }
    }
});


(function($) {
    appcan.ready(function() {
        
        // 'true'是已交班, 'false'是未交班
        vm.isSubmit = appcan.locStorage.getVal('isSubmit');
        // 基础信息
        var parentData= JSON.parse(appcan.locStorage.getVal("duty-four-2-special"));
        if (isDefine(parentData)) {
            vm.obj.id = parentData.id;
            vm.obj.content = parentData.content;
            var imges = [parentData.image1, parentData.image2, parentData.image3];
            $.each(imges, function (index, item) {
                // alert(item);
                if (item != null) {
                    vm.obj.check_images.push(item);
                }
            })
        }
        
        
        //如未填写则未提交
        if (vm.obj.content.length <= 0) {
            vm.isFinish = false;
        }
        
        // 已填写  || 已交班 
        if (vm.isFinish || vm.isSubmit == 'true') {
            $("#txa").attr('readonly', 'readonly');
        }
        
        // 未填写 && 未交班
        if (vm.isFinish == false && vm.isSubmit == 'false') {
            vm.showBtn = true;
            // 恢复草稿
            recoverDraft();
        }
        
        // 保存草稿
        appcan.window.subscribe('save-duty-four-special-draft', function () {
            var isNeedDraft = false;
            if (vm.isFinish == false && vm.isSubmit == 'false') {
                if (isDefine(vm.obj.content) || vm.previewImgs.length != 0) {
                    isNeedDraft = true;
                }
            }
            
            if (isNeedDraft == true) {
                appcan.window.publish('duty-four-2-special-shade', 'show');
                addConfirm({
                    content: '是否要保存草稿？',
                    shadeClose: false,
                    yes: function(i){
                        // 保存草稿
                        saveDraft();
                        layerRemove(i);
                    },
                    no: function (i) {
                        // 删除草稿
                        deleteDraft();
                        layerRemove(i);
                    },
                    end: function () {
                        appcan.window.publish('duty-four-2-special-shade', 'hide');
                        appcan.window.publish('duty-four-2-special-close');
                    }
                }); 
            } else {
                // 关闭页面
                appcan.window.publish('duty-four-2-special-shade', 'hide');
                appcan.window.publish('duty-four-2-special-close');
            }
        });
        
    });
})($);

// 删除草稿
function deleteDraft() {
    var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.id;
    console.log(draftName)
    appcan.locStorage.remove(draftName);   
}

// 保存草稿
function saveDraft() {
    var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.id;
    console.log(draftName)
    appcan.locStorage.setVal(draftName, JSON.stringify({
        dutyDate: dutyDeptTime,
        id: vm.obj.id,
        content: vm.obj.content,
        imgs: vm.previewImgs
    }));   
}

// 恢复草稿
function recoverDraft() {
    var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.id;
    console.log(draftName)
    var draft = appcan.locStorage.getVal(draftName);
    if (isDefine(draft)) {
        draft = JSON.parse(draft);
        if (draft.dutyDate == dutyDeptTime && draft.id == vm.obj.id) {
            vm.obj.content = draft.content;
            vm.previewImgs = draft.imgs;
        }
    }
}

//数据传到后台
function sendData(params){
    var json = {
        path: serverPath + 'focFourMustController.do?focAddSpecialInfo',
        data: params,
        layer: true
    };
    ajaxRequest(json, function(data, e){
        appcan.window.publish('duty-four-2-special-shade', 'hide');
        if(e == 'success'){
            appcan.window.publish('duty-four-2-special');
            appcan.locStorage.remove("duty-four-special-draft");
            appcan.window.publish('duty-four-2-special-close');
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
    new Promise(function (resolve, reject) {
        getNowLocation(function (result) {
             if (isDefine(result)) {
                return resolve({
                    address: result,
                    urlArr: imgsArr
                });
             } else {
                return resolve({
                    address: null,
                    urlArr: imgsArr
                });
             }
        });
    }).then(function (params) {
        return new Promise(function (resolve, reject) {
            params.address = isDefine(params.address) ? encodeURI(encodeURI(params.address)) : encodeURI(encodeURI('暂未获取定位信息'));
            var json1={
                serverUrl:serverPath+'focCommonController.do?focUploadForWaterMark&uploadPath=duty4Must&position='+ params.address,
                filePath: params.urlArr,
                quality:3
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
        });
    }).catch(function (errText) {
          vm.previewImgs.splice(pvImgIndex, 1);
          layerToast(isDefine(errText) ? errText : '上传失败，请检查定位或网络是否正常');
    })  
}

//拍照
function openCamera(e){
    if(vm.previewImgs.length >= 3){
        layerToast('最多允许上传三张巡查图片。');
        return;
    }
    // 打开相机
    uexCamera.open(0, 40, function(picPath) {
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
