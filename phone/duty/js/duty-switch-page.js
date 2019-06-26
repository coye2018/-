var platForm = appcan.locStorage.getVal('platForm');
var aniId = 0;
//banci: 班次名
//banciindex: 班次下标
//company: 公司名和属性, 见duty-switch-company.html
//monthlist: 月份的列表
//monthlistindex: 月份列表下标
//blanknum: 每月前面要空格的数量
//dutytable: 值班数据
//dutytablecopy: 值班数据的备份, 重置时用到
//today: 今天的日期, 10位数时间戳
//timeout: 计时器
//duty: 值班互换的数据, 时间戳, usercode, 班次, 换班原因
//flags: 判断是否进行过单人换班或双人换班
//juese: 用户角色, 控制是否可以选择其他部门的换班
var vm = new Vue({
    el: '#duty-switch',
    data: {
        banci: ['正班','副班'],
        banciid:31,
        banciindex: 0,
        company: {},
        monthlist: [
            {
                month: '　　'
            }
        ],
        monthlistindex: -1,
        blanknum: 0,
        dutytable: [],
        dutytable1:[],
        dutytablecopy: [],
        today: '',
        timeout: null,
        duty: {
            firstDutyDay: 0,
            firstDutyUserCode: '',
            firstDutyRealname: '',
            secondDutyDay: 0,
            secondDutyUserCode: '',
            secondDutyRealname: '',
            detailId: 0,
            type: null
        },
        dutyreason: '工作原因',
        pickindex: -1,
        flags: false,
        juese: 0,
        monthnum:'',
    },
    watch: {
        banci: function (val, oldVal) {
            appcan.window.publish('duty-switch-banci', JSON.stringify(val));
        },
        banciindex: function (val, oldVal) {
            appcan.window.publish('duty-switch-banciindex', JSON.stringify(val))
        },
        banciid: function (val, oldVal) {
            appcan.window.publish('duty-switch-banciid', JSON.stringify(val))
        }
    },
    methods: {
        changeMonth: function(i){
            //改变月份重新请求数据
            var _this = this,
                ev = event;
            var dayNumber=_this.monthlist[i].month.slice(0,_this.monthlist[i].month.length-1);
            delDrag();
            //是点击触发, 而不是直接调用
            if(isDefine(ev) && ev.type=='click'){
                //是否选中换班单位
                if(_this.company.hasOwnProperty('deptid')){
                    //点中的是当前项, 无需重新请求数据
                    if(_this.monthlistindex == i) return false;
                    //否则请求数据
                    var mDay=getCountDays(dayNumber);
                    // var mDay=curDate.getDate();
                    vm.dutytable1=[];
                    vm.dutytable=[];
                    vm.monthnum=mDay;
                    loadDutyTable(_this.monthlist[i].monthstamp, _this.company.deptid);
                }else{
                    layerToast('请先选择换班单位。');
                    return false;
                }
            }
            
            _this.monthlistindex = i; //月份列表下标切换, 样式也随之切换
            _this.banciindex = 0; //显示的是早班
            _this.banciid=31;

            this.flags = false;
            dragflag = -1;
        },
        changeBlank: function(i){
            //设置每月1号前要空多少个格, 例如1号周四则为4
            //i是月份列表下标, 传入-1则清空所有空格
            var _this = this;
            _this.blanknum = i>-1?_this.monthlist[i].dayoffirst:0;
        },
        changeBan: function(i,id){
            //改变班次选择
            var _this = this;
            if(!_this.company.hasOwnProperty('deptid')){
                layerToast('请先选择换班单位。');
                return false;
            }
            if(!isDefine(vm.dutytable)){
                layerToast('所选班次没有值班数据。');
                return false;
            }
            // if(!isDefine(_this.dutytable1) || _this.dutytable1[vm.first].dutyPeoples.length-1<i){
            //     layerToast('所选班次没有值班数据。');
            //     return false;
            // }
            _this.banciindex = i;
            _this.banciid=id;
            _this.resetTable();
            delDrag();
        },
        resetTable: function(){
            //重置值班表
            var ev = event;
            delDrag();
            if(this.dutytable.length == 0) return false;
            
            this.dutytable = [].concat(JSON.parse(JSON.stringify(this.dutytablecopy)));
            this.duty.firstDutyDay = 0;
            this.duty.firstDutyUserCode = '';
            this.duty.secondDutyDay = 0;
            this.duty.secondDutyUserCode = '';
            this.duty.detailId = 0;
            
            //如果是点击才弹出提示, 直接调用该方法则不弹出提示
            if(isDefine(ev) && ev.type=='click' && ev.currentTarget.classList.contains('btn')){
                layerToast('值班表已重置。');
                appcan.locStorage.remove('singleSwitchIndex');
            }
            this.flags = false;
            dragflag = -1;
            appcan.locStorage.remove('doubleSwitchIndex');
        },
        singleSwitch: function(itm, idx){
            //单人换班
            var that = this;
                if(itm.duty_timestamp){
                    if(itm.dutyPeoples.length==1){
                        if(vm.banciid!=itm.dutyPeoples[0].detail_id){
                            // alert(vm.banciid+'UUUU'+itm.dutyPeoples[0].detail_id);
                            return;
                        }
                    }
                    if(itm.duty_da>=that.today && dragflag==-1){
                        // alert(123)
                        that.timeout = setTimeout(function(){
                            appcan.locStorage.setVal('singleSwitchIndex', idx);
                            dragflag = 0;

                            that.duty.firstDutyDay = itm.duty_timestamp;
                            if (itm.dutyPeoples.length>1){
                                that.duty.firstDutyUserCode = itm.dutyPeoples[that.banciindex].userid;
                                that.duty.firstDutyUserCode = itm.dutyPeoples[that.banciindex].userid;
                                that.duty.detailId = itm.dutyPeoples[that.banciindex].detail_id;
                                that.duty.firstDutyRealname = itm.dutyPeoples[that.banciindex].realname;
                                appcan.locStorage.setVal('singleSwitchId', itm.dutyPeoples[that.banciindex].userid);
                            }else if(itm.dutyPeoples.length==1){
                                that.duty.firstDutyUserCode = itm.dutyPeoples[0].userid;
                                that.duty.firstDutyUserCode = itm.dutyPeoples[0].userid;
                                that.duty.detailId = itm.dutyPeoples[0].detail_id;
                                that.duty.firstDutyRealname = itm.dutyPeoples[0].realname;
                                appcan.locStorage.setVal('singleSwitchId', itm.dutyPeoples[0].userid);
                            }
                            appcan.locStorage.setVal('switchcompany', JSON.stringify(vm.company));
                            //Android
                            if(platForm=="1"){
                                appcan.window.open('duty-switch-single', 'duty-switch-single.html', 2);
                            }else{
                                appcan.window.open({
                                    name:'duty-switch-single',
                                    dataType:0,
                                    data:'duty-switch-single.html',
                                    aniId:aniId,
                                    type:1024
                                });
                            }
                        }, 700);
                    }
                }
        },
        singleSwitchCancel: function(itm, idx){
            var that = this;
            if(itm.duty_timestamp){
                if(itm.dutyPeoples.length==1){
                    if(vm.banciid!=itm.dutyPeoples[0].detail_id){
                        return;
                    }
                }
                if(itm.duty_da>=that.today){
                    clearTimeout(that.timeout);
                    that.timeout = null;

                    if(dragflag == -1){
                        //初始化拖动插件
                        if(isDefine(drake)){
                            drake.destroy();
                            drake = null;
                        }
                        //处理上一个长按后未触发的touchend事件
                        if(idx != parseInt(appcan.locStorage.getVal('singleSwitchIndex')) ){
                            dragflag = 1;
                            that.pickindex = idx;
                            appcan.locStorage.setVal('doubleSwitchIndex', idx);
                            setDrag();
                        }
                    }else if(dragflag == 1){
                        that.doubleSwitch(itm, idx);
                    }else if(dragflag == 0 && !flags){
                        that.resetTable();
                    }
                }
            }
        },
        doubleSwitch: function(itm, idx){
            //v5新需求:单击进行换班

            var that = this,
                ssindex = parseInt(appcan.locStorage.getVal('doubleSwitchIndex'));
            if (itm.dutyPeoples.length>1){
                var vmstart = that.dutytable[ssindex],
                    vmend = that.dutytable[idx],
                    start_id =vmstart.dutyPeoples[that.banciindex].userid,
                    end_id = vmend.dutyPeoples[that.banciindex].userid,
                    start_name = $.trim(vmstart.dutyPeoples[that.banciindex].realname),
                    end_name = $.trim(vmend.dutyPeoples[that.banciindex].realname);
            }else if(itm.dutyPeoples.length==1){
                var vmstart = that.dutytable[ssindex],
                    vmend = that.dutytable[idx],
                    start_id =vmstart.dutyPeoples[0].userid,
                    end_id = vmend.dutyPeoples[0].userid,
                    start_name = $.trim(vmstart.dutyPeoples[0].realname),
                    end_name = $.trim(vmend.dutyPeoples[0].realname);
            }
                //var vmstart = that.dutytable[ssindex],
                // vmend = that.dutytable[idx],
                // start_id = vmstart.dutyPeoples[that.banciindex].userid,
                // end_id = vmend.dutyPeoples[that.banciindex].userid,
                // start_name = $.trim(vmstart.dutyPeoples[that.banciindex].realname),
                // end_name = $.trim(vmend.dutyPeoples[that.banciindex].realname);
            //点击不小于今天的非当前项, 执行互换
            if(ssindex!=idx && start_id!=end_id){
                delDrag();
                //人名互换
                if (itm.dutyPeoples.length>1){
                    Vue.set(vmstart.dutyPeoples[that.banciindex], 'realname', end_name);
                    Vue.set(vmend.dutyPeoples[that.banciindex], 'realname', start_name);
                }else if (itm.dutyPeoples.length==1){
                    Vue.set(vmstart.dutyPeoples[0], 'realname', end_name);
                    Vue.set(vmend.dutyPeoples[0], 'realname', start_name);
                }
                // Vue.set(vmstart.dutyPeoples[that.banciindex], 'realname', end_name);
                // Vue.set(vmend.dutyPeoples[that.banciindex], 'realname', start_name);
                //互换后改变样式
                Vue.set(vmstart, 'checked', true);
                Vue.set(vmend, 'checked', true);
                
                //记下互换数据
                that.duty.firstDutyDay = vmstart.duty_timestamp;
                that.duty.firstDutyUserCode = end_id;
                that.duty.firstDutyRealname = end_name;
                that.duty.secondDutyDay = vmend.duty_timestamp;
                that.duty.secondDutyUserCode = start_id;
                that.duty.secondDutyRealname = start_name;
                if (itm.dutyPeoples.length>1){
                    that.duty.detailId = vmstart.dutyPeoples[that.banciindex].detail_id;
                }else if(itm.dutyPeoples.length==1){
                    that.duty.detailId = vmstart.dutyPeoples[0].detail_id;
                }
                // that.duty.detailId = vmstart.dutyPeoples[that.banciindex].detail_id;
                
                that.flags = true;
                dragflag = -1;
                appcan.locStorage.remove('doubleSwitchIndex');
                if(that.timeout != null){
                    clearTimeout(vm.timeout);
                    that.timeout = null;
                }
                
            }
        }
    }
});

