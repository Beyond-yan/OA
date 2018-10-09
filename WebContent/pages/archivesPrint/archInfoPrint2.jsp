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
		<a href="#" onclick="document.all.WebBrowser.ExecWB(6,1)"
			style="text-decoration: none;"><img
			src="../../images/btn/print/Archprint1.gif" width="30px"
			height="30px" align="middle" />打印</a> <a href="#"
			onclick="document.all.WebBrowser.ExecWB(8,1)"
			style="text-decoration: none;"><img
			src="../../images/btn/print/Archprint2.gif" width="30px"
			height="30px" align="middle" />页面设置</a> <a href="#"
			onclick="document.all.WebBrowser.ExecWB(7,1)"
			style="text-decoration: none;"><img
			src="../../images/btn/print/Archprint3.gif" width="30px"
			height="30px" align="middle" />打印预览</a>
	</div>
	<h1 align="center" style="padding: 10px; font-size: 20px;">
		${proDef.name}</h1>
	<span style="float: right; padding-right: 10px; padding-bottom: 4px;">创建日期:<fmt:formatDate
			value="${arch.createtime}" pattern="yyyy-MM-dd" /></span>
	<table class="table-info" width="98%" align="center" border="1"
		style="border: 1px; solid #000; border-collapse: collapse;">
		<tr>
			<th width="15%">发文字号</th>
			<td>${arch.archivesNo == "0" ? "未生成编号":arch.archivesNo}</td>
			<th width="15%">紧急程度</th>
			<td>${arch.urgentLevel}</td>
			<th>秘密等级</th>
			<td nowrap="nowrap">${arch.privacyLevel}</td>
		</tr>
		<tr>
			<th width="15%">拟稿单位</th>
			<td>${issUser.department.depName}</td>
			<th width="15%">拟&nbsp;稿&nbsp;人</th>
			<td>${arch.issuer}</td>
			<th width="15%">核&nbsp;&nbsp;&nbsp;&nbsp;稿</th>
			<td nowrap="nowrap">${arch.reviewUserName}</td>
		</tr>
		<tr>
			<th width="15%">发文单位</th>
			<td>${arch.issueDep}</td>
			<th width="15%">文&nbsp;&nbsp;&nbsp;&nbsp;种</th>
			<td>${arch.archivesType.typeName}</td>
			<th width="15%">行文方向</th>
			<td>${arch.sources}</td>
		</tr>
		<tr>
			<th width="15%">规范性文件</th>
			<td>${arch.isStandard == 0 ?"否":"是"}</td>
			<th width="15%">是否公开</th>
			<td><c:if test="${arch.processRun.runStatus==2 }">
					<c:if test="${arch.isPublic == 0}">否</c:if>
					<c:if test="${arch.isPublic == 1}">是</c:if>
				</c:if></td>
			<th width="15%">份&nbsp;&nbsp;&nbsp;&nbsp;数</th>
			<td>${arch.fileCounts}</td>
		</tr>
		<tr>
			<th width="15%">主&nbsp;&nbsp;&nbsp;&nbsp;送</th>
			<td colspan="5">${arch.sendTo}</td>
		</tr>
		<tr>
			<th width="15%">抄&nbsp;&nbsp;&nbsp;&nbsp;送</th>
			<td colspan="5">${arch.ccTo}</td>
		</tr>
		<tr>
			<th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
			<td colspan="5">${arch.subject}</td>
		</tr>
		<tr>
			<th width="15%">附件(无文档)</th>
			<td colspan="5">${arch.enclosure}</td>
		</tr>
		<tr>
			<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文

			
			</td>
			<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top">
				<c:forEach var="doc" items="${arch.archivesDocs}">
					<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
					<c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
					<a
						href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc.fileAttach.fileId}"
						target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:forEach>
			</td>
		</tr>
		<tr>
			<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
			<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top">
				<c:if test='${empty arch.archivesFiles}'>${arch.enclosure}</c:if> <c:if
					test="${!empty arch.archivesFiles}">
					<c:forEach var="file" items="${arch.archivesFiles}">
						<img
							src="<%=request.getContextPath()%>/images/flag/attachment.png" />
						<a
							href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}"
							target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		  </c:forEach>
				</c:if>
			</td>
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
	<table class="table-info" border="1" align="center"
		style="border: 1px; solid #000; border-collapse: collapse;"
		width="98%">
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
				<td><fmt:formatDate value="${processForm.createtime}"
						pattern="yyyy-MM-dd HH:mm" /></td>
				<td colspan="3"><c:out
						value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}</td>
			</tr>
		</c:forEach>
	</table>
</body>
</html>