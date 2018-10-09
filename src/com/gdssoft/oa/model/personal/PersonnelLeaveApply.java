package com.gdssoft.oa.model.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * PersonnelLeaveApply Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class PersonnelLeaveApply extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected Short type;
	protected java.util.Date startDt;
	protected java.util.Date endDt;
	protected java.util.Date backDt;
	protected String description;
	protected String remark;
	protected Short isDeleted;
	protected Long processInsId;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected com.gdssoft.oa.model.system.AppUser appUser;


	/**
	 * Default Empty Constructor for class PersonnelLeaveApply
	 */
	public PersonnelLeaveApply () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class PersonnelLeaveApply
	 */
	public PersonnelLeaveApply (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getId() {
		return this.id;
	}
	
	/**
	 * Set the id
	 */	
	public void setId(Long aValue) {
		this.id = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getApplicantId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the applicantId
	 */	
	public void setApplicantId(Long aValue) {
	    if (aValue==null) {
	    	appUser = null;
	    } else if (appUser == null) {
	        appUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	        appUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			appUser.setUserId(aValue);
	    }
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="TYPE" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getType() {
		return this.type;
	}
	
	/**
	 * Set the type
	 * @spring.validator type="required"
	 */	
	public void setType(Short aValue) {
		this.type = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="START_DT" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getStartDt() {
		return this.startDt;
	}
	
	/**
	 * Set the startDt
	 */	
	public void setStartDt(java.util.Date aValue) {
		this.startDt = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="END_DT" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getEndDt() {
		return this.endDt;
	}
	
	/**
	 * Set the endDt
	 */	
	public void setEndDt(java.util.Date aValue) {
		this.endDt = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="BACK_DT" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getBackDt() {
		return this.backDt;
	}
	
	/**
	 * Set the backDt
	 */	
	public void setBackDt(java.util.Date aValue) {
		this.backDt = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DESCRIPTION" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getDescription() {
		return this.description;
	}
	
	/**
	 * Set the description
	 */	
	public void setDescription(String aValue) {
		this.description = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REMARK" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getRemark() {
		return this.remark;
	}
	
	/**
	 * Set the remark
	 */	
	public void setRemark(String aValue) {
		this.remark = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="IS_DELETED" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsDeleted() {
		return this.isDeleted;
	}
	
	/**
	 * Set the isDeleted
	 * @spring.validator type="required"
	 */	
	public void setIsDeleted(Short aValue) {
		this.isDeleted = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="PROCESS_INS_ID" type="java.lang.Long" length="19" not-null="false" unique="false"
	 */
	public Long getProcessInsId() {
		return this.processInsId;
	}
	
	/**
	 * Set the processInsId
	 */	
	public void setProcessInsId(Long aValue) {
		this.processInsId = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getCreateDate() {
		return this.createDate;
	}
	
	/**
	 * Set the createDate
	 */	
	public void setCreateDate(java.util.Date aValue) {
		this.createDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CREATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getCreateBy() {
		return this.createBy;
	}
	
	/**
	 * Set the createBy
	 */	
	public void setCreateBy(String aValue) {
		this.createBy = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getUpdateDate() {
		return this.updateDate;
	}
	
	/**
	 * Set the updateDate
	 */	
	public void setUpdateDate(java.util.Date aValue) {
		this.updateDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="UPDATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUpdateBy() {
		return this.updateBy;
	}
	
	/**
	 * Set the updateBy
	 */	
	public void setUpdateBy(String aValue) {
		this.updateBy = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof PersonnelLeaveApply)) {
			return false;
		}
		PersonnelLeaveApply rhs = (PersonnelLeaveApply) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.type, rhs.type)
				.append(this.startDt, rhs.startDt)
				.append(this.endDt, rhs.endDt)
				.append(this.backDt, rhs.backDt)
				.append(this.description, rhs.description)
				.append(this.remark, rhs.remark)
				.append(this.isDeleted, rhs.isDeleted)
				.append(this.processInsId, rhs.processInsId)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
						.append(this.type) 
				.append(this.startDt) 
				.append(this.endDt) 
				.append(this.backDt) 
				.append(this.description) 
				.append(this.remark) 
				.append(this.isDeleted) 
				.append(this.processInsId) 
				.append(this.createDate) 
				.append(this.createBy) 
				.append(this.updateDate) 
				.append(this.updateBy) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
						.append("type", this.type) 
				.append("startDt", this.startDt) 
				.append("endDt", this.endDt) 
				.append("backDt", this.backDt) 
				.append("description", this.description) 
				.append("remark", this.remark) 
				.append("isDeleted", this.isDeleted) 
				.append("processInsId", this.processInsId) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}
