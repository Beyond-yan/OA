<%@page import="java.util.List"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.flow.ProcessRun"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessRunService"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	//显示流程的明细，（为流程的标题及内容）
	//传入piId,即流程实例ID
	
%>

<table class="table-info" cellpadding="0" cellspacing="1" width="96%">
		<tr>
			<th colspan="7"><h2>流程审批信息</h2></th>
		</tr>
		<!--<c:if test="${!empty deptList}">
		<tr>
		    <td colspan="7">
		    	当前办理部门：
			<c:forEach items="${deptList}" var="dept" varStatus="i">
			   ${dept}&nbsp;
			</c:forEach>
			</td>
		</tr>
		</c:if>-->
		<tr>
			<th width="30">序号</th>
			<th width="50">任务名</th>
			<th width="60">办理人</th>
			<th width="50">办理时间</th>
			<th colspan="3">办理意见</th>
		</tr>
		<c:forEach items="${pfList}" var="processForm" varStatus="i">
		<tr>
			<td align="center">${i.count}</td>
			<td>${processForm.activityName}</td>
			<td>${processForm.creatorName}</td>
			<td><fmt:formatDate value="${processForm.createtime}" pattern="yyyy-MM-dd HH:mm"/></td>
			<td colspan="3">
			<%-- <c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp; --%>${processForm.comments}</td>
		</tr>
		</c:forEach>
</table>
<br/>
<br/>