Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getWorkDays(beginTime,endTime){
	var num=0;
	var days=new Array();
	days=beginTime.split("-");
	var year=getInt(days[0]);
	var month=getInt(days[1])-1;
	var day=getInt(days[2]);
	var date=new Date(year,month,day);
	while(true){
		var nowTime=date.Format("yyyy-MM-dd");
		var nowDate=date.Format("yyyy-MM-dd");
		if(nowTime>=endTime){
			break;
		}
		//判断是否假日
		if(date.getDay()==0||date.getDay()==6){//平时周末
			if(isPaidLeave(nowDate)){//是否调休
				num++;
			}
		}else{
			if(!isHoliday(nowDate)){//是否法定假日
				num++;
			}
		}
		date.setDate(date.getDate()+1);
	}
	return num;
}
function getInt(value){
	if(value.substring(0,1)==0){
		value= value.substring(1,2);
	}
	return value;
}
function isHoliday(value){//正常工作日放假的。（周一~周五）
	var holiday=["2018-01-01","2018-02-15","2018-02-16","2018-02-19","2018-02-20","2018-02-21"
	             ,"2018-04-05","2018-04-06","2018-04-30","2018-05-01","2018-06-18","2018-09-24","2018-10-01"
	             ,"2018-10-02","2018-10-03","2018-10-04","2018-10-05"];
	for(var i=0;i<holiday.length;i++){
		if(holiday[i]==value){
			return true;
		}
	}
	return false;
}
function isPaidLeave(value){//周六日上班的。
	var paidLeave=["2018-02-11","2018-02-24","2018-04-08","2018-04-28","2018-09-29","2018-09-30"];
	for(var i=0;i<paidLeave.length;i++){
		if(paidLeave[i]==value){
			return true;
		}
	}
	return false;
}