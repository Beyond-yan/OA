<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="com.gdssoft.core.util.ContextUtil" %>
<%
	String basePath = request.getContextPath();
	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	String currentDate = formatter.format(new Date());
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>领导日程</title>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/css/admin.css" />
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/ux/css/ux-all.css" />
<script type="text/javascript"
	src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<script src="<%=basePath%>/js/selector/OdCommentsSelector.js"
	type="text/javascript"></script>
<script src="<%=basePath%>/js/leaderActivities/EditScheduleFormJsp.js"
	type="text/javascript"></script>
<script type="text/javascript">
var __ctxPath="<%=request.getContextPath()%>";
function openWindow(activeId,fullname,userId){
	var CurrentUserId=<%=ContextUtil.getCurrentUser().getUserId()%>;
	 new EditScheduleFormJsp(activeId,fullname,userId,CurrentUserId,function(){window.location.href="../leaderActivities/leaderActive.do?Q_startTime_D_GE=${currentTime}&weekType=${weekType}";});
}

$(document).ready(function() {	
	setDateColor(); 
  });
  function setDateColor(){
	 var tempDate = new Date();
	 var curDate = '<%=currentDate%>';
		var spans = $("span[name='mapDate']");
		for (i = 0; i < spans.length; i++) {
			var spanDate = $(spans[i]).text();
			if (spanDate == curDate) {
				$(spans[i]).parent().attr("style", "color:red;");
			}
		}
	}
