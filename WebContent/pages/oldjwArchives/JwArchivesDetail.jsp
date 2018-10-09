<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.jw.JwArchivesService"%>
<%@page import="com.gdssoft.oa.model.jw.JwArchives"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String id = request.getParameter("id");
    JwArchivesService jaService = (JwArchivesService) AppUtil
			.getBean("jwArchivesService");
    JwArchives jwArchives = new JwArchives();
	if (StringUtils.isNotEmpty(id)) {
		jwArchives = jaService.get(new Long(id));
	}
	request.setAttribute("jwArchives", jwArchives);
%>

<h1 align="center" style="padding:10px;font-size:20px;">${jwArchives.subject}</h1>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">所属部门</th>
     <td>${jwArchives.sourcedepartment}</td>
    
     <th width="15%">公文编号</th>
     <td>${jwArchives.docnum}</td>
  </tr>
   <tr>
     <th width="15%">收发类型</th>
     <td>${jwArchives.doctype}</td>
     <th width="15%">文件日期</th>
     <td>${jwArchives.day}></td>
  </tr>
   <tr>
    <th width="15%">年份</th>
     <td>${jwArchives.bumfyear}</td>
      <th width="15%">页数</th>
     <td>${jwArchives.page}</td>
  </tr>
   <tr>
     <th width="15%">密级</th>
     <td>${jwArchives.securitydegree}</td>
     <th width="15%">发文单位</th>
     <td>${jwArchives.burden}</td>
  </tr>

 
  <tr>
     <th width="15%">关键词</th>
     <td colspan="3">${jwArchives.keywords}</td>
  </tr>
  <!--  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${arch.archivesDocs}">
          <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
          	<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(),"UTF-8")%>&fpath=attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr> -->

</table>