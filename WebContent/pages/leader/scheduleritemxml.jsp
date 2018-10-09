<%@ page language="java" contentType="text/xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<data> 
<c:forEach items="${leaderActivitiesList}" var="leaderActivitiesList">
<event id='${leaderActivitiesList.activeId}' sId='${leaderActivitiesList.activeId}' name = '${leaderActivitiesList.activeName}' start_date='${leaderActivitiesList.sgDate}' end_date='${leaderActivitiesList.sgDate}' text='${leaderActivitiesList.appUser.fullname}' description='222' priority='1' timetype='${leaderActivitiesList.timeType}'/>
</c:forEach>
</data> 