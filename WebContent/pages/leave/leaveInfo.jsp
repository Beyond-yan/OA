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
%>

<h1 align="center" style="padding: 10px; font-size: 20px;">
	${proDef.name}</h1>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
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
		<td colspan="3"><textarea readonly
				style="width: 99%; height: 99%; border: 0px; overflow: hidden;">${arch.shortContent}</textarea></td>
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
		<td colspan="3"><textarea readonly
				style="width: 99%; height: 99%; border: 0px; overflow: hidden;">${arch.unPublicReasons}</textarea></td>
	</tr>
	<c:if test="${arch.handlerUnames!=null}">
	<tr>
		<th width="15%">销假时间</th>
		<td colspan="3"><b>${arch.handlerUnames}</b></td>
	</tr>
	</c:if>
</table>