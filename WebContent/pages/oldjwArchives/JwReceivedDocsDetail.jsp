<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.jw.JwReceivedDocsService"%>
<%@page import="com.gdssoft.oa.model.jw.JwReceivedDocs"%>
<%@page import="com.gdssoft.oa.model.jw.JwAttachfile"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.Iterator"%>
<%
	String id = request.getParameter("id");
    JwReceivedDocsService jdService = (JwReceivedDocsService) AppUtil
			.getBean("jwReceivedDocsService");
    JwReceivedDocs jwReceivedDocs = new JwReceivedDocs();
	if (StringUtils.isNotEmpty(id)) {
		jwReceivedDocs = jdService.get(new Long(id));
	}
	request.setAttribute("jwReceivedDocs",jwReceivedDocs);
%>

<h1 align="center" style="padding:10px;font-size:20px;">${jwReceivedDocs.subject}</h1>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">收文编号</th>
     <td>${jwReceivedDocs.acceptno}</td>
     <th width="15%">收文处理笺名称</th>
     <td>${jwReceivedDocs.unittitle}</td>
     <th width="15%">紧急程度</th>
     <td>${jwReceivedDocs.urgencydegree}</td>
  </tr>
   <tr>
     <th width="15%">密级</th>
     <td>${jwReceivedDocs.securitydegree}</td>
     <th width="15%">来文单位</th>
     <td>${jwReceivedDocs.fromunit}</td>
     <th width="15%">主办部门</th>
     <td >${jwReceivedDocs.dept}</td>
  </tr>
 
   <tr>
      <th width="15%">签收人</th>
     <td>${jwReceivedDocs.signname}</td>
     <th width="15%">来文字号</th>
     <td>${jwReceivedDocs.docnum}</td>
     <th width="15%">成文日期</th>
     <td>${jwReceivedDocs.dispatchdocdt}</td>
  </tr>

   <tr>
     <th width="15%">主题词</th>
     <td colspan="5">${jwReceivedDocs.topic}</td>
  </tr>
 
  <tr>
    
	 <th width="15%">拟办人</th>
     <td>${jwReceivedDocs.planuser}</td>
      <th width="15%">拟办意见</th>
     <td>${jwReceivedDocs.planmemo}</td>
	 <th width="15%">拟办日期</th>
     <td>${jwReceivedDocs.plandate}</td>
  </tr>
  
 <tr>
     <th width="15%">批示领导</th>
     <td>${jwReceivedDocs.leadname}</td>
     <th width="15%">领导批示意见</th>
     <td>${jwReceivedDocs.leadmemo}</td>
	 <th width="15%">批示日期</th>
     <td>${jwReceivedDocs.leaddt}</td>
  </tr>
 
    <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">文件</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <%
     	String fpath = "";
     	for(Iterator<JwAttachfile> it = jwReceivedDocs.getJwAttachfiles().iterator();it.hasNext();){
     		fpath = it.next().getFilepath().replace("\\","/");
     		System.out.println(fpath);
     		%>
     		<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
     		<a href="http://10.224.5.177:8081<%=fpath%>">路径:<%=fpath%></a>
     		<%
     	}
     %>
	 </td>
  </tr> 
  
</table>