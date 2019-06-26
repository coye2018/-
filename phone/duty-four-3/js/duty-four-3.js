var isCanEdit, //是否可编辑
    aniId = 10,
    platForm = appcan.locStorage.getVal('platForm'), //安卓为1 iOS为0
    dutyDeptId, //四个必部门id
    dutyDeptTime = appcan.locStorage.getVal('duty-four-summary-dutyDay'); //四个必的日期

var vm = new Vue({
    el: '#duty_four',
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);
       appcan.locStorage.setVal('isAddress', 'true');
    },
    data: {
        dutyId: '',//當天四個必值班的id
        changeTime: '', //换班时间点, 如8
        dutyDate: '', //值班时间, 时间
        dutyCode: '', //值班账号
        isSubmit: false, //是否已经提交四必
        dutyPerson: [], //值班人员
        specialInfo: null, //特殊情况反馈
        specialDeptId: '',
        mustPersonQuestion: [], //必见人的必问问题
        mustTimePlace: [], //必到时间地点
        imgArrPlace: [], //以下3个是放图片的数组, 都是二维数组, 点大图用
        imgArrQues: [],
        imgArrSpec: [],
        imgStringSpec: '',
        normalProgColor:'bg-main',
        dutyAccount:{}
    },
    methods: {
        personInfo: function(people) {
            //点击值班人头像进入信息页
            var contacts = JSON.parse(appcan.locStorage.getVal('contacts'));
            var person = null;
            for(var x=0; x<contacts.length; x++){
                for(var y=0; y<contacts[x].jsonStr.length; y++){
                    var _val = contacts[x].jsonStr[y];
                    if(_val.id == people.dutyUserId){
                        console.log(JSON.stringify(_val));
                        var person = {
                            realname: _val.userName,
                            username: _val.userCode,
                            sex: _val.sex,
                            email: _val.email,
                            mobilePhone: _val.mobilePhone,
                            departname: contacts[x].name,
                            userSign: '',
                            hashead: _val.hashead,
                            headurl: _val.headurl,
                            headbgclass: people.headbgclass,
                            userNameShort: _val.headtext
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
                    type:0
                });  
            }
        },
        duty4place: function (val, idx) {
            //必到时间地点
            appcan.locStorage.setVal('duty-four-3-place', JSON.stringify(val));
            if(platForm=="1"){
                appcan.window.open('duty-four-3-place', 'duty-four-3-place.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-3-place',
                    dataType:0,
                    data:'duty-four-3-place.html',
                    aniId:aniId,
                    type:0
                });
            }
        },
        duty4question: function (val, key) {
            //必见人必问问题
            console.log(val)
            appcan.locStorage.setVal('duty-four-3-question', val);
            if(platForm=="1"){
                appcan.window.open('duty-four-3-question', 'duty-four-3-question.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-3-question',
                    dataType:0,
                    data:'duty-four-3-question.html',
                    aniId:aniId,
                    type:0
                });
            }
        },
        duty4special: function () {
            //特殊情况反馈(选填)
            var that = this;
            console.log(that.specialDeptId)
            appcan.locStorage.setVal('duty-four-3-special', that.specialInfo);
            appcan.locStorage.setVal('duty-four-3-special-id', that.specialDeptId);
            appcan.locStorage.setVal('duty-four-3-special-pic', that.imgStringSpec);
            if(platForm=="1"){
                appcan.window.open('duty-four-3-special', 'duty-four-3-special.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-3-special',
                    dataType:0,
                    data:'duty-four-3-special.html',
                    aniId:aniId,
                    type:0
                });
            }
        },
        // jiaoban: function () {
            // //点击交班
            // var that = this;
            // //判断是否值班账号
            // var rootID = appcan.locStorage.getVal('rootID');
            // if(rootID == '8a8a8bfc59977acf0159978d29db0002'){
               // var isDutyAccount = appcan.locStorage.getVal("isDutyAccount");
               // if(isDutyAccount!='1'){
                   // layerToast('您的帐号无权执行四必。');
                   // return false;
               // }
            // }
            // //判断是否全部执行
            // var confirmCont = '', //弹出框提示语
                // stillToDo = false, //是否有没巡查的
                // whatToDo = -1, //没巡查的哪一项, 1是必到地点, 2是必见人
                // indexToDo = -1, //第i-1条数据是没巡查的
                // dataToDo = null; //没巡查项对应的数据
            // // for(var t=0; t<vm.mustTimePlace.length; t++){
                // // var todoPlace = vm.mustTimePlace[t];
                // // if(todoPlace.status == 'todo'){
                    // // confirmCont = '您有巡查项未巡查，确定要提交吗？';
                    // // stillToDo = true;
                    // // whatToDo = 1;
                    // // indexToDo = t;
                    // // dataToDo = todoPlace;
                    // // break;
                // // }
            // // }
            // if(!stillToDo){
                // //巡查项都已巡查, 判断是否有未见的必见人
                // for(var t=0; t<vm.mustPersonQuestion.length; t++){
                    // var todoQues = vm.mustPersonQuestion[t];
                    // if(todoQues.status == 'todo'){
                        // confirmCont = '您有必见人未见，确定要提交吗？';
                        // stillToDo = true;
                        // whatToDo = 2;
                        // indexToDo = t;
                        // dataToDo = todoQues;
                        // break;
                    // }
                // }
            // }
