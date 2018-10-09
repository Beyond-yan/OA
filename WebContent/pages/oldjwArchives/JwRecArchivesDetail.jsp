<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.jw.JwRecArchivesService"%>
<%@page import="com.gdssoft.oa.model.jw.JwRecArchives"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="com.gdssoft.oa.model.jw.JwAttachfile"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.Iterator"%>
<%
	String id = request.getParameter("id");
    JwRecArchivesService jaService = (JwRecArchivesService) AppUtil
			.getBean("jwRecArchivesService");
    JwRecArchives jwRecArchives = new JwRecArchives();
	if (StringUtils.isNotEmpty(id)) {
		jwRecArchives = jaService.get(new Long(id));
	}
	request.setAttribute("jwRecArchives", jwRecArchives);
%>

<h1 align="center" style="padding:10px;font-size:20px;">${jwRecArchives.subject}</h1>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
   
     <th width="15%">来文字号</th>
     <td>${jwRecArchives.bumfno}</td>
     <th width="15%">收文编号</th>
     <td>${jwRecArchives.inbumfno}</td>
  </tr>
   <tr>
     <th width="15%">收件类型</th>
     <td>${jwRecArchives.title}</td>
     <th width="15%">缓急</th>
     <td>${jwRecArchives.emergency}></td>
  </tr>
   <tr>
     <th width="15%">发文单位</th>
     <td>${jwRecArchives.sourcedepartment}</td>
      <th width="15%">年份</th>
     <td>${jwRecArchives.inbumfno_year}</td>
  </tr>
   <tr>
     <th width="15%">密级</th>
     <td>${jwRecArchives.secret}</td>
     <th width="15%">主题词</th>
     <td>${jwRecArchives.keywords}</td>
  </tr>
  <tr>
     <th width="15%">拟办意见</th>
     <td colspan="3">${jwRecArchives.niban}</td>
  </tr>
 <tr>
     <th width="15%">主办部门</th>
     <td>${jwRecArchives.zhuban}</td>
     <th width="15%">协办部门</th>
     <td>${jwRecArchives.subdepartment}</td>
  </tr>
  
    <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">文件</th>
     <td colspan="3" style="height:60px;padding-top:5px;" valign="top">
     <%
     	String fpath = "";
     	for(Iterator<JwAttachfile> it = jwRecArchives.getJwAttachfiles().iterator();it.hasNext();){
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