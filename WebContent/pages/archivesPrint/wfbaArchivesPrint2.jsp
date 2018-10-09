<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.flow.ProcessForm"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="java.util.Map"%>
<%
	String basePath = request.getContextPath();
	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	String currentDate = formatter.format(new Date());
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	Archives parArch=new Archives();
	if(StringUtils.isNotEmpty(archiveId)&&archiveId.indexOf("$")==-1){
		arch = arService.get(new Long(archiveId));
		Long parentId=arch.getParentArchId();
		if(parentId!=null){
	parArch=arService.get(parentId);
		}else{
	parArch=arch;
		}
	}
	request.setAttribute("arch",arch);
	String defId = request.getParameter("defId");
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
	Map<String,List<ProcessForm>> processFormMap = null;
	if(null != arch){
		Long runId = arch.getProcessRun().getRunId();
		ProcessFormService processFormService = (ProcessFormService)AppUtil.getBean("processFormService");
		processFormMap  = processFormService.getProcessFormDetail(runId);
	}
	request.setAttribute("processFormMap",processFormMap);
	AppUserService appService = (AppUserService)AppUtil.getBean("appUserService");
	AppUser issUser=new AppUser();
	if(arch.getIssuerId()!=null){
		issUser=appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser",issUser);
	String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent));
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>发文打印</title>
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
<script language="javascript"
	src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script>
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
	function stamp() {
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
</style>
<style>
body, td, th {
	font-size: 12px;
	font-family: "黑体";
}

.NOPRINT {
	font-family: "宋体";
	font-size: 12px;
}

#printBody table {
	border: 2px solid #000000;
}

#printBody td {
	border: 1.5px solid #000000;
	padding-top: 5px;
	padding-left: 10px;
	font-size: 14px;
}
</style>
</head>
<body>
	<OBJECT id=WebBrowser
		classid=CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 height=0 width=0
		VIEWASTEXT></OBJECT>
	<div align="right" class="Noprint" style="padding-right: 20px;">
		<c:if test="${browser=='Chrome'}">
			<a href="#" onclick="stamp()" style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint1.gif" width="30px"
				height="30px" align="middle" />打印</a>
		</c:if>
		<c:if test="${browser=='IE'}">
			<a href="#" onclick="document.all.WebBrowser.ExecWB(6,1)"
				style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint1.gif" width="30px"
				height="30px" align="middle" />打印</a>
			<a href="#" onclick="document.all.WebBrowser.ExecWB(8,1)"
				style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint2.gif" width="30px"
				height="30px" align="middle" />页面设置</a>
			<a href="#" onclick="document.all.WebBrowser.ExecWB(7,1)"
				style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint3.gif" width="30px"
				height="30px" align="middle" />打印预览</a>
		</c:if>
	</div>
	<div id="print">
		<h1 align="center" style="padding: 10px; font-size: 24px;">${proDef.name}</h1>
		<center>
			<div id="printBody">
				<table class="table-info" width="98%" align="center" border="1"
		style="border: 1px; solid #000; border-collapse: collapse;">
					<tr>
						<th width="15%">报送部门</th>
						<td>${arch.orgDepName}</td>
						<th width="15%">拟&nbsp;稿&nbsp;人</th>
						<td>${arch.issuer}</td>
						<th>文件状态</th>
						<td nowrap="nowrap">${arch.shortContent}</td>
					</tr>
					<tr>
						<th width="15%">文件类型</th>
						<td>${arch.sources}</td>
						<th width="15%">联&nbsp;系&nbsp;人</th>
						<td>${arch.sendTo}</td>
						<th width="15%">联系电话</th>
						<td nowrap="nowrap">${arch.ccTo}</td>
					</tr>
					<tr>
						<th width="15%">文件名称</th>
						<td>${arch.issueDep}</td>
						<th width="15%">文件文号</th>
						<td>${arch.archivesNo}</td>
						<th width="15%">移交审查日期</th>
						<td><fmt:formatDate value="${arch.signDate}"
								pattern="yyyy-MM-dd" /></td>
					</tr>
					<tr>
						<th width="15%">公布日期</th>
						<td><fmt:formatDate value="${arch.issueDate}"
								pattern="yyyy-MM-dd" /></td>
						<th width="15%">施行日期</th>
						<td><fmt:formatDate value="${arch.writtenDate}"
								pattern="yyyy-MM-dd" /></td>
						<th width="15%">有效期至</th>
						<td><fmt:formatDate value="${arch.limitedDate}"
								pattern="yyyy-MM-dd" /></td>
					</tr>
					<tr>
						<th width="15%">材料类型</th>
						<td colspan="5"><c:if test="${arch.privacyLevel == '1'}">送审稿</c:if>
							<c:if test="${arch.privacyLevel == '2'}">已印发文件</c:if></td>
					</tr>
					<tr>
						<th width="15%">是否公开</th>
						<td colspan="5"><c:if test="${arch.processRun.runStatus==2 }">
								<c:if test="${arch.isPublic == 0}">否</c:if>
								<c:if test="${arch.isPublic == 1}">是</c:if>
							</c:if></td>
					</tr>
					<tr>
						<th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
						<td colspan="5">${arch.subject}</td>
					</tr>
					<tr>
						<th width="15%" style="height: 80px; padding-top: 5px;"
							valign="top">正式文件文本
						</td>
						<td colspan="5" style="height: 80px; padding-top: 5px;"
							valign="top"><c:forEach var="doc1" items="${docExtList1}">
								<img
									src="<%=request.getContextPath()%>/images/flag/attachment.png" />
								<c:set var="fileName" value="${doc1.fileAttach.fileName}"></c:set>
								<a
									href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc1.fileAttach.fileId}"
									target="_blank">${doc1.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:forEach></td>
					</tr>
					<tr>
						<th width="15%" style="height: 80px; padding-top: 5px;"
							valign="top">起草说明
						</td>
						<td colspan="5" style="height: 80px; padding-top: 5px;"
							valign="top"><c:forEach var="doc2" items="${docExtList2}">
								<img
									src="<%=request.getContextPath()%>/images/flag/attachment.png" />
								<c:set var="fileName" value="${doc2.fileAttach.fileName}"></c:set>
								<a
									href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc2.fileAttach.fileId}"
									target="_blank">${doc2.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:forEach></td>
					</tr>
					<tr>
						<th width="15%" style="height: 80px; padding-top: 5px;"
							valign="top">制定依据
						</td>
						<td colspan="5" style="height: 80px; padding-top: 5px;"
							valign="top"><c:forEach var="doc3" items="${docExtList3}">
								<img
									src="<%=request.getContextPath()%>/images/flag/attachment.png" />
								<c:set var="fileName" value="${doc3.fileAttach.fileName}"></c:set>
								<a
									href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc3.fileAttach.fileId}"
									target="_blank">${doc3.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:forEach></td>
					</tr>
					<c:if test="${arch.isPublic == 0}">
						<tr>
							<th width="15%">不公开原因</th>
							<td colspan="5">${arch.unPublicReasons}</td>
						</tr>
					</c:if>
					<tr>
						<th width="15%">审查备案号</th>
						<td colspan="5">${arch.examineRecordNumber}</td>
					</tr>
				</table>
			</div>
		</center>
	</div>
</body>
</html>