Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
    el: '#duty_switch_single',
    data: {
        searchIpt: '',
        isToInput: false,
        people: [],
        peoplePick: [],
        peopleLen: 0
    },
    methods: {
        searchToInput: function(){
            //从文本标签切换到输入框
            this.isToInput = true;
        },
        searchToText: function(){
            //从输入框切换到文本标签
            if(this.searchIpt != '') return false;
            this.isToInput = false;
        },
        searchEmpty: function(){
            //清除输入框
            this.searchIpt = '';
            this.isToInput = false;
        },
        headpicReplace: function(vals){
            //加载头像失败, 替换成文字图像
            vals.hashead = false;
        },
        pickPeople: function(val){
            appcan.window.publish('duty-switch-single', JSON.stringify(val));
            appcan.window.close(1);
        },
        searchFilter: function(){
            var sipt = this.searchIpt.toLowerCase(),
                itemArr = [].slice.call(document.querySelectorAll('.myli>li')),
                itemNone = document.querySelector('.nothing'),
                countItem = 0;
            
            itemArr.forEach(function(it){
                var thisname = it.dataset.name.trim(),
                    thispinyin = it.dataset.pinyin.trim(),
                    thisszm = it.dataset.szm.trim();
                
                if(sipt != ''){
                    if(thisname.indexOf(sipt)<0 
                        && thispinyin.indexOf(sipt)<0
                        && thisszm.indexOf(sipt)<0){
                        it.classList.add('hide');
                        countItem++;
                    }else{
                        it.classList.remove('hide');
                    }
                }else{
                    it.classList.remove('hide');
                }
            });
            
            if(sipt!='' && countItem==itemArr.length){
                itemNone.classList.remove('hide');
            }else{
                itemNone.classList.add('hide');
            }
            
            document.querySelector('.address-list').scrollTop = 0;
        }
    }
});

var ucode = appcan.locStorage.getVal('singleSwitchId');
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.publish('duty-switch-back', '1');
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {
        //设置当前页面字号
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        var swc = appcan.locStorage.getVal('switchcompany');
        if(isDefine(swc)){
            var swcJson = JSON.parse(swc);
            // console.log(swcJson);
            
            loadDeptDutyPeople(swcJson.deptid);
        }
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.window.publish('duty-switch-back', '1');
                appcan.window.close(1);
            }
        };
        
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
             appcan.window.publish('duty-switch-back', '1');
             appcan.window.close(1);
        }
    });
    
})($);

function loadDeptDutyPeople(deptid){
    var json = {
        path: serverPath+'schedule.do?focgetDutyPersions',
        data: {
            departId: deptid
        },
        layer: true
    };
    
    ajaxRequest(json,function(data, e){
       if(e=="success"){
           membersHandle(data.obj);
       }else{
           // console.log(data);
       }
    });
}

function membersHandle(data){
    for(var y=0; y<data.length; y++){
        var thisPeople = data[y];
        //删去选中人员的那条记录, 避免自己和自己换班的情况
        if(thisPeople.id == ucode){
            data.splice(y, 1);
            y--;
            continue;
        }
        vm.peopleLen++;
        
        //人名搜索的字符串处理
        thisPeople.userName = thisPeople.userName.trim();
        var pyDuo = [], pySuo = [];
        var py = Utils.CSpell.getSpell(thisPeople.userName, function(c, s){
            pyDuo.push(s);
        });
        pyDuo.forEach(function(aa, va){
            var pyDuoLs = [];
            aa.forEach(function(bb, vb){
                pyDuoLs.push(bb.charAt(0));
            });
            pySuo.push(pyDuoLs);
        });
        
        var pyNew = py.split(',');
        var pyLong = pyNew.concat(),
            pyShort = pyNew.concat(),
            pyCount = 0;
        //把多音字出现的地方替换成多音字数组
        for(var i=0; i<pyNew.length; i++){
            if(pyNew[i] == ''){
                pyLong.splice(i, 1, pyDuo[pyCount]);
                pyShort.splice(i, 1, pySuo[pyCount]);
                pyCount++;
            }else{
                pyLong[i] = pyLong[i].split('~');
                pyShort[i] = pyShort[i].charAt(0).split('~');
            }
        }
        var pyL = doExchange(pyLong);
        for(var j=0; j<pyL.length; j++){
            pyL[j] = pyL[j].join('');
        }
        var pyArrL = pyL.join(',');
        thisPeople.userPinyin = pyArrL;
        
        var pyS = doExchange(pyShort);
        for(var k=0; k<pyS.length; k++){
            pyS[k] = pyS[k].join('');
        }
        var pyArrS = pyS.join(',');
        thisPeople.userSZM = pyArrS;
        
        //设置背景色、头像文字
        thisPeople.headbgclass = getHeadClass(thisPeople.id);
        thisPeople.headtext = thisPeople.userName.substr(-2,2);
        
        //给头像设好url
        if(!isDefine(thisPeople.head_image)){
            thisPeople.hashead = false;
        }else{
            thisPeople.hashead = true;
            thisPeople.headurl = serverPath + thisPeople.head_image;
        }
    }
    vm.people = [].concat(data);
    // console.log(JSON.parse(JSON.stringify(vm.people)));
}

/*返回组合的数组*/
function doExchange(arr){
    var len = arr.length;
    // 当数组大于等于2个的时候
    if(len >= 2){
        // 第一个数组的长度
        var len1 = arr[0].length;
        // 第二个数组的长度
        var len2 = arr[1].length;
        // 2个数组产生的组合数
        var lenBoth = len1 * len2;
        //  申明一个新数组
        var items = new Array(lenBoth);
        // 申明新数组的索引
        var index = 0;
        for(var i=0; i<len1; i++){
            for(var j=0; j<len2; j++){
                if(arr[0][i] instanceof Array){
                    items[index] = arr[0][i].concat(arr[1][j]);
                }else{
                    items[index] = [arr[0][i]].concat(arr[1][j]);
                }
                index++;
            }
        }
        var newArr = new Array(len -1);
        for(var i=2;i<arr.length;i++){
            newArr[i-1] = arr[i];
        }
        newArr[0] = items;
        return doExchange(newArr);
    }else{
        return arr[0];
    }
}
