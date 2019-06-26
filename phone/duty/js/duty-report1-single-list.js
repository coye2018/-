// 动画方式
var aniId=0;

var vm = new Vue({
    el: '#duty_report',
    data: {
    	dutyReport:[],
    	hasimg:false,
    	hasReport:false,
    	nothing: false,
    	nonet: false,
    },
    methods: {//点击简报，查看详情
    	unclick:function(item,index){
    	    //将所有列表数据点击事件上锁，以防多次点击导致打开多个同样页面
            noClick($('li'));
    		//将简报id存入缓存，以便获取详情页
    		appcan.locStorage.setVal("dutyId",item.id);
    		var platForm=appcan.locStorage.getVal("platForm");
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-report1-single-detail','duty-report1-single-detail.html',2);
            }else{
                appcan.window.open({
                    name:'duty-report1-single-detail',
                    dataType:0,
                    data:'duty-report1-single-detail.html',
                    aniId:aniId,
                    type:1024
                });
            }
    		
    	}
    }
});



;(function($) {
    
    //是否第一次访问该页面
    var isFirst = '';
    
    // 上下拉加载
    var mescroll = new MeScroll('mescroll', {
        down: {
            auto: false
        },
        up: {
            use: true,
            auto: true,
            page: {
                num : 0, 
                size : 15
            },
            callback: loaddutyreport
        }
    });
    
    
    appcan.button("#nav-left", "btn-act", function() {
        closePage();
    });
    
    appcan.ready(function() {
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        //解锁，使值班简报列表能够点击
        appcan.window.subscribe("duty-report-click",function(e){
            yesClick($('li'));
        });
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                 closePage();
            }
        };
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            closePage();
        };
        
        
    });
    
    function closePage () {
        var closeArr=['duty-report1-add', 'duty-report1-single-list'];
        for (var i=0; i < closeArr.length; i++) {
            appcan.window.evaluateScript({
                name: closeArr[i],
                scriptContent: 'appcan.window.close(-1);'
            });
          
        };
    };
    
    //加载值班简报列表，接口为focGetDutyReportList，page是页数，size是加载的简报个数
    function loaddutyreport(page){
        
        if (page.num == 1) {
            vm.dutyReport = [];
        };
        
    	var json={
    		path:serverPath+'focBriefingController.do?focGetDutyReportList',
    		data:{
    			page: page.num,
    			size: page.size
    		},
    		layer: false
    	};
    	ajaxRequest(json,function(data,e){ //请求数据函数，data是返回的数据
    		// console.log(data);
    		if(e=="success"){
    			
    			for (var i=0; i < data.obj.length; i++){ //将回传数据中的时间戳转化为显示的时间
    			 	if(timeStemp(new Date().getTime(),'yyyy-MM-dd').date == timeStemp(data.obj[i].create_time,'yyyy-MM-dd').date){
    			 		vm.hasReport=true;
    			 	}	
    				data.obj[i].create_time=timeStemp(data.obj[i].create_time,'MM-dd HH:mm').commonDate;
    				data.obj[i].title=unescape(data.obj[i].title);
    				if(isDefine(data.obj[i].imgURL)){
    				    data.obj[i].imgURL=serverPath+data.obj[i].imgURL;
    				}else{
    				    data.obj[i].imgURL="";
    				}
    			};
    			if(isDefine(data.obj)){
				    vm.dutyReport=vm.dutyReport.concat(data.obj);
    			}
    			
    			if(!isDefine(vm.dutyReport)){
                    $("#reportNothing").removeClass("hide");
                }else{
                    $("#reportNothing").addClass("hide");
                }
                
                if (data.obj.length == 0 && page.num == 1) {
                    vm.nothing = true;
                }
                mescroll.endSuccess(data.obj.length);
                
    		} else {
    		    if (page.num == 1) {
                    vm.nonet = true;
                }
    		    mescroll.endErr();
    		}
    	});
    };
    
    //引导遮罩的动画效果
    function animateShade(){
        var act = 'actives';
        
        ModalHelper.afterOpen();
        $('.shade').removeClass('shade-hide');
        setTimeout(function(){
            $('.dure-shade-1').addClass(act);
        }, 200);
        setTimeout(function(){
            $('.dure-shade-2').addClass(act);
        }, 1000);
        setTimeout(function(){
            $('.dure-shade-3').addClass(act);
        }, 2000);
    }
    
    //点击遮罩, 隐藏且不再出现
    $('.dure-shade-3').on('click', function(e){
        e.stopPropagation();
        
        ModalHelper.beforeClose();
        $('.shade').addClass('shade-hide');
        appcan.locStorage.setVal('isFirst-dutyReport', '1');
        return false;
    });
    
})($);
