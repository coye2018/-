var vm = new Vue({
    el: '#duty_four',
    data: {
        dutyDate: '2017-08-14',
        dutyDay:'',
        dutyCode:'',
        changeTime:'',
        noSpecial:false,
        mustPlace: [
            /*{
                startTime: '06:30',
                endTime: '10:30',
                place: '国际出发、国内出发',
                checkItem: [
                    {id: '123dk344k5',item: '时钟',isCheck: 0},
                    {id: '123dk344k6',item: 'WIFI',isCheck: 0},
                    {id: '123dk344k7',item: '扶手电梯',isCheck: 0},
                    {id: '123dk344k8',item: '照明',isCheck: 0}
                ]
            },{
                startTime: '11:30',
                endTime: '12:30',
                place: 'T1航站楼1楼',
                checkItem: [
                    {id: '123dk344k5',item: '时钟',isCheck: 0},
                    {id: '123dk344k6',item: 'WIFI',isCheck: 0},
                    {id: '123dk344k7',item: '扶手电梯',isCheck: 0}
                ]
            }*/
        ],
        mustPerson: [
            /*{
                id: '123dk344k5',
                person: '本单位正班',
                isSee: 2
            },{
                id: '123dk344k6',
                person: '本单位副班',
                isSee: 1
            },{
                id: '123dk344k7',
                person: '内葛sei',
                isSee: 1
            },{
                id: '123dk344k8',
                person: '你猜',
                isSee: 2
            }*/
        ],
        mustQuestion: [
            /*{
                id: '00001',
                question: '昨天的故障处理、设备运行和及保养情况，重点关注故障遗留情况',
                answerMoban: '我觉得ok',
                answer: ''
            },{
                id: '00002',
                question: '当天故障数量、影响范围，有无被投诉情况发生，是否要兄弟单位协助解决故障',
                answerMoban: '我觉得不行',
                answer: ''
            },{
                id: '00003',
                question: '当天股份巡查涉及信息公司的需整改的问题落实情况',
                answerMoban: '我觉得很普通',
                answer: ''
            },{
                id: '00004',
                question: '昨天故障处理、设备运行和报验个情况，重点关注故障遗留情况',
                answerMoban: '无',
                answer: ''
            }*/
        ],
        dutyPerson:[],
        specialInfo: {},
        isCanEdit:true,
        isMustSeeLength:0,
        isMustSeeNoLength:0,
        isMustQuLength:0,
        isMustQuNoLength:0,
        isMustPlaceLength:0,
        isMustPlaceNoLength:0,
    },
    methods: {
        //当点击必到地点时调用
        seePlace: function(itm, idx){
            //调用后台接口查看用户是否有查看该值班人员的轨迹权限
           /*
           var jsonServer={
                          path:serverPath+"focPositionRightController.do?focGetCanLookUserTF",
                          data:{
                               pid:appcan.locStorage.getVal("userID"),//鏌ョ湅浜�
                               aid:vm.dutyPerson[0].userid//琚煡鐪嬩汉
                          }
                      }*/
           
          // ajaxRequest(jsonServer,function(data,e){
               //console.log(data);
                //if(e=="success"){
                    //obj中返回true时是有权限查看
                    //if(data.obj){
                        var json=itm;
                        json.queryUsercode=vm.dutyCode;
                        json.queryUserName=vm.dutyPerson[0].userName;
                        json.changeTime=vm.changeTime;
                        json.dutyDate=vm.dutyDate;
                        appcan.locStorage.setVal('duty-4-place', JSON.stringify(json));
                        var platForm=appcan.locStorage.getVal("platForm");
                        var aniId=0;
                        //Android
                        if(platForm=="1"){
                             appcan.window.open('duty-four-place', 'duty-four-place.html', 2);
                        }else{
                            appcan.window.open({
                                name:'duty-four-place',
                                dataType:0,
                                data:'duty-four-place.html',
                                aniId:aniId,
                                type:1024
                            });
                        }
                    //}else{
                       // layerToast("对不起，您暂无查看该值班人员的轨迹权限！");
                   // }
                //}else{
                    
                //}
           //}) 
        },
        seeTerm: function(itm, idx){
            appcan.locStorage.setVal('duty-4-term-index', idx);
            appcan.locStorage.setVal('duty-4-term', JSON.stringify(itm));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-four-term', 'duty-four-term.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-term',
                    dataType:0,
                    data:'duty-four-term.html',
                    aniId:aniId,
                    type:1024
                });
            }
            
        },
        //点击轨迹时调用
        track:function(){
           //调用后台接口查看用户是否有查看该值班人员的轨迹权限
           /*
           var json={
                          path:serverPath+"focPositionRightController.do?focGetCanLookUserTF",
                          data:{
                               pid:appcan.locStorage.getVal("userID"),//鏌ョ湅浜�
                               aid:vm.dutyPerson[0].userid//琚煡鐪嬩汉
                          }
                      }*/
           
           //ajaxRequest(json,function(data,e){
               //console.log(data);
                //if(e=="success"){
                    //obj中返回true时是有权限查看
                    //if(data.obj){
                         //值班日期的秒数
                        var dutyDaySec=new Date(vm.dutyDay.replace(/\-/g,"/")).getTime()/1000;
                        var dutyQueryParams={
                            "queryUsercode":vm.dutyCode,
                            "queryUserName":vm.dutyPerson[0].userName,
                            "queryStartTime":parseInt(dutyDaySec)+parseInt(vm.changeTime)*60*60                            
                        };
                        //alert(new Date(dutyQueryParams.queryStartTime*1000).toLocaleString());
                        appcan.locStorage.setVal('dutyQueryParams', JSON.stringify(dutyQueryParams));     
                        //alert(new Date(json.queryStartTime*1000).toLocaleString());
                        console.info("params:"+JSON.stringify(dutyQueryParams));
                        var platForm=appcan.locStorage.getVal("platForm");
                        var aniId=0;
                        //Android
                        if(platForm=="1"){
                            appcan.window.open("duty-four-track","duty-four-track.html",2);
                        }else{
                            appcan.window.open({
                                name:'duty-four-track',
                                dataType:0,
                                data:'duty-four-track.html',
                                aniId:aniId,
                                type:1024
                            });
                        }
                    //}else{
                       // layerToast("您暂无查看该值班人员的轨迹权限！");
                    //}
                /*
                }else{
                                    
                                }*/
                
           //}) 
        },
        refer:function(){
            var rootID=appcan.locStorage.getVal("rootID");
            if(rootID=="8a8a8bfc59977acf0159978d29db0002"){
               var  isDutyAccount=appcan.locStorage.getVal("isDutyAccount");
               if(isDutyAccount!="1"){
                   layerToast("您的帐号无权执行四必。");
                   return false;
               }
            }
            var check=true;
            var index=0;
            var must=0;
            var content="";
            for (var i=0; i < vm.mustPlace.length; i++) {
               for (var j=0; j < vm.mustPlace[i].checkItem.length; j++) {
                    if(vm.mustPlace[i].checkItem[j].isCheck==0){
                        check=false;
                        index=i;
                        must=0;
                        content="您有一个巡查项未巡查，确定要提交吗？";
                        break;
                    }
               };
               if(!check){
                   break;
               } 
            };
            if(check){
                vm.isMustSeeLength=vm.mustPerson.length;
                vm.isMustSeeNoLength=getJsonLen(vm.mustPerson, 'isSee', 1);
                if(vm.isMustSeeLength>vm.isMustSeeNoLength){
                    check=false;
                    must=1;
                    content="您有一个必见人未见，确定要提交吗？";
                }
                if(check){
                    vm.isMustQuLength=vm.mustQuestion.length;
                    vm.isMustQuNoLength=getJsonLen(vm.mustQuestion, 'answer', '', false);
                    if(vm.isMustQuLength>vm.isMustQuNoLength){
                        check=false;
                        must=2;
                        content="您有一个必问问题未回答，确定要提交吗？";
                    }
                }
            }
            if(!check){
                addConfirm({
                    content:content,
                    yes: function(i){
                        layerRemove(i);
                        var json={
                            path:serverPath+"focFourMustController.do?focSubmitMust",
                            data:{
                                dutyDate:vm.dutyDate,
                                content:appcan.locStorage.getVal("dutySpecialContent"),
                                imgURL:appcan.locStorage.getVal("dutySpecialImgSave"),
                                isNormal:1
                            }
                        }
                        ajaxRequest(json,function(data,e){
                            if(e=="success"){
                                layerToast("提交成功！");
                                //这个是特殊情况提交后删除缓存中存储的。
                                appcan.locStorage.remove("dutySpecialContent");
                                appcan.locStorage.remove("dutySpecialImg");
                                appcan.locStorage.remove("dutySpecialImgSave");
                                appcan.window.publish("reloadDuty","reloadDuty");
                                appcan.window.close(1);
                            }
                        })
                    },
                    no:function(i){
                        layerRemove(i);
                        if(must==0){
                            appcan.locStorage.setVal('duty-4-term-index', index);
                            appcan.locStorage.setVal('duty-4-term', JSON.stringify(vm.mustPlace[index]));
                            var platForm=appcan.locStorage.getVal("platForm");
                            var aniId=0;
                            //Android
                            if(platForm=="1"){
                                appcan.window.open('duty-four-term', 'duty-four-term.html', 2);
                            }else{
                                appcan.window.open({
                                    name:'duty-four-term',
                                    dataType:0,
                                    data:'duty-four-term.html',
                                    aniId:aniId,
                                    type:1024
                                });
                            }
                        }else if(must==1){
                            appcan.locStorage.setVal('duty-4-person', JSON.stringify(vm.mustPerson));
                            var platForm=appcan.locStorage.getVal("platForm");
                            var aniId=0;
                            //Android
                            if(platForm=="1"){
                                appcan.window.open('duty-four-people', 'duty-four-people.html', 2);
                            }else{
                                appcan.window.open({
                                    name:'duty-four-people',
                                    dataType:0,
                                    data:'duty-four-people.html',
                                    aniId:aniId,
                                    type:1024
                                });
                            }
                            
                        }else{
                            appcan.locStorage.setVal('duty-4-question', JSON.stringify(vm.mustQuestion));
                            var platForm=appcan.locStorage.getVal("platForm");
                            var aniId=0;
                            //Android
                            if(platForm=="1"){
                                appcan.window.open("duty-four-question","duty-four-question.html",2);
                            }else{
                                appcan.window.open({
                                    name:'duty-four-question',
                                    dataType:0,
                                    data:'duty-four-question.html',
                                    aniId:aniId,
                                    type:1024
                                });
                            }
                        }
                        
                        
                    }
                });
            }else{
                var json={
                            path:serverPath+"focFourMustController.do?focSubmitMust",
                            data:{
                                dutyDate:vm.dutyDate,
                                content:appcan.locStorage.getVal("dutySpecialContent"),
                                imgURL:appcan.locStorage.getVal("dutySpecialImgSave"),
                                isNormal:1
                            }
                        }
                ajaxRequest(json,function(data,e){
                    if(e=="success"){
                        layerToast("提交成功！");
                        //这个是特殊情况提交后删除缓存中存储的。
                        appcan.locStorage.remove("dutySpecialContent");
                        appcan.locStorage.remove("dutySpecialImg");
                        appcan.locStorage.remove("dutySpecialImgSave");
                        appcan.window.publish("reloadDuty","reloadDuty");
                        appcan.window.close(1);
                    }
                })
            }
             
            
            
            
            
           
        },
        openImg:function(item){
            var imgArray=new Array();
                 imgArray.push(item);
            var data ={
                    displayActionButton:true,
                    displayNavArrows:true,
                    enableGrid:true,
                    //startOnGrid:true,
                    startIndex:0,
                    data:imgArray
            }
            uexImage.openBrowser(data,function(){
            });  
        }
        
    }
});
//是否可编辑
var isCanEdit;
(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.locStorage.remove('duty-4-place');
        appcan.locStorage.remove('duty-4-term');
        appcan.locStorage.remove('duty-4-term-index');
        appcan.locStorage.remove('duty-4-person');
        appcan.locStorage.remove('duty-4-question');
        appcan.locStorage.remove('duty-4-special');
        appcan.window.publish("reloadDuty","reloadDuty");
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
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
        loadDutyFourData();
        appcan.window.subscribe('duty-four-question', function(msg){
            var d4qs = JSON.parse(msg);
            
            vm.mustQuestion = [].concat(d4qs);
            vm.isMustQuLength=vm.mustQuestion.length;
            vm.isMustQuNoLength=getJsonLen(vm.mustQuestion, 'answer', '', false);
            $('.prog-question').prog({
                total: vm.mustQuestion.length,
                normal: getJsonLen(vm.mustQuestion, 'answer', '', false)
            });
        });
        
        appcan.window.subscribe('duty-four-person', function(msg){
            var d4ps = JSON.parse(msg);
            
            
            vm.mustPerson = [].concat(d4ps);
            vm.isMustSeeLength=vm.mustPerson.length;
            vm.isMustSeeNoLength=getJsonLen(vm.mustPerson, 'isSee', 1);
            $('.prog-people').prog({
                total: vm.mustPerson.length,
                normal: getJsonLen(vm.mustPerson, 'isSee', 1)
            });
        });
        
        appcan.window.subscribe('duty-four-term', function(msg){
            var d4tm = JSON.parse(msg),
                d4tmIdx = appcan.locStorage.getVal('duty-4-term-index');
            Vue.set(vm.mustPlace[d4tmIdx], 'checkItem', d4tm);
            //console.log(vm.mustPlace[d4tmIdx].checkItem[0].isCheck);
            var norLen = getJsonLen(vm.mustPlace[d4tmIdx].checkItem, 'isCheck', 1),
                abnLen = getJsonLen(vm.mustPlace[d4tmIdx].checkItem, 'isCheck', 2);
            Vue.set(vm.mustPlace[d4tmIdx], 'normalLength', norLen);
            Vue.set(vm.mustPlace[d4tmIdx], 'abnormalLength', abnLen);
            $('.prog-term-'+d4tmIdx).prog({
                total: vm.mustPlace[d4tmIdx].checkItem.length,
                normal: getJsonLen(vm.mustPlace[d4tmIdx].checkItem, 'isCheck', 1),
                abnormal: getJsonLen(vm.mustPlace[d4tmIdx].checkItem, 'isCheck', 2)
            });
            uexWindow.setReportKey(0, 1);
            uexWindow.onKeyPressed = function(keyCode) {
                if (keyCode == 0) {
                    appcan.window.publish("reloadDuty","reloadDuty");
                    appcan.window.close(1);
                }
            };
        });
        
        appcan.window.subscribe('duty-four-special', function(msg){
            var d4sp = JSON.parse(msg);
            
            vm.specialInfo = $.extend({}, d4sp);
        });
        
        var scrollbox= $.scrollbox($("body")).on("releaseToReload",
            function() { //After Release or call reload function,we reset the bounce
                $("#ScrollContent").trigger("reload", this);
            }).on("onReloading",
            function(a) { //如果onReloading状态，拖动将触发该事件
            }).on("dragToReload",
            function() {
                
            }).on("draging",
            function(status) { //on draging, this event will be triggered.
            }).on("release",
            function() {
                //on draging, this event will be triggered.
            }).on("scrollbottom",
            function() { 
                //在滚动的底部，这个事件将被触发。你应该从服务器获取数据
                $("#ScrollContent").trigger("more", this);
                scrollbox.reset();
            });
        isCanEdit=appcan.locStorage.getVal("isCanEdit");    
        if(isCanEdit=="true"){
            vm.isCanEdit=true;
        }else{
            vm.isCanEdit=false;
        }
       
        //必见人
        $('.du4').on('click', '#people', function(){
            appcan.locStorage.setVal('duty-4-person', JSON.stringify(vm.mustPerson));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('duty-four-people', 'duty-four-people.html', 2);
            }else{
                appcan.window.open({
                    name:'duty-four-people',
                    dataType:0,
                    data:'duty-four-people.html',
                    aniId:aniId,
                    type:1024
                });
            }
            
        });
        
        
        //必问问题
        $('.du4').on('click', '#question', function(){
            appcan.locStorage.setVal('duty-4-question', JSON.stringify(vm.mustQuestion));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("duty-four-question","duty-four-question.html",2);
            }else{
                appcan.window.open({
                    name:'duty-four-question',
                    dataType:0,
                    data:'duty-four-question.html',
                    aniId:aniId,
                    type:1024
                });
            }
        });
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                appcan.window.publish("reloadDuty","reloadDuty");
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
            appcan.locStorage.remove('duty-4-place');
            appcan.locStorage.remove('duty-4-term');
            appcan.locStorage.remove('duty-4-term-index');
            appcan.locStorage.remove('duty-4-person');
            appcan.locStorage.remove('duty-4-question');
            appcan.locStorage.remove('duty-4-special');
            appcan.window.publish("reloadDuty","reloadDuty");
            appcan.window.close(1); 
        }
        //解锁四必页使其能够点击，这样做是为了防止ios 版本打开两个相同的页面
        appcan.window.publish("duty-four-click","duty-four-click");
       
        
        
    });
    
})($);
 //必问问题
