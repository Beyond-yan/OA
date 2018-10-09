<%@page import="com.gdssoft.oa.model.system.AppRole"%>
<%@ page import="java.util.*"%>
<%@ page import="com.gdssoft.core.util.ContextUtil"%>
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
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.service.system.SysConfigService"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.model.system.SysConfig"%>
<%@page import="com.gdssoft.oa.service.system.SysDataTransferService"%>
<%@page import="com.gdssoft.oa.model.system.SysDataTransfer"%>
<%@page import="com.gdssoft.oa.model.system.SysSchemaConfig"%>
<%@page import="com.gdssoft.oa.service.system.SysSchemaConfigService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%
	String archivesId = request.getParameter("archivesId");
	String dataSource = request.getParameter("dataSource");
	String runid = request.getParameter("runid");
	String taskId = request.getParameter("taskId");
	String fromSchema = request.getParameter("fromSchema");
	request.setAttribute("dataSource", dataSource);
	request.setAttribute("runid", runid);
	SysDataTransferService arService = (SysDataTransferService) AppUtil
		.getBean("sysDataTransferService");
	SysDataTransfer arch = new SysDataTransfer();
	if (StringUtils.isNotEmpty(archivesId)) {
		arch = arService.getDep(new Long(archivesId));
	}
	request.setAttribute("arch", arch);
	if(dataSource!=null&&runid!=null){
		if(Integer.parseInt(dataSource)==0&&Integer.parseInt(runid)!=0){
			SysSchemaConfigService sysSchemaConfigService = (SysSchemaConfigService) AppUtil
					.getBean("sysSchemaConfigService");
			ProcessFormService processFormService = (ProcessFormService) AppUtil
					.getBean("processFormService");
			SysSchemaConfig schema=sysSchemaConfigService.get(new Long(fromSchema));
			String schemacode=schema.getSchemaCode();
			System.out.print(runid);
			List pfList=processFormService.getBySchemacodeRunId(new Long(runid), schemacode);
			//存放流程审批列表
			request.setAttribute("pfList", pfList);
		}
	}
	/* String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent)); */
%>
<head>
<title>直接打印</title>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<script src="../js/main.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/admin.css" />
<script type="text/javascript" src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<%--<script language="javascript" src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script> --%>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/ext3/resources/css/ext-all.css" />
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
    .Noprint{display:none;}  
    .PageNext{page-break-after:always;} 
    body,td,th    
    {  
        height: 10px;
    } 
</style>  
</head>
<body>
<OBJECT id=WebBrowser classid=CLSID:8856F961-340A-11D0-A96B-00C04FD705A2 height=0 width=0  VIEWASTEXT></OBJECT> 
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
<h1 align="center" style="padding:10px;font-size:20px;"> ${proDef.name}</h1>
<span style="float:right;padding-right:10px;padding-bottom:4px;">创建日期:<fmt:formatDate value="${arch.createDate}" pattern="yyyy-MM-dd"/></span>
<table class="table-info" width="98%" align="center" border="1" style="border:1px ;solid #000;border-collapse: collapse;">
  <tr>
		<th width="15%">收文单位</th>
		<td>${arch.confs.depName}</td>
		<th width="15%">成文日期</th>
		<td><fmt:formatDate value="${arch.writtenDate}"
				pattern="yyyy-MM-dd" /></td>
		<th width="15%">来文类型</th>
		<td>${arch.sources}</td>
	</tr>
	<tr>
		<th width="15%">密&nbsp;&nbsp;&nbsp;&nbsp;级</th>
		<td>${arch.privacylevel}</td>
		<th width="15%">缓&nbsp;&nbsp;&nbsp;&nbsp;急</th>
		<td>${arch.urgentlevel}</td>
		<th width="15%">来文编号</th>
		<td>${arch.archivesno}</td>
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
     <c:forEach var="doc" items="${arch.sysArchivesFiless}">
     	<c:if test="${doc.fileType==1}">
		<c:if test="${doc.isFinish==1}">
          <c:set var="fileName" value="${doc.fileName}"></c:set>
			<img
				src="<%=request.getContextPath()%>/images/flag/attachment.png" />
			<a
				href="<%=request.getContextPath()%>/pages/downFile.jsp?hisId=${doc.id}&fpath=attachFiles/${doc.filePath}"
				target="_blank">${doc.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		</c:if>
		</c:if>
		</c:forEach>
	 </td>
  </tr> 
  <tr>
     <th width="15%" style="height:80px;padding-top:5px;" valign="top">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
     <td colspan="5" style="height:80px;padding-top:5px;" valign="top">
	    <c:forEach var="file" items="${arch.sysArchivesFiless}">
	    <c:if test="${file.fileType==2}">
	     	 <img
				src="<%=request.getContextPath()%>/images/flag/attachment.png" />
			<a
				href="<%=request.getContextPath()%>/pages/downFile.jsp?hisId=${file.id}&fpath=attachFiles/${file.filePath}"
				target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		</c:if>      
		</c:forEach>
	 </td>
  </tr>
</table>
<c:if test="${dataSource==0}">
<c:if test="${runid!=0}">
<table class="table-info" border="1" align="center" style="border:1px ;solid #000;border-collapse: collapse;table-layout:fixed;" width="98%">
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
			<td colspan="3" style="height:${fn:length(processForm.comments)/2+20}px">
			<c:out value='${processForm.status ==null?"已处理":processForm.status}'></c:out>&nbsp;&nbsp;${processForm.comments}</td>
		</tr>
		</c:forEach>
</table>
</c:if>
</c:if>
</div>
</body>
</html>