<%@page import="org.apache.velocity.runtime.directive.Foreach"%>
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
	href="<%=request.getContextPath()%>/pages/archivesPrint/sentArchivesPrint.jsp?archiveId=${arch.archivesId}&defId=${defId}"
	style="text-decoration: none;" target="_blank">进入打印</a>&nbsp;&nbsp;&nbsp;&nbsp;<a
	href="#" style="text-decoration: none;"
	onclick="openArchivesEdit('${arch.archivesId}','${fileIds}','${defId}','${prodef.name}','${panelId}')">编辑</a></span>
<table class="table-info" border="1" width="98%" align="center"
	style="border: 1px; solid #000; border-collapse: collapse;">
	<tr align="left" style="height: 35px;">
		<td width="50%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">发文字号:</span>${arch.archivesNo == "0" ? "未生成编号":arch.archivesNo}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">紧急程度:</span>${arch.urgentLevel}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">密级程度:</span>${arch.privacyLevel}</td>
	</tr>
	<tr align="left">
		<td width="50%" rowspan="3" valign="top"><span
			style="display: inline-block; width: 80px; padding-bottom: 5px; color: #0168B7;">签发:</span>
		<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['签发']!=null}">
					<c:forEach items='${processFormMap["签发"]}' var="form"
						varStatus="status">
						<c:if test="${status.last}">
							<div style="paddind-top: 5px; padding-left: 15px;">${form.comments}<br>
								<p
									style="width: 65px; font-size: 16px; padding-top: 30px; padding-left: 80px;">${form.creatorName}</p>
								<p style="width: 120px; padding-top: 20px; padding-left: 80px;">
									<font face="Arial"><fmt:formatDate
											value="${form.createtime}" type="both" pattern="yyyy年MM月dd日" /></font>
								</p>
							</div>
							<br>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['中心领导签发']!=null}">
					<c:forEach items='${processFormMap["中心领导签发"]}' var="form"
						varStatus="status">
						<c:if test="${status.last}">
							<div style="paddind-top: 5px; padding-left: 15px;">${form.comments}<br>
								<p
									style="width: 65px; font-size: 16px; padding-top: 30px; padding-left: 80px;">${form.creatorName}</p>
								<p style="width: 120px; padding-top: 20px; padding-left: 80px;">
									<font face="Arial"><fmt:formatDate
											value="${form.createtime}" type="both" pattern="yyyy年MM月dd日" /></font>
								</p>
							</div>
							<br>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if></td>
		<td width="50%" style="height: 120px;" colspan="2" valign="top"><span
			style="display: inline-block; width: 80px; padding-bottom: 5px; color: #0168B7;">领导会签:</span>
		<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['领导会签']!=null}">
					<c:forEach items='${processFormMap["领导会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['中心领导会签']!=null}">
					<c:forEach items='${processFormMap["中心领导会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['分管领导会签']!=null}">
					<c:forEach items='${processFormMap["分管领导会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if></td>
	</tr>
	<tr align="left">
		<td width="50%" style="height: 120px;" colspan="2" valign="top"><span
			style="display: inline-block; width: 80px; padding-bottom: 5px; color: #0168B7;">会签:</span>
		<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['会签']!=null}">
					<c:forEach items='${processFormMap["会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['部门会签']!=null}">
					<c:forEach items='${processFormMap["部门会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['处室会签(部门发起)']!=null}">
					<c:forEach items='${processFormMap["处室会签(部门发起)"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['处室会签(办公室发起)']!=null}">
					<c:forEach items='${processFormMap["处室会签(办公室发起)"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['处室会签']!=null}">
					<c:forEach items='${processFormMap["处室会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['委属单位处室会签']!=null}">
					<c:forEach items='${processFormMap["委属单位处室会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['交委处室会签']!=null}">
					<c:forEach items='${processFormMap["交委处室会签"]}' var="form">
						<div style="paddind-top: 5px">${form.comments}<br>
						</div>
						<ul style="height: 10px; padding-top: 3px;">
							<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
							<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
							<li style="list-style: none; float: left; width: 120px"><font
								face="Arial"><fmt:formatDate value="${form.createtime}"
										type="both" pattern="yyyy.MM.dd" /></font></li>
						</ul>
						<br>
					</c:forEach>
				</c:if>
			</c:if>
		</td>
	</tr>
	<tr align="left">
		<td width="50%" style="height: 100px;" colspan="2" valign="top"><span
			style="display: inline-block; width: 80px; padding-bottom: 5px; color: #0168B7;">办公室审核:</span>
		<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['办公室审核']!=null}">
					<c:forEach varStatus="status" items='${processFormMap["办公室审核"]}'
						var="form">
						<c:if test="${status.last}">
							<div style="paddind-top: 5px">${form.comments}<br>
							</div>
							<ul style="height: 10px; padding-top: 3px;">
								<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
								<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
								<li style="list-style: none; float: left; width: 120px"><font
									face="Arial"><fmt:formatDate value="${form.createtime}"
											type="both" pattern="yyyy.MM.dd" /></font></li>
							</ul>
							<br>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['中心行政办审核']!=null}">
					<c:forEach varStatus="status" items='${processFormMap["中心行政办审核"]}'
						var="form">
						<c:if test="${status.last}">
							<div style="paddind-top: 5px">${form.comments}<br>
							</div>
							<ul style="height: 10px; padding-top: 3px;">
								<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
								<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
								<li style="list-style: none; float: left; width: 120px"><font
									face="Arial"><fmt:formatDate value="${form.createtime}"
											type="both" pattern="yyyy.MM.dd" /></font></li>
							</ul>
							<br>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['综合办公室审核']!=null}">
					<c:forEach varStatus="status" items='${processFormMap["综合办公室审核"]}'
						var="form">
						<c:if test="${status.last}">
							<div style="paddind-top: 5px">${form.comments}<br>
							</div>
							<ul style="height: 10px; padding-top: 3px;">
								<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
								<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
								<li style="list-style: none; float: left; width: 120px"><font
									face="Arial"><fmt:formatDate value="${form.createtime}"
											type="both" pattern="yyyy.MM.dd" /></font></li>
							</ul>
							<br>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['交委办公室审核']!=null}">
					<c:forEach varStatus="status" items='${processFormMap["交委办公室审核"]}'
						var="form">
						<c:if test="${status.last}">
							<div style="paddind-top: 5px">${form.comments}<br>
							</div>
							<ul style="height: 10px; padding-top: 3px;">
								<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
								<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
								<li style="list-style: none; float: left; width: 120px"><font
									face="Arial"><fmt:formatDate value="${form.createtime}"
											type="both" pattern="yyyy.MM.dd" /></font></li>
							</ul>
							<br>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if>
			<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['办公室核稿']!=null}">
					<c:forEach varStatus="status" items='${processFormMap["办公室核稿"]}'
						var="form">
						<c:if test="${status.last}">
							<div style="paddind-top: 5px">${form.comments}<br>
							</div>
							<ul style="height: 10px; padding-top: 3px;">
								<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
								<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
								<li style="list-style: none; float: left; width: 120px"><font
									face="Arial"><fmt:formatDate value="${form.createtime}"
											type="both" pattern="yyyy.MM.dd" /></font></li>
							</ul>
							<br>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if></td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="top"><span
			style="display: inline-block; width: 80px; color: #0168B7;">主送:</span>${arch.sendTo}</td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="top"><span
			style="display: inline-block; width: 80px; color: #0168B7;">抄送:</span>${arch.ccTo}</td>
	</tr>
	<tr align="left" style="height: 35px;">
		<td width="50%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">拟稿单位:</span>${issUser.department.depName}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">拟稿:</span>${arch.issuer}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">核稿:</span>
		<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['处室初核']!=null}">
					<c:forEach items='${processFormMap["处室初核"]}' var="form"
						varStatus="status">
						<c:if test="${status.last}">${form.creatorName}</c:if>
					</c:forEach>
				</c:if>
				<c:if test="${empty processFormMap['处室初核']}">
					<c:if test="${processFormMap['处室核稿']!=null}">
						<c:forEach items='${processFormMap["处室核稿"]}' var="form"
							varStatus="status">
							<c:if test="${status.last}">${form.creatorName}</c:if>
						</c:forEach>
					</c:if>
				</c:if>
			</c:if></td>
	</tr>
	<tr align="left" style="height: 35px;">
		<td width="50%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">校对:</span></td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">印刷:</span>
		<c:if test="${!empty processFormMap}">
				<c:if test="${processFormMap['生成电子公文']!=null}">
					<c:forEach items='${processFormMap["生成电子公文"]}' var="form"
						varStatus="status">
						<c:if test="${status.last}">
							<span style="paddind-top: 5px">${form.creatorName}</span>
						</c:if>
					</c:forEach>
				</c:if>
			</c:if></td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">份数:</span><font
			face="Arial">${arch.fileCounts}</font></td>
	</tr>
	<tr align="left" style="height: 35px;">
		<td width="50%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">发文单位:</span>${arch.issueDep}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">文种:</span>${arch.archivesType.typeName}</td>
		<td width="25%"><span
			style="display: inline-block; width: 80px; color: #0168B7;">方向:</span>${arch.sources}</td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 80px; color: #0168B7;">是否公开:</span>
			<c:if test="${arch.isPublic == 0}">否</c:if>
			<c:if test="${arch.isPublic == 1}">是</c:if></td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 80px; color: #0168B7;">附件(无文档):</span>${arch.enclosure}
		</td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 76px; color: #0168B7;">附件:</span>
			<c:forEach var="file" items="${arch.archivesFiles}">
				<a
					href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}"
					target="_blank">${file.fileName}</a>
				<button title="编辑" value=" " class="btn-archive-copy div_button"
					onclick="ArchivesUtil.attachEdit(${file.fileId},'${file.fileName}');">编辑</button>&nbsp;&nbsp;&nbsp;&nbsp;
				 </c:forEach></td>
	</tr>
	<tr align="left">
		<td colspan="3" valign="middle"><span
			style="display: inline-block; width: 80px; color: #0168B7;">标题:</span>${arch.subject}</td>
	</tr>
	<c:if test="${arch.shortContent!=null && arch.shortContent!=\"\"}">
		<tr align="left">
			<td colspan="3" valign="middle"><span
				style="display: inline-block; width: 80px; color: #0168B7;">备注:</span>${arch.shortContent}</td>
		</tr>
	</c:if>
</table>