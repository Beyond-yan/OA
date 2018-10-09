<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String archivesId = request.getParameter("archivesId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	if(StringUtils.isNotEmpty(archivesId)){
		arch=arService.get(new Long(archivesId));
	}
	request.setAttribute("arch",arch);
%>

<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/archivedetail.css" />


<h3 align="center" style="padding:10px;font-size:20px;">深圳市地铁三号线运营分公司</h3> 

<span style="float:right;padding-right:10px;">拟稿日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  
  <tr>
  	 <th width="15%">标题</th>
  	 <td>${arch.subject}</td>
  	  <th width="15%">秘密等级</th>
     <td>${arch.privacyLevel}</td>
  </tr>
  <tr>
     <th width="15%">拟稿单位</th>
     <td>${arch.issueDep}</td>
      <th width="15%">拟稿人</th>
     <td>${arch.issuer}</td>
  </tr>
  <tr>
  	 <th width="15%">发行范围</th>
  	 <td colspan="4">${arch.recDepNames}</td>
  </tr>
   <tr>
     <th width="15%">抄报</th>
     <td colspan="4">
	     <c:forEach var="appUser" items="${arch.archivesCCs}">
	       ${appUser.fullname}&nbsp;
		 </c:forEach>
	 </td>
  </tr>
	 <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">相关附件</th>
     <td colspan="3" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="doc" items="${arch.archivesDocs}">
	        <a href="<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
</table>

