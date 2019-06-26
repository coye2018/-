var platform = localStorage.getItem('myPlatform');
var mescroll;

//10个模拟数据
var testdata = [{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"}]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"}]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"}]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"}]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"214机位旁边","date":"2019-1-9"},{"name":"张三","department":"地勤公司","content":"问题回复内容问题回复内容问题回复内容问题回复内容","date":"2019-1-9"}]},{"name":"王玉","department":"机坪管理部","content":"请问具体地点是在哪里？","date":"2019-1-9","reply":[]}];

var vm = new Vue({
    el: '#Page',
    data: {
        comment: [],
        replyShowMax: 2,
        commentFullLen: 30,
        navWrap: null,
        navContent: null
    },
    mounted: function() {
        this.navWrap = this.$refs.navWrap;
        this.navContent = this.$refs.navContent;
        
        this.$nextTick(function() {
            initMescroll();
            listenNavSticky();
        })
    },
    methods: {
        replyStyleHandle: function() {
            var len = this.comment.length;
            if (len == 0) return;
            
            for (var d = 0; d < len; d++) {
                var comm = this.comment[d];
                var replyLen = comm.reply.length;
                var replyMore = replyLen > this.replyShowMax;
                
                this.$set(this.comment[d], 'replyMore', replyMore);//回复是否超过2条
                this.$set(this.comment[d], 'replyFlag', false);//控制所有回复折叠或展开
                this.$set(this.comment[d], 'replyText', '查看'+replyLen+'条回复&gt;');
            }
        },
        replyMore: function(i) {
            var replyFlags = this.comment[i].replyFlag;
            var replyLens = this.comment[i].reply.length;
            
            this.$set(this.comment[i], 'replyText', replyFlags ? '查看'+replyLens+'条回复&gt;' : '收起∧');
            this.$set(this.comment[i], 'replyFlag', !replyFlags);
        },
        isReplyMoreShow: function(itm, idx) {
            //回复完全展开, 或者折叠时只显示前replyShowMax个
            console.log(itm.replyFlag , idx , this.replyShowMax);
            return itm.hasOwnProperty('replyFlag') && (itm.replyFlag || idx < this.replyShowMax)
        }
    },
    computed: {
        navWrap: function() {
            return this.$refs.navWrap;
        },
        navContent: function() {
            return this.$refs.navContent;
        }
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

function getCommentData(page) {
    var vc = vm.comment;
    
    //模拟ajax
    setTimeout(function() {
        //先清空原数组和备用数组的数据
        if (page.num == 1) {
            vc.splice(0, vc.length);
        }
        
        //模拟处理数据, 模拟一个10条*3页的数据
        var moni = [];
        if (page.num < 4) {
            for (var b = 0; b < 10; b++) {
                var thisdata = testdata[b];
                var reply = thisdata.reply;
                thisdata.contentReal = unescape(thisdata.content); //一定要解码
                
                if (reply.length > 0) {
                    for (var c = 0; c < reply.length; c++) {
                        var sondata = reply[c];
                        sondata.contentReal = unescape(sondata.content);
                    }
                }
                
                moni = moni.concat(thisdata);
            }
            vm.comment = vm.comment.concat(moni);
            
            //节点更新完，开始处理样式
            vm.$nextTick(function() {
                vm.replyStyleHandle();
            })
            
            //联网成功的回调,隐藏下拉刷新的状态,参数是当前页获取的数据量
            mescroll.endSuccess(10);
        } else {
            mescroll.endSuccess(0);
        }
    }, 1000);
}

//监听滑动
function listenNavSticky() {
    var navWrap = vm.navWrap;
    var navContent = vm.navContent;
    var clsSticky = 'nav-sticky', clsFixed = 'nav-fixed';
    if (mescroll.os.ios) {
        //ios的悬停效果,通过给navWrap添加nav-sticky样式来实现
        navWrap.classList.add(clsSticky);
    } else {
        //android和pc端悬停效果,通过监听mescroll的scroll事件,控制navContent是否为fixed定位来实现
        navWrap.style.height = navWrap.offsetHeight + 'px';//固定高度占位,避免悬浮时列表抖动
        mescroll.optUp.onScroll = function(mescroll, y, isUp) {
            //console.log("up --> onScroll 列表当前滚动的距离 y = " + y + ", 是否向上滑动 isUp = " + isUp);
            if (y >= navWrap.offsetTop) {
                navContent.classList.add(clsFixed);
            } else {
                navContent.classList.remove(clsFixed);
            }
        };
    }
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
