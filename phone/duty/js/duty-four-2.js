var isCanEdit, //是否可编辑
    aniId = 0,
    platForm = appcan.locStorage.getVal('platForm'), //安卓为1 iOS为0
    dutyDeptId = appcan.locStorage.getVal('dutyDeptId'), //四个必部门id
    dutyDeptTime = appcan.locStorage.getVal('dutyDeptTime'); //四个必的日期

var vm = new Vue({
    el: '#duty_four',
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);
       appcan.locStorage.setVal('isAddress', 'true');
    },
    data: {
        changeTime: '', //换班时间点, 如8
        dutyDate: '', //值班时间, 时间
        dutyCode: '', //值班账号
        isSubmit: false, //是否已经提交四必
        dutyPerson: [], //值班人员
        specialInfo: null, //特殊情况反馈
        mustPersonQuestion: [], //必见人的必问问题
        mustTimePlace: [], //必到时间地点
        imgArrPlace: [], //以下3个是放图片的数组, 都是二维数组, 点大图用
        imgArrQues: [],
        imgArrSpec: []
    },
    methods: {
        personInfo: function(people) {
            //点击值班人头像进入信息页
            var contacts = JSON.parse(appcan.locStorage.getVal('contacts'));
            var person = null;
            for(var x=0; x<contacts.length; x++){
                for(var y=0; y<contacts[x].jsonStr.length; y++){
                    var _val = contacts[x].jsonStr[y];
                    if(_val.userCode == people.userCode){
                        var person = {
                            realname: people.userName,
                            username: people.userCode,
                            sex: _val.sex,
                            email: _val.email,
                            mobilePhone: _val.mobilePhone,
                            departname: contacts[x].name,
                            userSign: '',
                            hashead: people.hashead,
                            headurl: people.headurl,
                            headbgclass: people.headbgclass,
                            userNameShort: people.headtext
                        };
                    }
                }
            }
            
            appcan.locStorage.setVal('thispeoplefile', JSON.stringify(person));
            if(platForm=="1"){
                appcan.window.open('chat-file-people', '../chat/chat-file-people.html', 2);
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
        duty4place: function (val, idx) {
            //必到时间地点
            appcan.locStorage.setVal('duty-four-2-place', JSON.stringify(val));
            appcan.locStorage.setVal('duty-four-2-place-index', idx);
            if(platForm=="1"){
                appcan.window.open('duty-four-2-place', 'duty-four-2-place.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-2-place',
                    dataType:0,
                    data:'duty-four-2-place.html',
                    aniId:aniId,
                    type:1024
                });
            }
        },
        duty4question: function (val, key) {
            //必见人必问问题
            appcan.locStorage.setVal('duty-four-2-question', JSON.stringify(val));
            appcan.locStorage.setVal('duty-four-2-question-index', key);
            if(platForm=="1"){
                appcan.window.open('duty-four-2-question', 'duty-four-2-question.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-2-question',
                    dataType:0,
                    data:'duty-four-2-question.html',
                    aniId:aniId,
                    type:1024
                });
            }
        },
        duty4special: function () {
            //特殊情况反馈(选填)
            var that = this;
            appcan.locStorage.setVal('duty-four-2-special', JSON.stringify(that.specialInfo));
            if(platForm=="1"){
                appcan.window.open('duty-four-2-special', 'duty-four-2-special.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-2-special',
                    dataType:0,
                    data:'duty-four-2-special.html',
                    aniId:aniId,
                    type:1024
                });
            }
        },
        jiaoban: function () {
            //点击交班
            var that = this;
            
            //判断是否值班账号
            var rootID = appcan.locStorage.getVal('rootID');
            if(rootID == '8a8a8bfc59977acf0159978d29db0002'){
               var isDutyAccount = appcan.locStorage.getVal("isDutyAccount");
               if(isDutyAccount!='1'){
                   layerToast('您的帐号无权执行四必。');
                   return false;
               }
            }
            
            //判断是否全部执行
            var confirmCont = '', //弹出框提示语
                stillToDo = false, //是否有没巡查的
                whatToDo = -1, //没巡查的哪一项, 1是必到地点, 2是必见人
                indexToDo = -1, //第i-1条数据是没巡查的
                dataToDo = null; //没巡查项对应的数据
            for(var t=0; t<vm.mustTimePlace.length; t++){
                var todoPlace = vm.mustTimePlace[t];
                if(todoPlace.status == 'todo'){
                    confirmCont = '您有巡查项未巡查，确定要提交吗？';
                    stillToDo = true;
                    whatToDo = 1;
                    indexToDo = t;
                    dataToDo = todoPlace;
                    break;
                }
            }
            if(!stillToDo){
                //巡查项都已巡查, 判断是否有未见的必见人
                for(var t=0; t<vm.mustPersonQuestion.length; t++){
                    var todoQues = vm.mustPersonQuestion[t];
                    if(todoQues.status == 'todo'){
                        confirmCont = '您有必见人未见，确定要提交吗？';
                        stillToDo = true;
                        whatToDo = 2;
                        indexToDo = t;
                        dataToDo = todoQues;
                        break;
                    }
                }
            }
            
            if(stillToDo){
                //如果有未巡查的
                addConfirm({
                    content: confirmCont,
                    btn: ['确定', '查看未巡查项'],
                    yes: function (i) {
                        submitMust();
                        layerRemove(i);
                    },
                    no: function (i) {
                        that.jumptoAbnormal(dataToDo, indexToDo, whatToDo);
                        layerRemove(i);
                    }
                });
            }else{
                //巡查完毕, 提示是否提交
                submitMust();
            }
            
        },
        jumptoAbnormal: function (json, i, flag) {
            //跳转到未完成巡查的页面
            var that = this;
            
            if(flag==1){
                that.duty4place(json, i);
            }else if(flag==2){
                that.duty4question(json, i);
            }
        },
        openImg: function (ev, key) {
            var that = this,
                jqThis = $(ev.currentTarget),
                index = jqThis.index(),
                gallery = jqThis.parents('.list4-pic-box').data('gallery'),
                imgArray = [];
            
            var dataGallery = {
                displayActionButton: true,
                displayNavArrows: true,
                enableGrid: true,
                //startOnGrid: true,
                startIndex: index,
                data: that['imgArr'+gallery][key]
            };
            
            uexImage.openBrowser(dataGallery, function(){});
        }
    }
});

