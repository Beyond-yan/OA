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
	color: #3F4850;
	font-size:12px;
	text-align: center;
}

.newsList tr th {
	height: 28px;
	border: none;
	border-buttom: 1px dashed #c7e3fa;
	border-top: 1px dashed #c7e3fa;
	font-size:14px;
	text-align: center;
}


.newsList tr td a {
	text-decoration: none;
	overflow: hidden;
	/* color: blue; */
	color:#00f;
	padding-right: 10px;
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
		<th width="80" nowrap="nowrap">领导</th>
		<th width="80" nowrap="nowrap">操作</th>
	</tr>
	<c:forEach var="task" items="${taskList}">
		<tr>
			<td width="80" nowrap="nowrap">${task.assigneeName}</td>
			<c:if test="${meetingState != '会议取消'}">
				<td width="80" nowrap="nowrap"><a href="javascript:void(0)" onclick="completeTask('${task.taskId}','${task.assignee}','${task.assigneeName}','1')">参加</a><a href="#" onclick="completeTask('${task.taskId}','${task.assignee}','${task.assigneeName}','2')">不参加</a></td>
			</c:if>
			<c:if test="${meetingState == '会议取消'}">
				<td width="80" nowrap="nowrap"><a href="#" onclick="completeTask('${task.taskId}','${task.assignee}','${task.assigneeName}','3')">收到</a></td>
			</c:if>
		</tr>
	</c:forEach>
</table>
</div>
<script type="text/javascript">
	function completeTask(taskId,assignee, assigneeName,type){
		var comments = "";
		if(type == '1'){
			comments = "参加";
		}else if(type == "2"){
			comments = "不参加";
		}else if(type == "3"){
			comments = "收到";
		}
		var params={
			taskId : taskId,
			signalName : 'to 拟办分发',
			activityName : '领导批示',
			sendMail : false,
			sendMsg : false,
			sendInfo: false,
			isForkFlow:true,
			isJoinFlow:true,
			joinName:'处内办理合并',
			prevName : '拟办分发',
			comments: assigneeName + comments + "(代办)"
		};
		addMsgFunction(true,taskId);
		Ext.Ajax.request({
			method : 'POST',
			url : __ctxPath + "/flow/nextForLeaderByMeetingProcessActivity.do",
			waitMsg : '正在提交数据...',
			params : params,
			success : function(response) {
				Ext.MessageBox.hide();	
				var jsonResult = Ext.util.JSON.decode(response.responseText);
				console.log(jsonResult)
				if (jsonResult && jsonResult.success == "true") {
					Ext.ux.Toast.msg("操作信息", "审核成功！");
					var activeParams = {
						archivesId:'${archiveId}',
						leader: assignee
					};
					if(type == "1"){
						Ext.Ajax.request({
							url : __ctxPath + '/flow/sendMsgForMeetingProcessActivity.do',
							method : 'POST',
							params : {archivesId:'${archiveId}',userIds:assignee,content:'${smsMsg}'},
							success : function(response) {
							}
						});
						Ext.apply(activeParams,{
							state : '1'
						});
					}else{
						Ext.apply(activeParams,{
							state : '0'
						});
					}
					//同步领导日程
					Ext.Ajax.request({
						url : __ctxPath + '/leaderActivities/syncMeetingToActiveSchedule.do',
						method : 'POST',
						params : activeParams,
						success : function(response) {
						}
					});
					Ext.getCmp('flowTaskInfoWin').load({   
				        url :__ctxPath+ '/flow/getLeaderForMeetingTaskListProcessRun.do?runId=${runId}&piid=${piid}&archiveId=${archiveId}&rand=' + Math.random(),   
				        params : { 
				        	couId : 'task',   
				            subMainId : "tab-task-main"
				        },   
				        scripts: true  
				    }); 
				}else {
					var resultMsg = "信息保存出错，请联系管理员！";
					var resuIcon = Ext.MessageBox.ERROR;
					if (jsonResult.message && jsonResult.message != null) {
						resultMsg = jsonResult.message;
						if (jsonResult.code && (jsonResult.code == '2' || jsonResult.code == '3')) {
							resuIcon= Ext.MessageBox.WARNING;
						}
					}
					Ext.MessageBox.show({
					title : '操作信息',
					msg : resultMsg,
					buttons : Ext.MessageBox.OK,
					icon : resuIcon
					});
				}
				AppUtil.removeTab('ProcessForm' + taskId);
				refreshTaskPanelView();
				if(Ext.getCmp('ArchMeetingGrid')){
					Ext.getCmp('ArchMeetingGrid').getStore().reload();
				}
			},
			failure : function(fp, action) {
				Ext.MessageBox.hide();
				Ext.MessageBox.show({
					title : '操作信息',
					msg : '当前系统繁忙，请稍后再处理！',
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.WARNING
				});
			} 
		}); 
	}
</script>