var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        keyword: '',
        myKeyword: ''
    },
    methods: {
        backto: function() {
            pageClose();
        },
        searchCallback: function(res) {
            this.keyword = unescape(res);
            layerToast('你输入的是：' + this.keyword);
        },
        mySearchCallback: function(res) {
            this.myKeyword = unescape(res);
            layerToast('你输入的是：' + this.myKeyword);
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
