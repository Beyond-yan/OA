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

<script type="text/javascript">
<!--
	/* $(document).ready(function(){
		if(!App){
			alert(1);	
		}
	}); */
	
//-->
</script>
<script type="text/javascript" src="/js/jquery-1.4.2.min.js"></script>

<div class="contentDiv">
<table class="newsList" cellpadding="0" cellspacing="0" rules="rows">
	<c:forEach var="task" items="${taskList}">
		<c:set var="taskNam" value="${task.taskName}"/>
		<%
			String s = pageContext.getAttribute("taskNam").toString().replace('"','”');
			//out.println("11:"+s);
			request.setAttribute("s",s);
		%>
		<tr>
			<td width="26">
			<c:choose>
				  <c:when test="${task.archivesType==0}">
				    <img src="<%=request.getContextPath()%>/images/menus/flow/task.png" /></td>
				  </c:when>
				 <c:when test="${task.archivesType==1}">
				    <img src="<%=request.getContextPath()%>/images/menus/flow/flowEnd.png" /></td>
				 </c:when>
				 <c:otherwise>
				    <img src="<%=request.getContextPath()%>/images/menus/flow/task.png" /></td>
				 </c:otherwise>
			</c:choose>
			<td>
			<c:choose>
					<c:when test="${task.type==0}"><a href="#" onclick="App.MyDesktopClickTopTab('ProcessNextForm',{taskId:${task.taskId},activityName:'${task.activityName}'})">${task.taskName}</a></c:when>
					<c:otherwise><a href="#" onclick="javascript:App.clickTopTab('${task.link}')">${s}</a></c:otherwise>
				</c:choose>
			</td>
			<td width="80" nowrap="nowrap">
				<c:choose>
					<c:when test="${not empty task.assignee}">${task.assignee}</c:when>
					<c:otherwise><font color='red'>暂无执行人</font></c:otherwise>
				</c:choose>
			</td>
			<td width="80" nowrap="nowrap"><a><fmt:formatDate
				value="${task.createTime}" pattern="yyyy-MM-dd" /></a></td>
		</tr>
	</c:forEach>
</table>
</div>

<div class="moreDiv"><span><a href="#"
	onclick="App.clickTopTab('MyTaskView')">更多...</a></span></div>