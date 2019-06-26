var textRegN = new RegExp("\\n", "g");
var textRegR = new RegExp("\\r", "g");
var vm = new Vue({
    el: '#Page',
    data: {
        title: '',
        content: [
            {
                img: '',
                imgURL: '',
                text: '',
                textTotal: 3500,
                textCount: 3500
            }
        ],
        dutyPerson:[],
        isSenPort: 1,
        nonet:false
    },
    watch: {
       content: function () {
           this.$nextTick(function () {
                autosize.update(document.querySelectorAll('textarea'));
                // 更新板块textarea高度
                var block =  document.querySelectorAll('textarea');
                for (var i=0; i < block.length; i++) {
                  autosize(block[i])
                };      
           })  
       }
    },
    methods: {
        addBlock: function(idx){
            //添加版块
            this.content.splice(idx, 0, {
                img: '',
                imgURL: '',
                text: '',
                textTotal: 3500,
                textCount: 3500
            });
        },
        deleteBlock: function(idx){
            //删除版块
            if(this.content.length==1){
                layerToast('简报至少要有一个版块，不可全部删除。', 3);
                return false;
            }else{
                this.content.splice(idx, 1);
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
        changeText: function (item) {
            // 限制最大字数
            var textTot = item.textTotal;
                
            if (item.text.length > textTot) {
                item.text = item.text.substring(0, textTot);
            };
            item.textCount = (textTot - item.text.length);
        },
        handin: function(){
            
            // 您的帐号无权提交值班简报
            var rootID=appcan.locStorage.getVal("rootID");
            var isDutyAccount=appcan.locStorage.getVal("isDutyAccount");
            if(rootID=="8a8a8bfc59977acf0159978d29db0002" && isDutyAccount != "1"){
               layerToast("您的帐号无权提交值班简报。");
               return false;
            }
            
            // 您已提交过今天简报
            if (vm.isSenPort != 0) {
                layerToast('您已提交过今天简报');
                return;
            }
            
            // 简报标题不能为空 
            if(vm.title.trim() == ''){
                layerToast('简报标题不能为空。');
                return false;
            }
            
            var lists = [];
            // 某个版块未输入文字
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
                };
                
                // 剔除textTotal, textCount属性(用于计算可输入字数)
                // order属性 为索引
                lists.push({
                    img: vm.content[a].img,
                    imgURL: vm.content[a].imgURL,
                    text: vm.content[a].text.replace(textRegN, "<BR>").replace(textRegR, "<BR>"),
                    order: a
                })
            };
            
            
            // 提交
            submitDuty({
                path:serverPath+"focBriefingController.do?focAddDutyReport",
                data:{
                    data:JSON.stringify({
                        title: escape(vm.title),
                        contentList: lists
                    })
                }
            });
            
        }
    }
});


var curDate = new Date(),
    curY    = curDate.getFullYear(),
    curM    = curDate.getMonth()+1,
    curD    = curDate.getDate(),
    curDateText = curY +'年'+ curM +'月'+ curD +'日';

//所在公司名
// var deptname = appcan.locStorage.getVal('deptName');
// if(!isDefine(deptname)){
    // deptname = '';
// }

(function($) {
       
    appcan.ready(function() {
        
        loadDutyPerson();
        
        var dutyTextVal = appcan.locStorage.getVal('dutyTextVal');
        if (isDefine(dutyTextVal)) {
            vm.content = JSON.parse(dutyTextVal);
        };
        
        vm.title = curDateText + '简报';
        appcan.window.publish('duty-report-add-title', vm.title)
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        appcan.window.subscribe('duty-report-add-submit', function () {
            vm.handin();    
        });        
        
    });
    
})($);


//提交简报
function submitDuty (json) {
    
    appcan.window.publish('duty-report-add-shade', 'show');
    addConfirm({
        content: '确定提交该简报吗？',
        yes: function(i){
            layerRemove(i);
            
            ajaxRequest(json,function(data,e){
                
                appcan.window.publish('duty-report-add-shade', 'hide');
                
                if(e=="success"){
                    layerToast('提交成功');
                    
                    // 清空草稿
                    appcan.locStorage.setVal('dutyTextVal', '');
                    appcan.window.publish('duty-report-draft', 'hide');
                    
                    // 跳转至数据列表页面
                    var platForm=appcan.locStorage.getVal("platForm");
                    //Android
                    if(platForm=="1"){
                        appcan.window.open('duty-report1-single-list', 'duty-report1-single-list.html', 2);
                    }else{
                        appcan.window.open({
                            name:'duty-report1-single-list',
                            dataType:0,
                            data:'duty-report1-single-list.html',
                            aniId:0,
                            type:1024
                        });  
                    }
                    
                } 
            });
        },
        no: function () {
            appcan.window.publish('duty-report-add-shade', 'hide');
        }
    });    
};





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
           vm.dutyPerson = data.obj;
           vm.isSenPort = data.obj[0].isSubmitBriefing;
           appcan.window.publish('duty-report-add-submitBtn', 'show');
       }else{
           vm.nonet = true;
           $('.nonetwork').removeClass('hide');
       } 
    });
};

function closeedit () {
    var mark = false;
    for (var i=0; i < vm.content.length; i++) {
        if (vm.content[i].text != "") {
            mark = true;
            break;
        }
    };
    if (mark) {
        appcan.window.publish('duty-report-add-shade', 'show');
        addConfirm({
            content: '是否要保存草稿？',
            shadeClose:false,
            yes: function(i){
                appcan.window.publish('duty-report-add-shade', 'hide');
                appcan.window.publish('duty-report-draft', 'show');
                
                appcan.locStorage.setVal('dutyTextVal', JSON.stringify(vm.content));
                appcan.window.evaluateScript({
                    name:'duty-report1-add',
                    scriptContent:'appcan.window.close(-1);'
                });
            },
            no:function(i){
                appcan.window.publish('duty-report-add-shade', 'hide');
                appcan.window.publish('duty-report-draft', 'hide');
                
                appcan.locStorage.setVal('dutyTextVal', '');
                appcan.window.evaluateScript({
                    name:'duty-report1-add',
                    scriptContent:'appcan.window.close(-1);'
                });
            }
        });
    } else {
        appcan.locStorage.setVal('dutyTextVal', '');
        appcan.window.publish('duty-report-draft', 'hide');
        appcan.window.evaluateScript({
            name:'duty-report1-add',
            scriptContent:'appcan.window.close(-1);'
        });
    } 
};