<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<script type="text/javascript" src="/js/jquery-1.4.2.min.js"></script>
<div class="contentDiv">
	<table class="newsList" cellpadding="0" cellspacing="0" rules="rows">
		<c:forEach var="download" items="${awaitDownload}">
			<tr>
				<td width="26">
					<img src="<%=request.getContextPath() %>/images/btn/archive/archives_detail.png">
				</td>
				<td>
					 <!-- <a href="#" onclick="eval(new ToReceiveArchivesDetailView({archivesId:${download.id},archType:0,download:0}).show())">${download.subject}</a> -->
					<a href="#" onclick="eval(new ToReceiveArchivesDetailView({archivesId:${download.id},archType:0,download:0,runid:${download.runid},dataSource:${download.dataSource},fromSchema:${download.fromSchema}}).show())">${download.subject}</a>
				</td>
				<td width="80" nowrap="nowrap">
					<a><fmt:formatDate value="${download.createDate}" pattern="yyyy-MM-dd" /></a>
				</td>
			</tr>
		</c:forEach>
	</table>
</div>
<div class="moreDiv">
	<span><a href="#" onclick="App.clickTopTab('ArchivesDepReceiveView')">更多...</a></span>
</div>