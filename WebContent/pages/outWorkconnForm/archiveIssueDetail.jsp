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

<h3 align="center" style="padding:10px;font-size:20px;">工作联系单</h3> 

<span style="float:right;padding-right:10px;">创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">

  <tr>
    
     <th width="15%">发文部门</th>
     <td>${arch.issueDep}</td>
      <th width="15%">急缓程度</th>
     <td>${arch.urgentLevel}</td>
  </tr>
  
   <tr>
  	 <th width="15%">主送</th>
  	 <td colspan="4">${arch.recDepNames}</td>
  </tr>
   <tr>
  	 <th width="15%">抄报</th>
  	 <td colspan="4">${arch.handlerUnames}</td>
  </tr>
   <tr>
  	 <th width="15%">标题</th>
  	 <td colspan="4">${arch.subject}</td>
  </tr>
   
  <tr>
     <th width="15%">联系事由</th>
     <td colspan="4">
     	<textarea readonly="readonly" style="height:80px;width:98%;color:#03386C; background-color:#FFFFFF; border:0px;font-size:12px;" >${arch.shortContent}</textarea>
     </td>
  </tr>
  <tr>
   	<th width="15%">经办人</th>
     <td colspan="4">${arch.issuer}</td>
  </tr>
 <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">相关附件</th>
     <td colspan="3" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="doc" items="${arch.archivesDocs}">
	          <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(),"UTF-8")%>&fpath=attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
</table>

