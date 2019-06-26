var vm = new Vue({
	el: '#Page',
	data: {
		items: [],
		num: 0,
		none: false
	},
	methods: {
		select: function(item) {
			var that = this;
			if(item.active) {
				for(var i = 0; i < that.items.length; i++) {
					if(that.items[i].departId == item.departId) {
						that.items[i].active = false;
					}
				}
			} else {
				for(var i = 0; i < that.items.length; i++) {
					if(that.items[i].departId == item.departId) {
						that.items[i].active = true;
					}
				}
			}
		},
		//点击确定
		chooseDepart: function() {
			var that = this;
			if(that.num == 0) {
				layerToast("请至少选择一个单位", 2);
			} else {
				var arr = [];
				for(var i = 0; i < that.items.length; i++) {
					if(that.items[i].active) {
						arr.push(that.items[i]);
					}
				}
				var json = {
					data:arr
				}
				appcan.window.publish('patrol-choose-depart', json);
				appcan.window.close(1);
			}
		}
	},
	computed: {
		chooseNum: function() {
			var that = this;
			var num = 0;
			for(var i = 0; i < that.items.length; i++) {
				if(that.items[i].active) {
					num++;
				}
			}
			that.num = num;
			if(num == 0) {
				return "";
			} else {
				return "(" + num + ")";
			}
		}
	},
	mounted: function() {
		var multi = appcan.locStorage.getVal('patrol-choose-depart-multi');
		appcan.locStorage.remove('patrol-choose-depart-multi');
		var arr = [];
		if(multi == "{}") {
			arr = [];
		}else{
			arr = JSON.parse(multi).data;
		}
		var that = this;
		var json = {
			path: mainPath + "commonApiController.do?getAllDepartment",
			data: {
			    "loginDepartId":appcan.locStorage.getVal("deptId")
			},
			layer: false
		};
		ajaxPOST(json, function(data, e) {
			if(e == "success") {
				for(var i = 0; i < data.data.length; i++) {
					data.data[i].active = false;
					for(var j = 0; j < arr.length; j++) {
						if(data.data[i].departId == arr[j].departId) {
							data.data[i].active = true;
						} else {

						}
					}
				}
				that.items = data.data;
			} else {
				that.none = true
			}
		})
	}
});
(function($) {
	appcan.ready(function() {
		appcan.button('#nav-left', 'btn-act', function() {
			appcan.window.close(1);
		});

	})
})($)