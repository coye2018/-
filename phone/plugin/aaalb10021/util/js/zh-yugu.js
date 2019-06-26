Vue.component('zh-yugu', {
    props : {
        option : Array,
        progshowmax : Number,        
    },
    data : function() {
        return {
            list : [],
            progIsMore : false,
            progShowMax : 4
        }
    },
    computed : {
        progText : function() {
            return {
                'text' : this.progIsMore ? '收起' : '查看更多',
                'icon' : this.progIsMore ? '' : 'actives'
            }
        }
    },
    mounted : function() {
        this.initYugutu();
    },
    methods : {
        isOptionItemShow : function(i) {
            //鱼骨图完全展开, 或者折叠时只显示前progShowMax个
            return this.progIsMore || i < this.progShowMax
        },
        progShow : function() {
            //鱼骨图折叠或展开
            this.progIsMore = !this.progIsMore;
        },
        progContCalculate : function() {
            //计算内容高度, 超出3行则隐藏
            var con = this.$refs.progContent;
            for (var j = 0; j < con.length; j++) {
                var con_style = window.getComputedStyle(con[j], null);
                var con_lineHeight = parseInt(con_style['line-height'].split('px')[0]);
                var con_height = parseInt(con_style['height'].split('px')[0]);

                //是否超过3行, contentHide=-1为没有, 0为有并且隐藏超出文字
                var flagNeedHide = !isNaN(con_height) && con_height > con_lineHeight * 3;
                this.$set(this.list[j], 'contentHide', flagNeedHide ? 0 : -1);
                this.$set(this.list[j], 'contentNote', flagNeedHide ? '更多>' : '');
            }
        },
        progContMore : function(i) {
            //内容隐藏或展开, contentHide=0为隐藏, 1为展开
            var flagShow = this.list[i].contentHide;
            this.$set(this.list[i], 'contentHide', flagShow == 1 ? 0 : 1);
            this.$set(this.list[i], 'contentNote', flagShow == 1 ? '更多>' : '收起∧');
        },
        initYugutu: function() {
            //以下模拟数据处理
            var arr = [];
            var cls_0 = 'icon-yugu-begin',
                cls_1 = 'icon-yugu-done',
                cls_2 = 'icon-yugu-end';
            
            for (var i = 0; i < this.option.length; i++) {
                var _this = this.option[i];
                var states = _this.optionflag;
                var codes = _this.optioncode;
                var cls_itm = '';
                
                if (states == 1) {
                    cls_itm = cls_0;
                } else if (states == 6 || states == 10) {
                    cls_itm = cls_2;
                } else {
                    cls_itm = cls_1;
                }
                
                if (_this.optioncontent == '') {
                    codes = codes.replace(/\:/g, '。').replace(/：/g, '。');
                }
                
                arr.push({
                    'user': _this.optionuser,
                    'date': timeStemp(_this.optiontime).generalDate,
                    'code': codes,
                    'content': unescape(_this.optioncontent),
                    'icon': cls_itm
                })
            }
            
            this.list = [].concat(arr);
            this.progShowMax = this.progshowmax;
            
            //节点更新完，开始计算内容高度
            this.$nextTick(function() {
                this.progContCalculate();
            })
        }
    },
    template: `
         <div class="prog bg-white border-top border-btm">
            <div class="prog-more" @click="progShow()">
                <div class="prog-more-text" v-text="progText.text"></div>
                <div class="prog-more-arr icon-upward" :class="progText.icon"></div>
            </div>   
            <div class="prog-main">
                <div class="prog-item" v-for="(item, index) in list" v-show="isOptionItemShow(index)">
                    <div class="prog-left">                   
                        <div class="prog-dept" v-text="item.user"></div>
                        <div class="prog-time" v-text="item.date"></div>
                    </div>
                    <div class="prog-center">
                        <i class="icon-20" :class="item.icon"></i>
                        <div class="prog-line"></div>
                    </div>
                    <div class="prog-right">
                        <div class="prog-status">
                            <span class="fc-main" v-text="item.code"></span>
                        </div>
                        <div class="prog-detail" ref="progContent" :class="{'in3line': item.contentHide == 0}" v-html="item.content"></div>
                        <div class="prog-detail-more" @click="progContMore(index)" v-if="item.contentHide != -1" v-html="item.contentNote"></div>
                    </div>
                </div>
            </div>                     
         </div>
         `
})