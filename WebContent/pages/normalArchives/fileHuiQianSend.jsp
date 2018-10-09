<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	if(StringUtils.isNotEmpty(archiveId)&&archiveId.indexOf("$")==-1){
		arch = arService.get(new Long(archiveId));
	}
	request.setAttribute("arch",arch);
	long runId = arch.getProcessRun().getRunId();
	String piId = arch.getProcessRun().getPiId();
	
	request.setAttribute("runId",runId);
	request.setAttribute("piId",piId);
%>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/archivedetail.css" />

<h1 align="center" style="padding:10px;font-size:20px;">文 件 会 签 单</h1> 

<span style="float:right;padding-right:10px;">创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
   <tr>
     <th width="15%">文件名</th>
     <td colspan="3">${arch.subject}</td>
  </tr>
  <tr>
     <th width="15%">拟稿部门</th>
     <td>${arch.issueDep}</td>
     <th width="15%">核稿人</th>
     <td>${arch.depSignNo}</td>
  </tr>
  <tr>
     <th width="15%">拟稿人</th>
     <td>${arch.issuer}</td>
     <th width="15%">核稿时间</th>
     <td>${arch.urgentLevel}</td>
  </tr>
 	<tr>
     <th width="15%">会签部门</th>
     <td colspan="3">${arch.recDepNames}</td>
  </tr>
 
  <tr>
     <th width="15%"  style="height:100px;padding-top:5px;" valign="top">相关附件</th>
     <td colspan="3" style="height:100px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${arch.archivesDocs}">
<!--        <a href="<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;-->
	 <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
	 <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(), "UTF-8")%>&fpath=attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
	 </c:forEach>
	 </td>
  </tr>
</table>
