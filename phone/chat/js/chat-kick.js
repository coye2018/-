Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var vm = new Vue({
    el: '#chat_kick',
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
        pickPeople: function(ucodes){
            var _this = this;
            for(var s=0; s<_this.people.length; s++){
                var _val = _this.people[s];
                
                if(_val.userCode == ucodes){
                    _val.checked = !_val.checked;
                    if(_val.checked){
                        //若选中, 加入peoplePick数组
                        var pickThis = {};
                        pickThis.name = _val.userName;
                        pickThis.id = _val.id;
                        pickThis.userCode = _val.userCode;
                        
                        _this.peoplePick = _this.peoplePick.concat(pickThis);
                    }else{
                        //若取消选中, 从peoplePick数组中移除
                        for(var t=0; t<_this.peoplePick.length; t++){
                            if(_this.peoplePick[t].userCode == ucodes){
                                vm.peoplePick.splice(t, 1);
                                break;
                            }
                        }
                    }
                }
                
            }
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

var ucode = appcan.locStorage.getVal('userCode');
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
        appcan.locStorage.remove('groupmember');
    });
    appcan.button("#nav-right", "btn-act",
    function() {});
    
    appcan.ready(function() {
        var gm = appcan.locStorage.getVal('groupmember');
        if(!isDefine(gm)) return;
        membersHandle(JSON.parse(gm));
        //设置当前页面字号
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
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
             appcan.locStorage.remove('groupmember');
             appcan.window.close(1);
        }
    });
    
    $("#handin").on("click", function(){
        if(vm.peoplePick.length==vm.people.length){
            addConfirm({
                 content:'确定要解散此群吗？',
                 yes: function(i){
                     layerRemove(i);
                     var param = {
                        groupId:appcan.locStorage.getVal("chat-dialog-groupChatId")
                     };
                     uexEasemob.exitAndDeleteGroup(param);
                     appcan.window.publish("kickGroup","kickGroup");
                     var closeArr = ['chat-kick', 'chat-dialog','chat-file-group'];
                        closeArr.forEach(function(name){
                            appcan.window.evaluateScript({
                                name:name,
                                scriptContent:'appcan.window.close(-1);'
                            });
                        });
                 }
            });
        }else{
            //点击确定
            appcan.window.publish("chat-kick",JSON.stringify(vm.peoplePick));
            appcan.window.close(1);
        }
        
    });
    
    
    
})($);

function membersHandle(data){
    //console.log(JSON.parse(JSON.stringify(data)));
    for(var y=0; y<data.length; y++){
        var thisPeople = data[y];
        //删去用户自己那条数据
        if(thisPeople.userCode == ucode){
            data.splice(y, 1);
            y--;
            continue;
        }
        data.checked = false;
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
        
    }
    vm.people = [].concat(data);
    //console.log(JSON.parse(JSON.stringify(vm.people)));
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
