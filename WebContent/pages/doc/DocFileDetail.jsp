<%@page import="org.apache.velocity.runtime.directive.Foreach"%>
<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.system.DocFilesService"%>
<%@page import="com.gdssoft.oa.model.system.DocFiles"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>

<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%
	String docFilesId = request.getParameter("docFilesId");
    DocFilesService dfService = (DocFilesService)AppUtil.getBean("docFilesService");
    DocFiles docFiles=new DocFiles();
	if(StringUtils.isNotEmpty(docFilesId)){
		docFiles=dfService.get(new Long(docFilesId));
	}
	request.setAttribute("docFiles",docFiles);
	
	String defId = request.getParameter("defId");
	request.setAttribute("defId",defId);
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
%>

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/admin.css" />
<h2 align="center" title="公文标题" style="font-size: 20px;padding:10px;">${proDef.name}</h2> 
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">所属部门</th>
     <td>${docFiles.department.depName}</td>
     <th width="15%">页数</th>
     <td>${docFiles.pageCount}</td>
  </tr>
   <tr>
     <th width="15%">文号</th>
     <td>${docFiles.fileNo}</td>
     <th width="15%">责任人</th>
      <td>${docFiles.dutyPerson}</td>
  </tr>
     <tr>
     <th width="15%">文件类型</th>
      <c:if test="${docFiles.fileType == 0}">
         <td>发文</td>
      </c:if>
      <c:if test="${docFiles.fileType == 1}">
         <td>收文</td>
      </c:if>
     <th width="15%">密级</th>
      <c:if test="${docFiles.fileYear >2015}">
	      <c:if test="${docFiles.archives.isPublic == 3}">
	         <td>公开</td>
	      </c:if>
	      <c:if test="${docFiles.archives.isPublic != 3}">
	         <td>划控</td>
	      </c:if>
      </c:if>
      <c:if test="${docFiles.fileYear <=2015}">
         <td>${docFiles.secretLevel}</td> 
      </c:if>
  </tr>
   <tr>
     <th width="15%">文件日期</th>
     <td><fmt:formatDate value="${docFiles.fileDate}" pattern="yyyy-MM-dd"/></td>
     <th width="15%">年份</th>
      <td>${docFiles.fileYear}</td>
  </tr>
  <tr>
     <th width="15%">件号</th>
     <td>${docFiles.fileNumber}</td>
     <th width="15%">保管期限</th>
     <c:if test="${docFiles.retentionYear == 0}">
         <td>永久</td>
      </c:if>
      <c:if test="${docFiles.retentionYear == 1}">
         <td>待分类</td>
      </c:if>
      <c:if test="${docFiles.retentionYear == 30}">
         <td>30年</td>
      </c:if>
      <c:if test="${docFiles.retentionYear == 10}">
         <td>10年</td>
      </c:if>
  </tr>
  <tr>
     <th width="15%">标题</th>
     <td colspan="3">${docFiles.fileName}</td>
  </tr>
  <tr>
     <th width="15%">责任者</th>
     <td colspan="3">${docFiles.fileIssup}</td>
  </tr>
  	<tr>
     <th width="15%">备注</th>
     <td colspan="3">${docFiles.remark}</td>
  </tr>
   <tr>
     <th width="15%" style="height:60px;padding-top:5px;" valign="top">附件</th>
     <td colspan="3" style="height:60px;padding-top:5px;" valign="top">
        <c:forEach var="file" items="${docFiles.fileList}">
        	<c:if test="${file.fileType == '3'}">
        	<a href="http://10.224.5.177:8081${file.filePath}" target="_blank">${file.fileName}&nbsp;&nbsp;&nbsp;&nbsp;</a>
        	</c:if>
        	<c:if test="${file.fileType != '3'}">
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}" target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
	         </c:if>
		 </c:forEach>    
	 </td>
  </tr>
</table>
