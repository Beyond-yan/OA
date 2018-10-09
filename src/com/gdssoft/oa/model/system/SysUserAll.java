package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysUserAll Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysUserAll extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String userName;
	protected String userPassword;
	protected Long status;
	protected String createUser;
	protected java.util.Date createDate;
	protected String updateUser;
	protected java.util.Date updateDate;
	protected com.gdssoft.oa.model.system.SysSchemaConfig sysSchemaConfig;


	/**
	 * Default Empty Constructor for class SysUserAll
	 */
	public SysUserAll () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysUserAll
	 */
	public SysUserAll (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.system.SysSchemaConfig getSysSchemaConfig () {
		return sysSchemaConfig;
	}	
	
	public void setSysSchemaConfig (com.gdssoft.oa.model.system.SysSchemaConfig in_sysSchemaConfig) {
		this.sysSchemaConfig = in_sysSchemaConfig;
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
	 * @hibernate.property column="USER_NAME" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getUserName() {
		return this.userName;
	}
	
	/**
	 * Set the userName
	 */	
	public void setUserName(String aValue) {
		this.userName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="USER_PASSWORD" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getUserPassword() {
		return this.userPassword;
	}
	
	/**
	 * Set the userPassword
	 */	
	public void setUserPassword(String aValue) {
		this.userPassword = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getSchemaId() {
		return this.getSysSchemaConfig()==null?null:this.getSysSchemaConfig().getId();
	}
	
	/**
	 * Set the schemaId
	 */	
	public void setSchemaId(Long aValue) {
	    if (aValue==null) {
	    	sysSchemaConfig = null;
	    } else if (sysSchemaConfig == null) {
	        sysSchemaConfig = new com.gdssoft.oa.model.system.SysSchemaConfig(aValue);
	        sysSchemaConfig.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			sysSchemaConfig.setId(aValue);
	    }
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
		if (!(object instanceof SysUserAll)) {
			return false;
		}
		SysUserAll rhs = (SysUserAll) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.userName, rhs.userName)
				.append(this.userPassword, rhs.userPassword)
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
				.append(this.userName) 
				.append(this.userPassword) 
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
				.append("userName", this.userName) 
				.append("userPassword", this.userPassword) 
						.append("status", this.status) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.toString();
	}



}
