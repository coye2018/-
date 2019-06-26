Vue.directive('focus', function(el, bd){
    //文本框聚焦
    if(bd.value && !el.value)el.focus();
});

var ms;
var vm = new Vue({
    el: '#address_list',
    data: {
        searchIpt: '',
        isToInput: false,
        people: [],
        peopleIndex: [],
        nonet: false,
        fastFindText: '',
        indexElement: 0
    },
    mounted: function () {
        //ios300ms延时
        //FastClick.attach(document.body);
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
            this.searchFilter();
        },
        headpicReplace: function(vals){
            //加载头像失败, 替换成文字图像
            //vals.hashead = false;
        },
        fastFind: function(e){
            //滑动右侧序列快速分类找
            var point = event.changedTouches ? event.changedTouches[0] : event,
                pointElement = document.elementFromPoint(point.pageX, point.pageY),
                pointParElement = pointElement.parentNode,
                parentElement = document.querySelectorAll('.address-index-box')[0],
                groupArr = [].slice.call(document.querySelectorAll('.myli-box'));
            
            //非当前项去除样式
            // if(this.indexElement){
                // this.indexElement.classList.remove('active');
                // this.indexElement = null;
            // }
            
            //根据触摸对应序列文字, 显示序列名
            if(pointElement && pointParElement==parentElement){
                var group = pointElement.innerText,
                    groupFull = pointElement.dataset.group;
                
                //this.indexElement = pointElement;
                this.indexElement = getChildrenIndex(pointElement);
                if(group && group.replace(/[^\x00-\xff]/g,'**').length<=4){
                    this.fastFindText = group;
                }
                
                //定位
                var groupEl = document.querySelector('[data-group="' + groupFull + '"]');
                if(!groupEl) return;
                
                var platForm = appcan.locStorage.getVal("platForm");
                document.querySelector('.address-list').scrollTop = groupEl.offsetTop;
                // ms.refresh();
                // ms.scrollToElement(groupEl, 0);
            }
            
            //样式改变
            //pointElement.classList.add('active');
        },
        fastFindEnd: function(e){
            //退出滑动序列
            this.fastFindText = '';
            
            // if(this.indexElement){
                // this.indexElement.classList.remove('active');
                // this.indexElement = null;
            // }
        },
        searchFilter: function(){
            var sipt = this.searchIpt.toLowerCase().replace(/(^\s+)|(\s+$)/g, ''),
                itemNone = document.querySelector('.nothing'),
                groupIdx = document.querySelectorAll('.address-index span'),
                groupArr = [].slice.call(document.querySelectorAll('.myli-box')),
                cacheArr = JSON.parse(appcan.locStorage.getVal('contactsIndex'));
            var countGroup = 0;
            
            groupArr.forEach(function(gp, gi){
                var itemArr = [].slice.call(gp.querySelectorAll('.myli>li'));
                var thisgroup = gp.dataset.group.trim(),
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
                
                //一个单位里没有符合匹配项的人, 该单位整体隐藏
                if(sipt!='' && countItem==itemArr.length){
                    gp.classList.add('hide');
                    //groupIdx[gi].classList.add('hide');
                    cacheArr[gi] = '';
                    countGroup++;
                }else{
                    gp.classList.remove('hide');
                    //groupIdx[gi].classList.remove('hide');
                }
            });
            
            this.$nextTick(function(){
                this.peopleIndex.splice(0, this.peopleIndex.length);
                this.peopleIndex = [].concat(cacheArr);
                
                for(var v=0; v<cacheArr.length; v++){
                    if(cacheArr[v] != ''){
                        this.indexElement = v;
                        break;
                    }
                }
            });
            
            if(sipt!='' && countGroup==groupArr.length){
                itemNone.classList.remove('hide');
            }else{
                itemNone.classList.add('hide');
            }
            
            document.querySelector('.address-list').scrollTop = 0;
        },
        searchFilter2: function(){
            var sipt = this.searchIpt.toLowerCase().replace(/(^\s+)|(\s+$)/g, ''),
                itemNone = document.querySelector('.nothing'),
                cache = appcan.locStorage.getVal('contacts');
            
            if(sipt == ''){
                vm.people = JSON.parse(cache);
            }else{
                var cacheJson = JSON.parse(cache);
                for(var g=0; g<cacheJson.length; g++){
                    for(var h=0; h<cacheJson[g].jsonStr.length; h++){
                        var it = cacheJson[g].jsonStr[h];
                        if(it.userName.indexOf(sipt)<0 
                            && it.userPinyin.indexOf(sipt)<0
                            && it.userSZM.indexOf(sipt)<0){
                            cacheJson[g].jsonStr.splice(h, 1);
                            h--;
                        }
                    }
                    
                    if(cacheJson[g].jsonStr.length==0){
                        cacheJson.splice(g, 1);
                        g--;
                    }
                }
                vm.people = cacheJson;
                
                if(vm.people.length!=0){
                    itemNone.classList.add('hide');
                }else{
                    itemNone.classList.remove('hide');
                }
            }
        },
        interPeopleDetail: function(people,item){
            noClick($("li"));
            var person={
                realname:people.realname,
                username:people.userCode,
                sex:people.sex,
                email:people.email,
                mobilePhone:people.mobilePhone,
                departname:item.name,
                userSign:'',
                hashead:people.hashead,
                headurl:people.headurl,
                headbgclass:getHeadClass(people.id),
                userNameShort:people.realname.substr(-2,2)
            }
            appcan.locStorage.setVal('thispeoplefile',  JSON.stringify(person));
            //为了区分是从联系人页进入聊天页的
            appcan.locStorage.setVal("isAddress","true");
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('chat-file-people','../chat/chat-file-people.html',2);
            }else{
                appcan.window.open({
                    name:'chat-file-people',
                    dataType:0,
                    data:'../chat/chat-file-people.html',
                    aniId:aniId,
                    type:1024
                });  
            }
        },
        scrollSet: function(e){
            var that = this,
                box = document.getElementsByClassName('myli-box'),
                top = document.getElementsByClassName('address-list')[0].scrollTop,
                fas = document.querySelectorAll('.address-index-box span');
            
            for(var b=0; b<box.length; b++){
                if((box[b].offsetTop-20<top && box[b].offsetTop+parseFloat(getComputedStyle(box[b], null).height)-20>=top) || (b==0 && top<0)){
                    that.indexElement = b;
                    break;
                }
            }
        }
    },
    watch: {
        people: function(){
            this.$nextTick(function(){
                this.scrollSet();
            });
        }
    }
});

