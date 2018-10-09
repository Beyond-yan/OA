<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.admin.CarApplyService"%>
<%@page import="com.gdssoft.oa.model.admin.CarApply"%>
<%@page import="org.apache.commons.lang.StringUtils"%>

<%
	String applyId=request.getParameter("acceptId");
	System.out.print(applyId);
	CarApplyService caService = (CarApplyService) AppUtil
			.getBean("carApplyService");
	CarApply carApply = new CarApply();
	if (StringUtils.isNotEmpty(applyId)) {
		carApply = caService.get(new Long(applyId));
	}
	request.setAttribute("carApply", carApply);
	String agent=request.getHeader("user-agent");	
	request.setAttribute("browser", AppUtil.getBrowser(agent));	
%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>车辆申请打印</title>
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
	<h1 align="center" style="padding:10px;font-size:24px;">车辆使用申请</h1>
	<span style="float: right; padding-right: 10px;">
		申请日期:<fmt:formatDate value="${carApply.createDate}" pattern="yyyy-MM-dd" />
	</span> 
	<center>
		<div id="printBody">
		<table border="1" width="98%" align="center" style="border:1px ;solid #000;border-collapse: collapse;">
		  <tr align="left" style="height:35px;">
		     <td width="50%"><span style="display:inline-block;width:80px;">用车部门:</span>${carApply.department}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">用车人:</span>${carApply.userFullname}</td>
		     <td width="25%"><span style="display:inline-block;width:80px;">用车人数:</span>${carApply.peopleAmount}</td>
		  </tr>
		  <tr align="left">
		     <td style="height:75px;" colspan="3" valign="top"><span style="display:inline-block;width:80px;">原因:</span>${carApply.reason}</td>
		  </tr>
		  <tr align="left" style="height:35px;">
		     <td width="50%" colspan="1"><span style="display:inline-block;width:80px;">用车日期:</span><fmt:formatDate value="${carApply.startTime}" pattern="yyyy-MM-dd" /></td>
		     <td width="50%" colspan="2"><span style="display:inline-block;width:80px;">结束日期:</span><fmt:formatDate value="${carApply.endTime}" pattern="yyyy-MM-dd" /></td>
		  </tr>
		  <tr align="left" style="height:35px;">
		     <td width="50%" colspan="1"><span style="display:inline-block;width:80px;">到达地点:</span>${carApply.toSite}</td>
		     <td width="50%" colspan="2">
		     	<span style="display:inline-block;width:80px;">审批状态:</span>
			     <c:choose>
					<c:when test="${carApply.approvalStatus == 1}">
						新申请
					</c:when>
					<c:when test="${carApply.approvalStatus == 2}">
						审批之中
					</c:when>
					<c:when test="${carApply.approvalStatus == 3}">
						批准用车
					</c:when>
					<c:when test="${carApply.approvalStatus == 4}">
						用车完成
					</c:when>
					<c:when test="${carApply.approvalStatus == 5}">
						取消申请
					</c:when>
					<c:when test="${carApply.approvalStatus == 6}">
						拒绝申请
					</c:when>
				</c:choose>
			</td>
		  </tr>
		  <tr align="left">
		     <td style="height:75px;" colspan="3" valign="top"><span style="display:inline-block;width:80px;">备注:</span>${carApply.notes}</td>
		  </tr>
		</table>
		</div>
	</center>
	</div>
</body>
</html>