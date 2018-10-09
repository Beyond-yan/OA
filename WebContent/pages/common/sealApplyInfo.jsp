<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.flow.SealApplyService"%>
<%@page import="com.gdssoft.oa.model.flow.SealApply"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String applyId = request.getParameter("archivesId");
	SealApplyService saService = (SealApplyService) AppUtil
			.getBean("sealApplyService");
	SealApply sealApply = new SealApply();
	if (StringUtils.isNotEmpty(applyId)) {
		sealApply = saService.get(new Long(applyId));
	}
	request.setAttribute("sealApply", sealApply);
%>


<h3 align="center" style="padding:10px;font-size:20px;">用印申请</h3> 

<span style="float:right;padding-right:10px;">申请日期:<fmt:formatDate value="${sealApply.createDate}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  
  <tr>
  	 <th width="15%">申请人</th>
  	 <td>${sealApply.appUser.fullname}</td>
  	  <th width="15%">申请部门</th>
     <td>${sealApply.department.depName}</td>
  </tr>
  <tr>
  	 <th width="15%">用印文档名称</th>
  	 <td colspan="4">${sealApply.sealName}</td>
  </tr>
      <tr>
     <th width="15%">申请用途</th>
     <td colspan="4">
     	<textarea readonly="readonly" style="height:80px;width:98%;color:#03386C; background-color:#FFFFFF; border:0px;font-size:12px;" >${sealApply.reason}</textarea>
     </td>
  </tr> 
     <tr>
  	 <th width="15%">用印次数</th>
  	 <td colspan="4">${sealApply.useCount}</td>
  </tr>
	 <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">相关附件</th>
     <td colspan="3" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="fileAttach" items="${sealApply.sealApplyFiles}">
	          <c:set var="fileName" value="${fileAttach.fileName}"></c:set>
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(),"UTF-8")%>&fpath=attachFiles/${fileAttach.filePath}" target="_blank">${fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
</table>
