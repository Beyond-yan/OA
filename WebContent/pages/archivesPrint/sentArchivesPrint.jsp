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
<script language="javascript"
	src="<%=basePath%>/js/jquery.jqprint-0.3.js"></script>
<link rel="stylesheet" type="text/css"
	href="<%=basePath%>/ext3/resources/css/ext-all.css" />
<script type="text/javascript">
	var hkey_root, hkey_path, hkey_key
	hkey_root = "HKEY_CURRENT_USER"
	hkey_path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\"
	//设置网页打印的页眉页脚为空
	function pagesetup_null() {
		try {
			var RegWsh = new ActiveXObject("WScript.Shell")
			hkey_key = "header"
			RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
			hkey_key = "footer"
			RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
		} catch (e) {
		}
	}
	pagesetup_null();
</script>
<script language="javascript">
	function stamp() {
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
			<a href="#" onclick="stamp()" style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint1.gif" width="30px"
				height="30px" align="middle" />打印</a>
		</c:if>
		<c:if test="${browser=='IE'}">
			<a href="#" onclick="document.all.WebBrowser.ExecWB(6,1)"
				style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint1.gif" width="30px"
				height="30px" align="middle" />打印</a>
			<a href="#" onclick="document.all.WebBrowser.ExecWB(8,1)"
				style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint2.gif" width="30px"
				height="30px" align="middle" />页面设置</a>
			<a href="#" onclick="document.all.WebBrowser.ExecWB(7,1)"
				style="text-decoration: none;"><img
				src="../../images/btn/print/Archprint3.gif" width="30px"
				height="30px" align="middle" />打印预览</a>
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
							style="display: inline-block; width: 80px;">发文字号:</span>${arch.archivesNo == "0" ? "未生成编号":arch.archivesNo}</td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">紧急程度:</span>${arch.urgentLevel}</td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">密级程度:</span>${arch.privacyLevel}</td>
					</tr>
					<tr align="left">
						<td width="50%" rowspan="3" valign="top"><span
							style="display: inline-block; width: 80px; padding-bottom: 5px;">签发:</span>
						<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['签发']!=null}">
									<c:forEach items='${processFormMap["签发"]}' var="form"
										varStatus="status">
										<c:if test="${status.last}">
											<div style="paddind-top: 5px; padding-left: 15px;">${form.comments}<br>
												<p
													style="width: 65px; font-size: 16px; padding-top: 30px; padding-left: 80px;">${form.creatorName}</p>
												<p
													style="width: 120px; padding-top: 20px; padding-left: 80px;">
													<font face="Arial"><fmt:formatDate
															value="${form.createtime}" type="both"
															pattern="yyyy年MM月dd日" /></font>
												</p>
											</div>
											<br>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${proDef.name=='市纪委驻市交委纪检组发文流程处理笺'}">
								<c:if test="${!empty processFormMap}">
									<c:if test="${processFormMap['分管领导批示']!=null}">
										<c:forEach items='${processFormMap["分管领导批示"]}' var="form"
											varStatus="status">
											<c:if test="${status.last}">
												<div style="paddind-top: 5px; padding-left: 15px;">${form.comments}<br>
													<p
														style="width: 65px; font-size: 16px; padding-top: 30px; padding-left: 80px;">${form.creatorName}</p>
													<p
														style="width: 120px; padding-top: 20px; padding-left: 80px;">
														<font face="Arial"><fmt:formatDate
																value="${form.createtime}" type="both"
																pattern="yyyy年MM月dd日" /></font>
													</p>
												</div>
												<br>
											</c:if>
										</c:forEach>
									</c:if>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['中心领导签发']!=null}">
									<c:forEach items='${processFormMap["中心领导签发"]}' var="form"
										varStatus="status">
										<c:if test="${status.last}">
											<div style="paddind-top: 5px; padding-left: 15px;">${form.comments}<br>
												<p
													style="width: 65px; font-size: 16px; padding-top: 30px; padding-left: 80px;">${form.creatorName}</p>
												<p
													style="width: 120px; padding-top: 20px; padding-left: 80px;">
													<font face="Arial"><fmt:formatDate
															value="${form.createtime}" type="both"
															pattern="yyyy年MM月dd日" /></font>
												</p>
											</div>
											<br>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if></td>
						<td width="50%" style="height: 120px;" colspan="2" valign="top"><span
							style="display: inline-block; width: 80px; padding-bottom: 5px;">领导会签:</span>
						<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['领导会签']!=null}">
									<c:forEach items='${processFormMap["领导会签"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['中心领导会签']!=null}">
									<c:forEach items='${processFormMap["中心领导会签"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if></td>
					</tr>
					<tr align="left">
						<td width="50%" style="height: 120px;" colspan="2" valign="top"><span
							style="display: inline-block; width: 80px; padding-bottom: 5px;">会签:</span>
						<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['会签']!=null}">
									<c:forEach items='${processFormMap["会签"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['处室会签(部门发起)']!=null}">
									<c:forEach items='${processFormMap["处室会签(部门发起)"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['处室会签(办公室发起)']!=null}">
									<c:forEach items='${processFormMap["处室会签(办公室发起)"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['处室会签']!=null}">
									<c:forEach items='${processFormMap["处室会签"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['委属单位处室会签']!=null}">
									<c:forEach items='${processFormMap["委属单位处室会签"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['交委处室会签']!=null}">
									<c:forEach items='${processFormMap["交委处室会签"]}' var="form">
										<div style="paddind-top: 5px">${form.comments}<br>
										</div>
										<ul style="height: 10px; padding-top: 3px;">
											<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
											<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
											<li style="list-style: none; float: left; width: 120px"><font
												face="Arial"><fmt:formatDate
														value="${form.createtime}" type="both"
														pattern="yyyy.MM.dd" /></font></li>
										</ul>
										<br>
									</c:forEach>
								</c:if>
							</c:if></td>
					</tr>
					<tr align="left">
						<td width="50%" style="height: 100px;" colspan="2" valign="top"><span
							style="display: inline-block; width: 80px; padding-bottom: 5px;">办公室审核:</span>
						<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['中心行政办审核']!=null}">
									<c:forEach varStatus="status"
										items='${processFormMap["中心行政办审核"]}' var="form">
										<c:if test="${status.last}">
											<div style="paddind-top: 5px">${form.comments}<br>
											</div>
											<ul style="height: 10px; padding-top: 3px;">
												<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
												<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
												<li style="list-style: none; float: left; width: 120px"><font
													face="Arial"><fmt:formatDate
															value="${form.createtime}" type="both"
															pattern="yyyy.MM.dd" /></font></li>
											</ul>
											<br>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['中心行政办审核']!=null}">
									<c:forEach varStatus="status"
										items='${processFormMap["中心行政办审核"]}' var="form">
										<c:if test="${status.last}">
											<div style="paddind-top: 5px">${form.comments}<br>
											</div>
											<ul style="height: 10px; padding-top: 3px;">
												<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
												<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
												<li style="list-style: none; float: left; width: 120px"><font
													face="Arial"><fmt:formatDate
															value="${form.createtime}" type="both"
															pattern="yyyy.MM.dd" /></font></li>
											</ul>
											<br>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['办公室审核']!=null}">
									<c:forEach varStatus="status"
										items='${processFormMap["办公室审核"]}' var="form">
										<c:if test="${status.last}">
											<div style="paddind-top: 5px">${form.comments}<br>
											</div>
											<ul style="height: 10px; padding-top: 3px;">
												<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
												<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
												<li style="list-style: none; float: left; width: 120px"><font
													face="Arial"><fmt:formatDate
															value="${form.createtime}" type="both"
															pattern="yyyy.MM.dd" /></font></li>
											</ul>
											<br>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['综合办公室审核']!=null}">
									<c:forEach varStatus="status"
										items='${processFormMap["综合办公室审核"]}' var="form">
										<c:if test="${status.last}">
											<div style="paddind-top: 5px">${form.comments}<br>
											</div>
											<ul style="height: 10px; padding-top: 3px;">
												<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
												<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
												<li style="list-style: none; float: left; width: 120px"><font
													face="Arial"><fmt:formatDate
															value="${form.createtime}" type="both"
															pattern="yyyy.MM.dd" /></font></li>
											</ul>
											<br>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if>
							<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['交委办公室审核']!=null}">
									<c:forEach varStatus="status"
										items='${processFormMap["交委办公室审核"]}' var="form">
										<c:if test="${status.last}">
											<div style="paddind-top: 5px">${form.comments}<br>
											</div>
											<ul style="height: 10px; padding-top: 3px;">
												<li style="list-style: none; float: left; width: 80px;">&nbsp;</li>
												<li style="list-style: none; float: left; width: 65px;">${form.creatorName}</li>
												<li style="list-style: none; float: left; width: 120px"><font
													face="Arial"><fmt:formatDate
															value="${form.createtime}" type="both"
															pattern="yyyy.MM.dd" /></font></li>
											</ul>
											<br>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if></td>
					</tr>
					<tr align="left">
						<td style="height: 75px;" colspan="3" valign="top"><span
							style="display: inline-block; width: 80px;">主送:</span>${arch.sendTo}</td>
					</tr>
					<tr align="left">
						<td style="height: 75px;" colspan="3" valign="top"><span
							style="display: inline-block; width: 80px;">抄送:</span>${arch.ccTo}</td>
					</tr>
					<tr align="left" style="height: 35px;">
						<td width="50%"><span
							style="display: inline-block; width: 80px;">拟稿单位:</span>${issUser.department.depName}</td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">拟稿:</span>${arch.issuer}</td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">核稿:</span>${arch.reviewUserName}</td>
					</tr>
					<tr align="left" style="height: 35px;">
						<td width="50%"><span
							style="display: inline-block; width: 80px;">校对:</span></td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">印刷:</span>
						<c:if test="${!empty processFormMap}">
								<c:if test="${processFormMap['生成电子公文']!=null}">
									<c:forEach items='${processFormMap["生成电子公文"]}' var="form"
										varStatus="status">
										<c:if test="${status.last}">
											<span style="paddind-top: 5px">${form.creatorName}</span>
										</c:if>
									</c:forEach>
								</c:if>
							</c:if></td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">份数:</span><font
							face="Arial">${arch.fileCounts}</font></td>
					</tr>
					<tr align="left" style="height: 35px;">
						<td width="50%"><span
							style="display: inline-block; width: 80px;">发文单位:</span>${arch.issueDep}</td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">文种:</span>${arch.archivesType.typeName}</td>
						<td width="25%"><span
							style="display: inline-block; width: 80px;">方向:</span>${arch.sources}</td>
					</tr>
					<tr align="left">
						<td colspan="3" style="height: 30px;" valign="middle"><span
							style="display: inline-block; width: 91px;">附件(无文档):</span>${arch.enclosure}
						</td>
					</tr>
					<tr align="left">
						<td colspan="3" style="height: 75px;" valign="top"><span
							style="display: inline-block; width: 76px;">附件:</span> <c:forEach
								var="file" items="${arch.archivesFiles}">
								<a
									href="<%=request.getContextPath()%>/attachFiles/${file.filePath}"
									target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
				 </c:forEach></td>
					</tr>
					<tr align="left">
						<td style="height: 75px;" colspan="3" valign="top"><span
							style="display: inline-block; width: 80px;">标题:</span>
						<div style="padding-top: 10px;">
								<span style="display: inline-block; width: 80px;"></span>${arch.subject}</div></td>
					</tr>
				</table>
			</div>
		</center>
	</div>
</body>
</html>