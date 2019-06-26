//测试数据
var testdata = [{"optionuser":"沈斌","optiondepartname":"飞管","optiontime":1548653242000,"optionflag":10,"optioncode":"飞行区管理部验收通过,流程结束。","optioncontent":""},{"optionuser":"钟莹","optiondepartname":"信息","optiontime":1548395352000,"optionflag":8,"optioncode":"信息科技公司整改完成了问题：","optioncontent":"基本龙膜go金融圈诺黑哦哦外婆公婆木木木西五巷鱼死网破童年哦婆婆孔融你哦婆婆MSN你哦婆婆go哦婆婆婆匿名磨破木木途游进哦咯够了吗诺"},{"optionuser":"testxinxi","optiondepartname":"信息","optiontime":1548385786000,"optionflag":7,"optioncode":"信息科技公司接收了问题：","optioncontent":"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"},{"optionuser":"feiguan","optiondepartname":"飞管","optiontime":1548385669000,"optionflag":4,"optioncode":"飞行区管理部接收了问题并转派给了信息科技公司：","optioncontent":""},{"optionuser":"testxinxi","optiondepartname":"信息","optiontime":1548379214000,"optionflag":1,"optioncode":"信息科技公司报送了问题给飞行区管理部。","optioncontent":""}];

var vm = new Vue({
    el: '#Page',
    data: {
        option: [],
        progIsMore: false,
        progShowMax: 4
    },
    created: function() {
    },
    mounted: function() {
        this.simulateYugutu();
    },
    computed: {
        progText: function() {
            return {
                'text': this.progIsMore ? '收起' : '查看更多',
                'icon': this.progIsMore ? '' : 'actives'
            }
        }
    },
    methods: {
        isOptionItemShow: function(i) {
            //鱼骨图完全展开, 或者折叠时只显示前progShowMax个
            return this.progIsMore || i < this.progShowMax
        },
        progContCalculate: function() {
            //计算内容高度, 超出3行则隐藏
            var con = this.$refs.progContent;
            for (var j = 0; j < con.length; j++) {
                var con_style = window.getComputedStyle(con[j], null);
                var con_lineHeight = parseInt(con_style['line-height'].split('px')[0]);
                var con_height = parseInt(con_style['height'].split('px')[0]);
                
                //是否超过3行, contentHide=-1为没有, 0为有并且隐藏超出文字
                var flagNeedHide = !isNaN(con_height) && con_height > con_lineHeight * 3;
                this.$set(this.option[j], 'contentHide', flagNeedHide ? 0 : -1);
                this.$set(this.option[j], 'contentNote', flagNeedHide ? '更多>' : '');
            }
        },
        progContMore: function(i) {
            //内容隐藏或展开, contentHide=0为隐藏, 1为展开
            var flagShow = this.option[i].contentHide;
            this.$set(this.option[i], 'contentHide', flagShow == 1 ? 0 : 1);
            this.$set(this.option[i], 'contentNote', flagShow == 1 ? '更多>' : '收起∧');
        },
        progShow: function() {
            //鱼骨图折叠或展开
            this.progIsMore = !this.progIsMore;
        },
        simulateYugutu: function() {
            //以下模拟数据处理
            var arr = [];
            var cls_0 = 'icon-yugu-begin',
                cls_1 = 'icon-yugu-done',
                cls_2 = 'icon-yugu-end';
            
            for (var i = 0; i < testdata.length; i++) {
                var _this = testdata[i];
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
            
            this.option = [].concat(arr);
            
            //节点更新完，开始计算内容高度
            this.$nextTick(function() {
                this.progContCalculate();
            })
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
