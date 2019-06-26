/**
 * Created by KC on 2017/12/19.
 */
var vm = new Vue({
    el: '#app',
    data: {
        hasBtn: false,
        hasTime: false,
        isShow: true,
        unfinished: [],
        finished: [],
        list: [],
        handingMsg: null,
        completeMsg: null
    },
    methods: {
        //未完成列表展示
        toggle1: function () {
            this.isShow = true;
            this.hasTime = false;
            this.hasBtn = true;
            //重置列表数据
            this.ResetUpScroll();
        },
        //完成列表展示
        toggle2: function () {
            this.isShow = false;
            this.hasTime = true;
            this.hasBtn = false;
            //重置列表数据
            this.ResetUpScroll();
        },
        //接收巡查单
        receive: function (item) {
            //alert(item.status)
            var params = {
                userId: localStorage.getItem('userID'),
                userName: localStorage.getItem('userName'),
                inspectId: item.id,
                status: '3'
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
                        item.status = 3;
                    }
                },
                error: function (e) {

                }
            })
        },
        //跳转到巡查单详情
        toDetail: function (item) {
            var patroDate = item.patroDate.substr(5,6);
            localStorage.setItem('patrol-title',patroDate+item.title);
            if (item.date) {
                localStorage.setItem('patrol-save', true)
            } else {
                localStorage.setItem('patrol-save', false)
            }
            if (vm.isShow == true) {
                openWindow("inspect-submit", "inspect-submit.html", "");
                localStorage.setItem('patrol-inspectId', item.id)
            } else {
                openWindow("inspect-finish", "inspect-finish.html", "");
                localStorage.setItem('patrol-inspectId', item.id)
            }
        },
        //返回按钮
        back: function () {
            appcan.window.close(1)
        },
        //重置列表数据
        ResetUpScroll: function () {
            var that = this;
            that.list = [];
            //返回顶部的按钮要消失
            $(".mescroll-totop").removeClass("mescroll-fade-in");
            $(".mescroll-totop").addClass("mescroll-fade-out");
            //mescroll重置列表数据
            that.mescroll.resetUpScroll();
        },
        //上拉回调
        upCallback: function (page) {
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
        //联网加载数据
        getListDataFromNet: function getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
            var that = this;
            var params = {
                page: pageNum,
                pageSize: pageSize,
                userId: localStorage.getItem('userID'),
                loginDepartId:localStorage.getItem('deptId')
            };
            appcan.ajax({
                url: mainPath + 'inspectApiController.do?getInspectList',
                data: params,
                type: 'GET',
                offline: false,
                success: function (res) {
                    //console.log(res);
                    var obj = JSON.parse(res);
                    vm.handingMsg = obj.data.handing;
                    vm.completeMsg = obj.data.complete;
                    if (obj.success) {
                        appcan.window.publish("option-get-num", "option-get-num");
                        var total;
                        var curDate = new Date();
                        if (that.isShow) {
                            for (var i = 0; i < obj.data.handingList.length; i++) {
                                var obj1 = obj.data.handingList[i];
                                //obj1.date = parseInt(obj1.patroDate.substr(8, 11))
                                var d = new Date(Date.parse(obj1.patroDate.substr(0, 11).replace(/-/g, "/")));
                                if (d <= curDate) {
                                    obj1.date = true
                                } else {
                                    obj1.date = false
                                }
                            }
                            total = obj.data.handing;
                            successCallback && successCallback(obj.data.handingList, total);
                        } else {
                            total = obj.data.complete;
                            successCallback && successCallback(obj.data.completeList, total);
                        }

                    } else {

                    }
                },
                error: function (e) {

                }
            })
        }
    },
    mounted: function () {
        var that = this;
        that.mescroll = new MeScroll("mescroll", {
            down: {
                auto: true
            },
            up: {
                callback: that.upCallback, //上拉回调
                page: {size: 15}, //可配置每页8条数据,默认10
                empty: { //配置列表无任何数据的提示
                    warpId: "inspectList",
                    icon: "../img/nothing.png",
                    tip: ''
                }
            }
        });
        //初始化vue后,显示vue模板布局
        document.getElementById("inspectList").style.display = "block";
        getRole(function (role) {
            localStorage.setItem('inspect-role',role)
        })
    }
});