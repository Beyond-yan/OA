<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.model.meetingNotice.MeetingNotice"%>
<%@page import="com.gdssoft.oa.service.meetingNotice.MeetingNoticeService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import=" com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="java.util.List"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>

<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService" %>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.core.util.ContextUtil" %>


<%
	String isEdited = request.getParameter("isEdited");
	request.setAttribute("isEdited",isEdited);
	String noticeId = request.getParameter("noticeId");
	MeetingNoticeService meetingNoticeService = (MeetingNoticeService)AppUtil.getBean("meetingNoticeService");
	MeetingNotice meetingNotice=new MeetingNotice();
	if(StringUtils.isNotEmpty(noticeId)&&noticeId.indexOf("$")==-1){
		meetingNotice = meetingNoticeService.get(new Long(noticeId));
	}
	
	request.setAttribute("meetingNotice",meetingNotice);
	
	String defId = request.getParameter("defId");
	request.setAttribute("defId", defId);
	ProDefinitionService proService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition prodef = new ProDefinition();
	if(null != defId && "" != defId.trim() && !defId.trim().isEmpty()){
		prodef = proService.get(new Long(defId));
	}
	request.setAttribute("prodef", prodef);
	
	String detailId = request.getParameter("detailId");
	request.setAttribute("detailId",detailId);
	String isJW=ContextUtil.getCurrentUser().getOwnerSchema();
	request.setAttribute("isJW",isJW);
	
%>
<h1 align="center" style="padding:10px;font-size:20px;">${prodef.name}</h1> 
<div class="x-panel-body x-panel-body-noheader x-panel-body-noborder"
		id="ext-gen221" style="overflow: auto; height: auto;width: 698px;">
<span style="float:right;padding-right:7px;padding-bottom:2px;">
	<c:if test="${isEdited==1}">
		<a href="#" onclick="openMeetingEditWindow('${meetingNotice.noticeId}','${prodef.name}','${detailId}','${fileIds}','${defId}');" style="text-decoration: none;color: blue">编辑</a>&nbsp;&nbsp;
	</c:if>
	<a href="<%=request.getContextPath()%>/pages/archivesPrint/meetingInfoPrint.jsp?noticeId=${meetingNotice.noticeId}&defId=${defId}" style="text-decoration: none;" target="_blank">打印</a>&nbsp;&nbsp;
	创建日期:<fmt:formatDate value="${meetingNotice.createTime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
	<tr>
		<th width="15%">会议名称</th>
		<td colspan="5" >${meetingNotice.subject}</td>
	</tr>
  	<tr>
    	<th width="15%">召集单位</th>
    	<td colspan="2">${meetingNotice.holdDep}</td>   
    	<th width="15%">主持人</th>
    	<td colspan="2">${meetingNotice.host}</td>   
  	</tr>
  	<tr>
   		<th width="15%">会议时间</th>
    	<td colspan="2"><fmt:formatDate value="${meetingNotice.meetingDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
    	<th width="15%">会议地点</th>
	    <td colspan="2">${meetingNotice.meetingPlace}</td>
 	</tr>
  	<tr>
    	<th width="15%">会议状态</th>
     	<td colspan="2">${meetingNotice.meetingState}</td>
     	<th width="15%">主办部门</th>
     	<td colspan="2">${meetingNotice.mainDep}</td>
  	</tr>
  	<tr>
		<th width="15%">参会领导</th>
		<td colspan="5">${meetingNotice.attendLeadersName}</td>
	</tr>
	<tr>
		<th width="15%">参会人员</th>
		<td colspan="5">${meetingNotice.attendPersonsName}</td>
	</tr>
  	<tr>
   		<th width="15%">出发时间</th>
    	<td colspan="2"><fmt:formatDate value="${meetingNotice.departureTime}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
    	<th width="15%">出发地点</th>
	    <td colspan="2">${meetingNotice.departurePlace}</td>
 	</tr>
  	<tr>
		<th width="15%">车辆信息</th>
		<td colspan="5" >${meetingNotice.vehicleInfo}</td>
	</tr>
	<tr>
		<th width="15%">驾驶员信息</th>
		<td colspan="5" >${meetingNotice.driverInfo}</td>
	</tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${meetingNotice.docs}">
          <c:set var="fileName" value="${doc.fileName}"></c:set>
	         <a href="<%=request.getContextPath()%>/attachFiles/${doc.filePath}" target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
</table>
</div>
<input id="runId" value='${arch.processRun.runId}' type="hidden"/>
<script type="text/javascript">
	function openWindow(noticeId,proName,detailId,fileIds,defId){
		new ArchivesReceiveEdit(noticeId,proName,defId,1,function(){
			var url= "<%=request.getContextPath()%>/pages/flowPath/meetingFlow.jsp";
			  Ext.getCmp(detailId).load({
			  	url: url,              
			  	params:{
			  	 noticeId:noticeId,
			  	 fileIds:fileIds,
			  	 defId:defId,
			  	 detailId:detailId
			  	},              
			  	scope: this,                  
			  	discardUrl: false,                  
			  	nocache: false,                 
			  	text: "正在加载，请稍候...",                 
			  	timeout: 30,                 
			  	scripts: true           
			  	});
		});	
	}
</script>
