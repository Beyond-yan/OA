<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@page import="com.gdssoft.core.util.ContextUtil"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="java.text.SimpleDateFormat"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.model.archive.Archives"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.gdssoft.oa.service.archive.ArchivesService"%>
<%@page import="com.gdssoft.oa.service.flow.ProcessFormService"%>
<%@page import="com.gdssoft.oa.service.flow.ProDefinitionService" %>
<%@page import="com.gdssoft.oa.model.flow.ProDefinition"%>
<%@page import="com.gdssoft.oa.model.flow.ProcessForm"%>
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
	String defId = request.getParameter("defId");
	request.setAttribute("defId",defId);
	ProDefinitionService proDefService = (ProDefinitionService) AppUtil.getBean("proDefinitionService");
	ProDefinition proDef = new ProDefinition();
	if (StringUtils.isNotEmpty(defId)) {
		proDef = proDefService.get(new Long(defId));
	}
	request.setAttribute("proDef", proDef);
	request.setAttribute("arch",arch);
	Map<String,List<ProcessForm>> processFormMap = null;
	if(null != arch){
		Long runId = arch.getProcessRun().getRunId();
		ProcessFormService processFormService = (ProcessFormService)AppUtil.getBean("processFormService");
		processFormMap  = processFormService.getProcessFormDetail(runId);
	}
	request.setAttribute("processFormMap",processFormMap);
	String depdesc=ContextUtil.getCurrentUser().getDepartment().getDepDesc();
	request.setAttribute("depdesc",depdesc);
	String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent));	
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<script src="../js/main.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/admin.css" />
<script type="text/javascript" src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script>
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
<script type="text/javascript">
function stamp(){
	$("#print").jqprint();
}
</script>
<style media=print>  
    .Noprint{display:none;}  
    .printHeadStyle{overflow-y:visible; width: 100%; border-top: none; border-right: none; border-bottom: none; border-left: none; border-color: white; margin-top: 60px;margin-left: 70px;}
    .edittext{ overflow-y:visible; width: 100%; border-top: none; border-right: none; border-bottom: none; border-left: none; border-color: white;}
    .PageNext{page-break-after:always;}  
</style>  
<style>  
    body,td,th    
    {  
        font-size: 12px;  
        font-family:   "宋体";
    }    
    .NOPRINT   {  
        font-family: "宋体";  
        font-size:   12px;  
        border-color: white;
        vertical-align: middle;
    }  
  #printHead td{padding-top:5px;padding-left:10px;font-size:14px;}
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
<center class="Noprint">
	<table border="0" style="padding-top:30px;">
		<tr>
			<td align="left"><h1 align="center" style="font-size:30px;">${proDef.name}</h1></td>
		</tr>
	</table>
</center>
<center>
<div id="printHead">
	<table border="0" width="98%" style="padding-top:30px;" class="printHeadStyle">
		<tr align="left" class="edittext">
			<td width="70px" class="Noprint">收文号:</td><td width="100px" style="font-size: 16px;">${arch.archivesNo == "0" ? "未生成编号":arch.archivesNo}</td>
			<td width="70px" class="Noprint">密级:</td><td width="100px" style="font-size: 16px;">${arch.privacyLevel}</td>
			<td width="70px"  class="Noprint">来文号:</td><td width="100px" style="padding-left: 10px;">${arch.depSignNo}</td>
			<td width="130px" style="padding-right: 10px;"><fmt:formatDate value="${arch.issueDate}" pattern="yyyy"/>&nbsp;&nbsp;<span class="Noprint">年</span>&nbsp;<fmt:formatDate value="${arch.issueDate}" pattern="MM"/>&nbsp;<span class="Noprint">月</span>&nbsp;&nbsp;<fmt:formatDate value="${arch.issueDate}" pattern="dd"/>&nbsp;&nbsp;<span class="Noprint">日</span></td>
		</tr>
	</table>
