package com.gdssoft.oa.model.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * JwArchives Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class JwRecArchives extends com.gdssoft.core.model.BaseModel {

    protected Long id;
    //文件标题
	protected String subject;
	//主题词
	protected String keywords;
	protected String department;
	protected String title;
	//收文年份
	protected String inbumfno_year;
	//收文日期
	protected String inbumfday;
	//成文日期
		protected String bumfday;
	//发文单位
	protected String sourcedepartment;
	//拟办意见
	protected String niban;
	//来文字号
	protected String bumfno;
	//收文编号
	protected String inbumfno;
	//主办部门
	protected String zhuban;
	//密级
	protected String secret;
	//缓急
	protected String emergency;
	//是否需要回复
	protected String IsReply;
	//协办部门
	protected String subdepartment;
	//附件编码
	protected String attachcode ;
	//用于调用搜索引擎
	protected String sentId ;
	protected String filepath ;
	protected String popularity ;
	
	 public String getSentId() {
		return sentId;
	}

	public void setSentId(String sentId) {
		this.sentId = sentId;
	}

	public String getFilepath() {
		return filepath;
	}

	public void setFilepath(String filepath) {
		this.filepath = filepath;
	}

	public String getPopularity() {
		return popularity;
	}

	public void setPopularity(String popularity) {
		this.popularity = popularity;
	}

	protected java.util.Set jwAttachfiles = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class JwArchives
	 */
	public JwRecArchives () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class JwArchives
	 */
	public JwRecArchives (
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

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getBumfday() {
		return bumfday;
	}

	public void setBumfday(String bumfday) {
		this.bumfday = bumfday;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getInbumfno_year() {
		return inbumfno_year;
	}

	public void setInbumfno_year(String inbumfno_year) {
		this.inbumfno_year = inbumfno_year;
	}

	public String getInbumfday() {
		return inbumfday;
	}

	public void setInbumfday(String inbumfday) {
		this.inbumfday = inbumfday;
	}

	public String getSourcedepartment() {
		return sourcedepartment;
	}

	public void setSourcedepartment(String sourcedepartment) {
		this.sourcedepartment = sourcedepartment;
	}

	public String getNiban() {
		return niban;
	}

	public void setNiban(String niban) {
		this.niban = niban;
	}

	public String getBumfno() {
		return bumfno;
	}

	public void setBumfno(String bumfno) {
		this.bumfno = bumfno;
	}

	public String getInbumfno() {
		return inbumfno;
	}

	public void setInbumfno(String inbumfno) {
		this.inbumfno = inbumfno;
	}

	public String getZhuban() {
		return zhuban;
	}

	public void setZhuban(String zhuban) {
		this.zhuban = zhuban;
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

	public String getIsReply() {
		return IsReply;
	}

	public void setIsReply(String isReply) {
		IsReply = isReply;
	}

	public String getSubdepartment() {
		return subdepartment;
	}

	public void setSubdepartment(String subdepartment) {
		this.subdepartment = subdepartment;
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
	
}
