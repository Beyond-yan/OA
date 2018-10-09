package com.gdssoft.oa.action.flow;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.oa.model.system.AppUser;

public class ProcessFormReq {
	
	private String status;
	private String comments;
	private String isBack;
	private AppUser curUser;
	private String isMobile;
	
	public ProcessFormReq() {
		
	}
	
	public ProcessFormReq(HttpServletRequest req) {
		String pfStatus = req.getParameter("status");
		System.out.println("-----------status:"+pfStatus);
		if (StringUtils.isNotEmpty(pfStatus)) {
			this.status = pfStatus;
		}
		
		String pfContents = req.getParameter("comments");
		if (StringUtils.isNotEmpty(pfContents)) {
			this.comments = pfContents;
		}
		
		String pfIsBack = req.getParameter("isBack");
		if (StringUtils.isNotEmpty(pfIsBack)) {
			this.isBack = pfIsBack;
		}
		String pfIsMobile = req.getParameter("isMobile");
		if (StringUtils.isNotEmpty(pfIsMobile)) {
			this.isMobile = pfIsMobile;
		}else{
			this.isMobile = "0";
		}
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
	public String getIsBack() {
		return isBack;
	}
	public void setIsBack(String isBack) {
		this.isBack = isBack;
	}

	public AppUser getCurUser() {
		return curUser;
	}

	public void setCurUser(AppUser curUser) {
		this.curUser = curUser;
	}

	public String getIsMobile() {
		return isMobile;
	}

	public void setIsMobile(String isMobile) {
		this.isMobile = isMobile;
	}
	
}