</div>
<table border="1" width="98%" align="center" style="border:1px ;solid #000;border-collapse: collapse;" class="edittext">
	<tr align="left" class="edittext">
	     <td style="height:20px;font-size: 21px;" colspan="2" valign="top" class="edittext"><div class="Noprint"><span style="display:inline-block;width:90px;">来文单位</span></div><div style="padding-top:20px;"><p style="padding-left:80px;font-weight: bold;">${arch.issueDep}</p></div>
	     <span style="float:right;padding-right:35px;padding-top:5px;padding-bottom:5px;"><span class="Noprint">共&nbsp;&nbsp;&nbsp;${arch.fileCounts}&nbsp;&nbsp;&nbsp;份</span></span></td>
	</tr>
	<tr align="left" class="edittext">
	     <td style="height:100px;font-size: 21px;" colspan="2" valign="top" class="edittext"><div class="Noprint"><span style="display:inline-block;width:80px;">事&nbsp;&nbsp;&nbsp;&nbsp;由</span></div><div style="padding-top:40px;font-weight: bold;"><p style="padding-left:80px;line-height:30px;">${arch.subject}</p></div></td>
	</tr>
	<tr align="left" class="edittext">
	     <td style="height:140px;font-size: 21px;" rowspan="2" valign="top" class="edittext"><div class="Noprint"><span style="display:inline-block;width:80px;">备&nbsp;&nbsp;&nbsp;&nbsp;注</span></div><div style="padding-top:75px;padding-left: 80px;font-weight: bold;"><c:if test="${!empty processFormMap}"><c:if test="${processFormMap['办公室主任拟办']!=null}"><c:forEach varStatus="status" items='${processFormMap["办公室主任拟办"]}' var ="form"><c:if test="${status.last}"><div style="paddind-top:5px">${form.comments}<br></div><ul style="height:10px;padding-top:3px;"><li style="list-style:none;float:left;width:80px;">&nbsp;</li><li style="list-style:none;float:left;width:65px;">${form.creatorName}</li><li style="list-style:none;float:left;width:120px;padding-left: 50px;"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy.MM.dd"/></li></ul><br>
				 </c:if></c:forEach></c:if></c:if></div></td>
    		 <td style="height:70px;padding-left:0px;font-size: 21px;"align="center" width="150px" class="edittext"><div class="Noprint">收&nbsp;&nbsp;件&nbsp;&nbsp;人</div></td>
	</tr>
	<tr align="left" class="edittext">
    		 <td style="height:30px;font-size: 21px;" class="edittext"></td>
	</tr>
	<tr align="left" class="edittext">
	     <td style="height:100px;font-size: 21px;" colspan="2" valign="top" class="edittext"><div class="Noprint"><span style="display:inline-block;width:80px;">批&nbsp;&nbsp;&nbsp;&nbsp;示</span></div><div style="padding-top:180px;padding-left: 80px;font-weight: bold;"><c:if test="${!empty processFormMap}"><c:if test="${processFormMap['领导批示']!=null}"><c:forEach items='${processFormMap["领导批示"]}' var ="form"><div style="paddind-top:15px">${form.comments}<br></div><ul style="height:10px;padding-top:15px;"><li style="list-style:none;float:left;width:80px;">&nbsp;</li><li style="list-style:none;float:left;width:65px;">${form.creatorName}</li><li style="list-style:none;float:left;width:120px;padding-left: 50px;"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy.MM.dd"/></li>
					 </ul><br><br><br></c:forEach></c:if><c:if test="${processFormMap['领导批示1']!=null}"><c:forEach items='${processFormMap["领导批示1"]}' var ="form"><div style="paddind-top:15px">${form.comments}<br></div><ul style="height:10px;padding-top:15px;"><li style="list-style:none;float:left;width:80px;">&nbsp;</li><li style="list-style:none;float:left;width:65px;">${form.creatorName}</li><li style="list-style:none;float:left;width:120px;padding-left: 50px;"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy.MM.dd"/></li>
					 </ul><br><br><br></c:forEach></c:if><c:if test="${processFormMap['领导批示2']!=null}"><c:forEach items='${processFormMap["领导批示2"]}' var ="form"><div style="paddind-top:15px">${form.comments}<br></div><ul style="height:10px;padding-top:15px;"><li style="list-style:none;float:left;width:80px;">&nbsp;</li><li style="list-style:none;float:left;width:65px;">${form.creatorName}</li><li style="list-style:none;float:left;width:120px;padding-left: 50px;"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy.MM.dd"/></li>
					 </ul><br><br><br></c:forEach></c:if><c:if test="${processFormMap['领导批示3']!=null}"><c:forEach items='${processFormMap["领导批示3"]}' var ="form"><div style="paddind-top:15px">${form.comments}<br></div><ul style="height:10px;padding-top:15px;"><li style="list-style:none;float:left;width:80px;">&nbsp;</li><li style="list-style:none;float:left;width:65px;">${form.creatorName}</li><li style="list-style:none;float:left;width:120px;padding-left: 50px;"><fmt:formatDate value="${form.createtime}" type="both" pattern="yyyy.MM.dd"/></li>
					 </ul><br><br><br></c:forEach></c:if></c:if></div></td>
	</tr>
</table>
</center>
</div>
</body>
</html>