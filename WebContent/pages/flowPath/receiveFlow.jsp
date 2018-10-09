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
<span style="float:right;padding-right:7px;padding-bottom:2px;"><a href="#" onclick="openWindow('${arch.archivesId}','${prodef.name}','${detailId}','${fileIds}','${defId}');" style="text-decoration: none;color: blue">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;<c:if test="${isJW=='OA'}"> <a href="<%=request.getContextPath()%>/pages/archivesPrint/receiveArchivesPrint1.jsp?archiveId=${arch.archivesId}" style="text-decoration: none;" target="_blank">模板打印</a></c:if><c:if test="${isJW!='OA'}"> <a href="<%=request.getContextPath()%>/pages/archivesPrint/receiveArchivesPrint2.jsp?archiveId=${arch.archivesId}&defId=${defId}" style="text-decoration: none;" target="_blank">模板打印</a></c:if>&nbsp;&nbsp;&nbsp;&nbsp;<a href="<%=request.getContextPath()%>/pages/archivesPrint/archInfoPrint.jsp?archivesId=${arch.archivesId}&defId=${defId}" style="text-decoration: none;" target="_blank">直接打印</a>&nbsp;&nbsp;&nbsp;&nbsp;创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">收文编号</th>
     <td width="15%">${arch.archivesNo=="0"?"未生成编号":arch.archivesNo}</td>
      <th width="15%">收文日期</th>
     <td width="15%"><fmt:formatDate value="${arch.issueDate}" pattern="yyyy-MM-dd"/></td>
      <th width="15%">发文字号</th>
     <td width="15%">${arch.depSignNo}</td>
  </tr>
   <tr>
    <th width="15%">密&nbsp;&nbsp;&nbsp;&nbsp;级</th>
     <td>${arch.privacyLevel}</td>
     <th width="15%">缓&nbsp;&nbsp;&nbsp;&nbsp;急</th>
     <td>${arch.urgentLevel}</td>
      <th width="15%">成文日期</th>
     <td><fmt:formatDate value="${arch.writtenDate}" pattern="yyyy-MM-dd"/></td>
  </tr>
  <tr>
   <th width="15%">文&nbsp;&nbsp;&nbsp;&nbsp;种</th>
     <td>${arch.archivesType.typeName}</td>
     <c:if test="${arch.privacyLevel!='一般'}">
		<th width="15%">份&nbsp;&nbsp;&nbsp;&nbsp;号</th>
		<td>${arch.fileCounts}</td>
	</c:if>
	<c:if test="${arch.privacyLevel=='一般'}">
	    <td colspan="2"></td>
    </c:if>
     <td colspan="2"></td>
    </tr>
  <tr>
    <th width="15%">来文单位</th>
     <td colspan="5">${arch.issueDep}</td>   
  </tr>
<tr>
  <th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
     <td colspan="5" >${arch.subject}</td>
</tr>
<tr>
    <th width="15%">主办部门</th>
     <td colspan="5">${arch.orgDepName}</td>
</tr>
<tr>
     <th width="15%">附件(无文档)</th>
     <td colspan="5">${arch.enclosure}</td>
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
 <%--  <c:if test="${arch.isPublic!=1}&&${arch.isPublic!=null}">
	  <tr>
	     <th width="15%">不公开原因</th>
	     <td colspan="5">${arch.unPublicReasons}</td>
	  </tr>
  </c:if> --%>
</table>
</div>
<input id="runId" value='${arch.processRun.runId}' type="hidden"/>
