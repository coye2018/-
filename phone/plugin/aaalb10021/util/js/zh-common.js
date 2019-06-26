//头部
Vue.component('zh-header', {
    props: {
        showLeft: {
            //是否显示左侧返回键
            type: Boolean,
            default: true
        },
        showRight: {
            //右侧按钮显示多少个, 只能为0/1/2
            type: Number,
            default: 0,
            validator: function(v) {
                return [0, 1, 2].indexOf(v) != -1
            }
        }
    },
    template: `
            <div class="uh bg-header border-btm" data-control="HEADER" id="Header">
                <div class="header">
                    <div class="nav-btn" id="nav-left" v-if="showLeft">
                        <div class="nav-btn-item" id="nav-back" @click="$emit('left')">
                            <i class="icon-20 icon-black-backto"></i>
                        </div>
                    </div>
                    <div class="nav-main ub-f1 ub ub-ac ub-pc">
                        <div class="nav-title inaline fz-xl">
                            <slot></slot>
                        </div>
                    </div>
                    <div class="nav-btn" id="nav-right">
                        <div class="nav-btn-item" @click="$emit('right-one')" v-if="showRight == 1 || showRight == 2">
                            <slot name="right1"></slot>
                        </div>
                        <div class="nav-btn-item" @click="$emit('right-two')" v-if="showRight == 2">
                            <slot name="right2"></slot>
                        </div>
                    </div>
                </div>
                <slot name="other"></slot>
            </div>`
});

//底部
Vue.component('zh-footer', {
    template: `
            <div class="uf" data-control="FOOTER" id="Footer">
                <slot></slot>
            </div>`
});

//底部按钮
Vue.component('zh-footer-btn', {
    props:{
        btnLength: {
            //底部按钮个数, 只能为1/2
            type: Number,
            default: 1,
            validator: function(v) {
                return [1, 2].indexOf(v) != -1
            }
        }
    },
    template: `
                <div class="footer-btn ub">
                    <div class="footer-btn-item ub-f1">
                        <slot name="btn1"></slot>
                    </div>
                    <div class="footer-btn-item ub-f1" v-if="btnLength == 2">
                        <slot name="btn2"></slot>
                    </div>
                </div>`
});

//主体
Vue.component('zh-content', {
    props:{
        //手动设置padding-top和padding-bottom的带单位数值, 不填则使用css里默认写好的值
        pdTop: String,
        pdBottom: String
    },
    computed: {
        contentStyle: function() {
            var styleObj = {};
            if (this.pdTop) {
                styleObj['padding-top'] = this.pdTop;
            }
            if (this.pdBottom) {
                styleObj['padding-bottom'] = this.pdBottom;
            }
            
            return styleObj;
        }
    },
    template: `
                <div class="bc-bg ub ub-ver" data-control="FLEXBOXVER" id="ContentFlexVer" :style="contentStyle">
                    <slot></slot>
                </div>`
});

//有时要隐藏列表顶上的边框
Vue.directive('hide-border-top', {
    inserted: function(el) {
        el.classList.add('border-hide');
    }
})

//有时要在外层列表加下边距
Vue.directive('margin-bottom', {
    inserted: function(el) {
        el.classList.add('mg-box');
    }
})

//列表
Vue.component('zh-list', {
    template: '<div class="list bg-white"><slot></slot></div>'
});

//列表项
Vue.component('zh-list-item', {
    template: '<div class="list-item"><slot></slot></div>'
});

//按钮或标签
Vue.component('zh-btn', {
    props: {
        color: String,
        bg: Boolean,
        size: String,
        radius: Boolean,
        multi: Boolean,
        loading: Boolean,
        isDisabled: Boolean,
        otherClass: String
    },
    computed: {
        btn_color: function() {
            //按钮颜色(底色透明)
            return 'fc-' + this.color
        },
        btn_bg: function() {
            //是否有底色(有则字体为白色)
            return this.bg ? 'btn-withbg' : ''
        },
        btn_size: function() {
            //是否为尺寸大的按钮
            return this.size == 'large' || this.size == 'lg' ? 'btn-lg' : ''
        },
        btn_radius: function() {
            //是否圆角
            return this.radius ? 'yuanjiao' : ''
        },
        text_multi: function() {
            //是否多行不缩略
            return this.multi ? '' : 'inaline'
        },
        btn_disabled: function() {
            //是否禁用
            return this.isDisabled || this.loading ? 'btn-disabled' : ''
        },
        btn_class: function() {
            //所有class的数组集合
            return [this.btn_color, this.btn_bg, this.btn_size, this.btn_radius, this.btn_disabled, this.otherClass]
        }
    },
    methods: {
        clickHandle: function() {
            //如果按钮不被禁用, 且并没有提交数据时, 才允许点击
            if (!(this.isDisabled || this.loading)) {
                this.$emit('click');
            }
        }
    },
    template: `<button class="btn" @click="clickHandle" :class="btn_class" type="button">
                        <div class="btn-text" :class="[text_multi]">
                            <i class="btn-loading anim-rotate" v-if="loading"></i>
                            <slot></slot>
                        </div>
                    </button>`
})

