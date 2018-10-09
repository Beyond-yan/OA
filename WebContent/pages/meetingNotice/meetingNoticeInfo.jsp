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
<%@page import="com.gdssoft.oa.service.meetingNotice.MeetingNoticeService"%>
<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.oa.model.meetingNotice.MeetingNotice"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.service.system.SysConfigService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.model.system.SysConfig"%>
<%
	String noticeId = request.getParameter("noticeId");
	MeetingNoticeService meetingNoticeService = (MeetingNoticeService) AppUtil
			.getBean("meetingNoticeService");
	MeetingNotice meetingNotice = new MeetingNotice();
	if (StringUtils.isNotEmpty(noticeId)) {
		meetingNotice = meetingNoticeService.get(new Long(noticeId));
	}
	request.setAttribute("meetingNotice", meetingNotice);
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
	if (meetingNotice.getCreatorId() != null) {
		issUser = appService.get(meetingNotice.getCreatorId());
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
<span style="float:right;padding-right:7px;padding-bottom:2px;">
	<a href="<%=request.getContextPath()%>/pages/archivesPrint/meetingInfoPrint.jsp?noticeId=${meetingNotice.noticeId}&defId=${defId}" style="text-decoration: none;" target="_blank">打印</a>&nbsp;&nbsp;
	创建日期:<fmt:formatDate value="${meetingNotice.createTime}" pattern="yyyy-MM-dd"/>
</span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
	align="center">
	<tr>
		<th width="15%">会议名称</th>
		<td colspan="5">${meetingNotice.subject}</td>
	</tr>
	<tr>
		<th width="15%">召集单位</th>
		<td colspan="2">${meetingNotice.holdDep}</td>
		<th width="15%">主持人</th>
		<td colspan="2">${meetingNotice.host}</td>
	</tr>
	<tr>
		<th width="15%">会议时间</th>
		<td colspan="2"><fmt:formatDate value="${meetingNotice.meetingDate}"
				pattern="yyyy-MM-dd HH:mm:ss" /></td>
		<th width="15%">会议地点</th>
		<td colspan="2">${meetingNotice.meetingPlace}</td>
	</tr>
	<tr>
		<th width="15%">会议状态</th>
		<td colspan="2">${meetingNotice.meetingState}</td>
		<th width="15%">主办部门</th>
		<td colspan="2">${meetingNotice.mainDep}</td>
	</tr>
	<tr>
		<th width="15%">参会领导</th>
		<td colspan="5">${meetingNotice.attendLeadersName}</td>
	</tr>
	<tr>
		<th width="15%">参会人员</th>
		<td colspan="5">${meetingNotice.attendPersonsName}</td>
	</tr>
	<tr>
		<th width="15%">出发时间</th>
		<td colspan="2"><fmt:formatDate value="${meetingNotice.departureTime}"
				pattern="yyyy-MM-dd HH:mm:ss" /></td>
		<th width="15%">出发地点</th>
		<td colspan="2">${meetingNotice.departurePlace}</td>
	</tr>
	<tr>
		<th width="15%">车辆信息</th>
		<td colspan="5">${meetingNotice.vehicleInfo}</td>
	</tr>
	<tr>
		<th width="15%">驾驶员信息</th>
		<td colspan="5">${meetingNotice.driverInfo}</td>
	</tr>
	<tr>
		<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文
		</td>
		<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top">
			<c:forEach var="doc" items="${meetingNotice.docs}">
				<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
				<c:set var="fileName" value="${doc.fileName}"></c:set>
				<a
					href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc.fileId}"
					target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
	 </c:forEach>
		</td>
	</tr>
</table>