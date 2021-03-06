<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.admin.CarApplyService"%>
<%@page import="com.gdssoft.oa.model.admin.CarApply"%>
<%@page import="org.apache.commons.lang.StringUtils"%>

<%
	String applyId=request.getParameter("acceptId");
	System.out.print(applyId);
	CarApplyService caService = (CarApplyService) AppUtil
			.getBean("carApplyService");
	CarApply carApply = new CarApply();
	if (StringUtils.isNotEmpty(applyId)) {
		carApply = caService.get(new Long(applyId));
	}
	request.setAttribute("carApply", carApply);
%>


<h1 align="center" style="padding: 10px; font-size: 20px;">车辆使用申请</h1>

<span style="float: right; padding-right: 10px;">申请日期:<fmt:formatDate
	value="${carApply.createDate}" pattern="yyyy-MM-dd" /></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%"
	align="center">

	<tr>
		<th width="15%">用车部门</th>
		<td>${carApply.department}</td>
		<th width="15%">用车人</th>
		<td>${carApply.userFullname}</td>
	</tr>
	<%-- <tr>
		<th width="15%">是否需要司机</th>
		<td><c:choose>
			<c:when test="${carApply.ishavecardriver == 1}">
		需要
		</c:when>
			<c:when test="${carApply.ishavecardriver == 2}">
		不需要
		</c:when>
		</c:choose></td>
		<th width="15%">是否长期有效</th>
		<td><c:choose>
			<c:when test="${carApply.iseffective == 1}">
		不是
		</c:when>
			<c:when test="${carApply.iseffective == 2}">
		是
		</c:when>
		</c:choose></td>
	</tr> --%>

     <tr>
		<th width="15%">用车人数</th>
		<td colspan="3">${carApply.peopleAmount}</td>
	</tr>
	<tr>
		<th width="15%">原因</th>
		<td colspan="3">${carApply.reason}</td>
	</tr>
<%-- 	<c:choose>
		<c:when test="${carApply.iseffective == 1}">
			<tr>
				<th width="15%">出发时间</th>
				<td><fmt:formatDate value="${carApply.startTime}"
					pattern="yyyy-MM-dd HH:mm" /></td>
				<th width="15%">返回时间</th>
				<td><fmt:formatDate value="${carApply.endTime}"
					pattern="yyyy-MM-dd HH:mm" /></td>
			</tr>
		</c:when>
		<c:when test="${carApply.iseffective == 2}"> --%>
			<tr>
				<th width="15%">用车日期</th>
				<td><fmt:formatDate value="${carApply.startTime}"
					pattern="yyyy-MM-dd" /></td>
				<th width="15%">结束日期</th>
				<td><fmt:formatDate value="${carApply.endTime}"
					pattern="yyyy-MM-dd" /></td>
			</tr>
				<%-- <tr>
				<th width="15%">出发时间</th>
				<td>${carApply.onDutyTime}</td>
				<th width="15%">返回时间</th>
				<td>${carApply.offDutyTime}</td>
			</tr> --%>
<%-- 		</c:when>
	</c:choose> --%>

	<tr>
		<th width="15%">到达地点</th>
		<td colspan="3">${carApply.toSite}</td>
	</tr>
<tr>
		<th width="15%">审批状态</th>
		<td colspan="3"><c:choose>
			<c:when test="${carApply.approvalStatus == 1}">
		新申请
		</c:when>
			<c:when test="${carApply.approvalStatus == 2}">
		审批之中
		</c:when>
		<c:when test="${carApply.approvalStatus == 3}">
		批准用车
		</c:when>
		<c:when test="${carApply.approvalStatus == 4}">
		用车完成
		</c:when>
		<c:when test="${carApply.approvalStatus == 5}">
		取消申请
		</c:when>
		</c:choose></td>
	</tr>
	<%-- <tr>
		<th width="15%">承载人数</th>
		<td colspan="4">${carApply.peopleAmount}</td>
	</tr> --%>
	<tr>
		<th width="15%">备注</th>
		<td colspan="3">${carApply.notes}</td>
	</tr>

</table>
