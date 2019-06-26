/**
 * Created by issuser on 2017/12/21 0021.
 */

(function ($) {
    var vm = new Vue({
        el:'#content',
        data:{
            picPath:mainPath,
            title:'',//标题
            location:'',//详细位置
            detail:'',//事件描述
            manager:'',//巡查经理
            department:'请选择部门',//部门
            departId:'',//部门ID
            createTime:getNowFormatDate() ,
            pic:[],//图片
            punishId:'',
            isClick: 0, //0=可以点击提交，1=不可以点击提交。为了不让重复点击提交按钮
            peoplepick:"",//选择抄送人的数据
            copyUserIds:"",//抄送人
            copyUserNames:"",//抄送人名称
            isPunishDetail:"111",//判断是否处罚单降级
            showDepartment:false,//显示责任部门
        },
        methods:{
            chooseDepCopy: function (index) {
                if(index === 0){
                    openWindow('patrol-choose-departname', 'patrol-choose-departname.html')
                }else if(index === 1){
                    appcan.locStorage.setVal('address-pick-from', 'patrol-copy');
                    appcan.locStorage.setVal('peoplepick_3', this.peoplepick);
                    openWindow('address-pick','../address/address-pick.html')
                }
            },
            //弹出底部上传图片对话框
            uploadPic: function () {
                var that = this;
                layer.open({
                    content: '选择图片上传方式',
                    btn: ['拍照', '从相册选择'],
                    skin: 'footer',
                    yes: function(index) {
                        layerRemove(index);
                        that.addCameraPic();
                    },
                    no: function(index) {
                        that.addPic();
                    }
                });
            },
            //上传图片
            addPic: function () {
                var that = this;
                //显示加载效果
                var index = layerLoading();

                var json = {
                    min:1,
                    max:3,//最大上传图片
                    quality:0.5,
                    detailedInfo:true
                };
                var picNum = that.pic.length;
                json.max = 3 - picNum;//减去已经上传图片的数量
                uexImage.openPicker(json,function(error,data){
                    if (error==0){
                        var arr = data.data;
                        var json1={
                            serverUrl:mainPath+'uploadFileApi.do?uploadFile',
                            filePath:arr,
                            quality:3
                        };
                        appcan.plugInUploaderMgr.upload(json1,function(e){
                            if(e.status==1){ //上传成功
                                that.pic = that.pic.concat(e.picArray);
                                //移除加载
                                layerRemove(index);
                                layerToast("图片上传成功", 2);
                                that.isClick = 0;
                            }else if(e.status==3){ //上传中
                                that.isClick = 1;
                            }else{ //上传失败
                                //移除加载
                                layerRemove(index);
                                layerToast("图片上传失败", 2);
                                that.isClick = 0;
                            }
                        });
                    }else if(error == -1) { //点击取消而关闭
                        //移除加载
                        layerRemove(index);
                    } else {
                        //移除加载
                        layerRemove(index);
                    }
                });
            },
            //删除图片
            delPic: function (index) {
                vm.pic.splice(index,1)
            },
            //打开图片全屏浏览
            openPic: function (index) {
                var that = this;
                var picList = [];
                for (var i = 0; i < that.pic.length; i++) {
                    var obj = that.pic[i];
                    picList.push(that.picPath + obj);
                }
                picView(index, picList);
            },
            //拍照
            addCameraPic: function () {
                var that = this;
                uexCamera.open(0, 40, function (picPath) {
                    //显示加载效果
                    var index = layerLoading();
                    var arr = [picPath];
                    var json1={
                        serverUrl:mainPath+'uploadFileApi.do?uploadFile',
                        filePath:arr,
                        quality:3
                    };
                    appcan.plugInUploaderMgr.upload(json1,function(e){

                        if(e.status==1){ //上传成功
                            //移除加载
                            layerRemove(index);
                            that.pic = that.pic.concat(e.picArray);
                            layerToast("图片上传成功", 2);
                            that.isClick = 0;
                        }else if(e.status==3){ //上传中
                            that.isClick = 1;
                        }else{ //上传失败
                            //移除加载
                            layerRemove(index);
                            layerToast("图片上传失败", 2);
                            that.isClick = 0;
                        }
                    });

                    /*
                    var data = {
                        src: picPath,
                        mode: 6
                    };
                    uexImage.openCropper(data, function (error, info) {
                        if (error == -1) {
                            layerToast('已取消图片上传。');
                        } else if (error == 0) {
                            var arr = [info.data];
                            var json1={
                                serverUrl:mainPath+'uploadFileApi.do?uploadFile',
                                filePath:arr,
                                quality:2
                            };
                            appcan.plugInUploaderMgr.upload(json1,function(e){
                                if(e.status==1){ //上传成功
                                    //移除加载
                                    layerRemove(index);
                                    that.pic = that.pic.concat(e.picArray);
                                    layerToast("图片上传成功", 2);
                                    that.isClick = 0;
                                    appcan.window.publish('patrol-hideClick','showClick');
                                }else if(e.status==3){ //上传中
                                    that.isClick = 1;
                                    appcan.window.publish('patrol-hideClick','hideClick');
                                }else{ //上传失败
                                    //移除加载
                                    layerRemove(index);
                                    layerToast("图片上传失败", 2);
                                    that.isClick = 0;
                                    appcan.window.publish('patrol-hideClick','showClick');
                                }
                            });
                        }
                    });
                    */
                });
            }

        },
        computed:{
            //图片上传三张上传按钮隐藏
            hidePic: function () {
                if(this.pic.length>=3){
                    return 0
                }else{
                    return 1
                }
            }
        },
        created:function () {
             //接收处罚单降级数据
            var punishDemotion = appcan.locStorage.getVal('patrol-punish-demotion');
            if(punishDemotion!==null){
                this.showDepartment = true;
                var punishItems = JSON.parse(punishDemotion);
                this.title = punishItems.title;
                this.detail = punishItems.content;
                this.departId = punishItems.departId;
                this.department = punishItems.departName;
                this.punishId = punishItems.punishId;
                this.isPunishDetail = '222';
                if(punishItems.picList != null){
                    this.pic = punishItems.picList;
                }
            }
            //清理处罚单降级数据
            appcan.locStorage.remove('patrol-punish-demotion');
        }
    });
    appcan.ready(function() {

        appcan.button("#button", "btn-act",function() {
            console.log(vm.copyUserIds === '');
            if(!isDefine(vm.title)){
                layerToast('请输入标题。');
                return false;
            }else if(!isDefine(vm.location)){
                layerToast('请输入详细位置。');
                return false;
            }else if(!isDefine(vm.detail)){
                layerToast('请输入事件描述。');
                return false;
            }else if(vm.department == '请选择部门'){
                layerToast('请选择部门。');
                return false;
            }else if(vm.isClick == 1){
                return false;
            }else {
                vm.isClick = 1;
                console.log(vm.copyUserIds);
                var json = {
                    path: mainPath + "reformApiController.do?createReform",
                    data: {
                        "userId": appcan.locStorage.getVal("userID"),
                        "userName": appcan.locStorage.getVal("userName"),
                        "reformTitle": vm.title,
                        "departId": vm.departId,
                        "remark": vm.detail,
                        "type" : "0",
                        "area": vm.location,
                        "picturePath": vm.pic.join(","),
                        "standardList":[],//默认传空数组
                        "executorId": "" ,//默认传空字符串
                        "punishId":vm.punishId,//处罚单降级才有数据,一般为空
                        "loginDepartId":appcan.locStorage.getVal('deptId'),
                        "copyUserIds":vm.copyUserIds,
                    }
                };
                // console.log(json.data.punishId);
                ajaxPOST(json, function(data, e) {
                    if(e == "success") {
                        vm.isClick = 1;
                        appcan.locStorage.setVal('patrol-reformId',data.data);
                        appcan.locStorage.setVal('patrol-alertSuccess',vm.isPunishDetail);
                        appcan.locStorage.setVal('patrol-status', '1');
                        appcan.locStorage.setVal('patrol-role', appcan.locStorage.getVal('patrol-role'));
                        openWindow('reform-rectification-details','reform-rectification-details.html','');
                    } else {
                        vm.isClick = 0;
                        layerToast('派发失败,请检查网络是否连接。');
                    }

                })
            }
        });

        //接收改变部门发来的通道
        appcan.window.subscribe('patrol-chooseVal', function (msg) {
            var obj = JSON.parse(msg);
            vm.department = obj.departName;
            vm.departId = obj.departId;
        });

        //接收改变抄送人发来的通道
        appcan.window.subscribe('patrol-copy-from-address-pick', function(msg){
            var pcJson = JSON.parse(msg);
            vm.peoplepick = msg;
            var peopleCopyArr = [];
            for(var i=0;i<pcJson.length;i++){
                peopleCopyArr.push(pcJson[i].id);
            }
            vm.copyUserIds = peopleCopyArr.join(',');
            console.log(vm.copyUserIds);
            if(pcJson.length>1){
                vm.copyUserNames = pcJson[0].name + ' 等'+pcJson.length+'人';
            }else{
                vm.copyUserNames = pcJson[0].name;
            }
        });
    })
})($);
