var vm = new Vue({
    el: '#duty_report_detail',
    data: {
    	dutyReportDetail:[],
    	contentList:[],
    	dutyPerson:[],
    	dutyComment:[],
    	commentSum:0,
    	hasimg:false,
    	islike:false,
    	likenumNotzero:true,
    	commentnumNotzero:true
    },
    methods: {
    	addcomment:function(){
    		appcan.locStorage.setVal("dutyId",dutyId);
    		var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
               appcan.window.open('duty-report-add-comment','duty-report-add-comment.html',2);
            }else{
               appcan.window.open({
                    name:'duty-report-add-comment',
                    dataType:0,
                    data:'duty-report-add-comment.html',
                    aniId:aniId,
                    type:1024
                }); 
            }
    		
    	},
    	morecomment:function(){
    		if(vm.commentSum!=0){
    		    var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                   appcan.window.open('duty-report-detail-comment', 'duty-report-detail-comment.html', 2);
                }else{
                   appcan.window.open({
                        name:'duty-report-detail-comment',
                        dataType:0,
                        data:'duty-report-detail-comment.html',
                        aniId:aniId,
                        type:1024
                    }); 
                }
    			
    		}else{
    			layerToast("无评论");
    		}
    	}
    }
});
var dutyId=appcan.locStorage.getVal("dutyId");
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
    	appcan.window.publish("reloadreportlist","reloadreportlist");
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        var scrollbox= $.scrollbox($("body")).on("releaseToReload",
        
        
            function() { //After Release or call reload function,we reset the bounce
                $("#ScrollContent").trigger("reload", this);
            }).on("onReloading",
            function(a) { //如果onReloading状态，拖动将触发该事件
            }).on("dragToReload",
            function() {
                
            }).on("draging",
            function(status) { //on draging, this event will be triggered.
            }).on("release",
            function() {
                //on draging, this event will be triggered.
            }).on("scrollbottom",
            function() { 
                //在滚动的底部，这个事件将被触发。你应该从服务器获取数据
                $("#ScrollContent").trigger("more", this);
                scrollbox.reset();
            });
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        appcan.window.subscribe('relaodDutyCommentData', function(msg){
            loadDutyReportComment(1,5);
        });
        loadDutyReportDetail(true);
        loadDutyReportComment(1,5);
        var platFormC=appcan.locStorage.getVal("platForm");
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
             appcan.window.publish("reloadreportlist","reloadreportlist");
             appcan.window.close(1);
        }
        //解锁值班简报列表页点击事件
        appcan.window.publish("duty-report-click","duty-report-click");
    });
    //点赞
    $('#dianzan').on('click', function(){
        var that = $(this),
            dianzan_ico = that.find('.icon-20-like'),
            dianzan_txt = that.find('.dure-icon-num span'),
            dianzan_num = parseInt(dianzan_txt.text()),
            act = 'actives';
        var flag;
        
        if(dianzan_ico.hasClass(act)){
        	if(dianzan_num==1){
				vm.likenumNotzero=false;
			}	
        	dianzan_ico.removeClass(act);
        	dianzan_txt.text(dianzan_num-1);
        	flag=0;
        }else{
        	vm.likenumNotzero=true;;
        	dianzan_ico.addClass(act);
        	dianzan_txt.text(dianzan_num+1);
        	flag=1;
        }
        onCommitLike(flag);
    });
    //添加评论
    /*$('#add_comment').on('click',function(){
    	appcan.locStorage.setVal("dutyId",dutyId);
    	appcan.window.open('duty-report-add-comment','duty-report-add-comment.html',2);
    });
    
    //评论
    $('#more_comment').on('click', function(){
    	if(vm.commentSum!=0){
    		appcan.window.open('duty-report-detail-comment', 'duty-report-detail-comment.html', 2);
    	}else{
    		layerToast("无评论");
    	}
    });*/
    
})($);

function loadDutyReportDetail(layer){
	
	var json={
		path:serverPath+"focBriefingController.do?focGetDutyReportDetailInfo",
		data:{
			id:dutyId
		}
		//layer:layer
	};
	ajaxRequest(json,function(data,e){
		//console.log(data);
		if(e=="success"){
			//data.obj.like_num=parseInt(data.obj.like_num);
			vm.dutyPerson=data.obj.dutyPerson;
			//console.log(vm.dutyPerson);
			data.obj.create_time=timeStemp(data.obj.create_time,"MM-dd HH:mm").commonDate;
			data.obj.title=unescape(data.obj.title);
			vm.dutyReportDetail=data.obj;
			if(data.obj.my_like_num>=1){
				vm.islike=true;
			}
			if(vm.dutyReportDetail.like_num==0){
				vm.likenumNotzero=false;
			}	
			vm.contentList=data.obj.contentList;
			for(var i=0;i<data.obj.contentList.length;i++){
				
				if(i==data.obj.contentList[i].order){
									data.obj.contentList[i].content=unescape((data.obj.contentList[i].content).replace(/\n/g,"<BR>"));
									vm.contentList[i]=data.obj.contentList[i];
								}
				
				//alert(data.obj.contentList[i].hasOwnProperty("file_path"));
				if(data.obj.contentList[i].file_path!=""){
					vm.hasimg=true;
				}
				if(isDefine(vm.contentList[i].file_path)){
				    vm.contentList[i].file_path=serverPath+vm.contentList[i].file_path;
				}else{
				   vm.contentList[i].file_path="";
				}
			}
			
		}
	});
}

function loadDutyReportComment(page,size){
	var json={
		path:serverPath+'focBriefingController.do?focGetDutyReportCommentList',
		data:{
			id:dutyId,
			page:page,
			size:size
		}
	};
	ajaxRequest(json,function(data,e){
		//console.log(data);
		if(e=="success"){
			vm.commentSum=data.attributes.totalNum;
			if(vm.commentSum==0){
				vm.commentnumNotzero=false;
			}
			
			//console.log(data.obj);
			for (var i=0; i < data.obj.length; i++){
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
				if(page>1){
					vm.dutyComment=vm.dutyComment.concat(data.obj);
				}else{
					vm.dutyComment=data.obj;
				}
			}else{
				stop=true;
			}
		}
	});
}

function onCommitLike(flag){
	var dutyId=appcan.locStorage.getVal("dutyId");
	var json={
		path:serverPath+"focBriefingController.do?focAddOrCancelReportLike",
		data:{
			id:dutyId,
			flag:flag
		},
		layer:false
	};
	ajaxRequest(json,function(data,e){
		//console.log(data);
		if(e=="success"){
			
		}
	});
}
