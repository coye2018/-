var vm = new Vue({
    el: '#duty_problem_notice',
    data: {
        nt: [
            {
                flag: false,
                title: '报送问题',
                content: '报送问题用来报送值班问题，各单位值班领导在四必巡查过程中，可使用此功能报送自己发现的问题。'
            },{
                flag: false,
                title: '已报问题',
                content: '已报问题用来查看自己已经报送的值班问题，如果您报送的问题被责任部门退回，则可以在此功能模块里重新派发给正确的区域管理部门。'
            },{
                flag: false,
                title: '区域问题',
                content: '区域问题用来处理自己管辖区域内所有的问题，只有四大区域管理部门才能看到此模块。区域管理部门可通过此模块处理其他单位报送给本区域的问题，支持退回事件、转派事件或者自己处理，同时也可以验收自己转派给其他单位的问题。'
            },{
                flag: false,
                title: '我的问题',
                content: '我的问题用来处理责任单位为本单位的所有问题，各单位值班账号或者问题处理专员可以通过此功能接受其他单位报送的问题、退回不属于本单位的问题或者完成已经整改完成的问题。'
            }
        ]
    },
    methods: {
        show: function(obj) {
            obj.flag = !obj.flag;
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act", function() {});
    
    appcan.ready(function() {
        var paramClose = {
            isSupport: (appcan.locStorage.getVal('platForm') != '1')
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function() {
             appcan.window.close(1); 
        };
    });
    
})($);