var dragflag = -1; //判断是拖拽还是长按, -1无操作或操作完毕, 0则为长按, 1为拖拽
(function($) {
    //初始化选择月份的横向列表, 以及获取每月前面要空格的数量
    var monthArr = [];
    for(var a=0; a<7; a++){
        var thisy = new Date().getFullYear(),
            thism = (new Date().getMonth())+1+a,
            thisyear = thism>12?thisy+1:thism<1?thisy-1:thisy,
            thismonth = thism>12?thism-12:thism<1?thism+12:thism,
            thisfirst = new Date(thisyear+'/'+thismonth+'/01').getDay(),
            thisstamp = timeStemp(thisyear+'/'+thismonth+'/01');
            
        var ajson = {
            month: thismonth+'月', //月份字符串
            dayoffirst: thisfirst, //该月第一天是星期几, 如星期二则为2
            monthstamp: thisstamp.dateTimeSecond //该月第一天的时间戳
        };
        monthArr = monthArr.concat(ajson);
    }
    
    var tDate = new Date(),
        tYr = tDate.getFullYear(),
        tMn = tDate.getMonth()+1,
        tDy = tDate.getDate(),
        tStr = tYr+'/'+tMn+'/'+tDy+' 00:00:00';
    // vm.today = timeStemp(tStr).dateTimeSecond;
    vm.monthlist = [].concat(monthArr);
    
    appcan.ready(function() {
        var thistime = timeStemp(new Date()).dateTimeSecond;
        // loadDutyTable(thistime, vm.company.deptid)
        function isAniOpen(){
            //是否第一次访问该页面
            var isFirst = appcan.locStorage.getVal('isFirst-dutySwitch');
            //如果是第一次访问
            if(!isDefine(isFirst) || isFirst=='0'){
                animateShade();
            }
        }
        isAniOpen();
        
        //引导遮罩的动画效果
        function animateShade(){
            var act = 'actives',
                t1 = 0,
                t2 = t1 + 2,
                t3 = t2 + 1;
            
            appcan.window.publish('duty-switch-shade', 'show');
            ModalHelper.afterOpen();
            $('.shade').removeClass('shade-hide');
            setTimeout(function(){
                $('.switch-shade-box-1').addClass(act);
            }, t1*1000);
            setTimeout(function(){
                $('.switch-shade-box-2').addClass(act);
            }, t2*1000);
            setTimeout(function(){
                $('.switch-shade-box-btn').addClass(act);
            }, t3*1000);
        }
        
        //点击遮罩上的按钮, 隐藏且不再出现
        $('.switch-shade-box-btn').on('click', function(e){
            e.stopPropagation();
            
            ModalHelper.beforeClose();
            $('.shade').addClass('shade-hide');
            $('.switch-shade-box-1, .switch-shade-box-2, .switch-shade-box-btn').removeClass('actives');
            appcan.locStorage.setVal('isFirst-dutySwitch', '1');
            appcan.window.publish('duty-switch-shade', 'hide');
            return false;
        });
        
        // 顶部tab点击传值
        appcan.window.subscribe('duty-switch-table-toggle', function (msg) {
            var data = JSON.parse(msg);
            vm.changeBan(data.banciindex,data.banciid);
        });

        // 底部提交按钮
        appcan.window.subscribe('duty-switch-submit-btn', function () {
            submitData();
        });
        
        //默认为当前登陆人部门，查询相应的值班数据
        var thistime = timeStemp(new Date()).dateTimeSecond; //当前时间的时间戳
        vm.company.deptid = appcan.locStorage.getVal("deptId");
        vm.company.name = appcan.locStorage.getVal("deptName");
        vm.changeBlank(0);
        getJuese();
        loadDutyTable(thistime, vm.company.deptid); //请求数据
        vm.monthlistindex = 0;
        
        //以公司id, 获得排班数据
        appcan.window.subscribe('duty-switch', function(msg){
            var pickCompanyJson = JSON.parse(msg);
            vm.company = $.extend({}, pickCompanyJson);
            
            //还原各种设置
            dragflag = -1;
            delDrag();
            vm.flags = false;
            vm.changeBlank(0);
            vm.monthlistindex = 0;
            vm.banciindex = 0;
            
            var thistime = timeStemp(new Date()).dateTimeSecond; //当前时间的时间戳
            loadDutyTable(thistime, vm.company.deptid); //请求数据
        });
        
        //单人换班
        appcan.window.subscribe('duty-switch-single', function(msg){
            var switchSingleJson = JSON.parse(msg);
            var ssindex = appcan.locStorage.getVal('singleSwitchIndex');
            for(var i=0;i<vm.dutytable.length;i++){
                 if (vm.dutytable[i].dutyPeoples.length>1){
                     Vue.set(vm.dutytable[ssindex].dutyPeoples[vm.banciindex], 'realname', switchSingleJson.userName);
                     vm.duty.secondDutyUserCode = vm.dutytable[ssindex].dutyPeoples[vm.banciindex].userid;
                     vm.duty.secondDutyRealname = vm.dutytable[ssindex].dutyPeoples[vm.banciindex].realname;
                 }else if(vm.dutytable[i].dutyPeoples.length==1){
                     Vue.set(vm.dutytable[ssindex].dutyPeoples[0], 'realname', switchSingleJson.userName);
                     vm.duty.secondDutyUserCode = vm.dutytable[ssindex].dutyPeoples[0].userid;
                     vm.duty.secondDutyRealname = vm.dutytable[ssindex].dutyPeoples[0].realname;
                 }
            }
            // Vue.set(vm.dutytable[ssindex].dutyPeoples[vm.banciindex], 'realname', switchSingleJson.userName);
            Vue.set(vm.dutytable[ssindex], 'checked', true);
            // vm.duty.secondDutyUserCode = vm.dutytable[ssindex].dutyPeoples[vm.banciindex].userid;
            vm.duty.firstDutyUserCode = switchSingleJson.id;
            // vm.duty.secondDutyRealname = vm.dutytable[ssindex].dutyPeoples[vm.banciindex].realname;
            vm.flags = true;
        });
        
        //再次打开动画遮罩
        appcan.window.subscribe('duty-switch-ani', function(){
            isAniOpen();
        });
        
        //从单人换班选择页面返回后, 值班表重置
        appcan.window.subscribe('duty-switch-back', function(msg){
            vm.resetTable();
        });
        
        //监听安卓系统返回键
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.locStorage.remove('switchcompany'); //删去之前选择的公司数据
                appcan.locStorage.remove('singleSwitchIndex');
                appcan.locStorage.remove('singleSwitchId');
                appcan.locStorage.setVal('isFirst-dutySwitch', '1');
                appcan.window.close(1);
            }
        };
        
        // var platFormC=appcan.locStorage.getVal("platForm");
        // var isSupport=true;
        // if(platFormC=="1"){
            // isSupport=false;
        // }
        // var paramClose = {
            // isSupport:isSupport
        // };
        // uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        // uexWindow.onSwipeRight = function(){
            // if(dragflag == -1){
                 // appcan.locStorage.remove('switchcompany'); //删去之前选择的公司数据
                 // appcan.locStorage.remove('singleSwitchIndex');
                 // appcan.locStorage.remove('singleSwitchId');
                 // appcan.window.close(1);
            // }
        // }
        
        //解锁功能页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("option-click","option-click");
        
    });
    
    appcan.button("#switch-company", "btn-act", function() {
        //Android
        if(platForm=="1"){
            appcan.window.open('duty-switch-company', 'duty-switch-company.html', 2);
        }else{
              appcan.window.open({
                name:'duty-switch-company',
                dataType:0,
                data:'duty-switch-company.html',
                aniId:aniId,
                type:1024
            });  
        }
        
    });
    
    //点击提交按钮
    function submitData() {
        if(!vm.company.hasOwnProperty('deptid')){
            layerToast('请先选择换班单位。');
            return false;
        }
        if(vm.duty.firstDutyDay == ''){
            layerToast('无换班操作，无需提交。');
            return false;
        }
        if(vm.dutyreason == ''){
            layerToast('请填写换班原因。');
            return false;
        }
        //是否值班帐号
        var isDutyAccount=appcan.locStorage.getVal("isDutyAccount");
        //如果不是值班帐号，则取出当前登录人的code,判断换班人员是否包含当前人。
        if(isDutyAccount!="1"){
            var userID=appcan.locStorage.getVal("userID");
             if(userID!=vm.duty.firstDutyUserCode && userID!=vm.duty.secondDutyUserCode){
                  layerToast('对不起，您只能提交跟自己相关的换班申请，不能提交其他值班人员的换班申请。');
                  return false;
             }
        }
        //单日换班, secondDutyDay为0, type=1, 反之type=2
        vm.duty.type = vm.duty.secondDutyDay==0?1:2;
        
        var confirm_text = '';
        if(vm.duty.type==1){
            confirm_text = '确定把【' + new Date(vm.duty.firstDutyDay*1000).getDate() + '号 '
                            + vm.duty.firstDutyRealname + '】换成【' + vm.duty.secondDutyRealname + '】吗？';
        }else if(vm.duty.type==2){
            confirm_text = '确定把【' + new Date(vm.duty.firstDutyDay*1000).getDate() + '号 '
                            + vm.duty.secondDutyRealname + '】与【' + new Date(vm.duty.secondDutyDay*1000).getDate() + '号 '
                            + vm.duty.firstDutyRealname + '】互换吗？';
        }
        
        if(vm.juese == 1){
            confirm_text += '<br>您提交的换班申请无需您审批，系统会自动审核通过';
        }
        
        appcan.window.publish('duty-switch-shade', 'show');
        addConfirm({
            content: confirm_text,
            yes: function(index){
                layerRemove(index);
                var json = {
                    path: serverPath + 'applyFor.do?focaddApply',
                    data:{
                        departId: vm.company.deptid,
                        detailId: vm.duty.detailId,
                        userAid: vm.duty.firstDutyUserCode,
                        userAtime: vm.duty.firstDutyDay,
                        userBid: vm.duty.secondDutyUserCode,
                        userBtime: vm.duty.secondDutyDay,
                        content: vm.dutyreason,
                        type: vm.duty.type
                    }
                };
                
                ajaxRequest(json,function(data,e){
                    appcan.window.publish('duty-switch-shade', 'hide');
                    
                    if(e == 'success'){
                        layerToast('提交成功！');
                        
                        //Android
                        if(platForm=="1"){
                            appcan.window.open('duty-switch-history', 'duty-switch-history.html', 2);
                        }else{
                            appcan.window.open({
                                name:'duty-switch-history',
                                dataType:0,
                                data:'duty-switch-history.html',
                                aniId:aniId,
                                type:1024
                            });  
                        }
                        vm.dutyreason = '工作原因';
                        
                        //如果角色为02值班, 换班后请求最新值班表
                        if(vm.juese == 1){
                            loadDutyTable(timeStemp(new Date()).dateTimeSecond, vm.company.deptid);
                        }
                        
                    }else{
                        layerToast('提交不成功，请稍后重试！');
                    }
                });
            },
            no: function(index){
                appcan.window.publish('duty-switch-shade', 'hide');
                layerRemove(index);
            }
        });
    };
    
})($);

