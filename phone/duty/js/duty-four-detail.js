function loadDutyFourData(){
    //四个必部门id
    var dutyDeptId=appcan.locStorage.getVal("dutyDeptId");
    //四个必的日期
    var dutyDeptTime=appcan.locStorage.getVal("dutyDeptTime");
    
    var json={
        path:serverPath+"focFourMustController.do?focGetOrgMustInfo",
        data:{
            dutyDate:dutyDeptTime,
            orgID:dutyDeptId
        }
    };
    ajaxRequest(json,function(data,e){
        //console.log(data);
        if(e=="success"){
            vm.mustPlace=data.obj.mustPlace;
            vm.mustPerson=data.obj.mustPerson;
            vm.dutyPerson=data.obj.dutyPerson;
            vm.dutyDay=timeStemp(Number(data.obj.dutyDate),'yyyy-MM-dd').date;
            vm.dutyDate=data.obj.dutyDate;
            vm.dutyCode=data.obj.dutyCode;
            vm.changeTime=data.obj.changeTime;
            vm.mustQuestion=data.obj.mustQuestion;
            if(!isDefine(data.obj.specialInfo)){
                var dutySpecialContent=appcan.locStorage.getVal("dutySpecialContent");
                var dutySpecialImg=appcan.locStorage.getVal("dutySpecialImg");
                if(!isDefine(dutySpecialContent)){
                     vm.specialInfo.content="";
                }else{
                     vm.specialInfo.content=dutySpecialContent;
                }
                if(!isDefine(dutySpecialImg)){
                     vm.specialInfo.imgURL="";
                }else{
                     vm.specialInfo.imgURL=dutySpecialImg;
                }
                if(vm.specialInfo.content=="" && vm.specialInfo.imgURL==""){
                    vm.noSpecial=true;
                    vm.specialInfo.content="无";
                }
            }else{
                if(!isDefine(data.obj.specialInfo.imgURL)){
                    data.obj.specialInfo.imgURL="";
                }else{
                    data.obj.specialInfo.imgURL=serverPath+data.obj.specialInfo.imgURL;
                }
                if(!isDefine(data.obj.specialInfo.content)){
                    data.obj.specialInfo.content="";
                }
                vm.noSpecial=true;
                vm.specialInfo=data.obj.specialInfo;
            }
            
            Vue.nextTick(function(){
                handleDutyData();
            });
        }
    })
    
    
}
