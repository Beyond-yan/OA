package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysServiceAccount Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysServiceAccount extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String serviceAccount;
	protected String password;
	protected String description;
	protected Long status;
	protected String createUser;
	protected java.util.Date createDate;
	protected String updateUser;
	protected java.util.Date updateDate;

	protected java.util.Set sysInterfaceAccounts = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class SysServiceAccount
	 */
	public SysServiceAccount () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysServiceAccount
	 */
	public SysServiceAccount (
		 Long in_id
        ) {
		this.setId(in_id);
    }


	public java.util.Set getSysInterfaceAccounts () {
		return sysInterfaceAccounts;
	}	
	
	public void setSysInterfaceAccounts (java.util.Set in_sysInterfaceAccounts) {
		this.sysInterfaceAccounts = in_sysInterfaceAccounts;
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
	 * @hibernate.property column="SERVICE_ACCOUNT" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getServiceAccount() {
		return this.serviceAccount;
	}
	
	/**
	 * Set the serviceAccount
	 */	
	public void setServiceAccount(String aValue) {
		this.serviceAccount = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PASSWORD" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getPassword() {
		return this.password;
	}
	
	/**
	 * Set the password
	 */	
	public void setPassword(String aValue) {
		this.password = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DESCRIPTION" type="java.lang.String" length="500" not-null="false" unique="false"
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
	 * @hibernate.property column="STATUS" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getStatus() {
		return this.status;
	}
	
	/**
	 * Set the status
	 */	
	public void setStatus(Long aValue) {
		this.status = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CREATE_USER" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getCreateUser() {
		return this.createUser;
	}
	
	/**
	 * Set the createUser
	 */	
	public void setCreateUser(String aValue) {
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
	 * 	 * @return String
	 * @hibernate.property column="UPDATE_USER" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getUpdateUser() {
		return this.updateUser;
	}
	
	/**
	 * Set the updateUser
	 */	
	public void setUpdateUser(String aValue) {
		this.updateUser = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof SysServiceAccount)) {
			return false;
		}
		SysServiceAccount rhs = (SysServiceAccount) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.serviceAccount, rhs.serviceAccount)
				.append(this.password, rhs.password)
				.append(this.description, rhs.description)
				.append(this.status, rhs.status)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
				.append(this.updateUser, rhs.updateUser)
				.append(this.updateDate, rhs.updateDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.serviceAccount) 
				.append(this.password) 
				.append(this.description) 
				.append(this.status) 
				.append(this.createUser) 
				.append(this.createDate) 
				.append(this.updateUser) 
				.append(this.updateDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("serviceAccount", this.serviceAccount) 
				.append("password", this.password) 
				.append("description", this.description) 
				.append("status", this.status) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.toString();
	}



}
