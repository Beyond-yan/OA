<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<style>
<!--

.contentDiv {
	padding-left: 3px;
	padding-right: 3px;
	background: white;
	border: none;
}

.newsList {
	border: 0 dashed #c7e3fa;
	width: 100%;
	size: 12px;
}
.newsList tr {
	border: 0 dashed #c7e3fa;
}

.newsList tr td {
	height: 28px;
	border: none;
	border-buttom: 1px dashed #c7e3fa;
	border-top: 1px dashed #c7e3fa;
	color: #00f;
	font-size:12px;
}

.newsList tr td a {
	text-decoration: none;
	overflow: hidden;
	/* color: blue; */
	color:#3F4850;
}

.newsList tr td a:hover {
	color: #CF2219;
}

.newsList tr td img {
	border: 0;
	width: 16px;
	height: 16px;
	position: relative;
	top: 3px;
}

-->
</style>

<div class="contentDiv">
<table class="newsList" cellpadding="0" cellspacing="0" rules="rows">
	<tr>
		<td width="80" nowrap="nowrap">当前办理部门</td>
		<td width="80" nowrap="nowrap">当前办理人员</td>
	</tr>
	<c:forEach var="task" items="${taskList}">
		<tr>
			<td width="80" nowrap="nowrap">${task.depname}</td>
			<td width="80" nowrap="nowrap">${task.assigneeName}</td>
		</tr>
	</c:forEach>
</table>
</div>