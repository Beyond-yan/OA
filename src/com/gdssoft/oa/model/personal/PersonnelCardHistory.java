package com.gdssoft.oa.model.personal;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * PersonnelCardHistory Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class PersonnelCardHistory extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String empCode;
	protected java.util.Date recordDt;
	protected String readerCode;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected com.gdssoft.oa.model.system.AppUser appUser;


	/**
	 * Default Empty Constructor for class PersonnelCardHistory
	 */
	public PersonnelCardHistory () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class PersonnelCardHistory
	 */
	public PersonnelCardHistory (
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
	 * 	 * @return String
	 * @hibernate.property column="EMP_CODE" type="java.lang.String" length="30" not-null="true" unique="false"
	 */
	public String getEmpCode() {
		return this.empCode;
	}
	
	/**
	 * Set the empCode
	 * @spring.validator type="required"
	 */	
	public void setEmpCode(String aValue) {
		this.empCode = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="RECORD_DT" type="java.util.Date" length="23" not-null="true" unique="false"
	 */
	public java.util.Date getRecordDt() {
		return this.recordDt;
	}
	
	/**
	 * Set the recordDt
	 * @spring.validator type="required"
	 */	
	public void setRecordDt(java.util.Date aValue) {
		this.recordDt = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="READER_CODE" type="java.lang.String" length="30" not-null="false" unique="false"
	 */
	public String getReaderCode() {
		return this.readerCode;
	}
	
	/**
	 * Set the readerCode
	 */	
	public void setReaderCode(String aValue) {
		this.readerCode = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getUserId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the userId
	 */	
	public void setUserId(Long aValue) {
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
		if (!(object instanceof PersonnelCardHistory)) {
			return false;
		}
		PersonnelCardHistory rhs = (PersonnelCardHistory) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.empCode, rhs.empCode)
				.append(this.recordDt, rhs.recordDt)
				.append(this.readerCode, rhs.readerCode)
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
				.append(this.empCode) 
				.append(this.recordDt) 
				.append(this.readerCode) 
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
				.append("empCode", this.empCode) 
				.append("recordDt", this.recordDt) 
				.append("readerCode", this.readerCode) 
						.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}
