var platForm = appcan.locStorage.getVal("platForm");

//国内
var app = new Vue({
    el: "#national",
    data: {
        hotCity: [],
        letterList: [],
        cityList: [],
        idex:'',
        fastFindText: '',
        indexElement: null,
        ffFlag: false
    },
    methods: {
      chooseCity: function (cityName, cityCode) {
        	var status=appcan.locStorage.getVal("status");
            appcan.window.publish('planceCitySearchWord', JSON.stringify({
            	status:status,
                cityName: cityName,
                cityCode: cityCode
            }));    
            appcan.window.close(1);
        },
      fastFind: function(){
        //滑动右侧序列快速分类找
        var point = event.changedTouches ? event.changedTouches[0] : event,
            pointElement = document.elementFromPoint(point.pageX, point.pageY),
            parentElement =  document.querySelectorAll('.address-index-box')[0];
        //非当前项去除样式
        if(this.indexElement){
            this.indexElement.classList.remove('active');
            this.indexElement = null;
        }
        //根据触摸对应序列字母, 显示序列名
        if(pointElement && pointElement.parentNode.parentNode==parentElement){
            var group = pointElement.innerText,
                groupFull = pointElement.dataset.index;
            
            this.indexElement = pointElement;
            // if(group && group.replace(/[^\x00-\xff]/g,'**').length<=4){
                // this.fastFindText = group;
            // }
        }
        
        //定位
        var groupEl = document.querySelector('[data-index="' + groupFull + '"]');
        if(!groupEl) return;
        var scrolltop=document.querySelector('#sub-header-top').offsetHeight;   
        document.querySelector('.national-list').scrollTop= (platForm=='1'?groupEl.offsetTop:groupEl.offsetTop-15)+scrolltop;
        
        //样式改变
        pointElement.classList.add('active');
         this.ffFlag = true;
         this.scrollSet(true);
    },
      fastFindEnd: function(){
        //退出滑动序列
        this.fastFindText = '';
        this.ffFlag = true;
        if(this.indexElement){
            this.indexElement.classList.remove('active');
            this.indexElement = null;
        }
    },
      scrollSet: function(f){

            var that = this,
                box = document.getElementsByClassName('lis'),
                scrolltop=document.querySelector('#sub-header-top').offsetHeight,
                top = Math.abs(document.getElementsByClassName('national-list')[0].scrollTop-scrolltop),
                fas = document.querySelectorAll('.address-index-box li');
				//console.log(top)
            if(this.indexElement != null){
                this.indexElement.classList.remove('active');
                this.indexElement = null;
            }
            for(var b=0; b<box.length; b++){
                if((box[b].offsetTop-50<=top&&b+1<box.length && box[b+1].offsetTop-50>= top)||b+1==box.length){
                    that.indexElement = fas[b];
                    that.indexElement.classList.add('active');
                    break;
                }
            }
       }
    }
});

//国际
var app_inter = new Vue({
    el: "#international",
    data: {
        hotCity: [],
        letterList: [],
        cityList: []
    },
    methods: {
        chooseCity: function (cityName, cityCode) {
        	var status=appcan.locStorage.getVal("status");
            appcan.window.publish('planceCitySearchWord1', JSON.stringify({
            	status:status,
                cityName: cityName,
                cityCode: cityCode
            }));
            appcan.window.close(1);
        }
    }
});
//获取本地城市数据 
var app_citySearch = null;
app.hotCity = hotCity;
app_inter.hotCity = inter_hotCity;
for (var i in cityList) {
    app.letterList.push(i);
    for (var j = 0; j < cityList[i].length; j++) {
        cityList[i][j].cityCode = cityList[i][j].data.split("|")[3].split(",")[0];
        cityList[i][j].pinyinName = cityList[i][j].data.split("|")[0];
    }
    app.cityList.push(cityList[i]);
}
for (var m in inter_cityList) {
    app_inter.letterList.push(m);
    for (n = 0; n < inter_cityList[m].length; n++) {
        inter_cityList[m][n].cityCode = inter_cityList[m][n].data.split("|")[1].split("(")[1].replace(/\)/g, "");
        inter_cityList[m][n].pinyinName = inter_cityList[m][n].data.split("|")[0];
    }
    app_inter.cityList.push(inter_cityList[m]);
}


