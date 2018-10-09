package com.gdssoft.oa.model.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * SysSchemaConfig Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class SysSchemaConfig extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String schemaCode;
	protected String schemaDesc;
	protected String createUser;
	protected java.util.Date createDate;
	protected String updateUser;
	protected java.util.Date updateDate;
	protected com.gdssoft.oa.model.system.SysOaSite sysOaSite;

	protected java.util.Set sysUserAlls = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class SysSchemaConfig
	 */
	public SysSchemaConfig () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SysSchemaConfig
	 */
	public SysSchemaConfig (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.system.SysOaSite getSysOaSite () {
		return sysOaSite;
	}	
	
	public void setSysOaSite (com.gdssoft.oa.model.system.SysOaSite in_sysOaSite) {
		this.sysOaSite = in_sysOaSite;
	}

	public java.util.Set getSysUserAlls () {
		return sysUserAlls;
	}	
	
	public void setSysUserAlls (java.util.Set in_sysUserAlls) {
		this.sysUserAlls = in_sysUserAlls;
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
	 * @hibernate.property column="SCHEMA_CODE" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getSchemaCode() {
		return this.schemaCode;
	}
	
	/**
	 * Set the schemaCode
	 */	
	public void setSchemaCode(String aValue) {
		this.schemaCode = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SCHEMA_DESC" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getSchemaDesc() {
		return this.schemaDesc;
	}
	
	/**
	 * Set the schemaDesc
	 */	
	public void setSchemaDesc(String aValue) {
		this.schemaDesc = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getSiteId() {
		return this.getSysOaSite()==null?null:this.getSysOaSite().getId();
	}
	
	/**
	 * Set the siteId
	 */	
	public void setSiteId(Long aValue) {
	    if (aValue==null) {
	    	sysOaSite = null;
	    } else if (sysOaSite == null) {
	        sysOaSite = new com.gdssoft.oa.model.system.SysOaSite(aValue);
	        sysOaSite.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			sysOaSite.setId(aValue);
	    }
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
		if (!(object instanceof SysSchemaConfig)) {
			return false;
		}
		SysSchemaConfig rhs = (SysSchemaConfig) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.schemaCode, rhs.schemaCode)
				.append(this.schemaDesc, rhs.schemaDesc)
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
				.append(this.schemaCode) 
				.append(this.schemaDesc) 
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
				.append("schemaCode", this.schemaCode) 
				.append("schemaDesc", this.schemaDesc) 
						.append("createUser", this.createUser) 
				.append("createDate", this.createDate) 
				.append("updateUser", this.updateUser) 
				.append("updateDate", this.updateDate) 
				.toString();
	}



}
