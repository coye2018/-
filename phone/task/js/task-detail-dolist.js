var vm = new Vue({
    el: '#dolist',
    data: {
        doyes: [
            /*
            {
                hashead: true,
                headurl: 'http://touxiang.vipyl.com/attached/image/20130508/2013050816080214214.jpg',
                headtext: '鐧戒簯',
                realname: '111',
                finishtime: '2017-08-05 18:20:54'
            }*/
        ],
        dono: [
            /*
            {
                hashead: false,
                headurl: 'http://touxiang.vipyl.com/attached/image/20130508/2013050816080214214.jpg',
                headtext: '鐧戒簯',
                realname: '222'
            }*/
        ]
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
        var taskReceiver = JSON.parse(appcan.locStorage.getVal("taskReceiver"));
        // console.log(JSON.parse(JSON.stringify(taskReceiver)));
        if(isDefine(taskReceiver)){
            for (var i=0; i <taskReceiver.length; i++) {
                taskReceiver[i].headtext = taskReceiver[i].realname.substr(-2,2);
                taskReceiver[i].headbgclass = getHeadClass(taskReceiver[i].user_id);
                if(!isDefine(taskReceiver[i].headImage)){
                    taskReceiver[i].hashead=false;
                }else{
                    taskReceiver[i].hashead=true;
                    taskReceiver[i].headurl=serverPath+taskReceiver[i].headImage;
                }
            }
            vm.doyes=taskReceiver;
        }
         
        var taskUnReceiver = JSON.parse(appcan.locStorage.getVal("taskUnReceiver"));
        // console.log(JSON.parse(JSON.stringify(taskUnReceiver)));
        if(isDefine(taskUnReceiver)){
            for (var i=0; i <taskUnReceiver.length; i++) {
                taskUnReceiver[i].headtext = taskUnReceiver[i].realname.substr(-2,2);
                taskUnReceiver[i].headbgclass = getHeadClass(taskUnReceiver[i].user_id);
                if(!isDefine(taskUnReceiver[i].headImage)){
                    taskUnReceiver[i].hashead=false;
                }else{
                    taskUnReceiver[i].hashead=true;
                    taskUnReceiver[i].headurl=serverPath+taskUnReceiver[i].headImage;
                }
            }
            vm.dono=taskUnReceiver;
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
