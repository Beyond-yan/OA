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
<c:if test="${archType==1}">
	<span style="float: right; padding-right: 10px; padding-bottom: 4px;"><c:if
			test="${isGranted}">
			<a href="#"
				onclick="openDetailWindow('${arch.archivesId}','${proDef.name}','${detailId}','${fileIds}','${defId}','${archType}','${isGranted}');"
				style="text-decoration: none; color: blue">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
		<c:if test="${isJW=='OA'}">
			<a
				href="<%=request.getContextPath()%>/pages/archivesPrint/receiveArchivesPrint1.jsp?archiveId=${arch.archivesId}"
				style="text-decoration: none;" target="_blank">模板打印</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if>
		<c:if test="${isJW!='OA'}">
			<a
				href="<%=request.getContextPath()%>/pages/archivesPrint/receiveArchivesPrint2.jsp?archiveId=${arch.archivesId}&defId=${defId}"
				style="text-decoration: none;" target="_blank">模板打印</a>&nbsp;&nbsp;&nbsp;&nbsp;</c:if><a
		href="<%=request.getContextPath()%>/pages/archivesPrint/archInfoPrint.jsp?archivesId=${arch.archivesId}&defId=${defId}"
		style="text-decoration: none;" target="_blank">直接打印</a>&nbsp;&nbsp;&nbsp;&nbsp;创建日期:<fmt:formatDate
			value="${arch.createtime}" pattern="yyyy-MM-dd" /></span>
	<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
		align="center">
		<tr>
			<th width="15%">收文编号</th>
			<td>${arch.archivesNo == "0" ? "未生成编号":arch.archivesNo}</td>
			<th width="15%">收文日期</th>
			<td><fmt:formatDate value="${arch.issueDate}"
					pattern="yyyy-MM-dd" /></td>
			<th width="15%">来文编号</th>
			<td>${arch.depSignNo}</td>
		</tr>
		<tr>
			<th width="15%">密&nbsp;&nbsp;&nbsp;&nbsp;级</th>
			<td>${arch.privacyLevel}</td>
			<th width="15%">缓&nbsp;&nbsp;&nbsp;&nbsp;急</th>
			<td>${arch.urgentLevel}</td>
			<th width="15%">成文日期</th>
			<td><fmt:formatDate value="${arch.writtenDate}"
					pattern="yyyy-MM-dd" /></td>
		</tr>

		<c:if test="${arch.fileCounts !=null }">
			<tr>
				<th width="15%">份&nbsp;&nbsp;&nbsp;&nbsp;数</th>
				<td>${arch.fileCounts}</td>
				<th width="15%">来文类型</th>
				<td>${arch.archivesType.typeName}</td>
				<th width="15%">限办日期</th>
				<td><fmt:formatDate value="${arch.limitedDate}"
						pattern="yyyy-MM-dd" /></td>
			</tr>
		</c:if>
		<c:if test="${arch.fileCounts ==null }">
			<tr>
				<th width="15%">来文类型</th>
				<td>${arch.archivesType.typeName}</td>
				<th width="15%">限办日期</th>
				<td colspan='3'><fmt:formatDate value="${arch.limitedDate}"
						pattern="yyyy-MM-dd" /></td>
			</tr>
		</c:if>
		<tr>
			<th width="15%">来文单位</th>
			<td colspan="5">${arch.issueDep}</td>
		</tr>
		<tr>
			<th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
			<td colspan="5">${arch.subject}</td>
		</tr>
		<tr>
			<th width="15%">主办部门</th>
			<td colspan="5">${arch.orgDepName}</td>
		</tr>
		<tr>
			<th width="15%">附件(无文档)</th>
			<td colspan="5">${arch.enclosure}</td>
		</tr>
		<tr>
			<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
			<td colspan="5" style="height: 60px; padding-top: 5px;" valign="top">
				<c:forEach var="doc" items="${arch.archivesDocs}">
					<c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
					<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
					<a
						href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc.fileAttach.fileId}"
						target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
			</td>
		</tr>
		<tr>
			<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
			<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top">
				<c:forEach var="file" items="${arch.archivesFiles}">
					<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
					<a
						href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}"
						target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		  </c:forEach>
			</td>
		</tr>
	</table>
