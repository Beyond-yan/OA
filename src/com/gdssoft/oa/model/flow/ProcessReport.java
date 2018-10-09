package com.gdssoft.oa.model.flow;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */

import java.util.Date;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.gdssoft.core.util.ContextUtil;

/**
 * ProcessReport Base Java Bean, base class for the.oa.model, mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 * 
 */
public class ProcessReport extends com.gdssoft.core.model.BaseModel {

	protected String name;
	protected String creator;
	protected Long creatorid;
	protected String issuedep;
	protected java.util.Date createtime;
	protected String subject;
	protected String shortcontent;
	protected Long defid;
	protected String piid;
	protected Long userid;
	protected String assignee;
	protected Long runid;
	protected Long archivesid;
	protected Long ccuserid;
	protected String datavalue;
	protected String pathA;
	protected String pathB;
	protected String pathC;
	protected String typestr;
	protected Integer runStatus;
	protected Long parentid;

	protected Long parentArchId;
	protected int status;
	

	public ProcessReport(Long defid, Date createtime, Long userid,
			String creator, String issuedep, String subject, String name,
			Long runid, String piid,  String datavalue,Integer runStatus) {
		this.defid = defid;
		this.createtime = createtime;
		this.userid = userid;
		this.creator = creator;
		this.issuedep = issuedep;
		this.subject = subject;
		this.name = name;
		this.runid = runid;
		this.piid=piid;
		this.datavalue = datavalue;
		this.runStatus = runStatus;
//		this.creatorid = creatorid;
//		this.ccuserid = ccuserid;
	}

	

	
	
	public Long getParentid() {
		return parentid;
	}





	public void setParentid(Long parentid) {
		this.parentid = parentid;
	}





	public String getTypestr() {
		typestr = "";
//		System.out.println(this.userid.toString()+"=="+ContextUtil.getCurrentUserId().toString());
//		if (this.userid.toString().equals(ContextUtil.getCurrentUserId().toString())){
//			typestr = "我发起的";
//		}
//		if (this.creatorid.toString().equals(ContextUtil.getCurrentUserId().toString())){
//			typestr += ",我参与的";
//		}
//		if (this.ccuserid.toString().equals(ContextUtil.getCurrentUserId().toString())){
//			typestr += ",抄送给我的";
//		}
//		
//		if (typestr.equals("")){
//			typestr += "其它";
//		}
//		
//		if((",").equals(typestr.substring(0,1))){
//			typestr = typestr.substring(1, typestr.length());
//		}
		return typestr;
	}



	public void setTypestr(String typestr) {
		this.typestr = typestr;
	}



	public Long getParentArchId() {
		return parentArchId;
	}





	public void setParentArchId(Long parentArchId) {
		this.parentArchId = parentArchId;
	}


	public Integer getRunStatus() {
		return runStatus;
	}



	public void setRunStatus(Integer runStatus) {
		this.runStatus = runStatus;
	}



	public String getPathA() {
		return pathA;
	}



	public void setPathA(String pathA) {
		this.pathA = pathA;
	}



	public String getPathB() {
		return pathB;
	}



	public void setPathB(String pathB) {
		this.pathB = pathB;
	}



	public String getPathC() {
		return pathC;
	}



	public void setPathC(String pathC) {
		this.pathC = pathC;
	}



	public String getDatavalue() {
		return datavalue;
	}

	public void setDatavalue(String datavalue) {
		this.datavalue = datavalue;
	}

	public Long getCreatorid() {
		return creatorid;
	}

	public void setCreatorid(Long creatorid) {
		this.creatorid = creatorid;
	}

	public Long getCcuserid() {
		return ccuserid;
	}

	public void setCcuserid(Long ccuserid) {
		this.ccuserid = ccuserid;
	}

	public Long getArchivesid() {
		return archivesid;
	}

	public void setArchivesid(Long archivesid) {
		this.archivesid = archivesid;
	}

	public Long getRunid() {
		return runid;
	}

	public void setRunid(Long runid) {
		this.runid = runid;
	}

