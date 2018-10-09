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
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.service.system.SysConfigService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.model.system.SysConfig"%>
<%
	String archivesId = request.getParameter("archivesId");
	ArchivesService arService = (ArchivesService) AppUtil
			.getBean("archivesService");
	Archives arch = new Archives();
	if (StringUtils.isNotEmpty(archivesId)) {
		arch = arService.get(new Long(archivesId));
	}
	request.setAttribute("arch", arch);
	String defId = request.getParameter("defId");
	request.setAttribute("defId", defId);
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil
			.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
	AppUserService appService = (AppUserService) AppUtil
			.getBean("appUserService");
	AppUser issUser = new AppUser();
	if (arch.getIssuerId() != null) {
		issUser = appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser", issUser);
	ProcessFormService processFormService = (ProcessFormService) AppUtil
			.getBean("processFormService");
	List pfList = processFormService.getByRunId(arch.getProcessRun()
			.getRunId());
	request.setAttribute("pfList", pfList);
	String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent));
%>
<head>
<title>直接打印</title>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<script src="../js/main.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/css/admin.css" />
<script type="text/javascript"
	src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script>
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/resources/css/ext-all.css" />
<script type="text/javascript">
	var hkey_root, hkey_path, hkey_key
	hkey_root = "HKEY_CURRENT_USER"
	hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\"
	//设置网页打印的页眉页脚为空
	function pagesetup_null() {
		try {
			var RegWsh = new ActiveXObject("WScript.Shell")
			hkey_key = "header"
			RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
			hkey_key = "footer"
			RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
		} catch (e) {
		}
	}
	pagesetup_null();
</script>
<script language="javascript">
function stamp(){
	$("#print").jqprint();
}
</script>
<style media=print>
.Noprint {
	display: none;
}

.PageNext {
	page-break-after: always;
}

body, td, th {
	height: 10px;
}
</style>
</head>
<body>
	<OBJECT id=WebBrowser
		classid=CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 height=0 width=0
		VIEWASTEXT></OBJECT>
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
	<h1 align="center" style="padding: 10px; font-size: 20px;">
		局机关各类假期审批表</h1>
	<span style="float: right; padding-right: 10px; padding-bottom: 4px;">创建日期:<fmt:formatDate
			value="${arch.createtime}" pattern="yyyy-MM-dd" /></span>
	<table class="table-info" width="98%" align="center" border="1"
		style="border: 1px; solid #000; border-collapse: collapse;">
		<tr>
			<th width="15%">申&nbsp;请&nbsp;人</th>
			<td width="35%">${arch.typeName}</td>
			<th width="15%">部&nbsp;&nbsp;&nbsp;&nbsp;门</th>
			<td width="35%">${arch.issueDep}</td>
		</tr>
		<tr>
			<th width="15%">参加工作时间</th>
			<td colspan="3">${arch.ccTo}</td>
		</tr>
		<tr>
			<th width="15%">休假原因</th>
			<td colspan="3">${arch.privacyLevel}</td>
		</tr>
		<tr>
			<th width="15%">休假时间</th>
			<td colspan="3">${arch.archivesNo}</td>
		</tr>
		<tr>
			<th width="15%" style="line-height: 80px;height: 80px;">处室意见</th>
			<td colspan="3">
				<c:set var="exitId" value="0"></c:set>
				<c:forEach items="${pfList}" var="processForm" varStatus="i">
					<c:if test="${processForm.activityName=='处室意见'&&exitId==0}">
						<c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}
						<c:set var="exitId" value="1"></c:set>
					</c:if>
				</c:forEach>
			</td>
		</tr>
		<tr>
			<th width="15%" style="line-height: 80px;height: 80px;">人事处意见</th>
			<td colspan="3">
				<c:set var="exitId" value="0"></c:set>
				<c:forEach items="${pfList}" var="processForm" varStatus="i">
					<c:if test="${processForm.activityName=='人事处意见'&&exitId==0}">
						<c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}
						<c:set var="exitId" value="1"></c:set>
					</c:if>
				</c:forEach>
			</td>
		</tr>
		<tr>
			<th width="15%" style="line-height: 80px;height: 80px;">分管领导意见</th>
			<td colspan="3">
				<c:set var="exitId" value="0"></c:set>
				<c:forEach items="${pfList}" var="processForm" varStatus="i">
					<c:if test="${processForm.activityName=='分管领导意见'&&exitId==0}">
						<c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}
						<c:set var="exitId" value="1"></c:set>
					</c:if>
				</c:forEach>
			</td>
		</tr>
		<tr>
			<th width="15%" style="line-height: 80px;height: 80px;">领导意见</th>
			<td colspan="3">
				<c:set var="exitId" value="0"></c:set>
				<c:forEach items="${pfList}" var="processForm" varStatus="i">
					<c:if test="${processForm.activityName=='领导意见'&&exitId==0}">
						<c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}
						<c:set var="exitId" value="1"></c:set>
					</c:if>
				</c:forEach>
			</td>
		</tr>
		<tr>
			<th width="15%" style="line-height: 80px;height: 80px;">休假原因及依据</th>
			<td colspan="3">${arch.shortContent}</td>
		</tr>
	</table>
</div>	
</body>
</html>