$('.du4').on('click', '#special', function(){
    if(vm.isCanEdit){
        appcan.locStorage.setVal('duty-4-special', JSON.stringify(vm.specialInfo));
        var platForm=appcan.locStorage.getVal("platForm");
        var aniId=0;
        //Android
        if(platForm=="1"){
            appcan.window.open('duty-four-special', 'duty-four-special.html', 2);
        }else{
            appcan.window.open({
                name:'duty-four-special',
                dataType:0,
                data:'duty-four-special.html',
                aniId:aniId,
                type:1024
            });
        }
        
    }
    
});
function getJsonLen(jsonArr, key, val, flag){
    flag = isDefine(flag)?flag:true;
    if(!jsonArr instanceof Array || jsonArr.length==0) return false;
    
    var len = 0;
    for(var z=0; z<jsonArr.length; z++){
        if(!jsonArr[z].hasOwnProperty(key)){
            continue;
        }else{
            if(flag){
                if(jsonArr[z][key]==val) len++;
            }else{
                if(jsonArr[z][key]!=val) len++;
            }
        }
    }
    return len;
}

function handleDutyData(){
     for(var h=0; h<vm.mustPlace.length; h++){
            var nor = getJsonLen(vm.mustPlace[h].checkItem, 'isCheck', 1),
                abn = getJsonLen(vm.mustPlace[h].checkItem, 'isCheck', 2);
            
            Vue.set(vm.mustPlace[h], 'normalLength', nor);
            Vue.set(vm.mustPlace[h], 'abnormalLength', abn);
            
            $('.prog-term-'+h).prog({
                total: vm.mustPlace[h].checkItem.length,
                normal: nor,
                abnormal: abn
            });
        }
        $('.prog-people').prog({
            total: vm.mustPerson.length,
            normal: getJsonLen(vm.mustPerson, 'isSee', '1')
        });
        $('.prog-question').prog({
            total: vm.mustQuestion.length,
            normal: getJsonLen(vm.mustQuestion, 'answer', '', false)
        });
}
function handleDateDutyfour(msg){
    var d4qs = msg;
    vm.mustQuestion = [].concat(d4qs);
    vm.isMustQuLength=vm.mustQuestion.length;
    vm.isMustQuNoLength=getJsonLen(vm.mustQuestion, 'answer', '', false);
    $('.prog-question').prog({
        total: vm.mustQuestion.length,
        normal: getJsonLen(vm.mustQuestion, 'answer', '', false)
    });
}
