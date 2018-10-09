<%@ page pageEncoding="UTF-8"%>
<%
	String basePath = request.getContextPath();
%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="com.gdssoft.oa.model.system.FileAttach"%>
<%@page import="com.gdssoft.oa.service.work.WorkContentService"%>
<%@page import="com.gdssoft.oa.service.work.WorkContentProcessService"%>
<%@page import="com.gdssoft.oa.model.work.WorkContent"%>
<%@page import="com.gdssoft.oa.model.work.WorkContentProcess"%>
<%@page import="java.util.List"%>
<%@ page import="java.util.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.gdssoft.core.util.ContextUtil"%>
<%@page import="com.gdssoft.oa.model.system.AppUser"%>
<%@page import="com.gdssoft.oa.model.system.AppRole"%>
<%@page import="com.gdssoft.oa.model.system.SysConfig"%>
<%@page import="com.gdssoft.oa.service.system.SysConfigService"%>
<%
	String id = request.getParameter("id");
	WorkContentService workContentService = (WorkContentService) AppUtil
			.getBean("workContentService");
	WorkContent workContent = new WorkContent();
	workContent = workContentService.get(new Long(id));
	String typeName="";
	if(workContent!=null){
		int type=workContent.getType();
		if(type==1){
			typeName="市领导批示";
		}else if(type==2){
			typeName="重要决策部署";
		}else if(type==3){
			typeName="主任会党委会";
		}else if(type==4){
			typeName="委领导指示";
		}else if(type==5){
			typeName="其他";
		}
	}
	request.setAttribute("typeName", typeName);
	request.setAttribute("view", workContent);
	WorkContentProcessService workContentProcessService = (WorkContentProcessService) AppUtil
			.getBean("workContentProcessService");
	List<WorkContentProcess> list=workContentProcessService.getProcessListById(new Long(id));
	request.setAttribute("list", list);
	String userid=workContent.getUserid();
	userid+=",1,100182,100315,100204";
	String[] userids=userid.split(",");
	boolean flag=false;
	AppUser appUser = ContextUtil.getCurrentUser();
	String userId=appUser.getUserId()+"";
	for(int i=0;i<userids.length;i++){
		if(userids[i].equals(userId)){
			flag=true;
			break;
		}
	}
	if(!flag){
		SysConfigService sysConfigService = (SysConfigService) AppUtil
				.getBean("sysConfigService");
		SysConfig isArchivesManagerID=sysConfigService.findByKey("archivesManagerID");
		SysConfig diaryLeaderRoleId=sysConfigService.findByKey("diaryLeaderRoleId");
		SysConfig leaderRoleId=sysConfigService.findByKey("leaderRoleId");
		Set<AppRole> roles = appUser.getRoles();
		for (AppRole role : roles) {
			if (null != isArchivesManagerID
					&& role.getRoleId().toString()
							.equals(isArchivesManagerID.getDataValue())) {
				flag = true;
			}
			if (null != diaryLeaderRoleId
					&& role.getRoleId().toString()
							.equals(diaryLeaderRoleId.getDataValue())) {
				flag = true;
				break;
			}
			if (null != leaderRoleId
					&& role.getRoleId().toString()
							.equals(leaderRoleId.getDataValue())) {
				flag = true;
				break;
			}
		}
	}
	request.setAttribute("flag", flag);
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
<script type="text/javascript">
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
<h1 align="center" style="padding: 10px; font-size: 20px;">督查事项</h1>
<span style="float:right;padding-right:20px;padding-bottom:4px;">创建日期:<fmt:formatDate value="${view.createtime}" pattern="yyyy-MM-dd"/></span>
	<table class="table-info" width="98%" align="center" border="1" style="border:1px ;solid #000;border-collapse: collapse;">
		<tr>
			<th width="17%">事项名称</th>
			<td colspan="5">${view.name}</td>
		</tr>
		<tr>
			<th width="17%">限办日期</th>
			<td width="17%"><fmt:formatDate value="${view.limitdate}"
					pattern="yyyy-MM-dd" /></td>
			<th width="17%">事项分类</th>
			<td width="17%">${typeName}</td>
			<th width="17%">排&nbsp;&nbsp;&nbsp;&nbsp;序</th>
			<td width="17%">${view.orderid}</td>
		</tr>
		<tr>
			<th width="17%">责任部门</th>
			<td colspan="5">${view.deptname}</td>
		</tr>
		<tr>
			<th width="17%">相关人员</th>
			<td colspan="5">${view.username}</td>
		</tr>
		<tr>
			<th width="17%">事项描述</th>
			<td colspan="3">${view.descript}</td>
		</tr>
		<tr>
			<th width="17%">附&nbsp;&nbsp;&nbsp;&nbsp;件</th>
			<td colspan="5">
				<c:forEach var="file" items="${view.workFiles}">
					<a
						href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}"
						target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
		  		</c:forEach>
			</td>
		</tr>
	</table>
	<table class="table-info" width="98%" align="center" border="1" style="border:1px ;solid #000;border-collapse: collapse;">
		<tr>
			<th align="left" colspan="12" valign="middle" width="100%"><h2>办理进度</h2></th>
		</tr>
		<tr>
			<th width="10%">序号</th>
			<th width="50%" colspan="4">进度</th>
			<th width="20%">填写人员</th>
			<th width="20%" colspan="2">填写时间</th>
			<th width="50%" colspan="4">附件</th>
		</tr>
		<%
		int num=0;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		List pfList=(List)request.getAttribute("list");
		if(pfList!=null){
		    for(int i=0;i<pfList.size();i++){
		    	WorkContentProcess wcp=(WorkContentProcess)pfList.get(i);
	    		out.println("<tr>");
	    		out.println("<td align='center'>"+(++num)+"</td>");
	    		out.println("<td colspan='4'>"+wcp.getContent()+"</td>");
	    		out.println("<td>"+wcp.getCreateuser()+"</td>");
	    		out.println("<td colspan='2'>"+sdf.format(wcp.getCreatetime())+"</td>");
	    		out.println("<td colspan='4'>");
	    		Set set=wcp.getProcessFiles();
	    		if(set!=null&&set.size()==1){
	    			Iterator<FileAttach> it = set.iterator();
	    			while (it.hasNext()) {
	    				FileAttach fa = it.next();
	    				out.println("<a title='"+fa.getFileName()+"' href='"+request.getScheme() + "://" + request.getHeader("host") +  request.getContextPath()+"/pages/downFile.jsp?fileId="+fa.getFileId()+"' target='_blank'>");
	    				if(fa.getFileName().length()>14){
	    					out.println(fa.getFileName().substring(0, 14)+"...");
	    				}else{
	    					out.println(fa.getFileName());
	    				}
	    				out.println("</a>");
	    			}
	    		}else if(set!=null&&set.size()>1){
	    			Iterator<FileAttach> it = set.iterator();
	    			int count=0;
	    			while (it.hasNext()) {
	    				FileAttach fa = it.next();
	    				out.println((++count)+"、<a title='"+fa.getFileName()+"' href='"+request.getScheme() + "://" + request.getHeader("host") +  request.getContextPath()+"/pages/downFile.jsp?fileId="+fa.getFileId()+"' target='_blank'>");
	    				if(fa.getFileName().length()>7){
	    					out.println(fa.getFileName().substring(0, 7)+"...");
	    				}else{
	    					out.println(fa.getFileName());
	    				}
	    				out.println("</a>");
	    				out.println("</a><br>");
	    			}
	    		}
		    }
		}
		%>
	</table>
</div>
</body>
</html>