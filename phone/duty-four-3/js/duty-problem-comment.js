var platForm = appcan.locStorage.getVal('platForm');
var dataId = appcan.locStorage.getVal('duty-problem-detail-id');

var vm = new Vue({
    el: '#comment',
    data: {
        comment: ''
    },
    methods: {
    }
});

(function($) {
    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        appcan.window.subscribe('duty-comment-submit', function(msg){
            appcan.window.publish('duty-comment-shade', 'show');
            addConfirm({
                content: '确定提交吗？',
                yes: function(i){
                    sendaj();
                    layerRemove(i);
                },
                end:function(){
                    appcan.window.publish('duty-comment-shade', 'hide');
                }
            })
        })
        
        //右滑关闭, 主窗口浮动窗口分别调用
        var paramClose = {
            isSupport: platForm != '1'
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
    });
    
})($);

var imgdivId = 0;
function addPic(e){
    if($(e).prev().hasClass('addpic-box')){
        layerToast('只能添加一张');
        return false;
    };
    imgdivId++;
    var json = {
        min: 1,
        max: 1,
        quality: 0.9,
        detailedInfo: true
    } 
    uexImage.openPicker(json, function(error, data){
        if (error == 0) {
            var str = '<div class="addpic-box">'+
                        '<div class="addpic-item">'+
                            '<div class="addpic-item-con tx-c" id="'+('img_'+imgdivId)+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="addpic-del" onclick="delet(this)"></div>'+
                    '</div>';
            $(e).before(str);
            
            var arr = new Array();
            arr.push(data.data[0]);
            var json1 = {
                serverUrl: serverPath + 'focCommonController.do?focupload&uploadPath=problemComment',
                filePath: arr,
                quality: 1
            };
            appcan.plugInUploaderMgr.upload(json1, function(e) {
                if (e.status == 1) {
                    $("#img_"+imgdivId).html('<img src="' + serverPath + e.responseString + '" date-sr="' + e.responseString + '" class="addpic-con" />');
                } else if (e.status == 2) {
                } else {
                    $("#img_"+imgdivId).html(e.percent + '%');
                }
            });
        }
    });
}

function openCamera(e){
    if ($(e).prev().prev().hasClass('addpic-box')) {
        layerToast('只能添加一张');
        return false;
    }
    imgdivId++;
    var comtextareass = 0;
    var quality = 90;
    uexCamera.open(comtextareass, quality, function(picPath) {
        var arr = [picPath];
        var str = '<div class="addpic-box">'+
                        '<div class="addpic-item">'+
                            '<div class="addpic-item-con tx-c" id="'+('img_'+imgdivId)+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="addpic-del" onclick="delet(this)"></div>'+
                    '</div>';
        $(e).prev().before(str);
        var json2 = {
            serverUrl: serverPath + 'focCommonController.do?focupload&uploadPath=problemComment',
            filePath: arr,
            quality: 1
        };
        //上传文件，返回服务器路径  
        appcan.plugInUploaderMgr.upload(json2, function(e){
            // 0-上传中 1-上传成功 2-上传失败
            if (e.status == 1) {
                $("#img_"+imgdivId).html('<img src="' + serverPath + e.responseString + '" date-sr="' + e.responseString + '" class="addpic-con" />')
            } else if(e.status == 2) {
            } else {
                $("#img_"+imgdivId).html(e.percent + '%');
            }
        });
    });
  
}

function delet(e){
    $(e).parent().remove();
}

function sendaj(){
    if(vm.comment.trim() == ''){
        layerToast('评论不能为空。');
        return false;
    }
    
    var picPath = $("img").attr("date-sr");
    if(isDefine(picPath)){
        picPaths = picPath;
    }else{
        picPaths = '';
    }
    
    var json3 = {
        content: escape(vm.comment),
        problemId: dataId
    };
    
    var json4 = {
        path: serverPath + 'focDutyProblemController.do?focAddDutyReply',
        data:json3,
           
    };
    
    ajaxRequest(json4, function(data, e) {
        if (e == 'success') {
            appcan.window.publish('duty-comment-shade', 'hide');
            var closeArr = ['duty-problem-commentpage'];
            closeArr.forEach(function(name){
                appcan.window.evaluateScript({
                    name: name,
                    scriptContent: 'pageClose();'
                });
            });
        } else {
            appcan.window.publish('duty-comment-shade', 'hide');
            layerToast('提交出错，请稍后尝试。');
        }
    });
}
