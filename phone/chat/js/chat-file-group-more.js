var vm = new Vue({
    el: '#chat-file-group-more',
    data: {
        groupMember: []
    },
    methods: {
        headpicReplace: function(vals){
            //加载头像失败, 替换成文字图像
            Vue.set(vals, 'hashead', false);
        },
        seeFile: function(vals){
            appcan.locStorage.setVal('thispeoplefile', JSON.stringify(vals));
            appcan.window.open('chat-file-people', 'chat-file-people.html', 2);
        }
    }
});

(function($) {
    var member = appcan.locStorage.getVal('groupmember');
    if(isDefine(member)){
        member = JSON.parse(member);
        //console.log(member);
    }
    
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        vm.groupMember = [].concat(member);
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
    
})($);