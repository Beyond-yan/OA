<%@page import="org.apache.velocity.runtime.directive.Foreach"%>
<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.core.command.QueryFilter"%>
<%@page import="com.gdssoft.oa.service.meeting.OutMeetingService"%>
<%@page import="com.gdssoft.oa.model.meeting.OutMeeting"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import="com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.List"%>

<%
	String meetingId = request.getParameter("meetingId");

	OutMeetingService service = (OutMeetingService) AppUtil
			.getBean("outMeetingService");
	OutMeeting meeting = new OutMeeting();
	if (StringUtils.isNotEmpty(meetingId)) {
		meeting = service.get(new Long(meetingId));
		System.out.println(meeting.getDocs().size());
	}

	request.setAttribute("meeting", meeting);
	request.setAttribute("docs_size", meeting.getDocs().size());
%>


<h2 align="center" title="标题" style="padding: 10px; font-size: 20px;">外来会议处理笺</h2>

<span style="float: right; padding-right: 10px;">创建日期:<fmt:formatDate
		value="${meeting.recordTime}" pattern="yyyy-MM-dd" />
</span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
	align="center">
	<tr>
		<th width="15%">会议名称</th>
		<td colspan="5">${meeting.name}</td>
	</tr>
	<tr>
		<th width="15%">发起单位</th>
		<td>${meeting.holdDep}</td>
		<th width="15%">主&nbsp;持&nbsp;人</th>
		<td>${meeting.host}</td>
		<th width="15%">登&nbsp;记&nbsp;人</th>
		<td>${meeting.recorder}</td>
	</tr>
	<tr>
		<th width="15%">联&nbsp;系&nbsp;人</th>
		<td>${meeting.contactPerson}</td>
		<th width="15%">时&nbsp;&nbsp;&nbsp;&nbsp;间</th>
		<td><fmt:formatDate value="${meeting.holdTime}"
				pattern="yyyy-MM-dd HH:mm" /></td>
		<th width="15%">记录时间</th>
		<td><fmt:formatDate value="${meeting.recordTime}"
				pattern="yyyy-MM-dd" /></td>
	</tr>
	<tr>
		<th width="15%">电&nbsp;&nbsp;&nbsp;&nbsp;话</th>
		<td>${meeting.contactTel}</td>
		<th width="15%">地&nbsp;&nbsp;&nbsp;&nbsp;点</th>
		<td>${meeting.holdLocation}</td>
		<th width="15%">参会者类型</th>
		<td>${(meeting.attendType==1?"领导":"处室")}</td>
	</tr>
	<tr>
		<th width="15%">参会领导</th>
		<td colspan="5">${meeting.attendLeaders}</td>
	</tr>
	<tr>
		<th width="15%">处室人员</th>
		<td colspan="5">${meeting.attendOfficers}</td>
	</tr>
	<tr>
		<th width="15%">备&nbsp;&nbsp;&nbsp;&nbsp;注</th>
		<td colspan="5">${meeting.shortDesc}</td>
	</tr>
	<c:if test="${docs_size > 0}">
	<tr>
		<th width="15%" style="height: 80px; padding-top: 5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
		<td colspan="5" style="height: 80px; padding-top: 5px;" valign="top"><c:forEach
				var="doc" items="${meeting.docs}">
				<a href="<%=request.getContextPath()%>/attachFiles/${doc.filePath}"
					target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		  </c:forEach></td>
	</tr>
	</c:if>
	<tr>
		<th width="15%">处室领导</th>
		<td colspan="5">${meeting.attendOfficeLeaders}</td>
	</tr>
</table>

