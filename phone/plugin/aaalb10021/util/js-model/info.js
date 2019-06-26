var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        info_1: {
            label: '作业人',
            value: '李四'
        },
        info_2: {
            label: '翻新标志类型',
            value: ['跑道标识：接地带标识', '滑行道标识：信息标识']
        },
        info_3: {
            label: '备注',
            value: '因国际施工已撤离，经审批，决定启用114机位E类容量，具体如下： <br>XXXXXXX <br>XXXXXXXXXXXXXXXXXXXXXXXXXXXX <br>XXXXXXXXXXXXXX <br>XXXXXXX',
            direction: 'v'
        },
        info_4: {
            label: '图片',
            imgId: 'pic_show',
            imgArr: [{"url":"http://lorempixel.com/1333/750"},{"url":"http://lorempixel.com/820/500"},{"url":"http://lorempixel.com/600/600"},{"url":"http://lorempixel.com/1234/567"},{"url":"http://lorempixel.com/1920/1080"},{"url":"http://lorempixel.com/100/100"},{"url":"http://lorempixel.com/900/333"},{"url":"http://lorempixel.com/1280/1280"}],
        },
        info_5: {
            label: '接受人',
            value: '航管部门3人',
            
        },
        info_6: {
            title: '关于启用114机位E类容量的通知',
            d7n: [
                {label: '检查人', value: '张三'},
                {label: '检查时间', value: '11月22日15:30'}
            ],
            label: '作业人',
            value: '李四'
        }
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
