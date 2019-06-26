var vm = new Vue({
    el: '#finish-container',
    data: {
        text:''
    },
    methods: {}
});

(function($) {
    appcan.ready(function() {
        appcan.button("#nav-left", "btn-act", function() {
            appcan.window.close(-1)
            });
          appcan.window.subscribe('task-send-submit', function(msg){
                 if(vm.text==''){
                layerToast('请详细描述原因。');
                return false;
            }else if(vm.text.length>1000){
                layerToast('不能超过1000字。');
                return false;
            }else{
                appcan.window.publish('task-send-shade', 'show');
                addConfirm({
                    content: '确定完成吗？',
                    yes: function(i){
                        sendaj();
                        layerRemove(i);
                    },
                    end:function(){
                        appcan.window.publish('task-send-shade', 'hide');
                    }
                })
            } 
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
                         $("#img_"+imgdivId).html('<img src="'+serverPath+e.responseString+'" date-sr="'+e.responseString+'" class="addpic-con" />')
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
function sendaj(index){
    var content=$("#txa").val();
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
        path:serverPath+"focDutyFeedbackInfo.do?focFinishInfo",
        data:{
            content:escape(content.replace(/\n/g,"<BR>")),
            infoId:appcan.locStorage.getVal("dataId"),
            picPath:picPaths,
            userId:appcan.locStorage.getVal("userID")
        }
        
    };
    ajaxRequest(json,function(data,e){
        if(e=="success"){
           appcan.window.publish("reloadTaskList", "reloadTaskList");
           var closeArr = ['duty-problem-detail', 'duty-problem-finishpage'];
            closeArr.forEach(function(name){
                appcan.window.evaluateScript({
                    name:name,
                    scriptContent:'appcan.window.close(-1);'
                });
            });
            
        }
        
    });
}