package com.gdssoft.oa.model.jw;

import com.google.gson.annotations.Expose;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/

/**
 * JwArchives Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class JwSentArchives extends com.gdssoft.core.model.BaseModel {

    protected Long id;
    //文件标题
    @Expose
	protected String subject;
	//主题词
	@Expose
	protected String keywords;
	protected String title;
	
	//拟稿日期
	@Expose
	protected String bumfday;
	//发文编号
	@Expose
	protected String bumfno;

	//文种
	@Expose
	protected String bumfType;
	

	//行文方向
	@Expose
	protected String bumfTo;
	
	//密级
	@Expose
	protected String secret;
	//缓急
	@Expose
	protected String emergency;
	
	//办公室主任审核意见
	@Expose
	protected String zhuRen;
	
	//核稿
	@Expose
	protected String checker;
	

	//打印
	@Expose
	protected String printer;
	
	//校对
	@Expose
	protected String proof;
	
	//签发
	@Expose
	protected String subscriber;
	
	//拟稿
	@Expose
	protected String writer;
	
	//主送
	@Expose
	protected String toDepartment;
	
	//抄送
	@Expose
	protected String copytoDepartment;
	
	
	//拟稿部门
	@Expose
	protected String bumfDepartment;
	
	
	//发文单位
	@Expose
	protected String sourcedepartment;
	
	//范围标识
	@Expose
	protected Short rangeFlag;
	
	//附件编码
	protected String attachcode ;
	@Expose
	 protected java.util.Set jwAttachfiles = new java.util.HashSet();
	/**
	 * Default Empty Constructor for class JwArchives
	 */
	public JwSentArchives () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class JwArchives
	 */
	public JwSentArchives (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}


	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getBumfday() {
		return bumfday;
	}

	public void setBumfday(String bumfday) {
		this.bumfday = bumfday;
	}

	public String getBumfno() {
		return bumfno;
	}

	public void setBumfno(String bumfno) {
		this.bumfno = bumfno;
	}

	public String getBumfType() {
		return bumfType;
	}

	public void setBumfType(String bumfType) {
		this.bumfType = bumfType;
	}

	public String getBumfTo() {
		return bumfTo;
	}

	public void setBumfTo(String bumfTo) {
		this.bumfTo = bumfTo;
	}

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public String getEmergency() {
		return emergency;
	}

	public void setEmergency(String emergency) {
		this.emergency = emergency;
	}

	public String getZhuRen() {
		return zhuRen;
	}

	public void setZhuRen(String zhuRen) {
		this.zhuRen = zhuRen;
	}

	public String getChecker() {
		return checker;
	}

	public void setChecker(String checker) {
		this.checker = checker;
	}

	public String getPrinter() {
		return printer;
	}

	public void setPrinter(String printer) {
		this.printer = printer;
	}

	public String getProof() {
		return proof;
	}

	public void setProof(String proof) {
		this.proof = proof;
	}

	public String getSubscriber() {
		return subscriber;
	}

	public void setSubscriber(String subscriber) {
		this.subscriber = subscriber;
	}

	public String getWriter() {
		return writer;
	}

	public void setWriter(String writer) {
		this.writer = writer;
	}

	public String getToDepartment() {
		return toDepartment;
	}

	public void setToDepartment(String toDepartment) {
		this.toDepartment = toDepartment;
	}
	
	

	public String getCopytoDepartment() {
		return copytoDepartment;
	}

	public void setCopytoDepartment(String copytoDepartment) {
		this.copytoDepartment = copytoDepartment;
	}

	public String getBumfDepartment() {
		return bumfDepartment;
	}

	public void setBumfDepartment(String bumfDepartment) {
		this.bumfDepartment = bumfDepartment;
	}

	public String getSourcedepartment() {
		return sourcedepartment;
	}

	public void setSourcedepartment(String sourcedepartment) {
		this.sourcedepartment = sourcedepartment;
	}

	public String getAttachcode() {
		return attachcode;
	}

	public void setAttachcode(String attachcode) {
		this.attachcode = attachcode;
	}

	public java.util.Set getJwAttachfiles() {
		return jwAttachfiles;
	}

	public void setJwAttachfiles(java.util.Set jwAttachfiles) {
		this.jwAttachfiles = jwAttachfiles;
	}

	public Short getRangeFlag() {
		return rangeFlag;
	}

	public void setRangeFlag(Short rangeFlag) {
		this.rangeFlag = rangeFlag;
	}
	

}
