var vm = new Vue({
    el: '#send_container',
    data: {
        senddata: {},
        sendto: []
    },
    methods: {
    },
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
});

(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('notice-send', function(msg){
            var nstJson = JSON.parse(msg);
            vm.senddata = $.extend({}, nstJson);
            
            //选中项不是[我要自己选择]时, 清空之前选的数据
            if(vm.senddata.total>0){
                vm.sendto.split(0, vm.sendto.length);
            }
        });
        appcan.window.subscribe('notice-send-from-address-pick', function(msg){
            var pppJson = JSON.parse(msg);
            appcan.locStorage.setVal('peoplepick', msg);
            vm.sendto = pppJson;
        });
        
        //点击提交
        appcan.window.subscribe('notice-send-page', function(msg) {
            var ipt = $('#ipt').val(),
                txa = $('#txa').val(),
                typ = $('#type').text();
            
            if($.trim(ipt)==''){
                layerToast('请输入通知标题。');
                $('#ipt').focus();
                return false;
            }else if($.trim(txa)==''){
                layerToast('请详细描述要发送的通知。');
                $('#txa').focus();
                return false;
            }else if(txa.length>3500){
                 layerToast('字数不超过3500。');
                $('#txa').focus();
            }else if($.trim(typ)==''){
                layerToast('请选择发送模式。');
                return false;
            }else if(vm.senddata.total<=0 && !vm.sendto.length){
                layerToast('请选择至少一名接收人。');
                return false;
            }else{
                appcan.window.publish('notice-send-shade', '1');
                addConfirm({
                    content: '确定提交吗？',
                    yes: function(i){
                        sendaj();
                        
                        layerRemove(i);
                    },
                    no: function(i){
                        appcan.window.publish('notice-send-shade', '0');
                        layerRemove(i);
                    }
                })
            }
        });
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
            appcan.locStorage.setVal('peoplepick', '');
            appcan.window.close(1);
        };
    });
    
    //发送模式
    appcan.button("#send-type", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('notice-send-type', 'notice-send-type.html', 2);
        }else{
              appcan.window.open({
                name:'notice-send-type',
                dataType:0,
                data:'notice-send-type.html',
                aniId:aniId,
                type:1024
            });  
        }
        
    });
    //接收人
    $('#send_container').on('click', '#send-to', function() {
        if(vm.senddata.total<0){
            appcan.locStorage.setVal('address-pick-from', 'notice-send');
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('address-pick', '../address/address-pick.html', 2);
            }else{
                  appcan.window.open({
                    name:'address-pick',
                    dataType:0,
                    data:'../address/address-pick.html',
                    aniId:aniId,
                    type:1024
                });  
            }
            
        }
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
                    serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=infomation',
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
//拍照
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
                serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=infomation',
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
    var title=$("#ipt").val();
    var content=$("#txa").val();
    var type= vm.senddata.type;
    var ids="";
    var groupId;
    if(vm.senddata.type == 0){
        groupId = '';
    }else{
        groupId = vm.senddata.id; 
    }
    for (var i=0; i < vm.sendto.length; i++) {
      ids=ids+vm.sendto[i].id+",";
    };
    var peopleIds;
    if(isDefine(ids)){
        peopleIds = ids.substring(0,ids.length-1);
    }else{
        peopleIds="null";
    }
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
        path:serverPath+"focInformationInfoController.do?focdoAdd",
        data:{
            title:title,
            content:escape(content.replace(/\n/g,"<BR>")),
            type:type,
            peopleIds:peopleIds,
            picPaths:picPaths,
            groupId: groupId
        }
        
    };
    ajaxRequest(json,function(data,e){
        appcan.window.publish('notice-send-shade', '0');
        if(e=="success"){
            appcan.locStorage.remove('peoplepick');
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("notice-history","notice-history.html",2);
            }else{
                  appcan.window.open({
                    name:'notice-history',
                    dataType:0,
                    data:'notice-history.html',
                    aniId:aniId,
                    type:1024
                });  
            }
            
        }
        
    });
}
