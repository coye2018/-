var aniId = 10,
    platForm = appcan.locStorage.getVal('platForm'),//安卓为1 iOS为0
    dutyDeptTime = appcan.locStorage.getVal('duty-four-summary-dutyDay'); 

var vm = new Vue({
    el: '#Page',
    data: {
        weekData: ['日','一','二','三','四','五','六'],
        monthDays: [],
        today: new Date().getFullYear()+'年'+(new Date().getMonth()+1)+'月',
        todayFull: '',
        dutyPeople: [],
        //dutyPeopleType: [],
        //dutyPeople:[{"departname":"公司领导","description":"01","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13902261967","departId":"8a8a8bfc59977acf0159978d74e00004","dutyPeoples":[{"id":"19340","username":"dongzhe","mobilePhone":"13902222124","detail_id":"31","userid":"8a8a6c0e63d9c66401644484f00512a3","departId":"8a8a8bfc59977acf0159978d74e00004","realname":"董哲"}],"dutyCode":"13902261967","departImage":"upload/departImages/8a8a8bfc59977acf0159978d74e00004.png"},{"departname":"股份本部","description":"011","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13926484850","departId":"8a8a8bfc59977acf0159978e19120006","dutyPeoples":[{"id":"18860","username":"linkeru","mobilePhone":"13602751586","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce1be1002a","departId":"8a8a8bfc59977acf0159978e19120006","realname":"林可茹"}],"dutyCode":"13926484850","departImage":"upload/departImages/8a8a8bfc59977acf0159978e19120006.png"},{"departname":"运行控制中心","description":"运控","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13902201190","departId":"8a8a8bfc59977acf0159978e51920008","dutyPeoples":[{"id":"18920","username":"wangwei","mobilePhone":"13926009200","detail_id":"31","userid":"8a8a6c575ecc32b1015ed098f2d400d7","departId":"8a8a8bfc59977acf0159978e51920008","realname":"汪伟"}],"dutyCode":"13902201190","departImage":"upload/departImages/8a8a8bfc59977acf0159978e51920008.png"},{"departname":"AOC","description":"AOC","duty_time":"2018-11-21 00:00:00.0","dutyphone":"15800268899","departId":"8a8a8bfc59977acf0159979123450010","dutyPeoples":[{"id":"18980","username":"pengxiaolin","mobilePhone":"13929586208","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccf22c403b8","departId":"8a8a8bfc59977acf0159979123450010","realname":"彭晓琳"}],"dutyCode":"15800268899","departImage":"upload/departImages/8a8a8bfc59977acf0159979123450010.png"},{"departname":"客服中心","description":"客服","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18588796158","departId":"8a8a6c0e63d9c66401641ac6d39e5b90","dutyPeoples":[{"id":"19700","username":"hufang","mobilePhone":"13824459346","detail_id":"31","userid":"8a8a6c0e63d9c66401641acada416559","departId":"8a8a6c0e63d9c66401641ac6d39e5b90","realname":"胡方"}],"dutyCode":"18588796158","departImage":"upload/departImages/8a8a6c0e63d9c66401641ac6d39e5b90.png"},{"departname":"现场巡查督察大队","description":"督察","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18028807542","departId":"8a8a8bfa5e3b68d2015e3b7b4f710015","dutyPeoples":[{"id":"20030","username":"aigang","mobilePhone":"13826136266","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce0e770007","departId":"8a8a8bfa5e3b68d2015e3b7b4f710015","realname":"艾刚"}],"dutyCode":"18028807542","departImage":"upload/departImages/8a8a8bfa5e3b68d2015e3b7b4f710015.png"},{"departname":"飞行区管理部","description":"飞管","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13632266580","departId":"8a8a8bfa5dcee82a015dceecac8a0001","dutyPeoples":[{"id":"19300","username":"liuhao","mobilePhone":"","detail_id":"31","userid":"8a8a6c0e6012b7840160a556e74e4a40","departId":"8a8a8bfa5dcee82a015dceecac8a0001","realname":"刘浩"},{"id":"19301","username":"liudi","mobilePhone":"","detail_id":"32","userid":"8a8a6c0e6012b7840160a55a9f2e4ab9","departId":"8a8a8bfa5dcee82a015dceecac8a0001","realname":"刘狄","departImage":"upload/departImages/8a8a8bfa5dcee82a015dceecac8a0001.png"}],"dutyCode":"13632266580","departImage":"upload/departImages/8a8a8bfa5dcee82a015dceecac8a0001.png"},{"departname":"航站楼管理部","description":"航管","duty_time":"2018-11-21 00:00:00.0","dutyphone":"15013283377","departId":"8a8a8bfc59977acf0159979253900012","dutyPeoples":[{"id":"19630","username":"liuguang","mobilePhone":"13682232502","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccec49d026e","departId":"8a8a8bfc59977acf0159979253900012","realname":"刘广"},{"id":"19631","username":"huangjun","mobilePhone":"13808866092","detail_id":"32","userid":"8a8a8bfa5e4adddc015e4ae10218000d","departId":"8a8a8bfc59977acf0159979253900012","realname":"黄俊","departImage":"upload/departImages/8a8a8bfc59977acf0159979253900012.png"}],"dutyCode":"15013283377","departImage":"upload/departImages/8a8a8bfc59977acf0159979253900012.png"},{"departname":"T2公司","description":"T2","duty_time":"2018-11-21 00:00:00.0","dutyphone":"19925650010","departId":"8a8a6c0e6174a5f801618dd12ef246d2","dutyPeoples":[{"id":"19030","username":"wuran","mobilePhone":"","detail_id":"31","userid":"8a8a6c0e6174a5f80161d4f5c25a4b1c","departId":"8a8a6c0e6174a5f801618dd12ef246d2","realname":"吴然"},{"id":"19031","username":"yinbaoqi","mobilePhone":"18620197061","detail_id":"32","userid":"8a8a8bfa599ccd3e01599cce487b00cf","departId":"8a8a6c0e6174a5f801618dd12ef246d2","realname":"尹宝奇","departImage":"upload/departImages/8a8a6c0e6174a5f801618dd12ef246d2.png"}],"dutyCode":"19925650010","departImage":"upload/departImages/8a8a6c0e6174a5f801618dd12ef246d2.png"},{"departname":"公共区管理分公司","description":"公共","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18988913688","departId":"8a8a8bfc59977acf01599793f8e80014","dutyPeoples":[{"id":"19990","username":"linshanjian","mobilePhone":"13798128002","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccf212903b3","departId":"8a8a8bfc59977acf01599793f8e80014","realname":"林善建"},{"id":"19991","username":"yuweiquan","mobilePhone":"13922786983","detail_id":"32","userid":"8a8a8bfa5e4adddc015e4aee8fc50069","departId":"8a8a8bfc59977acf01599793f8e80014","realname":"庾卫权","departImage":"upload/departImages/8a8a8bfc59977acf01599793f8e80014.png"}],"dutyCode":"18988913688","departImage":"upload/departImages/8a8a8bfc59977acf01599793f8e80014.png"},{"departname":"信息科技公司","description":"信息","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13632102500","departId":"8a8a8bfc59977acf01599790be75000e","dutyPeoples":[{"id":"19930","username":"chenjianhui","mobilePhone":"13902289907","detail_id":"31","userid":"8a8a8bfc59a570800159a5d150d3002c","departId":"8a8a8bfc59977acf01599790be75000e","realname":"陈见辉"},{"id":"19931","username":"shenhanwen","mobilePhone":"13719061937","detail_id":"32","userid":"8a8a6c0e6174a5f801618402c6494b15","departId":"8a8a8bfc59977acf01599790be75000e","realname":"沈汉文","departImage":"upload/departImages/8a8a8bfc59977acf01599790be75000e.png"}],"dutyCode":"13632102500","departImage":"upload/departImages/8a8a8bfc59977acf01599790be75000e.png"},{"departname":"安检护卫部","description":"安检","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13922779303","departId":"8a8a8bfc59977acf0159979431d60016","dutyPeoples":[{"id":"19090","username":"daihongyong","mobilePhone":"13602753399","detail_id":"31","userid":"8a8a6c575fd899df016006669e7208f7","departId":"8a8a8bfc59977acf0159979431d60016","realname":"戴洪勇"},{"id":"19091","username":"ganling","mobilePhone":"13682281483","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bd1a6a4000d","departId":"8a8a8bfc59977acf0159979431d60016","realname":"甘宁","departImage":"upload/departImages/8a8a8bfc59977acf0159979431d60016.png"}],"dutyCode":"13922779303","departImage":"upload/departImages/8a8a8bfc59977acf0159979431d60016.png"},{"departname":"动力保障分公司","description":"动力","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13922436099","departId":"8a8a8bfc59977acf015997945db50018","dutyPeoples":[{"id":"19240","username":"luxuedong","mobilePhone":"13503031729","detail_id":"31","userid":"8a8a8bfa5e4b88f1015e4bdc8c600041","departId":"8a8a8bfc59977acf015997945db50018","realname":"卢学东"},{"id":"19241","username":"lijiping","mobilePhone":"13533707507","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bdcf5170045","departId":"8a8a8bfc59977acf015997945db50018","realname":"李继萍","departImage":"upload/departImages/8a8a8bfc59977acf015997945db50018.png"}],"dutyCode":"13922436099","departImage":"upload/departImages/8a8a8bfc59977acf015997945db50018.png"},{"departname":"消防安保管理中心","description":"消防","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18138721822","departId":"8a8a8bfc59977acf0159979497df001a","dutyPeoples":[{"id":"19870","username":"shenyangzhong","mobilePhone":"18613138119","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccf14d80381","departId":"8a8a8bfc59977acf0159979497df001a","realname":"沈养忠"},{"id":"19871","username":"yaokaixiong","mobilePhone":"13246460063","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4be77e780091","departId":"8a8a8bfc59977acf0159979497df001a","realname":"姚开雄","departImage":"upload/departImages/8a8a8bfc59977acf0159979497df001a.png"}],"dutyCode":"18138721822","departImage":"upload/departImages/8a8a8bfc59977acf0159979497df001a.png"},{"departname":"急救中心","description":"急救","duty_time":"2018-11-21 00:00:00.0","dutyphone":"19926071220","departId":"8a8a6c575e5b49c1015e5f123e0e0001","dutyPeoples":[{"id":"19670","username":"huangdanmin","mobilePhone":"13111111111","detail_id":"31","userid":"8a8a6c0e64a64ae10164d9fe3b152257","departId":"8a8a6c575e5b49c1015e5f123e0e0001","realname":"黄丹敏"}],"dutyCode":"19926071220","departImage":"upload/departImages/8a8a6c575e5b49c1015e5f123e0e0001.png"},{"departname":"航空运输服务分公司","description":"航服","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13822266696","departId":"8a8a8bfc59977acf01599794c687001c","dutyPeoples":[{"id":"19570","username":"wujingping","mobilePhone":"13600052202","detail_id":"31","userid":"8a8a8bfa5e3c6b3b015e3c7489070001","departId":"8a8a8bfc59977acf01599794c687001c","realname":"吴静平"},{"id":"19571","username":"caixiaoying","mobilePhone":"18620878096","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bed232d00c5","departId":"8a8a8bfc59977acf01599794c687001c","realname":"蔡晓颖","departImage":"upload/departImages/8a8a8bfc59977acf01599794c687001c.png"}],"dutyCode":"13822266696","departImage":"upload/departImages/8a8a8bfc59977acf01599794c687001c.png"},{"departname":"航空物流服务分公司","description":"物流","duty_time":"2018-11-21 00:00:00.0","dutyphone":"15814870515","departId":"8a8a8bfc59977acf015997955ed4001e","dutyPeoples":[{"id":"19510","username":"huangruoqi","mobilePhone":"13699703633","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccea9f20205","departId":"8a8a8bfc59977acf015997955ed4001e","realname":"黄若琪"},{"id":"19511","username":"zhangchi","mobilePhone":"18620532934","detail_id":"32","userid":"8a8a6c575f176324015f710f88b80578","departId":"8a8a8bfc59977acf015997955ed4001e","realname":"张弛","departImage":"upload/departImages/8a8a8bfc59977acf015997955ed4001e.png"}],"dutyCode":"15814870515","departImage":"upload/departImages/8a8a8bfc59977acf015997955ed4001e.png"},{"departname":"地勤服务有限公司","description":"地勤","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13825121319","departId":"8a8a8bfc59977acf01599796a6710020","dutyPeoples":[{"id":"19180","username":"yezhenhong","mobilePhone":"13902259556","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce663d0142","departId":"8a8a8bfc59977acf01599796a6710020","realname":"叶振洪"},{"id":"19181","username":"zhangxudong","mobilePhone":"13711433954","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bffb5880149","departId":"8a8a8bfc59977acf01599796a6710020","realname":"张旭升","departImage":"upload/departImages/8a8a8bfc59977acf01599796a6710020.png"}],"dutyCode":"13825121319","departImage":"upload/departImages/8a8a8bfc59977acf01599796a6710020.png"},{"departname":"空港快线运输有限公司","description":"快线","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13380036819","departId":"8a8a8bfc59977acf01599796e6fa0022","dutyPeoples":[{"id":"19750","username":"mengxianman","mobilePhone":"13829721560","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cced59502a5","departId":"8a8a8bfc59977acf01599796e6fa0022","realname":"孟现满"},{"id":"19751","username":"wuqingxiu","mobilePhone":"13312833277","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4c039da10169","departId":"8a8a8bfc59977acf01599796e6fa0022","realname":"吴清洪","departImage":"upload/departImages/8a8a8bfc59977acf01599796e6fa0022.png"}],"dutyCode":"13380036819","departImage":"upload/departImages/8a8a8bfc59977acf01599796e6fa0022.png"},{"departname":"商旅服务有限公司","description":"商旅","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13501532828","departId":"8a8a8bfc59977acf015997998b430028","dutyPeoples":[{"id":"19810","username":"tanfang","mobilePhone":"13802795808","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccebeca0255","departId":"8a8a8bfc59977acf015997998b430028","realname":"谭芳"},{"id":"19811","username":"zhongxiaoqing","mobilePhone":"13728081381","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4c0a077a019d","departId":"8a8a8bfc59977acf015997998b430028","realname":"仲晓青","departImage":"upload/departImages/8a8a8bfc59977acf015997998b430028.png"}],"dutyCode":"13501532828","departImage":"upload/departImages/8a8a8bfc59977acf015997998b430028.png"},{"departname":"汉莎航空食品有限公司","description":"汉莎","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13925012783","departId":"8a8a8bfc59977acf01599799c438002a","dutyPeoples":[{"id":"19450","username":"chenchibang","mobilePhone":"13903065091","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce984501ba","departId":"8a8a8bfc59977acf01599799c438002a","realname":"陈炽邦"},{"id":"19451","username":"lijingnan","mobilePhone":"13678941088","detail_id":"32","userid":"8a8a8bfa599ccd3e01599cce9fc601d8","departId":"8a8a8bfc59977acf01599799c438002a","realname":"李敬南","departImage":"upload/departImages/8a8a8bfc59977acf01599799c438002a.png"}],"dutyCode":"13925012783","departImage":"upload/departImages/8a8a8bfc59977acf01599799c438002a.png"},{"departname":"白云国际广告有限公司","description":"广告","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13570498158","departId":"8a8a8bfc59977acf01599799f51d002c","dutyPeoples":[{"id":"19130","username":"kuangdan","mobilePhone":"","detail_id":"31","userid":"8a8a6c0e626bbc74016305bfaebb3445","departId":"8a8a8bfc59977acf01599799f51d002c","realname":"邝丹"}],"dutyCode":"13570498158","departImage":"upload/departImages/8a8a8bfc59977acf01599799f51d002c.png"},{"departname":"广州市宏利投资有限公司","description":"宏利","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18923092296","departId":"8a8a8bfc59977acf0159979a237b002e","dutyPeoples":[{"id":"19390","username":"huanghua","mobilePhone":"13760695806","detail_id":"31","userid":"8a8a8bfa5e4b88f1015e4c0f929001c9","departId":"8a8a8bfc59977acf0159979a237b002e","realname":"黄华"},{"id":"19391","username":"mahaitao","mobilePhone":"13333333333","detail_id":"32","userid":"8a8a6c0e63d9c664016444826e970c7b","departId":"8a8a8bfc59977acf0159979a237b002e","realname":"马海涛","departImage":"upload/departImages/8a8a8bfc59977acf0159979a237b002e.png"}],"dutyCode":"18923092296","departImage":"upload/departImages/8a8a8bfc59977acf0159979a237b002e.png"}],
        dutyPeopleType: [{"shiftname":"正班","id":31,"scherulerule_id":60,"change_time":"8"},{"shiftname":"副班","id":32,"showorder":1,"scherulerule_id":60,"change_time":"2"}],
        isSlide: false,
        nothing: false,
        nonet: false,
        dutyDetaile:[]
    },
    mounted: function () {
        //ios300ms延时
        FastClick.attach(document.body);
        Vue.use(VueLazyload);
    },
    methods: {
        pick:function(item,index){
            //改变原来选中的状态。
            vm.weekdays[activeIndex].actives=false;
            //把现在点击的dom元素改为选中状态。
            vm.weekdays[index].actives=true;
            //将今天的月份修改为当前月份
            vm.today=vm.weekdays[index].fullYearAndMoth;
            //最后赋值
            activeIndex=index;
            //下面写ajax
            // console.log(vm.weekdays[index].dateTime)
            loadDutyFourDate(vm.weekdays[index].dateTime);
       },
       
       dutyFourForEvery: function (item,index) {
            //必到时间地点
            appcan.locStorage.setVal('dutyDeptId', item.workerid);
            appcan.locStorage.setVal('summaryIsSubmit', 'true');
            dutyDeptTime = appcan.locStorage.getVal('duty-four-summary-dutyDay');
            // console.log(dutyDeptTime)
            var dfJson = {
                path: serverPath + 'focTrackInfoController.do?focAppDoAdd',
                data: {
                    deptID: item.workerid,
                    time: dutyDeptTime,
                    inlet:1
                }
                //layer: true
            };
            ajaxRequest(dfJson, function(data, e){
                if(e=='success'){
                    // console.log(data);
                    if(isDefine(data.attributes.focTrackInfo)){
                        if(platForm=="1"){
                            appcan.window.open('duty-four-3', 'duty-four-3.html', 2);
                        }else{
                            appcan.window.open({
                                name:'duty-four-3',
                                dataType:0,
                                data:'duty-four-3.html',
                                aniId:aniId,
                                type:0
                            });
                        }
                    }else{
                        var nowDate = timeStemp(new Date().getTime(),'yyyy-MM-dd').date;
                        var showDay;
                        if(nowDate == dutyDeptTime){
                            showDay = '今天';
                        }else{
                            showDay = Number(dutyDeptTime.split("-")[1])+"月"+Number(dutyDeptTime.split("-")[2])+"日";
                        }
                        //console.log(showDay+item.description+'尚未开始执行四必巡检，暂无法查看，请稍后再试。');
                        uexWindow.confirm({
                            title:"温馨提醒",
                            message: showDay+item.description+'尚未开始执行四必巡检，暂无法查看，请稍后再试。',
                            buttonLabels:"确定"
                        },function(index) {
                        });
                    }
                }else{
                    //var obj = {"attributes":{"focTrackInfo":{"id":"8a0790e867531a210167531b6ef80000","departmentId":"8a8a8bfc59977acf01599790be75000e","createUserid":"8a8a8bfa5dcf1734015dcf21e1e30014","trackPerson":null,"trackPersonReply":null,"trackIssue":null,"dutyId":null,"trackPersonPic":null,"trackPersonType":0,"trackIssueReply":null,"trackIssuePic":null,"trackIssueType":0,"specialCaseFeedback":null,"specialCaseFeedbackReply":null,"specialCaseFeedbackPic":null,"createTime":1543287566000},"departaskList":[{"taskid":"1","score":"0.603556","task_end_time":"09:30:00","task_start_time":"08:00:00","task_area":"ITC运维坐席、一楼AOC大厅、ITC机房"},{"taskid":"2","score":"0.603556","task_end_time":"14:30:00","task_start_time":"13:00:00","task_area":"ITC运维坐席、一楼AOC大厅、ITC机房"},{"taskid":"3","score":"0.904148","task_end_time":"22:00:00","task_start_time":"19:00:00","task_area":"T1、T2航站楼，根据现场故障处理情况和工程施工情况进行跟进、巡查。"},{"taskid":"4","score":"0.600205","task_end_time":"02:00:00","task_start_time":"00:00:00","task_area":"ITC运维坐席、一楼AOC大厅、ITC机房、T1运维监控室"}],"scheduleList":[{"id":19942,"departId":"8a8a8bfc59977acf01599790be75000e","companyId":"8a8a8bfc59977acf0159978d29db0002","realname":"张志坚","dutyTime":1543248000000,"detailId":"31","rule_type":1,"dutyUserId":"8a8a6c575fd899df0160064ac3680897"},{"id":19943,"departId":"8a8a8bfc59977acf01599790be75000e","companyId":"8a8a8bfc59977acf0159978d29db0002","realname":"张庆","dutyTime":1543248000000,"detailId":"32","rule_type":1,"dutyUserId":"8a8a8bfa5e360fb3015e361bcb54000e"}],"personIssue":{"id":"6","departmentId":"8a8a8bfc59977acf01599790be75000e","departmentName":"信息公司","issue":"\"（1）前一天遗留故障处理情况；\n（2）当日高空、强电作业及重点工程施工计划；\n（3）ITC机房运行情况\"\r\n\"（1）远程巡检机房状态\n（2）远程巡检航显设备状态\n（3）远程巡检wifi的AP在线状态\n（4）远程巡检摄像机在线数量\n（5）台帐填写情况\"\r\n\"（1）故障处理情况，流程执行情况；\n（2）当日高空、强电作业及重点工程施工，是否按相关流程执行；\n（3）一线员工工作状态、劳保用品配置及工作诉求；\n（4）有无需要与外单位协调事宜；\n（5）有无发现需本单位或外单位整改的问题。\"\r\n\"（1）当天故障处理情况，有无遗留故障；\n（2）当日安全、运行、服务总体情况；\n（3）当日股份公司值班领导要求整改事项落实情况；\n（4）当日高空、强电作业及重点工程施工情况；\n（5）当日第三方服务响应情况及存在问题；\n（6）一线员工工作状态、劳保用品配置及工作诉求。\"\r\n","person":"副班、ITC运维人员、客服人员\r\n副班、ITC运维人员\r\nT1、T2分队长、分队队员\r\n副班、ITC运维人员、客服人员\r\n","remark":"需收集整理至少三条本单位和三条外单位需整改的问题，填写在相应表格中，并在早上发送值班报告时一并发送至股份值班微信群。"}},"success":true,"jsonStr":"{\"attributes\":{\"focTrackInfo\":{\"createTime\":1543287566000,\"createUserid\":\"8a8a8bfa5dcf1734015dcf21e1e30014\",\"departmentId\":\"8a8a8bfc59977acf01599790be75000e\",\"id\":\"8a0790e867531a210167531b6ef80000\",\"trackIssueType\":0,\"trackPersonType\":0},\"departaskList\":[{\"score\":\"0.603556\",\"task_area\":\"ITC运维坐席、一楼AOC大厅、ITC机房\",\"task_end_time\":\"09:30:00\",\"task_start_time\":\"08:00:00\",\"taskid\":\"1\"},{\"score\":\"0.603556\",\"task_area\":\"ITC运维坐席、一楼AOC大厅、ITC机房\",\"task_end_time\":\"14:30:00\",\"task_start_time\":\"13:00:00\",\"taskid\":\"2\"},{\"score\":\"0.904148\",\"task_area\":\"T1、T2航站楼，根据现场故障处理情况和工程施工情况进行跟进、巡查。\",\"task_end_time\":\"22:00:00\",\"task_start_time\":\"19:00:00\",\"taskid\":\"3\"},{\"score\":\"0.600205\",\"task_area\":\"ITC运维坐席、一楼AOC大厅、ITC机房、T1运维监控室\",\"task_end_time\":\"02:00:00\",\"task_start_time\":\"00:00:00\",\"taskid\":\"4\"}],\"scheduleList\":[{\"companyId\":\"8a8a8bfc59977acf0159978d29db0002\",\"departId\":\"8a8a8bfc59977acf01599790be75000e\",\"detailId\":\"31\",\"dutyTime\":1543248000000,\"dutyUserId\":\"8a8a6c575fd899df0160064ac3680897\",\"id\":19942,\"realname\":\"张志坚\",\"rule_type\":1},{\"companyId\":\"8a8a8bfc59977acf0159978d29db0002\",\"departId\":\"8a8a8bfc59977acf01599790be75000e\",\"detailId\":\"32\",\"dutyTime\":1543248000000,\"dutyUserId\":\"8a8a8bfa5e360fb3015e361bcb54000e\",\"id\":19943,\"realname\":\"张庆\",\"rule_type\":1}],\"personIssue\":{\"departmentId\":\"8a8a8bfc59977acf01599790be75000e\",\"departmentName\":\"信息公司\",\"id\":\"6\",\"issue\":\"\\\"（1）前一天遗留故障处理情况；\\n（2）当日高空、强电作业及重点工程施工计划；\\n（3）ITC机房运行情况\\\"\\r\\n\\\"（1）远程巡检机房状态\\n（2）远程巡检航显设备状态\\n（3）远程巡检wifi的AP在线状态\\n（4）远程巡检摄像机在线数量\\n（5）台帐填写情况\\\"\\r\\n\\\"（1）故障处理情况，流程执行情况；\\n（2）当日高空、强电作业及重点工程施工，是否按相关流程执行；\\n（3）一线员工工作状态、劳保用品配置及工作诉求；\\n（4）有无需要与外单位协调事宜；\\n（5）有无发现需本单位或外单位整改的问题。\\\"\\r\\n\\\"（1）当天故障处理情况，有无遗留故障；\\n（2）当日安全、运行、服务总体情况；\\n（3）当日股份公司值班领导要求整改事项落实情况；\\n（4）当日高空、强电作业及重点工程施工情况；\\n（5）当日第三方服务响应情况及存在问题；\\n（6）一线员工工作状态、劳保用品配置及工作诉求。\\\"\\r\\n\",\"person\":\"副班、ITC运维人员、客服人员\\r\\n副班、ITC运维人员\\r\\nT1、T2分队长、分队队员\\r\\n副班、ITC运维人员、客服人员\\r\\n\",\"remark\":\"需收集整理至少三条本单位和三条外单位需整改的问题，填写在相应表格中，并在早上发送值班报告时一并发送至股份值班微信群。\"}},\"msg\":\"操作成功\",\"success\":true}","obj":null,"msg":"操作成功"};
                    //handleDutyFourData(obj);
                    layerToast('获取四个必执行情况出错，请稍后重试。');
                }
            });
            
        },
       
   }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(13);
    });
    
    
    appcan.ready(function() {
        
        // vm.weekdays = getLast7Days(0);
        vm.todayFull = timeStemp(new Date().getTime(), 'yyyy-MM-dd').date; //今天的日期
        
        //加载值班数据。
        var today = Math.round(new Date().getTime() / 1000);
        appcan.window.subscribe('reloadSummary', function(dutytimestamp){
            dutytimestamp = Number(dutytimestamp);
            console.log(dutytimestamp)
            loadDutyFourDate(dutytimestamp);
        });
        
        // 禁止ios右滑关闭
        uexWindow.setSwipeCloseEnable(JSON.stringify({
            enable: 0
        }));
        
        
    });
    
})($);