Vue.use(VueLazyload);

//完成巡查
function submitMust () {
    var submitJson = {
        path: serverPath + 'focFourMustController.do?focSubmitMust',
        data: {
            dutyDate: dutyDeptTime
        }
    };
    ajaxRequest(submitJson, function(data,e) {
        if(e=='success'){
            beforeClosePage();
            appcan.window.close(1);
        }else{
            layerToast('提交出错，请稍后重试。');
        }
    });
}

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        beforeClosePage();
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act", function() {
        //Android
        if(platForm=="1"){
            appcan.window.open('duty-four-notice', 'duty-four-notice.html', 2);
        }else{
            appcan.window.open({
                name:'duty-four-notice',
                dataType:0,
                data:'duty-four-notice.html',
                aniId:aniId,
                type:1024
            });
        }
    });

    appcan.ready(function() {
        //加载当天四必数据
        getDutyFourData();
        
        //必到时间地点, 往回更新视图数据
        appcan.window.subscribe('duty-four-2-place', function(data){
            getDutyFourData();
        });
        //必见人和问题, 往回更新视图数据
        appcan.window.subscribe('duty-four-2-question', function(data){
            getDutyFourData();
        });
        //特殊情况反馈, 往回更新视图数据
        appcan.window.subscribe('duty-four-2-special', function(data){
            getDutyFourData();
        });
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                beforeClosePage();
                appcan.window.close(1);
            }
        };
        var isSupport = platForm=='1'? false : true;
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            beforeClosePage();
            appcan.window.close(1); 
        }
    });
})($);

//获取四必执行情况
function getDutyFourData () {
    var dfJson = {
        path: serverPath + 'focFourMustController.do?focGetOrgMustInfo',
        data: {
            dutyDate: dutyDeptTime,
            orgID: dutyDeptId
        },
        layer: true
    };
    ajaxRequest(dfJson, function(data, e){
        if(e=='success'){
            console.log(JSON.stringify(data.obj));
            handleDutyFourData(data.obj);
        }else{
            layerToast('获取四个必执行情况出错，请稍后重试。');
        }
    });
}

