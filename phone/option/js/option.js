//定义vue，data中的数据定义为options和页面中的vue v-for中对应
var vm = new Vue({
               el: '#ScrollContent',
               mounted: function () {
                  //ios300ms延时,处理点击事件延迟的，用于消除点击事件延迟。
                   FastClick.attach(document.body);  
               },
               data: {
                   options: [],
                   nonet:false
               },
                methods: {
                   unclick:function(data){
                       //将功能页点击事件锁死以防止多次打开页面
                       //noClick($('.option-item'))
                       //data里的function_path为页面地址
                       if(isDefine(data.function_path)){
                            var platForm=appcan.locStorage.getVal("platForm");
                            var aniId=0;
                            //菜单id,用于清除消息数的
                            appcan.locStorage.setVal("optionFunctionid",data.functionid);
                            // 收到的消息数
                            if (data.functionNum) {
                                appcan.locStorage.setVal("optionFunctionNum", data.functionNum);
                            } else {
                                appcan.locStorage.setVal("optionFunctionNum", '0');
                            }
                            //Android
                            if(platForm=="1"){
                               appcan.window.open(data.function_path.split("/")[2],data.function_path+".html",2); 
                             }else{
                                if(data.function_path.split("/")[2]=="duty-table-one"||data.function_path.split("/")[2]=="duty-switch"
                                    ||data.function_path.split("/")[2]=="duty-four-summary"||data.function_path.split("/")[2]=="duty-four-list"){
                                   appcan.window.open({
                                         name:data.function_path.split("/")[2],
                                         dataType:0,
                                         data:data.function_path+".html",
                                         aniId:10,
                                         type:0
                                    });  
                                }else{
                                    appcan.window.open({
                                         name:data.function_path.split("/")[2],
                                         dataType:0,
                                         data:data.function_path+".html",
                                         aniId:aniId,
                                         type:1024
                                    });  
                                }
                                
                             }
                            
                       }else{
                           //解锁功能页点击事件
                           //yesClick($('.option-item'));
                           layerToast("此功能正在开发中！");
                       }
                       
                   }
               }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        $.scrollbox($("body")).on("releaseToReload",
        function() { //After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
        }).on("onReloading",
        function(a) { //if onreloading status, drag will trigger this event
        }).on("dragToReload",
        function() { //drag over 30% of bounce height,will trigger this event
        }).on("draging",
        function(status) { //on draging, this event will be triggered.
        }).on("release",
        function() { //on draging, this event will be triggered.
        }).on("scrollbottom",
        function() { //on scroll bottom,this event will be triggered.you should get data from server
            $("#ScrollContent").trigger("more", this);
        }).hide();
        var isLogin=  appcan.locStorage.getVal("isLogin");
        if(isDefine(isLogin)&&isLogin=="true"){
            loadOptionsData();
        }
        appcan.window.subscribe("loadOptionsData",function(data){
            if(data=="loadOptionsData"){
                loadOptionsData();
            }
        })
        //解锁功能页点击事件
        appcan.window.subscribe("option-click",function(data){
            if(data=="option-click"){
                //在common.js中
                 //yesClick($('.option-item'));
            }
        })
        //解锁功能页点击事件
        appcan.window.subscribe("option-get-num",function(data){
            //alert(222);
               loadOptionNum();
        })
        //环信连接上了，判断功能页是否已经加载完毕数据，如果没有加载，则重新获取数据
        appcan.window.subscribe("connected", function(data) {
            if(vm.options.length==0){
               loadOptionsData(); 
            }
        });
    });
    
    //一级值班表
    appcan.button("#duty-table-one", "btn-act", function() {
        appcan.window.open('duty-table-one', '../duty/duty-table-one.html', 2);
    });
    //申请换班
    appcan.button("#duty-switch", "btn-act", function() {
        appcan.window.open('duty-switch', '../duty/duty-switch.html', 2);
    });
    //换班审批
    appcan.button("#duty-approve", "btn-act", function() {
        appcan.window.open('duty-approve', '../duty/duty-approve.html', 2);
    });
    //我的任务
    appcan.button("#task", "btn-act", function() {
        appcan.window.open('task', '../task/task.html', 2);
    });
    //指派任务
    appcan.button("#task-send", "btn-act", function() {
        appcan.window.open('task-send', '../task/task-send.html', 2);
    });
    //通知
    appcan.button("#notice", "btn-act", function() {
        appcan.window.open('notice', '../notice/notice.html', 2);
    });
    //发通知
    appcan.button("#notice-send", "btn-act", function() {
        appcan.window.open('notice-send', '../notice/notice-send.html', 2);
    });
    
})($);
function loadOptionsData(){
    var json={
        path:serverPath+'function.do?focgetFunctions',
        data:{},
        layer:false
    }
    ajaxRequest(json,function(data,e){
        console.log(data);
        if(e=="success"){
            vm.options = data.obj;
            vm.nonet = false;
            Vue.nextTick(function(){
                loadOptionNum();
            });
        }else{
            vm.nonet = (vm.options.length == 0);
        }
    });
}
function loadOptionNum(){
    var num=0;
    var json={
        path:serverPath+'focCommonController.do?focgetMessageNum',
        data:{},
        layer:false
    }
    ajaxRequest(json,function(data,e){
        //console.log(JSON.stringify(data));
        if(e=="success"){
            for(key in data.obj){
                 for (var i=0; i <vm.options.length; i++) {
                     for (var j=0; j < vm.options[i].jsonstr.length; j++) {
                        if(vm.options[i].jsonstr[j].functionid==key){
                            if(data.obj[key]==0){
                                Vue.set(vm.options[i].jsonstr[j],"functionNum",'');
                                Vue.set(vm.options[i].jsonstr[j],'functionNumShow', '');
                                break;
                            }
                            num=num+Number(data.obj[key]);
                            Vue.set(vm.options[i].jsonstr[j],"functionNum",data.obj[key]);
                            Vue.set(vm.options[i].jsonstr[j],'functionNumShow', data.obj[key] > 99 ?'99+':data.obj[key]);
                        } 
                     };
                    
                 };
            }
            appcan.window.publish("option-num",num);
            appcan.locStorage.setVal('optionNums', data.obj);
            appcan.window.publish('duty-problem-get-newnum', '1');
        }else{
        }
    });
}
