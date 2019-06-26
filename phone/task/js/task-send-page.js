var vm = new Vue({
    el: '#send_container',
    data: {
        tasktext: '',
        sendto: [],
        deadline: {
            time: '',
            timestamp: ''
        },
        alarms: {
            text: '不提醒',
            value: '0'
        },
        copyto: [],
        type:{}
    },
    methods: {
    },
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    }
});


//图片上传
var imgdivId=0;
(function($) {
    
    appcan.ready(function() {
        
        appcan.window.subscribe('task-send_1-from-address-pick', function(msg){
            appcan.locStorage.setVal('peoplepick_1', msg);
            var stJson = JSON.parse(msg);
            vm.sendto = stJson;
            
            //去掉抄送人中重复的项
            //appcan.window.publish('task-send_2-from-address-pick', appcan.locStorage.getVal('peoplepick_2'));
        });
        
        
        appcan.window.subscribe('task-send_2-from-address-pick', function(msg){
            var ctJson = JSON.parse(msg);
            //选完抄送人后, 要去掉与执行人重复的项
            // for(var i=0; i<vm.sendto.length; i++){
                // for(var j=0; j<ctJson.length; j++){
                    // if(vm.sendto[i].id == ctJson[j].id){
                        // ctJson.splice(j, 1);
                        // j--;
                    // }
                // }
            // }
            vm.copyto = ctJson;

         
            if(JSON.parse(msg).length != ctJson.length){
                layerToast('任务来源不能同时为执行人，系统已自动删去重复项。');
            }
// if(JSON.parse(msg).length != ctJson.length){
                // layerToast('抄送人不能同时为任务来源，系统已自动删去重复项。');
            // }

            appcan.locStorage.setVal('peoplepick_2', JSON.stringify(ctJson));
        });
        
        appcan.window.subscribe('task-send-alarm', function(msg){
            var alarmJson = JSON.parse(msg);
            vm.alarms = alarmJson;
        });
        // test任务类型
        appcan.window.subscribe('task-type', function(msg){
            var typeJson = JSON.parse(msg);
            vm.type = typeJson;
            // console.log(vm.type)
            
        });        
        // 提交
        appcan.window.subscribe('task-send-submit', function(msg){
            var stNow = timeStemp(new Date()).dateTimeSecond,
            stAlarm = Number(vm.alarms.value)*60,
            stDead = Number(vm.deadline.timestamp);
            if(vm.tasktext==''){
                layerToast('请详细描述任务。');
                return false;
            }
            else if(vm.tasktext.length>3500){
                layerToast('描述任务不能超过3500字。');
                return false;
            }
            else if(vm.sendto.length==0){
                layerToast('请选择至少一名执行人。');
                return false;
            }else if(!vm.type.hasOwnProperty('typeName')){
                layerToast('请选择至少一任务类型。');
                return false;
            }
            else{
                appcan.window.publish('task-send-shade', 'show');
                addConfirm({
                    content: '确定指派吗？',
                    yes: function(i){
                        sendaj();
                        layerRemove(i);
                    },
                    end: function () {
                        appcan.window.publish('task-send-shade', 'hide');
                    }
                })
            }
        });
        
        //判断是从聊天过来的。
        var ischatTotask=appcan.locStorage.getVal("ischatTotask");
        if(ischatTotask=="true"){
            var chatMessageOnlong=JSON.parse(appcan.locStorage.getVal("chatMessageOnlong"));
            if(chatMessageOnlong.ownerType=="text"){
                vm.tasktext=(chatMessageOnlong.messageBody.text.replace(/<br>/g,"\n")).replace(/<[^>]+>/g,"");
            }
            if(chatMessageOnlong.ownerType=="image"){
                   var str='<div class="addpic-box">'+
                        '<div class="addpic-item">'+
                            '<div class="addpic-item-con tx-c" id="'+('img_'+imgdivId)+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="addpic-del" onclick="delet(this)"></div>'+
                    '</div>';
                    $("#addImg").before(str);
                    var PicName;
                    var textCopy= chatMessageOnlong.messageBody.remotePath; 
                    PicName=textCopy.split("/")[textCopy.split("/").length-1];
                    var pi;
                    //这个如果是从环信过来的图片是没有图片的扩展名的
                     if(PicName.indexOf(".")!=-1){
                            var arr=new Array();
                            arr.push(chatMessageOnlong.messageBody.remotePath);
                            var json1={
                                serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=task',
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
                         //先将文件保存到相应的手机里，然后再上传到我们的服务器上。只能这么做
                            pi=PicName+".jpg";
                            var downloader =uexDownloaderMgr.create();
                            uexDownloaderMgr.download(downloader,textCopy,"wgts://"+pi,1,function(fileSize, percent, status){
                                  switch (status) {
                                      case 0:
                                          return;
                                      break;
                                      case 1:
                                          uexDownloaderMgr.closeDownloader(downloader);
                                           var arr=new Array();
                                           arr.push("wgts://"+pi);
                                           var json1={
                                            serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=task',
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
                                         uexDownloaderMgr.closeDownloader(downloader);
                                      break;
                                      case 2:
                                            uexDownloaderMgr.closeDownloader(downloader);
                                      break;
                                  }
                            });
                     }    
            }
            appcan.locStorage.setVal("ischatTotask","false");
        }
    });
    
    //选择执行人, 标记为1
    $('#send_container').on('click', '#send-to', function() {
        //noClick($('#send-to'));
        appcan.locStorage.setVal('address-pick-from', 'task-send_1');
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
        
    });
    
    //截止时间
    var dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var now = new Date(),
        max = new Date(now.getFullYear()+3, now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
    var instance = mobiscroll.date('#picktime', {
        lang: 'zh',
        theme:'ios',
        display: 'bottom',
        headerText: '日期选择',
        min: now,
        max: max,
        minWidth: 130,
        dateFormat: 'yy-mm-dd',
        // dateWheels: 'yy m dd DD',
        showLabel: true,
        onInit: function (evtObj, obj) {
        },
        onBeforeShow: function (evtObj, obj) {
        },
        onSet: function (evtObj, obj) {
            // console.log(timeStemp(evtObj.valueText).dateTimeSecond);
            vm.deadline = {
                time: evtObj.valueText,
                timestamp: timeStemp(evtObj.valueText).dateTimeSecond
            };
        }
    });
    
    //提醒时间
    $('#send_container').on('click', '#alarm', function() {
        //noClick($('#alarm'));
        appcan.locStorage.setVal('task-send-alarm', JSON.stringify(vm.alarms));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('task-send-alarm', 'task-send-alarm.html', 2);
        }else{
              appcan.window.open({
                name:'address-pick',
                dataType:0,
                data:'task-send-alarm.html',
                aniId:aniId,
                type:1024
            });  
        }
    });
    
    //选择任务来源, 标记为2
    $('#send_container').on('click', '#copy-to', function() {
        //noClick($('#copy-to'));
        appcan.locStorage.setVal('address-pick-from', 'task-send_2');
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
    });
    
    //选择任务类型
     $('#send_container').on('click', '#task-type', function() {
        appcan.locStorage.setVal('task-type', 'task-send_2');
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('task-type', 'task-type.html', 2);
        }else{
              appcan.window.open({
                name:'task-type',
                dataType:0,
                data:'task-type.html',
                aniId:aniId,
                type:1024
            });  
        }
    });
    
    
})($);

function addPic(e){
    imgdivId++;
    var json={
        min:1,
        max:1,
        quality:0.5,
        detailedInfo:true,
        title:"ttttt",
        style:1
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
                serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=task',
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
                serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=task',
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
    var content=vm.tasktext;
    var type= 1;
    //任务接受人id
    var receiveIds="";
    //抄送人id
    var copytoIds="";
    //循环将接受人id拼成字符串以,号分割
    for (var i=0; i < vm.sendto.length; i++) {
      receiveIds=receiveIds+vm.sendto[i].id+",";
    };
     //循环将接受人id拼成字符串以,号分割
    for (var i=0; i < vm.copyto.length; i++) {
      copytoIds=copytoIds+vm.copyto[i].id+",";
    };
    //接受人id字符串
    var peopleIds;
    //抄送人id字符串
    var copytoPeopleIds;
    if(isDefine(receiveIds)){
        peopleIds = receiveIds.substring(0,receiveIds.length-1);
    }else{
        peopleIds="null";
    }
    if(isDefine(copytoIds)){
        copytoPeopleIds = copytoIds.substring(0,copytoIds.length-1);
    }else{
        copytoPeopleIds="null";
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
    //任务测试id
    var taskTypeId=vm.type.id;
    var timer="null";
    if(isDefine(vm.deadline.time)){
        timer=timeStemp(vm.deadline.time,'yyyy-MM-dd').dateTimeSecond;
    }
    
    var json={
        path:serverPath+"focTaskController.do?focsaveTaskInfo",
        data:{
            content:escape(content.replace(/\n/g,"<BR>")),
            warnTime:vm.alarms.value,
            receiveIds:peopleIds,
            finishTime:timer,
            filePaths:picPaths,
            // copyIds:copytoPeopleIds,
            userId:appcan.locStorage.getVal("userID"),
            tastTypeId:taskTypeId,
            taskSrcId:copytoPeopleIds
        }
        
    };
    ajaxRequest(json,function(data,e){
         appcan.window.publish('task-send-shade', 'hide');
        if(e=="success"){
            //执行人缓存删除
            appcan.locStorage.remove('peoplepick_1');
            //抄送人缓存删除
            appcan.locStorage.remove('peoplepick_2');
            //提醒删除
            appcan.locStorage.remove('task-send-alarm');
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("task","task.html",2);
            }else{
                  appcan.window.open({
                    name:'task',
                    dataType:0,
                    data:'task.html',
                    aniId:aniId,
                    type:1024
                });  
            }
            
        }
        
    });
}
