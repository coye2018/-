//返回 status 1=待审核  4=审核中  2=已审核   5=不通过

var vm = new Vue({
	el: '#Page',
	data: {
		tab: 0, //0=进展 1=回复
		role: "", //0=巡查经理 1=其他二级部门角色 2=中队长 3=副大队长
		roleData: "", //角色的数据 角色的ID 角色的rolecode 角色的rolename
		status_txt: "",
		isBlue: false,
		isGreen: false,
		isRed: false,
		path: mainPath,
		isBtnPass: 0, //1=不可以点击按钮
		timetitle: "提报时间",
		data: {},
		isCopy:0,//0==不是抄送的 1=抄送的
		hasCopy:0//0=没有抄送人，1=有抄送人
	},
	methods: {
		//打开图片全屏浏览
		openPic: function(index) {
			var that = this;
			var picListData = [];
			for(var i = 0; i < that.data.picList.length; i++) {
				picListData.push(that.path + that.data.picList[i]);
			}
			picView(index, picListData);
		},
		//进展与回复切换
		changeTab: function(index) {
			var that = this;
			that.tab = index;
		},
		//添加回复
		addDynamics: function(id) {
			var that = this;
			var data = {
				emojicons: "res://emojicons/emojicons.xml",
				placeHold: "请输入内容"
			};
			uexInputTextFieldView.open(data);
			uexInputTextFieldView.setInputFocused();
			uexInputTextFieldView.onCommitJson = onCommitJson;

			function onCommitJson(data) {
				if(data.emojiconsText.length > 3000) {
					layerToast("回复内容超出限制", 2);
					return false;
				}
				var params = {
					userId: appcan.locStorage.getVal("userID"),
					userName: appcan.locStorage.getVal("userName"),
					punishId: id,
					content: data.emojiconsText,
					loginDepartId:appcan.locStorage.getVal("deptId")
				};
				if(data.emojiconsText != '') {
					appcan.ajax({
						url: mainPath + "punishApiController.do?replyPunish",
						type: 'POST',
						dataType: 'json',
						contentType: 'application/json',
						data: params,
						offline: false,
						success: function(res) {
							if(res.success == true) {
								//给回复添加内容
								var replyData = {
									cgformId: "",
									content: params.content, //回复内容
									createBy: params.userId, //回复人ID
									createDate: dateToStr(new Date()), //回复时间
									createName: params.userName, //回复人名称
									id: ""
								}
								that.data.replyList.unshift(replyData);
								uexInputTextFieldView.close();
								layerToast('回复成功', 2);
							} else {
								layerToast(res.msg, 2);
							}
						},
						error: function(e) {
							layerToast('网络错误，请检查网络环境', 2);
						}
					})

				} else {
					uexInputTextFieldView.close();
					layerToast("请输入回复内容", 2);
				}

			};

		},
		//显示抄送部门全部信息
		toCopyDepart: function() {
			var that = this;
			if(that.hasCopy == 1) {
				appcan.locStorage.setVal('patrol-copydepartlist', JSON.stringify(that.data.copydeparttList));
				openWindow("patrol-choose-departlist", "patrol-choose-departlist.html", "");
			} else {
				layerToast("暂无抄送！", 2);
			}

		}
	},
	mounted: function() {
		//显示加载		
		var index = layerLoading();
		var that = this;
		//获取角色
		getRoleForPunish(function(data, e) {
			if(e == "success") {
				that.roleData = data.data;
				if(data.role == 0) {
					that.role = 0; //0=巡查经理 1=其他二级部门角色 2=中队长 3=副大队长
				} else if(data.role == 1) {
					that.role = 2;
				} else if(data.role == 3) {
					that.role = 3;
				} else {
					that.role = 1
				}
				if(data.role == 4){//个人账号登录的
				    that.isCopy = 1;
				}
				var punishId = appcan.locStorage.getVal("patrol-punishId");
				var params = {
					"punishId": punishId,
					"departId":appcan.locStorage.getVal("deptId"),//当前用户的部门ID
					"roleCode":that.roleData.rolecode//当前用户的角色code
				}
				appcan.ajax({
					url: mainPath + "punishApiController.do?getPunishDetail",
					type: "GET",
					dataType: "json",
					contentType: "application/json",
					data: params,
					offline: false,
					success: function(res) {
						layerRemove(index);
						if(res.success == true) {						    
							if(res.data.progressList == null) {
								res.data.progressList = [];
							}
							if(res.data.replyList == null) {
								res.data.replyList = [];
							}
							if(res.data.status == "2" || res.data.status == "5") {
								//进展的内容
								for(var i = 0; i < res.data.progressList.length; i++) {
									res.data.progressList[i].iconStatus = 2;
								}
								if(res.data.progressList.length > 0) {
									if(res.data.progressList.length > 1) {
										res.data.progressList[0].iconStatus = 3;
									}
									res.data.progressList[res.data.progressList.length - 1].iconStatus = 1;
								}
								if(res.data.status == "2") {
									that.status_txt = "已审批";
								}
								if(res.data.status == "5") {
									that.status_txt = "不通过";
								}
								that.isGreen = true;

							} else {
								if(that.role == 0) {
									that.status_txt = "审核中";
									that.isBlue = true;
								} else {
									that.status_txt = "待审批";
									that.isBlue = true;
								}
								if(res.data.status == "6") {
									that.status_txt = "驳回";
									that.isRed = true;
								}
								//进展的内容
								for(var i = 0; i < res.data.progressList.length; i++) {
									res.data.progressList[i].iconStatus = 2;
								}
								if(res.data.progressList.length > 0) {
									res.data.progressList[res.data.progressList.length - 1].iconStatus = 1;
								}
							}
							//判断createBy == 0 显示为系统；  createBy == 管理员 显示为管理员
							for(var i = 0; i < res.data.progressList.length; i++) {								
								if(res.data.progressList[i].createBy == "0") {
									res.data.progressList[i].createName = "系统";
								}
								if(res.data.progressList[i].createName == "0"){
								    res.data.progressList[i].createName = "系统";
								}
								if(res.data.progressList[i].createBy == "管理员") {
									res.data.progressList[i].createName = "管理员";
								}
							}
							//处理抄送人
							if(res.data.copydepartt != null && res.data.copydepartt != '') {
								var copydepartt = JSON.parse(res.data.copydepartt);
								res.data.copydepartText = copydepartt[0].realname;
								if(copydepartt.length > 1) {
									res.data.copydepartText = copydepartt[0].realname + " 等" + copydepartt.length + "人"
								}
								res.data.copydeparttList = copydepartt;
								that.hasCopy = 1;
							} else {
								res.data.copydepartText = "暂无";
								res.data.copydeparttList = [];
								that.hasCopy = 0;
							}
							that.data = res.data;
							//处理审核节点
							var checkedListData = [];
							for(var i = 0; i < res.data.checkedList.length; i++) {
								var json = {
									isShow: false,
									iSaduitImage: false,
									aduitImage: "",
									shortName: "",
									aduitName: "",
									status: false,
									iSnodeShow: false,
									nodes: false
								}
								checkedListData.push(json);
							}
							var end = 0;
							if(res.data.checkedList[2].aduitId == res.data.managerId) {
								checkedListData[2].isShow = true;
								checkedListData[1].isShow = false;
								checkedListData[0].isShow = false;
								end = 1;
							}
							if(res.data.checkedList[1].aduitId == res.data.managerId) {
								if(end == 0) {
									checkedListData[2].isShow = true;
									checkedListData[1].isShow = true;
									checkedListData[0].isShow = false;
								}
								end = 1;
							}
							if(res.data.checkedList[0].aduitId == res.data.managerId) {
								if(end == 0) {
									checkedListData[2].isShow = true;
									checkedListData[1].isShow = true;
									checkedListData[0].isShow = true;
								}
							}
							for(var i = 0; i < res.data.checkedList.length; i++) {
								if(checkedListData[i].isShow) {
									//头像
									if(isDefine(res.data.checkedList[i].aduitImage)) {
										checkedListData[i].iSaduitImage = true;
										checkedListData[i].aduitImage = serverPath + res.data.checkedList[i].aduitImage;
									} else {
										checkedListData[i].iSaduitImage = false;
										checkedListData[i].aduitImage = "";
									}
									checkedListData[i].shortName = res.data.checkedList[i].aduitName.substr(res.data.checkedList[i].aduitName.length - 2, 2);
									//名称
									checkedListData[i].aduitName = res.data.checkedList[i].aduitName;
									//小状态  流程节点
									if(res.data.status == "5") { //不通过
										checkedListData[i].status = false;
										checkedListData[i].nodes = false;
									}
									if(res.data.status == "2") { //已审核
										checkedListData[i].status = true;
										checkedListData[i].nodes = true;
									}
									if(res.data.status == "1") { //待审核
										checkedListData[0].status = true;
										checkedListData[0].nodes = true;
										checkedListData[1].status = false;
										checkedListData[1].nodes = false;
										checkedListData[2].status = false;
										checkedListData[2].nodes = false;
									}
									if(res.data.status == "4") { //审核中
										checkedListData[0].status = true;
										checkedListData[0].nodes = true;
										checkedListData[1].status = true;
										checkedListData[1].nodes = true;
										checkedListData[2].status = false;
										checkedListData[2].nodes = false;
									}
									//流程节点
									if(i == res.data.checkedList.length - 1) {
										checkedListData[i].iSnodeShow = false;
									} else {
										checkedListData[i].iSnodeShow = true;
									}
								}
							}
							that.data.checkedListData = checkedListData;      
						} else {
							layerToast(res.msg, 2);
						}
					},
					error: function(e) {
						layerRemove(index);
						layerToast('网络错误，请检查网络环境', 2);
					}
				})

			} else {
				layerRemove(index);
				layerToast('网络错误，请检查网络环境', 2);
			}
		})
	},
	computed: {
		//是否显示底部按钮   --审核通过 驳回 审核不通过
		hasCheckBtn: function() {
			var that = this;
			//中队长角色role=2 + 状态status=1
			//副大队长role=3 + 状态status=4
			if(that.role == 2 && that.data.status == 1) {
				return true;
			} else if(that.role == 3 && that.data.status == 4) {
				return true;
			} else {
				return false;
			}
		},
		//是否显示底部按钮  --修改处罚单（驳回的处罚单status=6 + 当前用户为当前处罚单新建人）//驳回的单
		hasModifyBtn: function() {
			var that = this;
			var userID = appcan.locStorage.getVal("userID");
			if(that.data.status == 6 && that.data.managerId == userID) {
				return true;
			} else {
				return false;
			}
		},
		//是否显示底部按钮 --降级处罚单（对于不通过的处罚单status=5 ）
		hasDemotionBtn:function(){
		    var that = this;
            var userID = appcan.locStorage.getVal("userID");
            if(that.data.status == 5 && that.data.managerId == userID) {
                return true;
            } else {
                return false;
            }
		},
		replyNum: function() {
			var that = this;
			//计算回复的数量
			if(!isDefine(that.data.replyList)) {
				return 0;
			} else {
				return that.data.replyList.length;
			}
		},
		bottomh: function() {
			var that = this;
			var userID = appcan.locStorage.getVal("userID");
			if(that.role == 2 && that.data.status == 1) {
				return 3;
			} else if(that.role == 3 && that.data.status == 4) {
				return 3;
			} else if(that.data.status == 6 && that.data.managerId == userID) {
				return 3.5;
			} else if(that.data.status == 5 && that.data.managerId == userID){
			    return 3.5;
			} else {
				return 0;
			}
		}
	}
});

