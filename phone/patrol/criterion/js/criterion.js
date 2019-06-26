(function($) {
	var vm = new Vue({
		el: '#Page',
		data: {
			tab: 0, //0=服务类 1=安全类 2=设备类
			nonet: false, //网络状态
			sericeNothing: false, //服务类是否有数据
			securityNothing: false, //安全类是否有数据
			equipmentNothing: false, //设备类是否有数据
			data: {
				"serviceTotal": 0, //服务类总数
				"securityTotal": 0, //安全类总数
				"equipmentTotal": 0, //设备类总数
				"service": [], //服务类一级类目列表
				"security": [], //安全类一级类目列表
				"equipment": [] //设备类一级类目列表
			}
		},
		methods: {
			//切换TAB
			changeTab: function(index) {
				var that = this;
				that.tab = index;
			},
			//打开目录树页面
			openDetail: function(criterionID, criterionGrade, titleNo, isLast, item) {
				var title = "";
				if(titleNo == "1") {
					title = "服务类";
				} else if(titleNo == "2") {
					title = "安全类";
				} else {
					title = "设备类";
				}
				if(isLast == "0") {
					//本地存储criterionCatalogParams
					var criterionCatalogParams = {
						"title": title,
						"criterionID": criterionID,
						"criterionGrade": criterionGrade
					}
					appcan.locStorage.setVal("patrol-criterionCatalogParams", JSON.stringify(criterionCatalogParams));
					//打开目录树
					openWindow("criterion-catalog", "criterion-catalog.html", "");
				} else {
					item.TopTitle = title;
					item.catalog = item.title;
					//本地存储目录树ID
					appcan.locStorage.setVal("patrol-criterionDetail", JSON.stringify(item));
					//打开目录树
					openWindow("criterion-detail", "criterion-detail.html", "");
				}

			}
		},
		mounted: function() {
			var that = this;
			var json = {
				path: mainPath + "catalogApiController.do?getCriterionList",
				data: {},
				layer: true,
				layerErr: false
			};
			ajaxRequest(json, function(data, e) {
				if(e == "success") {
					that.data = data.data;
					if(data.data.service.length == 0) {
						that.sericeNothing = true;
					}
					if(data.data.security.length == 0) {
						that.securityNothing = true;
					}
					if(data.data.equipment.length == 0) {
						that.equipmentNothing = true;
					}
				} else {
					that.nonet = true;
				}

			})
		}
	});

	appcan.ready(function() {
		//返回
		appcan.button("#nav-left", "btn-act", function() {
			appcan.window.close(1);
		});
		//打开搜索页面
		appcan.button("#nav-right", "btn-act", function() {
			openWindow("criterion-search", "criterion-search.html", "");
		});
	})
})($);