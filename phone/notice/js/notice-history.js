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
        noticeDateQuery:[],
        nonet:false
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
        unclick:function(item,index){
            //将通知id存入缓存中，以便于详情页获取。
            appcan.locStorage.setVal("noticeId",item.id);
            appcan.locStorage.setVal("noticeIsOner",true);
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
        searchFilter:function(){
            if(!isDefine(this.searchIpt)){
                vm.noticeDate=vm.noticeDateQuery;
                this.isunLock();
            }else{
                var noticeQuerySave=new Array();
                for (var i=0; i < vm.noticeDateQuery.length; i++) {
                  if(vm.noticeDateQuery[i].title.indexOf(this.searchIpt)!=-1||vm.noticeDateQuery[i].content.indexOf(this.searchIpt)!=-1){
                      noticeQuerySave.push(vm.noticeDateQuery[i]);
                  }
                };
                vm.noticeDate=noticeQuerySave;
                this.isLock();
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
var page=0;
var stop=false;
(function($) {
    
    appcan.button("#nav-left", "btn-act",
    function() {
        var closeArr = [ 'notice-send','notice-history'];
            closeArr.forEach(function(name){
                appcan.window.evaluateScript({
                    name:name,
                    scriptContent:'appcan.window.close(-1);'
                });
            });
    });
    
    appcan.button("#nav-right", "btn-act",
    function() {});
    
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
            callback: loadMyNotice
        }
    });

    appcan.ready(function() {
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                var closeArr = ['notice-send','notice-history'];
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(-1);'
                        });
                    });
            }
        };
        
        // close Page
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
            var closeArr = ['notice-send','notice-history'];
                closeArr.forEach(function(name){
                    appcan.window.evaluateScript({
                        name:name,
                        scriptContent:'appcan.window.close(-1);'
                    });
                });
        }
        //ios300ms延时
        FastClick.attach(document.body); 
    });
    
    //问题详情(这个是示例用的, 后期要改)
    appcan.button("#arti_1", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-question-article', 'my-question-article.html', 2);
        }else{
              appcan.window.open({
                name:'my-question-article',
                dataType:0,
                data:'my-question-article.html',
                aniId:aniId,
                type:1024
            });  
        }
    });
    
    // load data
    function  loadMyNotice(page){
        
        if (page.num == 1) {
            vm.noticeDate = [];
        }
        
        var json={
            path:serverPath+'focInformationInfoController.do?focgetSendInformations',
            data:{
                page: page.num - 1,
                size: page.size
            },
            layer:false,
            layerErr:false
        }
        ajaxRequest(json,function(data,e){
            if(e=="success"){
                vm.nonet=false;
                for (var i=0; i <  data.obj.length; i++) {
                   data.obj[i].create_time=timeStemp(data.obj[i].create_time,'MM-dd HH:mm').commonDate;
                   data.obj[i].content=unescape(data.obj[i].content);
                   if(data.obj[i].information_type==1){
                       data.obj[i].suchpeople="全体人员 ";
                   }else if(data.obj[i].information_type==2){
                       data.obj[i].suchpeople="全体值班人员 ";
                   }else{
                       if(data.obj[i].allpeoplesnum>1){
                           data.obj[i].suchpeople=data.obj[i].suchpeople+"等"+data.obj[i].allpeoplesnum+"人";
                       }else{
                           data.obj[i].suchpeople=data.obj[i].suchpeople;
                       }
                       
                   } 
                };
                if(isDefine(data.obj)){
                    vm.noticeDate = vm.noticeDate.concat(data.obj);
                    //用来做过滤用的
                    vm.noticeDateQuery = vm.noticeDate;
                }
                
                if(data.obj.length == 0 && page.num == 1){
                    $("#nothing").removeClass("hide");
                }else{
                    $("#nothing").addClass("hide");
                }
                
                mescroll.endSuccess(data.obj.length);
            }else{
                vm.nonet=true;
                mescroll.endErr();
            }
        });
    };
    
})($);

