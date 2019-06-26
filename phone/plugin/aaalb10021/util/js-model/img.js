var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        imgId: 'pic_show',
        imgArr: [{"url":"http://lorempixel.com/1333/750"},{"url":"http://lorempixel.com/820/500"},{"url":"http://lorempixel.com/600/600"},{"url":"http://lorempixel.com/1234/567"},{"url":"http://lorempixel.com/1920/1080"},{"url":"http://lorempixel.com/100/100"},{"url":"http://lorempixel.com/900/333"},{"url":"http://lorempixel.com/1280/1280"}],
        uploadId: 'pic_upload',
        uploadArr: [],
        url:""
    },
    mounted: function () {
        //可以通过ref操纵里面的方法和属性
        console.log(this.$refs.upload.imgSwiper);
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
