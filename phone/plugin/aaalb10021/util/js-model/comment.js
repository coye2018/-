var platform = localStorage.getItem('myPlatform');
var mescroll;

var vm = new Vue({
    el: '#Page',
    data: {
        comment: [
            {
                "name": "王玉",
                "department": "机坪管理部",
                "content": "请问具体地点是在哪里？",
                "date": "2019-1-9",
                "id": "1550564669",
                "reply": [
                    {
                        "name": "张三",
                        "department": "地勤公司",
                        "reply_name": "王玉",
                        "reply_department": "机坪管理部",
                        "content": "214机位旁边",
                        "date": "2019-1-9",
                        "id": "1550564679"
                    },
                    {
                        "reply_name": "张三",
                        "reply_department": "地勤公司",
                        "name": "王玉",
                        "department": "机坪管理部",
                        "content": "谢谢！",
                        "date": "2019-1-9",
                        "id": "1550564689"
                    },
                    {
                        "name": "张三",
                        "department": "地勤公司",
                        "reply_name": "王玉",
                        "reply_department": "机坪管理部",
                        "content": "不用",
                        "date": "2019-1-9",
                        "id": "1550564699"
                    }
                ]
            },
            {
                "name": "王玉",
                "department": "机坪管理部",
                "content": "请问具体地点是在哪里？",
                "date": "2019-1-9",
                "id": "1550564709",
                "reply": []
            }
        ]
    },
    mounted: function() {
        //initMescroll();
    },
    methods: {
        backto: function() {
            pageClose();
        },
        commentHandle: function(obj) {
            console.log(obj);
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

function getCommentData() {
    
}

//创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据
function initMescroll() {
    mescroll = new MeScroll('mescroll', {
        up: {
            callback: getCommentData,
            warpId: 'upscrollWarp', //让上拉进度装到upscrollWarp里面
            noMoreSize: 4,
            empty: {
                warpId: 'upscrollWarp',
                icon: '../img/nothing.png'
            },
            page: {
                num: 0,
                size: 10
            },
            lazyLoad: {
                use: true
            }
        }
    })
}
