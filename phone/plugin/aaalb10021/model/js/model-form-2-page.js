var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
    },
    created: function() {
    },
    mounted: function() {
        initMescroll();
    },
    methods: {
    }
});

(function($) {
    appcan.button('#nav-left', 'btn-act',function() {
        pageClose();
    });
    
    appcan.ready(function() {
        appcan.window.subscribe('model-form-2-submit', function(v) {
            vm.formVerify();
        });
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                pageclose();
            }
        };
    })
})($);

//创建MeScroll对象
function initMescroll() {
    mescroll = new MeScroll('mescroll', {
        up: {
            use: false
        },
        down: {
            use: false
        }
    })
}
function pageClose() {
    appcan.window.close(1);
}
