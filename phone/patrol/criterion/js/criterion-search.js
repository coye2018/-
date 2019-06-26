var vm = new Vue({
	el: '#Page',
	data: {
		searchKeyword: "", //关键字
		hideSarchKeyword:"",//搜索关键字
		isShowHistory: true, //是否显示历史记录
		searchHistory: [], //历史记录数据
		nonet: false, //无网络
		isMescroll: 0,//分页插件是否已初始化 1=已初始化 0=未初始化
		list: [] //搜索列表数据
	},
	computed: {
		//计算搜索框右侧的X图标是否显示
		hasDelBtn: function() {
			var that = this;
			if(that.searchKeyword.length > 0) {
				return true;
			} else {
				return false;
			}
		}
	},
	methods: {
		//点击搜索框右侧的X图标
		searchEmpty: function() {
			//清除输入框
			this.searchKeyword = "";
		},
		//从本地存储获取历史记录并显示
		getHistory: function() {
			var that = this;
			var History = appcan.locStorage.getVal("patrol-searchHistory");
			var searchHistory = [];
			if(isDefine(History)) {
				searchHistory = History.split(",");
			}
			that.searchHistory = searchHistory;
		},
		//搜索
		search: function() {
			var that = this;
			if(that.searchKeyword == "") {
				layerToast("请输入关键字搜索", 2);
				return;
			}
			//将搜索的数据存在本地
			that.setHistory();
			that.isShowHistory = false;
			that.hideSarchKeyword = that.searchKeyword;
			if(that.isMescroll == 0) {
				that.initMescroll();
			} else {
				that.list = [];
				that.mescroll.resetUpScroll();
			}

		},
		//将搜索的数据存在本地
		setHistory: function() {
			var that = this;
			for(var i = 0; i < that.searchHistory.length; i++) {
				if(that.searchKeyword == that.searchHistory[i]) {
					that.searchHistory.splice(i, 1);
				}
			}
			that.searchHistory.unshift(that.searchKeyword);
			appcan.locStorage.setVal("patrol-searchHistory", that.searchHistory.join(","))
		},
		//清除历史记录
		clearHistory: function() {
			var that = this;
			addConfirm({
				content: '确定清空历史搜索吗？',
				yes: function(i) {
					appcan.locStorage.remove("patrol-searchHistory");
					that.searchHistory = [];
					layerRemove(i);
				}
			})
		},
		//点击历史记录进行搜索
		searchHistroy: function(searchHistory) {
			var that = this;
			that.searchKeyword = searchHistory;
			that.search();
		},
		//初始化分页方法
		initMescroll: function() {
			var that = this;
			that.isMescroll = 1;
			//分页初始化
			that.mescroll = new MeScroll("mescroll", {
				down: {
					auto: true
				},
				up: {
					callback: that.upCallback, //上拉回调
					page: {
						size: 15
					},
					empty: { //配置列表无任何数据的提示
						warpId: "list",
						icon: "../img/nothing.png",
						tip: ""
					}
				}
			});
		},
		//上拉回调
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
			var params = {
				"keyword": appcan.trim(that.hideSarchKeyword),
				"page": pageNum + "", //String类型
				"pageSize": pageSize + "" //String类型
			}
			appcan.ajax({
				url: mainPath + "catalogApiController.do?searchCriterion",
				type: "POST",
				dataType: "json",
				contentType: "application/json",
				data: params,
				offline: false,
				success: function(res) {
					if(res.success == true) {
						//关键字标红
						var searchKeyword = appcan.trim(that.hideSarchKeyword);
						for(var i = 0; i < res.data.list.length; i++) {
							res.data.list[i].standardDetail = res.data.list[i].standardDetail.replace(eval("/" + searchKeyword + "/g"), "<span>" + searchKeyword + "</span>");
						}
						successCallback && successCallback(res.data.list, res.data.total);
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
		//打开标准详情页面
		openDetail: function(standardCatalog) {
			var that = this;
			//本地存储是否查询跳转到详情
			appcan.locStorage.setVal("patrol-IsSearchCriterion", "1");
			//本地存储搜索关键字
			appcan.locStorage.setVal("patrol-searchKeyword", that.hideSarchKeyword);
			//本地存储目录树ID
			appcan.locStorage.setVal("patrol-standardCatalog", standardCatalog);
			//打开标准详情页面
			openWindow("criterion-detail", "criterion-detail.html", "");
		}
	},
	mounted: function() {
		var that = this;
		//显示历史搜索记录
		that.getHistory();

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