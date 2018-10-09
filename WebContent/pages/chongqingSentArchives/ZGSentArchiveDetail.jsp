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
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.flow.ProcessForm"%>
<%
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	if(StringUtils.isNotEmpty(archiveId)&&archiveId.indexOf("$")==-1){
		arch=arService.get(new Long(archiveId));
	}
	request.setAttribute("arch",arch);
	Map<String,List<ProcessForm>> processFormMap = null;
	if(null != arch){
		Long runId = arch.getProcessRun().getRunId();
		ProcessFormService processFormService = (ProcessFormService)AppUtil.getBean("processFormService");
		processFormMap  = processFormService.getProcessFormDetail(runId);
	}
	request.setAttribute("processFormMap",processFormMap);
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
	AppUserService appService = (AppUserService)AppUtil.getBean("appUserService");
	AppUser issUser=new AppUser();
	if(arch.getIssuerId()!=null){
		issUser=appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser",issUser);
%>

<link rel="stylesheet" type="text/css" href="<%=request.getContextPath()%>/css/admin.css" />
<h2 align="center" title="公文标题" style="font-size: 20px;padding:10px;">中共重庆市交通委员会发文处理笺</h2> 
<span style="float:right;padding-right:7px;padding-bottom:2px;">创建日期:<fmt:formatDate value="${arch.createtime}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">发文字号</th>
     <td>${arch.archivesNo == "0" ? "未生成编号":arch.archivesNo}</td>
     <th width="15%">紧急程度</th>
     <td>${arch.urgentLevel}</td>
     <th>密&nbsp;&nbsp;&nbsp;&nbsp;级</th>
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
     <th width="15%">是否规范</th>
     <td>${arch.isStandard == 0 ?"否":"是"}</td>
     <c:if test="${arch.privacyLevel!='一般'}">
	       <th width="15%">是否公开</th>
     	   <td>否 </td>
     </c:if>
     <c:if test="${arch.privacyLevel=='一般'}">
	       <th width="15%">是否公开</th>
     	   <td> ${arch.isPublic == 0?"否":"是"}</td>
     </c:if>
     <c:if test="${arch.privacyLevel!='一般'}">
	      <th width="15%">份&nbsp;&nbsp;&nbsp;&nbsp;数</th>
     	  <td>${arch.fileCounts}</td>
     </c:if>
     <c:if test="${arch.privacyLevel=='一般'}">
     	 <th></th>
	     <td width="15%"></td>
     </c:if>
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
		<th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
		<td colspan="5" style="height:80px;padding-top:5px;" valign="top"><c:forEach var="doc" items="${arch.archivesDocs}">
				<a href="<%=request.getContextPath()%>/attachFiles/${doc.fileAttach.filePath}" target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		  </c:forEach></td>
	</tr>
	<tr>
		<th width="15%" style="height:80px;padding-top:5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
		<td colspan="5" style="height:80px;padding-top:5px;" valign="top"><c:forEach var="fa" items="${faList}">
				<a href="<%=request.getContextPath()%>/attachFiles/${fa.filePath}"
					target="_blank">${fa.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		    </c:forEach></td>
	</tr>
	<c:if test="${arch.privacyLevel=='一般'}">
	   <c:if test="${arch.isPublic == 0}">
	  	<tr>
	     <th width="15%">不公开原因</th>
	     <td colspan="5">${arch.unPublicReasons}</td>
	  	</tr>
	  </c:if>
  </c:if>
 <c:if test="${!empty processFormMap}">
	  <c:if test="${processFormMap['处室会签(部门发起)']!=null}">
		  <tr>
			  <th>处室会签(部门发起)</th>
			  <td colspan="5" ><c:forEach items='${processFormMap["处室会签(部门发起)"]}' var ="form"><ul style="height:10px;padding-top:3px;"><li style="list-style:none;float:left;width:65px;">${form.creatorName}:</li><li style="list-style:none;float:left;width:120px"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy-MM-dd HH:mm"/></li><li style="list-style:none;float:left">${form.comments}</li></ul><br>
			 </c:forEach></td>
		  </tr>
	  </c:if>
	   <c:if test="${processFormMap['办公室审核']!=null}">
		  <tr>
			  <th>办公室审核</th>
			  <td colspan="5" ><c:forEach items='${processFormMap["办公室审核"]}' var ="form"><ul style="height:10px;padding-top:3px;"><li style="list-style:none;float:left;width:65px;">${form.creatorName}:</li><li style="list-style:none;float:left;width:120px"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy-MM-dd HH:mm"/></li><li style="list-style:none;float:left">${form.comments}</li></ul><br>
			 </c:forEach></td>
		  </tr>
	  </c:if>
	  <c:if test="${processFormMap['处室会签(办公室发起)']!=null}">
		  <tr>
			  <th>处室会签(办公室发起)</th>
			  <td colspan="5" ><c:forEach items='${processFormMap["处室会签(办公室发起)"]}' var ="form"><ul style="height:10px;padding-top:3px;"><li style="list-style:none;float:left;width:65px;">${form.creatorName}:</li><li style="list-style:none;float:left;width:120px"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy-MM-dd HH:mm"/></li><li style="list-style:none;float:left">${form.comments}</li>
			 </ul><br></c:forEach></td>
		  </tr>
	  </c:if>
	   <c:if test="${processFormMap['领导会签']!=null}">
		  <tr>
			  <th>领导会签</th>
			  <td colspan="5" ><c:forEach items='${processFormMap["领导会签"]}' var ="form"><ul style="height:10px;padding-top:3px;"><li style="list-style:none;float:left;width:65px;">${form.creatorName}:</li><li style="list-style:none;float:left;width:120px"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy-MM-dd HH:mm"/></li><li style="list-style:none;float:left">${form.comments}</li></ul><br>
			 </c:forEach></td>
		  </tr>
	  </c:if>
	  <c:if test="${processFormMap['签发']!=null}">
		  <tr>
			  <th>签&nbsp;&nbsp;&nbsp;&nbsp;发</th>
			  <td colspan="5" ><c:forEach items='${processFormMap["签发"]}' var ="form"><ul style="height:10px;padding-top:3px;"><li style="list-style:none;float:left;width:65px;">${form.creatorName}:</li><li style="list-style:none;float:left;width:120px"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy-MM-dd HH:mm"/></li><li style="list-style:none;float:left">${form.comments}</li></ul><br>
			 </c:forEach></td>
		  </tr>
	  </c:if>
  </c:if>
</table>
