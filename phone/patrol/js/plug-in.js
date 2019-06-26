/**
 *插件js封装
 */
/**
 * 1、uexCamera  系统相机插件
 * 2、uexContact 联系人插件
 * 3、uexControl 日期选择器插件
 * locStorage中存入的值：1、platForm   ：   平台版本：0：IOS；1：Android；2：Chrome
 *                     2、version    ：   app 版本号，ios和Android统一这个key值
 * 
 */
/**
 * 相机的打开 
 * @param {Object} comtextareass 是否压缩0表示压缩非0表示不压缩
 * @param {Object} quality压缩比例取值范围[0,100];值越大图片质量越好
 * @param {Object} cb，返回函数。返回拍完照之后的图片地址。
 */
window.appcan && appcan.define('plugInCamera',function($,exports,module){
    var plugInCamera={
             open:function(comtextareass,quality,cb){
                uexCamera.open(comtextareass, quality, function(filePath){
                    cb(filePath);
                })
             } 
    } 
    plugInCamera=appcan.extend(plugInCamera);
    module.exports = plugInCamera;
});
/**
 * 头像截取功能模块
 */

window.appcan && appcan.define('plugInImg',function($,exports,module){
    
    var plugInImg={
             opens:function(cb){
                var json={
                    min:1,
                    max:1,
                    quality:0.5,
                    detailedInfo:true
                } 
                uexImage.openPicker(json, function(error,data){
                      if(error==-1){
                            cb("");
                      }else if(error==0){
                            var scopperData={
                                src:data.data[0],
                                mode:2
                            };
                            uexImage.openCropper(scopperData,function(error,info){
                                if(error==-1){
                                    cb('');
                                }else if(error==0) {
                                    cb(info.data);
                                }
                            });
                    }
                })
             } 
    } 
    plugInImg=appcan.extend(plugInImg);
    module.exports = plugInImg;
});

/**
 * 头像截取功能模块
 * @param {Object} comtextareass 是否压缩0表示压缩非0表示不压缩
 * @param {Object} quality压缩比例取值范围[0,100];值越大图片质量越好
 * @param {Object} cb，返回函数。返回拍完照之后的图片地址。
 */
window.appcan && appcan.define('plugInHeaderByCamera',function($,exports,module){
    var plugInHeaderByCamera={
             open:function(comtextareass,quality,cb){
                uexCamera.open(comtextareass, quality, function(filePath){
                    var data={
                        src:filePath,
                        mode:2
                    }
                    uexImage.openCropper(data,function(error,info){
                        if(error==-1){
                            cb('');
                        }else if(error==0) {
                            cb(info.data);
                        }
                    });
                })
             } 
    } 
    plugInHeaderByCamera=appcan.extend(plugInHeaderByCamera);
    module.exports = plugInHeaderByCamera;
});


/**
 * plugInControl 日期插件模块
 */
