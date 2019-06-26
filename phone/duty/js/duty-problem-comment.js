var vm = new Vue({
    el: '#comment',
    data: {
        comment:''
    },
    methods: {
    }
});

(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        appcan.button("#nav-left", "btn-act", function() {
            appcan.window.close(-1)
            });        
        appcan.window.subscribe('duty-comment-submit', function(msg){
                appcan.window.publish('task-send-shade', 'show');
                addConfirm({
                    content: '确定提交吗？',
                    yes: function(i){
                        sendaj();
                        layerRemove(i);
                    },
                    end:function(){
                        appcan.window.publish('task-send-shade', 'hide');
                    }
                })
          })         
        //右滑关闭, 主窗口浮动窗口分别调用
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
        };
    });
    
})($);
var imgdivId=0;
function addPic(e){
    if($(e).prev().hasClass('addpic-box')){
        layerToast('只能添加一张');
        return false;
    };
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
                    serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=duty',
                    filePath:arr,
                    quality:3
                 };
                 appcan.plugInUploaderMgr.upload(json1,function(e){
                     if(e.status==1){
                         $("#img_"+imgdivId).html('<img src="'+serverPath+e.responseString+'" date-sr="'+e.responseString+'" class="addpic-con" />');
                     }else if(e.status==2){
                         
                     }else{
                         $("#img_"+imgdivId).html(e.percent+"%");
                     }
                 });
        }else{
        }
    });
}
function openCamera(e){
    if($(e).prev().prev().hasClass('addpic-box')){
        layerToast('只能添加一张');
        return false;
    };
    imgdivId++;
    var comtextareass = 0;
    var quality = 40;
    uexCamera.open(comtextareass, quality, function(picPath) {
      var arr = [picPath];
      var str='<div class="addpic-box">'+
                        '<div class="addpic-item">'+
                            '<div class="addpic-item-con tx-c" id="'+('img_'+imgdivId)+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="addpic-del" onclick="delet(this)"></div>'+
                    '</div>';
      // $(e).before(str);
      $(e).prev().before(str);
      var json1={
                serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=duty',
                filePath: arr,
                quality:3
          };
      //上传文件，返回服务器路径  
          appcan.plugInUploaderMgr.upload(json1,function(e){
                // 0-上传中 1-上传成功 2-上传失败
                if(e.status == 1){
                    $("#img_"+imgdivId).html('<img src="'+serverPath+e.responseString+'" date-sr="'+e.responseString+'" class="addpic-con" />')
                }else if(e.status==2){
                    
                }else{
                    $("#img_"+imgdivId).html(e.percent+"%");
                }
          });
    });
  
}

function delet(e){
    $(e).parent().remove();
}
function sendaj(){
    var content=$("#txa").val();
    if(!isDefine(content)){
        layerToast('评论不能为空。');
        return false;
        }
    var picPath=$("img").attr("date-sr");
    if(isDefine(picPath)){
        picPaths=picPath;
    }else{
        picPaths="";
    }
    var json1={
        content:escape(content),
        img:picPaths
    }    
    var json={
        path:serverPath+"focDutyFeedbackInfo.do?focDoAdd",
        data:{
            content:JSON.stringify(json1),
            infoId:appcan.locStorage.getVal("dataId"),
            userId:appcan.locStorage.getVal("userID"),
            pcid:'',
            puserid:''
        }
    };
    ajaxRequest(json,function(data,e){
        if(e=="success"){
           appcan.window.publish("reloadDutyComment", "reloadDutyComment");
           var closeArr = ['duty-problem-commentpage'];
            closeArr.forEach(function(name){
                appcan.window.evaluateScript({
                    name:name,
                    scriptContent:'appcan.window.close(-1);'
                });
            });
            
        }
        
    });
}

