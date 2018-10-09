<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="security"
	uri="http://www.springframework.org/security/tags"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	response.setHeader("Cache-Control","no-store");
	response.setHeader("Pragrma","no-cache");
	response.setDateHeader("Expires",0);
	String basePath = request.getContextPath();

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<head>
    <title>Ext JS Calendar Sample</title>
    <!-- Ext includes -->
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/ext3/resources/css/ext-all.css" />
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/ext-base-debug.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/ext-all-debug.js"></script>
    
    <!-- Calendar-specific includes -->
	<link rel="stylesheet" type="text/css" href="<%=basePath%>/ext3/resources/css/calendar.css" />
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/Ext.calendar.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/templates/DayHeaderTemplate.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/templates/DayBodyTemplate.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/templates/DayViewTemplate.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/templates/BoxLayoutTemplate.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/templates/MonthViewTemplate.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/dd/CalendarScrollManager.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/dd/StatusProxy.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/dd/CalendarDD.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/dd/DayViewDD.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/widgets/CalendarPicker.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/views/CalendarView.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/views/MonthView.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/views/MonthDayDetailView.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/views/DayHeaderView.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/views/DayBodyView.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/views/DayView.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/views/WeekView.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/widgets/DateRangeField.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/widgets/ReminderField.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/WeekEventRenderer.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/EventRecord.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/EventEditForm.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/EventEditWindow.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/CompanyEditForm.js"></script>
    
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/CalendarPanel.js"></script>
	
    <!-- App -->
    <link rel="stylesheet" type="text/css" href="<%=basePath%>/ext3/resources/css/examples.css" />
	<script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/app/calendar-list.js"></script>
    <script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/app/event-list.js"></script>
	<script type="text/javascript" src="<%=basePath%>/js/attend/attendCompanyCalendar/app/test-app.js"></script>
	
	
    <script type="text/javascript" src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
   
</head>
<body>
    <div style="display:none">
    <div id="app-header-content">
        <div id="app-logo">
            <div class="logo-top">&nbsp;</div>
            <div id="logo-body">&nbsp;</div>
            <div class="logo-bottom">&nbsp;</div>
        </div>
        <h1>行事历管理</h1>
        <span id="app-msg" class="x-hidden"></span>
    </div>
    </div>
    <script type="text/javascript">
    var updateLogoDt = function(){
        document.getElementById('logo-body').innerHTML = new Date().getDate();
    };
    updateLogoDt();
    setInterval(updateLogoDt, 1000);
</script>
</body>

