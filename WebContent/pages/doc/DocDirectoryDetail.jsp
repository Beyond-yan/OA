<%@page import="org.apache.velocity.runtime.directive.Foreach"%>
<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.system.DocDirectoryService"%>
<%@page import="com.gdssoft.oa.model.system.DocDirectory"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>
<%
	String directoryId = request.getParameter("directoryId");
    DocDirectoryService ddService = (DocDirectoryService)AppUtil.getBean("docDirectoryService");
    DocDirectory docDir=new DocDirectory();
	if(StringUtils.isNotEmpty(directoryId)){
		docDir=ddService.get(new Long(directoryId));
	}
	request.setAttribute("docDir",docDir);
	
	//查询该档案文件夹的所有文件大小
	DocDirectory queryDir=new DocDirectory();
	if(StringUtils.isNotEmpty(directoryId)){
		queryDir.setId(new Long(directoryId));
	}
	Double totalBytes = ddService.getTotalBytes(queryDir);
	request.setAttribute("totalMB", String.format("%.2f", totalBytes / (1024 * 1024)));
%>

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/admin.css" />
<h2 align="center" title="公文标题" style="font-size: 20px;padding:10px;">${docDir.directoryName}</h2> 
<span style="float:right;padding-right:7px;padding-bottom:2px"><a href="#"  style="text-decoration: none;" onclick="openDocDirectoryDetailEdit('${docDir.id}')">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;创建日期:<fmt:formatDate value="${docDir.createDate}" pattern="yyyy-MM-dd"/></span>
<span style="float:left;padding-left:7px;padding-bottom:2px">作者:${docDir.createUser}</span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">年度</th>
     <td>${docDir.dirYear}</td>
     <th width="15%">部门</th>
     <td>${docDir.department.depName}</td>
  </tr>
   <tr>
     <th width="15%">件数</th>
     <td>${docDir.fileAmount}</td>
     <th width="15%">保管期限</th>
     <c:if test="${docDir.retentionYear == 0}">
         <td>永久</td>
      </c:if>
       <c:if test="${docDir.retentionYear == 1}">
         <td>待分类</td>
      </c:if>
      <c:if test="${docDir.retentionYear == 10}">
         <td>10年</td>
      </c:if>
      <c:if test="${docDir.retentionYear == 30}">
         <td>30年</td>
       </c:if>
  </tr>
  <tr>
     <th width="15%">文件总量</th>
     <td>${totalMB} MB</td>
  </tr>
</table>
