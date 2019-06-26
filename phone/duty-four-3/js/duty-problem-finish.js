var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');

var vm = new Vue({
    el: '#duty-problem-finish',
    data: {
        text: '',
        textMax: 100,
        isUploadShow: true,
        previewImgs: [],
        maxImgs: 3,
        realImgs: []
    },
    computed: {
        isUploadShow: function() {
            //超出上传图片数量限制时, 打开相机、相册的按钮隐藏
            return (this.maxImgs - this.previewImgs.length > 0);
        }
    },
    methods: {
        openImgFn: function (arr, index) {
            uexImage.openBrowser({
                displayActionButton: true,
                displayNavArrows: true,
                enableGrid: true,
                //startOnGrid:true,
                startIndex: index,
                data: arr
            }, function() {});
        },
        delet: function (arr, index) {
            arr.splice(index, 1);
        },
        imgError: function(i) {
            //图片上传失败
            Vue.set(this.previewImgs[i], 'status', 'fail');
        },
        modalClose: function() {
            pageClose();
        },
        finish: function() {
            finishConfirm();
        }
    }
})

//本单位整改完成, 提交数据
function finishConfirm() {
    if (vm.text == '') {
        layerToast('请填写整改措施。');
        return false;
    }
    
    if (vm.text.length > vm.textMax) {
        layerToast('整改措施字数不得超过' + vm.textMax + '。');
        return false;
    }
    
    vm.realImgs.splice(0, vm.realImgs.length);
    for(var j = 0 ; j < vm.previewImgs.length; j++) {
        var img_this = vm.previewImgs[j];
        if (img_this.status == 'pending') {
            layerToast('请等待图片上传完成。');
            return false;
        } else if (img_this.status == 'finish') {
            vm.realImgs.push(img_this.img);
        }
    }
    
    var json = {
        path: serverPath + 'focDutyProblemController.do?focFinishProblem',
        data: {
            problemId: dataId,
            content: escape(vm.text),
            pictures: vm.realImgs 
        },
        layer: true
    };
    
    ajaxRequest(json, function(data, e) {
        if (e == 'success') {
            appcan.window.publish('duty-problem-my-reload', 1);
            appcan.window.publish('duty-problem-detail-close', 0);
            pageClose();
        } else {
            layerToast('网络错误，请稍后重试。');
        }
    });
}

//关闭浮动窗口
function pageClose() {
    appcan.window.close(1);
}

(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('duty-problem-finish-modal', function(e) {
            pageClose();
        })
        
        //右滑关闭, 主窗口浮动窗口分别调用
        var paramClose = {
            isSupport: platForm != '1'
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            pageClose();
        };
    });
    
})($);


function addPic(e) {
    var maxAdd = vm.maxImgs - vm.previewImgs.length;
    if (maxAdd <= 0) return false;
    
    var json = {
        min: 1,
        max: maxAdd,
        quality: 0.9,
        detailedInfo: true
    };
    uexImage.openPicker(json, function(error, data) {
        if (error == 0) {
            var xb = vm.previewImgs.length;
            var picPathArrs = data.data;
            
            for (var i = 0; i < picPathArrs.length; i++) {
                vm.previewImgs.push({
                    img: '',  // 图片地址
                    src: '', // 加IP后的图片地址
                    status: 'pending', // 上传状态
                    percent: '1%'  // 上传进度
                });
                
                (function(h) {
                    uploadImgs([picPathArrs[h]], xb + h);
                })(i);
            }
        }
    });
}

//拍照
function openCamera(e) {
    var comtextareass = 0;
    var quality = 90;
    uexCamera.open(comtextareass, quality, function(picPath) {
        vm.previewImgs.push({
            img: '',  // 图片地址
            src: '', // 加IP后的图片地址
            status: 'pending', // 上传状态
            percent: '1%'  // 上传进度
        });
        
        uploadImgs([picPath], vm.previewImgs.length - 1);
    });
}

function uploadImgs(imgsArr, pvImgIndex) {
    var json1 = {
        serverUrl: serverPath + 'focCommonController.do?focupload&uploadPath=problemFinish',
        filePath: imgsArr,
        quality: 1
    };
    //上传文件，返回服务器路径  
    appcan.plugInUploaderMgr.upload(json1, function(e) {
        // 0-上传中 1-上传成功 2-上传失败
        if (e.status == 1) {
            vm.previewImgs[pvImgIndex].img = e.responseString;
            vm.previewImgs[pvImgIndex].src = serverPath + e.responseString;
            vm.previewImgs[pvImgIndex].status = 'finish';
        } else if (e.status == 2) {
            vm.previewImgs[pvImgIndex].status = 'fail';
        } else {
            vm.previewImgs[pvImgIndex].percent = e.percent + "%";
        }
    });
}