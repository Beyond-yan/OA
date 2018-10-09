<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.OdCirPaperService"%>
<%@page import="com.gdssoft.oa.model.archive.OdCirPaper"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String cirPaperId = request.getParameter("cirPaperId");
	OdCirPaperService odCirPaperService = (OdCirPaperService)AppUtil.getBean("odCirPaperService");
	OdCirPaper odCirPaper=new OdCirPaper();
	if(StringUtils.isNotEmpty(cirPaperId)&&cirPaperId.indexOf("$")==-1){
		odCirPaper=odCirPaperService.get(new Long(cirPaperId));
	}
	request.setAttribute("odCirPaper",odCirPaper);
%>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/archivedetail.css" />


<h3 align="center" style="padding:10px;font-size:20px;">传阅件</h3> 

<span style="float:right;padding-right:10px;">发文日期:<fmt:formatDate value="${odCirPaper.createDate}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  
 <tr>
  	 <th width="15%">标题</th>
  	 <td colspan="3">${odCirPaper.subject}</td>
  </tr>
   
  <tr>
     <th width="15%">说明</th>
     <td colspan="4">
     	<textarea readonly="readonly" style="height:80px;width:98%;color:#03386C; background-color:#FFFFFF; border:0px;font-size:12px;" >${odCirPaper.shortContent}</textarea>
     </td>
  </tr> 
    <tr>
   	<th width="15%">发起人</th>
     <td colspan="3">${odCirPaper.appUser.fullname}</td>
  </tr>
	 <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">相关附件</th>
     <td colspan="3" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="fileAttach" items="${odCirPaper.odCirFiles}">
	          <c:set var="fileName" value="${fileAttach.fileName}"></c:set>
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(),"UTF-8")%>&fpath=attachFiles/${fileAttach.filePath}" target="_blank">${fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
</table>

