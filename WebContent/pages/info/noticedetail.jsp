<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@page import="java.util.*"%>
<%@page import="com.gdssoft.core.util.AppUtil"%>
<%@page import="com.gdssoft.oa.service.info.NoticeService"%>
<%@page import="com.gdssoft.oa.service.info.impl.NoticeServiceImpl"%>
<%@page import="com.gdssoft.core.web.paging.PagingBean"%>
<%@page import="com.gdssoft.oa.model.info.Notice"%>
<%@page import="com.gdssoft.core.command.QueryFilter"%>
<%@page import="com.gdssoft.oa.service.system.DepartmentService" %>
<%@page import=" com.gdssoft.oa.model.system.Department"%>
<%
	Long noticeId = null;
	String strId = request.getParameter("noticeId");
	String opt = request.getParameter("opt");
	NoticeService noticeService = (NoticeService) AppUtil.getBean("noticeService");
	Notice notice = null;
	if (strId != null && !"".equals(strId)) {
		noticeId = Long.valueOf(strId);
	}
	
	
	if(opt != null && !"".equals(opt)){
		//使用页面的方法实现获取上一条,下一条的记录
		QueryFilter filter=new QueryFilter(request);
		List<Notice> list = null;
		filter.getPagingBean().setPageSize(1);//只取一条记录
		if(opt.equals("_next")){
			//点击下一条按钮,则取比当前ID大的下一条记录
			filter.addFilter("Q_noticeId_L_GT", noticeId.toString());
			list= noticeService.getAll(filter);
			if(filter.getPagingBean().getStart()+1==filter.getPagingBean().getTotalItems()){
				request.setAttribute("__haveNextNoticeFlag","endNext");
			}
		}else if(opt.equals("_pre")){
			//点击上一条按钮,则取比当前ID小的一条记录
			filter.addFilter("Q_noticeId_L_LT", noticeId.toString());
			filter.addSorted("noticeId","desc");
			list= noticeService.getAll(filter);
			if(filter.getPagingBean().getStart()+1==filter.getPagingBean().getTotalItems()){
				request.setAttribute("__haveNextNoticeFlag","endPre");
			}
		}
		
		if(list.size()>0){
			notice = list.get(0);
		}else{
			notice = noticeService.get(noticeId);
		}
	}else{
		notice = noticeService.get(noticeId);
		request.setAttribute("__haveNextNoticeFlag","");
	}
	request.setAttribute("notice",notice);
	 
	//浏览后的公告浏览次数加1
	notice.setViewCounts(notice.getViewCounts()+1);
	noticeService.save(notice);
	
	Long depId = notice.getDepId();
	Department dep = new Department();
	if(null != depId){
		DepartmentService departmentService=(DepartmentService)AppUtil.getBean("departmentService");
		dep = departmentService.get(new Long(depId));
	}
	request.setAttribute("dep", dep);
%>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>${notice.noticeTitle}</title>
	<style>
	body {
		font-size: 12px;
		font-style: normal;
		color: #333333;
		margin: 0px;
		padding: 0px;
	}
	</style>
</head>
<body>
	<table cellpadding="0" cellspacing="0" border="0" align="center" width="85%">
		<tr>
			<td>
				<div style="max-width:952px;">
					<table width="100%" cellpadding="0" cellspacing="1" style="border: 5px 5px 5px 5px;">
						<tr>
							<td align="center" style="font:3.0em 宋体  ;color:black;font-weight: bold;padding:10px 0px 10px 0px; ">
								${notice.noticeTitle}
								<input type="hidden" value="${__haveNextNoticeFlag}" id="__haveNextNoticeFlag"/>
								<input type="hidden" value="${notice.noticeId }" id="__curNoticeId"/>
							</td>
						</tr>
						
						<tr>
							<td align="center" style="padding:0px 0px 10px 0px;">
									发布人:
								<font color="green">
									${notice.postName}
								</font>/
								<font color="green">
									${dep.depName}
								</font>
									&nbsp;浏览次数:
									<font color="red">
										${notice.viewCounts}
									</font>
									&nbsp;次
							</td>
						</tr>
						<tr>
							<td style="border-top:dashed 1px #ccc;" height="28">
							</td>
						</tr>
						<tr >
							<td style="font:13px 宋体;color: black;line-height:24px;width:952px;">
								${notice.noticeContent}
							</td>
						</tr>
						<tr>
							<td style="font:13px 宋体;color: black;line-height:24px;width:952px;">
								<c:forEach var="file" items="${notice.attachFiles}">
						        	<a href="<%=request.getContextPath()%>/pages/downFile.jsp?fileId=${file.fileId}" target="_blank">${file.fileName}</a>&nbsp;&nbsp;&nbsp;&nbsp;
								</c:forEach>  
							</td>
						</tr>
					</table>
				</div>
			</td>
		</tr>
	</table>
</body>
</html>