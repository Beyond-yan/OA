<%@page import="com.gdssoft.oa.model.archive.ArchivesDocExt"%>
<%@page import="java.util.List"%>
<%@page import="com.gdssoft.core.command.QueryFilter"%>
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
<%@page import="com.gdssoft.oa.service.archive.ArchivesDocExtService"%>
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
	request.setAttribute("defId",defId);
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
	String archType = request.getParameter("archType");
	request.setAttribute("archType", archType);
	AppUserService appService = (AppUserService)AppUtil.getBean("appUserService");
	AppUser issUser=new AppUser();
	if(arch.getIssuerId()!=null){
		issUser=appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser",issUser);
	String panelId = request.getParameter("sentPanelId");
	if(panelId!=null){
	request.setAttribute("panelId",panelId);
	}
	String detailId = request.getParameter("detailId");
	request.setAttribute("detailId",detailId);
	
	String isGranted = request.getParameter("isGranted");
	request.setAttribute("isGranted",isGranted);
	String isJW=ContextUtil.getCurrentUser().getOwnerSchema();
	request.setAttribute("isJW",isJW);
	// 查询文件
	ArchivesDocExtService archivesDocExtService = (ArchivesDocExtService) AppUtil
			.getBean("archivesDocExtService");
	QueryFilter filter = null;
	// 正式文件文本
	filter = new QueryFilter(request);
	filter.addFilter("Q_archives.archivesId_L_EQ", archivesId);
	filter.addFilter("Q_docType_N_EQ", "1");
	List<ArchivesDocExt> list1 = archivesDocExtService.getAll(filter);
	request.setAttribute("docExtList1", list1);
	// 起草说明
	filter = new QueryFilter(request);
	filter.addFilter("Q_archives.archivesId_L_EQ", archivesId);
	filter.addFilter("Q_docType_N_EQ", "2");
	List<ArchivesDocExt> list2 = archivesDocExtService.getAll(filter);
	request.setAttribute("docExtList2", list2);
	// 制定依据
	filter = new QueryFilter(request);
	filter.addFilter("Q_archives.archivesId_L_EQ", archivesId);
	filter.addFilter("Q_docType_N_EQ", "3");
	List<ArchivesDocExt> list3 = archivesDocExtService.getAll(filter);
	request.setAttribute("docExtList3", list3);
%>

<h1 align="center" style="padding: 10px; font-size: 20px;">
	${proDef.name}</h1>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
	align="center">
	<span style="float: right; padding-right: 40px; padding-bottom: 4px;"><a
		href="<%=request.getContextPath()%>/pages/archivesPrint/wfbaArchivesPrint.jsp?archiveId=${arch.archivesId}&defId=${defId}"
		style="text-decoration: none;" target="_blank">模板打印</a> <c:if
			test="${isGranted}">&nbsp;&nbsp;&nbsp;&nbsp;<a
		href="<%=request.getContextPath()%>/pages/archivesPrint/wfbaArchivesPrint2.jsp?archiveId=${arch.archivesId}&defId=${defId}"
		style="text-decoration: none;" target="_blank">直接打印</a>
<!-- 
<a href="#"  style="text-decoration: none;" onclick="openArchivesDetailEdit('${arch.archivesId}','${fileIds}','${defId}','${proDef.name}','${panelId}','${archType}','${isGranted}')">编辑</a>
 -->
		</c:if></span>
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
		<td><fmt:formatDate value="${arch.signDate}" pattern="yyyy-MM-dd" /></td>
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
		<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">正式文件文本
		</td>
		<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top">
			<c:forEach var="doc1" items="${docExtList1}">
				<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
				<c:set var="fileName" value="${doc1.fileAttach.fileName}"></c:set>
				<a
					href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc1.fileAttach.fileId}"
					target="_blank">${doc1.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:forEach>
		</td>
	</tr>
	<tr>
		<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">起草说明
		</td>
		<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top">
			<c:forEach var="doc2" items="${docExtList2}">
				<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
				<c:set var="fileName" value="${doc2.fileAttach.fileName}"></c:set>
				<a
					href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc2.fileAttach.fileId}"
					target="_blank">${doc2.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:forEach>
		</td>
	</tr>
	<tr>
		<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">制定依据
		</td>
		<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top">
			<c:forEach var="doc3" items="${docExtList3}">
				<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
				<c:set var="fileName" value="${doc3.fileAttach.fileName}"></c:set>
				<a
					href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc3.fileAttach.fileId}"
					target="_blank">${doc3.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:forEach>
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