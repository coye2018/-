var vm = new Vue({
    el: '#bg',
    data: {
        bgData: [],
        bgCur: -1
    },
    methods: {
        pickBg: function(itm, idx){
            if(this.bgCur == idx) return;
            this.bgCur = idx;
            appcan.locStorage.setVal('chatbg', itm.bgclass);
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.publish('my-general-bg-name', vm.bgData[vm.bgCur].bgname);
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    var chatbgdata = appcan.locStorage.getVal('chatbgdata');
    vm.bgData = [].concat(JSON.parse(chatbgdata));
    
    var chatbg = appcan.locStorage.getVal('chatbg');
    for(var g=0; g<vm.bgData.length; g++){
        if(chatbg == vm.bgData[g].bgclass){
            vm.bgCur = g;
            break;
        }
    }
    
    appcan.ready(function() {
        appcan.window.publish("my-general-bg-click","my-general-bg-click");
    });
    
})($);
