/**
 * Created by KC on 2017/12/25.
 */

(function ($) {
    var vm = new Vue({
        el: '#app',
        data: {
            title: '',
            def: '请选择责任部门',
            location: '',
            detail: '',
            department: '请选择部门',//部门
            departId: '',//部门ID
            items: {},
            isAppoint:true,
            time:getNowFormatDate(),
            copyUserNames:'',
            peoplepick:[]
        },
        methods: {
            isChoose: function (index) {
                this.items[index].choose = !this.items[index].choose;
            },
            appointed: function () {
                //派发整改单
                var params = {
                    departId: vm.departId,
                    userId: localStorage.getItem('userID'),
                    userName: localStorage.getItem('userName'),
                    executorId: localStorage.getItem('userID'),
                    reformTitle: vm.title,
                    type: '1',
                    area: vm.location,
                    picturePath: '',
                    standardList: new Array(),
                    remark: vm.detail,
                    inspectId:localStorage.getItem('patrol-inspectId'),
                    loginDepartId:localStorage.getItem('deptId')
                    // copyUserIds:''
                };
                for (var i = 0; i < vm.items.standardList.length; i++) {
                    var obj = vm.items.standardList[i].list;
                    for (var j = 0; j < obj.length; j++) {
                        var obj1 = obj[j];
                        var list = {};
                        list.criterionId = obj1.standardId;
                        list.filePath = obj1.pictureList.join(',');
                        list.description = obj1.described;
                        list.suitableFlag = obj1.isSuitable;
                        list.content = obj1.standardDetail;
                        params.standardList.push(list)
                    }
                };
                var peopleCopyArr = [];
                var pcJson = vm.peoplepick;
                for (var i = 0; i < pcJson.length; i++) {
                    peopleCopyArr.push(pcJson[i].id);
                }
                params.copyUserIds = peopleCopyArr.join(',');
                if(!isDefine(params.reformTitle)){
                    layerToast('请输入标题。');
                    return
                }
                if(!isDefine(params.area)){
                    layerToast('请输入详细位置。');
                    return
                }
                if(!isDefine(params.remark)){
                    layerToast('请输入事件描述。');
                    return
                }
                if (params.departId == '') {
                    layerToast('请选择部门。');
                    //alert('请选择责任部门');
                    return
                }
                // console.log(JSON.stringify(params));
                var index = layerLoading();
                vm.isAppoint = false;
                appcan.ajax({
                    url: mainPath + 'reformApiController.do?createReform',
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
                                name:'inspect-appoint',
                                scriptContent:'back()'
                            });

                        }
                    },
                    error: function (e) {
                        layerRemove(index);
                    }
                });
            },
            //选择派发部门
            chooseDep: function () {
                openWindow('patrol-choose-departname', 'patrol-choose-departname.html');
            },
            chooseUser: function () {
                appcan.locStorage.setVal('address-pick-from', 'patrol-copy');
                appcan.locStorage.setVal('peoplepick_3', vm.peoplepick);
                openWindow('address-pick','../address/address-pick.html')
            },
            //点击图片全屏浏览
            openPic: function (index, i) {
                var that = this;
                picView(i, that.items[index].filePath)
            },
            //点击打开整改项界面
            toReform: function () {
                openWindow("inspect-reformlist", "inspect-reformlist.html", "");
            }
        },
        created: function () {
            var reformObj = JSON.parse(localStorage.getItem('patrol-creatReform'));
            //console.log(localStorage.getItem('patrol-creatReform'));
            for (var i = 0; i < reformObj.standardList.length; i++) {
                var obj = reformObj.standardList[i].list;
                for (var j = 0; j < obj.length; j++) {
                    var obj1 = obj[j];
                    //obj1.criterionId = obj1.standardId;
                    if (obj1.choose == false) {
                        obj.splice(j--, 1)
                    }
                }
                if (obj.length == 0) {
                    reformObj.standardList.splice(i--, 1)
                }
            }
            this.items = reformObj
        }
    });
    appcan.ready(function () {
        //接收改变部门发来的通道
        appcan.window.subscribe('patrol-chooseVal', function (msg) {
            var obj = JSON.parse(msg);
            vm.department = obj.departName;
            vm.departId = obj.departId;
        });
        //返回
        appcan.button("#nav-left", "btn-act", function () {
            appcan.window.close(1);
        });
        //接收改变抄送人发来的通道
        appcan.window.subscribe('patrol-copy-from-address-pick', function(msg){
            vm.peoplepick = JSON.parse(msg);
            var pcJson = JSON.parse(msg);
            if(pcJson.length>1){
                vm.copyUserNames = pcJson[0].name + ' 等'+pcJson.length+'人';
            }else{
                vm.copyUserNames = pcJson[0].name;
            }
        });
    });


})($);