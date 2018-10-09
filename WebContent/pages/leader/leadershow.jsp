<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>领导日程</title>
<script type="text/javascript">
function back(){
	var url = "/leader/leaderActive.html";		
	if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)){  
	      var referLink = document.createElement('a');  
	      referLink.href = url;  
	      if($(".ui-dialog").size()>0){
	    	  //如果点击事件发生在弹出层上，则弹出层下面的click事件不会被触发，需要将a元素添加至弹出层上面
	    	  $(".ui-dialog").append(referLink);
	      }else{
	    	  document.body.appendChild(referLink);  
	      }
	      referLink.click(); 
	 } 
	else {  
		window.location.href = url;  
	} 
}
function savepublis(){
  $("#saveAction").submit();	
   return false;
}
</script>
<style>
body,button,input,select,textarea{font:12px/1.5 arial,\5b8b\4f53;color:#404040;}
</style>
</head>
<body>
<form action="<c:url value="/leaderActivities/save.do"/>"  id="saveAction" method="post" >
	<table  cellpadding="5" bordercolor="#cecece" width="100%" cellspacing="1" border="1px" style="border-collapse: collapse;">
		<tr style="line-height:30px">
			<td width="20%" align="center">领导姓名:</td>
			<td style="padding-left:14px;"><input type="text"  name="leaderActivities.appUser.fullname" value="${leaderActivities.appUser.fullname}"/></td>
		</tr>
			<tr style="line-height:30px">
			<td width="20%" align="center">开始日期:</td>
			<td style="padding-left:14px;"><input type="text"  name="leaderActivities.sgDate" value="${leaderActivities.sgDate}"/></td>
		</tr>
		<tr style="line-height:30px">
			<td width="20%" align="center">持续天数:</td>
			<td style="padding-left:14px;">
			<input  width="30%" type="text" name="leaderActivities.timeNumber" value="${leaderActivities.timeNumber}"/>
			<select name="leaderActivities.timeType" id="${leaderActivities.timeType}"> 
				<option <c:if test="${leaderActivities.timeType==1}">selected="selected" </c:if>  value="1">小时</option>		
				<option <c:if test="${leaderActivities.timeType==2}"> selected="selected"</c:if> value="2">时刻</option>
				<option <c:if test="${leaderActivities.timeType==0}">selected="selected" </c:if> value="0" >全天</option>
			</select>
			</td>
		</tr>
			<tr style="line-height:50px">
			<td width="20%" align="center" >简单描述:</td>
			<td style="padding-left:14px;padding-right:14px;">
			<textarea rows="3" cols="47" name="leaderActivities.activeName">${leaderActivities.activeName}</textarea>
			</td>
		</tr>
		<tr style="line-height:50px">
			<td width="20%" align="center" colspan="2" ><input type="button" onclick="savepublis();return false;" value="保存"/>&nbsp;
			<input type="button" onclick="back();return false;" value="取消"/></td>
		</tr>
	</table>
</form>
</body>
</html>