//渲染四必数据
function handleDutyFourData (obj) {
    var changeTime = vm.changeTime = obj.changeTime;
    vm.dutyDate = timeStemp(Number(obj.dutyDate), 'yyyy-MM-dd').date;
    vm.dutyCode = obj.dutyCode;
    vm.isSubmit = obj.isSubmit;
    vm.dutyPerson = [].concat(obj.dutyPerson);
    vm.specialInfo = obj.specialInfo;
    vm.mustPersonQuestion = [].concat(obj.mustPersonQuestion);
    vm.mustTimePlace = [].concat(obj.mustTimePlace);
    
    //处理值班人信息
    appcan.locStorage.setVal('isSubmit', vm.isSubmit);
    vm.dutyPerson.forEach(function(cur, idx){
        //设置背景色、头像文字
        Vue.set(cur, 'headbgclass', getHeadClass(cur.userid));
        Vue.set(cur, 'headtext', cur.userName.substr(-2, 2));
        
        //给头像设好url
        if(!isDefine(cur.head_image)){
            Vue.set(cur, 'hashead', false);
        }else{
            Vue.set(cur, 'hashead', true);
            Vue.set(cur, 'headurl', serverPath + cur.head_image);
        }
    });
    
    //处理必到时间地点
    var placeYes = 0,
        placeNot = 0,
        deadline = new Date(vm.dutyDate.replace(/-/g, '/')).valueOf()/1000+60*60*(24+Number(changeTime));
    if(vm.imgArrPlace.length>0){
        vm.imgArrPlace.splice(0, vm.imgArrPlace.length);
    }
    vm.mustTimePlace.forEach(function(cur, idx){
        //时间只截取到分钟
        cur.startTime = cur.startTime.substring(0, cur.startTime.length-3);
        cur.endTime = cur.endTime.substring(0, cur.endTime.length-3);
        if(cur.mustTimePlaceData){
            var mtpd = cur.mustTimePlaceData;
            placeYes++;
            
            vm.imgArrPlace[idx] = [];
            for(var ma=1; ma<=3; ma++){
                if(mtpd['check_image'+ma]){
                    mtpd['check_image'+ma] = serverPath+mtpd['check_image'+ma];
                    vm.imgArrPlace[idx].push(mtpd['check_image'+ma]);
                }
            }
            
            var create_time_place_format = timeStemp(mtpd.create_time, mtpd.create_time<=deadline?'HH:mm':'MM-dd HH:mm').date,
                create_time_place_detail = timeStemp(mtpd.create_time, 'MM-dd HH:mm').date;
            Vue.set(mtpd, 'create_time_format', create_time_place_format);
            Vue.set(mtpd, 'create_time_detail', create_time_place_detail);
            
            var startTNum = timeToNum(cur.startTime, changeTime),
                createTNum = timeToNum(mtpd.create_time_format, changeTime),
                endTNum = timeToNum(cur.endTime, changeTime);
            
            //判断是否在指定时间段内
            if(!(startTNum<=createTNum && createTNum<=endTNum) || deadline<mtpd.create_time){
                Vue.set(cur, 'status', 'abnormal');
            }else{
                Vue.set(cur, 'status', 'normal');
            }
        }else{
            Vue.set(cur, 'status', 'todo');
            placeNot++;
        }
    });
    $('.prog-place').prog({
        total: vm.mustTimePlace.length,
        normal: placeYes,
        textstyle: 'percent'
    });
    
    //处理必见人必问问题
    var quesYes = 0,
        quesNot = 0;
    if(vm.imgArrQues.length>0){
        vm.imgArrQues.splice(0, vm.imgArrQues.length);
    }
    vm.mustPersonQuestion.forEach(function(cur, idx){
        if(cur.mustPersonQuestionDate){
            var mtqd = cur.mustPersonQuestionDate;
            quesYes++;
            
            vm.imgArrQues[idx] = [];
            for(var mb=1; mb<=3; mb++){
                if(mtqd['check_image'+mb]){
                    mtqd['check_image'+mb] = serverPath+mtqd['check_image'+mb];
                    vm.imgArrQues[idx].push(mtqd['check_image'+mb]);
                }
            }
            
            var create_time_question_detail = timeStemp(mtqd.create_time, 'MM-dd HH:mm').date;
            Vue.set(mtqd, 'create_time_detail', create_time_question_detail);
            
            Vue.set(cur, 'status', 'normal');
        }else{
            quesNot++;
            Vue.set(cur, 'status', 'todo');
        }
    });
    $('.prog-people').prog({
        total: vm.mustPersonQuestion.length,
        normal: quesYes,
        textstyle: 'percent'
    });
    
    //处理特殊情况反馈
    var vmsi = vm.specialInfo;
    if(vm.imgArrSpec.length>0){
        vm.imgArrSpec.splice(0, vm.imgArrSpec.length);
    }
    
    vm.imgArrSpec[0] = [];
    for(var mc=1; mc<=3; mc++){
        if(vmsi && vmsi['image'+mc]){
            vmsi['image'+mc] = serverPath+vmsi['image'+mc];
            vm.imgArrSpec[0].push(vmsi['image'+mc]);
        }
    }
    
}

/**
 * 时间转数字
 * @param {time} 时间, 格式为08:00:00
 * @param {start} 交班时间, 用以区分是否跨自然天
 */
function timeToNum (time, start) {
    var timeArr = time.toString().split(':'),
        timeNum = 0;
    
    for(var ta=0; ta<timeArr.length; ta++){
        timeArr[ta] = Number(timeArr[ta]);
        if(ta==0 && start && timeArr[ta]<Number(start)){
            timeNum += 86400;
        }
        if(timeArr[ta]!=0){
            timeNum = timeNum + timeArr[ta]*Math.pow(60, 2-ta);
        }
    }
    
    return timeNum;
}

//关闭页面前的操作, 如清除缓存等
function beforeClosePage () {
    appcan.locStorage.remove('duty-four-2-place');
    appcan.locStorage.remove('duty-four-2-place-index');
    appcan.locStorage.remove('duty-four-2-question');
    appcan.locStorage.remove('duty-four-2-question-index');
    appcan.locStorage.remove('duty-four-2-special');
    appcan.locStorage.remove('isSubmit');
    appcan.window.publish('reloadDuty', 'reloadDuty');
}