//搜索框
Vue.component('zh-search', {
    props: {
        keyword: {
            //输入的关键字
            type: String,
            default: ''
        },
        autoSearch: {
            //默认false只能回车触发, true是每输入一次就执行搜索回调
            type: Boolean,
            default: false
        },
        placeholder: {
            //占位提示语
            type: String,
            default: '搜索你需要的关键词'
        }
    },
    methods: {
        clearKeyword: function() {
            //清空输入框
            this.keyword = ''
        },
        searchHandle: function() {
            //判断搜索回调是回车触发还是输入触发
            if ((this.autoSearch && event.type == 'input') || 
                (!this.autoSearch && event.type == 'keyup')) {
                this.$emit('search', escape(this.keyword));
            }
        }
    },
    template: `
                <div class="search-box">
                    <div class="search ub ub-ac">
                        <div class="search-icon">
                            <i class="icon-black-search"></i>
                        </div>
                        <input class="search-ipt fz-md" type="search" @keyup.13="searchHandle" @input="searchHandle" v-model="keyword" :placeholder="placeholder" />
                        <div class="search-right" v-show="keyword != '' " @click="clearKeyword">
                            <i class="search-del-icon"></i>
                        </div>
                    </div>
                </div>`
})

//tab外层, 要先引入swiper的css和js
Vue.component('zh-tab', {
    data: function() {
        //swiper存放swiper对象
        //tabPrev存放上一个滑动项的下标, 第一次默认设为-1
        return {
            swiper: {},
            tabPrev: -1
        }
    },
    props: {
        //tab显示的字段、tab下标、tab主体对应的class
        tabList: Array,
        tabIndex: Number,
        tabClass: {
            //绑定在swiper的类, 可自定义, 默认的这个是宽高100%
            type: String,
            default: 'swiper-main'
        }
    },
    mounted: function() {
        //初始化swiper并设定了某些特定事件下的回调函数供父组件使用
        var that = this;
        this.swiper = new Swiper('.' + that.tabClass, {
            resistanceRatio: 0,
            spaceBetween : 14,
            on: {
                sliderMove: function(e) {
                    //顺序1: 手指触碰Swiper并拖动slide时
                    that.$emit('tabSliderMove');
                },
                touchEnd: function(e) {
                    //顺序2: 触摸释放时
                    that.$emit('tabSliderEnd');
                },
                transitionStart: function() {
                    //顺序3: 过渡开始时
                    var indx = this.activeIndex;
                    that.tabIndex = indx;
                    
                    that.$emit('tabAnimStart', {
                        index: that.tabIndex,
                        prev: that.tabPrev
                    });
                },
                transitionEnd: function() {
                    //顺序4: 过渡结束时
                    var prev = vm.tabPrev;
                    var inde = this.activeIndex;
                    
                    that.tabPrev = inde;
                    that.$emit('tabAnimEnd', {
                        index: that.tabIndex
                    });
                }
            }
        })
    },
    methods: {
        tabClick: function(i) {
            //点击tab标签切换内容
            var tab_index = this.tabIndex;
            
            this.tabPrev = tab_index;
            this.tabIndex = i;
            this.swiper.slideTo(i, 0, false);
            
            this.$emit('tabClick', {
                index: this.tabIndex,
                prev: tab_index
            })
        }
    },
    template: `<div class="tab">
                <div class="tab-nav tab-fixtop mescroll-touch-x bg-header border-btm">
                    <div class="tab-scroller" ref="tabScroll">
                        <ul class="tab-box">
                            <li class="tab-item" v-for="(item, index) in tabList" :class="{'actives': index == tabIndex}" @click="tabClick(index)">
                                <label class="tab-text" v-text="item"></label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="tab-content">
                    <div class="swiper-container" :class="[tabClass]">
                        <div class="swiper-wrapper">
                            <slot></slot>
                        </div>
                    </div>
                </div>
            </div>`
});