</script>
</head>
<body>
	<!--schedule Start-->
	<div class="schedule">
		<div class="title">
			<h3>日历</h3>
			<ul class="tab">
				<li >
					<a href="<c:url value="../pages/leader/campusscheduler.jsp?weekType=${weekType}&startTime_D_GE=${currentTime}"/>">显示近期</a>
				</li>
				<li >
					<a href="<c:url value="leaderActive.do?weekType=1&startTime_D_GE=${currentTime}"/>">显示一周</a>
				</li>
				<li>
					<a href="<c:url value="leaderActive.do?weekType=2&startTime_D_GE=${currentTime}"/>">显示两周</a></li>
				<li >
					<a href="<c:url value="leaderActive.do?startTime_D_GE=${Q_startTime_D_GE}&weekType=${weekType}"/>">回到今天</a>
				</li>
				<li >
					<a href="<c:url value="leaderActive.do?startTime_D_GE=${lastStartDt}"/>&weekType=${weekType}">上一页</a>
				</li>
				<li >
					<a href="<c:url value="leaderActive.do?startTime_D_GE=${nextStartDt}&weekType=${weekType}"/>">下一页</a>
				</li>
			</ul>
		</div>
		<!--con Start-->
		<div class="con clearfix" style="background-color: #FOFOFO;">
			<table border="1px" style="border-collapse: collapse;"
				bordercolor="#99bbe8" class="scheduleList">
				<tr class="leaderSch_blue">
					<th width="50%">
						<span style="padding-left: 14px;" name="mapDate">${dateMap["1-1"]}</span>
						<span style="padding-left: 65px;">星期一</span>
					</th>
					<th width="50%">
						<span style="padding-left: 14px;" name="mapDate">${dateMap["1-2"]}</span>
						<span style="padding-left: 65px;">星期二</span>
					</th>
				</tr>
				<tr>
					<td valign="top" style="min-height: 30px">
					<c:if test='${empty activitesMap[dateMap["1-1"]]}'>
						&nbsp;
					</c:if>
					<table class="scheduleList" cellpadding="0" cellspacing="0" style="padding-left: 0px" width="100%">
						<tbody>
						<c:forEach items='${activitesMap[dateMap["1-1"]]}' var="mondayList">
							<tr>
								<td title="${mondayList.activeName}" width=100px>
									<span style="padding-left: 14px;">
										<c:out value="${mondayList.appUser.fullname}"></c:out>
									</span>
								</td>
								<td>
									<span>
									<a href="#" onclick="openWindow('${mondayList.activeId}','${mondayList.appUser.fullname}','${mondayList.appUser.userId}');" style="color: blue"> 
										<c:out value='${mondayList.activeName}' /> 
										<fmt:formatDate value="${mondayList.startTime}" pattern="yyyy-MM-dd HH:mm" />
									</a>
									</span>
								</td>
								<td title="${mondayList.activeName}" width=100px>
									<span style="padding-left: 14px;">
										<c:out value="${mondayList.appUser.fullname}"></c:out>
									</span>
								</td>
							</tr>
						</c:forEach>
						</tbody>
						</table>
					</td>
					<td valign="top" style="min-height: 30px"><c:if
							test='${empty activitesMap[dateMap["1-2"]]}'>
						&nbsp;
					</c:if>
						<table class="scheduleList" cellpadding="0" cellspacing="0"
							style="padding-left: 0px" width="100%">
							<tbody>
								<c:forEach items='${activitesMap[dateMap["1-2"]]}'
									var="tuesdayList">
									<tr>
										<td title="${tuesdayList.activeName}" width=147px><span
											style="padding-left: 14px;"><c:out
													value="${tuesdayList.appUser.fullname}"></c:out>
										</span></td>
										<td><span><a href="#"
												onclick="openWindow('${tuesdayList.activeId}','${tuesdayList.appUser.fullname}','${tuesdayList.appUser.userId}');"
												style="color: blue"> <c:out
														value='${tuesdayList.activeName}' /> </a>
										</span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</td>

				</tr>
				<tr class="leaderSch_blue">
					<th width="50%"><span style="padding-left: 14px;"
						name="mapDate">${dateMap["1-3"]}</span><span
						style="padding-left: 65px;">星期三</span>
					</th>
					<th width="50%"><span style="padding-left: 14px;"
						name="mapDate">${dateMap["1-4"]}</span><span
						style="padding-left:65px;">星期四</span>
					</th>

				</tr>
				<tr>
					<td valign="top" style="min-height: 30px"><c:if
							test='${empty activitesMap[dateMap["1-3"]]}'>
						&nbsp;
					</c:if>
						<table class="scheduleList" cellpadding="0" cellspacing="0"
							style="padding-left: 0px" width="100%">
							<tbody>
								<c:forEach items='${activitesMap[dateMap["1-3"]]}'
									var="wednesList">
									<tr>
										 
										<td title="${wednesList.activeName}" width=147px><span
											style="padding-left: 14px;"><c:out
													value="${wednesList.appUser.fullname}"></c:out>
										</span></td>
										<td><span><a href="#"
												onclick="openWindow('${wednesList.activeId}','${wednesList.appUser.fullname}','${wednesList.appUser.userId}');"
												style="color: blue"> <c:out
														value='${wednesList.activeName}' /> </a>
										</span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table></td>
					<td valign="top" style="min-height: 30px"><c:if
							test='${empty activitesMap[dateMap["1-4"]]}'>
						&nbsp;
					</c:if>
						<table class="scheduleList" cellpadding="0" cellspacing="0"
							style="padding-left: 0px" width="100%">
							<tbody>
								<c:forEach items='${activitesMap[dateMap["1-4"]]}'
									var="thursList">
									<tr>
										 
										<td title="${thursList.activeName}" width=147px><span
											style="padding-left: 14px;"><c:out
													value="${thursList.appUser.fullname}"></c:out>
										</span></td>
										<td><span><a href="#"
												onclick="openWindow('${thursList.activeId}','${thursList.appUser.fullname}','${thursList.appUser.userId}');"
												style="color: blue"> <c:out
														value='${thursList.activeName}' /> </a>
										</span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</td>

				</tr>
				<tr class="leaderSch_blue">
					<th width="50%"><span style="padding-left: 14px;"
						name="mapDate">${dateMap["1-5"]}</span><span
						style="padding-left:65px;">星期五</span>
					</th>
					<th width="50%"><span style="padding-left: 14px;"
						name="mapDate">${dateMap["1-6"]}</span><span
						style="padding-left:65px;">星期六</span>
					</th>
				</tr>
				<tr>
					<td valign="top" style="min-height: 30px"><c:if
							test='${empty activitesMap[dateMap["1-5"]]}'>
						&nbsp;
					</c:if>
						<table class="scheduleList" cellpadding="0" cellspacing="0"
							style="padding-left: 0px" width="100%">
							<tbody>
								<c:forEach items='${activitesMap[dateMap["1-5"]]}'
									var="fridayList">
									<tr>
										 
										<td title="${fridayList.activeName}" width=147px><span
											style="padding-left: 14px;"><c:out
													value="${fridayList.appUser.fullname}"></c:out>
										</span>
										</td>
										<td><span><a href="#"
												onclick="openWindow('${fridayList.activeId}','${fridayList.appUser.fullname}','${fridayList.appUser.userId}');"
												style="color: blue"> <c:out
														value='${fridayList.activeName}' /> </a>
										</span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</td>
					<td valign="top" style="min-height: 30px"><c:if
							test='${empty activitesMap[dateMap["1-6"]]}'>
						&nbsp;
					</c:if>
						<table class="scheduleList" cellpadding="0" cellspacing="0"
							style="padding-left: 0px" width="100%">
							<tbody>
								<c:forEach items='${activitesMap[dateMap["1-6"]]}'
									var="saturdayList">
									<tr>
										 
										<td title="${saturdayList.activeName}" width=147px><span
											style="padding-left: 14px;"><c:out
													value="${saturdayList.appUser.fullname}"></c:out>
										</span>
										</td>
										<td><span><a href="#"
												onclick="openWindow('${saturdayList.activeId}','${saturdayList.appUser.fullname}','${saturdayList.appUser.userId}');"
												style="color: blue"> <c:out
														value='${saturdayList.activeName}' /> </a>
										</span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table>
					</td>
				</tr>

				<tr class="leaderSch_blue">
					<th width="50%"><span style="padding-left: 14px;"
						name="mapDate">${dateMap["1-7"]}</span><span
						style="padding-left:65px;">星期日</span>
					</th>
					<th width="50%"><span style="padding-left: 14px;"></span><span
						style="padding-left:65px;""></span>
					</th>
				</tr>
				<tr>
					<td valign="top" style="min-height: 30px"><c:if
							test='${empty activitesMap[dateMap["1-7"]]}'>
						&nbsp;
					</c:if>
						<table class="scheduleList" cellpadding="0" cellspacing="0"
							style="padding-left: 0px" width="100%">
							<tbody>
								<c:forEach items='${activitesMap[dateMap["1-7"]]}'
									var="sundayList">
									<tr>
										 
										<td title="${sundayList.activeName}" width=147px><span
											style="padding-left: 14px;"><c:out
													value="${sundayList.appUser.fullname}"></c:out>
										</span>
										</td>
										<td><span><a href="#"
												onclick="openWindow('${sundayList.activeId}','${sundayList.appUser.fullname}','${sundayList.appUser.userId}');"
												style="color: blue"> <c:out
														value='${sundayList.activeName}' /> </a>
										</span></td>
									</tr>
								</c:forEach>
							</tbody>
						</table></td>
					<td valign="top">
						<table class="scheduleList" cellpadding="0" cellspacing="0"
							style="padding-left: 0px" width="100%">
							<tbody>
								<tr>
									<td></td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
			</table>
		</div>
		<c:if test="${weekType==2}">
			<div
				style="height: 20px; text-align: center; font-size: 14px; padding-top: 10px; padding-bottom: 10px">
				<b>第二周</b>
			</div>
			<div class="con clearfix">
				<table border="1px" style="border-collapse: collapse;"
					bordercolor="#99bbe8" class="scheduleList">
					<tr class="leaderSch_blue">
						<th width="50%"><span style="padding-left: 14px;"
							name="mapDate">${dateMap["2-1"]}</span><span
							style="padding-left:65px;">星期一</span>
						</th>
						<th width="50%"><span style="padding-left: 14px;"
							name="mapDate">${dateMap["2-2"]}</span><span
							style="padding-left:65px;">星期二</span>
						</th>

					</tr>
					<tr style="min-height: 30px">
						<td valign="top"><c:if
								test='${empty activitesMap[dateMap["2-1"]]}'>
						&nbsp;
					</c:if>
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<c:forEach items='${activitesMap[dateMap["2-1"]]}'
										var="mondayList">
										<tr>
										 
											<td title="${mondayList.activeName}" width=147px><span
												style="padding-left: 14px;"><c:out
														value="${mondayList.appUser.fullname}"></c:out>
											</span></td>
											<td><span><a href="#"
													onclick="openWindow('${mondayList.activeId}','${mondayList.appUser.fullname}','${mondayList.appUser.userId}');"
													style="color: blue"> <c:out
															value='${mondayList.activeName}' /> </a>
											</span></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</td>
						<td valign="top"><c:if
								test='${empty activitesMap[dateMap["2-2"]]}'>
						&nbsp;
					</c:if>
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<c:forEach items='${activitesMap[dateMap["2-2"]]}'
										var="tuesdayList">
										<tr>
											 
											<td title="${tuesdayList.activeName}" width=147px><span
												style="padding-left: 14px;"><c:out
														value="${tuesdayList.appUser.fullname}"></c:out>
											</span></td>
											<td><span><a href="#"
													onclick="openWindow('${tuesdayList.activeId}','${tuesdayList.appUser.fullname}','${tuesdayList.appUser.userId}');"
													style="color: blue"> <c:out
															value='${tuesdayList.activeName}' /> </a>
											</span></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</td>

					</tr>

					<tr class="leaderSch_blue">
						<th width="50%"><span style="padding-left: 14px;"
							name="mapDate">${dateMap["2-3"]}</span><span
							style="padding-left: 65px;">星期三</span>
						</th>
						<th width="50%"><span style="padding-left: 14px;"
							name="mapDate">${dateMap["2-4"]}</span><span
							style="padding-left:65px;">星期四</span>
						</th>

					</tr>
					<tr style="min-height: 30px">
						<td valign="top"><c:if
								test='${empty activitesMap[dateMap["2-3"]]}'>
						&nbsp;
					</c:if>
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<c:forEach items='${activitesMap[dateMap["2-3"]]}'
										var="wednesList">
										<tr>
											 
											<td title="${wednesList.activeName}" width=147px><span
												style="padding-left: 14px;"><c:out
														value="${wednesList.appUser.fullname}"></c:out>
											</span></td>
											<td><span><a href="#"
													onclick="openWindow('${wednesList.activeId}','${wednesList.appUser.fullname}','${wednesList.appUser.userId}');"
													style="color: blue"> <c:out
															value='${wednesList.activeName}' /> </a>
											</span></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</td>
						<td valign="top"><c:if
								test='${empty activitesMap[dateMap["2-4"]]}'>
						&nbsp;
					</c:if>
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<c:forEach items='${activitesMap[dateMap["2-4"]]}'
										var="thursList">
										<tr>
											 
											<td title="${thursList.activeName}" width=147px><span
												style="padding-left: 14px;"><c:out
														value="${thursList.appUser.fullname}"></c:out>
											</span></td>
											<td><span><a href="#"
													onclick="openWindow('${thursList.activeId}','${thursList.appUser.fullname}','${thursList.appUser.userId}');"
													style="color: blue"> <c:out
															value='${thursList.activeName}' /> </a>
											</span></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</td>

					</tr>
					<tr class="leaderSch_blue">
						<th width="50%"><span style="padding-left: 14px;"
							name="mapDate">${dateMap["2-5"]}</span><span
							style="padding-left:65px;">星期五</span>
						</th>
						<th width="50%"><span style="padding-left: 14px;"
							name="mapDate">${dateMap["2-6"]}</span><span
							style="padding-left:65px;">星期六</span>
						</th>
					</tr>
					<tr style="min-height: 30px">
						<td valign="top" style="min-height: 30px"><c:if
								test='${empty activitesMap[dateMap["2-5"]]}'>
						&nbsp;
					</c:if>
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<c:forEach items='${activitesMap[dateMap["2-5"]]}'
										var="fridayList">
										<tr>
											  
											<td title="${fridayList.activeName}" width=147px><span
												style="padding-left: 14px;"><c:out
														value="${fridayList.appUser.fullname}"></c:out>
											</span>
											</td>
											<td><span><a href="#"
													onclick="openWindow('${fridayList.activeId}','${fridayList.appUser.fullname}','${fridayList.appUser.userId}');"
													style="color: blue"> <c:out
															value='${fridayList.activeName}' /> </a>
											</span></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</td>
						<td valign="top"><c:if
								test='${empty activitesMap[dateMap["2-6"]]}'>
						&nbsp;
					</c:if>
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<c:forEach items='${activitesMap[dateMap["2-6"]]}'
										var="saturdayList">
										<tr>
											 
											<td title="${saturdayList.activeName}" width=147px><span
												style="padding-left: 14px;"><c:out
														value="${saturdayList.appUser.fullname}"></c:out>
											</span>
											</td>
											<td><span><a href="#"
													onclick="openWindow('${saturdayList.activeId}','${saturdayList.appUser.fullname}','${saturdayList.appUser.userId}');"
													style="color: blue"> <c:out
															value='${saturdayList.activeName}' /> </a>
											</span></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</td>
					</tr>
					<tr class="leaderSch_blue">
						<th width="50%"><span style="padding-left: 14px;"
							name="mapDate">${dateMap["2-7"]}</span><span
							style="padding-left: 65px;">星期日</span>
						</th>
						<th width="50%"><span style="padding-left: 14px;"></span><span
							style="padding-left: 65px;"></span>
						</th>
					</tr>
					<tr style="min-height: 30px">
						<td valign="top"><c:if
								test='${empty activitesMap[dateMap["2-7"]]}'>
						&nbsp;
					</c:if>
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<c:forEach items='${activitesMap[dateMap["2-7"]]}'
										var="sundayList">
										<tr>
											<td title="${sundayList.activeName}" width=147px><span
												style="padding-left: 14px;"><c:out
														value="${sundayList.appUser.fullname}"></c:out>
											</span>
											</td>
											<td><span><a href="#"
													onclick="openWindow('${sundayList.activeId}','${sundayList.appUser.fullname}','${sundayList.appUser.userId}');"
													style="color: blue"> <c:out
															value='${sundayList.activeName}' /> </a>
											</span></td>
										</tr>
									</c:forEach>
								</tbody>
							</table>
						</td>
						<td valign="top">
							<table class="scheduleList" cellpadding="0" cellspacing="0"
								style="padding-left: 0px" width="100%">
								<tbody>
									<tr>
										<td]></td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</table>
			</div>
		</c:if>
	</div>
	<!--schedule End-->
</body>
</html>