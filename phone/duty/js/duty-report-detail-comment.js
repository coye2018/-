var vm = new Vue({
    el: '#duty_report_detail_comment',
    data: {
    	dutyComment:[]
    },
    methods: {
    }
});

;(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.publish("relaodDutyCommentData","relaodDutyCommentData");
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {});
    
    // 上下拉加载
    var mescroll = new MeScroll('mescroll', {
        down: {
            auto: false
        },
        up: {
            auto: true,
            page: {
                num : 0, 
                size : 10
            },
            callback: loaddutycomment
        }
    });

    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        // var platFormC = appcan.locStorage.getVal("platForm");
        // uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            // isSupport: (platFormC == "1") ? false : true
        // }));
        // uexWindow.onSwipeRight = function(){
            // appcan.window.close(1);
        // };
    });
    
    function loaddutycomment(page){
        //console.log(page)
        
        if (page.num == 1) {
            vm.dutyComment = [];
        };
    
    	var dutyId = appcan.locStorage.getVal("dutyId");
    	
    	var json={
    		path:serverPath + 'focBriefingController.do?focGetDutyReportCommentList',
    		data:{
    			id: dutyId,
    			page: page.num,
    			size: page.size
    		},
    		layer: false
    	};
    	ajaxRequest(json, function(data,e){
    		if(e == "success"){
    			//console.log(data.obj);
    			for (var i=0; i <  data.obj.length; i++){
    				data.obj[i].create_time=timeStemp(data.obj[i].create_time,'MM-dd HH:mm').commonDate;
                    data.obj[i].headbgclass = getHeadClass(data.obj[i].user_id);
    				data.obj[i].headtext=data.obj[i].username.substr(-2,2);
    				data.obj[i].briefing_content=unescape(data.obj[i].briefing_content);
    				
                    //给头像设好url
                    if(!isDefine(data.obj[i].head_image)){
                        data.obj[i].hashead = false;
                    }else{
                        data.obj[i].hashead = true;
                        data.obj[i].headurl = serverPath + data.obj[i].head_image;
                    }
    			}
    			if(isDefine(data.obj)){
    				vm.dutyComment = vm.dutyComment.concat(data.obj);
    			}
    			
    			mescroll.endSuccess(data.obj.length);
    		} else {
    		    mescroll.endErr();
    		}
    	});
    };
    
})($);

