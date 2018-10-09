<%@page import="org.apache.velocity.runtime.directive.Foreach"%>
<%@ page pageEncoding="UTF-8"%>
<%
	String basePath=request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.service.system.FileAttachService"%>
<%@page import=" com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>
<%
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	if(StringUtils.isNotEmpty(archiveId)&&archiveId.indexOf("$")==-1){
		arch=arService.get(new Long(archiveId));
	}
	request.setAttribute("arch",arch);
	
	String fileIds = request.getParameter("fileIds");
	if( !fileIds.trim().isEmpty() && !"_".equals(fileIds)){
		FileAttachService fas = (FileAttachService)AppUtil.getBean("fileAttachService");
		ArrayList<FileAttach> faList = new ArrayList<FileAttach>();
		for(String fileId : fileIds.split(",")){
			FileAttach fa = fas.get(new Long(fileId));
			if(fa!=null){
				faList.add(fa);
			}
		}
		request.setAttribute("faList",faList);
	}
	
%>



<h2 align="center" title="公文标题" style="font-size: 14px;padding:5px;">${arch.subject}</h2> 

<span style="float:right;padding-right:10px;">创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">来文文字号</th>
     <td>${arch.archivesNo}</td>
     <th width="15%">紧急程度</th>
     <td>${arch.urgentLevel}</td>
     <th>秘密等级</th>
     <td nowrap="nowrap">${arch.privacyLevel}</td>
  </tr>
   <tr>
     <th width="15%">主送</th>
     <td colspan="5">${arch.recDepNames}</td>
  </tr>
  <tr>
     <th width="15%">抄送(抄报)</th>
     <td colspan="5">${ccNames}</td>
  </tr>
  <tr>
     <th width="15%">拟稿单位</th>
     <td>${arch.issueDep}</td>
     <th width="15%">拟稿人</th>
     <td>${arch.issuer}</td>
     <th width="15%">核稿</th>
     <td nowrap="nowrap">--</td>
  </tr>
  <tr>
     <th width="15%">印刷</th>
     <td>${arch.archPrinter}</td>
     <th width="15%">核对</th>
     <td>${arch.archChecker}</td>
     <th width="15%">份数</th>
     <td>${arch.fileCounts}</td>
  </tr>
 <tr>
     <th width="15%">发文单位</th>
     <td>${arch.issueDep}</td>
     <th width="15%">文种</th>
     <td><%-- ${arch.archivesType?arch.archivesType.typeName:''} --%></td>
     <th width="15%">行文方向</th>
     <td>${arch.sources}</td>
  </tr>

  <tr>
     <th width="15%">主题词</th>
     <td colspan="5">${arch.keywords}</td>
  </tr>
  <tr>
     <th width="15%">标题</th>
     <td colspan="5">${arch.subject}</td>
  </tr>
  <tr>
     <th width="15%">领导意见</th>
     <td colspan="5">
       <ul>
       <c:forEach var="leader" items="${arch.leaders}">
           <li>${leader.leaderOpinion}&nbsp;&nbsp; ${leader.leaderName}&nbsp;&nbsp;<fmt:formatDate
			value="${leader.createtime}" pattern="yyy-MM-dd HH:mm:ss" /></li>
       </c:forEach>
       </ul>
    </td>
  </tr>
</table>
<div style="padding:10px;word-wrap:break-word;">
  <span style="font-weight: bolder">公文原件：</span>
  <c:forEach var="doc" items="${arch.archivesDocs}">
      <a href="<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
  </c:forEach>
</div>
<div style="padding:10px;word-wrap:break-word;">
  <span style="font-weight: bolder">公文附件：</span>
  <c:forEach var="fa" items="${faList}">
      <a href="<%=request.getContextPath()%>/attachFiles/${fa.filePath}" target="_blank">${fa.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
  </c:forEach>
</div>