//处理并渲染数据
function handleData(data){
    var numBanci = 1;
    if(!data.obj.length){
        //如果请求成功但无数据, 则不渲染数据, 清空之前的值班表数据
        layerToast('该月份暂无值班表。');
        vm.dutytable.splice(0, vm.dutytable.length);
        vm.dutytablecopy.splice(0, vm.dutytablecopy.length);
        vm.changeBlank(-1);

    }else{
        //numBanci = data.obj[0].dutyPeoples.length;
        //渲染值班表数据
        vm.dutytable = [].concat(data.obj);
        
        $.each(vm.dutytable, function(i, n){
            n.duty_date = n.duty_time.split(' ')[0];
            n.duty_id = n.dutyPeoples[0].detail_id;
            if (n.duty_date.substr(8,1)==0){
                n.duty_da =n.duty_date.substr(9,1);
            }else {
                n.duty_da =n.duty_date.substr(8,2);
            }

        });

        var curDate = new Date();
        var curMonth = curDate.getMonth()+1;
        var moDay=getCountDays(curMonth)
        var curDay = curDate.getDate();
        vm.today =curDay;
        if (vm.monthnum==''){
            vm.monthnum=moDay
        }
        //循环添加对象
        for(var i=1;i<=vm.monthnum;i++){
            var date = "";
            var Peoples;
            date = i;
            Peoples=[];
            var obj = {duty_da: date,dutyPeoples:Peoples};
            vm.dutytable1.push(obj);
        }
        //合并数组
        for(var i=0;i<vm.dutytable1.length;i++){
            for(var j=0;j<vm.dutytable.length;j++){
                if (vm.dutytable1[i].duty_da == vm.dutytable[j].duty_da) {
                    vm.dutytable1.splice(i, 1);
                    vm.dutytable1.push(vm.dutytable[j])
                    vm.dutytable1.sort(function (a,b) {
                        return a.duty_da - b.duty_da
                    })
                }
            }
        }
        vm.dutytable=vm.dutytable1
        
        vm.dutytable.forEach(function(n, i){
            if(n.duty_time){
                Vue.set(n, 'duty_timestamp', timeStemp(n.duty_time).dateTimeSecond);
            }
        });
        vm.dutytablecopy = [].concat(JSON.parse(JSON.stringify(vm.dutytable)));
        vm.changeBlank(vm.monthlistindex);
    }
    //定义班次数组
    var banci=new Array();
    for (var i=0; i < data.attributes.dutyModeDetail.length; i++) {
         banci.push(data.attributes.dutyModeDetail[i]);
    };
    vm.banci=banci;
}

