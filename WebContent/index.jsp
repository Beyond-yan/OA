﻿<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="security"
	uri="http://www.springframework.org/security/tags"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.core.util.ContextUtil"%>
<%@page import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
response.addHeader("x-frame-options","SAMEORIGIN");
	String basePath = request.getContextPath();

	//登录成功后，需要把该用户显示至在线用户
	AppUtil.addOnlineUser(request.getSession().getId(),
			ContextUtil.getCurrentUser());
	if (ContextUtil.getCurrentUser().getRights().contains("__ALL")) {
		request.setAttribute("IS_MANAGER", true);
	}
	String ip = null;
	if (request.getHeader("x-forwarded-for") == null) {
		ip = request.getLocalAddr();
	} else {
		ip = request.getHeader("x-forwarded-for");
	}
	request.setAttribute("ip", ip);
	String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent));
%>

<%
	SimpleDateFormat formatter = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");
	String systemDate = formatter.format(new Date());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@page import="java.util.Enumeration"%><html>
<head>
<c:if test="${browser=='IE'}">
	<meta http-equiv="X-UA-Compatible" content="IE=8">
	<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8">
</c:if>
<link rel="shortcut icon" href="images/favicon3.ico">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="msthemecompatible" content="no">
<title><%=AppUtil.getCompanyName()%>－－办公协同管理系统</title>
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/resources/css/ext-all-notheme.css" />
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/ux/css/Portal.css" />
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/ux/css/Ext.ux.UploadDialog.css" />
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/css/admin.css" />

<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/ux/css/ux-all.css" />
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/ux/caltask/calendar.css" />
<!-- load the extjs libary -->
<script type="text/javascript" src="<%=basePath%>/js/dynamic.jsp"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<!-- <script type="text/javascript" src="<%=basePath%>/ext3/ux/SingleClickButton.js"></script> -->
<script type="text/javascript"
	src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/core/ScriptMgr.js"></script>

<script type="text/javascript" src="<%=basePath%>/js/App.import.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/FlowDefIdPro.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/core/AppUtil.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/core/ux/HTExt.js"></script>
<script src="<%=basePath%>/js/archive/ArchivesReceiveEdit.js"
	type="text/javascript"></script>
<script src="<%=basePath%>/js/archMeeting/ArchivesMeetingEdit.js"
	type="text/javascript"></script>
<script src="<%=basePath%>/js/archive/ArchivesWorkEdit.js"
	type="text/javascript"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/Ext.ux.IconCombob.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/RowEditor.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/fckeditor/fckeditor.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Fckeditor.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/XmlTreeLoader.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/FileUploadField.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/UploadDialog.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/CheckColumn.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Portal.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/PortalColumn.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Portlet.js"></script>

<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/Ext.ux.grid.RowActions.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/TabCloseMenu.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/PageComboResizer.js"></script>

<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<!-- ljf 10.21 -->
<script type="text/javascript" src="<%=basePath%>/ext3/ux/miframe.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/PagingMemoryProxy.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/PagingStore.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/ux/TreeCombo.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/GroupSummary.js"></script>

<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/RowExpander.js"></script>

<script type="text/javascript"
	src="<%=basePath%>/js/system/mailListView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/SystemCalendar.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/TreeSelector.js"></script>
<!-- 请假管理开始 -->
<script type="text/javascript" src="<%=basePath%>/js/core/TreeSelectorName.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/leave/WorkTime.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/leave/LeaveViewRemain.js"></script>
<!-- 请假管理结束 -->
<script type="text/javascript" src="<%=basePath%>/js/core/date.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/ux/TreePanelEditor.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/ux/TreeXmlLoader.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/ux/WebOffice.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/ux/OfficePanel.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchTemplateSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchivesWriteOpionView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/flow/FlowDetailEditCommentsForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/OAsearchArchivesView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/jw/JwSentArchivesDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/jw/JwSentDocsDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/jw/JwRecArchivesDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/jw/JwReceivedDocsDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchTemplateView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/OAOfficeDetailView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchiveSentEdit.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchivesDetail.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ToReceiveArchivesDetailView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/MyccArchDetailView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/UserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/NewUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/UserRoomSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/CarDriverSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/CarApplySelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/CarUseSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/AlreadyCreateView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DeptOfUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DeptOfUserSelector2.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/AllDeptOfUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/MutiDeptOfUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DAndROfUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/UserAllSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/UserSubSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/SentUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DeptUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepSelector2.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepSelector3.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepSelector4.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepLeaders.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepLeaders2.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepLeaders3.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/DepLeaders4.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/SubDepSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/RoleSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/CarSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/OnlineUserSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/OdCommentsSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchivesDocHistoryWin.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/info/MessageWin.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/reject/RejectView.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/report/ArchiveReportRejectView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/flow/FlowSendForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/flow/ProcessNextForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/flow/ProcessNextForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/system/FileAttachDetail.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/system/DiaryDetail.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/task/WorkPlanDetail.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/task/DocumentChangeView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/OutMsgSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/personal/DutyView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/personal/DutyForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/sound/soundmanager2.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/search/SearchForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/admin/ConferenceDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/admin/ConfSummaryDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/system/FileUploadManager.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/system/FileUploadImageDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/system/DocDirectorFileNumberEdit.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/system/DocFilesDetailForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/system/DocFilesForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/CarReferSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/UnitsSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/WindowMin.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/flow/ProcessRunStart.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/work/CheckSelect.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/work/CheckSelectEditUser.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/work/CheckSelectView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/work/CheckSelectDetailView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/work/CheckSelectProcessView.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/ntkoffice/NtkOfficePanel.js"></script>
<link href="<%=basePath%>/css/desktop.css" rel="stylesheet"
	type="text/css" />
