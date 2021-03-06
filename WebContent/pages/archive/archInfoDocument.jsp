<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String archivesId = request.getParameter("archivesId");
	ArchivesService arService = (ArchivesService) AppUtil
			.getBean("archivesService");
	Archives arch = new Archives();
	if (StringUtils.isNotEmpty(archivesId)) {
		arch = arService.get(new Long(archivesId));
	}
	request.setAttribute("arch", arch);
	String defId = request.getParameter("defId");
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
	String archType = request.getParameter("archType");
	request.setAttribute("archType", archType);
	AppUserService appService = (AppUserService)AppUtil.getBean("appUserService");
	AppUser issUser=new AppUser();
	if(arch.getIssuerId()!=null){
		issUser=appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser",issUser);
%>

<h1 align="center" style="padding:10px;font-size:20px;"> ${proDef.name}</h1>
<span style="float:right;padding-right:10px;padding-bottom:4px;">创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<c:if test="${archType==1}">
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">收文编号</th>
     <td>${arch.archivesNo==0?'未生成编号':arch.archivesNo}</td>
     <th width="15%">收文日期</th>
     <td><fmt:formatDate value="${arch.issueDate}" pattern="yyyy-MM-dd"/></td>
     <th width="15%">来文编号</th>
     <td>${arch.depSignNo}</td>
  </tr>
   <tr>
     <th width="15%">密&nbsp;&nbsp;&nbsp;&nbsp;级</th>
     <td>${arch.privacyLevel}</td>
     <th width="15%">缓&nbsp;&nbsp;&nbsp;&nbsp;急</th>
     <td>${arch.urgentLevel}</td>
     <th width="15%">成文日期</th>
     <td><fmt:formatDate value="${arch.writtenDate}" pattern="yyyy-MM-dd"/></td>
  </tr>
 
  <c:if test="${arch.fileCounts !=null }">
   <tr>
  <th width="15%">份&nbsp;&nbsp;&nbsp;&nbsp;号</th>
     <td>${arch.fileCounts}</td>
     <th width="15%">来文类型</th>
     <td>${arch.archivesType.typeName}</td>
     <th width="15%">限办日期</th>
     <td><fmt:formatDate value="${arch.limitedDate}" pattern="yyyy-MM-dd"/></td>
  </tr>
 </c:if>   
  <c:if test="${arch.fileCounts ==null }">
   <tr>
     <th width="15%">来文类型</th>
     <td>${arch.archivesType.typeName}</td>
     <th width="15%">限办日期</th>
     <td colspan='3'><fmt:formatDate value="${arch.limitedDate}" pattern="yyyy-MM-dd"/></td>
  </tr>
 </c:if>  
  <tr>
     <th width="15%">来文单位</th>
     <td colspan="5">${arch.issueDep}</td>
  </tr>
  <tr>
     <th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
     <td colspan="5">${arch.subject}</td>
  </tr>
 <tr>
     <th width="15%">主办部门</th>
     <td colspan="5">${arch.orgDepName}</td>
  </tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
     <c:forEach var="doc" items="${arch.archivesDocs}">
          <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
           	<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
	         ${doc.fileAttach.fileName}<a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=${doc.fileAttach.fileName}&fpath=<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank"><span style="padding-left:10px">下载</span></a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr> 
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
     <td colspan="5" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="fa" items="${arch.archivesFiles}">
	     <img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
	      ${fa.fileName}<a href="<%=request.getContextPath()%>/attachFiles/${fa.filePath}" target="_blank"><span style="padding-left:10px">下载</span></a>&nbsp;&nbsp;&nbsp;&nbsp;
	  	 </c:forEach>
	 </td>
  </tr>
</table>
</c:if>
<c:if test="${archType==0}">
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">发文字号</th>
     <td>${arch.archivesNo == "0" ? "未生成编号":arch.archivesNo}</td>
     <th width="15%">紧急程度</th>
     <td>${arch.urgentLevel}</td>
     <th>秘密等级</th>
     <td nowrap="nowrap">${arch.privacyLevel}</td>
  </tr>
   <tr>
     <th width="15%">拟稿单位</th>
     <td>${issUser.department.depName}</td>
     <th width="15%">拟&nbsp;稿&nbsp;人</th>
     <td>${arch.issuer}</td>
     <th width="15%">核&nbsp;&nbsp;&nbsp;&nbsp;稿</th>
     <td nowrap="nowrap">${arch.reviewUserName}</td>
  </tr>
 <tr>
     <th width="15%">发文单位</th>
     <td>${arch.issueDep}</td>
     <th width="15%">文&nbsp;&nbsp;&nbsp;&nbsp;种</th>
     <td> ${arch.archivesType.typeName}</td>
     <th width="15%">行文方向</th>
     <td>${arch.sources}</td>
  </tr>
  <tr>
     <th width="15%">规范性文件</th>
     <td>${arch.isStandard == 0 ?"否":"是"}</td>
     <th width="15%">是否公开</th>
     <td> ${arch.isPublic == 0?"否":"是"}</td>
      <th width="15%">份&nbsp;&nbsp;&nbsp;&nbsp;数</th>
     <td>${arch.fileCounts}</td>
  </tr>
   <tr>
     <th width="15%">主&nbsp;&nbsp;&nbsp;&nbsp;送</th>
     <td colspan="5">${arch.sendTo}</td>
  </tr>
  <tr>
     <th width="15%">抄&nbsp;&nbsp;&nbsp;&nbsp;送</th>
     <td colspan="5">${arch.ccTo}</td>
  </tr>
  <tr>
     <th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
     <td colspan="5">${arch.subject}</td>
  </tr>
  <tr>
  <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</td>
  <td colspan="5" style="height:80px;padding-top:5px;" valign="top">
  	<c:forEach var="doc" items="${arch.archivesDocs}">
  	  <img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
     <!--   <a href="<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;-->
 	 <!--  <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=${doc.fileAttach.fileName}&fpath=<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;-->
 	 ${doc.fileAttach.fileName}
 	 <c:if test='${!fn:contains(doc.fileAttach.fileName,".doc")}'>
 	 	<a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=${doc.fileAttach.fileName}&fpath=attachFiles/${doc.fileAttach.filePath}" target="_blank"><span style="padding-left:10px;font-size:15px"><b><font color="red">下载</font></b></span></a>&nbsp;&nbsp;&nbsp;&nbsp;
 	 </c:if>
 	 </c:forEach>
  </td>
  </tr>
   <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
     <td colspan="5" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="fa" items="${arch.archivesFiles}">
	     	  <img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
		      ${fa.fileName}
		      <%-- <c:if test='${!fn:contains(fa.fileName,".doc")}'> --%>
		      <a href="<%=request.getContextPath()%>/attachFiles/${fa.filePath}" target="_blank"><span style="padding-left:10px;font-size:15px"><b><font color="red">下载</font></b></span></a>&nbsp;&nbsp;&nbsp;&nbsp;
		      <%-- </c:if> --%>
		  </c:forEach>
	 </td>
  </tr>
  <c:if test="${arch.isPublic == 0}">
  	<tr>
     <th width="15%">不公开原因</th>
     <td colspan="5">${arch.unPublicReasons}</td>
  </tr>
  </c:if>
</table>
</c:if>