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
    appcan.button('#nav-left', 'btn-act',function() {
        pageClose();
    });
    
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

//下拉刷新首页数据
function getIndexData() {
    //模拟ajax
    setTimeout(function() {
        mescroll.endSuccess(); //无参. 注意结束下拉刷新是无参的
    }, 1000);
}

//创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,重置列表数据;
function initMescroll() {
    mescroll = new MeScroll('mescroll', {
        up: {
            use: false
        },
        down: {
            callback: getIndexData
        }
    });
}
