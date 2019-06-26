var swiper;
var mes_lock = false; //是否锁定下拉刷新
var mescroll = new Array(3);

var vm = new Vue({
    el: '#Page',
    data: {
        search: '',
        index: 0,
        prev: 0,
        li_0: [],
        li_copy_0: [],
        li_1: [],
        li_copy_1: [],
        li_2: [],
        li_copy_2: []
    },
    created: function() {
    },
    mounted: function() {
        initSwiper();
        initMescroll(this.index);
    },
    methods: {
        tabSwitch: function(i) {
            //tab切换到第i个显示
            this.index = i;
            swiper.slideTo(i, 0, false);
        }
    }
});

(function($) {
    appcan.ready(function() {
        //主页面搜索框
        appcan.window.subscribe('tab-list-search', function(v) {
            vm.search = v;
        });
    })
})($);

/**
 * 获取数据
 * @param {Object} page mescroll上拉加载的page对象
 */
function getListData(page) {
    var index = page.index;
    var vli = vm['li_' + index];
    var vcopy = vm['li_copy_' + index];
    
    //模拟ajax
    setTimeout(function() {
        //先清空原数组和备用数组的数据
        if (page.num == 1) {
            vli.splice(0, vli.length);
            vcopy.splice(0, vcopy.length);
        }
        
        //模拟处理数据, 模拟一个10条*3页的数据。改成page.num < 0可以看无数据的效果
        var moni = [];
        if (page.num < 4) {
            for (var b = 0; b < 10; b++) {
                moni = moni.concat((page.num-1)*10 + b);
            }
            vm['li_' + index] = vm['li_' + index].concat(moni);
            vm['li_copy_' + index] = vm['li_copy_' + index].concat(moni);
            
            //联网成功的回调,隐藏下拉刷新的状态,参数是当前页获取的数据量
            mescroll[index].endSuccess(10);
        } else {
            mescroll[index].endSuccess(0);
        }
    }, 1000);
}

//上下拉初始化
function initMescroll(id) {
    mescroll[id] = new MeScroll('mescroll' + id, {
        down: {
            auto: false
        },
        up: {
            auto: true,
            noMoreSize: 4,
            page: {
                num: 0,
                size: 10,
                index: id
            },
            empty: {
                warpId: 'mes_wrap' + id,
                icon: '../img/nothing.png'
            },
            lazyLoad: {
                use: true,
                attr: 'v-lazy'
            },
            callback: getListData
        }
    });
    return mescroll[id];
}

//滑动插件初始化
function initSwiper() {
    swiper = new Swiper('.swiper-main', {
        resistanceRatio: 0,
        spaceBetween : 14,
        on: {
            sliderMove: function(e) {
                //顺序1:手指触碰Swiper并拖动slide时
                if (!mes_lock) {
                    mes_lock = true;
                    mescroll[vm.prev].lockDownScroll(mes_lock);
                }
            },
            touchEnd: function(e) {
                //顺序2:触摸释放时
                if (mes_lock) {
                    mes_lock = false;
                    mescroll[vm.prev].lockDownScroll(mes_lock);
                }
            },
            transitionStart: function() {
                //顺序3:过渡开始时
                var indx = this.activeIndex;
                vm.index = indx;
                
                //取出菜单所对应的mescroll对象,如果未初始化则初始化
                if (mescroll[indx] == null) {
                    initMescroll(indx);
                }
            },
            transitionEnd: function() {
                //顺序4:过渡结束时
                var prev = vm.prev;
                var inde = this.activeIndex;
                
                mescroll[prev].scrollTo(0, 0);
                mescroll[prev].lockDownScroll(false);
                
                var domScroll = vm.$refs.tabScroll;
                var domCur = domScroll.getElementsByClassName('tab-item')[inde];
                var start = domScroll.scrollLeft;
                var end = domCur.offsetLeft + domCur.clientWidth/2 - document.body.clientWidth/2;
                //从当前位置逐渐移动到中间位置,默认时长300ms
                mescroll[inde].getStep(start, end, function(step, timer){
                    domScroll.scrollLeft = step;
                });
                
                vm.prev = inde;
            }
        }
    });
}