</c:if>
<c:if test="${archType==0}">
	<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
		align="center">
		<span style="float: right; padding-right: 40px; padding-bottom: 4px;"><a
			href="<%=request.getContextPath()%>/pages/archivesPrint/sentArchivesPrint.jsp?archiveId=${arch.archivesId}&defId=${defId}"
			style="text-decoration: none;" target="_blank">模板打印</a>&nbsp;&nbsp;&nbsp;&nbsp;<a
		href="<%=request.getContextPath()%>/pages/archivesPrint/archInfoPrint2.jsp?archivesId=${arch.archivesId}&defId=${defId}"
		style="text-decoration: none;" target="_blank">直接打印</a>
		<c:if test="${isGranted}">&nbsp;&nbsp;&nbsp;&nbsp;<a href="#"
					style="text-decoration: none;"
					onclick="openArchivesDetailEdit('${arch.archivesId}','${fileIds}','${defId}','${proDef.name}','${panelId}','${archType}','${isGranted}')">编辑</a>
			</c:if></span>
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
					<c:if test="${arch.isPublic == 1}">否</c:if>
					<c:if test="${arch.isPublic == 2}">否</c:if>
					<c:if test="${arch.isPublic == 3}">是</c:if>
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
</c:if>
<c:if test="${archType==5}">
	<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
		align="center">
		<tr>
			<th width="15%">会议名称</th>
			<td colspan="5">${arch.subject}</td>
		</tr>
		<tr>
			<th width="15%">召集单位</th>
			<td colspan="2">${arch.issueDep}</td>
			<th width="15%">主持人</th>
			<td colspan="2">${arch.urgentLevel}</td>
		</tr>
		<tr>
			<th width="15%">会议时间</th>
			<td colspan="2"><fmt:formatDate value="${arch.limitedDate}"
					pattern="yyyy-MM-dd HH:mm:ss" /></td>
			<th width="15%">会议地点</th>
			<td colspan="2">${arch.shortContent}</td>
		</tr>
		<tr>
			<th width="15%">会议状态</th>
			<td colspan="2">${arch.sources}</td>
			<th width="15%"></th>
			<td colspan="2"></td>
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
	</table>
</c:if>
<c:if test="${archType==7}">
	<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
		align="center">
		<tr>
			<th width="20%">议题编号</th>
			<td colspan="5">${arch.urgentLevel}</td>
		</tr>
		<tr>
			<th width="20%">提案名称</th>
			<td colspan="5">${arch.subject}</td>
		</tr>
		<tr>
			<th width="20%">提案背景以及主要内容</th>
			<td colspan="5">${arch.shortContent}</td>
		</tr>
		<tr>
			<th width="20%">提案建议事项</th>
			<td colspan="5">${arch.enclosure}</td>
		</tr>
		<tr>
			<th width="20%">建议列席处室</th>
			<td colspan="5">${arch.handlerUnames}</td>
		</tr>
		<tr>
			<th width="20%">提案处室（单位）</th>
			<td colspan="5">${arch.issueDep}</td>
		</tr>
		<tr>
			<th width="20%">各处室是否达成一致意见</th>
			<td colspan="5">${arch.isShared == '1' ? '是' : '否'}</td>
		</tr>
		<c:if test="${arch.isShared == '0'}">
		<tr>
			<th width="20%">备注</th>
			<td colspan="5">${arch.unPublicReasons}</td>
		</tr>
		</c:if>
		<tr>
		<th width="20%">议题期数</th>
			<td colspan="5">${arch.privacyLevel}</td>
		</tr>
		<tr>
			<th width="20%" style="height: 80px; padding-top: 5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文
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
				 <c:if
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
	</table>
</c:if>