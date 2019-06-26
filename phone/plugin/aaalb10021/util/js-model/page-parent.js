var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
    },
    methods: {
        backto: function() {
            pageClose();
        }
    }
});

(function($) {
    appcan.ready(function() {
        popover({
            name: 'page-child',
            footer: 'Footer'
        })
        
        window.onorientationchange = window.onresize = function() {
            popover({
                isResize: true,
                name: 'page-child',
                footer: 'Footer'
            })
        };
        
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
