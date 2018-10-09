<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<div class="contentDiv">
<table class="newsList" cellpadding="0" cellspacing="0" rules="rows">
	<c:forEach var="partyInfo" items="${partyInfoList}">
		<tr>
			<td width="26"><img
				src="<%=request.getContextPath()%>/images/menus/flow/flowPr.png" /></td>
			<td align="left"><a href="#"
				onclick="App.MyDesktopClickTopTab('PartyInfoDetail',${partyInfo.noticeId})">${partyInfo.noticeTitle}</a></td>
			<td width="80" nowrap="nowrap"><a>${partyInfo.postName}</a></td>
			<td width="80" nowrap="nowrap"><a><fmt:formatDate
				value="${partyInfo.createtime}" pattern="yyyy-MM-dd" /></a></td>
		</tr>
	</c:forEach>
</table>
</div>
<div class="moreDiv"><span><a href="#"
	onclick="App.clickTopTab('PartyInfoView')">更多...</a></span></div>