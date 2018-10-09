<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
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
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	Archives parArch=new Archives();
	if(StringUtils.isNotEmpty(archiveId)&&archiveId.indexOf("$")==-1){
		arch = arService.get(new Long(archiveId));
		Long parentId=arch.getParentArchId();
		if(parentId!=null){
			parArch=arService.get(parentId);
		}else{
			parArch=arch;
		}
	}
	
	request.setAttribute("arch",arch);
	
	String defId = request.getParameter("defId");
	request.setAttribute("defId", defId);
	ProDefinitionService proService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition prodef = new ProDefinition();
	if(null != defId && "" != defId.trim() && !defId.trim().isEmpty()){
		prodef = proService.get(new Long(defId));
	}
	request.setAttribute("prodef", prodef);
	
	String fileIds = request.getParameter("fileIds");
	request.setAttribute("fileIds",fileIds);
	if(!fileIds.trim().isEmpty()&&fileIds!=""&&!"_".equals(fileIds)&&!"0".equals(fileIds)&&fileIds.indexOf("$")==-1){
		FileAttachService fas = (FileAttachService)AppUtil.getBean("fileAttachService");
		ArrayList<FileAttach> faList = new ArrayList<FileAttach>();
		for(String fileId : fileIds.split(",")){
			FileAttach fa = fas.get(new Long(fileId));
			if(fa!=null){
				faList.add(fa);
			}
		}
		request.setAttribute("faList",faList);
	}
	
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
		<a href="#" onclick="openWorkEditWindow('${arch.archivesId}','${prodef.name}','${detailId}','${fileIds}','${defId}');" style="text-decoration: none;color: blue">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;
	</c:if>
	创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
  	<th width="15%">来文号</th>
     <td width="15%">${arch.depSignNo}</td>
     <th width="15%">收文日期</th>
     <td width="15%"><fmt:formatDate value="${arch.writtenDate}" pattern="yyyy-MM-dd"/></td>
     <th width="15%">紧急程度</th>
     <td>${arch.urgentLevel}</td>
  </tr>
  <tr>
   <th width="15%">限办时间</th>
    <td width="15%"><fmt:formatDate value="${arch.limitedDate}" pattern="yyyy-MM-dd HH:mm:ss"/></td>
    <th width="15%"></th>
     <td width="15%"></td>
     <th width="15%"></th>
     <td width="15%"></td>
 </tr>
  <tr>
    <th width="15%">来文单位</th>
     <td colspan="5">${arch.issueDep}</td>   
  </tr>
<tr>
  <th width="15%">标题</th>
     <td colspan="5" >${arch.subject}</td>
</tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${arch.archivesDocs}">
          <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc.fileAttach.fileId}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
     <td colspan="5" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="file" items="${arch.archivesFiles}">
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}" target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>  
	 </td>
  </tr>
</table>
</div>
<input id="runId" value='${arch.processRun.runId}' type="hidden"/>
<script type="text/javascript">
	function openWindow(archiveId,proName,detailId,fileIds,defId){
		new ArchivesReceiveEdit(archiveId,proName,defId,1,function(){
			var url= "<%=request.getContextPath()%>/pages/flowPath/meetingFlow.jsp";
			  Ext.getCmp(detailId).load({
			  	url: url,              
			  	params:{
			  	 archiveId:archiveId,
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
