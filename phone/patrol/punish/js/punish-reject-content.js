var vm = new Vue({
	el: '#Page',
	data: {
		reason: '',
		id: '',
		role: "",
		roleCode: "",
		title: "",
		managerId: "",
		captainId: "",
		departId: "",
		type:"",//type 0、审核通过  1、驳回   2、审核不通过
		isClick:0//1=不可点击
	},
	mounted: function() {
		var that = this;
		var punishNopassData = appcan.locStorage.getVal("patrol-punishNopassData");
		appcan.locStorage.remove("patrol-punishNopassData");
		var json = JSON.parse(punishNopassData);
		that.id = json.punishID;
		that.role = json.role;
		that.roleCode = json.roleCode;
		that.title = json.title; //标题
		that.managerId = json.managerId; //巡查经理ID
		that.captainId = json.captainId; //中队长ID
		that.departId = json.departId; //二级单位ID
		that.type = json.type;

	}
});
(function($) {
	appcan.button("#nav-left", "btn-act", function() {
		appcan.window.close(1);
	});
	appcan.button("#nav-right", "btn-act", function() {
		appcan.window.close(1);
	});

	appcan.ready(function() {
		appcan.window.subscribe('patrol-punish-reject-sure', function() {
			if(vm.isClick == 1) return;
			var totastext = '请输入驳回理由';
			if(vm.type == '2'){
			    totastext = '请输入审核不通过理由';
			}
			if(!isDefine(vm.reason)) {
				layerToast(totastext, 2);
				return;
			}
			var role; //0=巡查经理 1=其他二级部门角色 2=中队长 3=副大队长					
			if(vm.role == 3) {
				role = ""
			} else {
				role = vm.role;
			}
			var index = layerLoading();
			vm.isClick = 1;
			var params = {
				"userId": appcan.locStorage.getVal("userID"),
				"userName": appcan.locStorage.getVal("userName"),
				"reason": vm.reason,
				"role": role + "", // 0、巡查角色  1、二级单位角色  2、中队长   空是大队领导 
				"roleCode": vm.roleCode,
				"type": vm.type, //type 0、审核通过  1、驳回   2、审核不通过
				"punishId": vm.id,
				"title": vm.title, //标题
				"managerId": vm.managerId, //巡查经理ID
				"captainId": vm.captainId, //中队长ID
				"departId": vm.departId, //二级单位ID
				"loginDepartId":appcan.locStorage.getVal("deptId")
			}
			var toasttext = "成功驳回";
			if(vm.type == "1"){
				toasttext = "成功驳回";
			}else{
				toasttext = "审核不通过";
			}
			appcan.ajax({
				url: mainPath + "punishApiController.do?aduitPunish",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				data: params,
				offline: false,
				success: function(res) {
					vm.isClick = 0;
					if(res.success == true) {						
						closeMultiPages(["punish-detail", "punish-reject"]);
						appcan.window.evaluateScript({
							name: 'punish',
							scriptContent: 'vm.ResetUpScroll()' //返回主页进行刷新数据
						});
						appcan.window.evaluateScript({
							name: 'punish',
							scriptContent: 'layerToast("'+ toasttext  +'", 2);' //返回主                         页进行刷新数据
						});
						layerRemove(index);
					} else {
						layerRemove(index);
						layerToast(res.msg, 2);
					}
				},
				error: function(e) {
					vm.isClick = 0;
					layerRemove(index);
					layerToast('网络错误，请检查网络环境', 2);
				}
			})

		})
	});
})($);