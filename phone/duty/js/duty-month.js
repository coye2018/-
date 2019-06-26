//banci: 班次名
//banciindex: 班次下标
//company: 公司名和属性, 见duty-switch-company.html
//monthlist: 月份的列表
//monthlistindex: 月份列表下标
//blanknum: 每月前面要空格的数量
//dutytable: 值班数据
//today: 今天的日期, XXXX-XX-XX
var vm = new Vue({
    el: '#duty-switch',
    data: {
        banci: ['正班','副班'],
        banciindex: 0,
        banciid:31,
        company: {},
        monthlist: [],
        monthlistindex: 3,
        blanknum: 0,
        dutytable: [],
        dutytable1: [],
        today: '',
        monthnum:'',
        first:'',
        last:''
    },
    methods: {
        changeMonth: function(i){
            //改变月份重新请求数据

            var _this = this,
                ev = event;
            var dayNumber=_this.monthlist[i].month.slice(0,_this.monthlist[i].month.length-1);

            //是点击触发, 而不是直接调用
            if(isDefine(ev) && ev.type=='click'){
                //是否选中换班单位
                if(_this.company.hasOwnProperty('deptid')){
                    //点中的是当前项, 无需重新请求数据
                    if(_this.monthlistindex == i) return false;
                    //否则请求数据
                    var mDay=getMonthDates(year,dayNumber);
                    // var mDay=curDate.getDate();
                    vm.dutytable=[];
                    vm.dutytable1=[];
                    vm.monthnum=mDay;
                    loadDutyTable(_this.monthlist[i].monthstamp, _this.company.deptid,i);
                }
            }
            
            _this.monthlistindex = i; //月份列表下标切换, 样式也随之切换
            _this.banciindex = 0; //显示的是早班
            _this.banciid = 31;
        },
        changeBlank: function(i){
            //设置每月1号前要空多少个格, 例如1号周四则为4
            //i是月份列表下标, 传入-1则清空所有空格
            var _this = this;
            _this.blanknum = i>-1?_this.monthlist[i].dayoffirst:0;
        },
        changeBan: function(i,id){
            // alert(id)
            var _this = this;
            if(!isDefine(vm.dutytable)){
                layerToast('所选班次没有值班数据。');
                //vm.banciindex = 0;
                return false;
            }else{
                this.banciindex = i;
                this.banciid = id;
            }
        }
         
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.locStorage.remove('switchcompany'); //删去之前选择的公司数据
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {
    });
    
    //初始化选择月份的横向列表, 以及获取每月前面要空格的数量
    var monthArr = [];
    for(var a=-3; a<4; a++){
        var thisy = new Date().getFullYear(),
            thism = (new Date().getMonth())+1+a,
            thisyear = thism>12?thisy+1:thism<1?thisy-1:thisy,
            thismonth = thism>12?thism-12:thism<1?thism+12:thism,
            thisfirst = new Date(thisyear+'/'+thismonth+'/01').getDay(),
            thisstamp = timeStemp(thisyear+'/'+thismonth+'/01');
        //console.log(thisyear+'/'+thismonth+'/01');
        
        var ajson = {
            month: thismonth+'月', //月份字符串
            dayoffirst: thisfirst, //该月第一天是星期几, 如星期二则为2
            monthstamp: thisstamp.dateTimeSecond //该月第一天的时间戳
        };
        monthArr = monthArr.concat(ajson);
    }
    
    // vm.today = timeStemp(new Date(), 'yyyy-MM-dd').date;
    vm.monthlist = [].concat(monthArr);
    console.log(monthArr);
    
    appcan.ready(function() {
        var thistime = Math.round(new Date().getTime()/1000); //当前时间的时间戳
        vm.company.deptid=appcan.locStorage.getVal("dutyMonthDeptId");
        loadDutyTable(thistime, vm.company.deptid,3); //请求数据
        var banciid=appcan.locStorage.getVal("banciid");
        if(isDefine(banciid)){
            vm.banciid=Number(banciid);
            if(vm.banciid==31){
                vm.banciindex=0;
            }else{
                vm.banciindex=1;
            }
        }
        var platFormC=appcan.locStorage.getVal("platForm");
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            appcan.locStorage.remove('switchcompany'); //删去之前选择的公司数据
            appcan.window.close(1); 
        }
        
    });
    
    appcan.button("#switch-company", "btn-act", function() {
        appcan.window.open('duty-switch-company', 'duty-switch-company.html', 2);
    });
    
})($);

//处理并渲染数据
function handleData(data,index){
    //console.log(data);
    //定义班次数组
    var banci=new Array();
    for (var i=0; i < data.attributes.dutyModeDetail.length; i++) {
        banci.push(data.attributes.dutyModeDetail[i]);
    };
    vm.banci=banci;
    var numBanci = 1;
    if(!data.obj.length){
        //如果请求成功但无数据, 则不渲染数据, 清空之前的值班表数据
        layerToast('该月份暂无值班表。');
        vm.dutytable.splice(0, vm.dutytable.length);
        vm.changeBlank(-1);
    }else{

        numBanci = data.obj[0].dutyPeoples.length;
        //渲染值班表数据
        vm.dutytable = [].concat(data.obj);
        $.each(vm.dutytable, function(i, n){
            n.duty_date = n.duty_time.split(' ')[0];
            if (n.duty_date.substr(8,1)==0){
                n.duty_da =n.duty_date.substr(9,1);
            }else {
                n.duty_da =n.duty_date.substr(8,2);

            }
        });

        vm.first=vm.dutytable[0].duty_da;
        vm.last=vm.dutytable[vm.dutytable.length-1].duty_da;

        var curDate = new Date();
        var year =curDate.getFullYear();
        vm.Year =year;
        var curMonth = curDate.getMonth()+1;
        var curDay = curDate.getDate();
        vm.today =curDay;
        // alert(curDay)
        var moDay=getMonthDates(year,curMonth)
        // alert(moDay)
        if (vm.monthnum==''){
            vm.monthnum=moDay
        }
        //补全数组
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
        console.log(vm.dutytable1)
        console.log(vm.dutytable)
        vm.dutytable.forEach(function(n, i){
            if(n.duty_time){
                Vue.set(n, 'duty_timestamp', timeStemp(n.duty_time).dateTimeSecond);
            }
        });
        vm.changeBlank(vm.monthlistindex);

        var todayDate = new Date(),
            todayDateYr = todayDate.getFullYear(),
            todayDateMn =  todayDate.getMonth()+1;

    }
    vm.changeBlank(index);
    vm.monthlistindex =index; 
    
}

function loadDutyTable(day, deptid,i){
    if(!isDefine(day)){
        day = Math.round(new Date().getTime()/1000);
    }
    var json = {
        path: serverPath+'schedule.do?focgetMonthDuty',
        data: {
            time: day,
            departId: deptid
        },
        layer: true
    };
    ajaxRequest(json,function(data, e){
       if(e=="success"){
           console.log(data);
           handleData(data,i); //处理数据
       } 
    });
}
//获取每月天数
function getMonthDates(year, month){
    var d = new Date(year, month, 0);
    return d.getDate();
}
var curDate = new Date();
var year =curDate.getFullYear();