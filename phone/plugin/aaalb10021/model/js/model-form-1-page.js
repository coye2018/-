var platform = localStorage.getItem('myPlatform');

var testdata = [{"name":"站坪","id":"111"},{"name":"跑道","id":"222"},{"name":"滑行道","id":"333"},{"name":"服务车道","id":"444"},{"name":"只是想测试字数很长的情况所以你问我什么道我说我不知道","id":"555"},{"name":"其它","id":"-1"}];
var testdata_2 = [{"name":"例行清扫","id":"111"},{"name":"道面受到污染或有异物、杂物","id":"222"},{"name":"专机或重要航班保障","id":"333"},{"name":"专机或重要航班保障2","id":"444"},{"name":"专机或重要航班保障3","id":"555"},{"name":"专机或重要航班保障4","id":"666"},{"name":"专机或重要航班保障5","id":"777"},{"name":"专机或重要航班保障6","id":"888"},{"name":"专机或重要航班保障7","id":"999"},{"name":"其它","id":"-1"}];

//textarea高度可伸缩
Vue.directive('textarea', {
    bind: function(el, binding) {
        autosize(el);
        
        if (binding.value) {
            binding.value.readonly ? el.setAttribute('readonly', true) : el.removeAttribute('readonly');
        }
        
        if (binding.value && binding.value.focus) {
            el.focus();
        }
    },
    update: function(el, binding) {
        autosize.update(el);
        
        if (binding.value) {
            binding.value.readonly ? el.setAttribute('readonly', true) : el.removeAttribute('readonly');
        }
        
        if (binding.value && binding.value.focus) {
            el.focus();
        }
    }
});

var vm = new Vue({
    el: '#Page',
    data: {
        people: '',
        dateStart: {
            text: '',
            stamp: 0
        },
        dateEnd: {
            text: '',
            stamp: 0
        },
        pick: [],
        pickArr: [],
        txa: '',
        txaObj: {
            readonly: true,
            focus: false
        },
        pick_2: [],
        pickArr_2: [],
        txa_2: '',
        txaObj_2: {
            readonly: true,
            focus: false
        },
        note: '',
        btnLock: false
    },
    created: function() {
        this.initDefaultDate();
        this.simulateData();
    },
    mounted: function() {
        initMescroll();
        initDatepick_start();
        initDatepick_end();
    },
    methods: {
        initDefaultDate: function() {
            //设定初始显示的时间
            var xd = timeStemp(new XDate.today());
            
            this.dateStart = {
                'text': xd.fullDate,
                'stamp': xd.dateTimeSecond
            };
            this.dateEnd = {
                'text': xd.fullDate,
                'stamp': xd.dateTimeSecond
            };
        },
        simulateData: function() {
            //这个只是模拟获取数据处理数据的方法, 变量名只是随便取的, 正式开发随便改
            for (var a = 0; a < testdata.length; a++) {
                testdata[a]['active'] = false;
            }
            this.pick = [].concat(testdata);
            
            for (var g = 0; g < testdata_2.length; g++) {
                testdata_2[g]['active'] = false;
            }
            this.pick_2 = [].concat(testdata_2);
        },
        pickup: function(obj) {
            /**
             *  点选框picker操作（多选+其他）
             *
             *  @param {Array} obj.arr 要进行选择的数组（必填）
             *  @param {Object} obj.itm 点击的当前项（必填）
             *  @param {Number} obj.idx 点击的当前项下标（必填）
             *  @param {String} obj.txa 填充文字的输入框绑定值叫啥（必填，一定要带单引号）
             *  @param {Object} obj.txaObj 输入框的设置值（必填）
             *  @param {Array} obj.target 所有选中条目的集合（必填）
             */
            var item_cache = obj.itm;
            var flag = item_cache.active;
            
            //只有在选择"其他"时, 输入框不为readonly
            obj.txaObj.readonly = (item_cache.id != -1 || flag);
            obj.txaObj.focus = false;
            
            if (item_cache.id == -1) {
                //点击"其他"无论是否选中，输入框都要清空
                this.$set(this, obj.txa, '');
                
                //如果即将选中, 之前选择的都要清空和还原
                if (!flag) {
                    obj.target.splice(0, obj.target.length);
                    for (var d = 0; d < obj.arr.length; d++) {
                        this.$set(obj.arr[d], 'active', false);
                    }
                    obj.txaObj.focus = true;
                }
            } else {
                //点击选择or取消选择
                if (!flag) {
                    //如果原先选中了"其他", 则清空输入框, 取消选中
                    for (var f = obj.arr.length-1; f >= 0; f--) {
                        var this_p = obj.arr[f];
                        if (this_p.id == -1 && this_p.active) {
                            this.$set(this, obj.txa, '');
                            this.$set(obj.arr[f], 'active', false);
                        }
                    }
                    
                    obj.target.push({
                        'name': item_cache.name,
                        'id': item_cache.id
                    });
                    this.$set(this, obj.txa, this[obj.txa] + item_cache.name + ' ');
                } else {
                    var parr = obj.target;
                    for (var c = 0; c < parr.length; c++) {
                        if (parr.id == item_cache.id) {
                            obj.target.splice(c, 1);
                        }
                        break;
                    }
                    this.$set(this, obj.txa, this[obj.txa].replace(item_cache.name + ' ', ''));
                }
            }
            
            //最后才改变当前按钮的状态
            this.$set(obj.itm, 'active', !item_cache.active);
        },
        formVerify: function() {
            //表单校验
            if (this.btnLock) return false;
            
            if (this.people.trim() == '') {
                this.slideFocus('wwwwwwwwww', '请输入作业人。');//id为输入框
                return false;
            }
            if (this.txa.trim() == '') {
                this.slideFocus('xxxxxxxxxx', '请选择清扫位置。');//id为输入框的祖先节点
                return false;
            }
            if (this.note.trim() == '') {
                this.slideFocus('yyyyyyyyyy', '请输入备注。');//id为输入框的祖先节点的上一个节点
                return false;
            }
            
            this.submitData();
        },
        submitData: function() {
            //这里只是模拟ajax提交数据
            var loading = layerLoading();
            appcan.window.publish('model-form-1-shade', '1');//如有需要，外层页面也要有遮罩效果
            this.btnLock = true;//避免重复点击、多次提交数据
            
            setTimeout(function() {
                layerRemove(loading);
                appcan.window.publish('model-form-1-shade', '0');
                vm.btnLock = false;
            }, 2000);
        },
        slideFocus: function(id, toast) {
            /**
             *  定位到输入框并获得焦点
             *
             *  @param {String} id 输入框/输入框的祖先节点/输入框的祖先节点的上一个节点 的id值。必填
             *  @param {String} toast 提示字样, 默认则为'loading'
             */
            
            var _this = document.getElementById(id);
            var jq = $('#' + id);
            var domParent = _this;
            var domChild = _this;
            var top = domParent.offsetTop;
            
            //如果不是content的子元素,则继续往上遍历,并记录每层的偏移量
            while (domParent.getAttribute('id') != 'mescroll_content') {
                domParent = domParent.parentNode;
                top += domParent.offsetTop;
            }
            mescroll.scrollTo(top, 150);
            
            
            if (jq.is('input, textarea')) {
                jq.focus();
            } else if (jq.find('input, textarea').length > 0) {
                jq.find('input, textarea').first().focus();
            } else if (jq.next() && jq.next().find('input, textarea').length > 0){
                jq.next().find('input, textarea').first().focus();
            }
            layerToast(toast);
        }
    }
});

