<%@ page pageEncoding="UTF-8"%>
<%@page import="java.util.Set,java.util.Iterator"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
	String basePath=request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
<title>签到日志</title>
<script src="../../js/duty/dhtmlxscheduler.js" type="text/javascript" charset="utf-8"></script>
<link rel="stylesheet" href="../../css/dhtmlxscheduler.css" type="text/css" media="screen" title="no title" charset="utf-8" />
<script src="../../js/duty/locale_cn.js" type="text/javascript" charset="utf-8"></script>
<script src="../../js/duty/ext_editors.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="<c:url value='/js/jquery-ui-1.8.2.custom.min.js'/>"></script>
<style type="text/css" media="screen">
html,body {
	margin: 0px;
	padding: 0px;
	height: 100%;
	overflow: hidden;
}
a.left-table03:hover {
	background-image: url(< c : url value = '/img/nav03.gif'/ >);
}

.left-table02 {
	margin-top: 8px;
	margin-bottom: 8px;
	font-family: "宋体";
	font-size: 12px;
	color: #555555;
	text-decoration: none;
}

.left-font03 {
	font-family: "宋体";
	font-size: 12px;
	color: #555555;
	text-decoration: none;
}

a.left-font03:hover {
	font-family: "宋体";
	font-size: 12px;
	color: #FF0000;
	text-decoration: underline;
}
</style>

<script type="text/javascript" charset="utf-8">
	$(function(){
		initSchedulrer();
		scheduler.load("<%=request.getContextPath()%>/duty/dutyscheduleritem.do?date="+new Date());
	});
	function initSchedulrer() {
		scheduler.config.multi_day = true;
		var pizza_size = [{
			key : 1,
			label : '非常重要'
		}, {
			key : 2,
			label : '重要'
		}, {
			key : 3,
			label : '一般'
		}];
		scheduler.config.lightbox.sections = [ {
			name : "text",
			height : 50,
			map_to : "text",
			type : "textarea",
			focus : true
		}, {
			name : "description",
			height : 50,
			map_to : "description",
			type : "textarea"
		}, {
			name : "priority",
			height : 25,
			options : pizza_size,
			map_to : "priority",
			type : "radio"
		}, {
			name : "time",
			height : 72,
			type : "time",
			map_to : "auto"
		} ];
		scheduler.config.readonly=true;
		//scheduler.config.details_on_dblclick = false;
		//scheduler.config.details_on_create = false;
		scheduler.templates.event_text = function(start, end, event) {
			var color = "";
			if(event.priority=='1')color="blue";
			if(event.priority=='2')color="green";
			if(event.priority=='3')color="";
			return "签到人 :<b style='color:"+color+"'> " + event.text + "</b>";
		};
		scheduler.templates.event_bar_text=function(start, end, event){
			var color = "";
			if(event.priority=='1')color="blue";
			if(event.priority=='2')color="green";
			if(event.priority=='3')color="";
			return "<span style='color:"+color+"'>" + event.text + "</span>";
		};
		scheduler.config.xml_date = "%Y-%m-%d %H:%i";
		scheduler.init('scheduler_here', new Date(), "month");
	}
</script>
</head>
<body>
	<table width="100%" border="0" cellspacing="0" cellpadding="0"
		style="height: 100%">
		<tr>
			<td style="height: 100%; width: 100%">
				<div id="scheduler_here" class="dhx_cal_container"
					style='width: 100%; height: 100%;'>
					<div class="dhx_cal_navline">
						<div class="dhx_cal_prev_button">&nbsp;</div>
						<div class="dhx_cal_next_button">&nbsp;</div>
						<div class="dhx_cal_today_button"></div>
						<div class="dhx_cal_date"></div>
						<!--  <div class="dhx_cal_tab" name="day_tab" style="right: 204px;"></div>  -->
						<!--  <div class="dhx_cal_tab" name="week_tab" style="right: 140px;"></div> -->  
						<div class="dhx_cal_tab" name="month_tab" style="right: 76px;"></div>
					</div>
					<div class="dhx_cal_header"></div>
					<div class="dhx_cal_data"></div>
				</div>
			</td>
		</tr>
	</table>
</body>