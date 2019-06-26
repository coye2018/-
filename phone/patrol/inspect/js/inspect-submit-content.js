/**
 * Created by KC on 2017/12/20.
 */
/*appcan.switchBtn('.switch', function (obj, value) {
 //alert('111111')
 })*/
//(function ($) {
var vm = new Vue({
    el: '#Page',
    data: {
        items: {},
        sum: null,
        path: mainPath,
        save: localStorage.getItem('patrol-save'),
        patroTime: new Date().getDate(),
        params: {
            userId: localStorage.getItem('userID'),
            userName: localStorage.getItem('userName'),
            inspectId: localStorage.getItem('patrol-inspectId'),
            standardList: [
                {
                    criterionId: null,
                    filePath: null,
                    description: null,
                    suitableFlag: null
                }
            ]
        },
        depId:localStorage.getItem('deptId')
    },
    filters: {
        change: function (val) {
            if (!val) {
                return []
            }
            return val
        }
    },
    methods: {
        receive: function () {
            var params = {
                userId: localStorage.getItem('userID'),
                userName: localStorage.getItem('userName'),
                inspectId: vm.items.id,
                status: '3',
                loginDepartId:vm.depId
            };
            appcan.ajax({
                url: mainPath + 'inspectApiController.do?modifyInspectStatus',
                data: JSON.stringify(params),
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                offline: false,
                success: function (res) {
                    if (res.success) {
                        layerToast('接收成功!');
                        vm.items.status='3'
                    }
                },
                error: function (e) {

                }
            })
        },
        //符合与不符合的切换功能
        toggle: function (index, i) {
            if(vm.items.status=='2'||vm.items.standardList[index].list[i].exit) {
                return;
            }
            if (this.items.standardList[index].list[i].isSuitable == '符合') {
                this.items.standardList[index].list[i].isSuitable = '不符合';
                this.items.standardList[index].list[i].described = '';
                this.items.standardList[index].list[i].pictureList = []
            } else {
                this.items.standardList[index].list[i].isSuitable = '符合';
            }
        },
        //提交巡查单
        submit: function () {
            if(vm.items.status=='2'){
                layerToast('请先接收此单!');
                return
            }
            /*if (vm.save == 'false') {
                layerToast('该单还未生效!');
                return
            }*/
            addConfirm({
                content:'您确定要提交此单吗？',
                yes: function () {
                    var params = {
                        userId: localStorage.getItem('userID'),
                        userName: localStorage.getItem('userName'),
                        inspectId: localStorage.getItem('patrol-inspectId'),
                        standardList: new Array(),
                        type: '1',
                        loginDepartId:vm.depId
                    };
                    for (var i = 0; i < vm.items.standardList.length; i++) {
                        var obj = vm.items.standardList[i].list;
                        for (var j = 0; j < obj.length; j++) {
                            var obj1 = obj[j];
                            //console.log(obj1.isSuitable);
                            var item = {};
                            item.criterionId = obj1.standardId;
                            item.filePath = obj1.pictureList.join(',');
                            item.description = obj1.described;
                            item.suitableFlag = obj1.isSuitable;
                            params.standardList.push(item)
                        }
                    }
                    var index = layerLoading();
                    appcan.ajax({
                        url: mainPath + 'inspectApiController.do?saveInspectDetail',
                        type: 'POST',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(params),
                        offline: false,
                        success: function (res) {
                            layerRemove(index);
                            //var obj = JSON.parse(res);
                            if (res.success) {
                                appcan.window.evaluateScript({
                                    name: 'inspect-submit',
                                    scriptContent: 'appcan.window.close(1)'
                                });
                                appcan.window.evaluateScript({
                                    name: 'inspect',
                                    scriptContent: 'vm.ResetUpScroll()'//返回主页进行刷新数据
                                });
                                appcan.window.evaluateScript({
                                    name: 'inspect',
                                    scriptContent: 'layerToast("提交巡查单成功！", 2);'//返回主页进行刷新数据
                                });
                            }
                        },
                        error: function (e) {
                            layerRemove(index);
                        }
                    })
                },
                no: function () {

                }
            });
        },
        //由巡查单开整改单
        write: function () {
            if(vm.items.status=='2'){
                layerToast('请先接收此单!');
                return
            }
            var flag = this.items.standardList.some(function (ele) {
                return ele.list.some(function (i) {
                    return i.isSuitable=='不符合'?true:false
                })
            });
            if (!flag) {
                layerToast('没有不符合的项!');
                return
            }
            //保存
            var params = {
                userId: localStorage.getItem('userID'),
                userName: localStorage.getItem('userName'),
                inspectId: localStorage.getItem('patrol-inspectId'),
                standardList: new Array(),
                type: '0',
                loginDepartId:this.depId
            };
            for (var i = 0; i < vm.items.standardList.length; i++) {
                var obj = vm.items.standardList[i].list;
                for (var j = 0; j < obj.length; j++) {
                    var obj1 = obj[j];
                    //console.log(obj1.isSuitable);
                    var item = {};
                    item.criterionId = obj1.standardId;
                    item.filePath = obj1.pictureList.join(',');
                    item.description = obj1.described;
                    item.suitableFlag = obj1.isSuitable;
                    params.standardList.push(item)
                }
            }
            appcan.ajax({
                url: mainPath + 'inspectApiController.do?saveInspectDetail',
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(params),
                offline: false,
                success: function (res) {
                    //var obj = JSON.parse(res);
                    if (res.success) {

                    }
                },
                error: function (e) {

                }
            });
            openWindow("inspect-create", "inspect-create.html", "");
            localStorage.setItem('patrol-inspectToReform', JSON.stringify(this.items));
        },
        //删除上传的图片
        delPic: function (index, i, k) {
            //this.items[index].picArr.splice(i, 1)

            this.items.standardList[index].list[i].pictureList.splice(k, 1)
        },
        //弹出底部对话框
        uploadPic: function(index1, i) {
            if(vm.items.standardList[index1].list[i].exit) {
                return;
            }
            var that = this;
            layer.open({
                content: '选择图片上传方式',
                btn: ['拍照', '从相册选择'],
                skin: 'footer',
                yes: function(index) {
                    layerRemove(index);
                    that.addCameraPic(index1,i);
                },
                no: function(index) {
                    that.addPic(index1, i);
                }
            });
        },
        //上传图片
        addPic: function (index, i) {

            //alert(index)
            //显示加载效果
            var index1 = layerLoading();
            var that = this;
            var json = {
                min: 1,
                max: 3,//最大上传图片
                quality: 1,
                detailedInfo: true
            };
            var picNum = that.items.standardList[index].list[i].pictureList.length;
            json.max = 3 - picNum;//减去已经上传图片的数量
            uexImage.openPicker(json, function (error, data) {
                if (error == 0) {
                    var arr = data.data;
                    var json1 = {
                        serverUrl: mainPath + 'uploadFileApi.do?uploadFile',
                        filePath: arr,
                        quality: 3
                    };
                    appcan.plugInUploaderMgr.upload(json1, function (e) {
                        if (e.status == 1) {
                            //移除加载
                            layerRemove(index1);
                            layerToast("图片上传成功", 2);
                            that.items.standardList[index].list[i].pictureList = that.items.standardList[index].list[i].pictureList.concat(e.picArray)
                        } else if (e.status == 3) {
                            //上传中
                        } else {//上传失败
                            layerRemove(index1);
                            layerToast("图片上传失败", 2);
                        }
                    });
                }else if(error == -1) { //点击取消而关闭
                    //移除加载
                    layerRemove(index1);
                } else {
                    //移除加载
                    layerRemove(index1);
                }
            });
        },
        //拍照上传
        addCameraPic: function(index,i) {
            //alert(index)
            var that = this;
            uexCamera.open(0, 50, function(filePath) {
                var arr = [filePath];
                var uploadParam = {
                    serverUrl: mainPath + "uploadFileApi.do?uploadFile",
                    filePath: arr,
                    quality: 3
                };
                var index1 = layerLoading();
                appcan.plugInUploaderMgr.upload(uploadParam, function(e) {

                    if(e.status == 1) { //上传成功
                        //移除加载
                        layerRemove(index1);
                        layerToast("图片上传成功", 2);
                        that.items.standardList[index].list[i].pictureList = that.items.standardList[index].list[i].pictureList.concat(e.picArray);

                    } else if(e.status == 3) { //上传中

                    } else { //上传失败
                        //移除加载
                        layerRemove(index1);
                        layerToast("图片上传失败", 2);
                    }
                })
            });
        },
        //打开图片全屏浏览
        openPic: function (index, i, k) {
            var that = this;
            var picArr = [];
            picArr = that.items.standardList[index].list[i].pictureList.map(function (val) {
                return mainPath + val
            });
            // console.log(picArr);
            picView(k, picArr)
        },
        //返回上一个界面
        back: function () {
            var that = this
            if (this.save == 'true'&&this.items.status=='3') {
                appcan.window.confirm({
                    title: '提示',
                    content: '是否保存已修改的内容?',
                    buttons: ['保存', '取消', '舍弃'],
                    callback: function (err, data, dataType, optId) {
                        if (err) {
                            //如果出错了
                            return;
                        }
                        //data 按照按钮的索引返回值
                        //alert(typeof (data))
                        if (data == '0') {
                            //保存
                            var params = {
                                userId: localStorage.getItem('userID'),
                                userName: localStorage.getItem('userName'),
                                inspectId: localStorage.getItem('patrol-inspectId'),
                                standardList: new Array(),
                                type: '0',
                                loginDepartId:that.depId
                            };
                            for (var i = 0; i < vm.items.standardList.length; i++) {
                                var obj = vm.items.standardList[i].list;
                                for (var j = 0; j < obj.length; j++) {
                                    var obj1 = obj[j];
                                    //console.log(obj1.isSuitable);
                                    var item = {};
                                    item.criterionId = obj1.standardId;
                                    item.filePath = obj1.pictureList.join(',');
                                    item.description = obj1.described;
                                    item.suitableFlag = obj1.isSuitable;
                                    params.standardList.push(item)
                                }
                            }
                            appcan.ajax({
                                url: mainPath + 'inspectApiController.do?saveInspectDetail',
                                type: 'POST',
                                dataType: 'json',
                                contentType: 'application/json',
                                data: JSON.stringify(params),
                                offline: false,
                                success: function (res) {
                                    //var obj = JSON.parse(res);
                                    if (res.success) {
                                        //appcan.window.close(1);
                                        appcan.window.evaluateScript({
                                            name: 'inspect-submit',
                                            scriptContent: 'appcan.window.close(1)'
                                        });
                                        appcan.window.evaluateScript({
                                            name: 'inspect',
                                            scriptContent: 'vm.ResetUpScroll()'//返回主页进行刷新数据
                                        });
                                    }
                                },
                                error: function (e) {

                                }
                            })
                        } else if (data == '1') {
                            //取消

                        } else {
                            //舍弃
                            appcan.window.evaluateScript({
                                name: 'inspect-submit',
                                scriptContent: 'appcan.window.close(1)'
                            });
                            appcan.window.evaluateScript({
                                name: 'inspect',
                                scriptContent: 'vm.ResetUpScroll()'//返回主页进行刷新数据
                            });
                        }
                    }
                });
            } else {
                appcan.window.evaluateScript({
                    name: 'inspect-submit',
                    scriptContent: 'appcan.window.close(1)'
                });
            }
        },
        //获取数据
        getData: function () {
            var index = layerLoading();
            var id = localStorage.getItem('patrol-inspectId');
            var params = {
                inspectId: id,
                departId:this.depId,
                roleCode:localStorage.getItem('inspect-role')
            };
            appcan.ajax({
                url: mainPath + 'inspectApiController.do?getInspectDetail',
                type: 'GET',
                data: params,
                offline: false,
                success: function (res) {
                    // console.log(res);
                    layerRemove(index);
                    var obj = JSON.parse(res);
                    if (!obj.data.standardList) {
                        obj.data.standardList = []
                    }
                    if (obj.success) {
                        for (var i = 0; i < obj.data.standardList.length; i++) {
                            var obj1 = obj.data.standardList[i].list;
                            for (var j = 0; j < obj1.length; j++) {
                                var obj2 = obj1[j];
                                if (!obj2.pictureList) {
                                    obj2.pictureList = []
                                }
                            }
                        }
                        // console.log(obj.data);
                        vm.items = obj.data;
                        //appcan.window.publish('patrol-title',obj.data.title)
                    }
                },
                error: function (e) {
                    layerRemove(index);
                }
            })
        }
    },
    created: function () {
        this.getData()
    },
    mounted: function () {
        localStorage.removeItem('patrol-title')
    }
});
appcan.ready(function () {
    //处理IOS向右滑动关闭
    var myPlatForm = localStorage.getItem('platForm');
    var isSupport = true;
    if (myPlatForm == '1') {
        isSupport = false
    }
    var param = {
        isSupport: isSupport
    };

    uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
    //向右滑动的监听方法
    uexWindow.onSwipeRight = function () {
        vm.back()
    };
});
//弹出的提示
function loading() {
    vm.getData();
    layerToast('派发成功!',5)
}
//})($);