//tab里层
Vue.component('zh-tabs', {
    template: `<div class="swiper-slide"><slot></slot></div>`
});

//图片展示, 要先引入swiper的css和js
Vue.component('zh-img', {
    data: function() {
        return {
            imgSwiper: {}
        }
    },
    props: {
        //id操作节点用(ref), arr图片地址数组, swiper操作滑动组件用
        imgId: String,
        imgArr: Array
    },
    mounted: function() {
        this.imgSwiper = new Swiper('#' + this.imgId, {
            slidesPerView: 'auto',
            freeMode: true,
            lazy: {
                loadPrevNext: true,
                loadPrevNextAmount: 10
            },
        });
    },
    methods: {
        previewImgs: function(arr, i) {
            //图片预览
            if (typeof(uexImage) != 'undefined') {
                uexImage.openBrowser({
                    displayActionButton: true,
                    displayNavArrows: true,
                    enableGrid: true,
                    startIndex: i,
                    data: arr
                }, function() {});
            }
        },
    },
    template: `
                <div class="swiper-container pic-show" :id="imgId">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item, index) in imgArr">
                            <div class="pic-box">
                                <div class="pic-item swiper-lazy" :data-background="item.url" @click="previewImgs(imgArr, index)">
                                    <div class="swiper-lazy-preloader"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
})

//图片上传
Vue.component('zh-img-upload', {
    data: function() {
        return {
            imgSwiper: {},
            comtextareass: 0,//是否压缩
            quality: 90,     //打开相册的清晰度
            qualityImg: 0.9, //打开图片浏览器的清晰度
        }
    },
    props: {
        //id操作节点用(ref), arr图片地址数组, swiper操作滑动组件用, max选择图片浏览器的图片个数默认值
        imgId: String,
        imgArr: Array,
        uploadUrl: String,
        max: {
            type: Number,
            default: 10
        }
    },
    computed: {
        remainLen: function() {
            return Math.max(this.max - this.imgArr.length, 0);
        }
    },
    mounted: function() {
        this.imgSwiper = new Swiper('#' + this.imgId, {
            slidesPerView: 'auto',
            freeMode: true
        });
    },
    methods: {
        openCamera: function() {
            //打开相机
            var that = this;
            appcan.plugInCamera.open(this.comtextareass,this.quality,function(data){
                that.imgArr.push({
                    img: '',
                    url: '',            // 图片地址
                    status: 'pending',  // 上传状态
                    percent: '1%'       // 上传进度
                });
                that.uploadImg([data], that.imgArr.length - 1);
            })
        },
        openAlbum: function() {
            //打开相册
            var that = this;
            var json = {
                min: 1,
                max: this.remainLen,
                quality: this.qualityImg,
                detailedInfo: true
            };
            uexImage.openPicker(json, function(error, data) {
                var xb = that.imgArr.length;
                var picPathArrs = data.data;
                for (var i = 0; i < picPathArrs.length; i++) {
                    that.imgArr.push({
                        img: '',
                        url: '',  // 图片地址
                        status: 'pending', // 上传状态
                        percent: '1%'  // 上传进度
                    });
                    (function(h) {
                        that.uploadImg([picPathArrs[h]], xb + h);
                    })(i);
                } 
            })
        },
        previewImgs: function(arr, i) {
            //图片预览
            if (typeof(uexImage) != 'undefined') {
                uexImage.openBrowser({
                    displayActionButton: true,
                    displayNavArrows: true,
                    enableGrid: true,
                    startIndex: i,
                    data: arr
                }, function() {});
            }
        },
        deleteImgs: function(arr, i) {
            //删除图片并更新swiper
            arr.splice(i, 1);
            this.$nextTick(function() {
                this.imgSwiper.update(true);
            });
        },
        uploadImg: function(imgsArr, pvImgIndex){
            var that = this;
            var uploadJson = {
                serverUrl: serverPath + that.uploadUrl,
                filePath: imgsArr,
                quality: 1
            };
            //上传文件，返回服务器路径  
            appcan.plugInUploaderMgr.upload(uploadJson, function(e) {
                // 0-上传中 1-上传成功 2-上传失败
                if (e.status == 1) {
                    that.imgArr[pvImgIndex].img = e.responseString;
                    that.imgArr[pvImgIndex].url = serverPath + e.responseString;
                    that.imgArr[pvImgIndex].status = 'finish';
                } else if (e.status == 2) {
                    that.imgArr[pvImgIndex].status = 'fail';
                } else {
                    that.imgArr[pvImgIndex].percent = e.percent + "%";
                }
            });
        } 
    },
    template: `
                <div class="swiper-container pic-show" :id="imgId">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="(item, index) in imgArr">
                            <div class="pic-box">
                                <div class="pic-item" v-show="item.status == 'finish'" :style="{backgroundImage: 'url('+item.url+')'}" @click="previewImgs(imgArr, index)"></div>
                                <div class="pic-note" v-show="item.status == 'pending'" v-text="item.percent"></div>
                                <div class="pic-note" v-show="item.status == 'fail'">上传失败</div>
                                <div class="pic-delete icon-delete" @click="deleteImgs(imgArr, index)"></div>
                            </div>
                        </div>
                        <div class="swiper-slide pic-buttons">
                            <div class="pic-box pic-camera" @click="openCamera">
                                <div class="pic-item"></div>
                            </div>
                            <div class="pic-box pic-album" @click="openAlbum">
                                <div class="pic-item"></div>
                            </div>
                        </div>
                    </div>
                </div>`
})

//分割栏标题
Vue.component('zh-forum', {
    props: {
        title: {
            //标题
            type: String,
            required: true
        },
        titleSm: {
            //副标题
            type: String,
            default: ''
        },
        note: {
            //小标题
            type: String,
            default: ''
        },
        //label是给折叠组件留的一个入口, 控制需要折叠展开的项
        label: String,
        //required是给带标题的输入域留的一个入口, 显示是否必填
        required: Boolean
    },
    computed: {
        forum_title: function() {
            return unescape(this.title)
        },
        forum_title_sm: function() {
            return unescape(this.titleSm)
        },
        forum_note: function() {
            return unescape(this.note)
        },
        forum_side_show: function() {
            //是否传入右侧自定义slot
            return this.$slots.default
        },
        isRequired: function() {
            return this.required ? 'required-sign' : ''
        }
    },
    template: `
                    <label class="forum" :for="label">
                        <div class="forum-main">
                            <span class="forum-title" :class="[isRequired]" v-html="forum_title"></span>
                            <span class="forum-text" v-if="titleSm != ''" v-html="forum_title_sm"></span>
                            <span class="forum-note" v-if="note != ''" v-html="forum_note"></span>
                        </div>
                        <div class="forum-side" v-if="forum_side_show">
                            <slot></slot>
                        </div>
                    </label>`
});

//折叠
Vue.component('zh-collapse', {
    props: {
        name: {
            //相当于折叠项的id
            type: String,
            required: true
        },
        title: {
            //标题
            type: String,
            required: true
        },
        //checkbox的id, 默认与name相同
        id: String,
        isHide: {
            //是否隐藏内容
            type: Boolean,
            default: false
        }
    },
    computed: {
        c_id: function() {
            return this.id || this.name
        }
    },
    template: `
                    <div class="collapse">
                        <input :name="name" :id="c_id" type="checkbox" class="collapse-ctrl" :checked="isHide">
                        <slot name="title">
                            <zh-forum :title="title" :label="name"></zh-forum>
                        </slot>
                        <div class="collapse-content">
                            <slot></slot>
                        </div>
                    </div>`
});

//输入框
Vue.component('zh-input', {
    props: {
        //输入框前面的标签名
        label: {
            type: String,
            required: true
        },
        //输入值
        value: {
            type: String,
            required: true
        },
        //是否只读
        readonly: Boolean,
        //是否必填
        required: Boolean,
        //输入类型, 默认text
        inputType: {
            type: String,
            default: 'text'
        },
        //占位默认文字提示语
        holder: String
    },
    computed: {
        real_value: function() {
            return unescape(this.value);
        },
        isRequired: function() {
            return this.required ? 'required-sign' : ''
        }
    },
    methods: {
        returnValue: function() {
            this.$emit('input', restoreEnter(event.target.value));
        }
    },
    template: `
                            <label class="input-item ub">
                                <div class="input-name" :class="[isRequired]" v-html="label"></div>
                                <div class="input-main ub-f1">
                                    <input :value="real_value" @input="returnValue" :type="inputType" class="input" :readonly="readonly" :placeholder="holder" />
                                </div>
                            </label>`
});

//日期选择器
Vue.component('zh-datepick', {
    props: {
        label: {
            //选择器的名称
            type: String,
            required: true
        },
        dateObj: {
            type: Object,
            default: function() {
                //日期显示字段初始值text, 时间戳初始值stamp
                //从父元素传过来会覆盖掉这里
                return {
                    text: '',
                    stamp: 0
                }
            }
        },
        format: {
            //显示日期的格式
            type: String,
            default: 'yyyy/MM/dd'
        },
        dateId: {
            //日期选择控件的id值
            type: String,
            required: true
        },
        //是否必填
        required: Boolean,
        //占位默认文字提示语
        holder: String
    },
    created: function() {
        this.datetimeHandle();
    },
    computed: {
        isRequired: function() {
            return this.required ? 'required-sign' : ''
        }
    },
    mounted: function() {
        var that = this;
        var selectDateDom = document.getElementById(this.dateId);
        
        selectDateDom.addEventListener('click', function () {
            var dateObj = initDate(selectDateDom, that.dateObj.stamp_new);
            var iosSelect = new IosSelect(3, [dateObj.yearData, dateObj.monthData, dateObj.dateData], {
                title: that.label,
                oneLevelId: selectDateDom.getAttribute('data-year'),
                twoLevelId: selectDateDom.getAttribute('data-month'),
                threeLevelId: selectDateDom.getAttribute('data-date'),
                callback: function (one, two, three) {
                    var ts = timeStemp(one.id+'/'+two.id+'/'+three.id, that.format);
                    that.$set(that.dateObj, 'text_new', ts.date);
                    that.$set(that.dateObj, 'stamp_new', ts.dateTimeSecond);
                    
                    //向父组件传入已处理的日期对象
                    that.$emit('datechange', that.dateObj);
                    
                    selectDateDom.setAttribute('data-year', one.id);
                    selectDateDom.setAttribute('data-month', two.id);
                    selectDateDom.setAttribute('data-date', three.id);
                }
            });
        });
    },
    watch: {
        'dateObj.text': {
            immediate: true,
            handler: function(val, oldVal) {
                this.dateObj.text = val;
                this.datetimeHandle();
            }
        },
        'dateObj.stamp': {
            immediate: true,
            handler: function(val, oldVal) {
                this.dateObj.stamp = val;
                this.datetimeHandle();
            }
        }
    },
    methods: {
        datetimeHandle: function() {
            //时间字段处理
            var xd;
            var format = this.format, dateObj = this.dateObj;
            
            if (dateObj.stamp && dateObj.stamp != 0) {
                //如果只传了日期文本
                xd = timeStemp(dateObj.stamp, format);
            } else if (dateObj.text && dateObj.text != '') {
                //如果只传了时间戳
                xd = timeStemp(dateObj.text, format);
            } else {
                //如果啥都没传, 直接取当前时间
                xd = timeStemp(new XDate.today(), format);
            }
            
            this.$set(this.dateObj, 'text_new', xd.date);
            this.$set(this.dateObj, 'stamp_new', xd.dateTimeSecond);
            
            //向父组件传入已处理的日期对象
            this.$emit('datechange', this.dateObj);
        }
    },
    template: `
                            <label class="input-item ub">
                                <div class="input-name" :class="[isRequired]" v-html="label"></div>
                                <div class="input-main ub-f1">
                                    <input class="input" v-model="dateObj.text_new" />
                                </div>
                                <div class="input-side">
                                    <i class="icon-20 icon-grey-goto"></i>
                                </div>
                                <input type="text" :id="dateId" class="input-hidden" readonly="readonly" />
                            </label>`
});

//普通下拉选择
Vue.component('zh-listpick', {
    props: {
        label: {
            //下拉项叫啥
            type: String,
            required: true
        },
        listArr: {
            type: Array,
            required: true,
            default: function() {
                //下拉列表键值对数组, 需要id和显示文本value
                return []
            }
        },
        listObj: {
            type: Object,
            required: true,
            default: function() {
                //选中项
                return {
                    id: -1,
                    value: ''
                }
            }
        },
        listId: {
            //下拉选择器的名称
            type: String,
            required: true
        },
        //是否必填
        required: Boolean,
        //占位默认文字提示语
        holder: String,
        //是否设置默认值
        hasDefault: Boolean
    },
    created: function() {
        //设置默认值
        if (this.hasDefault) {
            this.initListDefault();
        }
    },
    computed: {
        isRequired: function() {
            return this.required ? 'required-sign' : ''
        }
    },
    mounted: function() {
        var that = this;
        var selectListDom = document.getElementById(this.listId);
        
        selectListDom.addEventListener('click', function () {
            var iosSelect = new IosSelect(1, [that.listArr], {
                title: that.label,
                oneLevelId: selectListDom.dataset['result'],
                callback: function (one) {
                    that.$set(that.listObj, 'id', one.id);
                    that.$set(that.listObj, 'value', one.value);
                    that.$emit('listchange', that.listObj);
                    
                    selectListDom.dataset['id'] = one.id;
                    selectListDom.dataset['value'] = one.value;
                }
            });
        });
    },
    methods: {
        initListDefault: function() {
            if (!this.listArr.length) return;
            
            this.$set(this.listObj, 'id', this.listArr[0].id);
            this.$set(this.listObj, 'value', this.listArr[0].value);
        }
    },
    template: `
                            <label class="input-item ub">
                                <div class="input-name" :class="[isRequired]" v-html="label"></div>
                                <div class="input-main ub-f1">
                                    <input class="input" v-model="listObj.value" :placeholder="holder" />
                                </div>
                                <div class="input-side">
                                    <i class="icon-20 icon-grey-goto"></i>
                                </div>
                                <input type="text" :id="listId" class="input-hidden" readonly="readonly" />
                            </label>`
});

//文本框, 需要先引入autosize.js
Vue.component('zh-textarea', {
    props: {
        //输入框前面的标签名
        label: String,
        value: {
            type: String,
            required: true
        },
        readonly: Boolean,
        required: Boolean,
        holder: String,
        max: Number
    },
    computed: {
        real_value: function() {
            return restoreEnter(this.value);
        },
        placeholder: function() {
            return this.max ? this.holder.replace('**', this.max) : this.holder
        }
    },
    directives: {
        autosize: {
            bind: function(el, binding) {
                autosize(el);
            },
            update: function(el, binding) {
                autosize.update(el);
            }
        }
    },
    methods: {
        returnValue: function() {
            this.$emit('input', replaceEnter(event.target.value));
        }
    },
    template: `
                <div>
                    <zh-forum :title="label" :required="required"></zh-forum>
                    <zh-list>
                        <zh-list-item>
                            <div class="txa-item">
                                <div class="txa-main">
                                    <textarea class="txa" :value="real_value" @input="returnValue" v-autosize :readonly="readonly" :placeholder="placeholder"></textarea>
                                </div>
                            </div>
                        </zh-list-item>
                    </zh-list>
                </div>`
});

/*  勾选组件
    item: {
                'title': '所有施工人员证件齐全',//问题内容
                'qid': 'xxx0',//问题id, 必填
                'value': '',//向子组件提供一个存放选项的字段, 必填
                'options': [//问题的答案, text是选项文本, id是答案对应的标识id, 必填
                    {text: '符合', id: 1},
                    {text: '不符合', id: 0},
                    {text: '不适用', id: -1}
                ]
            }
 */
Vue.component('zh-pick', {
    props: {
        index: {
            //编号
            type: Number,
            default: -1
        },
        item: {
            type: Object,
            required: true,
            default: function() {
                return {
                    'title': '',
                    'qid': '',
                    'value': null,
                    'options': [
                        {text: '符合', id: 1},
                        {text: '不符合', id: 0},
                        {text: '不适用', id: -1}
                    ]
                }
            }
        },
        mode: {
            type: String,
            default: 'radio',
            validator: function(v) {
                //模式, 分单选和复选
                return ['radio', 'checkbox'].indexOf(v) != -1
            }
        },
        //该项布局方向, 不填或默认是横向h, 竖向则传v
        d7n: {
            type: String,
            default: 'h',
            validator: function(value) {
                return ['h', 'v'].indexOf(value) != -1
            }
        },
    },
    computed: {
        tick_title: function() {
            return unescape(this.item.title);
        },
        fangxiang: function() {
            return this.d7n == 'v' ? 'inline' : ''
        }
    },
    created: function() {
        if (this.mode == 'radio') {
            //单选, 默认value是第一个
            this.$set(this.item, 'value', this.item.options[0].id);
        } else {
            //多选, 默认不选中, 并初始化value成数组
            this.$set(this.item, 'value', []);
        }
    },
    methods: {
        optionPick: function(obj) {
            if (this.mode == 'radio') {
                //单选, 覆盖之前选的值
                this.$set(this.item, 'value', obj.id);
            } else {
                //多选, 勾选or取消勾选
                var pos = this.item.value.indexOf(obj.id);
                if (pos == -1) {
                    this.item.value.push(obj.id);
                } else {
                    this.item.value.splice(pos, 1);
                }
            }
            
            //返回该item
            this.$emit('optionschange', this.item);
        },
        optionActive: function(obj) {
            var flag;
            if (this.mode == 'radio') {
                flag = (this.item.value == obj.id);
            } else {
                flag = (this.item.value.indexOf(obj.id) != -1);
            }
            
            return flag ? ['actives'] : []
        }
    },
    template: `
                                    <div class="checkbox-item" :class=[fangxiang]>
                                        <div class="checkbox-title">
                                            <span v-if="index != -1">{{index+1}}.</span>
                                            <span v-html="tick_title"></span>
                                        </div>
                                        <div class="checkbox-main">
                                            <div class="checkbox-label" v-for="(val, key) in item.options" @click="optionPick(val)">
                                                <div class="checkbox-cell">
                                                    <i class="icon-20 checkbox-icon" :class="optionActive(val)"></i>
                                                </div>
                                                <div class="checkbox-name" v-html="val.text"></div>
                                            </div>
                                        </div>
                                    </div>`
});

//信息展示列表
Vue.component('zh-info', {
    template: '<div class="info bg-white border-top border-btm"><slot></slot></div>'
});

//信息展示块, 以虚线分割的板块
Vue.component('zh-info-box', {
    props: {
        borderClass: {
            type: String,
            default: ''
        }
    },
    template: '<div class="info-box" :class="[borderClass]"><slot></slot></div>'
});

//信息展示项
Vue.component('zh-info-item', {
    props: {
        //每一项的名称
        label: {
            type: String,
            default: ''
        },
        //每一项的显示值, 字符串如'李四', 数组如['跑道标识：接地带标识', '滑行道标识：信息标识']
        value: [String, Array],
        //该项布局方向, 不填或默认是横向h, 竖向则传v
        d7n: {
            type: String,
            default: 'h',
            validator: function(value) {
                return ['h', 'v'].indexOf(value) != -1
            }
        },
        arrShow: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        value_is_string: function() {
            return typeof(this.value) == 'string' || typeof(this.value) == 'undefined'
        },
        real_value: function() {
            if (this.value_is_string) {
                return this.value && this.value.trim() != '' ? unescape(this.value) : '- -';
            } else {
                var arr = [];
                for (var b = 0; b < this.value.length; b++) {
                    arr.push(unescape(this.value[b]));
                }
                return arr;
            }
        },
        fangxiang: function() {
            return this.d7n == 'v' ? 'item-ver' : ''
        },
        item_right_show: function() {
            return this.arrShow || this.$slots.right
        }
    },
    template: `
                        <div class="info-item" :class="[fangxiang]">
                            <div class="info-item-left" v-if="label != ''" v-html="label"></div>
                            <div class="info-item-main">
                                <slot>
                                    <div class="info-item-row" v-if="value_is_string" v-html="real_value"></div>
                                    <div class="info-item-row" v-else v-for="(item, index) in real_value" v-html="item"></div>
                                </slot>
                            </div>
                            <div class="info-item-right ub" v-if="item_right_show">
                                <div class="info-item-label">
                                    <slot name="right"></slot>
                                </div>
                                <i class="icon-20 icon-grey-goto" v-if="arrShow"></i>
                            </div>
                        </div>`
});

//信息展示项的头部or标题
Vue.component('zh-info-title', {
    props: {
        title: {
            type: String,
            default: ''
        },
        d7n: {
            type: Array,
            default: function() {
                return []
            }
        },
        arrShow: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        real_title: function() {
            //信息项的大标题
            return unescape(this.title)
        },
        real_d7n: function() {
            //标题底下的描述项, 是若干个label-value对象构成的数组. 如'检查人': '张三' 
            var arr = [];
            for (var a = 0; a < this.d7n.length; a++) {
                arr.push({
                    label: this.d7n[a].label,
                    value: unescape(this.d7n[a].value)
                })
            }
            
            return arr;
        },
        title_right_show: function() {
            //是否传入右侧自定义slot
            return this.$slots.default || this.arrShow
        },
    },
    template: `
                        <div class="info-item">
                            <div class="info-item-main">
                                <div class="info-item-title" v-if="title != ''" v-html="real_title"></div>
                                <div class="info-item-d7n" v-if="real_d7n.length != 0">
                                    <div class="info-item-d7n-pair" v-for="(item, index) in real_d7n">
                                        <span>{{item.label}}：</span>
                                        <span v-html="item.value"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="info-item-right" v-if="title_right_show">
                                <slot></slot>
                                <i class="icon-20 icon-grey-goto" v-if="arrShow"></i>
                            </div>
                        </div>`
});
//评论的
Vue.component('zh-comment', {
    data: function() {
        return {
            replyShowMax: 2,
        }
    },
    props: {
        comment: {
            type: Array,
            required: true
        }
    },
    created: function() {
        this.replyStyleHandle();
    },
    mounted: function() {
    },
    methods: {
        replyStyleHandle: function() {
            var len = this.comment.length;
            if (len == 0) return;
            
            for (var d = 0; d < len; d++) {
                var comm = this.comment[d];
                var replyLen = comm.reply.length;
                var replyMore = replyLen > this.replyShowMax;
                
                this.$set(this.comment[d], 'contentReal', unescape(comm.content));//解码, 显示表情
                this.$set(this.comment[d], 'replyMore', replyMore);//回复是否超过2条
                this.$set(this.comment[d], 'replyFlag', false);//控制所有回复折叠或展开
                this.$set(this.comment[d], 'replyText', '查看'+replyLen+'条回复&gt;');
                
                if (comm.reply.length > 0) {
                    for (var f = 0; f < comm.reply.length; f++) {
                        this.$set(this.comment[d].reply[f], 'contentReal', unescape(comm.reply[f].content));//解码, 显示表情
                    }
                }
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
            return itm.hasOwnProperty('replyFlag') && (itm.replyFlag || idx < this.replyShowMax)
        },
        commentThis: function(obj) {
            //点击用户名字评论
            this.$emit('commentthis', obj);
        }
    },
    template: `
                        <div class="comment bg-white mg-box">
                            <div class="comment-item" v-for="(item, index) in comment">
                                <div class="comment-main">
                                    <span class="comment-name" @click="commentThis(item)">
                                        <span class="fc-main">{{item.name}}</span>
                                        <span class="fc-title">-{{item.department}}：</span>
                                    </span>
                                    <span class="comment-text fc-title" v-html="item.contentReal"></span>
                                    <em class="comment-time fc-text">{{item.date}}</em>
                                </div>
                                <div class="comment-reply" v-if="item.reply.length > 0">
                                    <div class="comment-main" v-for="(val, key) in item.reply" v-show="isReplyMoreShow(item, key)">
                                        <span class="comment-name" @click="commentThis(val)">
                                            <span class="fc-main">{{val.name}}</span>
                                            <span class="fc-title">-{{val.department}}</span>
                                        </span>
                                        <span class="comment-text fc-title">&nbsp;回复&nbsp;</span>
                                        <span class="comment-name">
                                            <span class="fc-main">{{val.reply_name}}</span>
                                            <span class="fc-title">-{{val.reply_department}}：</span>
                                        </span>
                                        <span class="comment-text fc-title" v-html="val.contentReal"></span>
                                        <em class="comment-time fc-text">{{val.date}}</em>
                                    </div>
                                    <div class="comment-more" v-if="item.replyMore">
                                        <div class="comment-more-text" @click="replyMore(index)" v-html="item.replyText"></div>
                                    </div>
                                </div>
                            </div>
                        </div>`
});

