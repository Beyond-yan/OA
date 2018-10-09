<%@page import="org.apache.velocity.runtime.directive.Foreach"%>
<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.core.command.QueryFilter"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import="com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>

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

	//for ArrayList<FileAttach> faList
	String fileIds = request.getParameter("fileIds");
	if (!fileIds.trim().isEmpty() && !"_".equals(fileIds)) {
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
	
	AppUserService appService = (AppUserService)AppUtil.getBean("appUserService");
	AppUser issUser=new AppUser();
	if(arch.getIssuerId()!=null){
		issUser=appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser",issUser);
%>



<h2 align="center" title="公文标题" style="padding: 10px; font-size: 20px;">港航管理局联合发文处理笺</h2>

<span style="float: right; padding-right: 10px;">创建日期:<fmt:formatDate
		value="${arch.createtime}" pattern="yyyy-MM-dd" /> </span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
	align="center">
	<tr>
		<th width="15%">来文字号</th>
		<td>${arch.archivesNo==0?'未生成编号':arch.archivesNo}</td>
		<th width="15%">紧急程度</th>
		<td>${arch.urgentLevel}</td>
		<th>秘密等级</th>
		<td nowrap="nowrap">${arch.privacyLevel}</td>
	</tr>
	<tr>
		<th width="15%">拟稿单位</th>
		<td>${issUser.department.depName}</td>
		<th width="15%">拟稿人</th>
		<td>${arch.issuer}</td>
		<th width="15%">核稿</th>
		<td>${arch.reviewUserName}</td>
	</tr>
	<tr>
		<%-- <th width="15%">印刷</th>
		<td>${arch.archPrinter}</td>
		<th width="15%">核对</th>
		<td>${arch.archChecker}</td> --%>
		<th width="15%">份数</th>
		<td>${arch.fileCounts}</td>
		<th width="15%">发文单位</th>
		<td>${arch.issueDep}</td>
		<th width="15%">文种</th>
		<td>${arch.archivesType!=null?arch.archivesType.typeName:''}</td>
	</tr>
	<tr>
		<th width="15%">行文方向</th>
		<td>${arch.sources}</td>
		<th width="15%">是否规范</th>
		<td>${arch.isStandard==1?"是":"否"}</td>
		<th width="15%">是否公开</th>
		<td>${arch.isPublic==1?"公开到外网":"不公开"}</td>
	</tr>
	<c:if test="${arch.isPublic!=1}">
		<tr>
			<th width="15%">不公开理由</th>
			<td colspan="5">${arch.unPublicReasons}</td>
		</tr>
	</c:if>
	<tr>
		<th width="15%">主送</th>
		<td colspan="5">${arch.sendTo}</td>
	</tr>
	<tr>
		<th width="15%">抄送</th>
		<td colspan="5">${arch.ccTo}</td>
	</tr>
	<tr>
		<th width="15%">标题</th>
		<td colspan="5">${arch.subject}</td>
	</tr>
	<tr>
		<th width="15%">公文原件</th>
		<td colspan="5"><c:forEach var="doc" items="${arch.archivesDocs}">
				<a
					href="<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}"
					target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		  </c:forEach></td>
	</tr>
	<tr>
		<th width="15%">公文附件</th>
		<td colspan="5"><c:forEach var="fa" items="${faList}">
				<a href="<%=request.getContextPath()%>/attachFiles/${fa.filePath}"
					target="_blank">${fa.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		    </c:forEach></td>
	</tr>
</table>

