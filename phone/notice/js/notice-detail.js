var vm = new Vue({
    el: '#notice-detail',
    data: {
        noticeDetail:{},
        nonet:false,
        repaly: [],
        comment: [],
        commentReply: []
    },
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    methods: {
        // unclick:function(){
             // var data ={
                // emojicons: "res://emojicons/emojicons.xml",
                // placeHold: "请输入内容"
             // };
             // uexInputTextFieldView.open(data);
             // uexInputTextFieldView.setInputFocused();
            // //回复的接口
            // //focInformationInfoController.do?focaddInformationReply
            // //information_id content
        // },
        commentReply:function(){
               var dataId = appcan.locStorage.getVal("noticeId");
               appcan.locStorage.setVal('dataId',dataId);
              //打开回复图片页面
                var platForm=appcan.locStorage.getVal("platForm");
                var aniId=0;
                //Android
                if(platForm=="1"){
                    appcan.window.open("notice-commentpage","notice-commentpage.html",2);
                }else{
                      appcan.window.open({
                        name:'notice-commentpage',
                        dataType:0,
                        data:'notice-commentpage.html',
                        aniId:aniId,
                        type:1024
                    });  
                } 
        },
        replys: function(pcid,puserid) {

            if (pcid == null) {
                pcid = '';
            }
            if (puserid == null) {
                puserid = '';
            }
            appcan.locStorage.setVal("pcid", pcid);
            appcan.locStorage.setVal("puserid", puserid);
            var data = {
                emojicons: "res://emojicons/emojicons.xml",
                placeHold: "请输入内容"
            };
            uexInputTextFieldView.open(data);
            uexInputTextFieldView.setInputFocused();
        },
        openImg:function(item,index){
            var imgArray=new Array();
            for (var i=0; i < item.length; i++) {
                 imgArray.push(item[i].file_path);
            };
            var data ={
                    displayActionButton:true,
                    displayNavArrows:true,
                    enableGrid:true,
                    //startOnGrid:true,
                    startIndex:index,
                    data:imgArray
            }
            uexImage.openBrowser(data,function(){
            });  
        },
        openImge:function(item){
            var imgArray = new Array();
            imgArray.push(item);
             var data = {
                        displayActionButton: true,
                        displayNavArrows: true,
                        enableGrid: true,
                        //startOnGrid:true,
                        // startIndex:0,
                        data: imgArray
                    }
             uexImage.openBrowser(data, function() {});
        }
    },
    updated:function(){
        if($('.listboxs').children().hasClass('listbox')){
            $('.listContent').addClass('listsbox');
        }

    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.publish("reloadNotice","reloadNotice");
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        //监听回复评论页面刷新detail
        appcan.window.subscribe("reloadNoticeComment",function(msg){
           loadNoticeDetial(false);
        })
        loadNoticeDetial(true);
        //键盘输入点击发送的时候的监听函数        
        uexInputTextFieldView.onCommitJson = onCommitJson;
        //键盘弹出收起
        uexInputTextFieldView.onKeyBoardShow = onKeyBoardShow;
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
        //ios300ms延时
        FastClick.attach(document.body);
    });
    
    appcan.button("#readlist", "btn-act", function() {
            var noticeRecever=new Array();
            var noticeUnRecever=new Array();
            for (var i=0; i < vm.noticeDetail.receive.length; i++) {
                if(vm.noticeDetail.receive[i].state==1){
                    noticeRecever.push(vm.noticeDetail.receive[i]);
                }else{
                    noticeUnRecever.push(vm.noticeDetail.receive[i]);
                }
            };
            appcan.locStorage.setVal("noticeRecever",JSON.stringify(noticeRecever));
            appcan.locStorage.setVal("noticeUnRecever",JSON.stringify(noticeUnRecever));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('notice-detail-readlist', 'notice-detail-readlist.html', 2);
            }else{
                  appcan.window.open({
                    name:'notice-detail-readlist',
                    dataType:0,
                    data:'notice-detail-readlist.html',
                    aniId:aniId,
                    type:1024
                });  
            }
            
    });
    
})($);
function loadNoticeDetial(layer){
    var noticeId=appcan.locStorage.getVal("noticeId");
    var json={
        path:serverPath+"focInformationInfoController.do?focgetInformationDetail",
        data:{
            id:noticeId
        },
        layer:layer,
        layerErr:false
    };
    ajaxRequest(json,function(data,e){
        if(e=="success"){
            console.log(data);
            vm.nonet=false;
            data.obj.create_time=timeStemp(data.obj.create_time,"MM-dd HH:mm").commonDate;
            data.obj.rate=data.obj.readpeoplesnum+"/"+data.obj.allpeoplesnum;
            data.obj.content=unescape(data.obj.content);
            for (var i=0; i < data.obj.files.length; i++) {
                 if(isDefine(data.obj.files[i].file_path)){
                     data.obj.files[i].file_path=serverPath+data.obj.files[i].file_path;
                 }
            };
            data.obj.replySize=data.obj.reply.length;
            var noticeIsOner=appcan.locStorage.getVal("noticeIsOner");
            if(noticeIsOner=="true"){
                //控制发送已读回执按钮隐藏
                data.obj.isOner=true;
            }else{
                 //控制发送已读回执按钮显示
                data.obj.isOner=false;
            }
            for (var i=0; i < data.obj.receive.length; i++) {
                console.log(data.obj.receive[i].toview_time);
                if(isDefine(data.obj.receive[i].toview_time)&&data.obj.receive[i].toview_time!=0){
                    data.obj.receive[i].toview_time=timeStemp(data.obj.receive[i].toview_time,"MM-dd HH:mm").commonDate;
                }else{
                    data.obj.receive[i].toview_time="— —";
                }
                 if(data.obj.receive[i].usercode==appcan.locStorage.getVal("userCode")){
                  if(data.obj.receive[i].state==1){
                      //控制发送已读回执按钮隐藏
                      data.obj.isOner=true;
                  }else{
                      //控制发送已读回执按钮显示
                      data.obj.isOner=false;
                      setTimeout(function(){
                          var noticeId=appcan.locStorage.getVal("noticeId");
                          var json={
                              path:serverPath+'focInformationInfoController.do?focchangeState',
                              data:{
                                  ids:noticeId
                              },
                              layer:false,
                              layerErr:false
                          }
                          ajaxRequest(json,function(data,e){
                              if(e=="success"){
                                  layerToast("已自动发送已读回执");
                                  loadNoticeDetial(false);
                                  appcan.window.publish("reloadNotice","reloadNotice");
                              }
                          });
                      },2000);
                  }
              }
            };
            for (var i=0; i < data.obj.reply.length; i++) {
              data.obj.reply[i].create_time=timeStemp(data.obj.reply[i].create_time,"MM-dd HH:mm").commonDate;
              data.obj.reply[i].content=filterBrow(unescape(data.obj.reply[i].content));
             
            };
            vm.noticeDetail=data.obj;
        }else{
            vm.nonet=true;
        }
        
    });

    //评论ajax
    var commentJson = {
        path: serverPath + "focInformationComments.do?focGetInfoCommentsList",
        data: {
            infoId:appcan.locStorage.getVal("noticeId")
        },
        layer: false,
        layerErr: false
    }
    ajaxRequest(commentJson, function(data, e) {
        if (e == "success") {
            // console.log(data.obj);
            // console.log(JSON.parse(JSON.stringify(data)));
            for (var i = 0; i < data.obj.length; i++) {
                var commentReplyData = new Array();
               var timer=null;
                if(isDefine(data.obj[i].createTime)){
                    timer=timeStemp(data.obj[i].createTime, 'MM-dd HH:mm').commonDate;
                }
                data.obj[i].createTime = timer;
                data.obj[i].reply = unescape(JSON.parse(data.obj[i].content).content);
                if(isDefine(JSON.parse(data.obj[i].content).img)){
                    data.obj[i].img = serverPath+JSON.parse(data.obj[i].content).img;
                }else{
                    data.obj[i].img=false;
                }
                if(data.obj[i].pcidList!=null){
                    commentReplyData = data.obj[i].pcidList;
                    for (var j = 0; j < commentReplyData.length; j++) {
                        commentReplyData[j].time = timeStemp(commentReplyData[j].createTime, 'MM-dd HH:mm').commonDate;
                        commentReplyData[j].reply = unescape(JSON.parse(commentReplyData[j].content).content);
                    };
                    data.obj[i].pcidList=commentReplyData;
                    commentReplyData=[];
                }else{
                    commentReplyData=[];
                    data.obj[i].pcidList=[];
                }
            };

            vm.comment = data.obj;
        }
    });

}
//点击外部键盘消失
function onKeyBoardShow(json) {
   var keyBoardToggleData = JSON.parse(json)
   if (keyBoardToggleData.status == 0) {
       uexInputTextFieldView.close();
   }
};
/**
 * 回复发送插件按钮回调事件 
 * @param {Object} data
 */
