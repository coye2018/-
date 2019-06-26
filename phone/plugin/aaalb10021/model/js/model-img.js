var platform = localStorage.getItem('myPlatform');
var swiper_show, swiper_upload;

var vm = new Vue({
    el: '#Page',
    data: {
        maxEvery: 3,
        maxImgs: 10,
        previewImgs: []
    },
    mounted: function() {
        initPicSlide();
        initPicUpload();
    },
    methods: {
        deleteImgs: function(i) {
            //删除图片
            this.previewImgs.splice(i, 1);
            setTimeout(function() {
                swiper_upload.update(true);
            }, 0)
        }
    }
});

(function($) {
    appcan.button('#nav-left', 'btn-act',function() {
        pageClose();
    });
    
    appcan.ready(function() {
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                pageclose();
            }
        };
    })
})($);

function pageClose() {
    appcan.window.close(1);
}

//图片展示
function initPicSlide() {
    swiper_show = new Swiper('#pic_show', {
        slidesPerView: 'auto',
        freeMode: true,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 10
        },
    });
}

//图片上传
function initPicUpload() {
    swiper_upload = new Swiper('#pic_upload', {
        slidesPerView: 'auto',
        freeMode: true
    });
}

//拍照
function openCamera(e) {
    vm.previewImgs.push({
        img: '',
        src: 'http://temp.im/'+parseInt(Math.random() * 1000)+'x'+parseInt(Math.random() * 1000),
        status: 'finish',
        percent: '100%'
    });
    
    setTimeout(function() {
        console.log(vm.previewImgs);
        //更新要放最后执行才有效果, 否则最右边会被挡住
        swiper_upload.update(true);
    }, 0)
    return;
    //以上是示例代码, 以下是以前掌汇的代码
    
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

//相册
function openAlbum(e) {
    vm.previewImgs.push({
        img: '',
        src: 'http://temp.im/'+parseInt(Math.random() * 1000)+'x'+parseInt(Math.random() * 1000),
        status: 'finish',
        percent: '100%'
    });
    
    setTimeout(function() {
        //更新要放最后执行才有效果, 否则最右边会被挡住
        swiper_upload.update(true);
    }, 0)
    return;
    //以上是示例代码, 以下是以前掌汇的代码
    
    var maxAdd = Math.min(vm.maxImgs - vm.previewImgs.length, vm.maxEvery);
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

//上传到服务器
function uploadImgs(imgsArr, pvImgIndex) {
    return;
    //以下是以前掌汇的代码, 还得把封装好的plug-in搬过来
    
    appcan.plugInUploaderMgr.upload({
        serverUrl: serverPath + 'focCommonController.do?focupload&uploadPath=problem',
        filePath: imgsArr,
        quality: 1
    }, function(e) {
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