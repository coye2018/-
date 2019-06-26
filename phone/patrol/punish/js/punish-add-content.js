var vm = new Vue({
	el: '#Page',
	data: {
		path: mainPath,
		params: {
			id: "",
			role: "", //角色0、表示巡查角色  1、二级单位角色   不传表示大队领导角色
			roleData: "", //角色的数据 角色的ID 角色的rolecode 角色的rolename
			userId: appcan.locStorage.getVal("userID"), //用户ID
			userName: appcan.locStorage.getVal("userName"), //用户名
			title: "", //标题
			time: getNowFormatDate(), //巡查时间
			content: "", //事件概况
			reason: "", //原因分析
			conclusion: "", //事件结论
			proposal: "", //处罚建议
			departId: "", //被处罚部门ID
			departName: "", //被处罚部门名称
			departCopy: [], //抄送部门
			departCopyName: "",//抄送部门名称
			copyUserIds:"",//抄送人
			copyUserNames:"",//抄送人名称
			picList: [] //图片列表
		},
		isDistribute: 0, //0=可以点击提交，1=不可以点击提交 ；目的为了不可以重复点击提交按钮
		isModify: 0, //0=新增 1=修改		
		isUpPunish: 0, //从整改单升级还是处罚单模块直接新增 1=从整改单升级
		reformId: "", //整改单ID
		peoplepick:""//选择抄送人的数据
	},
	methods: {
		//弹出底部对话框
		uploadPic: function() {
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
		addPic: function() {
			var that = this;
			//显示加载效果
			var index = layerLoading();
			var param = {
				min: 1,
				max: 3, //最大上传图片
				quality: 0.5, //JPG压缩质量
				detailedInfo: true
			}
			var picNum = that.params.picList.length;
			param.max = 3 - picNum; //减去已经上传图片的数量
			//打开图片相册
			uexImage.openPicker(param, function(err, info) {
				if(err == 0) { //成功						
					//将图片上传到服务器
					var arr = info.data
					var uploadParam = {
						serverUrl: mainPath + "uploadFileApi.do?uploadFile",
						filePath: arr,
						quality: 3
					}
					appcan.plugInUploaderMgr.upload(uploadParam, function(e) {
						if(e.status == 1) { //上传成功							
							that.params.picList = that.params.picList.concat(e.picArray);
							//移除加载
							layerRemove(index);
							layerToast("图片上传成功", 2);
							that.isDistribute = 0;
						} else if(e.status == 3) { //上传中
							that.isDistribute = 1;
						} else { //上传失败
							//移除加载
							layerRemove(index);
							layerToast("图片上传失败", 2);
							that.isDistribute = 0;
						}
					})

				} else if(err == -1) { //点击取消而关闭
					//移除加载
					layerRemove(index);
				} else {
					//移除加载
					layerRemove(index);
				}

			});
		},
		//拍照上传
		addCameraPic: function() {
			var that = this;
			uexCamera.open(0, 40, function(filePath) {
				var arr = [filePath];
				var uploadParam = {
					serverUrl: mainPath + "uploadFileApi.do?uploadFile",
					filePath: arr,
					quality: 3
				}
				var index = layerLoading();
				appcan.plugInUploaderMgr.upload(uploadParam, function(e) {
					if(e.status == 1) { //上传成功							
						that.params.picList = that.params.picList.concat(e.picArray);
						//移除加载
						layerRemove(index);
						layerToast("图片上传成功", 2);
						that.isDistribute = 0;
					} else if(e.status == 3) { //上传中						
						that.isDistribute = 1;
					} else { //上传失败
						//移除加载
						layerRemove(index);
						layerToast("图片上传失败", 2);
						that.isDistribute = 0;
					}
				})
			});
		},
		//删除图片
		delPic: function(index) {
			var that = this;
			that.params.picList.splice(index, 1);
		},
		//打开图片全屏浏览
		openPic: function(index) {
			var that = this;
			var picListData = [];
			for(var i = 0; i < that.params.picList.length; i++) {
				picListData.push(that.path + that.params.picList[i]);
			}
			picView(index, picListData);

		},
		//打开选择抄送人页面
		chooseDep: function(index) {
			var that = this;
			if(index == "0") {
			    if(that.isUpPunish == 1) return;//从整改单升级为处罚单的，不能更改处罚单位
			    appcan.locStorage.setVal('patrol-chooseDepartName', that.params.departName);
				openWindow('patrol-choose-departname', 'patrol-choose-departname.html');
			} else {
				appcan.locStorage.setVal('address-pick-from', 'patrol-copy');
				appcan.locStorage.setVal('peoplepick_3', vm.peoplepick);
				openWindow('address-pick','../address/address-pick.html')
			}

		},
		//提交
		addPunish: function() {
			addPunish();
		}
	},
	computed: {
		//图片上传三张上传按钮隐藏
		hidePic: function() {
			var that = this;
			if(that.params.picList.length >= 3) {
				return 0;
			} else {
				return 1;
			}
		}
	},
	mounted: function() {
		var that = this;
		//判断是修改还是新增
		var punishModify = appcan.locStorage.getVal("patrol-punish-modify");
		if(isDefine(punishModify)) {
			//修改
			that.isModify = 1;
			var json = JSON.parse(punishModify);
			appcan.locStorage.remove("patrol-punish-modify");
			that.params.id = json.id;
			that.params.userId = json.managerId;
			that.params.userName = json.managerName;
			that.params.title = json.title;
			that.params.time = json.createDate.substring(0, 16);
			that.params.content = json.content;
			that.params.reason = json.reason;
			that.params.conclusion = json.conclusion;
			that.params.proposal = json.proposal;
			that.params.departId = json.departId;
			that.params.departName = json.departName;
			that.params.departCopy = json.copydeparttList;
			that.params.departCopyName = json.copydepartText;
			if(json.picList != null) {
				that.params.picList = json.picList;
			} else {
				that.params.picList = [];
			}
			appcan.locStorage.setVal('patrol-chooseDepartName', json.departName);
		} else {
			//新增
			that.isModify = 0;
			//判断是从整改单升级还是处罚单模块直接新增
			var isUpPunish = appcan.locStorage.getVal("patrol-upPunish");
			if(isDefine(isUpPunish)) {
				//从整改单升级
				that.isUpPunish = 1;
				var json = JSON.parse(isUpPunish);
				that.params.title = json.title;
				that.params.content = json.described;
				that.reformId = json.reformId;
				that.params.departId = json.departId;
				that.params.departName = json.departName;
				appcan.locStorage.remove("patrol-upPunish");
			} else {
				that.isUpPunish = 0;
			}
		}
	}
});

(function($) {
	appcan.ready(function() {
		//接收改变部门发来的通道
		appcan.window.subscribe('patrol-chooseVal', function(msg) {
			var json = JSON.parse(msg)
			vm.params.departId = json.departId;
			vm.params.departName = json.departName;
		});

		//接收改变抄送部门发来的通道
		appcan.window.subscribe('patrol-choose-depart', function(msg) {
			var json = JSON.parse(msg);
			vm.params.departCopy = json.data;
			if(json.data.length > 1) {
				vm.params.departCopyName = json.data[0].departName + " 等" + json.data.length + "个单位";
			} else {
				vm.params.departCopyName = json.data[0].departName;
			}
		});
		
		//接收改变抄送人发来的通道
		appcan.window.subscribe('patrol-copy-from-address-pick', function(msg){
            var pcJson = JSON.parse(msg);
            vm.peoplepick = msg;
			var peopleCopyArr = [];
			for(var i=0;i<pcJson.length;i++){
				peopleCopyArr.push(pcJson[i].id);
			}
			vm.params.copyUserIds = peopleCopyArr.join(',');
			if(pcJson.length>1){
				vm.params.copyUserNames = pcJson[0].name + ' 等'+pcJson.length+'人';
			}else{
				vm.params.copyUserNames = pcJson[0].name;
			}
        });

	})

})($);

//提交
function addPunish() {
	//非空校验
	if(vm.params.title == "") {
		layerToast("请输入处罚单的标题", 2);
		return;
	}
	if(vm.params.title.length > 32) {
		layerToast("处罚单的标题字数超过限制了", 2);
		return;
	}
	if(vm.params.content == "") {
		layerToast("请输入事件概况", 2);
		return;
	}
	if(vm.params.reason == "") {
		layerToast("请输入原因分析", 2);
		return;
	}
	if(vm.params.proposal == "") {
		layerToast("请输入处罚建议", 2);
		return;
	}
	if(vm.params.conclusion == "") {
		layerToast("请输入事件结论", 2);
		return;
	}
	if(vm.params.departId == "") {
		layerToast("请选择被处罚单位", 2);
		return;
	}
	// if(vm.params.departCopy.length == 0) {
		// layerToast("请选择抄送单位", 2);
		// return;
	// }
	//设置按钮不可重复点击
	if(vm.isDistribute == 1) return;
	var index = layerLoading();
	vm.isDistribute = 1; //设置为不可以提交
	//抄送部门
	var departCopyArr = [];
	for(var i = 0; i < vm.params.departCopy.length; i++) {
		departCopyArr.push(vm.params.departCopy[i].departId);
	}
	var departIdList = departCopyArr.toString();

	if(vm.isModify == 0) {
		//新增
		getRoleForPunish(function(data, e) {
			if(e == "success") {
				vm.params.roleData = data.data;
				if(data.role == 0) {
					vm.params.role = "0";
				} else if(data.role == 1) {
					vm.params.role = "2";
				} else if(data.role == 3) {
					vm.params.role = "";
				}
				var params = {
					userId: vm.params.userId, //用户ID
					userName: vm.params.userName, //用户名
					title: vm.params.title, //标题
					content: vm.params.content, //事件概况
					reason: vm.params.reason, //原因分析
					conclusion: vm.params.conclusion, //事件结论
					proposal: vm.params.proposal, //处罚建议
					departId: vm.params.departId, //被处罚部门ID
					copydepart: vm.params.copyUserIds, //抄送部门/ /copyUserIds:vm.params.copyUserIds,
					picList: vm.params.picList, //图片list
					role: vm.params.role, //角色
					roleCode: vm.params.roleData.rolecode, //角色的rolecole
					reformId: vm.reformId, //整改单ID
					loginDepartId:appcan.locStorage.getVal("deptId")
				}
				console.log(params);
				appcan.ajax({
					url: mainPath + "punishApiController.do?createPunish",
					type: "POST",
					dataType: "json",
					contentType: "application/json",
					data: params,
					offline: false,
					success: function(res) {
						vm.isDistribute = 0
						layerRemove(index);
						if(res.success == true) {
							if(vm.isUpPunish == 0) {
								appcan.window.evaluateScript({
									name: 'punish-add',
									scriptContent: 'appcan.window.close(1)' //返回上一页
								});
								appcan.window.evaluateScript({
									name: 'punish',
									scriptContent: 'vm.ResetUpScroll()' //返回主页进行刷新数据
								});
								appcan.window.evaluateScript({
									name: 'punish',
									scriptContent: "layerToast('处罚单提交成功', 2)" //返回主页进行提示
								});
							} else {
								closeMultiPages(['punish-add', 'reform-rectification-details']);
								//建立通道返回整改单列表进行提示，并更新列表
								appcan.window.publish("patrol-alertSuccess", "0");
							}

						} else {
							layerToast(res.msg, 2);
						}
					},
					error: function(e) {
						layerRemove(index);
						vm.isDistribute = 0
						layerToast('网络错误，请检查网络环境', 2);
					}
				})

			} else {
				layerToast('网络错误，请检查网络环境', 2);
			}
		})
	} else {
		//修改
		getRoleForPunish(function(data, e) {
			if(e == "success") {
				vm.params.roleData = data.data;
				if(data.role == 0) {
					vm.params.role = "0";
				} else if(data.role == 1) {
					vm.params.role = "2";
				} else if(data.role == 3) {
					vm.params.role = "";
				}
				var params = {
					punishId: vm.params.id, //处罚单ID
					userId: vm.params.userId, //用户ID
					userName: vm.params.userName, //用户名
					title: vm.params.title, //标题
					content: vm.params.content, //事件概况
					reason: vm.params.reason, //原因分析
					conclusion: vm.params.conclusion, //事件结论
					proposal: vm.params.proposal, //处罚建议
					departId: vm.params.departId, //被处罚部门ID
					copydepart: departIdList, //抄送部门
					picList: vm.params.picList, //图片list
					role: vm.params.role, //角色
					roleCode: vm.params.roleData.rolecode, //角色的rolecole
					loginDepartId:appcan.locStorage.getVal("deptId")
				}
				console.log(params);
				appcan.ajax({
					url: mainPath + "punishApiController.do?modifyPunish",
					type: "POST",
					dataType: "json",
					contentType: "application/json",
					data: params,
					offline: false,
					success: function(res) {
						vm.isDistribute = 0
						layerRemove(index);
						if(res.success == true) {
							closeMultiPages(['punish-add', 'punish-detail']);
							appcan.window.evaluateScript({
								name: 'punish',
								scriptContent: 'vm.ResetUpScroll()' //返回主页进行刷新数据
							});
							appcan.window.evaluateScript({
								name: 'punish',
								scriptContent: "layerToast('处罚单修改成功', 2)" //返回主页进行提示
							});
						} else {
							layerToast(res.msg, 2);
						}
					},
					error: function(e) {
						layerRemove(index);
						vm.isDistribute = 0
						layerToast('网络错误，请检查网络环境', 2);
					}
				})
			} else {
				layerToast('网络错误，请检查网络环境', 2);
			}
		})
	}

}