	/**
	 * Default Empty Constructor for class ProcessReport
	 */
	public ProcessReport() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class ProcessReport
	 */
	public ProcessReport(Long runid, String assignee) {
		this.setRunid(runid);
		this.setAssignee(assignee);
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="name" type="java.lang.String" length="256"
	 *                     not-null="true" unique="false"
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * Set the name
	 * 
	 * @spring.validator type="required"
	 */
	public void setName(String aValue) {
		this.name = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="creator" type="java.lang.String" length="128"
	 *                     not-null="false" unique="false"
	 */
	public String getCreator() {
		return this.creator;
	}

	/**
	 * Set the creator
	 */
	public void setCreator(String aValue) {
		this.creator = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="issueDep" type="java.lang.String"
	 *                     length="128" not-null="false" unique="false"
	 */
	public String getIssuedep() {
		return this.issuedep;
	}

	/**
	 * Set the issuedep
	 */
	public void setIssuedep(String aValue) {
		this.issuedep = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="createtime" type="java.util.Date" length="23"
	 *                     not-null="true" unique="false"
	 */
	public java.util.Date getCreatetime() {
		return this.createtime;
	}

	/**
	 * Set the createtime
	 * 
	 * @spring.validator type="required"
	 */
	public void setCreatetime(java.util.Date aValue) {
		this.createtime = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="subject" type="java.lang.String" length="256"
	 *                     not-null="true" unique="false"
	 */
	public String getSubject() {
		return this.subject;
	}

	/**
	 * Set the subject
	 * 
	 * @spring.validator type="required"
	 */
	public void setSubject(String aValue) {
		this.subject = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="shortcontent" type="java.lang.String"
	 *                     length="1024" not-null="false" unique="false"
	 */
	public String getShortcontent() {
		return this.shortcontent;
	}

	/**
	 * Set the shortcontent
	 */
	public void setShortcontent(String aValue) {
		this.shortcontent = aValue;
	}


	public int getStatus() {
		return status;
	}





	public void setStatus(int status) {
		this.status = status;
	}





	/**
	 * * @return Long
	 * 
	 * @hibernate.property column="defid" type="java.lang.Long" length="19"
	 *                     not-null="true" unique="false"
	 */
	public Long getDefid() {
		return this.defid;
	}

	/**
	 * Set the defid
	 * 
	 * @spring.validator type="required"
	 */
	public void setDefid(Long aValue) {
		this.defid = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="piid" type="java.lang.String" length="64"
	 *                     not-null="false" unique="false"
	 */
	public String getPiid() {
		return this.piid;
	}

	/**
	 * Set the piid
	 */
	public void setPiid(String aValue) {
		this.piid = aValue;
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.property column="userId" type="java.lang.Long" length="19"
	 *                     not-null="true" unique="false"
	 */
	public Long getUserid() {
		return this.userid;
	}

	/**
	 * Set the userid
	 * 
	 * @spring.validator type="required"
	 */
	public void setUserid(Long aValue) {
		this.userid = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="ASSIGNEE_" type="java.lang.String"
	 *                     length="255" not-null="false" unique="false"
	 */
	public String getAssignee() {
		return this.assignee;
	}

	/**
	 * Set the assignee
	 */
	public void setAssignee(String aValue) {
		this.assignee = aValue;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ProcessReport)) {
			return false;
		}
		ProcessReport rhs = (ProcessReport) object;
		return new EqualsBuilder().append(this.name, rhs.name).append(
				this.creator, rhs.creator).append(this.issuedep, rhs.issuedep)
				.append(this.createtime, rhs.createtime).append(this.subject,
						rhs.subject)
				.append(this.shortcontent, rhs.shortcontent).append(this.defid, rhs.defid).append(
						this.piid, rhs.piid).append(this.userid, rhs.userid)
				.append(this.assignee, rhs.assignee).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.name)
				.append(this.creator).append(this.issuedep).append(
						this.createtime).append(this.subject).append(
						this.shortcontent).append(this.defid)
				.append(this.piid).append(this.userid).append(this.assignee)
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("name", this.name).append(
				"creator", this.creator).append("issuedep", this.issuedep)
				.append("createtime", this.createtime).append("subject",
						this.subject).append("shortcontent", this.shortcontent)
				.append("defid", this.defid).append("piid", this.piid).append(
						"userid", this.userid)
				.append("assignee", this.assignee).toString();
	}

}
