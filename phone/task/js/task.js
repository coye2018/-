//点击的tag的index
var tagIndex;
Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});
var mescroll_one = null;
var mescroll_two = null;
var vm = new Vue({
    el: '#task',
    data: {
        searchIpt: '',
        isToInput: false,
        hasSearch: false,
        appointTask:[],
        appointTaskQuery:[],//用于过滤的数组
        reciveTask:[],
        reciveTaskQuery:[],//用于过滤的数组
        nonet:false,
        nonetRecive:false,
        tagIndex:0
    },
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    methods: {
        searchToInput: function(){
            //从文本标签切换到输入框
            this.isToInput = true;
        },
        searchToText: function(){
            //从输入框切换到文本标签
            if(this.searchIpt != '') return false;
            this.isToInput = false;
        },
        searchEmpty: function(){
            //清除输入框
            this.searchIpt = '';
            this.isToInput = false;
            this.searchFilter();
        },
        searchFilter: function(){
            if(vm.tagIndex==0){
                if(!isDefine(this.searchIpt)){
                    vm.appointTask=vm.appointTaskQuery;
                     this.isunLock();
                }else{
                    var appointTaskQuerySave=new Array();
                    for (var i=0; i < vm.appointTaskQuery.length; i++) {
                      if(vm.appointTaskQuery[i].content.indexOf(this.searchIpt)!=-1){
                          appointTaskQuerySave.push(vm.appointTaskQuery[i]);
                      }
                    };
                    vm.appointTask=appointTaskQuerySave;
                    this.isLock();
                }
            }else{
                if(!isDefine(this.searchIpt)){
                    vm.reciveTask=vm.reciveTaskQuery;
                     this.isunLock();
                }else{
                    var reciveTaskQuerySave=new Array();
                    for (var i=0; i < vm.reciveTaskQuery.length; i++) {
                      if(vm.reciveTaskQuery[i].content.indexOf(this.searchIpt)!=-1){
                          reciveTaskQuerySave.push(vm.reciveTaskQuery[i]);
                      }
                    };
                    vm.reciveTask=reciveTaskQuerySave;
                    this.isLock();
                }
            }
        },
        unclick:function(item,index,t){
            //将所有列表数据点击事件上锁，以防多次点击导致打开多个同样页面
            // noClick($('li'));
            //从指派的页面点击的，所以将isCopy改为true以便于页面控制按钮的显示隐藏，isCopy为true时按钮隐藏
            if(t==0){
                appcan.locStorage.setVal("isCopy",true);
            }else{
                appcan.locStorage.setVal("isCopy",item.isCopy);
            }
            
            appcan.locStorage.setVal("taskId",item.id);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("task-detail","task-detail.html",2);
            }else{
                  appcan.window.open({
                    name:'task-detail',
                    dataType:0,
                    data:'task-detail.html',
                    aniId:aniId,
                    type:1024
                });  
            }
        },
        isLock:function(){
            mescroll_one.lockDownScroll(true);
            mescroll_one.lockUpScroll(true);
            mescroll_two.lockDownScroll(true);
            mescroll_two.lockUpScroll(true);
        },
        isunLock:function(){
            mescroll_one.lockDownScroll(false);
            mescroll_one.lockUpScroll(false);
            mescroll_two.lockDownScroll(false);
            mescroll_two.lockUpScroll(false);
        }
    }
});



