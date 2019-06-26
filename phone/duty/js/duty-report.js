// 动画方式
var aniId=0;

var vm = new Vue({
    el: '#duty_report',
    data: {
    	dutyReport:[],
    	hasimg:false,
    	hasReport:false
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
                appcan.window.open('duty-report-detail','duty-report-detail.html',2);
            }else{
                appcan.window.open({
                    name:'duty-report-detail',
                    dataType:0,
                    data:'duty-report-detail.html',
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
                size : 10
            },
            callback: loaddutyreport
        }
    });
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-add", "btn-act", function() {
        var platFormC = appcan.locStorage.getVal("platForm");
    	if(!vm.hasReport){
            //Android
            if(platFormC == "1"){
                appcan.window.open('duty-report-add', 'duty-report-add.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-report-add',
                    dataType:0,
                    data:'duty-report-add.html',
                    aniId:aniId,
                    type:1024
                });
            }
    	}
    });
    
    appcan.button("#nav-table", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        //Android
        if(platForm=="1"){
            appcan.window.open('duty-report-table', 'duty-report-table.html', 2);
        }else{
            appcan.window.open({
                name:'duty-report-table',
                dataType:0,
                data:'duty-report-table.html',
                aniId:aniId,
                type:1024
            });
        }
    });
    
    appcan.ready(function() {
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        appcan.window.subscribe("relaodDutyDetailData",function(msg){
             mescroll.resetUpScroll(true);
        });
        
        appcan.window.subscribe("reloadreportlist",function(msg){
            mescroll.resetUpScroll(true);
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
        //解锁，使值班简报列表能够点击
        appcan.window.subscribe("duty-report-click",function(e){
            yesClick($('li'));
        });
        
    });
    
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
                
                //如果是第一次访问
                isFirst = appcan.locStorage.getVal('isFirst-dutyReport');
                if(!isDefine(isFirst) || isFirst=='0'){
                    animateShade();
                }
                
                mescroll.endSuccess(data.obj.length);
                
    		} else {
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
