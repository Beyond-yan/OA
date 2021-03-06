<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import=" com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="java.util.List"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>

<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.core.util.ContextUtil"%>


<%
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService) AppUtil
			.getBean("archivesService");
	Archives arch = new Archives();
	Archives parArch = new Archives();
	if (StringUtils.isNotEmpty(archiveId)
			&& archiveId.indexOf("$") == -1) {
		arch = arService.get(new Long(archiveId));
		Long parentId = arch.getParentArchId();
		if (parentId != null) {
			parArch = arService.get(parentId);
		} else {
			parArch = arch;
		}
	}

	request.setAttribute("arch", arch);

	String defId = request.getParameter("defId");
	request.setAttribute("defId", defId);
	ProDefinitionService proService = (ProDefinitionService) AppUtil
			.getBean("proDefinitionService");
	ProDefinition prodef = new ProDefinition();
	if (null != defId && "" != defId.trim() && !defId.trim().isEmpty()) {
		prodef = proService.get(new Long(defId));
	}
	request.setAttribute("prodef", prodef);

	String fileIds = request.getParameter("fileIds");
	request.setAttribute("fileIds", fileIds);
	if (!fileIds.trim().isEmpty() && fileIds != ""
			&& !"_".equals(fileIds) && !"0".equals(fileIds)
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

	String detailId = request.getParameter("detailId");
	request.setAttribute("detailId", detailId);
	String isJW = ContextUtil.getCurrentUser().getOwnerSchema();
	request.setAttribute("isJW", isJW);
%>
<h1 align="center" style="padding: 10px; font-size: 20px;">${prodef.name}</h1>
<div class="x-panel-body x-panel-body-noheader x-panel-body-noborder"
	id="ext-gen221" style="overflow: auto; height: auto; width: 698px;">
	<span style="float: right; padding-right: 7px; padding-bottom: 2px;"><!-- <a
		href="#"
		onclick="openWindow('${arch.archivesId}','${prodef.name}','${detailId}','${fileIds}','${defId}');"
		style="text-decoration: none; color: blue">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<c:if
			test="${isJW=='OA'}">
			<a
				href="<%=request.getContextPath()%>/pages/archivesPrint/receiveArchivesPrint1.jsp?archiveId=${arch.archivesId}"
				style="text-decoration: none;" target="_blank">模板打印</a>
		</c:if>
		<c:if test="${isJW!='OA'}">
			<a
				href="<%=request.getContextPath()%>/pages/archivesPrint/receiveArchivesPrint2.jsp?archiveId=${arch.archivesId}&defId=${defId}"
				style="text-decoration: none;" target="_blank">模板打印</a>
		</c:if>&nbsp;&nbsp;&nbsp;&nbsp;<a
		href="<%=request.getContextPath()%>/pages/archivesPrint/archInfoPrint.jsp?archivesId=${arch.archivesId}&defId=${defId}"
		style="text-decoration: none;" target="_blank">直接打印</a>&nbsp;&nbsp;&nbsp;&nbsp; -->创建日期:<fmt:formatDate
			value="${arch.createtime}" pattern="yyyy-MM-dd" /></span>
	<table class="leave-table-info" cellpadding="0" cellspacing="1" width="98%"
		align="center">
		<tr>
			<th width="15%">部门</th>
			<td width="35%"><b>${arch.issueDep}</b></td>
			<th width="15%">职务</th>
			<td width="35%"><b>${arch.typeName}</b></td>
		</tr>
		<tr>
			<th width="15%">申请人</th>
			<td><b>${arch.handlerUids}</b></td>
			<th width="15%">参加工作时间</th>
			<td><b>${arch.ccTo}</b></td>
		</tr>
		<tr>
			<th width="15%">休假类别</th>
			<td colspan="3"><b>${arch.privacyLevel}</b></td>
		</tr>
		<tr>
			<th width="15%">标题</th>
			<td colspan="3"><b>${arch.subject}</b></td>
		</tr>
		<tr>
			<th width="15%" class="more">请假原因及依据</th>
			<td colspan="3"><textarea readonly style="width:99%;height:99%;border:0px;overflow:hidden;">${arch.shortContent}</textarea></td>
		</tr>
		<tr>
			<th width="15%">请假时间</th>
			<td colspan="3"><b>${arch.archivesNo}</b></td>
		</tr>
		<tr>
			<th width="15%">请假天数</th>
			<td colspan="3"><b>${arch.sendTo}</b></td>
		</tr>
		<tr>
			<th width="15%" height="200" class="more">备注</th>
			<td colspan="3"><textarea readonly style="width:99%;height:99%;border:0px;overflow:hidden;">${arch.unPublicReasons}</textarea></td>
		</tr>
		<c:if test="${arch.handlerUnames!=null}">
		<tr>
			<th width="15%">销假时间</th>
			<td colspan="3"><b>${arch.handlerUnames}</b></td>
		</tr>
		</c:if>
	</table>
</div>
<input id="runId" value='${arch.processRun.runId}' type="hidden" />
<input id="reviewUser" value='${arch.reviewUser}' type="hidden" />
