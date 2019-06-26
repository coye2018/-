/**
 * Created by issuser on 2017/12/21 0021.
 */
(function ($) {
    //自定义状态颜色
    Vue.directive('color', function (el, binding) {
        if (binding.value == 3 || binding.value == 2) {
            el.style.color = '#52A6FF'
        } else if (binding.value == 1 || binding.value == 5 || binding.value == 6||binding.value == 9) {
            el.style.color = '#fe4344'
        } else if (binding.value == 4) {
            // 绿色            
            // el.style.color = '#1dbd87';
            el.style.color = '#fe4344';
        }else if(binding.value == 7 || binding.value == 8){
            el.style.color = '#999';
        }

    });
    var vm = new Vue({
        el: '#Page',
        data: {
            items: {},
            picPath: mainPath,
            criterion: '',//整改标准
            xunChaRole: '',//角色
            none: false,
            nonetwork: false,
            isClick: 0,//0=可以点击提交，1=不可以点击提交。为了不让重复点击提交按钮
            replyLength: '', //回复数量
            status: '',//状态
            btnText: '接收',
            copyUserNames:'',//抄送人名称
            isHideFooter:false
        },
        filters: {
            //过滤后台返回的状态
            showStatus: function (num) {
                var val;
                if(num == '7' || num == '8'){
                    val = '10';
                }else{
                    val = num;
                }
                switch (val) {
                    case '1':
                        return '未接收';
                        break;
                    case '2':
                        return '申诉中';
                        break;
                    case '3':
                        return '整改中';
                        break;
                    case '4':
                        return '待验收';
                        break;
                    case '5':
                        return '接收超时';
                        break;
                    case '6':
                        return '完成超时';
                        break;
                    case '7':
                        return '驳回待接受';
                        break;
                    case '8':
                        return '待审批';
                        break;
                    case '9':
                        return '待反馈';
                        break;
                    case '10':
                        return '已关闭';
                        break;    
                }
            },
            //过滤进展中后台返回的null
            systemName: function (val) {
                if(val == ''){
                    return '管理员'
                }else {
                    return val
                }
            },
            //将后台返回的null转变为空字符串
            dealNull: function (val) {
                if (val == 'null') {
                    return ''
                } else {
                    return val
                }
            }
        },
        methods: {
            //回复
            reply: function (id) {
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
                        path: mainPath + "reformApiController.do?replyReform",
                        data: {
                            "reformId": id,
                            "userId": appcan.locStorage.getVal("userID"),
                            "userName": appcan.locStorage.getVal("userName"),
                            "content": text
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
                            that.replyLength = that.items.replyList.length;
                            layerToast('回复成功', 2);
                        } else {
                            layerToast(e, 2);
                        }
                    })
                }
            },
            //以下两个方法为切换回复与进展
            toggle1: function () {
                this.none = false
            },
            toggle2: function () {
                this.none = true
            },
            //点击打开图片预览
            openPic: function (img, index) {
                var pic = [];
                for (var i = 0; i < img.length; i++) {
                    var obj = img[i];
                    pic.push(mainPath + obj)
                }
                picView(index, pic);
            },
            //整改标准
            openCriterion: function () {
                openWindow('reform-criterion', 'reform-criterion.html')
            },
            //升级处罚单
            goPunishAdd: function () {
                appcan.window.publish('patrol-upPunish', 'upPunish');
            },
            //驳回
            reject: function () {
                var params = {
                    'type': '1',
                    'title': this.items.title,
                    'managerId': this.items.manager,
                    'departId': this.items.departId
                };
                appcan.locStorage.setVal('patrol-rejectParams', params);
                openWindow('reform-reject', 'reform-reject.html')
            },
            //改派
            distribute: function () {
                appcan.locStorage.remove('patrol-chooseDepartName');
                var params = {
                    'type': '2',
                    'title': this.items.title,
                    'managerId': this.items.manager
                };
                appcan.locStorage.setVal('patrol-distributeParams', params);
                appcan.locStorage.setVal('patrol-changDpartName', this.items.departName);
                openWindow('reform-change-distribute', 'reform-change-distribute.html')
            },
            //关闭
            close: function () {
                var params = {
                    'type': '3',
                    'title': this.items.title,
                    'managerId': this.items.manager
                };
                appcan.locStorage.setVal('patrol-closeDetails', params);
                openWindow('reform-close-reject-reason', 'reform-close-reject-reason.html')
            },
            //1、接收 2、待反馈
            accept: function (index) {
                var that = this;
                if (index === 1) {
                    addConfirm({
                        content: '是否接收整改单？',
                        yes: function (i) {
                            layerRemove(i);
                            var json = {
                                path: mainPath + "reformApiController.do?receiveReform",
                                data: {
                                    "userId": appcan.locStorage.getVal("userID"),
                                    "userName": appcan.locStorage.getVal("userName"),
                                    "reformId": appcan.locStorage.getVal('patrol-reformId'),
                                    "budgetTime": '',
                                    "solution": '',
                                    "loginDepartId": appcan.locStorage.getVal('deptId')
                                }
                            };
                            ajaxPOST(json, function (data, e) {
                                if (e === "success") {
                                    that.items.status = '9';
                                    layerToast('接收整改单成功', 2);
                                } else {
                                    layerToast('网络错误，请检查网络环境', 2);
                                }

                            });

                        },
                        no: function (i) {

                        }
                    })

                } else if (index === 2) {
                    openWindow('reform-accept', 'reform-accept.html');
                }
            },
            //申诉
            appeal: function () {
                var params = {
                    'type': '4',
                    'title': this.items.title,
                    'managerId': this.items.manager
                };
                appcan.locStorage.setVal('patrol-appealParams', params);
                openWindow('reform-appeal', 'reform-appeal.html')
            },
            //完成
            complete: function () {
                var params = {
                    'type': '5',
                    'title': this.items.title,
                    'managerId': this.items.manager
                };
                appcan.locStorage.setVal('patrol-finishDetails', params);
                openWindow('reform-finish', 'reform-finish.html')
            },
            //抄送人
            copyUser:function () {
                var that = this;
                var copyUserList = that.items.copyTsUserInfo;
                console.log(copyUserList);
                if(!isDefine(copyUserList)){
                    layerToast("暂无抄送！", 2);
                }else if(copyUserList.length > 0) {
                    appcan.locStorage.setVal('patrol-copydepartlist', JSON.stringify(copyUserList));
                    openWindow("patrol-choose-departlist", "patrol-choose-departlist.html", "");
                }
            },
            confirmBtn: function(){
                appcan.locStorage.setVal('confirm',1)
                openWindow('reform-pass', 'reform-pass.html');
                
            },
           cancelBtn:function(){
               appcan.locStorage.setVal('confirm',0)
               openWindow('reform-pass', 'reform-pass.html');
           }
        },
        beforeMount: function () {
            var that = this;
            //从列表获取角色
            that.xunChaRole = appcan.locStorage.getVal('patrol-role');
            console.log(that.xunChaRole)
            that.status = appcan.locStorage.getVal('patrol-status');
        },
        created: function () {

        },
        mounted: function () {
            var that = this;
            //储存部门为了选择部门
            appcan.locStorage.setVal('patrol-department', that.items.departName);

            var reformId = appcan.locStorage.getVal('patrol-reformId');
            var yydepartId = appcan.locStorage.getVal('deptId'),
                yyroleCode = appcan.locStorage.getVal('patrol-reform-rolecode'),
                yyheaderNav = appcan.locStorage.getVal('patrol-reform-headerNav'),
                yyuserId = appcan.locStorage.getVal('userID');
            var isCopy;
            if (yyheaderNav === '抄送我的') {
                isCopy = 'true'
                that.isHideFooter = false
            } else {
                isCopy = 'false'
                that.isHideFooter = true
            }
            var json = {
                path: mainPath + "reformApiController.do?getReformDetail&&reformId=" + reformId + "&&departId=" + yydepartId + "&&roleCode=" + yyroleCode + "&&isCopy=" + isCopy + "&&userId=" + yyuserId,
                data: {}
            };
            ajaxPOST(json, function (data, e) {
                if (e == "success") {
                    console.log(JSON.stringify(data));
                    that.items = data.data;
                    //抄送人处理
                    if(!isDefine(that.items.copyTsUserInfo)){
                        that.copyUserNames = '暂无'
                    }else {
                        // debugger;
                        var copyUserName =that.items.copyTsUserInfo;
                        // console.log(copyUserName);
                        if(copyUserName.length >1){
                            that.copyUserNames = copyUserName[0].realName + ' 等'+copyUserName.length+'人';
                        }else {
                            that.copyUserNames = copyUserName[0].realName
                        }
                    }
                    //展示整改标准第一条数据
                    if (data.data.standardList != null) {
                        //that.criterion = data.data.standardList[0].list[0].code;
                        that.criterion = '整改项详情';
                    }
                    //展示回复数量
                    if (data.data.replyList == null) {
                        that.items.replyList = [];
                    }
                    that.replyLength = that.items.replyList.length;
                    //改变进展中间的图标
                    if (data.data.progressList != null) {
                        for (var i = 0; i < data.data.progressList.length; i++) {
                            var obj = data.data.progressList[i];
                            if (obj.flag == 0) {
                                obj.flag = 0
                            } else {
                                if (data.data.status == 4) {
                                    if (i == 0) {
                                        obj.flag = 2
                                    } else {
                                        obj.flag = 1
                                    }
                                } else {
                                    obj.flag = 1
                                }
                            }
                        }
                    }

                } else {
                    that.nonetwork = true;
                }
            })
        },
    });
    appcan.ready(function () {

        //升级处罚单通道
        appcan.window.subscribe('patrol-upPunish', function (msg) {
            if (msg = 'upPunish') {
                var params = {
                    title: vm.items.title,
                    described: vm.items.described,
                    reformId: appcan.locStorage.getVal('patrol-reformId'),
                    departName: vm.items.departName,
                    departId: vm.items.departId
                };
                appcan.locStorage.setVal('patrol-upPunish', params);
                appcan.locStorage.remove('patrol-chooseDepartName');
                openWindow('punish-add', 'punish-add.html')
            }
        });
        //新增整改单成功和升级处罚单成功提示
        // appcan.window.subscribe('patrol-alertSuccess', function (msg) {
            // if (msg == '0') {
                // layerToast('降级处罚单成功。', 2);
            // }
        // });
        var prompTitle = appcan.locStorage.getVal('patrol-alertSuccess');
        if (prompTitle == '111') {
            layerToast('新增整改单成功。', 2);
            appcan.locStorage.remove('patrol-alertSuccess');
        }else if(prompTitle == '222'){
             layerToast('降级处罚单成功。', 2);
              appcan.locStorage.remove('patrol-alertSuccess');
        }

        //当网络连接失败隐藏底部按钮
        if (vm.nonetwork == true) {
            appcan.window.evaluateScript({
                name: 'reform-rectification-details',
                scriptContent: 'hideFooter()'
            });
        }
        //键盘弹出收起
        uexInputTextFieldView.onKeyBoardShow = onKeyBoardShow;

        //处理IOS向右滑动关闭
        var platForm = appcan.locStorage.getVal("platForm"); //是安卓还是IOS
        var isSupport = true;
        if (platForm == '1') {
            isSupport = false
        }
        var param = {
            isSupport: isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(param));
        //向右滑动的监听方法
        uexWindow.onSwipeRight = function () {
            appcan.window.evaluateScript({
                name: 'reform',
                scriptContent: 'vm.ResetUpScroll()'
            });
            closeMultiPages([
                'reform-temporary',
                'punish-detail',
                'reform-rectification-details'
            ]);
            appcan.window.evaluateScript({
                    name: 'punish',
                    scriptContent: 'vm.ResetUpScroll()'
                });
            //清除详情页缓存字段
            var reformArr = ['patrol-status', 'patrol-reformId', 'patrol-role', 'patrol-reform-headerNav'];
            reformArr.forEach(function (name) {
                appcan.locStorage.remove(name);
            });
        };

    });

})($);

//监听键盘收起弹出
function onKeyBoardShow(json) {
    var keyBoardToggleData = JSON.parse(json);
    if (keyBoardToggleData.status == 0) {
        uexInputTextFieldView.close();
    }
}


