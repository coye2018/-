var dutyDeptTime = appcan.locStorage.getVal('dutyDeptTime');
//http://10.135.16.104:9080/single/focTrackInfoController.do?focAppDoUpdatePerson&id=trackPersonReply=&trackPersonPic=
//http://10.135.16.104:9080/single/focCommonController.do?focupload&upload=
var vm = new Vue({
    el: '#Page',
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    data: {
        showBtn: false,
        textareaOrSpan: 0,
        picLen: 0,
        isSubmit: false,
        isReturn: false,
        previewImgs: [],
        firstImgs: [],
        obj: {
            id: '',
            questionDeptId: '',
            startTime: '',
            endTime: '',
            question: '',
            content: '',
            create_time: '',
            check_images: [],
            create_time_detail: [],
            status: ''
        },
        firstContent: ''
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
                layerToast('请输入必见人员对必问问题的回复。');
                return;
            };
            if (self.previewImgs.length <= 0) {
                layerToast('请上传人员照片。');
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
            submitData['id'] = self.obj.questionDeptId;
            submitData['trackPersonReply'] = escape(self.obj.content);
            // submitData['dutyDate'] = appcan.locStorage.getVal('dutyDeptTime');
            var path = [];
            for(var i = 0 ;i<self.previewImgs.length;i++){
                path.push(self.previewImgs[i].img)
            }
            submitData['trackPersonPic'] = path.join(',')
            appcan.window.publish('duty-four-3-question-shade', 'show');
            addConfirm({
                content: '确定提交吗？',
                yes: function(i){
                    
                    sendData(submitData);
                    layerRemove(i);
                },
                no: function (i) {
                    if(vm.isReturn){
                        appcan.window.publish('duty-four-3-question-close');
                    }
                    appcan.window.publish('duty-four-3-question-shade', 'hide');
                    layerRemove(i);
                }
            });
        },
        // saveDataFn:function(){
            // var self = this;
            // var isNeedDraft = false;
            // if (vm.obj.status == 'todo' && vm.isSubmit == 'false') {
                // if (isDefine(vm.obj.content) || vm.previewImgs.length != 0) {
                    // isNeedDraft = true;
                // }
            // }
//             
            // if (isNeedDraft == true) {
                // appcan.window.publish('duty-four-3-question-shade', 'show');
                // //保存草稿
                // saveDraft();
                // appcan.window.publish('duty-four-3-question-shade', 'hide');
                // appcan.window.publish('duty-four-3-question-close');
            // } else {
                // // 关闭页面
                // appcan.window.publish('duty-four-3-question-shade', 'hide');
                // appcan.window.publish('duty-four-3-question-close');
            // }
        // }
    }
});