//             
            // if(stillToDo){
                // //如果有未巡查的
                // addConfirm({
                    // content: confirmCont,
                    // btn: ['确定', '查看未巡查项'],
                    // yes: function (i) {
                        // submitMust();
                        // layerRemove(i);
                    // },
                    // no: function (i) {
                        // that.jumptoAbnormal(dataToDo, indexToDo, whatToDo);
                        // layerRemove(i);
                    // }
                // });
            // }else{
                // //巡查完毕, 提示是否提交
                // addConfirm({
                    // content: '确定交班吗？',
                    // yes: function(i){
                        // submitMust();
                        // layerRemove(i);
                    // },
                    // no: function (i) {
                        // layerRemove(i);
                    // }
                // });
            // }
//             
        // },
        // jumptoAbnormal: function (json, i, flag) {
            // //跳转到未完成巡查的页面
            // var that = this;
//             
            // if(flag==1){
                // that.duty4place(json, i);
            // }else if(flag==2){
                // that.duty4question(json, i);
            // }
        // },
        // openImg: function (ev, key) {
            // var that = this,
                // jqThis = $(ev.currentTarget),
                // index = jqThis.index(),
                // gallery = jqThis.parents('.list4-pic-box').data('gallery'),
                // imgArray = [];
//             
            // var dataGallery = {
                // displayActionButton: true,
                // displayNavArrows: true,
                // enableGrid: true,
                // //startOnGrid: true,
                // startIndex: index,
                // data: that['imgArr'+gallery][key]
            // };
//             
            // uexImage.openBrowser(dataGallery, function(){});
        // }
    }
});

Vue.use(VueLazyload);

//完成巡查
// function submitMust () {
    // var submitJson = {
        // path: serverPath + 'focTrackInfoController.do?focAppUpdateInfoType',
        // data: {
            // id:vm.dutyId
        // }
    // };
    // console.log(submitJson);
    // ajaxRequest(submitJson, function(data,e) {
        // console.log(data)
        // if(e=='success'){
            // beforeClosePage();
            // appcan.window.close(13);
        // }else{
            // layerToast('提交出错，请稍后重试。');
        // }
    // });
// }

