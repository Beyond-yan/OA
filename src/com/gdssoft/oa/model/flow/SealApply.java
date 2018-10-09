package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SealApply Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SealApply extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String sealName;
	protected String oppositeName;
	protected String reason;
	protected Short sealedState;
	protected java.util.Date sealedDate;
	protected Short applyState;
	protected Long processInsId;
	protected com.gdssoft.oa.model.system.AppUser operatorUser;
	protected Long useCount;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected com.gdssoft.oa.model.system.AppUser appUser;
	protected com.gdssoft.oa.model.system.Department department;
	protected com.gdssoft.oa.model.flow.ProcessRun processRun;
	protected java.util.Set sealApplyFiles = new java.util.HashSet();
	/**
	 * Default Empty Constructor for class SealApply
	 */
	public SealApply () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SealApply
	 */
	public SealApply (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	public java.util.Set getSealApplyFiles() {
		return sealApplyFiles;
	}

	public void setSealApplyFiles(java.util.Set sealApplyFiles) {
		this.sealApplyFiles = sealApplyFiles;
	}

	public Long getUseCount() {
		return useCount;
	}

	public void setUseCount(Long useCount) {
		this.useCount = useCount;
	}

	public com.gdssoft.oa.model.system.AppUser getOperatorUser() {
		return operatorUser;
	}

	public void setOperatorUser(com.gdssoft.oa.model.system.AppUser operatorUser) {
		this.operatorUser = operatorUser;
	}

	public com.gdssoft.oa.model.flow.ProcessRun getProcessRun() {
		return processRun;
	}

	public void setProcessRun(com.gdssoft.oa.model.flow.ProcessRun processRun) {
		this.processRun = processRun;
	}

	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}
	
	public com.gdssoft.oa.model.system.Department getDepartment () {
		return department;
	}	
	
	public void setDepartment (com.gdssoft.oa.model.system.Department in_department) {
		this.department = in_department;
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
	public Long getApplyUserId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the applyUserId
	 */	
	public void setApplyUserId(Long aValue) {
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
	 * 	 * @return Long
	 */
	public Long getDepartmentId() {
		return this.getDepartment()==null?null:this.getDepartment().getDepId();
	}
	
	/**
	 * Set the departmentId
	 */	
	public void setDepartmentId(Long aValue) {
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
	 * 	 * @return String
	 * @hibernate.property column="SEAL_NAME" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getSealName() {
		return this.sealName;
	}
	
	/**
	 * Set the sealName
	 */	
	public void setSealName(String aValue) {
		this.sealName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="OPPOSITE_NAME" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getOppositeName() {
		return this.oppositeName;
	}
	
	/**
	 * Set the oppositeName
	 */	
	public void setOppositeName(String aValue) {
		this.oppositeName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REASON" type="java.lang.String" length="300" not-null="false" unique="false"
	 */
	public String getReason() {
		return this.reason;
	}
	
	/**
	 * Set the reason
	 */	
	public void setReason(String aValue) {
		this.reason = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="SEALED_STATE" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getSealedState() {
		return this.sealedState;
	}
	
	/**
	 * Set the sealedState
	 * @spring.validator type="required"
	 */	
	public void setSealedState(Short aValue) {
		this.sealedState = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="SEALED_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getSealedDate() {
		return this.sealedDate;
	}
	
	/**
	 * Set the sealedDate
	 */	
	public void setSealedDate(java.util.Date aValue) {
		this.sealedDate = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="APPLY_STATE" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getApplyState() {
		return this.applyState;
	}
	
	/**
	 * Set the applyState
	 * @spring.validator type="required"
	 */	
	public void setApplyState(Short aValue) {
		this.applyState = aValue;
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
		if (!(object instanceof SealApply)) {
			return false;
		}
		SealApply rhs = (SealApply) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
								.append(this.sealName, rhs.sealName)
				.append(this.oppositeName, rhs.oppositeName)
				.append(this.reason, rhs.reason)
				.append(this.sealedState, rhs.sealedState)
				.append(this.sealedDate, rhs.sealedDate)
				.append(this.applyState, rhs.applyState)
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
								.append(this.sealName) 
				.append(this.oppositeName) 
				.append(this.reason) 
				.append(this.sealedState) 
				.append(this.sealedDate) 
				.append(this.applyState) 
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
								.append("sealName", this.sealName) 
				.append("oppositeName", this.oppositeName) 
				.append("reason", this.reason) 
				.append("sealedState", this.sealedState) 
				.append("sealedDate", this.sealedDate) 
				.append("applyState", this.applyState) 
				.append("processInsId", this.processInsId) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}