(function($){
//国内国际切换     
     $('.tab-pill-box').on('click', '.tab-pill-text', function(e){
        var that = $(this),
            idx = that.index(),     
            clsa = 'actives';
            app.idex=idx;
        that.addClass(clsa).siblings().removeClass(clsa);
        if (idx == 0) {
        $("#international").hide();
        $("#national").show();
    	}
    else if (idx == 1) {
        $("#national").hide();
        $("#international").show();
    }  
    }); 
    
   appcan.ready(function () {
    appcan.button("#nav-left", "btn-act",
        function () {
            appcan.window.close(1);
        });
    $("#nav-right>.ub-img1").click(showSearchPanel);
    
    // 城市定位
      uexBaiduMap.open(0,2, 2, 2,"116.309","39.977", function(){
              uexBaiduMap.hideMap();
              uexBaiduMap.getCurrentLocation(function(error,data){
                  var json={
                            longitude: data.longitude,
                            latitude: data.latitude
                        };          
                uexBaiduMap.reverseGeocode(json, function(error,data) {
                    $("#locationCity").text(data.city);
                    uexBaiduMap.close();
                });
              })
        });
});
})($)

function showSearchPanel() {
    
    $("#search").show();
    app_citySearch = new Vue({
        el: "#search",
        data: {
            resultList: [],
            isFocus:true
        },
        directives: {
		  	focus: {
		  		// 当绑定元素插入到 DOM 中。
		  		inserted: function (el) {
		        // 聚焦元素
		        el.focus()
		      }
		    }
	   },
        methods: {
            chooseCity: function (cityName, cityCode) {
            	var status=appcan.locStorage.getVal("status");
            	 //国内
	            appcan.window.publish('planceCitySearchWord', JSON.stringify({
	            	status:status,
	                cityName: cityName,
	                cityCode: cityCode
	            }));
                //国际
                appcan.window.publish('planceCitySearchWord1', JSON.stringify({
                	status:status,
	                cityName: cityName,
	                cityCode: cityCode
            }));
            
                appcan.window.close(-1);
            }
        }
    });
    $("#Scrollbox").click(function(){
        $("#search").hide();
        $("#Page").show();
    })
    $("#close").click(function () {
        app_citySearch = null;
        $("#search").hide();
        $("#Page").show();
    })
}

function search(text) {
    
    $("#Page").hide();
    $("#Scrollbox").css("background-color", "rgba(255,255,255,1)");
    if (text === "") {
        app_citySearch.cityList = [];
        return;
    }
    var resultList = [], citys = {}, code = "", pinyin = "", name = "", flag = false;
    text = text.toUpperCase();
    if (Number(app.idex) ===0) {
        citys = cityList;
    }
    else {
        citys = inter_cityList;
    }
    //拼音||英文||机场三字码搜索
    outer:
    for (var i in citys) {
        inner:
        for (var m = 0; m < citys[i].length; m++) {
            code = citys === cityList ? citys[i][m].data.split("|")[3].toUpperCase() : "";
            pinyin = citys[i][m].data.split("|")[0].toUpperCase();
            name = citys[i][m].display;
            // 拼音||英文
            for (var n = 0; n < text.length - 1; n++) {
                if (pinyin.indexOf(text[n + 1], n) > pinyin.indexOf(text[n], n - 1) && pinyin.indexOf(text[n]) > -1) {
                    flag = true;
                }
                else {
                    flag = false;
                    break;
                }
            }
            // 三字码
            if (!flag) {
                for (var j = 0; j < text.length - 1; j++) {
                    if (code.indexOf(text[j + 1], j) > code.indexOf(text[j], j - 1) && code.indexOf(text[j]) > -1) {
                        flag = true;
                    }
                    else {
                        flag = false;
                        break;
                    }
                }
            }
            // 中文名
            if (!flag) {
                if (name.indexOf(text) > -1) {
                    flag = true;
                }
            }
            if (flag) {
                resultList.push({
                    cityName: name,
                    cityCode: code
                })
            }
            if (resultList.length === 10) {
                break outer;
            }
        }
    }
    app_citySearch.resultList = resultList;
}