(function($) {
    appcan.button("#nav-left", "btn-act", function() {
        beforeClosePage();
        appcan.window.close(13);
    });
    appcan.button("#nav-ins", "btn-act", function() {
        //Android
        if(platForm=="1"){
            appcan.window.open('duty-four-notice', 'duty-four-notice.html', 2);
        }else{
            appcan.window.open({
                name:'duty-four-notice',
                dataType:0,
                data:'duty-four-notice.html',
                aniId:aniId,
                type:0
            });
        }
    });
    
    appcan.button('#nav-track', 'btn-act', function() {
        var dutyDaySec = new Date(vm.dutyDate.replace(/\-/g, '/')).getTime()/1000;
        var dutyCode=vm.dutyAccount.majorUserUserName;
        var dutyQueryParams = {
            'queryUsercode': dutyCode,
            'queryUserName': vm.dutyPerson[0].realname,
            'queryStartTime': parseInt(dutyDaySec) + parseInt(vm.changeTime)*60*60                            
        };
        console.log(dutyQueryParams);
        appcan.locStorage.setVal('dutyQueryParams', JSON.stringify(dutyQueryParams));
        
        if (platForm == '1') {
            appcan.window.open('duty-four-track', '../duty/duty-four-track.html', 2);
        } else {
            appcan.window.open({
                name: 'duty-four-track',
                dataType: 0,
                data: '../duty/duty-four-track.html',
                aniId: aniId,
                type: 0
            });
        }
    })

    appcan.ready(function() {
        //加载当天四必数据
        getDutyFourData();
        //必到时间地点, 往回更新视图数据
        appcan.window.subscribe('duty-four-3-place', function(data){
            getDutyFourData();
        });
        //必见人和问题, 往回更新视图数据
        appcan.window.subscribe('duty-four-3-question', function(data){
            getDutyFourData();
        });
        //特殊情况反馈, 往回更新视图数据
        appcan.window.subscribe('duty-four-3-special', function(data){
            getDutyFourData();
        });
        
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                beforeClosePage();
                appcan.window.close(13);
            }
        };
        // var isSupport = (platForm!='1');
        // var paramClose = {
            // isSupport: isSupport
        // };
        // uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        // uexWindow.onSwipeRight = function(){
            // beforeClosePage();
            // appcan.window.close(13); 
        // }
    });
})($);
var analysisChart = echarts.init(document.getElementById('analysischart'));
//获取四必执行情况
function getDutyFourData () {
    dutyDeptId = appcan.locStorage.getVal('dutyDeptId');
    //console.log(dutyDeptTime,dutyDeptId)
    var dfJson = {
        path: serverPath + 'focTrackInfoController.do?focAppDoAdd',
        data: {
            deptID: dutyDeptId,
            time: dutyDeptTime,
            inlet:1
        }
        //layer: true
    };
    console.log(dfJson);
    // createAnalysisChart('analysischart', "");
    ajaxRequest(dfJson, function(data, e){
        if(e=='success'){
            console.log(data);
            handleDutyFourData(data.attributes);
            
        }else{
            //var obj = {"attributes":{"focTrackInfo":{"id":"8a0790e867531a210167531b6ef80000","departmentId":"8a8a8bfc59977acf01599790be75000e","createUserid":"8a8a8bfa5dcf1734015dcf21e1e30014","trackPerson":null,"trackPersonReply":null,"trackIssue":null,"dutyId":null,"trackPersonPic":null,"trackPersonType":0,"trackIssueReply":null,"trackIssuePic":null,"trackIssueType":0,"specialCaseFeedback":null,"specialCaseFeedbackReply":null,"specialCaseFeedbackPic":null,"createTime":1543287566000},"departaskList":[{"taskid":"1","score":"0.603556","task_end_time":"09:30:00","task_start_time":"08:00:00","task_area":"ITC运维坐席、一楼AOC大厅、ITC机房"},{"taskid":"2","score":"0.603556","task_end_time":"14:30:00","task_start_time":"13:00:00","task_area":"ITC运维坐席、一楼AOC大厅、ITC机房"},{"taskid":"3","score":"0.904148","task_end_time":"22:00:00","task_start_time":"19:00:00","task_area":"T1、T2航站楼，根据现场故障处理情况和工程施工情况进行跟进、巡查。"},{"taskid":"4","score":"0.600205","task_end_time":"02:00:00","task_start_time":"00:00:00","task_area":"ITC运维坐席、一楼AOC大厅、ITC机房、T1运维监控室"}],"scheduleList":[{"id":19942,"departId":"8a8a8bfc59977acf01599790be75000e","companyId":"8a8a8bfc59977acf0159978d29db0002","realname":"张志坚","dutyTime":1543248000000,"detailId":"31","rule_type":1,"dutyUserId":"8a8a6c575fd899df0160064ac3680897"},{"id":19943,"departId":"8a8a8bfc59977acf01599790be75000e","companyId":"8a8a8bfc59977acf0159978d29db0002","realname":"张庆","dutyTime":1543248000000,"detailId":"32","rule_type":1,"dutyUserId":"8a8a8bfa5e360fb3015e361bcb54000e"}],"personIssue":{"id":"6","departmentId":"8a8a8bfc59977acf01599790be75000e","departmentName":"信息公司","issue":"\"（1）前一天遗留故障处理情况；\n（2）当日高空、强电作业及重点工程施工计划；\n（3）ITC机房运行情况\"\r\n\"（1）远程巡检机房状态\n（2）远程巡检航显设备状态\n（3）远程巡检wifi的AP在线状态\n（4）远程巡检摄像机在线数量\n（5）台帐填写情况\"\r\n\"（1）故障处理情况，流程执行情况；\n（2）当日高空、强电作业及重点工程施工，是否按相关流程执行；\n（3）一线员工工作状态、劳保用品配置及工作诉求；\n（4）有无需要与外单位协调事宜；\n（5）有无发现需本单位或外单位整改的问题。\"\r\n\"（1）当天故障处理情况，有无遗留故障；\n（2）当日安全、运行、服务总体情况；\n（3）当日股份公司值班领导要求整改事项落实情况；\n（4）当日高空、强电作业及重点工程施工情况；\n（5）当日第三方服务响应情况及存在问题；\n（6）一线员工工作状态、劳保用品配置及工作诉求。\"\r\n","person":"副班、ITC运维人员、客服人员\r\n副班、ITC运维人员\r\nT1、T2分队长、分队队员\r\n副班、ITC运维人员、客服人员\r\n","remark":"需收集整理至少三条本单位和三条外单位需整改的问题，填写在相应表格中，并在早上发送值班报告时一并发送至股份值班微信群。"}},"success":true,"jsonStr":"{\"attributes\":{\"focTrackInfo\":{\"createTime\":1543287566000,\"createUserid\":\"8a8a8bfa5dcf1734015dcf21e1e30014\",\"departmentId\":\"8a8a8bfc59977acf01599790be75000e\",\"id\":\"8a0790e867531a210167531b6ef80000\",\"trackIssueType\":0,\"trackPersonType\":0},\"departaskList\":[{\"score\":\"0.603556\",\"task_area\":\"ITC运维坐席、一楼AOC大厅、ITC机房\",\"task_end_time\":\"09:30:00\",\"task_start_time\":\"08:00:00\",\"taskid\":\"1\"},{\"score\":\"0.603556\",\"task_area\":\"ITC运维坐席、一楼AOC大厅、ITC机房\",\"task_end_time\":\"14:30:00\",\"task_start_time\":\"13:00:00\",\"taskid\":\"2\"},{\"score\":\"0.904148\",\"task_area\":\"T1、T2航站楼，根据现场故障处理情况和工程施工情况进行跟进、巡查。\",\"task_end_time\":\"22:00:00\",\"task_start_time\":\"19:00:00\",\"taskid\":\"3\"},{\"score\":\"0.600205\",\"task_area\":\"ITC运维坐席、一楼AOC大厅、ITC机房、T1运维监控室\",\"task_end_time\":\"02:00:00\",\"task_start_time\":\"00:00:00\",\"taskid\":\"4\"}],\"scheduleList\":[{\"companyId\":\"8a8a8bfc59977acf0159978d29db0002\",\"departId\":\"8a8a8bfc59977acf01599790be75000e\",\"detailId\":\"31\",\"dutyTime\":1543248000000,\"dutyUserId\":\"8a8a6c575fd899df0160064ac3680897\",\"id\":19942,\"realname\":\"张志坚\",\"rule_type\":1},{\"companyId\":\"8a8a8bfc59977acf0159978d29db0002\",\"departId\":\"8a8a8bfc59977acf01599790be75000e\",\"detailId\":\"32\",\"dutyTime\":1543248000000,\"dutyUserId\":\"8a8a8bfa5e360fb3015e361bcb54000e\",\"id\":19943,\"realname\":\"张庆\",\"rule_type\":1}],\"personIssue\":{\"departmentId\":\"8a8a8bfc59977acf01599790be75000e\",\"departmentName\":\"信息公司\",\"id\":\"6\",\"issue\":\"\\\"（1）前一天遗留故障处理情况；\\n（2）当日高空、强电作业及重点工程施工计划；\\n（3）ITC机房运行情况\\\"\\r\\n\\\"（1）远程巡检机房状态\\n（2）远程巡检航显设备状态\\n（3）远程巡检wifi的AP在线状态\\n（4）远程巡检摄像机在线数量\\n（5）台帐填写情况\\\"\\r\\n\\\"（1）故障处理情况，流程执行情况；\\n（2）当日高空、强电作业及重点工程施工，是否按相关流程执行；\\n（3）一线员工工作状态、劳保用品配置及工作诉求；\\n（4）有无需要与外单位协调事宜；\\n（5）有无发现需本单位或外单位整改的问题。\\\"\\r\\n\\\"（1）当天故障处理情况，有无遗留故障；\\n（2）当日安全、运行、服务总体情况；\\n（3）当日股份公司值班领导要求整改事项落实情况；\\n（4）当日高空、强电作业及重点工程施工情况；\\n（5）当日第三方服务响应情况及存在问题；\\n（6）一线员工工作状态、劳保用品配置及工作诉求。\\\"\\r\\n\",\"person\":\"副班、ITC运维人员、客服人员\\r\\n副班、ITC运维人员\\r\\nT1、T2分队长、分队队员\\r\\n副班、ITC运维人员、客服人员\\r\\n\",\"remark\":\"需收集整理至少三条本单位和三条外单位需整改的问题，填写在相应表格中，并在早上发送值班报告时一并发送至股份值班微信群。\"}},\"msg\":\"操作成功\",\"success\":true}","obj":null,"msg":"操作成功"};
            //handleDutyFourData(obj);
            layerToast('获取四个必执行情况出错，请稍后重试。');
        }
    });
}

