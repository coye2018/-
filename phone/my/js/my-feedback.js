Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
    el: '#Page',
    data: {
        searchIpt: '',
        isToInput: false
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
        
        createPopover();
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
    });
    
    function createPopover () {
        var titleHeight = parseFloat($('#Header').height()),
            footerHeight = parseFloat($('#Footer').height()),
            pageHeight = parseFloat($('#Page').height()),
            pageWidth = parseFloat($('#Page').width());
        appcan.window.openPopover({
            name: 'my-feedback-page',
            url: 'my-feedback-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight-footerHeight
        });
    };

    
    //全部问题
    appcan.button("#btn_qt", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-question-list','my-question-list.html',2);
        }else{
            appcan.window.open({
                name:'my-question-list',
                dataType:0,
                data:'my-question-list.html',
                aniId:aniId,
                type:1024
            });
        }
        
    });
    
    //意见反馈
    appcan.button("#btn_fb", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-feedback-form','my-feedback-form.html',2);
        }else{
            
            appcan.window.open({
                            name:'my-feedback-form',
                            dataType:0,
                            data:'my-feedback-form.html',
                            aniId:aniId,
                            type:1024
                        });
        }
        
    });
    
})($);