function notScrolls(ev){
    ev.preventDefault();
}

var contacts = appcan.locStorage.getVal('contacts');
//以下是'掌汇白云-小白'的userCode
//以下是通讯录测试数据地址
//serverPath = 'http://58.63.114.227:8080/';

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {});
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        appcan.window.subscribe('loadAddressData', function(msg){
            loadAddressData();
        });
        //环信连接上了，判断联系人是否已经加载完毕数据，如果没有加载，则重新获取数据
        appcan.window.subscribe("connected", function(data) {
            if(vm.people.length==0){
               loadAddressData(); 
            }
        });
        $('#nav-right').on('click', function(){
            //appcan.window.open('address-at', 'address-at.html', 0);
        });
        var isLogin = appcan.locStorage.getVal("isLogin");
        if(isDefine(isLogin)&&isLogin=="true"){
            //if(!isDefine(contacts)){
                var json = {
                    path: serverPath+'contact.do?focgetAllContacts',
                    data: {},
                    layer:false
                };
                ajaxRequest(json,function(data,e){
                    //console.log(data);
                    if(e=="success"){
                        contactsHandle(data.obj);
                        vm.nonet=false;
                    }else{
                        vm.nonet=true;
                    }
                });
            //}else{
                //contactsHandle(JSON.parse(contacts));
            //}
        }
        
        /*
        if(!isDefine(contacts)){    
            appcan.request.ajax({
                url : serverPath + 'contacts!getOrgAndUsersList',
                data : {
                    "rootId": "86D553A1-1D73-4203-989C-12624E43D431"
                    // "rootId": appcan.locStorage.getVal('rootID')
                },
                type : 'post',
                dataType : 'application/json',
                timeout : 180000, //瓒呮椂鏃堕棿锛屽崟浣嶄负姣
                success : function(obj, status, xhr) {
                    // console.log(eval("(" + obj + ")"));
                    var datas = eval("(" + obj + ")");
                    
                    layerRemove(zz);
                    
                    //瀛樺偍鑱旂郴浜鸿嚦鏈湴
                    appcan.locStorage.setVal('contacts', obj);
                    contactsHandle(datas);
                },
                error : function(xhr, errorType, error, msg) {
                    layerRemove(zz);
                    layerToast('鏁版嵁鏈夎锛岃绋嶅悗閲嶈瘯銆�, 2);
                }
            });
        }else{
            contactsHandle(JSON.parse(contacts));
        }*/
        appcan.window.subscribe('address-yes-click', function(msg){
            yesClick($("li"));
        });
    });
    
})($);

function getChildrenIndex(ele){
    var i = 0;
    while(ele = ele.previousElementSibling){
        i++;
    }
    return i;
}

function contactsHandle(data){
    var ucode = appcan.locStorage.getVal("userCode");
    vm.peopleIndex.splice(0, vm.peopleIndex.length);
    
    for(var x=0; x<data.length; x++){
        //处理公司数据
        data[x].text = data[x].shortname;
        data[x].textShort = data[x].shortname;
        for(var y=0; y<data[x].jsonStr.length; y++){
            //处理人员数据
            var thisPeople = data[x].jsonStr[y];
            //删去用户自己那条数据
            if(thisPeople.userCode == ucode){
                data[x].jsonStr.splice(y, 1);
                y--;
                continue;
            }
            
            //人名搜索的字符串处理
            thisPeople.userName = thisPeople.realname.trim();
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
            // console.log(pyDuo);
            // console.log(pySuo);
            
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
                thisPeople.headurl = serverPath+thisPeople.head_image;
            }
            
        }
        vm.peopleIndex.push(data[x].textShort);
    }
    appcan.locStorage.setVal('contacts', data);
    appcan.locStorage.setVal('contactsIndex', JSON.stringify(vm.peopleIndex));
    vm.people = JSON.parse(JSON.stringify(data));
    
    //initIScroll();
}

function initIScroll() {
    ms = new IScroll('#wrapper', { mouseWheel: true, click: true });
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
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

/*获取联系人数据*/
function loadAddressData(){
    var json = {
        path: serverPath+'contact.do?focgetAllContacts',
        data: {},
        layer:false
    };
    ajaxRequest(json,function(data,e){
        if(e=="success"){
            contactsHandle(data.obj);
        }
    });
}
