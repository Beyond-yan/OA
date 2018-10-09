package com.gdssoft.oa.model.summary;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.text.SimpleDateFormat;
import java.util.Date;

import oracle.sql.DATE;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.model.system.AppUser;
import com.google.gson.annotations.Expose;

/**
 * WorkSummary Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class WorkSummary extends com.gdssoft.core.model.BaseModel {

    protected Long summaryid=0L;
	protected java.util.Date summarydate ;
	protected String summarytype;
	protected String title;
	protected String completestate;
	protected String deptstate;
	protected String trouble;
	protected String jobanalysis;
	protected String jobplan;
	protected String comment;
	protected Long createid=0L;
	protected java.util.Date createtime;
	protected Long lasteditid=0L;
	protected java.util.Date lastedittime;
	protected int yearNo = 0;
	protected int typeNo = 0;
	protected String depname;
	protected int isAuthorized;
	protected com.gdssoft.oa.model.system.Department department;	
	protected AppUser appUser;
	protected AppUser appUser2;	
	protected Long deptid;
	
	public com.gdssoft.oa.model.system.Department getDepartment() {
		return department;
	}
	public void setDepartment(com.gdssoft.oa.model.system.Department department) {
		this.department = department;
	}
	public int getIsAuthorized() {
		return isAuthorized;
	}
	public void setIsAuthorized(int isAuthorized) {
		this.isAuthorized = isAuthorized;
	}
	public String getDepname() {
		return depname;
	}
	public void setDepname(String depname) {
		this.depname = depname;
	}

//	Long userId = ContextUtil.getCurrentUserId();
//	workSummary.setCreateid(userId);
//	workSummary.setLasteditid(userId); 
	public AppUser getAppUser() {
		return appUser;
	} 
	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}
	
	public AppUser getAppUser2() {
		return appUser2;
	}
	public void setAppUser2(AppUser appUser2) {
		this.appUser2 = appUser2;
	}
	/**
	 * Default Empty Constructor for class WorkSummary
	 */
	public WorkSummary () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class WorkSummary
	 */
	public WorkSummary (
		 Long in_summaryid
        ) {
		this.setSummaryid(in_summaryid);
    }

    

	/**
	 * 	 * @return Long
     * @hibernate.id column="summaryid" type="java.lang.Long" generator-class="native"
	 */
	public Long getSummaryid() {
		return this.summaryid;
	}
	
	/**
	 * Set the summaryid
	 */	
	public void setSummaryid(Long aValue) {
		this.summaryid = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="deptid" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getDeptid() {
		return this.getDepartment()==null?null:this.getDepartment().getDepId();
	}
	
	/**
	 * Set the deptid
	 * @spring.validator type="required"
	 */	
	public void setDeptid(Long aValue) {
	    if (aValue==null) {
	    	department = null;
	    } else if (department == null) {
	        department = new com.gdssoft.oa.model.system.Department(aValue);
	        department.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			department.setDepId(aValue);
	    }
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="summarydate" type="java.util.Date" length="23" not-null="true" unique="false"
	 */
	public java.util.Date getSummarydate() {
		//return this.summarydate;
		return summarydate;
	}
	
	/**
	 * Set the summarydate
	 * @spring.validator type="required"
	 */	
	public void setSummarydate(java.util.Date aValue) {
		this.summarydate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="summarytype" type="java.lang.String" length="10" not-null="true" unique="false"
	 */
	public String getSummarytype() {
		return this.summarytype;
	}
	
	/**
	 * Set the summarytype
	 * @spring.validator type="required"
	 */	
	public void setSummarytype(String aValue) {
		this.summarytype = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="title" type="java.lang.String" length="100" not-null="true" unique="false"
	 */
	public String getTitle() {
		return this.title;
	}
	
	/**
	 * Set the title
	 * @spring.validator type="required"
	 */	
	public void setTitle(String aValue) {
		this.title = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="completestate" type="java.lang.String" length="1073741823" not-null="false" unique="false"
	 */
	public String getCompletestate() {
		return this.completestate;
	}
	
	/**
	 * Set the completestate
	 */	
	public void setCompletestate(String aValue) {
		this.completestate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="deptstate" type="java.lang.String" length="1073741823" not-null="false" unique="false"
	 */
	public String getDeptstate() {
		return this.deptstate;
	}
	
	/**
	 * Set the deptstate
	 */	
	public void setDeptstate(String aValue) {
		this.deptstate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="trouble" type="java.lang.String" length="1073741823" not-null="false" unique="false"
	 */
	public String getTrouble() {
		return this.trouble;
	}
	
	/**
	 * Set the trouble
	 */	
	public void setTrouble(String aValue) {
		this.trouble = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="jobanalysis" type="java.lang.String" length="1073741823" not-null="false" unique="false"
	 */
	public String getJobanalysis() {
		return this.jobanalysis;
	}
	
	/**
	 * Set the jobanalysis
	 */	
	public void setJobanalysis(String aValue) {
		this.jobanalysis = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="jobplan" type="java.lang.String" length="1073741823" not-null="false" unique="false"
	 */
	public String getJobplan() {
		return this.jobplan;
	}
	
	/**
	 * Set the jobplan
	 */	
	public void setJobplan(String aValue) {
		this.jobplan = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="comment" type="java.lang.String" length="1073741823" not-null="false" unique="false"
	 */
	public String getComment() {
		return this.comment;
	}
	
	/**
	 * Set the comment
	 */	
	public void setComment(String aValue) {

		this.comment = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="createid" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getCreateid() {
		//return this.createid;
		
		return ContextUtil.getCurrentUserId();
	}
	
	/**
	 * Set the createid
	 * @spring.validator type="required"
	 */	
	public void setCreateid(Long aValue) {
		if (("").equals(aValue) || aValue == null)
		{
			this.createid = ContextUtil.getCurrentUserId();		
		}
		else
		{
			this.createid = aValue;			
		}
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="createtime" type="java.util.Date" length="23" not-null="true" unique="false"
	 */
	public java.util.Date getCreatetime() {
		//return this.createtime;
		return createtime;
	}
	
	/**
	 * Set the createtime
	 * @spring.validator type="required"
	 */	
	public void setCreatetime(java.util.Date aValue) {
		this.createtime = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="lasteditid" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getLasteditid() {
		//return this.lasteditid;		
		return ContextUtil.getCurrentUserId();
	}
	
	/**
	 * Set the lasteditid
	 * @spring.validator type="required"
	 */	
	public void setLasteditid(Long aValue) {
		//this.lasteditid = aValue;
		if (("").equals(aValue) || aValue == null)
		{
			this.lasteditid = ContextUtil.getCurrentUserId();		
		}
		else
		{
			this.lasteditid = aValue;			
		}		
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="lastedittime" type="java.util.Date" length="23" not-null="true" unique="false"
	 */
	public java.util.Date getLastedittime() {
		//return this.lastedittime;
		return lastedittime;
	}
	
	/**
	 * Set the lastedittime
	 * @spring.validator type="required"
	 */	
	public void setLastedittime(java.util.Date aValue) {
		this.lastedittime = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof WorkSummary)) {
			return false;
		}
		WorkSummary rhs = (WorkSummary) object;
		return new EqualsBuilder()
				.append(this.summaryid, rhs.summaryid)
				.append(this.summarydate, rhs.summarydate)
				.append(this.summarytype, rhs.summarytype)
				.append(this.title, rhs.title)
				.append(this.completestate, rhs.completestate)
				.append(this.deptstate, rhs.deptstate)
				.append(this.trouble, rhs.trouble)
				.append(this.jobanalysis, rhs.jobanalysis)
				.append(this.jobplan, rhs.jobplan)
				.append(this.comment, rhs.comment)
				.append(this.createid, rhs.createid)
				.append(this.createtime, rhs.createtime)
				.append(this.lasteditid, rhs.lasteditid)
				.append(this.lastedittime, rhs.lastedittime)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.summaryid) 
				.append(this.summarydate) 
				.append(this.summarytype) 
				.append(this.title) 
				.append(this.completestate) 
				.append(this.deptstate) 
				.append(this.trouble) 
				.append(this.jobanalysis) 
				.append(this.jobplan) 
				.append(this.comment) 
				.append(this.createid) 
				.append(this.createtime) 
				.append(this.lasteditid) 
				.append(this.lastedittime) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("summaryid", this.summaryid) 
				.append("summarydate", this.summarydate) 
				.append("summarytype", this.summarytype) 
				.append("title", this.title) 
				.append("completestate", this.completestate) 
				.append("deptstate", this.deptstate) 
				.append("trouble", this.trouble) 
				.append("jobanalysis", this.jobanalysis) 
				.append("jobplan", this.jobplan) 
				.append("comment", this.comment) 
				.append("createid", this.createid) 
				.append("createtime", this.createtime) 
				.append("lasteditid", this.lasteditid) 
				.append("lastedittime", this.lastedittime) 
				.toString();
	}
	public int getYearNo() {
		return yearNo;
	}
	public void setYearNo(int yearno) {
		this.yearNo = yearno;
	}
	public int getTypeNo() {
		return typeNo;
	}
	public void setTypeNo(int typeno) {
		this.typeNo = typeno;
	}

	/**
	 * 	 * @return Long
	 */
	public Long getUserid() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the userid
	 */	
	public void setUserid(Long aValue) {
	    if (aValue==null) {
	    	appUser = null;
	    } else if (appUser == null) {
	        appUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	        appUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			appUser.setUserId(aValue);
	    }
	}	

}