/**
 *  
 * @param {Object} day 值班日期，后台处理某个时间段的值班人
 */
window.ISTIME = false;

function loadDutyFourDate(day){
    
    //console.log('选择的时间:'+ day)
    if(!isDefine(day)){
        day = Math.round(new Date().getTime()/1000);
    }
    
    if (ISTIME) {
        var fixTime = new Date(day * 1000);
        fixTime.setDate(fixTime.getDate());
        day = Date.parse(fixTime) / 1000;
    } 
    
    
    
    var json={
        path: serverPath + 'focTrackInfoController.do?focAppTrackinfoList',
        data:{
            time: timeStemp(day,'yyyy-MM-dd').date
        },
        layer:false,
        layerErr:false
    };
    // console.log(json)
    ajaxRequest(json,function(data,e){
         console.log(data)
        if(e=="success"){
            //有网
            vm.nonet=false;
            vm.nothing=false;
            if(data.obj.length==0){
                //无数据
                vm.nothing=true;
            }
            
            vm.dutyPeople=data.obj;
            vm.dutyDetaile=data.attributes.dutyDetaile;
            Vue.nextTick(function() {
                vm.dutyPeople.forEach(function(n, i, a){
                    Vue.set(n, 'departHead', serverPath + n.backup3);
                        Zepto('#pieDutyFour_' + i).pie({
                            status: 1,
                            percent: n.avgScore*100
                        })
                })
            })
             
        }else{
            //vm.dutyPeople=[{"departname":"公司领导","description":"01","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13902261967","departId":"8a8a8bfc59977acf0159978d74e00004","dutyPeoples":[{"id":"19340","username":"dongzhe","mobilePhone":"13902222124","detail_id":"31","userid":"8a8a6c0e63d9c66401644484f00512a3","departId":"8a8a8bfc59977acf0159978d74e00004","realname":"董哲"}],"dutyCode":"13902261967","departImage":"upload/departImages/8a8a8bfc59977acf0159978d74e00004.png","mustprecent":"60"},{"departname":"股份本部","description":"011","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13926484850","departId":"8a8a8bfc59977acf0159978e19120006","dutyPeoples":[{"id":"18860","username":"linkeru","mobilePhone":"13602751586","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce1be1002a","departId":"8a8a8bfc59977acf0159978e19120006","realname":"林可茹"}],"dutyCode":"13926484850","departImage":"upload/departImages/8a8a8bfc59977acf0159978e19120006.png","mustprecent":"60"},{"departname":"运行控制中心","description":"运控","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13902201190","departId":"8a8a8bfc59977acf0159978e51920008","dutyPeoples":[{"id":"18920","username":"wangwei","mobilePhone":"13926009200","detail_id":"31","userid":"8a8a6c575ecc32b1015ed098f2d400d7","departId":"8a8a8bfc59977acf0159978e51920008","realname":"汪伟"}],"dutyCode":"13902201190","departImage":"upload/departImages/8a8a8bfc59977acf0159978e51920008.png","mustprecent":"60"},{"departname":"AOC","description":"AOC","duty_time":"2018-11-21 00:00:00.0","dutyphone":"15800268899","departId":"8a8a8bfc59977acf0159979123450010","dutyPeoples":[{"id":"18980","username":"pengxiaolin","mobilePhone":"13929586208","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccf22c403b8","departId":"8a8a8bfc59977acf0159979123450010","realname":"彭晓琳"}],"dutyCode":"15800268899","departImage":"upload/departImages/8a8a8bfc59977acf0159979123450010.png","mustprecent":"60"},{"departname":"客服中心","description":"客服","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18588796158","departId":"8a8a6c0e63d9c66401641ac6d39e5b90","dutyPeoples":[{"id":"19700","username":"hufang","mobilePhone":"13824459346","detail_id":"31","userid":"8a8a6c0e63d9c66401641acada416559","departId":"8a8a6c0e63d9c66401641ac6d39e5b90","realname":"胡方"}],"dutyCode":"18588796158","departImage":"upload/departImages/8a8a6c0e63d9c66401641ac6d39e5b90.png","mustprecent":"60"},{"departname":"现场巡查督察大队","description":"督察","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18028807542","departId":"8a8a8bfa5e3b68d2015e3b7b4f710015","dutyPeoples":[{"id":"20030","username":"aigang","mobilePhone":"13826136266","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce0e770007","departId":"8a8a8bfa5e3b68d2015e3b7b4f710015","realname":"艾刚"}],"dutyCode":"18028807542","departImage":"upload/departImages/8a8a8bfa5e3b68d2015e3b7b4f710015.png","mustprecent":"60"},{"departname":"飞行区管理部","description":"飞管","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13632266580","departId":"8a8a8bfa5dcee82a015dceecac8a0001","dutyPeoples":[{"id":"19300","username":"liuhao","mobilePhone":"","detail_id":"31","userid":"8a8a6c0e6012b7840160a556e74e4a40","departId":"8a8a8bfa5dcee82a015dceecac8a0001","realname":"刘浩"},{"id":"19301","username":"liudi","mobilePhone":"","detail_id":"32","userid":"8a8a6c0e6012b7840160a55a9f2e4ab9","departId":"8a8a8bfa5dcee82a015dceecac8a0001","realname":"刘狄","departImage":"upload/departImages/8a8a8bfa5dcee82a015dceecac8a0001.png"}],"dutyCode":"13632266580","departImage":"upload/departImages/8a8a8bfa5dcee82a015dceecac8a0001.png","mustprecent":"60"},{"departname":"航站楼管理部","description":"航管","duty_time":"2018-11-21 00:00:00.0","dutyphone":"15013283377","departId":"8a8a8bfc59977acf0159979253900012","dutyPeoples":[{"id":"19630","username":"liuguang","mobilePhone":"13682232502","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccec49d026e","departId":"8a8a8bfc59977acf0159979253900012","realname":"刘广"},{"id":"19631","username":"huangjun","mobilePhone":"13808866092","detail_id":"32","userid":"8a8a8bfa5e4adddc015e4ae10218000d","departId":"8a8a8bfc59977acf0159979253900012","realname":"黄俊","departImage":"upload/departImages/8a8a8bfc59977acf0159979253900012.png"}],"dutyCode":"15013283377","departImage":"upload/departImages/8a8a8bfc59977acf0159979253900012.png","mustprecent":"60"},{"departname":"T2公司","description":"T2","duty_time":"2018-11-21 00:00:00.0","dutyphone":"19925650010","departId":"8a8a6c0e6174a5f801618dd12ef246d2","dutyPeoples":[{"id":"19030","username":"wuran","mobilePhone":"","detail_id":"31","userid":"8a8a6c0e6174a5f80161d4f5c25a4b1c","departId":"8a8a6c0e6174a5f801618dd12ef246d2","realname":"吴然"},{"id":"19031","username":"yinbaoqi","mobilePhone":"18620197061","detail_id":"32","userid":"8a8a8bfa599ccd3e01599cce487b00cf","departId":"8a8a6c0e6174a5f801618dd12ef246d2","realname":"尹宝奇","departImage":"upload/departImages/8a8a6c0e6174a5f801618dd12ef246d2.png"}],"dutyCode":"19925650010","departImage":"upload/departImages/8a8a6c0e6174a5f801618dd12ef246d2.png","mustprecent":"60"},{"departname":"公共区管理分公司","description":"公共","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18988913688","departId":"8a8a8bfc59977acf01599793f8e80014","dutyPeoples":[{"id":"19990","username":"linshanjian","mobilePhone":"13798128002","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccf212903b3","departId":"8a8a8bfc59977acf01599793f8e80014","realname":"林善建"},{"id":"19991","username":"yuweiquan","mobilePhone":"13922786983","detail_id":"32","userid":"8a8a8bfa5e4adddc015e4aee8fc50069","departId":"8a8a8bfc59977acf01599793f8e80014","realname":"庾卫权","departImage":"upload/departImages/8a8a8bfc59977acf01599793f8e80014.png"}],"dutyCode":"18988913688","departImage":"upload/departImages/8a8a8bfc59977acf01599793f8e80014.png","mustprecent":"60"},{"departname":"信息科技公司","description":"信息","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13632102500","departId":"8a8a8bfc59977acf01599790be75000e","dutyPeoples":[{"id":"19930","username":"chenjianhui","mobilePhone":"13902289907","detail_id":"31","userid":"8a8a8bfc59a570800159a5d150d3002c","departId":"8a8a8bfc59977acf01599790be75000e","realname":"陈见辉"},{"id":"19931","username":"shenhanwen","mobilePhone":"13719061937","detail_id":"32","userid":"8a8a6c0e6174a5f801618402c6494b15","departId":"8a8a8bfc59977acf01599790be75000e","realname":"沈汉文","departImage":"upload/departImages/8a8a8bfc59977acf01599790be75000e.png"}],"dutyCode":"13632102500","departImage":"upload/departImages/8a8a8bfc59977acf01599790be75000e.png","mustprecent":"60"},{"departname":"安检护卫部","description":"安检","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13922779303","departId":"8a8a8bfc59977acf0159979431d60016","dutyPeoples":[{"id":"19090","username":"daihongyong","mobilePhone":"13602753399","detail_id":"31","userid":"8a8a6c575fd899df016006669e7208f7","departId":"8a8a8bfc59977acf0159979431d60016","realname":"戴洪勇"},{"id":"19091","username":"ganling","mobilePhone":"13682281483","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bd1a6a4000d","departId":"8a8a8bfc59977acf0159979431d60016","realname":"甘宁","departImage":"upload/departImages/8a8a8bfc59977acf0159979431d60016.png"}],"dutyCode":"13922779303","departImage":"upload/departImages/8a8a8bfc59977acf0159979431d60016.png","mustprecent":"60"},{"departname":"动力保障分公司","description":"动力","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13922436099","departId":"8a8a8bfc59977acf015997945db50018","dutyPeoples":[{"id":"19240","username":"luxuedong","mobilePhone":"13503031729","detail_id":"31","userid":"8a8a8bfa5e4b88f1015e4bdc8c600041","departId":"8a8a8bfc59977acf015997945db50018","realname":"卢学东"},{"id":"19241","username":"lijiping","mobilePhone":"13533707507","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bdcf5170045","departId":"8a8a8bfc59977acf015997945db50018","realname":"李继萍","departImage":"upload/departImages/8a8a8bfc59977acf015997945db50018.png"}],"dutyCode":"13922436099","departImage":"upload/departImages/8a8a8bfc59977acf015997945db50018.png","mustprecent":"60"},{"departname":"消防安保管理中心","description":"消防","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18138721822","departId":"8a8a8bfc59977acf0159979497df001a","dutyPeoples":[{"id":"19870","username":"shenyangzhong","mobilePhone":"18613138119","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccf14d80381","departId":"8a8a8bfc59977acf0159979497df001a","realname":"沈养忠"},{"id":"19871","username":"yaokaixiong","mobilePhone":"13246460063","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4be77e780091","departId":"8a8a8bfc59977acf0159979497df001a","realname":"姚开雄","departImage":"upload/departImages/8a8a8bfc59977acf0159979497df001a.png"}],"dutyCode":"18138721822","departImage":"upload/departImages/8a8a8bfc59977acf0159979497df001a.png","mustprecent":"60"},{"departname":"急救中心","description":"急救","duty_time":"2018-11-21 00:00:00.0","dutyphone":"19926071220","departId":"8a8a6c575e5b49c1015e5f123e0e0001","dutyPeoples":[{"id":"19670","username":"huangdanmin","mobilePhone":"13111111111","detail_id":"31","userid":"8a8a6c0e64a64ae10164d9fe3b152257","departId":"8a8a6c575e5b49c1015e5f123e0e0001","realname":"黄丹敏"}],"dutyCode":"19926071220","departImage":"upload/departImages/8a8a6c575e5b49c1015e5f123e0e0001.png","mustprecent":"60"},{"departname":"航空运输服务分公司","description":"航服","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13822266696","departId":"8a8a8bfc59977acf01599794c687001c","dutyPeoples":[{"id":"19570","username":"wujingping","mobilePhone":"13600052202","detail_id":"31","userid":"8a8a8bfa5e3c6b3b015e3c7489070001","departId":"8a8a8bfc59977acf01599794c687001c","realname":"吴静平"},{"id":"19571","username":"caixiaoying","mobilePhone":"18620878096","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bed232d00c5","departId":"8a8a8bfc59977acf01599794c687001c","realname":"蔡晓颖","departImage":"upload/departImages/8a8a8bfc59977acf01599794c687001c.png"}],"dutyCode":"13822266696","departImage":"upload/departImages/8a8a8bfc59977acf01599794c687001c.png","mustprecent":"60"},{"departname":"航空物流服务分公司","description":"物流","duty_time":"2018-11-21 00:00:00.0","dutyphone":"15814870515","departId":"8a8a8bfc59977acf015997955ed4001e","dutyPeoples":[{"id":"19510","username":"huangruoqi","mobilePhone":"13699703633","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccea9f20205","departId":"8a8a8bfc59977acf015997955ed4001e","realname":"黄若琪"},{"id":"19511","username":"zhangchi","mobilePhone":"18620532934","detail_id":"32","userid":"8a8a6c575f176324015f710f88b80578","departId":"8a8a8bfc59977acf015997955ed4001e","realname":"张弛","departImage":"upload/departImages/8a8a8bfc59977acf015997955ed4001e.png"}],"dutyCode":"15814870515","departImage":"upload/departImages/8a8a8bfc59977acf015997955ed4001e.png","mustprecent":"60"},{"departname":"地勤服务有限公司","description":"地勤","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13825121319","departId":"8a8a8bfc59977acf01599796a6710020","dutyPeoples":[{"id":"19180","username":"yezhenhong","mobilePhone":"13902259556","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce663d0142","departId":"8a8a8bfc59977acf01599796a6710020","realname":"叶振洪"},{"id":"19181","username":"zhangxudong","mobilePhone":"13711433954","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4bffb5880149","departId":"8a8a8bfc59977acf01599796a6710020","realname":"张旭升","departImage":"upload/departImages/8a8a8bfc59977acf01599796a6710020.png"}],"dutyCode":"13825121319","departImage":"upload/departImages/8a8a8bfc59977acf01599796a6710020.png","mustprecent":"60"},{"departname":"空港快线运输有限公司","description":"快线","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13380036819","departId":"8a8a8bfc59977acf01599796e6fa0022","dutyPeoples":[{"id":"19750","username":"mengxianman","mobilePhone":"13829721560","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cced59502a5","departId":"8a8a8bfc59977acf01599796e6fa0022","realname":"孟现满"},{"id":"19751","username":"wuqingxiu","mobilePhone":"13312833277","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4c039da10169","departId":"8a8a8bfc59977acf01599796e6fa0022","realname":"吴清洪","departImage":"upload/departImages/8a8a8bfc59977acf01599796e6fa0022.png"}],"dutyCode":"13380036819","departImage":"upload/departImages/8a8a8bfc59977acf01599796e6fa0022.png","mustprecent":"60"},{"departname":"商旅服务有限公司","description":"商旅","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13501532828","departId":"8a8a8bfc59977acf015997998b430028","dutyPeoples":[{"id":"19810","username":"tanfang","mobilePhone":"13802795808","detail_id":"31","userid":"8a8a8bfa599ccd3e01599ccebeca0255","departId":"8a8a8bfc59977acf015997998b430028","realname":"谭芳"},{"id":"19811","username":"zhongxiaoqing","mobilePhone":"13728081381","detail_id":"32","userid":"8a8a8bfa5e4b88f1015e4c0a077a019d","departId":"8a8a8bfc59977acf015997998b430028","realname":"仲晓青","departImage":"upload/departImages/8a8a8bfc59977acf015997998b430028.png"}],"dutyCode":"13501532828","departImage":"upload/departImages/8a8a8bfc59977acf015997998b430028.png","mustprecent":"60"},{"departname":"汉莎航空食品有限公司","description":"汉莎","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13925012783","departId":"8a8a8bfc59977acf01599799c438002a","dutyPeoples":[{"id":"19450","username":"chenchibang","mobilePhone":"13903065091","detail_id":"31","userid":"8a8a8bfa599ccd3e01599cce984501ba","departId":"8a8a8bfc59977acf01599799c438002a","realname":"陈炽邦"},{"id":"19451","username":"lijingnan","mobilePhone":"13678941088","detail_id":"32","userid":"8a8a8bfa599ccd3e01599cce9fc601d8","departId":"8a8a8bfc59977acf01599799c438002a","realname":"李敬南","departImage":"upload/departImages/8a8a8bfc59977acf01599799c438002a.png"}],"dutyCode":"13925012783","departImage":"upload/departImages/8a8a8bfc59977acf01599799c438002a.png","mustprecent":"60"},{"departname":"白云国际广告有限公司","description":"广告","duty_time":"2018-11-21 00:00:00.0","dutyphone":"13570498158","departId":"8a8a8bfc59977acf01599799f51d002c","dutyPeoples":[{"id":"19130","username":"kuangdan","mobilePhone":"","detail_id":"31","userid":"8a8a6c0e626bbc74016305bfaebb3445","departId":"8a8a8bfc59977acf01599799f51d002c","realname":"邝丹"}],"dutyCode":"13570498158","departImage":"upload/departImages/8a8a8bfc59977acf01599799f51d002c.png","mustprecent":"60"},{"departname":"广州市宏利投资有限公司","description":"宏利","duty_time":"2018-11-21 00:00:00.0","dutyphone":"18923092296","departId":"8a8a8bfc59977acf0159979a237b002e","dutyPeoples":[{"id":"19390","username":"huanghua","mobilePhone":"13760695806","detail_id":"31","userid":"8a8a8bfa5e4b88f1015e4c0f929001c9","departId":"8a8a8bfc59977acf0159979a237b002e","realname":"黄华"},{"id":"19391","username":"mahaitao","mobilePhone":"13333333333","detail_id":"32","userid":"8a8a6c0e63d9c664016444826e970c7b","departId":"8a8a8bfc59977acf0159979a237b002e","realname":"马海涛","departImage":"upload/departImages/8a8a8bfc59977acf0159979a237b002e.png"}],"dutyCode":"18923092296","departImage":"upload/departImages/8a8a8bfc59977acf0159979a237b002e.png","mustprecent":"60"}];
            if(vm.dutyPeople.length>0){
                 //有网
                vm.nonet=false;
                vm.nothing=false;
            }else{
                //无网
                vm.nonet=true;
                vm.nothing=false;
            }
            
            $('.shade').addClass('shade-hide');
        } 
    });
    
}

