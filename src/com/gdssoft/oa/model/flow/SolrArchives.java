package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * TQueryFlowTodolist Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SolrArchives extends com.gdssoft.core.model.BaseModel {


/*收文发文搜索引擎查询字段*/
	protected String archivesname; 
	protected String subject; 
	protected String name; 
	protected String NAME; 
	protected String create; 
	protected String issuserid; 
	protected String assignee; 
	protected String createtime; 
	protected String pretask; 
	protected String dbid; 
	protected String contentformat; 
	protected String defid; 
	protected String archivesid; 
	protected String piId; 
	protected String isSuedep; 
	protected String archivesno; 
	protected String runid; 
	protected String isSuer; 
	protected String popularity;
	protected String depSignNo;
	protected String fullname;
	protected String depname;
	protected int totalCounts;

	public String getArchivesname() {
		return archivesname;
	}

	public void setArchivesname(String archivesname) {
		this.archivesname = archivesname;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNAME() {
		return NAME;
	}

	public void setNAME(String nAME) {
		NAME = nAME;
	}

	public String getCreate() {
		return create;
	}

	public void setCreate(String create) {
		this.create = create;
	}

	public String getIssuserid() {
		return issuserid;
	}

	public void setIssuserid(String issuserid) {
		this.issuserid = issuserid;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	public String getPretask() {
		return pretask;
	}

	public void setPretask(String pretask) {
		this.pretask = pretask;
	}

	public String getDbid() {
		return dbid;
	}

	public void setDbid(String dbid) {
		this.dbid = dbid;
	}

	public String getContentformat() {
		return contentformat;
	}

	public void setContentformat(String contentformat) {
		this.contentformat = contentformat;
	}

	public String getDefid() {
		return defid;
	}

	public void setDefid(String defid) {
		this.defid = defid;
	}

	public String getArchivesid() {
		return archivesid;
	}

	public void setArchivesid(String archivesid) {
		this.archivesid = archivesid;
	}

	public String getPiId() {
		return piId;
	}

	public void setPiId(String piId) {
		this.piId = piId;
	}

	public String getIsSuedep() {
		return isSuedep;
	}

	public void setIsSuedep(String isSuedep) {
		this.isSuedep = isSuedep;
	}

	public String getArchivesno() {
		return archivesno;
	}

	public void setArchivesno(String archivesno) {
		this.archivesno = archivesno;
	}

	public String getRunid() {
		return runid;
	}

	public void setRunid(String runid) {
		this.runid = runid;
	}

	public String getIsSuer() {
		return isSuer;
	}

	public void setIsSuer(String isSuer) {
		this.isSuer = isSuer;
	}

	public String getPopularity() {
		return popularity;
	}

	public void setPopularity(String popularity) {
		this.popularity = popularity;
	}

	public String getDepSignNo() {
		return depSignNo;
	}

	public void setDepSignNo(String depSignNo) {
		this.depSignNo = depSignNo;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public String getDepname() {
		return depname;
	}

	public void setDepname(String depname) {
		this.depname = depname;
	}

	public int getTotalCounts() {
		return totalCounts;
	}

	public void setTotalCounts(int totalCounts) {
		this.totalCounts = totalCounts;
	} 

}