;(function($) {
    
    //指派参数
    var appiontPage = -1;
    var appiontStop = false;
    //接受任务的参数
    var recivePage = -1;
    var reciveStop = false;
    
    // 上下拉加载
    mescroll_one = new MeScroll('mescroll-1', {
        down: {
            auto: false
        },
        up: {
            auto: true,
            page: {
                num : 0, 
                size : 10
            },
            callback: loadAppointTask
        }
    });
    
    // 上下拉加载
    mescroll_two = new MeScroll('mescroll-2', {
        down: {
            auto: false
        },
        up: {
            auto: true,
            noMoreSize: 3,
            page: {
                num : 0, 
                size : 10
            },
            callback: loadReciveTask
        }
    });
    
    appcan.button("#nav-left", "btn-act", function() {
        var closeArr = ['task-send', 'task'];
            closeArr.forEach(function(name){
                appcan.window.evaluateScript({
                    name:name,
                    scriptContent:'appcan.window.close(-1);'
                });
            });
    });

    appcan.ready(function() {
        
        //更新功能页消息数
        updateTaskNum();
         
        appcan.window.subscribe("reloadTaskList",function(msg){
            vm.appointTask = [];
            vm.reciveTask = [];
            mescroll_one.resetUpScroll(true);
            mescroll_two.resetUpScroll(true);
        })
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                var closeArr = ['task-send', 'task'];
                closeArr.forEach(function(name){
                    appcan.window.evaluateScript({
                        name:name,
                        scriptContent:'appcan.window.close(-1);'
                    });
                });
            }
        };
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            var closeArr = ['task-send', 'task'];
                closeArr.forEach(function(name){
                    appcan.window.evaluateScript({
                        name:name,
                        scriptContent:'appcan.window.close(-1);'
                    });
                });
        };
       //ios300ms延时
        FastClick.attach(document.body);
    });
    
    $('.tab-pill-box').on('click', '.tab-pill-text', function(e){
        var that = $(this),
            idx = that.index(),
            box = $('.mescroll'),
            clsa = 'actives';
            //将点击的那个tag的index记录下来
            tagIndex= that.index();
            appcan.locStorage.setVal("isShow",tagIndex); 
            vm.tagIndex=tagIndex;
        that.addClass(clsa).siblings().removeClass(clsa);
        box.eq(idx).addClass(clsa).siblings().removeClass(clsa);
        $('body').scrollTop(0);
        vm.searchEmpty();
    });
    
    $("#nav-right").on("click",function(){
        vm.hasSearch = !vm.hasSearch;
    });
    
    /**
     * 指派任务的列表 
     * @param {Object} page 
     * @param {Object} size
     */
    function loadAppointTask(page){
        
        if (page.num == 1) {
            vm.appointTask = [];
        }
        
        var json={
            path:serverPath+'focTaskController.do?focGetTaskList',
            data:{
                page: page.num -1,
                size: page.size,
                isSend: 1
            },
            layer:false,
            layerErr:false
        };
        ajaxRequest(json,function(data,e){
            // console.log(data);
            // console.log("Appoint");
            if(e=="success"){
                
                for (var i=0; i <  data.obj.length; i++) {
                   data.obj[i].create_time=timeStemp(data.obj[i].create_time,'MM-dd HH:mm').commonDate;
                   data.obj[i].content=unescape( data.obj[i].content);
                    //finishPeople 为已完成的人数，allPeople 接受人总人数
                   if(data.obj[i].finishPeople==data.obj[i].allPeople){
                       data.obj[i].stateColum="已完成";
                   }else{
                       data.obj[i].stateColum="未完成";
                   }
                   if(isDefine(data.obj[i].filepath)){
                       data.obj[i].filepath=serverPath+data.obj[i].filepath;
                   }
                   data.obj[i].isCopy="false";
                };
                
                if(isDefine(data.obj)){
                    vm.appointTask=vm.appointTask.concat(data.obj);
                    vm.appointTaskQuery=vm.appointTask;
                }
                
                if(!isDefine(vm.appointTask) && page.num == 1){
                    $("#appointNothing").removeClass("hide");
                }else{
                    $("#appointNothing").addClass("hide");
                }
                
                mescroll_one.endSuccess(data.obj.length);
            }else{
                vm.nonetRecive=true;
                mescroll_one.endErr();
            }
        })
    };
    
    /**
     * 接受任务的列表 
     * @param {Object} page
     * @param {Object} size
     */
    function loadReciveTask(page){
        
        if (page.num == 1) {
            vm.reciveTask = [];
        }
        
        var json={
            path:serverPath+'focTaskController.do?focGetTaskList',
            data:{
                page: page.num -1,
                size: page.size,
                isSend:0
            },
            layer:false,
            layerErr:false
        };
        ajaxRequest(json,function(data,e){
            // console.log(data);
             // console.log("Recive");
            if(e=="success"){
                
                for (var i=0; i <  data.obj.length; i++) {
                   data.obj[i].create_time=timeStemp(data.obj[i].create_time,'MM-dd HH:mm').commonDate;
                   data.obj[i].content=unescape(data.obj[i].content);
                   if(isDefine(data.obj[i].filepath)){
                       data.obj[i].filepath=serverPath+data.obj[i].filepath;
                   }
                   //表示不是抄送人的数据
                   if(data.obj[i].isCopy=="false"){
                       if(data.obj[i].state==0){
                           data.obj[i].stateColum="未接受";
                       }else if(data.obj[i].state==1){
                           data.obj[i].stateColum="进行中";
                       }else if(data.obj[i].state==2){
                           data.obj[i].stateColum="已完成";
                       }
                   }else{
                       //finishPeople 为已完成的人数，allPeople 接受人总人数
                       if(data.obj[i].finishPeople==data.obj[i].allPeople){
                           data.obj[i].state==2;
                           data.obj[i].stateColum="已完成";
                       }else{
                           data.obj[i].state==0;
                           data.obj[i].stateColum="未完成";
                       }
                   }
                };
                
                if(isDefine(data.obj)){
                    vm.reciveTask=vm.reciveTask.concat(data.obj);
                    vm.reciveTaskQuery=vm.reciveTask;
                }
                
                if(!isDefine(vm.reciveTask) && page.num == 1){
                    $("#reciveNothing").removeClass("hide");
                }else{
                    $("#reciveNothing").addClass("hide");
                }
                
                mescroll_two.endSuccess(data.obj.length);
            }else{
                vm.nonet = true;
                mescroll_two.endErr();
            }
        })
    };
    
    
    /**
     * 修改通知的消息数。
     */
    function updateTaskNum(){
        var json={
            path:serverPath+'focCommonController.do?focclearMessageNum',
            data:{
                model: appcan.locStorage.getVal("optionFunctionid")
            },
            layer:false
        }
        ajaxRequest(json, function(data,e){
            if(e == "success"){
                //通知功能页更新消息数
                appcan.window.publish("option-get-num","option-get-num");
            }else{
            }
        });
    };
    
})($);
