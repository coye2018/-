var platform = localStorage.getItem('myPlatform');

var vm = new Vue({
    el: '#Page',
    data: {
        ipt1: {
            label: '当事人姓名',
            value: '',
            required: true,
            holder: '请输入当事人姓名'
        },
        ipt2: {
            label: '联系方式',
            value: '13123456789',
            readonly: true
        },
        ipt3: {
            label: '发现时间',
            dateId: 'date_start',
            dateObj: {
                text: '2019-2-17'
            },
            required: false
        },
        ipt4: {
            label: '责任单位',
            listId: 'list_department',
            listObj: {},
            listArr: [
                {'id': '10001', 'value': '运控'},
                {'id': '10002', 'value': 'AOC'}
            ],
            holder: '--请选择--',
            required: true,
            hasDefault: false
        },
        txa: {
            label: '违章行为',
            value: '',
            required: true,
            max: 1000,
            holder: '最多可输入**字'
        },
        propsPick_1: [
            {
                'title': '所有施工人员证件齐全',//问题内容
                'qid': 'xxx0',//问题id, 必填
                'value': null,//向子组件提供一个存放选项的字段, 必填
                'options': [//问题的答案, text是选项文本, id是答案对应的标识id, 必填
                    {text: '符合', id: 1},
                    {text: '不符合', id: 0},
                    {text: '不适用', id: -1}
                ]
            }, {
                'title': '所有施工人员按规定身着反光衣',
                'qid': 'xxx1',
                'value': null,
                'options': [
                    {text: '符合', id: 1},
                    {text: '不符合', id: 0},
                    {text: '不适用', id: -1}
                ]
            }, {
                'title': '施工现场安全员（两名）在五分钟内到',
                'qid': 'xxx2',
                'value': null,
                'options': [
                    {text: '符合', id: 1},
                    {text: '不符合', id: 0},
                    {text: '不适用', id: -1}
                ]
            }
        ],
        propsPick_2: [
            {
                'title': '所有施工人员证件齐全',
                'qid': 'yyy0',
                'value': null,
                'options': [
                    {text: '符合', id: 1},
                    {text: '不符合', id: 0},
                    {text: '不适用', id: -1}
                ]
            }, {
                'title': '所有施工人员按规定身着反光衣',
                'qid': 'yyy1',
                'value': null,
                'options': [
                    {text: '符合', id: 1},
                    {text: '不符合', id: 0},
                    {text: '不适用', id: -1}
                ]
            }, {
                'title': '施工现场安全员（两名）在五分钟内到',
                'qid': 'yyy2',
                'value': null,
                'options': [
                    {text: '符合', id: 1},
                    {text: '不符合', id: 0},
                    {text: '不适用', id: -1}
                ]
            }
        ],
        propsPick_3: [
            {
                'title': '所有施工人员证件齐全',
                'qid': 'zzz0',
                'value': null,
                'options': [
                    {text: '有', id: 1},
                    {text: '无', id: 0}
                ]
            }, {
                'title': '所有施工人员按规定身着反光衣',
                'qid': 'zzz1',
                'value': null,
                'options': [
                    {text: '有', id: 1},
                    {text: '无', id: 0}
                ]
            }, {
                'title': '施工现场安全员（两名）在五分钟内到',
                'qid': 'zzz2',
                'value': null,
                'options': [
                    {text: '有', id: 1},
                    {text: '无', id: 0}
                ]
            }
        ]
    },
    watch: {
        'txa.value': function(val, oldVal) {
            console.log(val)
        }
    },
    methods: {
        backto: function() {
            pageClose();
        },
        test: function() {
            this.ipt3.dateObj.text = '2019-2-14';
        },
        datechangeHandle: function() {
            //获取改变过的日期数据
            //layerToast(this.ipt3.dateObj.text_new);
        },
        optionsHandle: function(obj) {
            console.log(obj);
        },
        txaResult: function(v) {
            console.log(v);
        },
        listChangeHandle: function(obj) {
            //赋不赋值都一样, 此时父组件的值和子组件一样的, 以下可省
            
            //this.ipt4.listObj = obj;
            //console.log(JSON.stringify(this.ipt4.listObj));
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
