/**
 * Created by KC on 2017/10/24.
 */

//自定义一个color,判断什么状态显示什么颜色
Vue.directive('color', function (el, binding) {
    var statusCol = binding.value.statusCol;
//拒绝验收
    var rejectCol = binding.value.rejectCol;     
    var part = binding.value.part;
    var isReject = binding.value.isReject;
    //验收不通过     
    if(rejectCol == 1){
        el.style.color = "#fe4344";
    }else{
           if (statusCol == 2 || statusCol == 1 && part == 1 && isReject == '1') {
            el.style.color = '#fe4344'
        } else if (statusCol == 1 || statusCol == 3) {
            el.style.color = '#52A6FF'
        } else if (statusCol == 5 || statusCol == 6 ) {
            el.style.color = '#ff8b51'
        } else if (statusCol == 4) {
            // el.style.color = '#fff';
            el.style.color = '#52A6FF';
            // el.style.backgroundColor = '#E1E1E1';
        }else if(statusCol == 7 || statusCol == 8){
            el.style.color = '#fff';
            el.style.backgroundColor = '#E1E1E1';
        } 
    }

});
var vm = new Vue({
    el: '#reformLists',
    data: {
        none: false,
        role: '', //角色  0、表示巡查角色  1、二级单位角色   2、普通个人用户  不传表示大队领导角色
        mescroll: null,
        noReceive: { //未接收
            msg: 0, //list数量
            tab: 0,
            list: []
        },
        Changes: { //整改中
            msg: 0, //list数量
            tab: null,
            list: []
        },
        Finish: { //已完成
            msg: 0, //list数量
            tab: null,
            list: []
        },
        tabType: 0, //0：未接收；1：整改中；2：已完成
        list: [],
        showAdd: false,//新增整改单
        headerNav: '',
        navList: [
            '我接收的',
            '抄送我的'
        ],
        navShow: false,
        showTab:false,//显示隐藏tab
        showChooseImg:false,
        tabNum:0
    },
    filters: {
        //过滤后台返回的状态
        showStatus: function (status, reason, role, isReject) {
            var val;
            if (isReject == 1 && status == '1' && role == '1') {
                val = '7'
            } else if (status == '2' && role == '1') {
                val = '10'
            }else if(status == '7' || status == '8'){
                val = '4'
            }else if(status == '4'){
                val = '11'
            }else {
                val = status;
            }
            switch (val) {
                case '1':
                    return '未接收';
                    break;
                case '2':
                    return '被申诉';
                    break;
                case '3':
                    return '整改中';
                    break;
                case '4':
                    return '已关闭';
                    break;
                case '5':
                    return '接收超时';
                    break;
                case '6':
                    return '完成超时';
                    break;
                case '7':
                    return '驳回待接收';
                    break;
                case '8':
                    return '待审批';
                    break;
                case '10':
                    return '申诉中';
                    break;
                case '9':
                    return '待反馈';
                    break;
                case '11':
                    return '待验收';
                    break;       
            }
        },
        showReject: function(status, reason, role, isReject){
            if(status == '1'){
                return '拒绝验收';
            }
        }
    },
    methods: {
        //tab
        toggle: function (index) {
            //1未接收,2整改中,3已完成
            var that = this;
            if(index === 0){
                that.noReceive.tab = 0;
                that.Changes.tab = null;
                that.Finish.tab = null;
                that.tabType = 0;
                that.tabNum = index;
            }else if(index === 1){
                that.noReceive.tab = null;
                that.Changes.tab = 1;
                that.Finish.tab = null;
                that.tabType = 1;
                that.tabNum = index;
            }else if(index === 2){
                that.noReceive.tab = null;
                that.Changes.tab = null;
                that.Finish.tab = 2;
                that.tabType = 2;
                that.tabNum = index;
            }
            //重置列表数据
            that.ResetUpScroll();

        },
        //选择nav列表
        choose: function(item, index) {
            $('.header h1 img').css('transform', 'rotate(0deg)');
            this.navShow = !this.navShow;
            this.headerNav = item;
            if(index === 0){
                this.showTab = true;
                $('.mescroll1').css({"top":"5.75em"});
                this.tabType = this.tabNum;
                this.ResetUpScroll();
            }else if(index === 1){
                this.showTab = false;
                this.tabType = 3;
                $('.mescroll1').css({"top":"2.75em"});
                this.ResetUpScroll();
            }
        },
        //切换头部nav
        toggleNav: function (val) {
            if(val === '1'){
                this.navShow = !this.navShow;
                if (this.navShow == true) {
                    $('.header h1 img').css('transform', 'rotate(180deg)')
                } else {
                    $('.header h1 img').css('transform', 'rotate(0deg)')
                }
            }
        },
        //点击页面隐藏modal
        hideModalFloor:function(){
            $('.header h1 img').css('transform', 'rotate(0deg)');
            this.navShow = !this.navShow;
        },

        //打开详情页
        openDetails: function (msg, index) {
            //为详情页储存状态和角色和id
            console.log(this.role);
            appcan.locStorage.setVal('patrol-status', msg.status);
            appcan.locStorage.setVal('patrol-reformId', msg.id);
            appcan.locStorage.setVal('patrol-role', this.role);
            appcan.locStorage.setVal('patrol-reform-headerNav', this.headerNav);
            openWindow('reform-rectification-details', 'reform-rectification-details.html');
        },
        //点击打开新增整改单
        addList: function () {
            appcan.locStorage.setVal('patrol-role', this.role);
            openWindow('reform-temporary', 'reform-temporary.html');
            appcan.locStorage.remove('patrol-chooseDepartName')
        },

        //以下是下拉刷新和下拉加载方法
        ResetUpScroll: function () {
            var that = this;
            that.list = [];
            //返回顶部的按钮要消失
            $(".mescroll-totop").removeClass("mescroll-fade-in");
            $(".mescroll-totop").addClass("mescroll-fade-out");
            //mescroll重置列表数据
            that.mescroll.resetUpScroll();
        },
        upCallback: function (page) { //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
            var self = this;
            self.getListDataFromNet(page.num, page.size, function (curPageData, totalSize) {
                //如果是第一页需手动制空列表
                if (page.num == 1) self.list = [];

                //更新列表数据
                self.list = self.list.concat(curPageData);
                //console.log("page.num="+page.num+", page.size="+page.size+", curPageData.length="+curPageData.length+", self.list.length==" + self.list.length+',totalSize=='+totalSize);
                // 后台接口有返回列表的总数据量 totalSize
                self.mescroll.endBySize(curPageData.length, totalSize);

            }, function () {
                //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                self.mescroll.endErr();
            });
        },
        getListDataFromNet: function (pageNum, pageSize, successCallback, errorCallback) {
            var that = this;
            var commonId;
            if (that.role == '1') {
                commonId = appcan.locStorage.getVal("deptId");
            } else if (that.role == '0') {
                commonId = appcan.locStorage.getVal("userID");
            } else if (that.role == '') {
                commonId = appcan.locStorage.getVal("userID");
            }
            var params = {
                "role": that.role,
                "page": pageNum + "",
                "pageSize": pageSize + "",
                "commonId": commonId,
                "loginDepartId": appcan.locStorage.getVal('deptId'),
                "userId": appcan.locStorage.getVal('userID'),
            };
            appcan.ajax({
                url: mainPath + "reformApiController.do?getReformList",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: params,
                offline: false,
                success: function (data) {
                    console.log(data)
                    if (data.success == true) {
                        that.none = false;
                        //列表数据数量
                        appcan.window.publish("option-get-num", "option-get-num");
                        that.noReceive.msg = data.data.noReceive;
                        that.Changes.msg = data.data.handing;
                        that.Finish.msg = data.data.complete;
                        console.log(data.data);
                        var total;
                        if (that.tabType == 0) { //0：未接收；1：整改中；2：已完成
                            total = data.data.noReceive;
                            //赋值给列表数据
                            successCallback && successCallback(data.data.noReceiveList, total);
                        } else if (that.tabType == 1) {
                            total = data.data.handing;
                            //赋值给列表数据
                            successCallback && successCallback(data.data.handingList, total);
                        } else if (that.tabType == 2) {
                            total = data.data.complete;
                            //赋值给列表数据
                            successCallback && successCallback(data.data.completeList, total);
                        }else if (that.tabType == 3) {
                            total = data.data.copyCount;
                            //赋值给列表数据
                            successCallback && successCallback(data.data.copyList, total);
                        }
                    } else {
                        errorCallback && errorCallback();
                        layerToast(data.msg, 2);
                    }
                },
                error: function (e) {
                    errorCallback && errorCallback();
                    that.none = true;
                }
            })
        }
    },
    mounted: function () {
        var self = this;
        //获取角色
        getRole(function (data, e) {
            console.log(data);
            if (e == "success") {
                self.none = false;
                if (data == 0) { //巡查经理
                    self.role = '0';
                    self.showAdd = true;
                    self.headerNav = '整改单';
                    self.showTab = true;
                    self.showChooseImg = false;
                } else if (data == 1 || data == 3) { //中队长 副大队长权限
                    self.role = '';
                    self.showAdd = true;
                    self.headerNav = '整改单';
                    self.showTab = true;
                    self.showChooseImg = false;
                } else if(data == 2){ //值班账号
                    self.role = '1';
                    self.headerNav = '我接收的';
                    self.showTab = true;
                    self.showChooseImg = true;
                }else if(data === 4){ //普通个人用户
                    self.role = '2';
                    self.headerNav = '抄送我的';
                    self.showChooseImg = false;
                    self.tabType = 3;
                    self.showTab = false;
                    $('.mescroll1').css({"top":"2.75em"});
                }
                self.mescroll = new MeScroll("mescroll", {
                    down: {
                        auto: true
                    },
                    up: {
                        callback: self.upCallback, //上拉回调
                        page: {
                            size: 15
                        }, //可配置每页8条数据,默认10
                        //toTop: { //配置回到顶部按钮
                        //    src : ".././images/mescroll-totop.png" ,//默认滚动到1000px显示,可配置offset修改
                        //    offset : 1000
                        //},
                        empty: { //配置列表无任何数据的提示
                            warpId: "reformList",
                            icon: "../img/nothing.png",
                            tip: ""
                        },
                        //noMoreSize:15
                    }
                });
                //初始化vue后,显示vue模板布局
                document.getElementById("reformList").style.display = "block";
            } else {
                self.none = true;
            }
        });

    }
});
(function ($) {
    appcan.button('#nav-left', 'btn-act', function () {
        appcan.window.close(1)
    });
    appcan.ready(function() {
        appcan.window.subscribe('patrol-alertSuccess',function () {
            vm.ResetUpScroll();
            layerToast('升级处罚单成功。',2);
        });
        //点击按钮完成之后的提醒弹窗
        appcan.window.subscribe("patrol-reform-layerTitle",function (msg) {
            if(msg === 'accept'){
                layerToast('提交整改措施成功。',2);
            }else if(msg === 'appeal'){
                layerToast('提交申诉成功。',2);
            }else if(msg === 'changeDep'){
                layerToast('改派部门成功。',2);
            }else if(msg === 'close'){
                layerToast('关闭整改单成功。',2);
            }else if(msg === 'finish'){
                layerToast('完成整改单成功。',2);
            }else if(msg === 'reject'){
                layerToast('驳回整改单成功。',2);
            }
        })
    })
})($);