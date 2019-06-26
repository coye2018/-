var vm = new Vue({
    el: '#duty_report_add',
    data: {
        title: '',
        content: [
            {
                img: '',
                text: '',
                order:0
            }
        ],
        dutytext:[
            {
                img: '',
                text: '',
                order:0
            }
        ],
        dutyPerson:[],
        nonet:false,
        dutyDay:timeStemp(new Date(), 'yyyy-MM-dd').date
    },
    methods: {
        addBlock: function(idx){
            //添加版块
            this.content.splice(idx, 0, {img: '', text: ''});
            autosize(document.querySelector('textarea'));
        },
        deleteBlock: function(idx){
            //删除版块
            var ctn = this.content;
            if(ctn.length==1){
                layerToast('简报至少要有一个版块，不可全部删除。', 3);
                return false;
            }else{
                ctn.splice(idx, 1);
            }
        },
        setBlockTextHeight: function(){
            var tar = event.currentTarget;
            autosize(tar);
            
        },
        addBlockImg: function(item,index){
            //添加版块的图片
            var json={
                min:1,
                max:1,
                quality:0.5,
                detailedInfo:true
            };
            //打开相册，返回文件路径
            uexImage.openPicker(json, function(error,data){
                if(error == 0){
                      var arr = new Array();
                      arr.push(data.data[0]);
                      var json1={
                            serverUrl:serverPath+'focCommonController.do?focupload&uploadPath=duty',
                            filePath:arr,
                            quality:3
                      };//上传文件，返回服务器路径
                      appcan.plugInUploaderMgr.upload(json1,function(idx){
                            if(idx.status == 1){
                                Vue.set(vm.content[index],"img",serverPath+idx.responseString);
                                Vue.set(vm.content[index],"imgURL",idx.responseString);
                            }else if(e.status==2){
                                
                            }else{
                                
                                //$("#img_"+1).html(idx.percent+"%");
                            }
                      });
                }
            });
       },
        handin: function(){
            if(vm.title.trim()==''){
                layerToast('简报标题不能为空。');
                return false;
            }
            for(var a=0; a<vm.content.length; a++){
                if(vm.content[a].text==''){
                    layerToast('某个版块未输入文字。');
                    
                    //定位到未输入文字的版块, 并闪烁提示
                    var block_notext = document.querySelectorAll('.dra-edit-block')[a];
                    document.body.scrollTop = block_notext.offsetTop;
                    block_notext.classList.add('flash');
                    setTimeout(function(){
                        block_notext.classList.remove('flash');
                    }, 1200);
                    
                    //直接跳出该函数, 不往下执行
                    return false;
                }else{
                    Vue.set(vm.content[a],"text",vm.content[a].text);
                    if(!vm.content[a].hasOwnProperty("imgURL")){
                        Vue.set(vm.content[a],"imgURL","");
                    }else{
                        Vue.set(vm.dutytext[a],"imgURL",vm.content[a].imgURL);
                    }
                    Vue.set(vm.content[a],"order",a);
                }
            }
            vm.dutytext=vm.content;
            for(var i=0; i<vm.dutytext.length; i++){
                Vue.set(vm.dutytext[i],"text",vm.dutytext[i].text);
            }
            var a={
                        title:escape(vm.title),
                        contentList:vm.dutytext
                };
            var json={
                path:serverPath+"focBriefingController.do?focAddDutyReport",
                data:{
                    data:JSON.stringify(a)
                }
            };
            console.log(vm.content);
            
            var rootID=appcan.locStorage.getVal("rootID");
            if(rootID=="8a8a8bfc59977acf0159978d29db0002"){
               var  isDutyAccount=appcan.locStorage.getVal("isDutyAccount");
               if(isDutyAccount!="1"){
                   layerToast("您的帐号无权提交值班简报。");
                   return false;
               }
            }
            //alert(JSON.stringify(json.data.data));
            //提交简报
            addConfirm({
                content: '确定提交该简报吗？',
                yes: function(i){
                    layerRemove(i);
                    
                    ajaxRequest(json,function(data,e){
                        //alert(JSON.stringify(data));
                        console.log(data);
                        //var index = layerLoading();
                        if(e=="success"){
                            layerToast('提交成功');
                            appcan.window.publish("relaodDutyDetailData","relaodDutyDetailData");
                            appcan.window.evaluateScript({
                                name:'duty-report-add',
                                scriptContent:'appcan.window.close(-1);'
                            });
                        } 
                    });
                },
            });
        }
    }
});

(function($) {
       
    appcan.ready(function() {
        
        loadDutyPerson();
        
        //标题的默认值
        var deptname = appcan.locStorage.getVal('deptName');
        if(!isDefine(deptname)){
            deptname = '';
        }
        vm.title = timeStemp(new Date(), 'yyyy-MM-dd').date + deptname + '值班简报';
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        appcan.window.subscribe('duty-report-add-submit', function () {
            vm.handin();    
        });        
        
    });
    
})($);
function loadDutyPerson(){
    var day=Math.round(new Date().getTime()/1000);
    var json={
        path:serverPath+'schedule.do?focgetDutyPerson',
        data:{
            time:day
        },
        layer:false,
        layerErr:false
    };
    ajaxRequest(json,function(data,e){
       if(e=="success"){
           console.log(data);
           vm.nonet=false;
           vm.dutyPerson=data.obj;
       }else{
           vm.nonet=true;
           $('.shade').addClass('shade-hide');
       } 
    });
}

function closeedit () {
    appcan.window.publish('duty-report-add', 'show');
    addConfirm({
        content: '确定退出本次编辑吗？',
        shadeClose:true,
        yes: function(i){
            
        appcan.window.evaluateScript({
                    name:'duty-report-add',
                    scriptContent:'appcan.window.close(-1);'
                });
        },
        no:function(i){
            appcan.window.publish('duty-report-add', 'hide');
        }
    }); 
}