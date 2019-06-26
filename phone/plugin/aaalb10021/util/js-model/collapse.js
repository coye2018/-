var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        clps_name_1: 'c1',
        clps_title_1: '我是默认显示的',
        clps_name_2: 'c2',
        clps_title_2: '我是默认隐藏的'
    },
    methods: {
        backto: function() {
            pageClose();
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
