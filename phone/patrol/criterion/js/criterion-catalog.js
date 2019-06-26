var vm = new Vue({
	el: '#Page',
	data: {
		title:"",//服务类/设备类/安全类
		headTitle: "", //顶部导航栏标题
		IscatalogOneShow: false, //一级目录是否显示
		IscatalogTwoShow: false, //二级目录是否显示
		IscatalogThreeShow: false, //三级目录是否显示
		IscatalogFourShow: false, //四级目录是否显示
		catalogOne: [], //一级目录列表
		catalogTwo: [], //二级目录列表
		catalogThree: [], //三级目录列表
		catalogFour: [] //四级目录列表
	},
	methods: {
		//点击目录
		getLastCata: function(item, catalog) {
			var that = this;
			//增加点中的样式
			$("." + catalog + " .lists-box").removeClass("cur");
			$("#" + item.id).addClass("cur");
			if(item.isLast == "1") { //isLast == 1 是末级，直接跳转到标准详情页面
				if(item.criterionGrade == "2") {
					that.IscatalogTwoShow = false;
					that.IscatalogThreeShow = false;
					that.IscatalogFourShow = false;
					that.catalogTwo = [];
					that.catalogThree = [];
					that.catalogFour = [];
				}
				if(item.criterionGrade == "3") {
					that.IscatalogThreeShow = false;
					that.IscatalogFourShow = false;
					that.catalogThree = [];
					that.catalogFour = [];
				}
				if(item.criterionGrade == "4") {
					that.IscatalogFourShow = false;
					that.catalogFour = [];
				}
				that.openDetail(item);
			} else { //isLast == 0 不是末级，显示下一级目录列表
				that.getCatalog(item.criterionID, item.criterionGrade, item.id + "-", item.catalog);
			}
		},
		//获取目录数据
		getCatalog: function(criterionID, index, IDpre, catalogs) {
			//var loading = layerLoading();
			var that = this;
			var params = {
				"criterionID": criterionID,
				"critrionGrade": index
			};
			console.log(params);
			appcan.ajax({
				url: mainPath + "catalogApiController.do?getCriterionCatalog",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				data: params,
				offline: false,
				success: function(res) {
					//layerRemove(loading);
					if(res.success == true) {
						for(var i = 0; i < res.data.length; i++) {
							res.data[i].id = IDpre + (i + 1); // 唯一ID
							res.data[i].catalog = catalogs + " - " + res.data[i].criterionID; //面包屑
						}
						if(index == "1") {
							that.catalogOne = res.data;
							that.IscatalogOneShow = true;
							that.IscatalogTwoShow = false;
							that.IscatalogThreeShow = false;
							that.IscatalogFourShow = false;
							that.catalogTwo = [];
							that.catalogThree = [];
							that.catalogFour = [];
						}
						if(index == "2") {
							$(".catalogTwo .lists-box").removeClass("cur");
							that.catalogTwo = res.data;
							that.IscatalogTwoShow = true;
							$(".catalogTwo").removeClass("slideInRight");
							$(".catalogTwo").addClass("slideInRight");
							that.IscatalogThreeShow = false;
							that.IscatalogFourShow = false;
							that.catalogThree = [];
							that.catalogFour = [];
						}
						if(index == "3") {
							$(".catalogThree .lists-box").removeClass("cur");
							that.catalogThree = res.data;
							that.IscatalogThreeShow = true;
							$(".catalogThree").removeClass("slideInRight");
							$(".catalogThree").addClass("slideInRight");
							that.IscatalogFourShow = false;
							that.catalogFour = [];
						}
						if(index == "4") {
							that.catalogFour = res.data;
							that.IscatalogFourShow = true;
							$(".catalogFour").removeClass("slideInRight");
							$(".catalogFour").addClass("slideInRight");
						}
					} else {
						layerToast(res.msg, 2);
					}
				},
				error: function(e) {
					//layerRemove(loading);
					layerToast('网络错误，请检查网络环境', 2);
				}
			})

		},
		//打开标准详情页面
		openDetail: function(item) {
			var that = this;
			item.TopTitle = that.title;
			//本地存储目录树ID
			appcan.locStorage.setVal("patrol-criterionDetail", JSON.stringify(item));
			//打开目录树
			openWindow("criterion-detail", "criterion-detail.html", "");
		}
	},
	mounted: function() {
		var that = this;
		//获取本地的criterionCatalogParams
		var criterionCatalogParams = JSON.parse(appcan.locStorage.getVal("patrol-criterionCatalogParams"));
		//清除本地的criterionCatalogParams
		appcan.locStorage.remove("patrol-criterionCatalogParams");
		that.title = criterionCatalogParams.title;
		//顶部标题
		that.headTitle = criterionCatalogParams.criterionID;
		//显示一级目录
		that.getCatalog(criterionCatalogParams.criterionID, criterionCatalogParams.criterionGrade, "c1-", criterionCatalogParams.criterionID);

	}
});

(function($) {
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