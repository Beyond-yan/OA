<%@ page pageEncoding="UTF-8"
	import="com.gdssoft.oa.service.admin.ConferenceService"%>
<%@ page
	import="com.gdssoft.oa.model.admin.Conference,com.gdssoft.oa.model.admin.ConfPrivilege"%>
<%@ page import="java.util.Set"%>

<%
	ConferenceService cs = (ConferenceService) AppUtil.getBean("conferenceSerivce");
	Conference conference = cs.get(new Long(request.getParameter("confId")));
	request.setAttribute("conference", conference);
	//权限信息
	String viewers = "";
	String updaters = "";
	String summarys = "";

%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<%@page import="com.gdssoft.core.util.AppUtil"%><table class="table-info"
	cellpadding="0" cellspacing="1" width="98%">
	<tr style="height: 25px;">
		<th colspan="2">会议信息</th>
	</tr>
	<tr style="height: 25px;">
		<th style="width: 20%;">会议标题</th>
		<td style="width: 80%;">${ conference.confTopic }</td>
		
	</tr>
	<tr  style="height: 25px;">
	    <th style="width: 20%;">会议室名称</th>
		<td style="width: 80%;">${ conference.roomName }</td>
		
	</tr>
	<tr  style="height: 25px;">
	
		<th style="width: 20%;">会议室</th>
		<td style="width: 80%;">${conference.roomName }</td>
	
	</tr>
	<tr style="height: 25px;">
		<th style="width: 20%;">会议类型</th>
		<td style="width: 30%;">${conference.confProperty }</td>
		
	</tr>

	<tr style="height: 25px;">
		
		<th style="width: 20%;">重要级别</th>
		<c:if test="${conference.importLevel == 1}">
			<td style="width: 30%;">总部会议</td>
		</c:if>
		<c:if test="${conference.importLevel == 2}">
			<td style="width: 30%;">分公司会议</td>
		</c:if>
		<c:if test="${conference.importLevel == 3}">
			<td style="width: 30%;">部门会议</td>
		</c:if>
		<c:if test="${conference.importLevel == 4}">
			<td style="width: 30%;">科室会议</td>
		</c:if>
	</tr>
	<tr style="height: 25px;">
		<th colspan="4">时间和内容信息</th>
	</tr>
	<tr style="height: 25px;">
		<th style="width: 20%;">会议时间</th>
		<td colspan="3"><fmt:formatDate value="${conference.startTime }"
			pattern="yyyy年MM月dd日  HH:mm" /> - <fmt:formatDate
			value="${conference.endTime }" pattern="yyyy年MM月dd日  HH:mm" /></td>
	</tr>
	<tr>
		<th style="width: 20%;">会议内容</th>
		<td colspan="3" style="height: 70px;">${conference.confContent }</td>
	</tr>
	<tr style="height: 25px;">
		<th colspan="4">会议相关人员</th>
	</tr>
	<tr style="height: 25px;">
		<th style="width: 20%;">主持人</th>
		<td style="width: 80%;">${conference.compereName }</td>
		
	</tr>
	<tr style="height: 25px;">
		<th style="width: 20%;">记录人</th>
		<td style="width: 80%;">${conference.recorderName }</td>
	
	</tr>
	<tr style="height: 25px;">
		<th style="width: 20%;">参加人</th>
		<td style="width: 80%;">${conference.attendUsersName }</td>
		
	</tr>
	<tr style="height: 25px;">
		<th colspan="4">审核信息</th>
	</tr>
	<tr style="height: 25px;">
		<th style="width: 20%;">审批人</th>
		<td colspan="3">${conference.checkName }</td>
	</tr>

	<tr style="height: 40px;">
		<th style="width: 20%;">审核备注</th>
		<td colspan="3">${conference.checkReason}</td>
	</tr>

</table>