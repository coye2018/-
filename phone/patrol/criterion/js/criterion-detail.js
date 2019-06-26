Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
	el: '#Page',
	data: {
		isToInput: false,
		hasSearch: false,
		IsSearchCriterion: 0, //1=搜索列表点击过来的 0=目录点击过来的
		nonet:false,
		searchKeyword: "",
		data: {
			"title": "",
			"Catalog": "", //面包屑
			"list": []
		},
		dataListQuery: [] //过滤后的数据
	},
	methods: {
		//点击搜索按钮切换显示搜索框
		hasSearchDiv: function() {
			var that = this;
			that.hasSearch = !that.hasSearch;
		},
		//从文本标签切换到输入框
		searchToInput: function() {
			this.isToInput = true;
		},
		//从输入框切换到文本标签
		searchToText: function() {
			if(this.searchKeyword != "") return false;
			this.isToInput = false;
		},
		//清除输入框
		searchEmpty: function() {
			this.searchKeyword = '';
			this.isToInput = false;
			this.searchFilter(1);
		},
		//筛选及标红 index == 1筛选并标红 ; index == 0只标红不筛选
		searchFilter: function(index) {
			var that = this;
			if(!isDefine(that.searchKeyword)) {
				that.data.list = that.dataListQuery;
			} else {
				var listDataQuerySave = new Array();
				for(var i = 0; i < that.dataListQuery.length; i++) {
					if(index == 1) {
						if(that.dataListQuery[i].indexOf(that.searchKeyword) != -1) {
							listDataQuerySave.push(that.dataListQuery[i]);
						}
					} else {
						listDataQuerySave.push(that.dataListQuery[i]);
					}
				};
				for(var i = 0; i < listDataQuerySave.length; i++) {
					listDataQuerySave[i] = listDataQuerySave[i].replace(eval("/" + that.searchKeyword + "/g"), "<span>" + that.searchKeyword + "</span>");
				}
				that.data.list = listDataQuerySave;
			}
		}
	},
	mounted: function() {
		var that = this;
		var IsSearchCriterion = appcan.locStorage.getVal("patrol-IsSearchCriterion");
		if(IsSearchCriterion == "1") {
			that.IsSearchCriterion = 1;
		} else {
			that.IsSearchCriterion = 0;
		}
		if(that.IsSearchCriterion == 1) {
			//显示加载
			var index = layerLoading();
			appcan.locStorage.remove("patrol-IsSearchCriterion");
			var searchKeyword = appcan.locStorage.getVal("patrol-searchKeyword");
			that.searchKeyword = searchKeyword;
			that.isToInput = true;
			appcan.locStorage.remove("patrol-searchKeyword");
			var standardCatalog = appcan.locStorage.getVal("patrol-standardCatalog");
			appcan.locStorage.remove("patrol-standardCatalog");
			that.data.title = standardCatalog;
			appcan.ajax({
				url: mainPath + "catalogApiController.do?findCriterion",
				type: "GET",
				dataType: "json",
				contentType: "application/json",
				data: {
					"standardId": standardCatalog
				},
				offline: false,
				success: function(res) {
					layerRemove(index);
					if(res.success == true) {
						var list = [];
						for(var i = 0; i < res.data.length; i++) {
							list.push(res.data[i].standardDetail); 
						}
						var title;
						if(res.data[0].type == "1.0"){
							title = "服务类";
						}else if(res.data[0].type == "2.0"){
							title = "安全类";
						}else{
							title = "设备类";
						}
						var data = {
							"title": title,
							"Catalog": res.data[0].catalog, //面包屑
							"list": list
						};
						that.data = data;
						that.dataListQuery = data.list;
						that.searchFilter(0); //标红
					} else {
						layerToast(res.msg, 2);
					}
				},
				error: function(e) {
					layerRemove(index);
					that.nonet = true;
				}
			})

		} else {
			var criterionDetail = JSON.parse(appcan.locStorage.getVal("patrol-criterionDetail"));
			appcan.locStorage.remove("patrol-criterionDetail");
			var list = [];
			for(var i = 0; i < criterionDetail.info.length; i++) {
				list.push(criterionDetail.info[i].standardDetail);
			}
			var data = {
				"title": criterionDetail.TopTitle,
				"Catalog": criterionDetail.catalog, //面包屑
				"list": list
			};
			that.data = data;
			that.dataListQuery = data.list;
		}

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