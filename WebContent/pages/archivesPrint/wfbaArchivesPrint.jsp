<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
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
<%@page import="java.util.Map"%>
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
	if(null != arch){
		Long runId = arch.getProcessRun().getRunId();
		ProcessFormService processFormService = (ProcessFormService)AppUtil.getBean("processFormService");
		processFormMap  = processFormService.getProcessFormDetail(runId);
	}
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
<title>发文打印</title>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<script src="../js/main.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/admin.css" />
<script type="text/javascript" src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<script language="javascript" src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script>
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
</style>  
<style>  
    body,td,th    
    {  
        font-size: 12px;  
        font-family:"黑体";
    }    
    .NOPRINT   {  
        font-family:   "宋体";  
        font-size:   12px;  
    }     
  #printBody table{border:2px solid #000000;}
  #printBody td{border:1.5px solid #000000;padding-top:5px;padding-left:10px;font-size:14px;}
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
	<h1 align="center" style="padding:10px;font-size:24px;">${proDef.name}</h1> 
	<center>
		<div id="printBody">
		<table border="1" width="98%" align="center" style="border:1px ;solid #000;border-collapse: collapse;">
		  <tr align="left" style="height:35px;">
		     <td width="50%"><span style="display:inline-block;width:80px;">报送部门:</span>${arch.orgDepName}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">拟稿人:</span>${arch.issuer}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">文件状态:</span>${arch.shortContent}</td>
		  </tr>
		  <tr align="left" style="height:35px;">
		     <td width="50%"><span style="display:inline-block;width:80px;">文件类型:</span>${arch.sources}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">联系人:</span>${arch.sendTo}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">联系电话:</span>${arch.ccTo}</td>
		 </tr>
		 <tr align="left" style="height:35px;">
		     <td width="50%"><span style="display:inline-block;width:80px;">文件名称:</span>${arch.issueDep}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">文件文号:</span>${arch.archivesNo}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">移交审查日期:</span><fmt:formatDate value="${arch.signDate}" pattern="yyyy-MM-dd"/></td>
		  </tr>
		  <tr align="left" style="height:35px;">
		     <td width="50%"><span style="display:inline-block;width:80px;">公布日期:</span><fmt:formatDate value="${arch.issueDate}" pattern="yyyy-MM-dd"/></td>
		     <td width="25%"><span style="display:inline-block;width:80px;">施行日期:</span><fmt:formatDate value="${arch.writtenDate}" pattern="yyyy-MM-dd"/></td>
		     <td width="25%"><span style="display:inline-block;width:80px;">有效期至:</span><fmt:formatDate value="${arch.limitedDate}" pattern="yyyy-MM-dd"/></td>
		  </tr>
		  <tr align="left">
		     <td style="height:75px;" colspan="3" valign="top"><span style="display:inline-block;width:80px;">材料类型:</span><div style="padding-top:10px;"><span style="display:inline-block;width:80px;"></span><c:if test="${arch.privacyLevel == '1'}">送审稿</c:if><c:if test="${arch.privacyLevel == '2'}">已印发文件</c:if></div></td>
		  </tr>
		  <tr align="left">
		     <td style="height:75px;" colspan="3" valign="top"><span style="display:inline-block;width:80px;">标题:</span><div style="padding-top:10px;"><span style="display:inline-block;width:80px;"></span>${arch.subject}</div></td>
		  </tr>
		</table>
		</div>
	</center>
	</div>
</body>
</html>