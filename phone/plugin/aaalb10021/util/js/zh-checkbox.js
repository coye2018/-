/*
 * 后续放到 zh-common.js
 */

/*
 * 单选、复选组件组件
 * 复选框带其它项的，需要先引入autosize.js
 *
 * @param {Array} option 选项的数据 (必填)
 * @param {Number} type 0=单选 1=多选  (默认：0)
 * @param {Number} other 0=不带多选 1=带多选 (默认：0)
 * @param {Boolean} readonly true=只读 false=可以编辑 (默认：false)
 * @param {Array} value 已选值(为当单选时，即使不填value，也会默认已勾选第一项)
 * @param {String} placeholder 当带其它项时输入框的水印提示文字 (默认：请输入)
 */
Vue.component('zh-checkbox', {
    props : {
        option : Array,
        type : Number,
        other : Number,
        readonly : Boolean,
        value : Array,
        placeholder : String
    },
    data : function() {
        return {
            list : [],
            checkbox_type : 0,
            checkbox_other : 0,
            checkbox_readonly : false,
            checkbox_selected : [],
            txa_qita : '',
            txa_qita_show : false,
            txaObj : {
                readonly : true,
                focus : false
            },
            isQita : 0, //1=选了其他
            value : [],
            checkbox_placeholder:'请输入...'
        }
    },
    directives : {
        textarea : {
            bind : function(el, binding) {
                autosize(el);
                if (binding.value) {
                    binding.value.readonly ? el.setAttribute('readonly', true) : el.removeAttribute('readonly');
                }
                if (binding.value && binding.value.focus) {
                    el.focus();
                }
            },
            update : function(el, binding) {
                autosize.update(el);
                if (binding.value) {
                    binding.value.readonly ? el.setAttribute('readonly', true) : el.removeAttribute('readonly');
                }
                if (binding.value && binding.value.focus) {
                    el.focus();
                }
            }
        }
    },
    mounted : function() {
        this.init();
    },
    methods : {
        init : function() {
            //初始化数据
            this.checkbox_type = this.type;
            if (!this.checkbox_type) {
                this.checkbox_type = 0;
            }
            this.checkbox_other = this.other;
            if (!this.checkbox_other) {
                this.checkbox_other = 0;
            }
            this.checkbox_readonly = this.readonly;

            this.checkbox_selected = this.value;
            if (!this.checkbox_selected) {
                this.checkbox_selected = [];
            }
            
            if(this.isDefine(this.placeholder)){
                this.checkbox_placeholder = this.placeholder;
            }
            
            
            var arr = [];
            for (var i = 0; i < this.option.length; i++) {
                var _this = this.option[i];
                arr.push({
                    'id' : _this.id,
                    'name' : _this.name,
                    'active' : false
                })
            }
            if (this.checkbox_other == 1) {
                this.txa_qita_show = true;
                arr.push({
                    'id' : -1,
                    'name' : "其它",
                    'active' : false
                })
            }
            this.list = [].concat(arr);
            this.initValue();          

        },
        initValue :function(){
            // 初始化已选内容                
            var arr = [];     
            for (var i = 0; i < this.list.length; i++) {
                var o = this.list[i];
                for (var j = 0; j < this.checkbox_selected.length; j++) {
                    var b = this.checkbox_selected[j];
                    if (b.id == o.id) {
                        o.active = true;
                        arr.push(o.name);
                    }
                    if (b.id == -1) {
                        this.isQita = 1;
                        this.txa_qita = b.name;
                        if (!this.checkbox_readonly) {
                            this.txaObj.readonly = false;
                        }
                    }
                }
            }
            if(this.isQita == 0){
                this.txa_qita = arr.join(' ');
            }
            
            //当为单选没传默认值，就默认选择第一项
            if(this.checkbox_type == 0){
                if(!this.isDefine(this.checkbox_selected)){
                    this.$set(this.list[0], 'active', true);                   
                }
            }           

        },
        isDefine : function(para){
            return !(typeof para == 'undefined' || $.trim(para) == "" || para == "[]" || para == null || para == undefined || para == 'undefined' || para == '[]' || para == "null");  
        },
        selectOption : function(index, item) {
            if (this.checkbox_readonly)
                return
                
            if (this.checkbox_type == 0) {
                this.radio(index,item);
            } else {
                this.checkbox(index,item);
            }
        },
        radio : function(index,item){
            //单选方法
            for (var i = 0; i < this.list.length; i++) {
                    this.list[i].active = false;
                }  
            if (this.checkbox_other == 0) {
                //单选               
                this.$set(this.list[index], 'active', true);
            } else {
                //单选带其它
                if (item.id == -1) {
                    //选其它
                    this.isQita = 1;
                    this.txaObj.readonly = false;
                    this.txaObj.focus = true;
                    this.txa_qita = '';
                    this.$set(this.list[index], 'active', true);
                } else {                    
                    this.isQita = 0;
                    this.txaObj.readonly = true;
                    this.txaObj.focus = false;
                    this.txa_qita = item.name;
                    this.$set(this.list[index], 'active', true);
                }

            }

        },
        checkbox : function(index,item){
            //多选方法
            if(this.checkbox_other == 0){
                //多选
                var flag = item.active;
                this.$set(this.list[index], 'active', !flag);
            }else{
                //多选，带其它
                if (item.id == -1) {
                    //选其它
                    this.isQita = 1;                    
                    this.txaObj.readonly = false;
                    this.txaObj.focus = true;
                    this.txa_qita = '';
                    for (var k = 0; k < this.list.length; k++) {
                        this.list[k].active = false;
                    }
                    this.$set(this.list[index], 'active', true);
                } else {
                    this.isQita = 0;                    
                    this.txaObj.readonly = true;
                    this.txaObj.focus = false;                    
                    var flag = item.active;
                    this.list[this.list.length - 1].active = false;
                    this.$set(this.list[index], 'active', !flag);
                    var selectedNameArr = []
                    for (var i = 0; i < this.list.length; i++) {
                        if (this.list[i].active) {
                            
                            selectedNameArr.push(this.list[i].name);
                        }
                    }
                    this.txa_qita = selectedNameArr.join(' ');
                }
            }
        },
        getVal : function() {
            //提供给父组件获取选中的数据
            var selectedArr = [];           
            if (this.checkbox_other == 1 && this.isQita == 1) {
                selectedArr.push({
                    'id' : -1,
                    'name' : this.txa_qita
                })
            } else {
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].active) {
                        selectedArr.push({
                            'id' : this.list[i].id,
                            'name' : this.list[i].name
                        });                        
                    }
                }
            }
            return selectedArr
        }
    },
     template: `<div class="picker border-top border-btm bg-white">
                <textarea class="picker-txa" v-model="txa_qita" v-textarea="txaObj" :placeholder=checkbox_placeholder v-if="txa_qita_show"></textarea>
                <div class="picker-main">
                    <span class="label" v-for="(item, index) in list" @click="selectOption(index, item)" :class="{'label-active':item.active}"  >
                        <span class="label-text" v-text="item.name"></span>
                    </span>                        
                </div>
            </div>
          `
})

