var vm = new Vue({
    el: '#readlist',
    data: {
        readyes: [
            // {
                // hashead: true,
                // headurl: 'http://touxiang.vipyl.com/attached/image/20130508/2013050816080214214.jpg',
                // headtext: '白云',
                // userName: '111'
            // }
        ],
        readno: []
    },
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    methods: {
        headpicReplace: function(val){
            val.hashead = false;
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        //已读
        var noticeRecever = JSON.parse(appcan.locStorage.getVal("noticeRecever"));
        if(isDefine(noticeRecever)){
            for (var i=0; i <noticeRecever.length; i++) {
                noticeRecever[i].headtext = noticeRecever[i].realname.substr(-2,2);
                noticeRecever[i].headbgclass = getHeadClass(noticeRecever[i].user_id);
                if(!isDefine(noticeRecever[i].headurl)){
                    noticeRecever[i].hashead=false;
                }else{
                    noticeRecever[i].hashead=true;
                    noticeRecever[i].headurl=serverPath+noticeRecever[i].headurl;
                }
            };
            vm.readyes=noticeRecever;
        }
        
        //未读
        var noticeUnRecever = JSON.parse(appcan.locStorage.getVal("noticeUnRecever"));
        if(isDefine(noticeUnRecever)){
            for (var i=0; i <noticeUnRecever.length; i++) {
                noticeUnRecever[i].headtext = noticeUnRecever[i].realname.substr(-2,2);
                noticeUnRecever[i].headbgclass = getHeadClass(noticeUnRecever[i].user_id);
                if(!isDefine(noticeUnRecever[i].headurl)){
                    noticeUnRecever[i].hashead=false;
                }else{
                    noticeUnRecever[i].hashead=true;
                    noticeUnRecever[i].headurl=serverPath+noticeUnRecever[i].headurl;
                }
            };
            vm.readno=noticeUnRecever;
        }
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
    });
    
    $('.tab-pill-box').on('click', '.tab-pill-text', function(e){
        var that = $(this),
            idx = that.index(),
            box = $('.tab-box'),
            clsa = 'actives';
        
        that.addClass(clsa).siblings().removeClass(clsa);
        box.eq(idx).addClass(clsa).siblings().removeClass(clsa);
        $('body').scrollTop(0);
    });
    
})($);