(function($) {
    appcan.button('#nav-left', 'btn-act',function() {
        pageClose();
    });
    
    appcan.ready(function() {
        appcan.window.subscribe('model-form-1-submit', function(v) {
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

function pageClose() {
    appcan.window.close(1);
}

//创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据
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

//初始化日期选择器
function initDatepick_start() {
    var selectDateDom = document.getElementById('date_start');
    var dateObj = initDate(selectDateDom);
    
    selectDateDom.addEventListener('click', function () {
        var iosSelect = new IosSelect(3, [dateObj.yearData, dateObj.monthData, dateObj.dateData], {
            title: '作业开始时间',
            oneLevelId: selectDateDom.getAttribute('data-year'),
            twoLevelId: selectDateDom.getAttribute('data-month'),
            threeLevelId: selectDateDom.getAttribute('data-date'),
            callback: function (one, two, three) {
                var ts_start = timeStemp(one.id+'/'+(two.id)+'/'+three.id);
                selectDateDom.setAttribute('data-year', one.id);
                selectDateDom.setAttribute('data-month', two.id);
                selectDateDom.setAttribute('data-date', three.id);
                vm.dateStart = {
                    'text': ts_start.fullDate,
                    'stamp': ts_start.dateTimeSecond
                };
            }
        });
    });
}
function initDatepick_end() {
    var selectDateDom = document.getElementById('date_end');
    var dateObj = initDate(selectDateDom);
    
    selectDateDom.addEventListener('click', function () {
        var iosSelect = new IosSelect(3, [dateObj.yearData, dateObj.monthData, dateObj.dateData], {
            title: '作业结束时间',
            oneLevelId: selectDateDom.getAttribute('data-year'),
            twoLevelId: selectDateDom.getAttribute('data-month'),
            threeLevelId: selectDateDom.getAttribute('data-date'),
            callback: function (one, two, three) {
                var ts_end = timeStemp(one.id+'/'+(two.id)+'/'+three.id);
                selectDateDom.setAttribute('data-year', one.id);
                selectDateDom.setAttribute('data-month', two.id);
                selectDateDom.setAttribute('data-date', three.id);
                vm.dateEnd = {
                    'text': ts_end.fullDate,
                    'stamp': ts_end.dateTimeSecond
                };
            }
        });
    });
}
