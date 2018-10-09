<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.jw.JwSentDocsService"%>
<%@page import="com.gdssoft.oa.model.jw.JwSentDocs"%>
<%@page import="com.gdssoft.oa.model.jw.JwAttachfile"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.Iterator"%>
<%
	String id = request.getParameter("id");
    JwSentDocsService jdService = (JwSentDocsService) AppUtil
			.getBean("jwSentDocsService");
    JwSentDocs jwSentDocs = new JwSentDocs();
	if (StringUtils.isNotEmpty(id)) {
		jwSentDocs = jdService.get(new Long(id));
	}
	request.setAttribute("jwSentDocs",jwSentDocs);
%>

<h1 align="center" style="padding:10px;font-size:20px;">${jwSentDocs.subject}</h1>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">发文字号</th>
     <td>${jwSentDocs.docnum}/></td>
     <th width="15%">处理笺名称</th>
     <td>${jwSentDocs.unittitle}</td>
     <th width="15%">紧急程度</th>
     <td>${jwSentDocs.urgencydegree}</td>
  </tr>
   <tr>
     <th width="15%">密级</th>
     <td>${jwSentDocs.securitydegree}</td>
     <th width="15%">签发</th>
     <td>${jwSentDocs.signissuebody}</td>
     <th width="15%">会签领导</th>
     <td>${jwSentDocs.signjointlybody}</td>
  </tr>

   <tr>
  <th width="15%">主送单位</th>
     <td>${jwSentDocs.todept}</td>
     <th width="15%">抄送单位</th>
     <td>${jwSentDocs.ccdept}</td>
     <th width="15%">拟稿部门</th>
     <td>${jwSentDocs.composeunit}</td>
  </tr>
   <tr>
     <th width="15%">拟稿人</th>
     <td>${jwSentDocs.composeuser}</td>
     <th width="15%">核稿人</th>
     <td>${jwSentDocs.checkuser}</td>
	 <th width="15%">打印</th>
     <td>${jwSentDocs.printuser}</td>
  </tr>
 
  <tr>
     <th width="15%">校稿</th>
     <td>${jwSentDocs.proofuser}</td>
	 <th width="15%">发文单位</th>
     <td>${jwSentDocs.dispatchunit}</td>
	 <th width="15%">文种</th>
     <td>${jwSentDocs.docclass}</td>
  </tr>
  <tr>
     <th width="15%">行文方向</th>
     <td>${jwSentDocs.docway}</td>
	 <th width="15%">主题词</th>
     <td colspan="3">${jwSentDocs.topic}</td>
  </tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">文件</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <%
     	String fpath = "";
     	for(Iterator<JwAttachfile> it = jwSentDocs.getJwAttachfiles().iterator();it.hasNext();){
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