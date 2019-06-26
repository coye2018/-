/**
 * Created by KC on 2017/12/25.
 */
var vm = new Vue({
    el: '#app',
    data: {
        items: {},
        path: mainPath,
        hasPic: false,
        stateDetailShow: true,
        title: localStorage.getItem('patrol-title')
    },
    methods: {
        //开整改单
        write: function () {
            var flag = this.items.standardList.some(function (ele) {
                return ele.list.some(function (i) {
                    return i.isSuitable =='不符合'?true:false
                })
            });
            if (!flag) {
                layerToast('没有不符合的项!');
                return
            }
            openWindow("inspect-create", "inspect-create.html", "");
            localStorage.setItem('patrol-inspectToReform', JSON.stringify(this.items));
        },
        isChoose: function (index) {
            this.items[index].choose = !this.items[index].choose;
        },
        //显示动态
        toggle1: function () {
            this.stateDetailShow = true;
        },
        //显示回复
        toggle2: function () {
            this.stateDetailShow = false;
        },
        //添加回复
        addComments: function (id) {
            var that = this;
            var data = {
                emojicons: "res://emojicons/emojicons.xml",
                placeHold: "请输入内容"
            };
            uexInputTextFieldView.open(data);
            uexInputTextFieldView.setInputFocused();
            //键盘输入点击发送的时候的监听函数
            uexInputTextFieldView.onCommitJson = onCommitJson;

            //回复发送插件按钮回调事件
            function onCommitJson(data) {
                var text = data.emojiconsText;
                if (!isDefine(text)) {
                    uexInputTextFieldView.close();
                    layerToast('回复内容不能为空');
                    return false;
                }
                var json = {
                    path: mainPath + "inspectApiController.do?replyInspect",
                    data: {
                        "inspectId": id,
                        "userId": localStorage.getItem('userID'),
                        "userName": localStorage.getItem('userName'),
                        "content": text,
                        "loginDepartId":localStorage.getItem('deptId')
                    },
                    layer: false
                };
                var reply = {
                    createName: localStorage.getItem('userName'),
                    content: text,
                    createDate: getNowFormatDate()
                };
                ajaxPOST(json, function (data, e) {
                    if (e == "success") {
                        uexInputTextFieldView.close();
                        that.items.replyList.unshift(reply);
                        layerToast('回复成功!');
                    } else {
                        alert(e)
                    }
                })
            }
        },
        //返回上个界面
        back: function () {
            appcan.window.close(1);
        },
        //点击查看大图
        openPic: function (index, i, k) {
            var that = this;
            var picArr = [];
            picArr = that.items.standardList[index].list[i].pictureList.map(function (val) {
                return mainPath + val
            });
            picView(k, picArr)
        },
        //获取数据
        getData: function () {
            var index = layerLoading();
            var id = localStorage.getItem('patrol-inspectId');
            var params = {
                inspectId: id,
                departId:localStorage.getItem('deptId'),
                roleCode:localStorage.getItem('inspect-role')
            };
            // console.log(JSON.stringify(params));
            appcan.ajax({
                url: mainPath + 'inspectApiController.do?getInspectDetail',
                type: 'GET',
                data: params,
                offline: false,
                success: function (res) {
                    layerRemove(index);
                    var obj = JSON.parse(res);
                    if (obj.success) {
                        if (obj.data.standardList == null) obj.data.standardList = [];
                        for (var i = 0; i < obj.data.standardList.length; i++) {
                            var obj1 = obj.data.standardList[i].list;
                            for (var j = 0; j < obj1.length; j++) {
                                var obj2 = obj1[j];
                                if (obj2.pictureList == null) {
                                    vm.hasPic = true;
                                    obj2.pictureList = []
                                }
                            }
                        }
                        if (obj.data.replyList == null) {
                            obj.data.replyList = []
                        }
                        for (var k = 0; k < obj.data.progressList.length; k++) {
                            var obj3 = obj.data.progressList[k];
                            obj3.iconStatus = 2
                        }
                        obj.data.progressList[obj.data.progressList.length - 1].iconStatus = 1;
                        obj.data.progressList[0].iconStatus = 3;
                        vm.items = obj.data
                    }
                },
                error: function (e) {
                    layerRemove(index);
                }
            })
        }
    },
    computed: {
        line: function () {
            return this.progress.length - 1
        }
    },
    mounted: function () {
        this.getData()
    }
});
(function ($) {
    appcan.ready(function () {
        //返回
        appcan.button("#nav-left", "btn-act", function () {
            appcan.window.close(1);
        });
    })
})($);