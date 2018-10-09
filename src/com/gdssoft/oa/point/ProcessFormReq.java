package com.gdssoft.oa.point;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.Constants;

public class ProcessFormReq {
	
	private String status;
	private String comments;
	private String isBack;
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
	
}
