package com.gdssoft.oa.model.duty;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * CqDutySignRecord Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class DutySignRecord extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected java.util.Date signDate;
	protected Long signType;
	protected String description;
	protected Long createUser;
	protected java.util.Date createDate;
	protected com.gdssoft.oa.model.system.AppUser appUser;
	protected String sgDate;
	protected String sgTime;


	/**
	 * Default Empty Constructor for class CqDutySignRecord
	 */
	public DutySignRecord () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class CqDutySignRecord
	 */
	public DutySignRecord (
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
    

	public String getSgDate() {
		return sgDate;
	}

	public void setSgDate(String sgDate) {
		this.sgDate = sgDate;
	}

	public String getSgTime() {
		return sgTime;
	}

	public void setSgTime(String sgTime) {
		this.sgTime = sgTime;
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
	public Long getDutyId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the dutyId
	 */	
	public void setDutyId(Long aValue) {
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
	 * @hibernate.property column="SIGN_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getSignDate() {
		return this.signDate;
	}
	
	/**
	 * Set the signDate
	 */	
	public void setSignDate(java.util.Date aValue) {
		this.signDate = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="SIGN_TYPE" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getSignType() {
		return this.signType;
	}
	
	/**
	 * Set the signType
	 */	
	public void setSignType(Long aValue) {
		this.signType = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DESCRIPTION" type="java.lang.String" length="800" not-null="false" unique="false"
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
	 * 	 * @return Long
	 * @hibernate.property column="CREATE_USER" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getCreateUser() {
		return this.createUser;
	}
	
	/**
	 * Set the createUser
	 */	
	public void setCreateUser(Long aValue) {
		this.createUser = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof DutySignRecord)) {
			return false;
		}
		DutySignRecord rhs = (DutySignRecord) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.signDate, rhs.signDate)
				.append(this.signType, rhs.signType)
				.append(this.description, rhs.description)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
						.append(this.signDate) 
				.append(this.signType) 
				.append(this.description) 
				.append(this.createUser) 
				.append(this.createDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
						.append("signDate", this.signDate) 
				.append("signType", this.signType) 
				.append("description", this.description) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.toString();
	}



}
