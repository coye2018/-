var vm = new Vue({
	el: '#duty_report_add_comment',
	data:{
		 comment:''
	},
	method:{
		 
	}
});
var dutyId=appcan.locStorage.getVal("dutyId");
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
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
             appcan.window.close(1); 
        }
    });
})($);
$("#nav-right").on("click",function(){
            noClick($('#nav-right'));
	//alert(0000);
			if(vm.comment.trim(txa)==''){
                layerToast('评论不能为空。');
                yesClick($('#nav-right'));
                return false;
            }
            var dutyId=appcan.locStorage.getVal("dutyId");
            //alert(dutyId);
            var json={
            	path:serverPath+"focBriefingController.do?focAddReportComment",
            	data:{
            			id:dutyId,
            			content:escape(vm.comment.replace(/\n/g,"<BR>"))
            	},
            	layer:false
            };
            vm.comment='';
           //alert(00);
            ajaxRequest(json,function(data,e){
                    	//console.log(data);
                    	//var index = layerLoading();
                    	if(e=="success"){
                    	    
                    		appcan.window.publish("relaodDutyCommentData","relaodDutyCommentData");
                    		appcan.window.close(1);
                    	}
                    	yesClick($('#nav-right'));
                    });
});