//渲染四必数据
function handleDutyFourData (obj) {
    var changeTime = vm.changeTime = obj.changeTime;
    var currentTime = timeStemp(new Date().getTime(),'yyyy-MM-dd HH:mm:ss').date;
    vm.dutyId = obj.focTrackInfo.id;
    vm.dutyDate = timeStemp(new Date(Date.parse(dutyDeptTime.replace(/-/g,  "/"))), 'yyyy-MM-dd').date;
    vm.dutyCode = obj.userName;
    vm.dutyAccount = obj.dutyAccount;
    var summaryIsSubmit = appcan.locStorage.getVal('summaryIsSubmit');
    if(isDefine(summaryIsSubmit)){
        vm.isSubmit = true;
    }else{
        vm.isSubmit = obj.focTrackInfo.infoType==1?true:false;
    }
    vm.normalProgColor=obj.focTrackInfo.infoType==1?'bg-main':'bg-sub';
    vm.dutyPerson = [].concat(obj.scheduleList);
    if(isDefine(obj.focTrackInfo.specialCaseFeedbackReply)){
        vm.specialInfo = unescape(obj.focTrackInfo.specialCaseFeedbackReply);
    }
    vm.specialDeptId = obj.focTrackInfo.id;
    vm.imgStringSpec = obj.focTrackInfo.specialCaseFeedbackPic;
    vm.mustPersonQuestion = [].concat(obj.personIssue);
    vm.mustTimePlace = [].concat(obj.departaskList);
    //处理值班人信息
    appcan.locStorage.setVal('isSubmit', vm.isSubmit);
    vm.dutyPerson.forEach(function(cur, idx){
        //设置背景色、头像文字
        Vue.set(cur, 'headbgclass', getHeadClass(cur.dutyUserId));
        Vue.set(cur, 'headtext', cur.realname.substr(-2, 2));
        
        //给头像设好url
        if(!isDefine(cur.head_image)){
            Vue.set(cur, 'hashead', false);
        }else{
            Vue.set(cur, 'hashead', true);
            Vue.set(cur, 'headurl', serverPath + cur.head_image);
        }
        if(cur.detailId == "31"){
            Vue.set(cur, 'shiftname', "正班");
        }else if(cur.detailId == "32"){
            Vue.set(cur, 'shiftname', "副班");
        }
    });
//****************加载停留时间分析图表**********************
    if(obj.TrackResultFourarea.length!=0){
        var chartData = obj.TrackResultFourarea;
        // console.log(chartData)
        createAnalysisChart('analysischart', chartData);
    }else{
        var chartData = [];
        for(var i = 0; i < 4; i++){
            var score = {
                score:0
            }
            chartData.push(score);
        }
        createAnalysisChart('analysischart', chartData);
    }
//******************************************    
    //处理必到时间地点
    var placeYes = obj.trackResult.avgScore*100,
        placeNot = 0,
        deadline = new Date(vm.dutyDate.replace(/-/g, '/')).valueOf()/1000+60*60*(24+Number(changeTime));
    if(vm.imgArrPlace.length>0){
        vm.imgArrPlace.splice(0, vm.imgArrPlace.length);
    }
    vm.mustTimePlace.forEach(function(cur, idx){
        //时间只截取到分钟
        var startTimeToJudgeStatus = vm.dutyDate + ' ' + cur.task_start_time;
        //var endTimeToJudgeStatus = vm.dutyDate + ' ' + cur.task_end_time;
        if(cur.task_start_time == '00:00:00'){
            var startTimeToJudgeStatus = timeStemp((new Date(vm.dutyDate).getTime()+86400000), 'yyyy-MM-dd').date + ' ' + cur.task_start_time;
        }
        // if(cur.task_end_time == '02:00:00'){
            // var endTimeToJudgeStatus = timeStemp((new Date(vm.dutyDate).getTime()+86400000), 'yyyy-MM-dd').date + ' ' + cur.task_start_time;
        // }
        if(startTimeToJudgeStatus > currentTime){
            Vue.set(cur, 'status', 'todo');
        }else if(startTimeToJudgeStatus < currentTime){
            Vue.set(cur, 'status', 'normal');
        }
        console.log(cur.status)
        cur.task_start_time = cur.task_start_time.substring(0, 5);
        cur.task_end_time = cur.task_end_time.substring(0, 5);
        
        // if(cur.mustTimePlaceData){
            // var mtpd = cur.mustTimePlaceData;
            // placeYes++;
//             
            // vm.imgArrPlace[idx] = [];
            // for(var ma=1; ma<=3; ma++){
                // if(mtpd['check_image'+ma]){
                    // mtpd['check_image'+ma] = serverPath+mtpd['check_image'+ma];
                    // vm.imgArrPlace[idx].push(mtpd['check_image'+ma]);
                // }
            // }
//             
            // var create_time_place_format = timeStemp(mtpd.create_time, mtpd.create_time<=deadline?'HH:mm':'MM-dd HH:mm').date,
                // create_time_place_detail = timeStemp(mtpd.create_time, 'MM-dd HH:mm').date;
            // Vue.set(mtpd, 'create_time_format', create_time_place_format);
            // Vue.set(mtpd, 'create_time_detail', create_time_place_detail);
//             
            // var startTNum = timeToNum(cur.startTime, changeTime),
                // createTNum = timeToNum(mtpd.create_time_format, changeTime),
                // endTNum = timeToNum(cur.endTime, changeTime);
//             
            // //判断是否在指定时间段内
            // if(!(startTNum<=createTNum && createTNum<=endTNum) || deadline<mtpd.create_time){
                // Vue.set(cur, 'status', 'abnormal');
            // }else{
                // Vue.set(cur, 'status', 'normal');
            // }
        // }else{
            // Vue.set(cur, 'status', 'todo');
            // placeNot++;
        // }
        
        Vue.nextTick(function() {
            $('#pieTimePlace_' + idx).pie({
                status: 1,
                percent: cur.score*100
            })
        })
    });
    
    $('.prog-place').prog({
        total: 100,
        normal: placeYes,
        normalBg: vm.normalProgColor,
        textstyle: 'percent',
        hastext: false
    });

    window.onorientationchange = window.onresize = function () {
        analysisChart.resize();
    };
    //处理必见人必问问题
    var quesYes = 0,
        quesNot = 0,
        quesStatus = 3;
    if(vm.imgArrQues.length>0){
        vm.imgArrQues.splice(0, vm.imgArrQues.length);
    }
    vm.mustPersonQuestion.forEach(function(cur, idx){
        Vue.set(cur, 'questionDeptId', obj.focTrackInfo.id);
        Vue.set(cur, 'mustPersonQuestionData', obj.focTrackInfo.trackPersonReply);
        Vue.set(cur, 'mustPersonQuestionPic', obj.focTrackInfo.trackPersonPic);
        // if(cur.mustPersonQuestionDate){
            // var mtqd = cur.mustPersonQuestionDate;
            // quesYes++;
//             
            // vm.imgArrQues[idx] = [];
            // for(var mb=1; mb<=3; mb++){
                // if(mtqd['check_image'+mb]){
                    // mtqd['check_image'+mb] = serverPath+mtqd['check_image'+mb];
                    // vm.imgArrQues[idx].push(mtqd['check_image'+mb]);
                // }
            // }
//             
            // var create_time_question_detail = timeStemp(mtqd.create_time, 'MM-dd HH:mm').date;
            // Vue.set(mtqd, 'create_time_detail', create_time_question_detail);
//             
            // Vue.set(cur, 'status', 'normal');
        // }else{
            // quesNot++;
            // Vue.set(cur, 'status', 'todo');
        // }
        if(obj.focTrackInfo.trackPersonType == 1){
            quesStatus = 2;
            quesYes = 1;
            Vue.set(cur, 'status', 'normal');
        }else{
            Vue.set(cur, 'status', 'todo');
        }
        
        Vue.nextTick(function() {
            $('#pieQuestion_' + idx).pie({
                status: quesStatus
            })
        })
    });
    // $('.prog-people').prog({
        // total: vm.mustPersonQuestion.length,
        // normal: quesYes,
        // textstyle: 'percent'
    // });
    
    //处理特殊情况反馈
    // var vmsi = vm.specialInfo;
    // if(vm.imgArrSpec.length>0){
        // vm.imgArrSpec.splice(0, vm.imgArrSpec.length);
    // }
//     
    // vm.imgArrSpec[0] = [];
    // for(var mc=1; mc<=3; mc++){
        // if(vmsi && vmsi['image'+mc]){
            // vmsi['image'+mc] = serverPath+vmsi['image'+mc];
            // vm.imgArrSpec[0].push(vmsi['image'+mc]);
        // }
    // }
    
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
    appcan.locStorage.remove('duty-four-3-place');
    appcan.locStorage.remove('duty-four-3-question');
    appcan.locStorage.remove('duty-four-3-special');
    appcan.locStorage.remove('isSubmit');
    appcan.locStorage.remove('summaryIsSubmit');
    appcan.locStorage.remove('dutyQueryParams');
    appcan.window.publish('reloadDuty', 'reloadDuty');
    var summaryDutyDayStemp = appcan.locStorage.getVal('summary-dutyDay-stamp');
    appcan.window.publish('reloadSummary', summaryDutyDayStemp);
}