window.appcan && appcan.define('plugInControl',function($,exports,module){
    var plugInControl={
         
            /**
             * 打开日期选择器
             * @param {Object} year     type  Number 年
             * @param {Object} month    type  Number 月   
             * @param {Object} day      type  Number 日
             * @param {Object} cb       function 选择日期后的回调函数
             */
             openDatePicker :  function(year, month, day, cb){
                uexControl.openDatePicker(year,month,day, function(data) {
                    cb(data);
                });
             },
             /**
             * 打开时间选择器 
             * @param {Object} hour     type  Number 小时
             * @param {Object} minute   type  Number 分钟
             * @param {Object} cb       function 选择时间之后的回调函数
             */
             openTimePicker :  function(hour, minute, cb){
                 uexControl.openTimePicker(hour,minute, function(data) {
                    /**
                     * 返回的      data 格式
                     *      var data={
                     *        hour:,
                     *        minute:
                     *      }
                     */
                    cb(data);       
                });
             },
             /**
             * 打开日期选择插件输入对话框,点
             * @param {Object} type      type  Number 键盘类型  type 值如下：
             *   uex.StandardKB=0;
             *   uex.NumberKB=1;
             *   uex.EmailKB=2;
             *   uex.URLKB=3;
             *   uex.PasswordKB=4;
             * @param {Object} inputHint type  String 默认数据
             * @param {Object} btnText   type  String 输入框按钮上标题
             * @param {Object} cb        function 击输入框右侧的按钮后会回调cb
             */
             openInputDialog  : function (type,inputHint,btnText, cb) {
                 uexControl.openInputDialog(type,inputHint,btnText, function(data){
                    //data ：返回输入框的文字。
                    cb(data);
                 })
             },
             /**
             * 打开只选择年月的日期选择插件。
             * @param {Object} year      type  Number 年
             * @param {Object} month     type  Number 月
             * @param {Object} cb        function 返回选择完之后的年、月
             */
             openDatePickerWithoutDay   : function(year,month, cb){
                  uexControl.openDatePickerWithoutDay(year,month,function(data) {
                    cb(data);
                  });
             }
    } 
    plugInControl=appcan.extend(plugInControl);
    module.exports = plugInControl;
});
/**
 * plugInUploaderMgr 上传文件的插件,可多文件上传。
 * cb返回的参数中 status的值的表示：  2：失败
 *                              1：成功
 *                              3:正在上传中
 *             percent 为上传进度。
 */                             
 
window.appcan && appcan.define('plugInUploaderMgr',function($,exports,module){
    var plugInUploaderMgr={
             upload:function(json,cb){
                  //上传的次数
                  var loopnum=0;
                 //上传的图片数量
                  var picArr=new Array();
                  for(var i=0; i<json.filePath.length;i++){
                      var param = {
                        "url":json.serverUrl,
                        "type":2
                      }
                      var uploader = uexUploaderMgr.create(param);
                      if(!uploader){
                            //上传失败
                            var returnJson={
                                'status':2,
                                'percent':0
                            }
                            cb(returnJson);
                            return ;
                        }
                      //判断是否有sessionId  
                      if(json.hasOwnProperty("sessionId")){
                         var headJson = {"Cookie":json.sessionId};
                         uexUploaderMgr.setHeaders(uploader, JSON.stringify(headJson));
                      }
                      uexUploaderMgr.uploadFile(uploader, json.filePath[i], "upload",json.quality , 640,function(packageSize, percent, responseString, status){
                            switch (status) {
                                case 0:
                                        //实时返回上传进度。
                                        var returnJson={
                                            'status':3,
                                            'percent':percent
                                        };
                                        cb(returnJson);
                                    break;
                                case 1:
                                    loopnum++;
                                    picArr.push(responseString);
                                    if(loopnum==json.filePath.length){
                                        var returnJson={
                                            'status':1,
                                            'percent':100,
                                            'responseString':responseString,
                                            'picArray':picArr
                                         };
                                         cb(returnJson);
                                        uexUploaderMgr.closeUploader(uploader);
                                         
                                    }
                                    break;
                                case 2: 
                                        uexUploaderMgr.closeUploader(uploader);
                                        var returnJson={
                                           'status':2,
                                           'percent':0
                                        };
                                        cb(returnJson);
                                    break;
                                }  
                      });
                  }
             } 
    } 
    plugInUploaderMgr=appcan.extend(plugInUploaderMgr);
    module.exports = plugInUploaderMgr;
});
/**
 * plugInDownloaderMgr下载文件
 * 参数为json对象，包含：serverUrl要下载的服务器地址
 *                    downloadUrl下载到本地的地址。
 * 返回的参数为：status    1： 表示成功
 *                       2：表示失败
 *                       3：表示正在下载中
 *             percent为下载进度。
 */
