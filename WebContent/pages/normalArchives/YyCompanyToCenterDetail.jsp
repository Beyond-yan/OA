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
		arch=arService.get(new Long(archiveId));
	}
	request.setAttribute("arch",arch);
%>

<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/archivedetail.css" />


<h1 align="center" style="padding:10px;font-size:20px;">运营公司报总公司上会材料审批表</h1> 

<span style="float:right;padding-right:10px;">会议时间:<fmt:formatDate value="${arch.createtime}" pattern="yyyy年MM月-dd日"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  
  <tr>
     <th width="15%">议题名称</th>
     <td colspan="5">${arch.subject}</td>
  </tr>
  <tr>
     <th width="15%">提交部门</th>
     <td colspan="2">${arch.issueDep}</td>
     <th width="15%">汇报人</th>
     <td colspan="2">${arch.issuer}</td>
  </tr>
  <tr>
     <th width="15%">其他参会部门或单位</th>
     <td colspan="5">${arch.recDepNames}</td>
  </tr>
  <tr>
     <th width="15%">主要内容</th>
     <td colspan="5">
       <textarea readonly="readonly" style="height:80px;width:98%;color:#03386C; background-color:#FFFFFF; border:0px;font-size:12px;" >${arch.shortContent}</textarea>
    </td>
  </tr>
    <tr>
     <th width="15%"  style="height:100px;padding-top:5px;" valign="top">相关附件</th>
     <td colspan="5" style="height:100px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${arch.archivesDocs}">
<!--        <a href="<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;-->
	 <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
	 <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(), "UTF-8")%>&fpath=attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
	 </c:forEach>
	 </td>
  </tr>
</table>

