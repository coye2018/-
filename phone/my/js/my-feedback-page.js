Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
    el: '#fb',
    data: {
        
    },
    methods: {
       
    }
});

(function($) {

    appcan.ready(function() {
        
    });
    
    //问题详情(这个是示例用的, 后期要改)
    appcan.button("#arti_1", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-question-article','my-question-article.html',2);
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
    
    //聊天背景设置样例(这个是示例用的, 后期要改)
    appcan.button("#arti_3", "btn-act", function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('my-chat-background-set','my-chat-background-set.html',2);
        }else{
            appcan.window.open({
                name:'my-chat-background-set',
                dataType:0,
                data:'my-chat-background-set.html',
                aniId:aniId,
                type:1024
            });
        }
    });
    
    
})($);
