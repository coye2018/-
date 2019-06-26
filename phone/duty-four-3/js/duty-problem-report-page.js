var dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
var now = new Date(),
    nowYear = now.getFullYear(),
    nowMonth = now.getMonth(),
    nowDay = now.getDate(),
    nowHour = now.getHours(),
    nowMinute = now.getMinutes(),
    nowSecond = now.getMinutes();
var min = new Date(nowYear-1, nowMonth, nowDay, nowHour, nowMinute),
    max = new Date(nowYear, nowMonth, nowDay, nowHour, nowMinute);
    
var platForm = appcan.locStorage.getVal('platForm'); //安卓为1 iOS为0
var editData = appcan.locStorage.getVal('problemEditData');

var vm = new Vue({
    el: '#duty-problem-report-page',
    data: {
        text: '',
        textMax: 1000,
        textOver: false,
        findtime: {
            time: '',
            timestamp: ''
        },
        dept: [],
        isDeptGet: true,
        department: {
            text: '',
            id: ''
        },
        isUploadShow: true,
        note: '',
        noteMax: 1000,
        isPreview: false,
        previewImgs: [],
        realSrcs: [],
        realImgs: [],
        maxImgs: 10,
        isEdit: false,
        isSubmitting: false,
        dataId: '',
        previewText: '',
        previewNote: '',
    },
    created: function() {
        //被退回问题详情-重新编辑, isEdit用来判断是否重新编辑
        if (isDefine(editData)) {
            var editJson = JSON.parse(editData);
            
            this.isEdit = true;
            this.findtime.timestamp = editJson.findtime/1000;
            this.findtime.time = timeStemp(editJson.findtime, 'yyyy/MM/dd').date;
            this.text = restoreEnter(unescape(editJson.text));
            this.dataId = editJson.id;
            this.note = restoreEnter(unescape(editJson.note));
            
            var this_pic = editJson.pic;
            for (var k = 0; k < this_pic.length; k++) {
                this.previewImgs.push({
                    img: this_pic[k].url,
                    src: serverPath + this_pic[k].url,
                    status: 'finish',
                    percent: '100%'
                });
            }
            appcan.locStorage.remove('problemEditData');
        }
    },
    mounted: function() {
        //窗口加载完毕, 初始化默认事件数据
        getDeptData();
        
        if (!isDefine(editData)) {
            var times = nowYear + '/' + (nowMonth + 1) + '/'+nowDay;
            this.findtime = {
                time: times,
                timestamp: timeStemp(times).dateTimeSecond
            };
        }
    },
    computed: {
        textOverClass: function() {
            //问题内容超出字数限制则提示字样变红
            if (this.text) {
                //this.text = this.text.trim();
                return (this.text.length > this.textMax ? 'fc-warn-red' : '');
            } else {
                return ''
            }
        },
        noteOverClass: function() {
            //备注超出字数限制则提示字样变红
            if (this.note) {
                //this.note = this.note.trim();
                return (this.note.length > this.noteMax ? 'fc-warn-red' : '');
            } else {
                return ''
            }
        },
        editClass: function() {
            //如果是再次编辑, 归属区域变红提醒
            return this.isEdit ? 'fc-warn-red' : '';
        },
        isUploadShow: function() {
            //超出上传图片数量限制时, 打开相机、相册的按钮隐藏
            return (this.maxImgs - this.previewImgs.length > 0);
        }
    },
    methods: {
        delet: function (arr, index) {
            arr.splice(index, 1);
        },
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
        imgError: function(i) {
            //图片上传失败
            Vue.set(this.previewImgs[i], 'status', 'fail');
        },
        previewIn: function() {
            //填了数据, 打开预览层
            this.isPreview = arrangeData();
            
            this.previewText = this.text.replace(/\n/g, '<BR>');
            this.previewNote = this.note.replace(/\n/g, '<BR>');
            
            if (this.isPreview) {
                layerToast('请确认您填报的信息', 3);
            }
        },
        previewOut: function() {
            //退出预览层
            this.isPreview = false;
        },
        clickDept: function() {
            appcan.locStorage.setVal('duty-problem-dept', JSON.stringify(vm.dept));
            appcan.locStorage.setVal('duty-problem-dept-this', vm.department.id);
            
            if (platForm == '1') {
                appcan.window.open('duty-problem-picker', 'duty-problem-picker.html', 2);
            } else {
                appcan.window.open({
                    name: 'duty-problem-picker',
                    dataType: 0,
                    data: 'duty-problem-picker.html',
                    aniId: 0,
                    type: 1024
                });
            }
        }
    }
});

(function($) {
    appcan.ready(function() {
        // initMobiscroll();
        
        $(document).on('click', '#department', function() {
        }).on('click', '#handin', function() {
            handinReportData();
        })
        
        appcan.window.subscribe('duty-problem-picker-result', function(e) {
            var results = JSON.parse(e);
            vm.department.text = results.departname;
            vm.department.id = results.id;
        });
        
    });
})($);

