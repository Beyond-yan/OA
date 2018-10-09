<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import=" com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="java.util.List"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>
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
	String fileIds = request.getParameter("fileIds");
	if(!fileIds.trim().isEmpty()&&fileIds!=""&&!"_".equals(fileIds)&&!"0".equals(fileIds)){
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
	
%>
<h1 align="center" style="padding:10px;font-size:20px;">重庆市交通委员会行政收文处理笺</h1> 
<div class="x-panel-body x-panel-body-noheader x-panel-body-noborder"
		id="ext-gen221" style="overflow: auto; height: auto;width: 698px;">
<span style="float:right;padding-right:7px;padding-bottom:2px;">创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">收文编号</th>
     <td>${arch.archivesNo==0?'未生成编号':arch.archivesNo}</td>
     <th width="15%">收文日期</th>
     <td><fmt:formatDate value="${arch.issueDate}" pattern="yyyy-MM-dd"/></td>
     <th width="15%">发文字号</th>
     <td>${arch.depSignNo}</td>
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
	    <th></th>
		<td width="15%"></td>
    </c:if>
    <td></td>
    <td></td>
  </tr>
  <c:if test="${arch.isPublic!=null}">
	     <th width="15%">是否公开</th>
	     <td colspan="5">${arch.isPublic==0?'否':'是'}</td>
   </c:if>
  <tr>
     <th width="15%">来文单位</th>
     <td colspan="5">${arch.issueDep}</td>
  </tr>
  <tr>
     <th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
     <td colspan="5">${arch.subject}</td>
  </tr>
 <tr>
     <th width="15%">主办部门</th>
     <td colspan="5">${arch.orgDepName}</td>
  </tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${arch.archivesDocs}">
          <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(),"UTF-8")%>&fpath=attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
     <td colspan="5" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="fa" items="${faList}">
	      <a href="<%=request.getContextPath()%>/attachFiles/${fa.filePath}" target="_blank">${fa.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
	  	 </c:forEach>
	 </td>
  </tr>
  <c:if test="${arch.isPublic!=1}&&${arch.isPublic!=null}">
	  <tr>
	     <th width="15%">不公开原因</th>
	     <td colspan="5">${arch.unPublicReasons}</td>
	  </tr>
  </c:if>
</table>
</div>
<hidden id="runId" value='${arch.processRun.runId}'/>
