<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.system.SysDataTransferService"%>
<%@page import="com.gdssoft.oa.model.system.SysDataTransfer"%>
<%@page import="com.gdssoft.oa.service.system.SysDataTransferHisService"%>
<%@page import="com.gdssoft.oa.model.system.SysDataTransferHis"%>
<%@page import="com.gdssoft.oa.model.system.SysArchivesFiles"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.*"%>
<%
	String archType = request.getParameter("archType");
	String archivesId = request.getParameter("archivesId");
	String down = request.getParameter("down");
	request.setAttribute("down", down);
	
	
	if("2" == archType || "2".equals(archType)){
		SysDataTransferHisService arService = (SysDataTransferHisService) AppUtil
				.getBean("sysDataTransferHisService");
	SysDataTransferHis arch = new SysDataTransferHis();
	if (StringUtils.isNotEmpty(archivesId)) {
		arch = arService.getDep(new Long(archivesId));
	}
	request.setAttribute("archType", 2 );
	request.setAttribute("arch", arch);
	}else{
		SysDataTransferService arService = (SysDataTransferService) AppUtil
					.getBean("sysDataTransferService");
		SysDataTransfer arch = new SysDataTransfer();
		if (StringUtils.isNotEmpty(archivesId)) {
			arch = arService.getDep(new Long(archivesId));
		}
		request.setAttribute("archType", 1);
		request.setAttribute("arch", arch);
		int docCount  = arch.getSysArchivesFiless().size()-arch.getArchivesFiles().size();
		request.setAttribute("docCount", docCount);
		System.out.println(docCount);
	}
%>
<span style="float:right;padding-right:10px;padding-bottom:4px;">创建日期:<fmt:formatDate value="${arch.createDate}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" cellpadding="0" cellspacing="1" width="98%" align="center">
  <tr>
     <th width="15%">发文字号</th>
     <td>${arch.archivesno == "0" ? "未生成编号":arch.archivesno}</td>
     <th width="15%">紧急程度</th>
     <td>${arch.urgentlevel}</td>
     <th>秘密等级</th>
     <td nowrap="nowrap">${arch.privacylevel}</td>
  </tr>
  <tr>
     <th width="15%">发文单位</th>
     <td>${arch.confs.depName}</td>
     <th width="15%">文&nbsp;&nbsp;&nbsp;&nbsp;种</th>
     <td> ${arch.sources}</td>
     <th width="15%">拟&nbsp;稿&nbsp;人</th>
     <td>${arch.issuer}</td>
  </tr>
   <tr>
     <th width="15%">密&nbsp;&nbsp;&nbsp;&nbsp;级</th>
     <td>${arch.privacylevel}</td>
     <th width="15%">缓&nbsp;&nbsp;&nbsp;&nbsp;急</th>
     <td>${arch.urgentlevel}</td>
     <th width="15%"></th>
     <td></td>
  </tr>
  <tr>
     <th width="15%">来文单位</th>
     <td colspan="5">${arch.sendDep}</td>
  </tr>
  <tr>
     <th width="15%">标&nbsp;&nbsp;&nbsp;&nbsp;题</th>
     <td colspan="5">${arch.subject}</td>
  </tr>
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">正&nbsp;&nbsp;&nbsp;&nbsp;文</th>
     <td colspan="5" style="height:60px;padding-top:5px;" valign="top">
		     <c:if test="${archType == 2}">
		     	<c:forEach var="doc" items="${arch.sysArchivesFiless}">
			     	<c:if test="${doc.fileType==1}">
			          <c:set var="fileName" value="${doc.fileName}"></c:set>
			          	<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
				         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?hisId=${doc.id}&fpath=attachFiles/${doc.filePath}" target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
					 </c:if>
					 </c:forEach>
		     </c:if>
		     
		     <c:if test="${down == 1}">
			     <c:if test="${archType == 1}">
				     <c:forEach var="doc" items="${arch.sysArchivesFiless}">
				     	<c:if test="${doc.fileType==1}">
				          <c:set var="fileName" value="${doc.fileName}"></c:set>
				          	<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
					         <a href="<%=request.getContextPath()%>/pages/downFile.jsp?id=${doc.id}&fpath=attachFiles/${doc.filePath}" target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
						 </c:if>
						 </c:forEach>
					</c:if> 
				</c:if>
				
				<c:if test="${down == 0}">
			     	<c:if test="${archType == 1}">
					   	  <c:forEach var="doc" items="${arch.sysArchivesFiless}">
		    					<c:if test="${doc.fileType==1}">
		    					<c:if test="${doc.isFinish==1}">
				    				<c:set var="fileName" value="${doc.fileName}"></c:set>
				    				<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
				    				${doc.fileName}
			    						<a href="<%=request.getContextPath()%>/pages/transferDownFile.jsp?fileId=${doc.id}&id=${arch.id}" target="_blank"><span style="padding-left:10px;font-size:15px"><b><font color="red">下载</a>&nbsp;&nbsp;&nbsp;&nbsp;
		    					</c:if>
		    					</c:if>
							 </c:forEach>
						</c:if>
				</c:if>
				
	 </td>
  </tr> 
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
     <td colspan="5" style="height:80px;padding-top:5px;" valign="top">
     	 
		     <c:if test="${archType == 2}">
		     	<c:forEach var="file" items="${arch.sysArchivesFiless}">
				    <c:if test="${file.fileType==2}">
				     	  <img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
					      <a href="<%=request.getContextPath()%>/pages/downFile.jsp?id=${file.id}&fpath=attachFiles/${file.filePath}" target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
					 </c:if>
				  </c:forEach>
		     </c:if>
		     <c:if test="${archType == 1}">
			    <c:forEach var="file" items="${arch.sysArchivesFiless}">
				    <c:if test="${file.fileType==2}">
				     	  <img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
					      <a href="<%=request.getContextPath()%>/pages/downFile.jsp?id=${file.id}&fpath=attachFiles/${file.filePath}" target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
					 </c:if>
				  </c:forEach>
				 </c:if>
	 </td>
  </tr>
</table>