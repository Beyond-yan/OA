<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService"%>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.model.flow.ProcessForm"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="com.gdssoft.oa.service.system.AppUserService"%>
<%@page import="java.util.*"%>
<%
	String basePath = request.getContextPath();
	SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	String currentDate = formatter.format(new Date());
	String archiveId = request.getParameter("archiveId");
	ArchivesService arService = (ArchivesService)AppUtil.getBean("archivesService");
	Archives arch=new Archives();
	Archives parArch=new Archives();
	if(StringUtils.isNotEmpty(archiveId)&&archiveId.indexOf("$")==-1){
		arch = arService.get(new Long(archiveId));
		Long parentId=arch.getParentArchId();
		if(parentId!=null){
	parArch=arService.get(parentId);
		}else{
	parArch=arch;
		}
	}
	request.setAttribute("arch",arch);
	String defId = request.getParameter("defId");
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
	Map<String,List<ProcessForm>> processFormMap = null;
	List pfList=new ArrayList();
	if(null != arch){
		Long runId = arch.getProcessRun().getRunId();
		ProcessFormService processFormService = (ProcessFormService)AppUtil.getBean("processFormService");
		processFormMap  = processFormService.getProcessFormDetail(runId);
		pfList=processFormService.getByRunId(runId);
	}
	request.setAttribute("pfList",pfList);
	request.setAttribute("processFormMap",processFormMap);
	AppUserService appService = (AppUserService)AppUtil.getBean("appUserService");
	AppUser issUser=new AppUser();
	if(arch.getIssuerId()!=null){
		issUser=appService.get(arch.getIssuerId());
	}
	request.setAttribute("issUser",issUser);
	String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent));
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>打印</title>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<script src="../js/main.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/css/admin.css" />
<script type="text/javascript"
	src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript"
	src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<script language="javascript" src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script>
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/resources/css/ext-all.css" />
<script type="text/javascript">
  var hkey_root,hkey_path,hkey_key
  hkey_root="HKEY_CURRENT_USER"
  hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\"
  //设置网页打印的页眉页脚为空
  function pagesetup_null(){
  try{
  var RegWsh = new ActiveXObject("WScript.Shell")
  hkey_key="header"
  RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
  hkey_key="footer"
  RegWsh.RegWrite(hkey_root+hkey_path+hkey_key,"")
  }catch(e){}
  }
  pagesetup_null(); 
</script>
<script language="javascript">
function stamp(){
	$("#print").jqprint();
}
</script>
<style media=print>
.Noprint {
	display: none;
}

.PageNext {
	page-break-after: always;
}
</style>
<style>
body, td, th {
	font-size: 12px;
	font-family: "黑体";
}

.NOPRINT {
	font-family: "宋体";
	font-size: 12px;
}

#printBody table {
	border: 2px solid #000000;
}

#printBody td {
	border: 1.5px solid #000000;
	padding-top: 5px;
	padding-left: 10px;
	font-size: 14px;
}
</style>
</head>
<body>
	<OBJECT id=WebBrowser
		classid=CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 height=0 width=0
		VIEWASTEXT></OBJECT>
	<div align="right" class="Noprint" style="padding-right: 20px;">
		<c:if test="${browser=='Chrome'}">
			<a href="#" onclick="stamp()" style="text-decoration: none;"><img src="../../images/btn/print/Archprint1.gif" width="30px" height="30px" align="middle"/>打印</a>
		</c:if>
		<c:if test="${browser=='IE'}">
    		<a href="#" onclick="document.all.WebBrowser.ExecWB(6,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint1.gif" width="30px" height="30px" align="middle"/>打印</a>
    		<a href="#" onclick="document.all.WebBrowser.ExecWB(8,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint2.gif" width="30px" height="30px" align="middle"/>页面设置</a>
    		<a href="#" onclick="document.all.WebBrowser.ExecWB(7,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint3.gif" width="30px" height="30px" align="middle"/>打印预览</a>
    	</c:if>
	</div>
	<div id="print">	
	<h1 align="center" style="padding: 10px; font-size: 24px;">${proDef.name}</h1>
	<center>
		<div id="printBody">
			<table border="1" width="98%" align="center"
				style="border: 1px; solid #000; border-collapse: collapse;">
				<tr align="left" style="height: 35px;">
					<td width="50%"><span
						style="display: inline-block; width: 80px; color: #0168B7;">申请部门:</span>${arch.orgDepName}</td>
					<td width="25%"><span
						style="display: inline-block; width: 80px; color: #0168B7;">申请人:</span>${arch.issuer}</td>
					<td width="25%"><span
						style="display: inline-block; width: 80px; color: #0168B7;">缓急:</span>${arch.urgentLevel}</td>
				</tr>
				<tr align="left">
					<td colspan="3" valign="middle"><span
						style="display: inline-block; width: 80px; color: #0168B7;">标题:</span>${arch.subject}</td>
				</tr>
				<tr align="left">
					<td colspan="3" valign="middle"><span
						style="display: inline-block; width: 76px; color: #0168B7;">正文:</span>
						<c:forEach var="doc" items="${arch.archivesDocs}">
							<c:set var="fileName" value="${doc.fileAttach.fileName}"></c:set>
							<img src="<%=request.getContextPath()%>/images/flag/attachment.png" />
							<a
								href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${doc.fileAttach.fileId}"
								target="_blank">${doc.fileAttach.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
					 </c:forEach></td>
				</tr>
				<tr align="left">
					<td colspan="3" valign="middle"><span
						style="display: inline-block; width: 76px; color: #0168B7;">附件:</span>
						<c:forEach var="file" items="${arch.archivesFiles}">
							<a
								href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}"
								target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		 </c:forEach></td>
				</tr>
				<tr align="left">
					<td colspan="3" valign="middle"><span
						style="display: inline-block; width: 80px; color: #0168B7;">备注:</span>${arch.shortContent}</td>
				</tr>
			</table>
			<table class="table-info" border="1" align="center" style="border:1px ;solid #000;border-collapse: collapse;" width="98%">
		<tr>
			<th align="left" colspan="7" valign="middle"><h2>流程审批信息</h2></th>
		</tr>
		<tr>
			<th width="100">序号</th>
			<th width="130">任务名</th>
			<th width="120">办理人</th>
			<th width="110">办理时间</th>
			<th colspan="3">办理意见</th>
		</tr>
		<c:forEach items="${pfList}" var="processForm" varStatus="i">
		<tr>
			<td align="center">${i.count}</td>
			<td>${processForm.activityName}</td>
			<td>${processForm.creatorName}</td>
			<td><fmt:formatDate value="${processForm.createtime}" pattern="yyyy-MM-dd HH:mm"/></td>
			<td colspan="3">
			<c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}</td>
		</tr>
		</c:forEach>
</table>
		</div>
	</center>
	</div>
</body>
</html>