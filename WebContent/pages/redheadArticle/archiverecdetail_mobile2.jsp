<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="java.util.Set"%>
<%
	String archivesId = request.getParameter("archivesId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	Archives parArch=new Archives();
	if(StringUtils.isNotEmpty(archivesId)){
		arch=arService.get(new Long(archivesId));
	}
	String ccIds = "";
	String ccNames = "";
	Set<AppUser> archivesCC = arch.getArchivesCCs();
	if (!(archivesCC == null || archivesCC.isEmpty())) {
		for (AppUser au : archivesCC) {
			if (au.getUsername().equals("L39999")) {
				ccIds = ccIds + au.getId();
				ccNames = ccNames + au.getFullname();
				ccIds = ccIds + ",";
				ccNames = ccNames + ",";
			}
		}
	}
	if (!(archivesCC == null || archivesCC.isEmpty())) {
		for (AppUser au : archivesCC) {
			if (au.getUsername().equals("L30025")) {
				ccIds = ccIds + au.getId();
				ccNames = ccNames + au.getFullname();
				ccIds = ccIds + ",";
				ccNames = ccNames + ",";
			}
		}
	}
	if (!(archivesCC == null || archivesCC.isEmpty())) {
		for (AppUser au : archivesCC) {
			if (au.getUsername().equals("L00097")) {
				ccIds = ccIds + au.getId();
				ccNames = ccNames + au.getFullname();
				ccIds = ccIds + ",";
				ccNames = ccNames + ",";
			}
		}

	}
	if (!(archivesCC == null || archivesCC.isEmpty())) {
		for (AppUser au : archivesCC) {
			if (au.getUsername().equals("L000086")) {
				ccIds = ccIds + au.getId();
				ccNames = ccNames + au.getFullname();
				ccIds = ccIds + ",";
				ccNames = ccNames + ",";
			}
		}

	}
	if(!(ccIds.equals("")||ccIds=="")){
		ccIds=ccIds.substring(0, ccIds.length() - 1);
		ccNames=ccNames.substring(0, ccNames.length() - 1);
	}
	request.setAttribute("ccNames",ccNames);
	request.setAttribute("arch",arch);

	
	//long runId = arch.getProcessRun().getRunId();
	//String piId = arch.getProcessRun().getPiId();
	//out.print(runId);
	//out.print(piId);
	//request.setAttribute("runId",runId);
	//request.setAttribute("piId",piId);
%>

<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/archivedetail.css" />
<%-- <table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
	<th width="25%">来文审批信息</th>
	<td width="75%"><a href="#"  onclick="openParentSPView('${runId}','${runId}','${piId}','${runId}')">来文审批信息</a></td>
</table> --%>


<h3 align="center" style="padding:10px;font-size:20px;">深圳市地铁三号线运营分公司</h3> 

<span style="float:right;padding-right:10px;">拟稿日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  
  <tr>
  	 <th width="15%">标题</th>
  	 <td>${arch.subject}</td>
  	  <th width="15%">秘密等级</th>
     <td>${arch.privacyLevel}</td>
  </tr>
  <tr>
     <th width="15%">拟稿单位</th>
     <td>${arch.issueDep}</td>
      <th width="15%">拟稿人</th>
     <td>${arch.issuer}</td>
  </tr>
  <tr>
  	 <th width="15%">发行范围</th>
  	 <td colspan="4">${arch.recDepNames}</td>
  </tr>
   <tr>
     <th width="15%">抄报</th>
     <td colspan="4">${ccNames}<!--
	     <c:forEach var="appUser" items="${parArch.archivesCCs}">
	       ${appUser.fullname}&nbsp;
		 </c:forEach>
	 --></td>
  </tr>
	 <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">相关附件</th>
     <td colspan="3" style="height:80px;padding-top:5px;" valign="top">
	     <c:forEach var="doc" items="${arch.archivesDocs}">
	          <c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
	         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?fname=<%=java.net.URLEncoder.encode(pageContext.getAttribute("fileName").toString(),"UTF-8")%>&fpath=attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach>
	 </td>
  </tr>
</table>