//上传报送问题的数据
function handinReportData() {
    //防止多次点击提交重复数据
    if (vm.isSubmitting) {
        return false;
    } else {
        vm.isSubmitting = true;
    }
    
    var dataObj = {
        findTime: vm.findtime.timestamp,
        problemContent: escape(vm.text),
        toDepartId: vm.department.id,
        remark: escape(vm.note),
        pictures: vm.realImgs
    };
    
    //如果是再次编辑, 要传问题id
    if (vm.isEdit) {
        dataObj.problemId = vm.dataId;
    }
    
    var jsonHandin = {
        path: serverPath + 'focDutyProblemController.do?focSaveOrUpdateDutyProblemInfo',
        data: dataObj,
        layer: true
    };
    ajaxRequest(jsonHandin, function(data, e) {
        if (e == 'success') {
            openDutyProblemSubmit();
        } else {
            layerToast('网络错误，请稍后重试。');
            vm.isSubmitting = false;
        }
    });
}

//获取部门列表
function getDeptData() {
    var jsonDept = {
        path: serverPath + 'focDutyProblemController.do?focGetAreaDepartsList',
        data: {},
        layer: true
    };
    ajaxRequest(jsonDept, function(data, e) {
        if (e == 'success') {
            var dobj = data.obj;
            
            vm.dept = [].concat(dobj);
            if (dobj.length > 0) {
                //vm.department.text = dobj[0].departname;
                //vm.department.id = dobj[0].id;
                vm.department.text = '请选择';
                vm.department.id = '';
                vm.isDeptGet = true;
            } else {
                layerToast('无归属区域列表数据。');
                vm.isDeptGet = false;
            }
        } else {
            layerToast('获取部门列表错误，请稍后重试。');
            vm.isDeptGet = false;
        }
    });
}

function openDutyProblemSubmit() {
    //重新加载首页数据
    appcan.window.publish('duty-problem-reload', '1');
    
    if (vm.isEdit) {
        //如果是重新编辑, 则关闭当前页、详情页, 重新加载列表页数据;
        var closeArr = ['duty-problem-detail', 'duty-problem-report'];
        closeArr.forEach(function(name) {
            appcan.window.evaluateScript({
                name: name,
                scriptContent: 'appcan.window.close(1);'
            });
        });
        appcan.window.publish('duty-problem-submit-reload', '0');
    } else {
        //否则打开已报送列表页
        if (platForm == '1') {
            appcan.window.open('duty-problem-submit', 'duty-problem-submit.html', 2);
        } else {
            appcan.window.open({
                name: 'duty-problem-submit',
                dataType: 0,
                data: 'duty-problem-submit.html',
                aniId: 0,
                type: 1024
            });
        }
    }
}

function initMobiscroll() {
    var instance = mobiscroll.date('#picktime', {
        lang: 'zh',
        theme: 'ios',
        display: 'bottom',
        headerText: '日期选择',
        min: min,
        max: max,
        minWidth: 130,
        dateFormat: 'yy/mm/dd',
        // dateWheels: 'yy m dd DD',
        showLabel: true,
        onInit: function (evtObj, obj) {
        },
        onBeforeShow: function (evtObj, obj) {
        },
        onSet: function (evtObj, obj) {
            vm.findtime = {
                time: evtObj.valueText,
                timestamp: timeStemp(evtObj.valueText).dateTimeSecond
            };
        }
    });
}

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
        serverUrl: serverPath + 'focCommonController.do?focupload&uploadPath=problem',
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

//数据校验
function arrangeData() {
    var texts = vm.text.trim();
    var notes = vm.note.trim();
    
    if (texts == '') {
        layerToast('请填写问题内容。');
        return false;
    } else if (texts.length > vm.textMax) {
        layerToast('问题内容字数超出限制，请重新编辑。');
        return false;
    }
    
    if (vm.department.id == '') {
        layerToast('请选择一个归属区域。');
        return false;
    }
    
    if (notes.length > vm.noteMax) {
        layerToast('备注字数超出限制，请重新编辑。');
        return false;
    }
    
    vm.realImgs.splice(0, vm.realImgs.length);
    vm.realSrcs.splice(0, vm.realSrcs.length);
    //realSrcs存放完整的图片地址, realImgs存放相对路径(去掉了前面的服务器地址)
    for (var j = 0 ; j < vm.previewImgs.length; j++) {
        var img_this = vm.previewImgs[j];
        if (img_this.status == 'pending') {
            layerToast('请等待图片上传完成。');
            return false;
        } else if (img_this.status == 'finish') {
            vm.realImgs.push(img_this.img);
            vm.realSrcs.push(img_this.src);
        }
    }
    
    return true;
}

//把br换行符还原
function restoreEnter(str) {
    return str.replace(/<br\/>/g, '\n').replace(/<\/br>/g, '\n').replace(/<br>/g, '\n');
}