(function($) {
    appcan.ready(function() {
        
        // 'true'是已交班, 'false'是未交班
        vm.isSubmit = appcan.locStorage.getVal('isSubmit');
        var parentData= JSON.parse(appcan.locStorage.getVal("duty-four-3-question"));
        if (isDefine(parentData)) {
            // 基础信息
            vm.obj.id = parentData.id;
            vm.obj.status = parentData.status;
            vm.obj.person = parentData.person.replace(/\r\n/g,"</br>");
            vm.obj.question = parentData.issue.replace(/\r\n/g,"</br>");
            vm.obj.questionDeptId = parentData.questionDeptId;
            var questionPic = parentData.mustPersonQuestionPic;
            var questionData = parentData.mustPersonQuestionData;
            if (isDefine(questionData)) {
                // 提交后的信息 
                vm.obj.content = unescape(questionData);
                
                vm.firstContent = unescape(questionData);
                vm.obj.create_time = questionData.create_time;
                vm.obj.create_time_detail = questionData.create_time_detail;
                var imges = [questionData.check_image1, questionData.check_image2, questionData.check_image3];
                $.each(imges, function (index, item) {
                    if (item != null) {
                        vm.obj.check_images.push(item);
                    }
                })
            }
            if(isDefine(questionPic)){
                if(questionPic.indexOf(",") == -1){
                    vm.previewImgs.push({
                        img:questionPic,
                        src:serverPath + questionPic,
                        status:'finish'
                    });
                    vm.firstImgs.push({
                        img:questionPic
                    });
                }else{
                    for(var i = 0; i < questionPic.split(",").length; i++){
                        var onecePic=questionPic.split(",")[i];
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
            
        }
        
        // 已交班 && 已完成
        if (vm.obj.status == 'todo' && vm.isSubmit == 'true') {
            vm.obj.content = '无';
             
        }
        
        // 未交班 && 未完成
        if (vm.isSubmit == 'false') {
            $("#txa").removeAttr('readonly');
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
        // 底部提交按钮
        appcan.window.subscribe('duty-four-question-submit', function () {
            submitQuestionData();
        });
        
        // 保存草稿
        appcan.window.subscribe('save-duty-four-question-draft', function () {
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
                if(vm.isSubmit == 'false' && isDefine(vm.obj.content) && vm.previewImgs.length != 0){
                    vm.submitDataFn();
                }else{
                    layerRemove(i);
                    appcan.window.publish('duty-four-3-question-shade', 'hide');
                    appcan.window.publish('duty-four-3-question-close');
                }
            }else{
                layerRemove(i);
                appcan.window.publish('duty-four-3-question-shade', 'hide');
                appcan.window.publish('duty-four-3-question-close');
            }
            
        });
        
    });
})($);



//数据传到后台
function sendData(params){
    var json = {
        path: serverPath + 'focTrackInfoController.do?focAppDoUpdatePerson',
        data: params,
        layer: true
    };
    ajaxRequest(json, function(data, e){
        appcan.window.publish('duty-four-3-question-shade', 'hide');
        if(e == 'success'){
            appcan.window.publish('duty-four-3-question');
            appcan.window.publish('duty-four-3-question-close');
        }else{
            layerToast('上传失败，请检查网络是否正常');
        }
    });
}

// // 删除草稿
// function deleteDraft() {
    // var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.id;
    // appcan.locStorage.remove(draftName);   
// }

// 保存草稿
// function saveDraft() {
    // var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.id;
    // appcan.locStorage.setVal(draftName, JSON.stringify({
        // dutyDate: dutyDeptTime,
        // id: vm.obj.id,
        // content: vm.obj.content,
        // imgs: vm.previewImgs
    // }));   
// }

// 恢复草稿
// function recoverDraft() {
    // var draftName = 'duty-four-draft-'+ dutyDeptTime + '-' + vm.obj.id;
    // var draft = appcan.locStorage.getVal(draftName);
    // if (isDefine(draft)) {
        // draft = JSON.parse(draft);
        // if (draft.dutyDate == dutyDeptTime && draft.id == vm.obj.id) {
            // vm.obj.content = draft.content;
            // vm.previewImgs = draft.imgs;
        // }
    // }
// }



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
                    if(data.hasOwnProperty('address')){
                        cb(data.address);
                        uexBaiduMap.close();
                    }else{
                       uexBaiduMap.reverseGeocode(json, function(error, data) {
                            if(error==0){
                                // addr = data.address;
                                cb(data.address);
                            }else{
                                cb(null);
                            }
                            uexBaiduMap.close();
                        }); 
                    }          
                    
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
            params.address = isDefine(params.address) ? encodeURI(encodeURI(params.address)) : encodeURI(encodeURI(''));
            var json1={
                serverUrl:serverPath+'focCommonController.do?focUploadForWaterMark&uploadPath=duty4Must&position='+ params.address,
                filePath: params.urlArr,
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
        });
    }).catch(function (errText) {
          vm.previewImgs.splice(pvImgIndex, 1);
          layerToast(isDefine(errText) ? errText : '上传失败，请检查定位或网络是否正常');
    })  
}

//拍照
function openCamera(e){
    if(vm.previewImgs.length >= 10){
        layerToast('最多允许上传十张巡查图片。');
        return;
    }
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


// setTimeout(function(){
    // Vue.set(vm.obj, "value", {
        // "id": 12,
        // "startTime": "08:30:00",
        // "mustTimePlaceData": {
            // "id": 123,
            // "content": "内容",
            // "check_time_place_id": 12,
            // "check_image1": "http://10.10.11.122:9081/single/imgURL1",
            // "check_image2": "http://10.10.11.122:9081/single/imgURL2",
            // "check_image3": "http://10.10.11.122:9081/single/imgURL3",
            // "duty_time": 1517448252,
            // "create_time": 1517450405,
            // "create_time_format": "10:00:05",
            // "create_time_detail": "02-01 10:00"
        // },
        // "place": "地点1",
        // "endTime": "10:30:00",
        // "status": "normal"
    // });
// },50)