(function($) {
	appcan.ready(function() {
		//返回
		appcan.button("#nav-left", "btn-act", function() {
			appcan.window.close(1);
		});
		//取消
		appcan.button("#nav-right", "btn-act", function() {
			appcan.window.close(1);
		});
		//审核通过
		appcan.button("#punish-pass", "btn-act", function() {
			if(vm.isBtnPass == 1) return;
			vm.isBtnPass = 1;
			addConfirm({
				content: '确认是否审核通过？',
				yes: function(i) {
					vm.isBtnPass = 0;
					var role; //0=巡查经理 1=其他二级部门角色 2=中队长 3=副大队长
					if(vm.role == 3) {
						role = ""
					} else {
						role = vm.role;
					}
					var params = {
						"userId": appcan.locStorage.getVal("userID"),
						"userName": appcan.locStorage.getVal("userName"),
						"role": role + "", // 0、巡查角色  1、二级单位角色  2、中队长   空是大队领导 
						"roleCode": vm.roleData.rolecode, //角色的rolecode
						"reason": "",
						"type": "0", //type 0、审核通过  1、审核不通过
						"punishId": vm.data.id,
						"title": vm.data.title, //标题
						"managerId": vm.data.managerId, //巡查经理ID
						"captainId": vm.data.captainId, //中队长ID
						"departId": vm.data.departId, //二级单位ID
						"loginDepartId":appcan.locStorage.getVal("deptId")
					}
					console.log(params);
					appcan.ajax({
						url: mainPath + "punishApiController.do?aduitPunish",
						type: "POST",
						dataType: "json",
						contentType: "application/json",
						data: params,
						offline: false,
						success: function(res) {
							if(res.success == true) {
								appcan.window.close(1);
								appcan.window.evaluateScript({
									name: 'punish',
									scriptContent: 'vm.ResetUpScroll()' //返回主页进行刷新数据
								});
								appcan.window.evaluateScript({
									name: 'punish',
									scriptContent: 'layerToast("审核通过", 2)' //返回主页进行刷新数据
								});
								layerRemove(i);
							} else {
								layerRemove(i);
								layerToast(res.msg, 2);
							}
						},
						error: function(e) {
							layerRemove(i);
							layerToast('网络错误，请检查网络环境', 2);
						}
					})
				},
				no: function(i) {
					vm.isBtnPass = 0;
				}
			})
		})
		//驳回
		appcan.button("#punish-nopass", "btn-act", function() {
			var punishNopassData = {
				"punishID": vm.data.id,
				"role": vm.role,
				"roleCode": vm.roleData.rolecode,
				"title": vm.data.title, //标题
				"managerId": vm.data.managerId, //巡查经理ID
				"captainId": vm.data.captainId, //中队长ID
				"departId": vm.data.departId, //二级单位ID
				"type":"1"//type 0、审核通过  1、驳回   2、审核不通过
			}
			appcan.locStorage.setVal("patrol-punishNopassData", JSON.stringify(punishNopassData));
			openWindow("punish-reject", "punish-reject.html", "");
		})
		//审核不通过
		appcan.button("#punish-nopass-end", "btn-act", function() {
			var punishNopassData = {
				"punishID": vm.data.id,
				"role": vm.role,
				"roleCode": vm.roleData.rolecode,
				"title": vm.data.title, //标题
				"managerId": vm.data.managerId, //巡查经理ID
				"captainId": vm.data.captainId, //中队长ID
				"departId": vm.data.departId, //二级单位ID
				"type":"2"//type 0、审核通过  1、驳回   2、审核不通过
			}
			appcan.locStorage.setVal("patrol-punishNopassData", JSON.stringify(punishNopassData));
			openWindow("punish-reject", "punish-reject.html", "");
		})
		//对驳回的处罚单继续修改
		appcan.button("#punish-modify", "btn-act", function() {
			var data = JSON.stringify(vm.data);
			appcan.locStorage.setVal("patrol-punish-modify", data);
			openWindow("punish-add", "punish-add.html", "");
		})
	   //对于不通过的处罚单进行降级处理，降级为整改单
	   appcan.button("#punish-demotion","btn-act",function(){
	       var data = {
	           "punishId":vm.data.id,//处罚单ID
	           "title":vm.data.title,//处罚单标题
	           "content":vm.data.content,//处罚单事件概况
	           "departId":vm.data.departId,//被处罚单位ID
	           "departName":vm.data.departName,//被处罚单位名称
	           "picList":vm.data.picList//处罚单图片	           
	       }
	       appcan.locStorage.setVal('patrol-punish-demotion',data);
	       openWindow("reform-temporary", "reform-temporary.html", "");
	   })
	})
})($);