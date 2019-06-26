var platform = localStorage.getItem('myPlatform');
var swiper_show;

var vm = new Vue({
    el: '#Page',
    data: {
    },
    mounted: function() {
        initPicSlide();
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

//图片展示
function initPicSlide() {
    swiper_show = new Swiper('#pic_show', {
        slidesPerView: 'auto',
        freeMode: true,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 10
        },
    });
}