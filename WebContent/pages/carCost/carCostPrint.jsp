<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ page import="java.text.SimpleDateFormat"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.admin.CarCostRecordService"%>
<%@page import="com.gdssoft.oa.model.admin.CarCostRecord"%>
<%@page import="java.util.Date"%>
<%
	String basePath = request.getContextPath();
	Date startTime=null;
	Date endTime=null;
	Map map=new HashMap();
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	String startDate = request.getParameter("startDate");
	String endDate = request.getParameter("endDate");
	String selectBy=request.getParameter("selectBy");
	String carIds=request.getParameter("carIds");
	
	if(startDate!=null&&!"".equals(startDate)){
		try {
			startTime=sdf.parse(startDate);	
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	if(endDate!=null&&!"".equals(endDate)){
		try {
			endTime=sdf.parse(endDate);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	CarCostRecordService carCostRecordService = (CarCostRecordService)AppUtil.getBean("carCostRecordService");
	map = carCostRecordService.costStatisticsTwoService(startTime, endTime, selectBy, carIds);
	request.setAttribute("map", map);
	  int count=0;//除了车牌号之外的列数
	 Set set=map.entrySet();
	  Iterator iterator=set.iterator();
	if(iterator.hasNext()){
	   Map.Entry entry=(Map.Entry)iterator.next();
	        Map value=(Map)entry.getValue();
	        count=value.size();
	}
	  request.setAttribute("count", count);
	  request.setAttribute("selectBy", selectBy);
	  request.setAttribute("staticsDate", new Date());
	  request.setAttribute("startTime", startTime);
	  request.setAttribute("endTime", endTime);
%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>费用统计打印</title>
<link href="../css/sysMain.css" rel="stylesheet" type="text/css" />
<script src="../js/main.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath%>/css/admin.css" />
<script type="text/javascript" src="<%=basePath%>/ext3/adapter/ext/ext-base.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-all.gzjs"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/Toast.js"></script>
<script type="text/javascript" src="<%=basePath%>/ext3/ux/DateTimeField.js"></script>
<script type="text/javascript" src="<%=basePath%>/js/jquery-1.4.2.min.js"></script>
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
		<a href="#" onclick="document.all.WebBrowser.ExecWB(6,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint1.gif" width="30px" height="30px" align="middle"/>打印</a>
        <a href="#" onclick="document.all.WebBrowser.ExecWB(8,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint2.gif" width="30px" height="30px" align="middle"/>页面设置</a>
   	    <a href="#" onclick="document.all.WebBrowser.ExecWB(7,1)" style="text-decoration: none;"><img src="../../images/btn/print/Archprint3.gif" width="30px" height="30px" align="middle"/>打印预览</a>
	</div>
	<h1 align="center" style="padding:10px;font-size:24px;">${proDef.name}</h1> 
	<center>
		<div id="printBody">
			<table border="1" width="98%" align="center" style="border:1px ;solid #000;border-collapse: collapse;">
				<tr height="50"><td colspan="${count+1}" align="center"><h1 style="font-size:20px;">车辆费用统计</h1></td></tr>
				<tr>  
				   <td colspan="${count+1}" align="center">统计时间:
				   <c:if test="${selectBy=='T'}"><fmt:formatDate pattern="yyyy/MM/dd" value="${startTime}"/></c:if>
				   <c:if test="${selectBy=='M'}"><fmt:formatDate pattern="yyyy/MM" value="${startTime}"/></c:if>
				   <c:if test="${selectBy=='Y'}"><fmt:formatDate pattern="yyyy" value="${startTime}"/></c:if>			      
				      <c:if test="${selectBy=='T'}">
				        &nbsp;&nbsp;&nbsp;&nbsp;截止时间:<fmt:formatDate pattern="yyyy/MM/dd" value="${endTime}"/>
				     </c:if>  
				      &nbsp;&nbsp;&nbsp;&nbsp;统计产生时间:<fmt:formatDate pattern="yyyy/MM/dd" value="${staticsDate}"/>
				   </td>
				</tr>
				<tr>
				    <td>车牌号</td>
					<c:forEach var="mp" begin="0" end="0" items="${map}">
						<c:forEach var="mpin" items="${mp.value}">
								<td>${mpin.key}</td>
						</c:forEach>
					</c:forEach>
				</tr>
				<c:forEach var="cp" items="${map }">
					<tr>
						<td>${cp.key}</td>
						<c:forEach var="cpin" items="${cp.value}">
							<td><c:choose>
									<c:when test="${cpin.key=='驾驶员'}">${cpin.value}</c:when>
									<c:when test="${cpin.key!='驾驶员'}">
										<fmt:formatNumber pattern="0.00">${cpin.value}</fmt:formatNumber>
									</c:when>
								</c:choose></td>
						</c:forEach>
					</tr>
				</c:forEach>
				<tr>
				</tr>
			</table>
		</div>
	</center>
</body>
</html>