(function (){
    // var data = {
        // attributes: null, 
        // obj: {"change_time": "8","id": 31,"scherulerule_id": 60,"shiftname": "正班","showorder": null}, 
        // msg: "操作成功", 
        // success: true
    // };
    // if(data.success){
       // console.log(data.obj.change_time*1)
       // var nowHours = new Date().getHours();
       // ISTIME = nowHours < (data.obj.change_time*1);
       // var dd = new Date();
       // if (ISTIME) {
           // dd.setDate(dd.getDate() - 1);
       // }
       // console.log(dd)
       // var dObj = {
           // y: dd.getFullYear(),
           // m: dd.getMonth(),
           // d: dd.getDate()  
       // }
       // console.log(dObj)
       // initCanlendar(dObj);
       // // 渲染日历
       // $(".calendar-box").removeClass("visibility");
    // }else{
       // ISTIME = false;
       // vm.nonet = true;
    // } 
    /**
     * 请求值班时间，通过该时间渲染值班日历
     */
    var json={
        path:serverPath+'schedule.do?focgetChangeTime',
        data:{},
        layer: true,
        layerErr: true
    };
    ajaxRequest(json,function(data,e){
        if(e=="success"){
           // console.log(e)
           // console.log(data.obj.change_time*1)
           var nowHours = new Date().getHours();
           ISTIME = nowHours < (data.obj.change_time*1);
           var dd = new Date();
           if (ISTIME) {
               dd.setDate(dd.getDate() - 1);
           }
           //console.log(dd)
           var dObj = {
               y: dd.getFullYear(),
               m: dd.getMonth(),
               d: dd.getDate()  
           }
           //console.log(dObj)
           initCanlendar(dObj);
           // 渲染日历
           $(".calendar-box").removeClass("visibility");
        }else{
           ISTIME = false;
           vm.nonet = true;
        } 
    });
})();