function getJuese () {
    var json = {
        path: serverPath + 'focUserController.do?focgetRole',
        data: {},
        layer: false
    };
    ajaxRequest (json, function (data, e) {
        if(e == 'success'){
            vm.juese = data.obj[0].id == '8a8a8bfa59969e880159976fa8500087' ? 1 : 0;
        }else{
            //layerToast('抱歉，获取值班表出错，请稍后重试。');
        }
    });
}

function loadDutyTable(day, deptid){
    //appcan.window.publish('duty-switch-shade', 'show');
    
    if(!isDefine(day)){
        day = Math.round(new Date().getTime()/1000);
    }
    var json = {
        path: serverPath+'schedule.do?focgetMonthDuty',
        data: {
            time: day,
            departId: deptid
        },
        layer: false
    };
    ajaxRequest(json,function(data, e){
        console.log(data);
        //appcan.window.publish('duty-switch-shade', 'hide');
        if(e=="success"){
            handleData(data); //处理数据
        }else{
            layerToast('抱歉，获取值班表出错，请稍后重试。');
        }
    });
}

//移除拖动插件
function delDrag(){
    vm.pickindex = -1;
    if(isDefine(drake)){
        drake.destroy();
        drake = null;
    }
}

//设置拖动
var drake = null;
function setDrag(){
    var dragarr = [],
        start = -1, end = -1;
    
    drake = dragula([document.querySelector('#switch-body')], {
        copy: true,
        invalid: function(el, handle){
            var clsarr = el.classList;
            if(clsarr.contains('switch-item')){
                var dragidx = $(el).index() - vm.blanknum;
                //如果是空白格or选择日期小于今天, 不予拖动
                //if(!clsarr.contains('switch-draggable') || vm.today>vm.dutytable[dragidx].duty_timestamp){
                //    return true;
                //}
                if(dragidx != vm.pickindex){
                    return true;
                }
            }
        }
    }).on('drag', function(el, source){
        //获取值班表格每个单元格所占区域
        if(platForm == '1'){
            $('html, body').css({
                'overflow-y': 'hidden'
            });
        }
        
        var dragli = $('#switch-body .switch-draggable');
        for(var l=0; l<dragli.length; l++){
            var lobj = dragli[l];
            
            var widthMin = Math.round($(lobj).offset().left),
                widthMax = Math.round(widthMin + lobj.offsetWidth),
                heightMin = Math.round($(lobj).offset().top),
                heightMax = Math.round(heightMin + lobj.offsetHeight);
            
            var area = {
                'wmin': widthMin,
                'wmax': widthMax,
                'hmin': heightMin,
                'hmax': heightMax
            };
            
            dragarr = dragarr.concat(area);
        }
        
        start = $(el).index()-vm.blanknum;
    }).on('cloned', function(clone, original, type){
        clone.classList.add('actives');
    }).on('drop', function(el, target, source, sibling){
        var point = event.changedTouches ? event.changedTouches[0] : event,
            pointX = point.pageX,
            pointY = point.pageY;
        
        for(var p=0; p<dragarr.length; p++){
            var pcur = dragarr[p];
            //如果落入区域
            if(pointX>=pcur.wmin && pointX<=pcur.wmax && pointY>=pcur.hmin && pointY<=pcur.hmax){
                end = p;
                // for(var i=0;i<vm.dutytable.length;i++){
                //     if (vm.dutytable[i].dutyPeoples.length>1){
                //         var vmstart = vm.dutytable[start],
                //             vmend = vm.dutytable[end],
                //             start_id = vmstart.dutyPeoples[vm.banciindex].userid,
                //             end_id = vmend.dutyPeoples[vm.banciindex].userid,
                //             start_name = $.trim(vmstart.dutyPeoples[vm.banciindex].realname),
                //             end_name = $.trim(vmend.dutyPeoples[vm.banciindex].realname);
                //     }else if(vm.dutytable[i].dutyPeoples.length==1){
                //         var vmstart = vm.dutytable[start],
                //             vmend = vm.dutytable[end],
                //             start_id = vmstart.dutyPeoples[0].userid,
                //             end_id = vmend.dutyPeoples[0].userid,
                //             start_name = $.trim(vmstart.dutyPeoples[0].realname),
                //             end_name = $.trim(vmend.dutyPeoples[0].realname);
                //
                //     }
                // }

                var vmstart = vm.dutytable[start];
                var vmend = vm.dutytable[end];
                if(vm.dutytable[p].departname){
                    if(vmstart.dutyPeoples.length==1){
                        var start_id = vmstart.dutyPeoples[0].userid
                        var end_id = vmend.dutyPeoples[0].userid
                        var start_name = $.trim(vmstart.dutyPeoples[0].realname)
                        var end_name = $.trim(vmend.dutyPeoples[0].realname)
                        var banciID = vmend.dutyPeoples[0].detail_id
                    }
                    if(vmstart.dutyPeoples.length>1){
                        var  start_id = vmstart.dutyPeoples[vm.banciindex].userid
                        var end_id = vmend.dutyPeoples[vm.banciindex].userid
                        var banciID = vmend.dutyPeoples[vm.banciindex].detail_id
                        var start_name = $.trim(vmstart.dutyPeoples[vm.banciindex].realname)
                        var end_name = $.trim(vmend.dutyPeoples[vm.banciindex].realname)
                    }
                }
                //大于今天日期的才能换, 且不能当天与当天互换
                if (vm.dutytable[p].departname){
                    if(vm.dutytable[p].duty_da>=vm.today&& vm.banciid==banciID){
                        //人名互换
                        // for(var i=0;i<vm.dutytable.length;i++){
                        //     if (vm.dutytable[i].dutyPeoples.length>1){
                        //         Vue.set(vmstart.dutyPeoples[vm.banciindex], 'realname', end_name);
                        //         Vue.set(vmend.dutyPeoples[vm.banciindex], 'realname', start_name);
                        //         vm.duty.detailId = vmstart.dutyPeoples[vm.banciindex].detail_id;
                        //     }else if(vm.dutytable[i].dutyPeoples.length==1){
                        //         Vue.set(vmstart.dutyPeoples[0], 'realname', end_name);
                        //         Vue.set(vmend.dutyPeoples[0], 'realname', start_name);
                        //         vm.duty.detailId = vmstart.dutyPeoples[0].detail_id;
                        //     }
                        // }
                        if(vmstart.dutyPeoples.length>1){
                            Vue.set(vmstart.dutyPeoples[vm.banciindex], 'realname', end_name);
                            Vue.set(vmend.dutyPeoples[vm.banciindex], 'realname', start_name);
                            vm.duty.detailId = vmstart.dutyPeoples[vm.banciindex].detail_id;
                        }
                        if(vmstart.dutyPeoples.length==1){
                            Vue.set(vmstart.dutyPeoples[0], 'realname', end_name);
                            Vue.set(vmend.dutyPeoples[0], 'realname', start_name);
                            vm.duty.detailId = vmstart.dutyPeoples[0].detail_id;
                        }
                        // Vue.set(vmstart.dutyPeoples[vm.banciindex], 'realname', end_name);
                        // Vue.set(vmend.dutyPeoples[vm.banciindex], 'realname', start_name);
                        //互换后改变样式
                        Vue.set(vmstart, 'checked', true);
                        Vue.set(vmend, 'checked', true);

                        //记下互换数据
                        vm.duty.firstDutyDay = vmstart.duty_timestamp;
                        vm.duty.firstDutyUserCode = end_id;
                        vm.duty.firstDutyRealname = end_name;
                        vm.duty.secondDutyDay = vmend.duty_timestamp;
                        vm.duty.secondDutyUserCode = start_id;
                        vm.duty.secondDutyRealname = start_name;
                        // vm.duty.detailId = vmstart.dutyPeoples[vm.banciindex].detail_id;

                        vm.flags = true;
                        dragflag = -1;
                        clearTimeout(vm.timeout);
                        vm.timeout = null;
                    }
                }

                break;
            }
        }
        
        if(platForm == '1'){
            $('html, body').css({
                'overflow-y': 'auto'
            });
        }
        
    });
}
//获取每月天数
function getCountDays(num) {
    var curDate = new Date();
    curDate.setMonth(num-1);
    curDate.setDate(0);
    return curDate.getDate();
}
