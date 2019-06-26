var vm = new Vue({
	el: '#Page',
	data: {
	    title:"处罚单",//
		tab: 0, //0=未通过及驳回  1=待审核 2=已审核 3=抄送我的
		nonet: false, //网络状态
		role: 1, //角色 0=巡查经理 1=其他二级部门角色(值班账号) 2=中队长 3=副大队长
		roleData:"",//角色的数据 角色的ID 角色的rolecode 角色的rolename
		handingtxt: "审批中", //巡查经理=审批中 巡查大队领导=待审批
		handing: 0, //待审核总数
		completed: 0, //已审核总数
		nopass: 0, //未通过总数
		copytotal:0,//抄送列表的总数
		list: [] //列表
	},
	methods: {
		//切换TAB
		changeTab: function(index) {
			var that = this;
			that.tab = index;
			that.ResetUpScroll();
		},
		//打开处罚单详情
		openDetail: function(punishId) {
			//本地存储处罚单ID
			appcan.locStorage.setVal("patrol-punishId", punishId);
			//打开处罚单详情
			openWindow("punish-detail", "punish-detail.html", "");
		},
		//上拉回调 page = {num:1, size:15}; num:当前页 ,默认从1开始; size:每页数据条数,默认15
		upCallback: function(page) {
			//联网加载数据
			var that = this;
			that.getListDataFromNet(page.num, page.size, function(curPageData, totalSize) {
				//如果是第一页需手动制空列表
				if(page.num == 1) that.list = [];
				//更新列表数据
				that.list = that.list.concat(curPageData);
				//方法二(推荐): 后台接口有返回列表的总数据量 totalSize
				that.mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)		
			}, function() {
				//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
				that.mescroll.endErr();
			});
		},
		//联网加载列表数据
		getListDataFromNet: function(pageNum, pageSize, successCallback, errorCallback) {
			var that = this;
			var role, commonId;
			if(that.role == 3) {
				role = "";
			}else if(that.role == 4){
			    role = 1;
			} else {
				role = that.role;
			}
			if(that.role == 0 || that.role == 2 || that.role == 4) {
				commonId = appcan.locStorage.getVal("userID");
			} else if(that.role == 1) {
				commonId = appcan.locStorage.getVal("deptId");
			}else{
				commonId = "";
			}
			var params = {
				"role": role + "", //0、表示巡查角色  1、二级单位角色  2=中队长   不传表示大队领导角色
				"commonId": commonId, // 当role传0 和 2时，当前登录用户Id到该字段  当role传1时，传当前用户部门ID
				"page": pageNum + "", //String类型
				"pageSize": pageSize + "", //String类型
				"roleCode":that.roleData.rolecode,//角色的rolecole
				"loginDepartId":appcan.locStorage.getVal("deptId"),
				"userId":appcan.locStorage.getVal("userID")
			}
			console.log(params);
			appcan.ajax({
				url: mainPath + "punishApiController.do?getPunishList",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				data: params,
				offline: false,
				success: function(res) {
					if(res.success == true) {
						console.log(res);			
						appcan.window.publish("option-get-num", "option-get-num");
						that.handing = res.data.handing;
						that.completed = res.data.completed;
						that.nopass = res.data.nopass;
						that.copytotal = res.data.copytotal;
						if(that.tab == 0) {
							successCallback && successCallback(res.data.nopassList, res.data.nopass);
						} else if(that.tab == 1) {
							var data = res.data.handingList;
							//处理当前节点待审核/审核中的人
							if(that.role == 0) { //巡查督查经理，在审核中tab均要显示当前节点审核人
								for(var i = 0; i < data.length; i++) {
									if(data[i].status == "1") {
										data[i].aduitName = data[i].checkedList[1].aduitName;
									}
									if(data[i].status == "4") {
										data[i].aduitName = data[i].checkedList[2].aduitName;
									}
								}
							}
							if(that.role == 2) { //中队长，在待审核tab要显示status=4时副大队长名称
								for(var i = 0; i < data.length; i++) {
									if(data[i].status == "4") {
										data[i].aduitName = data[i].checkedList[2].aduitName;
									}
								}
							}
							successCallback && successCallback(data, res.data.handing);
						} else if(that.tab == 2) {
							successCallback && successCallback(res.data.completedList, res.data.completed);
						}else if(that.tab == 3){
						    successCallback && successCallback(res.data.copyList, res.data.copytotal);
						}
					} else {
						errorCallback && errorCallback();
						layerToast(res.msg, 2);
					}
				},
				error: function(e) {
					errorCallback && errorCallback();
					layerToast('网络错误，请检查网络环境', 2);
					that.list = [];
					that.nonet = true;
				}
			})

		},
		//重置列表数据
		ResetUpScroll: function() {
			var that = this;
			that.list = [];
			//mescroll重置列表数据
			that.mescroll.resetUpScroll();
		},
		AddPunish: function() {
			openWindow("punish-add", "punish-add.html", "");
			//清除选择责任部门的页面的默认值
			appcan.locStorage.remove('patrol-chooseDepartName');
		}
	},
	mounted: function() {
		var that = this;
		//获取用户角色
		getRoleForPunish(function(data, e) {
			if(e == "success") { //data.role 0=巡查经理 1=中队长 3=副大队长 2=二级部门值班账号 4=其他角色
				that.roleData = data.data;
				if(data.role == 0) {
					that.role = 0; //0=巡查经理 1=其他二级部门角色 2=中队长 3=副大队长
				} else if(data.role == 1) {
					that.role = 2;
				} else if(data.role == 3) {
					that.role = 3;
				} else if(data.role == 2) {
					that.role = 1;
				}else{
					that.role = 4;
				}
				//
				if(that.role == 2 || that.role == 3) {
					that.tab = 1;
					that.handingtxt = "待审批";
				}
				if(that.role == 1){//二级单位值班账号
				    that.tab = 2;
				}
				if(that.role == 4){//个人账号登录查看抄送
				    that.tab = 3;
				    that.title = '抄送我的';
				}
				if(that.role == 1) {
					that.tab = 2;
				}
				that.mescroll = new MeScroll("mescroll", {
					up: {
						callback: that.upCallback, //上拉回调
						//以下参数可删除,不配置
						page: {
							size: 15
						},
						empty: { //配置列表无任何数据的提示
							warpId: "punish-list",
							icon: "../img/nothing.png",
							tip: ""
						}
					}
				});
				//初始化vue后,显示vue模板布局
				document.getElementById("punish-list").style.display = "block";
			} else {
				that.nonet = true;
			}
		})

	}
});

(function($) {	
	appcan.ready(function() {		
		//返回
		appcan.button("#nav-left", "btn-act", function() {
			appcan.window.close(1);
		});
	})
})($);