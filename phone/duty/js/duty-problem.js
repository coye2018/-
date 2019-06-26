//点击的tag的index
var tagIndex;
var mescroll = ['mescroll0','mescroll1','mescroll2'];
Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
    el: '#duty-problem',
    data: {
        searchIpt: '',
        isToInput: false,
        hasSearch: false,
        nonet:false,
        nonetRecive:false,
        tagIndex:0,
        listleftData:[],
        listleftDataQuery:[],//整改中用于过滤的数组
        listmiddleData:[],
        listmiddleDataQuery:[],//整改中用于过滤的数组
        listrightData:[],
        listrightDataQuery:[],//整改中用于过滤的数组
        mescrollArr:new Array(3),
        num:0 
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
            //搜索
            if(vm.tagIndex==0){
                if(!isDefine(this.searchIpt)){
                    vm.listleftData=vm.listleftDataQuery;
                    this.isunLock();
                }else{
                    var listleftDataQuerySave=new Array();
                    for (var i=0; i < vm.listleftDataQuery.length; i++) {
                      if(vm.listleftDataQuery[i].content.indexOf(this.searchIpt)!=-1||vm.listleftDataQuery[i].srcname.indexOf(this.searchIpt)!=-1){
                          listleftDataQuerySave.push(vm.listleftDataQuery[i]);
                      }
                    };
                    vm.listleftData=listleftDataQuerySave;
                    this.isLock();
                }
            }else if(vm.tagIndex==1){
                if(!isDefine(this.searchIpt)){
                    vm.listmiddleData=vm.listmiddleDataQuery;
                    this.isunLock();
                }else{
                    var listmiddleDataQuerySave=new Array();
                    for (var i=0; i < vm.listmiddleDataQuery.length; i++) {

                      if(vm.listmiddleDataQuery[i].content.indexOf(this.searchIpt)!=-1||vm.listmiddleDataQuery[i].srcname.indexOf(this.searchIpt)!=-1){
                          listmiddleDataQuerySave.push(vm.listmiddleDataQuery[i]);
                      }
                    };
                    vm.listmiddleData=listmiddleDataQuerySave;
                    this.isLock();
                    
                }
            }else if(vm.tagIndex==2){
                if(!isDefine(this.searchIpt)){
                    vm.listrightData=vm.listrightDataQuery;
                    this.isunLock();
                }else{
                    var listrightDataQuerySave=new Array();
                    for (var i=0; i < vm.listrightDataQuery.length; i++) {
                      if(vm.listrightDataQuery[i].content.indexOf(this.searchIpt)!=-1||vm.listrightDataQuery[i].srcname.indexOf(this.searchIpt)!=-1){
                          listrightDataQuerySave.push(vm.listrightDataQuery[i]);
                      }
                    };
                    vm.listrightData=listrightDataQuerySave;
                    this.isLock();
                }
            }
        },
        unclick:function(dataId){
            //点击进入详情
            appcan.locStorage.remove("chatFromdutyProblemButton");
            appcan.locStorage.setVal('dataId',dataId);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("duty-problem-detail","duty-problem-detail.html",2);
            }else{
                  appcan.window.open({
                    name:'duty-problem-detail',
                    dataType:0,
                    data:'duty-problem-detail.html',
                    aniId:aniId,
                    type:1024
                });  
            }
        },
        changeIsSend:function(){
            var i=vm.num;
                mescroll[0].destroy();
                mescroll[1].destroy();
                mescroll[2].destroy();
            if(i%2==0){
                vm.listleftData=[];
                vm.listmiddleData=[];
                vm.listrightData=[];
                
             appcan.locStorage.setVal('isSend',1);
             initMescroll("mescroll"+0,0,'0,1,2',1);
             initMescroll("mescroll"+1,1,'3',1);
             initMescroll("mescroll"+2,2,'4,5,6',1);
             $("#change").text("我指派的值班问题");
             $("#change1>span").text("查看值班问题");
            }else{
                appcan.locStorage.setVal('isSend',0);
                vm.listleftData=[];
                vm.listmiddleData=[];
                vm.listrightData=[];
             initMescroll("mescroll"+0,0,'0,1,2',0);
             initMescroll("mescroll"+1,1,'3',0);
             initMescroll("mescroll"+2,2,'4,5,6',0);
             $("#change").text("值班问题");
             $("#change1>span").text("查看我指派的值班问题");
            }
            vm.num++;
        },
        isLock:function(){
            //禁止下拉
            mescroll[0].lockDownScroll(true);
            mescroll[1].lockDownScroll(true);
            mescroll[2].lockDownScroll(true);
            mescroll[0].lockUpScroll(true);
            mescroll[1].lockUpScroll(true);
            mescroll[2].lockUpScroll(true); 
        },
        isunLock:function(){
            //恢复下拉
            mescroll[0].lockDownScroll(false);
            mescroll[1].lockDownScroll(false);
            mescroll[2].lockDownScroll(false);
            mescroll[0].lockUpScroll(false);
            mescroll[1].lockUpScroll(false);
            mescroll[2].lockUpScroll(false);
        }
    }
});

   function initMescroll(mescrollId,index,state,isSend){
        // 上下拉加载
          mescroll[index]= new MeScroll(mescrollId, {
        down: {
            auto: false
        },
        up: {
            auto: true,
            noMoreSize: 3,
            page: {
                num : 0,
                size : 10,
                index:index,
                state:state,
                isSend:isSend
                
            },
            callback: loadDutyProblem
        }
    });
        return mescroll[index];
    }
