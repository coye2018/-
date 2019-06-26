var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        st_1: {
            size: 'large',
            color: 'blue',
            bg: true,
            loading: false
        },
        st_2: {
            size: 'large',
            color: 'orange',
            bg: true,
            isDisabled: true
        },
    },
    methods: {
        backto: function() {
            pageClose();
        },
        doSomething_1: function() {
            var that = this;
            this.st_1.loading = true;
            
            //模拟ajax
            setTimeout(function() {
                layerToast('假装提交成功！');
                that.st_1.loading = false;
            }, 1500);
        },
        doSomething_2: function() {
            layerToast('真的被禁用就弹不出这个框了！');
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
