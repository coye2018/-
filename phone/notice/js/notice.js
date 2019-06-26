Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});
var mescroll = null;
var vm = new Vue({
    el: '#notice',
    data: {
        searchIpt: '',
        isToInput: false,
        noticeDate:[],
        nonet:false,
        noticeQuery:[]
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
        searchFilter:function(){
            if(!isDefine(this.searchIpt)){
                vm.noticeDate=vm.noticeQuery;
                this.isunLock();
            }else{
                var noticeQuerySave=new Array();
                for (var i=0; i < vm.noticeQuery.length; i++) {
                  if(vm.noticeQuery[i].title.indexOf(this.searchIpt)!=-1||vm.noticeQuery[i].content.indexOf(this.searchIpt)!=-1){
                      noticeQuerySave.push(vm.noticeQuery[i]);
                  }
                };
                vm.noticeDate=noticeQuerySave;
                this.isLock();
            }
        },
        searchEmpty: function(){
            //清除输入框
            this.searchIpt = '';
            this.isToInput = false;
            this.searchFilter();
        },
        unclick:function(item,index){
            //将通知id存入缓存中，以便于详情页获取。
            appcan.locStorage.setVal("noticeId",item.id);
            var noticeIsOner=appcan.locStorage.setVal("noticeIsOner",false);
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("notice-detail","notice-detail.html",2);
            }else{
                  appcan.window.open({
                    name:'notice-detail',
                    dataType:0,
                    data:'notice-detail.html',
                    aniId:aniId,
                    type:1024
                });  
            }
        },
        isLock:function(){
            mescroll.lockDownScroll(true);
            mescroll.lockUpScroll(true);
        },
        isunLock:function(){
            mescroll.lockDownScroll(false);
            mescroll.lockUpScroll(false);
        }
    }
});


;(function($) {
    
    // 上下拉加载
    mescroll = new MeScroll('mescroll', {
        down: {
            auto: false
        },
        up: {
            use: true,
            auto: true,
            page: {
                num : 0, 
                size : 10
            },
            callback: loadreciveNotice
        }
    }); 
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.button("#nav-right", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('notice-history', 'notice-history.html', 2);
        }else{
              appcan.window.open({
                name:'notice-history',
                dataType:0,
                data:'notice-history.html',
                aniId:aniId,
                type:1024
            });  
        }
    });

    appcan.ready(function() {
        
        //更新功能页消息数
        updateNoticeNum();
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        appcan.window.subscribe("reloadNotice",function(msg){
            vm.noticeDate = [];
            mescroll.resetUpScroll(true);
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
    });
    
    function loadreciveNotice(page){
        
        if (page.num == 1) {
            vm.noticeDate = [];
        }
        
        var json={
            path:serverPath+'focInformationInfoController.do?focgetReceivedInformations',
            data:{
                page: page.num -1,
                size: page.size
                
            },
            layer: false,
            layerErr: false
        }
        ajaxRequest(json,function(data,e){
            if(e=="success"){
                
                mescroll.endSuccess(data.obj.length);
                
                vm.nonet=false;
                for (var i=0; i <  data.obj.length; i++) {
                   data.obj[i].received_time=timeStemp(data.obj[i].received_time,'MM-dd HH:mm').commonDate;
                   data.obj[i].content=unescape(data.obj[i].content);
                };
                if(isDefine(data.obj)){
                    vm.noticeDate=vm.noticeDate.concat(data.obj);
                    vm.noticeQuery=vm.noticeDate;
                    
                }
                
                if(!isDefine(vm.noticeDate)){
                    $("#nothing").removeClass("hide");
                }else{
                    $("#nothing").addClass("hide");
                }
            }else{
                vm.nonet=true;
                mescroll.endErr();
            }
        });
    };
    
    /**
     * 修改通知的消息数。
     */
    function updateNoticeNum(){
        var json={
            path:serverPath+'focCommonController.do?focclearMessageNum',
            data:{
                model: appcan.locStorage.getVal("optionFunctionid")
            },
            layer:false
        }
        ajaxRequest(json,function(data,e){
            if(e=="success"){
                //通知功能页更新消息数
                appcan.window.publish("option-get-num","option-get-num");
            }else{
            }
        });
    };
    
})($);