/**
     * 值班问题列表 
     * @param {Object} page 
     * @param {Object} size
     */
// 状态  state
//未接受：0，整改中：1，超时：2，审核中：3，关闭：4  
function loadDutyProblem(page){ 
        var isSend=0; 
        if(appcan.locStorage.getVal('isSend')==1){
            isSend=1;
        }
         if (page.num == 1) {
             switch(page.index)
                 {
                     case 0: 
                     vm.listleftData = [] ;
                     break;
                     case 1: 
                     vm.listmiddleData = [] ;
                     break;
                     case 2: 
                     vm.listrightData = [] ;
                     break;
                       
                 }
         }
        var json={
            path:serverPath+'focDutyFeedbackInfo.do?focListByConditionPage',
            data:{
                page: page.num,
                size: page.size,
                isSend:page.isSend,
                state:page.state,
                userId:appcan.locStorage.getVal("userID")
            },
            layer:false,
            layerErr:false
        };
        ajaxRequest(json,function(data,e){
            var dataIndex=page.index;
            if(e=="success"){
                if(dataIndex==0){
                    for(var i=0; i <  data.obj.length; i++){
                        if(data.obj[i].create_time!=0&&isDefine(data.obj[i].create_time)){
                          data.obj[i].create_time=timeStemp(data.obj[i].create_time,'MM-dd HH:mm').commonDate;  
                        }else{
                            data.obj[i].create_time='--'
                        }
                        data.obj[i].content=unescape( data.obj[i].content);
                        //判断显示状态
                        if(page.isSend==0){
                        for(var j=0;j<data.obj[i].recdepartinfo.length;j++){
                           if(appcan.locStorage.getVal("deptId")==data.obj[i].recdepartinfo[j].recv_depart_id){
                                    if(data.obj[i].recdepartinfo[j].state=='0'){
                                        data.obj[i].bgBorder=true;
                                        data.obj[i].state_text=data.obj[i].recdepartinfo[j].state_text;
                                    }else if(data.obj[i].recdepartinfo[j].state=='1'){
                                        data.obj[i].bgMain=true;
                                        data.obj[i].state_text='整改中';
                                    }else if(data.obj[i].recdepartinfo[j].state=='2'){
                                        data.obj[i].bgDanger=true;
                                        data.obj[i].state_text='已超时';
                                    }else if(data.obj[i].recdepartinfo[j].state=='3'){
                                        data.obj[i].bgMain=true;
                                        data.obj[i].state_text='整改中';
                                    }
                            }
                        }
                       }else if(page.isSend==1){
                           if(data.obj[i].state=='0'){
                                   data.obj[i].bgBorder=true;
                                }else if(data.obj[i].state=='1'){
                                    data.obj[i].bgMain=true;
                                }else if(data.obj[i].state=='2'){
                                    data.obj[i].bgDanger=true;
                                    data.obj[i].state_text='已超时';
                                }
                       }
                    }
                    vm.listleftData=vm.listleftData.concat(data.obj);
                    vm.listleftDataQuery=vm.listleftData;
                    if(!isDefine(data.obj)&&page.num==1){
                        $("#appointNothing").removeClass("hide");
                     }else{
                        $("#appointNothing").addClass("hide");
                        vm.nonetRecive=false;
                        }

                }else if(dataIndex==1){
                    for(var i=0; i <  data.obj.length; i++){
                        if(data.obj[i].update_time!=0&&isDefine(data.obj[i].update_time)){
                            data.obj[i].update_time=timeStemp(data.obj[i].update_time,'MM-dd HH:mm').commonDate;
                        }else{
                            data.obj[i].update_time='--'
                        }
                        data.obj[i].content=unescape( data.obj[i].content);
                        if(data.obj[i].state=='3'){
                            data.obj[i].state_text='待审核';
                            data.obj[i].bgGreen=true;
                        }
                    }
                    vm.listmiddleData=vm.listmiddleData.concat(data.obj);
                    vm.listmiddleDataQuery=vm.listmiddleData;
                    if(!isDefine(data.obj)&&page.num==1){
                        $("#appoint1Nothing").removeClass("hide");
                    }else{
                        $("#appoint1Nothing").addClass("hide");
                        vm.nonetRecive=false;
                    }
                }else if(dataIndex==2){
                    for(var i=0; i <  data.obj.length; i++){
                        if(data.obj[i].finish_time!=0&&isDefine(data.obj[i].finish_time)){
                            data.obj[i].finish_time=timeStemp(data.obj[i].finish_time,'MM-dd HH:mm').commonDate;
                        }else{
                            data.obj[i].finish_time='--'
                        }
                        data.obj[i].content=unescape( data.obj[i].content);
                        if(data.obj[i].state=='4'){
                             data.obj[i].state_text='已关闭';
                             data.obj[i].bgClose=true;
                        }else if(data.obj[i].state=='5'||data.obj[i].state=='6'){
                            data.obj[i].bgClose=true;
                        }
                    }
                    vm.listrightData=vm.listrightData.concat(data.obj);
                    vm.listrightDataQuery=vm.listrightData;
                    if(!isDefine(data.obj)&&page.num==1){
                    $("#appoint2Nothing").removeClass("hide");
                }else{
                    $("#appoint2Nothing").addClass("hide");
                    vm.nonetRecive=false;
                }
                }
                mescroll[dataIndex].endSuccess(data.obj.length);
            }else{
                vm.nonetRecive=true;
                $("#appointNothing").addClass("hide");
                $("#appoint1Nothing").addClass("hide");
                $("#appoint2Nothing").addClass("hide");
                mescroll[dataIndex].endErr();
            }
        })
    };