<script type="text/javascript">
	//单击事件
	function singleClick(id){
        var time = null;
        Ext.getCmp(id).setDisabled(true);
	  //取消上次延时未执行的方法
	  clearTimeout(time);
	  //设置延时300ms
	  time = setTimeout(function(){
		  Ext.getCmp(id).setDisabled(false);
	  },3000);
	}
	Ext.apply(Ext.form.TextField.prototype,{
	    validator:function(text){
	        if(this.allowBlank==false && Ext.util.Format.trim(text).length==0)
	          return false;
	        else
	          return true;
	    }
	});

	var __companyName="<%=AppUtil.getCompanyName()%>";


	Ext.onReady( function()  { 	//ready

		Ext.util.CSS.swapStyleSheet("theme", __ctxPath+"/ext3/resources/css/ext-all-css04.css");

		var viewId="<%=request.getParameter("viewId")%>";
		if(viewId){
			setTimeout(function(){
				App.clickTopTab(viewId);
			},500);
		}

		var ip="<%=request.getAttribute("ip")%>";
		var ver;//浏览器版本
		var bType;//浏览器类型
		var vNumber;//版本号
		ver = navigator.appVersion;
		bType =navigator.appName;
		var piugins=navigator.plugins;

		if(bType=="Microsoft Internet Explorer"){
			   var engin= document.documentMode;//IE8通过这个来判断，主要是渲染器不一样
		       vNumber=parseFloat(ver.substring(ver.indexOf("MSIE")+5,ver.lastIndexOf("Windows")));

		       if (vNumber<=6.0) {
		    	   Ext.ux.Toast.msg('提示','本系统要求浏览器版本为IE8.0其及以上,请下载IE8.0');
		    	   setTimeout(function(){
		    		   window.open(__ctxPath + "/downFile/IE8-WindowsXP-x86-CHS.zip");
		    	   },5000);
			   } else if (vNumber==7.0) {
		    	   if(!engin){
				       Ext.Msg.confirm('提示', '本系统要求浏览器版本为IE8.0其及以上,确定下载IE8.0?',function(btn, text){
				    		if (btn == 'yes'){
					    		window.open(__ctxPath + "/downFile/IE8-WindowsXP-x86-CHS.zip");
					    	}
						});
				 	}
	     	}
		}
	});

	window.onload=function(){
		 document.getElementsByTagName("body")[0].onkeydown =function(){
			 //获取事件对象
			 var event = window.event || arguments[0];
			 if(event.keyCode==8){//判断按键为backSpace键
				 //获取按键按下时光标做指向的element
				 var elem = event.srcElement || event.currentTarget;
				 //判断是否需要阻止按下键盘的事件默认传递
				 var name = elem.nodeName;
				 if(name!='INPUT' && name!='TEXTAREA' && name!='BODY'){
				 	return _stopIt(event);
				 }
				 var type_e = elem.type.toUpperCase();
				 if(name=='INPUT' && (type_e!='TEXT' && type_e!='TEXTAREA' && type_e!='PASSWORD' && type_e!='FILE')){
				 	return _stopIt(event);
				 }
				 if(name=='INPUT' && (elem.readOnly==true || elem.disabled ==true)){
				 	return _stopIt(event);
				 }
			 }
		 };

	<%-- 	 if(new Date()<Date.parseDate("2014-04-01", "Y-m-d")) {
			var cuid = "<%=ContextUtil.getCurrentUserId()%>";
			var arr = document.cookie.match(new RegExp("(^| )NoticeRead"+cuid+"=([^;]*)(;|$)"));
			if(arr == null || arr[2]==null) {
				var noticeWin = new Ext.Window({
					title:'<img src="images/newpm.gif"/>新版OA上线啦！',
					width:620,
					height:440,
					resizable:false,
					modal :true,
					plain:true,
					floating : true,
					closable :false,
					html:'<div><img src="images/notice.png"/><br/><a href="#" style="float:right;padding-right:130px;">下载操作手册</a></div>',
					buttons:[{
						text:'关　　闭',
						handler:function(){
							noticeWin.close();
							document.cookie = "NoticeRead"+cuid+"=ture;expires=" + new Date(new Date().getTime() + 240*3600000).toGMTString();
						}
					}]
				}).show();
			 }
		 } --%>

		 var viewId="<%=request.getParameter("viewId")%>";
		 if(viewId!='null'){
		 	setTimeout(function(){
				App.clickTopTab(viewId);
			},2000);
		 }
	};
	refeshTaskPanelView1();
	function refeshTaskPanelView1(){
	 	setTimeout(function(){
	 		if(Ext.getCmp('TaskPanelView') != null){ //首页
	 			Ext.getCmp('TaskPanelView').getUpdater().update( __ctxPath + '/flow/displayTask.do?ran=' + Math.random());
	 		}
	 		refeshTaskPanelView1();
		},60*1000*5);
	}
	function _stopIt(e){
		 if(e.returnValue){
		 	e.returnValue = false ;
		 }
		 if(e.preventDefault ){
			 e.preventDefault();
		 }
		 return false;
	 }