function createAnalysisChart(eleId, chartsData) {
    var option = {
        color: ['#52A6FF'],
        tooltip : {
            trigger: 'axis',
            axisPointer : {
                type : 'none'
            }
        },
        grid: {
            left: '0',
            right: '0',
            bottom: '3%',
            top: '15%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['航站区', '飞行区', '公共区', '办公区'],
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: '#E1E1E1'
                    }
                },
                axisLabel: { // 坐标轴文本标签
                    textStyle: {
                        fontSize: 12,
                        margin: 10,
                        color: '#333333'
                    }
                }
            }
        ],
        yAxis : [
            {
                type: 'value',
                name: '',
                nameLocation: 'end',
                nameTextStyle:{
                    color:'#AEAEAE',
                    fontSize: 15
                },
                splitLine: {
                    lineStyle: {
                        color: ['#E1E1E1'],
                        type: 'dashed'
                    }
                },
                position: 'right',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    inside: true,
                    padding: [0,0,16,0],
                    formatter: '{value}',
                    textStyle: {
                        color: '#999999',
                        fontSize: 10
                    }
                }
            }
        ],
        series : [
            {
                name:'停留时间(分钟)',
                type:'bar',
                barWidth: '50%',
                data:[Math.ceil(chartsData[0].score), Math.ceil(chartsData[1].score), Math.ceil(chartsData[2].score), Math.ceil(chartsData[3].score)]
                // data:[100,200,333,400]
            }
        ]
    };
    analysisChart.setOption(option,true);
};