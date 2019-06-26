(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('my-feedback-form-page', function(wh) {
            var ipt = $('#fb-ipt').val(),
                txa = $('#fb-txa').val();
            
            if($.trim(ipt)==''){
                layerToast('请简要描述您的反馈意见。');
                if(platFormC=="1"){
                    $('#fb-ipt').focus();
                }
                return false;
            }else if($.trim(txa)==''){
                layerToast('请详细描述您的问题或建议。');
                if(platFormC=="1"){
                    $('#fb-txa').focus();
                }
                return false;
            }else{
                appcan.window.publish('my-feedback-form-shade', '1');
                addConfirm({
                    content: '确定提交吗？',
                    yes: function(i){
                        sendaj(wh);
                        appcan.window.publish('my-feedback-form-shade', '0');
                        layerRemove(i);
                    },
                    no: function(i){
                        appcan.window.publish('my-feedback-form-shade', '0');
                        layerRemove(i);
                    }
                })
            }
        });
    });
    
})($);
var imgdivId=0;
function addPic(e){
    imgdivId++;
    var json={
        min:1,
        max:1,
        quality:0.5,
        detailedInfo:true
    } 
    uexImage.openPicker(json, function(error,data){
        if(error==0){
             var str='<div class="addpic-box">'+
                        '<div class="addpic-item">'+
                            '<div class="addpic-item-con tx-c" id="'+('img_'+imgdivId)+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="addpic-del" onclick="delet(this)"></div>'+
                    '</div>';
            $(e).before(str);
            var arr=new Array();
            arr.push(data.data[0]);
                 var json1={
                    serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=feedback',
                    filePath:arr,
                    quality:3
                 };
                 appcan.plugInUploaderMgr.upload(json1,function(e){
                     
                     if(e.status==1){
                         $("#img_"+imgdivId).html('<img src="'+serverPath+e.responseString+'" date-sr="'+e.responseString+'" class="addpic-con" />')
                     }else if(e.status==2){
                     }else{
                         $("#img_"+imgdivId).html(e.percent+"%");
                     }
                 });
        }
    });
}
function delet(e){
    $(e).parent().remove();
}
function sendaj(index){
    var title=$("#fb-ipt").val();
    var content=$("#fb-txa").val();
    var picPaths="";
    $("img").each(function(){
        picPaths=picPaths+$(this).attr("date-sr")+",";
    })
    if(isDefine(picPaths)){
        picPaths = picPaths.substring(0,picPaths.length-1);
    }else{
        picPaths="null";
    }
    var json={
        path:serverPath+"focSuggestionController.do?focSaveSuggestion",
        data:{
            title:title,
            content:content.replace(/\n/g,"<BR>") ,
            filePath:picPaths
        }
        
    };
    ajaxRequest(json,function(data,e){
        appcan.window.publish('notice-send-shade', '0');
        //console.log(data);
        if(e=="success"){
            var platForm = appcan.locStorage.getVal('platForm');
            var aniId = 0;
            //Android
            if(platForm=='1'){   
                appcan.window.open('my-feedback-success','my-feedback-success.html',2);
            }else{               
                appcan.window.open({
                                   name: 'my-feedback-success',
                                   dataType: 0,
                                   data: 'my-feedback-success.html',
                                   aniId: aniId,
                                   type: 1024
                               });
               
            }
        }else{
            layerToast('提交不成功，请稍后重试。');
        }
        
    });
}
