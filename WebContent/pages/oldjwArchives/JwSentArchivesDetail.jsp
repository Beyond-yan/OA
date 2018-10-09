<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.jw.JwSentArchivesService"%>
<%@page import="com.gdssoft.oa.model.jw.JwSentArchives"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="com.gdssoft.oa.model.jw.JwAttachfile"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.Iterator"%>
<%
	String id = request.getParameter("id");
    JwSentArchivesService jaService = (JwSentArchivesService) AppUtil
			.getBean("jwSentArchivesService");
    JwSentArchives jwSentArchives = new JwSentArchives();
	if (StringUtils.isNotEmpty(id)) {
		jwSentArchives = jaService.get(new Long(id));
	}
	request.setAttribute("jwSentArchives", jwSentArchives);
%>

<h1 align="center" style="padding:10px;font-size:20px;">${jwSentArchives.subject}</h1>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
      <th width="15%">发文编号</th>
     <td>${jwSentArchives.bumfno}</td>
     <th width="15%">拟稿日期</th>
     <td>${jwSentArchives.bumfday}</td>
  </tr>
    <tr>
      <th width="15%">拟稿</th>
     <td>${jwSentArchives.writer}</td>
     <th width="15%">拟稿部门</th>
     <td>${jwSentArchives.bumfDepartment}</td>
  </tr>
    <tr>
      <th width="15%">发文单位</th>
     <td>${jwSentArchives.sourcedepartment}</td>
     <th width="15%">处理笺</th>
     <td>${jwSentArchives.title}</td>
  </tr>
    <tr>
      <th width="15%">文种</th>
     <td>${jwSentArchives.bumfType}</td>
     <th width="15%">行文方向</th>
     <td>${jwSentArchives.bumfTo}</td>
  </tr>
  <tr>
   <tr>
     <th width="15%">密级</th>
     <td>${jwSentArchives.secret}</td>
     <th width="15%">缓急</th>
     <td>${jwSentArchives.emergency}></td>
  </tr>
    <tr>
     <th width="15%">核稿</th>
     <td>${jwSentArchives.checker}</td>
     <th width="15%">打印</th>
     <td>${jwSentArchives.printer}></td>
  </tr>
      <tr>
     <th width="15%">校对</th>
     <td>${jwSentArchives.proof}</td>
     <th width="15%">签发</th>
     <td>${jwSentArchives.subscriber}></td>
  </tr>

     <th width="15%">主题词</th>
     <td colspan="3">${jwSentArchives.keywords}</td>
  </tr>
   <tr>
     <th width="15%">主送</th>
     <td>${jwSentArchives.toDepartment}</td>
     <th width="15%">抄送</th>
     <td>${jwSentArchives.copytoDepartment}></td>
  </tr>
  
    <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">文件</th>
     <td colspan="3" style="height:60px;padding-top:5px;" valign="top">
     <%
     	String fpath = "";
     	for(Iterator<JwAttachfile> it = jwSentArchives.getJwAttachfiles().iterator();it.hasNext();){
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