</script>

<script type="text/javascript" src="<%=basePath%>/js/ScrollText.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-basex.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/IndexPage.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/App.home.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/map.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/App.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/core/ntkoffice/NtkOfficePanel.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/SealSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/PaintTemplateSelector.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/selector/passwordForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchivesDocForm.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchivesUtil.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archMeeting/MeetingNoticeUtil.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/archive/ArchivesDocExtUtil.js"></script>

</head>
<body>
	<div id="loading">
		<div class="loading-indicator">
			<img src="<%=basePath%>/images/loading.gif" alt="" width="153"
				height="16" style="margin-right: 8px;" align="absmiddle" />
			<div class="clear"></div>
			正在加载，请稍候......
		</div>
	</div>
	<div id="loading-mask"></div>

	<input type="hidden" id="systemDate"
		value="<%=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
					.format(new Date())%>" />
	<div id="app-header" style="display: none">
		<div id="header-left"></div>
		<div id="header-main">
			<div id="topInfoPanel">
				<div id="welcomeMsg">
					欢迎您，
					<security:authentication property="principal.fullname" />
				</div>
				<div id="currentTime">
					<span id="nowTime"></span><span id="nowTime2"></span>
				</div>
			</div>
			<div class="clear"></div>
			<ul id="header-topnav">
				<li class="commonli"><a href="#" onclick="App.MyDesktopClick()">
						<img src="images/menus/monitor.png" />我的桌面
				</a></li>
				<!--  <li class="commonli">
		<a href="#" onclick="App.clickTopTab('CalendarPlanView')">
			<img src="images/menus/task.png"/>我的任务
		</a>
	</li>-->
				<li class="commonli"><a href="#"
					onclick="App.clickTopTab('MyPlanTaskView')"> <img
						src="images/menus/task/workplan.png" />我的日程
				</a></li>
				<li class="commonli"><a href="#"
					onclick="App.clickTopTab('PersonalDocumentView')"> <img
						src="images/menus/document/documentation.gif" />我的文件夹
				</a></li>
			</ul>
		</div>
		<div id="header-right">
			<div id="setting">
				<c:if test="${IS_MANAGER ==true}">
					<li><b class="i_set"></b> <a href="#"
						onclick="App.clickTopTab('SysConfigView')">设置</a></li>
				</c:if>
				<li><b class="i_equit"></b> <a href="<%=basePath%>/j_logout.do">注销</a>
				</li>
				<li><b class="i_office"></b> <a href="javascript:;"
					onclick="IMClient.login()">办公在线</a></li>
			</div>

			<div id="searchFormDisplay"
				style="width: 260px; float: right; padding-top: 8px;">&nbsp;</div>
		</div>
	</div>
	<div id="docUpload"></div>
<script language="JScript" for="officeObj" event="AfterPublishAsPDFToURL(ret,code)">
	OnComplete2("",code,ret);
</script>
</body>
</html>