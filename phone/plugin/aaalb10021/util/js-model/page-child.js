var platform = localStorage.getItem('myPlatform');
var mescroll;

var vm = new Vue({
    el: '#Page',
    data: {
    },
    mounted: function() {
        initMescroll();
    },
    methods: {
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
