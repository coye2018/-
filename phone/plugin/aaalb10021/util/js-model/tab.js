var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        tabList: ['整改中', '待验收', '已关闭'],
        tabIndex: 0,
        tabClass: 'tab-xxx'
    },
    methods: {
        backto: function() {
            pageClose();
        },
        changeTab: function(obj) {
            //console.log(obj);
        },
        jumpTo: function(i) {
            this.$refs.tab.tabClick(i);
        }
    }
});

(function($) {
    appcan.ready(function() {
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                pageclose();
            }
        };
    })
})($);

function pageClose() {
    appcan.window.close(1);
}