function onCommitJson(data){
  var text=  data.emojiconsText;
  if(!isDefine(text)){
      uexInputTextFieldView.close();
        layerToast('回复内容不能为空');
        return false;
    }
    var json1={
        content:escape(text)
        }
  //发送ajax
  var json={
      path:serverPath+"focInformationComments.do?focDoAdd",
      data:{
          userid:appcan.locStorage.getVal("userID"),
          infoId:appcan.locStorage.getVal("noticeId"),
          pcid:appcan.locStorage.getVal("pcid"),
          puserid:appcan.locStorage.getVal("puserid"),
          content:JSON.stringify(json1)
      },
      layer:false
  };
  ajaxRequest(json,function(data,e){
      if(e=="success"){
          loadNoticeDetial(false);
          uexInputTextFieldView.close();
          
      }
  })
}

// $("#send_receipt").on("click",function(){
//         var noticeId=appcan.locStorage.getVal("noticeId");
//         var json={
//                 path:serverPath+'focInformationInfoController.do?focchangeState',
//                 data:{
//                     ids:noticeId
//                 }
//         }
//         ajaxRequest(json,function(data,e){
//             if(e=="success"){
//
//                 layerToast("发送成功");
//                 loadNoticeDetial(false);
//                 appcan.window.publish("reloadNotice","reloadNotice");
//             }
//         });
// })


