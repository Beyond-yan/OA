<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.meeting.OutMeetingService"%>
<%@page import="com.gdssoft.oa.model.meeting.OutMeeting"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String meetingId = request.getParameter("meetingId");
	OutMeetingService arService = (OutMeetingService) AppUtil.getBean("outMeetingService");
	OutMeeting arch = new OutMeeting();
	if (StringUtils.isNotEmpty(meetingId)) {
		arch = arService.get(new Long(meetingId));
	}
	request.setAttribute("arch", arch);
	request.setAttribute("status", request.getParameter("status"));
	
	String attendUser = "";
	if(arch.getAttendLeaders()==null ||arch.getAttendLeaders().isEmpty()){
		if(arch.getAttendOfficers()!=null && !arch.getAttendOfficers().isEmpty()){
			attendUser = "("+arch.getAttendOfficers()+")";
		}else{
			if(arch.getAttendSubDeps()!=null &&!arch.getAttendSubDeps().isEmpty()){
			attendUser=	"("+arch.getAttendSubDeps()+")";
			}
		}
	}else{
		if(arch.getAttendOfficers()!=null&&!arch.getAttendOfficers().isEmpty()){
			attendUser = arch.getAttendLeaders()+",("+arch.getAttendOfficers()+")";
		}else{
			attendUser = arch.getAttendLeaders();
		}
	}
	request.setAttribute("attendUsers",attendUser );
	
%>

<h3 align="center" title="标题"><font
	style="font: 1.9em 幼圆; color: blue; font-weight: bold;">
	${arch.name} </font> 
	<c:choose>
		<c:when test="${status == 0}">
			<font style="font: 1.9em 幼圆; color: red; font-weight: bold;">
			(待办件) </font>
		</c:when>
		<c:when test="${status == 1}">
			<font style="font: 1.9em 幼圆; color: red; font-weight: bold;">
			(在办件) </font>
		</c:when>
		<c:when test="${status == 2}">
			<font style="font: 1.9em 幼圆; color: red; font-weight: bold;">
			(已结束) </font>
		</c:when>
		<c:when test="${status == 2}">
			<font style="font: 1.9em 幼圆; color: red; font-weight: bold;">
			(已过期) </font>
		</c:when>
	</c:choose>
</h3>

<span style="float: right; padding-right: 10px;"> 创建日期: <fmt:formatDate
	value="${arch.recordTime}" pattern="yyyy-MM-dd HH:mm" /> </span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
	align="center">
	<tr>
		<th width="100px">发起单位</th>
		<td width="100px">${arch.holdDep}</td>
		<th width="100px">主&nbsp;持&nbsp;人</th>
		<td width="100px">${arch.host}</td>
		<th width="100px">登&nbsp;记&nbsp;人</th>
		<td width="100px">${arch.recorder}</td>
	</tr>
	<tr>
		<th>联&nbsp;系&nbsp;人</th>
		<td>${arch.contactPerson}</td>
		<th>时&nbsp;&nbsp;&nbsp;&nbsp;间</th>
		<td><fmt:formatDate value="${arch.holdTime}" pattern="yyyy-MM-dd HH:mm" /></td>
		<th>登记时间</th>
		<td><fmt:formatDate value="${arch.recordTime}" pattern="yyyy-MM-dd HH:mm" /></td>
	</tr>
	<tr>
		<th>电&nbsp;&nbsp;&nbsp;&nbsp;话</th>
		<td>${arch.contactTel}</td>
		<th>地&nbsp;&nbsp;&nbsp;&nbsp;点</th>
		<td>${arch.holdLocation}</td>
		<th>参会者类型</th>
		<c:choose>
		<c:when test="${arch.attendType == 1}">
			<td>领导</td>
		</c:when>
		<c:when test="${arch.attendType == 2}">
			<td>处室</td>
		</c:when>
	</c:choose>
	</tr>
	<tr>
		<th width="15%">参会人员</th>
		<td colspan="5">${attendUsers}</td>
	</tr>
	<tr>
		<th width="15%">备&nbsp;&nbsp;&nbsp;&nbsp;注</th>
		<td colspan="5">${arch.shortDesc}</td>
	</tr>
		<c:if test="${fn:length(arch.docs)>0}">
		<tr>
			<th width="15%" rowspan="${fn:length(arch.docs)+1}">
			公文正文</th>
			<c:forEach var="doc" items="${arch.docs}">
				<tr>
					<td colspan="5"><img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
					<a href="<%=request.getContextPath()%>/attachFiles/${doc.filePath}"
						target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;</td>
				</tr>
			</c:forEach>
		</tr>
	</c:if>
</table>
