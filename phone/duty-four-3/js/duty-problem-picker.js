var platForm = appcan.locStorage.getVal('platForm');

var vm = new Vue({
    el: '#taskType',
    data: {
        typeData: [],
        checked: -1
    },
    methods: {
        pick: function(itm, idx){
            this.checked = idx;
            appcan.window.publish('duty-problem-picker-result', JSON.stringify(itm));
            closePage();
        }
    }
});

function closePage() {
    appcan.window.close(1);
}

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        closePage()
    });
    appcan.button("#nav-right", "btn-act", function() {});

    appcan.ready(function() {
        var typeStr = appcan.locStorage.getVal('duty-problem-dept'),
            typeJson = JSON.parse(typeStr),
            typeThis = appcan.locStorage.getVal('duty-problem-dept-this');
        
        if(isDefine(typeStr)){
            for (var z = 0; z < typeJson.length; z++) {
                if (typeThis == typeJson[z].id) {
                    vm.checked = z;
                    break;
                }
            }
            vm.typeData = [].concat(typeJson);
            
            appcan.locStorage.remove('duty-problem-dept');
            appcan.locStorage.remove('duty-problem-dept-this');
        }
        
        //监听系统返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                closePage();
            }
        };
        
        var paramClose = {
            isSupport: (platForm != '1')
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            closePage()
        }
    });
})($);