window.appcan && appcan.define('plugInDownloaderMgr',function($,exports,module){
    var plugInDownloaderMgr={
             download:function(json,cb){
                var downloader = uexDownloaderMgr.create();
                if(!downloader){
                    //下载失败
                    var returnJson={
                        'status':2,
                        'percent':0
                    };
                    cb(returnJson);
                    return;
                }
                //判断是否有sessionId  
               if(json.hasOwnProperty("sessionId")){
                   var headJson = {"Cookie":json.sessionId};
                   uexDownloaderMgr.setHeaders(downloader, headJson);
               }
               uexDownloaderMgr.download(downloader,json.serverUrl,json.downloadUrl,1,function(fileSize, percent, status){
                              switch (status) {
                                  case 0:
                                       var returnJson={
                                            'status':3,
                                            'percent':percent
                                       };
                                       cb(returnJson);
                                      return;
                                  break;
                                  case 1:
                                      uexDownloaderMgr.closeDownloader(downloader);
                                      var returnJson={
                                            'status':1,
                                            'percent':100
                                      };
                                      cb(returnJson);
                                  break;
                                  case 2:
                                      uexDownloaderMgr.closeDownloader(downloader);
                                      var returnJson={
                                           'status':2,
                                           'percent':0
                                      };
                                      cb(returnJson);
                                  break;
                                  }                  
                });
             } 
    } 
    plugInDownloaderMgr=appcan.extend(plugInDownloaderMgr);
    module.exports = plugInDownloaderMgr;
});
window.appcan && appcan.define('plugInCheckUpdate',function($,exports,module){
    var checkUpdate={
             checkUpdate:function(updateJson,cb){
                appcan.widgetOne.getPlatform(function(err,data,dataType,opId){
                        if(err){
                            cb(err);
                        }else{
                            var platForm=data;
                            //将平台版本存入缓存中0：IOS；1：Android；2：Chrome
                            appcan.locStorage.setVal("platForm",data);
                            
                            //此为Android
                            if(platForm=="1"){
                                 //平台为android
                                var appInfo = uexWidgetOne.getCurrentWidgetInfo();
                                appcan.request.ajax({
                                    url:updateJson.updateUrl,
                                    type:"POST",
                                    dataType:"application/json",
                                    data:{
                                        ver:appInfo.version,
                                        platform:platForm
                                    },
                                    success:function(json2){
                                        var data=JSON.parse(json2);
                                        if(data.success){
                                            uexWindow.confirm({
                                              title:"",
                                              message:"检测到已有新版本，建议您进行更新体验",
                                              buttonLabels:"更新,不更新"
                                            },function(index){
                                              if(index==0){
                                                  var json={
                                                            serverUrl:serverPath+data.obj.url,
                                                            downloadUrl:'/sdcard/'+data.obj.name+".apk"
                                                    };
                                                    appcan.plugInDownloaderMgr.download(json,function(e){
                                                         if(e.status==1){
                                                             uexWindow.closeToast();
                                                             uexWidget.installApp('/sdcard/'+data.obj.name+".apk");
                                                         }else if(e.status==2){
                                                             appcan.window.openToast('下载失败',2000);
                                                             cb(2);
                                                         }else{
                                                             uexWindow.toast('1', '5', '下载进度：' + e.percent + '%', '');
                                                         }
                                                    }); 
                                              }else{
                                                  
                                              }
                                            });
                                           
                                             
                                            
                                        }else{
                                            cb(3);
                                        }
                                        
                                    },
                                    error:function(err,errMsg,error){
                                        cb(2);
                                    }
                                });
                            }else if(platForm=="0"){
                                //此为ios
                                    var appInfo = uexWidgetOne.getCurrentWidgetInfo();
                                    appcan.locStorage.setVal("version",appInfo.version);
                                    
                                    appcan.request.ajax({
                                        url:updateJson.AppStoreUrl,
                                        type:"POST",
                                        dataType:"jsonp",
                                        success:function(json){
                                            if(parseInt(appInfo.version.replace(/\./g,"")) < parseInt(json.results[0].version.replace(/\./g,""))){
                                               uexWidget.loadApp(updateJson.IosUpdateUrl);
                                            }else{
                                                cb(1);
                                            }
                                        },
                                        error:function(err,errMsg,error){
                                            appcan.window.openToast(errMsg,2000);
                                            cb(2);
                                        }
                                    });
                                
                            }
                            
                        }
                });
             } 
    } 
    checkUpdate=appcan.extend(checkUpdate);
    module.exports = checkUpdate;
});
 

