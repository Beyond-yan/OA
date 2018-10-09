package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysServiceInterface Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysServiceInterface extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String serviceCode;
	protected String serviceName;
	protected String servicePath;
	protected String serviceDesc;
	protected String createUser;
	protected java.util.Date createDate;
	protected String updateUser;
	protected java.util.Date updateDate;

	protected java.util.Set sysInterfaceAccounts = new java.util.HashSet();
	protected java.util.Set sysServiceAccessLogs = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class SysServiceInterface
	 */
	public SysServiceInterface () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysServiceInterface
	 */
	public SysServiceInterface (
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

	public java.util.Set getSysServiceAccessLogs () {
		return sysServiceAccessLogs;
	}	
	
	public void setSysServiceAccessLogs (java.util.Set in_sysServiceAccessLogs) {
		this.sysServiceAccessLogs = in_sysServiceAccessLogs;
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
	 * @hibernate.property column="SERVICE_CODE" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getServiceCode() {
		return this.serviceCode;
	}
	
	/**
	 * Set the serviceCode
	 */	
	public void setServiceCode(String aValue) {
		this.serviceCode = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SERVICE_NAME" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getServiceName() {
		return this.serviceName;
	}
	
	/**
	 * Set the serviceName
	 */	
	public void setServiceName(String aValue) {
		this.serviceName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SERVICE_PATH" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getServicePath() {
		return this.servicePath;
	}
	
	/**
	 * Set the servicePath
	 */	
	public void setServicePath(String aValue) {
		this.servicePath = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SERVICE_DESC" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getServiceDesc() {
		return this.serviceDesc;
	}
	
	/**
	 * Set the serviceDesc
	 */	
	public void setServiceDesc(String aValue) {
		this.serviceDesc = aValue;
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
		if (!(object instanceof SysServiceInterface)) {
			return false;
		}
		SysServiceInterface rhs = (SysServiceInterface) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.serviceCode, rhs.serviceCode)
				.append(this.serviceName, rhs.serviceName)
				.append(this.servicePath, rhs.servicePath)
				.append(this.serviceDesc, rhs.serviceDesc)
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
				.append(this.serviceCode) 
				.append(this.serviceName) 
				.append(this.servicePath) 
				.append(this.serviceDesc) 
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
				.append("serviceCode", this.serviceCode) 
				.append("serviceName", this.serviceName) 
				.append("servicePath", this.servicePath) 
				.append("serviceDesc", this.serviceDesc) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.toString();
	}



}
