/**
 * 获取前后7天以内的日期数据， 
 * @param {Object} y 为要显示的 actives
 */
function getLast7Days(y){
        var weekList = ['日','一','二','三','四','五','六'];
        var arr=new Array();
        for (var i=-3; i <=3; i++) {
          var dateStr=GetDateStr(i);
          var dateStrFull = GetDateStrWithZero(i);
          var weekday = new Date(dateStr).getDay();
          var dateTime = Math.round(new Date(dateStr).getTime()/1000);
          var dy=LunarCalendar.solarToLunar(dateStr.split("/")[0],dateStr.split("/")[1],dateStr.split("/")[2]);
          var active=false;
          if(i==y){
             active=true; 
          }
          var today=dateStr.split("/")[2];
          if(i==0){
              today='今';
          }
          var lunarDayName=dy.lunarDayName;
          if(isDefine(dy.solarFestival)){
              lunarDayName=dy.solarFestival;
          }else{
              if(isDefine(dy.lunarFestival)){
                  lunarDayName=dy.lunarFestival;
              }else{
                  if(isDefine(dy.term)){
                      lunarDayName=dy.term;
                  }
              }
          }
          var json={
              fullDate: dateStrFull,
              weekDay:weekList[weekday],
              date:today,
              lunarDayName:lunarDayName,
              actives:active,
              fullYearAndMoth:dateStr.split("/")[0]+'年'+dateStr.split("/")[1]+'月',
              dateTime:dateTime
          };
          arr.push(json);
        };
    return arr;
}
function GetDateStr(AddDayCount) { 
      var dd = new Date(); 
      dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
      var y = dd.getFullYear(); 
      var m = dd.getMonth()+1;//获取当前月份的日期 
      var d = dd.getDate(); 
   return y+"/"+m+"/"+d; 
}
function GetDateStrWithZero(AddDayCount) { 
      var dd = new Date(); 
      dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
      var y = dd.getFullYear(); 
      var m = dd.getMonth()>9?dd.getMonth()+1:'0'+(dd.getMonth()+1);//获取当前月份的日期 
      var d = dd.getDate()>10?dd.getDate():'0'+dd.getDate(); 
   return y+"-"+m+"-"+d; 
}
