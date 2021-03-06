﻿<%@page import="org.apache.velocity.runtime.directive.Foreach"%>
<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.core.command.QueryFilter"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import="com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.flow.ProcessForm"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Set"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="java.util.ArrayList"%>

<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>

<%
	//for Archives arch
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService) AppUtil
			.getBean("archivesService");
	Archives arch = new Archives();
	if (StringUtils.isNotEmpty(archiveId)
			&& archiveId.indexOf("$") == -1) {
		arch = arService.get(new Long(archiveId));
	}
	request.setAttribute("arch", arch);
	Map<String, List<ProcessForm>> processFormMap = null;
	if (null != arch) {
		Long runId = arch.getProcessRun().getRunId();
		ProcessFormService processFormService = (ProcessFormService) AppUtil
				.getBean("processFormService");
		processFormMap = processFormService.getProcessFormDetail(runId);
	}
	request.setAttribute("processFormMap", processFormMap);

	String defId = request.getParameter("defId");
	request.setAttribute("defId", defId);
	ProDefinitionService proService = (ProDefinitionService) AppUtil
			.getBean("proDefinitionService");
	ProDefinition prodef = new ProDefinition();
	if (null != defId && "" != defId.trim() && !defId.trim().isEmpty()) {
		prodef = proService.get(new Long(defId));
	}
	request.setAttribute("prodef", prodef);

	//for ArrayList<FileAttach> faList
	String fileIds = request.getParameter("fileIds");
	if (!fileIds.trim().isEmpty() && !"_".equals(fileIds)
			&& fileIds.indexOf("$") == -1) {
		FileAttachService fas = (FileAttachService) AppUtil
				.getBean("fileAttachService");
		ArrayList<FileAttach> faList = new ArrayList<FileAttach>();
		for (String fileId : fileIds.split(",")) {
			FileAttach fa = fas.get(new Long(fileId));
			if (fa != null) {
				faList.add(fa);
			}
		}
		request.setAttribute("faList", faList);
	}
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
%>
<h2 align="center" style="padding: 10px; font-size: 20px;">${prodef.name}</h2>
<span style="float: right; padding-right: 20px; padding-bottom: 2px;"><a
	href="<%=request.getContextPath()%>/pages/archivesPrint/jcgsArchivesPrint.jsp?archiveId=${arch.archivesId}&defId=${defId}"
	style="text-decoration: none;" target="_blank">进入打印</a>&nbsp;&nbsp;&nbsp;&nbsp;<a
	href="#" style="text-decoration: none;"
	onclick="openArchivesEdit('${arch.archivesId}','${fileIds}','${defId}','${prodef.name}','${panelId}')">编辑</a></span>
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
     <td colspan="3"  valign="middle"><span style="display:inline-block;width:76px;color: #0168B7;">附件:</span>
        <c:forEach var="file" items="${arch.archivesFiles}">
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}" target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
		<tr align="left">
			<td colspan="3" valign="middle"><span
				style="display: inline-block; width: 80px; color: #0168B7;">备注:</span>${arch.shortContent}</td>
		</tr>
</table>
<input id="issuerId" value='${arch.issuerId}' type="hidden" />