;(function($) {
    
    /*创建MeScroll对象*/
 
     //初始化首页
       initMescroll("mescroll"+0,0,'0,1,2',0);
       initMescroll("mescroll"+1,1,'3',0);
       initMescroll("mescroll"+2,2,'4,5,6',0);
        
        appcan.locStorage.setVal('isSend',0);
        
        appcan.ready(function() {
         appcan.button("#nav-left", "btn-act", function() {
            appcan.window.close(-1)
            });
        //更新功能页消息数
        updateTaskNum();
         
        appcan.window.subscribe("reloadTaskList",function(msg){
            vm.listleftData = [];
            vm.listmiddleData = [];
            vm.listrightData = [];
            mescroll[0].resetUpScroll(true);
            mescroll[1].resetUpScroll(true);
            mescroll[2].resetUpScroll(true);
            
        })
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                var closeArr = ['duty-problem'];
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
            var closeArr = ['duty-problem'];
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
            vm.tagIndex=tagIndex;
        that.addClass(clsa).siblings().removeClass(clsa);
        box.eq(idx).addClass(clsa).siblings().removeClass(clsa);
        var state;
        if(tagIndex==0){
            state="0,1,2";
        }else if(tagIndex==1){
            state="3";
        }else{
            state="4,5,6";
        }
        var isSend=0;
        if(appcan.locStorage.getVal('isSend')==1){
            isSend=1;
        }
        $('body').scrollTop(0);
    });
    
    $("#nav-right").on("click",function(){
        vm.hasSearch = !vm.hasSearch;
    });
  
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
 
