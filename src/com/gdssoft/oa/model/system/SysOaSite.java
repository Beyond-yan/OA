package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysOaSite Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysOaSite extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String siteCode;
	protected String siteName;
	protected Long ownerType;
	protected String createUser;
	protected java.util.Date createDate;
	protected String updateUser;
	protected java.util.Date updateDate;

	protected java.util.Set sysSchemaConfigs = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class SysOaSite
	 */
	public SysOaSite () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysOaSite
	 */
	public SysOaSite (
		 Long in_id
        ) {
		this.setId(in_id);
    }


	public java.util.Set getSysSchemaConfigs () {
		return sysSchemaConfigs;
	}	
	
	public void setSysSchemaConfigs (java.util.Set in_sysSchemaConfigs) {
		this.sysSchemaConfigs = in_sysSchemaConfigs;
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
	 * @hibernate.property column="SITE_CODE" type="java.lang.String" length="20" not-null="false" unique="false"
	 */
	public String getSiteCode() {
		return this.siteCode;
	}
	
	/**
	 * Set the siteCode
	 */	
	public void setSiteCode(String aValue) {
		this.siteCode = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SITE_NAME" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getSiteName() {
		return this.siteName;
	}
	
	/**
	 * Set the siteName
	 */	
	public void setSiteName(String aValue) {
		this.siteName = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="OWNER_TYPE" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getOwnerType() {
		return this.ownerType;
	}
	
	/**
	 * Set the ownerType
	 */	
	public void setOwnerType(Long aValue) {
		this.ownerType = aValue;
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
		if (!(object instanceof SysOaSite)) {
			return false;
		}
		SysOaSite rhs = (SysOaSite) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.siteCode, rhs.siteCode)
				.append(this.siteName, rhs.siteName)
				.append(this.ownerType, rhs.ownerType)
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
				.append(this.siteCode) 
				.append(this.siteName) 
				.append(this.ownerType) 
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
				.append("siteCode", this.siteCode) 
				.append("siteName", this.siteName) 
				.append("ownerType", this.ownerType) 
				.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.toString();
	}



}
