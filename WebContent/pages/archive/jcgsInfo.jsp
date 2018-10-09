<%@page import="com.gdssoft.oa.model.system.AppRole"%>
<%@page import="java.util.Set"%>
<%@page import="com.gdssoft.core.util.ContextUtil"%>
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
	String archType = request.getParameter("archType");
	request.setAttribute("archType", archType);
	AppUserService appService = (AppUserService) AppUtil
			.getBean("appUserService");
	AppUser issUser = new AppUser();
	if (arch.getIssuerId() != null) {
		issUser = appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser", issUser);
	String panelId = request.getParameter("sentPanelId");
	if (panelId != null) {
		request.setAttribute("panelId", panelId);
	}
	String detailId = request.getParameter("detailId");
	request.setAttribute("detailId", detailId);

	String isGranted = request.getParameter("isGranted");
	request.setAttribute("isGranted", isGranted);
	String isJW = ContextUtil.getCurrentUser().getOwnerSchema();
	request.setAttribute("isJW", isJW);
%>

<h1 align="center" style="padding: 10px; font-size: 20px;">
	${proDef.name}</h1>
<span style="float: right; padding-right: 40px; padding-bottom: 4px;"><a
	href="<%=request.getContextPath()%>/pages/archivesPrint/jcgsArchivesPrint.jsp?archiveId=${arch.archivesId}&defId=${defId}"
	style="text-decoration: none;" target="_blank">打印</a> <!--<c:if test="${isGranted}">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#"
			style="text-decoration: none;"
			onclick="openArchivesDetailEdit('${arch.archivesId}','${fileIds}','${defId}','${proDef.name}','${panelId}','${archType}','${isGranted}')">编辑</a>
	</c:if>--></span>
<table class="table-info" border="1" width="98%" align="center"
	style="border: 1px; solid #000; border-collapse: collapse;">
	<tr align="left" style="height: 35px;">
		<td width="50%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">申请部门:</span>${arch.orgDepName}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">申请人:</span>${arch.issuer}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">缓急:</span>${arch.urgentLevel}</td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 80px; color: #0168B7;">标题:</span>${arch.subject}</td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 76px; color: #0168B7;">正文:</span>
			<c:forEach var="doc" items="${arch.archivesDocs}">
				<c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
				<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
				<a
					href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc.fileAttach.fileId}"
					target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach></td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 76px; color: #0168B7;">附件:</span>
			<c:forEach var="file" items="${arch.archivesFiles}">
				<a
					href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}"
					target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach></td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 80px; color: #0168B7;">备注:</span>${arch.shortContent}</td>
	</tr>
</table>