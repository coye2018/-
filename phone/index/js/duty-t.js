/**
 * Created by qiangxl on 2018/6/1.
 */
appcan.ready(function () {
         
        appcan.window.subscribe("dutyDate",function () {
         


        })
    });
    function af (){
        //alert(111)
           var isOpenDuty= appcan.locStorage.getVal("isOpenDuty");
           var dutyTime = appcan.locStorage.getVal('dutyTime');
           //alert('isOpenDuty:'+isOpenDuty);
           if(!isDefine(isOpenDuty) || isOpenDuty=="0"){
               appcan.locStorage.setVal("isOpenDuty","1");
               uexWindow.confirm({
                   title:"温馨提示",
                   message:'您'+ dutyTime +'的四必执行情况尚未提交，请您及时提交，否则将无法执行今天的四必',
                   buttonLabels:"暂不提交, 查看并提交"
               },function(index) {
                   appcan.locStorage.setVal("isOpenDuty","0");
                   if (index == 1) {
                       var platForm = appcan.locStorage.getVal("platForm");
                       if (platForm == "1") {
                           appcan.window.open('duty-four-3', 'duty-four-3/duty-four-3.html', 2);
                       } else {
                           appcan.window.open({
                               name: 'duty-four-3',
                               dataType: 0,
                               data: 'duty-four-3/duty-four-3.html',
                               type: 1024
                           });
                       }
                   } else {
                       
                   }
               });
           }

    }
    function confirmTimeArea(obj){
        var timeAreaData = obj;
        var isConfirmTimeArea = appcan.locStorage.getVal("isConfirmTimeArea");
        if(!isDefine(isConfirmTimeArea) || isConfirmTimeArea=="0"){
            appcan.locStorage.setVal("isConfirmTimeArea","1");
            var nowDate2 = timeStemp(new Date().getTime(),'yyyy/MM/dd').date;
            var deptId=appcan.locStorage.getVal("deptId"),
                userId = appcan.locStorage.getVal("userID"),
                startTime = timeStemp(new Date(nowDate2+" "+timeAreaData.taskStartTime).getTime(),'HH:mm').date;
                endTime = timeStemp(new Date(nowDate2+" "+timeAreaData.taskEndTime).getTime(),'HH:mm').date;
                timeToSend = startTime+"-"+endTime;
            var json={
                path:serverPath+"focTrackInfoController.do?focTimedTask",
                data:{
                    departId: deptId,
                    userId:userId,
                    num: 1,
                    time:timeToSend,
                    area:timeAreaData.taskArea
                },
                layer: false,
                layerErr: false
            };
            ajaxRequest(json,function(data,e){
                // console.log(e)
                // alert(e)
                //console.log(JSON.stringify(data));
                
            });
            if(timeAreaData.taskArea.length>100){
                timeAreaData.taskArea = timeAreaData.taskArea.substring(0,99);
            }
            console.log(timeToSend)
            uexWindow.confirm({
                title:"温馨提示",
                message:'您在10分钟后有新的四必巡检工作。必到时间：'+ timeToSend +'，必到地点：'+timeAreaData.taskArea,
                buttonLabels:"确定"
            },function(index) {
                if (index == 0) {
                    isConfirmFourTime = false;
                } else {
                   
                }
            });
        }
    }
