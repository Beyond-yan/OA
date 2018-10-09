<%@page import="com.gdssoft.oa.model.meetingNotice.MeetingNotice"%>
<%@page import="com.gdssoft.oa.service.meetingNotice.MeetingNoticeService"%>
<%@page import="com.gdssoft.oa.model.system.AppRole"%>
<%@ page import="java.util.*"%>
<%@ page import="com.gdssoft.core.util.ContextUtil"%>
<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.service.system.SysConfigService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.model.system.SysConfig"%>
<%
	String noticeId = request.getParameter("noticeId");
	MeetingNoticeService meetingNoticeService = (MeetingNoticeService) AppUtil
			.getBean("meetingNoticeService");
	MeetingNotice meetingNotice = new MeetingNotice();
	if (StringUtils.isNotEmpty(noticeId)) {
		meetingNotice = meetingNoticeService.get(new Long(noticeId));
	}
	request.setAttribute("meetingNotice", meetingNotice);
	String defId = request.getParameter("defId");
	request.setAttribute("defId",defId);
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
	AppUserService appService = (AppUserService)AppUtil.getBean("appUserService");
	AppUser issUser=new AppUser();
	if(meetingNotice.getCreatorId()!=null){
		issUser=appService.get(meetingNotice.getCreatorId());
	}
	request.setAttribute("issUser",issUser);
	ProcessFormService processFormService = (ProcessFormService)AppUtil.getBean("processFormService");
	List pfList=processFormService.getByRunId(meetingNotice.getRunId());
	request.setAttribute("pfList",pfList);
	String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent));
%>
<head>
<title>直接打印</title>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<script src="../js/main.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/admin.css" />
<script type="text/javascript" src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<script language="javascript" src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/ext3/resources/css/ext-all.css" />
<script type="text/javascript">
  var hkey_root,hkey_path,hkey_key
  hkey_root="HKEY_CURRENT_USER"
  hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\"
  //设置网页打印的页眉页脚为空
  function pagesetup_null(){
  try{
  var RegWsh = new ActiveXObject("WScript.Shell")
  hkey_key="header"
  RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
  hkey_key="footer"
  RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
  }catch(e){}
  }
  pagesetup_null(); 
</script>
<script type="text/javascript">
function stamp(){
	$("#print").jqprint();
}
</script>
<style media=print>  
    .Noprint{display:none;}  
    .PageNext{page-break-after:always;} 
    body,td,th    
    {  
        height: 10px;
    } 
</style>  
</head>
<body>
<OBJECT id=WebBrowser classid=CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 height=0 width=0  VIEWASTEXT></OBJECT> 
	<div align="right" class="Noprint" style="padding-right: 20px;">
		<c:if test="${browser=='Chrome'}">
			<a href="#" onclick="stamp()" style="text-decoration: none;"><img src="../../images/btn/print/Archprint1.gif" width="30px" height="30px" align="middle"/>打印</a>
		</c:if>
		<c:if test="${browser=='IE'}">
    		<a href="#" onclick="document.all.WebBrowser.ExecWB(6,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint1.gif" width="30px" height="30px" align="middle"/>打印</a>
    		<a href="#" onclick="document.all.WebBrowser.ExecWB(8,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint2.gif" width="30px" height="30px" align="middle"/>页面设置</a>
    		<a href="#" onclick="document.all.WebBrowser.ExecWB(7,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint3.gif" width="30px" height="30px" align="middle"/>打印预览</a>
    	</c:if>
	</div>
<div id="print">	
<h1 align="center" style="padding:10px;font-size:20px;"> ${proDef.name}</h1>
<span style="float:right;padding-right:10px;padding-bottom:4px;">创建日期:<fmt:formatDate value="${meetingNotice.createTime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" width="98%" align="center" border="1" style="border:1px ;solid #000;border-collapse: collapse;">
	<tr>
		<th width="15%">会议名称</th>
		<td colspan="5" >${meetingNotice.subject}</td>
	</tr>
  	<tr>
    	<th width="15%">召集单位</th>
    	<td colspan="2">${meetingNotice.holdDep}</td>   
    	<th width="15%">主持人</th>
    	<td colspan="2">${meetingNotice.host}</td>   
  	</tr>
  	<tr>
   		<th width="15%">会议时间</th>
    	<td colspan="2"><fmt:formatDate value="${meetingNotice.meetingDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
    	<th width="15%">会议地点</th>
	    <td colspan="2">${meetingNotice.meetingPlace}</td>
 	</tr>
  	<tr>
    	<th width="15%">会议状态</th>
     	<td colspan="2">${meetingNotice.meetingState}</td>
     	<th width="15%">主办部门</th>
     	<td colspan="2">${meetingNotice.mainDep}</td>
  	</tr>
  	<tr>
		<th width="15%">参会领导</th>
		<td colspan="5">${meetingNotice.attendLeadersName}</td>
	</tr>
	<tr>
		<th width="15%">参会人员</th>
		<td colspan="5">${meetingNotice.attendPersonsName}</td>
	</tr>
  	<tr>
   		<th width="15%">出发时间</th>
    	<td colspan="2"><fmt:formatDate value="${meetingNotice.departureTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
    	<th width="15%">出发地点</th>
	    <td colspan="2">${meetingNotice.departurePlace}</td>
 	</tr>
  	<tr>
		<th width="15%">车辆信息</th>
		<td colspan="5" >${meetingNotice.vehicleInfo}</td>
	</tr>
	<tr>
		<th width="15%">驾驶员信息</th>
		<td colspan="5" >${meetingNotice.driverInfo}</td>
	</tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${meetingNotice.docs}">
          <c:set var="fileName" value="${doc.fileName}"></c:set>
          	<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
	         <a href="<%=request.getContextPath()%>/attachFiles/${doc.filePath}" target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr> 
</table>
<table class="table-info" border="1" align="center" style="border:1px ;solid #000;border-collapse: collapse;" width="98%">
		<tr>
			<th align="left" colspan="7" valign="middle"><h2>流程审批信息</h2></th>
		</tr>
		<tr>
			<th width="100">序号</th>
			<th width="130">任务名</th>
			<th width="120">办理人</th>
			<th width="110">办理时间</th>
			<th colspan="3">办理意见</th>
		</tr>
		<c:forEach items="${pfList}" var="processForm" varStatus="i">
		<tr>
			<td align="center">${i.count}</td>
			<td>${processForm.activityName}</td>
			<td>${processForm.creatorName}</td>
			<td><fmt:formatDate value="${processForm.createtime}" pattern="yyyy-MM-dd HH:mm"/></td>
			<td colspan="3" style="height:${fn:length(processForm.comments)/2+20}px">
			<c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}</td>
		</tr>
		</c:forEach>
</table>
</div>
</body>
</html>